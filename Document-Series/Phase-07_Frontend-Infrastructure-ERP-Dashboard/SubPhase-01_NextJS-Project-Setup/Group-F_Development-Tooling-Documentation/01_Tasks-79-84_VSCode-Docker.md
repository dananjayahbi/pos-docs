# Tasks 79-84: VS Code Configuration & Docker Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** F - Development Tooling & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-88_Documentation-Verification.md](02_Tasks-85-88_Documentation-Verification.md)

---

## Document Overview

This document covers the development tooling configuration for the Next.js frontend project, including VS Code workspace settings for consistent development experience, debugging configurations for efficient troubleshooting, and Docker containerization for both development and production environments. These configurations ensure standardized development practices, streamline debugging workflows, and enable consistent deployments across different environments.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create VS Code Settings | Low | 15 min |
| 80 | Create VS Code Extensions | Low | 10 min |
| 81 | Create Debug Configuration | Medium | 20 min |
| 82 | Create Docker Development File | Medium | 25 min |
| 83 | Create Docker Production File | Medium | 30 min |
| 84 | Create Docker Compose Entry | Low | 15 min |

---

## Task 79: Create VS Code Settings

### Overview
Create the VS Code workspace settings file to standardize editor configuration across the development team. This ensures consistent code formatting, linting behavior, TypeScript preferences, and editor features for all developers working on the frontend project.

### Dependencies
- Task 16: Create package.json (ESLint and Prettier must be configured)
- Frontend project structure exists
- ESLint and Prettier installed

### Instructions

1. **Create .vscode directory**
   - Navigate to `frontend/` directory
   - Create `.vscode/` directory if it doesn't exist
   - This directory will contain all VS Code workspace configurations

2. **Create settings.json file**
   - Create file at `frontend/.vscode/settings.json`
   - This file will contain workspace-specific settings

3. **Configure format-on-save behavior**
   - Enable automatic formatting when files are saved
   - Prevents formatting inconsistencies
   - Reduces manual formatting effort

4. **Set default formatter to Prettier**
   - Specify Prettier as the default formatting tool
   - Ensures consistent formatting across all file types
   - Overrides any user-level formatter settings

5. **Configure ESLint auto-fix on save**
   - Enable automatic ESLint fixes when saving files
   - Fixes common linting issues automatically
   - Includes import sorting and spacing fixes

6. **Set TypeScript import preferences**
   - Configure TypeScript to prefer non-relative imports
   - Encourages use of path aliases (e.g., @/components)
   - Improves import statement readability

7. **Configure file associations**
   - Associate .tsx files with typescriptreact language
   - Associate .ts files with typescript language
   - Ensures proper syntax highlighting and IntelliSense

8. **Set up editor rulers**
   - Add visual ruler at 80 and 120 characters
   - Helps maintain readable line lengths
   - Follows common coding standards

9. **Configure exclude patterns**
   - Exclude .next/ directory from file explorer
   - Exclude node_modules/ from search
   - Exclude build artifacts from workspace

10. **Set TypeScript validation options**
    - Enable TypeScript validation
    - Show compilation errors in editor
    - Enable IntelliSense for type checking

### VS Code Settings Structure

```
┌─────────────────────────────────────────────────┐
│         VS Code Workspace Settings              │
├─────────────────────────────────────────────────┤
│ Formatting:                                     │
│  • Format on save enabled                       │
│  • Default formatter: Prettier                  │
│  • ESLint auto-fix on save                      │
│                                                 │
│ TypeScript:                                     │
│  • Import module specifier: non-relative        │
│  • Validation enabled                           │
│  • IntelliSense enabled                         │
│                                                 │
│ Editor:                                         │
│  • Rulers at 80, 120 characters                 │
│  • Tab size: 2 spaces                           │
│  • Trim trailing whitespace                     │
│                                                 │
│ Files:                                          │
│  • Exclude .next/ from explorer                 │
│  • Exclude node_modules/ from search            │
│  • Auto-save: onFocusChange                     │
└─────────────────────────────────────────────────┘
```

### Settings Categories

| Category | Settings | Purpose |
|----------|----------|---------|
| **Formatting** | formatOnSave, defaultFormatter, ESLint fixes | Consistent code style |
| **TypeScript** | importModuleSpecifier, validation | Better imports and type safety |
| **Editor** | rulers, tabSize, trimTrailingWhitespace | Code readability |
| **Files** | exclude patterns, autoSave | Clean workspace |
| **Tailwind** | CSS IntelliSense, class sorting | Tailwind support |

### Format-on-Save Behavior

```
Developer Flow with Format-on-Save
═══════════════════════════════════

1. Developer writes code:
   const   x=   1;
   function foo(){
     return "bar"
   }

2. Developer saves file (Ctrl+S):
   ↓
   [VS Code triggers]
   ↓
   [Prettier formats code]
   ↓
   [ESLint fixes issues]
   ↓

3. Code after save:
   const x = 1;
   
   function foo() {
     return 'bar';
   }
```

### Import Module Specifier Behavior

#### Without Non-Relative Setting
```
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/utils/format';
import type { User } from '../../../types/user';
```

#### With Non-Relative Setting (Recommended)
```
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/format';
import type { User } from '@/types/user';
```

### Editor Rulers Visualization

```
╔════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                    ║
║  const ProductCard = ({ product }: ProductCardProps) => {                         ║
║    return (                                                                        ║
║      <div className="rounded-lg border p-4">                                       ║
║        <h3 className="font-semibold">{product.name}</h3>                           ║
║        <p className="text-sm text-gray-600">{product.description}</p>              ║
║      </div>                                                                        ║
║    );                                                                              ║
║  };                                                                                ║
║                                                     ↑                              ║
║                                                 80 chars                           ║
║                                                                               ↑    ║
║                                                                          120 chars ║
╚════════════════════════════════════════════════════════════════════════════════════╝
```

### File Exclusion Benefits

| Excluded Path | Reason | Benefit |
|--------------|--------|---------|
| `.next/` | Build output directory | Cleaner file explorer |
| `node_modules/` | Dependency packages | Faster search operations |
| `out/` | Static export directory | Avoid confusion with source |
| `*.log` | Log files | Reduce clutter |
| `.DS_Store` | macOS metadata | Cross-platform consistency |

### TypeScript IntelliSense Features

```
Benefits of Proper TypeScript Settings
═════════════════════════════════════

1. Auto-completion:
   user.█
        └─► name (string)
        └─► email (string)
        └─► role (UserRole)

2. Type checking:
   const age: number = "25";  ← Error shown in editor
                        ~~~~ Type 'string' not assignable to 'number'

3. Quick fixes:
   import { Button } from '@/components/ui/Button';
          ~~~~~~~~ Missing import
          [Quick Fix] → Add import from...

4. Hover information:
   const formatPrice(amount: number, currency: string): string
         ^^^^^^^^^^^
         Hover shows: Format a number as currency
```

### ESLint Auto-Fix Examples

#### Before Save
```typescript
import { useState,useEffect } from 'react'
import {Button} from '@/components/ui/Button'
import type {User} from '@/types/user'

export default function Profile( {user}:{ user:User}) {
  const [count,setCount]=useState(0)
  
  useEffect(()=>{
    console.log(count)
  },[count])
}
```

#### After Save (Auto-Fixed)
```typescript
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';

import type { User } from '@/types/user';

export default function Profile({ user }: { user: User }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);
}
```

### Settings Impact on Team Workflow

```
Team Consistency Flow
════════════════════

Developer A                Developer B
    │                          │
    ├─► Writes code            ├─► Writes code
    ├─► Saves file             ├─► Saves file
    │   (auto-format)          │   (auto-format)
    ├─► Commits                ├─► Commits
    │                          │
    └──────────┬───────────────┘
               │
               ▼
          Same formatting
          No merge conflicts
          Consistent codebase
```

### Expected Outcome
- Consistent code formatting across team
- Automatic code quality improvements
- Reduced manual formatting effort
- Better TypeScript development experience
- Cleaner workspace interface

### Verification Checklist
- [ ] `.vscode/` directory created in `frontend/`
- [ ] `settings.json` file exists
- [ ] Format on save enabled
- [ ] Prettier set as default formatter
- [ ] ESLint auto-fix configured
- [ ] TypeScript import preferences set
- [ ] Editor rulers configured
- [ ] File exclusions added
- [ ] TypeScript validation enabled
- [ ] Tailwind CSS IntelliSense settings added

---

## Task 80: Create VS Code Extensions

### Overview
Create the VS Code extensions recommendations file to ensure all developers have the necessary extensions installed for optimal development experience. This file lists required and recommended extensions that provide code formatting, linting, IntelliSense, and other development tools specific to the Next.js and Tailwind CSS stack.

### Dependencies
- Task 79: Create VS Code Settings

### Instructions

1. **Create extensions.json file**
   - Create file at `frontend/.vscode/extensions.json`
   - This file contains workspace extension recommendations

2. **Add recommendations array**
   - Define array of recommended extension IDs
   - Use official extension identifiers from VS Code marketplace

3. **Add Prettier extension**
   - Extension ID: `esbenp.prettier-vscode`
   - Provides Prettier code formatting
   - Required for format-on-save functionality

4. **Add ESLint extension**
   - Extension ID: `dbaeumer.vscode-eslint`
   - Integrates ESLint into VS Code
   - Shows linting errors inline

5. **Add Tailwind CSS IntelliSense**
   - Extension ID: `bradlc.vscode-tailwindcss`
   - Provides autocomplete for Tailwind classes
   - Shows color previews in CSS classes
   - Critical for Tailwind development

6. **Add PostCSS Language Support**
   - Extension ID: `csstools.postcss`
   - Syntax highlighting for PostCSS
   - Required for Tailwind @apply directive

7. **Add Error Lens (Optional)**
   - Extension ID: `usernamehidden.errorlens`
   - Shows errors inline in code
   - Improves error visibility

8. **Add Path IntelliSense (Optional)**
   - Extension ID: `christian-kohler.path-intellisense`
   - Autocomplete for file paths
   - Helps with imports

9. **Add TypeScript extensions (Optional)**
   - Extension ID: `pmneo.tsimporter`
   - Automatically adds imports
   - Improves TypeScript workflow

10. **Add unwanted recommendations list**
    - Define extensions to explicitly not recommend
    - Prevents conflicts with workspace setup

### VS Code Extensions Structure

```
┌─────────────────────────────────────────────────┐
│         VS Code Extension Recommendations       │
├─────────────────────────────────────────────────┤
│ Required Extensions:                            │
│  • Prettier (esbenp.prettier-vscode)            │
│  • ESLint (dbaeumer.vscode-eslint)              │
│  • Tailwind IntelliSense (bradlc...)            │
│  • PostCSS (csstools.postcss)                   │
│                                                 │
│ Optional Extensions:                            │
│  • Error Lens (usernamehidden.errorlens)        │
│  • Path IntelliSense (christian-kohler...)      │
│  • TS Importer (pmneo.tsimporter)               │
│                                                 │
│ Unwanted:                                       │
│  • Extensions that conflict with setup          │
└─────────────────────────────────────────────────┘
```

### Extension Categories

| Category | Extensions | Purpose |
|----------|-----------|---------|
| **Code Quality** | Prettier, ESLint | Formatting and linting |
| **Framework Support** | Tailwind IntelliSense, PostCSS | CSS framework tools |
| **Developer Experience** | Error Lens, Path IntelliSense | Productivity enhancements |
| **TypeScript** | TS Importer | Type-safe imports |

### Extension Feature Matrix

| Extension | Auto-complete | Syntax Highlighting | Error Detection | Quick Fixes |
|-----------|--------------|-------------------|-----------------|-------------|
| Prettier | ❌ | ❌ | ❌ | ✅ (format) |
| ESLint | ❌ | ❌ | ✅ | ✅ |
| Tailwind IntelliSense | ✅ | ✅ | ✅ | ✅ |
| PostCSS | ❌ | ✅ | ❌ | ❌ |
| Error Lens | ❌ | ❌ | ✅ (inline) | ❌ |
| Path IntelliSense | ✅ | ❌ | ❌ | ❌ |

### Tailwind CSS IntelliSense Features

```
Tailwind IntelliSense Capabilities
═══════════════════════════════════

1. Class Autocomplete:
   <div className="flex █
                       └─► flex-row
                       └─► flex-col
                       └─► flex-wrap
                       └─► flex-nowrap

2. Color Preview:
   <div className="bg-blue-500█">
                            └─► [Shows blue color swatch]

3. Hover Information:
   <div className="p-4█">
                      └─► padding: 1rem; /* 16px */

4. Syntax Highlighting:
   <div className="bg-[#FF5733] hover:bg-[#FF0000]">
                   ^^^^^^^^^^^        ^^^^^^^^^^^
                   Custom colors highlighted
```

### ESLint Extension Integration

```
ESLint Features in VS Code
═══════════════════════════

1. Inline Errors:
   const x = "unused variable";
         ~ 'x' is assigned but never used

2. Quick Fixes:
   import { Button } from '@/components/ui/button';
                                              ~~~~~~
   [Quick Fix] → Change to 'Button' (correct case)

3. Auto-fix on Save:
   - Removes unused imports
   - Sorts imports
   - Fixes spacing issues
   - Corrects semicolon usage

4. Problem Panel Integration:
   PROBLEMS (3)
   ├─ Warning: React Hook useEffect missing dependency (Line 45)
   ├─ Error: 'user' is not defined (Line 23)
   └─ Info: Prefer const instead of let (Line 12)
```

### Prettier Extension Behavior

```
Prettier Formatting Workflow
════════════════════════════

Before Formatting:
  const obj={name:"John",age:30,email:"john@example.com"};

After Formatting (Ctrl+S):
  const obj = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };

Applies to:
  • JavaScript/TypeScript
  • JSON files
  • CSS/SCSS
  • Markdown
  • YAML
```

### Error Lens Visualization

```
Code with Error Lens
═══════════════════

Without Error Lens:
  const result = calculateTotal();
  // Error appears in Problems panel only

With Error Lens:
  const result = calculateTotal(); ❌ Cannot find name 'calculateTotal'
  
  // Error appears inline, more visible
```

### Path IntelliSense Example

```
Import Path Autocomplete
════════════════════════

Type:
  import { Button } from '@/compo█

Suggestions appear:
  @/components/
  @/components/ui/
  @/components/forms/

Select:
  @/components/ui/

Continue typing:
  import { Button } from '@/components/ui/Bu█

Suggestions:
  @/components/ui/Button
  @/components/ui/ButtonGroup
```

### Extension Installation Prompt

```
When Developer Opens Workspace
═══════════════════════════════

VS Code shows notification:
┌─────────────────────────────────────────────┐
│ This workspace has extension                │
│ recommendations.                            │
│                                             │
│ [Show Recommendations] [Install All]        │
└─────────────────────────────────────────────┘

Clicking "Install All":
  ✓ Installing esbenp.prettier-vscode...
  ✓ Installing dbaeumer.vscode-eslint...
  ✓ Installing bradlc.vscode-tailwindcss...
  ✓ Installing csstools.postcss...
  ✓ All recommended extensions installed!
```

### Required vs Optional Extensions

| Extension | Status | Impact if Missing |
|----------|--------|------------------|
| Prettier | Required | No auto-formatting |
| ESLint | Required | No lint error display |
| Tailwind IntelliSense | Required | No Tailwind autocomplete |
| PostCSS | Required | Syntax highlighting issues |
| Error Lens | Optional | Less visible errors |
| Path IntelliSense | Optional | Manual path typing |
| TS Importer | Optional | Manual import management |

### Extension Conflict Prevention

```
Unwanted Extensions List
═══════════════════════

Example conflicts to prevent:
  • Other formatters (Beautify, Format Code)
  • Alternative linters
  • Conflicting CSS IntelliSense
  • Duplicate TypeScript tools

Purpose:
  - Prevent multiple formatters fighting
  - Avoid duplicate functionality
  - Ensure consistent behavior
```

### Team Onboarding Impact

```
New Developer Onboarding Flow
═════════════════════════════

Day 1:
  ├─► Clone repository
  ├─► Open in VS Code
  ├─► VS Code prompts: Install recommended extensions
  ├─► Click "Install All"
  ├─► Extensions installed automatically
  └─► Ready to code with full tooling

Without extensions.json:
  ├─► Developer doesn't know which extensions to install
  ├─► Missing Tailwind autocomplete
  ├─► Different formatter settings
  └─► Inconsistent experience across team
```

### Expected Outcome
- Consistent development environment across team
- Automatic extension recommendations
- Reduced setup time for new developers
- Full Tailwind and TypeScript support
- Improved code quality through tooling

### Verification Checklist
- [ ] `extensions.json` file created in `.vscode/`
- [ ] Prettier extension recommended
- [ ] ESLint extension recommended
- [ ] Tailwind IntelliSense recommended
- [ ] PostCSS extension recommended
- [ ] Optional extensions added
- [ ] Unwanted extensions list configured
- [ ] All extension IDs are valid
- [ ] File follows JSON schema for extension recommendations

---

## Task 81: Create Debug Configuration

### Overview
Create the VS Code debug configurations for Next.js development. This enables breakpoint debugging for both server-side (SSR) and client-side code, streamlining the development and troubleshooting process. Proper debug configurations allow developers to step through code execution, inspect variables, and understand application flow.

### Dependencies
- Task 79: Create VS Code Settings
- Next.js project running on port 3000
- Node.js debugger understanding

### Instructions

1. **Create launch.json file**
   - Create file at `frontend/.vscode/launch.json`
   - This file contains debug configurations

2. **Add configurations array**
   - Define array of debug configuration objects
   - Each configuration targets different debugging scenarios

3. **Create "Next.js: debug server-side" configuration**
   - Configuration name: "Next.js: debug server-side"
   - Type: node (Node.js debugger)
   - Request: launch
   - Targets Server Components and API Routes

4. **Set server-side runtime executable**
   - Runtime executable: node
   - Runtime arguments for Next.js dev server
   - Include --inspect flag for debugging

5. **Configure server-side program path**
   - Point to node_modules/.bin/next
   - Use dev command for development server
   - Enable source map support

6. **Create "Next.js: debug client-side" configuration**
   - Configuration name: "Next.js: debug client-side"
   - Type: chrome (Chrome debugger)
   - Request: launch
   - Targets Client Components and browser code

7. **Set client-side URL**
   - URL: http://localhost:3000
   - Matches Next.js dev server port
   - Automatically opens browser

8. **Configure webRoot path**
   - Set webRoot to ${workspaceFolder}
   - Maps source files to running code
   - Enables breakpoints in source files

9. **Create "Next.js: debug full stack" configuration**
   - Configuration name: "Next.js: debug full stack"
   - Type: compound (multiple configurations)
   - Runs both server and client debugging simultaneously

10. **Configure source maps**
    - Enable source map support
    - Configure path mappings for aliases
    - Map @/* to src/* or app/* as needed

11. **Add skipFiles configuration**
    - Skip node_modules during debugging
    - Skip internal Next.js files
    - Focus on application code

12. **Set up auto-attach**
    - Configure restart behavior
    - Set console type for output
    - Enable smart stepping

### Debug Configuration Structure

```
┌─────────────────────────────────────────────────┐
│         VS Code Debug Configurations            │
├─────────────────────────────────────────────────┤
│ Server-Side Debugging:                          │
│  • Type: node                                   │
│  • Targets: Server Components, API Routes       │
│  • Executable: node with Next.js                │
│                                                 │
│ Client-Side Debugging:                          │
│  • Type: chrome                                 │
│  • Targets: Client Components, Browser code     │
│  • URL: http://localhost:3000                   │
│                                                 │
│ Full Stack Debugging:                           │
│  • Type: compound                               │
│  • Combines: Server + Client                    │
│  • Debugs: Entire application                   │
└─────────────────────────────────────────────────┘
```

### Debug Configuration Types

| Configuration | Type | Purpose | Use Case |
|--------------|------|---------|----------|
| Server-Side | node | Debug SSR, API routes | Server Components, backend logic |
| Client-Side | chrome | Debug browser code | Client Components, interactions |
| Full Stack | compound | Debug both simultaneously | Full application debugging |

### Next.js Code Execution Flow

```
Next.js Request Lifecycle
═════════════════════════

Browser Request
    │
    ▼
┌─────────────────────────┐
│   Server Components     │  ← Debug with node
│   (app/page.tsx)        │
│   - data fetching       │
│   - initial render      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    API Routes           │  ← Debug with node
│    (app/api/*)          │
│    - business logic     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   HTML sent to browser  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Client Components     │  ← Debug with chrome
│   (use client)          │
│   - interactivity       │
│   - event handlers      │
└─────────────────────────┘
```

### Server-Side Debugging Workflow

```
Debugging Server Component
═══════════════════════════

File: app/products/page.tsx
────────────────────────────
export default async function ProductsPage() {
  ● const products = await fetchProducts();  // Set breakpoint here
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

Debugging Steps:
1. Set breakpoint on line with ●
2. Start "Next.js: debug server-side"
3. Navigate to /products in browser
4. Execution pauses at breakpoint
5. Inspect 'products' variable
6. Step through fetchProducts() call
7. Continue execution
```

### Client-Side Debugging Workflow

```
Debugging Client Component
═══════════════════════════

File: components/AddToCartButton.tsx
────────────────────────────────────
'use client';

export function AddToCartButton({ productId }: Props) {
  const handleClick = () => {
    ● console.log('Adding to cart:', productId);  // Set breakpoint
    addToCart(productId);
  };

  return <button onClick={handleClick}>Add to Cart</button>;
}

Debugging Steps:
1. Set breakpoint on line with ●
2. Start "Next.js: debug client-side"
3. Browser opens automatically
4. Click "Add to Cart" button
5. Execution pauses at breakpoint
6. Inspect productId value
7. Step into addToCart function
```

### Full Stack Debugging Scenario

```
Full Stack Debugging Example
═══════════════════════════

Scenario: Debug product purchase flow

Server Side (API Route):
  app/api/checkout/route.ts
  ● export async function POST(req: Request) {
      const { cartId } = await req.json();
      const order = await createOrder(cartId);
      return Response.json(order);
    }

Client Side (Component):
  components/CheckoutButton.tsx
  ● const handleCheckout = async () => {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ cartId }),
      });
      const order = await response.json();
    };

Full Stack Debug Flow:
1. Start "Next.js: debug full stack"
2. Set breakpoint in CheckoutButton (client)
3. Set breakpoint in checkout route (server)
4. Click checkout button in browser
5. Pause at client breakpoint first
6. Step through fetch call
7. Automatically pause at server breakpoint
8. Inspect server-side order creation
9. Return to client to see response handling
```

### Breakpoint Types

| Type | Symbol | Use Case | Example |
|------|--------|----------|---------|
| Line Breakpoint | ● | Pause at specific line | Stop at function entry |
| Conditional | ◐ | Pause if condition true | `user.role === 'admin'` |
| Logpoint | ◇ | Log without pausing | Log variable values |
| Exception | ⚡ | Pause on errors | Catch thrown exceptions |

### Debug Console Usage

```
Debug Console Features
════════════════════════

While paused at breakpoint:

1. Inspect Variables:
   > products
   [
     { id: 1, name: 'Product A', price: 100 },
     { id: 2, name: 'Product B', price: 200 }
   ]

2. Evaluate Expressions:
   > products.length
   2
   
   > products.map(p => p.name)
   ['Product A', 'Product B']

3. Modify Variables:
   > products[0].price = 150
   150
   
   > products[0]
   { id: 1, name: 'Product A', price: 150 }

4. Call Functions:
   > formatCurrency(products[0].price)
   'Rs. 150.00'
```

### Source Map Configuration

```
Source Map Mapping
═══════════════════

TypeScript Source:       Compiled JavaScript:
app/page.tsx      ←map→  .next/server/app/page.js

import { Button } from '@/components/ui/Button';
                         ^^^^^^^^^^^^^^^^^^^^^^
                         Resolved via path mapping

Path Mapping Configuration:
  "@/*" → "app/*"
  "@/components/*" → "app/components/*"
  "@/lib/*" → "lib/*"

Enables:
  • Breakpoints in .tsx files
  • Not compiled .js files
  • Accurate line numbers
```

### Skip Files Configuration

```
Skip Files During Debugging
════════════════════════════

Skipped Patterns:
  • node_modules/**
  • .next/**
  • webpack://**
  • <node_internals>/**

Benefit:
When stepping through code:
  
  Your Code:
    ● const data = await fetchProducts();
  
  [Step Into]
  
  Skips:
    ✗ node_modules/next/dist/...
    ✗ node_modules/@babel/...
  
  Goes directly to:
    ● export async function fetchProducts() {
        // Your implementation
      }
```

### Debug Launch Process

```
Starting Debug Session
═══════════════════════

1. Click Debug icon in VS Code sidebar
   │
2. Select configuration from dropdown
   └─► "Next.js: debug server-side"
   │
3. VS Code starts:
   ├─► Next.js dev server
   ├─► Attaches Node.js debugger
   └─► Waits for connections
   │
4. Terminal shows:
   ├─► ready - started server on 0.0.0.0:3000
   ├─► Debugger attached.
   └─► Waiting for debugger to connect...
   │
5. Set breakpoints in code
   │
6. Trigger code execution
   │
7. Debugger pauses at breakpoint
   └─► Variables available for inspection
```

### Common Debugging Scenarios

| Scenario | Configuration | Target Code |
|----------|--------------|-------------|
| API not returning data | Server-Side | API Routes |
| Component not rendering | Client-Side | Client Components |
| Data fetching issue | Server-Side | Server Components |
| Button click not working | Client-Side | Event handlers |
| Form submission error | Full Stack | Form + API |
| Authentication flow | Full Stack | Auth middleware + client |

### Debugging Best Practices

```
Effective Debugging Strategy
════════════════════════════

1. Start Broad:
   ├─► Identify which layer has issue
   │   (Server vs Client)
   └─► Choose appropriate debug config

2. Use Conditional Breakpoints:
   ├─► Instead of: Hit breakpoint 100 times
   └─► Use: Break only when productId === 42

3. Leverage Logpoints:
   ├─► Don't pause execution
   └─► Just log values to console

4. Use Call Stack:
   ├─► See function call chain
   └─► Understand how you got here

5. Watch Expressions:
   ├─► Monitor variable changes
   └─► Track complex expressions
```

### Debug Configuration Benefits

```
Development Efficiency
════════════════════════

Without Debug Config:
  ├─► Add console.log statements
  ├─► Restart server
  ├─► Check console output
  ├─► Add more console.logs
  ├─► Restart again
  └─► Time wasted: 15-30 minutes

With Debug Config:
  ├─► Set breakpoint
  ├─► Start debugger
  ├─► Pause at breakpoint
  ├─► Inspect all variables immediately
  └─► Time spent: 2-5 minutes

Time saved per debugging session: ~20 minutes
```

### Expected Outcome
- Full debugging capability for Next.js app
- Breakpoint support in both client and server code
- Efficient troubleshooting workflow
- Variable inspection and call stack analysis
- Reduced debugging time

### Verification Checklist
- [ ] `launch.json` file created in `.vscode/`
- [ ] Server-side debug configuration added
- [ ] Client-side debug configuration added
- [ ] Full stack debug configuration added
- [ ] Source map configuration correct
- [ ] Skip files pattern configured
- [ ] Path mappings for @ aliases set up
- [ ] Port number matches dev server (3000)
- [ ] Test server-side breakpoint works
- [ ] Test client-side breakpoint works

---

## Task 82: Create Docker Development File

### Overview
Create the Dockerfile for the development environment. This container provides a consistent development setup across different machines, includes all necessary dependencies, and supports hot-reloading for rapid development. The development Dockerfile prioritizes developer experience over optimization.

### Dependencies
- Task 16: Create package.json
- Docker installed on development machines
- Understanding of Node.js containers

### Instructions

1. **Create Dockerfile**
   - Create file at `frontend/Dockerfile` (no extension)
   - This is the development Dockerfile

2. **Choose base image**
   - Use `node:20-alpine` as base image
   - Alpine Linux for smaller image size
   - Node.js 20 LTS for stability
   - Include comment explaining choice

3. **Set working directory**
   - Set WORKDIR to `/app`
   - All subsequent commands execute here
   - Container's working directory

4. **Enable Corepack**
   - Run `corepack enable` command
   - Enables pnpm package manager
   - Required for pnpm usage

5. **Copy package files first**
   - Copy `package.json` and `pnpm-lock.yaml`
   - Separate layer for dependency installation
   - Enables Docker layer caching

6. **Install dependencies**
   - Run `pnpm install` command
   - Install all dependencies including devDependencies
   - Development needs full dependency tree

7. **Copy application source**
   - Copy entire application directory
   - Use `.dockerignore` to exclude unnecessary files
   - Includes source code, configs, etc.

8. **Expose development port**
   - Expose port 3000
   - Next.js development server default port
   - Allows host to access container

9. **Set default command**
   - CMD: `pnpm dev`
   - Starts Next.js in development mode
   - Enables hot-reloading

10. **Add development optimizations**
    - No multi-stage build (not needed for dev)
    - Keep all development tools
    - Preserve source maps

11. **Configure environment variables**
    - Set NODE_ENV to development
    - Add any dev-specific variables
    - Document required variables

12. **Add Docker comments**
    - Comment each significant section
    - Explain purpose of each instruction
    - Aid team understanding

### Development Dockerfile Structure

```
┌─────────────────────────────────────────────────┐
│         Development Dockerfile                  │
├─────────────────────────────────────────────────┤
│ Base Image:                                     │
│  • node:20-alpine                               │
│  • Small footprint                              │
│  • Long-term support                            │
│                                                 │
│ Dependencies:                                   │
│  • Corepack enabled                             │
│  • pnpm for package management                  │
│  • All dev dependencies included                │
│                                                 │
│ Source Code:                                    │
│  • Full application source                      │
│  • Configuration files                          │
│  • Development tools                            │
│                                                 │
│ Execution:                                      │
│  • Port 3000 exposed                            │
│  • pnpm dev command                             │
│  • Hot-reloading enabled                        │
└─────────────────────────────────────────────────┘
```

### Dockerfile Layer Caching Strategy

```
Docker Layer Caching
═══════════════════

Layer 1: FROM node:20-alpine
  └─► Cached unless base image changes

Layer 2: WORKDIR /app
  └─► Cached (rarely changes)

Layer 3: RUN corepack enable
  └─► Cached (rarely changes)

Layer 4: COPY package.json pnpm-lock.yaml
  └─► Cached until dependencies change

Layer 5: RUN pnpm install
  └─► Cached if Layer 4 unchanged
  └─► REBUILDS if dependencies change

Layer 6: COPY . .
  └─► Rebuilds on any source change
  └─► Doesn't affect dependency layer

Benefits:
  • Fast rebuilds for code changes
  • Dependencies only reinstalled when needed
  • Typical rebuild: 5-10 seconds (vs 2-3 minutes)
```

### Docker Build Process

```
Building Development Image
═══════════════════════════

Command:
  $ docker build -t frontend:dev .

Process:
  Step 1/8 : FROM node:20-alpine
   ---> Pulling image... ✓
  
  Step 2/8 : WORKDIR /app
   ---> Using cache ✓
  
  Step 3/8 : RUN corepack enable
   ---> Using cache ✓
  
  Step 4/8 : COPY package.json pnpm-lock.yaml
   ---> Using cache ✓
  
  Step 5/8 : RUN pnpm install
   ---> Using cache ✓
  
  Step 6/8 : COPY . .
   ---> 3a2b4c5d6e7f ✓
  
  Step 7/8 : EXPOSE 3000
   ---> Running... ✓
  
  Step 8/8 : CMD ["pnpm", "dev"]
   ---> Running... ✓
  
Successfully built 3a2b4c5d6e7f
Successfully tagged frontend:dev
```

### Volume Mounting Strategy

```
Development Volume Mounting
════════════════════════════

Container Structure with Volumes:

Host Machine                Container
─────────────────          ────────────
frontend/                   /app/
  ├─► src/          ──────► src/         (mounted)
  ├─► public/       ──────► public/      (mounted)
  ├─► app/          ──────► app/         (mounted)
  ├─► package.json  ──────► package.json (mounted)
  └─► node_modules/         node_modules/ (volume)
                            ├─► from image
                            └─► not mounted

Volume Mount Benefits:
  ✓ Code changes reflect immediately
  ✓ No rebuild needed for edits
  ✓ node_modules preserved in container
  ✓ Hot-reloading works seamlessly
```

### Hot-Reloading Mechanism

```
Hot-Reloading Flow
═══════════════════

1. Developer edits file:
   app/page.tsx
   
2. File watcher detects change:
   [Next.js Dev Server]
   ├─► File changed: app/page.tsx
   └─► Recompiling...
   
3. Next.js recompiles:
   ├─► Fast Refresh triggered
   ├─► Re-renders affected components
   └─► Preserves component state
   
4. Browser updates automatically:
   ├─► WebSocket connection
   ├─► Receives updated module
   └─► Hot replaces code
   
5. Change visible immediately:
   └─► No manual refresh needed

Time from save to browser update: < 1 second
```

### Development Container Features

| Feature | Purpose | Benefit |
|---------|---------|---------|
| Alpine Linux | Minimal OS | Smaller image size |
| Corepack | Package manager enablement | Native pnpm support |
| Volume mounts | Live code updates | No rebuild for changes |
| Port 3000 | Dev server access | Access from host browser |
| Source maps | Debug capability | Accurate stack traces |

### Development vs Production Dockerfile

| Aspect | Development | Production |
|--------|-------------|------------|
| Image size | Larger (~500MB) | Smaller (~100MB) |
| Dependencies | All (dev + prod) | Production only |
| Build stages | Single stage | Multi-stage |
| Source code | Mounted volume | Copied into image |
| Command | `pnpm dev` | `pnpm start` |
| Optimization | None | Minification, etc. |
| Hot-reload | Enabled | Disabled |

### Node.js Alpine Image Benefits

```
Why node:20-alpine?
═══════════════════

Comparison:
  node:20 (Debian-based)
    └─► Size: ~950MB
    └─► Contains: Full OS utilities
    └─► Use case: Complex requirements

  node:20-alpine (Alpine-based)
    └─► Size: ~170MB (5.5x smaller)
    └─► Contains: Minimal OS
    └─► Use case: Standard Node.js apps

Additional Benefits:
  ✓ Faster downloads
  ✓ Reduced storage
  ✓ Smaller attack surface
  ✓ Still includes npm/node
```

### .dockerignore Integration

```
.dockerignore File (Create alongside Dockerfile)
═══════════════════════════════════════════════

node_modules/      # Installed in container
.next/             # Build output
.git/              # Version control
.vscode/           # Editor config
*.log              # Log files
.env.local         # Local environment
dist/              # Build artifacts
coverage/          # Test coverage
.DS_Store          # macOS metadata

Purpose:
  • Reduce COPY . . operation size
  • Faster builds
  • Prevent overwriting container node_modules
  • Exclude unnecessary files
```

### Container Resource Usage

```
Development Container Resources
═══════════════════════════════

Typical Resource Usage:
  CPU: 0.5-1.0 cores (idle/active)
  Memory: 500MB-1GB
  Disk: ~500MB (image + volumes)
  Network: WebSocket for hot-reload

During Heavy Development:
  CPU: 1-2 cores (during recompilation)
  Memory: 1-2GB (with large node_modules)

Resource Limits (Optional):
  --memory="2g"
  --cpus="2.0"
```

### Development Workflow with Docker

```
Daily Development Flow
═════════════════════

Morning:
  1. $ docker-compose up frontend
     ├─► Starts development container
     ├─► Mounts source code
     └─► Runs pnpm dev
  
  2. Open browser: http://localhost:3000
     └─► Next.js app running

During Development:
  3. Edit app/page.tsx
     └─► Hot-reload updates browser instantly
  
  4. Add new dependency:
     $ docker-compose exec frontend pnpm add new-package
     └─► Install inside container

Evening:
  5. $ docker-compose down
     └─► Stop container, preserve volumes

Next Day:
  6. $ docker-compose up
     └─► Start again, all dependencies intact
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Slow hot-reload | node_modules mounted | Use anonymous volume for node_modules |
| ENOSPC error | File watcher limit | Increase fs.inotify.max_user_watches |
| Port already in use | Port 3000 taken | Change port mapping or stop process |
| Module not found | Cache issue | Rebuild container |
| Permission errors | User ID mismatch | Add USER directive or fix permissions |

### Expected Outcome
- Functional development container
- Hot-reloading enabled
- Consistent environment across team
- Fast rebuild times with layer caching
- Easy onboarding for new developers

### Verification Checklist
- [ ] `Dockerfile` created in `frontend/`
- [ ] node:20-alpine base image used
- [ ] WORKDIR set to /app
- [ ] Corepack enabled for pnpm
- [ ] Package files copied before source
- [ ] Dependencies installed with pnpm
- [ ] Port 3000 exposed
- [ ] CMD set to pnpm dev
- [ ] Comments added for clarity
- [ ] .dockerignore file created

---

## Task 83: Create Docker Production File

### Overview
Create the production-optimized Dockerfile using multi-stage builds. This container focuses on minimal image size, security, and performance for deployment environments. The production build excludes development dependencies, runs with a non-root user, and uses Next.js standalone output mode for optimal runtime performance.

### Dependencies
- Task 82: Create Docker Development File
- Understanding of multi-stage builds
- Next.js standalone output mode configured

### Instructions

1. **Create Dockerfile.prod**
   - Create file at `frontend/Dockerfile.prod`
   - Separate from development Dockerfile
   - Production-specific optimizations

2. **Define dependencies stage**
   - Stage name: "deps"
   - Base: node:20-alpine
   - Purpose: Install all dependencies

3. **Copy package files in deps stage**
   - Copy package.json and pnpm-lock.yaml
   - Enable corepack
   - Install dependencies with pnpm

4. **Define builder stage**
   - Stage name: "builder"
   - Base: node:20-alpine
   - Purpose: Build Next.js application

5. **Copy dependencies from deps stage**
   - Copy node_modules from deps stage
   - Avoids reinstalling dependencies
   - Leverages multi-stage efficiency

6. **Copy source code in builder**
   - Copy all application source
   - Includes app/, public/, configs
   - Ready for build process

7. **Run production build**
   - Execute `pnpm build`
   - Generates .next/ directory
   - Creates standalone output

8. **Define runner stage**
   - Stage name: "runner"
   - Base: node:20-alpine
   - Purpose: Run production application

9. **Set production environment**
   - ENV NODE_ENV=production
   - Optimizes Node.js behavior
   - Disables development features

10. **Create non-root user**
    - Add group and user "nextjs"
    - UID/GID 1001
    - Security best practice

11. **Copy production files**
    - Copy public/ directory
    - Copy standalone output from builder
    - Copy static files

12. **Set ownership to nextjs user**
    - Chown files to nextjs:nextjs
    - Ensures proper permissions
    - Security hardening

13. **Switch to non-root user**
    - USER nextjs
    - All subsequent commands run as nextjs
    - Prevents privilege escalation

14. **Expose production port**
    - EXPOSE 3000
    - Standard Next.js production port
    - Can be remapped by orchestrator

15. **Set production command**
    - CMD: `node server.js`
    - Runs standalone server
    - Optimized production execution

### Production Dockerfile Structure

```
┌─────────────────────────────────────────────────┐
│         Production Dockerfile (Multi-Stage)     │
├─────────────────────────────────────────────────┤
│ Stage 1: deps                                   │
│  • Install all dependencies                     │
│  • Both prod and dev (for build)                │
│  • Cached separately                            │
│                                                 │
│ Stage 2: builder                                │
│  • Copy dependencies from stage 1               │
│  • Build Next.js application                    │
│  • Generate standalone output                   │
│                                                 │
│ Stage 3: runner                                 │
│  • Copy only production files                   │
│  • No source code                               │
│  • No dev dependencies                          │
│  • Run as non-root user                         │
│  • Minimal final image                          │
└─────────────────────────────────────────────────┘
```

### Multi-Stage Build Benefits

```
Multi-Stage Build Efficiency
════════════════════════════

Single-Stage Dockerfile:
┌──────────────────────────────┐
│ - node:20-alpine             │
│ - All dependencies (500MB)   │
│ - Source code (50MB)         │
│ - Build artifacts (200MB)    │
│ - Dev tools (100MB)          │
│ - node_modules (400MB)       │
├──────────────────────────────┤
│ Final Image: ~1.2GB          │
└──────────────────────────────┘

Multi-Stage Dockerfile:
┌──────────────────────────────┐
│ Stage 1: deps (discarded)    │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Stage 2: builder (discarded) │
└──────────────────────────────┘
┌──────────────────────────────┐
│ Stage 3: runner (kept)       │
│ - node:20-alpine (40MB)      │
│ - Production deps (80MB)     │
│ - Standalone app (30MB)      │
│ - Static files (10MB)        │
├──────────────────────────────┤
│ Final Image: ~160MB          │
└──────────────────────────────┘

Size Reduction: 87% smaller
```

### Next.js Standalone Output Mode

```
Standalone Output Structure
═══════════════════════════

After pnpm build with output: 'standalone':

.next/
├── standalone/
│   ├── server.js              ← Entry point
│   ├── package.json
│   └── node_modules/          ← Minimal prod dependencies
│       └── (only runtime deps)
├── static/
│   └── (static assets)
└── (other build files)

Benefits:
  ✓ Self-contained deployment
  ✓ Minimal node_modules
  ✓ No need for full install
  ✓ Faster container startup
  ✓ Smaller image size

Configuration (next.config.js):
  module.exports = {
    output: 'standalone',
  };
```

### Production Build Process

```
Multi-Stage Build Execution
═══════════════════════════

$ docker build -f Dockerfile.prod -t frontend:prod .

Stage 1: deps
─────────────
  [1/4] FROM node:20-alpine
  [2/4] COPY package.json pnpm-lock.yaml
  [3/4] RUN corepack enable
  [4/4] RUN pnpm install
  ✓ Dependencies installed (cached)

Stage 2: builder
────────────────
  [1/5] FROM node:20-alpine
  [2/5] COPY --from=deps /app/node_modules
  [3/5] COPY . .
  [4/5] RUN pnpm build
        ├─► Compiling TypeScript
        ├─► Optimizing components
        ├─► Generating static pages
        └─► Creating standalone output
  [5/5] Build complete
  ✓ Application built

Stage 3: runner
───────────────
  [1/8] FROM node:20-alpine
  [2/8] ENV NODE_ENV=production
  [3/8] RUN addgroup --system --gid 1001 nextjs
  [4/8] RUN adduser --system --uid 1001 nextjs
  [5/8] COPY --from=builder --chown=nextjs:nextjs
  [6/8] USER nextjs
  [7/8] EXPOSE 3000
  [8/8] CMD ["node", "server.js"]
  ✓ Production image ready

Final Image: frontend:prod (160MB)
```

### Security: Non-Root User

```
Running as Non-Root User
════════════════════════

Why Non-Root?
  • Principle of least privilege
  • Limits damage from vulnerabilities
  • Container escape protection
  • Industry best practice

Without Non-Root:
  Container runs as root (UID 0)
  ├─► If attacker exploits app
  ├─► They have root access in container
  ├─► Potential host system access
  └─► High security risk

With Non-Root (nextjs user):
  Container runs as nextjs (UID 1001)
  ├─► If attacker exploits app
  ├─► Limited to nextjs user permissions
  ├─► Cannot modify system files
  └─► Reduced security risk

Implementation:
  RUN addgroup --system --gid 1001 nextjs
  RUN adduser --system --uid 1001 nextjs
  USER nextjs
  
Verification:
  $ docker exec container whoami
  nextjs  ← Not root!
```

### File Copying Strategy

```
Selective File Copying
═══════════════════════

From Builder to Runner:

Copy 1: Public Directory
  COPY --from=builder /app/public ./public
  └─► Static assets (images, fonts, etc.)

Copy 2: Standalone Output
  COPY --from=builder /app/.next/standalone ./
  ├─► server.js (entry point)
  ├─► package.json
  └─► node_modules/ (minimal)

Copy 3: Static Build Output
  COPY --from=builder /app/.next/static ./.next/static
  └─► Compiled client-side code

What's NOT Copied:
  ✗ Source code (app/, components/, lib/)
  ✗ Development dependencies
  ✗ TypeScript files
  ✗ Test files
  ✗ .git directory
  ✗ Build cache

Result: Only production-ready files in image
```

### Production vs Development Comparison

| Aspect | Development (Task 82) | Production (Task 83) |
|--------|----------------------|---------------------|
| **Dockerfile** | Dockerfile | Dockerfile.prod |
| **Stages** | Single stage | Multi-stage (3) |
| **Base Image** | node:20-alpine | node:20-alpine |
| **Dependencies** | All (dev + prod) | Production only |
| **Source Code** | Mounted as volume | Copied and built |
| **Command** | `pnpm dev` | `node server.js` |
| **Hot Reload** | Enabled | Disabled |
| **Image Size** | ~500MB | ~160MB |
| **Build Time** | Fast (no build) | Slower (full build) |
| **User** | root | nextjs (UID 1001) |
| **NODE_ENV** | development | production |
| **Use Case** | Local development | Staging/Production |

### Production Container Runtime

```
Production Container Execution
═══════════════════════════════

Container Start:
  $ docker run -p 3000:3000 frontend:prod
  
Internal Process:
  ├─► Container starts as nextjs user
  ├─► Executes: node server.js
  ├─► Loads: .next/standalone/
  ├─► Binds: 0.0.0.0:3000
  └─► Ready to serve requests

Server Output:
  ┌─────────────────────────────────────┐
  │ ready - started server on 0.0.0.0:  │
  │        3000, url: http://localhost:  │
  │        3000                          │
  │                                     │
  │ info  - Loaded env from .env.local  │
  └─────────────────────────────────────┘

Performance Characteristics:
  • Cold start: <2 seconds
  • Memory usage: 100-200MB
  • CPU: Minimal (0.1-0.3 cores)
  • Request latency: <50ms (cached)
```

### Environment Variables for Production

```
Production Environment Configuration
═══════════════════════════════════

Required Variables:
  NODE_ENV=production              (set in Dockerfile)
  NEXT_PUBLIC_API_URL             (runtime)
  NEXT_PUBLIC_WS_URL              (runtime)

Optional Variables:
  DATABASE_URL                    (if direct DB access)
  REDIS_URL                       (if caching)
  SECRET_KEY                      (for sessions)

Passing to Container:
  • Via docker run:
    docker run -e NEXT_PUBLIC_API_URL=https://api.example.com

  • Via .env file:
    docker run --env-file .env.production

  • Via docker-compose:
    environment:
      - NEXT_PUBLIC_API_URL=https://api.example.com

Build-time vs Runtime:
  Build-time: Used during `pnpm build`
  Runtime: Used when container runs
```

### Image Size Optimization

```
Image Size Breakdown
═══════════════════

Base node:20-alpine: 40MB
├─► Node.js runtime
└─► Basic Alpine utilities

Production dependencies: 80MB
├─► next (core framework)
├─► react, react-dom
└─► Other runtime deps

Standalone output: 30MB
├─► .next/standalone/
├─► server.js
└─► Built pages

Static assets: 10MB
├─► .next/static/
└─► public/ files

═══════════════════════
Total: ~160MB

Optimization Techniques Used:
  ✓ Multi-stage build
  ✓ Alpine base image
  ✓ Standalone output mode
  ✓ Production dependencies only
  ✓ No source code included
```

### Build Caching Strategy

```
Docker Build Cache Layers
═════════════════════════

Stage: deps
  Layer 1: FROM node:20-alpine
    └─► Cached indefinitely
  
  Layer 2: COPY package.json pnpm-lock.yaml
    └─► Cached until dependencies change
  
  Layer 3: RUN pnpm install
    └─► Cached if Layer 2 unchanged
    └─► Slowest layer (~2-3 minutes)

Stage: builder
  Layer 4: COPY --from=deps node_modules
    └─► Cached if deps stage unchanged
  
  Layer 5: COPY . .
    └─► Invalidated on any source change
  
  Layer 6: RUN pnpm build
    └─► Rebuilds when Layer 5 invalidated
    └─► Takes 1-2 minutes

Stage: runner
  Layer 7-11: File copies
    └─► Fast, rebuilds when builder changes

Optimization:
  • Dependencies cached separately
  • Only rebuild when needed
  • Typical rebuild: 1-2 minutes
  • Full rebuild: 4-5 minutes
```

### Deployment Scenarios

| Environment | Image | Configuration | Scaling |
|------------|-------|---------------|---------|
| **Local Testing** | frontend:prod | .env.local | Single container |
| **Staging** | frontend:prod | .env.staging | 1-2 replicas |
| **Production** | frontend:prod | .env.production | 3+ replicas |
| **Load Testing** | frontend:prod | .env.staging | 10+ replicas |

### Health Check Configuration

```
Health Check (Add to Dockerfile.prod)
═══════════════════════════════════

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node healthcheck.js || exit 1

Purpose:
  • Verify container is responding
  • Enable auto-restart on failure
  • Support load balancer checks

healthcheck.js:
  ├─► HTTP request to localhost:3000
  ├─► Check response status
  └─► Exit 0 (healthy) or 1 (unhealthy)

Container States:
  starting (0-5s)  → Startup grace period
  healthy          → Responding correctly
  unhealthy        → Failed health checks
  (restart)        → Auto-restart if unhealthy
```

### Expected Outcome
- Production-optimized Docker image
- Multi-stage build for minimal size
- Non-root user for security
- Standalone output mode enabled
- Fast startup time
- Deployment-ready container

### Verification Checklist
- [ ] `Dockerfile.prod` created in `frontend/`
- [ ] Three build stages defined (deps, builder, runner)
- [ ] node:20-alpine used as base
- [ ] Dependencies stage installs packages
- [ ] Builder stage runs pnpm build
- [ ] Runner stage copies only production files
- [ ] Non-root user (nextjs) created and used
- [ ] NODE_ENV set to production
- [ ] Standalone output copied correctly
- [ ] Port 3000 exposed
- [ ] CMD runs node server.js
- [ ] Image builds successfully
- [ ] Image size < 200MB

---

## Task 84: Create Docker Compose Entry

### Overview
Add the frontend service to the docker-compose.yml file, integrating the Next.js frontend with the existing backend services. This configuration enables the entire application stack to run together, handles service dependencies, manages environment variables, and configures volume mounts for development workflow.

### Dependencies
- Task 82: Create Docker Development File
- docker-compose.yml exists in project root
- Backend services defined in docker-compose

### Instructions

1. **Open docker-compose.yml**
   - Navigate to project root
   - Open existing docker-compose.yml
   - Will add frontend service to existing services

2. **Add frontend service entry**
   - Add `frontend:` key under `services:`
   - Maintain proper YAML indentation
   - Place after backend service

3. **Configure build context**
   - Set `build.context` to `./frontend`
   - Points to frontend directory
   - Contains Dockerfile

4. **Specify Dockerfile**
   - Set `build.dockerfile` to `Dockerfile`
   - Uses development Dockerfile
   - Not Dockerfile.prod

5. **Configure container name**
   - Set `container_name` to `erp_frontend_dev`
   - Helps identify container
   - Consistent naming convention

6. **Map ports**
   - Map host port 3000 to container port 3000
   - Format: `"3000:3000"`
   - Allows browser access to dev server

7. **Configure volume mounts**
   - Mount `./frontend:/app` for live code updates
   - Mount `/app/node_modules` as anonymous volume
   - Mount `/app/.next` as anonymous volume

8. **Set environment variables**
   - Add `NODE_ENV=development`
   - Add `NEXT_PUBLIC_API_URL=http://backend:8000`
   - Add other NEXT_PUBLIC_* variables as needed

9. **Configure service dependencies**
   - Add `depends_on:` section
   - List `backend` service
   - Ensures backend starts first

10. **Add restart policy**
    - Set `restart: unless-stopped`
    - Auto-restart on failure
    - Survives system reboots

11. **Configure networks**
    - Add to default network
    - Same network as backend
    - Enables inter-service communication

12. **Add health check**
    - Test: curl localhost:3000
    - Interval: 30 seconds
    - Ensures service is responsive

### Docker Compose Frontend Entry Structure

```
┌─────────────────────────────────────────────────┐
│         Docker Compose Frontend Service         │
├─────────────────────────────────────────────────┤
│ Build Configuration:                            │
│  • Context: ./frontend                          │
│  • Dockerfile: Dockerfile (development)         │
│  • Container name: erp_frontend_dev             │
│                                                 │
│ Port Mapping:                                   │
│  • Host 3000 → Container 3000                   │
│                                                 │
│ Volume Mounts:                                  │
│  • ./frontend:/app (source code)                │
│  • /app/node_modules (anonymous)                │
│  • /app/.next (anonymous)                       │
│                                                 │
│ Environment:                                    │
│  • NODE_ENV=development                         │
│  • NEXT_PUBLIC_API_URL=http://backend:8000      │
│                                                 │
│ Dependencies:                                   │
│  • backend (starts first)                       │
│                                                 │
│ Network:                                        │
│  • default (shared with backend)                │
└─────────────────────────────────────────────────┘
```

### Volume Mount Strategy

```
Volume Mount Configuration
═══════════════════════════

1. Source Code Mount:
   ./frontend:/app
   
   Host                     Container
   ──────────────────      ────────────
   frontend/               /app/
   ├─► app/         ────►  app/        (mounted)
   ├─► components/  ────►  components/ (mounted)
   ├─► lib/         ────►  lib/        (mounted)
   └─► ...          ────►  ...         (mounted)

2. node_modules Volume:
   /app/node_modules
   
   Host                     Container
   ──────────────────      ────────────
   frontend/               /app/
   └─► node_modules/ ✗     node_modules/ ← From image
   
   Why? Prevent overwriting container's node_modules

3. .next Volume:
   /app/.next
   
   Host                     Container
   ──────────────────      ────────────
   frontend/               /app/
   └─► .next/        ✗     .next/    ← Build cache
   
   Why? Faster hot-reloads, persistent build cache
```

### Service Dependencies Flow

```
Docker Compose Startup Order
═══════════════════════════

$ docker-compose up

Step 1: Network Creation
  Creating network "erp_default" with default driver
  └─► Shared network for all services

Step 2: Backend Dependencies
  Starting erp_postgres_dev...
  Starting erp_redis_dev...
  └─► Database and cache first

Step 3: Backend Service
  Starting erp_backend_dev...
  └─► Waits for postgres and redis
  └─► Runs migrations
  └─► Starts Django server

Step 4: Frontend Service (depends_on: backend)
  Waiting for backend to be ready...
  Starting erp_frontend_dev...
  └─► Waits for backend
  └─► Starts Next.js dev server
  └─► Ready at http://localhost:3000

All Services Running:
  ✓ erp_postgres_dev   (5432)
  ✓ erp_redis_dev      (6379)
  ✓ erp_backend_dev    (8000)
  ✓ erp_frontend_dev   (3000)
```

### Environment Variables Configuration

```
Frontend Environment Variables
═══════════════════════════════

Build-time Variables (NEXT_PUBLIC_*):
  NEXT_PUBLIC_API_URL=http://backend:8000
  ├─► Available in browser
  ├─► Embedded during build
  └─► Used for API calls

  NEXT_PUBLIC_WS_URL=ws://backend:8000
  └─► WebSocket connection for real-time

  NEXT_PUBLIC_APP_NAME=LankaCommerce ERP
  └─► Display in UI

Runtime Variables (Server-side):
  NODE_ENV=development
  └─► Controls Next.js behavior

  DATABASE_URL=postgresql://...
  └─► If frontend needs direct DB access (rare)

Variable Resolution:
  Browser Code:
    ├─► Can access: NEXT_PUBLIC_*
    └─► Cannot access: Non-public vars

  Server Code (API routes, Server Components):
    ├─► Can access: All variables
    └─► Includes: NEXT_PUBLIC_* and others
```

### Inter-Service Communication

```
Service-to-Service Networking
═════════════════════════════

Container Network:
┌──────────────────────────────────────────┐
│           Docker Network: erp_default    │
│                                          │
│  ┌──────────────┐    ┌──────────────┐   │
│  │   Frontend   │───→│   Backend    │   │
│  │ (3000)       │←───│   (8000)     │   │
│  │              │    │              │   │
│  │ Container:   │    │ Container:   │   │
│  │ frontend     │    │ backend      │   │
│  └──────────────┘    └──────────────┘   │
│         │                    │           │
│         └──────────┬─────────┘           │
│                    ▼                     │
│            ┌──────────────┐              │
│            │  PostgreSQL  │              │
│            │  (5432)      │              │
│            └──────────────┘              │
└──────────────────────────────────────────┘

DNS Resolution:
  Frontend container can reach backend by name:
  • http://backend:8000  ✓ (container name)
  • http://erp_backend_dev:8000  ✓ (container name)
  • http://localhost:8000  ✗ (wrong, not same container)

Browser Access (from host):
  • http://localhost:3000  → Frontend
  • http://localhost:8000  → Backend
```

### Complete Service Configuration Example

```
docker-compose.yml Structure
═══════════════════════════

version: '3.8'

services:
  postgres:
    # ... postgres configuration
  
  redis:
    # ... redis configuration
  
  backend:
    # ... backend configuration
    ports:
      - "8000:8000"
  
  frontend:  ← New service
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: erp_frontend_dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000
      - NEXT_PUBLIC_APP_NAME=LankaCommerce ERP
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - default

networks:
  default:
    driver: bridge
```

### Development Workflow with Docker Compose

```
Typical Development Commands
═══════════════════════════

Start All Services:
  $ docker-compose up
  └─► Starts all services including frontend

Start Frontend Only:
  $ docker-compose up frontend
  └─► Starts frontend and dependencies (backend)

Rebuild Frontend:
  $ docker-compose up --build frontend
  └─► Rebuilds image before starting

View Logs:
  $ docker-compose logs -f frontend
  └─► Stream frontend logs

Execute Command in Container:
  $ docker-compose exec frontend pnpm add new-package
  └─► Install package inside container

Stop Services:
  $ docker-compose down
  └─► Stop and remove containers

Stop but Keep Data:
  $ docker-compose stop
  └─► Stop containers, keep volumes
```

### Hot-Reload with Docker Compose

```
Hot-Reload Flow in Docker Compose
═══════════════════════════════

Developer edits file on host:
  Host: frontend/app/page.tsx (saved)
  
  ↓ (volume mounted)
  
Container sees change:
  Container: /app/app/page.tsx (changed)
  
  ↓ (Next.js file watcher)
  
Next.js recompiles:
  [Next.js Dev] Compiling /page...
  [Next.js Dev] Compiled successfully
  
  ↓ (WebSocket to browser)
  
Browser updates:
  [Fast Refresh] Page updated
  
Total time: < 1 second

No rebuild needed! ✓
```

### Resource Management

```
Container Resource Limits (Optional)
═══════════════════════════════════

Add to frontend service:
  frontend:
    # ... other config
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M

Purpose:
  • Prevent frontend from consuming all resources
  • Ensure other services get CPU/memory
  • Simulate production constraints

Typical Development Resources:
  CPU: 0.5-1.0 cores (idle)
  CPU: 1.5-2.0 cores (compiling)
  Memory: 500MB-1GB (development)
  Memory: 300-500MB (production)
```

### Docker Compose Networking

```
Network Communication Matrix
═══════════════════════════

From → To          | PostgreSQL | Redis | Backend | Frontend
─────────────────  |────────────|───────|─────────|─────────
Backend            |     ✓      |   ✓   |    -    |    -
Frontend           |     ✗      |   ✗   |    ✓    |    -
Host Browser       |     ✗      |   ✗   |  ✓(8000)|  ✓(3000)

✓ = Can communicate
✗ = Cannot/Should not communicate
- = Self-communication

Security Benefits:
  • Frontend doesn't directly access database
  • All data goes through backend API
  • Proper separation of concerns
```

### Restart Policy Behavior

```
Restart Policy: unless-stopped
═══════════════════════════

Container States and Restart Behavior:

Exit Code 0 (Clean Exit):
  $ docker-compose stop frontend
  └─► Container stops
  └─► Does NOT auto-restart
  └─► Manual start needed

Exit Code 1 (Error):
  Application crashes
  └─► Container stops with error
  └─► Auto-restarts immediately
  └─► Continues until success

System Reboot:
  Host system reboots
  └─► Docker daemon restarts
  └─► All unless-stopped containers restart
  └─► Services available after boot

Manual Stop:
  $ docker stop erp_frontend_dev
  └─► Container stops
  └─► Does NOT auto-restart
  └─► Intent respected

Benefits:
  ✓ Resilient to crashes
  ✓ Survives reboots
  ✓ Respects intentional stops
```

### Health Check Integration

```
Frontend Health Check
═══════════════════

Add to docker-compose.yml:
  frontend:
    # ... other config
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 3s
      start_period: 40s
      retries: 3

Container Health States:
  starting (0-40s)     → Grace period for Next.js startup
  healthy              → Health check passing
  unhealthy (3 fails)  → Health check failing

View Health Status:
  $ docker-compose ps
  
  Name                 State           Ports
  ────────────────────────────────────────────────
  erp_frontend_dev    Up (healthy)    0.0.0.0:3000->3000/tcp
  erp_backend_dev     Up (healthy)    0.0.0.0:8000->8000/tcp

Automated Actions:
  • Load balancers check health
  • Orchestrators restart unhealthy
  • Monitoring alerts on unhealthy
```

### Expected Outcome
- Frontend service integrated with docker-compose
- Entire stack runs with single command
- Hot-reloading works in containerized environment
- Services can communicate over internal network
- Consistent development environment for team

### Verification Checklist
- [ ] `docker-compose.yml` updated with frontend service
- [ ] Build context set to ./frontend
- [ ] Dockerfile specified (development)
- [ ] Port 3000 mapped correctly
- [ ] Source code volume mounted
- [ ] node_modules anonymous volume configured
- [ ] .next anonymous volume configured
- [ ] Environment variables defined
- [ ] depends_on backend configured
- [ ] Restart policy set
- [ ] Health check added (optional)
- [ ] Test: `docker-compose up` starts all services
- [ ] Test: Frontend accessible at http://localhost:3000
- [ ] Test: Hot-reload works when editing files

---

## Summary

This document established comprehensive development tooling and Docker containerization for the Next.js frontend project:

### Completed Configuration
- ✅ VS Code workspace settings for consistent formatting
- ✅ VS Code extension recommendations for full tooling
- ✅ Debug configurations for server-side and client-side code
- ✅ Development Dockerfile with hot-reloading support
- ✅ Production Dockerfile with multi-stage optimization
- ✅ Docker Compose integration for full-stack development

### Key Achievements

1. **VS Code Settings (Task 79)**
   - Format-on-save enabled
   - ESLint auto-fix configured
   - TypeScript preferences optimized
   - Clean workspace with file exclusions

2. **VS Code Extensions (Task 80)**
   - Prettier for formatting
   - ESLint for linting
   - Tailwind IntelliSense for CSS
   - PostCSS support
   - Optional productivity extensions

3. **Debug Configuration (Task 81)**
   - Server-side debugging (Node.js)
   - Client-side debugging (Chrome)
   - Full-stack debugging (Compound)
   - Source maps and path mappings
   - Skip files for focused debugging

4. **Docker Development (Task 82)**
   - node:20-alpine base image
   - Corepack enabled for pnpm
   - Hot-reload support
   - Volume mounting strategy
   - Fast rebuild with layer caching

5. **Docker Production (Task 83)**
   - Multi-stage build (3 stages)
   - Minimal final image (~160MB)
   - Non-root user security
   - Standalone output mode
   - Production optimizations

6. **Docker Compose (Task 84)**
   - Frontend service integrated
   - Service dependencies configured
   - Environment variables managed
   - Inter-service networking
   - Health checks added

### Development Workflow Impact

```
Before Configuration:
  • Inconsistent formatting across team
  • Manual formatting and linting
  • console.log debugging only
  • Environment setup differences
  • Manual dependency management

After Configuration:
  • Auto-format on save
  • Auto-fix lint issues
  • Breakpoint debugging available
  • Identical environments via Docker
  • Single command startup (docker-compose up)

Time Saved:
  • New developer onboarding: 2 hours → 15 minutes
  • Daily setup time: 10 minutes → 30 seconds
  • Debugging time: 30 minutes → 5 minutes per issue
  • Merge conflicts from formatting: Eliminated
```

### Architecture Overview

```
Development Stack
════════════════

┌──────────────────────────────────────────────┐
│              Developer Machine               │
│                                              │
│  VS Code                                     │
│  ├─► Settings (.vscode/settings.json)       │
│  ├─► Extensions (.vscode/extensions.json)   │
│  └─► Debug Config (.vscode/launch.json)     │
│                                              │
│  Docker                                      │
│  └─► docker-compose.yml                     │
│      ├─► frontend (Dockerfile)              │
│      │   ├─► Next.js dev server (3000)      │
│      │   ├─► Hot-reload enabled             │
│      │   └─► Volume mounted source          │
│      ├─► backend (8000)                     │
│      ├─► postgres (5432)                    │
│      └─► redis (6379)                       │
│                                              │
│  Browser                                     │
│  ├─► http://localhost:3000 (Frontend)       │
│  └─► http://localhost:8000 (Backend API)    │
└──────────────────────────────────────────────┘
```

### Next Steps
Proceed to [02_Tasks-85-88_Documentation-Verification.md](02_Tasks-85-88_Documentation-Verification.md) to create comprehensive documentation (development guide, architecture docs, API integration guide) and perform final verification and cleanup.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~985

