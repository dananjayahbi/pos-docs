# Tasks 28-34: Employee Profile & Org Chart

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** B - Employee Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 28-34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-27_List-Cards-Table.md](01_Tasks-17-27_List-Cards-Table.md)
- **→ Next Document:** None (Last in Group) | **Next Group:** [Group-C_Attendance-Management](../Group-C_Attendance-Management/)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document completes employee management by building comprehensive employee profile pages and organizational chart visualization. Creates employee details page with profile header showing key information. Implements tab navigation for organizing different sections of employee data. Builds personal information tab and employment information tab with detailed fields. Creates interactive organizational chart showing company hierarchy with visual tree structure and clickable employee nodes.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 28 | Create Employee Details Page | Medium | Task 16 |
| 29 | Create Employee Profile Header | Medium | Task 28 |
| 30 | Create Employee Tabs | Low | Task 28 |
| 31 | Create Personal Info Tab | Medium | Task 30 |
| 32 | Create Employment Info Tab | Medium | Task 30 |
| 33 | Create Org Chart Page | Medium | Task 16 |
| 34 | Create Org Chart Node | Medium | Task 33 |

---

## Task 28: Create Employee Details Page

### Overview

Build the main employee details page component that displays comprehensive employee information using a tabbed interface. This page serves as the container for employee profile header and various information tabs.

### Dependencies

- **Requires:** Task 16 (route structure)
- **Blocks:** Tasks 29-32 (profile components)

### Instructions

**Step 1: Define Page Structure**

The details page should contain:

| Section | Purpose |
|---------|---------|
| Back Navigation | Return to employee list |
| Profile Header | Employee photo, name, key info |
| Tab Navigation | Switch between information sections |
| Tab Content | Display selected tab content |
| Action Buttons | Edit, delete, export actions |

**Step 2: Page Layout**

```
┌─────────────────────────────────────────────────────┐
│  [← Back to Employees]                              │
├─────────────────────────────────────────────────────┤
│  [Employee Profile Header]                          │
│  - Photo, Name, Position, Status                    │
│  - Contact Info, Quick Actions                      │
├─────────────────────────────────────────────────────┤
│  [Personal] [Employment] [Documents] [Performance]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Tab Content Area]                                 │
│  - Displays content based on selected tab           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 3: Data Fetching Flow**

```
[Page Load with ID parameter]
      │
      ├──> Extract Employee ID
      │    └──> From URL params: /employees/[id]
      │
      ├──> Fetch Employee Data
      │    └──> GET /api/employees/:id
      │         │
      │         ├──> Success
      │         │    └──> Load employee data
      │         │
      │         └──> Error
      │              └──> Show error page
      │
      ├──> Fetch Related Data
      │    ├──> Employment history
      │    ├──> Documents
      │    └──> Performance records
      │
      └──> Render Page
           └──> Display tabs and content
```

**Step 4: Tab State Management**

```
Tab Management:
{
  activeTab: 'personal' | 'employment' | 'documents' | 'performance',
  employeeData: Object,
  loading: boolean,
  error: Error | null
}

Tab Switching Flow:
  │
  ├──> User Clicks Tab
  │
  ├──> Update activeTab State
  │
  ├──> Load Tab-Specific Data (if needed)
  │
  └──> Render Tab Content
```

**Step 5: Action Buttons**

Available actions in the header:

| Action | Icon | Permission | Function |
|--------|------|------------|----------|
| Edit | Pencil | hr.employee.update | Navigate to edit form |
| Delete | Trash | hr.employee.delete | Show delete confirmation |
| Export | Download | hr.employee.read | Download employee data |
| Print | Printer | hr.employee.read | Print employee profile |

**Step 6: Responsive Layout**

```
Desktop (>1024px):
┌──────────────────────────────────────┐
│ [← Back]                     [Actions]│
├──────────────────────────────────────┤
│ [Profile Header - Full Layout]       │
├──────────────────────────────────────┤
│ [Tab Nav - Horizontal]               │
│ [Tab Content]                        │
└──────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────────────────┐
│ [← Back]                        [⋮]  │
├──────────────────────────────────────┤
│ [Profile Header - Stacked]           │
├──────────────────────────────────────┤
│ [Tab Dropdown ▼]                     │
│ [Tab Content]                        │
└──────────────────────────────────────┘
```

**Step 7: Error Handling**

Handle various error scenarios:

```
Error Scenarios:
  │
  ├──> Employee Not Found (404)
  │    └──> Show "Employee not found" message
  │         └──> Button to return to list
  │
  ├──> Access Denied (403)
  │    └──> Show "No permission" message
  │         └──> Button to return to dashboard
  │
  └──> Server Error (500)
       └──> Show "Failed to load" message
            └──> Button to retry
```

### Expected Outcome

Employee details page component created with proper data fetching and error handling. Page displays employee profile header and tabbed navigation. Tab switching works smoothly and maintains state.

### Verification Checklist

- [ ] Page component created
- [ ] ID parameter extraction working
- [ ] Employee data fetching successful
- [ ] Tab navigation implemented
- [ ] Actions menu functional
- [ ] Error handling in place
- [ ] Responsive layout working

---

## Task 29: Create Employee Profile Header

### Overview

Build the profile header component displaying employee photo, name, key information, and quick action buttons. This header appears at the top of the employee details page providing an at-a-glance overview.

### Dependencies

- **Requires:** Task 28 (details page)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Define Header Sections**

| Section | Content |
|---------|---------|
| Left | Large avatar, name, position |
| Center | Key metrics and info badges |
| Right | Quick action buttons |

**Step 2: Header Layout**

```
┌─────────────────────────────────────────────────────────┐
│  ┌────────┐                                             │
│  │        │  John Doe              ● Active             │
│  │ Photo  │  Software Engineer                          │
│  │        │  IT Department                              │
│  └────────┘                                             │
│                                                         │
│  EMP001  |  Joined: Jan 2020  |  Reports to: Jane Smith│
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ 📧 Email│  │ 📱 Call │  │ 💬 Chat │  │ [Edit]  │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Step 3: Information Display Structure**

Primary information:

| Field | Position | Format |
|-------|----------|--------|
| Name | Top left | Full name, large font |
| Position | Below name | Job title |
| Department | Below position | Department name |
| Status Badge | Top right | Active/Inactive indicator |

**Step 4: Secondary Information**

Info badges row:

```
┌──────────────────────────────────────────────────────┐
│  EMP001  │  Joined: 15 Jan 2020  │  Manager: Jane    │
│           │  4 years 0 months    │  Reports: 5       │
└──────────────────────────────────────────────────────┘
```

**Step 5: Quick Actions**

Quick action buttons:

| Button | Icon | Action |
|--------|------|--------|
| Email | ✉️ | Open email client |
| Call | 📱 | Initiate call (if available) |
| Chat | 💬 | Open messaging |
| Edit | ✏️ | Navigate to edit form |

**Step 6: Status Indicators**

Status badge variations:

```
Active:
┌────────────┐
│ ● Active   │
└────────────┘

Inactive:
┌────────────┐
│ ○ Inactive │
└────────────┘

On Leave:
┌────────────┐
│ ◐ On Leave │
└────────────┘

Probation:
┌────────────┐
│ ⊙ Probation│
└────────────┘
```

**Step 7: Responsive Header**

```
Desktop (>1024px): Horizontal layout
┌─────────────────────────────────────────────┐
│ [Avatar] Name, Position   [Info] [Actions]  │
└─────────────────────────────────────────────┘

Tablet (768-1024px): Stacked info
┌─────────────────────────────────────────────┐
│ [Avatar] Name, Position         [Status]    │
│ [Info badges]                               │
│ [Actions]                                   │
└─────────────────────────────────────────────┘

Mobile (<768px): Fully stacked
┌─────────────────────────────────────────────┐
│        [Large Avatar]                       │
│        John Doe                             │
│        Software Engineer                    │
│        ● Active                             │
│                                             │
│ EMP001 | 4 years | Reports: 5              │
│                                             │
│ [Email] [Call] [Chat] [Edit]               │
└─────────────────────────────────────────────┘
```

### Expected Outcome

Employee profile header created displaying all key employee information in an organized layout. Quick actions provide easy access to common functions. Header is responsive and adapts to screen size.

### Verification Checklist

- [ ] Header component created
- [ ] Avatar displays correctly
- [ ] All information fields shown
- [ ] Status badge working
- [ ] Quick actions functional
- [ ] Responsive layout working

---

## Task 30: Create Employee Tabs

### Overview

Build the tab navigation component allowing users to switch between different sections of employee information. Uses Radix UI tabs for accessibility and smooth transitions.

### Dependencies

- **Requires:** Task 28 (details page)
- **Blocks:** Tasks 31-32 (tab content)

### Instructions

**Step 1: Define Tab Structure**

Tabs to implement:

| Tab | Content | Icon |
|-----|---------|------|
| Personal | Personal information | 👤 User |
| Employment | Employment details | 💼 Briefcase |
| Documents | Uploaded documents | 📄 File |
| Performance | Performance records | 📊 Chart |

**Step 2: Tab Navigation Layout**

```
Desktop:
┌────────────────────────────────────────────────────┐
│ [👤 Personal] [💼 Employment] [📄 Documents] [📊...│
│  ▔▔▔▔▔▔▔▔▔                                         │
└────────────────────────────────────────────────────┘

Mobile (Dropdown):
┌────────────────────────────────────────────────────┐
│ 👤 Personal ▼                                      │
├────────────────────────────────────────────────────┤
│ ✓ Personal                                         │
│   Employment                                       │
│   Documents                                        │
│   Performance                                      │
└────────────────────────────────────────────────────┘
```

**Step 3: Tab State Management**

```
Tab State:
{
  activeTab: string,
  tabs: [
    { id: 'personal', label: 'Personal', icon: UserIcon },
    { id: 'employment', label: 'Employment', icon: BriefcaseIcon },
    { id: 'documents', label: 'Documents', icon: FileIcon },
    { id: 'performance', label: 'Performance', icon: ChartIcon }
  ]
}

Tab Change Flow:
  │
  ├──> User Clicks Tab
  │
  ├──> Update activeTab
  │
  ├──> Trigger Content Change
  │
  └──> Optional: Update URL hash
       └──> /employees/[id]#employment
```

**Step 4: Tab Indicators**

Active tab styling:

```
Active Tab:
┌─────────────┐
│ 👤 Personal │
│  ▔▔▔▔▔▔▔▔▔  │
└─────────────┘

Inactive Tab:
┌─────────────┐
│ 💼 Employment│
│             │
└─────────────┘

Hover State:
┌─────────────┐
│ 📄 Documents │
│  ───────────│ (light underline)
└─────────────┘
```

**Step 5: Tab Content Rendering**

```
Content Rendering:
  │
  ├──> activeTab === 'personal'
  │    └──> Render PersonalInfoTab
  │
  ├──> activeTab === 'employment'
  │    └──> Render EmploymentInfoTab
  │
  ├──> activeTab === 'documents'
  │    └──> Render DocumentsTab
  │
  └──> activeTab === 'performance'
       └──> Render PerformanceTab
```

**Step 6: URL Integration**

Support URL hash navigation:

```
URL Hash Handling:
  │
  ├──> Page Load
  │    └──> Check URL hash
  │         ├──> Has #employment? → Set active to employment
  │         └──> No hash? → Default to personal
  │
  ├──> Tab Click
  │    └──> Update URL hash
  │         └──> /employees/[id]#employment
  │
  └──> Browser Back/Forward
       └──> Read hash and switch tab
```

**Step 7: Accessibility Features**

| Feature | Implementation |
|---------|---------------|
| Keyboard Nav | Arrow keys to navigate tabs |
| Focus Indicator | Visible outline on focused tab |
| ARIA Labels | role="tablist", role="tab" |
| Screen Reader | Announces active tab |

### Expected Outcome

Tab navigation component created with smooth switching between tabs. Tabs are accessible via keyboard and properly announced by screen readers. URL hash integration allows deep linking to specific tabs.

### Verification Checklist

- [ ] Tab component created
- [ ] All tabs rendered correctly
- [ ] Active tab highlighting working
- [ ] Tab switching functional
- [ ] URL hash integration working
- [ ] Keyboard navigation working
- [ ] ARIA attributes correct

---

## Task 31: Create Personal Info Tab

### Overview

Build the personal information tab displaying employee's personal details including name, contact information, identification, and emergency contacts. Organized in sections for easy reading.

### Dependencies

- **Requires:** Task 30 (employee tabs)
- **Blocks:** None (tab content)

### Instructions

**Step 1: Define Information Sections**

Sections in personal info tab:

| Section | Fields |
|---------|--------|
| Basic Info | Full name, NIC, Date of birth, Gender, Marital status |
| Contact | Phone, Email, Address |
| Emergency Contact | Name, Relationship, Phone |
| Personal Details | Blood group, Religion, Nationality |

**Step 2: Tab Layout**

```
┌─────────────────────────────────────────────────────┐
│  Personal Information                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Basic Information                                  │
│  ┌────────────────────────────────────────────────┐│
│  │ Full Name:       John Michael Doe              ││
│  │ NIC:             199012345678V                 ││
│  │ Date of Birth:   15 January 1990 (36 years)   ││
│  │ Gender:          Male                          ││
│  │ Marital Status:  Married                       ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Contact Information                                │
│  ┌────────────────────────────────────────────────┐│
│  │ Phone:           +94 77 123 4567               ││
│  │ Email:           john.doe@company.com          ││
│  │ Address:         No 123, Main Street,          ││
│  │                  Colombo 07, Sri Lanka         ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Emergency Contact                                  │
│  ┌────────────────────────────────────────────────┐│
│  │ Name:            Jane Doe                      ││
│  │ Relationship:    Spouse                        ││
│  │ Phone:           +94 77 987 6543               ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Personal Details                                   │
│  ┌────────────────────────────────────────────────┐│
│  │ Blood Group:     O+                            ││
│  │ Religion:        Buddhist                      ││
│  │ Nationality:     Sri Lankan                    ││
│  └────────────────────────────────────────────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 3: Field Display Format**

Field formatting rules:

| Field Type | Format |
|------------|--------|
| NIC | XXXXXXXXXV or XXXXXXXXXXXX format |
| Phone | +94 XX XXX XXXX |
| Date | DD Month YYYY (age) |
| Address | Multi-line display |
| Age | Calculated from DOB |

**Step 4: Information Cards**

Each section as a card:

```
Section Card Structure:
┌─────────────────────────────────────┐
│ Section Title                       │
├─────────────────────────────────────┤
│ Label 1:          Value 1           │
│ Label 2:          Value 2           │
│ Label 3:          Value 3           │
└─────────────────────────────────────┘
```

**Step 5: Data Structure**

Expected personal info data:

```
Personal Information Fields:
{
  // Basic Info
  fullName: string,
  firstName: string,
  lastName: string,
  nic: string,
  dateOfBirth: string (ISO date),
  gender: 'Male' | 'Female' | 'Other',
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed',
  
  // Contact
  phone: string,
  email: string,
  address: {
    line1: string,
    line2: string,
    city: string,
    postalCode: string,
    country: string
  },
  
  // Emergency Contact
  emergencyContact: {
    name: string,
    relationship: string,
    phone: string
  },
  
  // Personal Details
  bloodGroup: string,
  religion: string,
  nationality: string
}
```

**Step 6: Edit Mode Toggle**

If user has permission, show edit button:

```
View Mode:
┌─────────────────────────────────────┐
│ Personal Information        [Edit]  │
├─────────────────────────────────────┤
│ [Display fields...]                 │
└─────────────────────────────────────┘

Edit Mode:
┌─────────────────────────────────────┐
│ Edit Personal Info  [Cancel] [Save] │
├─────────────────────────────────────┤
│ [Editable form fields...]           │
└─────────────────────────────────────┘
```

**Step 7: Responsive Layout**

```
Desktop (>768px): Two-column layout
┌────────────────┬────────────────┐
│ Basic Info     │ Contact Info   │
├────────────────┼────────────────┤
│ Emergency      │ Personal       │
└────────────────┴────────────────┘

Mobile (<768px): Single column
┌─────────────────────────────────┐
│ Basic Info                      │
├─────────────────────────────────┤
│ Contact Info                    │
├─────────────────────────────────┤
│ Emergency                       │
├─────────────────────────────────┤
│ Personal                        │
└─────────────────────────────────┘
```

### Expected Outcome

Personal info tab created displaying all employee personal information organized in logical sections. Information is clearly labeled and formatted appropriately for each field type.

### Verification Checklist

- [ ] Tab component created
- [ ] All sections rendered
- [ ] Data displays correctly
- [ ] Sri Lankan formats applied
- [ ] Edit mode functional (if permitted)
- [ ] Responsive layout working

---

## Task 32: Create Employment Info Tab

### Overview

Build the employment information tab displaying employee's work-related details including position, salary, benefits, and employment history. Shows current employment status and compensation details.

### Dependencies

- **Requires:** Task 30 (employee tabs)
- **Blocks:** None (tab content)

### Instructions

**Step 1: Define Information Sections**

Sections in employment info tab:

| Section | Fields |
|---------|--------|
| Position Details | Title, Department, Reports to, Subordinates |
| Employment Status | Type, Start date, Probation, Contract end |
| Compensation | Basic salary, Allowances, Total package |
| Statutory | EPF number, ETF number, Tax ID |
| Benefits | Leave entitlement, Insurance, Other benefits |

**Step 2: Tab Layout**

```
┌─────────────────────────────────────────────────────┐
│  Employment Information                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Position Details                                   │
│  ┌────────────────────────────────────────────────┐│
│  │ Job Title:        Software Engineer            ││
│  │ Department:       IT & Development             ││
│  │ Reports To:       Jane Smith (CTO)             ││
│  │ Direct Reports:   5 employees                  ││
│  │ Location:         Head Office - Colombo        ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Employment Status                                  │
│  ┌────────────────────────────────────────────────┐│
│  │ Employment Type:  Permanent Full-time          ││
│  │ Start Date:       15 January 2020              ││
│  │ Duration:         4 years 0 months             ││
│  │ Probation Status: Confirmed                    ││
│  │ Contract End:     N/A (Permanent)              ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Compensation (Monthly)                             │
│  ┌────────────────────────────────────────────────┐│
│  │ Basic Salary:     LKR 150,000.00               ││
│  │ Allowances:       LKR  25,000.00               ││
│  │ ├─ Transport:     LKR  15,000.00               ││
│  │ └─ Meal:          LKR  10,000.00               ││
│  │ Total Package:    LKR 175,000.00               ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Statutory Information                              │
│  ┌────────────────────────────────────────────────┐│
│  │ EPF Number:       EPF123456                    ││
│  │ ETF Number:       ETF123456                    ││
│  │ Tax ID (TIN):     987654321                    ││
│  └────────────────────────────────────────────────┘│
│                                                     │
│  Benefits & Entitlements                            │
│  ┌────────────────────────────────────────────────┐│
│  │ Annual Leave:     14 days                      ││
│  │ Medical Leave:    14 days                      ││
│  │ Casual Leave:     7 days                       ││
│  │ Health Insurance: Family coverage              ││
│  │ Provident Fund:   EPF/ETF enrolled             ││
│  └────────────────────────────────────────────────┘│
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 3: Employment History Timeline**

Show employment progression:

```
Employment History:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  2024          Promoted to Senior Software Engineer │
│   │                                                 │
│   │                                                 │
│  2022          Salary Increment                     │
│   │                                                 │
│   │                                                 │
│  2020          Confirmed after Probation            │
│   │                                                 │
│   │                                                 │
│  2020 Jan      Joined as Software Engineer          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Step 4: Salary Breakdown**

Detailed compensation structure:

```
Salary Components:
┌──────────────────────────────────────┐
│ Component          Amount     %      │
├──────────────────────────────────────┤
│ Basic Salary       150,000    85.7%  │
│ Transport Allow     15,000     8.6%  │
│ Meal Allowance      10,000     5.7%  │
├──────────────────────────────────────┤
│ Gross Salary       175,000   100.0%  │
│                                      │
│ Deductions:                          │
│ EPF (8%)            14,000           │
│ PAYE                 9,000           │
├──────────────────────────────────────┤
│ Net Salary         152,000           │
└──────────────────────────────────────┘
```

**Step 5: Data Structure**

Employment information data:

```
Employment Info Fields:
{
  // Position
  jobTitle: string,
  department: string,
  reportsTo: { id: string, name: string },
  directReports: number,
  location: string,
  
  // Status
  employmentType: 'Permanent' | 'Contract' | 'Part-time',
  startDate: string (ISO),
  probationPeriod: number (months),
  probationStatus: 'Active' | 'Confirmed',
  contractEndDate: string | null,
  
  // Compensation
  basicSalary: number,
  allowances: [
    { type: string, amount: number }
  ],
  totalPackage: number,
  currency: 'LKR',
  
  // Statutory
  epfNumber: string,
  etfNumber: string,
  taxId: string,
  
  // Benefits
  leaveEntitlements: {
    annual: number,
    medical: number,
    casual: number
  },
  insurance: string,
  otherBenefits: string[]
}
```

**Step 6: Permission-Based Display**

Sensitive information visibility:

```
Permission Levels:
  │
  ├──> Self View
  │    └──> Show all info including salary
  │
  ├──> Manager View
  │    └──> Show most info including salary
  │
  ├──> HR View
  │    └──> Show all info
  │
  └──> Colleague View
       └──> Hide salary and statutory info
```

**Step 7: Responsive Layout**

```
Desktop: Two columns
┌────────────────┬────────────────┐
│ Position       │ Status         │
├────────────────┼────────────────┤
│ Compensation   │ Statutory      │
├────────────────┴────────────────┤
│ Benefits                        │
└─────────────────────────────────┘

Mobile: Single column
┌─────────────────────────────────┐
│ Position                        │
│ Status                          │
│ Compensation                    │
│ Statutory                       │
│ Benefits                        │
└─────────────────────────────────┘
```

### Expected Outcome

Employment info tab created displaying comprehensive employment details. Salary information formatted in Sri Lankan Rupees. Statutory information (EPF/ETF) clearly displayed. Permission-based visibility implemented.

### Verification Checklist

- [ ] Tab component created
- [ ] All sections displayed
- [ ] Salary calculations correct
- [ ] EPF/ETF numbers shown
- [ ] Permission checks working
- [ ] Currency formatting (LKR)
- [ ] Responsive layout

---

## Task 33: Create Org Chart Page

### Overview

Build the organizational chart page visualizing the company's hierarchical structure. Displays employees in a tree diagram showing reporting relationships with interactive nodes.

### Dependencies

- **Requires:** Task 16 (route structure)
- **Blocks:** Task 34 (org chart node)

### Instructions

**Step 1: Define Page Structure**

Org chart page components:

| Component | Purpose |
|-----------|---------|
| Header | Title and controls |
| Toolbar | Zoom, search, filters |
| Chart Canvas | Tree visualization area |
| Mini Map | Overview of full chart |
| Details Panel | Selected employee details |

**Step 2: Page Layout**

```
┌─────────────────────────────────────────────────────┐
│  Organizational Chart                    [Export]   │
│  [Search...]  [Department ▼]  [− ◯ +]  [⊞ Fullscreen]│
├─────────────────────────────────────────────────────┤
│                                                     │
│           ┌─────────────────────┐                   │
│           │   CEO               │                   │
│           │   Managing Director │                   │
│           └──────────┬──────────┘                   │
│                      │                              │
│      ┌───────────────┼───────────────┐              │
│      │               │               │              │
│  ┌───┴───┐       ┌───┴───┐       ┌───┴───┐         │
│  │ CTO   │       │ CFO   │       │ COO   │         │
│  │ Tech  │       │Finance│       │ Ops   │         │
│  └───┬───┘       └───────┘       └───────┘         │
│      │                                              │
│  ┌───┴───────┬───────────┐                          │
│  │           │           │                          │
│ [Dev Mgr] [QA Mgr] [Support Mgr]                   │
│                                                     │
│  [Tree continues...]                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Mini Map]                               [Details]│
└─────────────────────────────────────────────────────┘
```

**Step 3: Chart Controls**

Control toolbar features:

| Control | Function |
|---------|----------|
| Search | Find employee in chart |
| Department Filter | Show specific department |
| Zoom In (+) | Increase zoom level |
| Zoom Out (-) | Decrease zoom level |
| Fit to Screen (◯) | Auto-fit entire chart |
| Fullscreen (⊞) | Toggle fullscreen mode |
| Export | Download as image/PDF |

**Step 4: Tree Data Structure**

Organization hierarchy data:

```
Tree Structure:
{
  id: string,
  name: string,
  position: string,
  department: string,
  photo: string,
  reportsTo: string | null,
  directReports: string[],
  level: number
}

Example Hierarchy:
CEO (level 0)
  │
  ├── CTO (level 1)
  │   ├── Dev Manager (level 2)
  │   │   ├── Senior Dev (level 3)
  │   │   │   └── Junior Dev (level 4)
  │   │   └── Senior Dev (level 3)
  │   └── QA Manager (level 2)
  │       └── QA Engineer (level 3)
  │
  ├── CFO (level 1)
  │   └── Accountant (level 2)
  │
  └── COO (level 1)
      └── Ops Manager (level 2)
```

**Step 5: Zoom and Pan Controls**

```
Zoom Functionality:
  │
  ├──> Zoom In
  │    └──> Increase scale (max 200%)
  │
  ├──> Zoom Out
  │    └──> Decrease scale (min 50%)
  │
  ├──> Fit to Screen
  │    └──> Calculate optimal scale
  │         └──> Center chart
  │
  └──> Reset
       └──> Return to 100% scale
```

**Step 6: Search Functionality**

```
Chart Search:
  │
  ├──> User Types Name
  │
  ├──> Search Tree Data
  │    └──> Match by name, position, or ID
  │
  ├──> Found?
  │    ├──> Yes: Highlight node
  │    │    ├──> Expand path to node
  │    │    ├──> Center on node
  │    │    └──> Zoom to show context
  │    │
  │    └──> No: Show "Not found" message
  │
  └──> Clear Search
       └──> Remove highlights
```

**Step 7: Node Interaction**

```
Node Click Actions:
  │
  ├──> Click Node
  │    └──> Show Details Panel
  │         ├── Employee photo
  │         ├── Name and position
  │         ├── Direct reports count
  │         ├── Department
  │         └── [View Profile] button
  │
  ├──> Hover Node
  │    └──> Show Tooltip
  │         └── Quick info popup
  │
  └──> Double Click
       └──> Navigate to employee profile
```

**Step 8: Responsive Behavior**

```
Desktop (>1024px):
- Full tree visualization
- Horizontal layout
- All controls visible

Tablet (768-1024px):
- Slightly compressed tree
- Vertical scrolling enabled
- Controls in toolbar

Mobile (<768px):
- Simplified tree view
- List view option
- Touch-friendly controls
- Bottom sheet for details
```

### Expected Outcome

Organizational chart page created with interactive tree visualization. Chart shows company hierarchy with proper parent-child relationships. Zoom and pan controls work smoothly. Search highlights and centers on found employees.

### Verification Checklist

- [ ] Page component created
- [ ] Tree data loaded correctly
- [ ] Chart renders hierarchy
- [ ] Zoom controls working
- [ ] Search functionality working
- [ ] Node interactions functional
- [ ] Export feature working
- [ ] Responsive on mobile

---

## Task 34: Create Org Chart Node

### Overview

Build the individual node component for the organizational chart representing each employee in the hierarchy. Nodes display employee information and handle various interaction states.

### Dependencies

- **Requires:** Task 33 (org chart page)
- **Blocks:** None (visual component)

### Instructions

**Step 1: Define Node Structure**

Node components:

| Section | Content |
|---------|---------|
| Avatar | Employee photo or initials |
| Name | Employee full name |
| Position | Job title |
| Reports Count | Number of direct reports |
| Expand/Collapse | Toggle children visibility |

**Step 2: Node Layout**

```
Standard Node:
┌────────────────────┐
│    [Avatar 48px]   │
│                    │
│    John Doe        │
│    Software Eng    │
│    IT Dept         │
│                    │
│  [👥 5 Reports]     │
│       [▼]          │
└────────────────────┘

Collapsed Node:
┌────────────────────┐
│    [Avatar]        │
│    John Doe        │
│    [▶ 5 Reports]   │
└────────────────────┘

Manager Node (emphasized):
┌════════════════════┐
║    [Avatar]        ║
║    Jane Smith      ║
║    CTO             ║
║  [👥 15 Reports]    ║
║       [▼]          ║
└════════════════════┘
```

**Step 3: Node States**

Visual states for nodes:

| State | Styling |
|-------|---------|
| Default | White background, gray border |
| Hovered | Blue border, subtle shadow |
| Selected | Blue background, bold border |
| Expanded | Show children nodes below |
| Collapsed | Hide children nodes |
| Search Match | Yellow highlight border |

**Step 4: Node Sizing**

Different node sizes by level:

```
Level 0 (CEO): Extra large
┌──────────────────────────┐
│     [Large Avatar]       │
│     CEO Name             │
│     Managing Director    │
│     [Reports: 3]         │
└──────────────────────────┘

Level 1 (C-Level): Large
┌────────────────────┐
│    [Med Avatar]    │
│    CTO Name        │
│    [Reports: 5]    │
└────────────────────┘

Level 2+ (Others): Standard
┌──────────────┐
│  [Sm Avatar] │
│  Name        │
│  [Reps: 2]   │
└──────────────┘
```

**Step 5: Connection Lines**

Lines connecting nodes:

```
Parent-Child Connections:
        [Parent]
            │
    ┌───────┼───────┐
    │       │       │
 [Child1][Child2][Child3]

Styling:
  ├── Line color: Gray (#9CA3AF)
  ├── Line width: 2px
  ├── Line style: Solid
  └── Connection style: Orthogonal (right angles)
```

**Step 6: Node Interaction Handlers**

```
Node Interactions:
  │
  ├──> onClick
  │    └──> Select node
  │         └──> Show details panel
  │
  ├──> onDoubleClick
  │    └──> Navigate to employee profile
  │
  ├──> onHover
  │    └──> Show tooltip
  │         └──> Display: Name, Position, Email
  │
  ├──> onExpandClick
  │    └──> Toggle children visibility
  │         ├──> Expanded → Collapse
  │         └──> Collapsed → Expand
  │
  └──> onRightClick
       └──> Show context menu
            ├──> View Profile
            ├──> View Team
            └──> Export Subtree
```

**Step 7: Node Data Structure**

```
Node Component Props:
{
  employee: {
    id: string,
    name: string,
    position: string,
    department: string,
    photo: string,
    reportsTo: string | null,
    directReportsCount: number
  },
  level: number,
  isExpanded: boolean,
  isSelected: boolean,
  isSearchMatch: boolean,
  onSelect: Function,
  onExpand: Function
}
```

**Step 8: Responsive Node**

```
Desktop (>1024px): Full details
┌────────────────────┐
│    [Avatar]        │
│    Full Name       │
│    Full Position   │
│    Department      │
│  [👥 5 Reports]     │
└────────────────────┘

Mobile (<768px): Compact
┌──────────────┐
│ [Sm Avatar]  │
│ Name         │
│ Position     │
└──────────────┘
```

### Expected Outcome

Org chart node component created displaying employee information in a compact card format. Nodes handle various states (hover, select, expand). Connection lines properly drawn between parent and child nodes. Nodes are responsive and adapt to screen size.

### Verification Checklist

- [ ] Node component created
- [ ] Employee info displayed
- [ ] Avatar working
- [ ] States (hover/select) working
- [ ] Expand/collapse functional
- [ ] Connection lines drawn
- [ ] Tooltip on hover
- [ ] Click handlers working
- [ ] Responsive sizing

---

## Summary

This document completed employee management features by implementing comprehensive profile pages and organizational visualization. Created employee details page with data fetching, tab navigation, and action buttons. Built profile header displaying employee photo, key information, and quick action buttons. Implemented tab navigation system with Personal, Employment, Documents, and Performance tabs with URL hash integration. Created personal information tab showing basic details, contact information, emergency contacts, and personal details organized in clear sections. Built employment information tab displaying position details, employment status, compensation breakdown with Sri Lankan salary components (EPF/ETF), statutory information, and benefits entitlements. Created interactive organizational chart page with tree visualization, zoom controls, search functionality, and department filtering. Implemented org chart node component representing individual employees with various states (hover, select, expand), connection lines, and responsive sizing based on hierarchy level.

Employee management module now provides complete functionality for viewing and managing employee information, from directory listings to detailed profiles to organizational structure visualization. All components follow Sri Lankan employment standards and formats.

### What's Next

Group C (Attendance Management) will implement attendance tracking features including dashboard with calendar view, daily attendance lists, clock in/out functionality, and attendance reporting with export capabilities.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
