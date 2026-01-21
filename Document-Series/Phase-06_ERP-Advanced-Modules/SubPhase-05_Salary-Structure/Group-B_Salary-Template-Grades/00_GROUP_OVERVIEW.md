# Group B: Salary Template & Grades

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Create salary templates, template components, and salary grades

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Salary Component Models](../Group-A_Salary-Component-Models/)
- **→ Next Group:** [Group C: Employee Salary Assignment](../Group-C_Employee-Salary-Assignment/)

---

## Group Overview

### Key Outcomes

1. **SalaryTemplate Model** - Template for grouping components
2. **Template Core Fields** - name, code, description
3. **Template Designation Link** - Optional designation FK
4. **Template Status Field** - is_active boolean
5. **SalaryTemplate Migrations** - Apply migrations
6. **TemplateComponent Model** - Link components to template
7. **Template Component Fields** - template FK, component FK
8. **Default Value Field** - default_value for template
9. **Override Fields** - can_override, min_value, max_value
10. **TemplateComponent Migrations** - Apply migrations
11. **SalaryGrade Model** - Grade/band with salary ranges
12. **Grade Core Fields** - name, code, level
13. **Grade Salary Range** - min_salary, max_salary
14. **Grade Template Link** - template FK
15. **SalaryGrade Migrations** - Apply migrations
16. **Default Grades Seed** - Sample salary grades

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Template, Grade models |
| ForeignKey | Component, designation links |
| Decimal | Salary ranges |
| Management Command | Seed grades |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-28_Template-TemplateComponent.md` | 19-28 | SalaryTemplate, TemplateComponent models |
| 02 | `02_Tasks-29-34_SalaryGrade-Seed.md` | 29-34 | SalaryGrade model, seed data |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create SalaryTemplate Model | Medium | 25 min |
| 20 | Add Template Core Fields | Low | 15 min |
| 21 | Add Template Designation Link | Medium | 20 min |
| 22 | Add Template Status Field | Low | 10 min |
| 23 | Run SalaryTemplate Migrations | Low | 15 min |
| 24 | Create TemplateComponent Model | Medium | 25 min |
| 25 | Add Template Component Fields | Low | 15 min |
| 26 | Add Default Value Field | Low | 15 min |
| 27 | Add Override Fields | Medium | 20 min |
| 28 | Run TemplateComponent Migrations | Low | 15 min |
| 29 | Create SalaryGrade Model | Medium | 25 min |
| 30 | Add Grade Core Fields | Low | 15 min |
| 31 | Add Grade Salary Range | Medium | 20 min |
| 32 | Add Grade Template Link | Low | 15 min |
| 33 | Run SalaryGrade Migrations | Low | 15 min |
| 34 | Create Default Grades Seed | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-28: SalaryTemplate, TemplateComponent]
         │
         ▼
[Tasks 29-34: SalaryGrade, seed data]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   ├── salary_template.py        # Tasks 19-22
│   ├── template_component.py     # Tasks 24-27
│   └── salary_grade.py           # Tasks 29-32
├── management/
│   └── commands/
│       └── seed_grades.py        # Task 34
└── migrations/
    ├── 0002_salary_template.py   # Task 23
    ├── 0003_template_component.py # Task 28
    └── 0004_salary_grade.py      # Task 33
```

---

## Notes for AI Agents

### SalaryTemplate Model Fields
- name: CharField (e.g., "Senior Developer Package")
- code: CharField (unique, e.g., "TMPL-SD")
- description: TextField
- designation: FK to Designation (nullable)
- is_active: Boolean
- created_at: DateTimeField
- updated_at: DateTimeField

### Template Purpose
```
Templates group salary components together:
- Standard packages for designations
- Reusable salary structures
- Quick assignment to employees
```

### TemplateComponent Model Fields
- template: FK to SalaryTemplate
- component: FK to SalaryComponent
- default_value: Decimal (override component default)
- can_override: Boolean (allow employee-level changes)
- min_value: Decimal (validation minimum)
- max_value: Decimal (validation maximum)
- is_mandatory: Boolean
- display_order: Integer (override for template)

### Template Component Example
```
Template: Senior Developer Package

Components:
├── Basic Salary (default: 150,000, min: 120,000, max: 200,000)
├── Transport Allowance (default: 15,000, can_override: True)
├── Medical Allowance (default: 10,000, can_override: False)
├── EPF Employee (8%, mandatory: True)
└── PAYE Tax (formula, mandatory: True)
```

### SalaryGrade Model Fields
- name: CharField (e.g., "Grade 5 - Senior")
- code: CharField (unique, e.g., "G5")
- level: Integer (1-10)
- min_salary: Decimal
- max_salary: Decimal
- template: FK to SalaryTemplate (nullable)
- description: TextField
- is_active: Boolean

### Salary Grade Purpose
```
Grades define salary bands:
- Salary range validation
- Standardized pay scales
- Linked to designations
```

### Default Grades Seed
| Grade | Code | Level | Min Salary | Max Salary |
|-------|------|-------|------------|------------|
| Entry Level | G1 | 1 | 35,000 | 50,000 |
| Junior | G2 | 2 | 50,000 | 75,000 |
| Associate | G3 | 3 | 75,000 | 100,000 |
| Mid-Level | G4 | 4 | 100,000 | 130,000 |
| Senior | G5 | 5 | 130,000 | 180,000 |
| Lead | G6 | 6 | 180,000 | 250,000 |
| Manager | G7 | 7 | 250,000 | 350,000 |
| Director | G8 | 8 | 350,000 | 500,000 |
| Executive | G9 | 9 | 500,000 | 750,000 |
| C-Level | G10 | 10 | 750,000+ | - |

### Grade-Template Relationship
```
Grade G5 (Senior)
└── Template: Senior Developer Package
    ├── Basic Salary (range: 130K - 180K)
    ├── Transport Allowance
    ├── Medical Allowance
    └── Statutory deductions
```

### Override Rules
```
can_override = True:
- HR can change value per employee
- Must be within min/max range
- Tracked in employee salary

can_override = False:
- Fixed value from template
- Cannot be changed per employee
- E.g., statutory percentages
```

### Unique Constraints
```
SalaryTemplate: code unique per tenant
TemplateComponent: (template, component) unique
SalaryGrade: code unique per tenant
```
