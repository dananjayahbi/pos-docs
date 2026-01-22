# Tasks 09-12: Branch Strategy Documentation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** B - Branching Strategy Definition  
> **Document:** 01 of 03  
> **Tasks Covered:** 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Git-Repository-Setup/02_Tasks-05-08_Attributes-Commit.md](../Group-A_Git-Repository-Setup/02_Tasks-05-08_Attributes-Commit.md)
- **→ Next Document:** [02_Tasks-13-16_Branch-Patterns.md](02_Tasks-13-16_Branch-Patterns.md)

---

## Document Overview

This document covers creating the branching strategy documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Document Branching Strategy | Medium |
| 10 | Define Main Branch | Simple |
| 11 | Define Develop Branch | Simple |
| 12 | Define Feature Branch Pattern | Simple |

---

## Task 09: Document Branching Strategy

### Overview
Create BRANCHING.md with branching strategy overview.

### Dependencies
- Task 08: Initial commit complete

### Instructions

1. **Create docs directory**
   - If not exists

2. **Create BRANCHING.md**
   - In docs directory

3. **Add overview section**
   - Strategy introduction

### File Location

```
/                            # Repository root
├── docs/
│   └── BRANCHING.md         # Branching strategy
└── ...
```

### Initial BRANCHING.md Structure

```markdown
# LankaCommerce Cloud - Branching Strategy

## Overview

LankaCommerce Cloud follows a **GitFlow-based branching strategy** adapted for 
continuous deployment. This document defines branch types, naming conventions, 
and workflows for all team members.

## Quick Reference

| Branch Type | Pattern | Base | Merge To | Purpose |
|-------------|---------|------|----------|---------|
| main | `main` | - | - | Production code |
| develop | `develop` | main | main | Integration |
| feature | `feature/*` | develop | develop | New features |
| bugfix | `bugfix/*` | develop | develop | Bug fixes |
| hotfix | `hotfix/*` | main | main, develop | Critical fixes |
| release | `release/*` | develop | main, develop | Release prep |

## Branch Details

(Sections for each branch type follow...)
```

### Why GitFlow

| Reason | Benefit |
|--------|---------|
| Parallel development | Multiple features simultaneously |
| Stable main | Production always deployable |
| Release management | Controlled release process |
| Hotfix support | Emergency fixes without disruption |

### Expected Outcome
- BRANCHING.md created
- Strategy overview written

### Verification Checklist
- [ ] docs directory exists
- [ ] BRANCHING.md created
- [ ] Overview section complete
- [ ] Quick reference table added

---

## Task 10: Define Main Branch

### Overview
Document the main branch purpose and rules.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add main branch section**
   - Purpose definition

2. **Document rules**
   - Protection rules

3. **Define merge criteria**
   - What can merge to main

### BRANCHING.md Main Branch Section

```markdown
## Main Branch (`main`)

### Purpose
The `main` branch represents **production-ready code**. Every commit on main 
should be deployable to production.

### Rules
1. **Protected branch** - Direct commits not allowed
2. **Pull requests required** - All changes via PR
3. **Reviews required** - Minimum 2 approvals
4. **CI must pass** - All checks green before merge
5. **No force push** - History must be preserved

### Merge Sources
| Source Branch | When |
|---------------|------|
| release/* | Completing a release |
| hotfix/* | Critical production fixes |

### Protection Settings

| Setting | Value |
|---------|-------|
| Require pull request | Yes |
| Required approvals | 2 |
| Dismiss stale reviews | Yes |
| Require status checks | Yes |
| Require branches up-to-date | Yes |
| Include administrators | Yes |
| Restrict who can push | Release managers only |
| Allow force pushes | No |
| Allow deletions | No |

### Versioning
Main branch reflects production versions:
- Tagged with semantic version: `v1.0.0`, `v1.1.0`
- Each merge from release creates a tag
```

### Main Branch Principles

| Principle | Description |
|-----------|-------------|
| Always deployable | Any commit can go to production |
| Protected | No direct commits |
| Tagged | Each release is tagged |
| Stable | Never broken |

### Expected Outcome
- Main branch documented
- Protection rules defined

### Verification Checklist
- [ ] Purpose clearly stated
- [ ] Rules documented
- [ ] Merge sources listed
- [ ] Protection settings defined

---

## Task 11: Define Develop Branch

### Overview
Document the develop branch purpose and rules.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add develop section**
   - Purpose definition

2. **Document rules**
   - Integration rules

3. **Define workflow**
   - Feature integration

### BRANCHING.md Develop Branch Section

```markdown
## Develop Branch (`develop`)

### Purpose
The `develop` branch is the **integration branch** for features. It contains 
the latest development changes for the next release.

### Rules
1. **Protected branch** - Direct commits limited
2. **Pull requests preferred** - Features via PR
3. **Reviews required** - Minimum 1 approval
4. **CI must pass** - All checks green before merge
5. **No force push** - History preserved

### Merge Sources
| Source Branch | When |
|---------------|------|
| feature/* | Feature complete |
| bugfix/* | Bug fixed |
| hotfix/* | After merging to main |

### Merge Targets
| Target Branch | When |
|---------------|------|
| release/* | Starting a release |

### Protection Settings

| Setting | Value |
|---------|-------|
| Require pull request | Yes |
| Required approvals | 1 |
| Dismiss stale reviews | Yes |
| Require status checks | Yes |
| Require branches up-to-date | No (allow parallel work) |
| Include administrators | No |
| Restrict who can push | No |
| Allow force pushes | No |
| Allow deletions | No |

### Integration Rules
- Merge features using **squash merge** for clean history
- Resolve conflicts in feature branch before merging
- Delete feature branch after successful merge
- Run integration tests after major feature merges
```

### Develop vs Main

| Aspect | main | develop |
|--------|------|---------|
| Stability | Always stable | Usually stable |
| Purpose | Production | Integration |
| Who merges | Release managers | All developers |
| Approval | 2 reviewers | 1 reviewer |

### Expected Outcome
- Develop branch documented
- Integration rules defined

### Verification Checklist
- [ ] Purpose clearly stated
- [ ] Rules documented
- [ ] Merge sources/targets listed
- [ ] Protection settings defined

---

## Task 12: Define Feature Branch Pattern

### Overview
Document feature branch naming and workflow.

### Dependencies
- Task 09: BRANCHING.md exists

### Instructions

1. **Add feature section**
   - Naming pattern

2. **Document workflow**
   - Creation to merge

3. **Add examples**
   - Real-world patterns

### BRANCHING.md Feature Branch Section

```markdown
## Feature Branches (`feature/*`)

### Purpose
Feature branches are used to develop **new functionality**. Each feature 
should have its own branch.

### Naming Convention
```
feature/<ticket>-<short-description>
```

**Components:**
- `feature/` - Branch prefix
- `<ticket>` - Issue tracker ID (e.g., LCC-123)
- `<short-description>` - Kebab-case description (2-4 words)

### Examples
```
feature/LCC-123-user-authentication
feature/LCC-456-product-search
feature/LCC-789-checkout-flow
feature/LCC-101-dashboard-widgets
```

### Workflow

1. **Create branch from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/LCC-123-user-authentication
   ```

2. **Develop feature**
   - Make commits following commit conventions
   - Push regularly to remote
   - Keep branch up-to-date with develop

3. **Update from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/LCC-123-user-authentication
   git rebase develop
   ```

4. **Create pull request**
   - Target: develop
   - Request review
   - Wait for CI to pass

5. **Merge and cleanup**
   - Squash merge to develop
   - Delete feature branch
   ```bash
   git branch -d feature/LCC-123-user-authentication
   git push origin --delete feature/LCC-123-user-authentication
   ```

### Rules
- One feature per branch
- Keep branches short-lived (< 2 weeks)
- Sync with develop daily
- Delete after merge

### Branch Lifetime
| Metric | Target |
|--------|--------|
| Maximum age | 2 weeks |
| Commits | 5-20 |
| Files changed | Focus on feature scope |
```

### Feature Branch Best Practices

| Practice | Reason |
|----------|--------|
| Short-lived | Reduce merge conflicts |
| Single feature | Easier review |
| Regular sync | Stay current |
| Delete after | Keep repo clean |

### Expected Outcome
- Feature pattern documented
- Workflow defined

### Verification Checklist
- [ ] Naming convention defined
- [ ] Examples provided
- [ ] Workflow steps documented
- [ ] Rules listed

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Document Branching Strategy | BRANCHING.md overview |
| 10 | Define Main Branch | Main branch rules |
| 11 | Define Develop Branch | Develop branch rules |
| 12 | Define Feature Branch Pattern | Feature workflow |

### BRANCHING.md Progress

```
Sections Added:
├── Overview
├── Quick Reference
├── Main Branch (main)
├── Develop Branch (develop)
└── Feature Branches (feature/*)
```

### Next Steps
Proceed to [02_Tasks-13-16_Branch-Patterns.md](02_Tasks-13-16_Branch-Patterns.md) for bugfix, hotfix, and release patterns.

---

## Notes for AI Agents

1. **GitFlow:** Follow GitFlow conventions
2. **Naming:** Use ticket-description format
3. **Protection:** Define protection rules
4. **Examples:** Include real examples
5. **Workflow:** Document complete flow
6. **Cleanup:** Emphasize branch deletion
