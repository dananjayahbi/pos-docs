# Tasks 47-52: Admin, Cart & Reports

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** C - Tiered & Volume Pricing  
> **Tasks:** 47-52  
> **Purpose:** Create admin interfaces, cart integration, and reporting for tiered pricing

---

## Navigation

- **↑ Parent:** [Group C Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [02_Tasks-41-46_Variant-Tiers-Types.md](02_Tasks-41-46_Variant-Tiers-Types.md)
- **→ Next Group:** [Group D - Scheduled & Promotional Pricing](../Group-D_Scheduled-Promotional-Pricing/)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 47 | Create tiered pricing admin | Medium | 25 min | Pending |
| 48 | Add tier copy functionality | Low | 20 min | Pending |
| 49 | Create CartPriceCalculator | High | 35 min | Pending |
| 50 | Add tier threshold display | Low | 20 min | Pending |
| 51 | Create tiered pricing report | Medium | 25 min | Pending |
| 52 | Write tiered pricing tests | High | 30 min | Pending |

**Total Estimated Time:** 2h 35min

---

## Task 47: Create Tiered Pricing Admin

### Description
Create Django admin interfaces for managing tiered pricing rules with inline editing and bulk actions.

### Acceptance Criteria
- [ ] TieredPricingAdmin with inline display
- [ ] VariantTieredPricingAdmin registered
- [ ] Inline on ProductAdmin for product tiers
- [ ] Inline on ProductVariantAdmin for variant tiers
- [ ] List display shows key fields
- [ ] Filters by is_active, product, variant

### File Path
```
backend/apps/products/pricing/admin.py (UPDATE)
```

### Implementation Details

```python
from django.contrib import admin
from django.utils.html import format_html
from .models import TieredPricing, VariantTieredPricing


class TieredPricingInline(admin.TabularInline):
    """Inline for product-level tiered pricing."""
    model = TieredPricing
    extra = 1
    fields = [
        'min_quantity', 
        'max_quantity', 
        'price_per_unit', 
        'discount_percentage',
        'is_active'
    ]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('min_quantity')


class VariantTieredPricingInline(admin.TabularInline):
    """Inline for variant-level tiered pricing."""
    model = VariantTieredPricing
    extra = 1
    fields = [
        'min_quantity',
        'max_quantity',
        'price_per_unit',
        'discount_percentage',
        'is_active'
    ]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.order_by('min_quantity')


@admin.register(TieredPricing)
class TieredPricingAdmin(admin.ModelAdmin):
    """Admin for product tiered pricing."""
    list_display = [
        'product',
        'quantity_range',
        'formatted_price',
        'discount_display',
        'is_active',
        'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['product__name', 'product__sku']
    ordering = ['product', 'min_quantity']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Product', {
            'fields': ('product',)
        }),
        ('Tier Configuration', {
            'fields': (
                'min_quantity',
                'max_quantity',
                'price_per_unit',
                'discount_percentage'
            )
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    def quantity_range(self, obj):
        """Display quantity range."""
        max_qty = obj.max_quantity if obj.max_quantity else '∞'
        return f"{obj.min_quantity} - {max_qty}"
    quantity_range.short_description = 'Quantity Range'
    
    def formatted_price(self, obj):
        """Display formatted price."""
        return format_html(
            '<strong>LKR {:,.2f}</strong>',
            obj.price_per_unit
        )
    formatted_price.short_description = 'Price'
    
    def discount_display(self, obj):
        """Display discount percentage if set."""
        if obj.discount_percentage:
            return format_html(
                '<span style="color: green;">{}%</span>',
                obj.discount_percentage
            )
        return '-'
    discount_display.short_description = 'Discount'
    
    actions = ['activate_tiers', 'deactivate_tiers', 'copy_tiers_to_variants']
    
    def activate_tiers(self, request, queryset):
        """Bulk activate tiers."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} tier(s) activated.')
    activate_tiers.short_description = 'Activate selected tiers'
    
    def deactivate_tiers(self, request, queryset):
        """Bulk deactivate tiers."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} tier(s) deactivated.')
    deactivate_tiers.short_description = 'Deactivate selected tiers'


@admin.register(VariantTieredPricing)
class VariantTieredPricingAdmin(admin.ModelAdmin):
    """Admin for variant tiered pricing."""
    list_display = [
        'variant',
        'quantity_range',
        'formatted_price',
        'discount_display',
        'is_active',
        'created_at'
    ]
    list_filter = ['is_active', 'created_at', 'variant__product']
    search_fields = [
        'variant__sku',
        'variant__product__name'
    ]
    ordering = ['variant', 'min_quantity']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Variant', {
            'fields': ('variant',)
        }),
        ('Tier Configuration', {
            'fields': (
                'min_quantity',
                'max_quantity',
                'price_per_unit',
                'discount_percentage'
            )
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    def quantity_range(self, obj):
        """Display quantity range."""
        max_qty = obj.max_quantity if obj.max_quantity else '∞'
        return f"{obj.min_quantity} - {max_qty}"
    quantity_range.short_description = 'Quantity Range'
    
    def formatted_price(self, obj):
        """Display formatted price."""
        return format_html(
            '<strong>LKR {:,.2f}</strong>',
            obj.price_per_unit
        )
    formatted_price.short_description = 'Price'
    
    def discount_display(self, obj):
        """Display discount percentage if set."""
        if obj.discount_percentage:
            return format_html(
                '<span style="color: green;">{}%</span>',
                obj.discount_percentage
            )
        return '-'
    discount_display.short_description = 'Discount'
    
    actions = ['activate_tiers', 'deactivate_tiers']
    
    def activate_tiers(self, request, queryset):
        """Bulk activate tiers."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} tier(s) activated.')
    activate_tiers.short_description = 'Activate selected tiers'
    
    def deactivate_tiers(self, request, queryset):
        """Bulk deactivate tiers."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} tier(s) deactivated.')
    deactivate_tiers.short_description = 'Deactivate selected tiers'
```

---

## Task 48: Add Tier Copy Functionality

### Description
Implement functionality to copy tiered pricing from products to all variants or between variants.

### Acceptance Criteria
- [ ] copy_tiers_to_variants() admin action
- [ ] Copies product tiers to all variants
- [ ] Option to overwrite existing variant tiers
- [ ] Preserves tier structure
- [ ] Success message with count

### Implementation Details

```python
# Add to TieredPricingAdmin class

def copy_tiers_to_variants(self, request, queryset):
    """
    Copy selected product tiers to all variants of those products.
    
    This action copies the tier structure from products to their variants,
    making it easy to set up variant-specific pricing that starts from
    the product's tier structure.
    """
    from django.contrib import messages
    
    products_processed = set()
    tiers_created = 0
    
    for tier in queryset:
        product = tier.product
        
        # Skip if we've already processed this product
        if product.id in products_processed:
            continue
        
        products_processed.add(product.id)
        
        # Get all active tiers for this product
        product_tiers = TieredPricing.objects.filter(
            product=product,
            is_active=True
        ).order_by('min_quantity')
        
        # Copy to each variant
        for variant in product.variants.all():
            # Delete existing variant tiers
            VariantTieredPricing.objects.filter(variant=variant).delete()
            
            # Create new tiers based on product tiers
            for product_tier in product_tiers:
                VariantTieredPricing.objects.create(
                    variant=variant,
                    min_quantity=product_tier.min_quantity,
                    max_quantity=product_tier.max_quantity,
                    price_per_unit=product_tier.price_per_unit,
                    discount_percentage=product_tier.discount_percentage,
                    is_active=True
                )
                tiers_created += 1
    
    self.message_user(
        request,
        f'Copied tiers from {len(products_processed)} product(s) to their variants. '
        f'{tiers_created} variant tier(s) created.',
        messages.SUCCESS
    )

copy_tiers_to_variants.short_description = 'Copy tiers to product variants'
```

```python
# Utility service for copying tiers

# In services/bulk_pricing.py

@classmethod
def copy_product_tiers_to_variant(
    cls,
    product: Product,
    variant: ProductVariant,
    overwrite: bool = False
) -> int:
    """
    Copy tiered pricing from product to a specific variant.
    
    Args:
        product: Source product
        variant: Target variant
        overwrite: If True, delete existing variant tiers first
        
    Returns:
        int: Number of tiers created
    """
    if overwrite:
        VariantTieredPricing.objects.filter(variant=variant).delete()
    elif VariantTieredPricing.objects.filter(variant=variant).exists():
        # Variant already has tiers and overwrite is False
        return 0
    
    product_tiers = TieredPricing.objects.filter(
        product=product,
        is_active=True
    ).order_by('min_quantity')
    
    tiers_created = 0
    for tier in product_tiers:
        VariantTieredPricing.objects.create(
            variant=variant,
            min_quantity=tier.min_quantity,
            max_quantity=tier.max_quantity,
            price_per_unit=tier.price_per_unit,
            discount_percentage=tier.discount_percentage,
            is_active=True
        )
        tiers_created += 1
    
    return tiers_created
```

---

## Task 49: Create CartPriceCalculator

### Description
Create CartPriceCalculator service to calculate cart totals with tiered pricing applied to cart items.

### Acceptance Criteria
- [ ] CartPriceCalculator class in services/
- [ ] calculate_cart_total() method
- [ ] Groups items by product/variant
- [ ] Applies tiered pricing per item group
- [ ] Returns detailed breakdown
- [ ] Handles mixed cart (some items with tiers, some without)

### File Path
```
backend/apps/products/pricing/services/cart_calculator.py (NEW)
```

### Implementation Details

```python
from decimal import Decimal
from typing import Dict, List
from collections import defaultdict

from .bulk_pricing import BulkPricingService


class CartPriceCalculator:
    """
    Calculate cart totals with tiered pricing.
    
    Groups cart items by product/variant and applies bulk pricing
    based on total quantity per item. This allows customers to benefit
    from bulk discounts even when the same item appears multiple times
    in the cart.
    """
    
    @classmethod
    def calculate_cart_total(cls, cart_items: List[Dict]) -> Dict:
        """
        Calculate total for cart items with tiered pricing.
        
        Args:
            cart_items: List of dicts with:
                - item: Product or ProductVariant instance
                - quantity: int
                - line_id: Optional unique identifier
                
        Returns:
            Dict with:
                - subtotal: Total before tax
                - line_items: List of line item calculations
                - total_savings: Total discount from tiered pricing
                - items_with_tiers: Count of items using tiered pricing
        """
        # Group items by product/variant
        grouped_items = cls._group_cart_items(cart_items)
        
        line_items = []
        subtotal = Decimal('0.00')
        total_savings = Decimal('0.00')
        items_with_tiers = 0
        
        # Calculate price for each group
        for item_key, item_data in grouped_items.items():
            item = item_data['item']
            total_quantity = item_data['total_quantity']
            line_ids = item_data['line_ids']
            
            # Calculate tiered price
            pricing_result = BulkPricingService.calculate_tiered_price(
                item=item,
                quantity=total_quantity
            )
            
            line_total = pricing_result['total']
            subtotal += line_total
            
            if pricing_result['tiers_applied']:
                items_with_tiers += 1
                total_savings += pricing_result['discount_amount']
            
            line_items.append({
                'item': item,
                'quantity': total_quantity,
                'line_ids': line_ids,
                'unit_price': pricing_result['unit_price'],
                'line_total': line_total,
                'discount_amount': pricing_result['discount_amount'],
                'tiers_applied': pricing_result['tiers_applied'],
            })
        
        return {
            'subtotal': subtotal,
            'line_items': line_items,
            'total_savings': total_savings,
            'items_with_tiers': items_with_tiers,
            'total_items': len(line_items),
        }
    
    @classmethod
    def _group_cart_items(cls, cart_items: List[Dict]) -> Dict:
        """
        Group cart items by product/variant.
        
        Multiple cart lines with the same item are grouped together
        so tiered pricing can be applied to the combined quantity.
        """
        grouped = defaultdict(lambda: {
            'item': None,
            'total_quantity': 0,
            'line_ids': []
        })
        
        for cart_item in cart_items:
            item = cart_item['item']
            quantity = cart_item['quantity']
            line_id = cart_item.get('line_id')
            
            # Create unique key for this item
            item_key = f"{item.__class__.__name__}_{item.id}"
            
            grouped[item_key]['item'] = item
            grouped[item_key]['total_quantity'] += quantity
            if line_id:
                grouped[item_key]['line_ids'].append(line_id)
        
        return grouped
    
    @classmethod
    def get_tier_preview(cls, item, current_quantity: int) -> Dict:
        """
        Get preview of next tier threshold and potential savings.
        
        Args:
            item: Product or ProductVariant
            current_quantity: Current cart quantity
            
        Returns:
            Dict with:
                - next_tier: Next tier object or None
                - units_to_next_tier: Units needed to reach next tier
                - potential_savings: Additional savings at next tier
                - current_tier: Current tier or None
        """
        from apps.products.models import ProductVariant
        
        if isinstance(item, ProductVariant):
            tiers = item.get_effective_tiers()
        else:
            tiers = item.tiered_pricing.filter(is_active=True)
        
        if not tiers.exists():
            return {
                'next_tier': None,
                'units_to_next_tier': None,
                'potential_savings': Decimal('0.00'),
                'current_tier': None,
            }
        
        # Find current tier
        current_tier = None
        for tier in tiers.order_by('min_quantity'):
            if tier.min_quantity <= current_quantity:
                if tier.max_quantity is None or current_quantity <= tier.max_quantity:
                    current_tier = tier
        
        # Find next tier
        next_tier = None
        for tier in tiers.order_by('min_quantity'):
            if tier.min_quantity > current_quantity:
                next_tier = tier
                break
        
        if not next_tier:
            return {
                'next_tier': None,
                'units_to_next_tier': None,
                'potential_savings': Decimal('0.00'),
                'current_tier': current_tier,
            }
        
        # Calculate potential savings
        units_to_next = next_tier.min_quantity - current_quantity
        
        # Calculate savings at next tier
        current_price = BulkPricingService.calculate_tiered_price(
            item, current_quantity
        )
        next_tier_price = BulkPricingService.calculate_tiered_price(
            item, next_tier.min_quantity
        )
        
        potential_savings = (
            current_price['unit_price'] - next_tier_price['unit_price']
        ) * next_tier.min_quantity
        
        return {
            'next_tier': next_tier,
            'units_to_next_tier': units_to_next,
            'potential_savings': potential_savings,
            'current_tier': current_tier,
        }
```

---

## Task 50: Add Tier Threshold Display

### Description
Create helper methods to display tier thresholds and "buy more, save more" messages.

### Acceptance Criteria
- [ ] get_tier_display() method
- [ ] Formats tier ranges nicely
- [ ] Shows savings vs base price
- [ ] get_next_tier_message() for UI prompts
- [ ] Encourages customers to reach next tier

### Implementation Details

```python
# Add to TieredPricing model

def get_tier_display(self):
    """
    Get formatted display string for this tier.
    
    Returns:
        str: Formatted tier display like "Buy 10-50 @ LKR 90 (10% off)"
    """
    max_qty = self.max_quantity if self.max_quantity else '∞'
    
    display = f"Buy {self.min_quantity}-{max_qty} @ LKR {self.price_per_unit:,.2f}"
    
    if self.discount_percentage:
        display += f" ({self.discount_percentage}% off)"
    
    return display

def get_savings_vs_base(self, base_price):
    """
    Calculate savings vs base price.
    
    Args:
        base_price: Base price per unit
        
    Returns:
        Dict with savings_per_unit and savings_percentage
    """
    savings_per_unit = base_price - self.price_per_unit
    savings_percentage = (savings_per_unit / base_price * 100) if base_price else 0
    
    return {
        'savings_per_unit': savings_per_unit,
        'savings_percentage': savings_percentage,
    }
```

```python
# Utility for generating UI messages

# In services/tier_display.py (NEW)

class TierDisplayHelper:
    """Helper for displaying tier information in UI."""
    
    @staticmethod
    def get_all_tiers_display(item) -> List[str]:
        """
        Get display strings for all tiers.
        
        Args:
            item: Product or ProductVariant
            
        Returns:
            List of formatted tier strings
        """
        from apps.products.models import ProductVariant
        
        if isinstance(item, ProductVariant):
            tiers = item.get_effective_tiers()
            base_price = item.price or item.product.base_price
        else:
            tiers = item.tiered_pricing.filter(is_active=True)
            base_price = item.base_price
        
        displays = []
        for tier in tiers:
            max_qty = tier.max_quantity if tier.max_quantity else '∞'
            savings = base_price - tier.price_per_unit
            savings_pct = (savings / base_price * 100) if base_price else 0
            
            displays.append(
                f"Buy {tier.min_quantity}-{max_qty}: "
                f"LKR {tier.price_per_unit:,.2f} "
                f"(Save {savings_pct:.1f}%)"
            )
        
        return displays
    
    @staticmethod
    def get_next_tier_message(item, current_quantity: int) -> str:
        """
        Get message encouraging customer to reach next tier.
        
        Args:
            item: Product or ProductVariant
            current_quantity: Current cart quantity
            
        Returns:
            str: Message like "Buy 5 more to save an additional LKR 50!"
        """
        preview = CartPriceCalculator.get_tier_preview(item, current_quantity)
        
        if not preview['next_tier']:
            return ""
        
        units_needed = preview['units_to_next_tier']
        savings = preview['potential_savings']
        
        return (
            f"Buy {units_needed} more to save an additional "
            f"LKR {savings:,.2f}!"
        )
    
    @staticmethod
    def get_tier_badge_html(tier, base_price) -> str:
        """
        Get HTML badge for tier display.
        
        Args:
            tier: TieredPricing instance
            base_price: Base price for comparison
            
        Returns:
            str: HTML string for badge
        """
        savings = tier.get_savings_vs_base(base_price)
        
        max_qty = tier.max_quantity if tier.max_quantity else '∞'
        
        return (
            f'<span class="tier-badge">'
            f'<span class="tier-range">{tier.min_quantity}-{max_qty}</span>'
            f'<span class="tier-price">LKR {tier.price_per_unit:,.2f}</span>'
            f'<span class="tier-savings">Save {savings["savings_percentage"]:.0f}%</span>'
            f'</span>'
        )
```

---

## Task 51: Create Tiered Pricing Report

### Description
Create management command and report to analyze tiered pricing usage and effectiveness.

### Acceptance Criteria
- [ ] generate_tiered_pricing_report command
- [ ] Shows products with tiers
- [ ] Shows tier usage statistics
- [ ] Identifies unused tiers
- [ ] Revenue impact analysis
- [ ] Export to CSV option

### File Path
```
backend/apps/products/pricing/management/commands/generate_tiered_pricing_report.py (NEW)
```

### Implementation Details

```python
from django.core.management.base import BaseCommand
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from decimal import Decimal
import csv

from apps.products.models import Product, ProductVariant
from apps.products.pricing.models import TieredPricing, VariantTieredPricing


class Command(BaseCommand):
    help = 'Generate tiered pricing usage report'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            help='Output CSV file path',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=30,
            help='Days to analyze (default: 30)',
        )
    
    def handle(self, *args, **options):
        days = options['days']
        output_file = options.get('output')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Generating tiered pricing report for last {days} days...'
            )
        )
        
        report_data = self.generate_report(days)
        
        # Display report
        self.display_report(report_data)
        
        # Export to CSV if requested
        if output_file:
            self.export_to_csv(report_data, output_file)
            self.stdout.write(
                self.style.SUCCESS(f'Report exported to {output_file}')
            )
    
    def generate_report(self, days):
        """Generate report data."""
        # Products with tiered pricing
        products_with_tiers = Product.objects.filter(
            tiered_pricing__isnull=False
        ).distinct().count()
        
        # Variants with tiered pricing
        variants_with_tiers = ProductVariant.objects.filter(
            tiered_pricing__isnull=False
        ).distinct().count()
        
        # Total tiers
        total_product_tiers = TieredPricing.objects.filter(
            is_active=True
        ).count()
        
        total_variant_tiers = VariantTieredPricing.objects.filter(
            is_active=True
        ).count()
        
        # Tier type breakdown
        incremental_products = Product.objects.filter(
            tier_type='INCREMENTAL'
        ).count()
        
        all_units_products = Product.objects.filter(
            tier_type='ALL_UNITS'
        ).count()
        
        # Average tiers per product
        avg_tiers = TieredPricing.objects.filter(
            is_active=True
        ).values('product').annotate(
            tier_count=Count('id')
        ).aggregate(avg=Avg('tier_count'))['avg'] or 0
        
        return {
            'products_with_tiers': products_with_tiers,
            'variants_with_tiers': variants_with_tiers,
            'total_product_tiers': total_product_tiers,
            'total_variant_tiers': total_variant_tiers,
            'incremental_products': incremental_products,
            'all_units_products': all_units_products,
            'avg_tiers_per_product': avg_tiers,
            'generated_at': timezone.now(),
        }
    
    def display_report(self, data):
        """Display report in terminal."""
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('TIERED PRICING REPORT'))
        self.stdout.write('='*50 + '\n')
        
        self.stdout.write(f"Products with tiers: {data['products_with_tiers']}")
        self.stdout.write(f"Variants with tiers: {data['variants_with_tiers']}")
        self.stdout.write(f"Total product tiers: {data['total_product_tiers']}")
        self.stdout.write(f"Total variant tiers: {data['total_variant_tiers']}")
        
        self.stdout.write(f"\nTier Type Distribution:")
        self.stdout.write(f"  Incremental: {data['incremental_products']}")
        self.stdout.write(f"  All Units: {data['all_units_products']}")
        
        self.stdout.write(
            f"\nAvg tiers per product: {data['avg_tiers_per_product']:.2f}"
        )
        
        self.stdout.write(f"\nGenerated: {data['generated_at']}\n")
        self.stdout.write('='*50 + '\n')
    
    def export_to_csv(self, data, filepath):
        """Export report to CSV."""
        with open(filepath, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Metric', 'Value'])
            
            for key, value in data.items():
                if key != 'generated_at':
                    writer.writerow([key, value])
```

---

## Task 52: Write Tiered Pricing Tests

### Description
Create comprehensive test suite for tiered pricing functionality.

### Acceptance Criteria
- [ ] Test tier creation and validation
- [ ] Test tier inheritance
- [ ] Test incremental calculation
- [ ] Test all-units calculation
- [ ] Test cart calculator
- [ ] Test tier copy functionality
- [ ] 90%+ code coverage

### File Path
```
backend/apps/products/pricing/tests/test_tiered_pricing.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError

from apps.products.models import Product, ProductVariant
from apps.products.pricing.models import TieredPricing, VariantTieredPricing
from apps.products.pricing.services import BulkPricingService, CartPriceCalculator


@pytest.mark.django_db
class TestTieredPricingModel:
    """Test TieredPricing model."""
    
    def test_create_tiered_pricing(self, product):
        """Test creating tiered pricing."""
        tier = TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('90.00'),
            discount_percentage=Decimal('10.00')
        )
        
        assert tier.product == product
        assert tier.min_quantity == 10
        assert tier.max_quantity == 50
        assert tier.price_per_unit == Decimal('90.00')
        assert tier.is_active is True
    
    def test_tier_validation_min_max(self, product):
        """Test min_quantity must be less than max_quantity."""
        tier = TieredPricing(
            product=product,
            min_quantity=50,
            max_quantity=10,
            price_per_unit=Decimal('90.00')
        )
        
        with pytest.raises(ValidationError):
            tier.full_clean()
    
    def test_tier_overlap_validation(self, product):
        """Test overlapping tiers are not allowed."""
        TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('90.00')
        )
        
        overlapping_tier = TieredPricing(
            product=product,
            min_quantity=30,
            max_quantity=70,
            price_per_unit=Decimal('80.00')
        )
        
        with pytest.raises(ValidationError):
            overlapping_tier.full_clean()
    
    def test_tier_display(self, product):
        """Test tier display string."""
        tier = TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('90.00'),
            discount_percentage=Decimal('10.00')
        )
        
        display = tier.get_tier_display()
        assert '10-50' in display
        assert 'LKR 90' in display
        assert '10%' in display


@pytest.mark.django_db
class TestVariantTierInheritance:
    """Test variant tier inheritance."""
    
    def test_variant_inherits_product_tiers(self, product_with_variant):
        """Test variant uses product tiers when it has none."""
        product, variant = product_with_variant
        
        TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('90.00')
        )
        
        tiers = variant.get_effective_tiers()
        assert tiers.count() == 1
        assert tiers.first().product == product
    
    def test_variant_overrides_product_tiers(self, product_with_variant):
        """Test variant tiers override product tiers."""
        product, variant = product_with_variant
        
        TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('90.00')
        )
        
        VariantTieredPricing.objects.create(
            variant=variant,
            min_quantity=10,
            max_quantity=50,
            price_per_unit=Decimal('85.00')
        )
        
        tiers = variant.get_effective_tiers()
        assert tiers.count() == 1
        assert tiers.first().price_per_unit == Decimal('85.00')


@pytest.mark.django_db
class TestBulkPricingCalculations:
    """Test bulk pricing calculation methods."""
    
    def test_incremental_calculation(self, product):
        """Test incremental tier calculation."""
        product.base_price = Decimal('100.00')
        product.tier_type = 'INCREMENTAL'
        product.save()
        
        TieredPricing.objects.create(
            product=product,
            min_quantity=1,
            max_quantity=10,
            price_per_unit=Decimal('100.00')
        )
        TieredPricing.objects.create(
            product=product,
            min_quantity=11,
            max_quantity=50,
            price_per_unit=Decimal('90.00')
        )
        
        result = BulkPricingService.calculate_tiered_price(
            product, 25, tier_type='INCREMENTAL'
        )
        
        # (10 * 100) + (15 * 90) = 2,350
        assert result['total'] == Decimal('2350.00')
        assert len(result['tiers_applied']) == 2
    
    def test_all_units_calculation(self, product):
        """Test all-units tier calculation."""
        product.base_price = Decimal('100.00')
        product.tier_type = 'ALL_UNITS'
        product.save()
        
        TieredPricing.objects.create(
            product=product,
            min_quantity=1,
            max_quantity=10,
            price_per_unit=Decimal('100.00')
        )
        TieredPricing.objects.create(
            product=product,
            min_quantity=11,
            max_quantity=50,
            price_per_unit=Decimal('90.00')
        )
        
        result = BulkPricingService.calculate_tiered_price(
            product, 25, tier_type='ALL_UNITS'
        )
        
        # 25 * 90 = 2,250
        assert result['total'] == Decimal('2250.00')
        assert result['unit_price'] == Decimal('90.00')


@pytest.mark.django_db
class TestCartPriceCalculator:
    """Test cart price calculator."""
    
    def test_cart_with_tiered_items(self, product):
        """Test cart calculation with tiered pricing."""
        product.base_price = Decimal('100.00')
        product.save()
        
        TieredPricing.objects.create(
            product=product,
            min_quantity=10,
            max_quantity=None,
            price_per_unit=Decimal('90.00')
        )
        
        cart_items = [
            {'item': product, 'quantity': 5, 'line_id': 1},
            {'item': product, 'quantity': 7, 'line_id': 2},
        ]
        
        result = CartPriceCalculator.calculate_cart_total(cart_items)
        
        # Combined quantity 12 uses tier price
        assert result['items_with_tiers'] == 1
        assert result['total_savings'] > 0
```

---

## Testing Requirements

### Unit Tests
- Tier model creation and validation
- Tier overlap detection
- Tier inheritance logic
- Incremental calculation accuracy
- All-units calculation accuracy
- Cart calculator grouping
- Tier copy functionality

### Integration Tests
- Admin actions work correctly
- Cart calculator with mixed items
- Tier preview calculations
- Report generation

### Edge Cases
- No tiers defined
- Single tier
- Unlimited max_quantity
- Zero quantity
- Decimal quantities

---

## Documentation

### Admin Guide
```markdown
## Managing Tiered Pricing

### Creating Tiers
1. Go to Product admin
2. Scroll to "Tiered Pricing" section
3. Add tiers with quantity ranges
4. Ensure no overlaps

### Copying Tiers to Variants
1. Select product tiers
2. Choose "Copy tiers to product variants"
3. All variants will receive the tier structure

### Tier Types
- **All Units:** Simple - one price for all units
- **Incremental:** Progressive - each tier applies to units in its range
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Begin Group D - Scheduled & Promotional Pricing
