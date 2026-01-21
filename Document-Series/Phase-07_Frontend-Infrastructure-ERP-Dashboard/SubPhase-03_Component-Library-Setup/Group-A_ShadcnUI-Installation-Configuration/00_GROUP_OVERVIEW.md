# Group A: Shadcn/UI Installation & Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure Shadcn/UI with utilities, icons, and form handling dependencies

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Primitive-Components](../Group-B_Primitive-Components/)

---

## Group Overview

This group installs and configures Shadcn/UI as the component library foundation. Initializes the CLI and creates components.json configuration. Installs utility dependencies (clsx, tailwind-merge, class-variance-authority) and creates the cn() helper function. Adds Lucide React icons with a wrapper component. Installs Radix UI primitives and configures theming with LCC brand colors. Sets up React Hook Form with Zod validation for form handling.

### Key Outcomes

- Shadcn/UI CLI installed
- npx shadcn-ui@latest init completed
- components.json configured (style, aliases, RSC)
- components/ui directory created
- Utility dependencies installed (clsx, tailwind-merge, cva)
- lib/utils.ts with cn() function
- Lucide React icons installed
- Icon component wrapper created
- Radix UI primitives installed
- Component theming with LCC colors
- React Hook Form installed
- Zod validation library installed
- @hookform/resolvers installed
- Shadcn/UI setup verified

### Technology Context

- **Component Library:** Shadcn/UI (open-source components)
- **Primitives:** Radix UI (accessible, unstyled)
- **Icons:** Lucide React (Feather-based)
- **Form Handling:** React Hook Form + Zod
- **Class Utilities:** CVA, clsx, tailwind-merge

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_CLI-Setup-Utilities.md` | Install CLI, initialize, and set up utilities | 01-08 |
| 02 | `02_Tasks-09-14_Radix-Forms-Verification.md` | Install Radix, form libraries, and verify setup | 09-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Shadcn/UI CLI | Low | SubPhase-02 |
| 02 | Initialize Shadcn/UI | Low | Task 01 |
| 03 | Configure components.json | Low | Task 02 |
| 04 | Create components/ui Directory | Low | Task 02 |
| 05 | Install Utility Dependencies | Low | Task 02 |
| 06 | Create cn Utility Function | Low | Task 05 |
| 07 | Install Lucide Icons | Low | Task 02 |
| 08 | Create Icon Component Wrapper | Low | Task 07 |
| 09 | Install Radix UI Primitives | Low | Task 02 |
| 10 | Configure Component Theming | Medium | Task 03 |
| 11 | Install React Hook Form | Low | Task 02 |
| 12 | Install Zod | Low | Task 11 |
| 13 | Install @hookform/resolvers | Low | Task 12 |
| 14 | Verify Shadcn/UI Setup | Low | Task 03 |

---

## Execution Order

```
Task 01: Install Shadcn/UI CLI
    │
    ▼
Task 02: Initialize Shadcn/UI
    │
    ├───────────────────────────────────────────────────┐
    ▼                                                   ▼
Task 03               Task 04                     Tasks 05, 07, 09
(components.json)     (ui directory)              (utilities, icons, Radix)
    │                      │                           │
    │                      │                           ▼
    │                      │                      Task 06: cn function
    │                      │                           │
    │                      │                      Task 08: Icon wrapper
    │                      │                           │
    └──────────────────────┴───────────────────────────┘
                           │
                           ▼
                      Task 10: Configure Theming
                           │
                           ▼
                      Task 11: React Hook Form
                           │
                           ▼
                      Task 12: Zod
                           │
                           ▼
                      Task 13: Resolvers
                           │
                           ▼
                      Task 14: Verify Setup
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── ui/
│       └── icon.tsx        # Icon wrapper
├── lib/
│   └── utils.ts            # cn() function
└── components.json         # Shadcn configuration
```

---

## Notes for AI Agents

### CLI Installation (Task 01)
```bash
pnpm add -D shadcn-ui
```

### Initialize Command (Task 02)
```bash
pnpx shadcn-ui@latest init
```

### components.json Configuration (Task 03)
| Option | Value | Purpose |
|--------|-------|---------|
| style | new-york | Component style |
| rsc | true | React Server Components |
| tsx | true | TypeScript |
| tailwind.config | tailwind.config.js | Tailwind path |
| aliases.components | @/components | Component alias |
| aliases.utils | @/lib/utils | Utils alias |

### Utility Packages (Task 05)
| Package | Purpose |
|---------|---------|
| clsx | Conditional class strings |
| tailwind-merge | Merge Tailwind classes |
| class-variance-authority | Component variants |

### cn() Function (Task 06)
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Icon Wrapper Props
- name: Lucide icon name
- size: sm, md, lg, xl
- className: Additional classes
- ...props: SVG props passthrough

### Form Handling Stack
| Package | Purpose |
|---------|---------|
| react-hook-form | Form state management |
| zod | Schema validation |
| @hookform/resolvers | Zod integration |

### Verification Test (Task 14)
- Install a test component (Button)
- Import and render in page
- Verify styling works
