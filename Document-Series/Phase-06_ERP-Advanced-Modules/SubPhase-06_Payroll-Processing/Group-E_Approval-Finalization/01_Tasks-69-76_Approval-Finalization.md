# Tasks 69-76: Approval Workflow and Finalization

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** E - Approval & Finalization  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-82_Reversal-History-Report.md](02_Tasks-77-82_Reversal-History-Report.md)

---

## Document Overview

This document covers the approval workflow for processed payroll, finalization procedures to lock payroll data, bank file generation for salary transfers, and payment status tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create PayrollApprovalService | High | 30 min |
| 70 | Implement Submit for Approval | Medium | 25 min |
| 71 | Implement Approve Payroll | Medium | 25 min |
| 72 | Implement Reject Payroll | Medium | 20 min |
| 73 | Create PayrollFinalizationService | High | 30 min |
| 74 | Implement Finalize Payroll | High | 30 min |
| 75 | Implement Generate Bank File | High | 35 min |
| 76 | Implement Mark as Paid | Medium | 20 min |

---

## Task 69: Create PayrollApprovalService

### Overview
Create service class to handle payroll approval workflow including submission, approval, and rejection with proper status transitions and permission checks.

### Dependencies
- PayrollRun model with status field
- User authentication system
- Permission framework configured

### Instructions

1. **Create approval service file**
   - Create `services/approval_service.py` file
   - Import required models and utilities

2. **Define PayrollApprovalService class**
   - Create service class
   - Add __init__ method if needed
   - Prepare for workflow methods

3. **Add status validation method**
   - Create _validate_status method
   - Check current status before transitions
   - Raise appropriate exceptions for invalid transitions

4. **Add permission check method**
   - Create _check_approval_permission method
   - Verify user has payroll approval permission
   - Check role or permission assignment

5. **Add notification method**
   - Create _send_notification method
   - Send email/system notification
   - Notify relevant users of status changes

6. **Define allowed status transitions**
   - PROCESSED → PENDING_APPROVAL (submit)
   - PENDING_APPROVAL → APPROVED (approve)
   - PENDING_APPROVAL → REJECTED (reject)
   - REJECTED → PROCESSED (reprocess)

7. **Add validation utilities**
   - Validate all employees processed successfully
   - Check no pending errors
   - Verify calculations complete

### Service Structure

```
PayrollApprovalService:
├── submit_for_approval(run_id, user)
├── approve(run_id, user, notes)
├── reject(run_id, user, reason)
├── get_pending_approvals()
├── get_approval_history(run_id)
└── _validate_status(current, target)
```

### Status Transition Rules

| From Status | To Status | Action | Permission Required |
|-------------|-----------|--------|---------------------|
| PROCESSED | PENDING_APPROVAL | Submit | HR User |
| PENDING_APPROVAL | APPROVED | Approve | Manager/Finance |
| PENDING_APPROVAL | REJECTED | Reject | Manager/Finance |
| REJECTED | PROCESSED | Reprocess | HR User |

### Expected Outcome
- PayrollApprovalService class created
- Status validation logic implemented
- Permission checking prepared
- Foundation for approval methods

### Verification Checklist
- [ ] approval_service.py file created
- [ ] PayrollApprovalService class defined
- [ ] _validate_status method added
- [ ] _check_approval_permission method added
- [ ] _send_notification method prepared
- [ ] Status transition rules defined
- [ ] Validation utilities ready

---

## Task 70: Implement Submit for Approval

### Overview
Implement method to submit processed payroll for management approval, validating readiness and updating status.

### Dependencies
- Task 69 completed (PayrollApprovalService exists)
- PayrollRun model accessible

### Instructions

1. **Add submit_for_approval method**
   - Accept run_id and submitted_by user parameters
   - Return updated PayrollRun instance

2. **Retrieve PayrollRun**
   - Get PayrollRun by ID
   - Raise exception if not found

3. **Validate current status**
   - Check status is PROCESSED
   - Raise exception if not processed
   - Only processed payrolls can be submitted

4. **Validate processing completeness**
   - Check all eligible employees processed
   - Verify error_count is 0 or acceptable
   - Ensure calculations complete

5. **Validate data integrity**
   - Check totals calculated
   - Verify EPF/ETF/PAYE records exist
   - Ensure no missing critical data

6. **Update PayrollRun status**
   - Set status to PENDING_APPROVAL
   - Set submitted_by user
   - Set submitted_at timestamp

7. **Create audit trail entry**
   - Log submission in PayrollHistory
   - Record who submitted and when
   - Store previous and new status

8. **Send notifications**
   - Notify approvers of pending approval
   - Include summary information
   - Provide approval link

9. **Return updated run**
   - Return PayrollRun instance
   - Include updated status

### Submission Validation Checklist

- [ ] Status is PROCESSED
- [ ] All employees processed
- [ ] Error count acceptable
- [ ] Totals calculated
- [ ] EPF/ETF/PAYE records exist
- [ ] No missing data

### Expected Outcome
- Payroll submitted for approval
- Status changed to PENDING_APPROVAL
- Approvers notified
- Audit trail created

### Verification Checklist
- [ ] submit_for_approval method added
- [ ] Accepts run_id and user parameters
- [ ] Retrieves PayrollRun
- [ ] Validates current status
- [ ] Validates completeness
- [ ] Updates status to PENDING_APPROVAL
- [ ] Sets submitted_by and timestamp
- [ ] Creates audit trail
- [ ] Sends notifications
- [ ] Returns updated run

---

## Task 71: Implement Approve Payroll

### Overview
Implement method for authorized users to approve submitted payroll, moving it to finalization stage.

### Dependencies
- Task 70 completed (submit method exists)

### Instructions

1. **Add approve method**
   - Accept run_id, approved_by user, optional notes
   - Return updated PayrollRun

2. **Check user permission**
   - Verify user has approval permission
   - Check role (Manager, Finance Manager, etc.)
   - Raise exception if unauthorized

3. **Retrieve and validate PayrollRun**
   - Get PayrollRun by ID
   - Check status is PENDING_APPROVAL
   - Raise exception if not pending

4. **Validate approval eligibility**
   - Ensure not self-approval (if rule exists)
   - Check approval hierarchy
   - Verify within approval period

5. **Update PayrollRun status**
   - Set status to APPROVED
   - Set approved_by user
   - Set approved_at timestamp
   - Store approval notes

6. **Create audit trail entry**
   - Log approval in PayrollHistory
   - Record approver and timestamp
   - Store approval notes

7. **Send notifications**
   - Notify HR team of approval
   - Notify submitter
   - Include next steps (finalization)

8. **Enable finalization**
   - Mark run as ready for finalization
   - Trigger any post-approval actions

### Approval Rules

- User must have 'approve_payroll' permission
- Payroll must be in PENDING_APPROVAL status
- Self-approval may be restricted per policy
- Approval notes recommended but optional

### Expected Outcome
- Payroll approved
- Status changed to APPROVED
- Approver recorded
- Notifications sent
- Ready for finalization

### Verification Checklist
- [ ] approve method added
- [ ] Accepts run_id, user, notes
- [ ] Checks user permission
- [ ] Retrieves PayrollRun
- [ ] Validates status is PENDING_APPROVAL
- [ ] Updates status to APPROVED
- [ ] Sets approved_by and timestamp
- [ ] Stores approval notes
- [ ] Creates audit trail
- [ ] Sends notifications
- [ ] Returns updated run

---

## Task 72: Implement Reject Payroll

### Overview
Implement method to reject payroll with reason, allowing corrections and resubmission.

### Dependencies
- Task 70 completed (submit method)

### Instructions

1. **Add reject method**
   - Accept run_id, rejected_by user, reason (required)
   - Return updated PayrollRun

2. **Check user permission**
   - Verify user has approval permission
   - Same permission as approve
   - Raise exception if unauthorized

3. **Retrieve and validate PayrollRun**
   - Get PayrollRun by ID
   - Check status is PENDING_APPROVAL
   - Raise exception if not pending

4. **Require rejection reason**
   - Ensure reason parameter provided
   - Validate reason not empty
   - Store detailed rejection reason

5. **Update PayrollRun status**
   - Set status to REJECTED
   - Set rejected_by user
   - Set rejected_at timestamp
   - Store rejection_reason

6. **Create audit trail entry**
   - Log rejection in PayrollHistory
   - Record who rejected and when
   - Store rejection reason

7. **Send notifications**
   - Notify HR team of rejection
   - Notify submitter with reason
   - Include guidance for corrections

8. **Enable corrections**
   - Allow reprocessing of payroll
   - Maintain original data for reference
   - Enable status change back to PROCESSED

### Rejection Handling

- Rejection reason is mandatory
- Payroll returns to HR for corrections
- Original data preserved
- Can be reprocessed and resubmitted
- Audit trail maintained

### Expected Outcome
- Payroll rejected with reason
- Status changed to REJECTED
- HR notified for corrections
- Audit trail created
- Reprocessing enabled

### Verification Checklist
- [ ] reject method added
- [ ] Accepts run_id, user, reason (required)
- [ ] Checks user permission
- [ ] Retrieves PayrollRun
- [ ] Validates status is PENDING_APPROVAL
- [ ] Requires rejection reason
- [ ] Updates status to REJECTED
- [ ] Sets rejected_by and timestamp
- [ ] Stores rejection reason
- [ ] Creates audit trail
- [ ] Sends notifications
- [ ] Returns updated run

---

## Task 73: Create PayrollFinalizationService

### Overview
Create service class to handle payroll finalization, locking data to prevent changes, and preparing for payment processing.

### Dependencies
- PayrollApprovalService exists
- Bank file generation requirements understood

### Instructions

1. **Create finalization service file**
   - Create `services/finalization_service.py` file
   - Import required models

2. **Define PayrollFinalizationService class**
   - Create service class
   - Prepare for finalization methods

3. **Add status validation method**
   - Create _validate_finalization_status method
   - Check payroll is APPROVED
   - Verify no pending issues

4. **Add locking mechanism**
   - Create _lock_payroll_period method
   - Prevent further modifications
   - Lock period and all employee payrolls

5. **Add bank file service integration**
   - Create _prepare_bank_file method
   - Interface with bank file generation
   - Support multiple bank formats

6. **Add payment tracking methods**
   - Prepare payment status updates
   - Track payment references
   - Record payment dates

### Service Structure

```
PayrollFinalizationService:
├── finalize(run_id, user)
├── generate_bank_file(run_id, bank_code)
├── mark_as_paid(run_id, payment_ref, date)
├── get_finalization_status(run_id)
└── _lock_payroll_period(period_id)
```

### Finalization Requirements

- Payroll must be APPROVED
- All calculations verified
- No pending corrections
- Ready to lock and pay

### Expected Outcome
- PayrollFinalizationService class created
- Finalization logic prepared
- Locking mechanism ready
- Bank file integration prepared

### Verification Checklist
- [ ] finalization_service.py created
- [ ] PayrollFinalizationService class defined
- [ ] _validate_finalization_status method added
- [ ] _lock_payroll_period method prepared
- [ ] _prepare_bank_file method prepared
- [ ] Payment tracking methods prepared

---

## Task 74: Implement Finalize Payroll

### Overview
Implement method to finalize approved payroll, locking all data to prevent modifications and preparing for payment.

### Dependencies
- Task 73 completed (PayrollFinalizationService exists)
- Task 71 completed (payroll can be approved)

### Instructions

1. **Add finalize method**
   - Accept run_id and finalized_by user
   - Return finalized PayrollRun

2. **Retrieve and validate PayrollRun**
   - Get PayrollRun by ID
   - Check status is APPROVED
   - Raise exception if not approved

3. **Lock PayrollPeriod**
   - Set PayrollPeriod.is_locked = True
   - Prevent new runs for period
   - Mark period as finalized

4. **Lock all EmployeePayroll records**
   - Set is_locked = True for all employee payrolls
   - Prevent modifications
   - Make data read-only

5. **Update PayrollRun status**
   - Set status to FINALIZED
   - Set finalized_by user
   - Set finalized_at timestamp

6. **Generate summary report**
   - Create payroll summary
   - Calculate final totals
   - Prepare for payment

7. **Create audit trail entry**
   - Log finalization in PayrollHistory
   - Record who finalized and when

8. **Send notifications**
   - Notify finance team
   - Notify HR team
   - Include bank file generation instructions

9. **Trigger post-finalization actions**
   - Prepare for bank file generation
   - Queue payment processing
   - Update accounting integration

### Finalization Effects

- All payroll data locked (immutable)
- Period locked (no new processing)
- Ready for payment
- Audit trail complete
- Reversals require special process

### Expected Outcome
- Payroll finalized and locked
- Status changed to FINALIZED
- All data immutable
- Ready for payment processing
- Audit trail created

### Verification Checklist
- [ ] finalize method added
- [ ] Accepts run_id and user
- [ ] Retrieves PayrollRun
- [ ] Validates status is APPROVED
- [ ] Locks PayrollPeriod
- [ ] Locks all EmployeePayroll records
- [ ] Updates status to FINALIZED
- [ ] Sets finalized_by and timestamp
- [ ] Generates summary report
- [ ] Creates audit trail
- [ ] Sends notifications
- [ ] Returns finalized run

---

## Task 75: Implement Generate Bank File

### Overview
Implement method to generate bank transfer file for salary payments in various bank-specific formats for Sri Lankan banks.

### Dependencies
- Task 74 completed (payroll can be finalized)
- Bank file format specifications available

### Instructions

1. **Add generate_bank_file method**
   - Accept run_id and bank_code parameters
   - Return file path or file content

2. **Validate PayrollRun**
   - Check status is FINALIZED
   - Ensure payroll is locked
   - Verify ready for payment

3. **Query employee bank details**
   - Get all EmployeePayroll for run
   - Join with Employee bank information
   - Filter employees with bank accounts
   - Exclude employees on hold

4. **Group by bank if needed**
   - Separate by bank_code if multiple banks
   - Handle different bank formats

5. **Get company bank details**
   - Retrieve company debit account
   - Get company bank code
   - Get authorization details

6. **Format based on bank code**
   - Support SLIPS (Sri Lanka Interbank Payment System)
   - Support BOC (Bank of Ceylon) format
   - Support Commercial Bank format
   - Support generic CSV format

7. **Build file content**
   - Create header record with company details
   - Add detail records for each employee
   - Calculate control totals
   - Add footer record with totals

8. **Validate file content**
   - Verify all required fields present
   - Check account number formats
   - Validate amount formats
   - Ensure total matches payroll total

9. **Generate file**
   - Create file with proper naming
   - Apply correct file extension
   - Save to secure location

10. **Record file generation**
    - Update PayrollRun with file details
    - Set bank_file_generated = True
    - Store file_path and generation_timestamp

11. **Return file information**
    - Return file path
    - Include file name and format
    - Provide download instructions

### Bank File Format: SLIPS

```
HEADER|COMPANY_CODE|COMPANY_NAME|PAY_DATE|TOTAL_AMOUNT|RECORD_COUNT
DETAIL|ACCOUNT_NO|BANK_CODE|BRANCH_CODE|AMOUNT|EMPLOYEE_NAME|REFERENCE
DETAIL|ACCOUNT_NO|BANK_CODE|BRANCH_CODE|AMOUNT|EMPLOYEE_NAME|REFERENCE
FOOTER|TOTAL_RECORDS|TOTAL_AMOUNT|CHECKSUM
```

### Bank File Format: BOC

```
PAYROLL FILE
Company: Lanka Commerce Pvt Ltd
Date: 25-JAN-2026
Debit Account: 0012345678

001|1234567890|John Doe|174800.00
002|9876543210|Jane Smith|156200.00
TOTAL|2|331000.00
```

### File Naming Convention

```
PayrollBankFile_{BankCode}_{YYYYMMDD}_{CompanyCode}.txt
Example: PayrollBankFile_BOC_20260125_LCPL.txt
```

### Expected Outcome
- Bank file generated in correct format
- All employees included
- File saved securely
- Ready for bank submission

### Verification Checklist
- [ ] generate_bank_file method added
- [ ] Accepts run_id and bank_code
- [ ] Validates PayrollRun is FINALIZED
- [ ] Queries employee bank details
- [ ] Gets company bank details
- [ ] Supports multiple bank formats
- [ ] Builds header record
- [ ] Adds detail records
- [ ] Calculates control totals
- [ ] Adds footer record
- [ ] Validates file content
- [ ] Generates file
- [ ] Records generation details
- [ ] Returns file path

---

## Task 76: Implement Mark as Paid

### Overview
Implement method to mark payroll as paid after successful bank transfer, updating payment status and recording payment reference.

### Dependencies
- Task 75 completed (bank file generated)

### Instructions

1. **Add mark_as_paid method**
   - Accept run_id, payment_reference, payment_date
   - Return updated PayrollRun

2. **Validate PayrollRun**
   - Check status is FINALIZED
   - Verify bank file generated
   - Ensure not already marked paid

3. **Update all EmployeePayroll records**
   - Set payment_status = PAID
   - Set payment_reference
   - Set payment_date
   - Update in batch

4. **Update PayrollRun**
   - Set payment_status = PAID
   - Store payment_reference (bank transaction ref)
   - Store payment_date (actual payment date)
   - Set paid_at timestamp

5. **Create audit trail entry**
   - Log payment in PayrollHistory
   - Record payment reference
   - Store payment date

6. **Trigger accounting integration**
   - Post to general ledger if integrated
   - Create journal entries
   - Update expense accounts

7. **Send notifications**
   - Notify finance team of completion
   - Notify HR team
   - Generate payment confirmation report

8. **Archive payroll data**
   - Mark period complete
   - Archive documents
   - Prepare for next period

### Payment Information

| Field | Description |
|-------|-------------|
| payment_reference | Bank transaction reference number |
| payment_date | Actual date funds transferred |
| payment_status | PAID status |
| paid_at | Timestamp of marking paid |

### Expected Outcome
- All employee payrolls marked paid
- Payment reference recorded
- Accounting integration triggered
- Payroll cycle complete

### Verification Checklist
- [ ] mark_as_paid method added
- [ ] Accepts run_id, payment_ref, date
- [ ] Validates PayrollRun is FINALIZED
- [ ] Validates bank file generated
- [ ] Updates all EmployeePayroll payment_status
- [ ] Sets payment_reference on all records
- [ ] Sets payment_date on all records
- [ ] Updates PayrollRun payment details
- [ ] Creates audit trail
- [ ] Triggers accounting integration
- [ ] Sends notifications
- [ ] Returns updated run

---

## Summary

This document covered payroll approval workflow and finalization:

**Approval Workflow (Tasks 69-72):**
- PayrollApprovalService for workflow management
- Submit for approval with validation
- Approve payroll with permission checks
- Reject payroll with mandatory reasons
- Status transitions and audit trails

**Finalization (Tasks 73-76):**
- PayrollFinalizationService for locking and payment
- Finalize payroll to lock all data
- Generate bank files in multiple formats
- Mark as paid with payment tracking
- Complete audit trail

**Key Outcomes:**
- Robust approval workflow with permissions
- Data locking to prevent modifications
- Multi-format bank file generation
- Payment status tracking
- Complete audit trail throughout
- Notifications at each stage

These implementations ensure proper authorization, data integrity, and payment processing for payroll operations.
