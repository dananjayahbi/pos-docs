# SubPhase 01: Next.js Project Setup - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 01 of 14  
> **SubPhase Goal:** Initialize Next.js 14+ with App Router, TypeScript strict mode, and comprehensive project configuration  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 8-10 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-06_ERP-Advanced-Modules](../../Phase-06_ERP-Advanced-Modules/)
- **→ Next SubPhase:** [SubPhase-02_Tailwind-Design-System](../SubPhase-02_Tailwind-Design-System/)

---

## SubPhase Overview

This sub-phase establishes the Next.js 14+ frontend application with proper TypeScript configuration, App Router architecture, and development tooling. The frontend will serve as the ERP dashboard interface for LankaCommerce Cloud multi-tenant SaaS platform.

### Key Outcomes
- Next.js 14+ project initialized with App Router
- TypeScript 5.x with strict mode configured
- Path aliases set up (@/components, @/lib, @/hooks, etc.)
- ESLint and Prettier configured with consistent rules
- Environment variables structure established
- Development and production build configurations
- Project structure ready for component library integration

### Technology Context
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript 5.x (strict mode)
- **Package Manager:** pnpm (preferred) or npm
- **Node.js:** 20.x LTS
- **Build Tool:** Turbopack (development), Webpack (production)

### Sri Lanka Context
- **Timezone:** Asia/Colombo (UTC+5:30)
- **Locales:** en-LK, si-LK, ta-LK
- **Currency Display:** LKR formatting
- **Date Format:** DD/MM/YYYY

---

## Task Execution Order

```
TASK GROUP A: Project Initialization (Tasks 01-16)
        │
        ▼
TASK GROUP B: TypeScript Configuration (Tasks 17-30)
        │
        ▼
TASK GROUP C: App Router Structure (Tasks 31-46)
        │
        ▼
TASK GROUP D: ESLint & Prettier Setup (Tasks 47-62)
        │
        ▼
TASK GROUP E: Environment & Build Configuration (Tasks 63-78)
        │
        ▼
TASK GROUP F: Development Tooling & Documentation (Tasks 79-88)
```

---

## Task Index

### Group A: Project Initialization (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Next.js Project** | Initialize Next.js 14+ using create-next-app with TypeScript template | None | 🔴 Not Created |
| 02 | **Configure Package Manager** | Set up pnpm as preferred package manager with workspace configuration | Task 01 | 🔴 Not Created |
| 03 | **Update package.json Metadata** | Configure name, version, description, author, repository fields | Task 01 | 🔴 Not Created |
| 04 | **Configure npm Scripts** | Add dev, build, start, lint, format, type-check scripts | Task 03 | 🔴 Not Created |
| 05 | **Install Core Dependencies** | Add react 18.x, react-dom, next as core dependencies | Task 01 | 🔴 Not Created |
| 06 | **Install TypeScript Dependencies** | Add typescript, @types/react, @types/node as dev dependencies | Task 05 | 🔴 Not Created |
| 07 | **Create .nvmrc File** | Specify Node.js version 20.x for nvm users | Task 01 | 🔴 Not Created |
| 08 | **Create .npmrc Configuration** | Configure npm/pnpm settings for consistent installs | Task 02 | 🔴 Not Created |
| 09 | **Initialize Git for Frontend** | Set up git ignore, attributes specific to frontend | Task 01 | 🔴 Not Created |
| 10 | **Create Frontend .gitignore** | Ignore node_modules, .next, out, .env.local, etc. | Task 09 | 🔴 Not Created |
| 11 | **Create Frontend .gitattributes** | Configure line endings for TypeScript/JavaScript files | Task 09 | 🔴 Not Created |
| 12 | **Set Up Husky Git Hooks** | Install husky for pre-commit and pre-push hooks | Task 09 | 🔴 Not Created |
| 13 | **Configure lint-staged** | Set up lint-staged for running linters on staged files | Task 12 | 🔴 Not Created |
| 14 | **Create commitlint Configuration** | Enforce conventional commit messages | Task 12 | 🔴 Not Created |
| 15 | **Create Frontend README.md** | Document frontend setup, scripts, and development guide | Task 01 | 🔴 Not Created |
| 16 | **Verify Initial Setup** | Run dev server and verify Next.js is working | Task 05 | 🔴 Not Created |

---

### Group B: TypeScript Configuration (Tasks 17-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create tsconfig.json** | Configure TypeScript with strict mode and modern settings | Task 06 | 🔴 Not Created |
| 18 | **Enable Strict Mode Options** | Set strict, noImplicitAny, strictNullChecks, strictFunctionTypes | Task 17 | 🔴 Not Created |
| 19 | **Configure Module Resolution** | Set moduleResolution to bundler, esModuleInterop enabled | Task 17 | 🔴 Not Created |
| 20 | **Set Up Path Aliases - Components** | Configure @/components/* path alias | Task 17 | 🔴 Not Created |
| 21 | **Set Up Path Aliases - Lib** | Configure @/lib/* path alias for utilities | Task 17 | 🔴 Not Created |
| 22 | **Set Up Path Aliases - Hooks** | Configure @/hooks/* path alias for custom hooks | Task 17 | 🔴 Not Created |
| 23 | **Set Up Path Aliases - Store** | Configure @/store/* path alias for state management | Task 17 | 🔴 Not Created |
| 24 | **Set Up Path Aliases - Types** | Configure @/types/* path alias for TypeScript types | Task 17 | 🔴 Not Created |
| 25 | **Set Up Path Aliases - Services** | Configure @/services/* path alias for API services | Task 17 | 🔴 Not Created |
| 26 | **Set Up Path Aliases - Constants** | Configure @/constants/* path alias for app constants | Task 17 | 🔴 Not Created |
| 27 | **Set Up Path Aliases - Styles** | Configure @/styles/* path alias for global styles | Task 17 | 🔴 Not Created |
| 28 | **Configure Include/Exclude Patterns** | Set up file inclusion patterns for TypeScript compilation | Task 17 | 🔴 Not Created |
| 29 | **Create tsconfig.node.json** | Separate config for Node.js scripts and configuration files | Task 17 | 🔴 Not Created |
| 30 | **Verify TypeScript Configuration** | Run tsc --noEmit to verify configuration works | Task 28 | 🔴 Not Created |

---

### Group C: App Router Structure (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create app/ Directory Structure** | Set up root app directory with layout.tsx and page.tsx | Task 16 | 🔴 Not Created |
| 32 | **Create Root Layout Component** | Implement RootLayout with html, body, metadata | Task 31 | 🔴 Not Created |
| 33 | **Configure Root Metadata** | Set up default metadata for SEO (title, description, icons) | Task 32 | 🔴 Not Created |
| 34 | **Create Root Loading Component** | Implement loading.tsx for root-level loading state | Task 31 | 🔴 Not Created |
| 35 | **Create Root Error Component** | Implement error.tsx for root-level error boundary | Task 31 | 🔴 Not Created |
| 36 | **Create Not Found Page** | Implement not-found.tsx for 404 pages | Task 31 | 🔴 Not Created |
| 37 | **Create (auth) Route Group** | Set up authentication routes group directory | Task 31 | 🔴 Not Created |
| 38 | **Create (auth) Layout** | Implement layout for authentication pages | Task 37 | 🔴 Not Created |
| 39 | **Create (dashboard) Route Group** | Set up protected dashboard routes group directory | Task 31 | 🔴 Not Created |
| 40 | **Create (dashboard) Layout** | Implement layout for dashboard pages with sidebar/header slots | Task 39 | 🔴 Not Created |
| 41 | **Create api/ Route Directory** | Set up API routes directory structure | Task 31 | 🔴 Not Created |
| 42 | **Create Health Check API Route** | Implement /api/health endpoint for monitoring | Task 41 | 🔴 Not Created |
| 43 | **Create components/ Directory** | Set up components directory with ui/ and modules/ subdirectories | Task 16 | 🔴 Not Created |
| 44 | **Create lib/ Directory** | Set up utilities directory with utils.ts placeholder | Task 16 | 🔴 Not Created |
| 45 | **Create hooks/ Directory** | Set up custom hooks directory with index.ts | Task 16 | 🔴 Not Created |
| 46 | **Create types/ Directory** | Set up TypeScript types directory with index.ts | Task 16 | 🔴 Not Created |

---

### Group D: ESLint & Prettier Setup (Tasks 47-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Install ESLint Dependencies** | Add eslint, eslint-config-next, eslint-plugin-react-hooks | Task 06 | 🔴 Not Created |
| 48 | **Install ESLint TypeScript Plugins** | Add @typescript-eslint/parser, @typescript-eslint/eslint-plugin | Task 47 | 🔴 Not Created |
| 49 | **Install Additional ESLint Plugins** | Add eslint-plugin-import, eslint-plugin-jsx-a11y | Task 47 | 🔴 Not Created |
| 50 | **Create .eslintrc.json Configuration** | Configure ESLint with Next.js, TypeScript, accessibility rules | Task 49 | 🔴 Not Created |
| 51 | **Configure ESLint Rules - TypeScript** | Set up TypeScript-specific linting rules | Task 50 | 🔴 Not Created |
| 52 | **Configure ESLint Rules - React** | Set up React and React Hooks linting rules | Task 50 | 🔴 Not Created |
| 53 | **Configure ESLint Rules - Import** | Set up import ordering and validation rules | Task 50 | 🔴 Not Created |
| 54 | **Configure ESLint Rules - Accessibility** | Set up jsx-a11y accessibility rules | Task 50 | 🔴 Not Created |
| 55 | **Create .eslintignore File** | Ignore node_modules, .next, build directories | Task 50 | 🔴 Not Created |
| 56 | **Install Prettier** | Add prettier as dev dependency | Task 06 | 🔴 Not Created |
| 57 | **Create .prettierrc Configuration** | Configure Prettier with consistent formatting rules | Task 56 | 🔴 Not Created |
| 58 | **Create .prettierignore File** | Ignore generated and build files | Task 56 | 🔴 Not Created |
| 59 | **Install eslint-config-prettier** | Add eslint-config-prettier to disable conflicting rules | Task 56 | 🔴 Not Created |
| 60 | **Install eslint-plugin-prettier** | Add eslint-plugin-prettier for Prettier integration | Task 59 | 🔴 Not Created |
| 61 | **Update ESLint Config for Prettier** | Extend ESLint config with prettier rules | Task 60 | 🔴 Not Created |
| 62 | **Verify Linting Setup** | Run lint and format scripts to verify configuration | Task 61 | 🔴 Not Created |

---

### Group E: Environment & Build Configuration (Tasks 63-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create next.config.js** | Configure Next.js with images, redirects, headers | Task 16 | 🔴 Not Created |
| 64 | **Configure Image Domains** | Set up allowed image domains for next/image optimization | Task 63 | 🔴 Not Created |
| 65 | **Configure Server Actions** | Enable experimental server actions feature | Task 63 | 🔴 Not Created |
| 66 | **Configure TypeScript in next.config** | Enable TypeScript strict mode in Next.js config | Task 63 | 🔴 Not Created |
| 67 | **Configure Security Headers** | Set up Content-Security-Policy, X-Frame-Options headers | Task 63 | 🔴 Not Created |
| 68 | **Configure Redirects** | Set up common redirects (www to non-www, etc.) | Task 63 | 🔴 Not Created |
| 69 | **Create .env.example File** | Document all required environment variables | Task 16 | 🔴 Not Created |
| 70 | **Create .env.local Template** | Create local development environment file template | Task 69 | 🔴 Not Created |
| 71 | **Configure API URL Variables** | Set NEXT_PUBLIC_API_URL environment variable | Task 69 | 🔴 Not Created |
| 72 | **Configure Site URL Variables** | Set NEXT_PUBLIC_SITE_URL environment variable | Task 69 | 🔴 Not Created |
| 73 | **Configure Feature Flags** | Set up feature flag environment variables | Task 69 | 🔴 Not Created |
| 74 | **Create Environment Validation** | Create env.ts to validate required environment variables | Task 69 | 🔴 Not Created |
| 75 | **Configure Production Build** | Set up production-specific build configuration | Task 63 | 🔴 Not Created |
| 76 | **Configure Bundle Analyzer** | Add @next/bundle-analyzer for production optimization | Task 75 | 🔴 Not Created |
| 77 | **Configure Output Tracing** | Set up standalone output for Docker deployment | Task 75 | 🔴 Not Created |
| 78 | **Verify Build Configuration** | Run production build and verify output | Task 77 | 🔴 Not Created |

---

### Group F: Development Tooling & Documentation (Tasks 79-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create VS Code Settings** | Set up .vscode/settings.json for frontend development | Task 16 | 🔴 Not Created |
| 80 | **Create VS Code Extensions** | Recommend extensions in .vscode/extensions.json | Task 79 | 🔴 Not Created |
| 81 | **Create Debug Configuration** | Set up .vscode/launch.json for Next.js debugging | Task 79 | 🔴 Not Created |
| 82 | **Create Docker Development File** | Set up Dockerfile for development environment | Task 16 | 🔴 Not Created |
| 83 | **Create Docker Production File** | Set up multi-stage Dockerfile for production | Task 82 | 🔴 Not Created |
| 84 | **Create Docker Compose Entry** | Add frontend service to docker-compose.yml | Task 82 | 🔴 Not Created |
| 85 | **Create Development Guide** | Document local development setup and workflow | Task 15 | 🔴 Not Created |
| 86 | **Create Architecture Documentation** | Document frontend architecture decisions | Task 85 | 🔴 Not Created |
| 87 | **Create API Integration Guide** | Document API client setup and usage patterns | Task 85 | 🔴 Not Created |
| 88 | **Final Verification & Cleanup** | Run all checks, clean up placeholders, verify structure | Task 78 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── settings.json
├── app/
│   ├── (auth)/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── modules/
│   │   └── .gitkeep
│   └── ui/
│       └── .gitkeep
├── hooks/
│   └── index.ts
├── lib/
│   ├── env.ts
│   └── utils.ts
├── services/
│   └── .gitkeep
├── store/
│   └── .gitkeep
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
├── .editorconfig
├── .env.example
├── .env.local (git-ignored)
├── .eslintignore
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── commitlint.config.js
├── Dockerfile
├── Dockerfile.prod
├── lint-staged.config.js
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
└── tsconfig.node.json
```

---

## Key Configuration References

### TypeScript Path Aliases
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/hooks/*": ["hooks/*"],
      "@/store/*": ["store/*"],
      "@/types/*": ["types/*"],
      "@/services/*": ["services/*"],
      "@/constants/*": ["constants/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

### Environment Variables Structure
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true

# Build Configuration
ANALYZE=false
```

### ESLint Configuration Highlights
- Next.js core web vitals rules
- TypeScript strict type checking
- React hooks exhaustive deps
- Import ordering and grouping
- Accessibility (jsx-a11y) rules
- Prettier integration

### Prettier Configuration
- Single quotes for strings
- Semicolons enabled
- 2 space indentation
- 100 character print width
- Trailing commas (ES5)

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group to ensure dependencies are met
2. **Package Manager:** Use pnpm as the preferred package manager; npm is acceptable if pnpm is unavailable
3. **Node Version:** Ensure Node.js 20.x LTS is installed before starting
4. **Path Aliases:** All path aliases must be configured in both tsconfig.json and next.config.js for proper resolution
5. **Environment Variables:** Never commit .env.local; only .env.example should be tracked
6. **Git Hooks:** Husky hooks should run lint-staged on pre-commit to catch issues early
7. **Type Safety:** All files should pass TypeScript strict mode checks before proceeding
8. **Dependencies on Phase-01:** This sub-phase assumes monorepo structure from Phase-01 is complete
9. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
10. **Verification:** Each group should be verified before proceeding to the next group
