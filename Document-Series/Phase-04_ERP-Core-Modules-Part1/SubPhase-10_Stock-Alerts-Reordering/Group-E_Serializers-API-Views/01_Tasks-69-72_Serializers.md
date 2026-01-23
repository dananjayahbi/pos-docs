# Tasks 69-72: DRF Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** E - Serializers & API Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Reorder-Suggestions-Automation/03_Tasks-64-68_Auto-Reorder-Forecasting.md](../Group-D_Reorder-Suggestions-Automation/03_Tasks-64-68_Auto-Reorder-Forecasting.md)
- **→ Next Document:** [02_Tasks-73-77_ViewSets.md](02_Tasks-73-77_ViewSets.md)

---

## Document Overview

This document covers Django REST Framework serializers for stock configuration, alerts, reorder suggestions, and dashboard data.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 69 | Create ProductStockConfigSerializer | Medium |
| 70 | Create StockAlertSerializer | Medium |
| 71 | Create ReorderSuggestionSerializer | Medium |
| 72 | Create AlertDashboardSerializer | Medium |

---

## Task 69: Create ProductStockConfigSerializer

### Overview
Create DRF serializer for ProductStockConfig with nested product data and effective configuration calculations.

### Dependencies
- Phase-03: Django REST Framework setup
- Group A: ProductStockConfig model

### Instructions

1. **Create serializers directory**
   - Location: apps/inventory/alerts/serializers/
   - Create __init__.py
   - Create config.py file

2. **Create ProductStockConfigSerializer**
   - Include all config fields
   - Nest product and warehouse data
   - Add effective_config method field

3. **Add nested serializers**
   - ProductSummarySerializer: id, name, sku
   - WarehouseSummarySerializer: id, name, code
   - Read-only nested data

4. **Add effective_config field**
   - SerializerMethodField
   - Call get_effective_config()
   - Show inherited values

5. **Add validation methods**
   - validate_low_stock_threshold
   - validate_reorder_quantity
   - Ensure logical values

6. **Add create/update methods**
   - Handle nested relationships
   - Call ConfigResolver after save
   - Return complete data

### Serializer Implementation
```python
# apps/inventory/alerts/serializers/__init__.py
from .config import ProductStockConfigSerializer, GlobalStockSettingsSerializer
from .alert import StockAlertSerializer, AlertDashboardSerializer
from .reorder import ReorderSuggestionSerializer

__all__ = [
    'ProductStockConfigSerializer',
    'GlobalStockSettingsSerializer',
    'StockAlertSerializer',
    'AlertDashboardSerializer',
    'ReorderSuggestionSerializer',
]

# apps/inventory/alerts/serializers/config.py
from rest_framework import serializers
from apps.inventory.alerts.models import (
    ProductStockConfig,
    CategoryStockConfig,
    WarehouseStockConfig,
    GlobalStockSettings
)
from apps.inventory.models import Product, Warehouse
from apps.inventory.alerts.services.config_resolver import ConfigResolver
from decimal import Decimal


class ProductSummarySerializer(serializers.ModelSerializer):
    """Minimal product info for nesting."""
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'unit']
        read_only_fields = fields


class WarehouseSummarySerializer(serializers.ModelSerializer):
    """Minimal warehouse info for nesting."""
    
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'code']
        read_only_fields = fields


class ProductStockConfigSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductStockConfig with effective configuration.
    
    Includes inherited values from category and global settings.
    """
    
    # Nested read-only fields
    product = ProductSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True, allow_null=True)
    
    # Write-only ID fields
    product_id = serializers.IntegerField(write_only=True)
    warehouse_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    # Calculated field
    effective_config = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductStockConfig
        fields = [
            'id',
            'product',
            'product_id',
            'warehouse',
            'warehouse_id',
            'low_stock_threshold',
            'reorder_point',
            'reorder_quantity',
            'auto_hide_when_oos',
            'allow_backorder',
            'minimum_order_quantity',
            'preferred_supplier',
            'lead_time_days',
            'exclude_from_monitoring',
            'exclusion_reason',
            'effective_config',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'effective_config']
    
    def get_effective_config(self, obj):
        """
        Get effective configuration including inherited values.
        
        Returns dict with all config values and their sources.
        """
        product = obj.product
        warehouse = obj.warehouse
        
        effective = ConfigResolver.get_effective_config(
            product=product,
            warehouse=warehouse
        )
        
        return {
            'low_stock_threshold': {
                'value': float(effective.low_stock_threshold) if effective.low_stock_threshold else None,
                'source': self._get_config_source(obj, 'low_stock_threshold'),
            },
            'reorder_point': {
                'value': float(effective.reorder_point) if effective.reorder_point else None,
                'source': self._get_config_source(obj, 'reorder_point'),
            },
            'reorder_quantity': {
                'value': float(effective.reorder_quantity) if effective.reorder_quantity else None,
                'source': self._get_config_source(obj, 'reorder_quantity'),
            },
            'auto_hide_when_oos': {
                'value': effective.auto_hide_when_oos,
                'source': self._get_config_source(obj, 'auto_hide_when_oos'),
            },
            'allow_backorder': {
                'value': effective.allow_backorder,
                'source': self._get_config_source(obj, 'allow_backorder'),
            },
        }
    
    def _get_config_source(self, obj, field_name):
        """Determine where config value comes from."""
        if getattr(obj, field_name, None) is not None:
            return 'product'
        
        # Check category
        category_config = obj.product.category.stock_config if obj.product.category else None
        if category_config and getattr(category_config, field_name, None) is not None:
            return 'category'
        
        # Check warehouse
        if obj.warehouse:
            warehouse_config = WarehouseStockConfig.objects.filter(warehouse=obj.warehouse).first()
            if warehouse_config and getattr(warehouse_config, field_name, None) is not None:
                return 'warehouse'
        
        return 'global'
    
    def validate_low_stock_threshold(self, value):
        """Validate low stock threshold is positive."""
        if value is not None and value < 0:
            raise serializers.ValidationError("Low stock threshold must be >= 0")
        return value
    
    def validate_reorder_quantity(self, value):
        """Validate reorder quantity is positive."""
        if value is not None and value <= 0:
            raise serializers.ValidationError("Reorder quantity must be > 0")
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # If both low_stock_threshold and reorder_point are set,
        # reorder_point should be >= low_stock_threshold
        low_threshold = data.get('low_stock_threshold')
        reorder_point = data.get('reorder_point')
        
        if low_threshold and reorder_point and reorder_point < low_threshold:
            raise serializers.ValidationError(
                "Reorder point should be >= low stock threshold"
            )
        
        return data
    
    def create(self, validated_data):
        """Create stock config."""
        instance = super().create(validated_data)
        return instance
    
    def update(self, instance, validated_data):
        """Update stock config."""
        instance = super().update(instance, validated_data)
        return instance


class GlobalStockSettingsSerializer(serializers.ModelSerializer):
    """Serializer for GlobalStockSettings."""
    
    class Meta:
        model = GlobalStockSettings
        fields = [
            'id',
            'default_low_stock_threshold',
            'default_reorder_point',
            'default_reorder_quantity',
            'default_auto_hide_when_oos',
            'default_allow_backorder',
            'monitoring_frequency',
            'monitoring_start_hour',
            'monitoring_end_hour',
            'use_eoq_calculation',
            'ordering_cost_lkr',
            'holding_cost_percent',
            'target_service_level',
            'safety_stock_days',
            'auto_reorder_enabled',
            'auto_reorder_min_urgency',
            'auto_reorder_max_value_lkr',
            'seasonal_adjustment_enabled',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

### Expected API Response
```json
{
  "id": 123,
  "product": {
    "id": 456,
    "name": "Widget A",
    "sku": "WID-A-001",
    "unit": "pcs"
  },
  "warehouse": null,
  "low_stock_threshold": "20.000",
  "reorder_point": "50.000",
  "reorder_quantity": "200.000",
  "auto_hide_when_oos": true,
  "allow_backorder": false,
  "effective_config": {
    "low_stock_threshold": {
      "value": 20.0,
      "source": "product"
    },
    "reorder_point": {
      "value": 50.0,
      "source": "category"
    },
    "auto_hide_when_oos": {
      "value": true,
      "source": "global"
    }
  },
  "created_at": "2025-01-20T10:30:00Z",
  "updated_at": "2025-01-21T15:45:00Z"
}
```

### Verification Checklist
- [ ] serializers directory created
- [ ] config.py file created
- [ ] ProductStockConfigSerializer defined
- [ ] Nested serializers implemented
- [ ] effective_config field works
- [ ] Validation methods added
- [ ] create/update methods work
- [ ] __init__.py exports serializers

---

## Task 70: Create StockAlertSerializer

### Overview
Create DRF serializer for StockAlert with product/warehouse nesting and calculated fields.

### Dependencies
- Group B: StockAlert model
- Task 69: ProductSummarySerializer

### Instructions

1. **Create alert.py file**
   - Location: apps/inventory/alerts/serializers/
   - Import models and base serializers

2. **Create StockAlertSerializer**
   - All alert fields
   - Nested product/warehouse
   - Read-only calculated fields

3. **Add nested relationships**
   - Use ProductSummarySerializer
   - Use WarehouseSummarySerializer
   - acknowledged_by user info

4. **Add calculated fields**
   - alert_type_display: Human-readable
   - status_display: Human-readable
   - priority_display: Mapped to text
   - is_snoozed: Boolean check

5. **Add custom actions fields**
   - can_acknowledge: Boolean
   - can_resolve: Boolean
   - can_snooze: Boolean

6. **Add validation**
   - validate_snoozed_until: Future date
   - validate_priority: 1-10 range

### Alert Serializer Implementation
```python
# apps/inventory/alerts/serializers/alert.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.inventory.alerts.models import StockAlert
from .config import ProductSummarySerializer, WarehouseSummarySerializer

User = get_user_model()


class UserSummarySerializer(serializers.ModelSerializer):
    """Minimal user info for nesting."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = fields


class StockAlertSerializer(serializers.ModelSerializer):
    """
    Serializer for StockAlert with nested relationships.
    
    Includes human-readable displays and action availability flags.
    """
    
    # Nested read-only fields
    product = ProductSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True, allow_null=True)
    acknowledged_by = UserSummarySerializer(read_only=True, allow_null=True)
    
    # Human-readable displays
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Calculated fields
    is_snoozed = serializers.SerializerMethodField()
    priority_level = serializers.SerializerMethodField()
    days_since_created = serializers.SerializerMethodField()
    
    # Action availability flags
    can_acknowledge = serializers.SerializerMethodField()
    can_resolve = serializers.SerializerMethodField()
    can_snooze = serializers.SerializerMethodField()
    
    class Meta:
        model = StockAlert
        fields = [
            'id',
            'product',
            'warehouse',
            'alert_type',
            'alert_type_display',
            'status',
            'status_display',
            'priority',
            'priority_level',
            'threshold_value',
            'current_stock',
            'message',
            'created_at',
            'updated_at',
            'acknowledged_at',
            'acknowledged_by',
            'resolved_at',
            'snoozed_until',
            'is_snoozed',
            'days_since_created',
            'can_acknowledge',
            'can_resolve',
            'can_snooze',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'acknowledged_at',
            'acknowledged_by',
            'resolved_at',
        ]
    
    def get_is_snoozed(self, obj):
        """Check if alert is currently snoozed."""
        if not obj.snoozed_until:
            return False
        return obj.snoozed_until > timezone.now()
    
    def get_priority_level(self, obj):
        """Map priority number to level name."""
        if obj.priority >= 8:
            return 'critical'
        elif obj.priority >= 6:
            return 'high'
        elif obj.priority >= 4:
            return 'medium'
        else:
            return 'low'
    
    def get_days_since_created(self, obj):
        """Calculate days since alert created."""
        delta = timezone.now() - obj.created_at
        return delta.days
    
    def get_can_acknowledge(self, obj):
        """Check if alert can be acknowledged."""
        return obj.status == 'active' and obj.acknowledged_at is None
    
    def get_can_resolve(self, obj):
        """Check if alert can be resolved."""
        return obj.status in ['active', 'acknowledged']
    
    def get_can_snooze(self, obj):
        """Check if alert can be snoozed."""
        return obj.status == 'active' and not self.get_is_snoozed(obj)
    
    def validate_snoozed_until(self, value):
        """Ensure snooze date is in future."""
        if value and value <= timezone.now():
            raise serializers.ValidationError("Snooze date must be in the future")
        return value
    
    def validate_priority(self, value):
        """Ensure priority is in valid range."""
        if value < 1 or value > 10:
            raise serializers.ValidationError("Priority must be between 1 and 10")
        return value


class StockAlertListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for alert lists.
    
    Excludes heavy nested data and calculated fields.
    """
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    warehouse_name = serializers.CharField(source='warehouse.name', read_only=True, allow_null=True)
    
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = StockAlert
        fields = [
            'id',
            'product_name',
            'product_sku',
            'warehouse_name',
            'alert_type',
            'alert_type_display',
            'status',
            'status_display',
            'priority',
            'current_stock',
            'created_at',
            'acknowledged_at',
        ]
        read_only_fields = fields
```

### Expected API Response
```json
{
  "id": 789,
  "product": {
    "id": 456,
    "name": "Widget A",
    "sku": "WID-A-001",
    "unit": "pcs"
  },
  "warehouse": {
    "id": 1,
    "name": "Colombo Main Warehouse",
    "code": "CLB-01"
  },
  "alert_type": "low_stock",
  "alert_type_display": "Low Stock",
  "status": "active",
  "status_display": "Active",
  "priority": 5,
  "priority_level": "medium",
  "threshold_value": "20.000",
  "current_stock": "15.500",
  "message": "Stock below threshold",
  "created_at": "2025-01-22T08:30:00Z",
  "updated_at": "2025-01-22T08:30:00Z",
  "acknowledged_at": null,
  "acknowledged_by": null,
  "resolved_at": null,
  "snoozed_until": null,
  "is_snoozed": false,
  "days_since_created": 0,
  "can_acknowledge": true,
  "can_resolve": true,
  "can_snooze": true
}
```

### Verification Checklist
- [ ] alert.py file created
- [ ] StockAlertSerializer defined
- [ ] Nested serializers used
- [ ] alert_type_display added
- [ ] status_display added
- [ ] Calculated fields work
- [ ] Action flags implemented
- [ ] Validation methods added
- [ ] StockAlertListSerializer for lists

---

## Task 71: Create ReorderSuggestionSerializer

### Overview
Create DRF serializer for ReorderSuggestion with velocity data and conversion status.

### Dependencies
- Group D: ReorderSuggestion model
- Task 69: ProductSummarySerializer

### Instructions

1. **Create reorder.py file**
   - Location: apps/inventory/alerts/serializers/
   - Import models

2. **Create ReorderSuggestionSerializer**
   - All suggestion fields
   - Nested product/supplier/PO
   - Calculation details

3. **Add nested relationships**
   - product: ProductSummarySerializer
   - suggested_supplier: SupplierSummarySerializer
   - converted_po: POSummarySerializer

4. **Add calculated fields**
   - urgency_display: Human-readable
   - status_display: Human-readable
   - can_convert: Boolean
   - estimated_stockout_date: Date

5. **Add conversion validation**
   - validate_conversion: Check requirements
   - supplier_required: Custom validation

6. **Add list serializer**
   - Lightweight for lists
   - Only essential fields

### Reorder Serializer Implementation
```python
# apps/inventory/alerts/serializers/reorder.py
from rest_framework import serializers
from django.utils import timezone
from apps.inventory.alerts.models import ReorderSuggestion
from apps.inventory.alerts.services.reorder_calculator import ReorderCalculator
from .config import ProductSummarySerializer, WarehouseSummarySerializer


class SupplierSummarySerializer(serializers.ModelSerializer):
    """Minimal supplier info for nesting."""
    
    class Meta:
        model = 'suppliers.Supplier'
        fields = ['id', 'name', 'code', 'is_active']
        read_only_fields = fields


class POSummarySerializer(serializers.ModelSerializer):
    """Minimal PO info for nesting."""
    
    class Meta:
        model = 'purchasing.PurchaseOrder'
        fields = ['id', 'po_number', 'status', 'total']
        read_only_fields = fields


class ReorderSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for ReorderSuggestion with conversion capabilities.
    
    Includes velocity data and conversion status.
    """
    
    # Nested read-only fields
    product = ProductSummarySerializer(read_only=True)
    warehouse = WarehouseSummarySerializer(read_only=True, allow_null=True)
    suggested_supplier = SupplierSummarySerializer(read_only=True, allow_null=True)
    converted_po = POSummarySerializer(read_only=True, allow_null=True)
    
    # Human-readable displays
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Calculated fields
    estimated_stockout_date = serializers.SerializerMethodField()
    can_convert = serializers.SerializerMethodField()
    days_since_created = serializers.SerializerMethodField()
    
    class Meta:
        model = ReorderSuggestion
        fields = [
            'id',
            'product',
            'warehouse',
            'suggested_qty',
            'minimum_order_qty',
            'current_stock',
            'suggested_supplier',
            'urgency',
            'urgency_display',
            'status',
            'status_display',
            'days_until_stockout',
            'estimated_stockout_date',
            'daily_velocity',
            'safety_stock',
            'eoq',
            'reorder_point',
            'estimated_cost',
            'unit_cost',
            'notes',
            'calculation_details',
            'auto_generated',
            'converted_po',
            'status_changed_at',
            'dismissal_reason',
            'can_convert',
            'days_since_created',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'daily_velocity',
            'safety_stock',
            'eoq',
            'reorder_point',
            'calculation_details',
            'auto_generated',
            'converted_po',
            'status_changed_at',
            'created_at',
            'updated_at',
        ]
    
    def get_estimated_stockout_date(self, obj):
        """Calculate estimated stockout date."""
        if not obj.days_until_stockout or not obj.daily_velocity:
            return None
        
        stockout_date = ReorderCalculator.get_stockout_date(
            current_stock=obj.current_stock,
            daily_velocity=obj.daily_velocity,
            product=obj.product,
            warehouse=obj.warehouse
        )
        
        return stockout_date.date() if stockout_date else None
    
    def get_can_convert(self, obj):
        """Check if suggestion can be converted to PO."""
        can_convert, _ = obj.can_convert()
        return can_convert
    
    def get_days_since_created(self, obj):
        """Calculate days since suggestion created."""
        delta = timezone.now() - obj.created_at
        return delta.days
    
    def validate(self, data):
        """Validate suggestion data."""
        # Ensure suggested_qty >= minimum_order_qty
        suggested_qty = data.get('suggested_qty')
        minimum_qty = data.get('minimum_order_qty')
        
        if suggested_qty and minimum_qty and suggested_qty < minimum_qty:
            raise serializers.ValidationError(
                "Suggested quantity must be >= minimum order quantity"
            )
        
        return data


class ReorderSuggestionListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for suggestion lists.
    """
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    supplier_name = serializers.CharField(source='suggested_supplier.name', read_only=True, allow_null=True)
    
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ReorderSuggestion
        fields = [
            'id',
            'product_name',
            'product_sku',
            'supplier_name',
            'suggested_qty',
            'current_stock',
            'urgency',
            'urgency_display',
            'status',
            'status_display',
            'days_until_stockout',
            'estimated_cost',
            'created_at',
        ]
        read_only_fields = fields
```

### Expected API Response
```json
{
  "id": 234,
  "product": {
    "id": 456,
    "name": "Widget A",
    "sku": "WID-A-001",
    "unit": "pcs"
  },
  "warehouse": null,
  "suggested_qty": "200.000",
  "minimum_order_qty": "50.000",
  "current_stock": "25.000",
  "suggested_supplier": {
    "id": 12,
    "name": "ABC Supplies",
    "code": "ABC-001",
    "is_active": true
  },
  "urgency": "high",
  "urgency_display": "High - 5-15 days",
  "status": "pending",
  "status_display": "Pending Review",
  "days_until_stockout": "8.50",
  "estimated_stockout_date": "2025-01-30",
  "daily_velocity": "3.500",
  "safety_stock": "24.500",
  "eoq": "200.000",
  "reorder_point": "50.000",
  "estimated_cost": "100000.00",
  "unit_cost": "500.00",
  "can_convert": true,
  "days_since_created": 1,
  "created_at": "2025-01-22T06:00:00Z"
}
```

### Verification Checklist
- [ ] reorder.py file created
- [ ] ReorderSuggestionSerializer defined
- [ ] Nested serializers implemented
- [ ] urgency_display added
- [ ] status_display added
- [ ] estimated_stockout_date calculates
- [ ] can_convert flag works
- [ ] Validation implemented
- [ ] ReorderSuggestionListSerializer created

---

## Task 72: Create AlertDashboardSerializer

### Overview
Create specialized serializer for dashboard widget showing alert summary and recent activity.

### Dependencies
- Task 70: StockAlertSerializer
- Group B: StockAlert model manager

### Instructions

1. **Add to alert.py file**
   - Same file as StockAlertSerializer
   - Use aggregation methods

2. **Create AlertDashboardSerializer**
   - Summary statistics
   - Breakdown by type/priority
   - Recent alerts list
   - Top products at risk

3. **Add aggregation fields**
   - total_active_alerts: Count
   - by_type: Dict with counts
   - by_priority: Dict with counts
   - by_warehouse: Dict with counts

4. **Add recent activity**
   - recent_alerts: Last 5 alerts
   - recent_resolutions: Last 5 resolved
   - Use nested StockAlertListSerializer

5. **Add products at risk**
   - Top 10 by urgency
   - Include product info
   - Sort by priority and date

### Dashboard Serializer Implementation
```python
# Add to apps/inventory/alerts/serializers/alert.py

class AlertDashboardSerializer(serializers.Serializer):
    """
    Dashboard summary serializer for stock alerts.
    
    Provides aggregated statistics and recent activity.
    """
    
    # Summary statistics
    total_active_alerts = serializers.IntegerField()
    total_acknowledged = serializers.IntegerField()
    total_snoozed = serializers.IntegerField()
    total_resolved_today = serializers.IntegerField()
    
    # Breakdown by type
    by_type = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Alert counts by type"
    )
    
    # Breakdown by priority
    by_priority = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Alert counts by priority level"
    )
    
    # Breakdown by warehouse
    by_warehouse = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Alert counts by warehouse"
    )
    
    # Recent activity
    recent_alerts = StockAlertListSerializer(many=True)
    recent_resolutions = StockAlertListSerializer(many=True)
    
    # Products at risk
    products_at_risk = serializers.ListField(
        child=serializers.DictField(),
        help_text="Top products with critical alerts"
    )
    
    # Metadata
    last_updated = serializers.DateTimeField()
    monitoring_status = serializers.CharField()


class StockHealthSerializer(serializers.Serializer):
    """
    Overall stock health metrics.
    
    Used for stock health endpoint.
    """
    
    health_score = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Overall health score (0-100)"
    )
    
    total_products = serializers.IntegerField()
    
    out_of_stock_count = serializers.IntegerField()
    out_of_stock_percent = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    low_stock_count = serializers.IntegerField()
    low_stock_percent = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    healthy_count = serializers.IntegerField()
    healthy_percent = serializers.DecimalField(max_digits=5, decimal_places=2)
    
    categories_at_risk = serializers.ListField(
        child=serializers.DictField()
    )
    
    trend = serializers.CharField(
        help_text="improving, stable, or declining"
    )
    
    last_calculated = serializers.DateTimeField()
```

### Expected Dashboard Response
```json
{
  "total_active_alerts": 47,
  "total_acknowledged": 12,
  "total_snoozed": 5,
  "total_resolved_today": 8,
  "by_type": {
    "low_stock": 25,
    "critical_stock": 15,
    "out_of_stock": 7
  },
  "by_priority": {
    "critical": 10,
    "high": 18,
    "medium": 15,
    "low": 4
  },
  "by_warehouse": {
    "Colombo Main": 28,
    "Kandy Branch": 12,
    "Galle Branch": 7
  },
  "recent_alerts": [
    {
      "id": 789,
      "product_name": "Widget A",
      "product_sku": "WID-A-001",
      "alert_type": "low_stock",
      "priority": 5,
      "created_at": "2025-01-22T14:30:00Z"
    }
  ],
  "products_at_risk": [
    {
      "product_id": 456,
      "product_name": "Widget A",
      "sku": "WID-A-001",
      "alert_count": 3,
      "highest_priority": 8,
      "current_stock": 5.0,
      "days_until_stockout": 2
    }
  ],
  "last_updated": "2025-01-22T15:00:00Z",
  "monitoring_status": "active"
}
```

### Verification Checklist
- [ ] AlertDashboardSerializer added to alert.py
- [ ] Summary statistics fields defined
- [ ] by_type breakdown included
- [ ] by_priority breakdown included
- [ ] by_warehouse breakdown included
- [ ] recent_alerts nested serializer
- [ ] products_at_risk included
- [ ] StockHealthSerializer created
- [ ] Serializers tested with data

---

## Summary

All serializers for Group E Task 69-72 are now complete:

1. **ProductStockConfigSerializer** - Full config with effective inheritance
2. **GlobalStockSettingsSerializer** - Tenant-wide settings
3. **StockAlertSerializer** - Detailed alert with nested data
4. **StockAlertListSerializer** - Lightweight for lists
5. **ReorderSuggestionSerializer** - Full suggestion with conversion status
6. **ReorderSuggestionListSerializer** - Lightweight for lists
7. **AlertDashboardSerializer** - Dashboard summary widget
8. **StockHealthSerializer** - Overall health metrics

### Next Steps

Proceed to **Tasks 73-77: ViewSets** to create the API endpoints that use these serializers.
