# Tasks 86-90: Actions, URLs, Tests & Docs

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02 (Tasks 86-90)

---

## Navigation

- **↑ Parent:** [Group F Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-85_Serializers-ViewSets.md](./01_Tasks-81-85_Serializers-ViewSets.md)

---

## Document Overview

### **Purpose**
Complete the Credit/Loyalty API with custom actions, URL registration, comprehensive tests, and module documentation.

### **Scope**
- Custom ViewSet actions for credit operations
- Custom ViewSet actions for loyalty operations
- URL routing configuration
- Unit and integration tests
- API documentation and usage guides

### **Key Outcomes**
1. ✅ Credit actions (approve, suspend, adjust, write_off)
2. ✅ Loyalty actions (award_points, redeem, upgrade_tier)
3. ✅ URL patterns registered
4. ✅ Comprehensive test coverage
5. ✅ Module documentation complete

---

## Tasks Covered

| Task # | Title | Complexity | Est. Time | Status |
|--------|-------|------------|-----------|--------|
| 86 | Add Credit Actions | Medium | 30 min | ⏳ Not Started |
| 87 | Add Loyalty Actions | Medium | 30 min | ⏳ Not Started |
| 88 | Register Credit/Loyalty API URLs | Low | 20 min | ⏳ Not Started |
| 89 | Create Credit & Loyalty Tests | High | 45 min | ⏳ Not Started |
| 90 | Create Module Documentation | Medium | 35 min | ⏳ Not Started |

---

## Task Implementation Summary

### Task 86: Add Credit Actions

**File:** `apps/credit/views/credit_viewset.py` (extend)

**Purpose:** Add custom actions for credit management operations.

**Actions to Implement:**

**1. Approve Credit Account:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def approve(self, request, pk=None):
    """Approve a pending credit application"""
    credit = self.get_object()
    
    if credit.status != CustomerCredit.Status.PENDING:
        return Response(
            {'error': 'Only pending accounts can be approved'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    credit.status = CustomerCredit.Status.ACTIVE
    credit.approved_by = request.user
    credit.approved_at = timezone.now()
    credit.save()
    
    # Log transaction
    CreditTransaction.objects.create(
        customer_credit=credit,
        transaction_type='APPROVED',
        notes=f'Approved by {request.user.get_full_name()}',
        performed_by=request.user
    )
    
    serializer = self.get_serializer(credit)
    return Response(serializer.data)
```

**2. Suspend Credit Account:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def suspend(self, request, pk=None):
    """Suspend a credit account"""
    credit = self.get_object()
    reason = request.data.get('reason', 'No reason provided')
    
    credit.status = CustomerCredit.Status.SUSPENDED
    credit.save()
    
    CreditTransaction.objects.create(
        customer_credit=credit,
        transaction_type='SUSPENDED',
        notes=f'Suspended: {reason}',
        performed_by=request.user
    )
    
    serializer = self.get_serializer(credit)
    return Response(serializer.data)
```

**3. Adjust Credit Limit:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def adjust_limit(self, request, pk=None):
    """Adjust credit limit"""
    credit = self.get_object()
    new_limit = request.data.get('new_limit')
    reason = request.data.get('reason', '')
    
    if not new_limit or Decimal(new_limit) < 0:
        return Response(
            {'error': 'Valid new_limit required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    old_limit = credit.credit_limit
    credit.credit_limit = Decimal(new_limit)
    credit.save()
    
    CreditTransaction.objects.create(
        customer_credit=credit,
        transaction_type='LIMIT_ADJUSTMENT',
        notes=f'Limit adjusted from Rs. {old_limit} to Rs. {new_limit}. Reason: {reason}',
        performed_by=request.user
    )
    
    serializer = self.get_serializer(credit)
    return Response(serializer.data)
```

**4. Write Off Bad Debt:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def write_off(self, request, pk=None):
    """Write off bad debt"""
    credit = self.get_object()
    amount = request.data.get('amount')
    reason = request.data.get('reason', 'Bad debt write-off')
    
    if not amount:
        amount = credit.balance  # Write off full balance
    
    amount = Decimal(amount)
    if amount > credit.balance:
        return Response(
            {'error': 'Write-off amount exceeds balance'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from apps.credit.services import CreditService
    result = CreditService.write_off_balance(
        credit.id,
        amount,
        reason,
        request.user
    )
    
    if result['success']:
        serializer = self.get_serializer(credit)
        return Response(serializer.data)
    else:
        return Response(
            {'error': result['error']},
            status=status.HTTP_400_BAD_REQUEST
        )
```

**5. Record Payment:**
```python
@action(detail=True, methods=['post'])
def record_payment(self, request, pk=None):
    """Record a credit payment"""
    credit = self.get_object()
    amount = request.data.get('amount')
    payment_method = request.data.get('payment_method', 'CASH')
    reference = request.data.get('reference', '')
    
    if not amount or Decimal(amount) <= 0:
        return Response(
            {'error': 'Valid payment amount required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from apps.credit.services import CreditService
    result = CreditService.record_payment(
        credit.id,
        Decimal(amount),
        payment_method,
        reference,
        request.user
    )
    
    if result['success']:
        serializer = self.get_serializer(credit)
        return Response({
            'credit': serializer.data,
            'payment': result['payment'],
            'new_balance': result['new_balance']
        })
    else:
        return Response(
            {'error': result['error']},
            status=status.HTTP_400_BAD_REQUEST
        )
```

**Usage:**
```
POST /api/credit/{id}/approve/
POST /api/credit/{id}/suspend/ {"reason": "Payment default"}
POST /api/credit/{id}/adjust_limit/ {"new_limit": 100000, "reason": "Increased sales"}
POST /api/credit/{id}/write_off/ {"amount": 5000, "reason": "Uncollectable"}
POST /api/credit/{id}/record_payment/ {"amount": 10000, "payment_method": "BANK_TRANSFER"}
```

---

### Task 87: Add Loyalty Actions

**File:** `apps/credit/views/loyalty_viewset.py` (extend)

**Purpose:** Custom actions for loyalty operations.

**Actions to Implement:**

**1. Award Points:**
```python
@action(detail=True, methods=['post'])
def award_points(self, request, pk=None):
    """Award loyalty points to customer"""
    loyalty = self.get_object()
    points = request.data.get('points')
    reason = request.data.get('reason', 'Manual award')
    reference = request.data.get('reference', '')
    
    if not points or int(points) <= 0:
        return Response(
            {'error': 'Valid points amount required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from apps.credit.services import LoyaltyService
    result = LoyaltyService.award_points(
        loyalty.id,
        int(points),
        reason,
        reference,
        performed_by=request.user
    )
    
    if result['success']:
        serializer = self.get_serializer(loyalty)
        return Response({
            'loyalty': serializer.data,
            'points_awarded': points,
            'new_balance': result['new_balance'],
            'transaction': result['transaction_id']
        })
    else:
        return Response(
            {'error': result['error']},
            status=status.HTTP_400_BAD_REQUEST
        )
```

**2. Redeem Points:**
```python
@action(detail=True, methods=['post'])
def redeem_points(self, request, pk=None):
    """Redeem loyalty points"""
    loyalty = self.get_object()
    points = request.data.get('points')
    order_id = request.data.get('order_id', '')
    
    if not points or int(points) <= 0:
        return Response(
            {'error': 'Valid points amount required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from apps.credit.services import LoyaltyService
    result = LoyaltyService.redeem_points(
        loyalty.id,
        int(points),
        order_id
    )
    
    if result['success']:
        serializer = self.get_serializer(loyalty)
        return Response({
            'loyalty': serializer.data,
            'points_redeemed': points,
            'discount_value': result['discount_value'],
            'new_balance': result['new_balance']
        })
    else:
        return Response(
            {'error': result['error']},
            status=status.HTTP_400_BAD_REQUEST
        )
```

**3. Upgrade Tier:**
```python
@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def upgrade_tier(self, request, pk=None):
    """Manually upgrade customer tier"""
    loyalty = self.get_object()
    new_tier_id = request.data.get('tier_id')
    reason = request.data.get('reason', 'Manual upgrade')
    
    if not new_tier_id:
        return Response(
            {'error': 'tier_id required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        new_tier = LoyaltyTier.objects.get(id=new_tier_id)
    except LoyaltyTier.DoesNotExist:
        return Response(
            {'error': 'Tier not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    from apps.credit.services import TierService
    result = TierService.upgrade_tier(
        loyalty.id,
        new_tier,
        reason,
        request.user
    )
    
    if result['success']:
        serializer = self.get_serializer(loyalty)
        return Response({
            'loyalty': serializer.data,
            'old_tier': result['old_tier_name'],
            'new_tier': result['new_tier_name'],
            'message': 'Tier upgraded successfully'
        })
    else:
        return Response(
            {'error': result['error']},
            status=status.HTTP_400_BAD_REQUEST
        )
```

**4. Calculate Tier Eligibility:**
```python
@action(detail=True, methods=['get'])
def tier_eligibility(self, request, pk=None):
    """Check eligibility for tier upgrades"""
    loyalty = self.get_object()
    
    from apps.credit.services import TierService
    eligibility = TierService.evaluate_tier(loyalty.id)
    
    return Response({
        'current_tier': loyalty.tier.name if loyalty.tier else None,
        'eligible_for_upgrade': eligibility['upgrade_available'],
        'next_tier': eligibility.get('next_tier_name'),
        'points_needed': eligibility.get('points_needed', 0),
        'spend_needed': eligibility.get('spend_needed', 0),
    })
```

**5. Points Forecast:**
```python
@action(detail=True, methods=['get'])
def points_forecast(self, request, pk=None):
    """Forecast points expiry"""
    loyalty = self.get_object()
    days = int(request.query_params.get('days', 90))
    
    from apps.credit.services import LoyaltyService
    forecast = LoyaltyService.get_points_breakdown(loyalty.id)
    
    return Response({
        'current_balance': loyalty.points_balance,
        'expiring_in_30_days': forecast['expiring_in_30_days'],
        'expiring_in_60_days': forecast['expiring_in_60_days'],
        'expiring_in_90_days': forecast['expiring_in_90_days'],
        'never_expire': forecast['never_expire'],
        'breakdown': forecast['transactions']
    })
```

**Usage:**
```
POST /api/loyalty/{id}/award_points/ {"points": 1000, "reason": "Birthday bonus"}
POST /api/loyalty/{id}/redeem_points/ {"points": 500, "order_id": "uuid..."}
POST /api/loyalty/{id}/upgrade_tier/ {"tier_id": "uuid...", "reason": "VIP customer"}
GET /api/loyalty/{id}/tier_eligibility/
GET /api/loyalty/{id}/points_forecast/?days=90
```

---

### Task 88: Register Credit/Loyalty API URLs

**File:** `apps/credit/urls.py`

**Purpose:** Register all ViewSets and endpoints.

**URL Configuration:**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.credit.views import (
    CreditViewSet,
    LoyaltyViewSet,
    CreditLoyaltyDashboardView,
    StoreCreditViewSet,
    PointsPromotionViewSet
)

# Create router
router = DefaultRouter()

# Register ViewSets
router.register(r'credit', CreditViewSet, basename='credit')
router.register(r'loyalty', LoyaltyViewSet, basename='loyalty')
router.register(r'store-credit', StoreCreditViewSet, basename='store-credit')
router.register(r'promotions', PointsPromotionViewSet, basename='promotions')

# URL patterns
urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Dashboard
    path('dashboard/', CreditLoyaltyDashboardView.as_view(), name='dashboard'),
    
    # Additional custom endpoints
    path('reports/credit-aging/', views.CreditAgingReportView.as_view(), name='credit-aging-report'),
    path('reports/loyalty-analytics/', views.LoyaltyAnalyticsView.as_view(), name='loyalty-analytics'),
]

# API Endpoints Generated:
# Credit:
#   GET    /api/credit/ - List
#   POST   /api/credit/ - Create
#   GET    /api/credit/{id}/ - Retrieve
#   PUT    /api/credit/{id}/ - Update
#   PATCH  /api/credit/{id}/ - Partial Update
#   DELETE /api/credit/{id}/ - Delete
#   POST   /api/credit/{id}/approve/
#   POST   /api/credit/{id}/suspend/
#   POST   /api/credit/{id}/adjust_limit/
#   POST   /api/credit/{id}/write_off/
#   POST   /api/credit/{id}/record_payment/
#   GET    /api/credit/{id}/transactions/
#   GET    /api/credit/{id}/aging_report/
#   GET    /api/credit/statistics/
#
# Loyalty:
#   GET    /api/loyalty/ - List
#   POST   /api/loyalty/ - Create
#   GET    /api/loyalty/{id}/ - Retrieve
#   PATCH  /api/loyalty/{id}/ - Update
#   POST   /api/loyalty/{id}/award_points/
#   POST   /api/loyalty/{id}/redeem_points/
#   POST   /api/loyalty/{id}/upgrade_tier/
#   GET    /api/loyalty/{id}/tier_eligibility/
#   GET    /api/loyalty/{id}/points_forecast/
#   GET    /api/loyalty/{id}/points_history/
#   GET    /api/loyalty/{id}/tier_progress/
#   GET    /api/loyalty/dashboard/
#
# Store Credit:
#   GET    /api/store-credit/ - List
#   GET    /api/store-credit/{id}/ - Retrieve
#   POST   /api/store-credit/{id}/issue/
#   POST   /api/store-credit/{id}/redeem/
#   GET    /api/store-credit/{id}/balance/
#
# Dashboard:
#   GET    /api/dashboard/
```

**Main Project URLs Integration:**

```python
# In main urls.py or config/urls.py
from django.urls import path, include

urlpatterns = [
    # ... other patterns ...
    path('api/credit/', include('apps.credit.urls')),
]
```

---

### Task 89: Create Credit & Loyalty Tests

**File:** `apps/credit/tests/test_credit.py`

**Purpose:** Comprehensive test coverage for credit module.

**Test Structure:**

```python
import pytest
from decimal import Decimal
from django.utils import timezone
from apps.credit.models import CustomerCredit, CreditTransaction
from apps.credit.services import CreditService

@pytest.mark.django_db
class TestCustomerCreditModel:
    """Test CustomerCredit model"""
    
    def test_create_credit_account(self, customer, tenant):
        """Test creating credit account"""
        credit = CustomerCredit.objects.create(
            customer=customer,
            tenant=tenant,
            credit_limit=Decimal('50000.00'),
            payment_terms=30
        )
        
        assert credit.id is not None
        assert credit.balance == Decimal('0.00')
        assert credit.available_credit == Decimal('50000.00')
        assert credit.status == CustomerCredit.Status.ACTIVE
    
    def test_available_credit_calculation(self, credit_account):
        """Test available credit calculation"""
        credit = credit_account
        credit.credit_limit = Decimal('100000.00')
        credit.balance = Decimal('30000.00')
        credit.save()
        
        assert credit.available_credit == Decimal('70000.00')
    
    def test_credit_status_transitions(self, credit_account):
        """Test status transitions"""
        credit = credit_account
        
        # Active -> Suspended
        credit.status = CustomerCredit.Status.SUSPENDED
        credit.save()
        assert credit.status == CustomerCredit.Status.SUSPENDED
        
        # Suspended -> Active
        credit.status = CustomerCredit.Status.ACTIVE
        credit.save()
        assert credit.status == CustomerCredit.Status.ACTIVE

@pytest.mark.django_db
class TestCreditService:
    """Test credit service methods"""
    
    def test_approve_credit(self, pending_credit, admin_user):
        """Test approving credit application"""
        result = CreditService.approve_credit(
            pending_credit.id,
            admin_user
        )
        
        assert result['success'] == True
        pending_credit.refresh_from_db()
        assert pending_credit.status == CustomerCredit.Status.ACTIVE
    
    def test_record_payment(self, credit_with_balance):
        """Test recording payment"""
        initial_balance = credit_with_balance.balance
        payment_amount = Decimal('5000.00')
        
        result = CreditService.record_payment(
            credit_with_balance.id,
            payment_amount,
            'CASH',
            'PMT-001'
        )
        
        assert result['success'] == True
        credit_with_balance.refresh_from_db()
        assert credit_with_balance.balance == initial_balance - payment_amount
    
    def test_aging_breakdown(self, credit_with_aging):
        """Test aging calculation"""
        aging = credit_with_aging.get_aging_breakdown()
        
        assert 'current' in aging
        assert 'days_30_60' in aging
        assert 'days_60_90' in aging
        assert 'over_90' in aging
        assert aging['total'] == credit_with_aging.balance

@pytest.mark.django_db
class TestCreditAPI:
    """Test Credit API endpoints"""
    
    def test_list_credits(self, api_client, credit_account):
        """Test listing credit accounts"""
        response = api_client.get('/api/credit/')
        
        assert response.status_code == 200
        assert len(response.data['results']) > 0
    
    def test_create_credit(self, api_client, customer):
        """Test creating credit via API"""
        data = {
            'customer': customer.id,
            'credit_limit': '75000.00',
            'payment_terms': 30
        }
        
        response = api_client.post('/api/credit/', data)
        
        assert response.status_code == 201
        assert response.data['credit_limit'] == '75000.00'
    
    def test_approve_credit_action(self, api_client, pending_credit, admin_user):
        """Test approve action"""
        api_client.force_authenticate(user=admin_user)
        response = api_client.post(f'/api/credit/{pending_credit.id}/approve/')
        
        assert response.status_code == 200
        assert response.data['status'] == 'ACTIVE'
    
    def test_credit_filtering(self, api_client, credit_accounts):
        """Test filtering credits"""
        response = api_client.get('/api/credit/?status=ACTIVE&balance_min=10000')
        
        assert response.status_code == 200
        for credit in response.data['results']:
            assert credit['status'] == 'ACTIVE'
            assert Decimal(credit['balance']) >= Decimal('10000.00')
```

**File:** `apps/credit/tests/test_loyalty.py`

```python
import pytest
from apps.credit.models import CustomerLoyalty, PointsTransaction
from apps.credit.services import LoyaltyService, TierService

@pytest.mark.django_db
class TestLoyaltyModel:
    """Test CustomerLoyalty model"""
    
    def test_create_loyalty_account(self, customer, loyalty_program):
        """Test creating loyalty account"""
        loyalty = CustomerLoyalty.objects.create(
            customer=customer,
            program=loyalty_program
        )
        
        assert loyalty.id is not None
        assert loyalty.points_balance == 0
        assert loyalty.lifetime_earned == 0
    
    def test_points_balance_updates(self, loyalty_account):
        """Test points balance updates"""
        loyalty = loyalty_account
        
        # Award points
        PointsTransaction.objects.create(
            customer_loyalty=loyalty,
            transaction_type='EARN',
            amount=1000
        )
        
        loyalty.points_balance += 1000
        loyalty.lifetime_earned += 1000
        loyalty.save()
        
        assert loyalty.points_balance == 1000
        assert loyalty.lifetime_earned == 1000

@pytest.mark.django_db
class TestLoyaltyService:
    """Test loyalty service methods"""
    
    def test_award_points(self, loyalty_account):
        """Test awarding points"""
        result = LoyaltyService.award_points(
            loyalty_account.id,
            500,
            'Purchase reward'
        )
        
        assert result['success'] == True
        loyalty_account.refresh_from_db()
        assert loyalty_account.points_balance == 500
    
    def test_redeem_points(self, loyalty_with_points):
        """Test redeeming points"""
        initial_balance = loyalty_with_points.points_balance
        
        result = LoyaltyService.redeem_points(
            loyalty_with_points.id,
            250,
            'ORDER-123'
        )
        
        assert result['success'] == True
        loyalty_with_points.refresh_from_db()
        assert loyalty_with_points.points_balance == initial_balance - 250
    
    def test_tier_evaluation(self, loyalty_account, tiers):
        """Test tier evaluation logic"""
        loyalty_account.lifetime_earned = 10000
        loyalty_account.save()
        
        result = TierService.evaluate_tier(loyalty_account.id)
        
        assert result['upgrade_available'] == True

@pytest.mark.django_db
class TestLoyaltyAPI:
    """Test Loyalty API endpoints"""
    
    def test_list_loyalty_accounts(self, api_client, loyalty_account):
        """Test listing loyalty accounts"""
        response = api_client.get('/api/loyalty/')
        
        assert response.status_code == 200
        assert len(response.data['results']) > 0
    
    def test_award_points_action(self, api_client, loyalty_account):
        """Test award points action"""
        data = {
            'points': 1000,
            'reason': 'Test reward'
        }
        
        response = api_client.post(
            f'/api/loyalty/{loyalty_account.id}/award_points/',
            data
        )
        
        assert response.status_code == 200
        assert response.data['points_awarded'] == 1000
```

**Fixtures:** `apps/credit/tests/conftest.py`

```python
import pytest
from decimal import Decimal
from apps.customers.models import Customer
from apps.credit.models import (
    CustomerCredit, CustomerLoyalty, LoyaltyProgram, LoyaltyTier
)

@pytest.fixture
def customer(db):
    """Create test customer"""
    return Customer.objects.create(
        first_name='Test',
        last_name='Customer',
        email='test@example.com'
    )

@pytest.fixture
def credit_account(db, customer):
    """Create test credit account"""
    return CustomerCredit.objects.create(
        customer=customer,
        credit_limit=Decimal('50000.00'),
        balance=Decimal('0.00')
    )

@pytest.fixture
def loyalty_program(db):
    """Create test loyalty program"""
    return LoyaltyProgram.objects.create(
        name='Test Program',
        points_per_currency=Decimal('0.10')
    )

@pytest.fixture
def loyalty_account(db, customer, loyalty_program):
    """Create test loyalty account"""
    return CustomerLoyalty.objects.create(
        customer=customer,
        program=loyalty_program
    )
```

**Run Tests:**
```bash
# Run all credit/loyalty tests
pytest apps/credit/tests/

# Run with coverage
pytest --cov=apps.credit apps/credit/tests/

# Run specific test class
pytest apps/credit/tests/test_credit.py::TestCreditService
```

---

### Task 90: Create Module Documentation

**File:** `apps/credit/README.md`

**Purpose:** Comprehensive module documentation covering architecture, APIs, and usage.

**Documentation Structure:**

```markdown
# Credit & Loyalty Management Module

## Overview

The Credit & Loyalty module manages:
- Customer credit accounts and terms
- Loyalty programs and points
- Store credits and gift cards
- Tier systems and rewards
- Points promotions

## Architecture

### Models

**CustomerCredit**
- Tracks customer credit limits and balances
- Manages payment terms and credit status
- Calculates aging and overdue amounts

**CustomerLoyalty**
- Loyalty program membership
- Points balance and transaction history
- Tier membership and benefits

**LoyaltyTier**
- Tier levels (Bronze, Silver, Gold, Platinum)
- Tier benefits (multipliers, discounts)
- Tier thresholds

**StoreCredit**
- Store credit balances
- Gift cards
- Refund credits
- Expiry management

**PointsPromotion**
- Bonus points campaigns
- Category-specific promotions
- Time-limited offers

### Services

**CreditService**
```python
CreditService.approve_credit(credit_id, user)
CreditService.record_payment(credit_id, amount, method, reference)
CreditService.write_off_balance(credit_id, amount, reason, user)
CreditService.get_aging_report(credit_id)
```

**LoyaltyService**
```python
LoyaltyService.award_points(loyalty_id, points, reason, reference)
LoyaltyService.redeem_points(loyalty_id, points, order_id)
LoyaltyService.get_points_breakdown(loyalty_id)
LoyaltyService.apply_birthday_reward(loyalty_id)
```

**TierService**
```python
TierService.evaluate_tier(loyalty_id)
TierService.upgrade_tier(loyalty_id, new_tier, reason, user)
TierService.get_tier_progress(loyalty_id)
```

**StoreCreditService**
```python
StoreCreditService.issue_credit(customer_id, amount, source, reference)
StoreCreditService.redeem_credit(customer_id, amount, order_id)
StoreCreditService.get_balance_breakdown(customer_id)
```

## API Endpoints

### Credit Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credit/` | List credit accounts |
| POST | `/api/credit/` | Create credit account |
| GET | `/api/credit/{id}/` | Get credit details |
| POST | `/api/credit/{id}/approve/` | Approve credit |
| POST | `/api/credit/{id}/suspend/` | Suspend account |
| POST | `/api/credit/{id}/adjust_limit/` | Adjust credit limit |
| POST | `/api/credit/{id}/write_off/` | Write off bad debt |
| POST | `/api/credit/{id}/record_payment/` | Record payment |
| GET | `/api/credit/{id}/transactions/` | Transaction history |
| GET | `/api/credit/{id}/aging_report/` | Aging breakdown |

### Loyalty Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loyalty/` | List loyalty accounts |
| POST | `/api/loyalty/` | Create loyalty account |
| GET | `/api/loyalty/{id}/` | Get loyalty details |
| POST | `/api/loyalty/{id}/award_points/` | Award points |
| POST | `/api/loyalty/{id}/redeem_points/` | Redeem points |
| POST | `/api/loyalty/{id}/upgrade_tier/` | Upgrade tier |
| GET | `/api/loyalty/{id}/tier_eligibility/` | Check tier eligibility |
| GET | `/api/loyalty/{id}/points_forecast/` | Points expiry forecast |
| GET | `/api/loyalty/{id}/points_history/` | Points transaction history |

### Store Credit Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/store-credit/` | List store credits |
| POST | `/api/store-credit/{id}/issue/` | Issue credit |
| POST | `/api/store-credit/{id}/redeem/` | Redeem credit |
| GET | `/api/store-credit/{id}/balance/` | Get balance |

## Usage Examples

### Credit Management

**Create Credit Account:**
```python
from apps.credit.services import CreditService

credit = CustomerCredit.objects.create(
    customer=customer,
    credit_limit=Decimal('100000.00'),
    payment_terms=30,
    interest_rate=Decimal('1.5')
)
```

**Approve Credit:**
```python
result = CreditService.approve_credit(credit.id, admin_user)
```

**Record Payment:**
```python
result = CreditService.record_payment(
    credit.id,
    amount=Decimal('25000.00'),
    payment_method='BANK_TRANSFER',
    reference='TXN-12345'
)
```

### Loyalty Management

**Award Points:**
```python
from apps.credit.services import LoyaltyService

result = LoyaltyService.award_points(
    loyalty.id,
    points=1000,
    reason='Purchase reward',
    reference='ORDER-789'
)
```

**Redeem Points:**
```python
result = LoyaltyService.redeem_points(
    loyalty.id,
    points=500,
    order_id='ORDER-790'
)

discount_value = result['discount_value']  # Rs. 500
```

**Check Tier Eligibility:**
```python
from apps.credit.services import TierService

progress = TierService.get_tier_progress(loyalty.id)

if progress['eligible_for_upgrade']:
    print(f"Eligible for {progress['next_tier_name']}")
    print(f"Need {progress['points_needed']} more points")
```

### Store Credit

**Issue Credit:**
```python
from apps.credit.services import StoreCreditService

result = StoreCreditService.issue_credit(
    customer_id=customer.id,
    amount=Decimal('5000.00'),
    source='REFUND',
    reference='INV-456'
)
```

**Redeem at Checkout:**
```python
result = StoreCreditService.apply_credit_to_order(
    order_id=order.id,
    credit_amount=Decimal('5000.00')
)
```

## Business Rules

### Credit Rules
1. Credit limit must be approved by admin
2. Payment terms default to 30 days
3. Late payments incur interest charges
4. Aging tracked in 30-day buckets
5. Bad debts can be written off by admin

### Loyalty Rules
1. Points earned: 1 point per Rs. 10 spent (configurable)
2. Points expire after 12 months (configurable)
3. Minimum 50% of balance must remain after redemption
4. Tier evaluation runs daily at 3:00 AM
5. Birthday rewards automated on customer birthday

### Store Credit Rules
1. Refund credits never expire
2. Promotional credits expire in 90 days
3. Gift credits expire in 180 days
4. Expired credits cannot be used
5. Credits applied before other discounts

## Celery Tasks

### Scheduled Tasks

**expire_loyalty_points** (Daily 2:00 AM)
- Expires points older than expiry period
- Creates EXPIRE transactions
- Sends expiry notifications

**evaluate_customer_tiers** (Daily 3:00 AM)
- Evaluates all loyalty accounts
- Upgrades/downgrades tiers
- Sends tier change notifications

**process_birthday_rewards** (Daily 6:00 AM)
- Finds customers with birthdays
- Awards birthday points/discounts
- Sends birthday greetings

**send_expiry_reminders** (Daily 7:00 AM)
- Finds points expiring in 30 days
- Sends reminder emails
- Finds store credits expiring soon

## Configuration

**Settings:**
```python
# Credit Settings
CREDIT_DEFAULT_PAYMENT_TERMS = 30  # days
CREDIT_DEFAULT_INTEREST_RATE = 1.5  # percent per month
CREDIT_AGING_BUCKETS = [30, 60, 90]  # days

# Loyalty Settings
LOYALTY_POINTS_PER_CURRENCY = 0.10  # 1 point per Rs. 10
LOYALTY_POINTS_EXPIRY_MONTHS = 12
LOYALTY_MIN_REDEEM_PERCENTAGE = 0.50  # Keep 50% balance

# Store Credit Settings
STORE_CREDIT_PROMOTIONAL_EXPIRY_DAYS = 90
STORE_CREDIT_GIFT_EXPIRY_DAYS = 180
```

## Testing

**Run Tests:**
```bash
pytest apps/credit/tests/
```

**Coverage:**
```bash
pytest --cov=apps.credit --cov-report=html apps/credit/tests/
```

## Sri Lanka Context

- Currency: LKR (Rs.)
- Payment terms aligned with local business practices
- Loyalty programs common in Sri Lankan retail
- Festival promotions (Vesak, Avurudu)
- Multi-language support (Sinhala, Tamil, English)

## License

Proprietary - [Company Name]
```

---

## Summary

### All Tasks Complete ✅

| Task # | Component | Status |
|--------|-----------|--------|
| 86 | Credit Actions | ✅ Complete |
| 87 | Loyalty Actions | ✅ Complete |
| 88 | URL Registration | ✅ Complete |
| 89 | Tests | ✅ Complete |
| 90 | Documentation | ✅ Complete |

### Key Deliverables

1. **Custom Actions:** approve, suspend, adjust_limit, write_off, record_payment, award_points, redeem_points, upgrade_tier
2. **URL Configuration:** All endpoints registered and documented
3. **Test Suite:** Comprehensive tests for models, services, and APIs
4. **Documentation:** Complete module documentation with examples

### API Summary

**Credit API:** 10+ endpoints covering full credit lifecycle
**Loyalty API:** 8+ endpoints for points and tier management
**Store Credit API:** 3 main endpoints for credit operations
**Dashboard API:** Aggregate analytics and reporting

### Testing Coverage

- Model tests: Create, update, calculations
- Service tests: Business logic, validations
- API tests: Endpoints, permissions, filtering
- Fixtures: Reusable test data

### Documentation

- Architecture overview
- API reference
- Usage examples
- Business rules
- Configuration guide
- Sri Lanka context

---

## Final Checklist

- [x] Group C (Tasks 33-50): 3 documents ✅
- [x] Group D (Tasks 51-66): 2 documents ✅
- [x] Group E (Tasks 67-80): 2 documents ✅
- [x] Group F (Tasks 81-90): 2 documents ✅
- [x] ALL 9 documents created ✅
- [x] Navigation links complete ✅
- [x] Consistent formatting ✅
- [x] Sri Lanka context included ✅

---

## Navigation

- **↑ Parent:** [Group F Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-85_Serializers-ViewSets.md](./01_Tasks-81-85_Serializers-ViewSets.md)
- **↑↑ SubPhase Summary:** [SubPhase-09 Overview](../00_TASKS_SUMMARY.md)

---

**Document End** - Tasks 86-90 Complete ✅  
**SubPhase-09 Customer Credit & Loyalty: ALL TASKS COMPLETE** ✅🎉
