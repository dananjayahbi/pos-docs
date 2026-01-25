# Tasks 27-34: Period, Channel, and Cashier Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** B - Sales Reports  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_BaseGenerator-ProductCustomer.md](01_Tasks-17-26_BaseGenerator-ProductCustomer.md)
- **→ Next Group:** [Group-C_Inventory-Purchase-Reports](../Group-C_Inventory-Purchase-Reports/)

---

## Document Overview

This document covers the remaining three sales report types (period analysis, channel comparison, cashier performance) and the API endpoint for generating and retrieving sales reports. These complete the sales analytics suite with time-series analysis, channel performance comparison, and staff performance tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create SalesByPeriodReport | Medium | 35 min |
| 28 | Add period grouping | Medium | 25 min |
| 29 | Add trend visualization | Medium | 30 min |
| 30 | Create SalesByChannelReport | Medium | 30 min |
| 31 | Add channel comparison | Low | 15 min |
| 32 | Create SalesByCashierReport | Medium | 30 min |
| 33 | Add cashier performance metrics | Medium | 25 min |
| 34 | Create sales report API endpoint | Low | 20 min |

---

## Task 27: Create SalesByPeriodReport

### Overview
Create the SalesByPeriodReport class that generates time-series sales analysis with grouping by day, week, or month. This report reveals sales trends, patterns, and growth over time.

### Dependencies
- Task 26: Add order count column
- SalesInvoice model exists

### Instructions

1. **Create by_period.py file**
   - Create at `apps/analytics/generators/sales/by_period.py`
   - Import BaseReportGenerator and required modules

2. **Define SalesByPeriodReport class**
   - Inherit from BaseReportGenerator
   - Add class docstring
   - Define REPORT_TYPE constant

3. **Add grouping period enum**
   - DAILY: Group by day
   - WEEKLY: Group by week
   - MONTHLY: Group by month
   - Store as class constants

4. **Implement get_base_queryset**
   - Returns SalesInvoice queryset
   - Filters by tenant and status
   - Orders by date

5. **Implement generate method**
   - Validates filters including grouping period
   - Groups sales by selected period
   - Calculates metrics for each period
   - Returns time-series data

6. **Add period aggregation logic**
   - Use Django's TruncDay/TruncWeek/TruncMonth
   - Group by truncated date field
   - Aggregate sales metrics per period

7. **Add growth calculation**
   - Calculate period-over-period growth
   - Both absolute and percentage change
   - Add to data rows

### SalesByPeriodReport Implementation

```python
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from apps.analytics.generators.base import BaseReportGenerator
from apps.sales.models import SalesInvoice
from typing import Dict, Any, List

class SalesByPeriodReport(BaseReportGenerator):
    """
    Sales analysis grouped by time period.
    
    Shows sales trends over time with daily, weekly, or monthly
    aggregation. Includes growth calculations and trend analysis.
    
    Filters:
        - date_range (required): Date range for analysis
        - grouping (required): DAILY, WEEKLY, or MONTHLY
        - location (optional): Warehouse filter
        
    Metrics:
        - Total revenue per period
        - Order count per period
        - Average order value per period
        - Growth vs previous period
        - Cumulative totals
    """
    
    REPORT_TYPE = "SALES_BY_PERIOD"
    
    # Grouping options
    GROUPING_DAILY = 'daily'
    GROUPING_WEEKLY = 'weekly'
    GROUPING_MONTHLY = 'monthly'
    
    GROUPING_CHOICES = [
        GROUPING_DAILY,
        GROUPING_WEEKLY,
        GROUPING_MONTHLY
    ]
    
    def get_base_queryset(self):
        """Get base queryset for sales invoices."""
        return SalesInvoice.objects.filter(
            tenant=self.tenant,
            status='COMPLETED'
        ).order_by('date')
    
    def get_trunc_function(self):
        """Get appropriate truncation function based on grouping."""
        grouping = self.filter_parameters.get('grouping', self.GROUPING_DAILY)
        
        if grouping == self.GROUPING_DAILY:
            return TruncDay('date')
        elif grouping == self.GROUPING_WEEKLY:
            return TruncWeek('date')
        elif grouping == self.GROUPING_MONTHLY:
            return TruncMonth('date')
        else:
            return TruncDay('date')  # Default
    
    def generate(self) -> Dict[str, Any]:
        """Generate sales by period report."""
        self.validate_filters()
        
        queryset = self.get_base_queryset()
        queryset = self.apply_date_filter(queryset, 'date')
        
        # Apply period truncation
        trunc_func = self.get_trunc_function()
        
        period_sales = queryset.annotate(
            period=trunc_func
        ).values('period').annotate(
            order_count=Count('id'),
            total_revenue=Sum('grand_total'),
            avg_order_value=Avg('grand_total')
        ).order_by('period')
        
        data = list(period_sales)
        
        # Calculate growth and cumulative
        cumulative_revenue = 0
        previous_revenue = 0
        
        for idx, row in enumerate(data):
            # Format period
            row['period_label'] = self.format_period(row['period'])
            
            # Calculate cumulative
            cumulative_revenue += row['total_revenue']
            row['cumulative_revenue'] = cumulative_revenue
            
            # Calculate growth
            if idx > 0:
                row['revenue_growth'] = row['total_revenue'] - previous_revenue
                row['revenue_growth_pct'] = (
                    (row['revenue_growth'] / previous_revenue * 100)
                    if previous_revenue > 0 else 0
                )
            else:
                row['revenue_growth'] = 0
                row['revenue_growth_pct'] = 0
            
            previous_revenue = row['total_revenue']
        
        return {
            'report_type': self.REPORT_TYPE,
            'report_title': self.get_report_title(),
            'generated_at': timezone.now(),
            'period': self.get_period_string(),
            'grouping': self.filter_parameters.get('grouping'),
            'filters': self.filter_parameters,
            'data': data,
            'totals': self.calculate_period_totals(data),
            'row_count': len(data),
            'metadata': self.get_metadata()
        }
    
    def format_period(self, period_date):
        """Format period date for display."""
        grouping = self.filter_parameters.get('grouping', self.GROUPING_DAILY)
        
        if grouping == self.GROUPING_DAILY:
            return period_date.strftime('%Y-%m-%d (%A)')  # 2026-01-25 (Saturday)
        elif grouping == self.GROUPING_WEEKLY:
            return period_date.strftime('Week of %Y-%m-%d')
        elif grouping == self.GROUPING_MONTHLY:
            return period_date.strftime('%B %Y')  # January 2026
        
        return str(period_date)
    
    def calculate_period_totals(self, data: List[Dict]) -> Dict:
        """Calculate period-specific totals."""
        if not data:
            return {
                'total_revenue': 0,
                'total_orders': 0,
                'period_count': 0
            }
        
        return {
            'total_revenue': sum(row['total_revenue'] for row in data),
            'total_orders': sum(row['order_count'] for row in data),
            'avg_period_revenue': sum(row['total_revenue'] for row in data) / len(data),
            'period_count': len(data),
            'best_period': max(data, key=lambda x: x['total_revenue'])['period_label'],
            'worst_period': min(data, key=lambda x: x['total_revenue'])['period_label']
        }
```

### Data Structure Example

```python
{
    "report_type": "SALES_BY_PERIOD",
    "report_title": "Sales by Period - January 2026",
    "grouping": "daily",
    "data": [
        {
            "period": "2026-01-01T00:00:00Z",
            "period_label": "2026-01-01 (Wednesday)",
            "order_count": 25,
            "total_revenue": 125000.00,
            "avg_order_value": 5000.00,
            "cumulative_revenue": 125000.00,
            "revenue_growth": 0,
            "revenue_growth_pct": 0
        },
        {
            "period": "2026-01-02T00:00:00Z",
            "period_label": "2026-01-02 (Thursday)",
            "order_count": 30,
            "total_revenue": 150000.00,
            "avg_order_value": 5000.00,
            "cumulative_revenue": 275000.00,
            "revenue_growth": 25000.00,
            "revenue_growth_pct": 20.0
        }
    ],
    "totals": {
        "total_revenue": 3750000.00,
        "total_orders": 856,
        "avg_period_revenue": 120967.74,
        "period_count": 31,
        "best_period": "2026-01-15 (Friday)",
        "worst_period": "2026-01-05 (Monday)"
    }
}
```

### Period Grouping Examples

```
Daily Grouping:
2026-01-01 (Wednesday)  125,000.00
2026-01-02 (Thursday)   150,000.00
2026-01-03 (Friday)     175,000.00

Weekly Grouping:
Week of 2026-01-01      850,000.00
Week of 2026-01-08      920,000.00
Week of 2026-01-15      980,000.00

Monthly Grouping:
January 2026          3,750,000.00
February 2026         4,200,000.00
March 2026            3,900,000.00
```

### Expected Outcome
- Time-series sales analysis
- Flexible period grouping
- Growth calculations
- Trend identification

### Verification Checklist
- [ ] by_period.py created
- [ ] SalesByPeriodReport class defined
- [ ] Period grouping implemented
- [ ] Growth calculations working
- [ ] Cumulative totals calculated
- [ ] Period formatting correct
- [ ] Report definition registered

---

## Task 28: Add Period Grouping

### Overview
Enhance the period grouping functionality with additional options and automatic grouping selection based on date range size.

### Dependencies
- Task 27: Create SalesByPeriodReport

### Instructions

1. **Add auto-grouping logic**
   - If date range <= 7 days: suggest DAILY
   - If date range <= 90 days: suggest WEEKLY
   - If date range > 90 days: suggest MONTHLY

2. **Add grouping validation**
   - Ensure grouping appropriate for date range
   - Warn if too many data points
   - Suggest alternative grouping

3. **Add quarter grouping**
   - QUARTERLY option
   - Group by fiscal quarters
   - Useful for year-long analysis

4. **Add year grouping**
   - YEARLY option
   - Multi-year analysis
   - Long-term trends

### Expected Outcome
- Smart auto-grouping
- Validation and warnings
- Additional grouping options

### Verification Checklist
- [ ] Auto-grouping implemented
- [ ] Validation working
- [ ] Quarter grouping added
- [ ] Year grouping added

---

## Task 29: Add Trend Visualization

### Overview
Add chart data generation for trend visualization in the SalesByPeriodReport, providing frontend-ready data structures for line charts, bar charts, and growth indicators.

### Dependencies
- Task 28: Add period grouping

### Instructions

1. **Add get_chart_data method**
   - Generates Recharts-compatible data structure
   - Includes line chart data for revenue trend
   - Includes bar chart data for order count
   - Returns JSON-serializable format

2. **Add trend analysis**
   - Calculate overall trend direction (up/down/stable)
   - Calculate trend percentage
   - Identify highest/lowest points
   - Add to metadata

3. **Add moving average**
   - Calculate 7-day moving average (for daily)
   - Smooth out daily fluctuations
   - Add to chart data

4. **Add forecast indicators**
   - Simple linear projection
   - Next period estimate
   - Optional feature

### Chart Data Structure

```python
def get_chart_data(self, report_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate chart-ready data for visualization.
    
    Args:
        report_data: Generated report data
        
    Returns:
        dict: Chart data structure
    """
    data = report_data['data']
    
    # Line chart data (revenue trend)
    line_chart_data = []
    for row in data:
        line_chart_data.append({
            'period': row['period_label'],
            'revenue': float(row['total_revenue']),
            'orders': row['order_count'],
            'avg_order_value': float(row['avg_order_value'])
        })
    
    # Calculate moving average (if daily)
    if self.filter_parameters.get('grouping') == self.GROUPING_DAILY:
        window_size = 7
        for i in range(len(line_chart_data)):
            if i >= window_size - 1:
                start_idx = i - window_size + 1
                window = line_chart_data[start_idx:i+1]
                avg_revenue = sum(d['revenue'] for d in window) / window_size
                line_chart_data[i]['moving_avg'] = avg_revenue
    
    # Trend analysis
    if len(data) >= 2:
        first_revenue = data[0]['total_revenue']
        last_revenue = data[-1]['total_revenue']
        trend_change = last_revenue - first_revenue
        trend_pct = (trend_change / first_revenue * 100) if first_revenue > 0 else 0
        
        if trend_pct > 5:
            trend_direction = 'up'
        elif trend_pct < -5:
            trend_direction = 'down'
        else:
            trend_direction = 'stable'
    else:
        trend_direction = 'unknown'
        trend_pct = 0
    
    return {
        'line_chart': line_chart_data,
        'trend': {
            'direction': trend_direction,
            'percentage': trend_pct,
            'highest_period': max(data, key=lambda x: x['total_revenue'])['period_label'],
            'lowest_period': min(data, key=lambda x: x['total_revenue'])['period_label']
        },
        'chart_config': {
            'x_axis': 'period',
            'y_axis_revenue': 'revenue',
            'y_axis_orders': 'orders',
            'currency': 'LKR'
        }
    }
```

### Visualization Examples

```
Line Chart (Revenue Trend):
Revenue
  ↑
  │                           ╱╲
  │                        ╱╲│ │
  │                     ╱╲│ ││ │
  │                  ╱╲│ ││ ││ │╲
  │               ╱╲│ ││ ││ ││ │ │╲
  │            ╱╲│ ││ ││ ││ ││ │ │ │
  └──────────────────────────────────→
     1  2  3  4  5  6  7  8  9  10    Day

Bar Chart (Order Count):
Orders
  ↑
  │    ██          ████
  │    ██    ██    ████    ██
  │    ██    ██    ████    ██    ██
  │    ██    ██    ████    ██    ██
  └────────────────────────────────→
       1     2     3      4     5    Week

Growth Indicators:
▲ +15.5% vs previous period
▲ Overall trend: Growing
★ Best day: Friday (175,000)
```

### Expected Outcome
- Chart-ready data structures
- Trend analysis
- Moving averages
- Visualization support

### Verification Checklist
- [ ] get_chart_data method added
- [ ] Line chart data generated
- [ ] Trend analysis implemented
- [ ] Moving average calculated
- [ ] Chart config included
- [ ] Data tested with frontend

---

## Task 30: Create SalesByChannelReport

### Overview
Create the SalesByChannelReport class that compares sales performance across different sales channels (POS vs Webstore). Enables channel performance analysis and optimization.

### Dependencies
- Task 29: Add trend visualization
- SalesInvoice model with channel field

### Instructions

1. **Create by_channel.py file**
   - Create at `apps/analytics/generators/sales/by_channel.py`
   - Import BaseReportGenerator

2. **Define SalesByChannelReport class**
   - Inherit from BaseReportGenerator
   - Define REPORT_TYPE constant

3. **Define channel constants**
   - CHANNEL_POS: Point of Sale transactions
   - CHANNEL_WEBSTORE: Online store orders
   - CHANNEL_MOBILE: Mobile app (if applicable)

4. **Implement generate method**
   - Groups sales by channel
   - Calculates metrics per channel
   - Calculates channel percentages
   - Returns comparison data

5. **Add channel comparison metrics**
   - Total revenue per channel
   - Order count per channel
   - Average order value per channel
   - Percentage of total sales
   - Growth comparison

### SalesByChannelReport Implementation

```python
class SalesByChannelReport(BaseReportGenerator):
    """
    Sales analysis by sales channel.
    
    Compares performance across different sales channels
    (POS, Webstore, Mobile) with metrics and percentages.
    
    Filters:
        - date_range (required): Date range for analysis
        - channel (optional): Filter specific channel
        
    Metrics:
        - Revenue per channel
        - Order count per channel
        - Average order value per channel
        - Percentage distribution
        - Channel preferences
    """
    
    REPORT_TYPE = "SALES_BY_CHANNEL"
    
    # Channel constants
    CHANNEL_POS = 'POS'
    CHANNEL_WEBSTORE = 'WEBSTORE'
    CHANNEL_MOBILE = 'MOBILE'
    
    def get_base_queryset(self):
        """Get base queryset for sales invoices."""
        return SalesInvoice.objects.filter(
            tenant=self.tenant,
            status='COMPLETED'
        )
    
    def generate(self) -> Dict[str, Any]:
        """Generate sales by channel report."""
        self.validate_filters()
        
        queryset = self.get_base_queryset()
        queryset = self.apply_date_filter(queryset, 'date')
        
        # Group by channel
        channel_sales = queryset.values('channel').annotate(
            order_count=Count('id'),
            total_revenue=Sum('grand_total'),
            avg_order_value=Avg('grand_total')
        ).order_by('-total_revenue')
        
        data = list(channel_sales)
        total_revenue = sum(row['total_revenue'] for row in data)
        total_orders = sum(row['order_count'] for row in data)
        
        # Add percentages and format
        for row in data:
            row['revenue_percentage'] = (
                (row['total_revenue'] / total_revenue * 100)
                if total_revenue > 0 else 0
            )
            row['order_percentage'] = (
                (row['order_count'] / total_orders * 100)
                if total_orders > 0 else 0
            )
            row['channel_name'] = self.get_channel_name(row['channel'])
        
        return {
            'report_type': self.REPORT_TYPE,
            'report_title': 'Sales by Channel',
            'generated_at': timezone.now(),
            'period': self.get_period_string(),
            'data': data,
            'totals': {
                'total_revenue': total_revenue,
                'total_orders': total_orders,
                'channel_count': len(data)
            },
            'metadata': {
                'dominant_channel': max(data, key=lambda x: x['total_revenue'])['channel_name'] if data else None,
                'chart_data': self.get_channel_chart_data(data)
            }
        }
    
    def get_channel_name(self, channel_code: str) -> str:
        """Get human-readable channel name."""
        names = {
            self.CHANNEL_POS: 'Point of Sale',
            self.CHANNEL_WEBSTORE: 'Online Store',
            self.CHANNEL_MOBILE: 'Mobile App'
        }
        return names.get(channel_code, channel_code)
```

### Data Structure Example

```python
{
    "report_type": "SALES_BY_CHANNEL",
    "data": [
        {
            "channel": "POS",
            "channel_name": "Point of Sale",
            "order_count": 650,
            "total_revenue": 3250000.00,
            "avg_order_value": 5000.00,
            "revenue_percentage": 65.0,
            "order_percentage": 70.0
        },
        {
            "channel": "WEBSTORE",
            "channel_name": "Online Store",
            "order_count": 280,
            "total_revenue": 1750000.00,
            "avg_order_value": 6250.00,
            "revenue_percentage": 35.0,
            "order_percentage": 30.0
        }
    ],
    "totals": {
        "total_revenue": 5000000.00,
        "total_orders": 930,
        "channel_count": 2
    }
}
```

### Expected Outcome
- Channel comparison report
- Revenue distribution
- Performance metrics per channel
- Dominant channel identification

### Verification Checklist
- [ ] by_channel.py created
- [ ] SalesByChannelReport class defined
- [ ] Channel aggregation working
- [ ] Percentages calculated
- [ ] Channel names formatted
- [ ] Report definition registered

---

## Task 31: Add Channel Comparison

### Overview
Enhance the channel report with advanced comparison features including cross-channel analytics and preference patterns.

### Dependencies
- Task 30: Create SalesByChannelReport

### Instructions

1. **Add period-over-period comparison**
   - Compare current period to previous
   - Calculate growth per channel
   - Identify channel trends

2. **Add product preferences by channel**
   - Top products per channel
   - Channel-specific popular items
   - Cross-channel patterns

3. **Add time-of-day analysis**
   - Peak hours per channel
   - Channel usage patterns
   - Optimization insights

4. **Add pie chart data**
   - Revenue distribution
   - Order count distribution
   - Visual comparison

### Expected Outcome
- Enhanced channel analytics
- Cross-channel insights
- Usage pattern analysis
- Visualization data

### Verification Checklist
- [ ] Period comparison added
- [ ] Product preferences analyzed
- [ ] Time patterns identified
- [ ] Chart data generated

---

## Task 32: Create SalesByCashierReport

### Overview
Create the SalesByCashierReport class that tracks individual cashier performance including sales volume, transaction count, and efficiency metrics.

### Dependencies
- Task 31: Add channel comparison
- Staff/User model exists

### Instructions

1. **Create by_cashier.py file**
   - Create at `apps/analytics/generators/sales/by_cashier.py`
   - Import BaseReportGenerator

2. **Define SalesByCashierReport class**
   - Inherit from BaseReportGenerator
   - Define REPORT_TYPE constant

3. **Implement generate method**
   - Groups sales by cashier/user
   - Calculates performance metrics
   - Ranks cashiers by performance
   - Returns cashier data

4. **Add cashier identification**
   - Cashier name
   - Employee ID
   - Shift information (if applicable)

5. **Add basic metrics**
   - Total sales amount
   - Transaction count
   - Average transaction value
   - Items per transaction

### SalesByCashierReport Implementation

```python
class SalesByCashierReport(BaseReportGenerator):
    """
    Sales performance by cashier/staff member.
    
    Tracks individual staff performance with transaction
    counts, sales totals, and efficiency metrics.
    
    Filters:
        - date_range (required): Date range for analysis
        - location (optional): Warehouse filter
        - cashier (optional): Specific cashier filter
        
    Metrics:
        - Total sales amount
        - Transaction count
        - Average transaction value
        - Items per transaction
        - Sales per hour (if shift data available)
        - Performance rank
    """
    
    REPORT_TYPE = "SALES_BY_CASHIER"
    
    def get_base_queryset(self):
        """Get base queryset for sales invoices."""
        return SalesInvoice.objects.filter(
            tenant=self.tenant,
            status='COMPLETED',
            channel='POS'  # Usually cashier reports are POS-specific
        ).select_related('created_by')
    
    def generate(self) -> Dict[str, Any]:
        """Generate sales by cashier report."""
        self.validate_filters()
        
        queryset = self.get_base_queryset()
        queryset = self.apply_date_filter(queryset, 'date')
        
        # Aggregate by cashier
        cashier_sales = queryset.values(
            'created_by_id',
            'created_by__username',
            'created_by__first_name',
            'created_by__last_name'
        ).annotate(
            transaction_count=Count('id'),
            total_sales=Sum('grand_total'),
            avg_transaction_value=Avg('grand_total'),
            total_items=Sum('lines__quantity')
        ).order_by('-total_sales')
        
        data = list(cashier_sales)
        
        # Add derived metrics
        for idx, row in enumerate(data, start=1):
            row['rank'] = idx
            row['cashier_name'] = f"{row.get('created_by__first_name', '')} {row.get('created_by__last_name', '')}".strip()
            if not row['cashier_name']:
                row['cashier_name'] = row.get('created_by__username', 'Unknown')
            
            # Items per transaction
            row['items_per_transaction'] = (
                row['total_items'] / row['transaction_count']
                if row['transaction_count'] > 0 else 0
            )
            
            # Clean up field names
            row['cashier_id'] = row.pop('created_by_id')
            row.pop('created_by__username', None)
            row.pop('created_by__first_name', None)
            row.pop('created_by__last_name', None)
        
        return {
            'report_type': self.REPORT_TYPE,
            'report_title': 'Sales by Cashier',
            'generated_at': timezone.now(),
            'period': self.get_period_string(),
            'data': data,
            'totals': self.calculate_cashier_totals(data),
            'metadata': self.get_metadata()
        }
```

### Data Structure Example

```python
{
    "report_type": "SALES_BY_CASHIER",
    "data": [
        {
            "rank": 1,
            "cashier_id": 15,
            "cashier_name": "Nimal Perera",
            "transaction_count": 125,
            "total_sales": 625000.00,
            "avg_transaction_value": 5000.00,
            "total_items": 450,
            "items_per_transaction": 3.6
        },
        {
            "rank": 2,
            "cashier_id": 23,
            "cashier_name": "Kumari Silva",
            "transaction_count": 110,
            "total_sales": 550000.00,
            "avg_transaction_value": 5000.00,
            "total_items": 380,
            "items_per_transaction": 3.5
        }
    ],
    "totals": {
        "total_sales": 2500000.00,
        "total_transactions": 580,
        "total_cashiers": 8,
        "avg_sales_per_cashier": 312500.00
    }
}
```

### Expected Outcome
- Cashier performance tracking
- Transaction metrics
- Performance ranking
- Efficiency indicators

### Verification Checklist
- [ ] by_cashier.py created
- [ ] SalesByCashierReport class defined
- [ ] Cashier aggregation working
- [ ] Metrics calculated correctly
- [ ] Ranking implemented
- [ ] Report definition registered

---

## Task 33: Add Cashier Performance Metrics

### Overview
Enhance the cashier report with advanced performance metrics including efficiency scores, conversion rates, and comparative analysis.

### Dependencies
- Task 32: Create SalesByCashierReport

### Instructions

1. **Add efficiency score**
   - Calculate based on multiple factors
   - Transaction speed (if timestamp data available)
   - Items per transaction
   - Average transaction value
   - Composite score 0-100

2. **Add performance indicators**
   - Top performer identification
   - Below average indicators
   - Improvement suggestions

3. **Add time-based metrics**
   - Sales per hour (if shift data available)
   - Peak performance times
   - Consistency score

4. **Add comparison metrics**
   - Vs team average
   - Vs top performer
   - Growth vs previous period

### Performance Metrics Structure

```python
{
    "rank": 1,
    "cashier_name": "Nimal Perera",
    "transaction_count": 125,
    "total_sales": 625000.00,
    "avg_transaction_value": 5000.00,
    "items_per_transaction": 3.6,
    
    # Advanced metrics
    "efficiency_score": 85.5,  # 0-100 scale
    "sales_per_hour": 78125.00,  # If shift hours available
    "consistency_score": 92.0,  # Variance measure
    
    # Comparisons
    "vs_team_avg": +15.5,  # Percentage above team average
    "vs_top_performer": -5.0,  # Percentage vs #1
    
    # Performance indicators
    "performance_level": "Above Average",  # Below/Average/Above/Top
    "strengths": ["High transaction value", "Consistent performance"],
    "improvement_areas": ["Transaction speed"]
}
```

### Expected Outcome
- Comprehensive performance metrics
- Efficiency scoring
- Comparative analysis
- Performance insights

### Verification Checklist
- [ ] Efficiency score calculated
- [ ] Performance indicators added
- [ ] Time-based metrics implemented
- [ ] Comparison metrics working
- [ ] Performance levels assigned

---

## Task 34: Create Sales Report API Endpoint

### Overview
Create a REST API endpoint for generating and retrieving sales reports. Enables frontend integration and report access through the API.

### Dependencies
- Task 33: Add cashier performance metrics
- Django REST Framework configured

### Instructions

1. **Create reports.py in views**
   - Create at `apps/analytics/views/reports.py`
   - Import required DRF components

2. **Create SalesReportViewSet**
   - Inherit from ViewSet
   - Add generate action
   - Add list action for report history
   - Add retrieve action for specific report

3. **Implement generate endpoint**
   - POST /api/analytics/reports/sales/generate/
   - Accepts report_code and filter_parameters
   - Creates ReportInstance
   - Queues Celery task
   - Returns instance ID and status

4. **Implement list endpoint**
   - GET /api/analytics/reports/sales/
   - Lists user's report history
   - Filters by status, date range
   - Pagination support

5. **Implement retrieve endpoint**
   - GET /api/analytics/reports/sales/{id}/
   - Returns report instance details
   - Includes download URL if completed

6. **Implement download endpoint**
   - GET /api/analytics/reports/sales/{id}/download/
   - Serves generated file
   - Updates access tracking
   - Supports format parameter

7. **Add serializers**
   - ReportDefinitionSerializer
   - ReportInstanceSerializer
   - ReportGenerateSerializer

8. **Register URLs**
   - Add to analytics/urls.py
   - Include in main URL configuration

### API Endpoint Implementation

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from apps.analytics.models import ReportDefinition, ReportInstance
from apps.analytics.tasks import generate_report_task
from apps.analytics.serializers import (
    ReportDefinitionSerializer,
    ReportInstanceSerializer,
    ReportGenerateSerializer
)

class SalesReportViewSet(viewsets.ViewSet):
    """
    API endpoints for sales reports.
    
    Endpoints:
        - POST /api/analytics/reports/sales/generate/ - Generate new report
        - GET /api/analytics/reports/sales/ - List report history
        - GET /api/analytics/reports/sales/{id}/ - Get report details
        - GET /api/analytics/reports/sales/{id}/download/ - Download report
        - POST /api/analytics/reports/sales/{id}/cancel/ - Cancel generation
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """
        Generate a new sales report.
        
        Request body:
            {
                "report_code": "SALES_BY_PRODUCT",
                "filter_parameters": {
                    "date_range": {
                        "start_date": "2026-01-01",
                        "end_date": "2026-01-31"
                    }
                },
                "output_format": "PDF"
            }
        
        Returns:
            201: Report instance created and queued
            400: Invalid parameters
            403: Permission denied
            404: Report definition not found
        """
        serializer = ReportGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get report definition
        report_code = serializer.validated_data['report_code']
        try:
            definition = ReportDefinition.objects.get(
                tenant=request.user.tenant,
                code=report_code,
                is_active=True
            )
        except ReportDefinition.DoesNotExist:
            return Response(
                {'error': 'Report definition not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check permission
        if not definition.has_permission(request.user):
            return Response(
                {'error': 'You do not have permission to generate this report'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create report instance
        instance = ReportInstance.objects.create(
            tenant=request.user.tenant,
            report_definition=definition,
            user=request.user,
            filter_parameters=serializer.validated_data['filter_parameters'],
            output_format=serializer.validated_data.get('output_format', 'PDF'),
            status='PENDING'
        )
        
        # Queue generation task
        task = generate_report_task.delay(instance.id)
        instance.celery_task_id = task.id
        instance.save(update_fields=['celery_task_id'])
        
        return Response(
            ReportInstanceSerializer(instance).data,
            status=status.HTTP_201_CREATED
        )
    
    def list(self, request):
        """List user's report history."""
        queryset = ReportInstance.objects.filter(
            tenant=request.user.tenant,
            user=request.user
        ).order_by('-created_at')
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Pagination
        page = self.paginate_queryset(queryset)
        serializer = ReportInstanceSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get specific report instance."""
        try:
            instance = ReportInstance.objects.get(
                id=pk,
                tenant=request.user.tenant,
                user=request.user
            )
        except ReportInstance.DoesNotExist:
            return Response(
                {'error': 'Report not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(ReportInstanceSerializer(instance).data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download generated report file."""
        try:
            instance = ReportInstance.objects.get(
                id=pk,
                tenant=request.user.tenant,
                user=request.user
            )
        except ReportInstance.DoesNotExist:
            return Response(
                {'error': 'Report not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if instance.status != 'COMPLETED':
            return Response(
                {'error': 'Report is not ready for download'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not instance.output_file:
            return Response(
                {'error': 'Report file not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update access tracking
        instance.increment_access()
        
        # Serve file
        response = FileResponse(
            instance.output_file.open('rb'),
            content_type=self.get_content_type(instance.output_format)
        )
        response['Content-Disposition'] = f'attachment; filename="{instance.output_file.name}"'
        
        return response
    
    def get_content_type(self, format_code):
        """Get MIME type for format."""
        types = {
            'PDF': 'application/pdf',
            'EXCEL': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'CSV': 'text/csv'
        }
        return types.get(format_code, 'application/octet-stream')
```

### URL Configuration

```python
# apps/analytics/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.analytics.views.reports import SalesReportViewSet

router = DefaultRouter()
router.register(r'sales', SalesReportViewSet, basename='sales-report')

urlpatterns = [
    path('reports/', include(router.urls)),
]
```

### API Usage Examples

```python
# Generate report
POST /api/analytics/reports/sales/generate/
{
    "report_code": "SALES_BY_PRODUCT",
    "filter_parameters": {
        "date_range": {
            "start_date": "2026-01-01",
            "end_date": "2026-01-31"
        },
        "category": [1, 2, 3]
    },
    "output_format": "PDF"
}

Response 201:
{
    "id": 123,
    "report_definition": {
        "code": "SALES_BY_PRODUCT",
        "name": "Sales by Product"
    },
    "status": "PENDING",
    "created_at": "2026-01-25T14:30:00Z",
    "estimated_time": "2 minutes"
}

# Check status
GET /api/analytics/reports/sales/123/

Response 200:
{
    "id": 123,
    "status": "COMPLETED",
    "generated_at": "2026-01-25T14:32:15Z",
    "download_url": "/api/analytics/reports/sales/123/download/",
    "file_size": "1.2 MB"
}

# Download report
GET /api/analytics/reports/sales/123/download/
Response: PDF file download
```

### Expected Outcome
- Complete REST API for reports
- Report generation endpoint
- Report listing and retrieval
- Download functionality
- Access tracking

### Verification Checklist
- [ ] SalesReportViewSet created
- [ ] generate endpoint implemented
- [ ] list endpoint implemented
- [ ] retrieve endpoint implemented
- [ ] download endpoint implemented
- [ ] Serializers created
- [ ] URLs registered
- [ ] Permissions configured
- [ ] API tested
- [ ] Documentation added

---

## Summary

This document completed the sales reporting system:

### Completed Infrastructure
- ✅ SalesByPeriodReport with time-series analysis
- ✅ Flexible period grouping (daily, weekly, monthly, quarterly, yearly)
- ✅ Trend visualization and chart data generation
- ✅ Moving averages and growth calculations
- ✅ SalesByChannelReport with channel comparison
- ✅ Cross-channel analytics and preferences
- ✅ SalesByCashierReport with performance metrics
- ✅ Efficiency scoring and comparative analysis
- ✅ Complete REST API for report access
- ✅ Report generation, listing, download endpoints

### Key Achievements
1. **Time-Series Analysis** - Comprehensive period-based reporting
2. **Channel Comparison** - Multi-channel performance analysis
3. **Staff Performance** - Individual cashier tracking and ranking
4. **Trend Visualization** - Chart-ready data for frontend display
5. **REST API** - Complete API for report management
6. **Access Tracking** - Download monitoring and analytics

### Next Steps
Proceed to [Group-C_Inventory-Purchase-Reports](../Group-C_Inventory-Purchase-Reports/) to implement inventory and purchase reporting functionality.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~956
