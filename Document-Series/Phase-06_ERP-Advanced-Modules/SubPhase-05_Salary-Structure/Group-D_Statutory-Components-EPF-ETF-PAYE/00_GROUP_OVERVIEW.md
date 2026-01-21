# Group D: Statutory Components (EPF/ETF/PAYE)

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Configure Sri Lanka statutory components - EPF, ETF, and PAYE tax

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Employee Salary Assignment](../Group-C_Employee-Salary-Assignment/)
- **→ Next Group:** [Group E: Services & Calculations](../Group-E_Services-Calculations/)

---

## Group Overview

### Key Outcomes

1. **EPFSettings Model** - EPF rate configuration
2. **EPF Rate Fields** - employee_rate (8%), employer_rate (12%)
3. **EPF Ceiling Field** - max_contribution ceiling
4. **EPFSettings Migrations** - Apply migrations
5. **ETFSettings Model** - ETF rate configuration
6. **ETF Rate Field** - employer_rate (3%)
7. **ETFSettings Migrations** - Apply migrations
8. **PAYETaxSlab Model** - Tax slabs for PAYE
9. **Tax Slab Fields** - from_amount, to_amount, rate
10. **Tax Year Field** - tax_year for annual slabs
11. **PAYETaxSlab Migrations** - Apply migrations
12. **Current Tax Slabs Seed** - Sri Lanka PAYE slabs
13. **TaxExemption Model** - Tax exemptions
14. **Exemption Fields** - name, annual_amount, monthly_amount
15. **TaxExemption Migrations** - Apply migrations
16. **Default Exemptions Seed** - Personal relief, etc.

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Settings, tax slab models |
| Decimal | Precise tax calculations |
| Tenant Settings | Per-tenant rates |
| Management Command | Seed tax slabs |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-49-55_EPF-ETF-Settings.md` | 49-55 | EPFSettings, ETFSettings models |
| 02 | `02_Tasks-56-64_PAYE-TaxSlab-Exemption.md` | 56-64 | PAYETaxSlab, TaxExemption, seed data |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create EPFSettings Model | Medium | 25 min |
| 50 | Add EPF Rate Fields | Low | 15 min |
| 51 | Add EPF Ceiling Field | Low | 15 min |
| 52 | Run EPFSettings Migrations | Low | 15 min |
| 53 | Create ETFSettings Model | Medium | 20 min |
| 54 | Add ETF Rate Field | Low | 15 min |
| 55 | Run ETFSettings Migrations | Low | 15 min |
| 56 | Create PAYETaxSlab Model | Medium | 25 min |
| 57 | Add Tax Slab Fields | Medium | 20 min |
| 58 | Add Tax Year Field | Low | 15 min |
| 59 | Run PAYETaxSlab Migrations | Low | 15 min |
| 60 | Create Current Tax Slabs Seed | Medium | 25 min |
| 61 | Create TaxExemption Model | Medium | 20 min |
| 62 | Add Exemption Fields | Low | 15 min |
| 63 | Run TaxExemption Migrations | Low | 15 min |
| 64 | Create Default Exemptions Seed | Medium | 20 min |

---

## Execution Order

```
[Tasks 49-55: EPF, ETF settings]
         │
         ▼
[Tasks 56-64: PAYE slabs, exemptions, seed]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   ├── epf_settings.py           # Tasks 49-51
│   ├── etf_settings.py           # Tasks 53-54
│   ├── paye_slab.py              # Tasks 56-58
│   └── tax_exemption.py          # Tasks 61-62
├── management/
│   └── commands/
│       └── seed_tax_slabs.py     # Tasks 60, 64
└── migrations/
    ├── 0008_epf_settings.py      # Task 52
    ├── 0009_etf_settings.py      # Task 55
    ├── 0010_paye_slab.py         # Task 59
    └── 0011_tax_exemption.py     # Task 63
```

---

## Notes for AI Agents

### EPFSettings Model Fields
- tenant: OneToOne to Client
- employee_rate: Decimal (default 8%)
- employer_rate: Decimal (default 12%)
- max_contribution_ceiling: Decimal (nullable)
- effective_from: DateField
- is_active: Boolean

### Sri Lanka EPF Rates
```
Employee Contribution: 8% of EPF-applicable earnings
Employer Contribution: 12% of EPF-applicable earnings
Total EPF: 20% of EPF-applicable earnings

EPF-Applicable Earnings:
✅ Basic Salary
✅ Fixed Allowances
✅ Overtime
❌ Bonuses (typically)
❌ Reimbursements
```

### ETFSettings Model Fields
- tenant: OneToOne to Client
- employer_rate: Decimal (default 3%)
- effective_from: DateField
- is_active: Boolean

### Sri Lanka ETF Rate
```
Employer Contribution: 3% of EPF-applicable earnings
(Same base as EPF)
```

### PAYETaxSlab Model Fields
- tenant: FK to Client
- tax_year: Integer (e.g., 2024)
- from_amount: Decimal (annual)
- to_amount: Decimal (annual, nullable for top slab)
- rate: Decimal (percentage)
- order: Integer
- effective_from: DateField
- effective_to: DateField (nullable)
- is_active: Boolean

### Sri Lanka PAYE Tax Slabs (2024)
| Annual Income | Tax Rate |
|---------------|----------|
| 0 - 1,200,000 | 0% |
| 1,200,001 - 1,700,000 | 6% |
| 1,700,001 - 2,200,000 | 12% |
| 2,200,001 - 2,700,000 | 18% |
| 2,700,001 - 3,200,000 | 24% |
| 3,200,001 - 3,700,000 | 30% |
| Over 3,700,000 | 36% |

### Monthly PAYE Calculation
```
Monthly Taxable = Annual Taxable / 12
Apply progressive slabs monthly

Example (Annual Taxable: 2,400,000):
0 - 1,200,000 @ 0% = 0
1,200,001 - 1,700,000 @ 6% = 30,000
1,700,001 - 2,200,000 @ 12% = 60,000
2,200,001 - 2,400,000 @ 18% = 36,000
─────────────────────────────────
Annual Tax: 126,000
Monthly Tax: 10,500
```

### TaxExemption Model Fields
- tenant: FK to Client
- name: CharField (e.g., "Personal Relief")
- code: CharField (unique)
- exemption_type: Choice (PERSONAL, CHILD, SPOUSE, OTHER)
- annual_amount: Decimal
- monthly_amount: Decimal (calculated)
- tax_year: Integer
- max_claims: Integer (nullable)
- is_active: Boolean

### Default Tax Exemptions
| Name | Code | Annual Amount |
|------|------|---------------|
| Personal Relief | PERSONAL | 1,200,000 |
| Spouse Relief | SPOUSE | 500,000 |
| Child Relief (per child) | CHILD | 300,000 |
| Disabled Child Relief | DISABLED_CHILD | 500,000 |

### Taxable Income Calculation
```
Gross Taxable Earnings:
├── Basic Salary
├── Taxable Allowances
├── Overtime
└── Bonus
─────────────────────────
Gross Taxable: 2,400,000

Less Exemptions:
├── Personal Relief: 1,200,000
├── Spouse Relief: 500,000
└── EPF Employee: 192,000 (8% of 2,400,000)
─────────────────────────
Taxable Income: 508,000
```

### Rate Change Handling
```
When rates change:
1. Create new settings with new effective_from
2. Keep old settings for historical calculations
3. Payroll uses settings valid for payroll period
```

### Tax Year Versioning
```
Tax slabs versioned by year:
- 2023: Old rates
- 2024: Current rates
- 2025: Future rates (when announced)

Query: Get slabs for tax year
PAYETaxSlab.objects.filter(
    tax_year=2024,
    is_active=True
).order_by('order')
```
