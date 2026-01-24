# Tasks 13-18: Warehouse, Number Generator, PDF, Indexes, and Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** A - Purchase Order Model & Status  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Shipping-Financial-User-Notes.md](02_Tasks-07-12_Shipping-Financial-User-Notes.md)

---

## Document Overview

This document completes the PurchaseOrder model by adding warehouse receiving field, implementing automatic PO number generation, adding PDF storage, creating database indexes for performance, defining model constraints, and generating initial migrations. These final elements make the model production-ready.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add PO Warehouse Field | Medium | 15 min |
| 14 | Create PO Number Generator | Medium | 25 min |
| 15 | Add PO PDF Storage Field | Low | 15 min |
| 16 | Create PO Model Indexes | Medium | 20 min |
| 17 | Create PO Model Constraints | Medium | 20 min |
| 18 | Run Initial PO Migrations | Low | 15 min |

---

## Task 13: Add PO Warehouse Field

### Overview
Add receiving warehouse field to specify where ordered goods should be delivered. This field enables multi-warehouse operations and proper stock allocation upon receiving.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- Warehouse model exists (from inventory app)

### Instructions

1. **Import Warehouse model**
   - Add import for Warehouse model from inventory app
   - Ensure proper app reference path

2. **Add receiving_warehouse field**
   - Add receiving_warehouse as ForeignKey to Warehouse
   - Set on_delete=models.PROTECT
   - Set related_name='purchase_orders'
   - Set blank=True, null=True (optional, can default to main warehouse)
   - Add db_index=True for filtering

3. **Update model docstring**
   - Document receiving warehouse purpose
   - Explain multi-warehouse scenarios
   - Note default warehouse behavior

4. **Add warehouse validation**
   - Ensure warehouse is active
   - Verify warehouse can receive goods
   - Check warehouse has sufficient capacity

### Warehouse Field Details

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| receiving_warehouse | ForeignKey | Destination warehouse | No |

### Multi-Warehouse Scenarios

| Scenario | Warehouse Assignment |
|----------|---------------------|
| Single warehouse | Default to main warehouse |
| Multiple warehouses | Specify closest to vendor |
| Direct-to-store | Assign store location |
| Transfer orders | Specify target warehouse |

### Warehouse Relationship
```
Warehouse (1) ────< (Many) PurchaseOrder

One warehouse receives many purchase orders
Each PO delivers to one warehouse
```

### Warehouse Selection Logic

| Factor | Consideration |
|--------|---------------|
| Proximity | Closest to vendor reduces shipping |
| Capacity | Sufficient space for items |
| Specialization | Electronics warehouse for tech items |
| Stock level | Replenish low-stock warehouse |

### Expected Outcome
- Warehouse-specific receiving
- Multi-location support
- Proper stock allocation
- Location-based reporting

### Verification Checklist
- [ ] Warehouse ForeignKey added
- [ ] on_delete=PROTECT configured
- [ ] related_name set
- [ ] Optional (blank=True, null=True)
- [ ] db_index added
- [ ] Multi-warehouse logic documented

---

## Task 14: Create PO Number Generator

### Overview
Implement automatic purchase order number generation service that creates unique, sequential PO numbers following the format PO-{YEAR}-{SEQUENCE}. This ensures consistent numbering and prevents duplicates.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- POSettings model (will be created in Group C, but plan for it now)

### Instructions

1. **Create po_number_generator.py file**
   - Navigate to `apps/purchases/services/` directory
   - Create `po_number_generator.py` file
   - Add module docstring explaining generation logic

2. **Import required modules**
   - Import Django transaction module
   - Import date/datetime utilities
   - Import PurchaseOrder model
   - Import POSettings model (for future use)

3. **Create PONumberGenerator class**
   - Define class with static or class methods
   - No instance variables needed (utility class)

4. **Implement generate_po_number method**
   - Accept tenant as parameter
   - Get current year
   - Query for last PO number in current year
   - Extract sequence number
   - Increment sequence
   - Format as PO-{YEAR}-{SEQUENCE:05d}
   - Return generated number

5. **Add sequence extraction logic**
   - Parse existing PO numbers matching pattern
   - Extract numeric sequence portion
   - Handle edge cases (no existing POs, year rollover)

6. **Implement year rollover handling**
   - When year changes, reset sequence to 1
   - First PO of year is PO-2026-00001

7. **Add uniqueness validation**
   - Check generated number doesn't exist
   - Retry with next sequence if collision
   - Use database transaction for atomicity

8. **Add custom prefix support**
   - Allow configurable prefix from settings
   - Default to "PO" if not configured
   - Support tenant-specific prefixes

9. **Update PurchaseOrder save method**
   - Override save() method in model
   - Check if po_number is blank
   - Call generator if blank
   - Assign generated number before saving

10. **Update services __init__.py**
    - Import PONumberGenerator class
    - Export for use in other modules

### Number Format Specification

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | PO | PO |
| Year | YYYY | 2026 |
| Sequence | 5 digits, zero-padded | 00001 |
| Full Format | PREFIX-YEAR-SEQUENCE | PO-2026-00001 |

### Generation Algorithm
```
1. Get current year (2026)
2. Query: SELECT po_number FROM PurchaseOrder 
         WHERE po_number LIKE 'PO-2026-%' 
         ORDER BY po_number DESC LIMIT 1
3. Extract sequence from last PO (e.g., "PO-2026-00042" → 42)
4. Increment: 42 + 1 = 43
5. Format: PO-2026-00043
6. Validate uniqueness
7. Return generated number
```

### Sequence Examples

| Scenario | Last PO | Next PO |
|----------|---------|---------|
| First PO of year | None | PO-2026-00001 |
| Normal increment | PO-2026-00042 | PO-2026-00043 |
| Year rollover | PO-2025-09999 | PO-2026-00001 |
| After 9999 | PO-2026-09999 | PO-2026-10000 |

### Concurrent Request Handling

| Issue | Solution |
|-------|----------|
| Race condition | Database transaction with row locking |
| Duplicate numbers | Unique constraint on po_number |
| Collision retry | Query latest and retry if exists |

### Custom Prefix Configuration
```
POSettings:
  po_number_prefix = "PO"       → PO-2026-00001
  po_number_prefix = "ORDER"    → ORDER-2026-00001
  po_number_prefix = "PURCH"    → PURCH-2026-00001
```

### Expected Outcome
- Automatic PO number generation
- Sequential, year-based numbering
- Collision-free generation
- Tenant-specific sequences

### Verification Checklist
- [ ] po_number_generator.py created
- [ ] PONumberGenerator class defined
- [ ] generate_po_number method implemented
- [ ] Sequence extraction logic added
- [ ] Year rollover handling implemented
- [ ] Uniqueness validation added
- [ ] Custom prefix support included
- [ ] Model save() method updated
- [ ] Generator exported in __init__.py

---

## Task 15: Add PO PDF Storage Field

### Overview
Add file field to store generated purchase order PDF documents. This enables PDF storage, retrieval, and serving for vendor communication and record keeping.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- File storage configured in project settings

### Instructions

1. **Add pdf_file field**
   - Add pdf_file as FileField
   - Set upload_to='purchase_orders/pdfs/%Y/%m/'
   - Set blank=True, null=True
   - Stores generated PDF for download

2. **Add pdf_generated_at field**
   - Add pdf_generated_at as DateTimeField
   - Set blank=True, null=True
   - Track when PDF was last generated

3. **Add pdf_version field**
   - Add pdf_version as IntegerField
   - Set default=1
   - Track PDF regeneration count

4. **Update model docstring**
   - Document PDF storage strategy
   - Explain regeneration scenarios
   - Note file path organization

### PDF Storage Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| pdf_file | FileField | PDF document storage | No |
| pdf_generated_at | DateTimeField | Generation timestamp | No |
| pdf_version | IntegerField | Version counter | Yes (default 1) |

### File Upload Path Structure
```
media/purchase_orders/pdfs/
├── 2026/
│   ├── 01/                    # January
│   │   ├── PO-2026-00001.pdf
│   │   ├── PO-2026-00002.pdf
│   │   └── PO-2026-00003.pdf
│   ├── 02/                    # February
│   │   ├── PO-2026-00015.pdf
│   │   └── PO-2026-00016.pdf
│   └── 03/                    # March
└── 2027/
```

### PDF Regeneration Scenarios

| Scenario | Action | pdf_version |
|----------|--------|-------------|
| First generation | Generate and save | 1 |
| PO updated | Regenerate if needed | 2 |
| Template changed | Regenerate all | Increment |
| Manual request | Regenerate on demand | Increment |

### PDF Lifecycle
```
PO Created (DRAFT)
     ↓
Changes made (no PDF yet)
     ↓
Status: SENT
     ↓
Generate PDF (pdf_version = 1)
     ↓
Email to vendor with PDF
     ↓
PO Updated (add line item)
     ↓
Regenerate PDF (pdf_version = 2)
     ↓
Email updated PDF
```

### File Storage Considerations

| Aspect | Implementation |
|--------|----------------|
| Storage backend | Django FileSystemStorage or S3 |
| File naming | {po_number}.pdf |
| Organization | Year/Month folders |
| Retention | Keep all versions or latest only |
| Size limit | Typically < 500 KB per PDF |

### Expected Outcome
- PDF storage capability
- Version tracking
- Organized file structure
- Easy retrieval for serving

### Verification Checklist
- [ ] pdf_file FileField added
- [ ] upload_to path configured
- [ ] pdf_generated_at field added
- [ ] pdf_version field added
- [ ] File storage documented
- [ ] Regeneration logic planned

---

## Task 16: Create PO Model Indexes

### Overview
Add database indexes to the PurchaseOrder model for frequently queried fields and common filter combinations. Indexes dramatically improve query performance for large datasets.

### Dependencies
- All previous PurchaseOrder model fields completed

### Instructions

1. **Open PurchaseOrder model Meta class**
   - Locate or create Meta class in model
   - Prepare to add indexes configuration

2. **Add single-field indexes**
   - Add index on status (already has db_index)
   - Add index on vendor (already has db_index)
   - Add index on po_number (already has unique, acts as index)
   - Add index on order_date
   - Add index on expected_delivery_date

3. **Create composite indexes**
   - Add composite index on (status, vendor)
   - Add composite index on (status, order_date)
   - Add composite index on (vendor, order_date)
   - Add composite index on (status, expected_delivery_date)

4. **Add date range indexes**
   - Ensure order_date indexed for range queries
   - Ensure expected_delivery_date indexed for scheduling
   - Consider created_at index for recent POs

5. **Add search indexes**
   - Consider GIN index for full-text search if using PostgreSQL
   - Index fields used in search (po_number, vendor__name)

6. **Update Meta class**
   - Use Meta.indexes list for Django 1.11+
   - Specify index names for clarity
   - Document index purpose

### Index Configuration

| Index Type | Fields | Purpose |
|------------|--------|---------|
| Single | status | Filter by status |
| Single | vendor | Filter by vendor |
| Single | order_date | Date range queries |
| Single | expected_delivery_date | Delivery schedule |
| Composite | (status, vendor) | Vendor-specific status reports |
| Composite | (status, order_date) | Status over time analysis |
| Composite | (vendor, order_date) | Vendor purchase history |
| Composite | (status, expected_delivery_date) | Overdue tracking |

### Meta Class Indexes Structure
```
class Meta:
    indexes = [
        models.Index(fields=['status'], name='po_status_idx'),
        models.Index(fields=['vendor'], name='po_vendor_idx'),
        models.Index(fields=['order_date'], name='po_order_date_idx'),
        models.Index(fields=['expected_delivery_date'], name='po_exp_delivery_idx'),
        models.Index(fields=['status', 'vendor'], name='po_status_vendor_idx'),
        models.Index(fields=['status', 'order_date'], name='po_status_date_idx'),
        models.Index(fields=['vendor', 'order_date'], name='po_vendor_date_idx'),
    ]
```

### Query Performance Impact

| Query | Without Index | With Index | Speedup |
|-------|---------------|------------|---------|
| Filter by status | Full table scan | Index scan | 10-100x |
| Vendor POs | Full scan + filter | Index lookup | 50-500x |
| Date range | Sequential scan | Index range | 20-200x |
| Composite filters | Multiple scans | Single index | 100-1000x |

### Index Usage Scenarios

| Query Type | Index Used | Example |
|------------|------------|---------|
| Status filter | status | WHERE status = 'SENT' |
| Vendor filter | vendor | WHERE vendor_id = uuid |
| Date range | order_date | WHERE order_date BETWEEN ... |
| Vendor + Status | (status, vendor) | WHERE status='DRAFT' AND vendor_id=uuid |
| Status + Date | (status, order_date) | WHERE status='SENT' AND order_date >= ... |

### Index Size Considerations

| Index Type | Approximate Size | Impact |
|------------|------------------|--------|
| Single field | 1-5% of table size | Minimal |
| Composite (2 fields) | 2-8% of table size | Small |
| Multiple indexes | Cumulative | Moderate |
| Trade-off | Storage vs Speed | Worth it |

### Expected Outcome
- Fast query performance
- Efficient filtering and sorting
- Scalable for millions of records
- Optimized common queries

### Verification Checklist
- [ ] Single-field indexes added
- [ ] Composite indexes created
- [ ] Index names specified
- [ ] Date range indexes included
- [ ] Meta class indexes configured
- [ ] Index purposes documented

---

## Task 17: Create PO Model Constraints

### Overview
Add database-level constraints to enforce business rules and data integrity. Constraints prevent invalid data states and ensure consistent PO information.

### Dependencies
- All PurchaseOrder model fields completed

### Instructions

1. **Add status transition constraints**
   - Use CheckConstraint for valid status values
   - Ensure status is one of POStatus choices
   - Database-level enforcement

2. **Add date validation constraints**
   - Ensure expected_delivery_date >= order_date
   - Ensure acknowledged_at >= created_at (if set)
   - Ensure received_at >= acknowledged_at (if set)

3. **Add financial constraints**
   - Ensure subtotal >= 0
   - Ensure tax_amount >= 0
   - Ensure total >= 0
   - Ensure shipping_cost >= 0
   - Ensure discount_amount >= 0

4. **Add quantity constraints**
   - Ensure payment_terms_days >= 0
   - Ensure pdf_version >= 1

5. **Add approval constraints**
   - If approved_at is set, approved_by must be set
   - If rejected_at is set, rejection_reason must be set

6. **Add uniqueness constraints**
   - po_number must be unique per tenant
   - Composite unique constraint if needed

7. **Update Meta class**
   - Add constraints list
   - Name each constraint clearly
   - Document constraint purpose

### Constraint Categories

| Category | Purpose | Type |
|----------|---------|------|
| Status | Valid status values | CheckConstraint |
| Date | Logical date ordering | CheckConstraint |
| Financial | Non-negative amounts | CheckConstraint |
| Approval | Approval completeness | CheckConstraint |
| Uniqueness | No duplicates | UniqueConstraint |

### Meta Class Constraints Structure
```
class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(subtotal__gte=0),
            name='po_subtotal_non_negative'
        ),
        models.CheckConstraint(
            check=models.Q(total__gte=0),
            name='po_total_non_negative'
        ),
        models.CheckConstraint(
            check=models.Q(
                expected_delivery_date__gte=models.F('order_date')
            ),
            name='po_delivery_after_order'
        ),
        models.UniqueConstraint(
            fields=['po_number'],
            name='po_number_unique'
        ),
    ]
```

### Date Logic Constraints

| Constraint | Logic | Purpose |
|------------|-------|---------|
| Delivery after order | expected_delivery_date >= order_date | Can't deliver before ordering |
| Acknowledge after create | acknowledged_at >= created_at | Temporal logic |
| Receive after acknowledge | received_at >= acknowledged_at | Workflow order |

### Financial Validation

| Field | Constraint | Reason |
|-------|------------|--------|
| subtotal | >= 0 | No negative subtotals |
| tax_amount | >= 0 | Tax can't be negative |
| total | >= 0 | Total can't be negative |
| shipping_cost | >= 0 | Shipping can't be negative |
| discount_amount | >= 0 | Discount is positive value |

### Approval Logic Constraints

| Condition | Constraint | Purpose |
|-----------|------------|---------|
| approved_at set | approved_by must be set | Know who approved |
| rejected_at set | rejection_reason must be set | Document rejection |

### Constraint Violation Handling

| Violation Type | Database Response | Application Response |
|----------------|-------------------|---------------------|
| CheckConstraint | Raise IntegrityError | Validation error to user |
| UniqueConstraint | Raise IntegrityError | "PO number exists" |
| Date logic | Reject save | "Invalid date range" |

### Expected Outcome
- Database-enforced business rules
- Data integrity guarantees
- Prevention of invalid states
- Clear constraint violations

### Verification Checklist
- [ ] Status constraints added
- [ ] Date validation constraints added
- [ ] Financial constraints added
- [ ] Approval constraints added
- [ ] Uniqueness constraints configured
- [ ] Constraints documented
- [ ] Constraint names clear

---

## Task 18: Run Initial PO Migrations

### Overview
Generate and apply Django migrations for the PurchaseOrder model. This creates the database tables, indexes, and constraints defined in the model.

### Dependencies
- Tasks 01-17: All PurchaseOrder model fields, indexes, and constraints complete
- Database connection configured
- Multi-tenancy migration strategy in place

### Instructions

1. **Verify model is complete**
   - Review all fields added
   - Check Meta class configuration
   - Ensure imports are correct

2. **Update models __init__.py**
   - Open `apps/purchases/models/__init__.py`
   - Import PurchaseOrder model
   - Export for Django detection

3. **Generate migration**
   - Open terminal in project root
   - Run makemigrations command for purchases app
   - Review generated migration file

4. **Review migration file**
   - Open generated migration in migrations/
   - Verify all fields present
   - Check indexes and constraints
   - Ensure no errors or warnings

5. **Test migration (dry run)**
   - Run migrate with --plan flag
   - Review planned operations
   - Check for conflicts with existing migrations

6. **Apply migration to public schema**
   - Run migrate command for shared apps
   - Ensure no errors

7. **Apply migration to tenant schemas**
   - Run tenant migrations command
   - Apply to all existing tenants
   - Verify success for each tenant

8. **Verify database tables**
   - Check table created in database
   - Verify columns match model fields
   - Confirm indexes exist
   - Check constraints applied

9. **Test model operations**
   - Create test PurchaseOrder in Django shell
   - Verify save works
   - Test po_number generation
   - Check constraint enforcement

10. **Update migration tracking**
    - Document migration number
    - Note any special considerations
    - Update project migration log

### Migration Workflow

| Step | Command | Purpose |
|------|---------|---------|
| 1 | makemigrations purchases | Generate migration |
| 2 | migrate --plan | Preview changes |
| 3 | migrate | Apply to public schema |
| 4 | migrate_schemas | Apply to tenant schemas |
| 5 | Verify | Check database |

### Generated Migration Content
```
operations = [
    migrations.CreateModel(
        name='PurchaseOrder',
        fields=[
            ('id', models.UUIDField(...)),
            ('po_number', models.CharField(...)),
            ('status', models.CharField(...)),
            # ... all other fields
        ],
        options={
            'verbose_name': 'Purchase Order',
            'ordering': ['-created_at'],
        },
    ),
    migrations.AddIndex(
        model_name='purchaseorder',
        index=models.Index(fields=['status'], name='po_status_idx'),
    ),
    # ... all other indexes
    migrations.AddConstraint(
        model_name='purchaseorder',
        constraint=models.CheckConstraint(...),
    ),
    # ... all other constraints
]
```

### Database Table Structure
```
Table: purchases_purchaseorder
├── id (uuid, PK)
├── po_number (varchar(50), unique, indexed)
├── status (varchar(20), indexed)
├── vendor_id (uuid, FK, indexed)
├── order_date (date, indexed)
├── expected_delivery_date (date, indexed)
├── subtotal (decimal(12,2))
├── total (decimal(12,2))
├── created_at (timestamp)
├── updated_at (timestamp)
├── ... (all other fields)
│
├── Indexes:
│   ├── po_status_idx
│   ├── po_vendor_idx
│   ├── po_status_vendor_idx
│   └── ... (all indexes)
│
└── Constraints:
    ├── po_number_unique
    ├── po_subtotal_non_negative
    └── ... (all constraints)
```

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Schema creation | Each tenant gets own purchaseorder table |
| Isolation | Data separated by tenant schema |
| Sequences | po_number sequences independent per tenant |
| Migration | Applied to public + all tenant schemas |

### Verification Tests

| Test | Expected Result |
|------|-----------------|
| Create PO | Success, po_number generated |
| Invalid status | Constraint error |
| Negative total | Constraint error |
| Duplicate po_number | Unique constraint error |
| Query by status | Fast with index |

### Expected Outcome
- Database tables created
- Indexes and constraints applied
- Multi-tenant schemas updated
- Model fully functional

### Verification Checklist
- [ ] models/__init__.py updated with imports
- [ ] makemigrations executed successfully
- [ ] Migration file reviewed
- [ ] Migration applied to public schema
- [ ] Migration applied to tenant schemas
- [ ] Database table verified
- [ ] Indexes confirmed in database
- [ ] Constraints confirmed in database
- [ ] Test PO creation successful
- [ ] Migration documented

---

## Summary

This document completed the PurchaseOrder model and made it production-ready:

| Accomplishment | Impact |
|----------------|--------|
| Warehouse field | Multi-location receiving support |
| Number generator | Automatic sequential numbering |
| PDF storage | Document management |
| Database indexes | Query performance optimization |
| Model constraints | Data integrity enforcement |
| Initial migrations | Database tables created |

### Complete PurchaseOrder Model
- **Total fields**: 38+ fields
- **Indexes**: 7+ indexes for performance
- **Constraints**: 5+ constraints for integrity
- **Features**: Multi-tenant, auto-numbering, status workflow

### Group A Complete
All 18 tasks completed:
- ✅ Django app structure
- ✅ Multi-tenancy registration
- ✅ Status choices
- ✅ Complete model with all fields
- ✅ Performance indexes
- ✅ Data integrity constraints
- ✅ Database migrations

### Next Steps
- **Group B**: Create POLineItem model with pricing and calculation services
- Build upon the PurchaseOrder foundation
- Implement line-item level details

---

## Validation Points

Final validation before proceeding to Group B:
- [ ] All 18 tasks completed
- [ ] PurchaseOrder model complete with 38+ fields
- [ ] Number generator implemented
- [ ] PDF storage configured
- [ ] Indexes added for performance
- [ ] Constraints enforcing integrity
- [ ] Migrations generated and applied
- [ ] Model tested in database
- [ ] Ready for POLineItem creation
