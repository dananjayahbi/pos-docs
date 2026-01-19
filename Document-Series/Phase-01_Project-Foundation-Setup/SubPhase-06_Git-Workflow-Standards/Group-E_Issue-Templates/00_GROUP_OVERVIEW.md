# Group E: Issue Templates

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** E of G  
> **Tasks Covered:** 45-56  
> **Group Goal:** Create comprehensive issue templates for GitHub

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Pull-Request-Templates/](../Group-D_Pull-Request-Templates/)
- **→ Next Group:** [../Group-F_Code-Review-Guidelines/](../Group-F_Code-Review-Guidelines/)

---

## Group Overview

This group creates issue templates for GitHub, providing structured formats for bug reports, feature requests, and general tasks. The templates ensure all necessary information is captured when issues are created, improving team communication and issue resolution.

### Key Outcomes
- ISSUE_TEMPLATE/ directory created
- Bug report template with reproduction steps
- Feature request template with use case
- Task template for general work items
- config.yml for issue template chooser
- Environment and context sections included
- Labels auto-assigned per template type

### Technology Context
- **Platform:** GitHub Issues
- **Location:** .github/ISSUE_TEMPLATE/ directory
- **Format:** YAML front matter + Markdown body
- **Types:** Bug Report, Feature Request, Task

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-50_Bug-Report.md | 45-50 | Create ISSUE_TEMPLATE/, bug report template with all sections |
| 02 | 02_Tasks-51-56_Feature-Task.md | 51-56 | Create feature request, task templates, config.yml chooser |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Create ISSUE_TEMPLATE/ Directory | Task 33 | Simple |
| 46 | Create Bug Report Template | Task 45 | Medium |
| 47 | Add Bug Description Section | Task 46 | Simple |
| 48 | Add Reproduction Steps | Task 46 | Simple |
| 49 | Add Expected Behavior | Task 46 | Simple |
| 50 | Add Environment Info | Task 46 | Simple |
| 51 | Create Feature Request Template | Task 45 | Medium |
| 52 | Add Feature Description | Task 51 | Simple |
| 53 | Add Use Case Section | Task 51 | Simple |
| 54 | Add Alternatives Section | Task 51 | Simple |
| 55 | Create Task Template | Task 45 | Medium |
| 56 | Create config.yml | Task 45 | Medium |

---

## Execution Order

```
01_Tasks-45-50_Bug-Report.md
        │
        ▼
02_Tasks-51-56_Feature-Task.md
```

---

## Expected Deliverables

After completing this group:

```
.github/
└── ISSUE_TEMPLATE/
    ├── bug_report.md           # Bug report template
    ├── feature_request.md      # Feature request template
    ├── task.md                 # General task template
    └── config.yml              # Template chooser config
```

---

## Issue Template Structure

**Bug Report Template:**
- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, version)
- Screenshots/logs

**Feature Request Template:**
- Feature description
- Problem it solves
- Use case / user story
- Proposed solution
- Alternatives considered
- Additional context

---

## config.yml Example

```yaml
blank_issues_enabled: false
contact_links:
  - name: 📚 Documentation
    url: https://docs.example.com
    about: Check our documentation first
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete (.github/ exists)
2. **YAML Front Matter:** Include name, about, title, labels, assignees
3. **Labels:** Auto-assign labels like "bug", "enhancement"
4. **Config:** Disable blank issues to force template usage
5. **Markdown Body:** Clear sections with headers
6. **Git Commit:** Commit after completing this group

