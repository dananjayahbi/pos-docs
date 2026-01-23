# Tasks 01-06: Submodule, Schema Design, and Entity Definitions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** A - Offline Data Architecture  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-11_Sync-Config-Log-Models.md](02_Tasks-07-11_Sync-Config-Log-Models.md)

---

## Document Overview

This document covers the foundational setup for POS offline mode, including the creation of the offline submodule, definition of constants, and design of the offline data schema. These tasks establish the structural foundation for the entire offline functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create offline submodule | Low |
| 02 | Define offline mode constants | Low |
| 03 | Define sync status constants | Low |
| 04 | Design offline data schema | High |
| 05 | Define cacheable entities list | Medium |
| 06 | Define offline transaction schema | Medium |

---

## Task 01: Create Offline Submodule

### Overview
Create a dedicated `offline/` submodule within the POS app to organize all offline mode functionality, including models, utilities, and documentation.

### Dependencies
- SubPhase-01 (POS Core Module) must be completed
- `apps/pos/` app must exist

### Instructions

1. **Create the offline submodule directory**
   - Navigate to `apps/pos/`
   - Create a new directory named `offline/`

2. **Create the package structure**
   - Create `__init__.py` in the offline directory
   - Add a docstring explaining the module's purpose
   - Include imports for key classes and functions

3. **Create models subpackage**
   - Create `models/` directory inside `offline/`
   - Create `models/__init__.py`
   - Add docstring for models package

4. **Create constants module**
   - Create `constants.py` in the offline directory
   - Add module docstring explaining constants purpose

5. **Create utilities module**
   - Create `utils.py` for offline utility functions
   - Add module docstring

6. **Create documentation directory**
   - Create `docs/` directory inside `offline/`
   - This will store offline mode documentation

7. **Update parent __init__.py**
   - Update `apps/pos/__init__.py` to include offline module reference

### Directory Structure

```
apps/pos/
├── __init__.py
├── models.py
├── views.py
└── offline/                    # New submodule
    ├── __init__.py
    ├── constants.py
    ├── utils.py
    ├── models/
    │   └── __init__.py
    └── docs/
```

### Expected Outcome
- Clean, organized submodule structure
- All `__init__.py` files with proper docstrings
- Foundation for offline functionality

### Verification Checklist
- [ ] `apps/pos/offline/` directory exists
- [ ] `offline/__init__.py` with module docstring
- [ ] `offline/models/` package created
- [ ] `offline/constants.py` file exists
- [ ] `offline/utils.py` file exists
- [ ] `offline/docs/` directory created
- [ ] Package is importable: `from apps.pos import offline`

---

## Task 02: Define Offline Mode Constants

### Overview
Define constants representing the different operational states of the POS system's offline mode. These states help track whether the system is online, offline, syncing, or experiencing errors.

### Dependencies
- Task 01: Create offline submodule

### Instructions

1. **Open constants.py**
   - Navigate to `apps/pos/offline/constants.py`

2. **Add module docstring**
   - Explain that this module contains constants for offline mode
   - Reference usage across the offline module

3. **Define OfflineMode enum/constants**
   - Create a constant for ONLINE state
   - Create a constant for OFFLINE state
   - Create a constant for SYNCING state
   - Create a constant for SYNC_ERROR state

4. **Add state descriptions**
   - Add comments explaining each state
   - Include use cases for each state

5. **Define state choices for Django models**
   - Create a OFFLINE_MODE_CHOICES tuple
   - Format for use in Django model field choices

6. **Add state transition rules documentation**
   - Document valid state transitions
   - Note which transitions are automatic vs manual

### Offline Mode States

| State | Description | Typical Triggers |
|-------|-------------|------------------|
| **ONLINE** | Normal operation with server connection | Successful connection test |
| **OFFLINE** | No server connection, using local cache | Network disconnection, server down |
| **SYNCING** | Actively syncing data with server | Manual sync trigger, scheduled sync |
| **SYNC_ERROR** | Sync failed, manual intervention needed | Sync operation failure |

### State Transition Flow

```
┌─────────┐
│ ONLINE  │←─────────┐
└────┬────┘          │
     │               │
     ↓               │
┌─────────┐    ┌──────────┐
│ OFFLINE │←──→│ SYNCING  │
└────┬────┘    └────┬─────┘
     │              │
     │              ↓
     │         ┌────────────┐
     └────────→│ SYNC_ERROR │
               └────────────┘
```

### Implementation Considerations
- States should be string constants for clarity
- Use uppercase naming convention for constants
- Ensure states are mutually exclusive
- Consider logging state transitions for debugging

### Expected Outcome
```python
# Example structure (not actual code):
ONLINE = 'online'
OFFLINE = 'offline'
SYNCING = 'syncing'
SYNC_ERROR = 'sync_error'

OFFLINE_MODE_CHOICES = [
    (ONLINE, 'Online'),
    (OFFLINE, 'Offline'),
    (SYNCING, 'Syncing'),
    (SYNC_ERROR, 'Sync Error'),
]
```

### Verification Checklist
- [ ] All four states defined as constants
- [ ] Constants follow naming conventions
- [ ] OFFLINE_MODE_CHOICES tuple created
- [ ] Comments explain each state's purpose
- [ ] State transition rules documented

---

## Task 03: Define Sync Status Constants

### Overview
Define constants representing the status of individual sync operations and transactions. These statuses track the lifecycle of data synchronization between offline and online systems.

### Dependencies
- Task 02: Define offline mode constants

### Instructions

1. **Add SyncStatus constants section**
   - Continue in `apps/pos/offline/constants.py`
   - Add section comment for sync status constants

2. **Define PENDING status**
   - Create constant for transactions waiting to sync
   - Add comment explaining pending state

3. **Define IN_PROGRESS status**
   - Create constant for active sync operations
   - Add comment explaining in-progress state

4. **Define COMPLETED status**
   - Create constant for successfully synced items
   - Add comment explaining completion

5. **Define FAILED status**
   - Create constant for sync failures after retries
   - Add comment explaining failure state

6. **Define CONFLICT status**
   - Create constant for data conflicts requiring resolution
   - Add comment explaining conflict scenarios

7. **Create SYNC_STATUS_CHOICES tuple**
   - Format for Django model choices
   - Include human-readable labels

8. **Document retry logic**
   - Note maximum retry attempts
   - Explain transition from IN_PROGRESS to FAILED

9. **Document conflict scenarios**
   - List common conflict situations
   - Explain when manual resolution is needed

### Sync Status Lifecycle

| Status | Description | Next States |
|--------|-------------|-------------|
| **PENDING** | Waiting in queue to be synced | IN_PROGRESS |
| **IN_PROGRESS** | Currently being synced | COMPLETED, FAILED, CONFLICT |
| **COMPLETED** | Successfully synced | (terminal state) |
| **FAILED** | Sync failed after retries | PENDING (manual retry) |
| **CONFLICT** | Data conflict detected | COMPLETED (after resolution) |

### Status Flow Diagram

```
┌─────────┐
│ PENDING │
└────┬────┘
     │
     ↓
┌─────────────┐
│ IN_PROGRESS │
└──────┬──────┘
       │
       ├──────→ ┌───────────┐
       │        │ COMPLETED │ (Success)
       │        └───────────┘
       │
       ├──────→ ┌──────────┐
       │        │ CONFLICT │ (Requires resolution)
       │        └────┬─────┘
       │             │
       │             ↓
       │        (Manual resolution)
       │             │
       │             ↓
       │        ┌───────────┐
       │        │ COMPLETED │
       │        └───────────┘
       │
       └──────→ ┌────────┐
                │ FAILED │ (After retries)
                └────┬───┘
                     │
                     ↓
                (Manual retry) → PENDING
```

### Retry Configuration
- Default max retries: 3 attempts
- Retry intervals: exponential backoff (1min, 5min, 15min)
- After max retries: status changes to FAILED
- Manual retry resets retry counter

### Conflict Scenarios
- **Concurrent modifications**: Same record edited offline and online
- **Version mismatch**: Offline data older than server version
- **Referential conflicts**: Referenced entity deleted on server
- **Business rule violations**: Offline data violates server-side rules

### Expected Outcome
```python
# Example structure (not actual code):
PENDING = 'pending'
IN_PROGRESS = 'in_progress'
COMPLETED = 'completed'
FAILED = 'failed'
CONFLICT = 'conflict'

SYNC_STATUS_CHOICES = [
    (PENDING, 'Pending'),
    (IN_PROGRESS, 'In Progress'),
    (COMPLETED, 'Completed'),
    (FAILED, 'Failed'),
    (CONFLICT, 'Conflict'),
]
```

### Verification Checklist
- [ ] All five status constants defined
- [ ] Constants follow naming conventions
- [ ] SYNC_STATUS_CHOICES tuple created
- [ ] Status lifecycle documented
- [ ] Retry logic explained
- [ ] Conflict scenarios documented

---

## Task 04: Design Offline Data Schema

### Overview
Design comprehensive documentation of the offline data schema, including all entities that can be cached locally, their relationships, and synchronization requirements. This is a high-complexity design task that establishes the foundation for offline functionality.

### Dependencies
- Task 03: Define sync status constants
- Understanding of POS data requirements
- Knowledge of tenant schema structure

### Instructions

1. **Create data_schema.md file**
   - Navigate to `apps/pos/offline/docs/`
   - Create new file `data_schema.md`

2. **Add schema overview section**
   - Explain purpose of offline data schema
   - Describe high-level architecture
   - Note multi-tenancy considerations

3. **Document entity categories**
   - **Master Data**: Products, categories, tax rates, settings
   - **Transactional Data**: Sales, carts, payments
   - **Reference Data**: Customers, employees, terminals

4. **Define schema structure for each entity**
   - Entity name and purpose
   - Fields required for offline operations
   - Relationships with other entities
   - Sync priority and frequency

5. **Document data relationships**
   - Create entity relationship diagram
   - Show foreign key relationships
   - Indicate required vs optional relationships

6. **Define cache storage strategy**
   - IndexedDB structure for web-based POS
   - SQLite structure for native apps
   - Data normalization approach

7. **Document data size considerations**
   - Estimated size per entity type
   - Total cache size limits
   - Pruning strategies for old data

8. **Define version tracking**
   - How to track data freshness
   - Version/timestamp fields needed
   - Staleness detection logic

9. **Document security requirements**
   - Sensitive data handling
   - Encryption requirements
   - Data sanitization for offline storage

10. **Add sync direction indicators**
    - Unidirectional (server to client only)
    - Bidirectional (two-way sync)
    - Client to server only (transactions)

### Schema Categories

| Category | Entities | Sync Direction | Priority |
|----------|----------|----------------|----------|
| **Master Data** | Products, Variants, Prices, Categories, Tax Rates | Server → Client | High |
| **Settings** | POS Settings, Payment Methods, Receipt Templates | Server → Client | High |
| **Reference Data** | Customers, Employees, Terminals | Bidirectional | Medium |
| **Transactional** | Sales, Cart Items, Payments, Refunds | Client → Server | Critical |

### Core Entity Relationships

```
┌──────────┐
│ Tenant   │
└────┬─────┘
     │
     ├─────→ ┌──────────┐
     │       │ Category │
     │       └────┬─────┘
     │            │
     ├─────→ ┌───▼──────┐         ┌─────────┐
     │       │ Product  │────────→│ Variant │
     │       └────┬─────┘         └────┬────┘
     │            │                    │
     │            └──────┬─────────────┘
     │                   │
     ├─────→ ┌───────────▼──┐
     │       │ ProductPrice │
     │       └──────────────┘
     │
     ├─────→ ┌──────────┐
     │       │ Customer │
     │       └────┬─────┘
     │            │
     ├─────→ ┌───▼─────┐      ┌──────────┐
     │       │  Sale   │─────→│ SaleItem │
     │       └────┬────┘      └──────────┘
     │            │
     │            ├─────→ ┌─────────┐
     │            └─────→│ Payment │
     │                   └─────────┘
     │
     └─────→ ┌──────────┐
             │ Terminal │
             └──────────┘
```

### Storage Considerations

| Aspect | Approach |
|--------|----------|
| **Storage Type** | IndexedDB (web), SQLite (native) |
| **Max Cache Size** | 50MB per terminal |
| **Data Retention** | Products: permanent, Transactions: 30 days |
| **Pruning Strategy** | FIFO for completed transactions |
| **Compression** | Optional for large text fields |

### Version Tracking Strategy

Each cached entity includes:
- `cache_timestamp`: When data was cached locally
- `server_version`: Server-side version/updated_at timestamp
- `is_stale`: Boolean flag for data freshness
- `expires_at`: Absolute expiration time

### Security Considerations

| Data Type | Security Measure |
|-----------|------------------|
| **Customer PII** | Encrypt before storing locally |
| **Payment Info** | Never cache full card numbers |
| **Passwords** | Never store in offline cache |
| **Price Data** | Integrity checks on load |
| **Transaction Totals** | Digital signatures for verification |

### Expected Outcome
- Comprehensive documentation of offline data schema
- Clear entity relationships and dependencies
- Defined sync strategies per entity type
- Security and size guidelines established

### Verification Checklist
- [ ] `data_schema.md` created in docs directory
- [ ] All entity categories documented
- [ ] Entity relationships diagrammed
- [ ] Storage strategy defined
- [ ] Version tracking approach documented
- [ ] Security requirements specified
- [ ] Data size considerations addressed
- [ ] Sync directions clearly indicated

---

## Task 05: Define Cacheable Entities List

### Overview
Create a comprehensive, prioritized list of all entities that can be cached for offline operation, including their sync priority, freshness requirements, and cache duration.

### Dependencies
- Task 04: Design offline data schema

### Instructions

1. **Create cacheable_entities.md file**
   - Navigate to `apps/pos/offline/docs/`
   - Create new file `cacheable_entities.md`

2. **Add document header**
   - Explain purpose of the document
   - Note that this drives sync prioritization

3. **Define entity priority levels**
   - **Critical**: Must be synced immediately (tax rates, settings)
   - **High**: Sync frequently (products, prices)
   - **Medium**: Sync regularly (customers, categories)
   - **Low**: Sync when bandwidth available (historical data)

4. **List master data entities**
   - Products (with variants)
   - Product prices
   - Product categories
   - Tax rates
   - Units of measure

5. **List configuration entities**
   - POS settings
   - Payment method configurations
   - Receipt templates
   - Discount rules
   - Loyalty program settings

6. **List reference data entities**
   - Customers
   - Employees
   - Terminals
   - Warehouses/locations

7. **List transactional templates**
   - Cart templates
   - Quick sale items
   - Frequently used combinations

8. **For each entity, specify:**
   - Sync priority (Critical/High/Medium/Low)
   - Freshness requirement (acceptable staleness)
   - Cache duration (TTL)
   - Estimated record count
   - Estimated size per record
   - Sync direction

9. **Document sync frequency recommendations**
   - Critical: Real-time or every 5 minutes
   - High: Every 30 minutes
   - Medium: Every 2-4 hours
   - Low: Daily or on-demand

10. **Add filtering criteria**
    - Which products to cache (active only)
    - Customer filtering (recent transactions)
    - Historical data retention limits

11. **Document dependencies**
    - Products depend on categories
    - Variants depend on products
    - Prices depend on products
    - Sales depend on all master data

### Cacheable Entities by Priority

#### Critical Priority
| Entity | Freshness | Cache TTL | Sync Direction | Est. Size |
|--------|-----------|-----------|----------------|-----------|
| POS Settings | 5 minutes | Until logout | Server → Client | 10 KB |
| Tax Rates | 5 minutes | 24 hours | Server → Client | 5 KB |
| Payment Methods | 5 minutes | 24 hours | Server → Client | 5 KB |

#### High Priority
| Entity | Freshness | Cache TTL | Sync Direction | Est. Size |
|--------|-----------|-----------|----------------|-----------|
| Products | 30 minutes | 4 hours | Server → Client | 500 KB |
| Product Variants | 30 minutes | 4 hours | Server → Client | 300 KB |
| Product Prices | 15 minutes | 2 hours | Server → Client | 200 KB |
| Discount Rules | 30 minutes | 4 hours | Server → Client | 50 KB |

#### Medium Priority
| Entity | Freshness | Cache TTL | Sync Direction | Est. Size |
|--------|-----------|-----------|----------------|-----------|
| Categories | 1 hour | 24 hours | Server → Client | 50 KB |
| Customers | 1 hour | 8 hours | Bidirectional | 1 MB |
| Employees | 1 hour | 8 hours | Server → Client | 100 KB |
| Units of Measure | 24 hours | 7 days | Server → Client | 10 KB |

#### Low Priority
| Entity | Freshness | Cache TTL | Sync Direction | Est. Size |
|--------|-----------|-----------|----------------|-----------|
| Historical Sales | 24 hours | 7 days | Server → Client | 2 MB |
| Product Images | 24 hours | 30 days | Server → Client | 5 MB |
| Receipt History | 24 hours | 30 days | Server → Client | 1 MB |

### Filtering and Optimization

**Product Filtering:**
- Cache only active products
- Cache only products in stock (optional setting)
- Exclude products without prices
- Limit to products in assigned categories

**Customer Filtering:**
- Cache customers with transactions in last 90 days
- Cache all customers with active loyalty points
- Limit to 1,000 most recent customers per terminal

**Size Optimization:**
- Exclude large text fields (full descriptions)
- Cache product images separately
- Compress historical data
- Implement progressive caching

### Dependency Order for Initial Sync

```
1. Tax Rates, Units of Measure (no dependencies)
         │
         ▼
2. Categories, Payment Methods
         │
         ▼
3. Products (depends on categories)
         │
         ▼
4. Product Variants (depends on products)
         │
         ▼
5. Product Prices (depends on products/variants)
         │
         ▼
6. Discount Rules, Customers (depends on products)
         │
         ▼
7. Historical Data (depends on all master data)
```

### Expected Outcome
- Complete, prioritized list of cacheable entities
- Clear sync frequency and freshness requirements
- Size estimates for capacity planning
- Filtering rules to optimize cache usage

### Verification Checklist
- [ ] `cacheable_entities.md` created
- [ ] All entity categories listed
- [ ] Priority levels assigned
- [ ] Freshness requirements specified
- [ ] Cache TTL defined for each entity
- [ ] Size estimates provided
- [ ] Sync directions indicated
- [ ] Filtering criteria documented
- [ ] Dependency order established

---

## Task 06: Define Offline Transaction Schema

### Overview
Design the schema for transactions created while offline, including cart structure, line items, payments, and metadata needed for later synchronization with the server.

### Dependencies
- Task 04: Design offline data schema
- Task 05: Define cacheable entities list

### Instructions

1. **Add offline transaction section to data_schema.md**
   - Or create separate `offline_transaction_schema.md`
   - Add clear section heading

2. **Define offline transaction structure**
   - Unique offline transaction ID (UUID)
   - Terminal identification
   - Timestamp of transaction creation
   - User/employee information
   - Customer information
   - Transaction type (sale, refund, exchange)

3. **Define cart/sale header fields**
   - Offline transaction ID
   - Terminal ID
   - Timestamp (offline creation time)
   - Customer reference
   - Employee/user reference
   - Transaction status (draft, completed, cancelled)
   - Subtotal, tax, total amounts

4. **Define line item structure**
   - Reference to offline transaction
   - Product/variant reference
   - Quantity
   - Unit price (at time of sale)
   - Line discount
   - Tax amount
   - Line total
   - Notes/modifications

5. **Define payment structure**
   - Payment method type
   - Amount paid
   - Payment reference/transaction ID
   - Timestamp
   - Change amount
   - Payment status

6. **Add transaction metadata**
   - Device information
   - App version
   - Offline duration
   - Sync status
   - Retry count
   - Error messages
   - Conflict resolution data

7. **Define validation rules**
   - Required fields for each entity
   - Data format validations
   - Business rule checks
   - Referential integrity checks

8. **Document calculation logic**
   - How to calculate line totals
   - How to calculate tax amounts
   - How to handle rounding
   - How to apply discounts

9. **Add conflict resolution fields**
   - Client version timestamp
   - Server version timestamp
   - Resolution strategy
   - Resolved by (user)
   - Resolution timestamp

10. **Define complete transaction payload structure**
    - JSON structure for complete transaction
    - Include all nested entities
    - Document all fields with types

### Offline Transaction Structure

```
Offline Transaction
├── Header
│   ├── offline_id (UUID)
│   ├── terminal_id (Foreign Key)
│   ├── employee_id (Foreign Key)
│   ├── customer_id (Foreign Key, optional)
│   ├── offline_timestamp (DateTime)
│   ├── transaction_type (sale/refund/exchange)
│   ├── status (draft/completed/cancelled)
│   ├── subtotal (Decimal)
│   ├── tax_total (Decimal)
│   ├── discount_total (Decimal)
│   ├── grand_total (Decimal)
│   └── notes (Text)
│
├── Line Items (Array)
│   ├── line_id (UUID)
│   ├── product_id (Foreign Key)
│   ├── variant_id (Foreign Key, optional)
│   ├── sku (String)
│   ├── product_name (String)
│   ├── quantity (Decimal)
│   ├── unit_price (Decimal)
│   ├── discount_amount (Decimal)
│   ├── tax_rate (Decimal)
│   ├── tax_amount (Decimal)
│   ├── line_total (Decimal)
│   └── notes (Text)
│
├── Payments (Array)
│   ├── payment_id (UUID)
│   ├── payment_method (String)
│   ├── amount (Decimal)
│   ├── reference_number (String)
│   ├── timestamp (DateTime)
│   ├── change_amount (Decimal)
│   └── status (String)
│
└── Metadata
    ├── sync_status (pending/in_progress/completed/failed/conflict)
    ├── retry_count (Integer)
    ├── last_sync_attempt (DateTime)
    ├── error_message (Text)
    ├── device_info (JSON)
    ├── app_version (String)
    ├── offline_duration_minutes (Integer)
    └── conflict_data (JSON)
```

### Validation Rules

| Field | Validation Rule |
|-------|----------------|
| **offline_id** | Must be valid UUID, unique per terminal |
| **terminal_id** | Must reference valid terminal |
| **employee_id** | Must reference valid employee |
| **customer_id** | Optional, but must be valid if present |
| **subtotal** | Must equal sum of line totals |
| **tax_total** | Must equal sum of line tax amounts |
| **grand_total** | Must equal subtotal + tax_total - discount_total |
| **line_items** | At least one line item required |
| **payments** | Total payments must equal grand_total |
| **quantity** | Must be greater than 0 |
| **unit_price** | Must be non-negative |

### Calculation Logic

**Line Total Calculation:**
```
1. Base Amount = quantity × unit_price
2. Discount Amount = calculate based on discount rules
3. Taxable Amount = Base Amount - Discount Amount
4. Tax Amount = Taxable Amount × tax_rate
5. Line Total = Taxable Amount + Tax Amount
```

**Transaction Total Calculation:**
```
1. Subtotal = sum of all (quantity × unit_price)
2. Discount Total = sum of all line discount amounts
3. Tax Total = sum of all line tax amounts
4. Grand Total = Subtotal - Discount Total + Tax Total
```

### Complete JSON Payload Example Structure

```json
{
  "offline_id": "uuid-string",
  "terminal_id": "uuid-string",
  "employee_id": "uuid-string",
  "customer_id": "uuid-string or null",
  "offline_timestamp": "ISO 8601 datetime",
  "transaction_type": "sale",
  "status": "completed",
  "subtotal": "decimal",
  "tax_total": "decimal",
  "discount_total": "decimal",
  "grand_total": "decimal",
  "notes": "string",
  
  "line_items": [
    {
      "line_id": "uuid-string",
      "product_id": "uuid-string",
      "variant_id": "uuid-string or null",
      "sku": "string",
      "product_name": "string",
      "quantity": "decimal",
      "unit_price": "decimal",
      "discount_amount": "decimal",
      "tax_rate": "decimal",
      "tax_amount": "decimal",
      "line_total": "decimal",
      "notes": "string"
    }
  ],
  
  "payments": [
    {
      "payment_id": "uuid-string",
      "payment_method": "cash",
      "amount": "decimal",
      "reference_number": "string",
      "timestamp": "ISO 8601 datetime",
      "change_amount": "decimal",
      "status": "completed"
    }
  ],
  
  "metadata": {
    "sync_status": "pending",
    "retry_count": 0,
    "last_sync_attempt": null,
    "error_message": null,
    "device_info": {
      "platform": "web",
      "browser": "Chrome 120",
      "screen_resolution": "1920x1080"
    },
    "app_version": "1.0.0",
    "offline_duration_minutes": 45,
    "conflict_data": null
  }
}
```

### Conflict Resolution Fields

| Field | Purpose |
|-------|---------|
| **client_timestamp** | When transaction was created offline |
| **server_timestamp** | When server processed the sync |
| **resolution_strategy** | SERVER_WINS, CLIENT_WINS, MERGE, MANUAL |
| **conflict_reason** | Description of why conflict occurred |
| **resolved_by** | User who resolved the conflict |
| **resolution_timestamp** | When conflict was resolved |
| **original_values** | Backup of original data before resolution |

### Expected Outcome
- Complete offline transaction schema documented
- All nested structures defined
- Validation rules established
- Calculation logic documented
- JSON payload structure specified

### Verification Checklist
- [ ] Transaction header structure defined
- [ ] Line item structure documented
- [ ] Payment structure specified
- [ ] Metadata fields listed
- [ ] Validation rules documented
- [ ] Calculation logic explained
- [ ] Complete JSON structure provided
- [ ] Conflict resolution fields included
- [ ] All required fields identified
- [ ] Data types specified for all fields

---

## Summary

This document established the foundational architecture for POS offline mode:

1. **Created offline submodule** - Organized structure for offline functionality
2. **Defined state constants** - Clear operational states for offline/online modes
3. **Defined sync status constants** - Lifecycle tracking for sync operations
4. **Designed data schema** - Comprehensive offline data architecture
5. **Listed cacheable entities** - Prioritized entities with sync requirements
6. **Defined transaction schema** - Complete structure for offline transactions

These tasks provide the structural foundation needed for implementing offline data storage, synchronization, and conflict resolution in subsequent groups.

---

## Next Steps

Proceed to [02_Tasks-07-11_Sync-Config-Log-Models.md](02_Tasks-07-11_Sync-Config-Log-Models.md) to implement the server-side models for managing offline sync configuration and logging.
