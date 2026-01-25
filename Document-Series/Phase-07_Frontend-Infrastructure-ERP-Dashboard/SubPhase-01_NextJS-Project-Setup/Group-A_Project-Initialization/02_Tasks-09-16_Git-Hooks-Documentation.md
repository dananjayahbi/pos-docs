# Tasks 09-16: Git, Hooks, and Documentation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** A - Project Initialization  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Project-PackageManager-Setup.md](01_Tasks-01-08_Project-PackageManager-Setup.md)

---

## Document Overview

This document covers Git initialization for the frontend project, creation of frontend-specific .gitignore and .gitattributes files, setup of Husky Git hooks for pre-commit and pre-push validation, configuration of lint-staged for efficient linting, commitlint for conventional commit enforcement, creation of comprehensive README documentation, and final verification of the complete setup.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Initialize Git for Frontend | Low | 10 min |
| 10 | Create Frontend .gitignore | Low | 15 min |
| 11 | Create Frontend .gitattributes | Low | 10 min |
| 12 | Set Up Husky Git Hooks | Medium | 25 min |
| 13 | Configure lint-staged | Low | 15 min |
| 14 | Create commitlint Configuration | Low | 15 min |
| 15 | Create Frontend README.md | Low | 20 min |
| 16 | Verify Initial Setup | Low | 15 min |

---

## Task 09: Initialize Git for Frontend

### Overview
Initialize Git version control for the frontend project to track code changes, enable collaboration, and integrate with CI/CD workflows. While the monorepo has Git at the root, frontend-specific Git configuration files ensure proper handling of frontend artifacts and dependencies.

### Dependencies
- Task 01: Create Next.js Project

### Instructions

1. **Verify Git initialization**
   - Check if `.git/` directory exists at monorepo root
   - Git should already be initialized for monorepo
   - Frontend will use same Git repository

2. **Navigate to frontend directory**
   - Change to `frontend/` directory
   - All Git configurations are relative to this

3. **Check Git status**
   - Run `git status` to see frontend files
   - Verify frontend files are tracked
   - Check for untracked files

4. **Review existing .gitignore**
   - Check if root .gitignore exists
   - Note what's already ignored globally
   - Frontend will add specific ignores

5. **Verify Git user configuration**
   - Check `git config user.name`
   - Check `git config user.email`
   - Ensure developer identity set

6. **Check Git branch**
   - Verify current branch (likely main or master)
   - Follow team branching strategy
   - Note default branch name

7. **Review Git history**
   - Check `git log` for existing commits
   - Understand commit history
   - Note any monorepo setup commits

### Git Repository Structure

```
.git/                    # At monorepo root
├── hooks/               # Will be enhanced by Husky
├── config              # Repository configuration
└── objects/            # Git object database

frontend/
├── .gitignore           # Frontend-specific ignores
├── .gitattributes      # Frontend-specific attributes
└── (source files)
```

### Monorepo Git Strategy

#### Single Repository Advantages
- Unified version control
- Atomic cross-project commits
- Simplified dependency management
- Shared Git hooks and workflows

#### Frontend-Specific Considerations
- Large node_modules/ directory
- Build artifacts (.next/, out/)
- IDE configuration files
- Environment variable files
- Cache directories

### Git Configuration Levels

| Level | Scope | Priority | Location |
|-------|-------|----------|----------|
| System | All users | Lowest | /etc/gitconfig |
| Global | Current user | Medium | ~/.gitconfig |
| Local | Current repo | Highest | .git/config |
| Worktree | Specific worktree | Highest | .git/worktrees/.../config |

### Essential Git Commands

```bash
# Check status
git status

# View configuration
git config --list

# Check branch
git branch

# View history
git log --oneline --graph --all

# Stage files
git add .

# Commit changes
git commit -m "feat: message"

# Push changes
git push origin main
```

### Git Best Practices

#### Commit Frequency
- Commit logical units of work
- Not too large, not too small
- Each commit should be functional
- Enables easy rollback

#### Commit Messages
- Use conventional commit format
- Clear and descriptive
- Explain why, not what
- Reference issue numbers

#### Branch Strategy
- Feature branches for new work
- Keep main/master stable
- Regular merges from main
- Delete merged branches

### Expected Outcome
- Git initialized for monorepo
- Frontend files tracked in Git
- Developer identity configured
- Ready for Git operations

### Verification Checklist
- [ ] `.git/` directory exists at root
- [ ] `git status` shows frontend files
- [ ] Git user.name configured
- [ ] Git user.email configured
- [ ] Current branch identified
- [ ] Can run basic Git commands

---

## Task 10: Create Frontend .gitignore

### Overview
Create a frontend-specific .gitignore file to exclude build artifacts, dependencies, cache files, environment variables, IDE configurations, and other files that should not be committed to version control. This keeps the repository clean and prevents sensitive information from being exposed.

### Dependencies
- Task 09: Initialize Git for Frontend

### Instructions

1. **Navigate to frontend directory**
   - Change to `frontend/` directory
   - Create .gitignore at this level

2. **Check existing .gitignore**
   - create-next-app creates basic .gitignore
   - Review what's already included
   - Will enhance with additional patterns

3. **Ignore Next.js build artifacts**
   - Add `.next/` directory (production builds)
   - Add `out/` directory (static exports)
   - Add `.swc/` directory (SWC compiler cache)

4. **Ignore dependencies**
   - Add `node_modules/` directory
   - Already in default .gitignore
   - Critical to exclude

5. **Ignore environment files**
   - Add `.env` and `.env.local`
   - Add `.env*.local` pattern
   - Keep `.env.example` tracked

6. **Ignore IDE and editor files**
   - Add `.vscode/` settings (or track selectively)
   - Add `.idea/` for JetBrains IDEs
   - Add `*.swp`, `*.swo` for Vim

7. **Ignore operating system files**
   - Add `.DS_Store` for macOS
   - Add `Thumbs.db` for Windows
   - Add `desktop.ini` for Windows

8. **Ignore test coverage**
   - Add `coverage/` directory
   - Add `.nyc_output/` directory
   - Add `*.lcov` files

9. **Ignore logs and debugging**
   - Add `*.log` files
   - Add `npm-debug.log*`
   - Add `yarn-debug.log*`, `yarn-error.log*`

10. **Add comments for organization**
    - Group related patterns
    - Add explanatory comments
    - Make file maintainable

### .gitignore Pattern Categories

| Category | Patterns | Reason |
|----------|----------|--------|
| Dependencies | node_modules/, .pnp.* | Large, reproducible |
| Build Artifacts | .next/, out/, *.tsbuildinfo | Generated files |
| Environment | .env*.local | Sensitive data |
| IDE | .vscode/, .idea/, *.swp | Personal preferences |
| OS Files | .DS_Store, Thumbs.db | System-specific |
| Logs | *.log, logs/ | Temporary data |
| Coverage | coverage/, .nyc_output/ | Test artifacts |

### Next.js Specific Patterns

```
# Next.js
.next/
out/
build/
dist/

# SWC compiler cache
.swc/

# TypeScript incremental compilation
*.tsbuildinfo
next-env.d.ts

# Vercel deployment
.vercel
```

### Environment Files Strategy

#### Always Ignore
- `.env.local` - Local overrides with secrets
- `.env.development.local` - Local dev secrets
- `.env.production.local` - Never commit

#### Consider Tracking
- `.env.example` - Template without values
- `.env.development` - Shared dev config (no secrets)
- `.env.production` - Shared prod config (no secrets)

### IDE Configuration

#### VS Code (.vscode/)
```
# Option 1: Ignore all (personal preference)
.vscode/

# Option 2: Track shared, ignore personal
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.vscode/settings.local.json
```

#### JetBrains (.idea/)
```
# Ignore all IDE files
.idea/

# Or track project config
.idea/*
!.idea/codeStyles/
!.idea/inspectionProfiles/
```

### Pattern Matching Rules

| Pattern | Matches | Example |
|---------|---------|---------|
| `file.txt` | Exact name | file.txt anywhere |
| `*.log` | Extension | debug.log, error.log |
| `logs/` | Directory | logs/ and contents |
| `/build` | Root only | /build not src/build |
| `**/temp` | Any level | temp, src/temp |
| `!important.log` | Negation | Don't ignore this |

### Common Mistakes to Avoid

#### Already Tracked Files
- .gitignore doesn't affect tracked files
- Must `git rm --cached` first
- Then add to .gitignore

#### Overly Broad Patterns
- `*` ignores everything
- Be specific with wildcards
- Test patterns before committing

#### Missing Critical Files
- Don't ignore package.json
- Don't ignore lock files
- Don't ignore source code

### Expected Outcome
- Comprehensive .gitignore created
- Build artifacts ignored
- Sensitive files protected
- Repository stays clean

### Verification Checklist
- [ ] .gitignore file created in frontend/
- [ ] node_modules/ ignored
- [ ] .next/ and out/ ignored
- [ ] .env.local and .env*.local ignored
- [ ] IDE files ignored
- [ ] OS files ignored
- [ ] Log files ignored
- [ ] `git status` shows only relevant files
- [ ] No build artifacts in status

---

## Task 11: Create Frontend .gitattributes

### Overview
Create a .gitattributes file to configure Git's handling of line endings, file diffs, merge strategies, and language detection for the frontend project. This ensures consistent behavior across different operating systems and provides better Git integration for frontend file types.

### Dependencies
- Task 09: Initialize Git for Frontend

### Instructions

1. **Navigate to frontend directory**
   - Change to `frontend/` directory
   - Create .gitattributes file

2. **Create .gitattributes file**
   - Create new file named `.gitattributes`
   - Place at frontend/ root

3. **Configure line ending normalization**
   - Set default to `* text=auto`
   - Git normalizes to LF in repository
   - Converts to native on checkout

4. **Specify text files explicitly**
   - Mark .ts, .tsx, .js, .jsx as text
   - Mark .json, .md, .css, .scss as text
   - Ensures LF line endings

5. **Configure binary files**
   - Mark images as binary
   - Mark fonts as binary
   - Prevents diff/merge attempts

6. **Set merge strategies**
   - Configure package-lock merge strategy
   - Configure pnpm-lock merge strategy
   - Prevents merge conflicts in lock files

7. **Configure diff behavior**
   - Set custom diff for package.json
   - Improve readability of changes
   - Better code review experience

8. **Add language detection overrides**
   - Mark .mjs as JavaScript
   - Mark .cjs as JavaScript
   - Helps GitHub language statistics

### .gitattributes Sections

| Section | Purpose | Patterns |
|---------|---------|----------|
| Line Endings | Normalize CRLF/LF | * text=auto |
| Text Files | Force text mode | *.ts text |
| Binary Files | Prevent text handling | *.png binary |
| Merge Strategies | Conflict resolution | package-lock.json merge=union |
| Diff Behavior | Better diffs | *.json diff |
| Language Detection | GitHub stats | *.mjs linguist-language=JavaScript |

### Line Ending Strategies

#### text=auto (Recommended)
- Git detects text vs binary
- Normalizes text to LF in repo
- Converts to native on checkout
- Best for cross-platform teams

#### text eol=lf (Explicit)
- Always use LF line endings
- Overrides core.autocrlf
- Ensures consistency
- Good for shell scripts

#### text eol=crlf (Windows)
- Always use CRLF
- Rare in modern development
- Only for Windows-specific files

### File Type Configuration

```
# Source code
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.jsx text eol=lf
*.mjs text eol=lf
*.cjs text eol=lf

# Configs and data
*.json text eol=lf
*.yaml text eol=lf
*.yml text eol=lf
*.md text eol=lf
*.txt text eol=lf

# Styles
*.css text eol=lf
*.scss text eol=lf
*.sass text eol=lf

# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg text eol=lf

# Fonts
*.woff binary
*.woff2 binary
*.ttf binary
*.eot binary

# Archives
*.zip binary
*.tar binary
*.gz binary
```

### Lock File Merge Strategies

```
# npm/pnpm lock files
package-lock.json -diff
pnpm-lock.yaml -diff

# Consider using union merge
# (combines both sides)
package-lock.json merge=union
pnpm-lock.yaml merge=union
```

### Merge Strategy Options

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| union | Combines both sides | Lock files |
| ours | Keep our version | Config files |
| theirs | Take their version | Generated files |
| -diff | Don't show in diff | Large generated files |

### Language Detection

```
# JavaScript variants
*.mjs linguist-language=JavaScript
*.cjs linguist-language=JavaScript

# TypeScript
*.tsx linguist-language=TypeScript

# Don't count as docs
*.md linguist-documentation

# Don't count generated files
*.generated.* linguist-generated
```

### Linguist Attributes

| Attribute | Purpose | Example |
|-----------|---------|---------|
| linguist-language | Override language | linguist-language=TypeScript |
| linguist-vendored | Mark as vendored | true (exclude from stats) |
| linguist-documentation | Mark as docs | true (exclude from stats) |
| linguist-generated | Mark as generated | true (exclude from stats) |

### Cross-Platform Considerations

#### Windows (CRLF)
- Default line ending: `\r\n`
- Git can auto-convert
- .gitattributes ensures LF in repo

#### macOS/Linux (LF)
- Default line ending: `\n`
- Already matches repo format
- No conversion needed

#### Consistency Benefits
- Same file across all systems
- No spurious line ending changes
- Cleaner diffs and merges
- Better collaboration

### Expected Outcome
- .gitattributes configured for frontend
- Consistent line endings enforced
- Binary files handled correctly
- Better merge behavior for lock files

### Verification Checklist
- [ ] .gitattributes file created
- [ ] `* text=auto` set as default
- [ ] Source files marked as text
- [ ] Binary files marked as binary
- [ ] Lock file merge strategy set
- [ ] Language detection configured
- [ ] No CRLF warnings on commit
- [ ] Diffs show correctly

---

## Task 12: Set Up Husky Git Hooks

### Overview
Install and configure Husky to manage Git hooks for the frontend project. Set up pre-commit hooks to run linting and formatting checks, and pre-push hooks to run type checking, ensuring code quality standards are enforced before changes are committed or pushed to the repository.

### Dependencies
- Task 09: Initialize Git for Frontend
- Task 04: Configure npm Scripts

### Instructions

1. **Install Husky**
   - Navigate to frontend directory
   - Run `pnpm add -D husky`
   - Installs Husky as dev dependency

2. **Initialize Husky**
   - Run `pnpm exec husky init`
   - Creates `.husky/` directory
   - Sets up Git hooks integration

3. **Verify Husky installation**
   - Check `.husky/` directory exists
   - Verify `husky.sh` helper script
   - Check package.json prepare script added

4. **Create pre-commit hook**
   - Create file `.husky/pre-commit`
   - Make executable (`chmod +x`)
   - Will run before each commit

5. **Configure pre-commit to run lint-staged**
   - Add shebang line
   - Source husky.sh
   - Execute `npx lint-staged`

6. **Create pre-push hook**
   - Create file `.husky/pre-push`
   - Make executable
   - Will run before each push

7. **Configure pre-push to run type-check**
   - Add shebang line
   - Source husky.sh
   - Execute `pnpm type-check`

8. **Create commit-msg hook**
   - Create file `.husky/commit-msg`
   - Make executable
   - Will validate commit messages

9. **Configure commit-msg to run commitlint**
   - Add shebang line
   - Source husky.sh
   - Execute `npx --no -- commitlint --edit $1`

10. **Test hooks**
    - Make a test commit
    - Verify pre-commit runs
    - Test with failing lint
    - Verify hook prevents commit

### Husky Directory Structure

```
frontend/
├── .husky/
│   ├── _/                  # Husky internals
│   │   └── husky.sh       # Helper script
│   ├── commit-msg         # Validates commit messages
│   ├── pre-commit         # Runs before commit
│   └── pre-push           # Runs before push
└── package.json           # Contains "prepare" script
```

### Git Hooks Lifecycle

```
Developer Action     Git Hook         What Runs
────────────────    ──────────────   ─────────────────
                                      
git commit          pre-commit    →  lint-staged
                         ↓            - ESLint --fix
                         ↓            - Prettier
                         ↓
                    commit-msg    →  commitlint
                         ↓            - Validate format
                         ↓
                    [commit saved]
                         
git push            pre-push      →  type-check
                         ↓            - TypeScript tsc
                         ↓
                    [push to remote]
```

### Hook Scripts

#### Pre-commit Hook
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Purpose:**
- Runs lint-staged on staged files only
- Performs linting and formatting
- Fast feedback before commit
- Auto-fixes issues when possible

#### Pre-push Hook
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm type-check
```

**Purpose:**
- Validates TypeScript types
- Catches type errors before push
- Prevents broken code in remote
- More thorough than pre-commit

#### Commit-msg Hook
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**Purpose:**
- Validates commit message format
- Enforces conventional commits
- Ensures consistent history
- Enables automated changelog

### Hook Performance Optimization

#### Pre-commit (Fast)
- Only lint staged files
- Use lint-staged for efficiency
- Auto-fix issues
- Typically < 5 seconds

#### Pre-push (Thorough)
- Run full type check
- Run all tests (optional)
- Build verification (optional)
- May take 10-30 seconds

### Bypassing Hooks

#### When to Bypass
- Emergency hotfixes
- WIP commits on feature branch
- Rebasing/cherry-picking
- CI/CD commits

#### How to Bypass
```bash
# Skip pre-commit and commit-msg
git commit --no-verify

# Skip pre-push
git push --no-verify
```

**Warning:** Use sparingly, fix issues later

### Husky vs Other Solutions

| Solution | Pros | Cons |
|----------|------|------|
| Husky | Simple, popular, well-maintained | Requires npm install |
| Lefthook | Fast, parallel, cross-platform | Less ecosystem support |
| Pre-commit | Python-based, language-agnostic | Extra dependency |
| Manual .git/hooks | No dependencies | Not version controlled |

### Troubleshooting Hooks

#### Hook Not Running
- Check file is executable
- Verify husky.sh sourced
- Check Git hooks path: `git config core.hooksPath`

#### Hook Failing Incorrectly
- Check script syntax
- Verify commands in PATH
- Test commands manually
- Check error messages

#### Slow Hooks
- Optimize lint-staged patterns
- Use incremental type checking
- Consider selective testing
- Profile with time command

### Expected Outcome
- Husky installed and configured
- Git hooks active and functional
- Pre-commit runs lint-staged
- Pre-push runs type-check
- Commit-msg validates format

### Verification Checklist
- [ ] Husky installed as devDependency
- [ ] `.husky/` directory created
- [ ] pre-commit hook exists and executable
- [ ] pre-push hook exists and executable
- [ ] commit-msg hook exists and executable
- [ ] Prepare script in package.json
- [ ] Test commit triggers pre-commit
- [ ] Test push triggers pre-push
- [ ] Invalid commit message rejected

---

## Task 13: Configure lint-staged

### Overview
Install and configure lint-staged to run linters only on Git staged files during pre-commit hooks. This optimizes the linting process by checking only files that are about to be committed, significantly reducing hook execution time while maintaining code quality.

### Dependencies
- Task 12: Set Up Husky Git Hooks

### Instructions

1. **Install lint-staged**
   - Navigate to frontend directory
   - Run `pnpm add -D lint-staged`
   - Installs as dev dependency

2. **Create lint-staged configuration file**
   - Create `lint-staged.config.js` in frontend/
   - Alternative: use package.json "lint-staged" field
   - Separate file is cleaner

3. **Configure TypeScript file linting**
   - Match `*.{ts,tsx}` pattern
   - Run ESLint with --fix flag
   - Run Prettier with --write flag

4. **Configure JavaScript file linting**
   - Match `*.{js,jsx,mjs,cjs}` pattern
   - Run ESLint with --fix
   - Run Prettier with --write

5. **Configure JSON and Markdown formatting**
   - Match `*.{json,md,mdx}` pattern
   - Run Prettier with --write
   - Skip linting (no ESLint for these)

6. **Configure CSS/SCSS formatting**
   - Match `*.{css,scss,sass}` pattern
   - Run Prettier with --write
   - Consider Stylelint if used

7. **Add specific file handlers**
   - Configure package.json specifically
   - Configure configuration files
   - Handle special cases

8. **Test lint-staged**
   - Stage a file with issues
   - Run `npx lint-staged` manually
   - Verify fixes applied
   - Verify only staged files checked

9. **Integrate with Husky**
   - Already configured in pre-commit hook
   - Runs automatically on commit
   - Fast feedback loop

### lint-staged Configuration Structure

```javascript
module.exports = {
  // TypeScript and TSX files
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JavaScript files
  '*.{js,jsx,mjs,cjs}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON and Markdown
  '*.{json,md,mdx}': [
    'prettier --write',
  ],
  
  // Styles
  '*.{css,scss,sass}': [
    'prettier --write',
  ],
};
```

### Command Execution Order

| Pattern | Command 1 | Command 2 | Purpose |
|---------|-----------|-----------|---------|
| *.{ts,tsx} | eslint --fix | prettier --write | Lint then format |
| *.{js,jsx} | eslint --fix | prettier --write | Lint then format |
| *.{json,md} | prettier --write | - | Format only |
| *.{css,scss} | prettier --write | - | Format only |

### Glob Patterns Explained

```javascript
// All TypeScript files
'*.ts'              // foo.ts
'*.tsx'             // Component.tsx
'*.{ts,tsx}'        // Both

// Nested files
'**/*.ts'           // src/components/Button.ts
'src/**/*.ts'       // Only in src/

// Multiple extensions
'*.{js,jsx,ts,tsx}' // All script files

// Exclude patterns
'!**/node_modules/**' // Ignore node_modules
'!**/*.test.ts'       // Ignore test files
```

### Command Execution Flow

```
Stage files:
  file1.ts
  file2.tsx
  README.md
      ↓
  git commit
      ↓
  pre-commit hook
      ↓
  npx lint-staged
      ↓
  ┌─────────────────────────┐
  │ Match patterns          │
  │ file1.ts → *.{ts,tsx}  │
  │ file2.tsx → *.{ts,tsx} │
  │ README.md → *.md       │
  └─────────────────────────┘
      ↓
  ┌─────────────────────────┐
  │ Run commands            │
  │ eslint --fix *.{ts,tsx}│
  │ prettier --write *.*   │
  └─────────────────────────┘
      ↓
  ┌─────────────────────────┐
  │ Auto-stage fixes        │
  │ git add file1.ts       │
  │ git add file2.tsx      │
  │ git add README.md      │
  └─────────────────────────┘
      ↓
  [commit proceeds]
```

### Performance Benefits

#### Before lint-staged
```
git commit
→ ESLint on all files (1000+ files)
→ Takes 30-60 seconds
→ Slow feedback
→ Developers skip hooks
```

#### After lint-staged
```
git commit
→ ESLint on staged files only (3 files)
→ Takes 2-5 seconds
→ Fast feedback
→ Developers keep hooks enabled
```

### Auto-fixing Behavior

#### ESLint --fix
- Fixes auto-fixable issues
- Quotes, semicolons, spacing
- Import order
- Some code patterns

#### Prettier --write
- Formats all code
- Enforces style rules
- Line length, indentation
- Consistent formatting

#### Staged Files
- Fixes are auto-staged
- Commit includes fixes
- No manual git add needed
- Seamless workflow

### Configuration Options

```javascript
module.exports = {
  // Allow empty commits if all files fixed
  allowEmpty: false,
  
  // Run commands concurrently
  concurrent: true,
  
  // Don't stash unstaged changes
  stash: false,
  
  // Custom glob options
  globOptions: {
    dot: true, // Include dotfiles
  },
};
```

### Advanced Patterns

```javascript
module.exports = {
  // Run different commands for different patterns
  'src/**/*.ts': [
    'eslint --fix',
    'prettier --write',
    // Could add: 'jest --findRelatedTests'
  ],
  
  // Package.json specific
  'package.json': [
    'prettier --write',
    // Could add: 'npm run validate-pkg'
  ],
  
  // Function-based commands
  '*.ts': (filenames) => 
    `eslint ${filenames.join(' ')} --fix`,
};
```

### Troubleshooting

#### Lint-staged Not Running
- Check pre-commit hook configured
- Verify npx lint-staged in hook
- Check Husky installed

#### Files Not Being Linted
- Verify glob patterns match
- Check file is staged
- Test pattern with glob library

#### Commands Failing
- Test commands manually
- Check tools installed
- Verify tool configurations

### Expected Outcome
- lint-staged installed and configured
- Only staged files processed
- Fast pre-commit checks
- Auto-fixed issues staged
- Smooth developer workflow

### Verification Checklist
- [ ] lint-staged installed as devDependency
- [ ] Configuration file created
- [ ] Patterns cover all file types
- [ ] ESLint configured for scripts
- [ ] Prettier configured for formatting
- [ ] Manual test successful
- [ ] Integrates with pre-commit hook
- [ ] Only staged files processed
- [ ] Fixes auto-staged

---

## Task 14: Create commitlint Configuration

### Overview
Install and configure commitlint to enforce conventional commit message format. This ensures consistent, meaningful commit messages that enable automated changelog generation, semantic versioning, and better collaboration through clear change communication.

### Dependencies
- Task 12: Set Up Husky Git Hooks

### Instructions

1. **Install commitlint packages**
   - Install `@commitlint/cli`
   - Install `@commitlint/config-conventional`
   - Both as dev dependencies

2. **Create commitlint configuration**
   - Create `commitlint.config.js` in frontend/
   - Alternative: use package.json field
   - Separate file recommended

3. **Extend conventional config**
   - Extend `@commitlint/config-conventional`
   - Uses standard conventional commit rules
   - Provides default types and scopes

4. **Configure commit type rules**
   - Verify standard types allowed
   - feat, fix, docs, style, refactor, test, chore
   - Can add custom types if needed

5. **Configure scope rules**
   - Allow optional scope
   - Define project-specific scopes
   - Examples: ui, api, auth, db

6. **Configure subject rules**
   - Enforce lowercase subject
   - Limit subject length
   - Require descriptive subjects

7. **Configure body and footer rules**
   - Make body optional
   - Format footer references
   - Link to issues/tickets

8. **Test commitlint**
   - Create test commit with good message
   - Create test commit with bad message
   - Verify validation works
   - Check error messages helpful

9. **Integrate with Husky**
   - Already configured in commit-msg hook
   - Runs automatically on commit
   - Prevents invalid commits

### Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Example:**
```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh when tokens expire.
Includes retry logic and error handling.

Closes #123
```

### Commit Types

| Type | Purpose | When to Use | Version Impact |
|------|---------|-------------|----------------|
| feat | New feature | Adding functionality | Minor (0.x.0) |
| fix | Bug fix | Fixing issues | Patch (0.0.x) |
| docs | Documentation | README, comments | None |
| style | Formatting | Code style, whitespace | None |
| refactor | Code restructure | No behavior change | None |
| perf | Performance | Optimization | Patch |
| test | Tests | Add/update tests | None |
| build | Build system | Webpack, configs | None |
| ci | CI/CD | Pipeline changes | None |
| chore | Maintenance | Dependencies, tools | None |
| revert | Revert commit | Undo previous change | Depends |

### Breaking Changes

```
feat(api)!: change authentication endpoint

BREAKING CHANGE: The /auth endpoint now requires
a different request format. Update all API clients.

Migration guide: docs/migrations/auth-v2.md
```

**Indicators:**
- `!` after type/scope: `feat!:` or `feat(scope)!:`
- Footer: `BREAKING CHANGE: description`
- Triggers major version bump (x.0.0)

### Scope Examples

```javascript
// Project-specific scopes
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'ui',        // UI components
        'api',       // API integration
        'auth',      // Authentication
        'db',        // Database
        'config',    // Configuration
        'build',     // Build process
        'deps',      // Dependencies
      ],
    ],
  },
};
```

### Commit Message Anatomy

```
feat(auth): add password reset feature
│    │      │
│    │      └─ subject (imperative, lowercase)
│    └──────── scope (optional)
└───────────── type (required)

Implement password reset via email with secure tokens.
Tokens expire after 1 hour. Users can reset up to 3 times per day.
│
└─ body (optional, detailed description)

Closes #456
Refs #123, #789
│
└─ footer (optional, issue references)
```

### Validation Rules

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    
    // Type is required
    'type-empty': [2, 'never'],
    
    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    
    // Subject max length
    'subject-max-length': [2, 'always', 72],
    
    // Subject not empty
    'subject-empty': [2, 'never'],
    
    // Body max line length
    'body-max-line-length': [2, 'always', 100],
  },
};
```

### Rule Levels

| Level | Name | Behavior |
|-------|------|----------|
| 0 | disabled | Rule ignored |
| 1 | warning | Shows warning, commit proceeds |
| 2 | error | Blocks commit |

### Good vs Bad Examples

#### ✅ Good Commits
```
feat(ui): add loading spinner to dashboard
fix(api): correct user data serialization
docs: update installation instructions
style: format code with prettier
refactor(auth): simplify token validation
test(utils): add tests for date helpers
chore(deps): update next to 14.1.0
```

#### ❌ Bad Commits
```
Added stuff                    # No type
feat: Add Feature             # Not lowercase
fix(): fix bug                # Empty scope
feat(very-long-scope-name-here-that-is-too-long): add feature  # Too long
feat:add feature              # Missing space
FIX: bug fix                  # Uppercase type
feat add feature              # Missing colon
```

### Automated Changelog

Conventional commits enable tools like:
- **standard-version:** Auto-generate CHANGELOG.md
- **semantic-release:** Auto-version and publish
- **conventional-changelog:** Custom changelog generation

```markdown
# Changelog

## [1.2.0] - 2024-01-25

### Features
- (auth) add JWT token refresh
- (ui) add dark mode support

### Bug Fixes
- (api) correct data serialization
- (db) fix migration rollback

### Breaking Changes
- (api) change authentication endpoint format
```

### Expected Outcome
- commitlint installed and configured
- Conventional commit format enforced
- Invalid commits rejected
- Helpful error messages
- Team follows standards

### Verification Checklist
- [ ] @commitlint/cli installed
- [ ] @commitlint/config-conventional installed
- [ ] commitlint.config.js created
- [ ] Extends conventional config
- [ ] commit-msg hook configured
- [ ] Valid commit accepted
- [ ] Invalid commit rejected
- [ ] Error messages clear
- [ ] Team understands format

---

## Task 15: Create Frontend README.md

### Overview
Create a comprehensive README.md for the frontend project that documents project structure, setup instructions, development workflows, scripts, and contribution guidelines. This serves as the primary documentation entry point for developers joining or contributing to the frontend codebase.

### Dependencies
- Task 01: Create Next.js Project

### Instructions

1. **Create README.md file**
   - Create in `frontend/` directory
   - Replace default create-next-app README

2. **Add project header**
   - Project name and description
   - LankaCommerce Cloud ERP Dashboard
   - Brief overview of purpose

3. **Document technology stack**
   - List Next.js version
   - React version
   - TypeScript version
   - Key libraries and frameworks

4. **Add prerequisites section**
   - Node.js 20.x requirement
   - pnpm package manager
   - Git version control

5. **Write installation instructions**
   - Clone repository steps
   - Install dependencies
   - Environment setup

6. **Document npm scripts**
   - List all scripts with descriptions
   - dev, build, start, lint, etc.
   - When to use each script

7. **Add development workflow**
   - Starting dev server
   - Making changes
   - Running linting
   - Committing code

8. **Document project structure**
   - Explain app/ directory
   - List key directories
   - Purpose of each folder

9. **Add Git workflow**
   - Branching strategy
   - Commit message format
   - Pull request process

10. **Include troubleshooting section**
    - Common issues and solutions
    - Where to get help
    - Contact information

### README Sections

| Section | Purpose | Essential |
|---------|---------|-----------|
| Title & Description | Project overview | Yes |
| Tech Stack | Technologies used | Yes |
| Prerequisites | Requirements | Yes |
| Installation | Setup steps | Yes |
| Scripts | Available commands | Yes |
| Development | Workflow guide | Yes |
| Project Structure | Code organization | Yes |
| Git Workflow | Contribution process | Yes |
| Troubleshooting | Common issues | No |
| License | Legal information | Yes |

### README Template Structure

```markdown
# LankaCommerce Cloud - ERP Dashboard

[Brief description]

## 🚀 Tech Stack
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS
- pnpm

## 📋 Prerequisites
- Node.js 20.x LTS
- pnpm 8.x
- Git

## 🔧 Installation
[Step-by-step instructions]

## 📜 Available Scripts
[Script descriptions]

## 💻 Development Workflow
[How to develop]

## 📁 Project Structure
[Directory explanation]

## 🌿 Git Workflow
[Branching and commits]

## 🐛 Troubleshooting
[Common issues]

## 📄 License
[License information]
```

### Tech Stack Section

```markdown
## 🚀 Tech Stack

### Core Framework
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library with Server Components
- **TypeScript 5+** - Type safety and developer experience

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Component library (coming soon)

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **commitlint** - Commit message linting

### Backend Integration
- Django REST API
- JWT authentication
- Multi-tenant architecture
```

### Installation Instructions

```markdown
## 🔧 Installation

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourorg/lankacommerce-cloud.git
cd lankacommerce-cloud/frontend
\`\`\`

### 2. Use Correct Node Version
\`\`\`bash
# With nvm
nvm use

# Or ensure Node.js 20.x is active
node --version  # Should show v20.x.x
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pnpm install
\`\`\`

### 4. Set Up Environment
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

### 5. Start Development Server
\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.
```

### Scripts Documentation

```markdown
## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| \`pnpm dev\` | Start development server with Turbopack |
| \`pnpm build\` | Create production build |
| \`pnpm start\` | Start production server |
| \`pnpm lint\` | Run ESLint to check code quality |
| \`pnpm format\` | Format code with Prettier |
| \`pnpm type-check\` | Validate TypeScript types |
| \`pnpm clean\` | Remove build artifacts |

### Development Workflow
\`\`\`bash
# Start dev server
pnpm dev

# In another terminal, check types
pnpm type-check

# Format code
pnpm format

# Lint code
pnpm lint
\`\`\`
```

### Project Structure

```markdown
## 📁 Project Structure

\`\`\`
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── (routes)/          # Route groups
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   └── features/         # Feature components
├── lib/                  # Utility functions
│   ├── api/             # API clients
│   └── utils/           # Helper functions
├── types/               # TypeScript types
├── styles/              # Global styles
├── public/              # Static assets
└── .husky/             # Git hooks
\`\`\`

### Key Directories
- **app/** - Next.js pages and layouts (App Router)
- **components/** - React components
- **lib/** - Shared utilities and API clients
- **types/** - TypeScript type definitions
- **public/** - Static files (images, fonts)
```

### Git Workflow

```markdown
## 🌿 Git Workflow

### Branching Strategy
\`\`\`bash
main              # Production-ready code
├── develop       # Development integration
└── feature/xxx   # Feature branches
\`\`\`

### Commit Message Format
Follow [Conventional Commits](https://conventionalcommits.org):

\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer]
\`\`\`

**Types:**
- \`feat\` - New feature
- \`fix\` - Bug fix
- \`docs\` - Documentation
- \`style\` - Formatting
- \`refactor\` - Code restructure
- \`test\` - Tests
- \`chore\` - Maintenance

**Example:**
\`\`\`bash
feat(auth): add login page
fix(ui): correct button alignment
docs: update README installation steps
\`\`\`

### Pull Request Process
1. Create feature branch
2. Make changes with conventional commits
3. Push to remote
4. Open pull request
5. Pass CI checks
6. Code review
7. Merge to develop
```

### Troubleshooting Section

```markdown
## 🐛 Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
\`\`\`

### Node Version Mismatch
\`\`\`bash
# Use correct version
nvm install 20
nvm use 20
\`\`\`

### Module Not Found
\`\`\`bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
\`\`\`

### Type Errors
\`\`\`bash
# Check types
pnpm type-check

# Restart TypeScript server in IDE
\`\`\`

### Git Hooks Not Running
\`\`\`bash
# Reinstall Husky
pnpm exec husky install
\`\`\`
```

### Expected Outcome
- Comprehensive README created
- Clear setup instructions
- Well-documented workflows
- Easy onboarding for new developers

### Verification Checklist
- [ ] README.md created in frontend/
- [ ] Project description clear
- [ ] Tech stack documented
- [ ] Prerequisites listed
- [ ] Installation steps complete
- [ ] All scripts documented
- [ ] Project structure explained
- [ ] Git workflow documented
- [ ] Troubleshooting section added
- [ ] Formatted and readable

---

## Task 16: Verify Initial Setup

### Overview
Perform comprehensive verification of the complete Next.js project setup to ensure all components are properly installed, configured, and functioning correctly. Test development server, linting, formatting, type checking, Git hooks, and commit validation to confirm the foundation is solid before proceeding to actual development.

### Dependencies
- All previous tasks (01-15)

### Instructions

1. **Verify project structure**
   - Check all expected directories exist
   - Verify key configuration files present
   - Ensure no missing or extra files

2. **Test development server**
   - Run `pnpm dev`
   - Open http://localhost:3000
   - Verify page loads correctly
   - Check hot reload works
   - Stop server

3. **Test production build**
   - Run `pnpm build`
   - Verify build completes without errors
   - Check for TypeScript errors
   - Check for linting errors
   - Run `pnpm start`
   - Verify production server works
   - Stop server

4. **Test type checking**
   - Run `pnpm type-check`
   - Verify no type errors
   - Introduce intentional type error
   - Verify error caught
   - Fix error

5. **Test linting**
   - Run `pnpm lint`
   - Verify no linting errors
   - Introduce linting issue
   - Verify error caught
   - Run lint --fix
   - Verify auto-fixed

6. **Test formatting**
   - Run `pnpm format:check`
   - Verify formatting consistent
   - Mess up formatting
   - Run `pnpm format`
   - Verify files formatted

7. **Test Git hooks**
   - Create test branch
   - Modify a file with linting issue
   - Stage and commit
   - Verify pre-commit runs
   - Verify lint-staged fixes issue
   - Commit proceeds

8. **Test commitlint**
   - Try invalid commit message
   - Verify commit rejected
   - Try valid commit message
   - Verify commit accepted

9. **Test pre-push hook**
   - Introduce type error
   - Commit (bypassing hooks)
   - Try to push
   - Verify pre-push catches error
   - Fix error and push

10. **Document findings**
    - Note any issues encountered
    - Verify all features working
    - Create checklist of verified items
    - Confirm setup complete

### Verification Checklist

#### Project Structure
```
frontend/
├── .husky/
│   ├── _/
│   ├── commit-msg ✓
│   ├── pre-commit ✓
│   └── pre-push ✓
├── app/
│   ├── layout.tsx ✓
│   ├── page.tsx ✓
│   └── globals.css ✓
├── public/ ✓
├── .gitattributes ✓
├── .gitignore ✓
├── .npmrc ✓
├── .nvmrc ✓
├── commitlint.config.js ✓
├── lint-staged.config.js ✓
├── next.config.mjs ✓
├── package.json ✓
├── pnpm-lock.yaml ✓
├── postcss.config.js ✓
├── README.md ✓
├── tailwind.config.ts ✓
└── tsconfig.json ✓
```

### Test Scenarios

#### Scenario 1: Development Server
```bash
# Terminal 1
cd frontend
pnpm dev

# Expected:
# ✓ Ready in Xms
# ○ Local: http://localhost:3000

# Browser:
# Open http://localhost:3000
# See Next.js welcome page
# Edit app/page.tsx
# See hot reload in browser

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 2: Production Build
```bash
cd frontend
pnpm build

# Expected output:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Creating an optimized production build
# ✓ Route (app) size first load JS
#   ○ /  X kB  Y kB

pnpm start

# Open http://localhost:3000
# See production version

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 3: Type Checking
```bash
# Test 1: No errors
pnpm type-check
# Expected: No output (success)

# Test 2: With error
# Edit app/page.tsx
# Add line: const x: string = 123;

pnpm type-check
# Expected: Type error reported

# Fix error, run again
pnpm type-check
# Expected: No output (success)

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 4: Linting
```bash
# Test 1: No errors
pnpm lint
# Expected: ✓ No ESLint warnings or errors

# Test 2: With error
# Edit app/page.tsx
# Add unused variable: const unused = 'test';

pnpm lint
# Expected: Error reported

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 5: Git Hooks
```bash
# Test pre-commit
git checkout -b test-hooks

# Create file with issue
echo "const x=1" > test.ts
git add test.ts
git commit -m "test: add test file"

# Expected:
# ✔ Preparing lint-staged...
# ✔ Running tasks for staged files...
# ✔ Applying modifications from tasks...
# ✔ Cleaning up temporary files...

# Check file formatted
cat test.ts
# Expected: const x = 1;

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 6: Commitlint
```bash
# Test invalid message
git commit -m "Added feature" --allow-empty

# Expected:
# ✖ subject may not be empty [subject-empty]
# ✖ type may not be empty [type-empty]

# Test valid message
git commit -m "feat: add feature" --allow-empty

# Expected: Commit successful

# Result: ✅ Pass / ❌ Fail
```

#### Scenario 7: Pre-push Hook
```bash
# Add type error
echo "const x: string = 123;" >> app/page.tsx
git add app/page.tsx
git commit -m "test: add error" --no-verify

# Try to push
git push origin test-hooks

# Expected:
# Running type-check...
# Error: Type 'number' is not assignable to type 'string'
# Push rejected

# Fix and try again
git reset HEAD~1
# Fix error
git commit -m "test: add feature"
git push origin test-hooks

# Expected: Push successful

# Result: ✅ Pass / ❌ Fail
```

### Performance Benchmarks

| Operation | Expected Time | Actual Time | Status |
|-----------|---------------|-------------|--------|
| pnpm install | < 30s | ___ | ___ |
| pnpm dev (cold start) | < 10s | ___ | ___ |
| pnpm dev (hot reload) | < 2s | ___ | ___ |
| pnpm build | < 60s | ___ | ___ |
| pnpm type-check | < 10s | ___ | ___ |
| pnpm lint | < 15s | ___ | ___ |
| pre-commit hook | < 5s | ___ | ___ |
| pre-push hook | < 15s | ___ | ___ |

### Common Issues and Solutions

#### Issue: Port 3000 in use
**Solution:**
```bash
lsof -ti:3000 | xargs kill -9
# Or use different port
pnpm dev -- -p 3001
```

#### Issue: Husky hooks not running
**Solution:**
```bash
rm -rf .husky
pnpm exec husky install
# Recreate hooks
```

#### Issue: Type errors not caught
**Solution:**
```bash
# Check tsconfig.json is correct
cat tsconfig.json

# Restart TypeScript server
# VS Code: Cmd+Shift+P > TypeScript: Restart TS Server
```

#### Issue: Lock file conflicts
**Solution:**
```bash
rm pnpm-lock.yaml
pnpm install
```

### Final Verification Checklist

- [ ] All configuration files present
- [ ] Development server starts successfully
- [ ] Hot reload works
- [ ] Production build succeeds
- [ ] Type checking catches errors
- [ ] Linting catches issues
- [ ] Formatting works
- [ ] Pre-commit hook runs
- [ ] lint-staged processes files
- [ ] commitlint validates messages
- [ ] Pre-push hook runs type-check
- [ ] README documentation complete
- [ ] No console errors
- [ ] Performance within benchmarks
- [ ] Team can replicate setup

### Expected Outcome
- All systems verified and functional
- Development environment ready
- Git hooks active and enforcing quality
- Team can start feature development
- Solid foundation established

### Next Steps
After verification:
1. Clean up test files and branches
2. Commit all configuration
3. Push to repository
4. Share setup with team
5. Begin feature development

---

## Summary

This document covered Git initialization, creation of frontend-specific Git configuration files, setup of Husky Git hooks with pre-commit, pre-push, and commit-msg validation, configuration of lint-staged for efficient file processing, commitlint for conventional commit enforcement, comprehensive README documentation, and complete setup verification.

### Key Achievements
- Git initialized with proper ignore rules
- .gitattributes ensures consistent file handling
- Husky manages Git hooks effectively
- Pre-commit runs lint-staged on staged files only
- Pre-push validates TypeScript types
- commitlint enforces conventional commits
- README provides comprehensive documentation
- Complete setup verified and functional

### Project Foundation Complete
The Next.js 14+ project is now fully initialized with:
- Modern framework and tooling
- Type-safe development environment
- Automated code quality enforcement
- Git workflow standards
- Comprehensive documentation
- Verified and ready for feature development

### Proceed to Next Group
Move to [Group-B_TypeScript-Configuration](../Group-B_TypeScript-Configuration/) to configure advanced TypeScript settings, path aliases, and type definitions.
