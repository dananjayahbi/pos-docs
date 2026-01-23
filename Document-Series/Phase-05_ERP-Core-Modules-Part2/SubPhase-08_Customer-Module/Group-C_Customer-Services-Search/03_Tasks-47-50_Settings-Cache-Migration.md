# Tasks 47-50: Settings, Cache, and Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** C - Customer Services & Search  
> **Document:** 03 of 03  
> **Tasks Covered:** 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-42-46_Lookup-History.md](02_Tasks-42-46_Lookup-History.md)

---

## Document Overview

This document covers tenant-specific customer settings, caching strategy, and migrations for service layer models.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Create CustomerSettings Model | Medium | 25 min |
| 48 | Implement Default Settings | Medium | 20 min |
| 49 | Run Service Layer Migrations | Low | 15 min |
| 50 | Create Customer Cache | Medium | 25 min |

---

## Task 47: Create CustomerSettings Model

### Overview
Create the CustomerSettings model to store tenant-specific configuration for the customer module.

### Dependencies
- Tenant model exists

### Instructions

1. **Create customer_settings.py model file**
   - Create `apps/customers/models/customer_settings.py`

2. **Define CustomerSettings model**
   - Add tenant (OneToOneField to Tenant)
   - Add customer_code_prefix (CharField, default='CUST')
   - Add customer_code_start (IntegerField, default=1)
   - Add require_email (BooleanField, default=False)
   - Add require_phone (BooleanField, default=False)
   - Add default_status (CharField, default='ACTIVE')
   - Add allow_duplicate_email (BooleanField, default=False)
   - Add allow_duplicate_phone (BooleanField, default=True)

3. **Update models/__init__.py**
   - Import CustomerSettings

### CustomerSettings Fields

```
┌─────────────────────────────────────────────────┐
│          CustomerSettings Model                 │
├─────────────────────────────────────────────────┤
│  • tenant (OneToOneField)                       │
│  • customer_code_prefix (CharField)             │
│  • customer_code_start (IntegerField)           │
│  • require_email (BooleanField)                 │
│  • require_phone (BooleanField)                 │
│  • default_status (CharField)                   │
│  • allow_duplicate_email (BooleanField)         │
│  • allow_duplicate_phone (BooleanField)         │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- Tenant-specific settings storage
- Configuration flexibility
- Default value management

### Verification Checklist
- [ ] customer_settings.py created
- [ ] CustomerSettings model defined
- [ ] All configuration fields added
- [ ] Model imported

---

## Task 48: Implement Default Settings

### Overview
Implement logic to apply default settings from CustomerSettings when creating customers.

### Dependencies
- Task 47: Create CustomerSettings Model

### Instructions

1. **Update CustomerService class**
   - Add get_or_create_settings method
   - Load settings for tenant

2. **Apply settings in create_customer**
   - Use settings for default status
   - Check require_email/require_phone
   - Use customer_code_prefix

3. **Add settings validation**
   - Validate duplicate email based on settings
   - Validate duplicate phone based on settings

### Expected Outcome
- Settings-driven customer creation
- Configurable validation rules
- Tenant-specific behavior

### Verification Checklist
- [ ] get_or_create_settings method added
- [ ] Settings applied in create_customer
- [ ] Validation uses settings
- [ ] Tested with different settings

---

## Task 49: Run Service Layer Migrations

### Overview
Generate and apply migrations for CustomerHistory and CustomerSettings models.

### Dependencies
- Task 48: Implement Default Settings

### Instructions

1. **Make migrations**
   - Run makemigrations for customers app
   - Review migration file

2. **Apply migrations**
   - Run migrate command
   - Verify tables created

3. **Test models**
   - Create CustomerSettings record
   - Create CustomerHistory record

### Expected Outcome
- All service layer models migrated
- Database tables created
- Models functional

### Verification Checklist
- [ ] makemigrations executed
- [ ] migrate executed
- [ ] Tables verified in database
- [ ] Test records created successfully

---

## Task 50: Create Customer Cache

### Overview
Implement Redis caching for frequently accessed customers to improve performance.

### Dependencies
- Redis configured

### Instructions

1. **Create cache_service.py file**
   - Create `apps/customers/services/cache_service.py`

2. **Define CustomerCacheService class**

3. **Implement caching methods**
   - cache_customer(customer_id, customer_data, ttl=900)
   - get_cached_customer(customer_id)
   - invalidate_customer_cache(customer_id)

4. **Integrate with CustomerService**
   - Check cache before database query
   - Update cache after customer changes
   - Invalidate on delete/update

### Caching Strategy

```
Customer Cache Flow
═══════════════════

Get Customer:
  1. Check Redis cache
  2. If found, return cached data
  3. If not found, query database
  4. Cache result (15 min TTL)
  5. Return customer

Update Customer:
  1. Update database
  2. Invalidate cache
  3. Re-cache with new data

Cache Keys:
  • customer:{tenant_id}:{customer_id}
  • customer_code:{tenant_id}:{customer_code}
  • customer_phone:{tenant_id}:{phone}
```

### Expected Outcome
- Redis caching implementation
- Performance optimization
- Reduced database load

### Verification Checklist
- [ ] cache_service.py created
- [ ] Caching methods implemented
- [ ] Integrated with CustomerService
- [ ] Cache invalidation working
- [ ] Performance improvement verified

---

## Summary

This document completed service layer infrastructure:

### Completed Features
- ✅ CustomerSettings model for tenant configuration
- ✅ Default settings application
- ✅ Service layer migrations
- ✅ Redis caching implementation

### Key Achievements
1. **Configuration** - Tenant-specific settings
2. **Performance** - Redis caching
3. **Flexibility** - Configurable validation
4. **Scalability** - Optimized queries

### Group C Complete
All customer services and search functionality implemented:
- CustomerService with CRUD operations
- Full-text search capability
- Quick lookup methods
- History tracking
- Settings management
- Caching layer

---

**Document Status:** ✅ Complete  
**Total Tasks:** 4  
**Total Lines:** ~700
