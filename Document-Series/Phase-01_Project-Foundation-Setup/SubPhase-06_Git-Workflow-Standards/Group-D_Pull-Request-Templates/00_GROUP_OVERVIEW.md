# Group D: Pull Request Templates

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** D of G  
> **Tasks Covered:** 33-44  
> **Group Goal:** Create comprehensive pull request templates for GitHub

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Commit-Message-Conventions/](../Group-C_Commit-Message-Conventions/)
- **→ Next Group:** [../Group-E_Issue-Templates/](../Group-E_Issue-Templates/)

---

## Group Overview

This group creates pull request templates for GitHub, ensuring consistent and thorough PR descriptions. Templates include checklists for testing, documentation, and breaking changes, plus specific templates for features, bugfixes, and hotfixes.

### Key Outcomes
- .github/ directory created
- Default PULL_REQUEST_TEMPLATE.md with comprehensive sections
- Description, type checklist, testing checklist included
- Documentation and breaking changes sections
- Related issues and screenshots sections
- Specialized templates for feature, bugfix, and hotfix PRs

### Technology Context
- **Platform:** GitHub
- **Location:** .github/ directory
- **Format:** Markdown templates
- **Types:** Default, Feature, Bugfix, Hotfix

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-37_PR-Template-Default.md | 33-37 | Create .github/, default PR template, description, type checklist, testing |
| 02 | 02_Tasks-38-41_PR-Template-Sections.md | 38-41 | Add documentation checklist, breaking changes, related issues, screenshots |
| 03 | 03_Tasks-42-44_PR-Template-Types.md | 42-44 | Create feature, bugfix, hotfix specific templates |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 33 | Create .github/ Directory | Task 01 | Simple |
| 34 | Create PULL_REQUEST_TEMPLATE.md | Task 33 | Medium |
| 35 | Add PR Description Section | Task 34 | Simple |
| 36 | Add PR Type Checklist | Task 34 | Simple |
| 37 | Add Testing Checklist | Task 34 | Simple |
| 38 | Add Documentation Checklist | Task 34 | Simple |
| 39 | Add Breaking Changes Section | Task 34 | Simple |
| 40 | Add Related Issues Section | Task 34 | Simple |
| 41 | Add Screenshots Section | Task 34 | Simple |
| 42 | Create Feature PR Template | Task 33 | Medium |
| 43 | Create Bugfix PR Template | Task 33 | Medium |
| 44 | Create Hotfix PR Template | Task 33 | Medium |

---

## Execution Order

```
01_Tasks-33-37_PR-Template-Default.md
        │
        ▼
02_Tasks-38-41_PR-Template-Sections.md
        │
        ▼
03_Tasks-42-44_PR-Template-Types.md
```

---

## Expected Deliverables

After completing this group:

```
.github/
├── PULL_REQUEST_TEMPLATE.md           # Default PR template
└── PULL_REQUEST_TEMPLATE/
    ├── feature.md                     # Feature PR template
    ├── bugfix.md                      # Bugfix PR template
    └── hotfix.md                      # Hotfix PR template
```

---

## PR Template Structure

**Default Template Sections:**
1. **Description** - What changes were made
2. **Type of Change** - Feature, bugfix, breaking change checklist
3. **Testing** - Tests added/updated checklist
4. **Documentation** - Docs updated checklist
5. **Breaking Changes** - List any breaking changes
6. **Related Issues** - Link to related issues (Fixes #123)
7. **Screenshots** - For UI changes

---

## Notes for AI Agents

1. **Dependencies:** Requires Git repository initialized
2. **GitHub Directory:** Create .github/ at repository root
3. **Template Location:** Specific templates in subdirectory
4. **Markdown Format:** Use GitHub-flavored Markdown
5. **Checklists:** Use `- [ ]` for checkboxes
6. **Git Commit:** Commit after completing this group

