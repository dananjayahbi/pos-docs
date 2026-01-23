# Tasks 69-75: Serializers, ViewSet & Status Actions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** E - Quote API & Email Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Quote-PDF-Generation/](../Group-D_Quote-PDF-Generation/)
- **→ Next Document:** [02_Tasks-76-82_Email-Public-URLs.md](02_Tasks-76-82_Email-Public-URLs.md)

---

## Document Overview

This document covers the creation of DRF serializers for Quote and QuoteLineItem, the QuoteViewSet with CRUD operations, filtering, search, and custom status action endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create QuoteSerializer | Medium | 25 min |
| 70 | Create QuoteLineItemSerializer | Medium | 25 min |
| 71 | Create QuoteListSerializer | Low | 20 min |
| 72 | Create QuoteViewSet | High | 30 min |
| 73 | Implement Quote Filtering | Medium | 25 min |
| 74 | Implement Quote Search | Medium | 25 min |
| 75 | Add Quote Status Actions | High | 30 min |

---

## Task 69: Create QuoteSerializer

### Overview
Create Django REST Framework serializer for Quote model with nested line items and calculated fields.

### Dependencies
- Quote model exists
- QuoteLineItem model exists
- DRF installed

### Instructions

1. **Create serializers directory**
   - Create `apps/quotes/serializers/`
   - Create `__init__.py`

2. **Create quote.py serializer file**
   - Import DRF serializers
   - Import models

3. **Define QuoteSerializer class**
   - Inherit from serializers.ModelSerializer
   - Include all relevant fields
   - Nested line items serializer

4. **Add read-only calculated fields**
   - subtotal, tax_amount, grand_total
   - is_expired, days_until_expiry
   - get_status_display

5. **Add custom fields**
   - customer_display (formatted customer info)
   - created_by_display (user name)
   - pdf_url (if PDF exists)

6. **Implement validation**
   - validate_valid_until (must be future date)
   - validate_discount_value (must be positive)
   - validate line items presence

7. **Add Meta class**
   - model, fields, read_only_fields

### Implementation

```python
# apps/quotes/serializers/__init__.py
from .quote import QuoteSerializer, QuoteListSerializer
from .line_item import QuoteLineItemSerializer

__all__ = ['QuoteSerializer', 'QuoteListSerializer', 'QuoteLineItemSerializer']


# apps/quotes/serializers/line_item.py
from rest_framework import serializers
from apps/quotes.models import QuoteLineItem


class QuoteLineItemSerializer(serializers.ModelSerializer):
    """Serializer for QuoteLineItem."""
    
    # Read-only fields
    line_total = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    
    # Product display
    product_display = serializers.SerializerMethodField()
    
    class Meta:
        model = QuoteLineItem
        fields = [
            'id',
            'quote',
            'product',
            'product_display',
            'description',
            'notes',
            'quantity',
            'unit',
            'unit_price',
            'original_price',
            'cost_price',
            'discount_type',
            'discount_value',
            'discount_amount',
            'is_taxable',
            'tax_rate',
            'tax_amount',
            'line_total',
            'position',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'line_total',
            'discount_amount',
            'tax_amount',
            'created_at',
            'updated_at',
        ]
    
    def get_product_display(self, obj):
        """Get formatted product information."""
        if obj.product:
            return {
                'id': obj.product.id,
                'code': obj.product.code,
                'name': obj.product.name,
                'category': obj.product.category.name if hasattr(obj.product, 'category') else None,
            }
        return None
    
    def validate_quantity(self, value):
        """Validate quantity is positive."""
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        return value
    
    def validate_unit_price(self, value):
        """Validate unit price is non-negative."""
        if value < 0:
            raise serializers.ValidationError("Unit price cannot be negative")
        return value


# apps/quotes/serializers/quote.py
from rest_framework import serializers
from django.utils import timezone
from apps.quotes.models import Quote
from .line_item import QuoteLineItemSerializer


class QuoteSerializer(serializers.ModelSerializer):
    """Full serializer for Quote with nested line items."""
    
    # Nested line items
    line_items = QuoteLineItemSerializer(many=True, read_only=True)
    
    # Read-only calculated fields
    subtotal = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    tax_amount = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    discount_amount = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    grand_total = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    
    # Status display
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    # Custom fields
    is_expired = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    customer_display = serializers.SerializerMethodField()
    created_by_display = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    public_url = serializers.SerializerMethodField()
    
    # Available actions
    available_actions = serializers.SerializerMethodField()
    
    class Meta:
        model = Quote
        fields = [
            'id',
            'quote_number',
            'tenant',
            'customer',
            'customer_display',
            'customer_name',
            'customer_email',
            'customer_phone',
            'title',
            'description',
            'status',
            'status_display',
            'issue_date',
            'valid_until',
            'is_expired',
            'days_until_expiry',
            'discount_type',
            'discount_value',
            'discount_amount',
            'subtotal',
            'tax_amount',
            'grand_total',
            'terms_and_conditions',
            'notes',
            'internal_notes',
            'line_items',
            'created_by',
            'created_by_display',
            'created_at',
            'updated_at',
            'pdf_url',
            'public_url',
            'available_actions',
        ]
        read_only_fields = [
            'id',
            'quote_number',
            'tenant',
            'subtotal',
            'tax_amount',
            'discount_amount',
            'grand_total',
            'created_by',
            'created_at',
            'updated_at',
        ]
    
    def get_customer_display(self, obj):
        """Get formatted customer information."""
        if obj.customer:
            return {
                'id': obj.customer.id,
                'name': obj.customer.name,
                'email': getattr(obj.customer, 'email', None),
                'phone': getattr(obj.customer, 'phone', None),
            }
        elif obj.customer_name:
            return {
                'id': None,
                'name': obj.customer_name,
                'email': obj.customer_email,
                'phone': obj.customer_phone,
            }
        return None
    
    def get_created_by_display(self, obj):
        """Get creator information."""
        if obj.created_by:
            return {
                'id': obj.created_by.id,
                'name': obj.created_by.get_full_name() or obj.created_by.username,
                'email': obj.created_by.email,
            }
        return None
    
    def get_pdf_url(self, obj):
        """Get PDF download URL if available."""
        if obj.pdf_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
        return None
    
    def get_public_url(self, obj):
        """Get public view URL."""
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.get_public_url())
        return obj.get_public_url()
    
    def get_available_actions(self, obj):
        """Get list of available actions for current state."""
        return obj.get_available_actions()
    
    def validate_valid_until(self, value):
        """Validate valid_until is in the future."""
        if value < timezone.now().date():
            raise serializers.ValidationError("Valid until date must be in the future")
        return value
    
    def validate_discount_value(self, value):
        """Validate discount value is positive."""
        if value and value < 0:
            raise serializers.ValidationError("Discount value cannot be negative")
        
        # Validate percentage is <= 100
        discount_type = self.initial_data.get('discount_type')
        if discount_type == 'PERCENTAGE' and value > 100:
            raise serializers.ValidationError("Percentage discount cannot exceed 100%")
        
        return value
    
    def validate(self, attrs):
        """Cross-field validation."""
        # Ensure valid_until > issue_date
        issue_date = attrs.get('issue_date', getattr(self.instance, 'issue_date', None))
        valid_until = attrs.get('valid_until')
        
        if issue_date and valid_until and valid_until <= issue_date:
            raise serializers.ValidationError({
                'valid_until': 'Valid until must be after issue date'
            })
        
        return attrs
```

### Serializer Output Example

```json
{
  "id": 1,
  "quote_number": "QT-2026-00001",
  "customer_display": {
    "id": 5,
    "name": "ABC Company (Pvt) Ltd",
    "email": "contact@abc.lk",
    "phone": "+94 77 123 4567"
  },
  "title": "Office Furniture Quotation",
  "status": "SENT",
  "status_display": "Sent to Customer",
  "issue_date": "2026-01-15",
  "valid_until": "2026-02-15",
  "is_expired": false,
  "days_until_expiry": 31,
  "discount_type": "PERCENTAGE",
  "discount_value": "5.00",
  "discount_amount": "5500.00",
  "subtotal": "110000.00",
  "tax_amount": "15675.00",
  "grand_total": "120175.00",
  "line_items": [
    {
      "id": 1,
      "product_display": {
        "id": 10,
        "code": "DESK-001",
        "name": "Office Desk - Oak",
        "category": "Furniture"
      },
      "description": "Office Desk - Oak\nStandard size",
      "quantity": "2.000",
      "unit": "pcs",
      "unit_price": "25000.00",
      "discount_amount": "0.00",
      "tax_amount": "7500.00",
      "line_total": "57500.00"
    }
  ],
  "created_by_display": {
    "id": 2,
    "name": "John Doe",
    "email": "john@company.lk"
  },
  "pdf_url": "https://erp.example.lk/media/quotes/pdfs/quote_QT-2026-00001.pdf",
  "public_url": "https://erp.example.lk/quotes/public/abc-123-def-456/",
  "available_actions": ["send", "edit", "delete", "duplicate"],
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-01-15T10:30:00Z"
}
```

### Expected Outcome
Complete serializer with nested line items, calculated fields, and validation.

### Verification Checklist
- [ ] serializers directory created
- [ ] __init__.py created
- [ ] QuoteLineItemSerializer created
- [ ] product_display SerializerMethodField
- [ ] Quantity validation
- [ ] Unit price validation
- [ ] QuoteSerializer created
- [ ] Nested line_items field
- [ ] Read-only calculated fields (subtotal, tax, total)
- [ ] status_display field
- [ ] is_expired, days_until_expiry fields
- [ ] customer_display SerializerMethodField
- [ ] created_by_display SerializerMethodField
- [ ] pdf_url SerializerMethodField
- [ ] public_url SerializerMethodField
- [ ] available_actions SerializerMethodField
- [ ] validate_valid_until method
- [ ] validate_discount_value method
- [ ] Cross-field validation
- [ ] Meta class with fields list

---

## Task 71: Create QuoteListSerializer

### Overview
Create lightweight serializer for list views with minimal fields for better performance.

### Dependencies
- Task 69: QuoteSerializer exists

### Instructions

1. **Define QuoteListSerializer**
   - Inherit from serializers.ModelSerializer
   - Include only essential fields
   - Exclude nested line items
   - Add summary fields

2. **Add summary fields**
   - line_items_count
   - total_amount (grand_total)
   - customer_name_display

3. **Optimize for list performance**
   - Minimal fields
   - No nested serializers
   - Read-only

### Implementation

```python
# Add to apps/quotes/serializers/quote.py

class QuoteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    
    # Summary fields
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    customer_name_display = serializers.SerializerMethodField()
    line_items_count = serializers.SerializerMethodField()
    total_amount = serializers.DecimalField(
        source='grand_total',
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = Quote
        fields = [
            'id',
            'quote_number',
            'customer_name_display',
            'title',
            'status',
            'status_display',
            'issue_date',
            'valid_until',
            'is_expired',
            'total_amount',
            'line_items_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields  # All read-only for list
    
    def get_customer_name_display(self, obj):
        """Get customer name for display."""
        if obj.customer:
            return obj.customer.name
        return obj.customer_name or 'N/A'
    
    def get_line_items_count(self, obj):
        """Get count of line items."""
        return obj.line_items.count()
```

### List Serializer Output

```json
[
  {
    "id": 1,
    "quote_number": "QT-2026-00001",
    "customer_name_display": "ABC Company (Pvt) Ltd",
    "title": "Office Furniture Quotation",
    "status": "SENT",
    "status_display": "Sent to Customer",
    "issue_date": "2026-01-15",
    "valid_until": "2026-02-15",
    "is_expired": false,
    "total_amount": "120175.00",
    "line_items_count": 2,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "quote_number": "QT-2026-00002",
    "customer_name_display": "XYZ Trading",
    "title": "Computer Equipment Quote",
    "status": "DRAFT",
    "status_display": "Draft",
    "issue_date": "2026-01-16",
    "valid_until": "2026-02-16",
    "is_expired": false,
    "total_amount": "85000.00",
    "line_items_count": 3,
    "created_at": "2026-01-16T09:15:00Z",
    "updated_at": "2026-01-16T09:15:00Z"
  }
]
```

### Expected Outcome
Optimized list serializer with summary fields for fast list endpoint performance.

### Verification Checklist
- [ ] QuoteListSerializer created
- [ ] Essential fields only
- [ ] status_display field
- [ ] customer_name_display SerializerMethodField
- [ ] line_items_count SerializerMethodField
- [ ] total_amount (aliased grand_total)
- [ ] All fields read-only
- [ ] No nested serializers
- [ ] Optimized for list queries

---

## Task 72: Create QuoteViewSet

### Overview
Create DRF ViewSet for Quote CRUD operations with proper permissions and queryset optimization.

### Dependencies
- Task 69: Serializers exist
- QuoteService exists

### Instructions

1. **Create views.py in api directory**
   - Create `apps/quotes/api/`
   - Create `views.py`

2. **Define QuoteViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Set queryset with optimizations
   - Configure permissions

3. **Add queryset optimization**
   - select_related for customer, created_by
   - prefetch_related for line_items
   - Tenant filtering

4. **Implement get_serializer_class**
   - Use QuoteListSerializer for list
   - Use QuoteSerializer for detail

5. **Override create method**
   - Use QuoteService.create_quote()
   - Handle line items creation
   - Set created_by

6. **Override update method**
   - Use QuoteService for updates
   - Handle line items updates
   - Validate transitions

7. **Add permission checking**
   - Check tenant access
   - Check user permissions
   - Status-based permissions

### Implementation

```python
# apps/quotes/api/__init__.py
from .views import QuoteViewSet

__all__ = ['QuoteViewSet']


# apps/quotes/api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from apps.quotes.models import Quote
from apps/quotes.serializers import QuoteSerializer, QuoteListSerializer
from apps.quotes.services.quote_service import QuoteService


class QuoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Quote CRUD operations.
    
    Endpoints:
    - GET /api/quotes/ - List quotes
    - POST /api/quotes/ - Create quote
    - GET /api/quotes/{id}/ - Retrieve quote
    - PUT/PATCH /api/quotes/{id}/ - Update quote
    - DELETE /api/quotes/{id}/ - Delete quote
    """
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Get optimized queryset for current user's tenant.
        """
        user = self.request.user
        
        # Base queryset with optimizations
        queryset = Quote.objects.select_related(
            'customer',
            'created_by',
            'tenant'
        ).prefetch_related(
            'line_items__product'
        )
        
        # Filter by tenant
        if hasattr(user, 'tenant'):
            queryset = queryset.filter(tenant=user.tenant)
        
        return queryset
    
    def get_serializer_class(self):
        """Use list serializer for list action."""
        if self.action == 'list':
            return QuoteListSerializer
        return QuoteSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Create new quote with line items.
        
        Body:
        {
          "customer": 5,
          "title": "Office Furniture Quote",
          "issue_date": "2026-01-15",
          "valid_until": "2026-02-15",
          "discount_type": "PERCENTAGE",
          "discount_value": 5,
          "line_items": [
            {
              "product": 10,
              "quantity": 2,
              "unit_price": 25000
            }
          ]
        }
        """
        # Extract line items
        line_items_data = request.data.pop('line_items', [])
        
        # Validate quote data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Use service to create quote
        service = QuoteService()
        
        try:
            quote = service.create_quote(
                quote_data=serializer.validated_data,
                line_items=line_items_data,
                user=request.user
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return created quote
        output_serializer = QuoteSerializer(
            quote,
            context={'request': request}
        )
        
        return Response(
            output_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        """Update quote."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if quote can be edited
        if hasattr(instance, 'is_locked') and instance.is_locked:
            return Response(
                {'error': 'Cannot edit locked quote'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract line items if provided
        line_items_data = request.data.pop('line_items', None)
        
        # Update quote fields
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Update line items if provided
        if line_items_data is not None:
            # Delete existing line items
            instance.line_items.all().delete()
            
            # Create new line items
            from apps.quotes.serializers import QuoteLineItemSerializer
            for item_data in line_items_data:
                item_data['quote'] = instance.id
                item_serializer = QuoteLineItemSerializer(data=item_data)
                item_serializer.is_valid(raise_exception=True)
                item_serializer.save()
        
        # Recalculate totals
        from apps.quotes.services.calculation_service import QuoteCalculationService
        calc_service = QuoteCalculationService(instance)
        calc_service.calculate_all()
        
        # Return updated quote
        output_serializer = QuoteSerializer(
            instance,
            context={'request': request}
        )
        
        return Response(output_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Delete quote."""
        instance = self.get_object()
        
        # Check if quote can be deleted
        if hasattr(instance, 'can_delete') and not instance.can_delete:
            return Response(
                {'error': 'Cannot delete quote in current state'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### API Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/quotes/` | List all quotes | - |
| POST | `/api/quotes/` | Create quote | Quote + line items |
| GET | `/api/quotes/{id}/` | Get quote details | - |
| PUT | `/api/quotes/{id}/` | Update quote (full) | Quote data |
| PATCH | `/api/quotes/{id}/` | Update quote (partial) | Changed fields |
| DELETE | `/api/quotes/{id}/` | Delete quote | - |

### Usage Examples

```javascript
// Create quote
const response = await fetch('/api/quotes/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    customer: 5,
    title: 'Office Furniture Quotation',
    issue_date: '2026-01-15',
    valid_until: '2026-02-15',
    discount_type: 'PERCENTAGE',
    discount_value: 5,
    line_items: [
      {
        product: 10,
        quantity: 2,
        unit_price: 25000
      }
    ]
  })
});

const quote = await response.json();

// Update quote
await fetch(`/api/quotes/${quote.id}/`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Updated Quote Title'
  })
});

// Delete quote
await fetch(`/api/quotes/${quote.id}/`, {
  method: 'DELETE',
  headers: {'Authorization': `Bearer ${token}`}
});
```

### Expected Outcome
Full CRUD ViewSet with optimized queries, service layer integration, and proper permissions.

### Verification Checklist
- [ ] api directory created
- [ ] views.py created
- [ ] QuoteViewSet defined
- [ ] get_queryset with optimizations
- [ ] select_related for customer, created_by
- [ ] prefetch_related for line_items
- [ ] Tenant filtering
- [ ] get_serializer_class implementation
- [ ] create method override
- [ ] Uses QuoteService.create_quote()
- [ ] Handles line items creation
- [ ] update method override
- [ ] Lock checking
- [ ] Line items update handling
- [ ] Totals recalculation
- [ ] destroy method with validation
- [ ] Permission checks
- [ ] Transaction safety

---

## Task 73: Implement Quote Filtering

### Overview
Implement comprehensive filtering for quotes using django-filter.

### Dependencies
- Task 72: QuoteViewSet exists
- django-filter installed

### Instructions

1. **Install django-filter**
   - Add to requirements: `django-filter`
   - Add to INSTALLED_APPS

2. **Create filters.py**
   - Create `apps/quotes/api/filters.py`
   - Define QuoteFilter class

3. **Add filter fields**
   - status (exact, in)
   - customer (exact)
   - created_by (exact)
   - issue_date (gte, lte, range)
   - valid_until (gte, lte)
   - is_expired (boolean)

4. **Add custom filters**
   - total_amount_min, total_amount_max
   - created_date_range
   - has_pdf (boolean)

5. **Configure ViewSet**
   - Add filter_backends
   - Set filterset_class

### Implementation

```python
# apps/quotes/api/filters.py

from django_filters import rest_framework as filters
from apps.quotes.models import Quote


class QuoteFilter(filters.FilterSet):
    """Filter set for Quote queries."""
    
    # Status filtering
    status = filters.MultipleChoiceFilter(
        choices=Quote.STATUS_CHOICES,
        help_text="Filter by status (can specify multiple)"
    )
    
    # Customer filtering
    customer = filters.NumberFilter(
        field_name='customer__id',
        help_text="Filter by customer ID"
    )
    
    customer_name = filters.CharFilter(
        field_name='customer__name',
        lookup_expr='icontains',
        help_text="Filter by customer name (partial match)"
    )
    
    # User filtering
    created_by = filters.NumberFilter(
        field_name='created_by__id',
        help_text="Filter by creator user ID"
    )
    
    # Date filtering
    issue_date_from = filters.DateFilter(
        field_name='issue_date',
        lookup_expr='gte',
        help_text="Issue date from"
    )
    
    issue_date_to = filters.DateFilter(
        field_name='issue_date',
        lookup_expr='lte',
        help_text="Issue date to"
    )
    
    valid_until_from = filters.DateFilter(
        field_name='valid_until',
        lookup_expr='gte',
        help_text="Valid until from"
    )
    
    valid_until_to = filters.DateFilter(
        field_name='valid_until',
        lookup_expr='lte',
        help_text="Valid until to"
    )
    
    # Amount filtering
    total_min = filters.NumberFilter(
        field_name='grand_total',
        lookup_expr='gte',
        help_text="Minimum total amount"
    )
    
    total_max = filters.NumberFilter(
        field_name='grand_total',
        lookup_expr='lte',
        help_text="Maximum total amount"
    )
    
    # Boolean filters
    is_expired = filters.BooleanFilter(
        method='filter_is_expired',
        help_text="Filter expired quotes"
    )
    
    has_pdf = filters.BooleanFilter(
        method='filter_has_pdf',
        help_text="Filter quotes with PDF"
    )
    
    class Meta:
        model = Quote
        fields = {
            'status': ['exact', 'in'],
            'issue_date': ['exact', 'gte', 'lte'],
            'valid_until': ['exact', 'gte', 'lte'],
            'grand_total': ['gte', 'lte'],
        }
    
    def filter_is_expired(self, queryset, name, value):
        """Filter by expiry status."""
        from django.utils import timezone
        
        today = timezone.now().date()
        
        if value:
            # Expired quotes
            return queryset.filter(
                valid_until__lt=today,
                status__in=['SENT', 'DRAFT']
            )
        else:
            # Non-expired quotes
            return queryset.filter(valid_until__gte=today)
    
    def filter_has_pdf(self, queryset, name, value):
        """Filter by PDF existence."""
        if value:
            return queryset.exclude(pdf_file='')
        else:
            return queryset.filter(pdf_file='')


# Update QuoteViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters as drf_filters
from .filters import QuoteFilter

class QuoteViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    filter_backends = [
        DjangoFilterBackend,
        drf_filters.SearchFilter,
        drf_filters.OrderingFilter,
    ]
    filterset_class = QuoteFilter
    search_fields = ['quote_number', 'title', 'customer__name']
    ordering_fields = ['issue_date', 'valid_until', 'grand_total', 'created_at']
    ordering = ['-created_at']  # Default ordering
```

### Filter Query Examples

```bash
# Filter by status
GET /api/quotes/?status=SENT

# Multiple statuses
GET /api/quotes/?status=SENT&status=ACCEPTED

# Filter by customer
GET /api/quotes/?customer=5

# Filter by customer name (partial)
GET /api/quotes/?customer_name=ABC

# Date range
GET /api/quotes/?issue_date_from=2026-01-01&issue_date_to=2026-01-31

# Amount range
GET /api/quotes/?total_min=50000&total_max=200000

# Expired quotes
GET /api/quotes/?is_expired=true

# Quotes with PDF
GET /api/quotes/?has_pdf=true

# Combined filters
GET /api/quotes/?status=SENT&customer=5&total_min=100000&has_pdf=true

# With ordering
GET /api/quotes/?ordering=-grand_total
```

### Expected Outcome
Comprehensive filtering capabilities for quote queries with multiple filter options.

### Verification Checklist
- [ ] django-filter installed
- [ ] filters.py created
- [ ] QuoteFilter class defined
- [ ] status MultipleChoiceFilter
- [ ] customer filter
- [ ] customer_name filter
- [ ] created_by filter
- [ ] issue_date range filters
- [ ] valid_until range filters
- [ ] total_min, total_max filters
- [ ] is_expired BooleanFilter
- [ ] has_pdf BooleanFilter
- [ ] Custom filter methods implemented
- [ ] ViewSet filter_backends configured
- [ ] filterset_class set
- [ ] ordering_fields configured

---

## Task 74: Implement Quote Search

### Overview
Implement full-text search across quote fields using DRF SearchFilter.

### Dependencies
- Task 73: Filtering implemented

### Instructions

1. **Configure SearchFilter**
   - Already added in Task 73
   - Configure search_fields

2. **Add searchable fields**
   - quote_number
   - title
   - description
   - customer__name
   - customer_name

3. **Add PostgreSQL full-text search (optional)**
   - Use SearchVector
   - Index search fields
   - Better performance

### Implementation

```python
# Already configured in Task 73
class QuoteViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    search_fields = [
        'quote_number',
        'title',
        'description',
        'customer__name',
        'customer_name',
        'customer_email',
    ]
```

### Search Query Examples

```bash
# Search by quote number
GET /api/quotes/?search=QT-2026-00001

# Search by customer name
GET /api/quotes/?search=ABC%20Company

# Search by title
GET /api/quotes/?search=Office%20Furniture

# Combined with filters
GET /api/quotes/?search=furniture&status=SENT&ordering=-created_at
```

### Expected Outcome
Fast, flexible search across quote fields.

### Verification Checklist
- [ ] SearchFilter configured
- [ ] search_fields list defined
- [ ] Includes quote_number
- [ ] Includes title, description
- [ ] Includes customer__name
- [ ] Includes customer_name
- [ ] Search works across all fields
- [ ] Case-insensitive search

---

## Task 75: Add Quote Status Actions

### Overview
Implement custom ViewSet actions for quote status transitions (send, accept, reject, convert).

### Dependencies
- Task 72: QuoteViewSet exists
- QuoteService with status methods

### Instructions

1. **Implement send_quote action**
   - @action(detail=True, methods=['post'])
   - Call QuoteService.send_quote()
   - Return updated quote

2. **Implement accept_quote action**
   - Call QuoteService.accept_quote()
   - Optional notes parameter

3. **Implement reject_quote action**
   - Call QuoteService.reject_quote()
   - Required reason parameter

4. **Implement convert_to_order action**
   - Call QuoteService.convert_to_order()
   - Return created order info

5. **Implement duplicate_quote action**
   - Call QuoteService.duplicate_quote()
   - Return new quote

6. **Add validation**
   - Check current status allows action
   - Check permissions
   - Return clear error messages

### Implementation

```python
# Add to QuoteViewSet class

@action(detail=True, methods=['post'])
def send_quote(self, request, pk=None):
    """
    Send quote to customer.
    
    POST /api/quotes/{id}/send_quote/
    Body: {}
    """
    quote = self.get_object()
    
    # Check permission
    if not request.user.has_perm('quotes.send_quote'):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if can send
    if quote.status not in ['DRAFT', 'REJECTED']:
        return Response(
            {'error': f'Cannot send quote with status {quote.get_status_display()}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Send quote
    service = QuoteService()
    try:
        service.send_quote(quote, request.user)
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Return updated quote
    serializer = self.get_serializer(quote)
    return Response(serializer.data)

@action(detail=True, methods=['post'])
def accept_quote(self, request, pk=None):
    """
    Accept quote.
    
    POST /api/quotes/{id}/accept_quote/
    Body: {"notes": "Accepted by customer"}
    """
    quote = self.get_object()
    notes = request.data.get('notes', '')
    
    # Accept quote
    service = QuoteService()
    try:
        service.accept_quote(quote, notes=notes, user=request.user)
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = self.get_serializer(quote)
    return Response(serializer.data)

@action(detail=True, methods=['post'])
def reject_quote(self, request, pk=None):
    """
    Reject quote.
    
    POST /api/quotes/{id}/reject_quote/
    Body: {"reason": "Price too high"}
    """
    quote = self.get_object()
    reason = request.data.get('reason')
    
    if not reason:
        return Response(
            {'error': 'Rejection reason is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Reject quote
    service = QuoteService()
    try:
        service.reject_quote(quote, reason=reason, user=request.user)
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = self.get_serializer(quote)
    return Response(serializer.data)

@action(detail=True, methods=['post'])
def convert_to_order(self, request, pk=None):
    """
    Convert quote to order.
    
    POST /api/quotes/{id}/convert_to_order/
    Body: {}
    """
    quote = self.get_object()
    
    # Check permission
    if not request.user.has_perm('quotes.convert_to_order'):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Convert to order
    service = QuoteService()
    try:
        order = service.convert_to_order(quote, request.user)
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Return order info
    return Response({
        'message': 'Quote converted to order successfully',
        'quote': self.get_serializer(quote).data,
        'order': {
            'id': order.id,
            'order_number': order.order_number,
            'url': request.build_absolute_uri(f'/api/orders/{order.id}/')
        }
    })

@action(detail=True, methods=['post'])
def duplicate_quote(self, request, pk=None):
    """
    Duplicate quote.
    
    POST /api/quotes/{id}/duplicate_quote/
    Body: {}
    """
    quote = self.get_object()
    
    # Duplicate
    service = QuoteService()
    new_quote = service.duplicate_quote(quote, request.user)
    
    # Return new quote
    serializer = self.get_serializer(new_quote)
    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )
```

### Status Action Endpoints

| Endpoint | Method | Description | Required Body |
|----------|--------|-------------|---------------|
| `/api/quotes/{id}/send_quote/` | POST | Send to customer | {} |
| `/api/quotes/{id}/accept_quote/` | POST | Accept quote | {notes: string} |
| `/api/quotes/{id}/reject_quote/` | POST | Reject quote | {reason: string} |
| `/api/quotes/{id}/convert_to_order/` | POST | Convert to order | {} |
| `/api/quotes/{id}/duplicate_quote/` | POST | Duplicate quote | {} |

### Usage Examples

```javascript
// Send quote
await fetch(`/api/quotes/${quoteId}/send_quote/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

// Accept quote
await fetch(`/api/quotes/${quoteId}/accept_quote/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    notes: 'Accepted by customer via phone'
  })
});

// Reject quote
await fetch(`/api/quotes/${quoteId}/reject_quote/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reason: 'Price exceeds budget'
  })
});

// Convert to order
const response = await fetch(`/api/quotes/${quoteId}/convert_to_order/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

const result = await response.json();
console.log('Order created:', result.order.order_number);

// Duplicate quote
const dupResponse = await fetch(`/api/quotes/${quoteId}/duplicate_quote/`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

const newQuote = await dupResponse.json();
```

### Expected Outcome
Complete status transition actions with validation and error handling.

### Verification Checklist
- [ ] send_quote action implemented
- [ ] accept_quote action implemented
- [ ] reject_quote action implemented
- [ ] convert_to_order action implemented
- [ ] duplicate_quote action implemented
- [ ] Permission checks added
- [ ] Status validation
- [ ] QuoteService method calls
- [ ] Error handling
- [ ] Clear error messages
- [ ] Updated quote returned
- [ ] Order info returned (convert)
- [ ] New quote returned (duplicate)

---

## Summary

After completing Tasks 69-75, the Quote module will have:

### Serializers
- QuoteLineItemSerializer with product display
- QuoteSerializer with nested line items
- QuoteListSerializer for optimized lists
- Calculated fields (totals, status, expiry)
- Custom display fields
- Comprehensive validation

### ViewSet
- Full CRUD operations
- Optimized querysets (select_related, prefetch_related)
- Tenant filtering
- Service layer integration
- Transaction safety
- Lock validation

### Filtering & Search
- Status filtering (multiple)
- Customer filtering
- Date range filtering
- Amount range filtering
- Boolean filters (expired, has_pdf)
- Full-text search
- Ordering support

### Status Actions
- send_quote endpoint
- accept_quote endpoint
- reject_quote endpoint
- convert_to_order endpoint
- duplicate_quote endpoint
- Permission checking
- Validation
- Error handling

### Complete API
```
GET    /api/quotes/                        # List quotes
POST   /api/quotes/                        # Create quote
GET    /api/quotes/{id}/                   # Get quote
PUT    /api/quotes/{id}/                   # Update quote
DELETE /api/quotes/{id}/                   # Delete quote
POST   /api/quotes/{id}/send_quote/        # Send to customer
POST   /api/quotes/{id}/accept_quote/      # Accept
POST   /api/quotes/{id}/reject_quote/      # Reject
POST   /api/quotes/{id}/convert_to_order/  # Convert
POST   /api/quotes/{id}/duplicate_quote/   # Duplicate
```

### Next Steps
Proceed to [02_Tasks-76-82_Email-Public-URLs.md](02_Tasks-76-82_Email-Public-URLs.md) to implement email service, templates, Celery tasks, public views, and URL registration.
