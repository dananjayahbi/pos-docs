# Tasks 46-50: Redis Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** E - Redis Container Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_PostgreSQL-Container-Setup/02_Tasks-42-45_Config-Backup.md](../Group-D_PostgreSQL-Container-Setup/02_Tasks-42-45_Config-Backup.md)
- **→ Next Document:** [02_Tasks-51-54_Logging-Health.md](02_Tasks-51-54_Logging-Health.md)

---

## Document Overview

This document covers creating the Redis configuration file with port, memory, eviction policy, and persistence settings.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 46 | Create redis/redis.conf | Medium |
| 47 | Configure Redis Port | Simple |
| 48 | Configure Max Memory | Simple |
| 49 | Configure Memory Policy | Simple |
| 50 | Configure Persistence | Medium |

---

## Task 46: Create redis/redis.conf

### Overview
Create the Redis configuration file for the development environment.

### Dependencies
- Task 05: Create docker/redis/ Directory

### Instructions

1. **Create redis.conf**
   - In docker/redis/

2. **Add header documentation**
   - Purpose and version

3. **Structure sections**
   - Network, memory, persistence

### File Location

```
docker/
└── redis/
    └── redis.conf
```

### Configuration Structure

```conf
# ==================================================
# LankaCommerce Cloud - Redis Configuration
# ==================================================
# Purpose: Development environment settings
# Version: Redis 7+
# Use Cases: Django cache, Celery broker
# ==================================================

# Settings will follow in subsequent tasks
```

### Docker Integration

Mount in docker-compose:
```yaml
redis:
  image: redis:7-alpine
  command: redis-server /usr/local/etc/redis/redis.conf
  volumes:
    - ./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
```

### Expected Outcome
- Configuration file created
- Structure defined

### Verification Checklist
- [ ] File created at docker/redis/redis.conf
- [ ] Header documentation added
- [ ] Ready for settings

---

## Task 47: Configure Redis Port

### Overview
Configure the Redis server listening port.

### Dependencies
- Task 46: Create redis/redis.conf

### Instructions

1. **Set port**
   - Default 6379

2. **Set bind address**
   - All interfaces for Docker

3. **Document network section**
   - Clear comments

### Configuration Addition

```conf
# -------------------------------------------------
# Network Settings
# -------------------------------------------------

# Bind to all interfaces (Docker internal network)
bind 0.0.0.0

# Default Redis port
port 6379

# Accept connections on this port
tcp-backlog 511
```

### Network Settings Explained

| Setting | Value | Purpose |
|---------|-------|---------|
| bind | 0.0.0.0 | Accept all connections |
| port | 6379 | Standard Redis port |
| tcp-backlog | 511 | Connection queue |

### Docker Port Mapping

In docker-compose:
```yaml
redis:
  ports:
    - "6379:6379"  # Host:Container
```

### Expected Outcome
- Port configured
- Bind address set

### Verification Checklist
- [ ] port = 6379
- [ ] bind = 0.0.0.0
- [ ] tcp-backlog set

---

## Task 48: Configure Max Memory

### Overview
Configure the maximum memory Redis can use.

### Dependencies
- Task 46: Create redis/redis.conf

### Instructions

1. **Set maxmemory**
   - Appropriate for development

2. **Document limit**
   - Why this value

3. **Consider container limit**
   - Match docker-compose

### Configuration Addition

```conf
# -------------------------------------------------
# Memory Settings
# -------------------------------------------------

# Maximum memory limit (development)
maxmemory 256mb
```

### Memory Calculation

For development:
| Consumer | Allocation |
|----------|------------|
| Django cache | 100MB |
| Celery broker | 100MB |
| Channels | 50MB |
| Buffer | Remaining |

Total: 256MB suitable for development

### Production Comparison

| Environment | Memory |
|-------------|--------|
| Development | 256MB |
| Production | 1-4GB |

### Docker Memory Limit

Match in docker-compose:
```yaml
redis:
  deploy:
    resources:
      limits:
        memory: 512M  # Give some headroom
```

### Expected Outcome
- Memory limit set
- Documented reasoning

### Verification Checklist
- [ ] maxmemory = 256mb
- [ ] Documented in comments

---

## Task 49: Configure Memory Policy

### Overview
Configure the memory eviction policy when maxmemory is reached.

### Dependencies
- Task 46: Create redis/redis.conf

### Instructions

1. **Set eviction policy**
   - allkeys-lru for cache

2. **Document behavior**
   - What happens at limit

3. **Explain choice**
   - Why this policy

### Configuration Addition

```conf
# Eviction policy when maxmemory is reached
# allkeys-lru: Evict least recently used keys
maxmemory-policy allkeys-lru

# Number of keys to sample when evicting
maxmemory-samples 5
```

### Eviction Policies

| Policy | Behavior |
|--------|----------|
| noeviction | Return errors |
| allkeys-lru | Evict any LRU key |
| volatile-lru | Evict LRU with TTL |
| allkeys-lfu | Evict least frequently used |
| volatile-ttl | Evict shortest TTL |
| allkeys-random | Random eviction |

### Why allkeys-lru

| Reason | Benefit |
|--------|---------|
| Cache behavior | Old data removed |
| No errors | Operations succeed |
| Automatic | No manual cleanup |
| Simple | Works for most cases |

### Expected Outcome
- Eviction policy set
- LRU behavior enabled

### Verification Checklist
- [ ] maxmemory-policy = allkeys-lru
- [ ] maxmemory-samples set
- [ ] Documented in comments

---

## Task 50: Configure Persistence

### Overview
Configure Redis data persistence for development.

### Dependencies
- Task 46: Create redis/redis.conf

### Instructions

1. **Configure RDB snapshots**
   - Periodic saves

2. **Disable AOF**
   - Not needed for dev

3. **Set file location**
   - Within data directory

### Configuration Addition

```conf
# -------------------------------------------------
# Persistence Settings
# -------------------------------------------------

# RDB snapshot configuration
# save <seconds> <changes>
save 900 1       # Save if 1 key changed in 15 minutes
save 300 10      # Save if 10 keys changed in 5 minutes
save 60 10000    # Save if 10000 keys changed in 1 minute

# Stop writes on RDB save error
stop-writes-on-bgsave-error yes

# Compress RDB file
rdbcompression yes

# RDB filename
dbfilename dump.rdb

# Data directory
dir /data

# Disable AOF (not needed for development cache)
appendonly no
```

### Persistence Types

| Type | Pros | Cons |
|------|------|------|
| RDB | Fast recovery, compact | Data loss window |
| AOF | Durable, readable | Larger files, slower |
| Both | Maximum durability | Most overhead |
| None | Fastest | No persistence |

### Development Choice

For development:
| Choice | Reason |
|--------|--------|
| RDB only | Fast, occasional snapshots |
| AOF off | Cache data is regenerable |

### Docker Volume

```yaml
redis:
  volumes:
    - redis_data:/data
```

### Expected Outcome
- RDB snapshots configured
- AOF disabled
- Data directory set

### Verification Checklist
- [ ] save intervals configured
- [ ] rdbcompression = yes
- [ ] dbfilename = dump.rdb
- [ ] appendonly = no

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 46 | Create redis/redis.conf | Configuration file |
| 47 | Configure Redis Port | Port 6379 |
| 48 | Configure Max Memory | 256MB limit |
| 49 | Configure Memory Policy | allkeys-lru |
| 50 | Configure Persistence | RDB snapshots |

### redis.conf Progress

```conf
# ==================================================
# LankaCommerce Cloud - Redis Configuration
# ==================================================
# Purpose: Development environment settings
# Version: Redis 7+
# Use Cases: Django cache, Celery broker
# ==================================================

# -------------------------------------------------
# Network Settings
# -------------------------------------------------
bind 0.0.0.0
port 6379
tcp-backlog 511

# -------------------------------------------------
# Memory Settings
# -------------------------------------------------
maxmemory 256mb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# -------------------------------------------------
# Persistence Settings
# -------------------------------------------------
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
dbfilename dump.rdb
dir /data
appendonly no
```

### Next Steps
Proceed to [02_Tasks-51-54_Logging-Health.md](02_Tasks-51-54_Logging-Health.md) for logging, protected mode, and health check.

---

## Notes for AI Agents

1. **Bind address:** 0.0.0.0 for Docker network
2. **Memory:** 256MB for development
3. **Eviction:** allkeys-lru for cache behavior
4. **Persistence:** RDB only, AOF disabled
5. **Data dir:** /data volume mount
6. **Git:** Do NOT commit yet - complete Group E first
