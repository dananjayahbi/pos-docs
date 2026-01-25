# Tasks 72-74: Account Serializers

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** E - Admin & Serializers  
> **Document:** 02 of 03  
> **Tasks Covered:** 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-71_Account-Admin-Config.md](01_Tasks-67-71_Account-Admin-Config.md)
- **→ Next Document:** [03_Tasks-75-78_Type-Template-Validation.md](03_Tasks-75-78_Type-Template-Validation.md)

---

## Document Overview

This document covers the creation of Django REST Framework serializers for the Account model. These serializers will support flat account representation, nested children for hierarchical display, and full tree serialization with ancestors and descendants. The serializers enable comprehensive API responses for various frontend requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 72 | Create AccountSerializer | Medium | 30 min |
| 73 | Add Nested Children Serializer | Medium | 35 min |
| 74 | Create AccountTreeSerializer | Medium | 40 min |

---

## Task 72: Create AccountSerializer

### Overview
Create the base AccountSerializer class in Django REST Framework to serialize Account model instances for API responses. This serializer will handle basic account information including code, name, type, category, status, and balance. It serves as the foundation for more complex serializers and API endpoints.

### Dependencies
- Account model is fully implemented
- AccountTypeConfig model exists
- Django REST Framework is installed and configured

### Instructions

1. **Create serializers directory structure**
   - Navigate to apps/accounting/ directory
   - Create serializers/ subdirectory
   - Create __init__.py in serializers/
   - This organizes multiple serializers

2. **Create account.py serializer module**
   - Create serializers/account.py file
   - This will contain AccountSerializer
   - Import necessary DRF components

3. **Import required dependencies**
   - Import serializers from rest_framework
   - Import Account model from models
   - Import AccountTypeConfig model
   - Import any custom validators

4. **Create AccountSerializer class**
   - Define class inheriting from serializers.ModelSerializer
   - Set model to Account in Meta class
   - Begin with basic field configuration

5. **Define Meta class**
   - Set model = Account
   - Define fields tuple (explicit is better)
   - Set read_only_fields for calculated fields
   - Configure depth if needed for nested objects

6. **Include basic identification fields**
   - Include 'id' field (auto UUID or BigInt)
   - Include 'code' field (account code)
   - Include 'name' field (account name)
   - Include 'description' field (optional text)

7. **Include classification fields**
   - Include 'account_type' field (foreign key)
   - Include 'category' field (choice field)
   - Include 'status' field (choice field)
   - These define account classification

8. **Include structural fields**
   - Include 'parent' field (nullable foreign key)
   - Include 'is_header' field (boolean)
   - Include 'is_system' field (boolean)
   - Include 'is_control' field (if model has it)

9. **Include balance fields**
   - Include 'current_balance' field (read-only)
   - Include 'opening_balance' field
   - Include 'currency' field (from tenant or explicit)
   - Format balance with DecimalField

10. **Include MPTT tree fields**
    - Include 'level' field (read-only)
    - Include 'tree_id' field (read-only)
    - These show position in hierarchy
    - Do not include lft, rght (internal use only)

11. **Include metadata fields**
    - Include 'created_at' field (read-only)
    - Include 'updated_at' field (read-only)
    - Include 'created_by' field (if model has it)
    - Include 'tenant' field (for multi-tenancy)

12. **Configure nested account_type**
    - Use nested serializer for account_type
    - Create simple AccountTypeConfigSerializer
    - Show type_code and type_name
    - Avoid deep nesting (depth=1 max)

13. **Configure read-only fields**
    - Set current_balance as read-only
    - Set is_system as read-only
    - Set MPTT fields as read-only
    - Set audit fields as read-only

14. **Add custom fields (optional)**
    - Add 'children_count' using SerializerMethodField
    - Add 'has_transactions' using SerializerMethodField
    - Add 'full_code_name' combining code and name
    - Add 'balance_formatted' with currency symbol

15. **Add serializer docstring**
    - Document serializer purpose
    - List included fields
    - Note read-only fields
    - Explain nested objects

### Serializer Structure

```
AccountSerializer
├── Identification
│   ├── id (read-only)
│   ├── code
│   ├── name
│   └── description
├── Classification
│   ├── account_type (nested)
│   ├── category
│   └── status
├── Hierarchy
│   ├── parent_id
│   ├── is_header
│   ├── is_system (read-only)
│   └── level (read-only)
├── Balances
│   ├── opening_balance
│   ├── current_balance (read-only)
│   └── currency
└── Metadata
    ├── created_at (read-only)
    ├── updated_at (read-only)
    └── tenant
```

### Field Configuration Details

| Field | Type | Read-Only | Purpose |
|-------|------|-----------|---------|
| id | UUID/Integer | Yes | Unique identifier |
| code | String | No | Account code (1100) |
| name | String | No | Account name |
| description | Text | No | Account description |
| account_type | Nested | No | Account type object |
| category | Choice | No | Category classification |
| status | Choice | No | Active/Inactive/Archived |
| parent | FK | No | Parent account ID |
| is_header | Boolean | No | Header account flag |
| is_system | Boolean | Yes | System account flag |
| current_balance | Decimal | Yes | Current balance |
| opening_balance | Decimal | No | Opening balance |
| level | Integer | Yes | Tree depth level |
| created_at | DateTime | Yes | Creation timestamp |
| updated_at | DateTime | Yes | Last update timestamp |

### Nested AccountTypeConfig Serializer

#### Purpose
- Show account type information in account response
- Avoid separate API call for type details
- Keep response compact

#### Fields to Include
- type_code (Asset, Liability, etc.)
- type_name (display name)
- normal_balance (Debit/Credit)
- category_required (boolean)

#### Implementation
- Create simple serializer class
- Include in AccountSerializer
- Set as nested field: account_type = AccountTypeConfigSerializer(read_only=True)

### Custom SerializerMethodField Examples

#### children_count
- Returns count of immediate children
- Useful for tree navigation
- Implementation: `return obj.get_children().count()`

#### has_transactions
- Returns boolean if account has transactions
- Useful for deletion validation
- Implementation: `return obj.journal_entries.exists()`

#### full_code_name
- Returns formatted "code - name"
- Useful for dropdowns
- Implementation: `return f"{obj.code} - {obj.name}"`

#### balance_formatted
- Returns balance with currency symbol
- Useful for display
- Implementation: `return f"${obj.current_balance:,.2f}"`

### Read-Only Field Considerations

#### Why Read-Only?
- **current_balance**: Calculated from transactions
- **is_system**: Set by fixtures, not user
- **level**: Calculated by MPTT
- **tree_id**: Calculated by MPTT
- **lft, rght**: MPTT internal fields
- **created_at, updated_at**: Set by database

#### Configuration
```
Meta:
    read_only_fields = [
        'id',
        'current_balance',
        'is_system',
        'level',
        'tree_id',
        'created_at',
        'updated_at',
    ]
```

### API Response Example

#### Flat Account Response
```json
{
  "id": 123,
  "code": "1100",
  "name": "Current Assets",
  "description": "Assets convertible to cash within one year",
  "account_type": {
    "type_code": "Asset",
    "type_name": "Asset",
    "normal_balance": "Debit"
  },
  "category": "Current",
  "status": "Active",
  "parent": 1,
  "is_header": true,
  "is_system": true,
  "current_balance": "125000.00",
  "opening_balance": "100000.00",
  "level": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### Expected Outcome
- AccountSerializer class created and functional
- Serializes all relevant account fields
- Nested account type information
- Read-only fields properly configured
- Ready for use in API views

### Verification Checklist
- [ ] serializers/ directory created
- [ ] account.py module created
- [ ] AccountSerializer class defined
- [ ] Meta class configured with model
- [ ] All essential fields included
- [ ] account_type nested serializer created
- [ ] Read-only fields configured
- [ ] Custom method fields added (if applicable)
- [ ] Serializer docstring added
- [ ] Test serialization of Account instance
- [ ] Verify JSON output structure
- [ ] Check read-only field enforcement

---

## Task 73: Add Nested Children Serializer

### Overview
Extend AccountSerializer to include nested children accounts using SerializerMethodField. This enables recursive serialization of account hierarchies, allowing clients to display tree structures without making multiple API calls. The nested structure supports dynamic tree views in frontend applications.

### Dependencies
- Task 72: Create AccountSerializer

### Instructions

1. **Add children field to AccountSerializer**
   - Open serializers/account.py
   - Add 'children' field using SerializerMethodField
   - This will recursively serialize child accounts

2. **Create get_children method**
   - Define get_children(self, obj) method
   - This is called by SerializerMethodField
   - Returns serialized child accounts

3. **Query child accounts**
   - Use obj.get_children() from MPTT
   - This returns immediate children only (one level)
   - Filter by status if needed (active only)
   - Order by code or tree order

4. **Recursively serialize children**
   - Call AccountSerializer on children queryset
   - Set many=True for multiple children
   - Pass context to maintain request context
   - This enables nested children of children

5. **Handle recursion depth**
   - Add max_depth parameter to context
   - Prevent infinite recursion
   - Default to 3 or 4 levels deep
   - Check depth before recursing

6. **Add depth tracking**
   - Track current depth in context
   - Increment depth for each level
   - Stop recursion at max_depth
   - Return empty list at max depth

7. **Optimize query performance**
   - Use select_related for account_type
   - Use prefetch_related for children
   - Avoid N+1 query problem
   - Consider caching for large trees

8. **Add conditional children inclusion**
   - Add 'include_children' parameter to context
   - Allow API to request flat or nested response
   - Default to False for performance
   - Enable via query parameter

9. **Filter children by status**
   - Only include active children
   - Or respect status filter from request
   - Prevents showing archived accounts
   - Make configurable via context

10. **Handle empty children**
    - Return empty list if no children
    - Do not return null
    - Consistent response structure
    - Frontend can check length

11. **Add children_count field**
    - Add separate children_count field
    - Count immediate children only
    - Useful for showing expand icons
    - Less expensive than full serialization

12. **Test recursive serialization**
    - Test with various tree depths
    - Test with large number of children
    - Test performance with deep trees
    - Verify recursion stops at max_depth

### Nested Children Structure

```
AccountSerializer (with children)
├── Basic fields (from Task 72)
├── children (SerializerMethodField)
│   └── List[AccountSerializer]
│       ├── Child 1 (all fields)
│       │   └── children (recursive)
│       ├── Child 2 (all fields)
│       │   └── children (recursive)
│       └── Child N (all fields)
│           └── children (recursive)
└── children_count (SerializerMethodField)
```

### Recursion Control

#### Max Depth Parameter
- Passed in serializer context
- Default: 3 levels
- Configurable per request
- Prevents performance issues

#### Implementation
```python
def get_children(self, obj):
    max_depth = self.context.get('max_depth', 3)
    current_depth = self.context.get('current_depth', 0)
    
    if current_depth >= max_depth:
        return []
    
    children = obj.get_children().filter(status='Active')
    
    # Create new context with incremented depth
    child_context = self.context.copy()
    child_context['current_depth'] = current_depth + 1
    
    return AccountSerializer(children, many=True, context=child_context).data
```

### Performance Optimization

#### Problem: N+1 Queries
- Without optimization, each child triggers a query
- 100 accounts = 100+ queries
- Unacceptable performance

#### Solution: Prefetch Related
- Use get_descendants() with prefetch
- Load entire subtree in one query
- Serialize from memory
- Dramatic performance improvement

#### Implementation Approach
- Prefetch in view's get_queryset()
- Use select_related('account_type')
- Use prefetch_related('children')
- MPTT's get_descendants() is efficient

### API Response Example

#### Nested Account Response
```json
{
  "id": 1,
  "code": "1000",
  "name": "Assets",
  "account_type": {"type_code": "Asset", "type_name": "Asset"},
  "is_header": true,
  "current_balance": "250000.00",
  "children_count": 2,
  "children": [
    {
      "id": 2,
      "code": "1100",
      "name": "Current Assets",
      "is_header": true,
      "current_balance": "150000.00",
      "children_count": 2,
      "children": [
        {
          "id": 3,
          "code": "1110",
          "name": "Cash & Bank",
          "is_header": true,
          "current_balance": "50000.00",
          "children_count": 2,
          "children": [
            {
              "id": 4,
              "code": "1111",
              "name": "Cash on Hand",
              "is_header": false,
              "current_balance": "5000.00",
              "children_count": 0,
              "children": []
            },
            {
              "id": 5,
              "code": "1112",
              "name": "Cash at Bank",
              "is_header": false,
              "current_balance": "45000.00",
              "children_count": 0,
              "children": []
            }
          ]
        },
        {
          "id": 6,
          "code": "1120",
          "name": "Accounts Receivable",
          "is_header": false,
          "current_balance": "100000.00",
          "children_count": 0,
          "children": []
        }
      ]
    },
    {
      "id": 7,
      "code": "1200",
      "name": "Non-Current Assets",
      "is_header": true,
      "current_balance": "100000.00",
      "children_count": 0,
      "children": []
    }
  ]
}
```

### Conditional Children Inclusion

#### Purpose
- Allow clients to request flat or nested response
- Improve performance when tree not needed
- Reduce response size

#### Implementation
- Check context for 'include_children' flag
- Return empty list if False
- Enable via query parameter: ?include_children=true

#### Example
```python
def get_children(self, obj):
    if not self.context.get('include_children', False):
        return []
    
    # ... rest of method
```

### Use Cases

#### Tree Navigation
- Display hierarchical account picker
- Show full account tree in UI
- Expand/collapse account groups
- Navigate account hierarchy

#### Reporting
- Display account structure in reports
- Show parent-child relationships
- Group accounts by hierarchy
- Drill-down functionality

#### Account Selection
- Choose account with context
- See where account fits in hierarchy
- Understand account relationships
- Prevent invalid parent selection

### Expected Outcome
- AccountSerializer includes nested children
- Recursive serialization controlled by depth
- Performance optimized with prefetching
- Conditional inclusion via context flag
- Clean hierarchical JSON structure

### Verification Checklist
- [ ] children field added to AccountSerializer
- [ ] get_children method implemented
- [ ] Recursion depth controlled
- [ ] max_depth parameter supported
- [ ] current_depth tracked in context
- [ ] children_count field added
- [ ] Performance optimization implemented
- [ ] Conditional inclusion supported
- [ ] Test nested serialization works
- [ ] Test recursion stops at max_depth
- [ ] Test performance with large trees
- [ ] Verify no N+1 query issues

---

## Task 74: Create AccountTreeSerializer

### Overview
Create a specialized AccountTreeSerializer for serializing complete account trees including ancestors and descendants. This serializer provides comprehensive tree information useful for reporting, tree visualization, and understanding account context within the full hierarchy. Unlike the nested children serializer, this includes both upward (ancestors) and downward (descendants) relationships.

### Dependencies
- Task 73: Add Nested Children Serializer

### Instructions

1. **Create account_tree.py module**
   - Create serializers/account_tree.py file
   - This will contain AccountTreeSerializer
   - Import AccountSerializer from account.py

2. **Create AccountTreeSerializer class**
   - Define class inheriting from AccountSerializer
   - Extends base with tree-specific fields
   - Reuses all base fields from AccountSerializer

3. **Add ancestors field**
   - Use SerializerMethodField for ancestors
   - Returns list of parent accounts up to root
   - Ordered from root to immediate parent
   - Provides breadcrumb navigation

4. **Create get_ancestors method**
   - Define get_ancestors(self, obj) method
   - Use obj.get_ancestors() from MPTT
   - Returns queryset of ancestor accounts
   - Order by level ascending (root first)

5. **Serialize ancestor accounts**
   - Use AccountSerializer for ancestors
   - Set many=True for list
   - Include basic fields only (not full nesting)
   - Pass context for consistency

6. **Add descendants field**
   - Use SerializerMethodField for descendants
   - Returns list of all child accounts recursively
   - Provides complete subtree
   - Useful for bulk operations

7. **Create get_descendants method**
   - Define get_descendants(self, obj) method
   - Use obj.get_descendants() from MPTT
   - Returns all descendants at all levels
   - Order by tree order (tree_id, lft)

8. **Serialize descendant accounts**
   - Use AccountSerializer for descendants
   - Set many=True for list
   - Consider flattening vs nesting
   - Pass context for consistency

9. **Add siblings field**
   - Use SerializerMethodField for siblings
   - Returns accounts at same level with same parent
   - Excludes current account
   - Useful for account comparison

10. **Create get_siblings method**
    - Define get_siblings(self, obj) method
    - Use obj.get_siblings() from MPTT
    - Exclude self from results
    - Order by code or name

11. **Add tree path field**
    - Create full tree path string
    - Example: "Assets > Current Assets > Cash & Bank"
    - Uses ancestors and current account
    - Useful for display and search

12. **Create get_tree_path method**
    - Get ancestors plus current account
    - Join names with separator (>)
    - Return full path string
    - Cache if possible for performance

13. **Add depth information**
    - Include tree depth (level)
    - Include descendant count
    - Include leaf status (has no children)
    - Useful for tree visualization

14. **Optimize query performance**
    - Prefetch ancestors, descendants, siblings
    - Use select_related for types
    - Avoid N+1 queries
    - Consider caching for static trees

15. **Add tree statistics**
    - Total descendants count
    - Total balance of subtree
    - Deepest descendant level
    - Useful for reporting

16. **Configure response format**
    - Decide on flat vs nested descendants
    - Include/exclude fields based on use case
    - Support minimal vs full tree modes
    - Configure via context parameters

### AccountTreeSerializer Structure

```
AccountTreeSerializer (extends AccountSerializer)
├── All AccountSerializer fields
├── Tree Navigation
│   ├── ancestors (List[AccountSerializer])
│   ├── descendants (List[AccountSerializer])
│   ├── siblings (List[AccountSerializer])
│   └── tree_path (String)
├── Tree Statistics
│   ├── level (from MPTT)
│   ├── descendants_count
│   ├── is_leaf (boolean)
│   └── subtree_balance
└── Tree Metadata
    ├── tree_id (from MPTT)
    └── depth_from_root
```

### Ancestors Field Details

| Aspect | Description |
|--------|-------------|
| Purpose | Show path from root to current account |
| Source | MPTT get_ancestors() method |
| Order | Root first, immediate parent last |
| Use Case | Breadcrumb navigation, context display |
| Serialization | Basic AccountSerializer (no nesting) |

### Descendants Field Details

| Aspect | Description |
|--------|-------------|
| Purpose | Show all child accounts recursively |
| Source | MPTT get_descendants() method |
| Order | Tree order (depth-first) |
| Use Case | Subtree operations, reporting |
| Serialization | Flat list or nested tree |

### API Response Example

#### Complete Tree Response
```json
{
  "id": 3,
  "code": "1110",
  "name": "Cash & Bank",
  "account_type": {"type_code": "Asset", "type_name": "Asset"},
  "is_header": true,
  "current_balance": "50000.00",
  "level": 2,
  
  "ancestors": [
    {
      "id": 1,
      "code": "1000",
      "name": "Assets",
      "level": 0
    },
    {
      "id": 2,
      "code": "1100",
      "name": "Current Assets",
      "level": 1
    }
  ],
  
  "descendants": [
    {
      "id": 4,
      "code": "1111",
      "name": "Cash on Hand",
      "level": 3,
      "current_balance": "5000.00"
    },
    {
      "id": 5,
      "code": "1112",
      "name": "Cash at Bank",
      "level": 3,
      "current_balance": "45000.00"
    }
  ],
  
  "siblings": [
    {
      "id": 6,
      "code": "1120",
      "name": "Accounts Receivable",
      "level": 2
    }
  ],
  
  "tree_path": "Assets > Current Assets > Cash & Bank",
  "descendants_count": 2,
  "is_leaf": false,
  "subtree_balance": "50000.00"
}
```

### Tree Path Implementation

#### Purpose
- Provide human-readable path from root
- Enable search by full path
- Display context in UI
- Support breadcrumb navigation

#### Format
- Separator: " > " (with spaces)
- Example: "Assets > Current Assets > Cash & Bank > Cash on Hand"
- Include all ancestors plus current account
- Always start with root account

#### Implementation Logic
```python
def get_tree_path(self, obj):
    ancestors = obj.get_ancestors()
    path_parts = [a.name for a in ancestors] + [obj.name]
    return " > ".join(path_parts)
```

### Subtree Balance Calculation

#### Purpose
- Calculate total balance of account and all descendants
- Useful for reporting and analytics
- Shows complete financial position of account group

#### Implementation
- Sum current_balance of self and descendants
- Consider normal balance for correct arithmetic
- Handle different currencies if applicable
- Cache result for performance

### Use Cases

#### Account Detail View
- Show complete context of account
- Display ancestors for navigation
- Show descendants for overview
- Enable quick navigation to related accounts

#### Reporting
- Generate balance sheet with hierarchy
- Show account groups with subtotals
- Display account relationships
- Export tree structure

#### Tree Visualization
- Build interactive tree widget
- Show full hierarchy with selection
- Enable expand/collapse of branches
- Highlight current account in tree

#### Account Analysis
- Compare sibling accounts
- Analyze subtree balances
- Understand account relationships
- Identify hierarchy issues

### Performance Considerations

#### Prefetch Strategy
- Prefetch ancestors for all accounts in queryset
- Prefetch descendants if needed (expensive)
- Use select_related for account_type
- Limit descendant depth if possible

#### Caching Strategy
- Cache tree structure if it rarely changes
- Cache ancestor paths
- Cache subtree balances
- Invalidate cache on account changes

#### Response Size
- Full tree responses can be large
- Consider pagination for descendants
- Offer minimal vs full response modes
- Support field selection

### Expected Outcome
- AccountTreeSerializer provides complete tree context
- Ancestors show path from root
- Descendants show full subtree
- Siblings show related accounts
- Tree path provides readable location
- Performance optimized with prefetching

### Verification Checklist
- [ ] account_tree.py module created
- [ ] AccountTreeSerializer class defined
- [ ] Inherits from AccountSerializer
- [ ] ancestors field implemented
- [ ] get_ancestors method works correctly
- [ ] descendants field implemented
- [ ] get_descendants method works correctly
- [ ] siblings field implemented
- [ ] tree_path field implemented
- [ ] Tree statistics fields added
- [ ] Performance optimization implemented
- [ ] Test with various account positions
- [ ] Test with root accounts (no ancestors)
- [ ] Test with leaf accounts (no descendants)
- [ ] Verify no N+1 query issues
- [ ] Test response size is reasonable

---

## Summary Diagram: Serializer Hierarchy

```
DRF Serializers for Account Model
│
├─── Task 72: AccountSerializer (Base)
│    ├─── Identification fields (id, code, name)
│    ├─── Classification fields (type, category, status)
│    ├─── Hierarchy fields (parent, is_header, level)
│    ├─── Balance fields (current, opening)
│    └─── Metadata fields (created_at, updated_at)
│
├─── Task 73: Nested Children
│    ├─── Extends AccountSerializer
│    ├─── Adds children field (recursive)
│    ├─── Controls recursion depth
│    ├─── Optimizes with prefetching
│    └─── Conditional inclusion
│
└─── Task 74: AccountTreeSerializer (Full Tree)
     ├─── Extends AccountSerializer
     ├─── Adds ancestors (upward path)
     ├─── Adds descendants (downward tree)
     ├─── Adds siblings (same level)
     ├─── Adds tree_path (full path string)
     ├─── Adds tree statistics
     └─── Complete tree context

Usage Patterns:
├─── API List View → AccountSerializer (flat)
├─── Tree Picker → AccountSerializer with children
├─── Account Detail → AccountTreeSerializer (full context)
└─── Reports → AccountTreeSerializer (hierarchy)
```

---

## End of Document

**Next Steps:** Proceed to [03_Tasks-75-78_Type-Template-Validation.md](03_Tasks-75-78_Type-Template-Validation.md) to create serializers for AccountTypeConfig and COATemplate with validation.
