# Tasks 06-10: Terminal Fields & Meta Configuration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** A - POS Terminal & Session Models  
> **Document:** 02 of 04  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_POS-App-Terminal-Model.md](01_Tasks-01-05_POS-App-Terminal-Model.md)
- **→ Next Document:** [03_Tasks-11-15_Session-Model-Fields.md](03_Tasks-11-15_Session-Model-Fields.md)

---

## Document Overview

This document covers the extension of the POSTerminal model with hardware configuration fields, location settings, operational settings, receipt template integration, and database optimization through the Meta class. These additions complete the terminal configuration capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Add terminal hardware fields | Medium |
| 07 | Add terminal location fields | Low |
| 08 | Add terminal settings | Medium |
| 09 | Add receipt template FK | Low |
| 10 | Create POSTerminal Meta class | Low |

---

## Task 06: Add terminal hardware fields

### Overview
Add fields to configure hardware devices connected to the POS terminal, including receipt printers, cash drawers, and barcode scanners. These configurations enable proper hardware integration and operation.

### Dependencies
- Task 05: Create POSTerminal model

### Instructions

1. **Open the POSTerminal model file**
   - Open `apps/pos/terminal/models/pos_terminal.py`

2. **Define printer type constants (in constants.py)**
   - Open `apps/pos/constants.py`
   - Add printer type constants: THERMAL, IMPACT, NONE
   - Create `PRINTER_TYPE_CHOICES` tuple

3. **Add printer type field to POSTerminal**
   - `printer_type` field: CharField with choices from `PRINTER_TYPE_CHOICES`
   - Set max_length=20
   - Set default to `'thermal'`
   - Add help_text explaining printer types

4. **Add receipt printer IP field**
   - `receipt_printer_ip` field: GenericIPAddressField with blank=True, null=True
   - Add help_text for network printer IP address
   - This is for network-connected thermal printers

5. **Add receipt printer port field**
   - `receipt_printer_port` field: PositiveIntegerField with blank=True, null=True
   - Set default to 9100 (standard ESC/POS port)
   - Add help_text for printer port configuration

6. **Add cash drawer enabled field**
   - `cash_drawer_enabled` field: BooleanField with default=True
   - Add help_text explaining cash drawer functionality

7. **Add cash drawer auto-open field**
   - `cash_drawer_auto_open` field: BooleanField with default=True
   - Add help_text for automatic opening after payment
   - This controls if drawer opens automatically on sale

8. **Add barcode scanner enabled field**
   - `barcode_scanner_enabled` field: BooleanField with default=True
   - Add help_text for barcode scanning capability

9. **Add scanner interface field**
   - `scanner_interface` field: CharField with max_length=20
   - Choices: USB, BLUETOOTH, WIRELESS
   - Set default to `'usb'`
   - Add help_text for scanner connection type

### Printer Type Options

| Type | Code | Description | Use Case |
|------|------|-------------|----------|
| **THERMAL** | `'thermal'` | Thermal receipt printer | Fast, silent, most common for receipts |
| **IMPACT** | `'impact'` | Dot matrix printer | Multi-part forms, invoices |
| **NONE** | `'none'` | No printer configured | Digital receipts only, email/SMS |

### Hardware Configuration Matrix

| Hardware | Field | Type | Default | Purpose |
|----------|-------|------|---------|---------|
| **Receipt Printer** | printer_type | Choice | thermal | Type of printer |
| | receipt_printer_ip | IP Address | null | Network printer IP |
| | receipt_printer_port | Integer | 9100 | Network printer port |
| **Cash Drawer** | cash_drawer_enabled | Boolean | True | Enable drawer control |
| | cash_drawer_auto_open | Boolean | True | Auto-open on payment |
| **Barcode Scanner** | barcode_scanner_enabled | Boolean | True | Enable scanning |
| | scanner_interface | Choice | usb | Connection type |

### Receipt Printer Network Configuration

```
┌─────────────────┐         Network          ┌─────────────────┐
│  POS Terminal   │─────────(TCP/IP)─────────│ Thermal Printer │
│  192.168.1.100  │   Port 9100 (ESC/POS)    │  192.168.1.50   │
└─────────────────┘                          └─────────────────┘
```

### Cash Drawer Integration

- **Hardware Connection:** Typically connected to receipt printer via RJ11/RJ12 cable
- **Control Method:** ESC/POS commands sent through printer
- **Auto-Open Trigger:** After successful payment completion
- **Manual Open:** Available through POS interface for cashier drawer access

### Expected Outcome
```python
# In apps/pos/constants.py (add these)
PRINTER_TYPE_THERMAL = 'thermal'
PRINTER_TYPE_IMPACT = 'impact'
PRINTER_TYPE_NONE = 'none'

PRINTER_TYPE_CHOICES = (
    (PRINTER_TYPE_THERMAL, 'Thermal Printer'),
    (PRINTER_TYPE_IMPACT, 'Impact Printer'),
    (PRINTER_TYPE_NONE, 'No Printer'),
)

SCANNER_INTERFACE_USB = 'usb'
SCANNER_INTERFACE_BLUETOOTH = 'bluetooth'
SCANNER_INTERFACE_WIRELESS = 'wireless'

SCANNER_INTERFACE_CHOICES = (
    (SCANNER_INTERFACE_USB, 'USB'),
    (SCANNER_INTERFACE_BLUETOOTH, 'Bluetooth'),
    (SCANNER_INTERFACE_WIRELESS, 'Wireless'),
)

# In pos_terminal.py (add to POSTerminal model)
printer_type = models.CharField(
    max_length=20,
    choices=PRINTER_TYPE_CHOICES,
    default=PRINTER_TYPE_THERMAL
)
receipt_printer_ip = models.GenericIPAddressField(blank=True, null=True)
receipt_printer_port = models.PositiveIntegerField(default=9100, blank=True, null=True)
cash_drawer_enabled = models.BooleanField(default=True)
cash_drawer_auto_open = models.BooleanField(default=True)
barcode_scanner_enabled = models.BooleanField(default=True)
scanner_interface = models.CharField(
    max_length=20,
    choices=SCANNER_INTERFACE_CHOICES,
    default=SCANNER_INTERFACE_USB
)
```

### Verification Checklist
- [ ] Printer type constants defined in constants.py
- [ ] Seven hardware fields added to POSTerminal model
- [ ] GenericIPAddressField used for printer IP
- [ ] Default port set to 9100 for ESC/POS standard
- [ ] Boolean fields have appropriate defaults
- [ ] Scanner interface choices defined
- [ ] All fields have helpful help_text

---

## Task 07: Add terminal location fields

### Overview
Add fields to specify the physical or logical location of the terminal within the business premises. This helps with reporting, management, and customer service organization.

### Dependencies
- Task 06: Add terminal hardware fields

### Instructions

1. **Add location name field**
   - `location` field: CharField with max_length=100, blank=True, null=True
   - Add help_text for physical location description
   - Examples: "Checkout Counter 1", "Drive-Through", "Self-Checkout Area"

2. **Add floor/level field**
   - `floor` field: CharField with max_length=50, blank=True, null=True
   - Add help_text for floor or level information
   - Examples: "Ground Floor", "Level 2", "Food Court"

3. **Add section field**
   - `section` field: CharField with max_length=50, blank=True, null=True
   - Add help_text for section or area within location
   - Examples: "Electronics", "Grocery", "Fashion"

4. **Add is_mobile field**
   - `is_mobile` field: BooleanField with default=False
   - Add help_text indicating if terminal is mobile/portable
   - Useful for tablets or mobile POS devices

5. **Add IP address field**
   - `ip_address` field: GenericIPAddressField with blank=True, null=True
   - Add help_text for terminal device IP address
   - Used for network monitoring and troubleshooting

### Location Field Hierarchy

```
Warehouse/Store
    ├── Floor: "Ground Floor"
    │   ├── Section: "Electronics"
    │   │   ├── Location: "Checkout 1"
    │   │   │   └── Terminal: T01
    │   │   └── Location: "Checkout 2"
    │   │       └── Terminal: T02
    │   └── Section: "Grocery"
    │       └── Location: "Express Lane"
    │           └── Terminal: T03
    └── Floor: "Level 2"
        └── Section: "Food Court"
            └── Location: "Counter Service"
                └── Terminal: T04
```

### Mobile vs Fixed Terminal Comparison

| Feature | Fixed Terminal | Mobile Terminal |
|---------|---------------|-----------------|
| **Location** | Permanent counter/desk | Anywhere in store |
| **Hardware** | Desktop PC, large display | Tablet, smartphone |
| **Network** | Wired Ethernet | WiFi connection |
| **Use Cases** | Main checkout, service desk | Line busting, table service, field sales |
| **Cash Drawer** | Usually enabled | Usually disabled |
| **Printer** | Network/USB printer | Mobile Bluetooth printer or digital receipts |

### Location Examples by Business Type

| Business Type | Location Examples |
|---------------|-------------------|
| **Supermarket** | Checkout 1-10, Self-Checkout 1-4, Customer Service |
| **Restaurant** | Counter, Table Service Area, Bar, Drive-Through |
| **Retail Store** | Main Counter, Fitting Room Area, Manager Station |
| **Pharmacy** | Prescription Counter, OTC Counter, Drive-Through |

### Expected Outcome
```python
# In pos_terminal.py (add to POSTerminal model)
location = models.CharField(max_length=100, blank=True, null=True)
floor = models.CharField(max_length=50, blank=True, null=True)
section = models.CharField(max_length=50, blank=True, null=True)
is_mobile = models.BooleanField(default=False)
ip_address = models.GenericIPAddressField(blank=True, null=True)
```

### Verification Checklist
- [ ] Five location-related fields added to POSTerminal
- [ ] All location fields are optional (blank=True, null=True)
- [ ] `is_mobile` field is Boolean with False default
- [ ] IP address field uses GenericIPAddressField
- [ ] Fields support both IPv4 and IPv6 addresses
- [ ] Help text added for all fields

---

## Task 08: Add terminal settings

### Overview
Add operational settings fields that control terminal behavior, permissions, and business rules. These settings customize how the terminal operates for specific use cases or user roles.

### Dependencies
- Task 07: Add terminal location fields
- Phase-04: Tax model must exist

### Instructions

1. **Add default tax foreign key**
   - `default_tax` field: ForeignKey to Tax model
   - Set on_delete=models.SET_NULL with null=True, blank=True
   - Set related_name='pos_terminals_with_default_tax'
   - Add help_text explaining default tax application

2. **Add price override permission field**
   - `allow_price_override` field: BooleanField with default=False
   - Add help_text explaining if cashiers can modify prices
   - Security consideration for price integrity

3. **Add discount permission field**
   - `allow_discount` field: BooleanField with default=True
   - Add help_text for discount application permission
   - May be restricted in certain terminals

4. **Add maximum discount percentage field**
   - `max_discount_percent` field: DecimalField with max_digits=5, decimal_places=2
   - Set default=Decimal('100.00')
   - Add validators: MinValueValidator(0), MaxValueValidator(100)
   - Add help_text for maximum allowed discount

5. **Add customer requirement field**
   - `require_customer` field: BooleanField with default=False
   - Add help_text explaining if customer selection is mandatory
   - Important for B2B or membership-based businesses

6. **Add negative inventory permission field**
   - `allow_negative_inventory` field: BooleanField with default=False
   - Add help_text for selling out-of-stock items
   - Critical for inventory control

7. **Add receipt auto-print field**
   - `auto_print_receipt` field: BooleanField with default=True
   - Add help_text for automatic receipt printing
   - Can be disabled for email-only receipts

8. **Add receipt copies field**
   - `receipt_copies` field: PositiveSmallIntegerField with default=1
   - Add validators: MinValueValidator(1), MaxValueValidator(5)
   - Add help_text for number of receipt copies to print

9. **Add offline mode enabled field**
   - `offline_mode_enabled` field: BooleanField with default=False
   - Add help_text for offline transaction capability
   - Requires special sync mechanism

### Terminal Settings Configuration Matrix

| Setting Category | Field | Default | Business Impact |
|------------------|-------|---------|-----------------|
| **Pricing** | allow_price_override | False | Revenue protection |
| | allow_discount | True | Sales flexibility |
| | max_discount_percent | 100% | Loss prevention |
| **Tax** | default_tax | null | Tax calculation |
| **Customer** | require_customer | False | CRM data collection |
| **Inventory** | allow_negative_inventory | False | Stock control |
| **Receipt** | auto_print_receipt | True | Paper usage |
| | receipt_copies | 1 | Multi-copy needs |
| **Operations** | offline_mode_enabled | False | Network resilience |

### Price Override Security Levels

```
┌─────────────────────────────────────────┐
│         Security Level Matrix           │
├─────────────────────────────────────────┤
│ High Security (allow_price_override=F)  │
│   - Supermarkets                        │
│   - Franchises with strict pricing      │
│   - Tax-sensitive products              │
├─────────────────────────────────────────┤
│ Medium Security (limited discount only) │
│   - Retail stores with manager approval │
│   - Service businesses                  │
├─────────────────────────────────────────┤
│ Low Security (allow_price_override=T)   │
│   - Negotiation-based sales             │
│   - B2B wholesale                       │
│   - Market stalls                       │
└─────────────────────────────────────────┘
```

### Customer Requirement Use Cases

| Scenario | require_customer=True | Reason |
|----------|----------------------|---------|
| **B2B Sales** | Yes | Account tracking, credit terms |
| **Membership Store** | Yes | Member benefits, loyalty points |
| **Pharmacy** | Yes | Prescription tracking, insurance |
| **Restaurant** | No | Walk-in customers, quick service |
| **Retail** | No | Anonymous purchases allowed |

### Offline Mode Considerations

**When to Enable:**
- Unreliable internet connectivity
- Remote/rural locations
- Mobile POS in field sales
- Disaster recovery scenarios

**Requirements:**
- Local transaction cache
- Sync mechanism when online
- Conflict resolution strategy
- Security for cached data

### Expected Outcome
```python
# In pos_terminal.py (add to POSTerminal model)
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator

default_tax = models.ForeignKey(
    'taxes.Tax',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='pos_terminals_with_default_tax'
)
allow_price_override = models.BooleanField(default=False)
allow_discount = models.BooleanField(default=True)
max_discount_percent = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    default=Decimal('100.00'),
    validators=[MinValueValidator(0), MaxValueValidator(100)]
)
require_customer = models.BooleanField(default=False)
allow_negative_inventory = models.BooleanField(default=False)
auto_print_receipt = models.BooleanField(default=True)
receipt_copies = models.PositiveSmallIntegerField(
    default=1,
    validators=[MinValueValidator(1), MaxValueValidator(5)]
)
offline_mode_enabled = models.BooleanField(default=False)
```

### Verification Checklist
- [ ] Nine operational setting fields added
- [ ] default_tax FK uses SET_NULL on deletion
- [ ] max_discount_percent has proper validators
- [ ] receipt_copies limited to 1-5 range
- [ ] Decimal import added for max_discount_percent
- [ ] Validators imported from django.core.validators
- [ ] All Boolean fields have appropriate defaults
- [ ] Security implications documented in help_text

---

## Task 09: Add receipt template FK

### Overview
Add a foreign key relationship to a receipt template model that defines the layout and content of printed receipts. This allows customization of receipt appearance per terminal.

### Dependencies
- Task 08: Add terminal settings
- Phase-04 or Phase-05: ReceiptTemplate model should exist

### Instructions

1. **Add receipt template foreign key**
   - `receipt_template` field: ForeignKey to ReceiptTemplate model
   - Set on_delete=models.SET_NULL with null=True, blank=True
   - Set related_name='pos_terminals'
   - Add help_text explaining template customization

2. **Add receipt header text field (optional override)**
   - `receipt_header` field: TextField with blank=True, null=True
   - Add help_text for custom header text override
   - Overrides template header if provided

3. **Add receipt footer text field (optional override)**
   - `receipt_footer` field: TextField with blank=True, null=True
   - Add help_text for custom footer text override
   - Overrides template footer if provided

4. **Add receipt language field**
   - `receipt_language` field: CharField with max_length=10
   - Set choices: ENGLISH, SINHALA, TAMIL
   - Set default to `'en'`
   - Add help_text for receipt print language

### Receipt Template System Architecture

```
┌─────────────────────────────────────────────┐
│         Receipt Template Hierarchy          │
├─────────────────────────────────────────────┤
│                                             │
│  Company Default Template                   │
│         ├── Header: Logo, company info      │
│         ├── Body: Items, amounts            │
│         └── Footer: Thank you message       │
│              │                              │
│              ▼                              │
│  Terminal-Specific Template (optional)      │
│         ├── Custom header override          │
│         ├── Same body format                │
│         └── Custom footer override          │
│              │                              │
│              ▼                              │
│  Final Receipt Output                       │
│                                             │
└─────────────────────────────────────────────┘
```

### Receipt Language Support

| Language | Code | Character Set | Sri Lanka Context |
|----------|------|---------------|-------------------|
| **English** | `'en'` | Latin | Primary business language |
| **Sinhala** | `'si'` | Unicode Sinhala | Local language support |
| **Tamil** | `'ta'` | Unicode Tamil | Minority language support |

### Receipt Customization Levels

| Level | Configuration | Use Case |
|-------|---------------|----------|
| **Company-wide** | Default template for all terminals | Brand consistency |
| **Terminal-specific** | Custom template per terminal | Different locations/formats |
| **Terminal override** | Header/footer text only | Quick customization without template |
| **Transaction-specific** | Runtime customization | Special promotions, events |

### Receipt Template Elements

```
┌─────────────────────────────────────┐
│        COMPANY NAME & LOGO          │  ◄─── Header (customizable)
│     123 Main St, Colombo 00100      │
│        Tel: +94 11 234 5678         │
├─────────────────────────────────────┤
│  Date: 2026-01-23    Time: 14:30    │
│  Terminal: T01       Cashier: John  │
│  Invoice: INV-00123                 │
├─────────────────────────────────────┤
│  Item              Qty   Amount     │  ◄─── Body (template-defined)
│  Product 1          2    ₨ 500.00   │
│  Product 2          1    ₨ 250.00   │
│                                     │
│  Subtotal:              ₨ 750.00    │
│  Tax (8%):              ₨  60.00    │
│  Total:                 ₨ 810.00    │
├─────────────────────────────────────┤
│  Payment: Cash        ₨ 1,000.00    │
│  Change:              ₨   190.00    │
├─────────────────────────────────────┤
│     Thank you for shopping!         │  ◄─── Footer (customizable)
│    Visit us: www.example.lk         │
│  Customer Care: +94 77 123 4567     │
└─────────────────────────────────────┘
```

### Expected Outcome
```python
# In apps/pos/constants.py (add these)
RECEIPT_LANGUAGE_ENGLISH = 'en'
RECEIPT_LANGUAGE_SINHALA = 'si'
RECEIPT_LANGUAGE_TAMIL = 'ta'

RECEIPT_LANGUAGE_CHOICES = (
    (RECEIPT_LANGUAGE_ENGLISH, 'English'),
    (RECEIPT_LANGUAGE_SINHALA, 'Sinhala'),
    (RECEIPT_LANGUAGE_TAMIL, 'Tamil'),
)

# In pos_terminal.py (add to POSTerminal model)
receipt_template = models.ForeignKey(
    'templates.ReceiptTemplate',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='pos_terminals'
)
receipt_header = models.TextField(blank=True, null=True)
receipt_footer = models.TextField(blank=True, null=True)
receipt_language = models.CharField(
    max_length=10,
    choices=RECEIPT_LANGUAGE_CHOICES,
    default=RECEIPT_LANGUAGE_ENGLISH
)
```

### Verification Checklist
- [ ] receipt_template FK added with SET_NULL behavior
- [ ] receipt_header and receipt_footer text fields added
- [ ] receipt_language field with three choices
- [ ] Receipt language constants defined
- [ ] All receipt fields are optional
- [ ] Related name properly set for reverse queries
- [ ] Help text explains template vs override behavior

---

## Task 10: Create POSTerminal Meta class

### Overview
Add the Meta class to the POSTerminal model to configure database table settings, indexes for query optimization, default ordering, and other model-level options.

### Dependencies
- Task 09: Add receipt template FK

### Instructions

1. **Add Meta class to POSTerminal model**
   - Create nested `Meta` class inside POSTerminal model
   - Place it after all field definitions

2. **Set database table name**
   - Set `db_table = 'pos_terminals'`
   - Explicit table naming for clarity

3. **Set verbose names**
   - Set `verbose_name = 'POS Terminal'`
   - Set `verbose_name_plural = 'POS Terminals'`
   - Used in Django admin interface

4. **Set default ordering**
   - Set `ordering = ['warehouse', 'code']`
   - Terminals sorted by warehouse first, then by code

5. **Add indexes for query optimization**
   - Create index on `['code']` for fast terminal lookup
   - Create index on `['warehouse', 'status']` for active terminals per warehouse
   - Create index on `['status']` for filtering by terminal status
   - Create compound index on `['warehouse', 'is_mobile']` for mobile vs fixed queries

6. **Add unique constraints**
   - Add unique constraint on `['tenant', 'code']` to ensure unique terminal codes per tenant
   - Note: tenant field comes from BaseModel

7. **Add model permissions (optional)**
   - Consider adding custom permissions for terminal management
   - Examples: `can_open_terminal`, `can_close_terminal`, `can_configure_hardware`

### Database Index Strategy

| Index | Fields | Purpose | Query Type |
|-------|--------|---------|------------|
| **idx_terminal_code** | [code] | Fast terminal lookup | `POSTerminal.objects.get(code='T01')` |
| **idx_warehouse_status** | [warehouse, status] | Active terminals per warehouse | `warehouse.pos_terminals.filter(status='active')` |
| **idx_status** | [status] | Filter by status | `POSTerminal.objects.filter(status='active')` |
| **idx_warehouse_mobile** | [warehouse, is_mobile] | Mobile vs fixed terminals | `warehouse.pos_terminals.filter(is_mobile=True)` |

### Index Performance Impact

```
Without Index:
  Query: POSTerminal.objects.get(code='T01')
  Result: Full table scan - O(n) complexity
  Time: ~100ms for 1000 terminals

With Index:
  Query: POSTerminal.objects.get(code='T01')
  Result: Index lookup - O(log n) complexity
  Time: ~2ms for 1000 terminals

Performance Gain: 50x faster
```

### Multi-Tenancy Unique Constraint

```
┌──────────────────────────────────────────┐
│        Tenant Schema Isolation           │
├──────────────────────────────────────────┤
│  Tenant: ABC Store (Schema: tenant_abc) │
│    ├── Terminal: T01                     │
│    ├── Terminal: T02                     │
│    └── Terminal: T03                     │
├──────────────────────────────────────────┤
│  Tenant: XYZ Shop (Schema: tenant_xyz)  │
│    ├── Terminal: T01  ◄── Same code OK  │
│    ├── Terminal: T02                     │
│    └── Terminal: T04                     │
└──────────────────────────────────────────┘

Unique constraint: (tenant, code)
Allows T01 in both tenants without conflict
```

### Custom Permissions Example

| Permission | Code Name | Use Case |
|------------|-----------|----------|
| **Can manage terminals** | `manage_terminals` | Add/edit/delete terminals |
| **Can configure hardware** | `configure_hardware` | Change printer, scanner settings |
| **Can view all terminals** | `view_all_terminals` | Cross-warehouse terminal viewing |

### Expected Outcome
```python
# In pos_terminal.py (add Meta class to POSTerminal)

class POSTerminal(BaseModel):
    # ... all field definitions ...
    
    class Meta:
        db_table = 'pos_terminals'
        verbose_name = 'POS Terminal'
        verbose_name_plural = 'POS Terminals'
        ordering = ['warehouse', 'code']
        indexes = [
            models.Index(fields=['code'], name='idx_terminal_code'),
            models.Index(fields=['warehouse', 'status'], name='idx_warehouse_status'),
            models.Index(fields=['status'], name='idx_terminal_status'),
            models.Index(fields=['warehouse', 'is_mobile'], name='idx_warehouse_mobile'),
        ]
        unique_together = [['tenant', 'code']]
```

### Model Import Updates
```python
# Update __init__.py in apps/pos/terminal/models/
from .pos_terminal import POSTerminal

__all__ = ['POSTerminal']
```

### Verification Checklist
- [ ] Meta class added to POSTerminal model
- [ ] db_table explicitly set
- [ ] verbose_name and verbose_name_plural defined
- [ ] ordering set to warehouse, code
- [ ] Four indexes created for query optimization
- [ ] unique_together constraint added for tenant, code
- [ ] POSTerminal exported from models `__init__.py`
- [ ] Model ready for migration generation

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 06 | Add terminal hardware fields | Printer, cash drawer, scanner configuration |
| 07 | Add terminal location fields | Physical location tracking |
| 08 | Add terminal settings | Operational rules and permissions |
| 09 | Add receipt template FK | Receipt customization support |
| 10 | Create POSTerminal Meta class | Database optimization and table config |

### POSTerminal Model Complete Field List

| Category | Fields | Count |
|----------|--------|-------|
| **Identification** | name, code, description | 3 |
| **Associations** | warehouse, default_tax, receipt_template | 3 |
| **Status** | status | 1 |
| **Hardware** | printer_type, receipt_printer_ip, receipt_printer_port, cash_drawer_enabled, cash_drawer_auto_open, barcode_scanner_enabled, scanner_interface | 7 |
| **Location** | location, floor, section, is_mobile, ip_address | 5 |
| **Settings** | allow_price_override, allow_discount, max_discount_percent, require_customer, allow_negative_inventory, auto_print_receipt, receipt_copies, offline_mode_enabled | 8 |
| **Receipt** | receipt_header, receipt_footer, receipt_language | 3 |
| **From BaseModel** | id, tenant, created_at, updated_at, created_by, updated_by | 6 |
| **Total** | | **36 fields** |

### Migration Commands
```bash
# After completing all tasks in this document:
python manage.py makemigrations pos
python manage.py migrate pos
```

### Next Steps
Proceed to [03_Tasks-11-15_Session-Model-Fields.md](03_Tasks-11-15_Session-Model-Fields.md) to create:
- POSSession model for shift management
- Timing fields (opened_at, closed_at)
- Cash tracking fields (opening cash, closing cash)
- Session totals and variance calculation

---

## Notes for AI Agents

1. **Hardware Configuration:** These fields enable integration with physical devices; actual device drivers are handled separately
2. **Location Hierarchy:** location > floor > section provides flexible organization for multi-level stores
3. **Mobile Terminals:** is_mobile flag affects permissions, hardware requirements, and offline capabilities
4. **Price Security:** allow_price_override should be carefully controlled; consider requiring manager approval
5. **Tax Integration:** default_tax simplifies operations but can be overridden per transaction
6. **Receipt Templates:** Template system provides brand consistency while allowing per-terminal customization
7. **Indexes:** These indexes dramatically improve query performance in multi-terminal environments
8. **Unique Constraints:** tenant + code uniqueness is enforced at database level by django-tenants
9. **Sri Lanka Localization:** Receipt language support includes Sinhala and Tamil for local customers
