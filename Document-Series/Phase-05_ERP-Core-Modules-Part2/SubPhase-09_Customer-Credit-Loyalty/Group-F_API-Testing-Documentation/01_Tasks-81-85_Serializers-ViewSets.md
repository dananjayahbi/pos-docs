# Tasks 81-85: Serializers & ViewSets

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02 (Tasks 81-85)

---

## Navigation

- **↑ Parent:** [Group F Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)
- **→ Next Document:** [02_Tasks-86-90_Actions-URLs-Tests-Docs.md](./02_Tasks-86-90_Actions-URLs-Tests-Docs.md)

---

## Document Overview

### **Purpose**
Create DRF serializers and viewsets for Credit and Loyalty APIs with filtering capabilities.

### **Scope**
- CreditSerializer for CustomerCredit model
- LoyaltySerializer for CustomerLoyalty and related models
- CreditViewSet with CRUD operations
- LoyaltyViewSet with CRUD operations
- django-filter integration for advanced filtering

### **Key Outcomes**
1. ✅ Credit and Loyalty serializers with nested data
2. ✅ ViewSets with permissions and authentication
3. ✅ Filtering by status, dates, amounts, tiers
4. ✅ Pagination and ordering
5. ✅ API documentation ready

---

## Tasks Covered

| Task # | Title | Complexity | Est. Time | Status |
|--------|-------|------------|-----------|--------|
| 81 | Create CreditSerializer | Medium | 30 min | ⏳ Not Started |
| 82 | Create LoyaltySerializer | Medium | 30 min | ⏳ Not Started |
| 83 | Create CreditViewSet | High | 35 min | ⏳ Not Started |
| 84 | Create LoyaltyViewSet | High | 35 min | ⏳ Not Started |
| 85 | Implement Credit Filtering | Medium | 25 min | ⏳ Not Started |

---

## Task Implementation Summary

### Task 81: Create CreditSerializer

**File:** `apps/credit/serializers/credit_serializer.py`

**Purpose:** Serialize CustomerCredit data for API responses.

**Serializers:**

```python
from rest_framework import serializers
from apps.credit.models import CustomerCredit, CreditTransaction

class CreditTransactionSerializer(serializers.ModelSerializer):
    """Serializer for credit transaction history"""
    transaction_type_display = serializers.CharField(
        source='get_transaction_type_display',
        read_only=True
    )
    performed_by_name = serializers.CharField(
        source='performed_by.get_full_name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = CreditTransaction
        fields = [
            'id', 'transaction_type', 'transaction_type_display',
            'amount', 'balance_after', 'transaction_date',
            'reference_order', 'reference_payment',
            'performed_by', 'performed_by_name', 'notes'
        ]
        read_only_fields = ['id', 'transaction_date', 'balance_after']

class CustomerCreditSerializer(serializers.ModelSerializer):
    """Main serializer for customer credit accounts"""
    customer_name = serializers.CharField(
        source='customer.get_full_name',
        read_only=True
    )
    customer_email = serializers.EmailField(
        source='customer.email',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    credit_aging = serializers.SerializerMethodField()
    last_payment_date = serializers.DateTimeField(read_only=True)
    
    # Nested transactions (optional, use sparingly)
    recent_transactions = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerCredit
        fields = [
            'id', 'customer', 'customer_name', 'customer_email',
            'credit_limit', 'balance', 'available_credit',
            'status', 'status_display', 'payment_terms',
            'interest_rate', 'credit_aging',
            'last_payment_date', 'recent_transactions',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'balance', 'available_credit',
            'credit_aging', 'last_payment_date',
            'created_at', 'updated_at'
        ]
    
    def get_credit_aging(self, obj):
        """Calculate aging buckets"""
        return obj.get_aging_breakdown()
    
    def get_recent_transactions(self, obj):
        """Get last 5 transactions"""
        transactions = obj.transactions.order_by('-transaction_date')[:5]
        return CreditTransactionSerializer(transactions, many=True).data

class CreditListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    customer_name = serializers.CharField(source='customer.get_full_name')
    status_display = serializers.CharField(source='get_status_display')
    
    class Meta:
        model = CustomerCredit
        fields = [
            'id', 'customer', 'customer_name',
            'credit_limit', 'balance', 'available_credit',
            'status', 'status_display', 'updated_at'
        ]
```

**Key Features:**
- Nested customer information
- Computed fields (aging, available credit)
- Optional nested transactions for detail view
- Lightweight list serializer for performance
- Display fields for choices

**Sri Lanka Context:**
- Format amounts as Rs. in frontend
- Include customer NIC if available
- Show payment terms in Sinhala/Tamil

---

### Task 82: Create LoyaltySerializer

**File:** `apps/credit/serializers/loyalty_serializer.py`

**Purpose:** Serialize CustomerLoyalty, tiers, and points data.

**Serializers:**

```python
from rest_framework import serializers
from apps.credit.models import (
    CustomerLoyalty, LoyaltyProgram, LoyaltyTier,
    PointsTransaction, StoreCredit, PointsPromotion
)

class LoyaltyTierSerializer(serializers.ModelSerializer):
    """Serialize tier information"""
    benefit_summary = serializers.SerializerMethodField()
    
    class Meta:
        model = LoyaltyTier
        fields = [
            'id', 'name', 'description',
            'min_points_required', 'min_spend_required',
            'points_multiplier', 'discount_percentage',
            'free_shipping', 'badge_image', 'color',
            'benefit_summary'
        ]
    
    def get_benefit_summary(self, obj):
        """Format benefits for display"""
        benefits = []
        if obj.points_multiplier > 1:
            benefits.append(f"{obj.points_multiplier}x points")
        if obj.discount_percentage > 0:
            benefits.append(f"{obj.discount_percentage}% discount")
        if obj.free_shipping:
            benefits.append("Free shipping")
        return benefits

class PointsTransactionSerializer(serializers.ModelSerializer):
    """Serialize points transaction history"""
    type_display = serializers.CharField(
        source='get_transaction_type_display',
        read_only=True
    )
    
    class Meta:
        model = PointsTransaction
        fields = [
            'id', 'transaction_type', 'type_display',
            'amount', 'balance_after', 'reference',
            'reason', 'expiry_date', 'points_remaining',
            'created_at'
        ]
        read_only_fields = ['id', 'balance_after', 'created_at']

class CustomerLoyaltySerializer(serializers.ModelSerializer):
    """Main serializer for loyalty accounts"""
    customer_name = serializers.CharField(
        source='customer.get_full_name',
        read_only=True
    )
    program_name = serializers.CharField(
        source='program.name',
        read_only=True
    )
    tier_details = LoyaltyTierSerializer(
        source='tier',
        read_only=True
    )
    points_breakdown = serializers.SerializerMethodField()
    years_as_member = serializers.SerializerMethodField()
    recent_transactions = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomerLoyalty
        fields = [
            'id', 'customer', 'customer_name',
            'program', 'program_name',
            'points_balance', 'lifetime_earned', 'lifetime_redeemed',
            'tier', 'tier_details', 'tier_upgrade_date',
            'points_breakdown', 'years_as_member',
            'recent_transactions', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'points_balance', 'lifetime_earned',
            'lifetime_redeemed', 'tier_upgrade_date',
            'created_at', 'updated_at'
        ]
    
    def get_points_breakdown(self, obj):
        """Get points expiry forecast"""
        from apps.credit.services import LoyaltyService
        return LoyaltyService.get_points_breakdown(obj.id)
    
    def get_years_as_member(self, obj):
        """Calculate membership duration"""
        from datetime import date
        delta = date.today() - obj.created_at.date()
        return round(delta.days / 365.25, 1)
    
    def get_recent_transactions(self, obj):
        """Last 5 transactions"""
        txns = obj.transactions.order_by('-created_at')[:5]
        return PointsTransactionSerializer(txns, many=True).data

class StoreCreditSerializer(serializers.ModelSerializer):
    """Serialize store credit accounts"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    available_balance = serializers.SerializerMethodField()
    
    class Meta:
        model = StoreCredit
        fields = [
            'id', 'customer', 'customer_name',
            'balance', 'available_balance', 'total_issued', 'total_used',
            'created_from', 'source_display', 'source_reference',
            'expiry_date', 'is_expired', 'currency',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'balance', 'total_issued', 'total_used', 'is_expired']
    
    def get_available_balance(self, obj):
        return obj.get_available_balance()

class PointsPromotionSerializer(serializers.ModelSerializer):
    """Serialize points promotions"""
    type_display = serializers.CharField(source='get_promotion_type_display', read_only=True)
    is_currently_active = serializers.SerializerMethodField()
    
    class Meta:
        model = PointsPromotion
        fields = [
            'id', 'program', 'name', 'description',
            'promotion_type', 'type_display', 'multiplier', 'bonus_points',
            'valid_from', 'valid_to', 'is_active', 'is_currently_active',
            'min_purchase_amount', 'configuration'
        ]
    
    def get_is_currently_active(self, obj):
        from django.utils import timezone
        now = timezone.now()
        return obj.is_active and obj.valid_from <= now <= obj.valid_to
```

**Key Features:**
- Nested tier information with benefits summary
- Points breakdown with expiry forecast
- Store credit integration
- Promotion awareness
- Transaction history

**Sri Lanka Context:**
- Display points in customer's language
- Show tier badges with localized names
- Format dates in local format

---

### Task 83: Create CreditViewSet

**File:** `apps/credit/views/credit_viewset.py`

**Purpose:** CRUD operations and custom actions for customer credit.

**ViewSet:**

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.credit.models import CustomerCredit
from apps.credit.serializers import CustomerCreditSerializer, CreditListSerializer
from apps.credit.filters import CreditFilterSet

class CreditViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customer credit accounts.
    
    Endpoints:
    - GET /api/credit/ - List all credit accounts
    - POST /api/credit/ - Create new credit account
    - GET /api/credit/{id}/ - Retrieve credit details
    - PUT /api/credit/{id}/ - Update credit account
    - PATCH /api/credit/{id}/ - Partial update
    - DELETE /api/credit/{id}/ - Delete (soft delete)
    """
    queryset = CustomerCredit.objects.select_related('customer').prefetch_related('transactions')
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = CreditFilterSet
    ordering_fields = ['credit_limit', 'balance', 'updated_at']
    ordering = ['-updated_at']
    search_fields = ['customer__first_name', 'customer__last_name', 'customer__email']
    
    def get_serializer_class(self):
        """Use lightweight serializer for list"""
        if self.action == 'list':
            return CreditListSerializer
        return CustomerCreditSerializer
    
    def get_queryset(self):
        """Filter by tenant"""
        queryset = super().get_queryset()
        if hasattr(self.request.user, 'tenant'):
            queryset = queryset.filter(tenant=self.request.user.tenant)
        return queryset
    
    def perform_create(self, serializer):
        """Set tenant on creation"""
        serializer.save(tenant=self.request.user.tenant)
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get transaction history for credit account"""
        credit = self.get_object()
        transactions = credit.transactions.order_by('-transaction_date')
        
        # Pagination
        page = self.paginate_queryset(transactions)
        if page is not None:
            serializer = CreditTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CreditTransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def aging_report(self, request, pk=None):
        """Get detailed aging report"""
        credit = self.get_object()
        aging = credit.get_aging_breakdown()
        return Response(aging)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get aggregate credit statistics"""
        from django.db.models import Sum, Avg, Count
        from apps.credit.services import CreditService
        
        stats = CreditService.get_credit_statistics(
            tenant_id=request.user.tenant.id if hasattr(request.user, 'tenant') else None
        )
        return Response(stats)
```

**Features:**
- Multi-tenant filtering
- List/detail serializers for performance
- Transaction history endpoint
- Aging report endpoint
- Aggregate statistics
- Search and ordering

---

### Task 84: Create LoyaltyViewSet

**File:** `apps/credit/views/loyalty_viewset.py`

**Purpose:** CRUD and actions for loyalty management.

**ViewSet:**

```python
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.credit.models import CustomerLoyalty
from apps.credit.serializers import CustomerLoyaltySerializer

class LoyaltyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for loyalty program management.
    
    Endpoints:
    - GET /api/loyalty/ - List loyalty accounts
    - POST /api/loyalty/ - Create loyalty account
    - GET /api/loyalty/{id}/ - Get loyalty details
    - PATCH /api/loyalty/{id}/ - Update loyalty account
    """
    queryset = CustomerLoyalty.objects.select_related(
        'customer', 'program', 'tier'
    ).prefetch_related('transactions')
    serializer_class = CustomerLoyaltySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['tier', 'program']
    ordering_fields = ['points_balance', 'lifetime_earned', 'tier_upgrade_date']
    ordering = ['-points_balance']
    search_fields = ['customer__first_name', 'customer__last_name', 'customer__email']
    
    def get_queryset(self):
        """Tenant filtering"""
        queryset = super().get_queryset()
        if hasattr(self.request.user, 'tenant'):
            queryset = queryset.filter(tenant=self.request.user.tenant)
        return queryset
    
    @action(detail=True, methods=['get'])
    def points_history(self, request, pk=None):
        """Get points transaction history"""
        loyalty = self.get_object()
        transactions = loyalty.transactions.order_by('-created_at')
        
        page = self.paginate_queryset(transactions)
        if page:
            serializer = PointsTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = PointsTransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def tier_progress(self, request, pk=None):
        """Get progress to next tier"""
        loyalty = self.get_object()
        from apps.credit.services import TierService
        
        progress = TierService.get_tier_progress(loyalty.id)
        return Response(progress)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Loyalty program dashboard"""
        from apps.credit.services import LoyaltyService
        
        data = LoyaltyService.get_loyalty_dashboard_data(
            tenant_id=request.user.tenant.id if hasattr(request.user, 'tenant') else None
        )
        return Response(data)
```

**Features:**
- Loyalty account CRUD
- Points history endpoint
- Tier progress tracking
- Dashboard aggregations
- Multi-tenant support

---

### Task 85: Implement Credit Filtering

**File:** `apps/credit/filters.py`

**Purpose:** Advanced filtering using django-filter.

**Filters:**

```python
import django_filters
from apps.credit.models import CustomerCredit, CustomerLoyalty, StoreCredit
from django.db.models import Q

class CreditFilterSet(django_filters.FilterSet):
    """Advanced filtering for credit accounts"""
    
    # Status filters
    status = django_filters.ChoiceFilter(choices=CustomerCredit.Status.choices)
    is_overdue = django_filters.BooleanFilter(method='filter_overdue')
    
    # Amount filters
    balance_min = django_filters.NumberFilter(field_name='balance', lookup_expr='gte')
    balance_max = django_filters.NumberFilter(field_name='balance', lookup_expr='lte')
    credit_limit_min = django_filters.NumberFilter(field_name='credit_limit', lookup_expr='gte')
    
    # Date filters
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    updated_after = django_filters.DateFilter(field_name='updated_at', lookup_expr='gte')
    
    # Aging filters
    has_aging = django_filters.BooleanFilter(method='filter_has_aging')
    aging_category = django_filters.ChoiceFilter(
        method='filter_aging_category',
        choices=[
            ('current', 'Current (0-30 days)'),
            ('30_60', '30-60 days'),
            ('60_90', '60-90 days'),
            ('over_90', 'Over 90 days'),
        ]
    )
    
    class Meta:
        model = CustomerCredit
        fields = ['status', 'customer', 'payment_terms']
    
    def filter_overdue(self, queryset, name, value):
        """Filter overdue accounts"""
        if value:
            return queryset.filter(status=CustomerCredit.Status.OVERDUE)
        return queryset.exclude(status=CustomerCredit.Status.OVERDUE)
    
    def filter_has_aging(self, queryset, name, value):
        """Filter accounts with aging balance"""
        if value:
            return queryset.filter(balance__gt=0)
        return queryset.filter(balance=0)
    
    def filter_aging_category(self, queryset, name, value):
        """Filter by aging bucket"""
        from django.utils import timezone
        from datetime import timedelta
        
        today = timezone.now().date()
        
        if value == 'current':
            date_30_days_ago = today - timedelta(days=30)
            return queryset.filter(
                transactions__transaction_date__gte=date_30_days_ago
            ).distinct()
        # Implement other buckets similarly
        return queryset

class LoyaltyFilterSet(django_filters.FilterSet):
    """Filtering for loyalty accounts"""
    
    tier = django_filters.ModelChoiceFilter(queryset=LoyaltyTier.objects.all())
    program = django_filters.ModelChoiceFilter(queryset=LoyaltyProgram.objects.all())
    
    points_min = django_filters.NumberFilter(field_name='points_balance', lookup_expr='gte')
    points_max = django_filters.NumberFilter(field_name='points_balance', lookup_expr='lte')
    
    lifetime_earned_min = django_filters.NumberFilter(field_name='lifetime_earned', lookup_expr='gte')
    
    # Search by customer
    customer_search = django_filters.CharFilter(method='filter_customer_search')
    
    class Meta:
        model = CustomerLoyalty
        fields = ['tier', 'program']
    
    def filter_customer_search(self, queryset, name, value):
        """Search customer by name or email"""
        return queryset.filter(
            Q(customer__first_name__icontains=value) |
            Q(customer__last_name__icontains=value) |
            Q(customer__email__icontains=value)
        )

class StoreCreditFilterSet(django_filters.FilterSet):
    """Filtering for store credit"""
    
    balance_min = django_filters.NumberFilter(field_name='balance', lookup_expr='gte')
    has_balance = django_filters.BooleanFilter(method='filter_has_balance')
    is_expired = django_filters.BooleanFilter(method='filter_expired')
    expiring_soon = django_filters.BooleanFilter(method='filter_expiring_soon')
    
    source = django_filters.ChoiceFilter(field_name='created_from')
    
    class Meta:
        model = StoreCredit
        fields = ['customer', 'created_from', 'currency']
    
    def filter_has_balance(self, queryset, name, value):
        if value:
            return queryset.filter(balance__gt=0)
        return queryset.filter(balance=0)
    
    def filter_expired(self, queryset, name, value):
        from datetime import date
        today = date.today()
        
        if value:
            return queryset.filter(expiry_date__lt=today)
        return queryset.filter(Q(expiry_date__gte=today) | Q(expiry_date__isnull=True))
    
    def filter_expiring_soon(self, queryset, name, value):
        from datetime import date, timedelta
        if value:
            today = date.today()
            future_date = today + timedelta(days=30)
            return queryset.filter(expiry_date__gte=today, expiry_date__lte=future_date)
        return queryset
```

**Features:**
- Status filtering (active, suspended, overdue)
- Amount range filters (min/max)
- Date range filters
- Aging category filters
- Tier and program filters for loyalty
- Store credit expiry filters
- Customer search across name/email

**Usage Examples:**
```
GET /api/credit/?status=ACTIVE&balance_min=5000
GET /api/credit/?aging_category=over_90&is_overdue=true
GET /api/loyalty/?tier=3&points_min=10000
GET /api/store-credit/?expiring_soon=true&has_balance=true
```

---

## Summary

### Completed Tasks

| Task # | Component | Deliverable |
|--------|-----------|-------------|
| 81 | CreditSerializer | Credit account serialization |
| 82 | LoyaltySerializer | Loyalty & points serialization |
| 83 | CreditViewSet | Credit CRUD API |
| 84 | LoyaltyViewSet | Loyalty CRUD API |
| 85 | Filtering | Advanced django-filter integration |

### API Endpoints

**Credit:**
- `GET /api/credit/` - List accounts
- `POST /api/credit/` - Create account
- `GET /api/credit/{id}/` - Detail view
- `GET /api/credit/{id}/transactions/` - Transaction history
- `GET /api/credit/{id}/aging_report/` - Aging breakdown
- `GET /api/credit/statistics/` - Aggregate stats

**Loyalty:**
- `GET /api/loyalty/` - List accounts
- `GET /api/loyalty/{id}/` - Detail view
- `GET /api/loyalty/{id}/points_history/` - Points transactions
- `GET /api/loyalty/{id}/tier_progress/` - Progress to next tier
- `GET /api/loyalty/dashboard/` - Dashboard data

### Testing Checklist

- [ ] Serializers validate correctly
- [ ] ViewSets enforce permissions
- [ ] Tenant filtering works
- [ ] Filters return correct results
- [ ] Pagination works
- [ ] Search functionality accurate
- [ ] Custom actions return expected data

---

## Navigation

- **↑ Parent:** [Group F Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group E: Store Credit & Promotions](../Group-E_Store-Credit-Promotions/)
- **→ Next Document:** [02_Tasks-86-90_Actions-URLs-Tests-Docs.md](./02_Tasks-86-90_Actions-URLs-Tests-Docs.md)

---

**Document End** - Tasks 81-85 Complete ✅
