# Tasks 47-55: ESLint Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** D - ESLint & Prettier Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52, 53, 54, 55

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-56-62_Prettier-Integration.md](02_Tasks-56-62_Prettier-Integration.md)

---

## Document Overview

This document covers the comprehensive setup of ESLint for the Next.js frontend application, including installation of core dependencies, TypeScript support, React plugins, import ordering, and accessibility checking. These configurations establish code quality standards and catch potential issues during development.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Install ESLint Dependencies | Low | 5 min |
| 48 | Install ESLint TypeScript Plugins | Low | 5 min |
| 49 | Install Additional ESLint Plugins | Low | 5 min |
| 50 | Create .eslintrc.json Configuration | Medium | 15 min |
| 51 | Configure ESLint Rules - TypeScript | Low | 10 min |
| 52 | Configure ESLint Rules - React | Low | 10 min |
| 53 | Configure ESLint Rules - Import | Low | 10 min |
| 54 | Configure ESLint Rules - Accessibility | Low | 10 min |
| 55 | Create .eslintignore File | Low | 5 min |

---

## Task 47: Install ESLint Dependencies

### Overview
Install the core ESLint dependencies required for linting the Next.js application. This includes the ESLint base package and the Next.js-specific configuration that provides sensible defaults optimized for Next.js projects, including Core Web Vitals rules.

### Dependencies
- Task 06: Install pnpm and initialize package.json
- Node.js and pnpm installed
- package.json exists in frontend directory

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change directory to `frontend/`
   - Verify package.json exists

2. **Install eslint package**
   - Use pnpm to install eslint as dev dependency
   - This is the core linting engine
   - Provides command-line interface and API

3. **Install eslint-config-next package**
   - Use pnpm to install as dev dependency
   - Next.js official ESLint configuration
   - Includes Core Web Vitals rules
   - Optimized for Next.js best practices

4. **Verify installation**
   - Check package.json devDependencies section
   - Confirm both packages are listed
   - Check pnpm-lock.yaml updated

5. **Check ESLint version**
   - Ensure ESLint 8.x is installed
   - Compatible with Next.js 14+
   - Supports modern JavaScript/TypeScript features

### ESLint Core Components

```
┌─────────────────────────────────────────────────┐
│              ESLint Architecture                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────────┐    │
│  │    eslint    │◄─────│  Configuration   │    │
│  │  (core CLI)  │      │    (.eslintrc)   │    │
│  └──────────────┘      └──────────────────┘    │
│         │                                       │
│         ├─────► Parser (TypeScript)             │
│         ├─────► Plugins (React, Import, etc.)   │
│         └─────► Rules (Error/Warning/Off)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Package Details

| Package | Version | Purpose |
|---------|---------|---------|
| eslint | ^8.57.0 | Core linting engine and CLI |
| eslint-config-next | Latest | Next.js optimized configuration |

### What eslint-config-next Provides

| Feature | Description |
|---------|-------------|
| Core Web Vitals | Performance-focused rules |
| React Best Practices | React-specific linting |
| Next.js Patterns | Framework-specific checks |
| Import Validation | Module import checking |
| Accessibility Basics | Basic a11y rules |

### Core Web Vitals Rules Included

```
Performance & Best Practices
═══════════════════════════════

✓ No @next/next/no-html-link-for-pages
  └─ Ensures proper Link component usage

✓ No @next/next/no-img-element  
  └─ Enforces next/image for optimization

✓ No @next/next/google-font-display
  └─ Optimal Google Fonts loading

✓ No @next/next/next-script-for-ga
  └─ Proper Script component for analytics

✓ No @next/next/no-sync-scripts
  └─ Prevents blocking script loads
```

### Expected Outcome
- ESLint core package installed
- Next.js ESLint configuration available
- Foundation for linting rules
- Ready for additional plugins

### Verification Checklist
- [ ] eslint package in devDependencies
- [ ] eslint-config-next package in devDependencies
- [ ] package.json updated
- [ ] pnpm-lock.yaml updated
- [ ] ESLint version is 8.x
- [ ] No installation errors

---

## Task 48: Install ESLint TypeScript Plugins

### Overview
Install TypeScript-specific ESLint plugins that enable linting of TypeScript code. These packages provide the parser to understand TypeScript syntax and rules to enforce TypeScript best practices, type safety, and code quality.

### Dependencies
- Task 47: Install ESLint Dependencies
- TypeScript installed (Task 13)

### Instructions

1. **Navigate to frontend directory**
   - Ensure you're in `frontend/` directory
   - Terminal should show frontend path

2. **Install @typescript-eslint/parser**
   - Use pnpm to install as dev dependency
   - Parses TypeScript code for ESLint
   - Converts TypeScript AST to ESLint-compatible format
   - Required for TypeScript linting

3. **Install @typescript-eslint/eslint-plugin**
   - Use pnpm to install as dev dependency
   - Provides TypeScript-specific linting rules
   - Enforces type safety
   - Catches TypeScript anti-patterns

4. **Verify installation**
   - Check package.json devDependencies
   - Confirm both @typescript-eslint packages listed
   - Verify compatible versions (^6.x or ^7.x)

5. **Understand parser vs plugin distinction**
   - Parser: Reads and understands TypeScript
   - Plugin: Provides rules for TypeScript code
   - Both required for complete TypeScript linting

### TypeScript ESLint Architecture

```
┌────────────────────────────────────────────────────────┐
│         TypeScript ESLint Integration                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  TypeScript Code (.ts, .tsx)                           │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────────────┐                          │
│  │ @typescript-eslint/parser │                         │
│  │  • Reads TS syntax        │                         │
│  │  • Generates AST          │                         │
│  │  • Type information       │                         │
│  └───────────┬──────────────┘                          │
│              │                                         │
│              ▼                                         │
│  ┌─────────────────────────────────┐                   │
│  │ @typescript-eslint/eslint-plugin │                  │
│  │  • TS-specific rules             │                  │
│  │  • Type checking rules           │                  │
│  │  • Best practice enforcement     │                  │
│  └─────────────┬───────────────────┘                   │
│                │                                       │
│                ▼                                       │
│           ESLint Core                                  │
│                │                                       │
│                ▼                                       │
│         Lint Results & Fixes                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Package Details

| Package | Purpose | Key Features |
|---------|---------|--------------|
| @typescript-eslint/parser | Parse TypeScript | AST generation, type info, TSConfig integration |
| @typescript-eslint/eslint-plugin | TypeScript rules | Type-aware rules, TS best practices, 100+ rules |

### Key TypeScript Rules Categories

#### Type Safety Rules
- Enforce explicit types where needed
- Prevent use of `any` type
- Require return types for functions
- Validate generic constraints

#### Code Quality Rules
- No unused variables/imports
- Consistent naming conventions
- Proper async/await usage
- Array type consistency

#### Best Practice Rules
- Prefer modern TypeScript features
- Avoid unsafe operations
- Proper interface vs type usage
- Consistent type definitions

### TypeScript Linting vs TypeScript Compiler

```
TypeScript Compiler (tsc)         ESLint with TypeScript
═════════════════════════        ══════════════════════

✓ Type checking                  ✓ Style enforcement
✓ Syntax validation              ✓ Best practices
✓ Generate .d.ts files           ✓ Code patterns
✓ Emit JavaScript                ✓ Unused code detection
✓ Strict mode checks             ✓ Naming conventions
                                 ✓ Import ordering
                                 ✓ Complexity checks

        Both work together for complete code quality!
```

### Expected Outcome
- TypeScript parser installed
- TypeScript ESLint plugin available
- Ability to lint .ts and .tsx files
- Foundation for TypeScript-specific rules

### Verification Checklist
- [ ] @typescript-eslint/parser in devDependencies
- [ ] @typescript-eslint/eslint-plugin in devDependencies
- [ ] Compatible versions installed
- [ ] pnpm-lock.yaml updated
- [ ] No version conflicts
- [ ] Packages compatible with TypeScript version

---

## Task 49: Install Additional ESLint Plugins

### Overview
Install additional ESLint plugins that provide specialized linting capabilities: React Hooks validation, import statement management, and accessibility (jsx-a11y) checking. These plugins extend ESLint's functionality to cover React patterns, module imports, and web accessibility standards.

### Dependencies
- Task 47: Install ESLint Dependencies
- React and React DOM installed (Task 07)

### Instructions

1. **Navigate to frontend directory**
   - Ensure working in `frontend/` directory
   - Terminal in correct location

2. **Install eslint-plugin-react-hooks**
   - Use pnpm to install as dev dependency
   - Enforces React Hooks rules
   - Validates hooks usage patterns
   - Checks dependency arrays

3. **Install eslint-plugin-import**
   - Use pnpm to install as dev dependency
   - Validates import/export statements
   - Enforces import ordering
   - Detects unused imports
   - Prevents import cycles

4. **Install eslint-plugin-jsx-a11y**
   - Use pnpm to install as dev dependency
   - Accessibility linting for JSX
   - WCAG compliance checking
   - Semantic HTML enforcement
   - ARIA attributes validation

5. **Verify all three plugins installed**
   - Check package.json devDependencies
   - Confirm all three plugins listed
   - Verify compatible versions

### Additional Plugins Architecture

```
┌─────────────────────────────────────────────────────────┐
│           Additional ESLint Plugins                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────┐                       │
│  │  eslint-plugin-react-hooks   │                       │
│  ├──────────────────────────────┤                       │
│  │  • Rules of Hooks validation │                       │
│  │  • Dependency array checking │                       │
│  │  • Hook naming conventions   │                       │
│  └──────────────────────────────┘                       │
│                                                         │
│  ┌──────────────────────────────┐                       │
│  │   eslint-plugin-import       │                       │
│  ├──────────────────────────────┤                       │
│  │  • Import statement validation│                      │
│  │  • Import order enforcement  │                       │
│  │  • Circular dependency detect│                       │
│  │  • Unused import detection   │                       │
│  └──────────────────────────────┘                       │
│                                                         │
│  ┌──────────────────────────────┐                       │
│  │   eslint-plugin-jsx-a11y     │                       │
│  ├──────────────────────────────┤                       │
│  │  • Accessibility checking    │                       │
│  │  • ARIA validation           │                       │
│  │  • Semantic HTML rules       │                       │
│  │  • Keyboard navigation       │                       │
│  └──────────────────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Package Details

| Package | Version | Purpose | Rules Count |
|---------|---------|---------|-------------|
| eslint-plugin-react-hooks | Latest | React Hooks patterns | 2 critical rules |
| eslint-plugin-import | Latest | Import management | 40+ rules |
| eslint-plugin-jsx-a11y | Latest | Accessibility | 30+ rules |

### React Hooks Plugin - Rules of Hooks

#### Rule 1: Only Call Hooks at Top Level
```
Valid Hook Usage:
─────────────────

✓ Called at component top level
✓ Not inside conditions
✓ Not inside loops
✓ Not inside nested functions

Invalid Hook Usage:
───────────────────

✗ Inside if statements
✗ Inside for/while loops
✗ Inside callbacks
✗ After early returns
```

#### Rule 2: Exhaustive Dependencies
```
Hook Dependency Validation:
───────────────────────────

useEffect(() => {
  // Uses: count, name
}, [count, name]) ✓ All dependencies listed

useEffect(() => {
  // Uses: count, name
}, [count]) ✗ Missing: name

useCallback(() => {
  // Uses: data
}, []) ✗ Missing: data
```

### Import Plugin - Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| Order Enforcement | Consistent import organization | Readability, diffs |
| No Duplicates | Prevent duplicate imports | Clean code |
| Cycle Detection | Find circular dependencies | Prevent runtime issues |
| Unused Detection | Find unused imports | Smaller bundles |
| Path Validation | Verify file existence | Catch errors early |

### Import Ordering Pattern

```
Recommended Import Order:
═════════════════════════

1. Node.js built-ins
   import fs from 'fs'
   import path from 'path'

2. External packages
   import React from 'react'
   import { Button } from 'antd'

3. Internal modules (absolute)
   import { api } from '@/lib/api'
   import { useAuth } from '@/hooks/useAuth'

4. Relative imports (parent)
   import { Header } from '../components/Header'

5. Relative imports (sibling)
   import { utils } from './utils'

6. Style imports (last)
   import './styles.css'
```

### JSX A11y Plugin - Accessibility Rules

#### Visual Accessibility
- Image alt text requirements
- Color contrast validation
- Text size and readability
- Focus indicators

#### Keyboard Accessibility
- Keyboard navigation support
- Focus management
- Tab order validation
- Keyboard event handlers

#### Semantic HTML
- Proper heading hierarchy
- Landmark regions
- List structures
- Button vs div distinction

#### ARIA Attributes
- Valid ARIA roles
- Required ARIA attributes
- ARIA state management
- ARIA label validation

### Accessibility Rule Examples

| Rule | Purpose | Impact |
|------|---------|--------|
| alt-text | Require alt on images | Screen reader support |
| anchor-is-valid | Validate link hrefs | Keyboard navigation |
| click-events-have-key-events | Keyboard equivalent for clicks | Keyboard users |
| heading-has-content | Non-empty headings | Document structure |
| label-has-associated-control | Form labels linked | Form accessibility |
| no-autofocus | Prevent auto-focus | User control |
| role-supports-aria-props | Valid ARIA usage | Screen readers |

### WCAG Compliance Levels

```
Web Content Accessibility Guidelines (WCAG)
═══════════════════════════════════════════

Level A (Basic)
├─ Essential accessibility features
├─ Keyboard navigation
└─ Alt text for images

Level AA (Standard) ← Target for most apps
├─ Color contrast requirements
├─ Resize text support
└─ Multiple navigation methods

Level AAA (Enhanced)
├─ Highest accessibility
├─ Sign language interpretation
└─ Extended audio descriptions
```

### Expected Outcome
- React Hooks plugin installed
- Import management plugin installed
- Accessibility plugin installed
- Foundation for specialized linting

### Verification Checklist
- [ ] eslint-plugin-react-hooks in devDependencies
- [ ] eslint-plugin-import in devDependencies
- [ ] eslint-plugin-jsx-a11y in devDependencies
- [ ] All three packages installed successfully
- [ ] pnpm-lock.yaml updated
- [ ] No installation errors
- [ ] Compatible versions with ESLint 8.x

---

## Task 50: Create .eslintrc.json Configuration

### Overview
Create the main ESLint configuration file that defines the linting setup for the project. This file specifies the parser, plugins, extends configurations, environment, and serves as the foundation for all linting rules.

### Dependencies
- Task 47: Install ESLint Dependencies
- Task 48: Install ESLint TypeScript Plugins
- Task 49: Install Additional ESLint Plugins

### Instructions

1. **Create .eslintrc.json file**
   - Navigate to `frontend/` directory root
   - Create new file named `.eslintrc.json`
   - This is a hidden file (starts with dot)

2. **Add JSON structure**
   - Create valid JSON object
   - Use proper formatting with indentation
   - No trailing commas (JSON requirement)

3. **Configure parser property**
   - Set parser to "@typescript-eslint/parser"
   - Enables TypeScript syntax understanding
   - Required for .ts and .tsx files

4. **Configure parserOptions**
   - Set ecmaVersion to "latest" or 2022
   - Set sourceType to "module" (ES modules)
   - Set ecmaFeatures.jsx to true (JSX support)
   - Reference tsconfig.json for type information

5. **Configure plugins array**
   - Add "@typescript-eslint"
   - Add "react-hooks"
   - Add "import"
   - Add "jsx-a11y"
   - Order doesn't matter but consistency helps

6. **Configure extends array**
   - Add "next/core-web-vitals" (Next.js config)
   - Add "plugin:@typescript-eslint/recommended"
   - Add "plugin:react-hooks/recommended"
   - Add "plugin:import/recommended"
   - Add "plugin:jsx-a11y/recommended"
   - Order matters: later configs override earlier

7. **Configure env property**
   - Set browser to true (DOM APIs)
   - Set es2022 to true (modern JavaScript)
   - Set node to true (Node.js globals for Next.js)

8. **Add settings property**
   - Configure import resolver for TypeScript
   - Set "import/resolver" for module resolution
   - Reference tsconfig paths if using aliases

9. **Save configuration file**
   - Ensure valid JSON syntax
   - No comments in JSON
   - Proper closing braces

### ESLint Configuration Structure

```
┌─────────────────────────────────────────────────────┐
│              .eslintrc.json Structure               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  parser                                             │
│  └─ Defines how to parse code (TypeScript)          │
│                                                     │
│  parserOptions                                      │
│  └─ Parser configuration (ECMAScript version, JSX)  │
│                                                     │
│  plugins                                            │
│  └─ Additional rule sets to load                    │
│                                                     │
│  extends                                            │
│  └─ Pre-configured rule sets to inherit             │
│                                                     │
│  env                                                │
│  └─ Available global variables (browser, node)      │
│                                                     │
│  settings                                           │
│  └─ Shared settings for plugins                     │
│                                                     │
│  rules                                              │
│  └─ Custom rule configurations (next tasks)         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Configuration Hierarchy

```
Configuration Cascade:
══════════════════════

1. extends: "next/core-web-vitals"
   └─ Base Next.js rules

2. extends: "plugin:@typescript-eslint/recommended"
   └─ Overrides/adds TypeScript rules

3. extends: "plugin:react-hooks/recommended"
   └─ Adds React Hooks rules

4. extends: "plugin:import/recommended"
   └─ Adds import rules

5. extends: "plugin:jsx-a11y/recommended"
   └─ Adds accessibility rules

6. rules: { ... } (custom)
   └─ Final overrides (configured in next tasks)

        ↓
    Final Configuration
```

### Key Configuration Properties

| Property | Type | Purpose |
|----------|------|---------|
| parser | string | TypeScript parser |
| parserOptions | object | Parser settings |
| plugins | array | Plugin list |
| extends | array | Base configurations |
| env | object | Environment globals |
| settings | object | Shared plugin settings |
| rules | object | Rule configurations |

### Parser Options Explained

```
Parser Options:
═══════════════

ecmaVersion: "latest"
└─ Use latest JavaScript features
   Supports: async/await, optional chaining, nullish coalescing

sourceType: "module"
└─ Use ES6 import/export
   Enables: import/export syntax, not CommonJS

ecmaFeatures.jsx: true
└─ Enable JSX parsing
   Required for: React components, TSX files

project: "./tsconfig.json"
└─ TypeScript configuration reference
   Enables: Type-aware linting rules
```

### Extends Order Importance

```
Why Order Matters:
══════════════════

❌ Wrong Order:
extends: [
  "plugin:jsx-a11y/recommended",  // Applied first
  "next/core-web-vitals"          // Overrides a11y rules
]
Result: Some a11y rules disabled by Next.js config

✓ Correct Order:
extends: [
  "next/core-web-vitals",          // Base rules
  "plugin:jsx-a11y/recommended"    // Adds/overrides
]
Result: Next.js rules + full a11y checking
```

### Environment Configuration

| Environment | Purpose | Provides |
|-------------|---------|----------|
| browser | Browser APIs | window, document, localStorage, etc. |
| es2022 | Modern JavaScript | Promise, Map, Set, Symbol, etc. |
| node | Node.js globals | process, __dirname, Buffer, etc. |

### Settings for Import Resolution

```
Import Resolution Settings:
═══════════════════════════

"settings": {
  "import/resolver": {
    "typescript": true,
    "node": true
  }
}

Purpose:
├─ Resolve TypeScript path aliases (@/lib/*)
├─ Understand tsconfig paths
├─ Validate import paths
└─ Prevent false import errors
```

### Configuration File Location

```
Project Structure:
══════════════════

frontend/
├── .eslintrc.json          ← Root configuration
├── app/
│   └── ... (no .eslintrc needed)
├── components/
│   └── ... (inherits root config)
└── lib/
    └── ... (inherits root config)

Note: Single root config covers entire frontend
```

### Expected Outcome
- Valid .eslintrc.json configuration file
- Parser configured for TypeScript
- All plugins referenced
- Base rule sets extended
- Environment properly set
- Foundation for custom rules

### Verification Checklist
- [ ] .eslintrc.json file created in frontend/
- [ ] Valid JSON syntax (no errors)
- [ ] parser set to @typescript-eslint/parser
- [ ] parserOptions configured
- [ ] All four plugins in plugins array
- [ ] Five configurations in extends array
- [ ] env contains browser, es2022, node
- [ ] settings configured for import resolution
- [ ] File formatted with proper indentation

---

## Task 51: Configure ESLint Rules - TypeScript

### Overview
Add TypeScript-specific linting rules to the .eslintrc.json configuration. These rules enforce TypeScript best practices, type safety, and code quality standards. Configure rules for unused variables, explicit types, and TypeScript-specific patterns.

### Dependencies
- Task 50: Create .eslintrc.json Configuration

### Instructions

1. **Open .eslintrc.json file**
   - Navigate to `frontend/.eslintrc.json`
   - Locate or create "rules" property
   - Add as object after settings property

2. **Add rules object if not exists**
   - Create empty "rules" object
   - Will contain all custom rule configurations

3. **Configure @typescript-eslint/no-unused-vars**
   - Set to "error" level
   - Prevents unused variables and imports
   - Keeps code clean and reduces bundle size
   - Consider adding options for underscore prefix

4. **Configure @typescript-eslint/no-explicit-any**
   - Set to "warn" level
   - Discourages use of "any" type
   - Promotes type safety
   - Warning (not error) allows temporary usage

5. **Configure @typescript-eslint/explicit-function-return-type**
   - Set to "off" level
   - TypeScript can infer return types
   - Reduces verbosity
   - Enable if team prefers explicit types

6. **Configure @typescript-eslint/no-inferrable-types**
   - Set to "warn" level
   - Removes unnecessary type annotations
   - Example: let x: number = 5 (number is inferrable)
   - Cleaner, more concise code

7. **Configure @typescript-eslint/consistent-type-definitions**
   - Set to ["error", "interface"]
   - Enforces interface over type for object shapes
   - Consistency across codebase
   - Better error messages and extensibility

8. **Configure @typescript-eslint/no-non-null-assertion**
   - Set to "warn" level
   - Discourages use of non-null assertion (!)
   - Promotes safer null handling
   - Warning allows when truly needed

9. **Save configuration file**
   - Verify JSON syntax validity
   - Ensure proper formatting

### TypeScript Rule Categories

```
┌─────────────────────────────────────────────────────┐
│         TypeScript ESLint Rule Categories           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Type Safety Rules                                  │
│  ├─ no-explicit-any                                 │
│  ├─ no-unsafe-assignment                            │
│  └─ strict-boolean-expressions                      │
│                                                     │
│  Code Quality Rules                                 │
│  ├─ no-unused-vars                                  │
│  ├─ no-inferrable-types                             │
│  └─ prefer-const                                    │
│                                                     │
│  Consistency Rules                                  │
│  ├─ consistent-type-definitions                     │
│  ├─ naming-convention                               │
│  └─ member-ordering                                 │
│                                                     │
│  Best Practice Rules                                │
│  ├─ no-non-null-assertion                           │
│  ├─ prefer-nullish-coalescing                       │
│  └─ prefer-optional-chain                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Rule Severity Levels

| Level | Keyword | Behavior | Use When |
|-------|---------|----------|----------|
| 0 | "off" | Disabled | Rule not needed |
| 1 | "warn" | Warning only | Guideline, not enforced |
| 2 | "error" | Fails lint | Must be fixed |

### TypeScript Rules Explained

#### no-unused-vars Rule
```
Purpose: Remove dead code
══════════════════════════

✗ Error:
import { useState } from 'react' // unused import
let x = 5 // unused variable
function helper() {} // unused function

✓ Correct:
import { useState } from 'react'
const [state, setState] = useState(0) // used
return <div>{state}</div>

Options:
└─ argsIgnorePattern: "^_" (allow _unused)
└─ varsIgnorePattern: "^_" (allow _temp)
```

#### no-explicit-any Rule
```
Purpose: Promote type safety
═════════════════════════════

✗ Warning:
function process(data: any) { } // loses type info
let value: any = getValue()     // no type checking

✓ Correct:
function process(data: unknown) { } // safer
function process<T>(data: T) { }    // generic
interface Data { /* ... */ }
function process(data: Data) { }    // specific type

When to use 'any':
├─ Third-party libraries without types
├─ Temporary during migration
└─ Truly dynamic data (use with caution)
```

#### explicit-function-return-type Rule
```
Purpose: Document return types
═══════════════════════════════

With rule OFF (recommended):
function add(a: number, b: number) {
  return a + b // return type inferred: number
}

With rule ON (explicit):
function add(a: number, b: number): number {
  return a + b // return type must be stated
}

Tradeoffs:
OFF: Less verbose, cleaner code
ON:  Better documentation, catches return errors early
```

#### no-inferrable-types Rule
```
Purpose: Reduce redundancy
══════════════════════════

✗ Warning (redundant):
let count: number = 0
const name: string = 'test'
const isActive: boolean = false

✓ Correct (inferred):
let count = 0              // inferred: number
const name = 'test'        // inferred: string
const isActive = false     // inferred: boolean

Keep explicit types when:
├─ Complex types: const data: ComplexType = {}
├─ Function parameters: function(id: string)
└─ Class properties: private count: number
```

#### consistent-type-definitions Rule
```
Purpose: Standardize type declarations
═══════════════════════════════════════

With "interface" setting:

✓ Correct:
interface User {
  id: string
  name: string
}

✗ Error:
type User = {
  id: string
  name: string
}

interface vs type:
═══════════════════
interface:
├─ Can be extended
├─ Can be merged (declaration merging)
├─ Better error messages
└─ Recommended for object shapes

type:
├─ Can use unions and intersections
├─ Can use complex type operations
├─ Better for utility types
└─ Use for non-object types
```

#### no-non-null-assertion Rule
```
Purpose: Safer null handling
═════════════════════════════

✗ Warning (unsafe):
const user = getUser()
const name = user!.name // assumes user exists

✓ Correct (safe):
const user = getUser()
if (user) {
  const name = user.name // null check
}

// Or with optional chaining:
const name = user?.name

// Or with nullish coalescing:
const name = user?.name ?? 'Unknown'

When ! is acceptable:
├─ After explicit checks
├─ DOM element queries (with caution)
└─ Type assertion edge cases
```

### Recommended TypeScript Rules Configuration

| Rule | Setting | Rationale |
|------|---------|-----------|
| no-unused-vars | error | Clean code, smaller bundles |
| no-explicit-any | warn | Type safety, allow exceptions |
| explicit-function-return-type | off | Inferred types sufficient |
| no-inferrable-types | warn | Reduce redundancy |
| consistent-type-definitions | error | Codebase consistency |
| no-non-null-assertion | warn | Safer null handling |

### TypeScript Strict Mode Alignment

```
tsconfig.json Strict Settings       ESLint Rules
═════════════════════════════       ════════════

strict: true                    ←→  TypeScript compiler
├─ noImplicitAny               ←→  no-explicit-any
├─ strictNullChecks            ←→  no-non-null-assertion
├─ strictFunctionTypes         ←→  Related TS rules
└─ strictBindCallApply         ←→  Built-in checking

Both work together:
├─ TSC: Compile-time type checking
└─ ESLint: Style and pattern enforcement
```

### Expected Outcome
- TypeScript rules configured in .eslintrc.json
- Type safety enforced
- Consistent TypeScript patterns
- Clean, maintainable code

### Verification Checklist
- [ ] rules property exists in .eslintrc.json
- [ ] no-unused-vars rule configured
- [ ] no-explicit-any rule set to warn
- [ ] explicit-function-return-type rule set to off
- [ ] no-inferrable-types rule configured
- [ ] consistent-type-definitions rule configured
- [ ] no-non-null-assertion rule configured
- [ ] Valid JSON syntax maintained
- [ ] All rule names correctly spelled

---

## Task 52: Configure ESLint Rules - React

### Overview
Add React-specific linting rules to enforce React best practices, optimize React Hooks usage, and ensure proper component patterns. Configure rules for hooks dependencies, rules of hooks, and React 17+ JSX transform compatibility.

### Dependencies
- Task 50: Create .eslintrc.json Configuration
- Task 51: Configure ESLint Rules - TypeScript

### Instructions

1. **Open .eslintrc.json file**
   - Navigate to existing rules section
   - Add React-specific rules

2. **Configure react-hooks/rules-of-hooks**
   - Set to "error" level
   - Enforces rules of hooks
   - Critical for React functionality
   - Prevents runtime errors

3. **Configure react-hooks/exhaustive-deps**
   - Set to "warn" level
   - Validates useEffect dependencies
   - Validates useCallback dependencies
   - Validates useMemo dependencies
   - Prevents stale closure bugs

4. **Configure react/react-in-jsx-scope**
   - Set to "off" level
   - React 17+ doesn't require import
   - Next.js automatically imports React
   - No need for "import React from 'react'"

5. **Configure react/prop-types**
   - Set to "off" level
   - Using TypeScript for prop validation
   - PropTypes not needed with TS
   - Reduces redundancy

6. **Configure react/display-name**
   - Set to "off" level
   - TypeScript provides component names
   - Next.js preserves component names
   - Not critical for Next.js projects

7. **Configure react/no-unescaped-entities**
   - Set to "warn" level
   - Prevents issues with quotes, apostrophes
   - Reminds to use proper HTML entities
   - Warning allows quick fixes

8. **Save configuration**
   - Verify JSON syntax
   - Ensure proper formatting

### React Hooks Rules Architecture

```
┌─────────────────────────────────────────────────────┐
│           React Hooks Linting System                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Rule 1: rules-of-hooks (ERROR)                     │
│  ┌───────────────────────────────────────┐          │
│  │ • Only call hooks at top level        │          │
│  │ • Only call hooks in React functions  │          │
│  │ • No hooks in loops/conditions        │          │
│  │ • No hooks in regular functions       │          │
│  └───────────────────────────────────────┘          │
│                                                     │
│  Rule 2: exhaustive-deps (WARN)                     │
│  ┌───────────────────────────────────────┐          │
│  │ • Validate useEffect dependencies     │          │
│  │ • Validate useCallback dependencies   │          │
│  │ • Validate useMemo dependencies       │          │
│  │ • Suggest missing dependencies        │          │
│  │ • Warn about unnecessary dependencies │          │
│  └───────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Rules of Hooks - Detailed Breakdown

#### Valid Hook Calls
```
✓ Component function (top level):
function MyComponent() {
  const [state, setState] = useState(0)
  useEffect(() => { }, [])
  return <div>{state}</div>
}

✓ Custom hook (top level):
function useCustomHook() {
  const [value, setValue] = useState('')
  useEffect(() => { }, [value])
  return value
}
```

#### Invalid Hook Calls
```
✗ Inside condition:
function Component() {
  if (condition) {
    const [state] = useState(0) // ERROR!
  }
}

✗ Inside loop:
function Component() {
  for (let i = 0; i < 10; i++) {
    useEffect(() => { }) // ERROR!
  }
}

✗ Inside regular function:
function helper() {
  const [state] = useState(0) // ERROR!
}

✗ After early return:
function Component() {
  if (condition) return null
  const [state] = useState(0) // ERROR!
}
```

### Why Rules of Hooks Matter

```
React Hook Call Order:
══════════════════════

First Render:
1. useState('name')    → Hook #1
2. useState(0)         → Hook #2
3. useEffect(fn, [])   → Hook #3

Re-render (must be same order):
1. useState('name')    → Hook #1 ✓
2. useState(0)         → Hook #2 ✓
3. useEffect(fn, [])   → Hook #3 ✓

If hooks are conditional:
1. useState('name')    → Hook #1 ✓
2. [condition skipped] → Hook #2 ✗ MISMATCH!
3. useEffect(fn, [])   → Hook #3 ✗ WRONG HOOK!

Result: React crashes or corrupts state
```

### Exhaustive Dependencies Rule

#### Missing Dependencies
```
✗ Warning - Missing dependency:
const [count, setCount] = useState(0)
const [name, setName] = useState('')

useEffect(() => {
  console.log(count, name)
}, [count]) // Missing: name

ESLint suggests: [count, name]
```

#### Unnecessary Dependencies
```
✗ Warning - Unnecessary dependency:
const [count, setCount] = useState(0)

useEffect(() => {
  console.log(count)
}, [count, setCount]) // setCount is stable, unnecessary

ESLint suggests: [count]
```

#### Stable Function Dependencies
```
Functions from useState/useReducer are stable:
├─ setState from useState
├─ dispatch from useReducer
└─ Don't need in dependency array

Example:
const [state, setState] = useState(0)
useEffect(() => {
  setState(1) // setState is stable
}, []) // Correctly empty, no warning
```

#### Exhaustive Deps Exceptions

```
When to disable exhaustive-deps:
════════════════════════════════

1. Intentional single run:
useEffect(() => {
  // Run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

2. Complex dependencies:
useEffect(() => {
  // Depends on object.property, not whole object
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [object.property])

3. Ref-based effects:
const ref = useRef(value)
useEffect(() => {
  // Using ref.current directly
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

Best Practice: Minimize these exceptions
```

### React 17+ JSX Transform

```
Old Way (React 16 and earlier):
════════════════════════════════

import React from 'react' // Required!

function Component() {
  return <div>Hello</div>
}

// Transforms to:
React.createElement('div', null, 'Hello')


New Way (React 17+):
════════════════════

// No React import needed!

function Component() {
  return <div>Hello</div>
}

// Transforms to:
import { jsx as _jsx } from 'react/jsx-runtime'
_jsx('div', { children: 'Hello' })

Result:
├─ Smaller bundle size
├─ Cleaner imports
└─ react-in-jsx-scope rule must be OFF
```

### PropTypes vs TypeScript

```
PropTypes (JavaScript):
═══════════════════════

Component.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
}

TypeScript (Better):
════════════════════

interface Props {
  name: string
  age?: number
}

function Component({ name, age }: Props) { }

TypeScript Benefits:
├─ Compile-time checking
├─ Better IDE support
├─ No runtime overhead
├─ More expressive types
└─ No PropTypes library needed
```

### Unescaped Entities Rule

```
✗ Warning - Unescaped entity:
<div>Don't use apostrophes</div>
<div>Use "quotes" carefully</div>
<div>5 < 10 & 10 > 5</div>

✓ Correct - Use HTML entities:
<div>Don&apos;t use apostrophes</div>
<div>Use &quot;quotes&quot; carefully</div>
<div>5 &lt; 10 &amp; 10 &gt; 5</div>

Alternative - Use proper quotes:
<div>{"Don't"} use apostrophes</div>
<div>Use {"quotes"} carefully</div>
```

### Recommended React Rules Configuration

| Rule | Setting | Rationale |
|------|---------|-----------|
| react-hooks/rules-of-hooks | error | Critical for React |
| react-hooks/exhaustive-deps | warn | Prevent stale closures |
| react/react-in-jsx-scope | off | React 17+ compatible |
| react/prop-types | off | TypeScript used |
| react/display-name | off | TS provides names |
| react/no-unescaped-entities | warn | HTML entity reminder |

### Expected Outcome
- React hooks rules enforced
- React 17+ compatibility
- TypeScript-first approach
- Best practices automated

### Verification Checklist
- [ ] react-hooks/rules-of-hooks set to error
- [ ] react-hooks/exhaustive-deps set to warn
- [ ] react/react-in-jsx-scope set to off
- [ ] react/prop-types set to off
- [ ] react/display-name set to off
- [ ] react/no-unescaped-entities set to warn
- [ ] Valid JSON syntax maintained

---

## Task 53: Configure ESLint Rules - Import

### Overview
Add import-related linting rules to enforce consistent import ordering, prevent duplicate imports, ensure proper module resolution, and improve code organization. Configure rules for import order, duplicate detection, and newline formatting.

### Dependencies
- Task 50: Create .eslintrc.json Configuration
- Task 51: Configure ESLint Rules - TypeScript
- Task 52: Configure ESLint Rules - React

### Instructions

1. **Open .eslintrc.json file**
   - Navigate to existing rules section
   - Add import-specific rules

2. **Configure import/order**
   - Set to "warn" level with options
   - Define import group ordering
   - Set alphabetize option for sorting
   - Configure newlines between groups
   - Enforce consistent import organization

3. **Configure import/no-duplicates**
   - Set to "error" level
   - Prevents duplicate imports from same module
   - Automatically fixable
   - Cleaner imports

4. **Configure import/newline-after-import**
   - Set to "warn" level
   - Requires newline after import block
   - Improves readability
   - Separates imports from code

5. **Configure import/no-unresolved**
   - Set to "error" level
   - Validates import paths exist
   - Catches typos and missing files
   - Works with TypeScript resolver

6. **Configure import/no-cycle**
   - Set to "warn" level with max depth
   - Detects circular dependencies
   - Prevents architecture issues
   - Can be performance intensive

7. **Configure import/no-unused-modules**
   - Set to "off" initially
   - Can be enabled later for cleanup
   - Finds unused exports
   - May have false positives

8. **Save configuration**
   - Verify JSON syntax
   - Check options formatting

### Import Rule Categories

```
┌─────────────────────────────────────────────────────┐
│            Import Linting Categories                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Organization Rules                                 │
│  ├─ import/order (consistent ordering)              │
│  ├─ import/newline-after-import                     │
│  └─ import/first (imports at top)                   │
│                                                     │
│  Validation Rules                                   │
│  ├─ import/no-unresolved (path exists)              │
│  ├─ import/no-duplicates (no dupes)                 │
│  └─ import/named (export exists)                    │
│                                                     │
│  Architecture Rules                                 │
│  ├─ import/no-cycle (circular deps)                 │
│  ├─ import/no-self-import                           │
│  └─ import/no-relative-parent-imports               │
│                                                     │
│  Cleanup Rules                                      │
│  ├─ import/no-unused-modules                        │
│  └─ import/no-deprecated                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Import Order Configuration

```
Import Order Structure:
═══════════════════════

groups: [
  "builtin",    // Node.js built-ins: fs, path, etc.
  "external",   // node_modules: react, next, etc.
  "internal",   // @/lib/*, @/components/*, etc.
  "parent",     // ../
  "sibling",    // ./
  "index"       // ./index
]

alphabetize: {
  order: "asc",           // A to Z
  caseInsensitive: true   // Ignore case
}

newlines-between: "always" // Blank line between groups
```

### Import Ordering Example

```typescript
Before (unorganized):
═════════════════════

import { Header } from './Header'
import React from 'react'
import { Button } from '@/components/ui/Button'
import path from 'path'
import { api } from '@/lib/api'
import { Footer } from '../Footer'
import fs from 'fs'
import { NextPage } from 'next'


After (organized):
══════════════════

// Group 1: builtin
import fs from 'fs'
import path from 'path'

// Group 2: external
import { NextPage } from 'next'
import React from 'react'

// Group 3: internal
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'

// Group 4: parent
import { Footer } from '../Footer'

// Group 5: sibling
import { Header } from './Header'
```

### Import Groups Explained

#### Builtin Imports (Node.js)
```typescript
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import http from 'http'

Purpose: Node.js core modules
Why first: No dependencies, fundamental
```

#### External Imports (node_modules)
```typescript
import React from 'react'
import { NextPage } from 'next'
import { Button } from 'antd'
import axios from 'axios'

Purpose: Third-party packages
Why second: Project dependencies
```

#### Internal Imports (aliases)
```typescript
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import type { User } from '@/types/user'

Purpose: Project modules with path aliases
Why third: Project structure
```

#### Parent Imports (../)
```typescript
import { Layout } from '../../components/Layout'
import { utils } from '../utils'
import type { Props } from '../types'

Purpose: Parent directory imports
Why fourth: Local hierarchy
```

#### Sibling Imports (./)
```typescript
import { Header } from './Header'
import { Footer } from './Footer'
import styles from './styles.module.css'

Purpose: Same directory imports
Why fifth: Most local context
```

### No Duplicates Rule

```
✗ Error - Duplicate imports:
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Input } from '@/components/ui'

✓ Correct - Single import:
import { Button, Card, Input } from '@/components/ui'


✗ Error - Duplicate with different styles:
import React from 'react'
import { useState } from 'react'

✓ Correct - Combined:
import React, { useState } from 'react'
```

### Newline After Import Rule

```
✗ Warning - No newline:
import React from 'react'
import { NextPage } from 'next'
const MyPage: NextPage = () => {
  return <div>Hello</div>
}

✓ Correct - Newline present:
import React from 'react'
import { NextPage } from 'next'

const MyPage: NextPage = () => {
  return <div>Hello</div>
}
```

### Circular Dependency Detection

```
Circular Dependency Example:
════════════════════════════

// File: user.ts
import { Post } from './post'
export interface User {
  posts: Post[]
}

// File: post.ts
import { User } from './user'
export interface Post {
  author: User
}

// Cycle detected: user → post → user

✓ Solution - Extract types:
// File: types.ts
export interface User {
  posts: Post[]
}
export interface Post {
  author: User
}

// File: user.ts
import type { User } from './types'
export { type User }

// File: post.ts
import type { Post } from './types'
export { type Post }
```

### Why Circular Dependencies Are Bad

```
Problems with Circular Dependencies:
════════════════════════════════════

1. Module Loading Issues
   ├─ Unpredictable initialization order
   ├─ Potential undefined values
   └─ Runtime errors

2. Maintenance Challenges
   ├─ Hard to understand dependencies
   ├─ Difficult to refactor
   └─ Tight coupling

3. Build/Bundle Issues
   ├─ Tree-shaking problems
   ├─ Larger bundle sizes
   └─ Webpack warnings

Solutions:
├─ Extract shared types/interfaces
├─ Use dependency injection
├─ Restructure module hierarchy
└─ Break into smaller modules
```

### Path Resolution with TypeScript

```
TypeScript Path Aliases (tsconfig.json):
════════════════════════════════════════

{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}

ESLint Settings (for import resolution):
════════════════════════════════════════

"settings": {
  "import/resolver": {
    "typescript": true,
    "node": {
      "extensions": [".ts", ".tsx", ".js", ".jsx"]
    }
  }
}

Result: ESLint understands path aliases
```

### Import Validation Rules

| Rule | Purpose | Catches |
|------|---------|---------|
| no-unresolved | File exists | Typos, wrong paths |
| named | Export exists | Wrong export names |
| default | Default export exists | Missing defaults |
| namespace | Namespace exists | Wrong namespace imports |

### Performance Considerations

```
Import/No-Cycle Performance:
════════════════════════════

maxDepth option controls search depth:

maxDepth: 1 (fast)
└─ Check direct imports only

maxDepth: 3 (recommended)
└─ Check 3 levels deep
   A → B → C → A

maxDepth: ∞ (slow)
└─ Check entire dependency tree
   Can be very slow for large projects

Recommendation:
├─ Start with maxDepth: 3
├─ Monitor lint performance
└─ Adjust as needed
```

### Recommended Import Rules Configuration

| Rule | Setting | Options | Rationale |
|------|---------|---------|-----------|
| import/order | warn | groups, alphabetize | Consistent organization |
| import/no-duplicates | error | - | Clean imports |
| import/newline-after-import | warn | - | Readability |
| import/no-unresolved | error | - | Catch path errors |
| import/no-cycle | warn | maxDepth: 3 | Prevent circular deps |
| import/no-unused-modules | off | - | Enable for cleanup |

### Expected Outcome
- Consistent import ordering
- No duplicate imports
- Valid import paths
- Circular dependency detection
- Improved code organization

### Verification Checklist
- [ ] import/order rule configured with groups
- [ ] import/order alphabetize option set
- [ ] import/no-duplicates set to error
- [ ] import/newline-after-import set to warn
- [ ] import/no-unresolved set to error
- [ ] import/no-cycle configured with maxDepth
- [ ] Valid JSON syntax maintained
- [ ] Options properly formatted

---

## Task 54: Configure ESLint Rules - Accessibility

### Overview
Add accessibility (a11y) linting rules using the jsx-a11y plugin to ensure the application meets web accessibility standards. Configure rules for semantic HTML, ARIA attributes, keyboard navigation, and screen reader support, promoting inclusive web development.

### Dependencies
- Task 50: Create .eslintrc.json Configuration
- Task 51: Configure ESLint Rules - TypeScript
- Task 52: Configure ESLint Rules - React
- Task 53: Configure ESLint Rules - Import

### Instructions

1. **Open .eslintrc.json file**
   - Navigate to existing rules section
   - Add jsx-a11y specific rules

2. **Configure jsx-a11y/alt-text**
   - Set to "error" level
   - Requires alt text for images
   - Critical for screen readers
   - Includes img, area, input[type="image"]

3. **Configure jsx-a11y/anchor-is-valid**
   - Set to "warn" level
   - Validates anchor elements
   - Ensures proper href usage
   - Checks Next.js Link components

4. **Configure jsx-a11y/click-events-have-key-events**
   - Set to "warn" level
   - Requires keyboard equivalent for clicks
   - Ensures keyboard accessibility
   - Pairs with role attribute

5. **Configure jsx-a11y/no-noninteractive-element-interactions**
   - Set to "warn" level
   - Prevents onClick on div, span, etc.
   - Encourages semantic HTML
   - Promotes proper element usage

6. **Configure jsx-a11y/role-has-required-aria-props**
   - Set to "error" level
   - Validates ARIA roles
   - Ensures required props present
   - Critical for screen readers

7. **Configure jsx-a11y/label-has-associated-control**
   - Set to "error" level
   - Requires label/input association
   - Form accessibility
   - Multiple association methods

8. **Configure jsx-a11y/heading-has-content**
   - Set to "warn" level
   - Non-empty headings required
   - Document structure
   - Screen reader navigation

9. **Configure jsx-a11y/no-autofocus**
   - Set to "warn" level
   - Discourages autofocus attribute
   - User control priority
   - May be disabled for specific cases

10. **Save configuration**
    - Verify JSON syntax
    - Ensure proper rule naming

### Accessibility Rule Categories

```
┌─────────────────────────────────────────────────────┐
│         Accessibility Rule Categories               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Visual Accessibility                               │
│  ├─ alt-text (image descriptions)                   │
│  ├─ media-has-caption (video captions)              │
│  └─ heading-has-content (heading structure)         │
│                                                     │
│  Keyboard Accessibility                             │
│  ├─ click-events-have-key-events                    │
│  ├─ no-static-element-interactions                  │
│  └─ interactive-supports-focus                      │
│                                                     │
│  Semantic HTML                                      │
│  ├─ no-noninteractive-element-interactions          │
│  ├─ anchor-is-valid (proper links)                  │
│  └─ no-redundant-roles (correct elements)           │
│                                                     │
│  ARIA Validation                                    │
│  ├─ role-has-required-aria-props                    │
│  ├─ aria-props (valid attributes)                   │
│  └─ aria-role (valid roles)                         │
│                                                     │
│  Form Accessibility                                 │
│  ├─ label-has-associated-control                    │
│  ├─ autocomplete-valid (form completion)            │
│  └─ no-autofocus (user control)                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Alt Text Rule

```
Images Requiring Alt Text:
══════════════════════════

✗ Error - No alt text:
<img src="photo.jpg" />
<img src="photo.jpg" alt="" /> // Empty not OK for content images

✓ Correct - Descriptive alt:
<img src="photo.jpg" alt="Team celebrating project launch" />
<img src="logo.jpg" alt="Company logo" />

✓ Correct - Decorative images:
<img src="divider.jpg" alt="" role="presentation" />
<img src="background.jpg" alt="" aria-hidden="true" />

Next.js Image Component:
<Image src="/photo.jpg" alt="Description" width={200} height={200} />

Alt Text Best Practices:
├─ Be specific and descriptive
├─ Avoid "image of" or "picture of"
├─ Describe content and context
├─ Keep under 125 characters
└─ Empty alt for decorative only
```

### Anchor Element Validation

```
Valid Anchor Usage:
═══════════════════

✗ Warning - Invalid anchor:
<a>Click here</a>              // No href
<a href="#">Action</a>          // Meaningless href
<a href="javascript:void(0)">   // JavaScript href

✓ Correct - Valid anchors:
<a href="/about">About Us</a>
<a href="https://example.com">External Link</a>
<button onClick={handler}>Action</button> // Use button instead


Next.js Link Component:
═══════════════════════

✓ Correct usage:
<Link href="/about">
  <a>About Us</a>
</Link>

// Next.js 13+ (no <a> needed):
<Link href="/about">About Us</Link>


When to use <a> vs <button>:
═════════════════════════════

<a> (anchor):
├─ Navigate to different page
├─ Navigate to page section
└─ External links

<button>:
├─ Trigger actions
├─ Submit forms
├─ Toggle states
└─ Open modals
```

### Keyboard Accessibility

```
Click Events Need Keyboard Equivalent:
══════════════════════════════════════

✗ Warning - Click without keyboard:
<div onClick={handleClick}>Click me</div>

✓ Correct - With keyboard support:
<div
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
>
  Click me
</div>

✓ Better - Use button:
<button onClick={handleClick}>Click me</button>


Keyboard Event Handlers:
════════════════════════

onKeyDown - Key pressed (recommended)
onKeyUp   - Key released
onKeyPress - Deprecated

Common keys to handle:
├─ Enter (activate)
├─ Space (activate buttons)
├─ Escape (close modals)
├─ Arrow keys (navigation)
└─ Tab (focus management)
```

### Semantic HTML vs Non-Semantic

```
Non-Semantic (Inaccessible):
════════════════════════════

✗ Warning:
<div onClick={handleClick}>Submit</div>
<span onClick={handleDelete}>Delete</span>
<div onClick={handleToggle}>Menu</div>


Semantic (Accessible):
══════════════════════

✓ Correct:
<button onClick={handleClick}>Submit</button>
<button onClick={handleDelete}>Delete</button>
<button onClick={handleToggle}>Menu</button>


Benefits of Semantic HTML:
══════════════════════════

1. Keyboard Access
   └─ Buttons are focusable by default

2. Screen Reader Support
   └─ Announced as buttons automatically

3. Expected Behavior
   └─ Enter/Space work automatically

4. Styling
   └─ Browser default button styles

5. Reduced Code
   └─ No manual role/tabIndex needed
```

### ARIA Roles and Properties

```
ARIA Role Requirements:
═══════════════════════

✗ Error - Missing required props:
<div role="checkbox" />
// Missing: aria-checked

<div role="slider" />
// Missing: aria-valuenow, aria-valuemin, aria-valuemax


✓ Correct - All required props:
<div
  role="checkbox"
  aria-checked={isChecked}
  tabIndex={0}
/>

<div
  role="slider"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  tabIndex={0}
/>


Common ARIA Roles:
══════════════════

Role         Required Props
────────────────────────────
button       (none)
checkbox     aria-checked
radio        aria-checked
slider       aria-valuenow, aria-valuemin, aria-valuemax
switch       aria-checked
tab          (none)
tabpanel     (none)
dialog       aria-labelledby or aria-label
```

### Form Label Association

```
Label-Input Association Methods:
═════════════════════════════════

Method 1: Wrapping (implicit):
✓
<label>
  Name
  <input type="text" />
</label>


Method 2: htmlFor (explicit):
✓
<label htmlFor="name">Name</label>
<input type="text" id="name" />


Method 3: aria-label:
✓
<input type="text" aria-label="Name" />


Method 4: aria-labelledby:
✓
<span id="name-label">Name</span>
<input type="text" aria-labelledby="name-label" />


✗ Error - No association:
<label>Name</label>
<input type="text" />
// Label not associated with input
```

### Heading Structure

```
✗ Warning - Empty heading:
<h1></h1>
<h2>{undefined}</h2>
<h3>{null}</h3>

✓ Correct - Content present:
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>


Heading Hierarchy:
══════════════════

✓ Correct structure:
<h1>Main Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>

✗ Wrong - Skipping levels:
<h1>Main Title</h1>
  <h3>Section 1</h3> // Skipped h2
  <h5>Subsection</h5> // Skipped h4


Why Heading Structure Matters:
═══════════════════════════════

Screen Reader Users:
├─ Navigate by headings (H key)
├─ Jump between sections
└─ Understand document structure

SEO:
├─ Search engines use headings
└─ Determine content hierarchy

Accessibility:
└─ Only one <h1> per page recommended
```

### Autofocus Rule

```
✗ Warning - Autofocus used:
<input type="text" autoFocus />

Why autofocus is problematic:
═════════════════════════════

1. Unexpected Behavior
   └─ Moves focus without user action

2. Screen Reader Issues
   └─ Interrupts page reading

3. Keyboard Users
   └─ Loses place in navigation

4. Multiple Tabs
   └─ Focus conflicts

5. Mobile Devices
   └─ Triggers keyboard automatically


When autofocus is acceptable:
═════════════════════════════

├─ Modal dialogs (focus first field)
├─ Search pages (focus search input)
└─ Single-purpose pages

With user control:
useEffect(() => {
  // Programmatic focus with delay
  inputRef.current?.focus()
}, [])
```

### WCAG Compliance Levels

```
Web Content Accessibility Guidelines (WCAG) 2.1:
════════════════════════════════════════════════

Level A (Minimum):
├─ Basic accessibility features
├─ Alt text for images
├─ Keyboard access
└─ jsx-a11y catches most violations

Level AA (Standard): ← Target level
├─ Color contrast ratios
├─ Resize text support
├─ Multiple navigation methods
└─ jsx-a11y helps enforce

Level AAA (Enhanced):
├─ Highest level
├─ Extended audio descriptions
└─ Sign language interpretation


jsx-a11y Plugin Coverage:
═════════════════════════

Automated Checks:
├─ Detects ~30% of a11y issues
├─ Catches common problems
└─ Prevents obvious violations

Manual Testing Still Required:
├─ Screen reader testing
├─ Keyboard navigation testing
├─ Color contrast checking
└─ User testing with disabilities
```

### Recommended Accessibility Rules Configuration

| Rule | Setting | Rationale |
|------|---------|-----------|
| alt-text | error | Critical for screen readers |
| anchor-is-valid | warn | Proper link semantics |
| click-events-have-key-events | warn | Keyboard accessibility |
| no-noninteractive-element-interactions | warn | Semantic HTML |
| role-has-required-aria-props | error | Valid ARIA usage |
| label-has-associated-control | error | Form accessibility |
| heading-has-content | warn | Document structure |
| no-autofocus | warn | User control |

### Expected Outcome
- WCAG compliance foundation
- Accessible components by default
- Screen reader compatibility
- Keyboard navigation support

### Verification Checklist
- [ ] jsx-a11y/alt-text set to error
- [ ] jsx-a11y/anchor-is-valid set to warn
- [ ] jsx-a11y/click-events-have-key-events set to warn
- [ ] jsx-a11y/no-noninteractive-element-interactions set to warn
- [ ] jsx-a11y/role-has-required-aria-props set to error
- [ ] jsx-a11y/label-has-associated-control set to error
- [ ] jsx-a11y/heading-has-content set to warn
- [ ] jsx-a11y/no-autofocus set to warn
- [ ] Valid JSON syntax maintained

---

## Task 55: Create .eslintignore File

### Overview
Create the .eslintignore file to exclude specific directories and files from ESLint checking. This prevents linting of generated files, dependencies, build outputs, and configuration files that don't need linting, improving performance and reducing noise.

### Dependencies
- Task 50: Create .eslintrc.json Configuration

### Instructions

1. **Create .eslintignore file**
   - Navigate to `frontend/` directory root
   - Create new file named `.eslintignore`
   - Hidden file (starts with dot)

2. **Add node_modules directory**
   - Exclude all npm packages
   - Largest performance impact
   - Not project code

3. **Add .next directory**
   - Next.js build output
   - Generated files
   - Not source code

4. **Add out directory**
   - Static export output
   - Generated HTML/JS
   - Production build artifacts

5. **Add build directory**
   - Alternative build output location
   - Compiled files
   - Not source code

6. **Add coverage directory**
   - Test coverage reports
   - Generated files
   - Not project code

7. **Add public directory**
   - Static assets (images, fonts)
   - No JavaScript to lint
   - May contain third-party scripts

8. **Add configuration files**
   - next.config.js (if needed)
   - May use CommonJS syntax
   - Often auto-generated or minimal

9. **Add lock files**
   - pnpm-lock.yaml
   - package-lock.json
   - yarn.lock
   - Not JavaScript files

10. **Add environment files**
    - .env files
    - .env.local, .env.production, etc.
    - Not JavaScript files

11. **Save .eslintignore file**
    - One pattern per line
    - Use glob patterns
    - Comments with # symbol

### .eslintignore File Structure

```
┌─────────────────────────────────────────────────────┐
│           .eslintignore File Layout                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  # Dependencies                                     │
│  node_modules/                                      │
│                                                     │
│  # Build Outputs                                    │
│  .next/                                             │
│  out/                                               │
│  build/                                             │
│  dist/                                              │
│                                                     │
│  # Test Coverage                                    │
│  coverage/                                          │
│  .nyc_output/                                       │
│                                                     │
│  # Static Assets                                    │
│  public/                                            │
│                                                     │
│  # Config Files                                     │
│  *.config.js                                        │
│  *.config.ts                                        │
│                                                     │
│  # Lock Files                                       │
│  pnpm-lock.yaml                                     │
│  package-lock.json                                  │
│  yarn.lock                                          │
│                                                     │
│  # Environment Files                                │
│  .env*                                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Pattern Explanations

#### Directory Patterns
```
node_modules/           # Exact directory name, trailing slash
.next/                  # Hidden directory (starts with .)
**/.cache/              # Any .cache directory at any depth
```

#### File Patterns
```
*.config.js             # Any file ending with .config.js
.env*                   # Any file starting with .env
**/temp/*.js            # JS files in any temp directory
```

#### Glob Pattern Syntax
```
*                       # Matches any characters except /
**                      # Matches any characters including /
?                       # Matches single character
[abc]                   # Matches any character in brackets
[!abc]                  # Matches any character not in brackets
{a,b}                   # Matches a or b
```

### Why Exclude These Files

| Path/Pattern | Reason | Impact |
|-------------|--------|--------|
| node_modules/ | Third-party code, not project code | Huge performance boost |
| .next/ | Generated by Next.js, not editable | Avoid false errors |
| out/ | Static export output | Not source code |
| build/ | Build artifacts | Generated files |
| coverage/ | Test coverage reports | Generated data |
| public/ | Static assets, no JS code | Not applicable |
| *.config.js | May use different syntax | Special handling |
| pnpm-lock.yaml | Package lock file | Not code |
| .env* | Environment variables | Not code |

### Performance Impact

```
Linting Performance Comparison:
═══════════════════════════════

Without .eslintignore:
├─ Files checked: ~50,000 (including node_modules)
├─ Time: ~2-5 minutes
└─ False errors from dependencies

With .eslintignore:
├─ Files checked: ~200 (project files only)
├─ Time: ~5-15 seconds
└─ Only relevant errors

Performance Improvement: 10-50x faster!
```

### Common .eslintignore Patterns

#### Next.js Projects
```
# Next.js
.next/
out/
*.d.ts

# Vercel
.vercel/
```

#### Testing
```
# Test Coverage
coverage/
.nyc_output/
jest-report/

# Test Fixtures
__fixtures__/
__mocks__/
```

#### TypeScript
```
# TypeScript
*.d.ts
dist/
```

#### Build Tools
```
# Build outputs
build/
dist/
.cache/
tmp/
temp/
```

### .eslintignore vs .gitignore

```
Differences:
════════════

.gitignore:
├─ Excludes from version control
├─ Prevents committing files
└─ Security and size concerns

.eslintignore:
├─ Excludes from linting
├─ Performance optimization
└─ Avoid linting generated files


Overlap:
════════

Many patterns appear in both:
├─ node_modules/
├─ build outputs
└─ coverage reports

But not all:
├─ .env files (in .gitignore, may lint)
├─ .d.ts files (in .eslintignore, may commit)
```

### Global Ignores vs File Ignores

```
.eslintignore (Global):
═══════════════════════

node_modules/
.next/

└─ Applies to entire project
└─ One configuration file


Inline Ignores (Per File):
═══════════════════════════

// eslint-disable-next-line
const any: any = data

/* eslint-disable */
// Entire block
/* eslint-enable */

└─ Specific to one file
└─ Use sparingly


Directory .eslintrc (Override):
═══════════════════════════════

scripts/.eslintrc.json
{
  "rules": {
    "no-console": "off"
  }
}

└─ Override rules for directory
└─ Useful for scripts/tools
```

### Comments in .eslintignore

```
Recommended Format:
═══════════════════

# Section Header
# ═══════════════

# Explanation of why excluding
pattern-to-ignore

Example:

# Dependencies
# ════════════
# Third-party packages from npm
node_modules/

# Build Outputs
# ═════════════
# Generated by Next.js during build
.next/
out/
```

### Special Cases

#### Ignore Specific File Types
```
# Ignore all CSS files (if using CSS-in-JS only)
**/*.css

# Ignore all test files (if using separate test config)
**/*.test.ts
**/*.spec.ts

# Ignore all stories (Storybook)
**/*.stories.tsx
```

#### Ignore by Directory Depth
```
# Ignore only in root
/temp/

# Ignore at any depth
**/temp/

# Ignore in specific path
app/admin/temp/
```

### Verification Methods

```
Check What Gets Linted:
═══════════════════════

1. Dry run:
   pnpm eslint . --debug

2. List files that would be linted:
   pnpm eslint . --ignore-path .eslintignore --print-config .

3. Check specific file:
   pnpm eslint --print-config path/to/file.ts

4. Verify ignore patterns:
   pnpm eslint --debug path/to/file
   # Look for "File ignored" message
```

### Expected Outcome
- .eslintignore file created
- Build outputs excluded
- Dependencies excluded
- Fast linting performance
- Only project files linted

### Verification Checklist
- [ ] .eslintignore file created in frontend/
- [ ] node_modules/ pattern added
- [ ] .next/ pattern added
- [ ] out/ pattern added
- [ ] build/ pattern added
- [ ] coverage/ pattern added
- [ ] public/ pattern added (if no JS)
- [ ] *.config.js pattern added (if needed)
- [ ] pnpm-lock.yaml pattern added
- [ ] .env* pattern added
- [ ] One pattern per line
- [ ] Comments added for clarity
- [ ] No trailing spaces

---

## Summary

This document established comprehensive ESLint configuration for the Next.js frontend application:

### Completed Infrastructure
- ✅ ESLint core dependencies installed
- ✅ TypeScript ESLint parser and plugin installed
- ✅ React Hooks, Import, and Accessibility plugins installed
- ✅ .eslintrc.json configuration created
- ✅ TypeScript-specific rules configured
- ✅ React and React Hooks rules configured
- ✅ Import ordering and validation rules configured
- ✅ Accessibility (jsx-a11y) rules configured
- ✅ .eslintignore file created

### Key Achievements

#### 1. Code Quality Foundation
- TypeScript best practices enforced
- Type safety promoted
- Unused code detection
- Consistent coding patterns

#### 2. React Best Practices
- Rules of Hooks enforcement
- Dependency array validation
- React 17+ JSX transform compatibility
- Modern React patterns

#### 3. Code Organization
- Consistent import ordering
- Duplicate import prevention
- Circular dependency detection
- Module resolution validation

#### 4. Accessibility Compliance
- WCAG guideline support
- Screen reader compatibility
- Keyboard navigation requirements
- Semantic HTML enforcement

#### 5. Performance Optimization
- Excluded build outputs and dependencies
- Fast linting execution
- Only project files checked
- Reduced false positives

### Configuration Overview

```
ESLint Setup Summary:
════════════════════════

Parser: @typescript-eslint/parser
Plugins: 4 (TypeScript, React Hooks, Import, jsx-a11y)
Extends: 5 base configurations
Rules: 20+ custom rules
Ignore Patterns: 10+ patterns

Supported File Types:
├─ .ts (TypeScript)
├─ .tsx (TypeScript + JSX)
├─ .js (JavaScript)
└─ .jsx (JavaScript + JSX)

Check Scope:
├─ Type safety ✓
├─ Code quality ✓
├─ React patterns ✓
├─ Import organization ✓
├─ Accessibility ✓
└─ Best practices ✓
```

### Next Steps
Proceed to [02_Tasks-56-62_Prettier-Integration.md](02_Tasks-56-62_Prettier-Integration.md) to install Prettier, configure formatting rules, integrate with ESLint, and verify the complete linting and formatting setup.

### Testing the ESLint Configuration

```
Commands to Verify Setup:
═════════════════════════

1. Check configuration:
   pnpm eslint --print-config src/app/page.tsx

2. Lint all files:
   pnpm lint

3. Lint specific file:
   pnpm eslint src/app/page.tsx

4. Fix auto-fixable issues:
   pnpm lint --fix

5. Check for errors only:
   pnpm eslint --quiet src/
```

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9 (47-55)  
**Total Lines:** ~990
**Configuration Files:** 2 (.eslintrc.json, .eslintignore)
