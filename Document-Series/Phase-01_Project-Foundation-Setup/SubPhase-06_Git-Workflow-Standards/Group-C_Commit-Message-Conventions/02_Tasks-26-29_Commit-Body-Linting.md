# Tasks 26-29: Commit Body and Linting

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** C - Commit Message Conventions  
> **Document:** 02 of 03  
> **Tasks Covered:** 26, 27, 28, 29

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-21-25_Commit-Format.md](01_Tasks-21-25_Commit-Format.md)
- **→ Next Document:** [03_Tasks-30-32_Commit-Hooks-Tools.md](03_Tasks-30-32_Commit-Hooks-Tools.md)

---

## Document Overview

This document covers commit body, footer, and commitlint setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 26 | Define Body Guidelines | Simple |
| 27 | Define Footer Guidelines | Simple |
| 28 | Install commitlint | Medium |
| 29 | Create commitlint.config.js | Simple |

---

## Task 26: Define Body Guidelines

### Overview
Document commit body guidelines.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Add body section**
   - Purpose and format

2. **Document when to use**
   - Complex changes

3. **Add examples**
   - Good body content

### COMMITS.md Body Section

```markdown
## Body Guidelines

### Purpose

The body provides additional context when the subject alone 
cannot fully explain the change. Use it to explain **what** 
changed and **why**, not how.

### When to Use Body

| Scenario | Use Body? |
|----------|-----------|
| Simple bug fix | No |
| Complex feature | Yes |
| Breaking change | Yes |
| Non-obvious reasoning | Yes |
| Multiple related changes | Yes |

### Format Rules

1. **Separate from subject** - Blank line after subject
2. **Wrap at 72 characters** - For readability
3. **Explain why** - Not just what
4. **Use bullet points** - For multiple items
5. **Reference context** - Related issues, discussions

### Body Content

**Good body content:**
- Motivation for the change
- Contrast with previous behavior
- Side effects or consequences
- Related changes in other parts
- Decisions and alternatives considered

**Avoid in body:**
- Implementation details (that's what code is for)
- Obvious statements
- Redundant information

### Examples

**Simple change (no body needed):**
```
fix(auth): correct token expiration calculation
```

**Complex change (body recommended):**
```
feat(payments): add LankaPay integration

Integrate LankaPay as a local payment option for Sri Lankan
customers. This provides lower transaction fees compared to
international payment gateways.

- Add LankaPay SDK integration
- Implement webhook handlers for payment status
- Add retry logic for failed transactions
- Update checkout flow to show LankaPay option

Note: Requires LankaPay merchant credentials in environment
variables. See .env.example for required keys.
```

**Non-obvious reasoning:**
```
refactor(models): change User.name to first_name and last_name

Separating the name field into first_name and last_name allows for
more accurate sorting by last name and proper formatting of formal
communications (e.g., "Dear Mr. Silva").

This change is backward compatible - a full_name property is
provided that returns the combined name.
```

### Body Checklist

- [ ] Is blank line after subject?
- [ ] Does it explain why?
- [ ] Is each line ≤72 characters?
- [ ] Is it useful (not obvious)?
```

### Expected Outcome
- Body guidelines documented
- Examples provided

### Verification Checklist
- [ ] When to use explained
- [ ] Format rules listed
- [ ] Content guidance given
- [ ] Examples provided

---

## Task 27: Define Footer Guidelines

### Overview
Document commit footer guidelines.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Add footer section**
   - Purpose and format

2. **Document tokens**
   - Issue references, breaking changes

3. **Add examples**
   - Common patterns

### COMMITS.md Footer Section

```markdown
## Footer Guidelines

### Purpose

The footer contains metadata about the commit, including:
- Issue/ticket references
- Breaking change notices
- Co-authors
- Reviewers

### Format

Footers use `token: value` or `token #value` format.

### Common Tokens

| Token | Purpose | Format |
|-------|---------|--------|
| `Closes` | Close issue on merge | `Closes #123` |
| `Fixes` | Fix and close issue | `Fixes #456` |
| `Refs` | Reference without closing | `Refs #789` |
| `BREAKING CHANGE` | Breaking change notice | `BREAKING CHANGE: description` |
| `Co-authored-by` | Credit co-authors | `Co-authored-by: Name <email>` |
| `Reviewed-by` | Credit reviewers | `Reviewed-by: Name <email>` |

### Issue References

**Close issues (GitHub):**
```
Closes #123
Closes #123, #124, #125
Fixes #456
Resolves #789
```

**Close issues (JIRA/Linear):**
```
Closes LCC-123
Fixes LCC-456
```

**Reference without closing:**
```
Refs #123
Related to #456
See also #789
```

### Breaking Changes

**Method 1: In footer**
```
feat(api): change authentication response format

BREAKING CHANGE: The login endpoint now returns a nested
token object instead of flat response. Clients need to
update their token extraction logic.

Before: { token: "abc123", expires: "..." }
After:  { data: { token: "abc123", expires: "..." } }
```

**Method 2: In header (with !)**
```
feat(api)!: change authentication response format

The login endpoint now returns a nested token object.

Closes #123
```

### Co-authors

Credit multiple contributors:
```
feat(dashboard): add analytics widgets

Implement new dashboard analytics widgets with charts.

Co-authored-by: Jane Dev <jane@example.com>
Co-authored-by: John Dev <john@example.com>
```

### Examples

**Standard with issue reference:**
```
fix(cart): resolve incorrect quantity calculation

The quantity was being multiplied instead of added when
updating existing cart items.

Fixes #456
```

**Multiple references:**
```
feat(reports): add sales dashboard

Add comprehensive sales reporting dashboard with
daily, weekly, and monthly views.

Closes #123
Closes #124
Refs #100
```

**Breaking change with migration:**
```
feat(models)!: rename User fields for consistency

Standardize field names across all models.

BREAKING CHANGE: The following User fields are renamed:
- name -> full_name
- phone -> phone_number
- addr -> address

Run migration: python manage.py migrate
Update queries that reference old field names.

Closes #200
```
```

### Expected Outcome
- Footer guidelines documented
- Token formats defined

### Verification Checklist
- [ ] Tokens documented
- [ ] Issue references explained
- [ ] Breaking changes covered
- [ ] Examples provided

---

## Task 28: Install commitlint

### Overview
Install commitlint for commit message validation.

### Dependencies
- Task 22: Format defined

### Instructions

1. **Install commitlint**
   - At repository root

2. **Install config**
   - Conventional config

3. **Verify installation**
   - Check version

### Installation Commands

```bash
# At repository root
cd /path/to/lankacommerce-cloud

# Install commitlint and config
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Verify installation
npx commitlint --version
```

### Package.json Updates

```json
{
  "devDependencies": {
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0"
  }
}
```

### Root vs Frontend

Install at repository root for monorepo:
```
/                            # Install here
├── package.json             # Root package.json
├── commitlint.config.js     # Root config
├── backend/
└── frontend/
    └── package.json         # Frontend dependencies
```

### Why commitlint

| Feature | Benefit |
|---------|---------|
| Automated | Catches mistakes |
| Consistent | Enforces convention |
| Configurable | Custom rules |
| CI integration | Validate in pipeline |

### Expected Outcome
- commitlint installed
- Ready for configuration

### Verification Checklist
- [ ] @commitlint/cli installed
- [ ] @commitlint/config-conventional installed
- [ ] npx commitlint works
- [ ] In root package.json

---

## Task 29: Create commitlint.config.js

### Overview
Create commitlint configuration file.

### Dependencies
- Task 28: commitlint installed

### Instructions

1. **Create config file**
   - At repository root

2. **Extend conventional**
   - Base configuration

3. **Add custom rules**
   - Project-specific

### File Location

```
/                            # Repository root
├── commitlint.config.js     # commitlint config
├── package.json
└── ...
```

### commitlint.config.js Content

```javascript
// ==================================================
// LankaCommerce Cloud - commitlint Configuration
// ==================================================
// Enforces Conventional Commits specification
// ==================================================

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Type rules
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code restructuring
        'perf',     // Performance
        'test',     // Tests
        'build',    // Build system
        'ci',       // CI/CD
        'chore',    // Maintenance
        'revert',   // Revert commit
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    
    // Scope rules
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [
      1, // Warning (not error)
      'always',
      [
        // Backend scopes
        'auth',
        'users',
        'tenants',
        'products',
        'inventory',
        'orders',
        'pos',
        'payments',
        'reports',
        'api',
        'models',
        'admin',
        'celery',
        'cache',
        
        // Frontend scopes
        'ui',
        'dashboard',
        'webstore',
        'hooks',
        'store',
        'forms',
        'layout',
        
        // Infrastructure
        'docker',
        'ci',
        'nginx',
        'db',
        'deps',
        'config',
      ],
    ],
    
    // Subject rules
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [1, 'always', 72],
    
    // Header rules
    'header-max-length': [2, 'always', 72],
    
    // Body rules
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [1, 'always', 100],
    
    // Footer rules
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [1, 'always', 100],
  },
};
```

### Rule Severity Levels

| Level | Meaning | Effect |
|-------|---------|--------|
| 0 | Disabled | Rule ignored |
| 1 | Warning | Warn but allow |
| 2 | Error | Block commit |

### Key Rules Explained

| Rule | Level | Purpose |
|------|-------|---------|
| type-enum | 2 | Must use allowed types |
| type-empty | 2 | Type is required |
| scope-enum | 1 | Suggested scopes (warning) |
| subject-empty | 2 | Subject is required |
| header-max-length | 2 | Max 72 characters |
| body-leading-blank | 2 | Blank line before body |

### Test Configuration

```bash
# Test valid commit
echo "feat(auth): add login" | npx commitlint

# Test invalid commit
echo "Add login" | npx commitlint
# Should fail: type is missing
```

### Alternative: .commitlintrc.json

Can also use JSON format:
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [2, "always", ["feat", "fix", "docs"]]
  }
}
```

### Expected Outcome
- Configuration created
- Rules defined

### Verification Checklist
- [ ] File created at root
- [ ] Extends conventional
- [ ] Types defined
- [ ] Scopes suggested
- [ ] Test passes

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 26 | Define Body Guidelines | Body documentation |
| 27 | Define Footer Guidelines | Footer tokens |
| 28 | Install commitlint | Package installed |
| 29 | Create commitlint.config.js | Configuration file |

### COMMITS.md Progress

```
Sections Added:
├── Body Guidelines
└── Footer Guidelines
```

### Files Created

```
/                            # Repository root
├── package.json             # Updated with commitlint
└── commitlint.config.js     # commitlint configuration
```

### Next Steps
Proceed to [03_Tasks-30-32_Commit-Hooks-Tools.md](03_Tasks-30-32_Commit-Hooks-Tools.md) for hooks and Commitizen.

---

## Notes for AI Agents

1. **Body:** Explain why, not how
2. **Footer:** Use standard tokens
3. **commitlint:** Install at repo root
4. **Config:** Use JavaScript format
5. **Scopes:** Warning level (1), not error
6. **Test:** Validate config works
