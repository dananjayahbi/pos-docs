# Group E: Approval & Finalization

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Implement approval workflow, finalization, and reversal

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: EPF/ETF/PAYE Processing](../Group-D_EPF-ETF-PAYE-Processing/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **PayrollApprovalService** - Service for approval workflow
2. **Submit for Approval** - Submit processed payroll for review
3. **Approve Payroll** - Manager/HR approval
4. **Reject Payroll** - Reject with reason
5. **PayrollFinalizationService** - Service for finalization
6. **Finalize Payroll** - Lock payroll, prevent edits
7. **Generate Bank File** - Create bank transfer file
8. **Mark as Paid** - Update payment status
9. **PayrollReversalService** - Service for corrections
10. **Reverse Payroll** - Reverse finalized payroll
11. **Correction Entry** - Create correction entries
12. **PayrollHistory Model** - Audit trail for changes
13. **PayrollHistory Migrations** - Apply migrations
14. **Payroll Summary Report** - Summary of payroll run

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Approval, finalization logic |
| Django Signals | Status change events |
| Bank File | Transfer file generation |
| Audit Trail | Change tracking |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-76_Approval-Finalization.md` | 69-76 | Approval service, finalization, bank file |
| 02 | `02_Tasks-77-82_Reversal-History-Report.md` | 77-82 | Reversal service, history model, summary |

---

## Task Summary

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
| 77 | Create PayrollReversalService | High | 30 min |
| 78 | Implement Reverse Payroll | High | 35 min |
| 79 | Implement Correction Entry | High | 30 min |
| 80 | Create PayrollHistory Model | Medium | 25 min |
| 81 | Run PayrollHistory Migrations | Low | 15 min |
| 82 | Create Payroll Summary Report | Medium | 25 min |

---

## Execution Order

```
[Tasks 69-76: Approval, finalization, bank file]
         │
         ▼
[Tasks 77-82: Reversal, history, summary]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   └── payroll_history.py        # Task 80
├── services/
│   ├── approval_service.py       # Tasks 69-72
│   ├── finalization_service.py   # Tasks 73-76
│   ├── reversal_service.py       # Tasks 77-79
│   └── bank_file_service.py      # Task 75
└── migrations/
    └── 0020_payroll_history.py   # Task 81
```

---

## Notes for AI Agents

### PayrollApprovalService Methods
- submit_for_approval(run_id, submitted_by)
- approve(run_id, approved_by, notes)
- reject(run_id, rejected_by, reason)
- get_pending_approvals()
- get_approval_history(run_id)

### Submit for Approval Flow
```
1. Validate run status is PROCESSED
2. Check all employees processed successfully
3. Verify no pending errors
4. Update status to PENDING_APPROVAL
5. Create PayrollHistory entry
6. Send notification to approvers
```

### Approve Payroll Flow
```
1. Validate user has approval permission
2. Validate run status is PENDING_APPROVAL
3. Update status to APPROVED
4. Set approved_by, approved_at
5. Create PayrollHistory entry
6. Send confirmation notification
```

### Reject Payroll Flow
```
1. Validate run status is PENDING_APPROVAL
2. Update status to REJECTED
3. Set rejection_reason
4. Create PayrollHistory entry
5. Send notification to HR
6. Allow reprocessing
```

### PayrollFinalizationService Methods
- finalize(run_id, finalized_by)
- generate_bank_file(run_id, bank_code)
- mark_as_paid(run_id, payment_ref, payment_date)
- get_bank_file_formats()

### Finalize Payroll Flow
```
1. Validate run status is APPROVED
2. Lock payroll period (is_locked = True)
3. Lock all employee payrolls
4. Update status to FINALIZED
5. Create PayrollHistory entry
6. Generate summary report
7. Send notification
```

### Bank File Generation
```
Bank file formats supported:
- SLIPS (Sri Lanka Interbank Payment System)
- BOC (Bank of Ceylon format)
- Commercial Bank format
- Generic CSV

File content:
- Header: Company, date, total amount
- Details: Account, name, amount
- Footer: Record count, hash
```

### Bank File Format (SLIPS)
```
HEADER|COMPANY_CODE|PAY_DATE|TOTAL_AMOUNT
DETAIL|ACCOUNT_NO|BANK_CODE|AMOUNT|NAME
DETAIL|ACCOUNT_NO|BANK_CODE|AMOUNT|NAME
FOOTER|RECORD_COUNT|HASH_TOTAL
```

### Mark as Paid Flow
```
1. Validate run is FINALIZED
2. Update all EmployeePayroll payment_status = PAID
3. Set payment_date, payment_reference
4. Create PayrollHistory entry
5. Trigger accounting integration (GL posting)
```

### PayrollReversalService Methods
- reverse(run_id, reversed_by, reason)
- create_correction_run(original_run_id, corrections)
- calculate_adjustment(original, corrected)

### Reverse Payroll Flow
```
1. Validate run is FINALIZED
2. Create PayrollHistory entry (REVERSED)
3. Update status to REVERSED
4. Mark all employee payrolls as REVERSED
5. Create negative adjustment entries (for GL)
6. Unlock period for correction
7. Allow new processing run
```

### Correction Entry
```json
{
  "original_run_id": "uuid",
  "correction_run_id": "uuid",
  "employee_id": "uuid",
  "adjustments": [
    {
      "component": "BASIC",
      "original": 150000,
      "corrected": 155000,
      "difference": 5000
    }
  ],
  "net_adjustment": 4500,
  "reason": "Salary update missed"
}
```

### PayrollHistory Model Fields
- payroll_run: FK to PayrollRun
- action: HistoryAction choice
- previous_status: PayrollStatus
- new_status: PayrollStatus
- performed_by: FK to User
- performed_at: DateTimeField
- reason: TextField
- details: JSONField
- ip_address: CharField

### HistoryAction Choices
| Action | Description |
|--------|-------------|
| CREATED | Run created |
| PROCESSED | Processing complete |
| SUBMITTED | Submitted for approval |
| APPROVED | Approved by manager |
| REJECTED | Rejected with reason |
| FINALIZED | Finalized and locked |
| REVERSED | Reversed for correction |
| CORRECTED | Correction applied |
| PAID | Payment marked complete |

### Payroll Summary Report
```
PAYROLL SUMMARY - January 2026
────────────────────────────────────────────────────
Company: Lanka Commerce Pvt Ltd
Period: 01-Jan-2026 to 31-Jan-2026
Pay Date: 25-Jan-2026
Status: FINALIZED

EMPLOYEE SUMMARY:
Total Employees: 50
Processed: 48
On Hold: 2

FINANCIAL SUMMARY:
                        Amount (LKR)
────────────────────────────────────────────────────
Total Basic Salary:       5,500,000
Total Allowances:           750,000
Total Overtime:             250,000
────────────────────────────────────────────────────
GROSS SALARY:             6,500,000

Total EPF (Employee):       520,000
Total PAYE Tax:             180,000
Total Other Deductions:      50,000
────────────────────────────────────────────────────
TOTAL DEDUCTIONS:           750,000

NET SALARY:               5,750,000

EMPLOYER CONTRIBUTIONS:
EPF Employer:               780,000
ETF:                        195,000
────────────────────────────────────────────────────
TOTAL EMPLOYER COST:      6,725,000
```
