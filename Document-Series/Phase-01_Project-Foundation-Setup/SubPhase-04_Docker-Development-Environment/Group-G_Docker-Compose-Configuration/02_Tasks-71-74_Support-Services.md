# Tasks 71-74: Support Services

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** G - Docker Compose Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-70_Core-Services.md](01_Tasks-67-70_Core-Services.md)
- **→ Next Document:** [03_Tasks-75-80_Config-Complete.md](03_Tasks-75-80_Config-Complete.md)

---

## Document Overview

This document covers defining support services: Redis, Celery worker, Celery beat, and network configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Define Redis Service | Medium |
| 72 | Define Celery Worker Service | Medium |
| 73 | Define Celery Beat Service | Medium |
| 74 | Configure Docker Network | Simple |

---

## Task 71: Define Redis Service

### Overview
Define the Redis cache and message broker service in Docker Compose.

### Dependencies
- Task 54: Complete Redis Configuration
- Task 67: Create docker-compose.yml

### Instructions

1. **Add redis service**
   - Official redis image

2. **Mount configuration**
   - Custom redis.conf

3. **Configure persistence**
   - Named volume

4. **Add health check**
   - Redis ping

### Service Definition

```yaml
  redis:
    image: redis:7-alpine
    container_name: lcc-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - lcc-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 5s
    restart: unless-stopped
```

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| redis-data | /data | RDB persistence |
| redis.conf | /usr/local/etc/redis/ | Configuration |

### Health Check

| Component | Value |
|-----------|-------|
| Command | redis-cli ping |
| Response | PONG |
| Interval | 10 seconds |

### Service Purpose

| Use Case | Configuration |
|----------|---------------|
| Django cache | CACHE backend |
| Celery broker | CELERY_BROKER_URL |
| Channel layer | CHANNEL_LAYERS |

### Expected Outcome
- Redis service defined
- Persistent storage

### Verification Checklist
- [ ] Image version set
- [ ] Configuration mounted
- [ ] Data volume configured
- [ ] Health check added

---

## Task 72: Define Celery Worker Service

### Overview
Define the Celery worker service for background task processing.

### Dependencies
- Task 66: Complete Celery Worker Configuration
- Task 67: Create docker-compose.yml

### Instructions

1. **Add celery-worker service**
   - Use backend build

2. **Configure entrypoint**
   - Worker script

3. **Set concurrency**
   - Environment variable

4. **Configure dependencies**
   - Redis and db

### Service Definition

```yaml
  celery-worker:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.dev
    container_name: lcc-celery-worker
    volumes:
      - ./backend:/app
      - ./docker/scripts:/scripts:ro
    command: /scripts/celery-worker.sh
    environment:
      - CELERY_APP=config.celery:app
      - CELERY_CONCURRENCY=2
      - CELERY_QUEUES=default,high_priority,low_priority
      - CELERY_LOG_LEVEL=info
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "celery", "-A", "config.celery", "inspect", "ping", "--timeout", "5"]
      interval: 60s
      timeout: 30s
      retries: 3
      start_period: 30s
    restart: unless-stopped
```

### Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| CELERY_APP | config.celery:app | App location |
| CELERY_CONCURRENCY | 2 | Worker processes |
| CELERY_QUEUES | default,... | Queues to process |
| CELERY_LOG_LEVEL | info | Logging |

### Volume Mounts

| Host | Container | Purpose |
|------|-----------|---------|
| ./backend | /app | Source code |
| ./docker/scripts | /scripts | Entrypoint scripts |

### Dependencies

| Service | Condition | Reason |
|---------|-----------|--------|
| db | service_healthy | Database tasks |
| redis | service_healthy | Broker |

### Expected Outcome
- Worker service defined
- Processing queues

### Verification Checklist
- [ ] Build from backend
- [ ] Worker script as command
- [ ] Environment configured
- [ ] Dependencies set

---

## Task 73: Define Celery Beat Service

### Overview
Define the Celery Beat scheduler service for periodic tasks.

### Dependencies
- Task 61: Complete Celery Beat Configuration
- Task 67: Create docker-compose.yml

### Instructions

1. **Add celery-beat service**
   - Use backend build

2. **Configure entrypoint**
   - Beat script

3. **Set scheduler**
   - Database scheduler

4. **Configure dependencies**
   - After worker starts

### Service Definition

```yaml
  celery-beat:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.dev
    container_name: lcc-celery-beat
    volumes:
      - ./backend:/app
      - ./docker/scripts:/scripts:ro
    command: /scripts/celery-beat.sh
    environment:
      - CELERY_APP=config.celery:app
      - CELERY_BEAT_SCHEDULER=django_celery_beat.schedulers:DatabaseScheduler
      - CELERY_LOG_LEVEL=info
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
```

### Important Notes

| Note | Detail |
|------|--------|
| Single instance | Only one beat at a time |
| No replicas | Do not scale |
| DatabaseScheduler | Requires migrations |

### No Health Check

Beat doesn't expose inspection:
- Monitor via logs
- Check schedule execution

### Flower Service

Add Flower for monitoring:

```yaml
  flower:
    build:
      context: ./backend
      dockerfile: ../docker/backend/Dockerfile.dev
    container_name: lcc-flower
    ports:
      - "5555:5555"
    volumes:
      - ./backend:/app
      - ./docker/scripts:/scripts:ro
    command: /scripts/flower.sh
    environment:
      - CELERY_BROKER_URL=redis://redis:6379/0
      - FLOWER_PORT=5555
      - FLOWER_BASIC_AUTH=admin:admin
    env_file:
      - .env
    networks:
      - lcc-network
    depends_on:
      redis:
        condition: service_healthy
    restart: unless-stopped
```

### Expected Outcome
- Beat service defined
- Scheduling enabled

### Verification Checklist
- [ ] Build from backend
- [ ] Beat script as command
- [ ] DatabaseScheduler set
- [ ] Dependencies configured

---

## Task 74: Configure Docker Network

### Overview
Configure the custom Docker network for service communication.

### Dependencies
- Task 67: Create docker-compose.yml

### Instructions

1. **Define network**
   - Bridge driver

2. **Assign to services**
   - All services use it

3. **Document DNS**
   - Service discovery

### Network Definition

```yaml
networks:
  lcc-network:
    driver: bridge
    name: lankacommerce-network
```

### Network Properties

| Property | Value | Purpose |
|----------|-------|---------|
| driver | bridge | Standard Docker network |
| name | lankacommerce-network | Explicit name |

### Service DNS

| Service | Hostname |
|---------|----------|
| backend | backend |
| frontend | frontend |
| db | db |
| redis | redis |

### Internal Communication

From backend to db:
```python
DATABASE_HOST = 'db'
DATABASE_PORT = 5432
```

From backend to redis:
```python
REDIS_URL = 'redis://redis:6379/0'
```

### External Access

| Service | External Port | Internal Port |
|---------|---------------|---------------|
| backend | 8000 | 8000 |
| frontend | 3000 | 3000 |
| db | 5432 | 5432 |
| redis | 6379 | 6379 |
| flower | 5555 | 5555 |

### Complete Services Summary

```yaml
services:
  backend:
    networks:
      - lcc-network
  
  frontend:
    networks:
      - lcc-network
  
  db:
    networks:
      - lcc-network
  
  redis:
    networks:
      - lcc-network
  
  celery-worker:
    networks:
      - lcc-network
  
  celery-beat:
    networks:
      - lcc-network
  
  flower:
    networks:
      - lcc-network

networks:
  lcc-network:
    driver: bridge
    name: lankacommerce-network
```

### Expected Outcome
- Custom network defined
- All services connected

### Verification Checklist
- [ ] Network named
- [ ] Bridge driver
- [ ] All services use network
- [ ] DNS documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 71 | Define Redis Service | Cache/broker service |
| 72 | Define Celery Worker Service | Task processor |
| 73 | Define Celery Beat Service | Scheduler |
| 74 | Configure Docker Network | lcc-network |

### Services Added

| Service | Purpose | Port |
|---------|---------|------|
| redis | Cache + Broker | 6379 |
| celery-worker | Background tasks | - |
| celery-beat | Scheduled tasks | - |
| flower | Monitoring | 5555 |

### Network Configuration

```yaml
networks:
  lcc-network:
    driver: bridge
    name: lankacommerce-network
```

### Next Steps
Proceed to [03_Tasks-75-80_Config-Complete.md](03_Tasks-75-80_Config-Complete.md) for volumes, environment, and completion.

---

## Notes for AI Agents

1. **Network DNS:** Services resolve by name
2. **Beat singleton:** Only one instance
3. **Worker scaling:** Can scale horizontally
4. **Flower auth:** Change in production
5. **Health checks:** Required for dependencies
6. **Git:** Do NOT commit yet - complete Group G first
