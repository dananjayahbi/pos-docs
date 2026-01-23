# Tasks 49-53: Scheduled Tasks

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** D - Celery Beat Scheduling  
> **Document:** 02 of 04  
> **Tasks Covered:** 49, 50, 51, 52, 53

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-48_Beat-Configuration.md](01_Tasks-47-48_Beat-Configuration.md)
- **→ Next Document:** [03_Tasks-54-58_Schedule-Definitions.md](03_Tasks-54-58_Schedule-Definitions.md)

---

## Document Overview

This document covers the implementation of specific scheduled tasks for daily reports, stock alerts, session cleanup, token cleanup, and database backups.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create Daily Report Task | Medium |
| 50 | Create Low Stock Alert Task | Medium |
| 51 | Create Cleanup Old Sessions Task | Simple |
| 52 | Create Token Cleanup Task | Simple |
| 53 | Create Database Backup Task | Medium |

---

## Task 49: Create Daily Report Task

### Overview
Implement a scheduled task that generates daily sales reports for all active tenants, running automatically each morning at a configured time.

### Dependencies
- Task 48: Create Scheduled Tasks Module
- Task 43: Add generate_report_task (from Group C)

### Instructions

1. **Define daily_sales_report_task function**
   - Create in scheduled_tasks.py
   - Use @shared_task decorator with BaseTask
   - Not tenant-aware (iterates all tenants)

2. **Implement tenant iteration logic**
   - Query all active tenants
   - For each tenant, trigger report generation
   - Pass tenant_id to report task
   - Handle errors per tenant

3. **Configure report parameters**
   - Report type: daily_sales
   - Date range: previous day
   - Format: PDF (default)
   - Recipients: tenant admins

4. **Add error handling**
   - Catch tenant processing errors
   - Continue to next tenant on error
   - Log all failures
   - Return summary of results

5. **Implement result aggregation**
   - Count successful reports
   - Count failed reports
   - Return summary dict
   - Log overall results

6. **Add execution logging**
   - Log task start with tenant count
   - Log each tenant processing
   - Log completion with summary
   - ERROR level for failures

### Task Implementation Pattern
```
1. Get all active tenants
2. For each tenant:
   a. Calculate date range (yesterday)
   b. Call generate_report_task
   c. Handle errors
   d. Log result
3. Aggregate results
4. Return summary
```

### Report Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| report_type | 'daily_sales' | Report category |
| date_range | Yesterday | Previous business day |
| format | 'pdf' | Output format |
| recipients | Tenant admins | Email delivery |

### Tenant Iteration Pattern
```python
tenants = Tenant.objects.filter(is_active=True)
results = {'success': 0, 'failed': 0, 'errors': []}

for tenant in tenants:
    try:
        generate_report_task.apply_async(
            kwargs={
                'tenant_id': tenant.id,
                'report_type': 'daily_sales',
                # ...
            }
        )
        results['success'] += 1
    except Exception as e:
        results['failed'] += 1
        results['errors'].append({
            'tenant_id': tenant.id,
            'error': str(e)
        })

return results
```

### Error Handling Strategy
| Error | Action |
|-------|--------|
| Tenant processing fails | Log, continue to next |
| All tenants fail | Log ERROR, return summary |
| Partial failures | Log WARNING with details |

### Logging Output Example
```
INFO: Starting daily sales report generation for 50 tenants
INFO: Processing tenant 1: Company ABC
INFO: Processing tenant 2: Company XYZ
INFO: Completed: 48 success, 2 failed
ERROR: Failed tenants: [5, 23] - Connection errors
```

### Expected Outcome
- daily_sales_report_task implemented
- Iterates all active tenants
- Triggers report generation per tenant
- Handles errors gracefully
- Returns execution summary
- Comprehensive logging

### Verification Checklist
- [ ] daily_sales_report_task function defined
- [ ] Uses @shared_task with BaseTask
- [ ] Iterates all active tenants
- [ ] Calls generate_report_task per tenant
- [ ] Error handling for each tenant
- [ ] Returns summary dict
- [ ] Logging at key points

---

## Task 50: Create Low Stock Alert Task

### Overview
Implement a scheduled task that checks inventory levels across all tenants and generates alerts for products below reorder thresholds.

### Dependencies
- Task 48: Create Scheduled Tasks Module
- Inventory models exist

### Instructions

1. **Define check_low_stock_task function**
   - Create in scheduled_tasks.py
   - Use @shared_task decorator
   - Base on BaseTask for system-wide check

2. **Implement stock checking logic**
   - Iterate all active tenants
   - Query inventory per tenant
   - Check against reorder level
   - Identify low stock products

3. **Generate alerts**
   - Create alert for each low stock item
   - Include product details
   - Include current and reorder levels
   - Store in notifications table

4. **Send notifications**
   - Email to inventory managers
   - In-app notifications
   - Include actionable information
   - Priority based on severity

5. **Add severity levels**
   - Critical: Stock = 0 (out of stock)
   - High: Stock < 25% of reorder level
   - Medium: Stock < reorder level
   - Low: Stock approaching reorder level

6. **Implement batching**
   - Process tenants in batches
   - Prevent overwhelming system
   - Configurable batch size
   - Pause between batches

### Stock Check Flow
```
1. Get all active tenants
2. For each tenant:
   a. Switch to tenant schema
   b. Query inventory items
   c. Filter where stock < reorder_level
   d. Generate alerts
   e. Send notifications
3. Return alert summary
```

### Alert Severity Levels
| Level | Condition | Priority | Action |
|-------|-----------|----------|--------|
| Critical | Stock = 0 | High | Immediate |
| High | Stock < 25% reorder | High | Urgent |
| Medium | Stock < reorder | Normal | Soon |
| Low | Stock < reorder + buffer | Low | Monitor |

### Notification Content
| Field | Purpose |
|-------|---------|
| Product Name | Identify item |
| SKU | Unique identifier |
| Current Stock | Current level |
| Reorder Level | Target level |
| Severity | Alert priority |
| Recommended Order | Suggested quantity |

### Batching Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| Batch Size | 10 tenants | Process chunk |
| Pause Duration | 5 seconds | Prevent overload |
| Max Alerts | 100 per tenant | Limit notifications |

### Expected Outcome
- check_low_stock_task implemented
- Checks inventory for all tenants
- Generates appropriate alerts
- Sends notifications
- Handles large tenant counts
- Returns alert summary

### Verification Checklist
- [ ] check_low_stock_task function defined
- [ ] Iterates all active tenants
- [ ] Queries inventory per tenant
- [ ] Generates alerts for low stock
- [ ] Sends notifications
- [ ] Handles batching
- [ ] Returns alert summary

---

## Task 51: Create Cleanup Old Sessions Task

### Overview
Implement a scheduled task that removes expired Django sessions from the database to maintain performance and comply with data retention policies.

### Dependencies
- Task 48: Create Scheduled Tasks Module

### Instructions

1. **Define cleanup_expired_sessions_task function**
   - Create in scheduled_tasks.py
   - Use @shared_task decorator with BaseTask
   - System-level task (not tenant-specific)

2. **Implement session cleanup logic**
   - Use Django's clearsessions management command logic
   - Delete sessions where expire_date < now
   - Work with session backend
   - Handle both database and cache sessions

3. **Add multi-tenancy handling**
   - If sessions in tenant schemas, iterate tenants
   - If sessions in public schema, clean once
   - For LCC: Likely public schema

4. **Implement batch deletion**
   - Delete in batches to avoid locking
   - Configurable batch size
   - Commit after each batch
   - Track deletion count

5. **Add logging**
   - Log cleanup start
   - Log number of sessions deleted
   - Log cleanup completion
   - Log any errors

6. **Return cleanup summary**
   - Total sessions deleted
   - Execution time
   - Any errors encountered

### Session Cleanup Logic
```
1. Get current datetime
2. Query expired sessions
3. Delete in batches
4. Track count
5. Return summary
```

### Batch Deletion Settings
| Setting | Value | Purpose |
|---------|-------|---------|
| Batch Size | 1000 | Prevent long locks |
| Delay | 0.1 seconds | Allow other queries |
| Max Iterations | 100 | Safety limit |

### Django Session Models
| Backend | Storage | Cleanup Approach |
|---------|---------|------------------|
| Database | django_session table | Delete expired rows |
| Cache | Redis/Memcached | Auto-expiration |
| File | Filesystem | Delete expired files |

For LCC: Database-backed sessions

### Expected Outcome
- cleanup_expired_sessions_task implemented
- Removes expired sessions
- Batch deletion for performance
- Returns deletion count
- Logs activity

### Verification Checklist
- [ ] cleanup_expired_sessions_task defined
- [ ] Deletes expired sessions
- [ ] Uses batch deletion
- [ ] Handles tenant schemas (if applicable)
- [ ] Returns deletion summary
- [ ] Comprehensive logging

---

## Task 52: Create Token Cleanup Task

### Overview
Implement a scheduled task that removes expired JWT tokens and other authentication tokens to maintain security and database performance.

### Dependencies
- Task 48: Create Scheduled Tasks Module
- Authentication system with tokens

### Instructions

1. **Define cleanup_expired_tokens_task function**
   - Create in scheduled_tasks.py
   - Use @shared_task decorator with BaseTask
   - System-level task

2. **Identify token types to clean**
   - JWT refresh tokens (if stored)
   - Password reset tokens
   - Email verification tokens
   - API tokens (if expirable)

3. **Implement cleanup logic per token type**
   - Query expired tokens
   - Delete in batches
   - Track count per type
   - Handle errors per type

4. **Add multi-tenancy handling**
   - Tokens likely in tenant schemas
   - Iterate all active tenants
   - Clean tokens per tenant
   - Aggregate results

5. **Implement batch deletion**
   - Delete in configurable batches
   - Prevent database locks
   - Pause between batches

6. **Add logging and results**
   - Log cleanup start
   - Log tokens deleted per type
   - Log completion
   - Return comprehensive summary

### Token Types to Clean
| Token Type | Location | Expiration |
|------------|----------|------------|
| JWT Refresh | Database/Redis | 7-30 days |
| Password Reset | Database | 24 hours |
| Email Verification | Database | 48 hours |
| API Tokens | Database | Variable |

### Cleanup Logic per Type
```
1. For each token type:
   a. Query expired tokens
   b. Delete in batches
   c. Track count
   d. Log result
2. Aggregate all counts
3. Return summary
```

### Multi-Tenant Token Cleanup
```python
results = {
    'refresh_tokens': 0,
    'reset_tokens': 0,
    'verification_tokens': 0
}

tenants = Tenant.objects.filter(is_active=True)
for tenant in tenants:
    # Set tenant context
    # Clean tokens for this tenant
    # Add to results
    pass

return results
```

### Expected Outcome
- cleanup_expired_tokens_task implemented
- Cleans all token types
- Handles multi-tenancy
- Batch deletion
- Returns detailed summary
- Comprehensive logging

### Verification Checklist
- [ ] cleanup_expired_tokens_task defined
- [ ] Cleans all token types
- [ ] Iterates tenants if needed
- [ ] Uses batch deletion
- [ ] Returns summary per token type
- [ ] Logging at key points

---

## Task 53: Create Database Backup Task

### Overview
Implement a scheduled task that triggers database backup operations, ensuring data safety and disaster recovery capabilities for the LCC platform.

### Dependencies
- Task 48: Create Scheduled Tasks Module
- Backup infrastructure exists

### Instructions

1. **Define database_backup_task function**
   - Create in scheduled_tasks.py
   - Use @shared_task decorator with BaseTask
   - System-level privileged task

2. **Implement backup strategy**
   - Determine backup type (full, incremental)
   - Choose backup tool (pg_dump for PostgreSQL)
   - Set backup location (local, S3, etc.)
   - Configure retention policy

3. **Handle multi-tenancy**
   - Option 1: Full database backup (all schemas)
   - Option 2: Per-tenant backups
   - For LCC: Full database recommended

4. **Implement backup execution**
   - Run backup command
   - Capture output
   - Verify backup success
   - Store backup metadata

5. **Add compression**
   - Compress backup files
   - Use gzip or similar
   - Save storage space
   - Maintain compression level

6. **Implement retention policy**
   - Keep daily backups for 7 days
   - Keep weekly backups for 30 days
   - Keep monthly backups for 1 year
   - Clean up old backups

7. **Add monitoring and alerts**
   - Log backup start and completion
   - Log backup file size
   - Alert on backup failure
   - Send success notification

### Backup Strategy
| Type | Frequency | Retention | Purpose |
|------|-----------|-----------|---------|
| Full | Daily | 7 days | Point-in-time recovery |
| Incremental | Hourly | 24 hours | Minimal data loss |
| Weekly | Weekly | 30 days | Weekly snapshots |
| Monthly | Monthly | 1 year | Long-term archive |

For LCC: Daily full backups recommended initially

### Backup Flow
```
1. Verify backup prerequisites
2. Generate backup filename
3. Execute backup command
4. Compress backup file
5. Store in backup location
6. Verify backup integrity
7. Clean up old backups
8. Send notification
9. Return backup metadata
```

### Backup Command (PostgreSQL)
```bash
pg_dump -h host -U user -F c -b -v -f backup_file.dump database_name
```

### Backup Storage Options
| Location | Pros | Cons |
|----------|------|------|
| Local Disk | Fast, simple | Not off-site |
| Network Share | Centralized | Network dependency |
| S3/Cloud | Off-site, durable | Cost, complexity |

For LCC: S3 recommended for production

### Backup Metadata
| Field | Purpose |
|-------|---------|
| Timestamp | When backup created |
| File Size | Backup size |
| Duration | Backup time |
| Status | Success/failure |
| Location | Storage path |
| Checksum | Integrity verification |

### Retention Policy Implementation
```python
# Keep last 7 daily backups
# Delete backups older than 7 days
cutoff_date = datetime.now() - timedelta(days=7)
old_backups = Backup.objects.filter(created_at__lt=cutoff_date)
for backup in old_backups:
    delete_backup_file(backup.file_path)
    backup.delete()
```

### Expected Outcome
- database_backup_task implemented
- Executes database backups
- Compresses backup files
- Stores securely
- Implements retention
- Sends notifications
- Returns backup metadata

### Verification Checklist
- [ ] database_backup_task defined
- [ ] Executes backup command
- [ ] Compresses backup files
- [ ] Stores in appropriate location
- [ ] Implements retention policy
- [ ] Logs all operations
- [ ] Alerts on failure
- [ ] Returns backup metadata

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Create Daily Report Task | daily_sales_report_task |
| 50 | Create Low Stock Alert Task | check_low_stock_task |
| 51 | Create Cleanup Old Sessions Task | cleanup_expired_sessions_task |
| 52 | Create Token Cleanup Task | cleanup_expired_tokens_task |
| 53 | Create Database Backup Task | database_backup_task |

### Scheduled Tasks Created
| Task | Purpose | Frequency |
|------|---------|-----------|
| daily_sales_report_task | Generate daily reports | Daily at 6 AM |
| check_low_stock_task | Inventory alerts | Every 4 hours |
| cleanup_expired_sessions_task | Session cleanup | Daily at midnight |
| cleanup_expired_tokens_task | Token cleanup | Daily at 2 AM |
| database_backup_task | Database backups | Daily at 3 AM |

### Task Characteristics
- All tasks use BaseTask (system-level)
- Multi-tenant aware where needed
- Comprehensive error handling
- Detailed logging
- Return structured results

### Next Steps
Proceed to [03_Tasks-54-58_Schedule-Definitions.md](03_Tasks-54-58_Schedule-Definitions.md) to define crontab schedules for these tasks.

---

## Notes for AI Agents

1. **Tenant Iteration:** Tasks iterate tenants where needed
2. **Error Isolation:** Error in one tenant doesn't stop others
3. **Batch Processing:** Use batching for large operations
4. **Logging:** Comprehensive logging for monitoring
5. **Return Values:** Return summary dicts for reporting
6. **Backups:** Consider backup strategy carefully
7. **Retention:** Implement retention policies
8. **Notifications:** Alert on critical failures
9. **Performance:** Optimize for large tenant counts
10. **Testing:** Test with multiple tenants
