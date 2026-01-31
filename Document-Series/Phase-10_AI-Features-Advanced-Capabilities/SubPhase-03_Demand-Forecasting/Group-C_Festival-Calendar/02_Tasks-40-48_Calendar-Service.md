# Tasks 40-48: Calendar Service and Festivals

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** C - Festival Calendar  
> **Document:** 02 of 02  
> **Tasks Covered:** 40, 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-39_Festival-Model.md](01_Tasks-33-39_Festival-Model.md)
- **→ Next Group:** [Group-D_Prediction-Algorithms](../Group-D_Prediction-Algorithms/)

---

## Document Overview

This document covers the creation of the FestivalCalendar service and population of Sri Lankan festival data. The service manages festival calendar operations including retrieval of festivals within date ranges and calculation of demand impact factors. It includes pre-population of major Sri Lankan festivals (Sinhala New Year, Vesak, Poson, Deepavali, Christmas) with appropriate dates, durations, and impact factors. The service integrates with the demand forecasting engine to adjust predictions based on festival periods.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 40 | Create FestivalCalendar | Medium | 45 min |
| 41 | Create Sinhala New Year | Low | 20 min |
| 42 | Create Vesak Full Moon | Medium | 30 min |
| 43 | Create Poson Full Moon | Medium | 30 min |
| 44 | Create Deepavali | Medium | 30 min |
| 45 | Create Christmas | Low | 20 min |
| 46 | Create get_festivals Method | Medium | 35 min |
| 47 | Create get_impact Method | Medium | 35 min |
| 48 | Verify Festival Calendar | Low | 25 min |

---

## Task 40: Create FestivalCalendar

### Overview
Create the FestivalCalendar service class to manage festival calendar operations for demand forecasting. This service provides a centralized interface for festival data management, including querying festivals by date range, calculating impact factors, and managing lunar calendar calculations for variable-date festivals. The service encapsulates all festival-related business logic separate from the model layer.

### Dependencies
- Task 39: Create is_recurring Field (Festival model complete)

### Instructions

1. **Create calendar directory structure**
   - Navigate to `backend/apps/ai/forecasting/` directory
   - Create new directory named `calendar`
   - Create `__init__.py` in calendar directory
   - This organizes calendar-related services

2. **Create festival_calendar.py file**
   - Create file in `calendar/` directory
   - This file will contain FestivalCalendar service class
   - Separate service logic from models

3. **Import required dependencies**
   - Import Festival model from forecasting models
   - Import Django timezone utilities (date, timedelta)
   - Import typing hints (List, Optional, Tuple)
   - Import logging for service operations

4. **Define FestivalCalendar class**
   - Create class named `FestivalCalendar`
   - This is a service class, not a model
   - Implements Singleton pattern (optional but recommended)
   - Provides static/class methods for festival operations

5. **Add class docstring**
   - Describe service purpose and responsibilities
   - List main methods and their purposes
   - Include usage examples
   - Document lunar calendar calculation approach

6. **Initialize class attributes**
   - Add class-level cache for frequently accessed festivals
   - Add logger instance for debugging
   - Add constants for default impact factor (1.0)

7. **Add initialization method**
   - Create `__init__` method (if instance-based)
   - Or use class methods only (no instantiation needed)
   - Consider caching strategy for performance

8. **Create helper method stubs**
   - Add `_calculate_lunar_date` stub for Buddhist festivals
   - Add `_calculate_hindu_date` stub for Hindu festivals
   - Add `_is_date_in_range` stub for date checks
   - These will be implemented in subsequent tasks

9. **Add service registration**
   - Update calendar `__init__.py` to export FestivalCalendar
   - Make service easily importable
   - Example: `from forecasting.calendar import FestivalCalendar`

10. **Create service documentation**
    - Document service architecture
    - Explain separation from model layer
    - Note thread-safety considerations
    - Document caching strategy

### Service Class Structure

```
FestivalCalendar Service
├── Festival Data Operations
│   ├── get_festivals(start_date, end_date)
│   ├── get_festivals_by_type(festival_type)
│   └── get_upcoming_festivals(days=30)
├── Impact Calculations
│   ├── get_impact(date)
│   ├── get_max_impact_in_range(start, end)
│   └── calculate_weighted_impact(date)
├── Calendar Calculations
│   ├── _calculate_lunar_date(year, month)
│   ├── _calculate_hindu_date(year)
│   └── _update_variable_dates(year)
└── Utility Methods
    ├── is_festival_day(date)
    ├── get_festival_by_name(name)
    └── clear_cache()
```

### Service vs Model Separation

| Layer | Responsibility | Example |
|-------|----------------|---------|
| Model (Festival) | Data structure and storage | Field definitions, database schema |
| Service (FestivalCalendar) | Business logic | Date calculations, impact aggregation |
| View/API | Request handling | HTTP endpoints, serialization |
| Forecasting Engine | Demand prediction | Integrates calendar service |

### Service Design Pattern

```
Service Class Design
├── Static Methods (No Instance Required)
│   ├── get_festivals(start, end)
│   ├── get_impact(date)
│   └── Lightweight, stateless
└── Instance Methods (With Caching)
    ├── __init__(cache_enabled=True)
    ├── Cached festival queries
    └── Better performance, more memory
```

### FestivalCalendar Architecture

```
┌─────────────────────────────────────────┐
│     FestivalCalendar Service            │
├─────────────────────────────────────────┤
│ + get_festivals(start, end) → List      │
│ + get_impact(date) → Float              │
│ + _calculate_lunar_date(year, month)    │
│ + _calculate_hindu_date(year)           │
└─────────────────────────────────────────┘
            │
            │ Uses
            ▼
┌─────────────────────────────────────────┐
│         Festival Model                  │
│   (Django ORM Database Access)          │
└─────────────────────────────────────────┘
            │
            │ Used By
            ▼
┌─────────────────────────────────────────┐
│   DemandForecastingEngine               │
│   (Applies festival adjustments)        │
└─────────────────────────────────────────┘
```

### Service Method Signatures

| Method | Parameters | Return Type | Purpose |
|--------|------------|-------------|---------|
| get_festivals | start_date, end_date | List[Festival] | Festivals in range |
| get_impact | date | float | Impact factor for date |
| get_upcoming_festivals | days=30 | List[Festival] | Upcoming festivals |
| is_festival_day | date | bool | Check if date is festival |
| clear_cache | - | None | Clear cached data |

### Caching Strategy

```
Cache Implementation
├── Cache Key: f"festivals_{start_date}_{end_date}"
├── Cache Duration: 24 hours
├── Cache Invalidation: On festival create/update/delete
└── Fallback: Query database if cache miss

Performance Impact
├── Without Cache: 50-100ms per query
├── With Cache: <5ms per query
└── Improvement: 10-20x faster
```

### Service Usage Example

```
Basic Usage Pattern
─────────────────────
from forecasting.calendar import FestivalCalendar

# Get festivals in April 2026
festivals = FestivalCalendar.get_festivals(
    start_date=date(2026, 4, 1),
    end_date=date(2026, 4, 30)
)

# Get impact factor for specific date
impact = FestivalCalendar.get_impact(date(2026, 4, 13))
# Returns: 2.5 (Sinhala New Year)

# Check if date is festival
is_festival = FestivalCalendar.is_festival_day(date(2026, 12, 25))
# Returns: True (Christmas)
```

### Lunar Calendar Integration

| Festival | Calendar Type | Calculation Complexity |
|----------|---------------|------------------------|
| Vesak Poya | Lunar (Buddhist) | High - Full moon calculation |
| Poson Poya | Lunar (Buddhist) | High - Full moon calculation |
| Deepavali | Hindu (Luni-solar) | Very High - Complex Hindu calendar |
| Eid al-Fitr | Islamic (Lunar) | High - Islamic calendar |

### Expected Outcome
- FestivalCalendar service class created
- Service structure defined with method stubs
- Clear separation between model and service layers
- Service organized in dedicated calendar directory
- Documentation and docstrings complete
- Ready for method implementation

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/calendar/` directory created
- [ ] `__init__.py` file in calendar directory
- [ ] `festival_calendar.py` file created
- [ ] FestivalCalendar class defined
- [ ] Class docstring documents purpose and methods
- [ ] Helper method stubs created
- [ ] Service exported from calendar `__init__.py`
- [ ] Service architecture documented

---

## Task 41: Create Sinhala New Year

### Overview
Add Sinhala New Year (Aluth Avurudda) festival data to the database. This is the most significant festival in Sri Lanka, celebrated by both Sinhala and Tamil communities. It occurs on April 13-14 annually (fixed dates in Gregorian calendar). The festival has massive retail impact with extended celebrations from April 13-19, requiring the highest impact factor (2.5x) in the forecasting system.

### Dependencies
- Task 40: Create FestivalCalendar

### Instructions

1. **Create data migration file**
   - Create Django data migration in forecasting app
   - Name: `0XXX_add_sinhala_new_year.py`
   - Use `RunPython` for data insertion
   - Allows version-controlled festival data

2. **Define festival data**
   - Festival Name: "Sinhala/Tamil New Year"
   - Festival Type: CULTURAL
   - Date Start: April 13 (fixed, use 2026 as reference)
   - Date End: April 19 (extended celebration period)
   - Impact Factor: 2.5 (highest impact)
   - Is Recurring: True (annual event)

3. **Implement migration function**
   - Create `add_sinhala_new_year` function
   - Use `Festival.objects.get_or_create()` to avoid duplicates
   - Set all field values as specified
   - Add descriptive comments about festival significance

4. **Add reverse migration**
   - Create `remove_sinhala_new_year` function
   - Delete festival by name
   - Allows migration rollback

5. **Document festival details**
   - Add migration docstring explaining festival
   - Note cultural significance in Sri Lanka
   - Explain impact factor rationale (massive retail demand)
   - Document celebration period (April 13-19)

6. **Apply migration**
   - Run Django migrate command
   - Verify festival created in database
   - Check all field values correct

7. **Verify in Django admin**
   - Open Django admin interface
   - Navigate to Festivals list
   - Confirm Sinhala New Year appears
   - Verify all field values

### Sinhala New Year Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Name | Sinhala/Tamil New Year | Celebrated by both communities |
| Type | CULTURAL | Traditional cultural celebration |
| Start Date | April 13 | Fixed date (Sun enters Aries) |
| End Date | April 19 | Extended celebration (7 days) |
| Impact Factor | 2.5x | Highest demand period of year |
| Recurring | True | Annual celebration |

### Cultural Significance

```
Sinhala New Year Impact
├── Pre-Festival (April 1-12)
│   ├── Cleaning and preparation
│   ├── Shopping for new clothes
│   └── Food preparation supplies
├── Festival Period (April 13-14)
│   ├── Traditional rituals
│   ├── Family gatherings
│   └── Peak demand period
└── Post-Festival (April 15-19)
    ├── Visiting relatives
    ├── Continued celebrations
    └── Sustained high demand
```

### Retail Impact Breakdown

| Period | Dates | Demand Level | Key Products |
|--------|-------|--------------|--------------|
| Pre-Festival | Apr 1-12 | 1.8x | Clothing, groceries, gifts |
| New Year Eve | Apr 12 | 2.0x | Food, fireworks |
| New Year Day | Apr 13-14 | 2.5x | Peak of everything |
| Post-Festival | Apr 15-19 | 2.2x | Travel items, gifts |
| Normal | Apr 20+ | 1.0x | Back to baseline |

### Migration Code Structure

```
Migration Operations
├── dependencies = [previous_migration]
├── operations = [
│       RunPython(
│           add_sinhala_new_year,
│           remove_sinhala_new_year
│       )
│   ]

Function: add_sinhala_new_year(apps, schema_editor)
├── Get Festival model
├── Create festival with get_or_create()
├── Set all field values
└── Log creation

Function: remove_sinhala_new_year(apps, schema_editor)
├── Get Festival model
├── Filter by name
└── Delete festival
```

### Why April 13-14 is Fixed

| Calendar System | Explanation |
|-----------------|-------------|
| Astronomical | Sun enters Aries (Mesha Rashiya) |
| Gregorian | Corresponds to April 13-14 |
| Stability | Has remained fixed for centuries |
| Exception | Occasionally April 14-15 (rare leap year adjustment) |

### Expected Outcome
- Sinhala New Year festival added to database
- Data migration created for version control
- Festival appears in Django admin
- All field values correct (dates, impact 2.5x, recurring)
- Festival ready for demand forecasting queries

### Verification Checklist
- [ ] Data migration created in forecasting app
- [ ] Migration adds Sinhala New Year festival
- [ ] Festival name: "Sinhala/Tamil New Year"
- [ ] Type: CULTURAL
- [ ] Dates: April 13-19
- [ ] Impact factor: 2.5
- [ ] is_recurring: True
- [ ] Migration applied successfully
- [ ] Festival visible in Django admin
- [ ] Forward and reverse migrations tested

---

## Task 42: Create Vesak Full Moon

### Overview
Add Vesak Full Moon Poya festival data to the database. Vesak celebrates the birth, enlightenment, and death of Buddha, making it the most sacred Buddhist festival. It occurs on the full moon day in May (variable date based on lunar calendar). The festival has significant retail impact (1.8x) with a 3-day celebration period including elaborate lantern displays and religious observances.

### Dependencies
- Task 40: Create FestivalCalendar
- Task 41: Create Sinhala New Year (for migration sequencing)

### Instructions

1. **Create data migration file**
   - Create Django data migration
   - Name: `0XXX_add_vesak_poya.py`
   - Sequence after Sinhala New Year migration
   - Use `RunPython` for data insertion

2. **Calculate 2026 Vesak date**
   - Vesak occurs on May full moon
   - 2026 Vesak: May 23 (Saturday)
   - Duration: May 23-25 (3 days including weekend)
   - Verify lunar calendar calculation

3. **Define festival data**
   - Festival Name: "Vesak Full Moon Poya"
   - Festival Type: RELIGIOUS
   - Date Start: May 23, 2026
   - Date End: May 25, 2026
   - Impact Factor: 1.8 (significant religious festival)
   - Is Recurring: True (annual lunar event)

4. **Add lunar calculation documentation**
   - Document that Vesak is lunar-calendar based
   - Note date varies year to year
   - Add comment explaining 2026 calculation
   - Reference need for annual date updates

5. **Implement migration function**
   - Create `add_vesak_poya` function
   - Use `get_or_create()` to avoid duplicates
   - Set all field values
   - Add comments about lunar calendar

6. **Add reverse migration**
   - Create `remove_vesak_poya` function
   - Delete festival by name
   - Enable rollback

7. **Apply migration**
   - Run migrate command
   - Verify festival created
   - Check date accuracy

8. **Add note about future updates**
   - Document that Vesak date must be updated annually
   - This is handled by calendar update service (future task)
   - Add TODO comment for automated lunar calculation

### Vesak Full Moon Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Name | Vesak Full Moon Poya | Most sacred Buddhist festival |
| Type | RELIGIOUS | Religious holiday |
| Start Date | May 23, 2026 | Variable (full moon) |
| End Date | May 25, 2026 | 3-day celebration |
| Impact Factor | 1.8x | Significant religious demand |
| Recurring | True | Annual lunar event |

### Buddhist Poya Day Calendar

```
Full Moon Poya Days (Buddhist Calendar)
├── Duruthu Poya (January)
├── Navam Poya (February)
├── Medin Poya (March)
├── Bak Poya (April)
├── Vesak Poya (May) ★ Most Important
├── Poson Poya (June) ★ Second Most Important
├── Esala Poya (July)
├── Nikini Poya (August)
├── Binara Poya (September)
├── Vap Poya (October)
├── Il Poya (November)
└── Unduvap Poya (December)
```

### Vesak Celebration Timeline

| Day | Date (2026) | Activities | Demand Impact |
|-----|-------------|------------|---------------|
| Preparation | May 15-22 | Lantern making, decorations | 1.3x |
| Vesak Eve | May 22 | Setup, shopping | 1.5x |
| Vesak Day | May 23 | Religious observances, dansala | 1.8x |
| Weekend | May 24-25 | Family visits, viewing lanterns | 1.6x |
| Post-Vesak | May 26-27 | Return to normal | 1.2x |

### Lunar Calendar Calculation

```
Vesak Date Calculation (Simplified)
├── Identify May full moon
├── Full moon algorithm (complex)
├── Account for time zone (Asia/Colombo)
└── Result: Full moon date in May

2024-2030 Vesak Dates (Calculated)
├── 2024: May 23
├── 2025: May 12
├── 2026: May 23 ← Current
├── 2027: May 11
├── 2028: May 30
├── 2029: May 19
└── 2030: May 8
```

### Vesak Retail Impact

| Product Category | Impact Factor | Demand Drivers |
|------------------|---------------|----------------|
| Religious Items | 3.0x | Buddha statues, oil lamps, incense |
| Decorations | 2.5x | Lanterns, lights, decorative items |
| Food Supplies | 1.8x | Dansala (free food distribution) |
| Clothing | 1.5x | White clothing for temple visits |
| General Retail | 1.8x | Overall increased activity |

### Migration Structure

```
add_vesak_poya(apps, schema_editor)
├── Get Festival model from apps.get_model()
├── Create festival data dict
│   ├── festival_name = "Vesak Full Moon Poya"
│   ├── festival_type = "RELIGIOUS"
│   ├── date_start = date(2026, 5, 23)
│   ├── date_end = date(2026, 5, 25)
│   ├── impact_factor = 1.8
│   └── is_recurring = True
├── Use get_or_create(defaults=data)
└── Log success

remove_vesak_poya(apps, schema_editor)
├── Get Festival model
├── Filter by name
├── Delete if exists
└── Log deletion
```

### Future Enhancement: Lunar Calculation

| Approach | Complexity | Accuracy | Implementation |
|----------|------------|----------|----------------|
| Manual Update | Low | High | Update dates annually via admin |
| Astronomy Library | High | Very High | Use ephem or skyfield library |
| API Service | Medium | High | Call lunar calendar API |
| Pre-calculated Table | Low | High | Store dates for 10+ years |

### Expected Outcome
- Vesak Full Moon Poya festival added to database
- Variable lunar date documented (May 23-25, 2026)
- Impact factor set to 1.8x
- Festival marked as recurring
- Documentation notes lunar calculation requirement
- Migration applied successfully

### Verification Checklist
- [ ] Data migration created for Vesak Poya
- [ ] Festival name: "Vesak Full Moon Poya"
- [ ] Type: RELIGIOUS
- [ ] Dates: May 23-25, 2026 (calculated from lunar calendar)
- [ ] Impact factor: 1.8
- [ ] is_recurring: True
- [ ] Lunar calendar calculation documented
- [ ] Migration applied successfully
- [ ] Festival visible in Django admin
- [ ] Date accuracy verified against lunar calendar

---

## Task 43: Create Poson Full Moon

### Overview
Add Poson Full Moon Poya festival data to the database. Poson commemorates the introduction of Buddhism to Sri Lanka in 236 BCE, making it the second most important Buddhist festival. It occurs on the full moon day in June (variable date based on lunar calendar). The festival has moderate retail impact (1.5x) with a 2-day celebration period focused on religious observances and pilgrimages to Mihintale.

### Dependencies
- Task 40: Create FestivalCalendar
- Task 42: Create Vesak Full Moon (for migration sequencing)

### Instructions

1. **Create data migration file**
   - Create Django data migration
   - Name: `0XXX_add_poson_poya.py`
   - Sequence after Vesak migration
   - Use `RunPython` for data insertion

2. **Calculate 2026 Poson date**
   - Poson occurs on June full moon
   - 2026 Poson: June 22 (Monday)
   - Duration: June 22-23 (2 days)
   - Verify lunar calendar calculation

3. **Define festival data**
   - Festival Name: "Poson Full Moon Poya"
   - Festival Type: RELIGIOUS
   - Date Start: June 22, 2026
   - Date End: June 23, 2026
   - Impact Factor: 1.5 (moderate religious festival)
   - Is Recurring: True (annual lunar event)

4. **Document historical significance**
   - Add comments about Poson's historical importance
   - Note that Arahat Mahinda brought Buddhism to Sri Lanka
   - Explain Mihintale pilgrimage tradition
   - Less commercial than Vesak but still significant

5. **Implement migration function**
   - Create `add_poson_poya` function
   - Use `get_or_create()` to avoid duplicates
   - Set all field values
   - Include historical context in comments

6. **Add reverse migration**
   - Create `remove_poson_poya` function
   - Delete festival by name
   - Enable rollback

7. **Apply migration**
   - Run migrate command
   - Verify festival created
   - Check date accuracy

8. **Compare with Vesak**
   - Note impact factor is lower than Vesak (1.5x vs 1.8x)
   - Shorter duration (2 days vs 3 days)
   - More focused on religious observance
   - Less commercial activity

### Poson Full Moon Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Name | Poson Full Moon Poya | Introduction of Buddhism to Sri Lanka |
| Type | RELIGIOUS | Religious holiday |
| Start Date | June 22, 2026 | Variable (full moon) |
| End Date | June 23, 2026 | 2-day celebration |
| Impact Factor | 1.5x | Moderate religious demand |
| Recurring | True | Annual lunar event |

### Poson Historical Context

```
Historical Timeline
├── 236 BCE: Poson Full Moon Day
│   ├── Arahat Mahinda arrives at Mihintale
│   ├── Meets King Devanampiyatissa
│   └── Introduces Buddhism to Sri Lanka
├── Significance
│   ├── Beginning of Buddhist history in Sri Lanka
│   ├── Foundation of Buddhist civilization
│   └── Cultural transformation
└── Modern Celebration
    ├── Pilgrimage to Mihintale
    ├── Religious observances
    └── Temple activities
```

### Poson vs Vesak Comparison

| Aspect | Vesak | Poson | Difference |
|--------|-------|-------|------------|
| Significance | Buddha's life events | Buddhism's arrival | More universal vs local |
| Impact Factor | 1.8x | 1.5x | Higher vs moderate |
| Duration | 3 days | 2 days | Longer vs shorter |
| Commercial Activity | High | Moderate | More vs less shopping |
| Focus | Lanterns, dansala | Pilgrimage, devotion | Visual vs spiritual |
| Tourism | High | Moderate (Mihintale) | Wider vs specific location |

### Poson Celebration Timeline

| Day | Date (2026) | Activities | Demand Impact |
|-----|-------------|------------|---------------|
| Preparation | June 15-21 | Temple preparation | 1.1x |
| Poson Eve | June 21 | Travel to Mihintale, shopping | 1.3x |
| Poson Day | June 22 | Pilgrimage, religious observances | 1.5x |
| Poson Holiday | June 23 | Continued observances | 1.4x |
| Post-Poson | June 24-25 | Return to normal | 1.1x |

### Lunar Calendar Dates (2024-2030)

```
Poson Poya Dates
├── 2024: June 21
├── 2025: June 11
├── 2026: June 22 ← Current
├── 2027: June 10
├── 2028: June 29
├── 2029: June 17
└── 2030: June 7
```

### Retail Impact by Category

| Product Category | Impact Factor | Demand Drivers |
|------------------|---------------|----------------|
| Religious Items | 2.0x | Temple offerings, incense |
| White Clothing | 1.8x | Temple visit attire |
| Travel/Transport | 1.6x | Pilgrimage to Mihintale |
| Food Supplies | 1.4x | Temple dansala provisions |
| General Retail | 1.5x | Overall increased activity |

### Mihintale Pilgrimage Impact

```
Mihintale Pilgrimage (June 22)
├── Expected Pilgrims: 100,000+
├── Economic Impact
│   ├── Local retail surge near Mihintale
│   ├── Transportation demand increase
│   ├── Food/beverage demand increase
│   └── Accommodation bookings
└── Regional Distribution
    ├── Anuradhapura district: High impact
    ├── Colombo: Moderate impact (departures)
    └── National: Moderate impact
```

### Migration Implementation

```
add_poson_poya(apps, schema_editor)
├── Festival.objects.get_or_create(
│       festival_name="Poson Full Moon Poya",
│       defaults={
│           'festival_type': 'RELIGIOUS',
│           'date_start': date(2026, 6, 22),
│           'date_end': date(2026, 6, 23),
│           'impact_factor': 1.5,
│           'is_recurring': True
│       }
│   )
└── Created: True/False

remove_poson_poya(apps, schema_editor)
├── Festival.objects.filter(
│       festival_name="Poson Full Moon Poya"
│   ).delete()
└── Deleted: (count, dict)
```

### Expected Outcome
- Poson Full Moon Poya festival added to database
- Variable lunar date documented (June 22-23, 2026)
- Impact factor set to 1.5x (moderate)
- Historical significance documented
- Festival marked as recurring
- Migration applied successfully

### Verification Checklist
- [ ] Data migration created for Poson Poya
- [ ] Festival name: "Poson Full Moon Poya"
- [ ] Type: RELIGIOUS
- [ ] Dates: June 22-23, 2026
- [ ] Impact factor: 1.5
- [ ] is_recurring: True
- [ ] Historical context documented
- [ ] Migration applied successfully
- [ ] Festival visible in Django admin
- [ ] Impact factor appropriate (lower than Vesak)

---

## Task 44: Create Deepavali

### Overview
Add Deepavali (Diwali) festival data to the database. Deepavali is the major Hindu festival of lights celebrated by Sri Lankan Tamil community. It occurs in October or November (variable date based on Hindu lunar calendar). The festival has significant retail impact (2.0x) with a 3-day celebration period featuring lamp lighting, fireworks, shopping for new clothes, and sweet distribution.

### Dependencies
- Task 40: Create FestivalCalendar
- Task 43: Create Poson Full Moon (for migration sequencing)

### Instructions

1. **Create data migration file**
   - Create Django data migration
   - Name: `0XXX_add_deepavali.py`
   - Sequence after Poson migration
   - Use `RunPython` for data insertion

2. **Calculate 2026 Deepavali date**
   - Deepavali occurs on new moon day (Amavasya) in October/November
   - 2026 Deepavali: October 28 (Wednesday)
   - Duration: October 28-30 (3 days)
   - Verify Hindu calendar calculation

3. **Define festival data**
   - Festival Name: "Deepavali"
   - Festival Type: RELIGIOUS
   - Date Start: October 28, 2026
   - Date End: October 30, 2026
   - Impact Factor: 2.0 (significant Hindu festival)
   - Is Recurring: True (annual lunar event)

4. **Document cultural significance**
   - Add comments about Deepavali's meaning (victory of light over darkness)
   - Note Tamil community celebration traditions
   - Explain high retail impact (new clothes, sweets, fireworks)
   - Document regional concentration (Northern, Eastern provinces)

5. **Implement migration function**
   - Create `add_deepavali` function
   - Use `get_or_create()` to avoid duplicates
   - Set all field values
   - Include cultural context in comments

6. **Add reverse migration**
   - Create `remove_deepavali` function
   - Delete festival by name
   - Enable rollback

7. **Apply migration**
   - Run migrate command
   - Verify festival created
   - Check date accuracy

8. **Note regional impact variation**
   - Higher impact in Northern/Eastern provinces
   - Moderate impact nationally
   - Consider adding regional multipliers in future
   - Document for forecasting engine awareness

### Deepavali Festival Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Name | Deepavali | Festival of Lights |
| Type | RELIGIOUS | Hindu religious festival |
| Start Date | October 28, 2026 | Variable (Hindu calendar) |
| End Date | October 30, 2026 | 3-day celebration |
| Impact Factor | 2.0x | Significant retail demand |
| Recurring | True | Annual lunar event |

### Deepavali Cultural Significance

```
Festival of Lights
├── Religious Meaning
│   ├── Victory of light over darkness
│   ├── Good over evil
│   ├── Knowledge over ignorance
│   └── Lord Rama's return to Ayodhya
├── Celebration Practices
│   ├── Oil lamp lighting (deepa)
│   ├── Fireworks and sparklers
│   ├── New clothes purchase
│   ├── Sweet preparation and distribution
│   └── Family gatherings
└── Community Impact
    ├── Brings Tamil community together
    ├── Shared cultural celebration
    └── Economic activity boost
```

### Deepavali Timeline

| Day | Date (2026) | Activities | Demand Impact |
|-----|-------------|------------|---------------|
| Pre-Festival | Oct 20-27 | Shopping (clothes, sweets, lamps) | 1.5x |
| Deepavali Eve | Oct 27 | Final preparations, decorations | 1.8x |
| Deepavali Day | Oct 28 | Main celebration, fireworks | 2.0x |
| Post-Deepavali | Oct 29-30 | Family visits, continued celebrations | 1.7x |
| Return to Normal | Oct 31 | Back to baseline | 1.1x |

### Hindu Lunar Calendar Calculation

```
Deepavali Date Calculation
├── Occurs on Amavasya (new moon)
├── In Hindu month Kartik
├── Approximately Oct-Nov in Gregorian calendar
├── Date varies by 20-30 days year to year
└── Requires Hindu calendar calculation

2024-2030 Deepavali Dates
├── 2024: November 1
├── 2025: October 20
├── 2026: October 28 ← Current
├── 2027: October 17
├── 2028: November 5
├── 2029: October 25
└── 2030: October 14
```

### Retail Impact by Category

| Product Category | Impact Factor | Demand Drivers |
|------------------|---------------|----------------|
| Clothing | 2.5x | New clothes tradition |
| Sweets/Snacks | 2.3x | Gift giving, celebrations |
| Fireworks | 3.0x | Core celebration element |
| Oil Lamps | 2.8x | Traditional lighting |
| Decorations | 2.0x | Home decoration |
| Gold/Jewelry | 2.2x | Auspicious purchases |
| General Retail | 2.0x | Overall increased activity |

### Regional Impact Distribution

```
Sri Lanka Deepavali Impact by Region
├── Northern Province (Jaffna, Kilinochchi, Mannar)
│   └── Impact: 3.0x (High Tamil population)
├── Eastern Province (Batticaloa, Trincomalee)
│   └── Impact: 2.5x (Significant Tamil population)
├── Colombo (Capital)
│   └── Impact: 2.0x (Diverse population)
├── Western Province (Urban areas)
│   └── Impact: 1.8x (Tamil community present)
└── Other Regions
    └── Impact: 1.3x (Lower Tamil concentration)
```

### Deepavali vs Other Festivals

| Festival | Type | Impact | Duration | Community |
|----------|------|--------|----------|-----------|
| Deepavali | Hindu | 2.0x | 3 days | Tamil (15% population) |
| Vesak | Buddhist | 1.8x | 3 days | Sinhala/Buddhist (70%) |
| Christmas | Christian | 2.2x | 7 days | Christian (7%) + General |
| Sinhala New Year | Cultural | 2.5x | 7 days | National (all communities) |

### Migration Code Pattern

```
Data Migration Structure
├── Forward Migration (add_deepavali)
│   ├── Get Festival model from apps registry
│   ├── Prepare festival data dictionary
│   ├── Use get_or_create() with defaults
│   ├── Handle duplicate gracefully
│   └── Log creation result
│
└── Reverse Migration (remove_deepavali)
    ├── Get Festival model from apps registry
    ├── Filter by exact festival name
    ├── Delete if exists
    └── Log deletion result
```

### Expected Outcome
- Deepavali festival added to database
- Variable Hindu calendar date documented (Oct 28-30, 2026)
- Impact factor set to 2.0x (significant)
- Cultural significance documented
- Regional impact variation noted
- Migration applied successfully

### Verification Checklist
- [ ] Data migration created for Deepavali
- [ ] Festival name: "Deepavali"
- [ ] Type: RELIGIOUS
- [ ] Dates: October 28-30, 2026
- [ ] Impact factor: 2.0
- [ ] is_recurring: True
- [ ] Hindu calendar calculation documented
- [ ] Cultural significance documented
- [ ] Regional variation noted
- [ ] Migration applied successfully
- [ ] Festival visible in Django admin

---

## Task 45: Create Christmas

### Overview
Add Christmas festival data to the database. Christmas is celebrated by Sri Lankan Christian community and has become a widely observed commercial season. It occurs on December 25 annually (fixed date). The festival has high retail impact (2.2x) with an extended 7-day celebration period (December 20-26) due to gift shopping, decorations, and general festive season commercialization affecting all communities.

### Dependencies
- Task 40: Create FestivalCalendar
- Task 44: Create Deepavali (for migration sequencing)

### Instructions

1. **Create data migration file**
   - Create Django data migration
   - Name: `0XXX_add_christmas.py`
   - Sequence after Deepavali migration
   - Use `RunPython` for data insertion

2. **Define festival data**
   - Festival Name: "Christmas"
   - Festival Type: RELIGIOUS
   - Date Start: December 20, 2026 (extended season start)
   - Date End: December 26, 2026 (including Boxing Day)
   - Impact Factor: 2.2 (high commercial season)
   - Is Recurring: True (annual fixed date)

3. **Document commercial impact**
   - Note that Christmas has transcended religious boundaries
   - Explain commercial season affects all communities
   - Document shopping patterns (gifts, decorations, food)
   - Note year-end shopping surge combines with Christmas

4. **Implement migration function**
   - Create `add_christmas` function
   - Use `get_or_create()` to avoid duplicates
   - Set all field values
   - Include commercial context in comments

5. **Add reverse migration**
   - Create `remove_christmas` function
   - Delete festival by name
   - Enable rollback

6. **Apply migration**
   - Run migrate command
   - Verify festival created
   - Check date range (Dec 20-26)

7. **Document extended period rationale**
   - Explain why 7-day period (not just Dec 25)
   - Pre-Christmas shopping (Dec 20-24)
   - Christmas Day (Dec 25)
   - Boxing Day (Dec 26)
   - Captures full demand surge period

### Christmas Festival Details

| Attribute | Value | Explanation |
|-----------|-------|-------------|
| Name | Christmas | Christian religious festival |
| Type | RELIGIOUS | Religious origin, commercial extension |
| Start Date | December 20, 2026 | Extended season start |
| End Date | December 26, 2026 | Including Boxing Day |
| Impact Factor | 2.2x | High retail season |
| Recurring | True | Annual fixed date |

### Christmas Season Timeline

```
Extended Christmas Period
├── Pre-Christmas (Dec 1-19)
│   ├── Gradual increase in shopping
│   ├── Decorations go up
│   └── Impact: 1.3x - 1.5x
│
├── Main Christmas Period (Dec 20-26)
│   ├── Dec 20-24: Peak shopping days
│   │   ├── Last-minute gift purchases
│   │   ├── Food and beverage stocking
│   │   └── Impact: 2.2x - 2.5x
│   ├── Dec 25: Christmas Day
│   │   ├── Family gatherings
│   │   ├── Restaurants, entertainment
│   │   └── Impact: 1.8x
│   └── Dec 26: Boxing Day
│       ├── Sales and promotions
│       ├── Entertainment outings
│       └── Impact: 2.0x
│
└── Post-Christmas (Dec 27-31)
    ├── Year-end sales
    ├── New Year preparations
    └── Impact: 1.6x - 1.8x
```

### Christmas Retail Impact

| Product Category | Impact Factor | Peak Days | Demand Drivers |
|------------------|---------------|-----------|----------------|
| Gifts | 3.0x | Dec 20-24 | Gift-giving tradition |
| Decorations | 2.5x | Dec 1-20 | Home and shop decorations |
| Food/Beverages | 2.3x | Dec 20-25 | Family meals, parties |
| Clothing | 2.0x | Dec 15-24 | New clothes for season |
| Electronics | 2.2x | Dec 20-24 | Popular gift items |
| Toys | 3.5x | Dec 20-24 | Children's gifts |
| General Retail | 2.2x | Dec 20-26 | Overall surge |

### Why Impact Factor is 2.2x

```
Impact Factor Justification
├── Religious Significance (15%)
│   └── Christian community (7% of population)
│
├── Commercial Significance (50%)
│   ├── Gift-giving culture adopted widely
│   ├── Year-end shopping season
│   ├── Salary bonuses spent
│   └── Sales and promotions
│
├── Social Significance (20%)
│   ├── School holidays
│   ├── Office closures
│   └── Family time
│
└── Tourism Impact (15%)
│   ├── Tourist arrivals peak
│   ├── Hotel bookings surge
│   └── Entertainment demand
│
Total: High impact across demographics = 2.2x
```

### Christmas vs New Year Overlap

| Period | Festival | Impact | Notes |
|--------|----------|--------|-------|
| Dec 20-26 | Christmas | 2.2x | Main Christmas impact |
| Dec 27-30 | Transition | 1.8x | Post-Christmas, pre-New Year |
| Dec 31 | New Year Eve | 2.0x | Celebrations, parties |
| Jan 1 | New Year Day | 1.5x | Recovery day |

### Multi-Community Appeal

```
Christmas Impact by Community
├── Christian Community (7%)
│   ├── Religious observance
│   ├── Church services
│   └── Family celebrations
│   └── Impact: 3.0x (core celebration)
│
├── Other Communities (93%)
│   ├── Commercial participation
│   ├── Gift exchange
│   ├── Festive meals
│   └── Impact: 2.0x (cultural adoption)
│
└── National Average
    └── Weighted Impact: 2.2x
```

### Extended Period Rationale

| Date Range | Rationale | Primary Activities |
|------------|-----------|-------------------|
| Dec 20-24 | Pre-Christmas shopping surge | Gift buying, food shopping |
| Dec 25 | Christmas Day | Religious services, family gatherings |
| Dec 26 | Boxing Day (public holiday) | Sales shopping, entertainment |
| Total: 7 days | Captures full demand cycle | Complete impact period |

### Migration Implementation

```
add_christmas(apps, schema_editor)
├── Festival.objects.get_or_create(
│       festival_name="Christmas",
│       defaults={
│           'festival_type': 'RELIGIOUS',
│           'date_start': date(2026, 12, 20),
│           'date_end': date(2026, 12, 26),
│           'impact_factor': 2.2,
│           'is_recurring': True
│       }
│   )
├── Log: "Created Christmas festival"
└── Return: (festival_obj, created_boolean)

remove_christmas(apps, schema_editor)
├── Festival.objects.filter(
│       festival_name="Christmas"
│   ).delete()
├── Log: "Removed Christmas festival"
└── Return: (count, details_dict)
```

### Expected Outcome
- Christmas festival added to database
- Extended period (Dec 20-26) captures full impact
- Impact factor set to 2.2x (high commercial season)
- Multi-community appeal documented
- Fixed annual date (no calculation needed)
- Migration applied successfully

### Verification Checklist
- [ ] Data migration created for Christmas
- [ ] Festival name: "Christmas"
- [ ] Type: RELIGIOUS
- [ ] Dates: December 20-26, 2026 (7-day period)
- [ ] Impact factor: 2.2
- [ ] is_recurring: True
- [ ] Extended period rationale documented
- [ ] Commercial impact explained
- [ ] Migration applied successfully
- [ ] Festival visible in Django admin
- [ ] Date range verified (includes Boxing Day)

---

## Task 46: Create get_festivals Method

### Overview
Implement the `get_festivals` method in FestivalCalendar service to retrieve all festivals within a specified date range. This method is essential for demand forecasting as it identifies which festivals affect a given prediction period. The method efficiently queries festivals whose dates overlap with the provided range and returns a sorted list of Festival objects.

### Dependencies
- Task 45: Create Christmas (all festivals populated)

### Instructions

1. **Define method signature**
   - Create classmethod or static method `get_festivals`
   - Parameters: `start_date` (date), `end_date` (date)
   - Return type: List[Festival]
   - Add type hints for clarity

2. **Implement date range query**
   - Query Festival model for overlapping festivals
   - Use Django ORM Q objects for complex filtering
   - Filter: `(date_start <= end_date) AND (date_end >= start_date)`
   - This captures all overlapping festivals

3. **Add ordering**
   - Order results by date_start, then by festival_name
   - Chronological order helps forecasting logic
   - Use `.order_by('date_start', 'festival_name')`

4. **Add input validation**
   - Validate start_date and end_date are not None
   - Validate end_date >= start_date
   - Raise ValueError for invalid inputs
   - Provide clear error messages

5. **Implement caching (optional)**
   - Cache results for frequently queried ranges
   - Use Django cache framework
   - Cache key: f"festivals_{start_date}_{end_date}"
   - Cache duration: 24 hours

6. **Add method docstring**
   - Document method purpose
   - Explain parameters and return value
   - Include usage examples
   - Note overlap detection logic

7. **Add logging**
   - Log method calls for debugging
   - Log number of festivals found
   - Log date range being queried
   - Use appropriate log level (DEBUG)

8. **Test with sample queries**
   - Test with April range (should find Sinhala New Year)
   - Test with December range (should find Christmas)
   - Test with empty range (should return empty list)
   - Test with overlapping festivals

### Method Signature

```
Method Definition
─────────────────
@classmethod
def get_festivals(
    cls,
    start_date: date,
    end_date: date
) -> List[Festival]:
    """
    Retrieve all festivals within the specified date range.
    
    Args:
        start_date: Start of date range (inclusive)
        end_date: End of date range (inclusive)
    
    Returns:
        List of Festival objects overlapping with the range
    """
```

### Overlap Detection Logic

```
Festival Overlap Detection
──────────────────────────
Query Date Range: April 10 - April 20

Festival A: April 5 - April 12
├── date_start (Apr 5) <= end_date (Apr 20) ✓
├── date_end (Apr 12) >= start_date (Apr 10) ✓
└── INCLUDED (overlaps: Apr 10-12)

Festival B: April 13 - April 19
├── date_start (Apr 13) <= end_date (Apr 20) ✓
├── date_end (Apr 19) >= start_date (Apr 10) ✓
└── INCLUDED (fully within range)

Festival C: April 25 - April 27
├── date_start (Apr 25) <= end_date (Apr 20) ✗
└── EXCLUDED (after range)

Festival D: April 1 - April 5
├── date_end (Apr 5) >= start_date (Apr 10) ✗
└── EXCLUDED (before range)
```

### Django ORM Query Pattern

| Query Type | ORM Expression | Result |
|------------|----------------|--------|
| Overlapping | `Q(date_start__lte=end_date) & Q(date_end__gte=start_date)` | All overlapping festivals |
| Within Range | `Q(date_start__gte=start_date) & Q(date_end__lte=end_date)` | Fully contained festivals |
| Starting In | `Q(date_start__range=(start_date, end_date))` | Festivals starting in range |
| Ending In | `Q(date_end__range=(start_date, end_date))` | Festivals ending in range |

### Usage Examples

```
Example 1: April 2026 Festivals
────────────────────────────────
festivals = FestivalCalendar.get_festivals(
    start_date=date(2026, 4, 1),
    end_date=date(2026, 4, 30)
)
# Returns: [<Festival: Sinhala/Tamil New Year (Apr 13-19)>]

Example 2: Year-End Festivals
──────────────────────────────
festivals = FestivalCalendar.get_festivals(
    start_date=date(2026, 12, 1),
    end_date=date(2026, 12, 31)
)
# Returns: [<Festival: Christmas (Dec 20-26)>]

Example 3: Multi-Festival Period
─────────────────────────────────
festivals = FestivalCalendar.get_festivals(
    start_date=date(2026, 5, 1),
    end_date=date(2026, 6, 30)
)
# Returns: [
#     <Festival: Vesak Full Moon Poya (May 23-25)>,
#     <Festival: Poson Full Moon Poya (Jun 22-23)>
# ]
```

### Input Validation

| Validation | Check | Error Message |
|------------|-------|---------------|
| start_date not None | `if start_date is None` | "start_date cannot be None" |
| end_date not None | `if end_date is None` | "end_date cannot be None" |
| Valid date order | `if end_date < start_date` | "end_date must be >= start_date" |
| Date type | `if not isinstance(start_date, date)` | "start_date must be date object" |

### Performance Considerations

```
Query Optimization
──────────────────
├── Database Indexes
│   ├── date_start (indexed in model)
│   ├── date_end (indexed in model)
│   └── Enables fast range queries
│
├── Query Efficiency
│   ├── Simple Q object filter
│   ├── Single database hit
│   └── ~1-5ms query time
│
└── Caching (Optional)
    ├── Cache frequent queries
    ├── Reduce database load
    └── 10-100x faster for cached results
```

### Method Implementation Flow

```
get_festivals(start_date, end_date)
    │
    ▼
Validate Inputs
├── Check dates not None
├── Check end_date >= start_date
└── Raise ValueError if invalid
    │
    ▼
Build Query
├── Q(date_start__lte=end_date)
├── Q(date_end__gte=start_date)
└── Combine with AND
    │
    ▼
Execute Query
├── Festival.objects.filter(query)
├── .order_by('date_start', 'festival_name')
└── Convert to list
    │
    ▼
Return Results
└── List[Festival]
```

### Expected Outcome
- get_festivals method implemented in FestivalCalendar
- Method accepts start_date and end_date parameters
- Returns list of Festival objects overlapping with range
- Proper input validation and error handling
- Results sorted chronologically
- Method documented with docstring

### Verification Checklist
- [ ] get_festivals method defined in FestivalCalendar class
- [ ] Method accepts start_date and end_date parameters
- [ ] Return type hint: List[Festival]
- [ ] Overlap detection query implemented correctly
- [ ] Input validation for dates
- [ ] Results ordered by date_start
- [ ] Method docstring complete
- [ ] Tested with April range (finds Sinhala New Year)
- [ ] Tested with December range (finds Christmas)
- [ ] Tested with May-June range (finds Vesak and Poson)

---

## Task 47: Create get_impact Method

### Overview
Implement the `get_impact` method in FestivalCalendar service to calculate the demand impact factor for a specific date. This method checks if the given date falls within any festival period and returns the appropriate impact factor. When multiple festivals overlap, it returns the maximum impact factor. This method is the core interface between the festival calendar and the demand forecasting engine.

### Dependencies
- Task 46: Create get_festivals Method

### Instructions

1. **Define method signature**
   - Create classmethod or static method `get_impact`
   - Parameter: `target_date` (date)
   - Return type: float
   - Add type hints for clarity

2. **Implement date checking logic**
   - Query festivals where target_date is within [date_start, date_end]
   - Use Django filter: `date_start__lte=target_date, date_end__gte=target_date`
   - Retrieve impact_factor values from matching festivals

3. **Handle multiple overlapping festivals**
   - If multiple festivals overlap, take maximum impact
   - Use Python max() function on impact factors
   - Rationale: Higher impact dominates demand

4. **Handle no festival case**
   - If no festivals on target_date, return 1.0 (baseline)
   - 1.0 means no impact adjustment (100% of normal demand)
   - Default impact factor from model

5. **Add input validation**
   - Validate target_date is not None
   - Validate target_date is date object
   - Raise ValueError for invalid input

6. **Add method docstring**
   - Document method purpose
   - Explain parameter and return value
   - Include examples for festival and non-festival dates
   - Explain maximum impact for overlaps

7. **Add logging**
   - Log method calls with date
   - Log found festivals and impact
   - Use DEBUG log level

8. **Test with sample dates**
   - Test April 15 (Sinhala New Year, expect 2.5)
   - Test July 10 (no festival, expect 1.0)
   - Test May 23 (Vesak, expect 1.8)
   - Test overlapping date scenario (if any)

### Method Signature

```
Method Definition
─────────────────
@classmethod
def get_impact(cls, target_date: date) -> float:
    """
    Calculate demand impact factor for a specific date.
    
    Args:
        target_date: Date to check for festival impact
    
    Returns:
        Float impact factor (1.0 = normal, >1.0 = increased demand)
        Returns maximum impact if multiple festivals overlap
    """
```

### Impact Calculation Logic

```
Impact Calculation Flow
───────────────────────
Input: target_date = 2026-04-15

Step 1: Query festivals containing date
└── WHERE date_start <= '2026-04-15'
    AND date_end >= '2026-04-15'
    
Step 2: Found festivals
└── Sinhala/Tamil New Year (Apr 13-19, impact: 2.5)

Step 3: Extract impact factors
└── [2.5]

Step 4: Get maximum impact
└── max([2.5]) = 2.5

Step 5: Return impact
└── 2.5

Example with no festival:
Input: target_date = 2026-07-10
└── No festivals found
└── Return default: 1.0
```

### Overlapping Festival Scenarios

| Scenario | Festivals | Impact Factors | Result | Logic |
|----------|-----------|----------------|--------|-------|
| Single Festival | Sinhala New Year | [2.5] | 2.5 | Only one impact |
| No Festival | None | [] | 1.0 | Default baseline |
| Two Overlapping | Festival A, Festival B | [2.0, 1.5] | 2.0 | max(2.0, 1.5) |
| Three Overlapping | Festival A, B, C | [1.8, 2.2, 1.5] | 2.2 | max(1.8, 2.2, 1.5) |

### Sample Test Cases

```
Test Case 1: Sinhala New Year Period
─────────────────────────────────────
Date: 2026-04-15 (within Apr 13-19)
Expected: 2.5
Actual: FestivalCalendar.get_impact(date(2026, 4, 15))
Result: 2.5 ✓

Test Case 2: Normal Day
───────────────────────
Date: 2026-07-10 (no festival)
Expected: 1.0
Actual: FestivalCalendar.get_impact(date(2026, 7, 10))
Result: 1.0 ✓

Test Case 3: Vesak Poya
───────────────────────
Date: 2026-05-23 (Vesak day)
Expected: 1.8
Actual: FestivalCalendar.get_impact(date(2026, 5, 23))
Result: 1.8 ✓

Test Case 4: Christmas Period
──────────────────────────────
Date: 2026-12-24 (within Dec 20-26)
Expected: 2.2
Actual: FestivalCalendar.get_impact(date(2026, 12, 24))
Result: 2.2 ✓
```

### Integration with Forecasting Engine

```
Demand Forecasting Integration
───────────────────────────────
Forecasting Engine
    │
    ▼
For each prediction date:
    ├── Get base demand (from historical data)
    ├── Get festival impact (FestivalCalendar.get_impact(date))
    ├── Calculate: adjusted_demand = base_demand × impact
    └── Store adjusted prediction
    
Example:
────────
Date: 2026-04-15
Base Demand: 1000 units
Festival Impact: 2.5 (Sinhala New Year)
Adjusted Demand: 1000 × 2.5 = 2500 units
```

### Performance Optimization

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Index Usage | Query uses indexed date fields | Fast lookups |
| values_list | Use `.values_list('impact_factor', flat=True)` | Reduce data transfer |
| Query Efficiency | Single database hit | Minimize latency |
| Caching | Cache recent queries | Avoid repeated DB access |

### Query Pattern

```
Django ORM Query
────────────────
Festival.objects.filter(
    date_start__lte=target_date,
    date_end__gte=target_date
).values_list('impact_factor', flat=True)

SQL Translation
───────────────
SELECT impact_factor
FROM ai_festival
WHERE date_start <= '2026-04-15'
  AND date_end >= '2026-04-15';
```

### Edge Cases

| Edge Case | Scenario | Expected Behavior |
|-----------|----------|-------------------|
| Exact start date | target_date = festival.date_start | Include festival |
| Exact end date | target_date = festival.date_end | Include festival |
| One-day festival | date_start = date_end = target_date | Include festival |
| Multiple same impact | Two festivals, both 2.0x | Return 2.0 (max) |
| Empty database | No festivals in database | Return 1.0 (default) |

### Method Implementation Pseudocode

```
def get_impact(target_date):
    # Validate input
    if target_date is None:
        raise ValueError("target_date cannot be None")
    
    # Query festivals
    impact_factors = Festival.objects.filter(
        date_start__lte=target_date,
        date_end__gte=target_date
    ).values_list('impact_factor', flat=True)
    
    # Calculate result
    if impact_factors:
        return max(impact_factors)
    else:
        return 1.0  # Default baseline
```

### Expected Outcome
- get_impact method implemented in FestivalCalendar
- Method accepts single target_date parameter
- Returns float impact factor for the date
- Returns maximum impact for overlapping festivals
- Returns 1.0 for dates with no festivals
- Proper input validation and error handling

### Verification Checklist
- [ ] get_impact method defined in FestivalCalendar class
- [ ] Method accepts target_date parameter
- [ ] Return type hint: float
- [ ] Query filters by date range correctly
- [ ] Returns maximum impact for overlaps
- [ ] Returns 1.0 for non-festival dates
- [ ] Input validation implemented
- [ ] Method docstring complete
- [ ] Tested with Sinhala New Year date (returns 2.5)
- [ ] Tested with normal date (returns 1.0)
- [ ] Tested with Vesak date (returns 1.8)
- [ ] Tested with Christmas date (returns 2.2)

---

## Task 48: Verify Festival Calendar

### Overview
Perform comprehensive verification of the festival calendar system to ensure all components work correctly together. This includes verifying all festivals are populated correctly, testing both service methods (get_festivals and get_impact) with various scenarios, validating data integrity, and confirming the system is ready for integration with the demand forecasting engine.

### Dependencies
- Task 47: Create get_impact Method

### Instructions

1. **Create verification script**
   - Create Python script or Django management command
   - Name: `verify_festival_calendar.py`
   - Location: `backend/apps/ai/forecasting/management/commands/`
   - Allows repeatable verification

2. **Verify all festivals exist**
   - Query Festival model count
   - Expected: At least 5 festivals (Sinhala New Year, Vesak, Poson, Deepavali, Christmas)
   - Print list of all festivals with details

3. **Verify festival data integrity**
   - Check all festivals have valid dates (date_end >= date_start)
   - Check all impact factors in range (1.0 to 3.0)
   - Check all festivals marked as recurring
   - Check no duplicate festival names

4. **Test get_festivals method**
   - Test with various date ranges
   - Verify correct festivals returned
   - Verify ordering (chronological)
   - Test edge cases (empty ranges, overlapping)

5. **Test get_impact method**
   - Test each major festival date
   - Verify correct impact factors returned
   - Test non-festival dates (expect 1.0)
   - Test overlapping scenarios

6. **Verify date calculations**
   - Check Sinhala New Year dates (April 13-19)
   - Check Vesak dates (May full moon)
   - Check Poson dates (June full moon)
   - Check Deepavali dates (Oct/Nov variable)
   - Check Christmas dates (Dec 20-26)

7. **Test forecasting integration**
   - Create simple forecast calculation
   - Apply festival impacts
   - Verify results make sense
   - Example: 1000 base × 2.5 impact = 2500 adjusted

8. **Generate verification report**
   - Print summary of all checks
   - List any issues found
   - Confirm system ready or list required fixes
   - Save report to file (optional)

9. **Document verification results**
   - Record verification date
   - List all tests performed
   - Note any issues and resolutions
   - Confirm system ready for production

### Verification Checklist Matrix

| Category | Test | Expected Result | Status |
|----------|------|-----------------|--------|
| **Data Integrity** |
| Festival Count | Count all festivals | ≥ 5 festivals | [ ] |
| Unique Names | Check duplicates | 0 duplicates | [ ] |
| Date Validity | date_end >= date_start | All valid | [ ] |
| Impact Range | 1.0 ≤ impact ≤ 3.0 | All in range | [ ] |
| Recurring Flag | All marked recurring | 100% recurring | [ ] |
| **Festival Details** |
| Sinhala New Year | Name, dates, impact | Apr 13-19, 2.5x | [ ] |
| Vesak Poya | Name, dates, impact | May 23-25, 1.8x | [ ] |
| Poson Poya | Name, dates, impact | Jun 22-23, 1.5x | [ ] |
| Deepavali | Name, dates, impact | Oct 28-30, 2.0x | [ ] |
| Christmas | Name, dates, impact | Dec 20-26, 2.2x | [ ] |
| **Service Methods** |
| get_festivals | April range | Returns Sinhala NY | [ ] |
| get_festivals | May-June range | Returns Vesak, Poson | [ ] |
| get_festivals | Empty range | Returns [] | [ ] |
| get_impact | April 15 | Returns 2.5 | [ ] |
| get_impact | July 10 | Returns 1.0 | [ ] |
| get_impact | May 23 | Returns 1.8 | [ ] |
| **Integration** |
| Forecast Calc | Base × impact | Correct adjustment | [ ] |

### Verification Script Structure

```
Verification Command
────────────────────
Command: python manage.py verify_festival_calendar

Output:
┌────────────────────────────────────────────────┐
│ Festival Calendar Verification Report         │
├────────────────────────────────────────────────┤
│ 1. Data Integrity Checks                      │
│    ✓ 5 festivals found                        │
│    ✓ No duplicate names                       │
│    ✓ All dates valid                          │
│    ✓ All impact factors in range              │
│                                                │
│ 2. Festival Details                           │
│    ✓ Sinhala/Tamil New Year: Apr 13-19, 2.5x  │
│    ✓ Vesak Full Moon Poya: May 23-25, 1.8x    │
│    ✓ Poson Full Moon Poya: Jun 22-23, 1.5x    │
│    ✓ Deepavali: Oct 28-30, 2.0x               │
│    ✓ Christmas: Dec 20-26, 2.2x               │
│                                                │
│ 3. Service Method Tests                       │
│    ✓ get_festivals works correctly            │
│    ✓ get_impact returns correct factors       │
│    ✓ Edge cases handled                       │
│                                                │
│ 4. Integration Tests                          │
│    ✓ Forecasting integration verified         │
│                                                │
│ Result: ✓ ALL CHECKS PASSED                   │
│ Festival Calendar is ready for production     │
└────────────────────────────────────────────────┘
```

### Sample Test Scenarios

```
Scenario 1: April 2026 Demand Forecast
───────────────────────────────────────
Period: April 1-30, 2026
Base Daily Demand: 1000 units

Calculation:
├── Apr 1-12: 1000 × 1.0 = 1000 units/day (no festival)
├── Apr 13-19: 1000 × 2.5 = 2500 units/day (Sinhala NY)
└── Apr 20-30: 1000 × 1.0 = 1000 units/day (no festival)

Total April Forecast: 30,500 units
└── (12 × 1000) + (7 × 2500) + (11 × 1000)

Scenario 2: Year-End Forecast
──────────────────────────────
Period: December 20-26, 2026
Base Daily Demand: 800 units

Calculation:
└── Dec 20-26: 800 × 2.2 = 1760 units/day (Christmas)

Total Christmas Period: 12,320 units
└── 7 × 1760
```

### Data Integrity Tests

```
Test 1: Date Validity
─────────────────────
for festival in Festival.objects.all():
    assert festival.date_end >= festival.date_start
    print(f"✓ {festival.festival_name}: Dates valid")

Test 2: Impact Factor Range
────────────────────────────
for festival in Festival.objects.all():
    assert 1.0 <= festival.impact_factor <= 3.0
    print(f"✓ {festival.festival_name}: Impact {festival.impact_factor} valid")

Test 3: Unique Names
────────────────────
names = Festival.objects.values_list('festival_name', flat=True)
assert len(names) == len(set(names))
print(f"✓ All {len(names)} festival names are unique")
```

### Expected Festival Summary

| Festival | Type | Dates (2026) | Duration | Impact | Status |
|----------|------|--------------|----------|--------|--------|
| Sinhala/Tamil New Year | CULTURAL | Apr 13-19 | 7 days | 2.5x | ✓ |
| Vesak Full Moon Poya | RELIGIOUS | May 23-25 | 3 days | 1.8x | ✓ |
| Poson Full Moon Poya | RELIGIOUS | Jun 22-23 | 2 days | 1.5x | ✓ |
| Deepavali | RELIGIOUS | Oct 28-30 | 3 days | 2.0x | ✓ |
| Christmas | RELIGIOUS | Dec 20-26 | 7 days | 2.2x | ✓ |

### Issues and Resolutions

| Potential Issue | Detection | Resolution |
|----------------|-----------|------------|
| Missing festival | Count < 5 | Run missing migrations |
| Wrong dates | Date verification fails | Update festival dates |
| Wrong impact | Impact out of range | Update impact_factor |
| Service error | Method test fails | Fix service implementation |
| Data corruption | Integrity check fails | Restore from migrations |

### Expected Outcome
- All festivals verified in database (minimum 5)
- All festival data validated (dates, impacts, types)
- Both service methods tested and working
- Integration with forecasting confirmed
- Verification report generated
- System confirmed ready for production use

### Verification Checklist
- [ ] Verification script or command created
- [ ] All 5 festivals exist in database
- [ ] No duplicate festival names
- [ ] All dates valid (end >= start)
- [ ] All impact factors in range 1.0-3.0
- [ ] All festivals marked as recurring
- [ ] get_festivals method tested with multiple ranges
- [ ] get_impact method tested with festival dates
- [ ] get_impact returns 1.0 for non-festival dates
- [ ] Forecasting integration test passed
- [ ] Verification report generated
- [ ] All issues (if any) documented and resolved
- [ ] System confirmed ready for Group D (Prediction Algorithms)

---

## Summary

This document completed the FestivalCalendar service and populated all major Sri Lankan festival data. The service provides two essential methods: get_festivals (retrieves festivals in date range) and get_impact (calculates demand impact for specific date). Five major festivals were populated with accurate dates, types, and impact factors: Sinhala New Year (2.5x), Vesak Poya (1.8x), Poson Poya (1.5x), Deepavali (2.0x), and Christmas (2.2x). The system has been verified and is ready to integrate with demand forecasting algorithms.

### Completed Tasks
1. ✓ Created FestivalCalendar service class with structure
2. ✓ Added Sinhala/Tamil New Year (April 13-19, 2.5x impact)
3. ✓ Added Vesak Full Moon Poya (May 23-25, 1.8x impact)
4. ✓ Added Poson Full Moon Poya (June 22-23, 1.5x impact)
5. ✓ Added Deepavali (October 28-30, 2.0x impact)
6. ✓ Added Christmas (December 20-26, 2.2x impact)
7. ✓ Implemented get_festivals method (date range queries)
8. ✓ Implemented get_impact method (impact factor calculation)
9. ✓ Verified complete festival calendar system

### System Capabilities
- Stores 5 major Sri Lankan festivals with accurate data
- Retrieves festivals within any date range
- Calculates demand impact for specific dates
- Handles overlapping festivals (maximum impact)
- Returns baseline (1.0) for non-festival dates
- Supports both fixed-date and lunar calendar festivals
- Ready for integration with forecasting algorithms

### Festival Impact Summary
- Highest Impact: Sinhala New Year (2.5x, 7 days)
- High Impact: Christmas (2.2x, 7 days), Deepavali (2.0x, 3 days)
- Moderate-High: Vesak Poya (1.8x, 3 days)
- Moderate: Poson Poya (1.5x, 2 days)

### Next Steps
Proceed to [Group-D_Prediction-Algorithms](../Group-D_Prediction-Algorithms/) to implement demand forecasting algorithms that utilize the festival calendar for adjusted predictions. The festival service is complete and ready for integration with forecasting models.
