# Group B: PDF Template Design

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Create line item models and PDF template configuration

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Payslip Data Models](../Group-A_Payslip-Data-Models/)
- **→ Next Group:** [Group C: PDF Generation Engine](../Group-C_PDF-Generation-Engine/)

---

## Group Overview

### Key Outcomes

1. **PayslipEarning Model** - Store earning line items
2. **Earning Component Name** - component_name, component_code
3. **Earning Amount Fields** - amount, ytd_amount
4. **Earning Sort Order** - display_order
5. **PayslipDeduction Model** - Store deduction line items
6. **Deduction Component Name** - component_name, component_code
7. **Deduction Amount Fields** - amount, ytd_amount
8. **Deduction Sort Order** - display_order
9. **PayslipEmployerContribution** - Store employer contributions
10. **Employer Contribution Fields** - component_name, amount, ytd_amount
11. **Line Item Migrations** - Apply migrations
12. **PayslipTemplate Model** - Tenant-configurable template
13. **Template Company Details** - company_name, logo, address
14. **Template Footer Fields** - footer_text, disclaimer_text
15. **Template Style Fields** - primary_color, show_employer_contrib
16. **Template Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Line item, template models |
| FileField | Company logo |
| JSONField | Address storage |
| Decimal | Financial precision |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-27_Line-Item-Models.md` | 17-27 | Earnings, deductions, contributions |
| 02 | `02_Tasks-28-32_Template-Model.md` | 28-32 | PayslipTemplate configuration |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create PayslipEarning Model | Medium | 25 min |
| 18 | Add Earning Component Name | Low | 15 min |
| 19 | Add Earning Amount Fields | Low | 15 min |
| 20 | Add Earning Sort Order | Low | 10 min |
| 21 | Create PayslipDeduction Model | Medium | 20 min |
| 22 | Add Deduction Component Name | Low | 15 min |
| 23 | Add Deduction Amount Fields | Low | 15 min |
| 24 | Add Deduction Sort Order | Low | 10 min |
| 25 | Create PayslipEmployerContribution | Medium | 20 min |
| 26 | Add Employer Contribution Fields | Low | 15 min |
| 27 | Run Line Item Migrations | Low | 15 min |
| 28 | Create PayslipTemplate Model | Medium | 25 min |
| 29 | Add Template Company Details | Medium | 20 min |
| 30 | Add Template Footer Fields | Low | 15 min |
| 31 | Add Template Style Fields | Low | 15 min |
| 32 | Run Template Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 17-27: Line item models, migrations]
         │
         ▼
[Tasks 28-32: PayslipTemplate, migrations]
```

---

## Expected Deliverables

```
apps/payslip/
├── models/
│   ├── payslip_line.py           # Tasks 17-26
│   └── payslip_template.py       # Tasks 28-31
└── migrations/
    ├── 0002_payslip_lines.py     # Task 27
    └── 0003_payslip_template.py  # Task 32
```

---

## Notes for AI Agents

### PayslipEarning Model Fields
- payslip: FK to Payslip
- component_code: CharField
- component_name: CharField
- amount: Decimal
- ytd_amount: Decimal
- display_order: Integer
- is_highlighted: Boolean

### PayslipDeduction Model Fields
- payslip: FK to Payslip
- component_code: CharField
- component_name: CharField
- amount: Decimal
- ytd_amount: Decimal
- display_order: Integer
- is_highlighted: Boolean

### PayslipEmployerContribution Model Fields
- payslip: FK to Payslip
- component_code: CharField
- component_name: CharField
- amount: Decimal
- ytd_amount: Decimal
- display_order: Integer

### YTD Calculation
```
Year-to-Date calculation:
1. Get fiscal year start date
2. Query all prior payslips for employee
3. Sum component amounts
4. Add current period amount

Example:
April 2026 Transport Allowance:
- Jan: 15,000
- Feb: 15,000
- Mar: 15,000
- Apr: 15,000
YTD: 60,000
```

### Line Item Examples
```
Earnings:
├── Basic Salary: 150,000
├── Transport Allowance: 15,000
├── Medical Allowance: 10,000
└── Overtime: 18,750
Total Earnings: 193,750

Deductions:
├── EPF Employee (8%): 12,000
├── PAYE Tax: 5,500
└── Loan Repayment: 5,000
Total Deductions: 22,500

Employer Contributions:
├── EPF Employer (12%): 18,000
└── ETF (3%): 4,500
Total Employer: 22,500
```

### PayslipTemplate Model Fields
- tenant: OneToOne to Client
- company_name: CharField
- company_logo: ImageField (nullable)
- company_address: TextField
- company_phone: CharField
- company_email: EmailField
- epf_number: CharField
- etf_number: CharField
- footer_text: TextField
- disclaimer_text: TextField
- primary_color: CharField (#HEX)
- secondary_color: CharField (#HEX)
- show_employer_contributions: Boolean
- show_ytd: Boolean
- show_bank_details: Boolean
- paper_size: Choice (A4, LETTER)
- created_at: DateTimeField
- updated_at: DateTimeField

### Company Address Format
```
Lanka Commerce Pvt Ltd
123, Galle Road
Colombo 03
Sri Lanka
Tel: +94 11 234 5678
```

### Footer Text Example
```
This is a computer-generated payslip and does not require a signature.
For any queries, please contact HR at hr@lankacommerce.lk
```

### Disclaimer Text Example
```
This payslip is confidential and intended solely for the named employee.
EPF/ETF contributions are remitted to the respective funds as per
Sri Lanka labor law requirements.
```

### Show Employer Contributions
```
If show_employer_contributions = True:
Display section showing:
- EPF Employer Contribution
- ETF Contribution
- Total Cost to Company

Some companies prefer to hide this from employees.
```

### Display Order
```
Payslip sections:
1. Header (company logo, name)
2. Employee Details
3. Pay Period Info
4. Earnings Table
5. Deductions Table
6. Summary (Gross, Net)
7. YTD Section (optional)
8. Employer Contributions (optional)
9. Footer/Disclaimer
```
