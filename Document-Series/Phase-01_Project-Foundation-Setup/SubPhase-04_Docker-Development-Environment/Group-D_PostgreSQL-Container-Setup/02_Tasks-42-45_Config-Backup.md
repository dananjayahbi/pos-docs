# Tasks 42-45: Configuration and Backup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** D - PostgreSQL Container Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-41_Init-Script.md](01_Tasks-35-41_Init-Script.md)
- **→ Next Group:** [../Group-E_Redis-Container-Setup/00_GROUP_OVERVIEW.md](../Group-E_Redis-Container-Setup/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating the PostgreSQL configuration file with optimized settings and a backup script for development convenience.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Create postgres/postgresql.conf | Medium |
| 43 | Configure Max Connections | Simple |
| 44 | Configure Shared Buffers | Simple |
| 45 | Create Backup Script | Medium |

---

## Task 42: Create postgres/postgresql.conf

### Overview
Create a custom PostgreSQL configuration file for the development environment.

### Dependencies
- Task 04: Create docker/postgres/ Directory

### Instructions

1. **Create postgresql.conf**
   - In docker/postgres/

2. **Add header documentation**
   - Development purpose

3. **Include base settings**
   - Listen address, port

### File Location

```
docker/
└── postgres/
    ├── init.sql
    └── postgresql.conf
```

### Configuration Structure

```ini
# ==================================================
# LankaCommerce Cloud - PostgreSQL Configuration
# ==================================================
# Purpose: Development environment settings
# Version: PostgreSQL 15+
# ==================================================

# -------------------------------------------------
# Connection Settings
# -------------------------------------------------
listen_addresses = '*'
port = 5432
```

### Settings Categories

| Category | Purpose |
|----------|---------|
| Connections | Network access |
| Memory | Buffer allocation |
| Logging | Query logging |
| Performance | Query optimization |

### Docker Integration

Mount in docker-compose:
```yaml
volumes:
  - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

### Expected Outcome
- Configuration file created
- Base settings added

### Verification Checklist
- [ ] File created
- [ ] Header documentation
- [ ] listen_addresses = '*'
- [ ] port = 5432

---

## Task 43: Configure Max Connections

### Overview
Configure the maximum number of database connections.

### Dependencies
- Task 42: Create postgres/postgresql.conf

### Instructions

1. **Set max_connections**
   - Appropriate for development

2. **Consider Django pools**
   - Connection pooling

3. **Document reasoning**
   - Why this value

### Configuration Addition

```ini
# -------------------------------------------------
# Connection Limits
# -------------------------------------------------
max_connections = 100
superuser_reserved_connections = 3
```

### Connection Calculation

For development:
| Consumer | Connections |
|----------|-------------|
| Django app | 10-20 |
| Celery workers | 10-20 |
| Admin/monitoring | 5-10 |
| Testing | 20-30 |
| Buffer | 20-30 |

Total: ~100 connections

### Django Settings

```python
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 60,  # Connection reuse
        # ...
    }
}
```

### Production Note

| Environment | Connections |
|-------------|-------------|
| Development | 100 |
| Production | 200-400 |

### Expected Outcome
- Connection limit set
- Documented reasoning

### Verification Checklist
- [ ] max_connections = 100
- [ ] superuser_reserved set
- [ ] Comments explain choice

---

## Task 44: Configure Shared Buffers

### Overview
Configure PostgreSQL memory settings for development.

### Dependencies
- Task 42: Create postgres/postgresql.conf

### Instructions

1. **Set shared_buffers**
   - For development machine

2. **Set work_mem**
   - Per operation memory

3. **Set maintenance_work_mem**
   - For maintenance ops

### Configuration Addition

```ini
# -------------------------------------------------
# Memory Settings
# -------------------------------------------------
# Shared buffers (25% of container memory, adjust based on host)
shared_buffers = 256MB

# Work memory per operation
work_mem = 16MB

# Maintenance operations
maintenance_work_mem = 64MB

# Effective cache size (estimate of OS cache)
effective_cache_size = 512MB
```

### Memory Guidelines

| Setting | Formula | Dev Value |
|---------|---------|-----------|
| shared_buffers | 25% RAM | 256MB |
| work_mem | Per query | 16MB |
| maintenance_work_mem | Vacuum/index | 64MB |
| effective_cache_size | 50-75% RAM | 512MB |

### Additional Performance Settings

```ini
# -------------------------------------------------
# Performance Settings
# -------------------------------------------------
# Query planning
random_page_cost = 1.1
effective_io_concurrency = 200

# Background writer
bgwriter_lru_maxpages = 100
bgwriter_lru_multiplier = 2.0
```

### Logging Settings

```ini
# -------------------------------------------------
# Logging Settings
# -------------------------------------------------
# Log all queries (development only)
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'all'
log_duration = on
log_min_duration_statement = 100
```

### Development vs Production

| Setting | Development | Production |
|---------|-------------|------------|
| shared_buffers | 256MB | 2-4GB |
| work_mem | 16MB | 64MB |
| log_statement | 'all' | 'ddl' |

### Complete postgresql.conf

```ini
# ==================================================
# LankaCommerce Cloud - PostgreSQL Configuration
# ==================================================
# Purpose: Development environment settings
# Version: PostgreSQL 15+
# ==================================================

# -------------------------------------------------
# Connection Settings
# -------------------------------------------------
listen_addresses = '*'
port = 5432

# -------------------------------------------------
# Connection Limits
# -------------------------------------------------
max_connections = 100
superuser_reserved_connections = 3

# -------------------------------------------------
# Memory Settings
# -------------------------------------------------
shared_buffers = 256MB
work_mem = 16MB
maintenance_work_mem = 64MB
effective_cache_size = 512MB

# -------------------------------------------------
# Performance Settings
# -------------------------------------------------
random_page_cost = 1.1
effective_io_concurrency = 200
bgwriter_lru_maxpages = 100
bgwriter_lru_multiplier = 2.0

# -------------------------------------------------
# Logging (Development)
# -------------------------------------------------
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_statement = 'all'
log_duration = on
log_min_duration_statement = 100

# -------------------------------------------------
# Locale Settings
# -------------------------------------------------
datestyle = 'iso, mdy'
timezone = 'Asia/Colombo'
lc_messages = 'en_US.utf8'
lc_monetary = 'en_US.utf8'
lc_numeric = 'en_US.utf8'
lc_time = 'en_US.utf8'
default_text_search_config = 'pg_catalog.english'
```

### Expected Outcome
- Memory settings configured
- Query logging enabled

### Verification Checklist
- [ ] shared_buffers set
- [ ] work_mem set
- [ ] Logging configured
- [ ] Timezone Asia/Colombo

---

## Task 45: Create Backup Script

### Overview
Create a backup script for development convenience.

### Dependencies
- Task 04: Create docker/postgres/ Directory

### Instructions

1. **Create backup.sh**
   - In docker/postgres/

2. **Add pg_dump command**
   - Full database backup

3. **Include timestamp**
   - Unique backup names

### File Location

```
docker/
└── postgres/
    ├── init.sql
    ├── postgresql.conf
    └── backup.sh
```

### Backup Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - PostgreSQL Backup Script
# ==================================================
# Purpose: Development backup (NOT for production)
# Usage: ./backup.sh [database_name]
# ==================================================

set -e

# Configuration
DB_NAME="${1:-lankacommerce}"
DB_USER="${POSTGRES_USER:-lcc_user}"
DB_HOST="${POSTGRES_HOST:-localhost}"
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

echo "Starting backup of database: ${DB_NAME}"
echo "Backup file: ${BACKUP_FILE}"

# Perform backup
pg_dump \
    -h "${DB_HOST}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    -F p \
    -f "${BACKUP_FILE}"

# Compress if successful
if [ -f "${BACKUP_FILE}" ]; then
    gzip "${BACKUP_FILE}"
    echo "Backup completed: ${BACKUP_FILE}.gz"
    
    # Show file size
    ls -lh "${BACKUP_FILE}.gz"
else
    echo "Backup failed!"
    exit 1
fi

# Optional: Cleanup old backups (keep last 5)
echo "Cleaning old backups..."
ls -t ${BACKUP_DIR}/${DB_NAME}_*.sql.gz 2>/dev/null | tail -n +6 | xargs -r rm

echo "Backup complete!"
```

### Restore Script

Companion restore script:

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - PostgreSQL Restore Script
# ==================================================
# Purpose: Restore from backup (development only)
# Usage: ./restore.sh backup_file.sql.gz
# ==================================================

set -e

BACKUP_FILE="${1}"
DB_NAME="${2:-lankacommerce}"
DB_USER="${POSTGRES_USER:-lcc_user}"
DB_HOST="${POSTGRES_HOST:-localhost}"

if [ -z "${BACKUP_FILE}" ]; then
    echo "Usage: $0 <backup_file.sql.gz> [database_name]"
    exit 1
fi

echo "Restoring database: ${DB_NAME}"
echo "From backup: ${BACKUP_FILE}"

# Decompress and restore
gunzip -c "${BACKUP_FILE}" | psql \
    -h "${DB_HOST}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}"

echo "Restore complete!"
```

### Script Permissions

```bash
chmod +x docker/postgres/backup.sh
chmod +x docker/postgres/restore.sh
```

### Docker Usage

Run backup from container:
```bash
docker compose exec postgres /scripts/backup.sh
```

### Volume Mapping

In docker-compose:
```yaml
volumes:
  - ./postgres/backup.sh:/scripts/backup.sh:ro
  - ./backups:/backups
```

### Expected Outcome
- Backup script created
- Executable permissions

### Verification Checklist
- [ ] backup.sh created
- [ ] Timestamp in filename
- [ ] Compression enabled
- [ ] Cleanup old backups

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 42 | Create postgres/postgresql.conf | Configuration file |
| 43 | Configure Max Connections | 100 connections |
| 44 | Configure Shared Buffers | Memory settings |
| 45 | Create Backup Script | backup.sh |

### Files Created
| File | Purpose |
|------|---------|
| postgresql.conf | PostgreSQL settings |
| backup.sh | Backup script |
| restore.sh | Restore script (optional) |

### Final postgres/ Directory

```
docker/postgres/
├── init.sql           # Database initialization
├── postgresql.conf    # PostgreSQL configuration
├── backup.sh          # Backup script
└── restore.sh         # Restore script (optional)
```

### Next Steps
Proceed to [../Group-E_Redis-Container-Setup/00_GROUP_OVERVIEW.md](../Group-E_Redis-Container-Setup/00_GROUP_OVERVIEW.md) for Redis container configuration.

---

## Notes for AI Agents

1. **Config mount:** Custom config requires command override
2. **Timezone:** Asia/Colombo for Sri Lanka
3. **Logging:** Development only, disable in production
4. **Backup:** Convenience script, not production-grade
5. **Permissions:** Set executable on scripts
6. **Git:** Commit Group D files together
