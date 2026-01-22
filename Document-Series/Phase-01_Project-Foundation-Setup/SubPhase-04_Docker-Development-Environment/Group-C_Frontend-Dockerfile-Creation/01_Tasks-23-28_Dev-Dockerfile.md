# Tasks 23-28: Development Dockerfile

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** C - Frontend Dockerfile Creation  
> **Document:** 01 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Backend-Dockerfile-Creation/03_Tasks-20-22_Prod-Dockerfile.md](../Group-B_Backend-Dockerfile-Creation/03_Tasks-20-22_Prod-Dockerfile.md)
- **→ Next Document:** [02_Tasks-29-34_Complete-Dockerfiles.md](02_Tasks-29-34_Complete-Dockerfiles.md)

---

## Document Overview

This document covers creating the development Dockerfile for the Next.js frontend, including base image configuration, pnpm setup, and dependency installation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 23 | Create Frontend Dockerfile.dev | Medium |
| 24 | Configure Node Base Image | Simple |
| 25 | Install pnpm Globally | Simple |
| 26 | Create Working Directory | Simple |
| 27 | Copy Package Files | Simple |
| 28 | Install Node Dependencies | Simple |

---

## Task 23: Create Frontend Dockerfile.dev

### Overview
Create the development Dockerfile for the Next.js frontend application.

### Dependencies
- Task 03: Create docker/frontend/ Directory

### Instructions

1. **Create Dockerfile.dev**
   - In docker/frontend/

2. **Add header documentation**
   - Purpose and context

3. **Structure for development**
   - Hot reload support

### File Location

```
docker/
└── frontend/
    └── Dockerfile.dev
```

### Initial Structure

```dockerfile
# ==================================================
# LankaCommerce Cloud - Frontend Development Dockerfile
# ==================================================
# Purpose: Development environment with hot reload
# Base: Node.js 20 Alpine
# Package Manager: pnpm
# ==================================================

# Instructions will follow in subsequent tasks
```

### Development Features

| Feature | Implementation |
|---------|---------------|
| Hot reload | next dev with volume mounts |
| Source maps | Development mode |
| Fast refresh | React Fast Refresh |
| Dependencies | All dev packages |

### Expected Outcome
- Dockerfile.dev created
- Header documentation added

### Verification Checklist
- [ ] File exists at docker/frontend/Dockerfile.dev
- [ ] Purpose documented
- [ ] Ready for instructions

---

## Task 24: Configure Node Base Image

### Overview
Configure the Node.js base image for the frontend container.

### Dependencies
- Task 23: Create Frontend Dockerfile.dev

### Instructions

1. **Select base image**
   - Node.js 20 Alpine

2. **Add FROM instruction**
   - First line after comments

3. **Document choice**
   - Why Alpine

### Base Image Selection

| Variant | Size | Pros | Cons |
|---------|------|------|------|
| node:20 | ~1GB | Full toolchain | Large |
| node:20-slim | ~200MB | Smaller | Some tools missing |
| node:20-alpine | ~140MB | Smallest | Alpine quirks |

### Dockerfile Addition

```dockerfile
# Base image - Node.js 20 Alpine for smallest size
FROM node:20-alpine AS development
```

### Why Alpine for Frontend

| Reason | Benefit |
|--------|---------|
| Size | ~140MB vs ~1GB |
| Security | Minimal packages |
| Speed | Fast pull/push |
| Sufficient | Node works perfectly |

### Alpine Considerations

May need to install:
- libc6-compat (glibc compatibility)
- python3 (some native modules)

### Expected Outcome
- Base image configured
- Development stage named

### Verification Checklist
- [ ] FROM instruction added
- [ ] node:20-alpine selected
- [ ] Stage named "development"

---

## Task 25: Install pnpm Globally

### Overview
Install pnpm package manager globally in the container.

### Dependencies
- Task 24: Configure Node Base Image

### Instructions

1. **Enable corepack**
   - Built-in pnpm support

2. **Or install via npm**
   - Alternative method

3. **Set pnpm store**
   - Optimize caching

### pnpm Installation Options

| Method | Command | Pros |
|--------|---------|------|
| Corepack | corepack enable | Built-in |
| npm | npm i -g pnpm | Explicit |

### Dockerfile Addition (Corepack)

```dockerfile
# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
```

### Dockerfile Addition (Alternative)

```dockerfile
# Install pnpm globally
RUN npm install -g pnpm
```

### pnpm Environment

```dockerfile
# Environment variables for pnpm
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"
```

### Why pnpm for Docker

| Benefit | Description |
|---------|-------------|
| Content-addressable | Shared packages |
| Faster installs | Hard links |
| Smaller node_modules | Symlinks |
| Better layer caching | Lockfile-based |

### Expected Outcome
- pnpm installed globally
- Ready for package installation

### Verification Checklist
- [ ] Corepack enabled or pnpm installed
- [ ] PNPM_HOME set
- [ ] PATH updated

---

## Task 26: Create Working Directory

### Overview
Create and set the working directory for the Next.js application.

### Dependencies
- Task 24: Configure Node Base Image

### Instructions

1. **Create /app directory**
   - Standard location

2. **Set as WORKDIR**
   - All commands run here

3. **Document structure**
   - Planned layout

### Dockerfile Addition

```dockerfile
# Set working directory
WORKDIR /app
```

### Directory Structure Inside Container

```
/app/
├── public/           # Static assets
├── src/              # Source code
│   ├── app/          # App Router
│   ├── components/   # Components
│   └── ...
├── package.json
├── pnpm-lock.yaml
├── next.config.js
└── tsconfig.json
```

### Expected Outcome
- Working directory created
- All paths relative to /app

### Verification Checklist
- [ ] WORKDIR instruction added
- [ ] Set to /app
- [ ] Before COPY commands

---

## Task 27: Copy Package Files

### Overview
Copy package files for dependency installation with layer caching.

### Dependencies
- Task 26: Create Working Directory

### Instructions

1. **Copy package.json**
   - Primary manifest

2. **Copy pnpm-lock.yaml**
   - Lock file for reproducibility

3. **Copy .npmrc if exists**
   - pnpm configuration

### Dockerfile Addition

```dockerfile
# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./
```

### Optional Files

```dockerfile
# Copy pnpm workspace config (monorepo)
COPY pnpm-workspace.yaml* ./

# Copy .npmrc (registry config)
COPY .npmrc* ./
```

### Layer Caching Strategy

```dockerfile
# Good - package files first
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Then copy source (changes more often)
COPY . .
```

| Change | Rebuild |
|--------|---------|
| package.json | Install deps |
| Source only | Skip install |

### Expected Outcome
- Package files copied
- Layer caching enabled

### Verification Checklist
- [ ] COPY instruction added
- [ ] package.json copied
- [ ] pnpm-lock.yaml copied
- [ ] Before pnpm install

---

## Task 28: Install Node Dependencies

### Overview
Install Node.js dependencies using pnpm.

### Dependencies
- Task 27: Copy Package Files

### Instructions

1. **Run pnpm install**
   - Install all dependencies

2. **Include dev dependencies**
   - Needed for development

3. **Use frozen lockfile**
   - Reproducible builds

### Dockerfile Addition

```dockerfile
# Install dependencies
RUN pnpm install --frozen-lockfile
```

### Install Options

| Option | Purpose |
|--------|---------|
| --frozen-lockfile | Exact versions from lock |
| --prod | Production only |
| --shamefully-hoist | Flat node_modules |

### Development Dependencies

Includes:
| Package | Purpose |
|---------|---------|
| typescript | Type checking |
| eslint | Linting |
| @types/* | Type definitions |
| tailwindcss | CSS (needs PostCSS) |

### Layer Caching

With proper ordering:
- If package.json unchanged → cached
- ~3-5 minute save on rebuilds

### Expected Outcome
- All dependencies installed
- Reproducible builds

### Verification Checklist
- [ ] RUN instruction added
- [ ] pnpm install executed
- [ ] --frozen-lockfile used
- [ ] Dev deps included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 23 | Create Frontend Dockerfile.dev | Dockerfile created |
| 24 | Configure Node Base Image | node:20-alpine |
| 25 | Install pnpm Globally | Package manager |
| 26 | Create Working Directory | /app WORKDIR |
| 27 | Copy Package Files | Layer caching |
| 28 | Install Node Dependencies | pnpm install |

### Dockerfile.dev Progress

```dockerfile
# ==================================================
# LankaCommerce Cloud - Frontend Development Dockerfile
# ==================================================

# Base image
FROM node:20-alpine AS development

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# pnpm environment
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile
```

### Next Steps
Proceed to [02_Tasks-29-34_Complete-Dockerfiles.md](02_Tasks-29-34_Complete-Dockerfiles.md) to complete the Dockerfiles.

---

## Notes for AI Agents

1. **Alpine:** Use libc6-compat if needed
2. **Corepack:** Preferred pnpm installation
3. **Layer order:** Package files before source
4. **Frozen lockfile:** Reproducible builds
5. **Volume mounts:** Overwrite /app in dev
6. **Git:** Do NOT commit yet - complete Group C first
