# Tasks 71-76: Reconciliation Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** E - Reporting & History  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-70_Workflow-Action-Methods.md](01_Tasks-65-70_Workflow-Action-Methods.md)
- **→ Next Group:** [../Group-F_API-Testing-Documentation/](../Group-F_API-Testing-Documentation/)

---

## Document Overview

This document covers the reconciliation reporting system, including report generation services, section rendering for matched and unmatched items, adjustments display, summary totals calculation, and PDF export functionality. These components enable comprehensive reporting and documentation of reconciliation activities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create Reconciliation Report | High | 45 min |
| 72 | Add Matched Items Section | Medium | 30 min |
| 73 | Add Unmatched Items Section | Medium | 30 min |
| 74 | Add Adjustments Section | Medium | 25 min |
| 75 | Add Summary Totals | Medium | 25 min |
| 76 | Add PDF Export Method | High | 40 min |

---

## Task 71: Create Reconciliation Report

### Overview
Create the ReconciliationReport service class that generates comprehensive reports for completed reconciliations. This service orchestrates the report generation process, collecting data from various sources and formatting it into a structured report document.

### Dependencies
- AccountReconciliation model exists
- ReconciliationMatch model exists
- ReconciliationAdjustment model exists
- Statement and transaction models exist
- WeasyPrint library installed (for PDF generation)

### Instructions

1. **Create report service file**
   - Create file at `apps/accounting/reconciliation/services/report.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django utilities (timezone, decimal)
   - Import reconciliation models
   - Import HTML template rendering utilities
   - Import date formatting utilities

3. **Define ReconciliationReportService class**
   - Add class docstring explaining report generation purpose
   - Initialize with reconciliation instance

4. **Add __init__ method**
   - Accept reconciliation parameter
   - Store reconciliation instance
   - Validate reconciliation status (must be COMPLETED)
   - Raise exception if reconciliation incomplete

5. **Add generate_report method**
   - Main method to orchestrate report generation
   - Returns dictionary with complete report data
   - Collects all report sections

6. **Add _get_report_header method**
   - Extract basic reconciliation information
   - Include tenant details
   - Include account information
   - Include date range
   - Include completion timestamp

7. **Add _get_reconciliation_summary method**
   - Calculate key metrics
   - Count matched items
   - Count unmatched items
   - Count adjustments created
   - Calculate variance amounts

8. **Add _calculate_balance_progression method**
   - Show opening balance
   - Show statement ending balance
   - Show adjustments total
   - Show final reconciled balance
   - Highlight discrepancies

9. **Add _format_currency method**
   - Helper to format decimal amounts
   - Include currency symbol (Rs. for Sri Lanka)
   - Format with thousands separators
   - Handle negative amounts

10. **Add _format_date method**
    - Helper to format dates consistently
    - Use localized date format
    - Include time for timestamps
    - Handle null dates gracefully

11. **Add error handling**
    - Handle missing data gracefully
    - Validate all calculations
    - Log errors appropriately
    - Return error status in report

### Report Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│              Reconciliation Report Generation               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Validate Reconciliation     │
            │   Status = COMPLETED          │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Collect Report Header       │
            │   • Tenant info               │
            │   • Account details           │
            │   • Date range                │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Calculate Summary           │
            │   • Count matches             │
            │   • Count unmatched           │
            │   • Count adjustments         │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Calculate Balances          │
            │   • Opening balance           │
            │   • Statement balance         │
            │   • Adjustments               │
            │   • Final balance             │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Generate Report Data        │
            │   Returns: Dictionary         │
            └───────────────────────────────┘
```

### Report Header Structure

```
┌────────────────────────────────────────────────────────────┐
│                 RECONCILIATION REPORT                      │
├────────────────────────────────────────────────────────────┤
│ Tenant: LankaCommerce Pvt Ltd                              │
│ Account: Commercial Bank - Operating Account              │
│ Account Number: 1234567890                                │
│                                                            │
│ Statement Period: January 1, 2026 - January 31, 2026      │
│ Reconciliation Date: January 25, 2026 10:30 AM            │
│ Reconciled By: Chandima Silva                             │
│                                                            │
│ Report Generated: January 25, 2026 11:15 AM               │
└────────────────────────────────────────────────────────────┘
```

### Report Summary Metrics

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Total Matches | Count of matched items | Count of ReconciliationMatch records |
| Matched Amount | Sum of matched transactions | Sum of match amounts |
| Unmatched Book Items | Count of unmatched book entries | Statement items without matches |
| Unmatched Statement Items | Count of unmatched statement entries | Book items without matches |
| Adjustments Created | Count of adjustment entries | Count of ReconciliationAdjustment records |
| Adjustments Amount | Sum of all adjustments | Sum of adjustment amounts |
| Final Variance | Remaining discrepancy | Should be zero if fully reconciled |

### Balance Progression Calculation

```
Opening Balance (from previous period)
  +/- Matched Transactions (net)
  +/- Adjustments Made
─────────────────────────────────────
= Reconciled Closing Balance

Should Equal:
Statement Ending Balance
```

### Balance Progression Example

```
┌────────────────────────────────────────────────────────────┐
│                  BALANCE PROGRESSION                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Opening Balance (Jan 1, 2026)         Rs.  250,000.00     │
│                                                            │
│ Add: Deposits/Credits                 Rs.  450,000.00     │
│ Less: Withdrawals/Debits              Rs. (380,000.00)    │
│                                        ───────────────     │
│ Calculated Balance                     Rs.  320,000.00     │
│                                                            │
│ Statement Ending Balance (Jan 31)      Rs.  318,500.00     │
│                                        ───────────────     │
│ Variance                               Rs.   (1,500.00)    │
│                                                            │
│ Add: Bank Charges (Adjustment)         Rs.   (1,200.00)    │
│ Add: Interest Earned (Adjustment)      Rs.      300.00     │
│ Add: Deposit in Transit (Adjustment)   Rs.    1,400.00     │
│                                        ───────────────     │
│ Adjusted Balance                       Rs.  318,500.00     │
│                                                            │
│ Final Variance                         Rs.        0.00  ✓  │
└────────────────────────────────────────────────────────────┘
```

### Report Data Structure

```javascript
{
  "header": {
    "tenant_name": "LankaCommerce Pvt Ltd",
    "account_name": "Commercial Bank - Operating Account",
    "account_number": "1234567890",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31",
    "reconciliation_date": "2026-01-25 10:30:00",
    "reconciled_by": "Chandima Silva",
    "report_generated": "2026-01-25 11:15:00"
  },
  "summary": {
    "total_matches": 45,
    "matched_amount": 768500.00,
    "unmatched_book_items": 3,
    "unmatched_statement_items": 2,
    "adjustments_created": 3,
    "adjustments_amount": 500.00,
    "final_variance": 0.00
  },
  "balance_progression": {
    "opening_balance": 250000.00,
    "total_credits": 450000.00,
    "total_debits": 380000.00,
    "calculated_balance": 320000.00,
    "statement_balance": 318500.00,
    "variance_before_adjustments": -1500.00,
    "adjustments_total": 500.00,
    "final_balance": 318500.00,
    "final_variance": 0.00
  }
}
```

### Service Class Structure

```
┌─────────────────────────────────────────────────┐
│      ReconciliationReportService Class          │
├─────────────────────────────────────────────────┤
│ Initialization:                                 │
│  • __init__(reconciliation)                     │
│  • Validate status = COMPLETED                  │
│                                                 │
│ Main Method:                                    │
│  • generate_report()                            │
│                                                 │
│ Private Methods:                                │
│  • _get_report_header()                         │
│  • _get_reconciliation_summary()                │
│  • _calculate_balance_progression()             │
│  • _format_currency(amount)                     │
│  • _format_date(date)                           │
│                                                 │
│ Returns:                                        │
│  • Dictionary with complete report data         │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Functional report generation service
- Comprehensive reconciliation report data
- Accurate balance calculations
- Summary metrics collection
- Formatted output structure

### Verification Checklist
- [ ] report.py file created
- [ ] ReconciliationReportService class defined
- [ ] __init__ method validates reconciliation status
- [ ] generate_report method implemented
- [ ] _get_report_header method implemented
- [ ] _get_reconciliation_summary method implemented
- [ ] _calculate_balance_progression method implemented
- [ ] _format_currency method implemented
- [ ] _format_date method implemented
- [ ] Error handling implemented
- [ ] Returns complete report data structure

---

## Task 72: Add Matched Items Section

### Overview
Add functionality to the report service to generate the matched items section. This section lists all successfully matched transactions, showing both book and statement entries with their match relationships and amounts.

### Dependencies
- Task 71: Create Reconciliation Report
- ReconciliationMatch model exists

### Instructions

1. **Open report.py service file**
   - Navigate to `apps/accounting/reconciliation/services/report.py`
   - Locate ReconciliationReportService class

2. **Add get_matched_items method**
   - Query all matches for the reconciliation
   - Include related book and statement transactions
   - Order by match date descending
   - Return list of match details

3. **Add _format_matched_item method**
   - Format individual match record
   - Extract book transaction details
   - Extract statement transaction details
   - Include match date and matched by user
   - Calculate amount discrepancy if any

4. **Add _group_matches_by_type method**
   - Group matches by transaction type (DEBIT/CREDIT)
   - Calculate subtotals per type
   - Useful for report organization

5. **Update generate_report method**
   - Call get_matched_items method
   - Include matched items in report data
   - Add matched items count to summary

6. **Add match confidence indicator**
   - Show match type (EXACT, PARTIAL)
   - Display confidence score if available
   - Highlight manual matches vs automatic

### Matched Items Section Structure

```
┌────────────────────────────────────────────────────────────┐
│                    MATCHED ITEMS                           │
├────────────────────────────────────────────────────────────┤
│ Total Matched: 45 items                                    │
│ Total Amount: Rs. 768,500.00                               │
└────────────────────────────────────────────────────────────┘
```

### Matched Item Details Table

```
┌──────────┬─────────────┬──────────────────────┬─────────────┬──────────┐
│   Date   │    Type     │    Description       │    Amount   │   Match  │
│          │             │                      │   (Rs.)     │   Type   │
├──────────┼─────────────┼──────────────────────┼─────────────┼──────────┤
│ Jan 05   │ DEBIT       │ Supplier Payment     │  35,000.00  │  EXACT   │
│          │ Book Ref:   │ INV-2024-001         │             │          │
│          │ Stmt Ref:   │ CHQ-789456           │             │          │
├──────────┼─────────────┼──────────────────────┼─────────────┼──────────┤
│ Jan 08   │ CREDIT      │ Customer Payment     │  45,600.00  │  EXACT   │
│          │ Book Ref:   │ RCT-2024-055         │             │          │
│          │ Stmt Ref:   │ DEP-123789           │             │          │
├──────────┼─────────────┼──────────────────────┼─────────────┼──────────┤
│ Jan 12   │ DEBIT       │ Utility Payment      │   8,500.00  │ PARTIAL  │
│          │ Book Ref:   │ BILL-2024-0012       │             │  (98%)   │
│          │ Stmt Ref:   │ DBT-456123           │             │          │
│          │ Note:       │ Rs. 200 variance     │             │          │
└──────────┴─────────────┴──────────────────────┴─────────────┴──────────┘
```

### Match Type Indicators

| Match Type | Description | Display |
|------------|-------------|---------|
| EXACT | Amounts match exactly | ✓ EXACT |
| PARTIAL | Amounts differ slightly | ⚠ PARTIAL (confidence %) |
| MANUAL | Manually matched by user | ⊕ MANUAL |
| AUTO | Automatically matched by system | ⚙ AUTO |

### Matched Items Data Structure

```javascript
{
  "matched_items": {
    "total_count": 45,
    "total_amount": 768500.00,
    "items": [
      {
        "match_id": "abc123",
        "date": "2026-01-05",
        "type": "DEBIT",
        "book_reference": "INV-2024-001",
        "book_description": "Supplier Payment - ABC Supplies",
        "book_amount": 35000.00,
        "statement_reference": "CHQ-789456",
        "statement_description": "Cheque Payment",
        "statement_amount": 35000.00,
        "match_type": "EXACT",
        "confidence_score": 100,
        "matched_by": "Chandima Silva",
        "matched_at": "2026-01-25 09:15:00",
        "variance": 0.00
      },
      // ... more items
    ],
    "by_type": {
      "DEBIT": {
        "count": 28,
        "total_amount": 450300.00
      },
      "CREDIT": {
        "count": 17,
        "total_amount": 318200.00
      }
    }
  }
}
```

### Match Grouping Options

```
By Transaction Type:
├── DEBIT Transactions (28 items)
│   └── Total: Rs. 450,300.00
└── CREDIT Transactions (17 items)
    └── Total: Rs. 318,200.00

By Match Type:
├── Exact Matches (40 items)
│   └── Total: Rs. 750,000.00
├── Partial Matches (3 items)
│   └── Total: Rs. 15,500.00
└── Manual Matches (2 items)
    └── Total: Rs. 3,000.00

By Date:
├── Week 1 (Jan 1-7): 12 items - Rs. 185,000.00
├── Week 2 (Jan 8-14): 15 items - Rs. 245,000.00
├── Week 3 (Jan 15-21): 10 items - Rs. 180,000.00
└── Week 4 (Jan 22-31): 8 items - Rs. 158,500.00
```

### Sri Lanka-Specific Considerations

#### Bank Reference Formats
```
Commercial Bank:    CHQ-XXXXXX (Cheques)
                   DEP-XXXXXX (Deposits)
                   TRF-XXXXXX (Transfers)

Sampath Bank:      SP-CH-XXXXX (Cheques)
                   SP-DP-XXXXX (Deposits)

People's Bank:     PB-XXXXXXXX (All transactions)

HNB:              HNB-XXX-XXXXX (Branch code + reference)
```

#### Common Transaction Descriptions
```
DEBIT:
- RTGS Payment (Real-Time Gross Settlement)
- SLIPS Payment (Sri Lanka Interbank Payment System)
- Cheque Payment
- ATM Withdrawal
- Standing Order
- Direct Debit

CREDIT:
- Customer Deposit
- SLIPS Receipt
- RTGS Receipt
- Interest Credit
- Reversal Credit
```

### Matched Items Report Layout

```
═══════════════════════════════════════════════════════════════
                        MATCHED ITEMS
═══════════════════════════════════════════════════════════════

Summary:
  Total Matched Items: 45
  Total Matched Amount: Rs. 768,500.00

─────────────────────────────────────────────────────────────

DEBIT TRANSACTIONS (28 items - Rs. 450,300.00)

  Date: January 5, 2026
  Book Entry:
    Reference: INV-2024-001
    Description: Supplier Payment - ABC Supplies (Pvt) Ltd
    Amount: Rs. 35,000.00
  Statement Entry:
    Reference: CHQ-789456
    Description: Cheque Payment
    Amount: Rs. 35,000.00
  Match Type: ✓ EXACT (Auto-matched on Jan 25, 2026)
  ─────────────────────────────────────────────────────────

  Date: January 8, 2026
  Book Entry:
    Reference: RTGS-2024-008
    Description: RTGS Payment to XYZ Enterprises
    Amount: Rs. 125,000.00
  Statement Entry:
    Reference: TRF-556677
    Description: RTGS Outward
    Amount: Rs. 125,000.00
  Match Type: ✓ EXACT (Auto-matched on Jan 25, 2026)
  ─────────────────────────────────────────────────────────

CREDIT TRANSACTIONS (17 items - Rs. 318,200.00)

  Date: January 6, 2026
  Book Entry:
    Reference: RCT-2024-055
    Description: Customer Payment - Retail Shop A
    Amount: Rs. 45,600.00
  Statement Entry:
    Reference: DEP-123789
    Description: Cash Deposit
    Amount: Rs. 45,600.00
  Match Type: ✓ EXACT (Auto-matched on Jan 25, 2026)
  ─────────────────────────────────────────────────────────

═══════════════════════════════════════════════════════════════
```

### Expected Outcome
- Complete matched items section in report
- Detailed transaction information
- Match type indicators
- Grouped and organized display
- Accurate totals and counts

### Verification Checklist
- [ ] get_matched_items method implemented
- [ ] _format_matched_item method implemented
- [ ] _group_matches_by_type method implemented
- [ ] generate_report method updated
- [ ] Match confidence indicators included
- [ ] Book and statement details extracted
- [ ] Variance calculation included
- [ ] Grouping by type implemented
- [ ] Totals calculated correctly
- [ ] Data structure matches specification

---

## Task 73: Add Unmatched Items Section

### Overview
Add functionality to generate the unmatched items section, which lists transactions that could not be matched during reconciliation. This section highlights outstanding items that require attention or will carry forward to the next reconciliation period.

### Dependencies
- Task 71: Create Reconciliation Report
- Statement and transaction models exist

### Instructions

1. **Open report.py service file**
   - Continue in `apps/accounting/reconciliation/services/report.py`
   - Locate ReconciliationReportService class

2. **Add get_unmatched_items method**
   - Query unmatched book transactions
   - Query unmatched statement items
   - Separate into two categories
   - Include aging information

3. **Add _get_unmatched_book_items method**
   - Find book entries without matches
   - Within reconciliation date range
   - Order by date ascending (oldest first)
   - Return list with details

4. **Add _get_unmatched_statement_items method**
   - Find statement items without matches
   - Within statement period
   - Order by date ascending
   - Return list with details

5. **Add _calculate_item_age method**
   - Calculate days since transaction
   - Categorize by age (current, 30+ days, 60+ days)
   - Useful for aging analysis

6. **Add _flag_potential_errors method**
   - Identify suspicious unmatched items
   - Large amounts without matches
   - Old transactions (90+ days)
   - Duplicate references

7. **Update generate_report method**
   - Call get_unmatched_items method
   - Include unmatched items in report
   - Add counts to summary section

### Unmatched Items Section Structure

```
┌────────────────────────────────────────────────────────────┐
│                   UNMATCHED ITEMS                          │
├────────────────────────────────────────────────────────────┤
│ Outstanding Book Entries: 3 items                          │
│ Outstanding Statement Items: 2 items                       │
│ Total Outstanding: Rs. 15,200.00                           │
└────────────────────────────────────────────────────────────┘
```

### Unmatched Book Items Table

```
┌──────────┬──────────────┬──────────────────────┬─────────────┬─────────┐
│   Date   │  Reference   │    Description       │   Amount    │   Age   │
│          │              │                      │   (Rs.)     │ (days)  │
├──────────┼──────────────┼──────────────────────┼─────────────┼─────────┤
│ Jan 28   │ CHQ-2024-125 │ Cheque to Supplier   │   8,500.00  │  3 days │
│          │              │ Not yet cleared      │             │    ⚠    │
├──────────┼──────────────┼──────────────────────┼─────────────┼─────────┤
│ Jan 30   │ DEP-2024-090 │ Cash Deposit         │   5,200.00  │  1 day  │
│          │              │ Not in statement     │             │         │
├──────────┼──────────────┼──────────────────────┼─────────────┼─────────┤
│ Jan 15   │ TRF-2024-045 │ Transfer Payment     │   1,500.00  │ 16 days │
│          │              │ Awaiting clearance   │             │    ⚠⚠   │
└──────────┴──────────────┴──────────────────────┴─────────────┴─────────┘
```

### Unmatched Statement Items Table

```
┌──────────┬──────────────┬──────────────────────┬─────────────┬──────────┐
│   Date   │  Reference   │    Description       │   Amount    │  Reason  │
│          │              │                      │   (Rs.)     │          │
├──────────┼──────────────┼──────────────────────┼─────────────┼──────────┤
│ Jan 25   │ FEE-892345   │ Bank Service Charge  │     500.00  │ Not in   │
│          │              │                      │             │  books   │
├──────────┼──────────────┼──────────────────────┼─────────────┼──────────┤
│ Jan 30   │ INT-445667   │ Interest Earned      │     300.00  │ Not in   │
│          │              │                      │             │  books   │
└──────────┴──────────────┴──────────────────────┴─────────────┴──────────┘
```

### Unmatched Items Categories

| Category | Description | Action Required |
|----------|-------------|-----------------|
| Deposits in Transit | Recorded in books but not yet in statement | Monitor for next statement |
| Outstanding Cheques | Cheques issued but not yet cleared | Track clearance status |
| Bank Charges | Statement items not in books | Create adjustment entry |
| Interest Earned | Statement items not in books | Create adjustment entry |
| Timing Differences | Legitimate delays in processing | Will match in next period |
| Data Entry Errors | Potential mistakes | Investigate and correct |

### Aging Analysis Structure

```
┌────────────────────────────────────────────────────────────┐
│                   AGING ANALYSIS                           │
├────────────────────────────────────────────────────────────┤
│ Current (0-30 days):          4 items    Rs.  13,700.00   │
│ 31-60 days:                   1 item     Rs.   1,500.00   │
│ 61-90 days:                   0 items    Rs.       0.00   │
│ Over 90 days:                 0 items    Rs.       0.00   │
│                                          ──────────────    │
│ Total:                        5 items    Rs.  15,200.00   │
└────────────────────────────────────────────────────────────┘
```

### Age Warning Indicators

| Age Range | Indicator | Meaning |
|-----------|-----------|---------|
| 0-7 days | Normal | Expected timing difference |
| 8-30 days | ⚠ Caution | Monitor closely |
| 31-60 days | ⚠⚠ Warning | Investigate reason |
| 61+ days | ⚠⚠⚠ Alert | Urgent attention required |

### Unmatched Items Data Structure

```javascript
{
  "unmatched_items": {
    "book_items": {
      "count": 3,
      "total_amount": 15200.00,
      "items": [
        {
          "date": "2026-01-28",
          "reference": "CHQ-2024-125",
          "description": "Cheque to Supplier - ABC (Pvt) Ltd",
          "amount": 8500.00,
          "type": "DEBIT",
          "age_days": 3,
          "age_category": "current",
          "likely_reason": "Outstanding cheque - not yet cleared",
          "action_required": "Monitor for clearance"
        },
        // ... more items
      ],
      "by_age": {
        "current": {"count": 2, "amount": 13700.00},
        "30_plus": {"count": 1, "amount": 1500.00},
        "60_plus": {"count": 0, "amount": 0.00},
        "90_plus": {"count": 0, "amount": 0.00}
      }
    },
    "statement_items": {
      "count": 2,
      "total_amount": 800.00,
      "items": [
        {
          "date": "2026-01-25",
          "reference": "FEE-892345",
          "description": "Monthly Bank Service Charge",
          "amount": 500.00,
          "type": "DEBIT",
          "likely_reason": "Bank charge not recorded in books",
          "action_required": "Create adjustment entry"
        },
        // ... more items
      ]
    }
  }
}
```

### Common Unmatched Item Scenarios

#### Deposits in Transit
```
Book Entry (Jan 30):
  Customer deposit made end of day
  Amount: Rs. 5,200.00
  Status: Recorded in books

Statement:
  Statement ends Jan 31
  Deposit appears in Feb 1 statement
  
Resolution: Will match in next reconciliation
```

#### Outstanding Cheques
```
Book Entry (Jan 15):
  Cheque issued to supplier
  Amount: Rs. 8,500.00
  Status: Recorded in books

Statement:
  Cheque not yet presented for payment
  Not in statement

Resolution: Monitor clearance, will match when cleared
```

#### Bank Charges
```
Statement Entry (Jan 25):
  Monthly service charges
  Amount: Rs. 500.00
  
Book:
  Not recorded in accounting system
  
Resolution: Create adjustment entry to record expense
```

#### Interest Earned
```
Statement Entry (Jan 30):
  Interest credited by bank
  Amount: Rs. 300.00
  
Book:
  Not recorded in accounting system
  
Resolution: Create adjustment entry to record income
```

### Sri Lanka-Specific Considerations

#### Common Timing Differences

| Transaction Type | Typical Delay | Reason |
|-----------------|---------------|---------|
| Cheque Clearing | 2-3 days | Inter-bank clearing process |
| RTGS | Same day | Real-time transfer |
| SLIPS | 1-2 days | Settlement cycle |
| Card Payments | 2-5 days | Processing time |
| Standing Orders | Same day | Automated processing |

#### Bank Charges in Sri Lanka
```
Common Monthly Charges:
- Account Maintenance Fee:     Rs. 200 - Rs. 500
- Cheque Book Charges:         Rs. 10 per leaf
- SMS Alerts:                  Rs. 50 - Rs. 100
- RTGS Charges:                Rs. 150 - Rs. 500
- SLIPS Charges:               Rs. 50 - Rs. 200
- Statement Printing:          Rs. 100 per statement
```

### Unmatched Items Report Layout

```
═══════════════════════════════════════════════════════════════
                      UNMATCHED ITEMS
═══════════════════════════════════════════════════════════════

OUTSTANDING BOOK ENTRIES (3 items - Rs. 15,200.00)

These items are recorded in your books but do not appear in
the bank statement. They may represent timing differences or
require investigation.

  1. Date: January 28, 2026  [Age: 3 days]
     Reference: CHQ-2024-125
     Description: Cheque Payment to ABC Supplies (Pvt) Ltd
     Amount: Rs. 8,500.00 (DEBIT)
     Likely Reason: Outstanding cheque - not yet cleared
     Action: Monitor for clearance in next statement
     ─────────────────────────────────────────────────────────

  2. Date: January 30, 2026  [Age: 1 day]
     Reference: DEP-2024-090
     Description: Cash Deposit - Branch Collection
     Amount: Rs. 5,200.00 (CREDIT)
     Likely Reason: Deposit in transit
     Action: Will appear in next statement
     ─────────────────────────────────────────────────────────

  3. Date: January 15, 2026  [Age: 16 days] ⚠⚠
     Reference: TRF-2024-045
     Description: Transfer to Supplier Account
     Amount: Rs. 1,500.00 (DEBIT)
     Likely Reason: Delayed clearance
     Action: INVESTIGATE - Unusually long delay
     ─────────────────────────────────────────────────────────

─────────────────────────────────────────────────────────────

OUTSTANDING STATEMENT ITEMS (2 items - Rs. 800.00)

These items appear in the bank statement but are not recorded
in your books. Adjustment entries should be created.

  1. Date: January 25, 2026
     Reference: FEE-892345
     Description: Monthly Bank Service Charge
     Amount: Rs. 500.00 (DEBIT)
     Action: CREATE ADJUSTMENT - Record as bank charges expense
     ─────────────────────────────────────────────────────────

  2. Date: January 30, 2026
     Reference: INT-445667
     Description: Interest Earned on Account Balance
     Amount: Rs. 300.00 (CREDIT)
     Action: CREATE ADJUSTMENT - Record as interest income
     ─────────────────────────────────────────────────────────

═══════════════════════════════════════════════════════════════

AGING ANALYSIS

Current (0-30 days):          4 items    Rs.  13,700.00
31-60 days:                   1 item     Rs.   1,500.00 ⚠⚠
61-90 days:                   0 items    Rs.       0.00
Over 90 days:                 0 items    Rs.       0.00
                                         ──────────────
Total Unmatched:              5 items    Rs.  15,200.00

═══════════════════════════════════════════════════════════════
```

### Expected Outcome
- Complete unmatched items section
- Separate book and statement categories
- Aging analysis for monitoring
- Action recommendations
- Detailed transaction information

### Verification Checklist
- [ ] get_unmatched_items method implemented
- [ ] _get_unmatched_book_items method implemented
- [ ] _get_unmatched_statement_items method implemented
- [ ] _calculate_item_age method implemented
- [ ] _flag_potential_errors method implemented
- [ ] generate_report method updated
- [ ] Aging categorization working
- [ ] Action recommendations included
- [ ] Separate sections for book and statement
- [ ] Warning indicators for aged items

---

## Task 74: Add Adjustments Section

### Overview
Add functionality to display all adjustment entries created during the reconciliation process. This section shows how discrepancies were resolved through adjustment journal entries.

### Dependencies
- Task 71: Create Reconciliation Report
- ReconciliationAdjustment model exists

### Instructions

1. **Open report.py service file**
   - Continue in `apps/accounting/reconciliation/services/report.py`
   - Locate ReconciliationReportService class

2. **Add get_adjustments method**
   - Query all adjustments for reconciliation
   - Include related journal entry details
   - Order by adjustment date
   - Return formatted adjustment list

3. **Add _format_adjustment method**
   - Extract adjustment details
   - Include journal entry reference
   - Show accounts affected
   - Display adjustment amount

4. **Add _categorize_adjustments method**
   - Group by adjustment type
   - Common categories: bank charges, interest, errors
   - Calculate subtotals per category

5. **Add _get_adjustment_impact method**
   - Show how adjustment affects balances
   - Debit or credit to bank account
   - Corresponding account impacted

6. **Update generate_report method**
   - Call get_adjustments method
   - Include adjustments in report
   - Show impact on final balance

### Adjustments Section Structure

```
┌────────────────────────────────────────────────────────────┐
│                   ADJUSTMENT ENTRIES                       │
├────────────────────────────────────────────────────────────┤
│ Total Adjustments: 3 items                                 │
│ Net Adjustment: Rs. 500.00                                 │
└────────────────────────────────────────────────────────────┘
```

### Adjustments Details Table

```
┌────────┬──────────────┬─────────────────────┬──────────┬────────────┐
│  Date  │ Journal Ref  │    Description      │  Amount  │   Impact   │
│        │              │                     │  (Rs.)   │            │
├────────┼──────────────┼─────────────────────┼──────────┼────────────┤
│ Jan 25 │ JE-2024-089  │ Bank Service Charge │  (500)   │ Decrease   │
│        │ Debit:       │ Bank Charges        │          │  Balance   │
│        │ Credit:      │ Bank Account        │          │            │
├────────┼──────────────┼─────────────────────┼──────────┼────────────┤
│ Jan 25 │ JE-2024-090  │ Interest Earned     │   300    │ Increase   │
│        │ Debit:       │ Bank Account        │          │  Balance   │
│        │ Credit:      │ Interest Income     │          │            │
├────────┼──────────────┼─────────────────────┼──────────┼────────────┤
│ Jan 25 │ JE-2024-091  │ Deposit in Transit  │  1,400   │ Increase   │
│        │ Debit:       │ Bank Account        │          │  Balance   │
│        │ Credit:      │ Deposits in Transit │          │            │
└────────┴──────────────┴─────────────────────┴──────────┴────────────┘
```

### Adjustment Categories

| Category | Description | Typical Accounts |
|----------|-------------|------------------|
| Bank Charges | Fees and service charges | Bank Charges Expense / Bank Account |
| Interest Income | Interest earned on balance | Bank Account / Interest Income |
| Bank Errors | Corrections to bank mistakes | Bank Account / Error Correction |
| Book Errors | Corrections to book mistakes | Various / Bank Account |
| Deposits in Transit | End-of-period deposits | Bank Account / Deposits in Transit |
| Outstanding Cheques | Cheques not yet cleared | Bank Account / Outstanding Cheques |

### Adjustment Impact Indicators

| Impact | Symbol | Description |
|--------|--------|-------------|
| Increase Balance | ↑ | Adds to bank account balance |
| Decrease Balance | ↓ | Reduces bank account balance |
| Neutral | ↔ | Reclassification only |

### Adjustments Data Structure

```javascript
{
  "adjustments": {
    "total_count": 3,
    "net_adjustment": 500.00,
    "items": [
      {
        "date": "2026-01-25",
        "journal_entry_id": "je123",
        "journal_reference": "JE-2024-089",
        "description": "Monthly Bank Service Charge",
        "amount": -500.00,
        "type": "BANK_CHARGE",
        "debit_account": "Bank Charges Expense",
        "credit_account": "Commercial Bank - Operating",
        "impact": "decrease",
        "created_by": "Chandima Silva",
        "notes": "January 2026 account maintenance fee"
      },
      {
        "date": "2026-01-25",
        "journal_entry_id": "je124",
        "journal_reference": "JE-2024-090",
        "description": "Interest Earned on Account Balance",
        "amount": 300.00,
        "type": "INTEREST",
        "debit_account": "Commercial Bank - Operating",
        "credit_account": "Interest Income",
        "impact": "increase",
        "created_by": "Chandima Silva",
        "notes": "Interest for January 2026"
      },
      {
        "date": "2026-01-25",
        "journal_entry_id": "je125",
        "journal_reference": "JE-2024-091",
        "description": "Deposit in Transit - End of Month",
        "amount": 1400.00,
        "type": "DEPOSIT_IN_TRANSIT",
        "debit_account": "Commercial Bank - Operating",
        "credit_account": "Deposits in Transit",
        "impact": "increase",
        "created_by": "Chandima Silva",
        "notes": "January 30 deposit, appears in February statement"
      }
    ],
    "by_category": {
      "bank_charges": {
        "count": 1,
        "total_amount": -500.00
      },
      "interest": {
        "count": 1,
        "total_amount": 300.00
      },
      "timing_differences": {
        "count": 1,
        "total_amount": 1400.00
      }
    }
  }
}
```

### Common Adjustment Types

#### Bank Service Charges
```
Description: Monthly account maintenance fees
Journal Entry:
  Debit:  Bank Charges Expense        Rs. 500.00
  Credit: Bank Account                       Rs. 500.00
Impact: Decreases bank balance
Frequency: Monthly
```

#### Interest Earned
```
Description: Interest credited by bank
Journal Entry:
  Debit:  Bank Account                Rs. 300.00
  Credit: Interest Income                    Rs. 300.00
Impact: Increases bank balance
Frequency: Monthly/Quarterly
```

#### NSF (Not Sufficient Funds) Cheque
```
Description: Customer cheque bounced
Journal Entry:
  Debit:  Accounts Receivable         Rs. 5,000.00
  Credit: Bank Account                       Rs. 5,000.00
Impact: Decreases bank balance
Frequency: As occurs
```

#### Bank Errors
```
Description: Bank incorrectly debited account
Journal Entry:
  Debit:  Bank Account                Rs. 1,000.00
  Credit: Other Income (Bank Error)          Rs. 1,000.00
Impact: Increases bank balance (correction)
Frequency: Rare
```

#### Book Errors
```
Description: Transaction recorded incorrectly
Journal Entry:
  Debit:  Bank Account                Rs. 250.00
  Credit: Accounts Payable                   Rs. 250.00
Impact: Corrects book balance
Frequency: As discovered
```

### Sri Lanka-Specific Adjustments

#### Common Bank Charges in Sri Lanka
```
Account Maintenance:
- Savings Account:           Rs. 100 - Rs. 200/month
- Current Account:           Rs. 300 - Rs. 500/month
- Corporate Account:         Rs. 500 - Rs. 1,000/month

Transaction Charges:
- RTGS:                     Rs. 150 - Rs. 500 per transfer
- SLIPS:                    Rs. 50 - Rs. 200 per transfer
- Cheque Book:              Rs. 10 per leaf
- Over-the-Counter Cash:    Rs. 100 per transaction

Other Charges:
- SMS Alerts:               Rs. 50 - Rs. 100/month
- E-Statement:              Free
- Physical Statement:       Rs. 100 - Rs. 200
```

#### Tax Withholding Adjustments
```
Withholding Tax on Interest (Sri Lanka):
- Standard Rate: 5% on interest income
- Example: Interest Rs. 1,000 → WHT Rs. 50

Journal Entry:
  Debit:  Bank Account                Rs. 950.00
  Debit:  WHT Receivable              Rs. 50.00
  Credit: Interest Income                    Rs. 1,000.00
```

### Adjustments Report Layout

```
═══════════════════════════════════════════════════════════════
                     ADJUSTMENT ENTRIES
═══════════════════════════════════════════════════════════════

The following adjustment entries were created to reconcile
the differences between book and bank records:

Total Adjustments: 3 items
Net Adjustment: Rs. 500.00 (Increase)

─────────────────────────────────────────────────────────────

1. BANK SERVICE CHARGE                      Date: January 25, 2026
   Journal Entry: JE-2024-089
   
   Description:
   Monthly account maintenance fee charged by Commercial Bank
   for January 2026.
   
   Accounting Entry:
     Debit:  Bank Charges Expense             Rs.    500.00
     Credit: Commercial Bank - Operating             Rs. 500.00
   
   Impact: ↓ Decreases Bank Balance by Rs. 500.00
   Created by: Chandima Silva
   ─────────────────────────────────────────────────────────

2. INTEREST INCOME                          Date: January 25, 2026
   Journal Entry: JE-2024-090
   
   Description:
   Interest earned on account balance for January 2026.
   Interest rate: 3.5% per annum.
   
   Accounting Entry:
     Debit:  Commercial Bank - Operating     Rs.    300.00
     Credit: Interest Income                         Rs. 300.00
   
   Impact: ↑ Increases Bank Balance by Rs. 300.00
   Created by: Chandima Silva
   ─────────────────────────────────────────────────────────

3. DEPOSIT IN TRANSIT                       Date: January 25, 2026
   Journal Entry: JE-2024-091
   
   Description:
   Deposit made on January 30, 2026 (after statement cutoff).
   Will appear in February statement.
   
   Accounting Entry:
     Debit:  Commercial Bank - Operating     Rs.  1,400.00
     Credit: Deposits in Transit                   Rs. 1,400.00
   
   Impact: ↑ Increases Bank Balance by Rs. 1,400.00
   Created by: Chandima Silva
   Note: This is a timing difference and will reverse next period
   ─────────────────────────────────────────────────────────

═══════════════════════════════════════════════════════════════

ADJUSTMENTS SUMMARY BY CATEGORY

Bank Charges:                1 item      Rs.   (500.00)
Interest Income:             1 item      Rs.    300.00
Timing Differences:          1 item      Rs.  1,400.00
                                         ─────────────
Net Adjustment:              3 items     Rs.  1,200.00

═══════════════════════════════════════════════════════════════
```

### Expected Outcome
- Complete adjustments section in report
- Detailed journal entry information
- Clear impact on balances
- Categorized adjustments
- Accounting entries displayed

### Verification Checklist
- [ ] get_adjustments method implemented
- [ ] _format_adjustment method implemented
- [ ] _categorize_adjustments method implemented
- [ ] _get_adjustment_impact method implemented
- [ ] generate_report method updated
- [ ] Journal entry references included
- [ ] Account names displayed
- [ ] Impact indicators shown
- [ ] Category grouping working
- [ ] Net adjustment calculated

---

## Task 75: Add Summary Totals

### Overview
Add comprehensive summary totals section to the report, providing a complete financial overview of the reconciliation with all key metrics, balances, and variances in one consolidated view.

### Dependencies
- Task 71: Create Reconciliation Report
- Task 72: Add Matched Items Section
- Task 73: Add Unmatched Items Section
- Task 74: Add Adjustments Section

### Instructions

1. **Open report.py service file**
   - Continue in `apps/accounting/reconciliation/services/report.py`
   - Locate ReconciliationReportService class

2. **Add calculate_summary_totals method**
   - Aggregate data from all sections
   - Calculate opening and closing balances
   - Compute total matched and unmatched amounts
   - Sum all adjustments
   - Verify final balance reconciliation

3. **Add _calculate_opening_balance method**
   - Get balance from previous reconciliation
   - Or calculate from transactions
   - Handle first reconciliation case

4. **Add _calculate_closing_balance method**
   - Calculate from transactions
   - Apply all adjustments
   - Should match statement balance

5. **Add _calculate_variance_breakdown method**
   - Show variance components
   - Matched vs unmatched
   - Before and after adjustments
   - Final variance (should be zero)

6. **Add _format_summary_table method**
   - Format summary in table structure
   - Include all key metrics
   - Highlight important figures
   - Add visual indicators

7. **Update generate_report method**
   - Call calculate_summary_totals method
   - Place summary prominently
   - Include in report header or footer

### Summary Totals Structure

```
┌────────────────────────────────────────────────────────────┐
│               RECONCILIATION SUMMARY                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ BALANCES:                                                  │
│   Opening Balance (Jan 1):        Rs.    250,000.00       │
│   Statement Ending Balance:       Rs.    318,500.00       │
│   Book Closing Balance:           Rs.    320,000.00       │
│                                                            │
│ TRANSACTIONS:                                              │
│   Total Credits:                  Rs.    450,000.00       │
│   Total Debits:                   Rs.   (380,000.00)      │
│   Net Movement:                   Rs.     70,000.00       │
│                                                            │
│ RECONCILIATION:                                            │
│   Matched Items:          45      Rs.    768,500.00       │
│   Unmatched Book Items:    3      Rs.     15,200.00       │
│   Unmatched Statement:     2      Rs.        800.00       │
│   Adjustments:             3      Rs.      1,200.00       │
│                                                            │
│ FINAL STATUS:                                              │
│   Variance (Before):              Rs.     (1,500.00)      │
│   Adjustments Applied:            Rs.      1,200.00       │
│   Final Variance:                 Rs.          0.00   ✓   │
│                                                            │
│ STATUS: ✓ FULLY RECONCILED                                │
└────────────────────────────────────────────────────────────┘
```

### Summary Metrics Table

| Metric | Value | Description |
|--------|-------|-------------|
| Opening Balance | Rs. 250,000.00 | Balance at period start |
| Total Credits | Rs. 450,000.00 | All credit transactions |
| Total Debits | Rs. (380,000.00) | All debit transactions |
| Net Movement | Rs. 70,000.00 | Credits minus debits |
| Calculated Balance | Rs. 320,000.00 | Opening + Net Movement |
| Statement Balance | Rs. 318,500.00 | Bank statement ending |
| Initial Variance | Rs. (1,500.00) | Calculated - Statement |
| Matched Items | 45 items | Successfully matched |
| Matched Amount | Rs. 768,500.00 | Total matched value |
| Unmatched Book | 3 items | Outstanding in books |
| Unmatched Statement | 2 items | Outstanding in statement |
| Adjustments | 3 entries | Corrections made |
| Adjustments Amount | Rs. 1,200.00 | Total adjustments |
| Final Variance | Rs. 0.00 | After adjustments |
| Reconciliation Status | COMPLETE | Fully reconciled |

### Variance Breakdown Flow

```
Opening Balance                              Rs.  250,000.00
                                                 
Add: Credits/Deposits                        Rs.  450,000.00
Less: Debits/Withdrawals                     Rs. (380,000.00)
                                             ────────────────
Calculated Book Balance                      Rs.  320,000.00
                                                 
Statement Ending Balance                     Rs.  318,500.00
                                             ────────────────
Initial Variance                             Rs.   (1,500.00)
                                                 
Reconciliation Adjustments:
  Bank Service Charges                       Rs.     (500.00)
  Interest Earned                            Rs.      300.00
  Deposit in Transit                         Rs.    1,400.00
                                             ────────────────
Total Adjustments                            Rs.    1,200.00
                                                 
                                             ────────────────
Final Variance                               Rs.        0.00 ✓
                                             ════════════════
```

### Summary Totals Data Structure

```javascript
{
  "summary": {
    "balances": {
      "opening_balance": 250000.00,
      "statement_ending_balance": 318500.00,
      "book_closing_balance": 320000.00,
      "calculated_balance": 320000.00
    },
    "transactions": {
      "total_credits": 450000.00,
      "total_debits": 380000.00,
      "net_movement": 70000.00,
      "transaction_count": 52
    },
    "reconciliation": {
      "matched_items_count": 45,
      "matched_items_amount": 768500.00,
      "unmatched_book_count": 3,
      "unmatched_book_amount": 15200.00,
      "unmatched_statement_count": 2,
      "unmatched_statement_amount": 800.00,
      "adjustments_count": 3,
      "adjustments_amount": 1200.00
    },
    "variance": {
      "initial_variance": -1500.00,
      "adjustments_applied": 1200.00,
      "final_variance": 0.00,
      "is_reconciled": true
    },
    "status": {
      "reconciliation_complete": true,
      "all_items_matched": false,
      "variance_resolved": true,
      "requires_attention": false
    }
  }
}
```

### Visual Summary Layout

```
╔═══════════════════════════════════════════════════════════╗
║            RECONCILIATION SUMMARY TOTALS                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  PERIOD: January 1 - January 31, 2026                     ║
║  ACCOUNT: Commercial Bank - Operating (1234567890)        ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                    BALANCE ANALYSIS                       ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Opening Balance (Jan 1)                Rs.  250,000.00   ║
║  ├─ Total Credits                       Rs.  450,000.00   ║
║  ├─ Total Debits                        Rs. (380,000.00)  ║
║  └─ Net Movement                        Rs.   70,000.00   ║
║                                         ───────────────   ║
║  Calculated Closing Balance             Rs.  320,000.00   ║
║                                                           ║
║  Statement Ending Balance               Rs.  318,500.00   ║
║                                         ───────────────   ║
║  Initial Variance                       Rs.   (1,500.00)  ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                 RECONCILIATION ITEMS                      ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Matched Transactions:                                    ║
║    • Count:                    45 items                   ║
║    • Amount:                             Rs.  768,500.00  ║
║                                                           ║
║  Unmatched Book Entries:                                  ║
║    • Count:                     3 items                   ║
║    • Amount:                             Rs.   15,200.00  ║
║                                                           ║
║  Unmatched Statement Items:                               ║
║    • Count:                     2 items                   ║
║    • Amount:                             Rs.      800.00  ║
║                                                           ║
║  Adjustment Entries:                                      ║
║    • Count:                     3 items                   ║
║    • Amount:                             Rs.    1,200.00  ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                  FINAL RECONCILIATION                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Variance Before Adjustments            Rs.   (1,500.00)  ║
║  Adjustments Applied                    Rs.    1,200.00   ║
║                                         ───────────────   ║
║  Final Variance                         Rs.        0.00   ║
║                                         ═══════════════   ║
║                                                           ║
║  STATUS: ✓ FULLY RECONCILED                              ║
║                                                           ║
║  ✓ All variances resolved                                ║
║  ✓ Account is balanced                                   ║
║  ⚠ 5 items require monitoring in next period             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Status Indicators

| Status | Indicator | Meaning |
|--------|-----------|---------|
| Fully Reconciled | ✓ | Final variance = 0, complete |
| Pending Items | ⚠ | Has unmatched items, monitoring needed |
| Variance Exists | ✗ | Unresolved variance, needs attention |
| In Progress | ⟳ | Reconciliation ongoing |

### Key Performance Metrics

```
┌─────────────────────────────────────────────────────┐
│         RECONCILIATION PERFORMANCE                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Match Rate:         86.5%  (45 of 52 transactions) │
│ Auto-Match Rate:    82.2%  (37 of 45 matches)      │
│ Manual Match Rate:  17.8%  (8 of 45 matches)       │
│                                                     │
│ Time to Reconcile:  2.5 hours                      │
│ Adjustments Needed: 3 entries                      │
│ Error Rate:         0%  (No corrections needed)    │
│                                                     │
│ Outstanding Items:  5 items (9.6% of total)        │
│ Oldest Outstanding: 16 days                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Comparison with Previous Periods

```
┌──────────┬─────────────┬─────────────┬─────────────┐
│  Period  │  Match Rate │ Adjustments │  Time Spent │
├──────────┼─────────────┼─────────────┼─────────────┤
│ Jan 2026 │    86.5%    │   3 items   │   2.5 hrs   │ ← Current
│ Dec 2025 │    82.1%    │   5 items   │   3.2 hrs   │
│ Nov 2025 │    78.9%    │   7 items   │   4.1 hrs   │
│ Oct 2025 │    75.3%    │   8 items   │   4.8 hrs   │
└──────────┴─────────────┴─────────────┴─────────────┘

Trend: ↑ Improving - Better match rates, fewer adjustments
```

### Expected Outcome
- Comprehensive summary totals section
- All key metrics aggregated
- Balance verification complete
- Variance analysis detailed
- Status indicators clear

### Verification Checklist
- [ ] calculate_summary_totals method implemented
- [ ] _calculate_opening_balance method implemented
- [ ] _calculate_closing_balance method implemented
- [ ] _calculate_variance_breakdown method implemented
- [ ] _format_summary_table method implemented
- [ ] generate_report method updated
- [ ] All balances calculated correctly
- [ ] Transaction totals accurate
- [ ] Reconciliation counts correct
- [ ] Variance calculation verified
- [ ] Status indicators working

---

## Task 76: Add PDF Export Method

### Overview
Add PDF export functionality to generate professional printable reconciliation reports using WeasyPrint. This method converts the report data into formatted HTML and renders it as a PDF document.

### Dependencies
- Task 71: Create Reconciliation Report
- Task 72: Add Matched Items Section
- Task 73: Add Unmatched Items Section
- Task 74: Add Adjustments Section
- Task 75: Add Summary Totals
- WeasyPrint library installed
- HTML templates created

### Instructions

1. **Install WeasyPrint dependency**
   - Add weasyprint to requirements
   - Install required system libraries
   - Test PDF generation capability

2. **Create HTML template**
   - Create template at `templates/accounting/reconciliation_report.html`
   - Design professional report layout
   - Include all report sections
   - Add CSS styling for print

3. **Open report.py service file**
   - Continue in `apps/accounting/reconciliation/services/report.py`
   - Locate ReconciliationReportService class

4. **Add export_to_pdf method**
   - Accept optional output path parameter
   - Generate complete report data
   - Render HTML template
   - Convert to PDF using WeasyPrint
   - Return PDF file or bytes

5. **Add _render_html method**
   - Load HTML template
   - Pass report data to template context
   - Render complete HTML
   - Return HTML string

6. **Add _apply_pdf_styling method**
   - Define CSS for PDF output
   - Set page size (A4)
   - Configure margins and headers
   - Apply professional formatting

7. **Add _generate_filename method**
   - Create meaningful filename
   - Include tenant name
   - Include reconciliation date
   - Format: "Reconciliation_Report_TenantName_Jan2026.pdf"

8. **Add error handling**
   - Handle template rendering errors
   - Handle WeasyPrint conversion errors
   - Provide fallback options
   - Log errors appropriately

9. **Add page headers and footers**
   - Header with tenant logo and name
   - Page numbers in footer
   - Date generated in footer
   - Confidential marking if needed

10. **Add watermark support**
    - Optional "DRAFT" watermark
    - Configurable watermark text
    - Diagonal or header placement

### PDF Export Flow

```
┌─────────────────────────────────────────────────────────┐
│              PDF Export Process                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Generate Report Data        │
          │   (All sections)              │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Load HTML Template          │
          │   Apply Report Data           │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Apply CSS Styling           │
          │   (Print-specific)            │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Add Headers/Footers         │
          │   Add Page Numbers            │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Convert to PDF              │
          │   (WeasyPrint)                │
          └───────────────┬───────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │   Save or Return PDF          │
          │   Return File/Bytes           │
          └───────────────────────────────┘
```

### HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reconciliation Report - {{ tenant_name }}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm 1.5cm;
            @top-center {
                content: "{{ tenant_name }} - Reconciliation Report";
            }
            @bottom-center {
                content: "Page " counter(page) " of " counter(pages);
            }
            @bottom-right {
                content: "Generated: {{ report_date }}";
            }
        }
        /* Additional CSS styling */
    </style>
</head>
<body>
    <!-- Report Header -->
    <!-- Summary Section -->
    <!-- Matched Items Section -->
    <!-- Unmatched Items Section -->
    <!-- Adjustments Section -->
    <!-- Summary Totals -->
</body>
</html>
```

### PDF Styling CSS

```css
/* Page Setup */
@page {
    size: A4 portrait;
    margin: 2cm 1.5cm;
}

/* Typography */
body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #333;
}

h1 {
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #1a1a1a;
}

h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 10px;
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
}

th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: left;
    padding: 8px;
    border: 1px solid #ccc;
}

td {
    padding: 6px 8px;
    border: 1px solid #ddd;
}

/* Amount Formatting */
.amount {
    text-align: right;
    font-family: 'Courier New', monospace;
}

.debit {
    color: #cc0000;
}

.credit {
    color: #00cc00;
}

/* Summary Box */
.summary-box {
    background-color: #f9f9f9;
    border: 2px solid #333;
    padding: 15px;
    margin: 20px 0;
}

/* Status Indicators */
.status-success {
    color: #00aa00;
    font-weight: bold;
}

.status-warning {
    color: #ff8800;
    font-weight: bold;
}

.status-error {
    color: #cc0000;
    font-weight: bold;
}

/* Page Breaks */
.page-break {
    page-break-before: always;
}

.no-break {
    page-break-inside: avoid;
}
```

### PDF Export Method Signature

```python
def export_to_pdf(
    self,
    output_path: Optional[str] = None,
    return_bytes: bool = False,
    add_watermark: bool = False,
    watermark_text: str = "DRAFT"
) -> Union[str, bytes]:
    """
    Export reconciliation report to PDF.
    
    Args:
        output_path: File path to save PDF (optional)
        return_bytes: If True, return PDF bytes instead of saving
        add_watermark: If True, add watermark to PDF
        watermark_text: Text for watermark
    
    Returns:
        File path if saved, or PDF bytes if return_bytes=True
    """
```

### PDF Generation Options

| Option | Description | Use Case |
|--------|-------------|----------|
| Save to File | Save PDF to specified path | Archive, email attachment |
| Return Bytes | Return PDF as bytes | HTTP response, API endpoint |
| Add Watermark | Add "DRAFT" or custom text | Draft reports, review copies |
| Custom Filename | Specify output filename | Organized file storage |

### Filename Generation

```
Format: Reconciliation_Report_{TenantName}_{Month}{Year}.pdf

Examples:
- Reconciliation_Report_LankaCommerce_Jan2026.pdf
- Reconciliation_Report_QuickMart_Feb2026.pdf
- Reconciliation_Report_TechStore_Mar2026.pdf

With Date:
- Reconciliation_Report_LankaCommerce_2026-01-31.pdf

With Timestamp:
- Reconciliation_Report_LankaCommerce_2026-01-31_103045.pdf
```

### Page Layout Example

```
┌────────────────────────────────────────────────────────┐
│ [LOGO]          LANKACOMMERCE PVT LTD                  │
│                                                        │
│            BANK RECONCILIATION REPORT                  │
│      Commercial Bank - Operating Account              │
│        Period: January 1 - January 31, 2026           │
├────────────────────────────────────────────────────────┤
│                                                        │
│ RECONCILIATION SUMMARY                                 │
│ ═══════════════════════════════════════                │
│                                                        │
│ [Summary content...]                                   │
│                                                        │
│ MATCHED ITEMS (45 items)                              │
│ ─────────────────────────────────────                 │
│                                                        │
│ [Table of matched items...]                           │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Page 1 of 3            Generated: Jan 25, 2026 11:15  │
└────────────────────────────────────────────────────────┘

[Page 2: Unmatched Items and Adjustments]
[Page 3: Summary Totals and Sign-offs]
```

### Signature Section (Optional)

```
┌────────────────────────────────────────────────────────┐
│                   APPROVAL SIGNATURES                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Prepared By:                    Date:                  │
│ _____________________           ______________         │
│ Chandima Silva                                        │
│ Senior Accountant                                     │
│                                                        │
│ Reviewed By:                    Date:                  │
│ _____________________           ______________         │
│ Priya Wijesinghe                                      │
│ Finance Manager                                       │
│                                                        │
│ Approved By:                    Date:                  │
│ _____________________           ______________         │
│ Rajesh Fernando                                       │
│ Chief Financial Officer                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Watermark Options

```
DRAFT Watermark:
┌────────────────────────────────────────────┐
│                 D                          │
│                  R                         │
│                   A      [Content...]      │
│                    F                       │
│                     T                      │
└────────────────────────────────────────────┘

Confidential Watermark:
┌────────────────────────────────────────────┐
│   ┌──────────────────────────────┐         │
│   │     CONFIDENTIAL              │         │
│   └──────────────────────────────┘         │
│                                            │
│   [Report Content...]                      │
└────────────────────────────────────────────┘
```

### Sri Lanka-Specific PDF Considerations

#### Unicode Support for Sinhala/Tamil
```python
# Ensure proper font support for Unicode
CSS:
@font-face {
    font-family: 'NotoSansSinhala';
    src: url('fonts/NotoSansSinhala-Regular.ttf');
}

body {
    font-family: 'Helvetica', 'NotoSansSinhala', 'Arial', sans-serif;
}
```

#### Currency Formatting
```python
# Sri Lankan Rupee formatting
def format_currency(amount):
    return f"Rs. {amount:,.2f}"

# Display:
Rs. 250,000.00  ✓
Rs 250,000.00   ✓
LKR 250,000.00  ✓
```

### PDF Security Options (Future Enhancement)

```python
# Optional password protection
pdf_options = {
    'password': 'user_password',
    'owner_password': 'owner_password',
    'permissions': {
        'print': True,
        'modify': False,
        'copy': False,
        'annotate': False
    }
}
```

### Expected Outcome
- Functional PDF export capability
- Professional report formatting
- Printable output quality
- Headers and footers included
- Page numbers and metadata

### Verification Checklist
- [ ] WeasyPrint installed and configured
- [ ] HTML template created
- [ ] export_to_pdf method implemented
- [ ] _render_html method implemented
- [ ] _apply_pdf_styling method implemented
- [ ] _generate_filename method implemented
- [ ] Error handling implemented
- [ ] Page headers and footers working
- [ ] Watermark support functional
- [ ] Unicode characters render correctly
- [ ] PDF generates successfully
- [ ] File saved or returned as specified

---

## Summary

This document established the reconciliation reporting system:

### Completed Infrastructure
- ✅ Reconciliation report generation service
- ✅ Matched items section with transaction details
- ✅ Unmatched items section with aging analysis
- ✅ Adjustments section with journal entries
- ✅ Summary totals with balance verification
- ✅ PDF export functionality using WeasyPrint

### Key Achievements
1. **Report Service** - Comprehensive data aggregation and formatting
2. **Matched Items** - Detailed transaction matching display
3. **Unmatched Items** - Outstanding items with aging and recommendations
4. **Adjustments** - Journal entry details and balance impacts
5. **Summary Totals** - Complete financial overview with metrics
6. **PDF Export** - Professional printable reports

### Next Steps
Proceed to [../Group-F_API-Testing-Documentation/](../Group-F_API-Testing-Documentation/) to implement API endpoints and complete the reconciliation module with comprehensive testing and documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~975

