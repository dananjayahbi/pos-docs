# Tasks 87-92: Documentation Suite

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-86_Unit-Test-Suite.md](01_Tasks-79-86_Unit-Test-Suite.md)
- **→ Next Document:** [03_Tasks-93-94_Integration-Phase-Completion.md](03_Tasks-93-94_Integration-Phase-Completion.md)

---

## Document Overview

This document covers comprehensive documentation for all utility modules with usage examples and API references.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 87 | Create Utilities README | Low |
| 88 | Document Pagination Usage | Medium |
| 89 | Document Filter Backend Usage | Medium |
| 90 | Document Validator Usage | Medium |
| 91 | Document DateTime Helper Usage | Medium |
| 92 | Document Sri Lanka Utilities Usage | Medium |

---

## Task 87: Create Utilities README

### Instructions
1. Create `backend/apps/core/README.md`
2. Document all utility modules
3. Add quick start guide

### README Structure
```markdown
# Core Utilities & Helpers

Comprehensive set of reusable utilities for LankaCommerce Cloud.

## Overview

This module provides:
- **Pagination:** DRF pagination classes
- **Filters:** Custom filter backends
- **Validators:** Data validation utilities
- **DateTime:** Timezone and date helpers
- **Sri Lanka:** Localization utilities

## Modules

### Pagination
Location: `backend.apps.core.pagination`

Classes:
- StandardPagination - Page number pagination (default)
- CursorPagination - Cursor-based pagination
- LimitOffsetPagination - Limit/offset pagination
- NoPagination - Disable pagination

### Filters
Location: `backend.apps.core.filters`

Backends:
- TenantFilterBackend - Tenant isolation
- DateRangeFilterBackend - Date range filtering
- SearchFilterBackend - Full-text search
- OrderingFilterBackend - Result ordering
- IsActiveFilterBackend - Active/inactive filtering
- BaseFilterSet - Common filter fields

### Validators
Location: `backend.apps.core.validators`

Validators:
- EmailValidator, URLValidator, SlugValidator
- FileSizeValidator, ImageDimensionValidator
- JSONValidator, NoHTMLValidator
- UniqueForTenantValidator

### DateTime Helpers
Location: `backend.apps.core.datetime_helpers`

Functions:
- Timezone conversion (UTC ↔ Asia/Colombo)
- Date range calculations
- Sri Lankan date formatting (DD/MM/YYYY)

### Sri Lanka Utilities
Location: `backend.apps.core.srilanka`

Features:
- Currency: LKR formatting (Rs. 1,500.00)
- Phone: SL mobile validation/formatting
- NIC: National ID validation with DOB extraction
- Administrative: 9 provinces, 25 districts

## Quick Start

### Installation
All utilities are available after Phase 03 setup.

### Basic Usage

**Pagination:**
```python
from rest_framework import viewsets
from backend.apps.core.pagination import StandardPagination

class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination
```

**Filters:**
```python
from backend.apps.core.filters import TenantFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [TenantFilterBackend]
```

**Validators:**
```python
from django.db import models
from backend.apps.core.validators import FileSizeValidator

class Document(models.Model):
    file = models.FileField(validators=[FileSizeValidator(5)])  # 5MB max
```

**DateTime:**
```python
from backend.apps.core.datetime_helpers import get_local_now, format_date_sl

now = get_local_now()  # Asia/Colombo timezone
formatted = format_date_sl(now.date())  # "15/01/2024"
```

**Sri Lanka:**
```python
from backend.apps.core.srilanka import format_lkr, validate_sl_phone

price = format_lkr(1500.00)  # "Rs. 1,500.00"
is_valid = validate_sl_phone("0712345678")  # True
```

## Testing

Run all tests:
```bash
python manage.py test backend.apps.core.tests.utilities
```

## Documentation

Detailed documentation for each module:
- See Task 88-92 documents below
- API reference in code docstrings
- Usage examples in tests
```

### Verification Checklist
- [ ] README.md created in backend/apps/core/
- [ ] All modules documented
- [ ] Quick start guide included

---

## Task 88: Document Pagination Usage

### Instructions
Add pagination documentation section to README or separate file.

### Documentation Content

#### StandardPagination
**Purpose:** Default page number-based pagination.

**Configuration:**
```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'backend.apps.core.pagination.StandardPagination',
    'PAGE_SIZE': 20,
}
```

**Usage in Views:**
```python
from rest_framework import viewsets
from backend.apps.core.pagination import StandardPagination

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = StandardPagination
```

**API Requests:**
```
GET /api/products/?page=1&page_size=10

Response:
{
    "count": 100,
    "next": "/api/products/?page=2",
    "previous": null,
    "results": [...]
}
```

**Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

---

#### CursorPagination
**Purpose:** Efficient pagination for large datasets with consistent ordering.

**Usage:**
```python
class OrderViewSet(viewsets.ModelViewSet):
    pagination_class = CursorPagination
    ordering = '-created_at'  # Required
```

**API Requests:**
```
GET /api/orders/

Response:
{
    "next": "/api/orders/?cursor=cD0yMDI0LTAx...",
    "previous": null,
    "results": [...]
}
```

**Advantages:**
- Consistent performance with large datasets
- Prevents duplicate results during pagination
- No page number drift with concurrent updates

**Limitations:**
- Cannot jump to specific page
- Requires stable ordering field

---

#### LimitOffsetPagination
**Purpose:** Offset-based pagination for flexible navigation.

**Usage:**
```python
class CategoryViewSet(viewsets.ModelViewSet):
    pagination_class = LimitOffsetPagination
```

**API Requests:**
```
GET /api/categories/?limit=10&offset=20

Response:
{
    "count": 100,
    "next": "/api/categories/?limit=10&offset=30",
    "previous": "/api/categories/?limit=10&offset=10",
    "results": [...]
}
```

**Parameters:**
- `limit`: Items to return (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

---

#### NoPagination
**Purpose:** Disable pagination for specific endpoints.

**Usage:**
```python
class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = NoPagination
```

**When to Use:**
- Small, static datasets
- Export endpoints
- Dropdown/select options

---

### Best Practices

1. **Default Pagination:** Use StandardPagination for most endpoints
2. **Large Datasets:** Use CursorPagination for tables with 10,000+ rows
3. **Exports:** Use NoPagination with permission checks
4. **Max Page Size:** Enforce max_page_size to prevent abuse
5. **Ordering:** Always specify ordering for consistent results

### Verification Checklist
- [ ] Pagination usage documented
- [ ] All classes covered
- [ ] Examples included

---

## Task 89: Document Filter Backend Usage

### Instructions
Document filter backend usage with examples.

### Documentation Content

#### TenantFilterBackend
**Purpose:** Automatic tenant isolation for multi-tenant models.

**Usage:**
```python
from backend.apps.core.filters import TenantFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [TenantFilterBackend]
    
    # Automatically filters by request.tenant
    # No additional code needed
```

**How It Works:**
1. Extracts tenant from request (set by middleware)
2. Filters queryset: `queryset.filter(tenant=request.tenant)`
3. Ensures data isolation between tenants

**Requirements:**
- Model must have `tenant` ForeignKey
- Tenant middleware must be active

---

#### DateRangeFilterBackend
**Purpose:** Filter results by date range.

**Usage:**
```python
from backend.apps.core.filters import DateRangeFilterBackend

class OrderViewSet(viewsets.ModelViewSet):
    filter_backends = [DateRangeFilterBackend]
    date_filter_field = 'created_at'  # Field to filter
```

**API Requests:**
```
GET /api/orders/?start_date=2024-01-01&end_date=2024-12-31
GET /api/orders/?start_date=2024-01-01  # From date onwards
GET /api/orders/?end_date=2024-12-31    # Up to date
```

**Configuration:**
- Set `date_filter_field` attribute
- Defaults to 'created_at' if not specified

---

#### SearchFilterBackend
**Purpose:** Full-text search across specified fields.

**Usage:**
```python
from backend.apps.core.filters import SearchFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilterBackend]
    search_fields = ['name', 'description', 'sku']
```

**API Requests:**
```
GET /api/products/?search=laptop
```

**Features:**
- Case-insensitive search
- Searches across multiple fields
- Uses Django's Q objects for OR queries

---

#### OrderingFilterBackend
**Purpose:** Allow client-side ordering of results.

**Usage:**
```python
from backend.apps.core.filters import OrderingFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [OrderingFilterBackend]
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']  # Default ordering
```

**API Requests:**
```
GET /api/products/?ordering=price           # Ascending
GET /api/products/?ordering=-price          # Descending
GET /api/products/?ordering=name,-price     # Multiple fields
```

---

#### IsActiveFilterBackend
**Purpose:** Filter by active/inactive status.

**Usage:**
```python
from backend.apps.core.filters import IsActiveFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [IsActiveFilterBackend]
```

**API Requests:**
```
GET /api/products/?is_active=true   # Active only
GET /api/products/?is_active=false  # Inactive only
GET /api/products/                  # All (default)
```

---

#### BaseFilterSet
**Purpose:** Reusable filterset with common fields.

**Usage:**
```python
from django_filters import rest_framework as filters
from backend.apps.core.filters import BaseFilterSet

class ProductFilterSet(BaseFilterSet):
    # Inherits: is_active, created_at, modified_at, created_by
    
    price_min = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    class Meta:
        model = Product
        fields = ['category', 'brand']
```

**API Requests:**
```
GET /api/products/?is_active=true&price_min=100&price_max=500&category=1
```

**Inherited Fields:**
- `is_active`: BooleanFilter
- `created_at`: DateFilter
- `created_at_after`, `created_at_before`: Date range
- `modified_at_after`, `modified_at_before`: Modified date range
- `created_by`: ForeignKey filter

---

### Combining Filters

**Example:** Multiple filter backends
```python
class ProductViewSet(viewsets.ModelViewSet):
    filter_backends = [
        TenantFilterBackend,      # Tenant isolation (always first)
        SearchFilterBackend,      # Full-text search
        OrderingFilterBackend,    # Client-side ordering
        IsActiveFilterBackend,    # Active status
    ]
    filterset_class = ProductFilterSet  # Additional filters
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
```

**API Request:**
```
GET /api/products/?search=laptop&is_active=true&ordering=-price&price_min=500
```

### Verification Checklist
- [ ] Filter backends documented
- [ ] Usage examples provided
- [ ] Combining filters explained

---

## Task 90: Document Validator Usage

### Instructions
Document validator usage with examples.

### Documentation Content

#### Basic Validators

**EmailValidator:**
```python
from django.db import models
from backend.apps.core.validators import EmailValidator

class Contact(models.Model):
    email = models.EmailField(validators=[EmailValidator()])
```

**URLValidator:**
```python
from backend.apps.core.validators import URLValidator

class Company(models.Model):
    website = models.URLField(validators=[URLValidator()])
```

**SlugValidator:**
```python
from backend.apps.core.validators import SlugValidator

class Product(models.Model):
    slug = models.SlugField(validators=[SlugValidator()])
```

---

#### Numeric Validators

**PositiveNumberValidator:**
```python
from backend.apps.core.validators import PositiveNumberValidator

class Product(models.Model):
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[PositiveNumberValidator()]
    )
```

**DecimalValidator:**
```python
from backend.apps.core.validators import DecimalValidator

class Invoice(models.Model):
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[DecimalValidator(max_digits=10, decimal_places=2)]
    )
```

**PercentageValidator:**
```python
from backend.apps.core.validators import PercentageValidator

class Discount(models.Model):
    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[PercentageValidator()]  # 0-100
    )
```

---

#### File Validators

**FileSizeValidator:**
```python
from backend.apps.core.validators import FileSizeValidator

class Document(models.Model):
    file = models.FileField(
        validators=[FileSizeValidator(max_size_mb=5)]
    )
```

**ImageDimensionValidator:**
```python
from backend.apps.core.validators import ImageDimensionValidator

class ProductImage(models.Model):
    image = models.ImageField(
        validators=[
            ImageDimensionValidator(
                max_width=1920,
                max_height=1080
            )
        ]
    )
```

**FileExtensionValidator:**
```python
from backend.apps.core.validators import FileExtensionValidator

class Attachment(models.Model):
    file = models.FileField(
        validators=[
            FileExtensionValidator(
                allowed_extensions=['.pdf', '.docx', '.xlsx']
            )
        ]
    )
```

---

#### Content Validators

**JSONValidator:**
```python
from backend.apps.core.validators import JSONValidator

class Configuration(models.Model):
    settings = models.TextField(validators=[JSONValidator()])
```

**NoHTMLValidator:**
```python
from backend.apps.core.validators import NoHTMLValidator

class Comment(models.Model):
    text = models.TextField(validators=[NoHTMLValidator()])
```

---

#### Tenant-Aware Validator

**UniqueForTenantValidator:**
```python
from backend.apps.core.validators import UniqueForTenantValidator

class Product(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    sku = models.CharField(
        max_length=50,
        validators=[
            UniqueForTenantValidator(
                model=Product,
                field='sku',
                tenant_field='tenant'
            )
        ]
    )
    
    class Meta:
        unique_together = [('tenant', 'sku')]
```

**Purpose:** Ensures uniqueness within tenant scope (not globally).

---

### Serializer Usage

**Example:** Use validators in DRF serializers
```python
from rest_framework import serializers
from backend.apps.core.validators import (
    EmailValidator,
    FileSizeValidator,
    NoHTMLValidator,
)

class ContactSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[EmailValidator()])
    message = serializers.CharField(validators=[NoHTMLValidator()])
    attachment = serializers.FileField(
        validators=[FileSizeValidator(max_size_mb=10)],
        required=False
    )
```

### Verification Checklist
- [ ] All validators documented
- [ ] Usage examples provided
- [ ] Model and serializer examples included

---

## Task 91: Document DateTime Helper Usage

### Instructions
Document datetime helper usage with examples.

### Documentation Content

#### Timezone Conversion

**get_local_now():**
```python
from backend.apps.core.datetime_helpers import get_local_now

# Get current time in Asia/Colombo timezone
now = get_local_now()
print(now)  # 2024-01-15 10:30:00+05:30
```

**convert_to_utc():**
```python
from backend.apps.core.datetime_helpers import convert_to_utc
from datetime import datetime

# Convert local time to UTC
local_time = datetime(2024, 1, 15, 10, 0, 0)  # 10:00 AM
utc_time = convert_to_utc(local_time)
print(utc_time)  # 2024-01-15 04:30:00+00:00
```

**convert_to_local():**
```python
from backend.apps.core.datetime_helpers import convert_to_local
from datetime import datetime

# Convert UTC to local time
utc_time = datetime(2024, 1, 15, 4, 30, 0)  # 04:30 UTC
local_time = convert_to_local(utc_time)
print(local_time)  # 2024-01-15 10:00:00+05:30
```

---

#### Date Ranges

**get_date_range():**
```python
from backend.apps.core.datetime_helpers import get_date_range

# Get today's range
start, end = get_date_range('today')

# Get this week's range
start, end = get_date_range('week')

# Get this month's range
start, end = get_date_range('month')

# Get this year's range
start, end = get_date_range('year')
```

**get_week_start_end():**
```python
from backend.apps.core.datetime_helpers import get_week_start_end
from datetime import date

# Get week range for a specific date
week_start, week_end = get_week_start_end(date(2024, 1, 15))
print(week_start)  # 2024-01-15 (Monday)
print(week_end)    # 2024-01-21 (Sunday)
```

**get_month_start_end():**
```python
from backend.apps.core.datetime_helpers import get_month_start_end

# Get month range
month_start, month_end = get_month_start_end(date(2024, 1, 15))
print(month_start)  # 2024-01-01
print(month_end)    # 2024-01-31
```

**get_quarter_start_end():**
```python
from backend.apps.core.datetime_helpers import get_quarter_start_end

# Get quarter range
q_start, q_end = get_quarter_start_end(date(2024, 2, 15))
print(q_start)  # 2024-01-01 (Q1 starts)
print(q_end)    # 2024-03-31 (Q1 ends)
```

---

#### Sri Lankan Date Formatting

**format_date_sl():**
```python
from backend.apps.core.datetime_helpers import format_date_sl
from datetime import date

# Format date in DD/MM/YYYY format
formatted = format_date_sl(date(2024, 1, 15))
print(formatted)  # "15/01/2024"
```

**parse_date_sl():**
```python
from backend.apps.core.datetime_helpers import parse_date_sl

# Parse DD/MM/YYYY string
parsed = parse_date_sl("15/01/2024")
print(parsed)  # date(2024, 1, 15)
```

---

### Common Use Cases

**1. Report Date Ranges:**
```python
from backend.apps.core.datetime_helpers import get_date_range

# Sales report for this month
start_date, end_date = get_date_range('month')
sales = Sale.objects.filter(
    date__gte=start_date,
    date__lte=end_date
)
```

**2. Display Dates to Users:**
```python
from backend.apps.core.datetime_helpers import format_date_sl

# Format invoice date
invoice_date = format_date_sl(invoice.created_at.date())
# Display: "15/01/2024" (Sri Lankan format)
```

**3. Store UTC, Display Local:**
```python
from backend.apps.core.datetime_helpers import convert_to_local

# Store created_at in UTC
order.created_at = timezone.now()  # UTC

# Display to user in local time
local_time = convert_to_local(order.created_at)
```

### Verification Checklist
- [ ] Datetime helpers documented
- [ ] Usage examples provided
- [ ] Common use cases included

---

## Task 92: Document Sri Lanka Utilities Usage

### Instructions
Document Sri Lanka utilities usage with examples.

### Documentation Content

#### Currency Formatting

**format_lkr():**
```python
from backend.apps.core.srilanka import format_lkr
from decimal import Decimal

# Format currency amounts
price = Decimal('1500.00')
formatted = format_lkr(price)
print(formatted)  # "Rs. 1,500.00"

large_amount = Decimal('1234567.89')
formatted = format_lkr(large_amount)
print(formatted)  # "Rs. 1,234,567.89"
```

**parse_lkr():**
```python
from backend.apps.core.srilanka import parse_lkr

# Parse formatted currency string
amount = parse_lkr("Rs. 1,500.00")
print(amount)  # Decimal('1500.00')
```

**Usage in Templates:**
```django
{% load srilanka_tags %}

<p>Price: {{ product.price|format_lkr }}</p>
<!-- Output: Price: Rs. 1,500.00 -->
```

---

#### Phone Validation & Formatting

**validate_sl_phone():**
```python
from backend.apps.core.srilanka import validate_sl_phone

# Validate phone numbers
is_valid = validate_sl_phone("0712345678")
print(is_valid)  # True

is_valid = validate_sl_phone("+94 71 234 5678")
print(is_valid)  # True

is_valid = validate_sl_phone("1234567")
print(is_valid)  # False
```

**format_sl_phone():**
```python
from backend.apps.core.srilanka import format_sl_phone

# Format phone number
formatted = format_sl_phone("0712345678")
print(formatted)  # "+94 71 234 5678"
```

**normalize_sl_phone():**
```python
from backend.apps.core.srilanka import normalize_sl_phone

# Normalize for storage
normalized = normalize_sl_phone("0712345678")
print(normalized)  # "+94712345678"
```

**Usage in Models/Serializers:**
```python
from django.db import models
from backend.apps.core.srilanka import validate_sl_phone

class Contact(models.Model):
    phone = models.CharField(max_length=15)
    
    def clean(self):
        if not validate_sl_phone(self.phone):
            raise ValidationError("Invalid Sri Lankan phone number")
```

---

#### NIC Validation & Parsing

**validate_nic():**
```python
from backend.apps.core.srilanka import validate_nic

# Validate old format
is_valid = validate_nic("881234567V")
print(is_valid)  # True

# Validate new format
is_valid = validate_nic("198812345678")
print(is_valid)  # True
```

**parse_nic_dob():**
```python
from backend.apps.core.srilanka import parse_nic_dob

# Extract date of birth and gender
dob, gender = parse_nic_dob("881234567V")
print(dob)     # 1988-05-03
print(gender)  # 'M'

# Female NIC (day > 500)
dob, gender = parse_nic_dob("886234567X")
print(dob)     # 1988-05-03 (623 - 500 = 123)
print(gender)  # 'F'

# New format
dob, gender = parse_nic_dob("199812345678")
print(dob)     # 1998-05-03
print(gender)  # 'M'
```

**Usage in Registration:**
```python
from backend.apps.core.srilanka import validate_nic, parse_nic_dob

def register_user(nic):
    if not validate_nic(nic):
        raise ValidationError("Invalid NIC")
    
    dob, gender = parse_nic_dob(nic)
    
    user = User.objects.create(
        nic=nic,
        date_of_birth=dob,
        gender=gender
    )
    return user
```

---

#### Administrative Divisions

**Provinces:**
```python
from backend.apps.core.srilanka import (
    PROVINCES,
    get_province_by_code,
    get_province_choices,
)

# Get all provinces
print(len(PROVINCES))  # 9

# Get specific province
province = get_province_by_code('WP')
print(province)
# {'code': 'WP', 'name': 'Western Province', 'sinhala': 'බස්නාහිර පළාත'}

# Get choices for Django form
choices = get_province_choices()
# [('WP', 'Western Province'), ('CP', 'Central Province'), ...]
```

**Districts:**
```python
from backend.apps.core.srilanka import (
    DISTRICTS,
    get_districts_by_province,
    get_district_by_code,
    get_district_choices,
)

# Get all districts
print(len(DISTRICTS))  # 25

# Get districts for province
wp_districts = get_districts_by_province('WP')
print(len(wp_districts))  # 3 (Colombo, Gampaha, Kalutara)

# Get specific district
district = get_district_by_code('CO')
print(district)
# {'code': 'CO', 'name': 'Colombo', 'sinhala': 'කොළඹ', 'province': 'WP'}

# Get choices for form
choices = get_district_choices()  # All districts
choices = get_district_choices('WP')  # Only Western Province
```

**Usage in Models:**
```python
from django.db import models
from backend.apps.core.srilanka import get_province_choices, get_district_choices

class Address(models.Model):
    province = models.CharField(
        max_length=10,
        choices=get_province_choices()
    )
    district = models.CharField(
        max_length=10,
        choices=get_district_choices()
    )
    address_line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
```

**Dynamic District Choices (based on province):**
```python
from rest_framework import serializers
from backend.apps.core.srilanka import get_district_choices

class AddressSerializer(serializers.ModelSerializer):
    def get_district_choices(self):
        province = self.initial_data.get('province')
        return get_district_choices(province)
```

---

### Complete Example: User Registration with Localization

```python
from backend.apps.core.srilanka import (
    validate_sl_phone,
    normalize_sl_phone,
    validate_nic,
    parse_nic_dob,
    get_province_choices,
    get_district_choices,
)
from backend.apps.core.datetime_helpers import get_local_now

class UserRegistrationSerializer(serializers.Serializer):
    phone = serializers.CharField()
    nic = serializers.CharField()
    province = serializers.ChoiceField(choices=get_province_choices())
    district = serializers.ChoiceField(choices=get_district_choices())
    
    def validate_phone(self, value):
        if not validate_sl_phone(value):
            raise serializers.ValidationError("Invalid phone number")
        return normalize_sl_phone(value)
    
    def validate_nic(self, value):
        if not validate_nic(value):
            raise serializers.ValidationError("Invalid NIC")
        return value
    
    def create(self, validated_data):
        # Extract DOB and gender from NIC
        dob, gender = parse_nic_dob(validated_data['nic'])
        
        user = User.objects.create(
            phone=validated_data['phone'],
            nic=validated_data['nic'],
            date_of_birth=dob,
            gender=gender,
            province=validated_data['province'],
            district=validated_data['district'],
            registered_at=get_local_now(),
        )
        return user
```

### Verification Checklist
- [ ] Sri Lanka utilities documented
- [ ] All functions covered
- [ ] Complete examples provided

---

## Summary

### Tasks Completed
Tasks 87-92 complete (documentation suite).

### Documentation Created
- ✅ Core utilities README
- ✅ Pagination usage guide
- ✅ Filter backend usage guide
- ✅ Validator usage guide
- ✅ DateTime helper usage guide
- ✅ Sri Lanka utilities usage guide

### Documentation Location
```
backend/apps/core/
├── README.md                 # Main documentation
└── docs/                     # Detailed guides (optional)
    ├── pagination.md
    ├── filters.md
    ├── validators.md
    ├── datetime.md
    └── srilanka.md
```

### Next Steps
Proceed to [03_Tasks-93-94_Integration-Phase-Completion.md](03_Tasks-93-94_Integration-Phase-Completion.md) for final integration testing and Phase 03 completion verification.

---

## Notes for AI Agents

1. **Documentation Standards:** Follow NumPy/Google docstring format
2. **Code Examples:** Include practical, real-world examples
3. **Keep Updated:** Update docs when utilities change
4. **API Reference:** Auto-generate from docstrings if possible
5. **Versioning:** Document breaking changes in CHANGELOG.md
