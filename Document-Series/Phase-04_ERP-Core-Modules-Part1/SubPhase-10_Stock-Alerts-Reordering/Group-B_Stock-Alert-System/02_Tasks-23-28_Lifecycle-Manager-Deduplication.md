# Tasks 23-28: Lifecycle, Manager & Deduplication

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** B - Stock Alert System  
> **Document:** 02 of 03  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-22_Alert-Constants-Model.md](01_Tasks-17-22_Alert-Constants-Model.md)
- **→ Next Document:** [03_Tasks-29-34_Notification-Service-Admin.md](03_Tasks-29-34_Notification-Service-Admin.md)

---

## Document Overview

This document covers lifecycle timestamp tracking, acknowledgment and snooze functionality, model configuration, custom manager methods, and alert deduplication logic.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 23 | Add created/resolved timestamps | Low |
| 24 | Add acknowledged_by FK | Low |
| 25 | Add snooze functionality | Medium |
| 26 | Create StockAlert Meta class | Low |
| 27 | Add StockAlert manager | Medium |
| 28 | Create alert deduplication | Medium |

---

## Task 23: Add Created/Resolved Timestamps

### Overview
Add comprehensive timestamp fields to track the complete lifecycle of alerts from creation through resolution.

### Dependencies
- Task 19: Create StockAlert model

### Instructions

1. **Add created_at field**
   - Type: DateTimeField
   - auto_now_add: True
   - Help text: "When alert was created"

2. **Add updated_at field**
   - Type: DateTimeField
   - auto_now: True
   - Help text: "Last update to alert"

3. **Add resolved_at field**
   - Type: DateTimeField
   - null=True, blank=True
   - Help text: "When alert was resolved"

4. **Add acknowledged_at field**
   - Type: DateTimeField
   - null=True, blank=True
   - Help text: "When alert was acknowledged by staff"

5. **Add time_to_acknowledge property**
   - Calculate duration from created to acknowledged
   - Return timedelta or None
   - Used for metrics

6. **Add time_to_resolve property**
   - Calculate duration from created to resolved
   - Return timedelta or None
   - Used for metrics

7. **Add is_resolved property**
   - Return True if resolved_at is set
   - Quick check for resolution status

8. **Add is_acknowledged property**
   - Return True if acknowledged_at is set
   - Quick check for acknowledgment

9. **Add resolve method**
   - Set status to RESOLVED
   - Set resolved_at to now
   - Save instance

10. **Add auto_resolve method**
    - Check if stock has improved
    - Call resolve() if conditions met
    - Return True if resolved

11. **Add days_active property**
    - Calculate days since creation
    - For alerts still active
    - Used in urgency calculations

### Lifecycle Timestamps

| Field | Type | Purpose | When Set |
|-------|------|---------|----------|
| created_at | DateTimeField | Alert creation | Auto (creation) |
| updated_at | DateTimeField | Last modification | Auto (every save) |
| acknowledged_at | DateTimeField | Staff acknowledgment | Manual action |
| resolved_at | DateTimeField | Resolution | Manual or auto |

### Timeline Example
```
2024-01-15 10:00:00 → Alert created (created_at)
2024-01-15 10:30:00 → Staff acknowledges (acknowledged_at)
                     time_to_acknowledge = 30 minutes
2024-01-16 09:00:00 → Stock replenished (resolved_at)
                     time_to_resolve = 23 hours
```

### Metrics Calculations
```python
@property
def time_to_acknowledge(self):
    """Time from creation to acknowledgment."""
    if not self.acknowledged_at:
        return None
    return self.acknowledged_at - self.created_at

@property
def time_to_resolve(self):
    """Time from creation to resolution."""
    if not self.resolved_at:
        return None
    return self.resolved_at - self.created_at

@property
def days_active(self):
    """Days since alert creation."""
    from django.utils import timezone
    if self.is_resolved:
        return (self.resolved_at - self.created_at).days
    return (timezone.now() - self.created_at).days
```

### Resolution Methods
```python
def resolve(self, auto=False):
    """Mark alert as resolved."""
    from django.utils import timezone
    self.status = ALERT_STATUS_RESOLVED
    self.resolved_at = timezone.now()
    self.save(update_fields=['status', 'resolved_at', 'updated_at'])

def auto_resolve(self):
    """Auto-resolve if stock has improved."""
    if self.has_stock_improved and self.status == ALERT_STATUS_ACTIVE:
        self.resolve(auto=True)
        return True
    return False
```

### Performance Metrics Dashboard
- Average time to acknowledge by alert type
- Average time to resolve by alert type
- Longest active alerts report
- Alert resolution rate

### Expected Outcome
- Complete lifecycle tracking
- Duration calculations for metrics
- Auto-resolution capability
- Analytics-ready timestamp data

### Verification Checklist
- [ ] All 4 timestamp fields added
- [ ] created_at auto-populated
- [ ] time_to_acknowledge property works
- [ ] time_to_resolve property works
- [ ] is_resolved and is_acknowledged properties
- [ ] resolve() method implemented
- [ ] auto_resolve() checks conditions
- [ ] days_active calculation correct

---

## Task 24: Add acknowledged_by FK

### Overview
Add foreign key to track which user acknowledged the alert, providing accountability and audit trail.

### Dependencies
- Task 23: Add created/resolved timestamps
- Phase-03: User model

### Instructions

1. **Import User model**
   - Import from appropriate auth location
   - Use get_user_model() or direct import

2. **Add acknowledged_by field**
   - Type: ForeignKey to User
   - on_delete: SET_NULL
   - null=True, blank=True
   - related_name: 'acknowledged_alerts'
   - Help text: "User who acknowledged this alert"

3. **Add resolved_by field**
   - Type: ForeignKey to User
   - on_delete: SET_NULL
   - null=True, blank=True
   - related_name: 'resolved_alerts'
   - Help text: "User who resolved this alert"

4. **Update acknowledge method**
   - Create new method
   - Set status to ACKNOWLEDGED
   - Set acknowledged_at timestamp
   - Set acknowledged_by to user
   - Save instance

5. **Update resolve method**
   - Accept user parameter (optional)
   - Set resolved_by if user provided
   - Existing resolve logic

6. **Add get_acknowledger_name method**
   - Return user's full name or "System"
   - Handle None case

7. **Add get_resolver_name method**
   - Return user's full name or "Auto-resolved"
   - Handle None case

8. **Add acknowledgment_info property**
   - Return dict with acknowledger and time
   - Used in admin and API

### User Tracking Fields

| Field | Type | Purpose |
|-------|------|---------|
| acknowledged_by | ForeignKey(User) | Who acknowledged |
| resolved_by | ForeignKey(User) | Who resolved |

### Acknowledgment Methods
```python
def acknowledge(self, user):
    """Acknowledge alert by user."""
    from django.utils import timezone
    self.status = ALERT_STATUS_ACKNOWLEDGED
    self.acknowledged_at = timezone.now()
    self.acknowledged_by = user
    self.save(update_fields=['status', 'acknowledged_at', 'acknowledged_by', 'updated_at'])

def resolve(self, user=None, auto=False):
    """Resolve alert, optionally by user."""
    from django.utils import timezone
    self.status = ALERT_STATUS_RESOLVED
    self.resolved_at = timezone.now()
    if user:
        self.resolved_by = user
    self.save(update_fields=['status', 'resolved_at', 'resolved_by', 'updated_at'])
```

### User Display Methods
```python
def get_acknowledger_name(self):
    """Get name of user who acknowledged."""
    if self.acknowledged_by:
        return self.acknowledged_by.get_full_name() or self.acknowledged_by.username
    return "Not Acknowledged"

def get_resolver_name(self):
    """Get name of user who resolved."""
    if self.resolved_by:
        return self.resolved_by.get_full_name() or self.resolved_by.username
    elif self.resolved_at:
        return "Auto-resolved"
    return "Unresolved"
```

### Audit Trail Example
```
Alert #1234:
  Created: 2024-01-15 10:00
  Acknowledged: 2024-01-15 10:30 by "Rajitha Perera"
  Resolved: 2024-01-16 09:00 by "System" (auto)

Alert #1235:
  Created: 2024-01-15 11:00
  Acknowledged: 2024-01-15 11:15 by "Saman Silva"
  Resolved: 2024-01-15 14:00 by "Saman Silva"
```

### Admin Display
- Show acknowledger in list view
- Show resolver in detail view
- Filter by acknowledged_by / resolved_by
- User performance metrics (alerts handled)

### Expected Outcome
- Full user accountability for alert handling
- Audit trail for compliance
- User performance tracking
- Clear display of who handled what

### Verification Checklist
- [ ] acknowledged_by FK added
- [ ] resolved_by FK added
- [ ] acknowledge(user) method implemented
- [ ] resolve(user) accepts user parameter
- [ ] get_acknowledger_name works
- [ ] get_resolver_name works
- [ ] SET_NULL on user deletion
- [ ] Related names set correctly

---

## Task 25: Add Snooze Functionality

### Overview
Implement alert snooze functionality to temporarily hide alerts until a specified datetime, with automatic re-activation.

### Dependencies
- Task 18: Define alert status constants
- Task 23: Add timestamps

### Instructions

1. **Add snoozed_until field**
   - Type: DateTimeField
   - null=True, blank=True
   - Help text: "Alert snoozed until this datetime"

2. **Add snoozed_by field**
   - Type: ForeignKey to User
   - on_delete: SET_NULL
   - null=True, blank=True
   - related_name: 'snoozed_alerts'
   - Help text: "User who snoozed alert"

3. **Add snooze_reason field**
   - Type: CharField
   - Max length: 200
   - blank=True
   - Help text: "Reason for snoozing"

4. **Add snooze_count field**
   - Type: PositiveIntegerField
   - Default: 0
   - Help text: "Number of times alert has been snoozed"

5. **Add snooze method**
   - Parameters: until_datetime, user, reason
   - Set status to SNOOZED
   - Set snoozed_until
   - Increment snooze_count
   - Save instance

6. **Add unsnooze method**
   - Set status back to ACTIVE
   - Clear snoozed_until
   - Save instance

7. **Add is_snoozed property**
   - Return True if status=SNOOZED and snoozed_until > now
   - False if snooze expired

8. **Add snooze_expired property**
   - Return True if snoozed and past snoozed_until time
   - Used by monitoring task

9. **Add get_snooze_info method**
   - Return dict with snooze details
   - Include: snoozed, until, by, reason, count

10. **Add snooze duration helpers**
    - snooze_for_hours(hours, user, reason)
    - snooze_for_days(days, user, reason)
    - snooze_until(datetime, user, reason)

### Snooze Fields

| Field | Type | Purpose |
|-------|------|---------|
| snoozed_until | DateTimeField | When snooze expires |
| snoozed_by | ForeignKey(User) | Who snoozed it |
| snooze_reason | CharField | Why snoozed |
| snooze_count | PositiveIntegerField | Times snoozed |

### Snooze Flow
```
Alert ACTIVE
      │
      ▼ User clicks "Snooze"
Alert SNOOZED (snoozed_until = now + duration)
      │
      │ [Monitoring task checks periodically]
      │
      ▼ When snoozed_until passed
Alert ACTIVE (auto-unsnoozed)
```

### Snooze Methods
```python
def snooze(self, until_datetime, user, reason=""):
    """Snooze alert until specified datetime."""
    from django.utils import timezone
    if until_datetime <= timezone.now():
        raise ValueError("Snooze time must be in future")
    
    self.status = ALERT_STATUS_SNOOZED
    self.snoozed_until = until_datetime
    self.snoozed_by = user
    self.snooze_reason = reason
    self.snooze_count += 1
    self.save()

def unsnooze(self):
    """Remove snooze, return to active."""
    self.status = ALERT_STATUS_ACTIVE
    self.snoozed_until = None
    self.save(update_fields=['status', 'snoozed_until', 'updated_at'])

def snooze_for_hours(self, hours, user, reason=""):
    """Snooze for specified hours."""
    from django.utils import timezone
    from datetime import timedelta
    until = timezone.now() + timedelta(hours=hours)
    self.snooze(until, user, reason)

def snooze_for_days(self, days, user, reason=""):
    """Snooze for specified days."""
    from django.utils import timezone
    from datetime import timedelta
    until = timezone.now() + timedelta(days=days)
    self.snooze(until, user, reason)
```

### Snooze Properties
```python
@property
def is_snoozed(self):
    """Check if alert currently snoozed."""
    from django.utils import timezone
    if self.status == ALERT_STATUS_SNOOZED and self.snoozed_until:
        return self.snoozed_until > timezone.now()
    return False

@property
def snooze_expired(self):
    """Check if snooze has expired."""
    from django.utils import timezone
    if self.status == ALERT_STATUS_SNOOZED and self.snoozed_until:
        return self.snoozed_until <= timezone.now()
    return False
```

### Snooze Use Cases
- **Waiting for PO delivery**: Snooze until expected arrival
- **Planned promotion**: Snooze low stock during sale (intentional)
- **Temporary situation**: Snooze while investigating issue
- **Off-hours**: Snooze overnight, deal with in morning

### Snooze Duration Presets
```python
# Common snooze durations
SNOOZE_PRESETS = [
    (1, "1 Hour"),
    (4, "4 Hours"),
    (8, "8 Hours"),
    (24, "1 Day"),
    (72, "3 Days"),
    (168, "1 Week"),
]
```

### Monitoring Task Integration
- Celery task checks for expired snoozes every 5 minutes
- Query: `status=SNOOZED AND snoozed_until <= now`
- Call unsnooze() for each expired alert
- Log auto-unsnooze events

### Expected Outcome
- Complete snooze functionality
- User tracking and reason
- Auto-expiration support
- Flexible duration helpers

### Verification Checklist
- [ ] All 4 snooze fields added
- [ ] snooze() method works correctly
- [ ] unsnooze() restores ACTIVE status
- [ ] is_snoozed property accurate
- [ ] snooze_expired detects expiration
- [ ] Helper methods (hours, days) work
- [ ] snooze_count increments
- [ ] Validation prevents past dates

---

## Task 26: Create StockAlert Meta Class

### Overview
Configure the StockAlert model's Meta class with proper indexing, ordering, and model options for optimal performance and usability.

### Dependencies
- Tasks 19-25: Complete StockAlert model

### Instructions

1. **Update Meta class in StockAlert**
   - Replace basic Meta with comprehensive configuration

2. **Set verbose names**
   - verbose_name: "Stock Alert"
   - verbose_name_plural: "Stock Alerts"

3. **Set database table name**
   - db_table: "inventory_stock_alert"

4. **Add default ordering**
   - Order by: ['-priority', '-created_at']
   - Highest priority and most recent first

5. **Create database indexes**
   - Index on product
   - Index on warehouse
   - Index on status
   - Index on alert_type
   - Index on created_at
   - Composite index: (product, warehouse, alert_type, status)

6. **Add composite unique constraint consideration**
   - Note: Don't add unique constraint
   - Allow multiple alerts per product (different types)
   - Deduplication handled in Task 28

7. **Add permissions**
   - Can view dashboard
   - Can acknowledge alerts
   - Can resolve alerts
   - Can snooze alerts

8. **Add indexes for date queries**
   - Index on resolved_at
   - Index on acknowledged_at
   - Index on snoozed_until

9. **Add get_latest_by**
   - Set to: 'created_at'
   - For queryset.latest() calls

### Meta Class Configuration
```python
class Meta:
    verbose_name = "Stock Alert"
    verbose_name_plural = "Stock Alerts"
    db_table = "inventory_stock_alert"
    ordering = ['-priority', '-created_at']
    get_latest_by = 'created_at'
    
    indexes = [
        models.Index(fields=['product']),
        models.Index(fields=['warehouse']),
        models.Index(fields=['status']),
        models.Index(fields=['alert_type']),
        models.Index(fields=['created_at']),
        models.Index(fields=['resolved_at']),
        models.Index(fields=['snoozed_until']),
        models.Index(fields=['product', 'warehouse', 'alert_type', 'status']),
        models.Index(fields=['-priority', '-created_at']),
    ]
    
    permissions = [
        ('view_alert_dashboard', 'Can view alert dashboard'),
        ('acknowledge_alerts', 'Can acknowledge alerts'),
        ('resolve_alerts', 'Can resolve alerts'),
        ('snooze_alerts', 'Can snooze alerts'),
    ]
```

### Index Strategy Rationale

| Index | Purpose | Query Pattern |
|-------|---------|---------------|
| product | Alert list per product | `WHERE product_id = ?` |
| warehouse | Warehouse-specific alerts | `WHERE warehouse_id = ?` |
| status | Filter by status | `WHERE status = 'active'` |
| alert_type | Filter by type | `WHERE alert_type = 'low_stock'` |
| created_at | Time-based queries | `WHERE created_at > ?` |
| Composite | Deduplication check | Complex WHERE clauses |

### Query Performance Impact
- Dashboard queries: Product + Status index
- Monitoring tasks: Status + Created index
- Deduplication: Composite index crucial
- Reports: Date indexes for time ranges

### Custom Permissions Usage
```python
# In views/API
if not request.user.has_perm('inventory.acknowledge_alerts'):
    return PermissionDenied

# In admin
def has_acknowledge_permission(self, request):
    return request.user.has_perm('inventory.acknowledge_alerts')
```

### Expected Outcome
- Optimized database indexes
- Proper ordering (priority, recency)
- Custom permissions for fine-grained access
- Query performance improvements

### Verification Checklist
- [ ] Meta class updated with all settings
- [ ] Verbose names set
- [ ] db_table specified
- [ ] Default ordering by priority, created_at
- [ ] All indexes created
- [ ] Custom permissions defined
- [ ] get_latest_by set
- [ ] No unnecessary unique constraints

---

## Task 27: Add StockAlert Manager

### Overview
Create custom manager for StockAlert with convenience methods for common queries.

### Dependencies
- Task 26: Create StockAlert Meta class

### Instructions

1. **Create custom manager class**
   - Name: StockAlertManager
   - Inherit from models.Manager

2. **Add get_active method**
   - Return queryset of ACTIVE alerts
   - Filter: status=ACTIVE

3. **Add get_acknowledged method**
   - Return queryset of ACKNOWLEDGED alerts
   - Filter: status=ACKNOWLEDGED

4. **Add get_resolved method**
   - Return queryset of RESOLVED alerts
   - Filter: status=RESOLVED

5. **Add get_unacknowledged method**
   - Return ACTIVE + not acknowledged
   - Filter: status=ACTIVE, acknowledged_at__isnull=True

6. **Add get_by_product method**
   - Parameters: product, include_resolved=False
   - Return all alerts for product
   - Optionally exclude resolved

7. **Add get_by_warehouse method**
   - Parameters: warehouse, include_resolved=False
   - Return alerts for warehouse
   - Handle None warehouse (all warehouses)

8. **Add get_by_type method**
   - Parameters: alert_type
   - Return alerts of specific type

9. **Add get_critical method**
   - Return critical priority alerts (OUT_OF_STOCK, CRITICAL_STOCK)
   - Filter: alert_type__in=[...]

10. **Add get_snoozed_expired method**
    - Return snoozed alerts past expiration time
    - Used by monitoring task

11. **Add get_by_date_range method**
    - Parameters: start_date, end_date
    - Return alerts created in range

12. **Add statistics methods**
    - count_by_status()
    - count_by_type()
    - average_resolution_time()

13. **Set manager on model**
    - objects = StockAlertManager()

### Manager Methods Implementation
```python
class StockAlertManager(models.Manager):
    """Custom manager for StockAlert with convenience methods."""
    
    def get_active(self):
        """Get all active alerts."""
        return self.filter(status=ALERT_STATUS_ACTIVE)
    
    def get_unacknowledged(self):
        """Get active, unacknowledged alerts."""
        return self.filter(
            status=ALERT_STATUS_ACTIVE,
            acknowledged_at__isnull=True
        )
    
    def get_by_product(self, product, include_resolved=False):
        """Get alerts for specific product."""
        qs = self.filter(product=product)
        if not include_resolved:
            qs = qs.exclude(status=ALERT_STATUS_RESOLVED)
        return qs
    
    def get_by_warehouse(self, warehouse, include_resolved=False):
        """Get alerts for specific warehouse."""
        qs = self.filter(warehouse=warehouse)
        if not include_resolved:
            qs = qs.exclude(status=ALERT_STATUS_RESOLVED)
        return qs
    
    def get_critical(self):
        """Get critical alerts (OOS and Critical Stock)."""
        return self.filter(
            alert_type__in=[
                ALERT_TYPE_OUT_OF_STOCK,
                ALERT_TYPE_CRITICAL_STOCK
            ],
            status=ALERT_STATUS_ACTIVE
        )
    
    def get_snoozed_expired(self):
        """Get snoozed alerts past expiration."""
        from django.utils import timezone
        return self.filter(
            status=ALERT_STATUS_SNOOZED,
            snoozed_until__lte=timezone.now()
        )
    
    def count_by_status(self):
        """Get alert counts by status."""
        from django.db.models import Count
        return self.values('status').annotate(count=Count('id'))
    
    def average_resolution_time(self):
        """Calculate average time to resolve alerts."""
        from django.db.models import Avg, F, ExpressionWrapper, DurationField
        return self.filter(
            resolved_at__isnull=False
        ).aggregate(
            avg_time=Avg(
                ExpressionWrapper(
                    F('resolved_at') - F('created_at'),
                    output_field=DurationField()
                )
            )
        )['avg_time']
```

### Usage Examples
```python
# Get active alerts
active_alerts = StockAlert.objects.get_active()

# Get unacknowledged alerts
need_attention = StockAlert.objects.get_unacknowledged()

# Get critical alerts
critical = StockAlert.objects.get_critical()

# Get alerts for product
product_alerts = StockAlert.objects.get_by_product(product)

# Check expired snoozes
expired = StockAlert.objects.get_snoozed_expired()

# Statistics
stats = StockAlert.objects.count_by_status()
avg_time = StockAlert.objects.average_resolution_time()
```

### Performance Optimization
- Use select_related for FKs in manager methods
- Add prefetch_related for reverse relationships
- Consider caching for statistics methods

### Expected Outcome
- Convenient query methods
- Consistent query patterns
- Statistics and reporting support
- Cleaner view/task code

### Verification Checklist
- [ ] StockAlertManager class created
- [ ] All query methods implemented
- [ ] get_active, get_unacknowledged work
- [ ] get_by_product, get_by_warehouse work
- [ ] get_critical returns right alerts
- [ ] get_snoozed_expired for monitoring
- [ ] Statistics methods functional
- [ ] Manager assigned to objects

---

## Task 28: Create Alert Deduplication

### Overview
Implement deduplication logic to prevent creating duplicate alerts for the same product/type/warehouse combination.

### Dependencies
- Task 27: Add StockAlert manager
- Task 19: Create StockAlert model

### Instructions

1. **Add get_existing_alert class method**
   - Parameters: product, alert_type, warehouse=None
   - Check for existing ACTIVE alert
   - Return alert or None

2. **Add create_or_update class method**
   - Parameters: product, alert_type, warehouse, current_stock, **kwargs
   - Check for existing alert
   - Update if exists, create if new
   - Return (alert, created) tuple

3. **Add should_create_new method**
   - Check if new alert needed
   - Consider existing alert status
   - Consider stock change significance

4. **Add update_if_exists method**
   - Update existing alert's stock level
   - Update threshold info
   - Update priority if escalated

5. **Add deduplication_key property**
   - Return unique key for deduplication
   - Format: "{product_id}:{alert_type}:{warehouse_id}"

6. **Add is_duplicate_of method**
   - Parameters: other_alert
   - Check if two alerts are duplicates
   - Return boolean

7. **Add merge_duplicate method**
   - Parameters: duplicate_alert
   - Merge data from duplicate into this alert
   - Mark duplicate as resolved

8. **Update stock monitoring task integration**
   - Use create_or_update instead of create
   - Prevents duplicate alert spam

9. **Add minimum_update_threshold setting**
   - Don't update alert if stock changed < threshold
   - Prevent excessive updates

10. **Add alert cooldown period**
    - Don't create same alert within X hours
    - Even if resolved
    - Prevent alert churn

### Deduplication Logic Flow
```
Check stock level breach:
         │
         ▼
  Check for existing ACTIVE alert
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
 Update    Create
 existing  new alert
 alert
```

### Implementation Methods
```python
@classmethod
def get_existing_alert(cls, product, alert_type, warehouse=None):
    """Get existing active alert for product/type/warehouse."""
    return cls.objects.filter(
        product=product,
        alert_type=alert_type,
        warehouse=warehouse,
        status=ALERT_STATUS_ACTIVE
    ).first()

@classmethod
def create_or_update(cls, product, alert_type, warehouse=None, 
                     current_stock=0, threshold_value=0, **kwargs):
    """Create new alert or update existing."""
    existing = cls.get_existing_alert(product, alert_type, warehouse)
    
    if existing:
        # Update existing alert
        stock_change = abs(existing.current_stock - current_stock)
        if stock_change >= 5:  # Minimum update threshold
            existing.current_stock = current_stock
            existing.threshold_value = threshold_value
            existing.update_stock_change()
            existing.save()
        return (existing, False)
    else:
        # Create new alert
        alert = cls.objects.create(
            product=product,
            alert_type=alert_type,
            warehouse=warehouse,
            current_stock=current_stock,
            threshold_value=threshold_value,
            **kwargs
        )
        return (alert, True)

@property
def deduplication_key(self):
    """Unique key for deduplication."""
    warehouse_id = self.warehouse.id if self.warehouse else 'all'
    return f"{self.product.id}:{self.alert_type}:{warehouse_id}"
```

### Deduplication Rules

| Scenario | Action | Rationale |
|----------|--------|-----------|
| Same product, type, warehouse, ACTIVE | Update existing | Avoid spam |
| Same product, type, different warehouse | Create both | Different locations |
| Same product, different type | Create both | Different severity |
| Recently resolved (< 24h) | Don't create | Cooldown period |
| Stock changed < 5 units | Don't update | Insignificant change |

### Update vs. Create Decision Tree
```
Existing ACTIVE alert?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
 Stock changed  Recently resolved?
 significantly?     │
    │          ┌────┴────┐
   Yes        Yes       No
    │          │         │
    ▼          ▼         ▼
 UPDATE    DON'T      CREATE
           CREATE
```

### Cooldown Period Implementation
```python
@classmethod
def check_cooldown(cls, product, alert_type, warehouse=None):
    """Check if alert is in cooldown period."""
    from django.utils import timezone
    from datetime import timedelta
    
    cooldown_hours = 24
    cutoff = timezone.now() - timedelta(hours=cooldown_hours)
    
    recent = cls.objects.filter(
        product=product,
        alert_type=alert_type,
        warehouse=warehouse,
        status=ALERT_STATUS_RESOLVED,
        resolved_at__gte=cutoff
    ).exists()
    
    return recent
```

### Stock Monitoring Integration
```python
# In monitoring task:
for product in products_to_check:
    if stock_level <= threshold:
        # Use deduplication
        alert, created = StockAlert.create_or_update(
            product=product,
            alert_type=determine_alert_type(stock_level, threshold),
            warehouse=warehouse,
            current_stock=stock_level,
            threshold_value=threshold
        )
        
        if created:
            # Send notifications for new alert
            send_alert_notifications(alert)
```

### Expected Outcome
- No duplicate alerts for same condition
- Existing alerts updated instead
- Cooldown prevents alert churn
- Cleaner alert dashboard

### Verification Checklist
- [ ] get_existing_alert finds duplicates
- [ ] create_or_update works correctly
- [ ] Returns (alert, created) tuple
- [ ] Updates existing alerts
- [ ] Minimum update threshold enforced
- [ ] Cooldown period prevents churn
- [ ] deduplication_key unique
- [ ] Stock monitoring integrated
