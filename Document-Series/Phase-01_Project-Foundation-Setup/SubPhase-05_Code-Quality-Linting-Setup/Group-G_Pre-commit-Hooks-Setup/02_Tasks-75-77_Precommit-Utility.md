# Tasks 75-77: Pre-commit Utility Hooks

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** G - Pre-commit Hooks Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-74_Precommit-Python.md](01_Tasks-69-74_Precommit-Python.md)
- **→ Next Document:** [03_Tasks-78-82_Husky-Lintstaged.md](03_Tasks-78-82_Husky-Lintstaged.md)

---

## Document Overview

This document covers adding utility hooks for file cleanup and validation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Add Trailing Whitespace Hook | Simple |
| 76 | Add End-of-File Hook | Simple |
| 77 | Add YAML Check Hook | Simple |

---

## Task 75: Add Trailing Whitespace Hook

### Overview
Add hook to remove trailing whitespace from files.

### Dependencies
- Task 70: .pre-commit-config.yaml exists

### Instructions

1. **Add pre-commit-hooks repo**
   - Official utility hooks

2. **Configure hook**
   - trailing-whitespace

3. **All text files**
   - Broad coverage

### Configuration Addition

```yaml
repos:
  # General pre-commit hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0  # Use latest stable
    hooks:
      - id: trailing-whitespace
        name: Trim trailing whitespace
        description: Remove trailing whitespace from files
        args: ['--markdown-linebreak-ext=md']
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| repo | pre-commit-hooks | Official utilities |
| id | trailing-whitespace | Remove trailing spaces |
| args | markdown-linebreak | Preserve in markdown |

### Why Trailing Whitespace

| Issue | Impact |
|-------|--------|
| Noise in diffs | Unnecessary changes |
| Editor conflicts | Different settings |
| Lint warnings | Some linters flag |

### File Coverage

Runs on all text files by default:
- Python (.py)
- JavaScript (.js, .ts)
- YAML (.yml, .yaml)
- Markdown (.md)
- JSON (.json)

### Expected Outcome
- Trailing whitespace removed
- Clean diffs

### Verification Checklist
- [ ] Hook added
- [ ] Markdown linebreaks preserved
- [ ] All text files covered

---

## Task 76: Add End-of-File Hook

### Overview
Add hook to ensure files end with newline.

### Dependencies
- Task 75: pre-commit-hooks repo added

### Instructions

1. **Add end-of-file-fixer**
   - Same repo

2. **Configure hook**
   - Default settings

3. **All files**
   - Consistent endings

### Configuration Addition

```yaml
      - id: end-of-file-fixer
        name: Fix end of files
        description: Ensure files end with a newline
```

### Why End-of-File Newline

| Reason | Explanation |
|--------|-------------|
| POSIX | Text files should end with newline |
| Git | Better diffs |
| Concatenation | Files combine correctly |

### Which Files

Runs on all text files:
```yaml
# To exclude binaries
exclude: '^.*\.(png|jpg|gif|ico|woff|woff2|ttf|eot)$'
```

### Common Exclusions

| Pattern | Reason |
|---------|--------|
| Images | Binary files |
| Fonts | Binary files |
| Lock files | Auto-generated |

### Expected Outcome
- Files end with newline
- Consistent formatting

### Verification Checklist
- [ ] Hook added
- [ ] Runs on text files
- [ ] Excludes binaries

---

## Task 77: Add YAML Check Hook

### Overview
Add hook to validate YAML file syntax.

### Dependencies
- Task 75: pre-commit-hooks repo added

### Instructions

1. **Add check-yaml**
   - Same repo

2. **Configure hook**
   - Allow multi-document

3. **All YAML files**
   - Syntax validation

### Configuration Addition

```yaml
      - id: check-yaml
        name: Check YAML syntax
        description: Validate YAML file syntax
        args: ['--allow-multiple-documents']
```

### Hook Options

| Option | Value | Purpose |
|--------|-------|---------|
| allow-multiple-documents | flag | Support --- separators |

### YAML Files in Project

| File | Purpose |
|------|---------|
| docker-compose.yml | Docker services |
| .pre-commit-config.yaml | This config |
| CI/CD configs | Pipelines |

### Additional YAML Hooks

Optional hooks for YAML:
```yaml
      - id: check-yaml
        args: ['--allow-multiple-documents', '--unsafe']  # For custom tags
```

### Why YAML Validation

| Issue | Prevention |
|-------|-----------|
| Indentation errors | Caught before commit |
| Syntax mistakes | Fail fast |
| Missing quotes | Early detection |

### Expected Outcome
- YAML validated
- Syntax errors caught

### Verification Checklist
- [ ] Hook added
- [ ] Multi-document allowed
- [ ] All YAML files covered

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 75 | Trailing Whitespace Hook | Clean whitespace |
| 76 | End-of-File Hook | Newline endings |
| 77 | YAML Check Hook | Valid YAML |

### Complete Utility Hooks Section

```yaml
  # General pre-commit hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
        name: Trim trailing whitespace
        args: ['--markdown-linebreak-ext=md']
      
      - id: end-of-file-fixer
        name: Fix end of files
      
      - id: check-yaml
        name: Check YAML syntax
        args: ['--allow-multiple-documents']
```

### Optional Additional Hooks

Consider adding:
```yaml
      # Additional useful hooks
      - id: check-added-large-files
        name: Check for large files
        args: ['--maxkb=500']
      
      - id: check-merge-conflict
        name: Check for merge conflicts
      
      - id: check-json
        name: Check JSON syntax
      
      - id: mixed-line-ending
        name: Check line endings
        args: ['--fix=lf']
      
      - id: debug-statements
        name: Check for debug statements
```

### Hook Categories

| Category | Hooks |
|----------|-------|
| Formatting | trailing-whitespace, end-of-file-fixer |
| Validation | check-yaml, check-json |
| Safety | check-merge-conflict, check-added-large-files |
| Debug | debug-statements |

### Next Steps
Proceed to [03_Tasks-78-82_Husky-Lintstaged.md](03_Tasks-78-82_Husky-Lintstaged.md) for Husky setup.

---

## Notes for AI Agents

1. **Repository:** Use pre-commit/pre-commit-hooks
2. **Version:** Use v4.6.0 or latest
3. **Markdown:** Preserve linebreaks for md files
4. **YAML:** Allow multiple documents
5. **Optional:** Add safety hooks as needed
6. **Order:** Run utility hooks first, then language-specific
