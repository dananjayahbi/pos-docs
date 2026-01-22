# Tasks 45-49: Public URLs & Analytics

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** D - Frontend Environment Variables Definition  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Frontend-Environment-Setup/](../Group-C_Frontend-Environment-Setup/)
- **→ Next Document:** [02_Tasks-50-56_Services-Auth-Docs.md](02_Tasks-50-56_Services-Auth-Docs.md)

---

## Document Overview

This document defines public-facing frontend environment variables for URLs, app identity, and analytics.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Define public API URL | Simple |
| 46 | Define public WS URL | Simple |
| 47 | Define site/app name | Simple |
| 48 | Define base site URL | Simple |
| 49 | Define analytics ID | Simple |

---

## Task 45: Define public API URL

### Overview
Add a public environment variable for the frontend API base URL.

### Dependencies
- Group C completed

### Instructions

1. **Add variable to `.env.local.example`**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document usage**
   - Note which frontend modules consume the API URL

### Expected Outcome
- Public API URL variable is defined and documented

### Verification Checklist
- [ ] API URL variable listed in `.env.local.example`
- [ ] Usage documented in environment docs

---

## Task 46: Define public WS URL

### Overview
Add a public environment variable for WebSocket connections.

### Dependencies
- Task 45: Define public API URL

### Instructions

1. **Add variable to `.env.local.example`**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document usage**
   - Note WebSocket features that use it

### Expected Outcome
- Public WebSocket URL variable is defined and documented

### Verification Checklist
- [ ] WS URL variable listed in `.env.local.example`
- [ ] Usage documented in environment docs

---

## Task 47: Define site/app name

### Overview
Add public variables for site name and application branding.

### Dependencies
- Task 46: Define public WS URL

### Instructions

1. **Add branding variables**
   - Include `NEXT_PUBLIC_SITE_NAME` and `NEXT_PUBLIC_APP_NAME`

2. **Document brand usage**
   - Note where branding appears in UI

### Expected Outcome
- Public branding variables are defined and documented

### Verification Checklist
- [ ] Branding variables listed in `.env.local.example`
- [ ] UI usage is documented

---

## Task 48: Define base site URL

### Overview
Add a public base URL variable for routing and canonical links.

### Dependencies
- Task 47: Define site/app name

### Instructions

1. **Add base URL variable**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document use cases**
   - Identify SEO and sharing features that use it

### Expected Outcome
- Base site URL variable is defined and documented

### Verification Checklist
- [ ] Base URL variable listed in `.env.local.example`
- [ ] Use cases are documented

---

## Task 49: Define analytics ID

### Overview
Add a public environment variable for analytics configuration.

### Dependencies
- Task 48: Define base site URL

### Instructions

1. **Add analytics variable**
   - Use a `NEXT_PUBLIC_` prefix

2. **Document tracking scope**
   - Clarify environments where analytics is enabled

### Expected Outcome
- Analytics ID variable is defined and documented

### Verification Checklist
- [ ] Analytics variable listed in `.env.local.example`
- [ ] Tracking scope documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Define public API URL | Public API URL documented |
| 46 | Define public WS URL | Public WS URL documented |
| 47 | Define site/app name | Branding variables documented |
| 48 | Define base site URL | Base URL documented |
| 49 | Define analytics ID | Analytics ID documented |

### Next Steps
- Continue with [02_Tasks-50-56_Services-Auth-Docs.md](02_Tasks-50-56_Services-Auth-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 45 through 49 in sequence
2. **Client Exposure:** Use `NEXT_PUBLIC_` for all client-visible variables
3. **Documentation:** Keep usage notes aligned with UI and SEO needs
