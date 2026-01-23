# Tasks 42-46: Lookup and History

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** C - Customer Services & Search  
> **Document:** 02 of 03  
> **Tasks Covered:** 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-41_Service-Search.md](01_Tasks-35-41_Service-Search.md)
- **→ Next Document:** [03_Tasks-47-50_Settings-Cache-Migration.md](03_Tasks-47-50_Settings-Cache-Migration.md)

---

## Document Overview

This document covers quick search methods, customer lookup by phone and email, and history logging functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 42 | Implement Quick Search | Medium | 20 min |
| 43 | Implement Customer Lookup by Phone | Medium | 20 min |
| 44 | Implement Customer Lookup by Email | Medium | 20 min |
| 45 | Create CustomerHistory Model | Medium | 25 min |
| 46 | Implement History Logging | Medium | 25 min |

---

## Task 42: Implement Quick Search

### Overview
Implement quick search method for fast customer lookup by customer code or phone number, commonly used in POS scenarios.

### Dependencies
- CustomerSearchService exists

### Instructions

1. **Add quick_search method to CustomerSearchService**
   - Detect query type (code vs phone)
   - If starts with 'CUST-', search by code
   - If starts with '+94' or '07', search by phone
   - Otherwise, use full-text search

2. **Optimize for speed**
   - Direct database queries for exact matches
   - Use indexes effectively

### Expected Outcome
- Fast customer lookup
- Smart query detection
- POS-optimized

### Verification Checklist
- [ ] quick_search method implemented
- [ ] Query type detection added
- [ ] Optimized for performance

---

## Task 43: Implement Customer Lookup by Phone

### Overview
Implement dedicated phone lookup method for finding customers by phone number, critical for POS and customer service scenarios.

### Dependencies
- Task 42: Implement Quick Search

### Instructions

1. **Implement lookup_by_phone method**
   - Search in Customer.primary_phone
   - Search in CustomerPhone records
   - Normalize phone format
   - Return customers with matching phone

2. **Add phone normalization**
   - Strip spaces and special characters
   - Handle +94 and 0XX formats
   - Compare normalized numbers

### Expected Outcome
- Phone-based customer lookup
- Format-agnostic search
- Multiple match handling

### Verification Checklist
- [ ] lookup_by_phone method implemented
- [ ] Phone normalization added
- [ ] Searches primary and secondary phones

---

## Task 44: Implement Customer Lookup by Email

### Overview
Implement email lookup method for finding customers by email address, used in webstore and customer portal scenarios.

### Dependencies
- Task 43: Implement Customer Lookup by Phone

### Instructions

1. **Implement lookup_by_email method**
   - Case-insensitive email search
   - Exact match only
   - Return customer or None

2. **Add email normalization**
   - Convert to lowercase
   - Strip whitespace

### Expected Outcome
- Email-based customer lookup
- Case-insensitive search
- Single customer return

### Verification Checklist
- [ ] lookup_by_email method implemented
- [ ] Email normalization added
- [ ] Case-insensitive search working

---

## Task 45: Create CustomerHistory Model

### Overview
Create the CustomerHistory model to track all changes made to customer records, providing a complete audit trail.

### Dependencies
- Customer model exists

### Instructions

1. **Create customer_history.py model file**
   - Create `apps/customers/models/customer_history.py`

2. **Define CustomerHistory model**
   - Add id (UUIDField)
   - Add customer (ForeignKey)
   - Add changed_by (ForeignKey to User)
   - Add changed_at (DateTimeField)
   - Add field_name (CharField)
   - Add old_value (TextField)
   - Add new_value (TextField)
   - Add change_type (CharField with choices)

3. **Define ChangeType choices**
   - CREATE, UPDATE, DELETE, STATUS_CHANGE, MERGE

4. **Update models/__init__.py**
   - Import CustomerHistory

### CustomerHistory Model Structure

```
┌─────────────────────────────────────────────────┐
│          CustomerHistory Model                  │
├─────────────────────────────────────────────────┤
│  • customer (ForeignKey)                        │
│  • changed_by (ForeignKey to User)              │
│  • changed_at (DateTimeField)                   │
│  • field_name (CharField)                       │
│  • old_value (TextField)                        │
│  • new_value (TextField)                        │
│  • change_type (CharField)                      │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- History tracking model
- Change type categorization
- User attribution
- Timestamp tracking

### Verification Checklist
- [ ] customer_history.py created
- [ ] CustomerHistory model defined
- [ ] All fields added
- [ ] Change type choices defined
- [ ] Model imported

---

## Task 46: Implement History Logging

### Overview
Implement automatic history logging for customer changes, capturing before and after values for all significant field updates.

### Dependencies
- Task 45: Create CustomerHistory Model

### Instructions

1. **Create history_service.py file**
   - Create `apps/customers/services/history_service.py`

2. **Define HistoryService class**

3. **Implement log_change method**
   - Accept customer, field_name, old_value, new_value, changed_by
   - Create CustomerHistory record

4. **Implement log_creation method**
   - Log customer creation event

5. **Integrate with CustomerService**
   - Call history logging in update_customer
   - Call history logging in create_customer
   - Call history logging in status changes

### History Logging Flow

```
Change Tracking Flow
════════════════════

1. Load existing customer
2. Compare old vs new values
3. For each changed field:
   - Log to CustomerHistory
   - Record old_value
   - Record new_value
   - Record changed_by
   - Record timestamp
4. Save customer
```

### Expected Outcome
- Automatic change logging
- Complete audit trail
- Field-level tracking

### Verification Checklist
- [ ] history_service.py created
- [ ] HistoryService defined
- [ ] log_change method implemented
- [ ] log_creation method implemented
- [ ] Integrated with CustomerService

---

## Summary

This document implemented lookup and history functionality:

### Completed Features
- ✅ Quick search by code or phone
- ✅ Phone-based customer lookup
- ✅ Email-based customer lookup
- ✅ CustomerHistory model
- ✅ Automatic history logging

### Key Achievements
1. **Quick Access** - Fast lookup methods
2. **Multi-Channel** - Phone and email search
3. **Audit Trail** - Complete change history
4. **Transparency** - Who changed what and when

### Next Steps
Proceed to [03_Tasks-47-50_Settings-Cache-Migration.md](03_Tasks-47-50_Settings-Cache-Migration.md) for customer settings, caching, and migrations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~650
