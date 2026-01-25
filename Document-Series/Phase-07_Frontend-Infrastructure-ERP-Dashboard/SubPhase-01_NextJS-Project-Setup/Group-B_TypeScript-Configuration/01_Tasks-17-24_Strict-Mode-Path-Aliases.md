# Tasks 17-24: Strict Mode and Path Aliases Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** B - TypeScript Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_Additional-Aliases-Verification.md](02_Tasks-25-30_Additional-Aliases-Verification.md)

---

## Document Overview

This document covers the foundation of TypeScript configuration for the Next.js application, including creating the base tsconfig.json, enabling strict mode for type safety, configuring module resolution for modern bundlers, and setting up path aliases for the primary application directories (components, lib, hooks, store, types).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create tsconfig.json | Medium | 20 min |
| 18 | Enable Strict Mode Options | Low | 10 min |
| 19 | Configure Module Resolution | Low | 10 min |
| 20 | Set Up Path Aliases - Components | Low | 5 min |
| 21 | Set Up Path Aliases - Lib | Low | 5 min |
| 22 | Set Up Path Aliases - Hooks | Low | 5 min |
| 23 | Set Up Path Aliases - Store | Low | 5 min |
| 24 | Set Up Path Aliases - Types | Low | 5 min |

---

## Task 17: Create tsconfig.json

### Overview
Create the primary TypeScript configuration file (tsconfig.json) for the Next.js application. This file serves as the foundation for all TypeScript compilation settings, including compiler options, module resolution, and path mappings. Next.js 14+ requires specific configuration options to work properly with the App Router and Server Components.

### Dependencies
- Task 06: Install TypeScript and Dependencies (from Group A)
- Next.js project initialized
- TypeScript package installed

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend directory
   - This is where Next.js application resides

2. **Create tsconfig.json file**
   - Create new file named `tsconfig.json` in frontend root
   - This file will be at same level as package.json
   - Will be automatically detected by TypeScript and Next.js

3. **Add root configuration object**
   - Create main JSON object with two primary sections
   - `compilerOptions` section for TypeScript compiler settings
   - `include` and `exclude` sections for file patterns

4. **Set compiler target**
   - Add `compilerOptions` object
   - Set `target` to control JavaScript output version
   - Modern browsers support ES2022 features
   - Influences which JavaScript features can be used

5. **Set module system**
   - Configure `lib` array for runtime APIs
   - Include ES2022 library for modern JavaScript
   - Include DOM libraries for browser APIs
   - Include DOM.Iterable for iterator support

6. **Configure JSX handling**
   - Set `jsx` compiler option for React components
   - Use "preserve" mode for Next.js
   - Next.js handles JSX transformation during build
   - Enables Fast Refresh during development

7. **Add incremental compilation**
   - Enable `incremental` option
   - Speeds up subsequent compilations
   - TypeScript caches type information
   - Reduces build time in development

8. **Configure module format**
   - Set `module` to "esnext"
   - Enables latest ECMAScript module syntax
   - Supports dynamic imports
   - Compatible with Next.js bundling

9. **Add base configuration structure**
   - Set up skeleton for future configurations
   - Prepare sections for paths, includes, excludes
   - Leave room for Next.js-specific settings
   - Structure for extensibility

### TypeScript Configuration Structure

```
┌────────────────────────────────────────────────┐
│              tsconfig.json                     │
├────────────────────────────────────────────────┤
│ Compiler Options:                              │
│  • target: ES2022                              │
│  • lib: [ES2022, DOM, DOM.Iterable]            │
│  • jsx: preserve                               │
│  • module: esnext                              │
│  • incremental: true                           │
│  • [strict mode options - Task 18]             │
│  • [module resolution - Task 19]               │
│  • [path aliases - Tasks 20-24]                │
│                                                │
│ Include/Exclude Patterns:                      │
│  • [configured in Task 28]                     │
└────────────────────────────────────────────────┘
```

### Configuration Hierarchy

```
tsconfig.json (Main Configuration)
    │
    ├──► Compiler Options
    │    ├──► Language Features (target, lib, jsx)
    │    ├──► Module System (module, moduleResolution)
    │    ├──► Type Checking (strict, noImplicitAny, etc.)
    │    └──► Path Mapping (baseUrl, paths)
    │
    ├──► Include Patterns
    │    └──► Which files TypeScript should process
    │
    └──► Exclude Patterns
         └──► Which files TypeScript should ignore
```

### Target Version Comparison

| Target | Output JavaScript | Browser Support | Features Available |
|--------|------------------|-----------------|-------------------|
| ES5 | ES5 syntax | IE11+ | Limited, requires polyfills |
| ES2017 | ES2017 syntax | Modern browsers | async/await native |
| ES2020 | ES2020 syntax | Recent browsers | Optional chaining |
| ES2022 | ES2022 syntax | Latest browsers | Top-level await, class fields |

### JSX Mode Options

| Mode | Purpose | Used By | Output |
|------|---------|---------|--------|
| react | Classic JSX transform | React 16 | React.createElement calls |
| react-jsx | Automatic JSX transform | React 17+ | Automatic imports |
| preserve | Keep JSX as-is | Next.js | Bundler handles JSX |
| react-native | React Native JSX | React Native | Native components |

### Module System Options

| Module | Description | Use Case |
|--------|-------------|----------|
| commonjs | CommonJS (require/module.exports) | Node.js, legacy |
| esnext | Latest ES modules | Modern bundlers |
| es2020 | ES2020 modules | Stable ES modules |
| node16 | Node.js 16+ modules | Node.js projects |

### Library Inclusions

| Library | Provides | Required For |
|---------|----------|--------------|
| ES2022 | Modern JavaScript APIs | Array.at(), Object.hasOwn() |
| DOM | Browser APIs | document, window, DOM types |
| DOM.Iterable | Iterator support | for...of on DOM collections |
| WebWorker | Web Worker APIs | Worker, SharedWorker types |

### Expected Outcome
- Basic tsconfig.json file created
- Next.js-compatible compiler options
- Modern JavaScript target (ES2022)
- JSX preservation for Next.js
- Foundation for additional configuration

### Verification Checklist
- [ ] tsconfig.json exists in frontend directory
- [ ] File is valid JSON format
- [ ] compilerOptions object present
- [ ] target set to "es2022"
- [ ] lib includes ES2022, DOM, DOM.Iterable
- [ ] jsx set to "preserve"
- [ ] module set to "esnext"
- [ ] incremental set to true
- [ ] File structure allows for expansion

---

## Task 18: Enable Strict Mode Options

### Overview
Enable TypeScript's strict type-checking options to ensure maximum type safety throughout the application. Strict mode catches common programming errors at compile time, prevents implicit any types, enforces null safety, and ensures proper function type checking. This is essential for large-scale enterprise applications where type safety prevents runtime errors.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions section

2. **Enable master strict flag**
   - Add `strict` property set to true
   - Enables all strict type checking options
   - Individual options can still be fine-tuned
   - Recommended for all new projects

3. **Enable noImplicitAny**
   - Set `noImplicitAny` to true
   - Prevents implicit any types
   - Forces explicit type annotations
   - Already enabled by strict flag (explicit for clarity)

4. **Enable strictNullChecks**
   - Set `strictNullChecks` to true
   - Makes null and undefined explicit in type system
   - Prevents common null reference errors
   - Requires explicit null/undefined handling

5. **Enable strictFunctionTypes**
   - Set `strictFunctionTypes` to true
   - Enables strict checking of function types
   - Ensures proper contravariance for parameters
   - Catches incorrect function assignments

6. **Enable strictBindCallApply**
   - Set `strictBindCallApply` to true
   - Type-checks bind, call, and apply methods
   - Ensures correct argument types
   - Prevents runtime errors from incorrect binding

7. **Enable strictPropertyInitialization**
   - Set `strictPropertyInitialization` to true
   - Requires class properties to be initialized
   - Prevents undefined property access
   - Requires constructor initialization or definite assignment

8. **Enable noImplicitThis**
   - Set `noImplicitThis` to true
   - Prevents implicit any type for this
   - Requires explicit this type annotations
   - Clarifies this context in functions

9. **Enable useUnknownInCatchVariables**
   - Set `useUnknownInCatchVariables` to true
   - Catch variables typed as unknown instead of any
   - Requires type checking before using error
   - Safer error handling pattern

10. **Enable alwaysStrict**
    - Set `alwaysStrict` to true
    - Emits "use strict" in JavaScript output
    - Enforces strict mode in all files
    - Prevents common JavaScript pitfalls

### Strict Mode Options Overview

```
┌────────────────────────────────────────────────┐
│         TypeScript Strict Mode                 │
├────────────────────────────────────────────────┤
│ Master Flag:                                   │
│  • strict: true                                │
│                                                │
│ Individual Options (explicit):                 │
│  • noImplicitAny: true                         │
│  • strictNullChecks: true                      │
│  • strictFunctionTypes: true                   │
│  • strictBindCallApply: true                   │
│  • strictPropertyInitialization: true          │
│  • noImplicitThis: true                        │
│  • useUnknownInCatchVariables: true            │
│  • alwaysStrict: true                          │
└────────────────────────────────────────────────┘
```

### Strict Mode Benefits

| Option | Catches | Example Prevention |
|--------|---------|-------------------|
| noImplicitAny | Implicit any types | function(x) → function(x: string) |
| strictNullChecks | Null/undefined errors | value.toString() → value?.toString() |
| strictFunctionTypes | Incorrect function types | Wrong callback signatures |
| strictBindCallApply | Bind/call/apply errors | Wrong argument counts |
| strictPropertyInitialization | Uninitialized properties | Missing constructor initialization |
| noImplicitThis | Unclear this context | Requires this type annotation |
| useUnknownInCatchVariables | Unsafe error handling | Unknown type for caught errors |
| alwaysStrict | JavaScript pitfalls | Enforces strict mode globally |

### Type Safety Levels

```
Type Safety Progression
═══════════════════════════════════════

Level 1: Loose (No Strict Mode)
  ↓ Allows implicit any
  ↓ Null/undefined not explicit
  ↓ Minimal type checking
  
Level 2: Moderate (Some Strict Options)
  ↓ Some null safety
  ↓ Some function checking
  ↓ Better than loose
  
Level 3: Strict (All Options Enabled)  ← Target
  ✓ Maximum type safety
  ✓ Explicit null handling
  ✓ Strong function types
  ✓ No implicit any
  ✓ Enterprise-grade safety
```

### Strict Null Checks Impact

#### Without strictNullChecks
```
Potential Runtime Error:
─────────────────────────────────────
user may be null or undefined
↓
user.name.toUpperCase()
↓
Runtime Error: Cannot read property 'name' of null
```

#### With strictNullChecks
```
Compile-Time Safety:
─────────────────────────────────────
TypeScript forces explicit handling:
↓
if (user && user.name) {
  user.name.toUpperCase()  // Safe
}
↓
or
↓
user?.name?.toUpperCase()  // Optional chaining
↓
No Runtime Errors
```

### NoImplicitAny Examples

| Scenario | Without noImplicitAny | With noImplicitAny |
|----------|----------------------|-------------------|
| Function parameter | `function(x)` → x is any | Error: requires type annotation |
| Array methods | `items.map(item => ...)` | Error: requires explicit type |
| Object properties | Implicit any access | Error: explicit typing required |
| Return types | Inferred but may be any | Error if cannot infer |

### StrictPropertyInitialization Requirements

```
Class Property Initialization
═══════════════════════════════════════

❌ Error: Property not initialized
───────────────────────────────────────
class User {
  name: string;  // Error!
}

✅ Solution 1: Constructor initialization
───────────────────────────────────────
class User {
  name: string;
  constructor(name: string) {
    this.name = name;  // Initialized
  }
}

✅ Solution 2: Definite assignment
───────────────────────────────────────
class User {
  name!: string;  // Definite assignment assertion
}

✅ Solution 3: Default value
───────────────────────────────────────
class User {
  name: string = '';  // Default value
}
```

### UseUnknownInCatchVariables Pattern

#### Traditional Approach (any)
```
Error Handling with any:
───────────────────────────────────────
try {
  // code
} catch (error) {  // error: any
  error.message  // No type checking
  error.foo()    // No compile error
}
```

#### Strict Approach (unknown)
```
Error Handling with unknown:
───────────────────────────────────────
try {
  // code
} catch (error) {  // error: unknown
  if (error instanceof Error) {
    error.message  // Safe, type checked
  }
  // Must check type before use
}
```

### Migration Considerations

| Aspect | Recommendation | Reasoning |
|--------|---------------|-----------|
| New projects | Enable all strict options | Start with maximum safety |
| Existing projects | Gradual migration | Enable one option at a time |
| Legacy code | Use allowJs temporarily | Transition from JavaScript |
| Third-party types | Check @types accuracy | May need type assertions |

### Common Strict Mode Errors

| Error Type | Cause | Solution |
|------------|-------|----------|
| Type 'null' is not assignable | strictNullChecks | Add null to type union |
| Property has no initializer | strictPropertyInitialization | Initialize in constructor |
| 'this' implicitly has type 'any' | noImplicitThis | Add this parameter type |
| Parameter implicitly has 'any' | noImplicitAny | Add explicit type annotation |

### Expected Outcome
- Maximum type safety enabled
- Compile-time error prevention
- Explicit null/undefined handling required
- Strong function type checking
- Enterprise-grade type safety

### Verification Checklist
- [ ] strict set to true
- [ ] noImplicitAny set to true
- [ ] strictNullChecks set to true
- [ ] strictFunctionTypes set to true
- [ ] strictBindCallApply set to true
- [ ] strictPropertyInitialization set to true
- [ ] noImplicitThis set to true
- [ ] useUnknownInCatchVariables set to true
- [ ] alwaysStrict set to true
- [ ] All options in compilerOptions section

---

## Task 19: Configure Module Resolution

### Overview
Configure TypeScript's module resolution system to work optimally with modern bundlers like Next.js's Turbopack and Webpack. The "bundler" module resolution mode is designed for tools that handle their own module resolution, providing better compatibility with modern ECMAScript modules, conditional exports, and package.json exports field.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions section

2. **Set moduleResolution strategy**
   - Add `moduleResolution` property
   - Set value to "bundler"
   - Optimized for modern bundlers (Next.js, Vite, etc.)
   - Supports package.json exports field

3. **Enable esModuleInterop**
   - Set `esModuleInterop` to true
   - Enables CommonJS/ES module interoperability
   - Allows default imports from CommonJS modules
   - Simplifies import syntax

4. **Enable resolveJsonModule**
   - Set `resolveJsonModule` to true
   - Allows importing JSON files as modules
   - Useful for configuration files
   - Provides type safety for JSON imports

5. **Enable isolatedModules**
   - Set `isolatedModules` to true
   - Ensures each file can be transpiled independently
   - Required for Fast Refresh in Next.js
   - Improves build performance with parallel processing

6. **Set allowImportingTsExtensions**
   - Set `allowImportingTsExtensions` to true
   - Allows importing .ts/.tsx files with extensions
   - Aligns with ESM import requirements
   - Future-proofs module imports

7. **Enable skipLibCheck**
   - Set `skipLibCheck` to true
   - Skips type checking in declaration files
   - Speeds up compilation significantly
   - Still checks application code thoroughly

8. **Enable allowSyntheticDefaultImports**
   - Set `allowSyntheticDefaultImports` to true
   - Allows default imports from modules without default export
   - Enhanced import flexibility
   - Better library compatibility

### Module Resolution Configuration

```
┌────────────────────────────────────────────────┐
│        Module Resolution Settings              │
├────────────────────────────────────────────────┤
│ Core Resolution:                               │
│  • moduleResolution: "bundler"                 │
│                                                │
│ Interoperability:                              │
│  • esModuleInterop: true                       │
│  • allowSyntheticDefaultImports: true          │
│                                                │
│ Import Capabilities:                           │
│  • resolveJsonModule: true                     │
│  • allowImportingTsExtensions: true            │
│                                                │
│ Performance:                                   │
│  • isolatedModules: true                       │
│  • skipLibCheck: true                          │
└────────────────────────────────────────────────┘
```

### Module Resolution Strategies Comparison

| Strategy | Purpose | Use Case | Next.js Compatible |
|----------|---------|----------|-------------------|
| node | Node.js classic | Legacy Node.js | Deprecated |
| node16 | Node.js 16+ | Modern Node.js | Yes (but not optimal) |
| nodenext | Latest Node.js | Bleeding edge Node | Yes (but not optimal) |
| bundler | Bundler-optimized | Next.js, Vite, Webpack | Yes (recommended) |

### Module Resolution Decision Flow

```
Choosing Module Resolution
═══════════════════════════════════════

Using a bundler? (Next.js, Vite)
    │
    ├── Yes → Use "bundler"          ← Our choice
    │          ✓ Optimal for Next.js
    │          ✓ Supports exports field
    │          ✓ Modern module features
    │
    └── No → Node.js only?
            │
            ├── Modern (16+) → Use "node16" or "nodenext"
            └── Legacy → Use "node"
```

### EsModuleInterop Benefits

#### Without esModuleInterop
```
CommonJS Import Issues:
───────────────────────────────────────
import React from 'react'  // May not work
↓
Must use:
import * as React from 'react'  // Verbose
```

#### With esModuleInterop
```
Clean Import Syntax:
───────────────────────────────────────
import React from 'react'  // Works!
↓
TypeScript handles compatibility
automatically
```

### Module Resolution Features

| Feature | Enabled By | Benefit |
|---------|-----------|---------|
| JSON imports | resolveJsonModule | Import config.json as typed object |
| Independent transpilation | isolatedModules | Faster builds, parallel processing |
| Fast lib checking | skipLibCheck | Reduced compilation time |
| Synthetic defaults | allowSyntheticDefaultImports | Better CommonJS compatibility |
| Bundler exports | moduleResolution: bundler | Package.json exports field support |

### IsolatedModules Requirements

```
Isolated Module Constraints
═══════════════════════════════════════

❌ Not Allowed: const enums
───────────────────────────────────────
const enum Status {
  Active = 1,
  Inactive = 0
}
// Error: Cannot be isolated

✅ Allowed: Regular enums
───────────────────────────────────────
enum Status {
  Active = 1,
  Inactive = 0
}
// Can be transpiled independently

❌ Not Allowed: Namespace merging
───────────────────────────────────────
namespace Utils {
  export const foo = 1
}
namespace Utils {
  export const bar = 2
}
// Error: Cross-file dependencies

✅ Allowed: Module exports
───────────────────────────────────────
export const foo = 1
export const bar = 2
// Independent module
```

### ResolveJsonModule Usage

| JSON Import | Type Safety | Use Case |
|-------------|-------------|----------|
| `import config from './config.json'` | Full type inference | Configuration files |
| `import data from './data.json'` | Array/object types | Static data |
| `import pkg from '../package.json'` | Package metadata | Version info |

### SkipLibCheck Performance Impact

```
Compilation Time Comparison
═══════════════════════════════════════

Without skipLibCheck:
├── Check node_modules/@types/* → 30s
├── Check lib.d.ts → 10s
├── Check application code → 20s
└── Total: ~60s

With skipLibCheck:
├── Skip node_modules/@types/* → 0s
├── Skip lib.d.ts → 0s
├── Check application code → 20s
└── Total: ~20s  (3x faster!)
```

### Package.json Exports Support

#### Modern Package Structure
```
package.json with exports field:
───────────────────────────────────────
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs"
    }
  }
}

With moduleResolution: "bundler":
✓ Respects conditional exports
✓ Finds correct types automatically
✓ Supports subpath patterns
```

### Module Resolution Best Practices

| Practice | Reasoning |
|----------|-----------|
| Use "bundler" for Next.js | Optimal bundler integration |
| Enable esModuleInterop | Cleaner import syntax |
| Enable skipLibCheck | Faster compilation |
| Enable isolatedModules | Required for Fast Refresh |
| Enable resolveJsonModule | Type-safe JSON imports |

### Expected Outcome
- Optimized module resolution for Next.js
- CommonJS/ESM interoperability
- JSON import support
- Fast compilation with isolated modules
- Skip unnecessary library type checks

### Verification Checklist
- [ ] moduleResolution set to "bundler"
- [ ] esModuleInterop set to true
- [ ] resolveJsonModule set to true
- [ ] isolatedModules set to true
- [ ] allowImportingTsExtensions set to true
- [ ] skipLibCheck set to true
- [ ] allowSyntheticDefaultImports set to true
- [ ] All options in compilerOptions section

---

## Task 20: Set Up Path Aliases - Components

### Overview
Configure the @/components/* path alias to enable clean, absolute imports for React components throughout the application. Path aliases eliminate relative import paths (../../components), make code more maintainable, and allow easy refactoring when moving files. The components directory will contain all reusable UI components including buttons, forms, layouts, and feature-specific components.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions section

2. **Add baseUrl property**
   - Set `baseUrl` to "."
   - Establishes root directory for path resolution
   - All path aliases are relative to baseUrl
   - Required for path mapping to work

3. **Create paths object**
   - Add `paths` property to compilerOptions
   - Object containing path alias mappings
   - Key is the alias pattern
   - Value is array of resolution paths

4. **Add components alias**
   - Create entry "@/components/*"
   - Map to array with "components/*"
   - Enables imports like: `import { Button } from '@/components/ui'`
   - Applies to all files in components directory

5. **Add root component alias**
   - Also add "@/components" (without wildcard)
   - Map to ["components"]
   - Enables: `import Layout from '@/components/Layout'`
   - Supports both patterns

### Path Alias Configuration Structure

```
┌────────────────────────────────────────────────┐
│         Path Alias Configuration               │
├────────────────────────────────────────────────┤
│ Base Configuration:                            │
│  • baseUrl: "."                                │
│                                                │
│ Path Mappings:                                 │
│  • "@/components/*" → "components/*"           │
│                                                │
│ Import Examples:                               │
│  import { Button } from '@/components/ui'      │
│  import Layout from '@/components/Layout'      │
└────────────────────────────────────────────────┘
```

### Import Pattern Comparison

#### Without Path Aliases
```
Relative Import Hierarchy:
═══════════════════════════════════════

src/
├── features/
│   └── dashboard/
│       └── DashboardPage.tsx
│           import Button from '../../../components/ui/Button'
│           import Card from '../../../components/ui/Card'
│           import { formatDate } from '../../../lib/utils'
│
└── components/
    └── ui/
        ├── Button.tsx
        └── Card.tsx

Problems:
❌ Hard to read and maintain
❌ Breaks when moving files
❌ Difficult to refactor
❌ Error-prone
```

#### With Path Aliases
```
Absolute Import Pattern:
═══════════════════════════════════════

src/
├── features/
│   └── dashboard/
│       └── DashboardPage.tsx
│           import { Button } from '@/components/ui/Button'
│           import { Card } from '@/components/ui/Card'
│           import { formatDate } from '@/lib/utils'
│
└── components/
    └── ui/
        ├── Button.tsx
        └── Card.tsx

Benefits:
✓ Clean and readable
✓ File location independent
✓ Easy refactoring
✓ Less error-prone
```

### Components Directory Structure

```
components/
├── ui/                          # Base UI components
│   ├── Button.tsx              # @/components/ui/Button
│   ├── Input.tsx               # @/components/ui/Input
│   ├── Card.tsx                # @/components/ui/Card
│   └── Modal.tsx               # @/components/ui/Modal
│
├── forms/                       # Form components
│   ├── LoginForm.tsx           # @/components/forms/LoginForm
│   ├── UserForm.tsx            # @/components/forms/UserForm
│   └── ProductForm.tsx         # @/components/forms/ProductForm
│
├── layout/                      # Layout components
│   ├── Header.tsx              # @/components/layout/Header
│   ├── Sidebar.tsx             # @/components/layout/Sidebar
│   ├── Footer.tsx              # @/components/layout/Footer
│   └── MainLayout.tsx          # @/components/layout/MainLayout
│
└── features/                    # Feature-specific components
    ├── inventory/               # @/components/features/inventory
    ├── pos/                     # @/components/features/pos
    └── reports/                 # @/components/features/reports
```

### Path Alias Resolution Example

```
Import Statement Resolution
═══════════════════════════════════════

Code:
import { Button } from '@/components/ui/Button'

TypeScript Resolution:
1. See @ prefix in path
2. Check paths configuration
3. Find "@/components/*" → "components/*"
4. Replace @ with baseUrl (.)
5. Resolve to: ./components/ui/Button
6. Find Button.tsx or Button.ts

Final Path: ./components/ui/Button.tsx
```

### Component Import Patterns

| Import Type | Example | Resolves To |
|-------------|---------|-------------|
| UI component | `@/components/ui/Button` | components/ui/Button.tsx |
| Form component | `@/components/forms/LoginForm` | components/forms/LoginForm.tsx |
| Layout component | `@/components/layout/Header` | components/layout/Header.tsx |
| Feature component | `@/components/features/pos/Cart` | components/features/pos/Cart.tsx |
| Index export | `@/components/ui` | components/ui/index.ts |

### BaseUrl Options

| BaseUrl Value | Resolution Root | Use Case |
|---------------|-----------------|----------|
| "." | Project root (with tsconfig) | Standard Next.js setup |
| "./" | Same as "." | Alternative syntax |
| "src" | src directory | If code is in src/ |
| "../" | Parent directory | Monorepo child package |

### IDE Benefits

```
IDE Features with Path Aliases
═══════════════════════════════════════

Auto-completion:
  Type '@/components/' → IDE suggests all components

Go to Definition:
  Ctrl+Click on import → Navigates to component file

Refactoring:
  Rename component → IDE updates all imports

Import Auto-add:
  Type component name → IDE adds correct import path

Find References:
  Show all usages → Finds all imports across project
```

### Common Component Categories

| Category | Alias Example | Purpose |
|----------|---------------|---------|
| UI primitives | `@/components/ui/Button` | Base styled components |
| Forms | `@/components/forms/UserForm` | Form components |
| Layouts | `@/components/layout/Header` | Page layout components |
| Features | `@/components/features/inventory` | Domain-specific components |
| Shared | `@/components/shared/ErrorBoundary` | Cross-feature components |

### Expected Outcome
- @/components/* path alias configured
- Clean absolute imports for components
- Easier component refactoring
- Improved code readability
- IDE auto-completion support

### Verification Checklist
- [ ] baseUrl set to "."
- [ ] paths object created in compilerOptions
- [ ] "@/components/*" maps to ["components/*"]
- [ ] Path alias follows Next.js conventions
- [ ] Configuration allows for additional aliases

---

## Task 21: Set Up Path Aliases - Lib

### Overview
Configure the @/lib/* path alias for utility functions, helpers, validators, and shared business logic. The lib directory serves as the central location for reusable code that doesn't fit into components, hooks, or other specialized directories. This includes date formatting, string manipulation, API helpers, validation functions, and utility classes.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions.paths section

2. **Add lib path alias**
   - Add new entry to paths object
   - Key: "@/lib/*"
   - Value: ["lib/*"]
   - Enables: `import { formatCurrency } from '@/lib/utils'`

3. **Add root lib alias**
   - Also add "@/lib" entry
   - Map to ["lib"]
   - Supports both wildcard and direct imports
   - Flexibility for different import patterns

### Lib Directory Purpose

```
┌────────────────────────────────────────────────┐
│            Lib Directory Purpose               │
├────────────────────────────────────────────────┤
│ Contains:                                      │
│  • Utility functions                           │
│  • Helper functions                            │
│  • Validators                                  │
│  • Formatters                                  │
│  • API clients                                 │
│  • Shared business logic                       │
│  • Third-party library wrappers                │
│                                                │
│ Does NOT contain:                              │
│  • React components                            │
│  • React hooks                                 │
│  • State management                            │
│  • Type definitions                            │
└────────────────────────────────────────────────┘
```

### Lib Directory Structure

```
lib/
├── utils/                       # General utilities
│   ├── string.ts               # @/lib/utils/string
│   ├── date.ts                 # @/lib/utils/date
│   ├── number.ts               # @/lib/utils/number
│   └── array.ts                # @/lib/utils/array
│
├── validators/                  # Validation functions
│   ├── email.ts                # @/lib/validators/email
│   ├── phone.ts                # @/lib/validators/phone
│   └── nic.ts                  # @/lib/validators/nic (Sri Lanka)
│
├── formatters/                  # Formatting functions
│   ├── currency.ts             # @/lib/formatters/currency
│   ├── date.ts                 # @/lib/formatters/date
│   └── number.ts               # @/lib/formatters/number
│
├── api/                        # API utilities
│   ├── client.ts               # @/lib/api/client
│   ├── error-handler.ts        # @/lib/api/error-handler
│   └── interceptors.ts         # @/lib/api/interceptors
│
├── auth/                       # Authentication utilities
│   ├── token.ts                # @/lib/auth/token
│   ├── permissions.ts          # @/lib/auth/permissions
│   └── session.ts              # @/lib/auth/session
│
└── localization/               # i18n utilities
    ├── currency.ts             # @/lib/localization/currency (LKR)
    ├── date.ts                 # @/lib/localization/date
    └── number.ts               # @/lib/localization/number
```

### Lib Usage Examples

| Function Type | Import Example | Use Case |
|--------------|----------------|----------|
| Date utility | `import { formatDate } from '@/lib/utils/date'` | Format dates consistently |
| Currency formatter | `import { formatLKR } from '@/lib/formatters/currency'` | Display Sri Lankan Rupees |
| Email validator | `import { isValidEmail } from '@/lib/validators/email'` | Validate email addresses |
| API client | `import { apiClient } from '@/lib/api/client'` | Make API requests |
| NIC validator | `import { validateNIC } from '@/lib/validators/nic'` | Validate Sri Lankan NIC |

### Lib vs Other Directories

```
Code Organization Decision Flow
═══════════════════════════════════════

Is it a React component?
├── Yes → components/
└── No ↓

Is it a React hook?
├── Yes → hooks/
└── No ↓

Is it a type/interface?
├── Yes → types/
└── No ↓

Is it state management?
├── Yes → store/
└── No ↓

Is it a utility/helper?
└── Yes → lib/  ← This directory
```

### Common Lib Utilities

| Category | Examples | Purpose |
|----------|----------|---------|
| String utils | trim, capitalize, slugify | String manipulation |
| Date utils | addDays, isWeekend, formatRelative | Date operations |
| Number utils | clamp, round, random | Number operations |
| Array utils | groupBy, unique, chunk | Array manipulation |
| Object utils | deepClone, merge, pick | Object operations |

### Sri Lanka-Specific Lib Functions

```
lib/localization/currency.ts
═══════════════════════════════════════
formatLKR(amount: number): string
  - Formats as: Rs. 1,234.56
  - Handles decimal precision
  - Adds thousands separators

lib/validators/nic.ts
═══════════════════════════════════════
validateNIC(nic: string): boolean
  - Validates old format (9 digits + V)
  - Validates new format (12 digits)
  - Returns true/false

extractNICInfo(nic: string)
  - Extracts birth date
  - Extracts gender
  - Returns structured info

lib/validators/phone.ts
═══════════════════════════════════════
validateSriLankanPhone(phone: string): boolean
  - Validates mobile (+94 7x xxx xxxx)
  - Validates landline (+94 xx xxx xxxx)
  - Returns true/false
```

### API Utilities Structure

```
lib/api/
═══════════════════════════════════════

client.ts
  - Base API client configuration
  - Request/response interceptors
  - Authentication header injection

error-handler.ts
  - Centralized error handling
  - Error message formatting
  - User-friendly error display

interceptors.ts
  - Request transformation
  - Response transformation
  - Token refresh logic
```

### Import Pattern Recommendations

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Direct import | Specific function | `import { formatDate } from '@/lib/utils/date'` |
| Barrel export | Multiple from category | `import { formatDate, addDays } from '@/lib/utils'` |
| Namespace import | Many related functions | `import * as dateUtils from '@/lib/utils/date'` |

### Expected Outcome
- @/lib/* path alias configured
- Clean imports for utility functions
- Organized helper function library
- Consistent code organization
- Improved maintainability

### Verification Checklist
- [ ] "@/lib/*" added to paths
- [ ] Maps to ["lib/*"]
- [ ] "@/lib" entry also added
- [ ] Path alias follows project conventions
- [ ] Ready for utility functions

---

## Task 22: Set Up Path Aliases - Hooks

### Overview
Configure the @/hooks/* path alias for custom React hooks. Hooks are reusable functions that encapsulate stateful logic, side effects, and component behavior. The hooks directory will contain custom hooks for data fetching, form handling, authentication state, local storage, window events, and more. Clean imports ensure hooks are easily discoverable and reusable across the application.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions.paths section

2. **Add hooks path alias**
   - Add new entry to paths object
   - Key: "@/hooks/*"
   - Value: ["hooks/*"]
   - Enables: `import { useAuth } from '@/hooks/useAuth'`

3. **Add root hooks alias**
   - Also add "@/hooks" entry
   - Map to ["hooks"]
   - Supports barrel exports from hooks/index.ts
   - Allows: `import { useAuth, useUser } from '@/hooks'`

### Hooks Directory Purpose

```
┌────────────────────────────────────────────────┐
│          Custom Hooks Directory                │
├────────────────────────────────────────────────┤
│ Contains:                                      │
│  • Custom React hooks                          │
│  • Reusable stateful logic                     │
│  • Side effect encapsulation                   │
│  • Shared component behavior                   │
│                                                │
│ Hook Categories:                               │
│  • Data fetching hooks                         │
│  • Form handling hooks                         │
│  • Authentication hooks                        │
│  • UI state hooks                              │
│  • Local storage hooks                         │
│  • Window/DOM hooks                            │
│  • Business logic hooks                        │
└────────────────────────────────────────────────┘
```

### Hooks Directory Structure

```
hooks/
├── auth/                        # Authentication hooks
│   ├── useAuth.ts              # @/hooks/auth/useAuth
│   ├── useUser.ts              # @/hooks/auth/useUser
│   ├── usePermissions.ts       # @/hooks/auth/usePermissions
│   └── useSession.ts           # @/hooks/auth/useSession
│
├── api/                        # API/Data fetching hooks
│   ├── useQuery.ts             # @/hooks/api/useQuery
│   ├── useMutation.ts          # @/hooks/api/useMutation
│   ├── useInfiniteScroll.ts    # @/hooks/api/useInfiniteScroll
│   └── usePolling.ts           # @/hooks/api/usePolling
│
├── forms/                      # Form handling hooks
│   ├── useForm.ts              # @/hooks/forms/useForm
│   ├── useFormValidation.ts    # @/hooks/forms/useFormValidation
│   └── useFieldArray.ts        # @/hooks/forms/useFieldArray
│
├── ui/                         # UI state hooks
│   ├── useModal.ts             # @/hooks/ui/useModal
│   ├── useToast.ts             # @/hooks/ui/useToast
│   ├── useTheme.ts             # @/hooks/ui/useTheme
│   └── useSidebar.ts           # @/hooks/ui/useSidebar
│
├── storage/                    # Storage hooks
│   ├── useLocalStorage.ts      # @/hooks/storage/useLocalStorage
│   ├── useSessionStorage.ts    # @/hooks/storage/useSessionStorage
│   └── useIndexedDB.ts         # @/hooks/storage/useIndexedDB
│
├── dom/                        # DOM/Window hooks
│   ├── useWindowSize.ts        # @/hooks/dom/useWindowSize
│   ├── useMediaQuery.ts        # @/hooks/dom/useMediaQuery
│   ├── useOnClickOutside.ts    # @/hooks/dom/useOnClickOutside
│   └── useKeyPress.ts          # @/hooks/dom/useKeyPress
│
└── business/                   # Business logic hooks
    ├── useCart.ts              # @/hooks/business/useCart
    ├── useInventory.ts         # @/hooks/business/useInventory
    ├── useInvoice.ts           # @/hooks/business/useInvoice
    └── usePayment.ts           # @/hooks/business/usePayment
```

### Hook Import Patterns

| Hook Type | Import Example | Purpose |
|-----------|----------------|---------|
| Auth hook | `import { useAuth } from '@/hooks/auth/useAuth'` | Get auth state |
| API hook | `import { useQuery } from '@/hooks/api/useQuery'` | Fetch data |
| Form hook | `import { useForm } from '@/hooks/forms/useForm'` | Handle forms |
| UI hook | `import { useModal } from '@/hooks/ui/useModal'` | Control modals |
| Storage hook | `import { useLocalStorage } from '@/hooks/storage/useLocalStorage'` | Persist data |

### Custom Hook Categories

```
Hook Type Breakdown
═══════════════════════════════════════

Data Hooks (20%)
  ├── API fetching
  ├── Cache management
  └── Real-time updates

State Hooks (25%)
  ├── UI state
  ├── Form state
  └── Application state

Effect Hooks (20%)
  ├── Side effects
  ├── Subscriptions
  └── Event listeners

Business Logic Hooks (20%)
  ├── Domain logic
  ├── Calculations
  └── Workflows

Utility Hooks (15%)
  ├── Browser APIs
  ├── Performance
  └── Debugging
```

### Hook Naming Conventions

| Pattern | Example | Purpose |
|---------|---------|---------|
| use + Noun | useAuth, useUser | State or resource |
| use + Adjective + Noun | useActiveTab | Specific state |
| use + Verb + Noun | useFetchProducts | Action-based |
| use + Entity + Action | useUserLogin | Domain action |

### Common Hook Patterns

#### Data Fetching Hook
```
Hook: useQuery
═══════════════════════════════════════
Purpose: Fetch data with loading/error states
Usage: const { data, loading, error } = useQuery(endpoint)

Import:
import { useQuery } from '@/hooks/api/useQuery'

Features:
  ✓ Loading state management
  ✓ Error handling
  ✓ Automatic retries
  ✓ Cache support
```

#### Form Management Hook
```
Hook: useForm
═══════════════════════════════════════
Purpose: Handle form state and validation
Usage: const { values, errors, handleSubmit } = useForm(schema)

Import:
import { useForm } from '@/hooks/forms/useForm'

Features:
  ✓ Field state tracking
  ✓ Validation
  ✓ Submit handling
  ✓ Reset functionality
```

#### Local Storage Hook
```
Hook: useLocalStorage
═══════════════════════════════════════
Purpose: Persist state to localStorage
Usage: const [value, setValue] = useLocalStorage('key', defaultValue)

Import:
import { useLocalStorage } from '@/hooks/storage/useLocalStorage'

Features:
  ✓ Automatic persistence
  ✓ Sync across tabs
  ✓ Type safety
  ✓ Error handling
```

### ERP-Specific Custom Hooks

| Hook | Purpose | Example Usage |
|------|---------|---------------|
| useInventory | Inventory management | Get stock levels, update quantities |
| useInvoice | Invoice operations | Create, update, print invoices |
| usePayment | Payment processing | Process payments, validate |
| useCart | Shopping cart | Add items, calculate totals |
| useTenant | Multi-tenancy | Get tenant info, switch context |

### Hook Dependencies Flow

```
Hook Dependency Chain
═══════════════════════════════════════

useAuth
  └──► useSession
         └──► useLocalStorage
                └──► Browser API

useInventory
  ├──► useQuery (fetch products)
  ├──► useMutation (update stock)
  └──► useToast (show notifications)

useInvoice
  ├──► useCart (get items)
  ├──► usePayment (process payment)
  └──► usePrinter (print receipt)
```

### Expected Outcome
- @/hooks/* path alias configured
- Clean imports for custom hooks
- Organized hook library
- Reusable stateful logic
- Improved code sharing

### Verification Checklist
- [ ] "@/hooks/*" added to paths
- [ ] Maps to ["hooks/*"]
- [ ] "@/hooks" entry also added
- [ ] Path alias follows naming conventions
- [ ] Ready for custom hooks

---

## Task 23: Set Up Path Aliases - Store

### Overview
Configure the @/store/* path alias for state management code including Redux stores, slices, actions, selectors, and middleware. The store directory centralizes all application state management, making it easy to import store-related code from anywhere in the application. This includes global state, feature-specific state, and state persistence configuration.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions.paths section

2. **Add store path alias**
   - Add new entry to paths object
   - Key: "@/store/*"
   - Value: ["store/*"]
   - Enables: `import { useAppSelector } from '@/store/hooks'`

3. **Add root store alias**
   - Also add "@/store" entry
   - Map to ["store"]
   - Allows: `import { store } from '@/store'`
   - Direct access to root store export

### Store Directory Purpose

```
┌────────────────────────────────────────────────┐
│          State Management Directory            │
├────────────────────────────────────────────────┤
│ Contains:                                      │
│  • Redux store configuration                   │
│  • State slices                                │
│  • Actions and reducers                        │
│  • Selectors                                   │
│  • Middleware                                  │
│  • Store types                                 │
│  • Persistence configuration                   │
│                                                │
│ State Categories:                              │
│  • Authentication state                        │
│  • User preferences                            │
│  • UI state (modals, sidebars)                 │
│  • Feature-specific state                      │
│  • Cache/normalized data                       │
└────────────────────────────────────────────────┘
```

### Store Directory Structure

```
store/
├── index.ts                     # Store export
│                                # @/store
│
├── store.ts                     # Store configuration
│                                # @/store/store
│
├── hooks.ts                     # Typed hooks
│                                # @/store/hooks
│
├── slices/                      # State slices
│   ├── auth/                    # Authentication state
│   │   ├── authSlice.ts        # @/store/slices/auth/authSlice
│   │   ├── authActions.ts      # @/store/slices/auth/authActions
│   │   └── authSelectors.ts    # @/store/slices/auth/authSelectors
│   │
│   ├── ui/                      # UI state
│   │   ├── modalSlice.ts       # @/store/slices/ui/modalSlice
│   │   ├── sidebarSlice.ts     # @/store/slices/ui/sidebarSlice
│   │   └── toastSlice.ts       # @/store/slices/ui/toastSlice
│   │
│   ├── inventory/               # Inventory state
│   │   ├── inventorySlice.ts   # @/store/slices/inventory/inventorySlice
│   │   └── inventorySelectors.ts
│   │
│   └── cart/                    # Shopping cart state
│       ├── cartSlice.ts        # @/store/slices/cart/cartSlice
│       └── cartSelectors.ts
│
├── middleware/                  # Custom middleware
│   ├── logger.ts               # @/store/middleware/logger
│   ├── errorHandler.ts         # @/store/middleware/errorHandler
│   └── api.ts                  # @/store/middleware/api
│
└── types/                       # Store types
    ├── RootState.ts            # @/store/types/RootState
    └── AppDispatch.ts          # @/store/types/AppDispatch
```

### Store Import Patterns

| Import Type | Example | Purpose |
|-------------|---------|---------|
| Root store | `import { store } from '@/store'` | Provider setup |
| Typed hooks | `import { useAppSelector } from '@/store/hooks'` | Type-safe hooks |
| Slice | `import { authSlice } from '@/store/slices/auth/authSlice'` | Reducer |
| Selector | `import { selectUser } from '@/store/slices/auth/authSelectors'` | Select state |
| Action | `import { login } from '@/store/slices/auth/authActions'` | Dispatch action |

### State Management Architecture

```
Redux Store Architecture
═══════════════════════════════════════

                  ┌──────────┐
                  │  Store   │
                  └────┬─────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼───┐     ┌────▼────┐   ┌────▼────┐
    │  Auth │     │   UI    │   │  Cart   │  ← Slices
    └───────┘     └─────────┘   └─────────┘
        │              │              │
    ┌───┴───┐     ┌────┴────┐   ┌────┴────┐
    │Reducer│     │ Reducer │   │ Reducer │
    └───────┘     └─────────┘   └─────────┘
        │              │              │
    ┌───┴───┐     ┌────┴────┐   ┌────┴────┐
    │Actions│     │ Actions │   │ Actions │
    └───────┘     └─────────┘   └─────────┘
        │              │              │
    ┌───┴────┐    ┌────┴─────┐  ┌────┴─────┐
    │Selectors    │Selectors │  │Selectors │
    └────────┘    └──────────┘  └──────────┘
```

### Typed Store Hooks

```
Custom Typed Hooks
═══════════════════════════════════════

store/hooks.ts exports:
  • useAppDispatch → Typed dispatch
  • useAppSelector → Typed selector

Benefits:
  ✓ Full TypeScript inference
  ✓ Autocomplete for state
  ✓ Type-safe dispatch
  ✓ Compile-time error checking

Usage:
  import { useAppSelector, useAppDispatch } from '@/store/hooks'
  
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
```

### State Slice Structure

| Slice | State Contained | Example Fields |
|-------|----------------|----------------|
| auth | Authentication | user, token, isAuthenticated, loading |
| ui | UI state | isModalOpen, sidebarCollapsed, activeTab |
| cart | Shopping cart | items, total, discount, tax |
| inventory | Product data | products, categories, stockLevels |
| tenant | Multi-tenancy | currentTenant, tenantSettings |

### Store Configuration Options

```
Store Configuration
═══════════════════════════════════════

Middleware Stack:
  1. Redux Thunk (async actions)
  2. Custom error handler
  3. API middleware
  4. Logger (dev only)

Dev Tools:
  ✓ Redux DevTools Extension
  ✓ Time-travel debugging
  ✓ State inspection

Persistence:
  • redux-persist for offline
  • localStorage integration
  • Selective persistence
```

### Selector Patterns

| Selector Type | Example | Purpose |
|--------------|---------|---------|
| Simple | `selectUser` | Direct state access |
| Computed | `selectCartTotal` | Derived state |
| Parameterized | `selectProductById(id)` | Dynamic selection |
| Reselect | Memoized selectors | Performance optimization |

### Action Creation Patterns

```
Action Types
═══════════════════════════════════════

Synchronous Actions:
  • Direct state updates
  • No side effects
  • Reducer handles immediately

Example:
  dispatch(setUser(userData))

Asynchronous Actions (Thunks):
  • API calls
  • Side effects
  • Multi-step operations

Example:
  dispatch(loginUser({ email, password }))
    → API call
    → Update state on success
    → Handle errors
```

### State Normalization

```
Normalized State Structure
═══════════════════════════════════════

Instead of nested arrays:
❌ products: [
    { id: 1, category: { id: 'a', name: 'Food' } },
    { id: 2, category: { id: 'a', name: 'Food' } }
  ]

Use normalized structure:
✅ products: {
    byId: {
      1: { id: 1, categoryId: 'a' },
      2: { id: 2, categoryId: 'a' }
    },
    allIds: [1, 2]
  }
  categories: {
    byId: { 'a': { id: 'a', name: 'Food' } },
    allIds: ['a']
  }

Benefits:
  ✓ No data duplication
  ✓ Easy updates
  ✓ Better performance
```

### ERP-Specific State Management

| State Domain | Slice | Key Responsibilities |
|-------------|-------|---------------------|
| Inventory | inventory | Products, stock levels, categories |
| POS | pos | Active sale, cart, payment |
| Invoicing | invoices | Invoice list, draft invoices |
| Customers | customers | Customer data, purchase history |
| Reports | reports | Report data, filters, date ranges |

### Expected Outcome
- @/store/* path alias configured
- Clean imports for state management
- Centralized state location
- Type-safe store access
- Redux best practices supported

### Verification Checklist
- [ ] "@/store/*" added to paths
- [ ] Maps to ["store/*"]
- [ ] "@/store" entry also added
- [ ] Path alias follows Redux conventions
- [ ] Ready for state management code

---

## Task 24: Set Up Path Aliases - Types

### Overview
Configure the @/types/* path alias for TypeScript type definitions, interfaces, enums, and type utilities. The types directory serves as the central location for all shared type definitions used across the application, including API response types, domain models, utility types, and type guards. Clean type imports improve code organization and ensure consistent typing throughout the codebase.

### Dependencies
- Task 17: Create tsconfig.json

### Instructions

1. **Open tsconfig.json file**
   - Navigate to frontend directory
   - Open existing tsconfig.json
   - Locate compilerOptions.paths section

2. **Add types path alias**
   - Add new entry to paths object
   - Key: "@/types/*"
   - Value: ["types/*"]
   - Enables: `import { User } from '@/types/models/User'`

3. **Add root types alias**
   - Also add "@/types" entry
   - Map to ["types"]
   - Supports: `import { User, Product } from '@/types'`
   - Barrel export from types/index.ts

4. **Verify path order**
   - Ensure all path aliases are defined
   - Maintain consistent ordering
   - Wildcard patterns before specific patterns
   - Alphabetical order recommended

### Types Directory Purpose

```
┌────────────────────────────────────────────────┐
│          Type Definitions Directory            │
├────────────────────────────────────────────────┤
│ Contains:                                      │
│  • TypeScript interfaces                       │
│  • Type aliases                                │
│  • Enums                                       │
│  • Type guards                                 │
│  • Generic type utilities                      │
│  • API response types                          │
│  • Domain models                               │
│                                                │
│ Type Categories:                               │
│  • Entity/Model types                          │
│  • API request/response types                  │
│  • Form/validation types                       │
│  • State/Redux types                           │
│  • Component prop types                        │
│  • Utility types                               │
└────────────────────────────────────────────────┘
```

### Types Directory Structure

```
types/
├── index.ts                     # Barrel export
│                                # @/types
│
├── models/                      # Domain models
│   ├── User.ts                 # @/types/models/User
│   ├── Product.ts              # @/types/models/Product
│   ├── Invoice.ts              # @/types/models/Invoice
│   ├── Customer.ts             # @/types/models/Customer
│   └── Tenant.ts               # @/types/models/Tenant
│
├── api/                        # API types
│   ├── auth.ts                 # @/types/api/auth
│   ├── products.ts             # @/types/api/products
│   ├── invoices.ts             # @/types/api/invoices
│   └── common.ts               # @/types/api/common
│
├── forms/                      # Form types
│   ├── LoginForm.ts            # @/types/forms/LoginForm
│   ├── ProductForm.ts          # @/types/forms/ProductForm
│   └── InvoiceForm.ts          # @/types/forms/InvoiceForm
│
├── ui/                         # UI component types
│   ├── Button.ts               # @/types/ui/Button
│   ├── Modal.ts                # @/types/ui/Modal
│   └── Table.ts                # @/types/ui/Table
│
├── enums/                      # Enums
│   ├── UserRole.ts             # @/types/enums/UserRole
│   ├── PaymentMethod.ts        # @/types/enums/PaymentMethod
│   └── OrderStatus.ts          # @/types/enums/OrderStatus
│
├── guards/                     # Type guards
│   ├── isUser.ts               # @/types/guards/isUser
│   ├── isProduct.ts            # @/types/guards/isProduct
│   └── isApiError.ts           # @/types/guards/isApiError
│
└── utils/                      # Utility types
    ├── Nullable.ts             # @/types/utils/Nullable
    ├── WithId.ts               # @/types/utils/WithId
    └── DeepPartial.ts          # @/types/utils/DeepPartial
```

### Type Import Patterns

| Type Category | Import Example | Purpose |
|--------------|----------------|---------|
| Model | `import { User } from '@/types/models/User'` | Domain entity |
| API | `import { LoginRequest } from '@/types/api/auth'` | API contract |
| Form | `import { ProductFormData } from '@/types/forms/ProductForm'` | Form data |
| Enum | `import { UserRole } from '@/types/enums/UserRole'` | Enum values |
| Guard | `import { isUser } from '@/types/guards/isUser'` | Type checking |
| Utility | `import { Nullable } from '@/types/utils/Nullable'` | Type helper |

### Type Organization Principles

```
Type Organization Strategy
═══════════════════════════════════════

By Domain (Models):
  ├── User types
  ├── Product types
  ├── Invoice types
  └── Customer types

By Purpose (API):
  ├── Request types
  ├── Response types
  └── Error types

By Feature (Forms):
  ├── Form data types
  ├── Validation types
  └── Submit types

By Abstraction (Utils):
  ├── Generic types
  ├── Conditional types
  └── Mapped types
```

### Common Type Patterns

#### Entity/Model Types
```
Domain Model Type
═══════════════════════════════════════
types/models/User.ts

Exports:
  • User (full entity)
  • UserId (type alias)
  • UserProfile (subset)
  • UserPreferences (nested)

Usage:
  import { User, UserProfile } from '@/types/models/User'
  
  const user: User = { ... }
  const profile: UserProfile = { ... }
```

#### API Request/Response Types
```
API Contract Types
═══════════════════════════════════════
types/api/auth.ts

Exports:
  • LoginRequest (request body)
  • LoginResponse (success response)
  • AuthError (error response)

Usage:
  import { LoginRequest, LoginResponse } from '@/types/api/auth'
  
  async function login(data: LoginRequest): Promise<LoginResponse> {
    // API call
  }
```

#### Enum Types
```
Enumeration Types
═══════════════════════════════════════
types/enums/UserRole.ts

Exports:
  enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CASHIER = 'cashier'
  }

Usage:
  import { UserRole } from '@/types/enums/UserRole'
  
  const role: UserRole = UserRole.ADMIN
```

### Type vs Interface Guidelines

| Use Type When | Use Interface When |
|---------------|-------------------|
| Union types needed | Defining object shape |
| Intersection types | OOP-style inheritance |
| Mapped types | Declaration merging |
| Conditional types | Public API contracts |
| Primitive aliases | Class implementation |

### ERP Domain Types

| Domain | Key Types | Example |
|--------|-----------|---------|
| Inventory | Product, Category, Stock | Product with price, SKU |
| Sales | Invoice, LineItem, Payment | Invoice with items array |
| Customers | Customer, Address, Contact | Customer with billing info |
| Users | User, Role, Permission | User with role assignments |
| Tenants | Tenant, Settings | Tenant configuration |

### Type Guard Pattern

```
Type Guard Implementation
═══════════════════════════════════════
types/guards/isUser.ts

Purpose: Runtime type checking

Implementation:
  export function isUser(value: unknown): value is User {
    return (
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      'email' in value &&
      'name' in value
    )
  }

Usage:
  import { isUser } from '@/types/guards/isUser'
  
  if (isUser(data)) {
    data.email  // TypeScript knows it's User
  }
```

### Utility Type Examples

| Utility Type | Purpose | Example Usage |
|-------------|---------|---------------|
| Nullable<T> | Allow null/undefined | `Nullable<User>` |
| WithId<T> | Add id field | `WithId<Product>` |
| DeepPartial<T> | Nested partial | `DeepPartial<Invoice>` |
| Prettify<T> | Flatten types | Display complex types |
| AsyncData<T> | Loading state | API response wrapper |

### API Response Type Pattern

```
Standardized API Response
═══════════════════════════════════════
types/api/common.ts

Base Types:
  interface ApiResponse<T> {
    data: T
    message: string
    success: boolean
  }
  
  interface ApiError {
    message: string
    code: string
    details?: unknown
  }

Usage:
  type UserResponse = ApiResponse<User>
  type ProductListResponse = ApiResponse<Product[]>
```

### Form Data Type Pattern

```
Form Data Types
═══════════════════════════════════════
types/forms/ProductForm.ts

Separation of Concerns:
  • ProductFormData (user input)
  • ProductFormErrors (validation)
  • ProductFormState (UI state)

Example:
  interface ProductFormData {
    name: string
    price: number
    category: string
  }
  
  interface ProductFormErrors {
    name?: string
    price?: string
    category?: string
  }
```

### Expected Outcome
- @/types/* path alias configured
- Centralized type definitions
- Clean type imports
- Organized type library
- Consistent typing across application

### Verification Checklist
- [ ] "@/types/*" added to paths
- [ ] Maps to ["types/*"]
- [ ] "@/types" entry also added
- [ ] All path aliases configured (components, lib, hooks, store, types)
- [ ] Path configuration complete for this document

---

## Summary

This document established the TypeScript configuration foundation and primary path aliases:

### Completed Configuration
- ✅ tsconfig.json created with Next.js compatibility
- ✅ Strict mode enabled (all 9 strict options)
- ✅ Module resolution configured (bundler mode)
- ✅ Path alias: @/components/* for UI components
- ✅ Path alias: @/lib/* for utilities and helpers
- ✅ Path alias: @/hooks/* for custom React hooks
- ✅ Path alias: @/store/* for state management
- ✅ Path alias: @/types/* for type definitions

### Key Achievements
1. **Type Safety** - Maximum strictness for enterprise code
2. **Modern Bundling** - Optimized for Next.js/Turbopack
3. **Clean Imports** - Absolute imports eliminate relative paths
4. **Code Organization** - Clear structure for different code types
5. **Developer Experience** - IDE autocomplete and navigation

### Path Aliases Configured
```
@/components/* → components/*  (UI components)
@/lib/*        → lib/*         (utilities, helpers)
@/hooks/*      → hooks/*       (custom hooks)
@/store/*      → store/*       (state management)
@/types/*      → types/*       (type definitions)
```

### Next Steps
Proceed to [02_Tasks-25-30_Additional-Aliases-Verification.md](02_Tasks-25-30_Additional-Aliases-Verification.md) to configure remaining path aliases (services, constants, styles), include/exclude patterns, tsconfig.node.json, and verify the complete TypeScript configuration.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Configuration Progress:** 5 of 8 path aliases configured
