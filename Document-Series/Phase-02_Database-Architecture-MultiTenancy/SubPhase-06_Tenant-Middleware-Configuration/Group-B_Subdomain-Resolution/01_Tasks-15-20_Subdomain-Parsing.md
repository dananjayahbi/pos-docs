# Tasks 15-20: Subdomain Parsing

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** B - Subdomain Resolution  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Middleware-Foundation/00_GROUP_OVERVIEW.md](../Group-A_Middleware-Foundation/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-25_Caching-Dev-Support.md](02_Tasks-21-25_Caching-Dev-Support.md)

---

## Document Overview

This document sets up subdomain parsing and core lookup behavior.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create Subdomain Resolver | Medium |
| 16 | Configure Base Domain Setting | Simple |
| 17 | Parse Request Host | Simple |
| 18 | Lookup Tenant by Subdomain | Medium |
| 19 | Handle WWW Prefix | Simple |
| 20 | Handle localhost for Dev | Simple |

---

## Task 15: Create Subdomain Resolver

### Overview
Create a resolver for subdomain-based tenant lookups.

### Dependencies
- Task 10: Create Middleware Utils

### Instructions

1. **Define subdomain resolver**
   - Extract subdomain from host

2. **Document scope**
   - Note base domain dependency

### Expected Outcome
- Subdomain resolver documented

### Verification Checklist
- [ ] Resolver documented
- [ ] Scope noted

---

## Task 16: Configure Base Domain Setting

### Overview
Add a setting for the tenant base domain.

### Dependencies
- Task 15: Create Subdomain Resolver

### Instructions

1. **Configure base domain setting**
   - Define tenant base domain value

2. **Document usage**
   - Note how resolver uses it

### Expected Outcome
- Base domain setting documented

### Verification Checklist
- [ ] Base domain documented
- [ ] Usage noted

---

## Task 17: Parse Request Host

### Overview
Parse request host to extract subdomain.

### Dependencies
- Task 16: Configure Base Domain Setting

### Instructions

1. **Parse request host**
   - Separate subdomain from base domain

2. **Document edge cases**
   - Note missing or invalid hosts

### Expected Outcome
- Host parsing documented

### Verification Checklist
- [ ] Host parsing documented
- [ ] Edge cases noted

---

## Task 18: Lookup Tenant by Subdomain

### Overview
Resolve tenant by subdomain value.

### Dependencies
- Task 17: Parse Request Host

### Instructions

1. **Lookup tenant by subdomain**
   - Use domain or tenant mapping

2. **Document behavior**
   - Note not-found outcomes

### Expected Outcome
- Subdomain lookup documented

### Verification Checklist
- [ ] Lookup documented
- [ ] Not-found handling noted

---

## Task 19: Handle WWW Prefix

### Overview
Handle requests with www prefix.

### Dependencies
- Task 17: Parse Request Host

### Instructions

1. **Handle www prefix**
   - Normalize or reject www prefix

2. **Document behavior**
   - Note expected routing

### Expected Outcome
- WWW handling documented

### Verification Checklist
- [ ] WWW handling documented
- [ ] Behavior noted

---

## Task 20: Handle localhost for Dev

### Overview
Support subdomain.localhost for development.

### Dependencies
- Task 17: Parse Request Host

### Instructions

1. **Handle localhost**
   - Support subdomain.localhost in dev

2. **Document usage**
   - Note developer expectations

### Expected Outcome
- Localhost handling documented

### Verification Checklist
- [ ] Localhost handling documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create Subdomain Resolver | Resolver documented |
| 16 | Configure Base Domain Setting | Base domain documented |
| 17 | Parse Request Host | Parsing documented |
| 18 | Lookup Tenant by Subdomain | Lookup documented |
| 19 | Handle WWW Prefix | WWW handling documented |
| 20 | Handle localhost for Dev | Localhost handling documented |

### Next Steps
- Continue with [02_Tasks-21-25_Caching-Dev-Support.md](02_Tasks-21-25_Caching-Dev-Support.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Localhost:** Support subdomain.localhost:port
3. **No Code Snippets:** Avoid fenced code blocks in documentation
