# Tasks 53-58: ScheduledPrice & FlashSale Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** D - Scheduled & Promotional Pricing  
> **Tasks:** 53-58  
> **Purpose:** Implement time-based pricing with scheduled sales and flash sales

---

## Navigation

- **↑ Parent:** [Group D Overview](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group C - Tiered & Volume Pricing](../Group-C_Tiered-Volume-Pricing/)
- **→ Next:** [02_Tasks-59-63_Promotional-Rules-Effective.md](02_Tasks-59-63_Promotional-Rules-Effective.md)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 53 | Create ScheduledPrice model | Medium | 30 min | Pending |
| 54 | Add schedule validation | Medium | 25 min | Pending |
| 55 | Add schedule status field | Low | 15 min | Pending |
| 56 | Create schedule activation task | High | 30 min | Pending |
| 57 | Add schedule priority field | Low | 20 min | Pending |
| 58 | Create FlashSale model | Medium | 25 min | Pending |

**Total Estimated Time:** 2h 25min

---

## Task 53: Create ScheduledPrice Model

### Description
Create ScheduledPrice model to define time-based pricing that activates and deactivates automatically.

### Acceptance Criteria
- [ ] ScheduledPrice model with start/end datetime
- [ ] Links to Product or ProductVariant
- [ ] sale_price field for scheduled price
- [ ] is_active computed from current datetime
- [ ] Meta configuration with indexes

### File Path
```
backend/apps/products/pricing/models/scheduled_price.py (NEW)
```

### Implementation Details

```python
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import Q, F

from apps.core.models import TenantAwareModel


class ScheduledPrice(TenantAwareModel):
    """
    Time-based pricing that automatically activates and deactivates.
    
    Allows scheduling sales in advance. The system will automatically
    activate the scheduled price at start_datetime and deactivate at
    end_datetime using Celery periodic tasks.
    
    Example uses:
    - Weekend sales (Fri 6pm - Mon 6am)
    - Holiday promotions (Dec 15 - Dec 31)
    - Flash sales (Today 2pm - 4pm)
    - Seasonal pricing (Summer: May-Aug)
    """
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='scheduled_prices',
        null=True,
        blank=True,
        help_text="Product for scheduled price (null if variant-specific)"
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.CASCADE,
        related_name='scheduled_prices',
        null=True,
        blank=True,
        help_text="Variant for scheduled price (null if product-level)"
    )
    
    name = models.CharField(
        max_length=200,
        help_text="Internal name for this scheduled price (e.g., 'Weekend Sale')"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of this scheduled price"
    )
    
    sale_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Scheduled sale price in LKR"
    )
    
    start_datetime = models.DateTimeField(
        help_text="When this scheduled price becomes active"
    )
    end_datetime = models.DateTimeField(
        help_text="When this scheduled price expires"
    )
    
    # Status field (will be added in Task 55)
    status = models.CharField(
        max_length=20,
        default='PENDING',
        help_text="Current status: PENDING, ACTIVE, EXPIRED"
    )
    
    # Priority field (will be added in Task 57)
    priority = models.IntegerField(
        default=0,
        help_text="Priority for overlapping schedules (higher = higher priority)"
    )
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='scheduled_prices_created'
    )
    
    class Meta:
        db_table = 'pricing_scheduled'
        ordering = ['-start_datetime']
        indexes = [
            models.Index(fields=['product', 'start_datetime']),
            models.Index(fields=['variant', 'start_datetime']),
            models.Index(fields=['status', 'start_datetime']),
            models.Index(fields=['start_datetime', 'end_datetime']),
        ]
        constraints = [
            models.CheckConstraint(
                check=Q(product__isnull=False) | Q(variant__isnull=False),
                name='scheduled_price_product_or_variant'
            ),
            models.CheckConstraint(
                check=Q(end_datetime__gt=F('start_datetime')),
                name='scheduled_price_end_after_start'
            ),
        ]
    
    def __str__(self):
        item = self.variant or self.product
        return f"{self.name} - {item} - {self.start_datetime.date()}"
    
    @property
    def is_active(self):
        """Check if this scheduled price is currently active."""
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime
    
    @property
    def is_pending(self):
        """Check if this scheduled price hasn't started yet."""
        return timezone.now() < self.start_datetime
    
    @property
    def is_expired(self):
        """Check if this scheduled price has ended."""
        return timezone.now() > self.end_datetime
    
    def get_item(self):
        """Get the product or variant this schedule applies to."""
        return self.variant or self.product
    
    def clean(self):
        """Validate scheduled price."""
        super().clean()
        
        # Validation will be added in Task 54
        pass
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
```

---

## Task 54: Add Schedule Validation

### Description
Implement validation to prevent overlapping scheduled prices and ensure data integrity.

### Acceptance Criteria
- [ ] Validate start_datetime < end_datetime
- [ ] Check for overlapping schedules on same item
- [ ] Validate sale_price is less than regular price
- [ ] Allow overlaps if priorities differ (handled by priority system)
- [ ] Clear error messages

### Implementation Details

```python
# Update clean() method in ScheduledPrice model

def clean(self):
    """
    Validate scheduled price.
    
    Checks:
    - start_datetime must be before end_datetime
    - No overlapping schedules with same priority
    - sale_price should be less than regular price (warning)
    """
    super().clean()
    
    # Validate datetime range
    if self.start_datetime and self.end_datetime:
        if self.start_datetime >= self.end_datetime:
            raise ValidationError({
                'end_datetime': 'End datetime must be after start datetime.'
            })
    
    # Validate product or variant is specified
    if not self.product and not self.variant:
        raise ValidationError(
            'Either product or variant must be specified.'
        )
    
    if self.product and self.variant:
        raise ValidationError(
            'Cannot specify both product and variant. Choose one.'
        )
    
    # Check for overlapping schedules
    self._check_overlaps()
    
    # Validate sale price (optional warning)
    self._validate_sale_price()

def _check_overlaps(self):
    """
    Check for overlapping scheduled prices.
    
    Schedules overlap if their time ranges intersect AND they have
    the same priority. Different priorities are allowed to overlap
    (highest priority wins).
    """
    if not self.start_datetime or not self.end_datetime:
        return
    
    # Build query for same item
    query = Q()
    if self.variant:
        query = Q(variant=self.variant)
    elif self.product:
        query = Q(product=self.product)
    
    # Exclude self if updating
    existing_schedules = ScheduledPrice.objects.filter(query)
    if self.pk:
        existing_schedules = existing_schedules.exclude(pk=self.pk)
    
    # Check for time overlaps with same priority
    for schedule in existing_schedules:
        if schedule.priority == self.priority:
            if self._time_ranges_overlap(schedule):
                raise ValidationError({
                    'start_datetime': (
                        f'This schedule overlaps with existing schedule: '
                        f'{schedule.name} ({schedule.start_datetime} - '
                        f'{schedule.end_datetime}). Either change the dates '
                        f'or set a different priority.'
                    )
                })

def _time_ranges_overlap(self, other):
    """Check if this schedule's time range overlaps with another."""
    return (
        self.start_datetime < other.end_datetime and
        self.end_datetime > other.start_datetime
    )

def _validate_sale_price(self):
    """
    Validate sale price makes sense.
    
    Issue a warning (not error) if sale price is higher than
    regular price, as this might be intentional in some cases.
    """
    item = self.get_item()
    if not item:
        return
    
    # Get regular price
    if self.variant:
        regular_price = self.variant.price or self.variant.product.base_price
    else:
        regular_price = self.product.base_price
    
    if self.sale_price >= regular_price:
        # This is a warning, not an error
        # In production, you might want to log this or show in admin
        pass
```

---

## Task 55: Add Schedule Status Field

### Description
Add status field to track schedule lifecycle (PENDING, ACTIVE, EXPIRED) with automatic updates.

### Acceptance Criteria
- [ ] status field with choices
- [ ] PENDING: Before start_datetime
- [ ] ACTIVE: Between start and end datetime
- [ ] EXPIRED: After end_datetime
- [ ] update_status() method
- [ ] Status displayed in admin

### Implementation Details

```python
# Update ScheduledPrice model

class ScheduledPrice(TenantAwareModel):
    """..."""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending (Not Started)'
        ACTIVE = 'ACTIVE', 'Active (Currently Running)'
        EXPIRED = 'EXPIRED', 'Expired (Ended)'
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        help_text="Current status of this scheduled price"
    )
    
    # ... rest of model ...
    
    def update_status(self):
        """
        Update status based on current datetime.
        
        This method is called by:
        - Celery periodic task (every 5 minutes)
        - Admin action
        - API endpoint for manual update
        
        Returns:
            bool: True if status changed
        """
        old_status = self.status
        
        if self.is_expired:
            self.status = self.Status.EXPIRED
        elif self.is_active:
            self.status = self.Status.ACTIVE
        else:
            self.status = self.Status.PENDING
        
        if old_status != self.status:
            self.save(update_fields=['status', 'updated_at'])
            return True
        
        return False
    
    def get_status_display_html(self):
        """Get HTML display for status with color coding."""
        colors = {
            self.Status.PENDING: 'orange',
            self.Status.ACTIVE: 'green',
            self.Status.EXPIRED: 'gray',
        }
        color = colors.get(self.status, 'black')
        return f'<span style="color: {color}; font-weight: bold;">{self.get_status_display()}</span>'
```

---

## Task 56: Create Schedule Activation Task

### Description
Create Celery periodic task to automatically activate and deactivate scheduled prices.

### Acceptance Criteria
- [ ] Celery task runs every 5 minutes
- [ ] Updates status for all schedules
- [ ] Logs activation/deactivation events
- [ ] Handles errors gracefully
- [ ] Tenant-aware

### File Path
```
backend/apps/products/pricing/tasks.py (NEW)
```

### Implementation Details

```python
from celery import shared_task
from django.utils import timezone
from django.db.models import Q
import logging

from .models import ScheduledPrice

logger = logging.getLogger(__name__)


@shared_task(name='pricing.update_scheduled_prices')
def update_scheduled_prices():
    """
    Update status of all scheduled prices.
    
    Runs every 5 minutes to check if any scheduled prices should
    be activated or deactivated based on current datetime.
    
    Returns:
        dict: Summary of updates (activated, deactivated, errors)
    """
    now = timezone.now()
    
    activated = 0
    deactivated = 0
    errors = []
    
    try:
        # Get schedules that need status update
        schedules = ScheduledPrice.objects.filter(
            Q(status=ScheduledPrice.Status.PENDING, start_datetime__lte=now) |
            Q(status=ScheduledPrice.Status.ACTIVE, end_datetime__lte=now)
        )
        
        for schedule in schedules:
            try:
                old_status = schedule.status
                if schedule.update_status():
                    if schedule.status == ScheduledPrice.Status.ACTIVE:
                        activated += 1
                        logger.info(
                            f'Activated scheduled price: {schedule.name} '
                            f'for {schedule.get_item()}'
                        )
                    elif schedule.status == ScheduledPrice.Status.EXPIRED:
                        deactivated += 1
                        logger.info(
                            f'Deactivated scheduled price: {schedule.name} '
                            f'for {schedule.get_item()}'
                        )
            
            except Exception as e:
                error_msg = f'Error updating schedule {schedule.id}: {str(e)}'
                logger.error(error_msg)
                errors.append(error_msg)
        
        result = {
            'activated': activated,
            'deactivated': deactivated,
            'errors': errors,
            'timestamp': now.isoformat(),
        }
        
        logger.info(
            f'Scheduled price update complete: '
            f'{activated} activated, {deactivated} deactivated'
        )
        
        return result
    
    except Exception as e:
        logger.exception('Fatal error in update_scheduled_prices task')
        return {
            'activated': 0,
            'deactivated': 0,
            'errors': [str(e)],
            'timestamp': now.isoformat(),
        }


@shared_task(name='pricing.cleanup_expired_schedules')
def cleanup_expired_schedules(days_old=90):
    """
    Clean up old expired scheduled prices.
    
    Deletes expired schedules older than specified days.
    Run weekly via Celery beat.
    
    Args:
        days_old: Delete schedules expired more than this many days ago
        
    Returns:
        int: Number of schedules deleted
    """
    from datetime import timedelta
    
    cutoff_date = timezone.now() - timedelta(days=days_old)
    
    deleted_count, _ = ScheduledPrice.objects.filter(
        status=ScheduledPrice.Status.EXPIRED,
        end_datetime__lt=cutoff_date
    ).delete()
    
    logger.info(f'Cleaned up {deleted_count} expired scheduled prices')
    
    return deleted_count
```

```python
# Register tasks in Celery beat schedule
# In backend/config/celery.py

from celery.schedules import crontab

app.conf.beat_schedule = {
    'update-scheduled-prices': {
        'task': 'pricing.update_scheduled_prices',
        'schedule': 300.0,  # Every 5 minutes
    },
    'cleanup-expired-schedules': {
        'task': 'pricing.cleanup_expired_schedules',
        'schedule': crontab(hour=2, minute=0, day_of_week=1),  # Monday 2am
        'kwargs': {'days_old': 90},
    },
}
```

---

## Task 57: Add Schedule Priority Field

### Description
Add priority field to resolve conflicts when multiple schedules overlap.

### Acceptance Criteria
- [ ] priority field (integer, default 0)
- [ ] Higher priority wins for overlaps
- [ ] Used in get_effective_price resolution
- [ ] Displayed in admin
- [ ] Documented for users

### Implementation Details

```python
# Already added to ScheduledPrice model in Task 53

# Add utility method for priority resolution

def get_highest_priority_schedule(schedules, datetime_to_check=None):
    """
    Get the highest priority schedule from a list.
    
    Args:
        schedules: QuerySet or list of ScheduledPrice objects
        datetime_to_check: Datetime to check (default: now)
        
    Returns:
        ScheduledPrice or None
    """
    if datetime_to_check is None:
        datetime_to_check = timezone.now()
    
    # Filter to active schedules at specified time
    active_schedules = [
        s for s in schedules
        if s.start_datetime <= datetime_to_check <= s.end_datetime
    ]
    
    if not active_schedules:
        return None
    
    # Return schedule with highest priority
    return max(active_schedules, key=lambda s: s.priority)


# Add to Product model

def get_active_scheduled_price(self, datetime_to_check=None):
    """
    Get the currently active scheduled price for this product.
    
    If multiple schedules are active, returns the one with highest priority.
    
    Args:
        datetime_to_check: Datetime to check (default: now)
        
    Returns:
        ScheduledPrice or None
    """
    if datetime_to_check is None:
        datetime_to_check = timezone.now()
    
    schedules = self.scheduled_prices.filter(
        status=ScheduledPrice.Status.ACTIVE,
        start_datetime__lte=datetime_to_check,
        end_datetime__gte=datetime_to_check
    ).order_by('-priority')
    
    return schedules.first()


# Add to ProductVariant model

def get_active_scheduled_price(self, datetime_to_check=None):
    """
    Get the currently active scheduled price for this variant.
    
    Checks variant-specific schedules first, then falls back to product schedules.
    
    Args:
        datetime_to_check: Datetime to check (default: now)
        
    Returns:
        ScheduledPrice or None
    """
    if datetime_to_check is None:
        datetime_to_check = timezone.now()
    
    # Check variant-specific schedules first
    schedules = self.scheduled_prices.filter(
        status=ScheduledPrice.Status.ACTIVE,
        start_datetime__lte=datetime_to_check,
        end_datetime__gte=datetime_to_check
    ).order_by('-priority')
    
    if schedules.exists():
        return schedules.first()
    
    # Fall back to product schedules
    return self.product.get_active_scheduled_price(datetime_to_check)
```

---

## Task 58: Create FlashSale Model

### Description
Create FlashSale model for limited-time sales with quantity limits and automatic ending.

### Acceptance Criteria
- [ ] FlashSale model extends ScheduledPrice
- [ ] max_quantity field for stock limit
- [ ] quantity_sold tracking
- [ ] Auto-deactivates when sold out
- [ ] Urgency indicators (time left, stock left)

### File Path
```
backend/apps/products/pricing/models/flash_sale.py (NEW)
```

### Implementation Details

```python
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from .scheduled_price import ScheduledPrice


class FlashSale(ScheduledPrice):
    """
    Flash sale with quantity limits and urgency indicators.
    
    Flash sales are short-duration sales (typically hours, not days)
    with limited stock. When the stock runs out OR the time expires,
    the sale ends automatically.
    
    Features:
    - Quantity tracking (sold vs available)
    - Auto-deactivation when sold out
    - Urgency indicators for UI
    - Typically higher priority than regular schedules
    """
    
    max_quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        help_text="Maximum units available in this flash sale"
    )
    quantity_sold = models.PositiveIntegerField(
        default=0,
        help_text="Number of units sold so far"
    )
    
    is_sold_out = models.BooleanField(
        default=False,
        help_text="True if max_quantity reached"
    )
    
    # Flash sales typically have higher priority
    # Override default priority in save()
    
    class Meta:
        db_table = 'pricing_flash_sale'
        verbose_name = 'Flash Sale'
        verbose_name_plural = 'Flash Sales'
    
    def __str__(self):
        item = self.variant or self.product
        return f"FLASH: {self.name} - {item}"
    
    @property
    def quantity_remaining(self):
        """Get remaining stock for this flash sale."""
        return max(0, self.max_quantity - self.quantity_sold)
    
    @property
    def percent_sold(self):
        """Get percentage of stock sold."""
        if self.max_quantity == 0:
            return 100
        return (self.quantity_sold / self.max_quantity) * 100
    
    @property
    def time_remaining(self):
        """Get time remaining for this flash sale."""
        if not self.is_active:
            return timedelta(0)
        return self.end_datetime - timezone.now()
    
    @property
    def urgency_level(self):
        """
        Get urgency level for UI display.
        
        Returns:
            str: 'critical', 'high', 'medium', or 'low'
        """
        if self.is_sold_out or not self.is_active:
            return 'critical'
        
        # Check stock level
        if self.percent_sold >= 90:
            return 'critical'
        elif self.percent_sold >= 75:
            return 'high'
        
        # Check time remaining
        hours_left = self.time_remaining.total_seconds() / 3600
        if hours_left <= 1:
            return 'critical'
        elif hours_left <= 3:
            return 'high'
        elif hours_left <= 6:
            return 'medium'
        
        return 'low'
    
    def increment_sold(self, quantity=1):
        """
        Increment quantity sold.
        
        Args:
            quantity: Number of units sold
            
        Returns:
            bool: True if successful, False if would exceed max_quantity
        """
        if self.quantity_sold + quantity > self.max_quantity:
            return False
        
        self.quantity_sold += quantity
        
        if self.quantity_sold >= self.max_quantity:
            self.is_sold_out = True
            self.status = self.Status.EXPIRED  # End the sale
        
        self.save(update_fields=['quantity_sold', 'is_sold_out', 'status'])
        return True
    
    def clean(self):
        """Validate flash sale."""
        super().clean()
        
        # Validate duration (flash sales should be short)
        if self.start_datetime and self.end_datetime:
            duration = self.end_datetime - self.start_datetime
            if duration > timedelta(days=3):
                raise ValidationError({
                    'end_datetime': (
                        'Flash sales should be short-duration (max 3 days). '
                        'Consider using a regular ScheduledPrice instead.'
                    )
                })
        
        # Validate quantity_sold doesn't exceed max
        if self.quantity_sold > self.max_quantity:
            raise ValidationError({
                'quantity_sold': 'Quantity sold cannot exceed max_quantity'
            })
    
    def save(self, *args, **kwargs):
        # Flash sales get higher priority by default
        if not self.priority:
            self.priority = 100
        
        # Update is_sold_out
        if self.quantity_sold >= self.max_quantity:
            self.is_sold_out = True
            self.status = self.Status.EXPIRED
        
        super().save(*args, **kwargs)
    
    def get_urgency_message(self):
        """
        Get urgency message for UI display.
        
        Returns:
            str: Message like "Only 5 left!" or "Ends in 2 hours!"
        """
        if self.is_sold_out:
            return "SOLD OUT"
        
        if not self.is_active:
            return "Sale Ended"
        
        # Stock urgency
        if self.quantity_remaining <= 5:
            return f"Only {self.quantity_remaining} left!"
        elif self.percent_sold >= 75:
            return f"{int(100 - self.percent_sold)}% left!"
        
        # Time urgency
        hours_left = self.time_remaining.total_seconds() / 3600
        if hours_left < 1:
            minutes_left = int(self.time_remaining.total_seconds() / 60)
            return f"Ends in {minutes_left} minutes!"
        elif hours_left < 24:
            return f"Ends in {int(hours_left)} hours!"
        
        return f"Ends {self.end_datetime.strftime('%b %d at %I:%M %p')}"
```

---

## Testing Requirements

### Unit Tests

```python
def test_scheduled_price_creation():
    """Test creating scheduled price."""
    pass

def test_schedule_validation():
    """Test start < end validation."""
    pass

def test_overlap_detection():
    """Test overlapping schedules with same priority are rejected."""
    pass

def test_status_update():
    """Test status updates based on datetime."""
    pass

def test_priority_resolution():
    """Test higher priority schedule wins."""
    pass

def test_flash_sale_quantity_tracking():
    """Test flash sale quantity sold tracking."""
    pass

def test_flash_sale_auto_end():
    """Test flash sale ends when sold out."""
    pass

def test_urgency_indicators():
    """Test urgency level calculation."""
    pass
```

---

## Documentation

### User Guide Snippet
```markdown
## Scheduled Pricing

Schedule sales in advance:

**Weekend Sale Example:**
- Start: Friday 6:00 PM
- End: Monday 6:00 AM
- Sale Price: LKR 800 (vs regular LKR 1,000)

**Flash Sale Example:**
- Duration: 2 hours
- Max Quantity: 50 units
- Sale Price: LKR 700
- Auto-ends when sold out or time expires
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Implement Promotional Rules & Effective Price (Tasks 59-63)
