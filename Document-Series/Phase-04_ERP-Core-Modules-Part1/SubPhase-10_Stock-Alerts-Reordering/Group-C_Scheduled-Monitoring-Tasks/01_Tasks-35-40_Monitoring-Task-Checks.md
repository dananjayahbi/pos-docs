# Tasks 35-40: Stock Monitoring Task & Alert Generation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** C - Scheduled Monitoring Tasks  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-45_Resolution-Scheduling-Logging.md](02_Tasks-41-45_Resolution-Scheduling-Logging.md)

---

## Document Overview

This document covers creating the Celery-based stock monitoring task, implementing batch processing for efficiency, and implementing threshold checking logic for generating alerts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create stock monitoring task | High |
| 36 | Add batch processing | Medium |
| 37 | Implement low stock check | Medium |
| 38 | Implement critical stock check | Medium |
| 39 | Implement out of stock check | Low |
| 40 | Create alert generation logic | Medium |

---

## Task 35: Create Stock Monitoring Task

### Overview
Create the main Celery periodic task that monitors all products' stock levels and triggers alerts when thresholds are breached.

### Dependencies
- Group A: Stock configuration models
- Group B: StockAlert model
- SubPhase-09: StockLevel model
- Phase-03: Celery configuration

### Instructions

1. **Create stock_monitor.py task file**
   - Create file in `apps/inventory/alerts/tasks/`
   - Name: `stock_monitor.py`

2. **Import required modules**
   - Import Celery decorators
   - Import Product, StockLevel models
   - Import StockAlert, ProductStockConfig
   - Import ConfigResolver service
   - Import AlertNotificationService

3. **Define run_stock_monitoring task**
   - Celery shared_task decorator
   - Parameters: tenant_id (optional)
   - Main entry point for monitoring

4. **Add get_products_to_monitor method**
   - Query active products
   - Exclude monitoring_excluded products
   - Filter by tenant
   - Order by last_checked or priority

5. **Add process_product method**
   - Get product's effective config
   - Get current stock levels
   - Check thresholds
   - Create/update alerts as needed

6. **Add monitoring context setup**
   - Set tenant context
   - Track monitoring run statistics
   - Handle errors gracefully
   - Log monitoring activity

7. **Add error handling**
   - Try/except around each product
   - Log errors but continue
   - Don't fail entire task on single error
   - Track error count

8. **Add task result reporting**
   - Return dict with statistics
   - Products checked, alerts created
   - Errors encountered
   - Execution time

9. **Add signal integration**
   - Emit pre-monitoring signal
   - Emit post-monitoring signal
   - Allow extensions to hook in

### Stock Monitoring Task Structure
```python
from celery import shared_task
from django.db import transaction
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def run_stock_monitoring(self, tenant_id=None):
    """
    Main task to monitor stock levels and create alerts.
    
    This task:
    1. Gets all active products
    2. Checks their stock levels
    3. Compares to thresholds
    4. Creates/updates alerts as needed
    5. Sends notifications
    """
    from apps.tenants.models import Tenant
    from apps.inventory.models import Product
    from django_tenants.utils import schema_context
    
    start_time = timezone.now()
    stats = {
        'products_checked': 0,
        'alerts_created': 0,
        'alerts_updated': 0,
        'alerts_resolved': 0,
        'errors': 0,
    }
    
    try:
        # Get tenants to monitor
        if tenant_id:
            tenants = Tenant.objects.filter(id=tenant_id)
        else:
            tenants = Tenant.objects.filter(is_active=True)
        
        for tenant in tenants:
            with schema_context(tenant.schema_name):
                tenant_stats = monitor_tenant_stock(tenant)
                # Aggregate stats
                for key in stats:
                    stats[key] += tenant_stats.get(key, 0)
        
        # Calculate execution time
        execution_time = (timezone.now() - start_time).total_seconds()
        stats['execution_time'] = execution_time
        
        logger.info(f"Stock monitoring completed: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"Stock monitoring failed: {e}")
        raise self.retry(exc=e, countdown=300)  # Retry in 5 minutes
```

### Monitoring Flow
```
Start Task
     │
     ▼
Get Active Tenants
     │
     ▼
For Each Tenant:
     │
     ├─→ Get Products to Monitor
     │   │
     │   ▼
     │   For Each Product:
     │   │
     │   ├─→ Get Effective Config
     │   ├─→ Get Current Stock
     │   ├─→ Check Thresholds
     │   ├─→ Create/Update Alert
     │   └─→ Send Notifications
     │
     ▼
Aggregate Statistics
     │
     ▼
Log Results
     │
     ▼
Complete
```

### Multi-Tenancy Handling
```python
def monitor_tenant_stock(tenant):
    """Monitor stock for a single tenant."""
    stats = {
        'products_checked': 0,
        'alerts_created': 0,
        'alerts_updated': 0,
        'alerts_resolved': 0,
        'errors': 0,
    }
    
    products = get_products_to_monitor(tenant)
    
    for product in products:
        try:
            result = process_product(product)
            stats['products_checked'] += 1
            stats['alerts_created'] += result.get('created', 0)
            stats['alerts_updated'] += result.get('updated', 0)
            stats['alerts_resolved'] += result.get('resolved', 0)
        except Exception as e:
            logger.error(f"Error processing product {product.id}: {e}")
            stats['errors'] += 1
    
    return stats
```

### Expected Outcome
```
apps/inventory/alerts/tasks/
├── __init__.py
└── stock_monitor.py          # Stock monitoring task
```

### Verification Checklist
- [ ] run_stock_monitoring task created
- [ ] Multi-tenant support implemented
- [ ] Error handling robust
- [ ] Statistics tracking works
- [ ] Logging comprehensive
- [ ] Task retries on failure
- [ ] Execution time tracked

---

## Task 36: Add Batch Processing

### Overview
Implement batch processing to handle large product catalogs efficiently without memory issues.

### Dependencies
- Task 35: Create stock monitoring task

### Instructions

1. **Define batch size constant**
   - Name: MONITORING_BATCH_SIZE
   - Default: 100 products per batch
   - Configurable via settings

2. **Add get_products_in_batches method**
   - Use Django queryset iterator
   - Process in chunks
   - Release memory between batches

3. **Add batch_process_products method**
   - Parameters: products_queryset, batch_size
   - Yield batches of products
   - Track batch number and progress

4. **Add batch progress tracking**
   - Log batch start/completion
   - Track products per batch
   - Report progress percentage

5. **Add memory optimization**
   - Use only() to select needed fields
   - Use select_related for FKs
   - Clear querysets after batch

6. **Add batch-level error handling**
   - Continue to next batch on error
   - Track failed batches
   - Retry failed batches

7. **Add batch concurrency (optional)**
   - Use Celery chain for batches
   - Parallel batch processing
   - Coordinate results

8. **Add batch size auto-tuning**
   - Adjust based on execution time
   - Increase if fast, decrease if slow
   - Optimize for performance

### Batch Processing Implementation
```python
MONITORING_BATCH_SIZE = 100

def get_products_to_monitor(tenant):
    """Get queryset of products to monitor."""
    from apps.inventory.models import Product
    
    return Product.objects.filter(
        is_active=True,
        is_archived=False
    ).exclude(
        stock_config__monitoring_enabled=False
    ).select_related(
        'category',
        'stock_config'
    ).only(
        'id',
        'name',
        'sku',
        'category',
        'is_active'
    )

def batch_process_products(products_queryset, batch_size=MONITORING_BATCH_SIZE):
    """Process products in batches."""
    total_count = products_queryset.count()
    batch_number = 0
    processed = 0
    
    logger.info(f"Processing {total_count} products in batches of {batch_size}")
    
    for batch_start in range(0, total_count, batch_size):
        batch_number += 1
        batch_end = min(batch_start + batch_size, total_count)
        
        batch = products_queryset[batch_start:batch_end]
        
        logger.info(f"Processing batch {batch_number}: products {batch_start}-{batch_end}")
        
        batch_stats = process_batch(batch)
        processed += len(batch)
        
        # Log progress
        progress = (processed / total_count) * 100
        logger.info(f"Progress: {progress:.1f}% ({processed}/{total_count})")
        
        yield batch_stats

def process_batch(products_batch):
    """Process a single batch of products."""
    batch_stats = {
        'products': len(products_batch),
        'alerts_created': 0,
        'alerts_updated': 0,
        'alerts_resolved': 0,
        'errors': 0,
    }
    
    for product in products_batch:
        try:
            result = process_product(product)
            batch_stats['alerts_created'] += result.get('created', 0)
            batch_stats['alerts_updated'] += result.get('updated', 0)
            batch_stats['alerts_resolved'] += result.get('resolved', 0)
        except Exception as e:
            logger.error(f"Error processing product {product.id}: {e}")
            batch_stats['errors'] += 1
    
    return batch_stats
```

### Batch Processing Flow
```
Get Products Queryset (e.g., 1,000 products)
         │
         ▼
Split into Batches (10 batches × 100 products)
         │
         ├─→ Batch 1: Products 0-99
         │   ├─→ Process each product
         │   └─→ Collect stats
         │
         ├─→ Batch 2: Products 100-199
         │   ├─→ Process each product
         │   └─→ Collect stats
         │
         ├─→ ... (batches 3-9)
         │
         └─→ Batch 10: Products 900-999
             ├─→ Process each product
             └─→ Collect stats
         │
         ▼
Aggregate All Batch Stats
```

### Memory Optimization
```python
def optimize_queryset(queryset):
    """Optimize queryset for memory efficiency."""
    return queryset.only(
        'id',
        'name',
        'sku',
        'category_id',
        'is_active'
    ).select_related(
        'category',
        'stock_config'
    ).prefetch_related(
        'stock_levels',
        'stock_alerts'
    ).iterator(chunk_size=100)
```

### Batch Size Configuration
```python
# In settings.py or tenant config
STOCK_MONITORING_CONFIG = {
    'batch_size': 100,           # Products per batch
    'max_execution_time': 3600,  # 1 hour max
    'retry_failed_batches': True,
    'parallel_batches': False,
}
```

### Expected Outcome
- Efficient processing of large catalogs
- Controlled memory usage
- Progress tracking
- Scalable architecture

### Verification Checklist
- [ ] Batch size configurable
- [ ] get_products_in_batches implemented
- [ ] batch_process_products yields batches
- [ ] Progress tracking logs
- [ ] Memory optimization applied
- [ ] Batch-level error handling
- [ ] Statistics aggregation correct

---

## Task 37: Implement Low Stock Check

### Overview
Implement logic to detect when products hit low stock threshold and generate appropriate alerts.

### Dependencies
- Task 35: Create stock monitoring task
- Group A: Configuration models

### Instructions

1. **Add check_low_stock method**
   - Parameters: product, stock_level, config
   - Compare stock to low_stock_threshold
   - Return check result dict

2. **Add get_low_stock_threshold method**
   - Get effective threshold from config
   - Handle warehouse-specific thresholds
   - Return threshold value

3. **Add is_low_stock method**
   - Boolean check: stock <= threshold
   - Consider available vs. total stock
   - Account for reserved stock

4. **Add low_stock_severity method**
   - Calculate how far below threshold
   - Return severity level (e.g., 10%, 50%)
   - Used for prioritization

5. **Add should_alert_low_stock method**
   - Check if LOW_STOCK alert needed
   - Consider existing alerts
   - Check cooldown period

6. **Add create_low_stock_alert method**
   - Create or update LOW_STOCK alert
   - Set priority based on severity
   - Trigger notifications

7. **Add low stock trend analysis**
   - Check if stock declining
   - Calculate days to critical
   - Include in alert message

### Low Stock Check Implementation
```python
def check_low_stock(product, stock_level, config):
    """
    Check if product is at low stock level.
    
    Returns:
        dict: {
            'is_low': bool,
            'current_stock': int,
            'threshold': int,
            'severity': float,
            'alert_needed': bool
        }
    """
    threshold = config.get('low_stock_threshold', 10)
    current_stock = stock_level.available_quantity
    
    is_low = current_stock <= threshold
    
    if is_low:
        severity = (threshold - current_stock) / threshold
    else:
        severity = 0
    
    # Check if alert needed
    alert_needed = is_low and should_alert_low_stock(
        product,
        stock_level.warehouse
    )
    
    return {
        'is_low': is_low,
        'current_stock': current_stock,
        'threshold': threshold,
        'severity': severity,
        'alert_needed': alert_needed,
    }

def should_alert_low_stock(product, warehouse=None):
    """Check if LOW_STOCK alert should be created."""
    from apps.inventory.alerts.models import StockAlert
    
    # Check for existing active alert
    existing = StockAlert.get_existing_alert(
        product=product,
        alert_type=ALERT_TYPE_LOW_STOCK,
        warehouse=warehouse
    )
    
    if existing:
        # Update existing alert
        return False
    
    # Check cooldown
    if StockAlert.check_cooldown(product, ALERT_TYPE_LOW_STOCK, warehouse):
        return False
    
    return True

def create_low_stock_alert(product, stock_level, threshold, config):
    """Create or update low stock alert."""
    from apps.inventory.alerts.models import StockAlert
    from apps.inventory.alerts.services.notification import AlertNotificationService
    
    alert, created = StockAlert.create_or_update(
        product=product,
        alert_type=ALERT_TYPE_LOW_STOCK,
        warehouse=stock_level.warehouse,
        current_stock=stock_level.available_quantity,
        threshold_value=threshold,
        threshold_type='low_stock_threshold',
        threshold_source=config.get('source', 'global'),
        priority=2,  # Medium priority
    )
    
    if created:
        # Send notifications for new alert
        AlertNotificationService.send_alert_notification(alert)
        logger.info(f"Created LOW_STOCK alert for {product.name}")
    
    return alert, created
```

### Low Stock Detection Logic
```
Get Current Stock
         │
         ▼
Get Low Stock Threshold
         │
         ▼
current_stock <= threshold?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Calculate   No Alert
Severity    Needed
    │
    ▼
Check Existing Alert
    │
    ┌────┴────┐
  Exists   New
    │         │
    ▼         ▼
 Update    Create
 Alert     Alert
```

### Low Stock Severity Levels
```python
def calculate_severity(current_stock, threshold):
    """Calculate low stock severity."""
    if current_stock > threshold:
        return 0.0  # Not low
    
    deficit = threshold - current_stock
    severity = deficit / threshold
    
    if severity >= 0.8:
        return 'critical'  # 80%+ below
    elif severity >= 0.5:
        return 'high'      # 50-80% below
    elif severity >= 0.2:
        return 'medium'    # 20-50% below
    else:
        return 'low'       # < 20% below
```

### Expected Outcome
- Accurate low stock detection
- Appropriate alert generation
- Severity calculation
- Duplicate prevention

### Verification Checklist
- [ ] check_low_stock method implemented
- [ ] Threshold comparison accurate
- [ ] Severity calculation correct
- [ ] should_alert_low_stock checks duplicates
- [ ] create_low_stock_alert works
- [ ] Notifications triggered
- [ ] Warehouse-specific handling

---

## Task 38: Implement Critical Stock Check

### Overview
Implement detection for critical stock levels (typically 50% of low stock threshold) requiring urgent action.

### Dependencies
- Task 37: Implement low stock check

### Instructions

1. **Add check_critical_stock method**
   - Parameters: product, stock_level, config
   - Calculate critical threshold (low × 0.5)
   - Compare stock to critical threshold

2. **Add get_critical_threshold method**
   - Calculate from low_stock_threshold
   - Use critical_threshold_multiplier from config
   - Default: low_stock_threshold × 0.5

3. **Add is_critical_stock method**
   - Boolean check: stock <= critical_threshold
   - More urgent than low stock
   - Triggers higher priority alerts

4. **Add escalate_to_critical method**
   - Check if existing LOW_STOCK should escalate
   - Update alert_type to CRITICAL_STOCK
   - Increase priority
   - Send new notifications

5. **Add create_critical_stock_alert method**
   - Create or update CRITICAL_STOCK alert
   - Set high priority (3)
   - Trigger urgent notifications

6. **Add critical stock notifications**
   - Include SMS if configured
   - Mark as urgent in email
   - Dashboard priority notification

### Critical Stock Check Implementation
```python
def check_critical_stock(product, stock_level, config):
    """
    Check if product is at critical stock level.
    Critical = Low threshold × critical_threshold_multiplier (default 0.5)
    """
    low_threshold = config.get('low_stock_threshold', 10)
    multiplier = config.get('critical_threshold_multiplier', 0.5)
    critical_threshold = int(low_threshold * multiplier)
    
    current_stock = stock_level.available_quantity
    is_critical = current_stock <= critical_threshold
    
    # Check for escalation from LOW_STOCK
    should_escalate = check_escalation_needed(
        product,
        stock_level.warehouse,
        current_stock,
        critical_threshold
    )
    
    return {
        'is_critical': is_critical,
        'current_stock': current_stock,
        'critical_threshold': critical_threshold,
        'should_escalate': should_escalate,
        'alert_needed': is_critical,
    }

def check_escalation_needed(product, warehouse, current_stock, critical_threshold):
    """Check if LOW_STOCK alert should escalate to CRITICAL."""
    from apps.inventory.alerts.models import StockAlert
    
    low_alert = StockAlert.objects.filter(
        product=product,
        warehouse=warehouse,
        alert_type=ALERT_TYPE_LOW_STOCK,
        status=ALERT_STATUS_ACTIVE
    ).first()
    
    if low_alert and current_stock <= critical_threshold:
        return True
    
    return False

def escalate_to_critical(low_alert):
    """Escalate LOW_STOCK alert to CRITICAL_STOCK."""
    from apps.inventory.alerts.services.notification import AlertNotificationService
    
    # Update alert
    low_alert.alert_type = ALERT_TYPE_CRITICAL_STOCK
    low_alert.priority = 3  # High priority
    low_alert.message = f"CRITICAL: {low_alert.product.name} critically low"
    low_alert.save()
    
    # Send urgent notifications
    AlertNotificationService.send_alert_notification(low_alert)
    
    logger.warning(f"Escalated alert {low_alert.id} to CRITICAL_STOCK")
    
    return low_alert

def create_critical_stock_alert(product, stock_level, threshold, config):
    """Create or update critical stock alert."""
    from apps.inventory.alerts.models import StockAlert
    from apps.inventory.alerts.services.notification import AlertNotificationService
    
    alert, created = StockAlert.create_or_update(
        product=product,
        alert_type=ALERT_TYPE_CRITICAL_STOCK,
        warehouse=stock_level.warehouse,
        current_stock=stock_level.available_quantity,
        threshold_value=threshold,
        threshold_type='critical_threshold',
        threshold_source=config.get('source', 'global'),
        priority=3,  # High priority
    )
    
    if created:
        AlertNotificationService.send_alert_notification(alert)
        logger.warning(f"Created CRITICAL_STOCK alert for {product.name}")
    
    return alert, created
```

### Critical Stock Flow
```
Stock Level Check
         │
         ▼
Is stock <= critical_threshold?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Existing    No Alert
LOW_STOCK   Needed
alert?
    │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Escalate   Create New
to         CRITICAL
CRITICAL   Alert
```

### Critical Threshold Calculation
```python
# Example thresholds:
low_stock_threshold = 20
critical_threshold_multiplier = 0.5

critical_threshold = 20 × 0.5 = 10

Stock Levels:
- 25 units: Normal
- 18 units: LOW_STOCK alert
- 9 units:  CRITICAL_STOCK alert (escalate or new)
- 0 units:  OUT_OF_STOCK alert
```

### Expected Outcome
- Critical stock detection
- Alert escalation from LOW to CRITICAL
- Urgent notification delivery
- Proper priority handling

### Verification Checklist
- [ ] check_critical_stock implemented
- [ ] Critical threshold calculation correct
- [ ] Escalation logic works
- [ ] escalate_to_critical updates alert
- [ ] create_critical_stock_alert functional
- [ ] Urgent notifications sent
- [ ] SMS triggered if configured

---

## Task 39: Implement Out of Stock Check

### Overview
Implement detection for out-of-stock products (zero or negative available quantity).

### Dependencies
- Task 37: Implement low stock check

### Instructions

1. **Add check_out_of_stock method**
   - Parameters: product, stock_level
   - Check if available_quantity <= 0
   - Return check result

2. **Add is_out_of_stock method**
   - Boolean check: available_quantity <= 0
   - Highest priority alert
   - Immediate action required

3. **Add create_out_of_stock_alert method**
   - Create or update OUT_OF_STOCK alert
   - Set critical priority (4)
   - Trigger all notification channels

4. **Add webstore_hide_if_configured method**
   - Check auto_hide_when_oos setting
   - Update product visibility
   - Log visibility change

5. **Add escalate_existing_alerts method**
   - Escalate CRITICAL or LOW to OOS
   - Close existing lower-priority alerts
   - Create new OOS alert

6. **Add out_of_stock_actions method**
   - Hide from webstore if configured
   - Send critical notifications
   - Create reorder suggestion
   - Log inventory event

### Out of Stock Check Implementation
```python
def check_out_of_stock(product, stock_level):
    """
    Check if product is out of stock.
    OOS = available_quantity <= 0
    """
    is_oos = stock_level.available_quantity <= 0
    
    return {
        'is_out_of_stock': is_oos,
        'available_quantity': stock_level.available_quantity,
        'reserved_quantity': stock_level.reserved_quantity,
        'alert_needed': is_oos,
        'hide_from_webstore': should_hide_from_webstore(product),
    }

def should_hide_from_webstore(product):
    """Check if product should be hidden from webstore."""
    config = product.get_stock_config()
    return config and config.auto_hide_when_oos

def create_out_of_stock_alert(product, stock_level, config):
    """Create or update out of stock alert."""
    from apps.inventory.alerts.models import StockAlert
    from apps.inventory.alerts.services.notification import AlertNotificationService
    
    # Resolve any existing lower-priority alerts
    StockAlert.objects.filter(
        product=product,
        warehouse=stock_level.warehouse,
        alert_type__in=[ALERT_TYPE_LOW_STOCK, ALERT_TYPE_CRITICAL_STOCK],
        status=ALERT_STATUS_ACTIVE
    ).update(
        status=ALERT_STATUS_RESOLVED,
        resolved_at=timezone.now()
    )
    
    # Create OOS alert
    alert, created = StockAlert.create_or_update(
        product=product,
        alert_type=ALERT_TYPE_OUT_OF_STOCK,
        warehouse=stock_level.warehouse,
        current_stock=stock_level.available_quantity,
        threshold_value=0,
        threshold_type='out_of_stock',
        priority=4,  # Critical priority
    )
    
    if created:
        # Send all notifications (including SMS if critical)
        AlertNotificationService.send_alert_notification(alert)
        
        # Hide from webstore if configured
        if should_hide_from_webstore(product):
            hide_product_from_webstore(product, stock_level.warehouse)
        
        logger.critical(f"Product {product.name} is OUT OF STOCK")
    
    return alert, created

def hide_product_from_webstore(product, warehouse=None):
    """Hide product from webstore when OOS."""
    # Implementation depends on webstore architecture
    # Could update Product.is_visible_webstore
    # Or create WebstoreVisibility record
    
    if warehouse:
        # Hide only for specific warehouse/location
        logger.info(f"Hiding {product.name} from webstore (warehouse: {warehouse})")
    else:
        # Hide globally
        product.is_visible_webstore = False
        product.save(update_fields=['is_visible_webstore'])
        logger.info(f"Hiding {product.name} from webstore (global)")
```

### Out of Stock Flow
```
Check Available Quantity
         │
         ▼
available_quantity <= 0?
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
Resolve     No OOS
Lower       Alert
Priority    Needed
Alerts
    │
    ▼
Create OOS Alert
    │
    ▼
Send Critical Notifications
    │
    ▼
Hide from Webstore (if configured)
    │
    ▼
Create Reorder Suggestion
```

### OOS Actions Checklist
- Resolve existing LOW/CRITICAL alerts
- Create OUT_OF_STOCK alert with priority 4
- Send email notification
- Send dashboard notification
- Send SMS if configured
- Hide from webstore if auto_hide_when_oos=True
- Create reorder suggestion
- Log critical event

### Expected Outcome
- OOS detection accurate
- Critical alerts created
- Webstore visibility managed
- All notification channels used

### Verification Checklist
- [ ] check_out_of_stock implemented
- [ ] is_out_of_stock boolean check
- [ ] create_out_of_stock_alert works
- [ ] Lower priority alerts resolved
- [ ] Webstore hiding functional
- [ ] Critical notifications sent
- [ ] Reorder suggestion created

---

## Task 40: Create Alert Generation Logic

### Overview
Implement the orchestration logic that ties all threshold checks together and generates appropriate alerts.

### Dependencies
- Tasks 37-39: All threshold checks

### Instructions

1. **Add generate_alerts_for_product method**
   - Orchestrate all threshold checks
   - Determine which alert(s) to create
   - Handle priority conflicts

2. **Add determine_alert_type method**
   - Based on stock level and thresholds
   - Return highest priority applicable alert
   - OOS > Critical > Low > None

3. **Add process_product method**
   - Get effective config
   - Get stock levels (all warehouses if needed)
   - Run threshold checks
   - Generate alerts
   - Return statistics

4. **Add handle_multiple_warehouses method**
   - Process each warehouse separately
   - Create warehouse-specific alerts
   - Aggregate results

5. **Add alert_priority_resolution method**
   - If multiple alert types apply, use highest priority
   - Don't create both LOW and CRITICAL simultaneously
   - Escalate existing alerts instead

6. **Add notification_orchestration method**
   - Determine which channels to use
   - Batch notifications if possible
   - Track delivery status

7. **Add generate_alerts_summary method**
   - Summarize alerts created
   - For logging and reporting
   - Return structured data

### Alert Generation Orchestration
```python
def generate_alerts_for_product(product):
    """
    Generate appropriate alerts for a product.
    Checks all thresholds and creates/updates alerts.
    """
    from apps.inventory.alerts.services.config_resolver import ConfigResolver
    from apps.inventory.models import StockLevel
    
    stats = {
        'product': product.id,
        'created': 0,
        'updated': 0,
        'resolved': 0,
    }
    
    # Get effective configuration
    config = ConfigResolver.resolve_for_product(product)
    
    # Get stock levels
    stock_levels = StockLevel.objects.filter(product=product)
    
    if not stock_levels.exists():
        logger.warning(f"No stock levels found for {product.name}")
        return stats
    
    # Process each warehouse
    for stock_level in stock_levels:
        result = process_stock_level(product, stock_level, config)
        stats['created'] += result['created']
        stats['updated'] += result['updated']
        stats['resolved'] += result['resolved']
    
    return stats

def process_stock_level(product, stock_level, config):
    """Process single stock level and generate alerts."""
    result = {
        'created': 0,
        'updated': 0,
        'resolved': 0,
    }
    
    # Check thresholds in priority order
    oos_check = check_out_of_stock(product, stock_level)
    critical_check = check_critical_stock(product, stock_level, config)
    low_check = check_low_stock(product, stock_level, config)
    
    # Determine alert type (highest priority)
    alert_type = determine_alert_type(oos_check, critical_check, low_check)
    
    if alert_type:
        alert, created = create_alert_for_type(
            alert_type,
            product,
            stock_level,
            config
        )
        
        if created:
            result['created'] = 1
        else:
            result['updated'] = 1
    else:
        # No alert needed, resolve existing if any
        resolved = resolve_existing_alerts(product, stock_level.warehouse)
        result['resolved'] = resolved
    
    return result

def determine_alert_type(oos_check, critical_check, low_check):
    """Determine which alert type to create based on checks."""
    if oos_check['is_out_of_stock']:
        return ALERT_TYPE_OUT_OF_STOCK
    elif critical_check['is_critical']:
        return ALERT_TYPE_CRITICAL_STOCK
    elif low_check['is_low']:
        return ALERT_TYPE_LOW_STOCK
    else:
        return None

def create_alert_for_type(alert_type, product, stock_level, config):
    """Create alert of specified type."""
    if alert_type == ALERT_TYPE_OUT_OF_STOCK:
        return create_out_of_stock_alert(product, stock_level, config)
    elif alert_type == ALERT_TYPE_CRITICAL_STOCK:
        return create_critical_stock_alert(
            product,
            stock_level,
            config.get('critical_threshold'),
            config
        )
    elif alert_type == ALERT_TYPE_LOW_STOCK:
        return create_low_stock_alert(
            product,
            stock_level,
            config.get('low_stock_threshold'),
            config
        )
    
    return None, False

def resolve_existing_alerts(product, warehouse=None):
    """Resolve alerts when stock is replenished."""
    from apps.inventory.alerts.models import StockAlert
    
    alerts_to_resolve = StockAlert.objects.filter(
        product=product,
        warehouse=warehouse,
        status=ALERT_STATUS_ACTIVE
    )
    
    resolved_count = 0
    for alert in alerts_to_resolve:
        if alert.has_stock_improved:
            alert.resolve(auto=True)
            resolved_count += 1
            
            # Create BACK_IN_STOCK notification if configured
            create_back_in_stock_notification(alert)
    
    return resolved_count
```

### Alert Priority Resolution
```
Check All Thresholds:
│
├─→ OUT_OF_STOCK? → Priority 4
├─→ CRITICAL_STOCK? → Priority 3
└─→ LOW_STOCK? → Priority 2

Select Highest Priority
         │
         ▼
Create/Update Alert
         │
         ▼
Resolve Lower Priority Alerts
```

### Expected Outcome
- Complete alert generation orchestration
- Proper priority handling
- No duplicate alerts
- Statistics tracked

### Verification Checklist
- [ ] generate_alerts_for_product works
- [ ] determine_alert_type prioritizes correctly
- [ ] process_product handles all cases
- [ ] Multiple warehouses supported
- [ ] Alert priority resolved
- [ ] Notifications orchestrated
- [ ] Statistics accurate
- [ ] Existing alerts resolved when appropriate
