# Tasks 11-16: ABC Factory Migration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** A - SMS Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-10_Settings-Model.md](01_Tasks-01-10_Settings-Model.md)
- **→ Next Group:** [Group-B_Provider-Implementations](../Group-B_Provider-Implementations/)

---

## Document Overview

This document covers the creation of the SMS provider abstraction layer using the Abstract Base Class (ABC) pattern and Factory pattern. It establishes the SMSProvider ABC with abstract methods for sending messages, checking balance, and getting status. It also creates the SMSProviderFactory for instantiating provider implementations dynamically and generates the necessary database migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 11 | Create SMSProvider ABC | Medium | 30 min |
| 12 | Create send Abstract Method | Low | 15 min |
| 13 | Create check_balance Abstract Method | Low | 15 min |
| 14 | Create get_status Abstract Method | Low | 15 min |
| 15 | Create SMSProviderFactory | Medium | 35 min |
| 16 | Create SMS Migrations | Low | 10 min |

---

## Architectural Patterns

### ABC Pattern Diagram
```
┌─────────────────────────────────────┐
│         SMSProvider (ABC)           │
│  ┌───────────────────────────────┐ │
│  │  Abstract Methods:            │ │
│  │  - send()                     │ │
│  │  - check_balance()            │ │
│  │  - get_status()               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
              △
              │
              │ Inheritance
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌────────┐┌────────┐┌────────┐
│ Dialog ││Notify  ││ TextIt │
│Provider││Provider││Provider│
└────────┘└────────┘└────────┘
```

### Factory Pattern Diagram
```
┌─────────────────────────────────────┐
│      SMSProviderFactory             │
│  ┌───────────────────────────────┐ │
│  │  get_provider(name) →         │ │
│  │    Returns provider instance  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
              │
              │ Instantiates
              ▼
┌─────────────────────────────────────┐
│    Concrete Provider Instance       │
│    (Dialog/Notify/TextIt)           │
└─────────────────────────────────────┘
```

### Inheritance Flow Diagram
```
┌──────────────────────────────────────────┐
│          abc.ABC (Python)                │
└──────────────────────────────────────────┘
                    △
                    │ inherits from
                    │
┌──────────────────────────────────────────┐
│      SMSProvider (Abstract)              │
│  - @abstractmethod send()                │
│  - @abstractmethod check_balance()       │
│  - @abstractmethod get_status()          │
└──────────────────────────────────────────┘
                    △
                    │ inherits from
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐┌──▼────────┐┌─▼──────────┐
│DialogProvider││NotifyProvider││TextItProvider│
│- send()      ││- send()    ││- send()    │
│- check_bal() ││- check_bal()││- check_bal()│
│- get_status()││- get_status()││- get_status()│
└──────────────┘└────────────┘└────────────┘
```

---

## Task 11: Create SMSProvider ABC

### Overview
Create the SMSProvider Abstract Base Class (ABC) that defines the interface contract for all SMS provider implementations. This ABC ensures that all concrete provider classes implement required methods for sending messages, checking balance, and getting status. The ABC pattern provides type safety, enforces implementation contracts, and enables polymorphism across different SMS providers.

### Dependencies
- Task 05: Create SMSConfig Model
- Python abc module
- Django framework initialized
- Notifications app created

### Instructions

1. **Navigate to providers directory**
   - Go to `backend/apps/notifications/providers/` directory
   - Create directory if it doesn't exist
   - This will house all provider-related code

2. **Create base.py file**
   - Create new file named `base.py` in providers directory
   - This file will contain the SMSProvider ABC
   - Follow Django app code structure conventions

3. **Import required modules**
   - Import ABC and abstractmethod from abc module
   - Import Optional, Dict, Any from typing for type hints
   - Import Django exceptions for error handling

4. **Define SMSProvider class**
   - Create class named SMSProvider
   - Inherit from abc.ABC to make it an abstract base class
   - Add comprehensive docstring explaining purpose

5. **Add class-level attributes**
   - Define provider_name as class attribute (to be overridden)
   - Add any common configuration attributes
   - Include type hints for all attributes

6. **Define initialization method**
   - Create __init__ method accepting api_key and sender_id
   - Store credentials as instance attributes
   - Add validation for required parameters

7. **Add common helper methods**
   - Create _validate_phone_number method for phone validation
   - Create _format_phone_number for Sri Lankan format (+94)
   - Create _build_headers method for common API headers

8. **Prepare for abstract methods**
   - Document expected behavior of abstract methods
   - Define method signatures with type hints
   - Add notes about implementation requirements

### ABC Pattern Purpose

| Feature | Benefit |
|---------|---------|
| Contract Enforcement | All providers must implement required methods |
| Type Safety | Static type checking for provider instances |
| Polymorphism | Treat all providers uniformly |
| Documentation | Clear interface documentation |
| Extensibility | Easy to add new providers |

### Class Structure
```
SMSProvider (ABC)
├── __init__(api_key, sender_id)
├── _validate_phone_number()
├── _format_phone_number()
├── _build_headers()
├── send() [abstract]
├── check_balance() [abstract]
└── get_status() [abstract]
```

### Expected Outcome
- SMSProvider ABC created in base.py
- Common helper methods implemented
- Foundation for concrete provider implementations
- Type-safe provider interface

### Verification Checklist
- [ ] base.py file created in providers directory
- [ ] SMSProvider class inherits from abc.ABC
- [ ] Class docstring explains ABC purpose
- [ ] __init__ method accepts api_key and sender_id
- [ ] Helper methods for phone validation and formatting
- [ ] Class is importable: `from notifications.providers.base import SMSProvider`

---

## Task 12: Create send Abstract Method

### Overview
Define the send abstract method in the SMSProvider ABC. This method signature establishes the contract for sending SMS messages across all provider implementations. The method accepts recipient phone number, message text, and optional parameters, returning a standardized response with message ID and status.

### Dependencies
- Task 11: Create SMSProvider ABC

### Instructions

1. **Open base.py file**
   - Navigate to `backend/apps/notifications/providers/base.py`
   - Locate the SMSProvider class definition
   - Position cursor after helper methods

2. **Add abstractmethod decorator**
   - Import abstractmethod from abc if not already imported
   - Add @abstractmethod decorator above method definition
   - This enforces implementation in subclasses

3. **Define send method signature**
   - Method name: send
   - Accept self as first parameter
   - Add phone_number parameter (str type)
   - Add message parameter (str type)
   - Add optional metadata parameter (Dict[str, Any])

4. **Add return type annotation**
   - Method returns Dict[str, Any]
   - Dictionary contains message_id and status keys
   - Include Optional for fields that may be None

5. **Write comprehensive docstring**
   - Explain method purpose: send SMS via provider
   - Document all parameters with types and descriptions
   - Document return value structure and possible values
   - Include example return dictionary
   - Note possible exceptions that may be raised

6. **Document expected return format**
   - Return dict with 'message_id' key (provider's message ID)
   - Include 'status' key (PENDING, SENT, FAILED)
   - Add 'provider_response' for raw API response
   - Include 'error' key for failure cases

7. **Add parameter validation notes**
   - Note phone_number must be E.164 format (+94XXXXXXXXX)
   - Message must not exceed provider limits (usually 160 chars)
   - Metadata can include scheduled_time, priority, etc.

8. **Include implementation guidelines**
   - Document that method should call provider's API
   - Note error handling requirements
   - Specify logging expectations

### Method Signature Purpose

| Parameter | Type | Purpose |
|-----------|------|---------|
| phone_number | str | Recipient phone in E.164 format |
| message | str | SMS text content (max 160 chars) |
| metadata | Dict | Optional params (priority, schedule) |
| **Returns** | Dict | {message_id, status, provider_response} |

### Return Value Structure
```
{
    'message_id': 'unique-msg-id',
    'status': 'SENT',  # PENDING, SENT, FAILED
    'provider_response': {...},
    'error': None  # or error message
}
```

### Send Method Flow
```
send(phone, message, metadata)
    │
    ├─► Validate phone number
    ├─► Validate message length
    ├─► Format request payload
    ├─► Call provider API
    ├─► Parse response
    └─► Return standardized dict
```

### Expected Outcome
- send abstract method defined with proper signature
- Comprehensive docstring with parameter documentation
- Return type clearly specified
- Implementation contract established

### Verification Checklist
- [ ] @abstractmethod decorator present
- [ ] Method signature: `send(self, phone_number: str, message: str, metadata: Optional[Dict[str, Any]] = None)`
- [ ] Return type: `-> Dict[str, Any]`
- [ ] Docstring documents parameters and return value
- [ ] Return structure documented with expected keys
- [ ] Implementation cannot instantiate SMSProvider without overriding send

---

## Task 13: Create check_balance Abstract Method

### Overview
Define the check_balance abstract method in the SMSProvider ABC. This method establishes the interface for querying the remaining SMS credit balance from the provider. Different providers have different balance formats (credits, currency, message count), so this method standardizes the response format across all implementations.

### Dependencies
- Task 11: Create SMSProvider ABC
- Task 12: Create send Abstract Method

### Instructions

1. **Open base.py file**
   - Navigate to SMSProvider class in base.py
   - Position after send method definition
   - Maintain consistent spacing between methods

2. **Add abstractmethod decorator**
   - Add @abstractmethod decorator
   - Ensure abc module is imported
   - Position decorator directly above method

3. **Define check_balance method signature**
   - Method name: check_balance
   - Accept only self parameter (no additional params)
   - Method will query balance from provider API

4. **Add return type annotation**
   - Method returns Dict[str, Any]
   - Dictionary contains balance information
   - Include currency, credits, or message count

5. **Write comprehensive docstring**
   - Explain purpose: query remaining SMS balance
   - Document that balance format varies by provider
   - Document return value structure
   - Include example return dictionaries for different providers

6. **Document expected return format**
   - Return dict with 'balance' key (numeric value)
   - Include 'unit' key (credits, LKR, messages)
   - Add 'currency' key if applicable
   - Include 'last_updated' timestamp

7. **Document provider differences**
   - Dialog: returns balance in LKR
   - Notify.lk: returns credit count
   - TextIt: returns message allowance
   - Note standardization requirements

8. **Add error handling notes**
   - Document behavior if balance check fails
   - Note that some providers may not support balance checks
   - Specify fallback behavior

### Method Signature Purpose

| Aspect | Details |
|--------|---------|
| Purpose | Query remaining SMS credits/balance |
| Parameters | None (uses api_key from __init__) |
| Returns | Standardized balance dictionary |
| Frequency | Called before bulk sends |

### Return Value Structure
```
{
    'balance': 500.00,
    'unit': 'LKR',  # or 'credits', 'messages'
    'currency': 'LKR',  # if monetary
    'last_updated': '2026-01-31T10:30:00Z'
}
```

### Provider Balance Formats
```
Dialog Provider:
    ├─► balance: LKR amount
    ├─► unit: 'LKR'
    └─► currency: 'LKR'

Notify.lk Provider:
    ├─► balance: Credit count
    ├─► unit: 'credits'
    └─► currency: None

TextIt Provider:
    ├─► balance: Message count
    ├─► unit: 'messages'
    └─► currency: None
```

### Balance Check Flow
```
check_balance()
    │
    ├─► Build API request
    ├─► Call provider balance endpoint
    ├─► Parse response
    ├─► Standardize format
    └─► Return balance dict
```

### Expected Outcome
- check_balance abstract method defined
- Return format standardized across providers
- Documentation covers provider differences
- Error handling guidelines provided

### Verification Checklist
- [ ] @abstractmethod decorator present
- [ ] Method signature: `check_balance(self) -> Dict[str, Any]`
- [ ] Docstring explains balance checking
- [ ] Return structure documented with keys: balance, unit, currency
- [ ] Provider differences documented
- [ ] Cannot instantiate without implementing check_balance

---

## Task 14: Create get_status Abstract Method

### Overview
Define the get_status abstract method in the SMSProvider ABC. This method establishes the interface for querying the delivery status of a previously sent message. It accepts a message ID returned from the send method and returns the current delivery status (PENDING, SENT, DELIVERED, FAILED) along with timestamp information.

### Dependencies
- Task 11: Create SMSProvider ABC
- Task 12: Create send Abstract Method
- Task 13: Create check_balance Abstract Method

### Instructions

1. **Open base.py file**
   - Navigate to SMSProvider class
   - Position after check_balance method
   - This is the final abstract method

2. **Add abstractmethod decorator**
   - Add @abstractmethod decorator
   - Maintains consistency with other abstract methods
   - Enforces implementation in concrete classes

3. **Define get_status method signature**
   - Method name: get_status
   - Accept self parameter
   - Accept message_id parameter (str type)
   - Message ID is returned from send method

4. **Add return type annotation**
   - Method returns Dict[str, Any]
   - Dictionary contains status information
   - Includes delivery timestamps

5. **Write comprehensive docstring**
   - Explain purpose: query delivery status of sent message
   - Document message_id parameter
   - Document return value structure with all keys
   - Include examples of different status responses

6. **Document expected return format**
   - Return dict with 'message_id' key
   - Include 'status' key (PENDING, SENT, DELIVERED, FAILED)
   - Add 'sent_at' timestamp (when sent to provider)
   - Add 'delivered_at' timestamp (when delivered to recipient)
   - Include 'failure_reason' for failed messages

7. **Document status values**
   - PENDING: Accepted by provider, not yet sent
   - SENT: Dispatched to mobile network
   - DELIVERED: Confirmed delivery to recipient
   - FAILED: Delivery failed (include reason)

8. **Add timing considerations**
   - Note that status queries should be rate-limited
   - Document typical delay before DELIVERED status
   - Note that not all providers support delivery reports

9. **Include implementation guidelines**
   - Method should call provider's status endpoint
   - Handle cases where provider doesn't support status checks
   - Document caching recommendations for status results

### Method Signature Purpose

| Parameter | Type | Purpose |
|-----------|------|---------|
| message_id | str | Provider's unique message identifier |
| **Returns** | Dict | Status info with timestamps |

### Return Value Structure
```
{
    'message_id': 'unique-msg-id',
    'status': 'DELIVERED',  # PENDING/SENT/DELIVERED/FAILED
    'sent_at': '2026-01-31T10:30:00Z',
    'delivered_at': '2026-01-31T10:30:05Z',
    'failure_reason': None  # or error description
}
```

### Status Transition Flow
```
PENDING ──► SENT ──► DELIVERED
              │
              └──────► FAILED
```

### Status Check Timing
```
send() returns message_id
    │
    ├─► Immediate: PENDING
    ├─► After 5-30 sec: SENT
    ├─► After 1-5 min: DELIVERED
    └─► Any time: FAILED
```

### Provider Status Support
```
┌──────────┬──────────┬────────────┐
│ Provider │ Status   │ Delivery   │
│          │ Support  │ Report     │
├──────────┼──────────┼────────────┤
│ Dialog   │ Yes      │ Yes        │
│ Notify   │ Yes      │ Partial    │
│ TextIt   │ Yes      │ Yes        │
└──────────┴──────────┴────────────┘
```

### Expected Outcome
- get_status abstract method defined
- Status values standardized
- Timestamp fields documented
- All three abstract methods complete

### Verification Checklist
- [ ] @abstractmethod decorator present
- [ ] Method signature: `get_status(self, message_id: str) -> Dict[str, Any]`
- [ ] Docstring explains status checking
- [ ] Return structure includes: message_id, status, sent_at, delivered_at, failure_reason
- [ ] Status values (PENDING, SENT, DELIVERED, FAILED) documented
- [ ] SMSProvider ABC is now complete with all abstract methods

---

## Task 15: Create SMSProviderFactory

### Overview
Create the SMSProviderFactory class that implements the Factory pattern for instantiating SMS provider implementations. The factory dynamically creates the appropriate provider instance based on the provider name (dialog, notifylk, textit) and provides a centralized point for provider instantiation. This enables loose coupling between the application code and concrete provider implementations.

### Dependencies
- Task 14: Create get_status Abstract Method
- All abstract methods defined in SMSProvider ABC
- Python importlib for dynamic imports

### Instructions

1. **Create factory.py file**
   - Navigate to `backend/apps/notifications/providers/` directory
   - Create new file named `factory.py`
   - This file contains the factory implementation

2. **Import required modules**
   - Import TYPE_CHECKING, Type from typing
   - Import SMSProvider from .base
   - Import Django settings
   - Import logging for error tracking

3. **Import concrete provider classes**
   - Use conditional imports to avoid circular dependencies
   - Import DialogProvider from .dialog
   - Import NotifyProvider from .notifylk
   - Import TextItProvider from .textit
   - Note: These will be implemented in Group B

4. **Define provider registry**
   - Create PROVIDER_REGISTRY dictionary at module level
   - Map provider names to provider classes
   - Keys: 'dialog', 'notifylk', 'textit'
   - Values: respective provider classes

5. **Create SMSProviderFactory class**
   - Define class named SMSProviderFactory
   - Make it a singleton or use class methods only
   - Add docstring explaining factory pattern

6. **Implement get_provider class method**
   - Use @classmethod decorator
   - Method accepts provider_name, api_key, sender_id
   - Returns instance of appropriate provider
   - Raises ValueError if provider not found

7. **Add provider name validation**
   - Check if provider_name exists in PROVIDER_REGISTRY
   - Raise clear error message if invalid
   - List available providers in error message

8. **Implement dynamic instantiation**
   - Look up provider class from registry
   - Instantiate with api_key and sender_id
   - Return provider instance typed as SMSProvider

9. **Add get_available_providers method**
   - Returns list of available provider names
   - Useful for UI dropdown or validation
   - Returns keys from PROVIDER_REGISTRY

10. **Add logging**
    - Log provider instantiation attempts
    - Log successful instantiations with provider name
    - Log errors with full traceback

11. **Add provider validation helper**
    - Create is_valid_provider class method
    - Accepts provider_name parameter
    - Returns boolean indicating validity

12. **Add docstrings and type hints**
    - Comprehensive docstring for class
    - Document each method's purpose and parameters
    - Add type hints for all parameters and returns

### Factory Pattern Purpose

| Feature | Benefit |
|---------|---------|
| Centralized Creation | Single point for provider instantiation |
| Loose Coupling | Application code doesn't know concrete classes |
| Extensibility | Easy to add new providers |
| Type Safety | Returns SMSProvider interface |
| Configuration | Can read from settings for defaults |

### Factory Class Structure
```
SMSProviderFactory
├── PROVIDER_REGISTRY (dict)
├── get_provider(name, key, sender) → SMSProvider
├── get_available_providers() → List[str]
└── is_valid_provider(name) → bool
```

### Provider Registry Structure
```
PROVIDER_REGISTRY = {
    'dialog': DialogProvider,
    'notifylk': NotifyProvider,
    'textit': TextItProvider
}
```

### Factory Pattern Flow
```
Application Code
    │
    ├─► SMSProviderFactory.get_provider('dialog', key, sender)
    │       │
    │       ├─► Validate provider name
    │       ├─► Lookup in registry
    │       ├─► Instantiate DialogProvider
    │       └─► Return as SMSProvider
    │
    └─► provider.send(phone, message)
            │
            └─► Polymorphic call to DialogProvider.send()
```

### Usage Example Flow
```
# Get provider from factory
provider = SMSProviderFactory.get_provider(
    provider_name='dialog',
    api_key='encrypted-key',
    sender_id='LCC'
)

# Use provider polymorphically
result = provider.send('+94771234567', 'Hello')
balance = provider.check_balance()
status = provider.get_status(result['message_id'])
```

### Factory Instantiation Pattern
```
┌──────────────────────────────┐
│   Tenant SMSConfig           │
│   provider: 'dialog'         │
│   api_key: 'xxx'             │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│   SMSProviderFactory         │
│   .get_provider('dialog')    │
└──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│   DialogProvider Instance    │
│   (implements SMSProvider)   │
└──────────────────────────────┘
```

### Error Handling Flow
```
get_provider(provider_name, ...)
    │
    ├─► Is provider_name in registry?
    │       ├─► No: Raise ValueError
    │       │      "Invalid provider: {name}"
    │       │      "Available: dialog, notifylk, textit"
    │       │
    │       └─► Yes: Continue
    │
    ├─► Get provider class from registry
    ├─► Instantiate provider
    │       └─► May raise if api_key invalid
    │
    └─► Return provider instance
```

### Expected Outcome
- SMSProviderFactory class created in factory.py
- PROVIDER_REGISTRY mapping providers to classes
- get_provider method for dynamic instantiation
- Helper methods for validation and listing
- Type-safe provider creation

### Verification Checklist
- [ ] factory.py file created in providers directory
- [ ] PROVIDER_REGISTRY dictionary defined with 3 providers
- [ ] SMSProviderFactory class defined
- [ ] get_provider class method with signature: `get_provider(cls, provider_name: str, api_key: str, sender_id: str) -> SMSProvider`
- [ ] get_available_providers method returns list of provider names
- [ ] is_valid_provider method validates provider names
- [ ] ValueError raised for invalid provider names
- [ ] Type hints present on all methods
- [ ] Comprehensive docstrings on class and methods
- [ ] Factory is importable: `from notifications.providers.factory import SMSProviderFactory`

---

## Task 16: Create SMS Migrations

### Overview
Generate Django migrations for the SMSConfig model and related database schema changes. This task creates the initial migration file that will create the sms_config table with all fields defined in Task 05-10, including encrypted api_key field, tenant foreign key, provider choices, and configuration flags. The migration also creates necessary indexes for performance.

### Dependencies
- Task 05: Create SMSConfig Model
- Tasks 06-10: All SMSConfig model fields
- django-tenant-schemas or django-tenants installed
- django-fernet-fields for encryption

### Instructions

1. **Verify model definition**
   - Ensure SMSConfig model is complete in models/sms_config.py
   - Verify all fields are defined (tenant, provider, api_key, sender_id, is_enabled, monthly_limit)
   - Confirm model is registered in app's models/__init__.py

2. **Check migrations directory**
   - Navigate to `backend/apps/notifications/migrations/`
   - Ensure directory exists
   - Check if __init__.py file is present

3. **Run makemigrations command**
   - Open terminal in backend directory
   - Activate virtual environment
   - Run: `python manage.py makemigrations notifications`
   - Django will detect SMSConfig model changes

4. **Review generated migration file**
   - Migration file created in migrations directory
   - File named like: `0001_initial_smsconfig.py` or next number
   - Open file to review operations

5. **Verify migration operations**
   - CreateModel operation for SMSConfig present
   - All fields included with correct types
   - Tenant ForeignKey with proper on_delete behavior
   - Encrypted field properly defined

6. **Check field definitions in migration**
   - tenant: ForeignKey to tenant model
   - provider: CharField with max_length=20
   - api_key: EncryptedCharField (from fernet_fields)
   - sender_id: CharField with max_length=11
   - is_enabled: BooleanField with default=False
   - monthly_limit: IntegerField with default=1000

7. **Verify indexes and constraints**
   - Unique constraint on (tenant, provider) if applicable
   - Index on tenant field for queries
   - Index on is_enabled for filtering

8. **Add custom indexes if needed**
   - Edit migration file if additional indexes needed
   - Add db_index=True for frequently queried fields
   - Add unique_together constraint if required

9. **Test migration on development database**
   - Run: `python manage.py migrate notifications`
   - Verify migration applies without errors
   - Check database to confirm table created

10. **Verify table structure**
    - Connect to PostgreSQL database
    - Run: `\d+ sms_config` to describe table
    - Confirm all columns present with correct types
    - Verify indexes created

11. **Document migration**
    - Add comments to migration file if needed
    - Note any custom operations
    - Document rollback considerations

### Migration Purpose

| Aspect | Details |
|--------|---------|
| Creates | sms_config table |
| Fields | 6 fields (tenant, provider, api_key, sender_id, is_enabled, monthly_limit) |
| Indexes | tenant_id, is_enabled |
| Constraints | ForeignKey to tenant, provider choices |

### Migration File Structure
```
0001_initial_smsconfig.py
├── dependencies
│   └── Previous migrations
├── operations
│   └── CreateModel
│       ├── name: SMSConfig
│       ├── fields
│       │   ├── id (AutoField)
│       │   ├── tenant (ForeignKey)
│       │   ├── provider (CharField)
│       │   ├── api_key (EncryptedCharField)
│       │   ├── sender_id (CharField)
│       │   ├── is_enabled (BooleanField)
│       │   └── monthly_limit (IntegerField)
│       └── options
│           ├── db_table: 'sms_config'
│           └── indexes: [...]
```

### Database Schema
```sql
CREATE TABLE sms_config (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id),
    provider VARCHAR(20) NOT NULL,
    api_key TEXT NOT NULL,  -- Encrypted
    sender_id VARCHAR(11) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    monthly_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sms_config_tenant ON sms_config(tenant_id);
CREATE INDEX idx_sms_config_enabled ON sms_config(is_enabled);
```

### Migration Command Flow
```
makemigrations
    │
    ├─► Detect model changes
    ├─► Generate migration file
    ├─► Number migration sequentially
    └─► Save to migrations/

migrate
    │
    ├─► Read migration file
    ├─► Execute CreateModel operation
    ├─► Create table in database
    ├─► Create indexes
    └─► Record in django_migrations table
```

### Rollback Considerations
```
python manage.py migrate notifications zero
    │
    ├─► Drop sms_config table
    ├─► Drop all indexes
    └─► Remove migration record
```

### Expected Outcome
- Migration file generated in migrations directory
- SMSConfig table created in database
- All fields present with correct types
- Indexes created for performance
- Migration recorded in django_migrations table

### Verification Checklist
- [ ] Migration file exists: `backend/apps/notifications/migrations/000X_*.py`
- [ ] Migration includes CreateModel for SMSConfig
- [ ] All fields present: tenant, provider, api_key, sender_id, is_enabled, monthly_limit
- [ ] api_key uses EncryptedCharField
- [ ] tenant uses ForeignKey with CASCADE delete
- [ ] Migration applies successfully: `python manage.py migrate notifications`
- [ ] Table exists in database: `sms_config`
- [ ] Indexes created on tenant_id and is_enabled
- [ ] Can query empty table: `SELECT * FROM sms_config;`
- [ ] Migration recorded: Check django_migrations table

---

## Integration Between Tasks

### Task Dependencies Flow
```
Task 11: SMSProvider ABC
    │
    ├──► Task 12: send() abstract method
    │
    ├──► Task 13: check_balance() abstract method
    │
    └──► Task 14: get_status() abstract method
         │
         └──► Task 15: SMSProviderFactory
              │
              └──► Task 16: Migrations
```

### File Relationships
```
providers/
├── base.py (Tasks 11-14)
│   └── SMSProvider
│       ├── send()
│       ├── check_balance()
│       └── get_status()
│
└── factory.py (Task 15)
    └── SMSProviderFactory
        └── get_provider()
            └── Returns: SMSProvider instance

migrations/
└── 000X_initial_smsconfig.py (Task 16)
    └── Creates: sms_config table
```

### ABC to Factory Connection
```
SMSProvider (ABC)
    │ defines interface
    ▼
Concrete Providers (Group B)
    │ implements interface
    ▼
SMSProviderFactory
    │ instantiates providers
    ▼
Application Code
    │ uses providers polymorphically
```

---

## Testing After Completion

### Unit Test for ABC
```
Test: Cannot instantiate SMSProvider directly
├─► Try: provider = SMSProvider('key', 'sender')
└─► Expect: TypeError (abstract methods not implemented)

Test: Subclass must implement all abstract methods
├─► Create: IncompleteProvider(SMSProvider)
├─► Implement: Only send() method
└─► Expect: TypeError (missing check_balance, get_status)
```

### Unit Test for Factory
```
Test: Factory returns correct provider type
├─► Call: factory.get_provider('dialog', 'key', 'sender')
└─► Expect: Instance of DialogProvider

Test: Factory raises error for invalid provider
├─► Call: factory.get_provider('invalid', 'key', 'sender')
└─► Expect: ValueError with available providers listed

Test: get_available_providers returns list
├─► Call: factory.get_available_providers()
└─► Expect: ['dialog', 'notifylk', 'textit']
```

### Integration Test
```
Test: Factory creates functional provider
├─► Get: provider = factory.get_provider('dialog', 'key', 'sender')
├─► Call: result = provider.send('+94771234567', 'Test')
└─► Expect: Dict with message_id and status keys

Test: Provider methods return correct types
├─► Get: provider from factory
├─► Call: provider.send() → Dict
├─► Call: provider.check_balance() → Dict
├─► Call: provider.get_status('msg-id') → Dict
└─► Verify: All return expected dictionary structures
```

### Migration Test
```
Test: Migration applies successfully
├─► Run: python manage.py migrate notifications
└─► Expect: Migration applied without errors

Test: Table created with correct structure
├─► Query: \d+ sms_config
└─► Expect: All columns present with correct types

Test: Can create SMSConfig instance
├─► Create: SMSConfig(tenant=t, provider='dialog', ...)
├─► Save: config.save()
└─► Expect: Record saved successfully
```

---

## Common Issues and Solutions

### Issue: Cannot Import SMSProvider
**Problem:** Import error when trying to import SMSProvider from base.py

**Solutions:**
- Verify base.py exists in providers directory
- Check providers/__init__.py imports SMSProvider
- Ensure notifications app is in INSTALLED_APPS
- Check for circular import issues

### Issue: Abstract Methods Not Enforced
**Problem:** Can instantiate SMSProvider without errors

**Solutions:**
- Verify SMSProvider inherits from abc.ABC
- Check @abstractmethod decorators on all three methods
- Import ABC from abc module, not typing
- Restart Python interpreter to reload modules

### Issue: Factory Returns Wrong Provider Type
**Problem:** Factory returns incorrect provider class

**Solutions:**
- Verify PROVIDER_REGISTRY mapping is correct
- Check provider names match exactly (case-sensitive)
- Ensure concrete provider classes are imported
- Add logging to debug provider lookup

### Issue: Migration Fails to Apply
**Problem:** Migration fails with database error

**Solutions:**
- Check tenant model exists and is migrated first
- Verify django-fernet-fields is installed
- Ensure database user has CREATE TABLE permissions
- Check for conflicting migrations

### Issue: Encrypted Field Not Working
**Problem:** api_key not encrypted in database

**Solutions:**
- Install django-fernet-fields package
- Set FERNET_KEY in Django settings
- Import EncryptedCharField from fernet_fields
- Re-run migrations after fixing imports

### Issue: Type Hints Not Recognized
**Problem:** IDE shows type errors for SMSProvider

**Solutions:**
- Ensure typing module is imported
- Use TYPE_CHECKING for circular imports
- Add __future__ import annotations
- Update IDE's Python version to 3.9+

---

## Performance Considerations

### Factory Pattern Performance
```
Performance Impact: Minimal
├─► Registry lookup: O(1) dictionary access
├─► Instantiation: Single object creation
└─► Memory: One instance per request

Optimization Tips:
├─► Cache provider instances per tenant
├─► Reuse instances for multiple sends
└─► Implement connection pooling in providers
```

### Abstract Method Performance
```
Performance Impact: None
├─► Abstract methods compiled away
├─► No runtime overhead
└─► Same performance as regular methods

Benefits:
├─► Compile-time type checking
├─► No performance cost
└─► Better code safety
```

---

## Security Considerations

### API Key Protection
```
Security Measures:
├─► Encrypted in database (fernet_fields)
├─► Never logged in plaintext
├─► Not exposed in API responses
└─► Decrypted only when needed

Best Practices:
├─► Rotate keys regularly
├─► Use environment variable for FERNET_KEY
├─► Audit access to encrypted fields
└─► Implement key management policy
```

### Provider Instantiation Security
```
Security Checks:
├─► Validate provider_name against whitelist
├─► Validate api_key format before use
├─► Limit provider instantiation to authorized code
└─► Log all provider access attempts

Factory Security:
├─► Registry is immutable at runtime
├─► No dynamic class loading from user input
├─► Provider classes vetted at development time
└─► Type checking prevents invalid providers
```

---

## Next Steps

After completing this document, proceed to:

1. **Group B: Provider Implementations**
   - Implement DialogProvider concrete class
   - Implement NotifyProvider concrete class
   - Implement TextItProvider concrete class
   - Each implements send, check_balance, get_status

2. **Group C: SMS Service Layer**
   - Create SMSService class
   - Implement send_sms method
   - Implement bulk_send method
   - Add retry logic and error handling

3. **Group D: SMS Testing**
   - Unit tests for abstract base class
   - Factory pattern tests
   - Integration tests with mock providers
   - End-to-end SMS sending tests

---

## Summary

This document covered the creation of the SMS provider abstraction layer using the Abstract Base Class pattern and Factory pattern. The SMSProvider ABC defines a contract with three abstract methods (send, check_balance, get_status) that all provider implementations must implement. The SMSProviderFactory provides centralized, type-safe provider instantiation. Database migrations create the sms_config table with encrypted credentials. This architecture enables polymorphic provider usage, easy provider switching, and extensibility for future providers. The next group will implement concrete providers for Dialog, Notify.lk, and TextIt that conform to this interface.

---

## Document End

**Total Tasks in This Document:** 6  
**Estimated Completion Time:** 2 hours  
**Complexity Level:** Medium  
**Prerequisites:** Django experience, understanding of abstract classes and factory patterns  
**Testing Required:** Yes (unit tests for ABC and factory)
