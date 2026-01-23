# Tasks 23-28: Receipt Builder - Items and Totals

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** B - Receipt Data Generation  
> **Document:** 02 of 03  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-22_Receipt-Model.md](01_Tasks-17-22_Receipt-Model.md)
- **→ Next Document:** [03_Tasks-29-34_Tax-Payments-Footer-QR.md](03_Tasks-29-34_Tax-Payments-Footer-QR.md)

---

## Document Overview

This document covers the creation of the ReceiptBuilder service class, which transforms cart/transaction data into structured receipt data. The builder implements methods for generating header, transaction info, items list, variant handling, and totals calculation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Create ReceiptBuilder service | Medium | 30 min |
| 24 | Implement build_header method | Medium | 25 min |
| 25 | Implement build_transaction_info | Medium | 25 min |
| 26 | Implement build_items method | Medium | 30 min |
| 27 | Handle variant display | Medium | 20 min |
| 28 | Implement build_totals method | Medium | 25 min |

---

## Task 23: Create ReceiptBuilder Service

### Overview
Create the ReceiptBuilder service class that orchestrates the generation of complete receipt data from a cart object. This service acts as the central coordinator for all receipt data building operations.

### Dependencies
- Receipt model exists (Task 17)
- POSCart model exists
- Service layer structure exists

### Instructions

1. **Create the service file structure**
   - Create `services/` directory in receipts app
   - Create `builder.py` file
   - Create `__init__.py` to export service

2. **Define ReceiptBuilder class**
   - Create class with cart as constructor parameter
   - Store cart reference
   - Store tenant reference
   - Initialize template reference

3. **Add initialization method**
   - Accept cart object
   - Validate cart is completed
   - Load receipt template
   - Initialize data structure

4. **Add main build method**
   - Orchestrate all build steps
   - Call individual section builders
   - Assemble complete receipt data
   - Return structured JSON

5. **Add validation method**
   - Validate cart state
   - Validate cart has items
   - Validate payment confirmation
   - Validate template exists

6. **Add error handling**
   - Handle missing cart data
   - Handle missing template
   - Handle calculation errors
   - Log errors with context

### ReceiptBuilder Architecture

**Class Structure:**
```
ReceiptBuilder
├── __init__(cart, template=None)
├── build() → dict
├── validate_cart() → bool
├── build_header() → dict
├── build_transaction_info() → dict
├── build_items() → list
├── build_totals() → dict
├── build_payments() → list
├── build_footer() → dict
└── build_qr_code() → dict
```

### Service Flow Diagram

```
┌────────────────────┐
│   POSCart          │
│   (Completed)      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  ReceiptBuilder    │
│  __init__(cart)    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  validate_cart()   │
│  Check cart state  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  build()           │
│  Orchestrate build │
└─────────┬──────────┘
          │
          ├───► build_header()
          ├───► build_transaction_info()
          ├───► build_items()
          ├───► build_totals()
          ├───► build_payments()
          ├───► build_footer()
          └───► build_qr_code()
          │
          ▼
┌────────────────────┐
│  Complete Receipt  │
│  Data (JSON)       │
└────────────────────┘
```

### Class Definition

**Basic Structure:**
```python
class ReceiptBuilder:
    """
    Service for building receipt data from cart transactions.
    
    Transforms cart data into structured receipt format
    for printing, display, and archival.
    """
    
    def __init__(self, cart, template=None):
        """
        Initialize receipt builder.
        
        Args:
            cart: POSCart instance (must be completed)
            template: ReceiptTemplate instance (optional)
        """
        self.cart = cart
        self.tenant = cart.tenant
        self.template = template or self._get_default_template()
        self.currency_symbol = "Rs."  # Sri Lankan Rupee
        
    def _get_default_template(self):
        """Get default receipt template for tenant"""
        # Implementation in Task 24
        pass
```

### Main Build Method

**Orchestration Logic:**
```python
def build(self):
    """
    Build complete receipt data from cart.
    
    Returns:
        dict: Complete receipt data structure
        
    Raises:
        ValidationError: If cart is invalid
        ReceiptBuildError: If build fails
    """
    # Validate cart
    self.validate_cart()
    
    # Build all sections
    receipt_data = {
        'schema_version': '1.0',
        'generated_at': timezone.now().isoformat(),
        'header': self.build_header(),
        'transaction': self.build_transaction_info(),
        'items': self.build_items(),
        'totals': self.build_totals(),
        'payments': self.build_payments(),
        'footer': self.build_footer(),
        'qr_code': self.build_qr_code(),
    }
    
    return receipt_data
```

### Build Flow Sequence

```
build() Called
    │
    ├─► 1. validate_cart()
    │      └─► Check cart state, items, payment
    │
    ├─► 2. build_header()
    │      └─► Business name, address, contact
    │
    ├─► 3. build_transaction_info()
    │      └─► Receipt #, date, time, cashier
    │
    ├─► 4. build_items()
    │      └─► Line items with prices
    │
    ├─► 5. build_totals()
    │      └─► Subtotal, tax, discounts, total
    │
    ├─► 6. build_payments()
    │      └─► Payment methods and amounts
    │
    ├─► 7. build_footer()
    │      └─► Thank you message, policies
    │
    └─► 8. build_qr_code()
           └─► QR code data for digital receipt
```

### Validation Method

**Cart Validation:**
```python
def validate_cart(self):
    """
    Validate cart is ready for receipt generation.
    
    Checks:
    - Cart exists and belongs to tenant
    - Cart is in COMPLETED status
    - Cart has at least one item
    - Payment is confirmed
    - All required data is present
    
    Raises:
        ValidationError: If validation fails
    """
    # Check cart status
    if self.cart.status != 'COMPLETED':
        raise ValidationError(
            f"Cart must be COMPLETED (current: {self.cart.status})"
        )
    
    # Check items exist
    if not self.cart.items.exists():
        raise ValidationError("Cart has no items")
    
    # Check payment
    if self.cart.payment_status != 'PAID':
        raise ValidationError(
            f"Payment not confirmed (status: {self.cart.payment_status})"
        )
    
    # Check totals are calculated
    if self.cart.grand_total is None or self.cart.grand_total <= 0:
        raise ValidationError("Cart total not calculated")
```

### Validation Checklist

| Check | Purpose | Error if Fails |
|-------|---------|----------------|
| Cart exists | Ensure cart object is valid | "Cart not found" |
| Tenant match | Security check | "Cart tenant mismatch" |
| Status COMPLETED | Cart workflow completed | "Cart not completed" |
| Has items | At least one item | "No items in cart" |
| Payment PAID | Payment confirmed | "Payment not confirmed" |
| Total > 0 | Valid transaction amount | "Invalid cart total" |
| Template exists | Receipt format available | "Template not found" |

### Error Handling

**Custom Exceptions:**
```python
class ReceiptBuildError(Exception):
    """Base exception for receipt building errors"""
    pass

class CartValidationError(ReceiptBuildError):
    """Cart validation failed"""
    pass

class TemplateMissingError(ReceiptBuildError):
    """Receipt template not found"""
    pass

class DataBuildError(ReceiptBuildError):
    """Error building receipt section"""
    pass
```

**Error Handling Pattern:**
```python
def build(self):
    """Build receipt with comprehensive error handling"""
    try:
        # Validate
        self.validate_cart()
        
        # Build
        receipt_data = self._build_receipt_data()
        
        return receipt_data
        
    except CartValidationError as e:
        logger.error(f"Cart validation failed: {e}", extra={
            'cart_id': self.cart.id,
            'tenant_id': self.tenant.id
        })
        raise
        
    except TemplateMissingError as e:
        logger.error(f"Template error: {e}", extra={
            'cart_id': self.cart.id,
            'tenant_id': self.tenant.id
        })
        raise
        
    except Exception as e:
        logger.exception(f"Unexpected error building receipt: {e}", extra={
            'cart_id': self.cart.id,
            'tenant_id': self.tenant.id
        })
        raise ReceiptBuildError(f"Failed to build receipt: {e}")
```

### Service Initialization

**Default Template Loading:**
```python
def _get_default_template(self):
    """
    Load default receipt template for tenant.
    
    Returns:
        ReceiptTemplate: Active default template
        
    Raises:
        TemplateMissingError: If no template found
    """
    from apps.pos.receipts.models import ReceiptTemplate
    
    template = ReceiptTemplate.objects.filter(
        is_active=True,
        is_default=True
    ).first()
    
    if not template:
        raise TemplateMissingError(
            "No active default receipt template found"
        )
    
    return template
```

### Usage Example

**Service Usage:**
```python
# Create receipt from cart
cart = POSCart.objects.get(id=cart_id)

# Initialize builder
builder = ReceiptBuilder(cart=cart)

# Build receipt data
try:
    receipt_data = builder.build()
    
    # Create receipt record
    receipt = Receipt.objects.create(
        cart=cart,
        receipt_type='SALE',
        generated_at=timezone.now(),
        receipt_data=receipt_data
    )
    
except CartValidationError as e:
    # Handle validation error
    return {'error': str(e)}
    
except ReceiptBuildError as e:
    # Handle build error
    return {'error': f'Failed to build receipt: {e}'}
```

### Service Directory Structure

```
apps/pos/receipts/
├── services/
│   ├── __init__.py              # Export ReceiptBuilder
│   ├── builder.py               # ReceiptBuilder class
│   ├── number_generator.py      # Task 33
│   └── exceptions.py            # Custom exceptions
```

### Expected Outcome

```python
# Service class created
class ReceiptBuilder:
    def __init__(self, cart, template=None): ...
    def build(self): ...
    def validate_cart(self): ...
    def build_header(self): ...
    def build_transaction_info(self): ...
    def build_items(self): ...
    def build_totals(self): ...
    def build_payments(self): ...
    def build_footer(self): ...
    def build_qr_code(self): ...

# Usage
builder = ReceiptBuilder(cart=cart)
receipt_data = builder.build()
```

### Verification Checklist
- [ ] `services/builder.py` file created
- [ ] ReceiptBuilder class defined
- [ ] `__init__` method accepts cart and template
- [ ] `build()` method orchestrates all sections
- [ ] `validate_cart()` method validates cart state
- [ ] Custom exceptions defined
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Service exported in `__init__.py`
- [ ] Usage pattern documented

---

## Task 24: Implement Build Header Method

### Overview
Implement the build_header() method that generates the header section of the receipt, including business name, address, contact information, VAT number, and custom header lines from the template.

### Dependencies
- Task 23: Create ReceiptBuilder service
- ReceiptTemplate model with header fields
- Tenant business information

### Instructions

1. **Implement build_header method**
   - Extract business info from tenant/template
   - Format address lines
   - Include contact information
   - Add VAT/tax registration number
   - Include custom header lines

2. **Add business name formatting**
   - Get business name from template or tenant
   - Support multi-language (English/Sinhala)
   - Apply character limits for thermal printer
   - Center alignment preparation

3. **Add address formatting**
   - Split address into multiple lines
   - Format for receipt width (40 chars)
   - Handle long addresses
   - Support multi-line display

4. **Add contact information**
   - Include phone number(s)
   - Include email (if available)
   - Include website (if available)
   - Format consistently

5. **Add tax registration**
   - Include VAT number
   - Include tax ID (TIN)
   - Format for Sri Lankan standards
   - Support optional display

6. **Add custom header lines**
   - Get custom lines from template
   - Support multiple custom lines
   - Preserve line order
   - Handle empty lines

### Header Data Structure

**Output Format:**
```json
{
  "header": {
    "business_name": "ABC Store",
    "business_name_sinhala": "ඒබීසී ගබඩාව",
    "address_line_1": "123 Main Street",
    "address_line_2": "Colombo 03",
    "address_line_3": "Sri Lanka",
    "phone": "011-2345678",
    "phone_secondary": "077-1234567",
    "email": "info@abcstore.lk",
    "website": "www.abcstore.lk",
    "vat_number": "VAT123456789",
    "tin_number": "TIN987654321",
    "custom_lines": [
      "Welcome to ABC Store",
      "Quality Products Since 1990",
      "Island-Wide Delivery Available"
    ]
  }
}
```

### Header Layout Diagram

```
┌────────────────────────────────────────┐
│            ABC STORE                   │ ← Business Name (centered)
│         ඒබීසී ගබඩාව                    │ ← Sinhala Name (optional)
│                                        │
│         123 Main Street                │ ← Address Line 1
│         Colombo 03                     │ ← Address Line 2
│         Sri Lanka                      │ ← Address Line 3
│                                        │
│    Tel: 011-2345678 / 077-1234567     │ ← Phone Numbers
│    Email: info@abcstore.lk            │ ← Email
│    Web: www.abcstore.lk               │ ← Website
│                                        │
│    VAT No: VAT123456789               │ ← VAT Number
│    TIN: TIN987654321                  │ ← TIN Number
│                                        │
│    Welcome to ABC Store               │ ← Custom Line 1
│    Quality Products Since 1990        │ ← Custom Line 2
│    Island-Wide Delivery Available     │ ← Custom Line 3
│                                        │
└────────────────────────────────────────┘
```

### Method Implementation

**Build Header Logic:**
```python
def build_header(self):
    """
    Build header section with business information.
    
    Returns:
        dict: Header data structure
    """
    header_data = {
        'business_name': self._get_business_name(),
        'business_name_sinhala': self._get_business_name_sinhala(),
    }
    
    # Add address
    address = self._format_address()
    header_data.update(address)
    
    # Add contact info
    contact = self._get_contact_info()
    header_data.update(contact)
    
    # Add tax registration
    tax_info = self._get_tax_registration()
    header_data.update(tax_info)
    
    # Add custom lines
    header_data['custom_lines'] = self._get_custom_header_lines()
    
    return header_data
```

### Business Name Extraction

**Get Business Name:**
```python
def _get_business_name(self):
    """
    Get business name from template or tenant.
    
    Priority:
    1. Template business_name (if set)
    2. Tenant business_name
    3. Fallback to tenant name
    
    Returns:
        str: Business name
    """
    # Check template first
    if self.template and self.template.business_name:
        return self.template.business_name
    
    # Check tenant business_name field
    if hasattr(self.tenant, 'business_name') and self.tenant.business_name:
        return self.tenant.business_name
    
    # Fallback to tenant name
    return self.tenant.name
```

**Get Sinhala Name:**
```python
def _get_business_name_sinhala(self):
    """
    Get business name in Sinhala (optional).
    
    Returns:
        str or None: Sinhala business name
    """
    if self.template and hasattr(self.template, 'business_name_sinhala'):
        return self.template.business_name_sinhala
    
    if hasattr(self.tenant, 'business_name_sinhala'):
        return self.tenant.business_name_sinhala
    
    return None
```

### Address Formatting

**Format Address:**
```python
def _format_address(self):
    """
    Format business address for receipt display.
    
    Returns:
        dict: Address lines
    """
    # Get address from template or tenant
    address_text = self._get_full_address()
    
    # Split into lines (max 3 lines recommended)
    lines = self._split_address_lines(address_text)
    
    return {
        'address_line_1': lines[0] if len(lines) > 0 else '',
        'address_line_2': lines[1] if len(lines) > 1 else '',
        'address_line_3': lines[2] if len(lines) > 2 else '',
    }

def _get_full_address(self):
    """Get complete address from template or tenant"""
    if self.template and self.template.address:
        return self.template.address
    
    # Build from tenant address fields
    parts = []
    if hasattr(self.tenant, 'address_line_1'):
        parts.append(self.tenant.address_line_1)
    if hasattr(self.tenant, 'address_line_2'):
        parts.append(self.tenant.address_line_2)
    if hasattr(self.tenant, 'city'):
        parts.append(self.tenant.city)
    
    return ', '.join(filter(None, parts))

def _split_address_lines(self, address_text, max_length=40):
    """
    Split address into multiple lines for receipt.
    
    Args:
        address_text: Full address string
        max_length: Maximum characters per line
        
    Returns:
        list: Address lines
    """
    if not address_text:
        return []
    
    # Simple split by commas first
    parts = [p.strip() for p in address_text.split(',')]
    
    lines = []
    current_line = ""
    
    for part in parts:
        if not current_line:
            current_line = part
        elif len(current_line) + len(part) + 2 <= max_length:
            current_line += ", " + part
        else:
            lines.append(current_line)
            current_line = part
    
    if current_line:
        lines.append(current_line)
    
    return lines[:3]  # Max 3 lines
```

### Contact Information

**Get Contact Info:**
```python
def _get_contact_info(self):
    """
    Get contact information for header.
    
    Returns:
        dict: Contact information
    """
    contact_data = {}
    
    # Phone number(s)
    phone = self._get_phone_number()
    if phone:
        contact_data['phone'] = phone
    
    phone_secondary = self._get_phone_secondary()
    if phone_secondary:
        contact_data['phone_secondary'] = phone_secondary
    
    # Email
    email = self._get_email()
    if email:
        contact_data['email'] = email
    
    # Website
    website = self._get_website()
    if website:
        contact_data['website'] = website
    
    return contact_data

def _get_phone_number(self):
    """Get primary phone number"""
    if self.template and self.template.phone:
        return self.template.phone
    
    if hasattr(self.tenant, 'phone'):
        return self.tenant.phone
    
    return None

def _get_phone_secondary(self):
    """Get secondary phone number (optional)"""
    if self.template and hasattr(self.template, 'phone_secondary'):
        return self.template.phone_secondary
    
    if hasattr(self.tenant, 'phone_secondary'):
        return self.tenant.phone_secondary
    
    return None

def _get_email(self):
    """Get email address"""
    if self.template and hasattr(self.template, 'email'):
        return self.template.email
    
    if hasattr(self.tenant, 'email'):
        return self.tenant.email
    
    return None

def _get_website(self):
    """Get website URL"""
    if self.template and hasattr(self.template, 'website'):
        return self.template.website
    
    if hasattr(self.tenant, 'website'):
        return self.tenant.website
    
    return None
```

### Tax Registration

**Get Tax Registration:**
```python
def _get_tax_registration(self):
    """
    Get tax registration numbers.
    
    Returns:
        dict: Tax registration info
    """
    tax_data = {}
    
    # VAT Number
    vat_number = self._get_vat_number()
    if vat_number:
        tax_data['vat_number'] = vat_number
    
    # TIN (Tax Identification Number)
    tin_number = self._get_tin_number()
    if tin_number:
        tax_data['tin_number'] = tin_number
    
    return tax_data

def _get_vat_number(self):
    """Get VAT registration number"""
    if self.template and hasattr(self.template, 'vat_number'):
        return self.template.vat_number
    
    if hasattr(self.tenant, 'vat_number'):
        return self.tenant.vat_number
    
    return None

def _get_tin_number(self):
    """Get Tax Identification Number (TIN)"""
    if self.template and hasattr(self.template, 'tin_number'):
        return self.template.tin_number
    
    if hasattr(self.tenant, 'tin_number'):
        return self.tenant.tin_number
    
    return None
```

### Custom Header Lines

**Get Custom Lines:**
```python
def _get_custom_header_lines(self):
    """
    Get custom header lines from template.
    
    Returns:
        list: Custom header lines
    """
    if not self.template:
        return []
    
    # Get header_lines from template
    if hasattr(self.template, 'header_lines'):
        lines = self.template.header_lines
        
        # If stored as JSON array
        if isinstance(lines, list):
            return [line for line in lines if line.strip()]
        
        # If stored as text with line breaks
        if isinstance(lines, str):
            return [
                line.strip() 
                for line in lines.split('\n') 
                if line.strip()
            ]
    
    return []
```

### Sri Lanka-Specific Formatting

**Phone Number Format:**
```
Sri Lankan phone formats:
- Landline: 011-2345678 (Colombo)
- Landline: 0XX-XXXXXXX (Other areas)
- Mobile: 077-1234567, 070-1234567, etc.
- International: +94-11-2345678

Formatting rules:
- Store with country code internally
- Display without +94 for local receipts
- Use hyphens for readability
```

**VAT Number Format:**
```
Sri Lankan VAT format:
- Format: VAT followed by 9 digits
- Example: VAT123456789
- Display: "VAT No: VAT123456789"
```

### Header Character Limits

**Thermal Printer Constraints:**

| Field | Max Length | Alignment |
|-------|------------|-----------|
| Business Name | 40 chars | Center |
| Address Line | 40 chars | Center |
| Phone | 40 chars | Center |
| Email | 40 chars | Center |
| Custom Line | 40 chars | Center/Left |

**Truncation Strategy:**
```python
def _truncate_line(self, text, max_length=40):
    """
    Truncate text to fit printer width.
    
    Args:
        text: Text to truncate
        max_length: Maximum characters
        
    Returns:
        str: Truncated text with ellipsis if needed
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length-3] + '...'
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_header(self):
    """Build header with business info"""
    # Implementation as described
    ...

# Example output
header = builder.build_header()
print(header)
# {
#   'business_name': 'ABC Store',
#   'address_line_1': '123 Main Street',
#   'address_line_2': 'Colombo 03',
#   'phone': '011-2345678',
#   'email': 'info@abcstore.lk',
#   'vat_number': 'VAT123456789',
#   'custom_lines': ['Welcome to ABC Store']
# }
```

### Verification Checklist
- [ ] build_header() method implemented
- [ ] Business name extraction working
- [ ] Sinhala name support added (optional)
- [ ] Address formatting splits into lines
- [ ] Phone number(s) included
- [ ] Email and website included (if available)
- [ ] VAT/TIN numbers included
- [ ] Custom header lines extracted from template
- [ ] Character limits respected (40 chars)
- [ ] Empty/null fields handled gracefully
- [ ] Sri Lankan formatting conventions followed

---

## Task 25: Implement Build Transaction Info Method

### Overview
Implement the build_transaction_info() method that generates transaction details for the receipt, including receipt number, date/time, cashier information, and terminal identification. This provides the unique identifier and context for each transaction.

### Dependencies
- Task 23: Create ReceiptBuilder service
- Task 33: Receipt number generator (will be called)
- User/cashier information available

### Instructions

1. **Implement build_transaction_info method**
   - Generate receipt number (call Task 33 generator)
   - Extract transaction date and time
   - Get cashier information
   - Get terminal/POS identification
   - Format all fields consistently

2. **Add date and time formatting**
   - Convert to business timezone (Asia/Colombo)
   - Format date for display (DD/MM/YYYY or YYYY-MM-DD)
   - Format time for display (24-hour format)
   - Support locale-specific formatting

3. **Add cashier information**
   - Get cashier name from cart/user
   - Get cashier ID/code
   - Handle anonymous/guest transactions
   - Format name for display

4. **Add terminal identification**
   - Get terminal ID from cart/session
   - Get POS device name
   - Format terminal identifier
   - Support multiple POS terminals

5. **Add transaction references**
   - Include transaction ID (if available)
   - Include order number (if different from receipt)
   - Include external references
   - Support lookup identifiers

### Transaction Info Data Structure

**Output Format:**
```json
{
  "transaction": {
    "receipt_number": "REC-20260122-00042",
    "date": "2026-01-22",
    "date_display": "22/01/2026",
    "time": "14:30:45",
    "time_display": "2:30 PM",
    "datetime_local": "2026-01-22 14:30:45",
    "cashier_name": "John Perera",
    "cashier_id": "CASH001",
    "terminal_id": "POS-01",
    "terminal_name": "Main Counter",
    "transaction_id": "abc-def-123-456",
    "order_number": "ORD-2026-00042"
  }
}
```

### Transaction Section Layout

```
┌────────────────────────────────────────┐
│    Receipt No: REC-20260122-00042     │ ← Receipt Number
│    Date: 22/01/2026    Time: 2:30 PM  │ ← Date & Time
│    Cashier: John Perera (CASH001)     │ ← Cashier Info
│    Terminal: POS-01                    │ ← Terminal ID
│                                        │
│    ════════════════════════════════    │ ← Separator
│                                        │
└────────────────────────────────────────┘
```

### Method Implementation

**Build Transaction Info:**
```python
def build_transaction_info(self):
    """
    Build transaction section with receipt details.
    
    Returns:
        dict: Transaction information
    """
    # Get current datetime in business timezone
    generated_at = self._get_business_timezone_datetime()
    
    transaction_data = {
        # Receipt number (Task 33 will generate this)
        'receipt_number': self._get_or_generate_receipt_number(),
        
        # Date fields
        'date': generated_at.strftime('%Y-%m-%d'),
        'date_display': generated_at.strftime('%d/%m/%Y'),
        
        # Time fields
        'time': generated_at.strftime('%H:%M:%S'),
        'time_display': generated_at.strftime('%-I:%M %p'),
        
        # Combined datetime
        'datetime_local': generated_at.strftime('%Y-%m-%d %H:%M:%S'),
        
        # Cashier info
        'cashier_name': self._get_cashier_name(),
        'cashier_id': self._get_cashier_id(),
        
        # Terminal info
        'terminal_id': self._get_terminal_id(),
        'terminal_name': self._get_terminal_name(),
    }
    
    # Optional fields
    transaction_id = self._get_transaction_id()
    if transaction_id:
        transaction_data['transaction_id'] = transaction_id
    
    order_number = self._get_order_number()
    if order_number:
        transaction_data['order_number'] = order_number
    
    return transaction_data
```

### Receipt Number Generation

**Get or Generate Receipt Number:**
```python
def _get_or_generate_receipt_number(self):
    """
    Get existing receipt number or generate new one.
    
    For new receipts: Generate using ReceiptNumberGenerator
    For duplicate receipts: Use original receipt number
    
    Returns:
        str: Receipt number
    """
    # If building duplicate, use original number
    if hasattr(self.cart, 'original_receipt'):
        return self.cart.original_receipt.receipt_number
    
    # Generate new receipt number (Task 33)
    from apps.pos.receipts.services import ReceiptNumberGenerator
    
    generator = ReceiptNumberGenerator(tenant=self.tenant)
    receipt_number = generator.generate()
    
    return receipt_number
```

**Receipt Number Format:**
```
Format: REC-YYYYMMDD-NNNNN

Components:
- Prefix: "REC"
- Date: YYYYMMDD (2026-01-22 → 20260122)
- Sequence: 5-digit daily counter (00001-99999)

Example: REC-20260122-00042

The actual generation logic is in Task 33.
```

### Date and Time Formatting

**Business Timezone Conversion:**
```python
def _get_business_timezone_datetime(self):
    """
    Get current datetime in business timezone.
    
    Returns:
        datetime: Timezone-aware datetime (Asia/Colombo)
    """
    from django.utils import timezone
    import pytz
    
    # Get current UTC time
    utc_now = timezone.now()
    
    # Convert to Sri Lanka timezone
    lk_tz = pytz.timezone('Asia/Colombo')
    local_time = utc_now.astimezone(lk_tz)
    
    return local_time
```

**Date Format Options:**

| Format | Pattern | Example | Use Case |
|--------|---------|---------|----------|
| ISO | %Y-%m-%d | 2026-01-22 | Database storage |
| Display | %d/%m/%Y | 22/01/2026 | Sri Lankan standard |
| Long | %d %B %Y | 22 January 2026 | Formal documents |
| Short | %d/%m/%y | 22/01/26 | Compact display |

**Time Format Options:**

| Format | Pattern | Example | Use Case |
|--------|---------|---------|----------|
| 24-hour | %H:%M:%S | 14:30:45 | Standard time |
| 12-hour | %-I:%M %p | 2:30 PM | Display time |
| Compact | %H:%M | 14:30 | Short format |

### Cashier Information

**Get Cashier Name:**
```python
def _get_cashier_name(self):
    """
    Get cashier name from cart.
    
    Priority:
    1. Cart.served_by (User)
    2. Cart.created_by (User)
    3. Default to "Cashier"
    
    Returns:
        str: Cashier name
    """
    # Check served_by field
    if hasattr(self.cart, 'served_by') and self.cart.served_by:
        user = self.cart.served_by
        return self._format_user_name(user)
    
    # Check created_by field
    if hasattr(self.cart, 'created_by') and self.cart.created_by:
        user = self.cart.created_by
        return self._format_user_name(user)
    
    # Default
    return "Cashier"

def _format_user_name(self, user):
    """
    Format user name for display.
    
    Args:
        user: User instance
        
    Returns:
        str: Formatted name
    """
    # Try full name
    if hasattr(user, 'get_full_name'):
        full_name = user.get_full_name()
        if full_name:
            return full_name
    
    # Try first and last name
    if user.first_name and user.last_name:
        return f"{user.first_name} {user.last_name}"
    
    # Try first name only
    if user.first_name:
        return user.first_name
    
    # Fallback to username
    return user.username
```

**Get Cashier ID:**
```python
def _get_cashier_id(self):
    """
    Get cashier ID/code.
    
    Returns:
        str: Cashier identifier
    """
    user = self._get_cashier_user()
    
    if not user:
        return "N/A"
    
    # Check employee_code field
    if hasattr(user, 'employee_code') and user.employee_code:
        return user.employee_code
    
    # Check staff_id field
    if hasattr(user, 'staff_id') and user.staff_id:
        return user.staff_id
    
    # Fallback to username
    return user.username

def _get_cashier_user(self):
    """Get the User object for cashier"""
    if hasattr(self.cart, 'served_by') and self.cart.served_by:
        return self.cart.served_by
    
    if hasattr(self.cart, 'created_by') and self.cart.created_by:
        return self.cart.created_by
    
    return None
```

### Terminal Identification

**Get Terminal ID:**
```python
def _get_terminal_id(self):
    """
    Get POS terminal identifier.
    
    Returns:
        str: Terminal ID
    """
    # Check cart terminal_id field
    if hasattr(self.cart, 'terminal_id') and self.cart.terminal_id:
        return self.cart.terminal_id
    
    # Check session terminal_id
    if hasattr(self.cart, 'session') and hasattr(self.cart.session, 'terminal_id'):
        return self.cart.session.terminal_id
    
    # Default
    return "POS-01"

def _get_terminal_name(self):
    """
    Get POS terminal name (optional).
    
    Returns:
        str or None: Terminal name
    """
    # Check cart terminal relationship
    if hasattr(self.cart, 'terminal') and self.cart.terminal:
        return self.cart.terminal.name
    
    # Check session terminal
    if hasattr(self.cart, 'session') and hasattr(self.cart.session, 'terminal'):
        return self.cart.session.terminal.name
    
    return None
```

**Terminal ID Format:**
```
Standard formats:
- POS-01, POS-02 (main counters)
- REG-01 (register number)
- MOBILE-01 (mobile POS)
- KIOSK-01 (self-service kiosk)

Examples:
- Single store: POS-01
- Multiple stores: COLOMBO-POS-01
- Mobile POS: MOBILE-JOHN-01
```

### Transaction and Order References

**Get Transaction ID:**
```python
def _get_transaction_id(self):
    """
    Get transaction ID (optional).
    
    Returns:
        str or None: Transaction ID
    """
    # From cart
    if hasattr(self.cart, 'transaction_id') and self.cart.transaction_id:
        return str(self.cart.transaction_id)
    
    # From payment
    if hasattr(self.cart, 'payment') and hasattr(self.cart.payment, 'transaction_id'):
        return str(self.cart.payment.transaction_id)
    
    return None

def _get_order_number(self):
    """
    Get order number if different from receipt number.
    
    Returns:
        str or None: Order number
    """
    # Check cart order_number field
    if hasattr(self.cart, 'order_number') and self.cart.order_number:
        return self.cart.order_number
    
    return None
```

### Sri Lanka-Specific Considerations

**Date Format Preference:**
```
Sri Lankan businesses typically use:
- DD/MM/YYYY format (22/01/2026)
- 24-hour time format (14:30)
- Asia/Colombo timezone (UTC+5:30)

Consider:
- No daylight saving time in Sri Lanka
- Consistent UTC+5:30 offset year-round
```

**Name Formatting:**
```
Sri Lankan names:
- Full name: "John Perera"
- Initials: "J.P. Silva"
- Single name: "Kumara"

Handle:
- Long names (truncate if needed)
- Special characters (Sinhala/Tamil names in English)
- Honorifics (Mr., Mrs., optional)
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_transaction_info(self):
    """Build transaction details"""
    # Implementation as described
    ...

# Example output
transaction = builder.build_transaction_info()
print(transaction)
# {
#   'receipt_number': 'REC-20260122-00042',
#   'date': '2026-01-22',
#   'date_display': '22/01/2026',
#   'time': '14:30:45',
#   'time_display': '2:30 PM',
#   'cashier_name': 'John Perera',
#   'cashier_id': 'CASH001',
#   'terminal_id': 'POS-01',
#   'terminal_name': 'Main Counter'
# }
```

### Verification Checklist
- [ ] build_transaction_info() method implemented
- [ ] Receipt number generation integrated (calls Task 33)
- [ ] Date formatting in DD/MM/YYYY format
- [ ] Time formatting in 24-hour and 12-hour formats
- [ ] Timezone conversion to Asia/Colombo
- [ ] Cashier name extraction working
- [ ] Cashier ID/code included
- [ ] Terminal ID extraction working
- [ ] Terminal name included (if available)
- [ ] Transaction ID included (optional)
- [ ] Order number included (optional)
- [ ] Handles missing/null values gracefully

---

## Task 26: Implement Build Items Method

### Overview
Implement the build_items() method that generates the itemized list of products in the transaction. This method extracts cart items, formats them with quantities, prices, discounts, and calculates line totals for receipt display.

### Dependencies
- Task 23: Create ReceiptBuilder service
- POSCartItem model with product relationships
- Product variant handling (Task 27)

### Instructions

1. **Implement build_items method**
   - Query all items from cart
   - Sort items by line number or creation order
   - Format each item for receipt display
   - Calculate line totals
   - Handle empty cart scenario

2. **Add item data extraction**
   - Extract SKU/product code
   - Extract product name
   - Extract variant information (Task 27)
   - Extract quantity
   - Extract unit price
   - Extract discount (if any)

3. **Add price calculations**
   - Calculate line subtotal (qty × unit price)
   - Calculate discount amount
   - Calculate line total (subtotal - discount)
   - Calculate tax per line (if applicable)
   - Round amounts appropriately

4. **Add item formatting**
   - Format product name (truncate if needed)
   - Format SKU for display
   - Format quantities (decimal handling)
   - Format prices with currency symbol
   - Format discount display

5. **Add line numbering**
   - Assign sequential line numbers
   - Start from 1
   - Maintain order
   - Support gaps if items deleted

6. **Add special cases handling**
   - Handle bundle items
   - Handle promotional items
   - Handle free items (zero price)
   - Handle negative quantities (returns)

### Items Data Structure

**Output Format:**
```json
{
  "items": [
    {
      "line_number": 1,
      "sku": "PROD-001",
      "name": "Wireless Mouse",
      "variant_display": "Black",
      "quantity": 2,
      "quantity_display": "2",
      "unit_price": 1500.00,
      "unit_price_display": "Rs. 1,500.00",
      "discount": 100.00,
      "discount_display": "Rs. 100.00",
      "discount_percent": 6.67,
      "line_total": 2900.00,
      "line_total_display": "Rs. 2,900.00",
      "tax_rate": 15.0,
      "tax_amount": 378.26,
      "is_promotional": false,
      "is_free": false
    },
    {
      "line_number": 2,
      "sku": "PROD-002-LG-BLU",
      "name": "T-Shirt",
      "variant_display": "Large / Blue",
      "quantity": 1,
      "quantity_display": "1",
      "unit_price": 2500.00,
      "unit_price_display": "Rs. 2,500.00",
      "discount": 0.00,
      "discount_display": null,
      "discount_percent": 0.0,
      "line_total": 2500.00,
      "line_total_display": "Rs. 2,500.00",
      "tax_rate": 15.0,
      "tax_amount": 326.09,
      "is_promotional": false,
      "is_free": false
    }
  ]
}
```

### Items Section Layout

```
┌────────────────────────────────────────┐
│    ITEMS                               │
│    ════════════════════════════════    │
│                                        │
│ 1. Wireless Mouse (Black)             │ ← Item with variant
│    SKU: PROD-001                       │ ← SKU
│    2 × Rs. 1,500.00      Rs. 3,000.00 │ ← Qty × Price = Subtotal
│    Discount:             -Rs. 100.00  │ ← Discount (if any)
│    Line Total:            Rs. 2,900.00│ ← Line Total
│                                        │
│ 2. T-Shirt (Large / Blue)             │
│    SKU: PROD-002-LG-BLU                │
│    1 × Rs. 2,500.00      Rs. 2,500.00 │
│                                        │
│    ────────────────────────────────    │
│                                        │
└────────────────────────────────────────┘
```

### Method Implementation

**Build Items List:**
```python
def build_items(self):
    """
    Build items list from cart items.
    
    Returns:
        list: List of item dictionaries
    """
    items_data = []
    
    # Get all cart items
    cart_items = self.cart.items.select_related(
        'product',
        'product_variant'
    ).order_by('created_at')  # Or 'line_number' if field exists
    
    # Check if cart has items
    if not cart_items.exists():
        raise DataBuildError("Cart has no items")
    
    # Build each item
    for index, cart_item in enumerate(cart_items, start=1):
        item_data = self._build_item_data(cart_item, line_number=index)
        items_data.append(item_data)
    
    return items_data
```

**Build Single Item Data:**
```python
def _build_item_data(self, cart_item, line_number):
    """
    Build data for single cart item.
    
    Args:
        cart_item: POSCartItem instance
        line_number: Sequential line number
        
    Returns:
        dict: Item data
    """
    product = cart_item.product
    variant = cart_item.product_variant
    
    # Basic item info
    item_data = {
        'line_number': line_number,
        'sku': self._get_item_sku(product, variant),
        'name': self._get_item_name(product),
        'variant_display': self._get_variant_display(variant),  # Task 27
    }
    
    # Quantity
    item_data.update({
        'quantity': float(cart_item.quantity),
        'quantity_display': self._format_quantity(cart_item.quantity),
    })
    
    # Prices
    unit_price = cart_item.unit_price or Decimal('0.00')
    discount = cart_item.discount or Decimal('0.00')
    line_total = cart_item.line_total or Decimal('0.00')
    
    item_data.update({
        'unit_price': float(unit_price),
        'unit_price_display': self._format_currency(unit_price),
        'discount': float(discount),
        'discount_display': self._format_currency(discount) if discount > 0 else None,
        'discount_percent': self._calculate_discount_percent(unit_price, discount, cart_item.quantity),
        'line_total': float(line_total),
        'line_total_display': self._format_currency(line_total),
    })
    
    # Tax info
    tax_rate = cart_item.tax_rate or Decimal('0.00')
    tax_amount = cart_item.tax_amount or Decimal('0.00')
    
    item_data.update({
        'tax_rate': float(tax_rate),
        'tax_amount': float(tax_amount),
    })
    
    # Special flags
    item_data.update({
        'is_promotional': cart_item.is_promotional if hasattr(cart_item, 'is_promotional') else False,
        'is_free': unit_price == 0,
    })
    
    return item_data
```

### Item Data Extraction

**Get Item SKU:**
```python
def _get_item_sku(self, product, variant=None):
    """
    Get SKU for item (product or variant).
    
    Args:
        product: Product instance
        variant: ProductVariant instance (optional)
        
    Returns:
        str: SKU
    """
    # Use variant SKU if exists
    if variant and hasattr(variant, 'sku') and variant.sku:
        return variant.sku
    
    # Use product SKU
    if hasattr(product, 'sku') and product.sku:
        return product.sku
    
    # Fallback to product code
    if hasattr(product, 'code') and product.code:
        return product.code
    
    # Last resort: product ID
    return f"PROD-{product.id}"
```

**Get Item Name:**
```python
def _get_item_name(self, product):
    """
    Get product name for receipt.
    
    Args:
        product: Product instance
        
    Returns:
        str: Product name
    """
    name = product.name
    
    # Truncate if too long (max 30 chars for item name)
    max_length = 30
    if len(name) > max_length:
        name = name[:max_length-3] + '...'
    
    return name
```

### Price Calculations

**Calculate Discount Percent:**
```python
def _calculate_discount_percent(self, unit_price, discount, quantity):
    """
    Calculate discount percentage.
    
    Args:
        unit_price: Unit price (Decimal)
        discount: Total discount (Decimal)
        quantity: Quantity (Decimal)
        
    Returns:
        float: Discount percentage
    """
    if unit_price <= 0 or quantity <= 0:
        return 0.0
    
    # Calculate subtotal
    subtotal = unit_price * quantity
    
    if subtotal <= 0:
        return 0.0
    
    # Calculate percentage
    percent = (discount / subtotal) * 100
    
    # Round to 2 decimal places
    return round(percent, 2)
```

**Calculate Line Total:**
```python
# Note: Line total should already be calculated in cart_item
# This is verification logic

def _verify_line_total(self, cart_item):
    """
    Verify line total calculation.
    
    Args:
        cart_item: POSCartItem instance
        
    Returns:
        Decimal: Calculated line total
    """
    unit_price = cart_item.unit_price or Decimal('0.00')
    quantity = cart_item.quantity or Decimal('1.00')
    discount = cart_item.discount or Decimal('0.00')
    
    # Calculate: (qty × price) - discount
    subtotal = unit_price * quantity
    line_total = subtotal - discount
    
    return line_total
```

### Formatting Methods

**Format Quantity:**
```python
def _format_quantity(self, quantity):
    """
    Format quantity for display.
    
    Args:
        quantity: Quantity (Decimal or float)
        
    Returns:
        str: Formatted quantity
    """
    # Remove trailing zeros and decimal point if whole number
    quantity_decimal = Decimal(str(quantity))
    
    if quantity_decimal == quantity_decimal.to_integral():
        # Whole number
        return str(int(quantity_decimal))
    else:
        # Decimal number (max 2 decimal places)
        return f"{quantity_decimal:.2f}".rstrip('0').rstrip('.')
```

**Format Currency:**
```python
def _format_currency(self, amount):
    """
    Format amount as currency for Sri Lanka.
    
    Args:
        amount: Amount (Decimal or float)
        
    Returns:
        str: Formatted currency string
    """
    if amount is None:
        return "Rs. 0.00"
    
    # Convert to Decimal
    amount_decimal = Decimal(str(amount))
    
    # Format with 2 decimal places and thousands separator
    formatted = f"{amount_decimal:,.2f}"
    
    # Add currency symbol
    return f"Rs. {formatted}"
```

**Formatting Examples:**

| Value | Formatted Output |
|-------|------------------|
| 1500 | Rs. 1,500.00 |
| 1500.50 | Rs. 1,500.50 |
| 999999 | Rs. 999,999.00 |
| 0.99 | Rs. 0.99 |
| 0 | Rs. 0.00 |

### Special Cases Handling

**Free Items:**
```python
def _is_free_item(self, cart_item):
    """
    Check if item is free (promotional/gift).
    
    Args:
        cart_item: POSCartItem instance
        
    Returns:
        bool: True if free
    """
    unit_price = cart_item.unit_price or Decimal('0.00')
    return unit_price == 0
```

**Promotional Items:**
```python
def _is_promotional_item(self, cart_item):
    """
    Check if item is on promotion.
    
    Args:
        cart_item: POSCartItem instance
        
    Returns:
        bool: True if promotional
    """
    # Check promotional flag
    if hasattr(cart_item, 'is_promotional'):
        return cart_item.is_promotional
    
    # Check if discount > 0
    if cart_item.discount and cart_item.discount > 0:
        return True
    
    return False
```

**Bundle Items:**
```python
def _is_bundle_item(self, cart_item):
    """
    Check if item is part of bundle.
    
    Args:
        cart_item: POSCartItem instance
        
    Returns:
        bool: True if bundle item
    """
    if hasattr(cart_item, 'bundle_id') and cart_item.bundle_id:
        return True
    
    if hasattr(cart_item, 'is_bundle_item') and cart_item.is_bundle_item:
        return True
    
    return False
```

### Item Display Variations

**Compact Format:**
```
1. Wireless Mouse (Black)
   2 × Rs. 1,500.00 = Rs. 3,000.00
   Disc: -Rs. 100.00
   Total: Rs. 2,900.00
```

**Standard Format:**
```
1. Wireless Mouse
   Variant: Black
   SKU: PROD-001
   Qty: 2 @ Rs. 1,500.00 = Rs. 3,000.00
   Discount: Rs. 100.00
   Line Total: Rs. 2,900.00
```

**Minimal Format:**
```
1. Wireless Mouse (Black) - 2 × Rs. 1,500.00 = Rs. 2,900.00
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_items(self):
    """Build items list"""
    # Implementation as described
    ...

# Example output
items = builder.build_items()
print(items)
# [
#   {
#     'line_number': 1,
#     'sku': 'PROD-001',
#     'name': 'Wireless Mouse',
#     'variant_display': 'Black',
#     'quantity': 2.0,
#     'unit_price': 1500.00,
#     'discount': 100.00,
#     'line_total': 2900.00,
#     ...
#   },
#   ...
# ]
```

### Verification Checklist
- [ ] build_items() method implemented
- [ ] Cart items queried with select_related
- [ ] Items sorted in correct order
- [ ] Line numbers assigned sequentially
- [ ] SKU extraction working
- [ ] Product name extraction and formatting
- [ ] Variant display integrated (Task 27)
- [ ] Quantity formatting correct (no trailing zeros)
- [ ] Unit price formatting with currency
- [ ] Discount calculation and formatting
- [ ] Line total calculation correct
- [ ] Tax rate and amount included
- [ ] Special flags set (is_promotional, is_free)
- [ ] Empty cart handled with error
- [ ] Long product names truncated

---

## Task 27: Handle Variant Display

### Overview
Implement variant display logic that shows product variations (size, color, etc.) in a clear, readable format on receipts. This task enhances the build_items() method to properly format variant information.

### Dependencies
- Task 26: Implement build_items method
- ProductVariant model with attribute values
- Variant attribute structure

### Instructions

1. **Implement variant display method**
   - Extract variant attributes (size, color, etc.)
   - Format attributes for display
   - Handle single and multiple attributes
   - Handle missing variants
   - Handle custom separators

2. **Add attribute extraction**
   - Get size attribute (if exists)
   - Get color attribute (if exists)
   - Get other attributes (material, style, etc.)
   - Handle attribute order
   - Handle null/empty attributes

3. **Add display formatting**
   - Format single attribute: "Large"
   - Format multiple attributes: "Large / Blue"
   - Use readable separators (slash with spaces)
   - Handle long attribute names
   - Truncate if necessary

4. **Add fallback handling**
   - Handle products without variants
   - Handle variants without attributes
   - Return empty/null for no variants
   - Don't show redundant info

5. **Add Sri Lanka-specific considerations**
   - Support Sinhala attribute names
   - Support bilingual display (optional)
   - Format for thermal printer width

### Variant Display Formats

**Display Examples:**

| Variant Attributes | Display Format |
|-------------------|----------------|
| Size: Large | "Large" |
| Color: Blue | "Blue" |
| Size: Large, Color: Blue | "Large / Blue" |
| Size: M, Color: Red, Material: Cotton | "M / Red / Cotton" |
| No variant | null or "" |
| Variant with no attributes | null or "" |

### Variant Display Method

**Main Implementation:**
```python
def _get_variant_display(self, variant):
    """
    Get formatted variant display string.
    
    Args:
        variant: ProductVariant instance or None
        
    Returns:
        str or None: Formatted variant display (e.g., "Large / Blue")
    """
    # No variant
    if not variant:
        return None
    
    # Get attribute values
    attributes = self._extract_variant_attributes(variant)
    
    # No attributes
    if not attributes:
        return None
    
    # Format display string
    display = self._format_variant_attributes(attributes)
    
    return display
```

### Attribute Extraction

**Extract Attributes:**
```python
def _extract_variant_attributes(self, variant):
    """
    Extract variant attribute values in order.
    
    Args:
        variant: ProductVariant instance
        
    Returns:
        list: List of attribute values (strings)
    """
    attributes = []
    
    # Method 1: Direct fields (if variant has direct size/color fields)
    if hasattr(variant, 'size') and variant.size:
        attributes.append(str(variant.size))
    
    if hasattr(variant, 'color') and variant.color:
        attributes.append(str(variant.color))
    
    # Method 2: Attribute relationships (if variant has attribute_values)
    if hasattr(variant, 'attribute_values'):
        attribute_values = variant.attribute_values.select_related(
            'attribute'
        ).order_by('attribute__display_order', 'attribute__name')
        
        for attr_value in attribute_values:
            if attr_value.value:
                attributes.append(str(attr_value.value))
    
    # Method 3: JSON field (if variant has attributes JSON field)
    if hasattr(variant, 'attributes') and variant.attributes:
        if isinstance(variant.attributes, dict):
            # Extract values in order
            for key in ['size', 'color', 'material', 'style']:
                if key in variant.attributes and variant.attributes[key]:
                    attributes.append(str(variant.attributes[key]))
    
    return attributes
```

### Variant Attribute Models

**Common Variant Structures:**

**Structure 1: Direct Fields**
```python
class ProductVariant(models.Model):
    product = ForeignKey(Product)
    size = CharField(max_length=20, null=True)
    color = CharField(max_length=50, null=True)
    sku = CharField(max_length=50, unique=True)
```

**Structure 2: Attribute Values**
```python
class ProductVariant(models.Model):
    product = ForeignKey(Product)
    sku = CharField(max_length=50, unique=True)
    
class VariantAttribute(models.Model):
    name = CharField(max_length=50)  # "Size", "Color"
    display_order = IntegerField()
    
class VariantAttributeValue(models.Model):
    variant = ForeignKey(ProductVariant, related_name='attribute_values')
    attribute = ForeignKey(VariantAttribute)
    value = CharField(max_length=100)  # "Large", "Blue"
```

**Structure 3: JSON Field**
```python
class ProductVariant(models.Model):
    product = ForeignKey(Product)
    sku = CharField(max_length=50, unique=True)
    attributes = JSONField(default=dict)
    # attributes = {"size": "Large", "color": "Blue"}
```

### Format Variant Attributes

**Format Display String:**
```python
def _format_variant_attributes(self, attributes):
    """
    Format attribute values into display string.
    
    Args:
        attributes: List of attribute values
        
    Returns:
        str: Formatted display (e.g., "Large / Blue")
    """
    if not attributes:
        return None
    
    # Join with separator
    separator = " / "
    display = separator.join(attributes)
    
    # Truncate if too long (max 30 chars for variants)
    max_length = 30
    if len(display) > max_length:
        display = display[:max_length-3] + '...'
    
    return display
```

**Formatting Rules:**

| Rule | Example | Reason |
|------|---------|--------|
| Separator | " / " | Clear visual separation |
| Order | Size, Color, Material | Logical ordering |
| Capitalization | "Large / Blue" | Consistent casing |
| Spacing | " / " not "/" | Readability |
| Max Length | 30 chars | Thermal printer width |

### Display Integration

**Integrate in Item Name:**

**Option 1: Separate Line**
```
Wireless Mouse
Black
```

**Option 2: Inline (Recommended)**
```
Wireless Mouse (Black)
```

**Option 3: After SKU**
```
Wireless Mouse
SKU: PROD-001-BLK (Black)
```

**Implementation in build_items():**
```python
def _build_item_data(self, cart_item, line_number):
    """Build item with variant display"""
    product = cart_item.product
    variant = cart_item.product_variant
    
    # Get base name
    name = self._get_item_name(product)
    
    # Get variant display
    variant_display = self._get_variant_display(variant)
    
    # Format name with variant
    if variant_display:
        # Option 1: Inline parentheses
        full_name = f"{name} ({variant_display})"
        
        # Store both
        item_data = {
            'name': name,
            'variant_display': variant_display,
            'full_name': full_name,  # For display
        }
    else:
        item_data = {
            'name': name,
            'variant_display': None,
            'full_name': name,
        }
    
    return item_data
```

### Bilingual Support (Optional)

**Sinhala Attribute Display:**
```python
def _get_variant_display_bilingual(self, variant):
    """
    Get bilingual variant display (English and Sinhala).
    
    Args:
        variant: ProductVariant instance
        
    Returns:
        dict: Display in both languages
    """
    display = {
        'english': self._get_variant_display(variant),
        'sinhala': self._get_variant_display_sinhala(variant),
    }
    
    return display

def _get_variant_display_sinhala(self, variant):
    """
    Get Sinhala variant display.
    
    Note: Requires Sinhala attribute translations
    """
    # Implementation would extract Sinhala attribute values
    # if they exist in the variant model
    pass
```

**Bilingual Display Example:**
```
Product Name
Size: Large / ලොකු
Color: Blue / නිල්
```

### Variant Display on Receipt

**Compact Receipt Format:**
```
┌────────────────────────────────────────┐
│ 1. T-Shirt (Large / Blue)             │
│    SKU: PROD-002-LG-BLU                │
│    1 × Rs. 2,500.00      Rs. 2,500.00 │
│                                        │
│ 2. Shoes (Size 42 / Black)            │
│    SKU: PROD-003-42-BLK                │
│    1 × Rs. 4,500.00      Rs. 4,500.00 │
└────────────────────────────────────────┘
```

**Detailed Receipt Format:**
```
┌────────────────────────────────────────┐
│ 1. T-Shirt                             │
│    Variant: Large / Blue               │
│    SKU: PROD-002-LG-BLU                │
│    1 × Rs. 2,500.00      Rs. 2,500.00 │
└────────────────────────────────────────┘
```

### Edge Cases

**Handle Edge Cases:**

| Case | Handling | Display |
|------|----------|---------|
| No variant | Return None | "Product Name" |
| Variant but no attributes | Return None | "Product Name" |
| Single attribute | Show single | "Product Name (Large)" |
| Many attributes (4+) | Show first 2-3 | "Large / Blue / ..." |
| Long attribute value | Truncate | "Extra Extra... / Blue" |
| Duplicate attributes | Deduplicate | "Large / Blue" not "Large / Large" |

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def _get_variant_display(self, variant):
    """Get formatted variant display"""
    # Implementation as described
    ...

# Example outputs
variant1 = _get_variant_display(variant_large_blue)
# Output: "Large / Blue"

variant2 = _get_variant_display(variant_size_only)
# Output: "XL"

variant3 = _get_variant_display(None)
# Output: None

# Integration in item
item_data = {
    'name': 'T-Shirt',
    'variant_display': 'Large / Blue',
    'full_name': 'T-Shirt (Large / Blue)'
}
```

### Verification Checklist
- [ ] _get_variant_display() method implemented
- [ ] Handles None/null variants
- [ ] Extracts size attribute
- [ ] Extracts color attribute
- [ ] Extracts other attributes
- [ ] Formats single attribute correctly
- [ ] Formats multiple attributes with " / "
- [ ] Truncates long displays (>30 chars)
- [ ] Returns None for variants without attributes
- [ ] Integrates with build_items() method
- [ ] Works with different variant model structures
- [ ] Handles missing attribute values

---

## Task 28: Implement Build Totals Method

### Overview
Implement the build_totals() method that generates the summary section of the receipt, including subtotal, discounts, tax amounts, and grand total. This provides the financial summary of the transaction.

### Dependencies
- Task 23: Create ReceiptBuilder service
- Task 26: Implement build_items method
- Cart total calculations

### Instructions

1. **Implement build_totals method**
   - Extract subtotal from cart
   - Extract total discounts
   - Extract tax totals
   - Calculate grand total
   - Format all amounts for display

2. **Add subtotal calculation**
   - Sum of all line totals before discount
   - Or use cart.subtotal if available
   - Exclude tax from subtotal
   - Format with currency

3. **Add discount calculation**
   - Sum all line-level discounts
   - Add cart-level discounts (if any)
   - Calculate discount percentage
   - Show discount breakdown if multiple types

4. **Add tax calculation**
   - Extract tax total from cart
   - Support multiple tax rates (Task 29)
   - Calculate taxable amount
   - Format tax display

5. **Add grand total**
   - Final amount customer pays
   - Include all taxes
   - Include all discounts
   - Should match cart.grand_total

6. **Add amount formatting**
   - Format all amounts with currency symbol
   - Use thousands separator
   - Two decimal places
   - Align amounts for readability

### Totals Data Structure

**Output Format:**
```json
{
  "totals": {
    "subtotal": 5400.00,
    "subtotal_display": "Rs. 5,400.00",
    "discount_total": 100.00,
    "discount_display": "Rs. 100.00",
    "discount_percent": 1.85,
    "taxable_amount": 5300.00,
    "taxable_amount_display": "Rs. 5,300.00",
    "tax_total": 691.30,
    "tax_display": "Rs. 691.30",
    "tax_rate": 15.0,
    "grand_total": 5991.30,
    "grand_total_display": "Rs. 5,991.30",
    "amount_saved": 100.00,
    "amount_saved_display": "Rs. 100.00"
  }
}
```

### Totals Section Layout

```
┌────────────────────────────────────────┐
│    ────────────────────────────────    │
│                                        │
│    Subtotal:              Rs. 5,400.00│ ← Before discounts/tax
│    Discount:              -Rs. 100.00 │ ← Total discounts
│    ────────────────────────────────    │
│    Taxable Amount:        Rs. 5,300.00│ ← Amount subject to tax
│    VAT (15%):             Rs. 691.30  │ ← Tax amount
│    ────────────────────────────────    │
│    TOTAL:                 Rs. 5,991.30│ ← Grand total
│                                        │
│    You Saved:             Rs. 100.00  │ ← Optional
│                                        │
└────────────────────────────────────────┘
```

### Method Implementation

**Build Totals:**
```python
def build_totals(self):
    """
    Build totals section with financial summary.
    
    Returns:
        dict: Totals data structure
    """
    # Extract amounts from cart
    subtotal = self.cart.subtotal or Decimal('0.00')
    discount_total = self.cart.discount_total or Decimal('0.00')
    tax_total = self.cart.tax_total or Decimal('0.00')
    grand_total = self.cart.grand_total or Decimal('0.00')
    
    # Calculate taxable amount (after discounts, before tax)
    taxable_amount = subtotal - discount_total
    
    # Get average tax rate (for display)
    tax_rate = self._calculate_average_tax_rate(taxable_amount, tax_total)
    
    # Calculate discount percentage
    discount_percent = self._calculate_total_discount_percent(subtotal, discount_total)
    
    totals_data = {
        # Subtotal
        'subtotal': float(subtotal),
        'subtotal_display': self._format_currency(subtotal),
        
        # Discounts
        'discount_total': float(discount_total),
        'discount_display': self._format_currency(discount_total) if discount_total > 0 else None,
        'discount_percent': discount_percent,
        
        # Taxable amount
        'taxable_amount': float(taxable_amount),
        'taxable_amount_display': self._format_currency(taxable_amount),
        
        # Tax
        'tax_total': float(tax_total),
        'tax_display': self._format_currency(tax_total),
        'tax_rate': float(tax_rate),
        
        # Grand total
        'grand_total': float(grand_total),
        'grand_total_display': self._format_currency(grand_total),
    }
    
    # Optional: Amount saved
    if discount_total > 0:
        totals_data['amount_saved'] = float(discount_total)
        totals_data['amount_saved_display'] = self._format_currency(discount_total)
    
    return totals_data
```

### Calculation Methods

**Calculate Average Tax Rate:**
```python
def _calculate_average_tax_rate(self, taxable_amount, tax_total):
    """
    Calculate average tax rate from amounts.
    
    Args:
        taxable_amount: Amount before tax (Decimal)
        tax_total: Total tax (Decimal)
        
    Returns:
        float: Average tax rate percentage
    """
    if taxable_amount <= 0:
        return 0.0
    
    # Calculate: (tax / taxable) × 100
    rate = (tax_total / taxable_amount) * 100
    
    # Round to 1 decimal place
    return round(float(rate), 1)
```

**Calculate Total Discount Percent:**
```python
def _calculate_total_discount_percent(self, subtotal, discount_total):
    """
    Calculate total discount percentage.
    
    Args:
        subtotal: Subtotal before discounts (Decimal)
        discount_total: Total discounts (Decimal)
        
    Returns:
        float: Discount percentage
    """
    if subtotal <= 0:
        return 0.0
    
    # Calculate: (discount / subtotal) × 100
    percent = (discount_total / subtotal) * 100
    
    # Round to 2 decimal places
    return round(float(percent), 2)
```

### Totals Calculation Flow

```
Cart Items → Line Totals
    │
    ├─► Sum Line Totals = SUBTOTAL (Rs. 5,400.00)
    │
    ├─► Sum Line Discounts = DISCOUNT TOTAL (Rs. 100.00)
    │
    ├─► SUBTOTAL - DISCOUNT = TAXABLE AMOUNT (Rs. 5,300.00)
    │
    ├─► TAXABLE × Tax Rate = TAX TOTAL (Rs. 691.30)
    │
    └─► TAXABLE + TAX = GRAND TOTAL (Rs. 5,991.30)
```

**Formula Breakdown:**

```
Subtotal = Σ(item.unit_price × item.quantity)
         = Rs. 5,400.00

Discount Total = Σ(item.discount) + cart.discount
               = Rs. 100.00

Taxable Amount = Subtotal - Discount Total
               = Rs. 5,400.00 - Rs. 100.00
               = Rs. 5,300.00

Tax Total = Taxable Amount × Tax Rate
          = Rs. 5,300.00 × 15%
          = Rs. 691.30 (rounded)

Grand Total = Taxable Amount + Tax Total
            = Rs. 5,300.00 + Rs. 691.30
            = Rs. 5,991.30
```

### Discount Handling

**Types of Discounts:**

| Type | Source | Calculation |
|------|--------|-------------|
| Line Discount | Item-level | Applied to individual items |
| Cart Discount | Cart-level | Applied to entire cart |
| Coupon Discount | Promotion code | Applied to cart or specific items |
| Member Discount | Loyalty program | Percentage or fixed amount |

**Discount Aggregation:**
```python
def _calculate_total_discounts(self):
    """
    Calculate total discounts from all sources.
    
    Returns:
        Decimal: Total discount amount
    """
    # Line-level discounts (already in subtotal calculation)
    line_discounts = sum(
        item.discount or Decimal('0.00')
        for item in self.cart.items.all()
    )
    
    # Cart-level discount
    cart_discount = self.cart.cart_discount or Decimal('0.00')
    
    # Coupon discount
    coupon_discount = Decimal('0.00')
    if hasattr(self.cart, 'applied_coupon') and self.cart.applied_coupon:
        coupon_discount = self.cart.applied_coupon.discount_amount or Decimal('0.00')
    
    # Total
    total_discounts = line_discounts + cart_discount + coupon_discount
    
    return total_discounts
```

### Tax Calculation

**Single Tax Rate (Sri Lanka VAT):**
```python
# Sri Lankan VAT: 15% (as of 2024)
# Applied to taxable goods and services

def _calculate_tax(self, taxable_amount):
    """
    Calculate VAT (15%).
    
    Args:
        taxable_amount: Amount before tax (Decimal)
        
    Returns:
        Decimal: Tax amount
    """
    vat_rate = Decimal('0.15')  # 15%
    
    tax_amount = taxable_amount * vat_rate
    
    # Round to 2 decimal places
    tax_amount = tax_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    return tax_amount
```

**Tax-Exempt Items:**
```python
def _calculate_taxable_amount(self):
    """
    Calculate amount subject to tax.
    
    Some items may be tax-exempt.
    
    Returns:
        Decimal: Taxable amount
    """
    taxable = Decimal('0.00')
    
    for item in self.cart.items.all():
        # Check if item is taxable
        is_taxable = True
        if hasattr(item.product, 'is_tax_exempt'):
            is_taxable = not item.product.is_tax_exempt
        
        if is_taxable:
            line_total = item.line_total or Decimal('0.00')
            taxable += line_total
    
    return taxable
```

### Display Formatting

**Amount Alignment:**
```
Subtotal:              Rs. 5,400.00
Discount:              -Rs. 100.00
────────────────────────────────────
Taxable Amount:        Rs. 5,300.00
VAT (15%):             Rs. 691.30
────────────────────────────────────
TOTAL:                 Rs. 5,991.30

Formatting rules:
- Labels: Left-aligned
- Amounts: Right-aligned
- Negative amounts: Prefix with "-"
- Separator lines: "─" character
- Emphasis: CAPS or bold for total
```

### Verification Logic

**Verify Totals Match:**
```python
def _verify_totals(self):
    """
    Verify calculated totals match cart totals.
    
    Raises:
        DataBuildError: If totals don't match
    """
    # Calculated grand total
    calculated = self.cart.subtotal - self.cart.discount_total + self.cart.tax_total
    
    # Cart's grand total
    cart_total = self.cart.grand_total
    
    # Allow 0.01 difference due to rounding
    difference = abs(calculated - cart_total)
    
    if difference > Decimal('0.01'):
        raise DataBuildError(
            f"Total mismatch: calculated={calculated}, cart={cart_total}"
        )
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_totals(self):
    """Build totals summary"""
    # Implementation as described
    ...

# Example output
totals = builder.build_totals()
print(totals)
# {
#   'subtotal': 5400.00,
#   'subtotal_display': 'Rs. 5,400.00',
#   'discount_total': 100.00,
#   'discount_display': 'Rs. 100.00',
#   'discount_percent': 1.85,
#   'taxable_amount': 5300.00,
#   'tax_total': 691.30,
#   'tax_rate': 15.0,
#   'grand_total': 5991.30,
#   'grand_total_display': 'Rs. 5,991.30'
# }
```

### Verification Checklist
- [ ] build_totals() method implemented
- [ ] Subtotal extracted from cart
- [ ] Discount total calculated correctly
- [ ] Discount percentage calculated
- [ ] Taxable amount calculated (subtotal - discount)
- [ ] Tax total extracted from cart
- [ ] Average tax rate calculated
- [ ] Grand total matches cart.grand_total
- [ ] All amounts formatted with currency
- [ ] Negative discounts displayed with "-"
- [ ] Optional "amount_saved" included
- [ ] Totals verification logic implemented
- [ ] Handles zero amounts gracefully

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 23 | Create ReceiptBuilder service | ReceiptBuilder class with orchestration |
| 24 | Implement build_header method | Business info header generation |
| 25 | Implement build_transaction_info | Receipt number, date, cashier info |
| 26 | Implement build_items method | Itemized list with prices |
| 27 | Handle variant display | Size/Color formatting ("Large / Blue") |
| 28 | Implement build_totals method | Subtotal, tax, discount, total summary |

### ReceiptBuilder Structure
```python
class ReceiptBuilder:
    def __init__(self, cart, template=None)
    def build() → Complete receipt data
    def validate_cart()
    def build_header() → Header with business info
    def build_transaction_info() → Receipt #, date, cashier
    def build_items() → Item list with variants
    def build_totals() → Financial summary
    # Tasks 29-32 will add:
    # - build_payments()
    # - build_footer()
    # - build_qr_code()
```

### Receipt Data Flow
```
Cart Data
    ↓
ReceiptBuilder.build()
    ├── validate_cart()
    ├── build_header() → Business name, address, VAT #
    ├── build_transaction_info() → Receipt #, date, time, cashier
    ├── build_items() → Items with variants and prices
    ├── build_totals() → Subtotal, discount, tax, total
    ├── build_payments() → Payment methods (Task 30)
    ├── build_footer() → Thank you message (Task 31)
    └── build_qr_code() → QR code data (Task 32)
    ↓
Complete Receipt JSON
    ↓
Save to Receipt.receipt_data
```

### Next Steps
1. **Proceed to Document 03** - [03_Tasks-29-34_Tax-Payments-Footer-QR.md](03_Tasks-29-34_Tax-Payments-Footer-QR.md)
2. **Implement remaining builder methods:**
   - Task 29: Tax breakdown
   - Task 30: Payments
   - Task 31: Footer
   - Task 32: QR code
3. **Implement receipt number generator** (Task 33)
4. **Implement duplicate receipt handling** (Task 34)

---

## Notes for AI Agents

1. **Service Pattern:** ReceiptBuilder follows service layer pattern - business logic separated from models
2. **Data Extraction:** All data extracted from cart and related objects, not database queries inside loops
3. **Formatting:** Currency and display formatting separated from data values for flexibility
4. **Validation:** Cart validation happens before building to fail fast
5. **Error Handling:** Custom exceptions for different error types
6. **Timezone:** All timestamps converted to Asia/Colombo for Sri Lankan businesses
7. **Variant Display:** Flexible to handle different variant model structures
8. **Tax Calculation:** Assumes 15% VAT but supports different rates
9. **Testing:** Each method should be unit-testable with mock cart data
10. **Performance:** Use select_related() to avoid N+1 queries when loading items
