# Group D: Frontend Environment Variables Definition

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** D of G  
> **Tasks Covered:** 45-56  
> **Group Goal:** Define all frontend environment variables for Next.js application

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Frontend-Environment-Setup/](../Group-C_Frontend-Environment-Setup/)
- **→ Next Group:** [../Group-E_Docker-Environment-Integration/](../Group-E_Docker-Environment-Integration/)

---

## Group Overview

This group defines all frontend environment variables including API URLs, analytics IDs, payment keys, and authentication settings. Variables are categorized as public (NEXT_PUBLIC_) or server-side only, with complete documentation.

### Key Outcomes
- API and WebSocket URLs defined
- Site URL and app name configured
- Analytics (Google Analytics) ID defined
- Sentry DSN for frontend monitoring
- Stripe public key for payments
- Google Maps API key for location features
- NextAuth configuration variables
- Complete variable documentation

### Technology Context
- **API:** Backend REST API connection
- **Analytics:** Google Analytics 4
- **Monitoring:** Sentry for error tracking
- **Payments:** Stripe (public key)
- **Maps:** Google Maps Platform
- **Auth:** NextAuth.js

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-49_Public-URLs-Analytics.md | 45-49 | Define API_URL, WS_URL, SITE_URL, APP_NAME, ANALYTICS_ID |
| 02 | 02_Tasks-50-56_Services-Auth-Docs.md | 50-56 | Define SENTRY_DSN, STRIPE_KEY, MAPS_KEY, server-side vars, NextAuth, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Define NEXT_PUBLIC_API_URL | Task 31 | Simple |
| 46 | Define NEXT_PUBLIC_WS_URL | Task 31 | Simple |
| 47 | Define NEXT_PUBLIC_SITE_URL | Task 31 | Simple |
| 48 | Define NEXT_PUBLIC_APP_NAME | Task 31 | Simple |
| 49 | Define NEXT_PUBLIC_ANALYTICS_ID | Task 31 | Simple |
| 50 | Define NEXT_PUBLIC_SENTRY_DSN | Task 31 | Simple |
| 51 | Define NEXT_PUBLIC_STRIPE_KEY | Task 31 | Simple |
| 52 | Define NEXT_PUBLIC_MAPS_API_KEY | Task 31 | Simple |
| 53 | Define SERVER_SIDE_API_KEY | Task 31 | Simple |
| 54 | Define NEXTAUTH_SECRET | Task 31 | Simple |
| 55 | Define NEXTAUTH_URL | Task 31 | Simple |
| 56 | Document All Frontend Vars | Task 45-55 | Medium |

---

## Execution Order

```
01_Tasks-45-49_Public-URLs-Analytics.md
        │
        ▼
02_Tasks-50-56_Services-Auth-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
└── .env.local.example       # Updated with all variables
```

---

## Environment Variables Reference

| Variable | Type | Client | Description |
|----------|------|--------|-------------|
| NEXT_PUBLIC_API_URL | string | ✅ | Backend API URL |
| NEXT_PUBLIC_WS_URL | string | ✅ | WebSocket URL |
| NEXT_PUBLIC_SITE_URL | string | ✅ | Frontend site URL |
| NEXT_PUBLIC_APP_NAME | string | ✅ | Application name |
| NEXT_PUBLIC_ANALYTICS_ID | string | ✅ | Google Analytics ID |
| NEXT_PUBLIC_SENTRY_DSN | string | ✅ | Sentry DSN |
| NEXT_PUBLIC_STRIPE_KEY | string | ✅ | Stripe public key |
| NEXT_PUBLIC_MAPS_API_KEY | string | ✅ | Google Maps API key |
| SERVER_SIDE_API_KEY | string | ❌ | Server-only API key |
| NEXTAUTH_SECRET | string | ❌ | NextAuth secret |
| NEXTAUTH_URL | string | ❌ | NextAuth URL |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (env setup exists)
2. **Public Variables:** Must have NEXT_PUBLIC_ prefix
3. **Server Variables:** Never expose to client
4. **Stripe:** Use publishable key (pk_), not secret key
5. **NextAuth:** Both SECRET and URL required
6. **Git Commit:** Commit after completing this group

