# Tasks 51-53: Shared Directory Structure

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** E - Shared & Support Directories  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Frontend-Directory-Scaffold/](../Group-D_Frontend-Directory-Scaffold/)
- **→ Next Document:** [02_Tasks-54-56_Docker-Directories.md](02_Tasks-54-56_Docker-Directories.md)

---

## Document Overview

This document covers the creation of the shared resources directory structure for cross-platform TypeScript types and constants that are used by multiple frontend applications.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create shared/types/ Directory | Simple |
| 52 | Create shared/constants/ Directory | Simple |
| 53 | Create shared/README.md | Simple |

---

## Task 51: Create shared/types/ Directory

### Overview
Create the types directory within shared for TypeScript type definitions that are used across multiple frontend applications (POS, Webstore, Dashboard).

### Dependencies
- Task 13: Create shared/ Directory (Group B)

### Instructions

1. **Create the types directory**
   - Create a directory named `types/` inside `shared/`
   - This holds TypeScript interfaces and types shared across apps

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Shared entity types (Product, Order, Customer)
   - API response/request types
   - Common utility types
   - Enum types

### Planned Type Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `entities/` | Entity types (Product, Order, User) |
| `api/` | API request/response types |
| `common.ts` | Common utility types |
| `index.ts` | Barrel export file |

### Shared Entity Types (Planned)

| Entity | Used By |
|--------|---------|
| `Product` | POS, Webstore, Dashboard |
| `Order` | POS, Webstore, Dashboard |
| `Customer` | POS, Webstore, Dashboard |
| `Cart` | POS, Webstore |
| `Invoice` | POS, Dashboard |
| `Payment` | POS, Webstore, Dashboard |

### Why Shared Types?
- **Consistency:** Same type definitions across all frontend apps
- **Maintainability:** Single source of truth
- **Type Safety:** API responses match expected types
- **DRY Principle:** Don't repeat type definitions

### Expected Outcome
```
shared/
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `shared/types/` directory exists
- [ ] `.gitkeep` file exists inside `types/`
- [ ] Directory is tracked by Git

---

## Task 52: Create shared/constants/ Directory

### Overview
Create the constants directory within shared for constant values, enums, and configuration that are used across multiple frontend applications.

### Dependencies
- Task 13: Create shared/ Directory (Group B)

### Instructions

1. **Create the constants directory**
   - Create a directory named `constants/` inside `shared/`
   - This holds constant values shared across apps

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Status enums (OrderStatus, PaymentStatus)
   - Configuration constants
   - Sri Lanka-specific constants
   - Common validation rules

### Planned Constant Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `status.ts` | Status enums and codes |
| `config.ts` | Shared configuration |
| `sri-lanka.ts` | Sri Lanka-specific constants |
| `validation.ts` | Validation rules |
| `index.ts` | Barrel export file |

### Shared Constants Categories

| Category | Examples |
|----------|----------|
| **Order Status** | PENDING, CONFIRMED, SHIPPED, DELIVERED |
| **Payment Status** | PENDING, COMPLETED, FAILED, REFUNDED |
| **Product Status** | ACTIVE, INACTIVE, OUT_OF_STOCK |
| **Currency** | LKR, USD (code and symbol) |
| **Timezone** | Asia/Colombo |

### Sri Lanka-Specific Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `CURRENCY_CODE` | LKR | Currency ISO code |
| `CURRENCY_SYMBOL` | ₨ | Display symbol |
| `PHONE_PREFIX` | +94 | Country phone prefix |
| `TIMEZONE` | Asia/Colombo | Default timezone |
| `DISTRICTS` | Array<string> | 25 districts |
| `PROVINCES` | Array<string> | 9 provinces |

### Why Shared Constants?
- **Consistency:** Same values across all apps
- **Maintainability:** Update in one place
- **Type Safety:** Enum-like objects with TypeScript
- **Localization:** Sri Lanka-specific values centralized

### Expected Outcome
```
shared/
├── constants/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `shared/constants/` directory exists
- [ ] `.gitkeep` file exists inside `constants/`
- [ ] Directory is tracked by Git

---

## Task 53: Create shared/README.md

### Overview
Create documentation for the shared resources directory explaining its purpose, structure, and usage guidelines.

### Dependencies
- Task 13: Create shared/ Directory (Group B)

### Instructions

1. **Create the README.md file**
   - Create a file named `README.md` in the `shared/` directory

2. **Add overview section**
   - Purpose of shared resources
   - What belongs in this directory
   - What does NOT belong here

3. **Add directory structure section**
   - Explain types/ directory
   - Explain constants/ directory
   - Future directories if planned

4. **Add usage guidelines section**
   - How to import from shared
   - Naming conventions
   - Adding new types/constants

5. **Add examples section**
   - Example type import
   - Example constant import

### Content Sections

| Section | Description |
|---------|-------------|
| **Overview** | Purpose and scope |
| **Structure** | Directory organization |
| **Usage** | Import patterns |
| **Guidelines** | Best practices |
| **Examples** | Code examples |

### What Belongs in Shared

| Include | Exclude |
|---------|---------|
| Entity types (Product, Order) | App-specific types |
| Status enums | Component props |
| API response types | Internal implementation types |
| Validation schemas | App configuration |
| Sri Lanka constants | Environment variables |

### Import Pattern Example

```typescript
// From POS app
import { Product, Order } from '@/shared/types';
import { ORDER_STATUS, CURRENCY } from '@/shared/constants';

// Path alias configuration required
// tsconfig.json: "@/shared/*": ["../../shared/*"]
```

### Expected Outcome
```
shared/
├── constants/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── README.md                # Shared resources documentation
```

### Verification Checklist
- [ ] `shared/README.md` file exists
- [ ] Overview section is present
- [ ] Directory structure is documented
- [ ] Usage guidelines are included
- [ ] Import examples are provided

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 51 | Create shared/types/ Directory | `shared/types/` with `.gitkeep` |
| 52 | Create shared/constants/ Directory | `shared/constants/` with `.gitkeep` |
| 53 | Create shared/README.md | `shared/README.md` documentation |

### Final Shared Directory Structure
```
shared/
├── constants/
│   └── .gitkeep
├── types/
│   └── .gitkeep
└── README.md
```

### Next Steps
Proceed to [02_Tasks-54-56_Docker-Directories.md](02_Tasks-54-56_Docker-Directories.md) to create Docker configuration directories.

---

## Notes for AI Agents

1. **Shared Purpose:** This directory is for types/constants shared between frontend apps
2. **Not for Backend:** Backend has its own type system (Python/Django)
3. **Path Aliases:** Frontend apps need tsconfig path aliases to import from shared
4. **TypeScript Only:** This is for TypeScript type definitions
5. **Git Commit:** Do NOT commit yet - wait until all Group E tasks are complete
