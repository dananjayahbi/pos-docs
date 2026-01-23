# Tasks 64-68: Cleanup, Analytics & Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** D - Scheduled & Promotional Pricing  
> **Tasks:** 64-68  
> **Purpose:** Implement cleanup tasks, analytics tracking, and comprehensive testing

---

## Navigation

- **↑ Parent:** [Group D Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [02_Tasks-59-63_Promotional-Rules-Effective.md](02_Tasks-59-63_Promotional-Rules-Effective.md)
- **→ Next Group:** [Group E - Price Serializers & API Views](../Group-E_Price-Serializers-API-Views/)

---

## Tasks Overview

| Task # | Task Name | Complexity | Est. Time | Status |
|--------|-----------|------------|-----------|--------|
| 64 | Create schedule expiry cleanup | Medium | 25 min | Pending |
| 65 | Add promotion analytics | High | 30 min | Pending |
| 66 | Create promotional calendar view | Medium | 25 min | Pending |
| 67 | Add schedule bulk operations | Medium | 25 min | Pending |
| 68 | Write scheduled pricing tests | High | 30 min | Pending |

**Total Estimated Time:** 2h 15min

---

## Task 64: Create Schedule Expiry Cleanup

### Description
Implement automated cleanup of expired schedules and data retention policies.

### Acceptance Criteria
- [ ] Celery task for cleanup
- [ ] Configurable retention period
- [ ] Archives expired schedules
- [ ] Cleanup promotional prices
- [ ] Logs cleanup actions
- [ ] Safe deletion checks

### File Path
```
backend/apps/products/pricing/tasks.py (UPDATE)
```

### Implementation Details

```python
# Add to tasks.py (already started in Task 56)

@shared_task(name='pricing.archive_expired_schedules')
def archive_expired_schedules(days_old=30):
    """
    Archive expired scheduled prices to history table.
    
    Instead of deleting, we archive for analytics purposes.
    Run daily via Celery beat.
    
    Args:
        days_old: Archive schedules expired more than this many days ago
        
    Returns:
        dict: Summary of archival
    """
    from datetime import timedelta
    from .models import ScheduledPrice, ScheduledPriceHistory
    
    cutoff_date = timezone.now() - timedelta(days=days_old)
    
    # Get expired schedules to archive
    expired_schedules = ScheduledPrice.objects.filter(
        status=ScheduledPrice.Status.EXPIRED,
        end_datetime__lt=cutoff_date
    )
    
    archived_count = 0
    for schedule in expired_schedules:
        # Create history record
        ScheduledPriceHistory.objects.create(
            original_id=schedule.id,
            tenant=schedule.tenant,
            product=schedule.product,
            variant=schedule.variant,
            name=schedule.name,
            description=schedule.description,
            sale_price=schedule.sale_price,
            start_datetime=schedule.start_datetime,
            end_datetime=schedule.end_datetime,
            priority=schedule.priority,
            created_by=schedule.created_by,
            archived_at=timezone.now()
        )
        
        # Delete original
        schedule.delete()
        archived_count += 1
    
    logger.info(f'Archived {archived_count} expired scheduled prices')
    
    return {
        'archived': archived_count,
        'cutoff_date': cutoff_date.isoformat(),
    }


@shared_task(name='pricing.cleanup_promotional_prices')
def cleanup_promotional_prices(days_old=60):
    """
    Clean up old inactive promotional prices.
    
    Removes promotional prices that ended long ago and are no longer needed.
    More aggressive than schedule cleanup since promos are typically one-time.
    
    Args:
        days_old: Delete promos ended more than this many days ago
        
    Returns:
        int: Number of promos deleted
    """
    from datetime import timedelta
    from .models import PromotionalPrice
    
    cutoff_date = timezone.now() - timedelta(days=days_old)
    
    deleted_count, _ = PromotionalPrice.objects.filter(
        is_active=False,
        end_datetime__lt=cutoff_date
    ).delete()
    
    logger.info(f'Cleaned up {deleted_count} old promotional prices')
    
    return deleted_count


@shared_task(name='pricing.cleanup_flash_sales')
def cleanup_flash_sales(days_old=14):
    """
    Clean up completed flash sales.
    
    Flash sales are very time-sensitive, so we clean them up faster.
    
    Args:
        days_old: Delete flash sales ended more than this many days ago
        
    Returns:
        int: Number of flash sales deleted
    """
    from datetime import timedelta
    from .models import FlashSale
    
    cutoff_date = timezone.now() - timedelta(days=days_old)
    
    deleted_count, _ = FlashSale.objects.filter(
        status=FlashSale.Status.EXPIRED,
        end_datetime__lt=cutoff_date
    ).delete()
    
    logger.info(f'Cleaned up {deleted_count} old flash sales')
    
    return deleted_count


# Add to celery.py beat schedule

app.conf.beat_schedule.update({
    'archive-expired-schedules': {
        'task': 'pricing.archive_expired_schedules',
        'schedule': crontab(hour=3, minute=0),  # Daily at 3am
        'kwargs': {'days_old': 30},
    },
    'cleanup-promotional-prices': {
        'task': 'pricing.cleanup_promotional_prices',
        'schedule': crontab(hour=3, minute=30, day_of_week=0),  # Sunday 3:30am
        'kwargs': {'days_old': 60},
    },
    'cleanup-flash-sales': {
        'task': 'pricing.cleanup_flash_sales',
        'schedule': crontab(hour=3, minute=45, day_of_week=0),  # Sunday 3:45am
        'kwargs': {'days_old': 14},
    },
})
```

```python
# Create history model

# In models/scheduled_price_history.py (NEW)

from django.db import models
from apps.core.models import TenantAwareModel


class ScheduledPriceHistory(TenantAwareModel):
    """
    Archive of expired scheduled prices for analytics.
    
    Keeps historical data for reporting without cluttering
    active scheduled prices table.
    """
    
    original_id = models.IntegerField(
        help_text="Original ScheduledPrice ID"
    )
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.SET_NULL,
        null=True,
        related_name='scheduled_prices_history'
    )
    variant = models.ForeignKey(
        'products.ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        related_name='scheduled_prices_history'
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    priority = models.IntegerField()
    
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True
    )
    
    archived_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pricing_scheduled_history'
        ordering = ['-archived_at']
        indexes = [
            models.Index(fields=['product', 'archived_at']),
            models.Index(fields=['start_datetime', 'end_datetime']),
        ]
    
    def __str__(self):
        return f"Archived: {self.name}"
```

---

## Task 65: Add Promotion Analytics

### Description
Implement analytics tracking for promotional pricing effectiveness (views, conversions, revenue).

### Acceptance Criteria
- [ ] PromotionAnalytics model
- [ ] Track views, clicks, conversions
- [ ] Track revenue generated
- [ ] Conversion rate calculation
- [ ] ROI metrics
- [ ] Daily aggregation task

### File Path
```
backend/apps/products/pricing/models/promotion_analytics.py (NEW)
```

### Implementation Details

```python
from django.db import models
from django.utils import timezone
from decimal import Decimal

from apps.core.models import TenantAwareModel


class PromotionAnalytics(TenantAwareModel):
    """
    Track performance metrics for promotional pricing.
    
    Metrics tracked:
    - Views: How many times promotion was displayed
    - Clicks: How many times promotion was clicked
    - Conversions: How many orders used this promotion
    - Revenue: Total revenue from promotion
    - Discount given: Total discount amount
    
    Used for:
    - ROI calculation
    - A/B testing
    - Optimization
    """
    
    # Link to promotion types
    scheduled_price = models.OneToOneField(
        'pricing.ScheduledPrice',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )
    flash_sale = models.OneToOneField(
        'pricing.FlashSale',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )
    promotional_price = models.OneToOneField(
        'pricing.PromotionalPrice',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='analytics'
    )
    
    # Metrics
    views = models.PositiveIntegerField(
        default=0,
        help_text="Number of times promotion was displayed"
    )
    clicks = models.PositiveIntegerField(
        default=0,
        help_text="Number of times promotion was clicked/used"
    )
    conversions = models.PositiveIntegerField(
        default=0,
        help_text="Number of completed orders using this promotion"
    )
    
    revenue_generated = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total revenue from orders using this promotion"
    )
    discount_given = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Total discount amount given"
    )
    
    # Calculated fields
    conversion_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Conversion rate percentage"
    )
    average_order_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Average order value"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_aggregated_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'pricing_promotion_analytics'
        verbose_name = 'Promotion Analytics'
        verbose_name_plural = 'Promotion Analytics'
    
    def __str__(self):
        promo_name = (
            self.scheduled_price.name if self.scheduled_price else
            self.flash_sale.name if self.flash_sale else
            self.promotional_price.name if self.promotional_price else
            "Unknown"
        )
        return f"Analytics: {promo_name}"
    
    def increment_views(self, count=1):
        """Increment view count."""
        self.views += count
        self.save(update_fields=['views', 'updated_at'])
    
    def increment_clicks(self, count=1):
        """Increment click count."""
        self.clicks += count
        self.save(update_fields=['clicks', 'updated_at'])
    
    def record_conversion(self, order_value: Decimal, discount_amount: Decimal):
        """
        Record a conversion (completed order).
        
        Args:
            order_value: Total order value
            discount_amount: Discount given
        """
        self.conversions += 1
        self.revenue_generated += order_value
        self.discount_given += discount_amount
        
        # Recalculate metrics
        self.calculate_metrics()
        
        self.save(update_fields=[
            'conversions',
            'revenue_generated',
            'discount_given',
            'conversion_rate',
            'average_order_value',
            'updated_at'
        ])
    
    def calculate_metrics(self):
        """Calculate derived metrics."""
        # Conversion rate
        if self.clicks > 0:
            self.conversion_rate = (self.conversions / self.clicks) * 100
        else:
            self.conversion_rate = Decimal('0.00')
        
        # Average order value
        if self.conversions > 0:
            self.average_order_value = self.revenue_generated / self.conversions
        else:
            self.average_order_value = Decimal('0.00')
    
    @property
    def roi(self):
        """
        Calculate ROI.
        
        ROI = (Revenue - Discount) / Discount * 100
        """
        if self.discount_given > 0:
            net_revenue = self.revenue_generated - self.discount_given
            return (net_revenue / self.discount_given) * 100
        return Decimal('0.00')
    
    @property
    def click_through_rate(self):
        """Calculate CTR."""
        if self.views > 0:
            return (self.clicks / self.views) * 100
        return Decimal('0.00')


# Signal to create analytics when promotion is created

from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='pricing.ScheduledPrice')
@receiver(post_save, sender='pricing.FlashSale')
@receiver(post_save, sender='pricing.PromotionalPrice')
def create_promotion_analytics(sender, instance, created, **kwargs):
    """Create analytics record for new promotions."""
    if created:
        analytics_data = {
            'tenant': instance.tenant
        }
        
        if sender.__name__ == 'ScheduledPrice':
            analytics_data['scheduled_price'] = instance
        elif sender.__name__ == 'FlashSale':
            analytics_data['flash_sale'] = instance
        elif sender.__name__ == 'PromotionalPrice':
            analytics_data['promotional_price'] = instance
        
        PromotionAnalytics.objects.create(**analytics_data)
```

```python
# Celery task for aggregation

# In tasks.py

@shared_task(name='pricing.aggregate_promotion_analytics')
def aggregate_promotion_analytics():
    """
    Aggregate promotion analytics daily.
    
    Recalculates metrics and generates daily summaries.
    """
    from .models import PromotionAnalytics
    
    analytics = PromotionAnalytics.objects.all()
    
    updated_count = 0
    for analytic in analytics:
        analytic.calculate_metrics()
        analytic.last_aggregated_at = timezone.now()
        analytic.save(update_fields=[
            'conversion_rate',
            'average_order_value',
            'last_aggregated_at'
        ])
        updated_count += 1
    
    logger.info(f'Aggregated {updated_count} promotion analytics')
    
    return updated_count


# Add to beat schedule
app.conf.beat_schedule.update({
    'aggregate-promotion-analytics': {
        'task': 'pricing.aggregate_promotion_analytics',
        'schedule': crontab(hour=4, minute=0),  # Daily at 4am
    },
})
```

---

## Task 66: Create Promotional Calendar View

### Description
Create API endpoint and view to display promotional calendar showing all scheduled sales.

### Acceptance Criteria
- [ ] Calendar endpoint returns all promotions
- [ ] Grouped by date
- [ ] Includes flash sales, scheduled prices, promos
- [ ] Filter by product, category, status
- [ ] Date range filtering
- [ ] Conflict highlighting

### File Path
```
backend/apps/products/pricing/views/promotional_calendar.py (NEW)
```

### Implementation Details

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict

from ..models import ScheduledPrice, FlashSale, PromotionalPrice
from apps.core.permissions import HasPermission


class PromotionalCalendarView(APIView):
    """
    API endpoint for promotional calendar.
    
    GET /api/pricing/promotional-calendar/
    
    Query params:
    - start_date: Start date (ISO format)
    - end_date: End date (ISO format)
    - product_id: Filter by product
    - category_id: Filter by category
    - status: Filter by status (pending, active, expired)
    """
    
    permission_classes = [IsAuthenticated, HasPermission('view_pricing')]
    
    def get(self, request):
        # Parse query params
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        product_id = request.query_params.get('product_id')
        category_id = request.query_params.get('category_id')
        status = request.query_params.get('status')
        
        # Default to 30 days forward
        if not start_date:
            start_date = timezone.now()
        else:
            start_date = timezone.datetime.fromisoformat(start_date)
        
        if not end_date:
            end_date = start_date + timedelta(days=30)
        else:
            end_date = timezone.datetime.fromisoformat(end_date)
        
        # Build calendar
        calendar_data = self._build_calendar(
            start_date,
            end_date,
            product_id,
            category_id,
            status
        )
        
        return Response(calendar_data)
    
    def _build_calendar(self, start_date, end_date, product_id, category_id, status):
        """Build calendar data structure."""
        calendar = defaultdict(lambda: {
            'date': None,
            'flash_sales': [],
            'scheduled_prices': [],
            'promotional_prices': [],
            'conflicts': []
        })
        
        # Get flash sales
        flash_sales = FlashSale.objects.filter(
            end_datetime__gte=start_date,
            start_datetime__lte=end_date
        )
        if product_id:
            flash_sales = flash_sales.filter(
                Q(product_id=product_id) | Q(variant__product_id=product_id)
            )
        if status:
            flash_sales = flash_sales.filter(status=status.upper())
        
        for flash_sale in flash_sales:
            date_key = flash_sale.start_datetime.date().isoformat()
            calendar[date_key]['date'] = date_key
            calendar[date_key]['flash_sales'].append({
                'id': flash_sale.id,
                'name': flash_sale.name,
                'start': flash_sale.start_datetime.isoformat(),
                'end': flash_sale.end_datetime.isoformat(),
                'price': str(flash_sale.sale_price),
                'max_quantity': flash_sale.max_quantity,
                'quantity_remaining': flash_sale.quantity_remaining,
                'status': flash_sale.status,
                'urgency': flash_sale.urgency_level,
            })
        
        # Get scheduled prices
        scheduled_prices = ScheduledPrice.objects.filter(
            end_datetime__gte=start_date,
            start_datetime__lte=end_date
        ).exclude(flashsale__isnull=False)  # Exclude flash sales
        
        if product_id:
            scheduled_prices = scheduled_prices.filter(
                Q(product_id=product_id) | Q(variant__product_id=product_id)
            )
        if status:
            scheduled_prices = scheduled_prices.filter(status=status.upper())
        
        for schedule in scheduled_prices:
            date_key = schedule.start_datetime.date().isoformat()
            calendar[date_key]['date'] = date_key
            calendar[date_key]['scheduled_prices'].append({
                'id': schedule.id,
                'name': schedule.name,
                'start': schedule.start_datetime.isoformat(),
                'end': schedule.end_datetime.isoformat(),
                'price': str(schedule.sale_price),
                'priority': schedule.priority,
                'status': schedule.status,
            })
        
        # Get promotional prices
        promotional_prices = PromotionalPrice.objects.filter(
            is_active=True,
            end_datetime__gte=start_date,
            start_datetime__lte=end_date
        )
        
        if category_id:
            promotional_prices = promotional_prices.filter(
                categories__id=category_id
            )
        
        for promo in promotional_prices:
            date_key = promo.start_datetime.date().isoformat()
            calendar[date_key]['date'] = date_key
            calendar[date_key]['promotional_prices'].append({
                'id': promo.id,
                'name': promo.name,
                'description': promo.description,
                'start': promo.start_datetime.isoformat(),
                'end': promo.end_datetime.isoformat(),
                'discount_type': promo.discount_type,
                'discount_value': str(promo.discount_value),
                'priority': promo.priority,
                'conditions': promo.get_conditions_display(),
            })
        
        # Check for conflicts
        for date_key in calendar.keys():
            conflicts = self._check_conflicts(calendar[date_key])
            if conflicts:
                calendar[date_key]['conflicts'] = conflicts
        
        # Convert to list and sort by date
        calendar_list = list(calendar.values())
        calendar_list.sort(key=lambda x: x['date'])
        
        return {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'calendar': calendar_list,
        }
    
    def _check_conflicts(self, day_data):
        """Check for scheduling conflicts on a single day."""
        conflicts = []
        
        # Check for overlapping schedules with same priority
        schedules = day_data['scheduled_prices']
        for i, schedule1 in enumerate(schedules):
            for schedule2 in schedules[i+1:]:
                if schedule1['priority'] == schedule2['priority']:
                    conflicts.append({
                        'type': 'priority_conflict',
                        'message': f"Same priority schedules: {schedule1['name']} and {schedule2['name']}"
                    })
        
        return conflicts
```

---

## Task 67: Add Schedule Bulk Operations

### Description
Implement bulk operations for managing multiple schedules (activate, deactivate, duplicate, adjust dates).

### Acceptance Criteria
- [ ] Bulk activate/deactivate
- [ ] Bulk priority update
- [ ] Duplicate schedules to new dates
- [ ] Bulk delete with confirmation
- [ ] Admin actions
- [ ] API endpoints

### Implementation Details

```python
# In admin.py

@admin.register(ScheduledPrice)
class ScheduledPriceAdmin(admin.ModelAdmin):
    """..."""
    
    actions = [
        'activate_schedules',
        'deactivate_schedules',
        'update_status_now',
        'duplicate_schedules',
        'adjust_priority',
    ]
    
    def activate_schedules(self, request, queryset):
        """Manually activate selected schedules."""
        for schedule in queryset:
            schedule.status = ScheduledPrice.Status.ACTIVE
            schedule.save(update_fields=['status'])
        
        self.message_user(
            request,
            f'{queryset.count()} schedule(s) activated.'
        )
    activate_schedules.short_description = 'Activate selected schedules'
    
    def deactivate_schedules(self, request, queryset):
        """Manually deactivate selected schedules."""
        updated = queryset.update(status=ScheduledPrice.Status.EXPIRED)
        self.message_user(
            request,
            f'{updated} schedule(s) deactivated.'
        )
    deactivate_schedules.short_description = 'Deactivate selected schedules'
    
    def update_status_now(self, request, queryset):
        """Update status based on current datetime."""
        updated = 0
        for schedule in queryset:
            if schedule.update_status():
                updated += 1
        
        self.message_user(
            request,
            f'{updated} schedule(s) status updated.'
        )
    update_status_now.short_description = 'Update status now'
    
    def duplicate_schedules(self, request, queryset):
        """Duplicate selected schedules."""
        from datetime import timedelta
        
        duplicated = 0
        for schedule in queryset:
            # Duplicate with 7 days forward
            ScheduledPrice.objects.create(
                tenant=schedule.tenant,
                product=schedule.product,
                variant=schedule.variant,
                name=f"{schedule.name} (Copy)",
                description=schedule.description,
                sale_price=schedule.sale_price,
                start_datetime=schedule.start_datetime + timedelta(days=7),
                end_datetime=schedule.end_datetime + timedelta(days=7),
                priority=schedule.priority,
                status=ScheduledPrice.Status.PENDING,
                created_by=request.user
            )
            duplicated += 1
        
        self.message_user(
            request,
            f'{duplicated} schedule(s) duplicated (7 days forward).'
        )
    duplicate_schedules.short_description = 'Duplicate schedules (+7 days)'
```

```python
# API endpoint for bulk operations

# In views/bulk_operations.py (NEW)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta

from ..models import ScheduledPrice


class BulkScheduleOperationsView(APIView):
    """
    Bulk operations for scheduled prices.
    
    POST /api/pricing/schedules/bulk-operations/
    
    Body:
    {
        "operation": "duplicate"|"activate"|"deactivate"|"update_priority",
        "schedule_ids": [1, 2, 3],
        "params": {
            "days_offset": 7,  // for duplicate
            "priority": 50  // for update_priority
        }
    }
    """
    
    permission_classes = [IsAuthenticated, HasPermission('manage_pricing')]
    
    def post(self, request):
        operation = request.data.get('operation')
        schedule_ids = request.data.get('schedule_ids', [])
        params = request.data.get('params', {})
        
        if not operation or not schedule_ids:
            return Response(
                {'error': 'operation and schedule_ids are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        schedules = ScheduledPrice.objects.filter(id__in=schedule_ids)
        
        if operation == 'duplicate':
            result = self._duplicate_schedules(schedules, params)
        elif operation == 'activate':
            result = self._activate_schedules(schedules)
        elif operation == 'deactivate':
            result = self._deactivate_schedules(schedules)
        elif operation == 'update_priority':
            result = self._update_priority(schedules, params)
        else:
            return Response(
                {'error': f'Unknown operation: {operation}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(result)
    
    def _duplicate_schedules(self, schedules, params):
        days_offset = params.get('days_offset', 7)
        duplicated = []
        
        for schedule in schedules:
            new_schedule = ScheduledPrice.objects.create(
                tenant=schedule.tenant,
                product=schedule.product,
                variant=schedule.variant,
                name=f"{schedule.name} (Copy)",
                description=schedule.description,
                sale_price=schedule.sale_price,
                start_datetime=schedule.start_datetime + timedelta(days=days_offset),
                end_datetime=schedule.end_datetime + timedelta(days=days_offset),
                priority=schedule.priority,
                status=ScheduledPrice.Status.PENDING,
                created_by=self.request.user
            )
            duplicated.append(new_schedule.id)
        
        return {
            'operation': 'duplicate',
            'count': len(duplicated),
            'new_ids': duplicated
        }
    
    def _activate_schedules(self, schedules):
        count = 0
        for schedule in schedules:
            schedule.status = ScheduledPrice.Status.ACTIVE
            schedule.save()
            count += 1
        
        return {
            'operation': 'activate',
            'count': count
        }
    
    def _deactivate_schedules(self, schedules):
        count = schedules.update(status=ScheduledPrice.Status.EXPIRED)
        
        return {
            'operation': 'deactivate',
            'count': count
        }
    
    def _update_priority(self, schedules, params):
        new_priority = params.get('priority', 0)
        count = schedules.update(priority=new_priority)
        
        return {
            'operation': 'update_priority',
            'count': count,
            'new_priority': new_priority
        }
```

---

## Task 68: Write Scheduled Pricing Tests

### Description
Create comprehensive test suite for scheduled pricing, flash sales, and promotional prices.

### Acceptance Criteria
- [ ] Test scheduled price creation and validation
- [ ] Test status updates
- [ ] Test flash sale quantity tracking
- [ ] Test promotional conditions
- [ ] Test price resolution priority
- [ ] Test cleanup tasks
- [ ] 90%+ code coverage

### File Path
```
backend/apps/products/pricing/tests/test_scheduled_pricing.py (NEW)
```

### Implementation Details

```python
import pytest
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError

from apps.products.models import Product
from apps.products.pricing.models import (
    ScheduledPrice,
    FlashSale,
    PromotionalPrice
)
from apps.products.pricing.services import PriceResolutionService


@pytest.mark.django_db
class TestScheduledPrice:
    """Test scheduled pricing."""
    
    def test_create_scheduled_price(self, product):
        """Test creating scheduled price."""
        now = timezone.now()
        schedule = ScheduledPrice.objects.create(
            product=product,
            name="Weekend Sale",
            sale_price=Decimal('800.00'),
            start_datetime=now,
            end_datetime=now + timedelta(days=2),
            status=ScheduledPrice.Status.PENDING
        )
        
        assert schedule.product == product
        assert schedule.sale_price == Decimal('800.00')
        assert schedule.status == ScheduledPrice.Status.PENDING
    
    def test_schedule_validation(self, product):
        """Test start < end validation."""
        now = timezone.now()
        schedule = ScheduledPrice(
            product=product,
            name="Invalid",
            sale_price=Decimal('800.00'),
            start_datetime=now + timedelta(days=2),
            end_datetime=now  # Before start!
        )
        
        with pytest.raises(ValidationError):
            schedule.full_clean()
    
    def test_schedule_status_update(self, product):
        """Test status updates based on datetime."""
        now = timezone.now()
        
        # Create active schedule
        schedule = ScheduledPrice.objects.create(
            product=product,
            name="Active Sale",
            sale_price=Decimal('800.00'),
            start_datetime=now - timedelta(hours=1),
            end_datetime=now + timedelta(hours=1),
            status=ScheduledPrice.Status.PENDING
        )
        
        # Update status
        changed = schedule.update_status()
        assert changed is True
        assert schedule.status == ScheduledPrice.Status.ACTIVE
    
    def test_schedule_priority(self, product):
        """Test higher priority schedule wins."""
        now = timezone.now()
        
        # Low priority
        ScheduledPrice.objects.create(
            product=product,
            name="Low Priority",
            sale_price=Decimal('900.00'),
            start_datetime=now,
            end_datetime=now + timedelta(days=1),
            priority=10,
            status=ScheduledPrice.Status.ACTIVE
        )
        
        # High priority
        ScheduledPrice.objects.create(
            product=product,
            name="High Priority",
            sale_price=Decimal('850.00'),
            start_datetime=now,
            end_datetime=now + timedelta(days=1),
            priority=20,
            status=ScheduledPrice.Status.ACTIVE
        )
        
        # Should get high priority price
        active = product.get_active_scheduled_price()
        assert active.name == "High Priority"
        assert active.sale_price == Decimal('850.00')


@pytest.mark.django_db
class TestFlashSale:
    """Test flash sale functionality."""
    
    def test_create_flash_sale(self, product):
        """Test creating flash sale."""
        now = timezone.now()
        flash_sale = FlashSale.objects.create(
            product=product,
            name="2-Hour Flash Sale",
            sale_price=Decimal('700.00'),
            start_datetime=now,
            end_datetime=now + timedelta(hours=2),
            max_quantity=50,
            status=FlashSale.Status.ACTIVE
        )
        
        assert flash_sale.max_quantity == 50
        assert flash_sale.quantity_remaining == 50
        assert flash_sale.is_sold_out is False
    
    def test_flash_sale_quantity_tracking(self, product):
        """Test quantity tracking."""
        now = timezone.now()
        flash_sale = FlashSale.objects.create(
            product=product,
            name="Flash Sale",
            sale_price=Decimal('700.00'),
            start_datetime=now,
            end_datetime=now + timedelta(hours=2),
            max_quantity=10,
            status=FlashSale.Status.ACTIVE
        )
        
        # Sell 5 units
        success = flash_sale.increment_sold(5)
        assert success is True
        assert flash_sale.quantity_sold == 5
        assert flash_sale.quantity_remaining == 5
        
        # Try to sell 10 more (should fail)
        success = flash_sale.increment_sold(10)
        assert success is False
        assert flash_sale.quantity_sold == 5  # Unchanged
    
    def test_flash_sale_auto_end(self, product):
        """Test auto-end when sold out."""
        now = timezone.now()
        flash_sale = FlashSale.objects.create(
            product=product,
            name="Flash Sale",
            sale_price=Decimal('700.00'),
            start_datetime=now,
            end_datetime=now + timedelta(hours=2),
            max_quantity=10,
            status=FlashSale.Status.ACTIVE
        )
        
        # Sell all units
        flash_sale.increment_sold(10)
        
        assert flash_sale.is_sold_out is True
        assert flash_sale.status == FlashSale.Status.EXPIRED


@pytest.mark.django_db
class TestPromotionalPrice:
    """Test promotional pricing."""
    
    def test_promotional_conditions(self, product):
        """Test promotional condition checking."""
        now = timezone.now()
        promo = PromotionalPrice.objects.create(
            name="Bulk Discount",
            discount_type=PromotionalPrice.DiscountType.PERCENTAGE_OFF,
            discount_value=Decimal('20.00'),
            start_datetime=now,
            end_datetime=now + timedelta(days=7),
            min_quantity=5
        )
        promo.products.add(product)
        
        # Test with quantity 3 (below minimum)
        result = promo.check_conditions(product, quantity=3)
        assert result.is_met is False
        
        # Test with quantity 5 (meets minimum)
        result = promo.check_conditions(product, quantity=5)
        assert result.is_met is True


@pytest.mark.django_db
class TestPriceResolution:
    """Test price resolution priority."""
    
    def test_flash_sale_highest_priority(self, product):
        """Flash sale should override all others."""
        product.base_price = Decimal('1000.00')
        product.sale_price = Decimal('900.00')
        product.save()
        
        now = timezone.now()
        
        # Create flash sale
        FlashSale.objects.create(
            product=product,
            name="Flash",
            sale_price=Decimal('700.00'),
            start_datetime=now,
            end_datetime=now + timedelta(hours=1),
            max_quantity=50,
            status=FlashSale.Status.ACTIVE
        )
        
        result = PriceResolutionService.get_effective_price(product)
        
        assert result['price'] == Decimal('700.00')
        assert result['price_type'] == 'flash_sale'
```

---

## Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-23 | AI Agent | Initial documentation |

---

**Status:** ✅ Ready for Implementation  
**Next Steps:** Begin Group E - Price Serializers & API Views
