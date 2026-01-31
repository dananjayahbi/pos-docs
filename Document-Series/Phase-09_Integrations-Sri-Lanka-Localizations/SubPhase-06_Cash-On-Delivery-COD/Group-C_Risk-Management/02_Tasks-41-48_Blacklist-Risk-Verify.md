# Tasks 41-48: Blacklist Management and Risk Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** C - Risk Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_OTP-Phone-Address.md](01_Tasks-33-40_OTP-Phone-Address.md)

---

## Document Overview

This document covers the implementation of blacklist management and comprehensive risk assessment for COD orders. The system maintains a blacklist of problematic phone numbers and addresses, checks customer COD history, calculates success rates, determines dynamic COD limits based on customer behavior, computes risk scores using multiple factors, and enforces risk thresholds to block high-risk orders. This multi-layered approach protects merchants from fraud and payment defaults while allowing legitimate customers to use COD.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create Blacklist Check | Medium | 40 min |
| 42 | Create CODBlacklist Model | Medium | 45 min |
| 43 | Create Previous COD Check | Medium | 50 min |
| 44 | Create Success Rate Check | Medium | 35 min |
| 45 | Create Dynamic COD Limit | Medium | 60 min |
| 46 | Create Risk Score | High | 90 min |
| 47 | Create Risk Threshold | Medium | 40 min |
| 48 | Verify Risk Management | Low | 30 min |

---

## Task 41: Create Blacklist Check

### Overview
Implement blacklist checking functionality to prevent known problematic customers from placing COD orders. The system checks both phone numbers and address hashes against a blacklist database before allowing COD orders. Blacklisted entries are customers who have repeatedly failed to pay COD, provided fake information, or engaged in fraudulent behavior. The check is fast, using database indexes, and provides immediate rejection of blacklisted customers.

### Dependencies
- Task 32: Create COD Payment Processor (from Group B)

### Instructions

1. **Create blacklist check service**
   - Create file: `backend/apps/payments/services/blacklist_service.py`
   - Implement BlacklistService class
   - Provide methods for checking phone and address
   - Use efficient database queries

2. **Implement phone blacklist check**
   - Method: `is_phone_blacklisted(phone)`
   - Query CODBlacklist model (Task 42)
   - Check if phone exists in blacklist
   - Return boolean and reason if blacklisted

3. **Implement address blacklist check**
   - Method: `is_address_blacklisted(address_hash)`
   - Hash the full address for comparison
   - Query CODBlacklist model for address hash
   - Return boolean and reason if blacklisted

4. **Create address hashing function**
   - Hash full address string for consistency
   - Use SHA-256 or similar algorithm
   - Normalize address before hashing (lowercase, trim spaces)
   - Store hash in database for comparison

5. **Implement combined check method**
   - Method: `check_customer(phone, address)`
   - Check both phone and address simultaneously
   - Return combined result with all matches
   - Include blacklist reasons and timestamps

6. **Add partial address matching (optional)**
   - Check for blacklisted partial addresses
   - Match by street name or building
   - Catch fraudsters using slight address variations
   - Use fuzzy matching with threshold

7. **Integrate with COD processor**
   - Call blacklist check before allowing COD
   - Reject order immediately if blacklisted
   - Return user-friendly error message
   - Log blacklist rejection event

8. **Add blacklist bypass for testing**
   - Admin flag to bypass blacklist
   - Used for testing and special cases
   - Requires admin authorization
   - Log all bypass events

### Blacklist Check Flow

```
Start Blacklist Check
        │
        ▼
  Extract Phone & Address
        │
        ▼
  Normalize Phone (+94 format)
        │
        ▼
  Hash Address (SHA-256)
        │
        ▼
  Query Phone in Blacklist
        │
        ├─ Found ────────────► Return Blacklisted (Phone)
        │                      Include Reason & Date
        │
        ▼
  Query Address Hash in Blacklist
        │
        ├─ Found ────────────► Return Blacklisted (Address)
        │                      Include Reason & Date
        │
        ▼
  Optional: Fuzzy Address Match
        │
        ├─ Match > 80% ──────► Flag for Review
        │
        ▼
  Return Not Blacklisted
        │
        ▼
       End
```

### BlacklistService Class Structure

```
┌────────────────────────────────────────┐
│      BlacklistService Class            │
├────────────────────────────────────────┤
│  + is_phone_blacklisted(phone)         │
│  + is_address_blacklisted(address)     │
│  + check_customer(phone, address)      │
│  + add_to_blacklist(phone, addr, ...)  │
│  + remove_from_blacklist(id)           │
│  + get_blacklist_reason(phone)         │
├────────────────────────────────────────┤
│  - _hash_address(address)              │
│  - _normalize_phone(phone)             │
│  - _fuzzy_match_address(address)       │
└────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────┐
  │  CODBlacklist    │
  │     Model        │
  └──────────────────┘
```

### Blacklist Check Methods

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| is_phone_blacklisted | phone | bool, reason | Check phone only |
| is_address_blacklisted | address_hash | bool, reason | Check address only |
| check_customer | phone, address | dict | Check both |
| add_to_blacklist | phone, address, reason | success | Add entry |
| remove_from_blacklist | blacklist_id | success | Remove entry |

### Check Customer Response Format

```
Method: check_customer
Input: phone (str), address (str)

Output (Not Blacklisted):
{
  "blacklisted": false,
  "phone_blacklisted": false,
  "address_blacklisted": false
}

Output (Phone Blacklisted):
{
  "blacklisted": true,
  "phone_blacklisted": true,
  "address_blacklisted": false,
  "reason": "Multiple failed COD payments",
  "blacklisted_at": "2025-12-15T10:30:00Z",
  "blacklist_id": "blk_abc123"
}

Output (Both Blacklisted):
{
  "blacklisted": true,
  "phone_blacklisted": true,
  "address_blacklisted": true,
  "reasons": [
    "Phone: Repeated refusals",
    "Address: Known fraud location"
  ]
}
```

### Address Hashing Strategy

| Step | Action | Example |
|------|--------|---------|
| 1. Normalize | Lowercase, trim | "No 123, Main St, Colombo" → "no 123, main st, colombo" |
| 2. Remove Punctuation | Optional | "no 123 main st colombo" |
| 3. Sort Words | Optional for fuzzy | "123 colombo main no st" |
| 4. Hash | SHA-256 | "a3f2b1c4d5..." (64 chars) |
| 5. Store | Save in DB | Store in address_hash field |

### Blacklist Reasons (Common)

| Reason Code | Description | Severity |
|------------|-------------|----------|
| PAYMENT_FAILURE | Failed to pay multiple times | High |
| ORDER_REFUSAL | Refused to accept delivery | High |
| FAKE_INFO | Provided fake contact info | Critical |
| FRAUD_ATTEMPT | Attempted fraudulent order | Critical |
| CHARGEBACK | Multiple payment disputes | High |
| ABUSIVE_BEHAVIOR | Abusive to delivery staff | Medium |

### Database Query Optimization

| Optimization | Implementation | Purpose |
|--------------|----------------|---------|
| Phone Index | CREATE INDEX ON phone | Fast phone lookup |
| Address Hash Index | CREATE INDEX ON address_hash | Fast address lookup |
| Tenant Filter | Always filter by tenant_id | Multi-tenancy support |
| Active Only | Filter is_active = true | Ignore removed entries |

### Blacklist Check Integration

```
COD Order Flow with Blacklist Check:

Customer Submits Order
        │
        ▼
  Validate Basic Info
        │
        ▼
  *** Blacklist Check ***
        │
        ├─ Blacklisted ──────► Reject Order
        │                      Show Error
        │                      Log Event
        │
        ▼
  Continue COD Processing
  (OTP, Risk Score, etc.)
```

### Error Messages for Blacklisted Customers

| Scenario | User Message | Internal Log |
|----------|-------------|--------------|
| Phone Blacklisted | "COD is not available for this account. Please use another payment method." | "Phone +94771234567 blacklisted: PAYMENT_FAILURE" |
| Address Blacklisted | "COD is not available for this delivery address. Please use another address or payment method." | "Address hash abc123 blacklisted: FRAUD_ATTEMPT" |
| Both Blacklisted | "COD is not available. Please use another payment method." | "Both phone and address blacklisted" |

### Fuzzy Address Matching (Optional)

| Technique | Threshold | Use Case |
|-----------|-----------|----------|
| Levenshtein Distance | > 80% similarity | Typos, abbreviations |
| Soundex/Metaphone | Phonetic match | Different spellings |
| Partial String Match | Contains blacklisted substring | Same street, different number |

### Blacklist Bypass (Admin Only)

```
Bypass Mechanism:
- Flag in order: blacklist_bypass = true
- Requires admin_user_id authorization
- Log bypass event:
  {
    "event": "blacklist_bypass",
    "order_id": "order_123",
    "phone": "+94771234567",
    "admin_user_id": 5,
    "reason": "Customer resolved previous issues",
    "timestamp": "2026-01-31T10:00:00Z"
  }
```

### Expected Outcome
- Functional blacklist checking service
- Phone and address blacklist verification
- Fast database queries with indexes
- Integration with COD processor
- Clear error messaging

### Verification Checklist
- [ ] BlacklistService class created
- [ ] is_phone_blacklisted method implemented
- [ ] is_address_blacklisted method implemented
- [ ] check_customer method implemented
- [ ] Address hashing function created
- [ ] Database queries optimized with indexes
- [ ] Integrated with COD processor
- [ ] Error messages configured
- [ ] Blacklist bypass mechanism added (if required)
- [ ] Tested with blacklisted and non-blacklisted data

---

## Task 42: Create CODBlacklist Model

### Overview
Create the CODBlacklist database model to store blacklisted phone numbers and addresses. This model maintains a persistent record of customers who are prohibited from using COD, including the reason for blacklisting, timestamp, and optional admin notes. The model supports multi-tenancy, includes audit fields, and provides indexes for fast lookups.

### Dependencies
- Task 41: Create Blacklist Check

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/payments/models/` directory
   - Create file: `cod_blacklist.py`
   - Import Django models and tenant schema base

2. **Define CODBlacklist model**
   - Extend TenantAwareModel for multi-tenancy
   - Add all required fields (see table below)
   - Include timestamp and audit fields
   - Add soft delete support (is_active)

3. **Add core fields**
   - tenant: ForeignKey to Tenant (for multi-tenancy)
   - phone: CharField (max_length=20, for +94XXXXXXXXX)
   - address_hash: CharField (max_length=64, for SHA-256)
   - reason: CharField (choices from REASON_CHOICES)
   - reason_detail: TextField (optional detailed explanation)
   - blocked_at: DateTimeField (auto_now_add)

4. **Add metadata fields**
   - blocked_by: ForeignKey to User (admin who added entry)
   - blocked_order_id: CharField (optional, order that triggered block)
   - failed_cod_count: IntegerField (how many failed COD orders)
   - total_fraud_amount: DecimalField (total amount of fraud)
   - is_active: BooleanField (for soft delete)

5. **Define reason choices**
   - Create REASON_CHOICES tuple
   - Include: PAYMENT_FAILURE, ORDER_REFUSAL, FAKE_INFO, FRAUD_ATTEMPT, CHARGEBACK, ABUSIVE_BEHAVIOR, OTHER
   - Use human-readable labels

6. **Add database indexes**
   - Index on phone field (unique per tenant)
   - Index on address_hash field
   - Composite index on (tenant, is_active)
   - Index on blocked_at for date filtering

7. **Implement model methods**
   - `__str__`: Return readable representation
   - `get_display_reason`: Return reason with detail
   - `deactivate`: Soft delete method
   - `reactivate`: Unblock method (admin only)

8. **Add model Meta options**
   - Set db_table name
   - Define ordering (blocked_at descending)
   - Add verbose_name and verbose_name_plural
   - Define unique_together constraints

9. **Create model manager**
   - Add custom manager for active blacklist entries
   - Method: `active()` - filters is_active=True
   - Method: `by_phone(phone)` - lookup by phone
   - Method: `by_address_hash(hash)` - lookup by address

10. **Add admin interface configuration**
    - Register model in Django admin
    - Configure list display fields
    - Add filters for reason and date
    - Enable search by phone

### CODBlacklist Model Schema

```
┌──────────────────────────────────────────────┐
│           CODBlacklist Model                 │
├──────────────────────────────────────────────┤
│  PK  id                BigInteger            │
│  FK  tenant_id         → Tenant              │
│      phone             VARCHAR(20)           │
│      address_hash      VARCHAR(64)           │
│      reason            VARCHAR(50)           │
│      reason_detail     TEXT                  │
│      blocked_at        TIMESTAMP             │
│  FK  blocked_by_id     → User                │
│      blocked_order_id  VARCHAR(50)           │
│      failed_cod_count  INTEGER               │
│      total_fraud_amt   DECIMAL(10,2)         │
│      is_active         BOOLEAN               │
│      created_at        TIMESTAMP             │
│      updated_at        TIMESTAMP             │
└──────────────────────────────────────────────┘
   Indexes:
   - idx_phone (tenant_id, phone)
   - idx_address_hash (tenant_id, address_hash)
   - idx_active (tenant_id, is_active)
   - idx_blocked_at (blocked_at)
```

### Model Fields Definition

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| tenant | ForeignKey | NOT NULL | Tenant ownership |
| phone | CharField(20) | NULL (if address only) | Blacklisted phone |
| address_hash | CharField(64) | NULL (if phone only) | Hashed address |
| reason | CharField(50) | NOT NULL | Reason code |
| reason_detail | TextField | NULL | Detailed explanation |
| blocked_at | DateTimeField | auto_now_add | When blacklisted |
| blocked_by | ForeignKey | NULL | Admin who added |
| blocked_order_id | CharField(50) | NULL | Triggering order |
| failed_cod_count | IntegerField | DEFAULT 0 | # failed orders |
| total_fraud_amount | DecimalField(10,2) | DEFAULT 0 | Total fraud ₨ |
| is_active | BooleanField | DEFAULT True | Soft delete flag |

### Reason Choices

```python
REASON_CHOICES = (
    ('PAYMENT_FAILURE', 'Multiple Failed COD Payments'),
    ('ORDER_REFUSAL', 'Repeated Order Refusals'),
    ('FAKE_INFO', 'Fake Contact Information'),
    ('FRAUD_ATTEMPT', 'Fraudulent Activity'),
    ('CHARGEBACK', 'Multiple Chargebacks'),
    ('ABUSIVE_BEHAVIOR', 'Abusive to Staff'),
    ('OTHER', 'Other Reason')
)
```

### Blacklist Entry Types

| Type | Phone | Address Hash | Use Case |
|------|-------|--------------|----------|
| Phone Only | ✓ | NULL | Block specific phone |
| Address Only | NULL | ✓ | Block specific address |
| Combined | ✓ | ✓ | Block phone-address pair |

### Model Methods

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `__str__` | - | str | Display representation |
| get_display_reason | - | str | Reason + detail |
| deactivate | admin_user | bool | Soft delete |
| reactivate | admin_user, reason | bool | Unblock entry |
| add_failed_order | order_id, amount | - | Increment counters |

### Custom Manager Methods

```
BlacklistManager:

active()
  → Returns only is_active=True entries

by_phone(phone, tenant)
  → Filters by phone and tenant
  → Returns active blacklist entry or None

by_address_hash(address_hash, tenant)
  → Filters by address hash and tenant
  → Returns active blacklist entry or None

expired()
  → Returns entries older than X months (optional)
  → For cleanup/review
```

### Database Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| idx_cod_blacklist_phone | (tenant_id, phone) | BTREE | Fast phone lookup |
| idx_cod_blacklist_addr | (tenant_id, address_hash) | BTREE | Fast address lookup |
| idx_cod_blacklist_active | (tenant_id, is_active) | BTREE | Filter active entries |
| idx_cod_blacklist_date | (blocked_at) | BTREE | Date range queries |

### Unique Constraints

```
UNIQUE CONSTRAINT:
- (tenant_id, phone) WHERE is_active=True
- (tenant_id, address_hash) WHERE is_active=True

Prevents duplicate active blacklist entries
Allows historical records after deactivation
```

### Model Meta Configuration

```python
class Meta:
    db_table = 'payments_cod_blacklist'
    ordering = ['-blocked_at']
    verbose_name = 'COD Blacklist Entry'
    verbose_name_plural = 'COD Blacklist Entries'
    indexes = [
        models.Index(fields=['tenant', 'phone']),
        models.Index(fields=['tenant', 'address_hash']),
        models.Index(fields=['tenant', 'is_active']),
        models.Index(fields=['blocked_at']),
    ]
    constraints = [
        models.UniqueConstraint(
            fields=['tenant', 'phone'],
            condition=models.Q(is_active=True),
            name='unique_active_phone'
        ),
    ]
```

### Admin Interface Configuration

| Feature | Configuration |
|---------|--------------|
| List Display | phone, reason, blocked_at, failed_cod_count, is_active |
| List Filter | reason, is_active, blocked_at |
| Search Fields | phone, address_hash, reason_detail |
| Read Only | blocked_at, created_at, updated_at |
| Actions | Deactivate, Reactivate, Export CSV |

### Example Blacklist Entries

```
Entry 1 (Phone Only):
{
  "phone": "+94771234567",
  "address_hash": null,
  "reason": "PAYMENT_FAILURE",
  "reason_detail": "Customer refused payment on 3 consecutive COD orders",
  "failed_cod_count": 3,
  "total_fraud_amount": 15000.00,
  "is_active": true
}

Entry 2 (Address Only):
{
  "phone": null,
  "address_hash": "a3f2b1c4d5e6f7a8b9c0d1e2f3a4b5c6...",
  "reason": "FRAUD_ATTEMPT",
  "reason_detail": "Multiple fraudulent orders from this address",
  "failed_cod_count": 5,
  "total_fraud_amount": 28000.00,
  "is_active": true
}

Entry 3 (Combined):
{
  "phone": "+94777654321",
  "address_hash": "b4a3c2d1e5f6a7b8c9d0e1f2a3b4c5d6...",
  "reason": "FAKE_INFO",
  "reason_detail": "Provided fake address and phone, never answered calls",
  "failed_cod_count": 1,
  "total_fraud_amount": 8500.00,
  "is_active": true
}
```

### Migration Considerations

| Consideration | Action |
|--------------|--------|
| Initial Migration | Create table with all fields and indexes |
| Data Migration | Import existing blacklist from CSV (if any) |
| Backfill Hashes | Hash existing addresses in database |
| Index Creation | Create indexes after data load for performance |

### Expected Outcome
- Functional CODBlacklist database model
- Multi-tenant support with proper foreign keys
- Indexed fields for fast lookups
- Soft delete capability
- Audit trail with metadata

### Verification Checklist
- [ ] CODBlacklist model file created
- [ ] All required fields defined
- [ ] REASON_CHOICES tuple created
- [ ] Database indexes configured
- [ ] Unique constraints added
- [ ] Custom manager with active() method
- [ ] Model methods implemented (__str__, deactivate, etc.)
- [ ] Meta options configured
- [ ] Admin interface registered
- [ ] Migration file created
- [ ] Migration applied successfully
- [ ] Tested with sample blacklist data

---

## Task 43: Create Previous COD Check

### Overview
Implement functionality to check customer's previous COD order history. This check retrieves all past COD orders for a given customer (by phone or email), analyzes payment outcomes, and provides statistics on successful payments, failures, and pending orders. This historical data is crucial for calculating success rates, determining dynamic limits, and assessing overall customer risk.

### Dependencies
- Task 32: Create COD Payment Processor (from Group B)
- Order and Payment models must exist

### Instructions

1. **Create COD history service**
   - Create file: `backend/apps/payments/services/cod_history_service.py`
   - Implement CODHistoryService class
   - Provide methods for querying order history
   - Use efficient database queries with aggregations

2. **Implement get order history method**
   - Method: `get_cod_history(customer_identifier)`
   - Accept phone number or email as identifier
   - Query all orders where payment method is COD
   - Filter by tenant for multi-tenancy
   - Return list of orders with payment status

3. **Add COD status categorization**
   - Successful: Payment completed and verified
   - Failed: Customer refused or didn't pay
   - Pending: Order delivered, payment not yet confirmed
   - Cancelled: Order cancelled before delivery
   - Count orders in each category

4. **Calculate history statistics**
   - Total COD orders placed
   - Successful payments count
   - Failed payments count
   - Pending payments count
   - Total value of successful COD orders
   - Total value of failed COD orders

5. **Implement recency analysis**
   - Find most recent COD order date
   - Count COD orders in last 30 days
   - Count COD orders in last 90 days
   - Identify if customer is new (0 orders) vs returning

6. **Add time-based filtering**
   - Method: `get_recent_cod_history(customer, days)`
   - Filter history to specified time window
   - Useful for trend analysis
   - Recent behavior weighted higher in risk

7. **Implement first-time customer check**
   - Method: `is_first_time_cod_customer(customer)`
   - Return true if 0 previous COD orders
   - Used for applying first-time limits
   - Quick boolean check without full history

8. **Add caching for performance**
   - Cache history queries for 5-10 minutes
   - Use Redis for temporary storage
   - Cache key: `cod:history:{customer_id}`
   - Invalidate cache on new COD order

9. **Create history summary method**
   - Method: `get_cod_summary(customer)`
   - Return concise summary with key metrics
   - Include: total_orders, success_rate, last_order_date
   - Used for quick risk assessment

### COD History Check Flow

```
Start COD History Check
        │
        ▼
  Identify Customer
  (phone or email)
        │
        ▼
  Check Cache
        │
        ├─ Hit ──────────────► Return Cached Data
        │
        ▼
  Query Order Database
  (payment_method = 'COD')
        │
        ▼
  Filter by Tenant
        │
        ▼
  Categorize Order Statuses
        │
        ├─ Successful
        ├─ Failed
        ├─ Pending
        └─ Cancelled
        │
        ▼
  Calculate Statistics
        │
        ├─ Count per category
        ├─ Total value per category
        └─ Success rate %
        │
        ▼
  Analyze Recency
        │
        ├─ Last order date
        ├─ Orders last 30 days
        └─ Orders last 90 days
        │
        ▼
  Cache Result (10 min TTL)
        │
        ▼
  Return History Data
        │
        ▼
       End
```

### CODHistoryService Class Structure

```
┌────────────────────────────────────────────┐
│       CODHistoryService Class              │
├────────────────────────────────────────────┤
│  + get_cod_history(customer)               │
│  + get_recent_cod_history(customer, days)  │
│  + get_cod_summary(customer)               │
│  + is_first_time_cod_customer(customer)    │
│  + count_cod_orders(customer, status)      │
│  + get_last_cod_order(customer)            │
├────────────────────────────────────────────┤
│  - _query_orders(customer, filters)        │
│  - _categorize_status(order)               │
│  - _calculate_stats(orders)                │
│  - _cache_history(customer, data)          │
│  - _get_cached_history(customer)           │
└────────────────────────────────────────────┘
```

### COD Order Status Categories

| Category | Order States | Payment States | Description |
|----------|-------------|----------------|-------------|
| Successful | Completed, Delivered | Paid, Verified | Customer paid successfully |
| Failed | Completed, Delivered | Unpaid, Refused | Customer didn't pay |
| Pending | Delivered, In-Transit | Pending | Payment not yet confirmed |
| Cancelled | Cancelled | Cancelled | Order cancelled (not counted) |

### Get COD History Response

```
Method: get_cod_history
Input: customer (phone or email)

Output:
{
  "customer": "+94771234567",
  "statistics": {
    "total_orders": 12,
    "successful": 10,
    "failed": 1,
    "pending": 1,
    "cancelled": 2,
    "success_rate": 83.33
  },
  "financial": {
    "total_successful_value": 125000.00,
    "total_failed_value": 8500.00,
    "total_pending_value": 3500.00,
    "average_order_value": 12500.00
  },
  "recency": {
    "last_order_date": "2026-01-25T14:30:00Z",
    "orders_last_30_days": 3,
    "orders_last_90_days": 7,
    "days_since_last_order": 6
  },
  "orders": [
    {
      "order_id": "ORD-12345",
      "order_date": "2026-01-25T14:30:00Z",
      "amount": 3500.00,
      "status": "delivered",
      "payment_status": "pending"
    },
    ...
  ]
}
```

### History Statistics Calculations

| Metric | Formula | Purpose |
|--------|---------|---------|
| Total Orders | Count all COD orders | Overall volume |
| Successful Count | Count where payment_status = 'paid' | Reliability |
| Failed Count | Count where payment_status = 'refused/unpaid' | Risk indicator |
| Success Rate | (successful / (successful + failed)) × 100 | Key risk metric |
| Avg Order Value | Sum(amounts) / Count(orders) | Spending pattern |

### Customer Segmentation by History

| Segment | Total Orders | Success Rate | COD Limit | Risk Level |
|---------|-------------|--------------|-----------|------------|
| New Customer | 0 | N/A | ₨10,000 | Medium-High |
| Emerging | 1-2 | Any | ₨15,000 | Medium |
| Regular (Good) | 3-10 | >80% | ₨25,000 | Low |
| Regular (Poor) | 3-10 | <50% | ₨10,000 | High |
| VIP (Excellent) | >10 | >90% | ₨50,000 | Very Low |
| VIP (Concerning) | >10 | <70% | ₨15,000 | Medium-High |

### Recency Analysis Windows

| Time Window | Purpose | Usage |
|------------|---------|-------|
| Last 7 Days | Very recent activity | Detect sudden changes |
| Last 30 Days | Recent behavior | Weight in risk score |
| Last 90 Days | Medium-term pattern | Success rate calculation |
| Last 180 Days | Long-term trend | VIP status qualification |
| All Time | Complete history | Overall reliability |

### First-Time Customer Check

```
Method: is_first_time_cod_customer
Input: customer (phone or email)

Output (First-Time):
{
  "is_first_time": true,
  "first_order_limit": 10000.00,
  "message": "New COD customer - restricted limit"
}

Output (Returning):
{
  "is_first_time": false,
  "previous_orders": 8,
  "last_order_date": "2026-01-15T10:00:00Z"
}
```

### Database Query Optimization

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Index on Customer Fields | phone, email indexes | Fast customer lookup |
| Index on Payment Method | payment_method = 'COD' | Filter COD orders |
| Index on Order Date | created_at DESC | Recency queries |
| Tenant Filter | Always include tenant_id | Multi-tenancy |
| Status Filter | Pre-filter cancelled orders | Accurate stats |

### Caching Strategy

```
Cache Key: cod:history:{tenant_id}:{customer_phone}
TTL: 600 seconds (10 minutes)

Cache Value (JSON):
{
  "statistics": { ... },
  "financial": { ... },
  "recency": { ... },
  "cached_at": "2026-01-31T10:00:00Z"
}

Cache Invalidation:
- New COD order placed
- Order payment status updated
- Manual cache clear (admin)
```

### Integration with Risk Scoring

COD history feeds into risk calculation:
- First-time customer: +30 risk points
- Success rate < 50%: +40 risk points
- Success rate 50-80%: +20 risk points
- Failed order in last 30 days: +15 risk points
- 0 successful orders: +25 risk points

### Expected Outcome
- Functional COD history checking service
- Comprehensive order statistics
- Success rate calculation
- Recency analysis
- First-time customer identification

### Verification Checklist
- [ ] CODHistoryService class created
- [ ] get_cod_history method implemented
- [ ] get_recent_cod_history method with time filtering
- [ ] is_first_time_cod_customer method implemented
- [ ] Order status categorization logic added
- [ ] Statistics calculation implemented
- [ ] Recency analysis added
- [ ] Caching implemented with Redis
- [ ] Database queries optimized
- [ ] Tested with customers having various history profiles
- [ ] Integration point added for risk scoring

---

## Task 44: Create Success Rate Check

### Overview
Implement success rate calculation based on customer's COD payment history. The success rate is the percentage of COD orders where the customer successfully paid, calculated as (successful payments / total completed orders) × 100. This metric is the single most important indicator of customer reliability for COD. The implementation includes various calculation methods, thresholds for different risk levels, and trend analysis.

### Dependencies
- Task 43: Create Previous COD Check

### Instructions

1. **Implement basic success rate calculation**
   - Method: `calculate_success_rate(customer)`
   - Formula: (successful_orders / (successful + failed)) × 100
   - Exclude pending and cancelled orders from calculation
   - Return percentage with 2 decimal places

2. **Handle edge cases**
   - No completed orders: Return None or 0 with flag
   - Only pending orders: Return None
   - All cancelled orders: Return None
   - First successful after failures: Recalculate properly

3. **Implement time-weighted success rate**
   - Method: `calculate_weighted_success_rate(customer, days)`
   - Recent orders weighted higher than old orders
   - Last 30 days: 50% weight
   - 31-90 days: 30% weight
   - 91+ days: 20% weight

4. **Define success rate thresholds**
   - Excellent: ≥90%
   - Good: 80-89%
   - Fair: 60-79%
   - Poor: 40-59%
   - Very Poor: <40%
   - Create constants for these thresholds

5. **Add success rate categorization**
   - Method: `categorize_success_rate(rate)`
   - Return category and risk level
   - Map to COD limit adjustments
   - Map to risk score additions

6. **Implement minimum order requirement**
   - Require at least 2 completed orders for reliable rate
   - If < 2 orders, mark as "Insufficient Data"
   - Apply conservative limits for insufficient data
   - Track separately from true poor performance

7. **Add trend analysis**
   - Compare last 30 days to previous 60 days
   - Detect improving vs declining patterns
   - Improving trend: Lower risk
   - Declining trend: Higher risk

8. **Create success rate report**
   - Method: `get_success_rate_report(customer)`
   - Include rate, category, trend, sample size
   - Include comparison to tenant average
   - Include recommendations for limit

### Success Rate Calculation Flow

```
Start Success Rate Calculation
        │
        ▼
  Get COD History
        │
        ▼
  Filter Completed Orders
  (Exclude Pending & Cancelled)
        │
        ├─ 0 Completed ─────► Return "No Data"
        │
        ▼
  Check Minimum Sample Size
        │
        ├─ < 2 Orders ──────► Return "Insufficient Data"
        │
        ▼
  Count Successful vs Failed
        │
        ▼
  Calculate Rate
  (successful / (successful + failed)) × 100
        │
        ▼
  Categorize Rate
  (Excellent/Good/Fair/Poor/Very Poor)
        │
        ▼
  Calculate Weighted Rate (Optional)
  (Recent orders weighted higher)
        │
        ▼
  Analyze Trend
  (Last 30 days vs previous)
        │
        ▼
  Return Rate + Metadata
        │
        ▼
       End
```

### Success Rate Formula

```
Basic Formula:
success_rate = (successful_orders / (successful_orders + failed_orders)) × 100

Where:
- successful_orders = Count where payment_status = 'paid'
- failed_orders = Count where payment_status IN ('refused', 'unpaid', 'failed')

Example:
10 successful, 2 failed
success_rate = (10 / (10 + 2)) × 100 = 83.33%
```

### Success Rate Thresholds & Actions

| Category | Rate Range | Risk Level | COD Limit | Risk Points | Description |
|----------|-----------|------------|-----------|-------------|-------------|
| Excellent | 90-100% | Very Low | ₨50,000 | +0 | Highly reliable |
| Good | 80-89% | Low | ₨35,000 | +10 | Reliable |
| Fair | 60-79% | Medium | ₨20,000 | +20 | Acceptable |
| Poor | 40-59% | High | ₨10,000 | +40 | Concerning |
| Very Poor | 0-39% | Very High | Block COD | +60 | Unacceptable |

### Weighted Success Rate Calculation

```
Time-Weighted Formula:
weighted_rate = (recent_30_rate × 0.5) + (days_31_90_rate × 0.3) + (days_91+_rate × 0.2)

Example:
Last 30 days: 80% (2 successful, 0 failed) × 0.5 = 40
Days 31-90: 90% (4 successful, 0 failed) × 0.3 = 27
Days 91+: 75% (3 successful, 1 failed) × 0.2 = 15
Weighted Rate = 40 + 27 + 15 = 82%
```

### Success Rate Response Format

```
Method: calculate_success_rate
Input: customer

Output:
{
  "success_rate": 83.33,
  "category": "Good",
  "risk_level": "Low",
  "sample_size": 12,
  "breakdown": {
    "successful": 10,
    "failed": 2,
    "pending": 1,
    "total_completed": 12
  },
  "weighted_rate": 85.00,
  "confidence": "High"
}
```

### Minimum Sample Size Requirements

| Sample Size | Confidence Level | Treatment |
|------------|------------------|-----------|
| 0 orders | None | Return None, treat as new customer |
| 1 order | Very Low | "Insufficient data", conservative limit |
| 2-4 orders | Low | Calculate rate, add caution note |
| 5-10 orders | Medium | Calculate rate normally |
| 11+ orders | High | Calculate rate with high confidence |

### Edge Case Handling

| Scenario | Sample Size | Successful | Failed | Rate | Action |
|----------|-------------|-----------|--------|------|--------|
| No Orders | 0 | 0 | 0 | None | Treat as new customer |
| One Success | 1 | 1 | 0 | 100% | Insufficient data, conservative |
| One Failure | 1 | 0 | 1 | 0% | Insufficient data, very conservative |
| All Pending | 3 | 0 | 0 | None | Wait for completion |
| All Cancelled | 3 | 0 | 0 | None | Treat as new customer |

### Trend Analysis

```
Method: analyze_success_rate_trend
Input: customer

Compare two time periods:
- Recent: Last 30 days
- Previous: Days 31-90

Trend Categories:
- Improving: Recent rate > Previous rate + 10%
- Stable: Difference within ±10%
- Declining: Recent rate < Previous rate - 10%

Output:
{
  "trend": "Improving",
  "recent_rate": 90.0,
  "previous_rate": 75.0,
  "change_percentage": +15.0,
  "risk_adjustment": -5
}
```

### Success Rate Report

```
Method: get_success_rate_report
Input: customer

Output:
{
  "success_rate": 83.33,
  "category": "Good",
  "confidence": "High",
  "sample_size": 12,
  "trend": "Stable",
  "comparison": {
    "tenant_average": 78.50,
    "vs_average": "+4.83%",
    "percentile": 65
  },
  "recommendations": {
    "cod_limit": 35000,
    "require_otp": false,
    "notes": "Reliable customer with good payment history"
  }
}
```

### Integration with Dynamic Limits

Success rate directly influences COD limits:

```
Limit Calculation Based on Success Rate:

IF success_rate >= 90%:
    base_limit = 50000
ELSE IF success_rate >= 80%:
    base_limit = 35000
ELSE IF success_rate >= 60%:
    base_limit = 20000
ELSE IF success_rate >= 40%:
    base_limit = 10000
ELSE:
    block_cod = true
```

### Tenant Average Comparison

```
Compare customer to tenant average:
- Get all customers' success rates for tenant
- Calculate mean and median
- Determine customer's percentile
- Use for context in risk assessment

Example:
Customer: 85%
Tenant Average: 78%
Tenant Median: 80%
Customer Percentile: 68th (better than 68% of customers)
```

### Expected Outcome
- Accurate success rate calculation
- Rate categorization with thresholds
- Time-weighted calculation option
- Trend analysis capability
- Integration with limit determination

### Verification Checklist
- [ ] calculate_success_rate method implemented
- [ ] Formula: (successful / (successful + failed)) × 100
- [ ] Handles 0 orders (returns None)
- [ ] Handles insufficient data (< 2 orders)
- [ ] Success rate thresholds defined
- [ ] categorize_success_rate method implemented
- [ ] Weighted success rate calculation added
- [ ] Trend analysis implemented
- [ ] get_success_rate_report method created
- [ ] Tenant average comparison added
- [ ] Tested with various customer profiles
- [ ] Integration with dynamic limits confirmed

---

## Task 45: Create Dynamic COD Limit

### Overview
Implement dynamic COD limit calculation that adjusts the maximum allowable COD order value based on customer history, success rate, and behavior patterns. Instead of a fixed limit for all customers, this system assigns personalized limits that reward reliable customers with higher limits while protecting merchants from risky customers with lower limits or no COD access. The limit calculation considers multiple factors and includes both floor and ceiling constraints.

### Dependencies
- Task 43: Create Previous COD Check
- Task 44: Create Success Rate Check

### Instructions

1. **Define base limit tiers**
   - New Customer (0 orders): ₨10,000
   - Emerging (1-2 orders, good): ₨15,000
   - Regular (3-10 orders, >80% rate): ₨25,000
   - Frequent (11-20 orders, >85% rate): ₨35,000
   - VIP (20+ orders, >90% rate): ₨50,000
   - Create constants for these tiers

2. **Implement main limit calculation method**
   - Method: `calculate_cod_limit(customer)`
   - Get customer's COD history (Task 43)
   - Get customer's success rate (Task 44)
   - Apply tier-based logic
   - Apply adjustments for various factors

3. **Add success rate adjustments**
   - Success rate < 40%: Block COD (₨0)
   - Success rate 40-59%: Base limit × 0.5
   - Success rate 60-79%: Base limit × 0.8
   - Success rate 80-89%: Base limit × 1.0
   - Success rate ≥90%: Base limit × 1.2

4. **Implement recency bonuses**
   - Last order > 90 days ago: Reduce limit by 20%
   - Last order > 180 days ago: Reduce limit by 30%
   - Last order < 30 days and successful: Increase limit by 10%
   - Recent failure (< 30 days): Reduce limit by 30%

5. **Add order value analysis**
   - Calculate average successful order value
   - Set limit to max(base_limit, avg_order_value × 2)
   - Prevents limit too low for regular purchase patterns
   - Cap at maximum tier limit

6. **Implement pending order consideration**
   - Check for pending COD orders
   - Subtract pending order values from available limit
   - Available limit = calculated_limit - sum(pending_orders)
   - Return both total and available limits

7. **Apply minimum and maximum constraints**
   - Minimum limit (if COD allowed): ₨5,000
   - Maximum limit (system-wide): ₨100,000
   - Admin override limits (optional): Up to ₨200,000
   - Ensure limit never exceeds constraints

8. **Add tenant-specific limit configuration**
   - Allow tenants to configure their own limit tiers
   - Tenant max limit (e.g., ₨50,000 for small business)
   - Tenant min limit (e.g., ₨10,000 for risk-averse)
   - Override default tiers with tenant settings

9. **Implement limit history tracking**
   - Store limit changes over time
   - Track when and why limit changed
   - Useful for customer service and analysis
   - Store in separate model or log

10. **Create limit explanation method**
    - Method: `explain_cod_limit(customer)`
    - Return limit with detailed explanation
    - Include factors that increased/decreased limit
    - Provide recommendations for increasing limit

### Dynamic Limit Calculation Flow

```
Start COD Limit Calculation
        │
        ▼
  Get Customer History
        │
        ▼
  Determine Base Tier
  (based on order count)
        │
        ├─ 0 orders ────────► ₨10,000 (New)
        ├─ 1-2 orders ──────► ₨15,000 (Emerging)
        ├─ 3-10 orders ─────► ₨25,000 (Regular)
        ├─ 11-20 orders ────► ₨35,000 (Frequent)
        └─ 20+ orders ──────► ₨50,000 (VIP)
        │
        ▼
  Apply Success Rate Adjustment
        │
        ├─ < 40% ───────────► Block COD (₨0)
        ├─ 40-59% ──────────► × 0.5
        ├─ 60-79% ──────────► × 0.8
        ├─ 80-89% ──────────► × 1.0
        └─ ≥90% ────────────► × 1.2
        │
        ▼
  Apply Recency Adjustment
        │
        ├─ > 180 days ──────► × 0.7
        ├─ > 90 days ───────► × 0.8
        ├─ < 30 days (success) ─► × 1.1
        └─ < 30 days (failure) ─► × 0.7
        │
        ▼
  Check Average Order Value
        │
        └─ Ensure limit ≥ (avg × 2)
        │
        ▼
  Apply Min/Max Constraints
        │
        ├─ < ₨5,000 ────────► Set to ₨5,000
        └─ > ₨100,000 ──────► Set to ₨100,000
        │
        ▼
  Check Pending Orders
        │
        └─ Subtract pending total
        │
        ▼
  Return Final Limit
        │
        ▼
       End
```

### Base Limit Tiers

| Tier | Order Count | Min Success Rate | Base Limit | Description |
|------|-------------|------------------|------------|-------------|
| New | 0 | N/A | ₨10,000 | First-time COD customer |
| Emerging | 1-2 | >50% | ₨15,000 | Limited history |
| Regular | 3-10 | >60% | ₨25,000 | Established customer |
| Frequent | 11-20 | >70% | ₨35,000 | Regular buyer |
| VIP | 20+ | >80% | ₨50,000 | Top customer |

### Success Rate Multipliers

| Success Rate | Multiplier | Example (Base ₨25,000) |
|-------------|-----------|------------------------|
| <40% | 0 (Block) | ₨0 (COD blocked) |
| 40-59% | 0.5 | ₨12,500 |
| 60-79% | 0.8 | ₨20,000 |
| 80-89% | 1.0 | ₨25,000 |
| 90-100% | 1.2 | ₨30,000 |

### Recency Adjustments

| Last Order | Adjustment | Reason |
|-----------|-----------|--------|
| < 30 days (successful) | × 1.1 | Active customer bonus |
| < 30 days (failed) | × 0.7 | Recent failure penalty |
| 30-90 days | × 1.0 | Normal |
| 91-180 days | × 0.8 | Inactive penalty |
| > 180 days | × 0.7 | Long absence penalty |

### Example Limit Calculations

```
Example 1: Excellent VIP Customer
- Base Tier: VIP (25 orders) → ₨50,000
- Success Rate: 95% → × 1.2 = ₨60,000
- Recency: 10 days (successful) → × 1.1 = ₨66,000
- Pending Orders: ₨5,000
- Final Total Limit: ₨66,000
- Available Limit: ₨61,000

Example 2: New Customer
- Base Tier: New (0 orders) → ₨10,000
- Success Rate: N/A → × 1.0 = ₨10,000
- Recency: N/A → × 1.0 = ₨10,000
- Pending Orders: ₨0
- Final Limit: ₨10,000

Example 3: Poor Performance Customer
- Base Tier: Regular (8 orders) → ₨25,000
- Success Rate: 45% → × 0.5 = ₨12,500
- Recency: 15 days (failure) → × 0.7 = ₨8,750
- Pending Orders: ₨0
- Final Limit: ₨8,750

Example 4: Blocked Customer
- Base Tier: Regular (5 orders) → ₨25,000
- Success Rate: 30% → × 0 (Block)
- Final Limit: ₨0 (COD Not Available)
```

### Calculate COD Limit Response

```
Method: calculate_cod_limit
Input: customer

Output:
{
  "customer": "+94771234567",
  "total_limit": 66000.00,
  "available_limit": 61000.00,
  "currency": "LKR",
  "calculation": {
    "base_tier": "VIP",
    "base_limit": 50000.00,
    "success_rate_multiplier": 1.2,
    "recency_multiplier": 1.1,
    "adjustments": [
      {"factor": "success_rate", "value": +10000},
      {"factor": "recency_bonus", "value": +6000}
    ]
  },
  "pending_orders": {
    "count": 1,
    "total_value": 5000.00
  },
  "constraints": {
    "min_limit": 5000.00,
    "max_limit": 100000.00,
    "tenant_max": 75000.00
  }
}
```

### Limit Constraints

| Constraint | Value | Enforced By |
|-----------|-------|-------------|
| System Minimum | ₨5,000 | Platform |
| System Maximum | ₨100,000 | Platform |
| Tenant Minimum | Configurable | Tenant settings |
| Tenant Maximum | Configurable | Tenant settings |
| Admin Override Max | ₨200,000 | Admin approval |

### Pending Orders Impact

```
Pending Orders Calculation:
- Query all orders with payment_method = 'COD' and status IN ('pending', 'processing', 'shipped')
- Sum total order amounts
- Subtract from calculated limit

Available Limit = Total Limit - Sum(Pending COD Orders)

Example:
Total Limit: ₨50,000
Pending Order 1: ₨15,000 (shipped, not delivered)
Pending Order 2: ₨10,000 (processing)
Available Limit: ₨50,000 - ₨25,000 = ₨25,000
```

### Limit Explanation Format

```
Method: explain_cod_limit
Input: customer

Output:
{
  "limit": 66000.00,
  "explanation": "Your COD limit is ₨66,000 based on your excellent payment history.",
  "factors": {
    "positive": [
      "VIP customer with 25+ successful orders",
      "95% payment success rate",
      "Recent successful order within 30 days"
    ],
    "negative": [],
    "neutral": [
      "₨5,000 reserved for pending order"
    ]
  },
  "recommendations": [
    "Maintain high success rate to keep VIP status",
    "Complete pending order to restore full limit"
  ],
  "next_tier": {
    "tier": "Elite (Custom)",
    "requirement": "Contact support for custom limits",
    "potential_limit": "Up to ₨100,000"
  }
}
```

### Tenant-Specific Configuration

```
Tenant COD Limit Settings:
{
  "tenant_id": "tenant_abc123",
  "enable_dynamic_limits": true,
  "tiers": {
    "new": 8000,
    "emerging": 12000,
    "regular": 20000,
    "frequent": 30000,
    "vip": 40000
  },
  "multipliers": {
    "success_rate_excellent": 1.15,
    "success_rate_good": 1.0,
    "success_rate_fair": 0.75,
    "success_rate_poor": 0.5
  },
  "constraints": {
    "min_limit": 5000,
    "max_limit": 50000,
    "require_otp_above": 25000
  }
}
```

### Expected Outcome
- Dynamic COD limits based on customer behavior
- Tier-based system with adjustments
- Success rate and recency considerations
- Pending order deduction
- Min/max constraint enforcement

### Verification Checklist
- [ ] calculate_cod_limit method implemented
- [ ] Base tier determination logic added
- [ ] Success rate multipliers applied
- [ ] Recency adjustments implemented
- [ ] Average order value consideration added
- [ ] Pending orders subtracted from available limit
- [ ] Min/max constraints enforced (₨5K-₨100K)
- [ ] Tenant-specific configuration supported
- [ ] explain_cod_limit method created
- [ ] Tested with various customer profiles
- [ ] Integration with order checkout confirmed

---

## Task 46: Create Risk Score

### Overview
Implement comprehensive risk scoring system that evaluates multiple risk factors to produce a single numerical risk score (0-100) for each COD order. The risk score combines customer history, success rate, blacklist status, order characteristics, address verification results, and behavioral patterns. This score is the primary determinant for approving, requiring additional verification, lowering limits, or blocking COD orders. Higher scores indicate higher risk.

### Dependencies
- Task 40: Create Address Verification
- Task 41: Create Blacklist Check
- Task 44: Create Success Rate Check
- Task 45: Create Dynamic COD Limit

### Instructions

1. **Create risk scoring service**
   - Create file: `backend/apps/payments/services/risk_scoring_service.py`
   - Implement RiskScoringService class
   - Provide main method: `calculate_risk_score(order_data)`
   - Return score with detailed factor breakdown

2. **Define risk factors and weights**
   - Customer history factors (40 points max)
   - Order value factors (15 points max)
   - Address factors (20 points max)
   - Behavioral factors (15 points max)
   - Blacklist/fraud indicators (10 points max)
   - Total: 100 points maximum

3. **Implement customer history scoring**
   - New customer (0 orders): +30 points
   - 1-2 orders: +20 points
   - 3-5 orders: +10 points
   - 6+ orders with good rate: +0 points
   - Low success rate (<50%): +40 points
   - Medium success rate (50-80%): +20 points
   - High success rate (>80%): +0 points

4. **Implement order value scoring**
   - Order value > COD limit: +15 points (should be blocked)
   - Order value > 80% of limit: +10 points
   - Order value > 50% of limit: +5 points
   - Order value < 50% of limit: +0 points
   - Very high value (>₨50,000): +10 points

5. **Implement address scoring**
   - Address verification score < 50: +20 points
   - Address verification score 50-75: +10 points
   - Address verification score > 75: +0 points
   - Address in blacklist area: +15 points
   - Suspicious address patterns: +10 points

6. **Implement behavioral scoring**
   - Recent failed COD (<30 days): +15 points
   - Multiple OTP failures: +10 points
   - First order from new device: +5 points
   - Unusual order time (2-5 AM): +5 points
   - Rush delivery requested: +3 points

7. **Implement blacklist/fraud indicators**
   - Phone blacklisted: +100 points (instant block)
   - Address blacklisted: +100 points (instant block)
   - Similar to blacklisted: +50 points
   - Fraud pattern detected: +30 points

8. **Add score normalization**
   - Ensure score stays within 0-100 range
   - If any factor triggers instant block, set score to 100
   - Round to nearest integer
   - Return both raw and normalized scores

9. **Create detailed factor breakdown**
   - List all factors evaluated
   - Show points added by each factor
   - Indicate which factors contributed most
   - Provide explanation for score

10. **Add score caching**
    - Cache risk score for 5 minutes
    - Cache key includes all order parameters
    - Invalidate on new order or profile change
    - Reduces repeated calculations

### Risk Score Calculation Flow

```
Start Risk Score Calculation
        │
        ▼
  Initialize Score = 0
        │
        ▼
  ┌─────────────────────────┐
  │  Customer History       │
  │  - New customer         │
  │  - Success rate         │
  │  - Order count          │
  │  → Add 0-40 points      │
  └─────────────────────────┘
        │
        ▼
  ┌─────────────────────────┐
  │  Order Value            │
  │  - % of COD limit       │
  │  - Absolute value       │
  │  → Add 0-15 points      │
  └─────────────────────────┘
        │
        ▼
  ┌─────────────────────────┐
  │  Address Verification   │
  │  - Verification score   │
  │  - Blacklist area       │
  │  - Suspicious patterns  │
  │  → Add 0-20 points      │
  └─────────────────────────┘
        │
        ▼
  ┌─────────────────────────┐
  │  Behavioral Factors     │
  │  - Recent failures      │
  │  - OTP issues           │
  │  - Time/device          │
  │  → Add 0-15 points      │
  └─────────────────────────┘
        │
        ▼
  ┌─────────────────────────┐
  │  Blacklist/Fraud        │
  │  - Blacklist check      │
  │  - Fraud patterns       │
  │  → Add 0-100 points     │
  └─────────────────────────┘
        │
        ▼
  Normalize Score (0-100)
        │
        ▼
  Return Score + Breakdown
        │
        ▼
       End
```

### Risk Factors and Point Values

| Category | Factor | Condition | Points | Max |
|----------|--------|-----------|--------|-----|
| **Customer History** | New customer | 0 orders | +30 | 40 |
| | Limited history | 1-2 orders | +20 | |
| | Some history | 3-5 orders | +10 | |
| | Success rate | <50% | +40 | |
| | Success rate | 50-80% | +20 | |
| | Success rate | >80% | +0 | |
| **Order Value** | Very high value | >₨50,000 | +10 | 15 |
| | Near limit | >80% of limit | +10 | |
| | Moderate value | 50-80% of limit | +5 | |
| | Low value | <50% of limit | +0 | |
| **Address** | Poor verification | Score <50 | +20 | 20 |
| | Fair verification | Score 50-75 | +10 | |
| | Good verification | Score >75 | +0 | |
| | Blacklist area | In known fraud area | +15 | |
| | Suspicious pattern | Fake address flags | +10 | |
| **Behavioral** | Recent failure | <30 days | +15 | 15 |
| | OTP failures | Multiple attempts | +10 | |
| | New device | First order | +5 | |
| | Unusual time | 2-5 AM | +5 | |
| | Rush delivery | Same/next day | +3 | |
| **Blacklist/Fraud** | Phone blacklisted | Exact match | +100 | 100 |
| | Address blacklisted | Exact match | +100 | |
| | Similar to blacklist | Fuzzy match | +50 | |
| | Fraud pattern | ML detection | +30 | |

### Risk Score Calculation Example

```
Example: Medium-Risk Customer

Customer History:
- 5 previous orders → +10 points
- 70% success rate → +20 points
Subtotal: 30 points

Order Value:
- Order: ₨18,000
- Limit: ₨25,000
- 72% of limit → +5 points
Subtotal: 5 points

Address:
- Verification score: 68 → +10 points
- Not in blacklist area → +0 points
Subtotal: 10 points

Behavioral:
- No recent failures → +0 points
- Normal order time → +0 points
Subtotal: 0 points

Blacklist/Fraud:
- Not blacklisted → +0 points
Subtotal: 0 points

Total Risk Score: 30 + 5 + 10 + 0 + 0 = 45 points
Category: Medium Risk
Action: Allow with OTP verification
```

### Risk Score Response Format

```
Method: calculate_risk_score
Input: order_data (dict with customer, order, address info)

Output:
{
  "risk_score": 45,
  "risk_category": "Medium",
  "action_required": "Require OTP",
  "breakdown": {
    "customer_history": {
      "points": 30,
      "factors": [
        {"factor": "order_count", "value": 5, "points": 10},
        {"factor": "success_rate", "value": 70, "points": 20}
      ]
    },
    "order_value": {
      "points": 5,
      "factors": [
        {"factor": "percentage_of_limit", "value": 72, "points": 5}
      ]
    },
    "address": {
      "points": 10,
      "factors": [
        {"factor": "verification_score", "value": 68, "points": 10}
      ]
    },
    "behavioral": {
      "points": 0,
      "factors": []
    },
    "blacklist_fraud": {
      "points": 0,
      "factors": []
    }
  },
  "explanation": "Medium risk score due to moderate success rate and limited order history. OTP verification required.",
  "calculated_at": "2026-01-31T10:00:00Z"
}
```

### Risk Score Categories

| Score Range | Category | Description | Typical Action |
|------------|----------|-------------|----------------|
| 0-20 | Very Low | Excellent customer, minimal risk | Auto-approve |
| 21-40 | Low | Good customer, low risk | Auto-approve |
| 41-60 | Medium | Some risk indicators | Require OTP |
| 61-80 | High | Multiple risk factors | Lower limit + OTP |
| 81-100 | Very High | Severe risk, likely fraud | Block COD |

### Instant Block Triggers

| Trigger | Score | Action |
|---------|-------|--------|
| Phone Blacklisted | 100 | Block immediately |
| Address Blacklisted | 100 | Block immediately |
| Fraud ML Detection (high confidence) | 100 | Block immediately |
| Order value > COD limit | 100 | Block (should be caught earlier) |

### Score Adjustment Factors

```
Dynamic Adjustments:
- Recent successful order: -5 points
- VIP customer (20+ orders, 95%+ rate): -10 points
- Verified phone (OTP completed): -5 points
- Known delivery area: -3 points
- Tenant reputation high: -5 points
```

### Caching Strategy

```
Cache Key: cod:risk_score:{tenant_id}:{customer_phone}:{order_hash}
TTL: 300 seconds (5 minutes)

Cache Value:
{
  "risk_score": 45,
  "breakdown": { ... },
  "cached_at": "2026-01-31T10:00:00Z"
}

Invalidate On:
- New COD order placed
- Customer profile updated
- Blacklist entry added
```

### Integration with Order Flow

```
Order Checkout with Risk Scoring:

Customer Selects COD
        │
        ▼
  Calculate Risk Score
        │
        ├─ 0-40 ──────────► Approve Order
        │
        ├─ 41-60 ─────────► Require OTP
        │                   Show: "Verify phone for security"
        │
        ├─ 61-80 ─────────► Lower Limit + OTP
        │                   Show: "COD limited to ₨X for this order"
        │
        └─ 81-100 ────────► Block COD
                            Show: "COD not available. Use other payment."
```

### Expected Outcome
- Comprehensive risk scoring system
- Multi-factor evaluation (history, value, address, behavior)
- Score range 0-100 with categories
- Detailed factor breakdown
- Integration with order approval flow

### Verification Checklist
- [ ] RiskScoringService class created
- [ ] calculate_risk_score method implemented
- [ ] Customer history scoring (0-40 points)
- [ ] Order value scoring (0-15 points)
- [ ] Address scoring (0-20 points)
- [ ] Behavioral scoring (0-15 points)
- [ ] Blacklist/fraud scoring (0-100 points)
- [ ] Score normalization to 0-100 range
- [ ] Detailed factor breakdown provided
- [ ] Score caching implemented
- [ ] Tested with various risk profiles
- [ ] Integration with order flow confirmed

---

## Task 47: Create Risk Threshold

### Overview
Implement risk threshold system that defines action rules based on risk scores. The threshold system maps risk score ranges to specific actions (auto-approve, require OTP, lower limit, block COD) and provides consistent decision-making logic across the platform. This task includes configurable thresholds, tenant-specific overrides, and clear messaging for each action level.

### Dependencies
- Task 46: Create Risk Score

### Instructions

1. **Define default risk thresholds**
   - Very Low (0-20): Auto-approve
   - Low (21-40): Auto-approve
   - Medium (41-60): Require OTP
   - High (61-80): Lower limit + OTP
   - Very High (81-100): Block COD
   - Create constants for these ranges

2. **Implement threshold evaluation method**
   - Method: `evaluate_risk_threshold(risk_score)`
   - Accept risk score (0-100)
   - Return action, category, and message
   - Apply default or tenant-specific thresholds

3. **Define action types**
   - APPROVE: Allow order without additional verification
   - REQUIRE_OTP: Require phone verification via OTP
   - LIMIT_REDUCE: Reduce COD limit for this order + OTP
   - BLOCK: Reject COD, offer alternative payment
   - Create action enum or constants

4. **Implement COD limit reduction logic**
   - When action is LIMIT_REDUCE (score 61-80)
   - Reduce calculated limit by 40-60%
   - Example: ₨25,000 → ₨10,000-₨15,000
   - Still require OTP verification

5. **Add threshold configuration model**
   - Allow tenants to customize thresholds
   - Store in database or configuration file
   - Fields: auto_approve_max, otp_required_max, limit_reduce_max
   - Defaults applied if not configured

6. **Create user-facing messages**
   - Message for each threshold action
   - Clear explanation of why action required
   - Instructions on what to do next
   - Positive messaging to avoid alarm

7. **Implement special case handling**
   - VIP customers: Raise thresholds by 10 points
   - First-time customers: Lower thresholds by 10 points
   - Tenant preference: Strict vs lenient modes
   - Holiday/peak season adjustments

8. **Add threshold override capability**
   - Admin can override threshold decision
   - Requires authorization and reason
   - Log all override events
   - Limited to specific roles

9. **Create threshold analytics**
   - Track distribution of orders by threshold
   - Monitor approve/OTP/block rates
   - Alert if block rate too high
   - Use for threshold tuning

### Risk Threshold Structure

```
Risk Score Ranges → Actions:

┌─────────────────────────────────────┐
│   0-20: Very Low Risk               │
│   Action: AUTO_APPROVE              │
│   Message: "Order confirmed"        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   21-40: Low Risk                   │
│   Action: AUTO_APPROVE              │
│   Message: "Order confirmed"        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   41-60: Medium Risk                │
│   Action: REQUIRE_OTP               │
│   Message: "Verify phone"           │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   61-80: High Risk                  │
│   Action: LIMIT_REDUCE + OTP        │
│   Message: "COD limited to ₨X"      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   81-100: Very High Risk            │
│   Action: BLOCK                     │
│   Message: "Use other payment"      │
└─────────────────────────────────────┘
```

### Default Threshold Configuration

| Threshold | Score Range | Action | Limit Adjustment | OTP Required |
|-----------|------------|--------|------------------|--------------|
| Very Low | 0-20 | AUTO_APPROVE | 100% | No |
| Low | 21-40 | AUTO_APPROVE | 100% | No |
| Medium | 41-60 | REQUIRE_OTP | 100% | Yes |
| High | 61-80 | LIMIT_REDUCE | 40-60% | Yes |
| Very High | 81-100 | BLOCK | 0% (blocked) | N/A |

### Evaluate Risk Threshold Response

```
Method: evaluate_risk_threshold
Input: risk_score (int)

Output (Auto-Approve):
{
  "action": "AUTO_APPROVE",
  "risk_category": "Low",
  "risk_score": 35,
  "cod_allowed": true,
  "otp_required": false,
  "limit_reduction": 0,
  "message": "Your COD order has been confirmed.",
  "user_message": "Order confirmed. Pay on delivery."
}

Output (Require OTP):
{
  "action": "REQUIRE_OTP",
  "risk_category": "Medium",
  "risk_score": 52,
  "cod_allowed": true,
  "otp_required": true,
  "limit_reduction": 0,
  "message": "OTP verification required for security.",
  "user_message": "For your security, please verify your phone number to complete this COD order."
}

Output (Limit Reduce):
{
  "action": "LIMIT_REDUCE",
  "risk_category": "High",
  "risk_score": 68,
  "cod_allowed": true,
  "otp_required": true,
  "limit_reduction": 50,
  "original_limit": 25000,
  "reduced_limit": 12500,
  "message": "COD limit reduced for this order. OTP required.",
  "user_message": "COD available up to ₨12,500 for this order. Please verify your phone."
}

Output (Block):
{
  "action": "BLOCK",
  "risk_category": "Very High",
  "risk_score": 92,
  "cod_allowed": false,
  "otp_required": false,
  "message": "COD not available for this order.",
  "user_message": "Cash on Delivery is not available for this order. Please select another payment method.",
  "alternatives": ["card", "bank_transfer", "online_banking"]
}
```

### Threshold Actions Detail

| Action | Description | Customer Experience | Backend Process |
|--------|-------------|-------------------|-----------------|
| AUTO_APPROVE | No additional checks | Order confirmed immediately | Process normally |
| REQUIRE_OTP | Phone verification | "Verify phone number" screen | Send OTP, wait for verification |
| LIMIT_REDUCE | Lower max COD + OTP | "COD limited to ₨X" + verify | Reduce limit, send OTP |
| BLOCK | Reject COD | "Use other payment" | Reject COD selection |

### Tenant-Specific Threshold Configuration

```
Tenant Threshold Settings:
{
  "tenant_id": "tenant_abc123",
  "threshold_mode": "balanced",  // strict, balanced, lenient
  "custom_thresholds": {
    "auto_approve_max": 35,      // Default: 40
    "otp_required_max": 55,      // Default: 60
    "limit_reduce_max": 75,      // Default: 80
    "block_min": 76              // Default: 81
  },
  "limit_reduction_percentage": 50,  // Reduce by 50%
  "require_otp_for_new_customers": true,
  "vip_threshold_bonus": 15    // Add 15 points for VIP
}
```

### Threshold Mode Presets

| Mode | Auto-Approve | OTP Required | Limit Reduce | Block | Description |
|------|-------------|--------------|--------------|-------|-------------|
| Strict | 0-25 | 26-45 | 46-70 | 71-100 | Risk-averse, more checks |
| Balanced | 0-40 | 41-60 | 61-80 | 81-100 | Default, recommended |
| Lenient | 0-50 | 51-70 | 71-85 | 86-100 | Trust customers more |

### Special Case Adjustments

```
VIP Customer Adjustment:
- If customer is VIP (20+ orders, 90%+ success rate)
- Effective risk score = actual_score - 10
- Example: Score 48 → Treated as 38 (Auto-approve instead of OTP)

First-Time Customer Adjustment:
- If customer has 0 previous COD orders
- Effective risk score = actual_score + 10
- Example: Score 35 → Treated as 45 (OTP required instead of auto-approve)

Peak Season Adjustment:
- During high-volume periods (holidays)
- Optionally raise all thresholds by 5 points
- Reduces OTP burden during peak
```

### User Messages by Action

| Action | Message Title | Message Body | Button Text |
|--------|--------------|--------------|-------------|
| AUTO_APPROVE | "Order Confirmed" | "Your COD order is confirmed. Pay on delivery." | "Continue" |
| REQUIRE_OTP | "Verify Your Phone" | "For security, please verify your phone number to complete this order." | "Verify Now" |
| LIMIT_REDUCE | "COD Limit Adjusted" | "COD is available up to ₨{limit} for this order. Verify your phone to proceed." | "Verify" |
| BLOCK | "COD Unavailable" | "Cash on Delivery is not available for this order. Please choose another payment method." | "Select Payment" |

### Threshold Override (Admin)

```
Admin Override:
- Admin can force-approve high-risk orders
- Requires admin authentication
- Must provide reason
- All overrides logged

Override Log Entry:
{
  "order_id": "ORD-12345",
  "original_risk_score": 85,
  "original_action": "BLOCK",
  "override_action": "REQUIRE_OTP",
  "admin_user_id": 42,
  "admin_name": "John Admin",
  "reason": "Customer verified via phone call",
  "timestamp": "2026-01-31T10:00:00Z"
}
```

### Threshold Analytics

| Metric | Description | Alert Condition |
|--------|-------------|-----------------|
| Approval Rate | % of orders auto-approved | < 40% (too restrictive) |
| OTP Rate | % requiring OTP | > 50% (too many) |
| Block Rate | % of orders blocked | > 10% (too many blocks) |
| Override Rate | % of admin overrides | > 5% (thresholds misconfigured) |

### Expected Outcome
- Clear threshold system mapping scores to actions
- Configurable tenant-specific thresholds
- Special case handling (VIP, first-time)
- User-friendly messaging
- Admin override capability

### Verification Checklist
- [ ] evaluate_risk_threshold method implemented
- [ ] Default thresholds defined (0-40, 41-60, 61-80, 81-100)
- [ ] Action types defined (APPROVE, REQUIRE_OTP, LIMIT_REDUCE, BLOCK)
- [ ] User messages created for each action
- [ ] Tenant-specific threshold configuration supported
- [ ] VIP and first-time customer adjustments added
- [ ] Limit reduction logic implemented (40-60%)
- [ ] Admin override capability added
- [ ] Threshold analytics tracking added
- [ ] Tested with various risk scores
- [ ] Integration with order checkout confirmed

---

## Task 48: Verify Risk Management

### Overview
Perform comprehensive verification and testing of the entire COD risk management system. This task ensures all components work together correctly, validates business logic, tests edge cases, and confirms that the system achieves its goal of reducing COD payment failures while allowing legitimate customers to use COD. This verification includes unit tests, integration tests, manual testing scenarios, and performance validation.

### Dependencies
- Task 33-47: All previous tasks in Group C

### Instructions

1. **Create test plan document**
   - List all components to test
   - Define test scenarios for each component
   - Create test data sets (various customer profiles)
   - Document expected outcomes

2. **Verify OTP system end-to-end**
   - Test OTP generation (generates 6-digit code)
   - Test OTP SMS sending (actual SMS delivery)
   - Test OTP verification (correct and incorrect codes)
   - Test OTP expiry (after 10 minutes)
   - Test retry limits (3 attempts, then lockout)
   - Test lockout duration (30 minutes)

3. **Verify phone and address validation**
   - Test phone validation (all Sri Lankan formats)
   - Test invalid phone numbers (rejected)
   - Test address verification (all 25 districts)
   - Test invalid addresses (rejected or flagged)
   - Test address scoring (various completeness levels)

4. **Verify blacklist functionality**
   - Test blacklist check (phone and address)
   - Test adding entries to blacklist
   - Test removing entries from blacklist
   - Test blacklist bypass (admin override)
   - Verify blacklisted orders are blocked

5. **Verify COD history and success rate**
   - Test with new customer (0 orders)
   - Test with customer having mixed history
   - Test success rate calculation (various scenarios)
   - Test history caching and cache invalidation
   - Verify correct statistics returned

6. **Verify dynamic COD limits**
   - Test limit for each customer tier
   - Test success rate adjustments
   - Test recency adjustments
   - Test pending order deduction
   - Test min/max constraints
   - Verify limit explanations are accurate

7. **Verify risk scoring**
   - Test with low-risk profile (score 0-20)
   - Test with medium-risk profile (score 41-60)
   - Test with high-risk profile (score 81-100)
   - Verify all factors contribute correctly
   - Test instant block triggers (blacklist)
   - Verify score breakdown accuracy

8. **Verify risk threshold actions**
   - Test auto-approve (score 0-40)
   - Test OTP required (score 41-60)
   - Test limit reduction (score 61-80)
   - Test COD block (score 81-100)
   - Verify correct messages displayed
   - Test tenant-specific thresholds

9. **Perform integration testing**
   - Test complete order flow with COD
   - Test order flow with OTP verification
   - Test order rejection (high risk)
   - Test concurrent OTP requests
   - Test race conditions in limit calculation
   - Test multi-tenant isolation

10. **Conduct performance testing**
    - Measure OTP generation time (< 100ms)
    - Measure risk score calculation (< 500ms)
    - Measure blacklist check (< 50ms)
    - Test with 1000 concurrent OTP requests
    - Test cache effectiveness
    - Identify bottlenecks

11. **Manual testing scenarios**
    - Complete COD order as new customer
    - Complete COD order with OTP verification
    - Attempt COD with blacklisted phone
    - Attempt COD with very high order value
    - Test OTP retry limit and lockout
    - Test multiple pending orders

12. **Create verification report**
    - Document all tests performed
    - Report pass/fail status for each test
    - List any bugs or issues found
    - Provide recommendations
    - Sign-off on risk management system

### Verification Test Cases

| Category | Test Case | Expected Result | Status |
|----------|-----------|-----------------|--------|
| **OTP System** | |||
| | Generate OTP for valid phone | 6-digit code, stored in Redis | ☐ |
| | Send OTP via SMS | SMS delivered within 30s | ☐ |
| | Verify correct OTP | Returns true, clears OTP | ☐ |
| | Verify incorrect OTP | Returns false, increment counter | ☐ |
| | OTP expires after 10 min | Verification fails | ☐ |
| | 3 failed attempts trigger lockout | Phone locked for 30 min | ☐ |
| | Generate OTP during lockout | Returns error | ☐ |
| **Phone/Address** | |||
| | Validate +94771234567 | Valid, normalized | ☐ |
| | Validate 0771234567 | Valid, normalized to +94 | ☐ |
| | Reject 0731234567 | Invalid operator prefix | ☐ |
| | Validate complete address | Score 100, no warnings | ☐ |
| | Validate incomplete address | Score < 75, warnings | ☐ |
| | Detect fake address | Rejected or flagged | ☐ |
| **Blacklist** | |||
| | Check non-blacklisted phone | Returns not blacklisted | ☐ |
| | Check blacklisted phone | Returns blacklisted + reason | ☐ |
| | Check blacklisted address | Returns blacklisted + reason | ☐ |
| | Order with blacklisted phone | COD blocked immediately | ☐ |
| | Admin bypass blacklist | Order allowed, logged | ☐ |
| **History** | |||
| | Get history for new customer | 0 orders, no data | ☐ |
| | Get history for returning | Correct order count, stats | ☐ |
| | Calculate success rate 100% | 10 success, 0 fail → 100% | ☐ |
| | Calculate success rate 80% | 8 success, 2 fail → 80% | ☐ |
| | Check first-time customer | Returns true for 0 orders | ☐ |
| **COD Limits** | |||
| | New customer limit | ₨10,000 | ☐ |
| | Regular customer limit (80% rate) | ₨25,000 | ☐ |
| | VIP customer limit (95% rate) | ₨50,000+ | ☐ |
| | Poor customer limit (40% rate) | ₨12,500 or less | ☐ |
| | Pending order deduction | Available = Total - Pending | ☐ |
| **Risk Scoring** | |||
| | New customer score | 30-40 range | ☐ |
| | Excellent customer score | 0-20 range | ☐ |
| | Poor customer score | 60-80 range | ☐ |
| | Blacklisted customer score | 100 (block) | ☐ |
| | Score with all factors | Breakdown sums correctly | ☐ |
| **Thresholds** | |||
| | Score 25 → Auto-approve | No OTP required | ☐ |
| | Score 50 → Require OTP | OTP screen shown | ☐ |
| | Score 70 → Limit reduce + OTP | Limit reduced, OTP required | ☐ |
| | Score 90 → Block COD | COD not available | ☐ |
| | Admin override block | Order allowed with log | ☐ |

### End-to-End Test Scenarios

**Scenario 1: New Customer Success**
```
1. Customer selects COD (first time)
2. Risk score calculated: 35 (new customer +30, other factors +5)
3. Action: AUTO_APPROVE (below 40)
4. Order confirmed immediately
5. Expected: Order placed successfully

Verify:
- Risk score 30-40
- No OTP required
- COD limit set to ₨10,000
- Order allowed
```

**Scenario 2: Regular Customer with OTP**
```
1. Customer selects COD (8 orders, 75% success rate)
2. Risk score calculated: 50 (moderate history +10, success rate +20, others +20)
3. Action: REQUIRE_OTP (41-60 range)
4. OTP sent to phone
5. Customer enters OTP
6. OTP verified successfully
7. Order confirmed
8. Expected: Order placed after OTP verification

Verify:
- Risk score 41-60
- OTP required and sent
- OTP verification works
- Order allowed after verification
```

**Scenario 3: High Risk Blocked**
```
1. Customer selects COD (3 orders, 30% success rate)
2. Risk score calculated: 85 (poor success rate +40, other factors +45)
3. Action: BLOCK (81-100 range)
4. COD option disabled
5. Message: "Use other payment method"
6. Expected: COD blocked

Verify:
- Risk score 81-100
- COD blocked
- Appropriate message shown
- Other payment methods available
```

**Scenario 4: Blacklisted Customer**
```
1. Customer selects COD (phone on blacklist)
2. Blacklist check returns positive
3. Risk score: 100 (instant block)
4. Action: BLOCK
5. Expected: COD blocked immediately

Verify:
- Blacklist check catches phone
- Risk score 100
- COD blocked before other checks
- Blacklist reason logged
```

**Scenario 5: OTP Retry Limit**
```
1. Customer requests OTP
2. OTP sent successfully
3. Customer enters wrong OTP (1st attempt) → Failed
4. Customer enters wrong OTP (2nd attempt) → Failed
5. Customer enters wrong OTP (3rd attempt) → Lockout triggered
6. Customer locked for 30 minutes
7. Expected: Cannot generate or verify OTP during lockout

Verify:
- 3 attempts allowed
- Lockout triggered after 3rd failure
- Lockout duration 30 minutes
- All OTP operations blocked
```

### Performance Benchmarks

| Operation | Target Time | Acceptable | Unacceptable |
|-----------|------------|------------|--------------|
| OTP Generation | < 100ms | < 200ms | > 500ms |
| OTP Send SMS | < 2000ms | < 5000ms | > 10000ms |
| OTP Verification | < 50ms | < 100ms | > 200ms |
| Blacklist Check | < 50ms | < 100ms | > 200ms |
| History Query | < 200ms | < 500ms | > 1000ms |
| Risk Score Calc | < 300ms | < 500ms | > 1000ms |
| Threshold Eval | < 50ms | < 100ms | > 200ms |

### Integration Test Checklist

- [ ] Complete order flow from cart to confirmation
- [ ] OTP flow integrated with order checkout
- [ ] Risk scoring integrated with payment selection
- [ ] Blacklist check blocks order immediately
- [ ] Dynamic limits enforced at checkout
- [ ] Multi-tenant isolation (Tenant A can't see Tenant B data)
- [ ] Cache invalidation works correctly
- [ ] Concurrent order handling (no race conditions)
- [ ] Error handling for external services (SMS gateway down)
- [ ] Database transactions (rollback on failure)

### Manual Testing Checklist

- [ ] Place COD order as new customer
- [ ] Place COD order as VIP customer
- [ ] Receive and verify OTP
- [ ] Test OTP expiry (wait 10+ minutes)
- [ ] Trigger OTP lockout (3 failed attempts)
- [ ] Attempt COD with blacklisted phone
- [ ] Attempt COD with blacklisted address
- [ ] Place order near COD limit
- [ ] Place order exceeding COD limit
- [ ] Test with various Sri Lankan phone formats
- [ ] Test with all 25 districts
- [ ] Test admin blacklist bypass
- [ ] Test tenant-specific thresholds
- [ ] Test during high load (multiple users)

### Bug Report Template

```
Bug ID: BUG-XXX
Severity: Critical / High / Medium / Low
Component: OTP / Blacklist / Risk Scoring / etc.
Description: [What happened]
Expected: [What should happen]
Actual: [What actually happened]
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]
Environment: Dev / Staging / Production
Assignee: [Developer name]
Status: Open / In Progress / Fixed / Closed
```

### Verification Sign-Off

```
COD Risk Management System Verification Report

Date: [Date]
Verified By: [Name]
Version: 1.0

Test Results:
- OTP System: ☐ Pass / ☐ Fail
- Phone/Address Validation: ☐ Pass / ☐ Fail
- Blacklist Management: ☐ Pass / ☐ Fail
- History & Success Rate: ☐ Pass / ☐ Fail
- Dynamic COD Limits: ☐ Pass / ☐ Fail
- Risk Scoring: ☐ Pass / ☐ Fail
- Risk Thresholds: ☐ Pass / ☐ Fail
- Integration Tests: ☐ Pass / ☐ Fail
- Performance Tests: ☐ Pass / ☐ Fail

Overall Status: ☐ APPROVED / ☐ NEEDS FIXES

Notes:
[Any additional notes, recommendations, or concerns]

Signature: ___________________ Date: ___________
```

### Expected Outcome
- Comprehensive verification of risk management system
- All components tested and working
- End-to-end flows validated
- Performance benchmarks met
- System ready for production

### Verification Checklist
- [ ] Test plan documented
- [ ] OTP system fully tested
- [ ] Phone/address validation tested
- [ ] Blacklist functionality verified
- [ ] COD history and success rate tested
- [ ] Dynamic limits verified
- [ ] Risk scoring tested with multiple profiles
- [ ] Risk thresholds validated
- [ ] Integration tests completed
- [ ] Performance tests conducted
- [ ] Manual testing scenarios completed
- [ ] All bugs documented and resolved
- [ ] Verification report created and signed off
- [ ] System approved for production

---

## Summary

This document established the blacklist management and risk assessment system for COD orders. The comprehensive risk management combines blacklist checking, customer history analysis, success rate calculation, dynamic COD limits, and multi-factor risk scoring to protect merchants while enabling legitimate customers to use COD. The risk threshold system provides clear decision rules and actions based on calculated risk scores.

### Completed Tasks
1. ✓ Created blacklist checking for phones and addresses
2. ✓ Created CODBlacklist database model
3. ✓ Implemented previous COD order history checking
4. ✓ Calculated customer success rates
5. ✓ Implemented dynamic COD limits based on behavior
6. ✓ Created comprehensive risk scoring (0-100)
7. ✓ Defined risk thresholds with clear actions
8. ✓ Verified entire risk management system

### System Integration
The complete Group C risk management system is now integrated with the COD payment processor:
- OTP verification protects high-value orders
- Phone/address validation ensures accurate contact info
- Blacklist prevents repeat offenders
- Historical analysis identifies reliable customers
- Dynamic limits reward good behavior
- Risk scoring provides objective assessment
- Threshold system automates decisions

### Next Steps
The COD risk management system is complete. Proceed to **Group D: Delivery Collection** to implement delivery partner integration, order handoff, collection confirmation, payment reconciliation, and remittance scheduling.
