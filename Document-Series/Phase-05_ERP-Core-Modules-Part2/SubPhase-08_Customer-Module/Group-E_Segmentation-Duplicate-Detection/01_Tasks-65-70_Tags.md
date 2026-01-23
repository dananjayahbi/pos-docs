# Tasks 65-70: Customer Tags

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** E - Segmentation & Duplicate Detection  
> **Document:** 01 of 03  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-71-73_Segments.md](02_Tasks-71-73_Segments.md)

---

## Document Overview

This document covers customer tagging system for organizing and categorizing customers with flexible labels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create CustomerTag Model | Medium | 25 min |
| 66 | Add Tag Fields | Low | 15 min |
| 67 | Create CustomerTagAssignment | Medium | 20 min |
| 68 | Run Tag Migrations | Low | 15 min |
| 69 | Implement Tag Assignment | Medium | 20 min |
| 70 | Implement Tag-based Filtering | Medium | 25 min |

---

## Task 65: Create CustomerTag Model

### Overview
Create the CustomerTag model to define reusable tags/labels that can be assigned to customers.

### Dependencies
- Django and django-tenants installed

### Instructions

1. **Create customer_tag.py file** in models/
2. **Define CustomerTag model** inheriting from tenant-aware base
3. **Add tenant relationship** using TenantForeignKey
4. **Add audit fields**
   - created_by (User)
   - created_at (DateTimeField)
   - updated_at (DateTimeField)

### Expected Outcome
- CustomerTag model created

### Verification Checklist
- [ ] customer_tag.py file created
- [ ] CustomerTag model defined
- [ ] Tenant-aware model configured
- [ ] Audit fields added

---

## Task 66: Add Tag Fields

### Overview
Add all required fields to the CustomerTag model for proper tag management.

### Dependencies
- Task 65: Create CustomerTag Model

### Instructions

1. **Add name field**
   - CharField, max_length=100
   - Unique per tenant
   - Required

2. **Add color field**
   - CharField, max_length=7
   - Hex color format (#RRGGBB)
   - Optional, default="#808080"

3. **Add description field**
   - TextField
   - Optional

4. **Add is_active field**
   - BooleanField
   - Default True

### Tag Color Presets

| Tag Category | Color | Hex Code |
|--------------|-------|----------|
| VIP | Gold | #FFD700 |
| New Customer | Green | #4CAF50 |
| At Risk | Red | #F44336 |
| High Value | Blue | #2196F3 |
| Wholesale | Purple | #9C27B0 |
| Retail | Teal | #009688 |
| Inactive | Gray | #808080 |

### Expected Outcome
- Complete tag field structure

### Verification Checklist
- [ ] name field added
- [ ] color field added with hex format
- [ ] description field added
- [ ] is_active field added
- [ ] String representation defined

---

## Task 67: Create CustomerTagAssignment

### Overview
Create the many-to-many relationship model to assign tags to customers.

### Dependencies
- Task 66: Add Tag Fields

### Instructions

1. **Define CustomerTagAssignment model**
2. **Add relationship fields**
   - customer (FK to Customer)
   - tag (FK to CustomerTag)
   - assigned_by (FK to User)
   - assigned_at (DateTimeField)

3. **Add constraints**
   - Unique together: (customer, tag)
   - Prevent duplicate assignments

4. **Add Meta options**
   - ordering: ['-assigned_at']
   - indexes: customer, tag

### Expected Outcome
- Many-to-many assignment model

### Verification Checklist
- [ ] CustomerTagAssignment model created
- [ ] All relationship fields added
- [ ] Unique constraint configured
- [ ] Indexes created

---

## Task 68: Run Tag Migrations

### Overview
Generate and apply migrations for tag models.

### Dependencies
- Task 67: Create CustomerTagAssignment

### Instructions

1. **Generate migrations**
   - Include CustomerTag model
   - Include CustomerTagAssignment model

2. **Apply migrations**
   - Run for public schema
   - Run for all tenant schemas

3. **Verify tables**
   - Check customers_customertag
   - Check customers_customertagassignment

### Expected Outcome
- Tag tables created in database

### Verification Checklist
- [ ] Migrations generated
- [ ] Migrations applied to public schema
- [ ] Migrations applied to tenant schemas
- [ ] Tables verified in database

---

## Task 69: Implement Tag Assignment

### Overview
Create service methods to assign and remove tags from customers.

### Dependencies
- Task 68: Run Tag Migrations

### Instructions

1. **Create tag_service.py file** in services/
2. **Define CustomerTagService class**

3. **Implement assign_tag method**
   - Accept customer, tag, assigned_by
   - Create CustomerTagAssignment
   - Prevent duplicate assignments
   - Log assignment

4. **Implement remove_tag method**
   - Accept customer, tag
   - Delete assignment
   - Log removal

5. **Implement bulk_assign_tags method**
   - Accept customer, list of tags
   - Assign multiple tags atomically

6. **Implement get_customer_tags method**
   - Return all active tags for customer
   - Include assignment info

### Tag Assignment Flow

```
Customer + Tag Selection
        │
        ▼
Check for Existing Assignment
        │
        ├─ Exists → Return error or skip
        │
        └─ New → Create CustomerTagAssignment
                  │
                  ▼
            Log Assignment
                  │
                  ▼
            Return Success
```

### Expected Outcome
- Tag assignment service methods

### Verification Checklist
- [ ] tag_service.py created
- [ ] assign_tag method implemented
- [ ] remove_tag method implemented
- [ ] bulk_assign_tags method implemented
- [ ] get_customer_tags method implemented
- [ ] Duplicate prevention working

---

## Task 70: Implement Tag-based Filtering

### Overview
Implement filtering customers by tags for search and segmentation.

### Dependencies
- Task 69: Implement Tag Assignment

### Instructions

1. **Implement filter_by_tag method**
   - Accept tag or tag name
   - Return queryset of customers
   - Include pagination support

2. **Implement filter_by_tags method**
   - Accept list of tags
   - Support AND/OR logic
   - Return filtered customers

3. **Implement get_tag_statistics method**
   - Count customers per tag
   - Calculate tag usage

### Tag Filtering Examples

| Filter Type | Logic | Description |
|-------------|-------|-------------|
| Single Tag | - | Customers with tag "VIP" |
| Multiple (AND) | tag1 AND tag2 | Customers with both tags |
| Multiple (OR) | tag1 OR tag2 | Customers with either tag |
| Exclusion | NOT tag | Customers without tag |

### Tag Statistics Format

```json
{
  "tags": [
    {
      "tag_name": "VIP",
      "customer_count": 45,
      "percentage": 5.2
    }
  ],
  "total_tagged_customers": 250,
  "total_customers": 860
}
```

### Expected Outcome
- Tag-based filtering and statistics

### Verification Checklist
- [ ] filter_by_tag method implemented
- [ ] filter_by_tags method implemented
- [ ] AND/OR logic supported
- [ ] get_tag_statistics method implemented
- [ ] Efficient queries used

---

## Summary

This document implemented customer tagging system:

### Completed Features
- ✅ CustomerTag model with name, color, description
- ✅ CustomerTagAssignment many-to-many model
- ✅ Tag migrations applied
- ✅ Tag assignment and removal
- ✅ Bulk tag operations
- ✅ Tag-based filtering (single/multiple, AND/OR)
- ✅ Tag usage statistics

### Key Achievements
1. **Flexible Tagging** - Reusable tags for customer organization
2. **Color Coding** - Visual categorization with hex colors
3. **Assignment Tracking** - Audit trail for tag assignments
4. **Advanced Filtering** - Complex tag-based queries
5. **Statistics** - Tag usage analytics

### Next Steps
Proceed to Document 02 for dynamic customer segments.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~630
