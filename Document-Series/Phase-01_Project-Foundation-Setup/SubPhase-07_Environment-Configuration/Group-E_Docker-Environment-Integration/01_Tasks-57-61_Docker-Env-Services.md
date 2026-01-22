# Tasks 57-61: Docker Env Services

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** E - Docker Environment Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Frontend-Environment-Variables-Definition/](../Group-D_Frontend-Environment-Variables-Definition/)
- **→ Next Document:** [02_Tasks-62-68_Docker-Celery-Verification.md](02_Tasks-62-68_Docker-Celery-Verification.md)

---

## Document Overview

This document integrates environment variables into Docker services for backend, frontend, and database containers.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create `.env.docker` | Simple |
| 58 | Update docker-compose envs | Medium |
| 59 | Configure backend env for Docker | Medium |
| 60 | Configure frontend env for Docker | Medium |
| 61 | Configure database env for Docker | Simple |

---

## Task 57: Create `.env.docker`

### Overview
Create a Docker-specific environment file for local containerized development.

### Dependencies
- SubPhase-04 Docker Development Environment complete

### Instructions

1. **Create `.env.docker` at repository root**
   - Include Docker-specific values and placeholders

2. **Exclude from version control**
   - Ensure `.env.docker` is not committed

### Expected Outcome
- Root `.env.docker` exists locally and is ignored

### Verification Checklist
- [ ] `.env.docker` exists
- [ ] `.env.docker` is excluded from commits

---

## Task 58: Update docker-compose envs

### Overview
Use environment variables in Docker Compose service configuration.

### Dependencies
- Task 57: Create `.env.docker`

### Instructions

1. **Reference Docker env file**
   - Ensure compose files load `.env.docker`

2. **Use variable interpolation**
   - Replace inline values with environment variable references

### Expected Outcome
- Docker Compose uses `.env.docker` for configuration

### Verification Checklist
- [ ] Compose configuration references `.env.docker`
- [ ] Service values are env-driven

---

## Task 59: Configure backend env for Docker

### Overview
Ensure backend services read required variables in Docker.

### Dependencies
- Task 58: Update docker-compose envs

### Instructions

1. **Map backend environment variables**
   - Provide backend service variables in compose

2. **Document docker-specific values**
   - Explain differences from local dev values

### Expected Outcome
- Backend service loads required env variables in Docker

### Verification Checklist
- [ ] Backend service env variables are mapped
- [ ] Docker-specific differences are documented

---

## Task 60: Configure frontend env for Docker

### Overview
Ensure frontend services read required variables in Docker.

### Dependencies
- Task 59: Configure backend env for Docker

### Instructions

1. **Map frontend environment variables**
   - Provide frontend service variables in compose

2. **Document client exposure**
   - Ensure public variables follow `NEXT_PUBLIC_` rules

### Expected Outcome
- Frontend service loads required env variables in Docker

### Verification Checklist
- [ ] Frontend service env variables are mapped
- [ ] Client exposure rules are respected

---

## Task 61: Configure database env for Docker

### Overview
Ensure database service receives required environment variables.

### Dependencies
- Task 60: Configure frontend env for Docker

### Instructions

1. **Map database environment variables**
   - Provide database user, password, and database name variables

2. **Document values**
   - Note local-only Docker database defaults

### Expected Outcome
- Database service loads required env variables in Docker

### Verification Checklist
- [ ] Database service env variables are mapped
- [ ] Docker defaults documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 57 | Create `.env.docker` | Docker env file created (ignored) |
| 58 | Update docker-compose envs | Compose env references added |
| 59 | Configure backend env for Docker | Backend env mapped |
| 60 | Configure frontend env for Docker | Frontend env mapped |
| 61 | Configure database env for Docker | Database env mapped |

### Next Steps
- Continue with [02_Tasks-62-68_Docker-Celery-Verification.md](02_Tasks-62-68_Docker-Celery-Verification.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 57 through 61 in sequence
2. **No Secrets:** Do not commit `.env.docker`
3. **Interpolation:** Use environment variable interpolation in compose files
