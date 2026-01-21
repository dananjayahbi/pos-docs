# Group B: Tax Integration & Calculation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement tax-inclusive/exclusive calculations with Sri Lanka VAT/SVAT support

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Price-Type-Models](../Group-A_Price-Type-Models/)
- **→ Next Group:** [Group-C_Tiered-Volume-Pricing](../Group-C_Tiered-Volume-Pricing/)

---

## Group Overview

### Key Outcomes
- TaxClass model verification from Phase-03
- TaxCalculator service for tax computations
- Tax-inclusive to tax-exclusive conversion
- Tax-exclusive to tax-inclusive conversion
- Compound tax handling (VAT + NBT)
- SVAT exemption for B2B customers
- LKR rounding rules implementation
- Tax breakdown method with full details
- Tax calculation caching for performance
- PriceCalculationService unifying all pricing logic
- Tax audit logging for compliance
- Comprehensive tax calculation tests

### Technology Context
- **VAT Rate:** 12% (Sri Lanka standard rate 2025)
- **SVAT:** 0% for registered B2B customers
- **Rounding:** Nearest 0.01 LKR
- **Caching:** Redis for tax calculations

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-19-23_TaxCalculator-Service.md | 19-23 | TaxClass review, TaxCalculator, inclusive/exclusive conversion |
| 02 | 02_Tasks-24-28_Price-Methods-SVAT.md | 24-28 | Price with/without tax, exemptions, rounding, SVAT |
| 03 | 03_Tasks-29-34_Breakdown-Cache-Tests.md | 29-34 | Tax breakdown, caching, PriceCalculationService, audit, tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Review TaxClass model | Low | 15 min |
| 20 | Create TaxCalculator service | High | 35 min |
| 21 | Implement tax-inclusive to exclusive | Medium | 25 min |
| 22 | Implement tax-exclusive to inclusive | Low | 20 min |
| 23 | Handle compound tax scenarios | High | 30 min |
| 24 | Create get_price_with_tax method | Low | 20 min |
| 25 | Create get_price_without_tax method | Low | 15 min |
| 26 | Add tax exemption handling | Low | 20 min |
| 27 | Create price rounding utility | Low | 15 min |
| 28 | Add SVAT special handling | Medium | 25 min |
| 29 | Create tax breakdown method | Low | 20 min |
| 30 | Add tax calculation caching | Medium | 25 min |
| 31 | Create PriceCalculationService | High | 35 min |
| 32 | Add price calculation for variants | Medium | 25 min |
| 33 | Create tax audit logging | Low | 20 min |
| 34 | Write tax calculation unit tests | High | 30 min |

---

## Execution Order

```
Task 19: Review TaxClass model
    │
    ▼
Tasks 20-23: TaxCalculator Service
    │ (calculate_tax, apply_tax, remove_tax,
    │  inclusive/exclusive conversions, compound)
    ▼
Tasks 24-28: Price Methods & SVAT
    │ (with_tax, without_tax, exemptions, rounding, SVAT)
    ▼
Tasks 29-34: Advanced Services & Testing
    │ (breakdown, caching, PriceCalculationService,
    │  variant pricing, audit, tests)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── services/
│   ├── __init__.py (NEW)
│   ├── tax_calculator.py (NEW)
│   └── price_calculation.py (NEW)
├── utils.py (updated - rounding)
└── tests/
    └── test_tax_calculation.py (NEW)
```

---

## Notes for AI Agents

1. **Tax Calculation Formula:**
   - Inclusive: base = stored_price / (1 + rate)
   - Exclusive: total = stored_price * (1 + rate)
2. **Sri Lanka Tax Rates:**
   - VAT: 12% (standard)
   - SVAT: 0% (B2B)
   - Zero-rated: exports, essentials
3. **SVAT Handling:** Check customer SVAT registration
4. **Compound Tax:** VAT + NBT applied sequentially
5. **Rounding:** Round to nearest 0.01 (2 decimal places)
6. **Tax Breakdown:** {base_price, tax_amount, tax_rate, total_price}
7. **Caching Key:** f"tax:{product_id}:{tax_class_id}"
8. **Audit Log:** product_id, tax_class, calculation, timestamp
9. **PriceCalculationService:** Unified entry point for all pricing
10. **Next Group:** Tiered & Volume Pricing (Group C)
