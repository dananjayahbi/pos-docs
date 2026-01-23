# Tasks 69-73: Price Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** E - Price Serializers & API Views  
> **Tasks:** 69-73  
> **Purpose:** Create DRF serializers for all pricing models with calculated fields

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group D - Scheduled & Promotional Pricing](../Group-D_Scheduled-Promotional-Pricing/)
- **→ Next:** [02_Tasks-74-77_ViewSets-Permissions.md](02_Tasks-74-77_ViewSets-Permissions.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 69 | Create ProductPriceSerializer | Medium | 25 min | Pending |
| 70 | Add price calculation fields | Low | 20 min | Pending |
| 71 | Create VariantPriceSerializer | Medium | 25 min | Pending |
| 72 | Create TieredPricingSerializer | Low | 20 min | Pending |
| 73 | Create ScheduledPriceSerializer | Low | 20 min | Pending |

**Total Estimated Time:** 1h 50min

---

## Task 69: Create ProductPriceSerializer

### Description
Create serializer for Product pricing with LKR formatting and price calculations.

### Acceptance Criteria
- [ ] ProductPriceSerializer class
- [ ] Includes base_price, sale_price, cost
- [ ] LKR currency formatting
- [ ] Read-only calculated fields
- [ ] Nested tax information
- [ ] Validates price relationships

### File Path
```
backend/apps/products/pricing/serializers/product_price.py (NEW)
```

### Implementation Details

```python
from rest_framework import serializers
from decimal import Decimal

from apps.products.models import Product
from apps.products.pricing.services import PriceResolutionService


class ProductPriceSerializer(serializers.ModelSerializer):
    """
    Serializer for Product pricing information.
    
    Includes calculated fields for effective price, discounts,
    and tax calculations. Uses LKR currency formatting.
    """
    
    # Formatted price fields
    base_price_formatted = serializers.SerializerMethodField()
    sale_price_formatted = serializers.SerializerMethodField()
    cost_formatted = serializers.SerializerMethodField()
    
    # Calculated fields (added in Task 70)
    effective_price = serializers.SerializerMethodField()
    effective_price_formatted = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    has_discount = serializers.SerializerMethodField()
    
    # Tax information
    tax_inclusive = serializers.BooleanField(read_only=True)
    
    # Pricing type flags
    has_sale_price = serializers.SerializerMethodField()
    has_scheduled_price = serializers.SerializerMethodField()
    has_tiered_pricing = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'base_price',
            'base_price_formatted',
            'sale_price',
            'sale_price_formatted',
            'cost',
            'cost_formatted',
            'effective_price',
            'effective_price_formatted',
            'discount_amount',
            'discount_percentage',
            'has_discount',
            'tax_inclusive',
            'has_sale_price',
            'has_scheduled_price',
            'has_tiered_pricing',
        ]
        read_only_fields = [
            'effective_price',
            'discount_amount',
            'discount_percentage',
            'has_discount',
        ]
    
    def get_base_price_formatted(self, obj):
        """Format base price in LKR."""
        return f"LKR {obj.base_price:,.2f}"
    
    def get_sale_price_formatted(self, obj):
        """Format sale price in LKR."""
        if obj.sale_price:
            return f"LKR {obj.sale_price:,.2f}"
        return None
    
    def get_cost_formatted(self, obj):
        """Format cost in LKR."""
        if obj.cost:
            return f"LKR {obj.cost:,.2f}"
        return None
    
    def get_effective_price(self, obj):
        """Get effective price considering all pricing rules."""
        # Implementation in Task 70
        result = PriceResolutionService.get_effective_price(obj)
        return result['price']
    
    def get_effective_price_formatted(self, obj):
        """Format effective price in LKR."""
        effective = self.get_effective_price(obj)
        return f"LKR {effective:,.2f}"
    
    def get_discount_amount(self, obj):
        """Calculate discount amount."""
        # Implementation in Task 70
        result = PriceResolutionService.get_effective_price(obj)
        return result['discount_amount']
    
    def get_discount_percentage(self, obj):
        """Calculate discount percentage."""
        # Implementation in Task 70
        result = PriceResolutionService.get_effective_price(obj)
        return result['discount_percentage']
    
    def get_has_discount(self, obj):
        """Check if product has any active discount."""
        return obj.sale_price is not None or obj.scheduled_prices.filter(
            status='ACTIVE'
        ).exists()
    
    def get_has_sale_price(self, obj):
        """Check if product has sale price."""
        return obj.sale_price is not None
    
    def get_has_scheduled_price(self, obj):
        """Check if product has active scheduled price."""
        return obj.scheduled_prices.filter(status='ACTIVE').exists()
    
    def get_has_tiered_pricing(self, obj):
        """Check if product has tiered pricing."""
        return obj.tiered_pricing.filter(is_active=True).exists()
    
    def validate(self, data):
        """Validate price relationships."""
        base_price = data.get('base_price')
        sale_price = data.get('sale_price')
        cost = data.get('cost')
        
        # Sale price should be less than base price
        if sale_price and base_price:
            if sale_price >= base_price:
                raise serializers.ValidationError({
                    'sale_price': 'Sale price must be less than base price.'
                })
        
        # Cost should be less than base price (warning, not error)
        if cost and base_price:
            if cost > base_price:
                # Log warning but don't fail
                pass
        
        return data


class ProductPriceUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating product prices.
    
    Separate from read serializer to control what fields can be updated.
    """
    
    class Meta:
        model = Product
        fields = [
            'base_price',
            'sale_price',
            'cost',
            'tax_inclusive',
        ]
    
    def validate(self, data):
        """Validate price updates."""
        base_price = data.get('base_price', self.instance.base_price)
        sale_price = data.get('sale_price')
        cost = data.get('cost')
        
        # Validate sale price
        if sale_price and sale_price >= base_price:
            raise serializers.ValidationError({
                'sale_price': 'Sale price must be less than base price.'
            })
        
        # Validate cost
        if cost and cost < 0:
            raise serializers.ValidationError({
                'cost': 'Cost cannot be negative.'
            })
        
        return data
```

---

## Task 70: Add Price Calculation Fields

### Description
Add calculated fields to serializers for effective price, discounts, and profit margins.

### Acceptance Criteria
- [ ] effective_price with all rules applied
- [ ] discount_amount calculation
- [ ] discount_percentage calculation
- [ ] profit_margin calculation
- [ ] price_comparison with base
- [ ] Customer context support

### Implementation Details

```python
# Add to ProductPriceSerializer

# Additional calculated fields
profit_margin = serializers.SerializerMethodField()
profit_margin_percentage = serializers.SerializerMethodField()
price_range = serializers.SerializerMethodField()

def get_effective_price(self, obj):
    """
    Get effective price considering all pricing rules.
    
    Checks (in order):
    1. Flash sales
    2. Scheduled prices
    3. Promotional prices
    4. Sale price
    5. Base price
    """
    # Get customer from context if available
    request = self.context.get('request')
    customer = request.user.customer if request and hasattr(request.user, 'customer') else None
    
    # Get quantity from context (default to 1)
    quantity = self.context.get('quantity', 1)
    
    # Resolve price
    result = PriceResolutionService.get_effective_price(
        item=obj,
        customer=customer,
        quantity=quantity
    )
    
    return result['price']

def get_discount_amount(self, obj):
    """Calculate discount from base price."""
    request = self.context.get('request')
    customer = request.user.customer if request and hasattr(request.user, 'customer') else None
    quantity = self.context.get('quantity', 1)
    
    result = PriceResolutionService.get_effective_price(
        item=obj,
        customer=customer,
        quantity=quantity
    )
    
    return result['discount_amount']

def get_discount_percentage(self, obj):
    """Calculate discount percentage."""
    request = self.context.get('request')
    customer = request.user.customer if request and hasattr(request.user, 'customer') else None
    quantity = self.context.get('quantity', 1)
    
    result = PriceResolutionService.get_effective_price(
        item=obj,
        customer=customer,
        quantity=quantity
    )
    
    return round(result['discount_percentage'], 2)

def get_profit_margin(self, obj):
    """Calculate profit margin (price - cost)."""
    if not obj.cost:
        return None
    
    effective = self.get_effective_price(obj)
    return effective - obj.cost

def get_profit_margin_percentage(self, obj):
    """Calculate profit margin percentage."""
    if not obj.cost:
        return None
    
    effective = self.get_effective_price(obj)
    margin = effective - obj.cost
    
    if effective > 0:
        return round((margin / effective) * 100, 2)
    
    return Decimal('0.00')

def get_price_range(self, obj):
    """
    Get price range if tiered pricing exists.
    
    Returns:
        dict: {'min': lowest_tier_price, 'max': base_price}
    """
    if not obj.tiered_pricing.filter(is_active=True).exists():
        return None
    
    tiers = obj.tiered_pricing.filter(is_active=True).order_by('price_per_unit')
    
    if tiers.exists():
        min_price = tiers.first().price_per_unit
        max_price = obj.base_price
        
        return {
            'min': min_price,
            'min_formatted': f"LKR {min_price:,.2f}",
            'max': max_price,
            'max_formatted': f"LKR {max_price:,.2f}",
        }
    
    return None

# Add to Meta.fields
fields = [
    # ... existing fields ...
    'profit_margin',
    'profit_margin_percentage',
    'price_range',
]
```

---

## Task 71: Create VariantPriceSerializer

### Description
Create serializer for ProductVariant pricing with inheritance logic from product prices.

### Acceptance Criteria
- [ ] VariantPriceSerializer class
- [ ] Inherits from product if variant price null
- [ ] Shows inherited vs override status
- [ ] Same calculated fields as product
- [ ] Variant-specific tiered pricing
- [ ] Formatted output

### File Path
```
backend/apps/products/pricing/serializers/variant_price.py (NEW)
```

### Implementation Details

```python
from rest_framework import serializers
from decimal import Decimal

from apps.products.models import ProductVariant
from apps.products.pricing.services import PriceResolutionService


class VariantPriceSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductVariant pricing.
    
    Handles price inheritance from product when variant price is null.
    """
    
    # Price fields
    price_formatted = serializers.SerializerMethodField()
    sale_price_formatted = serializers.SerializerMethodField()
    
    # Inheritance indicators
    inherits_price = serializers.SerializerMethodField()
    inherits_sale_price = serializers.SerializerMethodField()
    inherited_from_product = serializers.SerializerMethodField()
    
    # Calculated fields
    effective_price = serializers.SerializerMethodField()
    effective_price_formatted = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    
    # Pricing type flags
    has_variant_tiered_pricing = serializers.SerializerMethodField()
    has_scheduled_price = serializers.SerializerMethodField()
    
    # Product base prices for reference
    product_base_price = serializers.DecimalField(
        source='product.base_price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_sale_price = serializers.DecimalField(
        source='product.sale_price',
        max_digits=10,
        decimal_places=2,
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = ProductVariant
        fields = [
            'price',
            'price_formatted',
            'sale_price',
            'sale_price_formatted',
            'inherits_price',
            'inherits_sale_price',
            'inherited_from_product',
            'effective_price',
            'effective_price_formatted',
            'discount_amount',
            'discount_percentage',
            'has_variant_tiered_pricing',
            'has_scheduled_price',
            'product_base_price',
            'product_sale_price',
        ]
        read_only_fields = [
            'effective_price',
            'discount_amount',
            'discount_percentage',
        ]
    
    def get_price_formatted(self, obj):
        """Format variant price in LKR."""
        price = obj.price or obj.product.base_price
        return f"LKR {price:,.2f}"
    
    def get_sale_price_formatted(self, obj):
        """Format sale price in LKR."""
        sale_price = obj.sale_price or obj.product.sale_price
        if sale_price:
            return f"LKR {sale_price:,.2f}"
        return None
    
    def get_inherits_price(self, obj):
        """Check if variant inherits base price from product."""
        return obj.price is None
    
    def get_inherits_sale_price(self, obj):
        """Check if variant inherits sale price from product."""
        return obj.sale_price is None and obj.product.sale_price is not None
    
    def get_inherited_from_product(self, obj):
        """Get details of what's inherited."""
        inherited = {}
        
        if obj.price is None:
            inherited['base_price'] = {
                'value': obj.product.base_price,
                'formatted': f"LKR {obj.product.base_price:,.2f}"
            }
        
        if obj.sale_price is None and obj.product.sale_price:
            inherited['sale_price'] = {
                'value': obj.product.sale_price,
                'formatted': f"LKR {obj.product.sale_price:,.2f}"
            }
        
        # Check tiered pricing inheritance
        if not obj.tiered_pricing.filter(is_active=True).exists():
            if obj.product.tiered_pricing.filter(is_active=True).exists():
                inherited['tiered_pricing'] = True
        
        return inherited if inherited else None
    
    def get_effective_price(self, obj):
        """Get effective price for variant."""
        request = self.context.get('request')
        customer = request.user.customer if request and hasattr(request.user, 'customer') else None
        quantity = self.context.get('quantity', 1)
        
        result = PriceResolutionService.get_effective_price(
            item=obj,
            customer=customer,
            quantity=quantity
        )
        
        return result['price']
    
    def get_effective_price_formatted(self, obj):
        """Format effective price in LKR."""
        effective = self.get_effective_price(obj)
        return f"LKR {effective:,.2f}"
    
    def get_discount_amount(self, obj):
        """Calculate discount amount."""
        request = self.context.get('request')
        customer = request.user.customer if request and hasattr(request.user, 'customer') else None
        quantity = self.context.get('quantity', 1)
        
        result = PriceResolutionService.get_effective_price(
            item=obj,
            customer=customer,
            quantity=quantity
        )
        
        return result['discount_amount']
    
    def get_discount_percentage(self, obj):
        """Calculate discount percentage."""
        request = self.context.get('request')
        customer = request.user.customer if request and hasattr(request.user, 'customer') else None
        quantity = self.context.get('quantity', 1)
        
        result = PriceResolutionService.get_effective_price(
            item=obj,
            customer=customer,
            quantity=quantity
        )
        
        return round(result['discount_percentage'], 2)
    
    def get_has_variant_tiered_pricing(self, obj):
        """Check if variant has its own tiered pricing."""
        return obj.tiered_pricing.filter(is_active=True).exists()
    
    def get_has_scheduled_price(self, obj):
        """Check if variant has active scheduled price."""
        return obj.scheduled_prices.filter(status='ACTIVE').exists()
```

---

## Task 72: Create TieredPricingSerializer

### Description
Create serializer for tiered pricing with validation and display helpers.

### Acceptance Criteria
- [ ] TieredPricingSerializer class
- [ ] VariantTieredPricingSerializer class
- [ ] Validates tier ranges
- [ ] Display formatted ranges
- [ ] Savings calculations
- [ ] Bulk serialization for tier lists

### File Path
```
backend/apps/products/pricing/serializers/tiered_pricing.py (NEW)
```

### Implementation Details

```python
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError

from apps.products.pricing.models import TieredPricing, VariantTieredPricing


class TieredPricingSerializer(serializers.ModelSerializer):
    """
    Serializer for product tiered pricing.
    """
    
    # Formatted fields
    price_per_unit_formatted = serializers.SerializerMethodField()
    quantity_range_display = serializers.SerializerMethodField()
    
    # Calculated fields
    savings_vs_base = serializers.SerializerMethodField()
    tier_display = serializers.SerializerMethodField()
    
    # Product reference
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_base_price = serializers.DecimalField(
        source='product.base_price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = TieredPricing
        fields = [
            'id',
            'product',
            'product_name',
            'product_base_price',
            'min_quantity',
            'max_quantity',
            'price_per_unit',
            'price_per_unit_formatted',
            'discount_percentage',
            'quantity_range_display',
            'savings_vs_base',
            'tier_display',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_price_per_unit_formatted(self, obj):
        """Format price in LKR."""
        return f"LKR {obj.price_per_unit:,.2f}"
    
    def get_quantity_range_display(self, obj):
        """Display quantity range."""
        max_qty = obj.max_quantity if obj.max_quantity else '∞'
        return f"{obj.min_quantity} - {max_qty}"
    
    def get_savings_vs_base(self, obj):
        """Calculate savings vs product base price."""
        base_price = obj.product.base_price
        savings_per_unit = base_price - obj.price_per_unit
        savings_percentage = (savings_per_unit / base_price * 100) if base_price else 0
        
        return {
            'amount': savings_per_unit,
            'amount_formatted': f"LKR {savings_per_unit:,.2f}",
            'percentage': round(savings_percentage, 2),
        }
    
    def get_tier_display(self, obj):
        """Get formatted display string."""
        return obj.get_tier_display()
    
    def validate(self, data):
        """Validate tier configuration."""
        min_quantity = data.get('min_quantity')
        max_quantity = data.get('max_quantity')
        
        # Validate min < max
        if max_quantity and min_quantity >= max_quantity:
            raise serializers.ValidationError({
                'max_quantity': 'Maximum quantity must be greater than minimum quantity.'
            })
        
        # Check for overlaps
        product = data.get('product')
        if product:
            try:
                # Create temporary instance for validation
                temp_tier = TieredPricing(
                    product=product,
                    min_quantity=min_quantity,
                    max_quantity=max_quantity,
                    price_per_unit=data.get('price_per_unit'),
                    is_active=data.get('is_active', True)
                )
                
                # Exclude self if updating
                if self.instance:
                    temp_tier.pk = self.instance.pk
                
                temp_tier.clean()
            
            except DjangoValidationError as e:
                raise serializers.ValidationError(e.message_dict)
        
        return data


class VariantTieredPricingSerializer(serializers.ModelSerializer):
    """
    Serializer for variant tiered pricing.
    """
    
    # Formatted fields
    price_per_unit_formatted = serializers.SerializerMethodField()
    quantity_range_display = serializers.SerializerMethodField()
    
    # Calculated fields
    savings_vs_base = serializers.SerializerMethodField()
    
    # Variant reference
    variant_sku = serializers.CharField(source='variant.sku', read_only=True)
    variant_base_price = serializers.SerializerMethodField()
    
    class Meta:
        model = VariantTieredPricing
        fields = [
            'id',
            'variant',
            'variant_sku',
            'variant_base_price',
            'min_quantity',
            'max_quantity',
            'price_per_unit',
            'price_per_unit_formatted',
            'discount_percentage',
            'quantity_range_display',
            'savings_vs_base',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_price_per_unit_formatted(self, obj):
        """Format price in LKR."""
        return f"LKR {obj.price_per_unit:,.2f}"
    
    def get_quantity_range_display(self, obj):
        """Display quantity range."""
        max_qty = obj.max_quantity if obj.max_quantity else '∞'
        return f"{obj.min_quantity} - {max_qty}"
    
    def get_variant_base_price(self, obj):
        """Get variant base price."""
        base_price = obj.variant.price or obj.variant.product.base_price
        return {
            'value': base_price,
            'formatted': f"LKR {base_price:,.2f}"
        }
    
    def get_savings_vs_base(self, obj):
        """Calculate savings vs variant base price."""
        base_price = obj.variant.price or obj.variant.product.base_price
        savings_per_unit = base_price - obj.price_per_unit
        savings_percentage = (savings_per_unit / base_price * 100) if base_price else 0
        
        return {
            'amount': savings_per_unit,
            'amount_formatted': f"LKR {savings_per_unit:,.2f}",
            'percentage': round(savings_percentage, 2),
        }
    
    def validate(self, data):
        """Validate tier configuration."""
        min_quantity = data.get('min_quantity')
        max_quantity = data.get('max_quantity')
        
        if max_quantity and min_quantity >= max_quantity:
            raise serializers.ValidationError({
                'max_quantity': 'Maximum quantity must be greater than minimum quantity.'
            })
        
        return data
```

---

## Task 73: Create ScheduledPriceSerializer

### Description
Create serializer for scheduled prices with datetime handling and status information.

### Acceptance Criteria
- [ ] ScheduledPriceSerializer class
- [ ] FlashSaleSerializer class
- [ ] Datetime formatting
- [ ] Status display
- [ ] Time remaining calculations
- [ ] Urgency indicators for flash sales

### File Path
```
backend/apps/products/pricing/serializers/scheduled_price.py (NEW)
```

### Implementation Details

```python
from rest_framework import serializers
from django.utils import timezone

from apps.products.pricing.models import ScheduledPrice, FlashSale


class ScheduledPriceSerializer(serializers.ModelSerializer):
    """
    Serializer for scheduled prices.
    """
    
    # Formatted fields
    sale_price_formatted = serializers.SerializerMethodField()
    
    # Status fields
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_pending = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    # Time calculations
    time_until_start = serializers.SerializerMethodField()
    time_until_end = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    
    # Product/variant references
    product_name = serializers.CharField(source='product.name', read_only=True, allow_null=True)
    variant_sku = serializers.CharField(source='variant.sku', read_only=True, allow_null=True)
    item_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ScheduledPrice
        fields = [
            'id',
            'product',
            'product_name',
            'variant',
            'variant_sku',
            'item_name',
            'name',
            'description',
            'sale_price',
            'sale_price_formatted',
            'start_datetime',
            'end_datetime',
            'status',
            'status_display',
            'priority',
            'is_active',
            'is_pending',
            'is_expired',
            'time_until_start',
            'time_until_end',
            'duration',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def get_sale_price_formatted(self, obj):
        """Format sale price in LKR."""
        return f"LKR {obj.sale_price:,.2f}"
    
    def get_item_name(self, obj):
        """Get item name (variant or product)."""
        if obj.variant:
            return f"{obj.variant.product.name} - {obj.variant.sku}"
        elif obj.product:
            return obj.product.name
        return None
    
    def get_time_until_start(self, obj):
        """Get time until schedule starts."""
        if obj.is_pending:
            delta = obj.start_datetime - timezone.now()
            return {
                'seconds': int(delta.total_seconds()),
                'display': self._format_timedelta(delta)
            }
        return None
    
    def get_time_until_end(self, obj):
        """Get time until schedule ends."""
        if obj.is_active:
            delta = obj.end_datetime - timezone.now()
            return {
                'seconds': int(delta.total_seconds()),
                'display': self._format_timedelta(delta)
            }
        return None
    
    def get_duration(self, obj):
        """Get total duration of schedule."""
        delta = obj.end_datetime - obj.start_datetime
        return {
            'seconds': int(delta.total_seconds()),
            'display': self._format_timedelta(delta)
        }
    
    def _format_timedelta(self, delta):
        """Format timedelta for display."""
        seconds = int(delta.total_seconds())
        
        if seconds < 0:
            return "Expired"
        
        days = seconds // 86400
        hours = (seconds % 86400) // 3600
        minutes = (seconds % 3600) // 60
        
        if days > 0:
            return f"{days}d {hours}h"
        elif hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"
    
    def validate(self, data):
        """Validate scheduled price."""
        start_datetime = data.get('start_datetime')
        end_datetime = data.get('end_datetime')
        
        if start_datetime and end_datetime:
            if start_datetime >= end_datetime:
                raise serializers.ValidationError({
                    'end_datetime': 'End datetime must be after start datetime.'
                })
        
        # Validate product or variant specified
        product = data.get('product')
        variant = data.get('variant')
        
        if not product and not variant:
            raise serializers.ValidationError(
                'Either product or variant must be specified.'
            )
        
        if product and variant:
            raise serializers.ValidationError(
                'Cannot specify both product and variant.'
            )
        
        return data


class FlashSaleSerializer(ScheduledPriceSerializer):
    """
    Serializer for flash sales (extends ScheduledPriceSerializer).
    """
    
    # Flash sale specific fields
    max_quantity = serializers.IntegerField()
    quantity_sold = serializers.IntegerField(read_only=True)
    quantity_remaining = serializers.IntegerField(read_only=True)
    percent_sold = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    is_sold_out = serializers.BooleanField(read_only=True)
    
    # Urgency indicators
    urgency_level = serializers.CharField(read_only=True)
    urgency_message = serializers.SerializerMethodField()
    time_remaining = serializers.SerializerMethodField()
    
    class Meta(ScheduledPriceSerializer.Meta):
        model = FlashSale
        fields = ScheduledPriceSerializer.Meta.fields + [
            'max_quantity',
            'quantity_sold',
            'quantity_remaining',
            'percent_sold',
            'is_sold_out',
            'urgency_level',
            'urgency_message',
            'time_remaining',
        ]
    
    def get_urgency_message(self, obj):
        """Get urgency message for display."""
        return obj.get_urgency_message()
    
    def get_time_remaining(self, obj):
        """Get time remaining for flash sale."""
        if obj.is_active:
            delta = obj.time_remaining
            return {
                'seconds': int(delta.total_seconds()),
                'display': self._format_timedelta(delta)
            }
        return None
    
    def validate(self, data):
        """Validate flash sale."""
        data = super().validate(data)
        
        # Validate duration (flash sales should be short)
        start = data.get('start_datetime')
        end = data.get('end_datetime')
        
        if start and end:
            duration = end - start
            if duration.days > 3:
                raise serializers.ValidationError({
                    'end_datetime': (
                        'Flash sales should be short-duration (max 3 days). '
                        'Consider using a regular ScheduledPrice instead.'
                    )
                })
        
        return data
```

---

## Testing Requirements

```python
def test_product_price_serializer():
    """Test product price serialization."""
    pass

def test_price_calculation_fields():
    """Test calculated fields in serializer."""
    pass

def test_variant_price_inheritance():
    """Test variant inherits product prices correctly."""
    pass

def test_tiered_pricing_validation():
    """Test tier overlap validation in serializer."""
    pass

def test_scheduled_price_datetime():
    """Test datetime formatting in serializer."""
    pass
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Implement ViewSets & Permissions (Tasks 74-77)
