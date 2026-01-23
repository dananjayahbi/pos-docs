# Tasks 57-62: Debit Note System & Balance Recalculation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** D - Credit Notes & Debit Notes  
> **Document:** 02 of 03  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-56_Credit-Note-System.md](01_Tasks-51-56_Credit-Note-System.md)
- **→ Next Document:** [03_Tasks-63-66_PDF-Templates-Validation-Migration.md](03_Tasks-63-66_PDF-Templates-Validation-Migration.md)

---

## Document Overview

This document covers debit note implementation, application to invoices, linkage management, and comprehensive balance recalculation logic.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Implement Debit Note Creation | High | 30 min |
| 58 | Add Debit Note Number Generator | Medium | 20 min |
| 59 | Implement Debit Note Line Items | Medium | 25 min |
| 60 | Implement Debit Note Application | Medium | 25 min |
| 61 | Link Credit/Debit to Original Invoice | Medium | 20 min |
| 62 | Implement Invoice Balance Recalculation | Medium | 25 min |

---

## Task 57: Implement Debit Note Creation

### Overview
Implement the service method to create debit notes linked to original invoices, increasing customer balances for additional charges.

### Dependencies
- Task 52: Define DebitNoteReason Choices
- Task 35: Create InvoiceService Class

### Instructions

1. **Add create_debit_note method**
   - Add to `apps/invoices/services/debit_note_service.py` or InvoiceService
   - Accept original_invoice_id, reason, amount, items, user
   - Return created debit note (Invoice instance)

2. **Validate original invoice**
   - Fetch original invoice by ID
   - Check invoice is ISSUED or higher status
   - Cannot create debit for DRAFT
   - Cannot create debit for CANCELLED/VOID

3. **Validate debit amount**
   - Check debit amount > 0
   - No upper limit (can exceed original invoice)
   - Requires approval if amount is large

4. **Create debit note invoice**
   - Create Invoice instance
   - Set type to DEBIT_NOTE
   - Set status to ISSUED (debit notes are immediately issued)
   - Generate debit note number (Task 58)

5. **Link to original invoice**
   - Set related_invoice FK to original invoice
   - This maintains the relationship

6. **Copy customer details**
   - Copy all customer information from original
   - Copy billing address
   - Maintain same customer reference

7. **Set debit note metadata**
   - Set debit_note_reason from parameter
   - Set reason_notes (detailed explanation)
   - Set issue_date to today
   - Set created_by to user

8. **Handle line items**
   - Create line items for additional charges (Task 59)
   - Amounts should be positive (increasing balance)

9. **Calculate totals**
   - Calculate subtotal from line items
   - Calculate taxes
   - Set total_amount (positive for debit)

10. **Require approval**
    - If configured in settings
    - Set requires_approval flag
    - Set status to PENDING_APPROVAL
    - Notify approvers

11. **Save and log**
    - Save debit note
    - Log to InvoiceHistory
    - Create notification

12. **Return debit note**
    - Return created debit note instance

### Debit Note Creation Flow

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
│ Additional Charges   │
│ Identified           │
│ Amount: LKR 5,000    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validate Request     │
│ - Status valid?      │
│ - Reason provided?   │
│ - Approval needed?   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Create Debit Note    │
│ DN-2026-00001        │
│ Type: DEBIT_NOTE     │
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
│ [Task 59]            │
│ Amount: +LKR 5,000   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Calculate Totals     │
│ Total: +LKR 5,000    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Save & Log History   │
│ Return Debit Note    │
└──────────────────────┘
```

### Debit Note Service Method

```python
def create_debit_note(
    original_invoice_id,
    reason,
    amount,
    items=None,
    reason_notes='',
    user=None
):
    """
    Create a debit note for an invoice
    
    Args:
        original_invoice_id: UUID of original invoice
        reason: DebitNoteReason choice
        amount: Debit amount (positive number)
        items: List of line items for charges
        reason_notes: Detailed explanation
        user: User creating the debit note
        
    Returns:
        Invoice: Created debit note
    """
    # Validate original invoice
    original = Invoice.objects.get(id=original_invoice_id)
    if original.status not in [InvoiceStatus.ISSUED, InvoiceStatus.SENT, InvoiceStatus.PARTIAL]:
        raise ValidationError("Cannot create debit note for this invoice status")
    
    # Create debit note
    debit_note = Invoice.objects.create(
        tenant=original.tenant,
        type=InvoiceType.DEBIT_NOTE,
        status=InvoiceStatus.ISSUED,
        related_invoice=original,
        customer=original.customer,
        # Copy billing details
        billing_name=original.billing_name,
        billing_email=original.billing_email,
        # ... more fields
        debit_note_reason=reason,
        reason_notes=reason_notes,
        issue_date=date.today(),
        created_by=user
    )
    
    # Generate number
    debit_note.invoice_number = generate_debit_note_number(original.tenant)
    debit_note.save()
    
    return debit_note
```

### Debit Note Validation Rules

| Check | Rule |
|-------|------|
| Original invoice status | Must be ISSUED, SENT, or PARTIAL |
| Debit amount | Must be > 0 |
| Reason | Must be valid DebitNoteReason |
| Reason notes | Required for most reasons |
| Approval | Required if amount > threshold |
| User permission | Must have debit_note.create permission |

### Expected Outcome
- Debit note creation method implemented
- Validation in place
- Linked to original invoice
- History logged
- Approval workflow supported

### Verification Checklist
- [ ] `create_debit_note()` method implemented
- [ ] Original invoice validation works
- [ ] Amount validation works
- [ ] Debit note created with correct type
- [ ] Customer details copied
- [ ] Link to original established
- [ ] Approval workflow integrated
- [ ] History logged

---

## Task 58: Add Debit Note Number Generator

### Overview
Implement debit note number generation following a tenant-specific format, separate from invoices and credit notes.

### Dependencies
- Task 57: Implement Debit Note Creation

### Instructions

1. **Add to InvoiceSettings**
   - Ensure debit_note_prefix field exists (Task 47)
   - Ensure debit_note_format field exists
   - Default: "{PREFIX}-{YEAR}-{SEQ:05d}"

2. **Create generate_debit_note_number method**
   - Add to InvoiceService or separate utility
   - Accept tenant parameter
   - Return formatted debit note number

3. **Implement sequence management**
   - Track debit note sequence separately
   - Use database sequence or counter table
   - Reset yearly if configured

4. **Format number**
   - Replace {PREFIX} with debit_note_prefix (DN)
   - Replace {YEAR} with current year
   - Replace {SEQ} with sequence number
   - Zero-pad sequence as specified

5. **Handle collisions**
   - Check uniqueness within tenant
   - Retry with next sequence if collision
   - Handle concurrent requests with locking

6. **Support custom formats**
   - Same flexibility as credit note numbers
   - Parse format string dynamically

7. **Integration**
   - Call in create_debit_note method
   - Set as invoice_number field
   - Display on debit note PDF

### Number Format Examples

| Format | Example Output |
|--------|---------------|
| `DN-{YEAR}-{SEQ:05d}` | DN-2026-00001 |
| `{PREFIX}/{YEAR}/{SEQ:04d}` | DN/2026/0001 |
| `{PREFIX}-{YEAR}{MONTH}-{SEQ}` | DN-202601-1 |
| `DB{YEAR:02d}{SEQ:06d}` | DB2600001 |

### Expected Outcome
- Debit note numbers generated automatically
- Unique within tenant
- Configurable format
- Separate from invoice and credit note numbering

### Verification Checklist
- [ ] Number generation method implemented
- [ ] Sequence management in place
- [ ] Format string parsing works
- [ ] Uniqueness ensured
- [ ] Yearly reset supported
- [ ] Integration with create_debit_note

---

## Task 59: Implement Debit Note Line Items

### Overview
Implement logic to create line items for debit notes representing additional charges or adjustments.

### Dependencies
- Task 57: Implement Debit Note Creation

### Instructions

1. **Add create_debit_line_items method**
   - Add to DebitNoteService
   - Accept debit_note, items_list
   - Create InvoiceLineItem instances

2. **Support itemized charges**
   - Accept list of charge items
   - Each with description, amount, tax info
   - E.g., [{'description': 'Rush shipping', 'amount': 2000, 'tax_rate': 12}]

3. **Support simple charge**
   - If only total amount provided
   - Create single line item
   - Description based on reason

4. **Set positive amounts**
   - All amounts should be positive
   - line_total is positive
   - tax_amount is positive
   - Increases customer balance

5. **Calculate taxes**
   - Apply appropriate tax rate
   - Calculate tax_amount
   - Include in line_total or separately

6. **Set line metadata**
   - Set line_number sequentially
   - Link to debit note
   - Set tenant

7. **Support product links**
   - Optionally link to products
   - If charge relates to specific product
   - Maintain product snapshots

8. **Validate line totals**
   - Sum of line items should equal debit amount
   - Ensure no negative amounts
   - Validate tax calculations

### Debit Note Line Item Scenarios

#### Scenario 1: Simple Additional Charge
```
Debit Note Line Items:
1. Additional Shipping Charges × 1 @ LKR 2,000 = LKR 2,000
Subtotal: LKR 2,000, VAT: LKR 240, Total: LKR 2,240
```

#### Scenario 2: Multiple Charges
```
Debit Note Line Items:
1. Installation Service × 1 @ LKR 5,000 = LKR 5,000
2. Rush Delivery × 1 @ LKR 2,000 = LKR 2,000
Subtotal: LKR 7,000, VAT: LKR 840, Total: LKR 7,840
```

#### Scenario 3: Interest Charge
```
Debit Note Line Items:
1. Late Payment Interest (2% per month) × 1 @ LKR 1,000 = LKR 1,000
Subtotal: LKR 1,000, VAT: LKR 0 (interest not taxed), Total: LKR 1,000
```

### Implementation

```python
def create_debit_line_items(debit_note, items):
    """
    Create line items for debit note
    
    Args:
        debit_note: Debit note Invoice instance
        items: List of charge items or single amount
    """
    if isinstance(items, (int, float, Decimal)):
        # Simple amount - create single line
        description = f"{debit_note.get_debit_note_reason_display()} Charge"
        create_debit_line(debit_note, description, items)
    
    elif isinstance(items, list):
        # Multiple line items
        for idx, item in enumerate(items, 1):
            create_debit_line(
                debit_note,
                item['description'],
                item['amount'],
                item.get('tax_rate', 0),
                idx
            )


def create_debit_line(debit_note, description, amount, tax_rate=0, line_number=1):
    """
    Create a single debit note line item
    """
    tax_amount = amount * (tax_rate / 100)
    
    InvoiceLineItem.objects.create(
        tenant=debit_note.tenant,
        invoice=debit_note,
        description=description,
        quantity=1,
        unit_price=amount,
        line_total=amount,  # Positive
        tax_rate=tax_rate,
        tax_amount=tax_amount,  # Positive
        line_number=line_number
    )
```

### Expected Outcome
- Line items created for debit notes
- All amounts positive
- Tax calculations correct
- Itemized and simple charges supported

### Verification Checklist
- [ ] `create_debit_line_items()` method implemented
- [ ] Itemized charges work
- [ ] Simple charge works
- [ ] All amounts positive
- [ ] Tax calculations correct
- [ ] Line numbers sequential

---

## Task 60: Implement Debit Note Application

### Overview
Implement the logic to apply debit notes to original invoices, increasing the balance due.

### Dependencies
- Task 59: Implement Debit Note Line Items

### Instructions

1. **Add apply_debit_note method**
   - Add to InvoiceService
   - Accept debit_note_id
   - Update original invoice balance

2. **Fetch debit note**
   - Get debit note by ID
   - Verify it's a DEBIT_NOTE type
   - Get related original invoice

3. **Validate application**
   - Check debit note not already applied
   - Check original invoice not CANCELLED/VOID
   - Check debit amount valid
   - Check approval received (if required)

4. **Update original invoice**
   - Increase total_debits_applied
   - Increase balance_due
   - Recalculate status

5. **Update debit note**
   - Set applied_at timestamp
   - Set applied_by user
   - Set is_applied flag

6. **Recalculate invoice status**
   - Increased balance may change status
   - If was PAID, may become PARTIAL
   - Update accordingly

7. **Track in invoice**
   - Add debit note to invoice.debit_notes collection
   - Store debit_note_id reference

8. **Log history**
   - Log DEBIT_NOTE_APPLIED event
   - Include debit amount
   - Include new balance

9. **Send notification**
   - Notify customer of additional charge
   - Email updated invoice/statement
   - Explain reason for debit

10. **Return updated invoice**
    - Return original invoice with updated balance

### Debit Note Application Flow

```
┌──────────────────────┐
│ Debit Note Created   │
│ DN-2026-00001        │
│ Amount: +LKR 5,000   │
│ Status: ISSUED       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validate Application │
│ - Not already applied│
│ - Invoice valid      │
│ - Approval received  │
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
│ Apply Debit          │
│ Balance += 5,000     │
│ New Balance: 55,000  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Update Status        │
│ (may change if paid) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Log History          │
│ Send Notification    │
└──────────────────────┘
```

### Application Method

```python
def apply_debit_note(debit_note_id, user=None):
    """
    Apply a debit note to increase invoice balance
    
    Args:
        debit_note_id: UUID of debit note
        user: User applying the debit
        
    Returns:
        Invoice: Updated original invoice
    """
    debit_note = Invoice.objects.get(id=debit_note_id)
    
    # Validate
    if debit_note.type != InvoiceType.DEBIT_NOTE:
        raise ValueError("Not a debit note")
    
    if debit_note.is_applied:
        raise ValueError("Debit note already applied")
    
    if debit_note.requires_approval and not debit_note.approved_at:
        raise ValueError("Debit note requires approval")
    
    original_invoice = debit_note.related_invoice
    
    # Apply debit
    debit_amount = debit_note.total_amount
    original_invoice.total_debits_applied += debit_amount
    original_invoice.balance_due += debit_amount
    
    # Update status if necessary
    if original_invoice.status == InvoiceStatus.PAID and original_invoice.balance_due > 0:
        original_invoice.status = InvoiceStatus.PARTIAL
    
    original_invoice.save()
    
    # Mark debit as applied
    debit_note.is_applied = True
    debit_note.applied_at = timezone.now()
    debit_note.applied_by = user
    debit_note.save()
    
    # Log history
    log_invoice_history(
        invoice=original_invoice,
        event_type=InvoiceHistoryEvent.DEBIT_NOTE_APPLIED,
        user=user,
        metadata={
            'debit_note_id': str(debit_note.id),
            'debit_note_number': debit_note.invoice_number,
            'debit_amount': debit_amount,
            'new_balance': original_invoice.balance_due
        }
    )
    
    return original_invoice
```

### Expected Outcome
- Debit notes applied to invoices
- Balances increased correctly
- Status recalculated if needed
- History logged
- Notifications sent

### Verification Checklist
- [ ] `apply_debit_note()` method implemented
- [ ] Validation in place
- [ ] Balance calculation correct
- [ ] Status updated if needed
- [ ] Debit marked as applied
- [ ] Approval checked
- [ ] History logged
- [ ] Notifications sent

---

## Task 61: Link Credit/Debit to Original Invoice

### Overview
Ensure proper bidirectional linkage between original invoices and their credit/debit notes for tracking and reporting.

### Dependencies
- Task 56: Implement Credit Note Application
- Task 60: Implement Debit Note Application

### Instructions

1. **Add related notes fields to Invoice model**
   - Already has related_invoice FK (for credit/debit notes)
   - Add reverse relations via related_name
   - Query: invoice.credit_notes.all()
   - Query: invoice.debit_notes.all()

2. **Implement get_credit_notes method**
   - Add to Invoice model
   - Return QuerySet of credit notes
   - Filter by type=CREDIT_NOTE and related_invoice=self

3. **Implement get_debit_notes method**
   - Add to Invoice model
   - Return QuerySet of debit notes
   - Filter by type=DEBIT_NOTE and related_invoice=self

4. **Add totals calculation**
   - get_total_credits(): Sum of all credit notes
   - get_total_debits(): Sum of all debit notes
   - get_net_adjustments(): Debits - Credits

5. **Display on invoice detail**
   - Show list of related credit notes
   - Show list of related debit notes
   - Show impact on balance

6. **Add to serializers**
   - Include credit_notes in InvoiceSerializer
   - Include debit_notes in InvoiceSerializer
   - Nest or show as IDs/numbers

7. **Validation on deletion**
   - Cannot delete invoice with applied credit/debit notes
   - Must void credit/debit notes first
   - Enforce in service layer

8. **Add to reports**
   - Include credit/debit notes in aging reports
   - Show adjustments in customer statements
   - Track in financial reports

### Model Methods

```python
class Invoice(TenantAwareModel):
    # ... existing fields ...
    
    related_invoice = models.ForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='adjustments'
    )
    
    def get_credit_notes(self):
        """Get all credit notes for this invoice"""
        return Invoice.objects.filter(
            type=InvoiceType.CREDIT_NOTE,
            related_invoice=self
        )
    
    def get_debit_notes(self):
        """Get all debit notes for this invoice"""
        return Invoice.objects.filter(
            type=InvoiceType.DEBIT_NOTE,
            related_invoice=self
        )
    
    def get_total_credits(self):
        """Get total of all applied credit notes"""
        return self.get_credit_notes().filter(
            is_applied=True
        ).aggregate(
            total=Sum('total_amount')
        )['total'] or 0
    
    def get_total_debits(self):
        """Get total of all applied debit notes"""
        return self.get_debit_notes().filter(
            is_applied=True
        ).aggregate(
            total=Sum('total_amount')
        )['total'] or 0
```

### Linkage Diagram

```
┌────────────────────────────────────┐
│ Original Invoice                   │
│ INV-2026-00001                     │
│ Original Total: LKR 50,000         │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Credit Notes:                  │ │
│ │ - CN-2026-00001: -LKR 10,000   │ │
│ │ - CN-2026-00002: -LKR 5,000    │ │
│ │ Total Credits: -LKR 15,000     │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ Debit Notes:                   │ │
│ │ - DN-2026-00001: +LKR 5,000    │ │
│ │ Total Debits: +LKR 5,000       │ │
│ └────────────────────────────────┘ │
│                                    │
│ Payments: -LKR 30,000              │
│ Balance Due: LKR 10,000            │
│ (50,000 - 15,000 + 5,000 - 30,000)│
└────────────────────────────────────┘
```

### Expected Outcome
- Proper bidirectional linkage established
- Easy querying of related notes
- Totals calculation methods
- Display in UI and reports

### Verification Checklist
- [ ] Related notes fields configured
- [ ] `get_credit_notes()` method implemented
- [ ] `get_debit_notes()` method implemented
- [ ] Total calculation methods implemented
- [ ] Deletion validation in place
- [ ] Included in serializers
- [ ] Display in UI

---

## Task 62: Implement Invoice Balance Recalculation

### Overview
Implement comprehensive balance recalculation logic that accounts for original amount, payments, credits, and debits.

### Dependencies
- Task 61: Link Credit/Debit to Original Invoice

### Instructions

1. **Create recalculate_balance method**
   - Add to Invoice model or InvoiceService
   - Recalculate balance from all components
   - Update invoice fields

2. **Calculate from components**
   - Start with total_amount (original)
   - Subtract amount_paid
   - Subtract total_credits_applied
   - Add total_debits_applied
   - Result is balance_due

3. **Update status based on balance**
   - If balance_due = 0 → PAID
   - If balance_due > 0 and < total → PARTIAL
   - If balance_due > 0 and = total → ISSUED/SENT
   - If balance_due < 0 → OVERPAID (edge case)

4. **Handle negative balances**
   - If customer overpaid or credits exceed total
   - Set status to OVERPAID
   - Track credit balance for future use

5. **Validate consistency**
   - Ensure all amounts are consistent
   - Check for rounding errors
   - Log any discrepancies

6. **Call on every transaction**
   - After payment received
   - After credit note applied
   - After debit note applied
   - After amount adjustment

7. **Add audit trail**
   - Log balance recalculation
   - Include old and new balance
   - Include calculation breakdown

8. **Expose in API**
   - Provide endpoint to trigger recalculation
   - Admin/manager permission required
   - Return calculation breakdown

### Balance Calculation Formula

```
balance_due = total_amount 
            - amount_paid 
            - abs(sum(credit_notes))
            + sum(debit_notes)

Where:
- total_amount: Original invoice total
- amount_paid: Sum of all payments
- credit_notes: Sum of applied credit notes (negative values)
- debit_notes: Sum of applied debit notes (positive values)
```

### Implementation

```python
def recalculate_balance(self):
    """
    Recalculate invoice balance from all components
    
    Returns:
        Decimal: New balance
    """
    # Start with original total
    balance = self.total_amount
    
    # Subtract payments
    balance -= self.amount_paid
    
    # Subtract credits (already negative, so add abs)
    credits = self.get_credit_notes().filter(is_applied=True).aggregate(
        total=Sum('total_amount')
    )['total'] or Decimal('0')
    balance -= abs(credits)  # Make sure we subtract
    
    # Add debits
    debits = self.get_debit_notes().filter(is_applied=True).aggregate(
        total=Sum('total_amount')
    )['total'] or Decimal('0')
    balance += debits
    
    # Update invoice
    old_balance = self.balance_due
    self.balance_due = balance
    
    # Update status
    if balance == 0:
        self.status = InvoiceStatus.PAID
    elif balance < 0:
        self.status = InvoiceStatus.OVERPAID
    elif balance < self.total_amount:
        self.status = InvoiceStatus.PARTIAL
    # else keep current status
    
    self.save()
    
    # Log if changed
    if old_balance != balance:
        log_invoice_history(
            invoice=self,
            event_type=InvoiceHistoryEvent.BALANCE_RECALCULATED,
            metadata={
                'old_balance': float(old_balance),
                'new_balance': float(balance),
                'total_amount': float(self.total_amount),
                'amount_paid': float(self.amount_paid),
                'total_credits': float(abs(credits)),
                'total_debits': float(debits)
            }
        )
    
    return balance
```

### Balance Calculation Examples

#### Example 1: Simple Payment
```
Original Total: LKR 50,000
Payment: LKR 50,000
Balance: LKR 0
Status: PAID
```

#### Example 2: With Credit Note
```
Original Total: LKR 50,000
Payment: LKR 30,000
Credit Note: LKR 10,000
Balance: LKR 10,000 (50,000 - 30,000 - 10,000)
Status: PARTIAL
```

#### Example 3: With Debit Note
```
Original Total: LKR 50,000
Payment: LKR 50,000
Debit Note: LKR 5,000
Balance: LKR 5,000 (50,000 - 50,000 + 5,000)
Status: PARTIAL
```

#### Example 4: Complex
```
Original Total: LKR 50,000
Payment: LKR 30,000
Credit Note 1: LKR 10,000
Credit Note 2: LKR 5,000
Debit Note: LKR 8,000
Balance: LKR 13,000 (50,000 - 30,000 - 10,000 - 5,000 + 8,000)
Status: PARTIAL
```

### Expected Outcome
- Comprehensive balance recalculation
- Accounts for all transaction types
- Status automatically updated
- Audit trail maintained
- API endpoint available

### Verification Checklist
- [ ] `recalculate_balance()` method implemented
- [ ] All components included in calculation
- [ ] Status updated correctly
- [ ] Negative balances handled
- [ ] Consistency validated
- [ ] Called on all transactions
- [ ] Audit trail logged
- [ ] API endpoint exposed

---

## Summary

This document covered the debit note system, balance recalculation, and comprehensive linking between invoices and their adjustments.

**Key Deliverables:**
- Debit note creation workflow
- Debit note number generation
- Line item creation for charges
- Debit application to invoices
- Bidirectional linkage between invoices and notes
- Comprehensive balance recalculation logic

**Next Steps:**
- Proceed to [03_Tasks-63-66_PDF-Templates-Validation-Migration.md](03_Tasks-63-66_PDF-Templates-Validation-Migration.md)
