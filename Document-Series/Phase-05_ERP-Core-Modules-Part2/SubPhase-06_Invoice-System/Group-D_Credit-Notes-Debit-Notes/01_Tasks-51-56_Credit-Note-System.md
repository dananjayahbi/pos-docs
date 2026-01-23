# Tasks 51-56: Credit Note System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** D - Credit Notes & Debit Notes  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-57-62_Debit-Note-Balance.md](02_Tasks-57-62_Debit-Note-Balance.md)

---

## Document Overview

This document covers the implementation of credit notes, including reason codes, creation workflow, number generation, line items, and application to invoices.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Define CreditNoteReason Choices | Low | 15 min |
| 52 | Define DebitNoteReason Choices | Low | 15 min |
| 53 | Implement Credit Note Creation | High | 30 min |
| 54 | Add Credit Note Number Generator | Medium | 20 min |
| 55 | Implement Credit Note Line Items | Medium | 25 min |
| 56 | Implement Credit Note Application | Medium | 25 min |

---

## Task 51: Define CreditNoteReason Choices

### Overview
Define the enumeration of valid reasons for issuing credit notes to customers, ensuring proper documentation and audit trails.

### Dependencies
- Task 07: Invoice Model (Group A)

### Instructions

1. **Open constants file**
   - Open or create `apps/invoices/constants.py`
   - Add credit note reason constants

2. **Define CreditNoteReason choices**
   - Use Django TextChoices or traditional tuple format
   - Include value and display label

3. **Add reason types**
   - RETURN: Customer returned goods
   - OVERCHARGE: Overcharged on original invoice
   - DISCOUNT: Post-invoice discount applied
   - DAMAGED: Goods received damaged
   - GOODWILL: Goodwill gesture
   - ERROR: Invoicing error
   - OTHER: Other reason (requires notes)

4. **Add reason descriptions**
   - Include help_text for each reason
   - Explain when to use each reason
   - Provide examples

5. **Add to Invoice model**
   - Import CreditNoteReason in models
   - Use in credit_note_reason field
   - Make available for selection

### CreditNoteReason Implementation

```python
from django.db import models

class CreditNoteReason(models.TextChoices):
    """
    Reasons for issuing credit notes to reduce invoice balances
    """
    RETURN = 'RETURN', 'Customer Returned Goods'
    OVERCHARGE = 'OVERCHARGE', 'Overcharged on Invoice'
    DISCOUNT = 'DISCOUNT', 'Post-Invoice Discount'
    DAMAGED = 'DAMAGED', 'Goods Damaged/Defective'
    GOODWILL = 'GOODWILL', 'Goodwill Gesture'
    ERROR = 'ERROR', 'Invoicing Error'
    PARTIAL_REFUND = 'PARTIAL_REFUND', 'Partial Refund'
    CANCELLED_ORDER = 'CANCELLED_ORDER', 'Order Cancelled'
    OTHER = 'OTHER', 'Other Reason'
```

### Credit Note Reason Use Cases

| Reason | When to Use | Example |
|--------|-------------|---------|
| **RETURN** | Customer returns products | Customer returns 5 units of Product A |
| **OVERCHARGE** | Pricing error on original invoice | Charged LKR 1,000 instead of LKR 800 |
| **DISCOUNT** | Discount given after invoicing | 10% volume discount applied retroactively |
| **DAMAGED** | Products arrived damaged | 3 units damaged in transit |
| **GOODWILL** | Customer satisfaction gesture | Apology for delay, LKR 5,000 credit |
| **ERROR** | Wrong product/quantity invoiced | Invoiced 100 units instead of 10 |
| **PARTIAL_REFUND** | Partial service/product issue | Service partially completed |
| **CANCELLED_ORDER** | Order cancelled after invoicing | Customer cancelled before delivery |
| **OTHER** | Any other reason | Must provide detailed notes |

### Reason Documentation Requirements

```python
REASON_DOCUMENTATION = {
    'RETURN': {
        'requires_notes': True,
        'requires_approval': False,
        'affects_inventory': True,
        'notes_prompt': 'Specify returned items and return authorization number'
    },
    'OVERCHARGE': {
        'requires_notes': True,
        'requires_approval': True,
        'affects_inventory': False,
        'notes_prompt': 'Explain pricing discrepancy'
    },
    'DAMAGED': {
        'requires_notes': True,
        'requires_approval': False,
        'affects_inventory': True,
        'notes_prompt': 'Describe damage and attach photos if available'
    },
    'OTHER': {
        'requires_notes': True,
        'requires_approval': True,
        'affects_inventory': False,
        'notes_prompt': 'Provide detailed explanation for credit note'
    }
}
```

### Expected Outcome
- CreditNoteReason choices defined
- Clear documentation for each reason
- Ready for use in models

### Verification Checklist
- [ ] CreditNoteReason class created
- [ ] All reason types defined
- [ ] Display labels clear
- [ ] Documentation added
- [ ] Use cases documented

---

## Task 52: Define DebitNoteReason Choices

### Overview
Define the enumeration of valid reasons for issuing debit notes to customers, which increase invoice balances.

### Dependencies
- Task 51: Define CreditNoteReason Choices

### Instructions

1. **Define DebitNoteReason choices**
   - Add to `apps/invoices/constants.py`
   - Follow same pattern as CreditNoteReason

2. **Add reason types**
   - UNDERCHARGE: Undercharged on original invoice
   - ADDITIONAL_CHARGE: Additional charges incurred
   - INTEREST: Interest on late payment
   - SHIPPING: Additional shipping charges
   - ADJUSTMENT: Price adjustment
   - PENALTY: Penalty charge
   - OTHER: Other reason (requires notes)

3. **Add reason descriptions**
   - Include help_text for each reason
   - Explain when to use each reason
   - Provide examples

4. **Add to Invoice model**
   - Use in debit_note_reason field
   - Make available for selection

### DebitNoteReason Implementation

```python
class DebitNoteReason(models.TextChoices):
    """
    Reasons for issuing debit notes to increase invoice balances
    """
    UNDERCHARGE = 'UNDERCHARGE', 'Undercharged on Invoice'
    ADDITIONAL_CHARGE = 'ADDITIONAL_CHARGE', 'Additional Charges'
    INTEREST = 'INTEREST', 'Interest on Late Payment'
    SHIPPING = 'SHIPPING', 'Additional Shipping Charges'
    ADJUSTMENT = 'ADJUSTMENT', 'Price Adjustment'
    PENALTY = 'PENALTY', 'Penalty Charge'
    HANDLING = 'HANDLING', 'Additional Handling Fees'
    SERVICES = 'SERVICES', 'Additional Services'
    OTHER = 'OTHER', 'Other Reason'
```

### Debit Note Reason Use Cases

| Reason | When to Use | Example |
|--------|-------------|---------|
| **UNDERCHARGE** | Pricing error (charged too little) | Charged LKR 800 instead of LKR 1,000 |
| **ADDITIONAL_CHARGE** | Extra costs discovered after invoicing | Installation charges not initially included |
| **INTEREST** | Late payment interest | 2% monthly interest on overdue amount |
| **SHIPPING** | Extra shipping costs | Rush delivery requested after invoicing |
| **ADJUSTMENT** | Price correction | Currency fluctuation adjustment |
| **PENALTY** | Penalty for contract violation | Late delivery penalty |
| **HANDLING** | Special handling required | Hazardous material handling fee |
| **SERVICES** | Additional services provided | Extra support hours |
| **OTHER** | Any other reason | Must provide detailed notes |

### Reason Validation Rules

```python
DEBIT_REASON_RULES = {
    'INTEREST': {
        'requires_calculation': True,
        'requires_approval': False,
        'calculation_method': 'compound_monthly',
        'max_rate': 2.0  # 2% per month
    },
    'UNDERCHARGE': {
        'requires_notes': True,
        'requires_approval': True,
        'requires_documentation': True
    },
    'PENALTY': {
        'requires_notes': True,
        'requires_approval': True,
        'requires_contract_reference': True
    }
}
```

### Credit vs Debit Note Comparison

| Aspect | Credit Note | Debit Note |
|--------|-------------|------------|
| **Purpose** | Reduce invoice amount | Increase invoice amount |
| **Effect** | Customer owes less | Customer owes more |
| **Common reasons** | Returns, discounts, errors | Undercharges, additional costs |
| **Customer reaction** | Positive (refund/credit) | Negative (additional payment) |
| **Approval** | Generally not required | Often requires approval |

### Expected Outcome
- DebitNoteReason choices defined
- Clear documentation for each reason
- Validation rules documented

### Verification Checklist
- [ ] DebitNoteReason class created
- [ ] All reason types defined
- [ ] Display labels clear
- [ ] Use cases documented
- [ ] Validation rules defined

---

## Task 53: Implement Credit Note Creation

### Overview
Implement the service method to create credit notes linked to original invoices, reducing customer balances.

### Dependencies
- Task 51: Define CreditNoteReason Choices
- Task 35: Create InvoiceService Class

### Instructions

1. **Add create_credit_note method**
   - Add to `apps/invoices/services/credit_note_service.py` or InvoiceService
   - Accept original_invoice_id, reason, amount, items, user
   - Return created credit note (Invoice instance)

2. **Validate original invoice**
   - Fetch original invoice by ID
   - Check invoice is ISSUED or higher status
   - Cannot create credit for DRAFT
   - Cannot create credit for CANCELLED/VOID

3. **Validate credit amount**
   - Check credit amount > 0
   - Check credit amount <= remaining balance
   - Cannot exceed original invoice total
   - Consider existing credits

4. **Create credit note invoice**
   - Create Invoice instance
   - Set type to CREDIT_NOTE
   - Set status to ISSUED (credit notes are immediately issued)
   - Generate credit note number (Task 54)

5. **Link to original invoice**
   - Set related_invoice FK to original invoice
   - This maintains the relationship

6. **Copy customer details**
   - Copy all customer information from original
   - Copy billing address
   - Maintain same customer reference

7. **Set credit note metadata**
   - Set credit_note_reason from parameter
   - Set reason_notes (detailed explanation)
   - Set issue_date to today
   - Set created_by to user

8. **Handle line items**
   - If full credit: copy all line items (Task 55)
   - If partial credit: copy selected line items
   - If amount-only credit: create single line item

9. **Calculate totals**
   - Calculate subtotal from line items
   - Calculate taxes
   - Set total_amount (negative for credit)

10. **Save and log**
    - Save credit note
    - Log to InvoiceHistory
    - Create notification

11. **Return credit note**
    - Return created credit note instance

### Credit Note Creation Flow

```
┌──────────────────────┐
│ Original Invoice     │
│ INV-2026-00001       │
│ Total: LKR 50,000    │
│ Status: ISSUED       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validate Request     │
│ - Status valid?      │
│ - Amount valid?      │
│ - Reason provided?   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Create Credit Note   │
│ CN-2026-00001        │
│ Type: CREDIT_NOTE    │
│ Status: ISSUED       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Copy Details         │
│ - Customer info      │
│ - Billing address    │
│ - Link to original   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Add Line Items       │
│ [Task 55]            │
│ Amount: -LKR 10,000  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate Totals     │
│ Total: -LKR 10,000   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Save & Log History   │
│ Return Credit Note   │
└──────────────────────┘
```

### Credit Note Service Method

```python
def create_credit_note(
    original_invoice_id,
    reason,
    amount,
    items=None,
    reason_notes='',
    user=None
):
    """
    Create a credit note for an invoice
    
    Args:
        original_invoice_id: UUID of original invoice
        reason: CreditNoteReason choice
        amount: Credit amount (positive number)
        items: List of line items to credit (optional)
        reason_notes: Detailed explanation
        user: User creating the credit note
        
    Returns:
        Invoice: Created credit note
    """
    # Implementation in next tasks
    pass
```

### Credit Note Validation Rules

| Check | Rule |
|-------|------|
| Original invoice status | Must be ISSUED, SENT, PARTIAL, or OVERDUE |
| Credit amount | Must be > 0 and <= remaining balance |
| Reason | Must be valid CreditNoteReason |
| Reason notes | Required for certain reasons |
| User permission | Must have credit_note.create permission |

### Expected Outcome
- Credit note creation method implemented
- Validation in place
- Linked to original invoice
- History logged

### Verification Checklist
- [ ] `create_credit_note()` method implemented
- [ ] Original invoice validation works
- [ ] Amount validation works
- [ ] Credit note created with correct type
- [ ] Customer details copied
- [ ] Link to original established
- [ ] History logged

---

## Task 54: Add Credit Note Number Generator

### Overview
Implement credit note number generation following a tenant-specific format, separate from invoice numbering.

### Dependencies
- Task 53: Implement Credit Note Creation

### Instructions

1. **Add to InvoiceSettings**
   - Ensure credit_note_prefix field exists (Task 47)
   - Ensure credit_note_format field exists
   - Default: "{PREFIX}-{YEAR}-{SEQ:05d}"

2. **Create generate_credit_note_number method**
   - Add to InvoiceService or separate utility
   - Accept tenant parameter
   - Return formatted credit note number

3. **Implement sequence management**
   - Track credit note sequence separately from invoices
   - Use database sequence or counter table
   - Reset yearly if configured

4. **Format number**
   - Replace {PREFIX} with credit_note_prefix
   - Replace {YEAR} with current year
   - Replace {SEQ} with sequence number
   - Zero-pad sequence as specified

5. **Handle collisions**
   - Check uniqueness within tenant
   - Retry with next sequence if collision
   - Handle concurrent requests with locking

6. **Support custom formats**
   - Allow "{PREFIX}/{YEAR}/{SEQ}"
   - Allow "{PREFIX}-{MONTH}{YEAR}-{SEQ}"
   - Parse format string dynamically

7. **Integration**
   - Call in create_credit_note method
   - Set as invoice_number field
   - Display on credit note PDF

### Credit Note Number Generation

```python
def generate_credit_note_number(tenant):
    """
    Generate unique credit note number for tenant
    
    Args:
        tenant: Tenant instance
        
    Returns:
        str: Formatted credit note number
    """
    from django.db import transaction
    from datetime import date
    
    settings = tenant.invoice_settings
    
    with transaction.atomic():
        # Get current year
        current_year = date.today().year
        
        # Get next sequence
        # Option 1: Database sequence
        sequence = get_next_credit_sequence(tenant, current_year)
        
        # Option 2: Atomic counter
        # sequence = increment_credit_counter(tenant)
        
        # Format number
        credit_number = settings.credit_note_format.format(
            PREFIX=settings.credit_note_prefix,
            YEAR=current_year,
            SEQ=sequence
        )
        
        # Verify uniqueness
        while Invoice.objects.filter(
            tenant=tenant,
            invoice_number=credit_number
        ).exists():
            sequence += 1
            credit_number = settings.credit_note_format.format(
                PREFIX=settings.credit_note_prefix,
                YEAR=current_year,
                SEQ=sequence
            )
        
        return credit_number
```

### Number Format Examples

| Format | Example Output |
|--------|---------------|
| `CN-{YEAR}-{SEQ:05d}` | CN-2026-00001 |
| `{PREFIX}/{YEAR}/{SEQ:04d}` | CN/2026/0001 |
| `{PREFIX}-{YEAR}{MONTH}-{SEQ}` | CN-202601-1 |
| `CR{YEAR:02d}{SEQ:06d}` | CR2600001 |

### Sequence Management

```python
def get_next_credit_sequence(tenant, year):
    """
    Get next credit note sequence number for tenant and year
    """
    from apps.invoices.models import InvoiceSequence
    
    sequence_record, created = InvoiceSequence.objects.get_or_create(
        tenant=tenant,
        document_type='CREDIT_NOTE',
        year=year,
        defaults={'last_sequence': 0}
    )
    
    sequence_record.last_sequence += 1
    sequence_record.save()
    
    return sequence_record.last_sequence
```

### Expected Outcome
- Credit note numbers generated automatically
- Unique within tenant
- Configurable format
- Separate from invoice numbering

### Verification Checklist
- [ ] Number generation method implemented
- [ ] Sequence management in place
- [ ] Format string parsing works
- [ ] Uniqueness ensured
- [ ] Yearly reset supported
- [ ] Integration with create_credit_note

---

## Task 55: Implement Credit Note Line Items

### Overview
Implement logic to copy selected line items from the original invoice to the credit note, supporting full and partial credits.

### Dependencies
- Task 53: Implement Credit Note Creation

### Instructions

1. **Add copy_credit_line_items method**
   - Add to CreditNoteService
   - Accept original_invoice, credit_note, items_to_credit
   - Create InvoiceLineItem instances

2. **Support full credit**
   - If items_to_credit is None or 'all'
   - Copy all line items from original invoice
   - Negate all amounts

3. **Support partial credit by selection**
   - If items_to_credit is list of line item IDs
   - Copy only selected line items
   - Negate amounts

4. **Support partial credit by quantity**
   - If items_to_credit includes quantities
   - E.g., [{'line_id': 'uuid', 'quantity': 5}]
   - Pro-rate amounts based on quantity

5. **Support amount-only credit**
   - If no items specified, just amount
   - Create single line item
   - Description: "Credit adjustment"
   - Amount: negative credit amount

6. **Negate all amounts**
   - line_total should be negative
   - quantity can stay positive
   - unit_price can stay positive or be negative
   - tax_amount should be negative

7. **Copy product references**
   - Copy product FK (if exists)
   - Copy product_name snapshot
   - Copy product_code snapshot

8. **Copy tax information**
   - Copy tax_rate
   - Copy tax_type
   - Calculate negative tax_amount

9. **Set line metadata**
   - Set references to original line items
   - Track which original lines are credited
   - Set line_number sequentially

10. **Validate line totals**
    - Sum of credit line items should equal credit amount
    - Ensure no positive amounts
    - Validate tax calculations

### Line Item Copying Scenarios

#### Scenario 1: Full Credit
```
Original Invoice Line Items:
1. Product A × 10 @ LKR 500 = LKR 5,000
2. Product B × 5 @ LKR 200 = LKR 1,000
Subtotal: LKR 6,000, VAT: LKR 720, Total: LKR 6,720

Credit Note Line Items:
1. Product A × 10 @ LKR 500 = -LKR 5,000
2. Product B × 5 @ LKR 200 = -LKR 1,000
Subtotal: -LKR 6,000, VAT: -LKR 720, Total: -LKR 6,720
```

#### Scenario 2: Partial Credit (Selected Items)
```
Original Invoice Line Items:
1. Product A × 10 @ LKR 500 = LKR 5,000
2. Product B × 5 @ LKR 200 = LKR 1,000

Credit Note Line Items (return Product A only):
1. Product A × 10 @ LKR 500 = -LKR 5,000
Subtotal: -LKR 5,000, VAT: -LKR 600, Total: -LKR 5,600
```

#### Scenario 3: Partial Credit (Quantity)
```
Original Invoice Line Items:
1. Product A × 10 @ LKR 500 = LKR 5,000

Credit Note Line Items (return 3 units):
1. Product A × 3 @ LKR 500 = -LKR 1,500
Subtotal: -LKR 1,500, VAT: -LKR 180, Total: -LKR 1,680
```

#### Scenario 4: Amount-Only Credit
```
Credit Note Line Items:
1. Credit Adjustment × 1 @ LKR 1,000 = -LKR 1,000
Subtotal: -LKR 1,000, VAT: -LKR 120, Total: -LKR 1,120
```

### Implementation

```python
def copy_credit_line_items(original_invoice, credit_note, items_to_credit=None):
    """
    Copy line items from original invoice to credit note
    
    Args:
        original_invoice: Original Invoice instance
        credit_note: Credit note Invoice instance
        items_to_credit: None (full), list of IDs, or list of dicts with quantities
    """
    if items_to_credit is None or items_to_credit == 'all':
        # Full credit - copy all items
        original_items = original_invoice.line_items.all()
        for item in original_items:
            create_credit_line_item(credit_note, item, item.quantity)
    
    elif isinstance(items_to_credit, list):
        # Partial credit
        for item_spec in items_to_credit:
            if isinstance(item_spec, dict):
                # {'line_id': 'uuid', 'quantity': 3}
                original_item = InvoiceLineItem.objects.get(id=item_spec['line_id'])
                quantity = item_spec.get('quantity', original_item.quantity)
                create_credit_line_item(credit_note, original_item, quantity)
            else:
                # Just line item ID
                original_item = InvoiceLineItem.objects.get(id=item_spec)
                create_credit_line_item(credit_note, original_item, original_item.quantity)


def create_credit_line_item(credit_note, original_item, quantity):
    """
    Create a single credit note line item
    """
    InvoiceLineItem.objects.create(
        tenant=credit_note.tenant,
        invoice=credit_note,
        product=original_item.product,
        product_name=original_item.product_name,
        product_code=original_item.product_code,
        description=original_item.description,
        quantity=quantity,
        unit_price=original_item.unit_price,
        line_total=-abs(original_item.unit_price * quantity),  # Negative
        discount_percentage=original_item.discount_percentage,
        discount_amount=-abs(original_item.discount_amount * quantity / original_item.quantity),
        tax_rate=original_item.tax_rate,
        tax_type=original_item.tax_type,
        tax_amount=-abs(calculate_tax(line_total, tax_rate)),  # Negative
        line_number=credit_note.line_items.count() + 1
    )
```

### Expected Outcome
- Line items copied to credit note
- All amounts negated appropriately
- Full and partial credit supported
- Quantity-based credit supported

### Verification Checklist
- [ ] `copy_credit_line_items()` method implemented
- [ ] Full credit works
- [ ] Partial credit by selection works
- [ ] Partial credit by quantity works
- [ ] Amount-only credit works
- [ ] All amounts negative
- [ ] Tax calculations correct

---

## Task 56: Implement Credit Note Application

### Overview
Implement the logic to apply credit notes to original invoices, reducing the balance due and updating status.

### Dependencies
- Task 55: Implement Credit Note Line Items

### Instructions

1. **Add apply_credit_note method**
   - Add to InvoiceService
   - Accept credit_note_id
   - Update original invoice balance

2. **Fetch credit note**
   - Get credit note by ID
   - Verify it's a CREDIT_NOTE type
   - Get related original invoice

3. **Validate application**
   - Check credit note not already applied
   - Check original invoice not PAID/CANCELLED/VOID
   - Check credit amount valid

4. **Update original invoice**
   - Increase total_credits_applied
   - Decrease balance_due
   - Recalculate status

5. **Update credit note**
   - Set applied_at timestamp
   - Set applied_by user
   - Set is_applied flag

6. **Recalculate invoice status**
   - If balance_due = 0 → PAID
   - If balance_due < original total → PARTIAL
   - If balance_due > 0 → keep current status

7. **Track in invoice**
   - Add credit note to invoice.credit_notes collection
   - Store credit_note_id reference

8. **Log history**
   - Log CREDIT_NOTE_APPLIED event
   - Include credit amount
   - Include new balance

9. **Send notification**
   - Notify customer of credit
   - Email credit note PDF
   - Update account balance

10. **Return updated invoice**
    - Return original invoice with updated balance

### Credit Note Application Flow

```
┌──────────────────────┐
│ Credit Note Created  │
│ CN-2026-00001        │
│ Amount: -LKR 10,000  │
│ Status: ISSUED       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validate Application │
│ - Not already applied│
│ - Invoice valid      │
│ - Amount valid       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Original Invoice     │
│ INV-2026-00001       │
│ Balance: LKR 50,000  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Apply Credit         │
│ Balance -= 10,000    │
│ New Balance: 40,000  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Update Status        │
│ ISSUED → PARTIAL     │
│ (if partially paid)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Log History          │
│ Send Notification    │
└──────────────────────┘
```

### Balance Calculation with Credits

```python
def recalculate_invoice_balance(invoice):
    """
    Recalculate invoice balance considering credits and debits
    """
    balance = invoice.total_amount  # Original total
    balance -= invoice.amount_paid  # Subtract payments
    balance -= invoice.total_credits_applied  # Subtract credits
    balance += invoice.total_debits_applied  # Add debits
    
    invoice.balance_due = balance
    invoice.save()
    
    return balance
```

### Application Method

```python
def apply_credit_note(credit_note_id, user=None):
    """
    Apply a credit note to reduce invoice balance
    
    Args:
        credit_note_id: UUID of credit note
        user: User applying the credit
        
    Returns:
        Invoice: Updated original invoice
    """
    credit_note = Invoice.objects.get(id=credit_note_id)
    
    # Validate
    if credit_note.type != InvoiceType.CREDIT_NOTE:
        raise ValueError("Not a credit note")
    
    if credit_note.is_applied:
        raise ValueError("Credit note already applied")
    
    original_invoice = credit_note.related_invoice
    
    # Apply credit
    credit_amount = abs(credit_note.total_amount)
    original_invoice.total_credits_applied += credit_amount
    original_invoice.balance_due -= credit_amount
    
    # Update status
    if original_invoice.balance_due <= 0:
        original_invoice.status = InvoiceStatus.PAID
    elif original_invoice.balance_due < original_invoice.total_amount:
        original_invoice.status = InvoiceStatus.PARTIAL
    
    original_invoice.save()
    
    # Mark credit as applied
    credit_note.is_applied = True
    credit_note.applied_at = timezone.now()
    credit_note.applied_by = user
    credit_note.save()
    
    # Log history
    log_invoice_history(
        invoice=original_invoice,
        event_type=InvoiceHistoryEvent.CREDIT_NOTE_APPLIED,
        user=user,
        metadata={
            'credit_note_id': str(credit_note.id),
            'credit_note_number': credit_note.invoice_number,
            'credit_amount': credit_amount,
            'new_balance': original_invoice.balance_due
        }
    )
    
    return original_invoice
```

### Expected Outcome
- Credit notes applied to invoices
- Balances updated correctly
- Status recalculated
- History logged

### Verification Checklist
- [ ] `apply_credit_note()` method implemented
- [ ] Validation in place
- [ ] Balance calculation correct
- [ ] Status updated appropriately
- [ ] Credit marked as applied
- [ ] History logged
- [ ] Notifications sent

---

## Summary

This document covered the complete credit note system implementation including reason codes, creation, numbering, line items, and application to invoices.

**Key Deliverables:**
- CreditNoteReason and DebitNoteReason choices
- Credit note creation workflow
- Credit note number generation
- Line item copying (full and partial)
- Credit application to invoices
- Balance recalculation

**Next Steps:**
- Proceed to [02_Tasks-57-62_Debit-Note-Balance.md](02_Tasks-57-62_Debit-Note-Balance.md)
