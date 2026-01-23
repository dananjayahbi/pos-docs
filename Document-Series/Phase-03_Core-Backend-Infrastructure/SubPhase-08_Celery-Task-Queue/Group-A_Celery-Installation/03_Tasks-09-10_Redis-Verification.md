# Tasks 09-10: Redis Verification

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** A - Celery Installation  
> **Document:** 03 of 04  
> **Tasks Covered:** 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-08_Django-App-Registration.md](02_Tasks-07-08_Django-App-Registration.md)
- **→ Next Document:** [04_Tasks-11-14_Migrations.md](04_Tasks-11-14_Migrations.md)

---

## Document Overview

This document covers the verification of Redis connectivity before proceeding with Celery configuration. Redis serves as both the message broker and result backend for Celery in the LankaCommerce Cloud platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Verify Redis Running | Simple |
| 10 | Test Redis Connection | Medium |

---

## Task 09: Verify Redis Running

### Overview
Confirm that the Redis service is running and accessible within the Docker environment, as Celery requires Redis for message brokering and optional result storage.

### Dependencies
- Docker infrastructure from Phase-01
- Redis service defined in docker-compose.yml

### Instructions

1. **Check Docker services status**
   - List all running Docker containers
   - Verify Redis container is in the list
   - Check that Redis container status is "Up" or "running"

2. **Verify Redis service definition**
   - Confirm Redis is defined in docker-compose.yml
   - Check Redis is using appropriate image (redis:7-alpine recommended)
   - Verify Redis ports are exposed (6379)
   - Check Redis has proper network configuration

3. **Check Redis logs**
   - View Redis container logs
   - Look for successful startup messages
   - Verify no error messages in logs
   - Confirm Redis is accepting connections

4. **Verify Redis network connectivity**
   - Ensure Redis is on the same Docker network as Django backend
   - Confirm Redis hostname resolves (usually 'redis' in Docker)
   - Check Redis port is accessible from backend container

### Docker Compose Redis Configuration
Expected Redis service configuration:
| Setting | Value | Purpose |
|---------|-------|---------|
| Image | redis:7-alpine | Redis 7 on Alpine Linux |
| Container Name | redis | Service hostname |
| Port | 6379:6379 | Redis default port |
| Network | lcc_network | Shared Docker network |
| Restart Policy | unless-stopped | Auto-restart |
| Volumes | redis_data:/data | Persistent storage |

### Redis Service Requirements
| Requirement | Purpose |
|-------------|---------|
| Persistent Volume | Retain data between restarts |
| Health Check | Monitor service health |
| Memory Limit | Prevent resource exhaustion |
| Max Memory Policy | Define eviction policy |
| Password (optional) | Production security |

### Expected Redis Log Output
Successful startup shows:
- Redis version and server mode
- Port binding confirmation
- Database loaded message
- Ready to accept connections message

### Expected Outcome
- Redis container is running
- Redis is accessible on port 6379
- Redis logs show healthy startup
- Ready for connection testing

### Verification Checklist
- [ ] Redis container is running in Docker
- [ ] Redis container status is "Up"
- [ ] Redis logs show successful startup
- [ ] No error messages in Redis logs
- [ ] Redis is on correct Docker network
- [ ] Port 6379 is accessible

---

## Task 10: Test Redis Connection

### Overview
Perform a connection test from the Django application to Redis to ensure that Celery will be able to establish broker and backend connections successfully.

### Dependencies
- Task 09: Verify Redis Running
- Task 03: Install redis Package

### Instructions

1. **Create Redis connection test**
   - Write a simple connection test script or management command
   - Use the Redis Python client to connect
   - Test basic operations (ping, set, get)

2. **Configure Redis connection URL**
   - Define Redis connection URL format
   - Use environment variable for flexibility
   - Format: `redis://[password]@host:port/db`
   - For LCC Docker: `redis://redis:6379/0`

3. **Test connection from Django shell**
   - Open Django shell or Python shell in Docker container
   - Import redis client
   - Create connection using URL
   - Execute ping command
   - Test set/get operations

4. **Test from Django management command**
   - Create a custom management command for Redis testing
   - Include comprehensive connection checks
   - Provide clear success/failure messages
   - Test multiple Redis operations

5. **Verify connection pool**
   - Test connection pooling behavior
   - Verify multiple connections work
   - Check connection timeout settings
   - Test reconnection on connection loss

### Redis Connection Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| Host | redis | Docker service name |
| Port | 6379 | Redis default port |
| DB | 0 | Default database (0-15 available) |
| Encoding | utf-8 | Character encoding |
| Decode Responses | True | Auto-decode bytes to strings |
| Socket Timeout | 5 | Connection timeout seconds |

### Connection Test Operations
| Operation | Purpose |
|-----------|---------|
| ping() | Basic connectivity test |
| set(key, value) | Write test |
| get(key) | Read test |
| delete(key) | Cleanup test |
| dbsize() | Check database size |
| info() | Server information |

### Environment Variable Configuration
Define in `.env` file:
```
REDIS_URL=redis://redis:6379/0
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
```

### Connection Test Script Structure
The test should:
1. Read connection parameters from environment
2. Create Redis client instance
3. Test connection with ping
4. Perform write operation
5. Perform read operation
6. Clean up test data
7. Report success or failure with details

### Error Handling
Common connection errors to handle:
| Error | Cause | Solution |
|-------|-------|----------|
| ConnectionError | Redis not running | Start Redis service |
| TimeoutError | Network issue | Check Docker network |
| ResponseError | Redis command failed | Check Redis version |
| AuthenticationError | Password required | Add password to URL |

### Expected Outcome
- Connection test passes successfully
- Can read and write to Redis
- Connection is stable and reliable
- Ready for Celery broker configuration

### Verification Checklist
- [ ] Can connect to Redis from Django container
- [ ] Ping command returns successful response
- [ ] Can write data to Redis
- [ ] Can read data from Redis
- [ ] Connection URL is properly configured
- [ ] Environment variables are set correctly
- [ ] Connection pool works properly
- [ ] No timeout or connection errors

---

## Redis Architecture for LCC

### Redis Usage in Celery
| Component | Purpose |
|-----------|---------|
| Message Broker | Queue task messages |
| Result Backend | Store task results (optional) |
| Beat Schedule | Store periodic task schedules (if not using DB) |

### Database Allocation
Redis has 16 databases (0-15). Recommended allocation:
| DB | Purpose |
|----|---------|
| 0 | Celery broker (task queue) |
| 1 | Celery results (if using Redis backend) |
| 2 | Django cache |
| 3 | Session storage |
| 4-15 | Available for future use |

### Redis vs Django-DB for Results
| Backend | Pros | Cons | Use Case |
|---------|------|------|----------|
| Redis | Fast, low latency | Ephemeral, no history | High-throughput tasks |
| Django-DB | Persistent, ORM integration | Slower, DB load | Audit, compliance, history |
| Hybrid | Best of both | More complex | Production recommended |

### Production Considerations
| Aspect | Consideration |
|--------|---------------|
| Persistence | Enable RDB or AOF for durability |
| Max Memory | Set limit with eviction policy |
| Password | Use strong password in production |
| TLS | Enable for encrypted connections |
| Monitoring | Track memory, connections, commands |
| Replication | Consider Redis Sentinel or Cluster |

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Verify Redis Running | Redis service operational |
| 10 | Test Redis Connection | Connection verified from Django |

### Redis Status
- Redis container running in Docker
- Accessible on port 6379
- Connection tested and verified
- Ready for Celery configuration

### Connection Details Confirmed
- Host: redis (Docker service name)
- Port: 6379
- Database: 0
- Connection URL: redis://redis:6379/0

### Next Steps
Proceed to [04_Tasks-11-14_Migrations.md](04_Tasks-11-14_Migrations.md) to generate and apply migrations for Celery apps.

---

## Notes for AI Agents

1. **Docker Network:** Ensure backend and Redis on same network
2. **Service Name:** Use 'redis' as hostname in Docker, not 'localhost'
3. **Connection Testing:** Test before proceeding to configuration
4. **Environment Variables:** Use .env for connection configuration
5. **Database Selection:** Use DB 0 for broker, DB 1 for results
6. **Error Messages:** Provide clear error messages for troubleshooting
7. **Production Security:** Add password and TLS for production deployments
