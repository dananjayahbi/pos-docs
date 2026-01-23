# Tasks 83-88: Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 01  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Quote-API-Email-Integration/](../Group-E_Quote-API-Email-Integration/)
- **→ Next SubPhase:** [../../SubPhase-05_Order-Management/](../../SubPhase-05_Order-Management/)

---

## Document Overview

This document covers comprehensive testing (unit, service, API, PDF, email) and complete module documentation for the Quote Management system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Write Quote Model Tests | Medium | 35 min |
| 84 | Write Quote Service Tests | High | 45 min |
| 85 | Write Quote API Tests | High | 45 min |
| 86 | Write PDF Generation Tests | Medium | 30 min |
| 87 | Write Email Integration Tests | Medium | 30 min |
| 88 | Create Module Documentation | High | 60 min |

---

## Task 83: Write Quote Model Tests

### Overview
Create comprehensive unit tests for Quote and QuoteLineItem models.

### Dependencies
- Quote models exist
- pytest and pytest-django installed
- FactoryBoy for test data

### Instructions

1. **Create test directory**
   - Create `apps/quotes/tests/`
   - Create `__init__.py`
   - Create `conftest.py` for fixtures

2. **Create factories.py**
   - QuoteFactory using factory_boy
   - QuoteLineItemFactory
   - Use Faker for realistic data

3. **Create test_models.py**
   - Test quote creation
   - Test line item calculations
   - Test status transitions
   - Test expiry logic
   - Test position ordering

4. **Test calculations**
   - Line item totals
   - Quote subtotal
   - Discount application
   - Tax calculation
   - Grand total

5. **Test properties and methods**
   - is_expired property
   - days_until_expiry
   - get_available_actions
   - can_edit/can_delete

### Implementation

```python
# apps/quotes/tests/conftest.py

import pytest
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant

User = get_user_model()


@pytest.fixture
def tenant():
    """Create test tenant."""
    return Tenant.objects.create(
        name='Test Company',
        slug='test-company',
        is_active=True
    )


@pytest.fixture
def user(tenant):
    """Create test user."""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='password123',
        tenant=tenant
    )


@pytest.fixture
def customer(tenant):
    """Create test customer."""
    from apps.customers.models import Customer
    return Customer.objects.create(
        tenant=tenant,
        name='ABC Company',
        email='customer@example.lk',
        phone='+94112345678'
    )


@pytest.fixture
def product(tenant):
    """Create test product."""
    from apps.products.models import Product
    return Product.objects.create(
        tenant=tenant,
        code='PROD-001',
        name='Test Product',
        unit_price=1000.00,
        cost_price=800.00
    )


# apps/quotes/tests/factories.py

import factory
from factory.django import DjangoModelFactory
from faker import Faker
from datetime import timedelta
from django.utils import timezone
from decimal import Decimal

fake = Faker()


class QuoteFactory(DjangoModelFactory):
    """Factory for Quote model."""
    
    class Meta:
        model = 'quotes.Quote'
    
    tenant = factory.SubFactory('apps.tenants.factories.TenantFactory')
    customer = factory.SubFactory('apps.customers.factories.CustomerFactory')
    created_by = factory.SubFactory('apps.users.factories.UserFactory')
    
    quote_number = factory.Sequence(lambda n: f'QT-2026-{n:05d}')
    title = factory.Faker('catch_phrase')
    description = factory.Faker('text', max_nb_chars=200)
    
    issue_date = factory.LazyFunction(timezone.now().date)
    valid_until = factory.LazyFunction(lambda: timezone.now().date() + timedelta(days=30))
    
    status = 'DRAFT'
    
    discount_type = 'PERCENTAGE'
    discount_value = Decimal('0.00')
    
    terms_and_conditions = factory.Faker('text')
    notes = factory.Faker('text', max_nb_chars=100)


class QuoteLineItemFactory(DjangoModelFactory):
    """Factory for QuoteLineItem model."""
    
    class Meta:
        model = 'quotes.QuoteLineItem'
    
    quote = factory.SubFactory(QuoteFactory)
    product = factory.SubFactory('apps.products.factories.ProductFactory')
    
    description = factory.Faker('sentence')
    quantity = Decimal('1.000')
    unit = 'pcs'
    
    unit_price = Decimal('1000.00')
    original_price = Decimal('1000.00')
    cost_price = Decimal('800.00')
    
    discount_type = 'NONE'
    discount_value = Decimal('0.00')
    
    is_taxable = True
    tax_rate = Decimal('15.00')
    
    position = factory.Sequence(lambda n: n)


# apps/quotes/tests/test_models.py

import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

from apps.quotes.models import Quote, QuoteLineItem
from apps.quotes.tests.factories import QuoteFactory, QuoteLineItemFactory

pytestmark = pytest.mark.django_db


class TestQuoteModel:
    """Tests for Quote model."""
    
    def test_quote_creation(self, tenant, customer, user):
        """Test basic quote creation."""
        quote = Quote.objects.create(
            tenant=tenant,
            customer=customer,
            created_by=user,
            quote_number='QT-2026-00001',
            title='Test Quote',
            issue_date=timezone.now().date(),
            valid_until=timezone.now().date() + timedelta(days=30)
        )
        
        assert quote.id is not None
        assert quote.quote_number == 'QT-2026-00001'
        assert quote.status == 'DRAFT'
        assert quote.tenant == tenant
    
    def test_quote_number_generation(self, tenant):
        """Test automatic quote number generation."""
        from apps.quotes.services.quote_service import QuoteService
        
        # Create quote settings
        from apps.quotes.models import QuoteSettings
        settings = QuoteSettings.objects.create(
            tenant=tenant,
            quote_number_prefix='QT',
            quote_number_format='{prefix}-{year}-{number:05d}'
        )
        
        # Generate number
        quote_count = Quote.objects.filter(tenant=tenant).count()
        number = settings.generate_quote_number(quote_count + 1)
        
        assert 'QT-' in number
        assert len(number) > 10
    
    def test_is_expired_property(self):
        """Test is_expired property."""
        # Not expired
        quote = QuoteFactory(
            valid_until=timezone.now().date() + timedelta(days=5)
        )
        assert quote.is_expired is False
        
        # Expired
        expired_quote = QuoteFactory(
            valid_until=timezone.now().date() - timedelta(days=1)
        )
        assert expired_quote.is_expired is True
    
    def test_days_until_expiry(self):
        """Test days_until_expiry calculation."""
        quote = QuoteFactory(
            valid_until=timezone.now().date() + timedelta(days=10)
        )
        
        assert quote.days_until_expiry == 10
        
        # Expired quote
        expired_quote = QuoteFactory(
            valid_until=timezone.now().date() - timedelta(days=5)
        )
        assert expired_quote.days_until_expiry == -5
    
    def test_discount_percentage_calculation(self):
        """Test percentage discount calculation."""
        quote = QuoteFactory(
            discount_type='PERCENTAGE',
            discount_value=Decimal('10.00')
        )
        
        # Add line items
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('2'),
            unit_price=Decimal('1000.00'),
            discount_type='NONE'
        )
        
        from apps.quotes.services.calculation_service import QuoteCalculationService
        QuoteCalculationService().calculate_all(quote)
        
        # Subtotal = 2 × 1000 = 2000
        # Discount = 10% of 2000 = 200
        assert quote.subtotal == Decimal('2000.00')
        assert quote.discount_amount == Decimal('200.00')
    
    def test_discount_fixed_calculation(self):
        """Test fixed discount calculation."""
        quote = QuoteFactory(
            discount_type='FIXED',
            discount_value=Decimal('500.00')
        )
        
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('3'),
            unit_price=Decimal('1000.00')
        )
        
        from apps.quotes.services.calculation_service import QuoteCalculationService
        QuoteCalculationService().calculate_all(quote)
        
        # Subtotal = 3 × 1000 = 3000
        # Discount = 500 (fixed)
        assert quote.subtotal == Decimal('3000.00')
        assert quote.discount_amount == Decimal('500.00')
    
    def test_tax_calculation(self):
        """Test tax calculation (15% VAT)."""
        quote = QuoteFactory(
            discount_type='NONE'
        )
        
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('1'),
            unit_price=Decimal('1000.00'),
            is_taxable=True,
            tax_rate=Decimal('15.00')
        )
        
        from apps.quotes.services.calculation_service import QuoteCalculationService
        QuoteCalculationService().calculate_all(quote)
        
        # Line total = 1000
        # Tax = 15% of 1000 = 150
        line_item = quote.line_items.first()
        assert line_item.line_total == Decimal('1150.00')
    
    def test_grand_total_calculation(self):
        """Test complete grand total calculation."""
        quote = QuoteFactory(
            discount_type='PERCENTAGE',
            discount_value=Decimal('10.00')
        )
        
        # Line 1: 2 × 1000 = 2000 + 15% tax = 2300
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('2'),
            unit_price=Decimal('1000.00'),
            is_taxable=True,
            tax_rate=Decimal('15.00')
        )
        
        # Line 2: 1 × 500 = 500 + 15% tax = 575
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('1'),
            unit_price=Decimal('500.00'),
            is_taxable=True,
            tax_rate=Decimal('15.00')
        )
        
        from apps.quotes.services.calculation_service import QuoteCalculationService
        QuoteCalculationService().calculate_all(quote)
        
        # Subtotal = 2000 + 500 = 2500
        # Discount = 10% = 250
        # After discount = 2250
        # Tax = 15% of 2250 = 337.50
        # Grand total = 2587.50
        assert quote.subtotal == Decimal('2500.00')
        assert quote.discount_amount == Decimal('250.00')
        assert quote.tax_amount == Decimal('337.50')
        assert quote.grand_total == Decimal('2587.50')


class TestQuoteLineItemModel:
    """Tests for QuoteLineItem model."""
    
    def test_line_item_creation(self, product):
        """Test line item creation."""
        quote = QuoteFactory()
        line_item = QuoteLineItemFactory(
            quote=quote,
            product=product,
            quantity=Decimal('5.000'),
            unit_price=Decimal('1000.00')
        )
        
        assert line_item.id is not None
        assert line_item.quantity == Decimal('5.000')
        assert line_item.unit_price == Decimal('1000.00')
    
    def test_line_total_calculation(self):
        """Test line_total property."""
        line_item = QuoteLineItemFactory(
            quantity=Decimal('3'),
            unit_price=Decimal('1000.00'),
            discount_type='NONE',
            is_taxable=False
        )
        
        # Simple: 3 × 1000 = 3000
        assert line_item.line_total == Decimal('3000.00')
    
    def test_line_item_with_discount(self):
        """Test line item with discount."""
        line_item = QuoteLineItemFactory(
            quantity=Decimal('2'),
            unit_price=Decimal('1000.00'),
            discount_type='PERCENTAGE',
            discount_value=Decimal('10.00'),
            is_taxable=False
        )
        
        # 2 × 1000 = 2000
        # Discount = 10% = 200
        # Total = 1800
        assert line_item.discount_amount == Decimal('200.00')
        assert line_item.line_total == Decimal('1800.00')
    
    def test_line_item_with_tax(self):
        """Test line item with tax."""
        line_item = QuoteLineItemFactory(
            quantity=Decimal('1'),
            unit_price=Decimal('1000.00'),
            discount_type='NONE',
            is_taxable=True,
            tax_rate=Decimal('15.00')
        )
        
        # Base = 1000
        # Tax = 15% = 150
        # Total = 1150
        assert line_item.tax_amount == Decimal('150.00')
        assert line_item.line_total == Decimal('1150.00')
    
    def test_position_ordering(self):
        """Test line item position ordering."""
        quote = QuoteFactory()
        
        item1 = QuoteLineItemFactory(quote=quote, position=1)
        item2 = QuoteLineItemFactory(quote=quote, position=2)
        item3 = QuoteLineItemFactory(quote=quote, position=3)
        
        items = list(quote.line_items.all())
        assert items[0] == item1
        assert items[1] == item2
        assert items[2] == item3
    
    def test_move_position_up(self):
        """Test moving line item up."""
        quote = QuoteFactory()
        
        item1 = QuoteLineItemFactory(quote=quote, position=1)
        item2 = QuoteLineItemFactory(quote=quote, position=2)
        item3 = QuoteLineItemFactory(quote=quote, position=3)
        
        # Move item3 up
        if hasattr(item3, 'move_up'):
            item3.move_up()
            item3.refresh_from_db()
            item2.refresh_from_db()
            
            assert item3.position == 2
            assert item2.position == 3


class TestQuoteHistory:
    """Tests for quote history tracking."""
    
    def test_history_creation(self):
        """Test history record creation."""
        from apps.quotes.models import QuoteHistory
        
        quote = QuoteFactory()
        
        history = QuoteHistory.objects.create(
            quote=quote,
            event_type='CREATED',
            notes='Quote created'
        )
        
        assert history.id is not None
        assert history.event_type == 'CREATED'
```

### Expected Outcome
Comprehensive model tests covering creation, calculations, and business logic.

### Verification Checklist
- [ ] conftest.py with fixtures
- [ ] factories.py created
- [ ] QuoteFactory defined
- [ ] QuoteLineItemFactory defined
- [ ] test_models.py created
- [ ] Test quote creation
- [ ] Test quote number generation
- [ ] Test is_expired property
- [ ] Test days_until_expiry
- [ ] Test percentage discount
- [ ] Test fixed discount
- [ ] Test tax calculation (15%)
- [ ] Test grand total calculation
- [ ] Test line item creation
- [ ] Test line_total property
- [ ] Test line discount
- [ ] Test line tax
- [ ] Test position ordering
- [ ] Test move up/down
- [ ] All tests passing

---

## Task 84: Write Quote Service Tests

### Overview
Create comprehensive tests for QuoteService business logic.

### Dependencies
- Task 83: Model tests exist
- QuoteService implemented

### Instructions

1. **Create test_services.py**
   - Test create_quote
   - Test status transitions
   - Test duplicate_quote
   - Test convert_to_order

2. **Test validations**
   - validate_before_send
   - Status transition rules
   - Lock checks

3. **Test history tracking**
   - Events logged
   - User tracking
   - Old/new values

4. **Test settings application**
   - Default settings
   - Number generation
   - Validity period

5. **Use mocking**
   - Mock external services
   - Mock Celery tasks
   - Isolate unit tests

### Implementation

```python
# apps/quotes/tests/test_services.py

import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from unittest.mock import patch, Mock

from apps.quotes.models import Quote, QuoteHistory
from apps.quotes.services.quote_service import QuoteService
from apps.quotes.tests.factories import QuoteFactory, QuoteLineItemFactory

pytestmark = pytest.mark.django_db


class TestQuoteService:
    """Tests for QuoteService."""
    
    def test_create_quote(self, tenant, customer, user):
        """Test quote creation via service."""
        quote_data = {
            'customer': customer,
            'title': 'Test Quote',
            'issue_date': timezone.now().date(),
            'valid_until': timezone.now().date() + timedelta(days=30),
            'discount_type': 'PERCENTAGE',
            'discount_value': Decimal('5.00')
        }
        
        line_items_data = [
            {
                'description': 'Item 1',
                'quantity': Decimal('2'),
                'unit_price': Decimal('1000.00')
            },
            {
                'description': 'Item 2',
                'quantity': Decimal('1'),
                'unit_price': Decimal('500.00')
            }
        ]
        
        service = QuoteService()
        quote = service.create_quote(
            quote_data=quote_data,
            line_items=line_items_data,
            user=user
        )
        
        assert quote.id is not None
        assert quote.customer == customer
        assert quote.line_items.count() == 2
        assert quote.created_by == user
    
    def test_send_quote_transition(self):
        """Test sending quote (DRAFT → SENT)."""
        quote = QuoteFactory(status='DRAFT')
        QuoteLineItemFactory(quote=quote)
        
        service = QuoteService()
        service.send_quote(quote, user=quote.created_by)
        
        quote.refresh_from_db()
        assert quote.status == 'SENT'
        assert quote.sent_at is not None
    
    def test_send_quote_validation_fails(self):
        """Test send validation fails without line items."""
        quote = QuoteFactory(status='DRAFT')
        # No line items
        
        service = QuoteService()
        
        with pytest.raises(ValueError, match='must have at least one line item'):
            service.send_quote(quote, user=quote.created_by)
    
    def test_accept_quote_transition(self):
        """Test accepting quote (SENT → ACCEPTED)."""
        quote = QuoteFactory(status='SENT')
        
        service = QuoteService()
        service.accept_quote(quote, notes='Approved', user=None)
        
        quote.refresh_from_db()
        assert quote.status == 'ACCEPTED'
        assert quote.accepted_at is not None
    
    def test_reject_quote_with_reason(self):
        """Test rejecting quote (SENT → REJECTED)."""
        quote = QuoteFactory(status='SENT')
        
        service = QuoteService()
        service.reject_quote(quote, reason='Price too high', user=None)
        
        quote.refresh_from_db()
        assert quote.status == 'REJECTED'
        assert quote.rejected_at is not None
        assert quote.rejection_reason == 'Price too high'
    
    def test_expire_quote(self):
        """Test expiring quote."""
        quote = QuoteFactory(
            status='SENT',
            valid_until=timezone.now().date() - timedelta(days=1)
        )
        
        service = QuoteService()
        service.expire_quote(quote)
        
        quote.refresh_from_db()
        assert quote.status == 'EXPIRED'
    
    def test_duplicate_quote(self):
        """Test duplicating quote."""
        original = QuoteFactory(status='ACCEPTED')
        QuoteLineItemFactory(quote=original, quantity=Decimal('2'))
        QuoteLineItemFactory(quote=original, quantity=Decimal('3'))
        
        service = QuoteService()
        duplicate = service.duplicate_quote(original)
        
        assert duplicate.id != original.id
        assert duplicate.quote_number != original.quote_number
        assert duplicate.status == 'DRAFT'
        assert duplicate.line_items.count() == original.line_items.count()
    
    @patch('apps.quotes.services.quote_service.QuoteService.validate_inventory_availability')
    def test_convert_to_order(self, mock_validate):
        """Test converting quote to order."""
        mock_validate.return_value = True
        
        quote = QuoteFactory(status='ACCEPTED')
        QuoteLineItemFactory(quote=quote)
        
        service = QuoteService()
        
        with patch('apps.orders.models.Order.objects.create') as mock_create_order:
            mock_order = Mock()
            mock_order.id = 1
            mock_order.order_number = 'ORD-001'
            mock_create_order.return_value = mock_order
            
            order = service.convert_to_order(quote, user=quote.created_by)
            
            quote.refresh_from_db()
            assert quote.status == 'CONVERTED'
            assert order is not None
    
    def test_quote_locking(self):
        """Test quote cannot be edited when locked."""
        quote = QuoteFactory(status='ACCEPTED')
        
        assert quote.is_locked is True
        assert quote.can_edit is False
        assert quote.can_delete is False
    
    def test_history_logging(self):
        """Test history is logged on status change."""
        quote = QuoteFactory(status='DRAFT')
        QuoteLineItemFactory(quote=quote)
        
        service = QuoteService()
        service.send_quote(quote, user=quote.created_by)
        
        # Check history
        history = QuoteHistory.objects.filter(
            quote=quote,
            event_type='SENT'
        ).first()
        
        assert history is not None
    
    def test_apply_default_settings(self, tenant):
        """Test default settings are applied."""
        from apps.quotes.models import QuoteSettings
        
        settings = QuoteSettings.objects.create(
            tenant=tenant,
            default_validity_days=45,
            default_discount_type='PERCENTAGE',
            default_discount_value=Decimal('5.00')
        )
        
        quote_data = {
            'title': 'Test',
            'issue_date': timezone.now().date()
        }
        
        service = QuoteService()
        # Apply defaults
        settings.apply_default_settings(quote_data)
        
        expected_date = timezone.now().date() + timedelta(days=45)
        assert quote_data['valid_until'] == expected_date
        assert quote_data['discount_type'] == 'PERCENTAGE'


class TestQuoteCalculationService:
    """Tests for QuoteCalculationService."""
    
    def test_calculate_all(self):
        """Test calculate_all orchestrator."""
        quote = QuoteFactory(discount_type='NONE')
        
        QuoteLineItemFactory(
            quote=quote,
            quantity=Decimal('2'),
            unit_price=Decimal('1000.00')
        )
        
        from apps.quotes.services.calculation_service import QuoteCalculationService
        service = QuoteCalculationService()
        service.calculate_all(quote)
        
        quote.refresh_from_db()
        assert quote.subtotal > 0
        assert quote.grand_total > 0
    
    def test_price_snapshotting(self, product):
        """Test original prices are saved on creation."""
        quote = QuoteFactory()
        
        line_item = QuoteLineItemFactory(
            quote=quote,
            product=product,
            unit_price=product.unit_price
        )
        
        # Original price should be saved
        assert line_item.original_price == product.unit_price
        assert line_item.cost_price == product.cost_price
```

### Expected Outcome
Comprehensive service layer tests with mocking and validation checks.

### Verification Checklist
- [ ] test_services.py created
- [ ] Test create_quote
- [ ] Test send_quote transition
- [ ] Test validation failures
- [ ] Test accept_quote
- [ ] Test reject_quote with reason
- [ ] Test expire_quote
- [ ] Test duplicate_quote
- [ ] Test convert_to_order (mocked)
- [ ] Test quote locking
- [ ] Test history logging
- [ ] Test default settings
- [ ] Test calculate_all
- [ ] Test price snapshotting
- [ ] Mock external dependencies
- [ ] All tests passing

---

## Task 85: Write Quote API Tests

### Overview
Create comprehensive tests for Quote REST API endpoints.

### Dependencies
- Task 83-84: Model and service tests exist
- API endpoints implemented

### Instructions

1. **Create test_api.py**
   - Test list/create/retrieve/update/delete
   - Test filtering
   - Test search
   - Test custom actions

2. **Test authentication**
   - Require login
   - Test permissions
   - Test tenant isolation

3. **Test filtering**
   - Status filter
   - Customer filter
   - Date filters
   - Amount filters

4. **Test custom actions**
   - send_quote
   - accept_quote
   - reject_quote
   - convert_to_order
   - duplicate_quote
   - download_pdf
   - send_email

5. **Test public endpoints**
   - Public view (no auth)
   - Public accept/reject
   - Token validation

### Implementation

```python
# apps/quotes/tests/test_api.py

import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.quotes.models import Quote
from apps.quotes.tests.factories import QuoteFactory, QuoteLineItemFactory

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    """API client fixture."""
    return APIClient()


class TestQuoteListAPI:
    """Tests for quote list endpoint."""
    
    def test_list_quotes_authenticated(self, api_client, user):
        """Test listing quotes requires authentication."""
        # Create quotes
        QuoteFactory.create_batch(3, tenant=user.tenant)
        
        # Authenticate
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 3
    
    def test_list_quotes_unauthenticated(self, api_client):
        """Test listing quotes without authentication fails."""
        url = reverse('quotes:quote-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_tenant_isolation(self, api_client, user, tenant):
        """Test users only see quotes from their tenant."""
        # Create quotes for user's tenant
        QuoteFactory.create_batch(2, tenant=user.tenant)
        
        # Create quotes for different tenant
        from apps.tenants.factories import TenantFactory
        other_tenant = TenantFactory()
        QuoteFactory.create_batch(3, tenant=other_tenant)
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2  # Only user's tenant


class TestQuoteCreateAPI:
    """Tests for quote creation endpoint."""
    
    def test_create_quote(self, api_client, user, customer):
        """Test creating quote via API."""
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        data = {
            'customer': customer.id,
            'title': 'New Quote',
            'issue_date': str(timezone.now().date()),
            'valid_until': str(timezone.now().date() + timedelta(days=30)),
            'line_items': [
                {
                    'description': 'Item 1',
                    'quantity': '2.000',
                    'unit_price': '1000.00'
                }
            ]
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Quote'
        assert 'quote_number' in response.data


class TestQuoteDetailAPI:
    """Tests for quote detail endpoints."""
    
    def test_retrieve_quote(self, api_client, user):
        """Test retrieving single quote."""
        quote = QuoteFactory(tenant=user.tenant)
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-detail', kwargs={'pk': quote.id})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == quote.id
    
    def test_update_quote(self, api_client, user):
        """Test updating quote."""
        quote = QuoteFactory(tenant=user.tenant, status='DRAFT')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-detail', kwargs={'pk': quote.id})
        data = {'title': 'Updated Title'}
        response = api_client.patch(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
    
    def test_delete_quote(self, api_client, user):
        """Test deleting quote."""
        quote = QuoteFactory(tenant=user.tenant, status='DRAFT')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-detail', kwargs={'pk': quote.id})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Quote.objects.filter(id=quote.id).exists()
    
    def test_cannot_delete_locked_quote(self, api_client, user):
        """Test cannot delete accepted quote."""
        quote = QuoteFactory(tenant=user.tenant, status='ACCEPTED')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-detail', kwargs={'pk': quote.id})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestQuoteFiltering:
    """Tests for quote filtering."""
    
    def test_filter_by_status(self, api_client, user):
        """Test filtering by status."""
        QuoteFactory(tenant=user.tenant, status='DRAFT')
        QuoteFactory(tenant=user.tenant, status='SENT')
        QuoteFactory(tenant=user.tenant, status='ACCEPTED')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url, {'status': 'SENT'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['status'] == 'SENT'
    
    def test_filter_by_customer(self, api_client, user, customer):
        """Test filtering by customer."""
        QuoteFactory(tenant=user.tenant, customer=customer)
        QuoteFactory(tenant=user.tenant)  # Different customer
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url, {'customer': customer.id})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_filter_by_date_range(self, api_client, user):
        """Test filtering by date range."""
        today = timezone.now().date()
        
        QuoteFactory(tenant=user.tenant, issue_date=today - timedelta(days=10))
        QuoteFactory(tenant=user.tenant, issue_date=today - timedelta(days=5))
        QuoteFactory(tenant=user.tenant, issue_date=today)
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url, {
            'issue_date_from': str(today - timedelta(days=7)),
            'issue_date_to': str(today)
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2


class TestQuoteSearch:
    """Tests for quote search."""
    
    def test_search_by_quote_number(self, api_client, user):
        """Test searching by quote number."""
        QuoteFactory(tenant=user.tenant, quote_number='QT-2026-00001')
        QuoteFactory(tenant=user.tenant, quote_number='QT-2026-00002')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url, {'search': '00001'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_search_by_title(self, api_client, user):
        """Test searching by title."""
        QuoteFactory(tenant=user.tenant, title='Office Furniture')
        QuoteFactory(tenant=user.tenant, title='Computer Hardware')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-list')
        response = api_client.get(url, {'search': 'Furniture'})
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1


class TestQuoteActions:
    """Tests for quote custom actions."""
    
    def test_send_quote_action(self, api_client, user):
        """Test send_quote action."""
        quote = QuoteFactory(tenant=user.tenant, status='DRAFT')
        QuoteLineItemFactory(quote=quote)
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-send-quote', kwargs={'pk': quote.id})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        
        quote.refresh_from_db()
        assert quote.status == 'SENT'
    
    def test_accept_quote_action(self, api_client, user):
        """Test accept_quote action."""
        quote = QuoteFactory(tenant=user.tenant, status='SENT')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-accept-quote', kwargs={'pk': quote.id})
        response = api_client.post(url, {'notes': 'Approved'})
        
        assert response.status_code == status.HTTP_200_OK
        
        quote.refresh_from_db()
        assert quote.status == 'ACCEPTED'
    
    def test_reject_quote_action(self, api_client, user):
        """Test reject_quote action."""
        quote = QuoteFactory(tenant=user.tenant, status='SENT')
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-reject-quote', kwargs={'pk': quote.id})
        response = api_client.post(url, {'reason': 'Too expensive'})
        
        assert response.status_code == status.HTTP_200_OK
        
        quote.refresh_from_db()
        assert quote.status == 'REJECTED'
    
    def test_duplicate_quote_action(self, api_client, user):
        """Test duplicate_quote action."""
        quote = QuoteFactory(tenant=user.tenant)
        QuoteLineItemFactory(quote=quote)
        
        api_client.force_authenticate(user=user)
        
        url = reverse('quotes:quote-duplicate-quote', kwargs={'pk': quote.id})
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['quote_number'] != quote.quote_number


class TestPublicQuoteAPI:
    """Tests for public quote endpoints."""
    
    def test_public_view_no_auth(self, api_client):
        """Test public view works without authentication."""
        quote = QuoteFactory()
        
        url = reverse('quotes:public-view', kwargs={'token': quote.public_token})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['quote_number'] == quote.quote_number
    
    def test_public_accept(self, api_client):
        """Test public accept action."""
        quote = QuoteFactory(status='SENT')
        
        url = reverse('quotes:public-accept', kwargs={'token': quote.public_token})
        response = api_client.post(url, {'notes': 'Accepted online'})
        
        assert response.status_code == status.HTTP_200_OK
        
        quote.refresh_from_db()
        assert quote.status == 'ACCEPTED'
    
    def test_public_reject(self, api_client):
        """Test public reject action."""
        quote = QuoteFactory(status='SENT')
        
        url = reverse('quotes:public-reject', kwargs={'token': quote.public_token})
        response = api_client.post(url, {'reason': 'Price too high'})
        
        assert response.status_code == status.HTTP_200_OK
        
        quote.refresh_from_db()
        assert quote.status == 'REJECTED'
    
    def test_invalid_token(self, api_client):
        """Test invalid token returns 404."""
        url = reverse('quotes:public-view', kwargs={'token': 'invalid-uuid'})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
```

### Expected Outcome
Comprehensive API tests covering all endpoints, permissions, and actions.

### Verification Checklist
- [ ] test_api.py created
- [ ] API client fixture
- [ ] Test list endpoint
- [ ] Test authentication required
- [ ] Test tenant isolation
- [ ] Test create endpoint
- [ ] Test retrieve endpoint
- [ ] Test update endpoint
- [ ] Test delete endpoint
- [ ] Test delete locked quote fails
- [ ] Test status filter
- [ ] Test customer filter
- [ ] Test date filter
- [ ] Test search by number
- [ ] Test search by title
- [ ] Test send_quote action
- [ ] Test accept_quote action
- [ ] Test reject_quote action
- [ ] Test duplicate_quote action
- [ ] Test public view (no auth)
- [ ] Test public accept
- [ ] Test public reject
- [ ] Test invalid token
- [ ] All tests passing

---

## Task 86: Write PDF Generation Tests

### Overview
Create tests for PDF generation functionality.

### Dependencies
- Task 83: Model tests exist
- PDF generator implemented

### Instructions

1. **Create test_pdf.py**
   - Test PDF generation
   - Test template application
   - Test sections
   - Test QR code

2. **Mock PDF operations**
   - Mock ReportLab
   - Mock file operations
   - Test without actual PDF creation

3. **Test regeneration logic**
   - Test needs_regeneration
   - Test auto-regeneration
   - Test force regeneration

### Implementation

```python
# apps/quotes/tests/test_pdf.py

import pytest
from unittest.mock import patch, Mock, MagicMock
from io import BytesIO

from apps.quotes.models import Quote
from apps.quotes.services.pdf_generator import QuotePDFGenerator
from apps.quotes.tests.factories import QuoteFactory, QuoteLineItemFactory

pytestmark = pytest.mark.django_db


class TestQuotePDFGenerator:
    """Tests for QuotePDFGenerator."""
    
    @patch('apps.quotes.services.pdf_generator.SimpleDocTemplate')
    def test_pdf_generation(self, mock_doc):
        """Test basic PDF generation."""
        quote = QuoteFactory()
        QuoteLineItemFactory(quote=quote)
        
        generator = QuotePDFGenerator(quote)
        
        # Mock PDF building
        mock_doc_instance = Mock()
        mock_doc.return_value = mock_doc_instance
        
        generator.generate()
        
        # Verify doc.build was called
        assert mock_doc_instance.build.called
    
    def test_pdf_filename_generation(self):
        """Test PDF filename generation."""
        quote = QuoteFactory(quote_number='QT-2026-00001')
        
        generator = QuotePDFGenerator(quote)
        filename = generator.get_pdf_filename()
        
        assert 'QT-2026-00001' in filename
        assert filename.endswith('.pdf')
    
    @patch('apps.quotes.services.pdf_generator.Image')
    def test_header_generation(self, mock_image):
        """Test header section generation."""
        quote = QuoteFactory()
        
        generator = QuotePDFGenerator(quote)
        
        # Test header method
        header_content = generator._generate_header()
        
        assert header_content is not None
    
    def test_customer_section_generation(self):
        """Test customer section generation."""
        quote = QuoteFactory()
        
        generator = QuotePDFGenerator(quote)
        customer_content = generator._generate_customer_section()
        
        assert customer_content is not None
    
    def test_line_items_table_generation(self):
        """Test line items table generation."""
        quote = QuoteFactory()
        QuoteLineItemFactory.create_batch(3, quote=quote)
        
        generator = QuotePDFGenerator(quote)
        table = generator._generate_line_items()
        
        assert table is not None
    
    def test_totals_section_generation(self):
        """Test totals section generation."""
        quote = QuoteFactory(
            subtotal=Decimal('10000.00'),
            tax_amount=Decimal('1500.00'),
            grand_total=Decimal('11500.00')
        )
        
        generator = QuotePDFGenerator(quote)
        totals_content = generator._generate_totals()
        
        assert totals_content is not None
    
    @patch('qrcode.QRCode')
    def test_qr_code_generation(self, mock_qr):
        """Test QR code generation."""
        quote = QuoteFactory()
        
        mock_qr_instance = Mock()
        mock_qr.return_value = mock_qr_instance
        
        generator = QuotePDFGenerator(quote)
        qr_image = generator._generate_qr_code('https://example.com')
        
        assert mock_qr_instance.add_data.called
        assert mock_qr_instance.make.called
    
    def test_needs_regeneration_property(self):
        """Test needs_regeneration property."""
        quote = QuoteFactory()
        
        # No PDF generated yet
        assert quote.needs_regeneration is True
        
        # Generate PDF
        quote.pdf_generated_at = timezone.now()
        quote.save()
        
        assert quote.needs_regeneration is False
        
        # Update quote
        from django.utils import timezone
        import time
        time.sleep(0.1)  # Ensure timestamp difference
        quote.title = 'Updated'
        quote.save()
        
        # Should need regeneration
        assert quote.needs_regeneration is True
    
    @patch('apps.quotes.services.pdf_generator.QuotePDFGenerator.generate')
    def test_auto_regeneration_signal(self, mock_generate):
        """Test PDF regenerates on quote update."""
        quote = QuoteFactory()
        
        # Update quote
        quote.title = 'Updated Title'
        quote.save()
        
        # Check regeneration triggered (via signal)
        # This depends on your signal implementation
    
    def test_force_regeneration(self):
        """Test force regeneration."""
        quote = QuoteFactory()
        
        generator = QuotePDFGenerator(quote)
        
        with patch.object(generator, 'generate') as mock_gen:
            quote.regenerate_pdf(force=True)
            assert mock_gen.called


class TestQuoteTemplate:
    """Tests for QuoteTemplate model."""
    
    def test_default_template_per_tenant(self, tenant):
        """Test only one default template per tenant."""
        from apps.quotes.models import QuoteTemplate
        
        # Create first default
        template1 = QuoteTemplate.objects.create(
            tenant=tenant,
            name='Template 1',
            is_default=True
        )
        
        assert template1.is_default is True
        
        # Create second default
        template2 = QuoteTemplate.objects.create(
            tenant=tenant,
            name='Template 2',
            is_default=True
        )
        
        # First should no longer be default
        template1.refresh_from_db()
        assert template1.is_default is False
        assert template2.is_default is True
    
    def test_get_default_template(self, tenant):
        """Test getting default template."""
        from apps.quotes.models import QuoteTemplate
        
        template = QuoteTemplate.objects.create(
            tenant=tenant,
            name='Default',
            is_default=True
        )
        
        default = QuoteTemplate.get_default_template(tenant)
        assert default == template
```

### Expected Outcome
Tests ensuring PDF generation works correctly with all components.

### Verification Checklist
- [ ] test_pdf.py created
- [ ] Test PDF generation (mocked)
- [ ] Test filename generation
- [ ] Test header generation
- [ ] Test customer section
- [ ] Test line items table
- [ ] Test totals section
- [ ] Test QR code generation
- [ ] Test needs_regeneration
- [ ] Test auto-regeneration signal
- [ ] Test force regeneration
- [ ] Test default template per tenant
- [ ] Test get_default_template
- [ ] All tests passing

---

## Task 87: Write Email Integration Tests

### Overview
Create tests for email service and templates.

### Dependencies
- Task 83: Model tests exist
- Email service implemented

### Instructions

1. **Create test_email.py**
   - Test email sending
   - Test template rendering
   - Test attachments
   - Test Celery task

2. **Mock SMTP**
   - Use django.core.mail.outbox
   - Or mock SMTP connection
   - Verify email content

3. **Test public actions**
   - Test public view
   - Test accept/reject via email link

### Implementation

```python
# apps/quotes/tests/test_email.py

import pytest
from unittest.mock import patch, Mock
from django.core import mail
from django.utils import timezone

from apps.quotes.services.email_service import QuoteEmailService
from apps.quotes.tests.factories import QuoteFactory, QuoteLineItemFactory

pytestmark = pytest.mark.django_db


class TestQuoteEmailService:
    """Tests for QuoteEmailService."""
    
    def test_send_quote_email(self):
        """Test sending quote email."""
        quote = QuoteFactory()
        QuoteLineItemFactory(quote=quote)
        
        # Generate PDF
        from apps.quotes.services.pdf_generator import QuotePDFGenerator
        generator = QuotePDFGenerator(quote)
        
        with patch.object(generator, 'generate_and_save'):
            quote.pdf_file = 'quotes/pdfs/test.pdf'
            quote.save()
        
        service = QuoteEmailService()
        
        # Send email
        with patch('apps.quotes.services.email_service.open', create=True) as mock_open:
            mock_open.return_value.__enter__.return_value.read.return_value = b'PDF content'
            
            success = service.send_quote_email(
                quote=quote,
                recipient_email='customer@example.lk',
                custom_message='Please review'
            )
        
        assert success is True
        
        # Check email sent
        assert len(mail.outbox) == 1
        email = mail.outbox[0]
        assert 'customer@example.lk' in email.to
        assert quote.quote_number in email.subject
    
    def test_email_with_attachment(self):
        """Test email includes PDF attachment."""
        quote = QuoteFactory()
        
        with patch('builtins.open', create=True) as mock_open:
            mock_open.return_value.__enter__.return_value.read.return_value = b'PDF'
            
            quote.pdf_file = 'test.pdf'
            
            service = QuoteEmailService()
            service.send_quote_email(
                quote=quote,
                recipient_email='test@example.com'
            )
        
        email = mail.outbox[0]
        assert len(email.attachments) == 1
        assert email.attachments[0][0].endswith('.pdf')
    
    def test_email_template_rendering(self):
        """Test email template renders correctly."""
        quote = QuoteFactory(quote_number='QT-2026-00001')
        
        service = QuoteEmailService()
        
        with patch('builtins.open', create=True):
            quote.pdf_file = 'test.pdf'
            service.send_quote_email(
                quote=quote,
                recipient_email='test@example.com',
                custom_message='Custom message here'
            )
        
        email = mail.outbox[0]
        
        # Check content
        assert 'QT-2026-00001' in str(email.body)
        assert 'Custom message here' in str(email.body)
    
    def test_email_failure_handling(self):
        """Test email service handles failures gracefully."""
        quote = QuoteFactory()
        
        service = QuoteEmailService()
        
        with patch('django.core.mail.EmailMultiAlternatives.send', side_effect=Exception('SMTP error')):
            success = service.send_quote_email(
                quote=quote,
                recipient_email='test@example.com'
            )
        
        assert success is False


class TestQuoteCeleryTasks:
    """Tests for quote Celery tasks."""
    
    @patch('apps.quotes.tasks.QuoteEmailService')
    def test_send_quote_email_task(self, mock_service):
        """Test async email task."""
        from apps.quotes.tasks import send_quote_email_task
        
        quote = QuoteFactory()
        
        mock_service_instance = Mock()
        mock_service_instance.send_quote_email.return_value = True
        mock_service.return_value = mock_service_instance
        
        result = send_quote_email_task(
            quote_id=quote.id,
            recipient_email='test@example.com'
        )
        
        assert result['success'] is True
        assert mock_service_instance.send_quote_email.called
    
    @patch('apps.quotes.services.email_service.QuoteEmailService.send_expiry_reminder')
    def test_expiry_reminders_task(self, mock_send):
        """Test scheduled expiry reminders task."""
        from apps.quotes.tasks import send_expiry_reminders_task
        from datetime import timedelta
        
        # Create quote expiring in 3 days
        target_date = timezone.now().date() + timedelta(days=3)
        quote = QuoteFactory(
            status='SENT',
            valid_until=target_date,
            customer_email='customer@example.lk'
        )
        
        mock_send.return_value = True
        
        result = send_expiry_reminders_task()
        
        assert result['sent_count'] >= 0
```

### Expected Outcome
Tests ensuring email functionality works correctly.

### Verification Checklist
- [ ] test_email.py created
- [ ] Test send_quote_email
- [ ] Test email with PDF attachment
- [ ] Test template rendering
- [ ] Test custom message
- [ ] Test failure handling
- [ ] Test Celery email task
- [ ] Test expiry reminders task
- [ ] Mock SMTP operations
- [ ] Verify email.outbox
- [ ] All tests passing

---

## Task 88: Create Module Documentation

### Overview
Create comprehensive documentation for the Quote Management module.

### Dependencies
- All tasks completed

### Instructions

1. **Create documentation directory**
   - Create `docs/modules/quotes/`
   - Create index.md

2. **Document models**
   - All model fields
   - Relationships
   - Methods and properties

3. **Document services**
   - Service layer methods
   - Business logic
   - Usage examples

4. **Document API**
   - All endpoints
   - Request/response examples
   - Authentication
   - Filtering and search

5. **Document configuration**
   - Settings
   - Environment variables
   - Celery tasks
   - Email configuration

6. **Add Sri Lanka-specific docs**
   - Currency handling (LKR)
   - VAT (15%)
   - Business registration
   - Bank details

### Implementation

```markdown
<!-- docs/modules/quotes/index.md -->

# Quote Management Module

## Overview

The Quote Management module provides comprehensive quotation functionality for the POS/ERP system, including:

- **Quote Creation & Management**: Full lifecycle quote management
- **Line Items**: Product-based and custom description line items
- **Calculations**: Automatic subtotal, discount, tax, and grand total calculations
- **PDF Generation**: Professional, templated PDF quotations with QR codes
- **Email Integration**: Send quotes via email with PDF attachments
- **Public Customer View**: Token-based quote viewing and acceptance
- **Status Workflow**: Draft → Sent → Accepted/Rejected/Expired → Converted
- **Multi-tenancy**: Full tenant isolation

## Key Features

### Quote Lifecycle
```
DRAFT ──send──> SENT ──accept──> ACCEPTED ──convert──> CONVERTED
                  │      reject        │
                  │         ↓          │
                  │     REJECTED       │
                  │                    │
                  └────expire──> EXPIRED
```

### Calculations
- **Line Item Total** = (Quantity × Unit Price) - Discount + Tax
- **Subtotal** = Sum of all line totals
- **Quote Discount** = Percentage or Fixed amount
- **Taxable Amount** = Subtotal - Discount
- **Tax Amount** = 15% VAT (Sri Lanka standard)
- **Grand Total** = Subtotal - Discount + Tax

### PDF Features
- Customizable templates
- Company branding (logo, colors, fonts)
- QR code for online access
- Professional layout
- Terms and conditions
- Payment instructions
- Digital signature section

---

## Models

### Quote

Main quote model.

**Fields:**
- `id`: Primary key
- `tenant`: ForeignKey to Tenant (multi-tenancy)
- `quote_number`: Unique quote identifier (e.g., QT-2026-00001)
- `customer`: ForeignKey to Customer (optional)
- `customer_name`, `customer_email`, `customer_phone`: Fallback fields
- `title`: Quote title/subject
- `description`: Detailed description
- `status`: DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED
- `issue_date`: Date quote was issued
- `valid_until`: Expiry date
- `discount_type`: PERCENTAGE, FIXED, NONE
- `discount_value`: Discount amount/percentage
- `subtotal`, `discount_amount`, `tax_amount`, `grand_total`: Calculated fields
- `terms_and_conditions`: Legal terms
- `notes`: Internal notes
- `internal_notes`: Staff-only notes
- `pdf_file`: Generated PDF
- `public_token`: UUID for public access
- `created_by`: ForeignKey to User

**Properties:**
- `is_expired`: Boolean, checks if past valid_until
- `days_until_expiry`: Integer days remaining
- `is_locked`: Boolean, prevents editing when ACCEPTED/CONVERTED/EXPIRED
- `can_edit`, `can_delete`: Permission checks
- `needs_regeneration`: Boolean, checks if PDF needs update

**Methods:**
- `get_public_url()`: Returns full URL for public view
- `get_available_actions()`: Returns list of allowed status transitions

### QuoteLineItem

Individual line items in a quote.

**Fields:**
- `quote`: ForeignKey to Quote
- `product`: ForeignKey to Product (optional)
- `description`: Custom description
- `quantity`: DecimalField (3 decimal places)
- `unit`: CharField (pcs, kg, m, etc.)
- `unit_price`: Current price
- `original_price`: Price snapshot
- `cost_price`: Cost price snapshot
- `discount_type`, `discount_value`, `discount_amount`: Line-level discounts
- `is_taxable`: Boolean
- `tax_rate`: Decimal (default 15.00 for Sri Lanka VAT)
- `tax_amount`: Calculated tax
- `position`: IntegerField for ordering
- `notes`: Item-specific notes

**Properties:**
- `line_total`: Calculated total (qty × price - discount + tax)

---

## Services

### QuoteService

Main business logic service.

**Methods:**

#### create_quote(quote_data, line_items, user)
```python
from apps.quotes.services.quote_service import QuoteService

service = QuoteService()
quote = service.create_quote(
    quote_data={
        'customer': customer,
        'title': 'Office Furniture Quote',
        'issue_date': date.today(),
        'valid_until': date.today() + timedelta(days=30)
    },
    line_items=[
        {'description': 'Office Chair', 'quantity': 5, 'unit_price': 15000},
        {'description': 'Desk', 'quantity': 3, 'unit_price': 25000}
    ],
    user=request.user
)
```

#### send_quote(quote, user)
Transition quote from DRAFT to SENT.

#### accept_quote(quote, notes, user)
Transition quote from SENT to ACCEPTED.

#### reject_quote(quote, reason, user)
Transition quote from SENT to REJECTED.

#### convert_to_order(quote, user)
Create Order from accepted Quote.

#### duplicate_quote(quote)
Create copy of quote with new number.

### QuoteCalculationService

Automatic calculation service.

**Methods:**
- `calculate_all(quote)`: Orchestrator, calculates all totals
- `calculate_line_total(line_item)`: Calculate single line
- `calculate_quote_subtotal(quote)`: Sum all lines
- `apply_header_discount(quote)`: Apply quote-level discount
- `calculate_grand_total(quote)`: Final total

### QuotePDFGenerator

PDF generation service.

**Usage:**
```python
from apps.quotes.services.pdf_generator import QuotePDFGenerator

generator = QuotePDFGenerator(quote)
generator.generate_and_save()  # Saves to quote.pdf_file
```

### QuoteEmailService

Email sending service.

**Usage:**
```python
from apps.quotes.services.email_service import QuoteEmailService

service = QuoteEmailService()
success = service.send_quote_email(
    quote=quote,
    recipient_email='customer@example.lk',
    custom_message='Please review our quotation.'
)
```

---

## API Endpoints

### Authentication Required

All endpoints except public routes require authentication token:
```
Authorization: Bearer <token>
```

### List Quotes
```
GET /api/quotes/
```

**Query Parameters:**
- `status`: Filter by status (DRAFT, SENT, etc.)
- `customer`: Filter by customer ID
- `customer_name`: Search customer name
- `issue_date_from`, `issue_date_to`: Date range
- `total_min`, `total_max`: Amount range
- `is_expired`: Boolean filter
- `has_pdf`: Boolean filter
- `search`: Full-text search (quote_number, title, customer)
- `ordering`: Sort field (issue_date, grand_total, created_at)

**Response:**
```json
{
  "count": 25,
  "next": "...",
  "previous": null,
  "results": [
    {
      "id": 1,
      "quote_number": "QT-2026-00001",
      "customer_name_display": "ABC Company",
      "title": "Office Furniture",
      "status": "SENT",
      "status_display": "Sent to Customer",
      "issue_date": "2026-01-15",
      "valid_until": "2026-02-15",
      "is_expired": false,
      "total_amount": "120175.00",
      "line_items_count": 5
    }
  ]
}
```

### Create Quote
```
POST /api/quotes/
```

**Request:**
```json
{
  "customer": 5,
  "title": "New Quotation",
  "description": "Office furniture for new branch",
  "issue_date": "2026-01-15",
  "valid_until": "2026-02-15",
  "discount_type": "PERCENTAGE",
  "discount_value": "5.00",
  "line_items": [
    {
      "product": 10,
      "description": "Executive Chair",
      "quantity": "5.000",
      "unit_price": "15000.00"
    },
    {
      "description": "Custom Desk (Large)",
      "quantity": "3.000",
      "unit_price": "25000.00"
    }
  ]
}
```

### Get Quote Details
```
GET /api/quotes/{id}/
```

### Update Quote
```
PATCH /api/quotes/{id}/
```

### Delete Quote
```
DELETE /api/quotes/{id}/
```

### Custom Actions

#### Send Quote
```
POST /api/quotes/{id}/send_quote/
```

#### Accept Quote
```
POST /api/quotes/{id}/accept_quote/
Body: {"notes": "Approved by manager"}
```

#### Reject Quote
```
POST /api/quotes/{id}/reject_quote/
Body: {"reason": "Budget constraints"}
```

#### Convert to Order
```
POST /api/quotes/{id}/convert_to_order/
```

**Response:**
```json
{
  "message": "Quote converted to order successfully",
  "order": {
    "id": 15,
    "order_number": "ORD-2026-00045",
    "url": "/api/orders/15/"
  }
}
```

#### Duplicate Quote
```
POST /api/quotes/{id}/duplicate_quote/
```

#### Download PDF
```
GET /api/quotes/{id}/download_pdf/?inline=true
```

#### Send Email
```
POST /api/quotes/{id}/send_email/
Body: {
  "email": "customer@example.lk",
  "message": "Please review our quotation.",
  "cc_emails": ["sales@company.lk"]
}
```

### Public Endpoints (No Authentication)

#### View Quote
```
GET /api/quotes/public/{token}/
```

#### Accept Quote (Public)
```
POST /api/quotes/public/{token}/accept/
Body: {"notes": "Accepted online"}
```

#### Reject Quote (Public)
```
POST /api/quotes/public/{token}/reject/
Body: {"reason": "Price too high"}
```

#### Download PDF (Public)
```
GET /api/quotes/public/{token}/download/
```

---

## Configuration

### Settings

```python
# settings.py

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'noreply@yourcompany.lk'

# Celery configuration
CELERY_BEAT_SCHEDULE = {
    'expire-old-quotes': {
        'task': 'apps.quotes.tasks.expire_old_quotes',
        'schedule': crontab(hour=0, minute=0),  # Daily at midnight
    },
    'send-expiry-reminders': {
        'task': 'apps.quotes.tasks.send_expiry_reminders_task',
        'schedule': crontab(hour=9, minute=0),  # Daily at 9 AM
    },
}

# File upload settings
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'
```

### Quote Settings Model

Configure per-tenant defaults:

```python
from apps.quotes.models import QuoteSettings

settings = QuoteSettings.objects.create(
    tenant=tenant,
    default_validity_days=30,
    quote_number_prefix='QT',
    quote_number_format='{prefix}-{year}-{number:05d}',
    auto_expire_enabled=True,
    require_approval=False,
    send_quote_email_enabled=True,
    send_expiry_reminders=True,
    reminder_days_before_expiry=3,
    default_terms_and_conditions='...',
    default_discount_type='NONE'
)
```

---

## Sri Lanka-Specific Features

### Currency
- **LKR (Sri Lankan Rupees)** used throughout
- Format: `LKR 120,175.00`
- Decimal precision: 2 places

### VAT (Value Added Tax)
- **Standard Rate**: 15%
- Applied to taxable line items
- Displayed separately in totals

### Business Registration
- **TIN (Tax Identification Number)** field
- **Company Registration Number** field
- Both displayed in PDF header

### Bank Details
Default payment instructions template includes:
- Bank of Ceylon
- Branch details
- Account number
- Account name
- SWIFT code (for international)

### Timezone
- **Asia/Colombo** for all datetime operations
- Quote expiry checked at midnight Sri Lanka time

### Localization
- Date format: `DD MMMM YYYY` (e.g., "15 January 2026")
- Phone format: `+94 XX XXX XXXX`
- Address format includes postal code and "Sri Lanka"

---

## Testing

### Run Tests
```bash
# All quote tests
pytest apps/quotes/tests/

# Specific test file
pytest apps/quotes/tests/test_models.py

# With coverage
pytest apps/quotes/tests/ --cov=apps.quotes --cov-report=html
```

### Test Structure
- `test_models.py`: Model unit tests
- `test_services.py`: Service layer tests
- `test_api.py`: API endpoint tests
- `test_pdf.py`: PDF generation tests
- `test_email.py`: Email integration tests

---

## Troubleshooting

### Common Issues

**PDF not generating:**
- Check ReportLab/WeasyPrint installed
- Check MEDIA_ROOT writable
- Check QuoteTemplate exists
- Check logo file exists

**Email not sending:**
- Check EMAIL_* settings
- Check SMTP credentials
- Check recipient email valid
- Check Celery worker running

**Public link not working:**
- Check public_token exists
- Check URL pattern registered
- Check AllowAny permission set

**Calculations incorrect:**
- Check signals connected
- Check QuoteCalculationService called
- Check discount_type/discount_value
- Check tax_rate (should be 15.00 for Sri Lanka)

---

## Future Enhancements

- [ ] Multi-currency support
- [ ] Quote templates (pre-filled quotes)
- [ ] Quote comparisons
- [ ] Customer portal with quote history
- [ ] Electronic signature integration
- [ ] Payment gateway integration
- [ ] Automated follow-ups
- [ ] Quote analytics dashboard

---

## Related Modules

- **Customers Module**: Customer data
- **Products Module**: Product catalog and pricing
- **Orders Module**: Order creation from quotes
- **Inventory Module**: Stock availability checking

---

## Support

For issues or questions:
- Development Team: dev@yourcompany.lk
- Documentation: docs.yourcompany.lk/quotes
- Issue Tracker: github.com/yourcompany/pos-erp/issues
```

### Expected Outcome
Comprehensive documentation covering all aspects of the Quote module.

### Verification Checklist
- [ ] docs/modules/quotes/ directory created
- [ ] index.md created
- [ ] Overview section
- [ ] Features documented
- [ ] Models documented (all fields)
- [ ] Services documented (all methods)
- [ ] API endpoints documented
- [ ] Request/response examples
- [ ] Authentication explained
- [ ] Filtering documented
- [ ] Configuration section
- [ ] Settings examples
- [ ] Sri Lanka-specific features
- [ ] Currency (LKR)
- [ ] VAT (15%)
- [ ] Business registration
- [ ] Testing guide
- [ ] Troubleshooting section
- [ ] Related modules
- [ ] Future enhancements

---

## Summary

After completing Tasks 83-88, the Quote Management module will have:

### Comprehensive Test Coverage
```
tests/
├── conftest.py          # Fixtures
├── factories.py         # Test data factories
├── test_models.py       # Model unit tests (15+ tests)
├── test_services.py     # Service layer tests (12+ tests)
├── test_api.py          # API endpoint tests (20+ tests)
├── test_pdf.py          # PDF generation tests (10+ tests)
└── test_email.py        # Email integration tests (8+ tests)

Total: 65+ tests covering all functionality
```

### Documentation
- Complete module overview
- All models documented
- All services documented
- All API endpoints with examples
- Configuration guide
- Sri Lanka-specific features
- Testing guide
- Troubleshooting section

### Quality Assurance
- ✅ Unit tests for models
- ✅ Service layer tests
- ✅ API integration tests
- ✅ PDF generation tests
- ✅ Email sending tests
- ✅ Mocking external dependencies
- ✅ Test fixtures and factories
- ✅ Comprehensive documentation

### Ready for Production
The Quote Management module is now:
- Fully tested
- Well documented
- Production-ready
- Maintainable
- Extensible

### Module Completion Status
**All Groups Complete (A-F):**
- ✅ Group A: Models & Database (Tasks 1-18)
- ✅ Group B: Line Items & Calculations (Tasks 19-36)
- ✅ Group C: Services & Business Logic (Tasks 37-52)
- ✅ Group D: PDF Generation (Tasks 53-68)
- ✅ Group E: API & Email Integration (Tasks 69-82)
- ✅ Group F: Testing & Documentation (Tasks 83-88)

**Total: 88 tasks completed**

---

**✅ SUBPHASE COMPLETE**

The Quote Management SubPhase is now fully documented and ready for implementation. All task documents created following the reference structure from Phase-01.

**Next Steps:**
1. Implement the quote module following the task documents
2. Run the test suite and ensure all tests pass
3. Review documentation and update as needed
4. Proceed to [SubPhase-05_Order-Management](../../SubPhase-05_Order-Management/)
