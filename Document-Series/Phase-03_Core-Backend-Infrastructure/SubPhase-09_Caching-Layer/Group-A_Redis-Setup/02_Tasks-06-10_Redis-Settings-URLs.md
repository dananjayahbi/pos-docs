# Tasks 06-10: Redis Settings and URLs

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** A - Redis Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Redis-Package-Install.md](01_Tasks-01-05_Redis-Package-Install.md)
- **→ Next Document:** [03_Tasks-11-14_Redis-Pool-Integration.md](03_Tasks-11-14_Redis-Pool-Integration.md)

---

## Document Overview

This document covers the creation of Redis settings module and configuration of environment-specific Redis URLs. The settings organize Redis configuration separately and support multiple environments (development, staging, production).

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Create Redis Settings File | Medium |
| 07 | Configure REDIS_URL | Simple |
| 08 | Configure Dev Redis URL | Simple |
| 09 | Configure Prod Redis URL | Simple |
| 10 | Configure Redis Database | Medium |

---

## Task 06: Create Redis Settings File

### Overview
Create a dedicated settings module for Redis configuration to keep cache-related settings organized and maintainable.

### Dependencies
- Task 05: Test Redis Connection

### Instructions

1. **Locate settings directory**
   - Navigate to backend/config/settings/
   - This directory contains all Django settings modules

2. **Create redis.py settings file**
   - Create new file: config/settings/redis.py
   - This file will contain all Redis-specific configuration

3. **Add file header**
   - Add docstring describing the file purpose
   - Document that this module contains Redis connection settings
   - Note that it supports multiple environments

4. **Import required modules**
   - Import os for environment variable access
   - Import environ for environment configuration
   - Import any other needed Django settings utilities

5. **Add configuration structure**
   - Create sections for different Redis use cases
   - Sections: Connection, Databases, URLs
   - Use comments to separate sections clearly

6. **Add environment variable loading**
   - Set up environment variable reading
   - Support .env file for local development
   - Use os.environ or django-environ for variable access

7. **Document Redis database allocation**
   - Document which database number is used for what purpose
   - DB 0: Default cache
   - DB 1: Session storage
   - DB 2: Celery broker/results
   - DB 3: Rate limiting
   - DB 4-15: Reserved for future use

### File Structure
```
redis.py structure:
├── Header/Docstring
├── Imports
├── Environment Variable Loading
├── Redis URL Configuration
├── Database Number Allocation
└── Connection Parameter Defaults
```

### Redis Database Allocation Plan
| DB # | Purpose | Description |
|------|---------|-------------|
| **0** | Default cache | General application caching |
| **1** | Sessions | Django session storage |
| **2** | Celery | Task queue broker and results |
| **3** | Rate limiting | API rate limit counters |
| **4-15** | Reserved | Future expansion |

### Verification
- redis.py file exists in config/settings/
- File has proper docstring
- Environment variable loading configured
- Database allocation documented

---

## Task 07: Configure REDIS_URL

### Overview
Configure the base REDIS_URL environment variable that will be used across different environments.

### Dependencies
- Task 06: Create Redis Settings File

### Instructions

1. **Define REDIS_URL variable**
   - Add REDIS_URL setting in redis.py
   - Read from environment variable
   - Provide sensible default for development

2. **Set URL format**
   - Use standard Redis URL format
   - Format: redis://[username][:password]@host:port/database
   - Example: redis://localhost:6379/0

3. **Document URL components**
   - Host: Redis server hostname or IP
   - Port: Redis port (default 6379)
   - Database: Redis database number (0-15)
   - Password: Optional authentication (production)

4. **Add fallback handling**
   - Provide default URL if environment variable not set
   - Default should work for local development
   - Document that production must override

5. **Support multiple URL formats**
   - Support redis:// scheme
   - Support rediss:// for TLS (production)
   - Support unix socket URLs for local connections

6. **Add validation**
   - Validate URL format
   - Check required components present
   - Log warning if using default in production

### Redis URL Format
```
Standard URL format:
redis://[username:password@]host[:port][/database]

Examples:
redis://localhost:6379/0           (local, no auth)
redis://:password@redis:6379/0     (with password)
rediss://redis.example.com:6380/0  (TLS)
unix:///var/run/redis/redis.sock   (Unix socket)
```

### Environment Variable Configuration
| Environment | Variable Source | Default |
|-------------|----------------|---------|
| **Development** | .env file | redis://localhost:6379 |
| **Docker** | docker-compose.yml | redis://redis:6379 |
| **Staging** | Cloud secrets | Required, no default |
| **Production** | Cloud secrets | Required, no default |

### Verification
- REDIS_URL variable defined in redis.py
- Environment variable reading works
- Default URL provided for development
- URL format documented

---

## Task 08: Configure Dev Redis URL

### Overview
Configure Redis URL specifically for development environment with appropriate defaults.

### Dependencies
- Task 07: Configure REDIS_URL

### Instructions

1. **Identify development environment**
   - Check DEBUG setting or ENVIRONMENT variable
   - Determine if running in development mode

2. **Set development-specific URL**
   - Use localhost for native development
   - Use redis service name for Docker development
   - Port: 6379 (standard Redis port)

3. **Configure for local development**
   - Host: localhost or 127.0.0.1
   - No password required
   - Use database 0 for general cache

4. **Configure for Docker development**
   - Host: redis (Docker service name)
   - Network: Default Docker bridge network
   - DNS resolution via Docker

5. **Add to .env.example**
   - Add REDIS_URL to example environment file
   - Document the development default value
   - Explain when to use localhost vs redis

6. **Document network differences**
   - localhost: Running Django outside Docker
   - redis: Running Django inside Docker
   - Both connect to same Redis instance

### Development URL Options
```
Native development (Django outside Docker):
REDIS_URL=redis://localhost:6379/0

Docker development (Django inside Docker):
REDIS_URL=redis://redis:6379/0

Using Docker host networking:
REDIS_URL=redis://host.docker.internal:6379/0
```

### .env.example Entry
```
Example .env.example content:
# Redis Configuration
# For native development use: redis://localhost:6379/0
# For Docker development use: redis://redis:6379/0
REDIS_URL=redis://localhost:6379/0
```

### Network Configuration Notes
| Scenario | Host Value | Network |
|----------|-----------|---------|
| **Django on host, Redis in Docker** | localhost:6379 | Host port forwarding |
| **Both in Docker** | redis:6379 | Docker internal network |
| **Redis on host, Django in Docker** | host.docker.internal:6379 | Docker host access |

### Verification
- Development Redis URL configured
- .env.example updated
- localhost and Docker options documented
- Connection works in both scenarios

---

## Task 09: Configure Prod Redis URL

### Overview
Configure Redis URL for production environment with security and performance considerations.

### Dependencies
- Task 08: Configure Dev Redis URL

### Instructions

1. **Define production URL requirements**
   - Must use environment variable (no defaults)
   - Must include authentication password
   - Should use TLS (rediss://) if available
   - Use production Redis host/cluster

2. **Set up password authentication**
   - Read password from environment variable
   - Never hardcode passwords in settings
   - Use secure secret management (AWS Secrets Manager, etc.)

3. **Configure TLS connection**
   - Use rediss:// scheme for TLS
   - Verify SSL certificates
   - Configure cert validation settings

4. **Support Redis clusters**
   - Allow cluster mode configuration
   - Support Redis Sentinel URLs if using HA
   - Document cluster connection format

5. **Set connection string format**
   - Format: rediss://:password@redis.production.com:6380/0
   - Include all security parameters
   - Support connection pooling parameters

6. **Add production validation**
   - Raise error if production URL not set
   - Validate TLS is used in production
   - Check password is present

7. **Document cloud provider formats**
   - AWS ElastiCache URL format
   - Azure Cache for Redis format
   - Google Cloud Memorystore format
   - DigitalOcean Managed Redis format

### Production URL Examples
```
Standard production:
rediss://:STRONG_PASSWORD@redis.example.com:6380/0

AWS ElastiCache:
rediss://:password@master.redis-cluster.abc123.use1.cache.amazonaws.com:6379/0

Azure Cache for Redis:
rediss://:access_key@myredis.redis.cache.windows.net:6380/0

Redis Sentinel:
redis-sentinel://sentinel1:26379,sentinel2:26379/mymaster/0
```

### Security Checklist
- [ ] Password required in production
- [ ] TLS enabled (rediss://)
- [ ] Password from environment/secrets manager
- [ ] SSL certificate verification enabled
- [ ] No credentials in source code
- [ ] Production URL validates on startup

### Cloud Provider Configuration
| Provider | Service | URL Format |
|----------|---------|------------|
| **AWS** | ElastiCache | rediss://:pwd@endpoint:6379/0 |
| **Azure** | Cache for Redis | rediss://:key@name.redis.cache.windows.net:6380/0 |
| **GCP** | Memorystore | redis://ip-address:6379/0 |
| **DigitalOcean** | Managed Redis | rediss://:pwd@host:port/0 |

### Verification
- Production URL must be set via environment
- TLS configured for production
- Password authentication required
- No hardcoded credentials
- Production validation in place

---

## Task 10: Configure Redis Database

### Overview
Configure Redis database number allocation for different cache purposes to prevent key collisions and enable independent cache clearing.

### Dependencies
- Task 09: Configure Prod Redis URL

### Instructions

1. **Define database number constants**
   - Create constants for database numbers
   - Use descriptive names for each database purpose
   - Add to redis.py settings

2. **Allocate database 0 for default cache**
   - General application caching
   - QuerySet caching
   - View response caching
   - Temporary data storage

3. **Allocate database 1 for sessions**
   - Django session storage
   - User authentication sessions
   - Remember me tokens
   - Session-related temporary data

4. **Allocate database 2 for Celery**
   - Celery broker messages
   - Celery result backend
   - Task state tracking
   - Task locks and coordination

5. **Allocate database 3 for rate limiting**
   - API rate limit counters
   - DDoS protection counters
   - Throttling state
   - Request counting

6. **Reserve databases 4-15**
   - Document as reserved for future use
   - Potential uses: Feature flags, real-time data, pub/sub
   - Leave commented placeholders

7. **Create helper function**
   - Function to get URL for specific database
   - Function to switch database in URL
   - Utility to parse database from URL

8. **Document database isolation benefits**
   - Independent FLUSHDB per database
   - Separate monitoring per database
   - Different eviction policies possible
   - Resource isolation

### Database Allocation Constants
```
Constant definitions structure:
REDIS_DB_DEFAULT_CACHE = 0
REDIS_DB_SESSIONS = 1
REDIS_DB_CELERY = 2
REDIS_DB_RATE_LIMIT = 3
REDIS_DB_RESERVED_4 = 4  # Future: Feature flags
REDIS_DB_RESERVED_5 = 5  # Future: Real-time data
...
REDIS_DB_RESERVED_15 = 15
```

### Database Usage Map
| DB | Purpose | Keys Prefix | Est. Size | TTL |
|----|---------|-------------|-----------|-----|
| **0** | Default cache | lcc:cache:* | Medium | Variable |
| **1** | Sessions | django.contrib.sessions:* | Small | SESSION_AGE |
| **2** | Celery | celery-* | Small | Short |
| **3** | Rate limits | ratelimit:* | Very Small | 1-60 min |
| **4-15** | Reserved | - | - | - |

### URL Helper Functions
```
Function purpose examples:

get_redis_url_for_db(db_number):
  - Returns Redis URL for specific database
  - Replaces database number in base URL
  
parse_database_from_url(url):
  - Extracts database number from URL
  - Returns integer database number
  
validate_database_number(db):
  - Validates database number is 0-15
  - Raises error if invalid
```

### Benefits of Database Separation
| Benefit | Description |
|---------|-------------|
| **Isolation** | Different purposes don't interfere |
| **Selective Clearing** | Clear cache without affecting sessions |
| **Monitoring** | Track size/usage per purpose |
| **Debugging** | Easier to identify key source |
| **Performance** | Different databases can have different configurations |

### Verification
- Database number constants defined
- Database allocation documented
- Helper functions created
- Separation benefits documented
- URLs use correct database numbers

---

## Expected Outcome After This Document

```
backend/
├── config/
│   └── settings/
│       └── redis.py              # Redis settings module
├── .env.example                  # REDIS_URL documented
└── .env                          # REDIS_URL configured (local only)
```

### Settings File Content Structure
```
redis.py contains:
├── Docstring and imports
├── Environment variable loading
├── Base REDIS_URL configuration
├── Development URL defaults
├── Production URL requirements
├── Database number constants
├── Helper functions
└── Configuration documentation
```

---

## Sri Lanka-Specific Considerations

- **Local Cloud Providers:** Consider SLT Data Center, Dialog Cloud for Redis hosting
- **Network Latency:** Local hosting reduces latency vs international cloud
- **Data Residency:** Redis data stays in Sri Lanka if using local providers
- **Backup Location:** Configure RDB/AOF backups to local storage
- **ISP Connectivity:** Multiple ISP links for Redis access redundancy

---

## Common Issues and Solutions

### Issue 1: Environment Variable Not Loading
**Symptoms:** Redis connection fails, uses wrong URL

**Solutions:**
- Verify .env file exists in correct location
- Check django-environ is installed and configured
- Ensure .env file is read before settings import
- Verify environment variable name matches exactly
- Check for typos in variable names

### Issue 2: Wrong Database Number in URL
**Symptoms:** Keys from different purposes mixed together

**Solutions:**
- Verify database number in URL
- Check URL parsing is correct
- Ensure each cache alias uses different database
- Validate constants are used consistently
- Test database isolation

### Issue 3: Production URL Not Set
**Symptoms:** Application fails to start in production

**Solutions:**
- Set REDIS_URL environment variable in production
- Use cloud provider's secret manager
- Validate required variables on startup
- Add clear error messages for missing config
- Document deployment environment requirements

### Issue 4: TLS Connection Fails in Production
**Symptoms:** SSL/TLS errors when connecting to Redis

**Solutions:**
- Verify rediss:// scheme is used
- Check SSL certificate validity
- Configure certificate verification settings
- Check cloud provider's TLS requirements
- Verify port is TLS port (usually 6380)

---

## Notes for AI Agents

1. **Settings Organization:** Keep Redis settings in separate file for clarity
2. **Environment Variables:** Always use environment variables, never hardcode
3. **Database Allocation:** Consistent allocation prevents key collisions
4. **TLS in Production:** Always use TLS for production Redis connections
5. **Secret Management:** Use cloud provider secrets manager in production
6. **Documentation:** Document each database's purpose clearly
7. **Validation:** Validate production configuration on startup
8. **Git Security:** Never commit .env file with actual credentials

---

## Validation Checklist

Before proceeding to the next document:

- [ ] redis.py settings file created
- [ ] REDIS_URL environment variable configured
- [ ] Development URL defaults set
- [ ] Production URL requirements documented
- [ ] Database numbers allocated and documented
- [ ] .env.example updated
- [ ] Helper functions created
- [ ] Settings validated in both development and Docker
- [ ] Changes committed to Git (excluding .env)

---

## Next Steps

After completing these tasks:
1. Proceed to [03_Tasks-11-14_Redis-Pool-Integration.md](03_Tasks-11-14_Redis-Pool-Integration.md)
2. Configure Redis connection pool settings
3. Set up socket timeouts
4. Integrate Redis settings into Django base configuration
