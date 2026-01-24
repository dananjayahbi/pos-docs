# Tasks 09-16: Manager, Location, Budget, and Indexes

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** A - Department Model & Hierarchy  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_App-Setup-MPTT-Core.md](01_Tasks-01-08_App-Setup-MPTT-Core.md)
- **→ Next Group:** [Group B: Designation Model & Levels](../../Group-B_Designation-Model-Levels/)

---

## Document Overview

This document completes the Department model by adding manager assignment, location details, contact information, cost center tracking, budget fields, department code generation utilities, performance indexes, and initial migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Add Department Manager FK | Medium | 20 min |
| 10 | Add Department Location | Low | 15 min |
| 11 | Add Department Contact | Low | 15 min |
| 12 | Add Cost Center Field | Low | 15 min |
| 13 | Add Budget Fields | Medium | 20 min |
| 14 | Create Department Code Generator | Medium | 25 min |
| 15 | Create Department Model Indexes | Medium | 20 min |
| 16 | Run Initial Department Migrations | Low | 15 min |

---

## Task 09: Add Department Manager FK

### Overview
Add a foreign key relationship to the Employee model to designate a department manager. This establishes leadership hierarchy and enables manager-based queries and reporting.

### Dependencies
- Task 05: Create Department Model Core
- Employee model must exist (from HR module)

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add manager foreign key field**
   - ForeignKey pointing to Employee model
   - Optional field (null=True, blank=True)
   - Set appropriate on_delete behavior
   - Add related_name for reverse queries

3. **Configure on_delete behavior**
   - Use SET_NULL for on_delete
   - When employee is deleted, manager field becomes null
   - Prevents department deletion when manager leaves
   - Allows reassignment of manager

4. **Set related_name**
   - Use 'managed_departments' or similar
   - Enables accessing departments from employee
   - Example: employee.managed_departments.all()

5. **Add help_text**
   - Explain manager role
   - Note: optional field

### Manager Field Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Field Type | ForeignKey('employees.Employee') | Links to Employee |
| Null | True | Not all departments have managers |
| Blank | True | Optional in forms |
| on_delete | SET_NULL | Preserve department if manager leaves |
| related_name | 'managed_departments' | Reverse relationship |

### Manager Role in Department

#### Responsibilities:
- Department leadership
- Resource allocation
- Performance oversight
- Strategic planning
- Employee supervision
- Budget management

#### Manager Assignment:
- Can be assigned to department manager
- May manage multiple departments
- Not required for all departments
- Can be changed over time

### Manager-Department Relationships

#### One Manager, One Department:
```
Manager: John Smith
Department: Sales Department
```

#### One Manager, Multiple Departments:
```
Manager: Jane Doe
Departments:
  - Marketing Department
  - Communications Department
```

#### Department Without Manager:
```
Department: Archive Department
Manager: (none) - temporary vacancy
```

### Manager Validation Considerations

#### Business Rules:
- Manager should be active employee
- Manager should have appropriate role/designation
- Manager cannot manage themselves (circular reference check)
- Manager should belong to same or parent department (optional rule)

#### Future Enhancements:
- Manager approval workflows
- Manager transition history
- Acting manager support
- Manager hierarchy validation

### Expected Outcome
- Manager assignment capability
- Foundation for leadership hierarchy
- Support for manager-based reporting

### Verification Checklist
- [ ] manager field added as ForeignKey
- [ ] Field points to Employee model
- [ ] Field allows null and blank
- [ ] on_delete set to SET_NULL
- [ ] related_name set appropriately
- [ ] help_text added

---

## Task 10: Add Department Location

### Overview
Add location-related fields to track the physical location of a department including location name, building, and floor information. This supports space management and employee navigation.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add location field**
   - CharField for location name
   - Max length: 100 characters
   - Optional field (null=True, blank=True)
   - Examples: "Head Office", "Colombo Branch"

3. **Add building field**
   - CharField for building name or number
   - Max length: 50 characters
   - Optional field (null=True, blank=True)
   - Examples: "Building A", "North Tower"

4. **Add floor field**
   - CharField for floor information
   - Max length: 20 characters
   - Optional field (null=True, blank=True)
   - Examples: "3rd Floor", "Ground Level"

### Location Field Details

| Field | Type | Max Length | Purpose |
|-------|------|------------|---------|
| location | CharField | 100 | Location/campus name |
| building | CharField | 50 | Building identifier |
| floor | CharField | 20 | Floor information |

### Location Field Usage

#### Location Field:
- Campus or site name
- Main office location
- Branch identifier
- City or area
- Used for high-level grouping

Examples:
- "Colombo Head Office"
- "Kandy Regional Office"
- "Galle Branch"
- "Warehouse - Kaduwela"

#### Building Field:
- Building name or number
- Tower identifier
- Facility name
- Used when location has multiple buildings

Examples:
- "Building A"
- "North Tower"
- "Main Building"
- "Annex"

#### Floor Field:
- Floor number or name
- Level identifier
- Wing or section
- Helps employees find department

Examples:
- "3rd Floor"
- "Ground Level"
- "Basement"
- "Mezzanine"
- "Floor 3, West Wing"

### Location Information Structure

#### Complete Location Example:
```
Department: Finance
Location: Colombo Head Office
Building: Tower A
Floor: 5th Floor
```

#### Partial Location Example:
```
Department: Sales
Location: Galle Branch
Building: (not applicable)
Floor: Ground Floor
```

#### Virtual Department:
```
Department: Remote Operations
Location: (none) - distributed team
Building: (none)
Floor: (none)
```

### Location Benefits

#### Employee Navigation:
- Find department physical location
- Navigate to department office
- Plan meeting locations
- Visitor directions

#### Space Management:
- Track space utilization
- Plan relocations
- Facility management
- Emergency procedures

#### Reporting:
- Departments by location
- Space allocation reports
- Occupancy analysis
- Cost center allocation

### Expected Outcome
- Complete location tracking for departments
- Support for multi-location organizations
- Foundation for space management

### Verification Checklist
- [ ] location field added (CharField, 100)
- [ ] building field added (CharField, 50)
- [ ] floor field added (CharField, 20)
- [ ] All fields allow null and blank
- [ ] Appropriate max lengths set

---

## Task 11: Add Department Contact

### Overview
Add contact information fields to the Department model including email, phone number, and extension. This enables direct communication with departments and supports contact directories.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add email field**
   - EmailField for department email
   - Max length: 100 characters
   - Optional field (null=True, blank=True)
   - Format: department@company.com

3. **Add phone field**
   - CharField for phone number
   - Max length: 20 characters
   - Optional field (null=True, blank=True)
   - Format: +94 XX XXX XXXX (Sri Lanka format)

4. **Add extension field**
   - CharField for internal extension
   - Max length: 10 characters
   - Optional field (null=True, blank=True)
   - Format: 4-digit extension number

### Contact Field Details

| Field | Type | Max Length | Purpose |
|-------|------|------------|---------|
| email | EmailField | 100 | Department email address |
| phone | CharField | 20 | Department phone number |
| extension | CharField | 10 | Internal extension number |

### Contact Field Usage

#### Email Field:
- Department-specific email address
- Shared inbox for inquiries
- General communication channel
- May be distribution list

Examples:
- "hr@company.lk"
- "sales@company.lk"
- "support@company.lk"
- "finance.dept@company.lk"

#### Phone Field:
- Direct department line
- Main contact number
- External phone number
- Sri Lanka format recommended

Examples:
- "+94 11 234 5678"
- "+94 77 123 4567"
- "011-2345678"

#### Extension Field:
- Internal phone extension
- PBX extension number
- Used for internal directory
- Typically 3-4 digits

Examples:
- "1234"
- "567"
- "ext. 890"

### Contact Information Structure

#### Complete Contact Example:
```
Department: Customer Service
Email: support@company.lk
Phone: +94 11 234 5678
Extension: 1234
```

#### Partial Contact Example:
```
Department: IT Support
Email: itsupport@company.lk
Phone: (shared with main office)
Extension: 567
```

#### Internal Department:
```
Department: Internal Audit
Email: audit@company.lk
Phone: (none) - internal only
Extension: 890
```

### Contact Information Benefits

#### Communication:
- Direct department contact
- Inquiry routing
- Quick communication access
- External contact point

#### Directory Services:
- Employee directory integration
- Contact list generation
- Organization chart contact info
- Phone book entries

#### Customer Service:
- Customer inquiry routing
- Support channel identification
- Service level management
- Response tracking

### Sri Lanka Phone Format

#### Landline Format:
- +94 11 XXX XXXX (Colombo)
- +94 XX XXX XXXX (Other areas)
- Country code: +94
- Area code varies by region

#### Mobile Format:
- +94 7X XXX XXXX
- +94 77, +94 76, +94 75, etc.
- 10 digits after country code

### Expected Outcome
- Complete contact information for departments
- Support for communication directories
- Foundation for contact management

### Verification Checklist
- [ ] email field added (EmailField, 100)
- [ ] phone field added (CharField, 20)
- [ ] extension field added (CharField, 10)
- [ ] All fields allow null and blank
- [ ] Email field validates email format

---

## Task 12: Add Cost Center Field

### Overview
Add a cost center field to the Department model to support financial tracking and cost allocation. Cost centers enable departmental budget tracking and financial reporting.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add cost_center field**
   - CharField for cost center code
   - Max length: 20 characters
   - Optional field (null=True, blank=True)
   - Unique constraint recommended (per tenant)

3. **Add field validation**
   - Consider uppercase formatting
   - May include prefix (CC-, COST-, etc.)
   - Alphanumeric characters
   - No special characters except hyphen

4. **Add help_text**
   - Explain cost center purpose
   - Note format requirements
   - Reference accounting system

### Cost Center Field Details

| Field | Type | Max Length | Constraints | Purpose |
|-------|------|------------|-------------|---------|
| cost_center | CharField | 20 | optional, unique | Financial tracking code |

### Cost Center Purpose

#### Financial Tracking:
- Expense allocation
- Budget assignment
- Cost reporting
- Financial analysis
- Profitability tracking

#### Accounting Integration:
- Links to accounting system
- General ledger integration
- Chart of accounts mapping
- Financial statement preparation

### Cost Center Format

#### Standard Format:
```
CC-{CODE}
Examples:
- CC-HR
- CC-SALES
- CC-FIN
```

#### Numeric Format:
```
COST-{NUMBER}
Examples:
- COST-1001
- COST-2500
- COST-3750
```

#### Hierarchical Format:
```
{PARENT}-{CHILD}
Examples:
- OPS-SALES
- FIN-ACCTS
- HR-RECRUIT
```

### Cost Center Examples

#### By Department:
```
Department: Human Resources
Cost Center: CC-HR-001
Purpose: HR operational costs

Department: Sales Department
Cost Center: CC-SALES-100
Purpose: Sales team expenses

Department: IT Support
Cost Center: CC-IT-200
Purpose: IT infrastructure costs
```

#### Shared Cost Centers:
```
Multiple departments can share:
- Shared Services: CC-SHARED-001
- Overhead: CC-OVERHEAD
- Facilities: CC-FACILITY
```

### Cost Center Usage

#### Expense Tracking:
- All department expenses tagged with cost center
- Budget vs. actual tracking
- Variance analysis
- Cost control

#### Budgeting:
- Annual budget allocation
- Quarterly budget reviews
- Budget adjustments
- Financial planning

#### Reporting:
- Departmental P&L
- Cost center reports
- Expense analysis
- Management reports

### Integration Considerations

#### Accounting System:
- Cost center must exist in accounting system
- Synchronization required
- Validation against master list
- Regular reconciliation

#### ERP Integration:
- Cost center on purchase orders
- Expense approval workflows
- Invoice allocation
- Asset tracking

### Expected Outcome
- Cost center tracking enabled
- Foundation for financial reporting
- Support for accounting integration

### Verification Checklist
- [ ] cost_center field added (CharField, 20)
- [ ] Field allows null and blank
- [ ] Unique constraint considered
- [ ] help_text added
- [ ] Format guidelines documented

---

## Task 13: Add Budget Fields

### Overview
Add budget-related fields to track departmental annual budget and currency. This supports financial planning, budget management, and spending analysis.

### Dependencies
- Task 05: Create Department Model Core
- Task 12: Add Cost Center Field

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add annual_budget field**
   - DecimalField for budget amount
   - Max digits: 15
   - Decimal places: 2
   - Optional field (null=True, blank=True)
   - Positive values only

3. **Add currency field**
   - CharField for currency code
   - Max length: 3 characters
   - Default: 'LKR' (Sri Lankan Rupee)
   - Follow ISO 4217 currency codes

4. **Add validation**
   - Ensure annual_budget is positive
   - Validate currency code format
   - Consider using choices for currency

### Budget Field Details

| Field | Type | Config | Purpose |
|-------|------|--------|---------|
| annual_budget | DecimalField | max_digits=15, decimal_places=2 | Department annual budget |
| currency | CharField | max_length=3, default='LKR' | Currency code (ISO 4217) |

### Budget Field Usage

#### Annual Budget:
- Departmental operating budget
- Fiscal year allocation
- Planning baseline
- Spending limit reference

Budget Range Examples:
- Small department: LKR 1,000,000 - 5,000,000
- Medium department: LKR 5,000,000 - 20,000,000
- Large department: LKR 20,000,000 - 100,000,000+

#### Currency:
- Budget currency denomination
- Default: LKR (Sri Lankan Rupee)
- Support multi-currency if needed
- ISO 4217 standard codes

### Currency Codes (ISO 4217)

| Currency | Code | Usage |
|----------|------|-------|
| Sri Lankan Rupee | LKR | Default, local operations |
| US Dollar | USD | International transactions |
| Euro | EUR | European operations |
| British Pound | GBP | UK operations |
| Indian Rupee | INR | Regional trade |

### Budget Management Scenarios

#### Budget Allocation:
```
Department: Sales
Annual Budget: LKR 50,000,000
Currency: LKR
Breakdown:
- Salaries: 60%
- Marketing: 20%
- Operations: 15%
- Training: 5%
```

#### Multi-Currency:
```
Department: International Sales
Annual Budget: USD 250,000
Currency: USD
(for departments operating internationally)
```

#### No Budget Set:
```
Department: Executive Office
Annual Budget: (none)
(centrally managed, no departmental budget)
```

### Budget Tracking

#### Budget vs. Actual:
- Compare annual budget to actual spending
- Track spending percentage
- Identify over/under budget
- Monthly budget reports

#### Budget Periods:
- Annual budget (fiscal year)
- Quarterly allocations
- Monthly tracking
- Rolling forecasts

#### Budget Adjustments:
- Mid-year budget revisions
- Supplementary budgets
- Budget reallocations
- Emergency funds

### Budget Reporting

#### Standard Reports:
- Budget allocation by department
- Spending vs. budget
- Budget utilization percentage
- Variance analysis
- Forecast vs. actual

#### Management Reports:
- Departmental budget summary
- Cost center budget roll-up
- Budget compliance
- Spending trends

### Budget Validation Rules

#### Business Rules:
- Budget must be positive
- Currency must be valid ISO code
- Budget should be reviewed annually
- Changes require approval
- Audit trail maintained

#### Warning Thresholds:
- 75% budget utilized - warning
- 90% budget utilized - alert
- 100% budget utilized - block
- Over budget - escalation

### Expected Outcome
- Complete budget tracking capability
- Support for financial planning
- Foundation for budget management

### Verification Checklist
- [ ] annual_budget field added (DecimalField)
- [ ] Field configured: max_digits=15, decimal_places=2
- [ ] Field allows null and blank
- [ ] currency field added (CharField, 3)
- [ ] currency default set to 'LKR'
- [ ] Positive value validation considered

---

## Task 14: Create Department Code Generator

### Overview
Create a utility service to automatically generate or validate department codes. This ensures consistent code format and prevents duplicate codes across the system.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Create code generator module**
   - Navigate to `apps/organization/services/`
   - Create new file `code_generator.py`
   - Will contain code generation logic

2. **Create DepartmentCodeGenerator class**
   - Define class for code generation
   - Include methods for generate and validate
   - Handle tenant-specific code uniqueness

3. **Implement generate_code method**
   - Accept department name as parameter
   - Generate code from name
   - Apply formatting rules
   - Check for uniqueness

4. **Implement code formatting logic**
   - Extract key characters from name
   - Convert to uppercase
   - Remove special characters
   - Apply prefix (e.g., "DEPT-")

5. **Implement uniqueness check**
   - Query existing department codes
   - Check for duplicates in tenant schema
   - Handle collisions with numeric suffix

6. **Implement validate_code method**
   - Check code format compliance
   - Verify uniqueness
   - Return validation result
   - Provide error messages

7. **Handle code collisions**
   - If code exists, append number (DEPT-HR-2)
   - Increment until unique code found
   - Maximum attempts limit
   - Raise exception if failed

### Code Generator Structure

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| generate_code | name: str | str | Generate unique code |
| validate_code | code: str, dept_id: int | bool | Validate code format/uniqueness |
| format_code | name: str | str | Apply formatting rules |
| check_uniqueness | code: str | bool | Check if code unique |

### Code Generation Logic

#### Step 1: Extract Key Parts
```
Input: "Human Resources Department"
Extract: "Human Resources"
Remove: "Department"
```

#### Step 2: Create Abbreviation
```
Method 1 - Initials:
"Human Resources" → "HR"

Method 2 - First N Characters:
"Human Resources" → "HUMA"

Method 3 - Smart Abbreviation:
"Human Resources" → "HUMRES"
```

#### Step 3: Apply Prefix
```
"HR" → "DEPT-HR"
```

#### Step 4: Check Uniqueness
```
If "DEPT-HR" exists:
  Try "DEPT-HR-2"
If "DEPT-HR-2" exists:
  Try "DEPT-HR-3"
Continue until unique found
```

### Code Format Examples

#### Standard Departments:
```
Name: Human Resources
Code: DEPT-HR

Name: Finance Department
Code: DEPT-FIN

Name: Information Technology
Code: DEPT-IT

Name: Sales and Marketing
Code: DEPT-SM
```

#### Nested Departments:
```
Name: Accounts Payable
Code: DEPT-AP

Name: Customer Service
Code: DEPT-CS

Name: Quality Assurance
Code: DEPT-QA
```

#### Collision Resolution:
```
Name: Human Resources
Code: DEPT-HR (exists)
Generated: DEPT-HR-2

Name: Human Resources Training
Code: DEPT-HR (exists), DEPT-HR-2 (exists)
Generated: DEPT-HR-3
```

### Code Validation Rules

#### Format Rules:
- Starts with prefix (DEPT-)
- Contains only uppercase letters, numbers, hyphen
- Length: 6-20 characters
- No spaces or special characters
- Must be alphanumeric after prefix

#### Uniqueness Rules:
- Unique per tenant
- Case-insensitive comparison
- Cannot reuse archived codes (optional)
- Validation on create and update

### Code Generator Usage

#### Auto-Generate on Create:
```
When creating department:
1. If code not provided, generate automatically
2. If code provided, validate format
3. Check uniqueness
4. Save department with code
```

#### Validate on Update:
```
When updating department:
1. If code changed, validate new code
2. Check uniqueness (exclude self)
3. Validate format
4. Update department
```

### Expected Outcome
- Automatic code generation capability
- Consistent code format
- Unique code guarantee
- Code validation utilities

### Verification Checklist
- [ ] `code_generator.py` file created
- [ ] DepartmentCodeGenerator class defined
- [ ] generate_code method implemented
- [ ] validate_code method implemented
- [ ] Code formatting logic implemented
- [ ] Uniqueness check implemented
- [ ] Collision handling implemented

---

## Task 15: Create Department Model Indexes

### Overview
Add database indexes to the Department model to optimize query performance for common lookups and filters. Indexes significantly improve query speed for large datasets.

### Dependencies
- Task 05: Create Department Model Core
- All department fields added

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model Meta class

2. **Add indexes list to Meta class**
   - Add 'indexes' attribute to Meta class
   - Define list of Index objects
   - Use Django's models.Index

3. **Create index on code field**
   - Single-column index on code
   - Speeds up code lookups
   - Most frequent lookup field

4. **Create index on status field**
   - Single-column index on status
   - Speeds up status filtering
   - Common in department lists

5. **Create index on parent field**
   - Single-column index on parent
   - Speeds up hierarchy queries
   - Used for child department lookups

6. **Create index on manager field**
   - Single-column index on manager
   - Speeds up manager-based queries
   - Used for manager department lists

7. **Create composite index on status and parent**
   - Multi-column index (status, parent)
   - Optimizes filtered hierarchy queries
   - Example: "Get active departments under parent X"

8. **Consider MPTT indexes**
   - MPTT adds its own indexes automatically
   - Indexes on lft, rght, tree_id
   - No manual addition needed

### Index Configuration

| Index | Columns | Purpose |
|-------|---------|---------|
| idx_dept_code | code | Fast code lookups |
| idx_dept_status | status | Status filtering |
| idx_dept_parent | parent | Hierarchy queries |
| idx_dept_manager | manager | Manager-based queries |
| idx_dept_status_parent | status, parent | Combined filtering |

### Index Benefits

#### Query Performance:
- Faster WHERE clause filtering
- Improved JOIN performance
- Quicker sorting
- Reduced query time

#### Query Examples Optimized:

**By Code:**
```
SELECT * FROM department WHERE code = 'DEPT-HR'
Uses: idx_dept_code
```

**By Status:**
```
SELECT * FROM department WHERE status = 'active'
Uses: idx_dept_status
```

**By Parent:**
```
SELECT * FROM department WHERE parent_id = 5
Uses: idx_dept_parent
```

**By Status and Parent:**
```
SELECT * FROM department WHERE status = 'active' AND parent_id = 5
Uses: idx_dept_status_parent (composite)
```

### Index Design Considerations

#### When to Add Indexes:
- Columns frequently used in WHERE clauses
- Columns used in JOIN conditions
- Columns used in ORDER BY
- Foreign key columns
- Unique constraints

#### When NOT to Add Indexes:
- Tables with few rows (< 1000)
- Columns rarely queried
- Columns with low cardinality
- Write-heavy tables (indexes slow INSERTs)

### Index Trade-offs

#### Benefits:
- Faster SELECT queries
- Improved filter performance
- Better user experience
- Scalability for large datasets

#### Costs:
- Slower INSERT operations
- Slower UPDATE operations
- Additional disk space
- Index maintenance overhead

### MPTT Auto-Generated Indexes

MPTT automatically creates:
- Index on lft
- Index on rght
- Index on tree_id
- Index on level (optional)

These indexes optimize:
- Get descendants queries
- Get ancestors queries
- Tree traversal
- Level-based filtering

### Index Naming Convention

#### Django Auto-Naming:
```
{app}_{model}_{field}_idx
Example: organization_department_code_idx
```

#### Custom Naming:
```
idx_{model}_{field}
Example: idx_dept_code
```

#### Composite Index Naming:
```
idx_{model}_{field1}_{field2}
Example: idx_dept_status_parent
```

### Expected Outcome
- Optimized query performance
- Fast department lookups
- Efficient hierarchy queries
- Scalable for growth

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] Index on code field defined
- [ ] Index on status field defined
- [ ] Index on parent field defined
- [ ] Index on manager field defined
- [ ] Composite index on status and parent defined
- [ ] Index names follow convention

---

## Task 16: Run Initial Department Migrations

### Overview
Generate and apply Django migrations for the Department model to create the database schema. This finalizes the model definition and creates tables, indexes, and constraints.

### Dependencies
- All previous tasks (01-15) completed
- Department model fully defined
- All fields, indexes, and constraints configured

### Instructions

1. **Review model definition**
   - Open `apps/organization/models/department.py`
   - Verify all fields are correctly defined
   - Check Meta class configuration
   - Ensure MPTT configuration is correct

2. **Generate migration file**
   - Run Django's makemigrations command
   - Specify organization app
   - Review generated migration file
   - Verify migration operations

3. **Review migration file**
   - Open generated migration in `migrations/` directory
   - Check CreateModel operation
   - Verify field definitions
   - Confirm index creation
   - Check MPTT fields included

4. **Test migration (optional)**
   - Run migration on test database
   - Check for errors
   - Verify schema creation
   - Rollback if needed

5. **Apply migration to development database**
   - Run migrate command
   - Apply to all tenant schemas
   - Verify successful completion
   - Check for any warnings

6. **Verify database schema**
   - Connect to database
   - Check table creation
   - Verify columns exist
   - Check indexes created
   - Confirm constraints applied

### Migration Process

#### Step 1: Make Migrations
```
Command: python manage.py makemigrations organization
Output: Creates migrations/0001_initial.py
```

#### Step 2: Review Migration
```
Check migration file:
- CreateModel operation
- All fields present
- Indexes defined
- MPTT fields included
```

#### Step 3: Apply Migration
```
Command: python manage.py migrate organization
Result: Creates department table in database
```

### Migration File Contents

#### Expected Operations:
1. **CreateModel** - Department model
2. **AddField** - All model fields
3. **AddIndex** - All defined indexes
4. **AlterField** - MPTT-specific configurations

#### Key Migration Components:
- Model name: Department
- Fields: name, code, status, description, etc.
- MPPT fields: lft, rght, tree_id, level, parent
- Indexes: code, status, parent, manager, composite
- Meta options: ordering, verbose_name

### Multi-Tenancy Migration

#### Public Schema:
- No department tables in public schema
- Organization app in TENANT_APPS
- Migrations applied to tenant schemas only

#### Tenant Schemas:
- Each tenant gets department table
- Schema isolation maintained
- Independent data per tenant
- Migrations run for all tenants

### Migration Verification

#### Database Checks:
```
1. Table exists: organization_department
2. Columns match model fields
3. Indexes created:
   - idx_dept_code
   - idx_dept_status
   - idx_dept_parent
   - idx_dept_manager
   - idx_dept_status_parent
4. Foreign keys:
   - parent (self-referential)
   - manager (to Employee)
5. MPTT fields:
   - lft, rght, tree_id, level
```

#### Query Tests:
```
1. Insert test department
2. Query by code
3. Query by status
4. Test parent-child relationship
5. Verify MPTT operations
```

### Common Migration Issues

#### Issue: Missing Dependencies
```
Problem: Employee model not found
Solution: Ensure HR module migrated first
```

#### Issue: Duplicate Table
```
Problem: Table already exists
Solution: Run fake migration or drop table
```

#### Issue: Index Creation Failed
```
Problem: Index name conflict
Solution: Rename indexes or drop existing
```

### Post-Migration Tasks

#### Verification:
- Run Django checks command
- Test model creation in Django shell
- Verify MPPT functionality
- Test manager assignment

#### Documentation:
- Document migration number
- Note any manual steps required
- Record database changes
- Update deployment procedures

### Expected Outcome
- Department table created in database
- All fields, indexes, constraints applied
- MPTT fields functional
- Model ready for use

### Verification Checklist
- [ ] makemigrations command executed
- [ ] Migration file generated (0001_initial.py)
- [ ] Migration file reviewed
- [ ] migrate command executed successfully
- [ ] Department table exists in database
- [ ] All columns present
- [ ] All indexes created
- [ ] Foreign keys configured
- [ ] MPTT fields present
- [ ] Can create Department instances

---

## Summary

This document completed the Department model implementation:

1. **Manager Assignment** - Foreign key to Employee for leadership
2. **Location Tracking** - Location, building, floor fields
3. **Contact Information** - Email, phone, extension fields
4. **Cost Center** - Financial tracking field
5. **Budget Management** - Annual budget and currency fields
6. **Code Generator** - Automatic code generation utility
7. **Performance Indexes** - Optimized database queries
8. **Migrations Applied** - Database schema created

The Department model is now complete and ready for use in the organization hierarchy system with full MPTT support, manager assignment, location tracking, and financial integration.
