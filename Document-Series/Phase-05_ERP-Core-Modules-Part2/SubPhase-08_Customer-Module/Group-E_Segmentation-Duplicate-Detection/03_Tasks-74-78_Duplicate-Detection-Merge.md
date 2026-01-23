# Tasks 74-78: Duplicate Detection and Customer Merge

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** E - Segmentation & Duplicate Detection  
> **Document:** 03 of 03  
> **Tasks Covered:** 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-71-73_Segments.md](02_Tasks-71-73_Segments.md)

---

## Document Overview

This document covers duplicate customer detection algorithms and merging functionality to maintain data integrity.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Implement Duplicate Detection | High | 30 min |
| 75 | Create Duplicate Score Algorithm | High | 35 min |
| 76 | Implement Customer Merge | High | 40 min |
| 77 | Create Merge History | Medium | 25 min |
| 78 | Run Segment Migrations | Low | 15 min |

---

## Task 74: Implement Duplicate Detection

### Overview
Implement algorithms to detect potential duplicate customers based on multiple criteria.

### Dependencies
- Customer model with all fields complete

### Instructions

1. **Create duplicate_service.py file** in services/
2. **Define DuplicateDetectionService class**

3. **Implement find_duplicates method**
   - Search by email
   - Search by phone
   - Search by name similarity
   - Search by company name
   - Return list of potential duplicates

4. **Implement find_duplicate_by_email method**
   - Exact email match
   - Case-insensitive

5. **Implement find_duplicate_by_phone method**
   - Normalize phone format
   - Exact match after normalization

6. **Implement find_duplicate_by_name method**
   - Use fuzzy string matching
   - Threshold: 90% similarity

### Duplicate Detection Criteria

| Criterion | Match Type | Weight | Priority |
|-----------|-----------|--------|----------|
| Email | Exact | 100 | High |
| Phone | Exact (normalized) | 90 | High |
| Full Name | Fuzzy (>90%) | 80 | Medium |
| Company Name | Fuzzy (>90%) | 70 | Medium |
| Address | Similar | 50 | Low |

### Phone Normalization Rules

| Input | Normalized |
|-------|------------|
| +94712345678 | 94712345678 |
| 0712345678 | 94712345678 |
| 712345678 | 94712345678 |
| 94-71-2345678 | 94712345678 |

### Name Fuzzy Matching

Use Levenshtein distance or similar algorithm:
- "John Perera" vs "Jon Perera" → 95% similar
- "ABC Company Ltd" vs "ABC Company Limited" → 92% similar

### Expected Outcome
- Duplicate detection algorithms

### Verification Checklist
- [ ] duplicate_service.py created
- [ ] find_duplicates method implemented
- [ ] Email matching working
- [ ] Phone matching with normalization
- [ ] Name fuzzy matching implemented
- [ ] Returns potential matches with scores

---

## Task 75: Create Duplicate Score Algorithm

### Overview
Implement scoring system to rank duplicate matches by confidence level.

### Dependencies
- Task 74: Implement Duplicate Detection

### Instructions

1. **Implement calculate_duplicate_score method**
   - Accept two customer records
   - Compare all criteria
   - Calculate weighted score
   - Return score (0-100)

2. **Implement field comparison functions**
   - compare_emails
   - compare_phones
   - compare_names
   - compare_companies
   - compare_addresses

3. **Implement get_duplicate_confidence method**
   - Score 90-100: High confidence
   - Score 70-89: Medium confidence
   - Score 50-69: Low confidence
   - Score <50: No match

### Duplicate Scoring Algorithm

```
Total Score = Sum of Matching Criteria Scores

Email Match (Exact):          +100 points
Phone Match (Exact):          +90 points
Name Match (>90% similar):    +80 points
Company Match (>90% similar): +70 points
Address Match (Same):         +50 points
District Match (Same):        +20 points
Province Match (Same):        +10 points
```

### Scoring Examples

#### Example 1: High Confidence (Score = 190)
```
Customer A: john@example.com, 0712345678, "John Perera"
Customer B: john@example.com, 0712345678, "John Perera"

Score Breakdown:
- Email exact match:    +100
- Phone exact match:    +90
- Name exact match:     +80 (capped)
Total: 190 (High Confidence - Likely Same Person)
```

#### Example 2: Medium Confidence (Score = 150)
```
Customer A: john@example.com, 0712345678, "John Perera"
Customer B: john@example.com, 0771234567, "Jon Perera"

Score Breakdown:
- Email exact match:    +100
- Name 95% similar:     +76 (80 × 0.95)
Total: 176 (Medium Confidence - Probably Same Person)
```

#### Example 3: Low Confidence (Score = 60)
```
Customer A: john@example.com, 0712345678, "John Perera", Colombo
Customer B: jane@example.com, 0771234567, "John Fernando", Colombo

Score Breakdown:
- Name 40% similar:     +32 (80 × 0.4)
- District match:       +20
- Province match:       +10
Total: 62 (Low Confidence - Possibly Different People)
```

### Duplicate Report Format

```json
{
  "customer_a": "customer-uuid-1",
  "customer_b": "customer-uuid-2",
  "score": 190,
  "confidence": "High",
  "matches": {
    "email": true,
    "phone": true,
    "name_similarity": 100,
    "company_similarity": 0,
    "same_address": false
  },
  "recommendation": "Merge"
}
```

### Expected Outcome
- Duplicate scoring system

### Verification Checklist
- [ ] calculate_duplicate_score method implemented
- [ ] All field comparisons working
- [ ] Confidence levels assigned
- [ ] Returns detailed match report

---

## Task 76: Implement Customer Merge

### Overview
Implement functionality to merge duplicate customers, consolidating all related data.

### Dependencies
- Task 75: Create Duplicate Score Algorithm

### Instructions

1. **Implement merge_customers method**
   - Accept primary_customer (keep)
   - Accept duplicate_customer (merge)
   - Accept merged_by (User)
   - Consolidate all related data
   - Update duplicate status
   - Create merge history record

2. **Consolidate related data**
   - Transfer all orders
   - Transfer all invoices
   - Transfer all payments
   - Transfer all addresses
   - Transfer all phone numbers
   - Transfer all communications
   - Transfer all history records
   - Merge tags (deduplicate)

3. **Aggregate financial data**
   - Sum total purchases
   - Recalculate order count
   - Update average order value
   - Combine outstanding balances

4. **Update duplicate customer**
   - Set status to "MERGED"
   - Add merged_into field reference
   - Add merged_at timestamp
   - Preserve original data for audit

5. **Implement get_merge_preview method**
   - Show what will be merged
   - Display data comparison
   - Allow review before merge

### Customer Merge Flow

```
Primary Customer (Keep)  +  Duplicate Customer (Merge)
        │
        ▼
Review and Confirm Merge
        │
        ▼
Transfer Related Records:
  ├─ Orders → Primary Customer
  ├─ Invoices → Primary Customer
  ├─ Payments → Primary Customer
  ├─ Addresses → Primary Customer
  ├─ Phones → Primary Customer
  ├─ Communications → Primary Customer
  └─ History → Primary Customer
        │
        ▼
Aggregate Financial Data:
  ├─ total_purchases = sum of both
  ├─ order_count = sum of both
  ├─ average_order_value = recalculate
  └─ outstanding_balance = sum of both
        │
        ▼
Update Duplicate Customer:
  ├─ status = "MERGED"
  ├─ merged_into = primary_customer_id
  ├─ merged_at = timestamp
  └─ merged_by = user_id
        │
        ▼
Create Merge History Record
        │
        ▼
Log Merge Activity
        │
        ▼
Clear Caches
        │
        ▼
Return Merge Summary
```

### Merge Preview Format

```json
{
  "primary_customer": {
    "id": "uuid-1",
    "name": "John Perera",
    "email": "john@example.com",
    "orders": 15,
    "total_purchases": 125000.00
  },
  "duplicate_customer": {
    "id": "uuid-2",
    "name": "Jon Perera",
    "email": "john@example.com",
    "orders": 8,
    "total_purchases": 45000.00
  },
  "after_merge": {
    "orders": 23,
    "total_purchases": 170000.00,
    "addresses": 3,
    "phones": 2,
    "communications": 42
  }
}
```

### Merge Validation Rules

| Rule | Description |
|------|-------------|
| Same Tenant | Both customers must be in same tenant |
| Not Already Merged | Duplicate must not be already merged |
| Valid Primary | Primary customer must be active |
| No Circular Merge | Prevent merging A→B and B→A |

### Expected Outcome
- Complete customer merge functionality

### Verification Checklist
- [ ] merge_customers method implemented
- [ ] All related data transferred
- [ ] Financial data aggregated correctly
- [ ] Duplicate customer status updated
- [ ] get_merge_preview method implemented
- [ ] Merge validation rules enforced
- [ ] Transaction handling (atomic)

---

## Task 77: Create Merge History

### Overview
Create model to track customer merge operations for audit and potential undo.

### Dependencies
- Task 76: Implement Customer Merge

### Instructions

1. **Create customer_merge.py file** in models/
2. **Define CustomerMerge model**

3. **Add merge tracking fields**
   - primary_customer (FK to Customer)
   - duplicate_customer (FK to Customer)
   - merged_by (FK to User)
   - merged_at (DateTimeField)
   - merge_reason (TextField)
   - duplicate_score (IntegerField)

4. **Add merge data fields**
   - orders_transferred (IntegerField)
   - invoices_transferred (IntegerField)
   - payments_transferred (IntegerField)
   - addresses_transferred (IntegerField)
   - phones_transferred (IntegerField)
   - total_purchases_added (DecimalField)

5. **Add snapshot fields**
   - duplicate_customer_snapshot (JSONField)
   - Store duplicate customer data before merge

### CustomerMerge Model Fields

| Field | Type | Description |
|-------|------|-------------|
| primary_customer | FK | Customer that was kept |
| duplicate_customer | FK | Customer that was merged |
| merged_by | FK | User who performed merge |
| merged_at | DateTime | When merge occurred |
| merge_reason | Text | Why merge was performed |
| duplicate_score | Integer | Confidence score (0-100) |
| orders_transferred | Integer | Count of orders moved |
| invoices_transferred | Integer | Count of invoices moved |
| payments_transferred | Integer | Count of payments moved |
| addresses_transferred | Integer | Count of addresses moved |
| phones_transferred | Integer | Count of phones moved |
| total_purchases_added | Decimal | Amount added to primary |
| duplicate_customer_snapshot | JSON | Duplicate data snapshot |

### Merge History Query Methods

1. **get_merge_history(customer)**
   - Returns all merges for a customer
   - Shows merged-in duplicates

2. **get_recent_merges(limit=10)**
   - Returns recent merge operations
   - For admin monitoring

3. **can_undo_merge(merge_id)**
   - Check if merge can be undone
   - Return validation result

### Expected Outcome
- Merge history tracking model

### Verification Checklist
- [ ] customer_merge.py file created
- [ ] CustomerMerge model defined
- [ ] All tracking fields added
- [ ] Snapshot field configured
- [ ] History query methods planned

---

## Task 78: Run Segment Migrations

### Overview
Generate and apply migrations for segment and merge models.

### Dependencies
- Task 77: Create Merge History

### Instructions

1. **Generate migrations**
   - Include CustomerSegment model
   - Include CustomerMerge model
   - Include related indexes

2. **Apply migrations**
   - Run for public schema
   - Run for all tenant schemas

3. **Verify tables**
   - Check customers_customersegment
   - Check customers_customermerge

4. **Create indexes**
   - CustomerSegment: name, is_active
   - CustomerMerge: primary_customer, duplicate_customer, merged_at

### Expected Outcome
- Segment and merge tables in database

### Verification Checklist
- [ ] Migrations generated
- [ ] Migrations applied to public schema
- [ ] Migrations applied to tenant schemas
- [ ] Tables verified
- [ ] Indexes created

---

## Summary

This document implemented duplicate detection and customer merge:

### Completed Features
- ✅ Duplicate detection by email, phone, name
- ✅ Phone normalization for matching
- ✅ Fuzzy name matching algorithm
- ✅ Duplicate scoring system (0-100)
- ✅ Confidence levels (High/Medium/Low)
- ✅ Customer merge functionality
- ✅ Related data consolidation (orders, invoices, etc.)
- ✅ Financial data aggregation
- ✅ CustomerMerge history model
- ✅ Merge preview before execution
- ✅ Segment and merge migrations

### Key Achievements
1. **Smart Detection** - Multi-criteria duplicate finding
2. **Confidence Scoring** - Weighted match algorithm
3. **Safe Merging** - Preview and validation
4. **Data Consolidation** - All related records transferred
5. **Audit Trail** - Complete merge history

### Duplicate Detection Criteria
- Email (exact): 100 points
- Phone (exact): 90 points
- Name (fuzzy >90%): 80 points
- Company (fuzzy >90%): 70 points
- Address (same): 50 points

### Merge Operations
- Transfer orders, invoices, payments
- Transfer addresses, phones
- Transfer communications, history
- Aggregate financial totals
- Create audit trail

### Group E Complete
All segmentation and duplicate detection functionality implemented.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 5  
**Total Lines:** ~760
