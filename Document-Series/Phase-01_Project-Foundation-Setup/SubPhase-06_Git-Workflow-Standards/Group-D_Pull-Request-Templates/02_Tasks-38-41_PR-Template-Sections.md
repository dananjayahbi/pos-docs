# Tasks 38-41: PR Template Sections

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** D - Pull Request Templates  
> **Document:** 02 of 03  
> **Tasks Covered:** 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-37_PR-Template-Default.md](01_Tasks-33-37_PR-Template-Default.md)
- **→ Next Document:** [03_Tasks-42-44_PR-Template-Types.md](03_Tasks-42-44_PR-Template-Types.md)

---

## Document Overview

This document covers additional PR template sections.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 38 | Add Documentation Checklist | Simple |
| 39 | Add Breaking Changes Section | Simple |
| 40 | Add Related Issues Section | Simple |
| 41 | Add Screenshots Section | Simple |

---

## Task 38: Add Documentation Checklist

### Overview
Add documentation checklist to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add docs section**
   - Documentation requirements

2. **Add checklist**
   - What to update

3. **Add note**
   - When docs not needed

### Documentation Section Content

```markdown
## Documentation

<!-- Mark completed items with an "x" -->

- [ ] README.md updated (if needed)
- [ ] API documentation updated (if API changes)
- [ ] Code comments added/updated
- [ ] CHANGELOG.md updated
- [ ] User guide updated (if user-facing changes)
- [ ] Developer docs updated (if architecture changes)

### Documentation Notes
<!-- 
If documentation is not needed, explain why:
- Internal refactor only
- Test changes only
- Config/build changes only
-->

```

### Alternative: Simpler Version

```markdown
## Documentation

- [ ] I have updated the documentation accordingly
- [ ] No documentation changes are needed

**Documentation Changes:**
<!-- Describe any documentation updates made -->

```

### Documentation Types

| Type | When to Update |
|------|----------------|
| README | Major features, setup changes |
| API docs | Endpoint changes |
| Comments | Complex code |
| CHANGELOG | All user-facing changes |
| User guide | UX changes |
| Dev docs | Architecture changes |

### Expected Outcome
- Documentation section added
- Clear requirements

### Verification Checklist
- [ ] All doc types covered
- [ ] Checklist format
- [ ] Not-needed option
- [ ] Notes area included

---

## Task 39: Add Breaking Changes Section

### Overview
Add breaking changes section to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add breaking section**
   - Warning for breaking changes

2. **Add checklist**
   - Migration requirements

3. **Add details area**
   - What's breaking

### Breaking Changes Section Content

```markdown
## Breaking Changes

<!-- If this PR introduces breaking changes, complete this section -->

### Is this a breaking change?

- [ ] ⚠️ **Yes, this is a breaking change**
- [ ] ✅ No breaking changes

### If yes, please describe:

<!-- 
Breaking changes include:
- API endpoint changes
- Database schema changes
- Configuration changes
- Removed features
- Changed behavior
-->

#### What is changing?
<!-- Describe what existing behavior is changing -->


#### Migration Steps
<!-- 
Provide clear migration instructions:
1. Step one
2. Step two
3. Step three
-->


#### Who is affected?
<!-- Which users/systems are affected? -->
- [ ] End users
- [ ] API consumers
- [ ] Database administrators
- [ ] DevOps/Infrastructure

```

### Alternative: Simpler Version

```markdown
## Breaking Changes

<!-- Delete this section if there are no breaking changes -->

**⚠️ This PR introduces breaking changes:**

- Change 1: Description and migration steps
- Change 2: Description and migration steps

**Migration Required:**
```
# Migration commands or steps
```

```

### Breaking Change Categories

| Category | Example |
|----------|---------|
| API | Endpoint URL changed |
| Schema | Database column renamed |
| Config | Environment variable renamed |
| Behavior | Default value changed |
| Removal | Feature deprecated |

### Expected Outcome
- Breaking changes section added
- Migration guidance included

### Verification Checklist
- [ ] Clear yes/no checkbox
- [ ] Description area
- [ ] Migration steps
- [ ] Affected parties listed

---

## Task 40: Add Related Issues Section

### Overview
Add related issues section to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add issues section**
   - Link to related issues

2. **Add keywords**
   - Closes, Fixes, etc.

3. **Add examples**
   - How to reference

### Related Issues Section Content

```markdown
## Related Issues

<!-- Link to related issues using GitHub keywords -->

### Issue References

<!-- 
Use keywords to automatically close issues:
- `Closes #123` - Closes issue when PR is merged
- `Fixes #456` - Closes and labels as fixed
- `Resolves #789` - Closes issue

Use keywords to reference without closing:
- `Refs #123` - Reference only
- `Related to #456` - Related discussion
- `See #789` - Additional context
-->

Closes #
Refs #

### Links
<!-- Add any relevant links -->
- Design document: 
- Slack discussion: 
- External reference: 

```

### Alternative: Simpler Version

```markdown
## Related Issues

<!-- 
Link to the issue this PR addresses.
Use "Closes #123" to auto-close when merged.
-->

Closes #

**Related PRs:**
- #

```

### GitHub Keywords

| Keyword | Effect |
|---------|--------|
| Closes | Auto-closes issue on merge |
| Fixes | Auto-closes, marks as fixed |
| Resolves | Auto-closes issue |
| Refs | Reference only, no auto-close |
| Related | Reference only |

### Expected Outcome
- Issues section added
- Proper linking enabled

### Verification Checklist
- [ ] Closes keyword explained
- [ ] Multiple reference types
- [ ] Example provided
- [ ] Links area included

---

## Task 41: Add Screenshots Section

### Overview
Add screenshots section to template.

### Dependencies
- Task 34: Template file exists

### Instructions

1. **Add screenshots section**
   - For visual changes

2. **Add before/after**
   - Comparison view

3. **Add note**
   - When to include

### Screenshots Section Content

```markdown
## Screenshots

<!-- Include screenshots for UI changes -->

### When to Include Screenshots

- [ ] This PR includes visual/UI changes
- [ ] Screenshots are attached below

<!-- If no UI changes, you can delete this section -->

### Before

<!-- 
Add screenshot of current behavior:
![Before](url-to-before-image)
-->


### After

<!-- 
Add screenshot of new behavior:
![After](url-to-after-image)
-->


### Additional Screenshots

<!-- 
Add any additional context:
- Mobile view
- Dark mode
- Error states
- Loading states
-->

```

### Alternative: Simpler Version

```markdown
## Screenshots

<!-- Add screenshots for UI changes. Delete if not applicable. -->

| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

```

### Screenshot Best Practices

| Practice | Reason |
|----------|--------|
| Annotate | Highlight changes |
| Before/after | Show comparison |
| Responsive | Show mobile if relevant |
| States | Show different states |
| GIF | For interactions |

### Adding Images to GitHub PR

```markdown
<!-- Drag and drop -->
![Description](image-url)

<!-- Or paste directly in the text area -->
```

### Expected Outcome
- Screenshots section added
- Before/after format

### Verification Checklist
- [ ] Before/after areas
- [ ] Checkbox for UI changes
- [ ] Image syntax examples
- [ ] Delete note if not applicable

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 38 | Add Documentation Checklist | Docs requirements |
| 39 | Add Breaking Changes Section | Migration info |
| 40 | Add Related Issues Section | Issue linking |
| 41 | Add Screenshots Section | Visual comparison |

### Complete Default Template

```markdown
<!--
LankaCommerce Cloud - Pull Request Template
-->

## Description
### What does this PR do?
### Why is this change needed?

## Type of Change
- [ ] Feature
- [ ] Bug Fix
(etc.)

## Testing
### Tests Checklist
### Testing Performed

## Documentation
- [ ] README updated
- [ ] API docs updated
(etc.)

## Breaking Changes
- [ ] Yes, breaking change
- [ ] No breaking changes

## Related Issues
Closes #
Refs #

## Screenshots
### Before
### After
```

### Next Steps
Proceed to [03_Tasks-42-44_PR-Template-Types.md](03_Tasks-42-44_PR-Template-Types.md) for specialized templates.

---

## Notes for AI Agents

1. **Documentation:** Include all doc types
2. **Breaking:** Require migration steps
3. **Issues:** Use GitHub keywords
4. **Screenshots:** Before/after format
5. **Delete note:** Allow removing sections
6. **Complete:** All sections now defined
