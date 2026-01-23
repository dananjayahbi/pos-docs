# Tasks 35-41: Service and Search

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** C - Customer Services & Search  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-42-46_Lookup-History.md](02_Tasks-42-46_Lookup-History.md)

---

## Document Overview

This document covers the CustomerService class implementation with CRUD operations and full-text search capabilities using PostgreSQL.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create CustomerService Class | High | 30 min |
| 36 | Implement Customer Creation | Medium | 25 min |
| 37 | Implement Customer Update | Medium | 25 min |
| 38 | Implement Customer Deactivation | Medium | 20 min |
| 39 | Implement Customer Search | High | 30 min |
| 40 | Create PostgreSQL Search Vector | Medium | 25 min |
| 41 | Implement Search Vector Update Trigger | Medium | 25 min |

---

## Task 35: Create CustomerService Class

### Overview
Create the CustomerService class to encapsulate all customer-related business logic. This service provides methods for CRUD operations, ensuring consistent behavior across the application.

### Dependencies
- Customer model exists

### Instructions

1. **Create customer_service.py file**
   - Create `apps/customers/services/customer_service.py`

2. **Define CustomerService class**
   - Add class docstring explaining purpose

3. **Add initialization method**
   - Accept optional tenant parameter

4. **Define method stubs**
   - create_customer()
   - update_customer()
   - deactivate_customer()
   - reactivate_customer()
   - block_customer()
   - get_customer()
   - list_customers()

5. **Update services/__init__.py**
   - Import CustomerService

### Service Layer Benefits

```
Service Layer Architecture
═══════════════════════════

Benefits:
  • Centralized business logic
  • Reusable across views/APIs
  • Easier testing
  • Transaction management
  • Consistent error handling
```

### Expected Outcome
- CustomerService class structure
- Method stubs defined
- Ready for implementation

### Verification Checklist
- [ ] customer_service.py file created
- [ ] CustomerService class defined
- [ ] Method stubs added
- [ ] Service imported in __init__.py

---

## Task 36: Implement Customer Creation

### Overview
Implement the create_customer method to handle customer creation with addresses and phone numbers in a single transaction.

### Dependencies
- Task 35: Create CustomerService Class

### Instructions

1. **Implement create_customer method**
   - Accept customer_data, addresses_data, phones_data, user parameters
   - Use database transaction
   - Create customer record
   - Create related addresses
   - Create related phone numbers
   - Auto-generate customer_code
   - Set created_by user
   - Return created customer

2. **Add validation**
   - Validate required fields based on customer_type
   - Check for duplicate email/phone
   - Validate address data

3. **Add error handling**
   - Wrap in try-except
   - Rollback on error
   - Return meaningful error messages

### Customer Creation Flow

```
Create Customer Transaction
════════════════════════════

1. Begin transaction
2. Validate customer_data
3. Generate customer_code
4. Create Customer instance
5. Create CustomerAddress instances
6. Create CustomerPhone instances
7. Commit transaction
8. Return customer with related data
```

### Expected Outcome
- Transactional customer creation
- Support for addresses and phones
- Automatic code generation
- Validation and error handling

### Verification Checklist
- [ ] create_customer method implemented
- [ ] Transaction wrapper added
- [ ] Validation logic included
- [ ] Error handling implemented
- [ ] Returns created customer

---

## Task 37: Implement Customer Update

### Overview
Implement the update_customer method to handle customer profile updates with change tracking.

### Dependencies
- Task 36: Implement Customer Creation

### Instructions

1. **Implement update_customer method**
   - Accept customer_id, update_data, user parameters
   - Load existing customer
   - Track changed fields
   - Update customer fields
   - Save customer
   - Log changes to history
   - Return updated customer

2. **Add field change tracking**
   - Compare old vs new values
   - Log significant changes

3. **Handle related data updates**
   - Support address updates
   - Support phone updates
   - Maintain relationships

### Expected Outcome
- Customer update capability
- Change tracking
- History logging

### Verification Checklist
- [ ] update_customer method implemented
- [ ] Change tracking added
- [ ] History logging included
- [ ] Returns updated customer

---

## Task 38: Implement Customer Deactivation

### Overview
Implement methods to deactivate, reactivate, and block customers with reason tracking.

### Dependencies
- Task 37: Implement Customer Update

### Instructions

1. **Implement deactivate_customer method**
   - Set status to INACTIVE
   - Record reason
   - Set deactivated_by user

2. **Implement reactivate_customer method**
   - Set status to ACTIVE
   - Clear deactivation reason

3. **Implement block_customer method**
   - Set status to BLOCKED
   - Record block reason
   - Set blocked_by user
   - Send notification

### Customer Status Management

```
Status Change Methods
═════════════════════

deactivate_customer(customer_id, reason, user)
  → status = INACTIVE

reactivate_customer(customer_id, user)
  → status = ACTIVE

block_customer(customer_id, reason, user)
  → status = BLOCKED
```

### Expected Outcome
- Status management methods
- Reason tracking
- User attribution

### Verification Checklist
- [ ] deactivate_customer implemented
- [ ] reactivate_customer implemented
- [ ] block_customer implemented
- [ ] Reason tracking added

---

## Task 39: Implement Customer Search

### Overview
Implement full-text search functionality for customers using PostgreSQL's text search capabilities.

### Dependencies
- Task 38: Implement Customer Deactivation

### Instructions

1. **Create search_service.py file**
   - Create `apps/customers/services/search_service.py`

2. **Define CustomerSearchService class**

3. **Implement search method**
   - Accept query string and filters
   - Use PostgreSQL full-text search
   - Support field-specific search
   - Return ranked results

4. **Add search filters**
   - Filter by status
   - Filter by customer_type
   - Filter by date range
   - Filter by tags

### Search Implementation

```
PostgreSQL Full-Text Search
════════════════════════════

Query:
  SELECT * FROM customers
  WHERE search_vector @@ to_tsquery('english', 'saman & perera')
  ORDER BY ts_rank(search_vector, to_tsquery('...')) DESC
```

### Expected Outcome
- Full-text search capability
- Multiple filter support
- Ranked results

### Verification Checklist
- [ ] search_service.py created
- [ ] CustomerSearchService defined
- [ ] search method implemented
- [ ] Filters supported

---

## Task 40: Create PostgreSQL Search Vector

### Overview
Add a search_vector field to the Customer model using PostgreSQL's tsvector type for full-text search indexing.

### Dependencies
- Task 39: Implement Customer Search

### Instructions

1. **Add search_vector field to Customer model**
   - Use SearchVectorField (django.contrib.postgres)
   - Index the field
   - Not editable

2. **Define search_vector content**
   - Include first_name, last_name
   - Include company_name
   - Include email
   - Include customer_code

3. **Create migration**
   - Add search_vector field
   - Add GIN index on search_vector

### Search Vector Configuration

```
Search Vector Content
═════════════════════

Indexed Fields:
  • first_name
  • last_name  
  • company_name
  • email
  • customer_code

Combined with tsvector:
  to_tsvector('english', 
    coalesce(first_name, '') || ' ' ||
    coalesce(last_name, '') || ' ' ||
    coalesce(company_name, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(customer_code, '')
  )
```

### Expected Outcome
- search_vector field added
- GIN index created
- Ready for full-text search

### Verification Checklist
- [ ] search_vector field added
- [ ] Field configuration complete
- [ ] GIN index added
- [ ] Migration created

---

## Task 41: Implement Search Vector Update Trigger

### Overview
Create a database trigger to automatically update the search_vector field whenever customer data changes.

### Dependencies
- Task 40: Create PostgreSQL Search Vector

### Instructions

1. **Create migration for trigger**
   - Create custom migration file

2. **Define trigger function**
   - PostgreSQL function to update search_vector
   - Called on INSERT or UPDATE

3. **Create trigger**
   - BEFORE INSERT OR UPDATE trigger
   - Calls update function

4. **Test trigger**
   - Create customer, verify search_vector populated
   - Update customer, verify search_vector updated

### Trigger SQL

```
PostgreSQL Trigger
══════════════════

CREATE FUNCTION update_customer_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english',
      coalesce(NEW.first_name, '') || ' ' ||
      coalesce(NEW.last_name, '') || ' ' ||
      coalesce(NEW.company_name, '') || ' ' ||
      coalesce(NEW.email, '') || ' ' ||
      coalesce(NEW.customer_code, '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_search_vector_update
BEFORE INSERT OR UPDATE ON customers_customer
FOR EACH ROW EXECUTE FUNCTION update_customer_search_vector();
```

### Expected Outcome
- Automatic search_vector updates
- No manual maintenance needed
- Always up-to-date search index

### Verification Checklist
- [ ] Trigger migration created
- [ ] Trigger function defined
- [ ] Trigger created
- [ ] Trigger tested and working

---

## Summary

This document implemented customer service layer and search:

### Completed Features
- ✅ CustomerService class with CRUD operations
- ✅ Customer creation with addresses and phones
- ✅ Customer update with change tracking
- ✅ Status management (deactivate, reactivate, block)
- ✅ Full-text search implementation
- ✅ PostgreSQL search vector field
- ✅ Automatic search vector update trigger

### Key Achievements
1. **Service Layer** - Centralized business logic
2. **Transactional Operations** - Data consistency
3. **Search Capability** - Fast full-text search
4. **Change Tracking** - Audit trail
5. **Status Management** - Customer lifecycle control

### Next Steps
Proceed to [02_Tasks-42-46_Lookup-History.md](02_Tasks-42-46_Lookup-History.md) for quick search, lookup methods, and history tracking.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~900
