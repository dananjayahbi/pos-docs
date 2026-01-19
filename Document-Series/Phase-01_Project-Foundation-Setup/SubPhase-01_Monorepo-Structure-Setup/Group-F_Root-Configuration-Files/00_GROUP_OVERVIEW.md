# Group F: Root Configuration Files

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** F of F (Final)  
> **Tasks Covered:** 61-67  
> **Group Goal:** Create root-level configuration files for Docker, Make, and GitHub

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Shared-Support-Directories/](../Group-E_Shared-Support-Directories/)
- **→ Next SubPhase:** [../../SubPhase-02_Backend-Project-Initialization/](../../SubPhase-02_Backend-Project-Initialization/)

---

## Group Overview

This final group creates the essential root-level configuration files for development workflow, containerization, and GitHub integration. These files tie together all the directories created in previous groups.

### Key Outcomes
- Docker Compose configurations for development and production
- Makefile with common development commands
- GitHub Actions workflow directory structure
- GitHub issue and PR templates
- VS Code workspace settings

### Technology Context
- **Containerization:** Docker Compose for multi-service orchestration
- **Build Automation:** Makefile for command shortcuts
- **CI/CD:** GitHub Actions workflows
- **IDE:** VS Code with workspace-specific settings

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-61-63_Docker-Make.md | 61-63 | Create docker-compose.yml, docker-compose.prod.yml, Makefile |
| 02 | 02_Tasks-64-67_GitHub-VSCode.md | 64-67 | Create .github/workflows, ISSUE_TEMPLATE, PR template, VS Code settings |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 61 | Create docker-compose.yml | Task 14 | Complex |
| 62 | Create docker-compose.prod.yml | Task 61 | Medium |
| 63 | Create Makefile | Task 01 | Complex |
| 64 | Create .github/workflows/ Directory | Task 17 | Simple |
| 65 | Create .github/ISSUE_TEMPLATE/ Directory | Task 17 | Simple |
| 66 | Create .github/PULL_REQUEST_TEMPLATE.md | Task 17 | Medium |
| 67 | Create .vscode/settings.json | Task 18 | Medium |

---

## Execution Order

```
01_Tasks-61-63_Docker-Make.md
        │
        ▼
02_Tasks-64-67_GitHub-VSCode.md
```

---

## Expected Deliverables

After completing this group, the root level will have:

```
lankacommerce-cloud/
├── .github/
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   │   └── .gitkeep
│   ├── workflows/           # GitHub Actions
│   │   └── .gitkeep
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/
│   └── settings.json        # Workspace settings
├── docker-compose.prod.yml  # Production compose
├── docker-compose.yml       # Development compose
└── Makefile                 # Command shortcuts
```

---

## Docker Compose Services Overview

**Development (docker-compose.yml):**
- `backend` - Django development server with hot reload
- `frontend` - Next.js development server with hot reload
- `db` - PostgreSQL 15 database
- `redis` - Redis for caching and Celery

**Production (docker-compose.prod.yml):**
- Extends development configuration
- Uses production-optimized builds
- Adds nginx reverse proxy
- Configures proper networking and volumes

---

## Makefile Commands Overview

Essential commands to include:
- `make dev` - Start development environment
- `make up` / `make down` - Container management
- `make logs` - View container logs
- `make migrate` - Run database migrations
- `make shell` - Open Django shell
- `make test` - Run all tests
- `make lint` - Run linters
- `make format` - Format code

---

## Notes for AI Agents

1. **Dependencies:** Requires Tasks 01, 14, 17, 18 from Groups A and B
2. **Task 61 is Complex:** docker-compose.yml requires careful service definition
3. **Task 63 is Complex:** Makefile should include all common commands
4. **Final Group:** This completes SubPhase-01
5. **Verification:** After completion, verify with `make help` and `docker compose config`
6. **Git Commit:** Final commit with message "chore: add Docker, Make, and GitHub configurations"
7. **Next Steps:** Proceed to SubPhase-02 for Backend Project Initialization
