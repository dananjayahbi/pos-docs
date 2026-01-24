# Tasks 07-12: Date, Financial, User, Notes & Document Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** A - Vendor Bill Model & Core  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-16_Matching-Number-Index-Migration.md](03_Tasks-13-16_Matching-Number-Index-Migration.md)

---

## Document Overview

This document covers the essential data fields for the VendorBill model including date tracking, financial calculations, payment terms, user assignments, notes and comments, and document attachments. These fields enable comprehensive bill management, payment tracking, and audit trails.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Bill Date Fields | Medium | 20 min |
| 08 | Add Bill Financial Fields | Medium | 25 min |
| 09 | Add Bill Payment Fields | Medium | 20 min |
| 10 | Add Bill User Fields | Medium | 20 min |
| 11 | Add Bill Notes Fields | Low | 15 min |
| 12 | Add Bill Document Fields | Low | 15 min |

---

## Task 07: Add Bill Date Fields

### Overview
Add critical date tracking fields to the VendorBill model including bill date, received date, and due date. These dates drive payment scheduling, aging reports, and late payment tracking for effective cash flow management.

### Dependencies
- Task 06: Add Bill PO Reference
- VendorBill model core exists
- Date field handling understood

### Instructions

1. **Add bill_date field**
   - DateField to track invoice date from vendor
   - Required field (not nullable)
   - Usually the date on vendor's invoice
   - Used for accounting period assignment

2. **Add received_date field**
   - DateField to track when bill was received
   - Required field
   - Auto-populate with current date on creation
   - Important for processing SLAs

3. **Add due_date field**
   - DateField to track payment deadline
   - Required field
   - Calculated from bill_date + payment_terms
   - Drives payment scheduling

4. **Add date validation**
   - Ensure bill_date <= received_date
   - Ensure due_date >= bill_date
   - Prevent illogical date combinations
   - Add validation in model clean() method

5. **Add date calculation helper**
   - Method to calculate due_date from terms
   - Account for weekends/holidays if needed
   - Support various payment term types
   - Auto-populate due_date on save

6. **Add date convenience properties**
   - Property: is_overdue (due_date < today)
   - Property: days_until_due
   - Property: days_overdue
   - Property: aging_bucket (0-30, 31-60, etc.)

### Date Fields Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| bill_date | DateField | required | Vendor invoice date |
| received_date | DateField | required | Date bill received |
| due_date | DateField | required | Payment deadline |

### Date Relationships

```
Timeline Flow:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Bill Date   │───▶│Received Date │───▶│  Due Date    │
└──────────────┘    └──────────────┘    └──────────────┘
      │                    │                    │
      │                    │                    ▼
      │                    │            ┌──────────────┐
      │                    │            │Payment Date  │
      │                    │            └──────────────┘
      │                    │
      ▼                    ▼
  Accounting         Processing
    Period              Timer

Constraints:
- bill_date <= received_date
- due_date >= bill_date
- due_date = bill_date + payment_terms
```

### Payment Terms and Due Date Calculation

| Payment Term | Days | Due Date Calculation |
|--------------|------|----------------------|
| CIA (Cash in Advance) | 0 | bill_date |
| COD (Cash on Delivery) | 0 | bill_date |
| Net 15 | 15 | bill_date + 15 days |
| Net 30 | 30 | bill_date + 30 days |
| Net 45 | 45 | bill_date + 45 days |
| Net 60 | 60 | bill_date + 60 days |
| Net 90 | 90 | bill_date + 90 days |

### Aging Bucket Classification

```
Aging Buckets (based on due_date):
┌─────────────────┐
│   Current       │  Not due yet (due_date >= today)
└─────────────────┘
┌─────────────────┐
│   0-30 Days     │  0-30 days past due
└─────────────────┘
┌─────────────────┐
│   31-60 Days    │  31-60 days past due
└─────────────────┘
┌─────────────────┐
│   61-90 Days    │  61-90 days past due
└─────────────────┘
┌─────────────────┐
│   90+ Days      │  Over 90 days past due
└─────────────────┘
```

### Date-Based Properties

#### is_overdue Property
```
Returns: Boolean
Logic: today > due_date AND status != 'paid'
Usage: Highlighting overdue bills in reports
```

#### days_until_due Property
```
Returns: Integer (positive or negative)
Logic: (due_date - today).days
Positive: Days remaining
Negative: Days overdue
```

#### aging_bucket Property
```
Returns: String
Values: 'current', '0-30', '31-60', '61-90', '90+'
Based on: Days past due_date
Usage: Aging reports and analysis
```

### Expected Outcome
- Complete date tracking for bills
- Payment deadline management
- Foundation for aging reports
- Overdue bill identification

### Verification Checklist
- [ ] bill_date field added
- [ ] received_date field added
- [ ] due_date field added
- [ ] Date validation implemented
- [ ] Due date calculation method added
- [ ] is_overdue property created
- [ ] days_until_due property created
- [ ] aging_bucket property created

---

## Task 08: Add Bill Financial Fields

### Overview
Add comprehensive financial tracking fields to the VendorBill model including subtotal, tax, discounts, total amount, and currency. These fields enable accurate bill calculations, multi-currency support, and financial reporting.

### Dependencies
- Task 07: Add Bill Date Fields
- Decimal field handling understood
- Sri Lankan tax rules understood

### Instructions

1. **Add subtotal field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores sum of all line items before tax/discount
   - Required field with default=0
   - Calculated from bill line items

2. **Add tax_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores total tax (VAT, etc.)
   - Default=0, can be manually adjusted
   - Usually calculated from line items

3. **Add discount_amount field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores total discount applied
   - Default=0, optional discounts
   - Can be early payment discount

4. **Add total field**
   - DecimalField with max_digits=12, decimal_places=2
   - Stores final bill amount
   - Calculated: subtotal + tax - discount
   - Required field

5. **Add currency field**
   - CharField with max_length=3
   - Stores ISO 4217 currency code
   - Default='LKR' for Sri Lankan Rupees
   - Support for foreign currency bills

6. **Add financial calculation methods**
   - Method: calculate_totals()
   - Method: recalculate_from_lines()
   - Auto-update financial fields
   - Ensure accuracy and consistency

7. **Add financial validation**
   - Ensure total = subtotal + tax - discount
   - Validate non-negative amounts
   - Check currency consistency
   - Prevent manual total manipulation

### Financial Fields Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| subtotal | DecimalField | 12,2, default=0 | Line items sum |
| tax_amount | DecimalField | 12,2, default=0 | Total tax |
| discount_amount | DecimalField | 12,2, default=0 | Total discounts |
| total | DecimalField | 12,2, required | Final amount |
| currency | CharField | max_length=3, default=LKR | Currency code |

### Bill Total Calculation Flow

```
Calculation Sequence:
┌────────────────┐
│ Line Items Sum │  Individual item amounts
└────────┬───────┘
         │
         ▼
┌────────────────┐
│   Subtotal     │  Sum of all line items
└────────┬───────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌────────────────┐  ┌────────────────┐
│   Tax Amount   │  │Discount Amount │
│    (Add)       │  │   (Subtract)   │
└────────┬───────┘  └────────┬───────┘
         │                  │
         └─────────┬────────┘
                   │
                   ▼
         ┌────────────────┐
         │   Total        │  Final amount payable
         └────────────────┘

Formula: total = subtotal + tax_amount - discount_amount
```

### Sri Lankan VAT Considerations

| Tax Type | Rate | Application |
|----------|------|-------------|
| Standard VAT | 18% | Most goods and services |
| Reduced VAT | 8% | Essential items |
| Zero-rated | 0% | Exports, certain food items |
| Exempt | N/A | Financial services, education |

### Multi-Currency Support

#### Supported Currencies
```
Primary: LKR (Sri Lankan Rupee)
Common Foreign:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- AUD (Australian Dollar)
- SGD (Singapore Dollar)

Currency codes follow ISO 4217 standard.
Exchange rates handled separately.
```

#### Currency Conversion Notes
- Bills stored in original currency
- Conversion to LKR for reporting
- Exchange rate at bill_date
- Historical rate preservation
- Multi-currency reports require conversion

### Financial Validation Rules

| Rule | Validation |
|------|------------|
| Positive amounts | subtotal, tax, total >= 0 |
| Non-negative discount | discount_amount >= 0 |
| Total calculation | total = subtotal + tax - discount |
| Currency code | Valid ISO 4217 code |
| Decimal precision | 2 decimal places |

### Common Discount Scenarios

#### Early Payment Discount
- Example: 2/10 Net 30 (2% if paid within 10 days)
- Applied when payment made early
- Reduces total amount due
- Recorded in discount_amount

#### Volume Discount
- Vendor provides discount for large orders
- Already in line item prices
- May show separately in discount_amount
- Common for bulk purchases

#### Negotiated Discount
- Special terms with vendor
- Case-by-case basis
- Requires approval
- Documented in notes

### Expected Outcome
- Complete financial tracking
- Accurate bill calculations
- Multi-currency support
- Foundation for payment processing

### Verification Checklist
- [ ] subtotal field added
- [ ] tax_amount field added
- [ ] discount_amount field added
- [ ] total field added
- [ ] currency field added with LKR default
- [ ] calculate_totals() method implemented
- [ ] Financial validation added
- [ ] Total calculation formula verified

---

## Task 09: Add Bill Payment Fields

### Overview
Add payment tracking fields to monitor payment status, amounts paid, amounts due, and payment terms. These fields enable payment scheduling, partial payment tracking, and outstanding balance management.

### Dependencies
- Task 08: Add Bill Financial Fields
- Payment terms understood
- Partial payment logic clear

### Instructions

1. **Add amount_paid field**
   - DecimalField with max_digits=12, decimal_places=2
   - Tracks total payments made against bill
   - Default=0, updated as payments recorded
   - Cannot exceed total amount

2. **Add amount_due field**
   - DecimalField with max_digits=12, decimal_places=2
   - Tracks outstanding balance
   - Calculated: total - amount_paid
   - Read-only, computed property preferred

3. **Add payment_terms field**
   - CharField with max_length=50
   - Stores payment term description
   - Examples: "Net 30", "Net 60", "CIA"
   - Linked to due_date calculation

4. **Add payment_terms choices**
   - Define PAYMENT_TERMS_CHOICES in constants
   - Common terms for Sri Lankan businesses
   - Include days value for calculation
   - Allow custom terms entry

5. **Add payment tracking methods**
   - Method: record_payment(amount)
   - Method: can_pay(amount)
   - Method: calculate_amount_due()
   - Auto-update status based on payment

6. **Add payment validation**
   - Prevent overpayment
   - Ensure positive payment amounts
   - Update status when fully/partially paid
   - Validate payment against approved bills

### Payment Tracking Fields

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| amount_paid | DecimalField | 12,2, default=0 | Total paid |
| amount_due | Computed | - | Outstanding balance |
| payment_terms | CharField | max_length=50 | Payment terms |

### Payment Terms Options

| Payment Term | Code | Days | Description |
|--------------|------|------|-------------|
| Cash in Advance | CIA | 0 | Payment before delivery |
| Cash on Delivery | COD | 0 | Payment at delivery |
| Net 15 | NET15 | 15 | Payment within 15 days |
| Net 30 | NET30 | 30 | Payment within 30 days |
| Net 45 | NET45 | 45 | Payment within 45 days |
| Net 60 | NET60 | 60 | Payment within 60 days |
| Net 90 | NET90 | 90 | Payment within 90 days |
| Custom | CUSTOM | varies | Negotiated terms |

### Payment Status Transitions

```
Payment Lifecycle:
┌─────────────┐
│  approved   │  amount_paid = 0
│ amount_due  │  amount_due = total
│   = total   │
└──────┬──────┘
       │
       │ First Payment
       ▼
┌─────────────┐
│partial_paid │  0 < amount_paid < total
│ amount_due  │  amount_due = total - amount_paid
│   > 0       │
└──────┬──────┘
       │
       │ Final Payment
       ▼
┌─────────────┐
│    paid     │  amount_paid = total
│ amount_due  │  amount_due = 0
│   = 0       │
└─────────────┘
```

### Payment Recording Logic

#### record_payment() Method
```
Process:
1. Validate payment amount > 0
2. Validate payment doesn't exceed amount_due
3. Validate bill status is approved or partial_paid
4. Update amount_paid += payment_amount
5. Calculate new amount_due
6. Update status based on amount_due:
   - If amount_due = 0: status = 'paid'
   - If 0 < amount_due < total: status = 'partial_paid'
7. Save bill and create payment record
```

### Amount Due Calculation

```
amount_due = total - amount_paid

Examples:
┌────────┬────────────┬──────────────┐
│ Total  │Amount Paid │ Amount Due   │
├────────┼────────────┼──────────────┤
│100,000 │      0     │   100,000    │
│100,000 │  40,000    │    60,000    │
│100,000 │  100,000   │        0     │
└────────┴────────────┴──────────────┘

Amount Due displayed in:
- Bill detail views
- Payment screens
- Vendor statements
- Aging reports
```

### Partial Payment Scenarios

#### Scenario 1: Multiple Payments
```
Bill Total: LKR 100,000
Payment Terms: Net 30

Payment 1 (Day 10): LKR 40,000
- amount_paid = 40,000
- amount_due = 60,000
- status = 'partial_paid'

Payment 2 (Day 25): LKR 60,000
- amount_paid = 100,000
- amount_due = 0
- status = 'paid'
```

#### Scenario 2: Early Payment Discount
```
Bill Total: LKR 100,000
Terms: 2/10 Net 30 (2% discount if paid within 10 days)

Payment (Day 8): LKR 98,000
- Early payment discount: LKR 2,000
- discount_amount = 2,000
- Recalculate total = 98,000
- amount_paid = 98,000
- status = 'paid'
```

### Payment Validation Rules

| Validation | Rule |
|------------|------|
| Positive amount | payment_amount > 0 |
| No overpayment | amount_paid + payment <= total |
| Approved bill | status in ['approved', 'partial_paid'] |
| Valid currency | payment currency = bill currency |
| No duplicate payment | Check payment reference |

### Expected Outcome
- Complete payment tracking
- Partial payment support
- Automatic status updates
- Foundation for payment processing

### Verification Checklist
- [ ] amount_paid field added
- [ ] amount_due calculation implemented
- [ ] payment_terms field added
- [ ] PAYMENT_TERMS_CHOICES defined
- [ ] record_payment() method created
- [ ] Payment validation implemented
- [ ] Status auto-update on payment
- [ ] Payment amount validation added

---

## Task 10: Add Bill User Fields

### Overview
Add user assignment fields to track bill ownership, approval chain, and accountability. These fields record who created the bill and who approved it, providing essential audit trail information.

### Dependencies
- Task 09: Add Bill Payment Fields
- User model available
- Role/permission system understood

### Instructions

1. **Import User model**
   - Import Django User model or custom User
   - Usually from django.contrib.auth.models
   - Or from custom user app if exists

2. **Add created_by field**
   - ForeignKey to User model
   - Required field, tracks bill creator
   - on_delete=PROTECT (preserve creator info)
   - related_name='created_bills'

3. **Add approved_by field**
   - ForeignKey to User model
   - Nullable field (null until approved)
   - on_delete=SET_NULL (preserve approval info)
   - related_name='approved_bills'

4. **Add approved_at field**
   - DateTimeField for approval timestamp
   - Nullable, set when bill approved
   - Automatic timestamp on approval
   - Part of audit trail

5. **Add user assignment logic**
   - Auto-populate created_by on creation
   - Set approved_by when bill approved
   - Set approved_at timestamp
   - Validate approver has permission

6. **Add user-related properties**
   - Property: is_approved
   - Property: approver_name
   - Property: creator_name
   - Convenience accessors

### User Assignment Fields

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| created_by | ForeignKey | to=User, PROTECT, required | Bill creator |
| approved_by | ForeignKey | to=User, SET_NULL, nullable | Bill approver |
| approved_at | DateTimeField | nullable | Approval timestamp |

### User Roles in Bill Lifecycle

```
Bill Lifecycle Roles:
┌─────────────────┐
│  Creator        │  Creates draft bill
│  (created_by)   │  Any authorized user
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Submitter      │  Submits for approval
│  (same user)    │  Changes status to pending
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Approver       │  Reviews and approves
│  (approved_by)  │  Must have approval permission
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Payment Proc.  │  Records payments
│  (separate)     │  Different permission
└─────────────────┘
```

### User Field Relationships

#### created_by Field
```
Purpose: Track who created the bill
When Set: On bill creation (auto)
Access: bill.created_by.username
Reverse: user.created_bills.all()
Protection: PROTECT (preserve history)
```

#### approved_by Field
```
Purpose: Track who approved the bill
When Set: On approval action
Access: bill.approved_by.username if approved
Reverse: user.approved_bills.all()
Protection: SET_NULL (user deletion allowed)
```

#### approved_at Field
```
Purpose: Timestamp of approval
When Set: Same time as approved_by
Access: bill.approved_at.strftime('%Y-%m-%d %H:%M')
Usage: Audit reports, approval SLA tracking
```

### Approval Workflow

```
Approval Process:
┌──────────────────────────────────┐
│ 1. User creates bill (DRAFT)     │
│    - created_by = current_user   │
│    - approved_by = None          │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ 2. User submits (PENDING)        │
│    - Status changes              │
│    - Notification to approvers   │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ 3. Approver reviews              │
│    - Checks bill details         │
│    - Validates amounts           │
│    - Reviews attachments         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ 4. Approval granted (APPROVED)   │
│    - approved_by = approver      │
│    - approved_at = now()         │
│    - Status = 'approved'         │
└──────────────────────────────────┘
```

### User Permission Requirements

| Action | Permission Required | User Field Set |
|--------|---------------------|----------------|
| Create Bill | vendor_bills.add_vendorbill | created_by |
| Submit Bill | vendor_bills.change_vendorbill | - |
| Approve Bill | vendor_bills.approve_vendorbill | approved_by, approved_at |
| Record Payment | vendor_bills.pay_vendorbill | - |

### Audit Trail Information

#### From User Fields
```
Audit Information Available:
- Who created the bill? (created_by)
- When was it created? (created_at from timestamps)
- Who approved it? (approved_by)
- When was it approved? (approved_at)
- How long from creation to approval? (approved_at - created_at)
- Which approver processes most bills?
- Average approval time per user?
```

### Self-Approval Prevention

```
Validation Rule:
If created_by == current_user:
    Cannot approve own bill
    
Requires separate approver
Exception: Owner/Admin role bypass
```

### Expected Outcome
- User accountability established
- Approval workflow supported
- Audit trail captured
- Permission-based access control

### Verification Checklist
- [ ] User model imported
- [ ] created_by field added with PROTECT
- [ ] approved_by field added with SET_NULL
- [ ] approved_at field added
- [ ] User assignment logic implemented
- [ ] is_approved property created
- [ ] Self-approval validation added
- [ ] related_name configured for both fields

---

## Task 11: Add Bill Notes Fields

### Overview
Add note and comment fields to the VendorBill model for capturing additional information, internal communications, and dispute reasons. These fields provide context and facilitate communication about bill issues.

### Dependencies
- Task 10: Add Bill User Fields
- Text field usage understood

### Instructions

1. **Add notes field**
   - TextField for general notes
   - Blank=True, not required
   - Visible to vendor in communications
   - Public notes about the bill

2. **Add internal_notes field**
   - TextField for internal comments
   - Blank=True, not required
   - Not visible to vendor
   - Internal discussion and tracking

3. **Add dispute_reason field**
   - TextField for dispute explanations
   - Blank=True, null=True
   - Populated when status = 'disputed'
   - Required when disputing bill

4. **Add notes validation**
   - Require dispute_reason when status='disputed'
   - Optional character limits if needed
   - Sanitize input for security
   - Preserve formatting (newlines)

5. **Add notes helpers**
   - Property: has_notes
   - Property: has_dispute
   - Method: add_internal_note(text, user)
   - Timestamped note append functionality

### Notes Fields Structure

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| notes | TextField | blank=True | Public notes |
| internal_notes | TextField | blank=True | Internal comments |
| dispute_reason | TextField | blank=True, null=True | Dispute explanation |

### Notes Field Usage

#### notes Field
```
Purpose: Public comments about the bill
Visibility: May be shared with vendor
Content Examples:
- "Delivery was incomplete, adjusted amount"
- "Early payment discount applied"
- "Replacement for cancelled bill BILL-2026-00045"
- "Special terms negotiated with vendor"

Access: All users with bill access
```

#### internal_notes Field
```
Purpose: Internal-only comments
Visibility: Staff only, never shared with vendor
Content Examples:
- "Waiting for manager approval due to high amount"
- "Vendor payment history is concerning"
- "Check with warehouse about quantity discrepancy"
- "Hold payment until quality issue resolved"

Access: Internal users only
```

#### dispute_reason Field
```
Purpose: Explanation when bill disputed
Visibility: Internal and possibly vendor
Content Examples:
- "Quantity received (50 units) less than invoiced (100 units)"
- "Price on invoice (LKR 1,500) exceeds PO price (LKR 1,200)"
- "Wrong items delivered, should be Product A not Product B"
- "Invoice total calculation error: tax miscalculated"

Required: When status = 'disputed'
```

### Notes Best Practices

| Field | Best Practice |
|-------|---------------|
| notes | Brief, factual statements |
| internal_notes | Detailed analysis and communication |
| dispute_reason | Specific, measurable discrepancies |

### Dispute Reason Format

```
Effective Dispute Reason Structure:
┌─────────────────────────────────────┐
│ Issue Type: [Quantity/Price/Item]   │
├─────────────────────────────────────┤
│ Expected: [What should be]          │
│ Received: [What actually is]        │
│ Variance: [Difference/Impact]       │
├─────────────────────────────────────┤
│ Supporting Evidence:                │
│ - GRN Reference: GRN-2026-00123     │
│ - PO Reference: PO-2026-00456       │
│ - Photos/Documents attached         │
└─────────────────────────────────────┘
```

### Notes Timeline Tracking

```
Consider adding timestamped notes:
Format: "[2026-01-24 14:30 - John Doe] Note text here"

Benefits:
- Track when comments added
- Know who added each note
- Chronological communication log
- Better audit trail

Implementation:
- Append new notes with timestamp
- Preserve existing notes
- Parse for display with formatting
```

### Common Notes Scenarios

#### Approval Notes
```
notes: "Approved by manager override due to urgent need."
internal_notes: "Normal approver on leave, emergency approval granted by Operations Manager."
```

#### Dispute Notes
```
dispute_reason: "Invoice quantity 100 units, GRN shows only 75 units received. Waiting for vendor to send remaining 25 units or adjust invoice."
internal_notes: "Contacted vendor 2026-01-20, they are investigating. Follow up 2026-01-27."
```

#### Payment Notes
```
notes: "Early payment made to secure 2% discount."
internal_notes: "Used available cash to take advantage of discount. Saved LKR 2,000."
```

### Expected Outcome
- Flexible note-taking capability
- Public/private comment separation
- Dispute documentation support
- Communication trail established

### Verification Checklist
- [ ] notes TextField added
- [ ] internal_notes TextField added
- [ ] dispute_reason TextField added
- [ ] All note fields set to blank=True
- [ ] dispute_reason validation when disputed
- [ ] has_notes property implemented
- [ ] has_dispute property implemented
- [ ] Note sanitization considered

---

## Task 12: Add Bill Document Fields

### Overview
Add file attachment capability to the VendorBill model for storing scanned invoices, supporting documents, and proof of delivery. This enables digital document management and provides reference materials for bill verification.

### Dependencies
- Task 11: Add Bill Notes Fields
- File storage configured
- Django FileField understood

### Instructions

1. **Configure file storage**
   - Ensure MEDIA_ROOT and MEDIA_URL configured
   - Set up file storage backend (local or S3)
   - Define upload directory structure
   - Consider tenant-based file isolation

2. **Add attachment field**
   - FileField for invoice/document upload
   - upload_to='vendor_bills/{tenant}/{year}/'
   - blank=True, null=True (optional)
   - Supports PDF, images (PNG, JPG)

3. **Add file validation**
   - Validate file size (max 10MB recommended)
   - Validate file type (PDF, PNG, JPG, JPEG)
   - Scan for malware if security critical
   - Generate unique filenames

4. **Add file helpers**
   - Property: has_attachment
   - Property: attachment_filename
   - Property: attachment_url
   - Method: delete_attachment()

5. **Add file metadata tracking**
   - Consider additional fields for:
     - uploaded_at timestamp
     - uploaded_by user
     - file_size in bytes
     - file_type MIME type

### Document Attachment Field

| Field | Type | Properties | Purpose |
|-------|------|------------|---------|
| attachment | FileField | blank=True, null=True | Invoice scan/document |

### File Upload Structure

```
Media Storage Structure:
MEDIA_ROOT/
└── vendor_bills/
    ├── tenant_1/
    │   ├── 2026/
    │   │   ├── bill_001_invoice.pdf
    │   │   ├── bill_002_invoice.pdf
    │   │   └── bill_003_delivery_note.pdf
    │   └── 2027/
    └── tenant_2/
        └── 2026/

Path Pattern: vendor_bills/{tenant_id}/{year}/bill_{id}_{original_name}
```

### Supported File Types

| Type | Extensions | MIME Type | Purpose |
|------|------------|-----------|---------|
| PDF | .pdf | application/pdf | Invoices, statements |
| PNG | .png | image/png | Scanned documents |
| JPEG | .jpg, .jpeg | image/jpeg | Photos, scans |

### File Size Limits

```
Recommended Limits:
┌──────────────┬────────────┐
│  File Type   │  Max Size  │
├──────────────┼────────────┤
│ PDF          │   10 MB    │
│ PNG          │    5 MB    │
│ JPG/JPEG     │    5 MB    │
└──────────────┴────────────┘

Implementation:
- Validate in model clean() method
- Show error before upload
- Compress images if too large
- Reject oversized files
```

### File Validation

```
Validation Checklist:
✓ File size within limits
✓ File extension allowed
✓ MIME type matches extension
✓ Filename sanitized (no special chars)
✓ Virus scan passed (if configured)
✓ File not empty (> 0 bytes)
✓ Tenant directory isolated
```

### File Upload Workflow

```
Upload Process:
┌─────────────────────────────────┐
│ 1. User selects file            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 2. Client-side validation       │
│    - Check file size            │
│    - Check file type            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 3. Upload to server             │
│    - Generate unique filename   │
│    - Save to tenant directory   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 4. Server-side validation       │
│    - Re-check file type/size    │
│    - Scan for malware           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ 5. Save file reference in DB    │
│    - Update attachment field    │
│    - Store metadata             │
└─────────────────────────────────┘
```

### File Security Considerations

#### Access Control
- Only authorized users can upload
- Only bill owner/approver can download
- Tenant isolation enforced
- No direct file URL access

#### File Storage Security
- Unique filenames prevent guessing
- Files stored outside web root
- Serve through application layer
- Generate temporary signed URLs

### File Metadata Tracking

```
Optional Additional Fields:
┌─────────────────────┬──────────────────┐
│ Field               │ Purpose          │
├─────────────────────┼──────────────────┤
│ attachment_uploaded_at  │ Track when   │
│ attachment_uploaded_by  │ Track who    │
│ attachment_size         │ File size    │
│ attachment_type         │ MIME type    │
└─────────────────────┴──────────────────┘

Benefits:
- Better audit trail
- File management analytics
- Storage quota tracking
- User activity monitoring
```

### Common Document Types

| Document | When Attached | Purpose |
|----------|---------------|---------|
| Vendor Invoice | Bill creation | Primary document |
| Delivery Note | With GRN match | Proof of receipt |
| Purchase Order | Reference | Original PO copy |
| Payment Proof | After payment | Bank receipt |
| Correspondence | Dispute | Email/letter scans |

### Expected Outcome
- File attachment capability
- Secure document storage
- Proper file validation
- Tenant-isolated file management

### Verification Checklist
- [ ] MEDIA_ROOT and MEDIA_URL configured
- [ ] attachment FileField added
- [ ] upload_to path includes tenant/year
- [ ] File size validation implemented
- [ ] File type validation implemented
- [ ] has_attachment property created
- [ ] attachment_url property created
- [ ] File security measures in place

---

## Summary

This document added comprehensive data tracking capabilities to the VendorBill model including dates for payment scheduling, financial fields for accurate accounting, payment tracking for multi-stage payments, user assignments for accountability, notes for communication, and document attachments for reference materials.

### Completed Tasks
✅ Task 07: Added bill_date, received_date, due_date with validation  
✅ Task 08: Added subtotal, tax, discount, total, currency fields  
✅ Task 09: Added amount_paid, amount_due, payment_terms tracking  
✅ Task 10: Added created_by, approved_by, approved_at user fields  
✅ Task 11: Added notes, internal_notes, dispute_reason fields  
✅ Task 12: Added attachment FileField with validation

### Key Deliverables
- Complete date tracking for payment management
- Comprehensive financial calculations
- Payment and outstanding balance tracking
- User accountability and approval workflow
- Communication and dispute documentation
- Digital document attachment capability

### Next Steps
Continue to [03_Tasks-13-16_Matching-Number-Index-Migration.md](03_Tasks-13-16_Matching-Number-Index-Migration.md) to add bill matching fields, implement bill number generation, create database indexes, and run initial migrations.
