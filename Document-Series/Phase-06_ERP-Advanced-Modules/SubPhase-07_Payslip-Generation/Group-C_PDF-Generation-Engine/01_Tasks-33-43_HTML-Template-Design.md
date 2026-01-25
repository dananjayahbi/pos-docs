# Tasks 33-43: WeasyPrint Installation and HTML Template Design

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** C - PDF Generation Engine  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-44-48_Generator-Service.md](02_Tasks-44-48_Generator-Service.md)

---

## Document Overview

This document covers the installation of WeasyPrint PDF generation library and the design of the HTML template for Sri Lankan payslip generation. The template includes company header, employee details, pay period information, earnings, deductions, summary sections, year-to-date totals, employer contributions (EPF/ETF), and footer information.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Install WeasyPrint Package | Low | 15 min |
| 34 | Create HTML Template Base | Medium | 25 min |
| 35 | Design Template Header Section | Medium | 25 min |
| 36 | Design Employee Details Section | Medium | 20 min |
| 37 | Design Pay Period Section | Low | 15 min |
| 38 | Design Earnings Table Section | Medium | 25 min |
| 39 | Design Deductions Table Section | Medium | 20 min |
| 40 | Design Summary Section | Medium | 20 min |
| 41 | Design YTD Section | Medium | 20 min |
| 42 | Design Employer Contrib Section | Low | 15 min |
| 43 | Design Footer Section | Low | 15 min |

---

## Task 33: Install WeasyPrint Package

### Overview
Install WeasyPrint, a Python library that converts HTML and CSS to PDF documents. WeasyPrint is specifically designed for high-quality PDF generation from web technologies and supports CSS Paged Media specifications, making it ideal for generating professional payslip documents.

### Dependencies
- Python 3.8 or higher
- pip package manager
- Django project with requirements.txt
- Docker environment (for containerized deployment)

### Instructions

1. **Review WeasyPrint requirements**
   - Verify Python version compatibility (3.8+)
   - Review system-level dependencies
   - Consider Docker environment needs

2. **Add WeasyPrint to requirements.txt**
   - Open project's `requirements.txt` file
   - Add `weasyprint==60.2` (or latest stable version)
   - Include version pinning for stability

3. **Add system dependencies documentation**
   - Document Linux system dependencies needed
   - Note Debian/Ubuntu package names
   - Reference Alpine Linux packages for Docker

4. **Update Docker configuration (if applicable)**
   - Add system dependencies to Dockerfile
   - Install libpango, libcairo, libgdk-pixbuf2
   - Add font packages for proper rendering

5. **Install locally for development**
   - Run pip install in development environment
   - Verify installation completes successfully
   - Test WeasyPrint import

6. **Create installation verification script**
   - Create simple test to verify WeasyPrint works
   - Test HTML to PDF conversion
   - Validate font rendering

### System Dependencies

#### Debian/Ubuntu Linux
```
libpango-1.0-0
libpangocairo-1.0-0
libgdk-pixbuf2.0-0
libffi-dev
shared-mime-info
```

#### Alpine Linux (Docker)
```
pango
cairo
gdk-pixbuf
libffi-dev
```

### Docker Configuration Notes

| Aspect | Consideration |
|--------|---------------|
| Base Image | Use python:3.11-slim or alpine |
| Build Time | Add 30-60 seconds for dependencies |
| Image Size | Additional ~100MB for libraries |
| Fonts | Install DejaVu fonts for Unicode support |
| Caching | Layer system deps before Python deps |

### WeasyPrint Features

| Feature | Benefit for Payslips |
|---------|---------------------|
| CSS Paged Media | Professional page breaks |
| Unicode Support | Sinhala/Tamil names and text |
| Table Rendering | Clean earnings/deductions tables |
| Font Embedding | Consistent appearance across systems |
| Image Support | Company logos in headers |
| Print Optimization | High-quality PDF output |

### Font Installation

#### Linux Font Packages
```
fonts-dejavu-core         # Standard Unicode fonts
fonts-liberation          # Liberation fonts
fonts-noto-core           # Noto fonts (multi-language)
```

#### Custom Sri Lankan Fonts
- Consider Noto Sans Sinhala for Sinhala text
- Noto Sans Tamil for Tamil text
- FreeSerif for fallback coverage

### Expected Outcome
- WeasyPrint successfully installed in environment
- System dependencies properly configured
- Docker image includes required libraries
- Basic HTML to PDF conversion working
- Font rendering functional

### Verification Checklist
- [ ] `weasyprint` added to requirements.txt
- [ ] Version pinned appropriately
- [ ] System dependencies documented
- [ ] Dockerfile updated (if using Docker)
- [ ] Local installation completed
- [ ] Import test successful
- [ ] Basic PDF generation test passed
- [ ] Font rendering verified

### Testing Installation
Test that WeasyPrint can generate a basic PDF:
- Create simple HTML with text and table
- Call WeasyPrint to generate PDF
- Verify PDF opens correctly
- Check text and table rendering quality
- Validate Unicode character display (LKR symbol)

---

## Task 34: Create HTML Template Base

### Overview
Create the base HTML template structure for payslip generation. This template will use Django template syntax and be processed by WeasyPrint to generate PDF documents. The base establishes the document structure, metadata, and layout container for all payslip sections.

### Dependencies
- Task 33: Install WeasyPrint Package
- Django templates directory configured
- Payslip application structure exists

### Instructions

1. **Create templates directory structure**
   - Navigate to `apps/payslip/` directory
   - Create `templates/payslip/` subdirectory
   - This follows Django template conventions

2. **Create payslip_template.html file**
   - Create new file in templates/payslip/
   - This will be the main payslip template
   - Will render a single payslip record

3. **Add HTML5 DOCTYPE declaration**
   - Use `<!DOCTYPE html>` declaration
   - Ensures standards-compliant rendering
   - Required for proper WeasyPrint processing

4. **Create HTML root element**
   - Add `<html>` tag with lang attribute
   - Set lang="en" (or support dynamic language)
   - Closing `</html>` tag at document end

5. **Create HEAD section**
   - Add `<head>` element
   - Include charset meta tag (UTF-8)
   - Add viewport meta tag for consistency
   - Include title element with dynamic slip number

6. **Link CSS stylesheet**
   - Add `<link>` tag to external CSS file
   - Reference `payslip_styles.css` (Task 44)
   - Use static file template tag for Django

7. **Add print-specific meta tags**
   - Include PDF generation hints
   - Set print color adjustment
   - Configure print background rendering

8. **Create BODY section**
   - Add `<body>` element
   - Create main container div with class "payslip"
   - This will hold all payslip content sections

9. **Add template comments**
   - Add Django template comments for each section
   - Mark where each section will be inserted
   - Helps with template organization

10. **Create section placeholder structure**
    - Add empty divs for each major section
    - Use semantic class names
    - Prepare for content insertion in subsequent tasks

### Template Directory Structure
```
apps/payslip/
├── templates/
│   └── payslip/
│       ├── payslip_template.html    # Main template (this task)
│       └── payslip_styles.css       # CSS file (Task 44)
└── services/
    └── generator.py                  # Generator service
```

### HTML Document Structure
```
<!DOCTYPE html>
<html>
  |
  ├── <head>
  │     ├── <meta charset>
  │     ├── <meta viewport>
  │     ├── <title>
  │     └── <link stylesheet>
  │
  └── <body>
        └── <div class="payslip">
              ├── <!-- Header Section -->
              ├── <!-- Employee Details Section -->
              ├── <!-- Pay Period Section -->
              ├── <!-- Earnings Table Section -->
              ├── <!-- Deductions Table Section -->
              ├── <!-- Summary Section -->
              ├── <!-- YTD Section -->
              ├── <!-- Employer Contributions Section -->
              └── <!-- Footer Section -->
```

### HTML Template Layout
```
╔═══════════════════════════════════════════════════════════════════╗
║                         HTML DOCUMENT                              ║
╠═══════════════════════════════════════════════════════════════════╣
║  HEAD SECTION                                                      ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │ Meta: charset, viewport                                     │  ║
║  │ Title: Payslip - {{ slip_number }}                         │  ║
║  │ Link: payslip_styles.css                                   │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
╠═══════════════════════════════════════════════════════════════════╣
║  BODY SECTION                                                      ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │ <div class="payslip">                                       │  ║
║  │   ┌─────────────────────────────────────────────────────┐   │  ║
║  │   │ Section placeholders (Tasks 35-43)                  │   │  ║
║  │   │ - Header                                            │   │  ║
║  │   │ - Employee Details                                  │   │  ║
║  │   │ - Pay Period                                        │   │  ║
║  │   │ - Earnings Table                                    │   │  ║
║  │   │ - Deductions Table                                  │   │  ║
║  │   │ - Summary                                           │   │  ║
║  │   │ - YTD (if applicable)                               │   │  ║
║  │   │ - Employer Contributions (if applicable)            │   │  ║
║  │   │ - Footer                                            │   │  ║
║  │   └─────────────────────────────────────────────────────┘   │  ║
║  │ </div>                                                      │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Meta Tag Configuration

| Meta Tag | Value | Purpose |
|----------|-------|---------|
| charset | utf-8 | Unicode support (LKR, Sinhala, Tamil) |
| viewport | width=device-width | Responsive foundation |
| print-color-adjust | exact | Preserve colors in PDF |
| -webkit-print-color-adjust | exact | Webkit print colors |

### Django Template Context

The template will receive context variables from PayslipGenerator service:

| Variable | Type | Description |
|----------|------|-------------|
| company | dict | Company information (name, logo, address) |
| employee | dict | Employee details (name, ID, department) |
| period | dict | Pay period information |
| earnings | list | Earnings line items |
| deductions | list | Deduction line items |
| summary | dict | Gross, deductions, net totals |
| ytd | dict | Year-to-date totals (optional) |
| employer_contributions | list | EPF/ETF contributions (optional) |
| slip_number | str | Payslip reference number |
| generated_at | datetime | PDF generation timestamp |

### Template Design Principles

| Principle | Implementation |
|-----------|----------------|
| Print-First | Design for PDF output, not screen |
| Table-Based Layout | Use tables instead of flexbox/grid |
| Fixed Dimensions | Use cm/mm units for precision |
| Font Fallbacks | Specify multiple font families |
| Color Contrast | Ensure readability in print |
| Page Breaks | Control pagination with CSS |

### WeasyPrint Compatibility Notes

#### Supported CSS Features
- Basic box model (margin, padding, border)
- Positioning (static, relative, absolute)
- Tables and table layout
- Float and clear
- CSS Paged Media (@page rules)
- Print media queries

#### Unsupported/Limited Features
- Flexbox (limited support)
- CSS Grid (not supported)
- Transform animations (static only)
- Web fonts (use system fonts or embed)
- Complex selectors (basic support)

### Expected Outcome
- Valid HTML5 document structure
- Proper DOCTYPE and meta tags
- Link to external CSS stylesheet
- Main container div for content
- Template ready for section insertion
- Django template syntax compatibility
- WeasyPrint-compatible structure

### Verification Checklist
- [ ] `templates/payslip/` directory created
- [ ] `payslip_template.html` file created
- [ ] DOCTYPE declaration present
- [ ] HTML root element with lang attribute
- [ ] HEAD section with meta tags
- [ ] UTF-8 charset specified
- [ ] Title tag with dynamic slip number
- [ ] CSS stylesheet link present
- [ ] BODY section created
- [ ] Main payslip container div added
- [ ] Section placeholders added
- [ ] Django template comments included
- [ ] Valid HTML structure verified

---

## Task 35: Design Template Header Section

### Overview
Design the header section of the payslip template, which displays company information, logo, payslip title, and reference details. This section provides professional branding and document identification at the top of each payslip.

### Dependencies
- Task 34: Create HTML Template Base
- Company model with logo and address fields
- Static file configuration for logo display

### Instructions

1. **Create header container div**
   - Add `<div class="payslip-header">` inside main payslip div
   - This will contain all header elements
   - Use semantic class naming

2. **Add company logo container**
   - Create `<div class="company-logo">` element
   - Add `<img>` tag with Django template variable
   - Use `{{ company.logo_url }}` for logo source
   - Add alt text for accessibility

3. **Create company info container**
   - Add `<div class="company-info">` element
   - Will contain company name and address
   - Center-aligned for professional appearance

4. **Add company name**
   - Use `<h1>` tag with class "company-name"
   - Display `{{ company.name }}` template variable
   - Primary heading for the document

5. **Add company address lines**
   - Use `<p>` tags for each address component
   - Display `{{ company.address_line1 }}`
   - Display `{{ company.address_line2 }}`
   - Display `{{ company.city }}` and postal code

6. **Add contact information**
   - Display phone number if available
   - Display email if available
   - Use conditional template tags for optional fields

7. **Create payslip title container**
   - Add `<div class="payslip-title">` element
   - Large, prominent "PAYSLIP" text
   - Use `<h2>` tag with styling class

8. **Add period name display**
   - Show pay period name (e.g., "January 2026")
   - Use `{{ period.name }}` template variable
   - Subtitle style beneath main title

9. **Create slip reference container**
   - Add `<div class="slip-reference">` element
   - Display slip number with label
   - Format: "Slip No: PAY-2026-01-001"

10. **Add horizontal separator**
    - Insert `<hr>` or styled div as separator
    - Visual break between header and content
    - Use subtle border or line

### Header Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         HEADER SECTION                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ╔════╗                                                          ┃
┃  ║LOGO║  LANKA COMMERCE (PRIVATE) LIMITED                       ┃
┃  ╚════╝  123, Galle Road, Colombo 03                            ┃
┃          Tel: +94 11 234 5678                                   ┃
┃          Email: info@lankacommerce.lk                           ┃
┃                                                                  ┃
┃                          PAYSLIP                                ┃
┃                      January 2026                               ┃
┃                                                                  ┃
┃                  Slip No: PAY-2026-01-001                       ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Header Components Breakdown

#### Company Logo Section
```
┌────────────┐
│            │
│   [LOGO]   │  ← Logo image (max height: 60px)
│            │
└────────────┘
```

#### Company Information Section
```
═══════════════════════════════════════════════
   LANKA COMMERCE (PRIVATE) LIMITED           ← Company name (bold, large)
   123, Galle Road, Colombo 03                ← Address line 1
   Sri Lanka                                  ← Address line 2
   Tel: +94 11 234 5678                       ← Phone number
   Email: info@lankacommerce.lk               ← Email address
═══════════════════════════════════════════════
```

#### Payslip Title Section
```
╔═══════════════════════════════════════════╗
║                                           ║
║            P A Y S L I P                  ║  ← Large, prominent title
║                                           ║
║           January 2026                    ║  ← Pay period name
║                                           ║
╚═══════════════════════════════════════════╝
```

#### Slip Reference Section
```
┌───────────────────────────────────────────┐
│   Slip No: PAY-2026-01-001                │  ← Unique reference number
└───────────────────────────────────────────┘
```

### Django Template Variables

| Variable | Data Type | Example Value | Required |
|----------|-----------|---------------|----------|
| company.logo_url | URL/Path | /media/logos/company_logo.png | Optional |
| company.name | String | Lanka Commerce (Private) Limited | Yes |
| company.address_line1 | String | 123, Galle Road | Yes |
| company.address_line2 | String | Colombo 03 | Optional |
| company.city | String | Colombo | Yes |
| company.postal_code | String | 00300 | Optional |
| company.phone | String | +94 11 234 5678 | Optional |
| company.email | String | info@lankacommerce.lk | Optional |
| period.name | String | January 2026 | Yes |
| slip_number | String | PAY-2026-01-001 | Yes |

### CSS Classes for Header

| Class Name | Purpose |
|------------|---------|
| .payslip-header | Main header container |
| .company-logo | Logo image container |
| .company-info | Company details container |
| .company-name | Company name heading |
| .company-address | Address line styling |
| .payslip-title | "PAYSLIP" title text |
| .period-name | Pay period subtitle |
| .slip-reference | Slip number display |
| .header-separator | Divider line |

### Header Styling Guidelines

| Element | Styling Approach |
|---------|------------------|
| Logo | Fixed height (50-60px), maintain aspect ratio |
| Company Name | 18-20pt font, bold, uppercase or title case |
| Address | 9-10pt font, regular weight, center-aligned |
| Payslip Title | 24-28pt font, bold, uppercase, center-aligned |
| Period Name | 12-14pt font, medium weight, center-aligned |
| Slip Number | 10pt font, right-aligned or center-aligned |
| Colors | Professional palette (navy, gray, black) |

### Logo Handling

#### Logo Display Scenarios

| Scenario | Implementation |
|----------|----------------|
| Logo exists | Display image with proper sizing |
| No logo | Show company name only, larger font |
| Logo load fails | Fallback to company initials or name |
| Logo too large | Scale down proportionally |

#### Logo Specifications
- Format: PNG with transparency or JPEG
- Maximum height: 60px (approx 2cm)
- Maximum width: 150px (approx 5cm)
- Resolution: 150-300 DPI for print quality
- File size: Under 500KB

### Conditional Content Display

Use Django template conditionals for optional fields:

| Field | Conditional Logic |
|-------|-------------------|
| Logo | Show if company.logo_url exists |
| Address Line 2 | Show if not empty |
| Postal Code | Show if provided |
| Phone | Show if provided |
| Email | Show if provided |

### Expected Outcome
- Professional header with company branding
- Clear payslip identification
- All company details displayed
- Logo properly positioned and sized
- Responsive to missing optional fields
- Clean visual hierarchy
- Print-friendly design

### Verification Checklist
- [ ] Header container div created
- [ ] Company logo element added with conditional display
- [ ] Company name displayed prominently
- [ ] Address lines properly structured
- [ ] Contact information included (if available)
- [ ] "PAYSLIP" title displayed
- [ ] Pay period name shown
- [ ] Slip number displayed with label
- [ ] Header separator added
- [ ] All template variables properly referenced
- [ ] Optional fields use conditional tags
- [ ] CSS classes applied consistently
- [ ] Visual hierarchy is clear

---

## Task 36: Design Employee Details Section

### Overview
Design the employee details section that displays comprehensive employee information including name, employee ID, department, designation, bank account details, EPF number, and other relevant employment information. This section appears below the header and provides essential employee identification for the payslip.

### Dependencies
- Task 35: Design Template Header Section
- Employee model with all required fields
- Department and designation reference data

### Instructions

1. **Create employee section container**
   - Add `<div class="employee-section">` below header
   - This contains all employee information
   - Use table or grid layout for alignment

2. **Add section heading**
   - Use `<h3>` tag with text "Employee Details"
   - Optional: can be visually hidden if layout is clear
   - Helps with document structure

3. **Create employee details table**
   - Use `<table class="employee-details">` element
   - Two-column layout: label and value
   - Clean, readable format

4. **Add employee name row**
   - Label: "Employee Name"
   - Value: `{{ employee.full_name }}`
   - First row for prominence

5. **Add employee ID row**
   - Label: "Employee ID"
   - Value: `{{ employee.employee_id }}`
   - Unique identifier for employee

6. **Add department row**
   - Label: "Department"
   - Value: `{{ employee.department }}`
   - Organizational unit information

7. **Add designation row**
   - Label: "Designation" or "Position"
   - Value: `{{ employee.designation }}`
   - Job title information

8. **Add date of joining row**
   - Label: "Date of Joining"
   - Value: `{{ employee.date_of_joining }}`
   - Format as DD-MMM-YYYY (e.g., 15-May-2023)

9. **Add bank account details row**
   - Label: "Bank Account"
   - Value: `{{ employee.bank_name }} - {{ employee.account_number_masked }}`
   - Show masked account number for security

10. **Add EPF number row**
    - Label: "EPF No"
    - Value: `{{ employee.epf_number }}`
    - Important for Sri Lankan payroll

11. **Add employment type row (optional)**
    - Label: "Employment Type"
    - Value: `{{ employee.employment_type }}`
    - Show if relevant (Permanent, Contract, etc.)

12. **Add location/branch row (optional)**
    - Label: "Work Location"
    - Value: `{{ employee.location }}`
    - Show if multi-location company

### Employee Details Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    EMPLOYEE DETAILS SECTION                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌────────────────────────────┬────────────────────────────┐    ┃
┃  │ Employee Name              │ John Doe                   │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ Employee ID                │ EMP-0001                   │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ Department                 │ Engineering                │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ Designation                │ Senior Software Engineer   │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ Date of Joining            │ 15-May-2023                │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ Bank Account               │ Bank of Ceylon - ****1234  │    ┃
┃  ├────────────────────────────┼────────────────────────────┤    ┃
┃  │ EPF No                     │ EP/123456/2023             │    ┃
┃  └────────────────────────────┴────────────────────────────┘    ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Two-Column Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  Label Column (35%)         │  Value Column (65%)           │
├─────────────────────────────┼───────────────────────────────┤
│  Employee Name              │  John Doe                     │
│  Employee ID                │  EMP-0001                     │
│  Department                 │  Engineering                  │
│  Designation                │  Senior Software Engineer     │
│  Date of Joining            │  15-May-2023                  │
│  Bank Account               │  Bank of Ceylon - ****1234    │
│  EPF No                     │  EP/123456/2023               │
└─────────────────────────────┴───────────────────────────────┘
```

### Compact Grid Layout Alternative
```
╔═══════════════════════════════════════════════════════════════╗
║  Employee Name: John Doe                 Employee ID: EMP-0001║
║  Department: Engineering                 Designation: Sr. Eng.║
║  Date of Joining: 15-May-2023           Bank: BOC - ****1234 ║
║  EPF No: EP/123456/2023                                       ║
╚═══════════════════════════════════════════════════════════════╝
```

### Django Template Variables

| Variable | Data Type | Example Value | Required |
|----------|-----------|---------------|----------|
| employee.full_name | String | John Doe | Yes |
| employee.employee_id | String | EMP-0001 | Yes |
| employee.department | String | Engineering | Yes |
| employee.designation | String | Senior Software Engineer | Yes |
| employee.date_of_joining | Date | 2023-05-15 | Yes |
| employee.bank_name | String | Bank of Ceylon | Optional |
| employee.account_number_masked | String | ****1234 | Optional |
| employee.epf_number | String | EP/123456/2023 | Yes |
| employee.employment_type | String | Permanent | Optional |
| employee.location | String | Head Office - Colombo | Optional |

### EPF Number Format

Sri Lankan EPF numbers follow specific patterns:

| Format Component | Description | Example |
|------------------|-------------|---------|
| Prefix | EP/ or EPF/ | EP/ |
| Reference Number | 6-8 digit number | 123456 |
| Year Suffix | Year of registration (optional) | /2023 |
| Full Format | EP/NNNNNN/YYYY | EP/123456/2023 |

### Bank Account Display

#### Security Considerations
- Never display full account number
- Show only last 4 digits
- Mask remaining digits with asterisks
- Format: Bank Name - ****NNNN

#### Bank Display Examples
```
Bank of Ceylon - ****1234
Commercial Bank - ****5678
Sampath Bank - ****9012
People's Bank - ****3456
```

### Date Formatting

| Date Field | Format | Example |
|------------|--------|---------|
| Date of Joining | DD-MMM-YYYY | 15-May-2023 |
| Alternative | DD/MM/YYYY | 15/05/2023 |
| Database | YYYY-MM-DD | 2023-05-15 |

### Employment Types (Sri Lankan Context)

| Employment Type | Description |
|----------------|-------------|
| Permanent | Regular full-time employee with EPF/ETF |
| Contract | Fixed-term contract employee |
| Temporary | Short-term temporary worker |
| Probationary | Employee on probation period |
| Trainee | Training program participant |

### CSS Classes for Employee Section

| Class Name | Purpose |
|------------|---------|
| .employee-section | Main container for employee details |
| .employee-details | Table element for information |
| .employee-label | Label cell styling |
| .employee-value | Value cell styling |
| .employee-name | Employee name (can be emphasized) |
| .employee-id | Employee ID styling |
| .employee-row | Individual row styling |

### Table Structure Guidelines

| Aspect | Recommendation |
|--------|---------------|
| Border Style | Light borders (1px) or no borders |
| Cell Padding | 8-10px for comfortable reading |
| Label Alignment | Left-aligned or right-aligned |
| Value Alignment | Left-aligned |
| Font Size | 9-10pt for labels and values |
| Label Weight | Medium or semi-bold |
| Background | Alternating row colors (optional) |

### Responsive Field Display

Handle optional fields gracefully:

| Condition | Display Behavior |
|-----------|------------------|
| Bank details present | Show full row with bank and account |
| Bank details missing | Omit row entirely |
| Location present | Show location row |
| Location not relevant | Omit row |
| Employment type standard | Can omit if always "Permanent" |
| Multiple employment types | Show employment type |

### Data Validation Display

| Field | Validation Visual Indicator |
|-------|----------------------------|
| EPF Number | Format: EP/NNNNNN/YYYY |
| Employee ID | Consistent format per company |
| Bank Account | Always masked for security |
| Date of Joining | Formatted for readability |

### Expected Outcome
- Clear display of employee information
- Professional two-column or grid layout
- All essential details visible
- Bank account security maintained
- EPF number prominently displayed
- Clean, readable typography
- Print-friendly table structure

### Verification Checklist
- [ ] Employee section container created
- [ ] Employee name displayed
- [ ] Employee ID shown
- [ ] Department displayed
- [ ] Designation shown
- [ ] Date of joining formatted properly
- [ ] Bank account details included (masked)
- [ ] EPF number displayed
- [ ] Optional fields use conditionals
- [ ] Table structure is clean and aligned
- [ ] CSS classes applied correctly
- [ ] Two-column layout implemented
- [ ] All template variables properly referenced
- [ ] Security considerations followed (masked account)

---

## Task 37: Design Pay Period Section

### Overview
Design the pay period section that displays the salary period dates, payment date, working days information, and overtime hours. This section provides temporal context for the payslip and shows attendance-related calculations.

### Dependencies
- Task 36: Design Employee Details Section
- Payslip model with period and attendance fields
- Working days calculation logic

### Instructions

1. **Create period section container**
   - Add `<div class="period-section">` below employee section
   - Contains all pay period information
   - Clear visual separation from other sections

2. **Add section heading**
   - Use `<h3>` tag with text "Pay Period"
   - Optional heading if layout is self-explanatory
   - Maintains document structure

3. **Create period details table**
   - Use `<table class="period-details">` element
   - Two or four-column layout
   - Balance information density

4. **Add pay period dates row**
   - Label: "Pay Period"
   - Value: `{{ period.start_date }} - {{ period.end_date }}`
   - Format as DD-MMM-YYYY (e.g., 01-Jan-2026 - 31-Jan-2026)

5. **Add payment date row**
   - Label: "Payment Date"
   - Value: `{{ period.pay_date }}`
   - Date when salary is paid
   - Format consistently with period dates

6. **Add total working days row**
   - Label: "Total Working Days"
   - Value: `{{ period.total_working_days }}`
   - Number of workable days in period

7. **Add actual days worked row**
   - Label: "Days Worked"
   - Value: `{{ period.days_worked }}`
   - Actual attendance days

8. **Add absent days row (optional)**
   - Label: "Absent Days"
   - Value: `{{ period.absent_days }}`
   - Calculated or directly provided
   - Show if relevant for deductions

9. **Add leave days row (optional)**
   - Label: "Leave Days"
   - Value: `{{ period.leave_days }}`
   - Total leave taken during period
   - Show if breakdown needed

10. **Add overtime hours row**
    - Label: "Overtime Hours"
    - Value: `{{ period.overtime_hours }}`
    - Format with decimal precision (e.g., 8.5 hours)

11. **Add public holidays row (optional)**
    - Label: "Public Holidays"
    - Value: `{{ period.public_holidays }}`
    - Show if relevant for calculations

### Pay Period Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    PAY PERIOD SECTION                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌──────────────────────────────────────────────────────────┐   ┃
┃  │ Pay Period: 01-Jan-2026 to 31-Jan-2026                  │   ┃
┃  │ Payment Date: 25-Jan-2026                                │   ┃
┃  ├──────────────────────────────────────────────────────────┤   ┃
┃  │ Total Working Days: 22        Days Worked: 20            │   ┃
┃  │ Leave Days: 2                 Overtime Hours: 8.5        │   ┃
┃  └──────────────────────────────────────────────────────────┘   ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Four-Column Grid Layout
```
┌────────────────────────────────────────────────────────────────┐
│  Pay Period: 01-Jan-2026 to 31-Jan-2026                       │
│  Payment Date: 25-Jan-2026                                     │
├────────────────────────────────────────────────────────────────┤
│  Total Working Days: 22  │  Days Worked: 20                    │
│  Leave Days: 2           │  Overtime Hours: 8.5                │
└────────────────────────────────────────────────────────────────┘
```

### Compact Single Row Layout
```
╔═══════════════════════════════════════════════════════════════╗
║ Period: 01-Jan to 31-Jan 2026  │  Pay Date: 25-Jan-2026      ║
║ Working Days: 22  │  Worked: 20  │  Leave: 2  │  OT: 8.5 hrs ║
╚═══════════════════════════════════════════════════════════════╝
```

### Detailed Table Layout
```
┌─────────────────────────────┬──────────────────────────────┐
│ Pay Period Information      │ Attendance Information       │
├─────────────────────────────┼──────────────────────────────┤
│ Period Start: 01-Jan-2026   │ Total Working Days: 22       │
│ Period End: 31-Jan-2026     │ Days Worked: 20              │
│ Payment Date: 25-Jan-2026   │ Leave Days: 2                │
│                             │ Overtime Hours: 8.5          │
└─────────────────────────────┴──────────────────────────────┘
```

### Django Template Variables

| Variable | Data Type | Example Value | Required |
|----------|-----------|---------------|----------|
| period.start_date | Date | 2026-01-01 | Yes |
| period.end_date | Date | 2026-01-31 | Yes |
| period.pay_date | Date | 2026-01-25 | Yes |
| period.name | String | January 2026 | Yes |
| period.total_working_days | Integer | 22 | Yes |
| period.days_worked | Integer | 20 | Yes |
| period.absent_days | Integer | 0 | Optional |
| period.leave_days | Integer | 2 | Optional |
| period.overtime_hours | Decimal | 8.5 | Optional |
| period.public_holidays | Integer | 1 | Optional |

### Date Formatting Options

| Format Style | Pattern | Example |
|--------------|---------|---------|
| Full Format | DD-MMM-YYYY | 01-Jan-2026 |
| Short Format | DD/MM/YY | 01/01/26 |
| Medium Format | DD-MM-YYYY | 01-01-2026 |
| Range Format | DD-MMM to DD-MMM YYYY | 01-Jan to 31-Jan 2026 |

### Working Days Calculation Context

Sri Lankan working week considerations:

| Day Type | Typical Treatment |
|----------|-------------------|
| Monday-Friday | Standard working days |
| Saturday | Half-day or full day depending on company |
| Sunday | Weekly holiday (typically) |
| Poya Days | Public holidays (monthly) |
| National Holidays | Public holidays |
| Mercantile Holidays | Banking sector holidays |

### Attendance Breakdown Formula
```
Total Working Days (22)
  ├── Days Worked (20)
  ├── Leave Days (2)
  │     ├── Annual Leave
  │     ├── Sick Leave
  │     └── Casual Leave
  ├── Absent Days (0)
  └── Public Holidays (included/excluded based on policy)
```

### Overtime Hours Display

| Format | Example | Use Case |
|--------|---------|----------|
| Decimal | 8.5 hours | Standard display |
| Hours:Minutes | 8:30 hours | Alternative precise format |
| Total Only | 8.5 hrs | Compact display |
| With Rate | 8.5 hrs @ 1.5x | Show rate if relevant |

### Period Name Generation

| Period Type | Name Format | Example |
|-------------|-------------|---------|
| Monthly | Month YYYY | January 2026 |
| Bi-Monthly | Month (Period) YYYY | January (1st Half) 2026 |
| Weekly | Week DD-MMM to DD-MMM | Week 01-Jan to 07-Jan |
| Custom | Custom Range | Special Period Q1 2026 |

### CSS Classes for Period Section

| Class Name | Purpose |
|------------|---------|
| .period-section | Main container for period details |
| .period-details | Table for period information |
| .period-dates | Date range styling |
| .pay-date | Payment date emphasis |
| .attendance-info | Attendance metrics styling |
| .overtime-hours | Overtime display styling |
| .period-label | Label styling |
| .period-value | Value styling |

### Layout Design Options

#### Option 1: Two-Section Layout
- Left section: Period and payment dates
- Right section: Attendance and overtime

#### Option 2: Sequential Layout
- Row 1: Period dates
- Row 2: Payment date
- Row 3: Working days and days worked
- Row 4: Leave and overtime

#### Option 3: Grid Layout
- 2x2 grid with all information distributed evenly
- Balanced visual weight

### Data Validation Display

| Field | Validation/Format |
|-------|-------------------|
| Period Dates | start_date < end_date |
| Payment Date | Typically near or after end_date |
| Days Worked | <= Total Working Days |
| Overtime Hours | Format: N.NN (decimal) |

### Conditional Display Logic

| Condition | Display Behavior |
|-----------|------------------|
| No leave taken | Omit leave days row or show "0" |
| No overtime | Omit overtime row or show "0.0" |
| No absences | Omit absent days or show "0" |
| Public holidays in period | Show count if relevant |
| Full attendance | Emphasize "Perfect Attendance" |

### Expected Outcome
- Clear display of pay period dates
- Payment date prominently shown
- Working days and attendance visible
- Overtime hours clearly indicated
- Clean, scannable layout
- Professional formatting
- Print-friendly design

### Verification Checklist
- [ ] Period section container created
- [ ] Section heading added (if needed)
- [ ] Pay period dates displayed with range
- [ ] Payment date shown clearly
- [ ] Total working days included
- [ ] Days worked displayed
- [ ] Leave days shown (if applicable)
- [ ] Overtime hours formatted properly
- [ ] Optional fields use conditionals
- [ ] Date formatting is consistent
- [ ] Table or grid layout implemented
- [ ] CSS classes applied
- [ ] All template variables referenced correctly
- [ ] Layout is balanced and readable

---

## Task 38: Design Earnings Table Section

### Overview
Design the earnings table section that displays all income components including basic salary, allowances, overtime pay, bonuses, and other earnings. This table provides a detailed breakdown of gross earnings with individual line items and a total.

### Dependencies
- Task 37: Design Pay Period Section
- PayslipEarning model with all earning types
- Earning calculations completed

### Instructions

1. **Create earnings section container**
   - Add `<div class="earnings-section">` below period section
   - Contains heading and earnings table
   - Clear visual grouping

2. **Add section heading**
   - Use `<h3>` tag with text "EARNINGS"
   - Prominent heading for income section
   - Distinguishes from deductions

3. **Create earnings table**
   - Use `<table class="earnings-table">` element
   - Two-column structure: Description and Amount
   - Professional table styling

4. **Add table header row**
   - `<thead>` section with column headers
   - Column 1: "Description" or "Earning Component"
   - Column 2: "Amount (LKR)"
   - Use Sri Lankan Rupee currency indicator

5. **Create table body**
   - `<tbody>` section for earning rows
   - Use Django template loop for earnings
   - Iterate through `{{ earnings }}` list

6. **Add earning line items**
   - Loop through earnings with `{% for earning in earnings %}`
   - Display `{{ earning.description }}` in first column
   - Display `{{ earning.amount }}` in second column

7. **Format earning amounts**
   - Right-align amounts
   - Use thousand separators (e.g., 150,000.00)
   - Two decimal places for precision
   - Format: `{{ earning.amount|floatformat:2|intcomma }}`

8. **Add basic salary row**
   - Typically first earning line item
   - Most significant earning component
   - Can be emphasized with bold or different styling

9. **Add allowances**
   - Transport allowance
   - Medical allowance
   - Housing allowance
   - Meal allowance
   - Other allowances per company policy

10. **Add overtime pay row**
    - Display overtime earnings
    - May show rate and hours in description
    - Example: "Overtime Pay (8.5 hrs @ LKR 2,200/hr)"

11. **Add bonus/incentive rows**
    - Performance bonus
    - Attendance bonus
    - Sales commission
    - Other variable pay components

12. **Add table footer with total**
    - `<tfoot>` section or final row with distinct styling
    - Label: "GROSS EARNINGS" or "TOTAL EARNINGS"
    - Value: `{{ summary.gross_earnings }}`
    - Bold or emphasized styling

13. **Add separator line**
    - Visual separator before footer total
    - Can use `<tr>` with border-top or `<hr>` equivalent

### Earnings Table Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    EARNINGS SECTION                             ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌──────────────────────────────────────────┬─────────────────┐ ┃
┃  │ Description                              │ Amount (LKR)    │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ Basic Salary                             │     150,000.00  │ ┃
┃  │ Transport Allowance                      │      15,000.00  │ ┃
┃  │ Medical Allowance                        │      10,000.00  │ ┃
┃  │ Housing Allowance                        │      20,000.00  │ ┃
┃  │ Meal Allowance                           │       5,000.00  │ ┃
┃  │ Overtime Pay (8.5 hrs @ LKR 2,200/hr)    │      18,700.00  │ ┃
┃  │ Performance Bonus                        │      25,000.00  │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ GROSS EARNINGS                           │     243,700.00  │ ┃
┃  └──────────────────────────────────────────┴─────────────────┘ ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Earnings Table Structure
```
╔════════════════════════════════════════════════════════════════╗
║                       EARNINGS                                 ║
╠══════════════════════════════════════╦═════════════════════════╣
║ Description                          ║ Amount (LKR)            ║
╠══════════════════════════════════════╬═════════════════════════╣
║ Basic Salary                         ║        150,000.00       ║
║ Transport Allowance                  ║         15,000.00       ║
║ Medical Allowance                    ║         10,000.00       ║
║ Housing Allowance                    ║         20,000.00       ║
║ Meal Allowance                       ║          5,000.00       ║
║ Overtime Pay                         ║         18,700.00       ║
║ Performance Bonus                    ║         25,000.00       ║
╠══════════════════════════════════════╬═════════════════════════╣
║ GROSS EARNINGS                       ║        243,700.00       ║
╚══════════════════════════════════════╩═════════════════════════╝
```

### Common Sri Lankan Salary Components

| Earning Component | Description | Typical Range |
|-------------------|-------------|---------------|
| Basic Salary | Core monthly salary | 40-70% of gross |
| Transport Allowance | Commute allowance | LKR 5,000 - 25,000 |
| Medical Allowance | Healthcare allowance | LKR 2,500 - 15,000 |
| Housing Allowance | Accommodation support | LKR 10,000 - 50,000 |
| Meal Allowance | Food subsidy | LKR 3,000 - 10,000 |
| Mobile Allowance | Phone reimbursement | LKR 2,000 - 8,000 |
| Fuel Allowance | Fuel cost support | LKR 5,000 - 30,000 |
| Overtime Pay | Extra hours compensation | 1.5x or 2x hourly rate |
| Performance Bonus | Merit-based incentive | Variable |
| Attendance Bonus | Full attendance reward | Fixed amount |
| Commission | Sales commission | % of sales |

### Overtime Pay Calculation Display

#### Simple Format
```
Overtime Pay                           18,700.00
```

#### Detailed Format with Hours
```
Overtime Pay (8.5 hrs)                 18,700.00
```

#### Format with Rate
```
Overtime Pay (8.5 hrs @ LKR 2,200/hr)  18,700.00
```

#### Breakdown by Type
```
Regular OT (6 hrs @ LKR 2,000/hr)      12,000.00
Weekend OT (2.5 hrs @ LKR 2,680/hr)     6,700.00
```

### Django Template Loop Structure

Template will iterate through earnings list:

| Variable | Data Type | Example |
|----------|-----------|---------|
| earning.description | String | Basic Salary |
| earning.amount | Decimal | 150000.00 |
| earning.type | String | BASIC, ALLOWANCE, OT, BONUS |
| earning.order | Integer | Display order |

### Amount Formatting

| Format Requirement | Implementation |
|-------------------|----------------|
| Decimal Places | Always show 2 decimals |
| Thousand Separator | Use comma (150,000.00) |
| Currency Symbol | LKR or Rs. |
| Alignment | Right-aligned |
| Negative Values | Shouldn't occur in earnings |
| Zero Values | Can show or hide based on policy |

### Table Styling Guidelines

| Element | Styling Approach |
|---------|------------------|
| Header Row | Bold, background color, center-aligned |
| Description Column | Left-aligned, 65-70% width |
| Amount Column | Right-aligned, 30-35% width, monospace font |
| Line Items | Regular font, alternating row colors optional |
| Total Row | Bold, border-top (2px), larger font size |
| Row Spacing | Comfortable padding (6-8px) |
| Borders | Light borders (1px) or minimal styling |

### CSS Classes for Earnings Table

| Class Name | Purpose |
|------------|---------|
| .earnings-section | Section container |
| .earnings-table | Table element |
| .earnings-header | Table header row |
| .earnings-row | Individual earning row |
| .earning-description | Description cell |
| .earning-amount | Amount cell |
| .earnings-total | Total/footer row |
| .amount-cell | Common amount formatting |

### Earning Order Priority

Typical display order for earnings:

| Order | Component Type |
|-------|---------------|
| 1 | Basic Salary |
| 2 | Fixed Allowances (alphabetical) |
| 3 | Variable Allowances |
| 4 | Overtime Pay |
| 5 | Bonuses and Incentives |
| 6 | Other Earnings |
| 7 | GROSS TOTAL |

### Conditional Display Rules

| Scenario | Display Behavior |
|----------|------------------|
| Zero Amount | Hide row or show as 0.00 |
| No Overtime | Omit overtime row |
| No Bonuses | Omit bonus section |
| Single Earning | Still use table structure |
| Many Earnings | Consider grouping or pagination |

### Earning Descriptions Best Practices

| Practice | Example |
|----------|---------|
| Clear Labels | "Transport Allowance" not "Transport" |
| Consistent Naming | Use same term company-wide |
| Abbreviations | Avoid unless very common (OT acceptable) |
| Additional Info | Include calculation details if helpful |
| Language | English for formal payslips |
| Length | Keep descriptions concise (max 40 chars) |

### Gross Earnings Calculation
```
Gross Earnings = 
    Basic Salary
  + All Allowances
  + Overtime Pay
  + Bonuses
  + Commissions
  + Other Earnings
```

### Expected Outcome
- Clear, itemized earnings breakdown
- Professional table presentation
- All earning components listed
- Amounts properly formatted with LKR
- Gross earnings total prominently displayed
- Right-aligned amounts for easy scanning
- Clean, print-friendly design

### Verification Checklist
- [ ] Earnings section container created
- [ ] Section heading "EARNINGS" added
- [ ] Earnings table created with proper structure
- [ ] Table header row with column titles
- [ ] Description column labeled clearly
- [ ] Amount column shows "Amount (LKR)"
- [ ] Django template loop for earnings implemented
- [ ] Earning description displayed
- [ ] Amount formatted with 2 decimals
- [ ] Thousand separators used
- [ ] Right-alignment for amounts
- [ ] Table footer with gross total
- [ ] Total row emphasized (bold/border)
- [ ] CSS classes applied
- [ ] Template variables correctly referenced
- [ ] Zero-amount handling considered

---

## Task 39: Design Deductions Table Section

### Overview
Design the deductions table section that displays all deduction components including EPF employee contribution, PAYE tax, loan repayments, advances, and other deductions. This table mirrors the earnings table structure and provides transparency on all amounts deducted from gross earnings.

### Dependencies
- Task 38: Design Earnings Table Section
- PayslipDeduction model with all deduction types
- Deduction calculations completed
- Sri Lankan EPF/ETF and tax rules implemented

### Instructions

1. **Create deductions section container**
   - Add `<div class="deductions-section">` below earnings section
   - Contains heading and deductions table
   - Visually distinct from earnings section

2. **Add section heading**
   - Use `<h3>` tag with text "DEDUCTIONS"
   - Consistent styling with earnings heading
   - Clear section identifier

3. **Create deductions table**
   - Use `<table class="deductions-table">` element
   - Same two-column structure as earnings table
   - Consistent table design

4. **Add table header row**
   - `<thead>` section with column headers
   - Column 1: "Description" or "Deduction"
   - Column 2: "Amount (LKR)"
   - Matching earnings table header style

5. **Create table body**
   - `<tbody>` section for deduction rows
   - Use Django template loop
   - Iterate through `{{ deductions }}` list

6. **Add deduction line items**
   - Loop through deductions with `{% for deduction in deductions %}`
   - Display `{{ deduction.description }}` in first column
   - Display `{{ deduction.amount }}` in second column

7. **Format deduction amounts**
   - Right-align amounts (matching earnings)
   - Use thousand separators
   - Two decimal places
   - Format: `{{ deduction.amount|floatformat:2|intcomma }}`

8. **Add EPF employee contribution row**
   - Label: "EPF Employee Contribution (8%)"
   - First and most common deduction
   - Calculated as 8% of EPF-eligible earnings

9. **Add PAYE tax row**
   - Label: "PAYE Tax" or "Income Tax"
   - Sri Lankan income tax deduction
   - Based on tax slabs and relief

10. **Add loan repayment rows**
    - Company loans
    - Third-party loan deductions
    - Each loan as separate line item
    - Include loan reference if needed

11. **Add advance deductions**
    - Salary advances
    - Festival advances
    - Other advance recoveries

12. **Add other statutory deductions**
    - Insurance premiums
    - Union fees
    - Other mandated deductions

13. **Add miscellaneous deductions**
    - Canteen charges
    - Uniform costs
    - Damage/loss recoveries
    - Other discretionary deductions

14. **Add table footer with total**
    - `<tfoot>` section or styled final row
    - Label: "TOTAL DEDUCTIONS"
    - Value: `{{ summary.total_deductions }}`
    - Bold and emphasized like earnings total

### Deductions Table Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    DEDUCTIONS SECTION                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌──────────────────────────────────────────┬─────────────────┐ ┃
┃  │ Description                              │ Amount (LKR)    │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ EPF Employee Contribution (8%)           │      12,000.00  │ ┃
┃  │ PAYE Tax                                 │       8,500.00  │ ┃
┃  │ Salary Advance Recovery                  │       5,000.00  │ ┃
┃  │ Loan Repayment - Company Loan            │       3,500.00  │ ┃
┃  │ Loan Repayment - Bank Loan (Ref: BL001)  │       7,000.00  │ ┃
┃  │ Insurance Premium                        │       2,500.00  │ ┃
┃  │ Canteen Charges                          │       1,200.00  │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ TOTAL DEDUCTIONS                         │      39,700.00  │ ┃
┃  └──────────────────────────────────────────┴─────────────────┘ ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Deductions Table Structure
```
╔════════════════════════════════════════════════════════════════╗
║                       DEDUCTIONS                               ║
╠══════════════════════════════════════╦═════════════════════════╣
║ Description                          ║ Amount (LKR)            ║
╠══════════════════════════════════════╬═════════════════════════╣
║ EPF Employee Contribution (8%)       ║         12,000.00       ║
║ PAYE Tax                             ║          8,500.00       ║
║ Salary Advance Recovery              ║          5,000.00       ║
║ Loan Repayment - Company Loan        ║          3,500.00       ║
║ Loan Repayment - Bank Loan           ║          7,000.00       ║
║ Insurance Premium                    ║          2,500.00       ║
║ Canteen Charges                      ║          1,200.00       ║
╠══════════════════════════════════════╬═════════════════════════╣
║ TOTAL DEDUCTIONS                     ║         39,700.00       ║
╚══════════════════════════════════════╩═════════════════════════╝
```

### Common Sri Lankan Deduction Components

| Deduction Type | Description | Calculation Basis |
|----------------|-------------|-------------------|
| EPF Employee (8%) | Employees' Provident Fund | 8% of EPF-eligible salary |
| PAYE Tax | Pay As You Earn income tax | Progressive tax slabs |
| Company Loan | Internal loan repayment | Fixed installment |
| Bank Loan | Third-party loan via company | Fixed installment |
| Salary Advance | Advance recovery | As agreed |
| Festival Advance | Festival season advance recovery | As agreed |
| Insurance Premium | Life/medical insurance | Fixed premium |
| Union Fees | Trade union membership | Fixed amount or % |
| No-Pay Deduction | Unpaid leave deduction | Pro-rated daily rate |
| Welfare Fund | Company welfare contribution | Fixed or % |
| Stamp Duty | Revenue stamp (if applicable) | Fixed amount (LKR 25) |
| Canteen Charges | Meal service charges | Usage-based |

### EPF Employee Contribution Details

#### Calculation
```
EPF Eligible Salary = Basic + Certain Allowances
EPF Employee Contribution = EPF Eligible Salary × 8%

Example:
Basic Salary: LKR 150,000
Transport Allowance: LKR 15,000 (EPF eligible)
EPF Eligible: LKR 165,000
Employee EPF (8%): LKR 13,200
```

#### Display Format Options

| Format Style | Example |
|--------------|---------|
| Simple | EPF Employee Contribution (8%) |
| With Base | EPF (8% of LKR 165,000) |
| Detailed | EPF Employee - 8% of LKR 165,000 |

### PAYE Tax Display

Sri Lankan PAYE (Pay As You Earn) tax considerations:

| Tax Aspect | Details |
|------------|---------|
| Tax Slabs | Progressive rates (0%, 6%, 12%, 18%, 24%, 30%) |
| Tax Relief | Personal relief: LKR 1,200,000 per annum |
| Monthly Calculation | Based on annualized income |
| Display | Simply show "PAYE Tax" and amount |

### Loan Deduction Display Formats

#### Simple Format
```
Loan Repayment                         5,000.00
```

#### With Loan Type
```
Loan Repayment - Company Loan          3,500.00
Loan Repayment - Bank Loan             7,000.00
```

#### With Reference
```
Loan Repayment - Company Loan (CL-001) 3,500.00
Bank Loan Deduction (Ref: BL-2024-05)  7,000.00
```

#### With Installment Info
```
Company Loan (Inst 5/24)               3,500.00
```

### Django Template Variables

| Variable | Data Type | Example |
|----------|-----------|---------|
| deduction.description | String | EPF Employee Contribution (8%) |
| deduction.amount | Decimal | 12000.00 |
| deduction.type | String | EPF, TAX, LOAN, ADVANCE, OTHER |
| deduction.order | Integer | Display order |
| deduction.reference | String | Loan reference number |

### Deduction Order Priority

Typical display order:

| Order | Deduction Type |
|-------|---------------|
| 1 | EPF Employee Contribution |
| 2 | PAYE Tax |
| 3 | No-Pay Deductions |
| 4 | Loan Repayments |
| 5 | Advance Recoveries |
| 6 | Insurance/Welfare |
| 7 | Miscellaneous Deductions |
| 8 | TOTAL |

### CSS Classes for Deductions Table

| Class Name | Purpose |
|------------|---------|
| .deductions-section | Section container |
| .deductions-table | Table element |
| .deductions-header | Table header row |
| .deduction-row | Individual deduction row |
| .deduction-description | Description cell |
| .deduction-amount | Amount cell |
| .deductions-total | Total/footer row |
| .statutory-deduction | EPF/tax highlighting |
| .loan-deduction | Loan-specific styling |

### No-Pay Deduction Calculation

For unpaid leave days:

```
Daily Rate = Monthly Basic / 30
No-Pay Deduction = Daily Rate × Absent Days

Example:
Monthly Basic: LKR 150,000
Daily Rate: LKR 5,000
Absent Days: 2
No-Pay Deduction: LKR 10,000
```

Display:
```
No-Pay Deduction (2 days)              10,000.00
```

### Advance Recovery Display

#### Salary Advance
```
Salary Advance Recovery (1/3)          5,000.00
```

#### Festival Advance
```
Festival Advance Recovery (2/6)        8,000.00
```

### Stamp Duty (Historical/Legacy)

In Sri Lanka, revenue stamps may apply to salary payments above certain thresholds:

| Scenario | Stamp Duty |
|----------|-----------|
| Historical | LKR 25 per salary payment |
| Current | Generally not applicable for most payrolls |
| Display | If applicable: "Stamp Duty" |

### Conditional Deduction Display

| Condition | Display Behavior |
|-----------|------------------|
| No EPF | Omit EPF row (contract workers) |
| No PAYE | Omit if below tax threshold |
| No Loans | Omit loan section |
| Zero Advances | Omit advance rows |
| No Other Deductions | Show only statutory items |

### Total Deductions Calculation
```
Total Deductions = 
    EPF Employee Contribution (8%)
  + PAYE Tax
  + All Loan Repayments
  + All Advance Recoveries
  + Insurance/Welfare Contributions
  + Miscellaneous Deductions
```

### Expected Outcome
- Clear, itemized deductions breakdown
- Matching earnings table design
- EPF and PAYE clearly shown
- Loan and advance details visible
- Amounts properly formatted with LKR
- Total deductions prominently displayed
- Professional, transparent presentation

### Verification Checklist
- [ ] Deductions section container created
- [ ] Section heading "DEDUCTIONS" added
- [ ] Deductions table with proper structure
- [ ] Table header row matches earnings table
- [ ] Description and Amount columns labeled
- [ ] Django template loop implemented
- [ ] EPF employee contribution (8%) displayed
- [ ] PAYE tax included
- [ ] Loan repayments shown
- [ ] Advance recoveries displayed
- [ ] Other deductions included
- [ ] Amounts right-aligned and formatted
- [ ] Thousand separators used
- [ ] Two decimal places shown
- [ ] Total deductions row emphasized
- [ ] CSS classes applied consistently
- [ ] Template variables correctly referenced

---

## Task 40: Design Summary Section

### Overview
Design the summary section that displays the final salary calculation, showing gross earnings, total deductions, and net pay. This is the most critical section of the payslip as it shows the final take-home amount. The summary should be prominent and clearly readable.

### Dependencies
- Task 38: Design Earnings Table Section
- Task 39: Design Deductions Table Section
- Summary calculations completed

### Instructions

1. **Create summary section container**
   - Add `<div class="summary-section">` below deductions section
   - Contains salary summary table
   - Most prominent section on payslip

2. **Add section heading**
   - Use `<h3>` tag with text "SALARY SUMMARY"
   - Or use "PAY SUMMARY" / "PAYMENT SUMMARY"
   - Larger or more prominent than other headings

3. **Create summary table**
   - Use `<table class="summary-table">` element
   - Two-column structure: Label and Amount
   - Larger fonts for visibility

4. **Add gross earnings row**
   - Label: "Gross Earnings" or "Total Earnings"
   - Value: `{{ summary.gross_earnings }}`
   - Sum of all earnings from Task 38

5. **Add total deductions row**
   - Label: "Total Deductions"
   - Value: `{{ summary.total_deductions }}`
   - Sum of all deductions from Task 39
   - Often shown in parentheses or with minus sign

6. **Add visual separator**
   - Horizontal line or border before net pay
   - Emphasizes the final calculation
   - Can use bold border or double line

7. **Add net pay row**
   - Label: "NET PAY" or "Net Salary" or "Take Home"
   - Value: `{{ summary.net_pay }}`
   - Most prominent row with emphasis
   - Larger font, bold, possibly highlighted background

8. **Format all amounts**
   - Right-align amounts
   - Use thousand separators
   - Two decimal places
   - Currency indicator: LKR or Rs.

9. **Add calculation indicator (optional)**
   - Show formula: Gross - Deductions = Net
   - Visual indication of calculation
   - Helps with transparency

10. **Consider visual emphasis**
    - Use background color for net pay row
    - Increase font size for net pay
    - Use bold text throughout summary
    - Box shadow or border for entire section

### Summary Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    SALARY SUMMARY SECTION                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ╔══════════════════════════════════════════════════════════╗   ┃
┃  ║              SALARY SUMMARY                              ║   ┃
┃  ╠══════════════════════════════════╦═══════════════════════╣   ┃
┃  ║ Gross Earnings                   ║        243,700.00     ║   ┃
┃  ║ Total Deductions                 ║        (39,700.00)    ║   ┃
┃  ╠══════════════════════════════════╬═══════════════════════╣   ┃
┃  ║ NET PAY                          ║        204,000.00     ║   ┃
┃  ╚══════════════════════════════════╩═══════════════════════╝   ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Summary Table Structure - Emphasized Design
```
╔════════════════════════════════════════════════════════════════╗
║                    SALARY SUMMARY                              ║
╠══════════════════════════════════════╦═════════════════════════╣
║                                      ║                         ║
║  Gross Earnings                      ║      243,700.00         ║
║                                      ║                         ║
║  Total Deductions                    ║      (39,700.00)        ║
║                                      ║                         ║
╠══════════════════════════════════════╬═════════════════════════╣
║                                      ║                         ║
║  NET PAY                             ║      204,000.00         ║
║                                      ║                         ║
╚══════════════════════════════════════╩═════════════════════════╝
```

### Compact Summary Layout
```
┌──────────────────────────────────────────────────────────────┐
│                      PAY SUMMARY                             │
├─────────────────────────────────────┬────────────────────────┤
│ Gross Earnings                      │       243,700.00       │
│ Total Deductions                    │       (39,700.00)      │
├─────────────────────────────────────┼────────────────────────┤
│ NET PAY                             │       204,000.00       │
└─────────────────────────────────────┴────────────────────────┘
```

### Visual Calculation Display
```
╔════════════════════════════════════════════════════════════════╗
║                    SALARY SUMMARY                              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║    Gross Earnings                            243,700.00        ║
║    Less: Total Deductions                   (39,700.00)        ║
║    ────────────────────────────────────────────────────        ║
║    NET PAY                                   204,000.00        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### Highlighted Net Pay Design
```
┌──────────────────────────────────────────────────────────────┐
│  Gross Earnings                           243,700.00         │
│  Total Deductions                        (39,700.00)         │
├──────────────────────────────────────────────────────────────┤
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
│ ┃  NET PAY                             LKR 204,000.00     ┃ │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
└──────────────────────────────────────────────────────────────┘
```

### Django Template Variables

| Variable | Data Type | Example | Calculation |
|----------|-----------|---------|-------------|
| summary.gross_earnings | Decimal | 243700.00 | Sum of all earnings |
| summary.total_deductions | Decimal | 39700.00 | Sum of all deductions |
| summary.net_pay | Decimal | 204000.00 | Gross - Deductions |

### Net Pay Calculation Formula
```
NET PAY = Gross Earnings - Total Deductions

Example:
  Gross Earnings:    LKR 243,700.00
  Total Deductions:  LKR  39,700.00
  ─────────────────────────────────
  NET PAY:           LKR 204,000.00
```

### Amount Display Formatting

| Amount Type | Format Example | Notes |
|-------------|----------------|-------|
| Gross Earnings | 243,700.00 | Positive, no sign |
| Total Deductions | (39,700.00) or -39,700.00 | Parentheses or minus |
| Net Pay | 204,000.00 | Positive, emphasized |
| With Currency | LKR 204,000.00 | Include currency symbol |

### CSS Classes for Summary Section

| Class Name | Purpose |
|------------|---------|
| .summary-section | Main section container |
| .summary-table | Summary table element |
| .summary-heading | Section heading |
| .summary-row | Individual summary row |
| .gross-earnings-row | Gross earnings line |
| .deductions-row | Total deductions line |
| .net-pay-row | Net pay line (emphasized) |
| .summary-label | Label column |
| .summary-amount | Amount column |
| .summary-separator | Visual divider line |

### Net Pay Emphasis Techniques

| Technique | Implementation |
|-----------|----------------|
| Larger Font | 14-16pt vs 10-12pt for other rows |
| Bold Text | font-weight: bold or 700 |
| Background Color | Light green, blue, or gray |
| Border | Thicker border or box around row |
| Uppercase | "NET PAY" in all caps |
| Color | Darker or contrasting text color |
| Spacing | Extra padding above/below |

### Background Color Options for Net Pay

| Color Scheme | Background | Text Color | Use Case |
|--------------|------------|------------|----------|
| Professional | Light gray (#f5f5f5) | Black | Conservative design |
| Positive | Light green (#e8f5e9) | Dark green | Emphasize income |
| Neutral | Light blue (#e3f2fd) | Dark blue | Corporate style |
| Minimal | White with border | Black | Clean design |

### Deduction Display Options

#### Option 1: Parentheses
```
Total Deductions                       (39,700.00)
```

#### Option 2: Minus Sign
```
Total Deductions                       -39,700.00
```

#### Option 3: Plain (with label clarity)
```
Less: Total Deductions                  39,700.00
```

### Summary Section Variations

#### Standard Three-Row
- Gross Earnings
- Total Deductions
- Net Pay

#### Expanded Five-Row (Optional)
- Gross Earnings
- Statutory Deductions (EPF + PAYE)
- Other Deductions
- Total Deductions
- Net Pay

#### Minimal Two-Row
- Total Deductions
- Net Pay
(Assumes earnings already seen above)

### Typography Guidelines

| Element | Font Size | Font Weight | Alignment |
|---------|-----------|-------------|-----------|
| Section Heading | 14-16pt | Bold | Center |
| Label Text | 11-12pt | Semi-bold | Left |
| Amount Text | 11-12pt | Regular | Right |
| Net Pay Label | 13-14pt | Bold | Left |
| Net Pay Amount | 13-14pt | Bold | Right |

### Print Considerations

| Aspect | Recommendation |
|--------|---------------|
| Contrast | Ensure high contrast for printing |
| Colors | Use print-safe colors |
| Borders | Use solid borders, not gradients |
| Font Size | Minimum 10pt for readability |
| Spacing | Adequate white space |
| Background | Light backgrounds only |

### Expected Outcome
- Clear three-row summary structure
- Gross earnings displayed prominently
- Total deductions clearly shown
- Net pay emphasized and highly visible
- Professional formatting with proper alignment
- Amounts formatted with thousand separators
- Currency indicator (LKR) included
- Visual hierarchy guides eye to net pay

### Verification Checklist
- [ ] Summary section container created
- [ ] Section heading added
- [ ] Summary table created
- [ ] Gross earnings row present
- [ ] Total deductions row present
- [ ] Net pay row present and emphasized
- [ ] Visual separator before net pay
- [ ] All amounts right-aligned
- [ ] Thousand separators used
- [ ] Two decimal places shown
- [ ] Currency indicator included
- [ ] Net pay row has special styling
- [ ] Deductions shown with minus/parentheses
- [ ] CSS classes applied
- [ ] Template variables correctly referenced
- [ ] Print-friendly design confirmed

---

## Task 41: Design YTD Section

### Overview
Design the Year-to-Date (YTD) section that displays cumulative totals for the calendar year. This section shows total gross earnings, total deductions, total net pay, and cumulative EPF/ETF contributions from January 1st to the current payslip period. YTD information is valuable for employees to track annual income and tax planning.

### Dependencies
- Task 40: Design Summary Section
- YTD calculation logic implemented
- Historical payslip data available

### Instructions

1. **Create YTD section container**
   - Add `<div class="ytd-section">` below summary section
   - Contains year-to-date cumulative totals
   - Optional section (display if data available)

2. **Add conditional display logic**
   - Use Django template conditional `{% if ytd %}`
   - Only show if YTD data exists
   - Skip for first payslip of year if desired

3. **Add section heading**
   - Use `<h3>` tag with text "Year-to-Date Summary (as at [date])"
   - Or "YTD TOTALS (January - [current month])"
   - Include time context in heading

4. **Create YTD table**
   - Use `<table class="ytd-table">` element
   - Two-column structure: Label and Amount
   - Similar to summary table design

5. **Add YTD gross earnings row**
   - Label: "YTD Gross Earnings"
   - Value: `{{ ytd.gross_earnings }}`
   - Sum of all gross earnings for the year

6. **Add YTD deductions row**
   - Label: "YTD Total Deductions"
   - Value: `{{ ytd.total_deductions }}`
   - Sum of all deductions for the year

7. **Add YTD net pay row**
   - Label: "YTD Net Pay"
   - Value: `{{ ytd.net_pay }}`
   - Sum of all net payments for the year

8. **Add YTD EPF employee contribution**
   - Label: "YTD EPF Employee (8%)"
   - Value: `{{ ytd.epf_employee }}`
   - Cumulative EPF employee contribution

9. **Add YTD EPF employer contribution**
   - Label: "YTD EPF Employer (12%)"
   - Value: `{{ ytd.epf_employer }}`
   - Cumulative employer EPF (informational)

10. **Add YTD ETF contribution**
    - Label: "YTD ETF (3%)"
    - Value: `{{ ytd.etf }}`
    - Cumulative ETF contribution (informational)

11. **Add YTD PAYE tax**
    - Label: "YTD PAYE Tax"
    - Value: `{{ ytd.paye_tax }}`
    - Total tax deducted year-to-date

12. **Format all amounts**
    - Right-align amounts
    - Use thousand separators
    - Two decimal places
    - Currency: LKR

13. **Add period information**
    - Show date range: "01-Jan-2026 to 31-Jan-2026"
    - Or month range: "January to January 2026"
    - Clarify what "year-to-date" means

### YTD Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    YEAR-TO-DATE SUMMARY                         ┃
┃                   (as at 31-Jan-2026)                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌──────────────────────────────────────────┬─────────────────┐ ┃
┃  │ Description                              │ Amount (LKR)    │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ YTD Gross Earnings                       │     732,450.00  │ ┃
┃  │ YTD Total Deductions                     │     122,890.00  │ ┃
┃  │ YTD Net Pay                              │     609,560.00  │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ YTD EPF Employee (8%)                    │      38,640.00  │ ┃
┃  │ YTD EPF Employer (12%)                   │      57,960.00  │ ┃
┃  │ YTD ETF (3%)                             │      14,490.00  │ ┃
┃  │ YTD PAYE Tax                             │      27,500.00  │ ┃
┃  └──────────────────────────────────────────┴─────────────────┘ ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### YTD Table Structure
```
╔════════════════════════════════════════════════════════════════╗
║            YEAR-TO-DATE SUMMARY (Jan - Mar 2026)              ║
╠══════════════════════════════════════╦═════════════════════════╣
║ Description                          ║ Amount (LKR)            ║
╠══════════════════════════════════════╬═════════════════════════╣
║ YTD Gross Earnings                   ║        732,450.00       ║
║ YTD Total Deductions                 ║        122,890.00       ║
║ YTD Net Pay                          ║        609,560.00       ║
╠══════════════════════════════════════╬═════════════════════════╣
║ YTD EPF Employee (8%)                ║         38,640.00       ║
║ YTD EPF Employer (12%)               ║         57,960.00       ║
║ YTD ETF (3%)                         ║         14,490.00       ║
║ YTD PAYE Tax                         ║         27,500.00       ║
╚══════════════════════════════════════╩═════════════════════════╝
```

### Compact YTD Layout
```
┌──────────────────────────────────────────────────────────────┐
│  YTD Summary (Jan-Mar 2026)                                  │
├─────────────────────────────────────┬────────────────────────┤
│ Gross: 732,450.00  │ Deductions: 122,890.00 │ Net: 609,560.00│
├─────────────────────────────────────┼────────────────────────┤
│ EPF Emp: 38,640    │ EPF Empr: 57,960   │ ETF: 14,490      │
│ PAYE: 27,500       │                                         │
└─────────────────────────────────────┴────────────────────────┘
```

### Django Template Variables

| Variable | Data Type | Example | Description |
|----------|-----------|---------|-------------|
| ytd.gross_earnings | Decimal | 732450.00 | Cumulative gross pay |
| ytd.total_deductions | Decimal | 122890.00 | Cumulative deductions |
| ytd.net_pay | Decimal | 609560.00 | Cumulative net pay |
| ytd.epf_employee | Decimal | 38640.00 | Cumulative EPF employee (8%) |
| ytd.epf_employer | Decimal | 57960.00 | Cumulative EPF employer (12%) |
| ytd.etf | Decimal | 14490.00 | Cumulative ETF (3%) |
| ytd.paye_tax | Decimal | 27500.00 | Cumulative PAYE tax |
| ytd.period_start | Date | 2026-01-01 | YTD start date (usually Jan 1) |
| ytd.period_end | Date | 2026-03-31 | Current period end date |

### YTD Calculation Logic
```
For each metric (e.g., Gross Earnings):

YTD Value = SUM of all payslips from Jan 1 to current period

Example (3 months):
  January Gross:   243,700.00
  February Gross:  245,150.00
  March Gross:     243,600.00
  ─────────────────────────────
  YTD Gross:       732,450.00
```

### Sri Lankan EPF/ETF YTD Context

| Contribution | Rate | YTD Purpose |
|--------------|------|-------------|
| EPF Employee | 8% | Track employee contribution |
| EPF Employer | 12% | Informational (employer pays) |
| ETF | 3% | Informational (employer pays) |
| Total EPF | 20% | Combined contribution tracking |

### YTD Display Timing

| Scenario | Display Behavior |
|----------|------------------|
| First payslip of year (January) | Optional - can show or hide |
| February onwards | Always show |
| Mid-year employee join | YTD from join date, not Jan 1 |
| Year-end (December) | Full year totals |
| Next year January | Reset to new period |

### Period Display Options

#### Option 1: Full Date Range
```
Year-to-Date Summary (01-Jan-2026 to 31-Mar-2026)
```

#### Option 2: Month Range
```
YTD TOTALS (January - March 2026)
```

#### Option 3: Simple "As At"
```
Year-to-Date Summary (as at 31-Mar-2026)
```

#### Option 4: With Payslip Count
```
YTD Summary (3 payslips: Jan-Mar 2026)
```

### CSS Classes for YTD Section

| Class Name | Purpose |
|------------|---------|
| .ytd-section | Main YTD container |
| .ytd-table | YTD table element |
| .ytd-heading | Section heading |
| .ytd-period | Period date display |
| .ytd-row | Individual YTD row |
| .ytd-label | Label column |
| .ytd-amount | Amount column |
| .ytd-summary-row | Summary line styling |
| .ytd-contribution-row | EPF/ETF row styling |

### Visual Grouping

Group YTD information logically:

#### Group 1: Payment Summary
- YTD Gross Earnings
- YTD Total Deductions
- YTD Net Pay

#### Group 2: Statutory Contributions
- YTD EPF Employee
- YTD EPF Employer
- YTD ETF

#### Group 3: Tax
- YTD PAYE Tax

### Styling Differentiation

| Aspect | Implementation |
|--------|----------------|
| Section Background | Light background color to distinguish |
| Font Size | Slightly smaller (9-10pt) than main sections |
| Border | Box around entire section |
| Heading Style | Smaller heading than main sections |
| Optional Tag | "Informational" badge or note |

### Employer Contribution Display Notes

EPF Employer and ETF are paid by employer, not deducted from employee:

| Display Strategy | Rationale |
|------------------|-----------|
| Include | Transparency, shows total provident fund |
| Mark as "(Employer Paid)" | Clarify not deducted from salary |
| Separate subsection | Distinguish from employee deductions |
| Optional display | Make configurable per company policy |

### Conditional Display Logic in Template
```
{% if ytd %}
    <!-- Show YTD section -->
    {% if ytd.epf_employer %}
        <!-- Show employer contributions -->
    {% endif %}
{% endif %}
```

### YTD Benefits for Employees

| Benefit | Description |
|---------|-------------|
| Tax Planning | Track progress toward annual tax brackets |
| Provident Fund | Monitor retirement savings growth |
| Income Verification | Proof of earnings for loans/visas |
| Budget Planning | Understand year-to-date income patterns |
| Compliance | Verify employer EPF/ETF compliance |

### Expected Outcome
- Clear YTD section displaying cumulative totals
- Gross, deductions, and net pay YTD
- EPF/ETF contributions tracked
- PAYE tax cumulative total shown
- Period context clearly indicated
- Professional formatting matching other sections
- Optional display based on data availability
- Informational value for employee

### Verification Checklist
- [ ] YTD section container created
- [ ] Conditional display logic implemented
- [ ] Section heading with period context
- [ ] YTD gross earnings displayed
- [ ] YTD total deductions displayed
- [ ] YTD net pay displayed
- [ ] YTD EPF employee contribution shown
- [ ] YTD EPF employer contribution shown (optional)
- [ ] YTD ETF shown (optional)
- [ ] YTD PAYE tax displayed
- [ ] Period dates/range indicated
- [ ] All amounts formatted consistently
- [ ] Right-alignment maintained
- [ ] Thousand separators used
- [ ] CSS classes applied
- [ ] Template variables correctly referenced

---

## Task 42: Design Employer Contrib Section

### Overview
Design the employer contributions section that displays EPF (12%) and ETF (3%) contributions paid by the employer. This section is informational and shows amounts that the employer contributes on behalf of the employee but are not deducted from the employee's salary. This demonstrates transparency and helps employees understand their total compensation package.

### Dependencies
- Task 41: Design YTD Section
- Employer contribution calculation logic
- EPF/ETF rates configured

### Instructions

1. **Create employer contributions section container**
   - Add `<div class="employer-contrib-section">` after YTD section
   - Optional section based on company policy
   - Typically shown for transparency

2. **Add conditional display logic**
   - Use Django template conditional `{% if employer_contributions %}`
   - Only show if company policy includes this information
   - Can be configured per tenant

3. **Add section heading**
   - Use `<h3>` tag with text "Employer Contributions"
   - Or "Employer Statutory Contributions"
   - Clarifies these are NOT deductions

4. **Add informational note**
   - Include small text: "(Paid by employer, not deducted from salary)"
   - Or similar clarifying note
   - Prevents confusion

5. **Create contributions table**
   - Use `<table class="employer-contrib-table">` element
   - Two-column structure: Description and Amount
   - Consistent with other tables

6. **Add table header row (optional)**
   - Can include headers: "Contribution Type" and "Amount (LKR)"
   - Or omit headers for simpler design
   - Maintain consistency with overall design

7. **Add EPF employer contribution row**
   - Label: "EPF Employer Contribution (12%)"
   - Value: `{{ employer_contributions.epf_employer }}`
   - Calculated as 12% of EPF-eligible salary

8. **Add EPF calculation detail (optional)**
   - Show base amount in label
   - Example: "EPF Employer (12% of LKR 165,000)"
   - Adds transparency

9. **Add ETF contribution row**
   - Label: "ETF Contribution (3%)"
   - Value: `{{ employer_contributions.etf }}`
   - Calculated as 3% of EPF-eligible salary

10. **Add ETF calculation detail (optional)**
    - Show base amount in label
    - Example: "ETF (3% of LKR 165,000)"
    - Matching EPF detail style

11. **Add total employer contributions row**
    - Label: "Total Employer Contributions"
    - Value: Sum of EPF employer + ETF
    - Shows combined employer cost
    - Optional row

12. **Format all amounts**
    - Right-align amounts
    - Use thousand separators
    - Two decimal places
    - Currency: LKR

### Employer Contributions Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                 EMPLOYER CONTRIBUTIONS                          ┃
┃         (Paid by employer, not deducted from salary)            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  ┌──────────────────────────────────────────┬─────────────────┐ ┃
┃  │ EPF Employer Contribution (12%)          │      19,800.00  │ ┃
┃  │ ETF Contribution (3%)                    │       4,950.00  │ ┃
┃  ├──────────────────────────────────────────┼─────────────────┤ ┃
┃  │ Total Employer Contributions             │      24,750.00  │ ┃
┃  └──────────────────────────────────────────┴─────────────────┘ ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Employer Contributions Table Structure
```
╔════════════════════════════════════════════════════════════════╗
║              EMPLOYER STATUTORY CONTRIBUTIONS                  ║
║        (Paid by employer, not deducted from salary)            ║
╠══════════════════════════════════════╦═════════════════════════╣
║ Description                          ║ Amount (LKR)            ║
╠══════════════════════════════════════╬═════════════════════════╣
║ EPF Employer Contribution (12%)      ║         19,800.00       ║
║ ETF Contribution (3%)                ║          4,950.00       ║
╠══════════════════════════════════════╬═════════════════════════╣
║ Total Employer Contributions         ║         24,750.00       ║
╚══════════════════════════════════════╩═════════════════════════╝
```

### Detailed Calculation Display
```
┌──────────────────────────────────────────────────────────────┐
│  Employer Contributions (paid by employer)                   │
├──────────────────────────────────────────┬───────────────────┤
│ EPF Employer (12% of LKR 165,000)        │      19,800.00    │
│ ETF (3% of LKR 165,000)                  │       4,950.00    │
├──────────────────────────────────────────┼───────────────────┤
│ Total (15% of LKR 165,000)               │      24,750.00    │
└──────────────────────────────────────────┴───────────────────┘
```

### Compact Display
```
╔═══════════════════════════════════════════════════════════════╗
║  Employer Contributions (not deducted from your salary)       ║
╠═══════════════════════════════════════════════════════════════╣
║  EPF (12%): 19,800.00  │  ETF (3%): 4,950.00  │  Total: 24,750║
╚═══════════════════════════════════════════════════════════════╝
```

### Django Template Variables

| Variable | Data Type | Example | Description |
|----------|-----------|---------|-------------|
| employer_contributions.epf_employer | Decimal | 19800.00 | EPF employer 12% |
| employer_contributions.etf | Decimal | 4950.00 | ETF 3% |
| employer_contributions.base_amount | Decimal | 165000.00 | EPF-eligible salary |
| employer_contributions.total | Decimal | 24750.00 | EPF + ETF total |

### Sri Lankan Statutory Contributions Framework

| Contribution | Rate | Paid By | Applied To |
|--------------|------|---------|------------|
| EPF Employee | 8% | Employee | EPF-eligible salary |
| EPF Employer | 12% | Employer | EPF-eligible salary |
| ETF | 3% | Employer | EPF-eligible salary |
| **Total EPF** | **20%** | **Combined** | **Retirement fund** |

### EPF-Eligible Salary Components

Typically includes:
- Basic Salary
- Fixed Allowances (Transport, Meal, etc.)

May exclude:
- Overtime Pay (company-specific)
- Bonuses/Incentives (usually excluded)
- Reimbursements

### Calculation Examples

#### Example 1: Basic + Transport
```
Basic Salary:         LKR 150,000
Transport Allowance:  LKR  15,000
─────────────────────────────────
EPF-Eligible:         LKR 165,000

EPF Employer (12%):   LKR  19,800
ETF (3%):             LKR   4,950
─────────────────────────────────
Total Employer:       LKR  24,750
```

#### Example 2: Basic Only
```
Basic Salary:         LKR 150,000
─────────────────────────────────
EPF-Eligible:         LKR 150,000

EPF Employer (12%):   LKR  18,000
ETF (3%):             LKR   4,500
─────────────────────────────────
Total Employer:       LKR  22,500
```

### Total Compensation View

Showing employer contributions helps employees understand total value:

```
Your Total Compensation Package:
  
  Your Gross Earnings:         LKR 243,700
  Employer Contributions:      LKR  24,750
  ─────────────────────────────────────────
  Total Package Value:         LKR 268,450
```

### CSS Classes for Employer Contributions

| Class Name | Purpose |
|------------|---------|
| .employer-contrib-section | Main section container |
| .employer-contrib-table | Table element |
| .employer-contrib-heading | Section heading |
| .contrib-note | Informational note |
| .contrib-row | Individual contribution row |
| .contrib-label | Label column |
| .contrib-amount | Amount column |
| .contrib-total | Total row styling |

### Informational Note Variations

#### Option 1: Under Heading
```
EMPLOYER CONTRIBUTIONS
(Paid by employer, not deducted from salary)
```

#### Option 2: Above Table
```
ℹ These contributions are made by your employer on your behalf
and are not deducted from your salary.
```

#### Option 3: Below Table
```
* Employer contributions are paid directly to EPF/ETF by the employer.
```

### Display Policy Options

| Policy | Display Approach |
|--------|------------------|
| Always Show | Include in all payslips |
| Optional | Make configurable per tenant |
| Senior Staff Only | Show for management level |
| Annual Only | Show only in December payslip |
| Never Show | Exclude if company prefers |

### Styling Considerations

| Aspect | Recommendation |
|--------|---------------|
| Background | Light green tint (positive contribution) |
| Border | Dashed border (informational nature) |
| Font Size | Same as other sections or slightly smaller |
| Emphasis | Less emphasis than net pay |
| Icon | Optional "info" icon |
| Position | After YTD, before footer |

### Conditional Template Display
```
{% if show_employer_contributions and employer_contributions %}
    <!-- Display employer contributions section -->
    <div class="employer-contrib-section">
        <!-- Content -->
    </div>
{% endif %}
```

### Benefits of Displaying Employer Contributions

| Benefit | Description |
|---------|-------------|
| Transparency | Shows full employment cost |
| Appreciation | Employees value total package |
| Compliance Proof | Verifies employer meets obligations |
| Financial Planning | Helps with retirement planning |
| Recruitment Tool | Attractive for new hires |

### Alternative: Total Compensation Statement

Some companies provide a separate annual statement instead:
- Detailed breakdown of all benefits
- Employer contributions
- Insurance values
- Other perks

### Expected Outcome
- Clear display of employer EPF and ETF contributions
- Informational note clarifying not deducted
- Professional table format matching other sections
- Amounts properly formatted with LKR
- Optional total showing combined contributions
- Conditional display based on company policy
- Enhances employee understanding of total package

### Verification Checklist
- [ ] Employer contributions section container created
- [ ] Conditional display logic implemented
- [ ] Section heading added
- [ ] Informational note included
- [ ] Note clarifies not deducted from salary
- [ ] Contributions table created
- [ ] EPF employer (12%) row displayed
- [ ] ETF (3%) row displayed
- [ ] Calculation details shown (optional)
- [ ] Total employer contributions row (optional)
- [ ] All amounts formatted consistently
- [ ] Right-alignment maintained
- [ ] Thousand separators used
- [ ] CSS classes applied
- [ ] Template variables correctly referenced
- [ ] Display policy configurable

---

## Task 43: Design Footer Section

### Overview
Design the footer section that appears at the bottom of the payslip, including disclaimer text, signature line (optional), confidentiality notice, system-generated timestamp, and any legal or compliance notes. The footer provides closure to the document and important legal/administrative information.

### Dependencies
- Task 42: Design Employer Contrib Section
- Company policy on payslip disclaimers
- Legal requirements for payslip content

### Instructions

1. **Create footer section container**
   - Add `<div class="payslip-footer">` at end of payslip div
   - Last section in the template
   - Clear visual separation from content above

2. **Add separator line**
   - Insert horizontal rule or styled border
   - Visual break from main content
   - Can use `<hr>` or styled div

3. **Add disclaimer text**
   - Use `<p class="disclaimer">` element
   - Standard disclaimer about payslip confidentiality
   - Company-specific compliance text

4. **Add confidentiality notice**
   - Text: "This payslip is confidential and for the addressee only"
   - Small font, professional tone
   - Legal protection for company

5. **Add verification statement (optional)**
   - Text: "Please verify all details and report any discrepancies within 7 days"
   - Encourages employee review
   - Sets reporting timeline

6. **Add signature line (optional)**
   - Label: "Authorized By: _______________"
   - Blank line for signature
   - Date line if needed
   - May be omitted for automated payslips

7. **Add generation timestamp**
   - Text: "Generated on: {{ generated_at|date:'d-M-Y H:i' }}"
   - Shows when PDF was created
   - Uses Django template date filter

8. **Add system information (optional)**
   - Text: "Generated by [System Name] Payroll System"
   - Watermark or branding
   - Version number if applicable

9. **Add contact information**
   - HR department email or phone
   - Text: "For queries: hr@company.lk or +94 11 234 5678"
   - Provides support channel

10. **Add legal compliance note**
    - EPF/ETF compliance statement
    - Tax compliance reference
    - Company registration number

11. **Add page number (for multi-page)**
    - Text: "Page 1 of 1"
    - Usually single page, but provision for multi-page
    - CSS page counter support

12. **Style footer appropriately**
    - Smaller font (8-9pt)
    - Gray or muted colors
    - Adequate spacing from content
    - Centered or left-aligned text

### Footer Section Layout
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         FOOTER SECTION                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  ─────────────────────────────────────────────────────────────  ┃
┃                                                                  ┃
┃  DISCLAIMER                                                      ┃
┃  This payslip is computer-generated and does not require a       ┃
┃  signature. All information is confidential and intended for     ┃
┃  the recipient only. Please verify all details and report any    ┃
┃  discrepancies to the HR department within 7 days.               ┃
┃                                                                  ┃
┃  CONFIDENTIALITY NOTICE                                          ┃
┃  This document contains confidential information. Unauthorized   ┃
┃  disclosure or distribution is prohibited.                       ┃
┃                                                                  ┃
┃  Generated on: 20-Jan-2026 10:35 AM                             ┃
┃  For queries contact: hr@lankacommerce.lk │ +94 11 234 5678     ┃
┃                                                                  ┃
┃  Company Reg: PV 12345  │  EPF Reg: EPF/C/12345                 ┃
┃  ─────────────────────────────────────────────────────────────  ┃
┃                         Page 1 of 1                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Footer Structure Breakdown
```
╔════════════════════════════════════════════════════════════════╗
║                        [Separator Line]                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Important Notice:                                             ║
║  This payslip is computer-generated and confidential.          ║
║  Please verify all details and report discrepancies within     ║
║  7 days to hr@company.lk                                       ║
║                                                                ║
║  Generated: 20-Jan-2026 10:35 AM                              ║
║  System: Lanka Commerce Payroll v2.0                          ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### Minimal Footer Design
```
┌──────────────────────────────────────────────────────────────┐
│  ──────────────────────────────────────────────────────────  │
│  This is a computer-generated document. No signature required.│
│  Generated: 20-Jan-2026 10:35 AM                             │
│  For queries: hr@company.lk                                  │
│  ──────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────┘
```

### Django Template Variables

| Variable | Data Type | Example | Description |
|----------|-----------|---------|-------------|
| generated_at | DateTime | 2026-01-20 10:35:00 | PDF generation time |
| company.hr_email | String | hr@company.lk | HR contact email |
| company.hr_phone | String | +94 11 234 5678 | HR contact phone |
| company.registration_number | String | PV 12345 | Company reg number |
| company.epf_number | String | EPF/C/12345 | Company EPF reg |
| system_version | String | v2.0.1 | System version |

### Disclaimer Text Examples

#### Example 1: Standard Disclaimer
```
This payslip is computer-generated and does not require a physical 
signature. All information contained herein is strictly confidential 
and intended solely for the recipient. Please verify all details and 
report any discrepancies to the HR Department within 7 working days.
```

#### Example 2: Concise Disclaimer
```
Computer-generated payslip. No signature required. Confidential - 
for recipient only. Report errors within 7 days to hr@company.lk
```

#### Example 3: Formal Disclaimer
```
IMPORTANT NOTICE: This payslip constitutes confidential information 
between the employer and employee. Unauthorized disclosure, copying, 
or distribution is strictly prohibited. The employee is responsible 
for verifying accuracy and reporting discrepancies within the 
stipulated timeframe.
```

### Confidentiality Notice Variations

#### Short Version
```
Confidential: For addressee only
```

#### Medium Version
```
CONFIDENTIALITY NOTICE
This document is confidential and intended for the named recipient 
only. Unauthorized access or distribution is prohibited.
```

#### Legal Version
```
CONFIDENTIALITY AND PRIVILEGE NOTICE
This document contains confidential information protected by law. 
If you are not the intended recipient, please notify the sender 
immediately and destroy this document.
```

### CSS Classes for Footer

| Class Name | Purpose |
|------------|---------|
| .payslip-footer | Main footer container |
| .footer-separator | Top border/separator |
| .disclaimer | Disclaimer paragraph |
| .confidentiality-notice | Confidentiality text |
| .generated-info | Generation timestamp |
| .contact-info | HR contact information |
| .legal-info | Company registration details |
| .footer-text | Common footer text styling |
| .signature-line | Signature area (if used) |

### Footer Typography

| Element | Font Size | Color | Weight |
|---------|-----------|-------|--------|
| Disclaimer | 8-9pt | Dark gray | Regular |
| Notice Heading | 9pt | Black | Bold |
| Generated Info | 8pt | Medium gray | Regular |
| Contact Info | 8pt | Medium gray | Regular |
| Legal Info | 7-8pt | Light gray | Regular |

### Generation Timestamp Formats

| Format Style | Example | Django Filter |
|--------------|---------|---------------|
| Full | 20-Jan-2026 10:35:45 AM | d-M-Y h:i:s A |
| Standard | 20-01-2026 10:35 | d-m-Y H:i |
| Short | 20-Jan-2026 10:35 | d-M-Y H:i |
| Date Only | 20-Jan-2026 | d-M-Y |

### Contact Information Display

#### Single Line
```
For queries: hr@company.lk │ +94 11 234 5678
```

#### Multi-Line
```
For queries contact:
Email: hr@lankacommerce.lk
Phone: +94 11 234 5678
```

#### Formatted
```
HR Department
✉ hr@company.lk  ☎ +94 11 234 5678
```

### Legal/Compliance Information

Sri Lankan company legal information to include:

| Information | Format | Example |
|-------------|--------|---------|
| Company Registration | PV/PQ Number | Company Reg: PV 12345 |
| EPF Employer Number | EPF/C/NNNNN | EPF Reg: EPF/C/12345 |
| VAT Number | VAT Number (if applicable) | VAT: 123456789 |
| Business Address | Brief address | 123 Galle Rd, Colombo 03 |

### Signature Line Design (Optional)

```
┌──────────────────────────────────────────────────────────────┐
│  Authorized Signature: _____________________  Date: _______  │
│                                                              │
│  Name: _______________________                               │
│  Designation: HR Manager / Authorized Officer                │
└──────────────────────────────────────────────────────────────┘
```

### Footer Positioning

| Approach | Implementation |
|----------|----------------|
| Fixed Bottom | Use CSS position: fixed |
| Content Flow | Let content flow naturally |
| Page Bottom | Use @page margin with footer content |
| Sticky Footer | Flexbox sticky footer pattern |

### Print Considerations

| Aspect | Recommendation |
|--------|---------------|
| Font Size | Minimum 7pt for legibility |
| Margins | Leave adequate bottom margin |
| Page Break | Avoid breaking footer across pages |
| Colors | Use print-safe gray tones |
| Borders | Simple, solid borders |

### Multi-Page Footer (if applicable)

For payslips that might span multiple pages:

```
┌──────────────────────────────────────────────────────────────┐
│  [Footer content]                            Page 1 of 2     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  [Continued footer content]                  Page 2 of 2     │
│  [Full disclaimer and contact on last page]                  │
└──────────────────────────────────────────────────────────────┘
```

### Footer Content Priority

Essential information to always include:

| Priority | Content | Reason |
|----------|---------|--------|
| 1 | Disclaimer | Legal protection |
| 2 | Generated timestamp | Versioning/audit |
| 3 | Contact info | Employee support |
| 4 | Confidentiality notice | Data protection |
| 5 | Company registration | Compliance |

### Localization Considerations

For Sri Lankan context, footer might include:

- Sinhala/Tamil translation of key notices (optional)
- Sri Lankan compliance references
- Local formatting for dates and contact info
- Reference to Sri Lankan labor laws if needed

### Expected Outcome
- Professional footer with clear disclaimers
- Confidentiality notice for data protection
- Generation timestamp for version tracking
- Contact information for employee queries
- Legal/compliance information visible
- Clean, uncluttered design
- Print-friendly styling
- Proper spacing from content above

### Verification Checklist
- [ ] Footer section container created
- [ ] Separator line added at top
- [ ] Disclaimer text included
- [ ] Disclaimer is clear and appropriate
- [ ] Confidentiality notice added
- [ ] Verification statement included (optional)
- [ ] Generation timestamp displayed
- [ ] Timestamp formatted properly
- [ ] Contact information included
- [ ] HR email and/or phone shown
- [ ] Company registration details added
- [ ] EPF registration number shown
- [ ] Signature line added (if required)
- [ ] Footer styling appropriate (small font, gray)
- [ ] Page number included (if multi-page)
- [ ] All template variables correctly referenced
- [ ] CSS classes applied
- [ ] Print-friendly design confirmed

---

## Summary

This document covered the complete HTML template design for Sri Lankan payslip PDF generation, from WeasyPrint installation through all template sections. The template provides a comprehensive, professional payslip with proper structure, Sri Lankan compliance elements (EPF/ETF), and print-optimized layout.

### Key Deliverables
- WeasyPrint installed with system dependencies
- HTML template base with proper structure
- Header section with company branding
- Employee details with EPF number
- Pay period with attendance information
- Earnings table with LKR formatting
- Deductions table with EPF/PAYE
- Summary section with net pay emphasis
- Year-to-date cumulative totals
- Employer contributions (EPF 12%, ETF 3%)
- Professional footer with disclaimers

### Next Steps
Proceed to [02_Tasks-44-48_Generator-Service.md](02_Tasks-44-48_Generator-Service.md) for CSS styling and PayslipGenerator service implementation.

---

**Document End**
