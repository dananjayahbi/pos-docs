# Tasks 70-74: Approval Workflow

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** E - Approval & Posting  
> **Document:** 02 of 03  
> **Tasks Covered:** 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-69_Accounting-Period-Model.md](01_Tasks-65-69_Accounting-Period-Model.md)
- **→ Next Document:** [03_Tasks-75-80_Adjusting-Reversing-Services.md](03_Tasks-75-80_Adjusting-Reversing-Services.md)

---

## Document Overview

This document implements a comprehensive approval workflow system for journal entries, enabling organizations to enforce financial controls through threshold-based automatic approvals and manual review processes. The approval service manages the lifecycle of entry approvals from submission through final approval or rejection, ensuring proper authorization for significant financial transactions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 70 | Create Approval Workflow | High | 45 min |
| 71 | Add Approval Threshold | Medium | 25 min |
| 72 | Add Request Approval Method | Medium | 30 min |
| 73 | Add Approve Entry Method | Medium | 25 min |
| 74 | Add Reject Entry Method | Medium | 25 min |

---

## Task 70: Create Approval Workflow

### Overview
Create the ApprovalService class that manages the journal entry approval workflow. This service orchestrates the approval process, enforces business rules, validates entry states, and coordinates status transitions from draft through approval to final posting readiness.

### Dependencies
- Task 69: Run Period Migrations (AccountingPeriod model exists)
- JournalEntry model with status field
- Entry status constants (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED)
- User authentication system

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/accounting/` directory
   - Create `services/` directory if it doesn't exist
   - Create `__init__.py` in `services/` directory

2. **Create approval_service.py file**
   - Create file at `apps/accounting/services/approval_service.py`
   - Add module docstring explaining approval workflow purpose

3. **Import required dependencies**
   - Import Django models and queries
   - Import decimal for threshold calculations
   - Import timezone utilities for timestamps
   - Import JournalEntry and related models
   - Import entry status constants
   - Import user model and permissions

4. **Define ApprovalService class**
   - Create class with clear docstring
   - Explain approval workflow logic
   - Document status transitions

5. **Add class-level constants**
   - Define VALID_ENTRY_STATUSES for approval operations
   - Define STATUS_TRANSITIONS mapping
   - Document allowed state transitions

6. **Add initialization method**
   - Initialize with optional tenant parameter
   - Store tenant for multi-tenancy support
   - Set up logging for approval operations

7. **Add validation helper methods**
   - Create _validate_entry_exists method
   - Create _validate_entry_status method
   - Create _validate_user_permissions method
   - Create _validate_entry_balance method

8. **Add entry state check methods**
   - Create can_request_approval method
   - Create can_approve method
   - Create can_reject method
   - Create is_balanced method

9. **Add approval history tracking**
   - Create _log_approval_action method
   - Track who approved/rejected
   - Record timestamps
   - Store approval reason/notes

10. **Add notification methods**
    - Create _notify_approval_requested method
    - Create _notify_entry_approved method
    - Create _notify_entry_rejected method
    - Hook for email/notification system

11. **Add get_pending_approvals method**
    - Query entries in PENDING_APPROVAL status
    - Filter by tenant
    - Order by submission date
    - Return queryset for admin review

12. **Add get_approval_statistics method**
    - Count entries by status
    - Calculate average approval time
    - Track approval rates
    - Return dictionary of statistics

13. **Update services/__init__.py**
    - Import ApprovalService
    - Add to __all__ list
    - Make service discoverable

### ApprovalService Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       ApprovalService                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Initialization:                                                  │
│    • __init__(tenant)                                             │
│    • Logger setup                                                 │
│                                                                   │
│  Validation Methods:                                              │
│    • _validate_entry_exists(entry_id)                             │
│    • _validate_entry_status(entry, allowed_statuses)              │
│    • _validate_user_permissions(user, action)                     │
│    • _validate_entry_balance(entry)                               │
│                                                                   │
│  State Check Methods:                                             │
│    • can_request_approval(entry) → Boolean                        │
│    • can_approve(entry, user) → Boolean                           │
│    • can_reject(entry, user) → Boolean                            │
│    • is_balanced(entry) → Boolean                                 │
│                                                                   │
│  Core Approval Methods:                                           │
│    • request_approval(entry, user) → Entry (Task 72)              │
│    • approve_entry(entry, user, notes) → Entry (Task 73)          │
│    • reject_entry(entry, user, reason) → Entry (Task 74)          │
│                                                                   │
│  Threshold Logic:                                                 │
│    • get_approval_threshold(tenant) → Decimal (Task 71)           │
│    • requires_manual_approval(entry) → Boolean (Task 71)          │
│    • auto_approve_if_below_threshold(entry) → Entry (Task 71)     │
│                                                                   │
│  Tracking & Logging:                                              │
│    • _log_approval_action(entry, user, action, notes)             │
│    • get_approval_history(entry) → QuerySet                       │
│                                                                   │
│  Notifications:                                                   │
│    • _notify_approval_requested(entry)                            │
│    • _notify_entry_approved(entry, approver)                      │
│    • _notify_entry_rejected(entry, rejector, reason)              │
│                                                                   │
│  Query Methods:                                                   │
│    • get_pending_approvals(filters) → QuerySet                    │
│    • get_approval_statistics() → Dict                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Approval Workflow State Machine

```
Entry Status Lifecycle with Approval
════════════════════════════════════

                    ┌──────────┐
                    │  DRAFT   │
                    └────┬─────┘
                         │
                         │ request_approval()
                         ▼
              ┌─────────────────────┐
              │ PENDING_APPROVAL    │◄──────────┐
              └──────┬──────┬───────┘           │
                     │      │                   │
         ┌───────────┘      └──────────┐        │
         │                              │        │
         │ approve_entry()              │        │ Can loop back
         │                              │        │ if re-submitted
         ▼                              ▼        │
    ┌──────────┐                 ┌───────────┐  │
    │ APPROVED │                 │ REJECTED  │──┘
    └────┬─────┘                 └───────────┘
         │                              │
         │                              │ back_to_draft()
         │ post_entry()                 │
         ▼                              ▼
    ┌──────────┐                 ┌──────────┐
    │  POSTED  │                 │  DRAFT   │
    └──────────┘                 └──────────┘
         │
         │ (final state)
         ▼
    [Immutable]
```

### Status Transition Rules

| From Status | To Status | Method | Conditions |
|-------------|-----------|--------|------------|
| DRAFT | PENDING_APPROVAL | request_approval() | Entry balanced, all required fields complete |
| PENDING_APPROVAL | APPROVED | approve_entry() | User has approval permission, entry valid |
| PENDING_APPROVAL | REJECTED | reject_entry() | User has approval permission, reason provided |
| REJECTED | DRAFT | back_to_draft() | User has edit permission, ready to resubmit |
| APPROVED | POSTED | post_entry() | Entry in valid period, all validations pass |

### Validation Logic Flow

```
Entry Submission Validation
═══════════════════════════

request_approval(entry, user)
    │
    ├─► Check: Entry exists?
    │       └─► No  → Raise EntryNotFound
    │       └─► Yes → Continue
    │
    ├─► Check: Entry status = DRAFT?
    │       └─► No  → Raise InvalidStatus
    │       └─► Yes → Continue
    │
    ├─► Check: Entry balanced (DR = CR)?
    │       └─► No  → Raise UnbalancedEntry
    │       └─► Yes → Continue
    │
    ├─► Check: All required fields complete?
    │       └─► No  → Raise IncompleteEntry
    │       └─► Yes → Continue
    │
    ├─► Check: Entry has line items?
    │       └─► No  → Raise NoLineItems
    │       └─► Yes → Continue
    │
    ├─► Check: All accounts valid and active?
    │       └─► No  → Raise InvalidAccount
    │       └─► Yes → Continue
    │
    └─► All validations passed → Proceed with approval
```

### Permission Requirements

| Action | Required Permission | Additional Checks |
|--------|-------------------|-------------------|
| Request Approval | `accounting.add_journalentry` | User owns entry or has edit permission |
| Approve Entry | `accounting.approve_journalentry` | User not the entry creator (segregation of duties) |
| Reject Entry | `accounting.approve_journalentry` | User not the entry creator |
| View Pending | `accounting.view_journalentry` | See only entries in own tenant |
| Override Threshold | `accounting.override_approval_threshold` | Can approve any amount |

### Approval History Tracking

```
┌────────────────────────────────────────────────────────────┐
│                   ApprovalHistory Model                     │
│                     (Future Extension)                      │
├────────────────────────────────────────────────────────────┤
│  • entry (ForeignKey to JournalEntry)                       │
│  • action (Choice: REQUESTED, APPROVED, REJECTED)           │
│  • user (ForeignKey to User)                                │
│  • timestamp (DateTimeField)                                │
│  • notes (TextField, optional)                              │
│  • previous_status (CharField)                              │
│  • new_status (CharField)                                   │
└────────────────────────────────────────────────────────────┘

Timeline Example:
═════════════════
Entry #JE-2026-001 Approval History:

2026-01-20 10:30 AM │ Status: DRAFT → PENDING_APPROVAL
                    │ User: john.doe@example.com
                    │ Notes: Submitting for month-end approval

2026-01-20 02:15 PM │ Status: PENDING_APPROVAL → REJECTED
                    │ User: jane.manager@example.com
                    │ Notes: Missing expense documentation

2026-01-21 09:00 AM │ Status: REJECTED → DRAFT
                    │ User: john.doe@example.com
                    │ Notes: Added supporting documents

2026-01-21 11:45 AM │ Status: DRAFT → PENDING_APPROVAL
                    │ User: john.doe@example.com
                    │ Notes: Re-submitting with documentation

2026-01-21 03:30 PM │ Status: PENDING_APPROVAL → APPROVED
                    │ User: jane.manager@example.com
                    │ Notes: Approved - documentation complete
```

### Notification Integration Points

```
Notification Triggers
════════════════════

Entry Submitted for Approval
    │
    ├─► Email to Approvers
    │     Subject: "New Journal Entry Requires Approval"
    │     Body: Entry details, amount, creator, link
    │
    └─► Dashboard Notification
          Badge count of pending approvals

Entry Approved
    │
    ├─► Email to Entry Creator
    │     Subject: "Your Journal Entry Has Been Approved"
    │     Body: Entry number, approver, timestamp
    │
    └─► Dashboard Notification
          Success notification

Entry Rejected
    │
    ├─► Email to Entry Creator
    │     Subject: "Journal Entry Rejected - Action Required"
    │     Body: Entry number, rejection reason, resubmission steps
    │
    └─► Dashboard Notification
          Warning notification with reason
```

### Query Methods Return Format

```python
# get_pending_approvals() returns:
{
    'count': 15,
    'entries': QuerySet[JournalEntry],
    'total_amount': Decimal('125000.00'),
    'oldest_pending': datetime(2026, 01, 15),
    'by_creator': {
        'user1@example.com': 5,
        'user2@example.com': 10
    }
}

# get_approval_statistics() returns:
{
    'pending_count': 15,
    'approved_count': 120,
    'rejected_count': 8,
    'approval_rate': 0.93,  # 93%
    'avg_approval_time_hours': 4.5,
    'by_month': {
        '2026-01': {'approved': 30, 'rejected': 2},
        '2025-12': {'approved': 45, 'rejected': 3}
    }
}
```

### Expected Outcome
- Fully functional ApprovalService class
- Comprehensive validation framework
- State transition management
- Approval history tracking foundation
- Permission-based access control
- Query methods for pending approvals
- Statistics and reporting capabilities

### Verification Checklist
- [ ] `services/` directory created
- [ ] `approval_service.py` file created
- [ ] ApprovalService class defined
- [ ] Validation methods implemented
- [ ] State check methods implemented
- [ ] Approval history logging prepared
- [ ] Notification hooks created
- [ ] Query methods implemented
- [ ] Permission checks included
- [ ] Service imported in __init__.py
- [ ] Comprehensive docstrings added

---

## Task 71: Add Approval Threshold

### Overview
Implement threshold-based automatic approval logic that allows entries below a configured amount to bypass manual approval. This feature streamlines the approval process for routine, low-value transactions while ensuring proper oversight for significant financial entries.

### Dependencies
- Task 70: Create Approval Workflow

### Instructions

1. **Open approval_service.py file**
   - Navigate to `apps/accounting/services/approval_service.py`
   - Locate ApprovalService class

2. **Create threshold configuration**
   - Define DEFAULT_APPROVAL_THRESHOLD constant
   - Set default value (e.g., 10000.00 LKR)
   - Add docstring explaining threshold purpose

3. **Add get_approval_threshold method**
   - Accept tenant parameter
   - Query tenant settings for custom threshold
   - Return tenant-specific or default threshold
   - Cache threshold for performance

4. **Add requires_manual_approval method**
   - Accept JournalEntry instance
   - Calculate total debit/credit amount
   - Compare against threshold
   - Return Boolean indicating manual approval need

5. **Add calculate_entry_amount method**
   - Accept JournalEntry instance
   - Sum total debits (or credits, they're equal)
   - Handle absolute values for comparison
   - Return Decimal amount

6. **Add auto_approve_if_below_threshold method**
   - Accept entry and user parameters
   - Check if entry amount below threshold
   - Validate entry is in correct status
   - Auto-approve if below threshold
   - Log auto-approval action
   - Return updated entry or None

7. **Create threshold validation**
   - Add _validate_threshold_amount method
   - Ensure threshold is positive
   - Check threshold not zero
   - Validate decimal precision

8. **Add threshold override check**
   - Create has_threshold_override_permission method
   - Check user permissions
   - Allow specific users to bypass threshold
   - Use for emergency approvals

9. **Add threshold configuration retrieval**
   - Create get_threshold_config method
   - Return threshold settings
   - Include enabled/disabled flag
   - Show threshold amount and currency

10. **Update request_approval method**
    - Integrate auto-approval logic
    - Check threshold before manual approval
    - Auto-approve eligible entries
    - Log automatic approval
    - Notify user of auto-approval

11. **Add threshold logging**
    - Log when entry auto-approved
    - Log when entry requires manual approval
    - Track threshold comparisons
    - Audit trail for compliance

### Threshold Configuration Structure

```
┌──────────────────────────────────────────────────────────────┐
│               Approval Threshold Configuration                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Tenant Settings (AccountingSettings model):                 │
│    • approval_threshold_enabled (Boolean, default=True)      │
│    • approval_threshold_amount (Decimal, default=10000.00)   │
│    • approval_threshold_currency (CharField, default='LKR')  │
│    • require_approval_for_adjustments (Boolean, default=True)│
│    • require_approval_for_reversals (Boolean, default=True)  │
│                                                               │
│  Global Defaults (settings.py):                              │
│    • DEFAULT_APPROVAL_THRESHOLD = Decimal('10000.00')        │
│    • MIN_APPROVAL_THRESHOLD = Decimal('100.00')              │
│    • MAX_APPROVAL_THRESHOLD = Decimal('1000000.00')          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Threshold Decision Logic

```
Entry Approval Decision Tree
════════════════════════════

Entry submitted via request_approval()
    │
    ├─► Check: Is threshold enabled for tenant?
    │       │
    │       ├─► No  → Require manual approval
    │       │        (All entries need approval)
    │       │
    │       └─► Yes → Continue to amount check
    │
    ├─► Calculate total entry amount
    │       │
    │       ├─► Sum all debit amounts
    │       └─► Use absolute value
    │
    ├─► Get threshold amount
    │       │
    │       ├─► Check tenant settings
    │       ├─► If not set, use default (10,000 LKR)
    │       └─► Cache for performance
    │
    ├─► Compare entry amount to threshold
    │       │
    │       ├─► Entry amount < Threshold
    │       │       │
    │       │       ├─► Auto-approve entry
    │       │       ├─► Set status = APPROVED
    │       │       ├─► Log: "Auto-approved (below threshold)"
    │       │       └─► Send notification to creator
    │       │
    │       └─► Entry amount ≥ Threshold
    │               │
    │               ├─► Set status = PENDING_APPROVAL
    │               ├─► Log: "Requires manual approval"
    │               └─► Notify approvers
    │
    └─► Return updated entry
```

### Threshold Calculation Examples

#### Example 1: Simple Entry Below Threshold
```
Journal Entry JE-2026-045
═════════════════════════
Date: 2026-01-20
Description: Office supplies purchase

Line Items:
DR  Office Supplies Expense    2,500.00
    CR  Cash                           2,500.00

Total Amount: LKR 2,500.00
Threshold: LKR 10,000.00

Decision: 2,500.00 < 10,000.00
Result: ✓ AUTO-APPROVED
Reason: Below approval threshold
Status: APPROVED (ready to post)
```

#### Example 2: Entry Above Threshold
```
Journal Entry JE-2026-046
═════════════════════════
Date: 2026-01-20
Description: Equipment purchase

Line Items:
DR  Equipment                  45,000.00
    CR  Cash                           45,000.00

Total Amount: LKR 45,000.00
Threshold: LKR 10,000.00

Decision: 45,000.00 ≥ 10,000.00
Result: ⚠ REQUIRES MANUAL APPROVAL
Reason: Exceeds approval threshold
Status: PENDING_APPROVAL (awaiting manager review)
Notification: Sent to approvers
```

#### Example 3: Multi-Line Entry
```
Journal Entry JE-2026-047
═════════════════════════
Date: 2026-01-20
Description: Monthly expense allocation

Line Items:
DR  Rent Expense               8,000.00
DR  Utilities Expense          1,200.00
DR  Insurance Expense          2,300.00
    CR  Cash                          11,500.00

Total Amount: LKR 11,500.00
Threshold: LKR 10,000.00

Decision: 11,500.00 ≥ 10,000.00
Result: ⚠ REQUIRES MANUAL APPROVAL
Reason: Total exceeds threshold
Note: Individual lines below threshold, but total above
```

#### Example 4: Threshold Disabled
```
Journal Entry JE-2026-048
═════════════════════════
Date: 2026-01-20
Description: Petty cash expense

Line Items:
DR  Miscellaneous Expense        500.00
    CR  Petty Cash                     500.00

Total Amount: LKR 500.00
Threshold: DISABLED (for this tenant)

Decision: N/A (threshold checking disabled)
Result: ⚠ REQUIRES MANUAL APPROVAL
Reason: Tenant requires approval for all entries
Status: PENDING_APPROVAL
```

### Threshold Configuration Scenarios

| Scenario | Threshold | Use Case | Rationale |
|----------|-----------|----------|-----------|
| Micro Business | LKR 5,000 | Small retail shop | Low-value daily transactions |
| Small Business | LKR 10,000 | Standard SME | Balance control vs efficiency |
| Medium Business | LKR 50,000 | Growing company | Higher routine transaction values |
| Large Enterprise | LKR 100,000 | Corporation | Significant transaction volumes |
| Strict Control | DISABLED | Audited entities | All entries require approval |
| Emergency Override | TEMPORARY RAISE | Month-end close | Speed up period-end processing |

### Special Threshold Rules

#### Entry Type Overrides
```
Entry Type-Specific Thresholds
══════════════════════════════

STANDARD Entry:
    → Use configured threshold (10,000 LKR)

ADJUSTING Entry:
    → Always require approval
    → Ignore threshold (too sensitive)
    → Set in require_approval_for_adjustments flag

REVERSING Entry:
    → Always require approval
    → Ignore threshold (affects prior periods)
    → Set in require_approval_for_reversals flag

RECURRING Entry (first generation):
    → Require approval regardless of amount
    → Subsequent auto-generated: use threshold

CLOSING Entry:
    → Always require approval
    → Critical financial operation
    → Typically done by controller/manager
```

### Threshold Override Permissions

| Permission | Can Override | Use Case |
|-----------|--------------|----------|
| `accounting.approve_journalentry` | No | Standard approver |
| `accounting.override_approval_threshold` | Yes | CFO, Controller |
| `accounting.emergency_approval` | Yes | Emergency situations |
| Tenant Owner | Yes | Administrative control |

### Amount Calculation Logic

```python
# Pseudo-code for calculate_entry_amount method

def calculate_entry_amount(entry):
    """
    Calculate total amount for threshold comparison.
    Uses sum of debits (equals sum of credits in balanced entry).
    
    Args:
        entry (JournalEntry): Entry to calculate amount for
        
    Returns:
        Decimal: Total amount for threshold comparison
    """
    
    # Sum all debit line items
    total_debits = entry.line_items.aggregate(
        total=Sum('debit_amount')
    )['total'] or Decimal('0.00')
    
    # Use absolute value for comparison
    # (handles both normal and correction entries)
    absolute_amount = abs(total_debits)
    
    return absolute_amount


# Example calculations:

Entry 1: DR 5,000 / CR 5,000
→ Total: 5,000.00

Entry 2: DR 8,000 + DR 2,000 / CR 10,000
→ Total: 10,000.00

Entry 3: DR 15,000 / CR 10,000 + CR 5,000
→ Total: 15,000.00
```

### Threshold Audit Trail

```
Approval Decision Log Format
════════════════════════════

Entry: JE-2026-045
Timestamp: 2026-01-20 10:30:15
User: john.doe@example.com
Action: request_approval

Threshold Check:
  ├─ Tenant: ABC Company (tenant_id: 12)
  ├─ Threshold Enabled: Yes
  ├─ Threshold Amount: LKR 10,000.00
  ├─ Entry Amount: LKR 2,500.00
  ├─ Comparison: 2,500.00 < 10,000.00
  └─ Decision: AUTO-APPROVE

Result:
  ├─ Status: DRAFT → APPROVED
  ├─ Approval Method: AUTOMATIC
  ├─ Approval Reason: Below threshold
  └─ Ready to Post: Yes

Notification:
  └─ Email sent to john.doe@example.com
      Subject: "Entry JE-2026-045 Auto-Approved"
```

### Expected Outcome
- Configurable approval thresholds per tenant
- Automatic approval for entries below threshold
- Manual approval requirement for large entries
- Amount calculation logic for multi-line entries
- Entry type-specific threshold rules
- Permission-based threshold overrides
- Comprehensive audit logging

### Verification Checklist
- [ ] DEFAULT_APPROVAL_THRESHOLD constant defined
- [ ] get_approval_threshold method implemented
- [ ] requires_manual_approval method created
- [ ] calculate_entry_amount method added
- [ ] auto_approve_if_below_threshold method implemented
- [ ] Threshold validation added
- [ ] Override permission check created
- [ ] request_approval method updated with auto-approval
- [ ] Threshold logging implemented
- [ ] Entry type-specific rules handled
- [ ] Documentation updated

---

## Task 72: Add Request Approval Method

### Overview
Implement the request_approval method that initiates the approval workflow for journal entries. This method validates entry readiness, applies threshold-based auto-approval logic, and transitions entries to pending approval status when manual review is required.

### Dependencies
- Task 70: Create Approval Workflow
- Task 71: Add Approval Threshold

### Instructions

1. **Open approval_service.py file**
   - Continue in `apps/accounting/services/approval_service.py`
   - Locate ApprovalService class

2. **Define request_approval method signature**
   - Accept entry parameter (JournalEntry instance or ID)
   - Accept user parameter (requesting user)
   - Accept optional notes parameter
   - Return updated entry instance

3. **Add method docstring**
   - Explain submission process
   - Document parameters and return value
   - List possible exceptions
   - Provide usage examples

4. **Implement entry retrieval**
   - Get entry by ID if needed
   - Validate entry exists
   - Check tenant association
   - Raise appropriate exceptions

5. **Add pre-submission validations**
   - Verify entry status is DRAFT
   - Check entry is balanced
   - Validate all line items present
   - Ensure all accounts are valid and active
   - Check date is within valid period
   - Validate required fields are complete

6. **Add business rule validations**
   - Check user has permission to submit
   - Verify entry not already in workflow
   - Validate description is not empty
   - Check minimum line item count (at least 2)
   - Ensure no duplicate line items

7. **Implement threshold check**
   - Calculate entry total amount
   - Get applicable threshold
   - Determine if manual approval needed
   - Handle entry type-specific rules

8. **Add auto-approval path**
   - If below threshold and eligible
   - Set status to APPROVED
   - Set approved_by to system/auto
   - Set approved_at timestamp
   - Log automatic approval
   - Skip pending approval step

9. **Add manual approval path**
   - If above threshold or ineligible for auto
   - Set status to PENDING_APPROVAL
   - Set submitted_for_approval_at timestamp
   - Set submitted_by user reference
   - Log submission for review
   - Trigger notification to approvers

10. **Add approval request logging**
    - Create approval history entry
    - Log submission user
    - Record submission timestamp
    - Store submission notes
    - Track previous and new status

11. **Implement notification triggers**
    - Call _notify_approval_requested
    - Send email to approvers (if manual)
    - Send confirmation to submitter
    - Update dashboard badges

12. **Add transaction wrapping**
    - Wrap entire operation in database transaction
    - Rollback on validation failure
    - Ensure atomic status updates
    - Handle concurrent submission attempts

13. **Add error handling**
    - Catch and translate exceptions
    - Provide clear error messages
    - Log errors for debugging
    - Return meaningful error responses

### Request Approval Method Flow

```
request_approval(entry, user, notes) Execution Flow
═══════════════════════════════════════════════════

START
  │
  ├─► Step 1: Retrieve and Validate Entry
  │     │
  │     ├─► Get entry by ID/instance
  │     ├─► Check: Entry exists? → No: Raise EntryNotFound
  │     ├─► Check: Belongs to tenant? → No: Raise PermissionDenied
  │     └─► Continue
  │
  ├─► Step 2: Validate Entry Status
  │     │
  │     ├─► Check: Status = DRAFT?
  │     │     └─► No: Raise InvalidStatus("Entry must be in DRAFT status")
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Not already in workflow?
  │           └─► No: Raise AlreadyInWorkflow
  │           └─► Yes: Continue
  │
  ├─► Step 3: Validate User Permissions
  │     │
  │     ├─► Check: User has submit permission?
  │     │     └─► No: Raise PermissionDenied
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: User owns entry or has edit rights?
  │           └─► No: Raise PermissionDenied
  │           └─► Yes: Continue
  │
  ├─► Step 4: Validate Entry Completeness
  │     │
  │     ├─► Check: Description not empty?
  │     │     └─► No: Raise ValidationError("Description required")
  │     │
  │     ├─► Check: Has line items (≥2)?
  │     │     └─► No: Raise ValidationError("Minimum 2 line items required")
  │     │
  │     ├─► Check: Entry balanced (DR = CR)?
  │     │     └─► No: Raise UnbalancedEntry
  │     │
  │     ├─► Check: All accounts valid and active?
  │     │     └─► No: Raise InvalidAccount
  │     │
  │     └─► Check: Date in valid/open period?
  │           └─► No: Raise PeriodClosedError
  │           └─► Yes: Continue
  │
  ├─► Step 5: Calculate Entry Amount
  │     │
  │     ├─► Sum total debits
  │     ├─► Verify equals total credits
  │     └─► Store amount for comparison
  │
  ├─► Step 6: Get Approval Threshold
  │     │
  │     ├─► Query tenant settings
  │     ├─► Check if threshold enabled
  │     └─► Get threshold amount (or default)
  │
  ├─► Step 7: Check Entry Type Rules
  │     │
  │     ├─► If ADJUSTING entry → Always require approval
  │     ├─► If REVERSING entry → Always require approval
  │     ├─► If CLOSING entry → Always require approval
  │     └─► If STANDARD → Apply threshold logic
  │
  ├─► Step 8: Apply Threshold Logic
  │     │
  │     ├─── Entry Amount < Threshold AND Eligible?
  │     │     │
  │     │     └─► YES: AUTO-APPROVAL PATH
  │     │           │
  │     │           ├─► Set status = APPROVED
  │     │           ├─► Set approved_by = SYSTEM
  │     │           ├─► Set approved_at = now()
  │     │           ├─► Log: "Auto-approved (below threshold)"
  │     │           ├─► Notify submitter (approved)
  │     │           └─► GOTO: Step 10 (Save & Return)
  │     │
  │     └─► NO: MANUAL APPROVAL PATH
  │           │
  │           ├─► Set status = PENDING_APPROVAL
  │           ├─► Set submitted_for_approval_at = now()
  │           ├─► Set submitted_by = user
  │           ├─► Log: "Submitted for manual approval"
  │           ├─► Notify approvers (pending)
  │           └─► Continue to Step 9
  │
  ├─► Step 9: Create Approval History Record
  │     │
  │     ├─► Create ApprovalHistory entry
  │     ├─► Record: entry, user, action, notes
  │     ├─► Store: previous_status, new_status
  │     └─► Timestamp: submission time
  │
  ├─► Step 10: Save Entry (Transactional)
  │     │
  │     ├─► Begin database transaction
  │     ├─► Save entry with new status
  │     ├─► Save approval history
  │     ├─► Commit transaction
  │     └─► On error: Rollback all changes
  │
  └─► Step 11: Return Updated Entry
        │
        └─► Return entry instance with new status

END
```

### Validation Error Scenarios

```
Common Validation Failures and Responses
════════════════════════════════════════

1. Entry Status Invalid
   ─────────────────────
   Request: Submit entry in APPROVED status
   Error: InvalidStatusError
   Message: "Entry must be in DRAFT status to request approval"
   User Action: Entry already approved, cannot resubmit

2. Entry Not Balanced
   ──────────────────
   Request: Submit entry with DR ≠ CR
   Error: UnbalancedEntryError
   Message: "Entry debits (10,000) do not equal credits (9,500)"
   User Action: Adjust line items to balance entry

3. Missing Line Items
   ──────────────────
   Request: Submit entry with 0 or 1 line item
   Error: ValidationError
   Message: "Entry must have at least 2 line items"
   User Action: Add required line items

4. Empty Description
   ─────────────────
   Request: Submit entry with blank description
   Error: ValidationError
   Message: "Entry description is required"
   User Action: Add meaningful description

5. Inactive Account Used
   ─────────────────────
   Request: Submit with inactive account
   Error: InvalidAccountError
   Message: "Account 'Old Cash Account' is inactive"
   User Action: Replace with active account

6. Period Closed
   ─────────────
   Request: Submit entry dated in closed period
   Error: PeriodClosedError
   Message: "Cannot submit entries for closed period 2025-12"
   User Action: Change entry date or reopen period

7. Permission Denied
   ─────────────────
   Request: User without submit permission
   Error: PermissionDenied
   Message: "You do not have permission to submit journal entries"
   User Action: Contact administrator for permissions
```

### Auto-Approval vs Manual Approval Examples

#### Auto-Approval Example
```
Entry Details:
─────────────
Entry ID: JE-2026-050
Date: 2026-01-20
Description: Office supplies purchase
Amount: LKR 3,500.00
Threshold: LKR 10,000.00

Request Approval:
────────────────
User: staff@example.com calls request_approval()

Processing:
──────────
✓ Status check: DRAFT
✓ Balance check: DR 3,500 = CR 3,500
✓ Line items: 2 (sufficient)
✓ Description: Present
✓ Accounts: All active
✓ Period: OPEN

Threshold Check:
───────────────
Amount: 3,500.00
Threshold: 10,000.00
Decision: 3,500 < 10,000 → AUTO-APPROVE

Result:
──────
Status: DRAFT → APPROVED
Approved By: SYSTEM (Auto)
Approved At: 2026-01-20 10:30:15
Ready to Post: YES

Notification:
────────────
Email to: staff@example.com
Subject: "Entry JE-2026-050 Auto-Approved"
Message: "Your entry has been automatically approved and is ready to post."
```

#### Manual Approval Example
```
Entry Details:
─────────────
Entry ID: JE-2026-051
Date: 2026-01-20
Description: Equipment purchase - Dell laptop
Amount: LKR 125,000.00
Threshold: LKR 10,000.00

Request Approval:
────────────────
User: staff@example.com calls request_approval()

Processing:
──────────
✓ Status check: DRAFT
✓ Balance check: DR 125,000 = CR 125,000
✓ Line items: 2 (sufficient)
✓ Description: Present
✓ Accounts: All active
✓ Period: OPEN

Threshold Check:
───────────────
Amount: 125,000.00
Threshold: 10,000.00
Decision: 125,000 ≥ 10,000 → REQUIRE APPROVAL

Result:
──────
Status: DRAFT → PENDING_APPROVAL
Submitted By: staff@example.com
Submitted At: 2026-01-20 10:32:48
Requires: Manager approval
Ready to Post: NO (awaiting approval)

Notifications:
─────────────
1. Email to: approvers@example.com
   Subject: "New Entry Requires Approval - JE-2026-051"
   Message: "Entry for LKR 125,000 requires your review."

2. Email to: staff@example.com
   Subject: "Entry JE-2026-051 Submitted for Approval"
   Message: "Your entry has been submitted and is pending approval."

3. Dashboard: Badge count updated (+1 pending)
```

### Concurrent Submission Handling

```
Scenario: Two users submit same entry simultaneously
═══════════════════════════════════════════════════

Time: 10:30:00.000
User A: Calls request_approval(entry_123, user_a)
User B: Calls request_approval(entry_123, user_b)

Database Transaction Handling:
─────────────────────────────

Request A:
  ├─ BEGIN TRANSACTION
  ├─ SELECT entry_123 FOR UPDATE (locks row)
  ├─ Check status: DRAFT → OK
  ├─ Perform validations
  ├─ Update status: DRAFT → PENDING_APPROVAL
  ├─ COMMIT TRANSACTION
  └─ Release lock

Request B (waiting on lock):
  ├─ BEGIN TRANSACTION (started)
  ├─ SELECT entry_123 FOR UPDATE (waiting...)
  ├─ Lock released by Request A
  ├─ Read entry_123 (status now PENDING_APPROVAL)
  ├─ Check status: PENDING_APPROVAL → FAIL
  ├─ ROLLBACK TRANSACTION
  └─ Raise InvalidStatusError("Entry already submitted")

Result:
──────
Request A: SUCCESS (entry submitted)
Request B: ERROR (entry already in workflow)
```

### Method Return Values

```python
# Success cases:

# Case 1: Auto-approved
{
    'entry': JournalEntry instance,
    'status': 'APPROVED',
    'approval_method': 'AUTOMATIC',
    'approved_by': 'SYSTEM',
    'approved_at': datetime,
    'ready_to_post': True,
    'message': 'Entry auto-approved (below threshold)'
}

# Case 2: Pending approval
{
    'entry': JournalEntry instance,
    'status': 'PENDING_APPROVAL',
    'submitted_by': User instance,
    'submitted_at': datetime,
    'requires_approval': True,
    'approvers_notified': True,
    'message': 'Entry submitted for approval'
}

# Error cases raise exceptions:
# - EntryNotFoundError
# - InvalidStatusError
# - UnbalancedEntryError
# - ValidationError
# - PermissionDenied
# - PeriodClosedError
```

### Expected Outcome
- Functional request_approval method
- Comprehensive pre-submission validation
- Integrated threshold-based auto-approval
- Manual approval path for large entries
- Transaction safety and concurrency handling
- Approval history tracking
- Notification triggers
- Clear error messages and exception handling

### Verification Checklist
- [ ] request_approval method defined
- [ ] Method signature includes entry, user, notes
- [ ] Entry retrieval and validation implemented
- [ ] Status validation added
- [ ] User permission checks included
- [ ] Entry completeness validation added
- [ ] Balance verification implemented
- [ ] Threshold check integrated
- [ ] Auto-approval path implemented
- [ ] Manual approval path implemented
- [ ] Approval history logging added
- [ ] Notification triggers included
- [ ] Transaction wrapping added
- [ ] Concurrent submission handling implemented
- [ ] Error handling comprehensive
- [ ] Docstring complete with examples

---

## Task 73: Add Approve Entry Method

### Overview
Implement the approve_entry method that allows authorized users to approve journal entries pending review. This method validates approver permissions, checks entry eligibility for approval, updates entry status, and triggers post-approval workflows.

### Dependencies
- Task 72: Add Request Approval Method

### Instructions

1. **Open approval_service.py file**
   - Continue in `apps/accounting/services/approval_service.py`
   - Locate ApprovalService class

2. **Define approve_entry method signature**
   - Accept entry parameter (JournalEntry instance or ID)
   - Accept approver parameter (approving user)
   - Accept optional approval_notes parameter
   - Return updated entry instance

3. **Add method docstring**
   - Explain approval process
   - Document parameters and return value
   - List required permissions
   - Note segregation of duties rules
   - Provide usage examples

4. **Implement entry retrieval and validation**
   - Get entry by ID if needed
   - Validate entry exists
   - Check tenant association
   - Raise appropriate exceptions if not found

5. **Add approval eligibility checks**
   - Verify entry status is PENDING_APPROVAL
   - Check entry still balanced
   - Validate entry not modified since submission
   - Ensure accounting period still open

6. **Add approver validation**
   - Check approver has approval permission
   - Verify approver not the entry creator (segregation of duties)
   - Validate approver not already approved this entry
   - Check approver belongs to same tenant

7. **Add business rule validations**
   - Ensure entry date in valid period
   - Check all accounts still active
   - Verify no blocking issues
   - Validate entry integrity maintained

8. **Implement approval action**
   - Set entry status to APPROVED
   - Set approved_by field to approver
   - Set approved_at timestamp to current time
   - Store approval_notes if provided
   - Mark entry ready for posting

9. **Add approval history logging**
   - Create approval history entry
   - Record approver information
   - Store approval timestamp
   - Save approval notes
   - Track status transition

10. **Implement post-approval actions**
    - Check if entry can auto-post (based on settings)
    - Update related records if applicable
    - Trigger accounting period validations
    - Prepare entry for posting workflow

11. **Add notification triggers**
    - Call _notify_entry_approved method
    - Send email to entry creator
    - Notify accounting team if configured
    - Update dashboard notifications

12. **Add transaction wrapping**
    - Wrap approval in database transaction
    - Ensure atomic status update
    - Rollback on any failure
    - Handle concurrent approval attempts

13. **Add audit logging**
    - Log approval action
    - Record approver details
    - Store approval timestamp
    - Track for compliance reporting

14. **Add error handling**
    - Catch validation errors
    - Provide clear error messages
    - Log approval failures
    - Return meaningful error responses

### Approve Entry Method Flow

```
approve_entry(entry, approver, approval_notes) Execution Flow
═════════════════════════════════════════════════════════════

START
  │
  ├─► Step 1: Retrieve Entry
  │     │
  │     ├─► Get entry by ID/instance
  │     ├─► Check: Entry exists? → No: Raise EntryNotFound
  │     ├─► Check: Tenant match? → No: Raise PermissionDenied
  │     └─► Continue
  │
  ├─► Step 2: Validate Entry Status
  │     │
  │     ├─► Check: Status = PENDING_APPROVAL?
  │     │     └─► No: Raise InvalidStatus
  │     │           Message: "Only pending entries can be approved"
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Entry not already approved?
  │           └─► No: Raise AlreadyApproved
  │           └─► Yes: Continue
  │
  ├─► Step 3: Validate Approver Permissions
  │     │
  │     ├─► Check: Has 'approve_journalentry' permission?
  │     │     └─► No: Raise PermissionDenied
  │     │     └─► Yes: Continue
  │     │
  │     ├─► Check: Approver ≠ Entry Creator?
  │     │     └─► No: Raise SegregationViolation
  │     │           Message: "Cannot approve own entries"
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Approver in same tenant?
  │           └─► No: Raise PermissionDenied
  │           └─► Yes: Continue
  │
  ├─► Step 4: Validate Entry Integrity
  │     │
  │     ├─► Check: Entry still balanced?
  │     │     └─► No: Raise UnbalancedEntry
  │     │
  │     ├─► Check: All accounts still active?
  │     │     └─► No: Raise InactiveAccountError
  │     │
  │     ├─► Check: Entry date period open?
  │     │     └─► No: Raise PeriodClosedError
  │     │
  │     └─► Check: No integrity violations?
  │           └─► No: Raise IntegrityError
  │           └─► Yes: Continue
  │
  ├─► Step 5: Perform Approval
  │     │
  │     ├─► Set status = APPROVED
  │     ├─► Set approved_by = approver
  │     ├─► Set approved_at = now()
  │     ├─► Store approval_notes
  │     └─► Mark ready_to_post = True
  │
  ├─► Step 6: Create Approval History
  │     │
  │     ├─► Create ApprovalHistory record
  │     ├─► Record: entry, approver, action="APPROVED"
  │     ├─► Store: notes, timestamp
  │     └─► Track: PENDING_APPROVAL → APPROVED
  │
  ├─► Step 7: Check Auto-Post Setting
  │     │
  │     ├─── Tenant setting: auto_post_on_approval = True?
  │     │     │
  │     │     └─► YES: Auto-Post Entry
  │     │           │
  │     │           ├─► Call post_entry method
  │     │           ├─► Update GL balances
  │     │           ├─► Set status = POSTED
  │     │           └─► Log: "Auto-posted after approval"
  │     │
  │     └─► NO: Leave in APPROVED state
  │           └─► Entry ready for manual posting
  │
  ├─► Step 8: Send Notifications
  │     │
  │     ├─► Email to entry creator
  │     │     Subject: "Entry JE-XXXX Approved"
  │     │     Message: Approval details, next steps
  │     │
  │     ├─► Optional: Notify accounting team
  │     │     If configured in settings
  │     │
  │     └─► Update dashboard
  │           Remove from pending count
  │           Add to approved list
  │
  ├─► Step 9: Save Entry (Transactional)
  │     │
  │     ├─► BEGIN TRANSACTION
  │     ├─► Save entry with APPROVED status
  │     ├─► Save approval history
  │     ├─► Update related records
  │     ├─► COMMIT
  │     └─► On error: ROLLBACK
  │
  └─► Step 10: Return Updated Entry
        │
        └─► Return entry with approval details

END
```

### Segregation of Duties Enforcement

```
Segregation of Duties Rules
═══════════════════════════

Principle: Same person cannot both create and approve entry
Purpose: Prevent fraud, ensure independent review

Rule 1: Creator Cannot Approve Own Entry
────────────────────────────────────────

Entry created by: user_a@example.com
Approval attempt by: user_a@example.com
Result: ❌ REJECTED
Error: SegregationOfDutiesViolation
Message: "You cannot approve entries you created"

Rule 2: Different User Must Approve
───────────────────────────────────

Entry created by: user_a@example.com
Approval attempt by: manager_b@example.com
Result: ✓ ALLOWED (assuming manager has permission)

Rule 3: System Auto-Approval Exempt
───────────────────────────────────

Entry created by: user_a@example.com
Auto-approved by: SYSTEM (threshold logic)
Result: ✓ ALLOWED (automatic process exempt)

Rule 4: Override for Sole Proprietor
────────────────────────────────────

Entry created by: owner@example.com (only user in tenant)
Setting: allow_sole_user_approval = True
Result: ✓ ALLOWED (special case for single-user tenants)
```

### Approval Scenarios

#### Scenario 1: Standard Approval Success
```
Entry Details:
─────────────
Entry ID: JE-2026-052
Status: PENDING_APPROVAL
Created By: staff@example.com
Amount: LKR 45,000.00
Submitted: 2026-01-20 10:00:00

Approval Request:
────────────────
Approver: manager@example.com
Permission: approve_journalentry = TRUE
Segregation Check: PASS (different user)
Approval Notes: "Verified supporting documents"

Processing:
──────────
✓ Entry exists
✓ Status = PENDING_APPROVAL
✓ Approver has permission
✓ Approver ≠ Creator
✓ Entry still balanced
✓ Period still open
✓ All accounts active

Approval Action:
───────────────
Status: PENDING_APPROVAL → APPROVED
Approved By: manager@example.com
Approved At: 2026-01-20 14:30:15
Approval Notes: "Verified supporting documents"
Ready to Post: YES

Notifications:
─────────────
Email to: staff@example.com
Subject: "Entry JE-2026-052 Approved"
Message: "Your entry has been approved by manager@example.com 
         and is ready to post."

Result: ✓ SUCCESS
```

#### Scenario 2: Segregation of Duties Violation
```
Entry Details:
─────────────
Entry ID: JE-2026-053
Status: PENDING_APPROVAL
Created By: staff@example.com
Amount: LKR 15,000.00

Approval Attempt:
────────────────
Approver: staff@example.com (same as creator!)
Permission: approve_journalentry = TRUE

Processing:
──────────
✓ Entry exists
✓ Status = PENDING_APPROVAL
✓ Approver has permission
❌ Approver = Creator (VIOLATION)

Result:
──────
Status: PENDING_APPROVAL (unchanged)
Error: SegregationOfDutiesViolation
Message: "You cannot approve entries you created. 
         Please request approval from another authorized user."

Notification:
────────────
(None sent - approval denied)

Result: ❌ FAILED
```

#### Scenario 3: Period Closed During Approval
```
Entry Details:
─────────────
Entry ID: JE-2025-125
Status: PENDING_APPROVAL
Created By: staff@example.com
Date: 2025-12-31 (December 2025)
Submitted: 2025-12-31 23:00:00

Approval Attempt:
────────────────
Approver: manager@example.com
Time: 2026-01-05 10:00:00
Note: December period closed on Jan 1

Processing:
──────────
✓ Entry exists
✓ Status = PENDING_APPROVAL
✓ Approver has permission
✓ Approver ≠ Creator
✓ Entry balanced
❌ Period CLOSED (Dec 2025 now closed)

Result:
──────
Status: PENDING_APPROVAL (unchanged)
Error: PeriodClosedError
Message: "Cannot approve entry dated in closed period 2025-12. 
         Contact administrator to reopen period if needed."

Result: ❌ FAILED
```

#### Scenario 4: Approval with Auto-Post
```
Entry Details:
─────────────
Entry ID: JE-2026-054
Status: PENDING_APPROVAL
Created By: staff@example.com
Amount: LKR 25,000.00

Tenant Setting:
──────────────
auto_post_on_approval = TRUE

Approval Request:
────────────────
Approver: manager@example.com
Approval Notes: "Approved for immediate posting"

Processing:
──────────
✓ All validations pass
✓ Approval action completed
✓ Auto-post setting enabled

Approval + Posting:
───────────────────
Step 1: Status → APPROVED
        Approved By: manager@example.com
        Approved At: 2026-01-20 15:00:00

Step 2: Auto-Post Triggered
        Status: APPROVED → POSTED
        Posted At: 2026-01-20 15:00:01
        GL balances updated

Final Status:
────────────
Status: POSTED (skipped APPROVED state)
Approved By: manager@example.com
Posted By: SYSTEM (Auto)
Ready to Post: N/A (already posted)

Notification:
────────────
Email to: staff@example.com
Subject: "Entry JE-2026-054 Approved and Posted"
Message: "Your entry has been approved and automatically posted."

Result: ✓ SUCCESS (approved + posted)
```

### Approval Permission Matrix

| User Role | Has Permission | Can Approve | Notes |
|-----------|----------------|-------------|-------|
| Staff/Clerk | No | ❌ No | Can create, cannot approve |
| Senior Accountant | Yes | ✓ Yes | Can approve others' entries |
| Accounting Manager | Yes | ✓ Yes | Can approve all entries |
| CFO/Controller | Yes | ✓ Yes | Full approval authority |
| Entry Creator | Yes (if has perm) | ❌ No | Cannot approve own entries |
| System Admin | Yes | ✓ Yes | Administrative approval rights |

### Concurrent Approval Handling

```
Scenario: Two managers try to approve same entry simultaneously
══════════════════════════════════════════════════════════════

Entry: JE-2026-055 (PENDING_APPROVAL)
Manager A: Attempts approval at 10:00:00.000
Manager B: Attempts approval at 10:00:00.050

Transaction Handling:
────────────────────

Approval A:
  ├─ BEGIN TRANSACTION
  ├─ SELECT entry FOR UPDATE (locks)
  ├─ Status check: PENDING_APPROVAL → OK
  ├─ Perform validations
  ├─ Update: PENDING_APPROVAL → APPROVED
  ├─ Set approved_by = Manager A
  ├─ COMMIT
  └─ Release lock

Approval B (waiting):
  ├─ BEGIN TRANSACTION
  ├─ SELECT entry FOR UPDATE (waiting for lock...)
  ├─ Lock released
  ├─ Read entry (status now APPROVED)
  ├─ Status check: APPROVED → FAIL
  ├─ ROLLBACK
  └─ Raise AlreadyApprovedError

Result:
──────
Manager A: SUCCESS (entry approved)
Manager B: ERROR (entry already approved)
         Message: "Entry already approved by Manager A"
```

### Expected Outcome
- Functional approve_entry method
- Comprehensive approver validation
- Enforced segregation of duties
- Entry integrity checks
- Status transition to APPROVED
- Approval history tracking
- Optional auto-posting capability
- Notification system integration
- Transaction safety and concurrency handling

### Verification Checklist
- [ ] approve_entry method defined
- [ ] Method signature includes entry, approver, notes
- [ ] Entry retrieval and validation implemented
- [ ] Status validation (PENDING_APPROVAL check)
- [ ] Approver permission validation added
- [ ] Segregation of duties enforcement implemented
- [ ] Entry integrity checks included
- [ ] Approval action (status update) implemented
- [ ] approved_by and approved_at fields set
- [ ] Approval history logging added
- [ ] Auto-post logic implemented (if enabled)
- [ ] Notification triggers included
- [ ] Transaction wrapping added
- [ ] Concurrent approval handling implemented
- [ ] Error handling comprehensive
- [ ] Docstring complete with examples

---

## Task 74: Add Reject Entry Method

### Overview
Implement the reject_entry method that allows authorized users to reject journal entries pending approval. This method validates rejector permissions, requires a rejection reason, returns entry to draft status for correction, and notifies the entry creator of the rejection with actionable feedback.

### Dependencies
- Task 73: Add Approve Entry Method

### Instructions

1. **Open approval_service.py file**
   - Continue in `apps/accounting/services/approval_service.py`
   - Locate ApprovalService class

2. **Define reject_entry method signature**
   - Accept entry parameter (JournalEntry instance or ID)
   - Accept rejector parameter (rejecting user)
   - Accept **required** rejection_reason parameter
   - Accept optional return_to_draft flag (default True)
   - Return updated entry instance

3. **Add method docstring**
   - Explain rejection process
   - Document parameters (emphasize reason is required)
   - Describe status transitions
   - List required permissions
   - Provide usage examples

4. **Implement entry retrieval and validation**
   - Get entry by ID if needed
   - Validate entry exists
   - Check tenant association
   - Raise appropriate exceptions

5. **Add rejection eligibility checks**
   - Verify entry status is PENDING_APPROVAL
   - Check entry not already processed
   - Validate entry not locked
   - Ensure rejector has appropriate access

6. **Add rejector validation**
   - Check rejector has approval permission
   - Verify rejector not the entry creator (segregation of duties)
   - Validate rejector belongs to same tenant
   - Check rejector has rejection rights

7. **Add rejection reason validation**
   - Ensure rejection_reason not empty
   - Validate minimum length (e.g., 10 characters)
   - Check reason is meaningful
   - Store reason for audit trail

8. **Implement rejection action**
   - Set entry status based on return_to_draft flag
   - Default: PENDING_APPROVAL → DRAFT (allow corrections)
   - Alternative: PENDING_APPROVAL → REJECTED (explicit reject state)
   - Set rejected_by field to rejector
   - Set rejected_at timestamp
   - Store rejection_reason

9. **Add rejection history logging**
   - Create rejection history entry
   - Record rejector information
   - Store rejection reason (full text)
   - Log rejection timestamp
   - Track status transition

10. **Add notification triggers**
    - Call _notify_entry_rejected method
    - Send detailed email to entry creator
    - Include rejection reason in notification
    - Provide guidance for next steps
    - Update dashboard notifications

11. **Add resubmission preparation**
    - If returning to DRAFT, clear submission metadata
    - Reset submitted_for_approval_at to null
    - Clear submitted_by reference
    - Mark entry as editable
    - Preserve rejection history for reference

12. **Add rejection analytics tracking**
    - Increment rejection counter
    - Track rejection reasons (for reporting)
    - Log rejector statistics
    - Update approval metrics

13. **Add transaction wrapping**
    - Wrap rejection in database transaction
    - Ensure atomic status update
    - Rollback on any failure
    - Handle concurrent rejection/approval attempts

14. **Add error handling**
    - Catch validation errors
    - Provide clear error messages
    - Log rejection failures
    - Return meaningful error responses

### Reject Entry Method Flow

```
reject_entry(entry, rejector, rejection_reason, return_to_draft=True) Flow
══════════════════════════════════════════════════════════════════════════

START
  │
  ├─► Step 1: Validate Rejection Reason
  │     │
  │     ├─► Check: Reason provided (not None/empty)?
  │     │     └─► No: Raise ValidationError
  │     │           Message: "Rejection reason is required"
  │     │     └─► Yes: Continue
  │     │
  │     ├─► Check: Reason minimum length (≥10 chars)?
  │     │     └─► No: Raise ValidationError
  │     │           Message: "Reason too short, please be specific"
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Reason not generic ("rejected", "no", etc.)?
  │           └─► Warning if too generic
  │           └─► Continue
  │
  ├─► Step 2: Retrieve Entry
  │     │
  │     ├─► Get entry by ID/instance
  │     ├─► Check: Entry exists? → No: Raise EntryNotFound
  │     ├─► Check: Tenant match? → No: Raise PermissionDenied
  │     └─► Continue
  │
  ├─► Step 3: Validate Entry Status
  │     │
  │     ├─► Check: Status = PENDING_APPROVAL?
  │     │     └─► No: Raise InvalidStatus
  │     │           Message: "Only pending entries can be rejected"
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Entry not already rejected?
  │           └─► No: Raise AlreadyRejected
  │           └─► Yes: Continue
  │
  ├─► Step 4: Validate Rejector Permissions
  │     │
  │     ├─► Check: Has 'approve_journalentry' permission?
  │     │     └─► No: Raise PermissionDenied
  │     │           Message: "You do not have reject permission"
  │     │     └─► Yes: Continue
  │     │
  │     ├─► Check: Rejector ≠ Entry Creator?
  │     │     └─► No: Raise SegregationViolation
  │     │           Message: "Cannot reject own entries"
  │     │     └─► Yes: Continue
  │     │
  │     └─► Check: Rejector in same tenant?
  │           └─► No: Raise PermissionDenied
  │           └─► Yes: Continue
  │
  ├─► Step 5: Perform Rejection
  │     │
  │     ├─── return_to_draft = True?
  │     │     │
  │     │     └─► YES: Return to DRAFT for editing
  │     │           │
  │     │           ├─► Set status = DRAFT
  │     │           ├─► Clear submitted_for_approval_at
  │     │           ├─► Clear submitted_by
  │     │           ├─► Set rejected_by = rejector
  │     │           ├─► Set rejected_at = now()
  │     │           ├─► Store rejection_reason
  │     │           └─► Mark as editable
  │     │
  │     └─► NO: Set explicit REJECTED status
  │           │
  │           ├─► Set status = REJECTED
  │           ├─► Set rejected_by = rejector
  │           ├─► Set rejected_at = now()
  │           ├─► Store rejection_reason
  │           └─► Require manual status change
  │
  ├─► Step 6: Create Rejection History
  │     │
  │     ├─► Create ApprovalHistory record
  │     ├─► Record: entry, rejector, action="REJECTED"
  │     ├─► Store: full rejection_reason
  │     ├─► Log: timestamp, status transition
  │     └─► Track: PENDING_APPROVAL → DRAFT/REJECTED
  │
  ├─► Step 7: Update Rejection Analytics
  │     │
  │     ├─► Increment entry rejection_count field
  │     ├─► Track rejection reason (for analysis)
  │     ├─► Update tenant statistics
  │     └─► Log for reporting
  │
  ├─► Step 8: Send Notifications
  │     │
  │     ├─► Email to entry creator
  │     │     Subject: "Entry JE-XXXX Rejected - Action Required"
  │     │     Body: Rejection reason, next steps, resubmission guidance
  │     │
  │     └─► Update dashboard
  │           Remove from pending approvals
  │           Add rejection notification
  │           Badge: "Entry rejected - review required"
  │
  ├─► Step 9: Save Entry (Transactional)
  │     │
  │     ├─► BEGIN TRANSACTION
  │     ├─► Save entry with new status
  │     ├─► Save rejection history
  │     ├─► Update analytics
  │     ├─► COMMIT
  │     └─► On error: ROLLBACK
  │
  └─► Step 10: Return Updated Entry
        │
        └─► Return entry with rejection details

END
```

### Rejection Reason Validation

```
Rejection Reason Quality Checks
═══════════════════════════════

Level 1: Required Check
──────────────────────
✓ Reason not None
✓ Reason not empty string
✓ Reason not whitespace only
❌ Reason = null → ERROR: "Rejection reason required"

Level 2: Minimum Length Check
─────────────────────────────
✓ Length ≥ 10 characters
❌ "Too short" (9 chars) → ERROR: "Provide detailed reason"
✓ "Missing invoice reference number" (35 chars) → OK

Level 3: Generic Reason Check (Warning)
───────────────────────────────────────
❌ "rejected" → WARNING: "Please provide specific reason"
❌ "no" → WARNING: "Reason too vague"
❌ "wrong" → WARNING: "Please explain what is wrong"
✓ "Account code incorrect - should be 5010 not 5020" → OK

Acceptable Reasons (Examples):
─────────────────────────────
✓ "Missing supporting invoice documentation"
✓ "Incorrect account classification - expense coded as asset"
✓ "Entry date should be in January, not February"
✓ "Amount does not match source document (Invoice #12345)"
✓ "Requires manager authorization for amounts over threshold"
✓ "Vendor account suspended - cannot process payment entry"
✓ "GL account closed - use new account 4520 instead"
```

### Rejection Scenarios

#### Scenario 1: Standard Rejection (Return to Draft)
```
Entry Details:
─────────────
Entry ID: JE-2026-056
Status: PENDING_APPROVAL
Created By: staff@example.com
Amount: LKR 35,000.00
Submitted: 2026-01-20 10:00:00

Rejection Request:
─────────────────
Rejector: manager@example.com
Rejection Reason: "Missing invoice attachment. Please upload 
                   supporting documentation before resubmitting."
return_to_draft: True (default)

Processing:
──────────
✓ Reason provided (78 characters)
✓ Entry exists
✓ Status = PENDING_APPROVAL
✓ Rejector has permission
✓ Rejector ≠ Creator

Rejection Action:
────────────────
Status: PENDING_APPROVAL → DRAFT
Rejected By: manager@example.com
Rejected At: 2026-01-20 14:45:00
Rejection Reason: Stored (full text)
Rejection Count: 1
submitted_for_approval_at: Cleared (NULL)
submitted_by: Cleared (NULL)
Editable: YES

Approval History:
────────────────
2026-01-20 10:00:00 │ DRAFT → PENDING_APPROVAL
                    │ Submitted by: staff@example.com

2026-01-20 14:45:00 │ PENDING_APPROVAL → DRAFT
                    │ Rejected by: manager@example.com
                    │ Reason: "Missing invoice attachment..."

Notification:
────────────
Email to: staff@example.com
Subject: "Entry JE-2026-056 Rejected - Action Required"
Body:
    Your journal entry has been rejected by manager@example.com
    
    Rejection Reason:
    Missing invoice attachment. Please upload supporting 
    documentation before resubmitting.
    
    Next Steps:
    1. Review the rejection reason above
    2. Make necessary corrections to your entry
    3. Attach required documentation
    4. Resubmit for approval when ready
    
    The entry has been returned to DRAFT status for editing.

Result: ✓ SUCCESS (returned to draft for correction)
```

#### Scenario 2: Rejection with Explicit REJECTED Status
```
Entry Details:
─────────────
Entry ID: JE-2026-057
Status: PENDING_APPROVAL
Created By: staff@example.com
Amount: LKR 150,000.00 (large amount)

Rejection Request:
─────────────────
Rejector: cfo@example.com
Rejection Reason: "Entry violates company policy - capital 
                   expenditures over 100K require board approval. 
                   Initiate separate approval workflow."
return_to_draft: False (explicit rejection)

Processing:
──────────
✓ Reason provided (detailed)
✓ All validations pass

Rejection Action:
────────────────
Status: PENDING_APPROVAL → REJECTED
Rejected By: cfo@example.com
Rejected At: 2026-01-20 15:30:00
Rejection Reason: Stored
Rejection Count: 1
Editable: NO (requires manual intervention)

Notification:
────────────
Email to: staff@example.com
Subject: "Entry JE-2026-057 Rejected - Policy Violation"
Body:
    Your journal entry has been REJECTED by cfo@example.com
    
    Rejection Reason:
    Entry violates company policy - capital expenditures over 100K 
    require board approval. Initiate separate approval workflow.
    
    Action Required:
    This entry cannot be simply resubmitted. Please follow the 
    capital expenditure approval process and obtain board approval 
    before processing this transaction.
    
    Contact the CFO office for guidance.

Result: ✓ SUCCESS (explicitly rejected, requires intervention)
```

#### Scenario 3: Rejection with Insufficient Reason
```
Entry Details:
─────────────
Entry ID: JE-2026-058
Status: PENDING_APPROVAL

Rejection Attempt:
─────────────────
Rejector: manager@example.com
Rejection Reason: "wrong"

Validation:
──────────
❌ Reason check: "wrong" (5 characters < 10 minimum)

Result:
──────
Status: PENDING_APPROVAL (unchanged)
Error: ValidationError
Message: "Rejection reason must be at least 10 characters. 
         Please provide a detailed explanation of why the 
         entry is being rejected."

Suggested Fix:
─────────────
"Wrong account used - should be Expense (5010) not Asset (1520)"

Result: ❌ FAILED (insufficient reason)
```

#### Scenario 4: Multiple Rejection Cycle
```
Entry Timeline:
══════════════

2026-01-20 09:00 │ Entry created (DRAFT)
                 │ Creator: staff@example.com

2026-01-20 10:00 │ Submitted for approval (PENDING_APPROVAL)
                 │ Submitted by: staff@example.com

2026-01-20 14:00 │ First Rejection (→ DRAFT)
                 │ Rejected by: manager@example.com
                 │ Reason: "Missing invoice #12345"
                 │ Rejection Count: 1

2026-01-21 09:00 │ Corrected and resubmitted (→ PENDING_APPROVAL)
                 │ Submitted by: staff@example.com
                 │ Note: "Invoice #12345 attached"

2026-01-21 15:00 │ Second Rejection (→ DRAFT)
                 │ Rejected by: manager@example.com
                 │ Reason: "Invoice shows different amount (32K not 35K)"
                 │ Rejection Count: 2

2026-01-22 10:00 │ Corrected amount and resubmitted (→ PENDING_APPROVAL)
                 │ Submitted by: staff@example.com
                 │ Amount: Changed to 32,000
                 │ Note: "Amount corrected per invoice"

2026-01-22 14:00 │ Approved (→ APPROVED)
                 │ Approved by: manager@example.com
                 │ Note: "Verified, amount matches invoice"

Final Stats:
───────────
Total Submissions: 3
Rejections: 2
Final Status: APPROVED
Time to Approval: 3 days (including corrections)
```

### Rejection vs Approval Decision Guide

```
When to Reject vs Request Changes
═════════════════════════════════

REJECT (return to draft):
─────────────────────────
✓ Missing required supporting documents
✓ Incorrect account codes
✓ Wrong amounts/calculations
✓ Entry date incorrect
✓ Missing required approvals/references
✓ Description unclear or inadequate
✓ Line items need adjustment

REJECT (explicit rejection):
───────────────────────────
✓ Violates company policy
✓ Fraudulent or suspicious
✓ Duplicate entry
✓ Exceeds authorization limits
✓ Requires different approval process
✓ Entry should not be processed at all

APPROVE with notes:
──────────────────
✓ Minor concerns documented
✓ Entry technically correct
✓ All requirements met
✓ Supporting docs adequate
✓ Amounts verified
```

### Rejection Reason Categories (For Analytics)

| Category | Examples | Action | Frequency |
|----------|----------|--------|-----------|
| Documentation | Missing invoice, No receipt | Attach docs | High |
| Account Code | Wrong GL account | Correct code | High |
| Amount Error | Calculation error | Fix amount | Medium |
| Date Issue | Wrong period | Adjust date | Medium |
| Policy Violation | Unauthorized | Escalate | Low |
| Duplicate | Already entered | Cancel entry | Low |
| Unclear Description | Vague details | Add details | Medium |

### Concurrent Rejection/Approval Handling

```
Scenario: Manager approves while CFO rejects (simultaneous)
═══════════════════════════════════════════════════════════

Entry: JE-2026-059 (PENDING_APPROVAL)
Time: 15:00:00.000

Manager Action (15:00:00.000):
  ├─ BEGIN TRANSACTION
  ├─ SELECT entry FOR UPDATE
  ├─ Status: PENDING_APPROVAL → APPROVED
  ├─ COMMIT (15:00:00.150)
  └─ Release lock

CFO Action (15:00:00.050):
  ├─ BEGIN TRANSACTION
  ├─ SELECT entry FOR UPDATE (waiting...)
  ├─ Lock released (15:00:00.150)
  ├─ Read entry (status = APPROVED)
  ├─ Status check: APPROVED ≠ PENDING_APPROVAL
  ├─ ROLLBACK
  └─ Raise InvalidStatusError

Result:
──────
Manager: SUCCESS (entry approved)
CFO: ERROR (entry already processed)
     Message: "Entry already approved by Manager. Cannot reject."
```

### Expected Outcome
- Functional reject_entry method
- Required rejection reason with validation
- Status transition to DRAFT or REJECTED
- Segregation of duties enforcement
- Detailed rejection history
- Comprehensive notification to creator
- Resubmission preparation (if return to draft)
- Rejection analytics tracking
- Transaction safety and concurrency handling

### Verification Checklist
- [ ] reject_entry method defined
- [ ] Method signature includes entry, rejector, rejection_reason (required)
- [ ] return_to_draft flag implemented (default True)
- [ ] Rejection reason validation implemented (required, min length)
- [ ] Entry retrieval and validation added
- [ ] Status validation (PENDING_APPROVAL check)
- [ ] Rejector permission validation implemented
- [ ] Segregation of duties enforcement added
- [ ] Rejection action (status update) implemented
- [ ] rejected_by and rejected_at fields set
- [ ] Rejection history logging added
- [ ] Submission metadata clearing (if return to draft)
- [ ] Notification triggers implemented
- [ ] Rejection analytics tracking added
- [ ] Transaction wrapping included
- [ ] Concurrent operation handling implemented
- [ ] Error handling comprehensive
- [ ] Docstring complete with examples

---

## Summary

This document established a comprehensive approval workflow system for journal entries:

### Completed Infrastructure
- ✅ ApprovalService class with validation framework
- ✅ Threshold-based automatic approval logic
- ✅ Manual approval workflow for large entries
- ✅ Request approval method with auto-approval integration
- ✅ Approve entry method with segregation of duties
- ✅ Reject entry method with required reason validation

### Key Achievements
1. **Service Architecture** - Centralized approval service with comprehensive validation
2. **Threshold Management** - Configurable thresholds for auto-approval efficiency
3. **Workflow Automation** - Automated approval for routine, low-value entries
4. **Permission Enforcement** - Segregation of duties prevents self-approval
5. **Audit Trail** - Complete approval history tracking for compliance
6. **Status Transitions** - Clear state machine for entry lifecycle management

### Approval Workflow Features
- Threshold-based auto-approval (configurable per tenant)
- Manual approval requirement for entries exceeding threshold
- Entry type-specific approval rules (adjusting, reversing entries)
- Segregation of duties enforcement (creator cannot approve)
- Comprehensive validation (balance, accounts, periods, permissions)
- Approval history tracking with timestamps and notes
- Rejection workflow with required reason and resubmission path
- Notification system integration for all workflow events
- Transaction safety and concurrent operation handling
- Analytics and reporting capabilities

### Next Steps
Proceed to [03_Tasks-75-80_Adjusting-Reversing-Services.md](03_Tasks-75-80_Adjusting-Reversing-Services.md) to implement specialized services for adjusting entries (accruals, deferrals) and automatic reversing entries for period-end processing.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~950
