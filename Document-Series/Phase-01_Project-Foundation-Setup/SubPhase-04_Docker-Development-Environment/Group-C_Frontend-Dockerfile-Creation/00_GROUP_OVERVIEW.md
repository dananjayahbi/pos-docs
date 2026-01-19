# Group C: Frontend Dockerfile Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** C of H  
> **Tasks Covered:** 23-34  
> **Group Goal:** Create Dockerfiles for Next.js frontend (development and production)

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Backend-Dockerfile-Creation/](../Group-B_Backend-Dockerfile-Creation/)
- **→ Next Group:** [../Group-D_PostgreSQL-Container-Setup/](../Group-D_PostgreSQL-Container-Setup/)

---

## Group Overview

This group creates the Docker configuration for the Next.js frontend, including development and production Dockerfiles. The development setup enables hot reload while production uses multi-stage builds with standalone output.

### Key Outcomes
- Dockerfile.dev for development with hot reload
- Dockerfile.prod with multi-stage build for optimized production
- pnpm configured for efficient package management
- Frontend-specific .dockerignore

### Technology Context
- **Base Image:** node:20-alpine
- **Package Manager:** pnpm
- **Hot Reload:** Volume mounts with next dev
- **Production:** next start with standalone output

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-23-28_Dev-Dockerfile.md | 23-28 | Create Dockerfile.dev, base image, pnpm, working dir, packages, install |
| 02 | 02_Tasks-29-34_Complete-Dockerfiles.md | 29-34 | Copy code, expose port, dev command, Dockerfile.prod, multi-stage, .dockerignore |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 23 | Create Frontend Dockerfile.dev | Task 03 | Medium |
| 24 | Configure Node Base Image | Task 23 | Simple |
| 25 | Install pnpm Globally | Task 24 | Simple |
| 26 | Create Working Directory | Task 24 | Simple |
| 27 | Copy Package Files | Task 26 | Simple |
| 28 | Install Node Dependencies | Task 27 | Simple |
| 29 | Copy Application Code | Task 28 | Simple |
| 30 | Expose Frontend Port | Task 29 | Simple |
| 31 | Set Development Command | Task 30 | Simple |
| 32 | Create Frontend Dockerfile.prod | Task 23 | Complex |
| 33 | Configure Production Multi-stage Build | Task 32 | Complex |
| 34 | Create frontend/.dockerignore | Task 23 | Simple |

---

## Execution Order

```
01_Tasks-23-28_Dev-Dockerfile.md
        │
        ▼
02_Tasks-29-34_Complete-Dockerfiles.md
```

---

## Expected Deliverables

```
docker/frontend/
├── Dockerfile.dev           # Development Dockerfile
└── Dockerfile.prod          # Production Dockerfile

frontend/
└── .dockerignore            # Frontend-specific ignores
```

---

## Production Multi-stage Build Stages

1. **deps** - Install dependencies only
2. **builder** - Build the Next.js application
3. **runner** - Minimal production image with standalone output

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete
2. **Alpine:** Use Alpine for smaller image sizes
3. **pnpm:** More efficient than npm for Docker layer caching
4. **Standalone:** Use output: 'standalone' in next.config.js for production
5. **Git Commit:** Commit after completing this group
