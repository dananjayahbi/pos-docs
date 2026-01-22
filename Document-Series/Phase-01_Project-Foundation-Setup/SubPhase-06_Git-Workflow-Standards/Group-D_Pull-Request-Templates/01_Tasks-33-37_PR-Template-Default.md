# Tasks 33-37: PR Template Default

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** D - Pull Request Templates  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Commit-Message-Conventions/03_Tasks-30-32_Commit-Hooks-Tools.md](../Group-C_Commit-Message-Conventions/03_Tasks-30-32_Commit-Hooks-Tools.md)
- **→ Next Document:** [02_Tasks-38-41_PR-Template-Sections.md](02_Tasks-38-41_PR-Template-Sections.md)

---

## Document Overview

This document covers creating the default PR template.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create .github/ Directory | Simple |
| 34 | Create PULL_REQUEST_TEMPLATE.md | Medium |
| 35 | Add PR Description Section | Simple |
| 36 | Add PR Type Checklist | Simple |
| 37 | Add Testing Checklist | Simple |

---

## Task 33: Create .github/ Directory

### Overview
Create .github directory for GitHub configuration files.

### Dependencies
- Task 01: Git repository initialized

### Instructions

1. **Create directory**
   - At repository root

2. **Add .gitkeep**
   - If directory empty initially

3. **Verify structure**
   - Check location

### Directory Structure

```
/                            # Repository root
├── .github/                 # GitHub configuration
│   └── (templates will go here)
├── .git/
├── backend/
├── frontend/
└── ...
```

### Create Directory

```bash
# Create .github directory
mkdir -p .github

# Add .gitkeep if needed
touch .github/.gitkeep
```

### What Goes in .github

| File/Directory | Purpose |
|----------------|---------|
| PULL_REQUEST_TEMPLATE.md | Default PR template |
| PULL_REQUEST_TEMPLATE/ | Multiple PR templates |
| ISSUE_TEMPLATE/ | Issue templates |
| workflows/ | GitHub Actions |
| CODEOWNERS | Code ownership |
| FUNDING.yml | Sponsorship info |
| SECURITY.md | Security policy |

### Expected Outcome
- .github directory exists
- Ready for templates

### Verification Checklist
- [ ] Directory created
- [ ] At repository root
- [ ] Tracked in git

---

## Task 34: Create PULL_REQUEST_TEMPLATE.md

### Overview
Create default pull request template file.

### Dependencies
- Task 33: .github directory exists

### Instructions

1. **Create template file**
   - In .github directory

2. **Add header**
   - Template title

3. **Set up structure**
   - Section placeholders

### File Location

```
.github/
└── PULL_REQUEST_TEMPLATE.md
```

### Initial Template Structure

```markdown
<!--
LankaCommerce Cloud - Pull Request Template
============================================
Please fill out this template completely.
Remove sections that don't apply.
-->

## Description

<!-- Describe your changes in detail -->

## Type of Change

<!-- Mark the appropriate option -->

## Testing

<!-- Describe testing performed -->

## Documentation

<!-- Documentation updates -->

## Breaking Changes

<!-- List any breaking changes -->

## Related Issues

<!-- Link to related issues -->

## Screenshots

<!-- Add screenshots if applicable -->
```

### Why PR Templates

| Benefit | Description |
|---------|-------------|
| Consistency | All PRs have same structure |
| Completeness | Important info not forgotten |
| Faster reviews | Reviewers know where to look |
| Self-documentation | PR serves as change record |

### Expected Outcome
- Template file created
- Basic structure in place

### Verification Checklist
- [ ] File created
- [ ] In correct location
- [ ] Has all sections
- [ ] Valid markdown

---

## Task 35: Add PR Description Section

### Overview
Add description section to PR template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add description section**
   - What changed

2. **Add motivation**
   - Why changed

3. **Add prompts**
   - Guide contributors

### Description Section Content

```markdown
## Description

### What does this PR do?
<!-- Provide a brief summary of your changes -->


### Why is this change needed?
<!-- Explain the motivation and context -->


### How was this implemented?
<!-- Describe the approach taken (optional, for complex changes) -->

```

### Alternative: Simpler Version

```markdown
## Description

<!-- 
Describe your changes in detail:
- What problem does this solve?
- What approach was taken?
- Any important decisions or trade-offs?
-->

```

### Description Best Practices

| Practice | Example |
|----------|---------|
| Be specific | "Add email validation" not "Fix bug" |
| Link context | "Per discussion in #123" |
| Explain why | "Customers requested this feature" |
| Note alternatives | "Chose X over Y because..." |

### Expected Outcome
- Description section complete
- Clear prompts for authors

### Verification Checklist
- [ ] What changed
- [ ] Why changed
- [ ] Clear instructions
- [ ] Placeholder comments

---

## Task 36: Add PR Type Checklist

### Overview
Add type of change checklist to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add type section**
   - Change categories

2. **Add checkboxes**
   - Selectable options

3. **Include all types**
   - Feature, fix, etc.

### Type Checklist Section

```markdown
## Type of Change

<!-- Mark the appropriate option(s) with an "x" -->

- [ ] 🚀 **Feature** - New functionality
- [ ] 🐛 **Bug Fix** - Fix for an existing issue
- [ ] 📝 **Documentation** - Documentation only changes
- [ ] 🎨 **Style** - Formatting, no code change
- [ ] ♻️ **Refactor** - Code restructuring, no behavior change
- [ ] ⚡ **Performance** - Performance improvement
- [ ] ✅ **Test** - Adding or updating tests
- [ ] 🔧 **Build/CI** - Build or CI configuration
- [ ] 🧹 **Chore** - Maintenance, dependencies
- [ ] ⚠️ **Breaking Change** - Changes that break existing functionality

```

### Checkbox Usage

GitHub markdown checkboxes:
- `- [ ]` = unchecked
- `- [x]` = checked

Authors mark appropriate types when creating PR.

### Type Definitions

| Type | When to Use |
|------|-------------|
| Feature | New user-facing functionality |
| Bug Fix | Fixing broken functionality |
| Documentation | Only docs changed |
| Style | Code formatting only |
| Refactor | Internal restructuring |
| Performance | Speed/memory improvements |
| Test | Test additions/changes |
| Build/CI | Pipeline changes |
| Chore | Dependency updates, cleanup |
| Breaking | Incompatible API changes |

### Expected Outcome
- Type checklist added
- Clear categories

### Verification Checklist
- [ ] All types included
- [ ] Checkboxes work
- [ ] Emojis for visibility
- [ ] Clear descriptions

---

## Task 37: Add Testing Checklist

### Overview
Add testing checklist to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add testing section**
   - Test requirements

2. **Add checklist**
   - Test types

3. **Add description area**
   - Test details

### Testing Section Content

```markdown
## Testing

### Tests Checklist

<!-- Mark completed items with an "x" -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] All existing tests pass
- [ ] Test coverage maintained or improved

### Testing Performed

<!-- Describe testing you've done -->

#### Manual Testing
<!-- 
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Observe '...'
-->

#### Test Evidence
<!-- 
Include any of:
- Test output/logs
- Coverage reports
- Screenshots of test results
-->

```

### Alternative: Simpler Version

```markdown
## Testing

<!-- How has this been tested? -->

- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] I have tested manually in the development environment

**Test Description:**
<!-- Describe the tests you ran -->

```

### Testing Categories

| Category | Description |
|----------|-------------|
| Unit | Individual component tests |
| Integration | Component interaction tests |
| E2E | Full user flow tests |
| Manual | Human verification |
| Regression | Existing functionality |

### Expected Outcome
- Testing section added
- Clear requirements

### Verification Checklist
- [ ] Test types covered
- [ ] Checklist format
- [ ] Manual test area
- [ ] Evidence section

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Create .github/ Directory | GitHub config directory |
| 34 | Create PULL_REQUEST_TEMPLATE.md | Template file |
| 35 | Add PR Description Section | What/why/how |
| 36 | Add PR Type Checklist | Change categories |
| 37 | Add Testing Checklist | Test requirements |

### Template Progress

```markdown
## Description
### What does this PR do?
### Why is this change needed?

## Type of Change
- [ ] Feature
- [ ] Bug Fix
- [ ] Documentation
...

## Testing
### Tests Checklist
### Testing Performed
```

### Next Steps
Proceed to [02_Tasks-38-41_PR-Template-Sections.md](02_Tasks-38-41_PR-Template-Sections.md) for additional sections.

---

## Notes for AI Agents

1. **Location:** .github/PULL_REQUEST_TEMPLATE.md
2. **Checkboxes:** Use `- [ ]` format
3. **Comments:** Use HTML comments for instructions
4. **Emojis:** Improve visibility
5. **Sections:** Keep logical order
6. **Prompts:** Guide contributors
