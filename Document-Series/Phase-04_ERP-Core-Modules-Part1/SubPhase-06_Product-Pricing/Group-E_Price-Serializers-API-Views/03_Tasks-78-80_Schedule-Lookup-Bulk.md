# Tasks 78-80: Schedule, Lookup & Bulk Operations

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** E - Price Serializers & API Views  
> **Tasks:** 78-80  
> **Purpose:** Create advanced API endpoints for scheduled pricing and bulk operations

---

## Navigation

- **↑ Parent:** [Group E Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [02_Tasks-74-77_ViewSets-Permissions.md](02_Tasks-74-77_ViewSets-Permissions.md)
- **→ Next Group:** [Group F - Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 78 | Create ScheduledPriceViewSet | Medium | 25 min | Pending |
| 79 | Add price lookup endpoint | Medium | 25 min | Pending |
| 80 | Create bulk price update endpoint | High | 30 min | Pending |

**Total Estimated Time:** 1h 20min

---

## Task 78: Create ScheduledPriceViewSet

### Description
Create ViewSet for managing scheduled prices and flash sales with activation endpoints.

### Acceptance Criteria
- [ ] ScheduledPriceViewSet with CRUD
- [ ] FlashSaleViewSet
- [ ] Manual activate/deactivate actions
- [ ] Filter by status, date range
- [ ] List upcoming/active schedules
- [ ] Permission checks

### File Path
```
backend/apps/products/pricing/views/scheduled_price.py (NEW)
```

### Implementation Details

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from django.utils import timezone

from apps.core.permissions import HasPermission
from ..models import ScheduledPrice, FlashSale
from ..serializers import ScheduledPriceSerializer, FlashSaleSerializer


class ScheduledPriceFilter(django_filters.FilterSet):
    """Filter for scheduled prices."""
    
    status = django_filters.ChoiceFilter(choices=ScheduledPrice.Status.choices)
    start_date = django_filters.DateFilter(field_name='start_datetime', lookup_expr='date__gte')
    end_date = django_filters.DateFilter(field_name='end_datetime', lookup_expr='date__lte')
    product = django_filters.NumberFilter()
    variant = django_filters.NumberFilter()
    
    class Meta:
        model = ScheduledPrice
        fields = ['status', 'start_date', 'end_date', 'product', 'variant']


class ScheduledPriceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing scheduled prices.
    
    Endpoints:
    - GET /scheduled-prices/ - List all scheduled prices
    - POST /scheduled-prices/ - Create new scheduled price
    - PUT /scheduled-prices/{id}/ - Update scheduled price
    - DELETE /scheduled-prices/{id}/ - Delete scheduled price
    - POST /scheduled-prices/{id}/activate/ - Manually activate
    - POST /scheduled-prices/{id}/deactivate/ - Manually deactivate
    - GET /scheduled-prices/upcoming/ - List upcoming schedules
    - GET /scheduled-prices/active/ - List active schedules
    """
    
    queryset = ScheduledPrice.objects.all()
    serializer_class = ScheduledPriceSerializer
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ScheduledPriceFilter
    ordering = ['-start_datetime']
    
    def get_queryset(self):
        """Filter queryset based on permissions."""
        queryset = super().get_queryset()
        
        # Exclude flash sales from this viewset
        queryset = queryset.exclude(flashsale__isnull=False)
        
        return queryset
    
    def perform_create(self, serializer):
        """Set created_by when creating."""
        serializer.save(
            tenant=self.request.tenant,
            created_by=self.request.user
        )
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Manually activate a scheduled price.
        
        POST /api/pricing/scheduled-prices/{id}/activate/
        """
        schedule = self.get_object()
        
        schedule.status = ScheduledPrice.Status.ACTIVE
        schedule.save(update_fields=['status', 'updated_at'])
        
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """
        Manually deactivate a scheduled price.
        
        POST /api/pricing/scheduled-prices/{id}/deactivate/
        """
        schedule = self.get_object()
        
        schedule.status = ScheduledPrice.Status.EXPIRED
        schedule.save(update_fields=['status', 'updated_at'])
        
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """
        List upcoming scheduled prices.
        
        GET /api/pricing/scheduled-prices/upcoming/
        """
        now = timezone.now()
        
        upcoming = self.get_queryset().filter(
            status=ScheduledPrice.Status.PENDING,
            start_datetime__gt=now
        ).order_by('start_datetime')[:10]
        
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        List currently active scheduled prices.
        
        GET /api/pricing/scheduled-prices/active/
        """
        active = self.get_queryset().filter(
            status=ScheduledPrice.Status.ACTIVE
        ).order_by('-priority', 'start_datetime')
        
        serializer = self.get_serializer(active, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def conflicts(self, request):
        """
        Find scheduling conflicts.
        
        GET /api/pricing/scheduled-prices/conflicts/
        """
        from ..services.price_resolution import PriorityConflictChecker
        
        conflicts = PriorityConflictChecker.check_schedule_conflicts(
            tenant_id=request.tenant.id
        )
        
        return Response({
            'conflict_count': len(conflicts),
            'conflicts': conflicts,
        })


class FlashSaleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing flash sales.
    
    Flash sales are time-limited sales with quantity restrictions.
    """
    
    queryset = FlashSale.objects.all()
    serializer_class = FlashSaleSerializer
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'product', 'variant', 'is_sold_out']
    ordering = ['-start_datetime']
    
    def perform_create(self, serializer):
        """Set created_by and tenant when creating."""
        serializer.save(
            tenant=self.request.tenant,
            created_by=self.request.user
        )
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """
        Check flash sale availability.
        
        GET /api/pricing/flash-sales/{id}/availability/
        """
        flash_sale = self.get_object()
        
        from ..signals import FlashSaleReservation
        available = FlashSaleReservation.get_available(flash_sale.id)
        
        return Response({
            'max_quantity': flash_sale.max_quantity,
            'quantity_sold': flash_sale.quantity_sold,
            'quantity_remaining': flash_sale.quantity_remaining,
            'available_now': available,
            'is_sold_out': flash_sale.is_sold_out,
            'is_active': flash_sale.is_active,
            'urgency_level': flash_sale.urgency_level,
            'urgency_message': flash_sale.get_urgency_message(),
        })
    
    @action(detail=False, methods=['get'])
    def active_now(self, request):
        """
        List flash sales active right now.
        
        GET /api/pricing/flash-sales/active-now/
        """
        active = self.get_queryset().filter(
            status=FlashSale.Status.ACTIVE,
            is_sold_out=False
        ).order_by('-priority', 'end_datetime')
        
        serializer = self.get_serializer(active, many=True)
        return Response(serializer.data)
```

---

## Task 79: Add Price Lookup Endpoint

### Description
Create unified price lookup endpoint that returns effective price for any product/variant with all rules applied.

### Acceptance Criteria
- [ ] Single endpoint for price lookup
- [ ] Supports product ID or variant ID
- [ ] Accepts quantity parameter
- [ ] Customer context support
- [ ] Returns breakdown
- [ ] Caching for performance
- [ ] Public access (no auth required)

### File Path
```
backend/apps/products/pricing/views/price_lookup.py (NEW)
```

### Implementation Details

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from hashlib import md5

from apps.products.models import Product, ProductVariant
from ..serializers import PriceBreakdownSerializer
from ..services import PriceResolutionService


class PriceLookupView(APIView):
    """
    Unified price lookup endpoint.
    
    GET /api/pricing/lookup/?product_id=1&quantity=10
    GET /api/pricing/lookup/?variant_id=5&quantity=20
    
    Returns effective price with all rules applied.
    Public endpoint (no authentication required).
    """
    
    permission_classes = []  # Public access
    
    def get(self, request):
        """
        Look up effective price for a product or variant.
        
        Query params:
        - product_id: Product ID (required if no variant_id)
        - variant_id: Variant ID (required if no product_id)
        - quantity: Quantity (default: 1)
        - customer_id: Customer ID for customer-specific pricing (optional)
        """
        product_id = request.query_params.get('product_id')
        variant_id = request.query_params.get('variant_id')
        quantity = int(request.query_params.get('quantity', 1))
        customer_id = request.query_params.get('customer_id')
        
        # Validate parameters
        if not product_id and not variant_id:
            return Response(
                {'error': 'Either product_id or variant_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate cache key
        cache_key = self._generate_cache_key(
            product_id, variant_id, quantity, customer_id
        )
        
        # Check cache
        cached_result = cache.get(cache_key)
        if cached_result:
            cached_result['from_cache'] = True
            return Response(cached_result)
        
        # Get item
        try:
            if variant_id:
                item = ProductVariant.objects.select_related('product').get(id=variant_id)
            else:
                item = Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ProductVariant.DoesNotExist):
            return Response(
                {'error': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get customer if provided
        customer = None
        if customer_id:
            from apps.customers.models import Customer
            try:
                customer = Customer.objects.get(id=customer_id)
            except Customer.DoesNotExist:
                pass
        
        # Generate price breakdown
        breakdown_data = {
            'item': item,
            'quantity': quantity,
            'customer': customer,
        }
        
        serializer = PriceBreakdownSerializer(breakdown_data)
        result = serializer.data
        result['from_cache'] = False
        
        # Cache for 5 minutes
        cache.set(cache_key, result, 300)
        
        return Response(result)
    
    def _generate_cache_key(self, product_id, variant_id, quantity, customer_id):
        """Generate cache key for price lookup."""
        key_parts = [
            'price_lookup',
            f'p{product_id}' if product_id else '',
            f'v{variant_id}' if variant_id else '',
            f'q{quantity}',
            f'c{customer_id}' if customer_id else 'guest',
        ]
        key_string = '_'.join(filter(None, key_parts))
        return f"pricing:{key_string}"


class BulkPriceLookupView(APIView):
    """
    Bulk price lookup endpoint.
    
    POST /api/pricing/bulk-lookup/
    Body: {
        "items": [
            {"product_id": 1, "quantity": 10},
            {"variant_id": 5, "quantity": 20}
        ],
        "customer_id": 123
    }
    
    Returns price for multiple items in a single request.
    """
    
    permission_classes = []  # Public access
    
    def post(self, request):
        """Look up prices for multiple items."""
        items = request.data.get('items', [])
        customer_id = request.data.get('customer_id')
        
        if not items:
            return Response(
                {'error': 'items array is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get customer if provided
        customer = None
        if customer_id:
            from apps.customers.models import Customer
            try:
                customer = Customer.objects.get(id=customer_id)
            except Customer.DoesNotExist:
                pass
        
        results = []
        errors = []
        
        for item_data in items:
            product_id = item_data.get('product_id')
            variant_id = item_data.get('variant_id')
            quantity = item_data.get('quantity', 1)
            
            try:
                # Get item
                if variant_id:
                    item = ProductVariant.objects.select_related('product').get(id=variant_id)
                elif product_id:
                    item = Product.objects.get(id=product_id)
                else:
                    errors.append({
                        'item': item_data,
                        'error': 'product_id or variant_id required'
                    })
                    continue
                
                # Get price
                price_result = PriceResolutionService.get_effective_price(
                    item=item,
                    customer=customer,
                    quantity=quantity
                )
                
                results.append({
                    'item_id': item.id,
                    'item_type': 'variant' if variant_id else 'product',
                    'quantity': quantity,
                    'effective_price': price_result['price'],
                    'effective_price_formatted': f"LKR {price_result['price']:,.2f}",
                    'discount_amount': price_result['discount_amount'],
                    'discount_percentage': price_result['discount_percentage'],
                    'price_type': price_result['price_type'],
                })
            
            except (Product.DoesNotExist, ProductVariant.DoesNotExist):
                errors.append({
                    'item': item_data,
                    'error': 'Item not found'
                })
            except Exception as e:
                errors.append({
                    'item': item_data,
                    'error': str(e)
                })
        
        return Response({
            'results': results,
            'errors': errors,
            'success_count': len(results),
            'error_count': len(errors),
        })
```

---

## Task 80: Create Bulk Price Update Endpoint

### Description
Create advanced bulk price update endpoint with percentage changes, filters, and preview mode.

### Acceptance Criteria
- [ ] Bulk update by category, brand, etc.
- [ ] Percentage or absolute changes
- [ ] Preview mode (dry run)
- [ ] Undo functionality
- [ ] Audit trail
- [ ] Background job for large updates

### File Path
```
backend/apps/products/pricing/views/bulk_operations.py (NEW)
```

### Implementation Details

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from decimal import Decimal
from django.db import transaction
from celery import shared_task

from apps.core.permissions import HasPermission
from apps.products.models import Product


class BulkPriceUpdateView(APIView):
    """
    Advanced bulk price update endpoint.
    
    POST /api/pricing/bulk-update/
    
    Supports:
    - Percentage or absolute changes
    - Preview mode (dry run)
    - Filter by category, brand, price range
    - Background processing for large updates
    """
    
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    
    def post(self, request):
        """
        Bulk update product prices.
        
        Body: {
            "filters": {
                "category_id": 5,
                "min_price": "100.00",
                "max_price": "1000.00"
            },
            "update_type": "percentage" | "absolute",
            "base_price_change": 10,  # percentage or amount
            "sale_price_change": 5,
            "preview": true,  # dry run mode
            "async": false  # process in background
        }
        """
        filters = request.data.get('filters', {})
        update_type = request.data.get('update_type', 'percentage')
        base_price_change = request.data.get('base_price_change')
        sale_price_change = request.data.get('sale_price_change')
        preview = request.data.get('preview', False)
        async_processing = request.data.get('async', False)
        
        # Build queryset based on filters
        queryset = Product.objects.all()
        
        if 'category_id' in filters:
            queryset = queryset.filter(categories__id=filters['category_id'])
        
        if 'brand_id' in filters:
            queryset = queryset.filter(brand_id=filters['brand_id'])
        
        if 'min_price' in filters:
            queryset = queryset.filter(base_price__gte=Decimal(filters['min_price']))
        
        if 'max_price' in filters:
            queryset = queryset.filter(base_price__lte=Decimal(filters['max_price']))
        
        affected_count = queryset.count()
        
        if affected_count == 0:
            return Response({
                'message': 'No products match the specified filters',
                'affected_count': 0,
            })
        
        # Preview mode: show what would change
        if preview:
            preview_results = self._generate_preview(
                queryset[:10],  # First 10 for preview
                update_type,
                base_price_change,
                sale_price_change
            )
            
            return Response({
                'preview': True,
                'affected_count': affected_count,
                'sample_changes': preview_results,
            })
        
        # Async processing for large updates
        if async_processing or affected_count > 100:
            task = bulk_update_prices_task.delay(
                queryset.values_list('id', flat=True),
                update_type,
                base_price_change,
                sale_price_change,
                request.user.id
            )
            
            return Response({
                'async': True,
                'task_id': task.id,
                'affected_count': affected_count,
                'message': 'Update started in background. Check task status.',
            })
        
        # Synchronous update
        updated = self._perform_update(
            queryset,
            update_type,
            base_price_change,
            sale_price_change,
            request.user
        )
        
        return Response({
            'success': True,
            'updated_count': updated,
            'affected_count': affected_count,
        })
    
    def _generate_preview(self, queryset, update_type, base_change, sale_change):
        """Generate preview of changes."""
        preview = []
        
        for product in queryset:
            old_base = product.base_price
            old_sale = product.sale_price
            
            new_base, new_sale = self._calculate_new_prices(
                old_base, old_sale, update_type, base_change, sale_change
            )
            
            preview.append({
                'product_id': product.id,
                'product_name': product.name,
                'old_base_price': old_base,
                'new_base_price': new_base,
                'base_change': new_base - old_base,
                'old_sale_price': old_sale,
                'new_sale_price': new_sale,
            })
        
        return preview
    
    @transaction.atomic
    def _perform_update(self, queryset, update_type, base_change, sale_change, user):
        """Perform the actual price update."""
        updated_count = 0
        
        for product in queryset:
            old_base = product.base_price
            old_sale = product.sale_price
            
            new_base, new_sale = self._calculate_new_prices(
                old_base, old_sale, update_type, base_change, sale_change
            )
            
            product.base_price = new_base
            if sale_change and old_sale:
                product.sale_price = new_sale
            
            product.save(update_fields=['base_price', 'sale_price', 'updated_at'])
            updated_count += 1
            
            # Log change
            self._log_price_change(product, old_base, new_base, user)
        
        return updated_count
    
    def _calculate_new_prices(self, old_base, old_sale, update_type, base_change, sale_change):
        """Calculate new prices based on update type."""
        if update_type == 'percentage':
            new_base = old_base * (1 + Decimal(str(base_change)) / 100)
            new_sale = old_sale * (1 + Decimal(str(sale_change)) / 100) if old_sale and sale_change else old_sale
        else:
            new_base = old_base + Decimal(str(base_change))
            new_sale = old_sale + Decimal(str(sale_change)) if old_sale and sale_change else old_sale
        
        # Ensure prices are positive
        new_base = max(Decimal('0.01'), new_base)
        if new_sale:
            new_sale = max(Decimal('0.01'), new_sale)
        
        return new_base, new_sale
    
    def _log_price_change(self, product, old_price, new_price, user):
        """Log price change for audit trail."""
        import logging
        logger = logging.getLogger('pricing.bulk_update')
        
        logger.info(
            f"Bulk update: Product {product.id} ({product.name}) "
            f"price changed from {old_price} to {new_price} by {user.username}"
        )


@shared_task(name='pricing.bulk_update_prices')
def bulk_update_prices_task(product_ids, update_type, base_change, sale_change, user_id):
    """Background task for bulk price updates."""
    from apps.users.models import User
    
    try:
        user = User.objects.get(id=user_id)
        queryset = Product.objects.filter(id__in=product_ids)
        
        view = BulkPriceUpdateView()
        updated = view._perform_update(
            queryset, update_type, base_change, sale_change, user
        )
        
        return {
            'success': True,
            'updated_count': updated,
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
        }
```

---

## URL Configuration

```python
# In urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductPriceViewSet,
    TieredPricingViewSet,
    VariantTieredPricingViewSet,
    ScheduledPriceViewSet,
    FlashSaleViewSet,
    PriceLookupView,
    BulkPriceLookupView,
    BulkPriceUpdateView,
    PromotionalCalendarView,
)

router = DefaultRouter()
router.register('products', ProductPriceViewSet, basename='product-pricing')
router.register('tiered-pricing', TieredPricingViewSet)
router.register('variant-tiered-pricing', VariantTieredPricingViewSet)
router.register('scheduled-prices', ScheduledPriceViewSet)
router.register('flash-sales', FlashSaleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('lookup/', PriceLookupView.as_view(), name='price-lookup'),
    path('bulk-lookup/', BulkPriceLookupView.as_view(), name='bulk-price-lookup'),
    path('bulk-update/', BulkPriceUpdateView.as_view(), name='bulk-price-update'),
    path('promotional-calendar/', PromotionalCalendarView.as_view(), name='promotional-calendar'),
]
```

---

## Testing Requirements

```python
def test_scheduled_price_viewset():
    """Test scheduled price CRUD operations."""
    pass

def test_flash_sale_availability():
    """Test flash sale availability endpoint."""
    pass

def test_price_lookup():
    """Test price lookup endpoint."""
    pass

def test_bulk_price_lookup():
    """Test bulk price lookup."""
    pass

def test_bulk_update_preview():
    """Test bulk update preview mode."""
    pass

def test_bulk_update_async():
    """Test async bulk update."""
    pass
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Begin Group F - Testing & Documentation
