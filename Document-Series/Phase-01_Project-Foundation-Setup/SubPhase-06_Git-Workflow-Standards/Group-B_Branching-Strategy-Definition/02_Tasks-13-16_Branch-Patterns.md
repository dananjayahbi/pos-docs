# Tasks 13-16: Branch Patterns

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** B - Branching Strategy Definition  
> **Document:** 02 of 03  
> **Tasks Covered:** 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-09-12_Branch-Strategy-Doc.md](01_Tasks-09-12_Branch-Strategy-Doc.md)
- **→ Next Document:** [03_Tasks-17-20_Branch-Verification.md](03_Tasks-17-20_Branch-Verification.md)

---

## Document Overview

This document covers bugfix, hotfix, and release branch patterns.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 13 | Define Bugfix Branch Pattern | Simple |
| 14 | Define Hotfix Branch Pattern | Simple |
| 15 | Define Release Branch Pattern | Simple |
| 16 | Document Branch Lifecycle | Medium |

---

## Task 13: Define Bugfix Branch Pattern

### Overview
Document bugfix branch naming and workflow.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add bugfix section**
   - Naming pattern

2. **Document workflow**
   - Creation to merge

3. **Differentiate from hotfix**
   - Non-critical fixes

### BRANCHING.md Bugfix Branch Section

```markdown
## Bugfix Branches (`bugfix/*`)

### Purpose
Bugfix branches are used to fix **non-critical bugs** in the development 
cycle. These are bugs found during development, not in production.

### Naming Convention
```
bugfix/<ticket>-<short-description>
```

**Components:**
- `bugfix/` - Branch prefix
- `<ticket>` - Issue tracker ID (e.g., LCC-456)
- `<short-description>` - Kebab-case description

### Examples
```
bugfix/LCC-456-fix-login-validation
bugfix/LCC-789-correct-price-calculation
bugfix/LCC-012-resolve-null-pointer
bugfix/LCC-345-fix-date-formatting
```

### Workflow

1. **Create branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b bugfix/LCC-456-fix-login-validation
   ```

2. **Fix the bug**
   - Write tests first (TDD approach)
   - Implement fix
   - Verify fix

3. **Create pull request**
   - Target: develop
   - Reference issue
   - Request review

4. **Merge and cleanup**
   - Squash merge to develop
   - Delete bugfix branch

### When to Use

| Scenario | Use Bugfix? |
|----------|-------------|
| Bug in current sprint | Yes |
| Bug in develop | Yes |
| Bug found in code review | Yes |
| Bug in production | No (use hotfix) |
| Critical security issue | No (use hotfix) |

### Bugfix vs Feature

| Aspect | Feature | Bugfix |
|--------|---------|--------|
| Purpose | New functionality | Fix existing |
| Scope | Can be large | Usually small |
| Testing | New tests | Fix/add tests |
| Priority | Normal | Higher |
```

### Expected Outcome
- Bugfix pattern documented
- Workflow defined

### Verification Checklist
- [ ] Naming convention defined
- [ ] Examples provided
- [ ] Workflow documented
- [ ] Differentiation clear

---

## Task 14: Define Hotfix Branch Pattern

### Overview
Document hotfix branch naming and workflow.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add hotfix section**
   - Naming pattern

2. **Document workflow**
   - Emergency process

3. **Define criteria**
   - When to use hotfix

### BRANCHING.md Hotfix Branch Section

```markdown
## Hotfix Branches (`hotfix/*`)

### Purpose
Hotfix branches are used for **critical production fixes** that cannot wait 
for the next release. They are created from main and merged back to both 
main and develop.

### Naming Convention
```
hotfix/<version>-<short-description>
```

**Components:**
- `hotfix/` - Branch prefix
- `<version>` - Patch version (e.g., 1.0.1)
- `<short-description>` - Brief description

### Examples
```
hotfix/1.0.1-critical-security-fix
hotfix/1.2.3-payment-gateway-error
hotfix/2.0.1-database-connection-fix
hotfix/1.5.2-memory-leak-fix
```

### Workflow

1. **Create branch from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/1.0.1-critical-security-fix
   ```

2. **Implement fix**
   - Minimal changes only
   - Add regression test
   - Document the fix

3. **Test thoroughly**
   - Run full test suite
   - Test in staging environment

4. **Merge to main**
   ```bash
   # Create PR to main
   # Get expedited review (minimum 1 approval)
   # Merge to main
   ```

5. **Tag the release**
   ```bash
   git checkout main
   git tag -a v1.0.1 -m "Hotfix: Critical security fix"
   git push origin v1.0.1
   ```

6. **Merge back to develop**
   ```bash
   git checkout develop
   git merge hotfix/1.0.1-critical-security-fix
   git push origin develop
   ```

7. **Cleanup**
   ```bash
   git branch -d hotfix/1.0.1-critical-security-fix
   git push origin --delete hotfix/1.0.1-critical-security-fix
   ```

### Hotfix Criteria

| Criteria | Required |
|----------|----------|
| Production affecting | Yes |
| Security vulnerability | Yes |
| Data loss risk | Yes |
| Revenue impact | Yes |
| Can wait 1 week? | No |

### Expedited Review Process

| Step | Time Limit |
|------|------------|
| Code review | 2 hours |
| QA verification | 4 hours |
| Approval | Same day |
| Deployment | ASAP |
```

### Hotfix vs Bugfix

| Aspect | Hotfix | Bugfix |
|--------|--------|--------|
| Source | main | develop |
| Target | main + develop | develop |
| Urgency | Critical | Normal |
| Review | Expedited | Normal |
| Tag | Yes | No |

### Expected Outcome
- Hotfix pattern documented
- Emergency workflow defined

### Verification Checklist
- [ ] Naming convention defined
- [ ] Examples provided
- [ ] Workflow documented
- [ ] Criteria defined

---

## Task 15: Define Release Branch Pattern

### Overview
Document release branch naming and workflow.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add release section**
   - Naming pattern

2. **Document workflow**
   - Release preparation

3. **Define activities**
   - What happens in release branch

### BRANCHING.md Release Branch Section

```markdown
## Release Branches (`release/*`)

### Purpose
Release branches are used to **prepare for a production release**. They 
allow for last-minute bug fixes, documentation updates, and final testing 
while development continues on develop.

### Naming Convention
```
release/<version>
```

**Components:**
- `release/` - Branch prefix
- `<version>` - Semantic version (e.g., 1.0.0)

### Examples
```
release/1.0.0
release/1.1.0
release/2.0.0
release/1.5.0-beta
```

### Workflow

1. **Create branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/1.0.0
   ```

2. **Prepare release**
   - Update version numbers
   - Update CHANGELOG.md
   - Final bug fixes only
   - Update documentation

3. **Version Updates**
   - backend: `__version__ = "1.0.0"`
   - frontend: `package.json` version
   - Documentation versions

4. **Final testing**
   - Run full test suite
   - Deploy to staging
   - QA verification
   - Performance testing

5. **Merge to main**
   ```bash
   # Create PR to main
   # Get 2 approvals
   # Merge to main
   ```

6. **Tag the release**
   ```bash
   git checkout main
   git tag -a v1.0.0 -m "Release 1.0.0: Initial release"
   git push origin v1.0.0
   ```

7. **Merge back to develop**
   ```bash
   git checkout develop
   git merge release/1.0.0
   git push origin develop
   ```

8. **Cleanup**
   ```bash
   git branch -d release/1.0.0
   git push origin --delete release/1.0.0
   ```

### Allowed Changes

| Activity | Allowed |
|----------|---------|
| Bug fixes | Yes |
| Documentation | Yes |
| Version numbers | Yes |
| New features | No |
| Refactoring | No |
| Performance improvements | Limited |

### Release Branch Duration

| Phase | Duration |
|-------|----------|
| Preparation | 1-2 days |
| Testing | 2-3 days |
| QA sign-off | 1 day |
| Total | 4-6 days max |
```

### Release Checklist

| Item | Status |
|------|--------|
| Version numbers updated | Required |
| CHANGELOG.md updated | Required |
| Tests pass | Required |
| Documentation updated | Required |
| QA approved | Required |
| Security scan passed | Required |

### Expected Outcome
- Release pattern documented
- Workflow defined

### Verification Checklist
- [ ] Naming convention defined
- [ ] Examples provided
- [ ] Workflow documented
- [ ] Allowed changes listed

---

## Task 16: Document Branch Lifecycle

### Overview
Document complete branch lifecycle from creation to deletion.

### Dependencies
- Tasks 12-15: All branch patterns defined

### Instructions

1. **Add lifecycle section**
   - General lifecycle

2. **Document each phase**
   - Create, develop, merge, delete

3. **Add lifecycle table**
   - Quick reference

### BRANCHING.md Lifecycle Section

```markdown
## Branch Lifecycle

### General Lifecycle

All branches follow this lifecycle:

```
Creation → Development → Review → Merge → Deletion
```

### Lifecycle Phases

#### 1. Creation
- Branch from appropriate base (develop/main)
- Follow naming convention
- Push to remote immediately
- Link to issue/ticket

#### 2. Development
- Make focused commits
- Follow commit conventions
- Sync with base regularly
- Push changes daily

#### 3. Review
- Create pull request
- Request reviewers
- Address feedback
- Pass CI checks

#### 4. Merge
- Ensure up-to-date with base
- Use appropriate merge strategy
- Verify CI passes
- Complete the merge

#### 5. Deletion
- Delete local branch
- Delete remote branch
- Verify deletion

### Lifecycle by Branch Type

| Type | Created From | Merged To | Lifetime | Delete After |
|------|--------------|-----------|----------|--------------|
| feature | develop | develop | < 2 weeks | Merge |
| bugfix | develop | develop | < 1 week | Merge |
| hotfix | main | main, develop | < 1 day | Merge |
| release | develop | main, develop | < 1 week | Merge |

### Branch Age Limits

| Branch Type | Warning | Action Required |
|-------------|---------|-----------------|
| feature | > 1 week | Sync with develop |
| feature | > 2 weeks | Split or close |
| bugfix | > 3 days | Escalate |
| bugfix | > 1 week | Close or hotfix |
| release | > 3 days | Complete or abort |
| hotfix | > 4 hours | Deploy or rollback |

### Stale Branch Policy

Branches that exceed age limits:
1. Review reason for delay
2. Sync with base branch
3. Split if too large
4. Close if abandoned
5. Delete stale remote branches monthly
```

### Branch Hygiene

| Activity | Frequency |
|----------|-----------|
| Delete merged branches | Immediately |
| Review open branches | Weekly |
| Clean stale branches | Monthly |
| Audit branch naming | Quarterly |

### Expected Outcome
- Lifecycle documented
- Age limits defined

### Verification Checklist
- [ ] Lifecycle phases defined
- [ ] Each branch type covered
- [ ] Age limits specified
- [ ] Stale policy documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 13 | Define Bugfix Branch Pattern | Bugfix workflow |
| 14 | Define Hotfix Branch Pattern | Emergency workflow |
| 15 | Define Release Branch Pattern | Release process |
| 16 | Document Branch Lifecycle | Lifecycle management |

### BRANCHING.md Progress

```
Sections Added:
├── Bugfix Branches (bugfix/*)
├── Hotfix Branches (hotfix/*)
├── Release Branches (release/*)
└── Branch Lifecycle
```

### Next Steps
Proceed to [03_Tasks-17-20_Branch-Verification.md](03_Tasks-17-20_Branch-Verification.md) for develop branch creation and verification.

---

## Notes for AI Agents

1. **Bugfix:** From develop, non-critical
2. **Hotfix:** From main, critical only
3. **Release:** Preparation only, no features
4. **Lifecycle:** Create → Develop → Review → Merge → Delete
5. **Age limits:** Enforce to keep repo clean
6. **Delete:** Always delete merged branches
