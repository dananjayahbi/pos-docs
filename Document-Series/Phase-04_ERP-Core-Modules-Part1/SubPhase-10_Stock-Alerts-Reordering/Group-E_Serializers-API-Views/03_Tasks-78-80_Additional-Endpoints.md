# Tasks 78-80: Additional Endpoints

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** E - Serializers & API Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-73-77_ViewSets.md](02_Tasks-73-77_ViewSets.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers specialized endpoints for bulk operations, reporting, and inventory health scoring.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 78 | Create Bulk Config Update Endpoint | Medium |
| 79 | Create Reorder Report Endpoint | Medium |
| 80 | Create Stock Health Endpoint | Medium |

---

## Task 78: Create Bulk Config Update Endpoint

### Overview
Create endpoint for bulk updating stock configurations across multiple products.

### Dependencies
- Task 73: ProductStockConfigViewSet
- Group A: ProductStockConfig model

### Instructions

1. **Add custom action to ProductStockConfigViewSet**
   - POST /api/stock-config/bulk/
   - Accept list of updates
   - Apply to multiple products

2. **Define request structure**
   - Array of product IDs
   - Configuration fields to update
   - Apply to all or filtered products

3. **Add update modes**
   - update_all: Update all products
   - update_by_category: Update by category
   - update_by_list: Update specific product list

4. **Add validation**
   - Validate each update
   - Skip invalid entries
   - Return success/failure counts

5. **Add dry-run mode**
   - Preview changes
   - Show affected products
   - Don't commit changes

6. **Add transaction handling**
   - Atomic updates
   - Rollback on error
   - Audit trail

### Bulk Update Implementation
```python
# Add to apps/inventory/alerts/views/config.py

class ProductStockConfigViewSet(viewsets.ModelViewSet):
    """ViewSet for ProductStockConfig."""
    
    # ... existing code ...
    
    @action(detail=False, methods=['post', 'patch'])
    def bulk(self, request):
        """
        Bulk update stock configurations.
        
        POST /api/stock-config/bulk/
        
        Body structure:
        {
            "mode": "update_by_list",  // or "update_all", "update_by_category"
            "product_ids": [1, 2, 3],  // Required for update_by_list
            "category_id": 5,          // Required for update_by_category
            "updates": {
                "low_stock_threshold": 20,
                "reorder_point": 50,
                "exclude_from_monitoring": false
            },
            "dry_run": false,          // Optional, default false
            "create_if_missing": true  // Optional, default true
        }
        
        Returns summary of applied changes.
        """
        
        # Parse request
        mode = request.data.get('mode', 'update_by_list')
        updates = request.data.get('updates', {})
        dry_run = request.data.get('dry_run', False)
        create_if_missing = request.data.get('create_if_missing', True)
        
        if not updates:
            return Response(
                {'error': 'updates dict is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get target products based on mode
        if mode == 'update_all':
            from apps.inventory.models import Product
            products = Product.objects.filter(is_active=True)
        
        elif mode == 'update_by_category':
            category_id = request.data.get('category_id')
            if not category_id:
                return Response(
                    {'error': 'category_id required for update_by_category'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            from apps.inventory.models import Product
            products = Product.objects.filter(
                category_id=category_id,
                is_active=True
            )
        
        elif mode == 'update_by_list':
            product_ids = request.data.get('product_ids', [])
            if not product_ids:
                return Response(
                    {'error': 'product_ids required for update_by_list'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            from apps.inventory.models import Product
            products = Product.objects.filter(
                id__in=product_ids,
                is_active=True
            )
        
        else:
            return Response(
                {'error': f'Invalid mode: {mode}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not products.exists():
            return Response(
                {'error': 'No products found matching criteria'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Preview mode
        if dry_run:
            affected_products = []
            for product in products[:100]:  # Limit preview
                config = ProductStockConfig.objects.filter(
                    product=product,
                    warehouse__isnull=True
                ).first()
                
                affected_products.append({
                    'product_id': product.id,
                    'product_name': product.name,
                    'sku': product.sku,
                    'has_existing_config': config is not None,
                    'current_values': {
                        'low_stock_threshold': float(config.low_stock_threshold) if config and config.low_stock_threshold else None,
                        'reorder_point': float(config.reorder_point) if config and config.reorder_point else None,
                    } if config else {},
                    'new_values': updates
                })
            
            return Response({
                'dry_run': True,
                'total_products': products.count(),
                'preview_products': affected_products,
                'updates_to_apply': updates
            })
        
        # Perform bulk update
        updated_count = 0
        created_count = 0
        skipped_count = 0
        errors = []
        
        with transaction.atomic():
            for product in products:
                try:
                    # Get or create config
                    config, created = ProductStockConfig.objects.get_or_create(
                        product=product,
                        warehouse=None,  # Global config
                        defaults=updates
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        # Update existing
                        for field, value in updates.items():
                            if hasattr(config, field):
                                setattr(config, field, value)
                        config.save()
                        updated_count += 1
                
                except Exception as e:
                    skipped_count += 1
                    errors.append({
                        'product_id': product.id,
                        'error': str(e)
                    })
        
        return Response({
            'success': True,
            'mode': mode,
            'total_products': products.count(),
            'updated_count': updated_count,
            'created_count': created_count,
            'skipped_count': skipped_count,
            'errors': errors[:10],  # Limit error list
            'updates_applied': updates
        })
    
    @action(detail=False, methods=['post'])
    def bulk_exclude(self, request):
        """
        Bulk exclude products from monitoring.
        
        POST /api/stock-config/bulk_exclude/
        
        Body:
        {
            "product_ids": [1, 2, 3],
            "exclude": true,
            "reason": "Discontinued items"
        }
        """
        product_ids = request.data.get('product_ids', [])
        exclude = request.data.get('exclude', True)
        reason = request.data.get('reason', '')
        
        if not product_ids:
            return Response(
                {'error': 'product_ids list is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated_count = 0
        
        with transaction.atomic():
            configs = ProductStockConfig.objects.filter(
                product_id__in=product_ids
            )
            
            updated_count = configs.update(
                exclude_from_monitoring=exclude,
                exclusion_reason=reason if exclude else ''
            )
        
        return Response({
            'success': True,
            'updated_count': updated_count,
            'excluded': exclude
        })
```

### Request Examples

**Bulk Update by List:**
```json
{
  "mode": "update_by_list",
  "product_ids": [101, 102, 103],
  "updates": {
    "low_stock_threshold": 20,
    "reorder_point": 50,
    "reorder_quantity": 200
  },
  "dry_run": false
}
```

**Bulk Update by Category:**
```json
{
  "mode": "update_by_category",
  "category_id": 5,
  "updates": {
    "auto_hide_when_oos": true,
    "allow_backorder": false
  }
}
```

**Bulk Exclude:**
```json
{
  "product_ids": [201, 202, 203],
  "exclude": true,
  "reason": "Seasonal items - out of season"
}
```

### Response Structure
```json
{
  "success": true,
  "mode": "update_by_list",
  "total_products": 3,
  "updated_count": 2,
  "created_count": 1,
  "skipped_count": 0,
  "errors": [],
  "updates_applied": {
    "low_stock_threshold": 20,
    "reorder_point": 50
  }
}
```

### Verification Checklist
- [ ] bulk action added to ProductStockConfigViewSet
- [ ] update_all mode works
- [ ] update_by_category mode works
- [ ] update_by_list mode works
- [ ] dry_run preview implemented
- [ ] Transaction handling added
- [ ] Error handling complete
- [ ] bulk_exclude action works

---

## Task 79: Create Reorder Report Endpoint

### Overview
Create endpoint for generating comprehensive reorder reports with filtering and export.

### Dependencies
- Task 75: ReorderSuggestionViewSet
- Group D: ReorderSuggestion model

### Instructions

1. **Add report action to ReorderSuggestionViewSet**
   - GET /api/reorder/report/
   - Generate comprehensive report
   - Apply filters

2. **Add filtering options**
   - Date range
   - Urgency level
   - Status (pending/converted)
   - Warehouse
   - Supplier
   - Cost range

3. **Add grouping options**
   - By supplier
   - By urgency
   - By category
   - By warehouse

4. **Add export formats**
   - JSON (default)
   - CSV
   - Excel
   - PDF (optional)

5. **Add email delivery**
   - Email report to user
   - Schedule recurring reports
   - Attach as Excel

6. **Add summary statistics**
   - Total suggestions
   - Total estimated cost
   - Breakdown by urgency
   - Conversion rate

### Report Endpoint Implementation
```python
# Add to apps/inventory/alerts/views/reorder.py

from django.http import HttpResponse
from django.db.models import Sum, Count, Avg
import csv


class ReorderSuggestionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ReorderSuggestion."""
    
    # ... existing code ...
    
    @action(detail=False, methods=['get'])
    def report(self, request):
        """
        Generate comprehensive reorder report.
        
        GET /api/reorder/report/
        
        Query params:
            - format: json, csv, excel (default: json)
            - urgency: Filter by urgency level
            - status: Filter by status
            - warehouse: Filter by warehouse ID
            - supplier: Filter by supplier ID
            - date_from: Start date (YYYY-MM-DD)
            - date_to: End date (YYYY-MM-DD)
            - group_by: supplier, urgency, category, warehouse
            - min_cost: Minimum estimated cost
            - max_cost: Maximum estimated cost
        
        Returns filtered report with summary statistics.
        """
        
        # Get query params
        export_format = request.query_params.get('format', 'json')
        urgency = request.query_params.get('urgency')
        suggestion_status = request.query_params.get('status', 'pending')
        warehouse_id = request.query_params.get('warehouse')
        supplier_id = request.query_params.get('supplier')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        group_by = request.query_params.get('group_by')
        min_cost = request.query_params.get('min_cost')
        max_cost = request.query_params.get('max_cost')
        
        # Build queryset
        queryset = self.get_queryset()
        
        # Apply filters
        if suggestion_status:
            queryset = queryset.filter(status=suggestion_status)
        
        if urgency:
            queryset = queryset.filter(urgency=urgency)
        
        if warehouse_id:
            queryset = queryset.filter(warehouse_id=warehouse_id)
        
        if supplier_id:
            queryset = queryset.filter(suggested_supplier_id=supplier_id)
        
        if date_from:
            from django.utils.dateparse import parse_date
            date_from_parsed = parse_date(date_from)
            if date_from_parsed:
                queryset = queryset.filter(created_at__gte=date_from_parsed)
        
        if date_to:
            from django.utils.dateparse import parse_date
            date_to_parsed = parse_date(date_to)
            if date_to_parsed:
                from datetime import datetime, time
                date_to_end = datetime.combine(date_to_parsed, time.max)
                queryset = queryset.filter(created_at__lte=date_to_end)
        
        if min_cost:
            queryset = queryset.filter(estimated_cost__gte=min_cost)
        
        if max_cost:
            queryset = queryset.filter(estimated_cost__lte=max_cost)
        
        # Summary statistics
        summary = {
            'total_suggestions': queryset.count(),
            'total_estimated_cost': float(queryset.aggregate(
                total=Sum('estimated_cost')
            )['total'] or 0),
            'total_quantity': float(queryset.aggregate(
                total=Sum('suggested_qty')
            )['total'] or 0),
            'by_urgency': {},
            'by_status': {},
            'avg_days_until_stockout': float(queryset.aggregate(
                avg=Avg('days_until_stockout')
            )['avg'] or 0),
        }
        
        # Group by urgency
        urgency_groups = queryset.values('urgency').annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost')
        )
        for item in urgency_groups:
            summary['by_urgency'][item['urgency']] = {
                'count': item['count'],
                'total_cost': float(item['total_cost'] or 0)
            }
        
        # Group by status
        status_groups = queryset.values('status').annotate(
            count=Count('id'),
            total_cost=Sum('estimated_cost')
        )
        for item in status_groups:
            summary['by_status'][item['status']] = {
                'count': item['count'],
                'total_cost': float(item['total_cost'] or 0)
            }
        
        # Grouping for report body
        if group_by:
            grouped_data = self._group_suggestions(queryset, group_by)
        else:
            # Flat list
            suggestions = queryset.order_by('-urgency', 'days_until_stockout')
            grouped_data = {
                'ungrouped': ReorderSuggestionListSerializer(suggestions, many=True).data
            }
        
        # Export format handling
        if export_format == 'csv':
            return self._export_csv(queryset, summary)
        
        elif export_format == 'excel':
            return self._export_excel(queryset, summary, grouped_data)
        
        else:
            # JSON response
            return Response({
                'summary': summary,
                'grouped_data': grouped_data,
                'filters_applied': {
                    'urgency': urgency,
                    'status': suggestion_status,
                    'warehouse': warehouse_id,
                    'supplier': supplier_id,
                    'date_range': {
                        'from': date_from,
                        'to': date_to
                    },
                    'cost_range': {
                        'min': min_cost,
                        'max': max_cost
                    }
                },
                'generated_at': timezone.now()
            })
    
    def _group_suggestions(self, queryset, group_by):
        """Group suggestions by specified field."""
        
        grouped = {}
        
        if group_by == 'supplier':
            from django.db.models import Q
            
            # Group by supplier
            suppliers = queryset.values(
                'suggested_supplier_id',
                'suggested_supplier__name'
            ).distinct()
            
            for supplier in suppliers:
                supplier_id = supplier['suggested_supplier_id']
                supplier_name = supplier['suggested_supplier__name'] or 'No Supplier'
                
                suggestions = queryset.filter(suggested_supplier_id=supplier_id)
                grouped[supplier_name] = {
                    'suggestions': ReorderSuggestionListSerializer(suggestions, many=True).data,
                    'count': suggestions.count(),
                    'total_cost': float(suggestions.aggregate(total=Sum('estimated_cost'))['total'] or 0)
                }
        
        elif group_by == 'urgency':
            for urgency_level, _ in ReorderSuggestion.URGENCY_LEVELS:
                suggestions = queryset.filter(urgency=urgency_level)
                if suggestions.exists():
                    grouped[urgency_level] = {
                        'suggestions': ReorderSuggestionListSerializer(suggestions, many=True).data,
                        'count': suggestions.count(),
                        'total_cost': float(suggestions.aggregate(total=Sum('estimated_cost'))['total'] or 0)
                    }
        
        elif group_by == 'category':
            categories = queryset.values(
                'product__category_id',
                'product__category__name'
            ).distinct()
            
            for category in categories:
                category_name = category['product__category__name'] or 'Uncategorized'
                suggestions = queryset.filter(product__category_id=category['product__category_id'])
                
                grouped[category_name] = {
                    'suggestions': ReorderSuggestionListSerializer(suggestions, many=True).data,
                    'count': suggestions.count(),
                    'total_cost': float(suggestions.aggregate(total=Sum('estimated_cost'))['total'] or 0)
                }
        
        elif group_by == 'warehouse':
            warehouses = queryset.values(
                'warehouse_id',
                'warehouse__name'
            ).distinct()
            
            for warehouse in warehouses:
                warehouse_name = warehouse['warehouse__name'] or 'All Warehouses'
                suggestions = queryset.filter(warehouse_id=warehouse['warehouse_id'])
                
                grouped[warehouse_name] = {
                    'suggestions': ReorderSuggestionListSerializer(suggestions, many=True).data,
                    'count': suggestions.count(),
                    'total_cost': float(suggestions.aggregate(total=Sum('estimated_cost'))['total'] or 0)
                }
        
        return grouped
    
    def _export_csv(self, queryset, summary):
        """Export report as CSV."""
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="reorder_report_{timezone.now().strftime("%Y%m%d")}.csv"'
        
        writer = csv.writer(response)
        
        # Header
        writer.writerow([
            'Product SKU',
            'Product Name',
            'Warehouse',
            'Suggested Qty',
            'Current Stock',
            'Urgency',
            'Days Until Stockout',
            'Supplier',
            'Estimated Cost (LKR)',
            'Status',
            'Created At'
        ])
        
        # Data rows
        for suggestion in queryset:
            writer.writerow([
                suggestion.product.sku,
                suggestion.product.name,
                suggestion.warehouse.name if suggestion.warehouse else 'All',
                float(suggestion.suggested_qty),
                float(suggestion.current_stock),
                suggestion.get_urgency_display(),
                float(suggestion.days_until_stockout) if suggestion.days_until_stockout else '',
                suggestion.suggested_supplier.name if suggestion.suggested_supplier else '',
                float(suggestion.estimated_cost),
                suggestion.get_status_display(),
                suggestion.created_at.strftime('%Y-%m-%d %H:%M')
            ])
        
        # Summary section
        writer.writerow([])
        writer.writerow(['SUMMARY'])
        writer.writerow(['Total Suggestions', summary['total_suggestions']])
        writer.writerow(['Total Estimated Cost (LKR)', summary['total_estimated_cost']])
        writer.writerow(['Total Quantity', summary['total_quantity']])
        
        return response
    
    def _export_excel(self, queryset, summary, grouped_data):
        """Export report as Excel."""
        
        try:
            import openpyxl
            from openpyxl.styles import Font, PatternFill, Alignment
            from io import BytesIO
        except ImportError:
            return Response(
                {'error': 'openpyxl not installed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create workbook
        wb = openpyxl.Workbook()
        
        # Summary sheet
        ws_summary = wb.active
        ws_summary.title = 'Summary'
        
        # Headers
        header_fill = PatternFill(start_color='4472C4', end_color='4472C4', fill_type='solid')
        header_font = Font(color='FFFFFF', bold=True)
        
        # Summary data
        ws_summary['A1'] = 'Reorder Report Summary'
        ws_summary['A1'].font = Font(size=14, bold=True)
        
        row = 3
        ws_summary[f'A{row}'] = 'Total Suggestions'
        ws_summary[f'B{row}'] = summary['total_suggestions']
        
        row += 1
        ws_summary[f'A{row}'] = 'Total Estimated Cost (LKR)'
        ws_summary[f'B{row}'] = summary['total_estimated_cost']
        
        row += 1
        ws_summary[f'A{row}'] = 'Total Quantity'
        ws_summary[f'B{row}'] = summary['total_quantity']
        
        row += 2
        ws_summary[f'A{row}'] = 'By Urgency'
        ws_summary[f'A{row}'].font = Font(bold=True)
        
        for urgency, data in summary['by_urgency'].items():
            row += 1
            ws_summary[f'A{row}'] = urgency
            ws_summary[f'B{row}'] = data['count']
            ws_summary[f'C{row}'] = data['total_cost']
        
        # Details sheet
        ws_details = wb.create_sheet('Details')
        
        # Column headers
        headers = [
            'Product SKU', 'Product Name', 'Warehouse', 'Suggested Qty',
            'Current Stock', 'Urgency', 'Days Until Stockout', 'Supplier',
            'Estimated Cost', 'Status', 'Created At'
        ]
        
        for col_num, header in enumerate(headers, 1):
            cell = ws_details.cell(row=1, column=col_num)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal='center')
        
        # Data rows
        for row_num, suggestion in enumerate(queryset, 2):
            ws_details.cell(row=row_num, column=1, value=suggestion.product.sku)
            ws_details.cell(row=row_num, column=2, value=suggestion.product.name)
            ws_details.cell(row=row_num, column=3, value=suggestion.warehouse.name if suggestion.warehouse else 'All')
            ws_details.cell(row=row_num, column=4, value=float(suggestion.suggested_qty))
            ws_details.cell(row=row_num, column=5, value=float(suggestion.current_stock))
            ws_details.cell(row=row_num, column=6, value=suggestion.get_urgency_display())
            ws_details.cell(row=row_num, column=7, value=float(suggestion.days_until_stockout) if suggestion.days_until_stockout else '')
            ws_details.cell(row=row_num, column=8, value=suggestion.suggested_supplier.name if suggestion.suggested_supplier else '')
            ws_details.cell(row=row_num, column=9, value=float(suggestion.estimated_cost))
            ws_details.cell(row=row_num, column=10, value=suggestion.get_status_display())
            ws_details.cell(row=row_num, column=11, value=suggestion.created_at.strftime('%Y-%m-%d %H:%M'))
        
        # Auto-adjust column widths
        for column in ws_details.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            ws_details.column_dimensions[column_letter].width = adjusted_width
        
        # Save to BytesIO
        output = BytesIO()
        wb.save(output)
        output.seek(0)
        
        # Create response
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="reorder_report_{timezone.now().strftime("%Y%m%d")}.xlsx"'
        
        return response
    
    @action(detail=False, methods=['post'])
    def email_report(self, request):
        """
        Email reorder report to user.
        
        POST /api/reorder/email_report/
        
        Body:
        {
            "email": "user@example.com",
            "format": "excel",
            "filters": {
                "urgency": "high",
                "status": "pending"
            }
        }
        """
        
        email = request.data.get('email', request.user.email)
        export_format = request.data.get('format', 'excel')
        filters = request.data.get('filters', {})
        
        # Generate report (reuse report logic)
        # Build queryset with filters
        queryset = self.get_queryset()
        
        for key, value in filters.items():
            if hasattr(ReorderSuggestion, key):
                queryset = queryset.filter(**{key: value})
        
        # Queue email task
        from apps.inventory.alerts.tasks import send_reorder_report_email
        
        task = send_reorder_report_email.delay(
            email=email,
            format=export_format,
            filters=filters,
            user_id=request.user.id
        )
        
        return Response({
            'message': 'Report email queued',
            'task_id': task.id,
            'email': email
        })
```

### Report Response Examples

**JSON Summary:**
```json
{
  "summary": {
    "total_suggestions": 45,
    "total_estimated_cost": 2150000.00,
    "total_quantity": 5600.000,
    "by_urgency": {
      "critical": {"count": 8, "total_cost": 650000},
      "high": {"count": 15, "total_cost": 850000},
      "medium": {"count": 22, "total_cost": 650000}
    },
    "avg_days_until_stockout": 12.5
  },
  "grouped_data": {
    "ABC Supplies": {
      "suggestions": [...],
      "count": 20,
      "total_cost": 950000
    }
  },
  "generated_at": "2025-01-22T16:00:00Z"
}
```

### Verification Checklist
- [ ] report action added to ReorderSuggestionViewSet
- [ ] Filtering parameters work
- [ ] Grouping options implemented
- [ ] CSV export works
- [ ] Excel export works
- [ ] Summary statistics calculated
- [ ] email_report action works
- [ ] Error handling complete

---

## Task 80: Create Stock Health Endpoint

### Overview
Create endpoint for calculating overall inventory health score and identifying at-risk products.

### Dependencies
- Group B: StockAlert model
- Group D: ReorderSuggestion model

### Instructions

1. **Create dedicated health endpoint**
   - GET /api/inventory/health/
   - Calculate health score
   - Return detailed breakdown

2. **Define health calculation**
   - Formula: Health = 100 - penalties
   - Out of stock penalty: 10 points each
   - Low stock penalty: 5 points each
   - Critical alerts penalty: 8 points each

3. **Add health categories**
   - 90-100: Excellent
   - 75-89: Good
   - 60-74: Fair
   - 40-59: Poor
   - 0-39: Critical

4. **Add trend analysis**
   - Compare to last week/month
   - Calculate improvement/decline
   - Show trajectory

5. **Add category breakdown**
   - Health by product category
   - Identify worst performers
   - Show top issues

6. **Add warehouse breakdown**
   - Health per warehouse
   - Compare warehouses
   - Identify problem locations

### Health Endpoint Implementation
```python
# Create new file: apps/inventory/alerts/views/health.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache

from apps.inventory.models import Product, StockLevel
from apps.inventory.alerts.models import StockAlert, ReorderSuggestion
from apps.inventory.alerts.serializers import StockHealthSerializer
from apps.core.permissions import TenantPermission


class StockHealthView(APIView):
    """
    Inventory health score endpoint.
    
    GET /api/inventory/health/
    
    Query params:
        - warehouse: Filter by warehouse ID
        - category: Filter by category ID
        - refresh: Force refresh cache (default: false)
    
    Calculates overall health score based on:
    - Out of stock products
    - Low stock alerts
    - Critical alerts
    - Pending reorder suggestions
    
    Returns health score (0-100) and detailed breakdown.
    """
    
    permission_classes = [IsAuthenticated, TenantPermission]
    
    def get(self, request):
        """Calculate and return stock health metrics."""
        
        # Get query params
        warehouse_id = request.query_params.get('warehouse')
        category_id = request.query_params.get('category')
        refresh_cache = request.query_params.get('refresh', 'false').lower() == 'true'
        
        # Build cache key
        cache_key = f'stock_health_{request.tenant.id}'
        if warehouse_id:
            cache_key += f'_wh{warehouse_id}'
        if category_id:
            cache_key += f'_cat{category_id}'
        
        # Check cache
        if not refresh_cache:
            cached_health = cache.get(cache_key)
            if cached_health:
                return Response(cached_health)
        
        # Build base querysets
        products = Product.objects.filter(is_active=True)
        stock_levels = StockLevel.objects.all()
        alerts = StockAlert.objects.filter(status='active')
        
        # Apply filters
        if category_id:
            products = products.filter(category_id=category_id)
            alerts = alerts.filter(product__category_id=category_id)
        
        if warehouse_id:
            stock_levels = stock_levels.filter(warehouse_id=warehouse_id)
            alerts = alerts.filter(warehouse_id=warehouse_id)
        
        total_products = products.count()
        
        if total_products == 0:
            return Response({
                'error': 'No products found matching criteria'
            }, status=400)
        
        # Calculate metrics
        out_of_stock_count = stock_levels.filter(
            quantity=0
        ).values('product_id').distinct().count()
        
        low_stock_count = alerts.filter(
            alert_type='low_stock'
        ).values('product_id').distinct().count()
        
        critical_count = alerts.filter(
            priority__gte=8
        ).values('product_id').distinct().count()
        
        healthy_count = total_products - out_of_stock_count - low_stock_count
        
        # Calculate percentages
        out_of_stock_percent = (out_of_stock_count / total_products) * 100
        low_stock_percent = (low_stock_count / total_products) * 100
        healthy_percent = (healthy_count / total_products) * 100
        
        # Health score calculation
        # Start at 100, deduct penalties
        health_score = 100.0
        
        # Penalty for out of stock: -2 points per %
        oos_penalty = out_of_stock_percent * 2
        
        # Penalty for low stock: -1 point per %
        low_penalty = low_stock_percent * 1
        
        # Penalty for critical alerts: -0.5 points per %
        critical_percent = (critical_count / total_products) * 100
        critical_penalty = critical_percent * 0.5
        
        health_score -= (oos_penalty + low_penalty + critical_penalty)
        health_score = max(0, min(100, health_score))  # Clamp to 0-100
        
        # Determine health category
        if health_score >= 90:
            health_category = 'excellent'
        elif health_score >= 75:
            health_category = 'good'
        elif health_score >= 60:
            health_category = 'fair'
        elif health_score >= 40:
            health_category = 'poor'
        else:
            health_category = 'critical'
        
        # Category breakdown
        categories_at_risk = []
        
        category_stats = alerts.values(
            'product__category__id',
            'product__category__name'
        ).annotate(
            alert_count=Count('id'),
            critical_count=Count('id', filter=Q(priority__gte=8))
        ).order_by('-alert_count')[:10]
        
        for cat in category_stats:
            cat_products = products.filter(category_id=cat['product__category__id']).count()
            if cat_products > 0:
                categories_at_risk.append({
                    'category_id': cat['product__category__id'],
                    'category_name': cat['product__category__name'],
                    'alert_count': cat['alert_count'],
                    'critical_count': cat['critical_count'],
                    'product_count': cat_products,
                    'alert_percentage': round((cat['alert_count'] / cat_products) * 100, 2)
                })
        
        # Trend analysis
        trend = self._calculate_trend(
            products=products,
            stock_levels=stock_levels,
            warehouse_id=warehouse_id,
            category_id=category_id
        )
        
        # Build response
        health_data = {
            'health_score': round(health_score, 2),
            'health_category': health_category,
            'total_products': total_products,
            'out_of_stock_count': out_of_stock_count,
            'out_of_stock_percent': round(out_of_stock_percent, 2),
            'low_stock_count': low_stock_count,
            'low_stock_percent': round(low_stock_percent, 2),
            'healthy_count': healthy_count,
            'healthy_percent': round(healthy_percent, 2),
            'categories_at_risk': categories_at_risk,
            'trend': trend,
            'last_calculated': timezone.now(),
        }
        
        # Validate with serializer
        serializer = StockHealthSerializer(data=health_data)
        serializer.is_valid(raise_exception=True)
        
        # Cache for 10 minutes
        cache.set(cache_key, serializer.data, 600)
        
        return Response(serializer.data)
    
    def _calculate_trend(self, products, stock_levels, warehouse_id, category_id):
        """Calculate health trend compared to last week."""
        
        # Get last week's data
        week_ago = timezone.now() - timedelta(days=7)
        
        # Count resolved alerts from last week
        resolved_last_week = StockAlert.objects.filter(
            product__in=products,
            status='resolved',
            resolved_at__gte=week_ago
        )
        
        if warehouse_id:
            resolved_last_week = resolved_last_week.filter(warehouse_id=warehouse_id)
        
        resolved_count = resolved_last_week.count()
        
        # Count new alerts from last week
        new_last_week = StockAlert.objects.filter(
            product__in=products,
            created_at__gte=week_ago
        )
        
        if warehouse_id:
            new_last_week = new_last_week.filter(warehouse_id=warehouse_id)
        
        new_count = new_last_week.count()
        
        # Determine trend
        if resolved_count > new_count:
            trend = 'improving'
        elif new_count > resolved_count:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return trend


# Add to apps/inventory/alerts/views/__init__.py
from .health import StockHealthView

__all__ = [
    # ... existing exports ...
    'StockHealthView',
]
```

### URL Configuration
```python
# apps/inventory/alerts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductStockConfigViewSet,
    GlobalStockSettingsViewSet,
    StockAlertViewSet,
    AlertDashboardView,
    ReorderSuggestionViewSet,
    StockHealthView
)

router = DefaultRouter()
router.register('stock-config', ProductStockConfigViewSet, basename='stock-config')
router.register('global-settings', GlobalStockSettingsViewSet, basename='global-settings')
router.register('alerts', StockAlertViewSet, basename='alerts')
router.register('reorder', ReorderSuggestionViewSet, basename='reorder')

urlpatterns = [
    path('', include(router.urls)),
    path('alerts/dashboard/', AlertDashboardView.as_view(), name='alert-dashboard'),
    path('inventory/health/', StockHealthView.as_view(), name='stock-health'),
]
```

### Health Score Response
```json
{
  "health_score": 78.50,
  "health_category": "good",
  "total_products": 1250,
  "out_of_stock_count": 35,
  "out_of_stock_percent": 2.80,
  "low_stock_count": 125,
  "low_stock_percent": 10.00,
  "healthy_count": 1090,
  "healthy_percent": 87.20,
  "categories_at_risk": [
    {
      "category_id": 5,
      "category_name": "Electronics",
      "alert_count": 45,
      "critical_count": 12,
      "product_count": 200,
      "alert_percentage": 22.50
    }
  ],
  "trend": "improving",
  "last_calculated": "2025-01-22T16:30:00Z"
}
```

### Health Score Formula Diagram

```
┌─────────────────────────────────────────────────┐
│         Stock Health Score Calculation          │
├─────────────────────────────────────────────────┤
│                                                  │
│  Starting Score:           100 points           │
│                                                  │
│  Penalties:                                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Out of Stock:   -2 pts per % of products│  │
│  │ Low Stock:      -1 pt per % of products │  │
│  │ Critical Alerts: -0.5 pts per % affected│  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Final Score = 100 - (OOS + Low + Critical)     │
│  Clamped to range: 0-100                        │
│                                                  │
│  Categories:                                     │
│  ├─ 90-100: Excellent 🟢                        │
│  ├─ 75-89:  Good      🟡                        │
│  ├─ 60-74:  Fair      🟠                        │
│  ├─ 40-59:  Poor      🔴                        │
│  └─ 0-39:   Critical  ⚠️                         │
└─────────────────────────────────────────────────┘
```

### Verification Checklist
- [ ] health.py file created
- [ ] StockHealthView implemented
- [ ] Health score calculation correct
- [ ] Category breakdown included
- [ ] Trend analysis works
- [ ] Caching implemented
- [ ] URL routing configured
- [ ] StockHealthSerializer used
- [ ] Filter params work

---

## Summary

All additional endpoints for Group E Tasks 78-80 are now complete:

1. **Bulk Config Update Endpoint** - Mass update configurations
   - Update by list, category, or all products
   - Dry-run preview mode
   - Bulk exclusion support

2. **Reorder Report Endpoint** - Comprehensive reporting
   - Multiple export formats (JSON, CSV, Excel)
   - Flexible filtering and grouping
   - Email delivery support

3. **Stock Health Endpoint** - Health score calculation
   - Formula-based scoring (0-100)
   - Category and trend analysis
   - Cached for performance

### Complete API Endpoint List

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/stock-config/bulk/ | POST | Bulk update configs |
| /api/stock-config/bulk_exclude/ | POST | Bulk exclude products |
| /api/reorder/report/ | GET | Generate report |
| /api/reorder/email_report/ | POST | Email report |
| /api/inventory/health/ | GET | Get health score |

### Group E Complete

All 12 tasks (69-80) for Group E: Serializers & API Views are now complete.

**Next Steps:**

Proceed to **Group F: Testing & Documentation** to create comprehensive tests and finalize module documentation.
