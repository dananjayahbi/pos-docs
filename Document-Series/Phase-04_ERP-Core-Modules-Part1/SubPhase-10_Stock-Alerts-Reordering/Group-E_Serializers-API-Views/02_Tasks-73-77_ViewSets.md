# Tasks 73-77: ViewSets & Custom Actions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** E - Serializers & API Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-72_Serializers.md](01_Tasks-69-72_Serializers.md)
- **→ Next Document:** [03_Tasks-78-80_Additional-Endpoints.md](03_Tasks-78-80_Additional-Endpoints.md)

---

## Document Overview

This document covers Django REST Framework ViewSets with custom actions for stock configuration, alerts, and reorder suggestions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 73 | Create ProductStockConfigViewSet | Medium |
| 74 | Create StockAlertViewSet with Actions | High |
| 75 | Create ReorderSuggestionViewSet | High |
| 76 | Create Alert Dashboard Endpoint | Medium |
| 77 | Create Product Alerts Endpoint | Medium |

---

## Task 73: Create ProductStockConfigViewSet

### Overview
Create ViewSet for CRUD operations on ProductStockConfig with filtering and permissions.

### Dependencies
- Phase-03: DRF setup
- Task 69: ProductStockConfigSerializer

### Instructions

1. **Create views directory**
   - Location: apps/inventory/alerts/views/
   - Create __init__.py
   - Create config.py file

2. **Create ProductStockConfigViewSet**
   - Inherit from ModelViewSet
   - Full CRUD operations
   - Pagination enabled

3. **Add filtering capabilities**
   - FilterSet for common filters
   - Search by product name/SKU
   - Filter by warehouse
   - Filter by excluded status

4. **Add permissions**
   - IsAuthenticated required
   - inventory.view_stockconfig
   - inventory.change_stockconfig

5. **Add custom queryset optimization**
   - select_related for product/warehouse
   - Tenant filtering applied
   - Ordering by product name

6. **Add bulk operations support**
   - Allow multiple updates
   - Validation for each item
   - Transaction handling

### ViewSet Implementation
```python
# apps/inventory/alerts/views/__init__.py
from .config import ProductStockConfigViewSet, GlobalStockSettingsViewSet
from .alert import StockAlertViewSet, AlertDashboardView
from .reorder import ReorderSuggestionViewSet

__all__ = [
    'ProductStockConfigViewSet',
    'GlobalStockSettingsViewSet',
    'StockAlertViewSet',
    'AlertDashboardView',
    'ReorderSuggestionViewSet',
]

# apps/inventory/alerts/views/config.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as django_filters
from django.db import transaction

from apps.inventory.alerts.models import ProductStockConfig, GlobalStockSettings
from apps.inventory.alerts.serializers import (
    ProductStockConfigSerializer,
    GlobalStockSettingsSerializer
)
from apps.core.permissions import TenantPermission


class ProductStockConfigFilter(django_filters.FilterSet):
    """Filter set for ProductStockConfig."""
    
    product_name = django_filters.CharFilter(
        field_name='product__name',
        lookup_expr='icontains'
    )
    product_sku = django_filters.CharFilter(
        field_name='product__sku',
        lookup_expr='iexact'
    )
    warehouse = django_filters.NumberFilter(field_name='warehouse_id')
    excluded = django_filters.BooleanFilter(field_name='exclude_from_monitoring')
    
    has_low_stock_threshold = django_filters.BooleanFilter(
        method='filter_has_threshold'
    )
    
    class Meta:
        model = ProductStockConfig
        fields = ['product_name', 'product_sku', 'warehouse', 'excluded']
    
    def filter_has_threshold(self, queryset, name, value):
        """Filter by whether low_stock_threshold is set."""
        if value:
            return queryset.exclude(low_stock_threshold__isnull=True)
        else:
            return queryset.filter(low_stock_threshold__isnull=True)


class ProductStockConfigViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing ProductStockConfig.
    
    Provides CRUD operations with filtering and bulk updates.
    
    Endpoints:
        GET    /api/stock-config/           - List configs
        POST   /api/stock-config/           - Create config
        GET    /api/stock-config/{id}/      - Retrieve config
        PUT    /api/stock-config/{id}/      - Update config
        PATCH  /api/stock-config/{id}/      - Partial update
        DELETE /api/stock-config/{id}/      - Delete config
    """
    
    queryset = ProductStockConfig.objects.all()
    serializer_class = ProductStockConfigSerializer
    permission_classes = [IsAuthenticated, TenantPermission]
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = ProductStockConfigFilter
    search_fields = ['product__name', 'product__sku', 'exclusion_reason']
    ordering_fields = ['product__name', 'low_stock_threshold', 'reorder_point', 'created_at']
    ordering = ['product__name']
    
    def get_queryset(self):
        """Optimize queryset with related data."""
        queryset = super().get_queryset()
        
        # Optimize queries
        queryset = queryset.select_related(
            'product',
            'product__category',
            'warehouse',
            'preferred_supplier'
        )
        
        # Apply tenant filtering
        # (Handled by TenantPermission and django-tenants)
        
        return queryset
    
    def perform_create(self, serializer):
        """Create stock config with audit trail."""
        serializer.save()
    
    def perform_update(self, serializer):
        """Update stock config with audit trail."""
        serializer.save()
    
    def perform_destroy(self, instance):
        """Delete stock config."""
        # Check if there are active alerts
        if instance.product.stock_alerts.filter(status='active').exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                "Cannot delete config with active alerts. Resolve alerts first."
            )
        
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get summary statistics for stock configurations.
        
        GET /api/stock-config/summary/
        
        Returns counts by status and configuration coverage.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        summary = {
            'total_configs': queryset.count(),
            'with_thresholds': queryset.exclude(low_stock_threshold__isnull=True).count(),
            'with_reorder_points': queryset.exclude(reorder_point__isnull=True).count(),
            'excluded_from_monitoring': queryset.filter(exclude_from_monitoring=True).count(),
            'by_warehouse': {},
        }
        
        # Group by warehouse
        from django.db.models import Count
        by_warehouse = queryset.values('warehouse__name').annotate(
            count=Count('id')
        ).order_by('-count')
        
        for item in by_warehouse:
            warehouse_name = item['warehouse__name'] or 'All Warehouses'
            summary['by_warehouse'][warehouse_name] = item['count']
        
        return Response(summary)
    
    @action(detail=True, methods=['post'])
    def reset_to_defaults(self, request, pk=None):
        """
        Reset configuration to inherit from category/global.
        
        POST /api/stock-config/{id}/reset_to_defaults/
        
        Clears all product-specific overrides.
        """
        config = self.get_object()
        
        # Clear overrides
        config.low_stock_threshold = None
        config.reorder_point = None
        config.reorder_quantity = None
        config.auto_hide_when_oos = None
        config.allow_backorder = None
        config.save()
        
        serializer = self.get_serializer(config)
        return Response(serializer.data)


class GlobalStockSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for GlobalStockSettings.
    
    Typically only one instance exists per tenant.
    """
    
    queryset = GlobalStockSettings.objects.all()
    serializer_class = GlobalStockSettingsSerializer
    permission_classes = [IsAuthenticated, TenantPermission]
    
    def list(self, request, *args, **kwargs):
        """
        Override list to return single settings object.
        
        GET /api/global-settings/
        
        Returns the tenant's global settings (creates if not exists).
        """
        settings, created = GlobalStockSettings.objects.get_or_create()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
```

### API Endpoint Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stock-config/ | List all stock configs |
| POST | /api/stock-config/ | Create new config |
| GET | /api/stock-config/{id}/ | Get specific config |
| PUT | /api/stock-config/{id}/ | Update config |
| PATCH | /api/stock-config/{id}/ | Partial update |
| DELETE | /api/stock-config/{id}/ | Delete config |
| GET | /api/stock-config/summary/ | Get statistics |
| POST | /api/stock-config/{id}/reset_to_defaults/ | Reset to inherited values |

### Verification Checklist
- [ ] views directory created
- [ ] config.py file created
- [ ] ProductStockConfigViewSet defined
- [ ] ProductStockConfigFilter implemented
- [ ] Permissions configured
- [ ] Queryset optimized
- [ ] summary action works
- [ ] reset_to_defaults action works
- [ ] GlobalStockSettingsViewSet created

---

## Task 74: Create StockAlertViewSet with Actions

### Overview
Create ViewSet for StockAlert with custom actions: acknowledge, snooze, resolve.

### Dependencies
- Task 70: StockAlertSerializer
- Group B: StockAlert model

### Instructions

1. **Create alert.py file**
   - Location: apps/inventory/alerts/views/
   - Import serializers and services

2. **Create StockAlertViewSet**
   - Read-only by default
   - Custom actions for lifecycle
   - List/retrieve/filter

3. **Add acknowledge action**
   - POST /api/alerts/{id}/acknowledge/
   - Set acknowledged_at and user
   - Return updated alert

4. **Add snooze action**
   - POST /api/alerts/{id}/snooze/
   - Accept snoozed_until datetime
   - Validate future date

5. **Add resolve action**
   - POST /api/alerts/{id}/resolve/
   - Set status to resolved
   - Record resolved_at

6. **Add bulk acknowledge action**
   - POST /api/alerts/bulk_acknowledge/
   - Accept list of IDs
   - Return count

7. **Add filtering**
   - By alert_type
   - By status
   - By priority range
   - By warehouse
   - By date range

### Alert ViewSet Implementation
```python
# apps/inventory/alerts/views/alert.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as django_filters
from django.utils import timezone
from django.db import transaction

from apps.inventory.alerts.models import StockAlert
from apps.inventory.alerts.serializers import (
    StockAlertSerializer,
    StockAlertListSerializer,
    AlertDashboardSerializer
)
from apps.core.permissions import TenantPermission


class StockAlertFilter(django_filters.FilterSet):
    """Filter set for StockAlert."""
    
    alert_type = django_filters.ChoiceFilter(
        choices=StockAlert.ALERT_TYPES
    )
    status = django_filters.ChoiceFilter(
        choices=StockAlert.ALERT_STATUS
    )
    priority_min = django_filters.NumberFilter(
        field_name='priority',
        lookup_expr='gte'
    )
    priority_max = django_filters.NumberFilter(
        field_name='priority',
        lookup_expr='lte'
    )
    warehouse = django_filters.NumberFilter(field_name='warehouse_id')
    product = django_filters.NumberFilter(field_name='product_id')
    
    created_after = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='gte'
    )
    created_before = django_filters.DateTimeFilter(
        field_name='created_at',
        lookup_expr='lte'
    )
    
    is_acknowledged = django_filters.BooleanFilter(
        method='filter_acknowledged'
    )
    is_snoozed = django_filters.BooleanFilter(
        method='filter_snoozed'
    )
    
    class Meta:
        model = StockAlert
        fields = [
            'alert_type',
            'status',
            'priority_min',
            'priority_max',
            'warehouse',
            'product'
        ]
    
    def filter_acknowledged(self, queryset, name, value):
        """Filter by acknowledged status."""
        if value:
            return queryset.exclude(acknowledged_at__isnull=True)
        else:
            return queryset.filter(acknowledged_at__isnull=True)
    
    def filter_snoozed(self, queryset, name, value):
        """Filter by currently snoozed."""
        now = timezone.now()
        if value:
            return queryset.filter(snoozed_until__gt=now)
        else:
            return queryset.filter(
                models.Q(snoozed_until__isnull=True) |
                models.Q(snoozed_until__lte=now)
            )


class StockAlertViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for StockAlert with lifecycle actions.
    
    Read-only for list/retrieve, with custom actions for state changes.
    
    Endpoints:
        GET  /api/alerts/                      - List alerts
        GET  /api/alerts/{id}/                 - Get alert
        POST /api/alerts/{id}/acknowledge/     - Acknowledge alert
        POST /api/alerts/{id}/snooze/          - Snooze alert
        POST /api/alerts/{id}/resolve/         - Resolve alert
        POST /api/alerts/bulk_acknowledge/     - Bulk acknowledge
    """
    
    queryset = StockAlert.objects.all()
    permission_classes = [IsAuthenticated, TenantPermission]
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = StockAlertFilter
    search_fields = ['product__name', 'product__sku', 'message']
    ordering_fields = ['created_at', 'priority', 'acknowledged_at', 'resolved_at']
    ordering = ['-priority', '-created_at']
    
    def get_serializer_class(self):
        """Use lightweight serializer for lists."""
        if self.action == 'list':
            return StockAlertListSerializer
        return StockAlertSerializer
    
    def get_queryset(self):
        """Optimize queryset with related data."""
        queryset = super().get_queryset()
        
        # Optimize queries
        queryset = queryset.select_related(
            'product',
            'warehouse',
            'acknowledged_by'
        )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """
        Acknowledge an alert.
        
        POST /api/alerts/{id}/acknowledge/
        
        Marks alert as acknowledged by current user.
        """
        alert = self.get_object()
        
        # Check if already acknowledged
        if alert.acknowledged_at:
            return Response(
                {'error': 'Alert already acknowledged'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if alert is active
        if alert.status != 'active':
            return Response(
                {'error': 'Only active alerts can be acknowledged'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Acknowledge
        alert.acknowledged_at = timezone.now()
        alert.acknowledged_by = request.user
        alert.status = 'acknowledged'
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def snooze(self, request, pk=None):
        """
        Snooze an alert until specified time.
        
        POST /api/alerts/{id}/snooze/
        Body: {"snoozed_until": "2025-01-25T10:00:00Z"}
        
        Temporarily hides alert from active list.
        """
        alert = self.get_object()
        
        # Get snooze time from request
        snoozed_until = request.data.get('snoozed_until')
        if not snoozed_until:
            return Response(
                {'error': 'snoozed_until is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate datetime format
        try:
            from django.utils.dateparse import parse_datetime
            snooze_dt = parse_datetime(snoozed_until)
            if not snooze_dt:
                raise ValueError("Invalid datetime")
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid datetime format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if future date
        if snooze_dt <= timezone.now():
            return Response(
                {'error': 'Snooze time must be in the future'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if alert can be snoozed
        if alert.status != 'active':
            return Response(
                {'error': 'Only active alerts can be snoozed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Snooze
        alert.snoozed_until = snooze_dt
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """
        Resolve an alert manually.
        
        POST /api/alerts/{id}/resolve/
        
        Marks alert as resolved.
        """
        alert = self.get_object()
        
        # Check if alert can be resolved
        if alert.status not in ['active', 'acknowledged']:
            return Response(
                {'error': 'Alert cannot be resolved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Resolve
        alert.status = 'resolved'
        alert.resolved_at = timezone.now()
        alert.save()
        
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_acknowledge(self, request):
        """
        Acknowledge multiple alerts at once.
        
        POST /api/alerts/bulk_acknowledge/
        Body: {"alert_ids": [1, 2, 3]}
        
        Returns count of acknowledged alerts.
        """
        alert_ids = request.data.get('alert_ids', [])
        
        if not alert_ids or not isinstance(alert_ids, list):
            return Response(
                {'error': 'alert_ids list is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update in transaction
        with transaction.atomic():
            updated = StockAlert.objects.filter(
                id__in=alert_ids,
                status='active',
                acknowledged_at__isnull=True
            ).update(
                acknowledged_at=timezone.now(),
                acknowledged_by=request.user,
                status='acknowledged'
            )
        
        return Response({
            'acknowledged_count': updated,
            'message': f'{updated} alerts acknowledged'
        })
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get alert statistics.
        
        GET /api/alerts/statistics/
        
        Returns aggregated counts and trends.
        """
        from django.db.models import Count, Q
        from datetime import timedelta
        
        queryset = self.filter_queryset(self.get_queryset())
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        stats = {
            'total_active': queryset.filter(status='active').count(),
            'total_acknowledged': queryset.filter(status='acknowledged').count(),
            'total_resolved': queryset.filter(status='resolved').count(),
            'created_today': queryset.filter(created_at__gte=today_start).count(),
            'resolved_today': queryset.filter(
                resolved_at__gte=today_start
            ).count(),
            'by_type': {},
            'by_priority': {
                'critical': queryset.filter(priority__gte=8).count(),
                'high': queryset.filter(priority__range=(6, 7)).count(),
                'medium': queryset.filter(priority__range=(4, 5)).count(),
                'low': queryset.filter(priority__lte=3).count(),
            }
        }
        
        # Group by type
        by_type = queryset.values('alert_type').annotate(
            count=Count('id')
        )
        for item in by_type:
            stats['by_type'][item['alert_type']] = item['count']
        
        return Response(stats)
```

### Custom Action Summary

| Action | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| acknowledge | POST | /api/alerts/{id}/acknowledge/ | Mark alert as seen |
| snooze | POST | /api/alerts/{id}/snooze/ | Temporarily hide |
| resolve | POST | /api/alerts/{id}/resolve/ | Mark as resolved |
| bulk_acknowledge | POST | /api/alerts/bulk_acknowledge/ | Acknowledge multiple |
| statistics | GET | /api/alerts/statistics/ | Get aggregated stats |

### Verification Checklist
- [ ] alert.py file created
- [ ] StockAlertViewSet defined
- [ ] StockAlertFilter implemented
- [ ] acknowledge action works
- [ ] snooze action validates datetime
- [ ] resolve action works
- [ ] bulk_acknowledge handles multiple IDs
- [ ] statistics action aggregates data
- [ ] Permissions enforced

---

## Task 75: Create ReorderSuggestionViewSet

### Overview
Create ViewSet for ReorderSuggestion with convert-to-PO and dismiss actions.

### Dependencies
- Task 71: ReorderSuggestionSerializer
- Group D: ReorderSuggestion model

### Instructions

1. **Create reorder.py file**
   - Location: apps/inventory/alerts/views/
   - Import serializers and services

2. **Create ReorderSuggestionViewSet**
   - Read-only list/retrieve
   - Custom actions for conversion
   - Filter by urgency/status

3. **Add convert_to_po action**
   - POST /api/reorder/{id}/convert_to_po/
   - Create PurchaseOrder
   - Update suggestion status
   - Return PO details

4. **Add dismiss action**
   - POST /api/reorder/{id}/dismiss/
   - Accept dismissal_reason
   - Set status to dismissed

5. **Add bulk_convert action**
   - POST /api/reorder/bulk_convert/
   - Group by supplier
   - Create multiple POs
   - Return summary

6. **Add filtering**
   - By urgency level
   - By status
   - By warehouse
   - By supplier
   - By expiration

### Reorder ViewSet Implementation
```python
# apps/inventory/alerts/views/reorder.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as django_filters
from django.db import transaction
from django.utils import timezone

from apps.inventory.alerts.models import ReorderSuggestion
from apps.inventory.alerts.serializers import (
    ReorderSuggestionSerializer,
    ReorderSuggestionListSerializer
)
from apps.core.permissions import TenantPermission


class ReorderSuggestionFilter(django_filters.FilterSet):
    """Filter set for ReorderSuggestion."""
    
    urgency = django_filters.ChoiceFilter(
        choices=ReorderSuggestion.URGENCY_LEVELS
    )
    status = django_filters.ChoiceFilter(
        choices=ReorderSuggestion.SUGGESTION_STATUS
    )
    warehouse = django_filters.NumberFilter(field_name='warehouse_id')
    supplier = django_filters.NumberFilter(field_name='suggested_supplier_id')
    product = django_filters.NumberFilter(field_name='product_id')
    
    min_cost = django_filters.NumberFilter(
        field_name='estimated_cost',
        lookup_expr='gte'
    )
    max_cost = django_filters.NumberFilter(
        field_name='estimated_cost',
        lookup_expr='lte'
    )
    
    is_expired = django_filters.BooleanFilter(
        method='filter_expired'
    )
    
    class Meta:
        model = ReorderSuggestion
        fields = ['urgency', 'status', 'warehouse', 'supplier', 'product']
    
    def filter_expired(self, queryset, name, value):
        """Filter by expiration status."""
        from datetime import timedelta
        expiry_days = 30
        cutoff = timezone.now() - timedelta(days=expiry_days)
        
        if value:
            return queryset.filter(
                status='pending',
                created_at__lt=cutoff
            )
        else:
            return queryset.exclude(
                status='pending',
                created_at__lt=cutoff
            )


class ReorderSuggestionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for ReorderSuggestion with conversion actions.
    
    Endpoints:
        GET  /api/reorder/                   - List suggestions
        GET  /api/reorder/{id}/              - Get suggestion
        POST /api/reorder/{id}/convert_to_po/ - Convert to PO
        POST /api/reorder/{id}/dismiss/      - Dismiss suggestion
        POST /api/reorder/bulk_convert/      - Bulk convert
    """
    
    queryset = ReorderSuggestion.objects.all()
    permission_classes = [IsAuthenticated, TenantPermission]
    filter_backends = [
        django_filters.DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = ReorderSuggestionFilter
    search_fields = ['product__name', 'product__sku', 'notes']
    ordering_fields = ['created_at', 'days_until_stockout', 'estimated_cost', 'urgency']
    ordering = ['-urgency', 'days_until_stockout']
    
    def get_serializer_class(self):
        """Use lightweight serializer for lists."""
        if self.action == 'list':
            return ReorderSuggestionListSerializer
        return ReorderSuggestionSerializer
    
    def get_queryset(self):
        """Optimize queryset with related data."""
        queryset = super().get_queryset()
        
        # Optimize queries
        queryset = queryset.select_related(
            'product',
            'warehouse',
            'suggested_supplier',
            'converted_po'
        )
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def convert_to_po(self, request, pk=None):
        """
        Convert suggestion to Purchase Order.
        
        POST /api/reorder/{id}/convert_to_po/
        Body: {
            "supplier_id": 12,       // Optional, overrides suggested
            "notes": "Urgent order", // Optional
            "delivery_date": "2025-02-15" // Optional
        }
        
        Creates PO and marks suggestion as converted.
        """
        suggestion = self.get_object()
        
        # Check if can convert
        can_convert, reason = suggestion.can_convert()
        if not can_convert:
            return Response(
                {'error': reason},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get supplier (allow override)
        supplier_id = request.data.get('supplier_id', suggestion.suggested_supplier_id)
        if not supplier_id:
            return Response(
                {'error': 'Supplier is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.purchasing.services.po_converter import POConverter
            
            with transaction.atomic():
                # Convert to PO
                po = POConverter.convert_suggestion_to_po(
                    suggestion=suggestion,
                    supplier_id=supplier_id,
                    notes=request.data.get('notes'),
                    delivery_date=request.data.get('delivery_date')
                )
                
                # Update suggestion
                suggestion.status = 'converted'
                suggestion.converted_po = po
                suggestion.status_changed_at = timezone.now()
                suggestion.save()
            
            # Return PO details
            from apps.purchasing.serializers import PurchaseOrderSerializer
            po_serializer = PurchaseOrderSerializer(po)
            
            return Response({
                'message': 'Suggestion converted to Purchase Order',
                'purchase_order': po_serializer.data,
                'suggestion': self.get_serializer(suggestion).data
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def dismiss(self, request, pk=None):
        """
        Dismiss a reorder suggestion.
        
        POST /api/reorder/{id}/dismiss/
        Body: {"reason": "Already ordered manually"}
        
        Marks suggestion as dismissed.
        """
        suggestion = self.get_object()
        
        # Check if can dismiss
        if suggestion.status != 'pending':
            return Response(
                {'error': 'Only pending suggestions can be dismissed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get dismissal reason
        reason = request.data.get('reason', '')
        
        # Dismiss
        suggestion.status = 'dismissed'
        suggestion.dismissal_reason = reason
        suggestion.status_changed_at = timezone.now()
        suggestion.save()
        
        serializer = self.get_serializer(suggestion)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_convert(self, request):
        """
        Convert multiple suggestions to POs.
        
        POST /api/reorder/bulk_convert/
        Body: {
            "suggestion_ids": [1, 2, 3],
            "group_by_supplier": true  // Optional, default true
        }
        
        Creates POs grouped by supplier.
        """
        suggestion_ids = request.data.get('suggestion_ids', [])
        group_by_supplier = request.data.get('group_by_supplier', True)
        
        if not suggestion_ids:
            return Response(
                {'error': 'suggestion_ids list is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get suggestions
        suggestions = self.get_queryset().filter(
            id__in=suggestion_ids,
            status='pending'
        )
        
        if not suggestions.exists():
            return Response(
                {'error': 'No valid suggestions found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.purchasing.services.po_converter import POConverter
            
            with transaction.atomic():
                result = POConverter.bulk_convert_suggestions(
                    suggestions=suggestions,
                    group_by_supplier=group_by_supplier
                )
            
            return Response({
                'message': 'Suggestions converted successfully',
                'pos_created': result['pos_created'],
                'suggestions_converted': result['suggestions_converted'],
                'purchase_orders': result['po_numbers']
            })
        
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get reorder suggestion summary.
        
        GET /api/reorder/summary/
        
        Returns counts by urgency and status.
        """
        from django.db.models import Count, Sum
        
        queryset = self.filter_queryset(self.get_queryset())
        
        summary = {
            'total_pending': queryset.filter(status='pending').count(),
            'total_converted': queryset.filter(status='converted').count(),
            'total_dismissed': queryset.filter(status='dismissed').count(),
            'by_urgency': {},
            'total_estimated_cost': 0,
        }
        
        # Group by urgency
        by_urgency = queryset.filter(status='pending').values('urgency').annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost')
        )
        
        for item in by_urgency:
            summary['by_urgency'][item['urgency']] = {
                'count': item['count'],
                'total_cost': float(item['total_cost'] or 0)
            }
            summary['total_estimated_cost'] += float(item['total_cost'] or 0)
        
        return Response(summary)
```

### Custom Action Summary

| Action | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| convert_to_po | POST | /api/reorder/{id}/convert_to_po/ | Create PO from suggestion |
| dismiss | POST | /api/reorder/{id}/dismiss/ | Dismiss suggestion |
| bulk_convert | POST | /api/reorder/bulk_convert/ | Convert multiple suggestions |
| summary | GET | /api/reorder/summary/ | Get summary statistics |

### Verification Checklist
- [ ] reorder.py file created
- [ ] ReorderSuggestionViewSet defined
- [ ] ReorderSuggestionFilter implemented
- [ ] convert_to_po action works
- [ ] dismiss action works
- [ ] bulk_convert handles multiple suggestions
- [ ] summary action aggregates data
- [ ] Transaction handling implemented
- [ ] Error handling complete

---

## Task 76: Create Alert Dashboard Endpoint

### Overview
Create dedicated endpoint for dashboard widget showing alert summary.

### Dependencies
- Task 72: AlertDashboardSerializer
- Group B: StockAlert manager methods

### Instructions

1. **Add to alert.py file**
   - Use APIView or custom action
   - No model instance required

2. **Create AlertDashboardView**
   - GET /api/alerts/dashboard/
   - Return aggregated statistics
   - Use AlertDashboardSerializer

3. **Aggregate data sources**
   - Total counts by status
   - Counts by type
   - Counts by priority
   - Recent alerts (last 5)
   - Products at risk (top 10)

4. **Add caching**
   - Cache for 5 minutes
   - Invalidate on new alerts
   - Use Redis cache

5. **Add permissions**
   - IsAuthenticated
   - dashboard.view_alerts

### Dashboard View Implementation
```python
# Add to apps/inventory/alerts/views/alert.py

from rest_framework.views import APIView
from django.core.cache import cache
from django.db.models import Count, Q
from datetime import timedelta


class AlertDashboardView(APIView):
    """
    Dashboard endpoint for alert summary.
    
    GET /api/alerts/dashboard/
    
    Returns aggregated statistics and recent activity.
    """
    
    permission_classes = [IsAuthenticated, TenantPermission]
    
    def get(self, request):
        """Get dashboard data."""
        
        # Try cache first
        cache_key = f'alert_dashboard_{request.tenant.id}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Build dashboard data
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Base queryset
        alerts = StockAlert.objects.select_related('product', 'warehouse')
        
        # Summary statistics
        total_active = alerts.filter(status='active').count()
        total_acknowledged = alerts.filter(status='acknowledged').count()
        total_snoozed = alerts.filter(
            status='active',
            snoozed_until__gt=now
        ).count()
        total_resolved_today = alerts.filter(
            resolved_at__gte=today_start
        ).count()
        
        # By type
        by_type = {}
        type_counts = alerts.filter(status='active').values('alert_type').annotate(
            count=Count('id')
        )
        for item in type_counts:
            by_type[item['alert_type']] = item['count']
        
        # By priority
        by_priority = {
            'critical': alerts.filter(status='active', priority__gte=8).count(),
            'high': alerts.filter(status='active', priority__range=(6, 7)).count(),
            'medium': alerts.filter(status='active', priority__range=(4, 5)).count(),
            'low': alerts.filter(status='active', priority__lte=3).count(),
        }
        
        # By warehouse
        by_warehouse = {}
        warehouse_counts = alerts.filter(status='active').values(
            'warehouse__name'
        ).annotate(count=Count('id'))
        for item in warehouse_counts:
            warehouse_name = item['warehouse__name'] or 'All Warehouses'
            by_warehouse[warehouse_name] = item['count']
        
        # Recent alerts
        recent_alerts = alerts.order_by('-created_at')[:5]
        recent_alerts_data = StockAlertListSerializer(recent_alerts, many=True).data
        
        # Recent resolutions
        recent_resolutions = alerts.filter(
            status='resolved'
        ).order_by('-resolved_at')[:5]
        recent_resolutions_data = StockAlertListSerializer(recent_resolutions, many=True).data
        
        # Products at risk (multiple active alerts or high priority)
        from django.db.models import Max
        products_at_risk = alerts.filter(
            status='active'
        ).values(
            'product_id',
            'product__name',
            'product__sku'
        ).annotate(
            alert_count=Count('id'),
            highest_priority=Max('priority')
        ).order_by('-highest_priority', '-alert_count')[:10]
        
        products_at_risk_data = []
        for item in products_at_risk:
            # Get current stock
            from apps.inventory.models import StockLevel
            stock = StockLevel.objects.filter(
                product_id=item['product_id']
            ).first()
            
            # Calculate days until stockout
            suggestion = ReorderSuggestion.objects.filter(
                product_id=item['product_id'],
                status='pending'
            ).first()
            
            products_at_risk_data.append({
                'product_id': item['product_id'],
                'product_name': item['product__name'],
                'sku': item['product__sku'],
                'alert_count': item['alert_count'],
                'highest_priority': item['highest_priority'],
                'current_stock': float(stock.quantity) if stock else 0,
                'days_until_stockout': float(suggestion.days_until_stockout) if suggestion else None
            })
        
        # Build response
        dashboard_data = {
            'total_active_alerts': total_active,
            'total_acknowledged': total_acknowledged,
            'total_snoozed': total_snoozed,
            'total_resolved_today': total_resolved_today,
            'by_type': by_type,
            'by_priority': by_priority,
            'by_warehouse': by_warehouse,
            'recent_alerts': recent_alerts_data,
            'recent_resolutions': recent_resolutions_data,
            'products_at_risk': products_at_risk_data,
            'last_updated': now,
            'monitoring_status': 'active'
        }
        
        # Serialize and validate
        serializer = AlertDashboardSerializer(data=dashboard_data)
        serializer.is_valid(raise_exception=True)
        
        # Cache for 5 minutes
        cache.set(cache_key, serializer.data, 300)
        
        return Response(serializer.data)
```

### Verification Checklist
- [ ] AlertDashboardView added to alert.py
- [ ] Dashboard aggregation implemented
- [ ] Recent alerts included
- [ ] Products at risk calculated
- [ ] Caching implemented
- [ ] Permissions configured
- [ ] Response serialized correctly

---

## Task 77: Create Product Alerts Endpoint

### Overview
Create endpoint to get all alerts for a specific product.

### Dependencies
- Task 70: StockAlertSerializer
- Task 74: StockAlertViewSet

### Instructions

1. **Add custom action to ProductViewSet**
   - Location: apps/inventory/views.py
   - Or create separate endpoint

2. **Create product alerts endpoint**
   - GET /api/products/{id}/alerts/
   - Return all alerts for product
   - Include warehouse breakdown

3. **Add filtering**
   - Filter by warehouse
   - Filter by status
   - Filter by date range

4. **Add alert history**
   - Include resolved alerts
   - Show resolution timeline
   - Alert frequency stats

5. **Add response structure**
   - Current active alerts
   - Alert history
   - Alert statistics
   - Reorder suggestions

### Product Alerts Implementation
```python
# Add to apps/inventory/views.py (ProductViewSet)

from apps.inventory.alerts.models import StockAlert, ReorderSuggestion
from apps.inventory.alerts.serializers import (
    StockAlertListSerializer,
    ReorderSuggestionListSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model."""
    
    # ... existing code ...
    
    @action(detail=True, methods=['get'])
    def alerts(self, request, pk=None):
        """
        Get all alerts for a product.
        
        GET /api/products/{id}/alerts/
        Query params:
            - warehouse: Filter by warehouse ID
            - status: Filter by status (active/acknowledged/resolved)
            - days: Number of days of history (default 30)
        
        Returns current alerts, history, and statistics.
        """
        product = self.get_object()
        
        # Get query params
        warehouse_id = request.query_params.get('warehouse')
        alert_status = request.query_params.get('status')
        days = int(request.query_params.get('days', 30))
        
        # Build base queryset
        alerts = StockAlert.objects.filter(product=product)
        
        # Apply filters
        if warehouse_id:
            alerts = alerts.filter(warehouse_id=warehouse_id)
        
        if alert_status:
            alerts = alerts.filter(status=alert_status)
        
        # Date range
        from datetime import timedelta
        cutoff_date = timezone.now() - timedelta(days=days)
        history = alerts.filter(created_at__gte=cutoff_date)
        
        # Current active alerts
        active_alerts = alerts.filter(
            status__in=['active', 'acknowledged']
        ).order_by('-priority', '-created_at')
        
        # Alert history
        resolved_alerts = alerts.filter(
            status='resolved',
            resolved_at__gte=cutoff_date
        ).order_by('-resolved_at')[:20]
        
        # Statistics
        from django.db.models import Count, Avg
        stats = {
            'total_active': active_alerts.count(),
            'total_resolved_period': resolved_alerts.count(),
            'by_type': {},
            'avg_resolution_time_hours': 0,
        }
        
        # By type
        type_counts = history.values('alert_type').annotate(count=Count('id'))
        for item in type_counts:
            stats['by_type'][item['alert_type']] = item['count']
        
        # Average resolution time
        resolved_with_time = resolved_alerts.filter(
            acknowledged_at__isnull=False
        )
        
        if resolved_with_time.exists():
            total_seconds = 0
            count = 0
            for alert in resolved_with_time:
                if alert.resolved_at and alert.acknowledged_at:
                    delta = alert.resolved_at - alert.acknowledged_at
                    total_seconds += delta.total_seconds()
                    count += 1
            
            if count > 0:
                avg_seconds = total_seconds / count
                stats['avg_resolution_time_hours'] = round(avg_seconds / 3600, 2)
        
        # Get reorder suggestions
        reorder_suggestions = ReorderSuggestion.objects.filter(
            product=product,
            status='pending'
        ).order_by('-urgency', 'days_until_stockout')
        
        # Build response
        response_data = {
            'product_id': product.id,
            'product_name': product.name,
            'product_sku': product.sku,
            'active_alerts': StockAlertListSerializer(active_alerts, many=True).data,
            'recent_history': StockAlertListSerializer(resolved_alerts, many=True).data,
            'reorder_suggestions': ReorderSuggestionListSerializer(reorder_suggestions, many=True).data,
            'statistics': stats,
            'period_days': days
        }
        
        return Response(response_data)
```

### Expected Response Structure
```json
{
  "product_id": 456,
  "product_name": "Widget A",
  "product_sku": "WID-A-001",
  "active_alerts": [
    {
      "id": 789,
      "alert_type": "low_stock",
      "status": "active",
      "priority": 5,
      "created_at": "2025-01-22T08:30:00Z"
    }
  ],
  "recent_history": [
    {
      "id": 788,
      "alert_type": "low_stock",
      "status": "resolved",
      "resolved_at": "2025-01-21T10:15:00Z"
    }
  ],
  "reorder_suggestions": [
    {
      "id": 234,
      "suggested_qty": "200.000",
      "urgency": "high",
      "days_until_stockout": "8.50"
    }
  ],
  "statistics": {
    "total_active": 1,
    "total_resolved_period": 5,
    "by_type": {
      "low_stock": 4,
      "critical_stock": 2
    },
    "avg_resolution_time_hours": 12.5
  },
  "period_days": 30
}
```

### Verification Checklist
- [ ] alerts action added to ProductViewSet
- [ ] Query parameter filtering works
- [ ] Active alerts returned
- [ ] Alert history included
- [ ] Statistics calculated
- [ ] Reorder suggestions included
- [ ] Response structure complete

---

## Summary

All ViewSets and custom actions for Group E Tasks 73-77 are now complete:

1. **ProductStockConfigViewSet** - CRUD with summary and reset actions
2. **GlobalStockSettingsViewSet** - Single settings endpoint
3. **StockAlertViewSet** - Read-only with acknowledge/snooze/resolve actions
4. **ReorderSuggestionViewSet** - Read-only with convert-to-PO and dismiss actions
5. **AlertDashboardView** - Dashboard widget endpoint
6. **Product Alerts Endpoint** - Product-specific alert history

### API Endpoints Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/stock-config/ | GET/POST | List/create configs |
| /api/stock-config/{id}/ | GET/PUT/DELETE | Retrieve/update/delete |
| /api/stock-config/summary/ | GET | Statistics |
| /api/alerts/ | GET | List alerts |
| /api/alerts/{id}/acknowledge/ | POST | Acknowledge alert |
| /api/alerts/{id}/snooze/ | POST | Snooze alert |
| /api/alerts/{id}/resolve/ | POST | Resolve alert |
| /api/alerts/bulk_acknowledge/ | POST | Bulk acknowledge |
| /api/alerts/dashboard/ | GET | Dashboard summary |
| /api/reorder/ | GET | List suggestions |
| /api/reorder/{id}/convert_to_po/ | POST | Convert to PO |
| /api/reorder/{id}/dismiss/ | POST | Dismiss suggestion |
| /api/reorder/bulk_convert/ | POST | Bulk convert |
| /api/products/{id}/alerts/ | GET | Product alert history |

### Next Steps

Proceed to **Tasks 78-80: Additional Endpoints** for bulk operations, reports, and stock health scoring.
