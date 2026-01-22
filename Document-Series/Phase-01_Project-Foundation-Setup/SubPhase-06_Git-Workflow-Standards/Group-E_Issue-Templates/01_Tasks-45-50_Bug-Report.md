# Tasks 45-50: Bug Report Template

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** E - Issue Templates  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-D_Pull-Request-Templates/03_Tasks-42-44_PR-Template-Types.md](../Group-D_Pull-Request-Templates/03_Tasks-42-44_PR-Template-Types.md)
- **→ Next Document:** [02_Tasks-51-56_Feature-Task.md](02_Tasks-51-56_Feature-Task.md)

---

## Document Overview

This document covers issue template directory setup and bug report template creation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Create ISSUE_TEMPLATE/ Directory | Simple |
| 46 | Create Bug Report Template | Medium |
| 47 | Add Bug Description Section | Simple |
| 48 | Add Reproduction Steps | Simple |
| 49 | Add Expected Behavior | Simple |
| 50 | Add Environment Info | Simple |

---

## Task 45: Create ISSUE_TEMPLATE/ Directory

### Overview
Create directory for GitHub issue templates.

### Dependencies
- Task 33: .github/ directory exists

### Instructions

1. **Create template directory**
   - Inside .github/ folder

2. **Verify location**
   - GitHub recognizes path

### Directory Structure

```
pos-arch/
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md
    ├── PULL_REQUEST_TEMPLATE/
    │   ├── feature.md
    │   ├── bugfix.md
    │   └── hotfix.md
    └── ISSUE_TEMPLATE/                 # Create this
        ├── bug_report.md               # Task 46
        ├── feature_request.md          # Task 51
        ├── task.md                     # Task 55
        └── config.yml                  # Task 56
```

### GitHub Recognition

GitHub automatically recognizes issue templates when placed in:
- `.github/ISSUE_TEMPLATE/` (preferred)
- `ISSUE_TEMPLATE/` (root)
- `docs/ISSUE_TEMPLATE/`

### Expected Outcome
- ISSUE_TEMPLATE/ directory created
- Ready for template files

### Verification Checklist
- [ ] Directory exists at .github/ISSUE_TEMPLATE/
- [ ] Directory is tracked by Git
- [ ] Path follows GitHub conventions

---

## Task 46: Create Bug Report Template

### Overview
Create bug report template with YAML front matter.

### Dependencies
- Task 45: ISSUE_TEMPLATE/ directory exists

### Instructions

1. **Create template file**
   - bug_report.md in ISSUE_TEMPLATE/

2. **Add YAML front matter**
   - Name, description, labels

3. **Add template structure**
   - Initial sections

### Bug Report Template File

Create file: `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: 🐛 Bug Report
about: Report a bug to help us improve LankaCommerce Cloud
title: "[BUG] "
labels: bug, triage
assignees: ''
---

<!--
LankaCommerce Cloud - Bug Report Template
Please fill out all sections to help us understand and fix the issue.
-->

## Bug Summary

<!-- A clear and concise description of what the bug is -->

**Affected Module:**
<!-- Which part of the system is affected? -->
- [ ] POS System
- [ ] ERP Dashboard
- [ ] Webstore
- [ ] API
- [ ] Other: ___________

**Severity:**
- [ ] Critical - System unusable
- [ ] High - Major feature broken
- [ ] Medium - Feature partially broken
- [ ] Low - Minor inconvenience

---

## Environment

<!-- Please complete the following information -->

**Application:**
- Version: 
- Environment: [ ] Production / [ ] Staging / [ ] Development

**Browser (if applicable):**
- Browser: 
- Version: 

**System:**
- OS: 
- Device: [ ] Desktop / [ ] Mobile / [ ] Tablet

---

## Steps to Reproduce

<!-- Provide detailed steps to reproduce the bug -->

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

---

## Expected Behavior

<!-- A clear and concise description of what you expected to happen -->


---

## Actual Behavior

<!-- A clear and concise description of what actually happened -->


---

## Screenshots / Logs

<!-- If applicable, add screenshots or error logs to help explain your problem -->

### Screenshots


### Error Messages / Logs
```
Paste any error messages or logs here
```

---

## Additional Context

<!-- Add any other context about the problem here -->

**When did this start happening?**

**Is this reproducible?**
- [ ] Always
- [ ] Sometimes
- [ ] Rarely

**Any workarounds found?**


```

### YAML Front Matter Fields

| Field | Purpose | Example |
|-------|---------|---------|
| name | Template display name | 🐛 Bug Report |
| about | Brief description | Report a bug... |
| title | Issue title prefix | [BUG] |
| labels | Auto-applied labels | bug, triage |
| assignees | Auto-assign users | (empty or username) |

### Expected Outcome
- Bug report template created
- YAML front matter configured

### Verification Checklist
- [ ] File created at correct path
- [ ] YAML front matter valid
- [ ] Labels auto-assigned
- [ ] Title prefix set

---

## Task 47: Add Bug Description Section

### Overview
Ensure bug description section is comprehensive.

### Dependencies
- Task 46: Bug report template exists

### Instructions

1. **Review description section**
   - Clear summary area

2. **Add affected module**
   - Which system component

3. **Add severity level**
   - Impact classification

### Bug Description Content

```markdown
## Bug Summary

<!-- A clear and concise description of what the bug is -->

**One-Line Summary:**
<!-- Write one sentence describing the bug -->


**Affected Module:**
<!-- Which part of the system is affected? -->
- [ ] POS System
- [ ] ERP Dashboard  
- [ ] Webstore
- [ ] API / Backend
- [ ] Mobile App
- [ ] Database
- [ ] Integrations
- [ ] Other: ___________

**Affected Tenants (if known):**
<!-- Is this affecting specific tenants or all? -->
- [ ] All tenants
- [ ] Specific tenant(s): 
- [ ] Unknown

**Severity:**
- [ ] 🔴 Critical - System completely unusable
- [ ] 🟠 High - Major feature broken, no workaround
- [ ] 🟡 Medium - Feature broken but workaround exists
- [ ] 🟢 Low - Minor inconvenience

**Priority (for internal use):**
- [ ] P0 - Drop everything
- [ ] P1 - Fix this sprint
- [ ] P2 - Plan for next sprint
- [ ] P3 - Backlog

```

### Sri Lanka-Specific Fields

| Field | Options |
|-------|---------|
| Timezone | Asia/Colombo |
| Currency | LKR if payment-related |
| Language | English, Sinhala, Sinhaglish |

### Expected Outcome
- Description section complete
- All relevant fields included

### Verification Checklist
- [ ] Clear summary prompt
- [ ] Module checkboxes
- [ ] Severity levels
- [ ] Tenant awareness

---

## Task 48: Add Reproduction Steps

### Overview
Add clear reproduction steps section.

### Dependencies
- Task 46: Bug report template exists

### Instructions

1. **Add steps section**
   - Numbered steps format

2. **Add preconditions**
   - Required state

3. **Add data requirements**
   - Sample data needed

### Reproduction Steps Content

```markdown
## Steps to Reproduce

### Prerequisites
<!-- What needs to be set up first? -->
- User role required: 
- Data needed: 
- Specific state: 

### Reproduction Steps

<!-- Provide detailed steps to reproduce the bug -->
<!-- Be as specific as possible with exact button names, URLs, etc. -->

1. **Navigate to:** 
   <!-- Exact URL or menu path -->

2. **Login as:**
   <!-- User type/role -->

3. **Perform action:**
   <!-- Exact steps -->

4. **Observe:**
   <!-- Where the error appears -->

### Reproduction Rate
<!-- How often does this occur? -->
- [ ] 100% - Always reproducible
- [ ] 75%+ - Usually reproducible
- [ ] 50% - Sometimes reproducible  
- [ ] 25% - Rarely reproducible
- [ ] Once - Only happened once

### Sample Data
<!-- If specific data is needed to reproduce -->
```
Provide sample data here
```

```

### Good vs Bad Steps

| Type | Example |
|------|---------|
| ❌ Bad | "Go to inventory and try to add item" |
| ✅ Good | "1. Navigate to /erp/inventory 2. Click 'Add Item' button 3. Fill in 'Name' as 'Test Product' 4. Click 'Save'" |

### Expected Outcome
- Clear reproduction steps
- Preconditions specified

### Verification Checklist
- [ ] Numbered steps
- [ ] Prerequisites section
- [ ] Reproduction rate
- [ ] Sample data area

---

## Task 49: Add Expected Behavior

### Overview
Add expected vs actual behavior sections.

### Dependencies
- Task 46: Bug report template exists

### Instructions

1. **Add expected section**
   - What should happen

2. **Add actual section**
   - What does happen

3. **Add comparison area**
   - Side by side

### Expected/Actual Behavior Content

```markdown
## Expected Behavior

<!-- A clear and concise description of what you expected to happen -->

**Expected Result:**
<!-- What should happen when following the steps above -->


**Reference:**
<!-- Where is this behavior documented or shown? -->
- [ ] Documentation: 
- [ ] Previous working version: 
- [ ] Other reference: 

---

## Actual Behavior

<!-- A clear and concise description of what actually happened -->

**Actual Result:**
<!-- What actually happens when following the steps above -->


**Error Type:**
- [ ] Error message displayed
- [ ] Incorrect data shown
- [ ] Feature doesn't work
- [ ] Page crashes/freezes
- [ ] Unexpected behavior
- [ ] Performance issue
- [ ] Visual/UI issue
- [ ] Other: 

**First Noticed:**
<!-- When did this issue start? -->
- [ ] After recent update
- [ ] Always been like this
- [ ] Not sure

---

## Comparison

| Aspect | Expected | Actual |
|--------|----------|--------|
| | | |
| | | |

```

### Comparison Table Example

| Aspect | Expected | Actual |
|--------|----------|--------|
| Response time | < 2 seconds | 10+ seconds |
| Error message | None | "500 Internal Error" |
| Calculation | ₨1,500 | ₨1,000 |

### Expected Outcome
- Clear expected behavior
- Actual behavior documented
- Comparison when helpful

### Verification Checklist
- [ ] Expected behavior section
- [ ] Actual behavior section
- [ ] Error type classification
- [ ] Comparison table option

---

## Task 50: Add Environment Info

### Overview
Add environment and context sections.

### Dependencies
- Task 46: Bug report template exists

### Instructions

1. **Add environment section**
   - System details

2. **Add screenshots area**
   - Visual evidence

3. **Add additional context**
   - Extra information

### Environment Section Content

```markdown
## Environment

<!-- Please complete the following information -->

### Application Environment
- **Version:** [e.g., v1.2.3]
- **Environment:** 
  - [ ] Production
  - [ ] Staging
  - [ ] Development
  - [ ] Local

### Tenant Information
- **Tenant ID:** 
- **Tenant Domain:** 
- **Tenant Plan:** [ ] Free / [ ] Basic / [ ] Pro / [ ] Enterprise

### Browser Information (if web-based)
- **Browser:** [e.g., Chrome, Firefox, Safari]
- **Browser Version:** [e.g., 120.0]
- **Extensions:** [any relevant extensions]

### Device Information
- **OS:** [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **Device Type:** 
  - [ ] Desktop
  - [ ] Laptop
  - [ ] Mobile
  - [ ] Tablet
- **Screen Resolution:** [e.g., 1920x1080]

### Network
- **Connection:** [ ] Stable / [ ] Unstable
- **VPN:** [ ] Yes / [ ] No

---

## Screenshots / Evidence

<!-- If applicable, add screenshots or error logs to help explain your problem -->

### Screenshots
<!-- Drag and drop images or paste URLs -->
<!-- Annotate screenshots to highlight the issue -->


### Console Errors
<!-- Open browser DevTools (F12) → Console tab → copy errors -->
```
Paste console errors here
```

### Network Errors
<!-- Open browser DevTools (F12) → Network tab → look for red entries -->
```
Paste network errors here
```

### Application Logs
<!-- If you have access to server logs -->
```
Paste relevant log entries here
```

---

## Additional Context

<!-- Add any other context about the problem here -->

### Timeline
- **When did this start happening?**
- **Did anything change before the issue started?**
- **Related deployments or updates:**

### Impact
- **How many users are affected?**
- **Is there a workaround?**
- **Business impact:**

### Related Issues
<!-- Link to any related issues or PRs -->
- Related to #
- Similar to #
- Blocked by #

### Additional Notes
<!-- Anything else that might be helpful -->


```

### LankaCommerce-Specific Fields

| Field | Values |
|-------|--------|
| Timezone | Asia/Colombo |
| Currency Issues | LKR (₨) formatting |
| Phone | +94 XX XXX XXXX format |
| Language | English/Sinhala/Sinhaglish |

### Expected Outcome
- Complete environment section
- Evidence collection areas
- Additional context captured

### Verification Checklist
- [ ] Environment details
- [ ] Browser information
- [ ] Device information
- [ ] Screenshots area
- [ ] Console/logs area
- [ ] Timeline questions
- [ ] Impact assessment

---

## Complete Bug Report Template

The complete bug_report.md should include all sections from Tasks 46-50:

```markdown
---
name: 🐛 Bug Report
about: Report a bug to help us improve LankaCommerce Cloud
title: "[BUG] "
labels: bug, triage
assignees: ''
---

## Bug Summary
(Task 47 content)

## Environment  
(Task 50 content - partial)

## Steps to Reproduce
(Task 48 content)

## Expected Behavior
(Task 49 content - expected)

## Actual Behavior
(Task 49 content - actual)

## Screenshots / Evidence
(Task 50 content - screenshots)

## Additional Context
(Task 50 content - context)
```

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Create ISSUE_TEMPLATE/ Directory | .github/ISSUE_TEMPLATE/ |
| 46 | Create Bug Report Template | bug_report.md |
| 47 | Add Bug Description Section | Summary, module, severity |
| 48 | Add Reproduction Steps | Steps, prerequisites, rate |
| 49 | Add Expected Behavior | Expected vs actual |
| 50 | Add Environment Info | System details, screenshots |

### Next Steps
Proceed to [02_Tasks-51-56_Feature-Task.md](02_Tasks-51-56_Feature-Task.md) for feature request and task templates.

---

## Notes for AI Agents

1. **YAML front matter:** Required for GitHub recognition
2. **Labels:** Auto-assign "bug" and "triage"
3. **Title prefix:** [BUG] for easy identification
4. **LKR currency:** Include for payment-related bugs
5. **Multi-tenant:** Add tenant ID field
6. **Screenshots:** Drag-drop support in GitHub
7. **Logs:** Include console and server log areas
