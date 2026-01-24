# Tasks 19-28: SalaryTemplate and TemplateComponent Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** B - Salary Template & Grades  
> **Document:** 01 of 02  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group A: Salary Component Models](../Group-A_Salary-Component-Models/)
- **→ Next Document:** [02_Tasks-29-34_SalaryGrade-Seed.md](02_Tasks-29-34_SalaryGrade-Seed.md)

---

## Document Overview

This document covers the implementation of salary templates and their component associations. Templates allow grouping of salary components into reusable packages that can be assigned to designations or employees. The TemplateComponent model creates the many-to-many relationship between templates and components with additional configuration options like default values, override permissions, and validation ranges.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create SalaryTemplate Model | Medium | 25 min |
| 20 | Add Template Core Fields | Low | 15 min |
| 21 | Add Template Designation Link | Medium | 20 min |
| 22 | Add Template Status Field | Low | 10 min |
| 23 | Run SalaryTemplate Migrations | Low | 15 min |
| 24 | Create TemplateComponent Model | Medium | 25 min |
| 25 | Add Template Component Fields | Low | 15 min |
| 26 | Add Default Value Field | Low | 15 min |
| 27 | Add Override Fields | Medium | 20 min |
| 28 | Run TemplateComponent Migrations | Low | 15 min |

---

## Task 19: Create SalaryTemplate Model

### Overview
Create the SalaryTemplate model that serves as a container for grouping salary components into reusable packages. Templates standardize salary structures for designations or employee groups, making salary administration more efficient and consistent across the organization.

### Dependencies
- Payroll application (`apps/payroll/`) exists
- SalaryComponent model implemented (from Group A)
- Django ORM configured
- Tenant-aware mixins available

### Instructions

1. **Create salary_template.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `salary_template.py`
   - Import necessary Django model components

2. **Import required modules**
   - Import Django model fields (CharField, TextField, BooleanField, etc.)
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import models module from Django

3. **Define SalaryTemplate model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring explaining template purpose
   - Document the template's role in standardizing salary structures

4. **Add model docstring**
   - Explain template concept and purpose
   - Describe how templates group components
   - Note usage scenarios (designation-level, employee assignments)
   - Mention reusability and standardization benefits

5. **Prepare for core fields**
   - Plan field structure for template identification
   - Consider tenant isolation requirements
   - Prepare for designation association
   - Plan for active/inactive status management

6. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Prepare to import SalaryTemplate
   - Add to __all__ list for proper module exports

### SalaryTemplate Model Purpose

```
Template Concept
════════════════

SalaryTemplate acts as a reusable package that groups multiple
salary components together with specific configurations.

Purpose:
┌─────────────────────────────────────────────────────────┐
│  1. Standardize salary structures across organization   │
│  2. Simplify salary assignment to employees             │
│  3. Maintain consistency in compensation packages       │
│  4. Link standard packages to designations              │
│  5. Enable quick salary configuration                   │
└─────────────────────────────────────────────────────────┘
```

### Template Structure Overview

```
┌───────────────────────────────────────────────────────┐
│              SalaryTemplate Model                     │
├───────────────────────────────────────────────────────┤
│ Core Fields (added in subsequent tasks):             │
│  • name - Template identifier                        │
│  • code - Unique code                                │
│  • description - Template purpose                    │
│  • designation - Optional FK to Designation          │
│  • is_active - Availability status                   │
│                                                       │
│ Inherited from TenantAwareMixin:                     │
│  • tenant - ForeignKey to Tenant                     │
│                                                       │
│ Inherited from TimestampMixin:                       │
│  • created_at - Creation timestamp                   │
│  • updated_at - Last update timestamp                │
└───────────────────────────────────────────────────────┘
```

### Template Usage Scenarios

#### Scenario 1: Designation-Based Templates
```
Template: "Senior Developer Package"
Linked to: Senior Developer Designation

When employee is assigned Senior Developer designation:
└── Automatically gets associated template
    ├── Basic Salary component
    ├── Transport Allowance
    ├── Medical Allowance
    └── Standard deductions (EPF, PAYE)
```

#### Scenario 2: Grade-Based Templates
```
Template: "Grade 5 Compensation"
Linked to: Grade 5 salary grade

Components in template:
├── Basic Salary (range: 130,000 - 180,000)
├── Professional Allowance
├── Transport Allowance
└── Statutory deductions
```

#### Scenario 3: Department-Specific Templates
```
Template: "Sales Team Package"
Linked to: Sales department designations

Components:
├── Base Salary
├── Commission component
├── Travel Allowance
├── Mobile Allowance
└── Standard deductions
```

### Template Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| Consistency | Same structure for similar roles | Reduces payroll errors |
| Speed | Quick employee salary setup | Saves administrative time |
| Standardization | Uniform compensation packages | Ensures fairness |
| Flexibility | Templates can be customized | Adapts to needs |
| Audit Trail | Template changes tracked | Compliance support |

### Template Hierarchy

```
Organization Structure
═══════════════════════

Tenant (Company)
    │
    ├── Salary Templates
    │   ├── Executive Package
    │   ├── Senior Staff Package
    │   ├── Mid-Level Package
    │   └── Entry Level Package
    │
    └── Designations
        ├── CEO → Executive Package
        ├── Manager → Senior Staff Package
        ├── Senior Developer → Mid-Level Package
        └── Junior Developer → Entry Level Package
```

### Expected Outcome
- SalaryTemplate model class created
- File structure properly organized
- Model inherits required mixins
- Foundation ready for field additions
- Documentation clearly explains template concept

### Verification Checklist
- [ ] salary_template.py file created in apps/payroll/models/
- [ ] Required Django modules imported
- [ ] Base mixins imported (TenantAwareMixin, TimestampMixin)
- [ ] SalaryTemplate class defined with inheritance
- [ ] Comprehensive model docstring added
- [ ] File ready for field additions in next tasks

---

## Task 20: Add Template Core Fields

### Overview
Add the essential identifying and descriptive fields to the SalaryTemplate model. These core fields enable template identification, provide human-readable information, and support template management within the system.

### Dependencies
- Task 19: Create SalaryTemplate Model

### Instructions

1. **Open salary_template.py model file**
   - Navigate to `apps/payroll/models/salary_template.py`
   - Locate the SalaryTemplate model class

2. **Add name field**
   - CharField with max_length=200
   - Required field (blank=False, null=False)
   - Human-readable template identifier
   - Used in UI dropdowns and listings
   - Examples: "Senior Developer Package", "Executive Compensation", "Entry Level Standard"

3. **Add code field**
   - CharField with max_length=50
   - Required and unique per tenant
   - Short alphanumeric identifier
   - Used for programmatic reference
   - Format: "TMPL-XXX" (e.g., "TMPL-SD", "TMPL-EXEC")
   - Add uppercase conversion validation

4. **Add description field**
   - TextField
   - Optional (blank=True, null=True)
   - Detailed explanation of template purpose
   - Usage guidelines and applicability
   - May include component summary

5. **Add field-level help text**
   - Add help_text parameter to each field
   - Provide guidance for administrators
   - Explain field purpose and format

6. **Update model docstring**
   - Document all core fields
   - Explain field purposes and constraints
   - Include usage examples

### Core Fields Structure

```
┌─────────────────────────────────────────────────┐
│         SalaryTemplate Core Fields              │
├─────────────────────────────────────────────────┤
│ name                                            │
│  • Type: CharField(200)                         │
│  • Required: Yes                                │
│  • Purpose: Display name                        │
│  • Example: "Senior Developer Package"          │
│                                                 │
│ code                                            │
│  • Type: CharField(50)                          │
│  • Required: Yes                                │
│  • Unique: Per tenant                           │
│  • Purpose: System identifier                   │
│  • Example: "TMPL-SD"                           │
│                                                 │
│ description                                     │
│  • Type: TextField                              │
│  • Required: No                                 │
│  • Purpose: Detailed explanation                │
│  • Example: "Standard package for senior..."    │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Max Length | Required | Unique | Purpose |
|-------|------|------------|----------|--------|---------|
| name | CharField | 200 | Yes | No | Display identifier |
| code | CharField | 50 | Yes | Per tenant | System code |
| description | TextField | Unlimited | No | No | Detailed explanation |

### Template Naming Guidelines

#### Good Names
- "Senior Developer Package" - Clear, descriptive
- "Executive Level Compensation" - Professional
- "Sales Team Standard Package" - Specific
- "Entry Level Basic Package" - Clear hierarchy

#### Poor Names
- "Package 1" - Not descriptive
- "Temp" - Unclear purpose
- "Test" - Not professional
- "ABC" - No context

### Code Format Standards

#### Recommended Format
```
TMPL-[ABBR]

Examples:
├── TMPL-SD    (Senior Developer)
├── TMPL-EXEC  (Executive)
├── TMPL-JR    (Junior)
├── TMPL-MID   (Mid-Level)
└── TMPL-MGR   (Manager)
```

#### Code Characteristics
- Start with "TMPL-" prefix for consistency
- Use 2-4 letter abbreviation
- Uppercase only
- No spaces or special characters (except hyphen)
- Keep under 50 characters

### Description Field Usage

#### Effective Descriptions

**Example 1: Senior Developer Package**
```
Standard compensation package for Senior Developer designation.

Includes:
- Competitive base salary (130K-180K range)
- Transport allowance
- Professional development allowance
- Medical insurance
- Standard EPF/ETF contributions

Applicable to:
- Senior Software Engineers
- Technical Leads
- Senior System Architects
```

**Example 2: Sales Team Package**
```
Variable compensation structure for sales personnel.

Components:
- Base salary (fixed component)
- Commission (performance-based)
- Travel allowance
- Mobile phone allowance

Note: Commission structure varies by sales territory
and product category.
```

### Template Examples by Organization Level

| Level | Template Name | Code | Typical Components |
|-------|---------------|------|-------------------|
| C-Level | "Executive Package" | TMPL-EXEC | High base, bonuses, benefits |
| Management | "Manager Package" | TMPL-MGR | Mid-high base, team bonus |
| Senior | "Senior Staff Package" | TMPL-SR | Good base, allowances |
| Mid-Level | "Mid-Level Package" | TMPL-MID | Standard base, basic allowances |
| Entry | "Entry Level Package" | TMPL-ENTRY | Lower base, growth potential |

### Sri Lanka Context Examples

#### Corporate Template
```
Name: "Senior Executive Officer Package"
Code: TMPL-SEO
Description: Standard package for Senior Executive Officers
in government corporations. Compliant with Department of
Management Services salary scales.
```

#### Private Sector Template
```
Name: "IT Specialist Grade III"
Code: TMPL-IT3
Description: Compensation package for IT Specialist Grade III
as per company salary structure. Includes professional
allowances and certification incentives.
```

### Field Validation Requirements

#### Name Validation
- Minimum 5 characters
- Maximum 200 characters
- Cannot be empty or whitespace only
- Should be descriptive and meaningful

#### Code Validation
- Minimum 3 characters
- Maximum 50 characters
- Uppercase only
- Alphanumeric and hyphen only
- Must be unique per tenant
- Cannot start or end with hyphen

### Expected Outcome
- Name field for template identification
- Code field for system reference
- Description field for documentation
- Proper field constraints and validation
- Help text for administrator guidance

### Verification Checklist
- [ ] name field added with max_length=200
- [ ] name field is required (blank=False)
- [ ] code field added with max_length=50
- [ ] code field is required and unique per tenant
- [ ] code field has uppercase validation
- [ ] description field added as TextField
- [ ] description field is optional (blank=True, null=True)
- [ ] All fields have help_text
- [ ] Model docstring updated with field documentation

---

## Task 21: Add Template Designation Link

### Overview
Add a ForeignKey relationship linking SalaryTemplate to Designation model. This optional relationship allows templates to be associated with specific job positions, enabling automatic template application when employees are assigned to designations.

### Dependencies
- Task 20: Add Template Core Fields
- Designation model exists (from HR module)

### Instructions

1. **Open salary_template.py model file**
   - Continue in `apps/payroll/models/salary_template.py`
   - Locate the SalaryTemplate model class

2. **Import Designation model**
   - Add import for Designation from HR module
   - Use appropriate import path (e.g., from apps.hr.models import Designation)
   - Verify model is available

3. **Add designation field**
   - ForeignKey to Designation model
   - Optional relationship (blank=True, null=True)
   - Use CASCADE delete behavior (if designation deleted, template remains but link is cleared)
   - Use related_name='salary_templates' for reverse lookup

4. **Add field help text**
   - Explain optional designation association
   - Describe auto-assignment behavior
   - Note that templates can exist without designation

5. **Add field documentation**
   - Update model docstring
   - Explain designation link purpose
   - Document when to use designation association

6. **Consider database indexing**
   - Add db_index=True for query optimization
   - Improves lookup performance when finding templates by designation

### Designation Link Structure

```
┌────────────────────────────────────────────────────┐
│        Template-Designation Relationship           │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────────┐          ┌──────────────────┐    │
│  │ Designation │          │  SalaryTemplate  │    │
│  ├─────────────┤          ├──────────────────┤    │
│  │ id          │◄─────────│ designation FK   │    │
│  │ name        │   0..1   │ name             │    │
│  │ code        │          │ code             │    │
│  └─────────────┘          │ ...              │    │
│                           └──────────────────┘    │
│                                                    │
│  Optional Relationship:                            │
│  - Template can exist without designation          │
│  - Designation can have 0 or many templates        │
│  - Multiple templates per designation allowed      │
└────────────────────────────────────────────────────┘
```

### Relationship Types

#### Type 1: Designation-Linked Template
```
Template: "Software Engineer Package"
Designation: Software Engineer

When employee assigned to "Software Engineer":
└── System can auto-suggest "Software Engineer Package"
    └── HR can apply template to employee salary
```

#### Type 2: Generic Template
```
Template: "Standard Package"
Designation: None (null)

Purpose:
└── Flexible template not tied to specific designation
    ├── Can be used for any position
    ├── Useful for contract staff
    └── Useful for temporary positions
```

### Designation Link Use Cases

| Scenario | Designation Link | Behavior |
|----------|-----------------|----------|
| Standard Position | Linked | Auto-suggest template for position |
| Multiple Templates | Linked | HR chooses from position templates |
| Contract Staff | Not linked | Manual template selection |
| Temporary Roles | Not linked | Flexible assignment |
| Generic Package | Not linked | Used across positions |

### Template-Designation Patterns

#### Pattern 1: One-to-One
```
Designation: CEO
└── Template: "CEO Compensation Package" (exclusive)
```

#### Pattern 2: One-to-Many
```
Designation: Senior Developer
├── Template: "Senior Developer Standard"
├── Template: "Senior Developer Premium"
└── Template: "Senior Developer International"
```

#### Pattern 3: Many-to-One
```
Template: "Entry Level Package"
├── Used by: Junior Developer
├── Used by: Junior Analyst
└── Used by: Junior Administrator
```

#### Pattern 4: Unlinked
```
Template: "Freelance Consultant Package"
Designation: None
└── Applied manually as needed
```

### ForeignKey Configuration

#### DELETE CASCADE vs SET_NULL
```
Using SET_NULL (Recommended):
───────────────────────────────
When Designation deleted:
└── Template remains in system
    └── designation field set to NULL
    └── Template can be reassigned

Using CASCADE (Not Recommended):
────────────────────────────────
When Designation deleted:
└── All linked templates deleted
    └── Data loss if templates used by employees
```

### Reverse Lookup Usage

```python
# Example reverse lookup patterns (for reference only)

# Get all templates for a designation
designation.salary_templates.all()

# Get active templates for designation
designation.salary_templates.filter(is_active=True)

# Check if designation has templates
designation.salary_templates.exists()

# Count templates for designation
designation.salary_templates.count()
```

### Employee Assignment Workflow

```
Employee Onboarding Flow
════════════════════════

1. Employee Created
   └── Assigned to Designation
       │
       ▼
2. System Checks
   └── Find templates linked to designation
       │
       ▼
3. HR Review
   ├── If one template: Auto-suggest
   ├── If multiple: Present choices
   └── If none: Manual template selection
       │
       ▼
4. Template Applied
   └── Components copied to employee salary
```

### Sri Lanka Context

#### Public Sector Example
```
Designation: "Development Officer Grade III"
Template: "DO III Salary Scale"

Components:
├── Basic Salary (per government scale)
├── Cost of Living Allowance
├── Fuel Allowance
└── EPF/ETF (government rates)
```

#### Private Sector Example
```
Designation: "Marketing Executive"
Template: "Marketing Executive Package"

Components:
├── Base Salary
├── Transport Allowance
├── Mobile Allowance
├── Performance Bonus
└── Standard deductions
```

### Expected Outcome
- Optional ForeignKey to Designation
- Enables designation-based template assignment
- Supports auto-suggestion during employee setup
- Flexible: templates can exist without designation
- Proper cascading behavior on designation deletion

### Verification Checklist
- [ ] Designation model imported
- [ ] designation ForeignKey field added
- [ ] Field is optional (blank=True, null=True)
- [ ] on_delete=SET_NULL configured
- [ ] related_name='salary_templates' set
- [ ] db_index=True added for performance
- [ ] help_text explains optional association
- [ ] Model docstring updated with relationship info

---

## Task 22: Add Template Status Field

### Overview
Add an is_active boolean field to control template availability in the system. This field enables soft deletion and lifecycle management of templates without removing historical data or breaking references from employee salary records.

### Dependencies
- Task 21: Add Template Designation Link

### Instructions

1. **Open salary_template.py model file**
   - Continue in `apps/payroll/models/salary_template.py`
   - Locate the SalaryTemplate model class

2. **Add is_active field**
   - BooleanField with default=True
   - Controls template visibility and usability
   - Required field (no blank/null)
   - Determines if template appears in selection lists

3. **Add field help text**
   - Explain active vs inactive status
   - Note that inactive templates are hidden from selection
   - Clarify that existing assignments remain valid

4. **Add Meta class**
   - Define verbose_name as "Salary Template"
   - Define verbose_name_plural as "Salary Templates"
   - Set default ordering by name
   - Add unique_together constraint for (tenant, code)
   - Add indexes for common queries

5. **Add __str__ method**
   - Return template name
   - Include active status indicator
   - Format: "Template Name [Active/Inactive]"

6. **Add custom manager (optional)**
   - Create ActiveTemplatesManager
   - Filter queryset to return only active templates
   - Add as 'active_objects' manager

7. **Update model docstring**
   - Document is_active field purpose
   - Explain template lifecycle
   - Note soft deletion pattern

### Is Active Field Purpose

```
Template Lifecycle States
══════════════════════════

┌────────────────┐
│  is_active =   │
│     True       │  ← Default state
│                │    - Visible in dropdowns
│  Available for │    - Can be assigned to employees
│  assignment    │    - Appears in reports
└────────────────┘

┌────────────────┐
│  is_active =   │
│     False      │  ← Archived state
│                │    - Hidden from dropdowns
│  Archived but  │    - Cannot be assigned to new employees
│  preserved     │    - Existing assignments remain valid
└────────────────┘    - Historical data preserved
```

### Active vs Inactive Behavior

| Operation | Active Template | Inactive Template |
|-----------|----------------|-------------------|
| Show in dropdown | Yes | No |
| Assign to new employee | Yes | No |
| View existing assignments | Yes | Yes |
| Edit template | Yes | Yes (by admin) |
| Delete template | Soft delete (deactivate) | Can be deleted |
| Reports | Included | Optional filter |

### Template Deactivation Scenarios

#### Scenario 1: Outdated Package
```
Template: "2025 Sales Package"

Action: New year, new package created
└── Deactivate "2025 Sales Package"
    ├── Existing employees keep current package
    ├── New employees use "2026 Sales Package"
    └── Historical data preserved
```

#### Scenario 2: Designation Discontinued
```
Template: "Junior Clerk Package"

Action: Junior Clerk position eliminated
└── Deactivate template
    ├── Current Junior Clerks retain package
    ├── No new assignments possible
    └── Template remains for reference
```

#### Scenario 3: Compliance Change
```
Template: "Pre-2026 Executive Package"

Action: New labor regulations effective
└── Deactivate old package
    ├── Create new compliant template
    ├── Migrate existing employees
    └── Keep old template for audit trail
```

### Meta Class Configuration

```
Meta Class Components
═════════════════════

verbose_name: "Salary Template"
└── Singular form for Django admin

verbose_name_plural: "Salary Templates"
└── Plural form for Django admin

ordering: ['name']
└── Default sort by template name alphabetically

unique_together: [['tenant', 'code']]
└── Ensures unique codes within each tenant
    (same code can exist across different tenants)

indexes:
├── [tenant, is_active] - Filter active templates per tenant
├── [designation] - Lookup templates by designation
└── [code] - Quick code-based lookups
```

### String Representation Format

#### Examples
```
Template with active status:
"Senior Developer Package [Active]"

Template with inactive status:
"Legacy 2024 Package [Inactive]"

Simple format (alternative):
"Senior Developer Package"
"Legacy 2024 Package (Inactive)"
```

### Custom Manager Implementation

```
Manager Structure
═════════════════

SalaryTemplate.objects
└── All templates (active and inactive)
    └── Used for admin, reports, audits

SalaryTemplate.active_objects
└── Only active templates
    └── Used for employee assignment UI
    └── Used for selection dropdowns
```

### Query Patterns

```
Common Query Examples (for understanding only)
═════════════════════════════════════════════

# Get all active templates
templates = SalaryTemplate.objects.filter(is_active=True)

# Get active templates for tenant
templates = SalaryTemplate.objects.filter(
    tenant=tenant,
    is_active=True
)

# Get templates for designation (active only)
templates = SalaryTemplate.objects.filter(
    designation=designation,
    is_active=True
)

# Count inactive templates
inactive_count = SalaryTemplate.objects.filter(
    is_active=False
).count()
```

### Soft Delete Pattern

```
Soft Delete vs Hard Delete
══════════════════════════

Soft Delete (Recommended):
├── Set is_active = False
├── Preserves historical data
├── Maintains referential integrity
├── Supports audit trails
└── Allows reactivation

Hard Delete (Avoid):
├── Removes from database
├── Breaks historical references
├── Loss of audit trail
├── Cannot be undone
└── Data compliance issues
```

### Template Reactivation Process

```
Reactivation Workflow
═════════════════════

1. Admin reviews inactive template
   └── Verify template is still relevant
       │
       ▼
2. Check for conflicts
   └── Ensure components still exist
   └── Verify designation still active
       │
       ▼
3. Update template if needed
   └── Adjust components
   └── Update values
       │
       ▼
4. Set is_active = True
   └── Template available again
```

### Expected Outcome
- is_active field controls template availability
- Meta class defines model behavior
- String representation shows template status
- Optional custom manager for active templates
- Soft deletion pattern implemented

### Verification Checklist
- [ ] is_active BooleanField added with default=True
- [ ] Field help_text explains active/inactive status
- [ ] Meta class defined with verbose names
- [ ] Meta class has ordering by name
- [ ] Meta class has unique_together on (tenant, code)
- [ ] Meta class has appropriate indexes
- [ ] __str__ method returns template name with status
- [ ] Model docstring updated with lifecycle information

---

## Task 23: Run SalaryTemplate Migrations

### Overview
Create and apply database migrations for the SalaryTemplate model. This task generates the migration file that creates the database table with all fields defined in tasks 19-22, and applies it to update the database schema.

### Dependencies
- Task 19: Create SalaryTemplate Model
- Task 20: Add Template Core Fields
- Task 21: Add Template Designation Link
- Task 22: Add Template Status Field
- PostgreSQL database configured
- Django migrations system configured

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/salary_template.py`
   - Confirm all fields are properly defined
   - Check model Meta class is complete
   - Verify imports are correct

2. **Update models __init__.py**
   - Open `apps/payroll/models/__init__.py`
   - Import SalaryTemplate model
   - Add SalaryTemplate to __all__ list
   - Ensure proper model exposure

3. **Check for model errors**
   - Run Django check command
   - Verify no system check errors
   - Fix any issues before creating migration
   - Ensure tenant relationships are correct

4. **Create migration file**
   - Run makemigrations command for payroll app
   - Specify app name to target only payroll
   - Review generated migration file
   - Verify all fields are included

5. **Review migration file**
   - Open generated migration in apps/payroll/migrations/
   - Verify field definitions match model
   - Check foreign key relationships
   - Confirm indexes are created
   - Verify unique constraints

6. **Apply migration**
   - Run migrate command for payroll app
   - Monitor for any errors during application
   - Verify successful migration
   - Check database table creation

7. **Verify database table**
   - Confirm salary_template table exists
   - Verify all columns are present
   - Check indexes are created
   - Confirm constraints are in place

8. **Test model functionality**
   - Open Django shell
   - Import SalaryTemplate model
   - Create test template instance
   - Verify save operation succeeds
   - Clean up test data

### Migration File Structure

```
Migration File Components
═════════════════════════

Migration Class:
├── dependencies
│   └── Previous payroll migrations
│   └── HR app migrations (for Designation FK)
│
└── operations
    └── CreateModel
        ├── name: 'SalaryTemplate'
        ├── fields:
        │   ├── id (AutoField, primary key)
        │   ├── tenant (ForeignKey to Tenant)
        │   ├── name (CharField, max_length=200)
        │   ├── code (CharField, max_length=50)
        │   ├── description (TextField, nullable)
        │   ├── designation (ForeignKey to Designation, nullable)
        │   ├── is_active (BooleanField, default=True)
        │   ├── created_at (DateTimeField, auto_now_add)
        │   └── updated_at (DateTimeField, auto_now)
        │
        └── options:
            ├── verbose_name: 'Salary Template'
            ├── verbose_name_plural: 'Salary Templates'
            ├── ordering: ['name']
            ├── unique_together: [['tenant', 'code']]
            └── indexes: [...]
```

### Database Table Structure

```sql
-- Expected table structure (for reference)

CREATE TABLE payroll_salary_template (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenant(id),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT NULL,
    designation_id INTEGER NULL REFERENCES hr_designation(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Unique constraint
    CONSTRAINT unique_tenant_code UNIQUE (tenant_id, code)
);

-- Indexes
CREATE INDEX idx_salary_template_tenant_active ON payroll_salary_template(tenant_id, is_active);
CREATE INDEX idx_salary_template_designation ON payroll_salary_template(designation_id);
CREATE INDEX idx_salary_template_code ON payroll_salary_template(code);
```

### Migration Commands

#### Step 1: System Check
```bash
python manage.py check payroll
```
**Expected Output:**
```
System check identified no issues (0 silenced).
```

#### Step 2: Create Migration
```bash
python manage.py makemigrations payroll
```
**Expected Output:**
```
Migrations for 'payroll':
  apps/payroll/migrations/0002_salary_template.py
    - Create model SalaryTemplate
```

#### Step 3: Review Migration
```bash
python manage.py sqlmigrate payroll 0002
```
**Purpose:** View SQL that will be executed

#### Step 4: Apply Migration
```bash
python manage.py migrate payroll
```
**Expected Output:**
```
Operations to perform:
  Apply all migrations: payroll
Running migrations:
  Applying payroll.0002_salary_template... OK
```

### Verification Queries

#### Check Table Exists
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payroll_salary_template'
);
```

#### Check Columns
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'payroll_salary_template'
ORDER BY ordinal_position;
```

#### Check Constraints
```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'payroll_salary_template'::regclass;
```

#### Check Indexes
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'payroll_salary_template';
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Field missing | Model not saved | Check model file, save changes |
| FK constraint error | Referenced model missing | Ensure HR app migrated first |
| Unique constraint violation | Test data conflicts | Clear test data before migration |
| Import error | Model not in __init__.py | Add import to models package |

### Testing After Migration

```
Post-Migration Testing Checklist
═════════════════════════════════

1. Django Shell Test:
   from apps.payroll.models import SalaryTemplate
   from apps.core.models import Tenant
   
   tenant = Tenant.objects.first()
   template = SalaryTemplate(
       tenant=tenant,
       name="Test Template",
       code="TMPL-TEST",
       is_active=True
   )
   template.save()
   
   # Verify save successful
   # Clean up test data
   template.delete()

2. Admin Interface:
   - Access /admin/payroll/salarytemplate/
   - Verify list view displays
   - Check add form renders
   - Confirm field help texts visible

3. Database Verification:
   - Confirm table created
   - Verify all columns present
   - Check indexes exist
   - Confirm constraints active
```

### Migration Rollback

```
If Issues Occur
═══════════════

Rollback to previous migration:
python manage.py migrate payroll 0001

Or rollback completely:
python manage.py migrate payroll zero

Note: Rollback only possible if no data exists
      and no other migrations depend on this one.
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Indexes and constraints applied
- Model fully operational in Django
- Template can be created and saved

### Verification Checklist
- [ ] SalaryTemplate imported in models __init__.py
- [ ] Django check command runs without errors
- [ ] makemigrations creates migration file
- [ ] Migration file includes all fields
- [ ] Migration file has proper dependencies
- [ ] migrate command executes successfully
- [ ] Database table created
- [ ] All columns present in table
- [ ] Indexes created correctly
- [ ] Unique constraints active
- [ ] Test template can be created and saved

---

## Task 24: Create TemplateComponent Model

### Overview
Create the TemplateComponent junction model that links SalaryTemplate to SalaryComponent with additional configuration. This model creates a many-to-many relationship with extra fields, allowing templates to contain multiple components with specific settings like default values, override permissions, and validation constraints.

### Dependencies
- Task 23: Run SalaryTemplate Migrations
- SalaryComponent model exists (from Group A)
- Understanding of many-to-many relationships with through models

### Instructions

1. **Create template_component.py model file**
   - Create file at `apps/payroll/models/template_component.py`
   - Import necessary Django model components
   - Prepare for junction table pattern

2. **Import required modules**
   - Import Django model fields (ForeignKey, DecimalField, BooleanField, etc.)
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import SalaryTemplate model
   - Import SalaryComponent model

3. **Define TemplateComponent model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain junction table purpose

4. **Add model docstring**
   - Explain relationship between template and component
   - Describe additional configuration purpose
   - Note that this is a many-to-many through model
   - Document override and validation capabilities

5. **Prepare for relationship fields**
   - Plan template ForeignKey structure
   - Plan component ForeignKey structure
   - Consider cascade deletion behavior
   - Plan for tenant consistency validation

6. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Prepare to import TemplateComponent
   - Add to __all__ list

### TemplateComponent Purpose

```
Junction Table Concept
═══════════════════════

TemplateComponent creates a many-to-many relationship
with additional configuration between templates and components.

Standard Many-to-Many:
SalaryTemplate ←→ SalaryComponent
(Simple association only)

Through Model Pattern:
SalaryTemplate ←→ TemplateComponent ←→ SalaryComponent
(Association + Configuration)

Extra Configuration:
├── Default values for this template
├── Override permissions
├── Validation ranges (min/max)
├── Mandatory flags
└── Display ordering
```

### Model Relationship Diagram

```
┌─────────────────┐         ┌────────────────────┐         ┌─────────────────┐
│  SalaryTemplate │         │ TemplateComponent  │         │ SalaryComponent │
├─────────────────┤         ├────────────────────┤         ├─────────────────┤
│ id              │◄───────┤│ template FK        │         │ id              │
│ name            │    1:N  │ component FK       │├───────►│ name            │
│ code            │         │                    │    N:1  │ code            │
│ designation FK  │         │ default_value      │         │ component_type  │
│ is_active       │         │ can_override       │         │ calculation     │
└─────────────────┘         │ min_value          │         │ default_value   │
                            │ max_value          │         │ is_taxable      │
                            │ is_mandatory       │         └─────────────────┘
                            │ display_order      │
                            └────────────────────┘
```

### TemplateComponent Structure

```
┌───────────────────────────────────────────────────────┐
│           TemplateComponent Model                     │
├───────────────────────────────────────────────────────┤
│ Relationship Fields (added in next tasks):           │
│  • template - FK to SalaryTemplate                   │
│  • component - FK to SalaryComponent                 │
│                                                       │
│ Configuration Fields (added in later tasks):         │
│  • default_value - Template-specific default         │
│  • can_override - Allow employee-level changes       │
│  • min_value - Validation minimum                    │
│  • max_value - Validation maximum                    │
│  • is_mandatory - Must be included                   │
│  • display_order - Sort order in template            │
│                                                       │
│ Inherited from TenantAwareMixin:                     │
│  • tenant - ForeignKey to Tenant                     │
│                                                       │
│ Inherited from TimestampMixin:                       │
│  • created_at - Creation timestamp                   │
│  • updated_at - Last update timestamp                │
└───────────────────────────────────────────────────────┘
```

### Use Case Examples

#### Example 1: Basic Salary Component in Template
```
Template: "Senior Developer Package"
Component: "Basic Salary"
Configuration:
├── default_value: 150,000.00
├── can_override: True (HR can adjust per employee)
├── min_value: 120,000.00 (lower limit)
├── max_value: 200,000.00 (upper limit)
├── is_mandatory: True (must be included)
└── display_order: 1 (shows first)
```

#### Example 2: Allowance Component
```
Template: "Senior Developer Package"
Component: "Transport Allowance"
Configuration:
├── default_value: 15,000.00
├── can_override: True (flexible)
├── min_value: 10,000.00
├── max_value: 25,000.00
├── is_mandatory: False (optional)
└── display_order: 10 (shows after basic components)
```

#### Example 3: Fixed Deduction
```
Template: "Standard Package"
Component: "EPF Employee (8%)"
Configuration:
├── default_value: null (calculated, not fixed)
├── can_override: False (statutory, cannot change)
├── min_value: null (not applicable)
├── max_value: null (not applicable)
├── is_mandatory: True (required by law)
└── display_order: 100 (shows with deductions)
```

### Template Component Scenarios

| Scenario | Template | Component | Default Value | Can Override | Mandatory |
|----------|----------|-----------|---------------|--------------|-----------|
| Standard Salary | Senior Package | Basic Salary | 150,000 | Yes | Yes |
| Flexible Allowance | All Templates | Transport | 10,000 | Yes | No |
| Fixed Deduction | All Templates | EPF 8% | - | No | Yes |
| Conditional Bonus | Executive | Performance | - | Yes | No |

### Why Through Model?

```
Comparison: Simple vs Through
══════════════════════════════

Simple ManyToManyField:
├── Only records association
├── No additional configuration
├── Same value for all instances
└── Limited flexibility

Through Model (TemplateComponent):
├── Records association + configuration
├── Template-specific defaults
├── Different values per template
├── Override permissions
├── Validation constraints
└── Full flexibility
```

### Data Integrity Considerations

```
Referential Integrity Rules
════════════════════════════

1. Tenant Consistency:
   ├── TemplateComponent.tenant
   ├── Must match SalaryTemplate.tenant
   └── Must match SalaryComponent.tenant

2. Deletion Behavior:
   ├── If SalaryTemplate deleted → CASCADE
   │   └── Delete all TemplateComponent links
   ├── If SalaryComponent deleted → PROTECT
   │   └── Prevent if used in templates
   │   └── Admin must remove from templates first

3. Uniqueness:
   └── One TemplateComponent per (template, component) pair
       └── Cannot add same component twice to template
```

### Configuration Flow

```
Component Configuration Hierarchy
══════════════════════════════════

1. Component Definition (SalaryComponent)
   └── Base settings (type, calculation, default)
       │
       ▼
2. Template Configuration (TemplateComponent)
   └── Template-specific overrides
       └── Default value for this template
       └── Override permissions
       └── Validation ranges
       │
       ▼
3. Employee Configuration (EmployeeSalary)
   └── Employee-specific values (if override allowed)
       └── Final value applied to employee
```

### Expected Outcome
- TemplateComponent model class created
- Junction table pattern established
- Foundation for many-to-many with configuration
- Model ready for relationship and configuration fields
- Comprehensive documentation in place

### Verification Checklist
- [ ] template_component.py file created
- [ ] Required Django modules imported
- [ ] SalaryTemplate and SalaryComponent imported
- [ ] TemplateComponent class defined with mixins
- [ ] Comprehensive model docstring added
- [ ] File ready for field additions
- [ ] Junction table concept clearly documented

---

## Task 25: Add Template Component Fields

### Overview
Add the core ForeignKey relationships that link TemplateComponent to both SalaryTemplate and SalaryComponent models. These fields establish the many-to-many relationship foundation that allows templates to contain multiple components and components to belong to multiple templates.

### Dependencies
- Task 24: Create TemplateComponent Model

### Instructions

1. **Open template_component.py model file**
   - Navigate to `apps/payroll/models/template_component.py`
   - Locate the TemplateComponent model class

2. **Add template field**
   - ForeignKey to SalaryTemplate model
   - Required field (no blank/null)
   - Use CASCADE delete behavior (if template deleted, component links deleted)
   - Use related_name='template_components'
   - Add db_index=True for query performance

3. **Add component field**
   - ForeignKey to SalaryComponent model
   - Required field (no blank/null)
   - Use PROTECT delete behavior (prevent deletion if used in templates)
   - Use related_name='template_usages'
   - Add db_index=True for query performance

4. **Add field help texts**
   - template: Explain template association
   - component: Explain component being configured

5. **Add Meta class**
   - Define verbose_name as "Template Component"
   - Define verbose_name_plural as "Template Components"
   - Add unique_together constraint for (tenant, template, component)
   - Set default ordering by (template, display_order)
   - Add indexes for common query patterns

6. **Add __str__ method**
   - Return meaningful string representation
   - Format: "Template Name - Component Name"
   - Include value if configured

7. **Update model docstring**
   - Document ForeignKey relationships
   - Explain deletion behaviors
   - Note unique constraint purpose

### Template Component Relationships

```
┌──────────────────────────────────────────────────┐
│       TemplateComponent Relationships            │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────┐                                 │
│  │   Tenant    │                                 │
│  └──────┬──────┘                                 │
│         │ (inherited from TenantAwareMixin)      │
│         │                                         │
│    ┌────┴────┬──────────────────┬─────┐          │
│    │         │                  │     │          │
│    ▼         ▼                  ▼     ▼          │
│  ┌────────┐ ┌────────────────┐ ┌──────────┐     │
│  │Template│ │TemplateComponent│ │Component │     │
│  │        │◄┤ template FK     │ │          │     │
│  │        │ │ component FK    ├─►          │     │
│  └────────┘ └────────────────┘ └──────────┘     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### ForeignKey Configuration

| Field | References | on_delete | required | related_name |
|-------|-----------|-----------|----------|--------------|
| template | SalaryTemplate | CASCADE | Yes | template_components |
| component | SalaryComponent | PROTECT | Yes | template_usages |

### Delete Behavior Explained

#### CASCADE on Template
```
When SalaryTemplate deleted:
└── All associated TemplateComponent records deleted

Example:
Template "Senior Package" deleted
├── TemplateComponent linking to "Basic Salary" → DELETED
├── TemplateComponent linking to "Transport" → DELETED
└── TemplateComponent linking to "Medical" → DELETED

Note: SalaryComponent records remain intact
      (only the links are removed)
```

#### PROTECT on Component
```
When attempting to delete SalaryComponent in use:
└── Deletion prevented with error

Example:
Trying to delete "Basic Salary" component
└── ERROR: Cannot delete - used in 5 templates
    └── Admin must:
        ├── Remove component from all templates first
        └── Then can delete component

Purpose: Prevents accidental data loss
```

### Unique Constraint

```
Unique Together: (tenant, template, component)
═══════════════════════════════════════════════

Prevents duplicate component in same template:

VALID:
Template "Senior Package"
├── Basic Salary (default: 150K)
├── Transport (default: 15K)
└── Medical (default: 10K)

INVALID (will error):
Template "Senior Package"
├── Basic Salary (default: 150K)
├── Transport (default: 15K)
├── Medical (default: 10K)
└── Basic Salary (default: 180K)  ← DUPLICATE! Not allowed
```

### Reverse Relationships Usage

```
Reverse Lookup Examples (for reference)
═══════════════════════════════════════

From Template to Components:
────────────────────────────
# Get all component links for a template
template.template_components.all()

# Get all actual components in template
template.template_components.values_list('component', flat=True)

# Count components in template
template.template_components.count()


From Component to Templates:
─────────────────────────────
# Get all templates using this component
component.template_usages.all()

# Check if component used in any template
component.template_usages.exists()

# Count templates using this component
component.template_usages.count()
```

### Relationship Patterns

#### Pattern 1: Single Template, Multiple Components
```
Template: "Senior Developer Package"
└── TemplateComponent links:
    ├── Link to "Basic Salary"
    ├── Link to "Transport Allowance"
    ├── Link to "Professional Development"
    ├── Link to "EPF Employee 8%"
    └── Link to "PAYE Tax"
```

#### Pattern 2: Single Component, Multiple Templates
```
Component: "Basic Salary"
└── Used in TemplateComponent links:
    ├── "Senior Developer Package"
    ├── "Junior Developer Package"
    ├── "Manager Package"
    ├── "Executive Package"
    └── "Entry Level Package"
```

#### Pattern 3: Template Hierarchy
```
Executive Package:
├── Basic Salary (200K)
├── Housing Allowance (50K)
└── Car Allowance (30K)

Senior Package:
├── Basic Salary (150K)
├── Transport Allowance (15K)
└── Medical Allowance (10K)

Junior Package:
├── Basic Salary (80K)
└── Transport Allowance (10K)
```

### Database Indexes

```
Index Strategy
══════════════

Primary Indexes:
├── (tenant, template) - List components in template
├── (tenant, component) - Find templates using component
└── (template, component) - Uniqueness validation

Composite Indexes:
├── (tenant, template, is_mandatory) - Required components
└── (template, display_order) - Ordered component list
```

### Query Performance Considerations

```
Efficient Queries
═════════════════

Good (indexed):
└── Filter by template + tenant
└── Filter by component + tenant
└── Order by display_order within template

Less Efficient (not indexed):
└── Filter by default_value ranges
└── Filter by can_override boolean
└── Complex OR conditions across fields
```

### String Representation Examples

```
__str__ Method Output Examples
═══════════════════════════════

Basic format:
"Senior Package - Basic Salary"

With value:
"Senior Package - Basic Salary (150,000.00)"

With status:
"Senior Package - Transport Allowance (15,000.00) [Mandatory]"

Compact format:
"TMPL-SR > Basic Salary"
```

### Expected Outcome
- Template ForeignKey establishes template association
- Component ForeignKey establishes component association
- Proper deletion behaviors configured
- Unique constraint prevents duplicates
- Reverse relationships available
- String representation shows meaningful info

### Verification Checklist
- [ ] template ForeignKey field added
- [ ] template field uses CASCADE delete
- [ ] template field has related_name='template_components'
- [ ] template field has db_index=True
- [ ] component ForeignKey field added
- [ ] component field uses PROTECT delete
- [ ] component field has related_name='template_usages'
- [ ] component field has db_index=True
- [ ] Meta class defined with verbose names
- [ ] unique_together set for (tenant, template, component)
- [ ] ordering set by (template, display_order)
- [ ] __str__ method returns template and component names
- [ ] Model docstring updated with relationship details

---

## Task 26: Add Default Value Field

### Overview
Add the default_value field to TemplateComponent model to store template-specific default values for components. This field allows templates to override the component's default value with a template-specific amount, providing flexibility in creating different compensation packages with the same components.

### Dependencies
- Task 25: Add Template Component Fields

### Instructions

1. **Open template_component.py model file**
   - Continue in `apps/payroll/models/template_component.py`
   - Locate the TemplateComponent model class

2. **Add default_value field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional (blank=True, null=True)
   - Stores template-specific default amount
   - Overrides component's default_value when set

3. **Add field help text**
   - Explain template-specific default concept
   - Note that null means use component's default
   - Indicate this is used when assigning template to employee

4. **Add field validation logic**
   - Consider adding clean() method
   - Validate that default_value is within min/max range (when those fields added)
   - Check component type compatibility

5. **Update model docstring**
   - Document default_value field purpose
   - Explain override hierarchy (component → template → employee)
   - Provide examples of when to use

### Default Value Purpose

```
Value Override Hierarchy
════════════════════════

Level 1: Component Default
└── Base default value defined in SalaryComponent
    Example: Basic Salary component default = 100,000

Level 2: Template Default (THIS TASK)
└── Template-specific override in TemplateComponent
    Example: Senior Package overrides to 150,000
    Example: Junior Package overrides to 80,000

Level 3: Employee Value (Future)
└── Employee-specific value (if can_override = True)
    Example: John's Basic Salary = 165,000 (within template range)

Final Value Selection:
If employee value exists → Use employee value
Else if template default exists → Use template default
Else → Use component default
```

### Default Value Field Details

```
┌─────────────────────────────────────────────┐
│         default_value Field                 │
├─────────────────────────────────────────────┤
│ Type: DecimalField                          │
│ max_digits: 12 (up to 999,999,999.99)       │
│ decimal_places: 2 (cent precision)          │
│ Required: No (blank=True, null=True)        │
│ Purpose: Template-specific default amount   │
│                                             │
│ When null:                                  │
│  └── Use component's default_value          │
│                                             │
│ When set:                                   │
│  └── Override component's default           │
│      └── Use this value for this template   │
└─────────────────────────────────────────────┘
```

### Use Case Examples

#### Example 1: Same Component, Different Templates
```
Component: "Basic Salary"
└── Component default: 100,000.00

Template: "Senior Developer Package"
└── default_value: 150,000.00
    └── Overrides component default

Template: "Junior Developer Package"
└── default_value: 80,000.00
    └── Overrides component default

Template: "Contract Package"
└── default_value: null
    └── Uses component default (100,000.00)
```

#### Example 2: Allowances by Template
```
Component: "Transport Allowance"
└── Component default: 10,000.00

Template: "Executive Package"
└── default_value: 30,000.00 (higher for executives)

Template: "Manager Package"
└── default_value: 20,000.00 (moderate)

Template: "Staff Package"
└── default_value: null (uses component default 10,000)

Template: "Remote Worker Package"
└── default_value: 0.00 (no transport for remote)
```

#### Example 3: Grade-Based Salary Ranges
```
Component: "Basic Salary"

Grade G5 Template:
└── default_value: 155,000.00 (mid-point of 130K-180K range)

Grade G4 Template:
└── default_value: 115,000.00 (mid-point of 100K-130K range)

Grade G3 Template:
└── default_value: 87,500.00 (mid-point of 75K-100K range)
```

### Value Application Scenarios

| Scenario | Component Default | Template Default | Employee Value | Applied Value |
|----------|------------------|------------------|----------------|---------------|
| Standard case | 100,000 | 150,000 | null | 150,000 |
| Employee override | 100,000 | 150,000 | 165,000 | 165,000 |
| No template default | 100,000 | null | null | 100,000 |
| Zero override | 10,000 | 0.00 | null | 0.00 |
| All levels set | 100,000 | 150,000 | 155,000 | 155,000 |

### Decimal Field Considerations

```
Decimal Precision
═════════════════

max_digits = 12
decimal_places = 2

Valid Values:
├── 0.00
├── 150,000.00
├── 1,234,567.89
├── 99,999,999.99
└── 999,999,999.99

Maximum: 9,999,999,999.99 (12 digits total, 2 after decimal)

Sri Lanka Context:
├── Average salary: 50,000 - 200,000 (well within range)
├── Executive salary: 500,000 - 2,000,000 (supported)
├── CEO salary: 5,000,000+ (supported)
└── Allowances: 5,000 - 100,000 (supported)
```

### Null vs Zero

```
Important Distinction
═════════════════════

null (None):
├── Means: Not set, use component default
├── Behavior: Inherit from component
└── Use case: Standard component value applies

0.00 (Zero):
├── Means: Explicitly set to zero
├── Behavior: Component value is zero
└── Use case: Exclude this component effectively

Example:
Component: Housing Allowance (default: 20,000)

Template A:
└── default_value: null → Employee gets 20,000

Template B:
└── default_value: 0.00 → Employee gets 0 (no housing allowance)
```

### Template Default Examples by Industry

#### IT Company
```
Basic Salary Component:

Templates:
├── CTO Package: 500,000.00
├── Tech Lead: 200,000.00
├── Senior Dev: 150,000.00
├── Mid-Level Dev: 100,000.00
└── Junior Dev: 60,000.00
```

#### Retail Business
```
Basic Salary Component:

Templates:
├── Store Manager: 80,000.00
├── Supervisor: 55,000.00
├── Senior Cashier: 45,000.00
└── Cashier: 35,000.00
```

#### Manufacturing
```
Basic Salary Component:

Templates:
├── Production Manager: 120,000.00
├── Supervisor: 70,000.00
├── Skilled Worker: 50,000.00
└── General Worker: 35,000.00
```

### Validation Considerations

```
Value Validation (to be implemented)
════════════════════════════════════

Checks to add in clean() method:

1. Range Validation:
   └── If min_value and max_value set:
       └── Ensure min_value ≤ default_value ≤ max_value

2. Component Type Validation:
   └── If component is percentage-based:
       └── May not need default_value (calculated)
   └── If component is fixed amount:
       └── default_value recommended

3. Negative Value Check:
   └── For earnings: default_value ≥ 0
   └── For deductions: handle appropriately

4. Currency Alignment:
   └── Ensure value matches tenant currency
   └── Consider exchange rates for multi-currency
```

### Expected Outcome
- default_value field stores template-specific defaults
- Null value means inherit from component
- Explicit zero means component value is zero
- Decimal precision supports currency amounts
- Foundation for value override hierarchy

### Verification Checklist
- [ ] default_value DecimalField added
- [ ] max_digits=12, decimal_places=2 configured
- [ ] Field is optional (blank=True, null=True)
- [ ] help_text explains template-specific default
- [ ] help_text clarifies null vs zero behavior
- [ ] Model docstring updated with default_value purpose
- [ ] Examples of value hierarchy documented

---

## Task 27: Add Override Fields

### Overview
Add fields that control override permissions and validation ranges for template components. These fields enable fine-grained control over whether component values can be modified at the employee level, and if so, within what constraints. Additionally, add mandatory flag and display ordering fields.

### Dependencies
- Task 26: Add Default Value Field

### Instructions

1. **Open template_component.py model file**
   - Continue in `apps/payroll/models/template_component.py`
   - Locate the TemplateComponent model class

2. **Add can_override field**
   - BooleanField with default=True
   - Controls whether HR can modify value for individual employees
   - When False, all employees get exact template default

3. **Add min_value field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional (blank=True, null=True)
   - Defines minimum allowed value if override permitted
   - Used for validation during employee salary assignment

4. **Add max_value field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional (blank=True, null=True)
   - Defines maximum allowed value if override permitted
   - Used for validation during employee salary assignment

5. **Add is_mandatory field**
   - BooleanField with default=True
   - Indicates if component must be included
   - When False, component is optional in employee salary

6. **Add display_order field**
   - IntegerField with default=0
   - Controls sort order when displaying template components
   - Lower numbers appear first
   - Used in UI and reports

7. **Add field help texts**
   - Explain each field's purpose clearly
   - Provide guidance on when to use
   - Note validation implications

8. **Add validation method**
   - Implement clean() method
   - Validate min ≤ default ≤ max when all set
   - Ensure logical consistency of override settings
   - Check mandatory status against override permissions

9. **Update Meta class**
   - Update ordering to include display_order
   - Add indexes for filtering by mandatory status

10. **Update model docstring**
    - Document all override and control fields
    - Explain validation logic
    - Provide configuration examples

### Override Control Fields

```
┌──────────────────────────────────────────────────┐
│          Override & Control Fields               │
├──────────────────────────────────────────────────┤
│                                                  │
│ can_override (BooleanField)                      │
│  └── Allow employee-level value changes          │
│                                                  │
│ min_value (DecimalField, optional)               │
│  └── Minimum allowed value if override=True      │
│                                                  │
│ max_value (DecimalField, optional)               │
│  └── Maximum allowed value if override=True      │
│                                                  │
│ is_mandatory (BooleanField)                      │
│  └── Component must be included in employee salary│
│                                                  │
│ display_order (IntegerField)                     │
│  └── Sort order in displays and reports          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### can_override Field Logic

```
Override Permission Behavior
════════════════════════════

can_override = True (Default):
├── HR can modify value for individual employees
├── Must stay within min_value and max_value range
├── Allows salary negotiation
└── Enables performance-based adjustments

can_override = False:
├── All employees get exact template default_value
├── No employee-level modifications allowed
├── Ensures strict standardization
└── Used for statutory components (e.g., EPF rate)
```

### Validation Range Examples

#### Example 1: Flexible Basic Salary
```
Component in Template: "Basic Salary"
├── default_value: 150,000.00
├── can_override: True
├── min_value: 120,000.00
├── max_value: 200,000.00
└── is_mandatory: True

Behavior:
├── New employee defaults to 150,000
├── HR can negotiate between 120,000 and 200,000
├── Cannot go below 120,000 or above 200,000
└── Must be included in employee package
```

#### Example 2: Fixed Statutory Component
```
Component in Template: "EPF Employee (8%)"
├── default_value: null (calculated)
├── can_override: False
├── min_value: null
├── max_value: null
└── is_mandatory: True

Behavior:
├── Calculated as 8% of basic salary
├── Cannot be modified by HR
├── No range validation needed
└── Must be included (statutory requirement)
```

#### Example 3: Optional Allowance with Range
```
Component in Template: "Performance Bonus"
├── default_value: 25,000.00
├── can_override: True
├── min_value: 0.00
├── max_value: 50,000.00
└── is_mandatory: False

Behavior:
├── Defaults to 25,000 if included
├── HR can set between 0 and 50,000
├── Can be excluded from employee package
└── Used for performance-based compensation
```

### Field Combinations Matrix

| can_override | min_value | max_value | is_mandatory | Use Case |
|--------------|-----------|-----------|--------------|----------|
| True | Set | Set | True | Flexible required component |
| False | null | null | True | Fixed required component |
| True | Set | Set | False | Flexible optional component |
| False | null | null | False | Fixed optional component |
| True | 0 | Set | False | Variable bonus/incentive |

### Display Order Configuration

```
Display Order Examples
══════════════════════

Template: "Senior Developer Package"

display_order: 10
└── Basic Salary

display_order: 20
└── Professional Development Allowance

display_order: 30
└── Transport Allowance

display_order: 40
└── Medical Allowance

display_order: 100
└── EPF Employee (8%)

display_order: 110
└── EPF Employer (12%)

display_order: 120
└── PAYE Tax

Result: Components display in this order in UI
```

### Typical Display Order Ranges

| Range | Component Type | Examples |
|-------|---------------|----------|
| 1-50 | Basic earnings | Basic salary, base pay |
| 51-100 | Allowances | Transport, medical, housing |
| 101-150 | Bonuses/Incentives | Performance, attendance |
| 151-200 | Employee deductions | EPF employee, loan deductions |
| 201-250 | Employer contributions | EPF employer, ETF |
| 251-300 | Taxes | PAYE, other statutory taxes |

### Validation Logic

```
clean() Method Validation Rules
════════════════════════════════

Rule 1: Range Consistency
├── If min_value and max_value both set:
│   └── Ensure min_value ≤ max_value
└── Raise ValidationError if violated

Rule 2: Default Within Range
├── If default_value, min_value, and max_value all set:
│   └── Ensure min_value ≤ default_value ≤ max_value
└── Raise ValidationError if violated

Rule 3: Override Logic
├── If can_override = False:
│   └── min_value and max_value should be null
│   └── (No range needed if cannot override)
└── Warning or ignore if set

Rule 4: Mandatory + Optional Conflict
├── is_mandatory should be boolean, no conflict possible
├── But validate with business logic
└── E.g., statutory components must be mandatory
```

### Validation Examples

#### Valid Configuration
```python
# Flexible salary with proper range
default_value = 150,000.00
can_override = True
min_value = 120,000.00  # min < default
max_value = 200,000.00  # default < max
is_mandatory = True
display_order = 10

# Validation passes: min ≤ default ≤ max
```

#### Invalid Configuration 1
```python
# Invalid: default outside range
default_value = 250,000.00  # > max!
can_override = True
min_value = 120,000.00
max_value = 200,000.00

# ValidationError: default_value exceeds max_value
```

#### Invalid Configuration 2
```python
# Invalid: min > max
default_value = 150,000.00
can_override = True
min_value = 200,000.00  # > max!
max_value = 120,000.00

# ValidationError: min_value cannot exceed max_value
```

### Configuration Scenarios by Component Type

#### Scenario 1: Basic Salary (Negotiable)
```
default_value: 150,000.00
can_override: True
min_value: 130,000.00 (grade minimum)
max_value: 180,000.00 (grade maximum)
is_mandatory: True
display_order: 10
```

#### Scenario 2: Fixed Allowance
```
default_value: 15,000.00
can_override: False
min_value: null (not applicable)
max_value: null (not applicable)
is_mandatory: True
display_order: 30
```

#### Scenario 3: Variable Bonus
```
default_value: 0.00 (starts at zero)
can_override: True
min_value: 0.00 (can be zero)
max_value: 100,000.00 (cap)
is_mandatory: False (optional)
display_order: 150
```

#### Scenario 4: Statutory Deduction
```
default_value: null (calculated)
can_override: False
min_value: null
max_value: null
is_mandatory: True
display_order: 200
```

### Sri Lanka Salary Components Configuration

#### EPF Employee (8%)
```
can_override: False (statutory rate)
is_mandatory: True (required by law)
display_order: 200
```

#### EPF Employer (12%)
```
can_override: False (statutory rate)
is_mandatory: True (required by law)
display_order: 210
```

#### ETF (3%)
```
can_override: False (statutory rate)
is_mandatory: True (required by law)
display_order: 220
```

#### PAYE Tax
```
can_override: False (calculated per tax slabs)
is_mandatory: True (for salaries above threshold)
display_order: 250
```

### Expected Outcome
- can_override controls employee-level modifications
- min_value and max_value set validation ranges
- is_mandatory marks required components
- display_order controls UI presentation
- Validation ensures data consistency
- Flexible configuration for various scenarios

### Verification Checklist
- [ ] can_override BooleanField added with default=True
- [ ] min_value DecimalField added (optional)
- [ ] max_value DecimalField added (optional)
- [ ] is_mandatory BooleanField added with default=True
- [ ] display_order IntegerField added with default=0
- [ ] All fields have comprehensive help_text
- [ ] clean() method validates range consistency
- [ ] clean() method validates default within range
- [ ] clean() method validates min ≤ max
- [ ] Meta ordering updated to include display_order
- [ ] Model docstring updated with all field details
- [ ] Configuration examples documented

---

## Task 28: Run TemplateComponent Migrations

### Overview
Create and apply database migrations for the TemplateComponent model. This task generates the migration file that creates the junction table with all fields defined in tasks 24-27, including the foreign keys, configuration fields, override settings, and constraints.

### Dependencies
- Task 24: Create TemplateComponent Model
- Task 25: Add Template Component Fields
- Task 26: Add Default Value Field
- Task 27: Add Override Fields
- PostgreSQL database configured
- SalaryTemplate migrations applied (Task 23)

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/template_component.py`
   - Confirm all fields properly defined
   - Check ForeignKey relationships
   - Verify Meta class complete
   - Ensure clean() method implemented

2. **Update models __init__.py**
   - Open `apps/payroll/models/__init__.py`
   - Import TemplateComponent model
   - Add TemplateComponent to __all__ list
   - Ensure proper module exports

3. **Run Django system check**
   - Execute check command for payroll app
   - Verify no system check errors
   - Fix any issues before migration
   - Confirm all relationships valid

4. **Create migration file**
   - Run makemigrations command for payroll app
   - Review generated migration file
   - Verify all fields included
   - Check unique constraints

5. **Review migration file**
   - Open generated migration in apps/payroll/migrations/
   - Verify field definitions match model
   - Check ForeignKey configurations
   - Confirm indexes created
   - Verify unique_together constraint

6. **Apply migration**
   - Run migrate command for payroll app
   - Monitor for errors during application
   - Verify successful migration
   - Check database table creation

7. **Verify database table**
   - Confirm template_component table exists
   - Verify all columns present
   - Check foreign key constraints
   - Confirm indexes created
   - Verify unique constraint active

8. **Test model functionality**
   - Open Django shell
   - Import TemplateComponent model
   - Create test instance with template and component
   - Verify save operation
   - Test validation rules
   - Clean up test data

### Migration File Structure

```
Migration File Components
═════════════════════════

Migration Class:
├── dependencies
│   ├── Previous payroll migration (0002_salary_template)
│   └── SalaryComponent migration (from Group A)
│
└── operations
    └── CreateModel
        ├── name: 'TemplateComponent'
        ├── fields:
        │   ├── id (AutoField, primary key)
        │   ├── tenant (ForeignKey to Tenant)
        │   ├── template (ForeignKey to SalaryTemplate, CASCADE)
        │   ├── component (ForeignKey to SalaryComponent, PROTECT)
        │   ├── default_value (DecimalField, nullable)
        │   ├── can_override (BooleanField, default=True)
        │   ├── min_value (DecimalField, nullable)
        │   ├── max_value (DecimalField, nullable)
        │   ├── is_mandatory (BooleanField, default=True)
        │   ├── display_order (IntegerField, default=0)
        │   ├── created_at (DateTimeField, auto_now_add)
        │   └── updated_at (DateTimeField, auto_now)
        │
        └── options:
            ├── verbose_name: 'Template Component'
            ├── verbose_name_plural: 'Template Components'
            ├── ordering: ['template', 'display_order']
            ├── unique_together: [['tenant', 'template', 'component']]
            └── indexes: [...]
```

### Database Table Structure

```sql
-- Expected table structure (for reference)

CREATE TABLE payroll_template_component (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenant(id),
    template_id INTEGER NOT NULL REFERENCES payroll_salary_template(id) ON DELETE CASCADE,
    component_id INTEGER NOT NULL REFERENCES payroll_salary_component(id) ON DELETE PROTECT,
    default_value NUMERIC(12, 2) NULL,
    can_override BOOLEAN NOT NULL DEFAULT TRUE,
    min_value NUMERIC(12, 2) NULL,
    max_value NUMERIC(12, 2) NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Unique constraint
    CONSTRAINT unique_tenant_template_component 
        UNIQUE (tenant_id, template_id, component_id)
);

-- Indexes
CREATE INDEX idx_template_component_tenant ON payroll_template_component(tenant_id);
CREATE INDEX idx_template_component_template ON payroll_template_component(template_id);
CREATE INDEX idx_template_component_component ON payroll_template_component(component_id);
CREATE INDEX idx_template_component_display ON payroll_template_component(template_id, display_order);
CREATE INDEX idx_template_component_mandatory ON payroll_template_component(template_id, is_mandatory);
```

### Migration Commands

#### Step 1: System Check
```bash
python manage.py check payroll
```
**Expected Output:**
```
System check identified no issues (0 silenced).
```

#### Step 2: Create Migration
```bash
python manage.py makemigrations payroll
```
**Expected Output:**
```
Migrations for 'payroll':
  apps/payroll/migrations/0003_template_component.py
    - Create model TemplateComponent
```

#### Step 3: Review Migration SQL
```bash
python manage.py sqlmigrate payroll 0003
```
**Purpose:** Preview SQL statements

#### Step 4: Apply Migration
```bash
python manage.py migrate payroll
```
**Expected Output:**
```
Operations to perform:
  Apply all migrations: payroll
Running migrations:
  Applying payroll.0003_template_component... OK
```

### Verification Queries

#### Check Table Exists
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payroll_template_component'
);
```

#### Check All Columns
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'payroll_template_component'
ORDER BY ordinal_position;
```

#### Verify Foreign Keys
```sql
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'payroll_template_component'
AND tc.constraint_type = 'FOREIGN KEY';
```

#### Check Unique Constraint
```sql
SELECT conname, contype, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'payroll_template_component'::regclass
AND contype = 'u';
```

### Post-Migration Testing

```python
# Django Shell Testing Script
# ===========================

from apps.payroll.models import SalaryTemplate, SalaryComponent, TemplateComponent
from apps.core.models import Tenant

# Get tenant
tenant = Tenant.objects.first()

# Get or create test template
template = SalaryTemplate.objects.create(
    tenant=tenant,
    name="Test Template",
    code="TMPL-TEST",
    is_active=True
)

# Get or create test component
component = SalaryComponent.objects.create(
    tenant=tenant,
    name="Test Component",
    code="COMP-TEST",
    component_type="EARNING",
    calculation_type="FIXED",
    is_active=True
)

# Create template component link
tc = TemplateComponent.objects.create(
    tenant=tenant,
    template=template,
    component=component,
    default_value=100000.00,
    can_override=True,
    min_value=80000.00,
    max_value=120000.00,
    is_mandatory=True,
    display_order=10
)

print(f"Created: {tc}")
print(f"Template: {tc.template.name}")
print(f"Component: {tc.component.name}")
print(f"Default: {tc.default_value}")

# Test validation
tc2 = TemplateComponent(
    tenant=tenant,
    template=template,
    component=component,  # Duplicate!
    default_value=150000.00
)

try:
    tc2.save()
    print("ERROR: Should have failed unique constraint!")
except Exception as e:
    print(f"Good: Unique constraint works - {e}")

# Clean up
tc.delete()
component.delete()
template.delete()

print("Test completed successfully!")
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Field missing | Model not saved before migration | Save model file, regenerate migration |
| FK constraint error | Referenced model not migrated | Ensure dependencies migrated first |
| Unique constraint violation | Test data conflicts | Clear conflicting data before migration |
| Decimal field error | Wrong precision/scale | Verify max_digits and decimal_places |
| Import error | Model not in __init__.py | Add import to models package |

### Testing Checklist

```
Post-Migration Verification
═══════════════════════════

Database Level:
├── [ ] Table created
├── [ ] All columns present
├── [ ] Foreign keys configured
├── [ ] Unique constraint active
├── [ ] Indexes created
└── [ ] Default values correct

Model Level:
├── [ ] Can create TemplateComponent
├── [ ] Can link template to component
├── [ ] Can set default_value
├── [ ] Can set min/max values
├── [ ] Can set override permissions
├── [ ] Can set display_order
├── [ ] Unique constraint prevents duplicates
└── [ ] Validation rules enforced

Admin Interface:
├── [ ] /admin/payroll/templatecomponent/ accessible
├── [ ] List view displays
├── [ ] Add form renders
├── [ ] ForeignKey dropdowns work
└── [ ] Help texts visible
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Foreign key relationships established
- Unique constraint prevents duplicate components in template
- Indexes optimize query performance
- Model fully operational
- Junction table complete

### Verification Checklist
- [ ] TemplateComponent imported in models __init__.py
- [ ] Django check command passes
- [ ] makemigrations creates migration file
- [ ] Migration file has all fields
- [ ] Migration file has proper dependencies
- [ ] migrate command executes successfully
- [ ] Database table created
- [ ] All columns present
- [ ] Foreign keys configured correctly (CASCADE and PROTECT)
- [ ] Unique constraint on (tenant, template, component) active
- [ ] Indexes created
- [ ] Test TemplateComponent can be created
- [ ] Duplicate prevention works
- [ ] Validation rules enforced

---

## Summary

This document established the salary template and template component infrastructure:

### Completed Models
- ✅ SalaryTemplate - Template container model
- ✅ Template core fields (name, code, description)
- ✅ Template designation link (optional FK)
- ✅ Template status field (is_active)
- ✅ SalaryTemplate migrations applied
- ✅ TemplateComponent - Junction model with configuration
- ✅ Template and component ForeignKeys
- ✅ Default value field (template-specific defaults)
- ✅ Override fields (permissions, ranges, mandatory, display order)
- ✅ TemplateComponent migrations applied

### Key Achievements

1. **Template System** - Reusable salary packages
2. **Designation Linking** - Auto-assignment support
3. **Configuration Flexibility** - Template-specific defaults
4. **Override Control** - Employee-level customization rules
5. **Validation Ranges** - Min/max constraints
6. **Display Management** - Ordering and presentation control

### Template Component Configuration

Templates now support:
- Multiple components with individual defaults
- Override permissions per component
- Validation ranges (min/max values)
- Mandatory vs optional components
- Display order management
- Designation-based assignment

### Next Steps

Proceed to [02_Tasks-29-34_SalaryGrade-Seed.md](02_Tasks-29-34_SalaryGrade-Seed.md) to implement:
- SalaryGrade model for salary bands
- Grade salary ranges
- Grade-template linking
- Default grades seed data

---

**Document Status:** ✅ Complete  
**Tasks Completed:** 19-28 (10 tasks)  
**Models Created:** SalaryTemplate, TemplateComponent  
**Migrations Applied:** 0002_salary_template, 0003_template_component

