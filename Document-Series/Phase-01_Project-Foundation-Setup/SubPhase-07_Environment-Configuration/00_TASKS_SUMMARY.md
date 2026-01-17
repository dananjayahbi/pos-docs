# SubPhase 07: Environment Configuration - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 07 of 08  
> **SubPhase Goal:** Set up secure environment variable management  
> **Total Tasks:** 84 | **Status:** Planning  
> **Estimated Duration:** 4-5 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Git-Workflow-Standards](../SubPhase-06_Git-Workflow-Standards/)
- **→ Next SubPhase:** [SubPhase-08_Documentation-Structure](../SubPhase-08_Documentation-Structure/)

---

## SubPhase Overview

This sub-phase establishes environment variable management for all environments (development, staging, production). The setup includes django-environ for the backend, Next.js environment configuration for the frontend, and comprehensive documentation of all variables.

### Key Outcomes
- Backend environment configuration with django-environ
- Frontend environment configuration with Next.js
- Environment example files for all services
- Secrets management strategy documented
- Environment validation scripts
- Docker environment integration

### Environment Types
- **Development (local):** Local development settings
- **Staging:** Pre-production testing environment
- **Production:** Live production environment
- **Testing:** Automated test environment

### Dependencies
- **Requires:** SubPhase-02 (Backend) and SubPhase-03 (Frontend) completed
- **Requires:** SubPhase-04 (Docker) for Docker integration

---

## Task Execution Order

```
TASK GROUP A: Backend Environment Setup - django-environ (Tasks 01-14)
        │
        ▼
TASK GROUP B: Backend Environment Variables Definition (Tasks 15-30)
        │
        ▼
TASK GROUP C: Frontend Environment Setup (Tasks 31-44)
        │
        ▼
TASK GROUP D: Frontend Environment Variables Definition (Tasks 45-56)
        │
        ▼
TASK GROUP E: Docker Environment Integration (Tasks 57-68)
        │
        ▼
TASK GROUP F: Secrets Management Strategy (Tasks 69-78)
        │
        ▼
TASK GROUP G: Validation & Documentation (Tasks 79-84)
```

---

## Task Index

### Group A: Backend Environment Setup - django-environ (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install django-environ** | Install django-environ package | SubPhase-02 | 🔴 Not Created |
| 02 | **Create env.py Module** | Create config/env.py utility | Task 01 | 🔴 Not Created |
| 03 | **Initialize Env Object** | Create environ.Env instance | Task 02 | 🔴 Not Created |
| 04 | **Configure Env File Path** | Set .env file location | Task 03 | 🔴 Not Created |
| 05 | **Read Env File** | environ.Env.read_env() | Task 04 | 🔴 Not Created |
| 06 | **Create .env.example (Backend)** | Backend example env file | Task 01 | 🔴 Not Created |
| 07 | **Create .env.local (Backend)** | Local development env | Task 06 | 🔴 Not Created |
| 08 | **Update base.py Settings** | Use env() in settings | Task 03 | 🔴 Not Created |
| 09 | **Update local.py Settings** | Development overrides | Task 08 | 🔴 Not Created |
| 10 | **Update production.py Settings** | Production settings | Task 08 | 🔴 Not Created |
| 11 | **Configure DEBUG from Env** | DEBUG = env.bool() | Task 08 | 🔴 Not Created |
| 12 | **Configure SECRET_KEY from Env** | SECRET_KEY = env() | Task 08 | 🔴 Not Created |
| 13 | **Configure ALLOWED_HOSTS from Env** | ALLOWED_HOSTS = env.list() | Task 08 | 🔴 Not Created |
| 14 | **Add Env Casting Helpers** | Custom env type casters | Task 02 | 🔴 Not Created |

---

### Group B: Backend Environment Variables Definition (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Define DATABASE_URL** | PostgreSQL connection string | Task 06 | 🔴 Not Created |
| 16 | **Define REDIS_URL** | Redis connection string | Task 06 | 🔴 Not Created |
| 17 | **Define CELERY_BROKER_URL** | Celery broker setting | Task 06 | 🔴 Not Created |
| 18 | **Define CELERY_RESULT_BACKEND** | Celery result backend | Task 06 | 🔴 Not Created |
| 19 | **Define EMAIL Settings** | SMTP configuration | Task 06 | 🔴 Not Created |
| 20 | **Define AWS/S3 Settings** | AWS credentials and bucket | Task 06 | 🔴 Not Created |
| 21 | **Define CORS Settings** | CORS_ALLOWED_ORIGINS | Task 06 | 🔴 Not Created |
| 22 | **Define JWT Settings** | JWT secret and expiry | Task 06 | 🔴 Not Created |
| 23 | **Define SENTRY_DSN** | Error tracking | Task 06 | 🔴 Not Created |
| 24 | **Define STRIPE_API_KEY** | Payment gateway | Task 06 | 🔴 Not Created |
| 25 | **Define SMS_API Settings** | SMS provider credentials | Task 06 | 🔴 Not Created |
| 26 | **Define OPENAI_API_KEY** | AI integration | Task 06 | 🔴 Not Created |
| 27 | **Define SITE_URL** | Frontend site URL | Task 06 | 🔴 Not Created |
| 28 | **Define API_VERSION** | API version string | Task 06 | 🔴 Not Created |
| 29 | **Define LOG_LEVEL** | Logging configuration | Task 06 | 🔴 Not Created |
| 30 | **Define TIMEZONE** | Django timezone setting | Task 06 | 🔴 Not Created |

---

### Group C: Frontend Environment Setup (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create .env.local.example** | Frontend example env | SubPhase-03 | 🔴 Not Created |
| 32 | **Create .env.development** | Development env file | Task 31 | 🔴 Not Created |
| 33 | **Create .env.production** | Production env template | Task 31 | 🔴 Not Created |
| 34 | **Create types/env.d.ts** | TypeScript env declarations | Task 31 | 🔴 Not Created |
| 35 | **Define NEXT_PUBLIC Prefix** | Document public variables | Task 31 | 🔴 Not Created |
| 36 | **Create lib/env.ts** | Env validation utility | Task 34 | 🔴 Not Created |
| 37 | **Install zod** | Runtime validation library | Task 31 | 🔴 Not Created |
| 38 | **Create Env Schema** | Zod schema for validation | Task 37 | 🔴 Not Created |
| 39 | **Validate Env on Startup** | Check required vars | Task 38 | 🔴 Not Created |
| 40 | **Configure next.config.js Env** | Public runtime config | Task 31 | 🔴 Not Created |
| 41 | **Add Env to .gitignore** | Ignore env files | Task 31 | 🔴 Not Created |
| 42 | **Document Client vs Server Env** | Explain NEXT_PUBLIC | Task 35 | 🔴 Not Created |
| 43 | **Create Env Helper Functions** | Get env with defaults | Task 36 | 🔴 Not Created |
| 44 | **Test Env Loading** | Verify env works | Task 39 | 🔴 Not Created |

---

### Group D: Frontend Environment Variables Definition (Tasks 45-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Define NEXT_PUBLIC_API_URL** | Backend API URL | Task 31 | 🔴 Not Created |
| 46 | **Define NEXT_PUBLIC_WS_URL** | WebSocket URL | Task 31 | 🔴 Not Created |
| 47 | **Define NEXT_PUBLIC_SITE_URL** | Frontend site URL | Task 31 | 🔴 Not Created |
| 48 | **Define NEXT_PUBLIC_APP_NAME** | Application name | Task 31 | 🔴 Not Created |
| 49 | **Define NEXT_PUBLIC_ANALYTICS_ID** | Google Analytics | Task 31 | 🔴 Not Created |
| 50 | **Define NEXT_PUBLIC_SENTRY_DSN** | Sentry for frontend | Task 31 | 🔴 Not Created |
| 51 | **Define NEXT_PUBLIC_STRIPE_KEY** | Stripe public key | Task 31 | 🔴 Not Created |
| 52 | **Define NEXT_PUBLIC_MAPS_API_KEY** | Google Maps API | Task 31 | 🔴 Not Created |
| 53 | **Define SERVER_SIDE_API_KEY** | Server-only API key | Task 31 | 🔴 Not Created |
| 54 | **Define NEXTAUTH_SECRET** | NextAuth secret key | Task 31 | 🔴 Not Created |
| 55 | **Define NEXTAUTH_URL** | NextAuth URL | Task 31 | 🔴 Not Created |
| 56 | **Document All Frontend Vars** | Complete var list | Task 45-55 | 🔴 Not Created |

---

### Group E: Docker Environment Integration (Tasks 57-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create .env.docker** | Docker-specific env file | SubPhase-04 | 🔴 Not Created |
| 58 | **Update docker-compose.yml** | Reference env_file | Task 57 | 🔴 Not Created |
| 59 | **Configure Backend Service Env** | Pass env to Django | Task 58 | 🔴 Not Created |
| 60 | **Configure Frontend Service Env** | Pass env to Next.js | Task 58 | 🔴 Not Created |
| 61 | **Configure PostgreSQL Env** | Database credentials | Task 58 | 🔴 Not Created |
| 62 | **Configure Redis Env** | Redis settings | Task 58 | 🔴 Not Created |
| 63 | **Configure Celery Worker Env** | Worker environment | Task 58 | 🔴 Not Created |
| 64 | **Configure Celery Beat Env** | Scheduler environment | Task 58 | 🔴 Not Created |
| 65 | **Create .env.docker.example** | Docker env example | Task 57 | 🔴 Not Created |
| 66 | **Configure Variable Interpolation** | Use ${VAR} syntax | Task 58 | 🔴 Not Created |
| 67 | **Test Docker with Env** | Verify env loading | Task 66 | 🔴 Not Created |
| 68 | **Document Docker Env Setup** | Instructions for Docker | Task 67 | 🔴 Not Created |

---

### Group F: Secrets Management Strategy (Tasks 69-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create SECRETS.md** | Secrets documentation | Task 06 | 🔴 Not Created |
| 70 | **Document Secret Types** | Classify secret levels | Task 69 | 🔴 Not Created |
| 71 | **Define Development Secrets** | Local dev approach | Task 70 | 🔴 Not Created |
| 72 | **Define Staging Secrets** | Staging approach | Task 70 | 🔴 Not Created |
| 73 | **Define Production Secrets** | Production strategy | Task 70 | 🔴 Not Created |
| 74 | **Document AWS Secrets Manager** | Optional cloud solution | Task 73 | 🔴 Not Created |
| 75 | **Document HashiCorp Vault** | Optional self-hosted | Task 73 | 🔴 Not Created |
| 76 | **Create Secret Rotation Plan** | Key rotation strategy | Task 73 | 🔴 Not Created |
| 77 | **Document GitHub Secrets** | CI/CD secrets | Task 73 | 🔴 Not Created |
| 78 | **Create Security Checklist** | Secrets audit list | Task 69 | 🔴 Not Created |

---

### Group G: Validation & Documentation (Tasks 79-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Env Validation Script** | Python script for validation | Task 30 | 🔴 Not Created |
| 80 | **Create Frontend Env Check** | Node.js validation | Task 56 | 🔴 Not Created |
| 81 | **Add Makefile Commands** | make check-env | Task 79 | 🔴 Not Created |
| 82 | **Create ENV_VARIABLES.md** | Complete documentation | Task 30, 56 | 🔴 Not Created |
| 83 | **Verify All Environments** | Test dev/staging/prod | Task 82 | 🔴 Not Created |
| 84 | **Create Initial Commit** | Commit all env setup | Task 83 | 🔴 Not Created |

---

## Task Details

### Task 06: Create .env.example (Backend)

**Goal:** Create comprehensive backend example environment file.

**Content:**
```env
# .env.example - Backend Environment Configuration
# Copy this file to .env.local and fill in the values

# ==============================================
# DJANGO CORE
# ==============================================
DJANGO_ENV=local
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,.localhost

# ==============================================
# DATABASE (PostgreSQL)
# ==============================================
DATABASE_URL=postgres://postgres:postgres@localhost:5432/lankacommerce
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lankacommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# ==============================================
# REDIS / CACHE
# ==============================================
REDIS_URL=redis://localhost:6379/0
CACHE_URL=redis://localhost:6379/1

# ==============================================
# CELERY
# ==============================================
CELERY_BROKER_URL=redis://localhost:6379/2
CELERY_RESULT_BACKEND=redis://localhost:6379/3

# ==============================================
# EMAIL
# ==============================================
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL=noreply@lankacommerce.lk

# ==============================================
# AWS / S3 (Optional)
# ==============================================
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=ap-south-1

# ==============================================
# CORS
# ==============================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# ==============================================
# JWT / AUTHENTICATION
# ==============================================
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# ==============================================
# THIRD-PARTY SERVICES
# ==============================================
SENTRY_DSN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SMS_API_KEY=
SMS_SENDER_ID=

# ==============================================
# AI / ML
# ==============================================
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o

# ==============================================
# APPLICATION
# ==============================================
SITE_URL=http://localhost:3000
API_VERSION=v1
LOG_LEVEL=DEBUG
TIMEZONE=Asia/Colombo
```

---

### Task 34: Create types/env.d.ts

**Goal:** Create TypeScript declarations for environment variables.

**Content:**
```typescript
// types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    // Public variables (accessible in browser)
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_WS_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NEXT_PUBLIC_ANALYTICS_ID?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
    NEXT_PUBLIC_STRIPE_KEY?: string;
    NEXT_PUBLIC_MAPS_API_KEY?: string;

    // Server-only variables
    SERVER_SIDE_API_KEY?: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    
    // Node environment
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
```

---

### Task 36: Create lib/env.ts

**Goal:** Create environment validation utility.

**Content:**
```typescript
// lib/env.ts

import { z } from 'zod';

const envSchema = z.object({
  // Required public variables
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  
  // Optional public variables
  NEXT_PUBLIC_WS_URL: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_KEY: z.string().optional(),
  NEXT_PUBLIC_MAPS_API_KEY: z.string().optional(),
  
  // Server-side variables
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  
  return parsed.data;
}

export const env = validateEnv();

// Helper functions
export function getApiUrl(): string {
  return env.NEXT_PUBLIC_API_URL;
}

export function getSiteUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL;
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}
```

---

### Task 31: Create .env.local.example (Frontend)

**Goal:** Create frontend example environment file.

**Content:**
```env
# .env.local.example - Frontend Environment Configuration
# Copy this file to .env.local and fill in the values

# ==============================================
# PUBLIC VARIABLES (Accessible in browser)
# ==============================================
# Note: All NEXT_PUBLIC_ prefixed variables are exposed to the browser

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LankaCommerce Cloud

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Third-party Services (Optional)
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
NEXT_PUBLIC_MAPS_API_KEY=

# ==============================================
# SERVER-SIDE VARIABLES (Not exposed to browser)
# ==============================================

# NextAuth.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-characters
NEXTAUTH_URL=http://localhost:3000

# Server-side API Key (for SSR requests)
SERVER_SIDE_API_KEY=

# ==============================================
# OPTIONAL: Feature Flags
# ==============================================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

---

### Task 57: Create .env.docker

**Goal:** Create Docker-specific environment file.

**Content:**
```env
# .env.docker - Docker Environment Configuration
# This file is used by docker-compose

# ==============================================
# DJANGO
# ==============================================
DJANGO_ENV=local
DEBUG=True
SECRET_KEY=docker-dev-secret-key-not-for-production
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# ==============================================
# DATABASE (Docker service names)
# ==============================================
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=lankacommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_URL=postgres://postgres:postgres@postgres:5432/lankacommerce

# ==============================================
# REDIS (Docker service name)
# ==============================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379/0
CACHE_URL=redis://redis:6379/1

# ==============================================
# CELERY (Docker services)
# ==============================================
CELERY_BROKER_URL=redis://redis:6379/2
CELERY_RESULT_BACKEND=redis://redis:6379/3

# ==============================================
# FRONTEND
# ==============================================
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LankaCommerce Cloud (Docker)

# ==============================================
# EMAIL (Console for development)
# ==============================================
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# ==============================================
# CORS
# ==============================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
```

---

### Task 79: Create Env Validation Script

**Goal:** Create Python script to validate environment.

**Content:**
```python
#!/usr/bin/env python
# scripts/check_env.py
"""Validate environment variables for the backend."""

import os
import sys
from pathlib import Path

# Required variables for each environment
REQUIRED_VARS = {
    'all': [
        'DJANGO_ENV',
        'SECRET_KEY',
        'DATABASE_URL',
        'REDIS_URL',
    ],
    'local': [
        'DEBUG',
    ],
    'production': [
        'ALLOWED_HOSTS',
        'SENTRY_DSN',
        'EMAIL_HOST',
        'EMAIL_HOST_USER',
        'EMAIL_HOST_PASSWORD',
    ],
}

def check_env():
    """Check if all required environment variables are set."""
    env = os.getenv('DJANGO_ENV', 'local')
    
    # Combine required vars for current environment
    required = REQUIRED_VARS['all'] + REQUIRED_VARS.get(env, [])
    
    missing = []
    for var in required:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        sys.exit(1)
    else:
        print(f"✅ All required environment variables are set for '{env}'")
        sys.exit(0)

if __name__ == '__main__':
    check_env()
```

---

## Expected Final Structure

```
lankacommerce-cloud/
├── backend/
│   ├── config/
│   │   ├── env.py
│   │   └── settings/
│   │       ├── base.py (uses env())
│   │       ├── local.py
│   │       └── production.py
│   └── .env.example
├── frontend/
│   ├── lib/
│   │   └── env.ts
│   ├── types/
│   │   └── env.d.ts
│   ├── .env.local.example
│   └── .env.development
├── docker/
│   └── (uses .env.docker)
├── scripts/
│   └── check_env.py
├── docs/
│   ├── ENV_VARIABLES.md
│   └── SECRETS.md
├── .env.docker
├── .env.docker.example
└── Makefile (check-env command)
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 84 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 84 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Groups A-B (Backend) before C-D (Frontend)
2. **Never Commit Real Secrets:** Only commit .example files
3. **NEXT_PUBLIC_ Prefix:** Only use for browser-safe variables
4. **Docker Services:** Use Docker service names (postgres, redis) not localhost
5. **Validation:** Run check scripts before deploying
6. **Zod Library:** Install before frontend env validation
7. **Production:** Never use DEBUG=True in production
8. **Secrets:** Document but don't implement full secrets management now
