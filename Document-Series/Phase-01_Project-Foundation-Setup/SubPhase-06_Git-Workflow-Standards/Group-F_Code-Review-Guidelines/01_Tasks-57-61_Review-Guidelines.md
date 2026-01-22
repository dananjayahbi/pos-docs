# Tasks 57-61: Code Review Guidelines

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 06 - Git Workflow & Standards  
> **Group:** F - Code Review Guidelines  
> **Document:** 01 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-E_Issue-Templates/02_Tasks-51-56_Feature-Task.md](../Group-E_Issue-Templates/02_Tasks-51-56_Feature-Task.md)
- **→ Next Document:** [02_Tasks-62-66_Review-Process.md](02_Tasks-62-66_Review-Process.md)

---

## Document Overview

This document covers code review documentation and review criteria.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create CODE_REVIEW.md | Medium |
| 58 | Define Review Scope | Simple |
| 59 | Define Code Quality Criteria | Medium |
| 60 | Define Security Review Points | Medium |
| 61 | Define Performance Review | Medium |

---

## Task 57: Create CODE_REVIEW.md

### Overview
Create code review guidelines documentation.

### Dependencies
- Task 08: Initial commit complete

### Instructions

1. **Create docs directory**
   - If not exists

2. **Create CODE_REVIEW.md**
   - Main review guidelines file

3. **Add basic structure**
   - Table of contents

### File Location

```
pos-arch/
└── docs/
    └── CODE_REVIEW.md          # Create this file
```

### CODE_REVIEW.md Structure

Create file: `docs/CODE_REVIEW.md`

```markdown
# Code Review Guidelines

> LankaCommerce Cloud - Code Review Standards

## Table of Contents

1. [Purpose](#purpose)
2. [Review Scope](#review-scope)
3. [Code Quality Criteria](#code-quality-criteria)
4. [Security Review](#security-review)
5. [Performance Review](#performance-review)
6. [Review Timeline](#review-timeline)
7. [Approval Requirements](#approval-requirements)
8. [Reviewer Checklist](#reviewer-checklist)
9. [Comment Guidelines](#comment-guidelines)
10. [CODEOWNERS](#codeowners)

---

## Purpose

Code reviews are a critical part of our development process. They help us:

- **Maintain Quality:** Catch bugs before they reach production
- **Share Knowledge:** Spread understanding of the codebase
- **Improve Skills:** Learn from each other's approaches
- **Ensure Security:** Identify security issues early
- **Build Consistency:** Maintain coding standards across the team

Every pull request requires a code review before merging.

---
```

### Expected Outcome
- CODE_REVIEW.md file created
- Basic structure in place

### Verification Checklist
- [ ] File created in docs/
- [ ] Table of contents included
- [ ] Purpose section defined
- [ ] Structure ready for sections

---

## Task 58: Define Review Scope

### Overview
Define what should be reviewed in a code review.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define what to review**
   - All changed files

2. **Define review goals**
   - What reviewers look for

3. **Define exclusions**
   - What's out of scope

### Review Scope Content

```markdown
## Review Scope

### What to Review

Every code review should examine:

| Area | Focus Points |
|------|--------------|
| **Functionality** | Does the code do what it's supposed to do? |
| **Logic** | Is the implementation correct? |
| **Design** | Is the architecture appropriate? |
| **Readability** | Is the code easy to understand? |
| **Tests** | Are tests adequate and passing? |
| **Documentation** | Are comments and docs updated? |
| **Dependencies** | Are new dependencies justified? |

### Review Depth by PR Size

| PR Size | Lines Changed | Review Approach |
|---------|---------------|-----------------|
| Small | < 50 lines | Quick review, focus on correctness |
| Medium | 50-200 lines | Thorough review, all criteria |
| Large | 200-500 lines | Split into sessions, take breaks |
| XL | 500+ lines | Request PR split if possible |

### What's Out of Scope

- **Automated formatting:** Handled by linters/formatters
- **Style preferences:** Unless violating standards
- **Rewriting entire files:** Unless critical issues
- **Unrelated code:** Only review changed lines + context

### Review Mindset

**Reviewers should:**
- Assume good intent from the author
- Focus on the code, not the person
- Ask questions before assuming mistakes
- Suggest improvements, not demand changes
- Approve when "good enough" for production

```

### Expected Outcome
- Review scope defined
- Clear focus areas

### Verification Checklist
- [ ] What to review listed
- [ ] Review depth guidance
- [ ] Out of scope items
- [ ] Review mindset

---

## Task 59: Define Code Quality Criteria

### Overview
Define code quality standards for reviews.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define quality criteria**
   - Readability, maintainability

2. **Add naming standards**
   - Consistent naming

3. **Add code structure**
   - DRY, SOLID principles

### Code Quality Criteria Content

```markdown
## Code Quality Criteria

### Readability

Code should be easy to read and understand:

| Criterion | Good Example | Bad Example |
|-----------|--------------|-------------|
| Clear names | `calculate_total_price()` | `calc()` |
| Short functions | 20-30 lines max | 200+ lines |
| Single purpose | One thing per function | Multiple responsibilities |
| Self-documenting | Code explains itself | Requires comments for basics |

**Questions to Ask:**
- [ ] Can I understand this code in 5 minutes?
- [ ] Would a new team member understand it?
- [ ] Are variable/function names descriptive?

### Naming Conventions

| Type | Python Style | TypeScript Style |
|------|--------------|------------------|
| Variables | `snake_case` | `camelCase` |
| Functions | `snake_case` | `camelCase` |
| Classes | `PascalCase` | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` |
| Files | `snake_case.py` | `camelCase.ts` or `kebab-case.ts` |

### Code Structure

**DRY (Don't Repeat Yourself):**
- [ ] No duplicated code blocks
- [ ] Shared logic is extracted
- [ ] Helper functions used appropriately

**SOLID Principles:**
- [ ] Single Responsibility: One reason to change
- [ ] Open/Closed: Open for extension, closed for modification
- [ ] Liskov Substitution: Subtypes substitutable
- [ ] Interface Segregation: Specific interfaces
- [ ] Dependency Inversion: Depend on abstractions

### Error Handling

**Requirements:**
- [ ] All errors are caught and handled
- [ ] Errors are logged appropriately
- [ ] User-facing errors are friendly
- [ ] No silent failures
- [ ] Specific exceptions used (not bare `except:`)

**Python Example:**
```python
# Good
try:
    result = process_order(order_id)
except OrderNotFoundError as e:
    logger.error(f"Order not found: {order_id}")
    raise

# Bad
try:
    result = process_order(order_id)
except:
    pass
```

### Code Smells to Watch

| Smell | Description |
|-------|-------------|
| Magic numbers | Hardcoded values without explanation |
| Long methods | Functions > 50 lines |
| Deep nesting | More than 3 levels of indentation |
| God classes | Classes doing too much |
| Dead code | Commented-out or unused code |
| Copy-paste | Duplicated code blocks |

```

### Expected Outcome
- Quality criteria defined
- Naming conventions clear
- Code smells identified

### Verification Checklist
- [ ] Readability criteria
- [ ] Naming conventions
- [ ] DRY/SOLID principles
- [ ] Error handling standards
- [ ] Code smells list

---

## Task 60: Define Security Review Points

### Overview
Define security criteria for code reviews.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define security checklist**
   - Common vulnerabilities

2. **Add secret handling**
   - No hardcoded secrets

3. **Add input validation**
   - Prevent injection attacks

### Security Review Content

```markdown
## Security Review

### Security Checklist

Every code review must check for security issues:

| Category | Check Points |
|----------|--------------|
| **Secrets** | No hardcoded passwords, API keys, tokens |
| **Input** | All user input is validated and sanitized |
| **SQL** | Parameterized queries used, no string concatenation |
| **XSS** | Output is properly escaped |
| **Auth** | Authentication and authorization checked |
| **Logging** | No sensitive data in logs |

### No Hardcoded Secrets

**Never commit:**
- Passwords or API keys
- Database connection strings with credentials
- JWT secrets or encryption keys
- Third-party service tokens

**Check for:**
```python
# Bad - Hardcoded secret
SECRET_KEY = "my-secret-key-123"
API_KEY = "sk_live_xxxxx"

# Good - Environment variable
SECRET_KEY = os.environ.get("SECRET_KEY")
API_KEY = settings.API_KEY
```

### Input Validation

**All user input must be validated:**

| Input Type | Validation |
|------------|------------|
| Email | Regex pattern, max length |
| Phone | +94 format for Sri Lanka |
| Currency | LKR format, decimal places |
| IDs | UUID format or integer |
| Text | Max length, allowed characters |
| Files | Type, size, extension checks |

### SQL Injection Prevention

**Always use parameterized queries:**

```python
# Bad - SQL injection risk
query = f"SELECT * FROM users WHERE id = {user_id}"

# Good - Parameterized query
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))

# Best - ORM (Django)
User.objects.filter(id=user_id)
```

### XSS Prevention

**Escape all output in templates:**

```html
<!-- Bad - XSS risk -->
{{ user_input|safe }}

<!-- Good - Auto-escaped -->
{{ user_input }}
```

### Authentication & Authorization

**Check for:**
- [ ] Endpoints require authentication
- [ ] User can only access their own data
- [ ] Admin routes require admin role
- [ ] Multi-tenant isolation enforced

### Sensitive Data Logging

**Never log:**
- Passwords (even hashed)
- Credit card numbers
- Personal identification numbers
- Session tokens
- API keys

```python
# Bad
logger.info(f"User login: {username}, password: {password}")

# Good
logger.info(f"User login attempt: {username}")
```

### Multi-Tenant Security

**LankaCommerce-Specific:**
- [ ] Tenant isolation maintained
- [ ] Cross-tenant data access prevented
- [ ] Tenant context checked in queries
- [ ] Schema switching is secure

```

### Expected Outcome
- Security checklist defined
- Common vulnerabilities covered
- Multi-tenant security addressed

### Verification Checklist
- [ ] Secret handling rules
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Auth checks
- [ ] Logging security
- [ ] Multi-tenant considerations

---

## Task 61: Define Performance Review

### Overview
Define performance criteria for code reviews.

### Dependencies
- Task 57: CODE_REVIEW.md exists

### Instructions

1. **Define performance checks**
   - Efficient algorithms

2. **Add database optimization**
   - Query optimization

3. **Add caching guidance**
   - When to cache

### Performance Review Content

```markdown
## Performance Review

### Performance Checklist

| Area | Check Points |
|------|--------------|
| **Algorithms** | Appropriate time/space complexity |
| **Database** | Efficient queries, proper indexing |
| **N+1** | No N+1 query problems |
| **Caching** | Cache used where appropriate |
| **Memory** | No memory leaks, large objects handled |
| **Async** | Async used for I/O operations |

### Algorithm Efficiency

**Check time complexity:**

| Complexity | Acceptable For |
|------------|----------------|
| O(1) | Ideal for all operations |
| O(log n) | Search, lookups |
| O(n) | Single iteration |
| O(n log n) | Sorting |
| O(n²) | Avoid for large datasets |

**Warning signs:**
- Nested loops over large datasets
- Recursive functions without memoization
- Sorting in a loop
- Multiple iterations when one suffices

### Database Query Optimization

**Avoid N+1 Queries:**
```python
# Bad - N+1 problem
for order in Order.objects.all():
    print(order.customer.name)  # Extra query per order

# Good - Prefetch related
for order in Order.objects.select_related('customer').all():
    print(order.customer.name)  # Single query
```

**Use Efficient Queries:**
- [ ] Only select needed fields
- [ ] Use `exists()` instead of `count() > 0`
- [ ] Use `values()` for aggregations
- [ ] Avoid `all()` without pagination
- [ ] Use indexes on filtered/sorted fields

### Caching Strategies

**When to Cache:**
| Data Type | Cache Strategy |
|-----------|----------------|
| Static data | Long TTL (hours/days) |
| User data | Short TTL (minutes) |
| Computed results | Medium TTL |
| Session data | Redis session store |
| Frequent queries | Query cache |

**Cache Invalidation:**
- [ ] Cache invalidated on data change
- [ ] TTL set appropriately
- [ ] Cache keys are unique and descriptive

### Memory Considerations

**Watch for:**
- [ ] Large file uploads processed in chunks
- [ ] Large querysets iterated, not loaded fully
- [ ] Images resized before storage
- [ ] Temporary objects cleaned up

```python
# Bad - Loads all into memory
data = list(LargeModel.objects.all())

# Good - Iterator for large datasets
for item in LargeModel.objects.iterator():
    process(item)
```

### Async Operations

**Use async for:**
- External API calls
- File I/O
- Database queries (where supported)
- Email sending
- Task queue operations

```python
# Consider Celery for long-running tasks
@celery_app.task
def send_order_notification(order_id):
    # This runs asynchronously
    pass
```

```

### Expected Outcome
- Performance criteria defined
- Database optimization covered
- Caching guidance provided

### Verification Checklist
- [ ] Algorithm efficiency
- [ ] N+1 query prevention
- [ ] Query optimization
- [ ] Caching strategies
- [ ] Memory considerations
- [ ] Async operations

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 57 | Create CODE_REVIEW.md | docs/CODE_REVIEW.md |
| 58 | Define Review Scope | Scope, depth, mindset |
| 59 | Define Code Quality Criteria | Readability, naming, DRY |
| 60 | Define Security Review Points | Secrets, SQL, XSS, auth |
| 61 | Define Performance Review | Algorithms, N+1, caching |

### Next Steps
Proceed to [02_Tasks-62-66_Review-Process.md](02_Tasks-62-66_Review-Process.md) for review process and CODEOWNERS.

---

## Notes for AI Agents

1. **Location:** CODE_REVIEW.md in docs/ folder
2. **Multi-tenant:** Include tenant isolation checks
3. **Sri Lanka:** LKR currency, +94 phone format
4. **Security first:** Prioritize security checks
5. **N+1:** Django select_related/prefetch_related
6. **Caching:** Redis for LankaCommerce
7. **Celery:** Use for async tasks
