# Tasks 43-48: MatchingEngine Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** C - Matching Engine  
> **Document:** 03 of 03  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-38-42_MatchingRule-Model.md](02_Tasks-38-42_MatchingRule-Model.md)
- **→ Next Group:** [../Group-D_Reconciliation-Workflow/](../Group-D_Reconciliation-Workflow/)

---

## Document Overview

This document covers the implementation of the MatchingEngine service, which is the core intelligence layer for automatic transaction reconciliation. The engine applies configurable matching rules to pair bank statement lines with journal entries using multiple strategies: exact matching for perfect matches, fuzzy matching for timing and rounding differences, reference-based matching for checks and wire transfers, batch auto-matching for bulk processing, and match suggestions for manual review. This sophisticated service dramatically reduces manual reconciliation effort and improves accuracy.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create MatchingEngine service | High | 45 min |
| 44 | Add exact match method | Medium | 30 min |
| 45 | Add fuzzy match method | Medium | 35 min |
| 46 | Add reference match method | Medium | 30 min |
| 47 | Add auto-match batch method | High | 40 min |
| 48 | Add match suggestion method | Medium | 30 min |

---

## Task 43: Create MatchingEngine Service

### Overview
Create the MatchingEngine service class that serves as the central coordination point for all transaction matching logic. This service encapsulates the matching strategies, rule application, and orchestration of the matching process. It provides a clean interface for reconciliation workflows to invoke matching operations and handles the complexity of applying multiple matching strategies in priority order.

### Dependencies
- Task 42: Run MatchingRule Migrations (MatchingRule model exists)
- Task 37: Run Match Fields Migrations (match status fields exist)
- StatementLine model with match fields
- JournalEntry model exists
- MatchingRule model exists
- Python `re` module for pattern matching

### Instructions

1. **Create matching_engine.py service file**
   - Create file at `apps/accounting/services/matching_engine.py`
   - Import necessary Django and Python modules

2. **Import required modules**
   - Import Django database functions (Q, F, transaction)
   - Import Decimal from decimal module
   - Import datetime and timedelta from datetime module
   - Import re for regular expression matching
   - Import typing hints (List, Dict, Optional, Tuple)

3. **Import model classes**
   - Import StatementLine from accounting.models
   - Import JournalEntry from accounting.models
   - Import MatchingRule from accounting.models
   - Import BankAccount from accounting.models
   - Import MatchStatus enum from accounting.models.enums

4. **Define MatchingEngine class**
   - Add comprehensive class docstring
   - Explain purpose: Automated transaction matching
   - Document matching strategies available

5. **Add __init__ method**
   - Accept tenant parameter (required)
   - Accept bank_account parameter (optional)
   - Store tenant for tenant-aware queries
   - Store bank_account for account-specific matching
   - Initialize logger for debugging

6. **Add _get_applicable_rules method**
   - Private method to fetch active matching rules
   - Filter by tenant
   - Filter by bank_account if specified
   - Include global rules (bank_account=null)
   - Order by priority (ascending, lower priority first)
   - Return QuerySet of MatchingRule objects

7. **Add _check_amount_match method**
   - Private helper method
   - Parameters: statement_amount, entry_amount, tolerance
   - Return boolean indicating if amounts match within tolerance
   - Handle absolute value comparison
   - Account for decimal precision

8. **Add _check_date_match method**
   - Private helper method
   - Parameters: statement_date, entry_date, date_range_days
   - Return boolean indicating if dates match within range
   - Calculate date difference in days
   - Use absolute value for comparison

9. **Add _check_description_match method**
   - Private helper method
   - Parameters: description, pattern
   - Return boolean indicating if description matches pattern
   - Use re.search for pattern matching
   - Handle case-insensitive matching (re.IGNORECASE)
   - Return True if pattern is empty or None

10. **Add _calculate_match_score method**
    - Private helper method
    - Parameters: statement_line, journal_entry, rule
    - Return float score (0.0 to 1.0)
    - Calculate weighted score based on matching quality
    - Consider amount proximity, date proximity, description similarity
    - Higher score indicates better match

11. **Add get_unmatched_lines method**
    - Public method to retrieve unmatched statement lines
    - Filter by tenant and bank_account
    - Filter by match_status = UNMATCHED
    - Order by date (ascending)
    - Return QuerySet of StatementLine objects

12. **Add get_unreconciled_entries method**
    - Public method to retrieve unreconciled journal entries
    - Filter by tenant
    - Filter by account = bank account's ledger account
    - Filter by is_reconciled = False
    - Order by date (ascending)
    - Return QuerySet of JournalEntry objects

### MatchingEngine Service Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  MatchingEngine Service                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Coordination Layer                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • Rule Management                                    │ │
│  │ • Strategy Selection                                 │ │
│  │ • Match Orchestration                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Matching Strategies                                       │
│  ┌──────────────┬──────────────┬──────────────┐          │
│  │ Exact Match  │ Fuzzy Match  │ Reference    │          │
│  │              │              │ Match        │          │
│  │ • Amount =   │ • Amount ≈   │ • Ref# =     │          │
│  │ • Date =     │ • Date ≈     │ • Amount =   │          │
│  │              │              │ • Date ≈     │          │
│  └──────────────┴──────────────┴──────────────┘          │
│                                                            │
│  Batch Operations                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • Auto-Match All Unmatched Lines                     │ │
│  │ • Apply Rules in Priority Order                      │ │
│  │ • Transaction Safety                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Match Suggestions                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • Find Potential Matches                             │ │
│  │ • Calculate Match Scores                             │ │
│  │ • Rank by Quality                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Service Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Rule Application | Fetch and apply matching rules in priority order |
| Strategy Execution | Invoke appropriate matching strategy based on rule criteria |
| Match Creation | Link statement lines to journal entries |
| Status Updates | Update match status fields |
| Batch Processing | Handle multiple matches efficiently |
| Score Calculation | Compute match quality scores |
| Suggestion Generation | Provide ranked match candidates |

### Matching Process Flow

```
User Initiates Reconciliation
         │
         ▼
┌────────────────────┐
│ Get Unmatched Lines│
└─────────┬──────────┘
          │
          ▼
┌─────────────────────────┐
│ Get Unreconciled Entries│
└─────────┬───────────────┘
          │
          ▼
┌───────────────────┐
│ Load Active Rules │
│ (Priority Order)  │
└─────────┬─────────┘
          │
          ▼
For Each Statement Line:
    │
    ├─► Apply Rule 1 ──► Match Found? ──Yes──► Link & Update Status ──► Next Line
    │                         │
    │                        No
    │                         │
    ├─► Apply Rule 2 ──► Match Found? ──Yes──► Link & Update Status ──► Next Line
    │                         │
    │                        No
    │                         │
    ├─► Apply Rule N ──► Match Found? ──Yes──► Link & Update Status ──► Next Line
    │                         │
    │                        No
    │                         │
    └─► No Match ──► Leave as UNMATCHED
                         │
                         ▼
                 Generate Suggestions
                         │
                         ▼
                 Return Match Results
```

### Expected Outcome
- MatchingEngine service class created
- Core infrastructure for matching operations
- Helper methods for matching logic
- Foundation for specific matching strategies
- Tenant-aware and account-aware filtering

### Verification Checklist
- [ ] matching_engine.py file created in services/
- [ ] MatchingEngine class defined
- [ ] __init__ method accepts tenant and bank_account
- [ ] _get_applicable_rules method implemented
- [ ] _check_amount_match helper method created
- [ ] _check_date_match helper method created
- [ ] _check_description_match helper method created
- [ ] _calculate_match_score helper method created
- [ ] get_unmatched_lines method implemented
- [ ] get_unreconciled_entries method implemented
- [ ] All imports correct and available
- [ ] Class docstring comprehensive

---

## Task 44: Add Exact Match Method

### Overview
Implement the exact match strategy that finds perfect matches between statement lines and journal entries. This strategy requires exact amount match and same date, with optional description pattern matching. It's the most reliable matching strategy and should be prioritized in matching rules for highest accuracy. Ideal for standard transactions where no timing or rounding differences exist.

### Dependencies
- Task 43: Create MatchingEngine Service

### Instructions

1. **Add match_exact method to MatchingEngine class**
   - Public method returning match result
   - Parameters: statement_line (StatementLine object)
   - Returns: Optional[JournalEntry] (matched entry or None)

2. **Validate statement line status**
   - Check if statement_line.match_status != UNMATCHED
   - If already matched, return None immediately
   - Prevents re-matching of already processed lines

3. **Fetch exact match rules**
   - Get rules with amount_tolerance = 0
   - Get rules with date_range_days = 0 or 1
   - Order by priority
   - Only active rules

4. **Get candidate journal entries**
   - Call get_unreconciled_entries()
   - Filter by exact amount match
   - Filter by exact date match (same day)
   - Store as candidates list

5. **Apply rules in priority order**
   - Loop through each exact match rule
   - For each rule, loop through candidates

6. **Check description pattern if specified**
   - If rule has description_pattern, check match
   - Use _check_description_match method
   - Skip candidate if pattern doesn't match

7. **Perform exact match validation**
   - Verify amounts are exactly equal
   - Verify dates are exactly equal
   - Verify both objects belong to same tenant

8. **Create match if found**
   - Set statement_line.matched_journal_entry = matched_entry
   - Set statement_line.match_status = MATCHED
   - Set matched_entry.is_reconciled = True
   - Save both objects
   - Return matched entry

9. **Return None if no match**
   - If no candidates match after all rules
   - Return None to indicate no match found

10. **Add transaction safety**
    - Wrap match creation in database transaction
    - Use @transaction.atomic decorator or context manager
    - Ensure atomicity of match operation

### Exact Match Logic

```
Statement Line                  Journal Entry
┌─────────────────────┐        ┌─────────────────────┐
│ Date: 2026-01-15    │   =    │ Date: 2026-01-15    │
│ Amount: 5,000.00    │   =    │ Amount: 5,000.00    │
│ Desc: "INV-001..."  │  ≈?    │ Desc: "Invoice 001" │
└─────────────────────┘        └─────────────────────┘
         │                              │
         └──────────── EXACT MATCH ─────┘
                          ✓
```

### Exact Match Criteria

| Field | Requirement | Tolerance | Notes |
|-------|-------------|-----------|-------|
| Amount | Exact equality | 0.00 | Must match to the cent |
| Date | Same date | 0 days | Must be same calendar day |
| Description | Pattern match | Optional | Regex if rule specifies |
| Sign | Must match | N/A | Both credit or both debit |

### Use Cases for Exact Match

| Scenario | Example | Why Exact Match |
|----------|---------|-----------------|
| Online Payments | Gateway deposits same day | Amount and date precise |
| Internal Transfers | Between company accounts | Exact timing control |
| Payroll Deposits | Automated salary payments | Pre-scheduled amounts |
| Supplier EFT | Electronic fund transfers | Same-day processing |
| Credit Card Settlements | Merchant processor deposits | Exact settlement amounts |

### Sri Lanka Banking Context

#### Common Exact Match Scenarios
1. **SLIPS Payments** - Sri Lanka Interbank Payment System
   - Real-time payments clear same day
   - Amounts are exact (no fees at transfer level)
   - Reference numbers match

2. **CEFT Transactions** - Common Electronic Fund Transfer
   - Batch processing but predictable timing
   - Exact amounts for corporate payments
   - Same-day value date

3. **Standing Orders**
   - Automated monthly payments
   - Exact amounts by design
   - Predictable dates

4. **Salary Transfers**
   - Bulk salary uploads
   - Exact employee amounts
   - Scheduled payment dates

### Exact Match Decision Tree

```
                    Statement Line
                          │
                          ▼
              ┌─────────────────────┐
              │ Find entries with   │
              │ exact amount        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Filter by same date │
              └──────────┬──────────┘
                         │
                   Has Candidates?
                    │           │
                   Yes          No
                    │           │
                    ▼           ▼
         ┌──────────────┐   Return None
         │ Apply Rule   │
         │ Priority     │
         └──────┬───────┘
                │
         Has Description Pattern?
           │              │
          Yes             No
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Check    │   │ Match    │
    │ Pattern  │   │ First    │
    └────┬─────┘   │ Entry    │
         │         └────┬─────┘
      Matches?          │
       │    │           │
      Yes   No          │
       │    │           │
       ▼    ▼           ▼
    Match  Skip    Return Match
           Next
         Candidate
```

### Expected Outcome
- Exact match method implemented
- Perfect matches identified reliably
- High confidence matches created
- Foundation for stricter matching strategies

### Verification Checklist
- [ ] match_exact method added to MatchingEngine
- [ ] Returns Optional[JournalEntry]
- [ ] Validates statement line status
- [ ] Fetches exact match rules (tolerance = 0)
- [ ] Filters candidates by exact amount
- [ ] Filters candidates by exact date
- [ ] Applies description pattern if specified
- [ ] Creates match with proper status updates
- [ ] Uses database transaction for atomicity
- [ ] Returns None if no match found
- [ ] Method docstring complete

---

## Task 45: Add Fuzzy Match Method

### Overview
Implement the fuzzy match strategy that accommodates timing differences and small rounding variations between statement lines and journal entries. This strategy uses configurable amount tolerance and date range to handle real-world scenarios where transactions don't match exactly due to bank processing delays, foreign exchange rounding, or accounting period differences. Essential for practical reconciliation in complex environments.

### Dependencies
- Task 44: Add Exact Match Method

### Instructions

1. **Add match_fuzzy method to MatchingEngine class**
   - Public method returning match result
   - Parameters: statement_line (StatementLine object)
   - Returns: Optional[JournalEntry] (matched entry or None)

2. **Validate statement line status**
   - Check if statement_line.match_status != UNMATCHED
   - If already matched, return None immediately
   - Prevents duplicate matching

3. **Fetch fuzzy match rules**
   - Get rules with amount_tolerance > 0
   - Get rules with date_range_days > 1
   - Order by priority
   - Only active rules

4. **Get candidate journal entries with tolerances**
   - Call get_unreconciled_entries()
   - For each rule, apply amount tolerance filter
   - Calculate min_amount = statement_line.amount - rule.amount_tolerance
   - Calculate max_amount = statement_line.amount + rule.amount_tolerance
   - Filter entries where amount BETWEEN min_amount and max_amount

5. **Apply date range filter**
   - Calculate min_date = statement_line.date - timedelta(days=rule.date_range_days)
   - Calculate max_date = statement_line.date + timedelta(days=rule.date_range_days)
   - Filter entries where date BETWEEN min_date and max_date

6. **Score each candidate**
   - For each candidate entry, calculate match score
   - Use _calculate_match_score method
   - Consider amount difference (smaller = higher score)
   - Consider date difference (smaller = higher score)
   - Consider description similarity (pattern match = higher score)

7. **Apply description pattern if specified**
   - If rule has description_pattern, check match
   - Only include candidates that match pattern
   - Use _check_description_match method

8. **Select best match**
   - Sort candidates by match score (descending)
   - Select candidate with highest score
   - Ensure score meets minimum threshold (e.g., 0.5)

9. **Create match if found**
   - Set statement_line.matched_journal_entry = best_match
   - Set statement_line.match_status = MATCHED
   - Set matched_entry.is_reconciled = True
   - Save both objects
   - Return matched entry

10. **Add transaction safety**
    - Wrap match creation in database transaction
    - Ensure atomicity of scoring and matching

11. **Log fuzzy match details**
    - Log amount difference
    - Log date difference
    - Log match score
    - Useful for debugging and auditing

### Fuzzy Match Logic

```
Statement Line                  Journal Entry
┌─────────────────────┐        ┌─────────────────────┐
│ Date: 2026-01-15    │   ≈    │ Date: 2026-01-17    │  ← Within 3 days
│ Amount: 5,000.00    │   ≈    │ Amount: 4,999.50    │  ← Within $1.00
│ Desc: "Payment..."  │  ≈?    │ Desc: "Pmt Recv..." │  ← Pattern match
└─────────────────────┘        └─────────────────────┘
         │                              │
         └──────────── FUZZY MATCH ─────┘
                  Score: 0.85 ✓
```

### Fuzzy Match Criteria

| Field | Requirement | Tolerance | Example |
|-------|-------------|-----------|---------|
| Amount | Within tolerance | ±0.01 to ±100.00 | 5000 matches 4999.50 (tol: 1.00) |
| Date | Within date range | ±1 to ±7 days | Jan 15 matches Jan 17 (range: 3) |
| Description | Pattern match | Optional | "Payment" matches "Pmt Recv" |
| Sign | Must match | N/A | Both credit or both debit |

### Match Score Calculation

```
Match Score = (Amount Score × 0.5) + (Date Score × 0.3) + (Description Score × 0.2)

Amount Score:
    1.0 - (|statement_amount - entry_amount| / amount_tolerance)
    Example: |5000 - 4999.50| / 1.00 = 0.50 / 1.00 = 0.50
            Amount Score = 1.0 - 0.50 = 0.50

Date Score:
    1.0 - (|statement_date - entry_date|.days / date_range_days)
    Example: |Jan 15 - Jan 17| = 2 days, range = 3
            Date Score = 1.0 - (2 / 3) = 0.33

Description Score:
    1.0 if pattern matches, 0.5 if no pattern, 0.0 if pattern exists but doesn't match

Total Match Score:
    (0.50 × 0.5) + (0.33 × 0.3) + (1.0 × 0.2) = 0.25 + 0.10 + 0.20 = 0.55 ✓
```

### Use Cases for Fuzzy Match

| Scenario | Amount Tolerance | Date Range | Reason |
|----------|-----------------|------------|--------|
| Credit Card Deposits | $5.00 | 3 days | Processing fees and timing |
| Foreign Currency | 1% of amount | 5 days | Exchange rate fluctuations |
| Check Deposits | $0.50 | 3 days | Float time and rounding |
| ACH Payments | $1.00 | 2 days | Bank processing windows |
| Cash Deposits | $0.01 | 1 day | Counting discrepancies |

### Sri Lanka Banking Scenarios

#### Common Fuzzy Match Situations

1. **Outstation Check Clearing**
   - Checks from distant cities take 2-4 days
   - Date range: 5 days recommended
   - Amount tolerance: Rs 0.50 (counting errors)

2. **SLIPS During Downtime**
   - System maintenance affects timing
   - Next-day processing possible
   - Date range: 2 days

3. **Foreign Currency Conversion**
   - USD/EUR transactions converted to LKR
   - Exchange rate changes daily
   - Amount tolerance: 2-3% of transaction

4. **Cash Handling by Multiple Branches**
   - Manual counting variations
   - Denomination rounding
   - Amount tolerance: Rs 5-10

5. **Merchant Service Provider Fees**
   - Visa/MasterCard deduct fees
   - Amount tolerance: Known fee percentage + buffer

#### Festival Period Adjustments
```
During Sinhala/Tamil New Year, Vesak, Christmas:
- Increase date_range_days by +2 (bank holidays)
- Maintain amount tolerance (holidays don't affect amounts)
- Pattern match more important (less staff for manual review)
```

### Fuzzy Match Decision Tree

```
                    Statement Line
                          │
                          ▼
              ┌─────────────────────┐
              │ Get Fuzzy Rules     │
              │ (tolerance > 0)     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Find entries within │
              │ amount tolerance    │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Filter by date range│
              └──────────┬──────────┘
                         │
                   Has Candidates?
                    │           │
                   Yes          No
                    │           │
                    ▼           ▼
         ┌──────────────┐   Return None
         │ Calculate    │
         │ Match Scores │
         └──────┬───────┘
                │
         Apply Description Pattern?
           │              │
          Yes             No
           │              │
           ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ Filter   │   │ Keep All │
    │ by       │   │ Scored   │
    │ Pattern  │   │ Matches  │
    └────┬─────┘   └────┬─────┘
         │              │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Select Best  │
         │ Score (>0.5) │
         └──────┬───────┘
                │
          Score High Enough?
           │           │
          Yes          No
           │           │
           ▼           ▼
      Return Match  Return None
```

### Expected Outcome
- Fuzzy match method implemented
- Tolerance-based matching working
- Match quality scoring functional
- Handles real-world timing differences
- Configurable sensitivity through rules

### Verification Checklist
- [ ] match_fuzzy method added to MatchingEngine
- [ ] Returns Optional[JournalEntry]
- [ ] Validates statement line status
- [ ] Fetches fuzzy match rules (tolerance > 0)
- [ ] Applies amount tolerance range filter
- [ ] Applies date range filter
- [ ] Calculates match score for each candidate
- [ ] Applies description pattern if specified
- [ ] Selects best match above threshold
- [ ] Creates match with proper status updates
- [ ] Uses database transaction for atomicity
- [ ] Logs match details for audit
- [ ] Returns None if no good match found
- [ ] Method docstring complete

---

## Task 46: Add Reference Match Method

### Overview
Implement the reference match strategy that matches transactions based on unique reference identifiers such as check numbers, wire transfer references, or transaction IDs. This strategy is highly reliable for transactions with explicit reference numbers and can tolerate date differences while requiring exact or near-exact amount matches. Particularly useful for check reconciliation and electronic transfers where reference numbers are standardized.

### Dependencies
- Task 45: Add Fuzzy Match Method

### Instructions

1. **Add match_by_reference method to MatchingEngine class**
   - Public method returning match result
   - Parameters: statement_line (StatementLine object)
   - Returns: Optional[JournalEntry] (matched entry or None)

2. **Validate statement line status**
   - Check if statement_line.match_status != UNMATCHED
   - If already matched, return None immediately

3. **Validate reference field**
   - Check if statement_line.reference is not empty
   - If no reference, return None (cannot match without reference)
   - Clean reference string (strip whitespace, uppercase)

4. **Fetch reference match rules**
   - Get rules configured for reference matching
   - Rules should have description_pattern targeting reference formats
   - Order by priority
   - Only active rules

5. **Get candidate journal entries**
   - Call get_unreconciled_entries()
   - Filter by reference field matching
   - Use exact string comparison for reference
   - Also check memo/description fields for reference

6. **Apply amount validation**
   - For each candidate, check amount match
   - Use exact match or small tolerance (rule.amount_tolerance)
   - Reference match should have tight amount tolerance
   - Skip candidates with significant amount difference

7. **Apply date range filter**
   - Use wider date range for reference matches
   - References allow more timing flexibility
   - Use rule.date_range_days or default 7 days
   - Filter entries within date range

8. **Prioritize candidates**
   - Exact reference match in reference field = highest priority
   - Reference found in memo/description = medium priority
   - Score by amount proximity if multiple matches

9. **Create match if found**
   - Set statement_line.matched_journal_entry = matched_entry
   - Set statement_line.match_status = MATCHED
   - Set matched_entry.is_reconciled = True
   - Save both objects
   - Return matched entry

10. **Add transaction safety**
    - Wrap match creation in database transaction
    - Ensure atomicity

11. **Log reference match details**
    - Log matched reference number
    - Log amount difference if any
    - Log date difference
    - Useful for auditing

### Reference Match Logic

```
Statement Line                  Journal Entry
┌─────────────────────┐        ┌─────────────────────┐
│ Date: 2026-01-15    │   ≈    │ Date: 2026-01-12    │  ← Within 7 days OK
│ Amount: 50,000.00   │   =    │ Amount: 50,000.00   │  ← Exact amount
│ Ref: "CHK-123456"   │   =    │ Ref: "CHK-123456"   │  ← Exact reference!
└─────────────────────┘        └─────────────────────┘
         │                              │
         └────────── REFERENCE MATCH ───┘
                          ✓
```

### Reference Match Criteria

| Field | Requirement | Tolerance | Priority |
|-------|-------------|-----------|----------|
| Reference | Exact match | N/A | Highest |
| Amount | Exact or near-exact | ±0.01 to ±1.00 | High |
| Date | Flexible range | ±3 to ±7 days | Medium |
| Description | Optional pattern | Optional | Low |

### Reference Number Formats

#### Sri Lanka Check Numbers
```
Check Number Formats:
- Standard: 6 digits (e.g., "000123", "456789")
- Bank Format: Bank Code + Check# (e.g., "BOC-000123")
- Full MICR: Include branch code (e.g., "7010-001-000123")

Matching Strategy:
1. Try exact match: "000123" = "000123"
2. Try last 6 digits: "BOC-000123" matches "000123"
3. Try check number extraction: "Check #000123" matches "000123"
```

#### Electronic Transfer References
```
SLIPS Reference:
- Format: "SLIPS-YYYYMMDD-NNNNNN"
- Example: "SLIPS-20260115-001234"
- Unique per transaction

CEFT Reference:
- Format: "CEFT-BATCH-NNNN"
- Example: "CEFT-20260115-0023"
- Batch identifier

Wire Transfer:
- Format: "SWIFT-XXXXXXXXXX"
- Example: "SWIFT-MT103-XYZ123"
- International standard
```

### Reference Match Patterns

#### Check Number Pattern
```regex
Pattern: r"(?:CHK|CHECK|CK)?\s*#?\s*(\d{6})"
Matches:
  - "CHK 000123"
  - "Check #000123"
  - "CK-000123"
  - "000123"
Extracts: "000123"
```

#### SLIPS Pattern
```regex
Pattern: r"SLIPS[-_]?\d{8}[-_]?(\d{6})"
Matches:
  - "SLIPS-20260115-001234"
  - "SLIPS_20260115_001234"
  - "SLIPS20260115001234"
Extracts: "001234"
```

#### Invoice Reference Pattern
```regex
Pattern: r"(?:INV|INVOICE)[-_#]?(\d{4,8})"
Matches:
  - "INV-00001234"
  - "INVOICE#1234"
  - "INV_12345678"
Extracts: Invoice number
```

### Use Cases for Reference Match

| Scenario | Reference Type | Amount Tolerance | Date Range |
|----------|----------------|------------------|------------|
| Check Deposits | Check number | $0.50 | 7 days |
| Check Payments | Check number | $0.00 | 5 days |
| Wire Transfers | SWIFT/Reference | $0.00 | 3 days |
| SLIPS Payments | Transaction ID | $0.00 | 2 days |
| Invoice Payments | Invoice number | $1.00 | 7 days |
| Customer Receipts | Receipt number | $0.50 | 5 days |

### Sri Lanka Banking Context

#### Check Reconciliation
```
Check Clearing Timeline:
- Local Bank: 1-2 days
- Same City Other Bank: 2-3 days
- Outstation: 3-5 days

Date Range Recommendations:
- Colombo area: 3 days
- Western Province: 5 days
- Outstation: 7 days
```

#### Electronic Payment Matching
```
SLIPS (Real-Time):
- Date range: 1-2 days (system processing)
- Amount: Exact (no fees deducted)
- Reference: Always present and unique

CEFT (Batch):
- Date range: 2-3 days (batch cycles)
- Amount: Exact
- Reference: Batch + sequence number
```

### Reference Match Decision Tree

```
                    Statement Line
                          │
                   Has Reference?
                    │           │
                   Yes          No
                    │           │
                    ▼           ▼
         ┌──────────────┐   Return None
         │ Clean &      │
         │ Normalize    │
         │ Reference    │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Find entries │
         │ with same    │
         │ reference    │
         └──────┬───────┘
                │
          Has Candidates?
           │           │
          Yes          No
           │           │
           ▼           ▼
    ┌──────────┐   Return None
    │ Filter   │
    │ by       │
    │ Amount   │
    └────┬─────┘
         │
    Amount Match?
       │      │
      Yes     No
       │      │
       ▼      ▼
    ┌──────┐ Try
    │Filter│ Broader
    │ by  │ Tolerance
    │Date │
    └──┬──┘
       │
  Within Date Range?
     │          │
    Yes         No
     │          │
     ▼          ▼
  Return      Return
  Match       None
```

### Expected Outcome
- Reference match method implemented
- Reliable matching via reference numbers
- Handles multiple reference formats
- Flexible date tolerance with strict amount
- Strong match confidence

### Verification Checklist
- [ ] match_by_reference method added
- [ ] Returns Optional[JournalEntry]
- [ ] Validates statement line status
- [ ] Validates reference field exists
- [ ] Cleans and normalizes reference
- [ ] Finds entries with matching reference
- [ ] Applies amount validation (tight tolerance)
- [ ] Applies date range filter (wider range)
- [ ] Prioritizes exact reference field match
- [ ] Checks memo/description for reference
- [ ] Creates match with proper status updates
- [ ] Uses database transaction
- [ ] Logs reference match details
- [ ] Returns None if no match
- [ ] Method docstring complete

---

## Task 47: Add Auto-Match Batch Method

### Overview
Implement the batch auto-match method that processes all unmatched statement lines in a single operation, applying all matching strategies in sequence according to rule priorities. This method orchestrates the entire matching engine, invoking exact match, fuzzy match, and reference match methods for each unmatched line, and provides comprehensive match statistics. Essential for bulk reconciliation operations and scheduled matching jobs.

### Dependencies
- Task 46: Add Reference Match Method

### Instructions

1. **Add auto_match_batch method to MatchingEngine class**
   - Public method for batch processing
   - Parameters: statement_id (optional, default None for all statements)
   - Returns: Dict with match statistics

2. **Initialize match statistics**
   - Create dictionary to track results
   - Count total_lines processed
   - Count matched_exact (exact match success)
   - Count matched_fuzzy (fuzzy match success)
   - Count matched_reference (reference match success)
   - Count unmatched (still unmatched after all attempts)
   - List of errors encountered

3. **Get unmatched statement lines**
   - If statement_id provided, filter by that statement
   - Otherwise, process all unmatched lines for bank_account
   - Call get_unmatched_lines method
   - Order by date (oldest first)

4. **Wrap in database transaction**
   - Use @transaction.atomic decorator or context manager
   - Ensures all matches are atomic
   - Roll back if critical error occurs

5. **Process each statement line**
   - Loop through unmatched lines
   - Increment total_lines counter

6. **Apply matching strategies in order**
   - First attempt: Reference match (if reference exists)
   - Second attempt: Exact match
   - Third attempt: Fuzzy match
   - Stop at first successful match

7. **Attempt reference match**
   - Check if line has reference field
   - If yes, call match_by_reference(line)
   - If match found, increment matched_reference
   - Continue to next line

8. **Attempt exact match**
   - If no reference match, call match_exact(line)
   - If match found, increment matched_exact
   - Continue to next line

9. **Attempt fuzzy match**
   - If no exact match, call match_fuzzy(line)
   - If match found, increment matched_fuzzy
   - Continue to next line

10. **Handle unmatched lines**
    - If all strategies fail, increment unmatched counter
    - Leave line with status UNMATCHED
    - Continue to next line

11. **Handle errors gracefully**
    - Wrap each line processing in try-except
    - Catch and log exceptions
    - Add error details to errors list
    - Continue processing remaining lines

12. **Generate match summary**
    - Calculate match_rate = (matched_total / total_lines) × 100
    - Add matched_total = exact + fuzzy + reference
    - Format statistics dictionary

13. **Log batch completion**
    - Log start and end times
    - Log match statistics
    - Log any errors encountered

14. **Return statistics dictionary**
    - Return comprehensive match report
    - Include all counters and lists

### Auto-Match Batch Flow

```
                Start Auto-Match Batch
                          │
                          ▼
              ┌─────────────────────┐
              │ Get All Unmatched   │
              │ Statement Lines     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Begin Transaction   │
              └──────────┬──────────┘
                         │
              ╔══════════▼══════════╗
              ║ FOR EACH LINE       ║
              ╠═════════════════════╣
              ║                     ║
              ║ Try Reference Match ║
              ║         │           ║
              ║   Matched? ─Yes─► Record & Continue
              ║         │           ║
              ║        No           ║
              ║         │           ║
              ║ Try Exact Match     ║
              ║         │           ║
              ║   Matched? ─Yes─► Record & Continue
              ║         │           ║
              ║        No           ║
              ║         │           ║
              ║ Try Fuzzy Match     ║
              ║         │           ║
              ║   Matched? ─Yes─► Record & Continue
              ║         │           ║
              ║        No           ║
              ║         │           ║
              ║   Still Unmatched   ║
              ║         │           ║
              ╚═════════▼═══════════╝
                         │
                         ▼
              ┌─────────────────────┐
              │ Commit Transaction  │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Return Statistics   │
              └─────────────────────┘
```

### Match Statistics Dictionary Structure

```python
{
    'status': 'success' | 'partial' | 'error',
    'total_lines': 150,
    'matched_total': 132,
    'matched_exact': 85,
    'matched_fuzzy': 39,
    'matched_reference': 8,
    'unmatched': 18,
    'match_rate': 88.0,  # percentage
    'errors': [
        {
            'line_id': 'ABC123',
            'line_description': 'Payment...',
            'error': 'Exception message'
        }
    ],
    'processing_time': 2.34,  # seconds
    'started_at': '2026-01-25T10:30:00Z',
    'completed_at': '2026-01-25T10:30:02Z'
}
```

### Matching Strategy Priority

| Priority | Strategy | When Applied | Success Rate |
|----------|----------|--------------|--------------|
| 1 | Reference Match | Line has reference field | Very High (95%+) |
| 2 | Exact Match | No reference or reference failed | High (70-80%) |
| 3 | Fuzzy Match | Exact match failed | Medium (40-60%) |
| 4 | Unmatched | All strategies failed | N/A |

### Batch Processing Scenarios

#### Small Statement (< 100 lines)
```
Processing Mode: Synchronous
Expected Time: < 5 seconds
UI Feedback: Progress bar
User Wait: Acceptable
```

#### Medium Statement (100-500 lines)
```
Processing Mode: Synchronous with streaming updates
Expected Time: 10-30 seconds
UI Feedback: Real-time counter
User Wait: Acceptable with feedback
```

#### Large Statement (> 500 lines)
```
Processing Mode: Asynchronous (Celery task)
Expected Time: 1-5 minutes
UI Feedback: Background job notification
User Wait: Not required (background processing)
```

### Sri Lanka Reconciliation Context

#### Typical Match Distribution
```
Commercial Bank Statement (200 lines):
┌──────────────────────────────────┐
│ Reference Match: 15% (checks)    │ ████░░░░░░░░░░░░░░░░░░
│ Exact Match: 60% (standard)      │ ████████████████████░░░░░░░░
│ Fuzzy Match: 20% (timing diffs)  │ ██████░░░░░░░░░░░░░░░░░░░░
│ Unmatched: 5% (investigation)    │ ██░░░░░░░░░░░░░░░░░░░░░░░░
└──────────────────────────────────┘
```

#### Peak Reconciliation Times
```
End of Month: Higher unmatched rate (cutoff timing)
- Increase fuzzy date range by +2 days
- More transactions pending across month boundary

After Long Weekend: More reference matches needed
- Checks deposited just before holiday
- Check clearing delayed

Post-Festival Season: More fuzzy matches
- Bank processing backlogs
- Staff availability affects timing
```

### Performance Optimization

| Lines | Strategy | Optimization |
|-------|----------|--------------|
| < 100 | Single query | Load all entries into memory |
| 100-500 | Batch queries | Query per matching attempt |
| > 500 | Celery task | Async with progress updates |
| > 1000 | Chunked processing | Process in batches of 200 |

### Error Handling

#### Common Errors
1. **Database Lock Timeout**
   - Cause: Long transaction duration
   - Solution: Chunk processing into smaller batches

2. **Duplicate Match**
   - Cause: Entry already reconciled
   - Solution: Refresh entry before matching

3. **Amount Mismatch in All Strategies**
   - Cause: Unusual transaction, manual split needed
   - Solution: Mark as unmatched, suggest manual review

4. **Description Pattern Error**
   - Cause: Invalid regex in matching rule
   - Solution: Log error, skip rule, continue

### Expected Outcome
- Batch auto-match method implemented
- All strategies applied systematically
- Comprehensive match statistics
- Error resilient processing
- Transaction safety ensured

### Verification Checklist
- [ ] auto_match_batch method added
- [ ] Returns Dict with statistics
- [ ] Accepts optional statement_id parameter
- [ ] Initializes all statistic counters
- [ ] Gets unmatched lines correctly
- [ ] Wraps in database transaction
- [ ] Tries reference match first
- [ ] Tries exact match second
- [ ] Tries fuzzy match third
- [ ] Records match type in statistics
- [ ] Handles errors gracefully
- [ ] Generates match rate percentage
- [ ] Logs batch start and completion
- [ ] Returns comprehensive statistics
- [ ] Method docstring complete

---

## Task 48: Add Match Suggestion Method

### Overview
Implement the match suggestion method that generates ranked lists of potential matches for unmatched statement lines. Unlike the automatic matching methods, this generates suggestions for manual review, providing multiple candidates with match quality scores. Essential for handling complex transactions that require human judgment and for providing transparency in the matching process. Helps users understand matching logic and make informed manual matching decisions.

### Dependencies
- Task 47: Add Auto-Match Batch Method

### Instructions

1. **Add suggest_matches method to MatchingEngine class**
   - Public method returning match suggestions
   - Parameters: statement_line (StatementLine object), max_suggestions (int, default 5)
   - Returns: List[Dict] with match suggestions

2. **Validate input parameters**
   - Check statement_line is valid object
   - Check max_suggestions is positive integer
   - Set reasonable limits (max 10 suggestions)

3. **Get candidate journal entries**
   - Call get_unreconciled_entries method
   - Don't apply strict filters yet
   - Get broad set of potential matches

4. **Define tolerance ranges for suggestions**
   - Amount tolerance: Wider than auto-match (e.g., 5% or $100)
   - Date range: Wider than auto-match (e.g., 14 days)
   - Include entries user might consider

5. **Apply broad filters to candidates**
   - Filter by amount range (within wide tolerance)
   - Filter by date range (within wide window)
   - Keep candidates for scoring

6. **Calculate match score for each candidate**
   - Use _calculate_match_score method
   - Score based on amount proximity
   - Score based on date proximity
   - Score based on description similarity
   - Weight factors appropriately

7. **Add match quality indicators**
   - For each candidate, determine quality tier
   - Excellent (score > 0.8): Very likely match
   - Good (score 0.6-0.8): Probable match
   - Fair (score 0.4-0.6): Possible match
   - Poor (score < 0.4): Unlikely match

8. **Calculate detailed metrics for each suggestion**
   - Amount difference (absolute and percentage)
   - Date difference (days)
   - Description similarity (yes/no pattern match)
   - Match confidence level

9. **Add explanation text for each suggestion**
   - Generate human-readable explanation
   - Example: "Amount differs by $5.50 (0.1%), date differs by 2 days"
   - Help user understand why suggested

10. **Sort suggestions by score**
    - Order by match score descending
    - Best matches first
    - Limit to max_suggestions count

11. **Format suggestion dictionary**
    - Include journal_entry object
    - Include match score
    - Include quality tier
    - Include detailed metrics
    - Include explanation text

12. **Return suggestions list**
    - Return list of suggestion dictionaries
    - Empty list if no reasonable suggestions
    - Maximum of max_suggestions items

### Match Suggestion Structure

```
Statement Line: Payment of $5,000 on Jan 15

Suggestions (ordered by score):

1. [Excellent Match - Score: 0.92] ←── Highest confidence
   Entry: Invoice Payment #12345
   Date: Jan 15 (exact)
   Amount: $5,000.00 (exact)
   Difference: $0.00, 0 days
   Reason: Exact amount and date match

2. [Good Match - Score: 0.78]
   Entry: Customer Payment ABC Corp
   Date: Jan 13 (2 days earlier)
   Amount: $4,999.50 ($0.50 difference)
   Difference: $0.50 (0.01%), 2 days
   Reason: Near exact, slight timing difference

3. [Fair Match - Score: 0.55]
   Entry: Wire Transfer Received
   Date: Jan 10 (5 days earlier)
   Amount: $5,025.00 ($25 difference)
   Difference: $25.00 (0.5%), 5 days
   Reason: Close amount, timing offset

4. [Fair Match - Score: 0.48]
   Entry: Check Deposit #12340
   Date: Jan 17 (2 days later)
   Amount: $4,950.00 ($50 difference)
   Difference: $50.00 (1%), 2 days
   Reason: Similar amount, check float
```

### Suggestion Dictionary Format

```python
{
    'journal_entry': JournalEntry object,
    'match_score': 0.92,
    'quality': 'excellent',  # excellent | good | fair | poor
    'metrics': {
        'amount_difference': 0.00,
        'amount_difference_percent': 0.0,
        'date_difference_days': 0,
        'description_match': True
    },
    'confidence': 'High',  # High | Medium | Low
    'explanation': 'Exact amount and date match with description pattern',
    'recommendation': 'Strong candidate for matching',
    'flags': []  # Warnings or notes
}
```

### Quality Tiers and Thresholds

| Quality | Score Range | Visual | Confidence | Recommendation |
|---------|-------------|--------|------------|----------------|
| Excellent | 0.80-1.00 | 🟢 | High | Strongly recommend matching |
| Good | 0.60-0.79 | 🟡 | Medium-High | Good candidate, review details |
| Fair | 0.40-0.59 | 🟠 | Medium | Possible match, verify carefully |
| Poor | 0.00-0.39 | 🔴 | Low | Unlikely match, consider alternatives |

### Suggestion Use Cases

| Scenario | Purpose | Max Suggestions | Sort Priority |
|----------|---------|-----------------|---------------|
| Manual Reconciliation | User reviews and selects | 5 | Score |
| Audit Trail | Document why auto-match failed | 3 | Score |
| Training Data | Improve matching rules | 10 | Diversity |
| Investigation | Research discrepancies | 10 | Amount proximity |

### Sri Lanka Context Examples

#### Example 1: SLIPS Payment with Fee
```
Statement Line:
  Date: Jan 15
  Amount: Rs 99,975.00
  Description: "SLIPS Payment Received"

Suggestions:
1. [Excellent - 0.95]
   Customer Invoice Payment
   Date: Jan 15
   Amount: Rs 100,000.00
   Difference: Rs 25.00 (0.025%)
   Explanation: "SLIPS transaction fee of Rs 25 deducted"
   Recommendation: "Match and create fee journal entry"
```

#### Example 2: Check with Clearing Delay
```
Statement Line:
  Date: Jan 20
  Amount: Rs 50,000.00
  Description: "Check Deposit"
  Reference: "CHK-000123"

Suggestions:
1. [Excellent - 0.98]
   Check Payment from Customer ABC
   Date: Jan 15
   Amount: Rs 50,000.00
   Reference: CHK-000123
   Difference: Rs 0.00, 5 days
   Explanation: "Check number matches exactly, normal outstation clearing time"
   Recommendation: "Strong match, outstation check cleared"
```

#### Example 3: Foreign Currency Receipt
```
Statement Line:
  Date: Jan 18
  Amount: Rs 325,450.00
  Description: "FCY Conversion USD"

Suggestions:
1. [Good - 0.72]
   Export Invoice USD Payment
   Date: Jan 17
   Amount: Rs 326,000.00
   Difference: Rs 550.00 (0.17%)
   Explanation: "Exchange rate fluctuation between booking and settlement"
   Recommendation: "Review exchange rates, likely match"
```

### Suggestion Generation Decision Tree

```
                Statement Line (Unmatched)
                          │
                          ▼
              ┌─────────────────────┐
              │ Get All Unreconciled│
              │ Journal Entries     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Apply Broad Filters │
              │ - Amount ±5% or $100│
              │ - Date ±14 days     │
              └──────────┬──────────┘
                         │
                   Has Candidates?
                    │           │
                   Yes          No
                    │           │
                    ▼           ▼
         ┌──────────────┐   Return Empty
         │ Calculate    │      List
         │ Match Score  │
         │ for Each     │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Add Quality  │
         │ Tier         │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Generate     │
         │ Explanation  │
         │ Text         │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Sort by Score│
         │ (Descending) │
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Limit to     │
         │ Top N        │
         └──────┬───────┘
                │
                ▼
         Return Suggestions
```

### UI Integration Recommendations

#### Suggestion Display
```
┌─────────────────────────────────────────────────────────┐
│ Statement Line: Payment of Rs 5,000 on Jan 15         │
│                                                         │
│ Suggested Matches (3 found):                           │
│                                                         │
│ ● [Excellent Match - 92%]                              │
│   Invoice Payment #12345                               │
│   Date: Jan 15 | Amount: Rs 5,000.00                   │
│   ✓ Exact date | ✓ Exact amount                        │
│   [Match This] [View Details]                          │
│                                                         │
│ ○ [Good Match - 78%]                                   │
│   Customer Payment ABC                                  │
│   Date: Jan 13 | Amount: Rs 4,999.50                   │
│   ⚠ 2 days earlier | ⚠ Rs 0.50 difference             │
│   [Match This] [View Details]                          │
│                                                         │
│ ○ [Fair Match - 55%]                                   │
│   Wire Transfer                                         │
│   Date: Jan 10 | Amount: Rs 5,025                      │
│   ⚠ 5 days earlier | ⚠ Rs 25 difference               │
│   [Match This] [View Details]                          │
│                                                         │
│ [None of These] [Manual Entry]                         │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Match suggestion method implemented
- Multiple candidates ranked by quality
- Detailed metrics and explanations
- User-friendly recommendation text
- Supports manual reconciliation workflow

### Verification Checklist
- [ ] suggest_matches method added
- [ ] Returns List[Dict] of suggestions
- [ ] Accepts statement_line and max_suggestions parameters
- [ ] Validates input parameters
- [ ] Gets candidate journal entries
- [ ] Applies broad filters (wide tolerance)
- [ ] Calculates match score for each candidate
- [ ] Assigns quality tier based on score
- [ ] Calculates detailed metrics (amount diff, date diff)
- [ ] Generates explanation text
- [ ] Sorts suggestions by score descending
- [ ] Limits to max_suggestions count
- [ ] Formats suggestion dictionary correctly
- [ ] Returns empty list if no suggestions
- [ ] Method docstring complete

---

## Summary

This document implemented the MatchingEngine service, the intelligence layer for automatic transaction reconciliation:

### Completed Infrastructure
- ✅ MatchingEngine service class with tenant-awareness
- ✅ Exact match strategy (perfect matches)
- ✅ Fuzzy match strategy (tolerance-based)
- ✅ Reference match strategy (check/transfer IDs)
- ✅ Batch auto-match orchestration
- ✅ Match suggestion generation

### Key Achievements

1. **Core Service Architecture** - Clean, extensible matching engine
2. **Multiple Strategies** - Exact, fuzzy, and reference-based matching
3. **Configurable Rules** - Uses MatchingRule model for flexibility
4. **Batch Processing** - Efficient bulk reconciliation
5. **Match Scoring** - Quality-based ranking for suggestions
6. **Error Resilience** - Graceful failure handling
7. **Sri Lanka Context** - SLIPS, CEFT, check clearing support

### Matching Capabilities

| Strategy | Use Case | Success Rate | Tolerance |
|----------|----------|--------------|-----------|
| Reference | Checks, wire transfers | Very High (95%+) | Exact reference |
| Exact | Standard transactions | High (70-80%) | Zero tolerance |
| Fuzzy | Timing/rounding differences | Medium (40-60%) | Configurable |
| Suggestions | Manual review | N/A | Wide range |

### Integration Points

```
┌────────────────────────────────────────────────┐
│          Reconciliation Workflow               │
├────────────────────────────────────────────────┤
│                                                │
│  1. Import Statement                           │
│     └─► StatementImporter service              │
│                                                │
│  2. Apply Matching Rules                       │
│     └─► MatchingEngine.auto_match_batch()     │
│         ├─► Reference Match                    │
│         ├─► Exact Match                        │
│         └─► Fuzzy Match                        │
│                                                │
│  3. Manual Review Unmatched                    │
│     └─► MatchingEngine.suggest_matches()      │
│         └─► User selects from suggestions      │
│                                                │
│  4. Create Journal Entries                     │
│     └─► ReconciliationService (Group D)       │
│                                                │
│  5. Finalize Reconciliation                    │
│     └─► Update statement and entry status      │
│                                                │
└────────────────────────────────────────────────┘
```

### Performance Characteristics

- **Small Statements** (< 100 lines): < 5 seconds
- **Medium Statements** (100-500 lines): 10-30 seconds
- **Large Statements** (> 500 lines): 1-5 minutes (async)
- **Suggestion Generation**: < 1 second per line

### Next Steps

Proceed to **Group D: Reconciliation Workflow** to implement:
- Reconciliation session management
- Manual match creation
- Difference journal entry generation
- Reconciliation report generation
- Reconciliation finalization workflow

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~950
