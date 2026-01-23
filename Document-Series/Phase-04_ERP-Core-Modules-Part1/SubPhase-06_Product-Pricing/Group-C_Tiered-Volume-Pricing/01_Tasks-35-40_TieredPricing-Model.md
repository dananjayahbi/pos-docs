# Tasks 35-40: TieredPricing Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** C - Tiered & Volume Pricing  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../../Group-B_Tax-Integration-Calculation/03_Tasks-29-34_Breakdown-Cache-Tests.md](../../Group-B_Tax-Integration-Calculation/03_Tasks-29-34_Breakdown-Cache-Tests.md)
- **→ Next Document:** [02_Tasks-41-46_Variant-Tiers-Types.md](02_Tasks-41-46_Variant-Tiers-Types.md)

---

## Document Overview

This document creates the TieredPricing model for quantity-based pricing, implements tier validation to prevent overlaps, adds lookup methods for finding applicable tiers, creates tiered price calculations, and adds display helpers for showing tier information to customers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create TieredPricing model | Medium | 30 min |
| 36 | Add tier validation | Medium | 25 min |
| 37 | Create TieredPricing Meta class | Low | 15 min |
| 38 | Add tier lookup method | Medium | 25 min |
| 39 | Create tiered price calculation | Low | 20 min |
| 40 | Add tier display helper | Low | 15 min |

---

## Task 35: Create TieredPricing Model

### Overview
Create TieredPricing model to store quantity-based price breaks for wholesale and volume purchases, supporting graduated discounts based on purchase quantities for B2B and bulk retail customers.

### Dependencies
- ProductPrice model complete (Group A)
- Django models understanding
- Multi-tenancy setup

### Instructions

1. **Create `tiered_pricing.py` file**
   - Create in `backend/apps/products/pricing/models/`
   - Will contain TieredPricing and related models

2. **Import required modules**
   - Django model imports
   - TenantMixin for multi-tenancy
   - Decimal for precise calculations
   - ValidationError for validation
   - Product model

3. **Define TieredPricing model**
   - Inherit from TenantMixin and models.Model
   - Tenant-aware model

4. **Add core fields**
   - `tenant`: ForeignKey to Tenant
   - `product`: ForeignKey to Product (related_name='tiered_prices')
   - `min_quantity`: PositiveIntegerField (minimum quantity for tier)
   - `max_quantity`: PositiveIntegerField (maximum quantity, nullable)
   - `tier_price`: DecimalField (price per unit at this tier)
   - `is_active`: BooleanField (default=True)

5. **Add metadata fields**
   - `name`: CharField (optional tier name like "Wholesale", "Bulk")
   - `description`: TextField (optional explanation)
   - `created_at`: DateTimeField (auto_now_add=True)
   - `updated_at`: DateTimeField (auto_now=True)

6. **Add decimal field configuration**
   - tier_price: max_digits=12, decimal_places=2
   - Currency: LKR (Sri Lankan Rupees)

7. **Add __str__ method**
   - Return formatted string
   - Example: "Laptop: 10-49 units at ₨ 95,000"

8. **Add get_tier_range method**
   - Return formatted quantity range
   - Handle unlimited max (None)
   - Example: "10-49 units" or "50+ units"

9. **Add get_discount_percentage method**
   - Calculate discount vs base price
   - Accept base_price parameter
   - Return percentage discount

10. **Add is_quantity_in_tier method**
    - Check if given quantity falls in this tier
    - Accept quantity parameter
    - Return Boolean

11. **Update `__init__.py` in models directory**
    - Import TieredPricing
    - Make available in package

### Model Fields Summary

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| tenant | ForeignKey | Tenant isolation | Tenant1 |
| product | ForeignKey | Associated product | Laptop ID |
| min_quantity | PositiveInteger | Tier minimum | 10 |
| max_quantity | PositiveInteger | Tier maximum (null=unlimited) | 49 or None |
| tier_price | Decimal(12,2) | Price per unit | ₨ 95,000.00 |
| name | CharField | Optional tier name | "Wholesale" |
| is_active | Boolean | Enable/disable tier | True |

### Business Examples

**Example 1: Basic Tiered Pricing Structure**
```python
# Laptop tiered pricing
# Base price: ₨ 100,000/unit

# Tier 1: 1-9 units (retail)
# Uses base_price, no tier needed

# Tier 2: 10-49 units (small wholesale)
tier2 = TieredPricing.objects.create(
    tenant=tenant,
    product=laptop,
    name="Small Wholesale",
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('95000.00')  # 5% off
)

# Tier 3: 50-99 units (wholesale)
tier3 = TieredPricing.objects.create(
    tenant=tenant,
    product=laptop,
    name="Wholesale",
    min_quantity=50,
    max_quantity=99,
    tier_price=Decimal('90000.00')  # 10% off
)

# Tier 4: 100+ units (bulk/distributor)
tier4 = TieredPricing.objects.create(
    tenant=tenant,
    product=laptop,
    name="Bulk Distributor",
    min_quantity=100,
    max_quantity=None,  # Unlimited
    tier_price=Decimal('85000.00')  # 15% off
)
```

**Example 2: Office Supplies Tiered Pricing**
```python
# Paper reams tiered pricing
paper = Product.objects.get(name='A4 Paper Ream')

# Retail: 1-9 reams at ₨ 850
# Tier 2: 10-49 reams (office)
TieredPricing.objects.create(
    tenant=tenant,
    product=paper,
    name="Office Quantity",
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('800.00')
)

# Tier 3: 50+ reams (bulk office)
TieredPricing.objects.create(
    tenant=tenant,
    product=paper,
    name="Bulk Office",
    min_quantity=50,
    max_quantity=None,
    tier_price=Decimal('750.00')
)
```

**Example 3: Food & Beverage B2B Pricing**
```python
# Bottled water case tiered pricing
water_case = Product.objects.get(name='Water 500ml Case (24 bottles)')

# Tier 1: 5-19 cases (small restaurants)
TieredPricing.objects.create(
    product=water_case,
    min_quantity=5,
    max_quantity=19,
    tier_price=Decimal('1200.00')  # ₨ 1,200/case
)

# Tier 2: 20-49 cases (medium restaurants)
TieredPricing.objects.create(
    product=water_case,
    min_quantity=20,
    max_quantity=49,
    tier_price=Decimal('1150.00')
)

# Tier 3: 50+ cases (distributors/hotels)
TieredPricing.objects.create(
    product=water_case,
    min_quantity=50,
    max_quantity=None,
    tier_price=Decimal('1100.00')
)
```

**Example 4: Method Usage**
```python
tier = TieredPricing.objects.get(product=laptop, min_quantity=10)

# Get formatted range
print(tier.get_tier_range())
# Output: "10-49 units"

# Check if quantity in tier
print(tier.is_quantity_in_tier(25))  # True
print(tier.is_quantity_in_tier(5))   # False
print(tier.is_quantity_in_tier(75))  # False

# Calculate discount percentage
base_price = laptop.price.base_price  # ₨ 100,000
discount = tier.get_discount_percentage(base_price)
# Output: 5.00 (5% off)

# Display
print(str(tier))
# Output: "Laptop: 10-49 units at ₨ 95,000"
```

### Sri Lankan Business Context

**Common Tiered Pricing Scenarios:**
- **Retail Shops:** Buy more, save more on office supplies
- **Restaurants:** Food suppliers offer tiers for bulk orders
- **Wholesalers:** Graduated pricing for distributors
- **Manufacturing:** Raw material bulk discounts
- **Technology:** Corporate volume licensing

**Typical Tier Breaks:**
- Small business: 10-50 units
- Medium business: 50-100 units
- Large business: 100-500 units
- Distributor: 500+ units

### Expected Outcome

TieredPricing model created with all required fields, methods for checking quantity ranges, discount calculations, and formatted display.

### Verification Checklist

- [ ] `tiered_pricing.py` file created
- [ ] TieredPricing model inherits TenantMixin
- [ ] `tenant` ForeignKey added
- [ ] `product` ForeignKey with related_name
- [ ] `min_quantity` PositiveIntegerField
- [ ] `max_quantity` PositiveIntegerField (nullable)
- [ ] `tier_price` DecimalField(12,2)
- [ ] `name` and `description` optional fields
- [ ] `is_active` BooleanField with default=True
- [ ] Timestamp fields (created_at, updated_at)
- [ ] `__str__()` method returns formatted string
- [ ] `get_tier_range()` method formats quantity range
- [ ] `get_discount_percentage()` calculates discount
- [ ] `is_quantity_in_tier()` checks quantity inclusion
- [ ] Model imported in `__init__.py`

---

## Task 36: Add Tier Validation

### Overview
Implement comprehensive tier validation to prevent overlapping quantity ranges, ensure logical min/max values, validate prices, and maintain data integrity for tiered pricing configurations.

### Dependencies
- Task 35: TieredPricing model created

### Instructions

1. **Open `tiered_pricing.py` file**
   - Add validation to TieredPricing model

2. **Create clean() method**
   - Override Model.clean()
   - Run all validation checks
   - Raise ValidationError if invalid

3. **Add min/max quantity validation**
   - Validate: min_quantity >= 1
   - Validate: if max_quantity exists, max_quantity > min_quantity
   - Validate: if max_quantity exists, max_quantity >= 2
   - Raise appropriate error messages

4. **Create overlap detection**
   - Check for overlapping ranges with existing tiers
   - Query existing tiers for same product
   - Exclude current instance (for updates)
   - Detect overlaps using range logic

5. **Add overlap detection logic**
   - Check if new tier's min falls in existing range
   - Check if new tier's max falls in existing range
   - Check if new tier encompasses existing range
   - Handle unlimited max (None) scenarios

6. **Validate tier price vs base price**
   - Tier price should be <= base price
   - Warning if tier price > base (unusual but allow)
   - Ensure tier price > 0

7. **Add consistency validation**
   - Cannot have gap-only tiers (must be contiguous or allow gaps)
   - Configurable: strict (no gaps) vs flexible (allow gaps)

8. **Create validation error messages**
   - Clear, actionable error messages
   - Include specific range details
   - Example: "Overlaps with tier 10-49 units"

9. **Add save() override**
   - Call full_clean() before saving
   - Ensures validation always runs

10. **Create class method validate_tier_set**
    - Validate complete tier set for product
    - Check for gaps (optional)
    - Check for logical progression
    - Return validation report

11. **Add unit tests for validation**
    - Test overlap scenarios
    - Test min/max logic
    - Test price validation

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| **Min Quantity** | min_quantity >= 1 | "Minimum quantity must be at least 1" |
| **Max > Min** | max_quantity > min_quantity | "Maximum must be greater than minimum" |
| **No Overlap** | No range intersections | "Overlaps with tier {range}" |
| **Positive Price** | tier_price > 0 | "Tier price must be positive" |
| **Logical Range** | max_quantity >= 2 if set | "Maximum must be at least 2" |

### Overlap Detection Logic

```
Overlap scenarios to detect:

Tier A: [10, 49]
Tier B: [20, 59] ← OVERLAP (20-49 overlaps)

Tier A: [10, 49]
Tier B: [5, 15] ← OVERLAP (10-15 overlaps)

Tier A: [10, 49]
Tier B: [25, 35] ← OVERLAP (25-35 within A)

Tier A: [10, None] (unlimited)
Tier B: [50, 99] ← OVERLAP (50+ overlaps with unlimited)

Valid (no overlap):
Tier A: [10, 49]
Tier B: [50, 99] ← OK (contiguous)

Tier A: [10, 49]
Tier B: [60, 99] ← OK (gap allowed)
```

### Business Examples

**Example 1: Basic Validation**
```python
# Valid tier
tier = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('95000.00')
)
tier.full_clean()  # Passes
tier.save()

# Invalid: max < min
tier = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=50,
    max_quantity=10,  # ERROR: max < min
    tier_price=Decimal('95000.00')
)
tier.full_clean()
# Raises: ValidationError("Maximum must be greater than minimum")
```

**Example 2: Overlap Detection**
```python
# Existing tier
existing = TieredPricing.objects.create(
    tenant=tenant,
    product=laptop,
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('95000.00')
)

# Try to create overlapping tier
overlap = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=40,  # Overlaps with 10-49
    max_quantity=79,
    tier_price=Decimal('90000.00')
)
overlap.full_clean()
# Raises: ValidationError("Quantity range overlaps with existing tier: 10-49 units")
```

**Example 3: Price Validation**
```python
# Invalid: negative price
tier = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('-95000.00')  # ERROR: negative
)
tier.full_clean()
# Raises: ValidationError("Tier price must be positive")

# Invalid: zero price
tier = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=10,
    max_quantity=49,
    tier_price=Decimal('0.00')  # ERROR: zero
)
tier.full_clean()
# Raises: ValidationError("Tier price must be positive")
```

**Example 4: Unlimited Max Validation**
```python
# First unlimited tier
tier1 = TieredPricing.objects.create(
    tenant=tenant,
    product=laptop,
    min_quantity=100,
    max_quantity=None,  # Unlimited
    tier_price=Decimal('85000.00')
)

# Try to add another tier above it
tier2 = TieredPricing(
    tenant=tenant,
    product=laptop,
    min_quantity=200,  # ERROR: tier1 already unlimited
    max_quantity=None,
    tier_price=Decimal('80000.00')
)
tier2.full_clean()
# Raises: ValidationError("Quantity range overlaps with unlimited tier: 100+ units")
```

**Example 5: Tier Set Validation**
```python
# Validate complete tier set
tiers = TieredPricing.objects.filter(product=laptop)

validation_report = TieredPricing.validate_tier_set(laptop)

# Result:
{
    'is_valid': True,
    'tiers_count': 3,
    'gaps': [],  # Or list of gaps if any
    'covered_range': '10-unlimited',
    'issues': []
}

# With gaps:
{
    'is_valid': True,
    'tiers_count': 2,
    'gaps': [(50, 99)],  # Gap between tiers
    'covered_range': '10-49, 100+',
    'issues': ['Gap detected: 50-99 units have no tier pricing']
}
```

### Implementation Pattern

```python
from django.core.exceptions import ValidationError
from django.db import models

class TieredPricing(TenantMixin, models.Model):
    # ... fields ...
    
    def clean(self):
        """Validate tier configuration."""
        # Validate min quantity
        if self.min_quantity < 1:
            raise ValidationError("Minimum quantity must be at least 1")
        
        # Validate max > min
        if self.max_quantity is not None:
            if self.max_quantity <= self.min_quantity:
                raise ValidationError("Maximum must be greater than minimum")
            if self.max_quantity < 2:
                raise ValidationError("Maximum must be at least 2")
        
        # Validate price
        if self.tier_price <= 0:
            raise ValidationError("Tier price must be positive")
        
        # Check for overlaps
        self._check_overlaps()
    
    def _check_overlaps(self):
        """Check for overlapping tiers."""
        existing_tiers = TieredPricing.objects.filter(
            tenant=self.tenant,
            product=self.product,
            is_active=True
        ).exclude(pk=self.pk)
        
        for tier in existing_tiers:
            if self._ranges_overlap(tier):
                raise ValidationError(
                    f"Quantity range overlaps with existing tier: {tier.get_tier_range()}"
                )
    
    def _ranges_overlap(self, other):
        """Check if this tier overlaps with another."""
        # Handle unlimited max scenarios
        if self.max_quantity is None:
            # This tier is unlimited
            if other.max_quantity is None:
                # Both unlimited, check mins
                return self.min_quantity == other.min_quantity
            else:
                # This unlimited, other bounded
                return self.min_quantity <= other.max_quantity
        elif other.max_quantity is None:
            # Other unlimited, this bounded
            return self.max_quantity >= other.min_quantity
        else:
            # Both bounded
            return not (
                self.max_quantity < other.min_quantity or
                self.min_quantity > other.max_quantity
            )
    
    def save(self, *args, **kwargs):
        """Save with validation."""
        self.full_clean()
        super().save(*args, **kwargs)
```

### Expected Outcome

Comprehensive tier validation preventing overlaps, ensuring logical configurations, and maintaining data integrity with clear error messages.

### Verification Checklist

- [ ] `clean()` method added to TieredPricing
- [ ] Validates min_quantity >= 1
- [ ] Validates max_quantity > min_quantity
- [ ] Validates tier_price > 0
- [ ] `_check_overlaps()` detects overlapping ranges
- [ ] `_ranges_overlap()` handles all overlap scenarios
- [ ] Handles unlimited max (None) correctly
- [ ] `save()` override calls full_clean()
- [ ] Clear, actionable error messages
- [ ] `validate_tier_set()` class method (optional)
- [ ] Unit tests cover all validation scenarios

---

## Task 37: Create TieredPricing Meta Class

### Overview
Configure TieredPricing model Meta class with appropriate ordering, indexes, constraints, and database optimizations for efficient tier lookup and management.

### Dependencies
- Task 35-36: TieredPricing model and validation complete

### Instructions

1. **Open `tiered_pricing.py` file**
   - Add Meta class to TieredPricing model

2. **Set default ordering**
   - Order by: tenant, product, min_quantity (ascending)
   - Ensures tiers display in logical order
   - Helps with tier lookup performance

3. **Add database indexes**
   - Index: ('tenant', 'product', 'min_quantity')
   - Index: ('tenant', 'product', 'is_active')
   - Index: ('tenant', 'is_active', 'min_quantity')
   - Optimize tier lookups by quantity

4. **Create unique_together constraint**
   - Constraint: ('tenant', 'product', 'min_quantity')
   - Prevents duplicate tier starting points
   - Ensures data integrity

5. **Add verbose names**
   - verbose_name = "Tiered Pricing"
   - verbose_name_plural = "Tiered Pricing Rules"
   - Improves admin readability

6. **Set database table name**
   - db_table = 'pricing_tiered_pricing'
   - Explicit table naming for clarity

7. **Add constraints list**
   - CheckConstraint: max_quantity > min_quantity (if not None)
   - CheckConstraint: tier_price > 0
   - CheckConstraint: min_quantity >= 1

8. **Add permissions**
   - Custom permissions for tier management
   - 'can_manage_tiered_pricing'
   - 'can_view_tier_reports'

9. **Configure schema**
   - Ensure compatible with multi-tenancy
   - Consider partitioning for large datasets

### Meta Configuration

```python
class Meta:
    ordering = ['tenant', 'product', 'min_quantity']
    verbose_name = "Tiered Pricing"
    verbose_name_plural = "Tiered Pricing Rules"
    db_table = 'pricing_tiered_pricing'
    
    indexes = [
        models.Index(fields=['tenant', 'product', 'min_quantity']),
        models.Index(fields=['tenant', 'product', 'is_active']),
        models.Index(fields=['tenant', 'is_active', 'min_quantity']),
    ]
    
    unique_together = [
        ('tenant', 'product', 'min_quantity')
    ]
    
    constraints = [
        models.CheckConstraint(
            check=models.Q(tier_price__gt=0),
            name='tier_price_positive'
        ),
        models.CheckConstraint(
            check=models.Q(min_quantity__gte=1),
            name='min_quantity_at_least_one'
        ),
    ]
    
    permissions = [
        ('can_manage_tiered_pricing', 'Can manage tiered pricing rules'),
        ('can_view_tier_reports', 'Can view tiered pricing reports'),
    ]
```

### Business Benefits

| Configuration | Business Benefit |
|---------------|------------------|
| **Ordering** | Tiers display in logical sequence |
| **Indexes** | Fast tier lookup during checkout |
| **unique_together** | Prevents configuration errors |
| **CheckConstraints** | Enforces business rules at DB level |
| **Permissions** | Control who can modify pricing |

### Expected Outcome

Well-configured Meta class optimizing tier lookup performance and enforcing data integrity at the database level.

### Verification Checklist

- [ ] Meta class added to TieredPricing
- [ ] ordering = ['tenant', 'product', 'min_quantity']
- [ ] Database indexes for tenant, product, min_quantity
- [ ] Index for active tier filtering
- [ ] unique_together constraint prevents duplicates
- [ ] CheckConstraint for positive tier_price
- [ ] CheckConstraint for min_quantity >= 1
- [ ] verbose_name and verbose_name_plural set
- [ ] db_table explicitly named
- [ ] Custom permissions defined (optional)

---

## Task 38: Add Tier Lookup Method

### Overview
Create efficient tier lookup methods to find the applicable tier for a given quantity, supporting both single-tier lookup and bulk tier lookups for cart calculations.

### Dependencies
- Task 35-37: TieredPricing model, validation, and Meta complete

### Instructions

1. **Open `tiered_pricing.py` file**
   - Add lookup methods

2. **Create TieredPricingManager**
   - Custom model manager
   - Add tier lookup query methods

3. **Add get_tier_for_quantity method**
   - Class method or manager method
   - Accept product and quantity parameters
   - Return applicable tier or None
   - Most specific tier (highest min_quantity that fits)

4. **Implement lookup logic**
   - Filter: tenant, product, is_active=True
   - Filter: min_quantity <= quantity
   - Filter: max_quantity >= quantity OR max_quantity IS NULL
   - Order by: min_quantity DESC (get highest matching tier)
   - Return first match

5. **Add get_all_tiers_for_product method**
   - Accept product parameter
   - Return queryset of all active tiers
   - Ordered by min_quantity

6. **Create get_tier_price method**
   - Convenience method
   - Accept product and quantity
   - Return tier_price or product base_price

7. **Add bulk tier lookup**
   - Method: get_tiers_for_quantities
   - Accept product and list of quantities
   - Return dictionary: {quantity: tier}
   - Optimize database queries

8. **Create get_next_tier method**
   - Accept current_quantity
   - Return next higher tier
   - Used for "buy X more for discount" hints

9. **Add caching consideration**
   - Consider caching tier lookups
   - Cache key: tenant:product:quantity
   - Invalidate on tier changes

10. **Create helper method has_tiered_pricing**
    - Check if product has any active tiers
    - Boolean return
    - Used for display logic

### Lookup Algorithm

```
Find tier for quantity Q:
  1. Get all active tiers for product
  2. Filter: min_quantity <= Q
  3. Filter: max_quantity >= Q OR max_quantity IS NULL
  4. Order by min_quantity DESC
  5. Return first (highest qualifying tier)

Example:
  Quantity: 35
  Tiers:
    - 1-9: ₨ 100,000
    - 10-49: ₨ 95,000  ← Match (35 in range)
    - 50-99: ₨ 90,000
  Result: Tier 2 (₨ 95,000)
```

### Business Examples

**Example 1: Basic Tier Lookup**
```python
# Create manager method
class TieredPricingManager(models.Manager):
    def get_tier_for_quantity(self, product, quantity):
        """Get applicable tier for quantity."""
        return self.filter(
            tenant=product.tenant,
            product=product,
            is_active=True,
            min_quantity__lte=quantity
        ).filter(
            models.Q(max_quantity__gte=quantity) | 
            models.Q(max_quantity__isnull=True)
        ).order_by('-min_quantity').first()

# Usage
laptop = Product.objects.get(name='Laptop')

tier = TieredPricing.objects.get_tier_for_quantity(laptop, 25)
if tier:
    print(f"Price for 25 units: {format_lkr(tier.tier_price)}")
    # Output: "Price for 25 units: ₨ 95,000"
else:
    print(f"No tier, using base: {format_lkr(laptop.price.base_price)}")
```

**Example 2: Tier Price Lookup**
```python
class TieredPricingManager(models.Manager):
    # ... previous methods ...
    
    def get_tier_price(self, product, quantity):
        """Get price for quantity (tier or base)."""
        tier = self.get_tier_for_quantity(product, quantity)
        if tier:
            return tier.tier_price
        return product.price.base_price

# Usage
price_for_15 = TieredPricing.objects.get_tier_price(laptop, 15)
# Returns: ₨ 95,000 (tier price)

price_for_5 = TieredPricing.objects.get_tier_price(laptop, 5)
# Returns: ₨ 100,000 (base price, no tier)
```

**Example 3: All Tiers for Product**
```python
def get_all_tiers_for_product(self, product):
    """Get all active tiers for product."""
    return self.filter(
        tenant=product.tenant,
        product=product,
        is_active=True
    ).order_by('min_quantity')

# Usage
tiers = TieredPricing.objects.get_all_tiers_for_product(laptop)

print("Available discounts:")
for tier in tiers:
    print(f"  {tier.get_tier_range()}: {format_lkr(tier.tier_price)}/unit")

# Output:
# Available discounts:
#   10-49 units: ₨ 95,000/unit
#   50-99 units: ₨ 90,000/unit
#   100+ units: ₨ 85,000/unit
```

**Example 4: Next Tier Hint**
```python
def get_next_tier(self, product, current_quantity):
    """Get next higher tier."""
    return self.filter(
        tenant=product.tenant,
        product=product,
        is_active=True,
        min_quantity__gt=current_quantity
    ).order_by('min_quantity').first()

# Usage
current_qty = 8
next_tier = TieredPricing.objects.get_next_tier(laptop, current_qty)

if next_tier:
    units_needed = next_tier.min_quantity - current_qty
    savings = laptop.price.base_price - next_tier.tier_price
    print(f"Add {units_needed} more units to save {format_lkr(savings)}/unit!")
    # Output: "Add 2 more units to save ₨ 5,000/unit!"
```

**Example 5: Bulk Tier Lookup**
```python
def get_tiers_for_quantities(self, product, quantities):
    """Get tiers for multiple quantities efficiently."""
    # Get all tiers once
    all_tiers = list(self.get_all_tiers_for_product(product))
    
    result = {}
    for qty in quantities:
        # Find matching tier
        matching_tier = None
        for tier in reversed(all_tiers):  # Start from highest
            if tier.min_quantity <= qty:
                if tier.max_quantity is None or tier.max_quantity >= qty:
                    matching_tier = tier
                    break
        result[qty] = matching_tier
    
    return result

# Usage
cart_quantities = [5, 15, 75, 150]
tier_map = TieredPricing.objects.get_tiers_for_quantities(laptop, cart_quantities)

for qty, tier in tier_map.items():
    if tier:
        print(f"{qty} units: {format_lkr(tier.tier_price)} (tier)")
    else:
        print(f"{qty} units: {format_lkr(laptop.price.base_price)} (base)")

# Output:
# 5 units: ₨ 100,000 (base)
# 15 units: ₨ 95,000 (tier)
# 75 units: ₨ 90,000 (tier)
# 150 units: ₨ 85,000 (tier)
```

**Example 6: Has Tiered Pricing Check**
```python
def has_tiered_pricing(self, product):
    """Check if product has active tiers."""
    return self.filter(
        tenant=product.tenant,
        product=product,
        is_active=True
    ).exists()

# Usage in template
{% if product.tiered_prices.has_tiered_pricing %}
  <div class="bulk-discount-badge">
    Volume Discounts Available
  </div>
{% endif %}
```

### Performance Optimization

```python
# Optimize with select_related and prefetch_related
tiers = TieredPricing.objects.filter(
    product=laptop,
    is_active=True
).select_related('product', 'product__price').order_by('min_quantity')

# For bulk operations:
products = Product.objects.prefetch_related(
    models.Prefetch(
        'tiered_prices',
        queryset=TieredPricing.objects.filter(is_active=True)
    )
)
```

### Expected Outcome

Efficient tier lookup methods enabling fast tier determination during checkout, cart calculations, and product display.

### Verification Checklist

- [ ] TieredPricingManager class created
- [ ] `get_tier_for_quantity()` returns correct tier
- [ ] Handles quantity not in any tier (returns None)
- [ ] Handles unlimited max_quantity correctly
- [ ] `get_all_tiers_for_product()` returns ordered queryset
- [ ] `get_tier_price()` returns tier or base price
- [ ] `get_tiers_for_quantities()` bulk lookup implemented
- [ ] `get_next_tier()` finds next higher tier
- [ ] `has_tiered_pricing()` checks tier existence
- [ ] Manager assigned to model: objects = TieredPricingManager()

---

## Task 39: Create Tiered Price Calculation

### Overview
Implement tiered price calculation methods that compute total prices for quantities using tier pricing, supporting both single-quantity and multi-item calculations for cart totals.

### Dependencies
- Task 38: Tier lookup methods complete

### Instructions

1. **Open `tiered_pricing.py` file**
   - Add calculation methods to TieredPricing model

2. **Create calculate_price_for_quantity method**
   - Instance method
   - Accept quantity parameter
   - Return total price (tier_price × quantity)

3. **Add calculate_savings method**
   - Accept quantity and base_price parameters
   - Calculate savings vs base price
   - Return savings amount

4. **Create calculate_effective_unit_price method**
   - For incremental tiers (later task)
   - Calculate average unit price
   - Handle mixed tier quantities

5. **Add model property for unit savings**
   - Property: unit_savings(base_price)
   - Return per-unit savings
   - Used for display

6. **Create class method calculate_total_for_product**
   - Accept product and quantity
   - Find applicable tier
   - Calculate total
   - Return breakdown dictionary

7. **Add breakdown dictionary structure**
   - quantity
   - unit_price (tier or base)
   - total_price
   - base_total (for comparison)
   - savings
   - tier_applied (name/range)

8. **Create display formatting method**
   - Format calculation for display
   - Include savings highlight
   - Human-readable output

9. **Add calculation validation**
   - Ensure quantity > 0
   - Handle edge cases
   - Return appropriate errors

### Calculation Formula

```
Simple Tier Calculation (ALL_UNITS type):
  Total = tier_price × quantity

Example:
  Tier: 10-49 units at ₨ 95,000
  Quantity: 25
  Total = ₨ 95,000 × 25 = ₨ 2,375,000

Savings Calculation:
  Base Total = base_price × quantity
  Tier Total = tier_price × quantity
  Savings = Base Total - Tier Total

Example:
  Base: ₨ 100,000 × 25 = ₨ 2,500,000
  Tier: ₨ 95,000 × 25 = ₨ 2,375,000
  Savings = ₨ 2,500,000 - ₨ 2,375,000 = ₨ 125,000
```

### Business Examples

**Example 1: Basic Tier Calculation**
```python
class TieredPricing(TenantMixin, models.Model):
    # ... fields and methods ...
    
    def calculate_price_for_quantity(self, quantity):
        """Calculate total price for quantity."""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        
        return self.tier_price * quantity
    
    def calculate_savings(self, quantity, base_price):
        """Calculate savings vs base price."""
        base_total = base_price * quantity
        tier_total = self.calculate_price_for_quantity(quantity)
        return base_total - tier_total

# Usage
tier = TieredPricing.objects.get_tier_for_quantity(laptop, 25)
total = tier.calculate_price_for_quantity(25)
# Result: ₨ 2,375,000

savings = tier.calculate_savings(25, laptop.price.base_price)
# Result: ₨ 125,000 savings
```

**Example 2: Complete Calculation Breakdown**
```python
class TieredPricingManager(models.Manager):
    # ... previous methods ...
    
    def calculate_total_for_product(self, product, quantity):
        """Calculate total with tier pricing."""
        tier = self.get_tier_for_quantity(product, quantity)
        base_price = product.price.base_price
        
        if tier:
            unit_price = tier.tier_price
            tier_applied = tier.get_tier_range()
        else:
            unit_price = base_price
            tier_applied = None
        
        total_price = unit_price * quantity
        base_total = base_price * quantity
        savings = base_total - total_price
        
        return {
            'quantity': quantity,
            'unit_price': unit_price,
            'total_price': total_price,
            'base_total': base_total,
            'savings': savings,
            'savings_percentage': (savings / base_total * 100) if base_total > 0 else 0,
            'tier_applied': tier_applied,
            'tier_name': tier.name if tier else None
        }

# Usage
breakdown = TieredPricing.objects.calculate_total_for_product(laptop, 25)

# Result:
{
    'quantity': 25,
    'unit_price': Decimal('95000.00'),
    'total_price': Decimal('2375000.00'),
    'base_total': Decimal('2500000.00'),
    'savings': Decimal('125000.00'),
    'savings_percentage': Decimal('5.00'),
    'tier_applied': '10-49 units',
    'tier_name': 'Small Wholesale'
}
```

**Example 3: Display Formatted Calculation**
```python
class TieredPricing(TenantMixin, models.Model):
    # ... previous methods ...
    
    def format_calculation(self, quantity, base_price):
        """Format calculation for display."""
        total = self.calculate_price_for_quantity(quantity)
        savings = self.calculate_savings(quantity, base_price)
        
        return {
            'display': (
                f"{quantity} units × {format_lkr(self.tier_price)} = {format_lkr(total)}\n"
                f"You save: {format_lkr(savings)} "
                f"({self.get_discount_percentage(base_price):.1f}% off)"
            ),
            'total': total,
            'savings': savings
        }

# Usage
tier = TieredPricing.objects.get_tier_for_quantity(laptop, 25)
formatted = tier.format_calculation(25, laptop.price.base_price)

print(formatted['display'])
# Output:
# 25 units × ₨ 95,000 = ₨ 2,375,000
# You save: ₨ 125,000 (5.0% off)
```

**Example 4: Cart Item Calculation**
```python
class CartItem:
    def get_tiered_price_breakdown(self):
        """Get tiered pricing for cart item."""
        breakdown = TieredPricing.objects.calculate_total_for_product(
            self.product,
            self.quantity
        )
        
        return breakdown
    
    def get_total_with_tiers(self):
        """Get item total with tier pricing."""
        breakdown = self.get_tiered_price_breakdown()
        return breakdown['total_price']
    
    def get_savings(self):
        """Get savings from tier pricing."""
        breakdown = self.get_tiered_price_breakdown()
        return breakdown['savings']

# Usage
cart_item = CartItem(product=laptop, quantity=25)

total = cart_item.get_total_with_tiers()
# ₨ 2,375,000

savings = cart_item.get_savings()
# ₨ 125,000

if savings > 0:
    print(f"Tier discount: {format_lkr(savings)} saved!")
```

**Example 5: Comparison Table**
```python
def generate_tier_comparison(product):
    """Generate tier pricing comparison."""
    base_price = product.price.base_price
    tiers = TieredPricing.objects.get_all_tiers_for_product(product)
    
    comparison = []
    
    # Add base price row
    comparison.append({
        'range': '1-9 units',
        'unit_price': base_price,
        'example_qty': 5,
        'example_total': base_price * 5,
        'savings': Decimal('0')
    })
    
    # Add tier rows
    for tier in tiers:
        example_qty = tier.min_quantity + 5
        total = tier.calculate_price_for_quantity(example_qty)
        savings = tier.calculate_savings(example_qty, base_price)
        
        comparison.append({
            'range': tier.get_tier_range(),
            'unit_price': tier.tier_price,
            'example_qty': example_qty,
            'example_total': total,
            'savings': savings
        })
    
    return comparison

# Usage
comparison = generate_tier_comparison(laptop)

# Display as table:
print("Quantity Range | Unit Price   | Example (qty) | Total        | Savings")
print("---------------|--------------|---------------|--------------|-------------")
for row in comparison:
    print(f"{row['range']:14} | {format_lkr(row['unit_price']):12} | "
          f"{row['example_qty']:2} units      | {format_lkr(row['example_total']):12} | "
          f"{format_lkr(row['savings'])}")

# Output:
# Quantity Range | Unit Price   | Example (qty) | Total        | Savings
# ---------------|--------------|---------------|--------------|-------------
# 1-9 units      | ₨ 100,000    | 5 units       | ₨ 500,000    | ₨ 0
# 10-49 units    | ₨ 95,000     | 15 units      | ₨ 1,425,000  | ₨ 75,000
# 50-99 units    | ₨ 90,000     | 55 units      | ₨ 4,950,000  | ₨ 550,000
# 100+ units     | ₨ 85,000     | 105 units     | ₨ 8,925,000  | ₨ 1,575,000
```

### Expected Outcome

Complete tiered price calculation methods providing accurate totals, savings calculations, and formatted breakdowns for display.

### Verification Checklist

- [ ] `calculate_price_for_quantity()` returns correct total
- [ ] `calculate_savings()` computes savings vs base
- [ ] `calculate_total_for_product()` returns breakdown dict
- [ ] Breakdown includes quantity, unit_price, total, savings
- [ ] `format_calculation()` returns human-readable output
- [ ] Validation for quantity > 0
- [ ] Handles edge cases (no tier, quantity=1)
- [ ] Methods support Decimal precision

---

## Task 40: Add Tier Display Helper

### Overview
Create helper methods and properties for displaying tier information to customers, including formatted ranges, discount percentages, savings amounts, and promotional messaging.

### Dependencies
- Task 35-39: TieredPricing model and calculations complete

### Instructions

1. **Open `tiered_pricing.py` file**
   - Add display helper methods

2. **Create get_display_string method**
   - Format tier for customer display
   - Example: "Buy 10-49 units: Save 5% (₨ 95,000/unit)"
   - Accept optional base_price for savings

3. **Add get_savings_message method**
   - Generate promotional message
   - Example: "Buy 10+ and save ₨ 5,000 per unit!"
   - Highlight savings

4. **Create get_tier_badge method**
   - Return badge text for UI
   - Examples: "5% OFF", "Wholesale Price", "Bulk Discount"
   - Used in product cards

5. **Add get_quantity_hint method**
   - Suggest quantities for tier
   - Example: "e.g., order 15 units"
   - Mid-range of tier

6. **Create format_for_api method**
   - Return JSON-serializable dict
   - Include all display information
   - Used in REST API responses

7. **Add template tag support**
   - Create template filters
   - Easy tier display in templates

8. **Create comparison helper**
   - Show all tiers as list
   - Formatted for product page
   - "Volume Discounts Available:"

9. **Add threshold proximity helper**
   - Check how close to next tier
   - Example: "Add 2 more for 10% discount!"
   - Cart page suggestion

10. **Create email-friendly format**
    - Plain text tier description
    - Used in order confirmations
    - No HTML formatting

### Display Formats

| Format | Example | Use Case |
|--------|---------|----------|
| **Short** | "10-49: ₨ 95K" | Product list |
| **Medium** | "10-49 units at ₨ 95,000" | Product detail |
| **Long** | "Buy 10-49 units: Save 5% (₨ 95,000/unit)" | Promotional |
| **Badge** | "5% OFF" | UI badge |
| **Hint** | "Order 15+ units" | Suggestion |

### Business Examples

**Example 1: Display String**
```python
class TieredPricing(TenantMixin, models.Model):
    # ... previous methods ...
    
    def get_display_string(self, base_price=None, format='medium'):
        """Get formatted display string."""
        range_str = self.get_tier_range()
        price_str = format_lkr(self.tier_price)
        
        if format == 'short':
            # Short format for lists
            return f"{range_str}: {price_str}"
        
        elif format == 'medium':
            # Medium format for product pages
            return f"{range_str} at {price_str}/unit"
        
        elif format == 'long' and base_price:
            # Long format with savings
            discount = self.get_discount_percentage(base_price)
            return (
                f"Buy {range_str}: Save {discount:.1f}% "
                f"({price_str}/unit)"
            )
        
        return f"{range_str} at {price_str}"

# Usage
tier = TieredPricing.objects.get_tier_for_quantity(laptop, 25)

print(tier.get_display_string(format='short'))
# "10-49: ₨ 95,000"

print(tier.get_display_string(format='medium'))
# "10-49 units at ₨ 95,000/unit"

print(tier.get_display_string(laptop.price.base_price, format='long'))
# "Buy 10-49 units: Save 5.0% (₨ 95,000/unit)"
```

**Example 2: Savings Message**
```python
def get_savings_message(self, base_price):
    """Generate promotional savings message."""
    savings = base_price - self.tier_price
    discount_pct = self.get_discount_percentage(base_price)
    
    if self.min_quantity == 1:
        return f"Now only {format_lkr(self.tier_price)}!"
    
    return (
        f"Buy {self.min_quantity}+ and save {format_lkr(savings)} "
        f"per unit ({discount_pct:.0f}% off)!"
    )

# Usage
tier = TieredPricing.objects.get_tier_for_quantity(laptop, 25)
message = tier.get_savings_message(laptop.price.base_price)

print(message)
# "Buy 10+ and save ₨ 5,000 per unit (5% off)!"
```

**Example 3: Tier Badge**
```python
def get_tier_badge(self, base_price):
    """Get badge text for UI."""
    discount_pct = self.get_discount_percentage(base_price)
    
    if discount_pct >= 20:
        return f"{discount_pct:.0f}% OFF"
    elif discount_pct >= 10:
        return "BULK DISCOUNT"
    elif discount_pct > 0:
        return "VOLUME PRICE"
    else:
        return self.name or "SPECIAL PRICE"

# Usage in template
<div class="tier-badge">
    {{ tier.get_tier_badge|upper }}
</div>

# Renders:
<div class="tier-badge">
    5% OFF
</div>
```

**Example 4: Product Page Display**
```python
def get_all_tiers_display(product):
    """Get formatted list of all tiers for product page."""
    tiers = TieredPricing.objects.get_all_tiers_for_product(product)
    base_price = product.price.base_price
    
    if not tiers.exists():
        return None
    
    display = {
        'title': 'Volume Discounts Available:',
        'tiers': []
    }
    
    for tier in tiers:
        display['tiers'].append({
            'range': tier.get_tier_range(),
            'price': format_lkr(tier.tier_price),
            'discount': f"{tier.get_discount_percentage(base_price):.0f}% OFF",
            'savings': format_lkr(base_price - tier.tier_price),
            'message': tier.get_savings_message(base_price)
        })
    
    return display

# Usage in template
{% with tiers=get_all_tiers_display(product) %}
{% if tiers %}
<div class="volume-discounts">
    <h4>{{ tiers.title }}</h4>
    <ul>
    {% for tier in tiers.tiers %}
        <li>
            <span class="range">{{ tier.range }}</span>
            <span class="price">{{ tier.price }}/unit</span>
            <span class="discount">{{ tier.discount }}</span>
            <span class="message">{{ tier.message }}</span>
        </li>
    {% endfor %}
    </ul>
</div>
{% endif %}
{% endwith %}
```

**Example 5: API Response Format**
```python
def format_for_api(self, base_price=None):
    """Format tier for API response."""
    data = {
        'id': self.id,
        'name': self.name,
        'min_quantity': self.min_quantity,
        'max_quantity': self.max_quantity,
        'tier_price': str(self.tier_price),
        'tier_price_formatted': format_lkr(self.tier_price),
        'range': self.get_tier_range(),
        'display_string': self.get_display_string(),
    }
    
    if base_price:
        data.update({
            'base_price': str(base_price),
            'discount_percentage': float(self.get_discount_percentage(base_price)),
            'unit_savings': str(base_price - self.tier_price),
            'unit_savings_formatted': format_lkr(base_price - self.tier_price),
            'savings_message': self.get_savings_message(base_price),
            'badge': self.get_tier_badge(base_price)
        })
    
    return data

# API endpoint usage
@api_view(['GET'])
def get_product_tiers(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    tiers = TieredPricing.objects.get_all_tiers_for_product(product)
    base_price = product.price.base_price
    
    return Response({
        'product_id': product.id,
        'product_name': product.name,
        'base_price': format_lkr(base_price),
        'has_tiered_pricing': tiers.exists(),
        'tiers': [tier.format_for_api(base_price) for tier in tiers]
    })
```

**Example 6: Cart Threshold Hint**
```python
def get_threshold_hint(product, current_quantity):
    """Suggest adding more for tier discount."""
    next_tier = TieredPricing.objects.get_next_tier(product, current_quantity)
    
    if not next_tier:
        return None
    
    units_needed = next_tier.min_quantity - current_quantity
    savings_per_unit = product.price.base_price - next_tier.tier_price
    total_savings = savings_per_unit * next_tier.min_quantity
    
    return {
        'message': f"Add {units_needed} more to unlock tier discount!",
        'units_needed': units_needed,
        'next_tier_range': next_tier.get_tier_range(),
        'savings_per_unit': format_lkr(savings_per_unit),
        'potential_savings': format_lkr(total_savings),
        'next_tier_price': format_lkr(next_tier.tier_price)
    }

# Usage in cart
cart_item = CartItem.objects.get(product=laptop)
hint = get_threshold_hint(laptop, cart_item.quantity)

if hint:
    # Display hint in cart
    print(hint['message'])
    print(f"Save {hint['savings_per_unit']}/unit at {hint['next_tier_range']}")
    
    # "Add 2 more to unlock tier discount!"
    # "Save ₨ 5,000/unit at 10-49 units"
```

### Template Integration Example

```django
{# product_detail.html #}
<div class="tiered-pricing">
    {% if product.tiered_prices.exists %}
    <h3>Volume Discounts</h3>
    <table class="tier-table">
        <thead>
            <tr>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Savings</th>
            </tr>
        </thead>
        <tbody>
            {% for tier in product.tiered_prices.all %}
            <tr>
                <td>{{ tier.get_tier_range }}</td>
                <td>{{ tier.tier_price|format_lkr }}</td>
                <td class="savings">
                    <span class="badge">
                        {{ tier.get_tier_badge }}
                    </span>
                    {{ tier.get_savings_message }}
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
    {% endif %}
</div>
```

### Expected Outcome

Comprehensive display helpers providing formatted tier information for all customer touchpoints including product pages, cart, API, and emails.

### Verification Checklist

- [ ] `get_display_string()` with multiple format options
- [ ] `get_savings_message()` generates promotional text
- [ ] `get_tier_badge()` returns appropriate badge
- [ ] `get_quantity_hint()` suggests mid-tier quantity
- [ ] `format_for_api()` returns JSON-serializable dict
- [ ] Template tag support for easy display
- [ ] `get_threshold_hint()` suggests adding more
- [ ] Email-friendly plain text format
- [ ] All methods handle None/edge cases gracefully
- [ ] Display methods respect LKR currency format

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create TieredPricing model | Model with quantity ranges and prices |
| 36 | Add tier validation | Overlap detection and data integrity |
| 37 | Create TieredPricing Meta class | Database optimizations |
| 38 | Add tier lookup method | Efficient tier finding |
| 39 | Create tiered price calculation | Total and savings calculations |
| 40 | Add tier display helper | Customer-facing formatted display |

### Key Achievements

- ✅ TieredPricing model with min/max quantities
- ✅ Comprehensive tier validation preventing overlaps
- ✅ Database indexes for fast lookups
- ✅ Efficient tier lookup by quantity
- ✅ Price calculation with savings
- ✅ Display helpers for all touchpoints
- ✅ Support for unlimited max quantities
- ✅ Promotional messaging generation

### Next Steps

Proceed to [02_Tasks-41-46_Variant-Tiers-Types.md](02_Tasks-41-46_Variant-Tiers-Types.md) to add:
- VariantTieredPricing model
- Tier inheritance from product to variant
- BulkPricingService for complex calculations
- Incremental tier calculation (progressive)
- All-units tier calculation (single tier)
- Tier type field (INCREMENTAL vs ALL_UNITS)

---

## Notes for AI Agents

1. **Tier Ranges:** min_quantity to max_quantity (or unlimited)
2. **Validation:** Critical to prevent overlapping ranges
3. **Lookup:** Find highest min_quantity that fits quantity
4. **Unlimited:** max_quantity=None means "and above"
5. **Display:** Multiple formats for different contexts
6. **Savings:** Always calculate vs base_price
7. **Next Tier:** Show threshold hints to encourage more purchases
8. **unique_together:** (tenant, product, min_quantity)
9. **Indexing:** Essential for fast tier lookups during checkout
10. **Next Document:** Variant tiers and calculation types
