# Tasks 64-68: Unit Cost & Manufacturing Stock

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** D - Manufacturing Cost Calculation  
> **Document:** 02 of 02  
> **Tasks Covered:** 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-57-63_Cost-Calculation-Service.md](01_Tasks-57-63_Cost-Calculation-Service.md)
- **→ Next Group:** [../Group-E_Serializers-Views/](../Group-E_Serializers-Views/)

---

## Document Overview

This document completes the manufacturing services by adding unit cost calculation, selling price suggestions, and raw material stock checking for production feasibility. These services help merchants price products profitably and plan production based on material availability.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 64 | Add calculate_unit_cost Method | Low | 5 min |
| 65 | Add suggest_selling_price Method | Medium | 10 min |
| 66 | Create ManufacturingStockService | Medium | 10 min |
| 67 | Add check_raw_materials Method | High | 15 min |
| 68 | Add get_producible_quantity Method | High | 15 min |

---

## Task 64: Add calculate_unit_cost Method

### Overview
Calculate cost per output unit by dividing total cost by yield quantity.

### Dependencies
- Task 63: Add calculate_total_cost Method

### Instructions

1. **Define calculate_unit_cost method**
   - Divide total cost by yield_quantity
   - Returns cost per unit produced

2. **Call calculate_total_cost**
   - Get total manufacturing cost
   - Use previously implemented method

3. **Divide by yield**
   - Formula: total_cost / bom.yield_quantity
   - Result is cost per unit

4. **Handle zero yield**
   - Validate yield_quantity > 0
   - Return appropriate value or raise error

### Unit Cost Calculation
```
Total Cost: Rs. 1,026.90
Yield: 1 cake
Unit Cost: Rs. 1,026.90 / 1 = Rs. 1,026.90 per cake

Total Cost: Rs. 600
Yield: 12 cookies
Unit Cost: Rs. 600 / 12 = Rs. 50 per cookie
```

### Expected Outcome
Method calculates cost per output unit.

### Verification Checklist
- [ ] Divides total by yield
- [ ] Handles edge cases
- [ ] Returns Decimal type

---

## Task 65: Add suggest_selling_price Method

### Overview
Suggest retail price based on unit cost and desired profit margin.

### Dependencies
- Task 64: Add calculate_unit_cost Method

### Instructions

1. **Define suggest_selling_price method**
   - Parameter: margin_percent (desired profit margin)
   - Returns suggested selling price

2. **Calculate unit cost**
   - Use calculate_unit_cost method

3. **Apply margin**
   - Formula: unit_cost × (1 + margin_percent / 100)
   - Example: Rs. 1,000 × 1.40 = Rs. 1,400 (40% margin)

4. **Add markup options**
   - Margin on cost vs markup on price
   - Current: margin on cost (simpler)

5. **Return suggested price**
   - Round to reasonable increment
   - Consider psychological pricing

### Price Suggestion Examples
```
Unit Cost: Rs. 1,026.90
Margin: 40%
Suggested Price: Rs. 1,026.90 × 1.40 = Rs. 1,437.66
Rounded: Rs. 1,440 or Rs. 1,499

Unit Cost: Rs. 50
Margin: 60%
Suggested Price: Rs. 50 × 1.60 = Rs. 80
```

### Margin vs Markup
```
Margin (on cost):
  Cost: Rs. 100
  Margin: 50%
  Price: Rs. 100 × 1.50 = Rs. 150
  Profit: Rs. 50

Markup (on price):
  Cost: Rs. 100
  Markup: 50%
  Price: Rs. 100 / 0.50 = Rs. 200
  Profit: Rs. 100
```

### Expected Outcome
Method suggests retail price with margin.

### Verification Checklist
- [ ] Applies margin correctly
- [ ] Returns suggested price
- [ ] Handles different margins
- [ ] Returns Decimal type

---

## Task 66: Create ManufacturingStockService

### Overview
Create service to check raw material availability for production.

### Dependencies
- Task 65: Add suggest_selling_price Method

### Instructions

1. **Define ManufacturingStockService class**
   - In same manufacturing_services.py file
   - Handles stock availability checks

2. **Add class docstring**
   - Check raw material availability
   - Calculate maximum producible quantity

3. **Add __init__ method**
   - Accept bom parameter
   - Store as self.bom

4. **Plan methods**
   - check_raw_materials: verify all materials available
   - get_producible_quantity: max output quantity

### Service Structure
```
ManufacturingStockService(bom):
  ├── check_raw_materials(quantity) → bool
  │     Check if materials sufficient for quantity
  └── get_producible_quantity() → int
        Calculate max producible units
```

### Expected Outcome
ManufacturingStockService class defined.

### Verification Checklist
- [ ] Class defined
- [ ] Docstring added
- [ ] __init__ structured

---

## Task 67: Add check_raw_materials Method

### Overview
Verify all raw materials are available for specified production quantity.

### Dependencies
- Task 66: Create ManufacturingStockService

### Instructions

1. **Define check_raw_materials method**
   - Parameter: quantity (production quantity)
   - Returns: bool (all materials available)

2. **Retrieve BOM items**
   - Get all items with raw material info

3. **Check each material**
   - For each BOMItem:
     - Calculate required: item.quantity × quantity × (1 + wastage%)
     - Get available stock
     - Compare required vs available

4. **Handle substitutes**
   - If primary unavailable, check substitute
   - Sum primary + substitute stock

5. **Return availability**
   - True if all materials sufficient
   - False if any shortages

### Availability Check Algorithm
```
def check_raw_materials(production_qty):
    for item in bom.items.all():
        required = item.quantity * production_qty * (1 + item.wastage_percent/100)
        available = item.raw_material.stock_quantity
        
        if item.substitute:
            available += item.substitute.stock_quantity
        
        if available < required:
            return False
    
    return True
```

### Check Example
```
Production: 5 cakes
BOM requires per cake:
  - Flour: 0.5 kg + 5% wastage = 0.525 kg
  - Sugar: 0.2 kg + 2% wastage = 0.204 kg

Total needed for 5 cakes:
  - Flour: 2.625 kg
  - Sugar: 1.020 kg

Available stock:
  - Flour: 5 kg ✓ (sufficient)
  - Sugar: 0.5 kg ✗ (insufficient)

Result: False (cannot produce 5 cakes)
```

### Expected Outcome
Method verifies material availability.

### Verification Checklist
- [ ] Checks all materials
- [ ] Includes wastage
- [ ] Handles substitutes
- [ ] Returns boolean

---

## Task 68: Add get_producible_quantity Method

### Overview
Calculate maximum quantity that can be produced with current stock.

### Dependencies
- Task 67: Add check_raw_materials Method

### Instructions

1. **Define get_producible_quantity method**
   - Returns max production quantity
   - Based on limiting material

2. **Calculate per-material capacity**
   - For each BOMItem:
     - Get available stock
     - Calculate: available / (required_per_unit × (1 + wastage%))
     - Track minimum

3. **Handle yield_quantity**
   - Result is number of output units
   - Not number of batches

4. **Return minimum capacity**
   - Limiting material determines max output
   - Return as integer (complete units only)

### Producible Quantity Algorithm
```
min_quantity = infinity

For each BOMItem:
    available = item.raw_material.stock_quantity
    required_per_unit = item.quantity * (1 + item.wastage_percent/100)
    item_capacity = floor(available / required_per_unit)
    min_quantity = min(min_quantity, item_capacity)

# Adjust for yield
batches = min_quantity
output_units = batches * bom.yield_quantity

return output_units
```

### Calculation Example
```
Cake BOM (yield: 1 cake per batch):
  - Flour: 0.525 kg/cake, stock: 5 kg → 9 cakes
  - Sugar: 0.204 kg/cake, stock: 1 kg → 4 cakes
  - Eggs: 4 units/cake, stock: 50 → 12 cakes

Producible: MIN(9, 4, 12) = 4 cakes
Limiting Material: Sugar

Cookie BOM (yield: 12 cookies per batch):
  - Flour: 0.3 kg/batch, stock: 3 kg → 10 batches
  - Sugar: 0.15 kg/batch, stock: 2 kg → 13 batches

Producible: MIN(10, 13) = 10 batches = 120 cookies
```

### Expected Outcome
Method calculates maximum production quantity.

### Verification Checklist
- [ ] Calculates per-item capacity
- [ ] Finds minimum
- [ ] Handles yield correctly
- [ ] Returns integer

---

## Summary of Tasks 64-68

### What Was Accomplished
- Added unit cost calculation
- Implemented price suggestion with margin
- Created ManufacturingStockService
- Added material availability checking
- Calculated maximum producible quantity

### Complete Manufacturing Services
```
CostCalculationService:
  ├── Material cost calculations
  ├── Labor and overhead
  ├── calculate_unit_cost()
  └── suggest_selling_price(margin)

ManufacturingStockService:
  ├── check_raw_materials(quantity)
  └── get_producible_quantity()
```

### Key Formulas
```
Unit Cost = Total Cost / Yield Quantity

Suggested Price = Unit Cost × (1 + Margin %)

Producible Qty = MIN(
  material_1_stock / required_per_unit_1,
  material_2_stock / required_per_unit_2,
  ...
) × Yield Quantity
```

### Group D Complete
All manufacturing cost and stock services implemented. Merchants can now calculate costs, determine pricing, and plan production.

---

## Notes for Developers

### Pricing Strategy
- Calculate unit cost accurately
- Apply consistent margins
- Consider competitive pricing
- Round to psychological price points

### Production Planning
- Check materials before accepting orders
- Show max producible quantity
- Alert on low stock for critical materials
- Consider lead times for ordering

### Cost Management
- Track actual vs standard costs
- Analyze cost variances
- Update costs when material prices change
- Consider economies of scale

### Integration Points
- Product detail: show manufacturing cost
- Pricing: auto-suggest based on cost
- Orders: check producibility
- Inventory: alert on low materials
- Reports: cost analysis and margins

---
