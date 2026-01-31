# Tasks 63-70: Reconciliation Model

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** E - Reconciliation & Reports  
> **Document:** 01 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-71-76_Reports-Export-Verify.md](02_Tasks-71-76_Reports-Export-Verify.md)

---

## Document Overview

This document covers the creation of the CODReconciliation model and its associated fields for daily reconciliation of Cash on Delivery orders. The reconciliation system tracks expected amounts, collected amounts, failed collections, variances, and provides per-courier breakdowns to ensure accurate financial tracking for COD transactions across multiple courier services in Sri Lanka.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create CODReconciliation Model | Medium | 45 min |
| 64 | Create Reconciliation Date | Low | 15 min |
| 65 | Create Total Expected | Low | 20 min |
| 66 | Create Total Collected | Low | 20 min |
| 67 | Create Total Failed | Low | 15 min |
| 68 | Create Variance | Low | 20 min |
| 69 | Create Reconciliation Status | Low | 20 min |
| 70 | Create Courier Reconciliation | Medium | 40 min |

---

## Task 63: Create CODReconciliation Model

### Overview
Create the CODReconciliation model as the central entity for daily reconciliation of Cash on Delivery orders. This model serves as the primary record for tracking daily COD financial reconciliation across all courier services, storing aggregated data about expected amounts, collected amounts, and discrepancies. The model supports multi-tenancy and provides a complete audit trail of daily COD operations.

### Dependencies
- Task 62: Verify COD Delivery Collection (from Group-D)
- SubPhase-02 (Django Tenants Installation) must be complete
- SubPhase-03 (Core Backend Infrastructure) must be complete
- COD models from previous groups must exist

### Instructions

1. **Create reconciliation model file**
   - Navigate to `backend/apps/payments/models/` directory
   - Create new file `cod_reconciliation.py`
   - Import required Django model classes and fields

2. **Define CODReconciliation model class**
   - Inherit from TenantAwareModel (for multi-tenancy support)
   - Inherit from TimestampedModel (for created_at, updated_at)
   - Set appropriate Meta class with table name and ordering

3. **Add tenant relationship**
   - Create ForeignKey to Tenant model
   - Set on_delete to PROTECT (prevent deletion of tenant with reconciliations)
   - Add related_name as "cod_reconciliations"
   - Add db_index for query optimization

4. **Add core financial fields**
   - Prepare for date field (Task 64)
   - Prepare for total_expected field (Task 65)
   - Prepare for total_collected field (Task 66)
   - Prepare for total_failed field (Task 67)
   - Prepare for variance field (Task 68)
   - Prepare for status field (Task 69)

5. **Add metadata fields**
   - Add notes field (TextField, blank=True) for reconciliation notes
   - Add reconciled_by field (ForeignKey to User, nullable)
   - Add reconciled_at field (DateTimeField, nullable)
   - Add created_by field (ForeignKey to User)

6. **Define model methods**
   - Create __str__ method returning tenant name and date
   - Create get_absolute_url method for admin interface
   - Prepare calculate_variance method (implemented in Task 68)
   - Prepare get_courier_breakdown method (implemented in Task 70)

7. **Configure model Meta**
   - Set db_table to "cod_reconciliation"
   - Add unique_together constraint on (tenant, date)
   - Set default ordering to ["-date"]
   - Add verbose_name and verbose_name_plural

8. **Register model in admin**
   - Update admin.py to register CODReconciliation model
   - Configure list display fields
   - Add filters for date, status, tenant

### Model Architecture

```
CODReconciliation Model
├── Core Fields
│   ├── tenant (ForeignKey) → Multi-tenancy
│   ├── date (DateField) → Reconciliation date
│   ├── total_expected (Decimal) → Sum of expected COD
│   ├── total_collected (Decimal) → Sum of collected amounts
│   ├── total_failed (Integer) → Count of failed collections
│   ├── variance (Decimal) → Calculated difference
│   └── status (CharField) → Reconciliation state
│
├── Metadata Fields
│   ├── notes (TextField) → Additional comments
│   ├── reconciled_by (ForeignKey) → User who reconciled
│   ├── reconciled_at (DateTime) → When reconciled
│   └── created_by (ForeignKey) → User who created
│
└── Audit Fields (from TimestampedModel)
    ├── created_at (DateTime)
    └── updated_at (DateTime)
```

### Reconciliation Model Purpose

| Field Category | Purpose | Sri Lanka Context |
|----------------|---------|-------------------|
| Financial Tracking | Record daily COD totals | LKR currency handling |
| Courier Management | Per-courier breakdown | Multiple courier services |
| Status Tracking | Monitor reconciliation state | Daily reconciliation cycle |
| Audit Trail | Track who reconciled and when | Compliance and reporting |

### Model Relationships Diagram

```
┌─────────────────────────┐
│       Tenant            │
│  (Multi-tenancy)        │
└───────────┬─────────────┘
            │ 1:N
            ▼
┌─────────────────────────┐
│  CODReconciliation      │
│  ├── date               │ ← Daily reconciliation
│  ├── total_expected     │ ← Aggregate from CODOrders
│  ├── total_collected    │ ← Aggregate from collections
│  ├── variance           │ ← expected - collected
│  └── status             │ ← PENDING/RECONCILED/DISCREPANCY
└───────────┬─────────────┘
            │ 1:N
            ▼
┌─────────────────────────┐
│ CODCourierReconciliation│ ← Task 70
│  ├── courier            │
│  ├── expected           │
│  └── collected          │
└─────────────────────────┘
```

### Expected Outcome
- CODReconciliation model created with proper structure
- Multi-tenancy support enabled
- Relationships to Tenant and User models configured
- Admin interface registered
- Foundation for financial reconciliation established

### Verification Checklist
- [ ] `backend/apps/payments/models/cod_reconciliation.py` file created
- [ ] CODReconciliation model class defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] Tenant ForeignKey configured with PROTECT
- [ ] Core financial field placeholders added
- [ ] Metadata fields (notes, reconciled_by, etc.) added
- [ ] __str__ method implemented
- [ ] Model Meta configured with unique_together
- [ ] Model registered in admin.py
- [ ] Migrations created and applied

---

## Task 64: Create Reconciliation Date

### Overview
Add the date field to the CODReconciliation model to specify which date the reconciliation covers. This field is critical for organizing reconciliations chronologically and ensuring each tenant has exactly one reconciliation record per date. The date field combined with the tenant field creates a unique constraint to prevent duplicate reconciliations.

### Dependencies
- Task 63: Create CODReconciliation Model

### Instructions

1. **Add date field to model**
   - Open `cod_reconciliation.py` file
   - Add DateField named "date"
   - Set db_index=True for query optimization
   - Set help_text explaining it's the reconciliation date

2. **Configure date field constraints**
   - Do not allow null values (null=False)
   - Do not allow blank values (blank=False)
   - Date must be unique per tenant (handled by unique_together)

3. **Add date validation**
   - Create clean method to validate date
   - Ensure date is not in the future
   - Ensure date format matches Asia/Colombo timezone
   - Prevent creation of multiple reconciliations for same date/tenant

4. **Update unique constraint**
   - Verify Meta.unique_together includes ("tenant", "date")
   - This ensures one reconciliation per tenant per date
   - Database will enforce this constraint

5. **Add date helper methods**
   - Create get_date_range method for reporting
   - Create is_today method to check if reconciliation is for current date
   - Create is_overdue method to check if reconciliation is pending

6. **Update __str__ method**
   - Modify to include formatted date
   - Format: "{Tenant Name} - {Date (YYYY-MM-DD)}"
   - Use Sri Lanka date format where appropriate

7. **Configure admin interface**
   - Add date to list_display
   - Add date_hierarchy for easy navigation by date
   - Add date range filter

### Date Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | DateField | Store date without time |
| Null | False | Date is required |
| Blank | False | Cannot be empty in forms |
| DB Index | True | Fast date queries |
| Unique Together | (tenant, date) | One per tenant per day |

### Date Validation Rules

```
Date Validation Flow
├── Check date is not null
├── Check date is not in future
│   └── Compare with today() in Asia/Colombo timezone
├── Check date format is valid
│   └── Use YYYY-MM-DD format
└── Check uniqueness per tenant
    └── Database constraint enforces this
```

### Sri Lanka Context

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| Timezone | Asia/Colombo (UTC+5:30) | Use timezone-aware dates |
| Business Days | Mon-Fri, Sat half-day | Consider in reporting |
| Holidays | Sri Lankan holidays | May skip reconciliation |
| Format | YYYY-MM-DD or DD/MM/YYYY | Display format preference |

### Date Query Examples

| Query Type | Purpose | Use Case |
|------------|---------|----------|
| Today's reconciliation | date = today() | Check today's status |
| Date range | date__range=(start, end) | Weekly/monthly reports |
| Pending for date | date = X, status = PENDING | Find unreconciled dates |
| Last 7 days | date__gte = today() - 7 | Recent activity |

### Date Field Usage Diagram

```
Daily Reconciliation Timeline
─────────────────────────────────────────────────────────►
     Day 1          Day 2          Day 3
       │              │              │
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│   COD    │   │   COD    │   │   COD    │
│ Recon #1 │   │ Recon #2 │   │ Recon #3 │
│ date:    │   │ date:    │   │ date:    │
│ 2026-    │   │ 2026-    │   │ 2026-    │
│ 01-01    │   │ 01-02    │   │ 01-03    │
└──────────┘   └──────────┘   └──────────┘
     │              │              │
     └──────────────┴──────────────┘
          Unique per tenant
```

### Expected Outcome
- Date field added to CODReconciliation model
- Unique constraint ensures one reconciliation per tenant per date
- Date validation prevents future dates
- Admin interface shows date prominently

### Verification Checklist
- [ ] date field added to CODReconciliation model
- [ ] DateField configured with proper constraints
- [ ] db_index=True for optimization
- [ ] unique_together constraint on (tenant, date)
- [ ] clean method validates date (not future)
- [ ] __str__ method includes date
- [ ] Admin interface shows date in list_display
- [ ] Date hierarchy added to admin
- [ ] Migrations created and applied

---

## Task 65: Create Total Expected

### Overview
Add the total_expected field to calculate and store the total expected COD amount for a specific reconciliation date. This field aggregates all COD orders that were expected to be collected on the reconciliation date, providing the baseline amount against which actual collections are compared. The calculation considers all COD orders delivered or scheduled for delivery on that date.

### Dependencies
- Task 63: Create CODReconciliation Model
- Task 64: Create Reconciliation Date

### Instructions

1. **Add total_expected field**
   - Open `cod_reconciliation.py` file
   - Add DecimalField named "total_expected"
   - Set max_digits to 15 (large values support)
   - Set decimal_places to 2 (LKR currency)

2. **Configure field properties**
   - Set default value to 0.00
   - Add validators for minimum value (>= 0)
   - Set help_text explaining it's the sum of expected COD amounts
   - Add db_index for reporting queries

3. **Create calculation method**
   - Create static method calculate_expected_for_date(tenant, date)
   - Query all CODOrder records for the tenant and date
   - Filter by orders where expected_collection_date equals reconciliation date
   - Sum the COD amount for eligible orders
   - Return Decimal value

4. **Add auto-calculation logic**
   - Create method update_total_expected()
   - Call calculate_expected_for_date with self.tenant and self.date
   - Update self.total_expected with calculated value
   - Save the model instance

5. **Implement calculation filters**
   - Include only DELIVERED orders (status = DELIVERED)
   - Include only orders not cancelled
   - Include orders assigned to active couriers
   - Exclude refunded orders

6. **Add verification method**
   - Create verify_expected_calculation method
   - Recalculate total_expected from orders
   - Compare with stored value
   - Return boolean indicating if values match

7. **Update admin interface**
   - Add total_expected to list_display
   - Format as currency (LKR)
   - Make field read-only in admin (auto-calculated)
   - Add currency symbol in display

### Total Expected Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | DecimalField | Precise currency values |
| Max Digits | 15 | Support large amounts |
| Decimal Places | 2 | LKR cents (පැණි) |
| Default | 0.00 | Safe default |
| Validators | MinValueValidator(0) | No negative amounts |

### Calculation Logic Flow

```
Calculate Total Expected
├── Step 1: Query CODOrder records
│   ├── Filter by tenant
│   ├── Filter by expected_collection_date = reconciliation date
│   └── Filter by status = DELIVERED
│
├── Step 2: Apply exclusions
│   ├── Exclude cancelled orders
│   ├── Exclude refunded orders
│   └── Exclude inactive couriers
│
├── Step 3: Aggregate amounts
│   ├── Sum(cod_amount) for all matching orders
│   └── Convert to Decimal(15, 2)
│
└── Step 4: Store result
    └── Update total_expected field
```

### Expected Calculation Example

```
Reconciliation Date: 2026-01-31

COD Orders for 2026-01-31:
┌──────┬──────────┬────────┬──────────┐
│ ID   │ Courier  │ Amount │ Status   │
├──────┼──────────┼────────┼──────────┤
│ 1001 │ Pronto   │  5,500 │ DELIVERED│ ✓ Include
│ 1002 │ DHL      │  3,200 │ DELIVERED│ ✓ Include
│ 1003 │ Pronto   │  1,800 │ PENDING  │ ✗ Exclude (not delivered)
│ 1004 │ DHL      │  4,500 │ DELIVERED│ ✓ Include
│ 1005 │ Pronto   │  2,100 │ CANCELLED│ ✗ Exclude (cancelled)
└──────┴──────────┴────────┴──────────┘

Total Expected = 5,500 + 3,200 + 4,500 = LKR 13,200.00
```

### Sri Lanka Currency Handling

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| Currency | LKR (Sri Lankan Rupees) | Use ₨ symbol |
| Format | 13,200.00 | Comma separator for thousands |
| Decimal | 2 places | Support cents (පැණි) |
| Large Values | Up to 999,999,999,999.99 | 15 digits total |

### Calculation Considerations

| Scenario | Handling | Reason |
|----------|----------|--------|
| No orders for date | Return 0.00 | Valid scenario |
| Partially delivered | Include only DELIVERED | Accurate expected amount |
| Refunded orders | Exclude from calculation | Not collectible |
| Multiple couriers | Sum across all | Total expected for day |

### Expected Outcome
- total_expected field added to model
- Automatic calculation from COD orders
- Accurate aggregation for reconciliation date
- Currency formatted correctly (LKR)

### Verification Checklist
- [ ] total_expected field added as DecimalField(15, 2)
- [ ] Default value set to 0.00
- [ ] MinValueValidator(0) applied
- [ ] calculate_expected_for_date method created
- [ ] Calculation filters DELIVERED orders only
- [ ] Excludes cancelled and refunded orders
- [ ] update_total_expected method implemented
- [ ] Admin interface displays as LKR currency
- [ ] Field is read-only in admin
- [ ] Migrations created and applied

---

## Task 66: Create Total Collected

### Overview
Add the total_collected field to track the actual amount collected from COD orders on the reconciliation date. This field stores the sum of all successful COD collections, allowing comparison with the expected amount to identify discrepancies. The field is calculated from CODCollection records where payment was successfully received.

### Dependencies
- Task 63: Create CODReconciliation Model
- Task 64: Create Reconciliation Date
- Task 65: Create Total Expected

### Instructions

1. **Add total_collected field**
   - Open `cod_reconciliation.py` file
   - Add DecimalField named "total_collected"
   - Set max_digits to 15 (matching total_expected)
   - Set decimal_places to 2 (LKR currency)

2. **Configure field properties**
   - Set default value to 0.00
   - Add validators for minimum value (>= 0)
   - Set help_text explaining it's the sum of collected amounts
   - Add db_index for reporting queries

3. **Create calculation method**
   - Create static method calculate_collected_for_date(tenant, date)
   - Query all CODCollection records for the tenant and date
   - Filter by collections where collection_date equals reconciliation date
   - Sum the collected_amount for successful collections
   - Return Decimal value

4. **Add auto-calculation logic**
   - Create method update_total_collected()
   - Call calculate_collected_for_date with self.tenant and self.date
   - Update self.total_collected with calculated value
   - Save the model instance

5. **Implement collection filters**
   - Include only COLLECTED status records
   - Include only verified collections
   - Exclude reversed/cancelled collections
   - Handle partial collections appropriately

6. **Add verification method**
   - Create verify_collected_calculation method
   - Recalculate total_collected from collections
   - Compare with stored value
   - Return boolean indicating if values match

7. **Update admin interface**
   - Add total_collected to list_display
   - Format as currency (LKR)
   - Make field read-only in admin
   - Show alongside total_expected for comparison

### Total Collected Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | DecimalField | Precise currency values |
| Max Digits | 15 | Support large amounts |
| Decimal Places | 2 | LKR cents |
| Default | 0.00 | Safe default |
| Validators | MinValueValidator(0) | No negative amounts |

### Collection Calculation Flow

```
Calculate Total Collected
├── Step 1: Query CODCollection records
│   ├── Filter by tenant
│   ├── Filter by collection_date = reconciliation date
│   └── Filter by status = COLLECTED
│
├── Step 2: Apply filters
│   ├── Include only verified collections
│   ├── Exclude cancelled/reversed collections
│   └── Include partial collections (if applicable)
│
├── Step 3: Aggregate amounts
│   ├── Sum(collected_amount) for all matching collections
│   └── Convert to Decimal(15, 2)
│
└── Step 4: Store result
    └── Update total_collected field
```

### Collection Tracking Example

```
Reconciliation Date: 2026-01-31

COD Collections for 2026-01-31:
┌──────┬───────────┬────────┬──────────┐
│ ID   │ Order     │ Amount │ Status   │
├──────┼───────────┼────────┼──────────┤
│ C001 │ 1001      │  5,500 │ COLLECTED│ ✓ Include
│ C002 │ 1002      │  3,200 │ COLLECTED│ ✓ Include
│ C003 │ 1004      │  4,500 │ COLLECTED│ ✓ Include
│ C004 │ 1006      │  2,800 │ FAILED   │ ✗ Exclude (not collected)
│ C005 │ 1007      │  1,500 │ REVERSED │ ✗ Exclude (reversed)
└──────┴───────────┴────────┴──────────┘

Total Collected = 5,500 + 3,200 + 4,500 = LKR 13,200.00
```

### Collection vs Expected Comparison

```
Reconciliation Summary for 2026-01-31
┌──────────────────┬────────────┐
│ Metric           │ Amount     │
├──────────────────┼────────────┤
│ Total Expected   │ 13,200.00  │ ← Task 65
│ Total Collected  │ 13,200.00  │ ← Task 66
│ Variance         │      0.00  │ ← Task 68
└──────────────────┴────────────┘
         Perfect Match!
```

### Collection Status Handling

| Status | Include in Total? | Reason |
|--------|-------------------|--------|
| COLLECTED | Yes ✓ | Successfully collected |
| FAILED | No ✗ | Not collected |
| PENDING | No ✗ | Not yet collected |
| REVERSED | No ✗ | Collection reversed |
| PARTIAL | Yes ✓ | Include partial amount |

### Partial Collection Handling

```
Scenario: Order amount is LKR 5,000
         Customer pays LKR 4,500 (partial)

Options:
1. Include partial amount (4,500) in total_collected
2. Mark as FAILED and exclude from total_collected
3. Create separate partial_collections field

Recommendation: Option 1 - Include actual collected amount
└── Most accurate for reconciliation
```

### Expected Outcome
- total_collected field added to model
- Automatic calculation from CODCollection records
- Accurate tracking of actual collections
- Ready for variance calculation

### Verification Checklist
- [ ] total_collected field added as DecimalField(15, 2)
- [ ] Default value set to 0.00
- [ ] MinValueValidator(0) applied
- [ ] calculate_collected_for_date method created
- [ ] Calculation filters COLLECTED status only
- [ ] Excludes reversed/cancelled collections
- [ ] update_total_collected method implemented
- [ ] Admin interface displays as LKR currency
- [ ] Field shown alongside total_expected
- [ ] Migrations created and applied

---

## Task 67: Create Total Failed

### Overview
Add the total_failed field to track the count of failed COD collection attempts for the reconciliation date. This field stores the number of orders where collection was attempted but unsuccessful, providing insight into collection failure rates and helping identify operational issues with specific couriers or delivery areas.

### Dependencies
- Task 63: Create CODReconciliation Model
- Task 64: Create Reconciliation Date

### Instructions

1. **Add total_failed field**
   - Open `cod_reconciliation.py` file
   - Add IntegerField named "total_failed"
   - Set default value to 0
   - Add help_text explaining it's count of failed collections

2. **Configure field properties**
   - Add validators for minimum value (>= 0)
   - Set db_index for reporting queries
   - Make non-nullable (null=False)
   - Allow zero as valid value

3. **Create calculation method**
   - Create static method calculate_failed_for_date(tenant, date)
   - Query all CODCollection records for tenant and date
   - Count records where status equals FAILED
   - Return integer count

4. **Add auto-calculation logic**
   - Create method update_total_failed()
   - Call calculate_failed_for_date with self.tenant and self.date
   - Update self.total_failed with calculated count
   - Save the model instance

5. **Implement failure tracking**
   - Count only FAILED status collections
   - Include customer_unavailable scenarios
   - Include payment_refused scenarios
   - Exclude PENDING attempts (not yet failed)

6. **Add failure rate calculation**
   - Create method get_failure_rate()
   - Calculate (total_failed / total_orders) * 100
   - Return percentage as Decimal
   - Handle division by zero (return 0.00)

7. **Update admin interface**
   - Add total_failed to list_display
   - Show failure rate alongside count
   - Add color coding (red for high failure rates)
   - Create filter for high failure counts

### Total Failed Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | IntegerField | Count of failures |
| Default | 0 | No failures by default |
| Null | False | Always has a value |
| Validators | MinValueValidator(0) | No negative counts |
| DB Index | True | Query optimization |

### Failure Calculation Flow

```
Calculate Total Failed
├── Step 1: Query CODCollection records
│   ├── Filter by tenant
│   ├── Filter by collection_date = reconciliation date
│   └── Filter by status = FAILED
│
├── Step 2: Count failures
│   ├── Count all matching records
│   └── No amount aggregation (just count)
│
└── Step 3: Store result
    └── Update total_failed field
```

### Failure Tracking Example

```
Reconciliation Date: 2026-01-31

COD Collection Attempts:
┌──────┬───────────┬──────────┬────────────────────┐
│ ID   │ Order     │ Status   │ Failure Reason     │
├──────┼───────────┼──────────┼────────────────────┤
│ C001 │ 1001      │ COLLECTED│ -                  │ ✗ Not a failure
│ C002 │ 1002      │ COLLECTED│ -                  │ ✗ Not a failure
│ C003 │ 1003      │ FAILED   │ Customer unavailable│ ✓ Count
│ C004 │ 1004      │ COLLECTED│ -                  │ ✗ Not a failure
│ C005 │ 1005      │ FAILED   │ Payment refused    │ ✓ Count
│ C006 │ 1006      │ PENDING  │ -                  │ ✗ Not failed yet
└──────┴───────────┴──────────┴────────────────────┘

Total Failed = 2 orders
```

### Failure Status Categories

| Status | Count as Failed? | Reasoning |
|--------|------------------|-----------|
| FAILED | Yes ✓ | Explicit failure |
| COLLECTED | No ✗ | Successful collection |
| PENDING | No ✗ | Not attempted or still pending |
| REVERSED | No ✗ | Was collected, then reversed |
| PARTIAL | No ✗ | Partially successful |

### Failure Rate Calculation

```
Failure Rate Formula
────────────────────────────────────────
                total_failed
Failure Rate = ─────────────── × 100%
                total_orders
────────────────────────────────────────

Example:
- Total Orders: 50
- Total Failed: 5
- Failure Rate: (5 / 50) × 100% = 10%

Thresholds:
├── 0-5%    → Excellent ✓
├── 5-10%   → Good
├── 10-20%  → Concerning ⚠
└── >20%    → Critical ✗
```

### Failure Analysis by Courier

```
┌──────────────┬───────┬────────┬─────────┐
│ Courier      │ Total │ Failed │ Rate    │
├──────────────┼───────┼────────┼─────────┤
│ Pronto Lanka │   20  │    2   │  10.0%  │
│ DHL Ecommerce│   15  │    1   │   6.7%  │
│ Aramex       │   15  │    2   │  13.3%  │
└──────────────┴───────┴────────┴─────────┘
                Total: 5 failures
```

### Failure Reasons to Track

| Failure Reason | Category | Actionable? |
|----------------|----------|-------------|
| Customer unavailable | Customer | Reschedule delivery |
| Payment refused | Customer | Contact customer |
| Insufficient funds | Customer | Follow up payment |
| Address incorrect | Logistics | Update address |
| Access denied | Logistics | Coordinate delivery |

### Expected Outcome
- total_failed field tracks failure count
- Automatic calculation from failed collections
- Failure rate can be calculated
- Insights into collection effectiveness

### Verification Checklist
- [ ] total_failed field added as IntegerField
- [ ] Default value set to 0
- [ ] MinValueValidator(0) applied
- [ ] calculate_failed_for_date method created
- [ ] Counts only FAILED status collections
- [ ] Excludes PENDING attempts
- [ ] update_total_failed method implemented
- [ ] get_failure_rate method created
- [ ] Admin interface displays count
- [ ] Migrations created and applied

---

## Task 68: Create Variance

### Overview
Add the variance field to calculate and store the difference between expected and collected COD amounts. Variance is a critical reconciliation metric that identifies discrepancies between what was expected to be collected and what was actually collected. Positive variance indicates under-collection (money missing), while negative variance indicates over-collection (more than expected).

### Dependencies
- Task 63: Create CODReconciliation Model
- Task 65: Create Total Expected
- Task 66: Create Total Collected

### Instructions

1. **Add variance field**
   - Open `cod_reconciliation.py` file
   - Add DecimalField named "variance"
   - Set max_digits to 15 (matching financial fields)
   - Set decimal_places to 2 (LKR currency)

2. **Configure field properties**
   - Set default value to 0.00
   - Allow negative values (no MinValueValidator)
   - Set help_text explaining calculation (expected - collected)
   - Add db_index for filtering queries

3. **Create calculation method**
   - Create method calculate_variance()
   - Calculate: total_expected - total_collected
   - Return Decimal value with 2 decimal places
   - Handle None values (treat as 0.00)

4. **Add auto-calculation logic**
   - Create method update_variance()
   - Call self.calculate_variance()
   - Update self.variance with calculated value
   - Automatically called after updating expected/collected

5. **Implement variance interpretation**
   - Create property has_variance (returns True if variance != 0)
   - Create property variance_type (returns "OVER", "UNDER", or "MATCHED")
   - Create property variance_percentage (variance as % of expected)
   - Create method get_variance_status() returning readable status

6. **Add variance thresholds**
   - Define acceptable variance threshold (e.g., LKR 100 or 1%)
   - Create is_within_threshold method
   - Use threshold to determine if manual review needed
   - Configure threshold in settings or model constant

7. **Update admin interface**
   - Add variance to list_display
   - Format with color coding (red for positive, green for zero)
   - Show variance_type and percentage
   - Add filter for has_variance

### Variance Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | DecimalField | Precise currency variance |
| Max Digits | 15 | Support large variances |
| Decimal Places | 2 | LKR cents |
| Default | 0.00 | No variance by default |
| Allows Negative | Yes | Over-collection scenarios |

### Variance Calculation Formula

```
Variance Calculation
────────────────────────────────────────
Variance = Total Expected - Total Collected
────────────────────────────────────────

Interpretation:
├── Variance > 0   → Under-collection (money missing)
│                     ⚠ Needs investigation
├── Variance = 0   → Perfect match
│                     ✓ Reconciled successfully
└── Variance < 0   → Over-collection (extra money)
                      ⚠ Investigate source
```

### Variance Examples

```
Example 1: Perfect Match
┌──────────────────┬────────────┐
│ Total Expected   │ 50,000.00  │
│ Total Collected  │ 50,000.00  │
│ Variance         │      0.00  │ ✓ MATCHED
└──────────────────┴────────────┘

Example 2: Under-Collection
┌──────────────────┬────────────┐
│ Total Expected   │ 50,000.00  │
│ Total Collected  │ 48,500.00  │
│ Variance         │  1,500.00  │ ⚠ UNDER (3%)
└──────────────────┴────────────┘

Example 3: Over-Collection
┌──────────────────┬────────────┐
│ Total Expected   │ 50,000.00  │
│ Total Collected  │ 51,200.00  │
│ Variance         │ -1,200.00  │ ⚠ OVER (-2.4%)
└──────────────────┴────────────┘
```

### Variance Type Classification

| Variance Value | Type | Status | Action Required |
|----------------|------|--------|-----------------|
| 0.00 | MATCHED | Reconciled ✓ | None |
| > 0 and ≤ threshold | UNDER_MINOR | Acceptable | Log only |
| > threshold | UNDER_MAJOR | Discrepancy ⚠ | Investigate |
| < 0 and ≥ -threshold | OVER_MINOR | Acceptable | Log only |
| < -threshold | OVER_MAJOR | Discrepancy ⚠ | Investigate |

### Variance Percentage Calculation

```
Variance Percentage Formula
────────────────────────────────────────
                  variance
Percentage = ─────────────── × 100%
              total_expected
────────────────────────────────────────

Example:
- Variance: 1,500.00
- Total Expected: 50,000.00
- Percentage: (1,500 / 50,000) × 100% = 3%

Acceptable Threshold: ≤ 1% or LKR 100
```

### Variance Workflow

```
Reconciliation Variance Handling
│
├── Calculate variance
│   └── expected - collected
│
├── Check variance amount
│   ├── If 0.00 → Mark RECONCILED
│   ├── If within threshold → Mark RECONCILED (with note)
│   └── If exceeds threshold → Mark DISCREPANCY
│
├── Determine variance type
│   ├── UNDER → Investigation needed
│   │         └── Check for missed collections
│   └── OVER → Investigation needed
│             └── Check for duplicate entries
│
└── Generate variance report
    └── List affected orders and couriers
```

### Threshold Configuration

| Threshold Type | Value | Use Case |
|----------------|-------|----------|
| Absolute | LKR 100 | Small variances acceptable |
| Percentage | 1% | Relative to expected amount |
| Combined | Both conditions must be met | Strictest control |
| None | Any variance flagged | Maximum scrutiny |

### Expected Outcome
- Variance field calculates expected vs collected difference
- Automatic variance type classification
- Threshold-based discrepancy flagging
- Clear indicators for reconciliation status

### Verification Checklist
- [ ] variance field added as DecimalField(15, 2)
- [ ] Allows negative values (over-collection)
- [ ] calculate_variance method implemented
- [ ] Formula: total_expected - total_collected
- [ ] update_variance method auto-calculates
- [ ] has_variance property created
- [ ] variance_type property (OVER/UNDER/MATCHED)
- [ ] variance_percentage property created
- [ ] is_within_threshold method implemented
- [ ] Admin interface shows variance with color coding
- [ ] Migrations created and applied

---

## Task 69: Create Reconciliation Status

### Overview
Add the status field to track the current state of the reconciliation record. The status field provides a clear indication of whether the reconciliation is pending review, has been completed successfully, or has identified discrepancies requiring investigation. This field drives workflow automation and reporting.

### Dependencies
- Task 63: Create CODReconciliation Model
- Task 68: Create Variance

### Instructions

1. **Define status choices**
   - Create STATUS_CHOICES tuple in model
   - Define PENDING status (default, not yet reconciled)
   - Define RECONCILED status (successfully reconciled)
   - Define DISCREPANCY status (variance exceeds threshold)
   - Add help text for each status

2. **Add status field**
   - Add CharField named "status"
   - Set max_length to 20
   - Set choices to STATUS_CHOICES
   - Set default to PENDING
   - Add db_index for filtering

3. **Create status constants**
   - Define STATUS_PENDING = "PENDING"
   - Define STATUS_RECONCILED = "RECONCILED"
   - Define STATUS_DISCREPANCY = "DISCREPANCY"
   - Use constants in choices and code

4. **Implement status transition logic**
   - Create method auto_set_status()
   - Check variance against threshold
   - If variance within threshold → RECONCILED
   - If variance exceeds threshold → DISCREPANCY
   - Update status accordingly

5. **Add status validation**
   - Create clean method to validate status transitions
   - Ensure status changes are logged
   - Prevent invalid status transitions
   - Require approval for DISCREPANCY → RECONCILED

6. **Create status helper methods**
   - Create is_pending property (status == PENDING)
   - Create is_reconciled property (status == RECONCILED)
   - Create is_discrepancy property (status == DISCREPANCY)
   - Create can_modify method (returns True if status == PENDING)

7. **Update admin interface**
   - Add status to list_display with color coding
   - Add status filter to admin sidebar
   - Display status prominently in change form
   - Show status change history in audit log

### Status Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | CharField | Text status code |
| Max Length | 20 | Accommodate status names |
| Choices | STATUS_CHOICES | Restrict to valid statuses |
| Default | PENDING | Initial state |
| DB Index | True | Filter by status efficiently |

### Status Choices Definition

```python
class CODReconciliation(TenantAwareModel):
    # Status constants
    STATUS_PENDING = "PENDING"
    STATUS_RECONCILED = "RECONCILED"
    STATUS_DISCREPANCY = "DISCREPANCY"
    
    # Status choices
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending Reconciliation"),
        (STATUS_RECONCILED, "Reconciled Successfully"),
        (STATUS_DISCREPANCY, "Discrepancy Detected"),
    ]
    
    # Status field
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        db_index=True
    )
```

### Status Transition Flow

```
Reconciliation Status Lifecycle
│
├── Created
│   └── Status: PENDING (default)
│
├── Calculated financial fields
│   ├── total_expected
│   ├── total_collected
│   └── variance
│
├── Auto-set status based on variance
│   ├── If variance = 0 → RECONCILED
│   ├── If variance within threshold → RECONCILED
│   └── If variance exceeds threshold → DISCREPANCY
│
├── Manual review (if DISCREPANCY)
│   ├── Investigate variance cause
│   ├── Correct errors if found
│   ├── Update financial fields
│   └── Re-calculate status
│
└── Final State
    ├── RECONCILED → Complete ✓
    └── DISCREPANCY → Requires action ⚠
```

### Status-Based Workflows

| Status | Meaning | Automated Actions | Manual Actions |
|--------|---------|-------------------|----------------|
| PENDING | Not yet reconciled | Auto-calculate on creation | Review and approve |
| RECONCILED | Successfully matched | Send confirmation email | Archive record |
| DISCREPANCY | Variance detected | Send alert email | Investigate and resolve |

### Status Determination Logic

```
Auto-Set Status Algorithm
│
├── Calculate variance
│   └── variance = expected - collected
│
├── Check variance amount
│   │
│   ├── Case 1: variance == 0.00
│   │   └── Set status = RECONCILED
│   │
│   ├── Case 2: abs(variance) <= threshold
│   │   └── Set status = RECONCILED (note minor variance)
│   │
│   └── Case 3: abs(variance) > threshold
│       └── Set status = DISCREPANCY
│
└── Save status change
```

### Status Visual Indicators

| Status | Color | Icon | Admin Display |
|--------|-------|------|---------------|
| PENDING | Yellow | ⏳ | 🟡 Pending |
| RECONCILED | Green | ✓ | 🟢 Reconciled |
| DISCREPANCY | Red | ⚠ | 🔴 Discrepancy |

### Status-Based Permissions

| Action | PENDING | RECONCILED | DISCREPANCY |
|--------|---------|------------|-------------|
| Edit financial fields | ✓ Yes | ✗ No | ✓ Yes (with approval) |
| Delete record | ✓ Yes | ✗ No | ✗ No |
| Export report | ✓ Yes | ✓ Yes | ✓ Yes |
| Re-calculate | ✓ Yes | ✓ Yes | ✓ Yes |

### Status Transition Rules

```
Valid Status Transitions
├── PENDING → RECONCILED (variance within threshold)
├── PENDING → DISCREPANCY (variance exceeds threshold)
├── DISCREPANCY → RECONCILED (after correction)
├── DISCREPANCY → PENDING (reset for re-calculation)
└── RECONCILED → (no transitions allowed, immutable)
```

### Expected Outcome
- Status field tracks reconciliation state
- Automatic status determination based on variance
- Clear workflow for handling discrepancies
- Status-based permissions and actions

### Verification Checklist
- [ ] STATUS_CHOICES tuple defined with 3 statuses
- [ ] Status constants created (STATUS_PENDING, etc.)
- [ ] status field added as CharField with choices
- [ ] Default status set to PENDING
- [ ] auto_set_status method implemented
- [ ] Status based on variance threshold
- [ ] is_pending, is_reconciled, is_discrepancy properties
- [ ] Admin interface shows status with color coding
- [ ] Status filter added to admin sidebar
- [ ] Migrations created and applied

---

## Task 70: Create Courier Reconciliation

### Overview
Create the CODCourierReconciliation model to provide per-courier breakdown of COD reconciliation data. This related model allows tracking of expected amounts, collected amounts, and variances for each courier service individually, enabling detailed analysis of courier performance and identification of courier-specific issues in Sri Lanka's multi-courier delivery ecosystem.

### Dependencies
- Task 63: Create CODReconciliation Model
- Courier model from earlier SubPhases

### Instructions

1. **Create courier reconciliation model file**
   - Open `cod_reconciliation.py` file (or create separate file)
   - Create CODCourierReconciliation model class
   - Inherit from TimestampedModel for audit trail

2. **Add reconciliation relationship**
   - Create ForeignKey to CODReconciliation
   - Set on_delete to CASCADE (delete with parent)
   - Set related_name to "courier_breakdowns"
   - Add db_index for query optimization

3. **Add courier relationship**
   - Create ForeignKey to Courier model
   - Set on_delete to PROTECT (protect active couriers)
   - Set related_name to "cod_reconciliations"
   - Add db_index for courier filtering

4. **Add courier financial fields**
   - Add expected_amount (DecimalField, 15, 2)
   - Add collected_amount (DecimalField, 15, 2)
   - Add failed_count (IntegerField)
   - Add variance (DecimalField, 15, 2)

5. **Create calculation methods**
   - Create calculate_courier_expected(reconciliation, courier)
   - Create calculate_courier_collected(reconciliation, courier)
   - Create calculate_courier_failed(reconciliation, courier)
   - Create update_courier_variance() method

6. **Add unique constraint**
   - Set unique_together on (reconciliation, courier)
   - Ensures one record per courier per reconciliation
   - Prevents duplicate courier breakdowns

7. **Create aggregation methods**
   - Create static method create_all_breakdowns(reconciliation)
   - Query all active couriers for tenant
   - Create CODCourierReconciliation for each courier
   - Calculate amounts for each courier

8. **Update CODReconciliation model**
   - Add get_courier_breakdown() method
   - Return queryset of CODCourierReconciliation
   - Add get_top_performing_couriers() method
   - Add get_problematic_couriers() method

### Courier Reconciliation Model Structure

```
CODCourierReconciliation Model
├── Relationships
│   ├── reconciliation (ForeignKey) → Parent reconciliation
│   └── courier (ForeignKey) → Courier service
│
├── Financial Fields
│   ├── expected_amount (Decimal) → Expected from this courier
│   ├── collected_amount (Decimal) → Collected from this courier
│   ├── failed_count (Integer) → Failed collections
│   └── variance (Decimal) → expected - collected
│
└── Audit Fields (from TimestampedModel)
    ├── created_at (DateTime)
    └── updated_at (DateTime)
```

### Model Relationships Diagram

```
┌────────────────────────────┐
│   CODReconciliation        │
│   ├── date: 2026-01-31     │
│   ├── total_expected       │
│   ├── total_collected      │
│   └── status               │
└────────────┬───────────────┘
             │ 1:N
             ├─────────────────────────────┐
             │                             │
             ▼                             ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ CODCourierReconciliation │   │ CODCourierReconciliation │
│ ├── courier: Pronto      │   │ ├── courier: DHL         │
│ ├── expected: 25,000     │   │ ├── expected: 15,000     │
│ ├── collected: 24,500    │   │ ├── collected: 15,000    │
│ ├── failed: 2            │   │ ├── failed: 0            │
│ └── variance: 500        │   │ └── variance: 0          │
└──────────────────────────┘   └──────────────────────────┘
```

### Per-Courier Calculation Example

```
Reconciliation Date: 2026-01-31

Courier Breakdown:
┌───────────────┬──────────┬───────────┬────────┬──────────┐
│ Courier       │ Expected │ Collected │ Failed │ Variance │
├───────────────┼──────────┼───────────┼────────┼──────────┤
│ Pronto Lanka  │ 25,000   │  24,500   │   2    │   500    │
│ DHL Ecommerce │ 15,000   │  15,000   │   0    │     0    │
│ Aramex Sri LK │ 10,000   │   9,700   │   1    │   300    │
├───────────────┼──────────┼───────────┼────────┼──────────┤
│ TOTAL         │ 50,000   │  49,200   │   3    │   800    │
└───────────────┴──────────┴───────────┴────────┴──────────┘
                                            ▲
                              Matches CODReconciliation.variance
```

### Courier Breakdown Creation Flow

```
Create Courier Breakdowns
│
├── Step 1: Get parent reconciliation
│   └── CODReconciliation for specific date
│
├── Step 2: Get active couriers
│   └── Query all couriers for tenant
│
├── Step 3: For each courier
│   ├── Query CODOrders assigned to courier
│   ├── Filter by reconciliation date
│   ├── Calculate expected_amount (sum of cod_amount)
│   ├── Query CODCollections for courier
│   ├── Calculate collected_amount (sum of collected)
│   ├── Count failed_count (failed collections)
│   ├── Calculate variance (expected - collected)
│   └── Create CODCourierReconciliation record
│
└── Step 4: Verify totals
    └── Sum of all courier amounts = reconciliation totals
```

### Sri Lanka Courier Context

| Courier Service | Common Issues | Performance Notes |
|----------------|---------------|-------------------|
| Pronto Lanka | Address finding in rural areas | High volume, good reliability |
| DHL Ecommerce | Delays in suburban areas | Premium service, low failure |
| Aramex Sri Lanka | Customer availability | Growing network coverage |
| Postal Service | Slow delivery | Low cost, widespread reach |

### Courier Performance Metrics

```
Courier Performance Analysis
┌───────────────┬─────────┬──────────┬────────────┐
│ Metric        │ Pronto  │ DHL      │ Aramex     │
├───────────────┼─────────┼──────────┼────────────┤
│ Success Rate  │  92.0%  │  100%    │   90.0%    │
│ Avg Variance  │ ₨ 500   │ ₨ 0      │ ₨ 300      │
│ Volume Share  │  50.0%  │  30.0%   │   20.0%    │
│ Reliability   │   High  │ Very High│   Medium   │
└───────────────┴─────────┴──────────┴────────────┘
```

### Courier Breakdown Aggregation

| Method | Purpose | Return Value |
|--------|---------|--------------|
| get_courier_breakdown() | Get all courier records | QuerySet |
| get_top_performing_couriers() | Couriers with 0 variance | QuerySet (ordered) |
| get_problematic_couriers() | High variance/failures | QuerySet (ordered) |
| get_courier_success_rate() | Calculate % success | Dictionary |

### Expected Outcome
- CODCourierReconciliation model for per-courier tracking
- Automatic breakdown creation for all active couriers
- Detailed courier performance analysis
- Variance tracking at courier level

### Verification Checklist
- [ ] CODCourierReconciliation model created
- [ ] ForeignKey to CODReconciliation (CASCADE)
- [ ] ForeignKey to Courier (PROTECT)
- [ ] expected_amount field (DecimalField, 15, 2)
- [ ] collected_amount field (DecimalField, 15, 2)
- [ ] failed_count field (IntegerField)
- [ ] variance field (DecimalField, 15, 2)
- [ ] unique_together on (reconciliation, courier)
- [ ] create_all_breakdowns static method
- [ ] get_courier_breakdown method on parent model
- [ ] Model registered in admin
- [ ] Migrations created and applied

---

## Summary

This document established the CODReconciliation model and all associated fields for tracking daily Cash on Delivery reconciliation. The model provides comprehensive tracking of expected amounts, collected amounts, failed collections, variances, and status. The per-courier breakdown enables detailed performance analysis across Sri Lanka's multiple courier services.

### Completed Tasks
1. ✓ Created CODReconciliation model with multi-tenancy support
2. ✓ Added reconciliation date field with unique constraint
3. ✓ Implemented total_expected calculation from COD orders
4. ✓ Implemented total_collected calculation from collections
5. ✓ Added total_failed count for failed collection tracking
6. ✓ Created variance field with automatic calculation
7. ✓ Added reconciliation status with workflow transitions
8. ✓ Created CODCourierReconciliation for per-courier breakdowns

### Key Features Implemented
- Multi-tenant COD reconciliation tracking
- Automatic financial calculations (expected, collected, variance)
- Status-based workflow (PENDING → RECONCILED/DISCREPANCY)
- Per-courier performance breakdown
- LKR currency support with proper decimal handling
- Variance threshold-based discrepancy detection

### Next Steps
Proceed to [02_Tasks-71-76_Reports-Export-Verify.md](02_Tasks-71-76_Reports-Export-Verify.md) to create reconciliation reports, implement daily automated report generation with Celery, create COD summary and success rate reports, add Excel export functionality, and verify the complete reconciliation workflow.
