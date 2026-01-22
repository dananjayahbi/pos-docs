# Tasks 70-72: Channel Layers & Deployment Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** F - ASGI & Server Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-66-69_ASGI-Channels.md](01_Tasks-66-69_ASGI-Channels.md)
- **→ Next Document:** [../Group-G_Management-Commands-Utilities/00_GROUP_OVERVIEW.md](../Group-G_Management-Commands-Utilities/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers configuring Redis channel layers for WebSocket messaging and creating deployment configuration files.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 70 | Configure Channel Layers | Medium |
| 71 | Create Procfile | Simple |
| 72 | Create runtime.txt | Simple |

---

## Task 70: Configure Channel Layers

### Overview
Configure Redis-backed channel layers for WebSocket message routing across processes.

### Dependencies
- Task 69: Install channels
- Task 47: Install redis (Group D)

### Instructions

1. **Install channels-redis**
   - Add channels-redis to requirements/base.in

2. **Add CHANNEL_LAYERS to base.py**
   - Configure Redis backend
   - Use environment variable for URL

3. **Add development override in local.py**
   - Use InMemoryChannelLayer for simplicity

4. **Configure production in production.py**
   - Use Redis with SSL if required

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `channels-redis` | >=4.1 | Redis channel layer |

### Base CHANNEL_LAYERS Configuration

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("REDIS_URL", default="redis://redis:6379/2")],
        },
    },
}
```

### Local Development Override

For local.py (simpler, no Redis needed):

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
```

### Production Configuration

For production.py with SSL:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("REDIS_URL")],
            "capacity": 1500,
            "expiry": 10,
        },
    },
}
```

### Channel Layer Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `hosts` | Redis URL | Connection string |
| `capacity` | 1500 | Max messages in channel |
| `expiry` | 10 | Message expiry (seconds) |

### Redis Database Allocation

| Database | Purpose |
|----------|---------|
| 0 | Celery broker |
| 1 | Django cache |
| 2 | Channel layers |
| 15 | Testing |

### Expected Outcome
- Channel layers configured
- Redis-backed in production
- InMemory for development

### Verification Checklist
- [ ] channels-redis in base.in
- [ ] CHANNEL_LAYERS in base.py
- [ ] InMemoryChannelLayer in local.py
- [ ] Redis config in production.py

---

## Task 71: Create Procfile

### Overview
Create Procfile for process type definitions, compatible with Heroku, Docker, and process managers.

### Dependencies
- Task 66: Install uvicorn

### Instructions

1. **Create Procfile in backend/**
   - No file extension
   - Define process types

2. **Add web process**
   - Use daphne for ASGI

3. **Add worker process**
   - Celery worker

4. **Add beat process**
   - Celery beat scheduler

5. **Add release process (optional)**
   - Database migrations

### File Location

```
backend/
├── Procfile
├── manage.py
└── config/
```

### Procfile Content

| Process | Command |
|---------|---------|
| `web` | daphne -b 0.0.0.0 -p $PORT config.asgi:application |
| `worker` | celery -A config worker -l info |
| `beat` | celery -A config beat -l info |
| `release` | python manage.py migrate --noinput |

### Process Types Explained

| Type | Purpose | Scaling |
|------|---------|---------|
| `web` | HTTP/WebSocket server | Multiple instances |
| `worker` | Background tasks | Multiple instances |
| `beat` | Scheduled tasks | Single instance only |
| `release` | One-time commands | Runs on deploy |

### Port Configuration

- `$PORT` environment variable
- Provided by platform (Heroku, etc.)
- Fallback: 8000

### Docker Compatibility

Procfile works with:
- Heroku
- Dokku
- Flynn
- Foreman (local)
- Honcho (Python)

### Expected Outcome
- Procfile created
- All process types defined

### Verification Checklist
- [ ] Procfile exists (no extension)
- [ ] web process defined
- [ ] worker process defined
- [ ] beat process defined

---

## Task 72: Create runtime.txt

### Overview
Create runtime.txt to specify the Python version for deployment platforms.

### Dependencies
- Task 01: Install Python 3.12+ (Group A)

### Instructions

1. **Create runtime.txt in backend/**
   - Specify exact Python version

2. **Match project requirements**
   - Python 3.12.x

3. **Follow platform format**
   - Heroku: python-X.Y.Z

### File Location

```
backend/
├── runtime.txt
├── Procfile
├── manage.py
└── config/
```

### runtime.txt Content

```
python-3.12.3
```

### Version Selection

| Consideration | Recommendation |
|---------------|----------------|
| Django 5.x | Requires Python 3.10+ |
| Type hints | Python 3.12 improvements |
| Performance | Python 3.12 faster |
| LTS | Use latest stable patch |

### Platform Compatibility

| Platform | Format |
|----------|--------|
| Heroku | `python-3.12.3` |
| Render | `3.12.3` |
| Docker | `FROM python:3.12.3` |

### Keeping Updated

1. Check for security patches
2. Update patch version
3. Test before deploying
4. Update in CI/CD

### Expected Outcome
- Python version specified
- Deployment platform compatible

### Verification Checklist
- [ ] runtime.txt exists
- [ ] Version matches project requirements
- [ ] Format correct for target platform

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 70 | Configure Channel Layers | Redis messaging |
| 71 | Create Procfile | Process definitions |
| 72 | Create runtime.txt | Python version |

### Requirements Updates

**base.in additions:**
```
# Channel Layer
channels-redis>=4.1
```

### Files Created

| File | Content |
|------|---------|
| `Procfile` | web, worker, beat, release |
| `runtime.txt` | python-3.12.3 |

### Settings Updates

**base.py:**
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("REDIS_URL", default="redis://redis:6379/2")],
        },
    },
}
```

**local.py:**
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
```

### Backend Directory Structure

```
backend/
├── Procfile
├── runtime.txt
├── manage.py
├── requirements/
├── config/
│   ├── asgi.py       (configured)
│   └── settings/
│       ├── base.py   (CHANNEL_LAYERS)
│       ├── local.py  (InMemoryChannelLayer)
│       └── production.py
└── apps/
```

### Git Commit Message
```
feat(asgi): configure ASGI servers and channel layers

- Install uvicorn for development, daphne for production
- Configure ASGI with ProtocolTypeRouter
- Install Django Channels for WebSocket support
- Configure Redis channel layers
- Create Procfile and runtime.txt

SubPhase-02 Group F complete
```

### Next Steps
Proceed to [Group G](../Group-G_Management-Commands-Utilities/00_GROUP_OVERVIEW.md) for management commands and utilities.

---

## Notes for AI Agents

1. **Procfile:** No file extension, exact filename matters
2. **runtime.txt:** Match exact Python version
3. **Channel Layers:** Different backends for dev/prod
4. **Beat:** Only ONE instance should run beat
5. **Git:** Commit after completing Group F
