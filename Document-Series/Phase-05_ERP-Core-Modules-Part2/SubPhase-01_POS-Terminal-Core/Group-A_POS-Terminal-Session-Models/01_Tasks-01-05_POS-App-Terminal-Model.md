# Tasks 01-05: POS App Structure & Terminal Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** A - POS Terminal & Session Models  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-10_Terminal-Fields-Meta.md](02_Tasks-06-10_Terminal-Fields-Meta.md)

---

## Document Overview

This document covers the initial setup of the POS Django app, terminal submodule structure, status constants definition, and the core POSTerminal model creation. These foundational elements establish the architecture for point-of-sale terminal management in the multi-tenant ERP system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create POS app structure | Low |
| 02 | Create terminal submodule | Low |
| 03 | Define terminal status constants | Low |
| 04 | Define session status constants | Low |
| 05 | Create POSTerminal model | Medium |

---

## Task 01: Create POS app structure

### Overview
Initialize the Point of Sale (POS) Django application with proper configuration. This app will handle all POS terminal operations, sessions, cart management, and transaction processing for the multi-tenant system.

### Dependencies
- Phase-03: Core backend infrastructure must be complete
- Database architecture from Phase-02 must be operational

### Instructions

1. **Create the POS application directory**
   - Navigate to `backend/apps/` directory
   - Create directory named `pos`

2. **Create the `__init__.py` file**
   - Create empty `__init__.py` file in `apps/pos/`
   - This makes the directory a Python package

3. **Create the `apps.py` configuration file**
   - Create `apps.py` in `apps/pos/`
   - Define `PosConfig` class inheriting from `AppConfig`
   - Set `default_auto_field` to `'django.db.models.BigAutoField'`
   - Set `name` to `'apps.pos'`
   - Set `verbose_name` to `'Point of Sale'`

4. **Register the app in Django settings**
   - Open `backend/config/settings/base.py`
   - Add `'apps.pos'` to the `INSTALLED_APPS` list
   - Place it after core apps but before external integrations

5. **Create models package structure**
   - Create `models/` directory inside `apps/pos/`
   - Create `__init__.py` in `models/` directory
   - This enables organized model separation

6. **Create admin configuration file**
   - Create `admin.py` in `apps/pos/`
   - Add necessary imports for admin registration

7. **Create views package (placeholder)**
   - Create `views/` directory inside `apps/pos/`
   - Create `__init__.py` in `views/` directory

8. **Create serializers package (placeholder)**
   - Create `serializers/` directory inside `apps/pos/`
   - Create `__init__.py` in `serializers/` directory

### Application Configuration Details

| Configuration | Value | Purpose |
|---------------|-------|---------|
| **App Name** | `apps.pos` | Full Python path for Django |
| **Verbose Name** | Point of Sale | Human-readable name in admin |
| **Auto Field** | BigAutoField | Primary key type for models |
| **Tenant Aware** | Yes | Uses django-tenants schema routing |

### Expected Outcome
```
backend/apps/pos/
├── __init__.py
├── apps.py
├── models/
│   └── __init__.py
├── views/
│   └── __init__.py
├── serializers/
│   └── __init__.py
└── admin.py
```

### Verification Checklist
- [ ] `apps/pos/` directory exists with `__init__.py`
- [ ] `apps.py` contains proper PosConfig class
- [ ] POS app is registered in `INSTALLED_APPS`
- [ ] `models/` package directory exists
- [ ] `admin.py` file exists
- [ ] `views/` and `serializers/` package directories exist

---

## Task 02: Create terminal submodule

### Overview
Create a dedicated submodule within the POS app for terminal-related models, separating terminal and session logic from cart and payment logic. This organization improves code maintainability and module clarity.

### Dependencies
- Task 01: Create POS app structure

### Instructions

1. **Create the terminal submodule directory**
   - Create `terminal/` directory inside `apps/pos/`
   - This submodule will contain terminal and session models

2. **Create the submodule `__init__.py`**
   - Create `__init__.py` in `apps/pos/terminal/`
   - Make it a Python package

3. **Create models package within terminal**
   - Create `models/` directory inside `apps/pos/terminal/`
   - Create `__init__.py` in `apps/pos/terminal/models/`

4. **Create admin file for terminal**
   - Create `admin.py` in `apps/pos/terminal/`
   - This will register terminal and session admin interfaces

5. **Create managers file (for future use)**
   - Create `managers.py` in `apps/pos/terminal/`
   - Will contain custom model managers for terminals and sessions

6. **Create utils file (for future use)**
   - Create `utils.py` in `apps/pos/terminal/`
   - Will contain terminal-related utility functions

### Submodule Organization Rationale

| Submodule | Purpose | Models |
|-----------|---------|--------|
| **terminal/** | Terminal & session management | POSTerminal, POSSession |
| **cart/** (future) | Shopping cart operations | POSCart, POSCartItem |
| **payment/** (future) | Payment processing | POSPayment, POSPaymentMethod |
| **transactions/** (future) | Transaction records | POSTransaction, POSReceipt |

### Expected Outcome
```
backend/apps/pos/
├── __init__.py
├── apps.py
├── terminal/
│   ├── __init__.py
│   ├── models/
│   │   └── __init__.py
│   ├── admin.py
│   ├── managers.py
│   └── utils.py
├── models/
│   └── __init__.py
├── views/
│   └── __init__.py
├── serializers/
│   └── __init__.py
└── admin.py
```

### Verification Checklist
- [ ] `apps/pos/terminal/` directory exists with `__init__.py`
- [ ] `apps/pos/terminal/models/` package exists
- [ ] `apps/pos/terminal/admin.py` file exists
- [ ] `apps/pos/terminal/managers.py` file exists
- [ ] `apps/pos/terminal/utils.py` file exists

---

## Task 03: Define terminal status constants

### Overview
Define constants for POS terminal status values. These constants ensure consistency across the codebase and make status management more maintainable by avoiding magic strings.

### Dependencies
- Task 01: Create POS app structure

### Instructions

1. **Create the constants file**
   - Create `constants.py` in `apps/pos/` directory
   - This file will contain all POS-related constants

2. **Add module docstring**
   - Add clear docstring explaining the file purpose
   - Mention it contains constants for POS module

3. **Define terminal status constants**
   - Create `TERMINAL_STATUS_CHOICES` tuple with status options
   - Include ACTIVE, INACTIVE, MAINTENANCE, OFFLINE statuses

4. **Add terminal status string constants**
   - Define `TERMINAL_STATUS_ACTIVE` = `'active'`
   - Define `TERMINAL_STATUS_INACTIVE` = `'inactive'`
   - Define `TERMINAL_STATUS_MAINTENANCE` = `'maintenance'`
   - Define `TERMINAL_STATUS_OFFLINE` = `'offline'`

5. **Add status documentation comments**
   - Document when each status should be used
   - Explain the implications of each status

### Terminal Status Definitions

| Status | Code | Description | Use Case |
|--------|------|-------------|----------|
| **ACTIVE** | `'active'` | Terminal operational and available | Normal operation, ready for transactions |
| **INACTIVE** | `'inactive'` | Terminal disabled by admin | Terminal temporarily or permanently disabled |
| **MAINTENANCE** | `'maintenance'` | Terminal under maintenance | Hardware issues, software updates, cleaning |
| **OFFLINE** | `'offline'` | Terminal offline mode active | Network issues, offline transaction support |

### Status Transition Rules

```
          ┌─────────────────┐
          │     ACTIVE      │ ◄──── Default operational state
          └────────┬────────┘
                   │
        ┌──────────┼──────────┬─────────────┐
        │          │          │             │
        ▼          ▼          ▼             ▼
   INACTIVE   MAINTENANCE  OFFLINE    (back to ACTIVE)
```

### Expected Outcome
```python
# In apps/pos/constants.py

TERMINAL_STATUS_ACTIVE = 'active'
TERMINAL_STATUS_INACTIVE = 'inactive'
TERMINAL_STATUS_MAINTENANCE = 'maintenance'
TERMINAL_STATUS_OFFLINE = 'offline'

TERMINAL_STATUS_CHOICES = (
    (TERMINAL_STATUS_ACTIVE, 'Active'),
    (TERMINAL_STATUS_INACTIVE, 'Inactive'),
    (TERMINAL_STATUS_MAINTENANCE, 'Maintenance'),
    (TERMINAL_STATUS_OFFLINE, 'Offline'),
)
```

### Verification Checklist
- [ ] `apps/pos/constants.py` file exists
- [ ] All four terminal status constants are defined
- [ ] `TERMINAL_STATUS_CHOICES` tuple is created
- [ ] Status definitions include display labels
- [ ] Comments explain each status purpose

---

## Task 04: Define session status constants

### Overview
Define constants for POS session (shift) status values. Sessions represent cashier shifts and need clear status tracking for proper accounting and audit trails.

### Dependencies
- Task 03: Define terminal status constants

### Instructions

1. **Open the constants file**
   - Open `apps/pos/constants.py` created in Task 03

2. **Define session status constants**
   - Create `SESSION_STATUS_CHOICES` tuple with status options
   - Include OPEN, CLOSED, SUSPENDED, FORCE_CLOSED statuses

3. **Add session status string constants**
   - Define `SESSION_STATUS_OPEN` = `'open'`
   - Define `SESSION_STATUS_CLOSED` = `'closed'`
   - Define `SESSION_STATUS_SUSPENDED` = `'suspended'`
   - Define `SESSION_STATUS_FORCE_CLOSED` = `'force_closed'`

4. **Add session status documentation comments**
   - Document when each status should be used
   - Explain accounting implications of each status
   - Note audit trail requirements

### Session Status Definitions

| Status | Code | Description | Accounting Impact |
|--------|------|-------------|-------------------|
| **OPEN** | `'open'` | Active shift, transactions allowed | All transactions recorded to this session |
| **CLOSED** | `'closed'` | Normal shift closure with reconciliation | Cash counted, variance calculated, finalized |
| **SUSPENDED** | `'suspended'` | Shift temporarily paused | Can be reopened, transactions blocked meanwhile |
| **FORCE_CLOSED** | `'force_closed'` | Emergency closure without proper reconciliation | Audit flag, variance not calculated |

### Session Status Flow

```
        ┌──────────────┐
        │     OPEN     │ ◄──── Normal operational state
        └──────┬───────┘
               │
        ┌──────┼──────┐
        │             │
        ▼             ▼
  ┌─────────┐   ┌──────────────┐
  │ SUSPEND │   │    CLOSED    │
  └────┬────┘   └──────────────┘
       │             (End state - normal)
       ▼
  ┌──────────────┐
  │ FORCE_CLOSED │
  └──────────────┘
       (End state - error recovery)
```

### Reconciliation Requirements

| Status | Cash Count Required | Variance Calculation | Audit Trail |
|--------|---------------------|---------------------|-------------|
| OPEN → CLOSED | Yes (mandatory) | Yes (automatic) | Standard |
| OPEN → SUSPENDED | No | No | Timestamp only |
| SUSPENDED → OPEN | No | No | Resume timestamp |
| OPEN → FORCE_CLOSED | Optional | No | Alert generated |

### Expected Outcome
```python
# In apps/pos/constants.py (continued)

SESSION_STATUS_OPEN = 'open'
SESSION_STATUS_CLOSED = 'closed'
SESSION_STATUS_SUSPENDED = 'suspended'
SESSION_STATUS_FORCE_CLOSED = 'force_closed'

SESSION_STATUS_CHOICES = (
    (SESSION_STATUS_OPEN, 'Open'),
    (SESSION_STATUS_CLOSED, 'Closed'),
    (SESSION_STATUS_SUSPENDED, 'Suspended'),
    (SESSION_STATUS_FORCE_CLOSED, 'Force Closed'),
)
```

### Verification Checklist
- [ ] All four session status constants are defined
- [ ] `SESSION_STATUS_CHOICES` tuple is created
- [ ] Status definitions include display labels
- [ ] Comments explain accounting implications
- [ ] Force close vs normal close distinction is documented

---

## Task 05: Create POSTerminal model

### Overview
Create the POSTerminal model that represents a physical or virtual point-of-sale terminal. Each terminal is tied to a warehouse for inventory operations and can be configured with specific settings and hardware connections.

### Dependencies
- Task 01: Create POS app structure
- Task 02: Create terminal submodule
- Task 03: Define terminal status constants
- Phase-04: Warehouse model must exist (from inventory module)

### Instructions

1. **Create the model file**
   - Create `pos_terminal.py` in `apps/pos/terminal/models/`
   - This file will contain the POSTerminal model

2. **Import required modules**
   - Import Django model classes and fields
   - Import BaseModel from core mixins (created in Phase-03)
   - Import terminal status constants from `apps.pos.constants`
   - Import Warehouse model from inventory app

3. **Define the POSTerminal model class**
   - Create class `POSTerminal` inheriting from `BaseModel`
   - Add model-level docstring explaining terminal purpose

4. **Add basic identification fields**
   - `name` field: CharField with max_length=100 for terminal display name
   - `code` field: CharField with max_length=20, unique per tenant for terminal identifier
   - Add help_text for both fields

5. **Add warehouse foreign key**
   - `warehouse` field: ForeignKey to Warehouse model
   - Set `on_delete=models.PROTECT` to prevent warehouse deletion if terminal exists
   - Set `related_name='pos_terminals'`
   - Add help_text explaining warehouse linkage

6. **Add status field**
   - `status` field: CharField with choices from `TERMINAL_STATUS_CHOICES`
   - Set max_length=20
   - Set default to `TERMINAL_STATUS_ACTIVE`
   - Add help_text explaining current operational status

7. **Add description field**
   - `description` field: TextField with blank=True, null=True
   - Add help_text for additional terminal information

8. **Add string representation method**
   - Define `__str__` method returning terminal name and code
   - Format: "Terminal Name (CODE)"

### POSTerminal Field Summary

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `name` | CharField(100) | Display name | Required |
| `code` | CharField(20) | Unique identifier | Unique per tenant |
| `warehouse` | ForeignKey | Stock operations link | PROTECT, required |
| `status` | CharField(20) | Operational status | Choices from constants |
| `description` | TextField | Additional info | Optional |

### Warehouse Integration

The POSTerminal is linked to a warehouse for the following purposes:

1. **Stock Deduction:** When sales are made, inventory is deducted from the terminal's warehouse
2. **Stock Checks:** Real-time stock availability is checked against warehouse inventory
3. **Transfers:** Stock transfers can be initiated from/to the terminal's warehouse
4. **Reporting:** Sales and inventory reports are warehouse-specific

### Terminal Code Convention

| Format | Example | Description |
|--------|---------|-------------|
| T## | T01, T02 | Simple numeric sequence |
| TERM-## | TERM-01 | Prefixed format |
| STORE-T## | STORE-T01 | Multi-location format |
| CUSTOM | CHECKOUT1 | Custom identifier |

### Expected Outcome
```python
# In apps/pos/terminal/models/pos_terminal.py

from django.db import models
from apps.core.models import BaseModel
from apps.pos.constants import TERMINAL_STATUS_CHOICES, TERMINAL_STATUS_ACTIVE

class POSTerminal(BaseModel):
    """
    Represents a Point of Sale terminal device or station.
    Each terminal is linked to a warehouse for inventory operations.
    """
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    warehouse = models.ForeignKey(
        'inventory.Warehouse',
        on_delete=models.PROTECT,
        related_name='pos_terminals'
    )
    status = models.CharField(
        max_length=20,
        choices=TERMINAL_STATUS_CHOICES,
        default=TERMINAL_STATUS_ACTIVE
    )
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.code})"
```

### Verification Checklist
- [ ] `pos_terminal.py` file created in correct location
- [ ] POSTerminal class inherits from BaseModel
- [ ] All five basic fields are defined (name, code, warehouse, status, description)
- [ ] Warehouse FK has PROTECT deletion behavior
- [ ] Status field uses TERMINAL_STATUS_CHOICES
- [ ] Code field has unique constraint
- [ ] `__str__` method is implemented
- [ ] Proper imports are included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create POS app structure | `apps/pos/` Django app initialized |
| 02 | Create terminal submodule | `apps/pos/terminal/` submodule structure |
| 03 | Define terminal status constants | Terminal status constants in `constants.py` |
| 04 | Define session status constants | Session status constants in `constants.py` |
| 05 | Create POSTerminal model | POSTerminal model with basic fields |

### Completed Directory Structure
```
backend/apps/pos/
├── __init__.py
├── apps.py
├── constants.py                      # Tasks 03-04
├── terminal/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── pos_terminal.py           # Task 05
│   ├── admin.py
│   ├── managers.py
│   └── utils.py
├── models/
│   └── __init__.py
├── views/
│   └── __init__.py
├── serializers/
│   └── __init__.py
└── admin.py
```

### Next Steps
Proceed to [02_Tasks-06-10_Terminal-Fields-Meta.md](02_Tasks-06-10_Terminal-Fields-Meta.md) to add:
- Hardware configuration fields (printer type, cash drawer)
- Location and settings fields
- Receipt template foreign key
- Model Meta class with indexes and ordering

---

## Notes for AI Agents

1. **BaseModel Inheritance:** POSTerminal inherits from BaseModel which provides: id, tenant FK, created_at, updated_at, created_by, updated_by fields
2. **Multi-Tenancy:** django-tenants automatically handles schema routing; no manual tenant filtering needed in queries
3. **Warehouse Protection:** PROTECT constraint prevents accidental warehouse deletion while terminals are assigned
4. **Status Constants:** Always use constants instead of string literals for maintainability
5. **Code Uniqueness:** Terminal code must be unique per tenant (handled by django-tenants unique constraint)
6. **Future Extensions:** Additional fields will be added in subsequent tasks (hardware, settings, etc.)
