# Tasks 67-71: Community Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** G - GitHub Configuration & Verification  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Code-Review-Guidelines/](../Group-F_Code-Review-Guidelines/)
- **→ Next Document:** [02_Tasks-72-76_Protection-Verification.md](02_Tasks-72-76_Protection-Verification.md)

---

## Document Overview

This document covers the creation of repository community files and the README and CHANGELOG updates required for GitHub community standards.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create CONTRIBUTING.md | Medium |
| 68 | Create CODE_OF_CONDUCT.md | Simple |
| 69 | Create SECURITY.md | Medium |
| 70 | Update README.md | Medium |
| 71 | Create CHANGELOG.md Template | Simple |

---

## Task 67: Create CONTRIBUTING.md

### Overview
Create contribution guidelines that explain how developers can participate, with clear expectations for workflow, reviews, and standards.

### Dependencies
- Task 08: Create CODE_OF_CONDUCT.md (SubPhase-01)

### Instructions

1. **Create the CONTRIBUTING.md file**
   - Place the file at the repository root
   - Keep the structure consistent with the rest of the documentation series

2. **Add contribution scope and purpose**
   - Explain what contributions are welcome (features, fixes, documentation, localization)
   - Include Sinhala and Tamil localization contributions

3. **Define workflow expectations**
   - Refer to the branching strategy from SubPhase-06 Group B
   - Refer to commit message conventions from SubPhase-06 Group C
   - Refer to the pull request template from SubPhase-06 Group D

4. **Define quality gates**
   - Note required tests for new features and bug fixes
   - Require documentation updates for behavior changes

5. **Add review expectations**
   - State review turnaround expectations
   - Explain how to respond to review feedback

6. **Add support and contact guidance**
   - Link to SECURITY.md for vulnerabilities
   - Provide a general contact placeholder for non-security inquiries

### Expected Outcome
- A repository root `CONTRIBUTING.md` file with clear contribution guidance

### Verification Checklist
- [ ] `CONTRIBUTING.md` exists in the repository root
- [ ] Contribution paths include code, docs, and localization
- [ ] Workflow references align with SubPhase-06 standards
- [ ] Security reporting is linked

---

## Task 68: Create CODE_OF_CONDUCT.md

### Overview
Create a code of conduct using Contributor Covenant 2.1 with project-specific contact details.

### Dependencies
- Task 08: Create CODE_OF_CONDUCT.md (SubPhase-01)

### Instructions

1. **Create the CODE_OF_CONDUCT.md file**
   - Place the file at the repository root

2. **Use Contributor Covenant 2.1 structure**
   - Include pledge, standards, enforcement, scope, and attribution sections

3. **Add project-specific reporting contact**
   - Use a placeholder contact address suitable for later update

4. **Include enforcement response expectations**
   - Provide a response time target for reports

### Expected Outcome
- A repository root `CODE_OF_CONDUCT.md` file aligned to Contributor Covenant 2.1

### Verification Checklist
- [ ] `CODE_OF_CONDUCT.md` exists in the repository root
- [ ] Enforcement contact is included
- [ ] Attribution is present

---

## Task 69: Create SECURITY.md

### Overview
Define the security policy and vulnerability disclosure process for the project.

### Dependencies
- Task 08: Create CODE_OF_CONDUCT.md (SubPhase-01)

### Instructions

1. **Create the SECURITY.md file**
   - Place the file at the repository root

2. **Define supported versions policy**
   - State how support is determined for releases and patches

3. **Describe vulnerability reporting**
   - Provide a private reporting channel placeholder
   - State expected response timeline

4. **Define disclosure timeline**
   - Outline triage, remediation, and coordinated disclosure steps

5. **Add acknowledgment and credit policy**
   - State how reporters will be credited

### Expected Outcome
- A repository root `SECURITY.md` file with reporting and disclosure guidance

### Verification Checklist
- [ ] `SECURITY.md` exists in the repository root
- [ ] Reporting channel and response timeline are defined
- [ ] Disclosure process is documented

---

## Task 70: Update README.md

### Overview
Update the README to include workflow references and community files, with Sri Lanka-specific context maintained.

### Dependencies
- Task 08: Create CODE_OF_CONDUCT.md (SubPhase-01)

### Instructions

1. **Add community and workflow section**
   - Link to CONTRIBUTING.md, CODE_OF_CONDUCT.md, and SECURITY.md
   - Reference the branch and PR workflow documents

2. **Add changelog reference**
   - Link to CHANGELOG.md and describe its purpose

3. **Maintain Sri Lanka-specific context**
   - Ensure mention of LKR (₨), Sinhala/Sinhaglish support, and Asia/Colombo timezone
   - Keep local integrations referenced where appropriate

4. **Add documentation index reference**
   - Link to this documentation series summary for navigation

### Expected Outcome
- README updated with community, workflow, and changelog references

### Verification Checklist
- [ ] README references CONTRIBUTING, CODE_OF_CONDUCT, and SECURITY
- [ ] README references CHANGELOG
- [ ] Sri Lanka-specific context remains intact

---

## Task 71: Create CHANGELOG.md Template

### Overview
Create a Keep a Changelog-aligned template for tracking project changes.

### Dependencies
- Task 08: Create CODE_OF_CONDUCT.md (SubPhase-01)

### Instructions

1. **Create the CHANGELOG.md file**
   - Place the file at the repository root

2. **Follow Keep a Changelog format**
   - Include an Unreleased section with standard change categories
   - Reference Semantic Versioning guidance

3. **Add initial version placeholder**
   - Include an initial release entry for the project setup

### Expected Outcome
- A repository root `CHANGELOG.md` file with Keep a Changelog structure

### Verification Checklist
- [ ] `CHANGELOG.md` exists in the repository root
- [ ] Unreleased section includes standard categories
- [ ] Semantic Versioning is referenced

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Create CONTRIBUTING.md | `CONTRIBUTING.md` contribution guidance |
| 68 | Create CODE_OF_CONDUCT.md | `CODE_OF_CONDUCT.md` community standards |
| 69 | Create SECURITY.md | `SECURITY.md` security policy |
| 70 | Update README.md | README workflow and community references |
| 71 | Create CHANGELOG.md Template | `CHANGELOG.md` change tracking |

### Next Steps
- Proceed to [02_Tasks-72-76_Protection-Verification.md](02_Tasks-72-76_Protection-Verification.md) to document branch protection and verification tasks

---

## Notes for AI Agents

1. **Execution Order:** Tasks 67-71 can be completed in sequence as listed
2. **Contributor Covenant:** Use version 2.1 structure for the code of conduct
3. **Sri Lanka Context:** Preserve LKR (₨), Sinhala/Sinhaglish, and Asia/Colombo references
4. **Placeholders:** Use placeholder contacts for security and conduct reporting
