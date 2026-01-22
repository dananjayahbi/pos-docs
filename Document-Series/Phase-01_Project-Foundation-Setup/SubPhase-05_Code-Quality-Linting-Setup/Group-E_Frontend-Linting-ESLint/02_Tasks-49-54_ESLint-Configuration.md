# Tasks 49-54: ESLint Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** E - Frontend Linting - ESLint  
> **Document:** 02 of 03  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-43-48_ESLint-Installation.md](01_Tasks-43-48_ESLint-Installation.md)
- **→ Next Document:** [03_Tasks-55-58_ESLint-Verification.md](03_Tasks-55-58_ESLint-Verification.md)

---

## Document Overview

This document covers creating and configuring .eslintrc.json with all rule sets.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create .eslintrc.json | Medium |
| 50 | Configure Extends | Simple |
| 51 | Configure Parser Options | Simple |
| 52 | Configure React Rules | Medium |
| 53 | Configure TypeScript Rules | Medium |
| 54 | Configure Import Rules | Medium |

---

## Task 49: Create .eslintrc.json

### Overview
Create ESLint configuration file in frontend directory.

### Dependencies
- Task 44: ESLint plugins installed

### Instructions

1. **Create .eslintrc.json file**
   - In frontend/ directory

2. **Add base structure**
   - Root and env settings

3. **Document purpose**
   - Comments in README (JSON doesn't allow comments)

### File Location

```
frontend/
└── .eslintrc.json
```

### Initial .eslintrc.json

```json
{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  }
}
```

### Configuration Options

| Option | Purpose |
|--------|---------|
| $schema | VS Code IntelliSense |
| root | Stop looking in parent dirs |
| env | Define global variables |

### Environment Settings

| Env | Variables Available |
|-----|---------------------|
| browser | window, document, etc. |
| es2022 | ES2022 globals |
| node | require, process, etc. |

### Alternative: eslintrc.cjs

If using ES modules, can use eslintrc.cjs for comments:
```javascript
module.exports = {
  // Comments allowed here
  root: true,
};
```

### Expected Outcome
- .eslintrc.json created
- Base structure ready

### Verification Checklist
- [ ] File created in frontend/
- [ ] root = true set
- [ ] env configured

---

## Task 50: Configure Extends

### Overview
Configure ESLint extends for inherited rule sets.

### Dependencies
- Task 49: .eslintrc.json exists

### Instructions

1. **Add extends array**
   - Next.js config first

2. **Add TypeScript config**
   - Recommended rules

3. **Order matters**
   - Later configs override earlier

### Configuration Addition

```json
{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ]
}
```

### Extends Order

| Order | Config | Purpose |
|-------|--------|---------|
| 1 | next/core-web-vitals | Next.js + performance |
| 2 | @typescript-eslint/recommended | TS rules |
| 3 | react/recommended | React rules |
| 4 | react-hooks/recommended | Hooks rules |
| 5 | import/recommended | Import rules |
| 6 | import/typescript | TS import support |

### What Each Config Provides

| Config | Rules |
|--------|-------|
| next/core-web-vitals | Image, link, script optimization |
| @typescript-eslint/recommended | Type-safe code |
| react/recommended | React best practices |
| react-hooks/recommended | Hooks rules |
| import/recommended | Import ordering |

### Expected Outcome
- Extends configured
- All rule sets active

### Verification Checklist
- [ ] next/core-web-vitals first
- [ ] TypeScript config included
- [ ] React configs included
- [ ] Import configs included

---

## Task 51: Configure Parser Options

### Overview
Configure TypeScript parser options for type-aware rules.

### Dependencies
- Task 49: .eslintrc.json exists

### Instructions

1. **Set parser**
   - TypeScript parser

2. **Configure parserOptions**
   - ECMAScript version

3. **Set project path**
   - For type-aware rules

### Configuration Addition

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  }
}
```

### Parser Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| ecmaVersion | "latest" | Latest JavaScript features |
| sourceType | "module" | ES modules |
| ecmaFeatures.jsx | true | JSX support |
| project | "./tsconfig.json" | Type-aware linting |

### Type-Aware Linting

With `project` set, these rules become available:
- no-floating-promises
- no-misused-promises
- await-thenable
- no-unnecessary-type-assertion

### Performance Note

Type-aware linting is slower. For large projects, consider:
- Limiting to specific directories
- Using separate configs for CI

### Expected Outcome
- TypeScript parser configured
- Type-aware rules available

### Verification Checklist
- [ ] Parser set to @typescript-eslint/parser
- [ ] ecmaVersion = latest
- [ ] jsx enabled
- [ ] project points to tsconfig.json

---

## Task 52: Configure React Rules

### Overview
Configure React-specific ESLint rules.

### Dependencies
- Task 49: .eslintrc.json exists

### Instructions

1. **Add settings for React**
   - Auto-detect version

2. **Configure React rules**
   - Disable unnecessary rules

3. **Configure JSX rules**
   - Next.js specific

### Configuration Addition

```json
{
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-key": "error",
    "react/no-unescaped-entities": "warn",
    "react/display-name": "warn",
    "react/jsx-no-target-blank": "error"
  }
}
```

### Rules Explained

| Rule | Setting | Reason |
|------|---------|--------|
| react-in-jsx-scope | off | Not needed in React 17+ |
| prop-types | off | Using TypeScript |
| jsx-uses-react | off | Not needed in React 17+ |
| jsx-key | error | Essential for lists |
| no-unescaped-entities | warn | Accessibility |
| display-name | warn | Debugging help |
| jsx-no-target-blank | error | Security |

### React 17+ Automatic JSX

In React 17+, no need to import React for JSX:
```typescript
// Before React 17
import React from 'react';

// React 17+ (not needed)
// JSX transform handles it
```

### Expected Outcome
- React settings configured
- Unnecessary rules disabled

### Verification Checklist
- [ ] React version auto-detect
- [ ] react-in-jsx-scope off
- [ ] prop-types off
- [ ] jsx-key error

---

## Task 53: Configure TypeScript Rules

### Overview
Configure TypeScript-specific ESLint rules.

### Dependencies
- Task 49: .eslintrc.json exists

### Instructions

1. **Configure TypeScript rules**
   - Enhanced defaults

2. **Override ESLint rules**
   - Use TS versions

3. **Add strict rules**
   - As appropriate

### Configuration Addition

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { "prefer": "type-imports" }
    ]
  }
}
```

### Rules Explained

| Rule | Setting | Reason |
|------|---------|--------|
| no-unused-vars | error with ignore pattern | Allow _prefix for intentional |
| no-explicit-any | warn | Discourage any |
| explicit-function-return-type | off | Inferred is fine |
| no-empty-interface | warn | Usually indicates issue |
| consistent-type-imports | error | Import type separately |

### Underscore Pattern

```typescript
// Allowed with argsIgnorePattern: "^_"
function handleEvent(_event: Event) {
  // _event is intentionally unused
}
```

### Type Imports

```typescript
// Prefer
import type { User } from './types';

// Over
import { User } from './types';
```

### Expected Outcome
- TypeScript rules configured
- Sensible defaults

### Verification Checklist
- [ ] no-unused-vars with ignore pattern
- [ ] no-explicit-any as warning
- [ ] consistent-type-imports enabled
- [ ] Overly strict rules disabled

---

## Task 54: Configure Import Rules

### Overview
Configure import ordering and organization rules.

### Dependencies
- Task 49: .eslintrc.json exists

### Instructions

1. **Configure import settings**
   - TypeScript resolver

2. **Add import order rules**
   - Consistent ordering

3. **Configure grouping**
   - External vs internal

### Configuration Addition

```json
{
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type"
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "next/**",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/no-duplicates": "error",
    "import/no-cycle": "warn",
    "import/no-unresolved": "error"
  }
}
```

### Import Order Groups

| Group | Example |
|-------|---------|
| builtin | `import fs from 'fs'` |
| external | `import React from 'react'` |
| internal | `import { Button } from '@/components'` |
| parent | `import { util } from '../utils'` |
| sibling | `import { helper } from './helper'` |
| index | `import { x } from './index'` |
| type | `import type { User } from './types'` |

### Import Example

```typescript
// builtin
import path from 'path';

// external (react first)
import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// internal (@/ alias)
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

// parent
import { formatDate } from '../utils';

// sibling
import { styles } from './styles';

// type
import type { User } from '@/types';
```

### Expected Outcome
- Import resolver configured
- Import ordering rules set

### Verification Checklist
- [ ] TypeScript resolver configured
- [ ] Import order groups defined
- [ ] React/Next first in external
- [ ] Newlines between groups

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Create .eslintrc.json | Configuration file |
| 50 | Configure Extends | Rule sets |
| 51 | Configure Parser Options | TypeScript parser |
| 52 | Configure React Rules | React settings |
| 53 | Configure TypeScript Rules | TS rules |
| 54 | Configure Import Rules | Import ordering |

### Complete .eslintrc.json

```json
{
  "$schema": "https://json.schemastore.org/eslintrc",
  "root": true,
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-key": "error",
    "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": ["error", {"prefer": "type-imports"}],
    "import/order": ["error", {"groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"], "newlines-between": "always"}],
    "import/no-duplicates": "error"
  }
}
```

### Next Steps
Proceed to [03_Tasks-55-58_ESLint-Verification.md](03_Tasks-55-58_ESLint-Verification.md) for .eslintignore and verification.

---

## Notes for AI Agents

1. **JSON format:** No comments allowed in .eslintrc.json
2. **Order matters:** Extends order affects rule priority
3. **React 17+:** Disable react-in-jsx-scope
4. **TypeScript:** Use TS versions of rules
5. **Import order:** React and Next first
6. **Type imports:** Prefer separate type imports
