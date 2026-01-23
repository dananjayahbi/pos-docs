# Tasks 46-50: Exclusions, Throttling & Webhooks

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** C - Scheduled Monitoring Tasks  
> **Document:** 03 of 03  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-45_Resolution-Scheduling-Logging.md](02_Tasks-41-45_Resolution-Scheduling-Logging.md)
- **→ Next Group:** [../Group-D_Reorder-Suggestions-Automation/00_GROUP_OVERVIEW.md](../Group-D_Reorder-Suggestions-Automation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers monitoring exclusions, warehouse-specific checks, alert throttling mechanisms, dashboard data aggregation, and webhook notifications for third-party integrations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 46 | Add monitoring exclusions | Medium |
| 47 | Add warehouse specific checks | Medium |
| 48 | Implement alert throttling | High |
| 49 | Create dashboard data aggregation | Medium |
| 50 | Add webhook notifications | Medium |

---

## Task 46: Add Monitoring Exclusions

### Overview
Allow products to be excluded from stock monitoring based on various criteria.

### Dependencies
- Task 35: Stock monitoring task
- Group A: ProductStockConfig model

### Instructions

1. **Add exclusion fields to ProductStockConfig**
   - exclude_from_monitoring: Boolean
   - exclusion_reason: TextField
   - exclusion_start_date, exclusion_end_date

2. **Add is_excluded_from_monitoring method**
   - Check exclusion flag
   - Check date range
   - Return boolean

3. **Add filter_excluded_products function**
   - Query products not excluded
   - Consider date ranges
   - Return active products only

4. **Add exclusion categories**
   - Discontinued products
   - Seasonal items (off-season)
   - Custom orders only
   - Consignment items

5. **Add temporary exclusion support**
   - Start and end dates
   - Auto-resume monitoring
   - Log exclusion periods

6. **Add bulk exclusion admin action**
   - Select multiple products
   - Exclude with reason
   - Set time period

### Exclusion Implementation
```python
# In ProductStockConfig model
class ProductStockConfig(TenantAwareModel):
    # ... existing fields
    
    exclude_from_monitoring = models.BooleanField(
        default=False,
        help_text="Exclude this product from stock monitoring"
    )
    
    EXCLUSION_REASON_CHOICES = [
        ('discontinued', 'Product Discontinued'),
        ('seasonal', 'Seasonal Product (Off-Season)'),
        ('custom_order', 'Custom Order Only'),
        ('consignment', 'Consignment Item'),
        ('low_value', 'Low Value Item'),
        ('manual', 'Manual Stock Management'),
        ('other', 'Other Reason'),
    ]
    
    exclusion_reason = models.CharField(
        max_length=50,
        choices=EXCLUSION_REASON_CHOICES,
        blank=True,
        help_text="Reason for monitoring exclusion"
    )
    
    exclusion_start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Start date for temporary exclusion"
    )
    
    exclusion_end_date = models.DateField(
        null=True,
        blank=True,
        help_text="End date for temporary exclusion"
    )
    
    def is_excluded_from_monitoring(self):
        """Check if product is currently excluded."""
        if not self.exclude_from_monitoring:
            return False
        
        # Check date range if specified
        if self.exclusion_start_date or self.exclusion_end_date:
            today = timezone.now().date()
            
            if self.exclusion_start_date and today < self.exclusion_start_date:
                return False
            
            if self.exclusion_end_date and today > self.exclusion_end_date:
                return False
        
        return True
```

### Filtering Excluded Products
```python
def filter_monitorable_products():
    """Get products eligible for monitoring."""
    from apps.inventory.models import Product
    from apps.inventory.alerts.models import ProductStockConfig
    
    # Get all products with stock
    products = Product.objects.filter(
        track_inventory=True,
        is_active=True
    )
    
    # Exclude discontinued
    products = products.exclude(status='discontinued')
    
    # Check exclusion settings
    excluded_configs = ProductStockConfig.objects.filter(
        exclude_from_monitoring=True
    ).values_list('product_id', flat=True)
    
    # Filter out excluded
    products = products.exclude(id__in=excluded_configs)
    
    # Additional filtering for temporary exclusions
    today = timezone.now().date()
    temp_excluded = ProductStockConfig.objects.filter(
        exclude_from_monitoring=True,
        exclusion_start_date__lte=today,
        exclusion_end_date__gte=today
    ).values_list('product_id', flat=True)
    
    products = products.exclude(id__in=temp_excluded)
    
    return products
```

### Exclusion Categories Table

| Category | Use Case | Monitoring | Example |
|----------|----------|------------|---------|
| Discontinued | No longer selling | Exclude permanently | Old product model |
| Seasonal | Off-season items | Temporary exclusion | Christmas decorations in July |
| Custom Order | Made-to-order only | Exclude | Custom furniture |
| Consignment | Not our inventory | Exclude | Consignment art pieces |
| Low Value | Not worth monitoring | Exclude | Small accessories under LKR 100 |

### Expected Outcome
- Products can be excluded from monitoring
- Temporary and permanent exclusions
- Reduces unnecessary alerts

### Verification Checklist
- [ ] Exclusion fields added
- [ ] is_excluded_from_monitoring works
- [ ] Date range validation correct
- [ ] filter_monitorable_products implemented
- [ ] Exclusion categories defined
- [ ] Bulk admin action available

---

## Task 47: Add Warehouse Specific Checks

### Overview
Implement warehouse-level monitoring to detect stock issues at specific locations.

### Dependencies
- Task 35: Stock monitoring task
- Group A: WarehouseStockConfig model

### Instructions

1. **Add per_warehouse_monitoring method**
   - Check each warehouse separately
   - Create warehouse-specific alerts
   - Aggregate totals if needed

2. **Add warehouse_stock_check method**
   - Get stock level for warehouse
   - Apply warehouse thresholds
   - Generate warehouse alerts

3. **Add aggregate_warehouse_alerts method**
   - If product OOS in all warehouses
   - Create company-wide alert
   - Higher priority

4. **Add warehouse_priority_order**
   - Check main warehouse first
   - Then regional warehouses
   - Finally remote locations

5. **Add transfer_suggestion**
   - If low in Warehouse A
   - But sufficient in Warehouse B
   - Suggest transfer alert

### Warehouse-Specific Monitoring
```python
def monitor_warehouse_stock(product):
    """Monitor stock levels per warehouse."""
    from apps.inventory.models import StockLevel
    from apps.inventory.alerts.models import StockAlert
    
    warehouses = product.get_active_warehouses()
    alerts_created = []
    out_of_stock_count = 0
    
    for warehouse in warehouses:
        # Get warehouse-specific stock
        stock_level = StockLevel.objects.get_or_create(
            product=product,
            warehouse=warehouse
        )[0]
        
        # Get warehouse-specific config
        config = product.get_stock_config(warehouse=warehouse)
        
        if not config:
            continue
        
        # Check thresholds
        current_stock = stock_level.available_quantity
        
        if current_stock <= 0:
            out_of_stock_count += 1
            alert = create_alert(
                product=product,
                warehouse=warehouse,
                alert_type=ALERT_TYPE_OUT_OF_STOCK,
                current_stock=current_stock,
                message=f"Out of stock at {warehouse.name}"
            )
            alerts_created.append(alert)
        
        elif current_stock <= config.critical_stock_threshold:
            alert = create_alert(
                product=product,
                warehouse=warehouse,
                alert_type=ALERT_TYPE_CRITICAL_STOCK,
                current_stock=current_stock,
                threshold=config.critical_stock_threshold,
                message=f"Critical stock at {warehouse.name}"
            )
            alerts_created.append(alert)
        
        elif current_stock <= config.low_stock_threshold:
            alert = create_alert(
                product=product,
                warehouse=warehouse,
                alert_type=ALERT_TYPE_LOW_STOCK,
                current_stock=current_stock,
                threshold=config.low_stock_threshold,
                message=f"Low stock at {warehouse.name}"
            )
            alerts_created.append(alert)
        
        # Check for transfer opportunities
        if current_stock < config.low_stock_threshold:
            check_transfer_opportunity(product, warehouse, config)
    
    # If OOS everywhere, create company-wide alert
    if out_of_stock_count == len(warehouses):
        create_company_wide_oos_alert(product)
    
    return alerts_created

def check_transfer_opportunity(product, low_warehouse, config):
    """Check if stock can be transferred from another warehouse."""
    from apps.inventory.models import StockLevel
    
    needed = config.low_stock_threshold - low_warehouse.stock_level.available_quantity
    
    # Check other warehouses
    other_stock = StockLevel.objects.filter(
        product=product
    ).exclude(
        warehouse=low_warehouse
    ).filter(
        available_quantity__gt=config.low_stock_threshold
    )
    
    for stock in other_stock:
        if stock.available_quantity > needed + stock.warehouse_config.low_stock_threshold:
            # Sufficient stock to transfer
            create_transfer_suggestion(
                product=product,
                from_warehouse=stock.warehouse,
                to_warehouse=low_warehouse,
                quantity=needed
            )
            break
```

### Warehouse Monitoring Flow
```
Per-Warehouse Check
         │
         ▼
┌─────────────────────┐
│ For Each Warehouse  │
└─────────┬───────────┘
          │
          ▼
Check Warehouse Stock Level
          │
          ├─→ Out of Stock → Create Warehouse Alert
          ├─→ Critical → Create Warehouse Alert
          └─→ Low → Check Transfer Opportunity
                         │
                         ├─→ Stock Available Elsewhere → Suggest Transfer
                         └─→ No Stock → Create Alert
          │
          ▼
Aggregate Across Warehouses
          │
          ├─→ OOS in ALL warehouses → Company-Wide OOS Alert
          └─→ OK in some → Regular Alerts
```

### Expected Outcome
- Warehouse-specific alerts
- Transfer suggestions
- Company-wide alerts when appropriate

### Verification Checklist
- [ ] per_warehouse_monitoring implemented
- [ ] Warehouse-specific thresholds used
- [ ] warehouse_stock_check works
- [ ] Company-wide alerts for total OOS
- [ ] Transfer suggestions created
- [ ] Warehouse priority order respected

---

## Task 48: Implement Alert Throttling

### Overview
Prevent alert fatigue by throttling duplicate alerts within timeframes.

### Dependencies
- Task 37: Alert deduplication
- Group B: StockAlert model

### Instructions

1. **Add throttle configuration fields**
   - throttle_period: Time window (e.g., 24 hours)
   - max_alerts_per_period: Count limit
   - throttle_by: product, category, alert_type

2. **Add is_alert_throttled method**
   - Check recent alerts
   - Count within period
   - Return boolean

3. **Add get_throttle_window method**
   - Calculate time range
   - Based on throttle_period
   - Return start/end datetime

4. **Add alert_count_in_window method**
   - Count alerts in window
   - Filter by throttle_by criteria
   - Return count

5. **Add throttle_rules configuration**
   - Different rules per alert type
   - LOW_STOCK: 1 per 24 hours
   - CRITICAL: 1 per 12 hours
   - OOS: 1 per 6 hours (more urgent)

6. **Add throttle bypass for critical**
   - Stock drops > 50% since last alert
   - Override throttle
   - Create urgent alert

### Throttling Implementation
```python
# In GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    # Throttle configuration
    throttle_low_stock_hours = models.PositiveIntegerField(
        default=24,
        help_text="Hours between LOW_STOCK alerts for same product"
    )
    
    throttle_critical_stock_hours = models.PositiveIntegerField(
        default=12,
        help_text="Hours between CRITICAL_STOCK alerts"
    )
    
    throttle_oos_hours = models.PositiveIntegerField(
        default=6,
        help_text="Hours between OUT_OF_STOCK alerts"
    )
    
    throttle_bypass_threshold = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=50.0,
        help_text="% stock drop to bypass throttle"
    )
    
    def get_throttle_period(self, alert_type):
        """Get throttle period for alert type."""
        throttle_map = {
            ALERT_TYPE_LOW_STOCK: self.throttle_low_stock_hours,
            ALERT_TYPE_CRITICAL_STOCK: self.throttle_critical_stock_hours,
            ALERT_TYPE_OUT_OF_STOCK: self.throttle_oos_hours,
        }
        return throttle_map.get(alert_type, 24)

def is_alert_throttled(product, warehouse, alert_type):
    """Check if alert creation is throttled."""
    from apps.inventory.alerts.models import StockAlert
    from datetime import timedelta
    
    settings = GlobalStockSettings.get_settings()
    throttle_hours = settings.get_throttle_period(alert_type)
    
    window_start = timezone.now() - timedelta(hours=throttle_hours)
    
    # Check for recent alerts
    recent_count = StockAlert.objects.filter(
        product=product,
        warehouse=warehouse,
        alert_type=alert_type,
        created_at__gte=window_start
    ).count()
    
    if recent_count > 0:
        logger.info(
            f"Alert throttled: {product.name} ({alert_type}) - "
            f"{recent_count} alerts in last {throttle_hours} hours"
        )
        return True
    
    return False

def should_bypass_throttle(product, warehouse, alert_type, current_stock):
    """Check if throttle should be bypassed."""
    from apps.inventory.alerts.models import StockAlert
    from datetime import timedelta
    
    settings = GlobalStockSettings.get_settings()
    
    # Get last alert
    last_alert = StockAlert.objects.filter(
        product=product,
        warehouse=warehouse,
        alert_type=alert_type
    ).order_by('-created_at').first()
    
    if not last_alert:
        return False
    
    # Calculate stock drop percentage
    if last_alert.current_stock > 0:
        drop_percent = ((last_alert.current_stock - current_stock) / last_alert.current_stock) * 100
        
        if drop_percent >= settings.throttle_bypass_threshold:
            logger.warning(
                f"Throttle bypassed: {product.name} - "
                f"Stock dropped {drop_percent:.1f}% since last alert"
            )
            return True
    
    return False
```

### Throttle Configuration Table

| Alert Type | Default Period | Max Per Period | Bypass Condition |
|------------|----------------|----------------|------------------|
| LOW_STOCK | 24 hours | 1 | Stock drops > 50% |
| CRITICAL_STOCK | 12 hours | 1 | Stock drops > 50% |
| OUT_OF_STOCK | 6 hours | 1 | N/A (always create) |
| BACK_IN_STOCK | 24 hours | 1 | N/A |

### Expected Outcome
- Reduced alert spam
- Important changes still alerted
- Configurable throttle periods

### Verification Checklist
- [ ] Throttle configuration fields added
- [ ] is_alert_throttled method works
- [ ] get_throttle_window calculates correctly
- [ ] alert_count_in_window accurate
- [ ] Throttle rules per type configured
- [ ] Bypass for critical drops works

---

## Task 49: Create Dashboard Data Aggregation

### Overview
Aggregate alert data for dashboard display and reporting.

### Dependencies
- Group B: StockAlert model
- Task 45: MonitoringLog model

### Instructions

1. **Add get_dashboard_summary method**
   - Count active alerts by type
   - Count by priority
   - Recent monitoring stats

2. **Add get_top_alerts method**
   - Highest priority first
   - Most urgent products
   - Grouped by category

3. **Add get_alert_trends method**
   - Daily alert counts
   - Trend over 7/30 days
   - Alert resolution rate

4. **Add get_warehouse_summary method**
   - Alerts per warehouse
   - Stock health score
   - Problem locations

5. **Add get_monitoring_statistics method**
   - Success rate
   - Average execution time
   - Last run timestamp
   - Errors encountered

6. **Add cache dashboard data**
   - Cache for 5 minutes
   - Reduce DB load
   - Invalidate on alert creation

### Dashboard Aggregation Implementation
```python
# In StockAlert model manager
class StockAlertManager(TenantAwareManager):
    def get_dashboard_summary(self):
        """Get summary data for dashboard."""
        from django.db.models import Count, Q
        
        active_alerts = self.get_active()
        
        summary = {
            'total_active': active_alerts.count(),
            'by_type': active_alerts.values('alert_type').annotate(count=Count('id')),
            'by_priority': active_alerts.values('priority').annotate(count=Count('id')),
            'critical_count': active_alerts.filter(priority__gte=8).count(),
            'needs_attention': active_alerts.filter(
                Q(status=ALERT_STATUS_ACTIVE) & Q(acknowledged_at__isnull=True)
            ).count(),
        }
        
        return summary
    
    def get_top_alerts(self, limit=10):
        """Get top priority alerts."""
        return self.get_active().order_by(
            '-priority',
            '-created_at'
        )[:limit]
    
    def get_alert_trends(self, days=7):
        """Get alert trends over time."""
        from django.db.models import Count
        from django.db.models.functions import TruncDate
        from datetime import timedelta
        
        cutoff = timezone.now() - timedelta(days=days)
        
        trends = self.filter(
            created_at__gte=cutoff
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        return list(trends)
    
    def get_warehouse_summary(self):
        """Get alerts grouped by warehouse."""
        from django.db.models import Count
        
        return self.get_active().values(
            'warehouse__name'
        ).annotate(
            alert_count=Count('id')
        ).order_by('-alert_count')

# In MonitoringLog model manager
class MonitoringLogManager(TenantAwareManager):
    def get_monitoring_statistics(self, days=7):
        """Get monitoring execution statistics."""
        from django.db.models import Avg, Sum
        from datetime import timedelta
        
        cutoff = timezone.now() - timedelta(days=days)
        
        logs = self.filter(run_started_at__gte=cutoff)
        
        total_runs = logs.count()
        successful_runs = logs.filter(status='completed').count()
        failed_runs = logs.filter(status='failed').count()
        
        stats = {
            'total_runs': total_runs,
            'success_rate': (successful_runs / total_runs * 100) if total_runs > 0 else 0,
            'failed_runs': failed_runs,
            'avg_execution_time': logs.aggregate(avg=Avg('execution_time'))['avg'],
            'total_products_checked': logs.aggregate(sum=Sum('products_checked'))['sum'],
            'total_alerts_created': logs.aggregate(sum=Sum('alerts_created'))['sum'],
            'last_run': logs.order_by('-run_started_at').first(),
        }
        
        return stats
```

### Caching Implementation
```python
from django.core.cache import cache

def get_cached_dashboard_data():
    """Get dashboard data with caching."""
    cache_key = f"dashboard_summary_{get_current_tenant().id}"
    
    data = cache.get(cache_key)
    
    if data is None:
        data = {
            'summary': StockAlert.objects.get_dashboard_summary(),
            'top_alerts': list(StockAlert.objects.get_top_alerts()),
            'trends': StockAlert.objects.get_alert_trends(),
            'warehouse_summary': StockAlert.objects.get_warehouse_summary(),
            'monitoring_stats': MonitoringLog.objects.get_monitoring_statistics(),
        }
        
        # Cache for 5 minutes
        cache.set(cache_key, data, 300)
    
    return data

def invalidate_dashboard_cache():
    """Invalidate dashboard cache."""
    cache_key = f"dashboard_summary_{get_current_tenant().id}"
    cache.delete(cache_key)
```

### Expected Outcome
```json
{
  "summary": {
    "total_active": 23,
    "by_type": {
      "low_stock": 12,
      "critical_stock": 8,
      "out_of_stock": 3
    },
    "critical_count": 5,
    "needs_attention": 15
  },
  "trends": [
    {"date": "2025-01-20", "count": 8},
    {"date": "2025-01-21", "count": 12}
  ]
}
```

### Verification Checklist
- [ ] get_dashboard_summary implemented
- [ ] get_top_alerts method works
- [ ] get_alert_trends calculates trends
- [ ] get_warehouse_summary aggregates
- [ ] get_monitoring_statistics functional
- [ ] Dashboard data cached
- [ ] Cache invalidation on changes

---

## Task 50: Add Webhook Notifications

### Overview
Send webhook notifications to third-party systems when alerts are created or resolved.

### Dependencies
- Group B: AlertNotificationService
- Task 37: Alert creation

### Instructions

1. **Add webhook configuration**
   - Webhook URL field
   - Authentication token
   - Enable/disable toggle
   - Retry configuration

2. **Add send_webhook method**
   - POST alert data as JSON
   - Include authentication
   - Handle timeouts
   - Retry on failure

3. **Add webhook payload structure**
   - Alert details
   - Product information
   - Timestamp and tenant
   - Action type (created/resolved)

4. **Add webhook event types**
   - alert.created
   - alert.resolved
   - alert.acknowledged
   - stock.critically_low
   - stock.out_of_stock

5. **Add webhook retry logic**
   - 3 retry attempts
   - Exponential backoff
   - Log failures
   - Dead letter queue

6. **Add webhook verification**
   - HMAC signature
   - Verify authenticity
   - Security best practices

### Webhook Configuration
```python
# In GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    # Webhook configuration
    webhook_enabled = models.BooleanField(
        default=False,
        help_text="Enable webhook notifications"
    )
    
    webhook_url = models.URLField(
        blank=True,
        help_text="Webhook endpoint URL"
    )
    
    webhook_secret = models.CharField(
        max_length=255,
        blank=True,
        help_text="Webhook authentication secret"
    )
    
    WEBHOOK_EVENT_CHOICES = [
        ('alert.created', 'Alert Created'),
        ('alert.resolved', 'Alert Resolved'),
        ('alert.acknowledged', 'Alert Acknowledged'),
        ('stock.critical', 'Stock Critically Low'),
        ('stock.out_of_stock', 'Out of Stock'),
    ]
    
    webhook_events = models.JSONField(
        default=list,
        help_text="Events to trigger webhooks"
    )
    
    webhook_retry_attempts = models.PositiveIntegerField(
        default=3,
        help_text="Number of retry attempts"
    )
    
    webhook_timeout_seconds = models.PositiveIntegerField(
        default=10,
        help_text="Webhook request timeout"
    )
```

### Webhook Service Implementation
```python
import requests
import hmac
import hashlib
import json

class WebhookService:
    """Service for sending webhook notifications."""
    
    @staticmethod
    def send_alert_webhook(alert, event_type):
        """Send webhook for alert event."""
        from apps.inventory.alerts.models import GlobalStockSettings
        
        settings = GlobalStockSettings.get_settings()
        
        if not settings.webhook_enabled or not settings.webhook_url:
            return False
        
        # Check if event type is enabled
        if event_type not in settings.webhook_events:
            return False
        
        # Build payload
        payload = WebhookService.build_payload(alert, event_type)
        
        # Add signature
        signature = WebhookService.generate_signature(payload, settings.webhook_secret)
        
        headers = {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event_type,
            'X-Tenant-ID': str(get_current_tenant().id),
        }
        
        # Send webhook with retries
        return WebhookService.send_with_retry(
            url=settings.webhook_url,
            payload=payload,
            headers=headers,
            max_attempts=settings.webhook_retry_attempts,
            timeout=settings.webhook_timeout_seconds
        )
    
    @staticmethod
    def build_payload(alert, event_type):
        """Build webhook payload."""
        payload = {
            'event': event_type,
            'timestamp': timezone.now().isoformat(),
            'alert': {
                'id': str(alert.id),
                'alert_type': alert.alert_type,
                'status': alert.status,
                'priority': alert.priority,
                'message': alert.message,
                'current_stock': float(alert.current_stock),
                'threshold_value': float(alert.threshold_value) if alert.threshold_value else None,
                'created_at': alert.created_at.isoformat(),
            },
            'product': {
                'id': str(alert.product.id),
                'name': alert.product.name,
                'sku': alert.product.sku,
            },
            'warehouse': {
                'id': str(alert.warehouse.id) if alert.warehouse else None,
                'name': alert.warehouse.name if alert.warehouse else None,
            },
        }
        
        return payload
    
    @staticmethod
    def generate_signature(payload, secret):
        """Generate HMAC signature for payload."""
        payload_json = json.dumps(payload, sort_keys=True)
        signature = hmac.new(
            secret.encode(),
            payload_json.encode(),
            hashlib.sha256
        ).hexdigest()
        return signature
    
    @staticmethod
    def send_with_retry(url, payload, headers, max_attempts=3, timeout=10):
        """Send webhook with exponential backoff retry."""
        import time
        
        for attempt in range(max_attempts):
            try:
                response = requests.post(
                    url,
                    json=payload,
                    headers=headers,
                    timeout=timeout
                )
                
                if response.status_code in [200, 201, 202]:
                    logger.info(f"Webhook sent successfully: {url}")
                    return True
                
                logger.warning(
                    f"Webhook failed (attempt {attempt + 1}/{max_attempts}): "
                    f"Status {response.status_code}"
                )
                
            except requests.exceptions.RequestException as e:
                logger.error(
                    f"Webhook error (attempt {attempt + 1}/{max_attempts}): {e}"
                )
            
            # Exponential backoff
            if attempt < max_attempts - 1:
                time.sleep(2 ** attempt)
        
        # All attempts failed
        logger.error(f"Webhook failed after {max_attempts} attempts: {url}")
        return False
```

### Webhook Integration Points
```python
# In StockAlert model
def save(self, *args, **kwargs):
    is_new = self._state.adding
    super().save(*args, **kwargs)
    
    if is_new:
        # Send webhook for new alert
        WebhookService.send_alert_webhook(self, 'alert.created')

def resolve(self, auto=False):
    """Resolve the alert."""
    self.status = ALERT_STATUS_RESOLVED
    self.resolved_at = timezone.now()
    self.save()
    
    # Send webhook for resolution
    WebhookService.send_alert_webhook(self, 'alert.resolved')
```

### Webhook Payload Example
```json
{
  "event": "alert.created",
  "timestamp": "2025-01-21T14:30:00+05:30",
  "alert": {
    "id": "abc123",
    "alert_type": "low_stock",
    "status": "active",
    "priority": 5,
    "message": "Stock level below threshold",
    "current_stock": 8.0,
    "threshold_value": 20.0,
    "created_at": "2025-01-21T14:30:00+05:30"
  },
  "product": {
    "id": "prod456",
    "name": "Widget A",
    "sku": "WID-A-001"
  },
  "warehouse": {
    "id": "wh789",
    "name": "Colombo Main Warehouse"
  }
}
```

### Expected Outcome
- Webhook notifications to third-party systems
- Secure HMAC signatures
- Retry logic for reliability

### Verification Checklist
- [ ] Webhook configuration fields added
- [ ] send_webhook method implemented
- [ ] Payload structure defined
- [ ] Event types configured
- [ ] Retry logic with backoff works
- [ ] HMAC signature generation
- [ ] Integration points hooked up
- [ ] Timeout handling
