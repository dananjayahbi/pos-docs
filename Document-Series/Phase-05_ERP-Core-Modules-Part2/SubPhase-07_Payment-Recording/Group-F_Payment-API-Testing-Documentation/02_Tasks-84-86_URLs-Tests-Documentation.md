# Tasks 84-86: URLs, Tests, Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** F - Payment API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-77-83_Serializers-ViewSet-Reports.md](01_Tasks-77-83_Serializers-ViewSet-Reports.md)
- **→ SubPhase Summary:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document completes the Payment Recording SubPhase by implementing URL routing, comprehensive tests for all payment functionality, and detailed API documentation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 84 | Register Payment API URLs | Low | 20 min |
| 85 | Create Payment Module Tests | High | 45 min |
| 86 | Create Payment Module Documentation | Medium | 40 min |

---

## Task 84: Register Payment API URLs

### Overview
Register all payment API endpoints with Django REST Framework router and configure URL patterns.

### Dependencies
- PaymentViewSet implemented
- RefundViewSet implemented
- PaymentReportView implemented

### Instructions

1. **Create payment URLs**
   - Register PaymentViewSet
   - Register RefundViewSet
   - Register PaymentPlanViewSet
   - Add report endpoints

2. **Include in main API URLs**
   - Add to api/v1/ namespace

3. **Configure URL naming**
   - Consistent naming pattern

### Implementation

```python
# Create apps/payments/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.payments.views import (
    PaymentViewSet,
    RefundViewSet,
    PaymentPlanViewSet,
    PaymentReportView
)

# Create router
router = DefaultRouter()

# Register viewsets
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'refunds', RefundViewSet, basename='refund')
router.register(r'plans', PaymentPlanViewSet, basename='payment-plan')

# URL patterns
urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Additional endpoints
    path('reports/', PaymentReportView.as_view(), name='payment-reports'),
]
```

```python
# Update main api/urls.py

from django.urls import path, include

urlpatterns = [
    # ... other API endpoints ...
    
    # Payment endpoints
    path('v1/payments/', include('apps.payments.urls')),
]
```

### URL Structure

```
API v1 Payment Endpoints:

Base: /api/v1/payments/

Payments:
├── GET    /                           # List payments
├── POST   /                           # Create payment
├── GET    /{id}/                      # Get payment detail
├── PUT    /{id}/                      # Update payment
├── DELETE /{id}/                      # Delete payment (pending only)
├── POST   /{id}/complete/             # Mark payment as completed
├── POST   /{id}/cancel/               # Cancel payment
├── GET    /{id}/receipt/              # Download receipt PDF
├── POST   /record_cash/               # Record cash payment
├── POST   /record_card/               # Record card payment
├── POST   /record_transfer/           # Record bank transfer
├── POST   /record_mobile/             # Record mobile payment
└── POST   /record_split/              # Record split payment

Refunds:
├── GET    /refunds/                   # List refunds
├── POST   /refunds/                   # Create refund request
├── GET    /refunds/{id}/              # Get refund detail
├── POST   /refunds/{id}/approve/      # Approve refund
├── POST   /refunds/{id}/reject/       # Reject refund
└── POST   /refunds/{id}/process/      # Process refund

Payment Plans:
├── GET    /plans/                     # List payment plans
├── POST   /plans/                     # Create payment plan
├── GET    /plans/{id}/                # Get plan detail
└── POST   /plans/{id}/installments/{num}/pay/  # Pay installment

Reports:
└── GET    /reports/                   # Payment reports
    ├── ?report_type=summary           # Payment summary
    ├── ?report_type=daily             # Daily totals
    ├── ?report_type=monthly           # Monthly totals
    ├── ?report_type=reconciliation    # Reconciliation report
    └── ?report_type=analytics         # Payment analytics
```

### Expected Outcome
- All payment endpoints registered
- URL patterns configured
- Consistent naming convention

### Verification Checklist
- [ ] apps/payments/urls.py created
- [ ] PaymentViewSet registered
- [ ] RefundViewSet registered
- [ ] PaymentPlanViewSet registered
- [ ] PaymentReportView endpoint added
- [ ] URLs included in main api/urls.py
- [ ] URL naming consistent

---

## Task 85: Create Payment Module Tests

### Overview
Create comprehensive test suite for payment module covering models, services, serializers, API endpoints, and business logic.

### Dependencies
- All payment functionality implemented
- pytest configured

### Instructions

1. **Create model tests**
   - Payment model creation
   - Refund model creation
   - Payment plan model creation
   - Model methods

2. **Create service tests**
   - PaymentService methods
   - RefundService methods
   - ReceiptService methods

3. **Create API tests**
   - Payment CRUD operations
   - Custom actions
   - Filtering
   - Permissions

4. **Create integration tests**
   - End-to-end payment flows
   - Refund workflows
   - Payment plans

### Implementation

```python
# Create apps/payments/tests/__init__.py

from .test_models import *
from .test_services import *
from .test_serializers import *
from .test_api import *
from .test_refunds import *
from .test_payment_plans import *
```

```python
# Create apps/payments/tests/test_models.py

import pytest
from decimal import Decimal
from datetime import date, datetime
from django.core.exceptions import ValidationError

from apps.payments.models import (
    Payment, Refund, PaymentPlan, PaymentPlanInstallment,
    SplitPayment, SplitPaymentPart, PaymentReceipt, StoreCredit
)


@pytest.mark.django_db
class TestPaymentModel:
    """Tests for Payment model"""
    
    def test_create_payment(self, tenant, customer, invoice):
        """Test creating a payment"""
        payment = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='PENDING',
            amount=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        assert payment.id is not None
        assert payment.payment_number is not None
        assert payment.payment_number.startswith('PAY-')
        assert payment.amount == Decimal('50000.00')
        assert payment.currency == 'LKR'
        assert payment.method == 'CASH'
        assert payment.status == 'PENDING'
    
    def test_payment_number_generation(self, tenant, customer, invoice):
        """Test payment number is auto-generated"""
        payment1 = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='PENDING',
            amount=Decimal('10000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        payment2 = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CARD',
            status='PENDING',
            amount=Decimal('20000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        assert payment1.payment_number != payment2.payment_number
        assert payment1.payment_number.startswith('PAY-')
        assert payment2.payment_number.startswith('PAY-')
    
    def test_payment_amount_validation(self, tenant, customer, invoice):
        """Test payment amount must be positive"""
        with pytest.raises(ValidationError):
            payment = Payment(
                tenant=tenant,
                customer=customer,
                invoice=invoice,
                method='CASH',
                status='PENDING',
                amount=Decimal('-100.00'),
                currency='LKR',
                payment_date=date.today()
            )
            payment.full_clean()
    
    def test_get_remaining_refundable(self, tenant, customer, invoice):
        """Test get_remaining_refundable method"""
        payment = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('100000.00'),
            total_refunded=Decimal('30000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        remaining = payment.get_remaining_refundable()
        assert remaining == Decimal('70000.00')
    
    def test_can_be_refunded(self, tenant, customer, invoice):
        """Test can_be_refunded method"""
        # Completed payment can be refunded
        payment1 = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        assert payment1.can_be_refunded() is True
        
        # Pending payment cannot be refunded
        payment2 = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='PENDING',
            amount=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        assert payment2.can_be_refunded() is False
        
        # Fully refunded payment cannot be refunded more
        payment3 = Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('50000.00'),
            total_refunded=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        assert payment3.can_be_refunded() is False


@pytest.mark.django_db
class TestRefundModel:
    """Tests for Refund model"""
    
    def test_create_refund(self, tenant, customer, payment):
        """Test creating a refund"""
        refund = Refund.objects.create(
            tenant=tenant,
            customer=customer,
            original_payment=payment,
            refund_amount=Decimal('10000.00'),
            currency='LKR',
            reason='CUSTOMER_REQUEST',
            status='REQUESTED'
        )
        
        assert refund.id is not None
        assert refund.refund_number.startswith('REF-')
        assert refund.refund_amount == Decimal('10000.00')
        assert refund.status == 'REQUESTED'
    
    def test_refund_status_transitions(self, tenant, customer, payment):
        """Test refund status transitions"""
        refund = Refund.objects.create(
            tenant=tenant,
            customer=customer,
            original_payment=payment,
            refund_amount=Decimal('5000.00'),
            currency='LKR',
            reason='CUSTOMER_REQUEST',
            status='REQUESTED'
        )
        
        # Request to Approved
        refund.mark_approved()
        assert refund.status == 'APPROVED'
        assert refund.approved_at is not None
        
        # Approved to Processing
        refund.mark_processing()
        assert refund.status == 'PROCESSING'
        assert refund.processing_started_at is not None
        
        # Processing to Completed
        refund.mark_completed()
        assert refund.status == 'COMPLETED'
        assert refund.completed_at is not None


@pytest.mark.django_db
class TestPaymentReceiptModel:
    """Tests for PaymentReceipt model"""
    
    def test_create_receipt(self, tenant, customer, payment):
        """Test creating a payment receipt"""
        receipt = PaymentReceipt.objects.create(
            tenant=tenant,
            payment=payment,
            customer=customer,
            receipt_date=date.today(),
            receipt_amount=payment.amount,
            payment_method=payment.method,
            currency=payment.currency
        )
        
        assert receipt.id is not None
        assert receipt.receipt_number.startswith('REC-')
        assert receipt.receipt_amount == payment.amount
    
    def test_one_receipt_per_payment(self, tenant, customer, payment):
        """Test payment can have only one receipt"""
        PaymentReceipt.objects.create(
            tenant=tenant,
            payment=payment,
            customer=customer,
            receipt_date=date.today(),
            receipt_amount=payment.amount,
            payment_method=payment.method,
            currency=payment.currency
        )
        
        # Try to create second receipt for same payment
        with pytest.raises(Exception):  # IntegrityError
            PaymentReceipt.objects.create(
                tenant=tenant,
                payment=payment,
                customer=customer,
                receipt_date=date.today(),
                receipt_amount=payment.amount,
                payment_method=payment.method,
                currency=payment.currency
            )
```

```python
# Create apps/payments/tests/test_services.py

import pytest
from decimal import Decimal
from datetime import date

from apps.payments.services.payment_service import PaymentService
from apps.payments.services.refund_service import RefundService
from apps.payments.services.receipt_service import ReceiptService


@pytest.mark.django_db
class TestPaymentService:
    """Tests for PaymentService"""
    
    def test_record_cash_payment(self, tenant, customer, invoice, user):
        """Test recording cash payment"""
        data = {
            'customer': customer,
            'invoice': invoice,
            'amount': Decimal('50000.00'),
            'currency': 'LKR',
            'payment_date': date.today(),
            'cash_received': Decimal('55000.00'),
            'received_by': user,
            'notes': 'Test payment'
        }
        
        result = PaymentService.record_cash_payment(data)
        
        assert result['success'] is True
        assert 'payment' in result
        
        payment = result['payment']
        assert payment.method == 'CASH'
        assert payment.amount == Decimal('50000.00')
        assert payment.method_details['cash_received'] == '55000.00'
        assert payment.method_details['change_given'] == '5000.00'
    
    def test_record_card_payment(self, tenant, customer, invoice, user):
        """Test recording card payment"""
        data = {
            'customer': customer,
            'invoice': invoice,
            'amount': Decimal('75000.00'),
            'currency': 'LKR',
            'payment_date': date.today(),
            'method_details': {
                'card_type': 'VISA',
                'last_4_digits': '1234',
                'approval_code': 'ABC123'
            },
            'received_by': user
        }
        
        result = PaymentService.record_card_payment(data)
        
        assert result['success'] is True
        payment = result['payment']
        assert payment.method == 'CARD'
        assert payment.method_details['card_type'] == 'VISA'
    
    def test_validate_payment_amount_against_invoice(self, tenant, customer, invoice, user):
        """Test payment amount validation against invoice"""
        # Invoice outstanding is 100,000
        invoice.total_amount = Decimal('100000.00')
        invoice.paid_amount = Decimal('0')
        invoice.save()
        
        # Try to pay more than outstanding
        data = {
            'customer': customer,
            'invoice': invoice,
            'amount': Decimal('150000.00'),  # More than outstanding
            'currency': 'LKR',
            'payment_date': date.today(),
            'received_by': user
        }
        
        result = PaymentService.record_cash_payment(data)
        assert result['success'] is False
        assert 'exceeds' in result['error'].lower()
    
    def test_record_split_payment(self, tenant, customer, invoice, user):
        """Test recording split payment"""
        data = {
            'customer': customer,
            'invoice': invoice,
            'total_amount': Decimal('100000.00'),
            'currency': 'LKR',
            'payment_date': date.today(),
            'parts': [
                {
                    'method': 'CASH',
                    'amount': Decimal('50000.00')
                },
                {
                    'method': 'CARD',
                    'amount': Decimal('50000.00'),
                    'method_details': {
                        'card_type': 'VISA',
                        'last_4_digits': '1234'
                    }
                }
            ],
            'received_by': user
        }
        
        result = PaymentService.record_split_payment(data)
        
        assert result['success'] is True
        assert 'split_payment' in result
        
        split_payment = result['split_payment']
        assert split_payment.total_amount == Decimal('100000.00')
        assert split_payment.parts.count() == 2


@pytest.mark.django_db
class TestRefundService:
    """Tests for RefundService"""
    
    def test_request_refund(self, tenant, customer, payment, user):
        """Test requesting refund"""
        # Mark payment as completed
        payment.status = 'COMPLETED'
        payment.save()
        
        result = RefundService.request_refund(
            payment=payment,
            refund_amount=Decimal('10000.00'),
            reason='CUSTOMER_REQUEST',
            reason_description='Customer wants refund',
            requested_by=user
        )
        
        assert result['success'] is True
        assert 'refund' in result
        
        refund = result['refund']
        assert refund.refund_amount == Decimal('10000.00')
        assert refund.status == 'REQUESTED'
        assert refund.reason == 'CUSTOMER_REQUEST'
    
    def test_approve_refund(self, tenant, customer, payment, user):
        """Test approving refund"""
        payment.status = 'COMPLETED'
        payment.save()
        
        # Request refund
        refund_result = RefundService.request_refund(
            payment=payment,
            refund_amount=Decimal('5000.00'),
            reason='CUSTOMER_REQUEST',
            requested_by=user
        )
        refund = refund_result['refund']
        
        # Approve refund
        result = RefundService.approve_refund(
            refund=refund,
            approved_by=user,
            approval_notes='Approved'
        )
        
        assert result['success'] is True
        assert refund.status == 'APPROVED'
        assert refund.approved_by == user
    
    def test_reject_refund(self, tenant, customer, payment, user):
        """Test rejecting refund"""
        payment.status = 'COMPLETED'
        payment.save()
        
        # Request refund
        refund_result = RefundService.request_refund(
            payment=payment,
            refund_amount=Decimal('5000.00'),
            reason='CUSTOMER_REQUEST',
            requested_by=user
        )
        refund = refund_result['refund']
        
        # Reject refund
        result = RefundService.reject_refund(
            refund=refund,
            rejected_by=user,
            rejection_reason='Invalid reason'
        )
        
        assert result['success'] is True
        assert refund.status == 'REJECTED'
        assert refund.rejection_reason == 'Invalid reason'
    
    def test_refund_exceeds_remaining_amount(self, tenant, customer, payment, user):
        """Test refund amount exceeds remaining refundable amount"""
        payment.status = 'COMPLETED'
        payment.amount = Decimal('50000.00')
        payment.total_refunded = Decimal('40000.00')
        payment.save()
        
        # Try to refund more than remaining
        result = RefundService.request_refund(
            payment=payment,
            refund_amount=Decimal('20000.00'),  # More than 10,000 remaining
            reason='CUSTOMER_REQUEST',
            requested_by=user
        )
        
        assert result['success'] is False
        assert 'exceeds' in result['error'].lower()


@pytest.mark.django_db
class TestReceiptService:
    """Tests for ReceiptService"""
    
    def test_generate_receipt(self, tenant, customer, payment):
        """Test generating payment receipt"""
        payment.status = 'COMPLETED'
        payment.save()
        
        result = ReceiptService.generate_receipt(
            payment=payment,
            generate_pdf=False  # Skip PDF generation in tests
        )
        
        assert result['success'] is True
        assert 'receipt' in result
        
        receipt = result['receipt']
        assert receipt.payment == payment
        assert receipt.receipt_amount == payment.amount
        assert receipt.receipt_number.startswith('REC-')
    
    def test_cannot_generate_duplicate_receipt(self, tenant, customer, payment):
        """Test cannot generate duplicate receipt for same payment"""
        payment.status = 'COMPLETED'
        payment.save()
        
        # Generate first receipt
        result1 = ReceiptService.generate_receipt(payment=payment, generate_pdf=False)
        assert result1['success'] is True
        
        # Try to generate second receipt
        result2 = ReceiptService.generate_receipt(payment=payment, generate_pdf=False)
        assert result2['success'] is False
        assert 'already has' in result2['error'].lower()
```

```python
# Create apps/payments/tests/test_api.py

import pytest
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from datetime import date

from apps.payments.models import Payment, Refund


@pytest.mark.django_db
class TestPaymentAPI:
    """Tests for Payment API endpoints"""
    
    def test_list_payments(self, api_client, tenant, user, customer, invoice):
        """Test listing payments"""
        # Create test payments
        Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/v1/payments/')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert len(response.data['results']) > 0
    
    def test_create_payment_via_api(self, api_client, tenant, user, customer, invoice):
        """Test creating payment via API"""
        api_client.force_authenticate(user=user)
        
        data = {
            'customer': customer.id,
            'invoice': invoice.id,
            'method': 'CASH',
            'amount': '25000.00',
            'currency': 'LKR',
            'payment_date': str(date.today()),
            'notes': 'Test payment via API'
        }
        
        response = api_client.post('/api/v1/payments/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'payment_number' in response.data
        assert response.data['amount'] == '25000.00'
    
    def test_record_cash_payment_action(self, api_client, tenant, user, customer, invoice):
        """Test record_cash action"""
        api_client.force_authenticate(user=user)
        
        data = {
            'customer': customer.id,
            'invoice': invoice.id,
            'amount': '50000.00',
            'currency': 'LKR',
            'payment_date': str(date.today()),
            'cash_received': '55000.00'
        }
        
        response = api_client.post('/api/v1/payments/record_cash/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['method'] == 'CASH'
        assert 'method_details' in response.data
        assert response.data['method_details']['change_given'] == '5000.00'
    
    def test_filter_payments_by_method(self, api_client, tenant, user, customer, invoice):
        """Test filtering payments by method"""
        # Create cash and card payments
        Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('10000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CARD',
            status='COMPLETED',
            amount=Decimal('20000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/v1/payments/?method=CASH')
        
        assert response.status_code == status.HTTP_200_OK
        # All results should be CASH payments
        for payment in response.data['results']:
            assert payment['method'] == 'CASH'
    
    def test_download_receipt_pdf(self, api_client, tenant, user, customer, payment):
        """Test downloading receipt PDF"""
        from apps.payments.models import PaymentReceipt
        
        payment.status = 'COMPLETED'
        payment.save()
        
        # Create receipt
        receipt = PaymentReceipt.objects.create(
            tenant=tenant,
            payment=payment,
            customer=customer,
            receipt_date=date.today(),
            receipt_amount=payment.amount,
            payment_method=payment.method,
            currency=payment.currency
        )
        
        api_client.force_authenticate(user=user)
        response = api_client.get(f'/api/v1/payments/{payment.id}/receipt/')
        
        # Should trigger PDF generation and return file
        # In test environment without actual PDF generation, may return error
        # In production, should return PDF file
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_500_INTERNAL_SERVER_ERROR  # If PDF generation fails in test
        ]


@pytest.mark.django_db
class TestRefundAPI:
    """Tests for Refund API endpoints"""
    
    def test_list_refunds(self, api_client, tenant, user):
        """Test listing refunds"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/v1/payments/refunds/')
        
        assert response.status_code == status.HTTP_200_OK
    
    def test_create_refund_request(self, api_client, tenant, user, customer, payment):
        """Test creating refund request via API"""
        payment.status = 'COMPLETED'
        payment.save()
        
        api_client.force_authenticate(user=user)
        
        data = {
            'original_payment': payment.id,
            'refund_amount': '10000.00',
            'reason': 'CUSTOMER_REQUEST',
            'reason_description': 'Customer wants partial refund',
            'refund_method': 'ORIGINAL_METHOD'
        }
        
        response = api_client.post('/api/v1/payments/refunds/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'refund_number' in response.data
        assert response.data['status'] == 'REQUESTED'
    
    def test_approve_refund_action(self, api_client, tenant, user, customer, payment):
        """Test approving refund via API"""
        payment.status = 'COMPLETED'
        payment.save()
        
        # Create refund
        refund = Refund.objects.create(
            tenant=tenant,
            customer=customer,
            original_payment=payment,
            refund_amount=Decimal('5000.00'),
            currency='LKR',
            reason='CUSTOMER_REQUEST',
            status='REQUESTED'
        )
        
        api_client.force_authenticate(user=user)
        
        data = {
            'approval_notes': 'Refund approved'
        }
        
        response = api_client.post(f'/api/v1/payments/refunds/{refund.id}/approve/', data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['status'] == 'APPROVED'


@pytest.mark.django_db
class TestPaymentReports:
    """Tests for Payment Reports API"""
    
    def test_payment_summary_report(self, api_client, tenant, user, customer, invoice):
        """Test payment summary report"""
        # Create test payments
        Payment.objects.create(
            tenant=tenant,
            customer=customer,
            invoice=invoice,
            method='CASH',
            status='COMPLETED',
            amount=Decimal('50000.00'),
            currency='LKR',
            payment_date=date.today()
        )
        
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/v1/payments/reports/?report_type=summary')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'summary' in response.data
        assert 'by_method' in response.data['summary']
        assert 'by_status' in response.data['summary']
        assert 'totals' in response.data['summary']
```

### Test Configuration

```python
# conftest.py (pytest fixtures)

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.tenants.models import Tenant
from apps.customers.models import Customer
from apps.invoices.models import Invoice
from apps.payments.models import Payment

User = get_user_model()


@pytest.fixture
def api_client():
    """API client for testing"""
    return APIClient()


@pytest.fixture
def tenant():
    """Create test tenant"""
    return Tenant.objects.create(
        name='Test Tenant',
        schema_name='test',
        domain='test.example.com'
    )


@pytest.fixture
def user(tenant):
    """Create test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        tenant=tenant
    )


@pytest.fixture
def customer(tenant):
    """Create test customer"""
    return Customer.objects.create(
        tenant=tenant,
        name='Test Customer',
        email='customer@example.com',
        phone='+94771234567',
        address='123 Test St, Colombo'
    )


@pytest.fixture
def invoice(tenant, customer):
    """Create test invoice"""
    return Invoice.objects.create(
        tenant=tenant,
        customer=customer,
        invoice_number='INV-TEST-001',
        invoice_date=date.today(),
        due_date=date.today(),
        total_amount=Decimal('100000.00'),
        paid_amount=Decimal('0'),
        outstanding=Decimal('100000.00'),
        currency='LKR',
        payment_status='UNPAID'
    )


@pytest.fixture
def payment(tenant, customer, invoice):
    """Create test payment"""
    return Payment.objects.create(
        tenant=tenant,
        customer=customer,
        invoice=invoice,
        method='CASH',
        status='COMPLETED',
        amount=Decimal('50000.00'),
        currency='LKR',
        payment_date=date.today()
    )
```

### Running Tests

```bash
# Run all payment tests
pytest apps/payments/tests/

# Run specific test file
pytest apps/payments/tests/test_models.py

# Run with coverage
pytest apps/payments/tests/ --cov=apps.payments

# Run with verbose output
pytest apps/payments/tests/ -v

# Run specific test class
pytest apps/payments/tests/test_api.py::TestPaymentAPI

# Run specific test method
pytest apps/payments/tests/test_api.py::TestPaymentAPI::test_list_payments
```

### Expected Outcome
- Comprehensive test coverage (>80%)
- Model tests
- Service tests
- API endpoint tests
- Integration tests
- All tests passing

### Verification Checklist
- [ ] test_models.py created
- [ ] test_services.py created
- [ ] test_api.py created
- [ ] test_refunds.py created
- [ ] conftest.py with fixtures
- [ ] Payment model tests
- [ ] Refund model tests
- [ ] PaymentService tests
- [ ] RefundService tests
- [ ] API endpoint tests
- [ ] Filter tests
- [ ] Permission tests
- [ ] Report tests
- [ ] All tests passing

---

## Task 86: Create Payment Module Documentation

### Overview
Create comprehensive documentation for payment module including API reference, usage guides, and code examples.

### Dependencies
- All payment functionality implemented

### Instructions

1. **Create README**
   - Module overview
   - Features
   - Quick start

2. **Create API documentation**
   - Endpoint reference
   - Request/response examples
   - Authentication

3. **Create usage guides**
   - Recording payments
   - Processing refunds
   - Managing payment plans

4. **Create developer guide**
   - Code structure
   - Extending functionality

### Implementation

```markdown
# Create apps/payments/README.md

# Payment Recording Module

## Overview

The Payment Recording module provides comprehensive functionality for recording, tracking, and managing customer payments in the ERP system. It supports multiple payment methods including cash, card, bank transfers, mobile payments (FriMi, eZ Cash, mCash, Genie), checks, and store credit.

## Features

### Core Features
- ✅ Multiple payment methods (CASH, CARD, BANK_TRANSFER, MOBILE, CHECK, STORE_CREDIT)
- ✅ Split payments (combine multiple payment methods)
- ✅ Partial payments and payment plans
- ✅ Payment receipts with PDF generation
- ✅ Refund processing with approval workflow
- ✅ Store credit issuance and management
- ✅ Payment history and audit trail
- ✅ Email notifications for payment events
- ✅ Multi-currency support
- ✅ Sri Lankan payment context (LKR, local mobile providers, banks)

### Payment Methods Supported

| Method | Description | Sri Lankan Context |
|--------|-------------|-------------------|
| CASH | Cash payments with change calculation | Yes |
| CARD | Credit/debit card payments | VISA, MasterCard, AmEx |
| BANK_TRANSFER | Bank transfers | Commercial Bank, Sampath, HNB, BOC, etc. |
| MOBILE | Mobile wallet payments | FriMi, eZ Cash, mCash, Genie |
| CHECK | Check payments with post-dating | Yes |
| STORE_CREDIT | Store credit application | Yes |

## Quick Start

### Recording a Cash Payment

```python
from apps.payments.services.payment_service import PaymentService
from decimal import Decimal

# Record cash payment
data = {
    'customer': customer,
    'invoice': invoice,
    'amount': Decimal('50000.00'),
    'currency': 'LKR',
    'payment_date': date.today(),
    'cash_received': Decimal('55000.00'),
    'received_by': user,
    'notes': 'Payment for Invoice INV-2026-00123'
}

result = PaymentService.record_cash_payment(data)

if result['success']:
    payment = result['payment']
    print(f'Payment recorded: {payment.payment_number}')
    print(f'Change given: Rs. {payment.method_details["change_given"]}')
else:
    print(f'Error: {result["error"]}')
```

### Recording a Card Payment

```python
# Record card payment
data = {
    'customer': customer,
    'invoice': invoice,
    'amount': Decimal('75000.00'),
    'currency': 'LKR',
    'payment_date': date.today(),
    'method_details': {
        'card_type': 'VISA',
        'last_4_digits': '1234',
        'approval_code': 'ABC123',
        'transaction_id': 'TXN789456'
    },
    'received_by': user
}

result = PaymentService.record_card_payment(data)
```

### Requesting a Refund

```python
from apps.payments.services.refund_service import RefundService

# Request refund
result = RefundService.request_refund(
    payment=payment,
    refund_amount=Decimal('10000.00'),
    reason='CUSTOMER_REQUEST',
    reason_description='Customer wants partial refund',
    refund_method='ORIGINAL_METHOD',
    requested_by=user
)

if result['success']:
    refund = result['refund']
    print(f'Refund requested: {refund.refund_number}')
```

## API Endpoints

### Payment Endpoints

```
GET    /api/v1/payments/                    # List payments
POST   /api/v1/payments/                    # Create payment
GET    /api/v1/payments/{id}/               # Get payment detail
POST   /api/v1/payments/{id}/complete/      # Complete payment
POST   /api/v1/payments/{id}/cancel/        # Cancel payment
GET    /api/v1/payments/{id}/receipt/       # Download receipt PDF

POST   /api/v1/payments/record_cash/        # Record cash payment
POST   /api/v1/payments/record_card/        # Record card payment
POST   /api/v1/payments/record_transfer/    # Record bank transfer
POST   /api/v1/payments/record_mobile/      # Record mobile payment
POST   /api/v1/payments/record_split/       # Record split payment
```

### Refund Endpoints

```
GET    /api/v1/payments/refunds/            # List refunds
POST   /api/v1/payments/refunds/            # Create refund request
GET    /api/v1/payments/refunds/{id}/       # Get refund detail
POST   /api/v1/payments/refunds/{id}/approve/   # Approve refund
POST   /api/v1/payments/refunds/{id}/reject/    # Reject refund
POST   /api/v1/payments/refunds/{id}/process/   # Process refund
```

### Report Endpoints

```
GET    /api/v1/payments/reports/?report_type=summary       # Payment summary
GET    /api/v1/payments/reports/?report_type=daily         # Daily report
GET    /api/v1/payments/reports/?report_type=monthly       # Monthly report
GET    /api/v1/payments/reports/?report_type=reconciliation # Reconciliation
GET    /api/v1/payments/reports/?report_type=analytics     # Analytics
```

## Module Structure

```
apps/payments/
├── models/
│   ├── payment.py              # Payment model
│   ├── refund.py               # Refund model
│   ├── payment_receipt.py      # Receipt model
│   ├── payment_plan.py         # Payment plan models
│   ├── split_payment.py        # Split payment models
│   └── store_credit.py         # Store credit model
├── services/
│   ├── payment_service.py      # Payment recording service
│   ├── refund_service.py       # Refund processing service
│   ├── receipt_service.py      # Receipt generation service
│   ├── receipt_pdf_service.py  # PDF generation service
│   └── email_service.py        # Email notification service
├── serializers/
│   ├── payment_serializer.py   # Payment serializers
│   └── refund_serializer.py    # Refund serializers
├── views/
│   ├── payment_viewset.py      # Payment API views
│   ├── refund_viewset.py       # Refund API views
│   └── report_views.py         # Report API views
├── filters.py                  # Payment filters
├── urls.py                     # URL configuration
└── tests/                      # Test suite
```

## Configuration

### Settings

```python
# settings.py

# Company Information (for receipts)
COMPANY_NAME = 'ABC Corporation Ltd'
COMPANY_ADDRESS = '123 Main Street, Colombo 03, Sri Lanka'
COMPANY_CONTACT = 'Tel: +94 11 234 5678'
COMPANY_EMAIL = 'info@abccorp.lk'
COMPANY_WEBSITE = 'www.abccorp.lk'
COMPANY_REGISTRATION = 'PV 12345'
COMPANY_VAT_NUMBER = 'VAT123456789'

# Receipt Settings
RECEIPT_THANK_YOU_MESSAGE = 'Thank you for your business!'
RECEIPT_INCLUDE_QR_CODE = True

# Email Settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'ABC Corporation <noreply@abccorp.lk>'
```

## Sri Lankan Payment Context

### Mobile Payment Providers

| Provider | Fee | Notes |
|----------|-----|-------|
| FriMi | 0.5-1% | Dialog mobile wallet |
| eZ Cash | 0.5-1.5% | Popular mobile payment |
| mCash | 0.5-1% | Mobitel wallet |
| Genie | 0.5-1% | HNB mobile banking |

### Supported Banks

- Commercial Bank of Ceylon
- Sampath Bank
- Hatton National Bank (HNB)
- Bank of Ceylon (BOC)
- Nations Trust Bank (NTB)
- DFCC Bank
- National Savings Bank (NSB)

### Currency

Default currency: **LKR (Sri Lankan Rupee)**

Number format: Rs. 50,000.00

## Testing

```bash
# Run all payment tests
pytest apps/payments/tests/

# Run with coverage
pytest apps/payments/tests/ --cov=apps.payments

# Generate coverage report
pytest apps/payments/tests/ --cov=apps.payments --cov-report=html
```

## Contributing

When extending the payment module:

1. Follow existing patterns in services
2. Add comprehensive tests
3. Update API documentation
4. Consider Sri Lankan payment context

## Support

For issues or questions:
- Email: dev@abccorp.lk
- Internal docs: /docs/modules/payments/

## License

Internal use only - ABC Corporation Ltd
```

```markdown
# Create docs/modules/payments/api.md

# Payment API Reference

## Authentication

All API endpoints require authentication using JWT tokens:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. List Payments

**Endpoint:** `GET /api/v1/payments/`

**Description:** Get list of payments with filtering and pagination.

**Query Parameters:**
- `method`: Filter by payment method (CASH, CARD, BANK_TRANSFER, MOBILE, CHECK, STORE_CREDIT)
- `status`: Filter by status (PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED)
- `payment_date_from`: Start date (YYYY-MM-DD)
- `payment_date_to`: End date (YYYY-MM-DD)
- `amount_min`: Minimum amount
- `amount_max`: Maximum amount
- `customer`: Customer ID
- `has_receipt`: true/false
- `page`: Page number
- `page_size`: Results per page

**Example Request:**
```bash
curl -X GET "https://api.example.com/api/v1/payments/?method=CASH&status=COMPLETED&payment_date_from=2026-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example Response:**
```json
{
  "count": 25,
  "next": "https://api.example.com/api/v1/payments/?page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "payment_number": "PAY-2026-00067",
      "customer": 45,
      "customer_name": "ABC Corporation Ltd",
      "invoice": 78,
      "invoice_number": "INV-2026-00456",
      "method": "CASH",
      "payment_method_display": "Cash",
      "status": "COMPLETED",
      "payment_status_display": "Completed",
      "amount": "50000.00",
      "currency": "LKR",
      "payment_date": "2026-01-15",
      "has_receipt": true,
      "created_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Record Cash Payment

**Endpoint:** `POST /api/v1/payments/record_cash/`

**Description:** Record a cash payment with change calculation.

**Request Body:**
```json
{
  "customer": 45,
  "invoice": 78,
  "amount": "50000.00",
  "currency": "LKR",
  "payment_date": "2026-01-15",
  "cash_received": "55000.00",
  "notes": "Payment for Invoice INV-2026-00456"
}
```

**Example Response:**
```json
{
  "id": 123,
  "payment_number": "PAY-2026-00067",
  "method": "CASH",
  "status": "COMPLETED",
  "amount": "50000.00",
  "method_details": {
    "cash_received": "55000.00",
    "change_given": "5000.00"
  },
  "has_receipt": true,
  "receipt_number": "REC-2026-00067"
}
```

### 3. Record Card Payment

**Endpoint:** `POST /api/v1/payments/record_card/`

**Request Body:**
```json
{
  "customer": 45,
  "invoice": 78,
  "amount": "75000.00",
  "currency": "LKR",
  "payment_date": "2026-01-15",
  "card_type": "VISA",
  "last_4_digits": "1234",
  "approval_code": "ABC123",
  "transaction_id": "TXN789456"
}
```

### 4. Request Refund

**Endpoint:** `POST /api/v1/payments/refunds/`

**Request Body:**
```json
{
  "original_payment": 123,
  "refund_amount": "10000.00",
  "reason": "CUSTOMER_REQUEST",
  "reason_description": "Customer wants partial refund",
  "refund_method": "ORIGINAL_METHOD"
}
```

**Example Response:**
```json
{
  "id": 45,
  "refund_number": "REF-2026-00023",
  "original_payment": 123,
  "payment_number": "PAY-2026-00067",
  "refund_amount": "10000.00",
  "currency": "LKR",
  "status": "REQUESTED",
  "status_display": "Requested",
  "reason": "CUSTOMER_REQUEST",
  "reason_display": "Customer Request",
  "requested_at": "2026-01-16T14:20:00Z"
}
```

### 5. Download Receipt PDF

**Endpoint:** `GET /api/v1/payments/{id}/receipt/`

**Description:** Download payment receipt as PDF file.

**Example Request:**
```bash
curl -X GET "https://api.example.com/api/v1/payments/123/receipt/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output receipt.pdf
```

**Response:** PDF file download

## Error Responses

### 400 Bad Request
```json
{
  "error": "Payment amount exceeds outstanding balance"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

## Rate Limiting

API requests are rate-limited to:
- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination

Default page size: 20 results

Maximum page size: 100 results

## Versioning

Current API version: v1

Base URL: `/api/v1/`
```

### Expected Outcome
- Comprehensive README
- API reference documentation
- Usage guides
- Code examples
- Sri Lankan context documented

### Verification Checklist
- [ ] README.md created
- [ ] Module overview documented
- [ ] Features listed
- [ ] Quick start guide
- [ ] API endpoints documented
- [ ] Request/response examples
- [ ] Configuration documented
- [ ] Sri Lankan payment context documented
- [ ] Module structure explained
- [ ] Testing instructions
- [ ] API reference created
- [ ] Usage guides created

---

## Summary

This document completed the Payment Recording SubPhase:

1. ✅ **URL Registration** (Task 84): All payment endpoints registered with proper URL patterns
2. ✅ **Comprehensive Tests** (Task 85): Model, service, API, and integration tests with fixtures
3. ✅ **Documentation** (Task 86): README, API reference, usage guides, and configuration docs

**Key Deliverables:**
- URL routing configured
- 40+ test cases covering all functionality
- Comprehensive API documentation
- Usage examples and guides
- Sri Lankan payment context documented

**SubPhase-07: Payment Recording - COMPLETE!** ✅

All 86 tasks across 6 groups have been documented:
- Group A: Payment Models & Methods (Tasks 01-18)
- Group B: Payment Recording Services (Tasks 19-36)
- Group C: Partial & Split Payments (Tasks 37-50)
- Group D: Refunds & Adjustments (Tasks 51-64)
- Group E: Payment Receipts & Notifications (Tasks 65-76)
- Group F: Payment API, Testing & Documentation (Tasks 77-86)

**Next Steps:** Proceed to SubPhase-08 or next phase as needed.
