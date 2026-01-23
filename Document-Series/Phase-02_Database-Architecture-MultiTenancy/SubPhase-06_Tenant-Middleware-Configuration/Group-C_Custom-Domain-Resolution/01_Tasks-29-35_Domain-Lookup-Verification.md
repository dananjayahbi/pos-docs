# Tasks 29-35: Domain Lookup & Verification

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** C - Custom Domain Resolution  
> **Document:** 01 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Subdomain-Resolution/00_GROUP_OVERVIEW.md](../Group-B_Subdomain-Resolution/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-36-42_SSL-Caching-Multiple.md](02_Tasks-36-42_SSL-Caching-Multiple.md)

---

## Document Overview

This document establishes custom domain lookup, verification, and DNS checks.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create Custom Domain Resolver | Medium |
| 30 | Lookup by Full Domain | Simple |
| 31 | Handle Domain Verification | Medium |
| 32 | Create DNS Verification Logic | Complex |
| 33 | Generate Verification Token | Simple |
| 34 | Create Verification Endpoint | Medium |
| 35 | Store Verification Status | Simple |

---

## Task 29: Create Custom Domain Resolver

### Overview
Create a resolver for custom domains.

### Dependencies
- Task 28: Document Subdomain Resolution

### Instructions

1. **Define custom domain resolver**
   - Resolve tenants by full domain

2. **Document scope**
   - Note custom domain use cases

### Expected Outcome
- Custom domain resolver documented

### Verification Checklist
- [ ] Resolver documented
- [ ] Scope noted

---

## Task 30: Lookup by Full Domain

### Overview
Lookup tenants by full domain.

### Dependencies
- Task 29: Create Custom Domain Resolver

### Instructions

1. **Lookup by domain**
   - Use full domain matching

2. **Document behavior**
   - Note not-found outcomes

### Expected Outcome
- Full domain lookup documented

### Verification Checklist
- [ ] Lookup documented
- [ ] Not-found handling noted

---

## Task 31: Handle Domain Verification

### Overview
Enforce verification for custom domains.

### Dependencies
- Task 30: Lookup by Full Domain

### Instructions

1. **Define verification requirement**
   - Block unverified domains

2. **Document behavior**
   - Note error responses for unverified

### Expected Outcome
- Verification enforcement documented

### Verification Checklist
- [ ] Verification documented
- [ ] Unverified behavior noted

---

## Task 32: Create DNS Verification Logic

### Overview
Implement DNS TXT verification logic.

### Dependencies
- Task 31: Handle Domain Verification

### Instructions

1. **Define DNS verification**
   - Use TXT record validation

2. **Document dependencies**
   - Note dnspython usage

### Expected Outcome
- DNS verification documented

### Verification Checklist
- [ ] DNS verification documented
- [ ] Dependency noted

---

## Task 33: Generate Verification Token

### Overview
Generate a verification token for DNS checks.

### Dependencies
- Task 32: Create DNS Verification Logic

### Instructions

1. **Generate verification token**
   - Use UUID4 pattern

2. **Document storage**
   - Note where token is stored

### Expected Outcome
- Verification token documented

### Verification Checklist
- [ ] Token documented
- [ ] Storage noted

---

## Task 34: Create Verification Endpoint

### Overview
Provide an endpoint to trigger verification.

### Dependencies
- Task 33: Generate Verification Token

### Instructions

1. **Define verification endpoint**
   - Trigger DNS check workflow

2. **Document access**
   - Note required auth and permissions

### Expected Outcome
- Verification endpoint documented

### Verification Checklist
- [ ] Endpoint documented
- [ ] Access noted

---

## Task 35: Store Verification Status

### Overview
Store verification state and timestamps.

### Dependencies
- Task 34: Create Verification Endpoint

### Instructions

1. **Define status storage**
   - Track pending, verified, failed

2. **Document timestamps**
   - Include verified time

### Expected Outcome
- Verification status documented

### Verification Checklist
- [ ] Status documented
- [ ] Timestamps noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create Custom Domain Resolver | Resolver documented |
| 30 | Lookup by Full Domain | Lookup documented |
| 31 | Handle Domain Verification | Verification documented |
| 32 | Create DNS Verification Logic | DNS verification documented |
| 33 | Generate Verification Token | Token documented |
| 34 | Create Verification Endpoint | Endpoint documented |
| 35 | Store Verification Status | Status documented |

### Next Steps
- Continue with [02_Tasks-36-42_SSL-Caching-Multiple.md](02_Tasks-36-42_SSL-Caching-Multiple.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 35 in sequence
2. **DNS:** Use TXT verification with dnspython
3. **No Code Snippets:** Avoid fenced code blocks in documentation
