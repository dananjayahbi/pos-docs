# Group G: Management Commands & Utilities

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** G of G (Final)  
> **Tasks Covered:** 73-78  
> **Group Goal:** Create essential management commands and verify complete setup

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_ASGI-Server-Configuration/](../Group-F_ASGI-Server-Configuration/)
- **→ Next SubPhase:** [../../SubPhase-03_Frontend-Project-Initialization/](../../SubPhase-03_Frontend-Project-Initialization/)

---

## Group Overview

This final group creates essential Django management commands for development and deployment workflows, sets up pytest configuration, and performs final verification of the complete backend setup.

### Key Outcomes
- Custom management commands created (wait_for_db, create_superuser, seed_data)
- Health check endpoint for monitoring
- Pytest configuration with fixtures
- Full setup verification completed

### Technology Context
- **Management Commands:** Django BaseCommand pattern
- **Health Check:** Simple endpoint for load balancers/monitoring
- **Testing:** pytest with django-pytest plugin
- **Fixtures:** Factory pattern with factory-boy

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-73-75_Management-Commands.md | 73-75 | Create wait_for_db, create_superuser, seed_data commands |
| 02 | 02_Tasks-76-78_Health-Test-Verify.md | 76-78 | Create health_check, conftest.py, verify full setup |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 73 | Create wait_for_db Command | Task 52 | Medium |
| 74 | Create create_superuser Command | Task 54 | Medium |
| 75 | Create seed_data Command | Task 52 | Medium |
| 76 | Create health_check View | Task 52 | Simple |
| 77 | Create conftest.py | Task 35 | Medium |
| 78 | Verify Full Setup | Tasks 73-77 | Complex |

---

## Execution Order

```
01_Tasks-73-75_Management-Commands.md
        │
        ▼
02_Tasks-76-78_Health-Test-Verify.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── core/
│       ├── management/
│       │   └── commands/
│       │       ├── __init__.py
│       │       ├── wait_for_db.py
│       │       ├── create_superuser.py
│       │       └── seed_data.py
│       └── views.py           # health_check added
├── config/
│   └── urls.py                # health/ endpoint added
├── tests/
│   └── conftest.py            # Pytest fixtures
└── pytest.ini                 # Pytest configuration
```

---

## Management Commands Overview

**wait_for_db:**
- Waits for database to be available
- Used in Docker entrypoint scripts
- Retries with exponential backoff

**create_superuser:**
- Creates superuser non-interactively
- Uses environment variables for credentials
- Idempotent - doesn't fail if user exists

**seed_data:**
- Populates database with initial data
- Useful for development and demos
- Creates sample tenants, users, products

---

## Health Check Endpoint

**URL:** `/health/`
**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## Verification Checklist (Task 78)

- [ ] Django check passes: `python manage.py check`
- [ ] Migrations work: `python manage.py makemigrations --dry-run`
- [ ] Server starts: `python manage.py runserver`
- [ ] Tests pass: `pytest`
- [ ] Health check responds: `curl localhost:8000/health/`
- [ ] All commands available: `python manage.py --help`

---

## Notes for AI Agents

1. **Final Group:** This completes SubPhase-02
2. **Command Location:** Commands go in apps/core/management/commands/
3. **Pytest Config:** Use pytest.ini or pyproject.toml for configuration
4. **Health Check:** Should check DB and Redis connectivity
5. **Verification:** Run all checks before marking SubPhase complete
6. **Git Commit:** Final commit with message "feat: complete backend project initialization"
7. **Next Steps:** Proceed to SubPhase-03 for Frontend Project Initialization
