# Group C: Matching Engine

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** C of F  
> **Tasks Covered:** 31-48  
> **Group Goal:** Implement OFX importer, matching rules model, and transaction matching engine with multiple strategies

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Statement-Import](../Group-B_Statement-Import/)
- **→ Next Group:** [Group-D_Reconciliation-Workflow](../Group-D_Reconciliation-Workflow/)

---

## Group Overview

This group implements the matching engine for reconciliation. Creates OFX importer for standard banking format, adds match status tracking to statement lines, and builds the MatchingRule model for configurable matching criteria. The MatchingEngine service provides multiple matching strategies: exact match, fuzzy match with tolerance, reference-based matching, batch auto-matching, and match suggestions.

### Key Outcomes

- OFX importer service for standard bank format
- Statement parser factory for format selection
- Configurable CSV column mapping
- MatchStatus enum (UNMATCHED, MATCHED, PARTIAL, EXCLUDED)
- Match status field on StatementLine
- Matched journal entry FK on StatementLine
- MatchingRule model with priority and criteria
- Amount tolerance and date range configuration
- Description pattern regex matching
- MatchingEngine service with matching strategies
- Exact, fuzzy, and reference matching methods
- Batch auto-match for all unmatched lines
- Match suggestion method for manual review

### Technology Context

- **OFX Parsing:** ofxparse library for OFX format
- **Pattern Matching:** Python regex for description patterns
- **Tolerance:** Configurable amount/date tolerance
- **Factory Pattern:** Parser factory for format abstraction

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-37_OFX-Importer-Match-Fields.md` | Create OFX importer, parser factory, and add match fields to lines | 31-37 |
| 02 | `02_Tasks-38-42_MatchingRule-Model.md` | Create MatchingRule model with criteria configuration | 38-42 |
| 03 | `03_Tasks-43-48_MatchingEngine-Service.md` | Implement MatchingEngine with all matching strategies | 43-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create OFX Importer Service | Medium | Task 30 |
| 32 | Create Statement Parser Factory | Low | Task 31 |
| 33 | Add Column Mapping Config | Medium | Task 32 |
| 34 | Define MatchStatus Enum | Low | Task 33 |
| 35 | Add Line Match Status | Low | Task 34 |
| 36 | Add Line Matched Entry FK | Low | Task 35 |
| 37 | Run Match Fields Migrations | Low | Task 36 |
| 38 | Create MatchingRule Model | Medium | Task 37 |
| 39 | Add Rule Name Field | Low | Task 38 |
| 40 | Add Rule Match Criteria | Low | Task 38 |
| 41 | Add Rule Pattern Match | Low | Task 38 |
| 42 | Run MatchingRule Migrations | Low | Task 41 |
| 43 | Create MatchingEngine Service | High | Task 42 |
| 44 | Add Exact Match Method | Medium | Task 43 |
| 45 | Add Fuzzy Match Method | Medium | Task 44 |
| 46 | Add Reference Match Method | Medium | Task 45 |
| 47 | Add Auto-Match Batch Method | High | Task 46 |
| 48 | Add Match Suggestion Method | Medium | Task 47 |

---

## Execution Order

```
Task 31: Create OFX Importer
    │
    ▼
Task 32: Create Parser Factory
    │
    ▼
Task 33: Add Column Mapping Config
    │
    ▼
Task 34: Define MatchStatus Enum
    │
    ▼
Tasks 35-36: Add Match Fields to StatementLine
    │
    ▼
Task 37: Run Migrations
    │
    ▼
Task 38: Create MatchingRule Model
    │
    ├─────────────────────────────┐
    ▼                             ▼
Tasks 39-40: Rule Fields    Task 41: Pattern Match
    │                             │
    └─────────────┬───────────────┘
                  ▼
             Task 42: Run Migrations
                  │
                  ▼
             Task 43: Create MatchingEngine
                  │
                  ▼
             Task 44: Exact Match
                  │
                  ▼
             Task 45: Fuzzy Match
                  │
                  ▼
             Task 46: Reference Match
                  │
                  ▼
             Task 47: Auto-Match Batch
                  │
                  ▼
             Task 48: Match Suggestions
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   ├── enums.py              # Add MatchStatus enum
│   ├── statement_line.py     # Update with match fields
│   └── matching_rule.py      # MatchingRule model
├── services/
│   └── importers/
│       ├── __init__.py
│       ├── base.py
│       ├── csv_importer.py
│       ├── ofx_importer.py   # OFX parser
│       └── factory.py        # Parser factory
│   └── matching_engine.py    # Matching logic service
├── migrations/
│   ├── 0013_match_fields.py
│   └── 0014_matchingrule.py
└── tests/
    └── test_matching.py      # Matching engine tests
```

---

## Notes for AI Agents

### Match Status Values
- UNMATCHED: Not yet matched to any book entry
- MATCHED: Successfully matched to journal entry
- PARTIAL: Partially matched (split transaction)
- EXCLUDED: Explicitly excluded from reconciliation

### Matching Rule Criteria
- priority: Integer for rule ordering (lower = higher priority)
- amount_tolerance: Decimal tolerance (e.g., 0.01 for exact, 5.00 for small variance)
- date_range_days: Days tolerance for date matching (e.g., 3 for ±3 days)
- description_pattern: Regex pattern for description matching
- is_active: Enable/disable rule

### Matching Strategies

**Exact Match:**
- Amount: Exact match
- Date: Same date
- Use when: Most transactions

**Fuzzy Match:**
- Amount: Within tolerance
- Date: Within date range
- Use when: Timing differences

**Reference Match:**
- Reference: Exact match on check number or reference ID
- Amount: Exact match
- Date: Within date range
- Use when: Check reconciliation

### Auto-Match Algorithm
1. Get all unmatched statement lines
2. Get all unreconciled journal entries for the bank account
3. For each statement line:
   a. Apply rules in priority order
   b. First match wins
   c. Mark both as matched if found
4. Return match results

### Match Suggestion Logic
For unmatched lines, find potential matches:
1. Query entries with similar amounts (within tolerance)
2. Query entries within date range
3. Rank by match quality score
4. Return top N suggestions per line
