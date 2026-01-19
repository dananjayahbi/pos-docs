# Group F: ASGI & Server Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** F of G  
> **Tasks Covered:** 66-72  
> **Group Goal:** Configure async server and WebSocket support

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Django-Apps-Directory-Setup/](../Group-E_Django-Apps-Directory-Setup/)
- **→ Next Group:** [../Group-G_Management-Commands-Utilities/](../Group-G_Management-Commands-Utilities/)

---

## Group Overview

This group configures the Django project for async operation using ASGI servers and Django Channels for WebSocket support. This enables real-time features like live updates, notifications, and POS synchronization.

### Key Outcomes
- ASGI servers installed (Uvicorn for dev, Daphne for production)
- Django Channels configured for WebSocket support
- Redis channel layer for WebSocket message routing
- Deployment configuration files created (Procfile, runtime.txt)

### Technology Context
- **ASGI Servers:** Uvicorn (development), Daphne (production)
- **WebSocket:** Django Channels
- **Channel Layer:** Redis for cross-process messaging
- **Deployment:** Heroku-compatible Procfile

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-66-69_ASGI-Channels.md | 66-69 | Install uvicorn, daphne, configure ASGI, install channels |
| 02 | 02_Tasks-70-72_Channel-Deploy.md | 70-72 | Configure channel layers, create Procfile, runtime.txt |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 66 | Install uvicorn | Task 09 | Simple |
| 67 | Install daphne | Task 09 | Simple |
| 68 | Configure ASGI Application | Task 15 | Medium |
| 69 | Install channels | Task 09 | Simple |
| 70 | Configure Channel Layers | Task 69 | Medium |
| 71 | Create Procfile | Task 66 | Simple |
| 72 | Create runtime.txt | Task 01 | Simple |

---

## Execution Order

```
01_Tasks-66-69_ASGI-Channels.md
        │
        ▼
02_Tasks-70-72_Channel-Deploy.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   ├── asgi.py              # Updated with Channels routing
│   └── settings/
│       └── base.py          # Updated with CHANNEL_LAYERS
├── Procfile                 # Process types for deployment
└── runtime.txt              # Python version specification
```

---

## ASGI Configuration Overview

**asgi.py Structure:**
```
ProtocolTypeRouter
├── http → Django ASGI application
└── websocket → AuthMiddlewareStack
                └── URLRouter → WebSocket routes
```

**Channel Layers:**
- Development: InMemoryChannelLayer
- Production: Redis channel layer

---

## Server Comparison

| Server | Use Case | Command |
|--------|----------|---------|
| Uvicorn | Development | `uvicorn config.asgi:application --reload` |
| Daphne | Production | `daphne config.asgi:application` |
| Gunicorn + Uvicorn | Production (WSGI fallback) | `gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker` |

---

## Notes for AI Agents

1. **Dependencies:** Requires Django project and settings configured
2. **Channel Layer:** Redis must be running for production channel layer
3. **ASGI vs WSGI:** ASGI supports async and WebSocket; WSGI is sync only
4. **Procfile:** Standard format for Heroku/Docker deployments
5. **runtime.txt:** Specifies exact Python version (e.g., python-3.12.0)
6. **Git Commit:** Commit after completing this group
