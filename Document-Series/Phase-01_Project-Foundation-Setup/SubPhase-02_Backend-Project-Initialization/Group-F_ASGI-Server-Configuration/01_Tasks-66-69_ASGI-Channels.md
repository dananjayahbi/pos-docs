# Tasks 66-69: ASGI Server & Channels Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** F - ASGI & Server Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 66, 67, 68, 69

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-E_Django-Apps-Directory-Setup/03_Tasks-61-65_Business-Placeholders-2.md](../Group-E_Django-Apps-Directory-Setup/03_Tasks-61-65_Business-Placeholders-2.md)
- **→ Next Document:** [02_Tasks-70-72_Channel-Deploy.md](02_Tasks-70-72_Channel-Deploy.md)

---

## Document Overview

This document covers installing ASGI servers (Uvicorn, Daphne), configuring the ASGI application, and installing Django Channels for WebSocket support.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 66 | Install uvicorn | Simple |
| 67 | Install daphne | Simple |
| 68 | Configure ASGI Application | Medium |
| 69 | Install channels | Simple |

---

## Task 66: Install uvicorn

### Overview
Install Uvicorn as the development ASGI server with hot-reload support.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to local.in**
   - Add uvicorn to requirements/local.in
   - Include standard extras for development

2. **Document usage**
   - Primary development server
   - Supports hot reload

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `uvicorn[standard]` | >=0.24 | ASGI server for development |

### Uvicorn Features

| Feature | Description |
|---------|-------------|
| Hot reload | `--reload` flag |
| Fast | ASGI native |
| HTTP/2 | With `--http h2` |
| WebSocket | Native support |

### Development Run Command

| Option | Value |
|--------|-------|
| Module | `config.asgi:application` |
| Flag | `--reload` |
| Host | `0.0.0.0` |
| Port | `8000` |

### Full Command

```bash
uvicorn config.asgi:application --reload --host 0.0.0.0 --port 8000
```

### Expected Outcome
- Uvicorn available for development
- Hot reload enabled

### Verification Checklist
- [ ] uvicorn[standard] in local.in
- [ ] Version >= 0.24 specified

---

## Task 67: Install daphne

### Overview
Install Daphne as the production ASGI server for HTTP and WebSocket connections.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to production.in**
   - Add daphne to requirements/production.in

2. **Document usage**
   - Production ASGI server
   - Maintained by Django Channels team

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `daphne` | >=4.0 | Production ASGI server |

### Daphne Features

| Feature | Description |
|---------|-------------|
| HTTP/1.1 | Standard HTTP |
| HTTP/2 | With proper config |
| WebSocket | Full support |
| ASGI 3.0 | Complete spec |

### Production Run Command

| Option | Value |
|--------|-------|
| Module | `config.asgi:application` |
| Bind | `0.0.0.0:8000` |
| Workers | Configure via supervisor |

### Full Command

```bash
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

### Daphne vs Uvicorn

| Aspect | Daphne | Uvicorn |
|--------|--------|---------|
| Maintainer | Django Channels | Encode team |
| WebSocket | Optimized | Good |
| Hot reload | No | Yes |
| Use case | Production | Development |

### Expected Outcome
- Daphne available for production
- WebSocket optimized server

### Verification Checklist
- [ ] daphne in production.in
- [ ] Version >= 4.0 specified

---

## Task 68: Configure ASGI Application

### Overview
Update the ASGI configuration to support HTTP and WebSocket protocols with Django Channels.

### Dependencies
- Task 15: Configure asgi.py (Group B)

### Instructions

1. **Open config/asgi.py**
   - Current: Basic Django ASGI application

2. **Import Channels components**
   - ProtocolTypeRouter
   - AuthMiddlewareStack
   - URLRouter

3. **Configure ProtocolTypeRouter**
   - Route "http" to Django ASGI application
   - Route "websocket" to Channels routing

4. **Add placeholder WebSocket routing**
   - Empty URLRouter for now
   - Actual routes added when WebSocket consumers created

### ASGI Application Structure

```
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            # WebSocket routes added here later
        ])
    ),
})
```

### Protocol Types

| Protocol | Handler | Purpose |
|----------|---------|---------|
| `http` | Django ASGI | Regular HTTP requests |
| `websocket` | Channels URLRouter | WebSocket connections |

### Middleware Stack

| Middleware | Purpose |
|------------|---------|
| `AuthMiddlewareStack` | Populates `scope["user"]` |
| Custom (later) | Tenant context in scope |

### Import Order

1. Set `DJANGO_SETTINGS_MODULE`
2. Call `django.setup()` if needed
3. Import Channels components
4. Import `get_asgi_application()`
5. Define `application`

### Expected Outcome
- ASGI configured for HTTP and WebSocket
- Ready for WebSocket consumers

### Verification Checklist
- [ ] ProtocolTypeRouter configured
- [ ] HTTP routes to Django ASGI
- [ ] WebSocket uses AuthMiddlewareStack
- [ ] Empty URLRouter as placeholder

---

## Task 69: Install channels

### Overview
Install Django Channels for WebSocket support and async consumers.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add channels to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'channels' to THIRD_PARTY_APPS

3. **Set ASGI_APPLICATION**
   - Point to configured ASGI application

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `channels` | >=4.0 | Django Channels |

### Settings Configuration

Add to base.py:

| Setting | Value |
|---------|-------|
| `ASGI_APPLICATION` | 'config.asgi.application' |

### Update THIRD_PARTY_APPS

```python
THIRD_PARTY_APPS = [
    'channels',
    'rest_framework',
    'corsheaders',
    # ... other apps
]
```

### Channels Features

| Feature | Description |
|---------|-------------|
| WebSocket | Bidirectional communication |
| Consumer | Async request handlers |
| Groups | Broadcast to subscribed clients |
| Channel Layer | Cross-process messaging |

### Real-Time Use Cases

| Feature | Description |
|---------|-------------|
| POS Updates | Real-time inventory sync |
| Notifications | Push notifications to clients |
| Live Dashboard | Real-time analytics |
| Chat | Customer support chat |

### Expected Outcome
- Django Channels installed
- ASGI_APPLICATION configured

### Verification Checklist
- [ ] channels in base.in
- [ ] channels in THIRD_PARTY_APPS
- [ ] ASGI_APPLICATION set in base.py

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 66 | Install uvicorn | Development ASGI server |
| 67 | Install daphne | Production ASGI server |
| 68 | Configure ASGI Application | Protocol routing |
| 69 | Install channels | WebSocket support |

### Requirements Updates

**local.in additions:**
```
# Development Server
uvicorn[standard]>=0.24
```

**production.in additions:**
```
# Production Server
daphne>=4.0
```

**base.in additions:**
```
# Channels
channels>=4.0
```

### Settings Updates

```python
# ASGI
ASGI_APPLICATION = 'config.asgi.application'

# Third-party apps
THIRD_PARTY_APPS = [
    'channels',
    # ... other apps
]
```

### Next Steps
Proceed to [02_Tasks-70-72_Channel-Deploy.md](02_Tasks-70-72_Channel-Deploy.md) for channel layers and deployment configuration.

---

## Notes for AI Agents

1. **Order:** Install channels before configuring ASGI
2. **ASGI Application:** Must import after django.setup()
3. **Placeholder Routes:** Empty URLRouter is valid
4. **Development:** Use uvicorn with --reload
5. **Git:** Do NOT commit yet - complete all Group F tasks first
