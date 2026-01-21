# Group E: Segmentation & Duplicate Detection

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Implement customer tagging, segmentation, and duplicate merge

---

## Navigation

- **↑ Parent:** [SubPhase-08 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Communication & History](../Group-D_Communication-History/)
- **→ Next Group:** [Group F: Import/Export & API](../Group-F_Import-Export-API/)

---

## Group Overview

### Key Outcomes

1. **CustomerTag Model** - Customer tags/labels
2. **Tag Fields** - name, color, description
3. **CustomerTagAssignment** - Many-to-many relationship
4. **Tag Migrations** - Apply migrations
5. **Tag Assignment** - Assign/remove tags
6. **Tag-based Filtering** - Filter by tags
7. **CustomerSegment Model** - Dynamic segments
8. **Segment Rule Fields** - JSONField for criteria
9. **Segment Evaluation** - Evaluate against rules
10. **Duplicate Detection** - Detect by email, phone, name
11. **Duplicate Score Algorithm** - Similarity scoring
12. **Customer Merge** - Merge duplicates, consolidate
13. **Merge History** - Track merged customers
14. **Segment Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Tag and segment models |
| JSONField | Segment rule storage |
| Fuzzy Matching | Duplicate detection |
| Service Layer | Merge logic |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-65-70_Tags.md` | 65-70 | CustomerTag model, fields, assignment, migrations, assign/remove, filtering |
| 02 | `02_Tasks-71-73_Segments.md` | 71-73 | CustomerSegment model, rule fields, evaluation |
| 03 | `03_Tasks-74-78_Duplicate-Detection-Merge.md` | 74-78 | Duplicate detection, scoring, merge, history, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create CustomerTag Model | Medium | 25 min |
| 66 | Add Tag Fields | Low | 15 min |
| 67 | Create CustomerTagAssignment | Medium | 20 min |
| 68 | Run Tag Migrations | Low | 15 min |
| 69 | Implement Tag Assignment | Medium | 20 min |
| 70 | Implement Tag-based Filtering | Medium | 25 min |
| 71 | Create CustomerSegment Model | Medium | 25 min |
| 72 | Add Segment Rule Fields | Medium | 25 min |
| 73 | Implement Segment Evaluation | High | 35 min |
| 74 | Implement Duplicate Detection | High | 30 min |
| 75 | Create Duplicate Score Algorithm | High | 35 min |
| 76 | Implement Customer Merge | High | 40 min |
| 77 | Create Merge History | Medium | 25 min |
| 78 | Run Segment Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 65-70: Customer tags and filtering]
         │
         ▼
[Tasks 71-73: Dynamic segments]
         │
         ▼
[Tasks 74-78: Duplicate detection and merge]
```

---

## Expected Deliverables

```
apps/customers/
├── models/
│   ├── __init__.py
│   ├── customer_tag.py           # Tasks 65-67
│   ├── customer_segment.py       # Tasks 71-72
│   └── customer_merge.py         # Task 77
├── services/
│   ├── __init__.py
│   ├── tag_service.py            # Tasks 69-70
│   ├── segment_service.py        # Task 73
│   └── duplicate_service.py      # Tasks 74-76
└── migrations/
    └── 0006_tag_segment_merge.py # Task 78
```

---

## Notes for AI Agents

### CustomerTag Model
- name: CharField (unique per tenant)
- color: CharField (hex color)
- description: TextField
- created_by: FK to User
- created_at: DateTimeField
- is_active: BooleanField

### CustomerTagAssignment Model
- customer: FK to Customer
- tag: FK to CustomerTag
- assigned_by: FK to User
- assigned_at: DateTimeField

### Tag Colors
```
VIP: #FFD700 (gold)
New Customer: #4CAF50 (green)
At Risk: #F44336 (red)
High Value: #2196F3 (blue)
Wholesale: #9C27B0 (purple)
```

### CustomerSegment Model
- name: CharField
- description: TextField
- rules: JSONField
- is_active: BooleanField
- auto_assign: BooleanField
- created_by: FK to User

### Segment Rule Format
```json
{
  "conditions": [
    {"field": "total_purchases", "operator": "gte", "value": 100000},
    {"field": "order_count", "operator": "gte", "value": 10}
  ],
  "logic": "AND"
}
```

### Segment Rule Operators
| Operator | Description |
|----------|-------------|
| eq | Equals |
| neq | Not equals |
| gt | Greater than |
| gte | Greater than or equal |
| lt | Less than |
| lte | Less than or equal |
| contains | Contains string |
| in | In list |
| not_in | Not in list |

### Duplicate Detection Criteria
- Exact email match
- Exact phone match
- Similar name (fuzzy matching)
- Similar company name

### Duplicate Score Algorithm
| Field Match | Score |
|-------------|-------|
| Exact email | 100 |
| Exact phone | 90 |
| Similar name (>90%) | 80 |
| Similar company (>90%) | 70 |
| Same address | 50 |

### Customer Merge Flow
```
Customer A (keep)  +  Customer B (merge)
       │
       ▼
Consolidate:
- All orders → Customer A
- All invoices → Customer A
- All payments → Customer A
- All addresses → Customer A
- All phones → Customer A
- Aggregate totals
       │
       ▼
Customer B → status: MERGED
       │
       ▼
Create Merge History record
```

### MergeHistory Model
- primary_customer: FK (kept customer)
- merged_customer_id: UUID (merged customer)
- merged_customer_code: CharField
- merged_customer_data: JSONField (snapshot)
- merged_by: FK to User
- merged_at: DateTimeField
