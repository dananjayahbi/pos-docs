# Tasks 81-84: Model, Tax & Tier Testing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** F - Testing & Documentation  
> **Tasks:** 81-84  
> **Purpose:** Comprehensive test coverage for pricing models, tax calculations, and tiered pricing

---

## Navigation

- **↑ Parent:** [Group F Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group E - Serializers & API Views](../Group-E_Price-Serializers-API-Views/)
- **→ Next:** [02_Tasks-85-88_API-Integration-Docs.md](02_Tasks-85-88_API-Integration-Docs.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 81 | Create ProductPrice model tests | High | 30 min | Pending |
| 82 | Add tax calculation tests | Medium | 25 min | Pending |
| 83 | Create tiered pricing tests | High | 30 min | Pending |
| 84 | Add scheduled pricing tests | Medium | 25 min | Pending |

**Total Estimated Time:** 1h 50min

---

## Task 81: Create ProductPrice Model Tests

### Description
Create comprehensive tests for ProductPrice models including validation, constraints, and business logic.

### Acceptance Criteria
- [ ] Test ProductPrice CRUD
- [ ] Test base_price < sale_price validation
- [ ] Test cost_price constraints
- [ ] Test VariantPrice inheritance
- [ ] Test bulk price creation
- [ ] Test tenant isolation
- [ ] 90%+ code coverage

### File Path
```
backend/apps/products/pricing/tests/test_models.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from apps.products.models import Product, ProductVariant
from apps.products.pricing.models import ProductPrice, VariantPrice


@pytest.mark.django_db
class TestProductPriceModel:
    """Test ProductPrice model."""
    
    def test_create_product_price(self, tenant, product):
        """Test creating a product price."""
        price = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            cost_price=Decimal('60.00'),
            sale_price=Decimal('85.00'),
        )
        
        assert price.product == product
        assert price.base_price == Decimal('100.00')
        assert price.cost_price == Decimal('60.00')
        assert price.sale_price == Decimal('85.00')
        assert price.effective_price == Decimal('85.00')  # sale price
        assert price.profit_margin == Decimal('25.00')  # (85 - 60) / 100
    
    def test_effective_price_calculation(self, tenant, product):
        """Test effective price returns sale price if set, else base price."""
        # With sale price
        price = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            sale_price=Decimal('85.00'),
        )
        assert price.effective_price == Decimal('85.00')
        
        # Without sale price
        price.sale_price = None
        price.save()
        price.refresh_from_db()
        assert price.effective_price == Decimal('100.00')
    
    def test_discount_percentage_calculation(self, tenant, product):
        """Test discount percentage calculation."""
        price = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            sale_price=Decimal('75.00'),
        )
        
        assert price.discount_percentage == Decimal('25.00')
        
        # No discount
        price.sale_price = None
        assert price.discount_percentage == Decimal('0.00')
    
    def test_profit_margin_calculation(self, tenant, product):
        """Test profit margin calculation."""
        price = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            cost_price=Decimal('60.00'),
            sale_price=Decimal('80.00'),
        )
        
        # (80 - 60) / 80 * 100 = 25%
        expected_margin = ((80 - 60) / 80) * 100
        assert float(price.profit_margin) == pytest.approx(expected_margin, rel=0.01)
    
    def test_sale_price_greater_than_base_price_validation(self, tenant, product):
        """Test that sale price cannot exceed base price."""
        price = ProductPrice(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            sale_price=Decimal('120.00'),  # Invalid: higher than base
        )
        
        with pytest.raises(ValidationError) as exc_info:
            price.full_clean()
        
        assert 'sale_price' in exc_info.value.error_dict
    
    def test_cost_price_cannot_be_negative(self, tenant, product):
        """Test cost price must be positive."""
        price = ProductPrice(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
            cost_price=Decimal('-10.00'),  # Invalid
        )
        
        with pytest.raises(ValidationError):
            price.full_clean()
    
    def test_unique_product_per_tenant(self, tenant, product):
        """Test only one ProductPrice per product per tenant."""
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        # Try to create another
        with pytest.raises(IntegrityError):
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal('150.00'),
            )
    
    def test_tenant_isolation(self, tenant, another_tenant, product):
        """Test prices are isolated by tenant."""
        price1 = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        price2 = ProductPrice.objects.create(
            tenant=another_tenant,
            product=product,
            base_price=Decimal('200.00'),
        )
        
        tenant_prices = ProductPrice.objects.filter(tenant=tenant)
        assert price1 in tenant_prices
        assert price2 not in tenant_prices


@pytest.mark.django_db
class TestVariantPriceModel:
    """Test VariantPrice model."""
    
    def test_create_variant_price(self, tenant, variant):
        """Test creating a variant price."""
        price = VariantPrice.objects.create(
            tenant=tenant,
            variant=variant,
            base_price=Decimal('120.00'),
        )
        
        assert price.variant == variant
        assert price.base_price == Decimal('120.00')
    
    def test_variant_price_inherits_from_product(self, tenant, product, variant):
        """Test variant price inheritance from product."""
        # Create product price
        product_price = ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        # Create variant WITHOUT its own price
        # Should inherit from product
        effective = VariantPrice.get_effective_price(variant)
        assert effective == Decimal('100.00')
        
        # Create variant WITH its own price
        variant_price = VariantPrice.objects.create(
            tenant=tenant,
            variant=variant,
            base_price=Decimal('120.00'),
        )
        
        # Should use its own price
        effective = VariantPrice.get_effective_price(variant)
        assert effective == Decimal('120.00')
    
    def test_bulk_create_variant_prices(self, tenant, product):
        """Test bulk creation of variant prices."""
        variants = [
            ProductVariant.objects.create(
                tenant=tenant,
                product=product,
                sku=f'VAR-{i}',
                name=f'Variant {i}',
            )
            for i in range(5)
        ]
        
        prices = [
            VariantPrice(
                tenant=tenant,
                variant=variant,
                base_price=Decimal('100.00') + Decimal(str(i * 10)),
            )
            for i, variant in enumerate(variants)
        ]
        
        created = VariantPrice.objects.bulk_create(prices)
        assert len(created) == 5


@pytest.mark.django_db
class TestPriceQuerysets:
    """Test custom queryset methods."""
    
    def test_active_prices(self, tenant, product_factory):
        """Test active() queryset method."""
        # Create active products with prices
        for i in range(3):
            product = product_factory(is_active=True)
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal('100.00'),
            )
        
        # Create inactive product with price
        inactive = product_factory(is_active=False)
        ProductPrice.objects.create(
            tenant=tenant,
            product=inactive,
            base_price=Decimal('100.00'),
        )
        
        active_prices = ProductPrice.objects.active()
        assert active_prices.count() == 3
    
    def test_on_sale_prices(self, tenant, product_factory):
        """Test on_sale() queryset method."""
        # Products with sale prices
        for i in range(2):
            product = product_factory()
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal('100.00'),
                sale_price=Decimal('80.00'),
            )
        
        # Product without sale price
        product = product_factory()
        ProductPrice.objects.create(
            tenant=tenant,
            product=product,
            base_price=Decimal('100.00'),
        )
        
        on_sale = ProductPrice.objects.on_sale()
        assert on_sale.count() == 2
    
    def test_price_range_filter(self, tenant, product_factory):
        """Test filtering by price range."""
        prices = [50, 100, 150, 200, 250]
        
        for price in prices:
            product = product_factory()
            ProductPrice.objects.create(
                tenant=tenant,
                product=product,
                base_price=Decimal(str(price)),
            )
        
        # Filter 100-200
        in_range = ProductPrice.objects.filter(
            base_price__gte=Decimal('100'),
            base_price__lte=Decimal('200')
        )
        assert in_range.count() == 3


# Fixtures
@pytest.fixture
def tenant(db):
    """Create test tenant."""
    from apps.tenants.models import Tenant
    return Tenant.objects.create(
        schema_name='test_tenant',
        name='Test Tenant',
    )

@pytest.fixture
def another_tenant(db):
    """Create another test tenant."""
    from apps.tenants.models import Tenant
    return Tenant.objects.create(
        schema_name='another_tenant',
        name='Another Tenant',
    )

@pytest.fixture
def product(tenant):
    """Create test product."""
    return Product.objects.create(
        tenant=tenant,
        name='Test Product',
        sku='TEST-001',
    )

@pytest.fixture
def variant(tenant, product):
    """Create test variant."""
    return ProductVariant.objects.create(
        tenant=tenant,
        product=product,
        sku='TEST-001-RED',
        name='Red Variant',
    )

@pytest.fixture
def product_factory(tenant):
    """Factory for creating test products."""
    def _create_product(**kwargs):
        defaults = {
            'tenant': tenant,
            'name': 'Test Product',
            'sku': f'TEST-{Product.objects.count() + 1}',
        }
        defaults.update(kwargs)
        return Product.objects.create(**defaults)
    
    return _create_product
```

---

## Task 82: Add Tax Calculation Tests

### Description
Create tests for tax calculation service and tax-related models.

### Acceptance Criteria
- [ ] Test TaxCategory model
- [ ] Test TaxCalculatorService
- [ ] Test different tax rates
- [ ] Test tax-inclusive vs exclusive
- [ ] Test rounding edge cases
- [ ] Test tenant-specific taxes

### File Path
```
backend/apps/products/pricing/tests/test_tax_calculation.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal

from apps.products.pricing.models import TaxCategory
from apps.products.pricing.services.tax_calculator import TaxCalculatorService


@pytest.mark.django_db
class TestTaxCategoryModel:
    """Test TaxCategory model."""
    
    def test_create_tax_category(self, tenant):
        """Test creating a tax category."""
        tax = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        
        assert tax.name == 'VAT'
        assert tax.rate == Decimal('15.00')
        assert tax.is_inclusive is False
    
    def test_tax_rate_validation(self, tenant):
        """Test tax rate must be between 0 and 100."""
        from django.core.exceptions import ValidationError
        
        # Invalid: negative
        tax = TaxCategory(
            tenant=tenant,
            name='VAT',
            rate=Decimal('-5.00'),
        )
        with pytest.raises(ValidationError):
            tax.full_clean()
        
        # Invalid: > 100
        tax.rate = Decimal('150.00')
        with pytest.raises(ValidationError):
            tax.full_clean()
    
    def test_default_tax_category(self, tenant):
        """Test only one default tax category per tenant."""
        tax1 = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_default=True,
        )
        
        # Create another default - should unset the first
        tax2 = TaxCategory.objects.create(
            tenant=tenant,
            name='NBT',
            rate=Decimal('2.00'),
            is_default=True,
        )
        
        tax1.refresh_from_db()
        assert tax1.is_default is False
        assert tax2.is_default is True


@pytest.mark.django_db
class TestTaxCalculatorService:
    """Test TaxCalculatorService."""
    
    def test_calculate_exclusive_tax(self, tenant):
        """Test calculating tax-exclusive prices."""
        tax_category = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        
        result = TaxCalculatorService.calculate_tax(
            base_price=Decimal('100.00'),
            tax_category=tax_category,
        )
        
        assert result['base_price'] == Decimal('100.00')
        assert result['tax_amount'] == Decimal('15.00')
        assert result['total_price'] == Decimal('115.00')
        assert result['is_inclusive'] is False
    
    def test_calculate_inclusive_tax(self, tenant):
        """Test calculating tax-inclusive prices."""
        tax_category = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=True,
        )
        
        result = TaxCalculatorService.calculate_tax(
            base_price=Decimal('115.00'),
            tax_category=tax_category,
        )
        
        # Price includes tax: 115 / 1.15 = 100
        assert result['base_price_without_tax'] == Decimal('100.00')
        assert result['tax_amount'] == Decimal('15.00')
        assert result['total_price'] == Decimal('115.00')
        assert result['is_inclusive'] is True
    
    def test_calculate_without_tax(self):
        """Test calculation with no tax."""
        result = TaxCalculatorService.calculate_tax(
            base_price=Decimal('100.00'),
            tax_category=None,
        )
        
        assert result['base_price'] == Decimal('100.00')
        assert result['tax_amount'] == Decimal('0.00')
        assert result['total_price'] == Decimal('100.00')
    
    def test_tax_rounding(self, tenant):
        """Test tax amount rounding."""
        tax_category = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        
        # Price that creates fractional tax
        result = TaxCalculatorService.calculate_tax(
            base_price=Decimal('33.33'),
            tax_category=tax_category,
        )
        
        # 33.33 * 0.15 = 4.9995 -> rounds to 5.00
        assert result['tax_amount'] == Decimal('5.00')
        assert result['total_price'] == Decimal('38.33')
    
    def test_bulk_tax_calculation(self, tenant):
        """Test calculating tax for multiple items."""
        tax_category = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT',
            rate=Decimal('15.00'),
            is_inclusive=False,
        )
        
        items = [
            {'price': Decimal('100.00'), 'quantity': 2},
            {'price': Decimal('50.00'), 'quantity': 3},
        ]
        
        results = TaxCalculatorService.bulk_calculate_tax(items, tax_category)
        
        # Item 1: 100 * 2 = 200, tax = 30
        assert results[0]['subtotal'] == Decimal('200.00')
        assert results[0]['tax_amount'] == Decimal('30.00')
        assert results[0]['total'] == Decimal('230.00')
        
        # Item 2: 50 * 3 = 150, tax = 22.50
        assert results[1]['subtotal'] == Decimal('150.00')
        assert results[1]['tax_amount'] == Decimal('22.50')
        assert results[1]['total'] == Decimal('172.50')
        
        # Grand total
        assert results['grand_total'] == Decimal('402.50')
    
    def test_sri_lanka_vat_rates(self, tenant):
        """Test Sri Lanka standard VAT rates."""
        # Standard VAT 15%
        vat = TaxCategory.objects.create(
            tenant=tenant,
            name='VAT 15%',
            rate=Decimal('15.00'),
            country_code='LK',
        )
        
        # NBT 2%
        nbt = TaxCategory.objects.create(
            tenant=tenant,
            name='NBT 2%',
            rate=Decimal('2.00'),
            country_code='LK',
        )
        
        # Calculate both taxes
        base_price = Decimal('1000.00')
        
        vat_result = TaxCalculatorService.calculate_tax(base_price, vat)
        nbt_result = TaxCalculatorService.calculate_tax(base_price, nbt)
        
        assert vat_result['tax_amount'] == Decimal('150.00')
        assert nbt_result['tax_amount'] == Decimal('20.00')
        
        # Combined
        total_tax = vat_result['tax_amount'] + nbt_result['tax_amount']
        assert total_tax == Decimal('170.00')
```

---

## Task 83: Create Tiered Pricing Tests

### Description
Test tiered pricing logic, tier resolution, and bulk calculations.

### Acceptance Criteria
- [ ] Test TieredPricing model
- [ ] Test tier resolution logic
- [ ] Test incremental vs all-units
- [ ] Test BulkPricingService
- [ ] Test edge cases (quantity boundaries)
- [ ] Test variant tier inheritance

### File Path
```
backend/apps/products/pricing/tests/test_tiered_pricing.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal

from apps.products.pricing.models import TieredPricing, VariantTieredPricing
from apps.products.pricing.services.bulk_pricing import BulkPricingService


@pytest.mark.django_db
class TestTieredPricingModel:
    """Test TieredPricing model."""
    
    def test_create_tiered_pricing(self, tenant, product):
        """Test creating tiered pricing."""
        tier = TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            max_quantity=49,
            unit_price=Decimal('95.00'),
            tier_type='incremental',
        )
        
        assert tier.min_quantity == 10
        assert tier.max_quantity == 49
        assert tier.unit_price == Decimal('95.00')
    
    def test_tier_overlap_validation(self, tenant, product):
        """Test that tier ranges cannot overlap."""
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            max_quantity=49,
            unit_price=Decimal('95.00'),
        )
        
        # Try to create overlapping tier
        from django.core.exceptions import ValidationError
        
        tier = TieredPricing(
            tenant=tenant,
            product=product,
            min_quantity=30,  # Overlaps with 10-49
            max_quantity=99,
            unit_price=Decimal('90.00'),
        )
        
        with pytest.raises(ValidationError):
            tier.clean()
    
    def test_tier_ordering(self, tenant, product):
        """Test tiers are ordered by min_quantity."""
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=50,
            unit_price=Decimal('90.00'),
        )
        
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            unit_price=Decimal('95.00'),
        )
        
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=100,
            unit_price=Decimal('85.00'),
        )
        
        tiers = TieredPricing.objects.filter(product=product)
        quantities = list(tiers.values_list('min_quantity', flat=True))
        
        assert quantities == [10, 50, 100]


@pytest.mark.django_db
class TestBulkPricingService:
    """Test BulkPricingService."""
    
    def test_calculate_all_units_pricing(self, tenant, product):
        """Test all-units tier pricing calculation."""
        # Create tiers
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=1,
            max_quantity=9,
            unit_price=Decimal('100.00'),
            tier_type='all_units',
        )
        
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
        
        # Test quantities
        # 5 units: 5 * 100 = 500
        result = BulkPricingService.calculate_tiered_price(product, 5)
        assert result['total'] == Decimal('500.00')
        assert result['unit_price'] == Decimal('100.00')
        
        # 25 units: 25 * 95 = 2375
        result = BulkPricingService.calculate_tiered_price(product, 25)
        assert result['total'] == Decimal('2375.00')
        assert result['unit_price'] == Decimal('95.00')
        
        # 60 units: 60 * 90 = 5400
        result = BulkPricingService.calculate_tiered_price(product, 60)
        assert result['total'] == Decimal('5400.00')
        assert result['unit_price'] == Decimal('90.00')
    
    def test_calculate_incremental_pricing(self, tenant, product):
        """Test incremental tier pricing calculation."""
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=1,
            max_quantity=9,
            unit_price=Decimal('100.00'),
            tier_type='incremental',
        )
        
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            max_quantity=49,
            unit_price=Decimal('95.00'),
            tier_type='incremental',
        )
        
        # 15 units:
        # - First 9: 9 * 100 = 900
        # - Next 6: 6 * 95 = 570
        # - Total: 1470
        result = BulkPricingService.calculate_tiered_price(product, 15)
        assert result['total'] == Decimal('1470.00')
        assert len(result['breakdown']) == 2
    
    def test_tier_boundary_cases(self, tenant, product):
        """Test pricing at tier boundaries."""
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=1,
            max_quantity=10,
            unit_price=Decimal('100.00'),
            tier_type='all_units',
        )
        
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=11,
            unit_price=Decimal('90.00'),
            tier_type='all_units',
        )
        
        # Exactly at boundary
        result = BulkPricingService.calculate_tiered_price(product, 10)
        assert result['unit_price'] == Decimal('100.00')
        
        # Just over boundary
        result = BulkPricingService.calculate_tiered_price(product, 11)
        assert result['unit_price'] == Decimal('90.00')
    
    def test_no_tiers_fallback(self, tenant, product, product_price):
        """Test fallback to base price when no tiers defined."""
        result = BulkPricingService.calculate_tiered_price(product, 10)
        
        assert result['unit_price'] == product_price.base_price
        assert result['total'] == product_price.base_price * 10
    
    def test_variant_tier_priority(self, tenant, product, variant):
        """Test variant tiers take priority over product tiers."""
        # Product tier
        TieredPricing.objects.create(
            tenant=tenant,
            product=product,
            min_quantity=10,
            unit_price=Decimal('95.00'),
            tier_type='all_units',
        )
        
        # Variant tier (overrides)
        VariantTieredPricing.objects.create(
            tenant=tenant,
            variant=variant,
            min_quantity=10,
            unit_price=Decimal('90.00'),
            tier_type='all_units',
        )
        
        # Should use variant tier
        result = BulkPricingService.calculate_tiered_price(variant, 10)
        assert result['unit_price'] == Decimal('90.00')
```

---

## Task 84: Add Scheduled Pricing Tests

### Description
Test scheduled pricing activation, expiry, priority resolution, and flash sales.

### Acceptance Criteria
- [ ] Test ScheduledPrice model
- [ ] Test Celery activation tasks
- [ ] Test priority resolution
- [ ] Test FlashSale quantity tracking
- [ ] Test expiry cleanup
- [ ] Test promotional analytics

### File Path
```
backend/apps/products/pricing/tests/test_scheduled_pricing.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

from apps.products.pricing.models import ScheduledPrice, FlashSale, PromotionalPrice
from apps.products.pricing.services.price_resolution import PriceResolutionService


@pytest.mark.django_db
class TestScheduledPriceModel:
    """Test ScheduledPrice model."""
    
    def test_create_scheduled_price(self, tenant, product):
        """Test creating a scheduled price."""
        start = timezone.now() + timedelta(days=1)
        end = start + timedelta(days=7)
        
        schedule = ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=start,
            end_datetime=end,
            priority=1,
        )
        
        assert schedule.status == ScheduledPrice.Status.PENDING
        assert schedule.priority == 1
    
    def test_datetime_validation(self, tenant, product):
        """Test start must be before end."""
        from django.core.exceptions import ValidationError
        
        start = timezone.now() + timedelta(days=7)
        end = start - timedelta(days=1)  # Invalid: end before start
        
        schedule = ScheduledPrice(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=start,
            end_datetime=end,
        )
        
        with pytest.raises(ValidationError):
            schedule.clean()
    
    def test_automatic_activation(self, tenant, product, celery_worker):
        """Test scheduled price activates automatically."""
        start = timezone.now() - timedelta(minutes=1)  # Started 1 min ago
        end = start + timedelta(days=1)
        
        schedule = ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=start,
            end_datetime=end,
            status=ScheduledPrice.Status.PENDING,
        )
        
        # Run activation task
        from apps.products.pricing.tasks import activate_scheduled_prices
        activate_scheduled_prices.apply()
        
        schedule.refresh_from_db()
        assert schedule.status == ScheduledPrice.Status.ACTIVE
    
    def test_automatic_expiry(self, tenant, product, celery_worker):
        """Test scheduled price expires automatically."""
        start = timezone.now() - timedelta(days=2)
        end = start + timedelta(days=1)  # Ended 1 day ago
        
        schedule = ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('79.99'),
            start_datetime=start,
            end_datetime=end,
            status=ScheduledPrice.Status.ACTIVE,
        )
        
        # Run deactivation task
        from apps.products.pricing.tasks import deactivate_expired_prices
        deactivate_expired_prices.apply()
        
        schedule.refresh_from_db()
        assert schedule.status == ScheduledPrice.Status.EXPIRED


@pytest.mark.django_db
class TestFlashSaleModel:
    """Test FlashSale model."""
    
    def test_create_flash_sale(self, tenant, product):
        """Test creating a flash sale."""
        start = timezone.now() + timedelta(hours=1)
        end = start + timedelta(hours=6)
        
        flash_sale = FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('49.99'),
            max_quantity=100,
            start_datetime=start,
            end_datetime=end,
        )
        
        assert flash_sale.quantity_remaining == 100
        assert not flash_sale.is_sold_out
    
    def test_quantity_tracking(self, tenant, product):
        """Test flash sale quantity tracking."""
        flash_sale = FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('49.99'),
            max_quantity=10,
            start_datetime=timezone.now(),
            end_datetime=timezone.now() + timedelta(hours=6),
            status=FlashSale.Status.ACTIVE,
        )
        
        # Sell 5 units
        flash_sale.record_sale(5)
        assert flash_sale.quantity_sold == 5
        assert flash_sale.quantity_remaining == 5
        
        # Sell remaining 5
        flash_sale.record_sale(5)
        assert flash_sale.is_sold_out
    
    def test_urgency_levels(self, tenant, product):
        """Test flash sale urgency level calculation."""
        flash_sale = FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('49.99'),
            max_quantity=100,
            start_datetime=timezone.now(),
            end_datetime=timezone.now() + timedelta(hours=6),
        )
        
        # 100% remaining: low urgency
        assert flash_sale.urgency_level == 'low'
        
        # 50% sold: medium urgency
        flash_sale.record_sale(50)
        assert flash_sale.urgency_level == 'medium'
        
        # 90% sold: high urgency
        flash_sale.record_sale(40)
        assert flash_sale.urgency_level == 'high'


@pytest.mark.django_db
class TestPriceResolution:
    """Test price resolution with multiple pricing rules."""
    
    def test_priority_resolution(self, tenant, product, product_price):
        """Test price resolution respects priority."""
        # Base price: 100
        product_price.base_price = Decimal('100.00')
        product_price.save()
        
        now = timezone.now()
        
        # Low priority scheduled price: 90
        ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('90.00'),
            start_datetime=now - timedelta(hours=1),
            end_datetime=now + timedelta(days=1),
            priority=1,
            status=ScheduledPrice.Status.ACTIVE,
        )
        
        # High priority flash sale: 75
        FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('75.00'),
            max_quantity=100,
            start_datetime=now - timedelta(hours=1),
            end_datetime=now + timedelta(hours=6),
            priority=10,
            status=FlashSale.Status.ACTIVE,
        )
        
        # Should return flash sale price (higher priority)
        effective_price = PriceResolutionService.get_effective_price(product)
        assert effective_price['price'] == Decimal('75.00')
        assert effective_price['price_type'] == 'flash_sale'
    
    def test_sold_out_flash_sale_fallback(self, tenant, product, product_price):
        """Test fallback when flash sale is sold out."""
        product_price.base_price = Decimal('100.00')
        product_price.save()
        
        now = timezone.now()
        
        # Flash sale (sold out)
        flash_sale = FlashSale.objects.create(
            tenant=tenant,
            product=product,
            flash_price=Decimal('75.00'),
            max_quantity=10,
            start_datetime=now - timedelta(hours=1),
            end_datetime=now + timedelta(hours=6),
            status=FlashSale.Status.ACTIVE,
        )
        flash_sale.record_sale(10)  # Sold out
        
        # Scheduled price
        ScheduledPrice.objects.create(
            tenant=tenant,
            product=product,
            scheduled_price=Decimal('90.00'),
            start_datetime=now - timedelta(hours=1),
            end_datetime=now + timedelta(days=1),
            priority=1,
            status=ScheduledPrice.Status.ACTIVE,
        )
        
        # Should fallback to scheduled price
        effective_price = PriceResolutionService.get_effective_price(product)
        assert effective_price['price'] == Decimal('90.00')
        assert effective_price['price_type'] == 'scheduled'


# Fixtures
@pytest.fixture
def product_price(tenant, product):
    """Create product price."""
    from apps.products.pricing.models import ProductPrice
    
    return ProductPrice.objects.create(
        tenant=tenant,
        product=product,
        base_price=Decimal('100.00'),
    )
```

---

## Test Configuration

```python
# pytest.ini or pyproject.toml

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.test"
python_files = ["test_*.py", "*_test.py", "tests.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = [
    "--cov=apps.products.pricing",
    "--cov-report=html",
    "--cov-report=term-missing:skip-covered",
    "--cov-fail-under=90",
    "-v",
]
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Create API integration tests and documentation
