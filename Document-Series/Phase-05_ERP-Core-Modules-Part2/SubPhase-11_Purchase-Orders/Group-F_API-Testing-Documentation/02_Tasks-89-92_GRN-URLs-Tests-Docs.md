# Tasks 89-92: GRN API, Tests, and Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-83-88_Serializers-ViewSet-Actions.md](01_Tasks-83-88_Serializers-ViewSet-Actions.md)

---

## Document Overview

This document implements the GRN API endpoints, comprehensive test suite for all purchase order functionality, and complete API documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 89 | Create GRN Serializers & ViewSet | Medium | 25 min |
| 90 | Register GRN URLs | Low | 15 min |
| 91 | Write Comprehensive Tests | High | 40 min |
| 92 | Create API Documentation | Medium | 30 min |

---

## Task 89: Create GRN Serializers & ViewSet

### Instructions
1. Create `serializers/goods_receipt.py`
2. Define GoodsReceiptSerializer
3. Define GRNLineItemSerializer
4. Create GoodsReceiptViewSet
5. Add filtering by PO, date, status
6. Add custom actions (complete, cancel)
7. Implement permissions

### GRN Serializers
```python
class GRNLineItemSerializer(serializers.ModelSerializer):
    po_line = POLineItemSerializer(read_only=True)
    quantity_accepted = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = GRNLineItem
        fields = [
            'id', 'po_line', 'line_number', 'quantity_received',
            'quantity_rejected', 'quantity_accepted', 'condition',
            'rejection_reason', 'quality_notes', 'notes'
        ]

class GoodsReceiptSerializer(serializers.ModelSerializer):
    purchase_order = PurchaseOrderListSerializer(read_only=True)
    line_items = GRNLineItemSerializer(many=True, read_only=True)
    received_by = UserMinimalSerializer(read_only=True)
    inspected_by = UserMinimalSerializer(read_only=True)
    
    class Meta:
        model = GoodsReceipt
        fields = [
            'id', 'grn_number', 'purchase_order', 'received_by',
            'received_at', 'status', 'notes', 'delivery_note_number',
            'carrier', 'delivery_date', 'inspection_status',
            'inspection_notes', 'inspected_by', 'inspected_at',
            'line_items', 'created_at', 'updated_at'
        ]
```

### GoodsReceiptViewSet
```python
class GoodsReceiptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for GRN (Read-only, creation via PO receive actions)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = GoodsReceiptSerializer
    filterset_fields = ['status', 'purchase_order', 'received_by', 'inspection_status']
    search_fields = ['grn_number', 'purchase_order__po_number', 'delivery_note_number']
    ordering_fields = ['received_at', 'created_at']
    ordering = ['-received_at']
    
    def get_queryset(self):
        return GoodsReceipt.objects.select_related(
            'purchase_order', 'received_by', 'inspected_by'
        ).prefetch_related(
            'line_items__po_line__product'
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark GRN as completed"""
        grn = self.get_object()
        
        if grn.status != 'PENDING':
            return Response(
                {'error': 'Only pending GRNs can be completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        grn.status = 'COMPLETED'
        grn.save()
        
        serializer = self.get_serializer(grn)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel GRN"""
        grn = self.get_object()
        reason = request.data.get('reason', '')
        
        grn.status = 'CANCELLED'
        grn.notes = f"Cancelled: {reason}\n{grn.notes}"
        grn.save()
        
        return Response({'status': 'GRN cancelled'})
```

---

## Task 90: Register GRN URLs

### Instructions
1. Update `urls.py` in purchases app
2. Register GoodsReceiptViewSet
3. Test all GRN endpoints
4. Verify filtering and search

### URL Registration
```python
# purchases/urls.py
from .views import PurchaseOrderViewSet, GoodsReceiptViewSet

router = DefaultRouter()
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchaseorder')
router.register(r'goods-receipts', GoodsReceiptViewSet, basename='goodsreceipt')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Generated GRN Endpoints
```
GET    /api/v1/goods-receipts/                  # List GRNs
GET    /api/v1/goods-receipts/{id}/             # Retrieve GRN
POST   /api/v1/goods-receipts/{id}/complete/    # Complete GRN
POST   /api/v1/goods-receipts/{id}/cancel/      # Cancel GRN
```

---

## Task 91: Write Comprehensive Tests

### Instructions
1. Create `tests/` directory structure
2. Create test_models.py (model tests)
3. Create test_services.py (service layer tests)
4. Create test_api.py (API endpoint tests)
5. Create test_calculations.py (calculation tests)
6. Create test_receiving.py (receiving workflow tests)
7. Use pytest fixtures
8. Aim for >80% coverage
9. Test all edge cases

### Test Structure
```
tests/
├── __init__.py
├── conftest.py (fixtures)
├── test_models.py
├── test_services.py
├── test_api.py
├── test_calculations.py
└── test_receiving.py
```

### Fixtures (conftest.py)
```python
import pytest
from django.contrib.auth import get_user_model
from purchases.models import PurchaseOrder, POLineItem
from vendors.models import Vendor
from products.models import Product

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def vendor(db):
    return Vendor.objects.create(
        name='Test Vendor',
        email='vendor@test.com',
        is_active=True
    )

@pytest.fixture
def product(db):
    return Product.objects.create(
        name='Test Product',
        code='TEST001',
        unit_price=1000.00
    )

@pytest.fixture
def purchase_order(db, vendor, user):
    return PurchaseOrder.objects.create(
        vendor=vendor,
        order_date='2026-01-15',
        expected_delivery_date='2026-02-15',
        created_by=user,
        status='DRAFT'
    )

@pytest.fixture
def po_with_lines(db, purchase_order, product):
    POLineItem.objects.create(
        purchase_order=purchase_order,
        line_number=1,
        product=product,
        quantity_ordered=10,
        unit_price=1000.00,
        tax_rate=8.5
    )
    return purchase_order
```

### Model Tests (test_models.py)
```python
import pytest
from purchases.models import PurchaseOrder, POLineItem

@pytest.mark.django_db
def test_po_number_generation(purchase_order):
    """Test PO number is auto-generated"""
    assert purchase_order.po_number is not None
    assert purchase_order.po_number.startswith('PO-2026-')

@pytest.mark.django_db
def test_line_total_calculation(po_with_lines):
    """Test line total calculation"""
    line = po_with_lines.line_items.first()
    assert line.line_total == 10850.00  # (10 × 1000) × 1.085

@pytest.mark.django_db
def test_quantity_pending_property(po_with_lines):
    """Test quantity_pending calculated correctly"""
    line = po_with_lines.line_items.first()
    assert line.quantity_pending == 10
    
    line.quantity_received = 6
    line.save()
    assert line.quantity_pending == 4

@pytest.mark.django_db
def test_status_choices(purchase_order):
    """Test status transitions"""
    assert purchase_order.status == 'DRAFT'
    purchase_order.status = 'SENT'
    purchase_order.save()
    assert purchase_order.status == 'SENT'
```

### Service Tests (test_services.py)
```python
import pytest
from purchases.services import POService, POCalculationService

@pytest.mark.django_db
def test_create_purchase_order(vendor, product, user):
    """Test PO creation via service"""
    service = POService()
    line_items = [
        {
            'product_id': product.id,
            'quantity_ordered': 10,
            'unit_price': 1000.00,
            'tax_rate': 8.5
        }
    ]
    
    po = service.create_purchase_order(
        vendor_id=vendor.id,
        order_date='2026-01-15',
        line_items=line_items,
        user=user
    )
    
    assert po.po_number is not None
    assert po.line_items.count() == 1
    assert po.total_amount == 10850.00

@pytest.mark.django_db
def test_send_to_vendor(po_with_lines, user):
    """Test send to vendor action"""
    service = POService()
    service.send_to_vendor(po_with_lines.id, user=user)
    
    po_with_lines.refresh_from_db()
    assert po_with_lines.status == 'SENT'
    assert po_with_lines.sent_at is not None

@pytest.mark.django_db
def test_calculation_service(po_with_lines):
    """Test calculation service"""
    service = POCalculationService()
    service.recalculate_po(po_with_lines.id)
    
    po_with_lines.refresh_from_db()
    assert po_with_lines.subtotal == 10000.00
    assert po_with_lines.total_tax == 850.00
    assert po_with_lines.total_amount == 10850.00
```

### API Tests (test_api.py)
```python
import pytest
from rest_framework.test import APIClient
from rest_framework import status

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_list_purchase_orders(api_client, user, po_with_lines):
    """Test GET /purchase-orders/"""
    api_client.force_authenticate(user=user)
    response = api_client.get('/api/v1/purchase-orders/')
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['results']) == 1

@pytest.mark.django_db
def test_create_purchase_order(api_client, user, vendor, product):
    """Test POST /purchase-orders/"""
    api_client.force_authenticate(user=user)
    data = {
        'vendor': str(vendor.id),
        'order_date': '2026-01-15',
        'line_items': [
            {
                'product_id': str(product.id),
                'quantity_ordered': 10,
                'unit_price': '1000.00',
                'tax_rate': '8.5'
            }
        ]
    }
    
    response = api_client.post('/api/v1/purchase-orders/', data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert 'po_number' in response.data

@pytest.mark.django_db
def test_send_to_vendor_action(api_client, user, po_with_lines):
    """Test POST /purchase-orders/{id}/send_to_vendor/"""
    api_client.force_authenticate(user=user)
    url = f'/api/v1/purchase-orders/{po_with_lines.id}/send_to_vendor/'
    
    response = api_client.post(url)
    assert response.status_code == status.HTTP_200_OK
    
    po_with_lines.refresh_from_db()
    assert po_with_lines.status == 'SENT'

@pytest.mark.django_db
def test_filter_by_status(api_client, user, po_with_lines):
    """Test filtering"""
    api_client.force_authenticate(user=user)
    response = api_client.get('/api/v1/purchase-orders/?status=DRAFT')
    
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data['results']) == 1
```

### Receiving Tests (test_receiving.py)
```python
import pytest
from purchases.services import ReceivingService

@pytest.mark.django_db
def test_full_receiving(po_with_lines, user):
    """Test full receiving workflow"""
    service = ReceivingService()
    grn = service.receive_full(
        po_id=po_with_lines.id,
        grn_data={'notes': 'All items received'},
        user=user
    )
    
    assert grn.grn_number is not None
    assert grn.line_items.count() == 1
    assert grn.line_items.first().quantity_received == 10
    
    po_with_lines.refresh_from_db()
    assert po_with_lines.status == 'RECEIVED'

@pytest.mark.django_db
def test_partial_receiving(po_with_lines, user):
    """Test partial receiving"""
    service = ReceivingService()
    lines_data = [
        {
            'po_line_id': po_with_lines.line_items.first().id,
            'quantity_received': 6
        }
    ]
    
    grn = service.receive_partial(
        po_id=po_with_lines.id,
        lines_data=lines_data,
        grn_data={},
        user=user
    )
    
    po_with_lines.refresh_from_db()
    line = po_with_lines.line_items.first()
    assert line.quantity_received == 6
    assert line.quantity_pending == 4
    assert line.status == 'PARTIAL'
```

---

## Task 92: Create API Documentation

### Instructions
1. Install drf-spectacular
2. Configure schema generation
3. Add endpoint descriptions
4. Add request/response examples
5. Document custom actions
6. Generate OpenAPI schema
7. Setup Swagger UI
8. Create API guide document

### DRF Spectacular Setup
```python
# settings.py
INSTALLED_APPS = [
    ...
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'POS ERP API',
    'DESCRIPTION': 'Purchase Order Management API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

### Enhanced ViewSet Documentation
```python
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """
    Purchase Order Management
    
    Provides endpoints for managing purchase orders including:
    - Creating new POs
    - Sending POs to vendors
    - Approving POs
    - Receiving goods
    - Tracking PO history
    """
    
    @extend_schema(
        summary="Send PO to Vendor",
        description="Sends the purchase order to the vendor via email with PDF attachment",
        request=None,
        responses={200: {'status': 'PO sent to vendor'}},
        examples=[
            OpenApiExample(
                'Success Response',
                value={'status': 'PO sent to vendor'},
                response_only=True
            )
        ]
    )
    @action(detail=True, methods=['post'])
    def send_to_vendor(self, request, pk=None):
        # ... implementation
        pass
    
    @extend_schema(
        summary="Receive Full PO",
        description="Receive all items from the purchase order and create GRN",
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'grn_data': {
                        'type': 'object',
                        'properties': {
                            'notes': {'type': 'string'},
                            'delivery_note_number': {'type': 'string'},
                            'carrier': {'type': 'string'}
                        }
                    }
                }
            }
        },
        responses={201: GoodsReceiptSerializer}
    )
    @action(detail=True, methods=['post'])
    def receive_full(self, request, pk=None):
        # ... implementation
        pass
```

### API Documentation File
Create `API_GUIDE.md`:
```markdown
# Purchase Order API Guide

## Overview
The Purchase Order API provides comprehensive endpoints for managing the complete purchase order lifecycle.

## Base URL
```
https://api.yourcompany.com/api/v1/
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <your_token>
```

## Endpoints

### List Purchase Orders
```
GET /purchase-orders/
```

**Query Parameters:**
- `status` (string): Filter by status (DRAFT, SENT, etc.)
- `vendor` (uuid): Filter by vendor ID
- `order_date_from` (date): Start date filter
- `order_date_to` (date): End date filter
- `search` (string): Search PO number or vendor name

**Response:**
```json
{
  "count": 100,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "po_number": "PO-2026-00001",
      "vendor": {...},
      "status": "SENT",
      "total_amount": "150000.00",
      "order_date": "2026-01-15"
    }
  ]
}
```

### Create Purchase Order
```
POST /purchase-orders/
```

**Request Body:**
```json
{
  "vendor": "vendor-uuid",
  "order_date": "2026-01-15",
  "expected_delivery_date": "2026-02-15",
  "line_items": [
    {
      "product_id": "product-uuid",
      "quantity_ordered": 10,
      "unit_price": "1000.00",
      "tax_rate": "8.5"
    }
  ],
  "notes": "Optional notes"
}
```

### Send to Vendor
```
POST /purchase-orders/{id}/send_to_vendor/
```

Sends PO to vendor via email with PDF attachment.

### Approve PO
```
POST /purchase-orders/{id}/approve/
```

Approve the purchase order (requires approval permission).

### Receive Full
```
POST /purchase-orders/{id}/receive_full/
```

Receive all items and create GRN.

### Receive Partial
```
POST /purchase-orders/{id}/receive_partial/
```

Receive partial quantities.

**Request Body:**
```json
{
  "lines": [
    {
      "po_line_id": "line-uuid",
      "quantity_received": 6
    }
  ],
  "grn_data": {
    "notes": "Partial delivery",
    "delivery_note_number": "DN-123"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data",
  "details": {...}
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "detail": "Not found"
}
```

## Workflow Example

1. **Create Draft PO**
   ```
   POST /purchase-orders/
   ```

2. **Review and Edit**
   ```
   PATCH /purchase-orders/{id}/
   ```

3. **Send to Vendor**
   ```
   POST /purchase-orders/{id}/send_to_vendor/
   ```

4. **Receive Goods**
   ```
   POST /purchase-orders/{id}/receive_full/
   ```

5. **View GRN**
   ```
   GET /goods-receipts/{grn_id}/
   ```
```

---

## Summary

**All 92 Tasks Complete!**

### Group F Complete (10 tasks):
- ✅ PO serializers (4 types)
- ✅ POLineItem serializers
- ✅ PurchaseOrderViewSet with CRUD
- ✅ Advanced filtering
- ✅ 7 custom actions
- ✅ GRN serializers and ViewSet
- ✅ GRN URLs registered
- ✅ Comprehensive test suite (5 test files)
- ✅ API documentation (OpenAPI/Swagger)
- ✅ API usage guide

### Complete Purchase Order Module:
- **Group A:** 18 tasks (Models & Status)
- **Group B:** 16 tasks (Line Items & Calculations)
- **Group C:** 16 tasks (Creation & Sending)
- **Group D:** 18 tasks (Receiving & GRN)
- **Group E:** 14 tasks (PDF & Email)
- **Group F:** 10 tasks (API & Testing)
- **Total:** 92 tasks completed ✅

### Module Capabilities:
1. ✅ Complete PO lifecycle (Draft → Sent → Received → Closed)
2. ✅ Multi-line PO with calculations
3. ✅ Vendor management integration
4. ✅ Approval workflow
5. ✅ Goods receipt (full & partial)
6. ✅ Stock integration
7. ✅ PDF generation
8. ✅ Email notifications
9. ✅ RESTful API
10. ✅ Comprehensive tests

### Next SubPhase:
Proceed to **SubPhase-12** as defined in the project plan.
