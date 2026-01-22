# Tasks 01-04: Node.js Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** A - Node.js Environment Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../SubPhase-02_Backend-Project-Initialization/Group-G_Management-Commands-Utilities/02_Tasks-76-78_Health-Test-Verify.md](../../SubPhase-02_Backend-Project-Initialization/Group-G_Management-Commands-Utilities/02_Tasks-76-78_Health-Test-Verify.md)
- **→ Next Document:** [02_Tasks-05-08_Package-Config.md](02_Tasks-05-08_Package-Config.md)

---

## Document Overview

This document covers verifying Node.js installation, installing pnpm package manager, and creating version management configuration files.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Verify Node.js Version | Simple |
| 02 | Install pnpm | Simple |
| 03 | Create .nvmrc File | Simple |
| 04 | Create .npmrc File | Simple |

---

## Task 01: Verify Node.js Version

### Overview
Verify that Node.js 20.x LTS is installed and configured correctly.

### Dependencies
- SubPhase-01: Monorepo Structure Setup

### Instructions

1. **Check Node.js version**
   - Run `node --version`
   - Verify version 20.x or higher

2. **Check npm version**
   - Run `npm --version`
   - Verify npm is available

3. **Install if missing**
   - Download from nodejs.org
   - Or use nvm for version management

4. **Set as default (if using nvm)**
   - `nvm alias default 20`

### Version Requirements

| Tool | Minimum Version | Recommended |
|------|----------------|-------------|
| Node.js | 20.0.0 | 20.12.x LTS |
| npm | 10.0.0 | Latest |

### Node.js 20 Features

| Feature | Benefit |
|---------|---------|
| ESM Support | Native ES modules |
| Fetch API | Built-in HTTP client |
| WebStreams | Modern stream handling |
| Test Runner | Native testing |

### Version Check Commands

| Command | Purpose |
|---------|---------|
| `node --version` | Show Node.js version |
| `npm --version` | Show npm version |
| `which node` (Unix) | Show Node.js path |
| `where node` (Windows) | Show Node.js path |

### Expected Outcome
- Node.js 20.x LTS verified
- npm available

### Verification Checklist
- [ ] Node.js version 20.x confirmed
- [ ] npm version 10.x confirmed
- [ ] Node.js in PATH

---

## Task 02: Install pnpm

### Overview
Install pnpm as the preferred package manager for its speed and monorepo efficiency.

### Dependencies
- Task 01: Verify Node.js Version

### Instructions

1. **Install pnpm globally**
   - Use npm: `npm install -g pnpm`
   - Or use corepack: `corepack enable pnpm`

2. **Verify installation**
   - Run `pnpm --version`

3. **Configure corepack (recommended)**
   - Corepack manages package manager versions
   - Built into Node.js 16.10+

### Installation Methods

| Method | Command |
|--------|---------|
| npm | `npm install -g pnpm` |
| Corepack | `corepack enable pnpm` |
| Homebrew (macOS) | `brew install pnpm` |
| Scoop (Windows) | `scoop install pnpm` |

### pnpm Version Requirements

| Tool | Minimum Version |
|------|----------------|
| pnpm | 8.0.0 |

### pnpm Benefits

| Feature | Benefit |
|---------|---------|
| Content-addressable | Shared dependencies |
| Strict | No phantom dependencies |
| Fast | Faster than npm/yarn |
| Monorepo | Native workspace support |

### Corepack Setup

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Expected Outcome
- pnpm installed globally
- Version 8.x or higher

### Verification Checklist
- [ ] pnpm installed
- [ ] `pnpm --version` shows 8.x+
- [ ] pnpm in PATH

---

## Task 03: Create .nvmrc File

### Overview
Create .nvmrc file to specify the Node.js version for the project.

### Dependencies
- Task 01: Verify Node.js Version

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Create .nvmrc file**
   - Create file with version number only

3. **Verify file content**
   - Should contain just the version

### File Location

```
frontend/
└── .nvmrc
```

### .nvmrc Content

```
20
```

Or with specific version:
```
20.12.0
```

### Version Specification

| Format | Example | Description |
|--------|---------|-------------|
| Major only | `20` | Latest 20.x |
| Major.minor | `20.12` | Latest 20.12.x |
| Full version | `20.12.0` | Exact version |

### nvm Usage

| Command | Action |
|---------|--------|
| `nvm use` | Use version in .nvmrc |
| `nvm install` | Install version in .nvmrc |
| `nvm alias default $(cat .nvmrc)` | Set as default |

### Cross-Platform Compatibility

.nvmrc works with:
- nvm (Unix/macOS)
- nvm-windows
- fnm (Fast Node Manager)
- asdf with nodejs plugin

### Expected Outcome
- .nvmrc file created
- Node version specified

### Verification Checklist
- [ ] .nvmrc file exists
- [ ] Contains Node.js 20 version
- [ ] `nvm use` works (if nvm installed)

---

## Task 04: Create .npmrc File

### Overview
Create .npmrc file to configure npm/pnpm behavior for the project.

### Dependencies
- Task 02: Install pnpm

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Create .npmrc file**
   - Add pnpm-specific settings
   - Configure registry settings

3. **Set essential options**
   - Strict peer dependencies
   - Auto-install peers
   - Lockfile settings

### File Location

```
frontend/
├── .nvmrc
└── .npmrc
```

### .npmrc Content

| Setting | Value | Purpose |
|---------|-------|---------|
| `engine-strict` | true | Enforce engine versions |
| `auto-install-peers` | true | Auto-install peer deps |
| `strict-peer-dependencies` | false | Allow minor mismatches |
| `save-exact` | false | Allow range versions |

### Recommended Configuration

```
# Package Manager Settings
engine-strict=true
auto-install-peers=true
strict-peer-dependencies=false

# Registry (default npm)
registry=https://registry.npmjs.org/

# Lockfile
lockfile=true
prefer-frozen-lockfile=true
```

### pnpm-Specific Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `shamefully-hoist` | false | Strict node_modules |
| `public-hoist-pattern` | [] | Hoisting patterns |

### Security Settings

| Setting | Purpose |
|---------|---------|
| `audit` | Run security audit on install |
| `fund` | Show funding messages |

### Expected Outcome
- .npmrc file created
- pnpm configured correctly

### Verification Checklist
- [ ] .npmrc file exists
- [ ] engine-strict enabled
- [ ] auto-install-peers enabled
- [ ] Registry configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Verify Node.js Version | Node.js 20.x confirmed |
| 02 | Install pnpm | Package manager installed |
| 03 | Create .nvmrc File | Version specification |
| 04 | Create .npmrc File | npm/pnpm configuration |

### Files Created

```
frontend/
├── .nvmrc      # Node version: 20
└── .npmrc      # pnpm configuration
```

### Version Summary

| Tool | Version |
|------|---------|
| Node.js | 20.x LTS |
| npm | 10.x |
| pnpm | 8.x |

### Next Steps
Proceed to [02_Tasks-05-08_Package-Config.md](02_Tasks-05-08_Package-Config.md) for package.json and workspace configuration.

---

## Notes for AI Agents

1. **Node Version:** Must be 20.x LTS
2. **pnpm:** Required for workspace features
3. **Corepack:** Recommended for version management
4. **.nvmrc:** Works with nvm, fnm, asdf
5. **Git:** Do NOT commit yet - complete all Group A tasks first
