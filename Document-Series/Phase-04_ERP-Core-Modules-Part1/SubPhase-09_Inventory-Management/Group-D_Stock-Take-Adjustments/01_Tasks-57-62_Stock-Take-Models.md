# Tasks 57-62: Stock Take Models & Variance Calculation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** D - Stock Take & Adjustments  
> **Tasks:** 57-62 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group D Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group C: Stock Operations Services](../Group-C_Stock-Operations-Services/)
- **→ Next:** [Tasks 63-68: Take Service Lifecycle](02_Tasks-63-68_Take-Service-Lifecycle.md)

---

## Task 57: Create StockTake Model

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Define model to represent physical inventory counting session with status tracking and audit trail.

### Instructions

#### 1. Create StockTake Model Structure
- Create model in `apps/inventory/stock/models.py`
- Inherit from TenantModel and TimestampedModel base classes
- Add auto-generated reference number field: `reference` (e.g., "ST-2026-0123")

#### 2. Add Core Identification Fields
- `name` CharField - descriptive name for the stock take
- `description` TextField (optional) - purpose or notes about this count
- `warehouse` FK to Warehouse - which warehouse is being counted
- `reference` CharField (unique) - generated reference number

#### 3. Add Date/Time Tracking Fields
- `scheduled_date` DateField (optional) - planned date for count
- `started_at` DateTimeField (nullable) - when counting began
- `completed_at` DateTimeField (nullable) - when finalized
- `cancelled_at` DateTimeField (nullable) - if cancelled

#### 4. Add User Tracking Fields
- `created_by` FK to User - who created the stock take
- `assigned_to` ManyToMany to User - team assigned to count
- `completed_by` FK to User (nullable) - who finalized it
- `approved_by` FK to User (nullable) - who approved variances

#### 5. Add Statistics Fields
- `total_items` IntegerField (default=0) - count of items to check
- `counted_items` IntegerField (default=0) - items already counted
- `items_with_variance` IntegerField (default=0) - items with differences
- `total_variance_value` DecimalField (default=0) - total value impact

#### 6. Create Meta Options
- Ordering: ['-created_at']
- Verbose name: "Stock Take"
- Indexes: reference, warehouse, status, created_at
- Permissions: view_stocktake, create_stocktake, finalize_stocktake

### Validation Checklist
- [ ] Model inherits from proper base classes
- [ ] All required fields defined
- [ ] Foreign keys have on_delete behavior
- [ ] Indexes created for common queries
- [ ] Reference number auto-generation works
- [ ] Permissions defined

---

## Task 58: Add Stock Take Status Field

**Complexity:** Low | **Time Estimate:** 15 min

### Objective
Define status choices to track stock take lifecycle from draft through completion.

### Instructions

#### 1. Define Status Constants
- Create constants in model or separate constants file
- Status values:
  - `DRAFT` - "Draft" - initial creation, not yet started
  - `IN_PROGRESS` - "In Progress" - actively being set up
  - `COUNTING` - "Counting" - physical count underway
  - `REVIEW` - "Under Review" - count complete, checking variances
  - `COMPLETED` - "Completed" - finalized and adjustments made
  - `CANCELLED` - "Cancelled" - aborted before completion

#### 2. Add Status Field to Model
- Add `status` CharField with choices from constants
- Default to `DRAFT`
- Max length: 20 characters
- Required field (not nullable)

#### 3. Create Status Transition Methods
- `start_counting()` - transition from DRAFT/IN_PROGRESS to COUNTING
- `submit_for_review()` - transition from COUNTING to REVIEW
- `complete()` - transition from REVIEW to COMPLETED
- `cancel()` - transition to CANCELLED from any state

#### 4. Add Transition Validation
- Each transition method validates current status
- Raise `InvalidStatusTransition` exception if not allowed
- Log status changes with timestamp and user
- Only certain transitions allowed (define state machine)

#### 5. Create Status Query Methods
- `is_active()` - returns True if not COMPLETED or CANCELLED
- `is_editable()` - returns True if DRAFT or IN_PROGRESS
- `can_record_counts()` - returns True if COUNTING
- `requires_approval()` - returns True if in REVIEW with high variances

#### 6. Add Status Display Helper
- Create method `get_status_display_with_icon()` for UI
- Return status label with appropriate icon/color
- Use in admin and API serializers

### Validation Checklist
- [ ] All status values defined
- [ ] Status field added to model
- [ ] Transition methods validate properly
- [ ] Invalid transitions prevented
- [ ] Query methods return correct boolean
- [ ] Display helper works in admin

---

## Task 59: Add Stock Take Scope

**Complexity:** Low | **Time Estimate:** 15 min

### Objective
Define whether stock take covers all products in warehouse or only selected items.

### Instructions

#### 1. Define Scope Constants
- Create scope type constants:
  - `FULL` - "Full Count" - all products in warehouse
  - `PARTIAL` - "Partial Count" - selected products only
  - `CYCLE` - "Cycle Count" - rotating subset of products

#### 2. Add Scope Field to Model
- Add `scope` CharField with choices from constants
- Default to `FULL`
- Required field

#### 3. Add Product Selection for Partial Scope
- Add `products` ManyToMany field to Product model
- Only used when scope is PARTIAL or CYCLE
- Allow filtering: by category, by location, by ABC classification
- Create method `add_products(product_queryset)` for bulk add

#### 4. Create Scope Validation
- Validate that products field is empty for FULL scope
- Validate that products field has items for PARTIAL/CYCLE scope
- Ensure products belong to same tenant
- Check products are normally stocked in selected warehouse

#### 5. Add Product Selection Helpers
- `get_products_to_count()` - returns queryset of products to include
- If FULL, return all active products in warehouse
- If PARTIAL/CYCLE, return selected products
- Apply additional filters: exclude zero stock, include specific categories

#### 6. Create Cycle Count Rotation Logic
- Add `cycle_group` CharField (A, B, C based on importance)
- Add `last_counted_date` to Product model (or separate tracking)
- Method: `select_products_for_cycle(warehouse, cycle_group, count)`
- Select products due for count based on rotation schedule

### Validation Checklist
- [ ] Scope constants defined
- [ ] Scope field added to model
- [ ] Product selection works for partial counts
- [ ] Validation prevents invalid combinations
- [ ] Helper methods return correct products
- [ ] Cycle count logic functional

---

## Task 60: Create StockTakeItem Model

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Define model to track individual product counts within a stock take session.

### Instructions

#### 1. Create StockTakeItem Model Structure
- Create model in same file as StockTake
- Foreign key to StockTake: `stock_take` with CASCADE delete
- Foreign key to Product: `product`
- Optional foreign key to Variant: `variant` (for variant-level tracking)
- Optional foreign key to StorageLocation: `location` (for bin-level counts)

#### 2. Add Quantity Fields
- `expected_quantity` DecimalField - system quantity at start
- `counted_quantity` DecimalField (nullable) - physically counted amount
- `system_quantity` DecimalField - system quantity at count time (may differ from expected)

#### 3. Add Status and Tracking Fields
- `status` CharField - choices: PENDING, COUNTED, VERIFIED, ADJUSTED
- `count_sequence` IntegerField - order in which items are counted
- `is_locked` BooleanField (default=False) - prevent further changes

#### 4. Add Cost and Value Fields
- `cost_per_unit` DecimalField - cost at time of count
- `expected_value` DecimalField - expected_quantity × cost_per_unit
- `counted_value` DecimalField - counted_quantity × cost_per_unit

#### 5. Add Notes and References
- `notes` TextField (optional) - counter's notes or observations
- `discrepancy_reason` CharField (nullable) - if variance, why?
- `requires_recount` BooleanField (default=False) - flag for double-check

#### 6. Create Meta and Constraints
- Unique together: (stock_take, product, variant, location)
- Ordering: ['count_sequence', 'product__sku']
- Index on: stock_take, status, counted_quantity (for filtering uncounted)

### Validation Checklist
- [ ] Model structure correct with all FKs
- [ ] Quantity fields use proper decimal precision
- [ ] Status field with appropriate choices
- [ ] Cost and value calculations correct
- [ ] Unique constraint prevents duplicates
- [ ] Indexes support common queries

---

## Task 61: Add Variance Calculation

**Complexity:** Medium | **Time Estimate:** 15 min

### Objective
Calculate difference between expected and counted quantities for each item.

### Instructions

#### 1. Add Variance Field
- Add `variance_quantity` DecimalField to StockTakeItem
- Can be negative (counted less than expected)
- Make it a database field, not just property (for querying/filtering)

#### 2. Create Variance Calculation Method
- Method: `calculate_variance()` on StockTakeItem model
- Formula: `counted_quantity - expected_quantity`
- Return None if counted_quantity is None
- Update `variance_quantity` field with result

#### 3. Add Variance Value Calculation
- Add `variance_value` DecimalField
- Method: `calculate_variance_value()`
- Formula: `variance_quantity × cost_per_unit`
- Positive value = gain, negative value = loss

#### 4. Create Auto-Calculation Trigger
- Override `save()` method on StockTakeItem
- Auto-calculate variance if counted_quantity is set
- Update parent StockTake statistics
- Signal to update aggregate variance totals

#### 5. Add Variance Classification
- Property method: `get_variance_classification()`
- Return: "NONE", "MINOR", "MODERATE", "SIGNIFICANT"
- Based on percentage or absolute value thresholds
- Example: <2% = MINOR, 2-5% = MODERATE, >5% = SIGNIFICANT

#### 6. Create Variance Query Methods
- Manager method: `with_variance()` - items where variance != 0
- Manager method: `over_threshold(threshold)` - significant variances
- Manager method: `negative_variance()` - shortages
- Manager method: `positive_variance()` - overages

### Validation Checklist
- [ ] Variance calculated correctly
- [ ] Negative variances handled properly
- [ ] Variance value calculation accurate
- [ ] Auto-calculation on save works
- [ ] Classification thresholds appropriate
- [ ] Query methods return correct items

---

## Task 62: Add Variance Percentage

**Complexity:** Low | **Time Estimate:** 15 min

### Objective
Calculate percentage difference for reporting and threshold checks.

### Instructions

#### 1. Add Variance Percentage Field
- Add `variance_percentage` DecimalField to StockTakeItem
- Store as percentage (e.g., 5.25 for 5.25%)
- Allow null (when expected_quantity is zero)

#### 2. Create Percentage Calculation Method
- Method: `calculate_variance_percentage()`
- Formula: `(variance_quantity / expected_quantity) × 100`
- Handle division by zero: return None if expected_quantity == 0
- Round to 2 decimal places

#### 3. Add Auto-Calculation
- Include in `save()` method override
- Calculate whenever variance_quantity changes
- Update field automatically

#### 4. Create Percentage-Based Queries
- Manager method: `over_percentage(percent)` - e.g., >5% variance
- Manager method: `within_tolerance(percent)` - acceptable range
- Example: `items.over_percentage(5)` returns items with >5% variance

#### 5. Add Percentage Display Methods
- Property: `variance_percentage_display` - format as "5.25%"
- Property: `variance_color` - return "red", "yellow", "green" based on threshold
- Use in templates and API for user-friendly display

#### 6. Create Summary Statistics
- Add to StockTake model: `average_variance_percentage`
- Calculate across all items: average of absolute percentage variances
- Update when items are counted
- Use for management reporting

### Validation Checklist
- [ ] Percentage calculation mathematically correct
- [ ] Division by zero handled gracefully
- [ ] Auto-calculation works on save
- [ ] Query methods filter correctly
- [ ] Display methods format properly
- [ ] Summary statistics accurate

---

## Expected Outcomes

After completing Tasks 57-62:

### Files Created/Modified
- `apps/inventory/stock/models.py` (StockTake and StockTakeItem models added)
- `apps/inventory/stock/constants.py` (status and scope constants)
- `apps/inventory/stock/managers.py` (custom managers for variance queries)

### Model Relationships Diagram

```
┌─────────────┐
│  StockTake  │
│             │
│ - reference │
│ - warehouse │◄───┐
│ - status    │    │
│ - scope     │    │
└─────────────┘    │
       │           │
       │ 1:N       │
       │           │
       ▼           │
┌──────────────────┴┐
│  StockTakeItem    │
│                   │
│ - product         │
│ - expected_qty    │
│ - counted_qty     │
│ - variance_qty    │
│ - variance_%      │
└───────────────────┘
```

### Variance Calculation Example

| Product | Expected | Counted | Variance | Variance % | Classification |
|---------|----------|---------|----------|------------|----------------|
| WIDGET-A | 100 | 98 | -2 | -2.00% | MINOR |
| WIDGET-B | 50 | 55 | +5 | +10.00% | SIGNIFICANT |
| WIDGET-C | 200 | 200 | 0 | 0.00% | NONE |
| WIDGET-D | 75 | 0 | -75 | -100.00% | SIGNIFICANT |

### Status Transition Flow

```
DRAFT → IN_PROGRESS → COUNTING → REVIEW → COMPLETED
  │                                 │
  └──────────► CANCELLED ◄──────────┘
```

### Integration Points
- Warehouse module for warehouse data
- Product module for product data
- User module for assignments and permissions
- StockMovement for adjustment creation

---

## Progress Tracking

- [ ] Task 57: StockTake model creation
- [ ] Task 58: Stock take status field
- [ ] Task 59: Stock take scope definition
- [ ] Task 60: StockTakeItem model
- [ ] Task 61: Variance calculation
- [ ] Task 62: Variance percentage

**Document Status:** Complete | **Ready for Implementation:** Yes
