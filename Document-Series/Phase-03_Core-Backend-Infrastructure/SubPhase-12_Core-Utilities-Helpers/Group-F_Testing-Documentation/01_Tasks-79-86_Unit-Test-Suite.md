# Tasks 79-86: Unit Test Suite

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Sri-Lanka-Utilities/03_Tasks-76-78_Administrative-Divisions.md](../Group-E_Sri-Lanka-Utilities/03_Tasks-76-78_Administrative-Divisions.md)
- **→ Next Document:** [02_Tasks-87-92_Documentation-Suite.md](02_Tasks-87-92_Documentation-Suite.md)

---

## Document Overview

This document covers comprehensive unit testing for all utility modules created in Groups A-E.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create tests/utilities Module | Low |
| 80 | Write Pagination Tests | Medium |
| 81 | Write Filter Backend Tests | High |
| 82 | Write Validator Tests | Medium |
| 83 | Write DateTime Helper Tests | Medium |
| 84 | Write Currency Tests | Medium |
| 85 | Write Phone/NIC Tests | High |
| 86 | Write Administrative Division Tests | Low |

---

## Task 79: Create tests/utilities Module

### Instructions
1. Navigate to `backend/apps/core/tests/`
2. Create `utilities/` subdirectory
3. Create `__init__.py` in utilities/
4. Create test file structure

### Test Module Structure
```
backend/apps/core/tests/
└── utilities/
    ├── __init__.py
    ├── test_pagination.py
    ├── test_filters.py
    ├── test_validators.py
    ├── test_datetime.py
    └── test_srilanka.py
```

### Instructions
- Each test file corresponds to a utility module
- Use Django TestCase and DRF APITestCase
- Import utilities from backend.apps.core.*

### Verification Checklist
- [ ] tests/utilities/ directory created
- [ ] __init__.py with docstring
- [ ] Test file structure prepared

---

## Task 80: Write Pagination Tests

### Instructions
Create comprehensive tests for pagination classes in `test_pagination.py`.

### Test File Structure
```python
from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory
from backend.apps.core.pagination import (
    StandardPagination,
    CursorPagination,
    LimitOffsetPagination,
    NoPagination,
)

class PaginationTestCase(APITestCase):
    """Tests for pagination classes."""
    
    def setUp(self):
        """Set up test data."""
        self.factory = APIRequestFactory()
        # Create sample data
        
    def test_standard_pagination_default_size(self):
        """Test StandardPagination with default page size."""
        # Instructions:
        # 1. Create paginator instance
        # 2. Create mock request with ?page=1
        # 3. Paginate queryset
        # 4. Assert page_size is 20 (default)
        # 5. Assert response includes count, next, previous, results
        
    def test_standard_pagination_custom_size(self):
        """Test StandardPagination with custom page size."""
        # Instructions:
        # 1. Request with ?page=1&page_size=10
        # 2. Assert page_size is 10
        # 3. Assert max_page_size limit enforced
        
    def test_cursor_pagination(self):
        """Test CursorPagination."""
        # Instructions:
        # 1. Create ordered queryset
        # 2. Paginate with cursor
        # 3. Assert cursor-based navigation works
        # 4. Assert results ordered correctly
        
    def test_limit_offset_pagination(self):
        """Test LimitOffsetPagination."""
        # Instructions:
        # 1. Request with ?limit=10&offset=0
        # 2. Assert correct slice returned
        # 3. Test offset navigation
        
    def test_no_pagination(self):
        """Test NoPagination returns all results."""
        # Instructions:
        # 1. Paginate with NoPagination
        # 2. Assert all records returned
        # 3. Assert no pagination metadata
```

### Test Scenarios
1. **StandardPagination:**
   - Default page size (20)
   - Custom page size via query param
   - Max page size limit (100)
   - Page out of range
   
2. **CursorPagination:**
   - Forward navigation
   - Backward navigation
   - Ordering maintained
   
3. **LimitOffsetPagination:**
   - Default limit (20)
   - Custom limit/offset
   - Max limit (100)
   
4. **NoPagination:**
   - Returns full queryset
   - No metadata

### Verification Checklist
- [ ] test_pagination.py created
- [ ] All pagination classes tested
- [ ] Edge cases covered

---

## Task 81: Write Filter Backend Tests

### Instructions
Create comprehensive tests for filter backends in `test_filters.py`.

### Test File Structure
```python
from django.test import TestCase
from django.contrib.auth import get_user_model
from backend.apps.core.filters import (
    TenantFilterBackend,
    DateRangeFilterBackend,
    SearchFilterBackend,
    OrderingFilterBackend,
    IsActiveFilterBackend,
    CreatedByFilterBackend,
    ModifiedAtFilterBackend,
    BaseFilterSet,
)
from backend.apps.tenants.models import Tenant

User = get_user_model()

class FilterBackendTestCase(TestCase):
    """Tests for custom filter backends."""
    
    def setUp(self):
        """Set up test data."""
        # Create tenants
        self.tenant1 = Tenant.objects.create(name="Tenant 1", domain="tenant1")
        self.tenant2 = Tenant.objects.create(name="Tenant 2", domain="tenant2")
        
        # Create test records for each tenant
        # ...
        
    def test_tenant_filter_backend(self):
        """Test TenantFilterBackend isolates tenant data."""
        # Instructions:
        # 1. Set request.tenant to tenant1
        # 2. Apply TenantFilterBackend
        # 3. Assert only tenant1 records returned
        # 4. Switch to tenant2, assert isolation
        
    def test_date_range_filter(self):
        """Test DateRangeFilterBackend."""
        # Instructions:
        # 1. Request with ?start_date=2024-01-01&end_date=2024-12-31
        # 2. Apply filter
        # 3. Assert records within date range
        # 4. Test single date (start_date only)
        
    def test_search_filter(self):
        """Test SearchFilterBackend."""
        # Instructions:
        # 1. Configure search_fields
        # 2. Request with ?search=keyword
        # 3. Assert records matching keyword in specified fields
        # 4. Test case-insensitive search
        
    def test_ordering_filter(self):
        """Test OrderingFilterBackend."""
        # Instructions:
        # 1. Request with ?ordering=created_at
        # 2. Assert ascending order
        # 3. Request with ?ordering=-created_at
        # 4. Assert descending order
        
    def test_is_active_filter(self):
        """Test IsActiveFilterBackend."""
        # Instructions:
        # 1. Request with ?is_active=true
        # 2. Assert only active records
        # 3. Request with ?is_active=false
        # 4. Assert only inactive records
        
    def test_created_by_filter(self):
        """Test CreatedByFilterBackend."""
        # Instructions:
        # 1. Create records by different users
        # 2. Request with ?created_by=user_id
        # 3. Assert only records created by that user
        
    def test_base_filterset(self):
        """Test BaseFilterSet common fields."""
        # Instructions:
        # 1. Use BaseFilterSet as parent for custom filterset
        # 2. Assert common filters available: is_active, created_at, etc.
        # 3. Test filter combinations
```

### Test Scenarios
1. **TenantFilterBackend:**
   - Tenant isolation
   - Multi-tenant data separation
   
2. **DateRangeFilterBackend:**
   - Both start_date and end_date
   - Only start_date
   - Only end_date
   - Invalid dates
   
3. **SearchFilterBackend:**
   - Single field search
   - Multiple fields
   - Case-insensitive
   
4. **OrderingFilterBackend:**
   - Ascending order
   - Descending order
   - Multiple fields
   
5. **BaseFilterSet:**
   - Common fields inheritance
   - Filter combinations

### Verification Checklist
- [ ] test_filters.py created
- [ ] All filter backends tested
- [ ] Tenant isolation verified

---

## Task 82: Write Validator Tests

### Instructions
Create comprehensive tests for validators in `test_validators.py`.

### Test File Structure
```python
from django.test import TestCase
from django.core.exceptions import ValidationError
from backend.apps.core.validators import (
    EmailValidator,
    URLValidator,
    SlugValidator,
    PositiveNumberValidator,
    DecimalValidator,
    PercentageValidator,
    FileSizeValidator,
    ImageDimensionValidator,
    FileExtensionValidator,
    JSONValidator,
    NoHTMLValidator,
    UniqueForTenantValidator,
)

class ValidatorTestCase(TestCase):
    """Tests for custom validators."""
    
    def test_email_validator(self):
        """Test EmailValidator."""
        # Instructions:
        # 1. Test valid emails: user@example.com, user+tag@domain.co.uk
        # 2. Test invalid emails: invalid, @example.com, user@
        # 3. Assert ValidationError raised for invalid
        
    def test_url_validator(self):
        """Test URLValidator."""
        # Instructions:
        # 1. Test valid URLs: https://example.com, http://sub.domain.com/path
        # 2. Test invalid URLs: not-a-url, ftp://example.com
        # 3. Assert protocol validation
        
    def test_slug_validator(self):
        """Test SlugValidator."""
        # Instructions:
        # 1. Test valid slugs: valid-slug, slug_123, 123-slug
        # 2. Test invalid slugs: Invalid Slug, slug!, UPPERCASE
        # 3. Assert lowercase, hyphens, underscores only
        
    def test_positive_number_validator(self):
        """Test PositiveNumberValidator."""
        # Instructions:
        # 1. Test positive numbers: 1, 100, 0.5
        # 2. Test zero (should pass or fail based on config)
        # 3. Test negative numbers: -1, -100
        # 4. Assert ValidationError for negative
        
    def test_decimal_validator(self):
        """Test DecimalValidator."""
        # Instructions:
        # 1. Test valid decimals: 10.50, 100.00, 1234.56
        # 2. Test invalid decimals: 10.567 (too many decimals), 12345678 (too large)
        # 3. Assert max_digits and decimal_places enforced
        
    def test_percentage_validator(self):
        """Test PercentageValidator."""
        # Instructions:
        # 1. Test valid percentages: 0, 50, 100
        # 2. Test invalid percentages: -10, 101, 150
        # 3. Assert range 0-100
        
    def test_file_size_validator(self):
        """Test FileSizeValidator."""
        # Instructions:
        # 1. Create mock file with size
        # 2. Test file within limit (5MB)
        # 3. Test file exceeding limit (10MB > 5MB limit)
        # 4. Assert ValidationError for oversized files
        
    def test_image_dimension_validator(self):
        """Test ImageDimensionValidator."""
        # Instructions:
        # 1. Create mock image with dimensions
        # 2. Test image within max dimensions (1920x1080)
        # 3. Test image exceeding dimensions
        # 4. Assert ValidationError for oversized images
        
    def test_file_extension_validator(self):
        """Test FileExtensionValidator."""
        # Instructions:
        # 1. Configure allowed extensions: ['.jpg', '.png', '.pdf']
        # 2. Test valid extensions
        # 3. Test invalid extensions: .exe, .bat
        # 4. Assert ValidationError for disallowed extensions
        
    def test_json_validator(self):
        """Test JSONValidator."""
        # Instructions:
        # 1. Test valid JSON strings: '{"key": "value"}', '[]'
        # 2. Test invalid JSON: '{invalid}', 'not json'
        # 3. Assert ValidationError for malformed JSON
        
    def test_no_html_validator(self):
        """Test NoHTMLValidator."""
        # Instructions:
        # 1. Test plain text (should pass)
        # 2. Test HTML: '<script>alert("XSS")</script>', '<p>text</p>'
        # 3. Assert ValidationError for HTML tags
        
    def test_unique_for_tenant_validator(self):
        """Test UniqueForTenantValidator."""
        # Instructions:
        # 1. Create record in tenant1 with name="Test"
        # 2. Attempt to create another with same name in tenant1
        # 3. Assert ValidationError (duplicate in tenant)
        # 4. Create with same name in tenant2 (should pass)
```

### Test Scenarios
- Valid and invalid inputs for each validator
- Edge cases (empty, null, boundary values)
- Error messages customization

### Verification Checklist
- [ ] test_validators.py created
- [ ] All validators tested
- [ ] Edge cases covered

---

## Task 83: Write DateTime Helper Tests

### Instructions
Create comprehensive tests for datetime helpers in `test_datetime.py`.

### Test File Structure
```python
from django.test import TestCase
from datetime import datetime, date, timedelta
from backend.apps.core.datetime_helpers import (
    get_local_now,
    convert_to_utc,
    convert_to_local,
    get_date_range,
    get_today,
    get_week_start_end,
    get_month_start_end,
    get_quarter_start_end,
    format_date_sl,
    parse_date_sl,
)

class DateTimeHelperTestCase(TestCase):
    """Tests for datetime helper functions."""
    
    def test_get_local_now(self):
        """Test get_local_now returns Asia/Colombo time."""
        # Instructions:
        # 1. Call get_local_now()
        # 2. Assert timezone is Asia/Colombo (UTC+5:30)
        # 3. Compare with UTC time (should be +5:30)
        
    def test_convert_to_utc(self):
        """Test convert_to_utc."""
        # Instructions:
        # 1. Create local datetime (2024-01-01 10:00 Asia/Colombo)
        # 2. Convert to UTC
        # 3. Assert UTC time is 04:30 (10:00 - 5:30)
        
    def test_convert_to_local(self):
        """Test convert_to_local."""
        # Instructions:
        # 1. Create UTC datetime (2024-01-01 04:30 UTC)
        # 2. Convert to Asia/Colombo
        # 3. Assert local time is 10:00 (04:30 + 5:30)
        
    def test_get_date_range(self):
        """Test get_date_range."""
        # Instructions:
        # 1. Get range for 'today'
        # 2. Assert start and end are same date
        # 3. Get range for 'week', 'month', 'year'
        # 4. Assert correct ranges
        
    def test_get_week_start_end(self):
        """Test get_week_start_end."""
        # Instructions:
        # 1. Get week range for date (e.g., 2024-01-15)
        # 2. Assert start is Monday
        # 3. Assert end is Sunday
        
    def test_get_month_start_end(self):
        """Test get_month_start_end."""
        # Instructions:
        # 1. Get month range for January 2024
        # 2. Assert start is 2024-01-01
        # 3. Assert end is 2024-01-31
        
    def test_get_quarter_start_end(self):
        """Test get_quarter_start_end."""
        # Instructions:
        # 1. Get Q1 range (date in Jan-Mar)
        # 2. Assert start is Jan 1, end is Mar 31
        # 3. Test all quarters
        
    def test_format_date_sl(self):
        """Test format_date_sl (DD/MM/YYYY)."""
        # Instructions:
        # 1. Format date(2024, 1, 15)
        # 2. Assert output is "15/01/2024"
        # 3. Test edge cases (leap year, month boundaries)
        
    def test_parse_date_sl(self):
        """Test parse_date_sl."""
        # Instructions:
        # 1. Parse "15/01/2024"
        # 2. Assert returns date(2024, 1, 15)
        # 3. Test invalid formats: "2024-01-15", "32/01/2024"
        # 4. Assert ValidationError for invalid
```

### Test Scenarios
- Timezone conversions (UTC ↔ Asia/Colombo)
- Date range calculations
- Sri Lankan date formatting (DD/MM/YYYY)

### Verification Checklist
- [ ] test_datetime.py created
- [ ] All datetime helpers tested
- [ ] Timezone handling verified

---

## Task 84: Write Currency Tests

### Instructions
Create tests for currency utilities in `test_srilanka.py` (currency section).

### Test Structure
```python
from django.test import TestCase
from decimal import Decimal
from backend.apps.core.srilanka import (
    format_lkr,
    parse_lkr,
    convert_currency,
)

class CurrencyTestCase(TestCase):
    """Tests for LKR currency utilities."""
    
    def test_format_lkr_basic(self):
        """Test format_lkr with basic amounts."""
        # Instructions:
        # 1. Format 1500.00
        # 2. Assert output is "Rs. 1,500.00"
        # 3. Format 1234567.89
        # 4. Assert output is "Rs. 1,234,567.89"
        
    def test_format_lkr_zero(self):
        """Test format_lkr with zero."""
        # Instructions:
        # 1. Format 0
        # 2. Assert output is "Rs. 0.00"
        
    def test_format_lkr_negative(self):
        """Test format_lkr with negative amounts."""
        # Instructions:
        # 1. Format -500.00
        # 2. Assert output is "Rs. -500.00" or "(Rs. 500.00)"
        # 3. Verify negative formatting convention
        
    def test_parse_lkr_basic(self):
        """Test parse_lkr with formatted strings."""
        # Instructions:
        # 1. Parse "Rs. 1,500.00"
        # 2. Assert returns Decimal('1500.00')
        # 3. Parse "Rs. 1,234,567.89"
        # 4. Assert returns Decimal('1234567.89')
        
    def test_parse_lkr_invalid(self):
        """Test parse_lkr with invalid inputs."""
        # Instructions:
        # 1. Parse invalid strings: "not a number", "USD 100"
        # 2. Assert raises ValueError or returns None
        
    def test_convert_currency_placeholder(self):
        """Test convert_currency placeholder."""
        # Instructions:
        # 1. Attempt conversion (LKR to USD)
        # 2. Assert returns None or placeholder message
        # 3. Note: Full implementation in Phase 09
```

### Test Scenarios
- Valid currency amounts
- Zero and negative amounts
- Large amounts with comma separators
- Parsing formatted strings
- Invalid inputs

### Verification Checklist
- [ ] Currency tests added to test_srilanka.py
- [ ] All currency functions tested
- [ ] Edge cases covered

---

## Task 85: Write Phone/NIC Tests

### Instructions
Create tests for phone and NIC utilities in `test_srilanka.py` (phone/NIC section).

### Test Structure
```python
from backend.apps.core.srilanka import (
    validate_sl_phone,
    format_sl_phone,
    normalize_sl_phone,
    validate_nic,
    parse_nic_dob,
)
from datetime import date

class PhoneTestCase(TestCase):
    """Tests for SL phone utilities."""
    
    def test_validate_sl_phone_valid(self):
        """Test validate_sl_phone with valid numbers."""
        # Instructions:
        # 1. Test valid formats:
        #    - "+94 71 234 5678"
        #    - "+94712345678"
        #    - "0712345678"
        #    - "712345678"
        # 2. Assert all return True
        
    def test_validate_sl_phone_invalid(self):
        """Test validate_sl_phone with invalid numbers."""
        # Instructions:
        # 1. Test invalid formats:
        #    - "1234567" (too short)
        #    - "0612345678" (landline, not mobile)
        #    - "+1 234 567 8900" (US number)
        # 2. Assert all return False
        
    def test_format_sl_phone(self):
        """Test format_sl_phone."""
        # Instructions:
        # 1. Format "0712345678"
        # 2. Assert output is "+94 71 234 5678"
        # 3. Test various input formats
        
    def test_normalize_sl_phone(self):
        """Test normalize_sl_phone."""
        # Instructions:
        # 1. Normalize "0712345678"
        # 2. Assert output is "+94712345678"
        # 3. Test various input formats
        
class NICTestCase(TestCase):
    """Tests for SL NIC utilities."""
    
    def test_validate_nic_old_format(self):
        """Test validate_nic with old format."""
        # Instructions:
        # 1. Test valid old NICs: "881234567V", "896234567X"
        # 2. Assert return True
        # 3. Test invalid: "001234567V" (invalid day)
        # 4. Assert return False
        
    def test_validate_nic_new_format(self):
        """Test validate_nic with new format."""
        # Instructions:
        # 1. Test valid new NICs: "198812345678", "198962345678"
        # 2. Assert return True
        # 3. Test invalid: "190012345678" (invalid day)
        # 4. Assert return False
        
    def test_parse_nic_dob_old_format(self):
        """Test parse_nic_dob with old format."""
        # Instructions:
        # 1. Parse "881234567V"
        # 2. Assert DOB is 1988-05-03 (day 123)
        # 3. Assert gender is 'M'
        # 4. Parse "886234567X"
        # 5. Assert DOB is 1988-05-03 (day 623 = 123+500)
        # 6. Assert gender is 'F'
        
    def test_parse_nic_dob_new_format(self):
        """Test parse_nic_dob with new format."""
        # Instructions:
        # 1. Parse "199812345678"
        # 2. Assert DOB is 1998-05-03
        # 3. Assert gender is 'M'
```

### Test Scenarios
**Phone:**
- Valid mobile prefixes (70-78)
- Various formats (+94, 0, no prefix)
- Invalid prefixes/lengths

**NIC:**
- Old format (9 digits + V/X)
- New format (12 digits)
- Gender detection (day > 500)
- DOB extraction
- Invalid formats

### Verification Checklist
- [ ] Phone tests added
- [ ] NIC tests added
- [ ] All utilities tested

---

## Task 86: Write Administrative Division Tests

### Instructions
Create tests for provinces/districts in `test_srilanka.py` (admin section).

### Test Structure
```python
from backend.apps.core.srilanka import (
    PROVINCES,
    DISTRICTS,
    get_province_by_code,
    get_province_choices,
    get_districts_by_province,
    get_district_by_code,
    get_district_choices,
)

class AdministrativeDivisionTestCase(TestCase):
    """Tests for provinces and districts."""
    
    def test_provinces_count(self):
        """Test PROVINCES has 9 provinces."""
        # Instructions:
        # 1. Assert len(PROVINCES) == 9
        # 2. Assert all have 'code', 'name', 'sinhala' keys
        
    def test_districts_count(self):
        """Test DISTRICTS has 25 districts."""
        # Instructions:
        # 1. Assert len(DISTRICTS) == 25
        # 2. Assert all have 'code', 'name', 'sinhala', 'province' keys
        
    def test_get_province_by_code(self):
        """Test get_province_by_code."""
        # Instructions:
        # 1. Get province by code 'WP'
        # 2. Assert name is "Western Province"
        # 3. Test invalid code 'XX'
        # 4. Assert returns None
        
    def test_get_province_choices(self):
        """Test get_province_choices for Django forms."""
        # Instructions:
        # 1. Get choices
        # 2. Assert returns list of tuples: [('WP', 'Western Province'), ...]
        # 3. Assert 9 choices
        
    def test_get_districts_by_province(self):
        """Test get_districts_by_province."""
        # Instructions:
        # 1. Get districts for 'WP'
        # 2. Assert 3 districts: Colombo, Gampaha, Kalutara
        # 3. Test 'CP' (3 districts)
        # 4. Test 'NP' (5 districts)
        
    def test_get_district_by_code(self):
        """Test get_district_by_code."""
        # Instructions:
        # 1. Get district by code 'CO'
        # 2. Assert name is "Colombo"
        # 3. Assert province is 'WP'
        
    def test_get_district_choices(self):
        """Test get_district_choices."""
        # Instructions:
        # 1. Get choices without province filter
        # 2. Assert 25 choices
        # 3. Get choices for province 'WP'
        # 4. Assert 3 choices
```

### Test Scenarios
- Province count and structure
- District count and structure
- Helper function lookups
- Django choices format

### Verification Checklist
- [ ] Administrative division tests added
- [ ] All helper functions tested
- [ ] Data integrity verified

---

## Summary

### Tasks Completed
Tasks 79-86 complete (unit test suite).

### Test Coverage
- ✅ Pagination classes
- ✅ Filter backends
- ✅ Validators
- ✅ DateTime helpers
- ✅ Currency utilities
- ✅ Phone/NIC validation
- ✅ Administrative divisions

### Running Tests
```bash
# Run all utility tests
python manage.py test backend.apps.core.tests.utilities

# Run specific test file
python manage.py test backend.apps.core.tests.utilities.test_pagination
python manage.py test backend.apps.core.tests.utilities.test_filters
python manage.py test backend.apps.core.tests.utilities.test_validators
python manage.py test backend.apps.core.tests.utilities.test_datetime
python manage.py test backend.apps.core.tests.utilities.test_srilanka
```

### Next Steps
Proceed to [02_Tasks-87-92_Documentation-Suite.md](02_Tasks-87-92_Documentation-Suite.md) for comprehensive documentation of all utilities.

---

## Notes for AI Agents

1. **Test Isolation:** Each test should be independent
2. **Mock Data:** Use factories/fixtures for test data
3. **Coverage:** Aim for 90%+ code coverage
4. **Edge Cases:** Test boundary conditions, null, empty values
5. **Tenant Isolation:** Critical for multi-tenant tests
