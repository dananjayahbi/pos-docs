# Tasks 07-12: Shipping, Financial, User, and Notes Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** A - Purchase Order Model & Status  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Warehouse-Number-PDF-Index-Migration.md](03_Tasks-13-18_Warehouse-Number-PDF-Index-Migration.md)

---

## Document Overview

This document adds comprehensive business fields to the PurchaseOrder model, including shipping logistics, financial calculations, payment terms, user tracking, notes management, and approval workflow fields. These fields enable complete purchase order management from creation through payment.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add PO Shipping Fields | Medium | 20 min |
| 08 | Add PO Financial Fields | Medium | 25 min |
| 09 | Add PO Payment Fields | Medium | 20 min |
| 10 | Add PO User Fields | Medium | 20 min |
| 11 | Add PO Notes Fields | Low | 15 min |
| 12 | Add PO Approval Fields | Medium | 20 min |

---

## Task 07: Add PO Shipping Fields

### Overview
Add shipping and delivery-related fields to track shipping address, method, and costs. These fields enable proper logistics planning and cost tracking for purchase order fulfillment.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- Address model or fields available (from vendors app or core)

### Instructions

1. **Add ship_to_address field**
   - Add ship_to_address as TextField
   - Store complete delivery address
   - Set blank=True, null=True (optional)
   - Include warehouse or specific location

2. **Add shipping_method field**
   - Add shipping_method as CharField
   - Set max_length=100
   - Set blank=True, null=True
   - Examples: "Ground", "Air Freight", "Sea Freight", "Courier"

3. **Add shipping_cost field**
   - Add shipping_cost as DecimalField
   - Set max_digits=10, decimal_places=2
   - Set default=0.00
   - Track shipping charges separately from item costs

4. **Add carrier field**
   - Add carrier as CharField
   - Set max_length=100
   - Set blank=True, null=True
   - Store shipping company name

5. **Add tracking_number field**
   - Add tracking_number as CharField
   - Set max_length=100
   - Set blank=True, null=True
   - For shipment tracking

6. **Update model docstring**
   - Document shipping fields purpose
   - Explain cost inclusion in total
   - Note address format expectations

### Shipping Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| ship_to_address | TextField | Delivery address | No |
| shipping_method | CharField | Transport method | No |
| shipping_cost | DecimalField | Shipping charges | Yes (default 0) |
| carrier | CharField | Shipping company | No |
| tracking_number | CharField | Shipment tracking ID | No |

### Shipping Method Options

| Method | Use Case | Typical Speed |
|--------|----------|---------------|
| Ground | Local/regional | 3-7 days |
| Air Freight | International/urgent | 1-3 days |
| Sea Freight | Bulk/international | 2-8 weeks |
| Courier | Express delivery | 1-2 days |
| Pickup | Self-collection | Immediate |

### Shipping Address Format
```
Main Warehouse
456 Storage Road
Warehouse Bay 3
Colombo 00700
Sri Lanka
Contact: +94 11 234 5678
```

### Shipping Cost Handling

| Scenario | Behavior |
|----------|----------|
| Free shipping | shipping_cost = 0.00 |
| Fixed rate | shipping_cost = fixed amount |
| Calculated | shipping_cost = weight × rate |
| Vendor-paid | shipping_cost = 0.00, note in vendor_notes |

### Expected Outcome
- Complete shipping information tracking
- Shipping cost integration in PO total
- Delivery tracking capability

### Verification Checklist
- [ ] ship_to_address field added
- [ ] shipping_method field added
- [ ] shipping_cost field with DecimalField
- [ ] carrier field added
- [ ] tracking_number field added
- [ ] Model docstring updated

---

## Task 08: Add PO Financial Fields

### Overview
Add comprehensive financial fields to track purchase order monetary values, including subtotal, discounts, taxes, and grand total. These fields enable accurate financial reporting and cost analysis.

### Dependencies
- Task 04: Create PurchaseOrder Model Core

### Instructions

1. **Add subtotal field**
   - Add subtotal as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Sum of all line item totals (before shipping/tax)

2. **Add discount_amount field**
   - Add discount_amount as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Order-level discount in monetary value

3. **Add discount_percentage field**
   - Add discount_percentage as DecimalField
   - Set max_digits=5, decimal_places=2
   - Set default=0.00
   - Order-level discount as percentage

4. **Add tax_amount field**
   - Add tax_amount as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Total tax calculated from line items

5. **Add total field**
   - Add total as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Grand total: subtotal - discount + tax + shipping

6. **Add currency field**
   - Add currency as CharField
   - Set max_length=3
   - Set default='LKR'
   - ISO currency code (LKR, USD, EUR, etc.)

7. **Update model docstring**
   - Document financial calculation logic
   - Explain discount application
   - Note currency handling

### Financial Fields Summary

| Field | Type | Purpose | Default |
|-------|------|---------|---------|
| subtotal | DecimalField | Sum of line items | 0.00 |
| discount_amount | DecimalField | Order discount (money) | 0.00 |
| discount_percentage | DecimalField | Order discount (%) | 0.00 |
| tax_amount | DecimalField | Total tax | 0.00 |
| total | DecimalField | Grand total | 0.00 |
| currency | CharField | Currency code | LKR |

### Financial Calculation Flow
```
Line Item Totals
    ↓
Subtotal = Sum(line_item_total)
    ↓
Discount Applied = subtotal × (discount_percentage / 100) OR discount_amount
    ↓
After Discount = subtotal - discount
    ↓
Tax Calculated = Sum(line_item_tax)
    ↓
Total = subtotal - discount + tax_amount + shipping_cost
```

### Discount Handling

| Type | Priority | Example |
|------|----------|---------|
| Percentage | If both set, percentage used | 5% off |
| Fixed Amount | Used if percentage is 0 | Rs. 5,000 off |
| None | Both zero | No discount |

### Example Financial Breakdown
```
Line Items:
  - Product A: Rs. 85,000 × 10 = Rs. 850,000
  - Product B: Rs. 15,000 × 20 = Rs. 300,000
                                  ───────────
Subtotal:                         Rs. 1,150,000
Discount (5%):                    Rs.   -57,500
                                  ───────────
After Discount:                   Rs. 1,092,500
Tax (18%):                        Rs.   196,650
Shipping:                         Rs.     5,000
                                  ───────────
TOTAL:                            Rs. 1,294,150
```

### Currency Handling

| Currency | Code | Use Case |
|----------|------|----------|
| Sri Lankan Rupee | LKR | Local vendors |
| US Dollar | USD | International purchases |
| Euro | EUR | European suppliers |
| Indian Rupee | INR | Cross-border trade |

### Expected Outcome
- Complete financial tracking
- Accurate cost calculations
- Multi-currency support
- Financial reporting capability

### Verification Checklist
- [ ] subtotal field added
- [ ] discount_amount field added
- [ ] discount_percentage field added
- [ ] tax_amount field added
- [ ] total field added
- [ ] currency field with default
- [ ] Calculation logic documented

---

## Task 09: Add PO Payment Fields

### Overview
Add payment-related fields to track payment terms, due dates, and payment status. These fields enable accounts payable management and vendor payment tracking.

### Dependencies
- Task 04: Create PurchaseOrder Model Core

### Instructions

1. **Add payment_terms field**
   - Add payment_terms as CharField
   - Set max_length=50
   - Set blank=True, null=True
   - Store terms like "Net 30", "Net 60", "CIA", "COD"

2. **Add payment_terms_days field**
   - Add payment_terms_days as IntegerField
   - Set blank=True, null=True
   - Number of days for payment (extracted from terms)

3. **Add payment_due_date field**
   - Add payment_due_date as DateField
   - Set blank=True, null=True
   - Calculated: received_at + payment_terms_days

4. **Add payment_status field**
   - Add payment_status as CharField
   - Set max_length=20
   - Choices: UNPAID, PARTIAL, PAID
   - Set default='unpaid'

5. **Add amount_paid field**
   - Add amount_paid as DecimalField
   - Set max_digits=12, decimal_places=2
   - Set default=0.00
   - Track partial payments

6. **Update model docstring**
   - Document payment terms options
   - Explain due date calculation
   - Note payment tracking

### Payment Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| payment_terms | CharField | Payment terms description | No |
| payment_terms_days | IntegerField | Days until payment due | No |
| payment_due_date | DateField | Payment deadline | No |
| payment_status | CharField | Payment tracking | Yes (default) |
| amount_paid | DecimalField | Payments received | Yes (default 0) |

### Payment Terms Options

| Term | Days | Description |
|------|------|-------------|
| CIA | 0 | Cash in Advance |
| COD | 0 | Cash on Delivery |
| Net 15 | 15 | Payment due in 15 days |
| Net 30 | 30 | Payment due in 30 days |
| Net 45 | 45 | Payment due in 45 days |
| Net 60 | 60 | Payment due in 60 days |
| Net 90 | 90 | Payment due in 90 days |
| 2/10 Net 30 | 30 | 2% discount if paid in 10 days |

### Payment Due Date Calculation
```
Received Date: 2026-01-24
Payment Terms: Net 30
Payment Terms Days: 30
Payment Due Date: 2026-02-23 (received_date + 30 days)
```

### Payment Status Tracking

| Status | Condition |
|--------|-----------|
| UNPAID | amount_paid = 0 |
| PARTIAL | 0 < amount_paid < total |
| PAID | amount_paid >= total |

### Payment Timeline Example
```
Order Date: 2026-01-15
     ↓
Received Date: 2026-01-24
     ↓
Payment Terms: Net 30
     ↓
Payment Due: 2026-02-23
     ↓
Payment Made: 2026-02-20 (Rs. 1,294,150)
     ↓
Status: PAID
```

### Expected Outcome
- Payment terms management
- Due date tracking
- Payment status monitoring
- Accounts payable integration

### Verification Checklist
- [ ] payment_terms field added
- [ ] payment_terms_days field added
- [ ] payment_due_date field added
- [ ] payment_status field with choices
- [ ] amount_paid field added
- [ ] Payment logic documented

---

## Task 10: Add PO User Fields

### Overview
Add user tracking fields to record who created, approved, and received the purchase order. These fields provide audit trail and accountability for purchase order operations.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- User model available from authentication app

### Instructions

1. **Import User model**
   - Import User from appropriate auth module
   - Ensure proper reference to custom user model if applicable

2. **Add created_by field**
   - Add created_by as ForeignKey to User
   - Set on_delete=models.PROTECT
   - Set related_name='created_purchase_orders'
   - Make required (no blank, no null)

3. **Add approved_by field**
   - Add approved_by as ForeignKey to User
   - Set on_delete=models.SET_NULL
   - Set related_name='approved_purchase_orders'
   - Set blank=True, null=True

4. **Add received_by field**
   - Add received_by as ForeignKey to User
   - Set on_delete=models.SET_NULL
   - Set related_name='received_purchase_orders'
   - Set blank=True, null=True

5. **Update model docstring**
   - Document user tracking purpose
   - Explain each user role
   - Note PROTECT vs SET_NULL behavior

### User Fields Summary

| Field | Type | Purpose | Required | On Delete |
|-------|------|---------|----------|-----------|
| created_by | ForeignKey | PO creator | Yes | PROTECT |
| approved_by | ForeignKey | Approver | No | SET_NULL |
| received_by | ForeignKey | Receiver | No | SET_NULL |

### User Roles and Responsibilities

| Role | Responsibility | Permissions |
|------|----------------|-------------|
| Creator | Creates and edits PO | Create, edit draft POs |
| Approver | Approves PO before sending | Approve POs above threshold |
| Receiver | Receives goods | Create GRN, update stock |

### Foreign Key Relationships
```
User (1) ────< (Many) PurchaseOrder [created_by]
User (1) ────< (Many) PurchaseOrder [approved_by]
User (1) ────< (Many) PurchaseOrder [received_by]

Access:
- user.created_purchase_orders.all()
- user.approved_purchase_orders.all()
- user.received_purchase_orders.all()
```

### On Delete Behavior

| Field | Behavior | Reason |
|-------|----------|--------|
| created_by | PROTECT | Creator must always be known |
| approved_by | SET_NULL | Approval still valid if user deleted |
| received_by | SET_NULL | Receipt still valid if user deleted |

### User Tracking Timeline
```
Created By: John Doe (2026-01-15 10:00)
     ↓
Approved By: Jane Smith (2026-01-15 15:30)
     ↓
Received By: Mike Johnson (2026-01-24 14:15)
```

### Expected Outcome
- Complete user accountability
- Audit trail for all PO actions
- User-based reporting capability

### Verification Checklist
- [ ] created_by ForeignKey added
- [ ] approved_by ForeignKey added
- [ ] received_by ForeignKey added
- [ ] Proper on_delete behaviors set
- [ ] Related names configured
- [ ] User roles documented

---

## Task 11: Add PO Notes Fields

### Overview
Add various notes fields to capture additional information, instructions, and comments for different audiences. These fields enable communication and documentation throughout the purchase order lifecycle.

### Dependencies
- Task 04: Create PurchaseOrder Model Core

### Instructions

1. **Add notes field**
   - Add notes as TextField
   - Set blank=True
   - Purpose: General notes visible to all internal users

2. **Add internal_notes field**
   - Add internal_notes as TextField
   - Set blank=True
   - Purpose: Internal-only notes, not shared with vendor

3. **Add vendor_notes field**
   - Add vendor_notes as TextField
   - Set blank=True
   - Purpose: Special instructions for vendor, printed on PO

4. **Add delivery_instructions field**
   - Add delivery_instructions as TextField
   - Set blank=True
   - Purpose: Specific delivery instructions for warehouse

5. **Update model docstring**
   - Document each notes field purpose
   - Explain visibility rules
   - Note character limits if any

### Notes Fields Summary

| Field | Visibility | Purpose | Required |
|-------|------------|---------|----------|
| notes | Internal | General notes | No |
| internal_notes | Internal only | Confidential notes | No |
| vendor_notes | Vendor & internal | Instructions for vendor | No |
| delivery_instructions | Warehouse & vendor | Delivery guidelines | No |

### Notes Field Usage

| Field | Example Content |
|-------|-----------------|
| notes | "Order for new store opening. Priority: High" |
| internal_notes | "Negotiate better price next time. Vendor slow to respond." |
| vendor_notes | "Please ensure quality packaging. Fragile items." |
| delivery_instructions | "Deliver to Bay 3, loading dock. Call 30 min before arrival." |

### Visibility Matrix

| Field | Creator | Approver | Receiver | Vendor | Printed on PO |
|-------|---------|----------|----------|--------|---------------|
| notes | ✓ | ✓ | ✓ | ✗ | ✗ |
| internal_notes | ✓ | ✓ | ✓ | ✗ | ✗ |
| vendor_notes | ✓ | ✓ | ✓ | ✓ | ✓ |
| delivery_instructions | ✓ | ✓ | ✓ | ✓ | ✓ |

### Notes on PO PDF
```
┌─────────────────────────────────────┐
│ VENDOR NOTES:                        │
│ Please ensure quality packaging.    │
│ Fragile items. Include packing list.│
├─────────────────────────────────────┤
│ DELIVERY INSTRUCTIONS:               │
│ Deliver to Bay 3, loading dock.     │
│ Call +94 11 234 5678 30 min before. │
│ Warehouse hours: 8 AM - 5 PM        │
└─────────────────────────────────────┘
```

### Expected Outcome
- Multiple communication channels
- Internal documentation capability
- Vendor instruction management
- Delivery coordination

### Verification Checklist
- [ ] notes field added
- [ ] internal_notes field added
- [ ] vendor_notes field added
- [ ] delivery_instructions field added
- [ ] Visibility documented
- [ ] Usage examples clear

---

## Task 12: Add PO Approval Fields

### Overview
Add approval workflow fields to support purchase order approval requirements based on amount thresholds. These fields enable governance and control over large purchases.

### Dependencies
- Task 04: Create PurchaseOrder Model Core
- Task 10: Add PO User Fields (approved_by)

### Instructions

1. **Add requires_approval field**
   - Add requires_approval as BooleanField
   - Set default=False
   - Automatically set based on approval threshold
   - Determines if PO needs approval before sending

2. **Add approved_at field**
   - Add approved_at as DateTimeField
   - Set blank=True, null=True
   - Timestamp when approval was granted

3. **Add approval_notes field**
   - Add approval_notes as TextField
   - Set blank=True
   - Approver's comments or conditions

4. **Add rejected_at field**
   - Add rejected_at as DateTimeField
   - Set blank=True, null=True
   - Timestamp if PO was rejected

5. **Add rejection_reason field**
   - Add rejection_reason as TextField
   - Set blank=True
   - Reason for rejection

6. **Update model docstring**
   - Document approval workflow
   - Explain threshold logic
   - Note approval requirements

### Approval Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| requires_approval | BooleanField | Approval needed flag | Yes (default False) |
| approved_at | DateTimeField | Approval timestamp | No |
| approval_notes | TextField | Approver comments | No |
| rejected_at | DateTimeField | Rejection timestamp | No |
| rejection_reason | TextField | Rejection reason | No |

### Approval Logic Flow
```
PO Total >= Threshold?
     │
     ├─→ YES: requires_approval = True
     │        status remains DRAFT until approved
     │
     └─→ NO:  requires_approval = False
              can send immediately
```

### Approval States

| State | requires_approval | approved_at | rejected_at | status |
|-------|-------------------|-------------|-------------|--------|
| No approval needed | False | NULL | NULL | DRAFT → SENT |
| Awaiting approval | True | NULL | NULL | DRAFT |
| Approved | True | Set | NULL | DRAFT → SENT |
| Rejected | True | NULL | Set | DRAFT |

### Approval Threshold Example
```
POSettings for tenant:
  approval_threshold: Rs. 1,000,000

PO Total: Rs. 1,294,150
     ↓
Total > Threshold
     ↓
requires_approval = True
     ↓
Status: DRAFT (awaiting approval)
     ↓
Approved by: Jane Smith (2026-01-15 15:30)
Approval Notes: "Approved. Urgent requirement."
     ↓
Status: Can now be SENT
```

### Approval Timeline
```
Created: 2026-01-15 10:00 (John Doe)
     ↓
Requires Approval: YES (Total: Rs. 1,294,150)
     ↓
Submitted for Approval: 2026-01-15 10:30
     ↓
Approved: 2026-01-15 15:30 (Jane Smith)
Approval Notes: "Approved for Q1 budget"
     ↓
Sent to Vendor: 2026-01-15 16:00
```

### Rejection Handling
```
If Rejected:
1. rejected_at = current timestamp
2. rejection_reason = approver's reason
3. status remains DRAFT
4. Creator notified
5. Can edit and resubmit
```

### Expected Outcome
- Approval workflow enforcement
- Governance for large purchases
- Audit trail for approvals/rejections
- Threshold-based automation

### Verification Checklist
- [ ] requires_approval field added
- [ ] approved_at field added
- [ ] approval_notes field added
- [ ] rejected_at field added
- [ ] rejection_reason field added
- [ ] Approval logic documented

---

## Summary

This document added comprehensive business fields to the PurchaseOrder model:

| Category | Fields Added | Purpose |
|----------|--------------|---------|
| Shipping | 5 fields | Logistics and delivery tracking |
| Financial | 6 fields | Cost calculation and reporting |
| Payment | 5 fields | Payment terms and tracking |
| User Tracking | 3 fields | Accountability and audit |
| Notes | 4 fields | Communication and documentation |
| Approval | 5 fields | Governance and control |

### Total Model Progress
- **Core fields**: 5 fields (Document 01)
- **Business fields**: 28 fields (This document)
- **Remaining**: Warehouse, PDF, indexes (Document 03)

### Next Steps
- **Document 03**: Add warehouse field, implement PO number generator, add PDF storage, create indexes and constraints, run migrations
- Complete the PurchaseOrder model
- Make model database-ready

---

## Validation Points

Before proceeding to the next document:
- [ ] All 6 tasks completed
- [ ] Shipping fields for logistics added
- [ ] Financial fields for calculations added
- [ ] Payment fields for terms tracking added
- [ ] User fields for accountability added
- [ ] Notes fields for communication added
- [ ] Approval fields for governance added
- [ ] All fields documented in model
