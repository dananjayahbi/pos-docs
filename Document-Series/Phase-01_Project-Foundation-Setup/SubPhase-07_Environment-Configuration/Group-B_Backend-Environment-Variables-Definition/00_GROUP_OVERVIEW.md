# Group B: Backend Environment Variables Definition

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** B of G  
> **Tasks Covered:** 15-30  
> **Group Goal:** Define all backend environment variables for the Django application

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Backend-Environment-Setup-django-environ/](../Group-A_Backend-Environment-Setup-django-environ/)
- **→ Next Group:** [../Group-C_Frontend-Environment-Setup/](../Group-C_Frontend-Environment-Setup/)

---

## Group Overview

This group defines all backend environment variables including database connections, cache settings, email configuration, third-party API keys, and application settings. Each variable is documented with its purpose, type, and default value.

### Key Outcomes
- DATABASE_URL for PostgreSQL connection
- REDIS_URL for cache and Celery broker
- CELERY_BROKER_URL and CELERY_RESULT_BACKEND
- Email SMTP configuration variables
- AWS/S3 storage configuration
- Third-party API keys (Stripe, Sentry, SMS, OpenAI)
- CORS, JWT, and application settings

### Technology Context
- **Database:** PostgreSQL via DATABASE_URL
- **Cache/Broker:** Redis via REDIS_URL
- **Email:** SMTP configuration
- **Storage:** AWS S3 or local
- **Payments:** Stripe API
- **Monitoring:** Sentry DSN

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-18_Database-Cache.md | 15-18 | Define DATABASE_URL, REDIS_URL, CELERY_BROKER_URL, CELERY_RESULT_BACKEND |
| 02 | 02_Tasks-19-24_External-Services.md | 19-24 | Define EMAIL, AWS/S3, CORS, JWT, SENTRY_DSN, STRIPE settings |
| 03 | 03_Tasks-25-30_API-App-Settings.md | 25-30 | Define SMS, OpenAI, SITE_URL, API_VERSION, LOG_LEVEL, TIMEZONE |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Define DATABASE_URL | Task 06 | Simple |
| 16 | Define REDIS_URL | Task 06 | Simple |
| 17 | Define CELERY_BROKER_URL | Task 06 | Simple |
| 18 | Define CELERY_RESULT_BACKEND | Task 06 | Simple |
| 19 | Define EMAIL Settings | Task 06 | Medium |
| 20 | Define AWS/S3 Settings | Task 06 | Medium |
| 21 | Define CORS Settings | Task 06 | Simple |
| 22 | Define JWT Settings | Task 06 | Simple |
| 23 | Define SENTRY_DSN | Task 06 | Simple |
| 24 | Define STRIPE_API_KEY | Task 06 | Simple |
| 25 | Define SMS_API Settings | Task 06 | Simple |
| 26 | Define OPENAI_API_KEY | Task 06 | Simple |
| 27 | Define SITE_URL | Task 06 | Simple |
| 28 | Define API_VERSION | Task 06 | Simple |
| 29 | Define LOG_LEVEL | Task 06 | Simple |
| 30 | Define TIMEZONE | Task 06 | Simple |

---

## Execution Order

```
01_Tasks-15-18_Database-Cache.md
        │
        ▼
02_Tasks-19-24_External-Services.md
        │
        ▼
03_Tasks-25-30_API-App-Settings.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── .env.example             # Updated with all variables
```

---

## Environment Variables Reference

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| DATABASE_URL | string | postgres://user:pass@localhost:5432/db | PostgreSQL connection |
| REDIS_URL | string | redis://localhost:6379/0 | Redis connection |
| CELERY_BROKER_URL | string | redis://localhost:6379/1 | Celery broker |
| EMAIL_HOST | string | smtp.gmail.com | SMTP server |
| AWS_ACCESS_KEY_ID | string | AKIA... | AWS credentials |
| STRIPE_API_KEY | string | sk_test_... | Stripe secret key |
| SENTRY_DSN | string | https://...@sentry.io/... | Sentry error tracking |
| OPENAI_API_KEY | string | sk-... | OpenAI API key |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (django-environ configured)
2. **Secure Variables:** Never commit actual values
3. **URL Format:** Use standard URL format for connections
4. **Optional Variables:** Provide defaults for optional settings
5. **Documentation:** Update .env.example with all variables
6. **Git Commit:** Commit after completing this group

