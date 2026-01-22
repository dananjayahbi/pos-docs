# Tasks 62-66: Review Process & CODEOWNERS

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** F - Code Review Guidelines  
> **Document:** 02 of 02  
> **Tasks Covered:** 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-57-61_Review-Guidelines.md](01_Tasks-57-61_Review-Guidelines.md)
- **→ Next Document:** [../Group-G_GitHub-Configuration-Verification/00_GROUP_OVERVIEW.md](../Group-G_GitHub-Configuration-Verification/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers review process, checklist, and CODEOWNERS file creation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 62 | Define Review Timeline | Simple |
| 63 | Define Approval Requirements | Simple |
| 64 | Create Review Checklist | Medium |
| 65 | Define Comment Guidelines | Simple |
| 66 | Create CODEOWNERS File | Medium |

---

## Task 62: Define Review Timeline

### Overview
Define expected turnaround time for reviews.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define initial response time**
   - When to start reviewing

2. **Define completion expectations**
   - Turnaround time

3. **Define escalation process**
   - When reviews are delayed

### Review Timeline Content

```markdown
## Review Timeline

### Expected Turnaround Times

| Priority | Initial Response | Complete Review |
|----------|------------------|-----------------|
| Hotfix | < 1 hour | < 2 hours |
| High | < 4 hours | < 8 hours |
| Normal | < 24 hours | < 48 hours |
| Low | < 48 hours | < 72 hours |

### Timeline Guidelines

**For Authors:**
- Tag reviewers when PR is ready
- Respond to feedback within 24 hours
- Keep PRs small to enable faster reviews
- Mark as "Ready for Review" when complete

**For Reviewers:**
- Acknowledge PR within timeline
- If busy, reassign or communicate delay
- Complete review in single session if possible
- Don't block on minor issues

### Response Time Expectations

| Action | Expected Time |
|--------|---------------|
| Initial acknowledgment | Within 4 hours (business hours) |
| First round of comments | Within 24 hours |
| Re-review after changes | Within 8 hours |
| Final approval | Within 4 hours of changes |

### Escalation Process

**If review is delayed:**

1. **24 hours:** Author pings reviewer
2. **48 hours:** Author adds additional reviewer
3. **72 hours:** Escalate to team lead
4. **Emergency:** Team lead can approve or find alternate reviewer

### Business Hours

**LankaCommerce operates in:**
- Timezone: Asia/Colombo (UTC+5:30)
- Business hours: 9:00 AM - 6:00 PM
- Business days: Monday - Friday

*After-hours PRs: Response expected next business day*

```

### Expected Outcome
- Clear timeline expectations
- Escalation process defined

### Verification Checklist
- [ ] Response times defined
- [ ] Priority levels clear
- [ ] Escalation process
- [ ] Business hours noted

---

## Task 63: Define Approval Requirements

### Overview
Define how many approvals are needed.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define required approvals**
   - Number of approvals

2. **Define who can approve**
   - Team members

3. **Define special cases**
   - Hotfixes, critical changes

### Approval Requirements Content

```markdown
## Approval Requirements

### Standard Approval Matrix

| PR Type | Required Approvals | Approved By |
|---------|-------------------|-------------|
| Feature | 1 | Any team member |
| Bugfix | 1 | Any team member |
| Hotfix | 1 (expedited) | Team lead or designated |
| Breaking change | 2 | Including senior dev |
| Security change | 2 | Including security reviewer |
| Infrastructure | 2 | Including DevOps |
| Multi-tenant change | 2 | Including architect |

### Approval Levels

**Level 1 - Standard (1 approval):**
- Regular features
- Bug fixes
- Documentation updates
- Test additions
- Minor refactoring

**Level 2 - Critical (2 approvals):**
- Database schema changes
- Authentication/authorization changes
- Payment processing changes
- Multi-tenant isolation changes
- Breaking API changes
- Core infrastructure changes

### Who Can Approve

| Role | Approval Scope |
|------|----------------|
| Junior Developer | Cannot approve alone |
| Developer | Level 1 changes |
| Senior Developer | All changes |
| Tech Lead | All changes + expedited |
| Architect | All changes + design decisions |

### Conditions for Approval

Before approving, ensure:

- [ ] All review criteria checked
- [ ] No blocking comments unresolved
- [ ] Tests pass
- [ ] No merge conflicts
- [ ] Documentation updated

### Cannot Approve

- Your own PR (self-approval disabled)
- If you authored any commits in the PR
- If you have conflicts of interest

### Emergency/Hotfix Process

For production emergencies:

1. Expedited review with 1 approval
2. Team lead or designated reviewer approves
3. Post-merge review by additional reviewer
4. Post-mortem within 48 hours

```

### Expected Outcome
- Approval levels defined
- Special cases covered

### Verification Checklist
- [ ] Approval matrix
- [ ] Who can approve
- [ ] Level 2 (critical) defined
- [ ] Emergency process
- [ ] Self-approval prevention

---

## Task 64: Create Review Checklist

### Overview
Create comprehensive reviewer checklist.

### Dependencies
- Tasks 58-61: Review criteria defined

### Instructions

1. **Compile all criteria**
   - From previous tasks

2. **Create checklist format**
   - Easy to follow

3. **Add priority markers**
   - Must-check vs nice-to-have

### Reviewer Checklist Content

```markdown
## Reviewer Checklist

Use this checklist for every code review.

### 🔴 Must Check (Blocking)

#### Functionality
- [ ] Code does what the PR description says
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

#### Security (Critical)
- [ ] No hardcoded secrets or credentials
- [ ] User input is validated and sanitized
- [ ] SQL uses parameterized queries
- [ ] Output is properly escaped (XSS prevention)
- [ ] Authentication/authorization is correct
- [ ] No sensitive data in logs
- [ ] Multi-tenant isolation maintained

#### Tests
- [ ] New code has tests
- [ ] Tests actually test the functionality
- [ ] All tests pass
- [ ] Edge cases are tested

#### Breaking Changes
- [ ] Breaking changes are documented
- [ ] Migration path is provided
- [ ] Backwards compatibility considered

### 🟡 Should Check (Important)

#### Code Quality
- [ ] Code is readable and maintainable
- [ ] Naming is clear and consistent
- [ ] No unnecessary complexity
- [ ] DRY principle followed
- [ ] No code smells

#### Performance
- [ ] No N+1 query problems
- [ ] Efficient algorithms used
- [ ] Database queries are optimized
- [ ] Appropriate caching applied

#### Documentation
- [ ] Code comments where needed
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] CHANGELOG updated

### 🟢 Nice to Have (Suggestions)

#### Style & Consistency
- [ ] Follows project conventions
- [ ] Consistent with existing code
- [ ] Could be improved (minor suggestions)

#### Learning & Sharing
- [ ] Knowledge sharing opportunities
- [ ] Better approaches to suggest
- [ ] Patterns to highlight

---

### Quick Checklist (Copy-Paste)

```markdown
**Review Checklist:**
- [ ] Functionality works as described
- [ ] No security issues
- [ ] Tests added and passing
- [ ] No breaking changes (or documented)
- [ ] Code is readable
- [ ] No performance issues
- [ ] Documentation updated

**Approval:** ✅ Approved / 🔄 Request Changes / 💬 Comment
```

```

### Expected Outcome
- Comprehensive checklist
- Priority levels marked

### Verification Checklist
- [ ] All criteria included
- [ ] Priority levels (🔴🟡🟢)
- [ ] Blocking items identified
- [ ] Quick checklist version

---

## Task 65: Define Comment Guidelines

### Overview
Define guidelines for review comments.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define comment types**
   - Blocking, suggestion, question

2. **Define tone guidelines**
   - Constructive feedback

3. **Add examples**
   - Good vs bad comments

### Comment Guidelines Content

```markdown
## Comment Guidelines

### Comment Types

Use prefixes to clarify intent:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `[BLOCKING]` | Must fix before merge | `[BLOCKING] SQL injection risk here` |
| `[SUGGESTION]` | Optional improvement | `[SUGGESTION] Could use a list comprehension` |
| `[QUESTION]` | Seeking clarification | `[QUESTION] Why is this async?` |
| `[NIT]` | Minor style issue | `[NIT] Extra blank line` |
| `[PRAISE]` | Positive feedback | `[PRAISE] Great error handling!` |

### Tone Guidelines

**Do:**
- Be constructive and respectful
- Focus on the code, not the person
- Explain why, not just what
- Ask questions instead of making demands
- Acknowledge good work
- Assume the author had good reasons

**Don't:**
- Use harsh or condescending language
- Make personal attacks
- Be dismissive
- Use ALL CAPS
- Leave vague comments like "This is wrong"
- Pile on with multiple reviewers saying the same thing

### Good vs Bad Comments

| ❌ Bad | ✅ Good |
|--------|---------|
| "This is wrong" | "This might cause X because Y. Consider Z instead?" |
| "Why did you do this?" | "[QUESTION] I'm curious about the reasoning here - was it for performance?" |
| "You should know better" | "[SUGGESTION] Django provides `get_object_or_404` for this pattern" |
| "Fix this" | "[BLOCKING] This could expose user data. We need to add tenant filtering here." |
| No comment on good code | "[PRAISE] Nice use of the factory pattern here!" |

### Providing Context

**Include:**
- The problem you see
- Why it's a problem
- A suggested solution
- Reference to documentation if applicable

**Example:**
```markdown
[BLOCKING] Security issue

This query uses string formatting which could allow SQL injection:
```python
query = f"SELECT * FROM users WHERE id = {user_id}"
```

Please use Django ORM or parameterized queries:
```python
User.objects.filter(id=user_id)
```

See: https://docs.djangoproject.com/en/stable/topics/security/#sql-injection-protection
```

### Responding to Feedback

**As an Author:**
- Thank reviewers for their time
- Respond to all comments
- Explain your reasoning if disagreeing
- Mark resolved comments as resolved
- Request re-review when changes are made

**As a Reviewer:**
- Acknowledge when feedback is addressed
- Approve promptly when satisfied
- Don't re-review already approved items

### Comment Resolution

| Status | Meaning |
|--------|---------|
| Open | Needs attention |
| Resolved | Addressed by author |
| Outdated | Code has changed |
| Won't Fix | Intentionally not addressed (with explanation) |

```

### Expected Outcome
- Clear comment guidelines
- Positive tone emphasized

### Verification Checklist
- [ ] Comment prefixes defined
- [ ] Tone guidelines
- [ ] Good vs bad examples
- [ ] Providing context
- [ ] Resolution process

---

## Task 66: Create CODEOWNERS File

### Overview
Create CODEOWNERS file for automatic reviewer assignment.

### Dependencies
- Task 33: .github/ directory exists

### Instructions

1. **Create CODEOWNERS file**
   - In .github/ directory

2. **Define ownership patterns**
   - Path-based ownership

3. **Add team handles**
   - GitHub team references

### CODEOWNERS File

Create file: `.github/CODEOWNERS`

```
# LankaCommerce Cloud - Code Owners
# This file defines who is automatically requested for review
# when changes are made to specific paths.
#
# Order matters - last matching pattern takes precedence
# Use GitHub usernames or team handles (@org/team)

# ============================================
# Default Owners (fallback)
# ============================================
*                               @lankacommerce/core-team

# ============================================
# Backend (Django)
# ============================================
/backend/                       @lankacommerce/backend-team
/backend/apps/auth/             @lankacommerce/backend-team @lankacommerce/security-team
/backend/apps/payments/         @lankacommerce/backend-team @lankacommerce/payments-team
/backend/apps/tenants/          @lankacommerce/backend-team @lankacommerce/architecture-team

# ============================================
# Frontend (Next.js)
# ============================================
/frontend/                      @lankacommerce/frontend-team
/frontend/apps/pos/             @lankacommerce/pos-team
/frontend/apps/erp/             @lankacommerce/erp-team
/frontend/apps/webstore/        @lankacommerce/webstore-team

# ============================================
# Infrastructure
# ============================================
/docker/                        @lankacommerce/devops-team
/docker-compose*.yml            @lankacommerce/devops-team
Dockerfile*                     @lankacommerce/devops-team

# ============================================
# CI/CD & GitHub
# ============================================
/.github/                       @lankacommerce/devops-team
/.github/workflows/             @lankacommerce/devops-team

# ============================================
# Configuration Files
# ============================================
*.env*                          @lankacommerce/devops-team
/backend/config/                @lankacommerce/backend-team @lankacommerce/devops-team
/frontend/config/               @lankacommerce/frontend-team @lankacommerce/devops-team

# ============================================
# Database & Migrations
# ============================================
/backend/*/migrations/          @lankacommerce/backend-team @lankacommerce/dba-team
*.sql                           @lankacommerce/dba-team

# ============================================
# Security-Sensitive Files
# ============================================
/backend/apps/auth/             @lankacommerce/security-team
**/security*                    @lankacommerce/security-team
**/permissions*                 @lankacommerce/security-team

# ============================================
# Documentation
# ============================================
/docs/                          @lankacommerce/docs-team
*.md                            @lankacommerce/docs-team
README*                         @lankacommerce/docs-team

# ============================================
# Package Management
# ============================================
package.json                    @lankacommerce/frontend-team
package-lock.json               @lankacommerce/frontend-team
requirements*.txt               @lankacommerce/backend-team
pyproject.toml                  @lankacommerce/backend-team
poetry.lock                     @lankacommerce/backend-team

```

### CODEOWNERS Syntax

| Pattern | Matches |
|---------|---------|
| `*` | All files |
| `/path/` | Directory at root |
| `*.ext` | Files with extension |
| `**/pattern` | Pattern in any directory |
| `@user` | GitHub username |
| `@org/team` | GitHub team |

### GitHub Teams to Create

| Team Handle | Members | Responsibility |
|-------------|---------|----------------|
| @lankacommerce/core-team | All developers | Default fallback |
| @lankacommerce/backend-team | Backend devs | Django code |
| @lankacommerce/frontend-team | Frontend devs | Next.js code |
| @lankacommerce/devops-team | DevOps engineers | Infrastructure |
| @lankacommerce/security-team | Security engineers | Auth, permissions |
| @lankacommerce/dba-team | Database admins | Migrations, SQL |

### Smaller Team Alternative

For smaller teams, use individual usernames:

```
# Small team CODEOWNERS
*                       @lead-dev
/backend/               @backend-dev @lead-dev
/frontend/              @frontend-dev @lead-dev
/docker/                @devops-dev @lead-dev
```

### Expected Outcome
- CODEOWNERS file created
- Automatic reviewer assignment

### Verification Checklist
- [ ] File in .github/
- [ ] Default owner set
- [ ] Backend paths covered
- [ ] Frontend paths covered
- [ ] Infrastructure covered
- [ ] Security files identified

---

## Complete CODE_REVIEW.md

After Tasks 57-66, the complete CODE_REVIEW.md should include:

```markdown
# Code Review Guidelines

## Table of Contents
1. Purpose
2. Review Scope (Task 58)
3. Code Quality Criteria (Task 59)
4. Security Review (Task 60)
5. Performance Review (Task 61)
6. Review Timeline (Task 62)
7. Approval Requirements (Task 63)
8. Reviewer Checklist (Task 64)
9. Comment Guidelines (Task 65)
10. CODEOWNERS (Task 66 - reference)
```

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 62 | Define Review Timeline | Turnaround times, escalation |
| 63 | Define Approval Requirements | Approval matrix, levels |
| 64 | Create Review Checklist | Comprehensive checklist |
| 65 | Define Comment Guidelines | Constructive feedback guide |
| 66 | Create CODEOWNERS File | .github/CODEOWNERS |

### Group F Complete

All Code Review Guidelines configured:

1. ✅ CODE_REVIEW.md created
2. ✅ Review scope defined
3. ✅ Quality, security, performance criteria
4. ✅ Timeline and approvals
5. ✅ Reviewer checklist
6. ✅ Comment guidelines
7. ✅ CODEOWNERS file

### Next Steps
Proceed to [../Group-G_GitHub-Configuration-Verification/00_GROUP_OVERVIEW.md](../Group-G_GitHub-Configuration-Verification/00_GROUP_OVERVIEW.md) for final verification.

---

## Notes for AI Agents

1. **CODEOWNERS:** Place in .github/ directory
2. **Team handles:** @org/team format
3. **Last match wins:** Order matters in CODEOWNERS
4. **Timezone:** Asia/Colombo for timeline
5. **Security:** Require 2 approvals for security changes
6. **Comment prefixes:** [BLOCKING], [SUGGESTION], etc.
7. **Constructive tone:** Focus on positive feedback
