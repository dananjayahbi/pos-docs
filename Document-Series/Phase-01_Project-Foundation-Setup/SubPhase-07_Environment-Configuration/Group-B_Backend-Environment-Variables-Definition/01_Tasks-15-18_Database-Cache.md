# Tasks 15-18: Database & Cache

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** B - Backend Environment Variables Definition  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Backend-Environment-Setup-django-environ/](../Group-A_Backend-Environment-Setup-django-environ/)
- **→ Next Document:** [02_Tasks-19-24_External-Services.md](02_Tasks-19-24_External-Services.md)

---

## Document Overview

This document defines backend environment variables for database and cache services used by the Django stack.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Define DATABASE_URL | Medium |
| 16 | Define REDIS_URL | Simple |
| 17 | Define CELERY_BROKER_URL | Simple |
| 18 | Define CELERY_RESULT_BACKEND | Simple |

---

## Task 15: Define DATABASE_URL

### Overview
Specify the database connection URL used by the backend.

### Dependencies
- Group A completed

### Instructions

1. **Add variable to `.env.example`**
   - Include a placeholder connection string format

2. **Update settings usage**
   - Ensure settings read the database URL through env loader

### Expected Outcome
- DATABASE_URL is defined and documented

### Verification Checklist
- [ ] DATABASE_URL appears in `.env.example`
- [ ] Settings read DATABASE_URL from environment

---

## Task 16: Define REDIS_URL

### Overview
Define the Redis connection URL for cache and Celery usage.

### Dependencies
- Task 15: Define DATABASE_URL

### Instructions

1. **Add variable to `.env.example`**
   - Provide Redis URL placeholder

2. **Wire into cache settings**
   - Ensure caching uses the env-provided value

### Expected Outcome
- REDIS_URL is defined and documented

### Verification Checklist
- [ ] REDIS_URL appears in `.env.example`
- [ ] Cache settings read REDIS_URL

---

## Task 17: Define CELERY_BROKER_URL

### Overview
Configure the Celery broker URL using environment variables.

### Dependencies
- Task 16: Define REDIS_URL

### Instructions

1. **Add variable to `.env.example`**
   - Provide broker URL placeholder

2. **Wire into Celery settings**
   - Ensure broker URL is env-driven

### Expected Outcome
- CELERY_BROKER_URL is defined and documented

### Verification Checklist
- [ ] CELERY_BROKER_URL appears in `.env.example`
- [ ] Celery configuration reads the variable

---

## Task 18: Define CELERY_RESULT_BACKEND

### Overview
Configure the Celery result backend using environment variables.

### Dependencies
- Task 17: Define CELERY_BROKER_URL

### Instructions

1. **Add variable to `.env.example`**
   - Provide result backend URL placeholder

2. **Wire into Celery settings**
   - Ensure result backend uses env values

### Expected Outcome
- CELERY_RESULT_BACKEND is defined and documented

### Verification Checklist
- [ ] CELERY_RESULT_BACKEND appears in `.env.example`
- [ ] Celery result backend reads the variable

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Define DATABASE_URL | Database URL documented |
| 16 | Define REDIS_URL | Redis URL documented |
| 17 | Define CELERY_BROKER_URL | Celery broker URL documented |
| 18 | Define CELERY_RESULT_BACKEND | Celery result backend documented |

### Next Steps
- Continue with [02_Tasks-19-24_External-Services.md](02_Tasks-19-24_External-Services.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 18 in sequence
2. **No Secrets:** Use placeholders in `.env.example`
3. **Formats:** Use standard URL formats for services
