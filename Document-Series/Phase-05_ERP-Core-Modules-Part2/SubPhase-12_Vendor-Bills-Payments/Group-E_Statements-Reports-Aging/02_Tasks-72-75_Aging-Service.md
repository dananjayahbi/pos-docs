# Tasks 72-75: Bill Aging Service Implementation

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Ready for Implementation

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous:** [01_Tasks-67-71_Statement-Service.md](01_Tasks-67-71_Statement-Service.md)
- **Next:** [03_Tasks-76-80_Reports-Analytics.md](03_Tasks-76-80_Reports-Analytics.md)

---

## Document Overview

This document covers the implementation of the **Bill Aging Service**, which provides comprehensive aging analysis of vendor bills to track payment timelines and identify overdue obligations. The service includes configurable aging buckets, automated aging calculations, detailed reporting capabilities, and proactive alert mechanisms for overdue bills.

### Tasks Covered

| Task | Component | Priority | Complexity |
|------|-----------|----------|------------|
| 72 | BillAgingService Core Implementation | High | High |
| 73 | Aging Bucket Configuration System | High | Medium |
| 74 | Aging Report Generator | High | High |
| 75 | Overdue Bill Alert Celery Task | High | Medium |

### Prerequisites

- Vendor Bills models fully implemented (Tasks 1-16)
- Payment models and services (Tasks 49-58)
- Vendor Statement Service (Tasks 67-71)
- Celery task queue configured
- Email notification system operational
- Reporting infrastructure available

### Business Value

The aging service provides critical financial management capabilities:
- **Cash Flow Management**: Track upcoming payment obligations
- **Vendor Relationship Management**: Prevent overdue payments that damage relationships
- **Working Capital Optimization**: Identify payment priorities
- **Compliance**: Meet payment terms and contractual obligations
- **Financial Planning**: Forecast cash requirements based on aging analysis

---

## Task 72: BillAgingService Core Implementation

### Overview

Implement the core service class that orchestrates bill aging analysis, calculating the age of unpaid bills, categorizing them into aging buckets, and providing comprehensive aging insights. This service is the foundation for all aging-related reporting and alerting.

**Objectives:**
- Create BillAgingService with flexible filtering and grouping options
- Calculate bill age based on various date references (due date, invoice date)
- Support multi-tenant aging calculations with isolation
- Implement efficient bulk aging calculations for large datasets
- Provide vendor-level, department-level, and company-wide aging views
- Handle partial payments and bill credits in aging calculations
- Support multiple currencies with proper conversion

**Business Value:**
- Enables proactive management of payment obligations
- Provides visibility into financial commitments
- Supports better vendor negotiation through timely payments
- Reduces late payment penalties and interest charges
- Improves cash flow forecasting accuracy

### Dependencies

**Internal:**
- VendorBill model with status and date fields
- VendorPayment model for payment application
- Vendor model for vendor information
- Company/Tenant model for multi-tenant support
- Currency conversion utilities

**External:**
- Django ORM for efficient database queries
- Python datetime and timedelta for date calculations
- decimal module for precise financial calculations
- Django Q objects for complex query building

**Integration Points:**
- Payment processing system for payment status
- Reporting system for aging reports
- Alert system for overdue notifications
- Dashboard system for aging metrics

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    BillAgingService Architecture                  │
└──────────────────────────────────────────────────────────────────┘
                                  │
                                  ├─── Service Layer
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │   Aging      │      │   Bucket     │      │  Grouping    │
    │  Calculator  │      │  Classifier  │      │  Aggregator  │
    └──────────────┘      └──────────────┘      └──────────────┘
           │                      │                      │
           │                      │                      │
           ▼                      ▼                      ▼
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │  Outstanding │      │   Balance    │      │   Summary    │
    │   Amount     │      │  Calculator  │      │  Generator   │
    │  Calculator  │      └──────────────┘      └──────────────┘
    └──────────────┘
           │
           ▼
    ┌─────────────────────────────────────────┐
    │          Data Aggregation Layer          │
    │                                          │
    │  • Bill queries with filters             │
    │  • Payment application tracking          │
    │  • Multi-tenant data isolation           │
    │  • Currency conversion handling          │
    └─────────────────────────────────────────┘
```

### Aging Calculation Flow

```
┌────────────────┐
│  Input Request │
│  - Vendor(s)   │
│  - Date range  │
│  - Filters     │
└────────┬───────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Validate Parameters                │
│  - Tenant context valid             │
│  - Date parameters logical          │
│  - Filter criteria valid            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Query Outstanding Bills            │
│  - Status: APPROVED, PARTIALLY_PAID │
│  - Outstanding balance > 0          │
│  - Apply vendor/date filters        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  For Each Bill:                     │
│  1. Calculate outstanding amount    │
│  2. Determine reference date        │
│  3. Calculate days outstanding      │
│  4. Classify into aging bucket      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Aggregate Results                  │
│  - Group by vendor/department       │
│  - Sum amounts by bucket            │
│  - Calculate totals and percentages │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Apply Business Rules               │
│  - Exclude bills on hold            │
│  - Apply payment terms grace        │
│  - Handle disputed bills            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Format and Return Results          │
│  - Aging summary structure          │
│  - Detailed bill breakdown          │
│  - Metadata and timestamps          │
└─────────────────────────────────────┘
```

### Age Calculation Methods

```
┌────────────────────────────────────────────────────────────┐
│               Bill Age Calculation Methods                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Method 1: Days Past Due Date                              │
│  ───────────────────────────────────────                   │
│  Age = Current Date - Bill Due Date                        │
│  Use: Standard aging based on payment deadline             │
│  Example: Due Date: Jan 15, Today: Jan 30 = 15 days       │
│                                                             │
│  Method 2: Days Since Invoice Date                         │
│  ────────────────────────────────────────                  │
│  Age = Current Date - Bill Invoice Date                    │
│  Use: Track total time since bill creation                 │
│  Example: Invoice: Jan 1, Today: Jan 30 = 29 days         │
│                                                             │
│  Method 3: Days Since Approval                             │
│  ─────────────────────────────────────                     │
│  Age = Current Date - Bill Approval Date                   │
│  Use: Track time since bill approved for payment           │
│  Example: Approved: Jan 10, Today: Jan 30 = 20 days       │
│                                                             │
│  Method 4: Weighted Age (Partial Payments)                 │
│  ─────────────────────────────────────────                 │
│  For bills with partial payments:                          │
│  • Calculate age for each outstanding portion              │
│  • Weight by amount remaining                              │
│  Use: More accurate for partially paid bills               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Outstanding Amount Calculation

```
┌───────────────────────────────────────────────────────────┐
│           Outstanding Amount Calculation Logic             │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  Starting Amount:                                          │
│  └─ bill.total_amount (Bill Total)                        │
│                                                            │
│  Subtract Applied Payments:                                │
│  └─ SUM(payment.amount WHERE payment.bill_id = bill.id    │
│         AND payment.status = 'COMPLETED')                  │
│                                                            │
│  Subtract Credits:                                         │
│  └─ SUM(credit.amount WHERE credit.bill_id = bill.id)     │
│                                                            │
│  Add Interest/Penalties (if applicable):                   │
│  └─ SUM(charge.amount WHERE charge.bill_id = bill.id      │
│         AND charge.type IN ['LATE_FEE', 'INTEREST'])       │
│                                                            │
│  Outstanding Amount:                                       │
│  └─ Total - Payments - Credits + Charges                  │
│                                                            │
│  Validation:                                               │
│  └─ Outstanding Amount >= 0                                │
│  └─ Outstanding Amount <= Bill Total (unless charges)      │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Service Methods Structure

```
┌────────────────────────────────────────────────────────────┐
│              BillAgingService - Key Methods                 │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  calculate_aging(vendor_id=None, as_of_date=None,         │
│                  reference_date='due_date',                │
│                  include_on_hold=False)                    │
│    → Returns comprehensive aging analysis                  │
│    → Parameters allow flexible filtering                   │
│                                                             │
│  get_vendor_aging(vendor_id, as_of_date=None)             │
│    → Returns aging for specific vendor                     │
│    → Includes vendor details and payment history           │
│                                                             │
│  get_overdue_bills(days_overdue=0, vendor_id=None)        │
│    → Returns bills past due by specified days              │
│    → Sorted by overdue amount and days                     │
│                                                             │
│  calculate_bill_age(bill, as_of_date=None,                │
│                     reference_date='due_date')             │
│    → Calculates age of single bill                         │
│    → Returns days and bucket classification                │
│                                                             │
│  get_outstanding_amount(bill)                              │
│    → Calculates current outstanding balance                │
│    → Accounts for payments, credits, charges               │
│                                                             │
│  classify_into_bucket(days_outstanding)                    │
│    → Determines appropriate aging bucket                   │
│    → Uses configured bucket ranges                         │
│                                                             │
│  get_aging_summary(vendor_id=None, group_by='vendor')     │
│    → Returns aggregated aging metrics                      │
│    → Supports grouping by vendor, department, etc.         │
│                                                             │
│  get_payment_priority_list(limit=50)                       │
│    → Returns bills prioritized for payment                 │
│    → Based on due dates, amounts, vendor importance        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Considerations

```
┌────────────────────────────────────────────────────────────┐
│               Multi-Tenant Aging Isolation                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Tenant Context:                                            │
│  • All queries filtered by current tenant                   │
│  • Bills isolated per tenant schema                         │
│  • No cross-tenant data leakage                             │
│                                                             │
│  Performance Optimization:                                  │
│  • Tenant-specific database indexes                         │
│  • Query optimization per tenant size                       │
│  • Caching strategies per tenant                            │
│                                                             │
│  Configuration:                                             │
│  • Tenant-specific aging bucket definitions                 │
│  • Custom reference date preferences                        │
│  • Tenant-specific business rules                           │
│                                                             │
│  Data Aggregation:                                          │
│  • Separate aging calculations per tenant                   │
│  • No shared state between tenants                          │
│  • Isolated reporting and exports                           │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Instructions

#### Step 1: Create Service Class Structure

1. **Create service file**
   - Location: `apps/vendor_bills/services/aging_service.py`
   - Import required dependencies
   - Set up proper module structure

2. **Define service class**
   - Class name: `BillAgingService`
   - Inherit from appropriate base service class
   - Add comprehensive docstring explaining purpose

3. **Initialize service**
   - Accept tenant context in __init__
   - Store configuration settings
   - Set up logging

#### Step 2: Implement Core Aging Calculation

1. **Create calculate_aging method**
   - Accept filtering parameters (vendor_id, date range)
   - Accept configuration parameters (reference_date, include_on_hold)
   - Set default as_of_date to current date if not provided

2. **Build query for outstanding bills**
   - Filter by tenant context
   - Filter by status: APPROVED or PARTIALLY_PAID
   - Filter by outstanding_amount > 0
   - Apply vendor filter if provided
   - Apply date range filters if provided
   - Exclude bills with is_on_hold=True unless specified

3. **Calculate age for each bill**
   - Determine reference date (due_date, invoice_date, or approval_date)
   - Calculate days_outstanding = as_of_date - reference_date
   - Handle null dates gracefully
   - Store age with bill data

4. **Calculate outstanding amounts**
   - Get bill total_amount
   - Sum applied payments for bill
   - Sum applied credits for bill
   - Calculate outstanding: total - payments - credits
   - Validate outstanding amount >= 0

5. **Classify bills into buckets**
   - For each bill, determine aging bucket
   - Use classify_into_bucket method
   - Store bucket assignment with bill

#### Step 3: Implement Outstanding Amount Calculator

1. **Create get_outstanding_amount method**
   - Accept bill object as parameter
   - Query all completed payments for bill
   - Query all applied credits for bill
   - Query any additional charges (late fees, interest)

2. **Calculate amounts**
   - Start with bill.total_amount
   - Subtract sum of completed payments
   - Subtract sum of applied credits
   - Add any late fees or interest charges
   - Return final outstanding amount

3. **Add caching**
   - Cache calculated amounts with bill
   - Invalidate on payment or credit application
   - Use proper cache key structure

#### Step 4: Implement Bill Age Calculator

1. **Create calculate_bill_age method**
   - Accept bill object
   - Accept as_of_date (default to today)
   - Accept reference_date type ('due_date', 'invoice_date', 'approval_date')

2. **Determine reference date**
   - Extract appropriate date from bill based on reference_date type
   - Handle null dates: use invoice_date as fallback
   - Validate date is not in future

3. **Calculate days outstanding**
   - Compute (as_of_date - reference_date).days
   - Return positive integer
   - Handle edge cases (same day = 0 days)

4. **Return structured result**
   - Return dict with: days_outstanding, reference_date_used, as_of_date
   - Include bucket classification
   - Include outstanding amount

#### Step 5: Implement Vendor-Specific Aging

1. **Create get_vendor_aging method**
   - Accept vendor_id parameter
   - Accept as_of_date parameter
   - Validate vendor exists and belongs to tenant

2. **Query vendor bills**
   - Get all outstanding bills for vendor
   - Calculate aging for each bill
   - Classify into buckets

3. **Aggregate vendor totals**
   - Sum amounts by aging bucket
   - Calculate total outstanding
   - Calculate average days outstanding
   - Count bills per bucket

4. **Include vendor context**
   - Add vendor details (name, code, contact)
   - Add payment terms
   - Add vendor credit limit vs. current outstanding
   - Add payment history summary

#### Step 6: Implement Overdue Bills Query

1. **Create get_overdue_bills method**
   - Accept days_overdue threshold (default 0)
   - Accept vendor_id filter (optional)
   - Accept limit parameter

2. **Query overdue bills**
   - Filter bills where days_past_due > days_overdue
   - Calculate days_past_due based on due_date
   - Filter by vendor if provided
   - Order by days_past_due DESC, then by amount DESC

3. **Enrich bill data**
   - Include vendor details
   - Include outstanding amount
   - Include days overdue
   - Include contact information

4. **Return structured result**
   - List of overdue bills with full context
   - Include totals: count, total amount
   - Include urgency indicators

#### Step 7: Implement Aging Summary

1. **Create get_aging_summary method**
   - Accept vendor_id filter (optional)
   - Accept group_by parameter ('vendor', 'department', None)
   - Accept as_of_date parameter

2. **Calculate aging for all bills**
   - Use calculate_aging method
   - Apply filters
   - Get bills with aging classification

3. **Aggregate by group**
   - If group_by='vendor': aggregate per vendor
   - If group_by='department': aggregate per department
   - If None: company-wide totals
   - Sum amounts per bucket within each group

4. **Calculate summary metrics**
   - Total outstanding across all buckets
   - Percentage distribution across buckets
   - Number of bills per bucket
   - Average days outstanding
   - Oldest bill date
   - Highest amount bill

#### Step 8: Implement Payment Priority Logic

1. **Create get_payment_priority_list method**
   - Accept limit parameter (default 50)
   - Get all outstanding bills

2. **Calculate priority scores**
   - Factor: days overdue (higher = higher priority)
   - Factor: outstanding amount (higher = higher priority)
   - Factor: vendor importance/rating
   - Factor: payment terms (shorter = higher priority)
   - Factor: relationship to POs (matched POs = higher)

3. **Sort by priority**
   - Apply weighted scoring algorithm
   - Sort bills by priority score
   - Limit results to specified number

4. **Return prioritized list**
   - Include bill details
   - Include priority score
   - Include recommendation rationale
   - Include suggested payment date

#### Step 9: Add Helper Methods

1. **Create classify_into_bucket method**
   - Accept days_outstanding integer
   - Compare against bucket ranges from configuration
   - Return bucket identifier (CURRENT, BUCKET_30, BUCKET_60, etc.)

2. **Create get_bucket_range method**
   - Accept bucket identifier
   - Return min and max days for bucket
   - Used for display and filtering

3. **Create format_aging_result method**
   - Accept raw aging calculation results
   - Format for API response or report
   - Apply currency formatting
   - Apply date formatting

#### Step 10: Add Logging and Error Handling

1. **Add method-level logging**
   - Log aging calculation start with parameters
   - Log query execution metrics
   - Log calculation results summary
   - Log any warnings or issues

2. **Implement error handling**
   - Catch database query errors
   - Catch calculation errors (division by zero, null dates)
   - Provide meaningful error messages
   - Return partial results when possible

3. **Add validation**
   - Validate tenant context present
   - Validate date parameters logical
   - Validate vendor exists if filtering
   - Validate bucket configuration loaded

### Expected Outcome

After completing Task 72, the system will have:

1. **Functional BillAgingService**
   - Core service class with aging calculation capabilities
   - Support for multiple aging calculation methods
   - Efficient database queries with proper filtering

2. **Aging Calculation Methods**
   - calculate_aging: Comprehensive aging analysis
   - get_vendor_aging: Vendor-specific aging
   - calculate_bill_age: Single bill aging
   - get_outstanding_amount: Outstanding balance calculation

3. **Query and Filter Methods**
   - get_overdue_bills: Query bills past due
   - get_aging_summary: Aggregated aging metrics
   - get_payment_priority_list: Prioritized payment recommendations

4. **Supporting Infrastructure**
   - Helper methods for bucket classification
   - Formatting utilities for results
   - Proper logging throughout
   - Comprehensive error handling

5. **Performance Optimizations**
   - Efficient database queries with proper joins
   - Caching of calculated values
   - Batch processing capabilities
   - Optimized aggregation queries

### Verification Checklist

**Service Implementation:**
- [ ] BillAgingService class created in aging_service.py
- [ ] Service properly inherits from base service class
- [ ] Tenant context properly initialized and used
- [ ] All required imports present

**Core Calculation Methods:**
- [ ] calculate_aging method implemented with all parameters
- [ ] get_vendor_aging method returns vendor-specific aging
- [ ] calculate_bill_age correctly calculates bill age
- [ ] get_outstanding_amount properly calculates balances
- [ ] All methods handle null/missing data gracefully

**Query Methods:**
- [ ] get_overdue_bills returns accurate overdue bill list
- [ ] Filters by days_overdue threshold correctly
- [ ] Vendor filtering works properly
- [ ] Results sorted by priority (days/amount)

**Aggregation Methods:**
- [ ] get_aging_summary aggregates correctly
- [ ] Grouping by vendor works
- [ ] Grouping by department works
- [ ] Company-wide totals accurate
- [ ] Percentages calculated correctly

**Outstanding Calculations:**
- [ ] Total bill amounts retrieved correctly
- [ ] Payments properly subtracted
- [ ] Credits properly subtracted
- [ ] Late fees and charges properly added
- [ ] Negative amounts prevented

**Date Calculations:**
- [ ] Days outstanding calculated accurately
- [ ] Reference date selection works (due/invoice/approval)
- [ ] Current date used as default as_of_date
- [ ] Historical aging calculations work (past as_of_dates)
- [ ] Date handling robust with null values

**Bucket Classification:**
- [ ] classify_into_bucket method works correctly
- [ ] Bills assigned to proper buckets
- [ ] Bucket boundaries respected
- [ ] Configuration-driven bucket definitions

**Multi-Tenant:**
- [ ] All queries filtered by tenant
- [ ] No cross-tenant data leakage
- [ ] Tenant-specific configurations respected
- [ ] Performance acceptable for large tenants

**Performance:**
- [ ] Queries use appropriate indexes
- [ ] Large datasets process efficiently
- [ ] Caching implemented where beneficial
- [ ] No N+1 query problems

**Error Handling:**
- [ ] Database errors caught and handled
- [ ] Validation errors return meaningful messages
- [ ] Null date handling works correctly
- [ ] Division by zero prevented
- [ ] Logging captures errors properly

**Testing:**
- [ ] Unit tests for all calculation methods
- [ ] Unit tests for outstanding amount calculations
- [ ] Unit tests for date calculations
- [ ] Tests for multi-tenant isolation
- [ ] Tests for edge cases (zero amounts, null dates)
- [ ] Integration tests with bill and payment models

---

## Task 73: Aging Bucket Configuration System

### Overview

Implement a flexible aging bucket configuration system that allows definition of custom aging periods, supports multiple bucket schemes for different vendors or business units, and provides a standardized approach to categorizing bill ages. This system should support tenant-specific configurations while providing sensible defaults.

**Objectives:**
- Define standard aging buckets (0-30, 31-60, 61-90, 90+ days)
- Support custom bucket definitions per tenant or vendor
- Provide configuration interface for bucket management
- Store bucket configurations in database or settings
- Support multiple concurrent bucket schemes
- Enable easy bucket range modifications without code changes

**Business Value:**
- Flexibility to match industry-specific aging conventions
- Alignment with vendor payment term structures
- Support for different reporting requirements
- Easy adaptation to changing business needs
- Standardized aging terminology across organization

### Dependencies

**Internal:**
- BillAgingService (Task 72)
- Configuration management system
- Database models for configuration storage
- Settings infrastructure

**External:**
- Django settings framework
- Database for configuration storage
- Validation frameworks

**Integration Points:**
- Aging service for bucket classification
- Reporting system for bucket display
- Dashboard widgets for aging visualization
- API for bucket configuration management

### Aging Bucket Standard Structure

```
┌──────────────────────────────────────────────────────────────┐
│              Standard Aging Bucket Configuration              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  CURRENT (0-30 days)                                          │
│  ├─ Min Days: 0                                               │
│  ├─ Max Days: 30                                              │
│  ├─ Label: "Current"                                          │
│  ├─ Description: "Bills due within 30 days or not yet due"   │
│  └─ Color Code: #28a745 (Green)                              │
│                                                               │
│  BUCKET_30 (31-60 days)                                       │
│  ├─ Min Days: 31                                              │
│  ├─ Max Days: 60                                              │
│  ├─ Label: "31-60 Days"                                       │
│  ├─ Description: "Bills overdue 31-60 days"                  │
│  └─ Color Code: #ffc107 (Yellow/Warning)                     │
│                                                               │
│  BUCKET_60 (61-90 days)                                       │
│  ├─ Min Days: 61                                              │
│  ├─ Max Days: 90                                              │
│  ├─ Label: "61-90 Days"                                       │
│  ├─ Description: "Bills overdue 61-90 days"                  │
│  └─ Color Code: #fd7e14 (Orange)                             │
│                                                               │
│  BUCKET_90_PLUS (90+ days)                                    │
│  ├─ Min Days: 91                                              │
│  ├─ Max Days: null (no upper limit)                          │
│  ├─ Label: "90+ Days"                                         │
│  ├─ Description: "Bills overdue more than 90 days"           │
│  └─ Color Code: #dc3545 (Red/Danger)                         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Bucket Configuration Architecture

```
┌────────────────────────────────────────────────────────────────┐
│            Aging Bucket Configuration Architecture              │
└────────────────────────────────────────────────────────────────┘
                                │
                                ├─── Configuration Layer
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Default Buckets  │  │ Tenant-Specific  │  │ Vendor-Specific  │
│  Configuration   │  │  Configuration   │  │  Configuration   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │  Configuration Manager │
                    │  - Load configuration  │
                    │  - Validate ranges     │
                    │  - Apply overrides     │
                    └────────────────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │   Bucket Classifier    │
                    │   (in Aging Service)   │
                    └────────────────────────┘
```

### Bucket Configuration Resolution

```
┌─────────────────────────────────────────────────────────┐
│        Bucket Configuration Resolution Flow              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
            ┌──────────────────────────┐
            │   Request Bucket Config  │
            │   for Tenant/Vendor      │
            └──────────┬───────────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │  Check Vendor-Specific   │
            │     Configuration        │
            └──────────┬───────────────┘
                       │
                       ├── Found ──────────────┐
                       │                       │
                       │ Not Found             │
                       ▼                       │
            ┌──────────────────────────┐      │
            │   Check Tenant-Specific  │      │
            │     Configuration        │      │
            └──────────┬───────────────┘      │
                       │                       │
                       ├── Found ──────────────┤
                       │                       │
                       │ Not Found             │
                       ▼                       │
            ┌──────────────────────────┐      │
            │   Use Default/Global     │      │
            │     Configuration        │      │
            └──────────┬───────────────┘      │
                       │                       │
                       └───────────────────────┤
                                               │
                                               ▼
                            ┌──────────────────────────┐
                            │  Return Configuration    │
                            │  - Bucket definitions    │
                            │  - Display properties    │
                            └──────────────────────────┘
```

### Configuration Data Structure

```
┌────────────────────────────────────────────────────────────┐
│           Bucket Configuration Data Structure               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  AgingBucketConfiguration:                                  │
│  {                                                          │
│    "id": "default_standard",                                │
│    "name": "Standard Aging Buckets",                        │
│    "description": "Industry-standard aging bucket config",  │
│    "tenant_id": null,  // null = default for all tenants    │
│    "is_active": true,                                       │
│    "created_date": "2026-01-01T00:00:00Z",                  │
│    "modified_date": "2026-01-01T00:00:00Z",                 │
│                                                             │
│    "buckets": [                                             │
│      {                                                      │
│        "code": "CURRENT",                                   │
│        "label": "Current",                                  │
│        "min_days": 0,                                       │
│        "max_days": 30,                                      │
│        "display_order": 1,                                  │
│        "color_code": "#28a745",                             │
│        "is_overdue": false,                                 │
│        "alert_threshold": null                              │
│      },                                                     │
│      {                                                      │
│        "code": "BUCKET_30",                                 │
│        "label": "31-60 Days",                               │
│        "min_days": 31,                                      │
│        "max_days": 60,                                      │
│        "display_order": 2,                                  │
│        "color_code": "#ffc107",                             │
│        "is_overdue": true,                                  │
│        "alert_threshold": 45  // Alert if bill in bucket    │
│      },                                                     │
│      // ... additional buckets                              │
│    ]                                                        │
│  }                                                          │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Alternative Bucket Schemes

```
┌────────────────────────────────────────────────────────────┐
│              Alternative Aging Bucket Schemes               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Scheme 1: Weekly Buckets (High-Velocity Business)         │
│  ──────────────────────────────────────────────────         │
│  • 0-7 days (Current Week)                                  │
│  • 8-14 days (Last Week)                                    │
│  • 15-21 days (Two Weeks)                                   │
│  • 22-30 days (Three-Four Weeks)                            │
│  • 30+ days (Over One Month)                                │
│                                                             │
│  Scheme 2: Extended Buckets (Long Payment Terms)            │
│  ────────────────────────────────────────────────            │
│  • 0-60 days (Current)                                      │
│  • 61-90 days (Aging)                                       │
│  • 91-120 days (Overdue)                                    │
│  • 121-180 days (Seriously Overdue)                         │
│  • 180+ days (Collections)                                  │
│                                                             │
│  Scheme 3: Quarter-Based (Seasonal Business)                │
│  ────────────────────────────────────────────────            │
│  • 0-30 days (Current Month)                                │
│  • 31-60 days (Last Month)                                  │
│  • 61-90 days (Current Quarter)                             │
│  • 91-180 days (Last Quarter)                               │
│  • 180+ days (Older)                                        │
│                                                             │
│  Scheme 4: Simplified (Small Business)                      │
│  ──────────────────────────────────────                     │
│  • 0-30 days (Current)                                      │
│  • 31-90 days (Overdue)                                     │
│  • 90+ days (Seriously Overdue)                             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Instructions

#### Step 1: Create Configuration Model

1. **Create AgingBucketConfig model**
   - Location: `apps/vendor_bills/models/aging_config.py`
   - Fields: name, description, is_active, is_default
   - Fields: tenant (FK, nullable for defaults)
   - Add created_date, modified_date (auto)

2. **Create AgingBucket model**
   - FK to AgingBucketConfig
   - Fields: code, label, description
   - Fields: min_days (IntegerField), max_days (nullable)
   - Fields: display_order, color_code
   - Fields: is_overdue (BooleanField)
   - Fields: alert_threshold (nullable)

3. **Add model validations**
   - Validate min_days >= 0
   - Validate max_days > min_days (if not null)
   - Validate no overlapping day ranges within config
   - Validate no gaps in day ranges
   - Unique constraint on (config, code)

4. **Add model methods**
   - get_bucket_for_days(days): Returns bucket for given days
   - get_ordered_buckets(): Returns buckets in display order
   - validate_configuration(): Checks config integrity

#### Step 2: Implement Default Configuration

1. **Create default configuration data**
   - Location: `apps/vendor_bills/fixtures/default_aging_buckets.json`
   - Define standard 4-bucket configuration
   - Include all required fields and properties

2. **Create migration to load defaults**
   - Create data migration
   - Load default configuration on first install
   - Mark as is_default=True
   - Ensure idempotent (can run multiple times)

3. **Add configuration in settings**
   - Add AGING_BUCKET_CONFIG in Django settings
   - Define default bucket ranges
   - Allow settings-based override of defaults

#### Step 3: Implement Configuration Manager

1. **Create AgingBucketConfigManager class**
   - Location: `apps/vendor_bills/services/aging_config_manager.py`
   - Methods for config retrieval and caching

2. **Implement get_config method**
   - Accept tenant_id, vendor_id parameters
   - Implement resolution hierarchy (vendor > tenant > default)
   - Cache configurations for performance
   - Return bucket list with all properties

3. **Implement create_config method**
   - Accept configuration parameters
   - Validate bucket definitions
   - Check for overlaps and gaps
   - Save to database
   - Clear relevant caches

4. **Implement update_config method**
   - Accept config ID and updated parameters
   - Validate changes don't break existing data
   - Update database
   - Clear caches

5. **Implement delete_config method**
   - Prevent deletion of default configuration
   - Check if config is in use
   - Soft delete or mark inactive
   - Clear caches

#### Step 4: Implement Bucket Classifier

1. **Create classify_into_bucket method**
   - Accept days_outstanding and config_id/tenant_id
   - Retrieve appropriate configuration
   - Iterate through buckets to find match
   - Return bucket code and full bucket object

2. **Add performance optimization**
   - Cache bucket configurations
   - Use efficient range checking
   - Minimize database queries

3. **Handle edge cases**
   - Negative days (shouldn't happen but handle gracefully)
   - Days beyond largest bucket (goes to last bucket)
   - Exact boundary matches (inclusive lower, exclusive upper)

#### Step 5: Implement Configuration API

1. **Create ConfigViewSet**
   - Location: `apps/vendor_bills/api/aging_config_views.py`
   - List all configurations for tenant
   - Retrieve specific configuration
   - Create new configuration
   - Update existing configuration
   - Delete/deactivate configuration

2. **Add validation serializers**
   - BucketSerializer with validation
   - AgingBucketConfigSerializer
   - Validate bucket ranges don't overlap
   - Validate required fields present

3. **Add permissions**
   - Only admins can create/modify configurations
   - All users can view active configurations
   - Tenant isolation enforced

#### Step 6: Add Configuration UI Support

1. **Create configuration endpoints**
   - GET /api/aging-configs/ - List configurations
   - GET /api/aging-configs/{id}/ - Get specific config
   - POST /api/aging-configs/ - Create configuration
   - PUT /api/aging-configs/{id}/ - Update configuration
   - DELETE /api/aging-configs/{id}/ - Delete configuration

2. **Add response formatting**
   - Include bucket definitions in response
   - Include usage statistics (how many bills in each bucket)
   - Include validation status

3. **Add filtering**
   - Filter by is_active
   - Filter by tenant
   - Filter by is_default

#### Step 7: Integrate with Aging Service

1. **Update BillAgingService**
   - Accept bucket_config_id parameter
   - Use AgingBucketConfigManager to get config
   - Pass config to classify_into_bucket calls

2. **Update calculate_aging method**
   - Retrieve appropriate config for context
   - Use config for bucket classification
   - Include config details in results

3. **Update aging report methods**
   - Include bucket labels from configuration
   - Use bucket colors for display
   - Include bucket descriptions in reports

#### Step 8: Add Configuration Validation

1. **Create validation service**
   - Validate no overlapping ranges
   - Validate no gaps in ranges
   - Validate all required fields present
   - Validate logical ordering (min < max)

2. **Add migration path validation**
   - Check if changing config affects existing aging calculations
   - Warn about impact of bucket changes
   - Provide recalculation recommendations

3. **Add configuration testing**
   - Test each bucket range
   - Verify classification for sample days values
   - Check boundary conditions

#### Step 9: Implement Caching Strategy

1. **Cache configuration data**
   - Cache active configurations by tenant
   - Cache default configuration globally
   - Set appropriate TTL (1 hour default)

2. **Implement cache invalidation**
   - Invalidate on configuration create/update/delete
   - Invalidate tenant-specific caches only when needed
   - Invalidate global cache for default changes

3. **Add cache warming**
   - Pre-load commonly used configurations
   - Load on application startup
   - Background refresh before expiry

#### Step 10: Add Documentation and Examples

1. **Document configuration structure**
   - Explain bucket fields and purpose
   - Provide examples of different schemes
   - Document resolution hierarchy

2. **Create configuration examples**
   - Provide JSON examples for different industries
   - Show how to customize buckets
   - Explain when to use custom vs. default

3. **Document API usage**
   - Show how to retrieve configurations
   - Show how to create custom configurations
   - Provide API request/response examples

### Expected Outcome

After completing Task 73, the system will have:

1. **Bucket Configuration Models**
   - AgingBucketConfig model for configuration storage
   - AgingBucket model for individual bucket definitions
   - Proper validation and constraints

2. **Default Configuration**
   - Standard 4-bucket configuration (0-30, 31-60, 61-90, 90+)
   - Loaded via fixture or data migration
   - Marked as default and always available

3. **Configuration Manager**
   - AgingBucketConfigManager for config operations
   - Configuration retrieval with hierarchy
   - CRUD operations for configurations
   - Caching for performance

4. **Bucket Classifier**
   - classify_into_bucket method using configurations
   - Efficient bucket matching algorithm
   - Proper handling of edge cases

5. **API Endpoints**
   - Full CRUD API for aging configurations
   - Proper validation and serialization
   - Tenant isolation and permissions

6. **Service Integration**
   - BillAgingService uses configurations
   - Configurable bucket classification
   - Configuration details in aging results

7. **Flexibility**
   - Support for custom bucket schemes
   - Tenant-specific overrides
   - Multiple active configurations

### Verification Checklist

**Model Implementation:**
- [ ] AgingBucketConfig model created with all fields
- [ ] AgingBucket model created with all fields
- [ ] Relationships properly defined (FK, related_name)
- [ ] Validation rules implemented in models
- [ ] Model methods implemented (get_bucket_for_days, etc.)

**Default Configuration:**
- [ ] Default configuration fixture created
- [ ] Data migration loads default config
- [ ] Default includes all 4 standard buckets
- [ ] Default marked with is_default=True
- [ ] Default configuration immutable (cannot delete)

**Configuration Manager:**
- [ ] AgingBucketConfigManager class created
- [ ] get_config implements resolution hierarchy
- [ ] Vendor-specific configs take precedence
- [ ] Tenant configs used as fallback
- [ ] Default config always available

**CRUD Operations:**
- [ ] create_config creates valid configurations
- [ ] update_config updates without breaking references
- [ ] delete_config prevents deletion of active configs
- [ ] Proper validation on all operations

**Bucket Classification:**
- [ ] classify_into_bucket correctly classifies bills
- [ ] Boundary conditions handled (0 days, exact boundaries)
- [ ] Edge cases handled (negative days, very large days)
- [ ] Uses correct configuration for context

**Validation:**
- [ ] No overlapping ranges allowed
- [ ] No gaps in ranges (0 to infinity covered)
- [ ] min_days < max_days validation
- [ ] All required fields validated
- [ ] Unique codes within configuration

**API Implementation:**
- [ ] List endpoint returns all tenant configurations
- [ ] Retrieve endpoint returns specific configuration
- [ ] Create endpoint validates and saves configurations
- [ ] Update endpoint validates changes
- [ ] Delete endpoint properly deactivates configs
- [ ] Proper serialization with nested buckets

**Permissions:**
- [ ] Only admins can create/modify configurations
- [ ] All authenticated users can view configurations
- [ ] Tenant isolation enforced
- [ ] Cannot access other tenant configurations

**Caching:**
- [ ] Configurations cached after first retrieval
- [ ] Cache invalidated on updates
- [ ] Tenant-specific cache keys used
- [ ] Appropriate TTL set

**Integration:**
- [ ] BillAgingService uses configurations
- [ ] Aging calculations use correct buckets
- [ ] Reports display bucket labels from config
- [ ] Colors from config used in displays

**Settings:**
- [ ] AGING_BUCKET_CONFIG in settings
- [ ] Settings allow override of defaults
- [ ] Settings properly documented

**Testing:**
- [ ] Unit tests for model validation
- [ ] Unit tests for configuration manager
- [ ] Unit tests for bucket classification
- [ ] Tests for resolution hierarchy
- [ ] Tests for boundary conditions
- [ ] Integration tests with aging service
- [ ] API endpoint tests

**Documentation:**
- [ ] Configuration structure documented
- [ ] Example configurations provided
- [ ] API usage documented
- [ ] Customization guide created

---

## Task 74: Aging Report Generator

### Overview

Implement a comprehensive aging report generator that produces formatted, professional aging reports in multiple output formats (PDF, Excel, HTML). The generator should support various report layouts, grouping options, filtering capabilities, and customizable presentation styles to meet diverse business reporting needs.

**Objectives:**
- Generate detailed aging reports with bill-level detail
- Generate summary aging reports with bucket totals
- Support grouping by vendor, department, payment terms
- Provide multiple output formats (PDF, Excel, HTML, JSON)
- Include comparative aging analysis (current vs. previous period)
- Support custom date ranges and as-of-date reporting
- Include charts and visualizations in reports
- Enable scheduled report generation and distribution

**Business Value:**
- Provides management visibility into payment obligations
- Supports financial planning and cash flow forecasting
- Enables proactive vendor relationship management
- Facilitates aging trend analysis over time
- Supports audit and compliance requirements
- Automates manual reporting tasks

### Dependencies

**Internal:**
- BillAgingService (Task 72)
- AgingBucketConfig system (Task 73)
- Vendor, Bill, Payment models
- Report generation infrastructure

**External:**
- ReportLab or WeasyPrint for PDF generation
- openpyxl or xlsxwriter for Excel generation
- Chart generation library (matplotlib, Chart.js)
- Template engine (Jinja2, Django templates)

**Integration Points:**
- Aging service for data retrieval
- Email system for report distribution
- Storage system for report archival
- Dashboard for on-demand report generation

### Aging Report Types

```
┌────────────────────────────────────────────────────────────┐
│                  Aging Report Types                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Summary Aging Report                                    │
│     ─────────────────────────────────────────               │
│     • Bucket totals only                                    │
│     • Grouped by vendor or department                       │
│     • High-level overview                                   │
│     • Includes percentages and totals                       │
│     • Suitable for executive dashboards                     │
│                                                             │
│  2. Detailed Aging Report                                   │
│     ───────────────────────────────────                     │
│     • Bill-level detail                                     │
│     • All bill information included                         │
│     • Outstanding amounts per bill                          │
│     • Days outstanding per bill                             │
│     • Suitable for accounts payable team                    │
│                                                             │
│  3. Vendor Aging Report                                     │
│     ─────────────────────────────────────                   │
│     • One vendor per report                                 │
│     • Complete vendor context                               │
│     • All outstanding bills for vendor                      │
│     • Payment history summary                               │
│     • Suitable for vendor relations                         │
│                                                             │
│  4. Comparative Aging Report                                │
│     ──────────────────────────────────────                  │
│     • Current period vs. previous period                    │
│     • Trend analysis                                        │
│     • Change indicators                                     │
│     • Movement between buckets                              │
│     • Suitable for financial analysis                       │
│                                                             │
│  5. Overdue Bills Report                                    │
│     ───────────────────────────────────                     │
│     • Only overdue bills (past due date)                    │
│     • Sorted by days overdue                                │
│     • Priority indicators                                   │
│     • Action recommendations                                │
│     • Suitable for collections                              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Report Structure - Summary Format

```
┌────────────────────────────────────────────────────────────┐
│              VENDOR BILLS AGING SUMMARY                     │
│              Company Name                                   │
│              As of: January 24, 2026                        │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Vendor Name        │ Current │ 31-60  │ 61-90  │  90+   │ Total      │
│                    │  0-30   │  Days  │  Days  │  Days  │            │
├────────────────────┼─────────┼────────┼────────┼────────┼────────────┤
│ Vendor A           │ $10,000 │ $5,000 │ $2,000 │   $0   │ $17,000    │
│ Vendor B           │ $15,000 │    $0  │ $1,000 │ $500   │ $16,500    │
│ Vendor C           │  $8,000 │ $3,000 │    $0  │   $0   │ $11,000    │
├────────────────────┼─────────┼────────┼────────┼────────┼────────────┤
│ TOTAL              │ $33,000 │ $8,000 │ $3,000 │ $500   │ $44,500    │
│ Percentage         │  74.2%  │ 18.0%  │  6.7%  │  1.1%  │  100.0%    │
└────────────────────┴─────────┴────────┴────────┴────────┴────────────┘

Summary Statistics:
• Total Outstanding: $44,500.00
• Number of Vendors: 3
• Number of Bills: 15
• Average Days Outstanding: 28 days
• Oldest Bill: 95 days overdue

Distribution Chart:
[Bar chart showing amount distribution across buckets]
```

### Report Structure - Detailed Format

```
┌────────────────────────────────────────────────────────────────────┐
│              VENDOR BILLS AGING DETAIL REPORT                       │
│              Company Name                                           │
│              As of: January 24, 2026                                │
└────────────────────────────────────────────────────────────────────┘

Vendor: Vendor A
─────────────────────────────────────────────────────────────────────
│ Bill #  │ Date       │ Due Date   │ Amount    │ Paid      │ Balance   │ Days │ Bucket │
├─────────┼────────────┼────────────┼───────────┼───────────┼───────────┼──────┼────────┤
│ INV-001 │ 2025-12-15 │ 2026-01-14 │ $5,000.00 │    $0.00  │ $5,000.00 │  10  │ 0-30   │
│ INV-002 │ 2025-11-20 │ 2025-12-20 │ $3,000.00 │ $1,000.00 │ $2,000.00 │  35  │ 31-60  │
│ INV-003 │ 2025-10-15 │ 2025-11-14 │ $10,000.00│    $0.00  │ $10,000.00│  71  │ 61-90  │
├─────────┴────────────┴────────────┴───────────┴───────────┴───────────┴──────┴────────┤
│ Vendor A Total:                    $18,000.00   $1,000.00   $17,000.00                │
└────────────────────────────────────────────────────────────────────────────────────────┘

Vendor: Vendor B
─────────────────────────────────────────────────────────────────────
[Similar detail structure...]

Grand Total: $44,500.00
```

### Report Generator Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            Aging Report Generator Architecture                │
└──────────────────────────────────────────────────────────────┘
                             │
                             ├─── Generator Layer
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Data Layer  │    │ Format Layer │    │ Output Layer │
│              │    │              │    │              │
│ • Query Data │    │ • Templates  │    │ • PDF        │
│ • Calculate  │    │ • Styling    │    │ • Excel      │
│ • Aggregate  │    │ • Layout     │    │ • HTML       │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            ┌──────────────┐  ┌──────────────┐
            │ Distribution │  │   Storage    │
            │   • Email    │  │   • Archive  │
            │   • Download │  │   • Retrieve │
            └──────────────┘  └──────────────┘
```

### Report Generation Flow

```
┌─────────────────┐
│  Generate       │
│  Report Request │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────┐
│  Validate Parameters         │
│  • Report type               │
│  • Date range                │
│  • Output format             │
│  • Grouping options          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Retrieve Aging Data         │
│  • Call BillAgingService     │
│  • Apply filters             │
│  • Get detailed/summary data │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Format Data                 │
│  • Apply grouping            │
│  • Calculate totals          │
│  • Sort and organize         │
│  • Add metadata              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Generate Visualizations     │
│  • Create charts             │
│  • Add graphs                │
│  • Apply colors              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Render Report               │
│  • Apply template            │
│  • Generate PDF/Excel/HTML   │
│  • Apply styling             │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Save/Distribute             │
│  • Store in archive          │
│  • Send via email            │
│  • Return for download       │
└──────────────────────────────┘
```

### Instructions

#### Step 1: Create Report Generator Service

1. **Create service file**
   - Location: `apps/vendor_bills/services/aging_report_generator.py`
   - Import required dependencies (ReportLab, openpyxl, etc.)
   - Set up class structure

2. **Define AgingReportGenerator class**
   - Initialize with aging_service instance
   - Accept report configuration in __init__
   - Store output directory configuration

3. **Add report type enumeration**
   - SUMMARY = 'summary'
   - DETAILED = 'detailed'
   - VENDOR = 'vendor'
   - COMPARATIVE = 'comparative'
   - OVERDUE = 'overdue'

#### Step 2: Implement Data Retrieval

1. **Create gather_report_data method**
   - Accept report parameters (type, filters, date range)
   - Call BillAgingService to get aging data
   - Retrieve bucket configuration for labels
   - Get additional context (company name, logo)

2. **Implement data formatting**
   - Convert aging data to report-friendly structure
   - Apply grouping (vendor, department)
   - Calculate subtotals and grand totals
   - Add percentage calculations

3. **Add comparative data retrieval**
   - Get current period aging
   - Get previous period aging
   - Calculate deltas and trends
   - Identify bills that moved between buckets

#### Step 3: Implement Summary Report Generation

1. **Create generate_summary_report method**
   - Accept output format parameter
   - Gather summary aging data
   - Group by vendor or department
   - Calculate bucket totals and percentages

2. **Implement PDF rendering**
   - Use ReportLab or WeasyPrint
   - Create header with company info and date
   - Create table with bucket columns
   - Add totals row with percentages
   - Add summary statistics section

3. **Implement Excel rendering**
   - Use openpyxl or xlsxwriter
   - Create formatted worksheet
   - Add header rows with styling
   - Populate data rows
   - Add formulas for totals
   - Add conditional formatting (colors per bucket)
   - Create summary chart

4. **Implement HTML rendering**
   - Use Django template or Jinja2
   - Create responsive HTML table
   - Add CSS styling
   - Include inline charts (Chart.js)
   - Make print-friendly

#### Step 4: Implement Detailed Report Generation

1. **Create generate_detailed_report method**
   - Gather detailed aging data with bill-level info
   - Group bills by vendor
   - Include all bill details (number, dates, amounts)

2. **Implement PDF rendering**
   - Multi-page support for large datasets
   - Vendor sections with headers
   - Bill detail tables
   - Page numbers and headers/footers
   - Professional formatting

3. **Implement Excel rendering**
   - Multiple sheets if needed (one per vendor or all bills)
   - Frozen header rows
   - Auto-filter enabled
   - Conditional formatting for overdue amounts
   - Subtotal rows per vendor

4. **Implement HTML rendering**
   - Scrollable table for large datasets
   - Collapsible vendor sections
   - Sort and filter capabilities (JavaScript)
   - Responsive design

#### Step 5: Implement Vendor-Specific Report

1. **Create generate_vendor_report method**
   - Accept vendor_id parameter
   - Get all aging data for vendor
   - Include vendor details (contact, terms)
   - Include payment history summary

2. **Implement multi-format rendering**
   - Similar to detailed report but vendor-focused
   - Add vendor header section
   - Include vendor logo if available
   - Add payment terms and credit limit info
   - Show payment history graph

#### Step 6: Implement Comparative Report

1. **Create generate_comparative_report method**
   - Accept two date periods for comparison
   - Get aging data for both periods
   - Calculate changes in each bucket
   - Identify trend direction (improving/worsening)

2. **Implement comparison layout**
   - Side-by-side bucket comparisons
   - Change indicators (arrows, colors)
   - Delta amounts and percentages
   - Trend charts showing movement

3. **Add movement analysis**
   - Show bills that moved between buckets
   - Highlight newly overdue bills
   - Highlight bills that were paid
   - Summary of changes

#### Step 7: Implement Overdue Report

1. **Create generate_overdue_report method**
   - Filter to only overdue bills (days_past_due > 0)
   - Sort by days overdue and amount
   - Include urgency indicators

2. **Add prioritization**
   - Calculate priority scores
   - Highlight high-priority bills
   - Add action recommendations

3. **Include collection information**
   - Contact details for each vendor
   - Previous contact log summary
   - Suggested next steps

#### Step 8: Implement Chart Generation

1. **Create chart generator methods**
   - create_bucket_distribution_chart: Bar chart of amounts per bucket
   - create_vendor_comparison_chart: Compare vendors side-by-side
   - create_trend_chart: Show aging trend over time
   - create_pie_chart: Percentage distribution

2. **Implement chart rendering**
   - Use matplotlib for PDF embedding
   - Use Chart.js for HTML reports
   - Save charts as images for Excel
   - Apply consistent styling and colors

3. **Add chart customization**
   - Support different chart types
   - Allow color customization
   - Support legends and labels
   - Handle zero/null data gracefully

#### Step 9: Implement Report Templates

1. **Create PDF templates**
   - Define header/footer templates
   - Create table layouts
   - Define font styles and sizes
   - Set up page margins and sizing

2. **Create Excel templates**
   - Define worksheet structure
   - Set up cell styles
   - Configure column widths
   - Set up print areas and page breaks

3. **Create HTML templates**
   - Location: `apps/vendor_bills/templates/reports/`
   - Create aging_summary.html
   - Create aging_detailed.html
   - Include CSS for styling
   - Make responsive and print-friendly

#### Step 10: Implement Report Storage and Retrieval

1. **Create report storage**
   - Generate unique report ID
   - Save report file to storage (file system or S3)
   - Create AgingReport model to track generated reports
   - Store metadata (generation date, parameters, file path)

2. **Implement retrieval methods**
   - get_report_by_id: Retrieve stored report
   - list_reports: List historical reports with filters
   - delete_report: Remove old reports

3. **Add report archiving**
   - Configure retention policy
   - Archive old reports
   - Implement cleanup task to remove expired reports

### Expected Outcome

After completing Task 74, the system will have:

1. **Report Generator Service**
   - AgingReportGenerator class with full functionality
   - Support for multiple report types
   - Multi-format output (PDF, Excel, HTML)

2. **Report Types Implemented**
   - Summary aging reports
   - Detailed aging reports
   - Vendor-specific reports
   - Comparative period reports
   - Overdue bills reports

3. **Output Formats**
   - Professional PDF reports with proper formatting
   - Excel reports with formulas and formatting
   - HTML reports with interactive features
   - JSON for programmatic access

4. **Visualizations**
   - Bar charts for bucket distribution
   - Pie charts for percentage breakdown
   - Trend charts for comparative analysis
   - Embedded charts in all report formats

5. **Report Features**
   - Flexible grouping (vendor, department)
   - Custom date ranges
   - Filtering capabilities
   - Summary statistics
   - Professional formatting and styling

6. **Storage and Retrieval**
   - Generated reports stored and tracked
   - Historical report access
   - Report metadata management
   - Archival and cleanup

### Verification Checklist

**Service Implementation:**
- [ ] AgingReportGenerator class created
- [ ] All report types supported
- [ ] Multiple output formats implemented
- [ ] Proper dependency injection

**Summary Report:**
- [ ] Summary data correctly aggregated
- [ ] Grouping by vendor works
- [ ] Bucket totals accurate
- [ ] Percentages calculated correctly
- [ ] PDF output professional and readable
- [ ] Excel output with formulas and formatting
- [ ] HTML output responsive and styled

**Detailed Report:**
- [ ] Bill-level details included
- [ ] Vendor grouping works
- [ ] All bill fields displayed
- [ ] Outstanding amounts correct
- [ ] Days outstanding accurate
- [ ] Multi-page PDF rendering works
- [ ] Excel with multiple sheets if needed

**Vendor Report:**
- [ ] Single vendor data retrieved
- [ ] Vendor details included
- [ ] Payment history shown
- [ ] Professional formatting
- [ ] All output formats work

**Comparative Report:**
- [ ] Two-period comparison accurate
- [ ] Deltas calculated correctly
- [ ] Trend direction indicated
- [ ] Movement analysis works
- [ ] Changes highlighted appropriately

**Overdue Report:**
- [ ] Only overdue bills included
- [ ] Sorted by priority
- [ ] Urgency indicators present
- [ ] Contact information included
- [ ] Action recommendations shown

**Charts and Visualizations:**
- [ ] Charts render correctly in PDFs
- [ ] Charts embedded in Excel
- [ ] HTML charts interactive
- [ ] Colors consistent with bucket config
- [ ] Legends and labels clear

**PDF Output:**
- [ ] Professional formatting
- [ ] Headers and footers on all pages
- [ ] Page numbers correct
- [ ] Tables span pages properly
- [ ] Company logo included
- [ ] Print-friendly

**Excel Output:**
- [ ] Proper worksheet structure
- [ ] Formulas calculate correctly
- [ ] Conditional formatting applied
- [ ] Auto-filter enabled
- [ ] Column widths appropriate
- [ ] Charts included
- [ ] Print settings configured

**HTML Output:**
- [ ] Responsive design
- [ ] Print-friendly CSS
- [ ] Tables formatted well
- [ ] Charts render correctly
- [ ] Interactive features work (if applicable)

**Data Accuracy:**
- [ ] Aging data matches service output
- [ ] Totals add up correctly
- [ ] Percentages sum to 100%
- [ ] Outstanding amounts accurate
- [ ] Days calculations correct

**Storage:**
- [ ] Reports saved to proper location
- [ ] Metadata tracked in database
- [ ] Unique IDs generated
- [ ] Retrieval works correctly

**Performance:**
- [ ] Large datasets handled efficiently
- [ ] Report generation completes in reasonable time
- [ ] Memory usage acceptable
- [ ] No performance degradation with many bills

**Error Handling:**
- [ ] Missing data handled gracefully
- [ ] Invalid parameters rejected with clear messages
- [ ] File write errors caught and logged
- [ ] Partial failures don't corrupt reports

**Testing:**
- [ ] Unit tests for data gathering
- [ ] Unit tests for formatting
- [ ] Unit tests for calculations
- [ ] Integration tests for full report generation
- [ ] Tests for each output format
- [ ] Tests for each report type
- [ ] Tests with edge cases (no data, single bill)

---

## Task 75: Overdue Bill Alert Celery Task

### Overview

Implement an automated alert system using Celery periodic tasks to proactively notify relevant stakeholders about overdue bills, approaching due dates, and aging milestones. This system should support configurable alert rules, multiple notification channels, and escalation paths to ensure timely payment processing.

**Objectives:**
- Create Celery periodic task for overdue bill checking
- Implement configurable alert rules and thresholds
- Support multiple notification channels (email, in-app, SMS)
- Provide alert escalation based on aging buckets
- Track alert history and acknowledgments
- Support alert suppression for disputed or on-hold bills
- Enable daily, weekly digest options
- Provide vendor-specific alert customization

**Business Value:**
- Prevents late payment penalties and interest charges
- Maintains positive vendor relationships through timely payments
- Automates manual payment reminder processes
- Reduces risk of missed payment obligations
- Improves cash flow management through proactive planning
- Supports compliance with payment term requirements

### Dependencies

**Internal:**
- BillAgingService (Task 72) for aging calculations
- Vendor Bill models with status tracking
- Email notification system
- User/role models for recipient assignment
- Celery configuration and task infrastructure

**External:**
- Celery beat for periodic task scheduling
- Email backend (SMTP, SendGrid, etc.)
- SMS gateway (optional, Twilio, SNS)
- Template engine for notification content

**Integration Points:**
- Aging service for overdue bill identification
- User management for recipient lookup
- Notification system for message delivery
- Dashboard for in-app alerts
- Audit log for alert tracking

### Alert Types and Triggers

```
┌─────────────────────────────────────────────────────────────┐
│                    Alert Types and Triggers                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Overdue Alert                                            │
│     ─────────────────────────                                │
│     Trigger: Bill past due date                              │
│     Frequency: Daily check                                   │
│     Recipients: AP staff, approvers, finance managers        │
│     Priority: High                                           │
│     Content: Bill details, days overdue, vendor contact      │
│                                                              │
│  2. Approaching Due Date Alert                               │
│     ──────────────────────────────────────                   │
│     Trigger: Bill due within X days (configurable)           │
│     Frequency: Daily check                                   │
│     Recipients: AP staff, assigned approver                  │
│     Priority: Medium                                         │
│     Content: Bill details, due date, days remaining          │
│                                                              │
│  3. Aging Bucket Transition Alert                            │
│     ─────────────────────────────────────────                │
│     Trigger: Bill moves to higher aging bucket               │
│     Frequency: Daily check                                   │
│     Recipients: Finance managers, executives (for 90+)       │
│     Priority: Escalating based on bucket                     │
│     Content: Aging analysis, payment urgency                 │
│                                                              │
│  4. Large Amount Overdue Alert                               │
│     ──────────────────────────────────────                   │
│     Trigger: Overdue bill exceeds $ threshold                │
│     Frequency: Daily check, immediate on transition          │
│     Recipients: Finance managers, CFO                        │
│     Priority: Critical                                       │
│     Content: Amount, vendor, impact analysis                 │
│                                                              │
│  5. Vendor Aging Threshold Alert                             │
│     ─────────────────────────────────────────                │
│     Trigger: Total vendor outstanding exceeds limit          │
│     Frequency: Daily check                                   │
│     Recipients: AP managers, vendor relations                │
│     Priority: Medium-High                                    │
│     Content: Vendor summary, outstanding bills list          │
│                                                              │
│  6. Weekly Aging Digest                                      │
│     ──────────────────────────────                           │
│     Trigger: Scheduled (e.g., Monday morning)                │
│     Frequency: Weekly                                        │
│     Recipients: Finance team, management                     │
│     Priority: Informational                                  │
│     Content: Aging summary, trends, highlights               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Alert Configuration Structure

```
┌─────────────────────────────────────────────────────────────┐
│              Alert Rule Configuration                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  AlertRule:                                                  │
│  {                                                           │
│    "id": "rule_001",                                         │
│    "name": "Overdue Bills - Daily",                          │
│    "alert_type": "OVERDUE",                                  │
│    "is_active": true,                                        │
│    "tenant_id": "tenant_123",                                │
│                                                              │
│    "trigger_conditions": {                                   │
│      "days_overdue_min": 1,                                  │
│      "days_overdue_max": null,                               │
│      "amount_threshold": null,                               │
│      "vendor_ids": null,  // null = all vendors              │
│      "exclude_on_hold": true,                                │
│      "exclude_disputed": true                                │
│    },                                                        │
│                                                              │
│    "schedule": {                                             │
│      "frequency": "DAILY",                                   │
│      "time": "08:00:00",                                     │
│      "timezone": "UTC"                                       │
│    },                                                        │
│                                                              │
│    "recipients": {                                           │
│      "roles": ["AP_STAFF", "FINANCE_MANAGER"],               │
│      "users": ["user@example.com"],                          │
│      "notification_channels": ["EMAIL", "IN_APP"]            │
│    },                                                        │
│                                                              │
│    "escalation": {                                           │
│      "enabled": true,                                        │
│      "escalation_rules": [                                   │
│        {                                                     │
│          "days_overdue": 30,                                 │
│          "add_recipients": {"roles": ["CFO"]}                │
│        },                                                    │
│        {                                                     │
│          "days_overdue": 60,                                 │
│          "add_recipients": {"roles": ["CEO"]},               │
│          "priority": "CRITICAL"                              │
│        }                                                     │
│      ]                                                       │
│    },                                                        │
│                                                              │
│    "notification_template": "overdue_bill_alert_template",   │
│    "digest_mode": false,  // Send individual or digest       │
│    "max_bills_per_alert": 50                                 │
│  }                                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Alert Processing Flow

```
┌────────────────────────┐
│   Celery Beat          │
│   Triggers Task        │
│   (Scheduled Time)     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  overdue_bill_alert_task           │
│  Executes                          │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Load Active Alert Rules           │
│  • Query AlertRule model           │
│  • Filter by is_active=True        │
│  • Filter by tenant context        │
│  • Filter by schedule matches      │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  For Each Alert Rule:              │
│  ↓                                 │
│  1. Get Aging Data                 │
│  2. Apply Rule Conditions          │
│  3. Identify Matching Bills        │
│  4. Check Alert History            │
│  5. Filter Already Alerted         │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Determine Recipients              │
│  • Resolve roles to users          │
│  • Add specified users             │
│  • Apply escalation rules          │
│  • Get contact information         │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Prepare Notification Content      │
│  • Load template                   │
│  • Populate with bill data         │
│  • Format amounts and dates        │
│  • Add action links                │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Send Notifications                │
│  • Email to recipients             │
│  • In-app notifications            │
│  • SMS if configured               │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Log Alert History                 │
│  • Record alert sent               │
│  • Store bill IDs alerted          │
│  • Track recipients                │
│  • Store timestamps                │
└───────────┬────────────────────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Update Metrics                    │
│  • Count alerts sent               │
│  • Track success/failure           │
│  • Log to monitoring               │
└────────────────────────────────────┘
```

### Alert Escalation Logic

```
┌─────────────────────────────────────────────────────────────┐
│                 Alert Escalation Logic                       │
└─────────────────────────────────────────────────────────────┘

Bill Age: 5 days overdue
├─ Alert Level: Standard
├─ Recipients: AP Staff
├─ Priority: Medium
└─ Action: Send standard overdue notice

        │
        │ Time Passes...
        ▼

Bill Age: 35 days overdue (Entered 31-60 bucket)
├─ Alert Level: Escalated Level 1
├─ Recipients: AP Staff + Finance Manager
├─ Priority: High
└─ Action: Send escalated notice with urgency

        │
        │ Time Passes...
        ▼

Bill Age: 65 days overdue (Entered 61-90 bucket)
├─ Alert Level: Escalated Level 2
├─ Recipients: AP Staff + Finance Manager + CFO
├─ Priority: Critical
└─ Action: Send critical notice, request immediate action

        │
        │ Time Passes...
        ▼

Bill Age: 95 days overdue (Entered 90+ bucket)
├─ Alert Level: Maximum Escalation
├─ Recipients: Full Finance Team + Executive Team
├─ Priority: Critical
└─ Action: Immediate intervention required, possible vendor issue
```

### Alert Deduplication

```
┌─────────────────────────────────────────────────────────────┐
│              Alert Deduplication Logic                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Purpose: Prevent sending duplicate alerts for same bill     │
│                                                              │
│  Check Alert History:                                        │
│  ┌─────────────────────────────────────────┐                │
│  │ Bill ID: INV-12345                      │                │
│  │ Last Alert: 2026-01-23 08:00:00         │                │
│  │ Alert Type: OVERDUE                     │                │
│  │ Days Since Last Alert: 1 day            │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  Deduplication Rules:                                        │
│  1. Same alert type within 24 hours → Skip                   │
│  2. Moved to higher bucket → Send (escalation)               │
│  3. Amount increased significantly → Send                    │
│  4. Weekly digest → Include even if recent                   │
│  5. Acknowledged alert → Skip until next threshold           │
│                                                              │
│  Example Decision:                                           │
│  • Bill overdue, alerted yesterday → Skip today              │
│  • Bill moved from 30-day to 60-day bucket → Send now        │
│  • Bill still in same bucket after 7 days → Send reminder    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Instructions

#### Step 1: Create Alert Configuration Model

1. **Create AlertRule model**
   - Location: `apps/vendor_bills/models/alert_rule.py`
   - Fields: name, alert_type, is_active, tenant
   - Fields: trigger_conditions (JSONField)
   - Fields: schedule (JSONField)
   - Fields: recipients (JSONField)
   - Fields: escalation_rules (JSONField)
   - Fields: notification_template, digest_mode

2. **Create AlertHistory model**
   - Fields: alert_rule (FK), bill (FK), tenant
   - Fields: sent_date, recipients_list
   - Fields: notification_channel, status
   - Fields: error_message (if failed)
   - Index on (bill, alert_rule, sent_date)

3. **Add model methods**
   - AlertRule.matches_conditions(bill): Check if bill matches rule
   - AlertRule.get_recipients(): Resolve roles/users to contacts
   - AlertHistory.was_recently_alerted(bill, hours): Check deduplication

#### Step 2: Create Celery Task

1. **Create task file**
   - Location: `apps/vendor_bills/tasks/overdue_alerts.py`
   - Import Celery task decorator
   - Import required services and models

2. **Define overdue_bill_alert_task**
   - Decorate with @shared_task
   - Add task name: 'vendor_bills.overdue_bill_alert'
   - Add bind=True for self reference
   - Add retry configuration

3. **Implement task logic**
   - Get all active tenants
   - For each tenant, load active alert rules
   - Process each alert rule
   - Return summary of alerts sent

4. **Add task logging**
   - Log task start with timestamp
   - Log each tenant processed
   - Log alert rules evaluated
   - Log alerts sent count
   - Log any errors or exceptions

#### Step 3: Implement Alert Rule Processing

1. **Create process_alert_rule method**
   - Accept alert_rule parameter
   - Accept tenant context
   - Get aging data matching rule conditions
   - Filter bills already recently alerted
   - Return list of bills to alert on

2. **Apply trigger conditions**
   - Days overdue: filter by days_overdue_min/max
   - Amount threshold: filter by outstanding >= amount
   - Vendor filter: filter by vendor_ids if specified
   - Exclude on hold: filter out bills with is_on_hold=True
   - Exclude disputed: filter out bills with is_disputed=True

3. **Check alert history**
   - Query AlertHistory for each bill
   - Check last alert date
   - Apply deduplication rules
   - Skip bills alerted within suppression period

4. **Apply escalation logic**
   - Check if bill meets escalation thresholds
   - Determine appropriate escalation level
   - Add escalated recipients
   - Increase priority level

#### Step 4: Implement Recipient Resolution

1. **Create resolve_recipients method**
   - Accept alert_rule parameter
   - Accept escalation_level (optional)
   - Extract roles from rule configuration
   - Extract specific users from rule

2. **Resolve roles to users**
   - Query User model for users with specified roles
   - Filter by tenant
   - Filter by is_active=True
   - Get email addresses and contact info

3. **Add escalation recipients**
   - If escalation level triggered, add escalated roles
   - Merge with base recipients (deduplicate)
   - Ensure all have valid contact information

4. **Handle notification channel preferences**
   - Check user preferences for notification channels
   - Support email, in-app, SMS
   - Respect opt-out preferences

#### Step 5: Implement Notification Content Generation

1. **Create generate_notification_content method**
   - Accept alert_rule, bill_list, recipient
   - Load notification template
   - Populate template with data

2. **Prepare bill data**
   - Format bill details (number, vendor, amount)
   - Format dates (due date, days overdue)
   - Calculate totals if multiple bills
   - Add vendor contact information

3. **Add context data**
   - Company name and logo
   - Current date
   - Recipient name
   - Action links (view bill, process payment)

4. **Support digest mode**
   - If digest_mode=True, group all bills in one notification
   - If digest_mode=False, send individual notifications
   - Apply max_bills_per_alert limit

#### Step 6: Implement Notification Delivery

1. **Create send_notification method**
   - Accept recipients, content, channels
   - Send via each requested channel
   - Track delivery status

2. **Implement email delivery**
   - Use Django email backend
   - Create HTML and plain text versions
   - Add proper subject line
   - Include bill details and action links
   - Handle email send failures gracefully

3. **Implement in-app notification**
   - Create Notification object in database
   - Link to bill and recipient
   - Mark as unread
   - Support dismissal and acknowledgment

4. **Implement SMS delivery (optional)**
   - Use SMS gateway (Twilio, AWS SNS)
   - Format concise message for SMS
   - Include bill number and amount
   - Include link to web portal

#### Step 7: Implement Alert History Tracking

1. **Create record_alert_history method**
   - Accept alert_rule, bill, recipients, status
   - Create AlertHistory record
   - Store all relevant details
   - Commit to database

2. **Track successful delivery**
   - Store sent timestamp
   - Store recipient list
   - Store notification channels used
   - Mark status as SUCCESS

3. **Track failures**
   - Store error message
   - Mark status as FAILED
   - Log for later retry
   - Alert system administrators if critical

4. **Support alert acknowledgment**
   - Allow users to acknowledge alerts
   - Update AlertHistory with acknowledged_date
   - Optionally suppress future alerts for acknowledged bills

#### Step 8: Configure Celery Beat Schedule

1. **Add to celerybeat-schedule.py or settings**
   - Define periodic schedule for overdue_bill_alert_task
   - Set to run daily at configured time (e.g., 8:00 AM)
   - Add additional schedules for different alert types

2. **Example schedule configuration**
   ```
   'overdue-bill-alerts': {
       'task': 'vendor_bills.overdue_bill_alert',
       'schedule': crontab(hour=8, minute=0),
   },
   'approaching-due-date-alerts': {
       'task': 'vendor_bills.approaching_due_alert',
       'schedule': crontab(hour=9, minute=0),
   },
   'weekly-aging-digest': {
       'task': 'vendor_bills.weekly_aging_digest',
       'schedule': crontab(day_of_week=1, hour=7, minute=0),
   }
   ```

3. **Configure timezone handling**
   - Set CELERY_TIMEZONE in settings
   - Use tenant-specific timezones if needed
   - Convert schedule times appropriately

#### Step 9: Create Email Templates

1. **Create overdue bill alert template**
   - Location: `apps/vendor_bills/templates/emails/overdue_bill_alert.html`
   - Professional layout with company branding
   - Clear bill details table
   - Days overdue highlighted
   - Action buttons (View Bill, Process Payment)

2. **Create approaching due date template**
   - Similar structure to overdue template
   - Emphasize due date and days remaining
   - Suggest preparation for payment

3. **Create weekly digest template**
   - Summary section with totals
   - Aging breakdown by bucket
   - List of most critical bills
   - Trend indicators

4. **Create plain text versions**
   - Provide text-only versions for email clients without HTML
   - Maintain readability
   - Include all critical information

#### Step 10: Add Alert Management API

1. **Create AlertRuleViewSet**
   - Location: `apps/vendor_bills/api/alert_rule_views.py`
   - List all alert rules for tenant
   - Create new alert rule
   - Update existing alert rule
   - Delete/deactivate alert rule

2. **Create AlertHistoryViewSet**
   - List alert history with filters
   - View specific alert details
   - Acknowledge alert
   - Mark alert as read

3. **Add alert testing endpoint**
   - POST /api/alert-rules/{id}/test/
   - Runs alert rule immediately with dry-run
   - Returns bills that would be alerted
   - Returns recipients that would receive alerts
   - Useful for configuration validation

4. **Add alert metrics endpoint**
   - GET /api/alert-metrics/
   - Returns counts of alerts sent
   - Returns success/failure rates
   - Returns most alerted bills
   - Returns response times (acknowledgments)

### Expected Outcome

After completing Task 75, the system will have:

1. **Alert Configuration System**
   - AlertRule model for storing alert configurations
   - Support for multiple alert types and triggers
   - Flexible trigger conditions
   - Escalation rule definitions

2. **Celery Periodic Task**
   - overdue_bill_alert_task running on schedule
   - Automatic execution via Celery Beat
   - Multi-tenant support
   - Comprehensive error handling

3. **Alert Processing**
   - Rule evaluation against aging data
   - Condition matching for bill selection
   - Deduplication to prevent spam
   - Escalation logic for aging bills

4. **Notification Delivery**
   - Email notifications with professional templates
   - In-app notifications
   - Optional SMS notifications
   - Multi-channel support

5. **Alert History Tracking**
   - Complete history of alerts sent
   - Delivery status tracking
   - Acknowledgment support
   - Historical analysis capabilities

6. **Management Interface**
   - API for alert rule CRUD operations
   - Alert history viewing
   - Test/preview functionality
   - Metrics and reporting

7. **Configurable Behavior**
   - Tenant-specific alert rules
   - Vendor-specific customization
   - Channel preferences
   - Digest vs. individual modes

### Verification Checklist

**Model Implementation:**
- [ ] AlertRule model created with all fields
- [ ] AlertHistory model created
- [ ] Relationships properly defined
- [ ] JSON fields structured correctly
- [ ] Indexes created for performance

**Celery Task:**
- [ ] Task defined and registered
- [ ] Task runs successfully on schedule
- [ ] Multi-tenant processing works
- [ ] Task logging comprehensive
- [ ] Error handling robust

**Alert Rule Processing:**
- [ ] Rules loaded correctly for each tenant
- [ ] Trigger conditions applied accurately
- [ ] Bills correctly filtered
- [ ] Exclusions work (on_hold, disputed)
- [ ] Deduplication prevents spam

**Aging Data Integration:**
- [ ] BillAgingService called correctly
- [ ] Aging data accurate
- [ ] Outstanding amounts correct
- [ ] Days overdue calculated properly

**Recipient Resolution:**
- [ ] Roles resolve to correct users
- [ ] User emails retrieved
- [ ] Escalation adds correct recipients
- [ ] Tenant isolation maintained
- [ ] Active users only included

**Escalation Logic:**
- [ ] Escalation thresholds evaluated correctly
- [ ] Additional recipients added at right levels
- [ ] Priority increases with escalation
- [ ] Escalated notifications clearly marked

**Notification Content:**
- [ ] Templates load correctly
- [ ] Bill data populated accurately
- [ ] Formatting professional and clear
- [ ] Action links functional
- [ ] Vendor contact info included

**Email Delivery:**
- [ ] Emails sent successfully
- [ ] HTML and plain text versions both work
- [ ] Subject lines clear and informative
- [ ] Links in emails work correctly
- [ ] Failures handled gracefully

**In-App Notifications:**
- [ ] Notifications created in database
- [ ] Linked to correct bills and users
- [ ] Marked as unread initially
- [ ] Acknowledgment works
- [ ] Display properly in UI

**SMS Delivery (if implemented):**
- [ ] SMS sent successfully via gateway
- [ ] Message format concise and clear
- [ ] Links shortened appropriately
- [ ] Failures logged

**Alert History:**
- [ ] History records created for all alerts
- [ ] All fields populated correctly
- [ ] Status tracked accurately (success/failure)
- [ ] Timestamps recorded
- [ ] Queryable for reporting

**Deduplication:**
- [ ] Recent alerts detected
- [ ] Duplicate alerts prevented
- [ ] Escalations still sent despite recent alerts
- [ ] Suppression period configurable
- [ ] Works correctly across alert types

**Celery Beat Configuration:**
- [ ] Schedule defined in settings
- [ ] Task runs at specified times
- [ ] Multiple schedules supported
- [ ] Timezone handling correct

**Digest Mode:**
- [ ] Digest mode groups multiple bills
- [ ] Individual mode sends separate notifications
- [ ] Max bills per alert respected
- [ ] Configuration per rule works

**API Endpoints:**
- [ ] List alert rules works
- [ ] Create alert rule works
- [ ] Update alert rule works
- [ ] Delete/deactivate works
- [ ] Test endpoint provides accurate preview
- [ ] Alert history viewable via API

**Permissions:**
- [ ] Only authorized users can manage rules
- [ ] Users can only view their tenant's rules
- [ ] Alert history properly isolated
- [ ] Acknowledgment restricted to recipients

**Performance:**
- [ ] Task completes in reasonable time
- [ ] Large numbers of bills handled
- [ ] Database queries optimized
- [ ] No N+1 query issues
- [ ] Bulk operations used where appropriate

**Error Handling:**
- [ ] Email failures logged and handled
- [ ] Invalid configurations detected
- [ ] Missing data handled gracefully
- [ ] Task retries on transient failures
- [ ] Critical errors alert administrators

**Testing:**
- [ ] Unit tests for rule matching logic
- [ ] Unit tests for recipient resolution
- [ ] Unit tests for deduplication
- [ ] Unit tests for escalation logic
- [ ] Integration tests for full task execution
- [ ] Tests for email template rendering
- [ ] Tests for alert history creation

**Logging:**
- [ ] Task execution logged
- [ ] Alert sending logged
- [ ] Failures logged with details
- [ ] Performance metrics logged
- [ ] Audit trail complete

---

## Summary

This document has covered Tasks 72-75, implementing a comprehensive bill aging and alerting system:

- **Task 72: BillAgingService** - Core service for calculating bill aging, classifying into buckets, and providing aging analysis
- **Task 73: Aging Bucket Configuration** - Flexible system for defining and managing aging buckets with tenant-specific customization
- **Task 74: Aging Report Generator** - Professional report generation in multiple formats (PDF, Excel, HTML) with visualizations
- **Task 75: Overdue Bill Alert Celery Task** - Automated alert system for proactive notification of overdue bills with escalation

These components work together to provide complete visibility and proactive management of vendor payment obligations, supporting better cash flow management and vendor relationships.

---

**End of Document**
