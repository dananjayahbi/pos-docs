# Tasks 05-08: Package Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** A - Node.js Environment Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Node-Setup.md](01_Tasks-01-04_Node-Setup.md)
- **→ Next Document:** [../Group-B_NextJS-Project-Creation/00_GROUP_OVERVIEW.md](../Group-B_NextJS-Project-Creation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers initializing package.json, configuring scripts, setting up pnpm workspace, and creating frontend-specific .gitignore.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Initialize package.json | Medium |
| 06 | Configure Package Scripts | Medium |
| 07 | Create pnpm-workspace.yaml | Simple |
| 08 | Create .gitignore (Frontend) | Simple |

---

## Task 05: Initialize package.json

### Overview
Create the initial package.json with project metadata and configuration.

### Dependencies
- Task 02: Install pnpm

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Initialize package.json**
   - Run `pnpm init`
   - Or create manually

3. **Update project metadata**
   - Set name, version, description
   - Add author and license

4. **Configure engines**
   - Specify Node.js version requirement

5. **Add type field**
   - Set to "module" for ES modules

### File Location

```
frontend/
└── package.json
```

### Package.json Structure

| Field | Value |
|-------|-------|
| `name` | @lankacommerce/frontend |
| `version` | 0.1.0 |
| `private` | true |
| `type` | module |

### Project Metadata

| Field | Value |
|-------|-------|
| `description` | LankaCommerce Cloud - Multi-tenant ERP Frontend |
| `author` | LankaCommerce Team |
| `license` | UNLICENSED |

### Engines Configuration

| Engine | Version |
|--------|---------|
| `node` | >=20.0.0 |
| `pnpm` | >=8.0.0 |

### Package Manager Field

Add packageManager field for Corepack:
```
"packageManager": "pnpm@8.15.0"
```

### Expected Outcome
- package.json created
- Metadata configured

### Verification Checklist
- [ ] package.json exists
- [ ] Name set correctly
- [ ] Version set to 0.1.0
- [ ] private is true
- [ ] type is module
- [ ] engines specified

---

## Task 06: Configure Package Scripts

### Overview
Add npm scripts for development, building, linting, and other common tasks.

### Dependencies
- Task 05: Initialize package.json

### Instructions

1. **Add development scripts**
   - dev, build, start

2. **Add quality scripts**
   - lint, lint:fix, format

3. **Add type checking**
   - type-check, type-check:watch

4. **Add testing scripts**
   - test, test:watch, test:coverage

5. **Add utility scripts**
   - clean, analyze

### Script Categories

**Development:**
| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | next dev | Start dev server |
| `build` | next build | Production build |
| `start` | next start | Production server |

**Quality:**
| Script | Command | Purpose |
|--------|---------|---------|
| `lint` | next lint | Run ESLint |
| `lint:fix` | next lint --fix | Fix lint issues |
| `format` | prettier --write . | Format code |
| `format:check` | prettier --check . | Check formatting |

**Type Checking:**
| Script | Command | Purpose |
|--------|---------|---------|
| `type-check` | tsc --noEmit | Check types |
| `type-check:watch` | tsc --noEmit --watch | Watch mode |

**Testing:**
| Script | Command | Purpose |
|--------|---------|---------|
| `test` | vitest run | Run tests |
| `test:watch` | vitest | Watch mode |
| `test:coverage` | vitest --coverage | With coverage |

**Utilities:**
| Script | Command | Purpose |
|--------|---------|---------|
| `clean` | rm -rf .next out | Clean build |
| `analyze` | ANALYZE=true next build | Bundle analysis |

### Cross-Platform Compatibility

For cross-platform scripts:
- Use `rimraf` instead of `rm -rf`
- Use `cross-env` for environment variables

### Expected Outcome
- All scripts configured
- Ready for development workflow

### Verification Checklist
- [ ] dev script added
- [ ] build script added
- [ ] lint scripts added
- [ ] format scripts added
- [ ] test scripts added

---

## Task 07: Create pnpm-workspace.yaml

### Overview
Create pnpm workspace configuration for monorepo package management.

### Dependencies
- Task 02: Install pnpm

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Create pnpm-workspace.yaml**
   - Define workspace packages

3. **Configure package patterns**
   - apps/* for Next.js apps
   - packages/* for shared packages

### File Location

```
frontend/
├── package.json
└── pnpm-workspace.yaml
```

### pnpm-workspace.yaml Content

```yaml
packages:
  # Main application
  - '.'
  # Shared packages (future)
  - 'packages/*'
```

### Workspace Structure (Future)

```
frontend/
├── packages/
│   ├── ui/          # Shared UI components
│   ├── utils/       # Shared utilities
│   └── config/      # Shared configuration
└── (main app files)
```

### Workspace Benefits

| Benefit | Description |
|---------|-------------|
| Shared dependencies | Single node_modules |
| Cross-references | packages can import each other |
| Single lockfile | pnpm-lock.yaml at root |
| Parallel builds | Build multiple packages |

### Package References

Reference workspace packages:
- `"@lankacommerce/ui": "workspace:*"`

### Expected Outcome
- Workspace configuration ready
- Future package structure defined

### Verification Checklist
- [ ] pnpm-workspace.yaml exists
- [ ] Packages pattern defined
- [ ] Current directory included

---

## Task 08: Create .gitignore (Frontend)

### Overview
Create frontend-specific .gitignore file for Node.js and Next.js projects.

### Dependencies
- Task 05: Initialize package.json

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Create .gitignore**
   - Add dependency directories
   - Add build outputs
   - Add environment files
   - Add IDE/editor files

### File Location

```
frontend/
├── .gitignore
├── package.json
└── pnpm-workspace.yaml
```

### .gitignore Categories

**Dependencies:**
| Pattern | Purpose |
|---------|---------|
| `node_modules/` | npm/pnpm packages |
| `.pnpm-store/` | pnpm content-addressable store |

**Build Outputs:**
| Pattern | Purpose |
|---------|---------|
| `.next/` | Next.js build cache |
| `out/` | Static export output |
| `dist/` | Build distribution |
| `build/` | Generic build output |

**Environment:**
| Pattern | Purpose |
|---------|---------|
| `.env` | Base environment |
| `.env.local` | Local overrides |
| `.env.*.local` | Environment-specific local |
| `!.env.example` | Keep example file |

**TypeScript:**
| Pattern | Purpose |
|---------|---------|
| `*.tsbuildinfo` | TypeScript cache |
| `next-env.d.ts` | Auto-generated types |

**Testing:**
| Pattern | Purpose |
|---------|---------|
| `coverage/` | Test coverage reports |
| `.vitest/` | Vitest cache |

**IDE/Editor:**
| Pattern | Purpose |
|---------|---------|
| `.idea/` | JetBrains IDEs |
| `.vscode/` | VS Code (optional) |
| `*.swp` | Vim swap files |
| `.DS_Store` | macOS metadata |

**Logs:**
| Pattern | Purpose |
|---------|---------|
| `*.log` | Log files |
| `npm-debug.log*` | npm debug logs |
| `pnpm-debug.log*` | pnpm debug logs |

### Expected Outcome
- Frontend .gitignore created
- All temporary files excluded

### Verification Checklist
- [ ] .gitignore exists
- [ ] node_modules ignored
- [ ] .next ignored
- [ ] Environment files handled
- [ ] Coverage ignored

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Initialize package.json | Project configuration |
| 06 | Configure Package Scripts | Development scripts |
| 07 | Create pnpm-workspace.yaml | Workspace setup |
| 08 | Create .gitignore (Frontend) | Git exclusions |

### Files Created

```
frontend/
├── .gitignore
├── .npmrc
├── .nvmrc
├── package.json
└── pnpm-workspace.yaml
```

### Package.json Summary

```json
{
  "name": "@lankacommerce/frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write ."
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### Git Commit Message
```
feat(frontend): initialize Node.js environment

- Configure Node.js 20.x with .nvmrc
- Set up pnpm as package manager
- Initialize package.json with scripts
- Create pnpm workspace configuration
- Add frontend-specific .gitignore

SubPhase-03 Group A complete
```

### Next Steps
Proceed to [Group B](../Group-B_NextJS-Project-Creation/00_GROUP_OVERVIEW.md) for Next.js project creation.

---

## Notes for AI Agents

1. **Scoped Name:** Use @lankacommerce scope
2. **Private:** Set true for non-published packages
3. **Type Module:** Enable ES modules
4. **Workspace:** Pattern allows future packages
5. **Git:** Commit after completing Group A
