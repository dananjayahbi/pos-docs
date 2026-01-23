# Tasks 85-88: API Testing, Integration & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** F - Testing & Documentation  
> **Tasks:** 85-88  
> **Purpose:** Complete API endpoint testing, integration tests, and comprehensive module documentation

---

## Navigation

- **↑ Parent:** [Group F Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [01_Tasks-81-84_Model-Tax-Tier-Tests.md](01_Tasks-81-84_Model-Tax-Tier-Tests.md)
- **→ SubPhase Complete:** [SubPhase Overview](../00_SUBPHASE_OVERVIEW.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 85 | Create API endpoint tests | High | 35 min | Pending |
| 86 | Add price calculation integration tests | Medium | 25 min | Pending |
| 87 | Write pricing module documentation | Medium | 30 min | Pending |
| 88 | Create pricing configuration guide | Medium | 25 min | Pending |

**Total Estimated Time:** 1h 55min

---

## Task 85: Create API Endpoint Tests

### Description
Create comprehensive tests for all pricing API endpoints including CRUD, bulk operations, and custom actions.

### Acceptance Criteria
- [ ] Test all ProductPrice endpoints
- [ ] Test TieredPricing endpoints
- [ ] Test ScheduledPrice endpoints
- [ ] Test price lookup endpoint
- [ ] Test bulk operations
- [ ] Test authentication & permissions
- [ ] Test error handling
- [ ] Test pagination & filtering

### File Path
```
backend/apps/products/pricing/tests/test_api.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from apps.users.models import User
from apps.products.models import Product
from apps.products.pricing.models import (
    ProductPrice, TieredPricing, ScheduledPrice, FlashSale
)


@pytest.mark.django_db
class TestProductPriceAPI:
    """Test ProductPrice API endpoints."""
    
    def test_list_product_prices(self, api_client, tenant, product_price):
        """Test listing product prices."""
        response = api_client.get('/api/pricing/products/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['id'] == product_price.id
    
    def test_retrieve_product_price(self, api_client, product_price):
        """Test retrieving a single product price."""
        response = api_client.get(f'/api/pricing/products/{product_price.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == product_price.id
        assert response.data['base_price'] == str(product_price.base_price)
    
    def test_create_product_price(self, api_client_with_permissions, tenant, product):
        """Test creating a product price."""
        data = {
            'product': product.id,
            'base_price': '120.00',
            'cost_price': '70.00',
            'sale_price': '99.99',
        }
        
        response = api_client_with_permissions.post(
            '/api/pricing/products/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert ProductPrice.objects.filter(product=product).exists()
    
    def test_update_product_price(self, api_client_with_permissions, product_price):
        """Test updating a product price."""
        data = {
            'base_price': '150.00',
        }
        
        response = api_client_with_permissions.patch(
            f'/api/pricing/products/{product_price.id}/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_200_OK
        product_price.refresh_from_db()
        assert product_price.base_price == Decimal('150.00')
    
    def test_delete_product_price(self, api_client_with_permissions, product_price):
        """Test deleting a product price."""
        response = api_client_with_permissions.delete(
            f'/api/pricing/products/{product_price.id}/'
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not ProductPrice.objects.filter(id=product_price.id).exists()
    
    def test_bulk_price_update(self, api_client_with_permissions, tenant):
        """Test bulk price update endpoint."""
        # Create multiple products with prices
        for i in range(5):
            product = Product.objects.create(
                tenant=tenant,
                name=f'Product {i}',
                sku=f'TEST-{i}',
            )
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal('100.00'),
            )
        
        data = {
            'filters': {},
            'update_type': 'percentage',
            'base_price_change': 10,  # 10% increase
        }
        
        response = api_client_with_permissions.post(
            '/api/pricing/bulk-update/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['updated_count'] == 5
        
        # Verify prices updated
        updated_price = ProductPrice.objects.first()
        assert updated_price.base_price == Decimal('110.00')
    
    def test_unauthorized_access(self, api_client, product_price):
        """Test unauthorized access is denied."""
        # Not authenticated
        response = api_client.post('/api/pricing/products/', {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_no_permission_denied(self, api_client_no_permissions, product_price):
        """Test access without permissions is denied."""
        response = api_client_no_permissions.post('/api/pricing/products/', {})
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestTieredPricingAPI:
    """Test TieredPricing API endpoints."""
    
    def test_list_tiered_pricing(self, api_client, tenant, product):
        """Test listing tiered pricing."""
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            max_quantity=49,
            unit_price=Decimal('95.00'),
        )
        
        response = api_client.get('/api/pricing/tiered-pricing/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
    
    def test_create_tiered_pricing(self, api_client_with_permissions, tenant, product):
        """Test creating tiered pricing."""
        data = {
            'product': product.id,
            'min_quantity': 10,
            'max_quantity': 49,
            'unit_price': '95.00',
            'tier_type': 'all_units',
        }
        
        response = api_client_with_permissions.post(
            '/api/pricing/tiered-pricing/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert TieredPricing.objects.filter(product=product).exists()
    
    def test_bulk_create_tiers(self, api_client_with_permissions, tenant, product):
        """Test bulk tier creation."""
        data = {
            'product': product.id,
            'tiers': [
                {'min_quantity': 10, 'unit_price': '95.00'},
                {'min_quantity': 50, 'unit_price': '90.00'},
                {'min_quantity': 100, 'unit_price': '85.00'},
            ]
        }
        
        response = api_client_with_permissions.post(
            '/api/pricing/tiered-pricing/bulk-create/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert TieredPricing.objects.filter(product=product).count() == 3
    
    def test_copy_to_variants(self, api_client_with_permissions, tenant, product):
        """Test copying tiers to all variants."""
        from apps.products.models import ProductVariant
        
        # Create variants
        for i in range(3):
            ProductVariant.objects.create(
                tenant=tenant,
                product=product,
                sku=f'VAR-{i}',
                name=f'Variant {i}',
            )
        
        # Create product tiers
        tier = TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            unit_price=Decimal('95.00'),
        )
        
        response = api_client_with_permissions.post(
            f'/api/pricing/tiered-pricing/{tier.id}/copy-to-variants/'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['variants_updated'] == 3


@pytest.mark.django_db
class TestScheduledPriceAPI:
    """Test ScheduledPrice API endpoints."""
    
    def test_create_scheduled_price(self, api_client_with_permissions, tenant, product):
        """Test creating scheduled price."""
        start = (timezone.now() + timedelta(days=1)).isoformat()
        end = (timezone.now() + timedelta(days=8)).isoformat()
        
        data = {
            'product': product.id,
            'scheduled_price': '79.99',
            'start_datetime': start,
            'end_datetime': end,
            'priority': 1,
        }
        
        response = api_client_with_permissions.post(
            '/api/pricing/scheduled-prices/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_201_CREATED
    
    def test_activate_scheduled_price(self, api_client_with_permissions, tenant, product):
        """Test manually activating a scheduled price."""
        schedule = ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=timezone.now() + timedelta(days=1),
            end_datetime=timezone.now() + timedelta(days=8),
            status=ScheduledPrice.Status.PENDING,
        )
        
        response = api_client_with_permissions.post(
            f'/api/pricing/scheduled-prices/{schedule.id}/activate/'
        )
        
        assert response.status_code == status.HTTP_200_OK
        schedule.refresh_from_db()
        assert schedule.status == ScheduledPrice.Status.ACTIVE
    
    def test_list_upcoming_schedules(self, api_client, tenant, product):
        """Test listing upcoming scheduled prices."""
        ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=timezone.now() + timedelta(days=1),
            end_datetime=timezone.now() + timedelta(days=8),
            status=ScheduledPrice.Status.PENDING,
        )
        
        response = api_client.get('/api/pricing/scheduled-prices/upcoming/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1


@pytest.mark.django_db
class TestPriceLookupAPI:
    """Test price lookup endpoint."""
    
    def test_lookup_by_product(self, api_client, tenant, product, product_price):
        """Test looking up price by product ID."""
        response = api_client.get(
            f'/api/pricing/lookup/?product_id={product.id}&quantity=10'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert 'effective_price' in response.data
        assert 'price_breakdown' in response.data
    
    def test_lookup_by_variant(self, api_client, tenant, variant):
        """Test looking up price by variant ID."""
        from apps.products.pricing.models import VariantPrice
        
        VariantPrice.objects.create(
            tenant=tenant,
            variant=variant,
            base_price=Decimal('120.00'),
        )
        
        response = api_client.get(
            f'/api/pricing/lookup/?variant_id={variant.id}&quantity=5'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['effective_price'] == '120.00'
    
    def test_bulk_lookup(self, api_client, tenant, product, product_price):
        """Test bulk price lookup."""
        data = {
            'items': [
                {'product_id': product.id, 'quantity': 10},
                {'product_id': product.id, 'quantity': 50},
            ]
        }
        
        response = api_client.post(
            '/api/pricing/bulk-lookup/',
            data,
            format='json'
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success_count'] == 2
        assert len(response.data['results']) == 2
    
    def test_lookup_missing_params(self, api_client):
        """Test lookup with missing parameters."""
        response = api_client.get('/api/pricing/lookup/')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data


# Fixtures
@pytest.fixture
def api_client():
    """Create API client."""
    return APIClient()

@pytest.fixture
def api_client_with_permissions(tenant, user_with_permissions):
    """Create authenticated API client with pricing permissions."""
    client = APIClient()
    client.force_authenticate(user=user_with_permissions)
    return client

@pytest.fixture
def api_client_no_permissions(tenant, user_no_permissions):
    """Create authenticated API client without pricing permissions."""
    client = APIClient()
    client.force_authenticate(user=user_no_permissions)
    return client

@pytest.fixture
def user_with_permissions(tenant):
    """Create user with pricing permissions."""
    user = User.objects.create_user(
        username='admin',
        email='admin@test.com',
        password='password123',
        tenant=tenant,
    )
    
    from apps.core.models import Permission
    permission = Permission.objects.create(
        codename='manage_pricing',
        name='Can manage pricing',
    )
    user.user_permissions.add(permission)
    
    return user

@pytest.fixture
def user_no_permissions(tenant):
    """Create user without pricing permissions."""
    return User.objects.create_user(
        username='user',
        email='user@test.com',
        password='password123',
        tenant=tenant,
    )
```

---

## Task 86: Add Price Calculation Integration Tests

### Description
Create integration tests that verify end-to-end price calculations with multiple rules.

### Acceptance Criteria
- [ ] Test complex price scenarios
- [ ] Test multiple pricing rules interaction
- [ ] Test cart price calculation
- [ ] Test tax + tiers + scheduled prices
- [ ] Test flash sale priority
- [ ] Test customer-specific pricing
- [ ] Test real-world scenarios

### File Path
```
backend/apps/products/pricing/tests/test_integration.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

from apps.products.models import Product
from apps.products.pricing.models import (
    ProductPrice, TaxCategory, TieredPricing,
    ScheduledPrice, FlashSale,
)
from apps.products.pricing.services import (
    PriceResolutionService,
    TaxCalculatorService,
    CartPriceCalculator,
)


@pytest.mark.django_db
class TestComplexPriceScenarios:
    """Test complex pricing scenarios with multiple rules."""
    
    def test_flash_sale_with_tax(self, tenant, product):
        """Test flash sale price with tax calculation."""
        # Base setup
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        tax = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        product.tax_category = tax
        product.save()
        
        # Flash sale
        FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('75.00'),
            max_quantity=100,
            start_datetime=timezone.now() - timedelta(hours=1),
            end_datetime=timezone.now() + timedelta(hours=6),
            priority=10,
            status=FlashSale.Status.ACTIVE,
        )
        
        # Get effective price with tax
        price_result = PriceResolutionService.get_effective_price(product)
        tax_result = TaxCalculatorService.calculate_tax(
            price_result['price'],
            tax
        )
        
        assert price_result['price'] == Decimal('75.00')
        assert tax_result['tax_amount'] == Decimal('11.25')
        assert tax_result['total_price'] == Decimal('86.25')
    
    def test_tiered_pricing_with_scheduled_discount(self, tenant, product):
        """Test tiered pricing combined with scheduled discount."""
        # Base price
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        # Tiered pricing
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            max_quantity=49,
            unit_price=Decimal('95.00'),
            tier_type='all_units',
        )
        
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=50,
            unit_price=Decimal('90.00'),
            tier_type='all_units',
        )
        
        # Scheduled price (overrides tiers)
        ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('85.00'),
            start_datetime=timezone.now() - timedelta(hours=1),
            end_datetime=timezone.now() + timedelta(days=1),
            priority=5,
            status=ScheduledPrice.Status.ACTIVE,
        )
        
        # Small quantity: scheduled price applies
        result = PriceResolutionService.get_effective_price(product, quantity=5)
        assert result['price'] == Decimal('85.00')
        
        # Large quantity: scheduled price still wins (higher priority)
        result = PriceResolutionService.get_effective_price(product, quantity=60)
        assert result['price'] == Decimal('85.00')
    
    def test_cart_calculation_multiple_items(self, tenant):
        """Test cart price calculation with multiple products."""
        # Product 1: Regular price with tax
        product1 = Product.objects.create(
            tenant=tenant,
            name='Product 1',
            sku='PROD-1',
        )
        ProductPrice.objects.create(
            tenant=tenant,
            product=product1,
            base_price=Decimal('50.00'),
        )
        
        # Product 2: Flash sale
        product2 = Product.objects.create(
            tenant=tenant,
            name='Product 2',
            sku='PROD-2',
        )
        ProductPrice.objects.create(
            tenant=tenant,
            product=product2,
            base_price=Decimal('100.00'),
        )
        FlashSale.objects.create(
            tenant=tenant,
            product=product2,
            flash_price=Decimal('75.00'),
            max_quantity=100,
            start_datetime=timezone.now() - timedelta(hours=1),
            end_datetime=timezone.now() + timedelta(hours=6),
            status=FlashSale.Status.ACTIVE,
        )
        
        # Product 3: Tiered pricing
        product3 = Product.objects.create(
            tenant=tenant,
            name='Product 3',
            sku='PROD-3',
        )
        ProductPrice.objects.create(
            tenant=tenant,
            product=product3,
            base_price=Decimal('20.00'),
        )
        TieredPricing.objects.create(
            tenant=tenant,
            product=product3,
            min_quantity=10,
            unit_price=Decimal('18.00'),
            tier_type='all_units',
        )
        
        # Tax
        tax = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        
        for product in [product1, product2, product3]:
            product.tax_category = tax
            product.save()
        
        # Cart items
        cart_items = [
            {'product': product1, 'quantity': 2},   # 2 × 50 = 100
            {'product': product2, 'quantity': 1},   # 1 × 75 = 75
            {'product': product3, 'quantity': 15},  # 15 × 18 = 270
        ]
        
        result = CartPriceCalculator.calculate_cart_total(cart_items)
        
        # Subtotal: 100 + 75 + 270 = 445
        assert result['subtotal'] == Decimal('445.00')
        
        # Tax: 445 × 0.15 = 66.75
        assert result['tax_amount'] == Decimal('66.75')
        
        # Total: 445 + 66.75 = 511.75
        assert result['total'] == Decimal('511.75')
    
    def test_promotional_priority_resolution(self, tenant, product):
        """Test priority resolution with multiple overlapping promotions."""
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        now = timezone.now()
        
        # Multiple overlapping promotions
        promotions = [
            ScheduledPrice.objects.create(
                tenant=tenant,
                product=product,
                scheduled_price=Decimal('90.00'),
                start_datetime=now - timedelta(hours=1),
                end_datetime=now + timedelta(days=7),
                priority=1,
                status=ScheduledPrice.Status.ACTIVE,
            ),
            ScheduledPrice.objects.create(
                tenant=tenant,
                product=product,
                scheduled_price=Decimal('85.00'),
                start_datetime=now - timedelta(hours=1),
                end_datetime=now + timedelta(days=3),
                priority=5,
                status=ScheduledPrice.Status.ACTIVE,
            ),
            FlashSale.objects.create(
                tenant=tenant,
                product=product,
                flash_price=Decimal('75.00'),
                max_quantity=50,
                start_datetime=now - timedelta(hours=1),
                end_datetime=now + timedelta(hours=6),
                priority=10,
                status=FlashSale.Status.ACTIVE,
            ),
        ]
        
        # Highest priority should win (flash sale)
        result = PriceResolutionService.get_effective_price(product)
        assert result['price'] == Decimal('75.00')
        assert result['price_type'] == 'flash_sale'


@pytest.mark.django_db
class TestRealWorldScenarios:
    """Test real-world pricing scenarios."""
    
    def test_black_friday_sale(self, tenant):
        """Test Black Friday sale scenario."""
        # Create 10 products with varying prices
        products = []
        for i in range(10):
            product = Product.objects.create(
                tenant=tenant,
                name=f'Product {i}',
                sku=f'PROD-{i}',
            )
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal(str(100 + i * 10)),
            )
            products.append(product)
        
        # Black Friday: 30% off everything
        now = timezone.now()
        for product in products:
            base_price = product.prices.first().base_price
            sale_price = base_price * Decimal('0.7')
            
            ScheduledPrice.objects.create(
                tenant=tenant,
                product=product,
                scheduled_price=sale_price,
                start_datetime=now - timedelta(hours=1),
                end_datetime=now + timedelta(days=1),
                priority=5,
                status=ScheduledPrice.Status.ACTIVE,
            )
        
        # Verify all products have 30% discount
        for product in products:
            result = PriceResolutionService.get_effective_price(product)
            base_price = product.prices.first().base_price
            expected_price = base_price * Decimal('0.7')
            
            assert result['price'] == expected_price
            assert result['discount_percentage'] == Decimal('30.00')
    
    def test_wholesale_order(self, tenant, product):
        """Test wholesale order with bulk pricing."""
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('50.00'),
            cost_price=Decimal('30.00'),
        )
        
        # Wholesale tiers
        tiers = [
            (10, 49, Decimal('48.00')),
            (50, 99, Decimal('45.00')),
            (100, 499, Decimal('42.00')),
            (500, None, Decimal('40.00')),
        ]
        
        for min_qty, max_qty, price in tiers:
            TieredPricing.objects.create(
                tenant=tenant,
                product=product,
                min_quantity=min_qty,
                max_quantity=max_qty,
                unit_price=price,
                tier_type='all_units',
            )
        
        # Test wholesale order of 250 units
        from apps.products.pricing.services.bulk_pricing import BulkPricingService
        
        result = BulkPricingService.calculate_tiered_price(product, 250)
        
        assert result['unit_price'] == Decimal('42.00')
        assert result['total'] == Decimal('10500.00')  # 250 × 42
        assert result['savings'] == Decimal('2000.00')  # vs base: 250 × 50 - 10500
```

---

## Task 87: Write Pricing Module Documentation

### Description
Create comprehensive documentation for the pricing module including architecture, models, services, and usage examples.

### Acceptance Criteria
- [ ] Architecture overview
- [ ] Model documentation
- [ ] Service documentation
- [ ] API endpoint documentation
- [ ] Usage examples
- [ ] Best practices
- [ ] Troubleshooting guide

### File Path
```
backend/apps/products/pricing/docs/README.md (NEW)
```

### Implementation Details

```markdown
# Product Pricing Module

## Overview

The Product Pricing Module provides a comprehensive, flexible pricing system for the ERP platform with support for:

- **Base Pricing**: Regular and sale prices for products and variants
- **Tax Integration**: Configurable tax rates with inclusive/exclusive calculation
- **Tiered/Volume Pricing**: Quantity-based discounts with incremental or all-units pricing
- **Scheduled Pricing**: Time-based pricing with automatic activation/deactivation
- **Flash Sales**: Limited-time, limited-quantity promotional pricing
- **Promotional Pricing**: Rule-based promotional discounts
- **Priority Resolution**: Intelligent price selection when multiple rules apply

---

## Architecture

### Models

```
ProductPrice (Base pricing for products)
    ├── VariantPrice (Pricing for product variants)
    ├── TieredPricing (Volume-based pricing)
    │   └── VariantTieredPricing (Variant-specific tiers)
    ├── ScheduledPrice (Time-based pricing)
    │   └── FlashSale (Limited quantity sales)
    └── PromotionalPrice (Rule-based promotions)

TaxCategory (Tax configuration)
PromotionAnalytics (Promotion tracking)
```

### Services

1. **PriceResolutionService**: Determines effective price with all rules applied
2. **TaxCalculatorService**: Handles tax calculations (inclusive/exclusive)
3. **BulkPricingService**: Manages tiered/volume pricing calculations
4. **CartPriceCalculator**: Calculates cart totals with all pricing rules

### API Endpoints

- `/api/pricing/products/` - ProductPrice CRUD
- `/api/pricing/tiered-pricing/` - Tiered pricing management
- `/api/pricing/scheduled-prices/` - Scheduled price management
- `/api/pricing/flash-sales/` - Flash sale management
- `/api/pricing/lookup/` - Price lookup (public)
- `/api/pricing/bulk-update/` - Bulk price updates

---

## Usage Examples

### Setting Up Product Pricing

```python
from apps.products.pricing.models import ProductPrice, TaxCategory

# Create tax category
vat = TaxCategory.objects.create(
    tenant=tenant,
    name='VAT 15%',
    rate=Decimal('15.00'),
    is_inclusive=False,
)

# Set product price
price = ProductPrice.objects.create(
    tenant=tenant,
    product=product,
    base_price=Decimal('100.00'),
    cost_price=Decimal('60.00'),
    sale_price=Decimal('85.00'),
)

# Assign tax
product.tax_category = vat
product.save()
```

### Creating Tiered Pricing

```python
from apps.products.pricing.models import TieredPricing

# Volume discounts
tiers = [
    (10, 49, Decimal('95.00')),
    (50, 99, Decimal('90.00')),
    (100, None, Decimal('85.00')),
]

for min_qty, max_qty, unit_price in tiers:
    TieredPricing.objects.create(
        tenant=tenant,
        product=product,
        min_quantity=min_qty,
        max_quantity=max_qty,
        unit_price=unit_price,
        tier_type='all_units',  # or 'incremental'
    )
```

### Scheduling a Sale

```python
from apps.products.pricing.models import ScheduledPrice
from datetime import timedelta
from django.utils import timezone

# Weekend sale
start = timezone.now().replace(hour=0, minute=0, second=0)
end = start + timedelta(days=3)

schedule = ScheduledPrice.objects.create(
    tenant=tenant,
    product=product,
    scheduled_price=Decimal('79.99'),
    start_datetime=start,
    end_datetime=end,
    priority=5,
)
```

### Creating a Flash Sale

```python
from apps.products.pricing.models import FlashSale

flash_sale = FlashSale.objects.create(
    tenant=tenant,
    product=product,
    flash_price=Decimal('49.99'),
    max_quantity=100,
    start_datetime=timezone.now(),
    end_datetime=timezone.now() + timedelta(hours=6),
    priority=10,
)
```

### Getting Effective Price

```python
from apps.products.pricing.services import PriceResolutionService

# Get effective price with all rules
result = PriceResolutionService.get_effective_price(
    item=product,
    quantity=25,
    customer=customer  # optional
)

print(f"Price: {result['price']}")
print(f"Type: {result['price_type']}")
print(f"Discount: {result['discount_percentage']}%")
```

---

## Best Practices

### 1. Price Priority

Use priority values to control which pricing rule wins when multiple apply:
- Flash Sales: 10+
- Scheduled Prices: 1-9
- Customer-Specific: 15+
- Default: 0

### 2. Tiered Pricing Types

- **all_units**: All units priced at tier rate (common for wholesale)
- **incremental**: Each tier priced separately (common for utilities)

### 3. Tax Configuration

- Set `is_inclusive=True` for B2C (price includes tax)
- Set `is_inclusive=False` for B2B (tax added at checkout)

### 4. Performance

- Use caching for price lookups
- Bulk create tiers when possible
- Use background jobs for large bulk updates

### 5. Testing

- Always test price calculations with edge cases
- Verify priority resolution with overlapping rules
- Test tax rounding scenarios

---

## Troubleshooting

### Issue: Wrong price displayed

**Solution**: Check price resolution priority. Higher priority rules override lower ones.

### Issue: Tax calculation incorrect

**Solution**: Verify `is_inclusive` setting matches your requirements.

### Issue: Tiered pricing not applying

**Solution**: Ensure quantity thresholds don't have gaps and tier_type is set correctly.

### Issue: Scheduled prices not activating

**Solution**: Check Celery beat is running for automatic activation tasks.

---

## API Reference

See [API Documentation](api.md) for detailed endpoint documentation.
```

---

## Task 88: Create Pricing Configuration Guide

### Description
Create step-by-step configuration guide for setting up pricing in different scenarios.

### Acceptance Criteria
- [ ] Setup instructions
- [ ] Sri Lanka localization guide
- [ ] Common scenarios guide
- [ ] Configuration checklist
- [ ] Migration guide
- [ ] Admin user guide

### File Path
```
backend/apps/products/pricing/docs/CONFIGURATION_GUIDE.md (NEW)
```

### Implementation Details

```markdown
# Pricing Configuration Guide

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Sri Lanka Localization](#sri-lanka-localization)
3. [Common Scenarios](#common-scenarios)
4. [Configuration Checklist](#configuration-checklist)
5. [Migration Guide](#migration-guide)
6. [Admin Guide](#admin-guide)

---

## Initial Setup

### Step 1: Configure Tax Categories

```python
from apps.products.pricing.models import TaxCategory

# Sri Lanka VAT
vat = TaxCategory.objects.create(
    tenant=tenant,
    name='VAT 15%',
    rate=Decimal('15.00'),
    is_inclusive=False,
    is_default=True,
    country_code='LK',
)

# Sri Lanka NBT
nbt = TaxCategory.objects.create(
    tenant=tenant,
    name='NBT 2%',
    rate=Decimal('2.00'),
    is_inclusive=False,
    country_code='LK',
)
```

### Step 2: Set Base Prices

```python
from apps.products.pricing.models import ProductPrice

for product in Product.objects.all():
    ProductPrice.objects.create(
        tenant=tenant,
        product=product,
        base_price=product.base_price,  # Migrate from product model
        cost_price=product.cost_price,
    )
```

### Step 3: Configure Celery Beat for Scheduled Pricing

```python
# In celery.py

from celery.schedules import crontab

app.conf.beat_schedule = {
    'activate-scheduled-prices': {
        'task': 'pricing.activate_scheduled_prices',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
    'deactivate-expired-prices': {
        'task': 'pricing.deactivate_expired_prices',
        'schedule': crontab(minute='*/5'),
    },
    'cleanup-expired-schedules': {
        'task': 'pricing.cleanup_expired_schedules',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
}
```

---

## Sri Lanka Localization

### VAT Configuration

Sri Lanka standard VAT rate: **15%**

```python
vat = TaxCategory.objects.create(
    name='VAT 15%',
    rate=Decimal('15.00'),
    is_inclusive=False,  # B2B: tax added at checkout
    # is_inclusive=True,  # B2C: price includes tax
    country_code='LK',
)
```

### NBT (Nation Building Tax)

NBT rate: **2%**

```python
nbt = TaxCategory.objects.create(
    name='NBT 2%',
    rate=Decimal('2.00'),
    is_inclusive=False,
    country_code='LK',
)
```

### Currency Formatting

All prices stored and displayed in **Sri Lankan Rupees (LKR)**

```python
# In serializers
def get_base_price_formatted(self, obj):
    return f"LKR {obj.base_price:,.2f}"
```

---

## Common Scenarios

### Scenario 1: Retail Store with Sale Prices

```python
# Regular price: LKR 5,000
# Sale price: LKR 4,500

price = ProductPrice.objects.create(
    product=product,
    base_price=Decimal('5000.00'),
    sale_price=Decimal('4500.00'),
)
```

### Scenario 2: Wholesale Business with Volume Discounts

```python
# 1-9 units: LKR 1,000
# 10-49 units: LKR 950
# 50+ units: LKR 900

tiers = [
    (1, 9, Decimal('1000.00')),
    (10, 49, Decimal('950.00')),
    (50, None, Decimal('900.00')),
]

for min_qty, max_qty, unit_price in tiers:
    TieredPricing.objects.create(
        product=product,
        min_quantity=min_qty,
        max_quantity=max_qty,
        unit_price=unit_price,
        tier_type='all_units',
    )
```

### Scenario 3: E-commerce with Flash Sales

```python
# Flash Sale: 50% off, limited to 100 units, 6 hours only

flash_sale = FlashSale.objects.create(
    product=product,
    flash_price=Decimal('2500.00'),  # 50% of 5000
    max_quantity=100,
    start_datetime=timezone.now(),
    end_datetime=timezone.now() + timedelta(hours=6),
    priority=10,
)
```

### Scenario 4: Seasonal Promotions

```python
# Summer Sale: 20% off all products, June 1-30

from datetime import date

products = Product.objects.filter(categories__name='Summer Collection')

for product in products:
    base_price = product.prices.first().base_price
    sale_price = base_price * Decimal('0.8')
    
    ScheduledPrice.objects.create(
        product=product,
        scheduled_price=sale_price,
        start_datetime=timezone.datetime(2026, 6, 1, 0, 0),
        end_datetime=timezone.datetime(2026, 6, 30, 23, 59),
        priority=3,
    )
```

---

## Configuration Checklist

### Pre-Launch Checklist

- [ ] Tax categories configured
- [ ] All products have base prices
- [ ] Cost prices entered for profit tracking
- [ ] Variant prices set (if different from product)
- [ ] Tiered pricing configured (if applicable)
- [ ] Celery beat schedule configured
- [ ] Price lookup endpoint tested
- [ ] Admin interfaces reviewed
- [ ] Permissions assigned to users
- [ ] Cache configuration verified

### Go-Live Checklist

- [ ] All scheduled promotions created
- [ ] Flash sale inventory verified
- [ ] Tax calculations tested
- [ ] API endpoints tested
- [ ] Error logging configured
- [ ] Analytics tracking enabled
- [ ] Backup procedures in place
- [ ] Rollback plan documented

---

## Migration Guide

### Migrating from Product Model Prices

If prices are currently stored on Product model:

```python
from apps.products.models import Product
from apps.products.pricing.models import ProductPrice

# Migrate all products
for product in Product.objects.all():
    # Skip if already migrated
    if ProductPrice.objects.filter(product=product).exists():
        continue
    
    ProductPrice.objects.create(
        tenant=product.tenant,
        product=product,
        base_price=product.base_price,
        cost_price=getattr(product, 'cost_price', None),
        sale_price=getattr(product, 'sale_price', None),
    )

print(f"Migrated {Product.objects.count()} products")
```

### Migrating Promotional Data

```python
# If you have existing promotions in another format
from apps.products.pricing.models import ScheduledPrice

for promo in OldPromotionModel.objects.filter(is_active=True):
    ScheduledPrice.objects.create(
        tenant=promo.tenant,
        product=promo.product,
        scheduled_price=promo.discounted_price,
        start_datetime=promo.start_date,
        end_datetime=promo.end_date,
        priority=5,
    )
```

---

## Admin Guide

### Creating a Flash Sale (Admin Interface)

1. Navigate to **Pricing > Flash Sales**
2. Click **Add Flash Sale**
3. Fill in:
   - Product/Variant
   - Flash Price (e.g., LKR 2,499.00)
   - Max Quantity (e.g., 100)
   - Start DateTime
   - End DateTime
   - Priority (10 recommended)
4. Click **Save**
5. Verify status shows "Pending" or "Active"

### Setting Up Volume Discounts

1. Navigate to **Pricing > Tiered Pricing**
2. Click **Add Tiered Pricing**
3. Select Product
4. Add tier:
   - Min Quantity: 10
   - Max Quantity: 49
   - Unit Price: LKR 950.00
   - Tier Type: All Units
5. Click **Save and add another** for more tiers
6. Use **Copy to Variants** action for variant-level pricing

### Scheduling a Promotional Price

1. Navigate to **Pricing > Scheduled Prices**
2. Click **Add Scheduled Price**
3. Configure:
   - Product
   - Scheduled Price
   - Start/End DateTime
   - Priority (1-9)
4. Click **Save**
5. Price will activate automatically at start time

### Bulk Price Updates

1. Navigate to **Pricing > Product Prices**
2. Select products to update
3. Choose **Bulk update prices** action
4. Configure:
   - Update type: Percentage or Absolute
   - Change amount: e.g., 10 for 10% increase
   - Preview first
5. Apply changes

### Monitoring Promotions

1. Navigate to **Pricing > Promotion Analytics**
2. View:
   - Active promotions
   - Views/clicks/conversions
   - ROI calculations
   - Top performers
3. Use **Promotional Calendar** for upcoming schedule

---

## Support

For issues or questions:
- Email: support@yourcompany.com
- Docs: [Product Pricing Documentation](README.md)
- API: [API Reference](api.md)
```

---

## Documentation Structure

```
backend/apps/products/pricing/docs/
├── README.md                      (Task 87)
├── CONFIGURATION_GUIDE.md         (Task 88)
├── api.md                         (API endpoint reference)
├── models.md                      (Model field documentation)
├── services.md                    (Service method documentation)
└── examples/
    ├── retail.md
    ├── wholesale.md
    └── ecommerce.md
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**SubPhase Complete:** All 88 tasks documented across 6 groups
