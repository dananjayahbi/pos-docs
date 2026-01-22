# Tasks 21-25: Commit Format

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** C - Commit Message Conventions  
> **Document:** 01 of 03  
> **Tasks Covered:** 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Branching-Strategy-Definition/03_Tasks-17-20_Branch-Verification.md](../Group-B_Branching-Strategy-Definition/03_Tasks-17-20_Branch-Verification.md)
- **→ Next Document:** [02_Tasks-26-29_Commit-Body-Linting.md](02_Tasks-26-29_Commit-Body-Linting.md)

---

## Document Overview

This document covers commit message format and guidelines documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Document Commit Conventions | Medium |
| 22 | Define Commit Format | Simple |
| 23 | Define Commit Types | Simple |
| 24 | Define Scope Guidelines | Simple |
| 25 | Define Subject Guidelines | Simple |

---

## Task 21: Document Commit Conventions

### Overview
Create COMMITS.md with commit convention overview.

### Dependencies
- Task 08: Initial commit complete

### Instructions

1. **Create docs directory**
   - If not exists

2. **Create COMMITS.md**
   - In docs directory

3. **Add overview section**
   - Convention introduction

### File Location

```
/                            # Repository root
├── docs/
│   ├── BRANCHING.md         # Branching strategy
│   └── COMMITS.md           # Commit conventions
└── ...
```

### Initial COMMITS.md Structure

```markdown
# LankaCommerce Cloud - Commit Message Conventions

## Overview

LankaCommerce Cloud follows the **Conventional Commits** specification (v1.0.0) 
for all commit messages. This ensures consistent, meaningful commit history 
that can be used for automated changelog generation and semantic versioning.

## Why Conventional Commits?

| Benefit | Description |
|---------|-------------|
| Consistent history | Readable, structured commit log |
| Automation | Automated changelog and versioning |
| Clear intent | Purpose of change is obvious |
| Better reviews | Easier to review organized commits |
| Semantic versioning | Automatic version bumping |

## Quick Reference

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh functionality to prevent
users from being logged out unexpectedly.

Closes #123
```

## Specification

(Detailed sections follow...)
```

### Why Conventional Commits

| Feature | Benefit |
|---------|---------|
| Structured format | Machine and human readable |
| Type prefixes | Quick intent understanding |
| Scope context | Know what changed |
| Automation | CHANGELOG generation |

### Expected Outcome
- COMMITS.md created
- Overview documented

### Verification Checklist
- [ ] docs directory exists
- [ ] COMMITS.md created
- [ ] Overview section complete
- [ ] Quick reference added

---

## Task 22: Define Commit Format

### Overview
Document the commit message format structure.

### Dependencies
- Task 21: COMMITS.md exists

### Instructions

1. **Add format section**
   - Structure breakdown

2. **Document each part**
   - Header, body, footer

3. **Add rules**
   - Length limits

### COMMITS.md Format Section

```markdown
## Commit Message Format

### Structure

Every commit message consists of three parts:

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Header Format

```
<type>(<scope>): <subject>
```

**Components:**
- `type` - Required. The type of change.
- `scope` - Optional. The affected module/component.
- `subject` - Required. Brief description of the change.

### Rules

| Component | Rule |
|-----------|------|
| Header | Maximum 72 characters |
| Header | No period at end |
| Body | Wrap at 72 characters |
| Body | Separate from header by blank line |
| Footer | Reference issues, breaking changes |

### Character Limits

```
Header:  <=72 characters (recommended: 50)
Body:    Wrap at 72 characters per line
Footer:  No limit, but be concise
```

### Anatomy Example

```
feat(products): add bulk import functionality
│    │          │
│    │          └─► Subject: imperative, present tense
│    │
│    └─► Scope: affected module
│
└─► Type: category of change
```
```

### Format Breakdown

| Part | Required | Purpose |
|------|----------|---------|
| Type | Yes | Change category |
| Scope | No | Affected area |
| Subject | Yes | Brief description |
| Body | No | Detailed explanation |
| Footer | No | References, breaking changes |

### Expected Outcome
- Format documented
- Rules defined

### Verification Checklist
- [ ] Structure explained
- [ ] Components defined
- [ ] Character limits set
- [ ] Example provided

---

## Task 23: Define Commit Types

### Overview
Document all allowed commit types.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Add types section**
   - All type definitions

2. **Document usage**
   - When to use each

3. **Add version impact**
   - SemVer relationship

### COMMITS.md Types Section

```markdown
## Commit Types

### Allowed Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | None |
| `style` | Formatting, whitespace | None |
| `refactor` | Code restructuring | None |
| `perf` | Performance improvement | PATCH |
| `test` | Adding/fixing tests | None |
| `build` | Build system changes | None |
| `ci` | CI configuration | None |
| `chore` | Maintenance tasks | None |
| `revert` | Revert previous commit | Depends |

### Type Definitions

#### `feat` - Features
New functionality for the user.
```
feat(cart): add wishlist to cart conversion
feat(auth): implement social login with Google
feat(reports): add export to Excel functionality
```

#### `fix` - Bug Fixes
Fixes a bug in existing functionality.
```
fix(checkout): correct tax calculation for LKR
fix(inventory): resolve negative stock issue
fix(auth): fix token expiration handling
```

#### `docs` - Documentation
Changes to documentation only.
```
docs(api): update authentication endpoints
docs(readme): add installation instructions
docs(contributing): add code of conduct
```

#### `style` - Code Style
Formatting, missing semicolons, whitespace, etc.
```
style(utils): format according to Black
style(components): fix ESLint warnings
style(imports): sort imports with isort
```

#### `refactor` - Refactoring
Code changes that neither fix bugs nor add features.
```
refactor(models): extract base model mixin
refactor(services): simplify payment processing
refactor(hooks): consolidate API fetch logic
```

#### `perf` - Performance
Improves performance.
```
perf(queries): optimize product listing query
perf(images): add lazy loading to gallery
perf(cache): implement Redis caching for sessions
```

#### `test` - Tests
Adding or modifying tests.
```
test(auth): add JWT validation tests
test(cart): increase coverage for checkout
test(e2e): add Playwright tests for login
```

#### `build` - Build System
Changes to build process or dependencies.
```
build(docker): optimize production Dockerfile
build(deps): upgrade Django to 5.1
build(webpack): configure code splitting
```

#### `ci` - Continuous Integration
Changes to CI configuration.
```
ci(github): add automated testing workflow
ci(docker): add container build pipeline
ci(deploy): configure staging deployment
```

#### `chore` - Maintenance
Routine tasks that don't modify source code.
```
chore(deps): update development dependencies
chore(gitignore): add IDE files
chore(scripts): add database reset script
```

#### `revert` - Revert
Reverts a previous commit.
```
revert: "feat(cart): add wishlist conversion"

This reverts commit abc123.
Reason: Causes performance issues.
```

### Breaking Changes

Any type can have breaking changes. Add `!` after scope:
```
feat(api)!: change authentication response format
fix(models)!: rename User.name to User.full_name
```
```

### Type Selection Guide

| Change | Type |
|--------|------|
| New endpoint | feat |
| Bug in production | fix |
| Update README | docs |
| Run formatter | style |
| Rename variables | refactor |
| Speed optimization | perf |
| Add unit test | test |
| Update Docker | build |
| GitHub Actions | ci |
| Update gitignore | chore |

### Expected Outcome
- All types documented
- Usage examples provided

### Verification Checklist
- [ ] All 11 types defined
- [ ] Descriptions clear
- [ ] Examples for each
- [ ] Version impact noted

---

## Task 24: Define Scope Guidelines

### Overview
Document scope guidelines and conventions.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Add scope section**
   - Purpose and usage

2. **Document project scopes**
   - Backend and frontend

3. **Add examples**
   - Real-world usage

### COMMITS.md Scope Section

```markdown
## Scope Guidelines

### Purpose

The scope provides additional context about what part of the codebase 
is affected by the change. It should be a noun describing the section.

### Format
- Lowercase
- Single word preferred
- Use kebab-case if multiple words needed

### Project-Specific Scopes

#### Backend Scopes

| Scope | Description |
|-------|-------------|
| `auth` | Authentication and authorization |
| `users` | User management |
| `tenants` | Multi-tenancy |
| `products` | Product catalog |
| `inventory` | Stock management |
| `orders` | Order processing |
| `pos` | Point of sale |
| `payments` | Payment processing |
| `reports` | Reporting and analytics |
| `api` | API infrastructure |
| `models` | Database models |
| `admin` | Django admin |
| `celery` | Background tasks |
| `cache` | Caching layer |

#### Frontend Scopes

| Scope | Description |
|-------|-------------|
| `ui` | UI components |
| `dashboard` | ERP dashboard |
| `pos` | POS interface |
| `webstore` | Customer webstore |
| `auth` | Authentication UI |
| `hooks` | React hooks |
| `store` | State management |
| `api` | API client |
| `forms` | Form components |
| `layout` | Layout components |

#### Infrastructure Scopes

| Scope | Description |
|-------|-------------|
| `docker` | Docker configuration |
| `ci` | CI/CD pipelines |
| `nginx` | Nginx configuration |
| `db` | Database changes |
| `deps` | Dependencies |
| `config` | Configuration files |

### When to Use Scope

**Use scope when:**
- Change affects specific module
- Context helps understanding
- Multiple modules exist

**Omit scope when:**
- Change is global
- Scope is obvious from context
- Root-level configuration change

### Examples

```
# With scope
feat(products): add variant support
fix(checkout): correct total calculation
docs(api): update endpoint documentation

# Without scope (global changes)
chore: update dependencies
docs: add contributing guide
style: apply formatting to all files
```
```

### Scope Best Practices

| Practice | Example |
|----------|---------|
| Be specific | `products` not `backend` |
| Be consistent | Always `auth` not sometimes `authentication` |
| Keep short | `ui` not `user-interface` |

### Expected Outcome
- Scope guidelines documented
- Project scopes listed

### Verification Checklist
- [ ] Purpose explained
- [ ] Format rules defined
- [ ] Project scopes listed
- [ ] Examples provided

---

## Task 25: Define Subject Guidelines

### Overview
Document subject line guidelines.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Add subject section**
   - Writing guidelines

2. **Document rules**
   - Imperative mood, length

3. **Add do/don't**
   - Good and bad examples

### COMMITS.md Subject Section

```markdown
## Subject Guidelines

### Rules

1. **Use imperative mood** - "add" not "adds" or "added"
2. **No capitalization** - Start with lowercase
3. **No period** - Don't end with a period
4. **Be concise** - Maximum 50 characters (soft limit)
5. **Be descriptive** - Explain what the commit does

### Imperative Mood

Write subjects as commands. They should complete the sentence:
"If applied, this commit will **your subject here**"

| Good ✅ | Bad ❌ |
|---------|--------|
| add user registration | added user registration |
| fix login timeout | fixes login timeout |
| update documentation | updating documentation |
| remove deprecated API | removed deprecated API |

### Capitalization

| Good ✅ | Bad ❌ |
|---------|--------|
| add user authentication | Add user authentication |
| fix cart calculation | Fix Cart Calculation |

### Punctuation

| Good ✅ | Bad ❌ |
|---------|--------|
| add login feature | add login feature. |
| fix timeout issue | fix timeout issue; |

### Length

| Length | Status |
|--------|--------|
| ≤50 chars | Ideal |
| 50-72 chars | Acceptable |
| >72 chars | Too long, revise |

### Good vs Bad Examples

**Good subjects:**
```
add JWT token refresh endpoint
fix incorrect tax calculation for Sri Lanka
update API authentication documentation
refactor user service to use repository pattern
```

**Bad subjects:**
```
Added the JWT token refresh endpoint.          # Past tense, period
Fix bug                                         # Too vague
Update                                          # Not descriptive
This commit adds a new feature for refreshing   # Too long, not imperative
jwt tokens automatically when they expire
```

### Subject Checklist

Before committing, ask:
- [ ] Is it imperative? (add, fix, update)
- [ ] Is it lowercase?
- [ ] Is it under 50 characters?
- [ ] Does it describe what the commit does?
- [ ] Is it free of punctuation at the end?
```

### Expected Outcome
- Subject guidelines documented
- Good/bad examples provided

### Verification Checklist
- [ ] All rules listed
- [ ] Imperative mood explained
- [ ] Length limits set
- [ ] Examples provided

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Document Commit Conventions | COMMITS.md overview |
| 22 | Define Commit Format | Structure documentation |
| 23 | Define Commit Types | All types defined |
| 24 | Define Scope Guidelines | Project scopes |
| 25 | Define Subject Guidelines | Writing rules |

### COMMITS.md Progress

```
Sections Added:
├── Overview
├── Quick Reference
├── Commit Message Format
├── Commit Types
├── Scope Guidelines
└── Subject Guidelines
```

### Next Steps
Proceed to [02_Tasks-26-29_Commit-Body-Linting.md](02_Tasks-26-29_Commit-Body-Linting.md) for body, footer, and commitlint.

---

## Notes for AI Agents

1. **Conventional Commits:** Follow v1.0.0 spec
2. **Types:** Use exactly as defined
3. **Scopes:** Project-specific list
4. **Subject:** Imperative, lowercase, no period
5. **Length:** 50 chars ideal, 72 max
6. **Examples:** Include good and bad
