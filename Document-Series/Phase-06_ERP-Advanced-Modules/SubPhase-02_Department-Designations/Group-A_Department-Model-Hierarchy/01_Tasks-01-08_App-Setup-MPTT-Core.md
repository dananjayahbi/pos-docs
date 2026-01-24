# Tasks 01-08: App Setup, MPTT, and Core Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** A - Department Model & Hierarchy  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Manager-Location-Budget-Index.md](02_Tasks-09-16_Manager-Location-Budget-Index.md)

---

## Document Overview

This document covers the foundation of the department hierarchy system, including the creation of the organization Django app, installation of django-mptt for hierarchical data management, definition of department status constants, and implementation of core department model fields with MPTT tree structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create organization Django App | Low | 15 min |
| 02 | Register organization App | Low | 10 min |
| 03 | Install django-mptt | Low | 15 min |
| 04 | Define DepartmentStatus Choices | Low | 10 min |
| 05 | Create Department Model Core | Medium | 25 min |
| 06 | Add Department Description | Low | 15 min |
| 07 | Add Parent FK for Hierarchy | Medium | 25 min |
| 08 | Add MPTT Fields | Medium | 20 min |

---

## Task 01: Create Organization Django App

### Overview
Create the `organization` Django app to manage organizational structure including departments and designations. This app will be a tenant-specific app containing models and business logic for organizational hierarchy management.

### Dependencies
- Django project structure is established
- Backend project initialization is complete
- Multi-tenancy setup is configured

### Instructions

1. **Create organization app**
   - Navigate to `apps/` directory in backend project
   - Use Django's startapp command to create new app
   - Name the app `organization`

2. **Create app directory structure**
   - Ensure `organization/` directory is created
   - Verify standard Django app files exist (models.py, views.py, etc.)

3. **Create models package**
   - Delete default `models.py` file
   - Create `models/` directory
   - Create `__init__.py` inside models directory
   - This allows better organization of multiple models

4. **Create services package**
   - Create `services/` directory inside organization app
   - Create `__init__.py` inside services directory
   - Will contain business logic and utilities

5. **Create constants module**
   - Create `constants.py` file in organization app root
   - Will store choice constants and enumerations

6. **Update app configuration**
   - Open `apps.py` file
   - Verify app name is correctly set
   - Add appropriate app configuration settings

### Directory Structure
```
apps/organization/
├── __init__.py                   # Package initialization
├── apps.py                       # App configuration
├── models/
│   └── __init__.py              # Models package
├── services/
│   └── __init__.py              # Services package
├── constants.py                 # Constants and choices
├── admin.py                     # Django admin
├── views.py                     # Views (future use)
└── tests.py                     # Tests (future use)
```

### App Purpose

| Component | Purpose |
|-----------|---------|
| `models/` | Department, Designation models |
| `services/` | Business logic, code generators |
| `constants.py` | Status choices, constants |
| `admin.py` | Django admin interface |

### Expected Outcome
- Clean organization app structure
- Modular package organization
- Foundation for department and designation models

### Verification Checklist
- [ ] `apps/organization/` directory exists
- [ ] `apps.py` configured correctly
- [ ] `models/` directory created with `__init__.py`
- [ ] `services/` directory created with `__init__.py`
- [ ] `constants.py` file created
- [ ] `admin.py` file exists

---

## Task 02: Register Organization App

### Overview
Register the organization app in Django settings under TENANT_APPS to ensure it's available for all tenant schemas. This makes the organization functionality accessible to each tenant independently.

### Dependencies
- Task 01: Create organization Django App

### Instructions

1. **Open settings file**
   - Navigate to project settings directory
   - Open the appropriate settings file (base.py or settings.py)
   - Locate TENANT_APPS configuration

2. **Add organization app to TENANT_APPS**
   - Find the TENANT_APPS list/tuple
   - Add 'apps.organization' to the list
   - Maintain alphabetical or logical ordering

3. **Verify app path**
   - Ensure the app path is correct
   - Should be 'apps.organization' if apps are in `apps/` directory
   - Adjust path based on your project structure

4. **Consider app dependencies**
   - Place organization app after core apps
   - Ensure it comes after authentication apps
   - Place before apps that depend on organization

### TENANT_APPS Configuration

The organization app should be included in TENANT_APPS because:
- Department data is tenant-specific
- Each tenant has its own organizational structure
- Department hierarchy is isolated per tenant
- Changes affect only the current tenant's schema

### App Registration Order

Recommended order in TENANT_APPS:
```
TENANT_APPS = [
    # Core tenant apps
    'apps.core',
    'apps.users',
    
    # Business apps
    'apps.organization',     # <-- Add here
    'apps.inventory',
    'apps.sales',
    # ... other apps
]
```

### Expected Outcome
- Organization app available to all tenants
- Models created in tenant schemas
- App functionality accessible per tenant

### Verification Checklist
- [ ] 'apps.organization' added to TENANT_APPS
- [ ] App path is correct
- [ ] Settings file saved
- [ ] No syntax errors in settings

---

## Task 03: Install django-mptt

### Overview
Install and configure django-mptt (Modified Preorder Tree Traversal) package to enable efficient hierarchical data management for the department tree structure. MPTT provides optimized database queries for tree operations.

### Dependencies
- Task 01: Create organization Django App
- Task 02: Register organization App

### Instructions

1. **Add django-mptt to requirements**
   - Open requirements.txt or pyproject.toml
   - Add 'django-mptt' with appropriate version
   - Recommended version: django-mptt>=0.14.0

2. **Install the package**
   - Use pip or poetry to install django-mptt
   - Ensure installation completes successfully
   - Verify package is available in environment

3. **Add mptt to INSTALLED_APPS**
   - Open settings file
   - Add 'mptt' to INSTALLED_APPS
   - Place it before TENANT_APPS or in SHARED_APPS

4. **Verify installation**
   - Import mptt in Python shell
   - Check for any errors
   - Confirm MPTT models are available

### MPTT Benefits

| Benefit | Description |
|---------|-------------|
| Efficient Queries | Single query to get entire tree or subtree |
| Fast Ancestors | Get all ancestors without recursive queries |
| Fast Descendants | Get all descendants in one query |
| Level Tracking | Automatic depth tracking |
| Move Operations | Efficient node movement in tree |

### MPTT Tree Operations

#### Common Operations:
- **Get children**: Direct children of a node
- **Get descendants**: All nodes below a node
- **Get ancestors**: All nodes above a node
- **Get root**: Top-level node
- **Get siblings**: Nodes at same level
- **Move node**: Change parent or position

#### Query Performance:
- Traditional recursive approach: O(n) queries
- MPTT approach: O(1) query
- Significant performance improvement for deep trees

### MPTT Fields Explained

| Field | Type | Purpose |
|-------|------|---------|
| lft | Integer | Left boundary of subtree |
| rght | Integer | Right boundary of subtree |
| tree_id | Integer | Identifies which tree node belongs to |
| level | Integer | Depth in tree (0 = root) |

### Expected Outcome
- django-mptt package installed
- MPTT available in Django project
- Foundation for hierarchical department model

### Verification Checklist
- [ ] django-mptt added to requirements
- [ ] Package installed in environment
- [ ] 'mptt' added to INSTALLED_APPS
- [ ] Can import mptt without errors

---

## Task 04: Define DepartmentStatus Choices

### Overview
Define status choice constants for departments to track their operational state. These constants ensure consistency across the application when categorizing and filtering departments.

### Dependencies
- Task 01: Create organization Django App

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/organization/constants.py`
   - Prepare to define department status constants

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain the purpose of constants
   - Note usage context (department status tracking)

3. **Define DepartmentStatus choices**
   - Use Django's TextChoices or similar pattern
   - Include ACTIVE, INACTIVE, ARCHIVED states
   - Provide clear display names

4. **Define ACTIVE status**
   - Value: 'active'
   - Purpose: Currently operational departments
   - Most common status
   - Departments actively used in operations

5. **Define INACTIVE status**
   - Value: 'inactive'
   - Purpose: Temporarily inactive departments
   - Preserved for potential reactivation
   - Not currently in use but not deleted

6. **Define ARCHIVED status**
   - Value: 'archived'
   - Purpose: Historical/legacy departments
   - No longer in organizational structure
   - Kept for historical data and reporting

### Department Status Details

| Status | Value | Display Name | Use Case |
|--------|-------|--------------|----------|
| ACTIVE | 'active' | Active | Currently operational |
| INACTIVE | 'inactive' | Inactive | Temporarily disabled |
| ARCHIVED | 'archived' | Archived | Historical/legacy |

### Status Transition Flow

```
       ┌────────┐
       │ ACTIVE │ ◄─────┐
       └───┬────┘       │
           │            │
           │ Suspend    │ Reactivate
           │            │
           ▼            │
       ┌──────────┐     │
       │ INACTIVE │─────┘
       └────┬─────┘
            │
            │ Archive
            │
            ▼
       ┌──────────┐
       │ ARCHIVED │ (End state)
       └──────────┘
```

### Status Usage Guidelines

#### ACTIVE Status
- Department is currently operational
- Employees can be assigned
- Appears in active department lists
- Used in organizational charts
- Default status for new departments

#### INACTIVE Status
- Department temporarily suspended
- May be reactivated later
- Existing employees retained
- Hidden from active lists
- Visible in historical reports
- Useful during restructuring

#### ARCHIVED Status
- Department no longer exists
- Cannot be reactivated (typically)
- Employees must be reassigned
- Kept for data integrity
- Historical reporting only
- Maintains referential integrity

### Expected Outcome
- Clear department status categorization
- Consistent status values
- Foundation for department lifecycle management
- Support for various operational states

### Verification Checklist
- [ ] DepartmentStatus choices defined
- [ ] ACTIVE status constant created
- [ ] INACTIVE status constant created
- [ ] ARCHIVED status constant created
- [ ] Display names are user-friendly
- [ ] Constants follow naming convention

---

## Task 05: Create Department Model Core

### Overview
Create the core Department model with essential fields including name, code, and status. This establishes the foundation for the department hierarchy system.

### Dependencies
- Task 01: Create organization Django App
- Task 02: Register organization App
- Task 04: Define DepartmentStatus Choices

### Instructions

1. **Create department.py model file**
   - Navigate to `apps/organization/models/`
   - Create new file `department.py`
   - This will contain the Department model

2. **Import required modules**
   - Import Django models
   - Import tenant-aware base model (if available)
   - Import DepartmentStatus from constants
   - Import any utility mixins

3. **Create Department model class**
   - Define class inheriting from appropriate base
   - Use TenantAwareModel or similar base class
   - Add model Meta configuration

4. **Add name field**
   - CharField for department name
   - Max length: 100 characters
   - Required field (not nullable)
   - User-friendly department name
   - Example: "Human Resources", "Finance"

5. **Add code field**
   - CharField for department code
   - Max length: 20 characters
   - Unique constraint per tenant
   - Uppercase formatting recommended
   - Example: "DEPT-HR", "DEPT-FIN"

6. **Add status field**
   - CharField using DepartmentStatus choices
   - Default: ACTIVE
   - Tracks operational state
   - Indexed for performance

7. **Add created_at and updated_at fields**
   - Use auto_now_add for created_at
   - Use auto_now for updated_at
   - Timestamp tracking

8. **Add model string representation**
   - Define `__str__` method
   - Return department name
   - User-friendly display

9. **Configure model Meta**
   - Set verbose_name and verbose_name_plural
   - Add ordering (by name or code)
   - Set db_table name if needed

10. **Export model**
    - Update `models/__init__.py`
    - Import and expose Department model
    - Makes model available for import

### Department Model Core Fields

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| name | CharField(100) | required | Department name |
| code | CharField(20) | unique | Department identifier |
| status | CharField | DepartmentStatus | Operational state |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Modification timestamp |

### Model Design Considerations

#### Name Field
- User-facing department name
- Used in UI and reports
- Should be descriptive
- Examples: "Sales Department", "IT Support"

#### Code Field
- System identifier for department
- Should be unique per tenant
- Useful for integrations and APIs
- Consider auto-generation (later task)
- Format: DEPT-{SHORT_CODE}

#### Status Field
- Tracks department lifecycle
- Enables soft deletion
- Supports department archival
- Used in filtering and queries

### Expected Outcome
- Functional Department model with core fields
- Model ready for hierarchy implementation
- Foundation for department management

### Verification Checklist
- [ ] `department.py` file created
- [ ] Department model class defined
- [ ] name field added
- [ ] code field added with unique constraint
- [ ] status field added with choices
- [ ] Timestamp fields added
- [ ] `__str__` method implemented
- [ ] Meta class configured
- [ ] Model exported in `models/__init__.py`

---

## Task 06: Add Department Description

### Overview
Add description and mission statement fields to the Department model to provide detailed information about the department's purpose, responsibilities, and goals.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add description field**
   - TextField for detailed department description
   - Optional field (blank=True, null=True)
   - Multi-line text support
   - Explain department functions and responsibilities

3. **Add mission_statement field**
   - TextField for department mission statement
   - Optional field (blank=True, null=True)
   - Multi-line text support
   - Department's purpose and objectives

### Description Field Details

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| description | TextField | optional | Department overview and responsibilities |
| mission_statement | TextField | optional | Department goals and purpose |

### Field Usage Guidelines

#### Description Field
- Comprehensive overview of department
- Key responsibilities and functions
- Services provided
- Team composition overview
- Used in department directories
- Visible to all employees

Example content:
```
The Human Resources Department manages employee lifecycle,
recruitment, benefits administration, and employee relations.
Responsible for maintaining compliance with labor laws and
fostering a positive workplace culture.
```

#### Mission Statement Field
- Strategic purpose of department
- Alignment with company goals
- Core values and objectives
- Vision for department's impact
- Used in organizational documents

Example content:
```
To attract, develop, and retain top talent while creating
a supportive work environment that enables all employees
to achieve their full potential and contribute to
organizational success.
```

### Content Recommendations

#### Description Best Practices:
- Be specific and detailed
- List key responsibilities
- Mention reporting relationships
- Include scope of authority
- Reference related departments

#### Mission Statement Best Practices:
- Keep concise and focused
- Align with company mission
- Emphasize value delivery
- Inspire department members
- Guide decision-making

### Expected Outcome
- Enhanced department documentation
- Clear communication of department purpose
- Support for organizational transparency

### Verification Checklist
- [ ] description field added to model
- [ ] Field allows null and blank values
- [ ] mission_statement field added to model
- [ ] Field allows null and blank values
- [ ] Fields are TextField type

---

## Task 07: Add Parent FK for Hierarchy

### Overview
Add a self-referential foreign key to enable parent-child relationships between departments, creating the hierarchical organization structure. This parent field is the foundation for the department tree.

### Dependencies
- Task 05: Create Department Model Core

### Instructions

1. **Open department.py model file**
   - Navigate to `apps/organization/models/department.py`
   - Locate the Department model class

2. **Add parent foreign key field**
   - ForeignKey pointing to 'self'
   - Optional field (null=True, blank=True)
   - Set on_delete behavior
   - Add related_name for reverse queries

3. **Configure on_delete behavior**
   - Use PROTECT or RESTRICT
   - Prevents accidental deletion of parent departments
   - Requires reassignment of child departments first

4. **Set related_name**
   - Use 'children' or 'child_departments'
   - Enables accessing child departments from parent
   - Example: department.children.all()

5. **Add help_text**
   - Explain parent-child relationship
   - Note: null value indicates root department

### Parent Field Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Field Type | ForeignKey('self') | Self-referential relationship |
| Null | True | Root departments have no parent |
| Blank | True | Optional in forms |
| on_delete | PROTECT | Prevent orphaning children |
| related_name | 'children' | Access child departments |

### Hierarchy Structure Explanation

#### Root Departments
- parent field is null
- Top-level organizational units
- Typically: company divisions or main departments
- Example: "Operations", "Finance", "HR"

#### Child Departments
- parent field points to another department
- Sub-units within larger departments
- Can have their own children (nested hierarchy)
- Example: "Payroll" under "Finance"

#### Hierarchy Depth
- No hard limit on nesting levels
- Typically 3-5 levels practical
- Consider organizational complexity
- MPTT handles any depth efficiently

### Department Hierarchy Examples

#### Example 1: Simple Hierarchy
```
Company
├── Operations (parent=null)
├── Finance (parent=null)
└── HR (parent=null)
```

#### Example 2: Nested Hierarchy
```
Company
├── Operations (parent=null)
│   ├── Sales (parent=Operations)
│   ├── Marketing (parent=Operations)
│   └── Customer Service (parent=Operations)
├── Finance (parent=null)
│   ├── Accounts (parent=Finance)
│   │   ├── Accounts Payable (parent=Accounts)
│   │   └── Accounts Receivable (parent=Accounts)
│   └── Treasury (parent=Finance)
└── HR (parent=null)
    ├── Recruitment (parent=HR)
    ├── Benefits (parent=HR)
    └── Training (parent=HR)
```

### Parent-Child Query Examples

#### Get children:
```
department.children.all()
```

#### Get parent:
```
department.parent
```

#### Check if root:
```
department.parent is None
```

#### Get siblings:
```
department.parent.children.exclude(id=department.id)
```

### Expected Outcome
- Self-referential foreign key enables hierarchy
- Foundation for tree structure
- Support for nested departments

### Verification Checklist
- [ ] parent field added as ForeignKey('self')
- [ ] Field allows null and blank
- [ ] on_delete set to PROTECT
- [ ] related_name set to 'children'
- [ ] help_text added

---

## Task 08: Add MPTT Fields

### Overview
Convert the Department model to an MPTT (Modified Preorder Tree Traversal) tree model by inheriting from MPTTModel and configuring necessary MPTT fields and options. This enables efficient tree queries.

### Dependencies
- Task 03: Install django-mptt
- Task 05: Create Department Model Core
- Task 07: Add Parent FK for Hierarchy

### Instructions

1. **Import MPTTModel**
   - Add import statement for MPTTModel
   - Import from mptt.models
   - Will be used as base class

2. **Change model inheritance**
   - Modify Department class to inherit from MPTTModel
   - Also inherit from any tenant-aware base model
   - Use multiple inheritance if needed

3. **Add parent field configuration for MPTT**
   - Ensure parent field is properly configured
   - MPTT expects specific parent field setup
   - Verify ForeignKey points to 'self'

4. **Configure MPTTMeta class**
   - Add inner MPTTMeta class
   - Specify order_insertion_by attribute
   - Controls sibling ordering in tree

5. **Set order_insertion_by**
   - Order siblings by 'name' or 'code'
   - Ensures consistent child ordering
   - Affects tree structure display

6. **Verify MPTT field generation**
   - MPTT automatically adds: lft, rght, tree_id, level
   - These fields manage tree structure
   - No manual addition needed

### MPTT Model Configuration

| Component | Configuration | Purpose |
|-----------|--------------|---------|
| Base Class | MPTTModel | Enables MPTT functionality |
| parent Field | ForeignKey('self') | Defines hierarchy |
| MPTTMeta | order_insertion_by | Controls ordering |

### MPTT Automatically Generated Fields

| Field | Type | Purpose |
|-------|------|---------|
| lft | PositiveIntegerField | Left boundary of subtree |
| rght | PositiveIntegerField | Right boundary of subtree |
| tree_id | PositiveIntegerField | Identifies tree |
| level | PositiveIntegerField | Depth in tree (0=root) |

### MPTT Field Explanation

#### lft (Left) and rght (Right)
- Define node boundaries in tree
- Used for efficient descendant queries
- All descendants have lft between parent's lft and rght
- Automatically managed by MPTT

#### tree_id
- Groups nodes belonging to same tree
- Multiple root nodes = multiple trees
- Useful for multi-root scenarios
- Enables efficient tree isolation

#### level
- Node depth in tree structure
- Root nodes have level = 0
- Direct children have level = 1
- Increments with each level down

### MPTT Tree Structure Example

```
                    Company (lft=1, rght=20, level=0)
                    /              |              \
        Operations (2,9,1)    Finance (10,15,1)   HR (16,19,1)
        /         \              /       \           /      \
   Sales (3,4,2) Marketing   Accounts  Treasury  Recruit  Benefits
                  (5,8,2)    (11,12,2) (13,14,2) (17,18,2) (19,20,2)
                  /    \
            Digital  Content
            (6,7,3)  (8,9,3)
```

### order_insertion_by Configuration

#### By Name:
```
MPTTMeta:
    order_insertion_by = ['name']
```
- Siblings ordered alphabetically by name
- User-friendly ordering in UI
- Natural sorting

#### By Code:
```
MPTTMeta:
    order_insertion_by = ['code']
```
- Siblings ordered by department code
- Consistent with code-based systems
- Predictable ordering

### MPTT Query Benefits

| Operation | Traditional | MPTT |
|-----------|------------|------|
| Get all descendants | Multiple queries | 1 query |
| Get ancestors | Recursive | 1 query |
| Get tree depth | Manual calculation | Direct field |
| Get root path | Multiple lookups | 1 query |
| Move node | Complex updates | Built-in method |

### Expected Outcome
- Department model is MPTT-enabled
- Efficient tree queries available
- Automatic tree structure management

### Verification Checklist
- [ ] MPTTModel imported
- [ ] Department inherits from MPTTModel
- [ ] parent field properly configured
- [ ] MPTTMeta class added
- [ ] order_insertion_by configured
- [ ] MPTT fields will be auto-generated on migration

---

## Summary

This document established the foundation for department hierarchy management:

1. **Organization App Created** - New Django app with proper structure
2. **App Registered** - Added to TENANT_APPS for multi-tenancy
3. **MPTT Installed** - Efficient tree structure library
4. **Status Choices Defined** - ACTIVE, INACTIVE, ARCHIVED states
5. **Core Model Created** - name, code, status fields
6. **Description Added** - Detailed department information
7. **Hierarchy Enabled** - Parent FK for tree structure
8. **MPTT Configured** - Efficient tree queries enabled

The Department model now has the core structure needed for organizational hierarchy management with efficient tree operations.
