# Tasks 71-75: Monitoring & Makefile

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 01 - PostgreSQL Configuration  
> **Group:** F - Backup & Monitoring  
> **Document:** 02 of 03  
> **Tasks Covered:** 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-70_Backup-Scripts-WAL.md](01_Tasks-65-70_Backup-Scripts-WAL.md)
- **→ Next Document:** [03_Tasks-76-78_Documentation-Verification.md](03_Tasks-76-78_Documentation-Verification.md)

---

## Document Overview

This document adds monitoring documentation and Makefile targets for backup and restore.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Create monitoring queries doc | Medium |
| 72 | Add schema size monitoring | Medium |
| 73 | Add Makefile backup targets | Medium |
| 74 | Document monitoring workflow | Medium |
| 75 | Validate monitoring setup | Medium |

---

## Task 71: Create monitoring queries doc

### Overview
Create a monitoring queries document for database health.

### Dependencies
- Task 70: Validate backup and restore

### Instructions

1. **Create `docs/database/monitoring-queries.md`**
   - Document key monitoring queries and their purpose

2. **Link monitoring doc**
   - Add links from database docs index

### Expected Outcome
- Monitoring queries documentation created

### Verification Checklist
- [ ] Monitoring queries doc exists
- [ ] Links added

---

## Task 72: Add schema size monitoring

### Overview
Document tenant schema size monitoring for billing and capacity.

### Dependencies
- Task 71: Create monitoring queries doc

### Instructions

1. **Add schema size guidance**
   - Explain how schema size is measured

2. **Document reporting cadence**
   - Note how often size is reviewed

### Expected Outcome
- Schema size monitoring documented

### Verification Checklist
- [ ] Schema size guidance documented
- [ ] Reporting cadence documented

---

## Task 73: Add Makefile backup targets

### Overview
Add Makefile targets to run backup and restore scripts.

### Dependencies
- Task 72: Add schema size monitoring

### Instructions

1. **Add Makefile targets**
   - Add targets for db-backup and db-restore

2. **Document usage**
   - Include command names as plain text steps

### Expected Outcome
- Makefile targets added and documented

### Verification Checklist
- [ ] Makefile targets added
- [ ] Usage documented

---

## Task 74: Document monitoring workflow

### Overview
Document the monitoring workflow for database health.

### Dependencies
- Task 73: Add Makefile backup targets

### Instructions

1. **Add monitoring workflow**
   - Describe review cadence and escalation process

2. **Link to monitoring queries**
   - Reference monitoring queries documentation

### Expected Outcome
- Monitoring workflow documented

### Verification Checklist
- [ ] Monitoring workflow documented
- [ ] Links to monitoring queries included

---

## Task 75: Validate monitoring setup

### Overview
Validate monitoring documentation and Makefile targets.

### Dependencies
- Task 74: Document monitoring workflow

### Instructions

1. **Verify documentation links**
   - Ensure monitoring docs are linked correctly

2. **Record validation results**
   - Capture date and outcome

### Expected Outcome
- Monitoring setup validated

### Verification Checklist
- [ ] Monitoring docs verified
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 71 | Create monitoring queries doc | Monitoring queries doc created |
| 72 | Add schema size monitoring | Schema size monitoring documented |
| 73 | Add Makefile backup targets | Makefile targets documented |
| 74 | Document monitoring workflow | Monitoring workflow documented |
| 75 | Validate monitoring setup | Validation recorded |

### Next Steps
- Continue with [03_Tasks-76-78_Documentation-Verification.md](03_Tasks-76-78_Documentation-Verification.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 71 through 75 in sequence
2. **Monitoring:** Include schema size monitoring for billing
3. **No Code Snippets:** Avoid fenced code blocks in documentation
