# Tasks 74-77: ViewSets & Permissions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** E - Price Serializers & API Views  
> **Tasks:** 74-77  
> **Purpose:** Create DRF viewsets with proper permissions for price management

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-69-73_Price-Serializers.md](01_Tasks-69-73_Price-Serializers.md)
- **→ Next:** [03_Tasks-78-80_Schedule-Lookup-Bulk.md](03_Tasks-78-80_Schedule-Lookup-Bulk.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 74 | Create PriceBreakdownSerializer | Medium | 25 min | Pending |
| 75 | Create ProductPriceViewSet | High | 30 min | Pending |
| 76 | Add price update permissions | Low | 20 min | Pending |
| 77 | Create TieredPricingViewSet | Medium | 25 min | Pending |

**Total Estimated Time:** 1h 40min

---

## Task 74: Create PriceBreakdownSerializer

### Description
Create read-only serializer that shows complete price breakdown with all components (base, tax, discounts, etc.).

### Acceptance Criteria
- [ ] PriceBreakdownSerializer class
- [ ] Shows all price components
- [ ] Tax breakdown
- [ ] Discount breakdown
- [ ] Tiered pricing info
- [ ] Read-only (for display purposes)

### File Path
```
backend/apps/products/pricing/serializers/price_breakdown.py (NEW)
```

### Implementation Details

```python
from rest_framework import serializers
from decimal import Decimal

from apps.products.models import Product, ProductVariant
from apps.products.pricing.services import (
    PriceResolutionService,
    TaxCalculatorService,
    BulkPricingService
)


class PriceBreakdownSerializer(serializers.Serializer):
    """
    Read-only serializer showing complete price breakdown.
    
    Used for detailed price display in UI, invoices, and reports.
    Shows all components that make up the final price.
    """
    
    # Item reference
    item_type = serializers.CharField(read_only=True)
    item_id = serializers.IntegerField(read_only=True)
    item_name = serializers.CharField(read_only=True)
    
    # Quantity
    quantity = serializers.IntegerField(read_only=True)
    
    # Base pricing
    base_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    base_price_formatted = serializers.CharField(read_only=True)
    
    # Effective pricing
    effective_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    effective_price_formatted = serializers.CharField(read_only=True)
    price_type = serializers.CharField(read_only=True)
    price_reason = serializers.CharField(read_only=True)
    
    # Discounts
    has_discount = serializers.BooleanField(read_only=True)
    discount_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    discount_amount_formatted = serializers.CharField(read_only=True)
    discount_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    
    # Tax breakdown
    tax_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    tax_amount_formatted = serializers.CharField(read_only=True)
    tax_rate = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    tax_breakdown = serializers.DictField(read_only=True)
    
    # Totals
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    subtotal_formatted = serializers.CharField(read_only=True)
    total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    total_formatted = serializers.CharField(read_only=True)
    
    # Tiered pricing info (if applicable)
    tiered_pricing = serializers.DictField(read_only=True, required=False)
    
    # Customer savings summary
    savings_summary = serializers.DictField(read_only=True)
    
    class Meta:
        fields = '__all__'
    
    def to_representation(self, instance):
        """
        Generate complete price breakdown.
        
        Args:
            instance: Dict with 'item' and 'quantity'
        """
        item = instance['item']
        quantity = instance.get('quantity', 1)
        customer = instance.get('customer')
        
        # Determine item type
        if isinstance(item, ProductVariant):
            item_type = 'variant'
            item_name = f"{item.product.name} - {item.sku}"
            base_price = item.price or item.product.base_price
        else:
            item_type = 'product'
            item_name = item.name
            base_price = item.base_price
        
        # Get effective price
        price_result = PriceResolutionService.get_effective_price(
            item=item,
            customer=customer,
            quantity=quantity
        )
        
        effective_price = price_result['price']
        
        # Calculate subtotal
        subtotal = effective_price * quantity
        
        # Calculate tax
        tax_result = TaxCalculatorService.calculate_tax(
            item=item,
            quantity=quantity,
            unit_price=effective_price
        )
        
        tax_amount = tax_result['tax_amount']
        total = subtotal + tax_amount
        
        # Check for tiered pricing
        tiered_info = None
        if isinstance(item, ProductVariant):
            tiers = item.get_effective_tiers()
        else:
            tiers = item.tiered_pricing.filter(is_active=True)
        
        if tiers.exists():
            tier_result = BulkPricingService.calculate_tiered_price(
                item=item,
                quantity=quantity
            )
            
            tiered_info = {
                'applicable': True,
                'tier_type': tier_result.get('calculation_method', 'ALL_UNITS'),
                'tiers_applied': tier_result.get('tiers_applied', []),
                'total_with_tiers': tier_result.get('total'),
            }
        
        # Calculate savings
        base_total = base_price * quantity
        savings_amount = base_total - subtotal
        savings_percentage = (savings_amount / base_total * 100) if base_total else Decimal('0.00')
        
        return {
            'item_type': item_type,
            'item_id': item.id,
            'item_name': item_name,
            'quantity': quantity,
            
            'base_price': base_price,
            'base_price_formatted': f"LKR {base_price:,.2f}",
            
            'effective_price': effective_price,
            'effective_price_formatted': f"LKR {effective_price:,.2f}",
            'price_type': price_result['price_type'],
            'price_reason': price_result['reason'],
            
            'has_discount': price_result['discount_amount'] > 0,
            'discount_amount': price_result['discount_amount'],
            'discount_amount_formatted': f"LKR {price_result['discount_amount']:,.2f}",
            'discount_percentage': round(price_result['discount_percentage'], 2),
            
            'tax_amount': tax_amount,
            'tax_amount_formatted': f"LKR {tax_amount:,.2f}",
            'tax_rate': tax_result['tax_rate'],
            'tax_breakdown': tax_result.get('breakdown', {}),
            
            'subtotal': subtotal,
            'subtotal_formatted': f"LKR {subtotal:,.2f}",
            'total': total,
            'total_formatted': f"LKR {total:,.2f}",
            
            'tiered_pricing': tiered_info,
            
            'savings_summary': {
                'amount': savings_amount,
                'amount_formatted': f"LKR {savings_amount:,.2f}",
                'percentage': round(savings_percentage, 2),
            },
        }
```

---

## Task 75: Create ProductPriceViewSet

### Description
Create ViewSet for managing product prices with CRUD operations and proper filtering.

### Acceptance Criteria
- [ ] ProductPriceViewSet with ModelViewSet
- [ ] List, retrieve, update actions
- [ ] Filter by product, price range, has_sale
- [ ] Search by product name, SKU
- [ ] Ordering by price
- [ ] Permission checks

### File Path
```
backend/apps/products/pricing/views/product_price.py (NEW)
```

### Implementation Details

```python
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from decimal import Decimal

from apps.products.models import Product
from apps.core.permissions import HasPermission
from ..serializers import (
    ProductPriceSerializer,
    ProductPriceUpdateSerializer,
    PriceBreakdownSerializer
)


class ProductPriceFilter(django_filters.FilterSet):
    """Filter for product prices."""
    
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')
    has_sale = django_filters.BooleanFilter(field_name='sale_price', lookup_expr='isnull', exclude=True)
    category = django_filters.NumberFilter(field_name='categories')
    
    class Meta:
        model = Product
        fields = ['min_price', 'max_price', 'has_sale', 'category', 'is_active']


class ProductPriceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing product prices.
    
    Endpoints:
    - GET /products/{id}/pricing/ - Get product price details
    - PUT /products/{id}/pricing/ - Update product prices
    - GET /products/{id}/pricing/breakdown/ - Get detailed price breakdown
    - POST /products/bulk-price-update/ - Bulk update prices
    """
    
    queryset = Product.objects.all()
    serializer_class = ProductPriceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductPriceFilter
    search_fields = ['name', 'sku', 'categories__name']
    ordering_fields = ['base_price', 'sale_price', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['update', 'partial_update', 'bulk_price_update']:
            return [IsAuthenticated(), HasPermission('manage_pricing')]
        return [IsAuthenticated(), HasPermission('view_pricing')]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['update', 'partial_update', 'bulk_price_update']:
            return ProductPriceUpdateSerializer
        return ProductPriceSerializer
    
    def get_serializer_context(self):
        """Add request context to serializer."""
        context = super().get_serializer_context()
        
        # Add quantity from query params
        if self.request:
            quantity = self.request.query_params.get('quantity', 1)
            try:
                context['quantity'] = int(quantity)
            except (ValueError, TypeError):
                context['quantity'] = 1
        
        return context
    
    @action(detail=True, methods=['get'])
    def breakdown(self, request, pk=None):
        """
        Get detailed price breakdown for a product.
        
        GET /api/pricing/products/{id}/breakdown/?quantity=10
        """
        product = self.get_object()
        quantity = int(request.query_params.get('quantity', 1))
        
        # Get customer if authenticated
        customer = request.user.customer if hasattr(request.user, 'customer') else None
        
        # Generate breakdown
        breakdown_data = {
            'item': product,
            'quantity': quantity,
            'customer': customer,
        }
        
        serializer = PriceBreakdownSerializer(breakdown_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_price_update(self, request):
        """
        Bulk update product prices.
        
        POST /api/pricing/products/bulk-price-update/
        Body: {
            "updates": [
                {"product_id": 1, "base_price": "1000.00", "sale_price": "900.00"},
                {"product_id": 2, "base_price": "2000.00"}
            ],
            "update_type": "absolute" | "percentage"
        }
        """
        updates = request.data.get('updates', [])
        update_type = request.data.get('update_type', 'absolute')
        
        if not updates:
            return Response(
                {'error': 'No updates provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated_count = 0
        errors = []
        
        for update_data in updates:
            product_id = update_data.get('product_id')
            
            try:
                product = Product.objects.get(id=product_id)
                
                if update_type == 'percentage':
                    # Percentage increase/decrease
                    percentage = Decimal(str(update_data.get('percentage', 0)))
                    
                    if 'base_price' in update_data:
                        product.base_price = product.base_price * (1 + percentage / 100)
                    
                    if 'sale_price' in update_data and product.sale_price:
                        product.sale_price = product.sale_price * (1 + percentage / 100)
                else:
                    # Absolute values
                    if 'base_price' in update_data:
                        product.base_price = Decimal(str(update_data['base_price']))
                    
                    if 'sale_price' in update_data:
                        sale_price = update_data['sale_price']
                        product.sale_price = Decimal(str(sale_price)) if sale_price else None
                
                product.save(update_fields=['base_price', 'sale_price', 'updated_at'])
                updated_count += 1
            
            except Product.DoesNotExist:
                errors.append(f"Product {product_id} not found")
            except Exception as e:
                errors.append(f"Error updating product {product_id}: {str(e)}")
        
        return Response({
            'updated_count': updated_count,
            'errors': errors,
        })
    
    @action(detail=True, methods=['post'])
    def set_sale_price(self, request, pk=None):
        """
        Set or remove sale price.
        
        POST /api/pricing/products/{id}/set-sale-price/
        Body: {"sale_price": "900.00"} or {"sale_price": null}
        """
        product = self.get_object()
        sale_price = request.data.get('sale_price')
        
        if sale_price is None:
            product.sale_price = None
        else:
            try:
                sale_price = Decimal(str(sale_price))
                
                if sale_price >= product.base_price:
                    return Response(
                        {'error': 'Sale price must be less than base price'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                product.sale_price = sale_price
            except (ValueError, TypeError):
                return Response(
                    {'error': 'Invalid sale price format'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        product.save(update_fields=['sale_price', 'updated_at'])
        
        serializer = self.get_serializer(product)
        return Response(serializer.data)
```

---

## Task 76: Add Price Update Permissions

### Description
Implement permission system for price management with role-based access control.

### Acceptance Criteria
- [ ] manage_pricing permission
- [ ] view_pricing permission
- [ ] Role-based access (admin, pricing manager)
- [ ] Permission checks in views
- [ ] Audit logging for price changes
- [ ] Permission documentation

### File Path
```
backend/apps/core/permissions.py (UPDATE)
```

### Implementation Details

```python
# Add to apps/core/permissions.py

class PricingPermissions:
    """
    Pricing-specific permissions.
    
    Permissions:
    - view_pricing: View product prices and pricing rules
    - manage_pricing: Create/update/delete pricing rules
    - manage_cost: View and update product costs
    - manage_promotional_pricing: Create promotions and sales
    """
    
    VIEW_PRICING = 'view_pricing'
    MANAGE_PRICING = 'manage_pricing'
    MANAGE_COST = 'manage_cost'
    MANAGE_PROMOTIONAL_PRICING = 'manage_promotional_pricing'


# Usage in views
class HasPricingPermission(BasePermission):
    """Check if user has pricing permission."""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admins have all permissions
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Check action-specific permission
        action = view.action
        
        if action in ['list', 'retrieve', 'breakdown']:
            return request.user.has_perm(PricingPermissions.VIEW_PRICING)
        
        elif action in ['update', 'partial_update', 'set_sale_price']:
            return request.user.has_perm(PricingPermissions.MANAGE_PRICING)
        
        elif action in ['bulk_price_update']:
            return request.user.has_perm(PricingPermissions.MANAGE_PRICING)
        
        return False
```

```python
# Audit logging for price changes

# In signals.py

from django.db.models.signals import pre_save
from django.dispatch import receiver
import logging

logger = logging.getLogger('pricing.audit')


@receiver(pre_save, sender=Product)
def log_price_changes(sender, instance, **kwargs):
    """Log price changes for audit trail."""
    if instance.pk:
        try:
            old_instance = Product.objects.get(pk=instance.pk)
            
            # Check for price changes
            if old_instance.base_price != instance.base_price:
                logger.info(
                    f"Product {instance.id} ({instance.name}) base_price changed: "
                    f"{old_instance.base_price} -> {instance.base_price}"
                )
            
            if old_instance.sale_price != instance.sale_price:
                logger.info(
                    f"Product {instance.id} ({instance.name}) sale_price changed: "
                    f"{old_instance.sale_price} -> {instance.sale_price}"
                )
            
            if old_instance.cost != instance.cost:
                logger.info(
                    f"Product {instance.id} ({instance.name}) cost changed: "
                    f"{old_instance.cost} -> {instance.cost}"
                )
        
        except Product.DoesNotExist:
            pass
```

---

## Task 77: Create TieredPricingViewSet

### Description
Create ViewSet for managing tiered pricing rules with validation and bulk operations.

### Acceptance Criteria
- [ ] TieredPricingViewSet with CRUD
- [ ] Filter by product, variant
- [ ] Validate tier overlaps
- [ ] Bulk tier creation
- [ ] Copy tiers action
- [ ] Permission checks

### File Path
```
backend/apps/products/pricing/views/tiered_pricing.py (NEW)
```

### Implementation Details

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.permissions import HasPermission
from ..models import TieredPricing, VariantTieredPricing
from ..serializers import TieredPricingSerializer, VariantTieredPricingSerializer
from ..services import BulkPricingService


class TieredPricingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tiered pricing rules.
    
    Endpoints:
    - GET /tiered-pricing/ - List all tiers
    - POST /tiered-pricing/ - Create new tier
    - PUT /tiered-pricing/{id}/ - Update tier
    - DELETE /tiered-pricing/{id}/ - Delete tier
    - POST /tiered-pricing/bulk-create/ - Create multiple tiers
    - POST /tiered-pricing/copy-to-variants/ - Copy product tiers to variants
    """
    
    queryset = TieredPricing.objects.all()
    serializer_class = TieredPricingSerializer
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'is_active']
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """
        Create multiple tiers at once.
        
        POST /api/pricing/tiered-pricing/bulk-create/
        Body: {
            "product_id": 1,
            "tiers": [
                {"min_quantity": 1, "max_quantity": 10, "price_per_unit": "100.00"},
                {"min_quantity": 11, "max_quantity": 50, "price_per_unit": "90.00"},
                {"min_quantity": 51, "max_quantity": null, "price_per_unit": "80.00"}
            ]
        }
        """
        product_id = request.data.get('product_id')
        tiers_data = request.data.get('tiers', [])
        
        if not product_id or not tiers_data:
            return Response(
                {'error': 'product_id and tiers are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_tiers = []
        errors = []
        
        for tier_data in tiers_data:
            tier_data['product'] = product_id
            serializer = self.get_serializer(data=tier_data)
            
            if serializer.is_valid():
                serializer.save()
                created_tiers.append(serializer.data)
            else:
                errors.append({
                    'tier': tier_data,
                    'errors': serializer.errors
                })
        
        return Response({
            'created_count': len(created_tiers),
            'created_tiers': created_tiers,
            'errors': errors,
        })
    
    @action(detail=False, methods=['post'])
    def copy_to_variants(self, request):
        """
        Copy product tiers to all variants.
        
        POST /api/pricing/tiered-pricing/copy-to-variants/
        Body: {
            "product_id": 1,
            "overwrite": true
        }
        """
        from apps.products.models import Product
        
        product_id = request.data.get('product_id')
        overwrite = request.data.get('overwrite', False)
        
        if not product_id:
            return Response(
                {'error': 'product_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        total_created = 0
        variants_processed = 0
        
        for variant in product.variants.all():
            created = BulkPricingService.copy_product_tiers_to_variant(
                product=product,
                variant=variant,
                overwrite=overwrite
            )
            
            if created > 0:
                total_created += created
                variants_processed += 1
        
        return Response({
            'variants_processed': variants_processed,
            'tiers_created': total_created,
        })
    
    @action(detail=True, methods=['post'])
    def calculate_price(self, request, pk=None):
        """
        Calculate price for a specific quantity using this tier.
        
        POST /api/pricing/tiered-pricing/{id}/calculate-price/
        Body: {"quantity": 25}
        """
        tier = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        
        # Calculate using bulk pricing service
        result = BulkPricingService.calculate_tiered_price(
            item=tier.product,
            quantity=quantity
        )
        
        return Response(result)


class VariantTieredPricingViewSet(viewsets.ModelViewSet):
    """ViewSet for variant tiered pricing."""
    
    queryset = VariantTieredPricing.objects.all()
    serializer_class = VariantTieredPricingSerializer
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['variant', 'is_active']
```

---

## Testing Requirements

```python
def test_product_price_viewset_list():
    """Test listing product prices."""
    pass

def test_price_update_permission():
    """Test only authorized users can update prices."""
    pass

def test_bulk_price_update():
    """Test bulk price update endpoint."""
    pass

def test_tiered_pricing_validation():
    """Test tier overlap validation in viewset."""
    pass
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Implement Schedule, Lookup & Bulk Operations (Tasks 78-80)
