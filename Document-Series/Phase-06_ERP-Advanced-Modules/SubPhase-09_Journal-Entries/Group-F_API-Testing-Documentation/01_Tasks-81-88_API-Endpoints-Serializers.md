# Tasks 81-88: API Endpoints & Serializers

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Approval-Posting](../Group-E_Approval-Posting/)
- **→ Next Document:** [02_Tasks-89-94_Testing-Documentation.md](02_Tasks-89-94_Testing-Documentation.md)

---

## Document Overview

This document covers the implementation of Django admin configuration and REST API endpoints for journal entries. The admin interface provides efficient entry management with inline line editing and bulk actions, while the API exposes full CRUD operations plus specialized workflow actions for posting, voiding, and approving entries.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create JournalEntry Admin | Medium | 35 min |
| 82 | Add Admin Inline Lines | Medium | 30 min |
| 83 | Add Admin List Display | Low | 15 min |
| 84 | Add Admin Actions | Medium | 35 min |
| 85 | Create JournalEntrySerializer | Medium | 40 min |
| 86 | Create JournalEntryLineSerializer | Low | 20 min |
| 87 | Create JournalEntryViewSet | Medium | 40 min |
| 88 | Add Post Entry Endpoint | Medium | 30 min |

---

## Task 81: Create JournalEntry Admin

### Overview
Create the Django admin configuration for the JournalEntry model, providing a user-friendly interface for viewing, creating, and managing journal entries. The admin interface will serve as a powerful tool for accounting staff to manage entries efficiently with proper field organization and filters.

### Dependencies
- Task 80: Add Schedule Reversal Method
- JournalEntry model complete
- Django admin framework available

### Instructions

1. **Open or update admin.py file**
   - Navigate to `apps/accounting/admin.py`
   - Import necessary Django admin components

2. **Import required modules**
   - Import admin from django.contrib
   - Import JournalEntry model
   - Import JournalEntryLine model (for next task)
   - Import User model for created_by/posted_by fields

3. **Create JournalEntryAdmin class**
   - Inherit from admin.ModelAdmin
   - Add class docstring explaining purpose
   - Configure for comprehensive entry management

4. **Define list_display attribute**
   - Show entry_number
   - Show entry_date
   - Show entry_type
   - Show status
   - Show total_debit
   - Show total_credit
   - Show created_by
   - Show created_at

5. **Define list_filter attribute**
   - Filter by status
   - Filter by entry_type
   - Filter by source
   - Filter by entry_date (date hierarchy)
   - Filter by created_by

6. **Define search_fields attribute**
   - Search by entry_number
   - Search by description
   - Search by reference
   - Search by created_by username

7. **Define readonly_fields attribute**
   - entry_number (auto-generated)
   - total_debit (calculated)
   - total_credit (calculated)
   - created_by, created_at
   - posted_by, posted_at (if posted)
   - reversal_of (FK, display only)

8. **Define fieldsets attribute**
   - Group: Entry Information
     - Fields: entry_number, entry_date, entry_type, status
   - Group: Source & Reference
     - Fields: source, reference
   - Group: Description
     - Fields: description
   - Group: Totals
     - Fields: total_debit, total_credit
   - Group: Metadata
     - Fields: created_by, created_at, posted_by, posted_at
   - Group: Relationships
     - Fields: reversal_of (if applicable)

9. **Add date_hierarchy attribute**
   - Set to 'entry_date'
   - Enables date-based navigation
   - Useful for monthly/yearly browsing

10. **Add ordering attribute**
    - Order by '-entry_date' (newest first)
    - Secondary order by '-entry_number'

11. **Define get_queryset method**
    - Override to add select_related
    - Optimize for created_by, posted_by
    - Add prefetch_related for lines
    - Reduce database queries

12. **Register admin class**
    - Use admin.site.register decorator
    - Link JournalEntry model to admin class

### JournalEntryAdmin Structure

```
┌─────────────────────────────────────────────────┐
│         JournalEntryAdmin Configuration         │
├─────────────────────────────────────────────────┤
│ Display Settings:                               │
│  • list_display - Table columns                 │
│  • list_filter - Sidebar filters                │
│  • search_fields - Search functionality         │
│  • date_hierarchy - Date navigation             │
│                                                 │
│ Field Organization:                             │
│  • fieldsets - Grouped field layout             │
│  • readonly_fields - Protected fields           │
│                                                 │
│ Performance:                                    │
│  • get_queryset - Query optimization            │
│                                                 │
│ Actions (Next Task):                            │
│  • Bulk post, void, approve                     │
└─────────────────────────────────────────────────┘
```

### Admin List View Layout

```
Journal Entries
═══════════════════════════════════════════════════════════════════

Filters:                    Search: [entry number, description...]
├─ Status                   
│  ├─ DRAFT                [Add Entry] [Actions ▼]
│  ├─ POSTED               
│  ├─ VOID                 Entry Number | Date       | Type      | Status | Debit      | Credit     | Created By
│  └─ PENDING_APPROVAL     ═══════════════════════════════════════════════════════════════════════════════════════
├─ Entry Type              JE-2025-1250 | 2025-12-31 | ADJUSTING | POSTED | 150,000.00 | 150,000.00 | admin
│  ├─ MANUAL               JE-2025-1249 | 2025-12-30 | MANUAL    | POSTED |  75,000.00 |  75,000.00 | john
│  ├─ ADJUSTING            JE-2025-1248 | 2025-12-29 | AUTO      | POSTED |  50,000.00 |  50,000.00 | system
│  ├─ AUTO                 JE-2025-1247 | 2025-12-28 | MANUAL    | DRAFT  |  25,000.00 |  25,000.00 | jane
│  └─ REVERSING            
└─ Source                  [Pagination: 1 2 3 ... 10 Next]
   ├─ manual_entry
   ├─ sales_invoice
   └─ adjusting_entries

Date Hierarchy: 2025 ▶ December ▶ 31
```

### Detail View Fieldsets

```
Change Journal Entry: JE-2025-1250
══════════════════════════════════

Entry Information
┌─────────────────────────────────────────┐
│ Entry Number: JE-2025-1250              │
│ Entry Date:   [2025-12-31]              │
│ Entry Type:   [ADJUSTING ▼]             │
│ Status:       POSTED                    │
└─────────────────────────────────────────┘

Source & Reference
┌─────────────────────────────────────────┐
│ Source:       [adjusting_entries ▼]     │
│ Reference:    [Optional reference]      │
└─────────────────────────────────────────┘

Description
┌─────────────────────────────────────────┐
│ [Accrued salary expense for December]   │
│                                         │
└─────────────────────────────────────────┘

Totals
┌─────────────────────────────────────────┐
│ Total Debit:  150,000.00                │
│ Total Credit: 150,000.00                │
└─────────────────────────────────────────┘

Entry Lines (Inline - Added in Task 82)
┌─────────────────────────────────────────┐
│ [Line items displayed here]             │
└─────────────────────────────────────────┘

Metadata
┌─────────────────────────────────────────┐
│ Created By:   admin                     │
│ Created At:   2025-12-31 14:30:00       │
│ Posted By:    admin                     │
│ Posted At:    2025-12-31 15:00:00       │
└─────────────────────────────────────────┘
```

### List Display Fields

| Field | Display | Purpose | Format |
|-------|---------|---------|--------|
| entry_number | Entry # | Unique identifier | JE-2025-1250 |
| entry_date | Date | Transaction date | 2025-12-31 |
| entry_type | Type | Entry category | ADJUSTING |
| status | Status | Current state | POSTED |
| total_debit | Debit | Total DR amount | 150,000.00 |
| total_credit | Credit | Total CR amount | 150,000.00 |
| created_by | Created By | User who created | admin |
| created_at | Created | Creation timestamp | 2025-12-31 14:30 |

### List Filters Configuration

```python
list_filter = (
    'status',           # DRAFT, POSTED, VOID, etc.
    'entry_type',       # MANUAL, ADJUSTING, etc.
    'source',           # manual_entry, sales_invoice, etc.
    ('entry_date', admin.DateFieldListFilter),
    'created_by',       # User filter
)
```

### Search Functionality

| Search Field | Indexed | Search Type | Example Query |
|-------------|---------|-------------|---------------|
| entry_number | Yes | Exact/starts with | "JE-2025-1250" |
| description | Yes | Contains | "salary" |
| reference | Yes | Contains | "INV-2025" |
| created_by__username | Yes | Exact | "admin" |

### Query Optimization

```python
def get_queryset(self, request):
    """
    Optimize queryset with select_related and prefetch_related
    to reduce database queries on list and detail views.
    """
    queryset = super().get_queryset(request)
    return queryset.select_related(
        'created_by',
        'posted_by',
        'reversal_of'
    ).prefetch_related(
        'lines',
        'lines__account'
    )
```

**Performance Impact:**
- Without optimization: ~50 queries for 25 entries
- With optimization: ~5 queries for 25 entries
- 90% reduction in database calls

### Readonly Field Configuration

| Field | Why Readonly | When Set |
|-------|-------------|----------|
| entry_number | Auto-generated | On save |
| total_debit | Calculated from lines | On save |
| total_credit | Calculated from lines | On save |
| created_by | Set on creation | On initial save |
| created_at | Auto timestamp | On creation |
| posted_by | Set when posted | On post action |
| posted_at | Auto timestamp | On post action |
| reversal_of | FK relationship | On reversal creation |

### Expected Outcome
- Functional Django admin for JournalEntry
- Well-organized field layout
- Efficient filtering and searching
- Optimized database queries
- Foundation for inline lines and actions

### Verification Checklist
- [ ] admin.py file updated
- [ ] Required models imported
- [ ] JournalEntryAdmin class created
- [ ] list_display configured
- [ ] list_filter configured
- [ ] search_fields configured
- [ ] readonly_fields defined
- [ ] fieldsets organized
- [ ] date_hierarchy added
- [ ] ordering set
- [ ] get_queryset optimized
- [ ] Admin registered with decorator

---

## Task 82: Add Admin Inline Lines

### Overview
Add inline editing for JournalEntryLine items within the JournalEntry admin interface. This allows users to view, create, edit, and delete entry lines directly from the entry detail page without navigating to separate pages, providing a seamless editing experience for double-entry bookkeeping.

### Dependencies
- Task 81: Create JournalEntry Admin

### Instructions

1. **Open admin.py file**
   - Continue in `apps/accounting/admin.py`
   - Prepare to add inline class

2. **Create JournalEntryLineInline class**
   - Inherit from admin.TabularInline
   - Link to JournalEntryLine model
   - Add class docstring

3. **Set model attribute**
   - Set to JournalEntryLine model
   - Links inline to line item model

4. **Set extra attribute**
   - Number of empty forms shown
   - Recommended: 3
   - Allows adding multiple lines without page reload

5. **Define fields attribute**
   - List fields to display in inline table
   - Include: account, description, debit, credit
   - Ordered for logical data entry

6. **Define autocomplete_fields attribute**
   - Add account field for autocomplete lookup
   - Improves UX for large account lists
   - Requires account admin with search_fields

7. **Add can_delete attribute**
   - Set to True (default)
   - Allows deleting lines
   - Only for DRAFT entries (handle in permissions)

8. **Add show_change_link attribute**
   - Set to False
   - Lines edited inline, no separate page needed

9. **Define get_readonly_fields method**
   - Make fields readonly for POSTED entries
   - Allow editing only for DRAFT status
   - Prevent modification of posted entries

10. **Define has_add_permission method**
    - Override to prevent adding lines to POSTED entries
    - Check parent entry status
    - Return False if entry posted

11. **Define has_delete_permission method**
    - Override to prevent deleting lines from POSTED entries
    - Check parent entry status
    - Return False if entry posted

12. **Update JournalEntryAdmin class**
    - Add inlines attribute
    - Include JournalEntryLineInline
    - Inline appears in detail view

### JournalEntryLineInline Structure

```
┌─────────────────────────────────────────────────┐
│      JournalEntryLineInline Configuration       │
├─────────────────────────────────────────────────┤
│ Model: JournalEntryLine                         │
│ Type: TabularInline                             │
│                                                 │
│ Display Fields:                                 │
│  • account (autocomplete)                       │
│  • description                                  │
│  • debit                                        │
│  • credit                                       │
│                                                 │
│ Behavior:                                       │
│  • extra = 3 (empty forms)                      │
│  • can_delete = True (for DRAFT)                │
│                                                 │
│ Permissions:                                    │
│  • Readonly if entry POSTED                     │
│  • No add/delete if POSTED                      │
└─────────────────────────────────────────────────┘
```

### Inline Display Layout

```
Change Journal Entry: JE-2025-1250
══════════════════════════════════

[Entry fields above...]

Entry Lines
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Account                       │ Description          │ Debit      │ Credit     │ │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 5010 - Salary Expense         │ December salary      │ 150,000.00 │ 0.00       │🗑│
│ 2110 - Salaries Payable       │ December salary      │ 0.00       │ 150,000.00 │🗑│
├──────────────────────────────────────────────────────────────────────────────────┤
│ [Search account...] ▼         │ [Description...]     │ [0.00]     │ [0.00]     │  │
│ [Search account...] ▼         │ [Description...]     │ [0.00]     │ [0.00]     │  │
│ [Search account...] ▼         │ [Description...]     │ [0.00]     │ [0.00]     │  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                                    Total: 150,000.00   150,000.00

[Metadata fields below...]

[Save] [Save and continue editing] [Save and add another] [Delete]
```

### TabularInline vs StackedInline

| Feature | TabularInline | StackedInline |
|---------|--------------|---------------|
| Layout | Table rows | Stacked fields |
| Best for | Multiple similar fields | Few fields with details |
| Space efficiency | High | Low |
| Readability | Good for many lines | Better for few lines |
| **Choice** | ✅ Recommended | Not for this use case |

### Account Autocomplete

```
Entry Lines
┌────────────────────────────────────────┐
│ Account: [5010]                        │
│          ▼                             │
│ ┌────────────────────────────────────┐ │
│ │ 5010 - Salary Expense              │ │
│ │ 5020 - EPF Expense                 │ │
│ │ 5025 - ETF Expense                 │ │
│ │ 5030 - Utility Expense             │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

Requires ChartOfAccounts admin with:
  search_fields = ['code', 'name']
```

### Permission Logic by Status

| Entry Status | Can Add Lines | Can Edit Lines | Can Delete Lines |
|-------------|--------------|---------------|-----------------|
| DRAFT | Yes | Yes | Yes |
| PENDING_APPROVAL | No | No | No |
| APPROVED | No | No | No |
| POSTED | No | No | No |
| VOID | No | No | No |

### Readonly Fields Implementation

```python
def get_readonly_fields(self, request, obj=None):
    """
    Make all fields readonly if parent entry is posted.
    """
    if obj and obj.entry.status in ['POSTED', 'VOID']:
        return ['account', 'description', 'debit', 'credit']
    return []
```

### Add Permission Logic

```python
def has_add_permission(self, request, obj=None):
    """
    Prevent adding lines to posted entries.
    """
    if obj and obj.status in ['POSTED', 'VOID']:
        return False
    return super().has_add_permission(request, obj)
```

### Delete Permission Logic

```python
def has_delete_permission(self, request, obj=None):
    """
    Prevent deleting lines from posted entries.
    """
    if obj and obj.entry.status in ['POSTED', 'VOID']:
        return False
    return super().has_delete_permission(request, obj)
```

### Inline Validation

```
User attempts to save entry with unbalanced lines:
═══════════════════════════════════════════════

Line 1: DR Salary Expense       150,000.00
Line 2: CR Salaries Payable     100,000.00 ← Unbalanced!

Result: ❌ Validation Error
"Entry lines must balance. Debit: 150,000.00, Credit: 100,000.00"

Action: Fix credits to match debits before saving
```

### User Experience Flow

```
1. Open Entry Detail
   └─> View existing lines in table

2. Edit Existing Line
   ├─> Click in field
   ├─> Modify value
   └─> Changes highlighted

3. Add New Line
   ├─> Use empty row at bottom
   ├─> Select account (autocomplete)
   ├─> Enter description
   ├─> Enter debit or credit
   └─> More empty rows appear

4. Delete Line
   ├─> Click trash icon (🗑)
   └─> Line marked for deletion

5. Save Entry
   ├─> Validate balance
   ├─> Save all lines atomically
   └─> Show success message
```

### Sri Lanka Context Example

```
Creating Entry: December EPF/ETF Accrual
════════════════════════════════════════

Entry Lines
┌──────────────────────────────────────────────────────────────────┐
│ Account                   │ Description      │ Debit    │ Credit │
├──────────────────────────────────────────────────────────────────┤
│ 5020 - EPF Expense        │ December EPF     │ 12,000   │ 0      │
│ 5025 - ETF Expense        │ December ETF     │ 3,000    │ 0      │
│ 2120 - EPF Payable        │ December EPF     │ 0        │ 12,000 │
│ 2125 - ETF Payable        │ December ETF     │ 0        │ 3,000  │
├──────────────────────────────────────────────────────────────────┤
│ [Empty]                   │                  │          │        │
└──────────────────────────────────────────────────────────────────┘
                                        Total: 15,000.00   15,000.00 ✓
```

### Expected Outcome
- Functional inline editing for entry lines
- Tabular layout for efficient data entry
- Account autocomplete for easy selection
- Proper permissions based on entry status
- Validation feedback for unbalanced entries

### Verification Checklist
- [ ] JournalEntryLineInline class created
- [ ] model attribute set
- [ ] extra attribute configured
- [ ] fields list defined
- [ ] autocomplete_fields added for account
- [ ] can_delete set appropriately
- [ ] get_readonly_fields implemented
- [ ] has_add_permission overridden
- [ ] has_delete_permission overridden
- [ ] inlines added to JournalEntryAdmin

---

## Task 83: Add Admin List Display

### Overview
Enhance the JournalEntry admin list display with custom methods to show calculated fields, status badges, and formatted values. This provides accounting staff with rich information at a glance, improving the usability and information density of the admin list view.

### Dependencies
- Task 82: Add Admin Inline Lines

### Instructions

1. **Open admin.py file**
   - Continue in `apps/accounting/admin.py`
   - Locate JournalEntryAdmin class

2. **Add balance_status display method**
   - Create method that checks if entry balanced
   - Return colored indicator (✓ Balanced / ✗ Unbalanced)
   - Use format_html for colored output
   - Add short_description for column header

3. **Add status_badge display method**
   - Create method that displays status with color coding
   - DRAFT: Gray badge
   - POSTED: Green badge
   - VOID: Red badge
   - PENDING_APPROVAL: Yellow badge
   - Use format_html for styled badges
   - Add short_description = "Status"

4. **Add line_count display method**
   - Create method that counts entry lines
   - Display as "X lines"
   - Optimize with annotate in get_queryset
   - Add short_description = "Lines"

5. **Add formatted_total_debit method**
   - Create method that formats debit with currency
   - Use proper number formatting (commas)
   - Display as "LKR X,XXX.XX"
   - Add short_description = "Total Debit"

6. **Add formatted_total_credit method**
   - Create method that formats credit with currency
   - Use proper number formatting
   - Display as "LKR X,XXX.XX"
   - Add short_description = "Total Credit"

7. **Add entry_type_badge display method**
   - Create method with color-coded type badges
   - Different colors for MANUAL, ADJUSTING, AUTO, REVERSING
   - Use format_html for styling
   - Add short_description = "Type"

8. **Update list_display attribute**
   - Replace plain fields with custom methods
   - Include: entry_number, entry_date
   - Add: entry_type_badge, status_badge
   - Add: formatted_total_debit, formatted_total_credit
   - Add: balance_status, line_count
   - Add: created_by, created_at

9. **Add admin_order_field to methods**
   - Add sorting capability to custom methods
   - balance_status orders by total_debit
   - line_count orders by annotated count
   - Formatted fields order by original field

10. **Update get_queryset for annotations**
    - Add Count annotation for line_count
    - Optimizes line count display
    - Reduces queries from N+1 to 1

### Custom Display Methods

```
┌─────────────────────────────────────────────────┐
│       Custom Admin Display Methods              │
├─────────────────────────────────────────────────┤
│ Status & Badges:                                │
│  • status_badge() - Colored status              │
│  • entry_type_badge() - Colored type            │
│  • balance_status() - Balance indicator         │
│                                                 │
│ Formatted Values:                               │
│  • formatted_total_debit() - Currency format    │
│  • formatted_total_credit() - Currency format   │
│                                                 │
│ Calculated Fields:                              │
│  • line_count() - Number of lines               │
└─────────────────────────────────────────────────┘
```

### Enhanced List Display

```
Journal Entries
═══════════════════════════════════════════════════════════════════════════════════════════════

Entry Number  │ Date       │ Type          │ Status         │ Debit           │ Credit          │ Balance │ Lines │ Created By
══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
JE-2025-1250  │ 2025-12-31 │ ⚙ ADJUSTING  │ ✓ POSTED       │ LKR 150,000.00  │ LKR 150,000.00  │ ✓       │ 2     │ admin
JE-2025-1249  │ 2025-12-30 │ ✎ MANUAL     │ ✓ POSTED       │ LKR  75,000.00  │ LKR  75,000.00  │ ✓       │ 4     │ john
JE-2025-1248  │ 2025-12-29 │ ⚡ AUTO       │ ✓ POSTED       │ LKR  50,000.00  │ LKR  50,000.00  │ ✓       │ 3     │ system
JE-2025-1247  │ 2025-12-28 │ ✎ MANUAL     │ 📝 DRAFT        │ LKR  25,000.00  │ LKR  20,000.00  │ ✗       │ 2     │ jane
JE-2025-1246  │ 2025-12-27 │ ⟲ REVERSING  │ ✓ POSTED       │ LKR 150,000.00  │ LKR 150,000.00  │ ✓       │ 2     │ admin
```

### Status Badge Implementation

```python
from django.utils.html import format_html

def status_badge(self, obj):
    """Display status as colored badge."""
    colors = {
        'DRAFT': '#6c757d',           # Gray
        'POSTED': '#28a745',          # Green
        'VOID': '#dc3545',            # Red
        'PENDING_APPROVAL': '#ffc107', # Yellow
        'APPROVED': '#17a2b8',        # Cyan
    }
    
    icons = {
        'DRAFT': '📝',
        'POSTED': '✓',
        'VOID': '✗',
        'PENDING_APPROVAL': '⏳',
        'APPROVED': '✓',
    }
    
    color = colors.get(obj.status, '#000000')
    icon = icons.get(obj.status, '')
    
    return format_html(
        '<span style="color: {}; font-weight: bold;">{} {}</span>',
        color, icon, obj.get_status_display()
    )

status_badge.short_description = 'Status'
status_badge.admin_order_field = 'status'
```

### Entry Type Badge Implementation

```python
def entry_type_badge(self, obj):
    """Display entry type as colored badge."""
    colors = {
        'MANUAL': '#007bff',      # Blue
        'ADJUSTING': '#6f42c1',   # Purple
        'AUTO': '#fd7e14',        # Orange
        'REVERSING': '#20c997',   # Teal
    }
    
    icons = {
        'MANUAL': '✎',
        'ADJUSTING': '⚙',
        'AUTO': '⚡',
        'REVERSING': '⟲',
    }
    
    color = colors.get(obj.entry_type, '#000000')
    icon = icons.get(obj.entry_type, '')
    
    return format_html(
        '<span style="color: {};">{} {}</span>',
        color, icon, obj.get_entry_type_display()
    )

entry_type_badge.short_description = 'Type'
entry_type_badge.admin_order_field = 'entry_type'
```

### Balance Status Implementation

```python
def balance_status(self, obj):
    """Display whether entry is balanced."""
    if obj.total_debit == obj.total_credit:
        return format_html(
            '<span style="color: green; font-weight: bold;">✓</span>'
        )
    else:
        return format_html(
            '<span style="color: red; font-weight: bold;">✗</span>'
        )

balance_status.short_description = 'Balanced'
balance_status.admin_order_field = 'total_debit'
```

### Formatted Currency Implementation

```python
def formatted_total_debit(self, obj):
    """Display debit with currency formatting."""
    return format_html(
        'LKR {:,.2f}',
        obj.total_debit
    )

formatted_total_debit.short_description = 'Total Debit'
formatted_total_debit.admin_order_field = 'total_debit'


def formatted_total_credit(self, obj):
    """Display credit with currency formatting."""
    return format_html(
        'LKR {:,.2f}',
        obj.total_credit
    )

formatted_total_credit.short_description = 'Total Credit'
formatted_total_credit.admin_order_field = 'total_credit'
```

### Line Count with Annotation

```python
def get_queryset(self, request):
    """Optimize queryset with annotations."""
    queryset = super().get_queryset(request)
    return queryset.select_related(
        'created_by',
        'posted_by',
    ).prefetch_related(
        'lines'
    ).annotate(
        line_count=Count('lines')
    )


def line_count(self, obj):
    """Display number of entry lines."""
    return f"{obj.line_count} lines"

line_count.short_description = 'Lines'
line_count.admin_order_field = 'line_count'
```

### Color Coding Reference

| Status | Color | Hex Code | Meaning |
|--------|-------|----------|---------|
| DRAFT | Gray | #6c757d | In progress |
| POSTED | Green | #28a745 | Complete |
| VOID | Red | #dc3545 | Cancelled |
| PENDING_APPROVAL | Yellow | #ffc107 | Awaiting review |
| APPROVED | Cyan | #17a2b8 | Ready to post |

| Entry Type | Color | Hex Code | Icon |
|-----------|-------|----------|------|
| MANUAL | Blue | #007bff | ✎ |
| ADJUSTING | Purple | #6f42c1 | ⚙ |
| AUTO | Orange | #fd7e14 | ⚡ |
| REVERSING | Teal | #20c997 | ⟲ |

### Updated list_display

```python
list_display = (
    'entry_number',
    'entry_date',
    'entry_type_badge',
    'status_badge',
    'formatted_total_debit',
    'formatted_total_credit',
    'balance_status',
    'line_count',
    'created_by',
    'created_at',
)
```

### Expected Outcome
- Rich, informative list display
- Color-coded status and type indicators
- Formatted currency values
- Balance validation at a glance
- Line count without extra queries
- Sortable custom columns

### Verification Checklist
- [ ] status_badge method created
- [ ] entry_type_badge method created
- [ ] balance_status method created
- [ ] formatted_total_debit method created
- [ ] formatted_total_credit method created
- [ ] line_count method created
- [ ] All methods use format_html
- [ ] short_description added to all
- [ ] admin_order_field added where appropriate
- [ ] get_queryset includes annotations
- [ ] list_display updated with custom methods

---

## Task 84: Add Admin Actions

### Overview
Add bulk admin actions for common journal entry operations including posting multiple entries, voiding entries, and approving pending entries. These actions allow accounting staff to process multiple entries efficiently through the admin interface with proper validation and feedback.

### Dependencies
- Task 83: Add Admin List Display

### Instructions

1. **Open admin.py file**
   - Continue in `apps/accounting/admin.py`
   - Locate JournalEntryAdmin class

2. **Import messages framework**
   - Import messages from django.contrib
   - Used for user feedback after actions

3. **Create post_selected action**
   - Add method with signature: (modeladmin, request, queryset)
   - Filter queryset for DRAFT or APPROVED entries
   - Loop through entries and call post() method
   - Count successful posts
   - Display success message with count
   - Handle exceptions with error messages
   - Add short_description = "Post selected entries"

4. **Create void_selected action**
   - Add method with signature: (modeladmin, request, queryset)
   - Filter queryset for POSTED entries only
   - Loop through entries and call void() method
   - Create reversal entries
   - Count successful voids
   - Display success message with count
   - Handle exceptions with error messages
   - Add short_description = "Void selected entries"

5. **Create approve_selected action**
   - Add method with signature: (modeladmin, request, queryset)
   - Filter queryset for PENDING_APPROVAL entries
   - Loop through entries and call approve() method
   - Check approval permissions
   - Count successful approvals
   - Display success message with count
   - Handle exceptions with error messages
   - Add short_description = "Approve selected entries"

6. **Add actions attribute to admin class**
   - Create actions list
   - Include: post_selected, void_selected, approve_selected
   - Actions appear in admin dropdown

7. **Add validation in each action**
   - Check appropriate entry status
   - Verify entries are balanced
   - Ensure user has permissions
   - Skip invalid entries with warning

8. **Add transaction handling**
   - Wrap each action in transaction.atomic()
   - Ensures all-or-nothing processing
   - Rollback on any error

9. **Add comprehensive error handling**
   - Try-except blocks for each entry
   - Collect errors for batch reporting
   - Continue processing valid entries
   - Report all errors at end

10. **Add user feedback messages**
    - Success message with count
    - Warning message for skipped entries
    - Error message for failures
    - Use appropriate message levels

### Admin Actions Structure

```
┌─────────────────────────────────────────────────┐
│           Admin Bulk Actions                    │
├─────────────────────────────────────────────────┤
│ Post Action:                                    │
│  • Filter: DRAFT or APPROVED entries            │
│  • Operation: Call entry.post()                 │
│  • Validation: Check balanced                   │
│                                                 │
│ Void Action:                                    │
│  • Filter: POSTED entries only                  │
│  • Operation: Call entry.void()                 │
│  • Result: Create reversal entries              │
│                                                 │
│ Approve Action:                                 │
│  • Filter: PENDING_APPROVAL entries             │
│  • Operation: Call entry.approve()              │
│  • Permission: Check approval rights            │
└─────────────────────────────────────────────────┘
```

### Admin Actions UI

```
Journal Entries
═══════════════════════════════════════════════════

[✓] Select all visible entries

Actions: [Post selected entries ▼] [Go]

[✓] JE-2025-1250 | 2025-12-31 | DRAFT
[✓] JE-2025-1249 | 2025-12-30 | DRAFT
[✓] JE-2025-1248 | 2025-12-29 | DRAFT
[ ] JE-2025-1247 | 2025-12-28 | POSTED  ← Not selectable for post
```

### Post Selected Action Implementation

```python
from django.db import transaction
from django.contrib import messages

@admin.action(description='Post selected entries')
def post_selected(self, request, queryset):
    """
    Post multiple draft or approved entries at once.
    """
    # Filter for postable entries
    postable = queryset.filter(
        status__in=['DRAFT', 'APPROVED']
    )
    
    success_count = 0
    error_count = 0
    errors = []
    
    for entry in postable:
        try:
            with transaction.atomic():
                entry.post(posted_by=request.user)
                success_count += 1
        except Exception as e:
            error_count += 1
            errors.append(f"{entry.entry_number}: {str(e)}")
    
    # User feedback
    if success_count > 0:
        self.message_user(
            request,
            f"Successfully posted {success_count} entries.",
            messages.SUCCESS
        )
    
    if error_count > 0:
        self.message_user(
            request,
            f"Failed to post {error_count} entries: {', '.join(errors)}",
            messages.ERROR
        )
    
    if queryset.count() > postable.count():
        skipped = queryset.count() - postable.count()
        self.message_user(
            request,
            f"Skipped {skipped} entries (already posted or void).",
            messages.WARNING
        )
```

### Void Selected Action Implementation

```python
@admin.action(description='Void selected entries')
def void_selected(self, request, queryset):
    """
    Void multiple posted entries, creating reversals.
    """
    # Filter for voidable entries
    voidable = queryset.filter(status='POSTED')
    
    success_count = 0
    error_count = 0
    errors = []
    
    for entry in voidable:
        try:
            with transaction.atomic():
                entry.void(voided_by=request.user)
                success_count += 1
        except Exception as e:
            error_count += 1
            errors.append(f"{entry.entry_number}: {str(e)}")
    
    # User feedback
    if success_count > 0:
        self.message_user(
            request,
            f"Successfully voided {success_count} entries.",
            messages.SUCCESS
        )
    
    if error_count > 0:
        self.message_user(
            request,
            f"Failed to void {error_count} entries: {', '.join(errors)}",
            messages.ERROR
        )
    
    if queryset.count() > voidable.count():
        skipped = queryset.count() - voidable.count()
        self.message_user(
            request,
            f"Skipped {skipped} entries (not posted).",
            messages.WARNING
        )
```

### Approve Selected Action Implementation

```python
@admin.action(description='Approve selected entries')
def approve_selected(self, request, queryset):
    """
    Approve multiple pending entries.
    """
    # Filter for approvable entries
    approvable = queryset.filter(status='PENDING_APPROVAL')
    
    success_count = 0
    error_count = 0
    errors = []
    
    for entry in approvable:
        try:
            with transaction.atomic():
                entry.approve(approved_by=request.user)
                success_count += 1
        except Exception as e:
            error_count += 1
            errors.append(f"{entry.entry_number}: {str(e)}")
    
    # User feedback
    if success_count > 0:
        self.message_user(
            request,
            f"Successfully approved {success_count} entries.",
            messages.SUCCESS
        )
    
    if error_count > 0:
        self.message_user(
            request,
            f"Failed to approve {error_count} entries: {', '.join(errors)}",
            messages.ERROR
        )
    
    if queryset.count() > approvable.count():
        skipped = queryset.count() - approvable.count()
        self.message_user(
            request,
            f"Skipped {skipped} entries (not pending approval).",
            messages.WARNING
        )
```

### Action Workflow Example

```
User Selects 10 Entries:
═══════════════════════
├─ 6 DRAFT entries
├─ 2 POSTED entries
└─ 2 VOID entries

User Chooses: "Post selected entries"
════════════════════════════════════

Processing:
├─ Process 6 DRAFT entries
│  ├─ 5 successfully posted ✓
│  └─ 1 failed (unbalanced) ✗
├─ Skip 2 POSTED entries (already posted)
└─ Skip 2 VOID entries (cannot post voided)

Result Messages:
✓ Success: "Successfully posted 5 entries."
✗ Error: "Failed to post 1 entry: JE-2025-1250: Entry not balanced."
⚠ Warning: "Skipped 4 entries (already posted or void)."
```

### Message Levels

| Level | Usage | Color | Icon |
|-------|-------|-------|------|
| SUCCESS | Operation completed | Green | ✓ |
| WARNING | Entries skipped | Yellow | ⚠ |
| ERROR | Operation failed | Red | ✗ |
| INFO | General information | Blue | ℹ |

### Sri Lanka Context Example

```
Month-End Closing Workflow:
═══════════════════════════

1. Create Adjusting Entries
   ├─ EPF accrual: JE-2025-1250 (DRAFT)
   ├─ ETF accrual: JE-2025-1251 (DRAFT)
   └─ Salary accrual: JE-2025-1252 (DRAFT)

2. Review and Select All
   └─ Check boxes for all 3 entries

3. Bulk Post Action
   ├─ Select "Post selected entries"
   ├─ Click "Go"
   └─ Result: All 3 entries posted ✓

4. Schedule Reversals (if needed)
   └─ Use reversing service for January 1

Success Message:
"Successfully posted 3 entries."
```

### Permission Checks

| Action | Required Permission | Check Location |
|--------|-------------------|----------------|
| post_selected | accounting.post_journalentry | In action method |
| void_selected | accounting.void_journalentry | In action method |
| approve_selected | accounting.approve_journalentry | In action method |

### Expected Outcome
- Three functional bulk actions
- Proper status filtering
- Transaction safety
- Comprehensive error handling
- Clear user feedback
- Efficient batch processing

### Verification Checklist
- [ ] messages framework imported
- [ ] post_selected action created
- [ ] void_selected action created
- [ ] approve_selected action created
- [ ] Each action filters by appropriate status
- [ ] Transaction handling implemented
- [ ] Error handling added
- [ ] Success/error/warning messages configured
- [ ] actions attribute added to admin class
- [ ] short_description added to each action

---

## Task 85: Create JournalEntrySerializer

### Overview
Create the DRF serializer for JournalEntry that handles serialization and deserialization of journal entry data including nested line items. This serializer will support full CRUD operations through the REST API with proper validation and nested writes for atomic entry creation.

### Dependencies
- Task 84: Add Admin Actions
- Django REST Framework installed
- JournalEntry model complete

### Instructions

1. **Create serializers directory**
   - Navigate to `apps/accounting/`
   - Create `serializers/` subdirectory
   - Create `__init__.py` in serializers

2. **Create journal_entry.py serializer file**
   - Create file at `apps/accounting/serializers/journal_entry.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import serializers from rest_framework
   - Import JournalEntry model
   - Import JournalEntryLine model (for nested serializer)
   - Import User model for user fields

4. **Add module docstring**
   - Document serializer purpose
   - List included fields
   - Note nested line items handling

5. **Create JournalEntrySerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring

6. **Add lines field for nesting**
   - Use JournalEntryLineSerializer(many=True)
   - Will be defined in next task
   - Handles nested line creation/update

7. **Add read-only computed fields**
   - created_by_username: SerializerMethodField
   - posted_by_username: SerializerMethodField
   - is_balanced: SerializerMethodField
   - can_post: SerializerMethodField
   - can_void: SerializerMethodField

8. **Define Meta class**
   - Set model = JournalEntry
   - Define fields list (all fields including nested)
   - Set read_only_fields (auto-generated, timestamps)

9. **Add get_created_by_username method**
   - Return username of created_by user
   - Handle None case

10. **Add get_posted_by_username method**
    - Return username of posted_by user
    - Handle None case

11. **Add get_is_balanced method**
    - Check if total_debit equals total_credit
    - Return boolean

12. **Add get_can_post method**
    - Check if entry can be posted
    - Verify status is DRAFT or APPROVED
    - Verify entry is balanced
    - Return boolean

13. **Add get_can_void method**
    - Check if entry can be voided
    - Verify status is POSTED
    - Return boolean

14. **Add create method override**
    - Handle nested line creation
    - Extract lines_data from validated_data
    - Create entry instance
    - Create line instances
    - Validate balance
    - Return entry with lines

15. **Add update method override**
    - Handle nested line updates
    - Only allow for DRAFT entries
    - Delete existing lines
    - Create new lines from validated_data
    - Validate balance
    - Return updated entry

16. **Add validate method**
    - Validate entry rules
    - Check balance
    - Validate at least 2 lines
    - Validate no zero amounts
    - Return validated data

17. **Update serializers/__init__.py**
    - Import JournalEntrySerializer
    - Add to __all__ list

### JournalEntrySerializer Structure

```
┌─────────────────────────────────────────────────┐
│       JournalEntrySerializer                    │
├─────────────────────────────────────────────────┤
│ Model: JournalEntry                             │
│                                                 │
│ Core Fields:                                    │
│  • id, entry_number, entry_date                 │
│  • entry_type, status, source                   │
│  • reference, description                       │
│  • total_debit, total_credit                    │
│                                                 │
│ Nested:                                         │
│  • lines (JournalEntryLineSerializer)           │
│                                                 │
│ Computed Fields:                                │
│  • created_by_username                          │
│  • posted_by_username                           │
│  • is_balanced                                  │
│  • can_post, can_void                           │
│                                                 │
│ Methods:                                        │
│  • create() - Handle nested writes              │
│  • update() - Handle nested updates             │
│  • validate() - Entry validation                │
└─────────────────────────────────────────────────┘
```

### Serializer Fields Configuration

```python
class JournalEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for JournalEntry with nested line items.
    """
    lines = JournalEntryLineSerializer(many=True)
    
    # Computed fields
    created_by_username = serializers.SerializerMethodField()
    posted_by_username = serializers.SerializerMethodField()
    is_balanced = serializers.SerializerMethodField()
    can_post = serializers.SerializerMethodField()
    can_void = serializers.SerializerMethodField()
    
    class Meta:
        model = JournalEntry
        fields = [
            'id',
            'entry_number',
            'entry_date',
            'entry_type',
            'status',
            'source',
            'reference',
            'description',
            'total_debit',
            'total_credit',
            'lines',
            'created_by',
            'created_by_username',
            'created_at',
            'posted_by',
            'posted_by_username',
            'posted_at',
            'reversal_of',
            'is_balanced',
            'can_post',
            'can_void',
        ]
        read_only_fields = [
            'id',
            'entry_number',
            'total_debit',
            'total_credit',
            'created_at',
            'posted_at',
        ]
```

### Computed Field Methods

```python
def get_created_by_username(self, obj):
    """Return username of creator."""
    return obj.created_by.username if obj.created_by else None


def get_posted_by_username(self, obj):
    """Return username of poster."""
    return obj.posted_by.username if obj.posted_by else None


def get_is_balanced(self, obj):
    """Check if entry is balanced."""
    return obj.total_debit == obj.total_credit


def get_can_post(self, obj):
    """Check if entry can be posted."""
    return (
        obj.status in ['DRAFT', 'APPROVED'] and
        obj.total_debit == obj.total_credit
    )


def get_can_void(self, obj):
    """Check if entry can be voided."""
    return obj.status == 'POSTED'
```

### Create Method with Nested Writes

```python
def create(self, validated_data):
    """
    Create entry with nested line items.
    """
    lines_data = validated_data.pop('lines')
    entry = JournalEntry.objects.create(**validated_data)
    
    for line_data in lines_data:
        JournalEntryLine.objects.create(
            entry=entry,
            **line_data
        )
    
    # Recalculate totals
    entry.calculate_totals()
    entry.save()
    
    return entry
```

### Update Method with Nested Updates

```python
def update(self, instance, validated_data):
    """
    Update entry and replace all lines.
    Only allowed for DRAFT entries.
    """
    if instance.status != 'DRAFT':
        raise serializers.ValidationError(
            "Only DRAFT entries can be updated"
        )
    
    lines_data = validated_data.pop('lines', None)
    
    # Update entry fields
    for attr, value in validated_data.items():
        setattr(instance, attr, value)
    
    # Replace lines if provided
    if lines_data is not None:
        instance.lines.all().delete()
        for line_data in lines_data:
            JournalEntryLine.objects.create(
                entry=instance,
                **line_data
            )
        
        # Recalculate totals
        instance.calculate_totals()
    
    instance.save()
    return instance
```

### Validation Method

```python
def validate(self, data):
    """
    Validate entry rules.
    """
    lines = data.get('lines', [])
    
    # Must have at least 2 lines
    if len(lines) < 2:
        raise serializers.ValidationError(
            "Entry must have at least 2 lines"
        )
    
    # Calculate totals
    total_debit = sum(
        line.get('debit', 0) for line in lines
    )
    total_credit = sum(
        line.get('credit', 0) for line in lines
    )
    
    # Must be balanced
    if total_debit != total_credit:
        raise serializers.ValidationError(
            f"Entry must be balanced. "
            f"Debit: {total_debit}, Credit: {total_credit}"
        )
    
    # No zero amounts
    for line in lines:
        if line.get('debit', 0) == 0 and line.get('credit', 0) == 0:
            raise serializers.ValidationError(
                "Each line must have either debit or credit"
            )
    
    return data
```

### API Request/Response Example

**Create Entry Request:**
```json
{
  "entry_date": "2025-12-31",
  "entry_type": "ADJUSTING",
  "source": "adjusting_entries",
  "description": "December salary accrual",
  "reference": "ACR-2025-12-001",
  "lines": [
    {
      "account": 12,
      "description": "December salary",
      "debit": "150000.00",
      "credit": "0.00"
    },
    {
      "account": 45,
      "description": "December salary",
      "debit": "0.00",
      "credit": "150000.00"
    }
  ]
}
```

**Create Entry Response:**
```json
{
  "id": 1234,
  "entry_number": "JE-2025-1250",
  "entry_date": "2025-12-31",
  "entry_type": "ADJUSTING",
  "status": "DRAFT",
  "source": "adjusting_entries",
  "reference": "ACR-2025-12-001",
  "description": "December salary accrual",
  "total_debit": "150000.00",
  "total_credit": "150000.00",
  "lines": [
    {
      "id": 5678,
      "account": 12,
      "account_name": "Salary Expense",
      "description": "December salary",
      "debit": "150000.00",
      "credit": "0.00"
    },
    {
      "id": 5679,
      "account": 45,
      "account_name": "Salaries Payable",
      "description": "December salary",
      "debit": "0.00",
      "credit": "150000.00"
    }
  ],
  "created_by": 1,
  "created_by_username": "admin",
  "created_at": "2025-12-31T14:30:00Z",
  "posted_by": null,
  "posted_by_username": null,
  "posted_at": null,
  "reversal_of": null,
  "is_balanced": true,
  "can_post": true,
  "can_void": false
}
```

### Expected Outcome
- Functional DRF serializer for journal entries
- Nested line item handling
- Computed fields for API clients
- Create/update with validation
- Balanced entry enforcement

### Verification Checklist
- [ ] serializers/ directory created
- [ ] journal_entry.py file created
- [ ] Required modules imported
- [ ] JournalEntrySerializer class defined
- [ ] lines nested field added
- [ ] Computed fields added
- [ ] Meta class configured
- [ ] get_ methods for computed fields
- [ ] create method with nested writes
- [ ] update method with nested updates
- [ ] validate method implemented
- [ ] Serializer imported in __init__.py

---

## Task 86: Create JournalEntryLineSerializer

### Overview
Create the DRF serializer for JournalEntryLine that handles serialization of individual journal entry line items. This serializer provides account information with readable names and validates line-level rules including the mutual exclusivity of debit and credit amounts.

### Dependencies
- Task 85: Create JournalEntrySerializer

### Instructions

1. **Create journal_line.py serializer file**
   - Create file at `apps/accounting/serializers/journal_line.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import JournalEntryLine model
   - Import ChartOfAccounts model for account lookup

3. **Add module docstring**
   - Document serializer purpose
   - Note use as nested serializer
   - Explain debit/credit validation

4. **Create JournalEntryLineSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring

5. **Add account_code field**
   - SerializerMethodField, read-only
   - Returns account code for display
   - Useful for API clients

6. **Add account_name field**
   - SerializerMethodField, read-only
   - Returns account name for display
   - Useful for API clients

7. **Define Meta class**
   - Set model = JournalEntryLine
   - Define fields list
   - Set read_only_fields (id, timestamps)

8. **Add get_account_code method**
   - Return obj.account.code
   - Handle None case

9. **Add get_account_name method**
   - Return obj.account.name
   - Handle None case

10. **Add validate method**
    - Validate mutual exclusivity of debit/credit
    - Ensure only one has value
    - Both cannot be zero
    - Both cannot have values
    - Return validated data

11. **Add validate_debit method**
    - Ensure debit amount >= 0
    - Raise ValidationError if negative

12. **Add validate_credit method**
    - Ensure credit amount >= 0
    - Raise ValidationError if negative

13. **Update serializers/__init__.py**
    - Import JournalEntryLineSerializer
    - Add to __all__ list

14. **Update journal_entry.py**
    - Import JournalEntryLineSerializer
    - Reference in JournalEntrySerializer lines field

### JournalEntryLineSerializer Structure

```
┌─────────────────────────────────────────────────┐
│      JournalEntryLineSerializer                 │
├─────────────────────────────────────────────────┤
│ Model: JournalEntryLine                         │
│                                                 │
│ Core Fields:                                    │
│  • id                                           │
│  • account (FK, write)                          │
│  • description                                  │
│  • debit                                        │
│  • credit                                       │
│                                                 │
│ Computed Fields:                                │
│  • account_code (read-only)                     │
│  • account_name (read-only)                     │
│                                                 │
│ Validation:                                     │
│  • Debit/credit mutual exclusivity              │
│  • No negative amounts                          │
│  • At least one must be > 0                     │
└─────────────────────────────────────────────────┘
```

### Serializer Implementation

```python
from rest_framework import serializers
from apps.accounting.models import JournalEntryLine


class JournalEntryLineSerializer(serializers.ModelSerializer):
    """
    Serializer for journal entry line items.
    Used as nested serializer in JournalEntrySerializer.
    """
    account_code = serializers.SerializerMethodField()
    account_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JournalEntryLine
        fields = [
            'id',
            'account',
            'account_code',
            'account_name',
            'description',
            'debit',
            'credit',
        ]
        read_only_fields = ['id']
    
    def get_account_code(self, obj):
        """Return account code."""
        return obj.account.code if obj.account else None
    
    def get_account_name(self, obj):
        """Return account name."""
        return obj.account.name if obj.account else None
    
    def validate(self, data):
        """
        Validate debit/credit mutual exclusivity.
        """
        debit = data.get('debit', 0)
        credit = data.get('credit', 0)
        
        # Both zero
        if debit == 0 and credit == 0:
            raise serializers.ValidationError(
                "Line must have either debit or credit amount"
            )
        
        # Both non-zero
        if debit > 0 and credit > 0:
            raise serializers.ValidationError(
                "Line cannot have both debit and credit"
            )
        
        return data
    
    def validate_debit(self, value):
        """Ensure debit is non-negative."""
        if value < 0:
            raise serializers.ValidationError(
                "Debit amount cannot be negative"
            )
        return value
    
    def validate_credit(self, value):
        """Ensure credit is non-negative."""
        if value < 0:
            raise serializers.ValidationError(
                "Credit amount cannot be negative"
            )
        return value
```

### Line Validation Rules

| Rule | Validation | Error Message |
|------|-----------|---------------|
| Debit >= 0 | validate_debit | "Debit amount cannot be negative" |
| Credit >= 0 | validate_credit | "Credit amount cannot be negative" |
| Debit XOR Credit | validate | "Line cannot have both debit and credit" |
| At least one > 0 | validate | "Line must have either debit or credit amount" |

### Valid Line Examples

```json
Valid Line 1 (Debit):
{
  "account": 12,
  "description": "Salary expense",
  "debit": "150000.00",
  "credit": "0.00"
}

Valid Line 2 (Credit):
{
  "account": 45,
  "description": "Salary payable",
  "debit": "0.00",
  "credit": "150000.00"
}
```

### Invalid Line Examples

```json
Invalid - Both Zero:
{
  "account": 12,
  "description": "Invalid",
  "debit": "0.00",
  "credit": "0.00"
}
❌ Error: "Line must have either debit or credit amount"

Invalid - Both Non-Zero:
{
  "account": 12,
  "description": "Invalid",
  "debit": "100.00",
  "credit": "100.00"
}
❌ Error: "Line cannot have both debit and credit"

Invalid - Negative Debit:
{
  "account": 12,
  "description": "Invalid",
  "debit": "-100.00",
  "credit": "0.00"
}
❌ Error: "Debit amount cannot be negative"
```

### Serialized Line Response

```json
{
  "id": 5678,
  "account": 12,
  "account_code": "5010",
  "account_name": "Salary Expense",
  "description": "December salary accrual",
  "debit": "150000.00",
  "credit": "0.00"
}
```

### Expected Outcome
- Functional line item serializer
- Account details included
- Proper debit/credit validation
- Negative amount prevention
- Ready for nested use

### Verification Checklist
- [ ] journal_line.py file created
- [ ] Required modules imported
- [ ] JournalEntryLineSerializer class defined
- [ ] account_code field added
- [ ] account_name field added
- [ ] Meta class configured
- [ ] get_account_code method implemented
- [ ] get_account_name method implemented
- [ ] validate method with debit/credit rules
- [ ] validate_debit method added
- [ ] validate_credit method added
- [ ] Serializer imported in __init__.py
- [ ] Referenced in JournalEntrySerializer

---

## Task 87: Create JournalEntryViewSet

### Overview
Create the DRF ViewSet for JournalEntry that exposes CRUD operations and custom workflow actions through REST API endpoints. The ViewSet provides listing, filtering, creating, updating, and deleting journal entries with proper permissions and tenant filtering.

### Dependencies
- Task 86: Create JournalEntryLineSerializer
- Django REST Framework configured
- URL routing ready

### Instructions

1. **Create views directory**
   - Navigate to `apps/accounting/`
   - Create `views/` subdirectory if not exists
   - Create `__init__.py` in views

2. **Create journal_entry.py view file**
   - Create file at `apps/accounting/views/journal_entry.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import viewsets from rest_framework
   - Import permissions from rest_framework
   - Import filters from django_filters
   - Import JournalEntry model
   - Import JournalEntrySerializer
   - Import action decorator

4. **Add module docstring**
   - Document ViewSet purpose
   - List available endpoints
   - Note custom actions (next task)

5. **Create JournalEntryViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add class docstring

6. **Set queryset attribute**
   - Query all JournalEntry objects
   - Add select_related for optimization
   - Add prefetch_related for lines

7. **Set serializer_class attribute**
   - Set to JournalEntrySerializer

8. **Set permission_classes attribute**
   - Use IsAuthenticated
   - Add custom permissions if available

9. **Add filterset_fields attribute**
   - Filter by status
   - Filter by entry_type
   - Filter by source
   - Filter by entry_date range

10. **Add search_fields attribute**
    - Search by entry_number
    - Search by description
    - Search by reference

11. **Add ordering_fields attribute**
    - Allow ordering by entry_date
    - Allow ordering by entry_number
    - Allow ordering by created_at

12. **Add ordering attribute**
    - Default order by '-entry_date'
    - Secondary order by '-entry_number'

13. **Override get_queryset method**
    - Filter by current tenant
    - Apply user permissions
    - Return filtered queryset

14. **Override perform_create method**
    - Set created_by to request.user
    - Set tenant to current tenant
    - Call parent method

15. **Override perform_update method**
    - Only allow DRAFT entries
    - Validate status before update
    - Call parent method

16. **Override perform_destroy method**
    - Only allow DRAFT entries
    - Prevent deletion of posted entries
    - Call parent method

17. **Update views/__init__.py**
    - Import JournalEntryViewSet
    - Add to __all__ list

### JournalEntryViewSet Structure

```
┌─────────────────────────────────────────────────┐
│         JournalEntryViewSet                     │
├─────────────────────────────────────────────────┤
│ Base: ModelViewSet                              │
│                                                 │
│ Standard Actions:                               │
│  • list() - GET /entries/                       │
│  • create() - POST /entries/                    │
│  • retrieve() - GET /entries/{id}/              │
│  • update() - PUT /entries/{id}/                │
│  • partial_update() - PATCH /entries/{id}/      │
│  • destroy() - DELETE /entries/{id}/            │
│                                                 │
│ Filtering:                                      │
│  • By status, type, source                      │
│  • By date range                                │
│  • Search by number/description                 │
│                                                 │
│ Custom Actions (Next Task):                     │
│  • post() - POST /entries/{id}/post/            │
│  • void() - POST /entries/{id}/void/            │
│  • approve() - POST /entries/{id}/approve/      │
└─────────────────────────────────────────────────┘
```

### ViewSet Implementation

```python
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounting.models import JournalEntry
from apps.accounting.serializers import JournalEntrySerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for journal entry CRUD operations.
    
    Endpoints:
    - GET /api/v1/accounting/entries/ - List entries
    - POST /api/v1/accounting/entries/ - Create entry
    - GET /api/v1/accounting/entries/{id}/ - Retrieve entry
    - PUT /api/v1/accounting/entries/{id}/ - Update entry
    - PATCH /api/v1/accounting/entries/{id}/ - Partial update
    - DELETE /api/v1/accounting/entries/{id}/ - Delete entry
    """
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'entry_type', 'source']
    search_fields = ['entry_number', 'description', 'reference']
    ordering_fields = ['entry_date', 'entry_number', 'created_at']
    ordering = ['-entry_date', '-entry_number']
    
    def get_queryset(self):
        """
        Filter queryset by tenant and optimize queries.
        """
        queryset = super().get_queryset()
        
        # Filter by tenant
        tenant = getattr(self.request, 'tenant', None)
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        
        # Optimize queries
        queryset = queryset.select_related(
            'created_by',
            'posted_by',
            'reversal_of'
        ).prefetch_related(
            'lines',
            'lines__account'
        )
        
        return queryset
    
    def perform_create(self, serializer):
        """
        Set created_by and tenant on creation.
        """
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(
            created_by=self.request.user,
            tenant=tenant
        )
    
    def perform_update(self, serializer):
        """
        Only allow updates to DRAFT entries.
        """
        instance = self.get_object()
        if instance.status != 'DRAFT':
            raise PermissionDenied(
                "Only DRAFT entries can be updated"
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """
        Only allow deletion of DRAFT entries.
        """
        if instance.status != 'DRAFT':
            raise PermissionDenied(
                "Only DRAFT entries can be deleted"
            )
        instance.delete()
```

### API Endpoint Examples

**List Entries:**
```
GET /api/v1/accounting/entries/
GET /api/v1/accounting/entries/?status=DRAFT
GET /api/v1/accounting/entries/?entry_type=ADJUSTING
GET /api/v1/accounting/entries/?search=salary
GET /api/v1/accounting/entries/?ordering=-entry_date
```

**Create Entry:**
```
POST /api/v1/accounting/entries/
Content-Type: application/json

{
  "entry_date": "2025-12-31",
  "entry_type": "MANUAL",
  "description": "Manual adjustment",
  "lines": [...]
}
```

**Retrieve Entry:**
```
GET /api/v1/accounting/entries/1234/
```

**Update Entry:**
```
PUT /api/v1/accounting/entries/1234/
PATCH /api/v1/accounting/entries/1234/
```

**Delete Entry:**
```
DELETE /api/v1/accounting/entries/1234/
```

### Filter Examples

```
Filter by Status:
GET /entries/?status=POSTED

Filter by Type:
GET /entries/?entry_type=ADJUSTING

Filter by Source:
GET /entries/?source=adjusting_entries

Filter by Date Range (custom):
GET /entries/?date_from=2025-12-01&date_to=2025-12-31

Search:
GET /entries/?search=salary

Ordering:
GET /entries/?ordering=-created_at

Combined:
GET /entries/?status=POSTED&entry_type=MANUAL&ordering=-entry_date
```

### Response Example

```json
{
  "count": 245,
  "next": "http://api.example.com/entries/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1234,
      "entry_number": "JE-2025-1250",
      "entry_date": "2025-12-31",
      "entry_type": "ADJUSTING",
      "status": "POSTED",
      "source": "adjusting_entries",
      "reference": null,
      "description": "December salary accrual",
      "total_debit": "150000.00",
      "total_credit": "150000.00",
      "lines": [...],
      "created_by": 1,
      "created_by_username": "admin",
      "created_at": "2025-12-31T14:30:00Z",
      "is_balanced": true,
      "can_post": false,
      "can_void": true
    },
    ...
  ]
}
```

### Expected Outcome
- Functional REST API for journal entries
- Full CRUD operations
- Tenant filtering
- Search and filter capabilities
- Proper permissions
- Foundation for custom actions

### Verification Checklist
- [ ] views/ directory created
- [ ] journal_entry.py file created
- [ ] Required modules imported
- [ ] JournalEntryViewSet class defined
- [ ] queryset configured
- [ ] serializer_class set
- [ ] permission_classes configured
- [ ] Filter backends added
- [ ] filterset_fields defined
- [ ] search_fields defined
- [ ] ordering_fields and ordering set
- [ ] get_queryset overridden
- [ ] perform_create overridden
- [ ] perform_update overridden
- [ ] perform_destroy overridden
- [ ] ViewSet imported in __init__.py

---

## Task 88: Add Post Entry Endpoint

### Overview
Add the post custom action to JournalEntryViewSet that allows posting a draft or approved entry via a dedicated API endpoint. This action validates the entry, updates its status to POSTED, sets the posted timestamp and user, and returns the updated entry.

### Dependencies
- Task 87: Create JournalEntryViewSet

### Instructions

1. **Open journal_entry.py view file**
   - Navigate to `apps/accounting/views/journal_entry.py`
   - Locate JournalEntryViewSet class

2. **Import Response and status**
   - Import Response from rest_framework.response
   - Import status from rest_framework
   - Used for custom responses

3. **Add post action method**
   - Use @action decorator
   - Set detail=True (operates on single entry)
   - Set methods=['post']
   - Set url_path='post' (creates /entries/{id}/post/)

4. **Define method signature**
   - Accept self, request, pk=None
   - Get entry instance with self.get_object()

5. **Validate entry can be posted**
   - Check status is DRAFT or APPROVED
   - Check entry is balanced
   - Check entry has minimum 2 lines
   - Raise ValidationError if not valid

6. **Call entry.post() method**
   - Pass posted_by=request.user
   - Wrap in try-except for errors
   - Handle ValidationError with 400 response

7. **Return success response**
   - Serialize updated entry
   - Return with 200 OK status
   - Include success message

8. **Add error handling**
   - Catch ValidationError
   - Return 400 Bad Request
   - Include error message in response

9. **Add docstring**
   - Document endpoint purpose
   - List request method (POST)
   - Describe response format
   - Note error scenarios

### Post Action Implementation

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError


@action(detail=True, methods=['post'], url_path='post')
def post(self, request, pk=None):
    """
    Post a draft or approved journal entry.
    
    URL: POST /api/v1/accounting/entries/{id}/post/
    
    Validates entry and updates status to POSTED.
    Sets posted_at timestamp and posted_by user.
    
    Returns:
        200: Entry successfully posted
        400: Entry cannot be posted (validation error)
        404: Entry not found
    """
    entry = self.get_object()
    
    # Validate entry can be posted
    if entry.status not in ['DRAFT', 'APPROVED']:
        return Response(
            {
                'error': f'Cannot post entry with status {entry.status}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if entry.total_debit != entry.total_credit:
        return Response(
            {
                'error': 'Entry is not balanced'
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Post the entry
    try:
        entry.post(posted_by=request.user)
    except ValidationError as e:
        return Response(
            {
                'error': str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Return updated entry
    serializer = self.get_serializer(entry)
    return Response(
        {
            'message': 'Entry posted successfully',
            'entry': serializer.data
        },
        status=status.HTTP_200_OK
    )
```

### Post Action Flow

```
POST /api/v1/accounting/entries/1234/post/
═════════════════════════════════════════

1. Retrieve Entry
   └─> Get entry with ID 1234

2. Validate Status
   ├─> Check status is DRAFT or APPROVED
   └─> Return 400 if not

3. Validate Balance
   ├─> Check total_debit == total_credit
   └─> Return 400 if not balanced

4. Call entry.post()
   ├─> Update status to POSTED
   ├─> Set posted_at = now()
   ├─> Set posted_by = request.user
   └─> Save entry

5. Return Response
   └─> 200 OK with updated entry data
```

### Request Example

```
POST /api/v1/accounting/entries/1234/post/
Authorization: Bearer <token>
Content-Type: application/json
```

### Success Response (200 OK)

```json
{
  "message": "Entry posted successfully",
  "entry": {
    "id": 1234,
    "entry_number": "JE-2025-1250",
    "status": "POSTED",
    "posted_by": 1,
    "posted_by_username": "admin",
    "posted_at": "2025-12-31T15:00:00Z",
    "entry_date": "2025-12-31",
    "entry_type": "ADJUSTING",
    "total_debit": "150000.00",
    "total_credit": "150000.00",
    "lines": [...],
    "can_post": false,
    "can_void": true
  }
}
```

### Error Responses

**400 Bad Request - Wrong Status:**
```json
{
  "error": "Cannot post entry with status POSTED"
}
```

**400 Bad Request - Unbalanced:**
```json
{
  "error": "Entry is not balanced"
}
```

**400 Bad Request - Validation Error:**
```json
{
  "error": "Entry must have at least 2 lines"
}
```

**404 Not Found:**
```json
{
  "detail": "Not found."
}
```

### Status Transitions

| Current Status | Can Post | New Status | Notes |
|---------------|----------|------------|-------|
| DRAFT | Yes | POSTED | Standard flow |
| APPROVED | Yes | POSTED | After approval |
| POSTED | No | - | Already posted |
| VOID | No | - | Cannot post voided |
| PENDING_APPROVAL | No | - | Must approve first |

### Validation Checks

```
Pre-Post Validation:
═══════════════════

✓ Status Check
  └─> Must be DRAFT or APPROVED

✓ Balance Check
  └─> total_debit == total_credit

✓ Line Count Check
  └─> At least 2 lines

✓ Account Active Check
  └─> All accounts must be active

✓ Period Open Check
  └─> Entry date within open period

If any fail:
  └─> Return 400 with error message
```

### Usage in Client Application

```javascript
// Post an entry
async function postEntry(entryId) {
  const response = await fetch(
    `/api/v1/accounting/entries/${entryId}/post/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    return data.entry;
  } else {
    const error = await response.json();
    throw new Error(error.error);
  }
}

// Usage
try {
  const postedEntry = await postEntry(1234);
  alert('Entry posted successfully!');
} catch (error) {
  alert(`Failed to post: ${error.message}`);
}
```

### Expected Outcome
- Functional post endpoint
- Proper validation before posting
- Status update to POSTED
- Timestamp and user tracking
- Clear error messages

### Verification Checklist
- [ ] Response and status imported
- [ ] @action decorator added
- [ ] detail=True set
- [ ] methods=['post'] configured
- [ ] url_path='post' set
- [ ] Method signature correct
- [ ] Status validation implemented
- [ ] Balance validation implemented
- [ ] entry.post() called with user
- [ ] Error handling added
- [ ] Success response with serialized data
- [ ] Docstring complete

---

## Summary

This document implemented Django admin configuration and core REST API infrastructure for journal entries:

### Completed Components
- ✅ Django admin with inline line editing
- ✅ Custom list display with colored badges
- ✅ Bulk admin actions (post, void, approve)
- ✅ JournalEntrySerializer with nested lines
- ✅ JournalEntryLineSerializer with validation
- ✅ JournalEntryViewSet with CRUD operations
- ✅ Post entry custom action endpoint

### Key Achievements
1. **Admin Interface** - Efficient entry management with inlines
2. **List Display** - Rich information with colored indicators
3. **Bulk Actions** - Multi-entry processing capabilities
4. **REST API** - Full CRUD with filtering and search
5. **Nested Serialization** - Atomic entry creation with lines
6. **Custom Actions** - Workflow operations via API

### API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /entries/ | List entries |
| POST | /entries/ | Create entry |
| GET | /entries/{id}/ | Retrieve entry |
| PUT | /entries/{id}/ | Update entry |
| DELETE | /entries/{id}/ | Delete entry |
| POST | /entries/{id}/post/ | Post entry |

### Next Steps
Proceed to [02_Tasks-89-94_Testing-Documentation.md](02_Tasks-89-94_Testing-Documentation.md) to implement additional workflow actions (void, approve), comprehensive testing, and complete API documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~973
