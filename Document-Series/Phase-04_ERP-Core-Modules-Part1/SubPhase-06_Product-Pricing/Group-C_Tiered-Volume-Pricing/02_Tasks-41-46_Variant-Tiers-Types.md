# Tasks 41-46: Variant Tiers & Tier Types

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** C - Tiered & Volume Pricing  
> **Tasks:** 41-46  
> **Purpose:** Create variant-specific tiered pricing with inheritance and tier type calculations

---

## Navigation

- **↑ Parent:** [Group C Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-35-40_TieredPricing-Model.md](01_Tasks-35-40_TieredPricing-Model.md)
- **→ Next:** [03_Tasks-47-52_Admin-Cart-Reports.md](03_Tasks-47-52_Admin-Cart-Reports.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 41 | Create VariantTieredPricing model | Medium | 25 min | Pending |
| 42 | Add tier inheritance logic | Low | 20 min | Pending |
| 43 | Create bulk pricing service | High | 30 min | Pending |
| 44 | Add incremental tier calculation | High | 30 min | Pending |
| 45 | Create all-units tier calculation | Low | 20 min | Pending |
| 46 | Add tier type field | Low | 15 min | Pending |

**Total Estimated Time:** 2h 20min

---

## Task 41: Create VariantTieredPricing Model

### Description
Create VariantTieredPricing model to allow variant-specific tiered pricing that overrides product-level tiers.

### Acceptance Criteria
- [ ] VariantTieredPricing model created with variant FK
- [ ] Inherits from base TieredPricing model fields
- [ ] Same validation as product tiers
- [ ] Unique constraint per variant + quantity range
- [ ] Meta configuration with proper ordering

### File Path
```
backend/apps/products/pricing/models/tiered_pricing.py
```

### Implementation Details

```python
class VariantTieredPricing(models.Model):
    """
    Variant-specific tiered pricing that overrides product-level tiers.
    
    When a variant has its own tiers, the product's tiers are ignored
    for that specific variant. This allows flexible pricing for
    different sizes, colors, etc.
    """
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.CASCADE,
        related_name='tiered_pricing'
    )
    min_quantity = models.PositiveIntegerField(
        help_text="Minimum quantity for this tier"
    )
    max_quantity = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Maximum quantity for this tier (null = unlimited)"
    )
    price_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Price per unit in LKR for this tier"
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Discount percentage from base price"
    )
    is_active = models.BooleanField(default=True)
    
    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pricing_variant_tiered'
        ordering = ['variant', 'min_quantity']
        indexes = [
            models.Index(fields=['variant', 'min_quantity']),
            models.Index(fields=['variant', 'is_active']),
        ]
        constraints = [
            models.CheckConstraint(
                check=Q(min_quantity__gte=1),
                name='variant_tier_min_quantity_gte_1'
            ),
            models.CheckConstraint(
                check=Q(max_quantity__isnull=True) | Q(max_quantity__gte=F('min_quantity')),
                name='variant_tier_max_gte_min'
            ),
            models.UniqueConstraint(
                fields=['variant', 'min_quantity', 'max_quantity'],
                name='unique_variant_tier_range'
            ),
        ]
    
    def __str__(self):
        max_qty = self.max_quantity or '∞'
        return f"{self.variant} - {self.min_quantity}-{max_qty}: LKR {self.price_per_unit}"
    
    def clean(self):
        """Validate tier ranges don't overlap with other variant tiers."""
        super().clean()
        
        # Check for overlapping tiers
        overlapping = VariantTieredPricing.objects.filter(
            variant=self.variant,
            is_active=True
        ).exclude(pk=self.pk)
        
        for tier in overlapping:
            if self._ranges_overlap(tier):
                raise ValidationError({
                    'min_quantity': f'Tier range overlaps with existing tier: {tier}'
                })
    
    def _ranges_overlap(self, other):
        """Check if this tier's range overlaps with another tier."""
        # If either has no max, check if ranges start inside each other
        if self.max_quantity is None and other.max_quantity is None:
            return self.min_quantity == other.min_quantity
        
        if self.max_quantity is None:
            return self.min_quantity <= (other.max_quantity or float('inf'))
        
        if other.max_quantity is None:
            return (self.max_quantity or float('inf')) >= other.min_quantity
        
        # Both have max values
        return (self.min_quantity <= other.max_quantity and 
                self.max_quantity >= other.min_quantity)
```

---

## Task 42: Add Tier Inheritance Logic

### Description
Implement method to retrieve tiers for a variant, falling back to product tiers if no variant-specific tiers exist.

### Acceptance Criteria
- [ ] get_effective_tiers() method on ProductVariant
- [ ] Returns variant tiers if they exist
- [ ] Falls back to product tiers if no variant tiers
- [ ] Returns empty queryset if neither exists
- [ ] Filters by is_active=True

### File Path
```
backend/apps/products/models/product_variant.py
```

### Implementation Details

```python
# Add to ProductVariant model

def get_effective_tiers(self):
    """
    Get tiered pricing for this variant.
    
    Returns variant-specific tiers if they exist, otherwise
    falls back to the product's tiers. This allows flexible
    configuration where most variants share product tiers but
    some variants (like bulk sizes) have custom tiers.
    
    Returns:
        QuerySet: Active tiered pricing rules, ordered by min_quantity
    """
    # Check for variant-specific tiers
    variant_tiers = self.tiered_pricing.filter(is_active=True)
    
    if variant_tiers.exists():
        return variant_tiers
    
    # Fall back to product tiers
    return self.product.tiered_pricing.filter(is_active=True)

def get_tier_for_quantity(self, quantity):
    """
    Get the applicable tier for a given quantity.
    
    Args:
        quantity (int): Quantity to check
        
    Returns:
        TieredPricing or VariantTieredPricing or None
    """
    tiers = self.get_effective_tiers()
    
    for tier in tiers:
        if tier.min_quantity <= quantity:
            if tier.max_quantity is None or quantity <= tier.max_quantity:
                return tier
    
    return None

def get_tiered_price(self, quantity):
    """
    Calculate price for given quantity using tiered pricing.
    
    Args:
        quantity (int): Quantity to price
        
    Returns:
        Decimal: Total price for quantity, or None if no tiers apply
    """
    tier = self.get_tier_for_quantity(quantity)
    if tier:
        return tier.price_per_unit * quantity
    return None
```

---

## Task 43: Create Bulk Pricing Service

### Description
Create BulkPricingService to handle complex tiered pricing calculations with support for different calculation modes.

### Acceptance Criteria
- [ ] BulkPricingService class in services/
- [ ] calculate_tiered_price() method
- [ ] Support for variant or product
- [ ] Handles cases with no tiers (returns base price)
- [ ] Returns breakdown of calculations

### File Path
```
backend/apps/products/pricing/services/bulk_pricing.py (NEW)
```

### Implementation Details

```python
from decimal import Decimal
from typing import Dict, Optional, Union
from django.db.models import QuerySet

from apps.products.models import Product, ProductVariant
from apps.products.pricing.models import TieredPricing, VariantTieredPricing


class BulkPricingService:
    """
    Service for calculating bulk/tiered pricing across products and variants.
    
    Supports two calculation modes:
    - INCREMENTAL: Each tier applies only to units in that tier range
    - ALL_UNITS: The matching tier's price applies to all units
    
    Example INCREMENTAL (1-10 @ 100, 11-50 @ 90, 51+ @ 80):
        25 units = (10 * 100) + (15 * 90) = 2,350
    
    Example ALL_UNITS:
        25 units = 25 * 90 = 2,250
    """
    
    @classmethod
    def calculate_tiered_price(
        cls,
        item: Union[Product, ProductVariant],
        quantity: int,
        tier_type: str = 'ALL_UNITS'
    ) -> Dict:
        """
        Calculate price using tiered pricing.
        
        Args:
            item: Product or ProductVariant instance
            quantity: Quantity to calculate
            tier_type: 'INCREMENTAL' or 'ALL_UNITS'
            
        Returns:
            Dict with:
                - total: Total price
                - unit_price: Effective price per unit
                - base_price: Original unit price
                - discount_amount: Total discount
                - discount_percentage: Effective discount %
                - tiers_applied: List of tiers used
        """
        # Get effective tiers
        if isinstance(item, ProductVariant):
            tiers = item.get_effective_tiers()
            base_price = item.price or item.product.base_price
        else:
            tiers = item.tiered_pricing.filter(is_active=True)
            base_price = item.base_price
        
        if not tiers.exists():
            # No tiers, return base price calculation
            total = base_price * quantity
            return {
                'total': total,
                'unit_price': base_price,
                'base_price': base_price,
                'discount_amount': Decimal('0.00'),
                'discount_percentage': Decimal('0.00'),
                'tiers_applied': [],
            }
        
        # Calculate based on tier type
        if tier_type == 'INCREMENTAL':
            return cls._calculate_incremental(tiers, quantity, base_price)
        else:
            return cls._calculate_all_units(tiers, quantity, base_price)
    
    @classmethod
    def _calculate_incremental(
        cls,
        tiers: QuerySet,
        quantity: int,
        base_price: Decimal
    ) -> Dict:
        """Calculate using incremental (progressive) method."""
        # Implementation in next task
        pass
    
    @classmethod
    def _calculate_all_units(
        cls,
        tiers: QuerySet,
        quantity: int,
        base_price: Decimal
    ) -> Dict:
        """Calculate using all-units method."""
        # Implementation in next task
        pass
    
    @classmethod
    def get_best_price_for_quantity(
        cls,
        item: Union[Product, ProductVariant],
        quantity: int
    ) -> Decimal:
        """
        Get the best available price for a quantity.
        
        Compares tiered pricing with sale pricing and returns the best.
        
        Args:
            item: Product or ProductVariant
            quantity: Quantity to check
            
        Returns:
            Decimal: Best unit price
        """
        # Try tiered pricing
        if isinstance(item, ProductVariant):
            tiers = item.get_effective_tiers()
            tier = item.get_tier_for_quantity(quantity)
        else:
            tiers = item.tiered_pricing.filter(is_active=True)
            tier = None
            for t in tiers:
                if t.min_quantity <= quantity:
                    if t.max_quantity is None or quantity <= t.max_quantity:
                        tier = t
                        break
        
        tier_price = tier.price_per_unit if tier else None
        
        # Compare with regular pricing
        if isinstance(item, ProductVariant):
            regular_price = item.get_effective_price()
        else:
            regular_price = item.get_effective_price()
        
        if tier_price and tier_price < regular_price:
            return tier_price
        
        return regular_price
```

---

## Task 44: Add Incremental Tier Calculation

### Description
Implement incremental (progressive) tier calculation where each tier applies only to units in that tier's range.

### Acceptance Criteria
- [ ] _calculate_incremental() method implemented
- [ ] Each tier applies to units in its range
- [ ] Calculation progresses from lowest to highest tier
- [ ] Returns detailed breakdown
- [ ] Handles unlimited max_quantity tiers

### Implementation Details

```python
# Add to BulkPricingService class

@classmethod
def _calculate_incremental(
    cls,
    tiers: QuerySet,
    quantity: int,
    base_price: Decimal
) -> Dict:
    """
    Calculate using incremental (progressive) tiered pricing.
    
    Each tier applies only to units within that tier's range.
    Example: 1-10 @ 100, 11-50 @ 90, 51+ @ 80
        25 units = (10 * 100) + (15 * 90) = 2,350
    
    Args:
        tiers: QuerySet of tiered pricing rules
        quantity: Total quantity
        base_price: Base price per unit
        
    Returns:
        Dict with calculation breakdown
    """
    total = Decimal('0.00')
    remaining = quantity
    tiers_applied = []
    
    # Process tiers from lowest to highest quantity
    ordered_tiers = tiers.order_by('min_quantity')
    
    for tier in ordered_tiers:
        if remaining <= 0:
            break
        
        # Determine how many units fall in this tier
        tier_start = tier.min_quantity
        tier_end = tier.max_quantity or float('inf')
        
        # Calculate units in this tier
        if quantity < tier_start:
            # Haven't reached this tier yet
            continue
        
        # Units that fall in this tier range
        units_in_tier = min(
            remaining,
            (tier_end - tier_start + 1) if tier.max_quantity else remaining
        )
        
        tier_total = units_in_tier * tier.price_per_unit
        total += tier_total
        remaining -= units_in_tier
        
        tiers_applied.append({
            'tier': str(tier),
            'units': units_in_tier,
            'price_per_unit': tier.price_per_unit,
            'subtotal': tier_total,
        })
    
    # Calculate discount
    base_total = base_price * quantity
    discount_amount = base_total - total
    discount_percentage = (discount_amount / base_total * 100) if base_total else Decimal('0.00')
    
    return {
        'total': total,
        'unit_price': total / quantity,
        'base_price': base_price,
        'discount_amount': discount_amount,
        'discount_percentage': discount_percentage,
        'tiers_applied': tiers_applied,
        'calculation_method': 'INCREMENTAL',
    }
```

---

## Task 45: Create All-Units Tier Calculation

### Description
Implement all-units tier calculation where the matching tier's price applies to all units in the order.

### Acceptance Criteria
- [ ] _calculate_all_units() method implemented
- [ ] Find applicable tier for quantity
- [ ] Apply tier price to all units
- [ ] Returns breakdown
- [ ] Simpler than incremental calculation

### Implementation Details

```python
# Add to BulkPricingService class

@classmethod
def _calculate_all_units(
    cls,
    tiers: QuerySet,
    quantity: int,
    base_price: Decimal
) -> Dict:
    """
    Calculate using all-units tiered pricing.
    
    The tier that matches the quantity applies to ALL units.
    Example: 1-10 @ 100, 11-50 @ 90, 51+ @ 80
        25 units = 25 * 90 = 2,250
    
    This method is simpler and often preferred for B2B pricing.
    
    Args:
        tiers: QuerySet of tiered pricing rules
        quantity: Total quantity
        base_price: Base price per unit
        
    Returns:
        Dict with calculation breakdown
    """
    # Find the applicable tier
    applicable_tier = None
    
    for tier in tiers.order_by('-min_quantity'):
        if quantity >= tier.min_quantity:
            if tier.max_quantity is None or quantity <= tier.max_quantity:
                applicable_tier = tier
                break
    
    if not applicable_tier:
        # No tier applies, use base price
        total = base_price * quantity
        return {
            'total': total,
            'unit_price': base_price,
            'base_price': base_price,
            'discount_amount': Decimal('0.00'),
            'discount_percentage': Decimal('0.00'),
            'tiers_applied': [],
            'calculation_method': 'ALL_UNITS',
        }
    
    # Apply tier price to all units
    total = applicable_tier.price_per_unit * quantity
    
    # Calculate discount
    base_total = base_price * quantity
    discount_amount = base_total - total
    discount_percentage = (discount_amount / base_total * 100) if base_total else Decimal('0.00')
    
    return {
        'total': total,
        'unit_price': applicable_tier.price_per_unit,
        'base_price': base_price,
        'discount_amount': discount_amount,
        'discount_percentage': discount_percentage,
        'tiers_applied': [{
            'tier': str(applicable_tier),
            'units': quantity,
            'price_per_unit': applicable_tier.price_per_unit,
            'subtotal': total,
        }],
        'calculation_method': 'ALL_UNITS',
    }
```

---

## Task 46: Add Tier Type Field

### Description
Add tier_type field to Product and TieredPricing models to specify calculation method (INCREMENTAL vs ALL_UNITS).

### Acceptance Criteria
- [ ] tier_type field added to Product model
- [ ] tier_type choices: INCREMENTAL, ALL_UNITS
- [ ] Default to ALL_UNITS (simpler)
- [ ] Used in BulkPricingService
- [ ] Migration created

### File Paths
```
backend/apps/products/models/product.py
backend/apps/products/pricing/models/tiered_pricing.py
```

### Implementation Details

```python
# In apps/products/models/product.py

# Add to Product model

class Product(TenantAwareModel):
    # ... existing fields ...
    
    class TierType(models.TextChoices):
        INCREMENTAL = 'INCREMENTAL', 'Incremental (Progressive)'
        ALL_UNITS = 'ALL_UNITS', 'All Units (Simple)'
    
    tier_type = models.CharField(
        max_length=20,
        choices=TierType.choices,
        default=TierType.ALL_UNITS,
        help_text="How to calculate tiered pricing: INCREMENTAL (each tier applies to "
                  "units in its range) or ALL_UNITS (single tier price for all units)"
    )
    
    # ... rest of model ...
```

```python
# Update BulkPricingService to use tier_type

@classmethod
def calculate_tiered_price(
    cls,
    item: Union[Product, ProductVariant],
    quantity: int,
    tier_type: Optional[str] = None
) -> Dict:
    """
    Calculate price using tiered pricing.
    
    Args:
        item: Product or ProductVariant instance
        quantity: Quantity to calculate
        tier_type: Override tier type, or None to use item's setting
    """
    # Get effective tiers
    if isinstance(item, ProductVariant):
        tiers = item.get_effective_tiers()
        base_price = item.price or item.product.base_price
        tier_type = tier_type or item.product.tier_type
    else:
        tiers = item.tiered_pricing.filter(is_active=True)
        base_price = item.base_price
        tier_type = tier_type or item.tier_type
    
    if not tiers.exists():
        # No tiers, return base price calculation
        total = base_price * quantity
        return {
            'total': total,
            'unit_price': base_price,
            'base_price': base_price,
            'discount_amount': Decimal('0.00'),
            'discount_percentage': Decimal('0.00'),
            'tiers_applied': [],
        }
    
    # Calculate based on tier type
    if tier_type == 'INCREMENTAL':
        return cls._calculate_incremental(tiers, quantity, base_price)
    else:
        return cls._calculate_all_units(tiers, quantity, base_price)
```

---

## Testing Requirements

### Unit Tests

```python
# tests/test_variant_tiered_pricing.py

def test_variant_tiered_pricing_creation():
    """Test creating variant-specific tiers."""
    pass

def test_tier_inheritance():
    """Test fallback to product tiers when no variant tiers."""
    pass

def test_tier_override():
    """Test variant tiers override product tiers."""
    pass

def test_incremental_calculation():
    """Test incremental tier calculation."""
    # 1-10 @ 100, 11-50 @ 90, 51+ @ 80
    # 25 units should be: (10*100) + (15*90) = 2,350
    pass

def test_all_units_calculation():
    """Test all-units tier calculation."""
    # 1-10 @ 100, 11-50 @ 90, 51+ @ 80
    # 25 units should be: 25*90 = 2,250
    pass

def test_no_tiers_fallback():
    """Test fallback to base price when no tiers."""
    pass

def test_tier_type_field():
    """Test tier_type field influences calculation."""
    pass
```

---

## Documentation

### Admin Notes
- Variant tiers completely override product tiers when present
- INCREMENTAL gives progressive discounts, better for retail
- ALL_UNITS gives simple bulk pricing, better for B2B
- Test both tier types with realistic quantities

### User Guide Snippet
```markdown
## Variant-Specific Tiered Pricing

Some variants may have different bulk pricing than others:

**Example:** T-Shirt Product
- Product Tiers: 1-50 @ 500, 51+ @ 450
- Small Variant: Uses product tiers
- XXL Variant: Custom tiers 1-20 @ 650, 21+ @ 600

**Tier Types:**
- **All Units (Simple):** The tier that matches your quantity applies to all units
  - 25 units at "11-50 @ 90" = 25 × 90 = 2,250
- **Incremental (Progressive):** Each tier applies only to units in its range
  - 25 units = (10 × 100) + (15 × 90) = 2,350
```

---

## Dependencies

### Required Imports
```python
from decimal import Decimal
from typing import Dict, Optional, Union
from django.db.models import QuerySet, Q, F
from django.core.exceptions import ValidationError
```

### External Dependencies
- None

---

## Deployment Checklist

- [ ] Run migrations for tier_type field
- [ ] Update existing products with default tier_type
- [ ] Test both calculation modes in staging
- [ ] Train staff on tier configuration
- [ ] Update API documentation
- [ ] Create example tier configurations

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Implement Admin, Cart, and Reports (Tasks 47-52)
