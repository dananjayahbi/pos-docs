# Tasks 75-80: KPI Alert System

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** E - HR KPIs & Alerts  
> **Document:** 02 of 02  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-74_HR-Metrics.md](01_Tasks-65-74_HR-Metrics.md)

---

## Document Overview

This document covers the implementation of the KPI alert system that monitors KPI thresholds and triggers notifications when metrics breach configured warning or critical levels. The system includes the KPIAlert model for storing alert configurations, alert checking service for evaluating thresholds, and a Celery task for periodic monitoring. The alert system supports email and dashboard notifications, urgency levels, and comparison operators for flexible threshold definitions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create KPIAlert Model | Medium | 30 min |
| 76 | Add Alert Threshold Fields | Low | 15 min |
| 77 | Add Alert Notification Config | Low | 15 min |
| 78 | Run KPIAlert Migrations | Low | 10 min |
| 79 | Create Alert Check Service | High | 45 min |
| 80 | Create Alert Celery Task | Medium | 25 min |

---

## Task 75: Create KPIAlert Model

### Overview
Create the KPIAlert model that stores alert configurations for KPI monitoring. This model defines which KPIs to monitor, threshold values, comparison operators, and notification preferences. Each alert is tenant-aware and linked to a specific KPIDefinition, enabling automated monitoring and alerting when KPI values breach configured thresholds.

### Dependencies
- KPIDefinition model exists (`apps/dashboard/models/kpi_definition.py`)
- Tenant model exists
- Django ORM configured

### Instructions

1. **Create kpi_alert.py model file**
   - Navigate to `apps/dashboard/models/` directory
   - Create file named `kpi_alert.py`
   - This will contain KPIAlert model

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import KPIDefinition model
   - Import JSONField for storing recipients
   - Import validators

3. **Define KPIAlert model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive class docstring
   - Explain alert monitoring purpose

4. **Add kpi_definition field**
   - ForeignKey to KPIDefinition
   - on_delete=CASCADE (delete alerts when KPI deleted)
   - related_name='alerts'
   - Identifies which KPI to monitor

5. **Add name field**
   - CharField, max_length=100
   - Required field
   - Human-readable alert identifier
   - Example: "Low Stock Alert", "High Turnover Warning"

6. **Add description field**
   - TextField, optional (blank=True, null=True)
   - Internal notes about alert purpose
   - Configuration details

7. **Add is_active field**
   - BooleanField, default=True
   - Controls whether alert is monitored
   - Can disable without deleting

8. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by name
   - Add unique_together constraint (tenant, kpi_definition, name)
   - Add index on (tenant, is_active)

9. **Add __str__ method**
   - Return alert name
   - Include KPI name in representation
   - Format: "Alert Name (KPI Name)"

10. **Update models/__init__.py**
    - Import KPIAlert
    - Add to __all__ list
    - Make available for imports

### KPIAlert Model Structure

```
┌─────────────────────────────────────────────────┐
│            KPIAlert Model                       │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • kpi_definition (ForeignKey)                  │
│  • name (CharField)                             │
│  • description (TextField, optional)            │
│  • is_active (BooleanField)                     │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
│                                                 │
│ To be added in next tasks:                      │
│  • Threshold fields (Task 76)                   │
│  • Notification config (Task 77)                │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│    KPIAlert        │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
┌──────────────────────────────────┐  ┌────────────────────┐
│      KPIDefinition               │◄─│    KPIAlert        │
│  (Sales, Inventory, HR, etc.)    │  │                    │
└──────────────────────────────────┘  └────────────────────┘
```

### Alert Configuration Examples

#### Low Stock Alert
```
Name: "Low Stock Items Alert"
KPI: Low Stock Count (Inventory KPI)
Description: "Alert when low stock items exceed threshold"
Is Active: True

Purpose: Notify when too many items need reordering
```

#### High Turnover Alert
```
Name: "Employee Turnover Warning"
KPI: Turnover Rate (HR KPI)
Description: "Alert when turnover rate exceeds healthy range"
Is Active: True

Purpose: Identify retention issues early
```

#### Cash Position Alert
```
Name: "Low Cash Position Alert"
KPI: Cash Position (Financial KPI)
Description: "Alert when cash drops below minimum required"
Is Active: True

Purpose: Ensure adequate liquidity for operations
```

#### Attendance Alert
```
Name: "Low Attendance Warning"
KPI: Today's Attendance Rate (HR KPI)
Description: "Alert when daily attendance drops below threshold"
Is Active: True

Purpose: Identify staffing issues immediately
```

### Alert Naming Guidelines

| Alert Name | KPI Category | Purpose |
|-----------|-------------|---------|
| "Low Stock Alert" | Inventory | Reorder notification |
| "Out of Stock Alert" | Inventory | Critical stock issue |
| "Overdue AR Alert" | Financial | Collection reminder |
| "Low Cash Alert" | Financial | Liquidity warning |
| "High Turnover Alert" | HR | Retention concern |
| "Low Attendance Alert" | HR | Staffing issue |
| "High Pending Orders" | Sales | Fulfillment backlog |
| "Top Sellers Stock" | Sales | Popular item tracking |

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| kpi_definition | ForeignKey | Yes | - | KPI to monitor |
| name | CharField(100) | Yes | - | Alert identifier |
| description | TextField | No | null | Alert notes |
| is_active | BooleanField | Yes | True | Enable/disable monitoring |
| tenant | ForeignKey | Yes | - | Tenant association |

### Active vs Inactive Alerts

```
Alert Lifecycle Management
══════════════════════════

Active Alert (is_active=True):
  ├── Monitored by Celery task
  ├── Thresholds checked periodically
  ├── Notifications sent when breached
  └── Appears in dashboard

Inactive Alert (is_active=False):
  ├── Not monitored
  ├── No threshold checks
  ├── No notifications sent
  ├── Retained for history
  └── Can be reactivated later

Use Cases for Deactivation:
  ├── Seasonal alerts (busy season only)
  ├── Temporary suspension
  ├── Testing/configuration changes
  └── Archived alerts
```

### Unique Constraint

```
Unique Together: (tenant, kpi_definition, name)

Prevents Duplicate Alerts:
  ├── Same tenant
  ├── Same KPI
  └── Same name

Allows:
  ├── Different tenants: Same KPI + name
  ├── Same tenant + KPI: Different names
  └── Multiple alerts per KPI (different names)

Example Conflict:
  Tenant A:
    ├── Alert: "Low Stock Alert" for "Low Stock Count" ✓
    └── Alert: "Low Stock Alert" for "Low Stock Count" ✗ (duplicate)

Example Valid:
  Tenant A:
    ├── Alert: "Low Stock Alert" for "Low Stock Count" ✓
    └── Alert: "Critical Stock Alert" for "Low Stock Count" ✓
```

### Expected Outcome
- Functional KPIAlert model
- Tenant-specific alert configurations
- Link to KPI definitions
- Active/inactive control
- Foundation for threshold monitoring

### Verification Checklist
- [ ] kpi_alert.py file created
- [ ] KPIAlert class defined
- [ ] kpi_definition ForeignKey added
- [ ] name field added
- [ ] description field added
- [ ] is_active field added
- [ ] Meta class configured
- [ ] Unique constraint defined
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py
- [ ] No syntax errors

---

## Task 76: Add Alert Threshold Fields

### Overview
Add threshold configuration fields to the KPIAlert model. These fields define warning and critical threshold values, comparison operators, and urgency levels for alert triggering. Supports both upper and lower threshold monitoring with flexible comparison logic for different KPI types.

### Dependencies
- Task 75: Create KPIAlert model

### Instructions

1. **Open kpi_alert.py model file**
   - Navigate to `apps/dashboard/models/kpi_alert.py`
   - Locate KPIAlert model class

2. **Define comparison operator choices**
   - Create COMPARISON_OPERATOR_CHOICES tuple
   - Include: GT (greater than), LT (less than), EQ (equals)
   - Used for threshold comparison logic

3. **Add comparison_operator field**
   - CharField with COMPARISON_OPERATOR_CHOICES
   - Default to 'GT'
   - Determines how to compare KPI value vs threshold
   - Example: GT means alert if value > threshold

4. **Add warning_threshold field**
   - DecimalField, max_digits=15, decimal_places=2
   - Optional (blank=True, null=True)
   - First-level threshold (less severe)
   - Example: Attendance < 90%

5. **Add critical_threshold field**
   - DecimalField, max_digits=15, decimal_places=2
   - Optional (blank=True, null=True)
   - Second-level threshold (more severe)
   - Example: Attendance < 85%

6. **Add threshold_unit field**
   - CharField, max_length=20, optional
   - Unit of measurement for threshold
   - Examples: "percent", "count", "currency", "days"
   - Used for display formatting

7. **Define urgency level choices**
   - Create URGENCY_LEVEL_CHOICES tuple
   - Include: INFO, WARNING, CRITICAL
   - Represents alert severity

8. **Add current_urgency_level field**
   - CharField with URGENCY_LEVEL_CHOICES
   - Default to 'INFO'
   - Tracks current alert state
   - Updated by alert check service

9. **Add last_triggered_at field**
   - DateTimeField, optional (blank=True, null=True)
   - Timestamp of last alert trigger
   - Used for notification deduplication

10. **Add consecutive_breaches field**
    - IntegerField, default=0
    - Counts consecutive threshold breaches
    - Prevents false positives (require N consecutive)

11. **Update model docstring**
    - Document threshold fields
    - Explain comparison logic
    - List urgency levels

### Threshold Fields Structure

```
┌────────────────────────────────────────────────┐
│         Alert Threshold Fields                 │
├────────────────────────────────────────────────┤
│ Comparison Configuration:                      │
│  • comparison_operator (GT/LT/EQ)              │
│  • threshold_unit (percent/count/currency)     │
│                                                │
│ Threshold Values:                              │
│  • warning_threshold (Decimal)                 │
│  • critical_threshold (Decimal)                │
│                                                │
│ Current State:                                 │
│  • current_urgency_level (INFO/WARNING/CRITICAL)│
│  • last_triggered_at (DateTime)                │
│  • consecutive_breaches (Integer)              │
└────────────────────────────────────────────────┘
```

### Comparison Operators

| Operator | Value | Logic | Use Case |
|----------|-------|-------|----------|
| Greater Than | 'GT' | value > threshold | High values are bad (e.g., turnover, defects) |
| Less Than | 'LT' | value < threshold | Low values are bad (e.g., attendance, cash) |
| Equals | 'EQ' | value == threshold | Exact match needed (rarely used) |

### Threshold Configuration Patterns

#### Pattern 1: Lower is Worse (Use LT operator)
```
KPI: Attendance Rate
Comparison: Less Than (LT)
Warning Threshold: 90.0
Critical Threshold: 85.0

Logic:
  ├── Value >= 90.0: No alert (OK)
  ├── 85.0 <= Value < 90.0: WARNING
  └── Value < 85.0: CRITICAL
```

#### Pattern 2: Higher is Worse (Use GT operator)
```
KPI: Employee Turnover Rate
Comparison: Greater Than (GT)
Warning Threshold: 5.0
Critical Threshold: 8.0

Logic:
  ├── Value <= 5.0: No alert (OK)
  ├── 5.0 < Value <= 8.0: WARNING
  └── Value > 8.0: CRITICAL
```

#### Pattern 3: Directional Thresholds
```
KPI: Inventory Days
Comparison: Greater Than (GT)
Warning Threshold: 60.0
Critical Threshold: 90.0

Interpretation:
  ├── < 60 days: Healthy inventory turnover
  ├── 60-90 days: Slow-moving inventory (WARNING)
  └── > 90 days: Dead stock (CRITICAL)
```

### Threshold Examples by KPI Category

#### Inventory KPIs
| KPI | Operator | Warning | Critical | Unit |
|-----|----------|---------|----------|------|
| Low Stock Count | GT | 10 | 25 | count |
| Out of Stock Count | GT | 1 | 5 | count |
| Overstock Items | GT | 5 | 15 | count |

#### Financial KPIs
| KPI | Operator | Warning | Critical | Unit |
|-----|----------|---------|----------|------|
| Cash Position | LT | 50000 | 10000 | currency |
| AR Overdue 90+ | GT | 100000 | 500000 | currency |
| Profit Margin % | LT | 15.0 | 10.0 | percent |

#### HR KPIs
| KPI | Operator | Warning | Critical | Unit |
|-----|----------|---------|----------|------|
| Attendance Rate | LT | 90.0 | 85.0 | percent |
| Turnover Rate | GT | 5.0 | 8.0 | percent |
| Pending Leave Requests | GT | 10 | 20 | count |

#### Sales KPIs
| KPI | Operator | Warning | Critical | Unit |
|-----|----------|---------|----------|------|
| Daily Sales Target Miss | LT | 80.0 | 60.0 | percent |
| Pending Orders | GT | 20 | 50 | count |
| Conversion Rate | LT | 15.0 | 10.0 | percent |

### Urgency Level Progression

```
Alert Urgency Levels
════════════════════

INFO (No breach):
  ├── KPI value within acceptable range
  ├── No alert triggered
  ├── Default state
  └── No notification sent

WARNING (First threshold breached):
  ├── KPI value exceeds warning threshold
  ├── Alert triggered
  ├── Email notification sent (if configured)
  └── Dashboard banner shown (yellow)

CRITICAL (Second threshold breached):
  ├── KPI value exceeds critical threshold
  ├── Urgent alert triggered
  ├── Multiple notifications sent
  └── Dashboard banner shown (red)

Urgency Transitions:
  INFO → WARNING → CRITICAL (deteriorating)
  CRITICAL → WARNING → INFO (improving)
```

### Sri Lankan Context Examples

#### EPF/ETF Compliance Alert
```
KPI: Missing EPF Contributions
Comparison: Greater Than (GT)
Warning Threshold: 0
Critical Threshold: 1
Unit: count

Interpretation:
  └── Any missing EPF contribution = Critical compliance issue
```

#### Public Holiday Overstaffing Alert
```
KPI: Employees Scheduled on Public Holiday
Comparison: Greater Than (GT)
Warning Threshold: 5
Critical Threshold: 10
Unit: count

Interpretation:
  ├── Public holidays in Sri Lanka are protected
  └── Excessive scheduling may indicate planning issue
```

#### Festival Season Inventory Alert
```
KPI: Stock Days Remaining
Comparison: Less Than (LT)
Warning Threshold: 14
Critical Threshold: 7
Unit: days

Context:
  ├── Vesak, Poson, Sinhala New Year are major shopping periods
  └── Ensure adequate inventory for demand surge
```

### Consecutive Breaches Logic

```
Consecutive Breach Tracking
═══════════════════════════

Purpose: Prevent false positives from temporary spikes

Scenario:
  ├── Day 1: Attendance 88% (below 90% warning)
  ├── Day 2: Attendance 87% (below 90% warning)
  ├── Day 3: Attendance 89% (below 90% warning)
  └── Day 4: Attendance 92% (above 90%, reset counter)

Configuration:
  ├── Require 2 consecutive breaches before alerting
  └── Avoids one-off anomalies

Implementation:
  If breach:
    consecutive_breaches += 1
    if consecutive_breaches >= required_consecutive:
      trigger_alert()
  Else:
    consecutive_breaches = 0
```

### Last Triggered At Usage

```
Notification Deduplication
══════════════════════════

Purpose: Avoid notification spam

Logic:
  ├── Alert triggered at: 2026-01-25 08:00 AM
  ├── Alert still breaching at: 2026-01-25 08:30 AM
  └── Don't send another notification (< 24 hours)

Notification Rules:
  ├── First breach: Send notification immediately
  ├── Still breaching after 24 hours: Send reminder
  ├── Resolved: Send "resolved" notification
  └── Breached again: Send new notification

last_triggered_at tracking:
  └── Update timestamp only when notification sent
```

### Threshold Unit Display

| Unit | Display Format | Example Value | Example Display |
|------|---------------|---------------|-----------------|
| percent | "X%" | 15.50 | "15.5%" |
| count | "X items" | 25 | "25 items" |
| currency | "LKR X" | 50000.00 | "LKR 50,000.00" |
| days | "X days" | 14 | "14 days" |
| hours | "X hours" | 48 | "48 hours" |

### Expected Outcome
- Flexible threshold configuration
- Warning and critical levels
- Comparison operator support
- Urgency level tracking
- Notification deduplication
- False positive prevention

### Verification Checklist
- [ ] COMPARISON_OPERATOR_CHOICES defined
- [ ] comparison_operator field added
- [ ] warning_threshold field added
- [ ] critical_threshold field added
- [ ] threshold_unit field added
- [ ] URGENCY_LEVEL_CHOICES defined
- [ ] current_urgency_level field added
- [ ] last_triggered_at field added
- [ ] consecutive_breaches field added
- [ ] All fields have appropriate defaults
- [ ] Model docstring updated

---

## Task 77: Add Alert Notification Config

### Overview
Add notification configuration fields to the KPIAlert model. These fields control how and to whom alerts are sent, including email notifications, dashboard banners, and recipient management. Supports multiple notification channels and flexible recipient configuration using JSONField.

### Dependencies
- Task 76: Add Alert Threshold Fields

### Instructions

1. **Open kpi_alert.py model file**
   - Continue in `apps/dashboard/models/kpi_alert.py`
   - Locate KPIAlert model class

2. **Add notify_email field**
   - BooleanField, default=True
   - Controls whether to send email notifications
   - Can disable email while keeping dashboard alerts

3. **Add notify_dashboard field**
   - BooleanField, default=True
   - Controls whether to show dashboard banner
   - Visible alert for logged-in users

4. **Add notification_recipients field**
   - JSONField for storing recipient configuration
   - Stores email addresses and user IDs
   - Default to empty list []
   - Flexible structure for multiple recipients

5. **Add notification_message_template field**
   - TextField, optional (blank=True, null=True)
   - Custom message template for notifications
   - Uses variables like {kpi_name}, {value}, {threshold}
   - Falls back to default message if not provided

6. **Add notify_on_resolve field**
   - BooleanField, default=False
   - Controls whether to send notification when alert resolves
   - "All clear" notification

7. **Add require_consecutive_breaches field**
   - IntegerField, default=1
   - Number of consecutive breaches required before alerting
   - Prevents false positives (1 = immediate, 2+ = wait)

8. **Add cooldown_period_minutes field**
   - IntegerField, default=1440 (24 hours)
   - Minimum time between repeat notifications
   - Prevents notification spam

9. **Update model docstring**
   - Document notification fields
   - Explain recipient configuration
   - List notification channels

### Notification Configuration Structure

```
┌────────────────────────────────────────────────┐
│      Alert Notification Configuration          │
├────────────────────────────────────────────────┤
│ Notification Channels:                         │
│  • notify_email (Boolean)                      │
│  • notify_dashboard (Boolean)                  │
│                                                │
│ Recipients:                                    │
│  • notification_recipients (JSON)              │
│    - Email addresses                           │
│    - User IDs                                  │
│    - Role-based (managers, HR, finance)        │
│                                                │
│ Customization:                                 │
│  • notification_message_template (Text)        │
│  • notify_on_resolve (Boolean)                 │
│                                                │
│ Frequency Control:                             │
│  • require_consecutive_breaches (Integer)      │
│  • cooldown_period_minutes (Integer)           │
└────────────────────────────────────────────────┘
```

### Notification Channels

| Channel | Field | Default | Purpose |
|---------|-------|---------|---------|
| Email | notify_email | True | Send email to recipients |
| Dashboard | notify_dashboard | True | Show banner in dashboard |
| Both | Both True | Most common | Maximum visibility |
| Dashboard Only | Email False, Dashboard True | For internal-only alerts |
| Email Only | Email True, Dashboard False | For external recipients |

### Notification Recipients Structure

#### JSON Schema
```json
{
  "emails": [
    "manager@example.lk",
    "hr@example.lk",
    "finance@example.lk"
  ],
  "user_ids": [1, 5, 12],
  "roles": ["manager", "hr_admin"],
  "departments": ["Sales", "Operations"]
}
```

#### Simple Email List
```json
{
  "emails": [
    "john.silva@company.lk",
    "mary.fernando@company.lk"
  ]
}
```

#### Role-Based Recipients
```json
{
  "roles": ["manager", "finance_manager"],
  "departments": ["Finance"]
}
```

#### Mixed Configuration
```json
{
  "emails": ["ceo@company.lk"],
  "user_ids": [1],
  "roles": ["hr_admin"],
  "departments": ["HR"]
}
```

### Notification Message Templates

#### Template Variables
| Variable | Description | Example Value |
|----------|-------------|---------------|
| {kpi_name} | KPI display name | "Attendance Rate" |
| {value} | Current KPI value | "87.5%" |
| {threshold} | Threshold breached | "90.0%" |
| {urgency} | Urgency level | "WARNING" |
| {tenant_name} | Tenant name | "LankaCommerce Pvt Ltd" |
| {date} | Current date | "2026-01-25" |
| {time} | Current time | "10:30 AM" |

#### Example Templates

**Low Attendance Alert:**
```
ALERT: {urgency} - {kpi_name}

Current attendance rate is {value}, which is below the {urgency} threshold of {threshold}.

Please review attendance records and take necessary action.

Date: {date}
Time: {time}
Tenant: {tenant_name}
```

**High Turnover Alert:**
```
Employee Turnover Alert

The turnover rate has reached {value}, exceeding the warning threshold of {threshold}.

This may indicate retention issues requiring management attention.

Review employee feedback and exit interview data.
```

**Low Stock Alert:**
```
Inventory Alert: Low Stock Items

{value} items are currently below minimum stock levels (threshold: {threshold}).

Please review and place reorders to avoid stockouts.
```

#### Default Message (When template not provided)
```
KPI Alert: {kpi_name}

Urgency: {urgency}
Current Value: {value}
Threshold: {threshold}

This alert was triggered automatically.
Please review and take appropriate action.
```

### Notify on Resolve

```
Alert Lifecycle Notifications
══════════════════════════════

Without notify_on_resolve (False):
  ├── Breach: Send alert ✓
  ├── Still breaching: No new alert (cooldown)
  └── Resolved: No notification ✗

With notify_on_resolve (True):
  ├── Breach: Send alert ✓
  ├── Still breaching: No new alert (cooldown)
  └── Resolved: Send "All Clear" notification ✓

Use Cases for Resolve Notification:
  ├── Critical alerts (know when resolved)
  ├── Compliance alerts (document resolution)
  ├── Financial alerts (cash flow restored)
  └── Operational alerts (service restored)
```

#### Resolve Notification Example
```
Alert Resolved: Attendance Rate

The attendance rate has returned to normal levels.

Previous Alert:
  ├── Triggered: 2026-01-25 08:00 AM
  ├── Urgency: WARNING
  └── Value: 87.5%

Current Status:
  ├── Resolved: 2026-01-25 02:30 PM
  ├── Current Value: 92.0%
  └── Duration: 6 hours 30 minutes

No further action required.
```

### Consecutive Breaches Configuration

```
Consecutive Breach Examples
═══════════════════════════

require_consecutive_breaches = 1 (Default):
  ├── First breach: Alert immediately
  └── Use for critical metrics

require_consecutive_breaches = 2:
  ├── First breach: Track, no alert
  ├── Second consecutive breach: Alert
  └── Use for volatile metrics

require_consecutive_breaches = 3:
  ├── First breach: Track (1/3)
  ├── Second breach: Track (2/3)
  ├── Third breach: Alert ✓
  └── Use for highly variable metrics

Reset:
  └── Any period without breach resets counter to 0
```

### Cooldown Period Configuration

```
Cooldown Period Examples
════════════════════════

cooldown_period_minutes = 60 (1 hour):
  ├── Alert at: 08:00 AM
  ├── Still breaching at: 08:30 AM (No new alert)
  ├── Still breaching at: 09:00 AM (No new alert)
  └── Can alert again at: 09:01 AM

cooldown_period_minutes = 1440 (24 hours - Default):
  ├── Alert at: 08:00 AM Monday
  ├── Still breaching all day (No new alert)
  └── Can alert again at: 08:00 AM Tuesday

cooldown_period_minutes = 10080 (1 week):
  ├── Alert at: Monday 08:00 AM
  ├── Still breaching all week (No new alert)
  └── Can alert again at: Next Monday 08:00 AM

Use Cases:
  ├── 60 min: Real-time critical alerts
  ├── 1440 min: Daily business alerts
  └── 10080 min: Weekly summary alerts
```

### Notification Channel Combinations

#### Maximum Visibility (Default)
```
notify_email: True
notify_dashboard: True

Result:
  ├── Email sent to recipients
  └── Dashboard banner shown

Use Case: Critical alerts needing immediate attention
```

#### Dashboard Only
```
notify_email: False
notify_dashboard: True

Result:
  ├── No email sent
  └── Dashboard banner shown

Use Case: Internal awareness, not urgent
```

#### Email Only
```
notify_email: True
notify_dashboard: False

Result:
  ├── Email sent to recipients
  └── No dashboard banner

Use Case: External stakeholders, scheduled reports
```

#### Disabled
```
notify_email: False
notify_dashboard: False

Result:
  ├── No email sent
  └── No dashboard banner

Use Case: Alert tracked but not notified (logging only)
```

### Sri Lankan Context Notifications

#### EPF/ETF Compliance Alert
```
Recipients:
  ├── HR Manager
  ├── Finance Manager
  └── Company Accountant

Channels: Email + Dashboard
Cooldown: 24 hours
Consecutive: 1 (immediate)

Template:
"EPF/ETF Compliance Issue

Missing or delayed EPF/ETF contributions detected.

This is a statutory requirement in Sri Lanka.
Immediate action required to avoid penalties.

Contact: Employees' Provident Fund Department"
```

#### Public Holiday Scheduling Alert
```
Recipients:
  ├── HR Manager
  └── Operations Manager

Channels: Dashboard only
Cooldown: 1 week
Consecutive: 1

Template:
"Public Holiday Staffing Notice

Employees scheduled on {date} (Public Holiday).

Sri Lankan labor law requires approval and compensation.
Please review and confirm scheduling is authorized."
```

#### Festival Season Stock Alert
```
Recipients:
  ├── Inventory Manager
  ├── Purchasing Manager
  └── CEO

Channels: Email + Dashboard
Cooldown: 24 hours
Consecutive: 2

Template:
"Festival Season Inventory Alert

Stock levels low with {value} days remaining before {festival}.

Major festivals (Vesak, Sinhala New Year, etc.) drive high demand.
Recommend immediate purchase orders to avoid stockouts."
```

### Recipient Resolution Logic

```
Recipient Resolution Process
════════════════════════════

1. Process emails array:
   └── Direct email addresses

2. Process user_ids array:
   └── Lookup users, get email addresses

3. Process roles array:
   └── Find all users with specified roles

4. Process departments array:
   └── Find all users in specified departments

5. Deduplicate:
   └── Remove duplicate email addresses

6. Filter:
   └── Remove inactive users/invalid emails

7. Send:
   └── Send to all resolved recipients
```

### Expected Outcome
- Flexible notification configuration
- Multiple notification channels
- Customizable recipient lists
- Message templates
- Notification frequency control
- Resolution notifications

### Verification Checklist
- [ ] notify_email field added
- [ ] notify_dashboard field added
- [ ] notification_recipients JSONField added
- [ ] notification_message_template field added
- [ ] notify_on_resolve field added
- [ ] require_consecutive_breaches field added
- [ ] cooldown_period_minutes field added
- [ ] All fields have appropriate defaults
- [ ] JSON structure documented
- [ ] Model docstring updated

---

## Task 78: Run KPIAlert Migrations

### Overview
Generate and apply Django database migrations for the KPIAlert model with all threshold and notification configuration fields. This task creates the database schema for storing alert configurations, enabling the alert monitoring system.

### Dependencies
- Task 77: Add Alert Notification Config
- KPIAlert model fully implemented
- PostgreSQL database configured

### Instructions

1. **Verify model completeness**
   - Open `apps/dashboard/models/kpi_alert.py`
   - Ensure all fields from Tasks 75-77 are present
   - Check for any syntax errors
   - Verify imports are correct

2. **Check for existing migrations**
   - Navigate to `apps/dashboard/migrations/` directory
   - List existing migration files
   - Identify the latest migration number

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment if needed
   - Run makemigrations command for dashboard app
   - Command: `python manage.py makemigrations dashboard`

4. **Review generated migration**
   - Locate new migration file (e.g., `0002_kpialert.py`)
   - Review migration operations
   - Verify all fields are included
   - Check for any warnings or errors

5. **Check migration plan**
   - Run showmigrations to see pending migrations
   - Command: `python manage.py showmigrations dashboard`
   - Verify new migration appears as pending

6. **Apply migration**
   - Run migrate command to apply changes
   - Command: `python manage.py migrate dashboard`
   - Monitor output for any errors

7. **Verify database schema**
   - Connect to PostgreSQL database
   - Check that kpi_alert table exists
   - Verify all columns are present
   - Check indexes and constraints

8. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import KPIAlert model
   - Try creating a test instance
   - Verify save and query operations

### Migration Generation Process

```
Migration Generation Flow
═════════════════════════

1. Code Changes:
   └── KPIAlert model defined with all fields

2. Run makemigrations:
   $ python manage.py makemigrations dashboard
   
   Output:
   ├── Migrations for 'dashboard':
   │   apps/dashboard/migrations/0002_kpialert.py
   │     - Create model KPIAlert

3. Review Migration File:
   └── Check operations, fields, indexes

4. Run migrate:
   $ python manage.py migrate dashboard
   
   Output:
   ├── Running migrations:
   │   Applying dashboard.0002_kpialert... OK

5. Verify:
   └── Check database schema
```

### Expected Migration Operations

```python
# apps/dashboard/migrations/0002_kpialert.py

operations = [
    migrations.CreateModel(
        name='KPIAlert',
        fields=[
            # Primary key
            ('id', models.BigAutoField(auto_created=True, primary_key=True)),
            
            # Core fields
            ('name', models.CharField(max_length=100)),
            ('description', models.TextField(blank=True, null=True)),
            ('is_active', models.BooleanField(default=True)),
            
            # Threshold fields
            ('comparison_operator', models.CharField(
                max_length=2,
                choices=[('GT', 'Greater Than'), ('LT', 'Less Than'), ('EQ', 'Equals')],
                default='GT'
            )),
            ('warning_threshold', models.DecimalField(
                max_digits=15,
                decimal_places=2,
                blank=True,
                null=True
            )),
            ('critical_threshold', models.DecimalField(
                max_digits=15,
                decimal_places=2,
                blank=True,
                null=True
            )),
            ('threshold_unit', models.CharField(max_length=20, blank=True)),
            
            # State tracking
            ('current_urgency_level', models.CharField(
                max_length=10,
                choices=[('INFO', 'Info'), ('WARNING', 'Warning'), ('CRITICAL', 'Critical')],
                default='INFO'
            )),
            ('last_triggered_at', models.DateTimeField(blank=True, null=True)),
            ('consecutive_breaches', models.IntegerField(default=0)),
            
            # Notification config
            ('notify_email', models.BooleanField(default=True)),
            ('notify_dashboard', models.BooleanField(default=True)),
            ('notification_recipients', models.JSONField(default=list)),
            ('notification_message_template', models.TextField(blank=True, null=True)),
            ('notify_on_resolve', models.BooleanField(default=False)),
            ('require_consecutive_breaches', models.IntegerField(default=1)),
            ('cooldown_period_minutes', models.IntegerField(default=1440)),
            
            # Relationships
            ('tenant', models.ForeignKey(
                on_delete=models.CASCADE,
                to='tenants.tenant'
            )),
            ('kpi_definition', models.ForeignKey(
                on_delete=models.CASCADE,
                related_name='alerts',
                to='dashboard.kpidefinition'
            )),
            
            # Timestamps
            ('created_at', models.DateTimeField(auto_now_add=True)),
            ('updated_at', models.DateTimeField(auto_now=True)),
        ],
        options={
            'verbose_name': 'KPI Alert',
            'verbose_name_plural': 'KPI Alerts',
            'ordering': ['name'],
        },
    ),
    
    migrations.AddIndex(
        model_name='kpialert',
        index=models.Index(
            fields=['tenant', 'is_active'],
            name='kpialert_tenant_active_idx'
        ),
    ),
    
    migrations.AddConstraint(
        model_name='kpialert',
        constraint=models.UniqueConstraint(
            fields=['tenant', 'kpi_definition', 'name'],
            name='unique_tenant_kpi_alert_name'
        ),
    ),
]
```

### Database Schema Verification

#### Expected Table Structure
```sql
-- KPI Alert Table
CREATE TABLE dashboard_kpialert (
    id BIGSERIAL PRIMARY KEY,
    
    -- Core fields
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Threshold fields
    comparison_operator VARCHAR(2) NOT NULL DEFAULT 'GT',
    warning_threshold NUMERIC(15, 2),
    critical_threshold NUMERIC(15, 2),
    threshold_unit VARCHAR(20),
    
    -- State tracking
    current_urgency_level VARCHAR(10) NOT NULL DEFAULT 'INFO',
    last_triggered_at TIMESTAMP,
    consecutive_breaches INTEGER NOT NULL DEFAULT 0,
    
    -- Notification config
    notify_email BOOLEAN NOT NULL DEFAULT TRUE,
    notify_dashboard BOOLEAN NOT NULL DEFAULT TRUE,
    notification_recipients JSONB NOT NULL DEFAULT '[]',
    notification_message_template TEXT,
    notify_on_resolve BOOLEAN NOT NULL DEFAULT FALSE,
    require_consecutive_breaches INTEGER NOT NULL DEFAULT 1,
    cooldown_period_minutes INTEGER NOT NULL DEFAULT 1440,
    
    -- Foreign keys
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    kpi_definition_id BIGINT NOT NULL REFERENCES dashboard_kpidefinition(id),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_tenant_kpi_alert_name 
        UNIQUE (tenant_id, kpi_definition_id, name)
);

-- Indexes
CREATE INDEX kpialert_tenant_active_idx 
    ON dashboard_kpialert(tenant_id, is_active);
```

### Django Shell Testing

```python
# Open Django shell
$ python manage.py shell

# Import models
>>> from apps.dashboard.models import KPIAlert, KPIDefinition
>>> from apps.tenants.models import Tenant

# Get test data
>>> tenant = Tenant.objects.first()
>>> kpi_def = KPIDefinition.objects.filter(
...     category='HR',
...     key='attendance_rate'
... ).first()

# Create test alert
>>> alert = KPIAlert.objects.create(
...     tenant=tenant,
...     kpi_definition=kpi_def,
...     name="Low Attendance Alert",
...     description="Alert when attendance drops below threshold",
...     comparison_operator='LT',
...     warning_threshold=90.0,
...     critical_threshold=85.0,
...     threshold_unit='percent',
...     notify_email=True,
...     notify_dashboard=True,
...     notification_recipients={
...         'emails': ['hr@example.lk']
...     }
... )

# Verify creation
>>> print(alert)
Low Attendance Alert (Attendance Rate)

>>> print(alert.id)
1

>>> print(alert.warning_threshold)
90.00

# Query alerts
>>> alerts = KPIAlert.objects.filter(tenant=tenant, is_active=True)
>>> print(alerts.count())
1

# Test relationships
>>> print(alert.kpi_definition.key)
attendance_rate

>>> print(alert.tenant.name)
LankaCommerce Pvt Ltd

# Success!
>>> exit()
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "No changes detected" | Model not in INSTALLED_APPS | Add dashboard to INSTALLED_APPS |
| "Table already exists" | Migration applied manually | Fake migration or drop table |
| "Column already exists" | Previous partial migration | Review migration history |
| "Foreign key constraint fails" | Related model not migrated | Migrate dependencies first |
| "Invalid default value" | JSONField default not callable | Use default=list not default=[] |

### Migration Rollback (If Needed)

```bash
# Check current migration status
$ python manage.py showmigrations dashboard

# Rollback to previous migration
$ python manage.py migrate dashboard 0001

# Delete generated migration file
$ rm apps/dashboard/migrations/0002_kpialert.py

# Fix model issues and regenerate
$ python manage.py makemigrations dashboard
$ python manage.py migrate dashboard
```

### Multi-Tenant Considerations

```
Tenant Isolation Verification
══════════════════════════════

1. Create alerts for Tenant A:
   └── Should only be visible to Tenant A users

2. Create alerts for Tenant B:
   └── Should only be visible to Tenant B users

3. Query verification:
   ├── Tenant A user: Only sees Tenant A alerts
   └── Tenant B user: Only sees Tenant B alerts

4. Foreign key constraints:
   ├── Cannot assign alert to wrong tenant's KPI
   └── CASCADE delete removes alerts when KPI deleted
```

### Expected Outcome
- KPIAlert table created in database
- All fields present with correct types
- Indexes and constraints applied
- Model functional in Django ORM
- Ready for alert service implementation

### Verification Checklist
- [ ] All model fields defined (Tasks 75-77)
- [ ] No syntax errors in model
- [ ] makemigrations command run successfully
- [ ] Migration file generated (0002_kpialert.py)
- [ ] Migration file reviewed
- [ ] migrate command run successfully
- [ ] No migration errors or warnings
- [ ] Table exists in database
- [ ] All columns present in table
- [ ] Indexes created
- [ ] Unique constraint applied
- [ ] Foreign keys working
- [ ] Test instance created in Django shell
- [ ] Query operations working

---

## Task 79: Create Alert Check Service

### Overview
Create the alert checking service that evaluates KPI values against configured thresholds and triggers notifications when breaches occur. This service is the core of the alert system, implementing comparison logic, urgency level determination, consecutive breach tracking, and notification triggering with cooldown periods.

### Dependencies
- Task 78: Run KPIAlert Migrations
- All KPI calculators implemented (Sales, Inventory, Financial, HR)
- Notification service or email backend configured

### Instructions

1. **Create alert_service.py file**
   - Navigate to `apps/dashboard/services/` directory
   - Create file named `alert_service.py`
   - This will contain AlertCheckService class

2. **Import required modules**
   - Import Django timezone utilities
   - Import KPIAlert model
   - Import all calculator classes (SalesKPICalculator, etc.)
   - Import logging for error tracking
   - Import email/notification utilities

3. **Define AlertCheckService class**
   - Add comprehensive class docstring
   - Explain alert checking logic
   - Document threshold comparison

4. **Add __init__ method**
   - Accept optional tenant parameter
   - Initialize logger
   - Store tenant for filtering

5. **Add get_calculator_for_kpi method**
   - Accept kpi_definition parameter
   - Return appropriate calculator instance based on category
   - Handle: Sales, Inventory, Financial, HR categories

6. **Add get_kpi_value method**
   - Accept kpi_definition parameter
   - Get calculator for KPI category
   - Call appropriate calculator method
   - Extract numeric value from response
   - Handle nested KPI responses

7. **Add compare_threshold method**
   - Accept: value, threshold, operator
   - Implement comparison logic (GT, LT, EQ)
   - Return True if threshold breached, False otherwise

8. **Add determine_urgency method**
   - Accept: value, warning_threshold, critical_threshold, operator
   - Compare value against both thresholds
   - Return: 'INFO', 'WARNING', or 'CRITICAL'
   - Handle cases where only one threshold is set

9. **Add should_trigger_notification method**
   - Accept: alert, current_urgency
   - Check consecutive_breaches requirement
   - Check cooldown_period
   - Return True if notification should be sent

10. **Add send_notification method**
    - Accept: alert, current_value, urgency
    - Format notification message using template
    - Send email if notify_email=True
    - Create dashboard notification if notify_dashboard=True
    - Resolve recipients from configuration

11. **Add check_alert method**
    - Accept: alert parameter
    - Main alert checking logic
    - Get current KPI value
    - Determine urgency level
    - Update consecutive_breaches counter
    - Trigger notification if needed
    - Update alert state (current_urgency_level, last_triggered_at)
    - Return alert check result

12. **Add check_all_alerts method**
    - Query all active alerts for tenant
    - Loop through each alert
    - Call check_alert for each
    - Collect results
    - Return summary of checks

13. **Add handle errors**
    - Wrap KPI value retrieval in try-except
    - Handle calculator errors gracefully
    - Log errors for debugging
    - Continue checking other alerts

14. **Update services/__init__.py**
    - Import AlertCheckService
    - Add to __all__ list

### AlertCheckService Structure

```
┌─────────────────────────────────────────────────┐
│         AlertCheckService                       │
├─────────────────────────────────────────────────┤
│ Initialization:                                 │
│  • __init__(tenant=None)                        │
│                                                 │
│ KPI Value Retrieval:                            │
│  • get_calculator_for_kpi(kpi_def)              │
│  • get_kpi_value(kpi_def)                       │
│                                                 │
│ Threshold Comparison:                           │
│  • compare_threshold(value, threshold, op)      │
│  • determine_urgency(value, warn, crit, op)     │
│                                                 │
│ Notification Logic:                             │
│  • should_trigger_notification(alert, urgency)  │
│  • send_notification(alert, value, urgency)     │
│                                                 │
│ Alert Checking:                                 │
│  • check_alert(alert)                           │
│  • check_all_alerts()                           │
└─────────────────────────────────────────────────┘
```

### Alert Check Flow

```
Alert Checking Process
══════════════════════

For each active KPIAlert:

1. Get Current KPI Value:
   ├── Identify KPI category (Sales, HR, etc.)
   ├── Instantiate appropriate calculator
   ├── Call calculator method
   └── Extract numeric value

2. Determine Urgency Level:
   ├── Compare value vs warning threshold
   ├── Compare value vs critical threshold
   └── Return INFO/WARNING/CRITICAL

3. Update Consecutive Breaches:
   ├── If breached: increment counter
   └── If not breached: reset counter to 0

4. Check Notification Requirements:
   ├── Consecutive breaches met?
   ├── Cooldown period expired?
   └── Urgency level changed?

5. Trigger Notification (if needed):
   ├── Format message from template
   ├── Resolve recipients
   ├── Send email (if configured)
   └── Create dashboard alert (if configured)

6. Update Alert State:
   ├── current_urgency_level
   ├── last_triggered_at (if notified)
   ├── consecutive_breaches
   └── Save changes

7. Return Result:
   └── Success/failure, urgency, notification sent
```

### Threshold Comparison Logic

```python
def compare_threshold(self, value, threshold, operator):
    """
    Compare KPI value against threshold using operator.
    
    Args:
        value: Current KPI value
        threshold: Threshold value to compare against
        operator: 'GT', 'LT', or 'EQ'
    
    Returns:
        True if threshold breached, False otherwise
    """
    if threshold is None:
        return False
    
    if operator == 'GT':
        return value > threshold
    elif operator == 'LT':
        return value < threshold
    elif operator == 'EQ':
        return value == threshold
    else:
        return False
```

### Urgency Determination Logic

```python
def determine_urgency(self, value, warning_threshold, critical_threshold, operator):
    """
    Determine urgency level based on threshold breaches.
    
    Returns:
        'INFO', 'WARNING', or 'CRITICAL'
    """
    # Check critical threshold first (more severe)
    if critical_threshold is not None:
        if self.compare_threshold(value, critical_threshold, operator):
            return 'CRITICAL'
    
    # Check warning threshold
    if warning_threshold is not None:
        if self.compare_threshold(value, warning_threshold, operator):
            return 'WARNING'
    
    # No thresholds breached
    return 'INFO'
```

### Urgency Determination Examples

#### Example 1: Attendance Rate (LT operator)
```
KPI Value: 87.5%
Warning Threshold: 90.0%
Critical Threshold: 85.0%
Operator: LT (Less Than)

Comparison:
  ├── 87.5 < 85.0? No (not critical)
  ├── 87.5 < 90.0? Yes (warning breached)
  └── Result: WARNING

Logic:
  Value below warning but above critical = WARNING
```

#### Example 2: Turnover Rate (GT operator)
```
KPI Value: 9.5%
Warning Threshold: 5.0%
Critical Threshold: 8.0%
Operator: GT (Greater Than)

Comparison:
  ├── 9.5 > 8.0? Yes (critical breached)
  └── Result: CRITICAL

Logic:
  Value exceeds critical threshold = CRITICAL
  (Don't need to check warning)
```

#### Example 3: No Breach
```
KPI Value: 95.0%
Warning Threshold: 90.0%
Critical Threshold: 85.0%
Operator: LT (Less Than)

Comparison:
  ├── 95.0 < 85.0? No
  ├── 95.0 < 90.0? No
  └── Result: INFO

Logic:
  No thresholds breached = INFO (normal)
```

### Consecutive Breach Tracking

```python
def update_consecutive_breaches(self, alert, is_breached):
    """
    Update consecutive breach counter.
    """
    if is_breached:
        alert.consecutive_breaches += 1
    else:
        alert.consecutive_breaches = 0
    
    alert.save()
    
    return alert.consecutive_breaches
```

#### Consecutive Breach Example
```
Alert Configuration:
  └── require_consecutive_breaches = 2

Day 1:
  ├── Value: 87% (breached, WARNING)
  ├── consecutive_breaches: 0 → 1
  └── Notification: NO (need 2 consecutive)

Day 2:
  ├── Value: 86% (breached, WARNING)
  ├── consecutive_breaches: 1 → 2
  └── Notification: YES (reached requirement)

Day 3:
  ├── Value: 92% (not breached)
  ├── consecutive_breaches: 2 → 0 (reset)
  └── Notification: NO

Day 4:
  ├── Value: 88% (breached again)
  ├── consecutive_breaches: 0 → 1
  └── Notification: NO (counter reset, need 2 again)
```

### Cooldown Period Check

```python
def should_trigger_notification(self, alert, current_urgency):
    """
    Determine if notification should be sent.
    """
    from django.utils import timezone
    from datetime import timedelta
    
    # Not breached (INFO level)
    if current_urgency == 'INFO':
        return False
    
    # Check consecutive breaches requirement
    if alert.consecutive_breaches < alert.require_consecutive_breaches:
        return False
    
    # Check cooldown period
    if alert.last_triggered_at:
        cooldown_delta = timedelta(minutes=alert.cooldown_period_minutes)
        time_since_last = timezone.now() - alert.last_triggered_at
        
        if time_since_last < cooldown_delta:
            # Still in cooldown period
            return False
    
    # Check if urgency level changed (always notify on escalation)
    if alert.current_urgency_level != current_urgency:
        return True
    
    # All checks passed
    return True
```

### Notification Message Formatting

```python
def format_notification_message(self, alert, value, urgency):
    """
    Format notification message using template.
    """
    from django.utils import timezone
    
    # Get template or use default
    template = alert.notification_message_template or self.get_default_template()
    
    # Prepare template variables
    context = {
        'kpi_name': alert.kpi_definition.name,
        'value': self.format_value(value, alert.threshold_unit),
        'threshold': self.format_value(
            alert.warning_threshold if urgency == 'WARNING' else alert.critical_threshold,
            alert.threshold_unit
        ),
        'urgency': urgency,
        'tenant_name': alert.tenant.name,
        'date': timezone.now().strftime('%Y-%m-%d'),
        'time': timezone.now().strftime('%I:%M %p'),
    }
    
    # Replace variables in template
    message = template.format(**context)
    
    return message
```

### Email Notification Sending

```python
def send_email_notification(self, alert, message, urgency):
    """
    Send email notification to configured recipients.
    """
    from django.core.mail import send_mail
    from django.conf import settings
    
    # Resolve email recipients
    recipients = self.resolve_email_recipients(alert.notification_recipients)
    
    if not recipients:
        return False
    
    # Determine email subject
    subject = f"[{urgency}] KPI Alert: {alert.kpi_definition.name}"
    
    # Send email
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
        return True
    except Exception as e:
        logger.error(f"Failed to send email notification: {e}")
        return False
```

### Dashboard Notification Creation

```python
def create_dashboard_notification(self, alert, message, urgency):
    """
    Create dashboard notification/banner.
    """
    from apps.notifications.models import Notification
    
    try:
        Notification.objects.create(
            tenant=alert.tenant,
            type='kpi_alert',
            urgency=urgency.lower(),
            title=f"KPI Alert: {alert.kpi_definition.name}",
            message=message,
            link=f"/dashboard/kpis/{alert.kpi_definition.category.lower()}/",
            is_read=False,
        )
        return True
    except Exception as e:
        logger.error(f"Failed to create dashboard notification: {e}")
        return False
```

### Error Handling

```python
def check_alert(self, alert):
    """
    Check single alert and trigger notification if needed.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Get current KPI value
        kpi_value = self.get_kpi_value(alert.kpi_definition)
        
        # Determine urgency
        urgency = self.determine_urgency(
            kpi_value,
            alert.warning_threshold,
            alert.critical_threshold,
            alert.comparison_operator
        )
        
        # Update consecutive breaches
        is_breached = (urgency != 'INFO')
        self.update_consecutive_breaches(alert, is_breached)
        
        # Check if notification needed
        notification_sent = False
        if self.should_trigger_notification(alert, urgency):
            message = self.format_notification_message(alert, kpi_value, urgency)
            
            if alert.notify_email:
                self.send_email_notification(alert, message, urgency)
            
            if alert.notify_dashboard:
                self.create_dashboard_notification(alert, message, urgency)
            
            notification_sent = True
            alert.last_triggered_at = timezone.now()
        
        # Update alert state
        alert.current_urgency_level = urgency
        alert.save()
        
        return {
            'success': True,
            'alert_id': alert.id,
            'alert_name': alert.name,
            'kpi_value': kpi_value,
            'urgency': urgency,
            'notification_sent': notification_sent,
        }
        
    except Exception as e:
        logger.error(f"Error checking alert {alert.id}: {e}")
        return {
            'success': False,
            'alert_id': alert.id,
            'alert_name': alert.name,
            'error': str(e),
        }
```

### Check All Alerts Method

```python
def check_all_alerts(self, category=None):
    """
    Check all active alerts for tenant.
    
    Args:
        category: Optional KPI category filter ('Sales', 'HR', etc.)
    
    Returns:
        Dictionary with check results
    """
    # Query active alerts
    alerts = KPIAlert.objects.filter(
        tenant=self.tenant,
        is_active=True
    )
    
    # Filter by category if provided
    if category:
        alerts = alerts.filter(kpi_definition__category=category)
    
    # Check each alert
    results = []
    for alert in alerts:
        result = self.check_alert(alert)
        results.append(result)
    
    # Summarize results
    summary = {
        'total_checked': len(results),
        'successful_checks': sum(1 for r in results if r['success']),
        'failed_checks': sum(1 for r in results if not r['success']),
        'notifications_sent': sum(1 for r in results if r.get('notification_sent')),
        'critical_alerts': sum(1 for r in results if r.get('urgency') == 'CRITICAL'),
        'warning_alerts': sum(1 for r in results if r.get('urgency') == 'WARNING'),
        'results': results,
    }
    
    return summary
```

### Usage Example

```python
# In Django management command or Celery task
from apps.dashboard.services.alert_service import AlertCheckService
from apps.tenants.models import Tenant

# Check alerts for specific tenant
tenant = Tenant.objects.get(id=1)
service = AlertCheckService(tenant=tenant)
results = service.check_all_alerts()

print(f"Checked {results['total_checked']} alerts")
print(f"Sent {results['notifications_sent']} notifications")
print(f"Critical alerts: {results['critical_alerts']}")
print(f"Warning alerts: {results['warning_alerts']}")

# Check only HR alerts
hr_results = service.check_all_alerts(category='HR')
```

### Expected Outcome
- Functional alert checking service
- Threshold comparison logic
- Urgency level determination
- Consecutive breach tracking
- Cooldown period enforcement
- Email and dashboard notifications
- Error handling and logging
- Foundation for Celery task

### Verification Checklist
- [ ] alert_service.py file created
- [ ] AlertCheckService class defined
- [ ] All calculator imports added
- [ ] get_calculator_for_kpi method implemented
- [ ] get_kpi_value method implemented
- [ ] compare_threshold method implemented
- [ ] determine_urgency method implemented
- [ ] should_trigger_notification method implemented
- [ ] send_notification method implemented
- [ ] check_alert method implemented
- [ ] check_all_alerts method implemented
- [ ] Error handling added
- [ ] Logging configured
- [ ] Service imported in __init__.py
- [ ] Manual testing completed

---

## Task 80: Create Alert Celery Task

### Overview
Create a Celery periodic task that automatically runs the alert checking service at regular intervals. This task enables continuous monitoring of KPIs across all tenants, triggering notifications when thresholds are breached. Configured to run every 30 minutes by default, ensuring timely detection of issues.

### Dependencies
- Task 79: Create Alert Check Service
- Celery configured in Django project
- Celery Beat scheduler configured
- Redis or RabbitMQ message broker

### Instructions

1. **Verify Celery configuration**
   - Ensure Celery is configured in project settings
   - Verify CELERY_BROKER_URL is set
   - Verify CELERY_BEAT_SCHEDULE exists
   - Check that dashboard app has tasks.py

2. **Open or create tasks.py**
   - Navigate to `apps/dashboard/` directory
   - Open existing `tasks.py` or create new file
   - Import required Celery decorators

3. **Import required modules**
   - Import shared_task decorator from Celery
   - Import AlertCheckService
   - Import Tenant model
   - Import logging

4. **Define check_kpi_alerts task**
   - Use @shared_task decorator
   - Accept optional tenant_id parameter
   - Add comprehensive docstring

5. **Implement tenant iteration logic**
   - If tenant_id provided: check only that tenant
   - If no tenant_id: check all active tenants
   - Loop through tenants

6. **Call AlertCheckService for each tenant**
   - Instantiate service with tenant
   - Call check_all_alerts method
   - Capture results

7. **Log results**
   - Log summary for each tenant
   - Log total notifications sent
   - Log any errors encountered

8. **Add error handling**
   - Wrap service call in try-except
   - Continue to next tenant on error
   - Log errors for debugging

9. **Return task results**
   - Return summary dictionary
   - Include tenant count, alerts checked, notifications sent

10. **Configure Celery Beat schedule**
    - Open project settings (settings.py or celery.py)
    - Add task to CELERY_BEAT_SCHEDULE
    - Set schedule to run every 30 minutes
    - Use crontab or timedelta for scheduling

11. **Add task documentation**
    - Document task purpose
    - Document scheduling
    - Document manual invocation

12. **Test task manually**
    - Call task directly: `check_kpi_alerts.delay()`
    - Verify execution
    - Check logs for results

### Celery Task Structure

```
┌─────────────────────────────────────────────────┐
│         check_kpi_alerts Task                   │
├─────────────────────────────────────────────────┤
│ Decorator:                                      │
│  • @shared_task                                 │
│                                                 │
│ Parameters:                                     │
│  • tenant_id (optional) - Check specific tenant │
│                                                 │
│ Logic:                                          │
│  1. Get tenants (all or specific)               │
│  2. For each tenant:                            │
│     - Instantiate AlertCheckService             │
│     - Call check_all_alerts()                   │
│     - Log results                               │
│  3. Return summary                              │
│                                                 │
│ Scheduling:                                     │
│  • Every 30 minutes via Celery Beat             │
│                                                 │
│ Error Handling:                                 │
│  • Continue on tenant errors                    │
│  • Log all errors                               │
└─────────────────────────────────────────────────┘
```

### Task Implementation

```python
# apps/dashboard/tasks.py

from celery import shared_task
from apps.dashboard.services.alert_service import AlertCheckService
from apps.tenants.models import Tenant
import logging

logger = logging.getLogger(__name__)

@shared_task(name='dashboard.check_kpi_alerts')
def check_kpi_alerts(tenant_id=None):
    """
    Check KPI alerts for all tenants and trigger notifications.
    
    This task runs periodically (every 30 minutes by default) to monitor
    KPI thresholds and send alerts when values breach configured limits.
    
    Args:
        tenant_id (int, optional): If provided, check only this tenant's alerts.
                                   Otherwise, check all active tenants.
    
    Returns:
        dict: Summary of alert checks including:
            - total_tenants: Number of tenants checked
            - total_alerts_checked: Total alerts evaluated
            - total_notifications_sent: Total notifications triggered
            - tenants_with_alerts: Count of tenants with active alerts
    """
    logger.info("Starting KPI alert check task")
    
    # Determine which tenants to check
    if tenant_id:
        tenants = Tenant.objects.filter(id=tenant_id, is_active=True)
    else:
        tenants = Tenant.objects.filter(is_active=True)
    
    # Initialize summary
    summary = {
        'total_tenants': 0,
        'total_alerts_checked': 0,
        'total_notifications_sent': 0,
        'tenants_with_alerts': 0,
        'errors': []
    }
    
    # Check alerts for each tenant
    for tenant in tenants:
        summary['total_tenants'] += 1
        
        try:
            # Instantiate alert service for tenant
            service = AlertCheckService(tenant=tenant)
            
            # Check all alerts
            results = service.check_all_alerts()
            
            # Update summary
            summary['total_alerts_checked'] += results['total_checked']
            summary['total_notifications_sent'] += results['notifications_sent']
            
            if results['total_checked'] > 0:
                summary['tenants_with_alerts'] += 1
            
            # Log tenant results
            logger.info(
                f"Tenant {tenant.name} (ID: {tenant.id}): "
                f"Checked {results['total_checked']} alerts, "
                f"Sent {results['notifications_sent']} notifications, "
                f"Critical: {results['critical_alerts']}, "
                f"Warning: {results['warning_alerts']}"
            )
            
        except Exception as e:
            error_msg = f"Error checking alerts for tenant {tenant.name} (ID: {tenant.id}): {str(e)}"
            logger.error(error_msg)
            summary['errors'].append({
                'tenant_id': tenant.id,
                'tenant_name': tenant.name,
                'error': str(e)
            })
    
    # Log overall summary
    logger.info(
        f"KPI alert check completed: "
        f"Checked {summary['total_tenants']} tenants, "
        f"{summary['total_alerts_checked']} alerts, "
        f"Sent {summary['total_notifications_sent']} notifications"
    )
    
    return summary
```

### Celery Beat Schedule Configuration

```python
# settings.py or celery.py

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # ... existing tasks ...
    
    'check-kpi-alerts': {
        'task': 'dashboard.check_kpi_alerts',
        'schedule': 30 * 60,  # Every 30 minutes (in seconds)
        # OR use crontab for more specific scheduling:
        # 'schedule': crontab(minute='*/30'),  # Every 30 minutes
        'options': {
            'expires': 15 * 60,  # Task expires after 15 minutes if not executed
        }
    },
}
```

### Alternative Scheduling Options

#### Every 15 Minutes (More Frequent)
```python
'check-kpi-alerts': {
    'task': 'dashboard.check_kpi_alerts',
    'schedule': 15 * 60,  # 900 seconds
}
```

#### Every Hour (Less Frequent)
```python
'check-kpi-alerts': {
    'task': 'dashboard.check_kpi_alerts',
    'schedule': 60 * 60,  # 3600 seconds
}
```

#### Specific Times (Using Crontab)
```python
# Every hour at the top of the hour
'schedule': crontab(minute=0, hour='*'),

# Every 30 minutes (on the hour and half-hour)
'schedule': crontab(minute='0,30'),

# Business hours only (8 AM - 6 PM, every 30 min)
'schedule': crontab(minute='*/30', hour='8-18'),

# Weekdays only (Monday-Friday)
'schedule': crontab(minute='*/30', day_of_week='1-5'),
```

### Task Invocation

#### Automatic (Celery Beat)
```bash
# Start Celery worker
$ celery -A config worker --loglevel=info

# Start Celery Beat scheduler (separate terminal)
$ celery -A config beat --loglevel=info

# Beat will automatically invoke task every 30 minutes
```

#### Manual Invocation
```python
# In Django shell or management command
from apps.dashboard.tasks import check_kpi_alerts

# Check all tenants (asynchronous)
task = check_kpi_alerts.delay()
print(f"Task ID: {task.id}")

# Check specific tenant (asynchronous)
task = check_kpi_alerts.delay(tenant_id=1)

# Check all tenants (synchronous, wait for result)
result = check_kpi_alerts()
print(result)
```

#### Django Management Command (Optional)
```python
# apps/dashboard/management/commands/check_kpi_alerts.py

from django.core.management.base import BaseCommand
from apps.dashboard.tasks import check_kpi_alerts

class Command(BaseCommand):
    help = 'Check KPI alerts for all tenants'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant-id',
            type=int,
            help='Check alerts for specific tenant only'
        )
    
    def handle(self, *args, **options):
        tenant_id = options.get('tenant_id')
        
        self.stdout.write('Checking KPI alerts...')
        result = check_kpi_alerts(tenant_id=tenant_id)
        
        self.stdout.write(self.style.SUCCESS(
            f"Checked {result['total_alerts_checked']} alerts "
            f"across {result['total_tenants']} tenants"
        ))
        self.stdout.write(self.style.SUCCESS(
            f"Sent {result['total_notifications_sent']} notifications"
        ))

# Usage:
# $ python manage.py check_kpi_alerts
# $ python manage.py check_kpi_alerts --tenant-id=1
```

### Task Monitoring

#### Celery Flower (Web-based monitoring)
```bash
# Install Flower
$ pip install flower

# Start Flower
$ celery -A config flower

# Access dashboard at http://localhost:5555
```

#### Task Execution Logs
```
Task Execution Log Example
══════════════════════════

[2026-01-25 10:30:00] INFO: Starting KPI alert check task
[2026-01-25 10:30:01] INFO: Tenant LankaCommerce Pvt Ltd (ID: 1): Checked 5 alerts, Sent 2 notifications, Critical: 1, Warning: 1
[2026-01-25 10:30:02] INFO: Tenant RetailCo Lanka (ID: 2): Checked 3 alerts, Sent 0 notifications, Critical: 0, Warning: 0
[2026-01-25 10:30:02] INFO: KPI alert check completed: Checked 2 tenants, 8 alerts, Sent 2 notifications
```

### Performance Considerations

#### For Large Number of Tenants
```python
# Option 1: Process tenants in batches
@shared_task
def check_kpi_alerts_batch(batch_size=10):
    tenants = Tenant.objects.filter(is_active=True)
    
    for i in range(0, tenants.count(), batch_size):
        batch = tenants[i:i + batch_size]
        for tenant in batch:
            # Check alerts
            pass

# Option 2: Create subtasks per tenant
@shared_task
def check_kpi_alerts_parallel():
    tenants = Tenant.objects.filter(is_active=True)
    
    # Create subtask for each tenant
    for tenant in tenants:
        check_tenant_alerts.delay(tenant.id)

@shared_task
def check_tenant_alerts(tenant_id):
    tenant = Tenant.objects.get(id=tenant_id)
    service = AlertCheckService(tenant=tenant)
    return service.check_all_alerts()
```

### Sri Lankan Business Context

#### Scheduling for Sri Lankan Business Hours
```python
# Check alerts during business hours (8 AM - 6 PM)
'check-kpi-alerts-business-hours': {
    'task': 'dashboard.check_kpi_alerts',
    'schedule': crontab(minute='*/15', hour='8-18'),  # Every 15 min, 8 AM - 6 PM
}

# Less frequent checks outside business hours
'check-kpi-alerts-off-hours': {
    'task': 'dashboard.check_kpi_alerts',
    'schedule': crontab(minute='0', hour='19-7'),  # Hourly, 7 PM - 7 AM
}

# No checks on public holidays (implement custom schedule)
# Requires custom scheduler or check in task logic
```

#### Timezone Considerations
```python
# settings.py
USE_TZ = True
TIME_ZONE = 'Asia/Colombo'  # Sri Lanka timezone (UTC+5:30)

# Celery respects Django timezone settings
CELERY_TIMEZONE = 'Asia/Colombo'
CELERY_ENABLE_UTC = False
```

### Error Recovery

#### Retry on Failure
```python
@shared_task(
    name='dashboard.check_kpi_alerts',
    bind=True,
    max_retries=3,
    default_retry_delay=300  # 5 minutes
)
def check_kpi_alerts(self, tenant_id=None):
    try:
        # Task logic...
        pass
    except Exception as exc:
        logger.error(f"KPI alert check failed: {exc}")
        raise self.retry(exc=exc)
```

### Expected Outcome
- Celery task for periodic alert checking
- Scheduled execution every 30 minutes
- Multi-tenant support
- Error handling and logging
- Manual invocation capability
- Complete alert monitoring automation

### Verification Checklist
- [ ] tasks.py file created or updated
- [ ] check_kpi_alerts task defined
- [ ] @shared_task decorator applied
- [ ] Tenant iteration logic implemented
- [ ] AlertCheckService integration completed
- [ ] Error handling added
- [ ] Logging configured
- [ ] Celery Beat schedule configured
- [ ] Task registered with Celery
- [ ] Manual task invocation tested
- [ ] Celery worker and beat started
- [ ] Task executes on schedule
- [ ] Task results logged correctly
- [ ] Notifications sent successfully

---

## Summary

This document established the comprehensive KPI alert monitoring system:

### Completed Infrastructure
- ✅ KPIAlert model for storing alert configurations (Task 75)
- ✅ Alert threshold fields (warning/critical, comparison operators) (Task 76)
- ✅ Alert notification configuration (email, dashboard, recipients) (Task 77)
- ✅ Database migrations for KPIAlert model (Task 78)
- ✅ AlertCheckService for threshold evaluation and notification (Task 79)
- ✅ Celery periodic task for automated monitoring (Task 80)

### Key Achievements
1. **Flexible Threshold Configuration** - Warning and critical levels with comparison operators
2. **Multi-Channel Notifications** - Email and dashboard alerts with customizable recipients
3. **Intelligent Alerting** - Consecutive breach tracking and cooldown periods prevent false positives
4. **Automated Monitoring** - Celery task runs every 30 minutes for continuous oversight
5. **Error Resilience** - Comprehensive error handling ensures reliable operation
6. **Multi-Tenant Support** - Isolated alert configurations per tenant

### Alert System Features
- Comparison operators (GT, LT, EQ) for flexible threshold logic
- Two-tier urgency (WARNING and CRITICAL) for graduated response
- Notification deduplication with cooldown periods
- Customizable message templates with variable substitution
- Resolution notifications for "all clear" status
- Dashboard banner and email notification channels

### Sri Lankan Context Integration
- Timezone-aware scheduling (Asia/Colombo)
- Business hours optimized checking
- Festival season and public holiday awareness
- Local compliance alerts (EPF/ETF, labor law)

### Automation Complete
All HR KPIs from Group E are now automatically monitored with configurable alerts, providing proactive notification of:
- Low attendance rates
- High employee turnover
- Pending leave request backlogs
- Payroll anomalies
- Any custom KPI threshold breaches

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6 (Tasks 75-80)  
**Total Lines:** ~950
