# SubPhase 01: PostgreSQL Configuration - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 01 of 10  
> **SubPhase Goal:** Configure PostgreSQL database optimized for multi-tenant schema isolation  
> **Total Tasks:** 78 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-01_Project-Foundation-Setup](../../Phase-01_Project-Foundation-Setup/)
- **→ Next SubPhase:** [SubPhase-02_Django-Tenants-Installation](../SubPhase-02_Django-Tenants-Installation/)

---

## SubPhase Overview

This sub-phase configures PostgreSQL 15+ for multi-tenant schema isolation. The setup includes proper database configuration, connection pooling, schema management, performance tuning, and backup strategies essential for a production-ready multi-tenant SaaS platform.

### Key Outcomes
- PostgreSQL 15+ properly configured for schemas
- Connection pooling with PgBouncer
- Schema search path configuration
- Performance tuning for multi-tenant workload
- Backup and recovery strategy
- Database monitoring setup

### Technology Context
- **Database:** PostgreSQL 15+
- **Connection Pooler:** PgBouncer
- **Extensions:** uuid-ossp, hstore, pg_stat_statements
- **Schema Approach:** One schema per tenant

### Dependencies
- **Requires:** Phase-01 SubPhase-04 (Docker Development Environment)
- **Docker and Docker Compose must be configured**

---

## Task Execution Order

```
TASK GROUP A: PostgreSQL Installation & Setup (Tasks 01-12)
        │
        ▼
TASK GROUP B: Database Configuration (Tasks 13-26)
        │
        ▼
TASK GROUP C: Schema Configuration (Tasks 27-38)
        │
        ▼
TASK GROUP D: Connection Pooling - PgBouncer (Tasks 39-52)
        │
        ▼
TASK GROUP E: Performance Tuning (Tasks 53-64)
        │
        ▼
TASK GROUP F: Backup & Monitoring (Tasks 65-78)
```

---

## Task Index

### Group A: PostgreSQL Installation & Setup (Tasks 01-12)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Verify PostgreSQL Version** | Ensure PostgreSQL 15+ is used | Phase-01 | 🔴 Not Created |
| 02 | **Update Docker Compose** | Configure PostgreSQL 15 image | Task 01 | 🔴 Not Created |
| 03 | **Configure PostgreSQL User** | Create dedicated database user | Task 02 | 🔴 Not Created |
| 04 | **Create Main Database** | Create lankacommerce database | Task 03 | 🔴 Not Created |
| 05 | **Create Test Database** | Create test database | Task 03 | 🔴 Not Created |
| 06 | **Enable uuid-ossp Extension** | For UUID primary keys | Task 04 | 🔴 Not Created |
| 07 | **Enable hstore Extension** | For key-value storage | Task 04 | 🔴 Not Created |
| 08 | **Enable pg_stat_statements** | For query monitoring | Task 04 | 🔴 Not Created |
| 09 | **Enable btree_gin Extension** | For composite indexes | Task 04 | 🔴 Not Created |
| 10 | **Configure Database Encoding** | UTF-8 encoding | Task 04 | 🔴 Not Created |
| 11 | **Configure Locale Settings** | en_US.UTF-8 locale | Task 04 | 🔴 Not Created |
| 12 | **Verify PostgreSQL Startup** | Test database connection | Task 11 | 🔴 Not Created |

---

### Group B: Database Configuration (Tasks 13-26)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 13 | **Create postgresql.conf** | Main configuration file | Task 12 | 🔴 Not Created |
| 14 | **Configure Listen Addresses** | listen_addresses = '*' | Task 13 | 🔴 Not Created |
| 15 | **Configure Port** | port = 5432 | Task 13 | 🔴 Not Created |
| 16 | **Configure Max Connections** | max_connections = 200 | Task 13 | 🔴 Not Created |
| 17 | **Configure Shared Buffers** | shared_buffers = 256MB | Task 13 | 🔴 Not Created |
| 18 | **Configure Effective Cache Size** | effective_cache_size = 768MB | Task 13 | 🔴 Not Created |
| 19 | **Configure Work Mem** | work_mem = 4MB | Task 13 | 🔴 Not Created |
| 20 | **Configure Maintenance Work Mem** | maintenance_work_mem = 64MB | Task 13 | 🔴 Not Created |
| 21 | **Configure WAL Settings** | WAL level and buffers | Task 13 | 🔴 Not Created |
| 22 | **Configure Checkpoint Settings** | checkpoint_completion_target | Task 13 | 🔴 Not Created |
| 23 | **Configure pg_hba.conf** | Client authentication | Task 13 | 🔴 Not Created |
| 24 | **Configure SSL Mode** | SSL for production | Task 23 | 🔴 Not Created |
| 25 | **Configure Logging** | Log settings and rotation | Task 13 | 🔴 Not Created |
| 26 | **Restart PostgreSQL** | Apply configuration | Task 25 | 🔴 Not Created |

---

### Group C: Schema Configuration (Tasks 27-38)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 27 | **Create Public Schema** | Ensure public schema exists | Task 26 | 🔴 Not Created |
| 28 | **Configure Search Path** | Default search_path | Task 27 | 🔴 Not Created |
| 29 | **Grant Schema Permissions** | Grant CREATE on public | Task 27 | 🔴 Not Created |
| 30 | **Create Schema Template** | Template for tenant schemas | Task 29 | 🔴 Not Created |
| 31 | **Document Schema Naming** | tenant_<slug> convention | Task 30 | 🔴 Not Created |
| 32 | **Create Schema Creation Function** | PL/pgSQL function | Task 30 | 🔴 Not Created |
| 33 | **Create Schema Drop Function** | Safe schema deletion | Task 32 | 🔴 Not Created |
| 34 | **Create Schema Exists Function** | Check schema existence | Task 32 | 🔴 Not Created |
| 35 | **Create Schema List Function** | List all tenant schemas | Task 32 | 🔴 Not Created |
| 36 | **Grant User Schema Privileges** | Full access to schemas | Task 29 | 🔴 Not Created |
| 37 | **Configure Default Privileges** | ALTER DEFAULT PRIVILEGES | Task 36 | 🔴 Not Created |
| 38 | **Test Schema Operations** | Create/drop test schema | Task 37 | 🔴 Not Created |

---

### Group D: Connection Pooling - PgBouncer (Tasks 39-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 39 | **Add PgBouncer to Docker** | PgBouncer service | Task 02 | 🔴 Not Created |
| 40 | **Create pgbouncer.ini** | Main configuration | Task 39 | 🔴 Not Created |
| 41 | **Configure Pool Mode** | pool_mode = transaction | Task 40 | 🔴 Not Created |
| 42 | **Configure Pool Size** | default_pool_size = 20 | Task 40 | 🔴 Not Created |
| 43 | **Configure Max Client Conn** | max_client_conn = 100 | Task 40 | 🔴 Not Created |
| 44 | **Configure Reserve Pool** | reserve_pool_size = 5 | Task 40 | 🔴 Not Created |
| 45 | **Create userlist.txt** | User authentication | Task 39 | 🔴 Not Created |
| 46 | **Configure Auth Type** | auth_type = md5 | Task 45 | 🔴 Not Created |
| 47 | **Configure Admin Console** | Admin access settings | Task 40 | 🔴 Not Created |
| 48 | **Update Django Settings** | Point to PgBouncer | Task 41 | 🔴 Not Created |
| 49 | **Configure Health Check** | PgBouncer health check | Task 40 | 🔴 Not Created |
| 50 | **Configure Logging** | PgBouncer logs | Task 40 | 🔴 Not Created |
| 51 | **Test Connection Pooling** | Verify pooling works | Task 48 | 🔴 Not Created |
| 52 | **Document PgBouncer Usage** | Configuration docs | Task 51 | 🔴 Not Created |

---

### Group E: Performance Tuning (Tasks 53-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Analyze Default Settings** | Review PostgreSQL defaults | Task 26 | 🔴 Not Created |
| 54 | **Configure Random Page Cost** | random_page_cost = 1.1 (SSD) | Task 53 | 🔴 Not Created |
| 55 | **Configure Effective IO Concurrency** | effective_io_concurrency = 200 | Task 53 | 🔴 Not Created |
| 56 | **Configure Parallel Workers** | max_parallel_workers = 4 | Task 53 | 🔴 Not Created |
| 57 | **Configure JIT Compilation** | jit = on | Task 53 | 🔴 Not Created |
| 58 | **Configure Autovacuum** | Autovacuum tuning | Task 53 | 🔴 Not Created |
| 59 | **Configure Statement Timeout** | statement_timeout = 60s | Task 53 | 🔴 Not Created |
| 60 | **Configure Lock Timeout** | lock_timeout = 10s | Task 53 | 🔴 Not Created |
| 61 | **Configure Idle Transaction Timeout** | idle_in_transaction_session_timeout | Task 53 | 🔴 Not Created |
| 62 | **Create Indexing Guidelines** | Index strategy document | Task 53 | 🔴 Not Created |
| 63 | **Run pg_stat_statements Setup** | Enable query tracking | Task 08 | 🔴 Not Created |
| 64 | **Document Tuning Decisions** | Explain configuration | Task 61 | 🔴 Not Created |

---

### Group F: Backup & Monitoring (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create Backup Script** | pg_dump based backup | Task 26 | 🔴 Not Created |
| 66 | **Configure Backup Schedule** | Daily backup cron | Task 65 | 🔴 Not Created |
| 67 | **Configure Backup Retention** | Keep 7 daily, 4 weekly | Task 65 | 🔴 Not Created |
| 68 | **Create Restore Script** | Restore from backup | Task 65 | 🔴 Not Created |
| 69 | **Test Backup/Restore** | Verify backup works | Task 68 | 🔴 Not Created |
| 70 | **Configure WAL Archiving** | Point-in-time recovery | Task 21 | 🔴 Not Created |
| 71 | **Create Monitoring Queries** | Database health queries | Task 63 | 🔴 Not Created |
| 72 | **Monitor Active Connections** | Connection monitoring | Task 71 | 🔴 Not Created |
| 73 | **Monitor Schema Sizes** | Per-tenant size tracking | Task 71 | 🔴 Not Created |
| 74 | **Monitor Slow Queries** | Slow query logging | Task 63 | 🔴 Not Created |
| 75 | **Create Makefile Commands** | make db-backup, db-restore | Task 69 | 🔴 Not Created |
| 76 | **Document Backup Procedures** | Backup documentation | Task 69 | 🔴 Not Created |
| 77 | **Verify Full Setup** | Test complete configuration | Task 76 | 🔴 Not Created |
| 78 | **Create Initial Commit** | Commit all DB setup | Task 77 | 🔴 Not Created |

---

## Task Details

### Task 13: Create postgresql.conf

**Goal:** Create optimized PostgreSQL configuration.

**Content:**
```conf
# postgresql.conf - LankaCommerce Cloud Configuration

# ==============================================
# CONNECTION SETTINGS
# ==============================================
listen_addresses = '*'
port = 5432
max_connections = 200
superuser_reserved_connections = 3

# ==============================================
# MEMORY SETTINGS
# ==============================================
shared_buffers = 256MB
effective_cache_size = 768MB
work_mem = 4MB
maintenance_work_mem = 64MB
wal_buffers = 16MB

# ==============================================
# WRITE AHEAD LOG
# ==============================================
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB
checkpoint_completion_target = 0.9

# ==============================================
# QUERY TUNING
# ==============================================
random_page_cost = 1.1
effective_io_concurrency = 200
default_statistics_target = 100

# ==============================================
# PARALLEL QUERY
# ==============================================
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2

# ==============================================
# AUTOVACUUM
# ==============================================
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 1min
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50

# ==============================================
# LOGGING
# ==============================================
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'ddl'

# ==============================================
# STATEMENT BEHAVIOR
# ==============================================
statement_timeout = 60000
lock_timeout = 10000
idle_in_transaction_session_timeout = 60000

# ==============================================
# CLIENT CONNECTION DEFAULTS
# ==============================================
datestyle = 'iso, mdy'
timezone = 'Asia/Colombo'
lc_messages = 'en_US.UTF-8'
lc_monetary = 'en_US.UTF-8'
lc_numeric = 'en_US.UTF-8'
lc_time = 'en_US.UTF-8'

# ==============================================
# EXTENSIONS
# ==============================================
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
pg_stat_statements.max = 10000
```

---

### Task 32: Create Schema Creation Function

**Goal:** Create PL/pgSQL function for tenant schema creation.

**Content:**
```sql
-- Function to create a new tenant schema
CREATE OR REPLACE FUNCTION create_tenant_schema(schema_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Validate schema name
    IF schema_name IS NULL OR schema_name = '' THEN
        RAISE EXCEPTION 'Schema name cannot be empty';
    END IF;
    
    IF NOT (schema_name ~ '^tenant_[a-z0-9_]+$') THEN
        RAISE EXCEPTION 'Schema name must match pattern: tenant_<slug>';
    END IF;
    
    -- Check if schema already exists
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = schema_name) THEN
        RAISE EXCEPTION 'Schema % already exists', schema_name;
    END IF;
    
    -- Create the schema
    EXECUTE format('CREATE SCHEMA %I', schema_name);
    
    -- Grant permissions to application user
    EXECUTE format('GRANT ALL ON SCHEMA %I TO postgres', schema_name);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON TABLES TO postgres', schema_name);
    EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON SEQUENCES TO postgres', schema_name);
    
    RAISE NOTICE 'Created tenant schema: %', schema_name;
END;
$$ LANGUAGE plpgsql;

-- Function to safely drop a tenant schema
CREATE OR REPLACE FUNCTION drop_tenant_schema(schema_name TEXT, cascade_drop BOOLEAN DEFAULT FALSE)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = schema_name) THEN
        RAISE EXCEPTION 'Schema % does not exist', schema_name;
    END IF;
    
    IF schema_name = 'public' THEN
        RAISE EXCEPTION 'Cannot drop public schema';
    END IF;
    
    IF cascade_drop THEN
        EXECUTE format('DROP SCHEMA %I CASCADE', schema_name);
    ELSE
        EXECUTE format('DROP SCHEMA %I', schema_name);
    END IF;
    
    RAISE NOTICE 'Dropped tenant schema: %', schema_name;
END;
$$ LANGUAGE plpgsql;

-- Function to check if schema exists
CREATE OR REPLACE FUNCTION tenant_schema_exists(schema_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = schema_name);
END;
$$ LANGUAGE plpgsql;

-- Function to list all tenant schemas
CREATE OR REPLACE FUNCTION list_tenant_schemas()
RETURNS TABLE(schema_name TEXT, size_bytes BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nspname::TEXT,
        pg_total_relation_size(nspname::TEXT)
    FROM pg_namespace 
    WHERE nspname LIKE 'tenant_%'
    ORDER BY nspname;
END;
$$ LANGUAGE plpgsql;
```

---

### Task 40: Create pgbouncer.ini

**Goal:** Configure PgBouncer for connection pooling.

**Content:**
```ini
; pgbouncer.ini - Connection Pooler Configuration

[databases]
; Format: logical_name = connection_string
lankacommerce = host=postgres port=5432 dbname=lankacommerce

; Wildcard for all tenant schemas
* = host=postgres port=5432

[pgbouncer]
; Connection settings
listen_addr = *
listen_port = 6432
unix_socket_dir = /var/run/pgbouncer

; Authentication
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

; Pool settings
pool_mode = transaction
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3

; Connection limits
max_client_conn = 100
max_db_connections = 50
max_user_connections = 50

; Timeouts
server_reset_query = DISCARD ALL
server_check_query = SELECT 1
server_check_delay = 30
query_timeout = 60
client_idle_timeout = 0
idle_transaction_timeout = 60

; Logging
log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
stats_period = 60

; Admin
admin_users = postgres
stats_users = postgres

; TLS (for production)
; server_tls_sslmode = require
; server_tls_ca_file = /etc/ssl/certs/ca.pem
```

---

### Task 65: Create Backup Script

**Goal:** Create automated database backup script.

**Content:**
```bash
#!/bin/bash
# scripts/db-backup.sh - Database Backup Script

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/lankacommerce_${TIMESTAMP}.sql.gz"

# Database connection (from environment)
PGHOST="${DATABASE_HOST:-postgres}"
PGPORT="${DATABASE_PORT:-5432}"
PGDATABASE="${DATABASE_NAME:-lankacommerce}"
PGUSER="${DATABASE_USER:-postgres}"
export PGPASSWORD="${DATABASE_PASSWORD:-postgres}"

echo "🔄 Starting database backup..."
echo "   Host: ${PGHOST}"
echo "   Database: ${PGDATABASE}"
echo "   Backup file: ${BACKUP_FILE}"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Perform backup
pg_dump \
    -h "${PGHOST}" \
    -p "${PGPORT}" \
    -U "${PGUSER}" \
    -d "${PGDATABASE}" \
    --format=custom \
    --compress=9 \
    --verbose \
    --no-owner \
    --no-acl \
    | gzip > "${BACKUP_FILE}"

# Verify backup
if [ -f "${BACKUP_FILE}" ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "✅ Backup completed successfully!"
    echo "   Size: ${SIZE}"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Cleanup old backups
echo "🧹 Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "lankacommerce_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# List remaining backups
echo "📁 Current backups:"
ls -lh "${BACKUP_DIR}"/lankacommerce_*.sql.gz 2>/dev/null || echo "   No backups found"

echo "✅ Backup process completed!"
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── docker/
│   ├── postgres/
│   │   ├── postgresql.conf
│   │   ├── pg_hba.conf
│   │   ├── init.sql
│   │   └── functions.sql
│   └── pgbouncer/
│       ├── pgbouncer.ini
│       └── userlist.txt
├── scripts/
│   ├── db-backup.sh
│   ├── db-restore.sh
│   └── db-monitoring.sql
├── docker-compose.yml (updated with PgBouncer)
└── docs/
    ├── database/
    │   ├── configuration.md
    │   ├── backup-restore.md
    │   └── monitoring.md
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 78 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 78 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Groups A-B before C-D
2. **PostgreSQL Version:** Must use PostgreSQL 15+ for schema features
3. **Connection Pooling:** PgBouncer is essential for multi-tenant performance
4. **Schema Naming:** All tenant schemas must follow tenant_<slug> pattern
5. **Extensions:** Install all required extensions before django-tenants setup
6. **Backups:** Test restore procedure in development
7. **Memory Settings:** Adjust based on container resources
8. **Security:** Never expose PostgreSQL directly to internet
