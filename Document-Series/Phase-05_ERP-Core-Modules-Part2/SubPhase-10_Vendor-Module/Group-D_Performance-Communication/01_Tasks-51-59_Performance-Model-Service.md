# Tasks 51-59: Performance Model and Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** D - Performance & Communication  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-60-66_Communication-Model-Service.md](02_Tasks-60-66_Communication-Model-Service.md)

---

## Document Overview

This document creates the VendorPerformance model and PerformanceService to track and calculate vendor performance metrics.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create VendorPerformance Model | Medium | 25 min |
| 52 | Add Performance Metrics | Medium | 25 min |
| 53 | Add Performance Period Fields | Medium | 20 min |
| 54 | Run Performance Migrations | Low | 15 min |
| 55 | Create PerformanceService Class | High | 30 min |
| 56 | Implement Delivery Rate Calculator | Medium | 25 min |
| 57 | Implement Quality Score Calculator | Medium | 25 min |
| 58 | Implement Response Time Tracker | Medium | 25 min |
| 59 | Implement Overall Rating Calculator | High | 30 min |

---

## Task 51: Create VendorPerformance Model

### Overview
Create VendorPerformance model to store vendor performance metrics for reporting periods.

### Dependencies
- Group C completed

### Instructions

1. **Create vendor_performance.py file**
   - At `apps/vendors/models/vendor_performance.py`

2. **Define VendorPerformance model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE, related_name='performance_records')

3. **Configure Meta**
   - Unique: (vendor, period_start, period_end)
   - Ordering: ['-period_start']

### Expected Outcome
- Performance tracking model

### Verification Checklist
- [ ] Model created with vendor FK
- [ ] Period uniqueness constraint

---

## Task 52: Add Performance Metrics

### Overview
Add metric fields for tracking delivery, quality, and response metrics.

### Dependencies
- Task 51: Create VendorPerformance Model

### Instructions

1. **Add on_time_delivery_rate**
   - DecimalField(5, 2)
   - 0-100% range

2. **Add quality_score**
   - DecimalField(5, 2)
   - 0-100% range

3. **Add avg_response_time_hours**
   - DecimalField(10, 2)
   - Average hours to respond

4. **Add order metrics**
   - total_orders_count: IntegerField
   - orders_on_time: IntegerField
   - orders_late: IntegerField

5. **Add quality metrics**
   - items_received: IntegerField
   - items_defective: IntegerField

6. **Add overall_rating**
   - DecimalField(3, 2)
   - 1.0-5.0 stars

### Performance Fields Summary

| Field | Type | Range | Purpose |
|-------|------|-------|---------|
| on_time_delivery_rate | Decimal(5,2) | 0-100 | Delivery % |
| quality_score | Decimal(5,2) | 0-100 | Quality % |
| avg_response_time_hours | Decimal(10,2) | 0+ | Response time |
| overall_rating | Decimal(3,2) | 1-5 | Star rating |

### Expected Outcome
- Complete performance metrics

### Verification Checklist
- [ ] All metric fields added
- [ ] Proper decimal precision

---

## Task 53: Add Performance Period Fields

### Overview
Add period start/end dates and calculation timestamp.

### Dependencies
- Task 52: Add Performance Metrics

### Instructions

1. **Add period_start**
   - DateField
   - Period start date

2. **Add period_end**
   - DateField
   - Period end date

3. **Add calculated_at**
   - DateTimeField
   - When metrics calculated

4. **Add calculated_by**
   - ForeignKey to User (optional)

### Expected Outcome
- Period tracking
- Calculation audit

### Verification Checklist
- [ ] Period fields added
- [ ] Calculation tracking added

---

## Task 54: Run Performance Migrations

### Overview
Generate and apply performance model migrations.

### Dependencies
- Task 53: Add Performance Period Fields

### Instructions

1. **Generate and apply migration**
2. **Test performance record creation**

### Verification Checklist
- [ ] Migration applied
- [ ] Table created

---

## Task 55: Create PerformanceService Class

### Overview
Create service to calculate vendor performance metrics.

### Dependencies
- Task 54: Run Performance Migrations

### Instructions

1. **Create performance_service.py**
   - At `apps/vendors/services/performance_service.py`

2. **Define PerformanceService class**
   - Methods for calculating metrics
   - Period-based calculations

### Expected Outcome
- Performance calculation service

### Verification Checklist
- [ ] Service class created
- [ ] Method stubs defined

---

## Task 56: Implement Delivery Rate Calculator

### Overview
Calculate on-time delivery rate from purchase orders.

### Dependencies
- Task 55: Create PerformanceService Class

### Instructions

1. **Implement calculate_delivery_rate method**
   - Query POs for vendor in period
   - Count total completed POs
   - Count POs delivered on/before expected date
   - Calculate percentage
   - Return rate

### Calculation
```
on_time_rate = (orders_on_time / total_orders) × 100
```

### Expected Outcome
- Delivery rate calculation

### Verification Checklist
- [ ] Method implemented
- [ ] Calculation correct

---

## Task 57: Implement Quality Score Calculator

### Overview
Calculate quality score based on defects and returns.

### Dependencies
- Task 56: Implement Delivery Rate Calculator

### Instructions

1. **Implement calculate_quality_score method**
   - Query received items in period
   - Count total items
   - Count defective/returned items
   - Calculate quality percentage
   - Return score

### Calculation
```
quality_score = (1 - defective_items / total_items) × 100
```

### Expected Outcome
- Quality score calculation

### Verification Checklist
- [ ] Method implemented
- [ ] Defect tracking included

---

## Task 58: Implement Response Time Tracker

### Overview
Calculate average response time from communications.

### Dependencies
- Task 57: Implement Quality Score Calculator

### Instructions

1. **Implement calculate_response_time method**
   - Query communications in period
   - Calculate time between inquiry and response
   - Average response times
   - Return avg hours

### Expected Outcome
- Response time tracking

### Verification Checklist
- [ ] Method implemented
- [ ] Time calculation correct

---

## Task 59: Implement Overall Rating Calculator

### Overview
Calculate overall vendor rating from weighted metrics.

### Dependencies
- Task 58: Implement Response Time Tracker

### Instructions

1. **Implement calculate_overall_rating method**
   - Get all component metrics
   - Apply weights:
     - Delivery: 40%
     - Quality: 30%
     - Response: 15%
     - Price: 15%
   - Calculate weighted score
   - Convert to 1-5 scale
   - Return rating

2. **Implement update_vendor_rating method**
   - Calculate new rating
   - Update Vendor.rating field
   - Update Vendor.last_rating_update
   - Return updated vendor

### Rating Formula
```
rating = (delivery × 0.40) + (quality × 0.30) + (response × 0.15) + (price × 0.15)
stars = (rating / 100) × 5
```

### Expected Outcome
- Overall rating calculation
- Vendor rating updates

### Verification Checklist
- [ ] Method implemented
- [ ] Weights applied correctly
- [ ] Vendor updated

---

## Notes for AI Agents

### Performance Calculation Schedule
- Run nightly via Celery task
- Calculate for previous month/quarter
- Update vendor rating field
- Generate performance alerts

### Metric Weights
Adjust based on business priorities. Current weights favor delivery reliability.

### Performance Alerts
- Delivery rate < 90%: Warning
- Quality score < 95%: Review
- Rating drop > 0.5: Alert management
