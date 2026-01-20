# Group E: Logging & Sentry

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** E of F  
> **Tasks Covered:** 61-74  
> **Group Goal:** Implement error logging with context and Sentry integration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Error-Response-Formatting](../Group-D_Error-Response-Formatting/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

This group creates the error logging infrastructure with context enrichment and integrates Sentry for production error tracking. All 5xx errors are logged with full context.

### Key Components
- **log_exception Function:** Log with context
- **Context Enrichment:** Request, user, tenant data
- **Stack Trace Capture:** Full traceback for debugging
- **Sentry SDK:** Production error tracking
- **Sentry Configuration:** DSN, sample rate, tags

### Logging Context Fields
| Field | Description |
|-------|-------------|
| request_id | Unique request identifier |
| user_id | Authenticated user ID |
| tenant_id | Current tenant ID |
| path | Request path |
| method | HTTP method |
| status_code | Response status |
| exception_type | Exception class name |
| exception_message | Exception message |
| stack_trace | Full traceback |

### Sentry Configuration
| Setting | Purpose |
|---------|---------|
| DSN | Project identifier |
| Sample Rate | Error sampling percentage |
| Environment | dev/staging/production |
| Release | Application version |
| Tags | Custom metadata (tenant, etc.) |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Error Logging Module | Tasks 61-66 | Logging utilities with context |
| DOC-02 | Sentry Installation | Tasks 67-70 | SDK install and basic config |
| DOC-03 | Sentry Context & Tags | Tasks 71-74 | User context and custom tags |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 61 | Create error_logging.py | Error logging utilities |
| 62 | Create log_exception Function | Log with context |
| 63 | Add Request Context | Include request data |
| 64 | Add User Context | Include user info |
| 65 | Add Tenant Context | Include tenant info |
| 66 | Add Stack Trace | Full stack trace capture |
| 67 | Install sentry-sdk | Add to requirements |
| 68 | Create Sentry Settings | settings/sentry.py |
| 69 | Configure Sentry DSN | Environment variable |
| 70 | Configure Sample Rate | Error sampling |
| 71 | Add Sentry User Context | User info in Sentry |
| 72 | Add Sentry Tags | Tenant, environment tags |
| 73 | Test Sentry Integration | Verify Sentry capture |
| 74 | Document Sentry Setup | Setup documentation |

---

## Execution Order

```
[Tasks 61-66: Error Logging Module]
        │
        ▼
[Tasks 67-70: Sentry Installation & Config]
        │
        ▼
[Tasks 71-74: Context, Tags & Tests]
```

---

## Expected Deliverables

### File Structure
```
backend/
├── apps/core/
│   └── exceptions/
│       └── logging.py
├── config/
│   └── settings/
│       └── sentry.py
└── requirements/
    └── production.txt (sentry-sdk)
```

### log_exception Function Requirements
- Accept exception, request (optional), level (optional)
- Extract context from request if provided
- Log with structured format
- Capture to Sentry if configured
- Support different log levels (ERROR, WARNING)

### Sentry Configuration Requirements
- DSN from environment variable (SENTRY_DSN)
- Environment tag (DJANGO_ENV)
- Sample rate configurable (default 1.0 for production)
- Release version from environment or git
- Disable in development by default

### Logging Best Practices
| Error Type | Action |
|------------|--------|
| 5xx Errors | Always log full context + Sentry |
| 4xx Errors | Log minimal context, sample to Sentry |
| Validation | Log at DEBUG level only |
| Auth Failure | Log at WARNING level (security) |

---

## Notes for AI Agents

1. **5xx Always Log:** All server errors get full logging
2. **4xx Sampling:** Sample client errors to reduce noise
3. **Sentry DSN:** Never commit DSN to code
4. **Environment Check:** Disable Sentry in development
5. **User Privacy:** Don't log sensitive data
6. **Stack Trace:** Include for debugging
7. **Structured Logging:** Use JSON format for parsing
