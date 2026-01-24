# Tasks 83-88: Serializers, ViewSet, and API Actions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_GRN-URLs-Tests-Docs.md](02_Tasks-89-92_GRN-URLs-Tests-Docs.md)

---

## Document Overview

This document implements the REST API layer for Purchase Orders including serializers for data validation and transformation, ViewSets for CRUD operations, filtering, and custom actions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create PO Serializers | High | 30 min |
| 84 | Create POLineItem Serializers | Medium | 25 min |
| 85 | Create PurchaseOrderViewSet | High | 30 min |
| 86 | Add Filtering & Search | Medium | 25 min |
| 87 | Implement Custom Actions | High | 30 min |
| 88 | Register URLs | Low | 15 min |

---

## Task 83: Create PO Serializers

### Instructions
1. Create `serializers/purchase_order.py`
2. Define PurchaseOrderListSerializer (read-only, minimal fields)
3. Define PurchaseOrderDetailSerializer (full fields with relations)
4. Define PurchaseOrderCreateSerializer (write-only, validation)
5. Define PurchaseOrderUpdateSerializer (partial updates)
6. Add field validations
7. Handle nested line items
8. Add calculated fields (totals)

### Serializer Structure
```
PurchaseOrderListSerializer:
├── id, po_number, vendor (nested)
├── order_date, expected_delivery_date
├── status, total_amount
└── created_by (nested, minimal)

PurchaseOrderDetailSerializer:
├── All fields from List
├── line_items (nested, full detail)
├── shipping_address, billing_address
├── payment_terms, payment_method
├── notes, internal_notes
├── approval fields
└── timestamps

PurchaseOrderCreateSerializer:
├── Required: vendor, order_date, line_items
├── Optional: expected_delivery, shipping, payment
├── Validation: vendor active, date logic, line items exist
└── Custom create() method

PurchaseOrderUpdateSerializer:
├── Allow updates to editable fields only
├── Restrict updates based on status
├── Validate status transitions
└── Custom update() method
```

### Field Validations
```python
def validate_expected_delivery_date(self, value):
    """Ensure delivery date is after order date"""
    if value < self.initial_data.get('order_date'):
        raise ValidationError("Delivery date must be after order date")
    return value

def validate_vendor(self, value):
    """Ensure vendor is active"""
    if not value.is_active:
        raise ValidationError("Cannot create PO for inactive vendor")
    return value

def validate_line_items(self, value):
    """Ensure at least one line item"""
    if not value or len(value) == 0:
        raise ValidationError("PO must have at least one line item")
    return value
```

---

## Task 84: Create POLineItem Serializers

### Instructions
1. Create `serializers/po_line_item.py`
2. Define POLineItemSerializer (full detail)
3. Define POLineItemCreateSerializer (nested creation)
4. Add product details (nested)
5. Add calculated fields (line_total, tax_amount)
6. Validate quantities and prices
7. Handle status transitions

### POLineItem Serializers
```python
class POLineItemSerializer(serializers.ModelSerializer):
    product = ProductMinimalSerializer(read_only=True)
    line_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    quantity_pending = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = POLineItem
        fields = [
            'id', 'line_number', 'product', 'product_code', 'product_name',
            'quantity_ordered', 'quantity_received', 'quantity_pending',
            'unit_price', 'tax_rate', 'tax_amount', 'discount_percentage',
            'discount_amount', 'line_total', 'status', 'notes'
        ]

class POLineItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = POLineItem
        fields = [
            'product_id', 'quantity_ordered', 'unit_price',
            'tax_rate', 'discount_percentage', 'notes'
        ]
    
    def validate_quantity_ordered(self, value):
        if value <= 0:
            raise ValidationError("Quantity must be greater than 0")
        return value
    
    def validate_unit_price(self, value):
        if value < 0:
            raise ValidationError("Unit price cannot be negative")
        return value
```

---

## Task 85: Create PurchaseOrderViewSet

### Instructions
1. Create `views/purchase_order.py`
2. Define PurchaseOrderViewSet with ModelViewSet
3. Configure queryset with select_related/prefetch_related
4. Map serializers to actions (list/retrieve/create/update)
5. Add permission classes
6. Add pagination
7. Implement get_queryset for tenant isolation
8. Override create method for service layer integration

### ViewSet Structure
```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """Tenant-isolated queryset with optimizations"""
        return PurchaseOrder.objects.select_related(
            'vendor', 'created_by', 'approved_by', 'shipping_address'
        ).prefetch_related(
            'line_items__product', 'line_items__warehouse'
        ).order_by('-created_at')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return PurchaseOrderListSerializer
        elif self.action == 'retrieve':
            return PurchaseOrderDetailSerializer
        elif self.action == 'create':
            return PurchaseOrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PurchaseOrderUpdateSerializer
        return PurchaseOrderDetailSerializer
    
    def create(self, request, *args, **kwargs):
        """Create PO using service layer"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use POService for business logic
        po_service = POService()
        po = po_service.create_purchase_order(
            vendor_id=serializer.validated_data['vendor'].id,
            order_date=serializer.validated_data['order_date'],
            line_items=serializer.validated_data['line_items'],
            user=request.user,
            **serializer.validated_data
        )
        
        output_serializer = PurchaseOrderDetailSerializer(po)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
```

---

## Task 86: Add Filtering & Search

### Instructions
1. Install django-filter
2. Create POFilterSet class
3. Add filters for status, vendor, date ranges
4. Add search fields (po_number, vendor name)
5. Add ordering fields
6. Configure in ViewSet
7. Test filter combinations

### Filter Configuration
```python
from django_filters import rest_framework as filters

class PurchaseOrderFilterSet(filters.FilterSet):
    status = filters.ChoiceFilter(choices=PurchaseOrder.STATUS_CHOICES)
    vendor = filters.UUIDFilter(field_name='vendor__id')
    vendor_name = filters.CharFilter(field_name='vendor__name', lookup_expr='icontains')
    order_date_from = filters.DateFilter(field_name='order_date', lookup_expr='gte')
    order_date_to = filters.DateFilter(field_name='order_date', lookup_expr='lte')
    delivery_date_from = filters.DateFilter(field_name='expected_delivery_date', lookup_expr='gte')
    delivery_date_to = filters.DateFilter(field_name='expected_delivery_date', lookup_expr='lte')
    created_by = filters.UUIDFilter(field_name='created_by__id')
    total_min = filters.NumberFilter(field_name='total_amount', lookup_expr='gte')
    total_max = filters.NumberFilter(field_name='total_amount', lookup_expr='lte')
    
    class Meta:
        model = PurchaseOrder
        fields = ['status', 'vendor', 'order_date', 'expected_delivery_date']

# In ViewSet
class PurchaseOrderViewSet(viewsets.ModelViewSet):
    filterset_class = PurchaseOrderFilterSet
    search_fields = ['po_number', 'vendor__name', 'notes']
    ordering_fields = ['order_date', 'expected_delivery_date', 'total_amount', 'created_at']
    ordering = ['-created_at']
```

### Example Filter Queries
```
GET /api/purchase-orders/?status=SENT
GET /api/purchase-orders/?vendor_name=ABC
GET /api/purchase-orders/?order_date_from=2026-01-01&order_date_to=2026-01-31
GET /api/purchase-orders/?total_min=100000&total_max=500000
GET /api/purchase-orders/?search=TV&ordering=-total_amount
```

---

## Task 87: Implement Custom Actions

### Instructions
1. Add send_to_vendor action (POST)
2. Add approve action (POST)
3. Add receive_full action (POST)
4. Add receive_partial action (POST)
5. Add cancel action (POST)
6. Add get_history action (GET)
7. Add download_pdf action (GET)
8. Validate permissions for each action

### Custom Actions
```python
@action(detail=True, methods=['post'])
def send_to_vendor(self, request, pk=None):
    """Send PO to vendor via email"""
    po = self.get_object()
    
    if po.status != 'DRAFT':
        return Response(
            {'error': 'Only draft POs can be sent'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Use service layer
    po_service = POService()
    po_service.send_to_vendor(po.id, user=request.user)
    
    return Response({'status': 'PO sent to vendor'}, status=status.HTTP_200_OK)

@action(detail=True, methods=['post'])
def approve(self, request, pk=None):
    """Approve PO"""
    po = self.get_object()
    
    po_service = POService()
    try:
        po_service.approve_purchase_order(po.id, user=request.user)
        return Response({'status': 'PO approved'}, status=status.HTTP_200_OK)
    except PermissionError as e:
        return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)

@action(detail=True, methods=['post'])
def receive_full(self, request, pk=None):
    """Receive all items from PO"""
    po = self.get_object()
    grn_data = request.data.get('grn_data', {})
    
    receiving_service = ReceivingService()
    grn = receiving_service.receive_full(po.id, grn_data, user=request.user)
    
    serializer = GoodsReceiptSerializer(grn)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@action(detail=True, methods=['post'])
def receive_partial(self, request, pk=None):
    """Receive partial items from PO"""
    po = self.get_object()
    lines_data = request.data.get('lines', [])
    grn_data = request.data.get('grn_data', {})
    
    receiving_service = ReceivingService()
    grn = receiving_service.receive_partial(po.id, lines_data, grn_data, user=request.user)
    
    serializer = GoodsReceiptSerializer(grn)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@action(detail=True, methods=['post'])
def cancel(self, request, pk=None):
    """Cancel PO"""
    po = self.get_object()
    reason = request.data.get('reason', '')
    
    po_service = POService()
    po_service.cancel_purchase_order(po.id, reason=reason, user=request.user)
    
    return Response({'status': 'PO cancelled'}, status=status.HTTP_200_OK)

@action(detail=True, methods=['get'])
def history(self, request, pk=None):
    """Get PO history"""
    po = self.get_object()
    history = POHistory.objects.filter(purchase_order=po).order_by('-timestamp')
    serializer = POHistorySerializer(history, many=True)
    return Response(serializer.data)

@action(detail=True, methods=['get'])
def download_pdf(self, request, pk=None):
    """Download PO PDF"""
    po = self.get_object()
    
    pdf_generator = POPDFGenerator(po.id)
    pdf_buffer = pdf_generator.generate_pdf()
    
    response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{po.po_number}.pdf"'
    return response
```

---

## Task 88: Register URLs

### Instructions
1. Create `urls.py` in purchases app
2. Register PurchaseOrderViewSet with router
3. Configure URL namespace
4. Add to main urls.py
5. Test all endpoints

### URL Configuration
```python
# purchases/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseOrderViewSet

router = DefaultRouter()
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchaseorder')

urlpatterns = [
    path('', include(router.urls)),
]

# Main urls.py
urlpatterns = [
    path('api/v1/', include([
        path('', include('purchases.urls')),
    ])),
]
```

### Generated Endpoints
```
GET    /api/v1/purchase-orders/                 # List POs
POST   /api/v1/purchase-orders/                 # Create PO
GET    /api/v1/purchase-orders/{id}/            # Retrieve PO
PUT    /api/v1/purchase-orders/{id}/            # Update PO
PATCH  /api/v1/purchase-orders/{id}/            # Partial Update
DELETE /api/v1/purchase-orders/{id}/            # Delete PO

POST   /api/v1/purchase-orders/{id}/send_to_vendor/
POST   /api/v1/purchase-orders/{id}/approve/
POST   /api/v1/purchase-orders/{id}/receive_full/
POST   /api/v1/purchase-orders/{id}/receive_partial/
POST   /api/v1/purchase-orders/{id}/cancel/
GET    /api/v1/purchase-orders/{id}/history/
GET    /api/v1/purchase-orders/{id}/download_pdf/
```

---

## Summary

API layer implemented:
- ✅ 4 PO serializers (List, Detail, Create, Update)
- ✅ POLineItem serializers
- ✅ PurchaseOrderViewSet with CRUD
- ✅ Advanced filtering (9+ filters)
- ✅ Search and ordering
- ✅ 7 custom actions
- ✅ URL routing configured
- ✅ Tenant isolation
- ✅ Service layer integration

### Next Steps
- **Document 02**: Create GRN ViewSet, comprehensive tests, and API documentation
