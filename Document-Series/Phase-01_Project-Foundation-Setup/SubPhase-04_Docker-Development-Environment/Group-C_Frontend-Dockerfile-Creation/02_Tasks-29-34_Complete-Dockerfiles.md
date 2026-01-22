# Tasks 29-34: Complete Dockerfiles

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** C - Frontend Dockerfile Creation  
> **Document:** 02 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-23-28_Dev-Dockerfile.md](01_Tasks-23-28_Dev-Dockerfile.md)
- **→ Next Group:** [../Group-D_PostgreSQL-Container-Setup/00_GROUP_OVERVIEW.md](../Group-D_PostgreSQL-Container-Setup/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers completing the development Dockerfile and creating the production Dockerfile with multi-stage builds for the Next.js frontend.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Copy Application Code | Simple |
| 30 | Expose Port 3000 | Simple |
| 31 | Set Development Command | Simple |
| 32 | Create Frontend Dockerfile.prod | Medium |
| 33 | Multi-Stage Production Build | Complex |
| 34 | Create Frontend .dockerignore | Simple |

---

## Task 29: Copy Application Code

### Overview
Copy the application source code into the container.

### Dependencies
- Task 28: Install Node Dependencies

### Instructions

1. **Copy all source files**
   - After dependencies installed

2. **Follow layer caching**
   - Source changes often

3. **Exclude via .dockerignore**
   - Created in Task 34

### Dockerfile Addition

```dockerfile
# Copy application source
COPY . .
```

### What Gets Copied

| Directory | Contents |
|-----------|----------|
| src/ | Application source |
| public/ | Static assets |
| next.config.js | Next.js config |
| tsconfig.json | TypeScript config |
| tailwind.config.ts | Tailwind config |
| postcss.config.js | PostCSS config |

### What Gets Excluded

Via .dockerignore:
| Excluded | Reason |
|----------|--------|
| node_modules | Installed in container |
| .next | Build output |
| .git | Source control |
| *.log | Logs |

### Expected Outcome
- Source code copied
- Ready for development

### Verification Checklist
- [ ] COPY . . added
- [ ] After dependency install
- [ ] .dockerignore excludes volumes

---

## Task 30: Expose Port 3000

### Overview
Expose the Next.js development server port.

### Dependencies
- Task 29: Copy Application Code

### Instructions

1. **Add EXPOSE instruction**
   - Document port 3000

2. **Document purpose**
   - Next.js dev server

### Dockerfile Addition

```dockerfile
# Expose port
EXPOSE 3000
```

### Port Usage

| Port | Service |
|------|---------|
| 3000 | Next.js dev server |

### EXPOSE Purpose

| Function | Description |
|----------|-------------|
| Documentation | Shows intent |
| Docker networks | Inter-container |
| Not published | Still need -p flag |

### Expected Outcome
- Port 3000 documented
- Ready for port mapping

### Verification Checklist
- [ ] EXPOSE 3000 added
- [ ] Before CMD

---

## Task 31: Set Development Command

### Overview
Set the command to start the Next.js development server.

### Dependencies
- Task 30: Expose Port 3000

### Instructions

1. **Use CMD instruction**
   - Overridable default

2. **Run next dev**
   - Development mode

3. **Bind to 0.0.0.0**
   - Accessible outside container

### Dockerfile Addition

```dockerfile
# Start development server
CMD ["pnpm", "dev"]
```

### package.json Script

The CMD runs this script:
```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

### Network Binding

For container access:
| Binding | Access |
|---------|--------|
| localhost | Container only |
| 0.0.0.0 | All interfaces |

May need script update:
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0"
  }
}
```

### Complete Development Dockerfile

```dockerfile
# ==================================================
# LankaCommerce Cloud - Frontend Development Dockerfile
# ==================================================
# Purpose: Development environment with hot reload
# Base: Node.js 20 Alpine
# Package Manager: pnpm
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

# Copy application source
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev"]
```

### Expected Outcome
- Development command set
- Dockerfile.dev complete

### Verification Checklist
- [ ] CMD instruction added
- [ ] pnpm dev command
- [ ] Server accessible

---

## Task 32: Create Frontend Dockerfile.prod

### Overview
Create the production Dockerfile for the Next.js application.

### Dependencies
- Task 03: Create docker/frontend/ Directory

### Instructions

1. **Create Dockerfile.prod**
   - In docker/frontend/

2. **Use multi-stage build**
   - Optimized size

3. **Document stages**
   - deps, builder, runner

### File Location

```
docker/
└── frontend/
    ├── Dockerfile.dev
    └── Dockerfile.prod
```

### Production Goals

| Goal | Implementation |
|------|----------------|
| Small image | Multi-stage |
| Security | Non-root user |
| Performance | Standalone output |
| Reliability | Health checks |

### Stage Overview

```
deps → builder → runner
  │        │         │
  │        │         └── Final minimal image
  │        └── Build Next.js standalone
  └── Install production deps
```

### Expected Outcome
- Dockerfile.prod created
- Multi-stage structure defined

### Verification Checklist
- [ ] File created
- [ ] Multi-stage planned

---

## Task 33: Multi-Stage Production Build

### Overview
Implement the multi-stage production build with three stages.

### Dependencies
- Task 32: Create Frontend Dockerfile.prod

### Instructions

1. **Stage 1: deps**
   - Install production dependencies

2. **Stage 2: builder**
   - Build Next.js application

3. **Stage 3: runner**
   - Minimal production image

### Complete Dockerfile.prod

```dockerfile
# ==================================================
# LankaCommerce Cloud - Frontend Production Dockerfile
# ==================================================
# Purpose: Optimized production build
# Output: ~100MB final image
# Stages: deps → builder → runner
# ==================================================

# ===== Stage 1: Install dependencies =====
FROM node:20-alpine AS deps

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# ===== Stage 2: Build application =====
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install ALL dependencies (need dev for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN pnpm build

# ===== Stage 3: Production runner =====
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
```

### Stage Details

#### Stage 1: deps
| Task | Purpose |
|------|---------|
| pnpm install --prod | Prod deps only |
| Separate stage | Better caching |

#### Stage 2: builder
| Task | Purpose |
|------|---------|
| All dependencies | Build tools |
| pnpm build | Create .next |
| Build args | Inject env vars |

#### Stage 3: runner
| Task | Purpose |
|------|---------|
| Non-root user | Security |
| Standalone output | Minimal files |
| Health check | Container health |

### next.config.js Requirement

For standalone output:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}
module.exports = nextConfig
```

### Image Size Comparison

| Approach | Size |
|----------|------|
| No multi-stage | ~1GB |
| Multi-stage | ~150MB |
| With standalone | ~100MB |

### Environment Variables

| Variable | Stage | Purpose |
|----------|-------|---------|
| NEXT_PUBLIC_API_URL | Build | API base URL |
| NODE_ENV | Runner | Production mode |
| NEXT_TELEMETRY_DISABLED | Runner | Disable telemetry |

### Expected Outcome
- Multi-stage build complete
- Optimized production image

### Verification Checklist
- [ ] Three stages defined
- [ ] Non-root user created
- [ ] Standalone output used
- [ ] Health check added

---

## Task 34: Create Frontend .dockerignore

### Overview
Create the .dockerignore file for the frontend directory.

### Dependencies
- Task 32: Create Frontend Dockerfile.prod

### Instructions

1. **Create .dockerignore**
   - In frontend/ directory

2. **Exclude build artifacts**
   - .next, node_modules

3. **Exclude development files**
   - .git, logs

### File Location

```
frontend/
├── .dockerignore
├── src/
└── ...
```

### Frontend .dockerignore

```dockerignore
# ==================================================
# LankaCommerce Cloud - Frontend .dockerignore
# ==================================================

# Dependencies (installed in container)
node_modules
.pnpm-store

# Build outputs
.next
out
dist
build

# Git
.git
.gitignore

# IDE
.idea
.vscode
*.swp

# Environment files
.env
.env.local
.env.development
.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# Testing
coverage
.nyc_output
playwright-report
test-results

# TypeScript
*.tsbuildinfo

# OS files
.DS_Store
Thumbs.db

# Docker files (not needed in context)
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
README.md
docs/
*.md

# Storybook
storybook-static
.storybook

# Misc
.turbo
.vercel
```

### Exclusion Categories

| Category | Files | Reason |
|----------|-------|--------|
| Dependencies | node_modules | Installed fresh |
| Build | .next | Built in container |
| Git | .git | Not needed |
| IDE | .vscode | Dev only |
| Env | .env* | Different per env |
| Logs | *.log | Transient |
| Tests | coverage | Not for prod |

### Expected Outcome
- .dockerignore created
- Build context optimized

### Verification Checklist
- [ ] File created in frontend/
- [ ] node_modules excluded
- [ ] .next excluded
- [ ] .git excluded
- [ ] .env files excluded

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Copy Application Code | COPY . . |
| 30 | Expose Port 3000 | EXPOSE instruction |
| 31 | Set Development Command | CMD pnpm dev |
| 32 | Create Frontend Dockerfile.prod | Production file |
| 33 | Multi-Stage Production Build | 3-stage build |
| 34 | Create Frontend .dockerignore | Build context filter |

### Files Created/Modified
| File | Location |
|------|----------|
| Dockerfile.dev | docker/frontend/ (completed) |
| Dockerfile.prod | docker/frontend/ |
| .dockerignore | frontend/ |

### Final Container Sizes

| Container | Dev | Prod |
|-----------|-----|------|
| Frontend | ~500MB | ~100MB |

### Next Steps
Proceed to [../Group-D_PostgreSQL-Container-Setup/00_GROUP_OVERVIEW.md](../Group-D_PostgreSQL-Container-Setup/00_GROUP_OVERVIEW.md) for database container configuration.

---

## Notes for AI Agents

1. **Standalone output:** Requires next.config.js setting
2. **Build args:** Inject NEXT_PUBLIC_* at build time
3. **Non-root user:** nextjs:nodejs with UID 1001
4. **Health check:** Uses /api/health endpoint
5. **pnpm:** Enabled via corepack
6. **Git:** Commit Group C files together after Group H
