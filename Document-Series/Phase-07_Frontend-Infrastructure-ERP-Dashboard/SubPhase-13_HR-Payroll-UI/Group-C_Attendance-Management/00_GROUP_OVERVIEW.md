# Group C: Attendance Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Build attendance dashboard with calendar view, daily list, and reporting

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Employee-Management](../Group-B_Employee-Management/)
- **→ Next Group:** [Group-D_Leave-Management](../Group-D_Leave-Management/)

---

## Group Overview

This group creates the complete attendance management interface. Creates main attendance page with header and date selector. Builds today summary cards: present count, absent count, and late count. Creates attendance calendar with monthly view. Creates calendar day cell with status colors and attendance legend. Creates daily attendance list for selected day. Creates attendance row with check-in/out times. Adds manual entry modal for corrections. Creates clock in/out button for self-service. Creates attendance filters. Creates attendance report page with date range selector. Creates report table and export functionality.

### Key Outcomes

- Attendance dashboard page
- Attendance header with date selector
- Today summary cards
- Present count card
- Absent count card
- Late count card
- Attendance calendar (monthly view)
- Calendar day cell component
- Attendance legend
- Daily attendance list
- Attendance row component
- Manual entry modal
- Clock in/out button
- Attendance filters
- Attendance report page
- Date range selector
- Attendance report table
- Export attendance to CSV/Excel

### Technology Context

- **Calendar:** Monthly calendar grid
- **Status Colors:** Color-coded attendance
- **Time:** Check-in/out timestamps
- **Export:** CSV/Excel download

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-46_Dashboard-Calendar.md` | Create attendance dashboard and calendar | 35-46 |
| 02 | `02_Tasks-47-52_ClockIn-Reports.md` | Create clock in/out and reports | 47-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Attendance Page | Low | Task 16 |
| 36 | Create Attendance Header | Low | Task 35 |
| 37 | Create Today Summary Cards | Medium | Task 35 |
| 38 | Create Present Count Card | Low | Task 37 |
| 39 | Create Absent Count Card | Low | Task 37 |
| 40 | Create Late Count Card | Low | Task 37 |
| 41 | Create Attendance Calendar | Medium | Task 35 |
| 42 | Create Calendar Day Cell | Medium | Task 41 |
| 43 | Create Attendance Legend | Low | Task 41 |
| 44 | Create Daily Attendance List | Medium | Task 35 |
| 45 | Create Attendance Row | Low | Task 44 |
| 46 | Create Manual Entry Modal | Medium | Task 44 |
| 47 | Create Clock In/Out Button | Medium | Task 35 |
| 48 | Create Attendance Filters | Low | Task 35 |
| 49 | Create Attendance Report Page | Medium | Task 16 |
| 50 | Create Date Range Selector | Low | Task 49 |
| 51 | Create Attendance Report Table | Medium | Task 49 |
| 52 | Create Export Attendance | Low | Task 51 |

---

## Execution Order

```
Task 35: Attendance Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 36: Attendance Header                             │
    │                                                  │
    ▼                                                  │
Task 37: Today Summary Cards                           │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 38    Task 39    Task 40       │                 │
(Present)  (Absent)   (Late)        │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 41: Attendance Calendar │                │
               │                     │                 │
         ┌─────┴─────┐               │                 │
         ▼           ▼               │                 │
      Task 42    Task 43             │                 │
      (Cell)     (Legend)            │                 │
         │           │               │                 │
         └─────┬─────┘               │                 │
               │                     │                 │
               ▼                     │                 │
         Task 44: Daily List         │                 │
               │                     │                 │
               ▼                     │                 │
         Task 45: Attendance Row     │                 │
               │                     │                 │
               ▼                     │                 │
         Task 46: Manual Entry       │                 │
               │                     │                 │
               ▼                     │                 │
         Task 47: Clock In/Out       │                 │
               │                     │                 │
               ▼                     │                 │
         Task 48: Filters            │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                          ▼                            │
                    Task 49: Report Page               │
                          │                            │
                          ▼                            │
                    Task 50: Date Range                │
                          │                            │
                          ▼                            │
                    Task 51: Report Table              │
                          │                            │
                          ▼
                    Task 52: Export
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── hr/
            └── Attendance/
                ├── AttendanceDashboard.tsx
                ├── AttendanceHeader.tsx
                ├── TodaySummaryCards.tsx
                ├── PresentCountCard.tsx
                ├── AbsentCountCard.tsx
                ├── LateCountCard.tsx
                ├── AttendanceCalendar.tsx
                ├── CalendarDayCell.tsx
                ├── AttendanceLegend.tsx
                ├── DailyAttendanceList.tsx
                ├── AttendanceRow.tsx
                ├── ManualEntryModal.tsx
                ├── ClockInOutButton.tsx
                ├── AttendanceFilters.tsx
                ├── Reports/
                │   ├── AttendanceReport.tsx
                │   ├── DateRangeSelector.tsx
                │   ├── AttendanceReportTable.tsx
                │   ├── ExportAttendance.tsx
                │   └── index.ts
                └── index.ts
```

---

## Notes for AI Agents

### Today Summary Cards (Task 37)
| Card | Icon | Color | Value |
|------|------|-------|-------|
| Present | UserCheck | Green | Count present today |
| Absent | UserX | Red | Count absent today |
| Late | Clock | Yellow | Count late today |

### Attendance Status Colors (Tasks 42-43)
| Status | Color | Description |
|--------|-------|-------------|
| Present | Green | Normal attendance |
| Absent | Red | No attendance record |
| Late | Yellow | Arrived after start time |
| Half Day | Orange | Partial day worked |
| Leave | Blue | On approved leave |
| Holiday | Purple | Public holiday |

### Calendar Day Cell (Task 42)
| Element | Content |
|---------|---------|
| Day Number | 1-31 |
| Background | Status color |
| Count | Number of employees |
| Click | Show daily list |

### Attendance Row (Task 45)
| Column | Content |
|--------|---------|
| Employee | Avatar + name |
| Check In | Time (HH:MM) |
| Check Out | Time (HH:MM) |
| Hours | Worked hours |
| Status | Present/Late/etc |
| Actions | Edit |

### Manual Entry Modal (Task 46)
| Field | Type |
|-------|------|
| Employee | Search select |
| Date | Date picker |
| Check In | Time picker |
| Check Out | Time picker |
| Notes | Textarea |

### Clock In/Out (Task 47)
| State | Button |
|-------|--------|
| Not clocked in | "Clock In" (Green) |
| Clocked in | "Clock Out" (Red) |
| Already out | Disabled |

### Attendance Filters (Task 48)
| Filter | Type |
|--------|------|
| Department | Select |
| Status | Select |
| Date | Date picker |

### Report Table Columns (Task 51)
| Column | Description |
|--------|-------------|
| Employee | Name |
| Present | Days present |
| Absent | Days absent |
| Late | Days late |
| Leave | Days on leave |
| Total Hours | Total worked |

### Export Formats (Task 52)
| Format | Extension |
|--------|-----------|
| CSV | .csv |
| Excel | .xlsx |
