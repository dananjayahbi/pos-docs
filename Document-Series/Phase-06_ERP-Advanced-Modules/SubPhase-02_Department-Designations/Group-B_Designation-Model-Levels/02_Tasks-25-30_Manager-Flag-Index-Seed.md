# Tasks 25-30: Manager Flag, Status, Indexes, and Seed Data

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** B - Designation Model & Levels  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_Model-Core-Level-Salary.md](01_Tasks-17-24_Model-Core-Level-Salary.md)
- **→ Next Group:** [Group-C_Department-Employee-Links](../Group-C_Department-Employee-Links/)

---

## Document Overview

This document completes the Designation model by adding manager identification, status tracking, code generation utilities, database optimization indexes, migration execution, and default designation seed data. These elements finalize the designation system and prepare it for employee assignment.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add Is Manager Flag | Low | 15 min |
| 26 | Add Designation Status | Low | 15 min |
| 27 | Create Designation Code Generator | Medium | 20 min |
| 28 | Create Designation Model Indexes | Medium | 20 min |
| 29 | Run Designation Migrations | Low | 15 min |
| 30 | Create Default Designations Seed | Medium | 25 min |

---

## Task 25: Add Is Manager Flag

### Overview
Add an is_manager boolean field to the Designation model to identify managerial positions. This flag is crucial for access control, approval workflows, and determining which employees can view reports or manage teams.

### Dependencies
- Task 18: Create Designation Model Core
- Task 19: Add Designation Level Field

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add is_manager field**
   - Add BooleanField after the reports_to field
   - Set default=False
   - Add help_text explaining manager privileges

3. **Add field documentation**
   - Document that is_manager should be True for:
     - Levels MANAGER and above (MANAGER, DIRECTOR, EXECUTIVE)
     - Any position with direct reports
     - Positions requiring approval authority

4. **Consider auto-setting logic**
   - Note that manager flag can be auto-determined by level
   - Or explicitly set for special cases
   - Document that explicit setting overrides level-based default

5. **Update __str__ or display methods**
   - Consider showing manager indicator in string representation
   - Example: "Sales Manager (Manager) [M]"

### Manager Flag Determination Logic

```
Manager Flag Decision Flow
═════════════════════════════

Level-Based Auto-Setting:
┌────────────────────────────────┐
│ Level ≥ MANAGER (6)?           │
│   ├─ Yes → is_manager = True   │
│   └─ No  → is_manager = False  │
└────────────────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│ Has Direct Reports?            │
│   └─ Yes → is_manager = True   │
└────────────────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│ Manual Override Available      │
│   (for special positions)      │
└────────────────────────────────┘
```

### Manager Flag Usage Scenarios

| Scenario | Manager Flag | Use Case |
|----------|--------------|----------|
| CEO | True | Executive access, full system control |
| Director | True | Departmental oversight, strategic decisions |
| Manager | True | Team management, approval authority |
| Team Lead | True/False | Optional, may have limited reports |
| Senior Developer | False | Technical expertise, no direct reports |
| Junior Developer | False | Learning role, no management duties |

### Access Control Based on Manager Flag

```
Permission Matrix by Manager Flag
══════════════════════════════════

is_manager = True:
  ✓ View team performance reports
  ✓ Approve leave requests
  ✓ Approve expense claims
  ✓ Access subordinate records
  ✓ Conduct performance reviews
  ✓ View salary information (if authorized)
  ✓ Assign tasks to team members

is_manager = False:
  ✓ View own records
  ✓ Submit leave requests
  ✓ Submit expense claims
  ✗ Cannot approve requests
  ✗ Cannot view team reports
  ✗ Cannot access others' records
```

### Manager Identification Examples

| Designation | Level | Default is_manager | Typical Scenario |
|-------------|-------|-------------------|------------------|
| CEO | EXECUTIVE (8) | True | Top-level management |
| CFO | EXECUTIVE (8) | True | Financial leadership |
| Sales Director | DIRECTOR (7) | True | Regional/departmental head |
| HR Manager | MANAGER (6) | True | Department manager |
| Project Lead | LEAD (5) | True | Small team coordinator |
| Team Lead - Tech | LEAD (5) | True | Technical team leader |
| Team Lead - Individual | LEAD (5) | False | Senior IC without reports |
| Senior Analyst | SENIOR (4) | False | Expert role, no management |
| Developer | MID (3) | False | Individual contributor |

### Expected Outcome
- Clear identification of managerial positions
- Support for role-based access control
- Foundation for approval workflow logic
- Distinction between leadership and IC roles

### Verification Checklist
- [ ] is_manager field added to Designation model
- [ ] BooleanField with default=False
- [ ] help_text added explaining purpose
- [ ] Field placement after reports_to
- [ ] Documentation includes usage scenarios
- [ ] Consider display in __str__ method

---

## Task 26: Add Designation Status

### Overview
Add a status field to the Designation model to track whether a designation is active and available for employee assignment. This allows organizations to retire or temporarily suspend designations without deleting them, preserving historical data.

### Dependencies
- Task 18: Create Designation Model Core
- Constants module exists

### Instructions

1. **Define designation status constants**
   - Open `apps/organization/constants.py`
   - Create DESIGNATION_STATUS section

2. **Define STATUS_ACTIVE constant**
   - Value: 'active'
   - Display: "Active"
   - Default status for new designations

3. **Define STATUS_INACTIVE constant**
   - Value: 'inactive'
   - Display: "Inactive"
   - Used for retired/suspended designations

4. **Create DESIGNATION_STATUSES tuple**
   - Combine status constants into Django choices
   - Format: ((value, display_name), ...)

5. **Add status field to Designation model**
   - Open `apps/organization/models/designation.py`
   - Add CharField with choices=DESIGNATION_STATUSES
   - Set default=STATUS_ACTIVE
   - Max length: 20 characters

6. **Add status field documentation**
   - Document that active designations can be assigned to employees
   - Inactive designations are preserved but cannot be used for new assignments
   - Existing employees with inactive designations retain them

7. **Consider active manager for queryset filtering**
   - Create custom manager or queryset method
   - active() method returns only active designations
   - all_with_inactive() for administrative views

### Designation Status Constants

| Constant | Value | Display Name | Description |
|----------|-------|--------------|-------------|
| STATUS_ACTIVE | 'active' | Active | Available for employee assignment |
| STATUS_INACTIVE | 'inactive' | Inactive | Retired or suspended designation |

### Status Lifecycle

```
Designation Status Lifecycle
═════════════════════════════

New Designation
      │
      ▼
┌─────────────┐
│   ACTIVE    │◄────┐
└─────────────┘     │
      │             │
      │ Retire/     │ Reactivate
      │ Suspend     │
      ▼             │
┌─────────────┐     │
│  INACTIVE   │─────┘
└─────────────┘
      │
      │ (Keep for historical data)
      ▼
┌─────────────────────────────┐
│ Historical Record Preserved │
└─────────────────────────────┘
```

### Status Impact on System Behavior

| Action | Active Designation | Inactive Designation |
|--------|-------------------|---------------------|
| Assign to new employee | ✓ Allowed | ✗ Blocked |
| Update existing assignment | ✓ Allowed | ✓ Allowed (warning) |
| Display in dropdowns | ✓ Shown | ✗ Hidden |
| View in admin panel | ✓ Shown | ✓ Shown (with indicator) |
| Include in reports | ✓ Included | ✓ Included (with filter option) |
| Delete from database | Consider carefully | Consider carefully |

### Inactive Designation Use Cases

#### Organizational Restructuring
```
Before:
  ├── Assistant Manager (ACTIVE)
  └── Regional Supervisor (ACTIVE)

After Restructuring:
  ├── Assistant Manager (INACTIVE) ← Role eliminated
  └── Regional Supervisor (ACTIVE)
  └── Area Manager (ACTIVE) ← New role created
```

#### Temporary Suspension
```
Designation: Field Agent
Status: INACTIVE
Reason: Field operations suspended during restructuring
Plan: Reactivate when field program resumes
```

#### Historical Preservation
```
Employee: John Doe
Original Designation: Sales Representative (INACTIVE)
Current Designation: Sales Manager (ACTIVE)

System preserves:
  - Employee history shows both designations
  - Original designation remains in database
  - Reports can show career progression
```

### Queryset Filter Examples

```
Active Designations Query Pattern
═══════════════════════════════

Basic Filter:
  Designation.objects.filter(status=STATUS_ACTIVE)

Custom Manager Method:
  Designation.objects.active()
  
All Designations (Admin View):
  Designation.objects.all()
  
With Status Annotation:
  Designation.objects.annotate(
      is_available=Case(
          When(status=STATUS_ACTIVE, then=Value(True)),
          default=Value(False)
      )
  )
```

### Expected Outcome
- Flexible designation lifecycle management
- Preservation of historical data
- Controlled designation availability
- Support for organizational changes

### Verification Checklist
- [ ] STATUS_ACTIVE constant defined
- [ ] STATUS_INACTIVE constant defined
- [ ] DESIGNATION_STATUSES tuple created
- [ ] status field added to Designation model
- [ ] CharField with choices and default
- [ ] Field documentation added
- [ ] Consider custom manager methods
- [ ] Dropdown filtering logic planned

---

## Task 27: Create Designation Code Generator

### Overview
Create a utility function or method to automatically generate unique designation codes. Designation codes are short identifiers (e.g., "SE" for Software Engineer, "CEO" for Chief Executive Officer) used for quick reference and system integration.

### Dependencies
- Task 18: Create Designation Model Core
- Service layer structure exists

### Instructions

1. **Create or update code generator service**
   - Navigate to `apps/organization/services/`
   - Open or create `code_generator.py`
   - Add designation code generation section

2. **Define generate_designation_code function**
   - Accept parameters: title (required), department (optional)
   - Return unique designation code string
   - Handle collisions with existing codes

3. **Implement code generation logic**
   - Extract initials from designation title
   - Use first letter of each word
   - Convert to uppercase
   - Example: "Software Engineer" → "SE"

4. **Handle special cases**
   - Single word titles: use first 2-3 characters
     - "Manager" → "MGR"
     - "Director" → "DIR"
   - Common abbreviations: recognize and use standard codes
     - "Chief Executive Officer" → "CEO"
     - "Chief Financial Officer" → "CFO"
   - Remove articles and prepositions ("of", "the", "and")

5. **Implement uniqueness checking**
   - Query existing designation codes
   - If code exists, append numeric suffix
   - Example: "SE" → "SE1", "SE2", etc.

6. **Add department prefix option**
   - If department provided, optionally prefix code
   - Example: "IT-SE" for IT Department Software Engineer
   - Make prefix optional via parameter

7. **Add validation rules**
   - Maximum code length: 10 characters
   - Minimum code length: 2 characters
   - Allowed characters: A-Z, 0-9, hyphen
   - No special characters or spaces

8. **Integrate with Designation model save method**
   - Override save method in Designation model
   - Auto-generate code if not provided
   - Call generate_designation_code function

### Code Generation Algorithm

```
Designation Code Generation Flow
═════════════════════════════════

Input: "Senior Software Engineer"
         │
         ▼
┌──────────────────────────────┐
│ 1. Tokenize Title            │
│    ["Senior", "Software",    │
│     "Engineer"]              │
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 2. Extract Initials          │
│    S + S + E = "SSE"         │
└──────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ 3. Check Uniqueness          │
│    Query: Code = "SSE"       │
└──────────────────────────────┘
         │
         ├─ Not Exists → "SSE"
         │
         └─ Exists
               │
               ▼
         ┌──────────────────────┐
         │ 4. Add Numeric Suffix│
         │    "SSE1", "SSE2"... │
         └──────────────────────┘
```

### Code Generation Examples

| Designation Title | Generated Code | Notes |
|------------------|----------------|-------|
| Software Engineer | SE | Simple two-word initials |
| Senior Software Engineer | SSE | Three-word initials |
| Chief Executive Officer | CEO | Standard abbreviation |
| Manager | MGR | Single word, first 3 chars |
| Director | DIR | Single word abbreviation |
| Human Resources Manager | HRM | Three-word initials |
| Sales Representative | SR | Two-word initials |
| Assistant Manager | AM | Two-word initials |
| Team Lead | TL | Two-word initials |
| Database Administrator | DBA | Standard IT abbreviation |

### Department-Prefixed Codes

```
Department Prefix Examples
══════════════════════════

Without Prefix (default):
  Software Engineer → "SE"
  Manager → "MGR"

With IT Department Prefix:
  Software Engineer → "IT-SE"
  Manager → "IT-MGR"

With Sales Department Prefix:
  Sales Representative → "SAL-SR"
  Manager → "SAL-MGR"

With HR Department Prefix:
  HR Manager → "HR-MGR"
  HR Assistant → "HR-AST"
```

### Collision Resolution Strategy

```
Handling Duplicate Codes
═════════════════════════

Scenario: Multiple "Software Engineer" designations

Attempt 1: "SE"
  └─ Exists? No → Use "SE"

New designation with same title:
Attempt 1: "SE"
  └─ Exists? Yes
       └─ Try "SE1"
           └─ Exists? No → Use "SE1"

Another new designation:
Attempt 1: "SE"
  └─ Exists? Yes
       └─ Try "SE1"
           └─ Exists? Yes
                └─ Try "SE2"
                    └─ Exists? No → Use "SE2"
```

### Special Abbreviation Dictionary

| Full Title | Standard Code | Category |
|-----------|---------------|----------|
| Chief Executive Officer | CEO | C-Level |
| Chief Operating Officer | COO | C-Level |
| Chief Financial Officer | CFO | C-Level |
| Chief Technology Officer | CTO | C-Level |
| Chief Information Officer | CIO | C-Level |
| Vice President | VP | Executive |
| Senior Vice President | SVP | Executive |
| Human Resources | HR | Department |
| Information Technology | IT | Department |
| Quality Assurance | QA | Department |
| Business Development | BD | Department |

### Code Generator Function Signature

```
Function: generate_designation_code
═══════════════════════════════════

Parameters:
  - title: str (required)
      The designation title to generate code from
  
  - department: Department | None (optional)
      If provided, can be used for prefix
  
  - use_department_prefix: bool (default=False)
      Whether to include department prefix
  
  - tenant: Tenant (required for multi-tenancy)
      Ensures code uniqueness within tenant

Returns:
  - str: Generated unique designation code

Raises:
  - ValueError: If title is empty or invalid
  - ValueError: If generated code exceeds max length
```

### Expected Outcome
- Automatic code generation for designations
- Unique, readable designation identifiers
- Collision-free code assignment
- Optional department prefixing
- Integration with Designation model

### Verification Checklist
- [ ] code_generator.py file created/updated
- [ ] generate_designation_code function defined
- [ ] Initial extraction logic implemented
- [ ] Special abbreviation handling added
- [ ] Uniqueness checking implemented
- [ ] Numeric suffix collision resolution
- [ ] Department prefix support (optional)
- [ ] Code validation rules enforced
- [ ] Integration with Designation.save() method
- [ ] Function tested with various inputs

---

## Task 28: Create Designation Model Indexes

### Overview
Add database indexes to the Designation model to optimize query performance. Proper indexing is critical for fast designation lookups, filtering by level or department, and retrieving active designations.

### Dependencies
- Task 18: Create Designation Model Core
- Task 19: Add Designation Level Field
- Task 21: Add Designation Department FK
- Task 26: Add Designation Status

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Meta class in Designation model

2. **Add indexes list to Meta class**
   - Create indexes attribute
   - Use Django's models.Index for each index

3. **Create title index**
   - Index on title field
   - Purpose: Fast designation search by name
   - Consider case-insensitive search needs

4. **Create code index**
   - Index on code field (unique)
   - Purpose: Quick lookup by designation code
   - Essential for code-based retrieval

5. **Create level index**
   - Index on level field
   - Purpose: Filter designations by seniority level
   - Used in hierarchy queries

6. **Create status index**
   - Index on status field
   - Purpose: Fast filtering of active designations
   - Critical for dropdown population

7. **Create composite index: tenant + status**
   - Multi-column index on (tenant, status)
   - Purpose: Optimize active designation queries per tenant
   - Most common query pattern

8. **Create composite index: tenant + level**
   - Multi-column index on (tenant, level)
   - Purpose: Level-based filtering within tenant
   - Used in organizational charts

9. **Create composite index: department + status**
   - Multi-column index on (department, status)
   - Purpose: Department-specific active designations
   - Used in department management views

10. **Add index name conventions**
    - Use descriptive index names
    - Format: "idx_designation_<field_names>"
    - Example: "idx_designation_tenant_status"

11. **Document index purposes**
    - Add comments explaining each index
    - Note expected query patterns
    - Specify estimated usage frequency

### Database Index Structure

```
Designation Model Indexes
══════════════════════════

Single-Column Indexes:
┌──────────────────────────────┐
│ title (text search)          │
│ code (unique lookup)         │
│ level (hierarchy filter)     │
│ status (active filter)       │
└──────────────────────────────┘

Multi-Column Indexes:
┌──────────────────────────────┐
│ (tenant, status)             │ ← Most frequent
│ (tenant, level)              │
│ (department, status)         │
└──────────────────────────────┘
```

### Index Usage Scenarios

| Query Pattern | Index Used | Frequency | Purpose |
|---------------|------------|-----------|---------|
| List active designations for tenant | (tenant, status) | Very High | Dropdown population |
| Search designation by title | title | High | Admin search |
| Lookup designation by code | code | High | System integration |
| Filter by seniority level | (tenant, level) | Medium | Organizational hierarchy |
| Department designations | (department, status) | Medium | Department views |
| Check code uniqueness | code | High | Code generation |

### Query Performance Impact

```
Query Performance Comparison
═════════════════════════════

Without Indexes:
  Query: Get active designations for tenant
  Method: Full table scan
  Time: O(n) - scans all rows
  Example: 10,000 rows → ~100ms

With (tenant, status) Index:
  Query: Get active designations for tenant
  Method: Index seek
  Time: O(log n) - binary search
  Example: 10,000 rows → ~5ms
  
Performance Gain: 20x faster ✓
```

### Index Selection Rationale

#### High Priority Indexes

**1. (tenant, status) Composite Index**
```
Usage: Most frequent query
Pattern: WHERE tenant_id = ? AND status = 'active'
Example: Load active designations dropdown
Frequency: Every page with designation selector
Impact: Critical for user experience
```

**2. code Unique Index**
```
Usage: Code-based lookups and uniqueness check
Pattern: WHERE code = ?
Example: Lookup designation by code
Frequency: Code generation, API calls
Impact: Essential for data integrity
```

**3. title Index**
```
Usage: Search and admin filtering
Pattern: WHERE title LIKE '%search%'
Example: Admin panel designation search
Frequency: Admin operations
Impact: Improves admin UX
```

#### Medium Priority Indexes

**4. (tenant, level) Composite Index**
```
Usage: Level-based filtering
Pattern: WHERE tenant_id = ? AND level = ?
Example: List all MANAGER level designations
Frequency: Organizational charts, reports
Impact: Faster hierarchy operations
```

**5. (department, status) Composite Index**
```
Usage: Department-specific queries
Pattern: WHERE department_id = ? AND status = 'active'
Example: Show designations for IT department
Frequency: Department management views
Impact: Speeds up department operations
```

### Index Naming Convention

```
Index Naming Pattern
════════════════════

Format: idx_{model}_{field1}_{field2}

Examples:
  idx_designation_title
  idx_designation_code
  idx_designation_tenant_status
  idx_designation_tenant_level
  idx_designation_department_status
```

### Index Maintenance Considerations

| Aspect | Consideration |
|--------|---------------|
| Write Performance | More indexes = slower inserts/updates |
| Storage Space | Each index consumes disk space |
| Index Size | Monitor index size growth |
| Maintenance | Automatic with Django migrations |
| Monitoring | Check slow query logs |
| Optimization | Remove unused indexes |

### Expected Index Sizes

```
Estimated Index Sizes (1000 designations)
═══════════════════════════════════════

Single-Column Indexes:
  title:    ~50 KB
  code:     ~20 KB
  level:    ~15 KB
  status:   ~10 KB

Composite Indexes:
  (tenant, status):      ~30 KB
  (tenant, level):       ~35 KB
  (department, status):  ~30 KB

Total Additional Storage: ~190 KB per 1000 rows
```

### Expected Outcome
- Optimized designation query performance
- Fast active designation retrieval
- Efficient code-based lookups
- Improved admin panel responsiveness
- Scalable database design

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] title index created
- [ ] code index created (unique)
- [ ] level index created
- [ ] status index created
- [ ] (tenant, status) composite index created
- [ ] (tenant, level) composite index created
- [ ] (department, status) composite index created
- [ ] Index names follow convention
- [ ] Index purposes documented
- [ ] Performance impact documented

---

## Task 29: Run Designation Migrations

### Overview
Generate and apply Django migrations for the Designation model and all related changes. This task creates the database schema for designations, including all fields, constraints, and indexes defined in previous tasks.

### Dependencies
- Task 18: Create Designation Model Core
- Task 19: Add Designation Level Field
- Task 20: Add Designation Description
- Task 21: Add Designation Department FK
- Task 22: Add Salary Range Fields
- Task 23: Add Designation Requirements
- Task 24: Add Reports To Field
- Task 25: Add Is Manager Flag
- Task 26: Add Designation Status
- Task 28: Create Designation Model Indexes

### Instructions

1. **Verify model completion**
   - Ensure all fields from Tasks 18-26 are added
   - Check that Meta class includes indexes
   - Verify all ForeignKey relationships
   - Confirm field validations are in place

2. **Check for migration conflicts**
   - Review existing migrations in `apps/organization/migrations/`
   - Ensure no pending migrations from previous tasks
   - Resolve any conflicts before proceeding

3. **Generate migrations**
   - Run makemigrations command for organization app
   - Django will detect Designation model changes
   - Review generated migration file

4. **Review migration file**
   - Open generated migration file (e.g., `0002_designation.py`)
   - Verify all fields are included
   - Check index creation statements
   - Ensure ForeignKey constraints are correct

5. **Add migration dependencies**
   - Verify migration depends on previous migration
   - Ensure tenant migration dependency if needed
   - Check Department model dependency

6. **Validate migration**
   - Use showmigrations command to check status
   - Verify migration is in pending state
   - Check for any warnings or errors

7. **Apply migration**
   - Run migrate command
   - Apply to development database
   - Monitor for errors or warnings

8. **Verify database schema**
   - Connect to database
   - Check designation table exists
   - Verify all columns are created
   - Confirm indexes are applied
   - Check foreign key constraints

9. **Test rollback capability**
   - Test migration rollback in dev environment
   - Ensure clean rollback without data loss
   - Re-apply migration after test

10. **Document migration**
    - Note migration file name
    - Document any manual steps required
    - Record any database-specific considerations

### Migration Generation Process

```
Migration Workflow
══════════════════

1. Model Definition Complete
         │
         ▼
2. Run makemigrations
   $ python manage.py makemigrations organization
         │
         ▼
3. Review Generated File
   apps/organization/migrations/0002_designation.py
         │
         ▼
4. Check Migration Plan
   $ python manage.py showmigrations organization
         │
         ▼
5. Apply Migration
   $ python manage.py migrate organization
         │
         ▼
6. Verify Schema
   - Check database
   - Verify tables and indexes
         │
         ▼
7. Migration Complete ✓
```

### Expected Migration Operations

| Operation | Description | SQL Command Type |
|-----------|-------------|------------------|
| Create Table | Create designation table | CREATE TABLE |
| Add Columns | Add all model fields | ALTER TABLE (in create) |
| Create Indexes | Add performance indexes | CREATE INDEX |
| Add FK Constraints | Link to tenant, department | ALTER TABLE ADD CONSTRAINT |
| Add Unique Constraints | Ensure code uniqueness | ALTER TABLE ADD CONSTRAINT |
| Set Defaults | Set default values | ALTER TABLE ALTER COLUMN |

### Migration File Structure

```
Migration File: 0002_designation.py
════════════════════════════════════

class Migration(migrations.Migration):
    
    dependencies = [
        ('organization', '0001_department'),
        ('tenants', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Designation',
            fields=[
                # Core fields
                id, title, code, level,
                description, responsibilities,
                
                # Financial fields
                min_salary, max_salary, currency,
                
                # Requirements
                qualifications, experience_years,
                
                # Relationships
                tenant, department, reports_to,
                
                # Status fields
                is_manager, status,
                
                # Timestamps
                created_at, updated_at
            ],
        ),
        
        migrations.AddIndex(...),  # title index
        migrations.AddIndex(...),  # code index
        migrations.AddIndex(...),  # level index
        migrations.AddIndex(...),  # composite indexes
    ]
```

### Database Schema Verification

```
Post-Migration Database Check
══════════════════════════════

Table: organization_designation

Columns:
  ✓ id (UUID/BigInt)
  ✓ tenant_id (FK)
  ✓ title (VARCHAR)
  ✓ code (VARCHAR, UNIQUE)
  ✓ level (VARCHAR)
  ✓ description (TEXT)
  ✓ responsibilities (TEXT)
  ✓ department_id (FK, NULL)
  ✓ min_salary (DECIMAL)
  ✓ max_salary (DECIMAL)
  ✓ currency (VARCHAR)
  ✓ qualifications (TEXT)
  ✓ experience_years (INT)
  ✓ reports_to_id (FK, NULL)
  ✓ is_manager (BOOLEAN)
  ✓ status (VARCHAR)
  ✓ created_at (TIMESTAMP)
  ✓ updated_at (TIMESTAMP)

Indexes:
  ✓ PRIMARY KEY (id)
  ✓ idx_designation_title
  ✓ idx_designation_code (UNIQUE)
  ✓ idx_designation_level
  ✓ idx_designation_status
  ✓ idx_designation_tenant_status
  ✓ idx_designation_tenant_level
  ✓ idx_designation_department_status

Foreign Keys:
  ✓ FK to tenants_tenant (tenant_id)
  ✓ FK to organization_department (department_id)
  ✓ FK to organization_designation (reports_to_id)
```

### Migration Commands Reference

```bash
# Generate migrations
python manage.py makemigrations organization

# Show migration status
python manage.py showmigrations organization

# Show SQL for migration (review before applying)
python manage.py sqlmigrate organization 0002

# Apply migrations
python manage.py migrate organization

# Apply specific migration
python manage.py migrate organization 0002

# Rollback to previous migration (testing only)
python manage.py migrate organization 0001

# Re-apply after rollback
python manage.py migrate organization 0002
```

### Common Migration Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| ForeignKey dependency error | Missing related model migration | Add dependency to migration file |
| Column default required | Non-nullable field added to existing data | Add default value or allow null |
| Index name too long | Database name limit (63 chars PostgreSQL) | Shorten index name |
| Unique constraint violation | Duplicate data exists | Clean data or change constraint |
| Migration conflicts | Parallel development | Merge migrations or recreate |

### Rollback Strategy

```
Migration Rollback Plan
════════════════════════

Development Environment:
  → Safe to rollback and re-apply
  → No data loss concern
  → Test rollback capability

Staging Environment:
  → Rollback possible if no data seeded
  → Backup before migration
  → Test rollback procedure

Production Environment:
  → Avoid rollback if possible
  → Always backup before migration
  → Plan forward-fix migrations
  → Document rollback procedure
```

### Expected Outcome
- Designation table created in database
- All fields properly defined
- Indexes created and active
- Foreign key relationships established
- Migration tracked in django_migrations table
- Clean rollback capability verified

### Verification Checklist
- [ ] All model fields added (Tasks 18-26)
- [ ] Indexes defined in Meta class
- [ ] Migration conflicts resolved
- [ ] makemigrations executed successfully
- [ ] Migration file reviewed
- [ ] Migration dependencies verified
- [ ] migrate command executed successfully
- [ ] Database schema verified
- [ ] All columns exist with correct types
- [ ] All indexes created
- [ ] Foreign keys established
- [ ] Rollback tested (dev only)
- [ ] Migration documented

---

## Task 30: Create Default Designations Seed

### Overview
Create a Django management command to seed the database with default designations. This provides a standard set of designations that organizations can use immediately, covering common roles from entry-level to executive positions.

### Dependencies
- Task 29: Run Designation Migrations
- Task 17: Define DesignationLevel Choices
- Task 26: Add Designation Status

### Instructions

1. **Create management command directory structure**
   - Navigate to `apps/organization/`
   - Create `management/` directory if not exists
   - Create `management/commands/` directory
   - Add `__init__.py` files to each directory

2. **Create seed_designations.py command file**
   - Create file in `management/commands/`
   - Import Django Command base class
   - Import Designation model and constants

3. **Define Command class**
   - Inherit from BaseCommand
   - Add help text describing command purpose
   - Support tenant-specific seeding

4. **Add command arguments**
   - Add optional `--tenant` argument for specific tenant
   - Add `--clear` flag to clear existing data
   - Add `--update` flag to update existing designations

5. **Define default designations data structure**
   - Create list or dictionary of default designations
   - Include all standard positions
   - Cover all designation levels

6. **Define executive level designations**
   - Chief Executive Officer (CEO)
   - Chief Operating Officer (COO)
   - Chief Financial Officer (CFO)
   - Chief Technology Officer (CTO)

7. **Define director level designations**
   - Director of Operations
   - Director of Sales
   - Director of Human Resources
   - Director of Information Technology

8. **Define manager level designations**
   - Manager
   - HR Manager
   - Finance Manager
   - IT Manager
   - Sales Manager

9. **Define lead level designations**
   - Team Lead
   - Project Lead
   - Technical Lead

10. **Define senior level designations**
    - Senior Developer
    - Senior Analyst
    - Senior Associate

11. **Define mid level designations**
    - Developer
    - Analyst
    - Associate
    - Specialist

12. **Define junior level designations**
    - Junior Developer
    - Junior Analyst
    - Junior Associate

13. **Define entry level designations**
    - Trainee
    - Intern
    - Graduate Trainee

14. **Add designation metadata**
    - Description for each designation
    - Typical responsibilities
    - Suggested salary ranges
    - Experience requirements

15. **Implement seeding logic**
    - Iterate through default designations
    - Check if designation exists (by code)
    - Create or update designation records
    - Set appropriate level and status

16. **Add progress reporting**
    - Print progress messages
    - Report created/updated counts
    - Show any errors or warnings
    - Display summary at completion

17. **Add error handling**
    - Handle duplicate code errors
    - Catch validation errors
    - Report problematic entries
    - Continue on non-critical errors

18. **Test command execution**
    - Run command in development
    - Verify all designations created
    - Check data integrity
    - Test idempotency (safe to re-run)

### Default Designations Structure

```
Standard Designation Hierarchy
═══════════════════════════════

EXECUTIVE (Level 8)
├── CEO  - Chief Executive Officer
├── COO  - Chief Operating Officer
├── CFO  - Chief Financial Officer
└── CTO  - Chief Technology Officer

DIRECTOR (Level 7)
├── DIR  - Director
├── OPD  - Operations Director
├── SD   - Sales Director
└── ITD  - IT Director

MANAGER (Level 6)
├── MGR  - Manager
├── HRM  - HR Manager
├── FM   - Finance Manager
├── ITM  - IT Manager
└── SM   - Sales Manager

LEAD (Level 5)
├── TL   - Team Lead
├── PL   - Project Lead
└── TLD  - Technical Lead

SENIOR (Level 4)
├── SDE  - Senior Developer
├── SA   - Senior Analyst
└── SSA  - Senior Associate

MID (Level 3)
├── DEV  - Developer
├── ANL  - Analyst
├── ASSOC- Associate
└── SPEC - Specialist

JUNIOR (Level 2)
├── JDE  - Junior Developer
├── JA   - Junior Analyst
└── JAS  - Junior Associate

ENTRY (Level 1)
├── TRN  - Trainee
├── INT  - Intern
└── GT   - Graduate Trainee
```

### Default Designation Details

| Code | Title | Level | is_manager | Min Salary (LKR) | Max Salary (LKR) | Exp (years) |
|------|-------|-------|------------|------------------|------------------|-------------|
| CEO | Chief Executive Officer | EXECUTIVE | True | 500,000 | 1,500,000 | 15+ |
| COO | Chief Operating Officer | EXECUTIVE | True | 400,000 | 1,200,000 | 15+ |
| CFO | Chief Financial Officer | EXECUTIVE | True | 400,000 | 1,200,000 | 15+ |
| CTO | Chief Technology Officer | EXECUTIVE | True | 400,000 | 1,200,000 | 15+ |
| DIR | Director | DIRECTOR | True | 250,000 | 600,000 | 12+ |
| OPD | Operations Director | DIRECTOR | True | 250,000 | 600,000 | 12+ |
| SD | Sales Director | DIRECTOR | True | 250,000 | 600,000 | 10+ |
| ITD | IT Director | DIRECTOR | True | 250,000 | 600,000 | 10+ |
| MGR | Manager | MANAGER | True | 150,000 | 350,000 | 8+ |
| HRM | HR Manager | MANAGER | True | 150,000 | 350,000 | 8+ |
| FM | Finance Manager | MANAGER | True | 150,000 | 350,000 | 8+ |
| ITM | IT Manager | MANAGER | True | 150,000 | 350,000 | 8+ |
| SM | Sales Manager | MANAGER | True | 150,000 | 350,000 | 8+ |
| TL | Team Lead | LEAD | True | 100,000 | 200,000 | 5+ |
| PL | Project Lead | LEAD | True | 100,000 | 200,000 | 5+ |
| TLD | Technical Lead | LEAD | True | 100,000 | 200,000 | 5+ |
| SDE | Senior Developer | SENIOR | False | 80,000 | 150,000 | 4+ |
| SA | Senior Analyst | SENIOR | False | 80,000 | 150,000 | 4+ |
| SSA | Senior Associate | SENIOR | False | 80,000 | 150,000 | 4+ |
| DEV | Developer | MID | False | 60,000 | 100,000 | 2+ |
| ANL | Analyst | MID | False | 60,000 | 100,000 | 2+ |
| ASSOC | Associate | MID | False | 60,000 | 100,000 | 2+ |
| SPEC | Specialist | MID | False | 60,000 | 100,000 | 2+ |
| JDE | Junior Developer | JUNIOR | False | 40,000 | 70,000 | 0-2 |
| JA | Junior Analyst | JUNIOR | False | 40,000 | 70,000 | 0-2 |
| JAS | Junior Associate | JUNIOR | False | 40,000 | 70,000 | 0-2 |
| TRN | Trainee | ENTRY | False | 25,000 | 45,000 | 0 |
| INT | Intern | ENTRY | False | 20,000 | 35,000 | 0 |
| GT | Graduate Trainee | ENTRY | False | 30,000 | 50,000 | 0 |

### Management Command Structure

```
Command: seed_designations
═══════════════════════════

Usage:
  python manage.py seed_designations
  python manage.py seed_designations --tenant=<tenant_id>
  python manage.py seed_designations --clear
  python manage.py seed_designations --update

Options:
  --tenant <id>   Seed for specific tenant only
  --clear         Clear existing designations before seeding
  --update        Update existing designations with new data

Output:
  Creating default designations...
  ✓ Created: CEO - Chief Executive Officer
  ✓ Created: COO - Chief Operating Officer
  ✓ Created: CFO - Chief Financial Officer
  ...
  ✓ Updated: Manager (existing designation)
  
  Summary:
  --------
  Created: 25 designations
  Updated: 3 designations
  Skipped: 2 designations
  Errors:  0
  
  Seeding complete!
```

### Seeding Logic Flow

```
Designation Seeding Process
════════════════════════════

For each default designation:
         │
         ▼
┌───────────────────────────┐
│ Check if exists by code   │
└───────────────────────────┘
         │
         ├─ Not Exists
         │      │
         │      ▼
         │  ┌──────────────────┐
         │  │ Create new       │
         │  │ Set all fields   │
         │  └──────────────────┘
         │
         └─ Exists
                │
                ▼
            ┌──────────────────┐
            │ Update mode?     │
            ├─ Yes → Update    │
            └─ No  → Skip      │
                └──────────────┘
                    │
                    ▼
              ┌──────────────┐
              │ Report status│
              └──────────────┘
```

### Sample Designation Data Entry

```python
Default Designation Example Structure
═════════════════════════════════════

{
    'code': 'CEO',
    'title': 'Chief Executive Officer',
    'level': DesignationLevel.EXECUTIVE,
    'is_manager': True,
    'status': STATUS_ACTIVE,
    'description': 'Highest executive position responsible for overall company strategy and operations',
    'responsibilities': '''
        - Set company vision and strategy
        - Oversee all operations and business activities
        - Report to Board of Directors
        - Make major corporate decisions
        - Manage overall resources and operations
    ''',
    'min_salary': Decimal('500000.00'),
    'max_salary': Decimal('1500000.00'),
    'currency': 'LKR',
    'experience_years': 15,
    'qualifications': 'MBA or equivalent, extensive leadership experience'
}
```

### Command Implementation Checklist

```
Seed Command Components
════════════════════════

Structure:
  ✓ Command class inheriting BaseCommand
  ✓ help text describing purpose
  ✓ add_arguments method for options

Arguments:
  ✓ --tenant (optional, specific tenant)
  ✓ --clear (clear existing data)
  ✓ --update (update existing records)

Data:
  ✓ Default designations list/dict
  ✓ All designation levels covered
  ✓ Complete field data for each

Logic:
  ✓ Check for existing designations
  ✓ Create new designations
  ✓ Update existing (if --update)
  ✓ Skip duplicates (if no --update)

Reporting:
  ✓ Progress messages per designation
  ✓ Created count
  ✓ Updated count
  ✓ Skipped count
  ✓ Error count
  ✓ Final summary

Error Handling:
  ✓ Duplicate code handling
  ✓ Validation errors
  ✓ Database errors
  ✓ Continue on non-critical errors
```

### Expected Outcome
- Management command for seeding designations
- Comprehensive set of default designations
- All designation levels covered
- Idempotent execution (safe to re-run)
- Progress reporting and error handling
- Flexible tenant-specific seeding

### Verification Checklist
- [ ] management/commands/ directory structure created
- [ ] seed_designations.py command file created
- [ ] Command class defined
- [ ] Command arguments added (--tenant, --clear, --update)
- [ ] Default designations data structure defined
- [ ] Executive level designations defined (4)
- [ ] Director level designations defined (4)
- [ ] Manager level designations defined (5)
- [ ] Lead level designations defined (3)
- [ ] Senior level designations defined (3)
- [ ] Mid level designations defined (4)
- [ ] Junior level designations defined (3)
- [ ] Entry level designations defined (3)
- [ ] Complete metadata for each designation
- [ ] Seeding logic implemented
- [ ] Existence check by code
- [ ] Create/update logic
- [ ] Progress reporting added
- [ ] Error handling implemented
- [ ] Command tested in development
- [ ] All 29 default designations created
- [ ] Data integrity verified
- [ ] Idempotency tested

---

## Group Completion Summary

### What We Accomplished

This document completed the Designation model implementation by adding:

1. **Manager Identification** - is_manager flag for access control and approval workflows
2. **Status Tracking** - Active/inactive status for designation lifecycle management
3. **Code Generation** - Automatic generation of unique designation codes with collision handling
4. **Database Optimization** - Strategic indexes for fast queries and filtering
5. **Schema Migration** - Applied all model changes to database with rollback capability
6. **Default Data** - Comprehensive seed command with 29 standard designations

### Technical Assets Created

| Asset | Location | Purpose |
|-------|----------|---------|
| is_manager field | `models/designation.py` | Manager flag |
| status field | `models/designation.py` | Status tracking |
| Code generator | `services/code_generator.py` | Generate unique codes |
| Database indexes | `models/designation.py` Meta | Query optimization |
| Migration file | `migrations/0002_designation.py` | Schema changes |
| Seed command | `management/commands/seed_designations.py` | Default data |

### Model State After Group B

```
Designation Model - Complete Structure
═══════════════════════════════════════

Core Identity:
  ✓ title (CharField)
  ✓ code (CharField, unique, auto-generated)
  ✓ level (DesignationLevel choice)

Description & Responsibilities:
  ✓ description (TextField)
  ✓ responsibilities (TextField)

Financial:
  ✓ min_salary (DecimalField)
  ✓ max_salary (DecimalField)
  ✓ currency (CharField)

Requirements:
  ✓ qualifications (TextField)
  ✓ experience_years (IntegerField)

Relationships:
  ✓ tenant (ForeignKey)
  ✓ department (ForeignKey, nullable)
  ✓ reports_to (ForeignKey to self, nullable)

Status & Access:
  ✓ is_manager (BooleanField)
  ✓ status (CharField with choices)

Optimization:
  ✓ 7 database indexes
  ✓ Composite indexes for common queries

Utilities:
  ✓ Code generator service
  ✓ Seed command with 29 defaults
```

### Ready for Next Group

The Designation model is now complete and ready for:
- Employee assignment (Group C)
- Department-designation linking
- Organizational hierarchy building
- Reporting structure implementation

---

## Next Steps

→ **Proceed to Group C:** [Department-Employee Links](../Group-C_Department-Employee-Links/)

Group C will connect employees to departments and designations, completing the organizational structure foundation.
