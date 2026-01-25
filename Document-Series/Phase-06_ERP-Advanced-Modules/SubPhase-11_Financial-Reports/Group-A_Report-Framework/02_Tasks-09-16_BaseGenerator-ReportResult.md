# Tasks 09-16: BaseGenerator and ReportResult Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** A - Report Framework  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Reports-Module-Config.md](01_Tasks-01-08_Reports-Module-Config.md)
- **→ Next Group:** [Group-B_Trial-Balance-Report](../Group-B_Trial-Balance-Report/)

---

## Document Overview

This document covers the creation of the abstract BaseReportGenerator class that defines the common interface for all financial report generators, and the ReportResult model for caching generated reports. These components enable a consistent report generation pattern and performance optimization through caching.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create BaseReportGenerator | High | 45 min |
| 10 | Add Generate Method | Medium | 30 min |
| 11 | Add Get Data Method | Medium | 25 min |
| 12 | Add Format Method | Medium | 25 min |
| 13 | Create ReportResult Model | Medium | 30 min |
| 14 | Add Result Data Fields | Low | 15 min |
| 15 | Add Result Metadata | Low | 20 min |
| 16 | Run Report Migrations | Low | 10 min |

---

## Task 09: Create BaseReportGenerator

### Overview
Create the abstract BaseReportGenerator class that defines the common interface and shared functionality for all financial report generators. This class implements the Template Method pattern, providing a standard flow for report generation while allowing specific implementations for each report type.

### Dependencies
- Task 01: Reports module created
- Task 02: ReportType enum defined
- Task 04: ReportConfig model created
- Python ABC (Abstract Base Class) module
- Understanding of Template Method pattern

### Instructions

1. **Open base generator module**
   - Navigate to `apps/accounting/reports/base.py`
   - This will contain the abstract base class

2. **Import required dependencies**
   - Import `ABC` and `abstractmethod` from `abc` module
   - Import typing hints: `Dict`, `Any`, `Optional`
   - Import Django utilities as needed
   - Import `ReportConfig` from models
   - Import datetime utilities

3. **Define BaseReportGenerator class**
   - Inherit from `ABC` to make it abstract
   - Cannot be instantiated directly
   - Must be subclassed by specific report generators

4. **Add constructor method**
   - Accept `config: ReportConfig` parameter
   - Store config as instance attribute
   - Initialize tenant from config
   - Set up any common attributes

5. **Add protected attributes**
   - `_config`: Store the ReportConfig instance
   - `_tenant`: Reference to tenant from config
   - `_cache_key`: For result caching
   - `_errors`: List to collect validation errors

6. **Add configuration properties**
   - Property for accessing config attributes
   - Convenient accessors for common config values
   - Type hints for IDE support

### BaseReportGenerator Structure

```
BaseReportGenerator (Abstract):
├── Constructor
│   ├── __init__(config: ReportConfig)
│   └── Initialize attributes
├── Properties
│   ├── config (ReportConfig)
│   ├── tenant (Tenant)
│   └── report_type (ReportType)
├── Public Methods
│   ├── generate() → ReportResult (Task 10)
│   └── validate_config() → bool
├── Abstract Methods (Must Override)
│   ├── get_data() → Dict (Task 11)
│   └── format_output(data) → Dict (Task 12)
└── Protected Helper Methods
    ├── _get_date_range() → tuple
    ├── _get_comparison_range() → tuple
    ├── _calculate_variance(current, prior) → dict
    └── _should_include_account(account) → bool
```

### Class Design Principles

| Principle | Implementation | Benefit |
|-----------|---------------|---------|
| **Abstraction** | Abstract methods for data retrieval | Enforces consistent interface |
| **Template Method** | Common generate() flow | Standardized execution |
| **Encapsulation** | Protected helper methods | Code reuse across generators |
| **Type Safety** | Type hints throughout | IDE support and validation |

### Generator Lifecycle

```
Report Generation Flow:
1. Instantiate Generator
   ├── generator = TrialBalanceGenerator(config)
   └── Store config and tenant
2. Validate Configuration
   ├── generator.validate_config()
   └── Check required fields, date logic
3. Generate Report
   ├── result = generator.generate()
   ├── Calls get_data() [abstract]
   ├── Calls format_output() [abstract]
   └── Creates ReportResult object
4. Return Result
   └── ReportResult with data and metadata
```

### Inheritance Hierarchy

```
BaseReportGenerator (Abstract)
├── TrialBalanceGenerator
│   ├── Implements get_data()
│   └── Implements format_output()
├── ProfitLossGenerator
│   ├── Implements get_data()
│   └── Implements format_output()
├── BalanceSheetGenerator
│   ├── Implements get_data()
│   └── Implements format_output()
├── CashFlowGenerator
│   ├── Implements get_data()
│   └── Implements format_output()
└── GeneralLedgerGenerator
    ├── Implements get_data()
    └── Implements format_output()
```

### Validation Method Implementation

| Validation Check | Purpose | Error Message |
|-----------------|---------|---------------|
| **Config Exists** | Ensure config is provided | "Report configuration is required" |
| **Report Type** | Validate report type matches generator | "Invalid report type for this generator" |
| **Date Fields** | Check required date fields present | "Missing required date fields" |
| **Date Logic** | Validate date ranges | "End date must be after start date" |
| **Tenant** | Ensure tenant context exists | "Tenant context is required" |

### Expected Outcome
- Abstract BaseReportGenerator class defined
- Constructor and basic properties implemented
- Foundation for abstract methods (Tasks 10-12)
- Validation framework established
- Ready for specific generator implementations

### Verification Checklist
- [ ] `BaseReportGenerator` class defined in `base.py`
- [ ] Inherits from `ABC`
- [ ] Constructor accepts `ReportConfig` parameter
- [ ] Protected attributes initialized (`_config`, `_tenant`)
- [ ] Properties defined for config access
- [ ] `validate_config()` method implemented
- [ ] Proper imports and type hints

---

## Task 10: Add Generate Method

### Overview
Implement the main `generate()` method in BaseReportGenerator that orchestrates the report generation process. This method follows the Template Method pattern, calling abstract methods that subclasses must implement while handling common logic like validation, caching, and error handling.

### Dependencies
- Task 09: BaseReportGenerator class created
- Understanding of Template Method pattern
- Knowledge of caching strategies

### Instructions

1. **Open base generator module**
   - Navigate to `apps/accounting/reports/base.py`
   - Add generate method to BaseReportGenerator class

2. **Define generate method signature**
   - Method name: `generate`
   - Parameters: `force_refresh: bool = False`
   - Return type: `ReportResult`
   - Purpose: Main entry point for report generation

3. **Implement validation step**
   - Call `validate_config()` first
   - Raise `ValidationError` if validation fails
   - Collect and format error messages

4. **Implement cache check**
   - Check if cached result exists (unless force_refresh=True)
   - Build cache key from config parameters
   - Return cached result if valid and not expired

5. **Implement data retrieval**
   - Call abstract `get_data()` method
   - This is implemented by subclasses
   - Returns raw data dictionary

6. **Implement comparison logic (if enabled)**
   - Check if `config.include_comparison` is True
   - Retrieve comparison period data
   - Calculate variances (amount and percentage)
   - Merge comparison data with current period

7. **Implement formatting**
   - Call abstract `format_output(data)` method
   - This is implemented by subclasses
   - Returns formatted report structure

8. **Implement result creation**
   - Create ReportResult instance
   - Store formatted data and metadata
   - Set generation timestamp
   - Link to config and tenant

9. **Implement error handling**
   - Wrap in try-except block
   - Handle common exceptions gracefully
   - Log errors for debugging
   - Return meaningful error messages

10. **Return result**
    - Return ReportResult object
    - Includes success status, data, and metadata

### Generate Method Flow

```
generate() Method Execution:
1. Validate Configuration
   ├── Call validate_config()
   ├── If invalid: raise ValidationError
   └── Continue if valid
2. Check Cache (unless force_refresh)
   ├── Build cache key
   ├── Query ReportResult for cached version
   ├── If found and valid: return cached result
   └── Continue to generate if not cached
3. Retrieve Current Period Data
   ├── Call get_data() [Abstract]
   ├── Subclass provides implementation
   └── Returns data dictionary
4. Retrieve Comparison Data (if enabled)
   ├── Check config.include_comparison
   ├── Calculate comparison date range
   ├── Call get_data() with comparison dates
   └── Calculate variances
5. Format Output
   ├── Call format_output(data) [Abstract]
   ├── Subclass provides implementation
   └── Returns formatted structure
6. Create ReportResult
   ├── Instantiate ReportResult model
   ├── Store data, metadata, timestamps
   ├── Link to config and tenant
   └── Save to database
7. Return Result
   └── Return ReportResult object
```

### Cache Key Strategy

| Component | Value | Purpose |
|-----------|-------|---------|
| **Tenant ID** | `tenant.id` | Tenant isolation |
| **Report Type** | `config.report_type` | Report identifier |
| **Period** | `start_date-end_date` | Date range |
| **Detail Level** | `config.detail_level` | Output granularity |
| **Comparison** | `include_comparison` | Comparison flag |
| **Version** | Cache version number | Cache invalidation |

Cache key format: `report:{tenant_id}:{report_type}:{period}:{detail_level}:{comparison}:v1`

### Variance Calculation

| Variance Type | Formula | Display |
|--------------|---------|---------|
| **Amount** | current_value - prior_value | ₨ 50,000 |
| **Percentage** | ((current - prior) / prior) × 100 | +15.5% |
| **Favorable/Unfavorable** | Based on account type | ↑ Favorable / ↓ Unfavorable |

### Error Handling Strategy

| Error Type | Handling | User Message |
|------------|----------|--------------|
| **ValidationError** | Return immediately | "Configuration validation failed: {details}" |
| **DatabaseError** | Log and retry | "Database error occurred, retrying..." |
| **CalculationError** | Log and continue with warning | "Some calculations incomplete" |
| **TimeoutError** | Cancel and inform | "Report generation timed out" |

### Performance Considerations

| Optimization | Implementation | Benefit |
|--------------|---------------|---------|
| **Caching** | Cache generated reports | Avoid regeneration |
| **Pagination** | Limit initial result set | Faster rendering |
| **Lazy Loading** | Load detail on demand | Reduced memory |
| **Query Optimization** | Use select_related/prefetch | Fewer DB queries |

### Expected Outcome
- Main generate() method implemented
- Template Method pattern enforced
- Caching strategy in place
- Comparison logic integrated
- Error handling comprehensive
- Ready for subclass implementations

### Verification Checklist
- [ ] `generate()` method added to BaseReportGenerator
- [ ] Method accepts `force_refresh` parameter
- [ ] Returns `ReportResult` object
- [ ] Validation step implemented
- [ ] Cache check implemented
- [ ] Calls abstract methods (get_data, format_output)
- [ ] Comparison logic implemented
- [ ] Error handling in place

---

## Task 11: Add Get Data Method

### Overview
Define the abstract `get_data()` method that subclasses must implement to retrieve raw financial data for their specific report type. This method is responsible for querying the database and performing necessary calculations.

### Dependencies
- Task 09: BaseReportGenerator class created
- Task 10: Generate method structure in place
- Understanding of accounting data queries

### Instructions

1. **Open base generator module**
   - Navigate to `apps/accounting/reports/base.py`
   - Add abstract get_data method

2. **Define abstract method signature**
   - Use `@abstractmethod` decorator
   - Method name: `get_data`
   - Parameters: None (uses instance config)
   - Return type: `Dict[str, Any]`
   - Purpose: Retrieve raw report data

3. **Document expected return structure**
   - Add comprehensive docstring
   - Specify dictionary keys and value types
   - Provide examples for each report type
   - Document calculation requirements

4. **Define common data elements**
   - Account information (code, name, type)
   - Balance or transaction amounts
   - Period information
   - Hierarchy or grouping data

5. **Add helper method for date ranges**
   - Method: `_get_date_range()`
   - Returns tuple of (start_date, end_date)
   - Handles different period types
   - Used by get_data implementations

6. **Add helper method for account filtering**
   - Method: `_should_include_account(account)`
   - Checks detail level settings
   - Checks zero balance settings
   - Returns boolean

### Get Data Method Pattern

```
get_data() Abstract Method:
├── Must be implemented by subclass
├── Returns dictionary structure
├── Keys defined by report type
└── Values contain report data

Subclass Implementation Pattern:
def get_data(self) -> Dict[str, Any]:
    # 1. Get date range
    start_date, end_date = self._get_date_range()
    
    # 2. Query accounts
    accounts = Account.objects.filter(...)
    
    # 3. Calculate balances/amounts
    for account in accounts:
        balance = calculate_balance(...)
    
    # 4. Build data structure
    data = {
        'accounts': [...],
        'totals': {...},
        'metadata': {...}
    }
    
    # 5. Return data
    return data
```

### Expected Data Structure by Report Type

**Trial Balance:**
```
{
    'as_of_date': '2026-01-31',
    'accounts': [
        {
            'code': '1000',
            'name': 'Cash',
            'debit': 50000.00,
            'credit': 0.00,
            'balance': 50000.00
        },
        ...
    ],
    'totals': {
        'total_debit': 500000.00,
        'total_credit': 500000.00,
        'difference': 0.00
    }
}
```

**Profit & Loss:**
```
{
    'period': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'revenue': [
        {
            'account': 'Sales Revenue',
            'amount': 100000.00
        },
        ...
    ],
    'expenses': [
        {
            'account': 'Cost of Sales',
            'amount': 60000.00
        },
        ...
    ],
    'totals': {
        'total_revenue': 100000.00,
        'total_expenses': 75000.00,
        'net_profit': 25000.00
    }
}
```

**Balance Sheet:**
```
{
    'as_of_date': '2026-01-31',
    'assets': [
        {
            'category': 'Current Assets',
            'accounts': [...],
            'subtotal': 250000.00
        },
        ...
    ],
    'liabilities': [
        {
            'category': 'Current Liabilities',
            'accounts': [...],
            'subtotal': 100000.00
        },
        ...
    ],
    'equity': {
        'capital': 100000.00,
        'retained_earnings': 50000.00,
        'total': 150000.00
    },
    'totals': {
        'total_assets': 250000.00,
        'total_liabilities_equity': 250000.00
    }
}
```

### Helper Method: _get_date_range()

| Period Type | Logic | Returns |
|-------------|-------|---------|
| **CUSTOM** | Use config.start_date, config.end_date | (start_date, end_date) |
| **MONTHLY** | Calculate month boundaries | (2026-05-01, 2026-05-31) |
| **QUARTERLY** | Calculate quarter boundaries | (2026-04-01, 2026-06-30) |
| **YEARLY** | Calculate fiscal year | (2026-04-01, 2027-03-31) |

### Helper Method: _should_include_account()

| Condition | Include? | Reason |
|-----------|----------|--------|
| **detail_level = SUMMARY, account is sub-account** | No | Show only parent accounts |
| **detail_level = DETAIL, account is sub-account** | Yes | Show all detail |
| **include_zero_balances = False, balance = 0** | No | Hide zero balance |
| **include_zero_balances = True, balance = 0** | Yes | Show all accounts |

### Query Optimization Guidelines

| Strategy | Implementation | Benefit |
|----------|---------------|---------|
| **Select Related** | Load tenant, account type in one query | Reduce queries |
| **Prefetch Related** | Load journal entries efficiently | Avoid N+1 |
| **Aggregation** | Use Sum, Count in database | Faster calculation |
| **Indexed Fields** | Query on indexed fields (date, tenant) | Fast filtering |
| **Date Range** | Filter transactions by date early | Smaller dataset |

### Expected Outcome
- Abstract get_data() method defined
- Clear return structure documented
- Helper methods for common operations
- Pattern established for subclass implementations
- Query optimization guidelines provided

### Verification Checklist
- [ ] `get_data()` method declared as abstract
- [ ] Method signature and return type defined
- [ ] Comprehensive docstring added
- [ ] Expected data structures documented
- [ ] Helper methods implemented (_get_date_range, _should_include_account)
- [ ] Query optimization patterns noted

---

## Task 12: Add Format Method

### Overview
Define the abstract `format_output()` method that subclasses must implement to transform raw data into a structured, presentation-ready format. This method handles formatting, grouping, sorting, and calculating display values.

### Dependencies
- Task 09: BaseReportGenerator class created
- Task 11: Get data method defined
- Understanding of report presentation requirements

### Instructions

1. **Open base generator module**
   - Navigate to `apps/accounting/reports/base.py`
   - Add abstract format_output method

2. **Define abstract method signature**
   - Use `@abstractmethod` decorator
   - Method name: `format_output`
   - Parameters: `data: Dict[str, Any]`
   - Return type: `Dict[str, Any]`
   - Purpose: Format data for presentation

3. **Document expected return structure**
   - Add comprehensive docstring
   - Specify output format structure
   - Include formatting requirements
   - Document display conventions

4. **Define common formatting tasks**
   - Number formatting (currency, percentages)
   - Date formatting
   - Sorting and grouping
   - Hierarchical structuring
   - Total calculations

5. **Add helper method for currency formatting**
   - Method: `_format_currency(amount)`
   - Converts to LKR display format
   - Returns string: "₨ 1,234,567.89"

6. **Add helper method for variance formatting**
   - Method: `_format_variance(current, prior)`
   - Calculates amount and percentage
   - Returns formatted variance with indicators

7. **Add helper method for account hierarchy**
   - Method: `_build_account_tree(accounts)`
   - Creates nested structure
   - Handles parent-child relationships
   - Calculates subtotals

### Format Output Method Pattern

```
format_output() Abstract Method:
├── Must be implemented by subclass
├── Receives raw data dictionary
├── Returns formatted output dictionary
└── Handles presentation logic

Subclass Implementation Pattern:
def format_output(self, data: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Format currency values
    formatted_accounts = []
    for account in data['accounts']:
        formatted_accounts.append({
            'code': account['code'],
            'name': account['name'],
            'amount': self._format_currency(account['amount'])
        })
    
    # 2. Build hierarchy (if needed)
    tree = self._build_account_tree(formatted_accounts)
    
    # 3. Add comparison (if enabled)
    if self._config.include_comparison:
        add_variance_columns(tree)
    
    # 4. Structure output
    output = {
        'header': {...},
        'sections': [...],
        'footer': {...}
    }
    
    # 5. Return formatted output
    return output
```

### Expected Output Structure

**Common Report Structure:**
```
{
    'header': {
        'tenant_name': 'ABC Traders Pvt Ltd',
        'report_title': 'Trial Balance',
        'as_of_date': '31 January 2026',
        'period': 'January 2026',
        'currency': 'LKR',
        'generated_at': '2026-01-25 14:30:00'
    },
    'sections': [
        {
            'title': 'Assets',
            'rows': [
                {
                    'code': '1000',
                    'name': 'Cash',
                    'amount': '₨ 50,000.00',
                    'level': 0
                },
                ...
            ],
            'subtotal': '₨ 250,000.00'
        },
        ...
    ],
    'footer': {
        'totals': {
            'total_debit': '₨ 500,000.00',
            'total_credit': '₨ 500,000.00'
        },
        'notes': ['Report generated on...']
    }
}
```

**With Comparison:**
```
{
    'sections': [
        {
            'rows': [
                {
                    'account': 'Revenue',
                    'current': '₨ 100,000.00',
                    'prior': '₨ 85,000.00',
                    'variance_amount': '₨ 15,000.00',
                    'variance_percent': '+17.6%',
                    'indicator': '↑'
                },
                ...
            ]
        }
    ]
}
```

### Helper Method: _format_currency()

| Input | Output | Format |
|-------|--------|--------|
| 50000.00 | ₨ 50,000.00 | Thousand separator, 2 decimals |
| -25000.50 | (₨ 25,000.50) | Negative in parentheses |
| 1234567.89 | ₨ 1,234,567.89 | Full precision |
| 0.00 | ₨ - | Zero as dash (optional) |

### Helper Method: _format_variance()

```
Variance Formatting:
├── Amount: ₨ 15,000.00
├── Percentage: +17.6%
├── Indicator:
│   ├── ↑ (Positive variance)
│   ├── ↓ (Negative variance)
│   └── → (No change)
└── Favorability (context-dependent):
    ├── Revenue increase: Favorable
    ├── Expense increase: Unfavorable
    └── Asset increase: Favorable
```

### Helper Method: _build_account_tree()

```
Account Hierarchy:
Assets (level 0)
├── Current Assets (level 1)
│   ├── Cash (level 2)
│   ├── Bank (level 2)
│   └── Accounts Receivable (level 2)
├── Fixed Assets (level 1)
│   ├── Land (level 2)
│   └── Buildings (level 2)
└── Subtotal: ₨ 500,000.00
```

### Sri Lankan Formatting Conventions

| Element | Format | Example |
|---------|--------|---------|
| **Currency Symbol** | ₨ or Rs. | ₨ 50,000.00 |
| **Thousand Separator** | Comma | 1,234,567 |
| **Decimal Places** | 2 for currency | 50,000.00 |
| **Date Format** | DD Month YYYY | 31 January 2026 |
| **Negative Values** | Parentheses or minus | (5,000.00) or -5,000.00 |

### Output Sorting Rules

| Report Type | Primary Sort | Secondary Sort |
|-------------|-------------|----------------|
| **Trial Balance** | Account code | - |
| **Profit & Loss** | Section order (Revenue, Expenses) | Account name |
| **Balance Sheet** | Section order (Assets, Liabilities, Equity) | Account type |
| **Cash Flow** | Activity category | Account code |
| **General Ledger** | Date | Transaction time |

### Expected Outcome
- Abstract format_output() method defined
- Clear output structure documented
- Helper methods for formatting implemented
- Sri Lankan conventions applied
- Ready for specific report formatting

### Verification Checklist
- [ ] `format_output()` method declared as abstract
- [ ] Method signature and return type defined
- [ ] Comprehensive docstring added
- [ ] Expected output structures documented
- [ ] Helper methods implemented (_format_currency, _format_variance, _build_account_tree)
- [ ] Sri Lankan formatting conventions noted

---

## Task 13: Create ReportResult Model

### Overview
Create the ReportResult model to store generated financial reports for caching and audit purposes. This model stores the complete report output, metadata, and generation information, enabling quick retrieval of previously generated reports and maintaining an audit trail.

### Dependencies
- Task 01: Reports module created
- Task 04: ReportConfig model created
- Django models and multi-tenancy infrastructure
- Understanding of report caching requirements

### Instructions

1. **Create report_result model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `report_result.py`
   - This will contain the ReportResult model

2. **Import required dependencies**
   - Import Django model fields (JSONField, DateTimeField, etc.)
   - Import `TenantAwareModel` and `TimestampedModel` from core
   - Import `ReportConfig` model
   - Import User model for tracking generator

3. **Define ReportResult model class**
   - Inherit from `TenantAwareModel` and `TimestampedModel`
   - Provides tenant isolation and automatic timestamps
   - Will store generated report data

4. **Add config relationship field**
   - `config`: ForeignKey to ReportConfig
   - Purpose: Links result to configuration used
   - Set `related_name='results'`
   - Enable cascade deletion

5. **Add tenant relationship field**
   - `tenant`: ForeignKey to Tenant model
   - Purpose: Tenant isolation
   - Set `related_name='report_results'`
   - Enable cascade deletion

6. **Add generation tracking fields**
   - `generated_at`: DateTimeField with auto_now_add
   - Purpose: Timestamp of report generation
   - Automatically set on creation

7. **Add generated_by field**
   - `generated_by`: ForeignKey to User model
   - Purpose: Track who generated the report
   - Set `null=True` (for system-generated reports)
   - Set `related_name='generated_reports'`

8. **Add cache control fields**
   - `cache_key`: CharField for unique cache identifier
   - Purpose: Quick cache lookups
   - Max length: 255 characters
   - Add database index for performance

9. **Add expiry field**
   - `expires_at`: DateTimeField
   - Purpose: Cache expiration time
   - Set `null=True` (no expiry means permanent)
   - Calculate based on report type and settings

### Model Field Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `config` | ForeignKey(ReportConfig) | Configuration reference | Yes |
| `tenant` | ForeignKey(Tenant) | Tenant isolation | Yes |
| `generated_at` | DateTimeField | Generation timestamp | Yes (auto) |
| `generated_by` | ForeignKey(User) | Generator user | No |
| `cache_key` | CharField(255) | Cache identifier | Yes |
| `expires_at` | DateTimeField | Cache expiration | No |

### Model Structure

```
ReportResult Model:
├── Relationships
│   ├── config (ForeignKey to ReportConfig)
│   ├── tenant (ForeignKey to Tenant)
│   └── generated_by (ForeignKey to User)
├── Generation Tracking
│   ├── generated_at (DateTimeField)
│   ├── cache_key (CharField)
│   └── expires_at (DateTimeField)
├── Report Data (Task 14)
│   ├── data (JSONField)
│   ├── format (CharField)
│   └── file_path (CharField)
└── Metadata (Task 15)
    ├── generation_time (DurationField)
    ├── row_count (IntegerField)
    └── file_size (IntegerField)
```

### Cache Key Strategy

| Component | Format | Example |
|-----------|--------|---------|
| **Prefix** | "report" | report |
| **Tenant ID** | UUID hex | abc123def456 |
| **Report Type** | Enum value | TRIAL_BALANCE |
| **Period** | Date range or as_of | 20260101-20260131 |
| **Detail Level** | Enum value | SUMMARY |
| **Version** | Cache version | v1 |

Full cache key: `report:abc123:TRIAL_BALANCE:20260131:SUMMARY:v1`

### Cache Expiration Strategy

| Report Type | Default Expiry | Reason |
|-------------|---------------|---------|
| **Trial Balance** | 24 hours | Daily close changes balances |
| **Profit & Loss** | 24 hours | New transactions affect totals |
| **Balance Sheet** | 24 hours | Asset/liability changes |
| **Cash Flow** | 24 hours | Cash movements daily |
| **General Ledger** | 1 hour | Transaction-level detail |

### Model Meta Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| `verbose_name` | `'Report Result'` | Admin display name |
| `verbose_name_plural` | `'Report Results'` | Admin plural name |
| `ordering` | `['-generated_at']` | Newest first |
| `indexes` | `cache_key, tenant, config, generated_at` | Query optimization |
| `unique_together` | `None` | Allow multiple results per config |

### Cache Validation Logic

```
Cache Validation:
├── Check cache_key matches request
├── Check expires_at > now (if set)
├── Check tenant matches current
├── Check config parameters unchanged
└── Return result if all valid
```

### Expected Outcome
- ReportResult model defined with core fields
- Tenant-aware with proper isolation
- Cache key strategy implemented
- Foundation for data and metadata fields
- Ready for report storage

### Verification Checklist
- [ ] `report_result.py` file created in `models/` directory
- [ ] ReportResult class defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] Relationship fields defined (config, tenant, generated_by)
- [ ] Generation tracking fields added
- [ ] Cache key and expiry fields added
- [ ] Model Meta class configured
- [ ] Database indexes specified

---

## Task 14: Add Result Data Fields

### Overview
Add data storage fields to the ReportResult model to store the actual report output in multiple formats. These fields enable flexible storage of report data as JSON, support multiple export formats, and optionally store file references for large reports.

### Dependencies
- Task 13: ReportResult model base structure created
- Understanding of JSON storage in Django
- Knowledge of report export formats

### Instructions

1. **Open ReportResult model**
   - Navigate to `apps/accounting/models/report_result.py`
   - Add data storage fields

2. **Add data JSONField**
   - Type: `JSONField`
   - Purpose: Store complete report data
   - Contains formatted output from format_output()
   - Allows complex nested structures

3. **Add format field**
   - Type: `CharField`
   - Purpose: Indicate primary data format
   - Choices: `JSON`, `PDF`, `EXCEL`, `CSV`
   - Max length: 10 characters
   - Default: `JSON`

4. **Add file_path field**
   - Type: `CharField`
   - Purpose: Store path to generated file (PDF, Excel)
   - Set `null=True, blank=True`
   - Max length: 500 characters
   - Used when report exported to file

5. **Add raw_data JSONField**
   - Type: `JSONField`
   - Purpose: Store unformatted data from get_data()
   - Set `null=True, blank=True`
   - Useful for re-formatting without regeneration
   - Can be large, consider storage implications

6. **Add success status field**
   - Type: `BooleanField`
   - Purpose: Indicate if generation succeeded
   - Default: `True`
   - Set to False if errors occurred

7. **Add error_message field**
   - Type: `TextField`
   - Purpose: Store error details if generation failed
   - Set `null=True, blank=True`
   - Helpful for debugging

### Data Field Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `data` | JSONField | Formatted report output | Yes |
| `format` | CharField(10) | Output format type | Yes |
| `file_path` | CharField(500) | File location (if exported) | No |
| `raw_data` | JSONField | Unformatted data | No |
| `success` | BooleanField | Generation status | Yes |
| `error_message` | TextField | Error details | No |

### Data Field Storage Examples

**JSON Data Structure:**
```
data = {
    'header': {
        'tenant_name': 'ABC Traders',
        'report_title': 'Trial Balance',
        'as_of_date': '2026-01-31'
    },
    'sections': [
        {
            'title': 'Assets',
            'rows': [...],
            'subtotal': '₨ 500,000.00'
        }
    ],
    'footer': {
        'totals': {...}
    }
}
```

**Format Field Values:**

| Value | Description | Use Case |
|-------|-------------|----------|
| `JSON` | Structured data | API responses, web display |
| `PDF` | Print-ready document | Formal reports, archival |
| `EXCEL` | Spreadsheet format | Analysis, manipulation |
| `CSV` | Comma-separated | Data import/export |

**File Path Examples:**

| Format | Path | Storage Location |
|--------|------|------------------|
| PDF | `/media/reports/tenant123/TB_20260131.pdf` | Local filesystem |
| Excel | `/media/reports/tenant123/PL_202601.xlsx` | Local filesystem |
| S3 | `s3://bucket/reports/tenant123/BS_20260131.pdf` | Cloud storage |

### Storage Size Considerations

| Report Type | Typical JSON Size | With Raw Data | PDF Size |
|-------------|------------------|---------------|----------|
| **Trial Balance** | 50 KB | 100 KB | 200 KB |
| **Profit & Loss** | 30 KB | 60 KB | 150 KB |
| **Balance Sheet** | 40 KB | 80 KB | 180 KB |
| **Cash Flow** | 35 KB | 70 KB | 160 KB |
| **General Ledger** | 500 KB | 1 MB | 2 MB |

**Storage Strategy:**
- Store formatted data (JSON) always
- Store raw_data only for complex reports
- Generate files on-demand for PDF/Excel
- Cache file paths for quick download

### Success/Error Handling

| Status | Fields Set | Use Case |
|--------|-----------|----------|
| **Success** | success=True, data populated | Normal generation |
| **Partial Success** | success=True, error_message contains warnings | Some data unavailable |
| **Failure** | success=False, error_message contains error | Generation failed |

### Example Error Messages

| Error Type | Message | Action |
|------------|---------|--------|
| **Data Error** | "No transactions found for period" | Inform user, show empty report |
| **Calculation Error** | "Account 1000: Unable to calculate balance" | Show partial data with note |
| **Timeout** | "Report generation timed out after 60s" | Suggest narrower date range |
| **Permission Error** | "Insufficient permissions to access account data" | Check user permissions |

### Expected Outcome
- Data storage fields added to ReportResult
- Support for multiple output formats
- File reference capability for exports
- Error tracking for failed generations
- Flexible storage strategy

### Verification Checklist
- [ ] `data` JSONField added
- [ ] `format` CharField added with choices
- [ ] `file_path` CharField added (nullable)
- [ ] `raw_data` JSONField added (nullable)
- [ ] `success` BooleanField added
- [ ] `error_message` TextField added (nullable)
- [ ] Default values set appropriately

---

## Task 15: Add Result Metadata

### Overview
Add metadata fields to the ReportResult model to track report generation performance, size, and other operational metrics. These fields enable monitoring, optimization, and audit trail capabilities.

### Dependencies
- Task 13: ReportResult model base structure created
- Task 14: Data fields added
- Understanding of performance monitoring

### Instructions

1. **Open ReportResult model**
   - Navigate to `apps/accounting/models/report_result.py`
   - Add metadata fields

2. **Add generation_time field**
   - Type: `DurationField`
   - Purpose: Track how long generation took
   - Set `null=True`
   - Measured in seconds/milliseconds
   - Helpful for performance monitoring

3. **Add row_count field**
   - Type: `IntegerField`
   - Purpose: Number of data rows in report
   - Set `default=0`
   - Indicates report size/complexity

4. **Add file_size field**
   - Type: `IntegerField`
   - Purpose: Size of generated file in bytes
   - Set `null=True, blank=True`
   - Only applicable when file exported

5. **Add query_count field**
   - Type: `IntegerField`
   - Purpose: Number of database queries executed
   - Set `null=True`
   - Helpful for query optimization

6. **Add parameters_hash field**
   - Type: `CharField`
   - Purpose: Hash of config parameters for quick comparison
   - Max length: 64 characters
   - Used for cache invalidation

7. **Add version field**
   - Type: `CharField`
   - Purpose: Report generator version
   - Max length: 20 characters
   - Helps track format changes over time

8. **Add methods for statistics**
   - `get_formatted_generation_time()`: Human-readable duration
   - `get_formatted_file_size()`: Human-readable size (KB, MB)
   - `is_expired()`: Check if cache expired

### Metadata Field Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `generation_time` | DurationField | Generation duration | No |
| `row_count` | IntegerField | Number of rows | Yes |
| `file_size` | IntegerField | File size (bytes) | No |
| `query_count` | IntegerField | DB queries executed | No |
| `parameters_hash` | CharField(64) | Config hash | Yes |
| `version` | CharField(20) | Generator version | Yes |

### Performance Metrics

| Metric | Good | Acceptable | Needs Optimization |
|--------|------|------------|-------------------|
| **Generation Time** | < 2s | 2-5s | > 5s |
| **Query Count** | < 10 | 10-50 | > 50 |
| **Row Count** | < 1000 | 1000-5000 | > 5000 |
| **File Size** | < 1 MB | 1-5 MB | > 5 MB |

### Generation Time Formatting

| Duration | Format | Display |
|----------|--------|---------|
| < 1s | Milliseconds | 250 ms |
| 1-60s | Seconds | 5.2 seconds |
| 1-60m | Minutes:Seconds | 2:30 minutes |
| > 60m | Hours:Minutes | 1:15 hours |

### File Size Formatting

| Size | Format | Display |
|------|--------|---------|
| < 1 KB | Bytes | 512 bytes |
| 1 KB - 1 MB | Kilobytes | 256 KB |
| 1 MB - 1 GB | Megabytes | 5.2 MB |
| > 1 GB | Gigabytes | 1.5 GB |

### Parameters Hash Strategy

```
Parameters Hash Calculation:
1. Collect config parameters:
   ├── report_type
   ├── period_type
   ├── start_date, end_date (or as_of_date)
   ├── detail_level
   ├── include_comparison
   └── comparison dates (if applicable)
2. Serialize to JSON string
3. Calculate SHA256 hash
4. Store first 64 characters
5. Use for cache comparison
```

### Version Tracking

| Version Format | Example | Purpose |
|----------------|---------|---------|
| **Semantic Version** | v1.0.0 | Major.Minor.Patch |
| **Date-based** | 20260125 | YYYYMMDD |
| **Git Hash** | abc123d | Commit reference |

### Utility Methods

**get_formatted_generation_time():**
```
Input: timedelta(seconds=5.234)
Output: "5.23 seconds"

Input: timedelta(seconds=125)
Output: "2:05 minutes"
```

**get_formatted_file_size():**
```
Input: 256000 bytes
Output: "250 KB"

Input: 5242880 bytes
Output: "5.0 MB"
```

**is_expired():**
```
Check Logic:
├── If expires_at is None: return False (never expires)
├── If expires_at > now: return False (still valid)
└── If expires_at <= now: return True (expired)
```

### Monitoring and Alerts

| Condition | Alert Level | Action |
|-----------|------------|--------|
| **Generation time > 10s** | Warning | Review query optimization |
| **Query count > 100** | Warning | Check for N+1 queries |
| **File size > 10 MB** | Info | Consider pagination |
| **Repeated failures** | Error | Investigate error_message |

### Expected Outcome
- Metadata fields added to ReportResult
- Performance tracking enabled
- Cache invalidation support
- Version tracking implemented
- Utility methods for formatting
- Ready for production monitoring

### Verification Checklist
- [ ] `generation_time` DurationField added
- [ ] `row_count` IntegerField added
- [ ] `file_size` IntegerField added (nullable)
- [ ] `query_count` IntegerField added (nullable)
- [ ] `parameters_hash` CharField added
- [ ] `version` CharField added
- [ ] Utility methods implemented
- [ ] Default values set appropriately

---

## Task 16: Run Report Migrations

### Overview
Create and run Django migrations for the ReportConfig and ReportResult models, establishing the database schema for the financial reporting system. This task finalizes the report framework infrastructure.

### Dependencies
- Task 04: ReportConfig model complete
- Task 13: ReportResult model complete
- All model fields defined and configured
- Django migration system understanding

### Instructions

1. **Update models package**
   - Open `apps/accounting/models/__init__.py`
   - Import ReportConfig from `report_config`
   - Import ReportResult from `report_result`
   - Add to `__all__` list for package exports

2. **Verify model imports**
   - Ensure no circular import issues
   - Check all ForeignKey references resolve
   - Verify enum imports work correctly

3. **Create migrations**
   - Run command: `python manage.py makemigrations accounting`
   - Django will detect new models
   - Review generated migration file
   - Verify field types and constraints

4. **Review migration file**
   - Check migration is named appropriately
   - Verify all fields included
   - Check indexes are created
   - Verify foreign key relationships

5. **Run migrations**
   - Run command: `python manage.py migrate accounting`
   - Apply changes to database
   - Creates ReportConfig and ReportResult tables
   - Creates necessary indexes

6. **Verify database schema**
   - Check tables created: `accounting_reportconfig`, `accounting_reportresult`
   - Verify columns match model fields
   - Check indexes created correctly
   - Verify foreign key constraints

7. **Test model creation**
   - Create test ReportConfig instance
   - Verify save and retrieval works
   - Test ReportResult creation
   - Verify relationships work

8. **Update admin interface**
   - Register models in admin (if not already done)
   - Test admin interface access
   - Verify fields display correctly

### Migration Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `makemigrations` | Create migration files | After model changes |
| `migrate` | Apply migrations | To update database |
| `showmigrations` | List migration status | Check what's applied |
| `sqlmigrate` | View SQL for migration | Review before applying |

### Expected Migration File

**Filename:** `0017_reportconfig_reportresult.py`

**Contents Overview:**
- CreateModel operation for ReportConfig
- CreateModel operation for ReportResult
- AddIndex operations for performance
- ForeignKey relationships defined

### Database Tables Created

**accounting_reportconfig:**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR(200) | NOT NULL |
| report_type | VARCHAR(20) | NOT NULL |
| period_type | VARCHAR(15) | NOT NULL |
| start_date | DATE | NULL |
| end_date | DATE | NULL |
| as_of_date | DATE | NULL |
| fiscal_year | INTEGER | NULL |
| include_comparison | BOOLEAN | NOT NULL |
| comparison_period_type | VARCHAR(15) | NULL |
| comparison_start_date | DATE | NULL |
| comparison_end_date | DATE | NULL |
| comparison_as_of_date | DATE | NULL |
| detail_level | VARCHAR(15) | NOT NULL |
| include_zero_balances | BOOLEAN | NOT NULL |
| tenant_id | UUID | Foreign Key, NOT NULL |
| is_active | BOOLEAN | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

**accounting_reportresult:**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| config_id | UUID | Foreign Key, NOT NULL |
| tenant_id | UUID | Foreign Key, NOT NULL |
| generated_at | TIMESTAMP | NOT NULL |
| generated_by_id | UUID | Foreign Key, NULL |
| cache_key | VARCHAR(255) | NOT NULL, Indexed |
| expires_at | TIMESTAMP | NULL |
| data | JSONB | NOT NULL |
| format | VARCHAR(10) | NOT NULL |
| file_path | VARCHAR(500) | NULL |
| raw_data | JSONB | NULL |
| success | BOOLEAN | NOT NULL |
| error_message | TEXT | NULL |
| generation_time | INTERVAL | NULL |
| row_count | INTEGER | NOT NULL |
| file_size | INTEGER | NULL |
| query_count | INTEGER | NULL |
| parameters_hash | VARCHAR(64) | NOT NULL |
| version | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### Indexes Created

| Table | Index Name | Columns | Purpose |
|-------|-----------|---------|---------|
| reportconfig | idx_rc_tenant | tenant_id | Tenant filtering |
| reportconfig | idx_rc_type | report_type | Report type queries |
| reportconfig | idx_rc_active | is_active | Active configs |
| reportresult | idx_rr_cache | cache_key | Cache lookups |
| reportresult | idx_rr_tenant | tenant_id | Tenant filtering |
| reportresult | idx_rr_config | config_id | Config relationship |
| reportresult | idx_rr_generated | generated_at | Time-based queries |

### Verification Steps

```
Verification Checklist:
1. Import Models
   ├── from apps.accounting.models import ReportConfig, ReportResult
   └── No import errors
2. Create ReportConfig
   ├── config = ReportConfig(name="Test", report_type="TRIAL_BALANCE", ...)
   ├── config.save()
   └── Verify saved: ReportConfig.objects.count() > 0
3. Create ReportResult
   ├── result = ReportResult(config=config, data={...}, ...)
   ├── result.save()
   └── Verify relationship: config.results.count() > 0
4. Query Tests
   ├── Test filtering by tenant
   ├── Test filtering by report type
   └── Test cache_key lookup
5. Admin Interface
   ├── Access /admin/accounting/reportconfig/
   ├── Access /admin/accounting/reportresult/
   └── Verify CRUD operations work
```

### Expected Outcome
- Migration files created successfully
- Database schema updated
- Tables and indexes created
- Models importable and functional
- Ready for report generator implementations
- Admin interface accessible

### Verification Checklist
- [ ] Models imported in `models/__init__.py`
- [ ] Migration file created: `0017_reportconfig_reportresult.py`
- [ ] Migration applied successfully
- [ ] Tables exist in database
- [ ] Indexes created correctly
- [ ] Foreign key constraints in place
- [ ] Test instances can be created and saved
- [ ] Admin interface accessible
- [ ] No migration errors or warnings

---

## Summary

This document completed the report framework foundation:

- **BaseReportGenerator Abstract Class:** Template Method pattern for consistent report generation
- **Abstract Methods:** get_data() and format_output() for subclass implementation
- **Helper Methods:** Currency formatting, variance calculation, date ranges, account filtering
- **ReportResult Model:** Complete caching and audit trail model with:
  - Data storage (JSON, files)
  - Metadata tracking (performance, size)
  - Cache management (keys, expiration)
- **Database Migrations:** Schema created and applied

The financial reporting framework is now ready for specific report generator implementations (Trial Balance, Profit & Loss, Balance Sheet, Cash Flow, General Ledger).
