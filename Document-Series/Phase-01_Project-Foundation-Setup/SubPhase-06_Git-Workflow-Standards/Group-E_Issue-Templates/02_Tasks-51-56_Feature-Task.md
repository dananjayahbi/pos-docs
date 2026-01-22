# Tasks 51-56: Feature Request & Task Templates

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** E - Issue Templates  
> **Document:** 02 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-50_Bug-Report.md](01_Tasks-45-50_Bug-Report.md)
- **→ Next Document:** [../Group-F_Code-Review-Guidelines/00_GROUP_OVERVIEW.md](../Group-F_Code-Review-Guidelines/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers feature request template, task template, and config.yml creation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create Feature Request Template | Medium |
| 52 | Add Feature Description | Simple |
| 53 | Add Use Case Section | Simple |
| 54 | Add Alternatives Section | Simple |
| 55 | Create Task Template | Medium |
| 56 | Create config.yml | Medium |

---

## Task 51: Create Feature Request Template

### Overview
Create feature request template with YAML front matter.

### Dependencies
- Task 45: ISSUE_TEMPLATE/ directory exists

### Instructions

1. **Create template file**
   - feature_request.md in ISSUE_TEMPLATE/

2. **Add YAML front matter**
   - Name, description, labels

3. **Add template structure**
   - Feature-specific sections

### Feature Request Template File

Create file: `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: ✨ Feature Request
about: Suggest a new feature for LankaCommerce Cloud
title: "[FEATURE] "
labels: enhancement, triage
assignees: ''
---

<!--
LankaCommerce Cloud - Feature Request Template
Please fill out all sections to help us understand your feature request.
-->

## Feature Summary

<!-- A clear and concise description of the feature you're requesting -->

**One-Line Summary:**


**Target Module:**
<!-- Which part of the system should this feature be in? -->
- [ ] POS System
- [ ] ERP Dashboard
- [ ] Webstore
- [ ] API
- [ ] Mobile App
- [ ] Admin Panel
- [ ] Integrations
- [ ] Other: ___________

**Feature Type:**
- [ ] New functionality
- [ ] Enhancement of existing feature
- [ ] Performance improvement
- [ ] UX/UI improvement
- [ ] Developer experience
- [ ] Other: ___________

---

## Problem Statement

<!-- What problem does this feature solve? -->

**Is your feature request related to a problem?**
<!-- A clear and concise description of what the problem is. Ex. I'm always frustrated when [...] -->


**Current Workaround (if any):**
<!-- How are you handling this today? -->


**Impact of Not Having This Feature:**
<!-- What happens if we don't build this? -->


---

## Proposed Solution

<!-- Describe the solution you'd like -->

**Detailed Description:**


**User Story:**
<!-- As a [role], I want [feature] so that [benefit] -->
As a __________________, I want __________________ so that __________________

**Acceptance Criteria:**
<!-- What would need to be true for this feature to be complete? -->
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## User Experience

<!-- How would users interact with this feature? -->

**User Flow:**
1. User navigates to...
2. User clicks...
3. System displays...
4. User completes...

**Mockups/Wireframes:**
<!-- If you have any visual ideas, attach them here -->


---

## Alternatives Considered

<!-- Describe alternatives you've considered -->

| Alternative | Pros | Cons |
|-------------|------|------|
| | | |
| | | |

**Why is the proposed solution preferred?**


---

## Additional Context

<!-- Add any other context about the feature request here -->

**Business Value:**
- Revenue impact: 
- User satisfaction: 
- Competitive advantage: 

**Priority Suggestion:**
- [ ] Critical - Needed immediately
- [ ] High - Needed this quarter
- [ ] Medium - Needed this year
- [ ] Low - Nice to have

**Target Users:**
<!-- Who would benefit from this feature? -->
- [ ] All tenants
- [ ] Specific tenant types: 
- [ ] Specific user roles: 

**Dependencies:**
<!-- Does this depend on other features or work? -->
- 

**References:**
<!-- Links to related discussions, competitor features, research, etc. -->
- 

```

### Expected Outcome
- Feature request template created
- YAML front matter configured

### Verification Checklist
- [ ] File created at correct path
- [ ] YAML front matter valid
- [ ] Labels auto-assigned (enhancement)
- [ ] Title prefix set [FEATURE]

---

## Task 52: Add Feature Description

### Overview
Ensure feature description section is comprehensive.

### Dependencies
- Task 51: Feature request template exists

### Instructions

1. **Review summary section**
   - Clear feature description

2. **Add target module**
   - Where feature belongs

3. **Add feature type**
   - Classification

### Feature Description Content

```markdown
## Feature Summary

<!-- A clear and concise description of the feature you're requesting -->

**One-Line Summary:**
<!-- Write one sentence describing the feature -->


**Detailed Description:**
<!-- Expand on what this feature would do -->


**Target Module:**
<!-- Which part of the system should this feature be in? -->
- [ ] POS System
  - [ ] Sales/Checkout
  - [ ] Inventory lookup
  - [ ] Customer management
- [ ] ERP Dashboard
  - [ ] Inventory management
  - [ ] Sales analytics
  - [ ] Financial reports
- [ ] Webstore
  - [ ] Product catalog
  - [ ] Shopping cart
  - [ ] Checkout
- [ ] API
- [ ] Mobile App
- [ ] Admin Panel
- [ ] Integrations
- [ ] Other: ___________

**Feature Type:**
- [ ] 🆕 New functionality - Entirely new capability
- [ ] 🔧 Enhancement - Improve existing feature
- [ ] ⚡ Performance - Make something faster
- [ ] 🎨 UX/UI - Improve user experience
- [ ] 🔌 Integration - Connect with external service
- [ ] 📱 Platform - New platform support
- [ ] Other: ___________

**Scope:**
- [ ] Small - Few hours of work
- [ ] Medium - Few days of work
- [ ] Large - Weeks of work
- [ ] Epic - Multiple sprints

```

### Expected Outcome
- Comprehensive description section
- Clear classification options

### Verification Checklist
- [ ] One-line summary prompt
- [ ] Detailed description area
- [ ] Module selection
- [ ] Feature type classification
- [ ] Scope estimation

---

## Task 53: Add Use Case Section

### Overview
Add use case and user story sections.

### Dependencies
- Task 51: Feature request template exists

### Instructions

1. **Add user story format**
   - As a... I want... so that...

2. **Add user flow**
   - Step-by-step interaction

3. **Add acceptance criteria**
   - Definition of done

### Use Case Section Content

```markdown
## Use Cases

### Primary User Story
<!-- As a [role], I want [feature] so that [benefit] -->
**As a** __________________,  
**I want** __________________  
**so that** __________________

### Additional User Stories
<!-- Add more user stories if applicable -->
1. As a ________, I want ________ so that ________
2. As a ________, I want ________ so that ________

---

## User Experience

### User Personas
<!-- Who would use this feature? -->
- [ ] Store Owner - Manages the business
- [ ] Store Manager - Daily operations
- [ ] Cashier/Staff - Point of sale
- [ ] Accountant - Financial management
- [ ] Customer - Shopping experience
- [ ] System Admin - Technical management
- [ ] Other: ___________

### User Flow
<!-- Step by step how the user would interact with this feature -->

**Entry Point:**
<!-- How does the user get to this feature? -->


**Main Flow:**
1. 
2. 
3. 
4. 

**Success State:**
<!-- What does success look like? -->


**Error Handling:**
<!-- What happens if something goes wrong? -->


### Acceptance Criteria
<!-- Specific, measurable conditions that must be met -->
- [ ] Given [context], when [action], then [expected result]
- [ ] Given ________, when ________, then ________
- [ ] Given ________, when ________, then ________

### Mockups / Wireframes
<!-- Attach visual designs if available -->
<!-- Drag and drop images or paste URLs -->

```

### Sri Lanka-Specific Use Cases

| Feature Type | Local Consideration |
|--------------|---------------------|
| Currency | LKR (₨) display and calculations |
| Language | Sinhala/Sinhaglish support |
| Phone | +94 format validation |
| Time | Asia/Colombo timezone |

### Expected Outcome
- User story format included
- User flow documented
- Acceptance criteria defined

### Verification Checklist
- [ ] User story format
- [ ] Persona selection
- [ ] Step-by-step flow
- [ ] Acceptance criteria
- [ ] Mockup area

---

## Task 54: Add Alternatives Section

### Overview
Add alternatives and additional context sections.

### Dependencies
- Task 51: Feature request template exists

### Instructions

1. **Add alternatives table**
   - Other approaches considered

2. **Add business value**
   - Impact justification

3. **Add priority and references**
   - Importance indicators

### Alternatives Section Content

```markdown
## Alternatives Considered

<!-- Have you considered other approaches? -->

### Alternative Solutions

| # | Alternative | Description | Pros | Cons |
|---|-------------|-------------|------|------|
| 1 | | | | |
| 2 | | | | |
| 3 | Do nothing | Keep current behavior | No development cost | Problem persists |

**Why is the proposed solution preferred?**
<!-- Explain why your proposed solution is better than the alternatives -->


---

## Business Case

### Business Value
<!-- Why should we build this? -->

**Revenue Impact:**
- [ ] Direct revenue increase
- [ ] Cost reduction
- [ ] Customer retention
- [ ] Market expansion
- [ ] Other: 

**Quantified Value (if possible):**
<!-- E.g., "Could increase sales by 10%" -->


### Priority Suggestion
- [ ] 🔴 Critical - Blocking issue, needed immediately
- [ ] 🟠 High - Important for this quarter
- [ ] 🟡 Medium - Plan for this year
- [ ] 🟢 Low - Nice to have, backlog

### Target Users
<!-- Who would benefit from this feature? -->
- Affected user roles: 
- Estimated users impacted: 
- Tenant types: [ ] All / [ ] Specific: 

---

## Technical Considerations

### Dependencies
<!-- Does this depend on other features or work? -->
- Depends on: #
- Related to: #
- Blocked by: #

### Technical Notes
<!-- Any technical considerations for implementers -->


### Risks
<!-- What could go wrong? -->
- 

---

## Additional Context

### Research / References
<!-- Links to related information -->
- Competitor example: 
- User research: 
- Documentation: 
- Slack discussion: 

### Related Issues / PRs
- Related: #
- Similar: #
- Duplicate of: #

### Additional Notes
<!-- Anything else that might be helpful -->


```

### Expected Outcome
- Alternatives documented
- Business case included
- Complete context provided

### Verification Checklist
- [ ] Alternatives table
- [ ] Business value section
- [ ] Priority suggestion
- [ ] Technical considerations
- [ ] References area

---

## Task 55: Create Task Template

### Overview
Create general task template for work items.

### Dependencies
- Task 45: ISSUE_TEMPLATE/ directory exists

### Instructions

1. **Create template file**
   - task.md in ISSUE_TEMPLATE/

2. **Add YAML front matter**
   - Name, description, labels

3. **Add task structure**
   - General work item sections

### Task Template File

Create file: `.github/ISSUE_TEMPLATE/task.md`

```markdown
---
name: 📋 Task
about: Create a general task or work item
title: "[TASK] "
labels: task
assignees: ''
---

<!--
LankaCommerce Cloud - Task Template
Use this for general work items, chores, or technical tasks.
-->

## Task Summary

<!-- A clear and concise description of the task -->

**What needs to be done?**


**Why is this needed?**


---

## Task Details

### Type of Work
- [ ] Technical debt
- [ ] Refactoring
- [ ] Documentation
- [ ] Research / Spike
- [ ] Configuration
- [ ] Infrastructure
- [ ] Testing
- [ ] Chore / Maintenance
- [ ] Other: ___________

### Affected Areas
- [ ] Backend
- [ ] Frontend
- [ ] Database
- [ ] Infrastructure
- [ ] CI/CD
- [ ] Documentation
- [ ] Other: ___________

---

## Requirements

### Definition of Done
<!-- What needs to be true for this task to be complete? -->
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Out of Scope
<!-- What is explicitly NOT part of this task? -->
- 

---

## Implementation Notes

### Approach
<!-- Any notes on how this should be implemented -->


### Technical Considerations
<!-- Things to keep in mind -->
- 

### Files to Modify
<!-- List known files that need changes -->
- 

---

## Estimation

### Size
- [ ] XS - Less than 1 hour
- [ ] S - Few hours
- [ ] M - 1 day
- [ ] L - Few days
- [ ] XL - Week+

### Priority
- [ ] High - Do this sprint
- [ ] Medium - Do soon
- [ ] Low - Backlog

---

## Related Items

**Parent Issue / Epic:** #
**Blocked By:** #
**Blocks:** #
**Related:** #

---

## Additional Context

<!-- Any other relevant information -->


```

### Task vs Feature vs Bug

| Type | Template | Use When |
|------|----------|----------|
| Bug | bug_report.md | Something is broken |
| Feature | feature_request.md | New user-facing functionality |
| Task | task.md | Technical work, maintenance, docs |

### Expected Outcome
- Task template created
- General work items supported

### Verification Checklist
- [ ] File created at correct path
- [ ] YAML front matter valid
- [ ] Labels auto-assigned (task)
- [ ] Title prefix set [TASK]
- [ ] Estimation section included

---

## Task 56: Create config.yml

### Overview
Create config.yml for issue template chooser.

### Dependencies
- Task 45: ISSUE_TEMPLATE/ directory exists

### Instructions

1. **Create config file**
   - config.yml in ISSUE_TEMPLATE/

2. **Disable blank issues**
   - Force template usage

3. **Add contact links**
   - External resources

### config.yml File

Create file: `.github/ISSUE_TEMPLATE/config.yml`

```yaml
# LankaCommerce Cloud - Issue Template Configuration
# This file configures the issue template chooser

# Disable blank issues to ensure all issues use a template
blank_issues_enabled: false

# External links shown in the issue template chooser
contact_links:
  - name: 📚 Documentation
    url: https://docs.lankacommerce.cloud
    about: Check our documentation before opening an issue
  
  - name: 💬 Community Discussions
    url: https://github.com/lankacommerce/cloud/discussions
    about: Ask questions and share ideas with the community
  
  - name: 🔒 Security Vulnerability
    url: https://github.com/lankacommerce/cloud/security/advisories/new
    about: Report security vulnerabilities privately
  
  - name: 💡 Ideas & Roadmap
    url: https://github.com/lankacommerce/cloud/projects
    about: View our roadmap and vote on upcoming features
```

### Config Options

| Option | Purpose | Value |
|--------|---------|-------|
| blank_issues_enabled | Allow issues without template | false (recommended) |
| contact_links | External resource links | Array of links |

### Contact Link Structure

```yaml
contact_links:
  - name: Display Name       # Required: Shown in chooser
    url: https://...         # Required: Where to link
    about: Description       # Required: Brief explanation
```

### Issue Template Chooser

When a user creates a new issue, GitHub shows:

```
Choose a template:

🐛 Bug Report
   Report a bug to help us improve LankaCommerce Cloud

✨ Feature Request
   Suggest a new feature for LankaCommerce Cloud

📋 Task
   Create a general task or work item

────────────────────────────

📚 Documentation
   Check our documentation before opening an issue

💬 Community Discussions
   Ask questions and share ideas with the community

🔒 Security Vulnerability
   Report security vulnerabilities privately
```

### Expected Outcome
- config.yml created
- Blank issues disabled
- Contact links configured

### Verification Checklist
- [ ] YAML syntax valid
- [ ] Blank issues disabled
- [ ] Documentation link
- [ ] Security reporting link
- [ ] Discussions link

---

## Complete Directory Structure

After completing Group E:

```
.github/
├── PULL_REQUEST_TEMPLATE.md
├── PULL_REQUEST_TEMPLATE/
│   ├── feature.md
│   ├── bugfix.md
│   └── hotfix.md
└── ISSUE_TEMPLATE/
    ├── bug_report.md           # Task 46-50
    ├── feature_request.md      # Task 51-54
    ├── task.md                 # Task 55
    └── config.yml              # Task 56
```

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 51 | Create Feature Request Template | feature_request.md |
| 52 | Add Feature Description | Summary, module, type |
| 53 | Add Use Case Section | User story, flow, criteria |
| 54 | Add Alternatives Section | Alternatives, business case |
| 55 | Create Task Template | task.md |
| 56 | Create config.yml | Issue chooser config |

### Group E Complete

All Issue Templates configured:

1. ✅ ISSUE_TEMPLATE/ directory created
2. ✅ Bug report template with all sections
3. ✅ Feature request template with use cases
4. ✅ Task template for general work
5. ✅ config.yml with chooser settings

### Next Steps
Proceed to [../Group-F_Code-Review-Guidelines/00_GROUP_OVERVIEW.md](../Group-F_Code-Review-Guidelines/00_GROUP_OVERVIEW.md) for code review guidelines.

---

## Notes for AI Agents

1. **YAML syntax:** Validate config.yml carefully
2. **Blank issues:** Disable to force templates
3. **Labels:** Each template auto-assigns different labels
4. **Title prefix:** [BUG], [FEATURE], [TASK]
5. **Security:** Use GitHub's private reporting
6. **Contact links:** Include docs and discussions
7. **User stories:** Use standard format
8. **LKR currency:** Reference in relevant features
