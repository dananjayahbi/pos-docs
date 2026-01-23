# Tasks 57-63: Cost Calculation Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** D - Manufacturing Cost Calculation  
> **Document:** 01 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-64-68_Unit-Cost-Manufacturing-Stock.md](02_Tasks-64-68_Unit-Cost-Manufacturing-Stock.md)

---

## Document Overview

This document implements the cost calculation service for manufactured products using Bill of Materials. The service calculates material costs (with wastage), labor costs, overhead allocations, and total manufacturing costs. These calculations help determine product pricing and profitability.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create manufacturing_services.py | Low | 3 min |
| 58 | Create CostCalculationService Class | Medium | 10 min |
| 59 | Add calculate_material_cost Method | High | 15 min |
| 60 | Add calculate_with_wastage Method | Medium | 10 min |
| 61 | Add calculate_labor_cost Method | Medium | 10 min |
| 62 | Add calculate_overhead Method | Medium | 10 min |
| 63 | Add calculate_total_cost Method | Medium | 10 min |

---

## Task 57: Create manufacturing_services.py

### Overview
Create service file for manufacturing cost calculations and stock management.

### Dependencies
- Group C: Composite Product & BOM

### Instructions

1. **Create file in services directory**
   - File: services/manufacturing_services.py
   - Contains cost and stock services

2. **Add imports**
   - Decimal for calculations
   - BillOfMaterials, BOMItem models
   - Database transaction support
   - Typing hints

3. **Add file docstring**
   - Manufacturing cost calculation services
   - Stock availability for production

### Expected Outcome
```
services/
├── __init__.py
├── bundle_services.py
└── manufacturing_services.py  # NEW
```

### Verification Checklist
- [ ] File created
- [ ] Imports added
- [ ] Docstring present

---

## Task 58: Create CostCalculationService Class

### Overview
Define service class for manufacturing cost calculations.

### Dependencies
- Task 57: Create manufacturing_services.py

### Instructions

1. **Define CostCalculationService class**
   - No inheritance needed
   - Can use instance or static methods

2. **Add class docstring**
   - Calculate manufacturing costs from BOM
   - Material + Labor + Overhead

3. **Add __init__ method**
   - Accept bom parameter (BillOfMaterials instance)
   - Store as self.bom

4. **Plan method structure**
   - calculate_material_cost: sum raw material costs
   - calculate_with_wastage: include wastage
   - calculate_labor_cost: labor expenses
   - calculate_overhead: overhead allocation
   - calculate_total_cost: sum all components

### Service Structure
```
CostCalculationService(bom):
  ├── calculate_material_cost() → Decimal
  ├── calculate_with_wastage() → Decimal
  ├── calculate_labor_cost() → Decimal
  ├── calculate_overhead() → Decimal
  └── calculate_total_cost() → Decimal
```

### Expected Outcome
CostCalculationService class defined and ready for methods.

### Verification Checklist
- [ ] Class defined
- [ ] Docstring added
- [ ] __init__ method structured

---

## Task 59: Add calculate_material_cost Method

### Overview
Calculate total cost of raw materials needed for one production run.

### Dependencies
- Task 58: Create CostCalculationService Class

### Instructions

1. **Define calculate_material_cost method**
   - Returns base material cost (without wastage)
   - Sum all BOMItem costs

2. **Retrieve BOM items**
   - Query: bom.items.select_related('raw_material')
   - Get all items in BOM

3. **Calculate each item cost**
   - For each BOMItem:
     - Get raw_material cost_price or purchase_price
     - Multiply by item quantity
     - Sum all item costs

4. **Handle missing prices**
   - If material has no cost, use zero or raise warning
   - Log missing cost information

5. **Return total as Decimal**
   - Sum all material costs
   - Return Decimal('0.00') format

### Calculation Algorithm
```
material_cost = Decimal('0.00')

For each BOMItem:
    unit_price = item.raw_material.cost_price
    item_cost = item.quantity * unit_price
    material_cost += item_cost

return material_cost
```

### Calculation Example
```
Cake BOM Materials:
  - Flour: 0.5 kg × Rs. 300/kg = Rs. 150
  - Sugar: 0.2 kg × Rs. 400/kg = Rs. 80
  - Eggs: 4 units × Rs. 30/unit = Rs. 120
  - Butter: 0.1 kg × Rs. 800/kg = Rs. 80

Material Cost: Rs. 430
```

### Expected Outcome
Method calculates base material cost.

### Verification Checklist
- [ ] Method sums all material costs
- [ ] Handles missing prices
- [ ] Returns Decimal type
- [ ] Efficient queries used

---

## Task 60: Add calculate_with_wastage Method

### Overview
Adjust material cost to include wastage percentage.

### Dependencies
- Task 59: Add calculate_material_cost Method

### Instructions

1. **Define calculate_with_wastage method**
   - Includes wastage in cost calculation
   - Uses wastage_percent from BOMItems

2. **Calculate per-item wastage**
   - For each item:
     - Base cost: quantity × unit_price
     - Wastage cost: base_cost × (wastage_percent / 100)
     - Total: base_cost + wastage_cost

3. **Return total with wastage**
   - Sum all items with wastage included

### Calculation Algorithm
```
total_cost = Decimal('0.00')

For each BOMItem:
    unit_price = item.raw_material.cost_price
    base_cost = item.quantity * unit_price
    wastage_cost = base_cost * (item.wastage_percent / 100)
    item_total = base_cost + wastage_cost
    total_cost += item_total

return total_cost
```

### Wastage Example
```
Flour:
  Base: 0.5 kg × Rs. 300 = Rs. 150
  Wastage: 5%
  Wastage Cost: Rs. 150 × 0.05 = Rs. 7.50
  Total: Rs. 157.50

Sugar:
  Base: 0.2 kg × Rs. 400 = Rs. 80
  Wastage: 2%
  Wastage Cost: Rs. 80 × 0.02 = Rs. 1.60
  Total: Rs. 81.60

Material Cost with Wastage: Rs. 430 + Rs. 9.10 = Rs. 439.10
```

### Expected Outcome
Method includes wastage in material cost.

### Verification Checklist
- [ ] Calculates wastage per item
- [ ] Sums total with wastage
- [ ] Returns Decimal type

---

## Task 61: Add calculate_labor_cost Method

### Overview
Calculate labor cost for production.

### Dependencies
- Task 60: Add calculate_with_wastage Method

### Instructions

1. **Define calculate_labor_cost method**
   - Calculate direct labor expenses
   - Can be fixed per batch or time-based

2. **Implementation options**
   - Option A: Fixed labor cost per BOM
   - Option B: Time-based (hours × hourly rate)
   - Option C: Labor as BOMItem with special type

3. **Simple implementation**
   - Accept labor_rate and labor_hours parameters
   - Or store labor cost in BOM model
   - Return labor_hours × labor_rate

4. **Consider labor tracking**
   - May add labor_hours field to BOM
   - Or create separate Labor model
   - Current: simple calculation

### Labor Cost Examples
```
Cake Production:
  Labor Time: 2 hours
  Labor Rate: Rs. 250/hour
  Labor Cost: Rs. 500

Batch Production:
  Fixed Labor: Rs. 1,000 per batch
  (regardless of time)
```

### Expected Outcome
Method calculates labor expenses.

### Verification Checklist
- [ ] Calculates labor cost
- [ ] Supports different labor models
- [ ] Returns Decimal type

---

## Task 62: Add calculate_overhead Method

### Overview
Calculate overhead cost allocation for production.

### Dependencies
- Task 61: Add calculate_labor_cost Method

### Instructions

1. **Define calculate_overhead method**
   - Allocate overhead costs
   - Facility, utilities, equipment depreciation

2. **Overhead calculation methods**
   - Percentage of material cost (e.g., 20%)
   - Percentage of total direct cost
   - Fixed overhead per unit
   - Activity-based costing

3. **Simple implementation**
   - Accept overhead_rate parameter
   - Calculate: material_cost × overhead_rate
   - Or: fixed overhead amount

4. **Typical overhead**
   - Facility rent
   - Utilities
   - Equipment depreciation
   - Indirect labor
   - Quality control

### Overhead Examples
```
Overhead as percentage of material:
  Material Cost: Rs. 439
  Overhead Rate: 20%
  Overhead: Rs. 439 × 0.20 = Rs. 87.80

Fixed overhead per batch:
  Fixed Overhead: Rs. 100 per batch
```

### Expected Outcome
Method calculates overhead allocation.

### Verification Checklist
- [ ] Calculates overhead
- [ ] Supports multiple methods
- [ ] Returns Decimal type

---

## Task 63: Add calculate_total_cost Method

### Overview
Sum all cost components for total manufacturing cost.

### Dependencies
- Task 62: Add calculate_overhead Method

### Instructions

1. **Define calculate_total_cost method**
   - Sum: material + wastage + labor + overhead
   - Accepts optional parameters for labor/overhead

2. **Call component methods**
   - material_cost = calculate_with_wastage()
   - labor_cost = calculate_labor_cost(params)
   - overhead_cost = calculate_overhead(params)

3. **Sum all components**
   - total = material_cost + labor_cost + overhead_cost

4. **Return total cost**
   - Return as Decimal
   - This is cost for yield_quantity units

### Total Cost Calculation
```
Total Manufacturing Cost:
  Material (with wastage): Rs. 439.10
  Labor: Rs. 500.00
  Overhead: Rs. 87.80
  ────────────────
  Total: Rs. 1,026.90
```

### Expected Outcome
Method returns complete manufacturing cost.

### Verification Checklist
- [ ] Sums all cost components
- [ ] Accepts parameters
- [ ] Returns Decimal total

---

## Summary of Tasks 57-63

### What Was Accomplished
- Created manufacturing services file
- Implemented CostCalculationService class
- Calculated material costs
- Included wastage in calculations
- Added labor cost calculation
- Implemented overhead allocation
- Created total cost aggregation

### CostCalculationService Methods
```
CostCalculationService:
  ├── calculate_material_cost()
  │     Base material cost (no wastage)
  ├── calculate_with_wastage()
  │     Material cost including wastage
  ├── calculate_labor_cost(hours, rate)
  │     Direct labor expenses
  ├── calculate_overhead(rate)
  │     Overhead allocation
  └── calculate_total_cost()
        Total manufacturing cost
```

### Cost Formula
```
Total Cost = 
  Material Cost × (1 + Average Wastage %)
  + Labor Cost
  + Overhead Cost
```

### Next Steps
Next document adds unit cost calculation, price suggestions, and manufacturing stock service.

---

## Notes for Developers

### Cost Components
- **Material Cost:** Raw materials at purchase price
- **Wastage:** Expected losses during production
- **Labor Cost:** Direct production labor
- **Overhead:** Indirect costs allocated to production

### Decimal Precision
- Use Decimal for all monetary calculations
- Round to 2 decimal places
- Avoid float arithmetic errors

### Cost Tracking
- Store calculated costs in database (optional)
- Track cost history for analysis
- Compare actual vs standard costs

---
