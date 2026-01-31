# Tasks 33-39: Festival Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** C - Festival Calendar  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Historical-Data-Processing](../Group-B_Historical-Data-Processing/)
- **→ Next Document:** [02_Tasks-40-48_Calendar-Service.md](02_Tasks-40-48_Calendar-Service.md)

---

## Document Overview

This document covers the creation of the Festival model for storing Sri Lankan festival definitions in the demand forecasting system. The Festival model captures essential information about religious, cultural, national, and commercial festivals including their names, types, dates, durations, and impact factors on demand. This model serves as the foundation for the festival calendar service that will adjust demand predictions based on Sri Lankan holidays and celebrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Festival Model | Medium | 45 min |
| 34 | Create festival_name Field | Low | 15 min |
| 35 | Create festival_type Field | Low | 20 min |
| 36 | Create date_start Field | Low | 15 min |
| 37 | Create date_end Field | Low | 15 min |
| 38 | Create impact_factor Field | Low | 20 min |
| 39 | Create is_recurring Field | Low | 15 min |

---

## Task 33: Create Festival Model

### Overview
Create the Festival model as a Django model class to store festival definitions for the demand forecasting system. This model represents various Sri Lankan festivals (religious, cultural, national, commercial) and their characteristics. The model will be used by the FestivalCalendar service to calculate demand impacts based on upcoming festivals. Since festivals affect purchasing patterns significantly in Sri Lanka (e.g., Sinhala New Year drives massive retail demand), this model is critical for accurate demand forecasting.

### Dependencies
- Task 32: Create HistoricalDataProcessor (from Group B)
- Backend Django apps structure is established
- PostgreSQL database is configured
- AI forecasting app exists in backend

### Instructions

1. **Navigate to forecasting app models directory**
   - Go to `backend/apps/ai/forecasting/models/` directory
   - This directory should already exist from previous SubPhase tasks
   - Verify that `__init__.py` exists in the models directory

2. **Create festival.py file**
   - Create new file named `festival.py`
   - This file will contain the Festival model class
   - Keep model definitions organized in separate files

3. **Import required Django dependencies**
   - Import Django model base class
   - Import required field types (CharField, DateField, FloatField, BooleanField)
   - Import timezone utilities if needed for date handling
   - Import any custom base model classes or mixins used in the project

4. **Define Festival model class**
   - Create class named `Festival` inheriting from Django Model
   - Add model Meta class for configuration
   - Set appropriate table name (e.g., `ai_festival`)
   - Configure ordering (by date_start, then by festival_name)

5. **Add model docstring**
   - Provide clear description of model purpose
   - Explain that model stores festival definitions
   - Note the role in demand forecasting adjustments
   - Include example festivals (Sinhala New Year, Vesak, Christmas)

6. **Configure model Meta options**
   - Set `db_table` to organize in ai schema
   - Set `ordering` to sort by date and name
   - Add `verbose_name` as "Festival"
   - Add `verbose_name_plural` as "Festivals"
   - Consider adding indexes on date fields for query performance

7. **Add model string representation**
   - Implement `__str__` method
   - Return festival name and dates
   - Format: "Festival Name (Start Date - End Date)"
   - Example: "Sinhala New Year (2026-04-13 - 2026-04-14)"

8. **Add model methods stub (to be populated later)**
   - Add placeholder for `get_duration` method
   - Add placeholder for `is_active_on` method
   - Add placeholder for `overlaps_with` method
   - These will calculate festival-related metrics

9. **Add model managers (optional)**
   - Consider adding custom manager for active festivals
   - Consider queryset methods for date range filtering
   - Keep it simple for initial implementation

10. **Register model in __init__.py**
    - Open `models/__init__.py` file
    - Import Festival model
    - Add to `__all__` list for clean imports

11. **Create model migration**
    - Run Django makemigrations command
    - Review generated migration file
    - Ensure migration creates table with correct schema
    - Apply migration to create database table

### Model Structure Overview

```
Festival Model
├── Identification Fields
│   ├── festival_name (unique identifier)
│   └── festival_type (categorization)
├── Date Fields
│   ├── date_start (when festival begins)
│   └── date_end (when festival ends)
├── Impact Fields
│   ├── impact_factor (demand multiplier)
│   └── is_recurring (annual recurrence)
└── Metadata Fields
    ├── created_at (timestamp)
    └── updated_at (timestamp)
```

### Festival Categories in Sri Lanka

| Category | Description | Examples |
|----------|-------------|----------|
| RELIGIOUS | Buddhist, Hindu, Christian, Muslim holidays | Vesak, Poson, Deepavali, Christmas, Eid |
| CULTURAL | Traditional celebrations | Sinhala New Year, Harvest festivals |
| NATIONAL | National holidays | Independence Day |
| COMMERCIAL | Shopping events | Black Friday, Year-End Sales |

### Model Design Considerations

| Consideration | Implementation | Rationale |
|---------------|----------------|-----------|
| Unique Names | festival_name with unique constraint | Prevent duplicate festival entries |
| Date Ranges | Separate start/end dates | Handle multi-day festivals |
| Impact Factor | Float between 1.0-3.0 | Quantify demand increase |
| Recurring Flag | Boolean field | Distinguish annual vs one-time events |
| Ordering | By date_start | Chronological festival listing |

### Festival Model Relationships

```
┌─────────────────────────────────────┐
│         Festival Model              │
├─────────────────────────────────────┤
│ - festival_name                     │
│ - festival_type                     │
│ - date_start                        │
│ - date_end                          │
│ - impact_factor                     │
│ - is_recurring                      │
└─────────────────────────────────────┘
            │
            │ Used by
            ▼
┌─────────────────────────────────────┐
│   FestivalCalendar Service          │
│   (Created in Task 40)              │
└─────────────────────────────────────┘
            │
            │ Feeds into
            ▼
┌─────────────────────────────────────┐
│   Demand Forecasting Engine         │
│   (Adjusts predictions)             │
└─────────────────────────────────────┘
```

### Database Table Schema

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | BigAutoField | Primary Key | Unique identifier |
| festival_name | CharField(100) | Unique, Not Null | Festival name |
| festival_type | CharField(20) | Not Null, Choices | Category |
| date_start | DateField | Not Null | Start date |
| date_end | DateField | Not Null | End date |
| impact_factor | FloatField | Default 1.0 | Demand multiplier |
| is_recurring | BooleanField | Default True | Annual event |
| created_at | DateTimeField | Auto now add | Record creation |
| updated_at | DateTimeField | Auto now | Last update |

### Expected Outcome
- Festival model class created and properly structured
- Model inherits from Django base Model class
- Meta configuration set with appropriate options
- Model docstring and string representation implemented
- Model file organized in forecasting models directory
- Ready to add field definitions in subsequent tasks

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/models/festival.py` file created
- [ ] Festival class defined inheriting from Django Model
- [ ] Model docstring explains purpose and usage
- [ ] Meta class configured with db_table and ordering
- [ ] `__str__` method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] Basic structure ready for field additions

---

## Task 34: Create festival_name Field

### Overview
Add the festival_name field to the Festival model to store the unique name of each festival. This field serves as the primary identifier for festivals and must be unique to prevent duplicate entries. The field will store names like "Sinhala New Year", "Vesak Full Moon Poya", "Christmas", "Deepavali", etc. Proper naming and uniqueness constraints are essential for data integrity and easy festival identification.

### Dependencies
- Task 33: Create Festival Model

### Instructions

1. **Define festival_name field**
   - Add CharField to Festival model
   - Set max_length to 100 characters
   - Set unique=True to prevent duplicates
   - Set blank=False and null=False (required field)

2. **Add field help text**
   - Provide descriptive help_text for admin interface
   - Example: "Unique name of the festival (e.g., Sinhala New Year, Vesak Poya)"
   - Help text assists administrators entering festival data

3. **Add field verbose name**
   - Set verbose_name="Festival Name"
   - Used in Django admin and forms
   - Makes field purpose clear in UI

4. **Consider validation requirements**
   - Field should accept Unicode characters (Sinhala/Tamil names)
   - Consider trimming whitespace in clean method
   - Consider title case normalization for consistency

5. **Add field to model**
   - Place field near the top of model definition
   - Order: identification fields first, then dates, then flags
   - Maintain logical field ordering

6. **Update model string representation**
   - Ensure `__str__` method uses festival_name
   - This makes query results and admin lists readable
   - Format: Include festival name in string output

7. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds festival_name field
   - Apply migration to update database schema

8. **Test field in Django shell**
   - Create test Festival instance
   - Verify festival_name accepts valid names
   - Test uniqueness constraint (try duplicate names)
   - Verify error handling for constraint violations

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | CharField | Text storage |
| max_length | 100 | Accommodates long festival names |
| unique | True | Prevents duplicate festivals |
| blank | False | Field is required |
| null | False | Database constraint |
| db_index | True (via unique) | Fast lookups by name |

### Sri Lankan Festival Names

| Festival Name | Language | Length |
|---------------|----------|--------|
| Sinhala New Year | English | 18 chars |
| Vesak Full Moon Poya | English | 20 chars |
| Poson Full Moon Poya | English | 20 chars |
| Deepavali | English/Tamil | 9 chars |
| Thai Pongal | Tamil | 11 chars |
| Christmas | English | 9 chars |
| Eid al-Fitr | Arabic/English | 11 chars |
| Independence Day | English | 16 chars |

### Uniqueness Considerations

```
Valid (Unique Names)
├── "Sinhala New Year"
├── "Vesak Full Moon Poya"
├── "Christmas"
└── "Deepavali"

Invalid (Duplicates)
├── "Christmas" (already exists)
└── "Vesak Full Moon Poya" (already exists)
```

### Field Validation Flow

```
User Input: "Sinhala New Year"
    │
    ▼
Django CharField Validation
    ├─ Length check (≤ 100 chars) ✓
    ├─ Required check (not blank) ✓
    └─ Type check (string) ✓
    │
    ▼
Database Unique Constraint
    ├─ Check existing festivals
    ├─ If duplicate → Raise IntegrityError
    └─ If unique → Allow save ✓
    │
    ▼
Festival Created Successfully
```

### Usage Examples

| Operation | Code Pattern | Result |
|-----------|--------------|--------|
| Create | Festival.objects.create(festival_name="Vesak") | New festival |
| Query | Festival.objects.get(festival_name="Vesak") | Retrieve festival |
| Filter | Festival.objects.filter(festival_name__icontains="new") | Search festivals |
| Unique Error | Duplicate name save | IntegrityError raised |

### Admin Interface Display

```
Django Admin - Festivals List
┌────────────────────────────────────────┐
│ Festival Name         | Type | Dates   │
├────────────────────────────────────────┤
│ Sinhala New Year     | CULT | Apr 13  │
│ Vesak Full Moon Poya | RELI | May 23  │
│ Christmas            | RELI | Dec 25  │
└────────────────────────────────────────┘
```

### Expected Outcome
- festival_name field added to Festival model
- Field configured as unique CharField with max_length=100
- Field is required (not nullable or blank)
- Help text and verbose name added for clarity
- Migration created and applied successfully
- Field ready for storing festival names

### Verification Checklist
- [ ] festival_name field defined in Festival model
- [ ] Field type is CharField with max_length=100
- [ ] unique=True constraint applied
- [ ] blank=False and null=False set
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with sample festival names
- [ ] Uniqueness constraint verified

---

## Task 35: Create festival_type Field

### Overview
Add the festival_type field to categorize festivals into different types (Religious, Cultural, National, Commercial). This categorization helps in organizing festivals, filtering by type, and potentially applying different forecasting rules based on festival category. For example, religious festivals in Sri Lanka (Vesak, Poson, Deepavali, Christmas) have different impact patterns than commercial events (Black Friday, Year-End Sales).

### Dependencies
- Task 33: Create Festival Model

### Instructions

1. **Define festival type choices**
   - Create choices tuple or TextChoices class in model
   - Define RELIGIOUS = "RELIGIOUS" for religious holidays
   - Define CULTURAL = "CULTURAL" for cultural celebrations
   - Define NATIONAL = "NATIONAL" for national holidays
   - Define COMMERCIAL = "COMMERCIAL" for shopping events

2. **Add festival_type field**
   - Add CharField to Festival model
   - Set max_length to 20 characters (accommodate choice values)
   - Set choices parameter to festival type choices
   - Set blank=False and null=False (required field)

3. **Set default value**
   - Set default="RELIGIOUS" (most common in Sri Lanka)
   - Or set default=None to force explicit selection
   - Consider business requirements for default behavior

4. **Add field help text**
   - Provide descriptive help_text
   - Example: "Category of the festival (Religious, Cultural, National, Commercial)"
   - Helps administrators understand categorization

5. **Add field verbose name**
   - Set verbose_name="Festival Type"
   - Used in Django admin and forms
   - Makes field purpose clear in UI

6. **Add field to model**
   - Place field after festival_name
   - Maintain logical field ordering
   - Group identification fields together

7. **Create model manager method (optional)**
   - Add classmethod or manager method to filter by type
   - Example: `Festival.objects.religious()` returns religious festivals
   - Convenience method for common queries

8. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds festival_type field
   - Apply migration to update database schema

9. **Create admin filter**
   - When registering model in admin, add list_filter
   - Include festival_type in filters
   - Enables filtering festivals by type in admin interface

### Festival Type Choices

| Choice Value | Display Name | Description | Sri Lankan Examples |
|--------------|--------------|-------------|---------------------|
| RELIGIOUS | Religious | Religious holidays and observances | Vesak, Poson, Deepavali, Christmas, Eid |
| CULTURAL | Cultural | Traditional cultural celebrations | Sinhala New Year, Thai Pongal |
| NATIONAL | National | National holidays | Independence Day, May Day |
| COMMERCIAL | Commercial | Shopping events and promotions | Black Friday, Year-End Sales |

### Festival Type Distribution (Sri Lanka)

```
Religious Festivals (60%)
├── Vesak Full Moon Poya
├── Poson Full Moon Poya
├── Deepavali
├── Christmas
├── Eid al-Fitr
└── Good Friday

Cultural Festivals (25%)
├── Sinhala/Tamil New Year
├── Thai Pongal
└── Duruthu Perahera

National Holidays (10%)
├── Independence Day
├── May Day
└── Republic Day

Commercial Events (5%)
├── Black Friday
└── Year-End Sales
```

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | CharField | Text choice storage |
| max_length | 20 | Accommodates longest choice |
| choices | FestivalType.choices | Restricts to valid types |
| default | "RELIGIOUS" | Most common type |
| blank | False | Field is required |
| null | False | Database constraint |

### Django TextChoices Implementation

```
Choice Structure
├── RELIGIOUS = "RELIGIOUS", "Religious"
│   ├─ Value: "RELIGIOUS" (stored in database)
│   └─ Label: "Religious" (displayed in UI)
├── CULTURAL = "CULTURAL", "Cultural"
├── NATIONAL = "NATIONAL", "National"
└── COMMERCIAL = "COMMERCIAL", "Commercial"
```

### Field Usage Patterns

| Operation | Query Pattern | Result |
|-----------|---------------|--------|
| Filter Religious | Festival.objects.filter(festival_type="RELIGIOUS") | All religious festivals |
| Filter Cultural | Festival.objects.filter(festival_type="CULTURAL") | All cultural festivals |
| Count by Type | Festival.objects.values('festival_type').annotate(count=Count('id')) | Type distribution |
| Exclude Commercial | Festival.objects.exclude(festival_type="COMMERCIAL") | Non-commercial only |

### Impact by Festival Type

| Festival Type | Typical Impact Factor | Duration | Examples |
|---------------|----------------------|----------|----------|
| RELIGIOUS | 1.5x - 2.0x | 1-3 days | Vesak, Christmas |
| CULTURAL | 2.0x - 2.5x | 7-10 days | Sinhala New Year |
| NATIONAL | 1.2x - 1.5x | 1 day | Independence Day |
| COMMERCIAL | 1.5x - 2.0x | 3-5 days | Black Friday |

### Admin Interface Display

```
Django Admin - Festival Type Filter
┌────────────────────────────────────────┐
│ Filter by Type:                        │
│ ☐ Religious (12)                       │
│ ☐ Cultural (5)                         │
│ ☐ National (3)                         │
│ ☐ Commercial (2)                       │
└────────────────────────────────────────┘
```

### Expected Outcome
- festival_type field added to Festival model
- Field configured as CharField with choices constraint
- Four festival types defined (Religious, Cultural, National, Commercial)
- Field is required with appropriate default
- Help text and verbose name added
- Migration created and applied successfully

### Verification Checklist
- [ ] festival_type field defined in Festival model
- [ ] TextChoices or choices tuple created
- [ ] Four festival types defined (RELIGIOUS, CULTURAL, NATIONAL, COMMERCIAL)
- [ ] Field type is CharField with max_length=20
- [ ] choices parameter set correctly
- [ ] Default value configured
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with valid and invalid values

---

## Task 36: Create date_start Field

### Overview
Add the date_start field to store the start date of each festival. This field is critical for identifying when festivals begin and for calculating their impact on demand forecasting. For recurring festivals, this represents the start date for the current or reference year. The field must handle both fixed-date festivals (Christmas on Dec 25) and variable-date festivals (Vesak on lunar calendar).

### Dependencies
- Task 33: Create Festival Model

### Instructions

1. **Add date_start field**
   - Add DateField to Festival model
   - Set blank=False and null=False (required field)
   - No default value (must be explicitly set)

2. **Add field help text**
   - Provide descriptive help_text
   - Example: "Start date of the festival (for recurring festivals, use current/reference year)"
   - Note handling of variable-date festivals

3. **Add field verbose name**
   - Set verbose_name="Start Date"
   - Used in Django admin and forms
   - Makes field purpose clear

4. **Add field validation**
   - Consider adding custom validation in clean method
   - Validate date_start <= date_end (if date_end defined)
   - Validate date_start is not in distant past (data quality)

5. **Add database index**
   - Set db_index=True for query performance
   - Festival lookups frequently filter by date ranges
   - Index improves query speed significantly

6. **Add field to model**
   - Place field after festival_type
   - Group date fields together
   - Maintain logical field ordering

7. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds date_start field
   - Apply migration to update database schema

8. **Consider timezone handling**
   - Use naive dates (DateField, not DateTimeField)
   - Festivals are date-based, not time-based
   - Avoids timezone complexity

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DateField | Date storage |
| blank | False | Field is required |
| null | False | Database constraint |
| db_index | True | Fast date range queries |
| help_text | Descriptive | Admin guidance |

### Sri Lankan Festival Dates

| Festival | Date Pattern | 2026 Start Date |
|----------|--------------|-----------------|
| Sinhala New Year | Fixed (April 13-14) | 2026-04-13 |
| Vesak Poya | Variable (May full moon) | 2026-05-23 |
| Poson Poya | Variable (June full moon) | 2026-06-22 |
| Deepavali | Variable (Hindu calendar) | 2026-10-28 |
| Christmas | Fixed (December 25) | 2026-12-25 |
| Independence Day | Fixed (February 4) | 2026-02-04 |

### Date Storage Patterns

```
Fixed-Date Festivals
├── Store exact date (e.g., 2026-12-25 for Christmas)
├── Update year for recurring festivals
└── Predictable pattern

Variable-Date Festivals
├── Calculate date based on lunar/Hindu calendar
├── Store calculated date for current year
├── Recalculate annually
└── Update using calendar calculation service
```

### Date Range Query Patterns

| Query Type | Example | Purpose |
|------------|---------|---------|
| Upcoming | `date_start__gte=today` | Find future festivals |
| Date Range | `date_start__range=(start, end)` | Festivals in period |
| Month | `date_start__month=12` | December festivals |
| Year | `date_start__year=2026` | 2026 festivals |

### Date Validation Logic

```
Validation Checks
├── date_start is not null ✓
├── date_start format is valid (YYYY-MM-DD) ✓
├── date_start <= date_end (if date_end set) ✓
├── date_start is reasonable (not too far past/future) ✓
└── date_start matches expected pattern for festival type
```

### Database Index Benefits

| Operation | Without Index | With Index | Improvement |
|-----------|---------------|------------|-------------|
| Date range query | Full table scan | Index scan | 10-100x faster |
| Upcoming festivals | O(n) | O(log n) | Significant |
| Monthly grouping | O(n) | O(log n) | Significant |

### Field Usage in Forecasting

```
Demand Forecasting Flow
    │
    ▼
Get Current Date (e.g., 2026-04-10)
    │
    ▼
Query Festivals in Next 30 Days
└── WHERE date_start BETWEEN '2026-04-10' AND '2026-05-10'
    │
    ▼
Find: Sinhala New Year (2026-04-13)
    │
    ▼
Apply Impact Factor (2.5x)
    │
    ▼
Adjusted Demand Forecast
```

### Expected Outcome
- date_start field added to Festival model
- Field configured as DateField, required, with index
- Field ready to store festival start dates
- Help text and verbose name added
- Migration created and applied
- Field supports efficient date range queries

### Verification Checklist
- [ ] date_start field defined in Festival model
- [ ] Field type is DateField
- [ ] blank=False and null=False set
- [ ] db_index=True configured
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with sample dates
- [ ] Date range queries tested for performance

---

## Task 37: Create date_end Field

### Overview
Add the date_end field to store the end date of each festival. This field defines when festivals conclude and is essential for calculating festival duration and overlapping periods. Some festivals are single-day events (date_start = date_end), while others span multiple days (Sinhala New Year spans 7-10 days). The field enables accurate calculation of festival impact periods for demand forecasting.

### Dependencies
- Task 33: Create Festival Model
- Task 36: Create date_start Field (for validation)

### Instructions

1. **Add date_end field**
   - Add DateField to Festival model
   - Set blank=False and null=False (required field)
   - No default value (must be explicitly set)

2. **Add field help text**
   - Provide descriptive help_text
   - Example: "End date of the festival (can be same as start date for single-day festivals)"
   - Note that single-day festivals use same start and end date

3. **Add field verbose name**
   - Set verbose_name="End Date"
   - Used in Django admin and forms
   - Makes field purpose clear

4. **Add field validation**
   - Add custom validation in model clean method
   - Validate date_end >= date_start (end not before start)
   - Raise ValidationError if validation fails
   - Provide clear error message for admin users

5. **Add database index**
   - Set db_index=True for query performance
   - Date range queries filter by both start and end dates
   - Index improves overlap detection queries

6. **Add field to model**
   - Place field immediately after date_start
   - Keep date fields together
   - Maintain logical field ordering

7. **Add model method for duration**
   - Create `get_duration()` method
   - Calculate (date_end - date_start).days + 1
   - Return integer number of days
   - Example: April 13-14 returns 2 days

8. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds date_end field
   - Apply migration to update database schema

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | DateField | Date storage |
| blank | False | Field is required |
| null | False | Database constraint |
| db_index | True | Fast date range queries |
| help_text | Descriptive | Admin guidance |

### Festival Duration Patterns

| Festival | Start Date | End Date | Duration | Pattern |
|----------|------------|----------|----------|---------|
| Independence Day | 2026-02-04 | 2026-02-04 | 1 day | Single day |
| Vesak Poya | 2026-05-23 | 2026-05-25 | 3 days | Long weekend |
| Sinhala New Year | 2026-04-13 | 2026-04-19 | 7 days | Week-long |
| Christmas Season | 2026-12-20 | 2026-12-26 | 7 days | Extended period |

### Date Validation Examples

```
Valid Combinations
├── date_start: 2026-04-13, date_end: 2026-04-13 ✓ (Single day)
├── date_start: 2026-04-13, date_end: 2026-04-19 ✓ (Multi-day)
└── date_start: 2026-05-23, date_end: 2026-05-25 ✓ (Weekend)

Invalid Combinations
├── date_start: 2026-04-19, date_end: 2026-04-13 ✗ (End before start)
├── date_start: 2026-04-13, date_end: None ✗ (End is required)
└── date_start: 2026-04-13, date_end: 2026-05-13 ⚠️ (Unusually long - warning)
```

### Duration Calculation Method

```
get_duration() Method Logic
    │
    ▼
Input: date_start = 2026-04-13
       date_end = 2026-04-19
    │
    ▼
Calculate: date_end - date_start
Result: timedelta(days=6)
    │
    ▼
Add 1 (inclusive count)
Result: 7 days
    │
    ▼
Return: 7
```

### Overlap Detection Logic

| Operation | Query Pattern | Purpose |
|-----------|---------------|---------|
| Overlapping | `(date_start <= check_end) & (date_end >= check_start)` | Find overlapping festivals |
| Contains Date | `(date_start <= check_date) & (date_end >= check_date)` | Festival active on date |
| Within Range | `(date_start >= range_start) & (date_end <= range_end)` | Festivals fully within range |

### Festival Impact Periods

```
Timeline: April 2026
01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16  17  18  19  20
                                                ├──────────────────────────────┤
                                                    Sinhala New Year
                                            date_start (13)     date_end (19)

Impact Applied:
├── April 13-19: 2.5x impact factor
├── April 12: 1.0x (pre-festival, normal)
└── April 20: 1.0x (post-festival, normal)
```

### Django Admin Display

```
Festival Details
┌──────────────────────────────────────────┐
│ Festival: Sinhala New Year               │
│ Type: Cultural                           │
│ Start Date: April 13, 2026               │
│ End Date: April 19, 2026                 │
│ Duration: 7 days                         │
│ Impact Factor: 2.5x                      │
└──────────────────────────────────────────┘
```

### Expected Outcome
- date_end field added to Festival model
- Field configured as DateField, required, with index
- Validation ensures end date >= start date
- get_duration() method calculates festival length
- Help text and verbose name added
- Migration created and applied

### Verification Checklist
- [ ] date_end field defined in Festival model
- [ ] Field type is DateField
- [ ] blank=False and null=False set
- [ ] db_index=True configured
- [ ] Validation added (date_end >= date_start)
- [ ] get_duration() method implemented
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with valid date ranges
- [ ] Validation tested with invalid date ranges

---

## Task 38: Create impact_factor Field

### Overview
Add the impact_factor field to quantify the expected demand increase during each festival. This field stores a multiplier (e.g., 2.5 means 250% of normal demand) that the forecasting system uses to adjust predictions. Different festivals have different impacts: Sinhala New Year has massive retail impact (2.5x), while smaller observances have moderate impact (1.5x). This field is central to festival-aware demand forecasting.

### Dependencies
- Task 33: Create Festival Model

### Instructions

1. **Add impact_factor field**
   - Add FloatField to Festival model
   - Set blank=False and null=False (required field)
   - Set default=1.0 (no impact by default)

2. **Add field constraints**
   - Add MinValueValidator for minimum value of 1.0
   - Add MaxValueValidator for maximum value of 3.0
   - Prevents unreasonable impact factors
   - Import validators from django.core.validators

3. **Add field help text**
   - Provide descriptive help_text
   - Example: "Demand multiplier during festival (1.0 = normal, 2.5 = 250% increase)"
   - Include typical range (1.0 to 3.0)
   - Explain impact on demand calculations

4. **Add field verbose name**
   - Set verbose_name="Impact Factor"
   - Used in Django admin and forms
   - Makes field purpose clear

5. **Add field to model**
   - Place field after date fields
   - Group impact-related fields together
   - Maintain logical field ordering

6. **Add model method for impact description**
   - Create `get_impact_description()` method
   - Return human-readable impact description
   - Example: "1.5" → "50% increase", "2.0" → "100% increase"

7. **Add admin display customization**
   - Format display as percentage in admin
   - Example: 2.5 displays as "250%"
   - Makes impact factor more intuitive

8. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds impact_factor field
   - Apply migration to update database schema

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | FloatField | Decimal multiplier |
| default | 1.0 | No impact baseline |
| blank | False | Field is required |
| null | False | Database constraint |
| validators | [MinValueValidator(1.0), MaxValueValidator(3.0)] | Reasonable range |

### Impact Factor Guidelines

| Impact Factor | Percentage | Demand Level | Typical Festivals |
|---------------|------------|--------------|-------------------|
| 1.0 | 0% (normal) | Baseline | No festival |
| 1.2 | 20% increase | Minor | Minor poya days |
| 1.5 | 50% increase | Moderate | Poson Poya, national holidays |
| 1.8 | 80% increase | Significant | Vesak Poya |
| 2.0 | 100% increase | Double | Deepavali, major religious festivals |
| 2.2 | 120% increase | High | Christmas season |
| 2.5 | 150% increase | Very High | Sinhala New Year |
| 3.0 | 200% increase | Extreme | Black Friday (international) |

### Sri Lankan Festival Impact Factors

```
Religious Festivals
├── Vesak Full Moon Poya: 1.8x
├── Poson Full Moon Poya: 1.5x
├── Deepavali: 2.0x
├── Christmas: 2.2x
└── Eid al-Fitr: 1.6x

Cultural Festivals
├── Sinhala New Year: 2.5x (highest)
└── Thai Pongal: 1.8x

National Holidays
├── Independence Day: 1.3x
└── May Day: 1.2x

Commercial Events
├── Black Friday: 2.0x
└── Year-End Sales: 1.8x
```

### Impact Factor Validation

```
Validation Rules
├── Minimum: 1.0 (cannot reduce demand)
├── Maximum: 3.0 (realistic upper bound)
├── Precision: 1 decimal place recommended
└── Range: 1.0 to 3.0 inclusive

Valid Examples
├── 1.0 ✓ (baseline)
├── 1.5 ✓ (moderate)
├── 2.5 ✓ (high)
└── 3.0 ✓ (extreme)

Invalid Examples
├── 0.5 ✗ (below minimum)
├── 0.8 ✗ (reduces demand)
├── 4.0 ✗ (above maximum)
└── -1.0 ✗ (negative)
```

### Impact Calculation in Forecasting

```
Base Demand Calculation
    │
    ▼
Input: Base demand = 1000 units/day
       Festival: Sinhala New Year (impact_factor = 2.5)
    │
    ▼
Apply Impact: Adjusted demand = Base × impact_factor
                              = 1000 × 2.5
                              = 2500 units/day
    │
    ▼
Result: Forecast 2500 units during festival period
```

### Overlapping Festival Impacts

| Scenario | Calculation Method | Example |
|----------|-------------------|---------|
| Single Festival | Base × impact_factor | 1000 × 2.5 = 2500 |
| Overlapping | Base × max(impact_factors) | 1000 × max(2.0, 1.5) = 2000 |
| Sequential | Apply each period separately | Day 1: ×2.5, Day 2: ×1.8 |

### Admin Interface Display

```
Django Admin - Festival List
┌────────────────────────────────────────────────────────────┐
│ Festival Name         | Type | Dates      | Impact        │
├────────────────────────────────────────────────────────────┤
│ Sinhala New Year     | CULT | Apr 13-19  | 2.5x (250%)   │
│ Christmas            | RELI | Dec 20-26  | 2.2x (220%)   │
│ Deepavali            | RELI | Oct 28-30  | 2.0x (200%)   │
│ Vesak Poya           | RELI | May 23-25  | 1.8x (180%)   │
│ Poson Poya           | RELI | Jun 22-23  | 1.5x (150%)   │
└────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- impact_factor field added to Festival model
- Field configured as FloatField with default 1.0
- Validators ensure reasonable range (1.0-3.0)
- Help text explains multiplier concept
- Field ready for demand forecasting calculations
- Migration created and applied

### Verification Checklist
- [ ] impact_factor field defined in Festival model
- [ ] Field type is FloatField
- [ ] default=1.0 set
- [ ] blank=False and null=False set
- [ ] MinValueValidator(1.0) added
- [ ] MaxValueValidator(3.0) added
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with valid values (1.0-3.0)
- [ ] Validation tested with invalid values (<1.0, >3.0)

---

## Task 39: Create is_recurring Field

### Overview
Add the is_recurring field to indicate whether a festival recurs annually or is a one-time event. Most Sri Lankan festivals are recurring (Sinhala New Year every April, Vesak every May full moon), but some events may be one-time observances. This field helps the system know which festivals to automatically update for future years and which to treat as historical records.

### Dependencies
- Task 33: Create Festival Model

### Instructions

1. **Add is_recurring field**
   - Add BooleanField to Festival model
   - Set default=True (most festivals recur annually)
   - Set blank=False and null=False (required field)

2. **Add field help text**
   - Provide descriptive help_text
   - Example: "Whether this festival recurs annually (True for regular festivals like Christmas, Vesak)"
   - Explain implications for date updates

3. **Add field verbose name**
   - Set verbose_name="Is Recurring"
   - Used in Django admin and forms
   - Makes field purpose clear

4. **Add field to model**
   - Place field after impact_factor
   - Group all festival attributes together
   - Complete the model field set

5. **Add model method for recurrence description**
   - Create `is_annual()` method or property
   - Returns True if recurring, False otherwise
   - Alias for better code readability

6. **Add admin list display**
   - Include is_recurring in admin list_display
   - Show recurring status in festival lists
   - Add filter for recurring vs one-time events

7. **Consider calendar update logic**
   - Recurring festivals need annual date updates
   - One-time events don't need updates
   - Document this behavior for calendar service

8. **Create and apply migration**
   - Run makemigrations command
   - Review migration adds is_recurring field
   - Apply migration to update database schema

### Field Configuration

| Property | Value | Reason |
|----------|-------|--------|
| Field Type | BooleanField | True/False flag |
| default | True | Most festivals recur |
| blank | False | Field is required |
| null | False | Database constraint |

### Recurring vs One-Time Festivals

| Category | Recurring | Examples | Update Behavior |
|----------|-----------|----------|-----------------|
| Annual Festivals | True | Sinhala New Year, Vesak, Christmas | Update dates yearly |
| Religious Observances | True | All poya days, Eid, Deepavali | Calculate new dates |
| National Holidays | True | Independence Day, May Day | Update year only |
| Special Events | False | 50th Anniversary, One-time sale | Keep historical |
| Commercial Promotions | Mixed | Black Friday (True), Store opening (False) | Case by case |

### Recurring Festival Patterns

```
Fixed-Date Recurring
├── Christmas (December 25 annually)
├── Independence Day (February 4 annually)
└── Update: Change year only

Variable-Date Recurring
├── Vesak (May full moon annually)
├── Poson (June full moon annually)
├── Deepavali (Hindu calendar annually)
└── Update: Recalculate date

One-Time Events
├── 75th Independence Day Celebration (2023-02-04)
├── Store Grand Opening Sale (2025-06-15)
└── Update: No update needed
```

### Calendar Update Logic

```
Annual Festival Update Process
    │
    ▼
For Each Festival in Database:
    │
    ▼
Check is_recurring field
    ├─ If True: Update for next year
    │   ├─ Fixed date: Increment year
    │   └─ Variable: Recalculate date
    └─ If False: Skip update (historical record)
    │
    ▼
Updated Festival Calendar for Next Year
```

### Field Impact on System Behavior

| is_recurring | System Behavior | Use Case |
|--------------|-----------------|----------|
| True | Auto-update dates annually | Regular festivals |
| True | Include in multi-year forecasts | Long-term planning |
| True | Display in recurring calendar view | Annual schedule |
| False | Keep as historical record | Past events |
| False | Don't include in future forecasts | One-time promotions |
| False | Archive after event date | Cleanup process |

### Admin Interface Display

```
Django Admin - Filter by Recurrence
┌────────────────────────────────────────────┐
│ Filter by Recurrence:                      │
│ ⦿ All                                      │
│ ○ Recurring (18)                           │
│ ○ One-time (2)                             │
└────────────────────────────────────────────┘

Festival List
┌──────────────────────────────────────────────────────────┐
│ Festival Name         | Type | Recurring | Next Date    │
├──────────────────────────────────────────────────────────┤
│ Sinhala New Year     | CULT | ✓ Yes     | 2027-04-13   │
│ Vesak Poya           | RELI | ✓ Yes     | 2027-05-12   │
│ Christmas            | RELI | ✓ Yes     | 2026-12-25   │
│ Store Opening Sale   | COMM | ✗ No      | (Historical) │
└──────────────────────────────────────────────────────────┘
```

### Query Patterns

| Query Purpose | Code Pattern | Result |
|---------------|--------------|--------|
| Recurring Only | Festival.objects.filter(is_recurring=True) | Annual festivals |
| One-Time Only | Festival.objects.filter(is_recurring=False) | Historical events |
| Update Candidates | Festival.objects.filter(is_recurring=True, date_end__lt=today) | Needs date update |

### Expected Outcome
- is_recurring field added to Festival model
- Field configured as BooleanField with default=True
- Field indicates annual recurrence pattern
- Help text explains field purpose
- Field ready for calendar update logic
- Migration created and applied
- Festival model complete with all fields

### Verification Checklist
- [ ] is_recurring field defined in Festival model
- [ ] Field type is BooleanField
- [ ] default=True set
- [ ] blank=False and null=False set
- [ ] help_text and verbose_name provided
- [ ] Migration created and applied
- [ ] Field tested with True/False values
- [ ] Admin list display includes recurring status
- [ ] Festival model has all required fields (name, type, dates, impact, recurring)

---

## Summary

This document established the Festival model for storing Sri Lankan festival definitions in the demand forecasting system. The model includes seven essential fields: festival_name (unique identifier), festival_type (categorization), date_start and date_end (festival period), impact_factor (demand multiplier), and is_recurring (annual pattern). The model is now ready to store festival data and be utilized by the FestivalCalendar service for demand forecasting adjustments.

### Completed Tasks
1. ✓ Created Festival model class with proper structure
2. ✓ Created festival_name field (unique CharField)
3. ✓ Created festival_type field (choice field with 4 categories)
4. ✓ Created date_start field (indexed DateField)
5. ✓ Created date_end field (indexed DateField with validation)
6. ✓ Created impact_factor field (FloatField with 1.0-3.0 range)
7. ✓ Created is_recurring field (BooleanField for annual events)

### Model Capabilities
- Store comprehensive festival information
- Support both fixed and variable date festivals
- Categorize festivals by type (Religious, Cultural, National, Commercial)
- Quantify demand impact with multipliers
- Distinguish recurring vs one-time events
- Efficient date range queries with indexes
- Validation for data integrity

### Next Steps
Proceed to [02_Tasks-40-48_Calendar-Service.md](02_Tasks-40-48_Calendar-Service.md) to create the FestivalCalendar service, populate Sri Lankan festivals, and implement methods for retrieving festivals and calculating impact factors.
