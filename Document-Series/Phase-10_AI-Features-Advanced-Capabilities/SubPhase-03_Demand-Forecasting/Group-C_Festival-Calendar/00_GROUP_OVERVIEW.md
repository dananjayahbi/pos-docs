# Group C: Festival Calendar

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement Sri Lanka festival calendar for demand adjustments

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Historical-Data-Processing](../Group-B_Historical-Data-Processing/)
- **→ Next Group:** [Group-D_Prediction-Algorithms](../Group-D_Prediction-Algorithms/)

---

## Group Overview

This group implements festival calendar. Creates Festival model with festival_name, festival_type, date_start, date_end, impact_factor, and is_recurring fields. Creates FestivalCalendar service. Pre-populates Sinhala New Year (April 13-14), Vesak Full Moon (variable May), Poson Full Moon (variable June), Deepavali (variable Oct/Nov), and Christmas (December 25). Creates get_festivals method to retrieve festivals in date range and get_impact method to calculate demand impact for specific dates. Verifies festival calendar.

### Key Outcomes

- Festival model
- festival_name field
- festival_type field
- date_start field
- date_end field
- impact_factor field
- is_recurring field
- FestivalCalendar service
- Sinhala New Year
- Vesak Full Moon
- Poson Full Moon
- Deepavali
- Christmas
- get_festivals method
- get_impact method
- Festival calendar verified

### Technology Context

- **Calendar:** Sri Lanka holidays
- **Impact:** Demand multipliers
- **Variable:** Lunar calendar
- **Storage:** PostgreSQL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-39_Festival-Model.md` | Create festival model | 33-39 |
| 02 | `02_Tasks-40-48_Calendar-Service.md` | Create calendar service and festivals | 40-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create Festival Model | Medium | Task 32 |
| 34 | Create festival_name Field | Low | Task 33 |
| 35 | Create festival_type Field | Low | Task 33 |
| 36 | Create date_start Field | Low | Task 33 |
| 37 | Create date_end Field | Low | Task 33 |
| 38 | Create impact_factor Field | Low | Task 33 |
| 39 | Create is_recurring Field | Low | Task 33 |
| 40 | Create FestivalCalendar | Medium | Task 39 |
| 41 | Create Sinhala New Year | Low | Task 40 |
| 42 | Create Vesak Full Moon | Medium | Task 40 |
| 43 | Create Poson Full Moon | Medium | Task 40 |
| 44 | Create Deepavali | Medium | Task 40 |
| 45 | Create Christmas | Low | Task 40 |
| 46 | Create get_festivals Method | Medium | Task 45 |
| 47 | Create get_impact Method | Medium | Task 46 |
| 48 | Verify Festival Calendar | Low | Task 47 |

---

## Execution Order

```
Task 33: Festival Model
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-34      T-35      T-36      T-37     T-38     T-39
(Name)  (Type)  (Start)  (End) (Impact)(Recur)
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                   Task 40: FestivalCalendar
                              │
       ┌────────┬────────┬────┼────┬────────┐
       ▼        ▼        ▼    ▼    ▼        ▼
    T-41      T-42      T-43  T-44  T-45
  (Sinhala)(Vesak) (Poson)(Diwali)(Xmas)
       │        │        │    │    │
       └────────┴────────┴────┴────┘
                       │
                       ▼
              Task 46: get_festivals
                       │
                       ▼
              Task 47: get_impact
                       │
                       ▼
              Task 48: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            ├── models/
            │   └── festival.py
            └── calendar/
                ├── __init__.py
                └── festival_calendar.py
```

---

## Notes for AI Agents

### Festival Model (Task 33)
| Class | Festival |
|-------|----------|
| Purpose | Store festival definitions |

### festival_name Field (Task 34)
| Field | Type |
|-------|------|
| Name | festival_name |
| Type | CharField(100) |
| Unique | True |

### festival_type Field (Task 35)
| Type | Description |
|------|-------------|
| RELIGIOUS | Religious holidays |
| CULTURAL | Cultural events |
| NATIONAL | National holidays |
| COMMERCIAL | Shopping events |

### date_start Field (Task 36)
| Field | Type |
|-------|------|
| Name | date_start |
| Type | DateField |
| Use | Festival start |

### date_end Field (Task 37)
| Field | Type |
|-------|------|
| Name | date_end |
| Type | DateField |
| Use | Festival end |

### impact_factor Field (Task 38)
| Field | Type |
|-------|------|
| Name | impact_factor |
| Type | FloatField |
| Default | 1.0 |
| Range | 1.0 - 3.0 |

### is_recurring Field (Task 39)
| Field | Type |
|-------|------|
| Name | is_recurring |
| Type | BooleanField |
| Default | True |

### FestivalCalendar (Task 40)
| Class | FestivalCalendar |
|-------|------------------|
| Purpose | Manage festival calendar |

### Sinhala New Year (Task 41)
| Festival | Sinhala/Tamil New Year |
|----------|----------------------|
| Date | April 13-14 (fixed) |
| Impact | 2.5x |
| Duration | 7 days (13-19 April) |

### Vesak Full Moon (Task 42)
| Festival | Vesak Poya |
|----------|-----------|
| Date | May full moon (variable) |
| Impact | 1.8x |
| Duration | 3 days |
| Calculation | Lunar calendar |

### Poson Full Moon (Task 43)
| Festival | Poson Poya |
|----------|-----------|
| Date | June full moon (variable) |
| Impact | 1.5x |
| Duration | 2 days |
| Calculation | Lunar calendar |

### Deepavali (Task 44)
| Festival | Deepavali |
|----------|----------|
| Date | October/November (variable) |
| Impact | 2.0x |
| Duration | 3 days |
| Calculation | Hindu calendar |

### Christmas (Task 45)
| Festival | Christmas |
|----------|----------|
| Date | December 25 (fixed) |
| Impact | 2.2x |
| Duration | 7 days (Dec 20-26) |

### Sri Lanka Festival Impact
| Festival | Impact | Duration |
|----------|--------|----------|
| Sinhala New Year | 2.5x | 7 days |
| Vesak | 1.8x | 3 days |
| Poson | 1.5x | 2 days |
| Deepavali | 2.0x | 3 days |
| Christmas | 2.2x | 7 days |
| Ramadan/Eid | 1.6x | 3 days |

### get_festivals Method (Task 46)
| Method | get_festivals(start_date, end_date) |
|--------|-------------------------------------|
| Return | List of Festival objects |
| Use | Festivals in date range |

### get_impact Method (Task 47)
| Method | get_impact(date) |
|--------|-----------------|
| Return | Float impact factor |
| Default | 1.0 if no festival |
| Overlap | Max of overlapping festivals |
