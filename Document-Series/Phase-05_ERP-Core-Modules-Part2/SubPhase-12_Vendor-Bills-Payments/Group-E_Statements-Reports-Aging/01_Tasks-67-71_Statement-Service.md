# Tasks 67-71: Vendor Statement Service Implementation

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Ready for Implementation

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous:** [Group-D_Payment-Processing\02_Tasks-61-66_Payment-Validation.md](../Group-D_Payment-Processing/02_Tasks-61-66_Payment-Validation.md)
- **Next:** [02_Tasks-72-76_Aging-Reports.md](02_Tasks-72-76_Aging-Reports.md)

---

## Document Overview

This document covers the implementation of the **Vendor Statement Service**, which provides comprehensive vendor account statements including transaction history, balances, and payment status. The service supports multiple output formats (PDF, HTML, Excel), automated email delivery, and asynchronous processing for large datasets.

### Tasks Covered

| Task | Component | Priority | Complexity |
|------|-----------|----------|------------|
| 67 | VendorStatementService Core | High | High |
| 68 | Statement Data Aggregation Engine | High | High |
| 69 | PDF Generation with ReportLab/WeasyPrint | High | Medium |
| 70 | Email Template HTML System | Medium | Medium |
| 71 | Celery Task for Async Email Sending | High | Medium |

### Prerequisites

- Vendor Bills models and services (Tasks 45-50)
- Payment models and services (Tasks 56-60)
- Celery task queue configured
- Email backend configured
- ReportLab or WeasyPrint installed

---

## Task 67: VendorStatementService Core

### Overview

Implement the core service class that orchestrates vendor statement generation, managing data collection, formatting, rendering, and delivery. This service acts as the central coordinator for all statement-related operations.

**Objectives:**
- Create VendorStatementService with flexible filtering options
- Support multiple statement periods (monthly, quarterly, custom)
- Implement statement versioning and history
- Handle multi-currency statements
- Support different statement formats (summary, detailed, transaction-level)

**Business Value:**
- Provides vendors with transparent account status
- Reduces payment disputes through clear documentation
- Automates vendor communication processes
- Supports compliance and audit requirements

### Dependencies

**Internal:**
- VendorBill model
- VendorPayment model
- Vendor model
- Base service classes

**External:**
- Django ORM for data queries
- Python datetime for period calculations
- decimal for precise financial calculations

**Integration Points:**
- Payment processing system
- Bill management system
- Email notification system
- Document storage system

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│             VendorStatementService Architecture             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Service Layer
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Statement   │    │   Period     │    │   Format     │
│  Generator   │    │  Calculator  │    │  Selector    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  Data Layer  │    │ Output Layer │
            │  Aggregator  │    │  Renderer    │
            └──────────────┘    └──────────────┘
```

### Statement Flow Diagram

```
┌──────────────┐
│   Request    │
│  Statement   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Validate Parameters         │
│  - Vendor exists             │
│  - Date range valid          │
│  - Format supported          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Calculate Period            │
│  - Start date                │
│  - End date                  │
│  - Opening balance           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Aggregate Data              │
│  - Bills                     │
│  - Payments                  │
│  - Adjustments               │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Calculate Balances          │
│  - Opening balance           │
│  - Period transactions       │
│  - Closing balance           │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Format Statement            │
│  - Apply template            │
│  - Currency formatting       │
│  - Localization              │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Render Output               │
│  - PDF / HTML / Excel        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Store & Deliver             │
│  - Save to storage           │
│  - Email to vendor           │
│  - Log generation            │
└──────────────────────────────┘
```

### Instructions

#### Step 1: Create Service Class Structure

Create the base service class with initialization and configuration:

**File Structure:**
- `apps/vendor_management/services/statement_service.py`
- `apps/vendor_management/services/statement_formatter.py`
- `apps/vendor_management/services/statement_calculator.py`

**Class Design:**
- VendorStatementService: Main orchestrator
- StatementPeriod: Period calculation utilities
- StatementFormat: Format configuration
- StatementData: Data container class

**Key Methods:**
- `generate_statement()`: Main entry point
- `calculate_period()`: Period boundary calculation
- `validate_parameters()`: Input validation
- `get_statement_data()`: Data aggregation wrapper

#### Step 2: Implement Period Calculation

Handle different period types and boundary calculations:

**Period Types:**
- Monthly: First to last day of month
- Quarterly: Q1-Q4 boundaries
- Annual: Fiscal year boundaries
- Custom: User-defined date range
- Year-to-date: From fiscal year start

**Calculations:**
- Opening balance as of period start
- Transaction filtering by date range
- Closing balance calculation
- Period comparison (vs previous period)

**Edge Cases:**
- Partial periods for new vendors
- Multi-currency handling
- Timezone considerations
- Date range validation

#### Step 3: Define Statement Configuration

Create flexible configuration for different statement types:

**Configuration Options:**
```
Statement Configuration Schema:
- statement_type: summary | detailed | transaction_level
- date_range: (start_date, end_date)
- include_paid: boolean
- include_unpaid: boolean
- include_payments: boolean
- include_credit_notes: boolean
- group_by: date | bill_number | category
- sort_by: date | amount | due_date
- currency: vendor_currency | base_currency | both
- language: en | si | ta
- format: pdf | html | excel | json
```

**Statement Types:**

1. **Summary Statement:**
   - Opening balance
   - Total bills
   - Total payments
   - Closing balance
   - Aging summary

2. **Detailed Statement:**
   - All summary information
   - Bill-by-bill listing
   - Payment allocation details
   - Running balance column

3. **Transaction-Level:**
   - Every transaction line
   - Full payment details
   - Adjustment explanations
   - Supporting document references

#### Step 4: Implement Core Service Methods

Create the main service methods:

**generate_statement() Method:**
- Accept vendor_id and configuration
- Validate all parameters
- Calculate period boundaries
- Call aggregation service
- Apply formatting
- Render output
- Store result
- Return statement object

**get_opening_balance() Method:**
- Query all bills before period start
- Sum unpaid amounts
- Handle multi-currency scenarios
- Include pending payments
- Return balance by currency

**get_closing_balance() Method:**
- Start with opening balance
- Add period bills
- Subtract period payments
- Include adjustments
- Return final balance

**calculate_aging() Method:**
- Group unpaid bills by age
- Standard buckets: Current, 30, 60, 90, 120+ days
- Calculate per bucket amounts
- Return aging breakdown

#### Step 5: Implement Statement Versioning

Track statement generation history:

**Version Management:**
- Store each generated statement
- Track generation timestamp
- Record parameters used
- Link to source transactions
- Enable regeneration with same parameters

**Audit Trail:**
- Who generated the statement
- When it was generated
- What parameters were used
- Which vendor received it
- Email delivery status

#### Step 6: Handle Multi-Currency Statements

Support vendors with multi-currency transactions:

**Currency Handling:**
- Separate sections per currency
- Show original transaction currency
- Optional base currency conversion
- Display exchange rates used
- Total in each currency

**Conversion Options:**
- Use transaction date rates
- Use statement date rate
- Use average period rate
- Show both original and converted

#### Step 7: Implement Statement Caching

Optimize for repeated generation:

**Caching Strategy:**
- Cache statement data for period
- Invalidate on new transactions
- Cache rendered output separately
- Support cache key variants
- TTL based on period type

**Cache Keys:**
- vendor_id + period + format
- Include transaction hash
- Version with statement template
- Separate cache per tenant

#### Step 8: Add Statement Comparison

Enable period-over-period analysis:

**Comparison Features:**
- Compare to previous period
- Highlight changes
- Calculate variance percentages
- Show trend indicators
- Generate comparison summary

**Metrics to Compare:**
- Total bills amount
- Payment amounts
- Outstanding balance
- Average payment time
- Number of transactions

### Expected Outcome

**Deliverables:**

1. **VendorStatementService Class:**
   - Complete service implementation
   - All configuration options supported
   - Period calculation working
   - Multi-currency handling
   - Caching implemented

2. **Statement Data Models:**
   - StatementHeader model
   - StatementLine model
   - Statement versioning
   - Audit logging

3. **Configuration System:**
   - Flexible statement types
   - Multiple period options
   - Format selection
   - Language support

4. **Documentation:**
   - API documentation
   - Configuration guide
   - Usage examples
   - Error handling guide

**Success Criteria:**

- [ ] Service generates all statement types correctly
- [ ] Period calculations are accurate
- [ ] Multi-currency statements work properly
- [ ] Opening/closing balances match
- [ ] Statement versioning tracks history
- [ ] Caching improves performance
- [ ] All edge cases handled
- [ ] Comprehensive error messages
- [ ] Unit test coverage > 90%
- [ ] Integration tests pass

### Verification Checklist

**Functionality:**
- [ ] Generate monthly statement successfully
- [ ] Generate quarterly statement successfully
- [ ] Generate custom date range statement
- [ ] Calculate opening balance correctly
- [ ] Calculate closing balance correctly
- [ ] Handle multi-currency statements
- [ ] Support all statement types
- [ ] Implement statement comparison
- [ ] Cache statements properly
- [ ] Version statements correctly

**Data Accuracy:**
- [ ] All bills included in period
- [ ] All payments included in period
- [ ] Opening balance matches previous closing
- [ ] Running balance calculates correctly
- [ ] Aging buckets categorize properly
- [ ] Multi-currency totals accurate
- [ ] Rounding errors handled
- [ ] Decimal precision maintained

**Performance:**
- [ ] Large statements generate within 5 seconds
- [ ] Caching reduces generation time by 80%
- [ ] Database queries optimized
- [ ] N+1 queries eliminated
- [ ] Memory usage reasonable
- [ ] Concurrent generation supported

**Error Handling:**
- [ ] Invalid vendor ID rejected
- [ ] Invalid date range rejected
- [ ] Missing data handled gracefully
- [ ] Timezone issues prevented
- [ ] Currency conversion errors caught
- [ ] Comprehensive error messages

---

## Task 68: Statement Data Aggregation Engine

### Overview

Implement the data aggregation engine that efficiently collects and processes all vendor transactions for statement generation. This component optimizes database queries and handles complex filtering, grouping, and calculation logic.

**Objectives:**
- Efficiently query bills and payments
- Aggregate transaction data
- Calculate running balances
- Group and sort transactions
- Handle large datasets with pagination
- Optimize query performance

**Business Value:**
- Fast statement generation
- Accurate financial data
- Scalable to large transaction volumes
- Supports complex filtering requirements

### Dependencies

**Internal:**
- VendorBill model and manager
- VendorPayment model and manager
- Currency exchange service
- Tenant context manager

**External:**
- Django ORM with select_related/prefetch_related
- Database aggregation functions
- Python itertools for grouping

**Data Sources:**
- vendor_bills table
- vendor_payments table
- payment_allocations table
- currency_exchange_rates table

### Data Aggregation Flow

```
┌─────────────────────────────────────────────────────────┐
│          Statement Data Aggregation Pipeline            │
└─────────────────────────────────────────────────────────┘

  ┌──────────────────┐
  │  Query Builder   │
  │  - Build filters │
  │  - Add joins     │
  │  - Optimize      │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │  Bill Fetcher    │
  │  - Date range    │
  │  - Status filter │
  │  - Prefetch rel  │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ Payment Fetcher  │
  │  - Date range    │
  │  - Allocations   │
  │  - Vendor link   │
  └────────┬─────────┘
           │
           ├───────────┬──────────────┬─────────────┐
           │           │              │             │
           ▼           ▼              ▼             ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Bills   │ │ Payments │ │  Credit  │ │ Adjust-  │
    │  List    │ │   List   │ │  Notes   │ │  ments   │
    └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │            │
         └────────────┴────────────┴────────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  Transaction Merger │
           │  - Combine all      │
           │  - Sort by date     │
           │  - Calculate balance│
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  Group & Aggregate  │
           │  - By date/category │
           │  - Calculate totals │
           │  - Running balance  │
           └──────────┬──────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  Final Data Package │
           │  - Summary          │
           │  - Transactions     │
           │  - Totals           │
           │  - Aging            │
           └─────────────────────┘
```

### Instructions

#### Step 1: Create Query Optimization Framework

Build efficient database query structure:

**Optimization Techniques:**
- Use select_related for ForeignKey relationships
- Use prefetch_related for reverse relationships
- Annotate calculations at database level
- Use only() to limit fields fetched
- Defer large fields not needed
- Use iterator() for large result sets

**Query Structure:**
```
Optimized Bill Query:
- Filter by vendor_id
- Filter by date_range
- Select related: vendor, currency, created_by
- Prefetch related: line_items, payments, credit_notes
- Annotate: total_paid, balance_due
- Order by: bill_date, bill_number
```

**Query Chaining:**
- Build base queryset
- Apply filters conditionally
- Add annotations as needed
- Limit result set appropriately
- Use pagination for large sets

#### Step 2: Implement Bill Aggregation

Collect and process bill data:

**Bill Collection:**
- Query bills in date range
- Include partially paid bills
- Handle multi-currency bills
- Calculate amounts due
- Fetch related line items
- Include bill attachments

**Bill Calculations:**
- Subtotal per bill
- Tax amounts per bill
- Total amount per bill
- Amount paid per bill
- Balance due per bill
- Days outstanding

**Filtering Options:**
- By bill status
- By payment status
- By amount range
- By due date range
- By category/department
- By bill type

#### Step 3: Implement Payment Aggregation

Collect and process payment data:

**Payment Collection:**
- Query payments in date range
- Include payment allocations
- Handle partial payments
- Track payment methods
- Include payment references
- Link to bills paid

**Payment Calculations:**
- Total amount per payment
- Allocated amount per bill
- Unallocated amounts
- Payment date vs bill date
- Days to payment
- Discount taken

**Payment Grouping:**
- By payment date
- By payment method
- By payment batch
- By bill paid
- By currency

#### Step 4: Create Transaction Merger

Combine all transaction types into unified timeline:

**Merge Logic:**
- Create unified transaction list
- Each entry has: date, type, reference, amount, balance
- Sort by date, then by type priority
- Bill: increases balance
- Payment: decreases balance
- Credit Note: decreases balance
- Adjustment: increases/decreases balance

**Transaction Priority:**
When same date:
1. Opening balance
2. Bills (oldest first)
3. Credit notes
4. Payments
5. Adjustments

**Running Balance:**
- Start with opening balance
- Add bills as positive
- Subtract payments as negative
- Track balance after each transaction
- Maintain per-currency balances

#### Step 5: Implement Grouping Engine

Support flexible transaction grouping:

**Grouping Options:**

1. **By Date:**
   - Daily grouping
   - Weekly grouping
   - Monthly grouping
   - Show subtotals per group

2. **By Type:**
   - All bills together
   - All payments together
   - All credit notes together
   - Show type totals

3. **By Status:**
   - Paid transactions
   - Unpaid transactions
   - Partially paid
   - Show status totals

4. **By Category:**
   - Group by expense category
   - Group by department
   - Group by project
   - Show category totals

**Subtotal Calculations:**
- Sum amounts per group
- Show group count
- Calculate group percentage
- Show group average

#### Step 6: Implement Summary Calculator

Generate statement summary statistics:

**Summary Components:**

1. **Period Summary:**
   - Period start date
   - Period end date
   - Number of days
   - Opening balance
   - Closing balance
   - Net change

2. **Transaction Summary:**
   - Total bills: count and amount
   - Total payments: count and amount
   - Total credit notes: count and amount
   - Average bill amount
   - Average payment amount

3. **Balance Summary:**
   - Current balance
   - Overdue balance
   - Future balance (not yet due)
   - Largest outstanding bill
   - Oldest outstanding bill

4. **Aging Summary:**
   - Current (0-30 days)
   - 31-60 days
   - 61-90 days
   - 91-120 days
   - Over 120 days
   - Total overdue

5. **Payment Statistics:**
   - Average days to payment
   - On-time payment percentage
   - Early payment percentage
   - Late payment percentage
   - Discount taken amount

#### Step 7: Handle Multi-Currency Aggregation

Manage statements with multiple currencies:

**Currency Handling:**
- Identify all currencies used
- Separate balance per currency
- Aggregate per currency
- Optional conversion to base currency
- Display exchange rates

**Multi-Currency Statement Structure:**
```
Statement with Multiple Currencies:

Currency 1 (USD):
  Opening Balance: $10,000.00
  Bills: $5,000.00
  Payments: ($3,000.00)
  Closing Balance: $12,000.00

Currency 2 (LKR):
  Opening Balance: Rs 500,000.00
  Bills: Rs 250,000.00
  Payments: (Rs 100,000.00)
  Closing Balance: Rs 650,000.00

Total in Base Currency (USD):
  Closing Balance: $14,500.00
  (Exchange rates as of [date])
```

**Conversion Options:**
- No conversion (show all in original currency)
- Convert to base currency
- Show both original and converted
- Use historical rates for transactions
- Use statement date rate for totals

#### Step 8: Implement Performance Optimization

Optimize for large datasets:

**Optimization Strategies:**

1. **Query Batching:**
   - Batch large queries
   - Use pagination internally
   - Process in chunks
   - Yield results progressively

2. **Caching:**
   - Cache vendor transaction counts
   - Cache period summaries
   - Cache exchange rates
   - Cache formatted amounts

3. **Lazy Loading:**
   - Load summary first
   - Load details on demand
   - Support partial statement generation
   - Enable progressive rendering

4. **Database Optimization:**
   - Ensure proper indexes
   - Use aggregate functions
   - Minimize joins
   - Use explain analyze for tuning

5. **Memory Management:**
   - Use iterators for large sets
   - Release objects when done
   - Avoid loading unnecessary data
   - Stream results when possible

### Expected Outcome

**Deliverables:**

1. **Aggregation Service:**
   - StatementDataAggregator class
   - Query optimization implemented
   - Efficient data collection
   - Transaction merging working
   - Grouping engine complete

2. **Performance Metrics:**
   - Statements < 100 transactions: < 1 second
   - Statements 100-1000 transactions: < 3 seconds
   - Statements > 1000 transactions: < 10 seconds
   - Database queries minimized
   - Memory usage optimized

3. **Data Quality:**
   - Accurate balance calculations
   - No missing transactions
   - Proper transaction ordering
   - Correct currency handling
   - Reliable aging calculations

4. **Testing Suite:**
   - Unit tests for each aggregation function
   - Integration tests with real data
   - Performance benchmarks
   - Edge case tests

**Success Criteria:**

- [ ] All transaction types aggregated correctly
- [ ] Running balance calculated accurately
- [ ] Multi-currency handled properly
- [ ] Grouping options work as expected
- [ ] Summary calculations are correct
- [ ] Performance targets met
- [ ] Large datasets handled efficiently
- [ ] Memory usage within limits
- [ ] Query count minimized
- [ ] Test coverage > 90%

### Verification Checklist

**Data Completeness:**
- [ ] All bills in period included
- [ ] All payments in period included
- [ ] All credit notes included
- [ ] Opening balance correct
- [ ] Closing balance correct
- [ ] No duplicate transactions
- [ ] No missing transactions

**Calculation Accuracy:**
- [ ] Running balance accurate
- [ ] Subtotals correct
- [ ] Grand totals correct
- [ ] Aging buckets correct
- [ ] Currency conversions accurate
- [ ] Percentage calculations correct
- [ ] Average calculations correct

**Performance:**
- [ ] Small statements (< 50 items) load instantly
- [ ] Medium statements (50-500 items) < 2 seconds
- [ ] Large statements (500-5000 items) < 10 seconds
- [ ] Database queries < 10 per statement
- [ ] Memory usage < 100MB for largest statement
- [ ] No N+1 query problems
- [ ] Caching reduces repeat generation by 80%

**Grouping & Sorting:**
- [ ] Date grouping works correctly
- [ ] Type grouping works correctly
- [ ] Status grouping works correctly
- [ ] Custom grouping supported
- [ ] Sort order maintained
- [ ] Subtotals calculate correctly

---

## Task 69: PDF Generation with ReportLab/WeasyPrint

### Overview

Implement professional PDF generation for vendor statements using ReportLab or WeasyPrint. Create well-formatted, branded statements with proper layout, typography, and styling that can be printed or emailed to vendors.

**Objectives:**
- Generate professional PDF statements
- Support custom branding/logos
- Implement responsive page layouts
- Handle multi-page statements
- Support multiple languages
- Optimize PDF file size

**Business Value:**
- Professional vendor communication
- Print-ready statement format
- Consistent branding
- Archival-quality documents

### Dependencies

**Internal:**
- Statement data from aggregation service
- Company branding configuration
- Localization service

**External:**
- ReportLab library (or WeasyPrint)
- Pillow for image handling
- Font libraries for multiple languages
- wkhtmltopdf (if using WeasyPrint)

**System Requirements:**
- PDF rendering libraries installed
- Font files available
- Sufficient memory for rendering
- Temp directory for intermediate files

### PDF Generation Architecture

```
┌──────────────────────────────────────────────────────────┐
│              PDF Generation Architecture                  │
└──────────────────────────────────────────────────────────┘

         ┌────────────────────┐
         │  Statement Data    │
         │  + Configuration   │
         └──────────┬─────────┘
                    │
                    ▼
         ┌────────────────────┐
         │  Template Selector │
         │  - Layout choice   │
         │  - Language        │
         │  - Branding        │
         └──────────┬─────────┘
                    │
        ┌───────────┴──────────┐
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  ReportLab   │  OR  │ WeasyPrint   │
│   Renderer   │      │   Renderer   │
└──────┬───────┘      └──────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
       ┌────────────────────┐
       │  PDF Post-Processor│
       │  - Optimize size   │
       │  - Add metadata    │
       │  - Add security    │
       └──────────┬─────────┘
                  │
                  ▼
       ┌────────────────────┐
       │  Storage Manager   │
       │  - Save to disk    │
       │  - Save to S3      │
       │  - Return URL      │
       └────────────────────┘
```

### PDF Layout Structure

```
┌────────────────────────────────────────────────────────┐
│                    PDF Statement Layout                 │
└────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════╗
║  HEADER SECTION                                        ║
║  ┌──────────────┐        ┌─────────────────────────┐  ║
║  │ Company Logo │        │   VENDOR STATEMENT      │  ║
║  │              │        │   Statement #: 12345    │  ║
║  └──────────────┘        │   Date: Jan 24, 2026    │  ║
║                          └─────────────────────────┘  ║
║                                                        ║
║  Company Name                  Vendor Details         ║
║  Address Line 1                ABC Suppliers Pvt Ltd  ║
║  Address Line 2                123 Main Street        ║
║  Contact Info                  Colombo 7, Sri Lanka   ║
╠════════════════════════════════════════════════════════╣
║  SUMMARY SECTION                                       ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  Period: January 1, 2026 - January 31, 2026   │   ║
║  │                                                │   ║
║  │  Opening Balance:         Rs 100,000.00       │   ║
║  │  Total Bills:            Rs 250,000.00       │   ║
║  │  Total Payments:        (Rs 200,000.00)      │   ║
║  │  Closing Balance:         Rs 150,000.00       │   ║
║  └────────────────────────────────────────────────┘   ║
╠════════════════════════════════════════════════════════╣
║  TRANSACTIONS SECTION                                  ║
║  ┌──────────────────────────────────────────────────┐ ║
║  │ Date     │ Ref     │ Type    │ Amount │ Balance │ ║
║  ├──────────┼─────────┼─────────┼────────┼─────────┤ ║
║  │ 01/01/26 │ BAL-FWD │ Balance │        │ 100,000 │ ║
║  │ 01/05/26 │ BILL-01 │ Bill    │ 50,000 │ 150,000 │ ║
║  │ 01/10/26 │ PAY-01  │ Payment │(50,000)│ 100,000 │ ║
║  │ 01/15/26 │ BILL-02 │ Bill    │100,000 │ 200,000 │ ║
║  │ ...      │ ...     │ ...     │ ...    │  ...    │ ║
║  └──────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════╣
║  AGING SECTION                                         ║
║  ┌────────────────────────────────────────────────┐   ║
║  │  Current:        Rs  50,000.00                 │   ║
║  │  31-60 days:    Rs  30,000.00                 │   ║
║  │  61-90 days:    Rs  40,000.00                 │   ║
║  │  Over 90 days:  Rs  30,000.00                 │   ║
║  │  Total Due:      Rs 150,000.00                 │   ║
║  └────────────────────────────────────────────────┘   ║
╠════════════════════════════════════════════════════════╣
║  FOOTER SECTION                                        ║
║  Payment Instructions: Please reference statement #    ║
║  Contact: accounts@company.com | +94 11 234 5678      ║
║  Page 1 of 3                  Generated: 2026-01-24   ║
╚════════════════════════════════════════════════════════╝
```

### Instructions

#### Step 1: Choose PDF Library

Select and configure PDF generation library:

**Option 1: ReportLab**
Pros:
- Pure Python, no external dependencies
- Fine control over layout
- Fast rendering
- Small file sizes
- Good for programmatic generation

Cons:
- Steeper learning curve
- More code required
- Manual positioning needed

**Option 2: WeasyPrint**
Pros:
- HTML/CSS based (familiar)
- Easier styling
- Good for complex layouts
- CSS grid/flexbox support

Cons:
- Requires external libraries
- Slower than ReportLab
- Larger file sizes
- CSS compatibility limits

**Recommendation:**
- Use ReportLab for simple, fast, programmatic generation
- Use WeasyPrint for complex layouts with rich styling
- Support both with adapter pattern

#### Step 2: Create PDF Generator Service

Implement the PDF generation service:

**Service Structure:**
- PDFStatementGenerator: Main service class
- StatementTemplate: Template configuration
- PDFRenderer: Abstract base for renderers
- ReportLabRenderer: ReportLab implementation
- WeasyPrintRenderer: WeasyPrint implementation

**Key Methods:**
- `generate_pdf()`: Main entry point
- `render_header()`: Render statement header
- `render_summary()`: Render summary section
- `render_transactions()`: Render transaction table
- `render_aging()`: Render aging analysis
- `render_footer()`: Render footer
- `save_pdf()`: Save to file/storage

#### Step 3: Implement ReportLab Renderer

Create ReportLab-based PDF generation:

**ReportLab Components:**
- Canvas: Low-level drawing
- Platypus: High-level layouts (recommended)
- Flowables: Content elements
- Styles: Text styling
- Tables: Table layouts

**Page Setup:**
- Page size: A4 (or configurable)
- Margins: 1 inch all sides
- Orientation: Portrait
- Font: Helvetica (or custom)
- Font sizes: 10pt body, 12pt headings

**Header Implementation:**
- Company logo (if available)
- Company details (name, address, contact)
- Statement title and number
- Statement date
- Vendor details

**Summary Box:**
- Bordered box with background color
- Key-value pairs
- Right-aligned amounts
- Bold labels
- Currency symbols

**Transaction Table:**
- Column headers: Date, Reference, Type, Description, Amount, Balance
- Alternating row colors
- Right-aligned amounts
- Proper number formatting
- Subtotals for groups
- Page breaks handled

**Styling:**
- Consistent fonts
- Color scheme matching brand
- Proper spacing
- Clear hierarchy
- Print-friendly colors

#### Step 4: Implement WeasyPrint Renderer

Create HTML/CSS-based PDF generation:

**HTML Template Structure:**
- Use Django templates or Jinja2
- Semantic HTML5 markup
- CSS for styling and layout
- Separate style sheet

**CSS Styling:**
- Page setup with @page rules
- Print-specific styles
- Responsive table layout
- Proper font declarations
- Color scheme

**Template Components:**
- header.html: Statement header
- summary.html: Summary section
- transactions.html: Transaction table
- aging.html: Aging analysis
- footer.html: Footer section

**WeasyPrint Configuration:**
- Set base URL for assets
- Configure font paths
- Set DPI for quality
- Enable specific CSS features

#### Step 5: Implement Multi-Page Handling

Handle statements spanning multiple pages:

**Page Management:**
- Automatic page breaks
- Prevent orphaned rows
- Repeat header on each page
- Page numbers in footer
- Table headers repeat

**ReportLab Page Breaks:**
- Use Flowables and PageBreak
- Calculate remaining space
- Split tables intelligently
- Add "Continued..." indicators

**WeasyPrint Page Breaks:**
- CSS page-break properties
- page-break-inside: avoid
- Table row breaks
- Orphan/widow control

**Continued Headers:**
```
Page 1 Header:
VENDOR STATEMENT - January 2026

Page 2+ Header:
VENDOR STATEMENT - January 2026 (Continued)
```

#### Step 6: Add Branding and Customization

Support custom branding:

**Branding Elements:**
- Company logo (position, size)
- Color scheme (primary, secondary, accent)
- Font choices (heading, body, mono)
- Header/footer styles
- Watermarks (draft, copy)

**Template Variants:**
- Standard template
- Detailed template
- Summary template
- Custom tenant templates

**Localization:**
- Multi-language support
- RTL language support
- Currency formatting per locale
- Date formatting per locale
- Number formatting per locale

#### Step 7: Optimize PDF Output

Optimize PDF files for size and quality:

**Optimization Techniques:**
- Compress images before embedding
- Subset fonts (include only used characters)
- Reduce DPI for non-critical images
- Remove unnecessary metadata
- Use efficient compression

**File Size Targets:**
- Summary statement (1 page): < 100 KB
- Detailed statement (5 pages): < 500 KB
- Large statement (20 pages): < 2 MB

**Quality Settings:**
- Text: Vector (always sharp)
- Images: 150-300 DPI
- Colors: RGB for screen, CMYK for print
- Fonts: Embedded subset

#### Step 8: Add PDF Metadata and Security

Add proper metadata and optional security:

**PDF Metadata:**
- Title: "Vendor Statement - [Vendor Name] - [Period]"
- Author: Company name
- Subject: "Account Statement"
- Keywords: vendor name, period, statement number
- Creator: Application name
- Creation date: Current date

**Security Options:**
- Password protection (optional)
- Prevent printing (optional)
- Prevent copying (optional)
- Prevent editing (always)
- Allow screen reader access (always)

**Compliance:**
- PDF/A for archival (optional)
- PDF/UA for accessibility (if required)
- Digital signatures (future enhancement)

### Expected Outcome

**Deliverables:**

1. **PDF Generator Service:**
   - Complete PDFStatementGenerator class
   - ReportLab renderer implemented
   - WeasyPrint renderer implemented (optional)
   - Template system working
   - Multi-page handling complete

2. **PDF Templates:**
   - Standard statement template
   - Detailed statement template
   - Summary statement template
   - Custom branding support

3. **Quality Assurance:**
   - Professional appearance
   - Consistent formatting
   - Proper page breaks
   - Correct calculations
   - Clear typography

4. **Documentation:**
   - Template customization guide
   - Branding configuration
   - Font installation guide
   - Troubleshooting guide

**Success Criteria:**

- [ ] PDFs generate without errors
- [ ] Layout is professional and clear
- [ ] All data displays correctly
- [ ] Multi-page statements work
- [ ] Branding applies correctly
- [ ] File sizes are optimized
- [ ] Fonts embed properly
- [ ] Images render clearly
- [ ] Printing works correctly
- [ ] Multiple languages supported

### Verification Checklist

**Layout & Formatting:**
- [ ] Header displays correctly
- [ ] Logo renders at proper size
- [ ] Company details complete
- [ ] Vendor details complete
- [ ] Summary box formatted well
- [ ] Transaction table aligns properly
- [ ] Amounts right-aligned
- [ ] Currency symbols display
- [ ] Aging section clear
- [ ] Footer information complete

**Multi-Page Handling:**
- [ ] Page breaks at appropriate points
- [ ] Headers repeat on each page
- [ ] Page numbers display correctly
- [ ] Table headers repeat
- [ ] No orphaned rows
- [ ] Continued indicators work

**Data Accuracy:**
- [ ] All transactions included
- [ ] Amounts display correctly
- [ ] Balances calculate correctly
- [ ] Dates format correctly
- [ ] References display
- [ ] Totals match data

**Branding:**
- [ ] Logo displays correctly
- [ ] Colors match brand
- [ ] Fonts match brand
- [ ] Layout matches brand guidelines
- [ ] Consistent with other documents

**Technical Quality:**
- [ ] File size reasonable
- [ ] PDF opens in all viewers
- [ ] Text is selectable
- [ ] Prints correctly
- [ ] Metadata populated
- [ ] No corrupted output

---

## Task 70: Email Template HTML System

### Overview

Create a flexible HTML email template system for sending vendor statements via email. Implement responsive, professional email templates that render correctly across different email clients and devices.

**Objectives:**
- Create responsive HTML email templates
- Support inline CSS for compatibility
- Implement template variables and placeholders
- Handle attachments (PDF statements)
- Support multiple languages
- Ensure email client compatibility

**Business Value:**
- Professional email communication
- Automated statement delivery
- Consistent branding
- Mobile-friendly emails

### Dependencies

**Internal:**
- Statement generation service
- PDF generator
- Company branding configuration
- Email backend configuration

**External:**
- Django email framework
- HTML email template engine
- CSS inliner (premailer)
- Email testing tools

**Integration Points:**
- SMTP server
- Email service provider (SendGrid, SES, etc.)
- File storage for attachments
- Celery for async sending

### Email Template Architecture

```
┌──────────────────────────────────────────────────────┐
│           Email Template System Architecture         │
└──────────────────────────────────────────────────────┘

  ┌────────────────────────┐
  │  Statement Data        │
  │  + Email Configuration │
  └───────────┬────────────┘
              │
              ▼
  ┌────────────────────────┐
  │  Template Engine       │
  │  - Select template     │
  │  - Inject variables    │
  │  - Render HTML         │
  └───────────┬────────────┘
              │
              ▼
  ┌────────────────────────┐
  │  CSS Inliner           │
  │  - Inline all styles   │
  │  - Remove unused CSS   │
  │  - Optimize for email  │
  └───────────┬────────────┘
              │
              ▼
  ┌────────────────────────┐
  │  Email Builder         │
  │  - HTML body           │
  │  - Plain text alt      │
  │  - Attach PDF          │
  │  - Add headers         │
  └───────────┬────────────┘
              │
              ▼
  ┌────────────────────────┐
  │  Email Validator       │
  │  - Test syntax         │
  │  - Check size          │
  │  - Verify attachments  │
  └───────────┬────────────┘
              │
              ▼
  ┌────────────────────────┐
  │  Email Sender          │
  │  - Queue for sending   │
  │  - Track delivery      │
  │  - Handle failures     │
  └────────────────────────┘
```

### HTML Email Structure

```
┌─────────────────────────────────────────────────────┐
│              HTML Email Template Layout              │
└─────────────────────────────────────────────────────┘

<!DOCTYPE html>
<html>
  <head>
    <!-- Meta tags -->
    <!-- Responsive viewport -->
    <!-- Client-specific fixes -->
  </head>
  <body>
    <!-- Outer table (container) -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          
          <!-- Inner table (content, max 600px) -->
          <table width="600" cellpadding="0" cellspacing="0">
            
            <!-- Header Section -->
            <tr>
              <td style="header-styles">
                [LOGO] [COMPANY NAME]
              </td>
            </tr>
            
            <!-- Hero Section -->
            <tr>
              <td style="hero-styles">
                <h1>Your Vendor Statement</h1>
                <p>Period: [PERIOD]</p>
              </td>
            </tr>
            
            <!-- Content Section -->
            <tr>
              <td style="content-styles">
                <p>Dear [VENDOR_NAME],</p>
                <p>Attached is your statement for [PERIOD].</p>
                
                <!-- Summary Box -->
                <table style="summary-box-styles">
                  <tr>
                    <td>Opening Balance:</td>
                    <td>[OPENING_BALANCE]</td>
                  </tr>
                  <tr>
                    <td>Total Bills:</td>
                    <td>[TOTAL_BILLS]</td>
                  </tr>
                  <tr>
                    <td>Total Payments:</td>
                    <td>[TOTAL_PAYMENTS]</td>
                  </tr>
                  <tr>
                    <td>Closing Balance:</td>
                    <td>[CLOSING_BALANCE]</td>
                  </tr>
                </table>
                
                <p>Please review and contact us with questions.</p>
              </td>
            </tr>
            
            <!-- Call-to-Action Section -->
            <tr>
              <td style="cta-styles">
                <a href="[VIEW_ONLINE_URL]">View Online</a>
              </td>
            </tr>
            
            <!-- Footer Section -->
            <tr>
              <td style="footer-styles">
                <p>[COMPANY_NAME]</p>
                <p>[ADDRESS]</p>
                <p>[CONTACT_INFO]</p>
                <p><a href="[UNSUBSCRIBE]">Unsubscribe</a></p>
              </td>
            </tr>
            
          </table>
          
        </td>
      </tr>
    </table>
  </body>
</html>
```

### Instructions

#### Step 1: Design Email Template Structure

Create base HTML email template:

**Email Design Principles:**
- Use tables for layout (best compatibility)
- Inline CSS (many clients strip `<style>` tags)
- Max width 600px (standard email width)
- Simple, clean design
- Clear hierarchy
- Mobile responsive

**Template Components:**
- Email wrapper (100% width table)
- Content container (600px max width table)
- Header section
- Hero section
- Content section
- Summary box
- Call-to-action button
- Footer section

**Best Practices:**
- Use `cellpadding="0" cellspacing="0"` on all tables
- Use `border="0"` on images
- Specify `width` and `height` for images
- Use web-safe fonts
- Provide alt text for images
- Include view-in-browser link

#### Step 2: Implement Template Variables

Create dynamic variable replacement system:

**Variable Types:**

1. **Vendor Variables:**
   - `{{ vendor_name }}`
   - `{{ vendor_contact_name }}`
   - `{{ vendor_email }}`
   - `{{ vendor_account_number }}`

2. **Company Variables:**
   - `{{ company_name }}`
   - `{{ company_logo_url }}`
   - `{{ company_address }}`
   - `{{ company_email }}`
   - `{{ company_phone }}`

3. **Statement Variables:**
   - `{{ statement_number }}`
   - `{{ statement_period }}`
   - `{{ period_start_date }}`
   - `{{ period_end_date }}`
   - `{{ generated_date }}`

4. **Financial Variables:**
   - `{{ opening_balance }}`
   - `{{ total_bills }}`
   - `{{ total_payments }}`
   - `{{ closing_balance }}`
   - `{{ currency_symbol }}`
   - `{{ currency_code }}`

5. **Action Variables:**
   - `{{ view_online_url }}`
   - `{{ download_pdf_url }}`
   - `{{ payment_url }}`
   - `{{ contact_us_url }}`
   - `{{ unsubscribe_url }}`

**Template Rendering:**
- Use Django template engine
- Support conditional blocks
- Support loops for multiple items
- Apply filters for formatting
- Handle missing variables gracefully

#### Step 3: Create Responsive Design

Make email responsive for mobile devices:

**Responsive Techniques:**
- Use `max-width` instead of fixed width
- Media queries for small screens
- Stack columns on mobile
- Larger touch targets (buttons 44x44px min)
- Readable font sizes (14px+ on mobile)

**Mobile Optimizations:**
```
@media only screen and (max-width: 600px) {
  /* Full width on mobile */
  .container { width: 100% !important; }
  
  /* Larger text on mobile */
  .body-text { font-size: 16px !important; }
  
  /* Stack columns */
  .column { display: block !important; width: 100% !important; }
  
  /* Full-width buttons */
  .button { width: 100% !important; }
  
  /* Add padding on mobile */
  .mobile-padding { padding: 20px !important; }
}
```

**Testing:**
- Test on actual mobile devices
- Test in Gmail app
- Test in iOS Mail
- Test in Outlook app
- Use Litmus or Email on Acid

#### Step 4: Implement CSS Inlining

Inline CSS for maximum compatibility:

**Why Inline CSS:**
- Many email clients strip `<style>` tags
- Gmail removes `<head>` section
- Outlook has limited CSS support
- Inline styles have highest priority

**Inlining Tools:**
- Premailer (Python library)
- Juice (Node.js library)
- Automatic inlining in template renderer

**Inlining Process:**
1. Define styles in `<style>` tag (for development)
2. Run inliner before sending
3. Convert all CSS rules to inline `style` attributes
4. Remove `<style>` tags
5. Keep media queries in `<style>` tag (for responsive)

**Example:**
```
Before:
<style>
  .summary-box { background: #f5f5f5; padding: 20px; }
</style>
<div class="summary-box">Content</div>

After:
<div style="background: #f5f5f5; padding: 20px;">Content</div>
```

#### Step 5: Create Email Variants

Implement multiple email templates:

**Template Variants:**

1. **Standard Statement Email:**
   - Full summary
   - Attachment link
   - Call to action
   - Professional tone

2. **Overdue Statement Email:**
   - Highlight overdue amount
   - Urgency in messaging
   - Payment instructions
   - Direct payment link

3. **Thank You Email:**
   - Acknowledge payment
   - Show updated balance
   - Appreciation message
   - Future statement schedule

4. **Reminder Email:**
   - Upcoming due bills
   - Action required
   - Simple layout
   - Clear next steps

**Template Selection Logic:**
- Based on statement type
- Based on account status
- Based on preferences
- Based on automation rules

#### Step 6: Create Plain Text Alternative

Provide plain text version for accessibility:

**Why Plain Text:**
- Some users prefer plain text
- Email clients may block images
- Accessibility for screen readers
- Spam filter compatibility
- Fallback for HTML rendering issues

**Plain Text Template:**
```
[COMPANY_NAME] - Vendor Statement

Dear [VENDOR_NAME],

Please find attached your account statement for [PERIOD].

Statement Summary:
------------------
Opening Balance:    [OPENING_BALANCE]
Total Bills:        [TOTAL_BILLS]
Total Payments:     [TOTAL_PAYMENTS]
Closing Balance:    [CLOSING_BALANCE]

To view your statement online, visit:
[VIEW_ONLINE_URL]

If you have any questions, please contact us:
Email: [COMPANY_EMAIL]
Phone: [COMPANY_PHONE]

Thank you for your business.

[COMPANY_NAME]
[COMPANY_ADDRESS]

---
To unsubscribe from statement emails: [UNSUBSCRIBE_URL]
```

**Multi-part MIME:**
- Send both HTML and plain text
- Email client chooses which to display
- HTML preferred if supported
- Plain text fallback always available

#### Step 7: Implement Template Management

Create system for managing email templates:

**Template Storage:**
- Store templates in database
- Version control for templates
- Template history and rollback
- Preview before sending
- A/B testing support

**Template Admin Interface:**
- WYSIWYG editor
- Variable helper (dropdown of available variables)
- Preview with sample data
- Send test email
- Template validation

**Template Customization:**
- Per-tenant templates
- Per-statement-type templates
- Language-specific templates
- Brand-specific templates

#### Step 8: Add Email Tracking

Implement tracking for email analytics:

**Tracking Features:**

1. **Open Tracking:**
   - Embed 1x1 pixel image
   - Track when email opened
   - Track number of opens
   - Track device/location (optional)

2. **Click Tracking:**
   - Wrap links with tracking URLs
   - Track which links clicked
   - Track click timestamp
   - A/B test different CTAs

3. **Engagement Metrics:**
   - Time to first open
   - Opens vs clicks
   - Forwarded emails
   - Print actions (if trackable)

**Privacy Considerations:**
- Respect do-not-track preferences
- Comply with privacy laws
- Provide opt-out mechanism
- Anonymous tracking option

**Analytics Dashboard:**
- Email sent count
- Delivery rate
- Open rate
- Click-through rate
- Bounce rate
- Unsubscribe rate

### Expected Outcome

**Deliverables:**

1. **Email Template System:**
   - Complete HTML email templates
   - Template variable system
   - CSS inlining implemented
   - Responsive design working
   - Plain text alternatives

2. **Email Templates:**
   - Standard statement email
   - Overdue statement email
   - Thank you email
   - Reminder email
   - Custom templates supported

3. **Template Management:**
   - Admin interface for templates
   - Template preview functionality
   - Test email sending
   - Template versioning

4. **Documentation:**
   - Template customization guide
   - Variable reference
   - Email client compatibility guide
   - Troubleshooting guide

**Success Criteria:**

- [ ] HTML emails render correctly in major clients
- [ ] Responsive design works on mobile
- [ ] All variables populate correctly
- [ ] CSS properly inlined
- [ ] Plain text alternative generated
- [ ] Attachments included properly
- [ ] Links work correctly
- [ ] Tracking implemented
- [ ] Templates customizable
- [ ] Preview functionality works

### Verification Checklist

**Rendering:**
- [ ] Gmail (web) renders correctly
- [ ] Gmail (mobile app) renders correctly
- [ ] Outlook (Windows) renders correctly
- [ ] Outlook (Mac) renders correctly
- [ ] Outlook.com (web) renders correctly
- [ ] Apple Mail (iOS) renders correctly
- [ ] Apple Mail (Mac) renders correctly
- [ ] Yahoo Mail renders correctly
- [ ] Other major clients tested

**Content:**
- [ ] All variables populate
- [ ] Logo displays correctly
- [ ] Images load
- [ ] Links are clickable
- [ ] Unsubscribe link works
- [ ] View online link works
- [ ] PDF attachment included
- [ ] Plain text version included

**Responsive:**
- [ ] Stacks properly on mobile
- [ ] Text readable on small screens
- [ ] Buttons touch-friendly
- [ ] No horizontal scrolling
- [ ] Images scale properly

**Functionality:**
- [ ] Template variables work
- [ ] CSS inlining works
- [ ] Multi-language support works
- [ ] Template selection works
- [ ] Tracking pixels work
- [ ] Click tracking works

---

## Task 71: Celery Task for Async Email Sending

### Overview

Implement asynchronous email sending using Celery to ensure that statement email delivery doesn't block the user interface and can handle bulk sending operations efficiently. This task covers queue management, retry logic, error handling, and delivery tracking.

**Objectives:**
- Create Celery tasks for async email sending
- Implement retry logic for failed sends
- Handle email queuing and prioritization
- Track email delivery status
- Support bulk email sending
- Monitor email queue health

**Business Value:**
- Non-blocking email operations
- Reliable email delivery
- Scalable bulk sending
- Automatic retry on failures
- Better user experience

### Dependencies

**Internal:**
- Celery task queue configured
- Email template system
- PDF generation service
- Statement service
- Redis/RabbitMQ broker

**External:**
- Celery library
- Email backend (SMTP/SendGrid/SES)
- Redis or RabbitMQ
- Celery Beat for scheduling

**Infrastructure:**
- Celery worker processes
- Message broker
- Result backend
- Monitoring tools

### Celery Task Architecture

```
┌─────────────────────────────────────────────────────┐
│         Async Email Sending Architecture            │
└─────────────────────────────────────────────────────┘

┌──────────────┐
│  API/View    │
│  Request to  │
│  Send Email  │
└──────┬───────┘
       │
       │ Enqueue Task
       │
       ▼
┌─────────────────────────┐
│   Message Broker        │
│   (Redis/RabbitMQ)      │
│   ┌─────────────────┐   │
│   │ Email Queue     │   │
│   │ - Priority 1    │   │
│   │ - Priority 2    │   │
│   │ - Priority 3    │   │
│   └─────────────────┘   │
└──────────┬──────────────┘
           │
           │ Consume Tasks
           │
           ▼
┌───────────────────────────────────────┐
│        Celery Workers                 │
│  ┌─────────────────────────────────┐ │
│  │  Worker 1  │  Worker 2  │ ...   │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Each Worker:                         │
│  1. Fetch task from queue            │
│  2. Generate/retrieve statement       │
│  3. Render email template            │
│  4. Attach PDF                       │
│  5. Send email                       │
│  6. Update status                    │
│  7. Handle errors/retries            │
└───────────┬───────────────────────────┘
            │
            │ Store Results
            │
            ▼
┌─────────────────────────┐
│   Result Backend        │
│   (Redis/Database)      │
│   - Task status         │
│   - Success/failure     │
│   - Error details       │
│   - Retry count         │
└─────────────────────────┘
```

### Email Sending Flow

```
┌───────────────────────────────────────────────────┐
│          Email Sending Task Flow                   │
└───────────────────────────────────────────────────┘

    START
      │
      ▼
┌─────────────────┐
│ Validate Input  │
│ - Vendor ID     │
│ - Period        │
│ - Email address │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ Valid? │
    └───┬─┬──┘
        │ │
     No │ │ Yes
        │ │
        ▼ │
    ┌─────┴──────┐
    │ Log Error  │
    │   Return   │
    └────────────┘
         │
         ▼
┌──────────────────┐
│ Generate/Fetch   │
│ Statement Data   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate PDF     │
│ (if not cached)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Render Email     │
│ Template         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Attach PDF       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send Email       │
└────────┬─────────┘
         │
    ┌────┴────┐
    │ Success? │
    └────┬─┬──┘
         │ │
      No │ │ Yes
         │ │
         ▼ │
┌──────────┴──┐
│ Check Retry │
│ Count       │
└────┬────┬───┘
     │    │
  Max│    │Can Retry
     │    │
     ▼    ▼
  ┌────┐ ┌────────────┐
  │Fail│ │Schedule    │
  │Log │ │Retry       │
  └────┘ │(Exponential│
         │ Backoff)   │
         └────────────┘
           │
           │
           ▼
┌──────────────────┐
│ Update Status    │
│ in Database      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send Notification│
│ (if configured)  │
└────────┬─────────┘
         │
         ▼
       END
```

### Instructions

#### Step 1: Create Celery Tasks

Define Celery tasks for email sending:

**Task Structure:**
```
File: apps/vendor_management/tasks/statement_email_tasks.py

Tasks to Create:
1. send_vendor_statement_email
   - Send single statement email
   - Parameters: vendor_id, period, options
   - Returns: success/failure status

2. send_bulk_statement_emails
   - Send statements to multiple vendors
   - Parameters: vendor_ids, period, options
   - Spawns individual send tasks
   - Returns: summary of queued tasks

3. generate_and_email_statement
   - Combined generation and sending
   - Ensures fresh statement data
   - Parameters: vendor_id, period, force_regenerate
   - Returns: task result

4. retry_failed_emails
   - Retry all failed emails in a batch
   - Parameters: batch_id, max_retries
   - Returns: retry summary
```

**Task Configuration:**
- Set task name explicitly
- Configure task routing
- Set time limits
- Configure rate limits
- Set retry policy

#### Step 2: Implement Main Email Task

Create the primary email sending task:

**Task Implementation:**

**Task Signature:**
```
@shared_task(
    name='send_vendor_statement_email',
    bind=True,  # Pass task instance as first argument
    max_retries=3,
    default_retry_delay=300,  # 5 minutes
    autoretry_for=(SMTPException, ConnectionError),
    retry_backoff=True,
    retry_backoff_max=3600,  # Max 1 hour
    retry_jitter=True
)
def send_vendor_statement_email(
    self,
    vendor_id,
    period_start,
    period_end,
    email_to=None,
    options=None
):
```

**Task Logic:**
1. Validate parameters
2. Load tenant context
3. Fetch vendor details
4. Generate or retrieve statement data
5. Generate PDF (use cache if available)
6. Render email template
7. Attach PDF to email
8. Send email via Django email backend
9. Log success/failure
10. Update email tracking record
11. Handle exceptions with retry logic

**Error Handling:**
- Catch specific exceptions
- Log detailed error information
- Decide whether to retry
- Update status in database
- Notify admin on critical failures

#### Step 3: Implement Bulk Sending

Create bulk email sending functionality:

**Bulk Task Implementation:**

**Approach 1: Group with Callback**
```
Use Celery groups and callbacks:
1. Create group of send tasks
2. Add callback to process results
3. Track overall progress
4. Generate summary report
```

**Approach 2: Chord**
```
Use Celery chord:
1. Send multiple emails in parallel
2. Callback executes when all complete
3. Aggregate results
4. Send completion notification
```

**Approach 3: Chunking**
```
Process vendors in chunks:
1. Divide vendor list into chunks (e.g., 100)
2. Process each chunk as a separate task
3. Prevents queue flooding
4. Better control over concurrency
```

**Progress Tracking:**
- Store bulk job record in database
- Update progress percentage
- Track success/failure counts
- Estimate completion time
- Provide status endpoint

**Rate Limiting:**
- Limit emails per minute
- Prevent ESP throttling
- Distribute load over time
- Configure per email provider

#### Step 4: Implement Retry Logic

Create sophisticated retry mechanism:

**Retry Strategy:**

**Exponential Backoff:**
```
Retry Attempt | Delay
--------------+--------
      1       | 5 min
      2       | 25 min
      3       | 125 min (2h 5min)
      4       | 625 min (10h 25min)
```

**Retry Conditions:**
- Network errors: Retry
- SMTP temporary errors (4xx): Retry
- SMTP permanent errors (5xx): Don't retry
- Invalid email address: Don't retry
- Rate limit errors: Retry with longer delay
- Timeout errors: Retry

**Max Retries:**
- Configure per task type
- Consider email importance
- Balance delivery vs resource usage
- Allow manual retry after max

**Retry Tracking:**
- Log each retry attempt
- Store retry count in database
- Track time between retries
- Analyze retry patterns

#### Step 5: Implement Email Queue Management

Manage email queue effectively:

**Queue Configuration:**

**Multiple Queues:**
```
1. high_priority: Urgent emails
   - Individual statement requests
   - Overdue notifications
   - 2 workers dedicated

2. normal_priority: Regular emails
   - Scheduled statements
   - Standard notifications
   - 4 workers

3. low_priority: Bulk operations
   - Bulk monthly statements
   - Marketing emails
   - 2 workers
```

**Task Routing:**
```
Route tasks to appropriate queue:
- Individual requests → high_priority
- Scheduled sends → normal_priority
- Bulk operations → low_priority
- Retry attempts → original queue
```

**Queue Monitoring:**
- Monitor queue depth
- Alert on queue backup
- Track processing rate
- Identify bottlenecks

**Concurrency Control:**
- Limit concurrent workers
- Prevent email provider throttling
- Balance resource usage
- Configure per queue

#### Step 6: Implement Status Tracking

Track email sending status:

**Email Status Model:**
```
EmailLog Model Fields:
- id: Primary key
- task_id: Celery task ID
- vendor: Foreign key to Vendor
- statement: Foreign key to Statement
- recipient_email: Email address
- subject: Email subject
- status: pending/sent/failed/bounced
- sent_at: Timestamp
- error_message: Error details
- retry_count: Number of retries
- opened_at: When email opened
- clicked_at: When link clicked
- created_at: Creation timestamp
- updated_at: Update timestamp
```

**Status Updates:**
- Create record when task queued
- Update when task starts
- Update when email sent
- Update on failure
- Update on delivery confirmation

**Status Query:**
- Get status by task_id
- Get all emails for vendor
- Get failed emails
- Get emails in period
- Get bulk job status

#### Step 7: Implement Monitoring and Alerts

Monitor email sending health:

**Metrics to Track:**
- Emails sent per hour
- Success rate
- Failure rate
- Average send time
- Queue depth
- Worker utilization
- Retry rate

**Alerts:**
- High failure rate (> 10%)
- Queue backing up (> 1000 messages)
- Worker crashes
- Repeated failures for same vendor
- Email provider throttling

**Dashboard:**
- Real-time queue status
- Recent email sends
- Failure reasons breakdown
- Retry statistics
- Performance metrics

**Logging:**
- Log all email attempts
- Log errors with full context
- Structured logging for analysis
- Separate log file for emails

#### Step 8: Implement Scheduled Sending

Schedule automatic statement sending:

**Celery Beat Integration:**
```
Scheduled Tasks:
1. send_monthly_statements
   - Schedule: 1st of each month at 6 AM
   - Sends statements to all vendors
   - Groups by timezone

2. send_overdue_reminders
   - Schedule: Daily at 9 AM
   - Identifies overdue accounts
   - Sends reminder emails

3. cleanup_old_email_logs
   - Schedule: Weekly
   - Archives old logs
   - Frees up database space
```

**Configuration:**
- Define schedule in settings
- Support multiple schedules
- Enable/disable per tenant
- Configure per vendor preferences

**Vendor Preferences:**
- Email frequency (weekly, monthly, quarterly)
- Preferred day of month
- Preferred time of day
- Timezone consideration
- Email format preference

### Expected Outcome

**Deliverables:**

1. **Celery Tasks:**
   - send_vendor_statement_email task
   - send_bulk_statement_emails task
   - generate_and_email_statement task
   - retry_failed_emails task
   - Scheduled tasks with Celery Beat

2. **Queue Management:**
   - Multiple priority queues
   - Task routing configuration
   - Concurrency controls
   - Rate limiting

3. **Status Tracking:**
   - EmailLog model
   - Status update system
   - Query interface
   - Progress tracking for bulk jobs

4. **Monitoring:**
   - Metrics collection
   - Alert system
   - Dashboard views
   - Logging infrastructure

5. **Documentation:**
   - Task usage guide
   - Configuration reference
   - Troubleshooting guide
   - Monitoring guide

**Success Criteria:**

- [ ] Emails send asynchronously without blocking UI
- [ ] Retry logic handles transient failures
- [ ] Bulk sending works efficiently
- [ ] Status tracking provides accurate information
- [ ] Queue never backs up uncontrollably
- [ ] Failure rate < 5% under normal conditions
- [ ] All errors logged with sufficient detail
- [ ] Scheduled sending works reliably
- [ ] Monitoring alerts trigger appropriately
- [ ] Test coverage > 85%

### Verification Checklist

**Task Functionality:**
- [ ] Single email task works
- [ ] Bulk email task works
- [ ] Tasks enqueue properly
- [ ] Tasks execute successfully
- [ ] Task results stored correctly
- [ ] Failed tasks retry appropriately
- [ ] Max retries respected
- [ ] Tasks time out properly

**Email Delivery:**
- [ ] Emails deliver successfully
- [ ] PDF attachments included
- [ ] Email content correct
- [ ] Links work in emails
- [ ] Tracking pixels work
- [ ] Plain text alternative sent
- [ ] Bounces handled

**Retry Logic:**
- [ ] Transient failures retry
- [ ] Permanent failures don't retry
- [ ] Exponential backoff works
- [ ] Max retries limit enforced
- [ ] Retry delay appropriate
- [ ] Manual retry works

**Performance:**
- [ ] Tasks don't block API requests
- [ ] Bulk sending efficient
- [ ] Queue processes at good rate
- [ ] Workers utilize resources well
- [ ] No memory leaks
- [ ] Scales to high volume

**Monitoring:**
- [ ] All tasks logged
- [ ] Errors captured with details
- [ ] Metrics collected accurately
- [ ] Alerts trigger correctly
- [ ] Dashboard updates in real-time
- [ ] Status queries fast

**Scheduled Tasks:**
- [ ] Scheduled tasks run on time
- [ ] Monthly statements send correctly
- [ ] Reminders send appropriately
- [ ] Cleanup tasks execute
- [ ] Vendor preferences respected

---

## Cross-Task Integration

### Integration Points

**Task 67 → Task 68:**
- VendorStatementService calls data aggregation engine
- Passes configuration and filters
- Receives structured statement data
- Uses data for all output formats

**Task 68 → Task 69:**
- Data aggregation provides transaction data
- PDF generator receives structured data
- Data formatted for PDF layout
- Calculations reused from aggregation

**Task 69 → Task 70:**
- PDF generator creates statement PDF
- Email template links to PDF
- PDF attached to email
- PDF available for download link

**Task 70 → Task 71:**
- Email template rendered by Celery task
- Template variables populated asynchronously
- HTML email attached to message
- Plain text alternative included

**Task 71 ← All Tasks:**
- Celery task orchestrates entire flow
- Calls statement service
- Generates PDF
- Renders email
- Sends asynchronously

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│           Complete Statement Email Flow                   │
└──────────────────────────────────────────────────────────┘

User Request
     │
     ├─► VendorStatementService (Task 67)
     │        │
     │        ├─► Calculate Period
     │        ├─► Validate Parameters
     │        └─► Enqueue Email Task
     │                   │
     │                   ▼
     │        Celery Task Queue (Task 71)
     │                   │
     │                   ├─► Task Assigned to Worker
     │                   │
     │                   ▼
     │        Statement Data Aggregator (Task 68)
     │                   │
     │                   ├─► Query Bills
     │                   ├─► Query Payments
     │                   ├─► Calculate Balances
     │                   ├─► Generate Aging
     │                   └─► Return Data Package
     │                             │
     │                             ▼
     │        PDF Generator (Task 69)
     │                   │
     │                   ├─► Render Header
     │                   ├─► Render Summary
     │                   ├─► Render Transactions
     │                   ├─► Render Footer
     │                   └─► Return PDF File
     │                             │
     │                             ▼
     │        Email Template Renderer (Task 70)
     │                   │
     │                   ├─► Load Template
     │                   ├─► Inject Variables
     │                   ├─► Inline CSS
     │                   ├─► Attach PDF
     │                   └─► Return Email Object
     │                             │
     │                             ▼
     │        Email Sender (Task 71)
     │                   │
     │                   ├─► Send Email
     │                   ├─► Update Status
     │                   └─► Log Result
     │                             │
     ▼                             ▼
Return Task ID              Email Delivered
```

### Testing Strategy

**Unit Tests:**
- Each service tested independently
- Mock external dependencies
- Test edge cases
- Test error conditions
- Test data accuracy

**Integration Tests:**
- Test complete flow end-to-end
- Use test database
- Use test email backend
- Verify PDF generation
- Verify email sending

**Performance Tests:**
- Load test with large statements
- Test bulk sending (1000+ emails)
- Measure queue processing time
- Monitor resource usage
- Identify bottlenecks

**Email Client Tests:**
- Test rendering in Gmail
- Test rendering in Outlook
- Test rendering in Apple Mail
- Test on mobile devices
- Test with images disabled

---

## Security Considerations

### Data Security

**Sensitive Information:**
- Vendor financial data is sensitive
- PDFs contain confidential information
- Email transmission must be secure
- Storage must be encrypted

**Access Control:**
- Only authorized users can generate statements
- Vendor can only access their own statements
- Tenant isolation enforced
- API endpoints protected

**PDF Security:**
- Optional password protection
- Watermarks for sensitive statements
- Prevent editing
- Track access

### Email Security

**SMTP Security:**
- Use TLS/SSL for SMTP connections
- Authenticate SMTP server
- Verify sender domain (SPF, DKIM, DMARC)
- Prevent email spoofing

**Attachment Security:**
- Scan PDFs for malware (optional)
- Limit attachment size
- Validate PDF structure
- Sign PDFs (optional)

**Link Security:**
- Use HTTPS for all links
- Sign download URLs
- Expire download links after time
- Rate limit downloads

---

## Performance Optimization

### Caching Strategy

**What to Cache:**
- Generated statements
- Rendered PDFs
- Email templates
- Vendor details
- Exchange rates

**Cache Keys:**
- vendor_id + period + format
- Invalidate on new transactions
- TTL based on data freshness requirements

**Cache Backends:**
- Redis for hot data
- File system for PDFs
- Database for archival

### Database Optimization

**Query Optimization:**
- Use proper indexes
- Optimize aggregation queries
- Use select_related/prefetch_related
- Limit result sets
- Use database functions

**Indexes Needed:**
- vendor_bills(vendor_id, bill_date)
- vendor_payments(vendor_id, payment_date)
- vendor_bills(bill_date) for range queries
- email_logs(task_id) for status lookup

### Async Optimization

**Task Optimization:**
- Minimize task payload
- Pass IDs instead of objects
- Use task result caching
- Implement task deduplication
- Use task routing

**Worker Optimization:**
- Appropriate number of workers
- Worker autoscaling
- Resource limits per worker
- Health checks
- Graceful shutdown

---

## Monitoring and Maintenance

### Health Checks

**System Health:**
- Celery workers running
- Message broker responsive
- Database accessible
- Email backend operational
- Storage accessible

**Functional Health:**
- Can generate statements
- Can create PDFs
- Can send emails
- Queue processing normally
- No error spike

### Maintenance Tasks

**Regular Maintenance:**
- Archive old statements
- Clean up temp files
- Purge old email logs
- Rotate log files
- Update PDF templates
- Review failure patterns

**Optimization:**
- Analyze slow queries
- Review cache hit rates
- Optimize PDF templates
- Tune worker count
- Review queue configuration

---

## Conclusion

This document provides comprehensive guidance for implementing the Vendor Statement Service (Tasks 67-71). The implementation covers:

1. **Core Service** (Task 67): Orchestrates statement generation with flexible configuration
2. **Data Aggregation** (Task 68): Efficiently collects and processes transaction data
3. **PDF Generation** (Task 69): Creates professional, print-ready statement PDFs
4. **Email Templates** (Task 70): Renders responsive, branded HTML emails
5. **Async Sending** (Task 71): Reliably delivers emails asynchronously with retry logic

Together, these components provide a robust, scalable vendor statement system that enhances vendor relationships through transparent, professional communication.

---

**Document End**
