# Tasks 42-44: PR Template Types

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** D - Pull Request Templates  
> **Document:** 03 of 03  
> **Tasks Covered:** 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-38-41_PR-Template-Sections.md](02_Tasks-38-41_PR-Template-Sections.md)
- **→ Next Document:** [../Group-E_Issue-Templates/00_GROUP_OVERVIEW.md](../Group-E_Issue-Templates/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers specialized PR templates for different change types.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Create Feature Template | Simple |
| 43 | Create Bugfix Template | Simple |
| 44 | Create Hotfix Template | Simple |

---

## Prerequisites

Before creating type-specific templates:

1. **Template directory exists**
   - .github/PULL_REQUEST_TEMPLATE/ folder

2. **Default template works**
   - PULL_REQUEST_TEMPLATE.md tested

3. **Template structure defined**
   - All sections from Tasks 35-41

---

## Task 42: Create Feature Template

### Overview
Create PR template for feature branches.

### Dependencies
- Task 33: .github/ directory exists

### Instructions

1. **Create templates folder**
   - For multiple templates

2. **Create feature template**
   - Feature-specific sections

3. **Add feature checklist**
   - Requirements for features

### Directory Structure

```
pos-arch/
└── .github/
    ├── PULL_REQUEST_TEMPLATE.md          # Default template
    └── PULL_REQUEST_TEMPLATE/            # Type-specific templates
        ├── feature.md                    # Feature PRs
        ├── bugfix.md                     # Bugfix PRs
        └── hotfix.md                     # Hotfix PRs
```

### Feature Template Content

Create file: `.github/PULL_REQUEST_TEMPLATE/feature.md`

```markdown
<!--
LankaCommerce Cloud - Feature Pull Request Template
Use this template for new features from feature/* branches
-->

## 🚀 Feature: [Feature Name]

### Description

**What does this feature do?**
<!-- Clear explanation of the new functionality -->


**Why is this feature needed?**
<!-- Business case or user story -->


**User Story (if applicable):**
<!-- As a [role], I want [feature] so that [benefit] -->
As a __________________, I want __________________ so that __________________

---

## Feature Details

### Scope
<!-- What's included in this feature -->
- [ ] Frontend changes
- [ ] Backend changes
- [ ] API changes
- [ ] Database changes
- [ ] Configuration changes

### Acceptance Criteria
<!-- List the acceptance criteria that have been met -->
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Out of Scope
<!-- What's explicitly not included -->
- 

---

## Technical Implementation

### Architecture Changes
<!-- Describe any architectural changes -->


### New Dependencies
<!-- List any new packages or dependencies added -->
| Package | Version | Purpose |
|---------|---------|---------|
| | | |

### Database Changes
<!-- Describe any schema changes -->
- [ ] New migrations added
- [ ] Migrations tested
- [ ] Rollback tested

---

## Testing

### Test Coverage
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] E2E tests added (if applicable)

### Testing Instructions
<!-- How to test this feature -->
1. 
2. 
3. 

### Test Results
<!-- Paste test output or coverage summary -->
```
# Test output here
```

---

## Documentation

- [ ] Feature documented in README
- [ ] API documentation updated
- [ ] User guide updated
- [ ] Developer documentation added
- [ ] Inline code comments added

---

## Performance

### Performance Considerations
<!-- Any performance implications -->
- [ ] No significant performance impact
- [ ] Performance testing completed

### Metrics
<!-- Relevant metrics if applicable -->
| Metric | Before | After |
|--------|--------|-------|
| | | |

---

## Breaking Changes

- [ ] ⚠️ Yes, includes breaking changes
- [ ] ✅ No breaking changes

<!-- If breaking, describe migration -->

---

## Related Items

**Closes:** #
**Refs:** #

**Design Documents:**
- 

---

## Screenshots

<!-- For UI features, include screenshots -->

### New Feature Views

| View | Screenshot |
|------|------------|
| Desktop | |
| Mobile | |

---

## Checklist

### Pre-merge Requirements
- [ ] Branch is up to date with develop
- [ ] All tests pass
- [ ] Code review approved
- [ ] Documentation complete
- [ ] Feature flag configured (if needed)
- [ ] Monitoring/logging added

### Reviewer Instructions
<!-- Special instructions for reviewers -->


```

### Expected Outcome
- Feature template created
- Comprehensive sections

### Verification Checklist
- [ ] File in correct location
- [ ] All feature sections
- [ ] Acceptance criteria area
- [ ] Performance section

---

## Task 43: Create Bugfix Template

### Overview
Create PR template for bugfix branches.

### Dependencies
- Task 33: .github/ directory exists

### Instructions

1. **Create bugfix template**
   - Bug-specific sections

2. **Add root cause**
   - Require analysis

3. **Add fix verification**
   - Confirm resolution

### Bugfix Template Content

Create file: `.github/PULL_REQUEST_TEMPLATE/bugfix.md`

```markdown
<!--
LankaCommerce Cloud - Bugfix Pull Request Template
Use this template for bug fixes from bugfix/* branches
-->

## 🐛 Bugfix: [Brief Bug Description]

### Bug Information

**Issue Reference:** #

**Bug Summary:**
<!-- One-line description of the bug -->


**Environment:**
<!-- Where was this bug found? -->
- [ ] Development
- [ ] Staging
- [ ] Production

**Severity:**
- [ ] Critical - System down
- [ ] High - Major feature broken
- [ ] Medium - Feature degraded
- [ ] Low - Minor inconvenience

---

## Problem Analysis

### Steps to Reproduce
<!-- Exact steps to reproduce the bug -->
1. 
2. 
3. 

### Expected Behavior
<!-- What should happen -->


### Actual Behavior
<!-- What actually happens -->


### Root Cause
<!-- Technical explanation of why this happened -->


---

## Solution

### Fix Description
<!-- How does this PR fix the issue? -->


### Changes Made
<!-- List of changes made to fix the bug -->
- 
- 
- 

### Alternative Solutions Considered
<!-- Other approaches considered and why rejected -->
| Solution | Pros | Cons | Why Not |
|----------|------|------|---------|
| | | | |

---

## Testing

### Bug Verification
<!-- Confirm the bug is fixed -->
- [ ] Bug no longer reproducible
- [ ] Original steps now work correctly
- [ ] Fix verified in development environment

### Regression Testing
<!-- Confirm no new bugs introduced -->
- [ ] Related functionality tested
- [ ] No regression detected
- [ ] Edge cases tested

### Test Cases Added
<!-- List new test cases -->
- [ ] Test for original bug scenario
- [ ] Test for edge cases
- [ ] Test for related scenarios

### Testing Steps
1. 
2. 
3. 

---

## Impact Assessment

### Affected Areas
<!-- What parts of the system are affected -->
- 
- 

### Risk Assessment
- [ ] Low risk - Isolated fix
- [ ] Medium risk - Some related areas
- [ ] High risk - Core functionality

### Rollback Plan
<!-- How to rollback if needed -->


---

## Related Issues

**Fixes:** #
**Related:** #

---

## Screenshots

<!-- Before/After comparison -->

| State | Screenshot |
|-------|------------|
| Before (Bug) | |
| After (Fixed) | |

---

## Checklist

### Pre-merge Requirements
- [ ] Bug is fixed and verified
- [ ] No regression introduced
- [ ] Tests added/updated
- [ ] Branch is up to date with develop
- [ ] Code review approved

### Post-merge Actions
- [ ] Close related issue(s)
- [ ] Update issue status
- [ ] Notify stakeholders (if needed)
- [ ] Monitor for recurrence

```

### Expected Outcome
- Bugfix template created
- Root cause required

### Verification Checklist
- [ ] File in correct location
- [ ] Bug reproduction steps
- [ ] Root cause section
- [ ] Before/after comparison

---

## Task 44: Create Hotfix Template

### Overview
Create PR template for hotfix branches.

### Dependencies
- Task 33: .github/ directory exists

### Instructions

1. **Create hotfix template**
   - Urgency emphasized

2. **Add impact section**
   - Production impact

3. **Add approval section**
   - Emergency approval

### Hotfix Template Content

Create file: `.github/PULL_REQUEST_TEMPLATE/hotfix.md`

```markdown
<!--
LankaCommerce Cloud - Hotfix Pull Request Template
Use this template for urgent production fixes from hotfix/* branches
⚠️ HOTFIXES REQUIRE EXPEDITED REVIEW
-->

## 🚨 HOTFIX: [Critical Issue Description]

> **⚠️ PRODUCTION HOTFIX - URGENT REVIEW REQUIRED**

### Urgency

**Priority Level:**
- [ ] P0 - System completely down
- [ ] P1 - Major functionality broken
- [ ] P2 - Significant user impact

**Estimated Production Impact:**
<!-- How many users/tenants are affected? -->


**Time Since Issue Detected:**
<!-- When was the issue first reported? -->


---

## Issue Details

**Production Issue:** #

### Problem Description
<!-- What's happening in production -->


### Business Impact
<!-- How is this affecting the business/users -->
- Revenue impact: 
- Users affected: 
- Tenants affected: 
- SLA impact: 

---

## Root Cause

### Immediate Cause
<!-- What directly caused this issue -->


### Contributing Factors
<!-- Other factors that contributed -->
- 

### How Detected
<!-- How was this issue discovered -->
- [ ] User report
- [ ] Monitoring alert
- [ ] Error logs
- [ ] Other: 

---

## Solution

### Fix Description
<!-- What does this hotfix do -->


### Minimal Changes
<!-- Confirm this is a minimal fix -->
- [ ] Only essential changes included
- [ ] No refactoring or improvements
- [ ] Smallest possible change to fix issue

### Changes Made
- 

---

## Testing

### Critical Testing
<!-- Testing performed before merge -->
- [ ] Fix verified locally
- [ ] Fix verified in staging
- [ ] Basic smoke test passed
- [ ] No obvious regressions

### Testing Limitations
<!-- What couldn't be fully tested due to urgency -->


### Post-Deploy Testing Plan
<!-- What will be tested after deploy -->
1. 
2. 
3. 

---

## Deployment

### Deployment Order
<!-- Order of operations -->
1. Merge this PR
2. Deploy to production
3. Verify fix in production
4. Monitor for issues

### Rollback Plan
<!-- How to rollback if fix fails -->
1. 
2. 
3. 

### Monitoring
<!-- What to monitor after deploy -->
- [ ] Error rates
- [ ] Response times
- [ ] User complaints
- [ ] System metrics

---

## Approvals

### Emergency Approval
<!-- For expedited review -->

**Approved by:** @
**Date/Time:** 
**Reason for expedited approval:**

### Standard Approvers Notified
<!-- Tag team leads / on-call -->
- [ ] @
- [ ] @

---

## Post-Mortem

### Follow-up Tasks
<!-- Tasks to do after the immediate fix -->
- [ ] Proper fix in next sprint
- [ ] Add missing tests
- [ ] Update documentation
- [ ] Post-mortem meeting scheduled

### Ticket References
- Hotfix ticket: #
- Follow-up ticket: #
- Post-mortem ticket: #

---

## Checklist

### Pre-merge (Expedited)
- [ ] Fix solves the production issue
- [ ] Minimal, focused changes only
- [ ] No breaking changes
- [ ] Emergency approval obtained
- [ ] Rollback plan ready

### Post-merge (Immediate)
- [ ] Deploy to production
- [ ] Verify fix in production
- [ ] Notify stakeholders
- [ ] Close incident

### Follow-up (Within 24-48 hours)
- [ ] Merge to develop branch
- [ ] Create follow-up tasks
- [ ] Schedule post-mortem
- [ ] Document incident

```

### Expected Outcome
- Hotfix template created
- Urgency emphasized

### Verification Checklist
- [ ] File in correct location
- [ ] Priority levels clear
- [ ] Emergency approval section
- [ ] Post-mortem follow-up

---

## Using Type-Specific Templates

### Selection Methods

GitHub provides two ways to use multiple templates:

1. **Query parameter in URL**
   ```
   https://github.com/org/repo/compare/develop...feature/branch?template=feature.md
   ```

2. **Template picker**
   - GitHub shows template picker when multiple templates exist

### Template Directory Structure

```
.github/
├── PULL_REQUEST_TEMPLATE.md              # Default (used if no specific template)
└── PULL_REQUEST_TEMPLATE/                # Template directory
    ├── feature.md                        # ?template=feature.md
    ├── bugfix.md                         # ?template=bugfix.md
    └── hotfix.md                         # ?template=hotfix.md
```

### Template Selection Table

| Branch Type | Template | URL Parameter |
|-------------|----------|---------------|
| feature/* | feature.md | ?template=feature.md |
| bugfix/* | bugfix.md | ?template=bugfix.md |
| hotfix/* | hotfix.md | ?template=hotfix.md |
| Other | Default | (none) |

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 42 | Create Feature Template | feature.md |
| 43 | Create Bugfix Template | bugfix.md |
| 44 | Create Hotfix Template | hotfix.md |

### Complete Template Set

| File | Purpose | Size |
|------|---------|------|
| PULL_REQUEST_TEMPLATE.md | Default | ~80 lines |
| feature.md | New features | ~150 lines |
| bugfix.md | Bug fixes | ~130 lines |
| hotfix.md | Urgent fixes | ~140 lines |

### Group D Complete

All Pull Request Templates configured:

1. ✅ .github/ directory created
2. ✅ Default template with all sections
3. ✅ Feature template with acceptance criteria
4. ✅ Bugfix template with root cause analysis
5. ✅ Hotfix template with urgency indicators

### Next Steps
Proceed to [../Group-E_Issue-Templates/00_GROUP_OVERVIEW.md](../Group-E_Issue-Templates/00_GROUP_OVERVIEW.md) for issue templates.

---

## Notes for AI Agents

1. **Template directory:** Use PULL_REQUEST_TEMPLATE/ folder
2. **Feature:** Include acceptance criteria, user stories
3. **Bugfix:** Require root cause, before/after
4. **Hotfix:** Emphasize urgency, approval, rollback
5. **Selection:** Use URL parameter or picker
6. **Post-mortem:** Required for hotfixes
7. **Minimal changes:** Hotfixes must be focused
