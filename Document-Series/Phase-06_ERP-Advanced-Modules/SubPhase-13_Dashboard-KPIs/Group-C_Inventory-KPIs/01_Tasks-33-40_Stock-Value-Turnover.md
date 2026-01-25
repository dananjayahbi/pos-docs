# Tasks 33-40: Stock Value and Turnover Metrics

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** C - Inventory KPIs  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-48_Stock-Analysis-Caching.md](02_Tasks-41-48_Stock-Analysis-Caching.md)

---

## Document Overview

This document covers the creation of the InventoryKPICalculator with core stock valuation and movement metrics. Implements total stock value calculation, low stock and out of stock counts, overstock identification, inventory turnover ratio, days of inventory, and fast-moving product analysis. These metrics provide real-time insights into inventory health and efficiency.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create InventoryKPICalculator | Medium | 30 min |
| 34 | Add Stock Value KPI | Medium | 25 min |
| 35 | Add Low Stock Items KPI | Medium | 30 min |
| 36 | Add Out of Stock KPI | Low | 15 min |
| 37 | Add Overstock Items KPI | Medium | 25 min |
| 38 | Add Inventory Turnover KPI | High | 45 min |
| 39 | Add Days of Inventory KPI | Medium | 20 min |
| 40 | Add Fast Moving Products KPI | Medium | 30 min |

---

## Task 33: Create InventoryKPICalculator

### Overview
Create the InventoryKPICalculator class that extends BaseKPICalculator to handle all inventory-related performance metrics. This calculator serves as the foundation for stock valuation, movement analysis, and reorder alerts.

### Dependencies
- BaseKPICalculator class exists (`apps/dashboard/calculators/base.py`)
- StockLevel model exists
- Product model exists
- StockMovement model exists

### Instructions

1. **Create inventory.py calculator file**
   - Navigate to `apps/dashboard/calculators/` directory
   - Create new file named `inventory.py`
   - This will contain inventory-specific KPI calculations

2. **Import required modules**
   - Import Django ORM components (Q, F, Sum, Avg, Count)
   - Import datetime and timedelta for date calculations
   - Import Decimal for precise monetary calculations
   - Import BaseKPICalculator from base module
   - Import StockLevel, Product, StockMovement models
   - Import Category and Warehouse models
   - Import logger for error tracking

3. **Define InventoryKPICalculator class**
   - Inherit from BaseKPICalculator
   - Add comprehensive class docstring
   - Document calculator purpose and key metrics

4. **Add category class attribute**
   - Set category = "INVENTORY"
   - Identifies KPI category in responses

5. **Override get_cache_prefix method**
   - Return "kpi:inventory"
   - Used for Redis cache key generation

6. **Add get_all_kpis method**
   - Override base method
   - Return dictionary with all inventory KPIs
   - Structure: stock_value, low_stock_count, out_of_stock_count, etc.

7. **Add _get_active_products queryset method**
   - Filter products by is_active=True
   - Filter by tenant
   - Exclude products marked as deleted
   - Return optimized queryset

8. **Add _get_stock_levels queryset method**
   - Get stock levels for active products
   - Filter by tenant
   - Select related product and warehouse
   - Return annotated queryset

9. **Update calculators/__init__.py**
   - Import InventoryKPICalculator
   - Add to __all__ list
   - Export for use in views

### InventoryKPICalculator Structure

```
┌─────────────────────────────────────────────────┐
│        InventoryKPICalculator                   │
├─────────────────────────────────────────────────┤
│ Inherits from: BaseKPICalculator                │
│                                                 │
│ Attributes:                                     │
│  • category = "INVENTORY"                       │
│                                                 │
│ Core Methods:                                   │
│  • get_all_kpis()                               │
│  • get_stock_value()          [Task 34]         │
│  • get_low_stock_count()      [Task 35]         │
│  • get_out_of_stock_count()   [Task 36]         │
│  • get_overstock_count()      [Task 37]         │
│  • get_inventory_turnover()   [Task 38]         │
│  • get_days_of_inventory()    [Task 39]         │
│  • get_fast_moving_products() [Task 40]         │
│                                                 │
│ Helper Methods:                                 │
│  • _get_active_products()                       │
│  • _get_stock_levels()                          │
│  • get_cache_prefix()                           │
└─────────────────────────────────────────────────┘
```

### Calculator Hierarchy

```
┌──────────────────────┐
│  BaseKPICalculator   │
│  (apps/dashboard/    │
│   calculators/base)  │
└──────────┬───────────┘
           │
           │ Inherits
           ▼
┌──────────────────────┐
│ InventoryKPI         │
│ Calculator           │
│                      │
│ • Stock metrics      │
│ • Movement analysis  │
│ • Reorder alerts     │
└──────────────────────┘
```

### Data Sources

| Model | Purpose | Key Fields |
|-------|---------|------------|
| StockLevel | Current inventory | quantity, product, warehouse |
| Product | Product details | name, cost, reorder_point, max_stock |
| StockMovement | Historical data | quantity, movement_type, created_at |
| Category | Stock grouping | name, parent |
| Warehouse | Location tracking | name, code |

### Expected Outcome
- Functional InventoryKPICalculator class
- Proper inheritance from BaseKPICalculator
- Foundation for inventory metrics
- Optimized database queries

### Verification Checklist
- [ ] inventory.py file created
- [ ] All required imports added
- [ ] InventoryKPICalculator class defined
- [ ] Inherits from BaseKPICalculator
- [ ] category attribute set to "INVENTORY"
- [ ] get_cache_prefix method implemented
- [ ] get_all_kpis method defined (skeleton)
- [ ] _get_active_products helper method added
- [ ] _get_stock_levels helper method added
- [ ] Class imported in __init__.py

---

## Task 34: Add Stock Value KPI

### Overview
Implement the get_stock_value method to calculate the total monetary value of all inventory on hand. Uses FIFO cost basis for accurate valuation, considering quantity on hand multiplied by unit cost for each product.

### Dependencies
- Task 33: Create InventoryKPICalculator

### Instructions

1. **Open inventory.py calculator file**
   - Navigate to `apps/dashboard/calculators/inventory.py`
   - Locate InventoryKPICalculator class

2. **Add get_stock_value method**
   - Define method with start_date and end_date optional parameters
   - Add comprehensive docstring explaining calculation

3. **Get stock levels queryset**
   - Use _get_stock_levels helper method
   - Filter for quantity > 0
   - Select related product for cost access

4. **Calculate total value**
   - Aggregate stock levels
   - Annotate with value calculation (quantity × unit_cost)
   - Sum all annotated values
   - Handle null/zero cases

5. **Get comparison value**
   - Calculate stock value from previous period
   - Use same date range length
   - Determine trend (up/down/stable)

6. **Calculate trend percentage**
   - Compare current vs previous values
   - Calculate percentage change
   - Handle division by zero

7. **Format response**
   - Return dictionary with value, formatted, trend, change_percent
   - Format currency as LKR
   - Include interpretation (healthy/warning/critical)

8. **Add error handling**
   - Try-except block for calculations
   - Log errors appropriately
   - Return zero value on error

9. **Update get_all_kpis method**
   - Call get_stock_value()
   - Add result to kpis dictionary with key "stock_value"

### Stock Value Calculation Formula

```
Stock Value Calculation
═══════════════════════

Total Value = Σ (Quantity on Hand × Unit Cost)

For each product:
  Product A: 100 units × LKR 500 = LKR 50,000
  Product B: 50 units × LKR 1,200 = LKR 60,000
  Product C: 200 units × LKR 150 = LKR 30,000
  ─────────────────────────────────────────────
  Total Stock Value:           LKR 140,000
```

### FIFO Cost Basis

```
FIFO (First In, First Out) Valuation
═════════════════════════════════════

Purchase History:
  Jan 1:  50 units @ LKR 100 = LKR 5,000
  Jan 15: 75 units @ LKR 110 = LKR 8,250
  Jan 30: 50 units @ LKR 120 = LKR 6,000

Sales: 80 units sold

Remaining Inventory (FIFO):
  From Jan 15: 45 units @ LKR 110 = LKR 4,950
  From Jan 30: 50 units @ LKR 120 = LKR 6,000
  ──────────────────────────────────────────
  Total: 95 units valued at    LKR 10,950
```

### Stock Value Response Structure

```json
{
  "stock_value": {
    "value": 5250000.00,
    "formatted": "LKR 5,250,000.00",
    "trend": "up",
    "change_percent": 3.2,
    "previous_value": 5087500.00,
    "interpretation": "healthy"
  }
}
```

### Trend Determination Logic

| Condition | Trend | Interpretation |
|-----------|-------|----------------|
| change > +5% | "up" | Increasing investment |
| change > 0 and ≤ +5% | "stable_up" | Slight increase |
| change = 0 | "stable" | No change |
| change < 0 and ≥ -5% | "stable_down" | Slight decrease |
| change < -5% | "down" | Decreasing investment |

### Interpretation Guidelines

| Stock Value Change | Status | Business Implication |
|-------------------|--------|----------------------|
| +10% or more | Warning | Possible overstocking |
| +5% to +10% | Normal | Healthy growth |
| -5% to +5% | Healthy | Stable inventory |
| -10% to -5% | Normal | Inventory reduction |
| -10% or less | Warning | Possible stockout risk |

### Sri Lankan Context

#### Typical Stock Values by Business Type
| Business Type | Average Stock Value | Turnover Period |
|--------------|--------------------|-----------------| 
| Small Retail Shop | LKR 500,000 - 2M | 30-45 days |
| Supermarket | LKR 5M - 50M | 15-30 days |
| Pharmacy | LKR 1M - 10M | 60-90 days |
| Electronics Store | LKR 3M - 30M | 45-60 days |
| Restaurant | LKR 200K - 1M | 7-14 days |

### Stock Value by Category Example

```
Stock Value Breakdown (Sample Supermarket)
═══════════════════════════════════════════

Category              Value (LKR)    % of Total
─────────────────────────────────────────────
Rice & Grains         1,250,000      23.8%
Beverages              875,000       16.7%
Dairy Products         625,000       11.9%
Personal Care          550,000       10.5%
Cleaning Supplies      450,000        8.6%
Snacks                 400,000        7.6%
Frozen Foods           350,000        6.7%
Others                 750,000       14.3%
─────────────────────────────────────────────
Total Stock Value    5,250,000      100.0%
```

### Error Handling Scenarios

| Scenario | Handling | Response |
|----------|----------|----------|
| No stock data | Return zero value | value: 0, trend: "stable" |
| Missing cost data | Log warning, exclude product | Calculate with available data |
| Negative quantity | Log error, exclude | Calculate with positive values only |
| Database error | Log exception | Return cached value or zero |

### Expected Outcome
- Accurate stock valuation
- Trend analysis vs previous period
- Formatted LKR currency display
- Interpretation for business decisions

### Verification Checklist
- [ ] get_stock_value method implemented
- [ ] FIFO cost basis applied
- [ ] Aggregation calculates correctly
- [ ] Comparison with previous period included
- [ ] Trend direction determined
- [ ] Change percentage calculated
- [ ] Currency formatted as LKR
- [ ] Error handling implemented
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 35: Add Low Stock Items KPI

### Overview
Implement the get_low_stock_count method to identify and count products that have reached or fallen below their reorder point but are not yet out of stock. This metric alerts managers to products requiring reordering soon.

### Dependencies
- Task 34: Add Stock Value KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_stock_value

2. **Add get_low_stock_count method**
   - Define method with optional threshold_percentage parameter
   - Default threshold to 100% (at or below reorder point)
   - Add docstring explaining low stock criteria

3. **Get active products with stock levels**
   - Use _get_stock_levels helper
   - Filter for quantity > 0 (exclude out of stock)
   - Filter for products with reorder_point defined

4. **Apply low stock filter**
   - Compare current quantity to reorder_point
   - Use threshold: quantity ≤ reorder_point
   - Option: quantity ≤ (reorder_point × threshold_percentage)
   - Exclude products at zero quantity

5. **Count low stock items**
   - Use count() aggregation
   - Return integer count

6. **Determine urgency level**
   - Critical: count >= 25
   - Warning: count >= 10
   - Normal: count < 10

7. **Get detailed low stock list**
   - Return top 10 products by urgency
   - Include product name, SKU, current qty, reorder point
   - Calculate shortage (reorder_point - current_qty)
   - Order by severity (lowest stock percentage first)

8. **Format response**
   - Return dictionary with count, urgency, items list
   - Include threshold used
   - Add interpretation message

9. **Update get_all_kpis method**
   - Call get_low_stock_count()
   - Add result to kpis dictionary with key "low_stock_count"

### Low Stock Calculation Logic

```
Low Stock Criteria
══════════════════

For each product:
  IF quantity > 0 AND quantity ≤ reorder_point
    THEN product is "Low Stock"

Example:
  Product: Rice 5kg
  Current Quantity: 15 units
  Reorder Point: 20 units
  Status: LOW STOCK ⚠️

  Product: Sugar 1kg
  Current Quantity: 50 units
  Reorder Point: 30 units
  Status: NORMAL ✓
```

### Stock Status Levels

```
Stock Level Hierarchy
═════════════════════

                ┌─────────────────┐
                │   OVERSTOCK     │  qty > max_stock_level
                │  (Too much)     │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │     NORMAL      │  reorder_point < qty ≤ max_stock_level
                │    (Healthy)    │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   LOW STOCK     │  0 < qty ≤ reorder_point
                │  (Reorder soon) │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │  OUT OF STOCK   │  qty = 0
                │   (Critical!)   │
                └─────────────────┘
```

### Urgency Level Matrix

| Low Stock Count | Urgency | Alert Color | Action Required |
|----------------|---------|-------------|-----------------|
| 1-9 items | Normal | Blue | Monitor daily |
| 10-24 items | Warning | Yellow | Review immediately |
| 25+ items | Critical | Red | Urgent action needed |

### Low Stock Response Structure

```json
{
  "low_stock_count": {
    "value": 15,
    "urgency": "warning",
    "threshold": 100,
    "interpretation": "15 items need reordering soon",
    "items": [
      {
        "product_id": 123,
        "product_name": "Rice 5kg - Basmati",
        "sku": "RICE-5KG-BASM",
        "current_qty": 15,
        "reorder_point": 20,
        "shortage": 5,
        "stock_percentage": 75.0,
        "suggested_order_qty": 50
      }
    ]
  }
}
```

### Sri Lankan Retail Examples

#### Supermarket Low Stock Scenarios
| Product | Current Qty | Reorder Point | Status | Notes |
|---------|------------|---------------|--------|-------|
| Rice 5kg (Nadu) | 18 | 30 | Low Stock | High demand staple |
| Coconut Oil 1L | 25 | 40 | Low Stock | Fast-moving item |
| Dhal 500g | 12 | 25 | Low Stock | Essential cooking item |
| Tea Bags 100s | 8 | 20 | Low Stock | Daily consumption |
| Sugar 1kg | 15 | 35 | Low Stock | High volume item |

#### Pharmacy Low Stock Example
```
Low Stock Alert - Pharmacy
══════════════════════════

Critical Items (Below 25% of reorder point):
  • Panadol 500mg      - 5 units  (Reorder: 20)
  • Vitamin C          - 3 units  (Reorder: 15)

Warning Items (Below reorder point):
  • Bandages           - 18 units (Reorder: 25)
  • Cotton Wool        - 12 units (Reorder: 20)
  • Antiseptic Cream   - 8 units  (Reorder: 15)

Total Low Stock Items: 5
Urgency: WARNING ⚠️
```

### Threshold Percentage Usage

| Threshold | Criteria | Use Case |
|-----------|----------|----------|
| 100% | qty ≤ reorder_point | Standard low stock alert |
| 75% | qty ≤ 75% of reorder_point | Early warning system |
| 50% | qty ≤ 50% of reorder_point | Critical low stock only |
| 125% | qty ≤ 125% of reorder_point | Conservative alerting |

### Suggested Order Quantity Calculation

```
Suggested Order Qty Formula
════════════════════════════

suggested_qty = max_stock_level - current_qty

OR (if max_stock_level not set):

suggested_qty = (reorder_point × 2) - current_qty

Example:
  Product: Rice 5kg
  Current: 15 units
  Reorder Point: 20 units
  Max Stock: 100 units
  
  Suggested Order = 100 - 15 = 85 units
```

### Expected Outcome
- Accurate count of low stock items
- Urgency level determination
- Detailed list of affected products
- Proactive reorder alerts

### Verification Checklist
- [ ] get_low_stock_count method implemented
- [ ] Filters for quantity > 0
- [ ] Compares against reorder_point
- [ ] Urgency level determined
- [ ] Top 10 low stock items included
- [ ] Shortage calculation accurate
- [ ] Stock percentage calculated
- [ ] Suggested order quantity provided
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 36: Add Out of Stock KPI

### Overview
Implement the get_out_of_stock_count method to identify and count products with zero quantity available. This critical metric highlights immediate supply chain issues requiring urgent attention.

### Dependencies
- Task 35: Add Low Stock Items KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_low_stock_count

2. **Add get_out_of_stock_count method**
   - Define method with no parameters needed
   - Add docstring explaining out of stock criteria

3. **Get active products with zero stock**
   - Use _get_stock_levels helper
   - Filter for quantity = 0
   - Filter for is_active = True (exclude discontinued)

4. **Count out of stock items**
   - Use count() aggregation
   - Return integer count

5. **Determine urgency level**
   - Critical: count > 5
   - Warning: count > 0
   - Normal: count = 0

6. **Get out of stock product details**
   - Return list of all out of stock products
   - Include product name, SKU, category
   - Include last stock date (when it ran out)
   - Include last sale date
   - Calculate days out of stock

7. **Identify high-priority items**
   - Flag products with recent sales (last 7 days)
   - Flag products with high sales velocity
   - Flag products marked as essential

8. **Format response**
   - Return dictionary with count, urgency, items list
   - Include high_priority_count
   - Add interpretation message

9. **Update get_all_kpis method**
   - Call get_out_of_stock_count()
   - Add result to kpis dictionary with key "out_of_stock_count"

### Out of Stock Criteria

```
Out of Stock Definition
═══════════════════════

Product is OUT OF STOCK when:
  • quantity = 0 OR
  • quantity IS NULL
  
AND product is:
  • is_active = True
  • NOT discontinued
  • NOT seasonal (outside season)
```

### Out of Stock Impact Analysis

```
Business Impact by Category
═══════════════════════════

High Impact (Critical):
  • Fast-moving products (daily sales)
  • Essential items (Rice, Bread, Milk)
  • Promotional items
  • High-margin products

Medium Impact (Warning):
  • Regular sellers (weekly sales)
  • Complementary products
  • Average-margin items

Low Impact (Monitor):
  • Slow-moving products
  • Seasonal items (off-season)
  • Low-margin products
```

### Urgency Determination Matrix

| Out of Stock Count | Urgency | Alert Level | Business Action |
|-------------------|---------|-------------|-----------------|
| 0 items | Normal | Green | No action |
| 1-5 items | Warning | Yellow | Review and restock |
| 6-15 items | Critical | Orange | Urgent restocking |
| 16+ items | Emergency | Red | Immediate action required |

### Out of Stock Response Structure

```json
{
  "out_of_stock_count": {
    "value": 3,
    "urgency": "critical",
    "high_priority_count": 2,
    "interpretation": "3 products out of stock, 2 are high priority",
    "items": [
      {
        "product_id": 456,
        "product_name": "Rice 5kg - Samba",
        "sku": "RICE-5KG-SAMB",
        "category": "Grains & Rice",
        "last_stock_date": "2026-01-20",
        "days_out_of_stock": 5,
        "last_sale_date": "2026-01-19",
        "is_high_priority": true,
        "priority_reason": "Recent sales activity",
        "average_daily_sales": 8.5,
        "lost_sales_estimate": 42
      }
    ]
  }
}
```

### Sri Lankan Retail Critical Items

#### Essential Products (High Priority)
| Product Category | Critical Items | Impact |
|-----------------|----------------|--------|
| Staples | Rice, Flour, Sugar, Lentils | Very High |
| Dairy | Milk, Curd, Butter | High |
| Beverages | Tea, Coffee, Soft drinks | High |
| Cooking | Coconut Oil, Cooking Oil, Spices | Very High |
| Hygiene | Soap, Toothpaste, Shampoo | Medium |

### Out of Stock Example Scenarios

#### Scenario 1: Supermarket Morning Rush
```
Out of Stock Alert - 8:00 AM
════════════════════════════

CRITICAL (Recent Sales):
  ❌ Rice 5kg (Samba)    - Out since: Yesterday
     Last sale: 2 hours ago
     Lost sales estimate: 15 units
  
  ❌ Fresh Milk 1L      - Out since: This morning
     Last sale: 1 hour ago
     Lost sales estimate: 8 units

WARNING (Slower Moving):
  ⚠️ Coconut Oil 1L     - Out since: 2 days ago
     Last sale: Yesterday

Total Out of Stock: 3 items
High Priority: 2 items
Action: URGENT RESTOCKING REQUIRED
```

#### Scenario 2: Pharmacy
```
Out of Stock Status - Pharmacy
═══════════════════════════════

CRITICAL:
  ❌ Panadol 500mg      - Customer turned away today
  ❌ Vitamin D3         - Prescribed item unavailable

Total: 2 items out of stock
Impact: High (essential medicines)
```

### Lost Sales Calculation

```
Lost Sales Estimate Formula
════════════════════════════

lost_sales = average_daily_sales × days_out_of_stock

Example:
  Product: Rice 5kg
  Avg Daily Sales: 8.5 units
  Days Out of Stock: 5 days
  
  Lost Sales = 8.5 × 5 = 42.5 units
  Lost Revenue = 42.5 × LKR 850 = LKR 36,125
```

### High Priority Flags

| Priority Flag | Criteria | Weight |
|--------------|----------|--------|
| Recent sales | Sale within last 7 days | High |
| High velocity | Avg > 5 units/day | High |
| Essential item | Marked as essential | High |
| High margin | Margin > 30% | Medium |
| Promotional | Active promotion | High |

### Days Out of Stock Tracking

```
Stock Status Timeline
═════════════════════

Day 0:  ✓ Last unit sold
Day 1:  ❌ First day out of stock (Warning)
Day 2:  ❌ Second day (Monitor lost sales)
Day 3:  ❌ Third day (Critical - take action)
Day 7+: ❌ Week+ out of stock (Emergency)
```

### Expected Outcome
- Accurate count of out of stock items
- Critical urgency alerts
- Prioritized list for restocking
- Lost sales estimation

### Verification Checklist
- [ ] get_out_of_stock_count method implemented
- [ ] Filters for quantity = 0
- [ ] Excludes discontinued products
- [ ] Urgency level determined
- [ ] All out of stock items listed
- [ ] Last stock date included
- [ ] Days out of stock calculated
- [ ] High priority items flagged
- [ ] Lost sales estimated
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 37: Add Overstock Items KPI

### Overview
Implement the get_overstock_count method to identify products with quantities exceeding their maximum stock level. Overstock ties up capital and warehouse space, indicating potential overpurchasing or declining sales.

### Dependencies
- Task 36: Add Out of Stock KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_out_of_stock_count

2. **Add get_overstock_count method**
   - Define method with optional threshold_percentage parameter
   - Default threshold to 100% (above max_stock_level)
   - Add docstring explaining overstock criteria

3. **Get products with max_stock_level defined**
   - Use _get_stock_levels helper
   - Filter for products with max_stock_level IS NOT NULL
   - Exclude products without maximum defined

4. **Apply overstock filter**
   - Compare current quantity to max_stock_level
   - Use threshold: quantity > max_stock_level
   - Option: quantity > (max_stock_level × threshold_percentage)

5. **Count overstock items**
   - Use count() aggregation
   - Return integer count

6. **Calculate excess quantity and value**
   - For each overstock item, calculate: excess_qty = quantity - max_stock_level
   - Calculate excess_value = excess_qty × unit_cost
   - Sum total excess value

7. **Get overstock item details**
   - Return top 10 products by excess value
   - Include product name, SKU, current qty, max level
   - Calculate excess quantity and value
   - Include carrying cost estimate

8. **Determine severity**
   - Severe: excess > 200% of max level
   - Moderate: excess > 100% of max level
   - Mild: excess > 50% of max level

9. **Format response**
   - Return dictionary with count, total_excess_value, items list
   - Include interpretation and recommendations
   - Suggest markdown discounts or promotions

10. **Update get_all_kpis method**
    - Call get_overstock_count()
    - Add result to kpis dictionary with key "overstock_count"

### Overstock Calculation Logic

```
Overstock Criteria
══════════════════

For each product:
  IF quantity > max_stock_level
    THEN product is "Overstock"

Example:
  Product: Seasonal Drink
  Current Quantity: 250 units
  Max Stock Level: 150 units
  Excess: 100 units
  Status: OVERSTOCK ⚠️
```

### Overstock Severity Levels

```
Excess Stock Severity
═════════════════════

              Current Qty
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    │        Max Stock Level    │
    │             │             │
    ├─────────────┤             │
    │   Normal    │   EXCESS    │
    └─────────────┴─────────────┘
                  
Severity:
  • 0-50% excess:    MILD
  • 51-100% excess:  MODERATE  
  • 101-200% excess: SEVERE
  • 200%+ excess:    CRITICAL
```

### Overstock Response Structure

```json
{
  "overstock_count": {
    "value": 8,
    "total_excess_value": 125000.00,
    "formatted_excess": "LKR 125,000.00",
    "interpretation": "8 products overstocked, LKR 125K tied up",
    "items": [
      {
        "product_id": 789,
        "product_name": "Mango Juice 1L - Summer",
        "sku": "JUICE-MJ-1L",
        "category": "Beverages",
        "current_qty": 250,
        "max_stock_level": 150,
        "excess_qty": 100,
        "unit_cost": 180.00,
        "excess_value": 18000.00,
        "excess_percentage": 66.7,
        "severity": "moderate",
        "carrying_cost_monthly": 450.00,
        "recommendation": "Consider 10-15% discount promotion"
      }
    ]
  }
}
```

### Business Impact of Overstock

| Impact Area | Effect | Cost Example (LKR) |
|------------|--------|-------------------|
| Capital Tied Up | Cash unavailable | 125,000 |
| Carrying Costs | Storage, insurance | 3,125/month (2.5%) |
| Obsolescence Risk | Products expire/spoil | Variable |
| Space Utilization | Warehouse crowding | Opportunity cost |
| Opportunity Cost | Could buy faster movers | Variable |

### Sri Lankan Context Examples

#### Seasonal Overstock Scenario
```
Overstock Analysis - Post-Festival
═══════════════════════════════════

After Sinhala/Tamil New Year:

SEVERE OVERSTOCK:
  • Kevum (Traditional Sweet)
     Current: 50 packs | Max: 10 packs
     Excess: 40 packs | Value: LKR 32,000
     Recommendation: 50% clearance sale

  • Kokis (Snack)
     Current: 35 packs | Max: 8 packs
     Excess: 27 packs | Value: LKR 16,200
     Recommendation: Bundle deals

MODERATE OVERSTOCK:
  • Gift Baskets
     Current: 20 units | Max: 12 units
     Excess: 8 units | Value: LKR 24,000
     Recommendation: Employee discounts

Total Excess Value: LKR 72,200
Monthly Carrying Cost: LKR 1,805
```

#### Beverage Overstock (Off-Season)
```
Overstock - Cooling Beverages (Monsoon Season)
═══════════════════════════════════════════════

Product: Soft Drinks & Juices
Reason: Lower demand in rainy season

Overstock Items:
  • Mango Juice 1L    - 100 units excess
  • Orange Juice 1L   - 85 units excess  
  • Cola 1.5L         - 60 units excess

Actions:
  ✓ Reduce reorder quantities
  ✓ Run "Monsoon Combo" promotion
  ✓ Increase shelf placement visibility
  ✓ Consider multi-buy discounts
```

### Carrying Cost Calculation

```
Monthly Carrying Cost Formula
═════════════════════════════

carrying_cost = excess_value × annual_rate / 12

Where annual_rate typically includes:
  • Storage cost:     8%
  • Insurance:        2%
  • Handling:         3%
  • Obsolescence:     5%
  • Interest cost:    12%
  ─────────────────
  Total annual rate: 30%

Example:
  Excess Value: LKR 125,000
  Annual Rate: 30%
  Monthly Cost = 125,000 × 0.30 / 12 = LKR 3,125
```

### Overstock Reduction Strategies

| Strategy | Timeline | Expected Result | Best For |
|----------|----------|-----------------|----------|
| Price Markdown | 1-2 weeks | 10-30% reduction | Fast movers |
| Bundle Deals | 2-4 weeks | 20-40% reduction | Complementary items |
| BOGO Offers | 1-2 weeks | 40-60% reduction | High demand products |
| Supplier Return | 2-4 weeks | Full clearance | Fresh produce |
| Liquidation | 1-3 months | 60-100% clearance | Slow movers |

### Markdown Recommendation Logic

```
Discount Recommendation
═══════════════════════

Based on excess percentage:

Excess 0-25%:     No discount needed
Excess 25-50%:    5-10% discount
Excess 50-100%:   10-15% discount
Excess 100-200%:  15-25% discount  
Excess 200%+:     25-50% clearance sale

AND consider:
  • Product shelf life
  • Seasonal factors
  • Historical sales velocity
  • Margin cushion
```

### Expected Outcome
- Accurate count of overstocked items
- Total excess value calculation
- Severity assessment
- Actionable reduction recommendations

### Verification Checklist
- [ ] get_overstock_count method implemented
- [ ] Filters for quantity > max_stock_level
- [ ] Excludes products without max level defined
- [ ] Excess quantity calculated
- [ ] Excess value calculated
- [ ] Severity level determined
- [ ] Top 10 items by value included
- [ ] Carrying cost estimated
- [ ] Discount recommendations provided
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 38: Add Inventory Turnover KPI

### Overview
Implement the get_inventory_turnover method to calculate the inventory turnover ratio, measuring how many times inventory is sold and replaced over a period. High turnover indicates efficient inventory management; low turnover suggests excess stock or slow sales.

### Dependencies
- Task 37: Add Overstock Items KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_overstock_count

2. **Add get_inventory_turnover method**
   - Define method with period parameter (default: "annual")
   - Support periods: "annual", "quarterly", "monthly"
   - Add comprehensive docstring with formula

3. **Calculate Cost of Goods Sold (COGS)**
   - Query StockMovement for outbound movements (sales)
   - Filter by movement_type = "SALE" or "OUTBOUND"
   - Filter by date range based on period
   - Multiply quantity by unit cost
   - Sum to get total COGS

4. **Calculate average inventory value**
   - Get beginning inventory value (start of period)
   - Get ending inventory value (end of period)
   - Calculate average: (beginning + ending) / 2

5. **Calculate turnover ratio**
   - Formula: Turnover = COGS / Average Inventory
   - Handle division by zero (return 0 if avg inventory = 0)
   - Round to 2 decimal places

6. **Determine interpretation**
   - Excellent: Turnover > 8
   - Good: Turnover 4-8
   - Fair: Turnover 2-4
   - Poor: Turnover < 2

7. **Calculate comparison**
   - Get turnover for previous period
   - Calculate trend (improving/declining)
   - Calculate percentage change

8. **Format response**
   - Return dictionary with ratio value, interpretation, trend
   - Include COGS and avg inventory for context
   - Add industry benchmark reference

9. **Update get_all_kpis method**
   - Call get_inventory_turnover()
   - Add result to kpis dictionary with key "inventory_turnover"

### Inventory Turnover Formula

```
Inventory Turnover Ratio
════════════════════════

Turnover = COGS / Average Inventory Value

Where:
  COGS = Cost of Goods Sold (for period)
  Average Inventory = (Beginning Inventory + Ending Inventory) / 2

Example (Annual):
  COGS (Year): LKR 24,000,000
  Beginning Inventory (Jan 1): LKR 6,000,000
  Ending Inventory (Dec 31): LKR 5,400,000
  
  Average Inventory = (6,000,000 + 5,400,000) / 2
                    = LKR 5,700,000
  
  Turnover = 24,000,000 / 5,700,000
           = 4.21 times per year
```

### Turnover Calculation Example

```
Monthly Turnover Calculation
════════════════════════════

Period: January 2026

Beginning Inventory (Jan 1):
  Stock value: LKR 5,250,000

Ending Inventory (Jan 31):
  Stock value: LKR 4,980,000

Average Inventory:
  (5,250,000 + 4,980,000) / 2 = LKR 5,115,000

Sales/COGS (January):
  Total COGS: LKR 1,850,000

Monthly Turnover:
  1,850,000 / 5,115,000 = 0.36 times

Annualized Turnover:
  0.36 × 12 = 4.32 times per year
```

### Inventory Turnover Response Structure

```json
{
  "inventory_turnover": {
    "value": 4.2,
    "period": "annual",
    "interpretation": "Good",
    "cogs": 24000000.00,
    "avg_inventory": 5700000.00,
    "formatted_cogs": "LKR 24,000,000.00",
    "formatted_avg_inventory": "LKR 5,700,000.00",
    "trend": "improving",
    "previous_value": 3.8,
    "change_percent": 10.5,
    "industry_benchmark": 5.0,
    "vs_benchmark": "Below benchmark"
  }
}
```

### Turnover Interpretation Guidelines

| Turnover Ratio | Rating | Business Implication |
|---------------|--------|----------------------|
| > 8 times | Excellent | Very efficient, potential stockout risk |
| 4-8 times | Good | Healthy balance |
| 2-4 times | Fair | Room for improvement |
| < 2 times | Poor | Excess inventory, slow sales |

### Sri Lankan Industry Benchmarks

| Business Type | Target Turnover | Typical Range |
|--------------|----------------|---------------|
| Supermarket | 8-12 times | 6-15 times |
| Pharmacy | 4-6 times | 3-8 times |
| Electronics | 3-5 times | 2-6 times |
| Clothing | 4-6 times | 3-7 times |
| Restaurants | 12-20 times | 10-25 times |
| Furniture | 2-4 times | 1-5 times |

### Turnover by Product Category

```
Inventory Turnover by Category (Sample)
════════════════════════════════════════

Category          Turnover    Rating    Notes
─────────────────────────────────────────────
Fresh Produce     18.5×       Excellent Perishable
Dairy Products    12.3×       Excellent Short shelf life
Beverages         8.7×        Excellent High demand
Rice & Grains     6.2×        Good      Staple items
Cleaning Supply   4.5×        Good      Regular use
Personal Care     3.8×        Fair      Moderate demand
Electronics       2.1×        Fair      High value items
Seasonal Items    1.5×        Poor      Limited demand
```

### Factors Affecting Turnover

#### Factors that INCREASE Turnover
- High sales volume
- Effective marketing
- Fast-moving products
- Perishable items
- Just-in-time ordering
- Strong customer demand

#### Factors that DECREASE Turnover
- Overstocking
- Slow sales
- Seasonal products (off-season)
- High-value items
- Poor demand forecasting
- Obsolete inventory

### Period-Based Calculations

| Period | Days | Formula Adjustment | Use Case |
|--------|------|-------------------|----------|
| Annual | 365 | Direct calculation | Year-end reporting |
| Quarterly | 90 | Multiply by 4 | Quarterly reviews |
| Monthly | 30 | Multiply by 12 | Monthly monitoring |
| Weekly | 7 | Multiply by 52 | Short-term tracking |

### Relationship with Days of Inventory

```
Turnover vs. Days Relationship
══════════════════════════════

Days of Inventory = 365 / Inventory Turnover

Examples:
  Turnover 12× → DOI = 30 days
  Turnover 6×  → DOI = 61 days
  Turnover 4×  → DOI = 91 days
  Turnover 2×  → DOI = 183 days
```

### Expected Outcome
- Accurate turnover ratio calculation
- Period-specific analysis
- Industry benchmark comparison
- Actionable interpretation

### Verification Checklist
- [ ] get_inventory_turnover method implemented
- [ ] COGS calculated correctly
- [ ] Average inventory value calculated
- [ ] Turnover ratio computed (COGS / Avg Inventory)
- [ ] Support for annual, quarterly, monthly periods
- [ ] Interpretation assigned (Excellent/Good/Fair/Poor)
- [ ] Comparison with previous period
- [ ] Industry benchmark included
- [ ] Division by zero handled
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 39: Add Days of Inventory KPI

### Overview
Implement the get_days_of_inventory method to calculate how many days of inventory are currently on hand at the current sales rate. This metric complements inventory turnover and provides an intuitive measure of stock coverage.

### Dependencies
- Task 38: Add Inventory Turnover KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_inventory_turnover

2. **Add get_days_of_inventory method**
   - Define method with period parameter (default: "annual")
   - Support same periods as turnover: annual, quarterly, monthly
   - Add docstring with formula explanation

3. **Calculate using turnover ratio**
   - Get inventory_turnover from previous task
   - Formula: DOI = 365 / Inventory Turnover
   - OR: DOI = (Average Inventory / COGS) × 365

4. **Alternative calculation (more accurate)**
   - Calculate average daily COGS
   - Get current inventory value
   - Formula: DOI = Current Inventory / Average Daily COGS

5. **Round result**
   - Round to nearest whole day
   - Return as integer for clarity

6. **Determine trend**
   - Compare with previous period DOI
   - Trend: "improving" (lower DOI), "stable", "declining" (higher DOI)
   - Note: Lower DOI is generally better (faster turnover)

7. **Determine interpretation**
   - Excellent: DOI < 45 days
   - Good: DOI 45-90 days
   - Fair: DOI 91-180 days
   - Poor: DOI > 180 days
   - Adjust based on industry

8. **Format response**
   - Return dictionary with days value, trend, interpretation
   - Include comparison to target DOI
   - Add restocking frequency suggestion

9. **Update get_all_kpis method**
   - Call get_days_of_inventory()
   - Add result to kpis dictionary with key "days_of_inventory"

### Days of Inventory Formula

```
Days of Inventory (DOI)
═══════════════════════

Method 1 (From Turnover):
  DOI = 365 / Inventory Turnover

Method 2 (Direct):
  DOI = (Average Inventory / COGS) × 365

Method 3 (Current):
  DOI = Current Inventory / Avg Daily COGS

Example:
  Inventory Turnover: 4.2 times/year
  DOI = 365 / 4.2 = 87 days
  
  Interpretation: On average, inventory lasts 87 days
                  before being sold and replaced.
```

### DOI Calculation Examples

#### Example 1: Supermarket
```
Supermarket - Days of Inventory
════════════════════════════════

Current Inventory Value: LKR 5,250,000
Annual COGS: LKR 24,000,000
Average Daily COGS: 24,000,000 / 365 = LKR 65,753

DOI = 5,250,000 / 65,753 = 79.8 days ≈ 80 days

Interpretation: GOOD
  • Inventory lasts about 2.5 months
  • Restocking needed every 2-3 weeks
  • Appropriate for supermarket operations
```

#### Example 2: Electronics Store
```
Electronics Store - Days of Inventory
══════════════════════════════════════

Current Inventory Value: LKR 15,000,000
Annual COGS: LKR 36,000,000
Average Daily COGS: 36,000,000 / 365 = LKR 98,630

DOI = 15,000,000 / 98,630 = 152.1 days ≈ 152 days

Interpretation: FAIR
  • Inventory lasts about 5 months
  • Higher DOI appropriate for high-value items
  • Monitor for slow-moving items
```

### Days of Inventory Response Structure

```json
{
  "days_of_inventory": {
    "value": 87,
    "trend": "stable",
    "interpretation": "Good",
    "previous_value": 92,
    "change_days": -5,
    "target_doi": 75,
    "vs_target": "+12 days over target",
    "restocking_frequency": "Every 2-3 weeks",
    "months_coverage": 2.9
  }
}
```

### DOI Interpretation Matrix

| Days of Inventory | Rating | Stock Coverage | Restocking Frequency |
|------------------|--------|----------------|---------------------|
| < 30 days | Excellent | 1 month | Weekly |
| 30-60 days | Good | 1-2 months | Bi-weekly |
| 61-90 days | Good | 2-3 months | Monthly |
| 91-180 days | Fair | 3-6 months | Quarterly |
| > 180 days | Poor | 6+ months | Review needed |

### Sri Lankan Business Examples

#### Fast-Moving Retail (Supermarket)
```
Target DOI: 30-60 days
═══════════════════════

Fresh Produce:     7-10 days   (Perishable)
Dairy:             10-14 days  (Short shelf life)
Beverages:         20-30 days  (High turnover)
Dry Goods:         45-60 days  (Stable demand)
Non-Food:          60-90 days  (Lower turnover)

Overall DOI:       ~45 days    (Weighted average)
```

#### Pharmacy
```
Target DOI: 60-90 days
══════════════════════

Fast Movers:       30-45 days  (Common medicines)
Regular Stock:     60-75 days  (Prescription items)
Slow Movers:       90-120 days (Specialty medicines)

Overall DOI:       ~75 days
```

#### Clothing/Fashion Store
```
Target DOI: 60-120 days
═══════════════════════

Seasonal Items:    45-60 days  (Clear before season ends)
Regular Stock:     60-90 days  (Core collection)
Premium Items:     90-120 days (Higher value)

Overall DOI:       ~80 days
```

### DOI by Season (Sri Lankan Context)

| Season | Impact on DOI | Typical Range |
|--------|---------------|---------------|
| Avurudu (April) | Lower | 30-45 days (fast turnover) |
| Monsoon (May-Sep) | Higher | 60-90 days (slower sales) |
| Festival (Dec) | Lower | 25-40 days (high demand) |
| Regular Months | Normal | 45-75 days (baseline) |

### Restocking Frequency Recommendations

```
Restocking Schedule by DOI
══════════════════════════

DOI 15-30 days   → Weekly restocking
DOI 31-60 days   → Bi-weekly restocking
DOI 61-90 days   → Every 3 weeks
DOI 91-120 days  → Monthly restocking
DOI 121-180 days → Every 6 weeks
DOI 180+ days    → Review inventory strategy
```

### Trend Analysis

| DOI Trend | Business Meaning | Recommended Action |
|-----------|-----------------|-------------------|
| Decreasing | Faster turnover, improving efficiency | Maintain current strategy |
| Stable | Consistent operations | Monitor for changes |
| Increasing | Slower sales or overstocking | Review purchasing, increase promotions |
| Fluctuating | Inconsistent demand/supply | Improve forecasting |

### Relationship to Cash Flow

```
DOI Impact on Cash Flow
═══════════════════════

Lower DOI (30 days):
  ✓ Less cash tied up in inventory
  ✓ Faster inventory-to-cash conversion
  ✓ Better liquidity
  ⚠ Higher stockout risk

Higher DOI (120 days):
  ✓ Lower stockout risk
  ✓ Buffer for demand spikes
  ⚠ More cash tied up
  ⚠ Higher carrying costs
  ⚠ Obsolescence risk
```

### Expected Outcome
- Clear days of inventory calculation
- Intuitive stock coverage metric
- Trend analysis vs previous period
- Restocking frequency guidance

### Verification Checklist
- [ ] get_days_of_inventory method implemented
- [ ] Formula: 365 / Inventory Turnover
- [ ] Alternative: Current Inv / Daily COGS
- [ ] Result rounded to whole days
- [ ] Trend determined (improving/stable/declining)
- [ ] Interpretation assigned
- [ ] Comparison with target DOI
- [ ] Restocking frequency suggested
- [ ] Months coverage calculated
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 40: Add Fast Moving Products KPI

### Overview
Implement the get_fast_moving_products method to identify the top-selling products based on sales velocity. This metric helps managers prioritize inventory allocation, shelf space, and marketing efforts for high-performing products.

### Dependencies
- Task 39: Add Days of Inventory KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_days_of_inventory

2. **Add get_fast_moving_products method**
   - Define method with parameters: period (default: 30 days), limit (default: 5)
   - Add docstring explaining velocity calculation

3. **Define date range**
   - Calculate start_date based on period parameter
   - End date is current date/time
   - Support periods: 7, 14, 30, 60, 90 days

4. **Query sales data**
   - Get StockMovement records for SALE/OUTBOUND
   - Filter by date range
   - Group by product
   - Sum quantities sold

5. **Calculate sales velocity**
   - Formula: Velocity = Total Units Sold / Number of Days
   - Result is average units per day
   - Round to 2 decimal places

6. **Get product details**
   - Join with Product model for name, SKU, category
   - Get current stock level
   - Get unit price for revenue calculation
   - Calculate total revenue for period

7. **Calculate stock coverage days**
   - Formula: Coverage = Current Stock / Velocity
   - Shows how many days until stockout at current rate
   - Flag products with coverage < 7 days

8. **Sort and limit results**
   - Order by velocity DESC (highest first)
   - Apply limit (default top 5)
   - Return as list of dictionaries

9. **Format response**
   - Return dictionary with items list
   - Include period used in calculation
   - Add summary statistics (total velocity, avg velocity)

10. **Update get_all_kpis method**
    - Call get_fast_moving_products()
    - Add result to kpis dictionary with key "fast_moving"

### Sales Velocity Formula

```
Sales Velocity Calculation
══════════════════════════

Velocity = Total Units Sold / Number of Days

Example:
  Product: Rice 5kg (Samba)
  Period: Last 30 days
  Total Sold: 255 units
  
  Velocity = 255 / 30 = 8.5 units/day
  
  Interpretation: On average, 8.5 units sold daily
```

### Velocity Calculation Example

```
Fast Moving Products - Last 30 Days
════════════════════════════════════

Product: Rice 5kg (Samba)
  ├─ Units Sold: 255
  ├─ Days: 30
  ├─ Velocity: 8.5 units/day
  ├─ Current Stock: 60 units
  ├─ Stock Coverage: 7.1 days
  ├─ Revenue: LKR 216,750 (255 × 850)
  └─ Status: ⚠️ Reorder needed (low coverage)

Product: Coconut Oil 1L
  ├─ Units Sold: 210
  ├─ Days: 30
  ├─ Velocity: 7.0 units/day
  ├─ Current Stock: 105 units
  ├─ Stock Coverage: 15 days
  ├─ Revenue: LKR 105,000 (210 × 500)
  └─ Status: ✓ Good coverage

Product: Tea Bags 100s
  ├─ Units Sold: 180
  ├─ Days: 30
  ├─ Velocity: 6.0 units/day
  ├─ Current Stock: 48 units
  ├─ Stock Coverage: 8 days
  ├─ Revenue: LKR 99,000 (180 × 550)
  └─ Status: ✓ Adequate coverage
```

### Fast Moving Products Response Structure

```json
{
  "fast_moving": {
    "period_days": 30,
    "top_count": 5,
    "total_velocity": 38.5,
    "avg_velocity": 7.7,
    "items": [
      {
        "product_id": 123,
        "product_name": "Rice 5kg - Samba",
        "sku": "RICE-5KG-SAMB",
        "category": "Grains & Rice",
        "velocity": 8.5,
        "units_sold": 255,
        "current_stock": 60,
        "stock_coverage_days": 7.1,
        "unit_price": 850.00,
        "total_revenue": 216750.00,
        "formatted_revenue": "LKR 216,750.00",
        "needs_reorder": true,
        "rank": 1
      },
      {
        "product_id": 124,
        "product_name": "Coconut Oil 1L",
        "sku": "OIL-COC-1L",
        "category": "Cooking Essentials",
        "velocity": 7.0,
        "units_sold": 210,
        "current_stock": 105,
        "stock_coverage_days": 15.0,
        "unit_price": 500.00,
        "total_revenue": 105000.00,
        "formatted_revenue": "LKR 105,000.00",
        "needs_reorder": false,
        "rank": 2
      }
    ]
  }
}
```

### Velocity Classification

| Velocity (units/day) | Classification | Priority | Shelf Space |
|---------------------|----------------|----------|-------------|
| > 10 | Very Fast | Critical | Prime location |
| 5-10 | Fast | High | Front displays |
| 2-5 | Moderate | Medium | Regular shelves |
| 1-2 | Slow | Low | Back shelves |
| < 1 | Very Slow | Monitor | Limited space |

### Sri Lankan Supermarket Examples

#### Top Fast Movers - Colombo Supermarket
```
Fast Moving Products (30-Day Period)
════════════════════════════════════

Rank  Product                 Velocity    Revenue
─────────────────────────────────────────────────
1.    Rice 5kg (Samba)        8.5/day     LKR 217K
2.    Coconut Oil 1L          7.0/day     LKR 105K
3.    Tea Bags 100s           6.0/day     LKR 99K
4.    Dhal 500g               5.5/day     LKR 44K
5.    Fresh Milk 1L           5.2/day     LKR 88K
─────────────────────────────────────────────────
Total Fast Moving Revenue:               LKR 553K
Percentage of Total Sales:               35.2%
```

#### Fast Movers by Category
```
Category Performance
════════════════════

Grains & Rice:
  • Rice 5kg (Samba)     - 8.5/day
  • Rice 5kg (Nadu)      - 6.2/day
  • Rice 1kg (Basmati)   - 4.8/day

Cooking Essentials:
  • Coconut Oil 1L       - 7.0/day
  • Sunflower Oil 1L     - 4.5/day
  • Cooking Salt 1kg     - 3.8/day

Beverages:
  • Tea Bags 100s        - 6.0/day
  • Coffee 200g          - 3.2/day
  • Soft Drinks 1.5L     - 5.5/day
```

### Stock Coverage Analysis

```
Stock Coverage Risk Assessment
══════════════════════════════

CRITICAL (< 3 days):
  🔴 Immediate reorder required
     Risk of stockout within 72 hours

WARNING (3-7 days):
  🟡 Reorder soon
     Plan delivery within this week

ADEQUATE (7-14 days):
  🟢 Normal operations
     Standard reorder cycle

COMFORTABLE (14+ days):
  ⚪ Good coverage
     No immediate action needed
```

### Revenue Contribution Analysis

| Fast Mover Rank | Typical Revenue % | Business Impact |
|----------------|-------------------|-----------------|
| Top 5 | 30-40% | Critical products |
| Top 10 | 50-60% | Core business |
| Top 20 | 70-80% | Essential range |
| Remaining | 20-30% | Variety products |

### Fast Mover Strategy Implications

#### Inventory Management
- **Higher stock levels:** Maintain 14-21 days coverage
- **Frequent reordering:** Weekly or bi-weekly
- **Safety stock:** 7-10 days extra buffer
- **Never stockout:** Priority replenishment

#### Shelf Management
- **Prime placement:** Eye-level, front displays
- **Multiple facings:** 3-5 shelf facings
- **End caps:** Feature in promotional areas
- **Checkout proximity:** Convenient access

#### Pricing Strategy
- **Competitive pricing:** Match or beat competitors
- **Volume discounts:** Encourage bulk purchases
- **Loyalty rewards:** Double points on fast movers
- **Price stability:** Avoid frequent changes

### Period Comparison

| Period | Use Case | Velocity Sensitivity |
|--------|----------|---------------------|
| 7 days | Weekly trends, promotions | High (captures spikes) |
| 14 days | Bi-weekly patterns | Medium-High |
| 30 days | Monthly standard | Medium (balanced) |
| 60 days | Seasonal smoothing | Medium-Low |
| 90 days | Quarterly analysis | Low (long-term trends) |

### Expected Outcome
- List of top 5 fast-moving products
- Sales velocity per product (units/day)
- Stock coverage days analysis
- Revenue contribution by product

### Verification Checklist
- [ ] get_fast_moving_products method implemented
- [ ] Date range calculated based on period
- [ ] Sales data queried and grouped by product
- [ ] Velocity calculated (units sold / days)
- [ ] Current stock level included
- [ ] Stock coverage days calculated
- [ ] Products sorted by velocity DESC
- [ ] Top 5 (or specified limit) returned
- [ ] Revenue calculated for period
- [ ] Reorder flag added for low coverage
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Summary

This document established the core inventory KPI calculation infrastructure:

### Completed Components
- ✅ InventoryKPICalculator class extending BaseKPICalculator
- ✅ Total stock value KPI with FIFO valuation
- ✅ Low stock items count with urgency levels
- ✅ Out of stock items count with priority flags
- ✅ Overstock items identification with excess value
- ✅ Inventory turnover ratio calculation
- ✅ Days of inventory coverage metric
- ✅ Fast-moving products analysis with velocity

### Key Achievements
1. **Stock Valuation** - Accurate FIFO-based inventory worth
2. **Stock Health** - Low stock, out of stock, and overstock monitoring
3. **Efficiency Metrics** - Turnover ratio and DOI calculations
4. **Sales Analysis** - Fast-moving product identification
5. **Sri Lankan Context** - LKR formatting, local business patterns

### Next Steps
Proceed to [02_Tasks-41-48_Stock-Analysis-Caching.md](02_Tasks-41-48_Stock-Analysis-Caching.md) to implement slow-moving and dead stock analysis, category and warehouse breakdowns, reorder alerts, Redis caching, and the API endpoint.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~967
