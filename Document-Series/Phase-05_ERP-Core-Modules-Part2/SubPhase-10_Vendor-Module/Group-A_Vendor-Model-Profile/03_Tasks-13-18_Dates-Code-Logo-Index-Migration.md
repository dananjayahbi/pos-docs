# Tasks 13-18: Dates, Code Generator, Logo, Index, Constraints, Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** A - Vendor Model & Profile  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Address-Contact-Terms-Rating.md](02_Tasks-07-12_Address-Contact-Terms-Rating.md)

---

## Document Overview

This document completes the Vendor model by adding timestamp fields, implementing vendor code generation, adding logo upload capability, creating database indexes and constraints, and running initial migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Vendor Date Fields | Medium | 20 min |
| 14 | Create Vendor Code Generator | Medium | 25 min |
| 15 | Add Vendor Logo Field | Low | 15 min |
| 16 | Create Vendor Model Indexes | Medium | 20 min |
| 17 | Create Vendor Model Constraints | Medium | 20 min |
| 18 | Run Initial Vendor Migrations | Low | 15 min |

---

## Task 13: Add Vendor Date Fields

### Overview
Add timestamp and date tracking fields to monitor vendor lifecycle events including creation, updates, and business milestones.

### Dependencies
- Task 12: Add Vendor Rating Fields

### Instructions

1. **Add created_at field**
   - Type: DateTimeField
   - Auto_now_add: True
   - Purpose: Record when vendor was created
   - Immutable after creation

2. **Add updated_at field**
   - Type: DateTimeField
   - Auto_now: True
   - Purpose: Track last modification time
   - Updates automatically on save

3. **Add created_by field**
   - Type: ForeignKey to User
   - On_delete: SET_NULL
   - Null: True
   - Related_name: 'vendors_created'
   - Purpose: Track who created the vendor

4. **Add updated_by field**
   - Type: ForeignKey to User
   - On_delete: SET_NULL
   - Null: True
   - Related_name: 'vendors_updated'
   - Purpose: Track who last modified vendor

5. **Add first_order_date field**
   - Type: DateField
   - Optional: Can be blank and null
   - Purpose: Date of first purchase order
   - Used to calculate vendor relationship age

6. **Add last_order_date field**
   - Type: DateField
   - Optional: Can be blank and null
   - Purpose: Date of most recent order
   - Used to identify inactive vendors

7. **Add approved_at field**
   - Type: DateTimeField
   - Optional: Can be blank and null
   - Purpose: When vendor was approved (status changed to ACTIVE)

8. **Add approved_by field**
   - Type: ForeignKey to User
   - On_delete: SET_NULL
   - Null: True
   - Related_name: 'vendors_approved'
   - Purpose: Who approved the vendor

### Date Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| created_at | DateTimeField | Yes | Creation timestamp |
| updated_at | DateTimeField | Yes | Last update timestamp |
| created_by | ForeignKey(User) | No | Creator user |
| updated_by | ForeignKey(User) | No | Last editor |
| first_order_date | DateField | No | First PO date |
| last_order_date | DateField | No | Last PO date |
| approved_at | DateTimeField | No | Approval timestamp |
| approved_by | ForeignKey(User) | No | Approver user |

### Audit Trail
```
Vendor: ABC Electronics (VND-00001)
Created: 2025-01-15 10:30:00 by John Staff
Updated: 2025-01-20 14:45:00 by Jane Manager
Approved: 2025-01-16 09:00:00 by Jane Manager
First Order: 2025-01-18
Last Order: 2025-12-20
```

### Vendor Lifecycle Timeline
```
Created (PENDING_APPROVAL) → Approved (ACTIVE) → First Order → Last Order
2025-01-15              2025-01-16      2025-01-18   2025-12-20
```

### Inactive Vendor Detection
```
Last order >90 days ago → Consider inactive
Last order >180 days ago → Flag for review
Last order >365 days ago → Suggest archival
```

### Expected Outcome
- Complete audit trail
- Vendor lifecycle tracking
- Activity monitoring capability

### Verification Checklist
- [ ] created_at and updated_at with auto timestamps
- [ ] created_by and updated_by ForeignKeys
- [ ] Order date fields added
- [ ] Approval tracking fields added
- [ ] Related names properly set

---

## Task 14: Create Vendor Code Generator

### Overview
Create a service function to automatically generate unique vendor codes in the format VND-{SEQUENCE} with zero-padding.

### Dependencies
- Task 13: Add Vendor Date Fields

### Instructions

1. **Create code_generator.py file**
   - Create at `apps/vendors/services/code_generator.py`
   - Add module docstring

2. **Import required modules**
   - Import Vendor model
   - Import database transaction support
   - Import F expression for atomic operations

3. **Create generate_vendor_code function**
   - Accept no parameters
   - Return string (vendor code)
   - Use database transaction for thread safety

4. **Find highest existing code**
   - Query vendors ordered by vendor_code descending
   - Extract numeric part from latest code
   - Handle case when no vendors exist (start at 1)

5. **Parse sequence number**
   - Extract digits from code (e.g., "VND-00001" → 1)
   - Increment by 1
   - Handle parsing errors gracefully

6. **Format new code**
   - Format: "VND-{:05d}"
   - Zero-pad to 5 digits
   - Example: VND-00001, VND-00150, VND-01234

7. **Check uniqueness**
   - Query if generated code exists
   - If exists, increment and retry
   - Maximum retry attempts: 10

8. **Return generated code**
   - Return formatted code string
   - Raise exception if unable to generate unique code

9. **Add to Vendor model save method**
   - Override save method
   - If vendor_code is blank, generate automatically
   - Call super().save() after generation

### Code Generation Logic

#### Sequence Extraction
```
VND-00001 → Extract 1 → Next: 2 → Format: VND-00002
VND-00099 → Extract 99 → Next: 100 → Format: VND-00100
VND-09999 → Extract 9999 → Next: 10000 → Format: VND-10000
```

#### Thread Safety
- Use database-level locking
- Atomic transaction per generation
- Handle race conditions
- Retry on uniqueness violation

### Alternative Format (Optional)
```
Type-prefixed codes:
MFR-00001 (Manufacturer)
DIS-00001 (Distributor)
WHS-00001 (Wholesaler)
IMP-00001 (Importer)
SRV-00001 (Service)

Implementation:
prefix = {
    'MANUFACTURER': 'MFR',
    'DISTRIBUTOR': 'DIS',
    'WHOLESALER': 'WHS',
    'IMPORTER': 'IMP',
    'SERVICE': 'SRV',
}[vendor_type]
```

### Generator Service Structure
```python
# Pseudo-structure (not actual code)

def generate_vendor_code():
    # Get last code
    # Extract sequence
    # Increment
    # Format with zero-padding
    # Check uniqueness
    # Return code
    
class Vendor:
    def save(self, *args, **kwargs):
        if not self.vendor_code:
            self.vendor_code = generate_vendor_code()
        super().save(*args, **kwargs)
```

### Error Handling
- Handle empty database (no vendors)
- Handle invalid code format
- Handle uniqueness conflicts
- Raise clear exceptions
- Log generation failures

### Expected Outcome
- Automatic vendor code generation
- Unique codes guaranteed
- Zero-padded sequential format
- Thread-safe implementation

### Verification Checklist
- [ ] code_generator.py created
- [ ] generate_vendor_code function implemented
- [ ] Sequence extraction logic correct
- [ ] Zero-padding format applied
- [ ] Uniqueness check implemented
- [ ] Vendor.save() method overridden
- [ ] Thread safety considered

---

## Task 15: Add Vendor Logo Field

### Overview
Add image field to store vendor logo for branding and visual identification in the system.

### Dependencies
- Task 14: Create Vendor Code Generator

### Instructions

1. **Add logo field to Vendor model**
   - Type: ImageField
   - Upload_to: 'vendors/logos/'
   - Optional: Can be blank and null
   - Purpose: Store vendor company logo

2. **Configure upload path function**
   - Create function to generate dynamic upload path
   - Format: vendors/{vendor_id}/logo.{ext}
   - Overwrite existing logo on update

3. **Add logo_url property**
   - Create property method
   - Return full URL if logo exists
   - Return None or default logo if no logo

4. **Install Pillow dependency**
   - Required for ImageField functionality
   - Add to requirements: Pillow>=10.0.0

### Logo Field Configuration

#### Upload Path Structure
```
media/
└── vendors/
    ├── {vendor_uuid_1}/
    │   └── logo.png
    ├── {vendor_uuid_2}/
    │   └── logo.jpg
    └── {vendor_uuid_3}/
        └── logo.png
```

#### File Naming Function
```python
# Pseudo-code (not actual code)
def vendor_logo_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'vendors/{instance.id}/logo.{ext}'
```

### Image Specifications

#### Recommended Dimensions
- Width: 200-400px
- Height: 200-400px
- Aspect: Square or 16:9
- Format: PNG (transparent) or JPEG

#### File Size
- Maximum: 2MB
- Recommended: <500KB
- Validation in API serializer

### Logo Usage

#### Display Locations
- Vendor list view (thumbnail)
- Vendor detail page (full size)
- Purchase order documents
- Vendor portal (if implemented)
- Reports and exports

#### Default Behavior
- If no logo: Show placeholder or initials
- If logo deleted: Revert to placeholder
- If logo invalid: Skip without error

### Expected Outcome
- Logo upload capability
- Organized file storage
- Branding support
- Visual vendor identification

### Verification Checklist
- [ ] logo ImageField added
- [ ] Upload path configured
- [ ] logo_url property created
- [ ] Pillow dependency noted
- [ ] Upload directory structure planned

---

## Task 16: Create Vendor Model Indexes

### Overview
Create database indexes on frequently queried fields to optimize vendor search and filter operations.

### Dependencies
- Task 15: Add Vendor Logo Field

### Instructions

1. **Open Vendor model Meta class**
   - Locate or create Meta class
   - Add indexes list

2. **Create vendor_code index**
   - Field: vendor_code
   - Unique index (already unique constraint)
   - Primary lookup field

3. **Create company_name index**
   - Field: company_name
   - Used for search and sorting
   - Case-insensitive consideration

4. **Create status index**
   - Field: status
   - Frequently filtered
   - Used in list views

5. **Create vendor_type index**
   - Field: vendor_type
   - Common filter criterion
   - Used in reports

6. **Create composite status-type index**
   - Fields: [status, vendor_type]
   - Optimizes combined filters
   - Common query pattern

7. **Create primary_email index**
   - Field: primary_email
   - Used for search
   - Vendor lookup by email

8. **Create rating index**
   - Field: rating
   - Used for sorting by rating
   - Performance metric queries

9. **Create created_at index**
   - Field: created_at
   - Used for date range filters
   - Chronological sorting

10. **Create is_preferred_vendor index**
    - Field: is_preferred_vendor
    - Filter for preferred vendors
    - Product sourcing queries

### Index Strategy

#### Single-Column Indexes
```
vendor_code     → Lookup by code
company_name    → Search by name
status          → Filter active/inactive
vendor_type     → Filter by type
primary_email   → Lookup by email
rating          → Sort by performance
created_at      → Date range queries
is_preferred_vendor → Preferred filter
```

#### Composite Indexes
```
(status, vendor_type)     → Common combination
(is_preferred_vendor, rating) → Best vendor queries
```

### Query Performance Impact

#### Before Indexing
```
SELECT * FROM vendors WHERE status='ACTIVE' 
→ Full table scan (slow)
```

#### After Indexing
```
SELECT * FROM vendors WHERE status='ACTIVE'
→ Index scan (fast)
```

### Index Considerations

#### Include
- Frequently queried fields
- Foreign key fields
- Sort fields
- Filter fields

#### Exclude
- TextField (notes, internal_notes)
- Rarely queried fields
- Boolean with low selectivity

### Expected Outcome
- Faster vendor queries
- Improved list view performance
- Optimized filtering and sorting

### Verification Checklist
- [ ] All single-column indexes added
- [ ] Composite indexes defined
- [ ] Indexes in Meta.indexes list
- [ ] No over-indexing (too many indexes)

---

## Task 17: Create Vendor Model Constraints

### Overview
Add database-level constraints to enforce data integrity rules and business logic at the database level.

### Dependencies
- Task 16: Create Vendor Model Indexes

### Instructions

1. **Add unique vendor_code constraint**
   - Already handled by unique=True on field
   - Named constraint for clarity
   - Prevents duplicate codes

2. **Add check constraint for rating range**
   - Field: rating
   - Condition: rating >= 0 AND rating <= 5.0
   - Ensures valid rating values

3. **Add check constraint for payment_terms_days**
   - Field: payment_terms_days
   - Condition: payment_terms_days >= 0
   - Prevents negative payment terms

4. **Add check constraint for credit_limit**
   - Field: credit_limit
   - Condition: credit_limit >= 0 OR credit_limit IS NULL
   - Prevents negative credit limits

5. **Add check constraint for lead_time_days**
   - Field: default_lead_time_days
   - Condition: default_lead_time_days >= 0
   - Prevents negative lead times

6. **Add unique constraint for tax_id**
   - Fields: [tax_id]
   - Condition: tax_id IS NOT NULL
   - Allows null but unique if provided
   - Optional: Add country to constraint

7. **Configure Meta.constraints list**
   - Add all CheckConstraint objects
   - Add UniqueConstraint objects
   - Provide clear constraint names

### Constraint Types

#### Unique Constraints
```
vendor_code → Already unique via field
(tax_id) WHERE tax_id IS NOT NULL → Unique tax IDs
```

#### Check Constraints
```
rating BETWEEN 0 AND 5
payment_terms_days >= 0
credit_limit >= 0 OR NULL
default_lead_time_days >= 0
```

### Constraint Names
Use descriptive naming:
```
vendor_rating_range
vendor_payment_terms_positive
vendor_credit_limit_positive
vendor_lead_time_positive
vendor_tax_id_unique
```

### Benefits

#### Data Integrity
- Enforce business rules
- Prevent invalid data
- Database-level validation
- Fail-fast on violations

#### Documentation
- Constraints document rules
- Self-documenting database
- Clear expectations

### Constraint vs Validation

#### Model/Form Validation
- User-friendly messages
- Application-level
- Can be bypassed

#### Database Constraints
- Cannot be bypassed
- Database-level enforcement
- Less friendly error messages
- Backup validation layer

### Expected Outcome
- Strong data integrity
- Business rules enforced
- Invalid data prevented
- Database consistency

### Verification Checklist
- [ ] Rating range constraint added
- [ ] Payment terms constraint added
- [ ] Credit limit constraint added
- [ ] Lead time constraint added
- [ ] Tax ID unique constraint added
- [ ] Constraints in Meta.constraints list
- [ ] Descriptive constraint names used

---

## Task 18: Run Initial Vendor Migrations

### Overview
Generate and apply Django migrations to create the Vendor model table in the database with all fields, indexes, and constraints.

### Dependencies
- Task 17: Create Vendor Model Constraints

### Instructions

1. **Verify model is complete**
   - Review all fields from Tasks 05-15
   - Verify indexes from Task 16
   - Verify constraints from Task 17
   - Check imports and relationships

2. **Make migrations**
   - Run Django makemigrations command
   - Specify vendors app
   - Review generated migration file
   - Verify all fields included

3. **Review migration file**
   - Open generated migration in migrations/
   - Check field definitions
   - Verify indexes and constraints
   - Ensure no missing fields

4. **Test migration (optional)**
   - Apply migration to test database
   - Verify table creation
   - Check indexes created
   - Test constraints work

5. **Apply migrations to development**
   - Run migrate command
   - Apply to current tenant schema
   - Verify successful completion

6. **Verify database table**
   - Check table exists in database
   - Verify columns match model
   - Check indexes created
   - Test constraints

7. **Test model operations**
   - Create test vendor instance
   - Save to database
   - Query and retrieve
   - Update and delete

### Migration Commands

#### Generate Migration
```bash
python manage.py makemigrations vendors
```

#### Review Migration
```bash
python manage.py sqlmigrate vendors 0001
```

#### Apply Migration
```bash
python manage.py migrate vendors
```

#### Check Status
```bash
python manage.py showmigrations vendors
```

### Migration File Structure
```python
# Expected structure (not actual code)
class Migration:
    dependencies = [...]
    
    operations = [
        CreateModel(
            name='Vendor',
            fields=[...],
        ),
        AddIndex(...),
        AddConstraint(...),
    ]
```

### Verification Steps

#### Database Level
- Check table exists: `vendors_vendor`
- Verify column count matches fields
- Check indexes in database
- Verify constraints in database

#### Application Level
- Import Vendor model successfully
- Create vendor instance
- Save without errors
- Query vendors successfully

### Multi-Tenancy Considerations

#### TENANT_APPS Migration
- Creates table in tenant schemas
- Each tenant has separate vendors table
- Run migration for each tenant
- Use tenant-aware commands

#### Migration Across Tenants
```bash
# Migrate all tenants
python manage.py migrate_schemas --shared
python manage.py migrate_schemas
```

### Rollback Plan
If migration fails:
- Run migrate vendors zero
- Fix model issues
- Delete migration file
- Regenerate migration
- Retry

### Expected Outcome
- Vendor model table created
- All fields present in database
- Indexes and constraints applied
- Model operational and tested

### Verification Checklist
- [ ] makemigrations completed successfully
- [ ] Migration file reviewed
- [ ] migrate command successful
- [ ] Database table created
- [ ] All fields present
- [ ] Indexes created
- [ ] Constraints active
- [ ] Test vendor created successfully
- [ ] Model queries work

---

## Notes for AI Agents

### Save Method Override
When overriding save():
- Call generate_vendor_code() before super().save()
- Update updated_by if user provided
- Handle logo cleanup on delete
- Call super().save() at end

### Code Generation Race Conditions
- Use select_for_update() for locking
- Wrap in transaction.atomic()
- Handle IntegrityError on duplicate
- Retry with new sequence

### Logo Management
- Clean up old logo on new upload
- Use storage backend (S3, local)
- Handle missing files gracefully
- Validate file types and sizes

### Index Naming Convention
```
{app}_{model}_{field}_idx
vendors_vendor_status_idx
vendors_vendor_company_name_idx
```

### Constraint Naming Convention
```
{app}_{model}_{constraint_type}_{description}
vendors_vendor_check_rating_range
vendors_vendor_unique_tax_id
```

### Migration Best Practices
- One logical change per migration
- Descriptive migration names
- Test before applying to production
- Keep migrations small
- Document complex migrations

### Performance Optimization
- Index frequently queried fields
- Avoid indexing TEXT fields
- Use composite indexes wisely
- Monitor slow queries
- Adjust indexes based on usage

### Multi-Tenant Migration
- Test on sandbox tenant first
- Backup before production migration
- Plan downtime if needed
- Monitor migration progress
- Have rollback plan ready
