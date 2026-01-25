# Tasks 38-42: MatchingRule Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** C - Matching Engine  
> **Document:** 02 of 03  
> **Tasks Covered:** 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-37_OFX-Importer-Match-Fields.md](01_Tasks-31-37_OFX-Importer-Match-Fields.md)
- **→ Next Document:** [03_Tasks-43-48_MatchingEngine-Service.md](03_Tasks-43-48_MatchingEngine-Service.md)

---

## Document Overview

This document covers the implementation of the MatchingRule model, which provides configurable matching criteria for automatic transaction reconciliation. The model enables tenants to define custom matching rules with priority ordering, amount tolerance, date range flexibility, and description pattern matching using regular expressions. This forms the intelligence layer of the matching engine, allowing sophisticated and context-aware transaction matching strategies.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 38 | Create MatchingRule model | Medium | 35 min |
| 39 | Add rule name field | Low | 10 min |
| 40 | Add rule match criteria | Low | 20 min |
| 41 | Add rule pattern match | Low | 15 min |
| 42 | Run MatchingRule migrations | Low | 10 min |

---

## Task 38: Create MatchingRule Model

### Overview
Create the MatchingRule model that stores configurable matching rules for transaction reconciliation. This model allows tenants to define multiple matching strategies with different criteria, enabling flexible and intelligent automatic matching of bank statement lines to journal entries. The model serves as the configuration layer for the matching engine.

### Dependencies
- Task 37: Run Match Fields Migrations (match status fields exist)
- BankAccount model exists
- Tenant model exists
- Django ORM configured

### Instructions

1. **Create matching_rule.py model file**
   - Create file at `apps/accounting/models/matching_rule.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields (CharField, IntegerField, DecimalField, BooleanField, TextField, ForeignKey)
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import BankAccount model
   - Import validators from django.core.validators

3. **Define MatchingRule model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add bank_account field**
   - ForeignKey to BankAccount model
   - on_delete=CASCADE (rules deleted when account deleted)
   - related_name='matching_rules'
   - Optional (null=True, blank=True)
   - If null, rule applies to all accounts

5. **Add is_active field**
   - BooleanField, default=True
   - Controls whether rule is applied during matching
   - Allows temporary rule disabling without deletion

6. **Add created_by field**
   - ForeignKey to User model (from settings.AUTH_USER_MODEL)
   - on_delete=SET_NULL (preserve rule if user deleted)
   - related_name='created_matching_rules'
   - Optional (null=True, blank=True)
   - Tracks rule creator for audit purposes

7. **Add Meta class**
   - Set verbose_name = 'Matching Rule'
   - Set verbose_name_plural = 'Matching Rules'
   - Add ordering by ['priority', 'name']
   - Add indexes on (tenant, is_active) and (bank_account, is_active)

8. **Add __str__ method**
   - Return meaningful string representation
   - Format: "Rule Name (Priority: X) - Active/Inactive"
   - Include priority and status for clarity

9. **Update models/__init__.py**
   - Import MatchingRule
   - Add to __all__ list for clean imports

### MatchingRule Model Structure

```
┌──────────────────────────────────────────────────┐
│             MatchingRule Model                   │
├──────────────────────────────────────────────────┤
│ Core Fields:                                     │
│  • name (CharField)                              │
│  • priority (IntegerField)                       │
│  • is_active (BooleanField)                      │
│                                                  │
│ Matching Criteria (Added in Task 40):           │
│  • amount_tolerance (DecimalField)               │
│  • date_range_days (IntegerField)                │
│  • match_reference (BooleanField)                │
│                                                  │
│ Pattern Matching (Added in Task 41):            │
│  • description_pattern (TextField)               │
│  • pattern_flags (CharField)                     │
│                                                  │
│ Relationships:                                   │
│  • bank_account (ForeignKey, optional)           │
│  • created_by (ForeignKey, optional)             │
│                                                  │
│ Inherited from TenantAwareMixin:                 │
│  • tenant (ForeignKey)                           │
│                                                  │
│ Inherited from TimestampMixin:                   │
│  • created_at (DateTimeField)                    │
│  • updated_at (DateTimeField)                    │
└──────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌─────────────────┐
│    Tenant    │◄─────────────────────│  MatchingRule   │
└──────────────┘                      └─────────────────┘
                                               │
                                               │ N:1 (optional)
                                               ▼
                                      ┌─────────────────┐
                                      │   BankAccount   │
                                      └─────────────────┘
                                               │
                                               │ N:1 (optional)
                                               ▼
                                      ┌─────────────────┐
                                      │      User       │
                                      │  (created_by)   │
                                      └─────────────────┘
```

### Bank Account Association Logic

```
Rule Scope Based on Bank Account Field
════════════════════════════════════════

Global Rules (bank_account = NULL):
  ├── Rule 1: "Exact Match All Accounts"
  ├── Rule 2: "Fuzzy Match All Accounts"
  └── Applies to ANY bank account

Account-Specific Rules (bank_account set):
  ├── Rule 3: "Commercial Bank Check Match"  → Only Commercial Bank
  ├── Rule 4: "Sampath Bank Reference Match" → Only Sampath Bank
  └── Applies ONLY to specified account

Matching Priority:
  1. Account-specific rules (checked first)
  2. Global rules (fallback if no account-specific match)
```

### Rule Ordering and Priority

```
Priority Execution Order (Lower Number = Higher Priority)
═════════════════════════════════════════════════════════

Priority 1: Exact Reference Match (Highest Priority)
  ├── Match by check number or invoice reference
  ├── Amount must be exact
  └── Most specific matching

Priority 2: Exact Amount + Date Match
  ├── Amount exact to the cent
  ├── Date must be same day
  └── Very reliable matching

Priority 3: Fuzzy Amount + Date Range
  ├── Amount within tolerance (e.g., ±5.00)
  ├── Date within range (e.g., ±3 days)
  └── Handles timing differences

Priority 4: Description Pattern Match
  ├── Regex pattern on description
  ├── With amount tolerance
  └── Vendor-specific matching

Priority 5: Generic Fuzzy Match (Lowest Priority)
  ├── Wide tolerances
  ├── Last resort matching
  └── Manual verification recommended
```

### Active/Inactive Rule Management

```
Rule Status Control
═══════════════════

Active Rules (is_active=True):
  ├── Applied during auto-matching
  ├── Included in match suggestions
  └── Shown in rule management UI

Inactive Rules (is_active=False):
  ├── Preserved in database
  ├── NOT applied during matching
  ├── Can be reactivated anytime
  └── Useful for seasonal rules

Use Cases for Temporary Deactivation:
  • Testing new rule configurations
  • Seasonal business patterns (e.g., year-end)
  • Troubleshooting matching issues
  • Account-specific temporary holds
```

### Expected Outcome
- Functional MatchingRule model skeleton
- Tenant-specific rule storage
- Bank account association (optional global rules)
- Priority-based rule ordering
- Active/inactive rule control
- Audit trail through created_by field

### Verification Checklist
- [ ] matching_rule.py file created
- [ ] MatchingRule class defined
- [ ] bank_account ForeignKey added
- [ ] is_active BooleanField added
- [ ] created_by ForeignKey added
- [ ] Meta class configured
- [ ] Indexes on (tenant, is_active) created
- [ ] Indexes on (bank_account, is_active) created
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 39: Add Rule Name Field

### Overview
Add the name field to the MatchingRule model to provide a human-readable identifier for each rule. This field helps users understand the purpose and strategy of each matching rule, making rule management intuitive and organized.

### Dependencies
- Task 38: Create MatchingRule model

### Instructions

1. **Open matching_rule.py file**
   - Navigate to `apps/accounting/models/matching_rule.py`
   - Locate MatchingRule class definition

2. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Place after bank_account field for logical ordering

3. **Add field validation**
   - Field automatically trimmed of leading/trailing whitespace
   - Must be unique per tenant (enforced in Meta class)

4. **Update Meta class**
   - Add unique_together constraint: ('tenant', 'name')
   - Ensures no duplicate rule names within same tenant
   - Different tenants can have same rule name

5. **Update model docstring**
   - Document name field purpose
   - Include example rule names

6. **Update __str__ method**
   - Ensure it uses the name field
   - Format should clearly identify the rule

### Rule Naming Best Practices

| Category | Example Names | Purpose |
|----------|---------------|---------|
| **Exact Match** | "Exact Amount Same Day" | Precise matching with no tolerance |
| **Reference Match** | "Check Number Match" | Match by reference ID or check number |
| **Fuzzy Match** | "3-Day Fuzzy Match ±5.00" | Tolerant matching with clear parameters |
| **Vendor-Specific** | "Dialog Axiata Bill Match" | Target specific vendors |
| **Pattern-Based** | "Salary Payment Pattern" | Description pattern matching |
| **Account-Specific** | "Commercial Bank Auto-Match" | Bank-specific rules |

### Rule Naming Conventions

```
Recommended Naming Structure
═════════════════════════════

Format: [Match Type] + [Criteria] + [Tolerance/Specifics]

Examples:
  ✅ "Exact Match Same Day"
  ✅ "Fuzzy ±3 Days ±10.00 LKR"
  ✅ "Check Reference Exact"
  ✅ "Supplier Invoice Pattern"
  ✅ "Salary Payment Weekly"
  ✅ "Utility Bill Auto-Match"

Avoid:
  ❌ "Rule 1"                    (Too generic)
  ❌ "test"                      (Not descriptive)
  ❌ "asdf"                      (Meaningless)
  ❌ "The rule for matching..."  (Too verbose)
```

### Sri Lanka-Specific Rule Naming Examples

```
Telecommunications Bills
  • "Dialog Mobile Bill Match"
  • "SLT/Mobitel Bill Pattern"
  • "Hutch Recharge Match"

Utility Payments
  • "CEB Electricity Bill"
  • "NWSDB Water Bill"
  • "CMC Tax Payment"

Banking Patterns
  • "BOC Check Exact"
  • "Commercial Bank SLIPS"
  • "Sampath Bank CEFT"
  • "HNB Standing Order"

Salary & EPF
  • "Monthly Salary Exact"
  • "EPF Payment Pattern"
  • "ETF Payment Pattern"

Tax Payments
  • "Inland Revenue VAT"
  • "PAYE Tax Payment"
  • "NBT Quarterly"
```

### Multi-Language Consideration

```
English Rule Names (Primary):
  • "Daily Sales Deposit"
  • "Supplier Payment Match"
  
Sinhala Names (Optional, if UI supports):
  • "දෛනික විකුණුම් තැන්පතු"
  • "සැපයුම්කරු ගෙවීම්"

Tamil Names (Optional, if UI supports):
  • "தினசரி விற்பனை வைப்பு"
  • "சப்ளையர் பணம்"

Note: Use English for rule names in database for consistency
      Multi-language display names can be added via UI layer
```

### Name Field Usage Scenarios

#### Administrative Interface
- Display in rule management dashboard
- Sort and filter rules by name
- Search rules by name
- Group related rules visually

#### Matching Process
- Log which rule triggered a match
- Show rule name in match suggestions
- Display in reconciliation audit trail
- Include in match reports

#### User Communication
- Show in notifications ("Matched using: Check Number Match")
- Display in error messages
- Include in help documentation
- Use in training materials

### Expected Outcome
- Descriptive rule identification
- Unique rule names per tenant
- Intuitive rule management
- Clear audit trails

### Verification Checklist
- [ ] name field added as CharField(max_length=200)
- [ ] Field is required (not nullable)
- [ ] unique_together constraint added: ('tenant', 'name')
- [ ] Model docstring updated with name field info
- [ ] __str__ method uses name field
- [ ] Example rule names documented

---

## Task 40: Add Rule Match Criteria

### Overview
Add the core matching criteria fields to the MatchingRule model, including amount tolerance, date range flexibility, and reference matching flag. These fields define the matching strategy parameters that the matching engine will use to find potential matches between statement lines and journal entries.

### Dependencies
- Task 38: Create MatchingRule model
- Task 39: Add rule name field

### Instructions

1. **Open matching_rule.py file**
   - Navigate to `apps/accounting/models/matching_rule.py`
   - Locate MatchingRule class definition

2. **Add priority field**
   - IntegerField with default=10
   - Validators: MinValueValidator(1), MaxValueValidator(100)
   - Lower number = higher priority (executed first)
   - Place after name field

3. **Add amount_tolerance field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default=0.00 (exact match)
   - Validators: MinValueValidator(0)
   - Represents acceptable amount difference in LKR
   - Example: 5.00 means match if difference ≤ 5.00 LKR

4. **Add date_range_days field**
   - IntegerField with default=0
   - Validators: MinValueValidator(0), MaxValueValidator(365)
   - Number of days before/after to consider
   - Example: 3 means match if within ±3 days

5. **Add match_reference field**
   - BooleanField with default=False
   - If True, require reference/check number match
   - If False, ignore reference field
   - Useful for check reconciliation

6. **Add help_text to all fields**
   - Provide clear explanations for each field
   - Include examples where helpful
   - Guide users on proper values

7. **Update model docstring**
   - Document matching criteria fields
   - Explain how fields interact
   - Provide usage examples

8. **Add clean method**
   - Validate logical consistency
   - Example: If match_reference=True, ensure pattern allows reference
   - Raise ValidationError for invalid combinations

### Matching Criteria Fields Structure

```
Matching Criteria Configuration
════════════════════════════════

┌──────────────────────────────────────────────┐
│  priority: 1-100 (lower = higher priority)  │
│  ├─ 1-10:   High priority (exact matches)   │
│  ├─ 11-50:  Medium priority (fuzzy matches) │
│  └─ 51-100: Low priority (pattern matches)  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  amount_tolerance: LKR 0.00 - 999,999.99    │
│  ├─ 0.00:     Exact amount match required   │
│  ├─ 0.01-1.00: Rounding difference allowed  │
│  ├─ 1.01-10.00: Small variance allowed      │
│  └─ 10.00+:    Large tolerance (caution!)   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  date_range_days: 0-365 days                │
│  ├─ 0:      Same day only                   │
│  ├─ 1-3:    Banking delays/weekends         │
│  ├─ 4-7:    Weekly processing cycles        │
│  ├─ 8-31:   Monthly patterns               │
│  └─ 32+:    Special cases (year-end, etc.)  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  match_reference: Boolean                    │
│  ├─ True:  Require exact reference match    │
│  │         (check number, invoice #, etc.)  │
│  └─ False: Ignore reference field           │
└──────────────────────────────────────────────┘
```

### Priority Level Guidelines

```
Priority Levels and Use Cases
══════════════════════════════

Level 1-5: CRITICAL PRIORITY
  ├── Exact reference matches (checks, invoices)
  ├── Large amount transactions requiring precision
  ├── Government tax payments
  └── Executed first, most reliable

Level 6-15: HIGH PRIORITY
  ├── Exact amount, same day matches
  ├── Supplier payments with exact amounts
  ├── Salary disbursements
  └── Very reliable, minimal false positives

Level 16-30: MEDIUM PRIORITY
  ├── Fuzzy amount matches (small tolerance)
  ├── Date range 1-3 days
  ├── Regular business transactions
  └── Balance between coverage and accuracy

Level 31-50: LOW PRIORITY
  ├── Wide amount tolerance
  ├── Extended date ranges (7+ days)
  ├── Pattern-based matching
  └── May require manual verification

Level 51-100: CATCH-ALL RULES
  ├── Broadest matching criteria
  ├── Suggest potential matches only
  ├── Should not auto-match
  └── User review required
```

### Amount Tolerance Examples

```
Scenario-Based Tolerance Settings
══════════════════════════════════

Exact Match Scenarios (0.00):
  • Check payments
  • Wire transfers
  • Government tax payments
  • Salary disbursements

Rounding Difference (0.01 - 1.00):
  • Cash rounding (1, 2, 5 cent rounding)
  • Currency conversion minor variance
  • Bank fee rounding

Small Variance (1.01 - 10.00):
  • Credit card processing fees
  • Bank charges included/excluded
  • Small discounts or adjustments

Medium Variance (10.01 - 100.00):
  • Partial payments
  • Deposits with fees deducted
  • Vendor discounts

Large Variance (100.00+):
  ⚠️  Use with caution!
  • Split transactions
  • Aggregated deposits
  • Should use pattern matching instead
```

### Date Range Examples

```
Date Range Scenarios
═══════════════════

Same Day (0 days):
  • POS daily deposit (cash to bank)
  • Same-day wire transfers
  • Real-time payments

1-3 Days:
  • Check clearing time
  • Weekend/holiday delays
  • Standard ACH processing
  • SLIPS/CEFT processing in Sri Lanka

4-7 Days:
  • Inter-bank transfers
  • Check collection
  • Out-of-station checks

8-14 Days:
  • Monthly billing cycles
  • Supplier payment terms
  • Credit card settlements

15-31 Days:
  • Monthly recurring payments
  • Utility bills (generation to payment)
  • Rent/lease payments

32+ Days:
  ⚠️  Special cases only
  • Year-end adjustments
  • Disputed transactions
  • Long-term reconciliation fixes
```

### Reference Matching Logic

```
Reference Matching Strategy
════════════════════════════

match_reference = TRUE:
  ├── Require exact reference match
  ├── Ignore amounts if different (flag for review)
  ├── Ignore dates if different (flag for review)
  ├── Primary matching criterion
  └── Use cases:
      • Check reconciliation (check number)
      • Invoice matching (invoice number)
      • Reference-based payments

match_reference = FALSE:
  ├── Reference field ignored
  ├── Match based on amount + date only
  ├── Faster matching process
  └── Use cases:
      • Cash deposits
      • Card settlements
      • Generic payments
```

### Sri Lanka Banking Context

```
Sri Lankan Payment System Timings
══════════════════════════════════

SLIPS (Sri Lanka Interbank Payment System):
  ├── Same-day settlement (if before cutoff)
  ├── Recommended date_range_days: 1
  └── amount_tolerance: 0.00 (exact)

CEFT (Common Electronic Fund Transfer):
  ├── Same-day or next-day
  ├── Recommended date_range_days: 1-2
  └── amount_tolerance: 0.00 (exact)

Check Clearing:
  ├── In-city: 2-3 working days
  ├── Out-city: 4-7 working days
  ├── Recommended date_range_days: 3-7
  └── match_reference: True (check number)

RTGS (Real-Time Gross Settlement):
  ├── Real-time settlement
  ├── Recommended date_range_days: 0-1
  └── amount_tolerance: 0.00 (exact)

Cash Deposits:
  ├── Same-day if before branch cutoff
  ├── Next day if after cutoff
  ├── Recommended date_range_days: 1
  └── amount_tolerance: 0.00 (but watch for denominations)
```

### Field Interaction Examples

```
Rule Configuration Examples
════════════════════════════

Example 1: Exact Check Match
  name: "Check Exact Match"
  priority: 5
  amount_tolerance: 0.00
  date_range_days: 5
  match_reference: True
  → Matches: Same check number, exact amount, within 5 days

Example 2: Daily Cash Deposit
  name: "Daily Cash Deposit"
  priority: 10
  amount_tolerance: 5.00
  date_range_days: 1
  match_reference: False
  → Matches: Similar amount (±5 LKR), within 1 day

Example 3: Supplier Payment Fuzzy
  name: "Supplier Payment Fuzzy"
  priority: 20
  amount_tolerance: 10.00
  date_range_days: 3
  match_reference: False
  → Matches: Similar amount (±10 LKR), within 3 days

Example 4: Salary Exact
  name: "Monthly Salary Exact"
  priority: 8
  amount_tolerance: 0.00
  date_range_days: 2
  match_reference: False
  → Matches: Exact amount, within 2 days (payroll processing)
```

### Validation Rules

```
Logical Validation in clean() Method
═════════════════════════════════════

Validation 1: Priority Range
  ✓ 1 ≤ priority ≤ 100

Validation 2: Amount Tolerance
  ✓ amount_tolerance ≥ 0.00
  ⚠️  Warning if amount_tolerance > 1000.00

Validation 3: Date Range
  ✓ 0 ≤ date_range_days ≤ 365
  ⚠️  Warning if date_range_days > 31

Validation 4: Reference + Pattern
  ⚠️  If match_reference=True, ensure description_pattern
       can extract reference (validated in Task 41)

Validation 5: Tolerance Combination
  ⚠️  If amount_tolerance=0 and date_range_days=0,
       ensure not too many exact matches expected
```

### Expected Outcome
- Comprehensive matching criteria configuration
- Flexible rule parameterization
- Clear priority-based execution
- Support for various matching strategies

### Verification Checklist
- [ ] priority field added with validators
- [ ] amount_tolerance field added with validators
- [ ] date_range_days field added with validators
- [ ] match_reference field added
- [ ] Help text added to all fields
- [ ] Model docstring updated
- [ ] clean method implemented with validation
- [ ] All validators imported from django.core.validators

---

## Task 41: Add Rule Pattern Match

### Overview
Add description pattern matching capability to the MatchingRule model using regular expressions. This allows rules to match transactions based on text patterns in the description field, enabling vendor-specific rules, payment type identification, and intelligent matching beyond simple amount and date criteria.

### Dependencies
- Task 38: Create MatchingRule model
- Task 40: Add rule match criteria fields

### Instructions

1. **Open matching_rule.py file**
   - Navigate to `apps/accounting/models/matching_rule.py`
   - Locate MatchingRule class definition

2. **Add description_pattern field**
   - TextField (allow long regex patterns)
   - Optional (blank=True, null=True)
   - Store regex pattern as string
   - If null/blank, pattern matching disabled

3. **Add pattern_flags field**
   - CharField with max_length=10
   - Optional (blank=True, null=True)
   - Store regex flags (IGNORECASE, MULTILINE, etc.)
   - Default to 'i' for case-insensitive

4. **Add help_text for pattern fields**
   - description_pattern: "Regular expression to match transaction description. Leave blank to disable pattern matching."
   - pattern_flags: "Regex flags: 'i'=case-insensitive, 'm'=multiline, 's'=dotall. Default: 'i'"

5. **Add validate_pattern method**
   - Instance method to validate regex pattern
   - Try compiling pattern with re.compile()
   - Catch re.error exceptions
   - Return True if valid, False otherwise

6. **Update clean method**
   - Call validate_pattern if description_pattern provided
   - Raise ValidationError if pattern invalid
   - Provide helpful error message with regex issue

7. **Add get_compiled_pattern method**
   - Instance method returning compiled regex
   - Handle pattern_flags conversion (string to re flags)
   - Cache compiled pattern for performance
   - Return None if pattern not set

8. **Update model docstring**
   - Document pattern matching capability
   - Include regex examples
   - Explain pattern_flags usage

### Pattern Matching Field Structure

```
Pattern Matching Configuration
═══════════════════════════════

┌────────────────────────────────────────────────┐
│  description_pattern: TextField (regex)        │
│  ├─ Null/Blank: Pattern matching disabled     │
│  ├─ Valid regex: Pattern matching enabled     │
│  └─ Examples:                                  │
│      • "^SALARY.*"                             │
│      • "DIALOG|MOBITEL|HUTCH"                  │
│      • "CHECK\s+#?(\d+)"                       │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│  pattern_flags: CharField (regex flags)        │
│  ├─ 'i': Case-insensitive (default)           │
│  ├─ 'm': Multi-line matching                  │
│  ├─ 's': Dot matches newline                  │
│  ├─ 'x': Verbose (allows comments)            │
│  └─ Combine: 'im', 'is', 'ims', etc.          │
└────────────────────────────────────────────────┘
```

### Regular Expression Pattern Examples

```
Common Pattern Types
════════════════════

Exact Text Match (Simple):
  pattern: "SALARY PAYMENT"
  flags: "i"
  matches: "salary payment", "SALARY PAYMENT", "Salary Payment"

Prefix Match:
  pattern: "^DIALOG"
  flags: "i"
  matches: "DIALOG BILL 2025", "dialog recharge"
  excludes: "PAYMENT TO DIALOG" (not at start)

Contains Any:
  pattern: "DIALOG|MOBITEL|HUTCH"
  flags: "i"
  matches: Any description containing these words
  use case: Telecom bill identification

Check Number Extraction:
  pattern: "CHECK\s*#?(\d+)"
  flags: "i"
  matches: "CHECK 123", "check #456", "CHECK#789"
  extracts: Check number from description

Invoice Reference:
  pattern: "INV[-/\s]?(\d+)"
  flags: "i"
  matches: "INV-12345", "INV 67890", "INV/11111"
  extracts: Invoice number

Date Pattern:
  pattern: "\d{4}-\d{2}-\d{2}"
  flags: ""
  matches: "PAYMENT 2025-01-15"
  use case: Date verification in description

Vendor Code:
  pattern: "^[A-Z]{3}\d{4}"
  flags: ""
  matches: "ABC1234 - Payment", "XYZ9999 Invoice"
  use case: Standardized vendor codes
```

### Sri Lanka-Specific Pattern Examples

```
Telecommunications
══════════════════

Dialog Axiata:
  pattern: "DIALOG|AXIATA"
  flags: "i"
  matches: Dialog bills, recharges, payments

Sri Lanka Telecom (SLT):
  pattern: "SLT|MOBITEL"
  flags: "i"
  matches: SLT bills, Mobitel recharges

Hutchison (Hutch):
  pattern: "HUTCH|ETISALAT"
  flags: "i"
  matches: Hutch recharges (old brand: Etisalat)


Utility Bills
═════════════

Ceylon Electricity Board (CEB):
  pattern: "CEB|ELECTRICITY|LECO"
  flags: "i"
  matches: CEB bills, LECO (Lanka Electricity Company)

Water Board (NWSDB):
  pattern: "NWSDB|WATER\s+BILL"
  flags: "i"
  matches: National Water Supply & Drainage Board

Municipal Taxes:
  pattern: "CMC|MUNICIPAL|PRADESHIYA"
  flags: "i"
  matches: Colombo Municipal Council, local authority taxes


Banking Patterns
════════════════

Bank Names:
  pattern: "BOC|COMMERCIAL|SAMPATH|HNB|NSB"
  flags: "i"
  matches: Major Sri Lankan banks

SLIPS Transfers:
  pattern: "SLIPS|SL\s*IPS"
  flags: "i"
  matches: Interbank payment system transfers

CEFT Transfers:
  pattern: "CEFT|COMMON.*FUND\s*TRANSFER"
  flags: "i"
  matches: Common electronic fund transfers


Government Payments
═══════════════════

Inland Revenue (IRD):
  pattern: "INLAND\s+REVENUE|IRD|VAT|INCOME\s+TAX"
  flags: "i"
  matches: Tax payments to IRD

EPF/ETF:
  pattern: "EPF|ETF|PROVIDENT"
  flags: "i"
  matches: Employee provident fund contributions

PAYE:
  pattern: "PAYE|PAY.*AS.*YOU.*EARN"
  flags: "i"
  matches: Pay As You Earn tax


Salary & Payroll
════════════════

Salary Disbursement:
  pattern: "^SALARY|^SAL\s|PAYROLL"
  flags: "i"
  matches: Salary payments (must be at start or specific format)

Allowances:
  pattern: "ALLOWANCE|REIMBURSE|CLAIM"
  flags: "i"
  matches: Various allowances and reimbursements

Bonuses:
  pattern: "BONUS|INCENTIVE|COMMISSION"
  flags: "i"
  matches: Performance-based payments
```

### Pattern Flags Usage

```
Flag Combinations and Use Cases
════════════════════════════════

'i' (IGNORECASE) - Most Common:
  ✓ Case-insensitive matching
  ✓ Use for: Most patterns (user input varies)
  Example: "dialog" matches "DIALOG", "Dialog", "dialog"

'' (No flags) - Exact Case:
  ✓ Case-sensitive matching
  ✓ Use for: Vendor codes, reference IDs
  Example: "INV" only matches "INV", not "inv"

'im' (IGNORECASE + MULTILINE):
  ✓ Case-insensitive, ^ and $ match line boundaries
  ✓ Use for: Multi-line descriptions
  Example: Match "^TOTAL" at start of any line

's' (DOTALL):
  ✓ Dot (.) matches newline characters
  ✓ Use for: Descriptions spanning multiple lines
  Example: "INVOICE.*TOTAL" across line breaks

'x' (VERBOSE):
  ✓ Allows whitespace and comments in pattern
  ✓ Use for: Complex, documented patterns
  Example: """
    ^SALARY       # Must start with SALARY
    \s+           # One or more spaces
    \d{4}-\d{2}   # Year-month format
    """
```

### Pattern Validation

```
validate_pattern() Method Logic
════════════════════════════════

Step 1: Check if pattern exists
  if not self.description_pattern:
      return True  # No pattern = valid (disabled)

Step 2: Try compiling regex
  try:
      flags = self._get_regex_flags()
      re.compile(self.description_pattern, flags)
      return True
  except re.error as e:
      return False, str(e)

Step 3: Additional validations (optional)
  • Check for catastrophic backtracking
  • Warn if pattern too broad (matches everything)
  • Suggest improvements for common mistakes

Common Regex Errors:
  ❌ Unmatched parentheses: "(abc"
  ❌ Invalid escape sequence: "\k"
  ❌ Unclosed character class: "[abc"
  ❌ Empty group: "()"
  ❌ Invalid repetition: "*abc"
```

### Compiled Pattern Caching

```
get_compiled_pattern() Method
══════════════════════════════

Purpose:
  • Compile regex once per rule instance
  • Cache for repeated use during matching
  • Convert string flags to re module flags

Implementation Outline:
  def get_compiled_pattern(self):
      if not self.description_pattern:
          return None
      
      if not hasattr(self, '_compiled_pattern'):
          flags = self._get_regex_flags()
          self._compiled_pattern = re.compile(
              self.description_pattern,
              flags
          )
      
      return self._compiled_pattern

  def _get_regex_flags(self):
      """Convert string flags to re module flags"""
      flags = 0
      if self.pattern_flags:
          if 'i' in self.pattern_flags.lower():
              flags |= re.IGNORECASE
          if 'm' in self.pattern_flags.lower():
              flags |= re.MULTILINE
          if 's' in self.pattern_flags.lower():
              flags |= re.DOTALL
          if 'x' in self.pattern_flags.lower():
              flags |= re.VERBOSE
      return flags

Performance Benefits:
  • Compile once, use many times
  • Avoid repeated compilation overhead
  • Significant speedup for batch matching
```

### Pattern Matching in Matching Engine

```
How Patterns Are Used (Preview)
════════════════════════════════

In MatchingEngine Service (Task 43-48):

Step 1: Get active rules with patterns
  rules = MatchingRule.objects.filter(
      tenant=tenant,
      is_active=True,
      description_pattern__isnull=False
  ).order_by('priority')

Step 2: For each statement line
  for line in unmatched_lines:
      for rule in rules:
          pattern = rule.get_compiled_pattern()
          if pattern and pattern.search(line.description):
              # Pattern matches, apply rule criteria
              potential_matches = find_matches_by_rule(line, rule)

Step 3: Additional filtering
  • Apply amount_tolerance check
  • Apply date_range_days check
  • Apply match_reference check if enabled

Step 4: Return best match
  • Highest priority rule wins
  • If multiple matches, use additional scoring
```

### Pattern Testing and Debugging

```
Testing Pattern Matches (Manual)
═════════════════════════════════

In Django shell or admin:
  from apps.accounting.models import MatchingRule
  import re
  
  rule = MatchingRule.objects.get(name="Dialog Bill Match")
  pattern = rule.get_compiled_pattern()
  
  test_descriptions = [
      "DIALOG BILL JANUARY 2025",
      "PAYMENT TO DIALOG AXIATA",
      "dialog recharge 500",
      "TELEPHONE BILL",  # Should not match
  ]
  
  for desc in test_descriptions:
      if pattern.search(desc):
          print(f"✓ MATCH: {desc}")
      else:
          print(f"✗ NO MATCH: {desc}")

Expected Output:
  ✓ MATCH: DIALOG BILL JANUARY 2025
  ✓ MATCH: PAYMENT TO DIALOG AXIATA
  ✓ MATCH: dialog recharge 500
  ✗ NO MATCH: TELEPHONE BILL
```

### Pattern Security Considerations

```
Regex Security (ReDoS Prevention)
══════════════════════════════════

⚠️  Avoid Catastrophic Backtracking:

Dangerous Pattern:
  ❌ "(a+)+b"
  ❌ "(.*)*"
  ❌ "(a|a)*b"
  → Can cause exponential time complexity

Safe Alternatives:
  ✓ "a+b"
  ✓ ".*?b" (non-greedy)
  ✓ "a*b"

Validation Strategy:
  • Limit pattern length (e.g., 500 characters)
  • Test pattern with known inputs
  • Set timeout for regex execution
  • Use re2 library for production (optional)
```

### Expected Outcome
- Regex pattern matching capability
- Flexible description-based matching
- Vendor and payment type identification
- Enhanced matching intelligence

### Verification Checklist
- [ ] description_pattern field added (TextField)
- [ ] pattern_flags field added (CharField)
- [ ] Help text added to both fields
- [ ] validate_pattern method implemented
- [ ] get_compiled_pattern method implemented
- [ ] _get_regex_flags helper method implemented
- [ ] clean method updated to validate pattern
- [ ] Model docstring updated with pattern examples
- [ ] re module imported

---

## Task 42: Run MatchingRule Migrations

### Overview
Create and apply Django migrations for the MatchingRule model and all associated fields added in Tasks 38-41. This task generates the database schema for the matching rule system and ensures all fields, indexes, and constraints are properly created.

### Dependencies
- Task 38: Create MatchingRule model
- Task 39: Add rule name field
- Task 40: Add rule match criteria
- Task 41: Add rule pattern match
- Django migrations system configured
- Database connection established

### Instructions

1. **Verify model completeness**
   - Open `apps/accounting/models/matching_rule.py`
   - Confirm all fields are added (Tasks 38-41)
   - Ensure __str__, Meta, and methods are complete

2. **Verify model imports**
   - Open `apps/accounting/models/__init__.py`
   - Confirm MatchingRule is imported
   - Confirm MatchingRule is in __all__ list

3. **Create migration file**
   - Open terminal in project root
   - Run: `python manage.py makemigrations accounting`
   - Verify migration file created
   - Expected name: `0014_matchingrule.py` (or next number)

4. **Review migration file**
   - Open generated migration file
   - Verify all fields present
   - Check indexes created:
     - (tenant, is_active)
     - (bank_account, is_active)
   - Check constraints:
     - unique_together: ('tenant', 'name')

5. **Apply migration**
   - Run: `python manage.py migrate accounting`
   - Verify successful application
   - Check for any errors or warnings

6. **Verify database schema**
   - Check table created: `accounting_matchingrule`
   - Verify all columns exist
   - Verify indexes created
   - Verify foreign key constraints

7. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import model: `from apps.accounting.models import MatchingRule`
   - Verify model accessible
   - Test basic instantiation

8. **Update documentation**
   - Update SubPhase documentation
   - Note migration file number
   - Document any special considerations

### Migration File Structure

```
Expected Migration File
═══════════════════════

File: apps/accounting/migrations/0014_matchingrule.py

Dependencies:
  ├── ('accounting', '0013_match_fields')  # Previous migration
  ├── ('tenants', '...most_recent')        # Tenant model
  ├── ('accounting', 'previous_for_bank_account')
  └── (settings.AUTH_USER_MODEL, '...')    # User model

Operations:
  ├── CreateModel: MatchingRule
  │   ├── Fields:
  │   │   ├── id (AutoField, primary key)
  │   │   ├── tenant (ForeignKey)
  │   │   ├── bank_account (ForeignKey, nullable)
  │   │   ├── name (CharField, max_length=200)
  │   │   ├── priority (IntegerField, default=10)
  │   │   ├── is_active (BooleanField, default=True)
  │   │   ├── amount_tolerance (DecimalField, 15,2)
  │   │   ├── date_range_days (IntegerField, default=0)
  │   │   ├── match_reference (BooleanField, default=False)
  │   │   ├── description_pattern (TextField, nullable)
  │   │   ├── pattern_flags (CharField, max_length=10, nullable)
  │   │   ├── created_by (ForeignKey, nullable)
  │   │   ├── created_at (DateTimeField, auto_now_add)
  │   │   └── updated_at (DateTimeField, auto_now)
  │   ├── Meta:
  │   │   ├── ordering: ['priority', 'name']
  │   │   ├── verbose_name: 'Matching Rule'
  │   │   ├── verbose_name_plural: 'Matching Rules'
  │   │   └── unique_together: [('tenant', 'name')]
  │   └── Indexes:
  │       ├── tenant_is_active_idx
  │       └── bank_account_is_active_idx
  └── (No data migrations needed)
```

### Database Schema Verification

```
Table: accounting_matchingrule
══════════════════════════════

Column Name           | Type         | Nullable | Default
─────────────────────|─────────────|──────────|─────────
id                    | integer      | NO       | auto
tenant_id             | integer      | NO       | -
bank_account_id       | integer      | YES      | NULL
name                  | varchar(200) | NO       | -
priority              | integer      | NO       | 10
is_active             | boolean      | NO       | TRUE
amount_tolerance      | decimal(15,2)| NO       | 0.00
date_range_days       | integer      | NO       | 0
match_reference       | boolean      | NO       | FALSE
description_pattern   | text         | YES      | NULL
pattern_flags         | varchar(10)  | YES      | NULL
created_by_id         | integer      | YES      | NULL
created_at            | timestamp    | NO       | now()
updated_at            | timestamp    | NO       | now()

Indexes:
  PRIMARY KEY (id)
  FOREIGN KEY (tenant_id) REFERENCES tenants_tenant(id)
  FOREIGN KEY (bank_account_id) REFERENCES accounting_bankaccount(id)
  FOREIGN KEY (created_by_id) REFERENCES auth_user(id)
  UNIQUE (tenant_id, name)
  INDEX (tenant_id, is_active)
  INDEX (bank_account_id, is_active)
  INDEX (priority, name)  -- from ordering
```

### Migration Commands Reference

```
Common Migration Commands
══════════════════════════

Create migration:
  $ python manage.py makemigrations accounting
  
  Options:
    --name MIGRATION_NAME    # Custom migration name
    --empty                  # Create empty migration
    --dry-run                # Show what would be created

Apply migration:
  $ python manage.py migrate accounting
  
  Options:
    --fake                   # Mark as applied without running
    --plan                   # Show migration plan
    --database DATABASE      # Specify database (multi-db)

View migration status:
  $ python manage.py showmigrations accounting
  
  Output:
    [X] 0001_initial
    [X] 0002_...
    [X] 0013_match_fields
    [X] 0014_matchingrule     ← Should be checked

Rollback migration (if needed):
  $ python manage.py migrate accounting 0013_match_fields
  → Reverts to migration 0013, undoing 0014

View migration SQL:
  $ python manage.py sqlmigrate accounting 0014
  → Shows actual SQL that will be executed
```

### Testing in Django Shell

```
Django Shell Testing
════════════════════

$ python manage.py shell

>>> from apps.accounting.models import MatchingRule
>>> from apps.tenants.models import Tenant

# Test 1: Model accessible
>>> MatchingRule
<class 'apps.accounting.models.matching_rule.MatchingRule'>

# Test 2: Create instance (not saved)
>>> tenant = Tenant.objects.first()
>>> rule = MatchingRule(
...     tenant=tenant,
...     name="Test Rule",
...     priority=10,
...     amount_tolerance=5.00,
...     date_range_days=3
... )
>>> rule
<MatchingRule: Test Rule (Priority: 10) - Active>

# Test 3: Validate pattern
>>> rule.description_pattern = "DIALOG|MOBITEL"
>>> rule.pattern_flags = "i"
>>> rule.validate_pattern()
True

# Test 4: Get compiled pattern
>>> pattern = rule.get_compiled_pattern()
>>> pattern.search("dialog bill payment")
<re.Match object; span=(0, 6), match='dialog'>

# Test 5: Save to database
>>> rule.save()
>>> MatchingRule.objects.filter(tenant=tenant).count()
1

# Test 6: Query with filters
>>> MatchingRule.objects.filter(
...     tenant=tenant,
...     is_active=True
... ).order_by('priority')
<QuerySet [<MatchingRule: Test Rule (Priority: 10) - Active>]>

# Test 7: Test unique constraint
>>> duplicate = MatchingRule(
...     tenant=tenant,
...     name="Test Rule"  # Same name
... )
>>> duplicate.save()
django.db.utils.IntegrityError: duplicate key violates unique constraint
```

### Troubleshooting Common Issues

```
Issue 1: Migration Conflicts
─────────────────────────────
Error: "Conflicting migrations detected"

Solution:
  1. Check migration files for conflicts
  2. Merge migrations if multiple branches
  3. Use: python manage.py makemigrations --merge


Issue 2: Dependency Errors
───────────────────────────
Error: "Migration dependency on non-existent migration"

Solution:
  1. Check dependencies in migration file
  2. Ensure previous migrations applied
  3. Run: python manage.py migrate --run-syncdb


Issue 3: Field Errors
──────────────────────
Error: "Unknown field option: ..."

Solution:
  1. Check field type supports option
  2. Verify Django version compatibility
  3. Review field definition in model


Issue 4: Database Connection
─────────────────────────────
Error: "Could not connect to database"

Solution:
  1. Verify database running
  2. Check database settings
  3. Test connection: python manage.py dbshell


Issue 5: Constraint Violations
───────────────────────────────
Error: "Constraint violation during migration"

Solution:
  1. Check for existing data conflicts
  2. Create data migration if needed
  3. Fix data before applying migration
```

### Post-Migration Verification

```
Verification Checklist Commands
════════════════════════════════

1. Check migration applied:
   $ python manage.py showmigrations accounting
   Look for: [X] 0014_matchingrule

2. Verify table exists:
   $ python manage.py dbshell
   \dt accounting_matchingrule
   \d accounting_matchingrule  (show structure)

3. Test model access:
   $ python manage.py shell
   >>> from apps.accounting.models import MatchingRule
   >>> MatchingRule.objects.count()
   0

4. Check indexes:
   $ python manage.py dbshell
   \di accounting_matchingrule*
   
   Expected indexes:
     - accounting_matchingrule_pkey (PRIMARY KEY)
     - accounting_matchingrule_tenant_name_unique
     - accounting_matchingrule_tenant_is_active_idx
     - accounting_matchingrule_bank_account_is_active_idx

5. Run tests (if available):
   $ python manage.py test apps.accounting.tests.test_matching
```

### Expected Outcome
- Migration file created and applied successfully
- Database table `accounting_matchingrule` exists
- All fields, indexes, and constraints in place
- Model accessible and functional in Django shell
- Ready for MatchingEngine service implementation

### Verification Checklist
- [ ] All model fields complete (Tasks 38-41)
- [ ] Model imported in __init__.py
- [ ] Migration file created (makemigrations)
- [ ] Migration file reviewed
- [ ] Migration applied (migrate)
- [ ] Table exists in database
- [ ] All columns present
- [ ] Indexes created
- [ ] Unique constraint (tenant, name) exists
- [ ] Foreign key constraints exist
- [ ] Model accessible in Django shell
- [ ] Basic model operations tested
- [ ] Documentation updated

---

## Summary

This document established the MatchingRule model for configurable transaction reconciliation:

### Completed Infrastructure
- ✅ MatchingRule model with tenant awareness
- ✅ Rule name field for clear identification
- ✅ Priority-based rule ordering (1-100)
- ✅ Amount tolerance configuration (decimal precision)
- ✅ Date range flexibility (±N days)
- ✅ Reference matching flag
- ✅ Description pattern matching (regex)
- ✅ Pattern flags for regex behavior
- ✅ Rule activation control (is_active)
- ✅ Bank account association (optional global rules)
- ✅ Created_by audit trail
- ✅ Database migrations applied

### Key Achievements
1. **Flexible Matching Configuration** - Multiple criteria types
2. **Priority System** - Rule execution ordering
3. **Pattern Matching** - Regex-based intelligent matching
4. **Sri Lanka Context** - Examples for local banking and vendors
5. **Validation** - Pattern validation and logical constraints
6. **Performance** - Compiled pattern caching
7. **Audit Trail** - Creator tracking and timestamps

### Matching Rule Capabilities

```
Rule Configuration Matrix
═════════════════════════

┌────────────────┬─────────────┬─────────────┬──────────────┐
│   Match Type   │  Priority   │  Tolerance  │   Use Case   │
├────────────────┼─────────────┼─────────────┼──────────────┤
│ Exact Ref      │    1-5      │  0.00 / 0d  │ Checks       │
│ Exact Amount   │    6-15     │  0.00 / 0d  │ Wires        │
│ Fuzzy Amount   │   16-30     │  ±10 / ±3d  │ Regular      │
│ Pattern        │   31-50     │  ±50 / ±7d  │ Vendors      │
│ Broad          │   51-100    │ Wide/Wide   │ Suggestions  │
└────────────────┴─────────────┴─────────────┴──────────────┘
```

### Next Steps
Proceed to [03_Tasks-43-48_MatchingEngine-Service.md](03_Tasks-43-48_MatchingEngine-Service.md) to implement the MatchingEngine service that uses these rules to perform actual transaction matching with multiple strategies including exact match, fuzzy match, reference match, batch auto-matching, and match suggestions.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~950
