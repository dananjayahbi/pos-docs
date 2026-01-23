# Tasks 16-18: Session Methods & Admin

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** A - POS Terminal & Session Models  
> **Document:** 04 of 04  
> **Tasks Covered:** 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-11-15_Session-Model-Fields.md](03_Tasks-11-15_Session-Model-Fields.md)
- **→ Next Group:** [../Group-B_Cart-Line-Item-Management/](../Group-B_Cart-Line-Item-Management/)

---

## Document Overview

This document covers the implementation of critical business logic methods for session management and the Django admin interface for POS terminal and session management. The methods handle session lifecycle (opening and closing), while the admin provides the UI for configuration and monitoring.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 16 | Create open_session method | Medium |
| 17 | Create close_session method | High |
| 18 | Create POS admin | Medium |

---

## Task 16: Create open_session method

### Overview
Create the `open_session` method on the POSSession model that handles the business logic for opening a new shift. This method validates that no session is currently open on the terminal and initializes the session with proper timing and opening cash amounts.

### Dependencies
- Task 15: Add session totals

### Instructions

1. **Define method signature**
   - Create `open_session` as a model method (not a classmethod)
   - No additional parameters required (uses instance data)
   - Should be called on a session instance that is not yet persisted

2. **Add validation: Check terminal status**
   - Verify that the associated terminal status is 'ACTIVE'
   - Raise ValidationError if terminal is INACTIVE, MAINTENANCE, or OFFLINE
   - Error message: "Cannot open session. Terminal is {status}"

3. **Add validation: Check for existing open session**
   - Query for any existing session on this terminal with status OPEN
   - Raise ValidationError if an open session exists
   - Error message: "Terminal already has an open session"
   - Consider SUSPENDED sessions in this check (cannot open if suspended session exists)

4. **Set session status**
   - Set the session status to OPEN
   - This marks the session as active

5. **Set opening timestamp**
   - Set `opened_at` to the current timezone-aware datetime
   - Use Django's `timezone.now()` for consistency

6. **Validate opening cash amount**
   - Ensure `opening_cash_amount` is set (not None)
   - Raise ValidationError if not set
   - Error message: "Opening cash amount is required"
   - Ensure opening cash is >= 0

7. **Initialize totals to zero**
   - Set `total_sales` to Decimal('0.00')
   - Set `total_refunds` to Decimal('0.00')
   - Set `transaction_count` to 0
   - These will be updated as transactions occur

8. **Save the session**
   - Call `self.save()` to persist the changes
   - Use `update_fields` for efficiency if desired

9. **Log session opening (optional)**
   - Create an audit log entry for session opening
   - Include user, terminal, timestamp
   - This provides audit trail for compliance

10. **Return the session instance**
    - Return `self` for method chaining
    - Allows calling code to use the updated session

### Session Opening Flow Diagram

```
┌─────────────────────────────────────────┐
│  Cashier initiates session open         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Create POSSession instance              │
│  - terminal = selected_terminal          │
│  - user = current_user                   │
│  - opening_cash_amount = float_amount    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Call session.open_session()             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Validation: Is terminal ACTIVE?         │
└──────┬───────────────────┬──────────────┘
       │ No                │ Yes
       ▼                   ▼
   ┌───────┐      ┌────────────────────────┐
   │ Raise │      │ Check existing session │
   │ Error │      └──────┬─────────────────┘
   └───────┘             │
                         ▼
              ┌──────────────────────────┐
              │ Existing OPEN session?   │
              └──┬────────────────┬──────┘
                 │ Yes            │ No
                 ▼                ▼
             ┌───────┐   ┌────────────────────┐
             │ Raise │   │ Set status = OPEN  │
             │ Error │   │ Set opened_at      │
             └───────┘   │ Initialize totals  │
                         │ Save session       │
                         └────────┬───────────┘
                                  │
                                  ▼
                         ┌────────────────────┐
                         │ Return session     │
                         │ Session is OPEN    │
                         └────────────────────┘
```

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| Terminal Status | `terminal.status == 'ACTIVE'` | "Cannot open session. Terminal is {status}" |
| No Open Session | No session with `status='OPEN'` | "Terminal already has an open session" |
| Opening Cash Set | `opening_cash_amount is not None` | "Opening cash amount is required" |
| Cash Non-Negative | `opening_cash_amount >= 0` | "Opening cash cannot be negative" |

### Expected Behavior

**Before calling `open_session()`:**
```python
session = POSSession(
    terminal=terminal_instance,
    user=current_user,
    opening_cash_amount=Decimal('500.00')
)
# session is not yet saved
# status is None or blank
# opened_at is None
```

**After calling `open_session()`:**
```python
session.open_session()
# session.status == 'OPEN'
# session.opened_at == timezone.now()
# session.total_sales == Decimal('0.00')
# session.total_refunds == Decimal('0.00')
# session.transaction_count == 0
# session is saved to database
```

### Error Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Terminal is INACTIVE | Raise ValidationError |
| Terminal has open session | Raise ValidationError |
| opening_cash_amount not set | Raise ValidationError |
| opening_cash_amount negative | Raise ValidationError |
| All validations pass | Session saved with OPEN status |

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py
class POSSession(TenantAwareModel):
    # ... existing fields ...
    
    def open_session(self):
        """
        Opens the session after validating terminal status and ensuring
        no other session is open on this terminal.
        """
        # Validation and initialization logic
        # Sets status to OPEN, opened_at, initializes totals
        # Saves the session
        return self
```

### Verification Checklist
- [ ] `open_session` method exists in POSSession model
- [ ] Terminal status is validated (must be ACTIVE)
- [ ] Check for existing open session on terminal
- [ ] Session status set to OPEN
- [ ] `opened_at` timestamp set to current time
- [ ] Opening cash amount is validated (not None, >= 0)
- [ ] Totals initialized to zero
- [ ] Session is saved to database
- [ ] Method returns self
- [ ] ValidationError raised for invalid conditions

---

## Task 17: Create close_session method

### Overview
Create the `close_session` method that handles the business logic for closing a shift. This is a more complex operation that involves cash reconciliation, variance calculation, sales totals validation, and proper audit logging. The method ensures financial accuracy and provides a complete accounting of the shift.

### Dependencies
- Task 16: Create open_session method

### Instructions

1. **Define method signature**
   - Create `close_session` as a model method
   - Accept `actual_cash_amount` as a required parameter (Decimal)
   - Accept optional `notes` parameter for reconciliation notes
   - Should be called on an existing OPEN session instance

2. **Add validation: Session must be OPEN**
   - Verify that session status is OPEN
   - Raise ValidationError if status is not OPEN
   - Error message: "Only open sessions can be closed"
   - Cannot close sessions that are already CLOSED or FORCE_CLOSED

3. **Add validation: Actual cash amount**
   - Ensure `actual_cash_amount` is provided and not None
   - Raise ValidationError if not provided
   - Error message: "Actual cash amount is required to close session"
   - Ensure actual cash is >= 0

4. **Calculate expected cash amount**
   - Formula: `expected_cash = opening_cash_amount + cash_sales - cash_refunds`
   - For now, use total_sales and total_refunds as proxies
   - Later phases will track cash vs card sales separately
   - Set `expected_cash` field to this calculated value

5. **Set actual cash amount**
   - Assign the provided `actual_cash_amount` parameter to the field
   - This represents the counted cash in the drawer

6. **Calculate cash variance**
   - Formula: `cash_variance = actual_cash_amount - expected_cash`
   - Positive variance: more cash than expected (overage)
   - Negative variance: less cash than expected (shortage)
   - Set `cash_variance` field to this calculated value

7. **Set closing timestamp**
   - Set `closed_at` to the current timezone-aware datetime
   - Use Django's `timezone.now()`

8. **Set session status to CLOSED**
   - Change status from OPEN to CLOSED
   - This marks the session as completed normally

9. **Calculate session duration (optional)**
   - Duration = `closed_at - opened_at`
   - Can be stored or logged for reporting
   - Useful for labor cost analysis

10. **Validate variance threshold (optional)**
    - Check if variance exceeds acceptable threshold
    - Trigger warning or flag for manager review if exceeded
    - Threshold could be terminal setting or global config

11. **Create reconciliation record (optional)**
    - Store detailed reconciliation data
    - Payment method breakdown
    - Transaction counts by type
    - This supports detailed financial reporting

12. **Save the session**
    - Call `self.save()` to persist all changes
    - Use `update_fields` for efficiency if desired

13. **Log session closure**
    - Create audit log entry for session closure
    - Include variance amount, user, timestamp
    - Critical for financial audit trail

14. **Return the closed session**
    - Return `self` for method chaining
    - Allows calling code to access variance and totals

### Session Closing Flow Diagram

```
┌────────────────────────────────────────────┐
│  Cashier initiates session close           │
│  - Counts cash in drawer                    │
│  - Enters actual cash amount                │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│  Call session.close_session(               │
│      actual_cash_amount=counted_amount     │
│  )                                          │
└──────────────┬─────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────┐
│  Validation: Is session OPEN?               │
└──────┬──────────────────────┬──────────────┘
       │ No                   │ Yes
       ▼                      ▼
   ┌───────┐      ┌───────────────────────────┐
   │ Raise │      │ Validate actual_cash_amount│
   │ Error │      └────────┬──────────────────┘
   └───────┘               │
                           ▼
              ┌────────────────────────────────┐
              │ Calculate expected_cash         │
              │ = opening_cash + sales - refunds│
              └────────┬───────────────────────┘
                       │
                       ▼
              ┌────────────────────────────────┐
              │ Set actual_cash_amount          │
              └────────┬───────────────────────┘
                       │
                       ▼
              ┌────────────────────────────────┐
              │ Calculate cash_variance         │
              │ = actual_cash - expected_cash   │
              └────────┬───────────────────────┘
                       │
                       ▼
              ┌────────────────────────────────┐
              │ Check variance threshold        │
              └──┬─────────────────────┬───────┘
                 │ Exceeds             │ OK
                 ▼                     ▼
         ┌────────────────┐   ┌────────────────┐
         │ Flag for review│   │ Proceed        │
         │ (optional)     │   │                │
         └────────┬───────┘   └────┬───────────┘
                  │                │
                  └────────┬───────┘
                           │
                           ▼
              ┌────────────────────────────────┐
              │ Set closed_at = now()           │
              │ Set status = CLOSED             │
              │ Save session                    │
              │ Create audit log                │
              └────────┬───────────────────────┘
                       │
                       ▼
              ┌────────────────────────────────┐
              │ Return session                  │
              │ Session is CLOSED               │
              └────────────────────────────────┘
```

### Cash Reconciliation Calculation

```
┌──────────────────────────────────────────────┐
│           CASH RECONCILIATION                 │
├──────────────────────────────────────────────┤
│                                               │
│  Opening Cash:         ₨ 500.00              │
│                                               │
│  Cash Sales:         + ₨ 12,450.00           │
│  Cash Refunds:       - ₨   250.00            │
│                        ──────────             │
│  Expected Cash:        ₨ 12,700.00           │
│                                               │
│  Actual Cash Counted:  ₨ 12,650.00           │
│                        ──────────             │
│  Variance (Short):     ₨  (50.00)            │
│                                               │
├──────────────────────────────────────────────┤
│  Total Sales:          ₨ 15,800.00           │
│  Total Refunds:        ₨   320.00            │
│  Transaction Count:         147              │
│                                               │
│  Session Duration:     8h 32m                │
│                                               │
└──────────────────────────────────────────────┘
```

### Variance Scenarios

| Scenario | Opening | Sales | Refunds | Expected | Actual | Variance | Status |
|----------|---------|-------|---------|----------|--------|----------|--------|
| **Perfect Match** | 500 | 10,000 | 200 | 10,300 | 10,300 | 0 | ✓ Balanced |
| **Overage** | 500 | 10,000 | 200 | 10,300 | 10,350 | +50 | ⚠ Over |
| **Shortage** | 500 | 10,000 | 200 | 10,300 | 10,280 | -20 | ⚠ Short |
| **Major Shortage** | 500 | 10,000 | 200 | 10,300 | 10,100 | -200 | ❌ Review |

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| Session Status | `status == 'OPEN'` | "Only open sessions can be closed" |
| Actual Cash Provided | `actual_cash_amount is not None` | "Actual cash amount is required to close session" |
| Cash Non-Negative | `actual_cash_amount >= 0` | "Actual cash cannot be negative" |
| Session Has Timestamp | `opened_at is not None` | "Session must have valid opened_at timestamp" |

### Expected Behavior

**Before calling `close_session()`:**
```python
session.status == 'OPEN'
session.opened_at == datetime(2026, 1, 23, 8, 0, 0)
session.closed_at == None
session.opening_cash_amount == Decimal('500.00')
session.total_sales == Decimal('12450.00')
session.total_refunds == Decimal('250.00')
session.expected_cash == None
session.actual_cash_amount == None
session.cash_variance == None
```

**After calling `close_session(actual_cash_amount=Decimal('12650.00'))`:**
```python
session.status == 'CLOSED'
session.closed_at == datetime(2026, 1, 23, 16, 32, 0)
session.expected_cash == Decimal('12700.00')  # 500 + 12450 - 250
session.actual_cash_amount == Decimal('12650.00')
session.cash_variance == Decimal('-50.00')  # Short by 50
# session is saved to database
# audit log created
```

### Variance Threshold Configuration

| Threshold Level | Variance Amount | Action Required |
|----------------|-----------------|------------------|
| **Acceptable** | ₨ 0 - 50 | No action needed |
| **Minor** | ₨ 51 - 200 | Note in system |
| **Moderate** | ₨ 201 - 500 | Supervisor review |
| **Major** | > ₨ 500 | Manager approval required |

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_session.py
class POSSession(TenantAwareModel):
    # ... existing fields and open_session method ...
    
    def close_session(self, actual_cash_amount, notes=None):
        """
        Closes the session, performs cash reconciliation, and calculates variance.
        
        Args:
            actual_cash_amount: Counted cash in drawer
            notes: Optional reconciliation notes
            
        Returns:
            self: The closed session instance
            
        Raises:
            ValidationError: If session is not open or validation fails
        """
        # Validation
        # Calculate expected cash
        # Calculate variance
        # Set closing timestamp and status
        # Save and log
        return self
```

### Verification Checklist
- [ ] `close_session` method exists in POSSession model
- [ ] Method accepts `actual_cash_amount` parameter
- [ ] Session status validated (must be OPEN)
- [ ] Actual cash amount validated (not None, >= 0)
- [ ] Expected cash calculated correctly
- [ ] Cash variance calculated correctly
- [ ] `closed_at` timestamp set to current time
- [ ] Session status set to CLOSED
- [ ] Session saved to database
- [ ] Audit log created for closure
- [ ] Method returns self
- [ ] Variance threshold check implemented (optional)

---

## Task 18: Create POS admin

### Overview
Create Django admin interfaces for the POSTerminal and POSSession models. The admin provides a user-friendly UI for configuring terminals, monitoring sessions, and reviewing cash reconciliation reports. This is essential for managers and administrators who need to manage the POS system.

### Dependencies
- Task 17: Create close_session method

### Instructions

1. **Create admin file**
   - Create `admin.py` in `apps/pos/terminal/`
   - This file will contain admin classes for terminal models

2. **Import required modules**
   - Import Django admin classes
   - Import POSTerminal and POSSession models
   - Import any custom admin widgets or forms if needed

3. **Create POSTerminalAdmin class**
   - Inherit from `admin.ModelAdmin`
   - This provides the admin interface for POSTerminal

4. **Configure POSTerminalAdmin list display**
   - Show columns: name, code, status, warehouse, printer_type
   - Include is_active if using soft delete
   - Show created_at for reference

5. **Configure POSTerminalAdmin list filters**
   - Filter by status (ACTIVE, INACTIVE, MAINTENANCE, OFFLINE)
   - Filter by warehouse
   - Filter by printer_type
   - Filter by cash_drawer_enabled

6. **Configure POSTerminalAdmin search fields**
   - Enable search by name
   - Enable search by code
   - Include warehouse__name for cross-model search

7. **Configure POSTerminalAdmin fieldsets**
   - **Basic Information:** name, code, status, warehouse
   - **Hardware Configuration:** printer_type, receipt_printer_ip, cash_drawer_enabled
   - **Location:** store_location, floor_location, physical_location_notes
   - **Settings:** default_tax, allow_price_override, allow_discount, require_customer, allow_credit_sales
   - **Receipt:** receipt_template (if FK), receipt_header, receipt_footer
   - **Metadata:** created_at, updated_at (readonly)

8. **Configure POSTerminalAdmin readonly fields**
   - created_at (readonly)
   - updated_at (readonly)
   - Any other audit fields

9. **Add POSTerminalAdmin inline actions (optional)**
   - Action to activate terminal (set status to ACTIVE)
   - Action to deactivate terminal (set status to INACTIVE)
   - Action to set maintenance mode

10. **Create POSSessionAdmin class**
    - Inherit from `admin.ModelAdmin`
    - This provides the admin interface for POSSession

11. **Configure POSSessionAdmin list display**
    - Show columns: terminal, user, status, opened_at, closed_at
    - Include total_sales, cash_variance
    - Show transaction_count

12. **Configure POSSessionAdmin list filters**
    - Filter by status (OPEN, CLOSED, SUSPENDED, FORCE_CLOSED)
    - Filter by terminal
    - Filter by user (cashier)
    - Filter by opened_at date (date hierarchy or filter)

13. **Configure POSSessionAdmin search fields**
    - Enable search by terminal__name
    - Enable search by terminal__code
    - Enable search by user__username or user__email

14. **Configure POSSessionAdmin fieldsets**
    - **Session Information:** terminal, user, status
    - **Timing:** opened_at, closed_at, duration (readonly calculated)
    - **Cash Reconciliation:** opening_cash_amount, expected_cash, actual_cash_amount, cash_variance
    - **Sales Totals:** total_sales, total_refunds, transaction_count
    - **Notes:** reconciliation notes or other fields

15. **Configure POSSessionAdmin readonly fields**
    - opened_at (readonly after creation)
    - closed_at (readonly)
    - expected_cash (calculated)
    - cash_variance (calculated)
    - total_sales (updated by transactions)
    - total_refunds (updated by transactions)
    - transaction_count (updated by transactions)

16. **Add custom display methods**
    - Method to show session duration (closed_at - opened_at)
    - Method to show variance status with colored indicator
    - Method to format currency values properly (₨)

17. **Configure date hierarchy**
    - Add date_hierarchy on opened_at for POSSessionAdmin
    - Allows easy browsing by date

18. **Add custom admin actions**
    - Action to force-close sessions (sets status to FORCE_CLOSED)
    - Action to export session report to CSV
    - Action to print reconciliation report

19. **Register models with admin**
    - Register POSTerminal with POSTerminalAdmin
    - Register POSSession with POSSessionAdmin

20. **Test admin interface**
    - Verify all fields display correctly
    - Test filters and search
    - Test actions

### Admin Interface Structure

```
Django Admin
├── POS
│   ├── POS Terminals
│   │   ├── List View
│   │   │   ├── Columns: Name, Code, Status, Warehouse, Printer
│   │   │   ├── Filters: Status, Warehouse, Printer Type
│   │   │   └── Search: Name, Code
│   │   └── Detail View
│   │       ├── Basic Information
│   │       ├── Hardware Configuration
│   │       ├── Location
│   │       ├── Settings
│   │       └── Receipt Configuration
│   └── POS Sessions
│       ├── List View
│       │   ├── Columns: Terminal, User, Status, Opened, Closed, Sales, Variance
│       │   ├── Filters: Status, Terminal, User, Date
│       │   └── Search: Terminal, User
│       └── Detail View
│           ├── Session Information
│           ├── Timing
│           ├── Cash Reconciliation
│           └── Sales Totals
```

### POSTerminalAdmin List View

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| **Name** | name | Yes | Terminal display name |
| **Code** | code | Yes | Unique terminal code |
| **Status** | status | Yes | Colored badge |
| **Warehouse** | warehouse.name | Yes | Linked warehouse |
| **Printer** | printer_type | Yes | Printer type |
| **Created** | created_at | Yes | Date format |

### POSSessionAdmin List View

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| **Terminal** | terminal.name | Yes | Link to terminal |
| **User** | user.username | Yes | Cashier name |
| **Status** | status | Yes | Colored badge |
| **Opened** | opened_at | Yes | Date & time |
| **Closed** | closed_at | Yes | Date & time or "-" |
| **Sales** | total_sales | Yes | Currency format |
| **Variance** | cash_variance | Yes | Colored +/- |
| **Txns** | transaction_count | Yes | Count |

### Status Color Coding

| Status | Color | Display |
|--------|-------|---------|
| **ACTIVE** (Terminal) | Green | 🟢 Active |
| **INACTIVE** (Terminal) | Gray | ⚫ Inactive |
| **MAINTENANCE** (Terminal) | Yellow | 🟡 Maintenance |
| **OFFLINE** (Terminal) | Red | 🔴 Offline |
| **OPEN** (Session) | Green | 🟢 Open |
| **CLOSED** (Session) | Blue | 🔵 Closed |
| **SUSPENDED** (Session) | Yellow | 🟡 Suspended |
| **FORCE_CLOSED** (Session) | Red | 🔴 Force Closed |

### Variance Display Logic

| Variance | Display | Color |
|----------|---------|-------|
| Positive (> 0) | +₨ 50.00 | Green |
| Zero (= 0) | ₨ 0.00 | Black |
| Negative (< 0) | -₨ 50.00 | Red |
| > Threshold | -₨ 250.00 ⚠ | Red + Warning |

### Custom Display Methods Example Structure

```python
# In POSSessionAdmin
def session_duration(self, obj):
    """Display the duration of the session."""
    # Calculate: closed_at - opened_at
    # Format: "8h 32m"
    # Return: Formatted string

def variance_display(self, obj):
    """Display variance with color coding."""
    # Check variance value
    # Return: HTML with color class
    
def currency_format(self, obj):
    """Format currency values with ₨ symbol."""
    # Format: ₨ 12,450.00
    # Return: Formatted string
```

### Expected Outcome
```
apps/pos/terminal/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── pos_terminal.py
│   └── pos_session.py
└── admin.py                   # Task 18
    ├── POSTerminalAdmin
    │   ├── list_display
    │   ├── list_filter
    │   ├── search_fields
    │   ├── fieldsets
    │   └── readonly_fields
    └── POSSessionAdmin
        ├── list_display
        ├── list_filter
        ├── search_fields
        ├── fieldsets
        ├── readonly_fields
        ├── custom methods
        └── date_hierarchy
```

### Verification Checklist
- [ ] `admin.py` file exists in `apps/pos/terminal/`
- [ ] POSTerminalAdmin class created
- [ ] POSTerminalAdmin list_display configured
- [ ] POSTerminalAdmin list_filter configured
- [ ] POSTerminalAdmin search_fields configured
- [ ] POSTerminalAdmin fieldsets organized logically
- [ ] POSSessionAdmin class created
- [ ] POSSessionAdmin list_display configured
- [ ] POSSessionAdmin list_filter configured
- [ ] POSSessionAdmin search_fields configured
- [ ] POSSessionAdmin fieldsets organized logically
- [ ] Readonly fields properly marked
- [ ] Custom display methods for duration and variance
- [ ] Date hierarchy on opened_at
- [ ] Both models registered with admin site
- [ ] Admin interface tested and functional

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 16 | Create open_session method | Session opening logic with validation |
| 17 | Create close_session method | Session closing with cash reconciliation |
| 18 | Create POS admin | Admin interface for terminals and sessions |

### Final Group A Directory Structure
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

### Key Methods Implemented

| Method | Purpose | Key Operations |
|--------|---------|----------------|
| **open_session()** | Start a new shift | Validate terminal, check for open session, set status to OPEN, initialize totals |
| **close_session()** | End shift with reconciliation | Calculate expected cash, compute variance, set status to CLOSED, audit log |

### Cash Reconciliation Formula

```
Expected Cash = Opening Cash + Cash Sales - Cash Refunds
Variance = Actual Cash - Expected Cash

If Variance > 0: Overage (more cash than expected)
If Variance < 0: Shortage (less cash than expected)
If Variance = 0: Balanced (perfect match)
```

### Admin Interface Features

| Feature | Terminal Admin | Session Admin |
|---------|----------------|---------------|
| **List View** | Name, code, status, warehouse | Terminal, user, status, dates, sales |
| **Filters** | Status, warehouse, printer | Status, terminal, user, date |
| **Search** | Name, code | Terminal, user |
| **Fieldsets** | Basic, Hardware, Location, Settings | Session, Timing, Reconciliation, Totals |
| **Custom Display** | Status badges | Duration, variance colors, currency |
| **Actions** | Activate/deactivate | Force-close, export report |

### Group A Completion

All 18 tasks in Group A are now complete. The system now has:
- ✅ POS app and terminal submodule structure
- ✅ Terminal and session status constants
- ✅ POSTerminal model with hardware, location, and settings
- ✅ POSSession model with timing and cash tracking
- ✅ Session lifecycle methods (open and close)
- ✅ Admin interface for configuration and monitoring

### Next Steps
1. **Test the session workflow** by opening and closing a session
2. **Verify cash reconciliation calculations** with test data
3. Proceed to [../Group-B_Cart-Line-Item-Management/](../Group-B_Cart-Line-Item-Management/) to implement cart and line item functionality

---

## Notes for AI Agents

### Session Lifecycle States

```
[CREATED] ──open_session()──> [OPEN] ──close_session()──> [CLOSED]
                                  │
                                  │ (optional)
                                  ▼
                            [SUSPENDED] ──resume──> [OPEN]
                                  │
                                  │ (error recovery)
                                  ▼
                           [FORCE_CLOSED]
```

### Method Usage Pattern

```python
# Opening a session
session = POSSession(
    terminal=terminal,
    user=current_user,
    opening_cash_amount=Decimal('500.00')
)
session.open_session()  # Validates and saves

# During the shift
# Transactions update: total_sales, total_refunds, transaction_count

# Closing a session
actual_cash = Decimal('12650.00')  # Counted cash
session.close_session(actual_cash_amount=actual_cash)
# Returns closed session with variance calculated
```

### Validation Flow

1. **Open Session:**
   - Terminal must be ACTIVE
   - No other OPEN session on terminal
   - Opening cash must be set and >= 0

2. **Close Session:**
   - Session must be OPEN
   - Actual cash must be provided and >= 0
   - Calculates variance automatically

### Admin Usage

**For Managers:**
- Monitor all open sessions in real-time
- Review variance reports for closed sessions
- Investigate sessions with high variance
- Export reconciliation reports for accounting

**For System Admins:**
- Configure new terminals
- Set hardware and printer settings
- Manage terminal status (activate/deactivate)
- Force-close stuck sessions

### Security Considerations

1. **Session Access:** Only the cashier who opened the session or a manager should be able to close it
2. **Variance Alerts:** High variance should trigger notifications to managers
3. **Audit Trail:** All session open/close actions must be logged
4. **Force Close:** Should require manager approval and reason

### Future Enhancements

1. **Payment Method Breakdown:** Track cash vs. card sales separately
2. **Offline Mode:** Allow sessions to continue during network outages
3. **Multiple Currencies:** Support for foreign currency handling
4. **Shift Reports:** Automated reports emailed to managers
5. **Real-time Monitoring:** Dashboard showing all active sessions
6. **Variance Analysis:** ML-based anomaly detection for unusual patterns

### Testing Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Open session on ACTIVE terminal | Success, status = OPEN |
| Open session on INACTIVE terminal | ValidationError |
| Open session when one already open | ValidationError |
| Close session with exact cash | Variance = 0 |
| Close session with overage | Variance > 0 |
| Close session with shortage | Variance < 0 |
| Close session that's not open | ValidationError |
| Admin actions for terminal | Status updates correctly |
| Admin filters for sessions | Results filtered correctly |

### Integration Points

- **User Model (Phase-03):** Session.user FK for cashier tracking
- **Warehouse (Phase-04):** Terminal.warehouse FK for inventory operations
- **Tax Model:** Terminal.default_tax FK for tax calculations
- **Receipt Template:** Terminal.receipt_template FK for printing
- **Transactions (Next Groups):** Will update session totals
- **Payment Methods:** Will track cash vs. card breakdown
- **Audit Logging:** All session actions logged for compliance

### Performance Considerations

1. **Index on terminal + status:** Fast lookup for open sessions
2. **Index on opened_at:** Efficient date-based queries
3. **Use select_related:** When querying sessions with terminal/user
4. **Readonly fields in admin:** Prevent accidental edits to calculated fields

### Compliance & Audit

- All session open/close actions must be logged
- Variance beyond threshold requires manager review
- Session data must be retained for accounting periods (7 years)
- Reconciliation reports must be exportable for auditors
