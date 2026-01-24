# Tasks 29-34: SalaryGrade Model and Seed Data

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** B - Salary Template & Grades  
> **Document:** 02 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-28_Template-TemplateComponent.md](01_Tasks-19-28_Template-TemplateComponent.md)
- **→ Next Group:** [Group C: Employee Salary Assignment](../Group-C_Employee-Salary-Assignment/)

---

## Document Overview

This document covers the implementation of the SalaryGrade model that defines salary bands and ranges within the organization. Salary grades establish standardized pay scales, provide salary range validation, and can be linked to salary templates for consistent compensation structures. The document also includes creation of a management command to seed default salary grades.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Create SalaryGrade Model | Medium | 25 min |
| 30 | Add Grade Core Fields | Low | 15 min |
| 31 | Add Grade Salary Range | Medium | 20 min |
| 32 | Add Grade Template Link | Low | 15 min |
| 33 | Run SalaryGrade Migrations | Low | 15 min |
| 34 | Create Default Grades Seed | Medium | 25 min |

---

## Task 29: Create SalaryGrade Model

### Overview
Create the SalaryGrade model that represents salary bands or levels within the organization. Salary grades define standardized salary ranges for different levels of positions, helping maintain internal equity and providing a framework for salary progression.

### Dependencies
- Payroll application (`apps/payroll/`) exists
- SalaryTemplate model implemented (from Task 19-23)
- Django ORM configured
- Tenant-aware mixins available

### Instructions

1. **Create salary_grade.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `salary_grade.py`
   - Import necessary Django model components

2. **Import required modules**
   - Import Django model fields (CharField, IntegerField, DecimalField, etc.)
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import models module from Django

3. **Define SalaryGrade model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring explaining grade purpose
   - Document the grade's role in salary structure

4. **Add model docstring**
   - Explain salary grade concept and purpose
   - Describe how grades create salary bands
   - Note usage scenarios (pay scales, progression paths)
   - Mention standardization and equity benefits

5. **Prepare for core fields**
   - Plan field structure for grade identification
   - Consider tenant isolation requirements
   - Prepare for template association
   - Plan for active/inactive status management

6. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Prepare to import SalaryGrade
   - Add to __all__ list for proper module exports

### SalaryGrade Model Purpose

```
Salary Grade Concept
════════════════════

SalaryGrade defines hierarchical salary bands that establish
standardized compensation ranges across the organization.

Purpose:
┌─────────────────────────────────────────────────────────┐
│  1. Establish salary ranges for different levels        │
│  2. Ensure internal pay equity                          │
│  3. Provide framework for salary progression            │
│  4. Standardize compensation across similar roles       │
│  5. Support salary benchmarking and budgeting           │
└─────────────────────────────────────────────────────────┘
```

### Grade Structure Overview

```
┌───────────────────────────────────────────────────────┐
│              SalaryGrade Model                        │
├───────────────────────────────────────────────────────┤
│ Core Fields (added in subsequent tasks):             │
│  • name - Grade identifier                           │
│  • code - Unique grade code                          │
│  • level - Hierarchical level (1-10)                 │
│  • min_salary - Range minimum                        │
│  • max_salary - Range maximum                        │
│  • template - Optional FK to SalaryTemplate          │
│  • description - Grade details                       │
│  • is_active - Availability status                   │
│                                                       │
│ Inherited from TenantAwareMixin:                     │
│  • tenant - ForeignKey to Tenant                     │
│                                                       │
│ Inherited from TimestampMixin:                       │
│  • created_at - Creation timestamp                   │
│  • updated_at - Last update timestamp                │
└───────────────────────────────────────────────────────┘
```

### Salary Grade Hierarchy

```
Organization Grade Structure
════════════════════════════

Level 10: C-Level
├── Range: 750,000 - 1,500,000+
└── Roles: CEO, CFO, COO

Level 9: Executive
├── Range: 500,000 - 750,000
└── Roles: VP, Executive Director

Level 8: Director
├── Range: 350,000 - 500,000
└── Roles: Director, Senior Director

Level 7: Manager
├── Range: 250,000 - 350,000
└── Roles: Department Manager, Senior Manager

Level 6: Lead
├── Range: 180,000 - 250,000
└── Roles: Team Lead, Project Lead

Level 5: Senior
├── Range: 130,000 - 180,000
└── Roles: Senior Engineer, Senior Analyst

Level 4: Mid-Level
├── Range: 100,000 - 130,000
└── Roles: Engineer, Analyst

Level 3: Associate
├── Range: 75,000 - 100,000
└── Roles: Associate, Junior+

Level 2: Junior
├── Range: 50,000 - 75,000
└── Roles: Junior Engineer, Junior Analyst

Level 1: Entry Level
├── Range: 35,000 - 50,000
└── Roles: Trainee, Intern
```

### Grade Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| Standardization | Consistent pay ranges across roles | Reduces pay inequity |
| Transparency | Clear career progression path | Improves employee morale |
| Budgeting | Predictable salary structures | Better financial planning |
| Benchmarking | Comparison with market rates | Competitive positioning |
| Compliance | Documented salary policies | Audit trail support |

### Grade Usage Scenarios

#### Scenario 1: Position-Based Grades
```
Grade G5 (Senior Level)
├── Senior Software Engineer
├── Senior Business Analyst
├── Senior Accountant
└── Senior HR Officer

All positions in this grade:
└── Salary range: 130,000 - 180,000
    └── Actual salary depends on:
        ├── Experience level
        ├── Performance
        ├── Market conditions
        └── Negotiation
```

#### Scenario 2: Grade Progression
```
Employee Career Path:

Year 0: Entry Level (G1)
└── Starting salary: 40,000

Year 2: Junior (G2)
└── Promoted to: 60,000

Year 4: Associate (G3)
└── Promoted to: 85,000

Year 7: Mid-Level (G4)
└── Promoted to: 115,000

Year 10: Senior (G5)
└── Promoted to: 155,000
```

#### Scenario 3: Grade-Template Linkage
```
Grade G5 (Senior)
└── Linked to: "Senior Staff Package" template
    ├── Basic Salary (range: 130K-180K)
    ├── Transport Allowance: 15,000
    ├── Professional Development: 10,000
    └── Standard deductions

When employee promoted to G5:
└── Template auto-applied with G5 salary range
```

### Grade vs Designation

```
Distinction Clarification
═════════════════════════

Grade (SalaryGrade):
├── Defines salary range/band
├── Hierarchical level (1-10)
├── Compensation-focused
├── Multiple designations per grade
└── Example: "Grade 5 - Senior Level"

Designation (HR Model):
├── Defines job role/position
├── Functional title
├── Responsibility-focused
├── Can belong to a grade
└── Example: "Senior Software Engineer"

Relationship:
Designation → Grade → Salary Range
```

### Expected Outcome
- SalaryGrade model class created
- File structure properly organized
- Model inherits required mixins
- Foundation ready for field additions
- Documentation clearly explains grade concept

### Verification Checklist
- [ ] salary_grade.py file created in apps/payroll/models/
- [ ] Required Django modules imported
- [ ] Base mixins imported (TenantAwareMixin, TimestampMixin)
- [ ] SalaryGrade class defined with inheritance
- [ ] Comprehensive model docstring added
- [ ] File ready for field additions in next tasks

---

## Task 30: Add Grade Core Fields

### Overview
Add the essential identifying and descriptive fields to the SalaryGrade model. These core fields enable grade identification, hierarchical positioning, and provide human-readable information for grade management within the system.

### Dependencies
- Task 29: Create SalaryGrade Model

### Instructions

1. **Open salary_grade.py model file**
   - Navigate to `apps/payroll/models/salary_grade.py`
   - Locate the SalaryGrade model class

2. **Add name field**
   - CharField with max_length=100
   - Required field (blank=False, null=False)
   - Human-readable grade identifier
   - Examples: "Grade 5 - Senior", "Executive Level", "Entry Level"

3. **Add code field**
   - CharField with max_length=20
   - Required and unique per tenant
   - Short alphanumeric identifier
   - Format: "G1", "G2", "G3", etc.
   - Add uppercase conversion validation

4. **Add level field**
   - IntegerField
   - Required field
   - Represents hierarchical position (1-10 typical)
   - Lower numbers = lower level, higher numbers = higher level
   - Used for sorting and comparison

5. **Add description field**
   - TextField
   - Optional (blank=True, null=True)
   - Detailed explanation of grade purpose
   - Typical roles and requirements
   - Career progression information

6. **Add field-level help text**
   - Add help_text parameter to each field
   - Provide guidance for administrators
   - Explain field purpose and format

7. **Update model docstring**
   - Document all core fields
   - Explain field purposes and constraints
   - Include usage examples

### Core Fields Structure

```
┌─────────────────────────────────────────────────┐
│          SalaryGrade Core Fields                │
├─────────────────────────────────────────────────┤
│ name                                            │
│  • Type: CharField(100)                         │
│  • Required: Yes                                │
│  • Purpose: Display name                        │
│  • Example: "Grade 5 - Senior Level"            │
│                                                 │
│ code                                            │
│  • Type: CharField(20)                          │
│  • Required: Yes                                │
│  • Unique: Per tenant                           │
│  • Purpose: System identifier                   │
│  • Example: "G5"                                │
│                                                 │
│ level                                           │
│  • Type: IntegerField                           │
│  • Required: Yes                                │
│  • Purpose: Hierarchical position               │
│  • Example: 5                                   │
│                                                 │
│ description                                     │
│  • Type: TextField                              │
│  • Required: No                                 │
│  • Purpose: Detailed explanation                │
│  • Example: "For senior professionals..."       │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Max Length | Required | Unique | Purpose |
|-------|------|------------|----------|--------|---------|
| name | CharField | 100 | Yes | No | Display identifier |
| code | CharField | 20 | Yes | Per tenant | System code |
| level | IntegerField | - | Yes | No | Hierarchy position |
| description | TextField | Unlimited | No | No | Detailed explanation |

### Grade Naming Guidelines

#### Standard Format
```
"Grade [Number] - [Level Name]"

Examples:
├── "Grade 1 - Entry Level"
├── "Grade 2 - Junior"
├── "Grade 3 - Associate"
├── "Grade 4 - Mid-Level"
├── "Grade 5 - Senior"
├── "Grade 6 - Lead"
├── "Grade 7 - Manager"
├── "Grade 8 - Director"
├── "Grade 9 - Executive"
└── "Grade 10 - C-Level"
```

#### Alternative Formats
```
Descriptive Format:
├── "Entry Level Professional"
├── "Experienced Professional"
├── "Senior Professional"
└── "Executive Professional"

Abbreviated Format:
├── "G1 - Entry"
├── "G2 - Junior"
├── "G3 - Associate"
└── "G4 - Mid"

Government Format:
├── "Scale I"
├── "Scale II"
├── "Scale III"
└── "Executive Scale"
```

### Code Format Standards

#### Recommended Codes
```
Simple Numeric:
├── G1, G2, G3, G4, G5
├── G6, G7, G8, G9, G10
└── Clear progression

Letter-Based:
├── A, B, C, D, E
├── Less common in modern systems
└── May be confused with performance ratings

Descriptive:
├── ENTRY, JUNIOR, MID, SENIOR
├── More verbose but clearer
└── Harder to sort numerically
```

#### Code Characteristics
- Short and memorable (2-4 characters)
- Indicates hierarchy if possible (G1 < G2 < G3)
- Uppercase for consistency
- No spaces or special characters
- Keep under 20 characters maximum

### Level Field Usage

```
Level Hierarchy
═══════════════

level = 1  → Entry Level
level = 2  → Junior
level = 3  → Associate
level = 4  → Mid-Level
level = 5  → Senior
level = 6  → Lead
level = 7  → Manager
level = 8  → Director
level = 9  → Executive
level = 10 → C-Level

Sorting:
└── ORDER BY level ASC  → Shows from entry to executive
└── ORDER BY level DESC → Shows from executive to entry

Comparison:
└── employee.grade.level > 5  → Senior or above
└── employee.grade.level <= 3 → Associate or below
```

### Description Field Usage

#### Effective Descriptions

**Example 1: Entry Level (G1)**
```
Entry-level positions for fresh graduates or individuals with
minimal professional experience. Positions at this grade require
supervision and on-the-job training.

Typical roles:
- Trainee positions
- Graduate trainees
- Entry-level assistants
- Interns transitioning to full-time

Progression:
- Expected time in grade: 1-2 years
- Next grade: G2 (Junior) with proven performance
```

**Example 2: Senior Level (G5)**
```
Senior professional positions requiring extensive experience and
specialized expertise. Professionals at this level work independently
and may mentor junior staff.

Typical roles:
- Senior Software Engineer
- Senior Business Analyst
- Senior Accountant
- Senior HR Officer

Requirements:
- 7+ years relevant experience
- Proven expertise in domain
- Mentoring capability

Progression:
- Expected time in grade: 3-5 years
- Next grade: G6 (Lead) with leadership demonstrated
```

**Example 3: Executive Level (G9)**
```
Executive management positions with strategic responsibility and
significant decision-making authority. Reports directly to C-level.

Typical roles:
- Vice President
- Executive Director
- General Manager

Requirements:
- 15+ years experience
- Proven executive leadership
- Strategic planning capability
- P&L responsibility

Progression:
- Terminal grade for most careers
- Possible promotion to C-Level (G10) based on performance
```

### Grade Examples by Organization Size

#### Small Organization (< 50 employees)
```
G1: Entry Level (35K - 50K)
G2: Experienced (50K - 75K)
G3: Senior (75K - 120K)
G4: Management (120K - 200K)
G5: Executive (200K+)
```

#### Medium Organization (50-500 employees)
```
G1: Entry Level (35K - 50K)
G2: Junior (50K - 75K)
G3: Associate (75K - 100K)
G4: Mid-Level (100K - 130K)
G5: Senior (130K - 180K)
G6: Lead (180K - 250K)
G7: Manager (250K - 350K)
G8: Director (350K+)
```

#### Large Organization (500+ employees)
```
G1: Entry Level (35K - 50K)
G2: Junior (50K - 75K)
G3: Associate (75K - 100K)
G4: Mid-Level (100K - 130K)
G5: Senior (130K - 180K)
G6: Lead (180K - 250K)
G7: Manager (250K - 350K)
G8: Director (350K - 500K)
G9: Executive (500K - 750K)
G10: C-Level (750K+)
```

### Sri Lanka Context

#### Corporate Sector Grades
```
G1: Executive Trainee
└── Range: 40,000 - 55,000
    └── Fresh graduates, training period

G2: Executive
└── Range: 55,000 - 80,000
    └── 1-3 years experience

G3: Senior Executive
└── Range: 80,000 - 120,000
    └── 3-5 years experience

G4: Assistant Manager
└── Range: 120,000 - 180,000
    └── 5-8 years experience

G5: Manager
└── Range: 180,000 - 280,000
    └── 8-12 years experience

G6: Senior Manager
└── Range: 280,000 - 450,000
    └── 12-15 years experience

G7: Director
└── Range: 450,000 - 700,000
    └── 15+ years experience
```

#### Government Sector Grades
```
G1: Grade III
└── Range: 35,000 - 50,000

G2: Grade II
└── Range: 50,000 - 70,000

G3: Grade I
└── Range: 70,000 - 100,000

G4: Senior Grade I
└── Range: 100,000 - 150,000

G5: Special Grade
└── Range: 150,000 - 250,000
```

### Expected Outcome
- Name field for grade identification
- Code field for system reference
- Level field for hierarchical positioning
- Description field for documentation
- Proper field constraints and validation
- Help text for administrator guidance

### Verification Checklist
- [ ] name field added with max_length=100
- [ ] name field is required (blank=False)
- [ ] code field added with max_length=20
- [ ] code field is required and unique per tenant
- [ ] code field has uppercase validation
- [ ] level field added as IntegerField
- [ ] level field is required
- [ ] description field added as TextField
- [ ] description field is optional (blank=True, null=True)
- [ ] All fields have help_text
- [ ] Model docstring updated with field documentation

---

## Task 31: Add Grade Salary Range

### Overview
Add the salary range fields (min_salary and max_salary) to the SalaryGrade model. These fields define the minimum and maximum salary boundaries for the grade, providing validation ranges for salary assignments and ensuring consistency in compensation across the organization.

### Dependencies
- Task 30: Add Grade Core Fields

### Instructions

1. **Open salary_grade.py model file**
   - Continue in `apps/payroll/models/salary_grade.py`
   - Locate the SalaryGrade model class

2. **Add min_salary field**
   - DecimalField with max_digits=12, decimal_places=2
   - Required field (blank=False, null=False)
   - Defines minimum salary for this grade
   - Used for validation and budgeting

3. **Add max_salary field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional (blank=True, null=True)
   - Defines maximum salary for this grade
   - Null means no upper limit (e.g., C-level grades)

4. **Add field help texts**
   - min_salary: Explain minimum salary boundary
   - max_salary: Explain maximum and note null for unlimited
   - Note currency implications

5. **Add validation method**
   - Implement clean() method
   - Validate min_salary <= max_salary when max_salary is set
   - Ensure min_salary is positive
   - Check for logical consistency

6. **Add calculated properties (optional)**
   - midpoint property: Calculate midpoint of range
   - range_width property: Calculate range span
   - Useful for analysis and reporting

7. **Update model docstring**
   - Document salary range fields
   - Explain validation logic
   - Provide range calculation examples

### Salary Range Fields

```
┌─────────────────────────────────────────────────┐
│         Salary Range Fields                     │
├─────────────────────────────────────────────────┤
│ min_salary                                      │
│  • Type: DecimalField(12, 2)                    │
│  • Required: Yes                                │
│  • Purpose: Grade minimum salary                │
│  • Example: 130,000.00                          │
│                                                 │
│ max_salary                                      │
│  • Type: DecimalField(12, 2)                    │
│  • Required: No (null for unlimited)            │
│  • Purpose: Grade maximum salary                │
│  • Example: 180,000.00 or null                  │
└─────────────────────────────────────────────────┘
```

### Salary Range Purpose

```
Range Validation and Control
════════════════════════════

Purpose:
├── Define acceptable salary boundaries
├── Ensure internal equity
├── Support budgeting and forecasting
├── Validate salary assignments
└── Guide salary negotiations

Validation Flow:
Employee salary assignment
└── Check: employee.salary >= grade.min_salary
└── Check: employee.salary <= grade.max_salary (if set)
    ├── If valid → Allow assignment
    └── If invalid → Reject with error message
```

### Range Configuration Patterns

#### Pattern 1: Fixed Range (Most Common)
```
Grade G5 (Senior)
├── min_salary: 130,000.00
├── max_salary: 180,000.00
└── Range: 50,000 (38% of minimum)

Behavior:
└── All G5 employees must have salary between 130K-180K
```

#### Pattern 2: Open-Ended Range (Executive Levels)
```
Grade G10 (C-Level)
├── min_salary: 750,000.00
├── max_salary: null (unlimited)
└── Range: Unlimited above minimum

Behavior:
└── CEO salary must be >= 750K, no upper limit
```

#### Pattern 3: Narrow Range (Standardized Positions)
```
Grade G1 (Entry Level)
├── min_salary: 35,000.00
├── max_salary: 50,000.00
└── Range: 15,000 (43% of minimum)

Behavior:
└── Limited negotiation room for entry positions
```

#### Pattern 4: Wide Range (Flexible Positions)
```
Grade G7 (Manager)
├── min_salary: 250,000.00
├── max_salary: 450,000.00
└── Range: 200,000 (80% of minimum)

Behavior:
└── Significant room for experience-based differentiation
```

### Range Width Analysis

```
Range Width Calculation
═══════════════════════

Formula:
range_width = max_salary - min_salary
range_percentage = (range_width / min_salary) * 100

Examples:

Grade G1:
├── min: 35,000 | max: 50,000
├── width: 15,000
└── percentage: 43%

Grade G5:
├── min: 130,000 | max: 180,000
├── width: 50,000
└── percentage: 38%

Grade G7:
├── min: 250,000 | max: 450,000
├── width: 200,000
└── percentage: 80%

Grade G10:
├── min: 750,000 | max: null
├── width: unlimited
└── percentage: N/A
```

### Typical Range Widths by Level

| Level | Grade Type | Typical Range Width | Reason |
|-------|-----------|---------------------|--------|
| 1-3 | Entry/Junior | 30-40% | Limited differentiation needed |
| 4-6 | Mid/Senior | 35-50% | Experience variation |
| 7-8 | Management | 40-60% | Responsibility variation |
| 9-10 | Executive | 50%+ or unlimited | Strategic value variation |

### Midpoint Calculation

```
Range Midpoint
══════════════

Formula:
midpoint = (min_salary + max_salary) / 2

Purpose:
├── Target salary for competent performer
├── Benchmark for market comparisons
├── Reference for salary increases
└── Budget planning baseline

Example - Grade G5:
├── min_salary: 130,000
├── max_salary: 180,000
├── midpoint: 155,000
└── Interpretation:
    ├── Below midpoint: Room for growth
    ├── At midpoint: Fully competent
    └── Above midpoint: High performer or long tenure
```

### Salary Positioning Within Range

```
Range Position Analysis
═══════════════════════

Formula:
position = (employee_salary - min_salary) / (max_salary - min_salary)
position_percent = position * 100

Example - Grade G5 (130K - 180K):

Employee A: 135,000
├── position: (135K - 130K) / (180K - 130K) = 0.10
└── 10% into range (near minimum)

Employee B: 155,000
├── position: (155K - 130K) / (180K - 130K) = 0.50
└── 50% into range (at midpoint)

Employee C: 175,000
├── position: (175K - 130K) / (180K - 130K) = 0.90
└── 90% into range (near maximum)
```

### Validation Logic

```
Range Validation Rules
══════════════════════

Rule 1: Minimum is Positive
└── min_salary must be > 0

Rule 2: Maximum >= Minimum
└── If max_salary is set:
    └── max_salary must be >= min_salary

Rule 3: Reasonable Range
└── Warn if max > min * 2 (100%+ range)
    └── Suggests range may be too wide

Rule 4: Hierarchy Consistency (optional)
└── Grade N+1 minimum should be >= Grade N maximum
    └── Prevents overlap confusion
```

### Validation Examples

#### Valid Configuration
```python
# Grade G5
min_salary = 130,000.00
max_salary = 180,000.00

# Validation passes:
# ✓ min_salary > 0
# ✓ max_salary >= min_salary
# ✓ Range is reasonable (38%)
```

#### Invalid Configuration 1
```python
# Grade G5
min_salary = 180,000.00
max_salary = 130,000.00  # ERROR!

# ValidationError:
# "Maximum salary cannot be less than minimum salary"
```

#### Invalid Configuration 2
```python
# Grade G5
min_salary = -50,000.00  # ERROR!
max_salary = 100,000.00

# ValidationError:
# "Minimum salary must be positive"
```

#### Valid Open-Ended
```python
# Grade G10 (C-Level)
min_salary = 750,000.00
max_salary = None  # Valid: unlimited

# Validation passes:
# ✓ min_salary > 0
# ✓ max_salary is null (allowed)
```

### Sri Lanka Salary Ranges

#### Private Sector IT Company
```
G1: Entry Level Developer
├── min: 40,000
└── max: 55,000

G2: Junior Developer
├── min: 55,000
└── max: 80,000

G3: Developer
├── min: 80,000
└── max: 120,000

G4: Senior Developer
├── min: 120,000
└── max: 180,000

G5: Lead Developer
├── min: 180,000
└── max: 280,000

G6: Engineering Manager
├── min: 280,000
└── max: 450,000

G7: Director of Engineering
├── min: 450,000
└── max: null (unlimited)
```

#### Retail Organization
```
G1: Cashier
├── min: 30,000
└── max: 40,000

G2: Senior Cashier
├── min: 40,000
└── max: 55,000

G3: Supervisor
├── min: 55,000
└── max: 75,000

G4: Assistant Manager
├── min: 75,000
└── max: 110,000

G5: Store Manager
├── min: 110,000
└── max: 180,000

G6: Regional Manager
├── min: 180,000
└── max: 300,000
```

### Range Adjustment Considerations

```
When to Adjust Ranges
═════════════════════

Market Conditions:
├── Market rates increased → Adjust ranges upward
├── Economic downturn → May freeze ranges
└── Competitor analysis → Benchmark adjustment

Internal Factors:
├── Company growth → Expand upper ranges
├── Budget constraints → Tighten ranges
├── Grade consolidation → Merge overlapping ranges
└── New positions → Create new grades

Annual Review:
├── Review ranges annually
├── Compare to market data
├── Adjust for inflation
└── Document changes
```

### Calculated Properties

```python
# Example calculated properties (for reference)

@property
def midpoint(self):
    """Calculate midpoint of salary range"""
    if self.max_salary:
        return (self.min_salary + self.max_salary) / 2
    return None

@property
def range_width(self):
    """Calculate width of salary range"""
    if self.max_salary:
        return self.max_salary - self.min_salary
    return None

@property
def range_percentage(self):
    """Calculate range as percentage of minimum"""
    if self.max_salary:
        return ((self.max_salary - self.min_salary) / 
                self.min_salary * 100)
    return None
```

### Expected Outcome
- min_salary field defines grade minimum
- max_salary field defines grade maximum (or null for unlimited)
- Validation ensures logical consistency
- Range supports salary administration
- Calculated properties provide analysis

### Verification Checklist
- [ ] min_salary DecimalField added
- [ ] min_salary max_digits=12, decimal_places=2
- [ ] min_salary is required (blank=False)
- [ ] max_salary DecimalField added
- [ ] max_salary is optional (blank=True, null=True)
- [ ] help_text explains each field
- [ ] clean() method validates min <= max
- [ ] clean() method ensures min > 0
- [ ] Calculated properties added (optional)
- [ ] Model docstring updated with range information

---

## Task 32: Add Grade Template Link

### Overview
Add an optional ForeignKey relationship linking SalaryGrade to SalaryTemplate model. This relationship associates predefined salary templates with grades, enabling automatic template application when employees are assigned to graded positions.

### Dependencies
- Task 31: Add Grade Salary Range
- SalaryTemplate model exists (from Tasks 19-23)

### Instructions

1. **Open salary_grade.py model file**
   - Continue in `apps/payroll/models/salary_grade.py`
   - Locate the SalaryGrade model class

2. **Import SalaryTemplate model**
   - Add import for SalaryTemplate
   - Use appropriate import path (from apps.payroll.models import SalaryTemplate)
   - Verify model is available

3. **Add template field**
   - ForeignKey to SalaryTemplate model
   - Optional relationship (blank=True, null=True)
   - Use SET_NULL delete behavior
   - Use related_name='grades' for reverse lookup

4. **Add is_active field**
   - BooleanField with default=True
   - Controls grade visibility and usability
   - Enables soft deletion pattern

5. **Add Meta class**
   - Define verbose_name as "Salary Grade"
   - Define verbose_name_plural as "Salary Grades"
   - Set default ordering by level
   - Add unique_together constraint for (tenant, code)
   - Add indexes for common queries

6. **Add __str__ method**
   - Return grade name and level
   - Include salary range in representation
   - Format: "Grade 5 - Senior (130K-180K)"

7. **Add property methods (optional)**
   - contains_salary(amount): Check if amount is within range
   - is_compatible_with_template(): Validate template compatibility
   - get_template_or_default(): Return template or None

8. **Update model docstring**
   - Document template relationship
   - Explain grade-template linkage purpose
   - Provide usage examples

### Grade-Template Relationship

```
┌────────────────────────────────────────────────────┐
│        Grade-Template Relationship                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────────────┐          ┌──────────────┐    │
│  │  SalaryTemplate │          │ SalaryGrade  │    │
│  ├─────────────────┤          ├──────────────┤    │
│  │ id              │◄─────────│ template FK  │    │
│  │ name            │   0..1   │ name         │    │
│  │ code            │          │ code         │    │
│  │ designation FK  │          │ level        │    │
│  │ ...             │          │ min_salary   │    │
│  └─────────────────┘          │ max_salary   │    │
│                               └──────────────┘    │
│                                                    │
│  Optional Relationship:                            │
│  - Grade can exist without template                │
│  - Template can be linked to multiple grades       │
│  - Grade can have 0 or 1 template                  │
└────────────────────────────────────────────────────┘
```

### Grade-Template Linkage Patterns

#### Pattern 1: Grade with Linked Template
```
Grade G5 (Senior)
├── min_salary: 130,000
├── max_salary: 180,000
└── template: "Senior Staff Package"
    ├── Basic Salary (default: 155,000)
    ├── Transport Allowance (15,000)
    ├── Professional Development (10,000)
    └── Standard deductions

When employee assigned to G5:
└── System suggests "Senior Staff Package"
    └── Salary constrained to 130K-180K range
```

#### Pattern 2: Grade without Template
```
Grade G1 (Entry Level)
├── min_salary: 35,000
├── max_salary: 50,000
└── template: null

When employee assigned to G1:
└── HR manually configures salary components
    └── Salary must be within 35K-50K range
```

#### Pattern 3: Multiple Grades, Same Template
```
Template: "Staff Package"

Used by:
├── Grade G2 (Junior) - Range: 50K-75K
├── Grade G3 (Associate) - Range: 75K-100K
└── Grade G4 (Mid-Level) - Range: 100K-130K

Same components, different salary ranges per grade
```

### Use Case Examples

#### Scenario 1: Standardized Grade Structure
```
Organization with standard grades:

G5 → "Senior Package"
├── All G5 employees get same component structure
├── Salary varies within 130K-180K range
└── Components: Basic, Transport, Medical, Deductions

G6 → "Lead Package"
├── All G6 employees get enhanced structure
├── Salary varies within 180K-250K range
└── Components: Basic, Transport, Medical, Leadership Allowance, Deductions
```

#### Scenario 2: Flexible Assignment
```
Grade G7 (Manager) - No template link
├── Different departments have different needs
├── Sales managers get commission components
├── Tech managers get tech allowances
├── HR manually configures per case
└── All must be within 250K-350K range
```

#### Scenario 3: Promotion with Template Change
```
Employee Promotion:

Current:
├── Grade G4 → Template "Mid-Level Package"
└── Salary: 125,000

Promoted to:
├── Grade G5 → Template "Senior Package"
└── New Salary: 145,000 (within G5 range: 130K-180K)

System automatically:
├── Changes grade to G5
├── Applies "Senior Package" template
├── Adjusts salary within new range
└── Updates all components
```

### is_active Field Purpose

```
Grade Lifecycle
═══════════════

is_active = True (Default):
├── Grade available for use
├── Appears in selection lists
├── Can be assigned to employees
└── Included in reports

is_active = False (Archived):
├── Grade hidden from selection
├── Cannot be assigned to new employees
├── Existing assignments remain valid
├── Historical data preserved
└── Can be reactivated if needed
```

### Meta Class Configuration

```
Meta Class Components
═════════════════════

verbose_name: "Salary Grade"
└── Singular form for Django admin

verbose_name_plural: "Salary Grades"
└── Plural form for Django admin

ordering: ['level']
└── Default sort by level (G1, G2, G3...)
    Alternative: ['code'] for alphabetical

unique_together: [['tenant', 'code']]
└── Ensures unique codes within each tenant
    (same code can exist across different tenants)

indexes:
├── [tenant, level] - List grades by level per tenant
├── [tenant, is_active] - Filter active grades per tenant
├── [template] - Find grades using template
└── [code] - Quick code-based lookups
```

### String Representation

```
__str__ Method Examples
═══════════════════════

Format 1: Name and Range
"Grade 5 - Senior (130,000 - 180,000)"

Format 2: Code and Range
"G5: 130K-180K"

Format 3: Name, Code, Level
"Grade 5 - Senior (G5) [Level 5]"

Format 4: With Template
"Grade 5 - Senior (130K-180K) → Senior Package"

Recommended:
"Grade 5 - Senior (130,000 - 180,000)"
└── Clear, informative, includes range
```

### Helper Methods

```python
# Example helper methods (for reference)

def contains_salary(self, amount):
    """
    Check if salary amount is within grade range
    
    Args:
        amount: Decimal salary amount
        
    Returns:
        Boolean: True if within range
    """
    if amount < self.min_salary:
        return False
    if self.max_salary and amount > self.max_salary:
        return False
    return True

def is_compatible_with_template(self):
    """
    Check if linked template is compatible with grade range
    
    Returns:
        Boolean: True if compatible or no template
    """
    if not self.template:
        return True
    
    # Check if template components fit within grade range
    # Implementation depends on business rules
    return True

@property
def range_display(self):
    """
    Return formatted range for display
    
    Returns:
        String: Formatted salary range
    """
    if self.max_salary:
        return f"{self.min_salary:,.0f} - {self.max_salary:,.0f}"
    return f"{self.min_salary:,.0f}+"
```

### Grade-Template Validation

```
Validation Scenarios
════════════════════

Scenario 1: Template Default Within Range
Grade G5: 130K - 180K
Template: Basic Salary default = 155K ✓

Validation: PASS (155K within 130K-180K)

Scenario 2: Template Default Outside Range
Grade G5: 130K - 180K
Template: Basic Salary default = 200K ✗

Validation: WARN (default exceeds grade max)
└── Should adjust template or grade range

Scenario 3: Template Range vs Grade Range
Grade G5: 130K - 180K
Template Component: min=120K, max=200K

Validation: WARN (template range wider than grade)
└── Consider aligning ranges
```

### ForeignKey Configuration

```
template ForeignKey Settings
════════════════════════════

to: SalaryTemplate
├── References salary template model

on_delete: SET_NULL
├── When template deleted, grade remains
└── template field set to null

blank: True
└── Not required in forms

null: True
└── Can be null in database

related_name: 'grades'
└── Reverse lookup from template
    Example: template.grades.all()

db_index: True
└── Optimize queries by template
```

### Expected Outcome
- Optional ForeignKey to SalaryTemplate
- is_active field for lifecycle management
- Meta class with proper configuration
- String representation shows grade details
- Helper methods support grade operations
- Flexible grade-template association

### Verification Checklist
- [ ] SalaryTemplate model imported
- [ ] template ForeignKey field added
- [ ] template field is optional (blank=True, null=True)
- [ ] template field uses SET_NULL on deletion
- [ ] related_name='grades' configured
- [ ] is_active BooleanField added with default=True
- [ ] Meta class defined with verbose names
- [ ] unique_together on (tenant, code)
- [ ] ordering by level
- [ ] Appropriate indexes added
- [ ] __str__ method returns grade name and range
- [ ] Helper methods added (optional)
- [ ] Model docstring updated

---

## Task 33: Run SalaryGrade Migrations

### Overview
Create and apply database migrations for the SalaryGrade model. This task generates the migration file that creates the database table with all fields defined in tasks 29-32, including the core fields, salary ranges, template relationship, and all constraints.

### Dependencies
- Task 29: Create SalaryGrade Model
- Task 30: Add Grade Core Fields
- Task 31: Add Grade Salary Range
- Task 32: Add Grade Template Link
- PostgreSQL database configured
- SalaryTemplate migrations applied (Task 23)

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/salary_grade.py`
   - Confirm all fields properly defined
   - Check ForeignKey relationships
   - Verify Meta class complete
   - Ensure validation methods implemented

2. **Update models __init__.py**
   - Open `apps/payroll/models/__init__.py`
   - Import SalaryGrade model
   - Add SalaryGrade to __all__ list
   - Ensure proper module exports

3. **Run Django system check**
   - Execute check command for payroll app
   - Verify no system check errors
   - Fix any issues before migration
   - Confirm all relationships valid

4. **Create migration file**
   - Run makemigrations command for payroll app
   - Review generated migration file
   - Verify all fields included
   - Check constraints and indexes

5. **Review migration file**
   - Open generated migration in apps/payroll/migrations/
   - Verify field definitions match model
   - Check ForeignKey configurations
   - Confirm indexes created
   - Verify unique constraint

6. **Apply migration**
   - Run migrate command for payroll app
   - Monitor for errors during application
   - Verify successful migration
   - Check database table creation

7. **Verify database table**
   - Confirm salary_grade table exists
   - Verify all columns present
   - Check foreign key constraints
   - Confirm indexes created
   - Verify unique constraint active

8. **Test model functionality**
   - Open Django shell
   - Import SalaryGrade model
   - Create test grade instance
   - Verify save operation
   - Test validation rules
   - Test helper methods
   - Clean up test data

### Migration File Structure

```
Migration File Components
═════════════════════════

Migration Class:
├── dependencies
│   ├── Previous payroll migration (0003_template_component)
│   └── SalaryTemplate migration reference
│
└── operations
    └── CreateModel
        ├── name: 'SalaryGrade'
        ├── fields:
        │   ├── id (AutoField, primary key)
        │   ├── tenant (ForeignKey to Tenant)
        │   ├── name (CharField, max_length=100)
        │   ├── code (CharField, max_length=20)
        │   ├── level (IntegerField)
        │   ├── min_salary (DecimalField, 12, 2)
        │   ├── max_salary (DecimalField, 12, 2, nullable)
        │   ├── template (ForeignKey to SalaryTemplate, nullable, SET_NULL)
        │   ├── description (TextField, nullable)
        │   ├── is_active (BooleanField, default=True)
        │   ├── created_at (DateTimeField, auto_now_add)
        │   └── updated_at (DateTimeField, auto_now)
        │
        └── options:
            ├── verbose_name: 'Salary Grade'
            ├── verbose_name_plural: 'Salary Grades'
            ├── ordering: ['level']
            ├── unique_together: [['tenant', 'code']]
            └── indexes: [...]
```

### Database Table Structure

```sql
-- Expected table structure (for reference)

CREATE TABLE payroll_salary_grade (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenant(id),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL,
    min_salary NUMERIC(12, 2) NOT NULL,
    max_salary NUMERIC(12, 2) NULL,
    template_id INTEGER NULL REFERENCES payroll_salary_template(id) ON DELETE SET NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Unique constraint
    CONSTRAINT unique_tenant_code UNIQUE (tenant_id, code)
);

-- Indexes
CREATE INDEX idx_salary_grade_tenant ON payroll_salary_grade(tenant_id);
CREATE INDEX idx_salary_grade_level ON payroll_salary_grade(tenant_id, level);
CREATE INDEX idx_salary_grade_active ON payroll_salary_grade(tenant_id, is_active);
CREATE INDEX idx_salary_grade_template ON payroll_salary_grade(template_id);
CREATE INDEX idx_salary_grade_code ON payroll_salary_grade(code);
```

### Migration Commands

#### Step 1: System Check
```bash
python manage.py check payroll
```
**Expected Output:**
```
System check identified no issues (0 silenced).
```

#### Step 2: Create Migration
```bash
python manage.py makemigrations payroll
```
**Expected Output:**
```
Migrations for 'payroll':
  apps/payroll/migrations/0004_salary_grade.py
    - Create model SalaryGrade
```

#### Step 3: Review Migration SQL
```bash
python manage.py sqlmigrate payroll 0004
```
**Purpose:** Preview SQL statements that will be executed

#### Step 4: Apply Migration
```bash
python manage.py migrate payroll
```
**Expected Output:**
```
Operations to perform:
  Apply all migrations: payroll
Running migrations:
  Applying payroll.0004_salary_grade... OK
```

### Verification Queries

#### Check Table Exists
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payroll_salary_grade'
);
```

#### Check All Columns
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'payroll_salary_grade'
ORDER BY ordinal_position;
```

#### Verify Foreign Key
```sql
SELECT 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'payroll_salary_grade'
AND tc.constraint_type = 'FOREIGN KEY';
```

#### Check Unique Constraint
```sql
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'payroll_salary_grade'::regclass
AND contype = 'u';
```

#### Check Indexes
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'payroll_salary_grade';
```

### Post-Migration Testing

```python
# Django Shell Testing Script
# ===========================

from apps.payroll.models import SalaryGrade, SalaryTemplate
from apps.core.models import Tenant
from decimal import Decimal

# Get tenant
tenant = Tenant.objects.first()

# Test 1: Create grade without template
grade1 = SalaryGrade.objects.create(
    tenant=tenant,
    name="Grade 5 - Senior",
    code="G5",
    level=5,
    min_salary=Decimal("130000.00"),
    max_salary=Decimal("180000.00"),
    is_active=True
)
print(f"Created: {grade1}")
print(f"Range: {grade1.min_salary} - {grade1.max_salary}")

# Test 2: Create grade with template
template = SalaryTemplate.objects.filter(tenant=tenant).first()
if template:
    grade2 = SalaryGrade.objects.create(
        tenant=tenant,
        name="Grade 6 - Lead",
        code="G6",
        level=6,
        min_salary=Decimal("180000.00"),
        max_salary=Decimal("250000.00"),
        template=template,
        description="Lead positions with team responsibility",
        is_active=True
    )
    print(f"Created with template: {grade2}")
    print(f"Template: {grade2.template.name}")

# Test 3: Validate unique constraint
try:
    duplicate = SalaryGrade(
        tenant=tenant,
        name="Duplicate Grade",
        code="G5",  # Duplicate code!
        level=5,
        min_salary=Decimal("100000.00")
    )
    duplicate.save()
    print("ERROR: Should have failed unique constraint!")
except Exception as e:
    print(f"Good: Unique constraint works - {type(e).__name__}")

# Test 4: Validate range (if clean() method implemented)
try:
    invalid_grade = SalaryGrade(
        tenant=tenant,
        name="Invalid Grade",
        code="GINV",
        level=99,
        min_salary=Decimal("200000.00"),
        max_salary=Decimal("100000.00")  # max < min!
    )
    invalid_grade.full_clean()  # Trigger validation
    print("ERROR: Should have failed validation!")
except Exception as e:
    print(f"Good: Validation works - {type(e).__name__}")

# Test 5: Test helper methods (if implemented)
if hasattr(grade1, 'contains_salary'):
    print(f"Contains 150K? {grade1.contains_salary(Decimal('150000'))}")
    print(f"Contains 200K? {grade1.contains_salary(Decimal('200000'))}")

# Clean up
grade1.delete()
if 'grade2' in locals():
    grade2.delete()

print("\nTest completed successfully!")
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Field missing | Model not saved | Save model file, regenerate migration |
| FK constraint error | Template model not migrated | Ensure SalaryTemplate migrated first |
| Unique constraint violation | Test data conflicts | Clear conflicting test data |
| Decimal field error | Wrong precision | Verify max_digits=12, decimal_places=2 |
| Import error | Model not in __init__.py | Add import to models package |
| Ordering error | Invalid field in ordering | Verify field names in Meta.ordering |

### Testing Checklist

```
Post-Migration Verification
═══════════════════════════

Database Level:
├── [ ] Table created
├── [ ] All columns present with correct types
├── [ ] Foreign key to SalaryTemplate configured
├── [ ] Unique constraint on (tenant, code)
├── [ ] Indexes created for performance
└── [ ] Default values correct

Model Level:
├── [ ] Can create SalaryGrade
├── [ ] Can link to SalaryTemplate (optional)
├── [ ] Can set salary range (min/max)
├── [ ] Can set level and code
├── [ ] Unique constraint prevents duplicate codes
├── [ ] Validation rules work (if implemented)
└── [ ] Helper methods function (if implemented)

Admin Interface:
├── [ ] /admin/payroll/salarygrade/ accessible
├── [ ] List view displays grades
├── [ ] Add form renders correctly
├── [ ] Template dropdown works
├── [ ] Help texts visible
└── [ ] Can create and edit grades
```

### Migration Rollback

```
If Issues Occur
═══════════════

Rollback to previous migration:
python manage.py migrate payroll 0003

Or rollback completely:
python manage.py migrate payroll zero

Note: Rollback only possible if:
      - No data exists in the table
      - No other migrations depend on this one
      - No foreign keys reference this table
```

### Expected Outcome
- Migration file created successfully
- Database table created with all fields
- Foreign key to SalaryTemplate established
- Unique constraint prevents duplicate codes
- Indexes optimize query performance
- Model fully operational
- Validation rules enforced

### Verification Checklist
- [ ] SalaryGrade imported in models __init__.py
- [ ] Django check command passes
- [ ] makemigrations creates 0004_salary_grade.py
- [ ] Migration file has all fields
- [ ] Migration file has proper dependencies
- [ ] migrate command executes successfully
- [ ] Database table created
- [ ] All columns present with correct types
- [ ] Foreign key to SalaryTemplate configured (SET_NULL)
- [ ] Unique constraint on (tenant, code) active
- [ ] Indexes created for common queries
- [ ] Test grade can be created and saved
- [ ] Duplicate code prevention works
- [ ] Grade can be linked to template (optional)

---

## Task 34: Create Default Grades Seed

### Overview
Create a Django management command to seed default salary grades into the system. This command will populate the database with a standard set of 10 salary grades ranging from entry level to C-level, providing a ready-to-use grade structure for new tenants.

### Dependencies
- Task 33: Run SalaryGrade Migrations
- SalaryGrade model fully implemented
- Django management command structure understood

### Instructions

1. **Create management command directory structure**
   - Navigate to `apps/payroll/` directory
   - Create `management/` directory if not exists
   - Create `management/__init__.py` (empty package file)
   - Create `management/commands/` directory
   - Create `management/commands/__init__.py` (empty)

2. **Create seed_grades.py command file**
   - Create file at `apps/payroll/management/commands/seed_grades.py`
   - Import necessary Django components
   - Import SalaryGrade model
   - Import Tenant model

3. **Define Command class**
   - Inherit from BaseCommand
   - Set help text describing command purpose
   - Define handle() method as main entry point

4. **Add command arguments**
   - Add --tenant argument to specify tenant ID or code
   - Add --overwrite flag to replace existing grades
   - Add --dry-run flag to preview without saving

5. **Define grade data structure**
   - Create GRADE_DEFINITIONS list with grade details
   - Include name, code, level, min_salary, max_salary
   - Include description for each grade
   - Use 10 standard grades (G1 to G10)

6. **Implement grade creation logic**
   - Get or validate tenant
   - Check for existing grades (if not overwrite)
   - Create SalaryGrade instances
   - Handle duplicate code errors gracefully
   - Provide progress feedback

7. **Add output formatting**
   - Use self.stdout.write() for messages
   - Use style.SUCCESS for success messages
   - Use style.WARNING for warnings
   - Use style.ERROR for errors
   - Show summary of created grades

8. **Add error handling**
   - Handle missing tenant
   - Handle existing grades conflict
   - Handle database errors
   - Provide helpful error messages

9. **Test command execution**
   - Run command with --dry-run first
   - Run command for specific tenant
   - Verify grades created in database
   - Test overwrite functionality

### Management Command Structure

```
Directory Structure
═══════════════════

apps/payroll/
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── seed_grades.py          ← Main command file
└── models/
    └── salary_grade.py
```

### Command Class Structure

```python
# Command structure outline (for reference)

from django.core.management.base import BaseCommand
from apps.payroll.models import SalaryGrade
from apps.core.models import Tenant
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seed default salary grades into the system'
    
    def add_arguments(self, parser):
        # Add command arguments
        pass
    
    def handle(self, *args, **options):
        # Main command logic
        pass
```

### Grade Definitions Data

```python
# Standard grade definitions (for reference)

GRADE_DEFINITIONS = [
    {
        'name': 'Grade 1 - Entry Level',
        'code': 'G1',
        'level': 1,
        'min_salary': Decimal('35000.00'),
        'max_salary': Decimal('50000.00'),
        'description': '''Entry-level positions for fresh graduates or 
        individuals with minimal professional experience. Requires 
        supervision and on-the-job training.'''
    },
    {
        'name': 'Grade 2 - Junior',
        'code': 'G2',
        'level': 2,
        'min_salary': Decimal('50000.00'),
        'max_salary': Decimal('75000.00'),
        'description': '''Junior positions for employees with 1-3 years 
        experience. Beginning to work independently on routine tasks.'''
    },
    # ... (Continue for G3 through G10)
]
```

### Complete Grade Definitions

```
Grade Structure (LKR per month)
═══════════════════════════════

G1: Entry Level
├── Range: 35,000 - 50,000
├── Level: 1
└── Description: Fresh graduates, minimal experience,
    requires supervision, on-the-job training

G2: Junior
├── Range: 50,000 - 75,000
├── Level: 2
└── Description: 1-3 years experience, routine tasks,
    increasing independence

G3: Associate
├── Range: 75,000 - 100,000
├── Level: 3
└── Description: 3-5 years experience, full independence,
    complex tasks

G4: Mid-Level
├── Range: 100,000 - 130,000
├── Level: 4
└── Description: 5-7 years experience, specialized skills,
    project responsibility

G5: Senior
├── Range: 130,000 - 180,000
├── Level: 5
└── Description: 7-10 years experience, expert level,
    mentorship role

G6: Lead
├── Range: 180,000 - 250,000
├── Level: 6
└── Description: 10-12 years experience, team leadership,
    technical direction

G7: Manager
├── Range: 250,000 - 350,000
├── Level: 7
└── Description: 12-15 years experience, department management,
    strategic planning

G8: Director
├── Range: 350,000 - 500,000
├── Level: 8
└── Description: 15-18 years experience, multi-department oversight,
    organizational strategy

G9: Executive
├── Range: 500,000 - 750,000
├── Level: 9
└── Description: 18-20 years experience, executive management,
    strategic direction

G10: C-Level
├── Range: 750,000 - null (unlimited)
├── Level: 10
└── Description: 20+ years experience, C-suite positions,
    organizational leadership
```

### Command Arguments

```
Command Line Arguments
══════════════════════

--tenant <tenant_id_or_code>
├── Specifies which tenant to seed grades for
├── Can be tenant ID (integer) or tenant code (string)
└── Required: Yes

--overwrite
├── Replace existing grades for tenant
├── Deletes current grades before seeding
└── Required: No (flag)

--dry-run
├── Preview what would be created without saving
├── Shows grade details but doesn't modify database
└── Required: No (flag)

Examples:
python manage.py seed_grades --tenant=1
python manage.py seed_grades --tenant=TENANT001 --overwrite
python manage.py seed_grades --tenant=1 --dry-run
```

### Command Execution Flow

```
Execution Workflow
══════════════════

1. Parse Arguments
   └── Get tenant ID/code
   └── Check flags (overwrite, dry-run)
       │
       ▼
2. Validate Tenant
   └── Find tenant by ID or code
   └── Exit if not found
       │
       ▼
3. Check Existing Grades
   └── Count grades for tenant
   └── If exists and not overwrite:
       └── Prompt or exit
       │
       ▼
4. Process Grades
   └── For each grade definition:
       ├── Create SalaryGrade instance
       ├── Set tenant and fields
       ├── Save to database (unless dry-run)
       └── Log success
       │
       ▼
5. Display Summary
   └── Show count of grades created
   └── Show any errors or warnings
   └── Exit with appropriate code
```

### Output Formatting

```
Console Output Example
══════════════════════

$ python manage.py seed_grades --tenant=1

Seeding salary grades for tenant: LankaCommerce (ID: 1)
───────────────────────────────────────────────────────

Creating grades...

✓ Created: Grade 1 - Entry Level (G1) [35,000 - 50,000]
✓ Created: Grade 2 - Junior (G2) [50,000 - 75,000]
✓ Created: Grade 3 - Associate (G3) [75,000 - 100,000]
✓ Created: Grade 4 - Mid-Level (G4) [100,000 - 130,000]
✓ Created: Grade 5 - Senior (G5) [130,000 - 180,000]
✓ Created: Grade 6 - Lead (G6) [180,000 - 250,000]
✓ Created: Grade 7 - Manager (G7) [250,000 - 350,000]
✓ Created: Grade 8 - Director (G8) [350,000 - 500,000]
✓ Created: Grade 9 - Executive (G9) [500,000 - 750,000]
✓ Created: Grade 10 - C-Level (G10) [750,000+]

Summary
───────
Successfully created 10 salary grades.

$ python manage.py seed_grades --tenant=1 --dry-run

DRY RUN - No changes will be saved
──────────────────────────────────

Would create:
• Grade 1 - Entry Level (G1)
• Grade 2 - Junior (G2)
... (etc)

Total: 10 grades would be created
```

### Error Handling

```
Error Scenarios
═══════════════

Scenario 1: Tenant Not Found
────────────────────────────
Error: Tenant with ID '999' not found.
Available tenants:
  1: LankaCommerce
  2: RetailShop
  3: TechCompany

Scenario 2: Grades Already Exist
─────────────────────────────────
Warning: Tenant already has 10 grades.
Use --overwrite to replace existing grades.

Scenario 3: Duplicate Code Conflict
────────────────────────────────────
Error creating G1: Grade code 'G1' already exists for this tenant.
Skipping G1 and continuing...

Scenario 4: Database Error
───────────────────────────
Error: Unable to save grade G5
Database error: [error details]
Rolling back changes...
```

### Command Testing

```
Testing Steps
═════════════

Step 1: Dry Run Test
python manage.py seed_grades --tenant=1 --dry-run

Expected: Preview of grades without database changes

Step 2: First Seed
python manage.py seed_grades --tenant=1

Expected: 10 grades created successfully

Step 3: Duplicate Attempt (Without Overwrite)
python manage.py seed_grades --tenant=1

Expected: Warning about existing grades, no changes

Step 4: Overwrite Test
python manage.py seed_grades --tenant=1 --overwrite

Expected: Existing grades deleted, new grades created

Step 5: Verify in Database
python manage.py shell
>>> from apps.payroll.models import SalaryGrade
>>> SalaryGrade.objects.filter(tenant_id=1).count()
10
>>> SalaryGrade.objects.filter(tenant_id=1).order_by('level')

Expected: 10 grades visible, ordered by level
```

### Sri Lanka Context Variations

```
Alternative Grade Structures for Sri Lanka
═══════════════════════════════════════════

Corporate Sector:
├── Use G1-G10 as defined (standard)
└── Aligns with multinational practices

SME Sector (Simplified):
├── G1: Entry (30K-45K)
├── G2: Experienced (45K-70K)
├── G3: Senior (70K-120K)
├── G4: Management (120K-250K)
└── G5: Executive (250K+)

Government Sector Alignment:
├── G1: Grade III (35K-50K)
├── G2: Grade II (50K-70K)
├── G3: Grade I (70K-100K)
├── G4: Senior Grade (100K-150K)
└── G5: Special Grade (150K+)

Industry-Specific (Banking):
├── G1: Banking Assistant (40K-60K)
├── G2: Officer (60K-90K)
├── G3: Senior Officer (90K-130K)
├── G4: Manager (130K-220K)
├── G5: Senior Manager (220K-350K)
└── G6: General Manager (350K+)
```

### Post-Seed Verification

```
Verification Queries
════════════════════

# Check grade count
SELECT COUNT(*) FROM payroll_salary_grade 
WHERE tenant_id = 1;

Expected: 10

# View all grades
SELECT level, code, name, min_salary, max_salary 
FROM payroll_salary_grade 
WHERE tenant_id = 1 
ORDER BY level;

Expected: G1 through G10 in order

# Check for gaps
SELECT level FROM payroll_salary_grade 
WHERE tenant_id = 1 
ORDER BY level;

Expected: Continuous sequence 1-10

# Verify ranges
SELECT 
    code,
    min_salary,
    max_salary,
    (max_salary - min_salary) as range_width,
    ROUND((max_salary - min_salary) / min_salary * 100, 2) as range_percent
FROM payroll_salary_grade 
WHERE tenant_id = 1 
ORDER BY level;

Expected: Logical progression, reasonable percentages
```

### Expected Outcome
- Management command created successfully
- Command accepts tenant specification
- Command seeds 10 standard grades
- Grades have appropriate ranges for Sri Lanka
- Command provides clear feedback
- Dry-run option allows preview
- Overwrite option handles updates
- Error handling is robust

### Verification Checklist
- [ ] management/ directory structure created
- [ ] seed_grades.py command file created
- [ ] Command class inherits from BaseCommand
- [ ] --tenant argument implemented
- [ ] --overwrite flag implemented
- [ ] --dry-run flag implemented
- [ ] GRADE_DEFINITIONS list complete (G1-G10)
- [ ] Grade creation logic implemented
- [ ] Tenant validation implemented
- [ ] Existing grade check implemented
- [ ] Progress output with formatting
- [ ] Error handling for all scenarios
- [ ] Command executes successfully
- [ ] Dry-run shows preview without saving
- [ ] 10 grades created in database
- [ ] Grades have correct ranges
- [ ] Overwrite deletes and recreates grades

---

## Summary

This document established the salary grade infrastructure and seed data:

### Completed Models
- ✅ SalaryGrade model created
- ✅ Grade core fields (name, code, level, description)
- ✅ Salary range fields (min_salary, max_salary)
- ✅ Template link (optional FK to SalaryTemplate)
- ✅ Active status field (is_active)
- ✅ SalaryGrade migrations applied

### Completed Commands
- ✅ seed_grades management command
- ✅ Default 10-grade structure (G1-G10)
- ✅ Dry-run capability
- ✅ Overwrite functionality
- ✅ Sri Lanka appropriate salary ranges

### Key Achievements

1. **Grade Hierarchy** - 10-level structure from entry to C-level
2. **Salary Ranges** - Min/max boundaries for each grade
3. **Template Integration** - Optional template linkage
4. **Lifecycle Management** - Active/inactive status
5. **Seed Command** - Quick setup for new tenants
6. **Validation** - Range and consistency checks

### Grade Structure Summary

| Grade | Level | Range (LKR) | Typical Roles |
|-------|-------|-------------|---------------|
| G1 | 1 | 35K-50K | Entry Level, Trainees |
| G2 | 2 | 50K-75K | Junior Professionals |
| G3 | 3 | 75K-100K | Associates |
| G4 | 4 | 100K-130K | Mid-Level |
| G5 | 5 | 130K-180K | Senior Professionals |
| G6 | 6 | 180K-250K | Team Leads |
| G7 | 7 | 250K-350K | Managers |
| G8 | 8 | 350K-500K | Directors |
| G9 | 9 | 500K-750K | Executives |
| G10 | 10 | 750K+ | C-Level |

### Usage Workflow

```
Grade Usage in Employee Salary Management
═══════════════════════════════════════════

1. Seed Default Grades
   └── Run: python manage.py seed_grades --tenant=1

2. Optionally Link Templates
   └── Associate templates with grades

3. Assign Employees to Grades
   └── Employee → Grade → Salary Range

4. Validate Salary Assignments
   └── Salary must be within grade range

5. Support Career Progression
   └── Promotions move employees to higher grades
```

### Next Steps

Proceed to **Group C: Employee Salary Assignment** to implement:
- EmployeeSalary model
- Component-level employee assignments
- Salary calculation engine
- Payroll processing foundation

---

**Document Status:** ✅ Complete  
**Tasks Completed:** 29-34 (6 tasks)  
**Models Created:** SalaryGrade  
**Commands Created:** seed_grades  
**Migrations Applied:** 0004_salary_grade  
**Grades Seeded:** 10 standard grades (G1-G10)
