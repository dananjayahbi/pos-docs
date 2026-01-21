# Group C: Customer Services & Search

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement customer CRUD services and full-text search

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Addresses & Contact Information](../Group-B_Addresses-Contact-Information/)
- **→ Next Group:** [Group D: Communication & History](../Group-D_Communication-History/)

---

## Group Overview

### Key Outcomes

1. **CustomerService Class** - Main service for customer operations
2. **Customer Creation** - Create with addresses and phones
3. **Customer Update** - Update profile and related data
4. **Customer Deactivation** - Soft delete/deactivate
5. **Customer Search** - Full-text search across fields
6. **PostgreSQL Search Vector** - Add search_vector for FTS
7. **Search Vector Trigger** - Auto-update on change
8. **Quick Search** - Fast by code or phone
9. **Lookup by Phone** - Find by phone (POS use case)
10. **Lookup by Email** - Find by email
11. **CustomerHistory Model** - Track profile changes
12. **History Logging** - Log changes with old/new values
13. **CustomerSettings Model** - Tenant configuration
14. **Default Settings** - Apply defaults from settings
15. **Service Migrations** - Apply migrations
16. **Customer Cache** - Cache frequently accessed customers

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic encapsulation |
| PostgreSQL FTS | Full-text search |
| Django Signals | Search vector updates |
| Redis Cache | Customer caching |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-41_Service-Search.md` | 35-41 | CustomerService, CRUD, full-text search, vector, trigger |
| 02 | `02_Tasks-42-46_Lookup-History.md` | 42-46 | Quick search, phone/email lookup, history model, logging |
| 03 | `03_Tasks-47-50_Settings-Cache-Migration.md` | 47-50 | CustomerSettings, defaults, migrations, cache |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create CustomerService Class | High | 30 min |
| 36 | Implement Customer Creation | Medium | 25 min |
| 37 | Implement Customer Update | Medium | 25 min |
| 38 | Implement Customer Deactivation | Medium | 20 min |
| 39 | Implement Customer Search | High | 30 min |
| 40 | Create PostgreSQL Search Vector | Medium | 25 min |
| 41 | Implement Search Vector Update Trigger | Medium | 25 min |
| 42 | Implement Quick Search | Medium | 20 min |
| 43 | Implement Customer Lookup by Phone | Medium | 20 min |
| 44 | Implement Customer Lookup by Email | Medium | 20 min |
| 45 | Create CustomerHistory Model | Medium | 25 min |
| 46 | Implement History Logging | Medium | 25 min |
| 47 | Create CustomerSettings Model | Medium | 25 min |
| 48 | Implement Default Settings | Medium | 20 min |
| 49 | Run Service Layer Migrations | Low | 15 min |
| 50 | Create Customer Cache | Medium | 25 min |

---

## Execution Order

```
[Tasks 35-41: CustomerService with search capabilities]
         │
         ▼
[Tasks 42-46: Lookup methods and history]
         │
         ▼
[Tasks 47-50: Settings, cache, migrations]
```

---

## Expected Deliverables

```
apps/customers/
├── models/
│   ├── __init__.py
│   ├── customer.py               # Updated with search_vector
│   ├── customer_history.py       # Task 45
│   └── customer_settings.py      # Task 47
├── services/
│   ├── __init__.py
│   ├── customer_service.py       # Tasks 35-44
│   ├── search_service.py         # Tasks 39-42
│   └── cache_service.py          # Task 50
└── migrations/
    └── 0004_history_settings.py  # Task 49
```

---

## Notes for AI Agents

### CustomerService Methods
- create_customer(data, addresses, phones, user)
- update_customer(customer_id, data, user)
- deactivate_customer(customer_id, user)
- reactivate_customer(customer_id, user)
- block_customer(customer_id, reason, user)
- search_customers(query, filters)
- quick_search(query)
- lookup_by_phone(phone_number)
- lookup_by_email(email)

### PostgreSQL Full-Text Search
```sql
-- Search vector field
search_vector = to_tsvector('english', 
    coalesce(first_name, '') || ' ' || 
    coalesce(last_name, '') || ' ' ||
    coalesce(company_name, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(customer_code, '')
)
```

### Search Vector Update Trigger
```sql
CREATE TRIGGER customer_search_vector_update
BEFORE INSERT OR UPDATE ON customers_customer
FOR EACH ROW EXECUTE FUNCTION update_customer_search_vector();
```

### Quick Search Logic
```
if query.startswith('CUST-'):
    # Search by customer code (exact)
elif query.startswith('+94') or query.startswith('07'):
    # Search by phone number
else:
    # Full-text search
```

### CustomerHistory Model
- customer: FK to Customer
- changed_by: FK to User
- changed_at: DateTimeField
- field_name: CharField
- old_value: TextField
- new_value: TextField
- change_type: CREATE, UPDATE, DELETE

### CustomerSettings Fields
- tenant: OneToOne to Tenant
- customer_code_prefix: CharField (default: "CUST")
- customer_code_start: IntegerField (default: 1)
- require_email: BooleanField
- require_phone: BooleanField
- default_status: Choice (default: ACTIVE)
- allow_duplicate_email: BooleanField
- allow_duplicate_phone: BooleanField

### Customer Cache Strategy
- Cache by customer_id: 15 min TTL
- Cache by customer_code: 15 min TTL
- Cache by phone: 5 min TTL
- Invalidate on update/delete
