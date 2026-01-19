# Group F: Code Review Guidelines

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** F of G  
> **Tasks Covered:** 57-66  
> **Group Goal:** Establish code review guidelines and CODEOWNERS file

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Issue-Templates/](../Group-E_Issue-Templates/)
- **→ Next Group:** [../Group-G_GitHub-Configuration-Verification/](../Group-G_GitHub-Configuration-Verification/)

---

## Group Overview

This group establishes code review guidelines for the team, covering review scope, quality criteria, security considerations, and approval requirements. A CODEOWNERS file is created to automatically assign reviewers based on file paths.

### Key Outcomes
- CODE_REVIEW.md documentation created
- Review scope and criteria defined
- Code quality, security, performance review points
- Review timeline and approval requirements
- Comprehensive reviewer checklist
- Comment guidelines for constructive feedback
- CODEOWNERS file for automatic reviewer assignment

### Technology Context
- **Platform:** GitHub Pull Requests
- **Documentation:** Markdown files in docs/
- **Ownership:** CODEOWNERS in .github/
- **Reviews:** At least 1 approval required

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-61_Review-Guidelines.md | 57-61 | Create CODE_REVIEW.md, define scope, quality, security, performance criteria |
| 02 | 02_Tasks-62-66_Review-Process.md | 62-66 | Define timeline, approvals, checklist, comment guidelines, CODEOWNERS |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 57 | Create CODE_REVIEW.md | Task 08 | Medium |
| 58 | Define Review Scope | Task 57 | Simple |
| 59 | Define Code Quality Criteria | Task 57 | Medium |
| 60 | Define Security Review Points | Task 57 | Medium |
| 61 | Define Performance Review | Task 57 | Medium |
| 62 | Define Review Timeline | Task 57 | Simple |
| 63 | Define Approval Requirements | Task 57 | Simple |
| 64 | Create Review Checklist | Task 58-61 | Medium |
| 65 | Define Comment Guidelines | Task 57 | Simple |
| 66 | Create CODEOWNERS File | Task 33 | Medium |

---

## Execution Order

```
01_Tasks-57-61_Review-Guidelines.md
        │
        ▼
02_Tasks-62-66_Review-Process.md
```

---

## Expected Deliverables

After completing this group:

```
/                            # Repository root
├── .github/
│   └── CODEOWNERS           # Code ownership file
└── docs/
    └── CODE_REVIEW.md       # Code review guidelines
```

---

## Code Review Criteria

**Code Quality:**
- Readability and maintainability
- Consistent naming conventions
- No magic numbers or hardcoded values
- Proper error handling
- DRY principle followed

**Security:**
- No hardcoded secrets
- Input validation
- SQL injection prevention
- XSS prevention
- Proper authentication checks

**Performance:**
- Efficient algorithms
- Database query optimization
- No N+1 query problems
- Proper caching usage

---

## CODEOWNERS Example

```
# Backend
backend/                     @backend-team
backend/apps/auth/           @security-team

# Frontend
frontend/                    @frontend-team

# Infrastructure
docker/                      @devops-team
.github/                     @devops-team
```

---

## Notes for AI Agents

1. **Dependencies:** Requires .github/ directory exists
2. **Constructive Feedback:** Guidelines should emphasize positive tone
3. **Timeline:** Define expected review turnaround (24-48 hours)
4. **Approvals:** Typically 1-2 required approvals
5. **CODEOWNERS:** Use team handles where possible
6. **Git Commit:** Commit after completing this group

