# Tasks 59-63: Promotional Rules & Effective Price

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** D - Scheduled & Promotional Pricing  
> **Tasks:** 59-63  
> **Purpose:** Implement promotional pricing rules with conditions and price resolution logic

---

## Navigation

- **↑ Parent:** [Group D Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-53-58_ScheduledPrice-FlashSale.md](01_Tasks-53-58_ScheduledPrice-FlashSale.md)
- **→ Next:** [03_Tasks-64-68_Cleanup-Analytics-Tests.md](03_Tasks-64-68_Cleanup-Analytics-Tests.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 59 | Add flash sale quantity tracking | Medium | 25 min | Pending |
| 60 | Create promotional pricing rules | High | 30 min | Pending |
| 61 | Add promotional condition logic | High | 30 min | Pending |
| 62 | Create get_effective_price service | High | 35 min | Pending |
| 63 | Add price priority resolution | Medium | 25 min | Pending |

**Total Estimated Time:** 2h 25min

---

## Task 59: Add Flash Sale Quantity Tracking

### Description
Implement integration between FlashSale quantity tracking and order/cart systems.

### Acceptance Criteria
- [ ] Signal to decrement quantity on order
- [ ] Reserve quantity during checkout
- [ ] Release reservation on checkout failure
- [ ] Prevent overselling
- [ ] Track conversion metrics

### File Path
```
backend/apps/products/pricing/signals.py (UPDATE)
```

### Implementation Details

```python
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.core.cache import cache
import logging

from .models import FlashSale

logger = logging.getLogger(__name__)


@receiver(post_save, sender='orders.OrderLine')
def update_flash_sale_quantity(sender, instance, created, **kwargs):
    """
    Update flash sale quantity when order line is created.
    
    This signal fires when an order line is confirmed (not just in cart).
    """
    if not created:
        return
    
    # Check if this item is in an active flash sale
    if hasattr(instance.variant, 'scheduled_prices'):
        flash_sales = FlashSale.objects.filter(
            variant=instance.variant,
            status=FlashSale.Status.ACTIVE,
            is_sold_out=False
        )
    elif hasattr(instance.product, 'scheduled_prices'):
        flash_sales = FlashSale.objects.filter(
            product=instance.product,
            status=FlashSale.Status.ACTIVE,
            is_sold_out=False
        )
    else:
        return
    
    for flash_sale in flash_sales:
        success = flash_sale.increment_sold(instance.quantity)
        if success:
            logger.info(
                f'Flash sale {flash_sale.name}: sold {instance.quantity}, '
                f'{flash_sale.quantity_remaining} remaining'
            )
        else:
            logger.warning(
                f'Flash sale {flash_sale.name}: could not increment sold '
                f'(would exceed max_quantity)'
            )


class FlashSaleReservation:
    """
    Manage temporary quantity reservations for flash sales.
    
    During checkout, we reserve the quantity to prevent overselling.
    Reservations expire after 10 minutes.
    """
    
    RESERVATION_TIMEOUT = 600  # 10 minutes
    
    @classmethod
    def reserve(cls, flash_sale_id: int, quantity: int, session_id: str) -> bool:
        """
        Reserve quantity for a flash sale.
        
        Args:
            flash_sale_id: FlashSale ID
            quantity: Quantity to reserve
            session_id: User session ID
            
        Returns:
            bool: True if reservation successful
        """
        try:
            flash_sale = FlashSale.objects.get(id=flash_sale_id)
        except FlashSale.DoesNotExist:
            return False
        
        cache_key = f'flash_sale_reserved:{flash_sale_id}'
        
        # Get current reservations
        reserved = cache.get(cache_key, 0)
        available = flash_sale.max_quantity - flash_sale.quantity_sold - reserved
        
        if available >= quantity:
            # Add to reservations
            new_reserved = reserved + quantity
            cache.set(cache_key, new_reserved, cls.RESERVATION_TIMEOUT)
            
            # Track this user's reservation
            user_key = f'flash_sale_reservation:{session_id}:{flash_sale_id}'
            cache.set(user_key, quantity, cls.RESERVATION_TIMEOUT)
            
            logger.info(
                f'Reserved {quantity} for flash sale {flash_sale_id} '
                f'(session {session_id})'
            )
            return True
        
        return False
    
    @classmethod
    def release(cls, flash_sale_id: int, session_id: str):
        """
        Release a reservation.
        
        Called when:
        - Checkout times out
        - User cancels checkout
        - Order is completed (reservation converted to sale)
        """
        cache_key = f'flash_sale_reserved:{flash_sale_id}'
        user_key = f'flash_sale_reservation:{session_id}:{flash_sale_id}'
        
        # Get user's reservation amount
        quantity = cache.get(user_key, 0)
        if quantity:
            # Decrement total reservations
            reserved = cache.get(cache_key, 0)
            new_reserved = max(0, reserved - quantity)
            cache.set(cache_key, new_reserved, cls.RESERVATION_TIMEOUT)
            
            # Clear user's reservation
            cache.delete(user_key)
            
            logger.info(
                f'Released {quantity} for flash sale {flash_sale_id} '
                f'(session {session_id})'
            )
    
    @classmethod
    def get_available(cls, flash_sale_id: int) -> int:
        """
        Get available quantity (considering reservations).
        
        Args:
            flash_sale_id: FlashSale ID
            
        Returns:
            int: Available quantity
        """
        try:
            flash_sale = FlashSale.objects.get(id=flash_sale_id)
        except FlashSale.DoesNotExist:
            return 0
        
        cache_key = f'flash_sale_reserved:{flash_sale_id}'
        reserved = cache.get(cache_key, 0)
        
        return max(
            0,
            flash_sale.max_quantity - flash_sale.quantity_sold - reserved
        )
```

---

## Task 60: Create Promotional Pricing Rules

### Description
Create PromotionalPrice model for complex promotional pricing with discount types and conditions.

### Acceptance Criteria
- [ ] PromotionalPrice model
- [ ] Discount types: PERCENTAGE_OFF, FIXED_OFF, FIXED_PRICE
- [ ] Links to products, categories, customer groups
- [ ] Start/end datetime
- [ ] Priority system
- [ ] Conditions (min_quantity, etc.)

### File Path
```
backend/apps/products/pricing/models/promotional_price.py (NEW)
```

### Implementation Details

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q, F
from decimal import Decimal

from apps.core.models import TenantAwareModel


class PromotionalPrice(TenantAwareModel):
    """
    Flexible promotional pricing with conditions.
    
    More advanced than simple scheduled prices. Supports:
    - Multiple discount types
    - Category-wide promotions
    - Customer group targeting
    - Minimum quantity requirements
    - Stackable promotions (if enabled)
    
    Examples:
    - "20% off all Electronics"
    - "Buy 3+ get 15% off"
    - "VIP customers: 25% off"
    - "LKR 500 off orders over LKR 5,000"
    """
    
    class DiscountType(models.TextChoices):
        PERCENTAGE_OFF = 'PERCENTAGE_OFF', 'Percentage Off'
        FIXED_OFF = 'FIXED_OFF', 'Fixed Amount Off'
        FIXED_PRICE = 'FIXED_PRICE', 'Fixed Price'
    
    name = models.CharField(
        max_length=200,
        help_text="Internal name for this promotion"
    )
    description = models.TextField(
        blank=True,
        help_text="Description shown to customers"
    )
    
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
        help_text="Type of discount to apply"
    )
    
    # Discount value (meaning depends on discount_type)
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text=(
            "For PERCENTAGE_OFF: percentage (0-100). "
            "For FIXED_OFF: amount in LKR. "
            "For FIXED_PRICE: final price in LKR."
        )
    )
    
    # Time constraints
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    
    # Targeting (if all null, applies to all products)
    products = models.ManyToManyField(
        'products.Product',
        blank=True,
        related_name='promotional_prices',
        help_text="Specific products (leave empty for category-wide)"
    )
    categories = models.ManyToManyField(
        'products.Category',
        blank=True,
        related_name='promotional_prices',
        help_text="Apply to all products in these categories"
    )
    customer_groups = models.ManyToManyField(
        'customers.CustomerGroup',
        blank=True,
        related_name='promotional_prices',
        help_text="Limit to specific customer groups (VIP, wholesale, etc.)"
    )
    
    # Conditions (Task 61)
    min_quantity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Minimum quantity required"
    )
    min_order_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Minimum order value in LKR"
    )
    max_discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="Maximum discount amount (cap for percentage discounts)"
    )
    
    # Priority
    priority = models.IntegerField(
        default=0,
        help_text="Priority for overlapping promotions (higher = higher priority)"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_stackable = models.BooleanField(
        default=False,
        help_text="Can this promotion be combined with others?"
    )
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='promotions_created'
    )
    
    class Meta:
        db_table = 'pricing_promotional'
        ordering = ['-priority', '-start_datetime']
        indexes = [
            models.Index(fields=['start_datetime', 'end_datetime']),
            models.Index(fields=['is_active', 'priority']),
        ]
        constraints = [
            models.CheckConstraint(
                check=Q(end_datetime__gt=F('start_datetime')),
                name='promo_end_after_start'
            ),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_discount_type_display()})"
    
    @property
    def is_currently_active(self):
        """Check if promotion is active right now."""
        if not self.is_active:
            return False
        
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime
    
    def applies_to_product(self, product):
        """
        Check if this promotion applies to a specific product.
        
        Args:
            product: Product instance
            
        Returns:
            bool: True if promotion applies
        """
        # If specific products are set, check if product is in list
        if self.products.exists():
            return self.products.filter(id=product.id).exists()
        
        # If categories are set, check if product is in any category
        if self.categories.exists():
            return self.categories.filter(
                id__in=product.categories.values_list('id', flat=True)
            ).exists()
        
        # No targeting = applies to all products
        return True
    
    def applies_to_customer(self, customer):
        """
        Check if this promotion applies to a specific customer.
        
        Args:
            customer: Customer instance or None (guest)
            
        Returns:
            bool: True if promotion applies
        """
        if not self.customer_groups.exists():
            # No customer targeting = applies to all
            return True
        
        if not customer:
            # Guest customer, check if there's a "guest" group
            return False
        
        customer_group_ids = customer.groups.values_list('id', flat=True)
        return self.customer_groups.filter(id__in=customer_group_ids).exists()
    
    def calculate_discounted_price(self, original_price, quantity=1):
        """
        Calculate discounted price based on discount type.
        
        Args:
            original_price: Original price per unit
            quantity: Quantity (for min_quantity check)
            
        Returns:
            Decimal: Discounted price per unit, or None if conditions not met
        """
        # Check conditions (Task 61 will expand this)
        if self.min_quantity and quantity < self.min_quantity:
            return None
        
        if self.discount_type == self.DiscountType.PERCENTAGE_OFF:
            discount_amount = original_price * (self.discount_value / 100)
            
            # Apply max discount cap if set
            if self.max_discount_amount:
                discount_amount = min(discount_amount, self.max_discount_amount)
            
            return max(Decimal('0.00'), original_price - discount_amount)
        
        elif self.discount_type == self.DiscountType.FIXED_OFF:
            discount_amount = min(self.discount_value, original_price)
            return max(Decimal('0.00'), original_price - discount_amount)
        
        elif self.discount_type == self.DiscountType.FIXED_PRICE:
            return self.discount_value
        
        return original_price
    
    def clean(self):
        """Validate promotional price."""
        super().clean()
        
        # Validate datetime range
        if self.start_datetime and self.end_datetime:
            if self.start_datetime >= self.end_datetime:
                raise ValidationError({
                    'end_datetime': 'End datetime must be after start datetime.'
                })
        
        # Validate discount_value based on type
        if self.discount_type == self.DiscountType.PERCENTAGE_OFF:
            if not (0 <= self.discount_value <= 100):
                raise ValidationError({
                    'discount_value': 'Percentage must be between 0 and 100.'
                })
```

---

## Task 61: Add Promotional Condition Logic

### Description
Implement advanced condition checking for promotional prices (cart value, customer attributes, etc.).

### Acceptance Criteria
- [ ] Check min_quantity condition
- [ ] Check min_order_value condition
- [ ] Check customer eligibility
- [ ] Check product eligibility
- [ ] Combine multiple conditions (AND logic)
- [ ] Return detailed reasons when conditions not met

### Implementation Details

```python
# Add to PromotionalPrice model

class PromotionalConditionResult:
    """Result of checking promotional conditions."""
    
    def __init__(self, is_met: bool, reason: str = None):
        self.is_met = is_met
        self.reason = reason or ("Conditions met" if is_met else "Conditions not met")
    
    def __bool__(self):
        return self.is_met


def check_conditions(self, product, customer=None, quantity=1, order_value=None):
    """
    Check if all conditions are met for this promotion.
    
    Args:
        product: Product instance
        customer: Customer instance or None
        quantity: Quantity being purchased
        order_value: Total order value (Decimal) or None
        
    Returns:
        PromotionalConditionResult: Result with is_met and reason
    """
    # Check if promotion is currently active
    if not self.is_currently_active:
        return PromotionalConditionResult(
            False,
            "Promotion is not currently active"
        )
    
    # Check product eligibility
    if not self.applies_to_product(product):
        return PromotionalConditionResult(
            False,
            "Product not eligible for this promotion"
        )
    
    # Check customer eligibility
    if not self.applies_to_customer(customer):
        return PromotionalConditionResult(
            False,
            "Customer not eligible for this promotion"
        )
    
    # Check minimum quantity
    if self.min_quantity and quantity < self.min_quantity:
        return PromotionalConditionResult(
            False,
            f"Minimum quantity {self.min_quantity} required"
        )
    
    # Check minimum order value
    if self.min_order_value and order_value:
        if order_value < self.min_order_value:
            return PromotionalConditionResult(
                False,
                f"Minimum order value LKR {self.min_order_value:,.2f} required"
            )
    
    return PromotionalConditionResult(True)


def get_conditions_display(self):
    """
    Get human-readable conditions for display.
    
    Returns:
        List[str]: List of condition strings
    """
    conditions = []
    
    if self.min_quantity:
        conditions.append(f"Buy {self.min_quantity}+ items")
    
    if self.min_order_value:
        conditions.append(f"Min order: LKR {self.min_order_value:,.2f}")
    
    if self.max_discount_amount:
        conditions.append(f"Max discount: LKR {self.max_discount_amount:,.2f}")
    
    if self.customer_groups.exists():
        groups = ", ".join(self.customer_groups.values_list('name', flat=True))
        conditions.append(f"For: {groups}")
    
    if self.categories.exists():
        cats = ", ".join(self.categories.values_list('name', flat=True))
        conditions.append(f"Categories: {cats}")
    elif self.products.exists():
        count = self.products.count()
        conditions.append(f"Selected products ({count})")
    
    return conditions
```

---

## Task 62: Create get_effective_price Service

### Description
Create comprehensive service to determine the final effective price considering all pricing rules.

### Acceptance Criteria
- [ ] PriceResolutionService class
- [ ] get_effective_price() method
- [ ] Checks all price types in priority order
- [ ] Returns price and reason
- [ ] Handles product and variant
- [ ] Considers customer context

### File Path
```
backend/apps/products/pricing/services/price_resolution.py (NEW)
```

### Implementation Details

```python
from decimal import Decimal
from typing import Dict, Optional, Union
from django.utils import timezone

from apps.products.models import Product, ProductVariant
from ..models import ScheduledPrice, FlashSale, PromotionalPrice


class PriceResolutionService:
    """
    Service for resolving the final effective price.
    
    Priority order:
    1. Flash Sale (if active and in stock)
    2. Scheduled Price (by priority)
    3. Promotional Price (by priority)
    4. Sale Price
    5. Base Price
    
    Considers:
    - Time constraints
    - Quantity requirements
    - Customer eligibility
    - Stock availability (for flash sales)
    """
    
    @classmethod
    def get_effective_price(
        cls,
        item: Union[Product, ProductVariant],
        customer=None,
        quantity: int = 1,
        order_value: Optional[Decimal] = None,
        datetime_to_check=None
    ) -> Dict:
        """
        Get the effective price for an item.
        
        Args:
            item: Product or ProductVariant instance
            customer: Customer instance or None
            quantity: Quantity being purchased
            order_value: Total order value (for min order value promos)
            datetime_to_check: Datetime to check (default: now)
            
        Returns:
            Dict with:
                - price: Effective price per unit
                - price_type: Type of price ('flash_sale', 'scheduled', etc.)
                - reason: Human-readable reason
                - original_price: Base price for comparison
                - discount_amount: Amount saved
                - discount_percentage: Percentage saved
        """
        if datetime_to_check is None:
            datetime_to_check = timezone.now()
        
        # Get base price
        if isinstance(item, ProductVariant):
            base_price = item.price or item.product.base_price
            product = item.product
        else:
            base_price = item.base_price
            product = item
        
        # 1. Check Flash Sales
        flash_sale_price = cls._check_flash_sales(item, datetime_to_check)
        if flash_sale_price:
            return cls._build_result(
                flash_sale_price,
                'flash_sale',
                'Flash Sale Price',
                base_price
            )
        
        # 2. Check Scheduled Prices
        scheduled_price = cls._check_scheduled_prices(item, datetime_to_check)
        if scheduled_price:
            return cls._build_result(
                scheduled_price,
                'scheduled',
                'Scheduled Sale Price',
                base_price
            )
        
        # 3. Check Promotional Prices
        promo_price = cls._check_promotional_prices(
            item,
            product,
            customer,
            quantity,
            order_value,
            base_price,
            datetime_to_check
        )
        if promo_price:
            return cls._build_result(
                promo_price['price'],
                'promotional',
                promo_price['reason'],
                base_price
            )
        
        # 4. Check Sale Price
        if isinstance(item, ProductVariant):
            if item.sale_price:
                return cls._build_result(
                    item.sale_price,
                    'sale',
                    'Sale Price',
                    base_price
                )
            if item.product.sale_price:
                return cls._build_result(
                    item.product.sale_price,
                    'sale',
                    'Product Sale Price',
                    base_price
                )
        else:
            if item.sale_price:
                return cls._build_result(
                    item.sale_price,
                    'sale',
                    'Sale Price',
                    base_price
                )
        
        # 5. Base Price
        return cls._build_result(
            base_price,
            'base',
            'Regular Price',
            base_price
        )
    
    @classmethod
    def _check_flash_sales(cls, item, datetime_to_check):
        """Check for active flash sales."""
        flash_sales = FlashSale.objects.filter(
            status=FlashSale.Status.ACTIVE,
            is_sold_out=False,
            start_datetime__lte=datetime_to_check,
            end_datetime__gte=datetime_to_check
        )
        
        if isinstance(item, ProductVariant):
            flash_sales = flash_sales.filter(
                Q(variant=item) | Q(product=item.product)
            )
        else:
            flash_sales = flash_sales.filter(product=item)
        
        flash_sales = flash_sales.order_by('-priority')
        
        if flash_sales.exists():
            return flash_sales.first().sale_price
        
        return None
    
    @classmethod
    def _check_scheduled_prices(cls, item, datetime_to_check):
        """Check for active scheduled prices."""
        scheduled_prices = ScheduledPrice.objects.filter(
            status=ScheduledPrice.Status.ACTIVE,
            start_datetime__lte=datetime_to_check,
            end_datetime__gte=datetime_to_check
        )
        
        if isinstance(item, ProductVariant):
            scheduled_prices = scheduled_prices.filter(
                Q(variant=item) | Q(product=item.product)
            )
        else:
            scheduled_prices = scheduled_prices.filter(product=item)
        
        # Exclude flash sales (already checked)
        scheduled_prices = scheduled_prices.exclude(
            flashsale__isnull=False
        )
        
        scheduled_prices = scheduled_prices.order_by('-priority')
        
        if scheduled_prices.exists():
            return scheduled_prices.first().sale_price
        
        return None
    
    @classmethod
    def _check_promotional_prices(
        cls,
        item,
        product,
        customer,
        quantity,
        order_value,
        base_price,
        datetime_to_check
    ):
        """Check for applicable promotional prices."""
        promos = PromotionalPrice.objects.filter(
            is_active=True,
            start_datetime__lte=datetime_to_check,
            end_datetime__gte=datetime_to_check
        ).order_by('-priority')
        
        for promo in promos:
            # Check conditions
            condition_result = promo.check_conditions(
                product=product,
                customer=customer,
                quantity=quantity,
                order_value=order_value
            )
            
            if condition_result.is_met:
                discounted_price = promo.calculate_discounted_price(
                    base_price,
                    quantity
                )
                
                if discounted_price and discounted_price < base_price:
                    return {
                        'price': discounted_price,
                        'reason': f"{promo.name} - {promo.description or promo.get_discount_type_display()}"
                    }
        
        return None
    
    @classmethod
    def _build_result(cls, price, price_type, reason, base_price):
        """Build standardized result dictionary."""
        discount_amount = base_price - price
        discount_percentage = (
            (discount_amount / base_price * 100) if base_price else Decimal('0.00')
        )
        
        return {
            'price': price,
            'price_type': price_type,
            'reason': reason,
            'original_price': base_price,
            'discount_amount': max(Decimal('0.00'), discount_amount),
            'discount_percentage': max(Decimal('0.00'), discount_percentage),
        }
```

---

## Task 63: Add Price Priority Resolution

### Description
Document and test priority resolution logic for overlapping pricing rules.

### Acceptance Criteria
- [ ] Clear priority order documented
- [ ] Test cases for all combinations
- [ ] Admin interface shows priority
- [ ] Priority conflict warnings
- [ ] User documentation

### Implementation Details

```python
# Documentation in services/price_resolution.py

"""
PRICE PRIORITY RESOLUTION
========================

When multiple pricing rules could apply, the system uses this priority order:

1. **Flash Sale** (Priority: 100+)
   - Limited quantity, time-sensitive
   - Highest priority to create urgency
   - Auto-deactivates when sold out
   
2. **Scheduled Price** (Priority: 50-99)
   - Time-based sales
   - Priority field allows custom ordering
   - Examples: Weekend sales, holiday promotions
   
3. **Promotional Price** (Priority: 0-49)
   - Condition-based discounts
   - Can target categories, customer groups
   - May be stackable (if enabled)
   
4. **Sale Price**
   - Simple sale price on product/variant
   - No time constraints or conditions
   
5. **Base Price**
   - Default price
   - Always available as fallback

PRIORITY WITHIN SAME TYPE
-------------------------
When multiple rules of the same type apply:
- Higher priority number wins
- If same priority: most recently created wins
- Non-stackable promotions: only highest applies

STACKABLE PROMOTIONS
--------------------
If PromotionalPrice.is_stackable=True:
- Multiple promotions can combine
- Applied in priority order
- Each discount applies to result of previous
- Example: 20% off + LKR 100 off = 
  (1000 * 0.8) - 100 = 700

CUSTOMER-SPECIFIC PRICING
-------------------------
Customer group targeting in PromotionalPrice:
- VIP customers may see different prices
- Wholesale customers get bulk rates
- Retail customers see standard promotions
"""


class PriorityConflictChecker:
    """Helper to identify and report priority conflicts."""
    
    @staticmethod
    def check_schedule_conflicts(tenant_id: int) -> list:
        """
        Find scheduled prices with overlapping times and same priority.
        
        Returns:
            List of conflict dictionaries
        """
        from django.db.models import Q
        
        conflicts = []
        
        schedules = ScheduledPrice.objects.filter(
            tenant_id=tenant_id,
            status__in=['PENDING', 'ACTIVE']
        ).order_by('priority', 'start_datetime')
        
        for i, schedule1 in enumerate(schedules):
            for schedule2 in schedules[i+1:]:
                # Same priority and overlapping times?
                if schedule1.priority == schedule2.priority:
                    # Same item?
                    if (schedule1.product == schedule2.product or
                        schedule1.variant == schedule2.variant):
                        # Overlapping times?
                        if (schedule1.start_datetime < schedule2.end_datetime and
                            schedule1.end_datetime > schedule2.start_datetime):
                            conflicts.append({
                                'schedule1': schedule1,
                                'schedule2': schedule2,
                                'reason': 'Same priority, overlapping times, same item'
                            })
        
        return conflicts
```

---

## Testing Requirements

```python
def test_flash_sale_highest_priority():
    """Flash sale should override all other prices."""
    pass

def test_scheduled_price_priority():
    """Higher priority scheduled price should win."""
    pass

def test_promotional_conditions():
    """Promo with unmet conditions should not apply."""
    pass

def test_customer_group_targeting():
    """VIP customer should see VIP price."""
    pass

def test_stackable_promotions():
    """Multiple stackable promos should combine."""
    pass
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Implement Cleanup, Analytics & Tests (Tasks 64-68)
