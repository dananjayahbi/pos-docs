# Tasks 64-68: Auto-Reorder & Forecasting

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** D - Reorder Suggestions & Automation  
> **Document:** 03 of 03  
> **Tasks Covered:** 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-58-63_Calculator-EOQ-Conversion.md](02_Tasks-58-63_Calculator-EOQ-Conversion.md)
- **→ Next Group:** [../Group-E_Serializers-API-Views/00_GROUP_OVERVIEW.md](../Group-E_Serializers-API-Views/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers optional automated reorder functionality, supplier lead time tracking, reorder reports, basic demand forecasting, and calendar visualization of expected stockouts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 64 | Implement auto-reorder (optional) | High |
| 65 | Add supplier lead time tracking | Medium |
| 66 | Create reorder report | Medium |
| 67 | Add demand forecasting (basic) | High |
| 68 | Create reorder calendar view | High |

---

## Task 64: Implement Auto-Reorder (Optional)

### Overview
Add optional functionality to automatically create and submit purchase orders when products hit reorder points, with appropriate safety controls.

### Dependencies
- Task 63: Suggestion to PO conversion
- Task 61: Days until stockout calculation

### Instructions

1. **Add auto_reorder configuration**
   - Enable/disable per tenant
   - Enable per product
   - Whitelist products/categories

2. **Add auto_reorder_enabled fields**
   - In GlobalStockSettings: Master switch
   - In ProductStockConfig: Per-product override
   - CategoryStockConfig: Per-category default

3. **Add auto_reorder_thresholds**
   - Only auto-order if urgency >= threshold
   - Default: HIGH or CRITICAL only
   - Prevent over-ordering

4. **Add auto_reorder_max_value**
   - Maximum LKR per auto-order
   - Require approval above limit
   - Safety control

5. **Create auto_reorder_task**
   - Run after suggestion generation
   - Filter eligible suggestions
   - Create and submit POs

6. **Add auto_reorder_notification**
   - Email when PO auto-created
   - Dashboard notification
   - SMS for critical items

### Auto-Reorder Implementation
```python
# Add to GlobalStockSettings model
class GlobalStockSettings(TenantAwareModel):
    # ... existing fields
    
    # Auto-Reorder Configuration
    auto_reorder_enabled = models.BooleanField(
        default=False,
        help_text="Enable automatic purchase order creation"
    )
    
    AUTO_REORDER_URGENCY_CHOICES = [
        ('critical', 'Critical Only'),
        ('high', 'High and Critical'),
        ('medium', 'Medium and above'),
    ]
    
    auto_reorder_min_urgency = models.CharField(
        max_length=20,
        choices=AUTO_REORDER_URGENCY_CHOICES,
        default='high',
        help_text="Minimum urgency level for auto-reorder"
    )
    
    auto_reorder_max_value_lkr = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=Decimal('100000.00'),
        help_text="Maximum LKR value per auto-generated PO"
    )
    
    auto_reorder_require_approval = models.BooleanField(
        default=True,
        help_text="Require approval before sending auto-generated POs"
    )

# Add to ProductStockConfig
class ProductStockConfig(TenantAwareModel):
    # ... existing fields
    
    allow_auto_reorder = models.BooleanField(
        default=False,
        help_text="Allow automatic reordering for this product"
    )

# Auto-reorder task
# apps/inventory/alerts/tasks/reorder_suggestions.py

@shared_task(bind=True)
def process_auto_reorders(self):
    """
    Process eligible reorder suggestions for automatic PO creation.
    
    Runs after generate_reorder_suggestions task.
    """
    from apps.inventory.alerts.models import ReorderSuggestion, GlobalStockSettings
    from apps.purchasing.models import PurchaseOrder
    
    logger.info("Starting auto-reorder processing")
    
    settings = GlobalStockSettings.get_settings()
    
    if not settings.auto_reorder_enabled:
        logger.info("Auto-reorder disabled")
        return {'status': 'disabled'}
    
    # Get eligible suggestions
    eligible = get_eligible_auto_reorder_suggestions(settings)
    
    logger.info(f"Found {len(eligible)} eligible suggestions for auto-reorder")
    
    pos_created = 0
    pos_value = Decimal('0')
    errors = 0
    
    for suggestion in eligible:
        try:
            # Validate before creating PO
            if not validate_auto_reorder(suggestion, settings):
                continue
            
            # Create PO
            po = create_auto_reorder_po(suggestion, settings)
            
            pos_created += 1
            pos_value += po.get_total()
            
            # Send notification
            send_auto_reorder_notification(po, suggestion)
            
        except Exception as e:
            logger.error(f"Error creating auto-reorder PO: {e}")
            errors += 1
    
    result = {
        'status': 'completed',
        'pos_created': pos_created,
        'total_value_lkr': float(pos_value),
        'errors': errors,
    }
    
    logger.info(
        f"Auto-reorder complete: {pos_created} POs created, "
        f"total value: LKR {pos_value:,.2f}"
    )
    
    return result


def get_eligible_auto_reorder_suggestions(settings):
    """
    Get suggestions eligible for auto-reorder.
    
    Returns:
        QuerySet: filtered suggestions
    """
    from apps.inventory.alerts.models import ReorderSuggestion
    
    # Base query: pending suggestions
    suggestions = ReorderSuggestion.objects.filter(
        status='pending'
    ).select_related(
        'product',
        'suggested_supplier'
    )
    
    # Filter by urgency
    urgency_threshold = settings.auto_reorder_min_urgency
    
    urgency_levels = {
        'critical': ['critical'],
        'high': ['critical', 'high'],
        'medium': ['critical', 'high', 'medium'],
    }
    
    allowed_urgencies = urgency_levels.get(urgency_threshold, ['critical'])
    suggestions = suggestions.filter(urgency__in=allowed_urgencies)
    
    # Filter by product config
    from apps.inventory.alerts.models import ProductStockConfig
    
    allowed_products = ProductStockConfig.objects.filter(
        allow_auto_reorder=True
    ).values_list('product_id', flat=True)
    
    suggestions = suggestions.filter(product_id__in=allowed_products)
    
    # Must have supplier
    suggestions = suggestions.filter(suggested_supplier__isnull=False)
    
    return list(suggestions)


def validate_auto_reorder(suggestion, settings):
    """
    Validate suggestion for auto-reorder.
    
    Returns:
        bool: True if valid for auto-reorder
    """
    # Check estimated cost
    if suggestion.estimated_cost > settings.auto_reorder_max_value_lkr:
        logger.warning(
            f"Suggestion {suggestion.id} exceeds max value "
            f"(LKR {suggestion.estimated_cost} > {settings.auto_reorder_max_value_lkr})"
        )
        return False
    
    # Check supplier is active
    if not suggestion.suggested_supplier.is_active:
        logger.warning(f"Supplier {suggestion.suggested_supplier} is inactive")
        return False
    
    # Check product is active
    if not suggestion.product.is_active:
        logger.warning(f"Product {suggestion.product.name} is inactive")
        return False
    
    return True


def create_auto_reorder_po(suggestion, settings):
    """
    Create purchase order from auto-reorder suggestion.
    
    Returns:
        PurchaseOrder: created PO
    """
    from apps.purchasing.models import PurchaseOrder, PurchaseOrderItem
    
    # Determine initial status
    if settings.auto_reorder_require_approval:
        initial_status = 'draft'
    else:
        initial_status = 'approved'
    
    # Create PO
    po = PurchaseOrder.objects.create(
        supplier=suggestion.suggested_supplier,
        destination_warehouse=suggestion.warehouse,
        status=initial_status,
        notes=(
            f"AUTO-GENERATED from reorder suggestion {suggestion.id}\n"
            f"Urgency: {suggestion.urgency.upper()}\n"
            f"Days until stockout: {suggestion.days_until_stockout}"
        ),
        is_auto_generated=True,
    )
    
    # Add item
    PurchaseOrderItem.objects.create(
        purchase_order=po,
        product=suggestion.product,
        variant=suggestion.variant,
        quantity=suggestion.suggested_qty,
        unit_price=suggestion.unit_cost or suggestion.product.cost_price,
        notes=f"Auto-reorder (suggested: {suggestion.suggested_qty} units)",
    )
    
    # Mark suggestion as converted
    suggestion.mark_converted(po)
    
    logger.info(
        f"Created auto-reorder PO {po.po_number} for {suggestion.product.name}"
    )
    
    return po


def send_auto_reorder_notification(po, suggestion):
    """Send notification about auto-generated PO."""
    from django.core.mail import send_mail
    from django.conf import settings as django_settings
    
    subject = f"Auto-Reorder PO Created: {po.po_number}"
    
    message = f"""
An automatic purchase order has been created:

PO Number: {po.po_number}
Product: {suggestion.product.name}
Quantity: {suggestion.suggested_qty} {suggestion.product.unit}
Supplier: {suggestion.suggested_supplier.name}
Estimated Cost: LKR {suggestion.estimated_cost:,.2f}

Urgency: {suggestion.urgency.upper()}
Days Until Stockout: {suggestion.days_until_stockout}

Status: {po.get_status_display()}

Please review in the system.
"""
    
    # Send to purchasing team
    recipient_list = ['purchasing@company.com']  # Configure per tenant
    
    send_mail(
        subject=subject,
        message=message,
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=True,
    )
```

### Auto-Reorder Safety Controls

| Control | Purpose | Default |
|---------|---------|---------|
| Master Switch | Enable/disable globally | OFF |
| Product Whitelist | Only allowed products | Empty (none) |
| Urgency Threshold | Minimum urgency | HIGH or CRITICAL |
| Max Value | Maximum LKR per PO | LKR 100,000 |
| Require Approval | POs need approval | ON |
| Supplier Validation | Active suppliers only | ON |

### Expected Outcome
- Optional automation for critical stock situations
- Safety controls prevent over-ordering
- Notifications keep team informed

### Verification Checklist
- [ ] auto_reorder configuration fields added
- [ ] allow_auto_reorder per product added
- [ ] process_auto_reorders task created
- [ ] get_eligible_auto_reorder_suggestions filters
- [ ] validate_auto_reorder checks safety
- [ ] create_auto_reorder_po works
- [ ] Notifications sent
- [ ] Safety controls enforced

---

## Task 65: Add Supplier Lead Time Tracking

### Overview
Track actual lead times from suppliers to improve reorder point calculations and supplier performance analysis.

### Dependencies
- Phase-05: PurchaseOrder model
- Task 60: Safety stock calculation

### Instructions

1. **Add lead_time_tracking to Supplier model**
   - average_lead_time_days: Calculated field
   - min_lead_time_days: Best case
   - max_lead_time_days: Worst case
   - lead_time_std_dev: Variability

2. **Create SupplierLeadTimeLog model**
   - Track each PO delivery
   - ordered_date, expected_date, actual_date
   - days_taken field
   - Link to PO and Supplier

3. **Add calculate_lead_time method**
   - Called when PO received
   - actual_date - ordered_date
   - Store in log

4. **Add update_supplier_stats method**
   - Recalculate average
   - Update min/max
   - Calculate std deviation
   - Last 30 deliveries

5. **Add get_supplier_lead_time method**
   - Used in reorder calculations
   - Return average ± std dev
   - Fall back to configured value

6. **Add lead_time_performance_report**
   - Compare expected vs actual
   - Identify late suppliers
   - Ranking by reliability

### Lead Time Tracking Implementation
```python
# Add to Supplier model (Phase-05)
class Supplier(TenantAwareModel):
    # ... existing fields
    
    # Lead Time Tracking
    average_lead_time_days = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Calculated average lead time"
    )
    
    min_lead_time_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Best case lead time"
    )
    
    max_lead_time_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Worst case lead time"
    )
    
    lead_time_std_dev = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Lead time standard deviation"
    )
    
    last_lead_time_update = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When stats last calculated"
    )
    
    def get_lead_time_for_product(self, product):
        """
        Get lead time for specific product.
        
        Returns:
            dict with avg, min, max, std_dev
        """
        # Check product-specific config first
        config = product.get_stock_config()
        
        if config and config.lead_time_days:
            return {
                'average': config.lead_time_days,
                'min': config.lead_time_days,
                'max': config.lead_time_days,
                'std_dev': 0,
                'source': 'product_config',
            }
        
        # Use supplier stats
        if self.average_lead_time_days:
            return {
                'average': float(self.average_lead_time_days),
                'min': self.min_lead_time_days,
                'max': self.max_lead_time_days,
                'std_dev': float(self.lead_time_std_dev or 0),
                'source': 'supplier_history',
            }
        
        # Fall back to configured value
        if self.default_lead_time_days:
            return {
                'average': self.default_lead_time_days,
                'min': self.default_lead_time_days,
                'max': self.default_lead_time_days,
                'std_dev': 0,
                'source': 'supplier_default',
            }
        
        # Default: 14 days
        return {
            'average': 14,
            'min': 14,
            'max': 14,
            'std_dev': 0,
            'source': 'system_default',
        }

# New model for tracking
class SupplierLeadTimeLog(TenantAwareModel):
    """
    Track actual lead times for supplier deliveries.
    
    Used to calculate supplier performance metrics.
    """
    
    purchase_order = models.ForeignKey(
        'purchasing.PurchaseOrder',
        on_delete=models.CASCADE,
        related_name='lead_time_logs'
    )
    
    supplier = models.ForeignKey(
        'suppliers.Supplier',
        on_delete=models.CASCADE,
        related_name='lead_time_logs'
    )
    
    product = models.ForeignKey(
        'inventory.Product',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Specific product if applicable"
    )
    
    ordered_date = models.DateField(
        help_text="When PO was placed"
    )
    
    expected_delivery_date = models.DateField(
        help_text="Expected delivery date"
    )
    
    actual_delivery_date = models.DateField(
        help_text="Actual delivery date"
    )
    
    days_taken = models.PositiveIntegerField(
        help_text="Actual days from order to delivery"
    )
    
    days_late = models.IntegerField(
        default=0,
        help_text="Days late (negative if early)"
    )
    
    on_time = models.BooleanField(
        default=True,
        help_text="Delivered on or before expected date"
    )
    
    notes = models.TextField(
        blank=True,
        help_text="Notes about delivery"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Supplier Lead Time Log"
        verbose_name_plural = "Supplier Lead Time Logs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['supplier', '-ordered_date']),
            models.Index(fields=['on_time']),
        ]
    
    def __str__(self):
        return f"{self.supplier.name} - {self.days_taken} days ({self.ordered_date})"
    
    def save(self, *args, **kwargs):
        """Calculate derived fields on save."""
        if not self.days_taken:
            self.days_taken = (self.actual_delivery_date - self.ordered_date).days
        
        if not self.days_late:
            self.days_late = (self.actual_delivery_date - self.expected_delivery_date).days
        
        self.on_time = self.actual_delivery_date <= self.expected_delivery_date
        
        super().save(*args, **kwargs)
        
        # Update supplier stats
        self.supplier.update_lead_time_stats()

# Service methods
def record_po_delivery(purchase_order):
    """
    Record delivery lead time when PO is received.
    
    Called from PO.mark_received() method.
    """
    if not purchase_order.received_date:
        return
    
    log = SupplierLeadTimeLog.objects.create(
        purchase_order=purchase_order,
        supplier=purchase_order.supplier,
        ordered_date=purchase_order.order_date or purchase_order.created_at.date(),
        expected_delivery_date=purchase_order.expected_delivery_date,
        actual_delivery_date=purchase_order.received_date,
    )
    
    logger.info(
        f"Recorded lead time: {log.supplier.name} - {log.days_taken} days "
        f"({'on time' if log.on_time else f'{abs(log.days_late)} days late'})"
    )
    
    return log

# Add to Supplier model
def update_lead_time_stats(self):
    """
    Recalculate lead time statistics from recent deliveries.
    
    Uses last 30 deliveries or 6 months, whichever is more.
    """
    from datetime import timedelta
    from statistics import mean, stdev
    
    cutoff_date = timezone.now() - timedelta(days=180)  # 6 months
    
    logs = self.lead_time_logs.filter(
        ordered_date__gte=cutoff_date
    ).order_by('-ordered_date')[:30]
    
    if not logs:
        logger.info(f"No lead time data for {self.name}")
        return
    
    days_list = [log.days_taken for log in logs]
    
    self.average_lead_time_days = Decimal(str(round(mean(days_list), 2)))
    self.min_lead_time_days = min(days_list)
    self.max_lead_time_days = max(days_list)
    
    if len(days_list) > 1:
        self.lead_time_std_dev = Decimal(str(round(stdev(days_list), 2)))
    else:
        self.lead_time_std_dev = Decimal('0')
    
    self.last_lead_time_update = timezone.now()
    self.save(update_fields=[
        'average_lead_time_days',
        'min_lead_time_days',
        'max_lead_time_days',
        'lead_time_std_dev',
        'last_lead_time_update'
    ])
    
    logger.info(
        f"Updated lead time stats for {self.name}: "
        f"avg={self.average_lead_time_days} days, "
        f"std_dev={self.lead_time_std_dev} days"
    )
```

### Lead Time Performance Report
```python
def get_supplier_performance_report(days=90):
    """
    Generate supplier performance report.
    
    Returns:
        list: suppliers ranked by on-time delivery rate
    """
    from django.db.models import Avg, Count, Q
    from datetime import timedelta
    
    cutoff = timezone.now() - timedelta(days=days)
    
    suppliers = Supplier.objects.annotate(
        deliveries=Count('lead_time_logs', filter=Q(lead_time_logs__ordered_date__gte=cutoff)),
        on_time_count=Count('lead_time_logs', filter=Q(
            lead_time_logs__ordered_date__gte=cutoff,
            lead_time_logs__on_time=True
        )),
        avg_days=Avg('lead_time_logs__days_taken', filter=Q(
            lead_time_logs__ordered_date__gte=cutoff
        )),
        avg_late=Avg('lead_time_logs__days_late', filter=Q(
            lead_time_logs__ordered_date__gte=cutoff
        ))
    ).filter(
        deliveries__gt=0
    )
    
    report = []
    
    for supplier in suppliers:
        on_time_rate = (supplier.on_time_count / supplier.deliveries) * 100 if supplier.deliveries > 0 else 0
        
        report.append({
            'supplier': supplier,
            'deliveries': supplier.deliveries,
            'on_time_rate': round(on_time_rate, 1),
            'avg_days': round(supplier.avg_days or 0, 1),
            'avg_late': round(supplier.avg_late or 0, 1),
            'reliability_score': round(on_time_rate, 1),
        })
    
    # Sort by on-time rate
    report.sort(key=lambda x: x['on_time_rate'], reverse=True)
    
    return report
```

### Expected Outcome
```
Supplier Performance (Last 90 Days):
┌────────────────────┬───────────┬─────────────┬──────────┬──────────┐
│ Supplier           │ Deliveries│ On-Time %   │ Avg Days │ Avg Late │
├────────────────────┼───────────┼─────────────┼──────────┼──────────┤
│ Supplier A         │ 24        │ 95.8%       │ 12.3     │ 0.5      │
│ Supplier B         │ 18        │ 88.9%       │ 14.7     │ 1.2      │
│ Supplier C         │ 31        │ 71.0%       │ 18.9     │ 3.7      │
└────────────────────┴───────────┴─────────────┴──────────┴──────────┘
```

### Verification Checklist
- [ ] Lead time fields added to Supplier
- [ ] SupplierLeadTimeLog model created
- [ ] record_po_delivery() logs deliveries
- [ ] update_lead_time_stats() calculates
- [ ] get_supplier_lead_time_for_product() works
- [ ] Performance report generates
- [ ] On-time tracking accurate
- [ ] Stats used in reorder calculations

---

## Task 66: Create Reorder Report

### Overview
Generate comprehensive report showing all current reorder suggestions, priorities, and expected stockouts.

### Dependencies
- Task 53: ReorderSuggestion model complete
- Task 61: Days until stockout

### Instructions

1. **Create reports.py service file**
   - Location: apps/inventory/alerts/services/
   - ReorderReportService class
   - Export functionality

2. **Add generate_reorder_report method**
   - All pending suggestions
   - Group by urgency/category/supplier
   - Calculate totals

3. **Add get_summary_statistics method**
   - Total suggestions
   - Total estimated cost
   - By urgency breakdown
   - Top categories

4. **Add export_to_excel method**
   - openpyxl library
   - Formatted Excel report
   - Multiple sheets

5. **Add export_to_pdf method**
   - weasyprint library
   - Professional PDF
   - Charts and tables

6. **Add schedule_weekly_report**
   - Email to management
   - Every Monday 8 AM
   - Summary + PDF attachment

### Reorder Report Service
```python
# apps/inventory/alerts/services/reports.py

from django.db.models import Sum, Count, Q
from django.utils import timezone
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class ReorderReportService:
    """
    Generate reports for reorder suggestions.
    """
    
    @staticmethod
    def generate_reorder_report(include_dismissed=False):
        """
        Generate comprehensive reorder report.
        
        Returns:
            dict with report data
        """
        from apps.inventory.alerts.models import ReorderSuggestion
        
        # Get suggestions
        suggestions = ReorderSuggestion.objects.filter(
            status='pending'
        ).select_related(
            'product',
            'product__category',
            'suggested_supplier',
            'warehouse'
        )
        
        if include_dismissed:
            suggestions = ReorderSuggestion.objects.all()
        
        # Summary statistics
        summary = ReorderReportService.get_summary_statistics(suggestions)
        
        # Group by urgency
        by_urgency = ReorderReportService.group_by_urgency(suggestions)
        
        # Group by category
        by_category = ReorderReportService.group_by_category(suggestions)
        
        # Group by supplier
        by_supplier = ReorderReportService.group_by_supplier(suggestions)
        
        # Top products by value
        top_by_value = list(suggestions.order_by('-estimated_cost')[:20])
        
        # Soonest stockouts
        soonest_stockouts = list(
            suggestions.filter(
                days_until_stockout__isnull=False
            ).order_by('days_until_stockout')[:20]
        )
        
        report = {
            'generated_at': timezone.now(),
            'summary': summary,
            'by_urgency': by_urgency,
            'by_category': by_category,
            'by_supplier': by_supplier,
            'top_by_value': top_by_value,
            'soonest_stockouts': soonest_stockouts,
        }
        
        return report
    
    @staticmethod
    def get_summary_statistics(suggestions):
        """Calculate summary statistics."""
        aggregated = suggestions.aggregate(
            total_count=Count('id'),
            total_cost=Sum('estimated_cost'),
            total_quantity=Sum('suggested_qty'),
            critical_count=Count('id', filter=Q(urgency='critical')),
            high_count=Count('id', filter=Q(urgency='high')),
            medium_count=Count('id', filter=Q(urgency='medium')),
            low_count=Count('id', filter=Q(urgency='low')),
        )
        
        return {
            'total_suggestions': aggregated['total_count'] or 0,
            'total_estimated_cost': aggregated['total_cost'] or Decimal('0'),
            'total_quantity': aggregated['total_quantity'] or Decimal('0'),
            'critical_count': aggregated['critical_count'] or 0,
            'high_count': aggregated['high_count'] or 0,
            'medium_count': aggregated['medium_count'] or 0,
            'low_count': aggregated['low_count'] or 0,
        }
    
    @staticmethod
    def group_by_urgency(suggestions):
        """Group suggestions by urgency level."""
        grouped = suggestions.values('urgency').annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost'),
            total_qty=Sum('suggested_qty')
        ).order_by('-urgency')
        
        return list(grouped)
    
    @staticmethod
    def group_by_category(suggestions):
        """Group suggestions by product category."""
        grouped = suggestions.values(
            'product__category__name'
        ).annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost'),
            total_qty=Sum('suggested_qty')
        ).order_by('-total_cost')
        
        return list(grouped)
    
    @staticmethod
    def group_by_supplier(suggestions):
        """Group suggestions by supplier."""
        grouped = suggestions.filter(
            suggested_supplier__isnull=False
        ).values(
            'suggested_supplier__name'
        ).annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost'),
            total_qty=Sum('suggested_qty')
        ).order_by('-total_cost')
        
        return list(grouped)
    
    @staticmethod
    def export_to_excel(report_data, filename='reorder_report.xlsx'):
        """
        Export report to Excel file.
        
        Requires: openpyxl
        """
        from openpyxl import Workbook
        from openpyxl.styles import Font, PatternFill
        
        wb = Workbook()
        
        # Summary sheet
        ws = wb.active
        ws.title = "Summary"
        
        # Headers
        ws['A1'] = "Reorder Report"
        ws['A1'].font = Font(size=16, bold=True)
        
        ws['A3'] = "Generated:"
        ws['B3'] = report_data['generated_at'].strftime('%Y-%m-%d %H:%M')
        
        # Summary statistics
        summary = report_data['summary']
        
        row = 5
        ws[f'A{row}'] = "Total Suggestions:"
        ws[f'B{row}'] = summary['total_suggestions']
        
        row += 1
        ws[f'A{row}'] = "Total Estimated Cost (LKR):"
        ws[f'B{row}'] = float(summary['total_estimated_cost'])
        
        row += 2
        ws[f'A{row}'] = "Critical:"
        ws[f'B{row}'] = summary['critical_count']
        
        # Add more sheets for detailed data
        # ... (implementation continues)
        
        wb.save(filename)
        logger.info(f"Excel report saved: {filename}")
        
        return filename
    
    @staticmethod
    def format_for_email(report_data):
        """
        Format report for email body.
        
        Returns:
            str: HTML email body
        """
        summary = report_data['summary']
        
        html = f"""
<html>
<body>
<h2>Weekly Reorder Report</h2>
<p>Generated: {report_data['generated_at'].strftime('%Y-%m-%d %H:%M')}</p>

<h3>Summary</h3>
<table border="1" cellpadding="5">
  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Total Suggestions</td>
    <td>{summary['total_suggestions']}</td>
  </tr>
  <tr>
    <td>Total Estimated Cost</td>
    <td>LKR {summary['total_estimated_cost']:,.2f}</td>
  </tr>
  <tr style="background-color: #ffcccc;">
    <td>Critical Urgency</td>
    <td>{summary['critical_count']}</td>
  </tr>
  <tr style="background-color: #ffffcc;">
    <td>High Urgency</td>
    <td>{summary['high_count']}</td>
  </tr>
  <tr>
    <td>Medium Urgency</td>
    <td>{summary['medium_count']}</td>
  </tr>
  <tr>
    <td>Low Urgency</td>
    <td>{summary['low_count']}</td>
  </tr>
</table>

<h3>Top 5 Soonest Stockouts</h3>
<ul>
"""
        
        for suggestion in report_data['soonest_stockouts'][:5]:
            html += f"""
  <li>{suggestion.product.name} - {suggestion.days_until_stockout} days</li>
"""
        
        html += """
</ul>

<p>Please review pending suggestions in the system.</p>
</body>
</html>
"""
        
        return html

# Celery task for weekly report
@shared_task
def send_weekly_reorder_report():
    """
    Generate and email weekly reorder report.
    
    Scheduled for Monday 8 AM.
    """
    from django.core.mail import EmailMessage
    
    logger.info("Generating weekly reorder report")
    
    # Generate report
    report_data = ReorderReportService.generate_reorder_report()
    
    # Format email
    email_body = ReorderReportService.format_for_email(report_data)
    
    # Create Excel attachment
    excel_file = ReorderReportService.export_to_excel(
        report_data,
        filename='/tmp/reorder_report.xlsx'
    )
    
    # Send email
    email = EmailMessage(
        subject='Weekly Reorder Report',
        body=email_body,
        from_email='system@company.com',
        to=['management@company.com'],
    )
    email.content_subtype = 'html'
    email.attach_file(excel_file)
    email.send()
    
    logger.info("Weekly reorder report sent")

# Add to Celery Beat schedule
CELERY_BEAT_SCHEDULE = {
    # ... existing tasks
    
    'weekly-reorder-report': {
        'task': 'apps.inventory.alerts.tasks.reports.send_weekly_reorder_report',
        'schedule': crontab(day_of_week=1, hour=8, minute=0),  # Monday 8 AM
    },
}
```

### Expected Outcome
```
WEEKLY REORDER REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: 2025-01-22 08:00

SUMMARY:
  Total Suggestions: 47
  Total Estimated Cost: LKR 2,345,670.00
  
  Critical:  8
  High:     15
  Medium:   18
  Low:       6

TOP 5 SOONEST STOCKOUTS:
  1. Product A - 2 days
  2. Product B - 3 days
  3. Product C - 5 days
  4. Product D - 7 days
  5. Product E - 9 days

TOP 5 BY VALUE:
  1. Product X - LKR 345,000
  2. Product Y - LKR 289,500
  3. Product Z - LKR 178,900
```

### Verification Checklist
- [ ] reports.py service created
- [ ] generate_reorder_report() works
- [ ] get_summary_statistics() calculates
- [ ] Grouping methods implemented
- [ ] Excel export functional
- [ ] Email formatting works
- [ ] Weekly report task scheduled
- [ ] Report comprehensive and useful

---

## Task 67: Add Demand Forecasting (Basic)

### Overview
Implement basic demand forecasting using historical sales data to improve reorder quantity recommendations.

### Dependencies
- Task 54-57: SalesVelocityService
- Task 59: EOQ calculation

### Instructions

1. **Create forecasting.py service file**
   - Location: apps/inventory/alerts/services/
   - DemandForecastService class
   - Statistical methods

2. **Add forecast_demand method**
   - Simple moving average
   - Weighted moving average
   - Exponential smoothing

3. **Add calculate_moving_average method**
   - 30/60/90 day averages
   - Trend detection
   - Return forecast

4. **Add exponential_smoothing method**
   - Alpha parameter (0.3 default)
   - Smooth fluctuations
   - Better for volatile products

5. **Add detect_seasonality_pattern method**
   - Identify seasonal products
   - Monthly/quarterly patterns
   - Adjust forecasts

6. **Add forecast_accuracy_tracking**
   - Compare forecast vs actual
   - MAPE (Mean Absolute Percentage Error)
   - Improve models

### Demand Forecasting Implementation
```python
# apps/inventory/alerts/services/forecasting.py

from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
import logging
from statistics import mean

logger = logging.getLogger(__name__)


class DemandForecastService:
    """
    Basic demand forecasting for inventory planning.
    
    Uses simple statistical methods for short-term forecasts.
    """
    
    @staticmethod
    def forecast_demand(product, days_ahead=30, method='exponential_smoothing'):
        """
        Forecast demand for product.
        
        Args:
            product: Product instance
            days_ahead: Days to forecast
            method: 'moving_average', 'weighted', or 'exponential_smoothing'
        
        Returns:
            dict with forecast data
        """
        # Get historical data
        historical = DemandForecastService.get_historical_sales(
            product=product,
            days=90
        )
        
        if not historical:
            logger.warning(f"No historical data for {product.name}")
            return None
        
        # Apply forecasting method
        if method == 'moving_average':
            forecast = DemandForecastService.calculate_moving_average(historical, days_ahead)
        elif method == 'weighted':
            forecast = DemandForecastService.weighted_moving_average(historical, days_ahead)
        else:
            forecast = DemandForecastService.exponential_smoothing(historical, days_ahead)
        
        # Apply seasonality if detected
        if DemandForecastService.detect_seasonality(product):
            forecast = DemandForecastService.apply_seasonal_adjustment(forecast, product)
        
        return forecast
    
    @staticmethod
    def get_historical_sales(product, days=90):
        """
        Get daily sales data for historical period.
        
        Returns:
            list of dicts with date and quantity
        """
        from apps.orders.models import OrderItem
        from django.db.models import Sum
        from django.db.models.functions import TruncDate
        
        cutoff = timezone.now() - timedelta(days=days)
        
        daily_sales = OrderItem.objects.filter(
            product=product,
            order__status__in=['completed', 'delivered'],
            order__created_at__gte=cutoff
        ).annotate(
            date=TruncDate('order__created_at')
        ).values('date').annotate(
            quantity=Sum('quantity')
        ).order_by('date')
        
        return list(daily_sales)
    
    @staticmethod
    def calculate_moving_average(historical, days_ahead, window=30):
        """
        Simple moving average forecast.
        
        Formula: Average of last N days
        """
        if len(historical) < window:
            window = len(historical)
        
        # Get last N days
        recent = historical[-window:]
        quantities = [day['quantity'] for day in recent]
        
        avg_daily = mean([float(q) for q in quantities])
        
        # Forecast for period
        forecast_total = avg_daily * days_ahead
        
        return {
            'method': 'moving_average',
            'window_days': window,
            'avg_daily': Decimal(str(round(avg_daily, 3))),
            'forecast_total': Decimal(str(round(forecast_total, 3))),
            'forecast_days': days_ahead,
            'confidence': 'medium',
        }
    
    @staticmethod
    def weighted_moving_average(historical, days_ahead, window=30):
        """
        Weighted moving average - recent days weighted more.
        
        Weights: [1, 2, 3, ..., N]
        """
        if len(historical) < window:
            window = len(historical)
        
        recent = historical[-window:]
        quantities = [float(day['quantity']) for day in recent]
        
        # Generate weights (more weight to recent)
        weights = list(range(1, len(quantities) + 1))
        total_weight = sum(weights)
        
        # Calculate weighted average
        weighted_sum = sum(q * w for q, w in zip(quantities, weights))
        weighted_avg = weighted_sum / total_weight
        
        forecast_total = weighted_avg * days_ahead
        
        return {
            'method': 'weighted_moving_average',
            'window_days': window,
            'avg_daily': Decimal(str(round(weighted_avg, 3))),
            'forecast_total': Decimal(str(round(forecast_total, 3))),
            'forecast_days': days_ahead,
            'confidence': 'medium',
        }
    
    @staticmethod
    def exponential_smoothing(historical, days_ahead, alpha=0.3):
        """
        Exponential smoothing forecast.
        
        Formula: S_t = α × X_t + (1 - α) × S_{t-1}
        
        Args:
            alpha: Smoothing parameter (0-1), higher = more reactive
        """
        quantities = [float(day['quantity']) for day in historical]
        
        # Initialize with first value
        smoothed = [quantities[0]]
        
        # Calculate smoothed values
        for i in range(1, len(quantities)):
            s_t = alpha * quantities[i] + (1 - alpha) * smoothed[i - 1]
            smoothed.append(s_t)
        
        # Last smoothed value is forecast
        forecast_daily = smoothed[-1]
        forecast_total = forecast_daily * days_ahead
        
        return {
            'method': 'exponential_smoothing',
            'alpha': alpha,
            'avg_daily': Decimal(str(round(forecast_daily, 3))),
            'forecast_total': Decimal(str(round(forecast_total, 3))),
            'forecast_days': days_ahead,
            'confidence': 'high',
        }
    
    @staticmethod
    def detect_seasonality(product):
        """
        Detect if product has seasonal pattern.
        
        Uses coefficient of variation from SalesVelocityService.
        """
        from apps.inventory.alerts.services.sales_velocity import SalesVelocityService
        
        return SalesVelocityService.detect_seasonality(product)
    
    @staticmethod
    def apply_seasonal_adjustment(forecast, product):
        """Apply seasonal factor to forecast."""
        from apps.inventory.alerts.services.sales_velocity import SalesVelocityService
        
        seasonal_factor = SalesVelocityService.get_seasonal_factor(product)
        
        forecast['avg_daily'] *= Decimal(str(seasonal_factor))
        forecast['forecast_total'] *= Decimal(str(seasonal_factor))
        forecast['seasonal_adjusted'] = True
        forecast['seasonal_factor'] = seasonal_factor
        
        return forecast
    
    @staticmethod
    def calculate_forecast_accuracy(product, days=30):
        """
        Calculate forecast accuracy (MAPE).
        
        MAPE = Mean Absolute Percentage Error
        
        Compares forecast from N days ago to actual sales.
        """
        # Get forecast from N days ago
        # (Would need to store forecasts to compare)
        
        # Get actual sales
        # Calculate MAPE
        
        # For now, return placeholder
        return {
            'mape': None,
            'message': 'Forecast tracking not yet implemented'
        }
```

### Forecasting Methods Comparison

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| Moving Average | Stable products | Simple, reliable | Slow to react to changes |
| Weighted MA | Products with trends | More responsive | Can overreact |
| Exponential Smoothing | Most products | Balanced, proven | Needs parameter tuning |

### Expected Outcome
```python
forecast = DemandForecastService.forecast_demand(product, days_ahead=30)
# Returns:
{
    'method': 'exponential_smoothing',
    'alpha': 0.3,
    'avg_daily': Decimal('5.234'),
    'forecast_total': Decimal('157.02'),
    'forecast_days': 30,
    'confidence': 'high',
    'seasonal_adjusted': True,
    'seasonal_factor': 1.15
}
```

### Verification Checklist
- [ ] forecasting.py service created
- [ ] forecast_demand() method works
- [ ] calculate_moving_average() implemented
- [ ] weighted_moving_average() works
- [ ] exponential_smoothing() calculates
- [ ] detect_seasonality() identifies patterns
- [ ] apply_seasonal_adjustment() adjusts
- [ ] Forecasts reasonable and useful

---

## Task 68: Create Reorder Calendar View

### Overview
Create calendar visualization showing expected stockout dates to help with procurement planning.

### Dependencies
- Task 61: Days until stockout calculation
- Task 67: Demand forecasting

### Instructions

1. **Create calendar view data structure**
   - Month grid with dates
   - Stockout events per day
   - Color-coded by urgency

2. **Add get_stockout_calendar method**
   - Query suggestions with dates
   - Group by day
   - Return calendar data

3. **Add calendar_events_for_month method**
   - Specific month/year
   - All stockout dates
   - Product details

4. **Add calendar_export_ical method**
   - iCal format
   - Import to calendar apps
   - Reminders

5. **Create calendar frontend component**
   - Full calendar.js integration
   - Interactive view
   - Click for details

### Calendar Service Implementation
```python
# Add to ReorderReportService or create calendar.py

class ReorderCalendarService:
    """
    Generate calendar view of expected stockouts.
    """
    
    @staticmethod
    def get_stockout_calendar(year=None, month=None):
        """
        Get stockout events for calendar display.
        
        Args:
            year: Year (default: current)
            month: Month 1-12 (default: current)
        
        Returns:
            dict with calendar data
        """
        from apps.inventory.alerts.models import ReorderSuggestion
        from apps.inventory.alerts.services.reorder_calculator import ReorderCalculator
        import calendar
        
        if year is None:
            year = timezone.now().year
        if month is None:
            month = timezone.now().month
        
        # Get month date range
        _, last_day = calendar.monthrange(year, month)
        start_date = timezone.datetime(year, month, 1).date()
        end_date = timezone.datetime(year, month, last_day).date()
        
        # Get suggestions with stockout dates in range
        suggestions = ReorderSuggestion.objects.filter(
            status='pending',
            days_until_stockout__isnull=False
        ).select_related('product')
        
        # Calculate stockout dates
        events_by_date = {}
        
        for suggestion in suggestions:
            stockout_date = ReorderCalculator.get_stockout_date(
                current_stock=suggestion.current_stock,
                daily_velocity=suggestion.daily_velocity,
                product=suggestion.product
            )
            
            if stockout_date:
                date_key = stockout_date.date()
                
                if start_date <= date_key <= end_date:
                    if date_key not in events_by_date:
                        events_by_date[date_key] = []
                    
                    events_by_date[date_key].append({
                        'product': suggestion.product.name,
                        'sku': suggestion.product.sku,
                        'urgency': suggestion.urgency,
                        'current_stock': float(suggestion.current_stock),
                        'suggested_qty': float(suggestion.suggested_qty),
                        'suggestion_id': suggestion.id,
                    })
        
        # Build calendar structure
        cal_data = {
            'year': year,
            'month': month,
            'month_name': calendar.month_name[month],
            'events_by_date': events_by_date,
            'total_events': sum(len(events) for events in events_by_date.values()),
        }
        
        return cal_data
    
    @staticmethod
    def export_to_ical(days_ahead=90):
        """
        Export stockout dates to iCal format.
        
        Can be imported to calendar applications.
        """
        from icalendar import Calendar, Event
        from apps.inventory.alerts.models import ReorderSuggestion
        from apps.inventory.alerts.services.reorder_calculator import ReorderCalculator
        
        cal = Calendar()
        cal.add('prodid', '-//Stock Reorder Calendar//EN')
        cal.add('version', '2.0')
        cal.add('calname', 'Stock Reorder Schedule')
        
        # Get suggestions
        suggestions = ReorderSuggestion.objects.filter(
            status='pending',
            days_until_stockout__isnull=False,
            days_until_stockout__lte=days_ahead
        ).select_related('product')
        
        for suggestion in suggestions:
            stockout_date = ReorderCalculator.get_stockout_date(
                current_stock=suggestion.current_stock,
                daily_velocity=suggestion.daily_velocity,
                product=suggestion.product
            )
            
            if stockout_date:
                event = Event()
                event.add('summary', f"Stockout: {suggestion.product.name}")
                event.add('dtstart', stockout_date.date())
                event.add('dtend', stockout_date.date())
                event.add('description', 
                    f"Product: {suggestion.product.name}\n"
                    f"SKU: {suggestion.product.sku}\n"
                    f"Current Stock: {suggestion.current_stock}\n"
                    f"Suggested Reorder: {suggestion.suggested_qty} units\n"
                    f"Urgency: {suggestion.urgency.upper()}"
                )
                event.add('categories', ['STOCK', 'REORDER', suggestion.urgency.upper()])
                event.add('priority', {
                    'critical': 1,
                    'high': 3,
                    'medium': 5,
                    'low': 7
                }.get(suggestion.urgency, 5))
                
                cal.add_component(event)
        
        return cal.to_ical()
```

### Calendar Data Structure
```json
{
  "year": 2025,
  "month": 2,
  "month_name": "February",
  "total_events": 12,
  "events_by_date": {
    "2025-02-05": [
      {
        "product": "Widget A",
        "sku": "WID-A-001",
        "urgency": "critical",
        "current_stock": 15.0,
        "suggested_qty": 200.0,
        "suggestion_id": 123
      }
    ],
    "2025-02-12": [
      {
        "product": "Product B",
        "urgency": "high",
        ...
      },
      {
        "product": "Product C",
        "urgency": "medium",
        ...
      }
    ]
  }
}
```

### Expected Outcome
```
FEBRUARY 2025 - REORDER CALENDAR
┌────┬────┬────┬────┬────┬────┬────┐
│Mon │Tue │Wed │Thu │Fri │Sat │Sun │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │    │  1 │  2 │
├────┼────┼────┼────┼────┼────┼────┤
│  3 │  4 │🔴5 │  6 │  7 │  8 │  9 │
│    │    │ 1  │    │    │    │    │
├────┼────┼────┼────┼────┼────┼────┤
│ 10 │ 11 │🟡12│ 13 │ 14 │ 15 │ 16 │
│    │    │ 2  │    │    │    │    │
└────┴────┴────┴────┴────┴────┴────┘

Legend:
🔴 Critical (< 5 days)
🟡 High (5-15 days)
🟢 Medium/Low (> 15 days)

Number = Count of products running out
```

### Verification Checklist
- [ ] get_stockout_calendar() implemented
- [ ] calendar_events_for_month() works
- [ ] Events grouped by date
- [ ] Urgency color-coding defined
- [ ] export_to_ical() generates iCal
- [ ] Calendar data structure correct
- [ ] Frontend component created (in Group E)
- [ ] Interactive and useful

---

## Summary

Group D is now complete! This group implemented:

1. **ReorderSuggestion Model** - Store automated reorder recommendations
2. **SalesVelocityService** - Calculate sales rates with seasonality adjustments
3. **ReorderCalculator** - Calculate optimal order quantities using EOQ and safety stock
4. **Reorder Task** - Automated daily suggestion generation
5. **PO Conversion** - Convert suggestions to purchase orders
6. **Auto-Reorder** - Optional automation with safety controls
7. **Lead Time Tracking** - Monitor supplier performance
8. **Reports** - Comprehensive reorder reports with Excel/PDF export
9. **Forecasting** - Basic demand forecasting using statistical methods
10. **Calendar View** - Visual timeline of expected stockouts

### Next Steps

Proceed to **Group E: Serializers & API Views** to create the API endpoints for accessing and managing alerts and reorder suggestions.
