# Tasks 81-85: Development Scripts

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 04 - Docker Development Environment  
> **Group:** H - Development Scripts & Verification  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-G_Docker-Compose-Configuration/03_Tasks-75-80_Config-Complete.md](../Group-G_Docker-Compose-Configuration/03_Tasks-75-80_Config-Complete.md)
- **→ Next Document:** [02_Tasks-86-89_Verification.md](02_Tasks-86-89_Verification.md)

---

## Document Overview

This document covers creating development convenience scripts and Makefile targets for Docker operations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create Development Start Script | Medium |
| 82 | Create Development Stop Script | Simple |
| 83 | Update Makefile with Docker Targets | Medium |
| 84 | Create wait-for-it.sh Script | Medium |
| 85 | Create Database Reset Script | Medium |

---

## Task 81: Create Development Start Script

### Overview
Create a script to start the complete development environment.

### Dependencies
- Task 80: Create docker-compose.prod.yml

### Instructions

1. **Create dev-start.sh**
   - In docker/scripts/

2. **Add startup sequence**
   - Build and up

3. **Include health checks**
   - Wait for services

### File Location

```
docker/
└── scripts/
    └── dev-start.sh
```

### Development Start Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Development Start Script
# ==================================================
# Purpose: Start complete development environment
# Usage: ./docker/scripts/dev-start.sh [options]
# Options:
#   --build    Rebuild images before starting
#   --detach   Run in background (default)
#   --attach   Run in foreground
# ==================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Options
BUILD=""
MODE="-d"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD="--build"
            shift
            ;;
        --attach)
            MODE=""
            shift
            ;;
        --detach)
            MODE="-d"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}=========================================="
echo "LankaCommerce Cloud - Starting Development"
echo -e "==========================================${NC}"

# Change to project root
cd "${PROJECT_ROOT}"

# Check for .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from .env.example${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}.env file created. Please review and update values.${NC}"
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Start containers
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker compose up ${BUILD} ${MODE}

if [ "${MODE}" = "-d" ]; then
    echo ""
    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    
    # Wait for database
    echo -n "Waiting for PostgreSQL... "
    timeout 60 bash -c 'until docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done' && \
        echo -e "${GREEN}Ready${NC}" || echo -e "${RED}Timeout${NC}"
    
    # Wait for Redis
    echo -n "Waiting for Redis... "
    timeout 30 bash -c 'until docker compose exec -T redis redis-cli ping > /dev/null 2>&1; do sleep 1; done' && \
        echo -e "${GREEN}Ready${NC}" || echo -e "${RED}Timeout${NC}"
    
    # Wait for backend
    echo -n "Waiting for Backend... "
    timeout 120 bash -c 'until curl -sf http://localhost:8000/health/ > /dev/null 2>&1; do sleep 2; done' && \
        echo -e "${GREEN}Ready${NC}" || echo -e "${YELLOW}May still be starting${NC}"
    
    # Wait for frontend
    echo -n "Waiting for Frontend... "
    timeout 120 bash -c 'until curl -sf http://localhost:3000 > /dev/null 2>&1; do sleep 2; done' && \
        echo -e "${GREEN}Ready${NC}" || echo -e "${YELLOW}May still be starting${NC}"
    
    echo ""
    echo -e "${GREEN}=========================================="
    echo "Development environment is ready!"
    echo "=========================================="
    echo ""
    echo "Services:"
    echo "  Backend API:  http://localhost:8000"
    echo "  Frontend:     http://localhost:3000"
    echo "  Flower:       http://localhost:5555"
    echo "  PostgreSQL:   localhost:5432"
    echo "  Redis:        localhost:6379"
    echo ""
    echo "Commands:"
    echo "  View logs:    docker compose logs -f"
    echo "  Stop:         ./docker/scripts/dev-stop.sh"
    echo -e "==========================================${NC}"
fi
```

### Executable Permission

```bash
chmod +x docker/scripts/dev-start.sh
```

### Expected Outcome
- Start script created
- Health checks included

### Verification Checklist
- [ ] Script created
- [ ] Parse arguments
- [ ] .env check
- [ ] Health waits
- [ ] Status output

---

## Task 82: Create Development Stop Script

### Overview
Create a script to cleanly stop the development environment.

### Dependencies
- Task 81: Create Development Start Script

### Instructions

1. **Create dev-stop.sh**
   - In docker/scripts/

2. **Add stop commands**
   - Graceful shutdown

3. **Include cleanup option**
   - Volume removal

### Development Stop Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Development Stop Script
# ==================================================
# Purpose: Stop development environment
# Usage: ./docker/scripts/dev-stop.sh [options]
# Options:
#   --clean    Remove volumes (database data)
#   --prune    Remove all unused Docker resources
# ==================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Options
CLEAN=""
PRUNE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN="-v"
            shift
            ;;
        --prune)
            PRUNE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}=========================================="
echo "LankaCommerce Cloud - Stopping Development"
echo -e "==========================================${NC}"

cd "${PROJECT_ROOT}"

# Stop containers
echo -e "${YELLOW}Stopping Docker containers...${NC}"
docker compose down ${CLEAN}

if [ "${CLEAN}" = "-v" ]; then
    echo -e "${YELLOW}Volumes have been removed.${NC}"
fi

if [ "${PRUNE}" = true ]; then
    echo -e "${YELLOW}Pruning unused Docker resources...${NC}"
    docker system prune -f
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Development environment stopped."
echo -e "==========================================${NC}"
```

### Expected Outcome
- Stop script created
- Clean shutdown

### Verification Checklist
- [ ] Script created
- [ ] Graceful stop
- [ ] Volume cleanup option
- [ ] Prune option

---

## Task 83: Update Makefile with Docker Targets

### Overview
Add Docker-related targets to the project Makefile.

### Dependencies
- Task 80: Create docker-compose.prod.yml

### Instructions

1. **Add Docker targets**
   - Common operations

2. **Document commands**
   - Help target

3. **Organize sections**
   - Development, production

### Makefile Docker Section

```makefile
# ==================================================
# Docker Targets
# ==================================================

.PHONY: docker-up docker-down docker-build docker-logs docker-shell \
        docker-db-shell docker-db-reset docker-clean docker-status

## Start development environment
docker-up:
	./docker/scripts/dev-start.sh

## Start with rebuild
docker-up-build:
	./docker/scripts/dev-start.sh --build

## Stop development environment
docker-down:
	./docker/scripts/dev-stop.sh

## Stop and remove volumes
docker-down-clean:
	./docker/scripts/dev-stop.sh --clean

## Build all Docker images
docker-build:
	docker compose build

## Build without cache
docker-build-fresh:
	docker compose build --no-cache

## View logs for all services
docker-logs:
	docker compose logs -f

## View logs for specific service
docker-logs-%:
	docker compose logs -f $*

## Open shell in backend container
docker-shell:
	docker compose exec backend bash

## Open shell in frontend container
docker-shell-frontend:
	docker compose exec frontend sh

## Open PostgreSQL shell
docker-db-shell:
	docker compose exec db psql -U postgres -d lankacommerce

## Reset database
docker-db-reset:
	./docker/scripts/db-reset.sh

## Run Django management command
docker-manage:
	docker compose exec backend python manage.py $(cmd)

## Run Django migrations
docker-migrate:
	docker compose exec backend python manage.py migrate

## Create Django superuser
docker-superuser:
	docker compose exec backend python manage.py createsuperuser

## Show container status
docker-status:
	docker compose ps

## Remove all containers and volumes
docker-clean:
	docker compose down -v --remove-orphans
	docker system prune -f

## Show Docker help
docker-help:
	@echo ""
	@echo "Docker Development Commands:"
	@echo "  docker-up           Start development environment"
	@echo "  docker-up-build     Start with rebuild"
	@echo "  docker-down         Stop development environment"
	@echo "  docker-down-clean   Stop and remove volumes"
	@echo "  docker-build        Build all images"
	@echo "  docker-logs         View all logs"
	@echo "  docker-shell        Backend shell"
	@echo "  docker-db-shell     PostgreSQL shell"
	@echo "  docker-db-reset     Reset database"
	@echo "  docker-migrate      Run migrations"
	@echo "  docker-status       Show container status"
	@echo "  docker-clean        Remove everything"
	@echo ""
```

### Usage Examples

| Command | Action |
|---------|--------|
| make docker-up | Start environment |
| make docker-logs-backend | View backend logs |
| make docker-migrate | Run migrations |
| make docker-shell | Backend shell |

### Expected Outcome
- Makefile updated
- Docker targets added

### Verification Checklist
- [ ] All targets defined
- [ ] .PHONY declaration
- [ ] Help target
- [ ] Documentation

---

## Task 84: Create wait-for-it.sh Script

### Overview
Create a utility script to wait for services to be available.

### Dependencies
- Task 07: Create docker/scripts/ Directory

### Instructions

1. **Create wait-for-it.sh**
   - In docker/scripts/

2. **Add timeout logic**
   - Configurable wait

3. **Support TCP checks**
   - Host:port format

### wait-for-it Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Wait for Service Script
# ==================================================
# Purpose: Wait for a service to be available
# Usage: ./wait-for-it.sh host:port [-t timeout] [-- command]
# Example: ./wait-for-it.sh db:5432 -t 60 -- python manage.py migrate
# ==================================================

set -e

TIMEOUT=30
QUIET=0
HOST=""
PORT=""
PROTOCOL="tcp"

usage() {
    echo "Usage: $0 host:port [-t timeout] [-q] [-- command args]"
    echo ""
    echo "Options:"
    echo "  -t TIMEOUT     Timeout in seconds (default: 30)"
    echo "  -q             Quiet mode, don't output status"
    echo "  -- COMMAND     Execute command after wait"
    exit 1
}

# Parse host:port
parse_hostport() {
    local hostport=$1
    HOST="${hostport%%:*}"
    PORT="${hostport##*:}"
    
    if [ -z "$HOST" ] || [ -z "$PORT" ]; then
        echo "Error: Invalid host:port format"
        usage
    fi
}

# Wait for TCP connection
wait_for_tcp() {
    local start_ts=$(date +%s)
    
    while :; do
        if nc -z "$HOST" "$PORT" > /dev/null 2>&1; then
            local end_ts=$(date +%s)
            [ "$QUIET" -eq 0 ] && echo "$HOST:$PORT is available after $((end_ts - start_ts)) seconds"
            return 0
        fi
        
        local current_ts=$(date +%s)
        if [ $((current_ts - start_ts)) -ge "$TIMEOUT" ]; then
            echo "Timeout: $HOST:$PORT not available after $TIMEOUT seconds"
            return 1
        fi
        
        sleep 1
    done
}

# Parse arguments
if [ $# -eq 0 ]; then
    usage
fi

parse_hostport "$1"
shift

while [ $# -gt 0 ]; do
    case "$1" in
        -t)
            TIMEOUT="$2"
            shift 2
            ;;
        -q)
            QUIET=1
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Wait for service
wait_for_tcp || exit 1

# Execute command if provided
if [ $# -gt 0 ]; then
    exec "$@"
fi
```

### Usage Examples

| Command | Purpose |
|---------|---------|
| ./wait-for-it.sh db:5432 | Wait for PostgreSQL |
| ./wait-for-it.sh redis:6379 -t 60 | Wait 60 seconds |
| ./wait-for-it.sh db:5432 -- python manage.py migrate | Wait then run |

### Expected Outcome
- Wait script created
- TCP check working

### Verification Checklist
- [ ] Script created
- [ ] Timeout configurable
- [ ] Command execution
- [ ] Quiet mode

---

## Task 85: Create Database Reset Script

### Overview
Create a script to reset the database to a clean state.

### Dependencies
- Task 45: Complete PostgreSQL Configuration

### Instructions

1. **Create db-reset.sh**
   - In docker/scripts/

2. **Add confirmation**
   - Prevent accidents

3. **Reset sequence**
   - Drop, create, migrate

### Database Reset Script

```bash
#!/bin/bash
# ==================================================
# LankaCommerce Cloud - Database Reset Script
# ==================================================
# Purpose: Reset database to clean state
# Usage: ./docker/scripts/db-reset.sh [--force]
# WARNING: This destroys all data!
# ==================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PROJECT_ROOT}"

# Force mode
FORCE=false
if [ "$1" = "--force" ]; then
    FORCE=true
fi

echo -e "${RED}=========================================="
echo "WARNING: DATABASE RESET"
echo -e "==========================================${NC}"
echo ""
echo "This will:"
echo "  1. Drop all database tables"
echo "  2. Remove all migrations"
echo "  3. Re-run all migrations"
echo "  4. Create fresh database"
echo ""
echo -e "${RED}ALL DATA WILL BE LOST!${NC}"
echo ""

if [ "$FORCE" = false ]; then
    read -p "Are you sure? Type 'reset' to confirm: " confirm
    if [ "$confirm" != "reset" ]; then
        echo "Aborted."
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}Starting database reset...${NC}"

# Stop celery services (if running)
echo "Stopping Celery services..."
docker compose stop celery-worker celery-beat 2>/dev/null || true

# Drop and recreate database
echo "Dropping database..."
docker compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS lankacommerce;"
docker compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS lankacommerce_test;"

echo "Creating databases..."
docker compose exec -T db psql -U postgres -c "CREATE DATABASE lankacommerce WITH OWNER = postgres ENCODING = 'UTF8';"
docker compose exec -T db psql -U postgres -c "CREATE DATABASE lankacommerce_test WITH OWNER = postgres ENCODING = 'UTF8';"

# Grant permissions
echo "Setting permissions..."
docker compose exec -T db psql -U postgres -d lankacommerce -c "
    CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";
    CREATE EXTENSION IF NOT EXISTS \"hstore\";
    GRANT ALL ON SCHEMA public TO lcc_user;
"

docker compose exec -T db psql -U postgres -d lankacommerce_test -c "
    CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";
    CREATE EXTENSION IF NOT EXISTS \"hstore\";
    GRANT ALL ON SCHEMA public TO lcc_user;
"

# Run migrations
echo "Running migrations..."
docker compose exec -T backend python manage.py migrate

# Restart Celery services
echo "Restarting Celery services..."
docker compose start celery-worker celery-beat 2>/dev/null || true

echo ""
echo -e "${GREEN}=========================================="
echo "Database reset complete!"
echo -e "==========================================${NC}"
echo ""
echo "You may want to:"
echo "  - Create a superuser: make docker-superuser"
echo "  - Load fixtures: docker compose exec backend python manage.py loaddata fixtures.json"
```

### Expected Outcome
- Reset script created
- Confirmation required

### Verification Checklist
- [ ] Script created
- [ ] Confirmation prompt
- [ ] Extensions recreated
- [ ] Migrations run

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create Development Start Script | dev-start.sh |
| 82 | Create Development Stop Script | dev-stop.sh |
| 83 | Update Makefile with Docker Targets | Makefile targets |
| 84 | Create wait-for-it.sh Script | wait-for-it.sh |
| 85 | Create Database Reset Script | db-reset.sh |

### Scripts Created

```
docker/scripts/
├── celery-worker.sh     # (from Group F)
├── celery-beat.sh       # (from Group F)
├── celery-health.sh     # (from Group F)
├── flower.sh            # (from Group F)
├── dev-start.sh         # NEW
├── dev-stop.sh          # NEW
├── wait-for-it.sh       # NEW
└── db-reset.sh          # NEW
```

### Makefile Targets

| Target | Command |
|--------|---------|
| docker-up | Start environment |
| docker-down | Stop environment |
| docker-build | Build images |
| docker-logs | View logs |
| docker-shell | Backend shell |
| docker-db-reset | Reset database |
| docker-clean | Clean everything |

### Next Steps
Proceed to [02_Tasks-86-89_Verification.md](02_Tasks-86-89_Verification.md) for verification and final documentation.

---

## Notes for AI Agents

1. **Permissions:** Set executable on all scripts
2. **Colors:** Use ANSI codes for output
3. **Safety:** Confirmation for destructive actions
4. **Makefile:** Use .PHONY for all targets
5. **Scripts location:** All in docker/scripts/
6. **Git:** Do NOT commit yet - complete Group H first
