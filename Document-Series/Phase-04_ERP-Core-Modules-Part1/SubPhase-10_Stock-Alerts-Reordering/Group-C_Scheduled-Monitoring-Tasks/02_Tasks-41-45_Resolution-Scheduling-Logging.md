# Tasks 41-45: Alert Resolution, Scheduling & Logging

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** C - Scheduled Monitoring Tasks  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-40_Monitoring-Task-Checks.md](01_Tasks-35-40_Monitoring-Task-Checks.md)
- **→ Next Document:** [03_Tasks-46-50_Exclusions-Throttling-Webhooks.md](03_Tasks-46-50_Exclusions-Throttling-Webhooks.md)

---

## Document Overview

This document covers alert resolution logic, back-in-stock detection, Celery Beat scheduling configuration, configurable monitoring frequency, and comprehensive monitoring logging.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 41 | Create alert resolution logic | Medium |
| 42 | Implement back in stock detection | Medium |
| 43 | Schedule monitoring task | Medium |
| 44 | Add configurable frequency | Medium |
| 45 | Create monitoring log | Medium |

---

## Task 41: Create Alert Resolution Logic

### Overview
Implement automated resolution of alerts when stock levels improve above thresholds.

### Dependencies
- Group B: StockAlert model
- Task 40: Alert generation logic

### Instructions

1. **Add auto_resolve_alerts method**
   - Check active alerts for product
   - Compare current stock to thresholds
   - Resolve if stock improved

2. **Add check_resolution_criteria method**
   - Define when alert should resolve
   - LOW_STOCK: stock > low_threshold
   - CRITICAL: stock > critical_threshold
   - OOS: available_quantity > 0

3. **Add resolve_improved_alerts method**
   - Query active alerts
   - Check each for improvement
   - Call resolve() on eligible alerts

4. **Add resolution_notification method**
   - Optional notification when resolved
   - Dashboard update
   - Email if configured

5. **Add show_back_on_webstore method**
   - If was hidden due to OOS
   - Show again when restocked
   - Update visibility flags

6. **Add resolution_statistics method**
   - Track auto-resolution rate
   - Average time to resolution
   - Used for metrics

### Alert Resolution Implementation
```python
def auto_resolve_alerts(product, stock_level):
    """
    Auto-resolve alerts when stock improves.
    """
    from apps.inventory.alerts.models import StockAlert
    
    active_alerts = StockAlert.objects.get_active().filter(
        product=product,
        warehouse=stock_level.warehouse
    )
    
    resolved_count = 0
    
    for alert in active_alerts:
        if should_resolve_alert(alert, stock_level):
            alert.resolve(auto=True)
            resolved_count += 1
            
            logger.info(
                f"Auto-resolved {alert.get_alert_type_display()} "
                f"alert for {product.name}"
            )
            
            # Show on webstore if was hidden
            if alert.alert_type == ALERT_TYPE_OUT_OF_STOCK:
                show_back_on_webstore(product, stock_level.warehouse)
    
    return resolved_count

def should_resolve_alert(alert, stock_level):
    """Determine if alert should be resolved."""
    current_stock = stock_level.available_quantity
    
    resolution_criteria = {
        ALERT_TYPE_OUT_OF_STOCK: current_stock > 0,
        ALERT_TYPE_CRITICAL_STOCK: current_stock > alert.threshold_value,
        ALERT_TYPE_LOW_STOCK: current_stock > alert.threshold_value,
    }
    
    return resolution_criteria.get(alert.alert_type, False)

def show_back_on_webstore(product, warehouse=None):
    """Show product on webstore after restocking."""
    config = product.get_stock_config()
    
    if config and config.auto_show_when_restocked:
        if warehouse:
            # Show for specific warehouse
            logger.info(f"Showing {product.name} on webstore (warehouse: {warehouse})")
        else:
            # Show globally
            product.is_visible_webstore = True
            product.save(update_fields=['is_visible_webstore'])
            logger.info(f"Showing {product.name} on webstore (global)")
```

### Resolution Criteria Table

| Alert Type | Resolution Condition | Action |
|------------|---------------------|--------|
| OUT_OF_STOCK | available_quantity > 0 | Resolve + Show on webstore |
| CRITICAL_STOCK | stock > critical_threshold | Resolve alert |
| LOW_STOCK | stock > low_stock_threshold | Resolve alert |

### Expected Outcome
- Automatic alert resolution
- Webstore visibility restored
- Clean alert dashboard

### Verification Checklist
- [ ] auto_resolve_alerts implemented
- [ ] Resolution criteria correct
- [ ] should_resolve_alert checks work
- [ ] Webstore visibility restored
- [ ] Resolution logged
- [ ] Statistics tracked

---

## Task 42: Implement Back in Stock Detection

### Overview
Detect when out-of-stock products are restocked and send positive notifications.

### Dependencies
- Task 41: Alert resolution logic
- Group B: Alert notification service

### Instructions

1. **Add detect_back_in_stock method**
   - Check if product was OOS
   - Check if now has stock
   - Create BACK_IN_STOCK alert

2. **Add was_out_of_stock method**
   - Check recent OOS alerts
   - Look in last 7 days
   - Return boolean

3. **Add create_back_in_stock_alert method**
   - Create informational alert
   - Low priority (1)
   - Positive messaging

4. **Add back_in_stock_notification method**
   - Email interested parties
   - Dashboard notification
   - Optional customer notification

5. **Add notify_waiting_customers method**
   - If backorders exist
   - Email customers
   - Update backorder status

### Back in Stock Implementation
```python
def detect_back_in_stock(product, stock_level):
    """Detect and notify when OOS product restocked."""
    from apps.inventory.alerts.models import StockAlert
    from datetime import timedelta
    
    # Check if product was recently OOS
    recent_cutoff = timezone.now() - timedelta(days=7)
    
    was_oos = StockAlert.objects.filter(
        product=product,
        warehouse=stock_level.warehouse,
        alert_type=ALERT_TYPE_OUT_OF_STOCK,
        created_at__gte=recent_cutoff
    ).exists()
    
    is_now_in_stock = stock_level.available_quantity > 0
    
    if was_oos and is_now_in_stock:
        create_back_in_stock_alert(product, stock_level)
        return True
    
    return False

def create_back_in_stock_alert(product, stock_level):
    """Create back in stock notification."""
    from apps.inventory.alerts.models import StockAlert
    from apps.inventory.alerts.services.notification import AlertNotificationService
    
    alert = StockAlert.objects.create(
        product=product,
        warehouse=stock_level.warehouse,
        alert_type=ALERT_TYPE_BACK_IN_STOCK,
        status=ALERT_STATUS_ACTIVE,
        current_stock=stock_level.available_quantity,
        priority=1,  # Info level
        message=f"{product.name} is back in stock ({stock_level.available_quantity} units)"
    )
    
    # Send positive notifications
    AlertNotificationService.send_alert_notification(alert)
    
    # Notify waiting customers if backorders
    notify_waiting_customers(product, stock_level.warehouse)
    
    logger.info(f"Created BACK_IN_STOCK alert for {product.name}")
    
    return alert

def notify_waiting_customers(product, warehouse=None):
    """Notify customers with backorders."""
    # Query backorders for this product
    # Send "Your item is ready" emails
    # Update backorder status
    pass
```

### Back in Stock Flow
```
Stock Replenishment
         │
         ▼
Was Product OOS Recently?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Create      No Action
BACK_IN_STOCK
Alert
    │
    ▼
Send Positive Notifications
    │
    ├─→ Email Staff
    ├─→ Dashboard Notice
    └─→ Notify Customers (if backorders)
```

### Expected Outcome
- Positive back-in-stock notifications
- Customer backorder notifications
- Good news messaging

### Verification Checklist
- [ ] detect_back_in_stock works
- [ ] was_out_of_stock checks recent history
- [ ] create_back_in_stock_alert functional
- [ ] Notifications sent
- [ ] Customer notifications if backorders
- [ ] Positive messaging

---

## Task 43: Schedule Monitoring Task

### Overview
Configure Celery Beat to run stock monitoring task on a regular schedule.

### Dependencies
- Task 35: Stock monitoring task
- Phase-03: Celery and Celery Beat setup

### Instructions

1. **Add Celery Beat schedule configuration**
   - Update settings with beat schedule
   - Configure task routing
   - Set task priority

2. **Add default monitoring schedule**
   - Run every hour by default
   - Configurable per-tenant
   - Stagger tenant runs

3. **Add schedule configuration in settings**
   - CELERY_BEAT_SCHEDULE dict
   - Task name and schedule
   - Task arguments

4. **Add task routing**
   - Assign to appropriate queue
   - Set concurrency limits
   - Priority queue for alerts

5. **Add schedule validation**
   - Ensure task not running concurrently
   - Lock mechanism
   - Skip if already running

6. **Add manual trigger option**
   - Admin action to run now
   - API endpoint to trigger
   - Override schedule

### Celery Beat Configuration
```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'stock-monitoring-hourly': {
        'task': 'apps.inventory.alerts.tasks.stock_monitor.run_stock_monitoring',
        'schedule': crontab(minute=0),  # Every hour
        'options': {
            'queue': 'monitoring',
            'priority': 5,
        }
    },
    'check-expired-snoozes': {
        'task': 'apps.inventory.alerts.tasks.check_expired_snoozes',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
        'options': {
            'queue': 'alerts',
            'priority': 8,
        }
    },
}

# Task routing
CELERY_TASK_ROUTES = {
    'apps.inventory.alerts.tasks.*': {
        'queue': 'alerts',
    },
}
```

### Schedule Options
```python
# Different schedule configurations
SCHEDULES = {
    'every_hour': crontab(minute=0),
    'every_2_hours': crontab(minute=0, hour='*/2'),
    'every_4_hours': crontab(minute=0, hour='*/4'),
    'twice_daily': crontab(minute=0, hour='6,18'),
    'daily': crontab(minute=0, hour=1),
}
```

### Expected Outcome
```
celerybeat-schedule file created
Tasks running on schedule
Monitoring executing hourly
```

### Verification Checklist
- [ ] CELERY_BEAT_SCHEDULE configured
- [ ] Default hourly schedule set
- [ ] Task routing configured
- [ ] Concurrency limits set
- [ ] Manual trigger available
- [ ] Schedule validated

---

## Task 44: Add Configurable Frequency

### Overview
Allow tenant-specific configuration of monitoring frequency.

### Dependencies
- Task 43: Schedule monitoring task
- Group A: GlobalStockSettings model

### Instructions

1. **Add monitoring_frequency field to GlobalStockSettings**
   - Type: CharField with choices
   - Options: HOURLY, EVERY_2_HOURS, EVERY_4_HOURS, TWICE_DAILY, DAILY
   - Default: HOURLY

2. **Add get_monitoring_schedule method**
   - Return crontab for tenant's frequency
   - Used by Celery Beat

3. **Add dynamic schedule registration**
   - Create beat schedule per tenant
   - Use tenant ID in task name
   - Register with scheduler

4. **Add schedule update on settings change**
   - Signal when GlobalStockSettings saved
   - Update Celery Beat schedule
   - Reload scheduler

5. **Add monitoring window fields**
   - monitoring_start_hour: Start time (e.g., 6 AM)
   - monitoring_end_hour: End time (e.g., 10 PM)
   - Only monitor during business hours

### Configurable Frequency Implementation
```python
# In GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    FREQUENCY_CHOICES = [
        ('hourly', 'Every Hour'),
        ('every_2_hours', 'Every 2 Hours'),
        ('every_4_hours', 'Every 4 Hours'),
        ('twice_daily', '8 AM and 6 PM'),
        ('daily', 'Daily at 1 AM'),
    ]
    
    monitoring_frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default='hourly',
        help_text="How often to check stock levels"
    )
    
    monitoring_start_hour = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        help_text="Start monitoring at hour (0-23)"
    )
    
    monitoring_end_hour = models.PositiveIntegerField(
        default=23,
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        help_text="Stop monitoring at hour (0-23)"
    )
    
    def get_monitoring_schedule(self):
        """Get crontab schedule for monitoring frequency."""
        schedules = {
            'hourly': crontab(minute=0),
            'every_2_hours': crontab(minute=0, hour='*/2'),
            'every_4_hours': crontab(minute=0, hour='*/4'),
            'twice_daily': crontab(minute=0, hour='8,18'),
            'daily': crontab(minute=0, hour=1),
        }
        return schedules.get(self.monitoring_frequency, crontab(minute=0))
```

### Dynamic Schedule Registration
```python
def register_tenant_monitoring_schedule(tenant):
    """Register monitoring schedule for specific tenant."""
    from django_celery_beat.models import PeriodicTask, CrontabSchedule
    
    settings = tenant.global_stock_settings
    schedule = settings.get_monitoring_schedule()
    
    # Create or update crontab
    crontab_schedule, _ = CrontabSchedule.objects.get_or_create(
        minute=schedule.minute,
        hour=schedule.hour,
        day_of_week=schedule.day_of_week,
        day_of_month=schedule.day_of_month,
        month_of_year=schedule.month_of_year,
    )
    
    # Create or update periodic task
    task_name = f"stock-monitoring-{tenant.schema_name}"
    task, created = PeriodicTask.objects.get_or_create(
        name=task_name,
        defaults={
            'task': 'apps.inventory.alerts.tasks.run_stock_monitoring',
            'crontab': crontab_schedule,
            'kwargs': json.dumps({'tenant_id': tenant.id}),
        }
    )
    
    if not created:
        task.crontab = crontab_schedule
        task.save()
    
    return task
```

### Expected Outcome
- Tenant-specific monitoring schedules
- Flexible frequency options
- Business hours support

### Verification Checklist
- [ ] monitoring_frequency field added
- [ ] Frequency choices defined
- [ ] get_monitoring_schedule method works
- [ ] Dynamic registration implemented
- [ ] Schedule updates on change
- [ ] Business hours supported

---

## Task 45: Create Monitoring Log

### Overview
Implement logging system to track monitoring runs, statistics, and troubleshooting information.

### Dependencies
- Task 35: Stock monitoring task

### Instructions

1. **Create MonitoringLog model**
   - Track each monitoring run
   - Store statistics and results
   - Link to tenant

2. **Add log fields**
   - run_started_at, run_completed_at
   - products_checked, alerts_created
   - execution_time, status
   - error_message, traceback

3. **Add create_log_entry method**
   - Call at start of monitoring
   - Update at completion
   - Store results

4. **Add log retention policy**
   - Keep logs for 30 days
   - Auto-delete old logs
   - Cleanup task

5. **Add monitoring dashboard**
   - Show recent runs
   - Success rate
   - Performance trends
   - Error summary

### MonitoringLog Model
```python
class MonitoringLog(TenantAwareModel):
    """Log of stock monitoring task executions."""
    
    STATUS_CHOICES = [
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    run_started_at = models.DateTimeField(auto_now_add=True)
    run_completed_at = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='running'
    )
    
    products_checked = models.PositiveIntegerField(default=0)
    alerts_created = models.PositiveIntegerField(default=0)
    alerts_updated = models.PositiveIntegerField(default=0)
    alerts_resolved = models.PositiveIntegerField(default=0)
    errors_encountered = models.PositiveIntegerField(default=0)
    
    execution_time = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        help_text="Execution time in seconds"
    )
    
    error_message = models.TextField(blank=True)
    traceback = models.TextField(blank=True)
    
    statistics = models.JSONField(
        default=dict,
        help_text="Detailed statistics"
    )
    
    class Meta:
        verbose_name = "Monitoring Log"
        ordering = ['-run_started_at']
        indexes = [
            models.Index(fields=['-run_started_at']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"Monitoring Run - {self.run_started_at}"
    
    def mark_completed(self, stats):
        """Mark monitoring run as completed."""
        self.run_completed_at = timezone.now()
        self.status = 'completed'
        self.products_checked = stats.get('products_checked', 0)
        self.alerts_created = stats.get('alerts_created', 0)
        self.alerts_updated = stats.get('alerts_updated', 0)
        self.alerts_resolved = stats.get('alerts_resolved', 0)
        self.errors_encountered = stats.get('errors', 0)
        self.execution_time = stats.get('execution_time', 0)
        self.statistics = stats
        self.save()
```

### Logging Integration
```python
# In monitoring task
@shared_task
def run_stock_monitoring(tenant_id=None):
    from apps.inventory.alerts.models import MonitoringLog
    
    # Create log entry
    log = MonitoringLog.objects.create(
        status='running'
    )
    
    try:
        # Run monitoring
        stats = monitor_tenant_stock(tenant)
        
        # Mark as completed
        log.mark_completed(stats)
        
        return stats
    except Exception as e:
        log.status = 'failed'
        log.error_message = str(e)
        log.traceback = traceback.format_exc()
        log.save()
        raise
```

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
├── global_settings.py
├── category_config.py
├── product_config.py
├── stock_alert.py
└── monitoring_log.py          # New model
```

### Verification Checklist
- [ ] MonitoringLog model created
- [ ] All log fields added
- [ ] create_log_entry works
- [ ] Logging integrated in task
- [ ] Retention policy configured
- [ ] Dashboard displays logs
- [ ] Statistics tracked
- [ ] Error handling logs failures
