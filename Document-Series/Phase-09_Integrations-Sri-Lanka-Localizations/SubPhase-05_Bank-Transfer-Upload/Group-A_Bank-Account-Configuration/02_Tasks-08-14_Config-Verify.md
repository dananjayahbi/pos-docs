# Tasks 08-14: Display Configuration and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** A - Bank Account Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Model-Fields.md](01_Tasks-01-07_Model-Fields.md)
- **→ Next Group:** [Group-B_Bank-Transfer-Processor](../Group-B_Bank-Transfer-Processor/)

---

## Document Overview

This document covers the display configuration, admin interface setup, and BankTransferConfig model creation. It includes display ordering for multiple accounts, comprehensive admin interface for bank account management, payment configuration settings including expiry hours and reminder notifications, and complete system verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Display Order Field | Low | 15 min |
| 09 | Create Sri Lanka Banks List | Low | 20 min |
| 10 | Create Bank Account Admin | Medium | 30 min |
| 11 | Create BankTransferConfig | Medium | 30 min |
| 12 | Create Payment Expiry Hours | Low | 15 min |
| 13 | Create Reminder Settings | Medium | 25 min |
| 14 | Verify Bank Configuration | Low | 20 min |

---

## Task 08: Create Display Order Field

### Overview
Add the display_order field to control the sequence in which bank accounts are displayed to customers during checkout. This allows tenants to prioritize certain accounts (e.g., most convenient, preferred bank) while maintaining multiple active accounts.

### Dependencies
- Task 01: Create BankAccount Model
- Task 07: Create Is Active Field

### Instructions

1. **Add display_order field to model**
   - Create IntegerField
   - Set default to 0
   - Set verbose_name to 'Display Order'
   - Set help_text to explain usage

2. **Configure field properties**
   - Set null=False
   - Set blank=True (optional in forms, uses default)
   - Lower numbers display first (0, 1, 2...)

3. **Update model Meta ordering**
   - Modify ordering tuple in Meta class
   - Set to ['display_order', '-created_at']
   - Ensures consistent sorting across queries

4. **Add database index**
   - Add index for display_order field
   - Optimize sorting queries
   - Consider composite index with tenant

5. **Add validation (optional)**
   - Create validator for reasonable range (0-999)
   - Prevent negative values if desired
   - Use MinValueValidator(0) if needed

6. **Consider auto-increment logic**
   - Create method to auto-assign next order
   - Override save() to set order for new records
   - Increment from max existing order per tenant

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Numeric ordering |
| default | 0 | Default sort position |
| null | False | Required in database |
| blank | True | Optional in forms |
| validators | MinValueValidator(0) | No negative values |
| verbose_name | Display Order | Display in admin |
| help_text | Lower numbers appear first | User guidance |
| db_index | True | Query optimization |

### Display Order Logic

```
Customer Sees Accounts In This Order:

Display Order | Bank | Status
──────────────┼──────┼────────
0             | BOC  | Active  ← Shown first
1             | HNB  | Active  ← Shown second
2             | Sampath | Active ← Shown third
5             | Commercial | Inactive ← Not shown
```

### Ordering Examples

| Scenario | Configuration | Result |
|----------|---------------|--------|
| Single Account | Order: 0 | Shows that account |
| Multiple, Same Order | All order: 0 | Sorted by created_at |
| Explicit Priority | Orders: 0, 1, 2 | Shows in order |
| Gaps in Numbers | Orders: 0, 5, 10 | Shows 0, then 5, then 10 |

### Auto-Assignment Logic

```
New Account Creation Flow:

1. Get max display_order for tenant
   max_order = BankAccount.objects.filter(
       tenant=tenant
   ).aggregate(Max('display_order'))['display_order__max']

2. Assign next number
   new_order = (max_order or -1) + 1

3. Save with new order
   instance.display_order = new_order
```

### Admin Interface Behavior

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| List Display | Show order column | Visibility |
| Inline Editing | Allow quick reordering | Convenience |
| Drag and Drop | Reorder via drag (optional) | UX improvement |
| Bulk Update | Renumber multiple accounts | Management |

### Query Optimization

```
Index Creation:
CREATE INDEX idx_bankaccount_display_order
ON payments_bank_accounts(display_order);

Composite Index:
CREATE INDEX idx_bankaccount_tenant_order
ON payments_bank_accounts(tenant_id, display_order, is_active);

Optimized Query:
SELECT * FROM payments_bank_accounts
WHERE tenant_id = ? AND is_active = TRUE
ORDER BY display_order, created_at DESC;
```

### Use Cases

```
Priority Scenarios:
├── Primary Account: display_order = 0
│   └── Main business account, most convenient
├── Secondary Account: display_order = 1
│   └── Backup or alternative bank
├── International Account: display_order = 2
│   └── For international payments only
└── Legacy Account: display_order = 99
    └── Old account, rarely used
```

### Reordering Strategy

| Method | Description | Complexity |
|--------|-------------|------------|
| Manual | Admin sets each number | Simple |
| Auto-increment | System assigns sequential | Medium |
| Drag-drop | UI-based reordering | Complex |
| Bulk renumber | Reset all to 0, 1, 2... | Simple |

### Expected Outcome
- display_order field added to model
- Accounts sort consistently by order
- Admin can control customer-facing sequence
- Database indexed for performance

### Verification Checklist
- [ ] display_order IntegerField added
- [ ] default set to 0
- [ ] MinValueValidator(0) applied
- [ ] Model Meta ordering updated to include display_order
- [ ] Database index added
- [ ] verbose_name and help_text configured
- [ ] Field displays in admin interface

---

## Task 09: Create Sri Lanka Banks List

### Overview
Create a comprehensive list of Sri Lankan banks as choices for the bank_name field. This task documents the complete list and ensures it's properly integrated into the model, providing a standardized set of bank options that reflect the current banking landscape in Sri Lanka.

### Dependencies
- Task 02: Create Bank Name Field

### Instructions

1. **Expand BANK_CHOICES constant**
   - Review existing bank choices from Task 02
   - Add any missing major banks
   - Include both state and private banks
   - Order alphabetically for easy selection

2. **Add specialized banks**
   - Include development banks
   - Include savings banks
   - Include any online-only banks
   - Consider Islamic banking institutions

3. **Document bank categories**
   - State Banks (e.g., BOC, People's Bank)
   - Licensed Commercial Banks (private)
   - Licensed Specialized Banks
   - Development Banks

4. **Add comments to code**
   - Group banks by category in comments
   - Add note about last update date
   - Include source reference (CBSL website)

5. **Create bank metadata (optional)**
   - Create separate BankInfo model or constant
   - Store additional data (logo URL, color, website)
   - Link via bank code

6. **Validate against current list**
   - Check Central Bank of Sri Lanka website
   - Ensure all active banks included
   - Remove defunct banks

### Complete Sri Lankan Banks List

| Bank Code | Bank Name | Type | Category |
|-----------|-----------|------|----------|
| BOC | Bank of Ceylon | State | Commercial |
| PEOPLES | People's Bank | State | Commercial |
| NSB | National Savings Bank | State | Savings |
| RDB | Regional Development Bank | State | Development |
| COMBANK | Commercial Bank of Ceylon | Private | Commercial |
| SAMPATH | Sampath Bank | Private | Commercial |
| HNB | Hatton National Bank | Private | Commercial |
| SEYLAN | Seylan Bank | Private | Commercial |
| NTB | Nations Trust Bank | Private | Commercial |
| DFCC | DFCC Bank | Private | Commercial |
| NDB | National Development Bank | Private | Development |
| PAN_ASIA | Pan Asia Bank | Private | Commercial |
| UNION | Union Bank | Private | Commercial |
| CARGILLS | Cargills Bank | Private | Commercial |
| CITI | Citibank N.A. | Foreign | Commercial |
| HSBC | HSBC | Foreign | Commercial |
| SCB | Standard Chartered Bank | Foreign | Commercial |
| AMANA | Amana Bank | Private | Islamic |
| MCB | MCB Bank Limited | Foreign | Commercial |

### Bank Categories

```
State Banks (4):
├── Bank of Ceylon (BOC)
├── People's Bank (PEOPLES)
├── National Savings Bank (NSB)
└── Regional Development Bank (RDB)

Licensed Commercial Banks - Private (11):
├── Commercial Bank of Ceylon
├── Sampath Bank
├── Hatton National Bank
├── Seylan Bank
├── Nations Trust Bank
├── DFCC Bank
├── Pan Asia Bank
├── Union Bank
├── Cargills Bank
├── National Development Bank
└── Amana Bank (Islamic)

Foreign Commercial Banks (4):
├── Citibank N.A.
├── HSBC
├── Standard Chartered Bank
└── MCB Bank Limited
```

### BANK_CHOICES Implementation

```
As Defined in Model:

# Last updated: 2026-01-31
# Source: Central Bank of Sri Lanka
BANK_CHOICES = [
    # State Banks
    ('BOC', 'Bank of Ceylon'),
    ('PEOPLES', 'People's Bank'),
    ('NSB', 'National Savings Bank'),
    ('RDB', 'Regional Development Bank'),
    
    # Private Commercial Banks
    ('COMBANK', 'Commercial Bank of Ceylon'),
    ('SAMPATH', 'Sampath Bank'),
    ('HNB', 'Hatton National Bank'),
    ('SEYLAN', 'Seylan Bank'),
    ('NTB', 'Nations Trust Bank'),
    ('DFCC', 'DFCC Bank'),
    ('NDB', 'National Development Bank'),
    ('PAN_ASIA', 'Pan Asia Bank'),
    ('UNION', 'Union Bank'),
    ('CARGILLS', 'Cargills Bank'),
    
    # Islamic Banking
    ('AMANA', 'Amana Bank'),
    
    # Foreign Banks
    ('CITI', 'Citibank N.A.'),
    ('HSBC', 'HSBC'),
    ('SCB', 'Standard Chartered Bank'),
    ('MCB', 'MCB Bank Limited'),
]
```

### Bank Selection Frequency

| Bank | Market Share | Typical Usage |
|------|--------------|---------------|
| BOC | ~15% | High - Government preferred |
| People's Bank | ~12% | High - Widely used |
| Commercial Bank | ~18% | High - Popular private |
| Sampath Bank | ~10% | High - Popular private |
| HNB | ~12% | High - Popular private |
| Others | ~33% | Medium to Low |

### Admin Display Strategy

```
Dropdown Organization:

Grouped by Category:
┌────────────────────────────┐
│ Bank Name: [Select ▼]     │
│                            │
│ State Banks                │
│   Bank of Ceylon           │
│   People's Bank            │
│   ...                      │
│                            │
│ Private Banks              │
│   Commercial Bank          │
│   Sampath Bank             │
│   ...                      │
│                            │
│ Foreign Banks              │
│   Citibank                 │
│   HSBC                     │
│   ...                      │
└────────────────────────────┘
```

### Extended Bank Metadata (Optional)

| Field | Example | Purpose |
|-------|---------|---------|
| Code | BOC | Database value |
| Name | Bank of Ceylon | Display name |
| Logo URL | /media/banks/boc.png | Visual branding |
| Color | #0066CC | Theme color |
| Website | https://www.boc.lk | Reference link |
| Category | State | Grouping |

### Future Extensibility

```
Migration Path:
├── Current: Hardcoded BANK_CHOICES
├── Intermediate: BANK_CHOICES with metadata dict
└── Future: Bank model with full data

Considerations:
├── Frequency: How often does list change?
├── Customization: Do tenants need custom banks?
├── Maintenance: Who updates bank information?
└── Performance: Lookup speed requirements
```

### Expected Outcome
- Comprehensive list of Sri Lankan banks
- Organized by category for easy selection
- Properly integrated into model
- Documented and maintainable

### Verification Checklist
- [ ] BANK_CHOICES includes 19+ banks
- [ ] Banks categorized (state, private, foreign)
- [ ] List ordered logically
- [ ] Code comments added with update date
- [ ] Cross-checked with CBSL website
- [ ] No duplicate bank codes
- [ ] All major banks represented

---

## Task 10: Create Bank Account Admin

### Overview
Create a comprehensive Django admin interface for the BankAccount model. This admin interface allows tenant administrators to manage bank accounts efficiently, including adding new accounts, editing existing ones, activating/deactivating accounts, and reordering display sequences.

### Dependencies
- Task 01: Create BankAccount Model
- Task 08: Create Display Order Field
- All fields from Tasks 02-07 complete

### Instructions

1. **Create admin.py file (if needed)**
   - Navigate to `backend/apps/payments/admin/` directory
   - Create `bank_account.py` file
   - Import necessary admin modules

2. **Import required modules**
   - Import Django admin (from django.contrib import admin)
   - Import BankAccount model
   - Import any custom admin mixins from project

3. **Create BankAccountAdmin class**
   - Inherit from admin.ModelAdmin
   - Register with @admin.register(BankAccount) decorator
   - Configure all admin options

4. **Configure list display**
   - Show: bank_name, account_number, account_name, is_active, display_order
   - Use list_display tuple
   - Consider adding custom methods for formatting

5. **Add list filters**
   - Filter by: is_active, bank_name, created_at
   - Use list_filter tuple
   - Enable quick filtering in sidebar

6. **Configure search fields**
   - Search: account_number, account_name, branch
   - Use search_fields tuple
   - Enable admin search box

7. **Add list editable fields**
   - Make is_active editable inline
   - Make display_order editable inline
   - Use list_editable tuple for quick editing

8. **Configure fieldsets**
   - Group related fields logically
   - Create sections: Account Information, Branch Details, Configuration
   - Use fieldsets tuple

9. **Add readonly fields**
   - Make id, created_at, updated_at readonly
   - Make tenant readonly (set on creation)
   - Use readonly_fields tuple

10. **Add custom actions**
    - Create "Activate accounts" action
    - Create "Deactivate accounts" action
    - Use actions list

11. **Add ordering**
    - Set default ordering to ['tenant', 'display_order']
    - Use ordering tuple

12. **Update admin __init__.py**
    - Import BankAccountAdmin
    - Ensure proper registration

### Admin Configuration Specifications

| Configuration | Values | Purpose |
|--------------|--------|---------|
| list_display | See table below | Columns in list view |
| list_filter | is_active, bank_name, created_at | Sidebar filters |
| search_fields | account_number, account_name, branch | Search functionality |
| list_editable | is_active, display_order | Quick inline editing |
| readonly_fields | id, tenant, created_at, updated_at | Prevent modification |
| ordering | [tenant, display_order] | Default sort |

### List Display Fields

| Field | Display Name | Format | Notes |
|-------|--------------|--------|-------|
| bank_name | Bank | get_bank_name_display() | Show full name |
| account_number | Account Number | Masked or full | Consider masking |
| account_name | Account Holder | Truncate if long | Full text |
| branch | Branch | -- if empty | Handle nulls |
| swift_code | SWIFT | -- if empty | Handle nulls |
| is_active | Active | Boolean icon | ✓ or ✗ |
| display_order | Order | Integer | Editable |

### Fieldsets Structure

```
Account Information:
├── bank_name
├── account_number
├── account_name
└── tenant (readonly)

Branch & International:
├── branch
└── swift_code

Configuration:
├── is_active
├── display_order
└── created_at (readonly)
```

### Custom Admin Actions

```
Action: Activate Selected Accounts
├── Function: Set is_active = True
├── Confirmation: "Activate X accounts?"
└── Message: "X accounts activated"

Action: Deactivate Selected Accounts
├── Function: Set is_active = False
├── Confirmation: "Deactivate X accounts?"
└── Message: "X accounts deactivated"
```

### Admin List View Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Bank Accounts                                [+ Add Bank Account]│
├─────────────────────────────────────────────────────────────────┤
│ Filters:              Search: [____________] 🔍                  │
│ ☐ Active                                                         │
│ ☐ Inactive            ┌────┬──────┬────────┬──────┬──────┬─────┐│
│                       │ ✓  │ Bank │Account │Holder│Active│Order││
│ By Bank:              ├────┼──────┼────────┼──────┼──────┼─────┤│
│ ☐ BOC                 │ □  │ BOC  │123-456 │ABC Co│  ✓   │  0  ││
│ ☐ Commercial          │ □  │ HNB  │789-012 │ABC Co│  ✓   │  1  ││
│ ☐ Sampath             │ □  │Sampth│345-678 │ABC Co│  ✗   │  2  ││
│                       └────┴──────┴────────┴──────┴──────┴─────┘│
│                       [Actions ▼] [Activate] [Deactivate]  [Go] │
└─────────────────────────────────────────────────────────────────┘
```

### Security Considerations

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Tenant Isolation | Filter by request.tenant | Show only tenant's accounts |
| Permissions | Use has_view/change permissions | Role-based access |
| Readonly Fields | Lock critical fields | Prevent accidents |
| Audit Trail | Log all changes | Compliance |

### Custom Methods Example

```
Custom Display Methods:

def masked_account_number(self, obj):
    """Show only last 4 digits"""
    return f"****{obj.account_number[-4:]}"
masked_account_number.short_description = 'Account Number'

def bank_display(self, obj):
    """Show bank with icon"""
    return f"🏦 {obj.get_bank_name_display()}"
bank_display.short_description = 'Bank'
```

### Expected Outcome
- Fully functional admin interface for BankAccount
- List view with all important fields
- Filtering and search capabilities
- Inline editing for common changes
- Bulk actions for account management

### Verification Checklist
- [ ] BankAccountAdmin class created
- [ ] Registered with @admin.register decorator
- [ ] list_display configured with 6+ fields
- [ ] list_filter includes is_active and bank_name
- [ ] search_fields includes account_number and account_name
- [ ] list_editable includes is_active and display_order
- [ ] fieldsets organized logically
- [ ] readonly_fields configured
- [ ] Custom actions (activate/deactivate) added
- [ ] Admin displays correctly in browser
- [ ] All fields editable/readonly as intended

---

## Task 11: Create BankTransferConfig Model

### Overview
Create the BankTransferConfig model to store tenant-specific configuration for bank transfer payments. This singleton-per-tenant model manages settings like payment expiry hours, reminder notification timings, and other bank transfer-specific configurations that affect the payment workflow.

### Dependencies
- Task 01: Create BankAccount Model
- SubPhase-01 (Multi-tenancy setup) complete

### Instructions

1. **Create config.py file**
   - Navigate to `backend/apps/payments/processors/bank_transfer/` directory
   - Create new file named `config.py`
   - This will contain the BankTransferConfig model

2. **Import required dependencies**
   - Import Django models
   - Import JSONField (from django.db.models)
   - Import validators
   - Import BaseModel from core
   - Import Tenant model

3. **Define BankTransferConfig model class**
   - Create class inheriting from BaseModel
   - This is a configuration singleton per tenant
   - One config per tenant

4. **Add tenant foreign key**
   - Create OneToOneField to Tenant
   - Set on_delete to models.CASCADE
   - Set related_name to 'bank_transfer_config'
   - Ensures single config per tenant

5. **Add basic fields structure**
   - Prepare for payment_expiry_hours (Task 12)
   - Prepare for reminder_hours_before (Task 13)
   - Add enabled field (BooleanField, default True)

6. **Configure model Meta**
   - Set db_table to 'payments_bank_transfer_config'
   - Set verbose_name to 'Bank Transfer Configuration'
   - Set verbose_name_plural (same as singular for config)

7. **Add model methods**
   - Implement __str__ method
   - Create get_or_create_for_tenant() class method
   - Create validation methods for config

8. **Add model manager (optional)**
   - Create custom manager for config
   - Add helper methods for accessing config

### Model Structure Overview

```
BankTransferConfig
├── BaseModel Fields (inherited)
│   ├── id (UUID)
│   ├── created_at
│   ├── updated_at
│   ├── created_by
│   └── updated_by
├── tenant (OneToOneField)
├── enabled (BooleanField)
├── payment_expiry_hours (IntegerField) - Task 12
├── reminder_hours_before (JSONField) - Task 13
└── auto_cancel_expired (BooleanField)
```

### Field Specifications (Initial)

| Field | Type | Purpose |
|-------|------|---------|
| tenant | OneToOneField | Link to tenant (singleton) |
| enabled | BooleanField | Enable/disable bank transfers |
| payment_expiry_hours | IntegerField | Hours until payment expires |
| reminder_hours_before | JSONField | Reminder timings |
| auto_cancel_expired | BooleanField | Auto-cancel on expiry |

### Tenant Relationship

```
Relationship Type: OneToOne
├── One Config per Tenant
├── Created on first bank transfer setup
└── Accessed via tenant.bank_transfer_config

Query Example:
config = BankTransferConfig.objects.get(tenant=tenant)
# or
config = tenant.bank_transfer_config
```

### Configuration Pattern

```
Singleton Per Tenant Pattern:

Tenant A → BankTransferConfig A
Tenant B → BankTransferConfig B
Tenant C → BankTransferConfig C

Each tenant has exactly one config object
```

### Model Methods

| Method | Purpose | Return Type |
|--------|---------|-------------|
| __str__() | String representation | str |
| get_or_create_for_tenant(tenant) | Get/create config | BankTransferConfig |
| is_enabled() | Check if enabled | bool |
| validate_config() | Validate settings | bool |

### get_or_create_for_tenant Implementation

```
Purpose: Ensure config exists for tenant

@classmethod
def get_or_create_for_tenant(cls, tenant):
    """Get or create config for tenant with defaults"""
    config, created = cls.objects.get_or_create(
        tenant=tenant,
        defaults={
            'enabled': True,
            'payment_expiry_hours': 48,
            'reminder_hours_before': [24, 6],
            'auto_cancel_expired': True,
        }
    )
    return config

Usage:
config = BankTransferConfig.get_or_create_for_tenant(request.tenant)
```

### Default Configuration Values

| Setting | Default Value | Rationale |
|---------|---------------|-----------|
| enabled | True | Enable on creation |
| payment_expiry_hours | 48 | 2 days is reasonable |
| reminder_hours_before | [24, 6] | 1 day and 6 hours before |
| auto_cancel_expired | True | Clean up automatically |

### Database Table Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| db_table | payments_bank_transfer_config | Explicit naming |
| verbose_name | Bank Transfer Configuration | Admin display |
| verbose_name_plural | Bank Transfer Configuration | Same (singleton) |

### Admin Integration Preparation

```
Admin Features:
├── Show config per tenant
├── Inline edit all settings
├── Validate on save
└── Show current values clearly

Display Format:
┌────────────────────────────────────┐
│ Bank Transfer Configuration        │
├────────────────────────────────────┤
│ Enabled: ✓                         │
│ Payment Expiry: 48 hours           │
│ Reminders: 24h, 6h before expiry   │
│ Auto-cancel: ✓                     │
└────────────────────────────────────┘
```

### Expected Outcome
- BankTransferConfig model created
- OneToOne relationship with Tenant
- Basic structure ready for configuration fields
- Helper methods for accessing config
- Ready for detailed fields in Tasks 12-13

### Verification Checklist
- [ ] `backend/apps/payments/processors/bank_transfer/config.py` created
- [ ] BankTransferConfig class inherits from BaseModel
- [ ] OneToOneField to Tenant configured
- [ ] enabled BooleanField added
- [ ] Model Meta class configured
- [ ] __str__ method implemented
- [ ] get_or_create_for_tenant() class method created
- [ ] Model imports properly
- [ ] No syntax errors

---

## Task 12: Create Payment Expiry Hours

### Overview
Add the payment_expiry_hours field to BankTransferConfig to define how long customers have to complete a bank transfer payment before it expires. This configurable setting allows tenants to balance between giving customers enough time and preventing long-pending orders.

### Dependencies
- Task 11: Create BankTransferConfig Model

### Instructions

1. **Add payment_expiry_hours field**
   - Create IntegerField
   - Set default to 48 (48 hours = 2 days)
   - Set verbose_name to 'Payment Expiry Hours'
   - Set help_text to explain usage

2. **Add field validators**
   - Import MinValueValidator and MaxValueValidator
   - Set minimum to 1 hour (can't be instant)
   - Set maximum to 168 hours (7 days)
   - Ensure reasonable timeframe

3. **Configure field properties**
   - Set null=False (required)
   - Set blank=False (must be filled)
   - Use default=48 for new configs

4. **Add field documentation**
   - Comment explaining hour ranges
   - Document common values (24, 48, 72)
   - Explain impact on order lifecycle

5. **Create helper methods**
   - Add get_expiry_datetime(from_time) method
   - Returns datetime when payment expires
   - Add is_payment_expired(created_at) method

6. **Add admin field configuration**
   - Include in fieldsets
   - Show with descriptive label
   - Consider adding widget for common values

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Store hour count |
| default | 48 | 2 days standard |
| null | False | Required field |
| blank | False | Must be filled |
| validators | [MinValueValidator(1), MaxValueValidator(168)] | Valid range |
| verbose_name | Payment Expiry Hours | Display name |
| help_text | Hours until payment expires | User guidance |

### Expiry Hour Ranges

| Hours | Days | Use Case | Recommendation |
|-------|------|----------|----------------|
| 1-12 | < 1 day | Express orders | Too short |
| 24 | 1 day | Quick turnover | Acceptable |
| 48 | 2 days | Standard | Recommended |
| 72 | 3 days | Extended | Acceptable |
| 96-120 | 4-5 days | Long window | Borderline |
| 168 | 7 days | Maximum | Too long |

### Common Configuration Values

```
Standard Configurations:
├── Express: 24 hours (1 day)
│   └── For time-sensitive products
├── Standard: 48 hours (2 days)
│   └── Default, balanced approach
├── Extended: 72 hours (3 days)
│   └── For expensive items, big orders
└── Maximum: 168 hours (7 days)
    └── Special cases only
```

### Validation Rules

| Rule | Min | Max | Purpose |
|------|-----|-----|---------|
| Minimum | 1 | - | At least 1 hour |
| Maximum | - | 168 | At most 7 days |
| Default | 48 | - | 2 days standard |

### Helper Methods Implementation

```
Method: get_expiry_datetime(from_time)
Purpose: Calculate expiry datetime
Input: datetime object (usually order.created_at)
Output: datetime object (expiry time)

Implementation:
from datetime import timedelta

def get_expiry_datetime(self, from_time):
    """Calculate payment expiry datetime"""
    return from_time + timedelta(hours=self.payment_expiry_hours)

Usage:
expiry = config.get_expiry_datetime(order.created_at)
```

```
Method: is_payment_expired(created_at)
Purpose: Check if payment has expired
Input: datetime object (order creation time)
Output: boolean (True if expired)

Implementation:
from django.utils import timezone

def is_payment_expired(self, created_at):
    """Check if payment has expired"""
    expiry = self.get_expiry_datetime(created_at)
    return timezone.now() > expiry

Usage:
if config.is_payment_expired(order.created_at):
    # Handle expired payment
```

### Impact on Order Lifecycle

```
Order Timeline:

Created → Pending → [Payment Window] → Expired/Paid
  |                                         ^
  t=0                             t=expiry_hours
  
Within Window:
├── Customer can pay
├── Order status: Pending Payment
└── Reminders sent (Task 13)

After Expiry:
├── Payment window closed
├── Order status: Expired/Cancelled
└── Inventory released
```

### Admin Display Configuration

```
Fieldset: Payment Settings
┌────────────────────────────────────┐
│ Payment Expiry Hours: [48 ▼]      │
│ Common: 24h | 48h | 72h | Custom   │
│                                    │
│ Calculated expiry:                 │
│ Order at 2PM → Expires 2PM+48h    │
└────────────────────────────────────┘
```

### Business Logic Integration

| Component | Usage | Purpose |
|-----------|-------|---------|
| Order Creation | Set expiry_at field | Track deadline |
| Payment Check | Verify not expired | Validation |
| Reminder System | Calculate timing | Task 13 |
| Cron Jobs | Find expired orders | Cleanup |

### Expected Outcome
- payment_expiry_hours field added to config
- Validated range (1-168 hours)
- Helper methods for expiry calculations
- Default set to 48 hours
- Ready to use in payment flow

### Verification Checklist
- [ ] payment_expiry_hours IntegerField added
- [ ] default set to 48
- [ ] MinValueValidator(1) applied
- [ ] MaxValueValidator(168) applied
- [ ] verbose_name and help_text configured
- [ ] get_expiry_datetime() method created
- [ ] is_payment_expired() method created
- [ ] Field displays in admin
- [ ] Validation works correctly

---

## Task 13: Create Reminder Settings

### Overview
Add the reminder_hours_before field to BankTransferConfig to configure automated reminder notifications sent to customers before their payment expires. This JSONField stores an array of hour values indicating when to send reminders (e.g., 24 hours before, 6 hours before expiry).

### Dependencies
- Task 11: Create BankTransferConfig Model
- Task 12: Create Payment Expiry Hours

### Instructions

1. **Add reminder_hours_before field**
   - Create JSONField
   - Set default to [24, 6] (1 day and 6 hours before)
   - Set verbose_name to 'Reminder Hours Before Expiry'
   - Set help_text to explain format

2. **Configure field properties**
   - Set null=False
   - Set blank=False (use default if not specified)
   - Store as array of integers

3. **Add field validation**
   - Create custom validator for JSONField
   - Ensure value is list/array
   - Ensure all elements are positive integers
   - Ensure values less than payment_expiry_hours

4. **Create validation method**
   - Add validate_reminder_settings() method
   - Check reminders < expiry hours
   - Check reminders in ascending order (optional)
   - Raise ValidationError if invalid

5. **Add helper methods**
   - Create get_reminder_datetimes(created_at) method
   - Returns list of datetime objects when reminders fire
   - Add get_next_reminder(created_at) method
   - Returns next upcoming reminder time

6. **Configure admin display**
   - Use custom widget for JSON editing
   - Show as comma-separated in list
   - Add preset options (common configurations)

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Store array of hours |
| default | [24, 6] | Two reminders |
| null | False | Required field |
| blank | False | Use default |
| validators | Custom validator | Format validation |
| verbose_name | Reminder Hours Before Expiry | Display name |
| help_text | Hours before expiry to send reminders | Guidance |

### Reminder Timing Examples

| Config | Meaning | Reminder Times |
|--------|---------|----------------|
| [24] | 1 reminder | 24h before expiry |
| [24, 6] | 2 reminders | 24h and 6h before |
| [48, 24, 12, 6] | 4 reminders | Multiple warnings |
| [72, 48, 24, 12, 6, 1] | 6 reminders | Very frequent |
| [] | No reminders | Disabled |

### Common Configurations

```
Minimal:
[24]  ← Single reminder 1 day before

Standard (Recommended):
[24, 6]  ← First warning 1 day, final 6 hours

Aggressive:
[48, 24, 12, 6, 1]  ← Multiple reminders

Disabled:
[]  ← No reminders sent
```

### Reminder Timeline Visualization

```
Example: 48-hour expiry, [24, 6] reminders

Timeline:
├─────────┬─────────────┬─────────────┬────────────┐
│         │             │             │            │
t=0    t=24h         t=42h         t=48h         
Order   Reminder     Reminder     Expiry
Created   #1           #2
         (24h         (6h
         before)      before)
```

### Validation Rules

| Rule | Validation | Example Valid | Example Invalid |
|------|------------|---------------|-----------------|
| Type | Must be array | [24, 6] | "24, 6" |
| Elements | Must be integers | [24, 6] | [24.5, 6] |
| Positive | Must be > 0 | [24, 6] | [24, -6] |
| Within Expiry | < expiry_hours | [24, 6] for 48h | [72, 48] for 48h |

### Custom Validator Implementation

```
Validator Function:

from django.core.exceptions import ValidationError

def validate_reminder_hours(value):
    """Validate reminder hours array"""
    if not isinstance(value, list):
        raise ValidationError("Must be a list of hours")
    
    for hour in value:
        if not isinstance(hour, int):
            raise ValidationError("All values must be integers")
        if hour <= 0:
            raise ValidationError("Hours must be positive")
    
    return value

Usage in Model:
reminder_hours_before = JSONField(
    default=list([24, 6]),
    validators=[validate_reminder_hours]
)
```

### Model Validation Method

```
Method: validate_reminder_settings()

def validate_reminder_settings(self):
    """Validate reminders against expiry hours"""
    for hours_before in self.reminder_hours_before:
        if hours_before >= self.payment_expiry_hours:
            raise ValidationError(
                f"Reminder at {hours_before}h is >= expiry at "
                f"{self.payment_expiry_hours}h"
            )
    return True

Call in clean() method or save()
```

### Helper Methods Implementation

```
Method: get_reminder_datetimes(created_at)

from datetime import timedelta

def get_reminder_datetimes(self, created_at):
    """Get all reminder datetime objects"""
    expiry = self.get_expiry_datetime(created_at)
    reminders = []
    for hours_before in sorted(self.reminder_hours_before, reverse=True):
        reminder_time = expiry - timedelta(hours=hours_before)
        if reminder_time > created_at:  # Only future reminders
            reminders.append(reminder_time)
    return reminders

Usage:
reminder_times = config.get_reminder_datetimes(order.created_at)
for reminder_time in reminder_times:
    schedule_task(send_reminder, eta=reminder_time)
```

### Integration with Notification System

| Component | Integration Point | Purpose |
|-----------|------------------|---------|
| Order Creation | Schedule reminders | Set up tasks |
| Celery Tasks | Execute at reminder_time | Send notifications |
| Email Service | Send reminder email | Customer notification |
| SMS/WhatsApp | Send reminder message | Alternative channel |

### Reminder Message Context

```
Reminder Content:
├── Order number
├── Total amount
├── Bank account details
├── Payment reference
├── Hours remaining
└── Payment instructions link

Example:
"Your payment of Rs. 5,000 for Order #12345 is due in 24 hours.
Please transfer to BOC Account 1234567890 (ABC Store).
Reference: ORD12345"
```

### Admin Configuration

```
Admin Widget:
┌────────────────────────────────────┐
│ Reminder Hours Before Expiry:      │
│ [24, 6]                            │
│                                    │
│ Presets:                           │
│ • Single (24h)                     │
│ • Standard (24h, 6h)               │
│ • Aggressive (48h, 24h, 12h, 6h)   │
│ • None (no reminders)              │
└────────────────────────────────────┘
```

### Expected Outcome
- reminder_hours_before field added
- Stores array of reminder timings
- Validated against expiry hours
- Helper methods for scheduling
- Default provides reasonable reminders

### Verification Checklist
- [ ] reminder_hours_before JSONField added
- [ ] default set to [24, 6]
- [ ] Custom validator created and applied
- [ ] validate_reminder_settings() method created
- [ ] get_reminder_datetimes() method created
- [ ] Validation ensures hours < expiry_hours
- [ ] Validation ensures positive integers
- [ ] Field displays correctly in admin
- [ ] Can store various configurations

---

## Task 14: Verify Bank Configuration

### Overview
Perform comprehensive verification of the complete bank account configuration system. This includes testing the BankAccount model, BankTransferConfig model, admin interfaces, database migrations, and integration points. Ensure all components work together correctly before proceeding to the payment processor implementation.

### Dependencies
- All Tasks 01-13 complete
- Database migrations created and applied
- Admin registered and accessible

### Instructions

1. **Verify BankAccount model**
   - Check all fields created correctly
   - Verify field types and constraints
   - Test model string representation
   - Verify foreign key relationships

2. **Test BankAccount CRUD operations**
   - Create test bank accounts via admin
   - Test with different banks from choices
   - Verify validation (required fields, formats)
   - Test update operations
   - Test delete operations (soft recommended)

3. **Verify display ordering**
   - Create multiple accounts with different orders
   - Verify sorting in queries
   - Test display_order changes
   - Confirm customer-facing order correct

4. **Test is_active toggle**
   - Create active and inactive accounts
   - Verify filtering queries
   - Test bulk activate/deactivate actions
   - Confirm inactive accounts hidden from customers

5. **Verify BankTransferConfig model**
   - Check model fields created correctly
   - Test get_or_create_for_tenant() method
   - Verify OneToOne relationship
   - Test default values applied

6. **Test configuration validation**
   - Test payment_expiry_hours within range
   - Test reminder_hours_before validation
   - Verify reminders < expiry hours
   - Test invalid configurations rejected

7. **Test helper methods**
   - Test get_expiry_datetime() calculation
   - Test is_payment_expired() logic
   - Test get_reminder_datetimes() generation
   - Verify datetime calculations correct

8. **Verify admin interfaces**
   - Access BankAccount admin
   - Test list view with filters and search
   - Test inline editing (is_active, display_order)
   - Test custom actions
   - Access BankTransferConfig admin
   - Test config editing

9. **Run database migrations**
   - Generate migrations: python manage.py makemigrations
   - Review migration file for correctness
   - Apply migrations: python manage.py migrate
   - Verify tables created in database
   - Check indexes created

10. **Test multi-tenancy isolation**
    - Create accounts for different tenants
    - Verify tenant A cannot see tenant B accounts
    - Test queries filtered by tenant
    - Verify config per-tenant isolation

11. **Verify integration points**
    - Check imports in __init__.py files
    - Verify models registered in admin
    - Test API endpoints (if created)
    - Check signals configured (if used)

12. **Review and document**
    - Document any issues found
    - Create test data for development
    - Document admin workflows
    - Update API documentation if needed

### Verification Checklist - Models

```
BankAccount Model:
├── [ ] Model class exists
├── [ ] Inherits from BaseModel
├── [ ] All fields present (8 fields)
├── [ ] tenant ForeignKey configured
├── [ ] bank_name with BANK_CHOICES (19 banks)
├── [ ] account_number with validation
├── [ ] account_name CharField
├── [ ] branch CharField (optional)
├── [ ] swift_code with validation (optional)
├── [ ] is_active BooleanField (default True)
├── [ ] display_order IntegerField (default 0)
├── [ ] Meta class configured
├── [ ] __str__() method implemented
└── [ ] Indexes created

BankTransferConfig Model:
├── [ ] Model class exists
├── [ ] Inherits from BaseModel
├── [ ] tenant OneToOneField configured
├── [ ] enabled BooleanField
├── [ ] payment_expiry_hours with validators
├── [ ] reminder_hours_before JSONField
├── [ ] Helper methods implemented
└── [ ] Meta class configured
```

### Verification Checklist - Admin

```
Admin Interfaces:
├── [ ] BankAccountAdmin registered
├── [ ] List display shows 6+ fields
├── [ ] List filters work (is_active, bank_name)
├── [ ] Search works (account_number, account_name)
├── [ ] Inline editing works (is_active, display_order)
├── [ ] Custom actions work (activate/deactivate)
├── [ ] Fieldsets organized logically
├── [ ] Readonly fields enforced
├── [ ] BankTransferConfigAdmin registered
└── [ ] Config editing works correctly
```

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Create Account | Add via admin with all fields | Account saved successfully |
| Required Fields | Try to save without bank_name | Validation error shown |
| Display Order | Create 3 accounts with orders 0,1,2 | Listed in correct order |
| Activate/Deactivate | Toggle is_active | Status changes correctly |
| Config Creation | Access config for new tenant | Config created with defaults |
| Expiry Validation | Set expiry to 200 hours | Validation error (max 168) |
| Reminder Validation | Set reminder to 50h with 48h expiry | Validation error |

### Migration Verification

```
Commands to Run:
├── python manage.py makemigrations payments
├── python manage.py migrate payments
├── python manage.py showmigrations payments
└── python manage.py sqlmigrate payments <migration_number>

Expected Tables:
├── payments_bank_accounts
└── payments_bank_transfer_config

Expected Indexes:
├── idx_bankaccount_tenant_active
├── idx_bankaccount_display_order
└── idx_banktransferconfig_tenant
```

### Multi-Tenancy Test

```
Test Setup:
1. Create Tenant A and Tenant B
2. Create accounts for each tenant
3. Switch tenant context
4. Query accounts

Expected Results:
├── Tenant A sees only Tenant A accounts
├── Tenant B sees only Tenant B accounts
├── Configs isolated per tenant
└── No cross-tenant data leakage
```

### Integration Points Checklist

```
File Structure:
├── [ ] models/__init__.py imports BankAccount
├── [ ] models/__init__.py imports BankTransferConfig
├── [ ] admin/__init__.py imports admin classes
├── [ ] processors/bank_transfer/__init__.py configured
└── [ ] URLs configured (if API exists)

Dependencies:
├── [ ] core.models.BaseModel available
├── [ ] tenants app configured
├── [ ] Django admin working
└── [ ] Database accessible
```

### Sample Test Data

```
Create Test Accounts:
1. BOC Account:
   - Bank: Bank of Ceylon
   - Account: 1234567890
   - Name: Test Company (Pvt) Ltd
   - Active: Yes
   - Order: 0

2. Commercial Bank Account:
   - Bank: Commercial Bank
   - Account: 0987654321
   - Name: Test Company (Pvt) Ltd
   - Branch: Colombo
   - SWIFT: CCEYLKLX
   - Active: Yes
   - Order: 1

3. Inactive Account:
   - Bank: Sampath Bank
   - Account: 5555555555
   - Name: Test Company (Pvt) Ltd
   - Active: No
   - Order: 2
```

### Configuration Test Data

```
Standard Config:
├── enabled: True
├── payment_expiry_hours: 48
├── reminder_hours_before: [24, 6]
└── auto_cancel_expired: True

Extended Config:
├── enabled: True
├── payment_expiry_hours: 72
├── reminder_hours_before: [48, 24, 12, 6]
└── auto_cancel_expired: True

Minimal Config:
├── enabled: True
├── payment_expiry_hours: 24
├── reminder_hours_before: [12]
└── auto_cancel_expired: True
```

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Migration fails | Field conflict | Check field names, types |
| Admin not showing | Not registered | Check admin __init__.py |
| Validation not working | Validator not imported | Import and apply validators |
| Queries slow | Missing indexes | Add indexes in Meta |
| Config not created | No default handling | Use get_or_create_for_tenant |

### Expected Outcome
- All models working correctly
- Admin interfaces functional
- Database migrations applied
- Multi-tenancy isolation verified
- Ready for payment processor (Group B)

### Final Verification Checklist
- [ ] BankAccount model fully functional
- [ ] All 8 fields working correctly
- [ ] BankTransferConfig model functional
- [ ] Configuration validation working
- [ ] Admin interfaces accessible and functional
- [ ] Database migrations applied successfully
- [ ] Test accounts created successfully
- [ ] Display ordering works correctly
- [ ] Active/inactive toggle works
- [ ] Multi-tenancy isolation verified
- [ ] Helper methods tested and working
- [ ] No errors in admin interface
- [ ] All validation rules enforced
- [ ] Integration points verified
- [ ] Documentation updated
- [ ] Ready for Group-B tasks

---

## Summary

This document completed the bank account configuration system with display ordering, comprehensive admin interface, payment configuration model, expiry settings, reminder notifications, and thorough verification. The system is now ready to be used by the bank transfer payment processor.

### Completed Tasks
8. ✓ Created display_order field for account sequencing
9. ✓ Documented complete Sri Lankan banks list (19 banks)
10. ✓ Created comprehensive Django admin for BankAccount
11. ✓ Created BankTransferConfig model for payment settings
12. ✓ Added payment_expiry_hours field with validation
13. ✓ Added reminder_hours_before field with scheduling
14. ✓ Verified complete bank configuration system

### Configuration Summary

| Component | Key Features | Status |
|-----------|--------------|--------|
| BankAccount | 8 fields, multi-bank support | ✓ Complete |
| Display Order | Customer-facing sequencing | ✓ Complete |
| Admin Interface | Full CRUD, filters, actions | ✓ Complete |
| BankTransferConfig | Payment settings per tenant | ✓ Complete |
| Expiry Hours | 1-168 hour range | ✓ Complete |
| Reminder System | Configurable notifications | ✓ Complete |

### Next Steps
Proceed to [Group-B_Bank-Transfer-Processor](../Group-B_Bank-Transfer-Processor/) to implement the payment processor that uses these bank accounts for processing customer payments, including payment order creation, status management, and upload verification.
