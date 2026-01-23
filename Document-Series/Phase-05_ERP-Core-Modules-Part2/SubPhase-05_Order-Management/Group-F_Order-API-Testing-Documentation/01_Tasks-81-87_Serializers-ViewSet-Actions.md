# Tasks 81-87: Serializers, ViewSet & Actions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** F - Order API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-88-92_Fulfillment-Return-URLs-Tests-Docs.md](02_Tasks-88-92_Fulfillment-Return-URLs-Tests-Docs.md)

---

## Document Overview

This document covers creating DRF serializers, viewsets, filtering, search, and custom actions for the Order Management API.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create OrderSerializer | Medium | 25 min |
| 82 | Create OrderLineItemSerializer | Medium | 25 min |
| 83 | Create OrderListSerializer | Low | 20 min |
| 84 | Create OrderViewSet | High | 30 min |
| 85 | Implement Order Filtering | Medium | 25 min |
| 86 | Implement Order Search | Medium | 25 min |
| 87 | Add Order Status Actions | High | 30 min |

---

## Task 81: Create OrderSerializer

### Overview
Create comprehensive OrderSerializer for full CRUD operations on orders with nested line items.

### Dependencies
- Order model
- Django REST Framework

### Instructions

1. **Create serializers directory**
   - Create `apps/orders/serializers/` directory
   - Create `__init__.py`

2. **Create order serializer file**
   - Create `apps/orders/serializers/order_serializer.py`

3. **Import dependencies**
   - Import DRF components
   - Import Order model
   - Import related models

4. **Define OrderSerializer**
   - Inherit from `serializers.ModelSerializer`
   - Include all relevant fields

5. **Add read-only computed fields**
   - total_items
   - fulfillment_status
   - can_cancel
   - days_since_order

6. **Add nested relationships**
   - line_items (nested serializer - Task 82)
   - customer (nested basic info)

7. **Define Meta class**
   - Specify model and fields
   - Set read_only_fields

8. **Add custom validation**
   - Override validate() method
   - Check business rules

9. **Export serializer**

### OrderSerializer Structure

```python
# apps/orders/serializers/order_serializer.py

from rest_framework import serializers
from apps/orders.models import Order, OrderLineItem
from apps.orders.serializers.line_item_serializer import OrderLineItemSerializer

class OrderSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for Order model.
    Includes nested line items and computed fields.
    """
    
    # Nested relationships
    line_items = OrderLineItemSerializer(many=True, read_only=False, required=False)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    # Computed fields
    total_items = serializers.IntegerField(read_only=True)
    fulfillment_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    can_cancel = serializers.BooleanField(read_only=True)
    days_since_order = serializers.SerializerMethodField()
    
    # Display fields
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    payment_status_display = serializers.CharField(
        source='get_payment_status_display',
        read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer',
            'customer_name',
            'status',
            'status_display',
            'source',
            'source_display',
            'payment_status',
            'payment_status_display',
            'subtotal',
            'tax_amount',
            'shipping_cost',
            'discount_amount',
            'grand_total',
            'line_items',
            'total_items',
            'fulfillment_percentage',
            'can_cancel',
            'days_since_order',
            'notes',
            'created_at',
            'updated_at',
            'confirmed_at',
            'delivered_at',
        ]
        read_only_fields = [
            'id',
            'order_number',
            'created_at',
            'updated_at',
            'confirmed_at',
            'delivered_at',
        ]
    
    def get_days_since_order(self, obj):
        """Calculate days since order created."""
        from django.utils import timezone
        delta = timezone.now() - obj.created_at
        return delta.days
    
    def validate(self, data):
        """Validate order data."""
        # Check if order has line items (for creation)
        if self.instance is None:  # Creating new order
            if 'line_items' not in data or not data['line_items']:
                raise serializers.ValidationError(
                    "Order must have at least one line item."
                )
        
        return data
    
    def create(self, validated_data):
        """Create order with nested line items."""
        line_items_data = validated_data.pop('line_items', [])
        
        # Use OrderService for creation
        from apps.orders.services.order_service import OrderService
        
        order_service = OrderService()
        order = order_service.create_order(
            customer=validated_data.get('customer'),
            line_items=line_items_data,
            source=validated_data.get('source', 'MANUAL'),
            notes=validated_data.get('notes', ''),
            user=self.context.get('request').user
        )
        
        return order
    
    def update(self, instance, validated_data):
        """Update order."""
        # Remove nested fields that shouldn't be updated directly
        validated_data.pop('line_items', None)
        
        # Update allowed fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
```

### Expected Outcomes
- OrderSerializer created
- Nested line items included
- Computed fields available
- Validation logic present

---

## Task 82: Create OrderLineItemSerializer

### Overview
Create serializer for order line items with product information and validation.

### Dependencies
- OrderLineItem model

### Instructions

1. **Create line item serializer file**
   - Create `apps/orders/serializers/line_item_serializer.py`

2. **Define OrderLineItemSerializer**

3. **Add product details**
   - Include product name, SKU, image
   - Read-only nested product info

4. **Add computed fields**
   - total (unit_price * quantity)
   - in_stock

5. **Add validation**
   - Check quantity > 0
   - Validate stock availability (if creating)

6. **Export serializer**

### LineItemSerializer Structure

```python
# apps/orders/serializers/line_item_serializer.py

from rest_framework import serializers
from apps.orders.models import OrderLineItem
from apps.products.models import Product

class OrderLineItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order line items.
    Includes product details and validation.
    """
    
    # Product details
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    product_image = serializers.ImageField(source='product.primary_image', read_only=True)
    
    # Computed fields
    total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    in_stock = serializers.SerializerMethodField()
    
    # Write fields
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        required=True
    )
    
    class Meta:
        model = OrderLineItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_sku',
            'product_image',
            'quantity',
            'unit_price',
            'total',
            'in_stock',
            'status',
            'notes',
        ]
        read_only_fields = ['id', 'total', 'status']
    
    def get_in_stock(self, obj):
        """Check if product is in stock."""
        return obj.product.available_quantity >= obj.quantity
    
    def validate_quantity(self, value):
        """Validate quantity is positive."""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value
    
    def validate(self, data):
        """Validate line item data."""
        product = data.get('product')
        quantity = data.get('quantity')
        
        # Check stock availability
        if product and quantity:
            if product.available_quantity < quantity:
                raise serializers.ValidationError({
                    'quantity': f"Only {product.available_quantity} units available in stock."
                })
        
        return data
```

### Expected Outcomes
- LineItemSerializer created
- Product details included
- Stock validation present

---

## Task 83: Create OrderListSerializer

### Overview
Create lightweight serializer for order list views without nested relationships.

### Dependencies
- Task 81: OrderSerializer

### Instructions

1. **In order_serializer.py, add OrderListSerializer**

2. **Define lightweight fields**
   - Only essential fields for list view
   - No nested line items
   - Include summary info only

3. **Add customer name**
   - Read-only customer display

4. **Add item count**
   - total_items field

5. **Export serializer**

### OrderListSerializer Structure

```python
# Add to apps/orders/serializers/order_serializer.py

class OrderListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for order list views.
    Excludes nested relationships for performance.
    """
    
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'customer',
            'customer_name',
            'status',
            'status_display',
            'source',
            'grand_total',
            'total_items',
            'created_at',
            'confirmed_at',
        ]
```

### Expected Outcomes
- List serializer created
- Performance optimized
- Essential fields only

---

## Task 84: Create OrderViewSet

### Overview
Create OrderViewSet with CRUD operations and proper permissions.

### Dependencies
- Tasks 81-83: Serializers

### Instructions

1. **Create views directory**
   - Create `apps/orders/views/` directory
   - Create `__init__.py`

2. **Create order viewset file**
   - Create `apps/orders/views/order_viewset.py`

3. **Import dependencies**
   - Import DRF components
   - Import Order model
   - Import serializers
   - Import permissions

4. **Define OrderViewSet**
   - Inherit from `viewsets.ModelViewSet`
   - Set queryset with optimizations

5. **Configure serializer selection**
   - Override get_serializer_class()
   - Use OrderListSerializer for list
   - Use OrderSerializer for detail

6. **Set permissions**
   - Define permission_classes
   - Customer can view own orders
   - Staff can view all orders

7. **Optimize queries**
   - Override get_queryset()
   - Add select_related and prefetch_related

8. **Add query annotations**
   - Annotate total_items
   - Annotate fulfillment_percentage

9. **Export viewset**

### OrderViewSet Structure

```python
# apps/orders/views/order_viewset.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum, Prefetch
from apps.orders.models import Order, OrderLineItem
from apps.orders.serializers.order_serializer import (
    OrderSerializer,
    OrderListSerializer
)

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order CRUD operations.
    
    Endpoints:
    - GET /orders/ - List orders
    - POST /orders/ - Create order
    - GET /orders/{id}/ - Get order detail
    - PUT /orders/{id}/ - Update order
    - DELETE /orders/{id}/ - Delete order (draft only)
    
    Custom actions added in Task 87.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Optimize queryset with annotations and prefetching.
        Filter by user permissions.
        """
        qs = Order.objects.select_related(
            'customer',
            'created_by',
            'assigned_to'
        ).prefetch_related(
            Prefetch(
                'line_items',
                queryset=OrderLineItem.objects.select_related('product')
            )
        ).annotate(
            total_items=Count('line_items'),
        )
        
        # Filter based on user role
        user = self.request.user
        
        if user.is_staff:
            # Staff can see all orders
            return qs
        else:
            # Customers see only their own orders
            return qs.filter(customer=user)
    
    def get_serializer_class(self):
        """Use different serializers for list vs detail."""
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        """Set created_by when creating order."""
        serializer.save(created_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """Only allow deletion of draft orders."""
        instance = self.get_object()
        
        if instance.status not in [Order.STATUS_PENDING]:
            return Response(
                {'error': 'Only draft orders can be deleted.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### Expected Outcomes
- OrderViewSet created
- CRUD operations working
- Query optimization present
- Permission filtering active

---

## Task 85: Implement Order Filtering

### Overview
Add comprehensive filtering capabilities for orders using django-filter.

### Dependencies
- Task 84: OrderViewSet
- django-filter package

### Instructions

1. **Install django-filter** (if not installed)
   - Add to requirements.txt
   - Install via pip

2. **Create filters file**
   - Create `apps/orders/filters.py`

3. **Define OrderFilter class**
   - Inherit from `django_filters.FilterSet`

4. **Add filter fields**
   - status (multiple choice)
   - source (choice)
   - payment_status (choice)
   - customer (FK)
   - date_from / date_to (date range)
   - assigned_to (FK)

5. **Add custom filters**
   - has_unpaid (boolean)
   - has_delayed_fulfillment (boolean)

6. **Configure filter in viewset**
   - Add filterset_class to OrderViewSet
   - Add filter_backends

### Filter Implementation

```python
# apps/orders/filters.py

import django_filters
from django.db.models import Q
from apps.orders.models import Order

class OrderFilter(django_filters.FilterSet):
    """
    Comprehensive filter for Order model.
    
    Usage:
    GET /orders/?status=PENDING&source=WEBSTORE
    GET /orders/?customer=uuid&payment_status=UNPAID
    GET /orders/?date_from=2026-01-01&date_to=2026-01-31
    """
    
    # Status filter (multiple values supported)
    status = django_filters.MultipleChoiceFilter(
        choices=Order.STATUS_CHOICES,
        help_text="Filter by order status (can specify multiple)"
    )
    
    # Source filter
    source = django_filters.ChoiceFilter(
        choices=Order.SOURCE_CHOICES,
        help_text="Filter by order source"
    )
    
    # Payment status
    payment_status = django_filters.ChoiceFilter(
        choices=Order.PAYMENT_STATUS_CHOICES,
        help_text="Filter by payment status"
    )
    
    # Customer filter
    customer = django_filters.UUIDFilter(
        field_name='customer__id',
        help_text="Filter by customer ID"
    )
    
    # Date range filters
    date_from = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte',
        help_text="Orders created on or after this date"
    )
    date_to = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='lte',
        help_text="Orders created on or before this date"
    )
    
    # Assigned to filter
    assigned_to = django_filters.UUIDFilter(
        field_name='assigned_to__id',
        help_text="Filter by assigned user"
    )
    
    # Custom boolean filters
    has_unpaid = django_filters.BooleanFilter(
        method='filter_unpaid',
        help_text="Filter orders with unpaid status"
    )
    overdue = django_filters.BooleanFilter(
        method='filter_overdue',
        help_text="Filter overdue orders"
    )
    
    class Meta:
        model = Order
        fields = {
            'status': ['exact', 'in'],
            'source': ['exact'],
            'payment_status': ['exact'],
            'grand_total': ['gte', 'lte'],
        }
    
    def filter_unpaid(self, queryset, name, value):
        """Filter orders with unpaid status."""
        if value:
            return queryset.filter(
                payment_status__in=['UNPAID', 'PARTIALLY_PAID']
            )
        return queryset
    
    def filter_overdue(self, queryset, name, value):
        """Filter orders past expected delivery."""
        from django.utils import timezone
        
        if value:
            return queryset.filter(
                expected_delivery_date__lt=timezone.now().date(),
                status__in=['CONFIRMED', 'PROCESSING', 'SHIPPED']
            )
        return queryset
```

### Update ViewSet for Filtering

```python
# Update in apps/orders/views/order_viewset.py

from django_filters.rest_framework import DjangoFilterBackend
from apps.orders.filters import OrderFilter

class OrderViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter
```

### Expected Outcomes
- Comprehensive filtering working
- Multiple filter criteria supported
- Custom filters functional
- Filter backend configured

---

## Task 86: Implement Order Search

### Overview
Add search functionality to find orders by number, customer name, or product.

### Dependencies
- Task 84: OrderViewSet

### Instructions

1. **Add SearchFilter backend**
   - Import SearchFilter
   - Add to filter_backends in viewset

2. **Define search fields**
   - order_number
   - customer__name
   - customer__email
   - line_items__item_name
   - external_reference

3. **Configure search_fields in viewset**

### Search Implementation

```python
# Update in apps/orders/views/order_viewset.py

from rest_framework import filters

class OrderViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = OrderFilter
    
    search_fields = [
        'order_number',              # Exact search
        'customer__name',            # Customer name
        'customer__email',           # Customer email
        'line_items__item_name',     # Product name
        'external_reference',        # External reference (quote, POS)
        'notes',                     # Order notes
    ]
    
    ordering_fields = [
        'created_at',
        'updated_at',
        'grand_total',
        'confirmed_at',
    ]
    
    ordering = ['-created_at']  # Default ordering
```

### Search Usage Examples

```
GET /orders/?search=ORD-2026
GET /orders/?search=john@example.com
GET /orders/?search=Laptop
GET /orders/?ordering=-grand_total
```

### Expected Outcomes
- Search functionality working
- Multiple search fields
- Ordering configured

---

## Task 87: Add Order Status Actions

### Overview
Add custom actions to OrderViewSet for status transitions (confirm, ship, deliver, cancel).

### Dependencies
- Task 84: OrderViewSet
- OrderService methods

### Instructions

1. **Add confirm order action**
   - @action decorator
   - POST method
   - Call OrderService.confirm_order()

2. **Add process order action**
   - Start processing

3. **Add ship order action**
   - Mark as shipped

4. **Add deliver order action**
   - Mark as delivered

5. **Add complete order action**
   - Complete order

6. **Add cancel order action**
   - Cancel order with reason

7. **Add duplicate order action**
   - Create duplicate

8. **Add history action**
   - Get order history

### Status Actions Implementation

```python
# Add to apps/orders/views/order_viewset.py

from apps.orders.services.order_service import OrderService
from apps.orders.services.fulfillment_service import FulfillmentService
from apps.orders.services.cancellation_service import CancellationService

class OrderViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """
        Confirm order.
        
        POST /orders/{id}/confirm/
        """
        order = self.get_object()
        
        try:
            order_service = OrderService()
            confirmed_order = order_service.confirm_order(
                order_id=order.id,
                user=request.user
            )
            
            serializer = self.get_serializer(confirmed_order)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """
        Start processing order.
        
        POST /orders/{id}/process/
        """
        order = self.get_object()
        
        try:
            fulfillment_service = FulfillmentService()
            fulfillment_service.start_processing(
                order_id=order.id,
                user=request.user
            )
            
            order.refresh_from_db()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def ship(self, request, pk=None):
        """
        Ship order.
        
        POST /orders/{id}/ship/
        Body: {
            "tracking_number": "123456",
            "carrier": "DHL"
        }
        """
        order = self.get_object()
        
        try:
            fulfillment_service = FulfillmentService()
            fulfillment = order.fulfillments.first()
            
            if not fulfillment:
                return Response(
                    {'error': 'No fulfillment found for this order'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            fulfillment_service.ship_order(
                fulfillment_id=fulfillment.id,
                tracking_number=request.data.get('tracking_number'),
                carrier=request.data.get('carrier'),
                user=request.user
            )
            
            order.refresh_from_db()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def deliver(self, request, pk=None):
        """
        Mark order as delivered.
        
        POST /orders/{id}/deliver/
        Body: {
            "received_by": "John Doe",
            "delivery_signature": "url/to/signature"
        }
        """
        order = self.get_object()
        
        try:
            fulfillment_service = FulfillmentService()
            fulfillment = order.fulfillments.first()
            
            if not fulfillment:
                return Response(
                    {'error': 'No fulfillment found for this order'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            fulfillment_service.confirm_delivery(
                fulfillment_id=fulfillment.id,
                delivery_data=request.data,
                user=request.user
            )
            
            order.refresh_from_db()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel order.
        
        POST /orders/{id}/cancel/
        Body: {
            "cancellation_reason": "Customer request",
            "cancellation_notes": "Customer found better price"
        }
        """
        order = self.get_object()
        
        try:
            cancellation_service = CancellationService(user=request.user)
            cancelled_order = cancellation_service.cancel_order(
                order_id=order.id,
                cancelled_by=request.user,
                cancellation_reason=request.data.get('cancellation_reason'),
                cancellation_notes=request.data.get('cancellation_notes', '')
            )
            
            serializer = self.get_serializer(cancelled_order)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """
        Duplicate order.
        
        POST /orders/{id}/duplicate/
        """
        order = self.get_object()
        
        try:
            order_service = OrderService()
            duplicated_order = order_service.duplicate_order(
                order_id=order.id,
                user=request.user
            )
            
            serializer = self.get_serializer(duplicated_order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """
        Get order history.
        
        GET /orders/{id}/history/
        """
        order = self.get_object()
        
        from apps.orders.models import OrderHistory
        from apps.orders.serializers.history_serializer import OrderHistorySerializer
        
        history = OrderHistory.objects.filter(order=order).order_by('-timestamp')
        serializer = OrderHistorySerializer(history, many=True)
        
        return Response(serializer.data)
```

### Expected Outcomes
- Status action endpoints created
- All transitions working
- Error handling present
- Services integrated

---

## Summary

This document completed Order API implementation:

**Completed:**
- ✅ OrderSerializer with nested line items
- ✅ OrderLineItemSerializer with validation
- ✅ OrderListSerializer for performance
- ✅ OrderViewSet with CRUD
- ✅ Comprehensive filtering
- ✅ Search functionality
- ✅ Custom status actions

**Key Achievements:**
- Complete RESTful API
- Query optimization
- Permission-based access
- Status workflow actions

**Next Steps:**
- Proceed to [02_Tasks-88-92_Fulfillment-Return-URLs-Tests-Docs.md](02_Tasks-88-92_Fulfillment-Return-URLs-Tests-Docs.md) for Fulfillment/Return ViewSets, URL registration, tests, and documentation
