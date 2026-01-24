# Tasks 43-48: Approval, History, and Settings

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** C - PO Creation & Sending  
> **Document:** 02 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_PO-Service-Creation.md](01_Tasks-35-42_PO-Service-Creation.md)
- **→ Next Document:** [03_Tasks-49-50_Split-Consolidation.md](03_Tasks-49-50_Split-Consolidation.md)

---

## Document Overview

This document implements the approval workflow system, history tracking for audit trails, and tenant-level settings for purchase order configuration. These features provide governance, accountability, and customization capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Implement PO Approval Workflow | Medium | 25 min |
| 44 | Create POHistory Model | Medium | 25 min |
| 45 | Implement History Logging | Medium | 25 min |
| 46 | Create POSettings Model | Medium | 25 min |
| 47 | Implement Approval Threshold | Medium | 20 min |
| 48 | Run PO Service Migrations | Low | 15 min |

---

## Task 43: Implement PO Approval Workflow

### Overview
Implement approval workflow that requires management approval for purchase orders exceeding a configured threshold amount before they can be sent to vendors.

### Dependencies
- Group A: PurchaseOrder approval fields exist
- Task 35: POService created

### Instructions

1. **Add approve_po method to POService**
   - Accept po_id, approval_notes, and approving user
   - Validate PO requires approval
   - Check user has approval permission
   - Set approved_at and approved_by
   - Allow status change to SENT

2. **Add reject_po method**
   - Accept po_id, rejection_reason, and user
   - Set rejected_at timestamp
   - Store rejection_reason
   - Keep status as DRAFT for revision

3. **Add request_approval method**
   - Accept po_id and user
   - Check if approval required
   - Mark PO as awaiting approval
   - Send notification to approvers
   - Return approval request status

4. **Implement approval check**
   - Create check_requires_approval method
   - Compare PO total against threshold
   - Set requires_approval flag
   - Called during PO creation and updates

5. **Add approval permissions**
   - Check user has approve_purchase_orders permission
   - Verify user not same as creator (separation of duties)
   - Check approval delegation rules

6. **Update send_po method**
   - Before sending, check requires_approval
   - If requires approval, check approved_at is set
   - Raise error if not approved
   - Allow send if approved or not required

7. **Add approval notifications**
   - Email approvers when approval requested
   - Notify creator when approved
   - Alert creator when rejected
   - Include PO details and approval link

8. **Create get_pending_approvals query**
   - Method to get POs awaiting approval
   - Filter by requires_approval=True and approved_at=NULL
   - Order by priority or amount
   - Return queryset for approval dashboard

### Approval Workflow Flow

```
PO Created:
├── Check if total >= approval_threshold
├── If yes: Set requires_approval = True
└── Status: DRAFT (awaiting approval)

Request Approval:
├── Send notification to approvers
├── Include PO details, total, justification
└── Provide approval/reject links

Approval Decision:
├── Approve:
│   ├── Set approved_at, approved_by
│   ├── Add approval_notes
│   └── Can now send to vendor
└── Reject:
    ├── Set rejected_at, rejection_reason
    ├── Status remains DRAFT
    └── Creator can revise and resubmit
```

### Approval Threshold Logic

```python
def check_requires_approval(po):
    """Check if PO requires approval"""
    settings = POSettings.get_for_tenant(po.tenant)
    
    if not settings.require_approval:
        return False
    
    if po.total >= settings.approval_threshold:
        po.requires_approval = True
        return True
    
    po.requires_approval = False
    return False
```

### Approval Methods

| Method | Purpose | Parameters |
|--------|---------|------------|
| approve_po | Approve PO | po_id, notes, user |
| reject_po | Reject PO | po_id, reason, user |
| request_approval | Request approval | po_id, user |
| check_requires_approval | Check threshold | po |

### Separation of Duties

| Check | Rule |
|-------|------|
| Creator cannot approve | approved_by != created_by |
| Requires approver role | User has approve permission |
| Delegation | Approver can delegate |

### Expected Outcome
- Approval workflow enforced
- Governance for large purchases
- Clear approval tracking
- Separation of duties maintained

### Verification Checklist
- [ ] approve_po method implemented
- [ ] reject_po method added
- [ ] request_approval working
- [ ] Threshold check functional
- [ ] Permissions verified
- [ ] Notifications sent
- [ ] Pending approvals query created

---

## Task 44: Create POHistory Model

### Overview
Create POHistory model to track all changes to purchase orders, providing complete audit trail and change history for compliance and troubleshooting.

### Dependencies
- Group A: PurchaseOrder model exists

### Instructions

1. **Create po_history.py file**
   - Navigate to `apps/purchases/models/` directory
   - Create `po_history.py` file
   - Add comprehensive docstring

2. **Import required models**
   - Import models from django.db
   - Import PurchaseOrder
   - Import User
   - Import JSONField for data snapshots

3. **Define POHistory model**
   - Inherit from models.Model
   - Add docstring explaining purpose

4. **Add core fields**
   - id: UUIDField primary key
   - purchase_order: ForeignKey to PurchaseOrder
   - action: CharField with choices
   - changed_by: ForeignKey to User
   - changed_at: DateTimeField auto_now_add

5. **Add status tracking fields**
   - old_status: CharField (nullable)
   - new_status: CharField (nullable)
   - Track status transitions

6. **Add change details**
   - notes: TextField for description
   - data_snapshot: JSONField for complete PO state
   - changes: JSONField for field-level changes

7. **Add action choices**
   - CREATED, UPDATED, SENT, ACKNOWLEDGED
   - RECEIVED, CANCELLED, CLOSED
   - APPROVED, REJECTED
   - LINE_ADDED, LINE_REMOVED, LINE_UPDATED

8. **Configure Meta class**
   - Set ordering ['-changed_at']
   - Add indexes on purchase_order, action
   - Set verbose names

9. **Add __str__ method**
   - Return descriptive string
   - Format: "PO-2026-00001: SENT by User at timestamp"

10. **Update models __init__.py**
    - Import POHistory
    - Export for use

### POHistory Fields

| Field | Type | Purpose |
|-------|------|---------|
| id | UUIDField | Primary key |
| purchase_order | ForeignKey | Related PO |
| action | CharField | Type of change |
| changed_by | ForeignKey | Who made change |
| changed_at | DateTimeField | When changed |
| old_status | CharField | Previous status |
| new_status | CharField | New status |
| notes | TextField | Change description |
| data_snapshot | JSONField | Full PO state |
| changes | JSONField | Field changes |

### Action Choices

```python
HISTORY_ACTION_CHOICES = [
    ('CREATED', 'Created'),
    ('UPDATED', 'Updated'),
    ('SENT', 'Sent to Vendor'),
    ('ACKNOWLEDGED', 'Acknowledged by Vendor'),
    ('PARTIAL_RECEIVED', 'Partially Received'),
    ('RECEIVED', 'Fully Received'),
    ('CANCELLED', 'Cancelled'),
    ('CLOSED', 'Closed'),
    ('APPROVED', 'Approved'),
    ('REJECTED', 'Rejected'),
    ('LINE_ADDED', 'Line Item Added'),
    ('LINE_REMOVED', 'Line Item Removed'),
    ('LINE_UPDATED', 'Line Item Updated'),
]
```

### Data Snapshot Structure

```json
{
  "po_number": "PO-2026-00001",
  "vendor": "ABC Electronics",
  "status": "SENT",
  "total": "1294150.00",
  "line_count": 3,
  "created_at": "2026-01-15T10:00:00Z"
}
```

### Changes Structure

```json
{
  "fields_changed": ["status", "sent_at"],
  "old_values": {
    "status": "DRAFT",
    "sent_at": null
  },
  "new_values": {
    "status": "SENT",
    "sent_at": "2026-01-15T16:00:00Z"
  }
}
```

### Expected Outcome
- Complete audit trail
- All PO changes tracked
- Detailed change information
- Compliance support

### Verification Checklist
- [ ] po_history.py file created
- [ ] POHistory model defined
- [ ] All fields added
- [ ] Action choices complete
- [ ] Meta class configured
- [ ] Model exported

---

## Task 45: Implement History Logging

### Overview
Implement automatic history logging that creates POHistory entries for all significant PO operations and changes.

### Dependencies
- Task 44: Create POHistory Model

### Instructions

1. **Create logging utility**
   - Add log_history function to POService
   - Accept PO, action, user, notes, changes
   - Create POHistory entry
   - Store data snapshot

2. **Capture data snapshot**
   - Create get_po_snapshot method
   - Extract key PO fields
   - Include line item summary
   - Return dictionary

3. **Track field changes**
   - Compare old vs new values
   - Identify changed fields
   - Store changes dictionary
   - Exclude timestamp fields

4. **Add to all PO operations**
   - Log on create_manual_po
   - Log on send_po, acknowledge_po
   - Log on approve_po, reject_po
   - Log on cancel_po, close_po

5. **Add line item change logging**
   - Log when line added
   - Log when line updated
   - Log when line removed
   - Include line details

6. **Create history retrieval methods**
   - get_po_history(po_id): Get all history
   - get_recent_changes(po_id, limit): Recent N changes
   - get_status_history(po_id): Status transitions only

7. **Add history display helper**
   - Format history for display
   - Generate human-readable descriptions
   - Include user and timestamp

8. **Optimize queries**
   - Use select_related for user/PO
   - Prefetch for efficiency
   - Index for fast retrieval

### History Logging Implementation

```python
def log_history(po, action, user, notes='', changes=None):
    """Log PO history entry"""
    from .models import POHistory
    
    # Get current status
    old_status = None
    new_status = po.status
    
    if changes and 'status' in changes.get('fields_changed', []):
        old_status = changes['old_values'].get('status')
    
    # Create snapshot
    snapshot = {
        'po_number': po.po_number,
        'vendor': po.vendor.name,
        'status': po.status,
        'total': str(po.total),
        'line_count': po.line_items.count(),
        'created_at': po.created_at.isoformat(),
    }
    
    # Create history entry
    POHistory.objects.create(
        purchase_order=po,
        action=action,
        changed_by=user,
        old_status=old_status,
        new_status=new_status,
        notes=notes,
        data_snapshot=snapshot,
        changes=changes or {}
    )
```

### Integration Points

| Operation | Action | Notes |
|-----------|--------|-------|
| create_manual_po | CREATED | Initial creation |
| send_po | SENT | Status change |
| acknowledge_po | ACKNOWLEDGED | Vendor confirmation |
| approve_po | APPROVED | Approval granted |
| reject_po | REJECTED | Approval denied |
| cancel_po | CANCELLED | PO cancelled |
| add_line_item | LINE_ADDED | Item added |
| remove_line_item | LINE_REMOVED | Item removed |

### History Display Format

```
PO-2026-00001 History:

2026-01-17 14:30 - ACKNOWLEDGED by System
  Vendor acknowledged order with reference VEN-12345
  Status: SENT → ACKNOWLEDGED

2026-01-15 16:00 - SENT by John Doe
  Purchase order sent to vendor
  Status: DRAFT → SENT

2026-01-15 15:30 - APPROVED by Jane Smith
  Approved with notes: "Approved for Q1 budget"
  Approval granted

2026-01-15 10:00 - CREATED by John Doe
  Purchase order created with 3 line items
  Total: Rs. 1,294,150.00
```

### Expected Outcome
- Automatic history logging
- Complete audit trail
- Easy history retrieval
- Human-readable format

### Verification Checklist
- [ ] log_history utility created
- [ ] Data snapshot captured
- [ ] Change tracking implemented
- [ ] Integrated in all operations
- [ ] Retrieval methods added
- [ ] Display formatting working

---

## Task 46: Create POSettings Model

### Overview
Create POSettings model for tenant-level configuration of purchase order behavior, including numbering, approval thresholds, and default values.

### Dependencies
- Tenant model from multi-tenancy

### Instructions

1. **Create po_settings.py file**
   - Navigate to `apps/purchases/models/` directory
   - Create `po_settings.py` file

2. **Define POSettings model**
   - OneToOneField to Tenant
   - Settings for PO operations

3. **Add numbering fields**
   - po_number_prefix: CharField (default "PO")
   - po_number_sequence: IntegerField (current sequence)
   - grn_number_prefix: CharField (default "GRN")
   - grn_number_sequence: IntegerField

4. **Add approval fields**
   - require_approval: BooleanField
   - approval_threshold: DecimalField
   - auto_send_on_approval: BooleanField

5. **Add default values**
   - default_payment_terms: IntegerField (days)
   - default_shipping_method: CharField
   - default_currency: CharField (default LKR)

6. **Add behavior flags**
   - allow_partial_receiving: BooleanField
   - require_vendor_reference: BooleanField
   - auto_close_on_full_receive: BooleanField

7. **Add notification settings**
   - notify_on_approval: BooleanField
   - notify_on_acknowledgment: BooleanField
   - overdue_reminder_days: IntegerField

8. **Add class method**
   - get_for_tenant(tenant): Get or create settings
   - Ensures settings always exist

9. **Configure Meta**
   - verbose_name, ordering

10. **Update models __init__.py**
    - Import and export POSettings

### POSettings Fields

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| tenant | OneToOneField | - | Tenant link |
| po_number_prefix | CharField | "PO" | PO number prefix |
| po_number_sequence | IntegerField | 1 | Current sequence |
| grn_number_prefix | CharField | "GRN" | GRN prefix |
| require_approval | BooleanField | False | Approval needed |
| approval_threshold | DecimalField | 1000000 | Amount threshold |
| default_payment_terms | IntegerField | 30 | Days for payment |
| default_shipping_method | CharField | "Ground" | Shipping method |
| allow_partial_receiving | BooleanField | True | Partial receive |

### get_for_tenant Method

```python
@classmethod
def get_for_tenant(cls, tenant):
    """Get or create settings for tenant"""
    settings, created = cls.objects.get_or_create(
        tenant=tenant,
        defaults={
            'po_number_prefix': 'PO',
            'po_number_sequence': 1,
            'require_approval': False,
            'approval_threshold': Decimal('1000000.00'),
            'default_payment_terms': 30,
        }
    )
    return settings
```

### Settings Usage

```python
# In PO creation
settings = POSettings.get_for_tenant(po.tenant)

# Apply defaults
po.payment_terms = f"Net {settings.default_payment_terms}"
po.shipping_method = settings.default_shipping_method
po.currency = settings.default_currency

# Check approval
if po.total >= settings.approval_threshold:
    po.requires_approval = True
```

### Expected Outcome
- Tenant-specific configuration
- Flexible PO behavior
- Default value management
- Approval threshold control

### Verification Checklist
- [ ] po_settings.py created
- [ ] POSettings model defined
- [ ] All configuration fields added
- [ ] get_for_tenant method implemented
- [ ] Model exported

---

## Task 47: Implement Approval Threshold

### Overview
Implement automatic approval threshold checking that sets requires_approval flag based on PO total compared to configured threshold.

### Dependencies
- Task 43: Approval workflow implemented
- Task 46: POSettings model created

### Instructions

1. **Update PO save method**
   - Override save on PurchaseOrder
   - Check threshold before saving
   - Set requires_approval flag
   - Call super().save()

2. **Create check_approval_threshold method**
   - Add to PurchaseOrder model
   - Get tenant settings
   - Compare total to threshold
   - Set requires_approval flag

3. **Integrate in POService**
   - Call check on create_manual_po
   - Call after recalculation
   - Call on total updates

4. **Add threshold notification**
   - Alert creator if approval needed
   - Show threshold amount
   - Provide approval request option

5. **Handle threshold changes**
   - When settings updated, recalculate
   - Update requires_approval for existing draft POs
   - Management command for bulk update

6. **Add bypass mechanism**
   - Allow manual override for special cases
   - Require higher permission
   - Log bypass in history

### Threshold Check Implementation

```python
def check_approval_threshold(self):
    """Check if PO requires approval based on threshold"""
    if self.status != 'DRAFT':
        return  # Only check drafts
    
    settings = POSettings.get_for_tenant(self.tenant)
    
    if not settings.require_approval:
        self.requires_approval = False
        return
    
    if self.total >= settings.approval_threshold:
        self.requires_approval = True
    else:
        self.requires_approval = False
```

### Threshold Scenarios

| PO Total | Threshold | Requires Approval |
|----------|-----------|-------------------|
| Rs. 500,000 | Rs. 1,000,000 | No |
| Rs. 1,000,000 | Rs. 1,000,000 | Yes (equal) |
| Rs. 1,500,000 | Rs. 1,000,000 | Yes |

### Notification Message

```
Purchase Order PO-2026-00001 requires approval

Total: Rs. 1,294,150.00
Threshold: Rs. 1,000,000.00

This purchase order exceeds the approval threshold and requires management approval before it can be sent to the vendor.

[Request Approval]
```

### Expected Outcome
- Automatic threshold checking
- Appropriate approval flagging
- Clear notifications
- Governance enforcement

### Verification Checklist
- [ ] check_approval_threshold method implemented
- [ ] Integrated in save method
- [ ] Used in POService
- [ ] Notifications working
- [ ] Threshold respected

---

## Task 48: Run PO Service Migrations

### Overview
Generate and apply migrations for POHistory and POSettings models.

### Dependencies
- Tasks 44, 46: Models created

### Instructions

1. **Update models __init__.py**
   - Ensure POHistory imported
   - Ensure POSettings imported

2. **Generate migrations**
   - Run makemigrations purchases
   - Review migration file
   - Should be 0003_history_settings.py

3. **Review migration**
   - Check POHistory table creation
   - Check POSettings table creation
   - Verify foreign keys

4. **Apply migrations**
   - Run migrate for public schema
   - Run tenant migrations
   - Verify success

5. **Create default settings**
   - Create management command
   - Generate settings for existing tenants
   - Set default values

### Expected Migration Operations

```
- CreateModel POHistory
- CreateModel POSettings
- Add indexes
- Add constraints
```

### Expected Outcome
- Database tables created
- Models functional
- Settings available

### Verification Checklist
- [ ] models/__init__.py updated
- [ ] makemigrations successful
- [ ] Migrations applied
- [ ] Tables verified
- [ ] Default settings created

---

## Summary

This document implemented governance and tracking:

| Accomplishment | Impact |
|----------------|--------|
| Approval Workflow | Governance for large purchases |
| POHistory Model | Complete audit trail |
| History Logging | Automatic tracking |
| POSettings Model | Tenant configuration |
| Approval Threshold | Automated governance |
| Migrations | Database ready |

### Next Steps
- **Document 03**: Implement multi-vendor split and PO consolidation
- Complete Group C

---

## Validation Points

- [ ] All 6 tasks completed
- [ ] Approval workflow functional
- [ ] History tracking working
- [ ] Settings model created
- [ ] Threshold checking active
- [ ] Migrations applied
