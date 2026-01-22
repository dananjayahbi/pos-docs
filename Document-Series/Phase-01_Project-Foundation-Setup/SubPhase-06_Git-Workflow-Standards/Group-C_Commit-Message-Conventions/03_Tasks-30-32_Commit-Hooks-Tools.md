# Tasks 30-32: Commit Hooks and Tools

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** C - Commit Message Conventions  
> **Document:** 03 of 03  
> **Tasks Covered:** 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-26-29_Commit-Body-Linting.md](02_Tasks-26-29_Commit-Body-Linting.md)
- **→ Next Group:** [../Group-D_Pull-Request-Templates/00_GROUP_OVERVIEW.md](../Group-D_Pull-Request-Templates/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers commit message hooks and Commitizen setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 30 | Add Commit Message Hook | Medium |
| 31 | Create Commit Examples | Simple |
| 32 | Install Commitizen | Simple |

---

## Task 30: Add Commit Message Hook

### Overview
Add commit-msg hook to validate commit messages.

### Dependencies
- Task 29: commitlint.config.js exists

### Instructions

1. **Install Husky**
   - If not already installed

2. **Add commit-msg hook**
   - Run commitlint

3. **Test the hook**
   - Make test commit

### Install Husky (if not installed)

```bash
# At repository root
npm install --save-dev husky

# Initialize Husky
npx husky init
```

### Add commit-msg Hook

```bash
# Create commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

### .husky/commit-msg Content

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message with commitlint
npx --no -- commitlint --edit ${1}
```

### Make Hook Executable

```bash
chmod +x .husky/commit-msg
```

### Directory Structure

```
/                            # Repository root
├── .husky/
│   ├── _/
│   │   └── husky.sh
│   ├── pre-commit           # Pre-commit hook (from SubPhase-05)
│   └── commit-msg           # Commit message hook (new)
├── commitlint.config.js
└── package.json
```

### Test the Hook

```bash
# Valid commit (should pass)
git commit -m "feat(auth): add login endpoint"

# Invalid commit (should fail)
git commit -m "Add login"
# Error: type is required
```

### Expected Hook Output

Valid commit:
```
[main abc1234] feat(auth): add login endpoint
 1 file changed, 10 insertions(+)
```

Invalid commit:
```
⧗   input: Add login
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
```

### Bypass Hook (Emergency)

```bash
git commit --no-verify -m "emergency fix"
```

### Expected Outcome
- commit-msg hook added
- Messages validated

### Verification Checklist
- [ ] Husky installed
- [ ] commit-msg hook created
- [ ] Hook is executable
- [ ] Valid commits pass
- [ ] Invalid commits fail

---

## Task 31: Create Commit Examples

### Overview
Add commit examples to documentation.

### Dependencies
- Task 21: COMMITS.md exists

### Instructions

1. **Add examples section**
   - Various scenarios

2. **Show good examples**
   - Complete messages

3. **Show bad examples**
   - Common mistakes

### COMMITS.md Examples Section

```markdown
## Commit Examples

### Feature Commits

**Simple feature:**
```
feat(products): add product variant support
```

**Feature with body:**
```
feat(checkout): implement multi-currency support

Add support for USD, EUR, and GBP in addition to LKR.
Exchange rates are fetched from Central Bank of Sri Lanka
API and cached for 1 hour.

- Add currency selector to checkout
- Implement exchange rate service
- Update price display components
- Add currency preference to user settings

Closes #234
```

**Feature with breaking change:**
```
feat(api)!: change product response structure

BREAKING CHANGE: Product API now returns nested category
object instead of category_id.

Before: { id: 1, category_id: 5 }
After:  { id: 1, category: { id: 5, name: "Electronics" } }

Closes #300
```

### Bug Fix Commits

**Simple fix:**
```
fix(cart): correct quantity update calculation
```

**Fix with explanation:**
```
fix(auth): resolve token refresh race condition

When multiple API calls were made simultaneously with an
expired token, each call would attempt to refresh the token,
causing duplicate refresh requests.

Implement request queuing to ensure only one refresh
request is made and other requests wait for it.

Fixes #456
```

### Documentation Commits

```
docs(api): add authentication endpoint documentation
```

```
docs(readme): update installation instructions

Add prerequisites section and troubleshooting guide for
common installation issues.
```

### Refactor Commits

```
refactor(models): extract audit fields to mixin
```

```
refactor(services): simplify order processing logic

Break down the monolithic process_order function into
smaller, testable units:

- validate_order()
- calculate_totals()
- apply_discounts()
- process_payment()
- update_inventory()

No functional changes.
```

### Test Commits

```
test(auth): add JWT validation test coverage
```

```
test(cart): improve checkout integration tests

Add tests for:
- Empty cart checkout attempt
- Out of stock items
- Discount code application
- Multi-currency checkout
```

### Build/CI Commits

```
build(docker): optimize production image size
```

```
ci(github): add automated deployment workflow

Add GitHub Actions workflow for:
- Run tests on PR
- Build Docker images on merge
- Deploy to staging on develop merge
- Deploy to production on release tags
```

### Chore Commits

```
chore(deps): update Django to 5.1
```

```
chore: update development dependencies

- black: 24.3.0 -> 24.4.0
- pytest: 8.0.0 -> 8.1.0
- eslint: 8.56.0 -> 8.57.0
```

### Revert Commits

```
revert: "feat(cart): add wishlist conversion"

This reverts commit 3a7e2f1.

Reason: Feature caused performance regression in cart
loading. Needs optimization before re-implementation.
```

### Bad Examples (Avoid These)

```
# ❌ No type
Add user authentication

# ❌ Past tense
feat(auth): added login functionality

# ❌ Too vague
fix: bug fix

# ❌ Ends with period
feat(products): add search feature.

# ❌ Capital letter
Fix(auth): resolve token issue

# ❌ Too long subject
feat(checkout): implement a new multi-step checkout process with 
address validation and payment integration

# ❌ Not imperative
feat(api): this commit adds new endpoints
```
```

### Expected Outcome
- Examples documented
- Good/bad patterns shown

### Verification Checklist
- [ ] All types covered
- [ ] With/without body
- [ ] Breaking changes shown
- [ ] Bad examples included

---

## Task 32: Install Commitizen

### Overview
Install Commitizen for interactive commit creation.

### Dependencies
- Task 28: commitlint installed

### Instructions

1. **Install Commitizen**
   - At repository root

2. **Add npm script**
   - For easy usage

3. **Document usage**
   - How to run

### Installation Commands

```bash
# Install Commitizen and adapter
npm install --save-dev commitizen cz-conventional-changelog

# Initialize Commitizen config
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

### Package.json Updates

```json
{
  "scripts": {
    "commit": "cz"
  },
  "devDependencies": {
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### Usage

```bash
# Stage changes
git add .

# Run Commitizen
npm run commit
# or
npx cz
```

### Commitizen Prompts

```
? Select the type of change that you're committing:
  feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  build:    Changes that affect the build system or external dependencies
  ci:       Changes to our CI configuration files and scripts
  chore:    Other changes that don't modify src or test files
  revert:   Reverts a previous commit

? What is the scope of this change (e.g. component or file name)?
> auth

? Write a short, imperative tense description of the change:
> add JWT token refresh endpoint

? Provide a longer description of the change (optional):
> Implement automatic token refresh functionality

? Are there any breaking changes? No
? Does this change affect any open issues? Yes
? Add issue references (e.g. "fix #123", "re #123".):
> Closes #123

# Result:
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh functionality

Closes #123
```

### COMMITS.md Commitizen Section

```markdown
## Using Commitizen

### Overview
Commitizen provides an interactive CLI for creating well-formatted
commit messages.

### Installation
Commitizen is installed as a dev dependency:
```bash
npm install
```

### Usage
```bash
# Stage your changes
git add .

# Run Commitizen
npm run commit
```

### Workflow
1. Select type (feat, fix, etc.)
2. Enter scope (optional)
3. Write subject
4. Add body (optional)
5. Add breaking change notes (if any)
6. Reference issues

### Skipping Commitizen
You can also commit normally:
```bash
git commit -m "feat(auth): add login endpoint"
```

Commitizen is optional but recommended for:
- New team members
- Complex commits
- Breaking changes
```

### Expected Outcome
- Commitizen installed
- Interactive commits available

### Verification Checklist
- [ ] commitizen installed
- [ ] cz-conventional-changelog installed
- [ ] npm run commit works
- [ ] Prompts guide user
- [ ] Output is valid

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 30 | Add Commit Message Hook | commit-msg hook |
| 31 | Create Commit Examples | Examples in COMMITS.md |
| 32 | Install Commitizen | Interactive commits |

### Group C Complete

```
/                            # Repository root
├── docs/
│   └── COMMITS.md           # Complete documentation
├── .husky/
│   ├── pre-commit           # Code quality hooks
│   └── commit-msg           # Message validation hook
├── commitlint.config.js     # commitlint rules
└── package.json             # Updated with tools
```

### Package.json Final State

```json
{
  "scripts": {
    "prepare": "husky",
    "commit": "cz"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "husky": "^9.0.0"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### Next Steps
Proceed to [../Group-D_Pull-Request-Templates/00_GROUP_OVERVIEW.md](../Group-D_Pull-Request-Templates/00_GROUP_OVERVIEW.md) for PR templates.

---

## Notes for AI Agents

1. **Hook:** Use npx --no -- for commitlint
2. **Examples:** Show all types
3. **Bad examples:** Help avoid mistakes
4. **Commitizen:** Optional but helpful
5. **Script:** Add npm run commit
6. **Bypass:** Document --no-verify
