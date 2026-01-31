# Tasks 74-80: COD Reconciliation and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** E - Pickup & COD  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-73_Pickup-Model-API.md](01_Tasks-67-73_Pickup-Model-API.md)
- **→ Next Group:** [../Group-F_Admin-Testing/](../Group-F_Admin-Testing/)

---

## Document Overview

This document covers the implementation of Cash on Delivery (COD) reporting and reconciliation functionality for Koombiyo courier services. It establishes the CODReport model to store collection data, implements integration with Koombiyo's COD reporting API, creates reconciliation logic to match collected amounts with orders, tracks settlement cycles, and provides verification workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create CODReport Model | Medium | 30 min |
| 75 | Create Report Date Range | Low | 15 min |
| 76 | Create Total Collected | Low | 20 min |
| 77 | Create get_cod_report API | Medium | 40 min |
| 78 | Create COD Reconciliation | High | 60 min |
| 79 | Create COD Settlement | Medium | 35 min |
| 80 | Verify Pickup & COD | Low | 25 min |

---

## Task 74: Create CODReport Model

### Overview
Create the CODReport model to store Cash on Delivery collection reports received from Koombiyo. This model tracks COD amounts collected by the courier, report date ranges, settlement status, and provides the foundation for reconciliation with internal order records. Essential for financial tracking in Sri Lankan e-commerce.

### Dependencies
- Task 66: Verify tracking & webhooks flow

### Instructions

1. **Navigate to COD models location**
   - Go to `backend/apps/shipping/models/` directory
   - Create new file named `cod_report.py`
   - This will contain COD-related models
   - Import required Django model classes

2. **Import required dependencies**
   - Import Django model classes and field types
   - Import TenantModel or add tenant ForeignKey
   - Import Decimal, timezone utilities
   - Import related models (Shipment, Tenant)

3. **Define the CODReport model class**
   - Create model class inheriting from appropriate base
   - Add class Meta with db_table and ordering
   - Set verbose names for admin interface
   - Configure default ordering by report date descending

4. **Add tenant relationship field**
   - Create ForeignKey to Tenant model
   - Set on_delete to CASCADE
   - Add related_name as 'cod_reports'
   - Include db_index for query performance

5. **Add tracking and audit fields**
   - Create created_at field with auto_now_add
   - Create updated_at field with auto_now
   - Add fetched_at timestamp for API retrieval time
   - Add fetched_by ForeignKey to User (nullable)

6. **Add Koombiyo integration fields**
   - Create koombiyo_report_id field (CharField)
   - Store the report ID from Koombiyo API
   - Add report_reference_number for tracking
   - Set max_length to 100 characters

7. **Add report status field**
   - Create status field with choices
   - Options: PENDING, VERIFIED, RECONCILED, SETTLED
   - Default to PENDING status
   - Track report processing lifecycle

8. **Configure shipment relationships**
   - Add ManyToManyField to Shipment model
   - Set related_name as 'cod_reports'
   - This links report to specific COD deliveries
   - Enables order-level reconciliation

9. **Add settlement tracking fields**
   - Create settlement_date DateField (nullable)
   - Add settlement_reference CharField
   - Create settlement_amount DecimalField
   - Track bank transfer details

10. **Add reconciliation fields**
    - Create reconciled_at timestamp (nullable)
    - Add reconciled_by ForeignKey to User
    - Create discrepancy_amount DecimalField
    - Add reconciliation_notes TextField

11. **Implement string representation**
    - Define __str__ method returning report info
    - Format: "COD Report CODRXX (Start-End) - LKR Amount"
    - Include tenant info if needed
    - Show verification status

12. **Add model methods**
    - Create is_reconciled property
    - Add get_discrepancy method
    - Implement has_settlement method
    - Add get_pending_amount helper

### CODReport Model Fields

| Field | Type | Purpose |
|-------|------|---------|
| tenant | ForeignKey | Multi-tenancy support |
| start_date | DateField | Report period start |
| end_date | DateField | Report period end |
| total_collected | DecimalField | Total COD collected (LKR) |
| status | CharField | Report processing status |
| koombiyo_report_id | CharField | API report ID |
| shipments | ManyToMany | Associated COD deliveries |
| settlement_date | DateField | Bank settlement date |
| settlement_amount | DecimalField | Actual settled amount |
| discrepancy_amount | DecimalField | Difference from expected |

### COD Report Reference Format

```
Format: CODR{tenant_id}-{year}{month}{day}
Examples:
├── CODR001-20260201 (Tenant 1, Feb 1, 2026)
├── CODR001-20260208 (Tenant 1, Feb 8, 2026)
└── CODR002-20260201 (Tenant 2, Feb 1, 2026)
```

### Model Relationships

```
CODReport Model
    │
    ├─── tenant ─────────────> Tenant
    │                           (ForeignKey)
    │
    ├─── shipments ──────────> Shipment
    │                           (ManyToMany)
    │
    ├─── fetched_by ─────────> User
    │                           (ForeignKey, nullable)
    │
    └─── reconciled_by ──────> User
                                (ForeignKey, nullable)
```

### COD Report Status Lifecycle

```
PENDING (Initial)
    │
    ├──> VERIFIED (Data validated)
    │        │
    │        └──> RECONCILED (Matched with orders)
    │                 │
    │                 └──> SETTLED (Payment received)
    │
    └──> DISPUTED (Discrepancy found)
             │
             └──> RESOLVED (Issue fixed)
```

### Sri Lankan COD Context

| Aspect | Implementation |
|--------|----------------|
| Currency | LKR (Sri Lankan Rupees) |
| Settlement Cycle | Weekly (typically Thursdays) |
| Collection Fee | Deducted from COD amount |
| Bank Transfer | Usually to merchant's bank |
| Typical Amount Range | LKR 500 - 50,000 per order |

### Expected Outcome
- CODReport model created with all required fields
- Multi-tenancy support implemented
- Relationships to Shipment and Tenant configured
- Settlement tracking fields added
- Reconciliation fields for audit trail
- Status tracking for report lifecycle

### Verification Checklist
- [ ] CODReport model class created in `cod_report.py`
- [ ] Tenant ForeignKey added with proper cascade
- [ ] ManyToMany relationship to Shipment configured
- [ ] start_date and end_date fields added
- [ ] total_collected DecimalField with currency precision
- [ ] Status field with lifecycle choices
- [ ] Settlement tracking fields included
- [ ] Reconciliation audit fields present
- [ ] __str__ method returns meaningful representation
- [ ] Model Meta configured with table name and ordering

---

## Task 75: Create Report Date Range

### Overview
Implement the date range fields (start_date and end_date) for COD reports with proper validation. These fields define the reporting period for which COD collections are tracked. Must handle weekly cycles, month-end scenarios, and ensure date ranges align with Koombiyo's reporting periods.

### Dependencies
- Task 74: Create CODReport Model

### Instructions

1. **Add start_date field**
   - Navigate to CODReport model in `cod_report.py`
   - Add DateField named `start_date`
   - Set null=False, blank=False (required field)
   - Add db_index=True for query performance

2. **Add end_date field**
   - Add DateField named `end_date`
   - Set null=False, blank=False (required field)
   - Add db_index=True for query performance
   - Create composite index with start_date

3. **Configure field properties**
   - Set verbose_name for both fields
   - Add help_text explaining date range
   - Include format example: "YYYY-MM-DD"
   - Set editable=True for admin interface

4. **Add date range validation**
   - Create clean method for model validation
   - Ensure end_date is after or equal to start_date
   - Validate date range is not in future
   - Check maximum range limit (e.g., 31 days)

5. **Implement weekly period helpers**
   - Create method get_week_start for start_date
   - Add get_week_end for end_date
   - Support Sunday-Saturday or Monday-Sunday weeks
   - Align with Koombiyo's reporting week

6. **Add date range utilities**
   - Create get_date_range_days method
   - Calculate number of days in range
   - Add get_business_days_count method
   - Exclude weekends and holidays

7. **Implement overlap detection**
   - Create method check_overlap with existing reports
   - Prevent duplicate report periods for same tenant
   - Allow overlap if reports have different statuses
   - Raise ValidationError on conflicts

8. **Add period formatting methods**
   - Create get_period_display method
   - Format as "Jan 1 - Jan 7, 2026"
   - Support short and long date formats
   - Add Sinhala date format option

9. **Implement report period presets**
   - Create class method for_current_week
   - Add for_previous_week preset
   - Create for_month preset
   - Support custom date range creation

10. **Add query optimization**
    - Create manager method for reports_in_period
    - Add filter for overlapping_reports
    - Support date-based aggregations
    - Optimize with proper database indexes

### Date Range Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| End After Start | end_date >= start_date | "End date must be after start date" |
| Not Future | end_date <= today | "Cannot create report for future dates" |
| Maximum Range | (end - start) <= 31 days | "Report period cannot exceed 31 days" |
| Minimum Range | (end - start) >= 1 day | "Report must cover at least 1 day" |

### Weekly COD Reporting Cycle

```
Sri Lankan COD Settlement Cycle (Weekly)

Week 1: Mon Jan 27 - Sun Feb 2
    ├── Collections: Feb 1 - Feb 7
    ├── Report Generated: Feb 8 (Monday)
    └── Settlement: Feb 13 (Following Thursday)

Week 2: Mon Feb 3 - Sun Feb 9
    ├── Collections: Feb 8 - Feb 14
    ├── Report Generated: Feb 15 (Monday)
    └── Settlement: Feb 20 (Following Thursday)
```

### Date Range Field Configuration

| Property | start_date | end_date |
|----------|-----------|----------|
| null | False | False |
| blank | False | False |
| db_index | True | True |
| validators | [date_validator] | [date_validator] |
| help_text | "Report period start" | "Report period end" |

### Overlap Detection Logic

```
Check for Overlapping Reports
    │
    ├── Query existing reports for tenant
    │       WHERE (new_start <= existing_end)
    │       AND (new_end >= existing_start)
    │
    ├── If overlap found:
    │       ├── Check status
    │       ├── PENDING/VERIFIED: Reject
    │       └── SETTLED: Allow (historical)
    │
    └── No overlap: Allow creation
```

### Date Range Display Formats

| Format | Example | Usage |
|--------|---------|-------|
| ISO | 2026-02-01 to 2026-02-07 | API, database |
| Display | Feb 1 - Feb 7, 2026 | User interface |
| Short | 02/01 - 02/07 | Mobile view |
| Sinhala | පෙබරවාරි 1 - 7, 2026 | Localized UI |

### Period Preset Methods

```python
# Usage examples (conceptual)

CODReport.for_current_week(tenant)
# Returns: start_date=Monday, end_date=Sunday

CODReport.for_previous_week(tenant)
# Returns: Previous Monday to Sunday

CODReport.for_month(tenant, year=2026, month=2)
# Returns: Feb 1 to Feb 28/29

CODReport.for_date_range(tenant, "2026-02-01", "2026-02-07")
# Returns: Custom date range
```

### Expected Outcome
- start_date and end_date fields added
- Date range validation prevents invalid periods
- Overlap detection prevents duplicate reports
- Weekly period helpers align with settlement cycles
- Display methods support multiple formats
- Preset methods simplify report creation

### Verification Checklist
- [ ] start_date and end_date DateFields added
- [ ] Both fields marked as required
- [ ] Validation ensures end_date >= start_date
- [ ] Maximum range limit (31 days) enforced
- [ ] Overlap detection prevents duplicate periods
- [ ] get_date_range_days calculates period length
- [ ] get_period_display formats dates for UI
- [ ] for_current_week and for_previous_week methods work
- [ ] Composite index created for date range queries
- [ ] Future dates rejected with clear error

---

## Task 76: Create Total Collected

### Overview
Implement the total_collected field to store the total COD amount collected by Koombiyo during the report period. This field uses DecimalField for precise currency calculations, handles LKR amounts, tracks collection fees, and supports reconciliation against expected order amounts.

### Dependencies
- Task 74: Create CODReport Model

### Instructions

1. **Add total_collected field**
   - Navigate to CODReport model in `cod_report.py`
   - Add DecimalField named `total_collected`
   - Set max_digits=12 for large amounts
   - Set decimal_places=2 for currency precision

2. **Configure field properties**
   - Set null=False, blank=False (required)
   - Add default value of Decimal('0.00')
   - Set verbose_name to "Total Collected (LKR)"
   - Include help_text with currency info

3. **Add related amount fields**
   - Create collection_fee field (DecimalField)
   - Add service_charges field for deductions
   - Create net_settlement_amount field
   - Store expected_amount for comparison

4. **Implement amount validation**
   - Create validator for positive amounts
   - Check total_collected >= 0
   - Validate decimal precision (2 places)
   - Ensure amounts don't exceed reasonable limits

5. **Add currency helper methods**
   - Create get_formatted_amount method
   - Return formatted LKR string: "Rs. 12,345.67"
   - Support Sinhala number format option
   - Add get_amount_in_words method

6. **Implement fee calculation methods**
   - Create calculate_collection_fee method
   - Typically 2-3% of collected amount
   - Add calculate_net_settlement method
   - Subtract fees from total_collected

7. **Add discrepancy tracking**
   - Create compare_with_expected method
   - Calculate difference from order amounts
   - Store in discrepancy_amount field
   - Flag reports with mismatches

8. **Implement aggregation methods**
   - Add class method sum_by_period
   - Create sum_by_status aggregation
   - Support tenant-level totals
   - Add date range filtering

9. **Add amount breakdown fields**
   - Create delivered_orders_count IntegerField
   - Add average_cod_amount calculated property
   - Store largest_collection_amount
   - Track smallest_collection_amount

10. **Implement reconciliation helpers**
    - Create get_unreconciled_amount method
    - Add get_pending_settlement_amount
    - Track partially_settled status
    - Support installment settlements

### Total Collected Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| field_type | DecimalField | Precise currency |
| max_digits | 12 | Up to LKR 9.9 billion |
| decimal_places | 2 | Standard currency precision |
| default | 0.00 | Safe initial value |
| validators | [positive_validator] | No negative amounts |

### COD Amount Breakdown

```
Total Collected (From Koombiyo)
    │
    ├─── Gross COD Amount: LKR 50,000.00
    │
    ├─── Deductions:
    │    ├── Collection Fee (2%): LKR 1,000.00
    │    ├── Service Charges: LKR 500.00
    │    └── Other Fees: LKR 100.00
    │
    └─── Net Settlement: LKR 48,400.00
         (Amount to merchant's bank)
```

### LKR Currency Formatting

| Format | Example | Usage |
|--------|---------|-------|
| Standard | Rs. 12,345.67 | General display |
| With Symbol | ₨ 12,345.67 | Alternative |
| Words | Twelve thousand three hundred forty-five rupees | Invoices |
| Sinhala | රු. 12,345.67 | Localized UI |
| Lakhs | Rs. 1.23 lakhs | Large amounts |

### Collection Fee Structure

| Amount Range | Fee Percentage | Minimum Fee |
|--------------|---------------|-------------|
| LKR 0 - 5,000 | 3% | LKR 50 |
| LKR 5,001 - 20,000 | 2.5% | LKR 150 |
| LKR 20,001 - 50,000 | 2% | LKR 500 |
| LKR 50,001+ | 1.5% | LKR 1,000 |

### Amount Calculation Flow

```
1. Receive from Koombiyo
    │
    ├── total_collected = 50,000.00
    │
    ▼
2. Calculate Fees
    │
    ├── collection_fee = 50,000 × 2% = 1,000.00
    ├── service_charges = 500.00
    │
    ▼
3. Calculate Net Settlement
    │
    └── net_settlement = 50,000 - 1,000 - 500 = 48,500.00
    
    ▼
4. Compare with Expected
    │
    ├── expected_amount (from orders) = 49,500.00
    ├── discrepancy = 50,000 - 49,500 = 500.00
    │
    └── Flag for review
```

### Discrepancy Thresholds

| Discrepancy | Threshold | Action |
|-------------|-----------|--------|
| None | 0.00 | Auto-reconcile |
| Minor | < LKR 100 | Auto-approve with note |
| Moderate | LKR 100 - 1,000 | Flag for review |
| Major | > LKR 1,000 | Require manual investigation |

### Amount Aggregation Examples

```
Monthly Total
├── Week 1: LKR 125,000.00
├── Week 2: LKR 148,000.00
├── Week 3: LKR 132,000.00
└── Week 4: LKR 155,000.00
    └── Total: LKR 560,000.00

By Status
├── VERIFIED: LKR 250,000.00
├── RECONCILED: LKR 180,000.00
└── SETTLED: LKR 130,000.00
```

### Expected Outcome
- total_collected field stores COD amounts precisely
- Collection fees calculated automatically
- Net settlement amount computed correctly
- Discrepancies tracked and flagged
- LKR formatting displays amounts properly
- Aggregation methods support reporting

### Verification Checklist
- [ ] total_collected DecimalField added (12, 2)
- [ ] Field marked as required with default 0.00
- [ ] Positive amount validation implemented
- [ ] collection_fee field added for deductions
- [ ] net_settlement_amount field calculates correctly
- [ ] get_formatted_amount returns "Rs. X,XXX.XX"
- [ ] calculate_collection_fee method works
- [ ] Discrepancy detection compares with expected
- [ ] Aggregation methods sum_by_period works
- [ ] Amount in words method implemented

---

## Task 77: Create get_cod_report API

### Overview
Implement the integration with Koombiyo's COD reporting API endpoint to fetch collection reports. This service method retrieves COD data for specified date ranges, handles authentication, parses the response into CODReport instances, and links collected amounts to specific shipments for reconciliation.

### Dependencies
- Task 74: Create CODReport Model
- Task 75: Create Report Date Range
- Task 76: Create Total Collected

### Instructions

1. **Create COD service class**
   - Navigate to `backend/apps/shipping/services/` directory
   - Create file named `cod_service.py` if not exists
   - Define CODService class
   - Initialize with tenant context

2. **Add API configuration**
   - Import Koombiyo base configuration from settings
   - Define COD report endpoint URL
   - Set up authentication headers
   - Configure timeout and retry settings

3. **Implement get_cod_report method**
   - Create method accepting start_date and end_date
   - Validate date range before API call
   - Build request payload with dates
   - Include merchant/tenant authentication

4. **Format report request payload**
   - Convert dates to ISO format (YYYY-MM-DD)
   - Include merchant_id from tenant settings
   - Add report_type parameter (if applicable)
   - Include pagination parameters if needed

5. **Handle API request execution**
   - Use requests library or HTTP client
   - Set proper headers (Content-Type, Authorization)
   - Send GET request to report endpoint
   - Handle connection errors and timeouts
   - Log request details for debugging

6. **Parse COD report response**
   - Extract report metadata (report_id, dates)
   - Parse total_collected amount
   - Extract list of COD shipments
   - Parse collection details per shipment
   - Handle multiple pages if paginated

7. **Create CODReport instance**
   - Check if report already exists for period
   - Create new CODReport with parsed data
   - Set status to PENDING initially
   - Store koombiyo_report_id
   - Save report record

8. **Link shipments to report**
   - Parse waybill numbers from response
   - Query Shipment records by waybills
   - Add shipments to report via ManyToMany
   - Store individual COD amounts on shipments
   - Flag missing waybills

9. **Add error handling**
   - Catch network errors (ConnectionError, Timeout)
   - Handle HTTP errors (400, 401, 500)
   - Parse Koombiyo error responses
   - Create meaningful error messages
   - Log errors with context

10. **Implement retry logic**
    - Add retry decorator with exponential backoff
    - Configure maximum retry attempts (3)
    - Only retry on transient errors (5xx, timeouts)
    - Don't retry on client errors (4xx)
    - Log each retry attempt

11. **Add response caching**
    - Cache reports to avoid duplicate API calls
    - Use Redis with TTL of 1 hour
    - Key format: "cod_report:{tenant}:{start}:{end}"
    - Invalidate on reconciliation
    - Support force refresh parameter

12. **Create report synchronization**
    - Add sync_cod_reports method for bulk fetch
    - Fetch all pending reports for tenant
    - Schedule periodic sync via Celery
    - Handle incremental updates
    - Support backfill for historical data

### Koombiyo COD Report API Specification

| Parameter | Required | Format | Example |
|-----------|----------|--------|---------|
| merchant_id | Yes | String | "MERCHANT123" |
| start_date | Yes | YYYY-MM-DD | "2026-02-01" |
| end_date | Yes | YYYY-MM-DD | "2026-02-07" |
| report_type | No | cod_collection | "cod_collection" |
| page | No | Integer | 1 |
| page_size | No | Integer | 100 |

### Request Payload Structure

```json
GET /api/v1/reports/cod?
    merchant_id=MERCHANT123&
    start_date=2026-02-01&
    end_date=2026-02-07&
    page=1&
    page_size=100

Headers:
{
  "Authorization": "Bearer {api_token}",
  "Content-Type": "application/json"
}
```

### Response Structure

```json
Success (200):
{
  "status": "success",
  "report_id": "CODR20260201001",
  "period": {
    "start_date": "2026-02-01",
    "end_date": "2026-02-07"
  },
  "summary": {
    "total_collected": 125000.00,
    "collection_fee": 2500.00,
    "net_settlement": 122500.00,
    "delivered_count": 45
  },
  "collections": [
    {
      "waybill": "KMB001",
      "delivery_date": "2026-02-02",
      "cod_amount": 2500.00,
      "collection_status": "collected",
      "customer_phone": "+94771234567"
    },
    {
      "waybill": "KMB002",
      "delivery_date": "2026-02-03",
      "cod_amount": 3200.00,
      "collection_status": "collected",
      "customer_phone": "+94777654321"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 100,
    "total_records": 45,
    "total_pages": 1
  }
}

Error (400):
{
  "status": "error",
  "error_code": "INVALID_DATE_RANGE",
  "message": "Date range cannot exceed 31 days",
  "details": {}
}
```

### COD Report Fetching Flow

```
1. Validate Date Range
    │
    ├─── Valid ───> 2. Check Cache
    │                    │
    │                    ├─── Found ──> Return cached
    │                    │
    │                    └─── Not Found ──> 3. Call Koombiyo API
    │                                            │
    │                                            ├─── Success ──> 4. Parse Response
    │                                            │                    │
    │                                            │                    ▼
    │                                            │               5. Create CODReport
    │                                            │                    │
    │                                            │                    ▼
    │                                            │               6. Link Shipments
    │                                            │                    │
    │                                            │                    ▼
    │                                            │               7. Cache Report
    │                                            │                    │
    │                                            │                    ▼
    │                                            │               8. Return Report
    │                                            │
    │                                            └─── Error ───> Handle & Retry
    │
    └─── Invalid ──> Return Error
```

### Error Handling Strategy

| Error Type | HTTP Code | Action |
|------------|-----------|--------|
| Invalid Date Range | 400 | Validate dates before call |
| Unauthorized | 401 | Refresh authentication token |
| Report Not Ready | 404 | Retry after delay |
| Rate Limited | 429 | Exponential backoff |
| Server Error | 500 | Retry with backoff |
| Network Error | - | Retry with backoff |

### Shipment Linking Logic

```
For each collection in response:
    │
    ├── Extract waybill number
    │
    ├── Query Shipment by waybill
    │       │
    │       ├─── Found ──> Link to report
    │       │              Update shipment.cod_collected
    │       │              Set shipment.cod_status = "collected"
    │       │
    │       └─── Not Found ──> Log missing waybill
    │                          Flag for investigation
    │
    └── Calculate expected vs collected
```

### Expected Outcome
- CODService class created with get_cod_report method
- API integration with Koombiyo COD endpoint
- CODReport instances created from API data
- Shipments linked to reports via waybills
- Error handling for all failure scenarios
- Retry logic for transient failures
- Response caching to reduce API calls

### Verification Checklist
- [ ] CODService class created in `cod_service.py`
- [ ] get_cod_report method implemented
- [ ] API endpoint URL configured correctly
- [ ] Request includes start_date and end_date
- [ ] Authentication headers set properly
- [ ] CODReport instance created with parsed data
- [ ] total_collected extracted and stored
- [ ] Shipments linked via waybill matching
- [ ] Error handling covers all scenarios
- [ ] Retry logic with exponential backoff
- [ ] Response caching implemented

---

## Task 78: Create COD Reconciliation

### Overview
Implement the COD reconciliation system to match collected amounts from Koombiyo reports with expected order amounts in the system. This complex process validates collection data, identifies discrepancies, flags mismatches for review, and provides audit trails for financial accuracy in Sri Lankan e-commerce operations.

### Dependencies
- Task 77: Create get_cod_report API

### Instructions

1. **Create reconciliation service**
   - Add CODReconciliationService class to `cod_service.py`
   - Initialize with tenant and report context
   - Support both automatic and manual reconciliation
   - Track reconciliation history

2. **Implement reconcile_report method**
   - Accept CODReport instance
   - Retrieve all linked shipments
   - Compare collected vs expected amounts
   - Calculate total discrepancy
   - Update report status

3. **Validate shipment amounts**
   - For each shipment in report
   - Get original order COD amount
   - Compare with collected amount
   - Flag differences above threshold
   - Store discrepancy details

4. **Calculate expected total**
   - Sum all order COD amounts
   - Include delivery fees if COD
   - Subtract returns/cancellations
   - Account for partial payments
   - Store as expected_amount

5. **Identify discrepancy types**
   - Overcharge: Collected > Expected
   - Undercharge: Collected < Expected
   - Missing collection: In report but not collected
   - Extra collection: Collected but not in system
   - Categorize each discrepancy

6. **Implement matching logic**
   - Match by waybill number (primary)
   - Fallback to customer phone + amount
   - Fuzzy matching for typos
   - Flag unmatched collections
   - Store confidence score

7. **Add threshold-based flagging**
   - Define acceptable discrepancy threshold (e.g., LKR 50)
   - Auto-approve within threshold
   - Flag moderate discrepancies for review
   - Require manual approval for major issues
   - Escalate high-value discrepancies

8. **Create discrepancy records**
   - Design CODDiscrepancy model
   - Store discrepancy_type, amount, reason
   - Link to shipment and report
   - Track resolution status
   - Add resolution notes field

9. **Implement resolution workflow**
   - Create resolve_discrepancy method
   - Accept discrepancy ID and resolution type
   - Options: ACCEPTED, MERCHANT_ERROR, COURIER_ERROR
   - Adjust amounts if needed
   - Update reconciliation status

10. **Add bulk reconciliation**
    - Create reconcile_multiple_reports method
    - Process reports in date order
    - Handle dependencies between reports
    - Generate summary statistics
    - Support background processing via Celery

11. **Implement audit logging**
    - Log all reconciliation actions
    - Record user who performed action
    - Store before/after values
    - Track status changes
    - Support audit report generation

12. **Create reconciliation dashboard data**
    - Generate reconciliation summary
    - Calculate reconciliation rate
    - Show pending items count
    - Display total discrepancy amount
    - Support filtering by date, status

### Reconciliation Flow

```
COD Reconciliation Process
    │
    ├── 1. Retrieve COD Report
    │       └── Get linked shipments
    │
    ├── 2. Calculate Expected Total
    │       ├── Sum order COD amounts
    │       └── Account for adjustments
    │
    ├── 3. Match Shipments
    │       ├── By waybill (primary)
    │       └── Fuzzy matching
    │
    ├── 4. Compare Amounts
    │       ├── Per shipment
    │       └── Report total
    │
    ├── 5. Identify Discrepancies
    │       ├── Overcharges
    │       ├── Undercharges
    │       ├── Missing
    │       └── Extra
    │
    ├── 6. Apply Thresholds
    │       ├── Auto-approve minor
    │       └── Flag major
    │
    ├── 7. Update Status
    │       ├── RECONCILED (match)
    │       └── DISPUTED (mismatch)
    │
    └── 8. Generate Report
            └── Summary statistics
```

### Discrepancy Types

| Type | Condition | Example | Action |
|------|-----------|---------|--------|
| OVERCHARGE | Collected > Expected | Expected: 2,500, Collected: 2,700 | Flag for review |
| UNDERCHARGE | Collected < Expected | Expected: 2,500, Collected: 2,300 | Investigate reason |
| MISSING | Expected but not collected | Order exists, no collection | Contact courier |
| EXTRA | Collected but no order | Collection for unknown waybill | Verify waybill |
| MATCH | Amounts equal | Expected: 2,500, Collected: 2,500 | Auto-approve |

### Threshold Configuration

| Discrepancy | Threshold | Auto-Action | Manual Action Required |
|-------------|-----------|-------------|------------------------|
| Perfect Match | LKR 0 | Approve | None |
| Minor | < LKR 50 | Approve with note | Optional review |
| Moderate | LKR 50 - 500 | Flag | Review & approve |
| Major | LKR 500 - 5,000 | Hold | Investigation required |
| Critical | > LKR 5,000 | Escalate | Manager approval |

### Matching Strategy

```
Primary Matching (Waybill)
    │
    ├── Exact Match ──────> Confidence: 100%
    │
    ├── Case Insensitive ──> Confidence: 95%
    │
    └── Not Found ────────> Fallback Matching
                                │
                                ├── Phone + Amount ──> 85%
                                │
                                ├── Phone + Date ────> 75%
                                │
                                └── Manual Review ───> 0%
```

### CODDiscrepancy Model Structure

```
CODDiscrepancy
├── id (PK)
├── cod_report (FK)
├── shipment (FK, nullable)
├── discrepancy_type (choices)
├── expected_amount (Decimal)
├── collected_amount (Decimal)
├── difference (Decimal)
├── status (PENDING/RESOLVED/ACCEPTED)
├── resolution_type (choice)
├── resolution_notes (Text)
├── resolved_by (FK User)
├── resolved_at (DateTime)
└── created_at (DateTime)
```

### Reconciliation Status Transitions

```
PENDING (Initial)
    │
    ├──> VERIFIED ────────> RECONCILED
    │         │                  │
    │         │                  └──> SETTLED
    │         │
    │         └──> DISPUTED
    │                  │
    │                  ├──> RESOLVED ──> RECONCILED
    │                  │
    │                  └──> REJECTED
    │
    └──> CANCELLED
```

### Example Reconciliation Scenarios

**Scenario 1: Perfect Match**
```
Report: LKR 125,000 (50 shipments)
Expected: LKR 125,000 (50 orders)
Discrepancy: LKR 0
Action: Auto-approve, set status to RECONCILED
```

**Scenario 2: Minor Discrepancy**
```
Report: LKR 125,030 (50 shipments)
Expected: LKR 125,000 (50 orders)
Discrepancy: LKR +30 (0.024%)
Action: Auto-approve with note, set RECONCILED
```

**Scenario 3: Major Discrepancy**
```
Report: LKR 122,000 (50 shipments)
Expected: LKR 125,000 (50 orders)
Discrepancy: LKR -3,000 (2.4%)
Action: Create discrepancy record, set DISPUTED
Investigation: Found 2 returns not reported
Resolution: Adjust expected, set RECONCILED
```

### Expected Outcome
- COD reconciliation system implemented
- Automatic matching of collected vs expected amounts
- Discrepancy detection and categorization
- Threshold-based auto-approval
- Manual review workflow for major issues
- Audit trail for all reconciliation actions

### Verification Checklist
- [ ] CODReconciliationService class created
- [ ] reconcile_report method implemented
- [ ] Expected total calculated from order amounts
- [ ] Shipment matching by waybill works
- [ ] Discrepancy calculation accurate
- [ ] Threshold-based flagging implemented
- [ ] CODDiscrepancy model created
- [ ] Auto-approval for minor differences
- [ ] Manual review workflow for major discrepancies
- [ ] Reconciliation status updates correctly
- [ ] Audit logging captures all actions

---

## Task 79: Create COD Settlement

### Overview
Implement the COD settlement tracking system to monitor when collected amounts are transferred from Koombiyo to merchant bank accounts. This system tracks settlement cycles, records bank transfer details, matches settlements with reports, handles partial settlements, and provides financial reconciliation for Sri Lankan e-commerce businesses.

### Dependencies
- Task 78: Create COD Reconciliation

### Instructions

1. **Add settlement tracking fields**
   - Navigate to CODReport model
   - Verify settlement_date field exists
   - Add settlement_reference CharField
   - Create settlement_amount DecimalField
   - Add settlement_status CharField with choices

2. **Define settlement status choices**
   - Create SettlementStatus choices class
   - Options: PENDING, PROCESSING, COMPLETED, PARTIAL, FAILED
   - Default to PENDING for new reports
   - Track status transitions
   - Add status_changed_at timestamp

3. **Create settlement service**
   - Add CODSettlementService class to `cod_service.py`
   - Initialize with tenant context
   - Support settlement creation and tracking
   - Handle bank integration if available

4. **Implement record_settlement method**
   - Accept CODReport instance
   - Accept settlement details (date, amount, reference)
   - Validate settlement amount against report total
   - Update report with settlement info
   - Change status to appropriate value

5. **Add settlement validation**
   - Check report is reconciled before settlement
   - Validate settlement_amount <= net_settlement_amount
   - Ensure settlement_date is valid
   - Verify bank reference format
   - Prevent duplicate settlements

6. **Handle partial settlements**
   - Support multiple settlements for one report
   - Track remaining_settlement_amount
   - Create CODSettlement model for multiple entries
   - Link settlements to CODReport
   - Auto-complete when fully settled

7. **Implement settlement cycle tracking**
   - Define settlement schedules (weekly on Thursdays)
   - Create get_expected_settlement_date method
   - Calculate based on report end_date + cycle days
   - Account for holidays and weekends
   - Alert on delayed settlements

8. **Add bank transfer details**
   - Store bank_name CharField
   - Add bank_account_number (encrypted)
   - Create transfer_reference_number
   - Store transfer_date and amount
   - Link to tenant's bank account

9. **Create settlement notifications**
   - Send notification on settlement receipt
   - Include amount, date, reference number
   - Attach settlement receipt PDF
   - Send to finance team email
   - Support SMS notification for large amounts

10. **Implement settlement reconciliation**
    - Compare settlement_amount with expected
    - Calculate settlement_discrepancy
    - Flag discrepancies for review
    - Track deductions (fees, charges)
    - Store net amount received

11. **Add overdue settlement detection**
    - Create is_settlement_overdue method
    - Check if past expected_settlement_date
    - Define grace period (2 business days)
    - Generate overdue alerts
    - Escalate after extended delays

12. **Create settlement reporting**
    - Generate monthly settlement summary
    - Calculate total settlements received
    - Track average settlement time
    - Show pending settlements
    - Export for accounting software

### Settlement Cycle (Sri Lankan Context)

```
Weekly Settlement Cycle

Collections Period: Monday - Sunday
Report Generated: Following Monday
Reconciliation: Monday - Tuesday
Settlement Expected: Thursday (same week)
Grace Period: +2 business days

Example Timeline:
├── Feb 3-9: Collections
├── Feb 10: Report generated
├── Feb 10-11: Reconciliation
├── Feb 13: Settlement expected
└── Feb 15: Grace period ends
```

### Settlement Status Lifecycle

```
PENDING (Report reconciled)
    │
    ├──> PROCESSING (Transfer initiated)
    │        │
    │        ├──> COMPLETED (Full amount received)
    │        │
    │        ├──> PARTIAL (Partial amount received)
    │        │        │
    │        │        └──> COMPLETED (Remaining received)
    │        │
    │        └──> FAILED (Transfer failed)
    │                 │
    │                 └──> PROCESSING (Retry)
    │
    └──> CANCELLED (Report disputed)
```

### Settlement Model Structure

```
CODSettlement (Optional separate model)
├── id (PK)
├── cod_report (FK)
├── settlement_date (Date)
├── settlement_amount (Decimal)
├── settlement_reference (CharField)
├── bank_name (CharField)
├── transfer_reference (CharField)
├── settlement_type (FULL/PARTIAL)
├── notes (Text)
├── created_by (FK User)
└── created_at (DateTime)
```

### Settlement Amount Calculation

```
Net Settlement Calculation

Gross COD Collected: LKR 125,000.00
    │
    ├── Deductions:
    │    ├── Collection Fee (2%): LKR 2,500.00
    │    ├── Service Charges: LKR 500.00
    │    ├── Return Shipping: LKR 200.00
    │    └── Other Fees: LKR 50.00
    │
    └── Net Settlement: LKR 121,750.00
         └── Transferred to merchant bank
```

### Settlement Discrepancy Handling

| Discrepancy Type | Example | Action |
|------------------|---------|--------|
| Short Settlement | Expected: 121,750, Received: 121,500 | Flag, investigate fees |
| Over Settlement | Expected: 121,750, Received: 122,000 | Verify, adjust next cycle |
| Missing Settlement | Expected date passed | Send reminder, escalate |
| Duplicate Settlement | Same reference twice | Flag, prevent duplicate credit |

### Expected Settlement Date Calculation

```python
# Conceptual logic

def get_expected_settlement_date(report):
    # Weekly cycle: Settlement on Thursday
    report_end = report.end_date  # Sunday
    next_monday = report_end + timedelta(days=1)
    expected_thursday = next_monday + timedelta(days=3)
    
    # Adjust for holidays
    while is_holiday(expected_thursday):
        expected_thursday += timedelta(days=1)
    
    return expected_thursday
```

### Settlement Notification Content

```
Email Subject: COD Settlement Received - LKR 121,750.00

Dear Merchant,

Your COD settlement has been processed:

Report Period: Feb 3 - Feb 9, 2026
Settlement Date: February 13, 2026
Settlement Amount: LKR 121,750.00
Bank Reference: TRF20260213001
Bank Account: ****1234 (Commercial Bank)

Breakdown:
- Total Collected: LKR 125,000.00
- Collection Fee: LKR 2,500.00
- Service Charges: LKR 500.00
- Other Deductions: LKR 250.00
- Net Settlement: LKR 121,750.00

[Download Settlement Report PDF]

If you have questions, contact finance@koombiyo.lk
```

### Overdue Settlement Alert

```
Settlement Overdue Alert

Report: CODR001-20260203
Period: Feb 3-9, 2026
Expected Date: Feb 13, 2026
Current Date: Feb 18, 2026
Days Overdue: 3 business days
Amount: LKR 121,750.00

Action Required:
- Contact Koombiyo finance team
- Reference: CODR001-20260203
- Phone: +94 11 123 4567
```

### Expected Outcome
- Settlement tracking system implemented
- Settlement dates and amounts recorded
- Bank transfer details stored securely
- Partial settlement support working
- Overdue settlement detection active
- Notifications sent on settlement receipt
- Settlement reconciliation validates amounts

### Verification Checklist
- [ ] settlement_date, settlement_amount, settlement_reference fields added
- [ ] Settlement status choices defined
- [ ] CODSettlementService class created
- [ ] record_settlement method implemented
- [ ] Partial settlement support working
- [ ] get_expected_settlement_date calculates correctly
- [ ] Settlement notifications sent on receipt
- [ ] is_settlement_overdue method detects delays
- [ ] Settlement discrepancy tracking functional
- [ ] Bank transfer details stored securely
- [ ] Monthly settlement reports generated

---

## Task 80: Verify Pickup & COD

### Overview
Implement comprehensive verification and testing for the pickup scheduling and COD collection features. This task ensures all components work together correctly, validates integration with Koombiyo APIs, tests error handling, verifies data consistency, and confirms the complete workflow from pickup request through COD settlement.

### Dependencies
- Task 73: Create Bulk Pickup
- Task 79: Create COD Settlement

### Instructions

1. **Create verification test suite**
   - Navigate to `backend/apps/shipping/tests/` directory
   - Create `test_pickup_cod.py` file
   - Set up test fixtures for tenants, shipments
   - Configure mock Koombiyo API responses
   - Prepare test data for various scenarios

2. **Test pickup model creation**
   - Create test for Pickup model instantiation
   - Verify all required fields
   - Test default values (status, etc.)
   - Validate relationships (tenant, waybills)
   - Check string representation

3. **Test pickup validation**
   - Test past date rejection
   - Verify cutoff time logic (2:00 PM)
   - Test weekend date rejection
   - Verify holiday date validation
   - Test time slot validation for same-day

4. **Test pickup status transitions**
   - Create pickup in PENDING status
   - Transition to SCHEDULED
   - Move to COMPLETED
   - Test CANCELLED from various states
   - Verify invalid transitions raise errors

5. **Test schedule_pickup API integration**
   - Mock Koombiyo API response (success)
   - Call schedule_pickup with valid data
   - Verify API payload format
   - Check pickup_id stored correctly
   - Confirm status changed to SCHEDULED

6. **Test bulk pickup functionality**
   - Create 10 test waybills
   - Schedule bulk pickup
   - Verify all waybills linked
   - Test split for > 50 waybills
   - Confirm multiple pickups created

7. **Test CODReport model creation**
   - Create CODReport instance
   - Verify date range fields
   - Test total_collected storage
   - Validate currency precision
   - Check report reference generation

8. **Test get_cod_report API integration**
   - Mock Koombiyo COD report response
   - Call get_cod_report with date range
   - Verify report parsing
   - Check shipment linking
   - Confirm amounts stored correctly

9. **Test COD reconciliation**
   - Create report with known amounts
   - Set up matching orders
   - Run reconciliation
   - Verify discrepancy detection
   - Test auto-approval thresholds

10. **Test settlement tracking**
    - Create reconciled report
    - Record settlement with details
    - Verify settlement_date stored
    - Check settlement_amount correct
    - Test partial settlement flow

11. **Test error handling**
    - Mock API failures (timeouts, 5xx)
    - Verify retry logic works
    - Test graceful degradation
    - Check error messages clear
    - Verify logging captures errors

12. **Perform end-to-end verification**
    - Create real pickup request
    - Schedule with mock API
    - Fetch COD report
    - Run reconciliation
    - Record settlement
    - Verify complete workflow

13. **Test edge cases**
    - Zero waybills in pickup
    - Negative COD amounts
    - Duplicate settlements
    - Missing shipments in report
    - Overlapping report periods

14. **Verify data consistency**
    - Check database constraints
    - Verify foreign key relationships
    - Test cascade deletes
    - Confirm transaction rollbacks
    - Validate data integrity

15. **Test notification system**
    - Mock email sending
    - Verify pickup confirmation sent
    - Check settlement notification
    - Test overdue alerts
    - Confirm notification content

16. **Performance testing**
    - Test bulk operations (100+ waybills)
    - Measure API response times
    - Check database query efficiency
    - Verify caching effectiveness
    - Test concurrent reconciliation

### Verification Test Scenarios

#### Scenario 1: Happy Path - Complete Workflow
```
1. Create 5 shipments with COD
2. Schedule bulk pickup for tomorrow morning
   └── Verify: Status = SCHEDULED, pickup_id stored
3. Fetch COD report after delivery
   └── Verify: Report created, amounts match
4. Run reconciliation
   └── Verify: Status = RECONCILED, no discrepancies
5. Record settlement
   └── Verify: Status = SETTLED, dates recorded
```

#### Scenario 2: Pickup Date Validation
```
1. Try to schedule pickup for yesterday
   └── Expected: ValidationError "past date"
2. Schedule for today at 3:00 PM (past cutoff)
   └── Expected: Error "cutoff passed"
3. Schedule for Saturday
   └── Expected: Error "weekend not allowed"
4. Schedule for tomorrow (business day)
   └── Expected: Success
```

#### Scenario 3: COD Reconciliation with Discrepancies
```
1. Create report with collected = LKR 125,000
2. Orders total expected = LKR 124,500
3. Run reconciliation
   └── Verify: Discrepancy = +500 (overcharge)
   └── Verify: Status = DISPUTED
   └── Verify: CODDiscrepancy record created
4. Resolve discrepancy (accept)
   └── Verify: Status = RECONCILED
```

#### Scenario 4: Bulk Pickup Splitting
```
1. Create 75 waybills
2. Schedule bulk pickup
   └── Verify: 2 Pickup records created
   └── Pickup 1: 50 waybills
   └── Pickup 2: 25 waybills
   └── Both same date/time_slot
```

#### Scenario 5: Partial Settlement
```
1. Report: LKR 100,000 net settlement
2. Record first settlement: LKR 60,000
   └── Verify: Status = PARTIAL
   └── Verify: Remaining = 40,000
3. Record second settlement: LKR 40,000
   └── Verify: Status = COMPLETED
   └── Verify: Total = 100,000
```

### Test Coverage Requirements

| Component | Coverage Target | Critical Paths |
|-----------|----------------|----------------|
| Pickup Model | 100% | Status transitions, validation |
| PickupService | 90% | API calls, error handling |
| CODReport Model | 100% | Amount calculations |
| CODService | 90% | API integration, parsing |
| Reconciliation | 95% | Matching logic, thresholds |
| Settlement | 95% | Amount tracking, status updates |

### Manual Verification Checklist

- [ ] Create pickup via admin interface
- [ ] Schedule pickup with test API credentials
- [ ] Verify pickup confirmation email received
- [ ] Check pickup appears in merchant dashboard
- [ ] Cancel a scheduled pickup
- [ ] Fetch real COD report from Koombiyo
- [ ] Verify report data displays correctly
- [ ] Run reconciliation on report
- [ ] Review discrepancy flagging
- [ ] Record settlement manually
- [ ] Verify settlement notification sent
- [ ] Check overdue alert triggers correctly

### Integration Points to Verify

```
Pickup & COD Flow Integration

1. Shipment Creation
    └── COD amount set

2. Pickup Scheduling
    └── Links shipments

3. Courier Collection
    └── (Koombiyo process)

4. COD Report Fetch
    └── API retrieves data

5. Reconciliation
    └── Matches amounts

6. Settlement
    └── Tracks payment

7. Financial Reports
    └── Accounting integration
```

### Expected Outcome
- All test cases pass successfully
- End-to-end workflow verified
- API integrations working correctly
- Error handling robust
- Data consistency maintained
- Notifications sent appropriately
- Performance acceptable

### Verification Checklist
- [ ] Pickup model tests pass
- [ ] Pickup validation tests pass
- [ ] Status transition tests pass
- [ ] schedule_pickup API test passes
- [ ] Bulk pickup tests pass
- [ ] CODReport model tests pass
- [ ] get_cod_report API test passes
- [ ] Reconciliation tests pass
- [ ] Settlement tracking tests pass
- [ ] Error handling tests pass
- [ ] End-to-end workflow verified
- [ ] Edge case tests pass
- [ ] Performance tests acceptable
- [ ] Manual verification completed

---
