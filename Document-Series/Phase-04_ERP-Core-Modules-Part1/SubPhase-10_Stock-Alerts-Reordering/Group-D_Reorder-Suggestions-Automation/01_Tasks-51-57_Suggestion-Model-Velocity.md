# Tasks 51-57: Suggestion Model & Sales Velocity

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** D - Reorder Suggestions & Automation  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Scheduled-Monitoring-Tasks/03_Tasks-46-50_Exclusions-Throttling-Webhooks.md](../Group-C_Scheduled-Monitoring-Tasks/03_Tasks-46-50_Exclusions-Throttling-Webhooks.md)
- **→ Next Document:** [02_Tasks-58-63_Calculator-EOQ-Conversion.md](02_Tasks-58-63_Calculator-EOQ-Conversion.md)

---

## Document Overview

This document covers the ReorderSuggestion model for storing automated reorder recommendations, and the SalesVelocityService for calculating product sales rates with seasonality adjustments.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create ReorderSuggestion model | Medium |
| 52 | Add suggestion fields | Medium |
| 53 | Add status field | Low |
| 54 | Create SalesVelocityService | High |
| 55 | Implement daily_velocity calculation | Medium |
| 56 | Implement weekly_velocity calculation | Medium |
| 57 | Add seasonality adjustment | High |

---

## Task 51: Create ReorderSuggestion Model

### Overview
Create a model to store generated reorder suggestions that can be reviewed and converted to purchase orders.

### Dependencies
- SubPhase-09: Product model
- SubPhase-09: Warehouse model
- Phase-05: PurchaseOrder model (for FK)

### Instructions

1. **Create reorder_suggestion.py file**
   - Location: apps/inventory/alerts/models/
   - Import Django models
   - Import TenantAwareModel

2. **Define ReorderSuggestion class**
   - Inherit from TenantAwareModel
   - Add model metadata
   - Define __str__ method

3. **Add basic model structure**
   - Model name: ReorderSuggestion
   - Verbose name: "Reorder Suggestion"
   - Verbose name plural: "Reorder Suggestions"
   - Ordering: ['-created_at', '-urgency']

4. **Add model manager**
   - Custom manager for common queries
   - get_pending() method
   - get_by_urgency() method
   - get_for_product() method

5. **Add indexes**
   - Index on created_at
   - Index on status
   - Index on urgency
   - Composite index on product + status

6. **Update models __init__.py**
   - Import ReorderSuggestion
   - Add to __all__

### Model Structure
```python
# apps/inventory/alerts/models/reorder_suggestion.py

from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal

from apps.core.models import TenantAwareModel


class ReorderSuggestionManager(models.Manager):
    """Custom manager for ReorderSuggestion."""
    
    def get_pending(self):
        """Get all pending suggestions."""
        return self.filter(status='pending')
    
    def get_by_urgency(self, urgency):
        """Get suggestions by urgency level."""
        return self.filter(urgency=urgency).order_by('-created_at')
    
    def get_for_product(self, product, status=None):
        """Get suggestions for a product."""
        qs = self.filter(product=product)
        if status:
            qs = qs.filter(status=status)
        return qs.order_by('-created_at')
    
    def get_critical(self):
        """Get critical urgency suggestions."""
        return self.filter(urgency='critical', status='pending').order_by('-created_at')


class ReorderSuggestion(TenantAwareModel):
    """
    Store automated reorder suggestions generated from stock monitoring.
    
    Suggestions can be reviewed, modified, and converted to purchase orders.
    """
    
    # Foreign keys will be added in next task
    
    # Custom manager
    objects = ReorderSuggestionManager()
    
    class Meta:
        verbose_name = "Reorder Suggestion"
        verbose_name_plural = "Reorder Suggestions"
        ordering = ['-created_at', '-urgency']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['urgency']),
        ]
    
    def __str__(self):
        return f"Reorder {self.product.name} - {self.suggested_qty} units"
```

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
├── global_settings.py
├── category_config.py
├── product_config.py
├── warehouse_config.py
├── stock_alert.py
├── monitoring_log.py
└── reorder_suggestion.py        # New file
```

### Verification Checklist
- [ ] reorder_suggestion.py file created
- [ ] ReorderSuggestion class defined
- [ ] Custom manager implemented
- [ ] get_pending() method works
- [ ] get_by_urgency() method works
- [ ] get_for_product() method works
- [ ] Model metadata configured
- [ ] Indexes added
- [ ] __init__.py updated

---

## Task 52: Add Suggestion Fields

### Overview
Add all required fields to store reorder suggestion data including quantities, suppliers, urgency, and calculations.

### Dependencies
- Task 51: ReorderSuggestion model created

### Instructions

1. **Add product relationship fields**
   - product FK to Product (required)
   - variant FK to ProductVariant (optional)
   - warehouse FK to Warehouse (optional, None = all)

2. **Add quantity and ordering fields**
   - suggested_qty: Calculated quantity to order
   - minimum_order_qty: Supplier MOQ
   - current_stock: Stock at time of suggestion
   - suggested_supplier FK (optional)

3. **Add urgency field**
   - Choices: LOW, MEDIUM, HIGH, CRITICAL
   - Based on days_until_stockout
   - Integer field for ordering

4. **Add calculation fields**
   - days_until_stockout: Estimated days
   - daily_velocity: Units per day
   - safety_stock: Calculated safety stock
   - eoq: Economic order quantity
   - reorder_point: Calculated reorder point

5. **Add cost fields**
   - estimated_cost: Total cost (LKR)
   - unit_cost: Cost per unit (LKR)
   - Currency: LKR

6. **Add notes and metadata**
   - notes: TextField for manual notes
   - calculation_details: JSONField with stats
   - auto_generated: Boolean

### Field Implementation
```python
class ReorderSuggestion(TenantAwareModel):
    """Store automated reorder suggestions."""
    
    # Product relationships
    product = models.ForeignKey(
        'inventory.Product',
        on_delete=models.CASCADE,
        related_name='reorder_suggestions',
        help_text="Product to reorder"
    )
    
    variant = models.ForeignKey(
        'inventory.ProductVariant',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='reorder_suggestions',
        help_text="Specific variant if applicable"
    )
    
    warehouse = models.ForeignKey(
        'inventory.Warehouse',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reorder_suggestions',
        help_text="Specific warehouse, blank = company-wide"
    )
    
    # Quantities
    suggested_qty = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.001'))],
        help_text="Recommended order quantity"
    )
    
    minimum_order_qty = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        default=Decimal('1.0'),
        help_text="Supplier minimum order quantity"
    )
    
    current_stock = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        default=Decimal('0.0'),
        help_text="Stock at time of suggestion"
    )
    
    # Supplier
    suggested_supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reorder_suggestions',
        help_text="Recommended supplier"
    )
    
    # Urgency
    URGENCY_CHOICES = [
        ('low', 'Low - 30+ days until stockout'),
        ('medium', 'Medium - 15-30 days'),
        ('high', 'High - 5-15 days'),
        ('critical', 'Critical - <5 days or OOS'),
    ]
    
    urgency = models.CharField(
        max_length=20,
        choices=URGENCY_CHOICES,
        default='medium',
        db_index=True,
        help_text="Urgency level based on stockout timeframe"
    )
    
    # Calculation fields
    days_until_stockout = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Estimated days until stockout"
    )
    
    daily_velocity = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Average units sold per day"
    )
    
    safety_stock = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Calculated safety stock level"
    )
    
    eoq = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Economic Order Quantity"
    )
    
    reorder_point = models.DecimalField(
        max_digits=15,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Calculated reorder point"
    )
    
    # Cost fields (LKR)
    estimated_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total estimated cost in LKR"
    )
    
    unit_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Cost per unit in LKR"
    )
    
    # Notes and metadata
    notes = models.TextField(
        blank=True,
        help_text="Manual notes about this suggestion"
    )
    
    calculation_details = models.JSONField(
        default=dict,
        help_text="Detailed calculation stats"
    )
    
    auto_generated = models.BooleanField(
        default=True,
        help_text="Was this suggestion auto-generated?"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Field Relationships Diagram
```
ReorderSuggestion
       │
       ├─→ Product (required)
       ├─→ ProductVariant (optional)
       ├─→ Warehouse (optional)
       ├─→ Supplier (optional)
       └─→ PurchaseOrder (when converted)
```

### Expected Outcome
- Complete ReorderSuggestion model
- All calculation fields present
- Proper relationships to other models

### Verification Checklist
- [ ] Product FK added
- [ ] Variant FK added (optional)
- [ ] Warehouse FK added (optional)
- [ ] suggested_qty field added
- [ ] Supplier FK added
- [ ] Urgency choices defined
- [ ] Calculation fields added
- [ ] Cost fields added (LKR)
- [ ] Notes and metadata fields added
- [ ] Timestamps added

---

## Task 53: Add Status Field

### Overview
Add status tracking for the suggestion lifecycle from pending to converted or dismissed.

### Dependencies
- Task 52: Suggestion fields added

### Instructions

1. **Add status field with choices**
   - PENDING: Awaiting review
   - CONVERTED_TO_PO: Converted to purchase order
   - DISMISSED: Rejected/not needed
   - EXPIRED: Suggestion outdated

2. **Add status transition fields**
   - status_changed_at: Timestamp
   - status_changed_by FK: User who changed
   - dismissal_reason: Why dismissed

3. **Add converted_po FK field**
   - Link to PurchaseOrder
   - Null when status != CONVERTED_TO_PO
   - Set on conversion

4. **Add status methods**
   - mark_converted(po)
   - mark_dismissed(reason, user)
   - is_expired() check
   - can_convert() validation

5. **Add auto-expiry logic**
   - After 30 days if pending
   - Stock situation changed
   - Product discontinued

6. **Add status filtering methods**
   - Add to manager
   - Filter by status
   - Exclude expired

### Status Field Implementation
```python
class ReorderSuggestion(TenantAwareModel):
    """Store automated reorder suggestions."""
    
    # ... existing fields
    
    # Status tracking
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('converted_to_po', 'Converted to PO'),
        ('dismissed', 'Dismissed'),
        ('expired', 'Expired'),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True,
        help_text="Current status of suggestion"
    )
    
    status_changed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When status last changed"
    )
    
    status_changed_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reorder_suggestions_changed',
        help_text="User who changed status"
    )
    
    dismissal_reason = models.TextField(
        blank=True,
        help_text="Reason for dismissal"
    )
    
    # Link to created purchase order
    converted_po = models.ForeignKey(
        'purchasing.PurchaseOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='source_suggestions',
        help_text="PO created from this suggestion"
    )
    
    def mark_converted(self, purchase_order, user=None):
        """Mark suggestion as converted to PO."""
        self.status = 'converted_to_po'
        self.converted_po = purchase_order
        self.status_changed_at = timezone.now()
        self.status_changed_by = user
        self.save(update_fields=[
            'status',
            'converted_po',
            'status_changed_at',
            'status_changed_by'
        ])
        
        logger.info(
            f"Reorder suggestion {self.id} converted to PO {purchase_order.po_number}"
        )
    
    def mark_dismissed(self, reason, user=None):
        """Mark suggestion as dismissed."""
        self.status = 'dismissed'
        self.dismissal_reason = reason
        self.status_changed_at = timezone.now()
        self.status_changed_by = user
        self.save(update_fields=[
            'status',
            'dismissal_reason',
            'status_changed_at',
            'status_changed_by'
        ])
        
        logger.info(f"Reorder suggestion {self.id} dismissed: {reason}")
    
    def is_expired(self):
        """Check if suggestion is expired."""
        from datetime import timedelta
        
        if self.status != 'pending':
            return False
        
        # Expire after 30 days
        expiry_threshold = timezone.now() - timedelta(days=30)
        if self.created_at < expiry_threshold:
            return True
        
        # Check if stock situation improved significantly
        current = self.product.get_available_quantity(warehouse=self.warehouse)
        if current > self.current_stock * 2:  # Stock doubled
            return True
        
        return False
    
    def can_convert(self):
        """Check if suggestion can be converted to PO."""
        if self.status != 'pending':
            return False, "Suggestion not in pending status"
        
        if self.is_expired():
            return False, "Suggestion expired"
        
        if not self.suggested_supplier:
            return False, "No supplier specified"
        
        if self.suggested_qty <= 0:
            return False, "Invalid quantity"
        
        return True, "Can convert"

# Add to manager
class ReorderSuggestionManager(models.Manager):
    # ... existing methods
    
    def get_pending(self):
        """Get all pending suggestions (excluding expired)."""
        pending = self.filter(status='pending')
        
        # Filter out expired
        active = []
        for suggestion in pending:
            if not suggestion.is_expired():
                active.append(suggestion.id)
        
        return self.filter(id__in=active)
    
    def get_converted(self):
        """Get suggestions converted to POs."""
        return self.filter(status='converted_to_po')
    
    def get_dismissed(self):
        """Get dismissed suggestions."""
        return self.filter(status='dismissed')
    
    def mark_expired_suggestions(self):
        """Mark expired suggestions as expired."""
        pending = self.filter(status='pending')
        expired_count = 0
        
        for suggestion in pending:
            if suggestion.is_expired():
                suggestion.status = 'expired'
                suggestion.status_changed_at = timezone.now()
                suggestion.save(update_fields=['status', 'status_changed_at'])
                expired_count += 1
        
        return expired_count
```

### Status Lifecycle Flow
```
      PENDING
         │
    ┌────┴────┐
    │         │
    ▼         ▼
CONVERTED   DISMISSED
  TO PO       
              │
         Auto-Expire
         (30 days)
              │
              ▼
           EXPIRED
```

### Expected Outcome
- Status tracking for suggestions
- Methods to transition states
- Auto-expiry logic

### Verification Checklist
- [ ] status field with choices added
- [ ] status_changed_at field added
- [ ] status_changed_by FK added
- [ ] dismissal_reason field added
- [ ] converted_po FK added
- [ ] mark_converted() method works
- [ ] mark_dismissed() method works
- [ ] is_expired() logic correct
- [ ] can_convert() validation works
- [ ] Manager methods updated

---

## Task 54: Create SalesVelocityService

### Overview
Create a service to calculate how fast products are selling, which is essential for reorder calculations.

### Dependencies
- SubPhase-09: StockMovement model
- SubPhase-09: OrderItem model (sales data)

### Instructions

1. **Create sales_velocity.py file**
   - Location: apps/inventory/alerts/services/
   - Service class pattern
   - Static methods for calculations

2. **Create SalesVelocityService class**
   - calculate_velocity() main method
   - get_sales_data() helper
   - aggregate_by_period() helper

3. **Add get_sales_data method**
   - Query OrderItem for date range
   - Filter completed orders
   - Group by product
   - Return quantities sold

4. **Add time_period parameter**
   - Days: 7, 14, 30, 60, 90, 365
   - Default: 30 days
   - Configurable per product

5. **Add exclude_outliers option**
   - Remove extreme values
   - Use IQR method
   - Improve accuracy

6. **Add handle_no_sales logic**
   - If no sales in period
   - Check longer period
   - Use category average
   - Default to 0

### Service Structure
```python
# apps/inventory/alerts/services/sales_velocity.py

from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class SalesVelocityService:
    """
    Calculate sales velocity (rate of sale) for products.
    
    Used for reorder calculations and demand forecasting.
    """
    
    @staticmethod
    def calculate_velocity(product, days=30, warehouse=None, exclude_outliers=True):
        """
        Calculate sales velocity for a product.
        
        Args:
            product: Product instance
            days: Number of days to analyze
            warehouse: Specific warehouse or None for all
            exclude_outliers: Remove extreme values
        
        Returns:
            dict with velocity metrics
        """
        sales_data = SalesVelocityService.get_sales_data(
            product=product,
            days=days,
            warehouse=warehouse
        )
        
        if not sales_data:
            # No sales data
            return SalesVelocityService.handle_no_sales(product, days)
        
        total_qty = sales_data['total_quantity']
        
        # Calculate velocities
        daily_velocity = total_qty / days
        weekly_velocity = (total_qty / days) * 7
        monthly_velocity = (total_qty / days) * 30
        
        result = {
            'daily_velocity': daily_velocity,
            'weekly_velocity': weekly_velocity,
            'monthly_velocity': monthly_velocity,
            'total_sold': total_qty,
            'days_analyzed': days,
            'order_count': sales_data['order_count'],
            'has_data': True,
        }
        
        logger.info(
            f"Velocity for {product.name}: {daily_velocity:.2f} units/day "
            f"({days} days)"
        )
        
        return result
    
    @staticmethod
    def get_sales_data(product, days, warehouse=None):
        """
        Get sales data for product in time period.
        
        Returns:
            dict with total_quantity and order_count
        """
        from apps.orders.models import OrderItem, Order
        
        cutoff_date = timezone.now() - timedelta(days=days)
        
        # Query completed orders
        order_items = OrderItem.objects.filter(
            product=product,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=cutoff_date
        )
        
        # Filter by warehouse if specified
        if warehouse:
            order_items = order_items.filter(warehouse=warehouse)
        
        # Aggregate
        aggregated = order_items.aggregate(
            total_quantity=Sum('quantity'),
            order_count=Count('order', distinct=True)
        )
        
        total_quantity = aggregated['total_quantity'] or Decimal('0')
        order_count = aggregated['order_count'] or 0
        
        if total_quantity == 0:
            return None
        
        return {
            'total_quantity': total_quantity,
            'order_count': order_count,
        }
    
    @staticmethod
    def handle_no_sales(product, days):
        """
        Handle case where product has no sales in period.
        
        Try:
        1. Check longer period (90 days)
        2. Use category average
        3. Default to 0
        """
        # Try longer period
        if days < 90:
            longer_data = SalesVelocityService.get_sales_data(
                product=product,
                days=90,
                warehouse=None
            )
            
            if longer_data:
                total_qty = longer_data['total_quantity']
                daily_velocity = total_qty / 90
                
                logger.info(
                    f"No sales in {days} days for {product.name}, "
                    f"using 90-day average: {daily_velocity:.2f} units/day"
                )
                
                return {
                    'daily_velocity': daily_velocity,
                    'weekly_velocity': daily_velocity * 7,
                    'monthly_velocity': daily_velocity * 30,
                    'total_sold': total_qty,
                    'days_analyzed': 90,
                    'order_count': longer_data['order_count'],
                    'has_data': True,
                    'fallback': 'longer_period',
                }
        
        # Try category average
        category_avg = SalesVelocityService.get_category_average(
            product.category,
            days=days
        )
        
        if category_avg:
            logger.info(
                f"No sales data for {product.name}, "
                f"using category average: {category_avg:.2f} units/day"
            )
            
            return {
                'daily_velocity': category_avg,
                'weekly_velocity': category_avg * 7,
                'monthly_velocity': category_avg * 30,
                'total_sold': Decimal('0'),
                'days_analyzed': days,
                'order_count': 0,
                'has_data': False,
                'fallback': 'category_average',
            }
        
        # Default to 0
        logger.warning(f"No sales data for {product.name}, defaulting to 0")
        
        return {
            'daily_velocity': Decimal('0'),
            'weekly_velocity': Decimal('0'),
            'monthly_velocity': Decimal('0'),
            'total_sold': Decimal('0'),
            'days_analyzed': days,
            'order_count': 0,
            'has_data': False,
            'fallback': 'zero',
        }
    
    @staticmethod
    def get_category_average(category, days=30):
        """Get average velocity for category."""
        from apps.orders.models import OrderItem
        from django.db.models import Sum, Count
        
        cutoff_date = timezone.now() - timedelta(days=days)
        
        # Get all products in category
        products = category.products.filter(is_active=True, track_inventory=True)
        product_ids = list(products.values_list('id', flat=True))
        
        if not product_ids:
            return None
        
        # Aggregate sales across category
        order_items = OrderItem.objects.filter(
            product_id__in=product_ids,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=cutoff_date
        )
        
        total_quantity = order_items.aggregate(
            total=Sum('quantity')
        )['total'] or Decimal('0')
        
        if total_quantity == 0:
            return None
        
        # Average per product
        avg_per_product = total_quantity / len(product_ids)
        avg_daily = avg_per_product / days
        
        return avg_daily
```

### Expected Outcome
```
apps/inventory/alerts/services/
├── __init__.py
├── config_resolver.py
├── alert_notification.py
└── sales_velocity.py          # New service
```

### Verification Checklist
- [ ] sales_velocity.py file created
- [ ] SalesVelocityService class defined
- [ ] calculate_velocity() method works
- [ ] get_sales_data() queries correctly
- [ ] handle_no_sales() fallback works
- [ ] get_category_average() calculates
- [ ] Logging implemented
- [ ] Edge cases handled

---

## Task 55: Implement Daily Velocity Calculation

### Overview
Implement precise daily sales velocity calculation with confidence intervals.

### Dependencies
- Task 54: SalesVelocityService created

### Instructions

1. **Add calculate_daily_velocity method**
   - Separate from main calculate_velocity
   - More detailed daily breakdown
   - Return confidence interval

2. **Add get_daily_breakdown method**
   - Sales per day in period
   - Identify trends
   - Detect patterns

3. **Add confidence_interval calculation**
   - Standard deviation
   - 95% confidence level
   - Upper and lower bounds

4. **Add moving_average option**
   - 7-day moving average
   - Smooths fluctuations
   - Better for volatile products

5. **Add min_data_points validation**
   - Need at least 7 days data
   - Or 3 orders minimum
   - Flag low confidence

### Daily Velocity Implementation
```python
class SalesVelocityService:
    # ... existing methods
    
    @staticmethod
    def calculate_daily_velocity(product, days=30, warehouse=None):
        """
        Calculate detailed daily velocity with confidence intervals.
        
        Returns:
            dict with daily_velocity, confidence_interval, trend
        """
        from statistics import mean, stdev
        
        # Get daily breakdown
        daily_breakdown = SalesVelocityService.get_daily_breakdown(
            product=product,
            days=days,
            warehouse=warehouse
        )
        
        if not daily_breakdown or len(daily_breakdown) < 7:
            # Not enough data
            return {
                'daily_velocity': Decimal('0'),
                'confidence': 'low',
                'message': 'Insufficient data for reliable velocity'
            }
        
        # Calculate average
        daily_quantities = [day['quantity'] for day in daily_breakdown]
        avg_daily = mean(daily_quantities)
        
        # Calculate confidence interval
        if len(daily_quantities) > 1:
            std_dev = stdev(daily_quantities)
            # 95% confidence interval (1.96 * std_dev / sqrt(n))
            margin = 1.96 * (std_dev / (len(daily_quantities) ** 0.5))
            
            confidence_interval = {
                'lower': max(0, avg_daily - margin),
                'upper': avg_daily + margin,
                'std_dev': std_dev,
            }
        else:
            confidence_interval = None
        
        # Detect trend
        trend = SalesVelocityService.detect_trend(daily_quantities)
        
        result = {
            'daily_velocity': Decimal(str(round(avg_daily, 3))),
            'confidence_interval': confidence_interval,
            'trend': trend,
            'data_points': len(daily_quantities),
            'confidence': 'high' if len(daily_quantities) >= 30 else 'medium',
        }
        
        return result
    
    @staticmethod
    def get_daily_breakdown(product, days, warehouse=None):
        """
        Get sales quantity for each day in period.
        
        Returns:
            list of dicts with date and quantity
        """
        from apps.orders.models import OrderItem
        from django.db.models import Sum
        from django.db.models.functions import TruncDate
        
        cutoff_date = timezone.now() - timedelta(days=days)
        
        # Query order items
        order_items = OrderItem.objects.filter(
            product=product,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=cutoff_date
        )
        
        if warehouse:
            order_items = order_items.filter(warehouse=warehouse)
        
        # Group by date
        daily_data = order_items.annotate(
            date=TruncDate('order__created_at')
        ).values('date').annotate(
            quantity=Sum('quantity')
        ).order_by('date')
        
        return list(daily_data)
    
    @staticmethod
    def detect_trend(daily_quantities):
        """
        Detect if sales are trending up, down, or stable.
        
        Uses simple linear regression slope.
        """
        if len(daily_quantities) < 7:
            return 'insufficient_data'
        
        n = len(daily_quantities)
        x = list(range(n))
        y = daily_quantities
        
        # Calculate slope (simple linear regression)
        x_mean = sum(x) / n
        y_mean = sum(y) / n
        
        numerator = sum((x[i] - x_mean) * (y[i] - y_mean) for i in range(n))
        denominator = sum((x[i] - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return 'stable'
        
        slope = numerator / denominator
        
        # Classify trend
        if slope > 0.1:
            return 'increasing'
        elif slope < -0.1:
            return 'decreasing'
        else:
            return 'stable'
```

### Expected Outcome
```python
velocity_data = SalesVelocityService.calculate_daily_velocity(product, days=30)
# Returns:
{
    'daily_velocity': Decimal('5.234'),
    'confidence_interval': {
        'lower': 3.8,
        'upper': 6.7,
        'std_dev': 2.1
    },
    'trend': 'increasing',
    'data_points': 30,
    'confidence': 'high'
}
```

### Verification Checklist
- [ ] calculate_daily_velocity() implemented
- [ ] get_daily_breakdown() works
- [ ] Confidence interval calculated
- [ ] Trend detection works
- [ ] Min data points validated
- [ ] Edge cases handled

---

## Task 56: Implement Weekly Velocity Calculation

### Overview
Calculate weekly velocity for products with longer sales cycles or seasonal patterns.

### Dependencies
- Task 55: Daily velocity calculation

### Instructions

1. **Add calculate_weekly_velocity method**
   - Aggregate by week
   - Better for slow-moving items
   - 12-week default period

2. **Add get_weekly_breakdown method**
   - Group sales by ISO week
   - Return week number and quantity
   - Easier to spot patterns

3. **Add week_over_week_growth method**
   - Compare recent weeks
   - Identify acceleration/deceleration
   - Percentage change

4. **Add seasonal_week_comparison method**
   - Compare to same week last year
   - Handle seasonality
   - Year-over-year growth

### Weekly Velocity Implementation
```python
class SalesVelocityService:
    # ... existing methods
    
    @staticmethod
    def calculate_weekly_velocity(product, weeks=12, warehouse=None):
        """
        Calculate weekly sales velocity.
        
        Better for products with longer sales cycles.
        """
        days = weeks * 7
        
        weekly_breakdown = SalesVelocityService.get_weekly_breakdown(
            product=product,
            weeks=weeks,
            warehouse=warehouse
        )
        
        if not weekly_breakdown:
            return {
                'weekly_velocity': Decimal('0'),
                'confidence': 'low',
                'message': 'No sales data'
            }
        
        # Calculate average
        weekly_quantities = [week['quantity'] for week in weekly_breakdown]
        avg_weekly = sum(weekly_quantities) / len(weekly_quantities)
        
        # Convert to daily
        avg_daily = avg_weekly / 7
        
        # Week over week growth
        wow_growth = SalesVelocityService.week_over_week_growth(weekly_quantities)
        
        result = {
            'weekly_velocity': Decimal(str(round(avg_weekly, 3))),
            'daily_velocity': Decimal(str(round(avg_daily, 3))),
            'weeks_analyzed': len(weekly_quantities),
            'week_over_week_growth': wow_growth,
            'confidence': 'high' if len(weekly_quantities) >= 8 else 'medium',
        }
        
        return result
    
    @staticmethod
    def get_weekly_breakdown(product, weeks, warehouse=None):
        """
        Get sales quantity for each week in period.
        
        Returns:
            list of dicts with week and quantity
        """
        from apps.orders.models import OrderItem
        from django.db.models import Sum
        from django.db.models.functions import ExtractWeek, ExtractYear
        
        cutoff_date = timezone.now() - timedelta(weeks=weeks)
        
        # Query order items
        order_items = OrderItem.objects.filter(
            product=product,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=cutoff_date
        )
        
        if warehouse:
            order_items = order_items.filter(warehouse=warehouse)
        
        # Group by ISO week
        weekly_data = order_items.annotate(
            year=ExtractYear('order__created_at'),
            week=ExtractWeek('order__created_at')
        ).values('year', 'week').annotate(
            quantity=Sum('quantity')
        ).order_by('year', 'week')
        
        return list(weekly_data)
    
    @staticmethod
    def week_over_week_growth(weekly_quantities):
        """
        Calculate week-over-week growth rate.
        
        Returns average % change between consecutive weeks.
        """
        if len(weekly_quantities) < 2:
            return None
        
        growth_rates = []
        
        for i in range(1, len(weekly_quantities)):
            prev_week = weekly_quantities[i - 1]
            curr_week = weekly_quantities[i]
            
            if prev_week > 0:
                growth = ((curr_week - prev_week) / prev_week) * 100
                growth_rates.append(growth)
        
        if not growth_rates:
            return None
        
        avg_growth = sum(growth_rates) / len(growth_rates)
        
        return round(avg_growth, 2)
```

### Expected Outcome
```python
weekly_data = SalesVelocityService.calculate_weekly_velocity(product, weeks=12)
# Returns:
{
    'weekly_velocity': Decimal('35.5'),
    'daily_velocity': Decimal('5.071'),
    'weeks_analyzed': 12,
    'week_over_week_growth': 3.5,  # % growth
    'confidence': 'high'
}
```

### Verification Checklist
- [ ] calculate_weekly_velocity() works
- [ ] get_weekly_breakdown() groups by week
- [ ] week_over_week_growth() calculates
- [ ] Converts to daily velocity
- [ ] Edge cases handled

---

## Task 57: Add Seasonality Adjustment

### Overview
Adjust velocity calculations based on seasonal patterns to improve forecast accuracy.

### Dependencies
- Task 56: Weekly velocity calculation

### Instructions

1. **Add get_seasonal_factor method**
   - Compare current period to last year
   - Calculate adjustment multiplier
   - Range: 0.5 to 2.0 typical

2. **Add apply_seasonality method**
   - Apply factor to velocity
   - Adjust forecasts
   - Log adjustments

3. **Add detect_seasonality method**
   - Analyze year-over-year patterns
   - Identify seasonal products
   - Return boolean

4. **Add get_seasonal_profile method**
   - Monthly seasonality factors
   - Peak and off-peak periods
   - Visualization data

5. **Add seasonal_adjustment_enabled config**
   - In GlobalStockSettings
   - Enable/disable per tenant
   - Default: enabled

### Seasonality Implementation
```python
class SalesVelocityService:
    # ... existing methods
    
    @staticmethod
    def get_seasonal_factor(product, current_month=None):
        """
        Calculate seasonal adjustment factor for current month.
        
        Compares current month to same month last year.
        
        Returns:
            float: adjustment factor (1.0 = no adjustment)
        """
        from apps.inventory.alerts.models import GlobalStockSettings
        
        settings = GlobalStockSettings.get_settings()
        
        if not settings.seasonal_adjustment_enabled:
            return 1.0
        
        if current_month is None:
            current_month = timezone.now().month
        
        # Get sales for current month this year
        current_year_sales = SalesVelocityService.get_monthly_sales(
            product=product,
            year=timezone.now().year,
            month=current_month
        )
        
        # Get sales for same month last year
        last_year_sales = SalesVelocityService.get_monthly_sales(
            product=product,
            year=timezone.now().year - 1,
            month=current_month
        )
        
        if not last_year_sales or last_year_sales == 0:
            # No historical data
            logger.info(f"No historical seasonality data for {product.name}")
            return 1.0
        
        # Calculate factor
        factor = current_year_sales / last_year_sales
        
        # Clamp to reasonable range
        factor = max(0.5, min(factor, 2.0))
        
        logger.info(
            f"Seasonal factor for {product.name} in month {current_month}: {factor:.2f}"
        )
        
        return factor
    
    @staticmethod
    def get_monthly_sales(product, year, month):
        """Get total sales for a specific month."""
        from apps.orders.models import OrderItem
        from django.db.models import Sum
        from datetime import datetime
        import calendar
        
        # Get month date range
        _, last_day = calendar.monthrange(year, month)
        start_date = datetime(year, month, 1)
        end_date = datetime(year, month, last_day, 23, 59, 59)
        
        # Query sales
        sales = OrderItem.objects.filter(
            product=product,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=start_date,
            order__created_at__lte=end_date
        ).aggregate(
            total=Sum('quantity')
        )['total'] or Decimal('0')
        
        return float(sales)
    
    @staticmethod
    def apply_seasonality(velocity_data, product):
        """
        Apply seasonal adjustment to velocity data.
        
        Args:
            velocity_data: dict from calculate_velocity()
            product: Product instance
        
        Returns:
            adjusted velocity_data dict
        """
        seasonal_factor = SalesVelocityService.get_seasonal_factor(product)
        
        if seasonal_factor == 1.0:
            velocity_data['seasonal_adjusted'] = False
            return velocity_data
        
        # Apply adjustment
        velocity_data['daily_velocity'] *= Decimal(str(seasonal_factor))
        velocity_data['weekly_velocity'] *= Decimal(str(seasonal_factor))
        velocity_data['monthly_velocity'] *= Decimal(str(seasonal_factor))
        velocity_data['seasonal_factor'] = seasonal_factor
        velocity_data['seasonal_adjusted'] = True
        
        logger.info(
            f"Applied seasonal factor {seasonal_factor:.2f} to {product.name}"
        )
        
        return velocity_data
    
    @staticmethod
    def detect_seasonality(product):
        """
        Detect if product shows seasonal pattern.
        
        Returns:
            bool: True if seasonal pattern detected
        """
        # Get sales for last 12 months
        monthly_sales = []
        
        for i in range(12):
            month_date = timezone.now() - timedelta(days=30 * i)
            sales = SalesVelocityService.get_monthly_sales(
                product=product,
                year=month_date.year,
                month=month_date.month
            )
            monthly_sales.append(sales)
        
        if sum(monthly_sales) == 0:
            return False
        
        # Calculate coefficient of variation
        from statistics import mean, stdev
        
        avg = mean(monthly_sales)
        if avg == 0:
            return False
        
        std = stdev(monthly_sales)
        cv = (std / avg) * 100
        
        # If CV > 50%, consider seasonal
        is_seasonal = cv > 50
        
        logger.info(
            f"{product.name} seasonality: CV={cv:.1f}%, "
            f"seasonal={is_seasonal}"
        )
        
        return is_seasonal
    
    @staticmethod
    def get_seasonal_profile(product):
        """
        Get full seasonal profile for product.
        
        Returns:
            dict with monthly factors
        """
        # Get average sales per month over last 2 years
        monthly_factors = {}
        
        for month in range(1, 13):
            # Average for this month over 2 years
            year1_sales = SalesVelocityService.get_monthly_sales(
                product, timezone.now().year, month
            )
            year2_sales = SalesVelocityService.get_monthly_sales(
                product, timezone.now().year - 1, month
            )
            
            avg_sales = (year1_sales + year2_sales) / 2
            monthly_factors[month] = avg_sales
        
        # Calculate annual average
        annual_avg = sum(monthly_factors.values()) / 12
        
        if annual_avg == 0:
            return None
        
        # Convert to factors (1.0 = average)
        for month in monthly_factors:
            monthly_factors[month] = monthly_factors[month] / annual_avg
        
        return {
            'monthly_factors': monthly_factors,
            'is_seasonal': SalesVelocityService.detect_seasonality(product),
            'peak_month': max(monthly_factors, key=monthly_factors.get),
            'low_month': min(monthly_factors, key=monthly_factors.get),
        }

# Add to GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    seasonal_adjustment_enabled = models.BooleanField(
        default=True,
        help_text="Enable seasonal velocity adjustments"
    )
```

### Seasonal Profile Example
```python
profile = SalesVelocityService.get_seasonal_profile(product)
# Returns:
{
    'monthly_factors': {
        1: 0.8,   # January: 20% below average
        2: 0.9,
        ...
        12: 1.6   # December: 60% above average
    },
    'is_seasonal': True,
    'peak_month': 12,
    'low_month': 2
}
```

### Expected Outcome
- Velocity adjusted for seasonality
- Better forecast accuracy
- Seasonal profile per product

### Verification Checklist
- [ ] get_seasonal_factor() calculates
- [ ] get_monthly_sales() works
- [ ] apply_seasonality() adjusts velocity
- [ ] detect_seasonality() identifies patterns
- [ ] get_seasonal_profile() returns data
- [ ] seasonal_adjustment_enabled config added
- [ ] Year-over-year comparison works
- [ ] Factor clamped to reasonable range
