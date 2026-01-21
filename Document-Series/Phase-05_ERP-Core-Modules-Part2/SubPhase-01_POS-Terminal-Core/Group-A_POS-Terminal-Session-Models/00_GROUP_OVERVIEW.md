# Group A: POS Terminal & Session Models

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create terminal configuration and shift management models

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Cart & Line Item Management](../Group-B_Cart-Line-Item-Management/)

---

## Group Overview

### Key Outcomes

1. **POS App Structure** - Initialize `apps/pos/` module with proper configuration
2. **Terminal Submodule** - Organized `apps/pos/terminal/` package structure
3. **Terminal Status Constants** - ACTIVE, INACTIVE, MAINTENANCE, OFFLINE
4. **Session Status Constants** - OPEN, CLOSED, SUSPENDED, FORCE_CLOSED
5. **POSTerminal Model** - Terminal configuration with warehouse link
6. **Hardware Fields** - Printer type, receipt printer IP, cash drawer settings
7. **Terminal Settings** - Default tax, price override, customer requirements
8. **POSSession Model** - Shift management with timing and cash tracking
9. **Session Methods** - open_session and close_session with validations
10. **POS Admin** - Admin for Terminal and Session management

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | POSTerminal and POSSession models |
| PostgreSQL | Indexes on terminal code, unique constraints |
| Django Admin | Terminal and session management UI |
| Model Methods | Session open/close business logic |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-05_POS-App-Terminal-Model.md` | 01-05 | POS app structure, terminal submodule, constants, POSTerminal model |
| 02 | `02_Tasks-06-10_Terminal-Fields-Meta.md` | 06-10 | Hardware, location, settings, receipt template, Meta class |
| 03 | `03_Tasks-11-15_Session-Model-Fields.md` | 11-15 | POSSession model, timing, opening/closing cash, totals |
| 04 | `04_Tasks-16-18_Session-Methods-Admin.md` | 16-18 | open_session, close_session methods, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create POS app structure | Low | 15 min |
| 02 | Create terminal submodule | Low | 10 min |
| 03 | Define terminal status constants | Low | 10 min |
| 04 | Define session status constants | Low | 10 min |
| 05 | Create POSTerminal model | Medium | 30 min |
| 06 | Add terminal hardware fields | Medium | 20 min |
| 07 | Add terminal location fields | Low | 15 min |
| 08 | Add terminal settings | Medium | 20 min |
| 09 | Add receipt template FK | Low | 15 min |
| 10 | Create POSTerminal Meta class | Low | 15 min |
| 11 | Create POSSession model | Medium | 30 min |
| 12 | Add session timing fields | Low | 15 min |
| 13 | Add opening cash field | Low | 15 min |
| 14 | Add closing cash fields | Medium | 20 min |
| 15 | Add session totals | Medium | 20 min |
| 16 | Create open_session method | Medium | 25 min |
| 17 | Create close_session method | High | 30 min |
| 18 | Create POS admin | Medium | 25 min |

---

## Execution Order

```
[Tasks 01-02: POS app and terminal submodule]
         │
         ▼
[Tasks 03-04: Terminal and session status constants]
         │
         ▼
[Tasks 05-10: POSTerminal model with all fields]
         │
         ▼
[Tasks 11-15: POSSession model with timing and cash fields]
         │
         ▼
[Tasks 16-17: Session open/close methods]
         │
         ▼
[Task 18: Admin interface]
```

---

## Expected Deliverables

```
apps/pos/
├── __init__.py
├── apps.py
├── terminal/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pos_terminal.py       # Tasks 05-10
│   │   └── pos_session.py        # Tasks 11-17
│   └── admin.py                  # Task 18
└── constants.py                  # Tasks 03-04
```

---

## Notes for AI Agents

### Terminal Status
- **ACTIVE**: Terminal is operational and available for use
- **INACTIVE**: Terminal is disabled, cannot be used
- **MAINTENANCE**: Terminal under maintenance
- **OFFLINE**: Terminal is offline (for offline mode support)

### Session Status
- **OPEN**: Active shift, transactions allowed
- **CLOSED**: Shift ended normally with reconciliation
- **SUSPENDED**: Shift temporarily paused
- **FORCE_CLOSED**: Shift closed without reconciliation (error recovery)

### POSTerminal Fields
- name: Display name (e.g., "Checkout 1")
- code: Unique code (e.g., "T01")
- warehouse FK: Link to warehouse for stock operations
- printer_type: THERMAL, IMPACT, NONE
- receipt_printer_ip: IP address for network printer
- cash_drawer_enabled: Boolean for cash drawer operations
- default_tax FK: Default tax rate for terminal
- allow_price_override: Allow cashiers to change prices
- require_customer: Require customer for transactions

### POSSession Fields
- terminal FK: Link to POSTerminal
- user FK: Cashier who opened the shift
- status: Session status
- opened_at: Auto-set on open
- closed_at: Set on close
- opening_cash_amount: Cash at shift start
- expected_cash: Calculated expected cash at close
- actual_cash_amount: Counted cash at close
- cash_variance: actual - expected
- total_sales, total_refunds, transaction_count

### Cash Variance Calculation
```
expected_cash = opening_cash + cash_sales - cash_refunds
variance = actual_cash - expected_cash
```

### Dependencies
- Phase-04: Warehouse for stock operations
- Phase-03: User authentication for session user
