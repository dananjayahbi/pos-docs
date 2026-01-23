# Tasks 29-34: Tax, Payments, Footer, and QR Code

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** B - Receipt Data Generation  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-23-28_Builder-Items-Totals.md](02_Tasks-23-28_Builder-Items-Totals.md)
- **→ Next Group:** [../Group-C_Thermal-Printer-Integration/](../Group-C_Thermal-Printer-Integration/)

---

## Document Overview

This document covers the final components of the ReceiptBuilder service: tax breakdown for compliance, payment methods display, footer generation with policies, QR code generation for digital receipts, receipt number generation, and duplicate receipt handling.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Implement tax breakdown | Medium | 20 min |
| 30 | Implement build_payments method | Medium | 25 min |
| 31 | Implement build_footer method | Medium | 20 min |
| 32 | Implement build_qr_code | Medium | 25 min |
| 33 | Create receipt number generator | Medium | 25 min |
| 34 | Add duplicate receipt handling | Medium | 20 min |

---

## Task 29: Implement Tax Breakdown

### Overview
Implement the tax breakdown functionality that separates and displays different tax components on the receipt. For Sri Lanka, this primarily means showing VAT details separately for tax compliance and customer transparency.

### Dependencies
- Task 28: Implement build_totals method
- Cart tax calculation logic
- Sri Lankan VAT requirements

### Instructions

1. **Add tax breakdown to build_totals**
   - Extract tax breakdown from cart
   - Support multiple tax rates (if applicable)
   - Calculate taxable amount per rate
   - Calculate tax amount per rate
   - Format for receipt display

2. **Implement VAT breakdown**
   - Show VAT rate (15% in Sri Lanka)
   - Show taxable amount
   - Show VAT amount
   - Include VAT registration number
   - Format according to Sri Lankan standards

3. **Handle multiple tax rates**
   - Support scenarios with different rates
   - Group by tax rate
   - Show breakdown for each rate
   - Sum to match total tax

4. **Add tax-exempt item handling**
   - Identify tax-exempt items
   - Calculate exempt amount
   - Display separate line if applicable
   - Document exemption rules

5. **Format for compliance**
   - Follow Sri Lankan receipt requirements
   - Include all mandatory tax information
   - Ensure calculations are transparent
   - Support audit requirements

### Tax Breakdown Data Structure

**Output Format:**
```json
{
  "totals": {
    "subtotal": 5300.00,
    "discount_total": 100.00,
    "taxable_amount": 5300.00,
    "tax_total": 691.30,
    "grand_total": 5991.30,
    "tax_breakdown": [
      {
        "tax_name": "VAT",
        "tax_rate": 15.0,
        "tax_rate_display": "15%",
        "taxable_amount": 5300.00,
        "taxable_amount_display": "Rs. 5,300.00",
        "tax_amount": 691.30,
        "tax_amount_display": "Rs. 691.30"
      }
    ],
    "vat_number": "VAT123456789",
    "tax_exempt_amount": 0.00
  }
}
```

### Tax Breakdown Layout

```
┌────────────────────────────────────────┐
│    ────────────────────────────────    │
│                                        │
│    Subtotal:              Rs. 5,400.00│
│    Discount:              -Rs. 100.00 │
│    ────────────────────────────────    │
│    Taxable Amount:        Rs. 5,300.00│
│                                        │
│    TAX BREAKDOWN:                      │
│    VAT (15%):             Rs. 691.30  │
│    Taxable: Rs. 5,300.00              │
│    VAT No: VAT123456789               │
│    ────────────────────────────────    │
│    TOTAL:                 Rs. 5,991.30│
│                                        │
└────────────────────────────────────────┘
```

### Implementation

**Enhanced build_totals with Tax Breakdown:**
```python
def build_totals(self):
    """
    Build totals section with tax breakdown.
    
    Returns:
        dict: Totals data with tax breakdown
    """
    # Basic totals (from Task 28)
    totals_data = {
        'subtotal': float(self.cart.subtotal),
        'subtotal_display': self._format_currency(self.cart.subtotal),
        'discount_total': float(self.cart.discount_total),
        'discount_display': self._format_currency(self.cart.discount_total),
        'taxable_amount': float(self.cart.taxable_amount),
        'taxable_amount_display': self._format_currency(self.cart.taxable_amount),
        'tax_total': float(self.cart.tax_total),
        'tax_display': self._format_currency(self.cart.tax_total),
        'grand_total': float(self.cart.grand_total),
        'grand_total_display': self._format_currency(self.cart.grand_total),
    }
    
    # Add tax breakdown
    totals_data['tax_breakdown'] = self._build_tax_breakdown()
    
    # Add VAT number
    vat_number = self._get_vat_number()
    if vat_number:
        totals_data['vat_number'] = vat_number
    
    # Add tax-exempt amount if any
    tax_exempt = self._calculate_tax_exempt_amount()
    if tax_exempt > 0:
        totals_data['tax_exempt_amount'] = float(tax_exempt)
        totals_data['tax_exempt_display'] = self._format_currency(tax_exempt)
    
    return totals_data
```

### Build Tax Breakdown

**Tax Breakdown Method:**
```python
def _build_tax_breakdown(self):
    """
    Build detailed tax breakdown.
    
    Returns:
        list: List of tax breakdown entries
    """
    breakdown = []
    
    # Method 1: Single VAT rate (most common in Sri Lanka)
    if self._has_single_tax_rate():
        vat_entry = self._build_vat_entry()
        breakdown.append(vat_entry)
    
    # Method 2: Multiple tax rates (if cart supports)
    else:
        # Group items by tax rate
        tax_groups = self._group_items_by_tax_rate()
        
        for rate, items_data in tax_groups.items():
            tax_entry = self._build_tax_entry(rate, items_data)
            breakdown.append(tax_entry)
    
    return breakdown
```

**Build VAT Entry (Single Rate):**
```python
def _build_vat_entry(self):
    """
    Build VAT entry for single-rate scenario.
    
    Returns:
        dict: VAT breakdown entry
    """
    # Sri Lankan VAT rate: 15%
    vat_rate = Decimal('15.00')
    
    # Get amounts from cart
    taxable_amount = self.cart.taxable_amount or Decimal('0.00')
    tax_amount = self.cart.tax_total or Decimal('0.00')
    
    vat_entry = {
        'tax_name': 'VAT',
        'tax_rate': float(vat_rate),
        'tax_rate_display': f"{vat_rate}%",
        'taxable_amount': float(taxable_amount),
        'taxable_amount_display': self._format_currency(taxable_amount),
        'tax_amount': float(tax_amount),
        'tax_amount_display': self._format_currency(tax_amount),
    }
    
    return vat_entry
```

**Group Items by Tax Rate:**
```python
def _group_items_by_tax_rate(self):
    """
    Group cart items by tax rate.
    
    Returns:
        dict: {tax_rate: {'taxable': amount, 'tax': amount}}
    """
    tax_groups = {}
    
    for item in self.cart.items.all():
        # Get tax rate for item
        rate = item.tax_rate or Decimal('0.00')
        
        # Initialize group if not exists
        if rate not in tax_groups:
            tax_groups[rate] = {
                'taxable': Decimal('0.00'),
                'tax': Decimal('0.00'),
            }
        
        # Add to group
        line_total = item.line_total or Decimal('0.00')
        tax_amount = item.tax_amount or Decimal('0.00')
        
        tax_groups[rate]['taxable'] += line_total
        tax_groups[rate]['tax'] += tax_amount
    
    return tax_groups

def _build_tax_entry(self, rate, items_data):
    """
    Build tax entry for specific rate.
    
    Args:
        rate: Tax rate (Decimal)
        items_data: Dict with 'taxable' and 'tax' amounts
        
    Returns:
        dict: Tax breakdown entry
    """
    taxable = items_data['taxable']
    tax = items_data['tax']
    
    # Determine tax name
    if rate == Decimal('15.00'):
        tax_name = 'VAT'
    elif rate == Decimal('0.00'):
        tax_name = 'Tax Exempt'
    else:
        tax_name = f'Tax ({rate}%)'
    
    tax_entry = {
        'tax_name': tax_name,
        'tax_rate': float(rate),
        'tax_rate_display': f"{rate}%",
        'taxable_amount': float(taxable),
        'taxable_amount_display': self._format_currency(taxable),
        'tax_amount': float(tax),
        'tax_amount_display': self._format_currency(tax),
    }
    
    return tax_entry
```

### Sri Lankan VAT Requirements

**VAT Display Requirements:**

| Requirement | Implementation |
|-------------|----------------|
| VAT Rate | Show "15%" or "VAT (15%)" |
| Taxable Amount | Show amount before VAT |
| VAT Amount | Show calculated VAT |
| VAT Number | Show business VAT registration number |
| Calculation | Must be transparent and verifiable |

**VAT Number Display:**
```python
def _get_vat_number(self):
    """
    Get VAT registration number.
    
    Returns:
        str or None: VAT number
    """
    # From template
    if self.template and hasattr(self.template, 'vat_number'):
        return self.template.vat_number
    
    # From tenant
    if hasattr(self.tenant, 'vat_number') and self.tenant.vat_number:
        return self.tenant.vat_number
    
    return None
```

### Tax-Exempt Items

**Calculate Tax-Exempt Amount:**
```python
def _calculate_tax_exempt_amount(self):
    """
    Calculate total amount of tax-exempt items.
    
    Returns:
        Decimal: Tax-exempt amount
    """
    exempt_total = Decimal('0.00')
    
    for item in self.cart.items.all():
        # Check if item is tax-exempt
        is_exempt = False
        
        if hasattr(item, 'is_tax_exempt'):
            is_exempt = item.is_tax_exempt
        elif hasattr(item.product, 'is_tax_exempt'):
            is_exempt = item.product.is_tax_exempt
        
        # Add to exempt total
        if is_exempt:
            line_total = item.line_total or Decimal('0.00')
            exempt_total += line_total
    
    return exempt_total
```

**Tax-Exempt Categories (Sri Lanka):**
```
Common tax-exempt items:
- Essential food items (rice, bread, milk)
- Educational materials (books, stationery)
- Medical supplies (medicines, equipment)
- Agricultural inputs (seeds, fertilizer)

Note: Exemption rules may change. Consult
Sri Lankan tax regulations for current list.
```

### Tax Breakdown Display Formats

**Compact Format:**
```
VAT (15%): Rs. 691.30
```

**Standard Format:**
```
Tax Breakdown:
VAT (15%): Rs. 691.30
Taxable: Rs. 5,300.00
```

**Detailed Format:**
```
Tax Breakdown:
─────────────────────────
VAT Rate: 15%
Taxable Amount: Rs. 5,300.00
VAT Amount: Rs. 691.30
VAT No: VAT123456789
```

**Multiple Rates Format:**
```
Tax Breakdown:
─────────────────────────
VAT (15%): Rs. 652.17
  Taxable: Rs. 4,347.83
Tax Exempt: Rs. 952.17
─────────────────────────
Total Tax: Rs. 652.17
```

### Verification

**Verify Tax Calculations:**
```python
def _verify_tax_breakdown(self, breakdown):
    """
    Verify tax breakdown sums correctly.
    
    Args:
        breakdown: List of tax entries
        
    Returns:
        bool: True if valid
        
    Raises:
        DataBuildError: If breakdown doesn't sum correctly
    """
    # Sum tax amounts from breakdown
    breakdown_total = sum(
        Decimal(str(entry['tax_amount']))
        for entry in breakdown
    )
    
    # Compare with cart tax total
    cart_tax_total = self.cart.tax_total or Decimal('0.00')
    
    # Allow 0.01 difference for rounding
    difference = abs(breakdown_total - cart_tax_total)
    
    if difference > Decimal('0.01'):
        raise DataBuildError(
            f"Tax breakdown mismatch: breakdown={breakdown_total}, "
            f"cart={cart_tax_total}"
        )
    
    return True
```

### Expected Outcome

```python
# Tax breakdown added to totals
totals = builder.build_totals()
print(totals['tax_breakdown'])
# [
#   {
#     'tax_name': 'VAT',
#     'tax_rate': 15.0,
#     'tax_rate_display': '15%',
#     'taxable_amount': 5300.00,
#     'taxable_amount_display': 'Rs. 5,300.00',
#     'tax_amount': 691.30,
#     'tax_amount_display': 'Rs. 691.30'
#   }
# ]
```

### Verification Checklist
- [ ] _build_tax_breakdown() method implemented
- [ ] Single VAT rate (15%) handling
- [ ] Multiple tax rates support (if needed)
- [ ] Tax-exempt items calculation
- [ ] VAT number included in totals
- [ ] Tax breakdown sums to tax_total
- [ ] All amounts formatted with currency
- [ ] Tax rate displayed as percentage
- [ ] Verification method implemented
- [ ] Follows Sri Lankan VAT display requirements

---

## Task 30: Implement Build Payments Method

### Overview
Implement the build_payments() method that generates the payment information section of the receipt, showing payment methods used, amounts, references, and change given (if applicable).

### Dependencies
- Task 23: Create ReceiptBuilder service
- Cart payment information
- Payment method models

### Instructions

1. **Implement build_payments method**
   - Extract payment records from cart
   - Get payment method names
   - Get payment amounts
   - Get payment references
   - Calculate change given
   - Format for display

2. **Handle single payment**
   - Most common scenario
   - Show payment method
   - Show amount paid
   - Show change (if cash)
   - Show reference (if card/digital)

3. **Handle split payments**
   - Multiple payment methods
   - Show each payment separately
   - Sum to match grand total
   - Show change from cash portion

4. **Add payment method formatting**
   - Format method names (CASH, CARD, etc.)
   - Add payment icons/indicators
   - Show last 4 digits for cards
   - Show transaction IDs

5. **Add Sri Lanka-specific methods**
   - Cash (LKR)
   - Card (Visa, Mastercard, AMEX)
   - Digital wallets (FriendsPay, eZ Cash)
   - Bank transfers
   - Mobile payments

### Payments Data Structure

**Output Format:**
```json
{
  "payments": [
    {
      "method": "CASH",
      "method_display": "Cash",
      "amount": 6000.00,
      "amount_display": "Rs. 6,000.00",
      "reference": null,
      "change": 8.70,
      "change_display": "Rs. 8.70"
    }
  ],
  "total_paid": 6000.00,
  "total_paid_display": "Rs. 6,000.00",
  "amount_due": 0.00,
  "change_due": 8.70,
  "change_due_display": "Rs. 8.70"
}
```

**Split Payment Example:**
```json
{
  "payments": [
    {
      "method": "CASH",
      "method_display": "Cash",
      "amount": 3000.00,
      "amount_display": "Rs. 3,000.00",
      "reference": null,
      "change": 0.00
    },
    {
      "method": "CARD",
      "method_display": "Visa Card ****1234",
      "amount": 2991.30,
      "amount_display": "Rs. 2,991.30",
      "reference": "TXN-ABC123456",
      "change": 0.00
    }
  ],
  "total_paid": 5991.30,
  "total_paid_display": "Rs. 5,991.30",
  "amount_due": 0.00,
  "change_due": 0.00
}
```

### Payments Section Layout

**Single Payment:**
```
┌────────────────────────────────────────┐
│    PAYMENT                             │
│    ────────────────────────────────    │
│                                        │
│    Cash:                  Rs. 6,000.00│
│    Change:                Rs. 8.70    │
│                                        │
└────────────────────────────────────────┘
```

**Split Payment:**
```
┌────────────────────────────────────────┐
│    PAYMENT                             │
│    ────────────────────────────────    │
│                                        │
│    Cash:                  Rs. 3,000.00│
│    Visa ****1234:         Rs. 2,991.30│
│                                        │
│    Total Paid:            Rs. 5,991.30│
│                                        │
└────────────────────────────────────────┘
```

### Implementation

**Build Payments Method:**
```python
def build_payments(self):
    """
    Build payments section with payment details.
    
    Returns:
        dict: Payments data structure
    """
    payments_list = []
    
    # Get payment records
    payment_records = self._get_payment_records()
    
    if not payment_records:
        # No payment records (shouldn't happen for completed cart)
        raise DataBuildError("No payment records found")
    
    # Build each payment entry
    for payment in payment_records:
        payment_data = self._build_payment_entry(payment)
        payments_list.append(payment_data)
    
    # Calculate totals
    total_paid = sum(p['amount'] for p in payments_list)
    grand_total = float(self.cart.grand_total or 0)
    
    # Calculate amount due (should be 0 for completed carts)
    amount_due = max(grand_total - total_paid, 0)
    
    # Calculate change (cash overpayment)
    change_due = self._calculate_change(payments_list, grand_total)
    
    payments_data = {
        'payments': payments_list,
        'total_paid': total_paid,
        'total_paid_display': self._format_currency(Decimal(str(total_paid))),
        'amount_due': amount_due,
        'change_due': change_due,
    }
    
    # Add change display if applicable
    if change_due > 0:
        payments_data['change_due_display'] = self._format_currency(Decimal(str(change_due)))
    
    return payments_data
```

### Get Payment Records

**Extract Payment Records:**
```python
def _get_payment_records(self):
    """
    Get payment records from cart.
    
    Returns:
        QuerySet or list: Payment records
    """
    # Method 1: Cart has payments relationship
    if hasattr(self.cart, 'payments'):
        return self.cart.payments.all()
    
    # Method 2: Cart has single payment field
    if hasattr(self.cart, 'payment') and self.cart.payment:
        return [self.cart.payment]
    
    # Method 3: Payment info in cart fields
    if hasattr(self.cart, 'payment_method') and self.cart.payment_method:
        # Build synthetic payment record
        return [{
            'method': self.cart.payment_method,
            'amount': self.cart.grand_total,
            'reference': getattr(self.cart, 'payment_reference', None),
        }]
    
    return []
```

### Build Payment Entry

**Build Single Payment:**
```python
def _build_payment_entry(self, payment):
    """
    Build data for single payment.
    
    Args:
        payment: Payment record (model instance or dict)
        
    Returns:
        dict: Payment data
    """
    # Extract payment method
    method = self._get_payment_method(payment)
    method_display = self._format_payment_method(payment)
    
    # Extract amount
    amount = self._get_payment_amount(payment)
    
    # Extract reference
    reference = self._get_payment_reference(payment)
    
    # Calculate change for this payment (if cash)
    change = Decimal('0.00')
    if method == 'CASH':
        change = self._calculate_cash_change(payment)
    
    payment_data = {
        'method': method,
        'method_display': method_display,
        'amount': float(amount),
        'amount_display': self._format_currency(amount),
        'reference': reference,
        'change': float(change),
    }
    
    # Add change display if > 0
    if change > 0:
        payment_data['change_display'] = self._format_currency(change)
    
    return payment_data
```

### Payment Method Extraction

**Get Payment Method:**
```python
def _get_payment_method(self, payment):
    """
    Get payment method code.
    
    Args:
        payment: Payment record
        
    Returns:
        str: Method code (CASH, CARD, DIGITAL, etc.)
    """
    # From model instance
    if hasattr(payment, 'method'):
        return payment.method
    
    # From dict
    if isinstance(payment, dict):
        return payment.get('method', 'UNKNOWN')
    
    # From payment_method field
    if hasattr(payment, 'payment_method'):
        return payment.payment_method
    
    return 'UNKNOWN'
```

**Format Payment Method:**
```python
def _format_payment_method(self, payment):
    """
    Format payment method for display.
    
    Args:
        payment: Payment record
        
    Returns:
        str: Formatted method name
    """
    method = self._get_payment_method(payment)
    
    # Cash
    if method == 'CASH':
        return 'Cash'
    
    # Card
    if method == 'CARD':
        card_info = self._get_card_info(payment)
        if card_info:
            return card_info
        return 'Card'
    
    # Digital wallets
    if method == 'DIGITAL':
        wallet = self._get_wallet_name(payment)
        if wallet:
            return wallet
        return 'Digital Payment'
    
    # Bank transfer
    if method == 'BANK_TRANSFER':
        return 'Bank Transfer'
    
    # Mobile payment
    if method == 'MOBILE':
        return 'Mobile Payment'
    
    # Default
    return method.replace('_', ' ').title()
```

**Get Card Info:**
```python
def _get_card_info(self, payment):
    """
    Get card information for display.
    
    Args:
        payment: Payment record
        
    Returns:
        str or None: Card display info
    """
    # Get card type
    card_type = None
    if hasattr(payment, 'card_type'):
        card_type = payment.card_type
    elif isinstance(payment, dict):
        card_type = payment.get('card_type')
    
    # Get last 4 digits
    last4 = None
    if hasattr(payment, 'card_last4'):
        last4 = payment.card_last4
    elif isinstance(payment, dict):
        last4 = payment.get('card_last4')
    
    # Format display
    if card_type and last4:
        return f"{card_type} ****{last4}"
    elif card_type:
        return card_type
    elif last4:
        return f"Card ****{last4}"
    
    return None
```

### Payment Amount and Reference

**Get Payment Amount:**
```python
def _get_payment_amount(self, payment):
    """
    Get payment amount.
    
    Args:
        payment: Payment record
        
    Returns:
        Decimal: Payment amount
    """
    # From amount field
    if hasattr(payment, 'amount'):
        return payment.amount or Decimal('0.00')
    
    # From dict
    if isinstance(payment, dict):
        amount = payment.get('amount', 0)
        return Decimal(str(amount))
    
    return Decimal('0.00')
```

**Get Payment Reference:**
```python
def _get_payment_reference(self, payment):
    """
    Get payment reference/transaction ID.
    
    Args:
        payment: Payment record
        
    Returns:
        str or None: Reference number
    """
    # Transaction ID
    if hasattr(payment, 'transaction_id'):
        return str(payment.transaction_id)
    
    # Reference field
    if hasattr(payment, 'reference'):
        return payment.reference
    
    # From dict
    if isinstance(payment, dict):
        return payment.get('reference')
    
    return None
```

### Change Calculation

**Calculate Change:**
```python
def _calculate_change(self, payments_list, grand_total):
    """
    Calculate change due (from cash overpayment).
    
    Args:
        payments_list: List of payment dicts
        grand_total: Total amount due (float)
        
    Returns:
        float: Change amount
    """
    # Find cash payments
    cash_payments = [
        p for p in payments_list
        if p['method'] == 'CASH'
    ]
    
    if not cash_payments:
        return 0.0
    
    # Sum cash paid
    cash_paid = sum(p['amount'] for p in cash_payments)
    
    # Calculate overpayment
    change = cash_paid - grand_total
    
    # Return positive change only
    return max(change, 0.0)

def _calculate_cash_change(self, payment):
    """
    Calculate change for specific cash payment.
    
    Args:
        payment: Payment record
        
    Returns:
        Decimal: Change amount
    """
    # Get cash tendered
    cash_tendered = self._get_payment_amount(payment)
    
    # Get allocated amount (how much of this cash was used)
    allocated = cash_tendered
    if hasattr(payment, 'allocated_amount'):
        allocated = payment.allocated_amount or Decimal('0.00')
    
    # Calculate change
    change = cash_tendered - allocated
    
    return max(change, Decimal('0.00'))
```

### Sri Lankan Payment Methods

**Payment Method Reference:**

| Method | Code | Display | Common In SL |
|--------|------|---------|--------------|
| Cash | CASH | Cash | ✓ Very Common |
| Credit Card | CARD | Visa/MC/AMEX | ✓ Common |
| Debit Card | CARD | Debit Card | ✓ Common |
| FriendsPay | DIGITAL | FriendsPay | ✓ Growing |
| eZ Cash | DIGITAL | eZ Cash | ✓ Common |
| mCash | DIGITAL | mCash | ✓ Common |
| Bank Transfer | BANK_TRANSFER | Bank Transfer | ○ Less Common |
| PayHere | DIGITAL | PayHere | ✓ E-commerce |

**Payment Icons (Optional):**
```
Cash: [₨]
Card: [💳]
Digital: [📱]
Bank: [🏦]
```

### Split Payment Example

**Split Payment Scenario:**
```
Grand Total: Rs. 5,991.30

Customer pays:
- Rs. 3,000.00 in Cash
- Rs. 2,991.30 by Visa Card

Receipt displays:
┌────────────────────────────────────┐
│ PAYMENT                            │
│ ──────────────────────────────     │
│ Cash:            Rs. 3,000.00     │
│ Visa ****1234:   Rs. 2,991.30     │
│ ──────────────────────────────     │
│ Total Paid:      Rs. 5,991.30     │
└────────────────────────────────────┘
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_payments(self):
    """Build payment details"""
    # Implementation as described
    ...

# Example output
payments = builder.build_payments()
print(payments)
# {
#   'payments': [
#     {
#       'method': 'CASH',
#       'method_display': 'Cash',
#       'amount': 6000.00,
#       'amount_display': 'Rs. 6,000.00',
#       'reference': None,
#       'change': 8.70,
#       'change_display': 'Rs. 8.70'
#     }
#   ],
#   'total_paid': 6000.00,
#   'change_due': 8.70,
#   'change_due_display': 'Rs. 8.70'
# }
```

### Verification Checklist
- [ ] build_payments() method implemented
- [ ] Single payment handling works
- [ ] Split payments supported
- [ ] Payment method extraction working
- [ ] Payment method formatting (CASH → "Cash")
- [ ] Card display with last 4 digits
- [ ] Digital wallet names displayed
- [ ] Payment amounts extracted correctly
- [ ] Payment references included
- [ ] Change calculation correct
- [ ] Total paid calculated
- [ ] All amounts formatted with currency
- [ ] Sri Lankan payment methods supported

---

## Task 31: Implement Build Footer Method

### Overview
Implement the build_footer() method that generates the footer section of the receipt, including thank you messages, return policies, website, social media, and custom footer text from the template.

### Dependencies
- Task 23: Create ReceiptBuilder service
- ReceiptTemplate model with footer fields
- Business policies defined

### Instructions

1. **Implement build_footer method**
   - Extract thank you message
   - Extract return policy
   - Extract website and social media
   - Extract custom footer lines
   - Format for display

2. **Add thank you message**
   - Standard message: "Thank you for shopping with us!"
   - Support custom messages from template
   - Support multi-language (Sinhala optional)
   - Format centered

3. **Add return policy**
   - Standard policy: "Return within 7 days with receipt"
   - Support custom policies from template
   - Truncate if too long
   - Format readable

4. **Add contact information**
   - Website URL
   - Social media handles
   - Support QR code link (Task 32)
   - Format consistently

5. **Add custom footer lines**
   - Get custom lines from template
   - Support multiple lines
   - Preserve line order
   - Handle empty lines

### Footer Data Structure

**Output Format:**
```json
{
  "footer": {
    "thank_you_message": "Thank you for shopping with us!",
    "thank_you_message_sinhala": "ඔබට ස්තූතියි!",
    "return_policy": "Return within 7 days with receipt and original packaging",
    "website": "www.abcstore.lk",
    "social_media": "@abcstore",
    "social_platforms": {
      "facebook": "facebook.com/abcstore",
      "instagram": "@abcstore",
      "whatsapp": "+94771234567"
    },
    "custom_lines": [
      "Island-wide delivery available",
      "Follow us for special offers",
      "Customer hotline: 011-2345678"
    ],
    "footer_note": "This is a computer-generated receipt"
  }
}
```

### Footer Section Layout

```
┌────────────────────────────────────────┐
│                                        │
│    Thank you for shopping with us!    │ ← Thank you message
│         ඔබට ස්තූතියි!                 │ ← Sinhala (optional)
│                                        │
│    Return Policy:                     │
│    Return within 7 days with receipt  │ ← Return policy
│    and original packaging             │
│                                        │
│    Visit us: www.abcstore.lk          │ ← Website
│    Follow: @abcstore                   │ ← Social media
│                                        │
│    Island-wide delivery available     │ ← Custom line 1
│    Customer hotline: 011-2345678      │ ← Custom line 2
│                                        │
│    Computer-generated receipt         │ ← Footer note
│                                        │
└────────────────────────────────────────┘
```

### Implementation

**Build Footer Method:**
```python
def build_footer(self):
    """
    Build footer section with policies and messages.
    
    Returns:
        dict: Footer data structure
    """
    footer_data = {}
    
    # Thank you message
    thank_you = self._get_thank_you_message()
    if thank_you:
        footer_data['thank_you_message'] = thank_you
    
    # Sinhala thank you (optional)
    thank_you_si = self._get_thank_you_message_sinhala()
    if thank_you_si:
        footer_data['thank_you_message_sinhala'] = thank_you_si
    
    # Return policy
    return_policy = self._get_return_policy()
    if return_policy:
        footer_data['return_policy'] = return_policy
    
    # Website
    website = self._get_website()
    if website:
        footer_data['website'] = website
    
    # Social media
    social = self._get_social_media()
    if social:
        footer_data['social_media'] = social
        
    # Social platforms (detailed)
    platforms = self._get_social_platforms()
    if platforms:
        footer_data['social_platforms'] = platforms
    
    # Custom footer lines
    custom_lines = self._get_custom_footer_lines()
    if custom_lines:
        footer_data['custom_lines'] = custom_lines
    
    # Footer note
    footer_note = self._get_footer_note()
    if footer_note:
        footer_data['footer_note'] = footer_note
    
    return footer_data
```

### Thank You Message

**Get Thank You Message:**
```python
def _get_thank_you_message(self):
    """
    Get thank you message for receipt.
    
    Returns:
        str: Thank you message
    """
    # From template
    if self.template and hasattr(self.template, 'thank_you_message'):
        if self.template.thank_you_message:
            return self.template.thank_you_message
    
    # Default message
    return "Thank you for shopping with us!"

def _get_thank_you_message_sinhala(self):
    """
    Get Sinhala thank you message (optional).
    
    Returns:
        str or None: Sinhala thank you message
    """
    # From template
    if self.template and hasattr(self.template, 'thank_you_message_sinhala'):
        return self.template.thank_you_message_sinhala
    
    # Default Sinhala message (optional)
    # return "ඔබට ස්තූතියි!"
    
    return None
```

### Return Policy

**Get Return Policy:**
```python
def _get_return_policy(self):
    """
    Get return policy text.
    
    Returns:
        str or None: Return policy
    """
    # From template
    if self.template and hasattr(self.template, 'return_policy'):
        if self.template.return_policy:
            policy = self.template.return_policy
            # Truncate if too long (max 100 chars recommended)
            return self._truncate_policy(policy, max_length=100)
    
    # From tenant settings
    if hasattr(self.tenant, 'return_policy') and self.tenant.return_policy:
        policy = self.tenant.return_policy
        return self._truncate_policy(policy, max_length=100)
    
    # Default policy
    return "Return within 7 days with receipt"

def _truncate_policy(self, policy, max_length=100):
    """
    Truncate policy text if too long.
    
    Args:
        policy: Policy text
        max_length: Maximum length
        
    Returns:
        str: Truncated policy
    """
    if len(policy) <= max_length:
        return policy
    
    # Truncate at last space before max_length
    truncated = policy[:max_length]
    last_space = truncated.rfind(' ')
    
    if last_space > 0:
        truncated = truncated[:last_space]
    
    return truncated + '...'
```

**Common Sri Lankan Return Policies:**
```
Examples:
- "Return within 7 days with receipt"
- "Exchange only, no cash refunds"
- "No returns on sale items"
- "Return with original packaging within 14 days"
- "Store credit only for returns"
```

### Website and Social Media

**Get Website:**
```python
def _get_website(self):
    """
    Get website URL.
    
    Returns:
        str or None: Website URL
    """
    # From template
    if self.template and hasattr(self.template, 'website'):
        return self.template.website
    
    # From tenant
    if hasattr(self.tenant, 'website') and self.tenant.website:
        return self.tenant.website
    
    return None
```

**Get Social Media:**
```python
def _get_social_media(self):
    """
    Get primary social media handle.
    
    Returns:
        str or None: Social media handle
    """
    # From template
    if self.template and hasattr(self.template, 'social_media'):
        return self.template.social_media
    
    # From tenant
    if hasattr(self.tenant, 'social_media') and self.tenant.social_media:
        return self.tenant.social_media
    
    return None

def _get_social_platforms(self):
    """
    Get detailed social media platforms.
    
    Returns:
        dict or None: Platform links
    """
    platforms = {}
    
    # Facebook
    if self.template and hasattr(self.template, 'facebook_url'):
        platforms['facebook'] = self.template.facebook_url
    
    # Instagram
    if self.template and hasattr(self.template, 'instagram_handle'):
        platforms['instagram'] = self.template.instagram_handle
    
    # WhatsApp
    if self.template and hasattr(self.template, 'whatsapp_number'):
        platforms['whatsapp'] = self.template.whatsapp_number
    
    return platforms if platforms else None
```

**Social Media Display Formats:**
```
Instagram: @abcstore
Facebook: facebook.com/abcstore
WhatsApp: +94 77 123 4567
Twitter/X: @abcstore
```

### Custom Footer Lines

**Get Custom Footer Lines:**
```python
def _get_custom_footer_lines(self):
    """
    Get custom footer lines from template.
    
    Returns:
        list: Custom footer lines
    """
    if not self.template:
        return []
    
    # Get footer_lines from template
    if hasattr(self.template, 'footer_lines'):
        lines = self.template.footer_lines
        
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

**Common Custom Footer Lines:**
```
Examples:
- "Island-wide delivery available"
- "Free delivery over Rs. 5,000"
- "Follow us for special offers"
- "Customer hotline: 011-2345678"
- "Open 7 days a week, 9 AM - 9 PM"
- "Authorized dealer of [Brand Name]"
- "ISO 9001 Certified"
```

### Footer Note

**Get Footer Note:**
```python
def _get_footer_note(self):
    """
    Get footer note (legal/technical note).
    
    Returns:
        str: Footer note
    """
    # From template
    if self.template and hasattr(self.template, 'footer_note'):
        if self.template.footer_note:
            return self.template.footer_note
    
    # Default note
    return "This is a computer-generated receipt"
```

**Common Footer Notes:**
```
Examples:
- "This is a computer-generated receipt"
- "No signature required"
- "Valid for warranty claims"
- "Keep this receipt for returns"
- "Receipt ID: [receipt_number]"
```

### Footer Formatting

**Text Alignment:**
```
Centered:
- Thank you message
- Website
- Social media

Left-aligned:
- Return policy
- Custom footer lines
- Footer note
```

**Line Spacing:**
```
Standard footer:
[blank line]
Thank you message
[blank line]
Return policy
[blank line]
Website
Social media
[blank line]
Custom lines
[blank line]
Footer note
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_footer(self):
    """Build footer with messages and policies"""
    # Implementation as described
    ...

# Example output
footer = builder.build_footer()
print(footer)
# {
#   'thank_you_message': 'Thank you for shopping with us!',
#   'return_policy': 'Return within 7 days with receipt',
#   'website': 'www.abcstore.lk',
#   'social_media': '@abcstore',
#   'custom_lines': [
#     'Island-wide delivery available',
#     'Customer hotline: 011-2345678'
#   ],
#   'footer_note': 'This is a computer-generated receipt'
# }
```

### Verification Checklist
- [ ] build_footer() method implemented
- [ ] Thank you message extraction working
- [ ] Sinhala thank you message support (optional)
- [ ] Return policy extraction and truncation
- [ ] Website URL included
- [ ] Social media handle included
- [ ] Social platforms detailed (optional)
- [ ] Custom footer lines extracted
- [ ] Footer note included
- [ ] Long text truncated appropriately
- [ ] Empty/null values handled gracefully
- [ ] Follows Sri Lankan conventions

---

## Task 32: Implement Build QR Code

### Overview
Implement the build_qr_code() method that generates QR code data for digital receipt access. The QR code allows customers to access their receipt online, view transaction details, and download digital copies.

### Dependencies
- Task 23: Create ReceiptBuilder service
- Task 25: build_transaction_info (for receipt number)
- Digital receipt URL structure defined

### Instructions

1. **Implement build_qr_code method**
   - Generate URL for digital receipt
   - Create QR code data structure
   - Define QR code size/format
   - Include metadata
   - Format for QR library

2. **Define receipt URL structure**
   - Base URL: tenant's receipt domain
   - Path: /receipts/{receipt_number}
   - Query params: optional verification
   - Support secure lookup
   - Handle custom domains

3. **Add QR code parameters**
   - Data content (URL)
   - Error correction level
   - Size specification
   - Format (SVG, PNG, etc.)
   - Version/encoding

4. **Add security considerations**
   - Receipt lookup token (optional)
   - Time-limited access (optional)
   - Verification code
   - Privacy protection

5. **Add fallback handling**
   - Handle missing receipt number
   - Handle missing URL configuration
   - Provide plain text alternative
   - Document QR generation process

### QR Code Data Structure

**Output Format:**
```json
{
  "qr_code": {
    "data": "https://receipts.abcstore.lk/r/REC-20260122-00042",
    "url": "https://receipts.abcstore.lk/r/REC-20260122-00042",
    "format": "URL",
    "error_correction": "M",
    "size": "medium",
    "display_text": "View digital receipt",
    "metadata": {
      "receipt_number": "REC-20260122-00042",
      "tenant_id": "abc123",
      "generated_at": "2026-01-22T14:30:45Z"
    }
  }
}
```

### QR Code Section Layout

```
┌────────────────────────────────────────┐
│                                        │
│        [QR CODE IMAGE]                 │ ← QR Code (4x4 cm)
│                                        │
│    Scan for digital receipt           │ ← Instruction text
│    receipts.abcstore.lk               │ ← Short URL display
│                                        │
└────────────────────────────────────────┘
```

### Implementation

**Build QR Code Method:**
```python
def build_qr_code(self):
    """
    Build QR code data for digital receipt access.
    
    Returns:
        dict: QR code data structure
    """
    # Get receipt number
    receipt_number = self._get_or_generate_receipt_number()
    
    # Build receipt URL
    receipt_url = self._build_receipt_url(receipt_number)
    
    if not receipt_url:
        # No URL configured, return minimal QR data
        return {
            'data': receipt_number,
            'format': 'TEXT',
            'display_text': receipt_number,
        }
    
    # Build full QR data
    qr_data = {
        'data': receipt_url,
        'url': receipt_url,
        'format': 'URL',
        'error_correction': 'M',  # Medium error correction
        'size': 'medium',  # medium = 4x4cm typical
        'display_text': 'View digital receipt',
    }
    
    # Add metadata
    qr_data['metadata'] = {
        'receipt_number': receipt_number,
        'tenant_id': str(self.tenant.id),
        'generated_at': timezone.now().isoformat(),
    }
    
    # Add short URL display (optional)
    short_url = self._get_short_url_display(receipt_url)
    if short_url:
        qr_data['short_url_display'] = short_url
    
    return qr_data
```

### Receipt URL Generation

**Build Receipt URL:**
```python
def _build_receipt_url(self, receipt_number):
    """
    Build URL for digital receipt access.
    
    Args:
        receipt_number: Receipt number
        
    Returns:
        str or None: Receipt URL
    """
    # Get base URL from tenant settings
    base_url = self._get_receipt_base_url()
    
    if not base_url:
        return None
    
    # Build path
    # Format: /r/{receipt_number} or /receipts/{receipt_number}
    path = f"/r/{receipt_number}"
    
    # Combine
    url = f"{base_url}{path}"
    
    # Add query params (optional)
    query_params = self._get_receipt_url_params()
    if query_params:
        url += f"?{query_params}"
    
    return url

def _get_receipt_base_url(self):
    """
    Get base URL for receipt system.
    
    Returns:
        str or None: Base URL
    """
    # From template
    if self.template and hasattr(self.template, 'receipt_url_base'):
        if self.template.receipt_url_base:
            return self.template.receipt_url_base.rstrip('/')
    
    # From tenant settings
    if hasattr(self.tenant, 'receipt_url_base') and self.tenant.receipt_url_base:
        return self.tenant.receipt_url_base.rstrip('/')
    
    # From tenant domain
    if hasattr(self.tenant, 'domain') and self.tenant.domain:
        return f"https://receipts.{self.tenant.domain}"
    
    # Default (generic)
    # Note: This should be configured in production
    return None
```

**URL Format Examples:**
```
Standard format:
https://receipts.abcstore.lk/r/REC-20260122-00042

With tenant subdomain:
https://abcstore.receipts.lankacommerce.cloud/r/REC-20260122-00042

Short format:
https://rcpt.lk/abc/REC-20260122-00042

With verification:
https://receipts.abcstore.lk/r/REC-20260122-00042?v=abc123
```

### URL Query Parameters

**Get URL Parameters:**
```python
def _get_receipt_url_params(self):
    """
    Get query parameters for receipt URL (optional).
    
    Returns:
        str or None: URL-encoded query params
    """
    params = {}
    
    # Verification token (optional, for security)
    verification = self._generate_receipt_verification_token()
    if verification:
        params['v'] = verification
    
    # Tenant identifier (if multi-tenant system)
    if hasattr(self.tenant, 'slug'):
        params['t'] = self.tenant.slug
    
    # Convert to query string
    if params:
        from urllib.parse import urlencode
        return urlencode(params)
    
    return None

def _generate_receipt_verification_token(self):
    """
    Generate verification token for receipt access.
    
    Optional security feature to prevent unauthorized access.
    
    Returns:
        str or None: Verification token
    """
    # Option 1: No verification (public receipts)
    return None
    
    # Option 2: Simple hash of receipt number + secret
    # import hashlib
    # secret = settings.RECEIPT_SECRET_KEY
    # data = f"{receipt_number}{secret}"
    # return hashlib.sha256(data.encode()).hexdigest()[:8]
```

### QR Code Parameters

**Error Correction Levels:**

| Level | Code | Recovery | Use Case |
|-------|------|----------|----------|
| Low | L | 7% | Clean environments |
| Medium | M | 15% | Standard (Recommended) |
| Quartile | Q | 25% | Moderate damage expected |
| High | H | 30% | High damage expected |

**QR Code Sizes:**

| Size | Dimensions | Use Case |
|------|------------|----------|
| Small | 2x2 cm | Compact receipts |
| Medium | 4x4 cm | Standard (Recommended) |
| Large | 6x6 cm | Poster/signage |

**Format Specifications:**
```python
QR_CODE_SPECS = {
    'small': {
        'size_cm': 2.0,
        'size_px': 150,  # 75 DPI
        'modules': 25,
    },
    'medium': {
        'size_cm': 4.0,
        'size_px': 300,  # 75 DPI
        'modules': 33,
    },
    'large': {
        'size_cm': 6.0,
        'size_px': 450,  # 75 DPI
        'modules': 41,
    },
}
```

### Short URL Display

**Get Short URL Display:**
```python
def _get_short_url_display(self, full_url):
    """
    Get shortened URL for display under QR code.
    
    Args:
        full_url: Full receipt URL
        
    Returns:
        str or None: Shortened display URL
    """
    if not full_url:
        return None
    
    # Remove protocol
    display = full_url.replace('https://', '').replace('http://', '')
    
    # Truncate if too long (max 40 chars)
    if len(display) > 40:
        # Keep domain + first part of path
        parts = display.split('/')
        if len(parts) > 2:
            display = f"{parts[0]}/.../{parts[-1]}"
    
    return display
```

**Display Examples:**
```
Full URL: https://receipts.abcstore.lk/r/REC-20260122-00042
Display:  receipts.abcstore.lk/r/REC-20260122-00042

Full URL: https://abcstore.receipts.lankacommerce.cloud/r/REC-20260122-00042
Display:  abcstore.receipts.../r/REC-20260122-00042
```

### QR Code Generation (Printer)

**Note for Printer Integration:**
```python
# The actual QR code image generation happens in the printer module
# This method only provides the data structure

# Example printer usage (Task in Group C):
from apps.pos.receipts.printing import ThermalPrinter

printer = ThermalPrinter()
qr_data = receipt_data['qr_code']

# Printer generates QR image
printer.print_qr_code(
    data=qr_data['data'],
    size=qr_data['size'],
    error_correction=qr_data['error_correction']
)
```

### Digital Receipt Features

**Online Receipt Access:**
```
Customer scans QR code → Opens URL in browser
    ↓
Receipt lookup system
    ├── Verify receipt number exists
    ├── Check verification token (if used)
    ├── Load receipt data
    └── Render digital receipt page
    ↓
Customer can:
    ├── View receipt details
    ├── Download PDF
    ├── Email to self
    ├── Share link
    └── Print again
```

**Digital Receipt Benefits:**
```
For Customer:
- No paper loss
- Easy access anytime
- Email forwarding
- Warranty reference

For Business:
- Reduced paper cost
- Environmental benefit
- Customer engagement
- Marketing opportunity
```

### Security Considerations

**Receipt Privacy:**
```python
# Option 1: Public receipts (simple)
# Anyone with receipt number can view
# URL: /r/{receipt_number}

# Option 2: Token-based access (secure)
# Requires verification token
# URL: /r/{receipt_number}?v={token}

# Option 3: Time-limited access (balanced)
# Receipt viewable for X days
# After that, requires customer email
```

**Implementation Notes:**
```
Security recommendations:
1. Use HTTPS for receipt URLs
2. Consider rate limiting on lookup endpoint
3. Don't expose sensitive customer data publicly
4. Log access attempts for audit
5. Allow customer to opt-out of digital receipts
```

### Expected Outcome

```python
# Method implemented in ReceiptBuilder
def build_qr_code(self):
    """Build QR code data"""
    # Implementation as described
    ...

# Example output
qr_code = builder.build_qr_code()
print(qr_code)
# {
#   'data': 'https://receipts.abcstore.lk/r/REC-20260122-00042',
#   'url': 'https://receipts.abcstore.lk/r/REC-20260122-00042',
#   'format': 'URL',
#   'error_correction': 'M',
#   'size': 'medium',
#   'display_text': 'View digital receipt',
#   'short_url_display': 'receipts.abcstore.lk/r/REC-...',
#   'metadata': {
#     'receipt_number': 'REC-20260122-00042',
#     'tenant_id': 'abc123'
#   }
# }
```

### Verification Checklist
- [ ] build_qr_code() method implemented
- [ ] Receipt URL generation working
- [ ] Base URL extracted from tenant/template
- [ ] URL format follows standard pattern
- [ ] QR code parameters specified
- [ ] Error correction level set to 'M'
- [ ] Size specification included
- [ ] Display text included
- [ ] Short URL display formatted
- [ ] Metadata included in QR data
- [ ] Handles missing URL configuration
- [ ] Fallback to text-only QR if no URL
- [ ] Security considerations documented

---

## Task 33: Create Receipt Number Generator

### Overview
Create the ReceiptNumberGenerator service class that generates unique, sequential receipt numbers for each tenant. The generator produces human-readable receipt numbers in the format REC-YYYYMMDD-NNNNN with daily sequence reset.

### Dependencies
- Receipt model (Task 17)
- Database sequence handling
- Multi-tenancy support

### Instructions

1. **Create number generator service**
   - Create ReceiptNumberGenerator class
   - Accept tenant parameter
   - Implement generate() method
   - Handle sequence management
   - Ensure thread safety

2. **Define number format**
   - Prefix: "REC"
   - Date: YYYYMMDD format
   - Sequence: 5-digit counter (00001-99999)
   - Separator: hyphen
   - Final format: REC-20260122-00042

3. **Implement sequence logic**
   - Track daily sequence per tenant
   - Reset sequence each day
   - Handle concurrent generation
   - Prevent duplicates
   - Handle sequence overflow

4. **Add database storage**
   - Store current sequence in database
   - Atomic increment operations
   - Per-tenant isolation
   - Per-day isolation
   - Lock handling

5. **Add error handling**
   - Handle sequence conflicts
   - Retry on failure
   - Maximum retry limit
   - Logging and monitoring

### Receipt Number Format

**Format Structure:**
```
REC-20260122-00042

Components:
├── REC           → Prefix (3 chars)
├── -             → Separator
├── 20260122      → Date (YYYYMMDD)
├── -             → Separator
└── 00042         → Sequence (5 digits, zero-padded)
```

**Format Examples:**
```
First receipt of day:  REC-20260122-00001
Tenth receipt:         REC-20260122-00010
Hundredth receipt:     REC-20260122-00100
Thousandth receipt:    REC-20260122-01000
Last of day:           REC-20260122-99999

Next day resets:       REC-20260123-00001
```

### Generator Service Structure

**Service Location:**
```
apps/pos/receipts/
├── services/
│   ├── __init__.py
│   ├── builder.py              # ReceiptBuilder (Tasks 23-32)
│   ├── number_generator.py     # ReceiptNumberGenerator (This task)
│   └── exceptions.py           # Custom exceptions
```

### Implementation

**ReceiptNumberGenerator Class:**
```python
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class ReceiptNumberGenerator:
    """
    Service for generating unique receipt numbers.
    
    Generates sequential receipt numbers in format:
    REC-YYYYMMDD-NNNNN
    
    Features:
    - Daily sequence reset
    - Per-tenant isolation
    - Thread-safe generation
    - Automatic retry on conflicts
    """
    
    PREFIX = "REC"
    SEQUENCE_LENGTH = 5
    MAX_SEQUENCE = 99999
    MAX_RETRIES = 5
    
    def __init__(self, tenant):
        """
        Initialize generator for tenant.
        
        Args:
            tenant: Tenant instance
        """
        self.tenant = tenant
    
    def generate(self):
        """
        Generate next receipt number.
        
        Returns:
            str: Generated receipt number (e.g., REC-20260122-00042)
            
        Raises:
            ReceiptNumberGenerationError: If generation fails
        """
        attempts = 0
        
        while attempts < self.MAX_RETRIES:
            try:
                # Get current date
                current_date = timezone.now().date()
                
                # Get next sequence number
                sequence = self._get_next_sequence(current_date)
                
                # Format receipt number
                receipt_number = self._format_receipt_number(
                    current_date, 
                    sequence
                )
                
                # Verify uniqueness
                if self._verify_unique(receipt_number):
                    return receipt_number
                
                # If not unique, retry
                attempts += 1
                logger.warning(
                    f"Receipt number conflict: {receipt_number}, "
                    f"retry {attempts}/{self.MAX_RETRIES}"
                )
                
            except Exception as e:
                attempts += 1
                logger.error(
                    f"Error generating receipt number: {e}, "
                    f"retry {attempts}/{self.MAX_RETRIES}"
                )
        
        # Max retries exceeded
        raise ReceiptNumberGenerationError(
            f"Failed to generate unique receipt number after "
            f"{self.MAX_RETRIES} attempts"
        )
```

### Sequence Management

**Get Next Sequence:**
```python
def _get_next_sequence(self, date):
    """
    Get next sequence number for date.
    
    Args:
        date: Date for sequence
        
    Returns:
        int: Next sequence number
    """
    from apps.pos.receipts.models import ReceiptSequence
    
    # Use database transaction for atomicity
    with transaction.atomic():
        # Get or create sequence record for tenant and date
        sequence_record, created = ReceiptSequence.objects.select_for_update().get_or_create(
            tenant=self.tenant,
            date=date,
            defaults={'current_sequence': 0}
        )
        
        # Increment sequence
        sequence_record.current_sequence += 1
        
        # Check overflow
        if sequence_record.current_sequence > self.MAX_SEQUENCE:
            raise ReceiptNumberGenerationError(
                f"Sequence overflow for date {date}: "
                f"exceeded maximum of {self.MAX_SEQUENCE}"
            )
        
        # Save
        sequence_record.save()
        
        return sequence_record.current_sequence
```

### Receipt Sequence Model

**ReceiptSequence Model:**
```python
# In apps/pos/receipts/models/receipt_sequence.py

class ReceiptSequence(TenantAwareModel):
    """
    Tracks daily receipt number sequences per tenant.
    
    Ensures unique, sequential receipt numbers.
    """
    
    date = models.DateField(
        help_text="Date for this sequence"
    )
    
    current_sequence = models.IntegerField(
        default=0,
        help_text="Current sequence number for the date"
    )
    
    class Meta:
        db_table = 'pos_receipt_sequences'
        unique_together = [['tenant', 'date']]
        indexes = [
            models.Index(fields=['tenant', 'date']),
        ]
        verbose_name = 'Receipt Sequence'
        verbose_name_plural = 'Receipt Sequences'
    
    def __str__(self):
        return f"{self.tenant} - {self.date}: {self.current_sequence}"
```

### Format Receipt Number

**Format Method:**
```python
def _format_receipt_number(self, date, sequence):
    """
    Format receipt number.
    
    Args:
        date: Date (datetime.date)
        sequence: Sequence number (int)
        
    Returns:
        str: Formatted receipt number
    """
    # Format date as YYYYMMDD
    date_str = date.strftime('%Y%m%d')
    
    # Zero-pad sequence to required length
    sequence_str = str(sequence).zfill(self.SEQUENCE_LENGTH)
    
    # Combine components
    receipt_number = f"{self.PREFIX}-{date_str}-{sequence_str}"
    
    return receipt_number
```

**Formatting Examples:**
```python
_format_receipt_number(date(2026, 1, 22), 1)
# Output: "REC-20260122-00001"

_format_receipt_number(date(2026, 1, 22), 42)
# Output: "REC-20260122-00042"

_format_receipt_number(date(2026, 1, 22), 9999)
# Output: "REC-20260122-09999"
```

### Uniqueness Verification

**Verify Unique:**
```python
def _verify_unique(self, receipt_number):
    """
    Verify receipt number is unique.
    
    Args:
        receipt_number: Receipt number to verify
        
    Returns:
        bool: True if unique
    """
    from apps.pos.receipts.models import Receipt
    
    # Check if receipt number already exists
    exists = Receipt.objects.filter(
        receipt_number=receipt_number
    ).exists()
    
    return not exists
```

### Error Handling

**Custom Exception:**
```python
# In apps/pos/receipts/services/exceptions.py

class ReceiptNumberGenerationError(Exception):
    """Exception raised when receipt number generation fails."""
    pass
```

**Error Scenarios:**

| Error | Cause | Handling |
|-------|-------|----------|
| Sequence overflow | >99,999 receipts in one day | Alert admin, use extended format |
| Database lock timeout | High concurrency | Retry with backoff |
| Duplicate number | Race condition | Retry generation |
| Transaction failure | Database error | Log and retry |

### Usage Example

**Generate Receipt Number:**
```python
from apps.pos.receipts.services import ReceiptNumberGenerator

# In ReceiptBuilder or view
tenant = cart.tenant

# Generate receipt number
generator = ReceiptNumberGenerator(tenant=tenant)
receipt_number = generator.generate()

print(receipt_number)
# Output: "REC-20260122-00042"

# Use in receipt creation
receipt = Receipt.objects.create(
    cart=cart,
    receipt_number=receipt_number,
    receipt_type='SALE',
    generated_at=timezone.now()
)
```

### Integration with ReceiptBuilder

**Update ReceiptBuilder:**
```python
# In build_transaction_info() method

def _get_or_generate_receipt_number(self):
    """
    Get existing receipt number or generate new one.
    
    Returns:
        str: Receipt number
    """
    # For duplicate receipts, use original number
    if hasattr(self, 'original_receipt') and self.original_receipt:
        return self.original_receipt.receipt_number
    
    # Generate new receipt number
    generator = ReceiptNumberGenerator(tenant=self.tenant)
    receipt_number = generator.generate()
    
    return receipt_number
```

### Performance Considerations

**Optimization Strategies:**

```python
# 1. Database index on (tenant, date)
# Already defined in model Meta

# 2. Connection pooling for high concurrency
# Configure in database settings

# 3. Caching current sequence (optional)
# Cache sequence in Redis for very high volume

# 4. Batch generation (optional)
# Reserve block of numbers for multiple receipts
```

**High-Volume Scenario:**
```
For stores with >1000 receipts/day:

Option 1: Extended sequence (6 digits)
- SEQUENCE_LENGTH = 6
- MAX_SEQUENCE = 999999

Option 2: Include terminal ID
- REC-T01-20260122-00042
- Separate sequence per terminal

Option 3: Include hour
- REC-20260122-1430-00042
- Sequence resets hourly
```

### Expected Outcome

```python
# Service class created
from apps.pos.receipts.services import ReceiptNumberGenerator

# Usage
generator = ReceiptNumberGenerator(tenant=my_tenant)
number = generator.generate()

print(number)
# Output: "REC-20260122-00042"

# Sequential calls
number1 = generator.generate()  # REC-20260122-00042
number2 = generator.generate()  # REC-20260122-00043
number3 = generator.generate()  # REC-20260122-00044
```

### Verification Checklist
- [ ] ReceiptNumberGenerator class created
- [ ] generate() method implemented
- [ ] Receipt number format correct (REC-YYYYMMDD-NNNNN)
- [ ] ReceiptSequence model created
- [ ] Database sequence management implemented
- [ ] Atomic transaction for sequence increment
- [ ] Uniqueness verification implemented
- [ ] Error handling with retries
- [ ] Sequence overflow detection
- [ ] Per-tenant isolation
- [ ] Daily sequence reset
- [ ] Thread-safe operation (select_for_update)
- [ ] Integration with ReceiptBuilder
- [ ] Logging for debugging

---

## Task 34: Add Duplicate Receipt Handling

### Overview
Implement duplicate receipt handling that allows reprinting of existing receipts while clearly marking them as duplicates. This preserves the original receipt data and tracks reprint history for audit purposes.

### Dependencies
- Task 17: Receipt model with original_receipt FK
- Task 20: Receipt type field (DUPLICATE type)
- ReceiptBuilder service (Tasks 23-32)

### Instructions

1. **Add duplicate generation method**
   - Add generate_duplicate() method to Receipt model
   - Create new Receipt record
   - Copy receipt_data from original
   - Set receipt_type to DUPLICATE
   - Link to original_receipt

2. **Add duplicate marking**
   - Mark duplicate receipts visually
   - Add "DUPLICATE COPY" watermark
   - Show original receipt date/number
   - Show reprint date/time
   - Preserve original data exactly

3. **Add reprint tracking**
   - Track number of reprints
   - Record reprint timestamps
   - Log who requested reprint
   - Maintain audit trail

4. **Update ReceiptBuilder**
   - Handle DUPLICATE receipt type
   - Use original receipt_data
   - Add duplicate indicators to display
   - Maintain receipt_number from original

5. **Add validation**
   - Verify original receipt exists
   - Verify original is not voided
   - Verify reprint permissions
   - Limit reprint frequency (optional)

### Duplicate Receipt Flow

**Reprint Process:**
```
Customer/Cashier requests reprint
    ↓
Load original Receipt record
    ↓
Verify can be reprinted
    ├── Original exists
    ├── Not voided
    └── Permission granted
    ↓
Generate duplicate Receipt
    ├── Copy receipt_data
    ├── Set type = DUPLICATE
    ├── Link to original
    └── Add duplicate markers
    ↓
Print duplicate receipt
    ├── "DUPLICATE COPY" watermark
    ├── Original date/number shown
    └── Reprint date shown
```

### Implementation

**Generate Duplicate Method:**
```python
# In Receipt model (apps/pos/receipts/models/receipt.py)

def generate_duplicate(self, requested_by=None):
    """
    Generate a duplicate copy of this receipt.
    
    Creates a new Receipt record marked as DUPLICATE,
    preserving the original receipt data.
    
    Args:
        requested_by: User who requested duplicate (optional)
        
    Returns:
        Receipt: New duplicate receipt instance
        
    Raises:
        ValidationError: If receipt cannot be duplicated
    """
    # Validate can duplicate
    self._validate_can_duplicate()
    
    # Create duplicate receipt
    duplicate = Receipt(
        cart=self.cart,
        transaction_id=self.transaction_id,
        receipt_type='DUPLICATE',
        receipt_number=self.receipt_number,  # Keep original number
        original_receipt=self,  # Link to original
        generated_at=timezone.now(),  # New generation time
        receipt_data=self._prepare_duplicate_data(),  # Modified data
    )
    
    # Set requested_by if available
    if requested_by:
        duplicate.created_by = requested_by
    
    # Save
    duplicate.save()
    
    # Update reprint count on original
    self._increment_reprint_count()
    
    # Log reprint event
    self._log_reprint_event(duplicate, requested_by)
    
    return duplicate
```

### Validation

**Validate Can Duplicate:**
```python
def _validate_can_duplicate(self):
    """
    Validate that this receipt can be duplicated.
    
    Raises:
        ValidationError: If cannot duplicate
    """
    # Cannot duplicate a duplicate
    if self.receipt_type == 'DUPLICATE':
        raise ValidationError(
            "Cannot duplicate a duplicate receipt. "
            "Use the original receipt."
        )
    
    # Cannot duplicate void receipt
    if self.receipt_type == 'VOID':
        raise ValidationError(
            "Cannot duplicate a voided receipt"
        )
    
    # Check if receipt is too old (optional)
    days_old = (timezone.now() - self.generated_at).days
    max_age_days = 90  # Configurable
    
    if days_old > max_age_days:
        raise ValidationError(
            f"Receipt is too old to duplicate "
            f"(>{max_age_days} days)"
        )
    
    # All checks passed
    return True
```

### Prepare Duplicate Data

**Prepare Duplicate Receipt Data:**
```python
def _prepare_duplicate_data(self):
    """
    Prepare receipt_data for duplicate with markers.
    
    Returns:
        dict: Modified receipt data
    """
    import copy
    
    # Copy original data
    duplicate_data = copy.deepcopy(self.receipt_data)
    
    # Add duplicate markers
    duplicate_data['is_duplicate'] = True
    duplicate_data['original_receipt_number'] = self.receipt_number
    duplicate_data['original_generated_at'] = self.generated_at.isoformat()
    duplicate_data['reprinted_at'] = timezone.now().isoformat()
    
    # Modify header to show DUPLICATE
    if 'header' in duplicate_data:
        duplicate_data['header']['duplicate_marker'] = True
        duplicate_data['header']['duplicate_text'] = "DUPLICATE COPY"
    
    # Modify transaction info
    if 'transaction' in duplicate_data:
        duplicate_data['transaction']['is_duplicate'] = True
        duplicate_data['transaction']['original_date'] = duplicate_data['transaction'].get('date')
        duplicate_data['transaction']['reprint_date'] = timezone.now().strftime('%Y-%m-%d')
        duplicate_data['transaction']['reprint_time'] = timezone.now().strftime('%H:%M:%S')
    
    return duplicate_data
```

### Reprint Tracking

**Increment Reprint Count:**
```python
# Add field to Receipt model
reprint_count = models.IntegerField(
    default=0,
    help_text="Number of times this receipt has been reprinted"
)

def _increment_reprint_count(self):
    """
    Increment reprint count on original receipt.
    """
    self.reprint_count += 1
    self.save(update_fields=['reprint_count'])
```

**Log Reprint Event:**
```python
def _log_reprint_event(self, duplicate, requested_by):
    """
    Log receipt reprint event for audit.
    
    Args:
        duplicate: Duplicate receipt instance
        requested_by: User who requested reprint
    """
    logger.info(
        f"Receipt reprinted: {self.receipt_number}",
        extra={
            'original_receipt_id': str(self.id),
            'duplicate_receipt_id': str(duplicate.id),
            'requested_by': requested_by.username if requested_by else None,
            'reprint_count': self.reprint_count,
            'tenant_id': str(self.tenant.id),
        }
    )
    
    # Optional: Create audit log entry
    # from apps.audit.models import AuditLog
    # AuditLog.objects.create(
    #     action='RECEIPT_REPRINT',
    #     object_id=self.id,
    #     user=requested_by,
    #     details={...}
    # )
```

### Duplicate Receipt Display

**Duplicate Visual Markers:**
```
┌────────────────────────────────────────┐
│       ***** DUPLICATE COPY *****       │ ← Watermark
│                                        │
│            ABC Store                   │
│         123 Main Street                │
│                                        │
│    ────────────────────────────────    │
│                                        │
│    Receipt No: REC-20260122-00042     │ ← Original number
│    Original Date: 22/01/2026          │ ← Original date
│    Reprint Date: 23/01/2026           │ ← Reprint date
│                                        │
│    [... rest of receipt ...]          │
│                                        │
│    This is a duplicate copy of the    │
│    original receipt issued on         │
│    22/01/2026 at 2:30 PM             │
│                                        │
└────────────────────────────────────────┘
```

### Update Receipt Model

**Add Fields to Receipt Model:**
```python
# In Receipt model

original_receipt = models.ForeignKey(
    'self',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='duplicates',
    help_text="Original receipt if this is a duplicate"
)

reprint_count = models.IntegerField(
    default=0,
    help_text="Number of times this receipt has been reprinted"
)
```

**Add Properties:**
```python
@property
def is_duplicate(self):
    """Returns True if this is a duplicate receipt"""
    return self.receipt_type == 'DUPLICATE'

@property
def is_original(self):
    """Returns True if this is an original receipt (not duplicate)"""
    return self.receipt_type in ['SALE', 'REFUND'] and not self.original_receipt

def get_original(self):
    """
    Get the original receipt.
    
    Returns:
        Receipt: Original receipt (self if original, or linked original)
    """
    if self.is_duplicate:
        return self.original_receipt
    return self
```

### Service Method

**Create Duplicate Service:**
```python
# In apps/pos/receipts/services/duplicate_handler.py

class DuplicateReceiptHandler:
    """
    Service for handling duplicate receipt operations.
    """
    
    @staticmethod
    def create_duplicate(original_receipt, requested_by=None):
        """
        Create duplicate receipt.
        
        Args:
            original_receipt: Original Receipt instance
            requested_by: User requesting duplicate
            
        Returns:
            Receipt: Duplicate receipt instance
        """
        # Delegate to model method
        return original_receipt.generate_duplicate(
            requested_by=requested_by
        )
    
    @staticmethod
    def get_reprint_history(original_receipt):
        """
        Get reprint history for receipt.
        
        Args:
            original_receipt: Original Receipt instance
            
        Returns:
            QuerySet: Duplicate receipts ordered by date
        """
        return original_receipt.duplicates.order_by('-generated_at')
```

### Usage Examples

**Create Duplicate Receipt:**
```python
# In view or service

from apps.pos.receipts.models import Receipt

# Load original receipt
original = Receipt.objects.get(receipt_number='REC-20260122-00042')

# Generate duplicate
duplicate = original.generate_duplicate(requested_by=request.user)

# Print duplicate
printer = ThermalPrinter()
printer.print_receipt(duplicate)
```

**Check Reprint History:**
```python
# Get reprint count
original = Receipt.objects.get(receipt_number='REC-20260122-00042')
print(f"Reprinted {original.reprint_count} times")

# Get all duplicates
duplicates = original.duplicates.all()
for dup in duplicates:
    print(f"Reprinted on {dup.generated_at}")
```

### Permissions and Limits

**Reprint Permissions:**
```python
def can_reprint_receipt(user, receipt):
    """
    Check if user can reprint receipt.
    
    Args:
        user: User instance
        receipt: Receipt instance
        
    Returns:
        bool: True if allowed
    """
    # Manager can always reprint
    if user.has_perm('receipts.reprint_receipt'):
        return True
    
    # Cashier can reprint own receipts (same day only)
    if receipt.created_by == user:
        days_old = (timezone.now() - receipt.generated_at).days
        if days_old == 0:
            return True
    
    return False
```

**Reprint Limits (Optional):**
```python
MAX_REPRINTS_PER_DAY = 5

def check_reprint_limit(receipt):
    """
    Check if reprint limit exceeded.
    
    Args:
        receipt: Receipt instance
        
    Returns:
        bool: True if within limit
        
    Raises:
        ValidationError: If limit exceeded
    """
    # Count reprints today
    today = timezone.now().date()
    today_reprints = receipt.duplicates.filter(
        generated_at__date=today
    ).count()
    
    if today_reprints >= MAX_REPRINTS_PER_DAY:
        raise ValidationError(
            f"Reprint limit exceeded ({MAX_REPRINTS_PER_DAY} per day)"
        )
    
    return True
```

### Expected Outcome

```python
# Model method added
original = Receipt.objects.get(receipt_number='REC-20260122-00042')
duplicate = original.generate_duplicate(requested_by=user)

print(duplicate.receipt_type)  # DUPLICATE
print(duplicate.receipt_number)  # REC-20260122-00042 (same as original)
print(duplicate.original_receipt)  # <Receipt: REC-20260122-00042>
print(duplicate.is_duplicate)  # True

# Original tracking
print(original.reprint_count)  # 1
print(original.duplicates.count())  # 1
```

### Verification Checklist
- [ ] generate_duplicate() method added to Receipt model
- [ ] original_receipt FK field added
- [ ] reprint_count field added
- [ ] Duplicate validation implemented
- [ ] Receipt type set to DUPLICATE
- [ ] Original receipt_data copied
- [ ] Duplicate markers added to receipt_data
- [ ] Reprint count incremented
- [ ] Reprint event logged
- [ ] is_duplicate property added
- [ ] get_original() method added
- [ ] DuplicateReceiptHandler service created (optional)
- [ ] Permission checking implemented
- [ ] Reprint limits implemented (optional)
- [ ] Duplicate visual markers documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Implement tax breakdown | VAT breakdown with rate, taxable, tax amount |
| 30 | Implement build_payments method | Payment methods with amounts and change |
| 31 | Implement build_footer method | Thank you, policy, website, custom lines |
| 32 | Implement build_qr_code | QR code URL for digital receipt access |
| 33 | Create receipt number generator | ReceiptNumberGenerator service |
| 34 | Add duplicate receipt handling | Duplicate generation and marking |

### Complete ReceiptBuilder Structure
```python
class ReceiptBuilder:
    def __init__(self, cart, template=None)
    def build() → Complete receipt JSON
    def validate_cart()
    
    # Section builders
    def build_header() → Business info, address, VAT
    def build_transaction_info() → Receipt #, date, cashier
    def build_items() → Items with variants and prices
    def build_totals() → Subtotal, discount, tax, total
    def build_payments() → Payment methods and change
    def build_footer() → Thank you, policy, contact
    def build_qr_code() → QR code for digital access
```

### Receipt Generation Complete Flow
```
1. Cart Completed
    ↓
2. Generate Receipt Number (ReceiptNumberGenerator)
    REC-20260122-00042
    ↓
3. Build Receipt Data (ReceiptBuilder)
    ├── Header (business info)
    ├── Transaction (date, cashier)
    ├── Items (products with variants)
    ├── Totals (subtotal, tax, total)
    ├── Payments (methods, change)
    ├── Footer (thank you, policy)
    └── QR Code (digital access)
    ↓
4. Create Receipt Record
    Save to database with receipt_data JSON
    ↓
5. Print Receipt (Group C)
    Send to thermal printer
    ↓
6. Optional: Email Receipt
    Send digital copy to customer
    ↓
7. Optional: Reprint (Duplicate)
    Generate duplicate with markers
```

### Receipt Data JSON Complete Structure
```json
{
  "schema_version": "1.0",
  "generated_at": "2026-01-22T14:30:45Z",
  "header": {
    "business_name": "ABC Store",
    "address_line_1": "123 Main Street",
    "vat_number": "VAT123456789"
  },
  "transaction": {
    "receipt_number": "REC-20260122-00042",
    "date": "2026-01-22",
    "cashier_name": "John Perera"
  },
  "items": [...],
  "totals": {
    "subtotal": 5400.00,
    "discount_total": 100.00,
    "tax_total": 691.30,
    "grand_total": 5991.30,
    "tax_breakdown": [...]
  },
  "payments": [...],
  "footer": {...},
  "qr_code": {...}
}
```

### Database Schema Impact
```sql
-- Receipt model (Tasks 17-22)
CREATE TABLE pos_receipts (...);

-- Receipt sequence (Task 33)
CREATE TABLE pos_receipt_sequences (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    date DATE NOT NULL,
    current_sequence INTEGER DEFAULT 0,
    UNIQUE(tenant_id, date)
);

-- Duplicate tracking (Task 34)
ALTER TABLE pos_receipts ADD COLUMN original_receipt_id UUID REFERENCES pos_receipts(id);
ALTER TABLE pos_receipts ADD COLUMN reprint_count INTEGER DEFAULT 0;
```

### Group B Completion Status
✓ All 18 tasks (17-34) completed
✓ Receipt model fully defined
✓ ReceiptBuilder service complete
✓ Receipt number generator implemented
✓ Duplicate receipt handling added
✓ Ready for printer integration (Group C)

### Next Steps
1. **Proceed to Group C** - Thermal Printer Integration
2. **Implement printer drivers**
3. **Test receipt generation end-to-end**
4. **Configure receipt templates**

---

## Notes for AI Agents

1. **Tax Compliance:** VAT breakdown follows Sri Lankan requirements
2. **Payment Methods:** Support common Sri Lankan payment methods (Cash, Card, FriendsPay, eZ Cash)
3. **QR Codes:** Digital receipt access enhances customer experience
4. **Receipt Numbers:** Sequential, daily-reset format is standard for retail
5. **Duplicate Handling:** Essential for customer service and audit compliance
6. **Thread Safety:** Receipt number generation uses database locks
7. **Error Handling:** All services have retry logic and error logging
8. **Immutability:** Original receipt_data never changes, duplicates preserve exact copy
9. **Audit Trail:** All reprints are logged for compliance
10. **Testing:** Each service method should be unit-testable independently
