# Tasks 17-24: Model Core, Level, and Salary Range

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** B - Designation Model & Levels  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group A: Department Model & Hierarchy](../../Group-A_Department-Model-Hierarchy/)
- **→ Next Document:** [02_Tasks-25-30_Manager-Flag-Index-Seed.md](02_Tasks-25-30_Manager-Flag-Index-Seed.md)

---

## Document Overview

This document covers the creation of the Designation model including the definition of designation level choices, core model fields, level hierarchy, description fields, department association, salary ranges, qualification requirements, and reporting relationships.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Define DesignationLevel Choices | Low | 15 min |
| 18 | Create Designation Model Core | Medium | 25 min |
| 19 | Add Designation Level Field | Low | 15 min |
| 20 | Add Designation Description | Low | 15 min |
| 21 | Add Designation Department FK | Medium | 20 min |
| 22 | Add Salary Range Fields | Medium | 20 min |
| 23 | Add Designation Requirements | Medium | 20 min |
| 24 | Add Reports To Field | Medium | 20 min |

---

## Task 17: Define DesignationLevel Choices

### Overview
Define designation level choices to establish a seniority hierarchy within the organization. These levels represent career progression stages and are used for determining authority, salary ranges, and organizational hierarchy.

### Dependencies
- Task 01: Create organization Django App
- constants.py file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/organization/constants.py`
   - Locate existing constants or add new section

2. **Add module comment for designation levels**
   - Add clear section header
   - Explain designation level purpose
   - Note usage in hierarchy and compensation

3. **Define DesignationLevel choices**
   - Use Django's TextChoices or similar pattern
   - Include 8 standard levels
   - Provide clear display names

4. **Define ENTRY level**
   - Value: 'entry' or numeric 1
   - Purpose: Entry-level positions, interns, trainees
   - Lowest level in hierarchy

5. **Define JUNIOR level**
   - Value: 'junior' or numeric 2
   - Purpose: Junior positions with basic experience
   - Second level

6. **Define MID level**
   - Value: 'mid' or numeric 3
   - Purpose: Mid-level positions with moderate experience
   - Third level

7. **Define SENIOR level**
   - Value: 'senior' or numeric 4
   - Purpose: Senior positions with significant experience
   - Fourth level

8. **Define LEAD level**
   - Value: 'lead' or numeric 5
   - Purpose: Team leads, project leads
   - Fifth level

9. **Define MANAGER level**
   - Value: 'manager' or numeric 6
   - Purpose: Department or team managers
   - Sixth level

10. **Define DIRECTOR level**
    - Value: 'director' or numeric 7
    - Purpose: Directors overseeing multiple departments
    - Seventh level

11. **Define EXECUTIVE level**
    - Value: 'executive' or numeric 8
    - Purpose: C-level executives, top leadership
    - Highest level

### Designation Level Details

| Level | Value | Display Name | Typical Positions |
|-------|-------|--------------|-------------------|
| ENTRY | 1 | Entry Level | Trainee, Intern, Graduate Trainee |
| JUNIOR | 2 | Junior | Junior Developer, Junior Analyst |
| MID | 3 | Mid-Level | Developer, Analyst, Specialist |
| SENIOR | 4 | Senior | Senior Developer, Senior Analyst |
| LEAD | 5 | Lead | Team Lead, Project Lead, Tech Lead |
| MANAGER | 6 | Manager | Manager, Department Manager |
| DIRECTOR | 7 | Director | Director, Senior Director, VP |
| EXECUTIVE | 8 | Executive | CEO, COO, CFO, CTO, C-Level |

### Level Hierarchy Structure

```
Level 8: EXECUTIVE (Top Leadership)
         │
         ├── CEO (Chief Executive Officer)
         ├── COO (Chief Operating Officer)
         ├── CFO (Chief Financial Officer)
         └── CTO (Chief Technology Officer)
         
Level 7: DIRECTOR (Department Oversight)
         │
         ├── IT Director
         ├── Sales Director
         └── Finance Director
         
Level 6: MANAGER (Team Management)
         │
         ├── HR Manager
         ├── Operations Manager
         └── Project Manager
         
Level 5: LEAD (Team Leadership)
         │
         ├── Tech Lead
         ├── Team Lead
         └── Project Lead
         
Level 4: SENIOR (Expert Level)
         │
         ├── Senior Developer
         ├── Senior Analyst
         └── Senior Designer
         
Level 3: MID-LEVEL (Intermediate)
         │
         ├── Developer
         ├── Analyst
         └── Designer
         
Level 2: JUNIOR (Basic Experience)
         │
         ├── Junior Developer
         ├── Junior Analyst
         └── Associate
         
Level 1: ENTRY (Beginner)
         │
         ├── Trainee
         ├── Intern
         └── Graduate Trainee
```

### Career Progression Path

#### Example: Software Development Track
```
ENTRY    → Trainee Developer (0-1 years)
JUNIOR   → Junior Developer (1-2 years)
MID      → Developer (2-4 years)
SENIOR   → Senior Developer (4-7 years)
LEAD     → Tech Lead (7-10 years)
MANAGER  → Engineering Manager (10+ years)
DIRECTOR → Engineering Director (12+ years)
EXECUTIVE→ CTO (15+ years)
```

#### Example: Finance Track
```
ENTRY    → Finance Trainee
JUNIOR   → Junior Accountant
MID      → Accountant
SENIOR   → Senior Accountant
LEAD     → Accounting Supervisor
MANAGER  → Finance Manager
DIRECTOR → Finance Director
EXECUTIVE→ CFO
```

### Level Usage in System

#### Salary Determination:
- Each level has typical salary range
- Higher levels command higher compensation
- Used in salary benchmarking

#### Authority Levels:
- Higher levels have more authority
- Approval workflows based on level
- Access control uses level hierarchy

#### Reporting Structure:
- Lower levels typically report to higher levels
- Defines organizational hierarchy
- Determines chain of command

### Expected Outcome
- Clear designation level hierarchy
- Consistent level values across system
- Foundation for career progression tracking

### Verification Checklist
- [ ] DesignationLevel choices defined
- [ ] ENTRY level constant created
- [ ] JUNIOR level constant created
- [ ] MID level constant created
- [ ] SENIOR level constant created
- [ ] LEAD level constant created
- [ ] MANAGER level constant created
- [ ] DIRECTOR level constant created
- [ ] EXECUTIVE level constant created
- [ ] Display names are clear and user-friendly

---

## Task 18: Create Designation Model Core

### Overview
Create the core Designation model with essential fields including title and code. This establishes the foundation for job position management within the organization.

### Dependencies
- Task 01: Create organization Django App
- Task 02: Register organization App

### Instructions

1. **Create designation.py model file**
   - Navigate to `apps/organization/models/`
   - Create new file `designation.py`
   - This will contain the Designation model

2. **Import required modules**
   - Import Django models
   - Import tenant-aware base model (if available)
   - Import any utility mixins

3. **Create Designation model class**
   - Define class inheriting from appropriate base
   - Use TenantAwareModel or similar base class
   - Add model Meta configuration

4. **Add title field**
   - CharField for designation title
   - Max length: 100 characters
   - Required field (not nullable)
   - User-friendly job title
   - Example: "Software Engineer", "HR Manager"

5. **Add code field**
   - CharField for designation code
   - Max length: 20 characters
   - Unique constraint per tenant
   - Uppercase formatting recommended
   - Example: "SE", "HRM", "CEO"

6. **Add created_at and updated_at fields**
   - Use auto_now_add for created_at
   - Use auto_now for updated_at
   - Timestamp tracking

7. **Add model string representation**
   - Define `__str__` method
   - Return designation title
   - User-friendly display

8. **Configure model Meta**
   - Set verbose_name and verbose_name_plural
   - Add ordering (by title or level)
   - Set db_table name if needed

9. **Export model**
   - Update `models/__init__.py`
   - Import and expose Designation model
   - Makes model available for import

### Designation Model Core Fields

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| title | CharField(100) | required | Job title/position name |
| code | CharField(20) | unique | Designation identifier |
| created_at | DateTimeField | auto_now_add | Creation timestamp |
| updated_at | DateTimeField | auto_now | Modification timestamp |

### Model Design Considerations

#### Title Field:
- User-facing job title
- Used in employee records
- Appears on organization charts
- Visible in reporting
- Should be descriptive and professional

Title Examples:
- "Software Engineer"
- "Senior HR Manager"
- "Chief Financial Officer"
- "Marketing Specialist"
- "Sales Executive"

#### Code Field:
- System identifier for designation
- Should be unique per tenant
- Useful for integrations and APIs
- Consider auto-generation
- Format: Short uppercase code

Code Examples:
- "SE" - Software Engineer
- "HRM" - HR Manager
- "CFO" - Chief Financial Officer
- "MKT" - Marketing Specialist
- "SLS" - Sales Executive

### Designation vs. Department

#### Designation:
- What an employee does (role/job title)
- Example: Software Engineer, Manager
- Can exist across multiple departments
- Focus: Job function and responsibility

#### Department:
- Where an employee works (organizational unit)
- Example: IT Department, Sales Department
- Organizational structure
- Focus: Team grouping and reporting

#### Relationship:
- An employee has ONE designation
- An employee belongs to ONE department
- A designation can be associated with a department (optional)
- Multiple employees can share same designation

### Expected Outcome
- Functional Designation model with core fields
- Model ready for extended attributes
- Foundation for job position management

### Verification Checklist
- [ ] `designation.py` file created
- [ ] Designation model class defined
- [ ] title field added
- [ ] code field added with unique constraint
- [ ] Timestamp fields added
- [ ] `__str__` method implemented
- [ ] Meta class configured
- [ ] Model exported in `models/__init__.py`

---

## Task 19: Add Designation Level Field

### Overview
Add the level field to the Designation model to establish seniority hierarchy. This field uses the DesignationLevel choices defined earlier to categorize positions by seniority.

### Dependencies
- Task 17: Define DesignationLevel Choices
- Task 18: Create Designation Model Core

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Import DesignationLevel choices**
   - Add import statement
   - Import from organization.constants
   - Will be used for level field choices

3. **Add level field**
   - CharField or IntegerField using DesignationLevel choices
   - Required field (not nullable)
   - Determines seniority position
   - Default: MID level (optional)

4. **Add help_text**
   - Explain level purpose
   - Note usage in hierarchy and compensation

### Level Field Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Field Type | CharField/IntegerField | Uses DesignationLevel choices |
| Null | False | Every designation has a level |
| Blank | False | Required in forms |
| Choices | DesignationLevel | Predefined level options |
| Default | MID (optional) | Common starting point |

### Level Field Usage

#### Seniority Determination:
- Establishes position in organizational hierarchy
- Higher levels = more seniority
- Used for salary range determination
- Influences reporting relationships

#### Career Progression:
- Shows career growth path
- Tracks promotions
- Identifies advancement opportunities
- Guides succession planning

#### Compensation Planning:
- Each level has typical salary range
- Higher levels command higher pay
- Used in compensation reviews
- Benchmarking against market

### Level-Based Designation Examples

#### EXECUTIVE Level (8):
- Chief Executive Officer (CEO)
- Chief Operating Officer (COO)
- Chief Financial Officer (CFO)
- Chief Technology Officer (CTO)

#### DIRECTOR Level (7):
- IT Director
- Sales Director
- Finance Director
- Operations Director

#### MANAGER Level (6):
- HR Manager
- Project Manager
- Operations Manager
- Finance Manager

#### LEAD Level (5):
- Tech Lead
- Team Lead
- Project Lead
- Quality Lead

#### SENIOR Level (4):
- Senior Software Engineer
- Senior Analyst
- Senior Designer
- Senior Accountant

#### MID Level (3):
- Software Engineer
- Business Analyst
- Graphic Designer
- Accountant

#### JUNIOR Level (2):
- Junior Developer
- Junior Analyst
- Junior Designer
- Junior Accountant

#### ENTRY Level (1):
- Trainee Developer
- Intern
- Graduate Trainee
- Associate Trainee

### Level-Based Features

#### Access Control:
- Higher levels may have more system access
- Manager level+ gets approval rights
- Executive level gets strategic reports

#### Approval Workflows:
- Purchase approvals based on level
- Leave approvals by manager level+
- Budget approvals by director level+

#### Reporting:
- Designations by level distribution
- Level-based headcount reports
- Promotion tracking by level

### Expected Outcome
- Level-based designation hierarchy
- Foundation for seniority tracking
- Support for career progression

### Verification Checklist
- [ ] DesignationLevel imported
- [ ] level field added to model
- [ ] Field uses DesignationLevel choices
- [ ] Field is required (not nullable)
- [ ] help_text added

---

## Task 20: Add Designation Description

### Overview
Add description and responsibilities fields to the Designation model to provide detailed information about the job position, duties, and expectations.

### Dependencies
- Task 18: Create Designation Model Core

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add description field**
   - TextField for detailed designation description
   - Optional field (blank=True, null=True)
   - Multi-line text support
   - Explain position overview and purpose

3. **Add responsibilities field**
   - TextField for key responsibilities
   - Optional field (blank=True, null=True)
   - Multi-line text support
   - List specific duties and accountabilities

### Description Field Details

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| description | TextField | optional | Position overview and summary |
| responsibilities | TextField | optional | Key duties and accountabilities |

### Field Usage Guidelines

#### Description Field:
- Comprehensive overview of position
- Job purpose and objectives
- Scope of role
- How position contributes to organization
- Used in job postings

Example content:
```
The Software Engineer role focuses on designing, developing,
and maintaining software applications. This position works
closely with cross-functional teams to deliver high-quality
solutions that meet business requirements and technical
standards.
```

#### Responsibilities Field:
- Specific duties and tasks
- Key accountabilities
- Expected deliverables
- Performance expectations
- Used in job descriptions and performance reviews

Example content:
```
- Design and develop software applications using modern frameworks
- Write clean, maintainable, and well-documented code
- Participate in code reviews and technical discussions
- Collaborate with product managers and designers
- Troubleshoot and debug application issues
- Contribute to technical documentation
- Mentor junior team members
```

### Content Recommendations

#### Description Best Practices:
- Keep concise but comprehensive (2-4 paragraphs)
- Focus on purpose and impact
- Explain key relationships
- Note reporting structure
- Highlight career path

#### Responsibilities Best Practices:
- Use bullet points for clarity
- Start with action verbs
- Be specific and measurable
- Prioritize key duties
- Include both technical and soft skills
- Mention tools and technologies

### Designation Documentation Examples

#### Example 1: Software Engineer
```
Description:
Software Engineers design, develop, test, and maintain software
applications. Working in Agile teams, they translate business
requirements into technical solutions while ensuring code quality
and best practices.

Responsibilities:
- Develop and maintain web applications
- Write unit and integration tests
- Participate in sprint planning and reviews
- Perform code reviews
- Document technical specifications
- Collaborate with QA team
```

#### Example 2: HR Manager
```
Description:
The HR Manager oversees all human resource functions including
recruitment, employee relations, benefits administration, and
compliance. This role ensures alignment between HR practices
and organizational goals.

Responsibilities:
- Manage recruitment and onboarding processes
- Handle employee relations and conflict resolution
- Administer benefits and compensation programs
- Ensure regulatory compliance
- Develop HR policies and procedures
- Conduct performance management
- Lead training and development initiatives
```

### Usage in System

#### Job Postings:
- Auto-populate job advertisements
- Provide clear role expectations
- Attract qualified candidates

#### Employee Onboarding:
- Clarify role expectations
- Set performance standards
- Guide training programs

#### Performance Management:
- Define success criteria
- Guide performance reviews
- Identify development areas

#### Organizational Planning:
- Clarify role boundaries
- Prevent overlapping responsibilities
- Support workforce planning

### Expected Outcome
- Comprehensive designation documentation
- Clear communication of role expectations
- Support for HR processes

### Verification Checklist
- [ ] description field added to model
- [ ] Field allows null and blank values
- [ ] responsibilities field added to model
- [ ] Field allows null and blank values
- [ ] Both fields are TextField type

---

## Task 21: Add Designation Department FK

### Overview
Add an optional foreign key to the Department model to associate designations with specific departments. This link supports department-specific job positions while allowing organization-wide designations.

### Dependencies
- Task 18: Create Designation Model Core
- Department model exists (from Group A)

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add department foreign key field**
   - ForeignKey pointing to Department model
   - Optional field (null=True, blank=True)
   - Set on_delete behavior
   - Add related_name for reverse queries

3. **Configure on_delete behavior**
   - Use SET_NULL for on_delete
   - When department is deleted/archived, designation remains
   - Allows designation to exist independently
   - Designation becomes organization-wide if department removed

4. **Set related_name**
   - Use 'designations' or 'department_designations'
   - Enables accessing designations from department
   - Example: department.designations.all()

5. **Add help_text**
   - Explain optional department link
   - Note: null means organization-wide designation

### Department Field Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Field Type | ForeignKey('Department') | Links to Department |
| Null | True | Not all designations tied to department |
| Blank | True | Optional in forms |
| on_delete | SET_NULL | Preserve designation if department removed |
| related_name | 'designations' | Reverse relationship |

### Designation-Department Relationship Types

#### Type 1: Department-Specific Designation
```
Designation: "Sales Executive"
Department: Sales Department
Usage: Only in Sales Department
```

#### Type 2: Organization-Wide Designation
```
Designation: "Manager"
Department: (none)
Usage: Any department can use
```

#### Type 3: Cross-Department Designation
```
Designation: "Software Engineer"
Department: (none)
Usage: IT, R&D, or other tech departments
```

### Relationship Examples

#### Example 1: Department-Specific
```
Department: Human Resources
Designations:
- HR Manager (level: MANAGER)
- HR Officer (level: MID)
- HR Assistant (level: JUNIOR)
- Recruitment Specialist (level: MID)
```

#### Example 2: Organization-Wide
```
Department: (none)
Designations:
- Chief Executive Officer (level: EXECUTIVE)
- Chief Operating Officer (level: EXECUTIVE)
- Manager (level: MANAGER)
- Team Lead (level: LEAD)
```

#### Example 3: Mixed Approach
```
Sales Department:
- Sales Director (department-specific)
- Sales Manager (department-specific)
- Sales Executive (department-specific)
- Manager (organization-wide, can be used here)
```

### Use Cases

#### Department-Specific Designations:
**When to Use:**
- Role exists only in specific department
- Department-unique responsibilities
- Specialized positions

**Examples:**
- "Sales Representative" (Sales only)
- "Payroll Specialist" (Finance only)
- "Network Administrator" (IT only)

#### Organization-Wide Designations:
**When to Use:**
- Generic roles used across departments
- Leadership positions
- Common support roles

**Examples:**
- "Manager" (any department)
- "Team Lead" (any department)
- "Specialist" (various departments)

### Benefits of Optional Department Link

#### Flexibility:
- Support both specific and generic designations
- Easy designation reuse
- Simplified management

#### Scalability:
- Add new departments without recreating designations
- Share common roles
- Reduce duplication

#### Reporting:
- Designations by department
- Department staffing analysis
- Organization-wide role distribution

### Expected Outcome
- Flexible designation-department association
- Support for both specific and generic roles
- Foundation for organizational structure

### Verification Checklist
- [ ] department field added as ForeignKey
- [ ] Field points to Department model
- [ ] Field allows null and blank
- [ ] on_delete set to SET_NULL
- [ ] related_name set appropriately
- [ ] help_text added

---

## Task 22: Add Salary Range Fields

### Overview
Add salary range fields to the Designation model to define minimum and maximum salary expectations for each position. This supports compensation planning, budgeting, and ensures pay equity.

### Dependencies
- Task 18: Create Designation Model Core

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add min_salary field**
   - DecimalField for minimum salary
   - Max digits: 12
   - Decimal places: 2
   - Optional field (null=True, blank=True)
   - Positive values only

3. **Add max_salary field**
   - DecimalField for maximum salary
   - Max digits: 12
   - Decimal places: 2
   - Optional field (null=True, blank=True)
   - Positive values only
   - Should be greater than min_salary

4. **Add currency field**
   - CharField for currency code
   - Max length: 3 characters
   - Default: 'LKR' (Sri Lankan Rupee)
   - Follow ISO 4217 currency codes

5. **Add validation logic**
   - Ensure max_salary >= min_salary
   - Both positive values
   - Currency code validation

### Salary Range Field Details

| Field | Type | Config | Purpose |
|-------|------|--------|---------|
| min_salary | DecimalField | max_digits=12, decimal_places=2 | Minimum salary for position |
| max_salary | DecimalField | max_digits=12, decimal_places=2 | Maximum salary for position |
| currency | CharField | max_length=3, default='LKR' | Currency code (ISO 4217) |

### Salary Range Purpose

#### Compensation Planning:
- Define salary bands for positions
- Guide offer decisions
- Ensure internal equity
- Support budget planning

#### Recruitment:
- Set salary expectations
- Negotiate within approved range
- Attract qualified candidates
- Maintain competitiveness

#### Performance Management:
- Guide salary increases
- Support promotion decisions
- Track position in range
- Identify compression issues

### Salary Range Examples by Level

#### ENTRY Level (1):
```
Designation: Trainee Developer
Min Salary: LKR 30,000
Max Salary: LKR 50,000
Range: 67% spread
```

#### JUNIOR Level (2):
```
Designation: Junior Developer
Min Salary: LKR 50,000
Max Salary: LKR 80,000
Range: 60% spread
```

#### MID Level (3):
```
Designation: Software Engineer
Min Salary: LKR 80,000
Max Salary: LKR 150,000
Range: 88% spread
```

#### SENIOR Level (4):
```
Designation: Senior Software Engineer
Min Salary: LKR 150,000
Max Salary: LKR 250,000
Range: 67% spread
```

#### LEAD Level (5):
```
Designation: Tech Lead
Min Salary: LKR 200,000
Max Salary: LKR 350,000
Range: 75% spread
```

#### MANAGER Level (6):
```
Designation: Engineering Manager
Min Salary: LKR 300,000
Max Salary: LKR 500,000
Range: 67% spread
```

#### DIRECTOR Level (7):
```
Designation: Engineering Director
Min Salary: LKR 500,000
Max Salary: LKR 1,000,000
Range: 100% spread
```

#### EXECUTIVE Level (8):
```
Designation: Chief Technology Officer
Min Salary: LKR 1,000,000
Max Salary: LKR 2,500,000
Range: 150% spread
```

### Salary Range Management

#### Range Spread:
```
Range Spread = (Max - Min) / Min × 100%

Example:
Min: 100,000
Max: 150,000
Spread: 50%

Typical Spreads:
- Entry/Junior: 40-60%
- Mid/Senior: 50-80%
- Lead/Manager: 60-100%
- Director/Executive: 100%+
```

#### Position in Range:
```
Position = (Current Salary - Min) / (Max - Min) × 100%

Example:
Min: 100,000
Current: 125,000
Max: 150,000
Position: 50% (midpoint)

Guidelines:
- 0-33%: Below midpoint
- 34-66%: At midpoint
- 67-100%: Above midpoint
```

### Salary Validation Rules

#### Business Rules:
- max_salary must be >= min_salary
- Both values must be positive
- Currency must be valid ISO code
- Ranges should align with market
- Review annually for adjustments

#### Warning Conditions:
- Employee salary < min_salary (underpaid)
- Employee salary > max_salary (overpaid)
- Range too narrow (< 30%)
- Range too wide (> 150%)

### Currency Support

#### Primary Currency (LKR):
- Default for Sri Lankan operations
- All local salary transactions
- Budgeting and reporting

#### Multi-Currency Support:
- Support international positions
- Expatriate compensation
- Regional operations
- Currency conversion needed

### Expected Outcome
- Complete salary range tracking
- Support for compensation planning
- Foundation for pay equity

### Verification Checklist
- [ ] min_salary field added (DecimalField)
- [ ] Field configured: max_digits=12, decimal_places=2
- [ ] Field allows null and blank
- [ ] max_salary field added (DecimalField)
- [ ] Field configured: max_digits=12, decimal_places=2
- [ ] Field allows null and blank
- [ ] currency field added (CharField, 3)
- [ ] currency default set to 'LKR'
- [ ] Validation logic considered

---

## Task 23: Add Designation Requirements

### Overview
Add fields to capture position requirements including qualifications and required years of experience. These fields guide recruitment, performance management, and career development.

### Dependencies
- Task 18: Create Designation Model Core

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add qualifications field**
   - TextField for educational and professional qualifications
   - Optional field (blank=True, null=True)
   - Multi-line text support
   - List required degrees, certifications, skills

3. **Add experience_years field**
   - IntegerField or DecimalField for years of experience
   - Optional field (blank=True, null=True)
   - Positive values only
   - Minimum required experience

4. **Add help_text**
   - Explain qualification expectations
   - Note experience requirements

### Requirements Field Details

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| qualifications | TextField | optional | Educational and professional requirements |
| experience_years | IntegerField | optional, positive | Minimum years of experience required |

### Field Usage Guidelines

#### Qualifications Field:
- Educational requirements (degrees, diplomas)
- Professional certifications
- Technical skills
- Soft skills
- Language requirements
- Used in job postings and hiring

Example content:
```
Required:
- Bachelor's degree in Computer Science or related field
- Strong programming skills in Python and JavaScript
- Experience with Django framework
- Knowledge of SQL databases
- Excellent problem-solving abilities

Preferred:
- Master's degree in Computer Science
- AWS certification
- Experience with React.js
- Agile/Scrum experience
```

#### Experience Years Field:
- Minimum years of relevant experience
- Industry experience expectations
- Used for candidate screening
- Guides salary positioning in range

### Requirements by Designation Level

#### ENTRY Level (0-1 years):
```
Qualifications:
- Fresh graduates welcome
- Bachelor's degree in relevant field
- Internship experience (plus)
- Basic technical skills

Experience: 0-1 years
```

#### JUNIOR Level (1-2 years):
```
Qualifications:
- Bachelor's degree required
- Demonstrated foundational skills
- Some project experience
- Willingness to learn

Experience: 1-2 years
```

#### MID Level (2-5 years):
```
Qualifications:
- Bachelor's degree required
- Proven track record
- Strong technical skills
- Independent work capability

Experience: 2-5 years
```

#### SENIOR Level (5-8 years):
```
Qualifications:
- Bachelor's or Master's degree
- Expert-level skills
- Mentoring capability
- Strategic thinking

Experience: 5-8 years
```

#### LEAD Level (7-10 years):
```
Qualifications:
- Bachelor's or Master's degree
- Leadership experience
- Technical expertise
- Project management skills

Experience: 7-10 years
```

#### MANAGER Level (10+ years):
```
Qualifications:
- Bachelor's or Master's degree
- Management experience
- Strategic planning skills
- People management

Experience: 10+ years
```

#### DIRECTOR Level (12+ years):
```
Qualifications:
- Master's degree preferred
- Senior leadership experience
- Department management
- Business acumen

Experience: 12+ years
```

#### EXECUTIVE Level (15+ years):
```
Qualifications:
- Master's degree or MBA preferred
- C-level experience
- Strategic vision
- Industry expertise

Experience: 15+ years
```

### Designation Requirements Examples

#### Example 1: Software Engineer (MID Level)
```
Qualifications:
- Bachelor's degree in Computer Science
- 3+ years software development experience
- Proficiency in Python, Django, PostgreSQL
- Experience with REST APIs
- Version control (Git)
- Agile methodology familiarity

Experience Years: 3

Salary Range: LKR 80,000 - 150,000
```

#### Example 2: HR Manager (MANAGER Level)
```
Qualifications:
- Bachelor's degree in HR, Business Administration
- CIPD or CHRM certification preferred
- 8+ years HR experience with 3+ years in management
- Strong knowledge of Sri Lankan labor law
- HRIS system experience
- Excellent interpersonal skills

Experience Years: 8

Salary Range: LKR 200,000 - 350,000
```

#### Example 3: Chief Technology Officer (EXECUTIVE Level)
```
Qualifications:
- Master's degree in Computer Science or MBA
- 15+ years in technology leadership
- Proven track record in software development
- Strategic planning and vision
- P&L management experience
- Excellent communication skills

Experience Years: 15

Salary Range: LKR 1,000,000 - 2,500,000
```

### Usage in System

#### Recruitment:
- Define candidate requirements
- Screen applications
- Guide interview process
- Set realistic expectations

#### Career Development:
- Identify skill gaps
- Plan training programs
- Guide promotion decisions
- Create development plans

#### Performance Management:
- Set role expectations
- Evaluate qualifications
- Identify development needs
- Plan succession

### Expected Outcome
- Clear position requirements
- Support for recruitment process
- Foundation for career development

### Verification Checklist
- [ ] qualifications field added (TextField)
- [ ] Field allows null and blank
- [ ] experience_years field added (IntegerField)
- [ ] Field allows null and blank
- [ ] Positive value validation considered
- [ ] help_text added to both fields

---

## Task 24: Add Reports To Field

### Overview
Add a self-referential foreign key to establish reporting relationships between designations. This creates a designation hierarchy that defines which positions report to which other positions.

### Dependencies
- Task 18: Create Designation Model Core

### Instructions

1. **Open designation.py model file**
   - Navigate to `apps/organization/models/designation.py`
   - Locate the Designation model class

2. **Add reports_to foreign key field**
   - ForeignKey pointing to 'self'
   - Optional field (null=True, blank=True)
   - Set on_delete behavior
   - Add related_name for reverse queries

3. **Configure on_delete behavior**
   - Use SET_NULL for on_delete
   - When senior designation deleted, reporting link removed
   - Prevents cascading deletions
   - Allows reorganization flexibility

4. **Set related_name**
   - Use 'subordinate_designations' or 'direct_reports'
   - Enables accessing reporting designations
   - Example: designation.direct_reports.all()

5. **Add help_text**
   - Explain reporting relationship
   - Note: null means top-level position

### Reports To Field Configuration

| Aspect | Value | Reason |
|--------|-------|--------|
| Field Type | ForeignKey('self') | Self-referential relationship |
| Null | True | Top positions have no superior |
| Blank | True | Optional in forms |
| on_delete | SET_NULL | Preserve designation if superior removed |
| related_name | 'direct_reports' | Access subordinate designations |

### Designation Reporting Hierarchy

#### Top-Level Positions:
```
reports_to = null

Examples:
- CEO (reports to: null / Board of Directors)
- COO (reports to: CEO)
- CFO (reports to: CEO)
- CTO (reports to: CEO)
```

#### Management Hierarchy:
```
CEO (reports_to: null)
├── COO (reports_to: CEO)
│   ├── Operations Manager (reports_to: COO)
│   │   └── Operations Officer (reports_to: Operations Manager)
│   └── Logistics Manager (reports_to: COO)
├── CFO (reports_to: CEO)
│   ├── Finance Manager (reports_to: CFO)
│   │   ├── Senior Accountant (reports_to: Finance Manager)
│   │   └── Accountant (reports_to: Finance Manager)
│   └── Treasury Manager (reports_to: CFO)
└── CTO (reports_to: CEO)
    ├── Engineering Manager (reports_to: CTO)
    │   ├── Tech Lead (reports_to: Engineering Manager)
    │   │   ├── Senior Developer (reports_to: Tech Lead)
    │   │   └── Developer (reports_to: Tech Lead)
    │   └── Junior Developer (reports_to: Engineering Manager)
    └── QA Manager (reports_to: CTO)
```

### Reporting Relationship Examples

#### Example 1: Engineering Department
```
CTO (level: EXECUTIVE, reports_to: CEO)
└── Engineering Manager (level: MANAGER, reports_to: CTO)
    ├── Tech Lead (level: LEAD, reports_to: Engineering Manager)
    │   ├── Senior Developer (level: SENIOR, reports_to: Tech Lead)
    │   ├── Developer (level: MID, reports_to: Tech Lead)
    │   └── Junior Developer (level: JUNIOR, reports_to: Tech Lead)
    └── QA Engineer (level: MID, reports_to: Engineering Manager)
```

#### Example 2: Sales Department
```
Sales Director (level: DIRECTOR, reports_to: COO)
└── Sales Manager (level: MANAGER, reports_to: Sales Director)
    ├── Senior Sales Executive (level: SENIOR, reports_to: Sales Manager)
    ├── Sales Executive (level: MID, reports_to: Sales Manager)
    └── Sales Associate (level: JUNIOR, reports_to: Sales Manager)
```

### Designation vs. Employee Reporting

#### Designation Reporting (This Task):
- Defines organizational structure
- Shows how positions relate
- Generic reporting relationships
- Template for employee reporting

Example:
```
Designation: "Developer"
Reports To: "Tech Lead" (designation)
```

#### Employee Reporting (Future):
- Actual person-to-person reporting
- Specific manager assignment
- Individual relationships
- Based on designation structure

Example:
```
Employee: "John Smith" (Developer)
Reports To: "Jane Doe" (Tech Lead)
```

### Reporting Hierarchy Benefits

#### Organizational Clarity:
- Clear authority lines
- Defined escalation path
- Structured decision-making
- Accountability framework

#### Approval Workflows:
- Expense approvals
- Leave requests
- Purchase requisitions
- Document approvals

#### Reporting:
- Organizational charts
- Span of control analysis
- Hierarchy visualization
- Leadership structure

### Validation Considerations

#### Business Rules:
- Cannot report to lower-level designation
- Cannot create circular reporting (A→B→A)
- Should align with level hierarchy
- Top executives typically report to null or CEO

#### Level-Based Validation:
```
General Rule:
reports_to.level >= self.level

Examples:
✓ Developer (MID) → Tech Lead (LEAD)
✓ Tech Lead (LEAD) → Manager (MANAGER)
✗ Manager (MANAGER) → Developer (MID) [Invalid]
```

### Expected Outcome
- Clear designation reporting hierarchy
- Foundation for organizational structure
- Support for approval workflows

### Verification Checklist
- [ ] reports_to field added as ForeignKey('self')
- [ ] Field allows null and blank
- [ ] on_delete set to SET_NULL
- [ ] related_name set appropriately
- [ ] help_text added
- [ ] Circular reference prevention considered

---

## Summary

This document established the core Designation model with comprehensive attributes:

1. **DesignationLevel Choices** - 8-level seniority hierarchy
2. **Core Model** - title and code fields
3. **Level Field** - Seniority classification
4. **Description Fields** - Position overview and responsibilities
5. **Department Link** - Optional department association
6. **Salary Ranges** - Min/max salary and currency
7. **Requirements** - Qualifications and experience
8. **Reporting Hierarchy** - Reports to relationship

The Designation model now has comprehensive functionality for job position management, compensation planning, and organizational hierarchy.
