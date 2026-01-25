# Tasks 41-48: Stock Analysis, Breakdowns, and Caching

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** C - Inventory KPIs  
> **Document:** 02 of 02  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_Stock-Value-Turnover.md](01_Tasks-33-40_Stock-Value-Turnover.md)

---

## Document Overview

This document completes the inventory KPI calculator with slow-moving and dead stock identification, stock value breakdowns by category and warehouse, reorder alert generation, Redis caching implementation with invalidation strategies, and the API endpoint. These features provide comprehensive inventory analysis and performance optimization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Add Slow Moving Products KPI | Medium | 30 min |
| 42 | Add Dead Stock KPI | Medium | 35 min |
| 43 | Add Stock by Category KPI | Medium | 30 min |
| 44 | Add Stock by Warehouse KPI | Medium | 25 min |
| 45 | Add Reorder Alert List | Medium | 35 min |
| 46 | Create Inventory KPI Cache | Medium | 30 min |
| 47 | Add Inventory Cache Invalidation | Medium | 35 min |
| 48 | Create Inventory KPI Endpoint | Low | 20 min |

---

## Task 41: Add Slow Moving Products KPI

### Overview
Implement the get_slow_moving_products method to identify products with the lowest sales velocity. Slow movers tie up capital and warehouse space, requiring strategic action such as promotions, markdowns, or discontinuation.

### Dependencies
- Task 40: Add Fast Moving Products KPI

### Instructions

1. **Open inventory.py calculator file**
   - Navigate to `apps/dashboard/calculators/inventory.py`
   - Locate InventoryKPICalculator class

2. **Add get_slow_moving_products method**
   - Define method with parameters: period (default: 30 days), limit (default: 5)
   - Add comprehensive docstring

3. **Define date range**
   - Calculate start_date based on period parameter
   - End date is current date/time
   - Use same period options as fast movers

4. **Query sales data**
   - Get StockMovement records for SALE/OUTBOUND
   - Filter by date range
   - Group by product
   - Sum quantities sold

5. **Calculate sales velocity**
   - Formula: Velocity = Total Units Sold / Number of Days
   - Include products with velocity > 0 (exclude zero sales)
   - Round to 2 decimal places

6. **Get product details**
   - Join with Product model
   - Get current stock level
   - Get unit cost for capital tied up calculation
   - Calculate inventory value (quantity × cost)

7. **Calculate days of stock on hand**
   - Formula: Days on Hand = Current Stock / Velocity
   - Shows how long current stock will last
   - Identify products with 180+ days of stock

8. **Sort and limit results**
   - Order by velocity ASC (lowest first)
   - Exclude products with zero velocity (those are dead stock)
   - Apply limit (default bottom 5)

9. **Add action recommendations**
   - Discount percentage suggestions based on velocity
   - Bundle opportunity identification
   - Discontinuation consideration for very slow movers

10. **Format response**
    - Return dictionary with items list
    - Include capital_tied_up total
    - Add actionable recommendations

11. **Update get_all_kpis method**
    - Call get_slow_moving_products()
    - Add result to kpis dictionary with key "slow_moving"

### Slow Moving Criteria

```
Slow Moving Definition
══════════════════════

Product is SLOW MOVING when:
  • Velocity > 0 (has some sales)
  • Velocity < threshold (e.g., 1 unit/day)
  • Days on hand > 90 days
  
Excludes:
  • Dead stock (zero velocity)
  • Discontinued products
  • Seasonal items (off-season)
```

### Slow vs Fast vs Dead Stock

```
Product Movement Classification
════════════════════════════════

┌─────────────────────────────────────────┐
│         FAST MOVING                     │
│     Velocity: 5-10+ units/day           │
│     Action: Maintain high stock         │
└─────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│         MODERATE MOVING                 │
│     Velocity: 2-5 units/day             │
│     Action: Standard operations         │
└─────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│         SLOW MOVING                     │
│     Velocity: 0.1-2 units/day           │
│     Action: Promote, discount           │
└─────────────────────────────────────────┘
                 │
┌─────────────────────────────────────────┐
│         DEAD STOCK                      │
│     Velocity: 0 (no sales)              │
│     Action: Clear out, liquidate        │
└─────────────────────────────────────────┘
```

### Slow Moving Response Structure

```json
{
  "slow_moving": {
    "period_days": 30,
    "bottom_count": 5,
    "total_capital_tied": 285000.00,
    "formatted_capital": "LKR 285,000.00",
    "items": [
      {
        "product_id": 456,
        "product_name": "Imported Jam - Strawberry 500g",
        "sku": "JAM-STR-500",
        "category": "Spreads & Jams",
        "velocity": 0.5,
        "units_sold": 15,
        "current_stock": 180,
        "days_on_hand": 360,
        "unit_cost": 450.00,
        "inventory_value": 81000.00,
        "formatted_value": "LKR 81,000.00",
        "carrying_cost_monthly": 2025.00,
        "severity": "critical",
        "recommendation": "25-30% discount or bundle deal",
        "rank": 1
      }
    ]
  }
}
```

### Velocity Classification for Slow Movers

| Velocity (units/day) | Severity | Days to Clear | Action Required |
|---------------------|----------|---------------|-----------------|
| 0.1-0.5 | Critical | 200+ days | 30-50% discount |
| 0.5-1.0 | High | 100-200 days | 20-30% discount |
| 1.0-1.5 | Moderate | 60-100 days | 10-20% discount |
| 1.5-2.0 | Low | 30-60 days | Promotional bundles |

### Sri Lankan Retail Examples

#### Slow Moving Products - Supermarket
```
Slow Movers (30-Day Analysis)
══════════════════════════════

Rank  Product                    Velocity  Stock  Days    Value
─────────────────────────────────────────────────────────────────
1.    Imported Jam 500g          0.5/day   180    360d    81K
2.    Premium Olive Oil 500ml    0.7/day   85     121d    68K
3.    Gourmet Cookies 250g       0.8/day   96     120d    43K
4.    Organic Honey 250g         0.9/day   54     60d     49K
5.    Specialty Tea 100g         1.1/day   66     60d     44K
─────────────────────────────────────────────────────────────────
Total Capital Tied Up:                                    LKR 285K
Monthly Carrying Cost:                                    LKR 7.1K
```

#### Analysis by Category
```
Slow Moving by Category
═══════════════════════

Imported Foods:
  • Items: 8 products
  • Total Value: LKR 245,000
  • Issue: High cost, niche market
  • Action: Reduce SKU count, focus on bestsellers

Premium Items:
  • Items: 5 products
  • Total Value: LKR 180,000
  • Issue: Price-sensitive market
  • Action: Target high-income customers

Specialty Products:
  • Items: 3 products
  • Total Value: LKR 125,000
  • Issue: Low awareness
  • Action: In-store tastings, demos
```

### Days on Hand Calculation

```
Days on Hand Formula
════════════════════

Days on Hand = Current Stock Quantity / Sales Velocity

Example:
  Product: Imported Jam 500g
  Current Stock: 180 units
  Velocity: 0.5 units/day
  
  Days on Hand = 180 / 0.5 = 360 days
  
  Interpretation: At current sales rate, this stock
                  will last 360 days (about 1 year)
```

### Capital Tied Up Analysis

```
Capital Investment in Slow Movers
══════════════════════════════════

Product              Qty   Cost     Value     Days    Issue
──────────────────────────────────────────────────────────
Imported Jam         180 × 450  = 81,000    360d    Critical
Premium Olive Oil     85 × 800  = 68,000    121d    High
Gourmet Cookies       96 × 450  = 43,200    120d    High
Organic Honey         54 × 900  = 48,600     60d    Moderate
Specialty Tea         66 × 670  = 44,220     60d    Moderate
──────────────────────────────────────────────────────────
Total Capital Tied:              LKR 285,020

Opportunity Cost:
  • Could invest in 5-10 fast movers instead
  • Estimate: 3-5× better ROI with fast movers
  • Monthly carrying cost: LKR 7,125 (2.5% of value)
```

### Action Recommendations by Severity

#### Critical Severity (360+ days on hand)
```
Recommended Actions:
══════════════════

Immediate (This Week):
  ✓ 25-30% markdown
  ✓ Front-end display placement
  ✓ Staff incentives for selling
  ✓ Social media promotion

Short-term (This Month):
  ✓ BOGO or bundle offers
  ✓ Loyalty program rewards
  ✓ Consider vendor return

Long-term:
  ✓ Discontinue product
  ✓ Liquidation sale
  ✓ Donate for tax benefit
```

#### High Severity (120-200 days)
```
Recommended Actions:
══════════════════

Week 1-2:
  ✓ 15-20% discount
  ✓ Cross-merchandising
  ✓ Email newsletter feature

Month 1-2:
  ✓ Bundle with fast movers
  ✓ Recipe suggestions (if food)
  ✓ Reduce reorder quantity

Quarter:
  ✓ Evaluate discontinuation
  ✓ Seek alternative suppliers
```

### Bundle Opportunity Identification

```
Smart Bundling Strategy
═══════════════════════

Slow Mover: Imported Jam (0.5/day velocity)
Bundle with: Bread (8.5/day velocity)

Offer: "Breakfast Combo"
  • Bread + Imported Jam
  • Price: Regular price - 15%
  • Expected Result: Move 2-3 jams/day

Slow Mover: Premium Olive Oil (0.7/day velocity)
Bundle with: Pasta (4.2/day velocity) + Tomato Sauce (3.8/day)

Offer: "Italian Dinner Pack"
  • 3-item bundle at 20% off
  • Expected Result: Move 1-2 oils/day
```

### Carrying Cost Impact

| Monthly Carrying Rate | LKR 285K Inventory | Annual Cost |
|----------------------|-------------------|-------------|
| 2.0% | LKR 5,700 | LKR 68,400 |
| 2.5% (typical) | LKR 7,125 | LKR 85,500 |
| 3.0% | LKR 8,550 | LKR 102,600 |

### Discontinuation Decision Matrix

| Factor | Continue | Reconsider | Discontinue |
|--------|----------|------------|-------------|
| Days on Hand | < 90 | 90-180 | > 180 |
| Velocity | > 1.0/day | 0.5-1.0/day | < 0.5/day |
| Profit Margin | > 30% | 15-30% | < 15% |
| Customer Requests | Regular | Occasional | Rare |
| Supplier MOQ | Flexible | Moderate | High |

### Expected Outcome
- List of 5 slowest-moving products
- Capital tied up calculation
- Days on hand analysis
- Actionable markdown recommendations

### Verification Checklist
- [ ] get_slow_moving_products method implemented
- [ ] Excludes zero velocity (dead stock)
- [ ] Velocity calculated accurately
- [ ] Days on hand computed
- [ ] Products sorted by velocity ASC
- [ ] Bottom 5 (or limit) returned
- [ ] Inventory value calculated
- [ ] Carrying cost estimated
- [ ] Severity level assigned
- [ ] Recommendations provided
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 42: Add Dead Stock KPI

### Overview
Implement the get_dead_stock method to identify products with zero sales over a specified period (typically 90 days). Dead stock represents the most critical inventory problem, tying up significant capital with no return.

### Dependencies
- Task 41: Add Slow Moving Products KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_slow_moving_products

2. **Add get_dead_stock method**
   - Define method with period parameter (default: 90 days)
   - Add docstring explaining dead stock criteria

3. **Define date range for analysis**
   - Calculate start_date (e.g., 90 days ago)
   - End date is current date
   - Configurable period for different business needs

4. **Get products with stock but no sales**
   - Query StockLevel for products with quantity > 0
   - Left join with StockMovement for sales in period
   - Filter WHERE no sales recorded (velocity = 0)
   - Exclude discontinued products (unless specified)

5. **Exclude seasonal items appropriately**
   - Check for seasonal flag on products
   - If seasonal and out of season, optionally exclude
   - Configuration option: include_seasonal parameter

6. **Get product details**
   - Product name, SKU, category
   - Current quantity on hand
   - Unit cost and total value
   - Last sale date (before dead stock period)
   - Days since last sale

7. **Calculate total dead stock value**
   - Sum inventory value of all dead stock items
   - This is capital with zero return

8. **Categorize by urgency**
   - Critical: 180+ days with no sales
   - High: 120-180 days
   - Medium: 90-120 days

9. **Add liquidation recommendations**
   - Severe markdown (50-75%)
   - Donation consideration
   - Vendor return if possible
   - Write-off for very old stock

10. **Format response**
    - Return dictionary with count, total_value, items list
    - Include average days since last sale
    - Add clear action steps

11. **Update get_all_kpis method**
    - Call get_dead_stock()
    - Add result to kpis dictionary with key "dead_stock"

### Dead Stock Definition

```
Dead Stock Criteria
═══════════════════

Product is DEAD STOCK when:
  • Current quantity > 0 AND
  • Zero sales in last 90 days (or specified period) AND
  • Product is active (not discontinued)
  
Excludes (optional):
  • Seasonal products (off-season)
  • Recently added products (< 30 days old)
  • Products with pending special orders
```

### Dead Stock Severity Levels

```
Dead Stock Classification by Age
═════════════════════════════════

                    No Sales Period
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
90 days              120 days               180 days
    │                      │                      │
    │                      │                      │
┌───▼────┐          ┌──────▼─────┐        ┌──────▼─────┐
│ MEDIUM │          │    HIGH    │        │  CRITICAL  │
│  Risk  │          │    Risk    │        │    Risk    │
└────────┘          └────────────┘        └────────────┘

Action:             Action:              Action:
• 30-40%            • 50-60%             • 70-90%
  discount            liquidation          clearance
• Promote           • Urgent              • Donate
• Monitor             action              • Write-off
```

### Dead Stock Response Structure

```json
{
  "dead_stock": {
    "period_days": 90,
    "count": 12,
    "total_value": 425000.00,
    "formatted_value": "LKR 425,000.00",
    "avg_days_since_sale": 145,
    "urgency_breakdown": {
      "medium": 4,
      "high": 5,
      "critical": 3
    },
    "items": [
      {
        "product_id": 789,
        "product_name": "Winter Jacket - XL",
        "sku": "CLOTH-WJ-XL",
        "category": "Seasonal Clothing",
        "current_qty": 15,
        "unit_cost": 2500.00,
        "inventory_value": 37500.00,
        "formatted_value": "LKR 37,500.00",
        "last_sale_date": "2025-08-15",
        "days_since_last_sale": 163,
        "urgency": "critical",
        "recommendation": "70-80% liquidation sale or donate",
        "reason": "Seasonal item, off-season, 163 days no sales"
      }
    ]
  }
}
```

### Sri Lankan Business Examples

#### Dead Stock - Clothing Store
```
Dead Stock Analysis - Fashion Boutique
═══════════════════════════════════════

CRITICAL (180+ days no sales):
  ❌ Winter Jackets        - 15 units × 2,500 = 37,500
     Last sale: Aug 2025 (163 days ago)
     Issue: Wrong season for Sri Lanka

  ❌ Formal Suits (Size XXL) - 8 units × 4,500 = 36,000
     Last sale: July 2025 (178 days ago)
     Issue: Limited market, wrong sizing

HIGH (120-180 days):
  ⚠️ Designer Handbags     - 6 units × 8,500 = 51,000
     Last sale: Sept 2025 (137 days ago)
     Issue: Price too high for market

MEDIUM (90-120 days):
  ⚠️ Casual Shirts (Pattern) - 22 units × 1,200 = 26,400
     Last sale: Oct 2025 (107 days ago)
     Issue: Pattern not popular

Total Dead Stock: 51 items valued at LKR 425,400
Recommended Action: Clearance sale ASAP
```

#### Dead Stock - Electronics Store
```
Dead Stock - Electronics Retailer
══════════════════════════════════

Product: Smartphone Model (Previous Gen)
  • Quantity: 12 units
  • Cost per unit: LKR 35,000
  • Total value: LKR 420,000
  • Days no sales: 125 days
  • Issue: New model released, obsolete

Action Plan:
  Week 1: 40% markdown (try LKR 21,000)
  Week 2: 50% markdown (LKR 17,500)
  Week 3: 60% markdown (LKR 14,000)
  Week 4: Bundle with accessories
  Month 2: Liquidate remaining to wholesaler
```

### Dead Stock Cost Analysis

```
True Cost of Dead Stock
═══════════════════════

Initial Investment:           LKR 425,000

Carrying Costs (6 months):
  • Storage (2.5%/month):     LKR 63,750
  • Insurance (0.5%/month):   LKR 12,750
  • Obsolescence risk:        Variable
  • Opportunity cost:         High

Total Cost:                   LKR 501,500+

Expected Recovery (50% markdown):
  Sale proceeds:              LKR 212,500
  
Net Loss:                     LKR 289,000 (68%)

Lesson: Identify dead stock early!
```

### Liquidation Strategy by Product Type

| Product Type | Best Strategy | Timeline | Expected Recovery |
|-------------|---------------|----------|------------------|
| Clothing (seasonal) | Clearance sale | 2-4 weeks | 20-40% |
| Electronics (old model) | Steep discount | 1-2 weeks | 30-50% |
| Food (near expiry) | 50-70% off | Immediate | 30-50% |
| Furniture | Showroom sale | 1-2 months | 40-60% |
| Books | Bundle deals | Ongoing | 25-40% |
| Cosmetics | Gift sets | 2-4 weeks | 40-60% |

### Vendor Return Consideration

```
When to Consider Vendor Return
═══════════════════════════════

Check these factors:
  ✓ Vendor has return policy?
  ✓ Within return window?
  ✓ Products in resalable condition?
  ✓ Return fee acceptable?
  ✓ Relationship with vendor good?

Example Scenario:
  Product: Seasonal decorations
  Value: LKR 85,000
  Vendor return policy: 30% restocking fee
  
  Recovery: 85,000 × 70% = LKR 59,500
  Better than: 50-70% clearance sale
  
  Decision: Return to vendor
```

### Donation Consideration

```
Strategic Donation Benefits
═══════════════════════════

Tax Benefits:
  • Deductible from taxable income
  • Documentation required
  • IRD approval needed

PR Benefits:
  • Positive brand image
  • Community goodwill
  • Media coverage opportunity

When to Donate:
  • Product value: < LKR 100,000 total
  • Liquidation unlikely to succeed
  • Products suitable for charity
  • Tax benefit > liquidation proceeds

Example:
  Clothing dead stock: LKR 75,000
  Liquidation: ~LKR 22,500 (30% recovery)
  Donation tax benefit: ~LKR 15,000 (20% tax rate)
  PR value: Priceless
```

### Dead Stock Prevention

| Prevention Strategy | Implementation | Expected Impact |
|-------------------|----------------|-----------------|
| Better forecasting | Use 12-month sales data | Reduce 30-40% |
| Smaller order quantities | Negotiate with suppliers | Reduce 20-30% |
| Trial period for new items | Order 10-20 units first | Reduce 40-50% |
| Seasonal planning | Clear before season ends | Reduce 50-60% |
| Regular reviews | Monthly dead stock check | Early detection |

### Expected Outcome
- Complete list of dead stock items
- Total capital tied up in zero-sales inventory
- Urgency-based categorization
- Clear liquidation action plan

### Verification Checklist
- [ ] get_dead_stock method implemented
- [ ] Filters for zero sales in specified period
- [ ] Current quantity > 0 verified
- [ ] Last sale date retrieved
- [ ] Days since last sale calculated
- [ ] Products categorized by urgency
- [ ] Total dead stock value computed
- [ ] Liquidation recommendations provided
- [ ] Seasonal exclusion option added
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 43: Add Stock by Category KPI

### Overview
Implement the get_stock_by_category method to break down inventory value by product category. This analysis helps identify which categories consume the most capital and whether the distribution aligns with sales mix.

### Dependencies
- Task 42: Add Dead Stock KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_dead_stock

2. **Add get_stock_by_category method**
   - Define method with optional parameters
   - Add docstring explaining breakdown purpose

3. **Query stock levels with categories**
   - Join StockLevel with Product
   - Join Product with Category
   - Filter for quantity > 0
   - Group by category

4. **Calculate value per category**
   - Aggregate: SUM(quantity × unit_cost)
   - Count products per category
   - Count total units per category

5. **Calculate percentage of total**
   - Total inventory value across all categories
   - Each category value / total value × 100
   - Round to 2 decimal places

6. **Get sales performance per category**
   - Query last 30 days sales by category
   - Calculate turnover per category
   - Identify overinvested categories

7. **Sort categories**
   - Default: by value DESC (highest first)
   - Option: by percentage, by product count

8. **Add category insights**
   - Flag categories with > 25% of total value
   - Flag categories with low turnover
   - Suggest rebalancing recommendations

9. **Format response**
   - Return dictionary with categories list
   - Include total value
    - Add percentage distribution visualization data

10. **Update get_all_kpis method**
    - Call get_stock_by_category()
    - Add result to kpis dictionary with key "by_category"

### Stock Value by Category Calculation

```
Category Breakdown Formula
══════════════════════════

For each category:
  Category Value = Σ (Product Qty × Unit Cost)
  Category % = (Category Value / Total Value) × 100

Example:
  Rice & Grains:    1,250,000 / 5,250,000 × 100 = 23.8%
  Beverages:          875,000 / 5,250,000 × 100 = 16.7%
  Dairy Products:     625,000 / 5,250,000 × 100 = 11.9%
```

### Category Breakdown Response Structure

```json
{
  "by_category": {
    "total_value": 5250000.00,
    "formatted_total": "LKR 5,250,000.00",
    "category_count": 12,
    "categories": [
      {
        "category_id": 1,
        "category_name": "Rice & Grains",
        "product_count": 28,
        "total_units": 1850,
        "inventory_value": 1250000.00,
        "formatted_value": "LKR 1,250,000.00",
        "percentage": 23.8,
        "turnover_rate": 6.2,
        "sales_30d": 485000.00,
        "insight": "High investment, good turnover",
        "recommendation": "Maintain current levels"
      },
      {
        "category_id": 2,
        "category_name": "Beverages",
        "product_count": 45,
        "total_units": 2200,
        "inventory_value": 875000.00,
        "formatted_value": "LKR 875,000.00",
        "percentage": 16.7,
        "turnover_rate": 8.7,
        "sales_30d": 425000.00,
        "insight": "Excellent turnover",
        "recommendation": "Consider slight increase"
      }
    ]
  }
}
```

### Sri Lankan Supermarket Example

```
Stock Value by Category - Colombo Supermarket
══════════════════════════════════════════════

Category              Value (LKR)  % of Total  Products  Turnover
────────────────────────────────────────────────────────────────
Rice & Grains         1,250,000      23.8%       28       6.2×
Beverages              875,000       16.7%       45       8.7×
Dairy Products         625,000       11.9%       32       7.1×
Personal Care          550,000       10.5%       58       4.2×
Cleaning Supplies      450,000        8.6%       42       5.1×
Snacks & Biscuits      400,000        7.6%       67       6.8×
Frozen Foods           350,000        6.7%       24       4.5×
Cooking Essentials     300,000        5.7%       38       5.9×
Canned Foods           200,000        3.8%       35       3.8×
Baby Products          150,000        2.9%       22       4.1×
Household Items        100,000        1.9%       28       3.2×
────────────────────────────────────────────────────────────────
Total                5,250,000      100.0%      419      5.8×
```

### Category Analysis Insights

#### Balanced Portfolio
```
Healthy Category Distribution
══════════════════════════════

Characteristics:
  ✓ No single category > 30% of total
  ✓ Top 3 categories < 60% combined
  ✓ Categories align with sales mix
  ✓ Turnover rates appropriate per category

Example Distribution:
  • Category A: 24%  ← Staples (high volume)
  • Category B: 18%  ← Fast movers
  • Category C: 12%  ← Regular items
  • Category D: 11%  ← Specialty
  • Others: 35%      ← Variety
```

#### Overinvestment Warning
```
Category Overinvestment Alert
═════════════════════════════

Red Flags:
  ⚠️ Single category > 30% of total value
  ⚠️ High value but low turnover (< 3×)
  ⚠️ Inventory % > Sales % by 10+ points

Example Problem:
  Category: Electronics
  Inventory: 35% of total value
  Sales: 22% of total sales
  Turnover: 2.1× (below target 4×)
  
  Issue: Overinvested in slow-moving category
  Action: Reduce reorder quantities, run promotions
```

### Category Performance Matrix

| Inventory % | Sales % | Assessment | Action |
|------------|---------|------------|--------|
| 25% | 25% | Balanced | Maintain |
| 30% | 20% | Overinvested | Reduce stock |
| 15% | 25% | Underinvested | Increase stock |
| 10% | 5% | Low turnover | Review category |
| 5% | 10% | Stockout risk | Urgent restock |

### Seasonal Category Adjustments

```
Seasonal Inventory Mix - Sri Lankan Context
═══════════════════════════════════════════

Avurudu Season (April):
  ↑ Traditional Foods      +40% investment
  ↑ Sweets & Confections   +50% investment
  ↑ Gift Items             +35% investment
  ↓ Regular Items          -10% investment

Monsoon Season (May-Sep):
  ↑ Umbrellas, Rainwear    +60% investment
  ↓ Cold Beverages         -25% investment
  ↑ Hot Beverages          +30% investment
  ↑ Canned/Preserved       +15% investment

Festival Season (Dec):
  ↑ Gift Items             +50% investment
  ↑ Decorations            +100% investment
  ↑ Special Foods          +40% investment
  ↓ Regular Stock          -15% investment
```

### Category Rebalancing Strategy

```
Rebalancing Example
═══════════════════

Current State:
  Electronics:     35% of value, 2.1× turnover
  Groceries:       40% of value, 7.2× turnover
  Personal Care:   25% of value, 4.5× turnover

Target State:
  Electronics:     25% of value (-10% reduction)
  Groceries:       50% of value (+10% increase)
  Personal Care:   25% of value (maintain)

Implementation:
  Month 1: Stop electronics reorders
  Month 2: Increase grocery orders +20%
  Month 3: Electronics clearance sale
  Quarter 2: Achieve target distribution
```

### High-Level Category Groupings

```
Super-Category Rollups
══════════════════════

FOOD ITEMS (55% target):
  ├─ Rice & Grains         12%
  ├─ Beverages             10%
  ├─ Dairy                  8%
  ├─ Frozen                 7%
  ├─ Cooking Essentials     8%
  └─ Others                10%

NON-FOOD (35% target):
  ├─ Personal Care         12%
  ├─ Cleaning              10%
  ├─ Household              8%
  └─ Others                 5%

DISCRETIONARY (10% target):
  ├─ Electronics            5%
  ├─ Toys                   3%
  └─ Gift Items             2%
```

### Expected Outcome
- Complete breakdown of inventory by category
- Percentage distribution of capital
- Category performance insights
- Rebalancing recommendations

### Verification Checklist
- [ ] get_stock_by_category method implemented
- [ ] Stock levels grouped by category
- [ ] Value calculated per category (qty × cost)
- [ ] Percentage of total computed
- [ ] Product count per category included
- [ ] Total units per category included
- [ ] Turnover rate per category calculated
- [ ] Categories sorted by value DESC
- [ ] Overinvestment flags added
- [ ] Recommendations provided
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 44: Add Stock by Warehouse KPI

### Overview
Implement the get_stock_by_warehouse method to break down inventory value and distribution across multiple warehouse locations. This analysis helps optimize stock allocation, identify underutilized warehouses, and plan transfers.

### Dependencies
- Task 43: Add Stock by Category KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_stock_by_category

2. **Add get_stock_by_warehouse method**
   - Define method with optional parameters
   - Add docstring explaining warehouse distribution

3. **Query stock levels by warehouse**
   - Join StockLevel with Warehouse
   - Group by warehouse
   - Filter for quantity > 0

4. **Calculate value per warehouse**
   - Aggregate: SUM(quantity × unit_cost)
   - Count distinct products per warehouse
   - Count total units per warehouse

5. **Calculate warehouse utilization**
   - Compare current stock to warehouse capacity
   - Calculate percentage utilized
   - Flag over-capacity warehouses

6. **Get warehouse performance metrics**
   - Calculate turnover per warehouse
   - Calculate days of inventory per warehouse
   - Identify slow-moving warehouses

7. **Identify transfer opportunities**
   - Find products overstocked in one warehouse
   - Find products understocked in another
   - Suggest transfers to balance

8. **Sort warehouses**
   - Default: by value DESC
   - Option: by utilization, by product count

9. **Format response**
   - Return dictionary with warehouses list
   - Include total value across all locations
   - Add transfer recommendations

10. **Update get_all_kpis method**
    - Call get_stock_by_warehouse()
    - Add result to kpis dictionary with key "by_warehouse"

### Warehouse Distribution Response Structure

```json
{
  "by_warehouse": {
    "total_value": 5250000.00,
    "formatted_total": "LKR 5,250,000.00",
    "warehouse_count": 3,
    "warehouses": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Main Warehouse - Colombo",
        "warehouse_code": "WH-COL-01",
        "product_count": 285,
        "total_units": 5420,
        "inventory_value": 3150000.00,
        "formatted_value": "LKR 3,150,000.00",
        "percentage": 60.0,
        "capacity_sqm": 1000,
        "utilization_percent": 78.5,
        "turnover_rate": 6.5,
        "days_of_inventory": 56,
        "status": "healthy"
      },
      {
        "warehouse_id": 2,
        "warehouse_name": "Regional Hub - Kandy",
        "warehouse_code": "WH-KAN-01",
        "product_count": 180,
        "total_units": 2850,
        "inventory_value": 1575000.00,
        "formatted_value": "LKR 1,575,000.00",
        "percentage": 30.0,
        "capacity_sqm": 500,
        "utilization_percent": 65.2,
        "turnover_rate": 5.8,
        "days_of_inventory": 63,
        "status": "underutilized"
      },
      {
        "warehouse_id": 3,
        "warehouse_name": "Outlet Storage - Galle",
        "warehouse_code": "WH-GAL-01",
        "product_count": 95,
        "total_units": 980,
        "inventory_value": 525000.00,
        "formatted_value": "LKR 525,000.00",
        "percentage": 10.0,
        "capacity_sqm": 200,
        "utilization_percent": 45.8,
        "turnover_rate": 4.2,
        "days_of_inventory": 87,
        "status": "underutilized"
      }
    ],
    "transfer_recommendations": [
      {
        "product_name": "Rice 5kg - Samba",
        "from_warehouse": "Main Warehouse - Colombo",
        "to_warehouse": "Regional Hub - Kandy",
        "suggested_qty": 50,
        "reason": "Overstock in Colombo, low stock in Kandy"
      }
    ]
  }
}
```

### Sri Lankan Multi-Location Example

```
Warehouse Distribution - Retail Chain
══════════════════════════════════════

Location               Value (LKR)  %    Products  Util%  Turn
──────────────────────────────────────────────────────────────
Colombo Main WH        3,150,000   60%     285    78.5%  6.5×
Kandy Regional Hub     1,575,000   30%     180    65.2%  5.8×
Galle Outlet Storage     525,000   10%      95    45.8%  4.2×
──────────────────────────────────────────────────────────────
Total                  5,250,000  100%     560    68.2%  5.9×

Analysis:
  ✓ Colombo: Well-utilized, good turnover
  ⚠️ Kandy: Slightly underutilized, consider increasing
  ⚠️ Galle: Significantly underutilized, review strategy
```

### Warehouse Utilization Matrix

| Utilization % | Status | Action Required |
|--------------|--------|-----------------|
| 85-95% | Optimal | Maintain current levels |
| 70-85% | Healthy | Monitor, slight increase OK |
| 50-70% | Underutilized | Increase inventory or reduce space |
| < 50% | Significantly underutilized | Review warehouse necessity |
| > 95% | Overcapacity | Urgent: Expand or transfer stock |

### Warehouse Performance Comparison

```
Performance Benchmarking
════════════════════════

Metric          Colombo   Kandy    Galle    Target
───────────────────────────────────────────────────
Inventory Value   60%      30%      10%      -
Product Count     285      180       95      -
Turnover Rate     6.5×     5.8×     4.2×    5.0×+
DOI (days)        56       63       87      60
Utilization       78%      65%      46%     70-85%
Stock/Sales       Balanced High     Low     Balanced

Insights:
  • Colombo: Benchmark performance
  • Kandy: Good, could handle more inventory
  • Galle: Underperforming, needs review
```

### Transfer Opportunity Identification

```
Stock Transfer Analysis
═══════════════════════

Scenario 1: Balance Overstock
  Product: Rice 5kg - Samba
  
  Colombo:  150 units (Overstock - 30 days coverage)
  Kandy:     35 units (Low stock - 5 days coverage)
  Galle:     18 units (Critical - 3 days coverage)
  
  Recommendation:
    Transfer 50 units: Colombo → Kandy
    Transfer 25 units: Colombo → Galle
  
  Result:
    Colombo:  75 units (15 days - balanced)
    Kandy:    85 units (12 days - healthy)
    Galle:    43 units (7 days - adequate)

Scenario 2: Reduce Dead Stock
  Product: Imported Olive Oil
  
  Colombo:  45 units (Dead stock - no sales)
  Kandy:    12 units (Slow moving - 0.5/day)
  Galle:     0 units (Out of stock - demand exists)
  
  Recommendation:
    Transfer 20 units: Colombo → Galle
    Discount remaining Colombo stock
  
  Result:
    Clear dead stock in main warehouse
    Meet demand in Galle location
```

### Capacity Planning

```
Warehouse Capacity Analysis
═══════════════════════════

Main Warehouse - Colombo:
  ├─ Physical capacity: 1,000 sqm
  ├─ Current usage: 785 sqm
  ├─ Utilization: 78.5%
  ├─ Available space: 215 sqm
  └─ Recommendation: Can accept 25-30% more inventory

Regional Hub - Kandy:
  ├─ Physical capacity: 500 sqm
  ├─ Current usage: 326 sqm
  ├─ Utilization: 65.2%
  ├─ Available space: 174 sqm
  └─ Recommendation: Underutilized, increase stock 30-40%

Outlet Storage - Galle:
  ├─ Physical capacity: 200 sqm
  ├─ Current usage: 92 sqm
  ├─ Utilization: 45.8%
  ├─ Available space: 108 sqm
  └─ Recommendation: Consider downsizing or sublease
```

### Geographic Distribution Strategy

```
Sri Lankan Regional Strategy
═════════════════════════════

Western Province (Colombo):
  • 60-65% of inventory
  • Highest population density
  • Central distribution hub
  • All product categories

Central Province (Kandy):
  • 25-30% of inventory
  • Second largest market
  • Regional fast movers focus
  • Limited specialty items

Southern Province (Galle):
  • 10-15% of inventory
  • Smaller market
  • Essential items only
  • Tourist-focused products
```

### Cost Analysis by Warehouse

| Warehouse | Monthly Rent | Staff Cost | Utilities | Total | Cost per LKR Inventory |
|-----------|-------------|------------|-----------|-------|----------------------|
| Colombo | 250,000 | 180,000 | 45,000 | 475,000 | 15.1% |
| Kandy | 120,000 | 90,000 | 22,000 | 232,000 | 14.7% |
| Galle | 75,000 | 60,000 | 15,000 | 150,000 | 28.6% |

Analysis: Galle has highest cost per LKR inventory stored. Consider consolidation or increase throughput.

### Expected Outcome
- Complete breakdown by warehouse location
- Utilization percentage per warehouse
- Performance comparison across locations
- Stock transfer recommendations

### Verification Checklist
- [ ] get_stock_by_warehouse method implemented
- [ ] Stock levels grouped by warehouse
- [ ] Value calculated per warehouse
- [ ] Percentage distribution computed
- [ ] Product count per warehouse included
- [ ] Utilization percentage calculated
- [ ] Turnover rate per warehouse included
- [ ] Transfer opportunities identified
- [ ] Warehouses sorted by value DESC
- [ ] Performance insights added
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 45: Add Reorder Alert List

### Overview
Implement the get_reorder_alerts method to generate a prioritized list of products requiring reorder based on current stock levels, reorder points, lead times, and sales velocity. This proactive alert system prevents stockouts.

### Dependencies
- Task 44: Add Stock by Warehouse KPI

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Add new method after get_stock_by_warehouse

2. **Add get_reorder_alerts method**
   - Define method with parameters for urgency filtering
   - Add comprehensive docstring

3. **Query products needing reorder**
   - Get products where current_qty ≤ reorder_point
   - Include products with quantity > 0 (not yet out of stock)
   - Filter for active products only

4. **Calculate urgency level**
   - Critical: current_qty ≤ 25% of reorder_point
   - High: current_qty ≤ 50% of reorder_point
   - Medium: current_qty ≤ 75% of reorder_point
   - Normal: current_qty ≤ reorder_point

5. **Calculate suggested order quantity**
   - Formula: suggested_qty = max_stock_level - current_qty
   - Alternative: (reorder_qty if configured) OR (reorder_point × 2)
   - Consider Economic Order Quantity (EOQ) if available

6. **Estimate days until stockout**
   - Get sales velocity (units per day)
   - Calculate: days_remaining = current_qty / velocity
   - Flag products with < 3 days remaining

7. **Consider lead time**
   - Get supplier lead time in days
   - Adjust urgency if days_remaining < lead_time
   - Escalate to Critical if stockout likely before delivery

8. **Calculate reorder value**
   - Reorder value = suggested_qty × unit_cost
   - Sum total reorder value for budgeting

9. **Sort by urgency and criticality**
   - Primary sort: urgency level (Critical first)
   - Secondary sort: days_remaining (ASC)
   - Tertiary sort: sales velocity (DESC - fast movers first)

10. **Format response**
    - Return dictionary with alerts list
    - Include summary statistics
    - Add total reorder value for budget planning

11. **Update get_all_kpis method**
    - Call get_reorder_alerts()
    - Add result to kpis dictionary with key "reorder_alerts"

### Reorder Alert Calculation

```
Reorder Alert Trigger Logic
════════════════════════════

Alert triggered when:
  current_qty ≤ reorder_point

Urgency Levels:
  CRITICAL:  current_qty ≤ 25% of reorder_point
  HIGH:      current_qty ≤ 50% of reorder_point
  MEDIUM:    current_qty ≤ 75% of reorder_point
  NORMAL:    current_qty ≤ 100% of reorder_point

Example:
  Product: Rice 5kg
  Current Qty: 5 units
  Reorder Point: 20 units
  
  Percentage: 5 / 20 = 25%
  Urgency: CRITICAL (≤ 25%)
```

### Days Until Stockout Calculation

```
Stockout Estimation
═══════════════════

Days Remaining = Current Qty / Sales Velocity

Example 1: Critical Situation
  Product: Coconut Oil 1L
  Current Qty: 8 units
  Velocity: 7 units/day
  
  Days Remaining = 8 / 7 = 1.14 days ≈ 1 day
  
  Urgency: CRITICAL
  Action: Emergency order required

Example 2: With Lead Time
  Product: Tea Bags 100s
  Current Qty: 15 units
  Velocity: 6 units/day
  Lead Time: 3 days
  
  Days Remaining = 15 / 6 = 2.5 days
  
  Status: Days remaining < Lead time
  Urgency: Escalate to CRITICAL
  Reason: Stockout before delivery arrival
```

### Reorder Alert Response Structure

```json
{
  "reorder_alerts": {
    "total_alerts": 8,
    "critical_count": 2,
    "high_count": 3,
    "medium_count": 2,
    "normal_count": 1,
    "total_reorder_value": 385000.00,
    "formatted_total": "LKR 385,000.00",
    "alerts": [
      {
        "product_id": 123,
        "product_name": "Rice 5kg - Samba",
        "sku": "RICE-5KG-SAMB",
        "category": "Grains & Rice",
        "current_qty": 5,
        "reorder_point": 20,
        "max_stock_level": 100,
        "suggested_qty": 95,
        "unit_cost": 650.00,
        "reorder_value": 61750.00,
        "formatted_value": "LKR 61,750.00",
        "urgency": "critical",
        "stock_percentage": 25.0,
        "velocity": 8.5,
        "days_remaining": 0.6,
        "lead_time_days": 2,
        "stockout_risk": "imminent",
        "priority": 1,
        "action": "Place emergency order immediately"
      }
    ]
  }
}
```

### Urgency Level Determination

```
Urgency Classification Matrix
══════════════════════════════

Current Qty vs Reorder Point:

100%+ ─────────────── No Alert
      │
 75%  ├─────────────── NORMAL
      │
 50%  ├─────────────── MEDIUM
      │
 25%  ├─────────────── HIGH
      │
  0%  └─────────────── CRITICAL


Additional Escalation Factors:
  • Days remaining < Lead time → Escalate +1 level
  • Fast mover (velocity > 5/day) → Escalate +1 level
  • Essential item flag → Escalate +1 level
```

### Sri Lankan Supplier Lead Times

| Product Category | Typical Lead Time | Example Products |
|-----------------|------------------|------------------|
| Local Produce | 1-2 days | Rice, vegetables, fruits |
| Local FMCG | 2-3 days | Biscuits, cleaning products |
| Imported FMCG | 7-14 days | Premium foods, cosmetics |
| Electronics | 14-21 days | Appliances, gadgets |
| Specialty Items | 21-45 days | Imported wines, gourmet |

### Reorder Alert Example - Supermarket

```
Reorder Alerts - Daily Report
══════════════════════════════

🔴 CRITICAL (2 items - Emergency orders needed):

1. Rice 5kg - Samba
   Current: 5 units | Reorder: 20 | Velocity: 8.5/day
   Days left: 0.6 days (15 hours!)
   Suggested order: 95 units | Value: LKR 61,750
   Action: Call supplier NOW, arrange same-day delivery

2. Fresh Milk 1L
   Current: 3 units | Reorder: 15 | Velocity: 5.2/day
   Days left: 0.6 days
   Suggested order: 72 units | Value: LKR 36,000
   Action: Emergency purchase from local supplier

🟠 HIGH (3 items - Order today):

3. Coconut Oil 1L
   Current: 10 units | Reorder: 25 | Velocity: 7.0/day
   Days left: 1.4 days | Lead time: 2 days
   Suggested order: 90 units | Value: LKR 45,000
   Action: Place order today for delivery tomorrow

4. Tea Bags 100s
   Current: 12 units | Reorder: 25 | Velocity: 6.0/day
   Days left: 2.0 days | Lead time: 3 days
   Suggested order: 88 units | Value: LKR 48,400
   Action: Order today, potential stockout before delivery

5. Dhal 500g
   Current: 8 units | Reorder: 20 | Velocity: 5.5/day
   Days left: 1.5 days
   Suggested order: 72 units | Value: LKR 28,800
   Action: Priority order

Total Reorder Value: LKR 220,950
```

### Suggested Order Quantity Logic

```
Order Quantity Calculation
══════════════════════════

Method 1: Max Stock Level (Preferred)
  suggested_qty = max_stock_level - current_qty

Example:
  Current: 5 | Max: 100
  Suggested: 100 - 5 = 95 units

Method 2: Configured Reorder Quantity
  If product has specific reorder_qty configured
  suggested_qty = reorder_qty

Method 3: Safety Stock Formula
  suggested_qty = (reorder_point × 2) - current_qty

Example:
  Current: 10 | Reorder Point: 25
  Suggested: (25 × 2) - 10 = 40 units

Method 4: Economic Order Quantity (EOQ)
  EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost)
  
  Use for high-value, slow-moving items
```

### Priority Ranking Algorithm

```
Alert Priority Score
════════════════════

Priority = (Urgency Weight × 10) + 
           (Velocity Rank) + 
           (Critical Item Bonus)

Urgency Weights:
  • Critical: 100
  • High: 75
  • Medium: 50
  • Normal: 25

Velocity Rank:
  • > 10/day: +20
  • 5-10/day: +15
  • 2-5/day: +10
  • < 2/day: +5

Critical Item Bonus:
  • Essential item: +25
  • Promotional item: +15
  • Regular item: +0

Example:
  Rice 5kg (Critical, 8.5/day, Essential):
  Priority = (100 × 10) + 15 + 25 = 1,040
  Rank: #1
```

### Budget Planning Summary

```
Reorder Budget Requirements
════════════════════════════

Critical Orders (Immediate):
  2 items                    LKR  97,750

High Priority (Today):
  3 items                    LKR 122,200

Medium Priority (This Week):
  2 items                    LKR  95,050

Normal Priority (Next Week):
  1 item                     LKR  70,000
  ─────────────────────────────────────
  Total Reorder Budget:      LKR 385,000

Cash Flow Planning:
  • Immediate (Today):       LKR 219,950
  • This Week:               LKR  95,050
  • Next Week:               LKR  70,000
```

### Expected Outcome
- Prioritized list of products needing reorder
- Urgency-based categorization
- Days until stockout calculation
- Suggested order quantities with values

### Verification Checklist
- [ ] get_reorder_alerts method implemented
- [ ] Filters for current_qty ≤ reorder_point
- [ ] Urgency level calculated (Critical/High/Medium/Normal)
- [ ] Stock percentage computed
- [ ] Sales velocity included
- [ ] Days until stockout calculated
- [ ] Lead time considered
- [ ] Suggested order quantity determined
- [ ] Reorder value calculated
- [ ] Alerts sorted by priority
- [ ] Summary statistics included
- [ ] Method called in get_all_kpis
- [ ] Response matches expected structure

---

## Task 46: Create Inventory KPI Cache

### Overview
Implement Redis caching for inventory KPIs to improve performance. Inventory calculations can be resource-intensive with large product catalogs, so caching significantly improves dashboard load times while maintaining reasonable data freshness.

### Dependencies
- Task 45: Add Reorder Alert List
- Redis server configured
- CacheService exists

### Instructions

1. **Open inventory.py calculator file**
   - Continue in InventoryKPICalculator class
   - Prepare to add caching logic

2. **Import caching utilities**
   - Import CacheService from dashboard services
   - Import cache decorators if available
   - Import cache key builders

3. **Define cache TTL constants**
   - CACHE_TTL_INVENTORY_VALUE = 3600 (1 hour)
   - CACHE_TTL_STOCK_ALERTS = 1800 (30 minutes)
   - CACHE_TTL_MOVEMENT_DATA = 3600 (1 hour)
   - Document TTL rationale

4. **Update get_all_kpis method with caching**
   - Check cache before calculations
   - Use cache key: f"kpi:inventory:all:{tenant_id}"
   - If cache hit, return cached data
   - If cache miss, calculate and store

5. **Add cache for stock_value**
   - Cache key: f"kpi:inventory:value:{tenant_id}"
   - TTL: 1 hour
   - Invalidate on stock changes

6. **Add cache for reorder_alerts**
   - Cache key: f"kpi:inventory:alerts:{tenant_id}"
   - TTL: 30 minutes (more frequent updates needed)
   - Invalidate on stock changes

7. **Add cache for stock_by_category**
   - Cache key: f"kpi:inventory:category:{tenant_id}"
   - TTL: 1 hour
   - Invalidate on stock changes or product updates

8. **Add cache for stock_by_warehouse**
   - Cache key: f"kpi:inventory:warehouse:{tenant_id}"
   - TTL: 1 hour
   - Invalidate on stock movements

9. **Add cache for movement metrics**
   - Cache key: f"kpi:inventory:movement:{tenant_id}"
   - Includes turnover, DOI, fast/slow movers
   - TTL: 1 hour

10. **Implement cache warming**
    - Add method: warm_inventory_cache()
    - Optionally pre-calculate for all tenants
    - Schedule during off-peak hours

11. **Add cache statistics tracking**
    - Track hit/miss ratios
    - Log cache performance
    - Monitor TTL effectiveness

### Cache Key Structure

```
Inventory KPI Cache Keys
════════════════════════

Pattern: kpi:inventory:{metric}:{tenant_id}

Examples:
  kpi:inventory:all:tenant123
  kpi:inventory:value:tenant123
  kpi:inventory:alerts:tenant123
  kpi:inventory:category:tenant123
  kpi:inventory:warehouse:tenant123
  kpi:inventory:movement:tenant123
```

### Cache TTL Strategy

```
Time-To-Live Configuration
══════════════════════════

Metric              TTL      Rationale
─────────────────────────────────────────
Stock Value         1 hour   Changes slowly
Reorder Alerts      30 min   Need timely updates
Stock Counts        1 hour   Relatively stable
Turnover Ratio      1 hour   Historical data
Fast Movers         1 hour   Based on period data
Slow Movers         1 hour   Based on period data
Dead Stock          1 hour   Changes slowly
By Category         1 hour   Aggregate data
By Warehouse        1 hour   Aggregate data
```

### Caching Implementation Example

```python
# Pseudocode for caching logic

def get_all_kpis(self):
    """Get all inventory KPIs with caching."""
    
    # Build cache key
    cache_key = f"kpi:inventory:all:{self.tenant_id}"
    
    # Try to get from cache
    cached_data = cache.get(cache_key)
    if cached_data:
        logger.debug(f"Cache HIT for {cache_key}")
        return cached_data
    
    logger.debug(f"Cache MISS for {cache_key}")
    
    # Calculate KPIs (cache miss)
    kpis = {
        "stock_value": self.get_stock_value(),
        "low_stock_count": self.get_low_stock_count(),
        "out_of_stock_count": self.get_out_of_stock_count(),
        # ... other KPIs
    }
    
    # Store in cache
    cache.set(cache_key, kpis, timeout=3600)
    
    return kpis
```

### Cache Performance Metrics

```
Cache Performance Tracking
══════════════════════════

Metrics to Monitor:
  • Hit Rate: (Hits / Total Requests) × 100%
  • Miss Rate: (Misses / Total Requests) × 100%
  • Average Response Time (cached vs uncached)
  • Cache Size (memory usage)
  • Eviction Rate

Target KPIs:
  • Hit Rate: > 80%
  • Response Time (cached): < 50ms
  • Response Time (uncached): < 2000ms
  • Cache Memory: < 100MB per tenant

Example Report:
  Period: Last 24 hours
  Total Requests: 1,250
  Cache Hits: 1,087 (87%)
  Cache Misses: 163 (13%)
  Avg Response (cached): 42ms
  Avg Response (uncached): 1,850ms
  Performance Improvement: 44× faster
```

### Cache Warming Strategy

```
Cache Warming Implementation
════════════════════════════

When to Warm Cache:
  • Application startup
  • After cache clear/flush
  • During off-peak hours (2 AM - 5 AM)
  • After major data imports

How to Warm:
  1. Get list of active tenants
  2. For each tenant:
     - Calculate all inventory KPIs
     - Store in cache with full TTL
     - Throttle to avoid overload
  3. Log warming completion

Example Schedule:
  Daily at 3:00 AM:
    - Warm inventory KPIs
    - Warm sales KPIs
    - Expected duration: 15-30 minutes
```

### Memory Management

```
Cache Size Estimation
═════════════════════

Per Tenant Cache Size:
  • All KPIs JSON:        ~5 KB
  • Stock Value:          ~1 KB
  • Reorder Alerts:       ~10 KB (depends on count)
  • By Category:          ~3 KB
  • By Warehouse:         ~2 KB
  • Movement Metrics:     ~8 KB
  ─────────────────────────────
  Total per Tenant:       ~30 KB

For 100 Tenants:
  Total Cache Size:       ~3 MB

For 1,000 Tenants:
  Total Cache Size:       ~30 MB

Conclusion: Very manageable memory footprint
```

### Cache Invalidation Preview

```
Cache Invalidation Triggers
═══════════════════════════

Events that Invalidate Cache:
  • Stock adjustment (quantity change)
  • Product created/updated/deleted
  • Stock transfer between warehouses
  • Sale transaction completed
  • Purchase order received
  • Inventory count adjustment

Invalidation Strategy:
  • Clear specific key: cache.delete(key)
  • Clear pattern: cache.delete_pattern("kpi:inventory:*")
  • Selective invalidation based on change type
```

### Expected Outcome
- Redis caching for all inventory KPIs
- Configurable TTL per metric type
- Improved dashboard response times
- Foundation for cache invalidation

### Verification Checklist
- [ ] Redis connection verified
- [ ] Cache keys defined with tenant isolation
- [ ] TTL constants configured
- [ ] get_all_kpis method checks cache
- [ ] Individual KPI methods support caching
- [ ] Cache hit/miss logged
- [ ] Cache warming method implemented
- [ ] Memory usage monitored
- [ ] Documentation updated

---

## Task 47: Add Inventory Cache Invalidation

### Overview
Implement cache invalidation strategies for inventory KPIs to ensure data freshness when stock levels change. Automatic invalidation on relevant events prevents stale data while maintaining cache benefits.

### Dependencies
- Task 46: Create Inventory KPI Cache

### Instructions

1. **Create signals.py file**
   - Navigate to `apps/dashboard/` directory
   - Create `signals.py` if it doesn't exist
   - Import Django signals framework

2. **Import required models and signals**
   - Import StockLevel, StockMovement, Product models
   - Import post_save, post_delete, pre_save signals
   - Import cache service

3. **Create invalidate_inventory_cache function**
   - Define function accepting tenant_id parameter
   - Clear all inventory-related cache keys for tenant
   - Log invalidation event

4. **Add signal for StockLevel changes**
   - Connect to post_save signal for StockLevel
   - Detect quantity changes
   - Invalidate inventory cache on change

5. **Add signal for StockMovement**
   - Connect to post_save signal for StockMovement
   - Invalidate on new stock movements (sales, receipts, adjustments)
   - Clear movement-related caches

6. **Add signal for Product updates**
   - Connect to post_save signal for Product
   - Invalidate when cost, reorder_point, or max_stock changes
   - Preserve cache for non-impacting changes (description, etc.)

7. **Add signal for Product deletion**
   - Connect to post_delete signal for Product
   - Invalidate category and warehouse breakdowns
   - Clear all KPIs that include product counts

8. **Implement selective invalidation**
   - Create function: invalidate_selective(tenant_id, keys_list)
   - Only clear specific cache keys affected by change
   - More efficient than full invalidation

9. **Add batch invalidation support**
   - Handle bulk operations efficiently
   - Debounce multiple rapid changes
   - Invalidate once after batch completes

10. **Register signals in app config**
    - Update `apps/dashboard/apps.py`
    - Import signals in ready() method
    - Ensure signals are connected on startup

11. **Add manual invalidation endpoint**
    - Create management command: clear_inventory_cache
    - Allow admin to manually clear cache
    - Useful for troubleshooting

### Signal Connection Example

```python
# Pseudocode for signal connections

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.inventory.models import StockLevel, StockMovement
from apps.products.models import Product

@receiver(post_save, sender=StockLevel)
def invalidate_on_stock_change(sender, instance, **kwargs):
    """Invalidate inventory cache when stock level changes."""
    
    tenant_id = instance.tenant_id
    
    # Invalidate affected caches
    cache_keys = [
        f"kpi:inventory:all:{tenant_id}",
        f"kpi:inventory:value:{tenant_id}",
        f"kpi:inventory:alerts:{tenant_id}",
        f"kpi:inventory:warehouse:{tenant_id}",
    ]
    
    for key in cache_keys:
        cache.delete(key)
    
    logger.info(f"Invalidated inventory cache for tenant {tenant_id}")


@receiver(post_save, sender=StockMovement)
def invalidate_on_stock_movement(sender, instance, **kwargs):
    """Invalidate cache on stock movements (sales, receipts)."""
    
    tenant_id = instance.tenant_id
    
    # Clear movement-related caches
    cache.delete(f"kpi:inventory:movement:{tenant_id}")
    cache.delete(f"kpi:inventory:all:{tenant_id}")
    
    logger.info(f"Invalidated movement cache for tenant {tenant_id}")
```

### Invalidation Trigger Matrix

| Event | Affected Caches | Invalidation Type |
|-------|----------------|-------------------|
| Stock quantity change | value, alerts, warehouse | Full |
| Sale transaction | movement, value | Selective |
| Purchase receipt | value, alerts | Selective |
| Product cost change | value, category | Selective |
| Reorder point change | alerts | Selective |
| Product deleted | all, category | Full |
| Warehouse transfer | warehouse, value | Selective |
| Bulk adjustment | all | Full (debounced) |

### Selective Invalidation Logic

```
Selective Cache Invalidation
════════════════════════════

Scenario 1: Stock Quantity Change
  Event: StockLevel.quantity updated
  Affects:
    ✓ kpi:inventory:value
    ✓ kpi:inventory:alerts
    ✓ kpi:inventory:warehouse
  Does NOT affect:
    ✗ kpi:inventory:movement (historical data)
  
  Action: Invalidate 3 specific keys

Scenario 2: Sale Transaction
  Event: New StockMovement (type=SALE)
  Affects:
    ✓ kpi:inventory:value (qty decreased)
    ✓ kpi:inventory:movement (new sale)
    ✓ kpi:inventory:alerts (qty may drop below reorder)
  
  Action: Invalidate 3 keys

Scenario 3: Product Description Change
  Event: Product.description updated
  Affects:
    ✗ No KPI calculations use description
  
  Action: No invalidation needed
```

### Debouncing for Bulk Operations

```
Bulk Operation Handling
═══════════════════════

Problem:
  • Importing 1,000 products triggers 1,000 signals
  • Each signal invalidates cache
  • Results in 1,000 cache clears
  • Very inefficient

Solution: Debouncing
  1. Detect bulk operation start
  2. Queue invalidation requests
  3. Suppress actual cache clears
  4. After bulk operation completes
  5. Execute one cache clear
  
Implementation:
  • Use transaction signals
  • Flag: _invalidation_pending
  • Clear once in on_commit hook

Example:
  Bulk Import: 1,000 products
  Signals fired: 1,000
  Cache clears: 1 (debounced)
  Performance gain: 1000×
```

### Invalidation Performance Impact

```
Cache Invalidation Cost Analysis
═════════════════════════════════

Operation: Clear single cache key
  Time: < 1ms
  Impact: Negligible

Operation: Clear pattern (wildcard)
  Time: 5-50ms (depends on key count)
  Impact: Low

Operation: Full cache flush
  Time: 100-500ms
  Impact: Moderate (avoid if possible)

Recommendation:
  • Use selective invalidation when possible
  • Avoid full cache flushes
  • Debounce bulk operations
  • Monitor invalidation frequency
```

### Manual Cache Management

```
Management Command
══════════════════

Usage:
  python manage.py clear_inventory_cache --tenant=123
  python manage.py clear_inventory_cache --all

Options:
  --tenant <id>    Clear cache for specific tenant
  --all            Clear cache for all tenants
  --pattern <pat>  Clear specific cache pattern
  --warm           Warm cache after clearing

Example Output:
  $ python manage.py clear_inventory_cache --tenant=123
  
  Clearing inventory cache for tenant 123...
  Deleted 6 cache keys:
    - kpi:inventory:all:123
    - kpi:inventory:value:123
    - kpi:inventory:alerts:123
    - kpi:inventory:category:123
    - kpi:inventory:warehouse:123
    - kpi:inventory:movement:123
  
  Cache cleared successfully.
  Cache will regenerate on next request.
```

### Monitoring Invalidation Patterns

```
Invalidation Analytics
══════════════════════

Track These Metrics:
  • Invalidation frequency per tenant
  • Invalidation triggers (event types)
  • Time between invalidation and regeneration
  • Cache hit rate after invalidation
  
Red Flags:
  ⚠️ Invalidations > 100/hour per tenant
     → Check for polling loops or inefficient code
  
  ⚠️ Cache regeneration immediately after invalidation
     → Consider longer TTL or reduce invalidation frequency
  
  ⚠️ Low hit rate (< 60%)
     → TTL too short or too many invalidations
```

### Expected Outcome
- Automatic cache invalidation on stock changes
- Django signals connected for relevant models
- Selective invalidation for efficiency
- Manual cache management commands

### Verification Checklist
- [ ] signals.py file created
- [ ] StockLevel post_save signal connected
- [ ] StockMovement post_save signal connected
- [ ] Product post_save signal connected
- [ ] Product post_delete signal connected
- [ ] Selective invalidation implemented
- [ ] Batch operation debouncing added
- [ ] Signals registered in app config
- [ ] Management command created
- [ ] Invalidation logging added
- [ ] Documentation updated

---

## Task 48: Create Inventory KPI Endpoint

### Overview
Create the API endpoint for retrieving inventory KPIs. This RESTful endpoint provides access to all inventory metrics calculated in previous tasks, with proper authentication, permissions, and documentation.

### Dependencies
- Task 47: Add Inventory Cache Invalidation
- DRF configured
- DashboardViewSet exists (or create new InventoryKPIViewSet)

### Instructions

1. **Open views/dashboard.py file**
   - Navigate to `apps/dashboard/views/dashboard.py`
   - Import InventoryKPICalculator

2. **Add inventory KPI endpoint to DashboardViewSet**
   - Add @action decorator for inventory endpoint
   - Define methods=['get']
   - Set permission classes

3. **Define inventory action method**
   - Method name: inventory(request)
   - Get tenant from request
   - Instantiate InventoryKPICalculator

4. **Add query parameter support**
   - period: for time-based calculations (default: 30)
   - category_id: filter by category (optional)
   - warehouse_id: filter by warehouse (optional)
   - refresh: force cache refresh (admin only)

5. **Call get_all_kpis method**
   - Get complete inventory KPI data
   - Handle any exceptions
   - Return formatted response

6. **Add response serialization**
   - Create InventoryKPISerializer if needed
   - Or return plain JSON (KPIs are already structured)

7. **Add OpenAPI documentation**
   - Use @extend_schema decorator (drf-spectacular)
   - Document response structure
   - Document query parameters
   - Add examples

8. **Update URL routing**
   - Register endpoint: GET /api/v1/dashboard/inventory/
   - Ensure proper URL pattern in urls.py

9. **Add error handling**
   - Try-except for calculator errors
   - Return appropriate HTTP status codes
   - Log errors for debugging

10. **Add rate limiting**
    - Apply throttle classes
    - Limit: 60 requests/minute per user
    - Prevent cache exhaustion

### API Endpoint Structure

```
Endpoint: GET /api/v1/dashboard/inventory/
Method: GET
Authentication: Required (JWT or Session)
Permissions: IsAuthenticated, ViewInventoryKPI

Query Parameters:
  - period: integer (days, default: 30)
  - category_id: integer (optional)
  - warehouse_id: integer (optional)
  - refresh: boolean (default: false, admin only)

Response: 200 OK
  Content-Type: application/json
```

### Request Examples

```bash
# Get all inventory KPIs (default 30-day period)
GET /api/v1/dashboard/inventory/

# Get inventory KPIs for 90-day period
GET /api/v1/dashboard/inventory/?period=90

# Get inventory KPIs for specific category
GET /api/v1/dashboard/inventory/?category_id=5

# Get inventory KPIs for specific warehouse
GET /api/v1/dashboard/inventory/?warehouse_id=2

# Force cache refresh (admin only)
GET /api/v1/dashboard/inventory/?refresh=true
```

### Response Structure

```json
{
  "status": "success",
  "timestamp": "2026-01-27T10:30:00Z",
  "period_days": 30,
  "category": "INVENTORY",
  "data": {
    "stock_value": {
      "value": 5250000.00,
      "formatted": "LKR 5,250,000.00",
      "trend": "up",
      "change_percent": 3.2
    },
    "low_stock_count": {
      "value": 15,
      "urgency": "warning",
      "items": [...]
    },
    "out_of_stock_count": {
      "value": 3,
      "urgency": "critical",
      "items": [...]
    },
    "overstock_count": {
      "value": 8,
      "total_excess_value": 125000.00,
      "items": [...]
    },
    "inventory_turnover": {
      "value": 4.2,
      "interpretation": "Good"
    },
    "days_of_inventory": {
      "value": 87,
      "trend": "stable"
    },
    "fast_moving": {
      "items": [...]
    },
    "slow_moving": {
      "items": [...]
    },
    "dead_stock": {
      "count": 12,
      "total_value": 425000.00,
      "items": [...]
    },
    "by_category": {
      "categories": [...]
    },
    "by_warehouse": {
      "warehouses": [...]
    },
    "reorder_alerts": {
      "total_alerts": 8,
      "critical_count": 2,
      "alerts": [...]
    }
  },
  "meta": {
    "cached": true,
    "cache_age_seconds": 245,
    "generated_at": "2026-01-27T10:26:00Z"
  }
}
```

### Error Responses

```json
# 400 Bad Request - Invalid parameter
{
  "status": "error",
  "code": "INVALID_PARAMETER",
  "message": "Period must be between 1 and 365 days",
  "details": {
    "field": "period",
    "provided": 500
  }
}

# 403 Forbidden - Insufficient permissions
{
  "status": "error",
  "code": "PERMISSION_DENIED",
  "message": "You do not have permission to view inventory KPIs"
}

# 500 Internal Server Error - Calculation error
{
  "status": "error",
  "code": "CALCULATION_ERROR",
  "message": "An error occurred while calculating inventory KPIs",
  "details": {
    "error_id": "ERR-20260127-103045"
  }
}
```

### OpenAPI Documentation

```python
# Pseudocode for OpenAPI schema

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    operation_id="dashboard_inventory_kpis",
    summary="Get Inventory KPIs",
    description=(
        "Retrieve comprehensive inventory KPIs including stock value, "
        "turnover metrics, reorder alerts, and more. "
        "Data is cached for performance."
    ),
    parameters=[
        OpenApiParameter(
            name="period",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Number of days for calculation (default: 30)",
            required=False,
        ),
        OpenApiParameter(
            name="category_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Filter by category ID",
            required=False,
        ),
        OpenApiParameter(
            name="warehouse_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Filter by warehouse ID",
            required=False,
        ),
        OpenApiParameter(
            name="refresh",
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description="Force cache refresh (admin only)",
            required=False,
        ),
    ],
    responses={
        200: InventoryKPIResponseSchema,
        400: ErrorResponseSchema,
        403: ErrorResponseSchema,
        500: ErrorResponseSchema,
    },
    tags=["Dashboard"],
)
def inventory(self, request):
    """Get inventory KPIs endpoint."""
    # Implementation here
```

### Permission Handling

```python
# Permission classes

class ViewInventoryKPI(BasePermission):
    """
    Permission to view inventory KPIs.
    
    Granted to:
      - Admin
      - Manager
      - Inventory Manager
      - Warehouse Staff (limited view)
    """
    
    def has_permission(self, request, view):
        user = request.user
        
        if not user.is_authenticated:
            return False
        
        # Admin has full access
        if user.is_staff or user.is_superuser:
            return True
        
        # Check role-based permissions
        allowed_roles = ['manager', 'inventory_manager', 'warehouse_staff']
        return user.role in allowed_roles
```

### Rate Limiting Configuration

```python
# Throttle classes

from rest_framework.throttling import UserRateThrottle

class InventoryKPIThrottle(UserRateThrottle):
    """
    Rate limiting for inventory KPI endpoint.
    
    Limits:
      - 60 requests per minute per user
      - Prevents cache exhaustion
    """
    scope = 'inventory_kpi'
    rate = '60/min'


# In views.py
@action(detail=False, methods=['get'], throttle_classes=[InventoryKPIThrottle])
def inventory(self, request):
    # Implementation
```

### Endpoint Testing

```python
# Test cases

def test_inventory_kpi_endpoint_success(api_client, authenticated_user):
    """Test successful inventory KPI retrieval."""
    
    response = api_client.get('/api/v1/dashboard/inventory/')
    
    assert response.status_code == 200
    assert 'data' in response.json()
    assert 'stock_value' in response.json()['data']


def test_inventory_kpi_with_period(api_client, authenticated_user):
    """Test inventory KPIs with custom period."""
    
    response = api_client.get('/api/v1/dashboard/inventory/?period=90')
    
    assert response.status_code == 200
    assert response.json()['period_days'] == 90


def test_inventory_kpi_unauthorized(api_client):
    """Test endpoint requires authentication."""
    
    response = api_client.get('/api/v1/dashboard/inventory/')
    
    assert response.status_code == 401


def test_inventory_kpi_invalid_period(api_client, authenticated_user):
    """Test validation of period parameter."""
    
    response = api_client.get('/api/v1/dashboard/inventory/?period=500')
    
    assert response.status_code == 400
    assert 'period' in response.json()['details']
```

### Expected Outcome
- RESTful API endpoint for inventory KPIs
- Query parameter support for customization
- Proper authentication and permissions
- Complete OpenAPI documentation

### Verification Checklist
- [ ] Endpoint created in DashboardViewSet
- [ ] URL routing configured
- [ ] Authentication required
- [ ] Permission classes assigned
- [ ] Query parameters supported (period, category_id, warehouse_id, refresh)
- [ ] InventoryKPICalculator integrated
- [ ] Response properly formatted
- [ ] Error handling implemented
- [ ] Rate limiting applied
- [ ] OpenAPI schema documentation added
- [ ] Unit tests written
- [ ] Integration tests passed

---

## Summary

This document completed the inventory KPI calculator implementation:

### Completed Components
- ✅ Slow-moving products identification with capital analysis
- ✅ Dead stock detection with liquidation strategies
- ✅ Stock value breakdown by category with distribution insights
- ✅ Stock value breakdown by warehouse with utilization metrics
- ✅ Reorder alert system with urgency prioritization
- ✅ Redis caching with configurable TTL
- ✅ Django signals for automatic cache invalidation
- ✅ RESTful API endpoint with complete documentation

### Key Achievements
1. **Comprehensive Analysis** - Slow movers, dead stock, breakdowns
2. **Proactive Alerts** - Reorder system with urgency levels
3. **Performance Optimization** - Redis caching with smart invalidation
4. **Production-Ready API** - Documented, authenticated, rate-limited

### Integration Complete
The InventoryKPICalculator is now fully integrated with:
- Cache service for performance
- Signal framework for data freshness
- API framework for client access
- Dashboard for visualization

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~988
