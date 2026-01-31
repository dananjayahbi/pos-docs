# Tasks 35-42: ShippingRate Model and RateCalculator Service

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 07 - Shipping Zone Configuration  
> **Group:** C - Rate Calculation  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-50_Calculation-Verify.md](02_Tasks-43-50_Calculation-Verify.md)

---

## Document Overview

This document covers the creation of the ShippingRate model with weight-based pricing structure and the RateCalculator service for dynamic rate computation. It establishes the foundational data structure for storing tiered shipping rates with free shipping thresholds and implements the core calculation logic for determining shipping costs based on cart weight and delivery zone.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create ShippingRate Model | Medium | 45 min |
| 36 | Create Rate Zone FK | Low | 15 min |
| 37 | Create Weight From Field | Low | 15 min |
| 38 | Create Weight To Field | Low | 15 min |
| 39 | Create Base Rate Field | Low | 15 min |
| 40 | Create Per KG Rate Field | Low | 15 min |
| 41 | Create Free Shipping Threshold | Low | 15 min |
| 42 | Create RateCalculator Service | High | 60 min |

---

## Task 35: Create ShippingRate Model

### Overview
Create the ShippingRate model in the shipping app to store weight-based shipping rate configurations. This model will define tiered pricing structures where shipping costs are calculated using base rates plus per-kilogram charges. Each rate configuration applies to a specific shipping zone and weight range, enabling flexible pricing strategies for different delivery areas.

### Dependencies
- Task 34 (ShippingZone model) must be complete
- SubPhase-02 (Database Architecture & Multi-Tenancy) must be complete
- Backend shipping app must exist

### Instructions

1. **Navigate to shipping app models directory**
   - Go to `backend/apps/shipping/models/` directory
   - This directory contains all shipping-related models
   - Ensure the directory has an `__init__.py` file

2. **Create shipping_rate.py file**
   - Create new file named `shipping_rate.py`
   - This will contain the ShippingRate model
   - Follow project model naming conventions

3. **Import required dependencies**
   - Import Django models (from django.db import models)
   - Import decimal utilities (from decimal import Decimal)
   - Import validation utilities (from django.core.validators import MinValueValidator, MaxValueValidator)
   - Import BaseModel from core.models (project base model with common fields)
   - Import ShippingZone model from same app

4. **Define ShippingRate model class**
   - Create class `ShippingRate` inheriting from BaseModel
   - BaseModel provides: id, created_at, updated_at, created_by, updated_by
   - Add model Meta class for database configuration

5. **Configure model Meta options**
   - Set db_table to 'shipping_rates'
   - Set verbose_name to 'Shipping Rate'
   - Set verbose_name_plural to 'Shipping Rates'
   - Add ordering by ['zone', 'weight_from']
   - Add unique_together constraint on ['zone', 'weight_from', 'weight_to']
   - Add indexes for zone and weight range fields

6. **Add model string representation**
   - Implement `__str__` method
   - Return format: "{zone.name}: {weight_from}-{weight_to}kg = LKR {base_rate}"
   - Ensure human-readable representation for admin

7. **Add model validation methods**
   - Implement `clean()` method for weight range validation
   - Ensure weight_from < weight_to
   - Ensure no overlapping weight ranges within same zone
   - Add validation for positive rate values

8. **Update models __init__.py**
   - Add import for ShippingRate model
   - Add to __all__ list for proper exports
   - Follow project import conventions

### Model Structure Overview

```
ShippingRate
├── BaseModel Fields (inherited)
│   ├── id (UUID, primary key)
│   ├── created_at (DateTime)
│   ├── updated_at (DateTime)
│   ├── created_by (ForeignKey to User)
│   └── updated_by (ForeignKey to User)
├── Zone Relationship (Task 36)
├── Weight Range (Tasks 37, 38)
├── Pricing Fields (Tasks 39, 40)
└── Free Shipping (Task 41)
```

### Verification Checklist
- [ ] ShippingRate model created in shipping/models/shipping_rate.py
- [ ] Model inherits from BaseModel correctly
- [ ] Meta options configured with proper table name and ordering
- [ ] String representation returns meaningful format
- [ ] Model validation methods implemented
- [ ] Models __init__.py updated with new import
- [ ] No syntax errors in model definition

---

## Task 36: Create Rate Zone FK

### Overview
Add the zone foreign key field to the ShippingRate model to establish the relationship with ShippingZone. This field links each rate configuration to a specific delivery zone, enabling zone-based pricing strategies. The relationship allows multiple rate tiers per zone while maintaining referential integrity.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Task 34 (ShippingZone model) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after BaseModel inheritance

2. **Add zone foreign key field**
   - Create ForeignKey to ShippingZone model
   - Set field name as 'zone'
   - Use on_delete=models.CASCADE (delete rates when zone deleted)
   - Set related_name to 'shipping_rates'

3. **Configure field properties**
   - Add verbose_name as 'Shipping Zone'
   - Add help_text explaining zone-rate relationship
   - Ensure field is required (not null, not blank)
   - Add db_index=True for query performance

4. **Update field positioning**
   - Place zone field as first field after BaseModel
   - This maintains logical field ordering in model
   - Follows project conventions for relationship fields

5. **Verify relationship configuration**
   - Ensure reverse relationship name doesn't conflict
   - Check that cascade deletion is appropriate
   - Confirm field indexing is properly configured

### Field Configuration Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | ForeignKey | Links to ShippingZone |
| Target Model | ShippingZone | Zone for rate calculation |
| On Delete | CASCADE | Delete rates with zone |
| Related Name | shipping_rates | Reverse relationship |
| DB Index | True | Query performance |
| Null/Blank | False/False | Required field |

### Verification Checklist
- [ ] Zone ForeignKey field added to ShippingRate model
- [ ] Field references ShippingZone model correctly
- [ ] CASCADE deletion configured appropriately
- [ ] Related name 'shipping_rates' set
- [ ] Database indexing enabled
- [ ] Field is marked as required (not null/blank)
- [ ] Field positioned correctly in model definition

---

## Task 37: Create Weight From Field

### Overview
Add the weight_from field to the ShippingRate model to define the minimum weight for the rate tier. This field establishes the lower bound of the weight range for which the shipping rate applies. Combined with weight_to, it creates non-overlapping weight tiers that enable graduated pricing based on package weight.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Task 36 (Rate zone FK) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after zone field

2. **Add weight_from decimal field**
   - Create DecimalField with name 'weight_from'
   - Set max_digits to 8 (allows up to 999,999.99)
   - Set decimal_places to 2 (precision to 0.01 kg)
   - Configure default value as Decimal('0.00')

3. **Add field validation**
   - Add MinValueValidator with value Decimal('0.00')
   - Prevents negative weight values
   - Import Decimal from decimal module if not already imported
   - Ensure validator import is included

4. **Configure field properties**
   - Add verbose_name as 'Weight From (kg)'
   - Add help_text explaining weight range minimum
   - Set null=False and blank=False (required field)
   - Add db_index=True for range query performance

5. **Verify field configuration**
   - Ensure decimal precision is appropriate for weight measurements
   - Check that validation prevents invalid weight values
   - Confirm field indexing for range queries

### Field Specification Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | DecimalField | Precise weight values |
| Max Digits | 8 | Support up to 999,999.99 kg |
| Decimal Places | 2 | 0.01 kg precision |
| Default | Decimal('0.00') | Starting weight |
| Min Validator | Decimal('0.00') | Positive weights only |
| DB Index | True | Range query performance |

### Weight Range Logic

```
Weight Tier Examples:
├── Tier 1: 0.00 - 1.00 kg
├── Tier 2: 1.01 - 5.00 kg
├── Tier 3: 5.01 - 10.00 kg
└── Tier 4: 10.01 - 999999.99 kg
```

### Verification Checklist
- [ ] weight_from DecimalField added to ShippingRate model
- [ ] Field uses DecimalField with 8 max_digits and 2 decimal_places
- [ ] Default value set to Decimal('0.00')
- [ ] MinValueValidator prevents negative weights
- [ ] Verbose name indicates kilograms unit
- [ ] Field is required (not null/blank)
- [ ] Database indexing enabled for range queries

---

## Task 38: Create Weight To Field

### Overview
Add the weight_to field to the ShippingRate model to define the maximum weight for the rate tier. This field establishes the upper bound of the weight range, completing the weight tier definition started with weight_from. The combination creates discrete weight ranges that enable tiered shipping pricing structures.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Task 37 (Weight from field) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after weight_from field

2. **Add weight_to decimal field**
   - Create DecimalField with name 'weight_to'
   - Set max_digits to 8 (allows up to 999,999.99)
   - Set decimal_places to 2 (precision to 0.01 kg)
   - Leave default as None for open-ended tiers

3. **Add field validation**
   - Add MinValueValidator with value Decimal('0.01')
   - Prevents zero or negative upper bounds
   - Import Decimal from decimal module if not already imported
   - Custom validation in clean() method to ensure weight_to > weight_from

4. **Configure field properties**
   - Add verbose_name as 'Weight To (kg)'
   - Add help_text explaining weight range maximum
   - Allow null=True and blank=True for unlimited upper tiers
   - Add db_index=True for range query performance

5. **Update model clean method**
   - Extend clean() method validation
   - Check that weight_to is greater than weight_from
   - Handle None values for unlimited tiers
   - Raise ValidationError for invalid weight ranges

### Field Specification Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | DecimalField | Precise weight values |
| Max Digits | 8 | Support up to 999,999.99 kg |
| Decimal Places | 2 | 0.01 kg precision |
| Default | None | Allow open-ended tiers |
| Min Validator | Decimal('0.01') | Positive upper bounds |
| Null/Blank | True/True | Optional for unlimited |

### Weight Range Validation Logic

```
Validation Rules:
├── weight_to > weight_from (when weight_to is not None)
├── weight_to >= 0.01 (minimum upper bound)
├── No overlapping ranges within same zone
└── Continuous ranges encouraged (not enforced)
```

### Weight Tier Configuration Examples

| Zone | Weight From | Weight To | Rate Type |
|------|-------------|-----------|-----------|
| Colombo | 0.00 | 1.00 | Standard |
| Colombo | 1.01 | 5.00 | Medium |
| Colombo | 5.01 | None | Heavy (unlimited) |
| Gampaha | 0.00 | 2.00 | Standard |
| Gampaha | 2.01 | None | Heavy (unlimited) |

### Verification Checklist
- [ ] weight_to DecimalField added to ShippingRate model
- [ ] Field uses DecimalField with 8 max_digits and 2 decimal_places
- [ ] Field allows null/blank for unlimited tiers
- [ ] MinValueValidator prevents invalid upper bounds
- [ ] Verbose name indicates kilograms unit
- [ ] Database indexing enabled for range queries
- [ ] Model clean() method validates weight_to > weight_from

---

## Task 39: Create Base Rate Field

### Overview
Add the base_rate field to the ShippingRate model to define the fixed cost component of shipping calculation. This field represents the minimum charge for shipping within the weight tier, regardless of the actual weight. It forms the foundation of the two-part pricing structure: base rate + (weight × per_kg_rate).

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Tasks 37-38 (Weight range fields) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after weight_to field

2. **Add base_rate decimal field**
   - Create DecimalField with name 'base_rate'
   - Set max_digits to 10 (supports up to 99,999,999.99 LKR)
   - Set decimal_places to 2 (precision to 0.01 LKR)
   - Set default value as Decimal('0.00')

3. **Add field validation**
   - Add MinValueValidator with value Decimal('0.00')
   - Allow zero base rate for percentage-only pricing
   - Import Decimal and validators if not already imported
   - Prevents negative base rates

4. **Configure field properties**
   - Add verbose_name as 'Base Rate (LKR)'
   - Add help_text explaining fixed charge component
   - Set null=False and blank=False (required field)
   - Add db_index=True for pricing queries

5. **Verify currency handling**
   - Ensure decimal precision matches LKR requirements
   - Check that field supports expected rate ranges
   - Confirm validation prevents invalid pricing

### Field Specification Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | DecimalField | Precise currency values |
| Max Digits | 10 | Support up to 99,999,999.99 LKR |
| Decimal Places | 2 | 0.01 LKR precision |
| Default | Decimal('0.00') | Zero base rate allowed |
| Min Validator | Decimal('0.00') | No negative rates |
| Currency | LKR | Sri Lankan Rupees |

### Base Rate Pricing Strategy

```
Pricing Structure:
Total Cost = Base Rate + (Weight × Per KG Rate)

Examples:
├── Express: Base 500 LKR + 100 LKR per kg
├── Standard: Base 200 LKR + 50 LKR per kg
├── Economy: Base 0 LKR + 75 LKR per kg
└── Bulk: Base 1000 LKR + 25 LKR per kg
```

### Rate Configuration Examples

| Zone | Weight Range | Base Rate (LKR) | Strategy |
|------|--------------|----------------|-----------|
| Colombo | 0-1 kg | 150.00 | Low base, covers handling |
| Colombo | 1-5 kg | 250.00 | Standard base rate |
| Colombo | 5+ kg | 500.00 | Higher base for heavy items |
| Outstation | 0-1 kg | 300.00 | Higher distance cost |
| Outstation | 1+ kg | 400.00 | Distance premium |

### Verification Checklist
- [ ] base_rate DecimalField added to ShippingRate model
- [ ] Field uses DecimalField with 10 max_digits and 2 decimal_places
- [ ] Default value set to Decimal('0.00')
- [ ] MinValueValidator prevents negative rates
- [ ] Verbose name indicates LKR currency
- [ ] Field is required (not null/blank)
- [ ] Field precision supports expected rate ranges

---

## Task 40: Create Per KG Rate Field

### Overview
Add the per_kg_rate field to the ShippingRate model to define the variable cost component based on package weight. This field represents the additional charge per kilogram above the base rate, enabling weight-proportional pricing. Combined with base_rate, it creates a flexible two-tier pricing structure suitable for various shipping scenarios.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Task 39 (Base rate field) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after base_rate field

2. **Add per_kg_rate decimal field**
   - Create DecimalField with name 'per_kg_rate'
   - Set max_digits to 8 (supports up to 999,999.99 LKR per kg)
   - Set decimal_places to 2 (precision to 0.01 LKR)
   - Set default value as Decimal('0.00')

3. **Add field validation**
   - Add MinValueValidator with value Decimal('0.00')
   - Allow zero per-kg rate for flat-rate pricing
   - Import validators if not already imported
   - Prevents negative per-kg charges

4. **Configure field properties**
   - Add verbose_name as 'Per KG Rate (LKR)'
   - Add help_text explaining weight-based charge
   - Set null=False and blank=False (required field)
   - Add db_index=True for calculation queries

5. **Add calculation documentation**
   - Include docstring explaining rate calculation formula
   - Document interaction with base_rate field
   - Provide examples of total cost calculation

### Field Specification Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | DecimalField | Precise per-kg pricing |
| Max Digits | 8 | Support up to 999,999.99 LKR |
| Decimal Places | 2 | 0.01 LKR precision |
| Default | Decimal('0.00') | Flat-rate option |
| Min Validator | Decimal('0.00') | No negative rates |
| Unit | LKR per KG | Weight-based pricing |

### Rate Calculation Formula

```
Total Shipping Cost Calculation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Calculate Weight-Based Cost
weight_cost = package_weight × per_kg_rate

Step 2: Add Base Rate
total_cost = base_rate + weight_cost

Step 3: Apply Free Shipping Check
if total_cost < free_shipping_threshold:
    final_cost = total_cost
else:
    final_cost = 0.00
```

### Pricing Strategy Examples

| Tier Type | Base Rate | Per KG Rate | Use Case |
|-----------|-----------|-------------|-----------|
| Flat Rate | 500.00 | 0.00 | Fixed cost regardless of weight |
| Progressive | 200.00 | 100.00 | Moderate base + weight scaling |
| Weight-Only | 0.00 | 150.00 | Pure weight-based pricing |
| Express | 800.00 | 200.00 | Premium service pricing |
| Bulk Discount | 1000.00 | 25.00 | High base, low per-kg for volume |

### Rate Comparison Table

| Package Weight | Flat (500+0) | Progressive (200+100) | Weight-Only (0+150) |
|----------------|--------------|----------------------|---------------------|
| 0.5 kg | 500.00 | 250.00 | 75.00 |
| 1.0 kg | 500.00 | 300.00 | 150.00 |
| 2.5 kg | 500.00 | 450.00 | 375.00 |
| 5.0 kg | 500.00 | 700.00 | 750.00 |
| 10.0 kg | 500.00 | 1200.00 | 1500.00 |

### Verification Checklist
- [ ] per_kg_rate DecimalField added to ShippingRate model
- [ ] Field uses DecimalField with 8 max_digits and 2 decimal_places
- [ ] Default value set to Decimal('0.00')
- [ ] MinValueValidator prevents negative rates
- [ ] Verbose name indicates LKR per KG unit
- [ ] Field is required (not null/blank)
- [ ] Field supports expected per-kg rate ranges

---

## Task 41: Create Free Shipping Threshold

### Overview
Add the free_shipping_threshold field to the ShippingRate model to define the minimum order value for free shipping within each zone and weight tier. This field enables promotional pricing strategies where shipping costs are waived for orders exceeding a specified value, encouraging larger purchases while maintaining zone-specific thresholds.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Tasks 39-40 (Rate fields) must be complete

### Instructions

1. **Open ShippingRate model file**
   - Navigate to `backend/apps/shipping/models/shipping_rate.py`
   - Locate the ShippingRate class definition
   - Position cursor after per_kg_rate field

2. **Add free_shipping_threshold decimal field**
   - Create DecimalField with name 'free_shipping_threshold'
   - Set max_digits to 12 (supports up to 9,999,999,999.99 LKR)
   - Set decimal_places to 2 (precision to 0.01 LKR)
   - Allow null=True and blank=True for no free shipping

3. **Add field validation**
   - Add MinValueValidator with value Decimal('0.01')
   - Prevents zero or negative thresholds when set
   - Allow None/null for zones without free shipping
   - Import validators if not already imported

4. **Configure field properties**
   - Add verbose_name as 'Free Shipping Threshold (LKR)'
   - Add help_text explaining free shipping conditions
   - Set db_index=True for threshold comparison queries
   - Include currency indication in field name

5. **Add business logic documentation**
   - Document threshold comparison logic
   - Explain interaction with cart total value
   - Specify precedence over calculated shipping costs

### Field Specification Details

| Property | Value | Purpose |
|----------|--------|---------|
| Field Type | DecimalField | Order value thresholds |
| Max Digits | 12 | Support large order values |
| Decimal Places | 2 | 0.01 LKR precision |
| Default | None | No free shipping by default |
| Null/Blank | True/True | Optional threshold |
| Min Validator | Decimal('0.01') | Positive thresholds only |

### Free Shipping Logic Flow

```
Free Shipping Decision Process:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: cart_total, shipping_zone, package_weight

Step 1: Find Applicable Rate
rate = find_rate_by_zone_and_weight(zone, weight)

Step 2: Check Free Shipping Threshold
if rate.free_shipping_threshold is None:
    └── No free shipping available
elif cart_total >= rate.free_shipping_threshold:
    └── Apply free shipping (cost = 0.00)
else:
    └── Calculate normal shipping cost

Step 3: Return Final Cost
return final_shipping_cost
```

### Threshold Strategy Examples

| Zone | Weight Tier | Threshold (LKR) | Strategy |
|------|-------------|----------------|-----------|
| Colombo | 0-5 kg | 5,000.00 | Encourage local orders |
| Colombo | 5+ kg | 10,000.00 | Higher threshold for heavy |
| Suburban | 0-2 kg | 7,500.00 | Suburban premium |
| Suburban | 2+ kg | 15,000.00 | Distance compensation |
| Remote | All weights | None | No free shipping |

### Business Impact Analysis

| Cart Value | Colombo 1kg | Suburban 1kg | Remote 1kg |
|------------|-------------|--------------|------------|
| 2,000 LKR | 300 LKR | 400 LKR | 500 LKR |
| 5,000 LKR | Free | 400 LKR | 500 LKR |
| 7,500 LKR | Free | Free | 500 LKR |
| 15,000 LKR | Free | Free | 500 LKR |

### Implementation Considerations

1. **Threshold Comparison**
   - Compare against cart subtotal (before taxes)
   - Include product discounts in calculation
   - Exclude shipping costs from threshold comparison

2. **Zone-Specific Thresholds**
   - Different zones can have different thresholds
   - Remote areas may have higher or no thresholds
   - Urban areas typically have lower thresholds

3. **Weight Tier Integration**
   - Heavy packages may require higher thresholds
   - Light packages can have promotional thresholds
   - Balance between weight and value incentives

### Verification Checklist
- [ ] free_shipping_threshold DecimalField added to ShippingRate model
- [ ] Field uses DecimalField with 12 max_digits and 2 decimal_places
- [ ] Field allows null/blank for no free shipping option
- [ ] MinValueValidator prevents invalid thresholds when set
- [ ] Verbose name indicates LKR currency and purpose
- [ ] Database indexing enabled for comparison queries
- [ ] Field supports large order value thresholds

---

## Task 42: Create RateCalculator Service

### Overview
Create the RateCalculator service class to implement dynamic shipping rate computation logic. This service will analyze cart contents and delivery addresses to determine applicable shipping zones, calculate total package weight, find matching rate tiers, apply free shipping thresholds, and return detailed shipping cost information including delivery estimates.

### Dependencies
- Task 35 (ShippingRate model) must be complete
- Tasks 36-41 (All rate fields) must be complete
- ShippingZone model and zone detection logic must be available

### Instructions

1. **Create service file structure**
   - Navigate to `backend/apps/shipping/services/` directory
   - Create directory if it doesn't exist
   - Create `__init__.py` file in services directory
   - Create `rate_calculator.py` file for the service

2. **Import required dependencies**
   - Import Decimal from decimal for precise calculations
   - Import Django models and query utilities
   - Import ShippingRate and ShippingZone models
   - Import logging utilities for debugging
   - Import typing hints for better code documentation

3. **Define RateCalculator service class**
   - Create class `RateCalculator` with static and instance methods
   - Add proper docstring explaining service purpose
   - Include class-level configuration constants
   - Add error handling and logging capabilities

4. **Implement zone detection method**
   - Create method `detect_zone(self, address)` 
   - Analyze delivery address components (district, city, postal_code)
   - Match address against ShippingZone configurations
   - Return appropriate ShippingZone object or default
   - Handle edge cases for unmapped addresses

5. **Implement weight calculation method**
   - Create method `calculate_total_weight(self, cart_items)`
   - Sum up weights from all cart items
   - Handle missing weight data with default values
   - Account for packaging weight additions
   - Return total weight in kilograms

6. **Implement rate lookup method**
   - Create method `find_applicable_rate(self, zone, weight)`
   - Query ShippingRate by zone and weight range
   - Handle weight_to null values (unlimited tiers)
   - Return matching rate or fallback to default
   - Add query optimization for performance

7. **Implement cost calculation method**
   - Create method `calculate_shipping_cost(self, rate, weight, cart_total)`
   - Apply base_rate + (weight × per_kg_rate) formula
   - Check free shipping threshold against cart total
   - Return final cost with breakdown details
   - Handle edge cases and validation

8. **Implement main calculate method**
   - Create method `calculate(self, cart, address)`
   - Orchestrate all calculation steps
   - Return comprehensive response with cost, zone, delivery days
   - Include calculation breakdown for transparency
   - Add error handling for invalid inputs

9. **Add response formatting**
   - Define response structure as dictionary or dataclass
   - Include shipping_cost, zone_name, delivery_days_min/max
   - Add calculation_breakdown with base_rate, weight_cost, discounts
   - Include metadata like applicable_rate_id and calculation_timestamp

10. **Add service validation and testing helpers**
    - Create method `validate_inputs(self, cart, address)`
    - Add debugging methods for development
    - Include rate simulation capabilities
    - Add performance logging for optimization

### Service Class Structure

```
RateCalculator
├── __init__(self)
├── detect_zone(self, address) → ShippingZone
├── calculate_total_weight(self, cart_items) → Decimal
├── find_applicable_rate(self, zone, weight) → ShippingRate
├── calculate_shipping_cost(self, rate, weight, cart_total) → dict
├── calculate(self, cart, address) → dict
├── validate_inputs(self, cart, address) → bool
└── get_debug_info(self, cart, address) → dict
```

### Zone Detection Logic

```
Zone Detection Algorithm:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Extract Address Components
├── district = address.district
├── city = address.city  
├── postal_code = address.postal_code
└── area = address.area (optional)

Step 2: Match Against Shipping Zones
├── Try exact postal code match first
├── Try city + district combination
├── Try district-only match
├── Fall back to default zone
└── Log detection results

Step 3: Return Matched Zone
return matched_zone or default_zone
```

### Weight Calculation Algorithm

```
Weight Calculation Process:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Sum Product Weights
total_weight = 0
for item in cart_items:
    product_weight = item.product.weight or DEFAULT_WEIGHT
    quantity = item.quantity
    total_weight += (product_weight * quantity)

Step 2: Add Packaging Weight
packaging_weight = calculate_packaging_weight(total_weight)
total_weight += packaging_weight

Step 3: Apply Minimum Weight
if total_weight < MINIMUM_WEIGHT:
    total_weight = MINIMUM_WEIGHT

return round(total_weight, 2)
```

### Rate Lookup Query

```
Rate Lookup Logic:
━━━━━━━━━━━━━━━━━━━━━

Query: ShippingRate.objects.filter(
    zone=detected_zone,
    weight_from__lte=total_weight
).filter(
    Q(weight_to__isnull=True) |  # Unlimited tier
    Q(weight_to__gte=total_weight)  # Within range
).order_by('weight_from').first()

Fallback: If no rate found, use default rate
```

### Response Format Structure

```json
{
  "success": true,
  "shipping_cost": 450.00,
  "currency": "LKR",
  "zone_name": "Colombo District",
  "delivery_days_min": 1,
  "delivery_days_max": 2,
  "free_shipping_applied": false,
  "calculation_breakdown": {
    "base_rate": 250.00,
    "weight_cost": 200.00,
    "total_weight": 2.5,
    "cart_total": 3500.00,
    "free_shipping_threshold": 5000.00
  },
  "metadata": {
    "rate_id": "uuid-string",
    "calculation_timestamp": "2026-01-31T10:30:00Z",
    "zone_id": "uuid-string"
  }
}
```

### Error Handling Scenarios

| Error Case | Response | Action |
|------------|----------|---------|
| No zone found | Use default zone | Log warning |
| No rate found | Use fallback rate | Log error |
| Invalid cart | Return error response | Validate inputs |
| Zero weight | Apply minimum weight | Log debug |
| Calculation error | Return default cost | Log exception |

### Performance Optimizations

1. **Database Queries**
   - Use select_related for zone relationships
   - Add database indexes on lookup fields
   - Cache frequently accessed rates
   - Optimize weight range queries

2. **Calculation Caching**
   - Cache zone detection results by address
   - Cache weight calculations by cart hash
   - Use Redis for rate calculation cache
   - Implement cache invalidation strategy

3. **Service Integration**
   - Lazy load expensive operations
   - Batch process multiple calculations
   - Use async processing for complex calculations
   - Monitor performance metrics

### Verification Checklist
- [ ] RateCalculator service created in shipping/services/rate_calculator.py
- [ ] All required methods implemented with proper signatures
- [ ] Zone detection logic handles address matching correctly
- [ ] Weight calculation sums cart items and adds packaging
- [ ] Rate lookup finds appropriate tier by zone and weight
- [ ] Cost calculation applies base + per-kg formula correctly
- [ ] Free shipping threshold comparison implemented
- [ ] Main calculate method orchestrates all steps
- [ ] Response format includes all required fields
- [ ] Error handling covers edge cases appropriately
- [ ] Input validation prevents invalid calculations
- [ ] Service integration points defined clearly

---

## Overall Verification

### Model Integration Checklist
- [ ] ShippingRate model contains all required fields (36-41)
- [ ] Field relationships and constraints properly configured
- [ ] Model validation prevents overlapping weight ranges
- [ ] Database migrations created and applied successfully
- [ ] Admin interface configured for rate management

### Service Integration Checklist  
- [ ] RateCalculator service implements all calculation methods
- [ ] Service integrates with ShippingZone for address detection
- [ ] Weight calculation handles cart items correctly
- [ ] Rate lookup performance optimized with proper queries
- [ ] Response format provides comprehensive shipping information

### Business Logic Verification
- [ ] Tiered pricing structure works across weight ranges
- [ ] Free shipping thresholds apply correctly per zone
- [ ] Zone-based pricing enables geographic differentiation
- [ ] Rate calculation accuracy verified with test scenarios
- [ ] Edge cases handled appropriately (zero weight, no rates)

---

This completes the implementation of the ShippingRate model and RateCalculator service for weight-based shipping rate calculation with free shipping thresholds. The next document will cover tasks 43-50 for rate calculation verification and testing procedures.