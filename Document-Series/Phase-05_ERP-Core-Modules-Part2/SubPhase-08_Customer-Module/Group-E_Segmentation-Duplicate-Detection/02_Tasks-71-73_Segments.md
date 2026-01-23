# Tasks 71-73: Dynamic Customer Segments

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** E - Segmentation & Duplicate Detection  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-70_Tags.md](01_Tasks-65-70_Tags.md)
- **→ Next Document:** [03_Tasks-74-78_Duplicate-Detection-Merge.md](03_Tasks-74-78_Duplicate-Detection-Merge.md)

---

## Document Overview

This document covers dynamic customer segmentation based on rules and criteria for automated customer categorization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create CustomerSegment Model | Medium | 25 min |
| 72 | Add Segment Rule Fields | Medium | 25 min |
| 73 | Implement Segment Evaluation | High | 35 min |

---

## Task 71: Create CustomerSegment Model

### Overview
Create the CustomerSegment model to define dynamic customer segments based on rules.

### Dependencies
- Django and django-tenants installed

### Instructions

1. **Create customer_segment.py file** in models/
2. **Define CustomerSegment model** inheriting from tenant-aware base
3. **Add tenant relationship**
4. **Add basic fields**
   - name (CharField)
   - description (TextField)
   - is_active (BooleanField)
   - created_by (FK to User)
   - created_at, updated_at

### Expected Outcome
- CustomerSegment model created

### Verification Checklist
- [ ] customer_segment.py file created
- [ ] CustomerSegment model defined
- [ ] Tenant-aware configuration
- [ ] Basic fields added

---

## Task 72: Add Segment Rule Fields

### Overview
Add JSONField for storing dynamic segment rules and criteria.

### Dependencies
- Task 71: Create CustomerSegment Model

### Instructions

1. **Add rules field**
   - JSONField
   - Store conditions and logic

2. **Add auto_assign field**
   - BooleanField
   - Default False
   - Enable automatic assignment

3. **Add customer_count field**
   - IntegerField
   - Cache matched customer count
   - Updated periodically

### Segment Rule Structure

```json
{
  "conditions": [
    {
      "field": "total_purchases",
      "operator": "gte",
      "value": 100000
    },
    {
      "field": "order_count",
      "operator": "gte",
      "value": 10
    }
  ],
  "logic": "AND"
}
```

### Supported Fields for Rules

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| customer_type | String | Individual, Company, Government |
| status | String | Active, Inactive, Potential |
| total_purchases | Decimal | Lifetime purchase amount |
| order_count | Integer | Total orders placed |
| days_since_last_purchase | Integer | Days since last order |
| average_order_value | Decimal | AOV calculation |
| credit_limit | Decimal | Credit limit amount |
| outstanding_balance | Decimal | Current balance |
| province | String | Sri Lanka province |
| district | String | Sri Lanka district |
| has_tag | String | Tag name |
| created_at | Date | Registration date |

### Supported Operators

| Operator | Description | Applies To |
|----------|-------------|------------|
| eq | Equals | All types |
| neq | Not equals | All types |
| gt | Greater than | Numbers, dates |
| gte | Greater than or equal | Numbers, dates |
| lt | Less than | Numbers, dates |
| lte | Less than or equal | Numbers, dates |
| contains | Contains substring | Strings |
| in | In list | All types |
| not_in | Not in list | All types |
| is_null | Is null/empty | All types |
| is_not_null | Is not null | All types |

### Segment Rule Examples

#### High-Value Customers
```json
{
  "conditions": [
    {"field": "total_purchases", "operator": "gte", "value": 500000},
    {"field": "status", "operator": "eq", "value": "Active"}
  ],
  "logic": "AND"
}
```

#### At-Risk Customers
```json
{
  "conditions": [
    {"field": "days_since_last_purchase", "operator": "gte", "value": 90},
    {"field": "order_count", "operator": "gte", "value": 5}
  ],
  "logic": "AND"
}
```

#### New Wholesale Customers
```json
{
  "conditions": [
    {"field": "customer_type", "operator": "eq", "value": "Company"},
    {"field": "order_count", "operator": "lte", "value": 3},
    {"field": "days_since_registration", "operator": "lte", "value": 30}
  ],
  "logic": "AND"
}
```

#### Regional Segment (Colombo District)
```json
{
  "conditions": [
    {"field": "district", "operator": "eq", "value": "Colombo"}
  ],
  "logic": "AND"
}
```

### Expected Outcome
- Complete segment rule configuration

### Verification Checklist
- [ ] rules JSONField added
- [ ] auto_assign field added
- [ ] customer_count field added
- [ ] Rule validation logic planned

---

## Task 73: Implement Segment Evaluation

### Overview
Implement the evaluation engine to match customers against segment rules.

### Dependencies
- Task 72: Add Segment Rule Fields

### Instructions

1. **Create segment_service.py file** in services/
2. **Define CustomerSegmentService class**

3. **Implement evaluate_customer method**
   - Accept customer and segment
   - Parse segment rules
   - Evaluate each condition
   - Apply logic (AND/OR)
   - Return boolean match result

4. **Implement get_segment_customers method**
   - Accept segment
   - Query all customers
   - Evaluate against rules
   - Return matching customers

5. **Implement evaluate_all_segments method**
   - Accept customer
   - Check all active segments
   - Return list of matching segments

6. **Implement auto_assign_segments method**
   - Evaluate customer against auto-assign segments
   - Assign matching segments automatically
   - Run on customer create/update

7. **Implement refresh_segment_counts method**
   - Recalculate customer_count for all segments
   - Schedule periodic execution

### Segment Evaluation Flow

```
Customer Data + Segment Rules
        │
        ▼
Parse Segment Conditions
        │
        ▼
For Each Condition:
  - Get field value from customer
  - Apply operator
  - Evaluate true/false
        │
        ▼
Apply Logic (AND/OR)
        │
        ├─ AND → All conditions must be true
        │
        └─ OR → At least one condition true
        │
        ▼
Return Match Result (Boolean)
```

### Operator Implementation Logic

| Operator | Implementation |
|----------|---------------|
| eq | field_value == condition_value |
| neq | field_value != condition_value |
| gt | field_value > condition_value |
| gte | field_value >= condition_value |
| lt | field_value < condition_value |
| lte | field_value <= condition_value |
| contains | condition_value in field_value |
| in | field_value in condition_value_list |
| not_in | field_value not in condition_value_list |
| is_null | field_value is None or empty |
| is_not_null | field_value is not None |

### Field Value Resolution

Handle different field types:
- **Direct fields:** customer.status, customer.customer_type
- **Calculated fields:** total_purchases, order_count, days_since_last_purchase
- **Related fields:** province, district from addresses
- **Aggregated fields:** average_order_value, outstanding_balance

### Performance Considerations

1. **Caching**
   - Cache segment evaluation results
   - TTL: 1 hour

2. **Batch Evaluation**
   - Process customers in batches
   - Avoid N+1 queries

3. **Indexed Fields**
   - Ensure indexed fields for common conditions
   - Optimize queries for large datasets

4. **Async Processing**
   - Run segment refresh asynchronously
   - Use Celery for background tasks

### Expected Outcome
- Complete segment evaluation engine

### Verification Checklist
- [ ] segment_service.py created
- [ ] evaluate_customer method implemented
- [ ] get_segment_customers method implemented
- [ ] evaluate_all_segments method implemented
- [ ] auto_assign_segments method implemented
- [ ] refresh_segment_counts method implemented
- [ ] All operators supported
- [ ] AND/OR logic working
- [ ] Performance optimized

---

## Summary

This document implemented dynamic customer segmentation:

### Completed Features
- ✅ CustomerSegment model with rule storage
- ✅ JSONField for flexible rule definitions
- ✅ Auto-assign capability
- ✅ Segment evaluation engine
- ✅ Support for 11+ operators
- ✅ AND/OR logic
- ✅ Batch customer evaluation
- ✅ Automatic segment assignment
- ✅ Segment count caching

### Key Achievements
1. **Dynamic Rules** - Flexible JSON-based segment criteria
2. **Rich Operators** - Comprehensive comparison options
3. **Evaluation Engine** - Robust customer matching logic
4. **Auto-assignment** - Automated segment membership
5. **Performance** - Optimized queries and caching

### Segment Use Cases
- High-value customer identification
- At-risk customer detection
- Geographic segmentation
- Purchase behavior grouping
- Lifecycle stage segmentation

### Next Steps
Proceed to Document 03 for duplicate detection and customer merge.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 3  
**Total Lines:** ~710
