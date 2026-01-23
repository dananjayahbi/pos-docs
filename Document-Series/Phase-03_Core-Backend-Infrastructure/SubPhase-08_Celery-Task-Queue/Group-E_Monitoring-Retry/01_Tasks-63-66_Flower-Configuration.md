# Tasks 63-66: Flower Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** E - Monitoring & Retry  
> **Document:** 01 of 03  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-67-73_Retry-Policies.md](02_Tasks-67-73_Retry-Policies.md)

---

## Document Overview

This document covers the installation and configuration of Flower, the web-based monitoring tool for Celery, including Docker integration and authentication.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Configure Flower | Simple |
| 64 | Add Flower to Docker | Simple |
| 65 | Configure Flower Auth | Simple |
| 66 | Configure Flower URL | Simple |

---

## Task 63: Configure Flower

### Overview
Install and configure Flower, the real-time web-based monitoring tool for Celery, providing visibility into task execution, worker status, and system performance.

### Dependencies
- Task 17: Celery broker configured
- Task 23: Result backend configured
- Celery workers running

### Instructions

1. **Install Flower package**
   - Add flower to requirements/base.txt
   - Version: 2.0.x or latest stable
   - Compatible with Celery 5.3.x

2. **Understand Flower capabilities**
   - Real-time task monitoring
   - Worker status and statistics
   - Task history and results
   - Rate limiting and control
   - Broker monitoring

3. **Create Flower configuration**
   - Can be in Celery config or separate
   - LCC: Add to config/settings/celery.py
   - Or environment variables

4. **Configure Flower settings**
   - FLOWER_PORT: Port number (default 5555)
   - FLOWER_ADDRESS: Bind address (0.0.0.0 for Docker)
   - FLOWER_PERSISTENT: Enable persistent mode
   - FLOWER_DB: SQLite database path
   - FLOWER_STATE_SAVE_INTERVAL: Save interval (seconds)

5. **Set broker URL for Flower**
   - Same as Celery broker
   - Redis: redis://redis:6379/0
   - Flower connects to monitor

6. **Configure inspection settings**
   - Enable/disable worker inspection
   - Set inspection timeout
   - Configure refresh interval

7. **Test Flower locally**
   - Run: celery -A config flower
   - Access: http://localhost:5555
   - Verify dashboard loads

### Flower Features
| Feature | Purpose |
|---------|---------|
| Dashboard | Overview of workers and tasks |
| Tasks | Task history and details |
| Workers | Worker status and statistics |
| Monitor | Real-time task execution |
| Broker | Message queue statistics |

### Flower Configuration Settings
| Setting | Default | Purpose |
|---------|---------|---------|
| FLOWER_PORT | 5555 | Web UI port |
| FLOWER_ADDRESS | 0.0.0.0 | Bind address |
| FLOWER_PERSISTENT | True | Persist task history |
| FLOWER_DB | flower.db | SQLite database |
| FLOWER_STATE_SAVE_INTERVAL | 10000 | Save interval (ms) |

### Flower Environment Variables
```bash
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
FLOWER_PORT=5555
FLOWER_PERSISTENT=True
FLOWER_DB=/data/flower.db
```

### Expected Outcome
- Flower installed
- Configuration settings defined
- Flower can be started
- Dashboard accessible locally

### Verification Checklist
- [ ] flower package installed
- [ ] Flower configuration added
- [ ] Port and address configured
- [ ] Persistent mode enabled
- [ ] Database path set
- [ ] Broker URL configured
- [ ] Flower starts successfully
- [ ] Dashboard accessible at :5555

---

## Task 64: Add Flower to Docker

### Overview
Add Flower as a separate service in Docker Compose, ensuring it can monitor Celery workers and be accessed for production monitoring.

### Dependencies
- Task 63: Flower configured
- Docker Compose setup (Phase 01)
- Redis service defined

### Instructions

1. **Open docker-compose.yml**
   - Add new service for Flower
   - Place after Celery worker service
   - Keep services organized

2. **Define Flower service**
   - Service name: flower
   - Use same image as backend
   - Different command for Flower

3. **Set Flower command**
   - Command: celery -A config flower
   - Can add additional flags
   - Example: --port=5555 --broker=${CELERY_BROKER_URL}

4. **Configure service dependencies**
   - depends_on: redis, postgres, backend
   - Ensures services start in order
   - Flower needs broker available

5. **Set environment variables**
   - Inherit from .env file
   - CELERY_BROKER_URL
   - CELERY_RESULT_BACKEND
   - FLOWER_PORT (optional)
   - FLOWER_PERSISTENT (optional)

6. **Map ports**
   - Expose Flower port
   - Host:Container mapping
   - Example: "5555:5555"

7. **Configure volumes**
   - Mount flower database directory
   - Persist task history
   - Example: ./data/flower:/data

8. **Set network**
   - Use same network as other services
   - Allows inter-service communication
   - Default network usually sufficient

9. **Configure restart policy**
   - restart: unless-stopped
   - Ensures Flower restarts on failure
   - Production readiness

10. **Add health check (optional)**
    - Check Flower is responding
    - HTTP endpoint: http://localhost:5555
    - Helps orchestration

### Docker Compose Flower Service Structure
```yaml
flower:
  build: ./backend
  command: celery -A config flower --port=5555
  ports:
    - "5555:5555"
  environment:
    - CELERY_BROKER_URL=${CELERY_BROKER_URL}
    - CELERY_RESULT_BACKEND=${CELERY_RESULT_BACKEND}
    - FLOWER_PERSISTENT=True
    - FLOWER_DB=/data/flower.db
  volumes:
    - ./data/flower:/data
  depends_on:
    - redis
    - postgres
    - backend
  restart: unless-stopped
  networks:
    - lcc-network
```

### Service Dependencies
| Service | Reason |
|---------|--------|
| redis | Flower monitors broker |
| postgres | May query result backend |
| backend | Code dependencies |

### Port Mapping
| Host Port | Container Port | Purpose |
|-----------|----------------|---------|
| 5555 | 5555 | Flower web UI |

### Volume Mounts
| Host Path | Container Path | Purpose |
|-----------|----------------|---------|
| ./data/flower | /data | Persist task history |

### Expected Outcome
- Flower service in Docker Compose
- Service starts with docker-compose up
- Dashboard accessible at localhost:5555
- Task monitoring functional

### Verification Checklist
- [ ] Flower service added to docker-compose.yml
- [ ] Service command configured
- [ ] Port mapping defined
- [ ] Environment variables set
- [ ] Volume for persistence mounted
- [ ] Dependencies configured
- [ ] Restart policy set
- [ ] Service starts successfully
- [ ] Dashboard accessible
- [ ] Shows connected workers

---

## Task 65: Configure Flower Auth

### Overview
Implement authentication for Flower to secure the monitoring dashboard, preventing unauthorized access to sensitive task information.

### Dependencies
- Task 64: Flower in Docker
- Understanding of security requirements

### Instructions

1. **Choose authentication method**
   - Basic authentication (username/password)
   - Google OAuth (for organizations)
   - GitHub OAuth (for teams)
   - LCC: Basic auth initially

2. **Generate strong credentials**
   - Create secure username
   - Generate strong password
   - Don't use default credentials
   - Store in .env file

3. **Configure basic authentication**
   - Set FLOWER_BASIC_AUTH environment variable
   - Format: username:password
   - Can have multiple users
   - Comma-separated

4. **Add auth to Docker Compose**
   - Add FLOWER_BASIC_AUTH to environment
   - Use ${FLOWER_USER}:${FLOWER_PASSWORD}
   - Keep credentials out of version control

5. **Update .env file**
   - Add FLOWER_USER variable
   - Add FLOWER_PASSWORD variable
   - Use strong values
   - Document purpose

6. **Add to .env.example**
   - Add placeholder entries
   - FLOWER_USER=admin
   - FLOWER_PASSWORD=change_this_password
   - Remind developers to change

7. **Consider OAuth for production**
   - More secure for teams
   - Single sign-on integration
   - Centralized user management
   - LCC future enhancement

8. **Test authentication**
   - Restart Flower service
   - Access dashboard
   - Should prompt for credentials
   - Verify login works

9. **Document credentials**
   - Document in secure location
   - Share with authorized personnel only
   - Include in deployment docs
   - Rotate periodically

### Authentication Methods
| Method | Security Level | Setup Complexity | Use Case |
|--------|---------------|------------------|----------|
| Basic Auth | Medium | Low | Small teams |
| Google OAuth | High | Medium | Google Workspace |
| GitHub OAuth | High | Medium | Development teams |
| No Auth | None | None | Development only |

### Basic Auth Configuration
```yaml
environment:
  - FLOWER_BASIC_AUTH=${FLOWER_USER}:${FLOWER_PASSWORD}
```

### .env File Entries
```bash
# Flower Authentication
FLOWER_USER=admin
FLOWER_PASSWORD=secure_random_password_here
```

### Multiple Users Example
```bash
FLOWER_BASIC_AUTH=admin:password1,developer:password2,ops:password3
```

### Security Considerations
| Aspect | Recommendation |
|--------|----------------|
| Password strength | 16+ characters, mixed case, numbers, symbols |
| Storage | Environment variables, never in code |
| Access | Limit to authorized personnel |
| Rotation | Change periodically (quarterly) |
| Transport | Always use HTTPS in production |

### Expected Outcome
- Authentication configured
- Credentials secured in .env
- Dashboard requires login
- Unauthorized access prevented

### Verification Checklist
- [ ] Authentication method chosen
- [ ] Strong credentials generated
- [ ] FLOWER_BASIC_AUTH configured
- [ ] Environment variables added
- [ ] .env file updated
- [ ] .env.example updated
- [ ] Docker Compose updated
- [ ] Service restarted
- [ ] Login prompt appears
- [ ] Authentication successful
- [ ] Credentials documented securely

---

## Task 66: Configure Flower URL

### Overview
Configure proper URL access for Flower, either as a subdomain (flower.domain.com) or subpath (/flower/), with appropriate reverse proxy setup.

### Dependencies
- Task 65: Flower auth configured
- Nginx or reverse proxy (future)

### Instructions

1. **Choose URL pattern**
   - Subdomain: flower.domain.com
   - Subpath: lcc.com/flower/
   - LCC recommendation: Subdomain (cleaner)

2. **Configure for subdomain (recommended)**
   - DNS record for flower.domain.com
   - Points to server IP
   - Reverse proxy forwards to :5555

3. **Configure Flower for subpath (alternative)**
   - Set FLOWER_URL_PREFIX=/flower
   - Flower serves from subpath
   - Reverse proxy routes /flower/* to Flower

4. **Update Flower environment**
   - Add URL configuration
   - FLOWER_URL_PREFIX if using subpath
   - No special config needed for subdomain

5. **Plan reverse proxy configuration**
   - Nginx will proxy to Flower
   - SSL/TLS termination at proxy
   - Forward to localhost:5555

6. **Configure WebSocket proxy**
   - Flower uses WebSockets
   - Ensure proxy supports WebSocket upgrade
   - Required for real-time updates

7. **Document URL configuration**
   - Document in deployment guide
   - Include DNS requirements
   - Include proxy configuration
   - Include SSL certificate needs

8. **Plan production URL**
   - flower.lcc.lk (production)
   - flower-staging.lcc.lk (staging)
   - localhost:5555 (development)

9. **Update application URLs**
   - Add to internal documentation
   - Add to monitoring dashboard
   - Include in runbooks

### URL Pattern Comparison
| Pattern | Pros | Cons | LCC Choice |
|---------|------|------|------------|
| Subdomain | Clean, separate SSL cert possible | Requires DNS | ✅ Recommended |
| Subpath | Single domain, simpler DNS | URL prefix complexity | Alternative |

### Subdomain Configuration
```bash
# DNS Record
flower.lcc.lk A 192.168.1.100

# Nginx Proxy
server {
    listen 443 ssl;
    server_name flower.lcc.lk;
    
    location / {
        proxy_pass http://localhost:5555;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Subpath Configuration
```bash
# Environment Variable
FLOWER_URL_PREFIX=/flower

# Nginx Proxy
location /flower/ {
    proxy_pass http://localhost:5555/flower/;
    proxy_set_header Host $host;
    
    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

### WebSocket Proxy Requirements
| Setting | Purpose |
|---------|---------|
| proxy_http_version 1.1 | Enable HTTP/1.1 |
| Upgrade header | Signal WebSocket upgrade |
| Connection "upgrade" | Maintain connection |

### URL Planning
| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:5555 | Local development |
| Staging | flower-staging.lcc.lk | Staging monitoring |
| Production | flower.lcc.lk | Production monitoring |

### Expected Outcome
- URL pattern chosen
- Configuration planned
- Documentation updated
- DNS requirements documented
- Reverse proxy config planned

### Verification Checklist
- [ ] URL pattern chosen (subdomain/subpath)
- [ ] DNS requirements documented
- [ ] Flower URL configuration set
- [ ] Reverse proxy config planned
- [ ] WebSocket support included
- [ ] SSL/TLS planned
- [ ] Production URLs defined
- [ ] Documentation updated
- [ ] Team informed of URLs

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Configure Flower | Flower installation and config |
| 64 | Add Flower to Docker | Docker Compose service |
| 65 | Configure Flower Auth | Authentication enabled |
| 66 | Configure Flower URL | URL configuration planned |

### Flower Configuration Complete
| Component | Status | Details |
|-----------|--------|---------|
| Package | ✅ Installed | flower>=2.0.0 |
| Configuration | ✅ Complete | Settings defined |
| Docker Service | ✅ Added | docker-compose.yml |
| Authentication | ✅ Enabled | Basic auth configured |
| URL | ✅ Planned | Subdomain approach |

### Flower Capabilities Now Available
- Real-time task monitoring
- Worker status and statistics
- Task execution history
- Broker monitoring
- Rate limiting controls
- Task revocation
- Protected by authentication

### Access Information
| Environment | URL | Auth Required |
|-------------|-----|---------------|
| Development | localhost:5555 | Yes |
| Staging | flower-staging.lcc.lk | Yes |
| Production | flower.lcc.lk | Yes |

### Next Steps
Proceed to [02_Tasks-67-73_Retry-Policies.md](02_Tasks-67-73_Retry-Policies.md) to implement retry policies with exponential backoff and failure notifications.

---

## Notes for AI Agents

1. **Security:** Always enable authentication for Flower
2. **Persistence:** Enable persistent mode to maintain history
3. **WebSockets:** Ensure reverse proxy supports WebSocket upgrade
4. **Port:** Default 5555, ensure no conflicts
5. **Docker:** Separate service, not in worker container
6. **Monitoring:** Flower monitors, doesn't execute tasks
7. **Production:** Use HTTPS with valid SSL certificate
8. **OAuth:** Consider for larger teams
9. **Access:** Document who should have access
10. **Credentials:** Rotate periodically, store securely
