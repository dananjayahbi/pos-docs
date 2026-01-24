# Tasks 71-76: Export, Dashboard & Payroll Integration

**Group E: Reports & Analytics**  
**SubPhase 03: Attendance System**  
**Phase 06: ERP Advanced Modules**

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous:** [01_Tasks-63-70_Report-Generation-Analytics.md](01_Tasks-63-70_Report-Generation-Analytics.md)
- **Next:** [../Group-F_Integration-APIs/00_GROUP_OVERVIEW.md](../Group-F_Integration-APIs/00_GROUP_OVERVIEW.md)

---

## Document Overview

### Purpose
This document details the implementation of advanced reporting features, export capabilities, real-time dashboards, and payroll integration for the attendance system.

### Tasks Covered
- **Task 71:** Absence Report Generation
- **Task 72:** Attendance Percentage Calculation
- **Task 73:** Export Service (Excel/PDF)
- **Task 74:** Dashboard Data Aggregation
- **Task 75:** Real-time WebSocket Updates
- **Task 76:** Payroll Integration

### Dependencies
```
Task 71 (Absence Report) ──┐
Task 72 (Attendance %)     ├──→ Task 73 (Export Service)
                           │
Task 74 (Dashboard Data) ──┴──→ Task 75 (WebSocket)
                                      ↓
Task 76 (Payroll Integration) ←──────┘
```

---

## TASK 71: Absence Report Generation

### Objective
Generate comprehensive absence reports with filtering, categorization, and trend analysis.

### Business Requirements

#### Functional Requirements
1. **Absence Types Tracking**
   - Sick leave
   - Annual leave
   - Unpaid leave
   - Emergency leave
   - Late arrivals
   - Early departures

2. **Report Dimensions**
   - By employee
   - By department
   - By absence type
   - By date range
   - By approval status

3. **Analysis Features**
   - Absence frequency
   - Duration statistics
   - Pattern detection
   - Impact assessment

### Technical Design

#### Data Models

**AbsenceReport Model Structure**
```
AbsenceReport
├── id (UUID)
├── tenant (FK)
├── report_date
├── date_range
│   ├── start_date
│   └── end_date
├── filters
│   ├── employee_ids[]
│   ├── department_ids[]
│   ├── absence_types[]
│   └── approval_status[]
├── statistics
│   ├── total_absences
│   ├── total_days
│   ├── average_duration
│   └── most_common_type
├── breakdown
│   ├── by_employee[]
│   ├── by_department[]
│   ├── by_type[]
│   └── by_month[]
├── trends
│   ├── weekly_pattern
│   ├── monthly_pattern
│   └── seasonal_pattern
├── generated_by (FK User)
├── generated_at
└── metadata
```

**AbsenceStatistics Model**
```
AbsenceStatistics
├── id (UUID)
├── tenant (FK)
├── employee (FK)
├── period
│   ├── start_date
│   └── end_date
├── absence_counts
│   ├── total
│   ├── sick_leave
│   ├── annual_leave
│   ├── unpaid_leave
│   └── other
├── duration_days
│   ├── total
│   ├── average
│   ├── longest
│   └── shortest
├── frequency_metrics
│   ├── absences_per_month
│   ├── consecutive_days
│   └── frequency_rate
├── impact_score
└── last_calculated
```

#### Absence Report Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ABSENCE REPORT SYSTEM                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Data       │   │  Calculation │   │   Report     │
│  Collection  │   │   Engine     │   │  Generation  │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ↓                   ↓                   ↓
┌──────────────────────────────────────────────────────┐
│           Absence Records Database                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Absences │  │  Leaves  │  │  Times   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└──────────────────────────────────────────────────────┘
```

#### Service Implementation

**AbsenceReportService Methods**
```
AbsenceReportService:
├── generate_absence_report(filters)
│   ├── validate_filters()
│   ├── collect_absence_data()
│   ├── calculate_statistics()
│   ├── detect_patterns()
│   └── generate_report()
│
├── get_employee_absence_summary(employee_id)
│   ├── fetch_absences()
│   ├── calculate_totals()
│   └── generate_summary()
│
├── analyze_absence_trends(date_range)
│   ├── group_by_period()
│   ├── calculate_trends()
│   └── identify_anomalies()
│
├── get_department_comparison()
│   ├── aggregate_by_department()
│   ├── calculate_averages()
│   └── rank_departments()
│
└── predict_absence_patterns()
    ├── analyze_historical_data()
    ├── identify_patterns()
    └── generate_predictions()
```

#### Calculation Algorithms

**Absence Frequency Rate**
```
Frequency Rate = (Total Absences / Working Days) × 100

Example:
- Total Absences: 5 days
- Working Days: 180 days
- Frequency Rate: (5/180) × 100 = 2.78%
```

**Bradford Factor (Absence Impact Score)**
```
Bradford Factor = S² × D

Where:
- S = Number of separate absence periods
- D = Total number of days absent

Example:
- 3 separate absences, 8 total days
- Bradford Factor = 3² × 8 = 72
```

### Implementation Steps

#### Step 1: Absence Data Collection
1. Define absence categories
2. Create absence tracking models
3. Implement data collection endpoints
4. Set up automated data aggregation

#### Step 2: Statistics Calculation
1. Implement frequency calculations
2. Add duration metrics
3. Calculate Bradford Factor
4. Compute department averages

#### Step 3: Pattern Detection
1. Weekly pattern analysis
2. Monthly trend identification
3. Seasonal pattern detection
4. Anomaly detection

#### Step 4: Report Generation
1. Create report templates
2. Implement data formatting
3. Add visualization data
4. Generate summary statistics

### Absence Report Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  ABSENCE REPORT WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. REPORT REQUEST
   ┌──────────────┐
   │ User selects │
   │  filters &   │───→ Validate filters
   │  date range  │
   └──────────────┘
          ↓
2. DATA COLLECTION
   ┌──────────────┐
   │   Fetch:     │
   │ - Absences   │
   │ - Leaves     │───→ Aggregate data
   │ - Times      │
   └──────────────┘
          ↓
3. CALCULATION
   ┌──────────────┐
   │  Calculate:  │
   │ - Totals     │
   │ - Averages   │───→ Generate statistics
   │ - Patterns   │
   └──────────────┘
          ↓
4. ANALYSIS
   ┌──────────────┐
   │   Analyze:   │
   │ - Trends     │
   │ - Impact     │───→ Identify insights
   │ - Anomalies  │
   └──────────────┘
          ↓
5. REPORT OUTPUT
   ┌──────────────┐
   │   Generate:  │
   │ - Summary    │
   │ - Charts     │───→ Display/Export
   │ - Details    │
   └──────────────┘
```

### Report Formats

#### Summary Report Structure
```
Absence Report Summary
├── Report Period: [Start] - [End]
├── Generated: [Timestamp]
├── Filters Applied: [List]
│
├── Overview Statistics
│   ├── Total Absences: X
│   ├── Total Days Lost: Y
│   ├── Average Duration: Z days
│   └── Most Common Type: [Type]
│
├── Department Breakdown
│   ├── Department A: X absences (Y days)
│   ├── Department B: X absences (Y days)
│   └── ...
│
├── Absence Type Distribution
│   ├── Sick Leave: X% (Y days)
│   ├── Annual Leave: X% (Y days)
│   └── ...
│
├── Top 10 Employees by Absence
│   ├── Employee A: X absences (Y days, Bradford: Z)
│   └── ...
│
└── Trends & Insights
    ├── Weekly Pattern: [Description]
    ├── Monthly Trend: [Up/Down]
    └── Recommendations: [List]
```

---

## TASK 72: Attendance Percentage Calculation

### Objective
Calculate and track attendance percentages with real-time updates and historical trends.

### Business Requirements

#### Functional Requirements
1. **Calculation Types**
   - Individual employee attendance
   - Department attendance
   - Company-wide attendance
   - Location-based attendance

2. **Time Periods**
   - Daily attendance rate
   - Weekly average
   - Monthly performance
   - Annual statistics

3. **Accuracy Features**
   - Exclude holidays
   - Account for leaves
   - Consider work schedules
   - Handle partial days

### Technical Design

#### Attendance Percentage Model

```
AttendancePercentage
├── id (UUID)
├── tenant (FK)
├── entity_type (employee/department/company)
├── entity_id
├── period
│   ├── start_date
│   ├── end_date
│   └── period_type (daily/weekly/monthly/annual)
├── metrics
│   ├── total_working_days
│   ├── present_days
│   ├── absent_days
│   ├── late_days
│   ├── half_days
│   └── leave_days
├── percentages
│   ├── attendance_rate
│   ├── punctuality_rate
│   ├── absence_rate
│   └── adjusted_rate
├── breakdown
│   ├── on_time_count
│   ├── late_count
│   ├── early_departure_count
│   └── full_day_count
├── calculated_at
└── calculation_metadata
```

#### Calculation Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              ATTENDANCE PERCENTAGE ENGINE                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Working    │   │  Attendance  │   │  Percentage  │
│   Days       │   │    Data      │   │  Calculator  │
│  Calculator  │   │  Aggregator  │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ↓
                   ┌──────────────┐
                   │   Result     │
                   │   Storage    │
                   └──────────────┘
```

#### Calculation Formulas

**Basic Attendance Percentage**
```
Attendance % = (Present Days / Total Working Days) × 100

Example:
- Present Days: 18
- Total Working Days: 20
- Attendance %: (18/20) × 100 = 90%
```

**Adjusted Attendance Percentage**
```
Adjusted % = ((Present + Approved Leave) / Total Working Days) × 100

Example:
- Present: 18 days
- Approved Leave: 1 day
- Total Working Days: 20
- Adjusted %: (19/20) × 100 = 95%
```

**Punctuality Rate**
```
Punctuality % = (On-Time Arrivals / Total Present Days) × 100

Example:
- On-Time Arrivals: 16
- Total Present Days: 18
- Punctuality %: (16/18) × 100 = 88.89%
```

**Effective Attendance Score**
```
Effective Score = (Attendance % × 0.6) + (Punctuality % × 0.4)

Example:
- Attendance %: 90%
- Punctuality %: 88.89%
- Effective Score: (90 × 0.6) + (88.89 × 0.4) = 89.56%
```

### Service Implementation

**AttendancePercentageService Methods**
```
AttendancePercentageService:
├── calculate_employee_attendance(employee_id, period)
│   ├── get_working_days(period)
│   ├── fetch_attendance_records()
│   ├── calculate_metrics()
│   └── compute_percentages()
│
├── calculate_department_attendance(department_id, period)
│   ├── get_department_employees()
│   ├── aggregate_employee_data()
│   ├── calculate_department_metrics()
│   └── generate_department_stats()
│
├── calculate_company_attendance(period)
│   ├── aggregate_all_employees()
│   ├── calculate_company_metrics()
│   └── generate_insights()
│
├── get_attendance_trends(entity, timeframe)
│   ├── fetch_historical_data()
│   ├── calculate_period_percentages()
│   └── identify_trends()
│
└── get_attendance_ranking(scope, period)
    ├── calculate_all_percentages()
    ├── rank_entities()
    └── generate_comparison()
```

### Calculation Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│           ATTENDANCE PERCENTAGE CALCULATION FLOW                 │
└─────────────────────────────────────────────────────────────────┘

1. DEFINE PERIOD
   ┌──────────────┐
   │ Set period:  │
   │ - Start date │
   │ - End date   │───→ Validate dates
   │ - Entity     │
   └──────────────┘
          ↓
2. CALCULATE WORKING DAYS
   ┌──────────────┐
   │  Consider:   │
   │ - Calendar   │
   │ - Holidays   │───→ Total working days
   │ - Weekends   │
   └──────────────┘
          ↓
3. AGGREGATE ATTENDANCE
   ┌──────────────┐
   │   Count:     │
   │ - Present    │
   │ - Absent     │───→ Attendance data
   │ - Late       │
   └──────────────┘
          ↓
4. CALCULATE PERCENTAGES
   ┌──────────────┐
   │   Compute:   │
   │ - Attendance │
   │ - Punctuality│───→ Final percentages
   │ - Adjusted   │
   └──────────────┘
          ↓
5. STORE & NOTIFY
   ┌──────────────┐
   │   Save &     │
   │   Trigger:   │
   │ - Store data │───→ Notifications
   │ - Alert if < │
   │   threshold  │
   └──────────────┘
```

### Real-time Calculation

**Incremental Update Strategy**
```
Daily Update Process:
├── At End of Day
│   ├── Calculate day's attendance
│   ├── Update running totals
│   ├── Recalculate percentages
│   └── Store new values
│
├── Optimization
│   ├── Cache working days
│   ├── Incremental aggregation
│   └── Lazy recalculation
│
└── Triggers
    ├── Schedule: Daily 11:59 PM
    ├── Event: Attendance marked
    └── Manual: On-demand request
```

### Performance Considerations

**Caching Strategy**
```
Cache Layers:
├── L1: Current Day (Redis)
│   ├── Key: attendance:current:{entity_id}
│   ├── TTL: End of day
│   └── Data: Real-time counts
│
├── L2: Period Calculations (Redis)
│   ├── Key: attendance:period:{period}:{entity_id}
│   ├── TTL: 1 hour
│   └── Data: Aggregated percentages
│
└── L3: Historical Data (Database)
    ├── Partitioned by month
    ├── Indexed on entity + period
    └── Materialized views for reports
```

---

## TASK 73: Export Service (Excel/PDF)

### Objective
Implement comprehensive export functionality for attendance reports in multiple formats with customization options.

### Business Requirements

#### Functional Requirements
1. **Export Formats**
   - Excel (XLSX)
   - PDF documents
   - CSV files
   - JSON data

2. **Export Types**
   - Attendance reports
   - Absence summaries
   - Individual timesheets
   - Department analytics
   - Custom queries

3. **Customization Options**
   - Column selection
   - Date range filtering
   - Formatting preferences
   - Template selection
   - Branding options

### Technical Design

#### Export Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPORT SERVICE                            │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Data       │   │   Format     │   │   Delivery   │
│  Extractor   │   │  Generator   │   │   Service    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ↓                   ↓                   ↓
   ┌─────────┐       ┌──────────┐       ┌──────────┐
   │ Query   │       │ Excel    │       │ Download │
   │ Builder │       │ PDF      │       │ Email    │
   │         │       │ CSV      │       │ S3       │
   └─────────┘       └──────────┘       └──────────┘
```

#### Export Job Model

```
ExportJob
├── id (UUID)
├── tenant (FK)
├── user (FK)
├── export_type (report/timesheet/analytics)
├── format (excel/pdf/csv/json)
├── status (pending/processing/completed/failed)
├── configuration
│   ├── report_type
│   ├── filters
│   │   ├── date_range
│   │   ├── employees[]
│   │   ├── departments[]
│   │   └── custom_filters
│   ├── columns[]
│   ├── grouping
│   ├── sorting
│   └── template_id
├── file_info
│   ├── filename
│   ├── file_size
│   ├── file_path
│   ├── download_url
│   └── expires_at
├── progress
│   ├── total_records
│   ├── processed_records
│   ├── percentage
│   └── estimated_completion
├── created_at
├── started_at
├── completed_at
└── error_message
```

#### Format Generators

**Excel Generator Structure**
```
ExcelGenerator:
├── Libraries
│   ├── openpyxl (XLSX creation)
│   └── xlsxwriter (Advanced features)
│
├── Methods
│   ├── create_workbook()
│   ├── add_worksheet(name, data)
│   ├── apply_formatting(styles)
│   ├── add_charts(chart_config)
│   ├── set_column_widths()
│   ├── add_filters()
│   ├── freeze_panes()
│   └── save_workbook()
│
└── Features
    ├── Multiple sheets
    ├── Cell formatting
    ├── Conditional formatting
    ├── Charts & graphs
    ├── Formulas
    └── Data validation
```

**PDF Generator Structure**
```
PDFGenerator:
├── Libraries
│   ├── ReportLab (PDF creation)
│   └── WeasyPrint (HTML to PDF)
│
├── Methods
│   ├── create_document()
│   ├── add_header(logo, title)
│   ├── add_footer(page_numbers)
│   ├── add_table(data, style)
│   ├── add_chart(chart_data)
│   ├── add_page_break()
│   └── generate_pdf()
│
└── Features
    ├── Custom templates
    ├── Company branding
    ├── Page headers/footers
    ├── Tables & charts
    ├── Dynamic content
    └── Pagination
```

### Export Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXPORT WORKFLOW                              │
└─────────────────────────────────────────────────────────────────┘

1. EXPORT REQUEST
   ┌──────────────┐
   │ User submits │
   │ export with: │
   │ - Format     │───→ Validate request
   │ - Filters    │
   │ - Options    │
   └──────────────┘
          ↓
2. JOB CREATION
   ┌──────────────┐
   │ Create job:  │
   │ - Status:    │
   │   pending    │───→ Queue in Celery
   │ - Return ID  │
   └──────────────┘
          ↓
3. DATA EXTRACTION
   ┌──────────────┐
   │ Worker:      │
   │ - Fetch data │
   │ - Apply      │───→ Data prepared
   │   filters    │
   │ - Transform  │
   └──────────────┘
          ↓
4. FILE GENERATION
   ┌──────────────┐
   │ Generate:    │
   │ - Format     │
   │   data       │───→ File created
   │ - Apply      │
   │   styles     │
   └──────────────┘
          ↓
5. STORAGE & DELIVERY
   ┌──────────────┐
   │ Store file:  │
   │ - S3 upload  │
   │ - Generate   │───→ Notify user
   │   download   │
   │   URL        │
   └──────────────┘
```

### Implementation Details

#### Excel Export Template

**Attendance Report Sheet Structure**
```
Sheet 1: Summary
├── Header Row (Merged cells)
│   ├── Company Logo
│   ├── Report Title
│   └── Date Range
├── Statistics Section
│   ├── Total Employees
│   ├── Total Working Days
│   ├── Average Attendance
│   └── Key Metrics
└── Summary Table
    ├── Department
    ├── Employees
    ├── Attendance %
    └── Status

Sheet 2: Detailed Data
├── Column Headers (Frozen)
│   ├── Employee ID
│   ├── Employee Name
│   ├── Department
│   ├── Date
│   ├── Check In
│   ├── Check Out
│   ├── Hours Worked
│   ├── Status
│   └── Notes
├── Data Rows (Filtered)
└── Totals Row

Sheet 3: Charts
├── Attendance Trend Chart
├── Department Comparison
└── Absence Type Distribution
```

#### PDF Export Layout

**PDF Document Structure**
```
Page Layout:
├── Header (Every page)
│   ├── Company logo (left)
│   ├── Report title (center)
│   └── Date (right)
│
├── Content
│   ├── Executive Summary
│   │   ├── Key metrics boxes
│   │   └── Quick stats
│   ├── Detailed Tables
│   │   ├── Styled data table
│   │   └── Alternating row colors
│   ├── Charts & Graphs
│   │   ├── Attendance trend
│   │   └── Department comparison
│   └── Notes Section
│       └── Additional information
│
└── Footer (Every page)
    ├── Page numbers
    ├── Generation timestamp
    └── Confidentiality notice
```

### Service Implementation

**ExportService Methods**
```
ExportService:
├── create_export_job(config)
│   ├── validate_config()
│   ├── create_job_record()
│   ├── queue_task()
│   └── return_job_id()
│
├── process_export(job_id)
│   ├── load_job_config()
│   ├── extract_data()
│   ├── generate_file()
│   ├── upload_to_storage()
│   └── update_job_status()
│
├── generate_excel(data, config)
│   ├── create_workbook()
│   ├── add_sheets()
│   ├── format_data()
│   ├── add_charts()
│   └── save_file()
│
├── generate_pdf(data, config)
│   ├── render_template()
│   ├── add_content()
│   ├── apply_styles()
│   └── save_pdf()
│
└── get_export_status(job_id)
    ├── fetch_job()
    ├── check_progress()
    └── return_details()
```

### API Endpoints

**Export API Structure**
```
POST /api/attendance/export/
├── Request Body
│   ├── export_type: "attendance_report"
│   ├── format: "excel|pdf|csv"
│   ├── filters: {...}
│   └── options: {...}
├── Response
│   ├── job_id: "uuid"
│   ├── status: "pending"
│   └── status_url: "/api/export/status/{job_id}"

GET /api/attendance/export/status/{job_id}
├── Response (Processing)
│   ├── status: "processing"
│   ├── progress: 45
│   └── estimated_completion: "2026-01-24T10:30:00Z"
└── Response (Completed)
    ├── status: "completed"
    ├── download_url: "https://..."
    ├── filename: "attendance_report_2026-01.xlsx"
    ├── file_size: 245760
    └── expires_at: "2026-01-25T10:00:00Z"

GET /api/attendance/export/download/{job_id}
├── Headers
│   ├── Content-Type: application/vnd.openxmlformats...
│   ├── Content-Disposition: attachment; filename="..."
│   └── Content-Length: 245760
└── Body: Binary file data
```

### Async Export with Celery

**Celery Task Structure**
```
@celery_app.task(bind=True)
def process_export_job(self, job_id):
    │
    ├── 1. Load job configuration
    │   └── Get filters, options, format
    │
    ├── 2. Extract data
    │   ├── Query database
    │   ├── Apply filters
    │   └── Update progress: 20%
    │
    ├── 3. Transform data
    │   ├── Format records
    │   ├── Calculate totals
    │   └── Update progress: 40%
    │
    ├── 4. Generate file
    │   ├── Create document
    │   ├── Apply formatting
    │   └── Update progress: 70%
    │
    ├── 5. Upload to storage
    │   ├── Upload to S3
    │   ├── Generate signed URL
    │   └── Update progress: 90%
    │
    └── 6. Complete job
        ├── Update status: completed
        ├── Send notification
        └── Update progress: 100%
```

---

## TASK 74: Dashboard Data Aggregation

### Objective
Implement efficient data aggregation for real-time attendance dashboards with caching and optimization.

### Business Requirements

#### Functional Requirements
1. **Dashboard Widgets**
   - Today's attendance summary
   - Current week statistics
   - Monthly trends
   - Department comparisons
   - Top performers
   - Alert notifications

2. **Data Refresh**
   - Real-time updates
   - Scheduled refreshes
   - On-demand recalculation
   - Incremental updates

3. **Performance Requirements**
   - Widget load time < 1 second
   - Dashboard load < 3 seconds
   - Support 1000+ concurrent users
   - Efficient caching

### Technical Design

#### Dashboard Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  DASHBOARD ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Data       │   │    Cache     │   │    API       │
│ Aggregation  │   │    Layer     │   │   Gateway    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ↓                   ↓                   ↓
   ┌─────────┐       ┌──────────┐       ┌──────────┐
   │ Database│       │  Redis   │       │ Frontend │
   │ Queries │       │  Cache   │       │Dashboard │
   └─────────┘       └──────────┘       └──────────┘
```

#### Dashboard Widget Model

```
DashboardWidget
├── id (UUID)
├── tenant (FK)
├── widget_type (summary/chart/list/metric)
├── widget_key (unique identifier)
├── configuration
│   ├── title
│   ├── refresh_interval
│   ├── data_source
│   ├── filters
│   └── display_options
├── data_cache
│   ├── cached_data (JSON)
│   ├── cached_at
│   └── cache_expires
├── aggregation_config
│   ├── query_template
│   ├── grouping_fields
│   ├── aggregation_functions
│   └── sorting
├── permissions
│   ├── roles_allowed[]
│   └── departments_allowed[]
├── last_updated
└── update_frequency
```

#### Aggregated Data Model

```
AttendanceDashboardData
├── id (UUID)
├── tenant (FK)
├── data_date
├── data_scope (company/department/location)
├── scope_id
├── metrics
│   ├── today_attendance
│   │   ├── total_employees
│   │   ├── present_count
│   │   ├── absent_count
│   │   ├── late_count
│   │   ├── on_leave_count
│   │   └── attendance_rate
│   ├── week_statistics
│   │   ├── average_attendance
│   │   ├── total_hours_worked
│   │   ├── overtime_hours
│   │   └── trend_direction
│   ├── month_statistics
│   │   ├── attendance_percentage
│   │   ├── absence_rate
│   │   ├── punctuality_rate
│   │   └── comparison_to_last_month
│   └── real_time_data
│       ├── currently_checked_in
│       ├── pending_approvals
│       ├── active_leaves
│       └── last_sync_time
├── trends
│   ├── daily_attendance[]
│   ├── weekly_comparison[]
│   └── monthly_pattern[]
├── alerts
│   ├── low_attendance[]
│   ├── excessive_absences[]
│   └── pending_actions[]
├── calculated_at
└── next_calculation
```

### Aggregation Engine

```
┌─────────────────────────────────────────────────────────────────┐
│                 DATA AGGREGATION ENGINE                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Data Sources                                                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Attendance  │  │   Leaves    │  │  Employees  │            │
│  │  Records    │  │  Requests   │  │    Data     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Aggregation Layer                                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   Pre-computed   │  │   On-demand      │                    │
│  │   Aggregations   │  │   Calculations   │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  Cache Layer (Redis)                                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Widget    │  │  Dashboard  │  │    Query    │            │
│  │   Cache     │  │    Cache    │  │   Results   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  API Layer                                                       │
├─────────────────────────────────────────────────────────────────┤
│  GET /dashboard/attendance                                       │
│  GET /dashboard/widget/{widget_key}                             │
│  POST /dashboard/refresh                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Caching Strategy

**Multi-Level Cache Design**
```
Cache Hierarchy:
├── L1: Request Cache (In-Memory)
│   ├── Scope: Single request
│   ├── Duration: Request lifetime
│   └── Use: Deduplication within request
│
├── L2: Widget Cache (Redis)
│   ├── Key Pattern: dashboard:widget:{widget_key}:{date}
│   ├── TTL: 5-60 minutes (configurable)
│   ├── Invalidation: On data change
│   └── Use: Frequently accessed widgets
│
├── L3: Aggregation Cache (Redis)
│   ├── Key Pattern: dashboard:agg:{scope}:{period}:{date}
│   ├── TTL: 1-24 hours
│   ├── Invalidation: Scheduled
│   └── Use: Expensive calculations
│
└── L4: Database Materialized Views
    ├── Refresh: Every 15 minutes
    ├── Indexed: For fast queries
    └── Use: Historical data, trends
```

### Service Implementation

**DashboardAggregationService Methods**
```
DashboardAggregationService:
├── get_dashboard_data(scope, date)
│   ├── check_cache()
│   ├── load_from_cache() OR aggregate_data()
│   └── return_dashboard_data()
│
├── aggregate_attendance_metrics(scope, date)
│   ├── fetch_attendance_records()
│   ├── calculate_today_stats()
│   ├── calculate_week_stats()
│   ├── calculate_month_stats()
│   └── cache_results()
│
├── get_widget_data(widget_key, filters)
│   ├── load_widget_config()
│   ├── check_widget_cache()
│   ├── execute_widget_query()
│   └── format_widget_data()
│
├── refresh_dashboard_cache(scope)
│   ├── invalidate_existing_cache()
│   ├── recalculate_metrics()
│   ├── update_cache()
│   └── notify_connected_clients()
│
└── schedule_aggregation_jobs()
    ├── define_aggregation_schedule()
    ├── queue_celery_tasks()
    └── monitor_job_completion()
```

### Aggregation Queries

**Optimized Database Queries**
```
Today's Attendance Summary:
WITH employee_count AS (
    SELECT COUNT(*) as total
    FROM employees
    WHERE is_active = true
    AND tenant_id = ?
),
today_attendance AS (
    SELECT
        COUNT(DISTINCT employee_id) as present,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent
    FROM attendance_records
    WHERE date = CURRENT_DATE
    AND tenant_id = ?
),
today_leaves AS (
    SELECT COUNT(DISTINCT employee_id) as on_leave
    FROM leave_requests
    WHERE ? BETWEEN start_date AND end_date
    AND status = 'approved'
    AND tenant_id = ?
)
SELECT
    ec.total as total_employees,
    COALESCE(ta.present, 0) as present_count,
    COALESCE(ta.late, 0) as late_count,
    COALESCE(ta.absent, 0) as absent_count,
    COALESCE(tl.on_leave, 0) as on_leave_count,
    ROUND(COALESCE(ta.present, 0) * 100.0 / ec.total, 2) as attendance_rate
FROM employee_count ec
LEFT JOIN today_attendance ta ON true
LEFT JOIN today_leaves tl ON true;
```

### Dashboard Widgets

**Widget Type Specifications**
```
Widget Types:
├── Metric Widget
│   ├── Purpose: Single KPI display
│   ├── Data: Scalar value + trend
│   ├── Example: "90% Attendance Today ↑"
│   └── Refresh: Real-time
│
├── Chart Widget
│   ├── Purpose: Trend visualization
│   ├── Data: Time-series array
│   ├── Example: Weekly attendance line chart
│   └── Refresh: Every 15 minutes
│
├── List Widget
│   ├── Purpose: Item listing
│   ├── Data: Array of records
│   ├── Example: Top 10 absent employees
│   └── Refresh: Every 5 minutes
│
├── Summary Widget
│   ├── Purpose: Multi-metric overview
│   ├── Data: Object with multiple values
│   ├── Example: Department comparison table
│   └── Refresh: Every 10 minutes
│
└── Alert Widget
    ├── Purpose: Important notifications
    ├── Data: Array of alerts
    ├── Example: Low attendance warnings
    └── Refresh: Real-time (WebSocket)
```

### Performance Optimization

**Query Optimization Techniques**
```
Optimization Strategies:
├── Database Level
│   ├── Indexes on frequently queried columns
│   │   └── (tenant_id, date, employee_id)
│   ├── Materialized views for aggregations
│   ├── Partitioning by date
│   └── Query result caching
│
├── Application Level
│   ├── Batch data fetching
│   ├── Lazy loading for widgets
│   ├── Parallel query execution
│   └── Response compression
│
├── Cache Level
│   ├── Aggressive caching (5-60 min TTL)
│   ├── Cache warming on data change
│   ├── Stale-while-revalidate pattern
│   └── Distributed cache (Redis cluster)
│
└── Network Level
    ├── CDN for static assets
    ├── HTTP/2 server push
    ├── GraphQL for selective data
    └── WebSocket for real-time updates
```

---

## TASK 75: Real-time WebSocket Updates

### Objective
Implement WebSocket connections for real-time dashboard updates and instant notifications.

### Business Requirements

#### Functional Requirements
1. **Real-time Features**
   - Live attendance tracking
   - Instant check-in/out notifications
   - Dashboard auto-refresh
   - Alert broadcasting
   - Status changes

2. **Event Types**
   - Employee check-in/out
   - Approval status changes
   - Threshold alerts
   - System notifications
   - Data updates

3. **Scalability Requirements**
   - Support 1000+ concurrent connections
   - Sub-second latency
   - Automatic reconnection
   - Room-based broadcasting

### Technical Design

#### WebSocket Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              WEBSOCKET ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Frontend Clients                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Browser  │  │ Browser  │  │ Browser  │  │ Browser  │   │
│  │ Client 1 │  │ Client 2 │  │ Client 3 │  │ Client N │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                       │ WebSocket Connections
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Load Balancer (with WebSocket support)                      │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Django Channels / WebSocket Servers                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Server 1 │  │ Server 2 │  │ Server N │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Redis Pub/Sub (Message Broker)                              │
│  - Channel layers                                            │
│  - Room management                                           │
│  - Message distribution                                      │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Backend Services                                            │
│  - Attendance Service                                        │
│  - Dashboard Service                                         │
│  - Notification Service                                      │
└──────────────────────────────────────────────────────────────┘
```

#### WebSocket Consumer Implementation

**Attendance Consumer Structure**
```
AttendanceConsumer(AsyncWebsocketConsumer):
├── async connect()
│   ├── Authenticate user
│   ├── Extract tenant_id
│   ├── Join room groups
│   │   ├── tenant_attendance_{tenant_id}
│   │   ├── department_attendance_{dept_id}
│   │   └── user_notifications_{user_id}
│   ├── Accept connection
│   └── Send initial state
│
├── async disconnect(code)
│   ├── Leave all room groups
│   ├── Cleanup resources
│   └── Log disconnect
│
├── async receive(text_data)
│   ├── Parse JSON message
│   ├── Validate permissions
│   ├── Route to handler
│   │   ├── subscribe
│   │   ├── unsubscribe
│   │   ├── ping/pong
│   │   └── refresh
│   └── Send response
│
└── Event Handlers
    ├── async attendance_update(event)
    ├── async dashboard_refresh(event)
    ├── async alert_notification(event)
    └── async system_message(event)
```

#### Message Protocol

**WebSocket Message Format**
```
Message Structure:
{
    "type": "event_type",
    "event": "specific_event",
    "data": {...},
    "timestamp": "2026-01-24T10:30:00Z",
    "metadata": {
        "tenant_id": "uuid",
        "user_id": "uuid",
        "correlation_id": "uuid"
    }
}

Event Types:
├── attendance.check_in
│   {
│       "type": "attendance.check_in",
│       "event": "employee_checked_in",
│       "data": {
│           "employee_id": "uuid",
│           "employee_name": "John Doe",
│           "check_in_time": "2026-01-24T09:00:00Z",
│           "location": "Main Office"
│       }
│   }
│
├── dashboard.update
│   {
│       "type": "dashboard.update",
│       "event": "metrics_updated",
│       "data": {
│           "widget_key": "today_attendance",
│           "metrics": {
│               "present_count": 45,
│               "attendance_rate": 90.0
│           }
│       }
│   }
│
├── alert.threshold
│   {
│       "type": "alert.threshold",
│       "event": "low_attendance_warning",
│       "data": {
│           "department": "Sales",
│           "current_rate": 75.0,
│           "threshold": 80.0,
│           "severity": "warning"
│       }
│   }
│
└── notification.approval
    {
        "type": "notification.approval",
        "event": "leave_approved",
        "data": {
            "leave_request_id": "uuid",
            "employee_name": "Jane Smith",
            "leave_type": "Annual Leave",
            "dates": "2026-01-25 to 2026-01-27"
        }
    }
```

### Broadcasting Service

**Event Broadcasting Implementation**
```
AttendanceBroadcastService:
├── broadcast_check_in(attendance_record)
│   ├── Prepare message
│   ├── Determine rooms
│   │   ├── tenant_attendance_{tenant_id}
│   │   └── department_attendance_{dept_id}
│   ├── Publish to channel layer
│   └── Log event
│
├── broadcast_dashboard_update(widget_key, data)
│   ├── Prepare update message
│   ├── Identify affected rooms
│   ├── Publish to channel layer
│   └── Update cache
│
├── broadcast_alert(alert_type, data, recipients)
│   ├── Create alert message
│   ├── Determine recipient rooms
│   │   ├── user_notifications_{user_id} (specific users)
│   │   └── tenant_alerts_{tenant_id} (all users)
│   ├── Publish with priority
│   └── Store in notification history
│
└── broadcast_system_message(message, scope)
    ├── Create system message
    ├── Determine broadcast scope
    │   ├── global (all tenants)
    │   ├── tenant (specific tenant)
    │   └── role (specific roles)
    ├── Publish to appropriate rooms
    └── Log broadcast
```

### Room Management

**Room Structure**
```
Room Naming Convention:
├── Tenant Rooms
│   ├── tenant_attendance_{tenant_id}
│   │   └── All attendance events for tenant
│   ├── tenant_dashboard_{tenant_id}
│   │   └── Dashboard updates for tenant
│   └── tenant_alerts_{tenant_id}
│       └── System alerts for tenant
│
├── Department Rooms
│   ├── department_attendance_{dept_id}
│   │   └── Department-specific attendance
│   └── department_dashboard_{dept_id}
│       └── Department metrics
│
├── User Rooms
│   ├── user_notifications_{user_id}
│   │   └── Personal notifications
│   └── user_dashboard_{user_id}
│       └── Personalized dashboard data
│
└── Role Rooms
    ├── role_manager_{tenant_id}
    │   └── Manager-specific events
    └── role_hr_{tenant_id}
        └── HR-specific events
```

### Client-Side Implementation

**WebSocket Client Structure**
```
AttendanceWebSocket:
├── Connection Management
│   ├── connect(token)
│   │   ├── Establish WebSocket connection
│   │   ├── Send authentication token
│   │   └── Setup event listeners
│   ├── disconnect()
│   │   ├── Close connection gracefully
│   │   └── Cleanup listeners
│   └── reconnect()
│       ├── Implement exponential backoff
│       ├── Restore subscriptions
│       └── Sync state
│
├── Event Subscription
│   ├── subscribe(event_type, callback)
│   │   └── Register event handler
│   ├── unsubscribe(event_type)
│   │   └── Remove event handler
│   └── subscribeToWidget(widget_key, callback)
│       └── Subscribe to specific widget updates
│
├── Message Handling
│   ├── send(message)
│   │   └── Send message to server
│   ├── onMessage(data)
│   │   ├── Parse message
│   │   ├── Route to handler
│   │   └── Trigger callbacks
│   └── onError(error)
│       └── Handle connection errors
│
└── State Management
    ├── connectionState (connected/disconnected/reconnecting)
    ├── subscriptions[]
    └── messageQueue[] (for offline messages)
```

**Frontend Integration Example**
```
Dashboard Integration:
├── Initialize WebSocket
│   const ws = new AttendanceWebSocket(token);
│   ws.connect();
│
├── Subscribe to Events
│   ws.subscribe('attendance.check_in', (data) => {
│       updateAttendanceCount(data);
│       showNotification(`${data.employee_name} checked in`);
│   });
│
│   ws.subscribeToWidget('today_attendance', (data) => {
│       updateWidget('today_attendance', data.metrics);
│   });
│
└── Handle Updates
    ├── Increment counters
    ├── Update charts
    ├── Refresh widgets
    └── Show toast notifications
```

### Scalability Considerations

**Horizontal Scaling Strategy**
```
Scaling Architecture:
├── Multiple WebSocket Servers
│   ├── Load balanced
│   ├── Stateless workers
│   └── Shared nothing architecture
│
├── Redis Cluster for Pub/Sub
│   ├── Distributed message broker
│   ├── High availability
│   └── Horizontal scalability
│
├── Connection Management
│   ├── Sticky sessions (optional)
│   ├── Connection pooling
│   └── Rate limiting per client
│
└── Monitoring
    ├── Active connections count
    ├── Message throughput
    ├── Latency metrics
    └── Error rates
```

### Performance Optimization

**Optimization Techniques**
```
Performance Strategies:
├── Message Batching
│   ├── Group related updates
│   ├── Send every 500ms
│   └── Reduce message overhead
│
├── Throttling
│   ├── Limit updates per second
│   ├── Debounce rapid changes
│   └── Priority-based delivery
│
├── Compression
│   ├── Enable WebSocket compression
│   ├── Minimize message payload
│   └── Use binary format for large data
│
└── Smart Broadcasting
    ├── Only send to interested clients
    ├── Use room-based filtering
    └── Implement message deduplication
```

---

## TASK 76: Payroll Integration

### Objective
Integrate attendance data with payroll systems for automated salary calculations and processing.

### Business Requirements

#### Functional Requirements
1. **Attendance to Payroll Mapping**
   - Working hours calculation
   - Overtime calculation
   - Absence deductions
   - Leave management
   - Attendance bonuses

2. **Payroll Data Export**
   - Formatted for payroll systems
   - Employee-wise summary
   - Period-based aggregation
   - Approval workflow

3. **Integration Methods**
   - API integration
   - File-based export
   - Real-time sync
   - Batch processing

### Technical Design

#### Payroll Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            PAYROLL INTEGRATION ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Attendance System                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Attendance │  │  Overtime  │  │   Leave    │            │
│  │  Records   │  │  Records   │  │  Records   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Payroll Integration Service                                 │
│  ┌────────────────────────────────────────────────┐         │
│  │  Data Aggregation & Calculation                │         │
│  │  - Hours worked                                 │         │
│  │  - Overtime hours                               │         │
│  │  - Absence deductions                           │         │
│  │  - Attendance bonuses                           │         │
│  └────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  Integration Layer                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   API    │  │  File    │  │ Webhook  │  │  Queue   │   │
│  │ Connector│  │ Generator│  │ Handler  │  │ Processor│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│  External Payroll Systems                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Custom  │  │  SAP HCM │  │ Workday  │  │  Others  │   │
│  │  System  │  │          │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
```

#### Payroll Data Model

```
PayrollExport
├── id (UUID)
├── tenant (FK)
├── export_period
│   ├── start_date
│   ├── end_date
│   └── period_type (weekly/bi-weekly/monthly)
├── status (draft/pending/approved/exported/completed)
├── employee_count
├── total_records
├── summary
│   ├── total_working_hours
│   ├── total_overtime_hours
│   ├── total_absences
│   ├── total_deductions
│   └── net_attendance_days
├── approval_workflow
│   ├── submitted_by (FK User)
│   ├── submitted_at
│   ├── approved_by (FK User)
│   ├── approved_at
│   └── rejection_reason
├── export_format (api/csv/excel/custom)
├── export_config (JSON)
├── export_file_path
├── exported_at
└── payroll_system_ref
```

```
PayrollEmployeeData
├── id (UUID)
├── payroll_export (FK)
├── employee (FK)
├── employee_code
├── work_summary
│   ├── expected_working_days
│   ├── actual_working_days
│   ├── working_hours
│   │   ├── regular_hours
│   │   ├── overtime_hours
│   │   └── total_hours
│   ├── attendance_percentage
│   └── punctuality_percentage
├── absences
│   ├── total_absences
│   ├── sick_leave_days
│   ├── annual_leave_days
│   ├── unpaid_leave_days
│   ├── late_arrivals
│   └── early_departures
├── overtime_breakdown
│   ├── weekday_overtime
│   ├── weekend_overtime
│   ├── holiday_overtime
│   └── night_shift_hours
├── deductions
│   ├── absence_deduction_days
│   ├── late_penalty_count
│   ├── early_departure_count
│   └── total_deduction_factor
├── bonuses
│   ├── perfect_attendance_bonus
│   ├── punctuality_bonus
│   └── performance_bonus
├── payroll_amounts (optional)
│   ├── base_calculation
│   ├── overtime_amount
│   ├── deduction_amount
│   └── bonus_amount
└── notes
```

### Calculation Service

**PayrollCalculationService Methods**
```
PayrollCalculationService:
├── calculate_payroll_data(period, employees)
│   ├── validate_period()
│   ├── fetch_attendance_data()
│   ├── calculate_for_each_employee()
│   │   ├── calculate_working_hours()
│   │   ├── calculate_overtime()
│   │   ├── calculate_absences()
│   │   ├── calculate_deductions()
│   │   └── calculate_bonuses()
│   └── generate_summary()
│
├── calculate_working_hours(employee, period)
│   ├── fetch_attendance_records()
│   ├── sum_regular_hours()
│   ├── exclude_breaks()
│   └── return_total_hours()
│
├── calculate_overtime_hours(employee, period)
│   ├── fetch_overtime_records()
│   ├── categorize_overtime()
│   │   ├── weekday_overtime
│   │   ├── weekend_overtime
│   │   └── holiday_overtime
│   └── apply_multipliers()
│
├── calculate_absence_deductions(employee, period)
│   ├── fetch_absence_records()
│   ├── categorize_absences()
│   │   ├── authorized_leaves (no deduction)
│   │   └── unauthorized_absences (deduction)
│   ├── calculate_deduction_days()
│   └── apply_deduction_rules()
│
└── calculate_attendance_bonuses(employee, period)
    ├── check_perfect_attendance()
    ├── check_punctuality_threshold()
    ├── calculate_bonus_amount()
    └── return_bonuses()
```

### Integration Methods

**API Integration**
```
API Integration Flow:
├── 1. Prepare Data
│   ├── Calculate payroll metrics
│   ├── Format according to API spec
│   └── Validate data structure
│
├── 2. Authentication
│   ├── OAuth 2.0 / API Key
│   ├── Obtain access token
│   └── Include in request headers
│
├── 3. Send Request
│   POST /api/v1/payroll/attendance-data
│   Headers:
│     Authorization: Bearer {token}
│     Content-Type: application/json
│   Body:
│     {
│       "period": {...},
│       "employees": [...]
│     }
│
├── 4. Handle Response
│   ├── Success: Store payroll_system_ref
│   ├── Validation Error: Fix and retry
│   └── Server Error: Retry with backoff
│
└── 5. Confirmation
    ├── Mark export as completed
    ├── Log transaction
    └── Notify stakeholders
```

**File-Based Export**
```
File Export Format (CSV):
┌────────────────────────────────────────────────────────────┐
│ employee_code,name,period_start,period_end,working_days,  │
│ hours_worked,overtime_hours,absence_days,deduction_factor,│
│ bonus_eligibility                                          │
├────────────────────────────────────────────────────────────┤
│ EMP001,John Doe,2026-01-01,2026-01-31,20,160.0,10.5,0,1.0│
│ EMP002,Jane Smith,2026-01-01,2026-01-31,18,144.0,5.0,2,0.9│
└────────────────────────────────────────────────────────────┘

Excel Export Structure:
├── Sheet 1: Summary
│   ├── Export period
│   ├── Total employees
│   ├── Aggregate statistics
│   └── Approval status
│
├── Sheet 2: Employee Details
│   ├── Employee information
│   ├── Work summary
│   ├── Attendance metrics
│   └── Calculated amounts
│
└── Sheet 3: Exceptions
    ├── Employees with high absences
    ├── Unusual overtime
    └── Pending approvals
```

### Approval Workflow

```
Payroll Export Approval Flow:
┌─────────────────────────────────────────────────────────────┐
│                  APPROVAL WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. PREPARATION
   ┌──────────────┐
   │ HR generates │
   │ payroll data │───→ Status: Draft
   │ for period   │
   └──────────────┘
          ↓
2. VALIDATION
   ┌──────────────┐
   │ System runs  │
   │ validations: │
   │ - Completeness│───→ Pass/Fail
   │ - Accuracy   │
   │ - Rules      │
   └──────────────┘
          ↓
3. REVIEW
   ┌──────────────┐
   │ HR Manager   │
   │ reviews data:│
   │ - Check      │───→ Status: Pending
   │   anomalies  │
   │ - Verify     │
   │   totals     │
   └──────────────┘
          ↓
4. APPROVAL
   ┌──────────────┐
   │ Approver     │
   │ decision:    │
   │ - Approve    │───→ Status: Approved
   │ - Reject     │───→ Status: Rejected
   │ - Request    │───→ Status: Revision
   │   changes    │
   └──────────────┘
          ↓
5. EXPORT
   ┌──────────────┐
   │ Approved data│
   │ exported to: │
   │ - Payroll    │───→ Status: Exported
   │   system     │
   │ - Archive    │
   └──────────────┘
          ↓
6. CONFIRMATION
   ┌──────────────┐
   │ Verify sync: │
   │ - Check      │
   │   records    │───→ Status: Completed
   │ - Confirm    │
   │   receipt    │
   └──────────────┘
```

### Error Handling & Recovery

**Error Scenarios**
```
Error Handling Strategy:
├── Incomplete Data
│   ├── Detection: Missing attendance records
│   ├── Action: Flag affected employees
│   ├── Resolution: Request manual entry
│   └── Status: Hold export until complete
│
├── Calculation Errors
│   ├── Detection: Negative hours, impossible values
│   ├── Action: Log error with details
│   ├── Resolution: Recalculate or manual override
│   └── Status: Mark for review
│
├── Integration Failures
│   ├── Detection: API timeout, connection error
│   ├── Action: Retry with exponential backoff
│   ├── Resolution: Queue for retry or manual export
│   └── Status: Failed, pending retry
│
└── Validation Failures
    ├── Detection: Data doesn't meet payroll system rules
    ├── Action: Return detailed validation errors
    ├── Resolution: Fix data and resubmit
    └── Status: Rejected, needs correction
```

### API Endpoints

```
Payroll Integration API:
├── POST /api/payroll/export/create
│   ├── Create new payroll export
│   ├── Request: { period, employees, format }
│   └── Response: { export_id, status, preview_url }
│
├── GET /api/payroll/export/{export_id}
│   ├── Get export status and details
│   └── Response: { export_data, status, summary }
│
├── POST /api/payroll/export/{export_id}/approve
│   ├── Approve export for processing
│   └── Response: { status, approved_at, approved_by }
│
├── POST /api/payroll/export/{export_id}/reject
│   ├── Reject export with reason
│   └── Response: { status, reason }
│
├── POST /api/payroll/export/{export_id}/send
│   ├── Send to payroll system
│   └── Response: { sent, payroll_ref, confirmation }
│
└── GET /api/payroll/employee/{employee_id}/data
    ├── Get employee payroll data for period
    └── Response: { work_summary, calculations }
```

---

## Testing Considerations

### Integration Testing

**Test Scenarios**
```
Test Cases:
├── Data Aggregation Tests
│   ├── Verify correct hour calculations
│   ├── Test overtime categorization
│   ├── Validate absence deductions
│   └── Check bonus eligibility
│
├── Export Format Tests
│   ├── Validate CSV structure
│   ├── Check Excel formatting
│   ├── Verify API payload
│   └── Test custom formats
│
├── Approval Workflow Tests
│   ├── Test approval process
│   ├── Verify rejection handling
│   ├── Check permission enforcement
│   └── Test notification triggers
│
└── Integration Tests
    ├── Mock payroll API responses
    ├── Test retry mechanisms
    ├── Verify error handling
    └── Check data consistency
```

---

## Monitoring & Analytics

### Key Metrics

```
Monitoring Dashboard:
├── Export Metrics
│   ├── Total exports per month
│   ├── Average processing time
│   ├── Success/failure rate
│   └── Data completeness percentage
│
├── Integration Health
│   ├── API response times
│   ├── Connection success rate
│   ├── Retry attempts
│   └── Error rates by type
│
├── Data Quality
│   ├── Records with missing data
│   ├── Validation failures
│   ├── Manual interventions
│   └── Anomaly detection
│
└── Business Metrics
    ├── Employees processed
    ├── Total hours calculated
    ├── Overtime trends
    └── Attendance bonus distribution
```

---

## Security Considerations

### Data Protection

```
Security Measures:
├── Data Encryption
│   ├── In-transit: TLS 1.3
│   ├── At-rest: AES-256
│   └── Field-level for sensitive data
│
├── Access Control
│   ├── Role-based permissions
│   ├── Approval workflow enforcement
│   ├── Audit logging
│   └── IP whitelisting (optional)
│
├── Data Privacy
│   ├── Minimal data exposure
│   ├── Anonymization options
│   ├── Retention policies
│   └── GDPR compliance
│
└── Integration Security
    ├── API key management
    ├── OAuth token refresh
    ├── Request signing
    └── Rate limiting
```

---

## Documentation & Training

### User Documentation

```
Documentation Structure:
├── Admin Guide
│   ├── Payroll export configuration
│   ├── Approval workflow setup
│   ├── Integration configuration
│   └── Troubleshooting guide
│
├── HR User Guide
│   ├── Generating payroll reports
│   ├── Reviewing employee data
│   ├── Approving exports
│   └── Handling exceptions
│
└── Technical Guide
    ├── API integration setup
    ├── Custom format development
    ├── Webhook configuration
    └── Error handling procedures
```

---

## Summary

This document covered the implementation of:

1. **Task 71:** Absence Report Generation with pattern analysis
2. **Task 72:** Attendance Percentage Calculation with real-time updates
3. **Task 73:** Export Service supporting Excel, PDF, and other formats
4. **Task 74:** Dashboard Data Aggregation with caching optimization
5. **Task 75:** Real-time WebSocket Updates for live dashboard
6. **Task 76:** Payroll Integration with approval workflow

All tasks work together to provide comprehensive reporting, analytics, and payroll integration capabilities for the attendance system.

---

## Next Steps

1. Review Group F: Integration APIs
2. Implement API endpoints for external systems
3. Set up webhook infrastructure
4. Configure third-party integrations

---

**Document End**