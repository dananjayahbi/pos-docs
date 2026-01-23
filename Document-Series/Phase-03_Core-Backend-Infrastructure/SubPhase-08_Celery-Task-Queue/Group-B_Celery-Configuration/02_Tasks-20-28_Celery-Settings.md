# Tasks 20-28: Celery Settings

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** B - Celery Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 20, 21, 22, 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-19_Celery-App-Creation.md](01_Tasks-15-19_Celery-App-Creation.md)
- **→ Next Document:** [03_Tasks-29-30_Settings-Integration.md](03_Tasks-29-30_Settings-Integration.md)

---

## Document Overview

This document covers all Celery configuration settings that need to be added to Django settings, including broker URL, result backend, serialization, timezone, and task execution parameters.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Create Celery Settings File | Simple |
| 21 | Configure CELERY_BROKER_URL | Simple |
| 22 | Configure CELERY_RESULT_BACKEND | Medium |
| 23 | Configure CELERY_ACCEPT_CONTENT | Simple |
| 24 | Configure CELERY_TASK_SERIALIZER | Simple |
| 25 | Configure CELERY_RESULT_SERIALIZER | Simple |
| 26 | Configure CELERY_TIMEZONE | Simple |
| 27 | Configure CELERY_TASK_TRACK_STARTED | Simple |
| 28 | Configure CELERY_TASK_TIME_LIMIT | Simple |

---

## Task 20: Create Celery Settings File

### Overview
Create a dedicated Celery settings file within the Django settings module to organize all Celery-related configuration separately from main Django settings.

### Dependencies
- Task 17: Configure Django Settings

### Instructions

1. **Navigate to settings directory**
   - Find your Django settings directory
   - For LCC: `backend/config/settings/`
   - This directory contains base.py, development.py, production.py

2. **Create celery.py settings file**
   - Create a new file named `celery.py` in the settings directory
   - Note: This is different from config/celery.py
   - This file will contain only Celery configuration settings

3. **Add file docstring**
   - Add docstring explaining file purpose
   - Document that these are Celery-specific settings
   - Note the CELERY_ prefix requirement

4. **Import required modules**
   - Import os for environment variables
   - Import any other needed modules for configuration

### File Organization
```
backend/config/settings/
├── __init__.py
├── base.py              # Main Django settings
├── development.py       # Dev environment
├── production.py        # Production environment
└── celery.py           # Create this - Celery settings
```

### Purpose of Separate File
| Benefit | Explanation |
|---------|-------------|
| Organization | Keep Celery settings separate |
| Maintainability | Easy to find and modify |
| Clarity | Clear ownership of settings |
| Modularity | Can be imported selectively |

### Expected Outcome
- celery.py settings file created
- Located in config/settings/ directory
- Ready for Celery configuration settings
- Properly documented

### Verification Checklist
- [ ] celery.py file created in settings directory
- [ ] File has appropriate docstring
- [ ] File is ready for CELERY_* settings
- [ ] Path is correct: backend/config/settings/celery.py

---

## Task 21: Configure CELERY_BROKER_URL

### Overview
Configure the message broker URL that Celery uses to send and receive task messages, pointing to the Redis service in the Docker environment.

### Dependencies
- Task 20: Create Celery Settings File
- Group A: Redis verified and running

### Instructions

1. **Define CELERY_BROKER_URL setting**
   - Add CELERY_BROKER_URL to celery.py settings file
   - This setting tells Celery where the message broker is
   - Use environment variable for flexibility

2. **Use Redis URL format**
   - Format: redis://[password@]host:port/db
   - For LCC Docker: redis://redis:6379/0
   - Use database 0 for broker (by convention)

3. **Read from environment variable**
   - Create environment variable CELERY_BROKER_URL
   - Provide sensible default for development
   - For production, require explicit configuration

4. **Add to environment files**
   - Add to .env.example with documentation
   - Add to .env with actual value
   - Document in deployment documentation

### Broker URL Components
| Component | Value | Purpose |
|-----------|-------|---------|
| Protocol | redis:// | Redis protocol |
| Host | redis | Docker service name |
| Port | 6379 | Redis default port |
| Database | 0 | Broker database (0-15) |

### Environment Variable Setup
```
CELERY_BROKER_URL=redis://redis:6379/0
```

For production with password:
```
CELERY_BROKER_URL=redis://:password@redis:6379/0
```

### Broker Options
| Broker | Pros | Cons |
|--------|------|------|
| Redis | Fast, simple | Requires Redis |
| RabbitMQ | Feature-rich | More complex |
| SQS | Managed service | AWS-specific |

LCC uses Redis for simplicity and performance.

### Connection Pool Settings
Consider adding:
- BROKER_CONNECTION_RETRY
- BROKER_CONNECTION_MAX_RETRIES
- BROKER_CONNECTION_TIMEOUT

### Expected Outcome
- CELERY_BROKER_URL configured
- Points to Redis service
- Uses environment variable
- Ready for task messaging

### Verification Checklist
- [ ] CELERY_BROKER_URL is defined
- [ ] Uses Redis URL format
- [ ] Reads from environment variable
- [ ] Has sensible default for development
- [ ] Documented in .env.example

---

## Task 22: Configure CELERY_RESULT_BACKEND

### Overview
Configure the result backend that stores task return values and execution status, choosing between Django database or Redis storage based on persistence requirements.

### Dependencies
- Task 20: Create Celery Settings File
- Group A: django-celery-results installed

### Instructions

1. **Choose result backend**
   - Option 1: 'django-db' (database storage)
   - Option 2: 'redis://' (Redis storage)
   - Option 3: 'db+redis://' (hybrid approach)
   - For LCC: Recommend 'django-db' for persistence

2. **Define CELERY_RESULT_BACKEND setting**
   - Add to celery.py settings file
   - Use environment variable for flexibility
   - Provide appropriate default

3. **Understand backend trade-offs**
   - Database: Persistent, queryable, slower
   - Redis: Fast, ephemeral, memory-limited
   - Hybrid: Best of both, more complex

4. **Configure backend-specific settings**
   - For django-db: No additional config needed
   - For Redis: Use different DB than broker
   - Set result expiration time

### Backend Comparison
| Backend | Use Case | Pros | Cons |
|---------|----------|------|------|
| django-db | Audit logs, compliance | Persistent, ORM access | Slower, DB load |
| redis | High-throughput | Fast, low latency | Ephemeral, memory limit |
| db+redis | Production | Best of both | Complex setup |

### Database Backend Details
When using 'django-db':
- Results stored in tenant schema
- Each tenant sees only their results
- Can query with Django ORM
- Supports historical analysis
- Results persist across restarts

### Redis Backend Details
When using Redis:
- Use different database than broker (e.g., DB 1)
- Fast read/write operations
- Results expire after retention period
- Good for temporary results

### Hybrid Approach
For production, consider hybrid:
- Short-term: Redis for fast access
- Long-term: Database for persistence
- Automatic transfer from Redis to DB

### Result Expiration
Configure result retention:
- CELERY_RESULT_EXPIRES = 86400 (24 hours)
- Adjust based on requirements
- Consider storage costs vs. audit needs

### Expected Outcome
- CELERY_RESULT_BACKEND configured
- Backend choice documented
- Appropriate for LCC requirements
- Supports multi-tenancy

### Verification Checklist
- [ ] CELERY_RESULT_BACKEND is defined
- [ ] Backend choice is appropriate
- [ ] Uses environment variable
- [ ] Expiration time configured (if applicable)
- [ ] Works with multi-tenancy

---

## Task 23: Configure CELERY_ACCEPT_CONTENT

### Overview
Configure which content types Celery accepts for message serialization, restricting to JSON only for security and preventing pickle-based attacks.

### Dependencies
- Task 20: Create Celery Settings File

### Instructions

1. **Define CELERY_ACCEPT_CONTENT setting**
   - Add to celery.py settings file
   - Set to a list containing only 'json'
   - This restricts accepted serialization formats

2. **Understand security implications**
   - Pickle format can execute arbitrary code
   - JSON is safe and human-readable
   - YAML can have security issues
   - Only accept JSON for security

3. **Document the restriction**
   - Add comment explaining JSON-only policy
   - Document security rationale
   - Note this is a best practice

### Content Type Options
| Format | Security | Speed | Limitations |
|--------|----------|-------|-------------|
| json | Safe | Fast | No binary, limited types |
| pickle | Unsafe | Fastest | Can execute code |
| yaml | Risky | Slow | Complex types |
| msgpack | Safe | Very fast | Binary format |

### Why JSON Only?
| Reason | Explanation |
|--------|-------------|
| Security | Cannot execute arbitrary code |
| Compatibility | Universal format |
| Debugging | Human-readable |
| Best Practice | Industry standard |

### JSON Limitations
JSON cannot serialize:
- Complex Python objects
- Binary data
- Datetime objects (convert to string)
- Custom classes (use dict representation)

Solution: Serialize complex data before passing to task

### Expected Setting
```python
CELERY_ACCEPT_CONTENT = ['json']
```

### Expected Outcome
- Only JSON content accepted
- Security risk mitigated
- Standard practice implemented
- Documented reasoning

### Verification Checklist
- [ ] CELERY_ACCEPT_CONTENT is defined
- [ ] Set to ['json'] only
- [ ] Security rationale documented
- [ ] No pickle or yaml allowed

---

## Task 24: Configure CELERY_TASK_SERIALIZER

### Overview
Configure the serialization format for task messages sent to the broker, ensuring consistency and security by using JSON format.

### Dependencies
- Task 23: Configure CELERY_ACCEPT_CONTENT

### Instructions

1. **Define CELERY_TASK_SERIALIZER setting**
   - Add to celery.py settings file
   - Set to 'json' (string, not list)
   - This determines how task arguments are serialized

2. **Ensure consistency with accept_content**
   - Task serializer should match accepted content
   - Both should use 'json'
   - Prevents serialization/deserialization mismatches

3. **Understand task serialization**
   - Task arguments are serialized before sending to broker
   - Worker deserializes arguments before executing task
   - Format must be secure and compatible

### Serialization Flow
1. Task called with arguments
2. Arguments serialized using TASK_SERIALIZER
3. Serialized message sent to broker
4. Worker receives message
5. Worker checks against ACCEPT_CONTENT
6. Worker deserializes using detected format
7. Task executes with deserialized arguments

### Expected Setting
```python
CELERY_TASK_SERIALIZER = 'json'
```

### Serialization Best Practices
| Practice | Rationale |
|----------|-----------|
| Use JSON | Security and compatibility |
| Match accept_content | Consistency |
| Document format | Developer clarity |
| Simple arguments | Avoid complex types |

### Expected Outcome
- Task serializer set to JSON
- Consistent with accept_content
- Secure serialization
- Compatible across workers

### Verification Checklist
- [ ] CELERY_TASK_SERIALIZER is defined
- [ ] Set to 'json'
- [ ] Matches CELERY_ACCEPT_CONTENT
- [ ] Documented in settings

---

## Task 25: Configure CELERY_RESULT_SERIALIZER

### Overview
Configure the serialization format for task results stored in the result backend, maintaining consistency with task serialization and security standards.

### Dependencies
- Task 24: Configure CELERY_TASK_SERIALIZER

### Instructions

1. **Define CELERY_RESULT_SERIALIZER setting**
   - Add to celery.py settings file
   - Set to 'json' (string, not list)
   - This determines how task results are serialized

2. **Maintain serialization consistency**
   - All three serializers should use 'json'
   - ACCEPT_CONTENT, TASK_SERIALIZER, RESULT_SERIALIZER
   - Ensures end-to-end consistency

3. **Understand result serialization**
   - Task return value is serialized
   - Stored in result backend
   - Retrieved and deserialized when queried
   - Must handle various return types

### Complete Serialization Configuration
```python
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
```

### Result Types and JSON
| Python Type | JSON Equivalent | Notes |
|-------------|-----------------|-------|
| dict | object | Direct mapping |
| list | array | Direct mapping |
| str | string | Direct mapping |
| int, float | number | Direct mapping |
| None | null | Direct mapping |
| bool | boolean | Direct mapping |
| datetime | string | Convert to ISO format |
| Decimal | string | Convert to string |

### Expected Setting
```python
CELERY_RESULT_SERIALIZER = 'json'
```

### Expected Outcome
- Result serializer set to JSON
- Consistent with task serializer
- End-to-end JSON serialization
- Secure result storage

### Verification Checklist
- [ ] CELERY_RESULT_SERIALIZER is defined
- [ ] Set to 'json'
- [ ] Matches other serialization settings
- [ ] Complete serialization chain uses JSON

---

## Task 26: Configure CELERY_TIMEZONE

### Overview
Configure the timezone for Celery scheduling and time-based operations, setting it to Asia/Colombo for Sri Lankan business operations.

### Dependencies
- Task 20: Create Celery Settings File

### Instructions

1. **Define CELERY_TIMEZONE setting**
   - Add to celery.py settings file
   - Set to 'Asia/Colombo' for Sri Lanka
   - This affects all time-based scheduling

2. **Understand timezone usage**
   - Used for cron schedules
   - Used for ETA (estimated time of arrival)
   - Used for countdown calculations
   - Used for time-based routing

3. **Match Django timezone**
   - Should match Django's TIME_ZONE setting
   - Ensures consistency across application
   - Prevents timezone confusion

4. **Document timezone choice**
   - Explain why Asia/Colombo
   - Note Sri Lankan business context
   - Document daylight saving (Sri Lanka has none)

### Timezone for LCC
| Setting | Value | Rationale |
|---------|-------|-----------|
| CELERY_TIMEZONE | Asia/Colombo | LCC operates in Sri Lanka |
| UTC Offset | +05:30 | 5 hours 30 minutes ahead of UTC |
| DST | None | Sri Lanka doesn't observe DST |

### Timezone Impact
| Feature | Impact |
|---------|--------|
| Cron Schedules | Run at local time |
| Task ETA | Calculated in local time |
| Countdown | Based on local time |
| Beat Schedule | Uses local time |
| Task Logs | Timestamps in local time |

### Timezone Best Practices
| Practice | Rationale |
|----------|-----------|
| Use pytz timezone | Standard library |
| Match Django | Consistency |
| Document choice | Clarity |
| Consider users | Business location |

### Expected Setting
```python
CELERY_TIMEZONE = 'Asia/Colombo'
```

### Expected Outcome
- Timezone set to Asia/Colombo
- Consistent with Django settings
- Appropriate for Sri Lankan operations
- Documented rationale

### Verification Checklist
- [ ] CELERY_TIMEZONE is defined
- [ ] Set to 'Asia/Colombo'
- [ ] Matches Django TIME_ZONE
- [ ] Documented reasoning
- [ ] Timezone string is valid

---

## Task 27: Configure CELERY_TASK_TRACK_STARTED

### Overview
Enable task state tracking to record when tasks transition from PENDING to STARTED state, providing better visibility into task execution.

### Dependencies
- Task 20: Create Celery Settings File

### Instructions

1. **Define CELERY_TASK_TRACK_STARTED setting**
   - Add to celery.py settings file
   - Set to True (boolean)
   - This enables STARTED state tracking

2. **Understand task states**
   - Default states: PENDING → SUCCESS/FAILURE
   - With tracking: PENDING → STARTED → SUCCESS/FAILURE
   - Provides execution visibility

3. **Benefits of tracking**
   - See tasks that are currently executing
   - Distinguish between queued and running
   - Better monitoring and debugging
   - Required for progress tracking

4. **Performance consideration**
   - Slight overhead for state updates
   - Negligible for most use cases
   - Benefits outweigh costs

### Task State Lifecycle
| Without Tracking | With Tracking |
|------------------|---------------|
| PENDING | PENDING |
| (executing) | STARTED |
| SUCCESS/FAILURE | SUCCESS/FAILURE |

### Use Cases for STARTED State
| Use Case | Benefit |
|----------|---------|
| Monitoring | See currently running tasks |
| Debugging | Identify stuck tasks |
| Progress UI | Show "Processing..." status |
| Task Audit | Know execution start time |
| Resource Planning | See active worker load |

### Expected Setting
```python
CELERY_TASK_TRACK_STARTED = True
```

### State Storage
- State stored in result backend
- Adds STARTED state to task metadata
- Includes timestamp of state change
- Queryable through result backend

### Expected Outcome
- Task started tracking enabled
- STARTED state available
- Better task monitoring
- Minimal performance impact

### Verification Checklist
- [ ] CELERY_TASK_TRACK_STARTED is defined
- [ ] Set to True
- [ ] Understand state tracking benefits
- [ ] Consider for monitoring setup

---

## Task 28: Configure CELERY_TASK_TIME_LIMIT

### Overview
Configure the maximum execution time for tasks to prevent runaway tasks from consuming resources indefinitely, with appropriate timeouts for LCC operations.

### Dependencies
- Task 20: Create Celery Settings File

### Instructions

1. **Define CELERY_TASK_TIME_LIMIT setting**
   - Add to celery.py settings file
   - Set to reasonable default (e.g., 1800 seconds = 30 minutes)
   - This is a hard limit for task execution

2. **Understand time limit types**
   - Time limit: Hard limit, task is killed (SIGKILL)
   - Soft time limit: Warning, task can cleanup (SIGTERM)
   - Set both for graceful handling

3. **Choose appropriate limits**
   - Consider longest legitimate task
   - Balance between flexibility and protection
   - Can override per task if needed

4. **Configure soft time limit**
   - CELERY_TASK_SOFT_TIME_LIMIT
   - Should be less than hard limit
   - Allows graceful shutdown

### Time Limit Recommendations
| Task Type | Time Limit | Rationale |
|-----------|------------|-----------|
| Email | 60 seconds | Should be quick |
| Report | 300 seconds (5 min) | PDF generation |
| Bulk Operation | 1800 seconds (30 min) | Large datasets |
| Default | 1800 seconds | Safe default |

### Time Limit Settings
```python
CELERY_TASK_TIME_LIMIT = 1800  # 30 minutes hard limit
CELERY_TASK_SOFT_TIME_LIMIT = 1500  # 25 minutes soft limit
```

### Task-Specific Overrides
Tasks can override defaults:
- Use time_limit parameter in task decorator
- Use soft_time_limit parameter
- Set limits based on task requirements

### Handling Time Limits
| Limit Type | Signal | Behavior |
|------------|--------|----------|
| Soft Limit | SoftTimeLimitExceeded | Task can catch and cleanup |
| Hard Limit | SIGKILL | Task is terminated |

### Best Practices
| Practice | Rationale |
|----------|-----------|
| Set reasonable defaults | Prevent runaway tasks |
| Soft < Hard | Allow cleanup time |
| Override per task | Task-specific needs |
| Monitor timeouts | Identify issues |

### Expected Outcome
- Time limits configured
- Prevents infinite execution
- Appropriate for LCC tasks
- Can override per task

### Verification Checklist
- [ ] CELERY_TASK_TIME_LIMIT is defined
- [ ] Set to reasonable value (1800 seconds)
- [ ] CELERY_TASK_SOFT_TIME_LIMIT considered
- [ ] Limits documented
- [ ] Task-specific overrides possible

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Setting |
|--------|-----------|-------------|
| 20 | Create Celery Settings File | celery.py created |
| 21 | Configure CELERY_BROKER_URL | redis://redis:6379/0 |
| 22 | Configure CELERY_RESULT_BACKEND | django-db |
| 23 | Configure CELERY_ACCEPT_CONTENT | ['json'] |
| 24 | Configure CELERY_TASK_SERIALIZER | 'json' |
| 25 | Configure CELERY_RESULT_SERIALIZER | 'json' |
| 26 | Configure CELERY_TIMEZONE | 'Asia/Colombo' |
| 27 | Configure CELERY_TASK_TRACK_STARTED | True |
| 28 | Configure CELERY_TASK_TIME_LIMIT | 1800 seconds |

### Complete Settings Configuration
All core Celery settings configured:
- ✓ Broker connection
- ✓ Result backend
- ✓ Serialization (JSON only)
- ✓ Timezone (Asia/Colombo)
- ✓ Task tracking
- ✓ Time limits

### Settings File Structure
```python
# config/settings/celery.py

CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://redis:6379/0')
CELERY_RESULT_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Colombo'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 1800
CELERY_TASK_SOFT_TIME_LIMIT = 1500
```

### Next Steps
Proceed to [03_Tasks-29-30_Settings-Integration.md](03_Tasks-29-30_Settings-Integration.md) to integrate these settings into Django configuration and test the setup.

---

## Notes for AI Agents

1. **All CELERY_ Prefix:** Every setting must start with CELERY_
2. **JSON Only:** Never allow pickle for security
3. **Asia/Colombo:** Required for Sri Lankan business operations
4. **Environment Variables:** Use for broker URL flexibility
5. **Time Limits:** 30 minutes is reasonable default, adjust per task
6. **Track Started:** Always enable for visibility
7. **Result Backend:** django-db for persistence and multi-tenancy
