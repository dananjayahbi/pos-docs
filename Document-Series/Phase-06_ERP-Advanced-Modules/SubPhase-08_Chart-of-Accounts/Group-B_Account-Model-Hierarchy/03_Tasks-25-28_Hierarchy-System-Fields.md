# Tasks 25-28: Hierarchy System Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** B - Account Model & Hierarchy  
> **Document:** 03 of 04  
> **Tasks Covered:** 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-19-24_Core-Account-Fields.md](02_Tasks-19-24_Core-Account-Fields.md)
- **→ Next Document:** [04_Tasks-29-34_Balance-Currency-Constraints.md](04_Tasks-29-34_Balance-Currency-Constraints.md)

---

## Document Overview

This document covers the implementation of hierarchical tree structure using django-mptt (Modified Preorder Tree Traversal). The hierarchy allows accounts to have parent-child relationships, enabling nested structures like Assets > Current Assets > Cash > Petty Cash. Additionally, this document covers special account flags (is_header, is_system) that control account behavior and protection levels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add Account Parent FK | Medium | 20 min |
| 26 | Configure MPTT Fields | Medium | 25 min |
| 27 | Add Account Is Header | Low | 15 min |
| 28 | Add Account Is System | Low | 15 min |

---

## Task 25: Add Account Parent FK

### Overview
Add a self-referential foreign key field that enables parent-child relationships between accounts. This field is the foundation of the hierarchical account structure, using django-mptt's TreeForeignKey to efficiently manage and query tree relationships. Root accounts (top-level) have null parent, while child accounts reference their parent.

### Dependencies
- Task 18: Create Account Model with MPTTModel inheritance
- Task 17: django-mptt installed
- Core account fields (code, name) implemented

### Instructions

1. **Open account.py model file**
   - Navigate to `apps/accounting/models/account.py`
   - Locate Account model class (should inherit from MPTTModel)

2. **Import TreeForeignKey**
   - Import TreeForeignKey from mptt.fields
   - Verify MPTTModel is already imported and inherited

3. **Add parent field**
   - Use TreeForeignKey pointing to 'self'
   - Set null=True and blank=True (root accounts have no parent)
   - Set related_name='children' for reverse relationship
   - Set on_delete=PROTECT to prevent orphaning child accounts
   - Add help_text explaining hierarchy

4. **Add parent validation**
   - Implement clean method to prevent circular references
   - Ensure parent is same tenant
   - Validate parent type compatibility (optional business rule)
   - Check parent code range compatibility

5. **Add level-aware queries**
   - Document how to query by level
   - Explain root accounts (parent=None)
   - Show examples of getting children, descendants, ancestors

6. **Document hierarchy patterns**
   - Add model-level comments explaining hierarchy
   - Provide examples of typical account trees
   - Include Sri Lankan accounting structure examples

### Parent Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | TreeForeignKey | MPTT-aware foreign key |
| Related Model | 'self' | Self-referential relationship |
| Related Name | 'children' | Access child accounts |
| Null | True | Root accounts have no parent |
| Blank | True | Optional in forms |
| On Delete | PROTECT | Prevent orphaning children |
| Indexed | Automatic | MPTT handles indexing |

### Hierarchical Account Structure

```
┌──────────────────────────────────────────────────────────┐
│           Account Hierarchy Tree Structure                │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ROOT LEVEL (parent=None)                                 │
│  ├── 1000 - ASSETS                                        │
│  │   ├── 1100 - Current Assets                            │
│  │   │   ├── 1101 - Cash on Hand                          │
│  │   │   ├── 1102 - Petty Cash                            │
│  │   │   └── 1103 - Cash in Transit                       │
│  │   ├── 1200 - Bank Accounts                             │
│  │   │   ├── 1201 - Commercial Bank - Main                │
│  │   │   ├── 1202 - People's Bank - Payroll               │
│  │   │   └── 1203 - Sampath Bank - USD                    │
│  │   └── 1300 - Accounts Receivable                       │
│  │       ├── 1301 - Trade Receivables - Local             │
│  │       └── 1302 - Trade Receivables - Export            │
│  │                                                         │
│  ├── 2000 - LIABILITIES                                   │
│  │   ├── 2100 - Current Liabilities                       │
│  │   │   ├── 2101 - Trade Payables                        │
│  │   │   └── 2102 - Accrued Expenses                      │
│  │   └── 2200 - Taxes Payable                             │
│  │       ├── 2201 - VAT Payable (15%)                     │
│  │       └── 2203 - WHT Payable                           │
│  │                                                         │
│  └── 4000 - REVENUE                                       │
│      └── 4100 - Sales Revenue                             │
│          ├── 4101 - Product Sales - Local                 │
│          └── 4102 - Product Sales - Export                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### MPTT Tree Concepts

```
Modified Preorder Tree Traversal (MPTT)
═══════════════════════════════════════════════════════════

MPTT adds four fields to each node:
├── tree_id: Identifies which tree the node belongs to
├── level: Depth in the tree (0 = root)
├── lft: Left value for tree traversal
└── rght: Right value for tree traversal

Example Tree with MPTT Fields:

Account                      Code  Level  lft  rght  tree_id
──────────────────────────────────────────────────────────
Assets                       1000    0     1    20      1
  Current Assets             1100    1     2    11      1
    Cash on Hand             1101    2     3     4      1
    Petty Cash               1102    2     5     6      1
    Cash in Transit          1103    2     7     8      1
  Bank Accounts              1200    1     9    10      1
  Fixed Assets               1500    1    12    19      1
    Office Equipment         1501    2    13    14      1
    Furniture                1502    2    15    16      1
    Vehicles                 1503    2    17    18      1

Liabilities                  2000    0     1    10      2
  Current Liabilities        2100    1     2     5      2
    Trade Payables           2101    2     3     4      2
  Taxes Payable              2200    1     6     9      2
    VAT Payable              2201    2     7     8      2
```

### Parent-Child Relationship Patterns

#### Root Accounts (Level 0)
```
Root accounts have parent=None and serve as top-level categories.

Examples:
├── 1000 - Assets (parent=None, level=0)
├── 2000 - Liabilities (parent=None, level=0)
├── 3000 - Equity (parent=None, level=0)
├── 4000 - Revenue (parent=None, level=0)
└── 5000 - Expenses (parent=None, level=0)

Query: Account.objects.filter(parent=None)
```

#### Level 1 Accounts (Major Categories)
```
First-level children provide main subcategories.

Examples under Assets (1000):
├── 1100 - Current Assets (parent=1000, level=1)
├── 1200 - Bank Accounts (parent=1000, level=1)
├── 1300 - Receivables (parent=1000, level=1)
└── 1500 - Fixed Assets (parent=1000, level=1)

Query: Account.objects.filter(parent=assets_account, level=1)
```

#### Level 2+ Accounts (Detail Accounts)
```
Deeper levels provide specific transaction accounts.

Examples under Bank Accounts (1200):
├── 1201 - Commercial Bank - Main (parent=1200, level=2)
├── 1202 - People's Bank - Payroll (parent=1200, level=2)
└── 1203 - Sampath Bank - USD (parent=1200, level=2)

Query: bank_accounts.get_children()
```

### MPTT Query Examples

#### Get All Descendants (Children, Grandchildren, etc.)
```
Query Pattern:

# Get all descendants of "Assets" account
assets = Account.objects.get(code=1000)
all_asset_accounts = assets.get_descendants(include_self=False)

# Includes: Current Assets, Cash on Hand, Petty Cash, Bank Accounts, 
#           Commercial Bank, People's Bank, Fixed Assets, etc.
```

#### Get Direct Children Only
```
Query Pattern:

# Get only immediate children
assets = Account.objects.get(code=1000)
major_categories = assets.get_children()

# Returns only: Current Assets, Bank Accounts, Fixed Assets
# Does NOT include: Cash on Hand, Commercial Bank, etc.
```

#### Get All Ancestors (Parent, Grandparent, etc.)
```
Query Pattern:

# Get hierarchy path from root to account
cash_account = Account.objects.get(code=1101)
hierarchy_path = cash_account.get_ancestors(include_self=True)

# Returns: [Assets, Current Assets, Cash on Hand]
```

#### Get Siblings (Accounts with Same Parent)
```
Query Pattern:

# Get all accounts at same level with same parent
commercial_bank = Account.objects.get(code=1201)
other_banks = commercial_bank.get_siblings()

# Returns: People's Bank, Sampath Bank, etc.
```

#### Get Root Account
```
Query Pattern:

# Navigate to top of tree
cash_account = Account.objects.get(code=1101)
root_account = cash_account.get_root()

# Returns: Assets (1000)
```

#### Check if Leaf (No Children)
```
Query Pattern:

# Check if account is a leaf node (detail account)
account = Account.objects.get(code=1201)
is_detail_account = account.is_leaf_node()

# True if no children, False if has children
```

### Parent Validation Rules

#### Rule 1: Same Tenant Validation
```
Validation Flow:

User assigns parent from different tenant

Step 1: Check Tenant Match
  ├─ account.tenant = Tenant A
  ├─ parent.tenant = Tenant B
  └─ ❌ VALIDATION FAIL

Error: "Parent account must belong to the same tenant."
```

#### Rule 2: Circular Reference Prevention
```
Validation Flow:

User attempts to set account's parent to itself or descendant

Scenario A: Self as Parent
  ├─ account.code = 1200
  ├─ parent.code = 1200
  └─ ❌ FAIL: "Account cannot be its own parent"

Scenario B: Child as Parent
  ├─ account.code = 1200
  ├─ parent.code = 1201 (child of 1200)
  └─ ❌ FAIL: "Cannot create circular reference in hierarchy"

MPTT handles this automatically, but add explicit validation for clarity.
```

#### Rule 3: Code Range Compatibility (Optional)
```
Optional Business Rule:

Ensure child account code falls within parent's range

Example:
├─ Parent: 1200 - Bank Accounts
├─ Parent's range: 1200-1299
├─ Child attempt: 1350 - Trade Receivables
└─ ❌ FAIL: "Child code 1350 outside parent range 1200-1299"

This is an optional business rule. Some implementations allow flexible
code assignment as long as type is consistent.
```

### Sri Lankan Chart of Accounts Structure

#### Typical Asset Hierarchy
```
1000 - Assets
├── 1100 - Current Assets
│   ├── 1101 - Cash on Hand - LKR
│   ├── 1102 - Petty Cash
│   ├── 1110 - Cash on Hand - USD
│   └── 1111 - Cash on Hand - EUR
│
├── 1200 - Bank Accounts - LKR
│   ├── 1201 - Commercial Bank - Main Current
│   ├── 1202 - People's Bank - Payroll Account
│   ├── 1203 - Bank of Ceylon - Savings
│   └── 1204 - Sampath Bank - Fixed Deposit
│
├── 1250 - Bank Accounts - Foreign Currency
│   ├── 1251 - Commercial Bank - USD Account
│   ├── 1252 - HSBC - USD Trade Finance
│   └── 1253 - Sampath Bank - EUR Account
│
├── 1300 - Accounts Receivable
│   ├── 1301 - Trade Receivables - Local Customers
│   ├── 1302 - Trade Receivables - Export Customers
│   ├── 1303 - Staff Advances
│   └── 1304 - Other Receivables
│
└── 1400 - Inventory
    ├── 1401 - Finished Goods - Electronics
    ├── 1402 - Finished Goods - Clothing
    └── 1403 - Raw Materials
```

#### Typical Tax Liability Hierarchy (Sri Lanka)
```
2200 - Taxes Payable
├── 2201 - VAT Payable (15%)
├── 2202 - VAT Reclaimable (Input VAT)
├── 2203 - Withholding Tax Payable
│   ├── 2203.1 - WHT on Payments to Residents
│   └── 2203.2 - WHT on Payments to Non-Residents
├── 2204 - Nation Building Tax (NBT) Payable
├── 2205 - Economic Service Charge (ESC) Payable
├── 2206 - PAYE Tax Payable
└── 2207 - Corporate Income Tax Payable
```

### Hierarchy Depth Recommendations

| Level | Description | Example | Recommended Max Depth |
|-------|-------------|---------|----------------------|
| 0 | Root category | Assets, Liabilities | Required |
| 1 | Major category | Current Assets, Fixed Assets | Recommended |
| 2 | Sub-category | Cash, Banks, Receivables | Common |
| 3 | Detail account | Commercial Bank - Main | Most granular |
| 4+ | Sub-detail | Rarely used | Avoid if possible |

**Best Practice:** Keep hierarchy depth to 3-4 levels maximum for maintainability and reporting clarity.

### Hierarchy Visualization in UI

#### Indented List Display
```
Chart of Accounts
═══════════════════════════════════════════════════════════

1000 - Assets
  1100 - Current Assets
    1101 - Cash on Hand
    1102 - Petty Cash
  1200 - Bank Accounts
    1201 - Commercial Bank - Main
    1202 - People's Bank - Payroll

2000 - Liabilities
  2100 - Current Liabilities
    2101 - Trade Payables
  2200 - Taxes Payable
    2201 - VAT Payable (15%)
```

#### Breadcrumb Navigation
```
Viewing Account: Commercial Bank - Main

Hierarchy Path:
Assets > Current Assets > Bank Accounts > Commercial Bank - Main
(1000) > (1100)        > (1200)        > (1201)
```

#### Tree Widget (Admin Interface)
```
┐ Assets (1000)
├─┐ Current Assets (1100)
│ ├── Cash on Hand (1101)
│ └── Petty Cash (1102)
├─┐ Bank Accounts (1200)
│ ├── Commercial Bank - Main (1201)
│ └── People's Bank - Payroll (1202)
└─┐ Fixed Assets (1500)
  ├── Office Equipment (1501)
  └── Furniture (1502)
```

### Expected Outcome
- Self-referential parent-child relationships established
- Root accounts (parent=None) for top-level categories
- Multi-level hierarchy support (3-4 levels typical)
- Efficient tree queries via MPTT
- Prevention of circular references
- Same-tenant parent validation
- Foundation for hierarchical reporting
- Support for account organization and grouping

### Verification Checklist
- [ ] parent field added as TreeForeignKey to 'self'
- [ ] related_name='children' configured
- [ ] null=True and blank=True set (root accounts)
- [ ] on_delete=PROTECT configured
- [ ] Same-tenant validation in clean method
- [ ] Circular reference prevention implemented
- [ ] Documentation includes hierarchy examples
- [ ] MPTT query methods documented
- [ ] Admin interface supports tree display
- [ ] Help text explains parent relationship

---

## Task 26: Configure MPTT Fields

### Overview
Configure the MPTTMeta class to define how django-mptt manages the hierarchical tree structure. This configuration controls tree ordering, field names (if customized), and tree traversal behavior. Proper MPTT configuration ensures efficient tree operations and intuitive account ordering.

### Dependencies
- Task 25: Add Account Parent FK
- Task 17: django-mptt installed
- Account model inherits from MPTTModel

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add MPTTMeta inner class**
   - Create class named MPTTMeta inside Account model
   - This class configures MPTT behavior

3. **Configure order_insertion_by**
   - Set order_insertion_by = ['code']
   - This ensures accounts are ordered by code within each level
   - Results in naturally sorted account lists

4. **Configure parent_attr (if customized)**
   - Default is 'parent', only set if using different field name
   - Typically leave as default

5. **Document MPTT fields**
   - Document the automatically added MPTT fields
   - Explain tree_id, level, lft, rght
   - Note that these fields are managed automatically

6. **Add tree-related methods**
   - Document built-in MPTT methods available
   - List common tree operations
   - Provide usage examples

7. **Test tree operations**
   - Verify accounts are ordered correctly
   - Test ancestor/descendant queries
   - Confirm tree integrity after CRUD operations

### MPTTMeta Configuration

```
┌──────────────────────────────────────────────────────────┐
│              MPTTMeta Class Configuration                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  class Account(MPTTModel, TenantAwareMixin, ...):         │
│      # Fields defined above...                            │
│                                                           │
│      class MPTTMeta:                                      │
│          order_insertion_by = ['code']                    │
│          # Orders accounts by code at each tree level     │
│                                                           │
│          # Optional configurations:                       │
│          # parent_attr = 'parent'  # Default             │
│          # left_attr = 'lft'       # Default             │
│          # right_attr = 'rght'     # Default             │
│          # tree_id_attr = 'tree_id' # Default            │
│          # level_attr = 'level'    # Default             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Automatically Added MPPT Fields

```
MPTT Field Descriptions
═══════════════════════════════════════════════════════════

Field: tree_id
├─ Type: PositiveIntegerField
├─ Purpose: Identifies which tree the node belongs to
├─ Usage: Multiple root accounts = multiple trees
└─ Example: All Asset accounts have same tree_id

Field: level
├─ Type: PositiveIntegerField  
├─ Purpose: Depth of node in tree (0 = root)
├─ Usage: Determine indentation, filter by depth
└─ Example: Assets=0, Current Assets=1, Cash=2

Field: lft (Left)
├─ Type: PositiveIntegerField
├─ Purpose: Left boundary for nested set
├─ Usage: Internal MPTT tree traversal
└─ Note: Managed automatically, rarely accessed directly

Field: rght (Right)
├─ Type: PositiveIntegerField
├─ Purpose: Right boundary for nested set
├─ Usage: Internal MPTT tree traversal
└─ Note: Managed automatically, rarely accessed directly

⚠️ IMPORTANT: Never manually modify tree_id, level, lft, or rght.
   These are managed automatically by django-mptt.
```

### Order Insertion By Code

```
Effect of order_insertion_by = ['code']
═══════════════════════════════════════════════════════════

Without Ordering:
Assets
├── Bank Accounts (1200)         ← Insertion order
├── Cash on Hand (1101)
└── Fixed Assets (1500)

With order_insertion_by = ['code']:
Assets
├── Cash on Hand (1101)          ← Sorted by code
├── Bank Accounts (1200)
└── Fixed Assets (1500)

Benefits:
✓ Accounts appear in logical numeric order
✓ Consistent display across all queries
✓ Aligns with accounting standards
✓ No need to manually specify ordering in queries
```

### Tree Ordered Example

```
Complete Tree with Code-Based Ordering
═══════════════════════════════════════════════════════════

1000 - Assets (level=0, tree_id=1)
├── 1100 - Current Assets (level=1)
│   ├── 1101 - Cash on Hand (level=2)
│   ├── 1102 - Petty Cash (level=2)
│   └── 1103 - Cash in Transit (level=2)
├── 1200 - Bank Accounts (level=1)
│   ├── 1201 - Commercial Bank (level=2)
│   ├── 1202 - People's Bank (level=2)
│   └── 1203 - Sampath Bank (level=2)
└── 1500 - Fixed Assets (level=1)
    ├── 1501 - Office Equipment (level=2)
    └── 1502 - Furniture (level=2)

2000 - Liabilities (level=0, tree_id=2)
├── 2100 - Current Liabilities (level=1)
│   └── 2101 - Trade Payables (level=2)
└── 2200 - Taxes Payable (level=1)
    ├── 2201 - VAT Payable (level=2)
    └── 2202 - WHT Payable (level=2)

Note: All accounts ordered by code at each level.
```

### MPTT Methods Available

```
┌──────────────────────────────────────────────────────────┐
│            Built-in MPTT Methods (Examples)               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Tree Queries:                                            │
│    • get_ancestors(include_self=False)                    │
│    • get_descendants(include_self=False)                  │
│    • get_children()                                       │
│    • get_siblings(include_self=False)                     │
│    • get_root()                                           │
│    • get_family()                                         │
│                                                           │
│  Tree Checks:                                             │
│    • is_root_node()                                       │
│    • is_leaf_node()                                       │
│    • is_child_node()                                      │
│                                                           │
│  Tree Navigation:                                         │
│    • get_next_sibling()                                   │
│    • get_previous_sibling()                               │
│    • get_first_child()                                    │
│    • get_last_child()                                     │
│                                                           │
│  Tree Manipulation:                                       │
│    • move_to(target, position)                            │
│    • insert_at(target, position, save=False)              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Method Usage Examples

#### Get Ancestors (Breadcrumb Trail)
```
Usage:

cash_account = Account.objects.get(code=1101)
ancestors = cash_account.get_ancestors(include_self=True)

Result: [Assets, Current Assets, Cash on Hand]

Use Case: Display hierarchy breadcrumb in UI
Display: Assets > Current Assets > Cash on Hand
```

#### Get Descendants (All Children)
```
Usage:

assets = Account.objects.get(code=1000)
all_assets = assets.get_descendants()

Result: All accounts under Assets (1100, 1101, 1102, 1200, 1201, ...)

Use Case: Calculate total asset balance from all sub-accounts
```

#### Get Children (Direct Children Only)
```
Usage:

current_assets = Account.objects.get(code=1100)
children = current_assets.get_children()

Result: [1101 - Cash on Hand, 1102 - Petty Cash, 1103 - Cash in Transit]

Use Case: Display immediate sub-categories
```

#### Check if Leaf Node (Detail Account)
```
Usage:

account = Account.objects.get(code=1201)
is_detail = account.is_leaf_node()

Result: True (if no children), False (if has children)

Use Case: Determine if account can receive transactions
Business Rule: Only leaf accounts (detail accounts) allow transactions
```

#### Move Account in Tree
```
Usage:

# Move account to different parent
account = Account.objects.get(code=1205)
new_parent = Account.objects.get(code=1250)
account.move_to(new_parent, 'last-child')
account.save()

Result: Account 1205 now child of 1250, positioned as last child

Use Case: Reorganize chart of accounts structure
```

### Tree Integrity

```
MPTT Tree Integrity Management
═══════════════════════════════════════════════════════════

Automatic Maintenance:
├─ MPTT automatically updates lft/rght values
├─ Tree_id managed on root creation
├─ Level calculated from parent relationship
└─ Ordering maintained per order_insertion_by

Manual Rebuild (If Needed):
Command: python manage.py rebuild_tree accounting.Account
Use When: 
  - Tree structure appears corrupted
  - After bulk imports without proper tree updates
  - Database restored from backup

Verification:
Command: Account.objects.rebuild()
Result: Recalculates all MPTT fields
```

### Performance Considerations

```
MPTT Performance Characteristics
═══════════════════════════════════════════════════════════

✓ FAST Operations:
  • Read queries (get_ancestors, get_descendants)
  • Tree traversal
  • Finding all children
  • Checking relationships
  
⚠️ MODERATE Operations:
  • Insert new node
  • Delete node
  • Move node to new parent
  
Reason: MPTT optimizes reads at expense of writes
  - Reads: O(1) for most operations
  - Writes: O(n) may require updating multiple nodes' lft/rght

Recommendation: Perfect for COA (reads >> writes)
```

### Multiple Trees (Multi-Tenant)

```
Tree ID Per Root Account
═══════════════════════════════════════════════════════════

In a multi-tenant environment with tenant schema isolation,
each tenant has their own complete set of trees:

Tenant A:
├─ Tree 1: Assets (1000)
├─ Tree 2: Liabilities (2000)
├─ Tree 3: Equity (3000)
├─ Tree 4: Revenue (4000)
└─ Tree 5: Expenses (5000-9999)

Tenant B:
├─ Tree 1: Assets (1000)
├─ Tree 2: Liabilities (2000)
├─ Tree 3: Equity (3000)
├─ Tree 4: Revenue (4000)
└─ Tree 5: Expenses (5000-9999)

Note: tree_id values are tenant-specific due to schema isolation
```

### Ordering Alternatives

```
Alternative Ordering Options
═══════════════════════════════════════════════════════════

Option 1: Order by code (Recommended)
order_insertion_by = ['code']
Result: Numeric order (1101, 1102, 1201, 1202)

Option 2: Order by name
order_insertion_by = ['name']
Result: Alphabetic order (A-Z)
Use Case: If codes not consistently numbered

Option 3: Multiple fields
order_insertion_by = ['account_type', 'code']
Result: First by type, then by code
Use Case: Mixed trees with multiple types

Option 4: No ordering
order_insertion_by = []
Result: Insertion order maintained
Use Case: Rarely used, manual ordering needed
```

### Expected Outcome
- MPTT configured with code-based ordering
- Efficient tree queries and traversal
- Automatic tree_id, level, lft, rght management
- Accounts naturally sorted by code
- Built-in tree methods available
- Tree integrity maintained automatically
- Optimized read performance for reports
- Support for tree restructuring

### Verification Checklist
- [ ] MPTTMeta inner class added to Account model
- [ ] order_insertion_by = ['code'] configured
- [ ] MPTT fields (tree_id, level, lft, rght) documented
- [ ] Tree methods documented with examples
- [ ] Tree ordering verified (accounts sorted by code)
- [ ] Ancestor/descendant queries tested
- [ ] Move operations documented
- [ ] Tree rebuild command documented
- [ ] Performance characteristics understood

---

## Task 27: Add Account Is Header

### Overview
Add a boolean flag that identifies header (summary) accounts that group child accounts but do not receive direct transactions. Header accounts typically end in "00" (e.g., 1100 - Current Assets, 1200 - Bank Accounts) and their balances are calculated by summing their children's balances. This flag enforces the distinction between summary and detail accounts.

### Dependencies
- Task 25: Add Account Parent FK
- Task 26: Configure MPTT Fields
- Hierarchy structure established

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add is_header field**
   - Use BooleanField
   - Default to False (most accounts are detail accounts)
   - Mark as required (null=False, blank=False)
   - Add help_text explaining header accounts

3. **Add database index**
   - Index the is_header field
   - Enables fast filtering for header vs detail accounts

4. **Add header validation**
   - Implement clean method to validate header rules
   - Prevent posting transactions to header accounts
   - Ensure header accounts have consistent naming (optional)
   - Validate code pattern (optional - headers often end in 00)

5. **Add balance calculation logic**
   - Document that header balances are calculated from children
   - Note that header accounts should not have direct transactions
   - Explain balance rollup in reporting

6. **Update admin interface**
   - Show is_header flag prominently
   - Consider special styling for header accounts
   - Add filter for header/detail accounts

### Is Header Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | BooleanField | True/False flag |
| Default | False | Most accounts are detail accounts |
| Required | Yes | Must explicitly mark headers |
| Indexed | Yes | Fast filtering by type |
| Help Text | Yes | Explain header purpose |

### Header vs Detail Accounts

```
┌──────────────────────────────────────────────────────────┐
│          Header vs Detail Account Comparison              │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  HEADER ACCOUNT (is_header=True):                         │
│    • Groups child accounts (parent in hierarchy)          │
│    • Cannot receive direct transactions                   │
│    • Balance calculated from children's balances          │
│    • Typically ends in 00 (e.g., 1100, 1200, 2100)        │
│    • Always has children (is_leaf_node() = False)         │
│    • Used for subtotals in reports                        │
│    • Examples: Current Assets, Bank Accounts              │
│                                                           │
│  DETAIL ACCOUNT (is_header=False):                        │
│    • Receives actual transactions                         │
│    • Has actual debit/credit entries                      │
│    • May or may not have children                         │
│    • Balance from transaction journal entries             │
│    • Specific numeric codes (e.g., 1101, 1201, 2101)      │
│    • Examples: Cash on Hand, Commercial Bank - Main       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Header Account Examples

```
Chart of Accounts - Header vs Detail
═══════════════════════════════════════════════════════════

1000 - ASSETS [HEADER]                         is_header=True
├── 1100 - Current Assets [HEADER]             is_header=True
│   ├── 1101 - Cash on Hand [DETAIL]           is_header=False ✓
│   ├── 1102 - Petty Cash [DETAIL]             is_header=False ✓
│   └── 1103 - Cash in Transit [DETAIL]        is_header=False ✓
│
├── 1200 - Bank Accounts [HEADER]              is_header=True
│   ├── 1201 - Commercial Bank [DETAIL]        is_header=False ✓
│   ├── 1202 - People's Bank [DETAIL]          is_header=False ✓
│   └── 1203 - Sampath Bank [DETAIL]           is_header=False ✓
│
└── 1500 - Fixed Assets [HEADER]               is_header=True
    ├── 1501 - Office Equipment [DETAIL]       is_header=False ✓
    ├── 1502 - Furniture [DETAIL]              is_header=False ✓
    └── 1503 - Vehicles [DETAIL]               is_header=False ✓

Legend:
[HEADER] - Summary account, cannot post transactions
[DETAIL] - Transaction account, receives journal entries
✓ - Can receive transactions
```

### Transaction Posting Rules

```
Transaction Posting Validation
═══════════════════════════════════════════════════════════

Scenario 1: Post to Detail Account (Valid)
├─ Account: 1201 - Commercial Bank - Main
├─ is_header: False
└─ Result: ✅ ALLOWED - Transaction posted successfully

Scenario 2: Post to Header Account (Invalid)
├─ Account: 1200 - Bank Accounts
├─ is_header: True
└─ Result: ❌ BLOCKED - Cannot post to header account

Error Message:
"Cannot post transaction to header account '1200 - Bank Accounts'.
Please select a detail account (1201, 1202, or 1203)."

Business Rule:
Header accounts exist purely for organizational structure and 
reporting subtotals. All actual transactions must be posted to
detail (leaf) accounts.
```

### Balance Calculation for Headers

```
Header Balance Calculation
═══════════════════════════════════════════════════════════

1200 - Bank Accounts [HEADER]              Balance: Rs. 600,000
├── 1201 - Commercial Bank                 Balance: Rs. 250,000
├── 1202 - People's Bank                   Balance: Rs. 150,000
└── 1203 - Sampath Bank                    Balance: Rs. 200,000

Calculation:
Header Balance = Sum of Children Balances
              = 250,000 + 150,000 + 200,000
              = 600,000

Note: Header has no direct transactions. Balance is purely 
      calculated from children.

Implementation:
@property
def calculated_balance(self):
    if self.is_header:
        return self.get_descendants().aggregate(
            total=Sum('current_balance')
        )['total'] or 0
    return self.current_balance
```

### Header Account Naming Convention

```
Header Account Code Pattern
═══════════════════════════════════════════════════════════

Common Pattern: Headers End in 00

Asset Headers:
├── 1000 - Assets (root header)
├── 1100 - Current Assets (header)
├── 1200 - Bank Accounts (header)
├── 1300 - Receivables (header)
└── 1500 - Fixed Assets (header)

Detail Accounts: 
├── 1101, 1102, 1103 (Current Asset details)
├── 1201, 1202, 1203 (Bank Account details)
├── 1301, 1302, 1303 (Receivable details)
└── 1501, 1502, 1503 (Fixed Asset details)

Exception: Not all "00" accounts are headers
Some organizations use 1200 as a detail account. The is_header
flag is the definitive indicator, not the code pattern.
```

### Report Subtotaling with Headers

```
BALANCE SHEET
As at December 31, 2026
═══════════════════════════════════════════════════════════

ASSETS

Current Assets                                     [HEADER]
  Cash on Hand                        Rs.  50,000  [DETAIL]
  Petty Cash                          Rs.  10,000  [DETAIL]
  Cash in Transit                     Rs.  15,000  [DETAIL]
Total Current Assets                  Rs.  75,000  ← Subtotal

Bank Accounts                                      [HEADER]
  Commercial Bank - Main              Rs. 250,000  [DETAIL]
  People's Bank - Payroll             Rs. 150,000  [DETAIL]
  Sampath Bank - USD                  Rs. 200,000  [DETAIL]
Total Bank Accounts                   Rs. 600,000  ← Subtotal

Fixed Assets                                       [HEADER]
  Office Equipment                    Rs. 300,000  [DETAIL]
  Furniture & Fixtures                Rs. 200,000  [DETAIL]
  Motor Vehicles                      Rs. 500,000  [DETAIL]
Total Fixed Assets                    Rs. 1,000,000 ← Subtotal

TOTAL ASSETS                          Rs. 1,675,000 ← Grand Total
═══════════════════════════════════════════════════════════

Note: Subtotals (Total Current Assets, Total Bank Accounts, etc.)
      are calculated from header account balances.
```

### Header Account Query Patterns

#### Get All Header Accounts
```
Query Pattern:

headers = Account.objects.filter(
    tenant=tenant,
    is_header=True
)

Use Case: Generate report section headers
```

#### Get All Detail (Non-Header) Accounts
```
Query Pattern:

detail_accounts = Account.objects.filter(
    tenant=tenant,
    is_header=False
)

Use Case: Account selection for transaction posting
```

#### Get Leaf Accounts (Detail Accounts with No Children)
```
Query Pattern:

# Using MPTT method
leaf_accounts = [acc for acc in Account.objects.filter(tenant=tenant) 
                 if acc.is_leaf_node()]

# Or filter by is_header=False and has no children
leaf_accounts = Account.objects.filter(
    tenant=tenant,
    is_header=False,
    children__isnull=True
)

Use Case: Accounts that can receive transactions
```

### Validation Rules for Headers

```
Header Account Validation Rules
═══════════════════════════════════════════════════════════

Rule 1: Header Must Have Children
├─ Validation: If is_header=True, must have at least one child
├─ Enforcement: Optional (can create header then add children)
└─ Warning: "Header account should have child accounts"

Rule 2: Cannot Post Transactions to Header
├─ Validation: Block transaction if is_header=True
├─ Enforcement: Strict (prevent transaction creation)
└─ Error: "Cannot post to header account, select detail account"

Rule 3: Header Balance Not Directly Editable
├─ Validation: current_balance field ignored for headers
├─ Enforcement: Calculate from children
└─ Note: Display calculated balance instead

Rule 4: Code Pattern (Optional)
├─ Validation: Headers typically end in 00
├─ Enforcement: Optional warning
└─ Message: "Header accounts typically use codes ending in 00"
```

### Multi-Level Headers

```
Nested Header Accounts
═══════════════════════════════════════════════════════════

Some organizations use multi-level headers:

1000 - ASSETS [HEADER]
├── 1100 - Current Assets [HEADER]
│   ├── 1110 - Cash [HEADER]                 ← Sub-header
│   │   ├── 1111 - Cash on Hand [DETAIL]
│   │   └── 1112 - Petty Cash [DETAIL]
│   └── 1120 - Bank Accounts [HEADER]        ← Sub-header
│       ├── 1121 - Commercial Bank [DETAIL]
│       └── 1122 - People's Bank [DETAIL]

Balance Rollup:
1111 (50,000) + 1112 (10,000) → 1110 (60,000)
1121 (250,000) + 1122 (150,000) → 1120 (400,000)
1110 (60,000) + 1120 (400,000) → 1100 (460,000)
1100 (460,000) + ... → 1000 (Total Assets)

Recommendation: Limit to 1-2 header levels for simplicity
```

### Sri Lankan Chart Examples

#### Detailed Bank Account Structure
```
1200 - Bank Accounts [HEADER]
├── 1210 - Local Currency Accounts [HEADER]
│   ├── 1211 - Commercial Bank - Main LKR [DETAIL]
│   ├── 1212 - People's Bank - Payroll LKR [DETAIL]
│   └── 1213 - BOC - Savings LKR [DETAIL]
│
└── 1250 - Foreign Currency Accounts [HEADER]
    ├── 1251 - Commercial Bank - USD [DETAIL]
    ├── 1252 - HSBC - USD Trade [DETAIL]
    └── 1253 - Sampath Bank - EUR [DETAIL]
```

#### VAT Account Structure
```
2200 - Value Added Tax [HEADER]
├── 2201 - VAT Payable (15%) [DETAIL]
├── 2202 - VAT Reclaimable [DETAIL]
└── 2203 - VAT Withheld at Source [DETAIL]

Reporting:
Net VAT = 2201 (Output VAT) - 2202 (Input VAT) - 2203 (WHT)
Header 2200 shows net position
```

### Expected Outcome
- Clear distinction between header and detail accounts
- Transaction posting restricted to detail accounts only
- Header accounts provide reporting structure
- Balance rollup from children to headers
- Support for multi-level account hierarchies
- Improved chart of accounts organization
- Enhanced financial reporting with subtotals

### Verification Checklist
- [ ] is_header field added as BooleanField
- [ ] Default set to False
- [ ] Database index created
- [ ] Validation prevents transactions to header accounts
- [ ] Balance calculation documented for headers
- [ ] Admin interface shows header flag
- [ ] Filter for header/detail accounts available
- [ ] Help text explains header purpose
- [ ] Examples include multi-level headers
- [ ] Query patterns documented

---

## Task 28: Add Account Is System

### Overview
Add a boolean flag that identifies system-protected accounts that are critical to system operation and have special restrictions. System accounts cannot be deleted, and certain fields (like code and type) cannot be modified. These are typically control accounts like Accounts Receivable Control, Accounts Payable Control, and Retained Earnings that are managed by the system.

### Dependencies
- Task 18: Create Account Model
- Basic account fields implemented
- Understanding of control account concept

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add is_system field**
   - Use BooleanField
   - Default to False (most accounts are user-managed)
   - Mark as required (null=False, blank=False)
   - Add help_text warning about protected status

3. **Add database index**
   - Index the is_system field
   - Enables filtering system vs user accounts

4. **Implement protection logic**
   - Override delete method to prevent deletion if is_system=True
   - Add validation to prevent critical field changes
   - Protect code, type, parent changes on system accounts
   - Allow certain safe changes (name, description, status)

5. **Document system accounts**
   - List standard system accounts needed
   - Explain role of each system account
   - Document which fields can/cannot be changed

6. **Add admin warnings**
   - Show prominent warning for system accounts
   - Display read-only fields clearly
   - Add protective UI elements

### Is System Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | BooleanField | True/False flag |
| Default | False | Most accounts are user-managed |
| Required | Yes | Explicitly mark system accounts |
| Indexed | Yes | Fast filtering |
| Help Text | Yes | Warn about protection |
| Editable | Via Admin Only | Not for regular users |

### System vs User Accounts

```
┌──────────────────────────────────────────────────────────┐
│         System vs User Account Comparison                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  SYSTEM ACCOUNT (is_system=True):                         │
│    • Created automatically during setup                   │
│    • Critical to system functionality                     │
│    • Cannot be deleted                                    │
│    • Code cannot be changed                               │
│    • Type cannot be changed                               │
│    • Parent cannot be changed                             │
│    • Name can be changed (display only)                   │
│    • Status can be changed (with caution)                 │
│    • Description can be edited                            │
│    • Usually control accounts                             │
│    • Examples: AR Control, AP Control, Retained Earnings  │
│                                                           │
│  USER ACCOUNT (is_system=False):                          │
│    • Created by users                                     │
│    • Standard business accounts                           │
│    • Can be deleted (if no transactions)                  │
│    • Code can be changed (if no transactions)             │
│    • Type can be changed (with restrictions)              │
│    • Parent can be changed                                │
│    • All fields fully editable                            │
│    • Examples: Most bank, expense, revenue accounts       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Standard System Accounts

```
Common System Accounts in ERP
═══════════════════════════════════════════════════════════

CONTROL ACCOUNTS:

1300 - Accounts Receivable Control [SYSTEM]
├─ Purpose: Sum of all customer balances
├─ Auto-updated by customer invoices/payments
├─ Should equal subsidiary customer ledger total
└─ Protection: Prevent manual journal entries

2100 - Accounts Payable Control [SYSTEM]
├─ Purpose: Sum of all supplier balances
├─ Auto-updated by supplier bills/payments
├─ Should equal subsidiary supplier ledger total
└─ Protection: Prevent manual journal entries

1400 - Inventory Control [SYSTEM]
├─ Purpose: Total inventory value
├─ Auto-updated by inventory movements
├─ Should equal sum of all product inventory values
└─ Protection: Prevent direct postings

EQUITY ACCOUNTS:

3100 - Retained Earnings [SYSTEM]
├─ Purpose: Accumulated profits/losses
├─ Auto-updated by period close process
├─ Calculated: Prior years' net income
└─ Protection: Prevent manual changes

3200 - Current Year Earnings [SYSTEM]
├─ Purpose: Current period profit/loss
├─ Auto-calculated from revenue - expenses
├─ Updated real-time or on report generation
└─ Protection: Prevent manual postings

SUSPENSE ACCOUNTS:

1999 - Opening Balance Adjustments [SYSTEM]
├─ Purpose: Temporary account for migration
├─ Hold opening balances during setup
├─ Should be zero after reconciliation
└─ Protection: Reviewed before deletion

9999 - Unallocated Suspense [SYSTEM]
├─ Purpose: Temporary holding for unidentified items
├─ Requires regular review and clearance
├─ Should be zero under normal operations
└─ Protection: Flag for investigation
```

### System Account Protection Rules

```
Field-Level Protection Matrix
═══════════════════════════════════════════════════════════

Field               │ User Account │ System Account
────────────────────┼──────────────┼─────────────────
code                │ ✓ Editable   │ ✗ Read-only
name                │ ✓ Editable   │ ✓ Editable (display)
account_type        │ ⚠️ Limited   │ ✗ Read-only
parent              │ ✓ Editable   │ ✗ Read-only
category            │ ✓ Editable   │ ⚠️ Limited
status              │ ✓ Editable   │ ⚠️ With warnings
is_header           │ ✓ Editable   │ ✗ Read-only
description         │ ✓ Editable   │ ✓ Editable
currency            │ ✓ Editable   │ ⚠️ Limited
opening_balance     │ ✓ Editable   │ ⚠️ Admin only
current_balance     │ 🔒 Calculated│ 🔒 Calculated
Delete Account      │ ✓ Allowed    │ ✗ Blocked

Legend:
✓ Fully editable
⚠️ Editable with restrictions
✗ Cannot be changed
🔒 System-managed
```

### Delete Protection Implementation

```
Delete Protection Logic
═══════════════════════════════════════════════════════════

Attempt to Delete System Account:

Step 1: Check is_system Flag
├─ account.is_system = True
└─ ❌ BLOCKED

Error Message:
"Cannot delete system account '1300 - Accounts Receivable Control'.
This account is essential to system operation and is protected from deletion."

Implementation Pattern:

def delete(self, *args, **kwargs):
    if self.is_system:
        raise ProtectedError(
            f"Cannot delete system account '{self.code} - {self.name}'. "
            "This account is essential to system operation."
        )
    # Additional validation (check for transactions)
    super().delete(*args, **kwargs)
```

### Field Change Protection

```
Field Change Validation
═══════════════════════════════════════════════════════════

Scenario 1: Attempt to Change Code
├─ Account: 1300 - AR Control
├─ is_system: True
├─ Change: code 1300 → 1350
└─ Result: ❌ BLOCKED
   Error: "Cannot change code of system account"

Scenario 2: Attempt to Change Type
├─ Account: 1300 - AR Control  
├─ is_system: True
├─ Change: type Asset → Liability
└─ Result: ❌ BLOCKED
   Error: "Cannot change type of system account"

Scenario 3: Attempt to Change Name
├─ Account: 1300 - AR Control
├─ is_system: True
├─ Change: name "AR Control" → "Trade Receivables Control"
└─ Result: ✅ ALLOWED
   Note: Display name change is safe

Implementation in clean():

def clean(self):
    if self.is_system and self.pk:  # Existing system account
        original = Account.objects.get(pk=self.pk)
        
        if self.code != original.code:
            raise ValidationError("Cannot change code of system account")
        
        if self.account_type != original.account_type:
            raise ValidationError("Cannot change type of system account")
        
        if self.parent != original.parent:
            raise ValidationError("Cannot change parent of system account")
```

### Automated Balance Updates

```
System Account Balance Management
═══════════════════════════════════════════════════════════

AR Control Account (1300):

Transaction: Customer Invoice Created
├─ Customer: ABC Company
├─ Amount: Rs. 100,000
└─ Action: 
    ├─ Debit: 1300 - AR Control  Rs. 100,000
    └─ Credit: 4001 - Sales      Rs. 100,000

Transaction: Customer Payment Received  
├─ Customer: ABC Company
├─ Amount: Rs. 60,000
└─ Action:
    ├─ Debit: 1201 - Bank        Rs. 60,000
    └─ Credit: 1300 - AR Control Rs. 60,000

Result:
├─ AR Control Balance: Rs. 40,000
├─ Matches: Customer ABC outstanding = Rs. 40,000
└─ Reconciliation: ✓ Balanced

Key Point: All postings to AR Control are automated through
invoice/payment workflows. Manual journal entries should be blocked.
```

### Reconciliation Requirements

```
System Account Reconciliation
═══════════════════════════════════════════════════════════

AR Control Reconciliation:
├─ AR Control Account Balance:        Rs. 500,000
└─ Sum of Customer Balances:          Rs. 500,000
    Result: ✅ RECONCILED

AP Control Reconciliation:
├─ AP Control Account Balance:        Rs. 300,000
└─ Sum of Supplier Balances:          Rs. 300,000
    Result: ✅ RECONCILED

Inventory Control Reconciliation:
├─ Inventory Control Account:         Rs. 800,000
└─ Sum of Product Inventory Values:   Rs. 800,000
    Result: ✅ RECONCILED

If Unreconciled:
❌ AR Control: Rs. 500,000 vs Customer Total: Rs. 485,000
   Difference: Rs. 15,000
   Action: Investigate and correct discrepancy
```

### System Account Setup

```
System Account Creation (During Migration/Setup)
═══════════════════════════════════════════════════════════

Accounts to Create Automatically:

# Control Accounts
1300 - Accounts Receivable Control (is_system=True)
2100 - Accounts Payable Control (is_system=True)
1400 - Inventory Control (is_system=True)

# Equity Accounts
3100 - Retained Earnings (is_system=True)
3200 - Current Year Earnings (is_system=True)

# Tax Clearing Accounts (Sri Lanka)
2210 - VAT Clearing Account (is_system=True)
2220 - WHT Clearing Account (is_system=True)

# Suspense Accounts
1999 - Opening Balance Adjustments (is_system=True)
9999 - Unallocated Suspense (is_system=True)

Setup Process:
1. Run migration to create accounts table
2. Run data migration to create system accounts
3. Mark is_system=True for control accounts
4. Add descriptions explaining automation
5. Set appropriate parent relationships
6. Configure as header or detail as needed
```

### UI Warnings and Indicators

#### Admin Interface Display
```
╔═══════════════════════════════════════════════════════════╗
║  EDIT ACCOUNT: 1300 - Accounts Receivable Control         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ⚠️ WARNING: This is a SYSTEM ACCOUNT                     ║
║  This account is essential to system operation.           ║
║  Some fields are protected and cannot be changed.         ║
║                                                           ║
║  Code: [1300] 🔒 (Read-only)                              ║
║  Name: [Accounts Receivable Control]                      ║
║  Type: [Asset] 🔒 (Read-only)                             ║
║  Parent: [1300 - Receivables] 🔒 (Read-only)              ║
║  Status: [ACTIVE] ⚠️ (Change with caution)                ║
║                                                           ║
║  Balance: Rs. 500,000 🔒 (Automatically calculated)       ║
║                                                           ║
║  Description: [This is an automated control account...]   ║
║                                                           ║
║  ✓ is_header: [ ]                                         ║
║  ✓ is_system: [✓] 🔒 (Cannot be changed)                  ║
║                                                           ║
║  [Save Changes]  [Cancel]  🚫 [Delete] (Disabled)        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

#### Account List Display
```
CHART OF ACCOUNTS
═══════════════════════════════════════════════════════════
Code  Account Name                    Type    System  Balance
──────────────────────────────────────────────────────────
1201  Commercial Bank                 Detail          250,000
1300  AR Control                      Detail  🔒      500,000
1400  Inventory Control               Detail  🔒      800,000
2100  AP Control                      Detail  🔒      300,000
3100  Retained Earnings               Detail  🔒      450,000

Legend: 🔒 = System Account (Protected)
```

### Status Change Warnings for System Accounts

```
Status Change for System Account
═══════════════════════════════════════════════════════════

User attempts to set AR Control status to INACTIVE:

⚠️ WARNING: Changing Status of System Account

You are about to change the status of system account 
'1300 - Accounts Receivable Control' to INACTIVE.

Impact:
• AR Control is automatically updated by customer transactions
• Setting to INACTIVE may cause system errors
• Customer invoices and payments will fail to post
• Financial reports may be inaccurate

Recommendation: Keep system accounts ACTIVE at all times.

Are you sure you want to continue?
[Yes, Change Status]  [No, Cancel]
```

### Sri Lankan Context - System Accounts

#### Tax System Accounts
```
2200 - Tax Control Accounts [HEADER, SYSTEM]
├── 2210 - VAT Clearing [SYSTEM]
│   ├─ Auto-updated by sales invoices (output VAT)
│   └─ Auto-updated by purchase bills (input VAT)
│
├── 2220 - WHT Clearing [SYSTEM]
│   ├─ Auto-updated by supplier payments with WHT
│   └─ Auto-cleared when paid to IRD
│
└── 2230 - PAYE Clearing [SYSTEM]
    ├─ Auto-updated by payroll processing
    └─ Auto-cleared when paid to IRD

Note: These accounts should reconcile with tax return filings
```

### Expected Outcome
- System accounts properly identified and protected
- Deletion prevented for critical accounts
- Key fields locked from modification
- Control accounts support automated processes
- Reconciliation between control and subsidiary ledgers
- Clear warnings when editing system accounts
- Audit trail for system account changes
- System integrity maintained

### Verification Checklist
- [ ] is_system field added as BooleanField
- [ ] Default set to False
- [ ] Database index created
- [ ] Delete method overridden with protection
- [ ] Field change validation in clean method
- [ ] Standard system accounts documented
- [ ] Admin interface shows system warnings
- [ ] Protected fields clearly marked read-only
- [ ] Reconciliation requirements documented
- [ ] Examples include control accounts

---

## Summary

This document implemented the hierarchical tree structure and special account flags:

### Completed Hierarchy Fields
- ✅ Parent FK (Task 25) - TreeForeignKey for hierarchical relationships
- ✅ MPTT Configuration (Task 26) - MPTTMeta with code-based ordering
- ✅ Is Header Flag (Task 27) - Identifies summary accounts that cannot receive transactions
- ✅ Is System Flag (Task 28) - Protects critical system accounts from deletion/modification

### Key Achievements
1. **Tree Structure** - Full MPPT hierarchy with parent-child relationships
2. **Efficient Queries** - O(1) ancestor/descendant lookups via MPTT
3. **Code-Based Ordering** - Natural numeric sorting at each tree level
4. **Header Accounts** - Summary accounts for reporting subtotals
5. **System Protection** - Critical accounts cannot be deleted or improperly modified
6. **Control Accounts** - Foundation for automated AR, AP, inventory tracking

### MPTT Capabilities
- get_ancestors() - Breadcrumb navigation
- get_descendants() - All children recursively
- get_children() - Direct children only
- is_leaf_node() - Check if detail account
- Tree traversal and reorganization

### Business Rules Enforced
- Only detail (non-header) accounts receive transactions
- System accounts protected from deletion and critical changes
- Parent must be same tenant
- Circular references prevented
- Code-based tree ordering maintained

### Next Steps
Proceed to [04_Tasks-29-34_Balance-Currency-Constraints.md](04_Tasks-29-34_Balance-Currency-Constraints.md) to implement currency support, balance fields, timestamps, run migrations, and add final model constraints.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~975
