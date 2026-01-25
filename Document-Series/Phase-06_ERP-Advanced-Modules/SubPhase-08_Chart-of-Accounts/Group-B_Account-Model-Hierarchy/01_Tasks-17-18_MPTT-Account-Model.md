# Tasks 17-18: MPTT and Account Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** B - Account Model & Hierarchy  
> **Document:** 01 of 04  
> **Tasks Covered:** 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-19-24_Core-Account-Fields.md](02_Tasks-19-24_Core-Account-Fields.md)

---

## Document Overview

This document covers the installation of django-mptt (Modified Preorder Tree Traversal) for efficient hierarchical data management and the creation of the base Account model. MPTT enables the Chart of Accounts to support parent-child relationships (e.g., Assets → Current Assets → Cash → Petty Cash) with optimized query performance.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Install django-mptt | Low | 15 min |
| 18 | Create Account Model | Medium | 30 min |

---

## Task 17: Install django-mptt

### Overview
Install django-mptt, a Django package that implements Modified Preorder Tree Traversal algorithm for hierarchical data. MPTT provides efficient tree operations for the Chart of Accounts hierarchy, enabling fast querying of parent-child relationships, ancestors, descendants, and tree traversal.

### Dependencies
- Django project setup complete
- Requirements files organized

### Instructions

1. **Choose django-mptt package**
   - Package name: `django-mptt`
   - Latest stable version recommended
   - Well-maintained and widely used
   - Excellent documentation available

2. **Add to requirements file**
   - Open appropriate requirements file (e.g., `requirements/base.txt`)
   - Add `django-mptt>=0.14.0`
   - Pin to specific version or use minimum version
   - Document why this package is needed

3. **Install package**
   - Run `pip install django-mptt`
   - Or run `pip install -r requirements/base.txt`
   - Verify installation successful

4. **Add to INSTALLED_APPS**
   - Open Django settings file
   - Add `'mptt'` to INSTALLED_APPS
   - Place after Django's contrib apps
   - Before custom apps

5. **Decide app registration location**
   - TENANT_APPS if accounts are tenant-specific (recommended)
   - SHARED_APPS if accounts shared across tenants (unusual)
   - Follow project's multi-tenancy pattern

6. **Run migrations for mptt**
   - django-mptt doesn't have its own migrations
   - Creates fields in your models
   - No separate migration step needed

7. **Verify installation**
   - Run `python manage.py shell`
   - Import: `from mptt.models import MPTTModel`
   - Should import without errors

8. **Review MPTT documentation**
   - Familiarize with MPTT concepts
   - Understand tree_id, level, lft, rght fields
   - Review query methods (get_ancestors, get_descendants, etc.)

### What is MPTT?

#### Modified Preorder Tree Traversal Explained

MPTT is an algorithm for storing hierarchical data in a flat database table while maintaining efficient tree operations.

**Traditional Parent-Child Approach:**
- Each node stores only its parent ID
- Retrieving full tree requires recursive queries
- Performance degrades with tree depth
- Difficult to order siblings

**MPTT Approach:**
- Each node stores: tree_id, level, lft, rght values
- Single query retrieves entire subtree
- Fast ancestor/descendant queries
- Efficient tree traversal and ordering

#### MPTT Fields

| Field | Purpose | Example |
|-------|---------|---------|
| tree_id | Identifies separate trees in same table | 1, 2, 3 |
| level | Depth in tree (root=0) | 0, 1, 2, 3 |
| lft | Left position in preorder traversal | 1, 2, 5, 6 |
| rght | Right position in preorder traversal | 10, 4, 8, 7 |
| parent | Foreign key to parent node | null, 1, 1, 2 |

### MPTT Tree Structure Example

```
Assets (tree_id=1, level=0, lft=1, rght=10, parent=null)
├── Current Assets (tree_id=1, level=1, lft=2, rght=7, parent=Assets)
│   ├── Cash (tree_id=1, level=2, lft=3, rght=4, parent=Current Assets)
│   ├── Bank (tree_id=1, level=2, lft=5, rght=6, parent=Current Assets)
└── Fixed Assets (tree_id=1, level=1, lft=8, rght=9, parent=Assets)
```

### MPTT Benefits for Chart of Accounts

#### Efficient Queries
- Get all child accounts: Single query using lft/rght range
- Get account path: Single query for all ancestors
- Check if account is parent: Simple comparison
- Tree depth calculation: Automatic via level field

#### Performance Advantages
- No recursive queries needed
- Database indexes on lft/rght fields
- Fast sorting within same level
- Efficient descendant counting

#### Chart of Accounts Use Cases
1. **Account Hierarchy Display:** Show indented account tree
2. **Balance Aggregation:** Sum balances from child to parent accounts
3. **Account Path:** Display full path (Assets > Current Assets > Cash)
4. **Subtree Queries:** Get all accounts under specific parent
5. **Level-based Operations:** Perform actions on specific tree levels

### MPTT Limitations and Considerations

#### Update Performance
- Tree restructuring requires updating lft/rght values
- Batch operations preferred over individual moves
- Consider caching for frequently accessed trees

#### Write Operations
- Moving nodes is more expensive than simple parent update
- Use MPTT's provided methods for moves
- Avoid manual lft/rght manipulation

#### When to Use MPTT
- ✅ Frequent tree traversal queries
- ✅ Need for fast ancestor/descendant retrieval
- ✅ Tree display and rendering
- ✅ Balance aggregation from children

#### When to Avoid MPTT
- ❌ Frequent tree restructuring
- ❌ Very deep trees (>10 levels)
- ❌ No need for hierarchy features
- ❌ Simple parent-child is sufficient

### Alternative Approaches

#### Adjacency List (Simple Parent FK)
- **Pros:** Simple, easy to update
- **Cons:** Slow tree queries, recursive lookups
- **Use when:** Hierarchy rarely queried

#### Nested Set (Similar to MPTT)
- **Pros:** Similar performance to MPTT
- **Cons:** Complex manual management
- **Use when:** MPTT not available

#### Closure Table
- **Pros:** Fast queries, simple structure
- **Cons:** Additional table, more storage
- **Use when:** Need maximum query speed

### Expected Outcome
- django-mptt installed successfully
- Package added to requirements
- INSTALLED_APPS configured
- Ready to create MPTT-based models
- Team understands MPTT concepts

### Verification Checklist
- [ ] `django-mptt` added to requirements file
- [ ] Package installed in virtual environment
- [ ] `mptt` added to INSTALLED_APPS
- [ ] No import errors when importing MPTTModel
- [ ] Package version documented
- [ ] Team briefed on MPTT concepts

---

## Task 18: Create Account Model

### Overview
Create the base Account model that will inherit from MPTTModel to support hierarchical account structures. This task establishes the model class, imports, and basic configuration, preparing for field definitions in subsequent tasks.

### Dependencies
- Task 17: Install django-mptt
- Task 16: AccountTypeConfig tested and working

### Instructions

1. **Create account model file**
   - Navigate to `apps/accounting/models/`
   - Create new file: `account.py`
   - This will contain the Account model

2. **Import required dependencies**
   - Import Django model classes and fields
   - Import MPTTModel from django-mptt
   - Import enums (AccountType, AccountCategory, AccountStatus, NormalBalance)
   - Import AccountTypeConfig model
   - Import TreeForeignKey from mptt.fields
   - Import base models if using (e.g., TimestampedModel)

3. **Add comprehensive module docstring**
   - Explain Account model purpose
   - Reference Chart of Accounts system
   - Note MPTT hierarchy support
   - Document key relationships

4. **Create Account model class**
   - Class name: `Account`
   - Inherit from `MPTTModel`
   - Optionally inherit from base models (multiple inheritance)
   - Order: `class Account(MPTTModel, TimestampedModel)`

5. **Add model-level docstring**
   - Describe what Account represents
   - List key features (hierarchy, balance tracking, etc.)
   - Reference parent-child relationships
   - Note tenant-specific nature

6. **Define model Meta class**
   - Set `verbose_name = 'Account'`
   - Set `verbose_name_plural = 'Accounts'`
   - Set `db_table = 'accounting_account'`
   - Set `ordering = ['tree_id', 'lft']` (MPTT ordering)
   - Add `unique_together` constraints (to be refined later)
   - Add `indexes` for performance (to be added later)

7. **Plan model structure**
   - Identify core fields needed (code, name, type, etc.)
   - Identify MPTT-specific fields (parent)
   - Identify balance tracking fields
   - Identify status and flag fields
   - Plan relationships to other models

8. **Add placeholder for fields**
   - Add comment indicating fields will be added in next tasks
   - Organize field groups: Core, Hierarchy, Balance, Status, Timestamps
   - Document field organization strategy

9. **Define __str__ method**
   - Return format: "code - name" (e.g., "1100 - Cash")
   - Provides user-friendly representation
   - Used in admin, logs, and debugging

10. **Add model manager placeholder**
    - MPTT provides TreeManager automatically
    - Plan custom manager if needed for business logic
    - Document manager responsibilities

11. **Update models package init**
    - Import Account in `apps/accounting/models/__init__.py`
    - Makes Account available for imports
    - Ensures Django discovers the model

### Account Model Purpose

The Account model represents individual accounts in the Chart of Accounts:
- **Code:** Unique numeric identifier (e.g., 1100, 2200)
- **Name:** Descriptive name (e.g., "Cash", "Accounts Payable")
- **Type:** Classification (Asset, Liability, Equity, Revenue, Expense)
- **Hierarchy:** Parent-child relationships for account grouping
- **Balance:** Track current and opening balances
- **Status:** Active, Inactive, or Archived state
- **Currency:** Optional currency override for foreign currency accounts

### Account Hierarchy Examples

#### Assets Hierarchy
```
1000 - Assets (header account, parent=null)
  ├─ 1100 - Current Assets (header, parent=1000)
  │   ├─ 1110 - Cash (parent=1100)
  │   ├─ 1120 - Bank (parent=1100)
  │   └─ 1130 - Accounts Receivable (parent=1100)
  └─ 1400 - Fixed Assets (header, parent=1000)
      ├─ 1410 - Equipment (parent=1400)
      └─ 1420 - Vehicles (parent=1400)
```

#### Revenue Hierarchy
```
4000 - Revenue (header account, parent=null)
  ├─ 4100 - Sales Revenue (header, parent=4000)
  │   ├─ 4110 - Product Sales (parent=4100)
  │   └─ 4120 - Service Sales (parent=4100)
  └─ 4900 - Other Income (header, parent=4000)
      └─ 4910 - Interest Income (parent=4900)
```

### Model Inheritance Structure

#### Single Inheritance (MPTT only)
```python
class Account(MPTTModel):
    # MPTT provides tree functionality
    # Manual timestamp fields needed
```

#### Multiple Inheritance (MPTT + Base Model)
```python
class Account(MPTTModel, TimestampedModel):
    # MPTT provides tree functionality
    # TimestampedModel provides created_at, updated_at
    # Inherit from both
```

### MPTT Model Requirements

When inheriting from MPTTModel, the model must include:
1. **TreeForeignKey parent field:** Self-referential relationship
2. **MPTTMeta class:** Configure MPTT behavior
3. **Proper ordering:** Use tree_id and lft for hierarchical display

### Model Manager

MPTT automatically provides `TreeManager` as the default manager:
- **objects:** Default TreeManager with MPTT query methods
- **get_descendants():** Get all child nodes
- **get_ancestors():** Get all parent nodes
- **get_siblings():** Get accounts at same level
- **get_root():** Get top-level parent
- **is_leaf_node():** Check if account has no children
- **is_root_node():** Check if account has no parent

### Expected Outcome
- Account model class created
- Inherits from MPTTModel
- Meta class configured
- __str__ method defined
- Ready for field definitions
- Model properly imported

### Verification Checklist
- [ ] `apps/accounting/models/account.py` file created
- [ ] Account class defined
- [ ] Inherits from MPTTModel
- [ ] Model docstring added
- [ ] Meta class configured
- [ ] verbose_name and verbose_name_plural set
- [ ] db_table specified
- [ ] ordering includes tree_id and lft
- [ ] __str__ method defined
- [ ] Account imported in models/__init__.py
- [ ] No import errors when importing Account
- [ ] Model appears in Django shell

---

## Group B Progress

After completing these tasks, you will have:
- ✅ django-mptt installed and configured
- ✅ Base Account model created with MPTT support
- ⬜ Core account fields (next document)
- ⬜ Hierarchy and system fields (subsequent document)
- ⬜ Balance, currency, and constraints (final document)

### Next Steps
Proceed to [02_Tasks-19-24_Core-Account-Fields.md](02_Tasks-19-24_Core-Account-Fields.md) to add essential fields including account code, name, type foreign key, category, status, and description.

---

## Notes for AI Agents

### MPTT Integration Tips
1. **Always use TreeForeignKey** for parent field, not regular ForeignKey
2. **Order by tree_id, lft** for proper hierarchical display
3. **Use MPTT methods** for tree operations, not manual parent manipulation
4. **Test with nested data** to verify hierarchy works correctly

### Model Organization
- Group related fields together in model definition
- Add comments to separate field groups
- Use consistent field naming conventions
- Consider future fields when planning structure

### Multi-Tenancy for Accounts
- Accounts are tenant-specific (in TENANT_APPS)
- Each tenant has own Chart of Accounts
- Account codes can be customized per tenant
- Ensure proper tenant isolation in queries

### Performance Considerations
- Add database indexes on frequently queried fields
- Use select_related for foreign keys
- Use prefetch_related for reverse relationships
- Consider caching for frequently accessed accounts

### Sri Lankan Context
- Support LKR as default currency
- Allow foreign currency accounts for imports/exports
- Support local account naming conventions
- Accommodate VAT, NBT, and other tax accounts
