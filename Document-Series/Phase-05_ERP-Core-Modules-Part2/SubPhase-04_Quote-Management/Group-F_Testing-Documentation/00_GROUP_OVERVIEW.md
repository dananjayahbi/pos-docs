# Group F: Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** F of F  
> **Tasks Covered:** 83-88  
> **Group Goal:** Comprehensive testing and documentation for quote module

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Quote API & Email Integration](../Group-E_Quote-API-Email-Integration/)

---

## Group Overview

### Key Outcomes

1. **Quote Model Unit Tests** - Test Quote and QuoteLineItem models
2. **Quote Service Tests** - Test QuoteService methods and transitions
3. **Quote API Tests** - Test endpoints, permissions, filtering
4. **PDF Generation Tests** - Test PDF rendering and storage
5. **Email Integration Tests** - Test email sending and async tasks
6. **Quote Module Documentation** - API docs, usage guide, configuration

### Technology Context

| Technology | Purpose |
|------------|---------|
| pytest | Python testing framework |
| pytest-django | Django test utilities |
| FactoryBoy | Test data factories |
| Mock | Mocking external services |
| MkDocs | Documentation generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-83-88_Tests-Documentation.md` | 83-88 | Model tests, service tests, API tests, PDF tests, email tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Quote Model Unit Tests | High | 35 min |
| 84 | Create Quote Service Tests | High | 35 min |
| 85 | Create Quote API Tests | High | 35 min |
| 86 | Create PDF Generation Tests | Medium | 30 min |
| 87 | Create Email Integration Tests | Medium | 30 min |
| 88 | Create Quote Module Documentation | Medium | 40 min |

---

## Execution Order

```
[Task 83: Quote model tests]
         │
         ▼
[Task 84: Quote service tests]
         │
         ▼
[Task 85: Quote API tests]
         │
         ▼
[Tasks 86-87: PDF and email tests]
         │
         ▼
[Task 88: Module documentation]
```

---

## Expected Deliverables

```
apps/quotes/
├── tests/
│   ├── __init__.py
│   ├── test_models.py            # Task 83
│   ├── test_services.py          # Task 84
│   ├── test_api.py               # Task 85
│   ├── test_pdf.py               # Task 86
│   ├── test_email.py             # Task 87
│   └── factories.py              # Test factories
└── docs/
    └── README.md

docs/
└── modules/
    └── quotes/
        ├── index.md              # Task 88
        ├── models.md
        ├── api.md
        ├── pdf.md
        └── email.md
```

---

## Notes for AI Agents

### Test Categories

#### Quote Model Tests (Task 83)
- Test Quote creation with valid data
- Test quote_number auto-generation
- Test status field choices
- Test valid_until > issue_date constraint
- Test customer vs guest fields
- Test financial field calculations
- Test QuoteLineItem creation
- Test line item ordering
- Test model string representations

#### Quote Service Tests (Task 84)
- Test create_quote with items
- Test duplicate_quote creates new draft
- Test send_quote changes status
- Test accept_quote changes status
- Test reject_quote with reason
- Test invalid status transitions raise errors
- Test expire_quote for expired quotes
- Test convert_to_order creates order
- Test inventory validation on conversion
- Test quote locking after send
- Test history logging

#### Quote API Tests (Task 85)
- Test list quotes (authenticated)
- Test create quote (POST)
- Test retrieve quote (GET)
- Test update quote (PUT/PATCH)
- Test delete draft quote
- Test cannot delete sent quote
- Test filtering by status
- Test search by quote_number
- Test send action endpoint
- Test accept/reject actions
- Test convert action
- Test permissions (owner only)
- Test public view with valid token
- Test public view with expired token

#### PDF Generation Tests (Task 86)
- Test PDF generator creates valid PDF
- Test PDF contains quote data
- Test PDF contains logo
- Test PDF contains line items
- Test PDF contains totals
- Test PDF storage to FileField
- Test PDF regeneration on change

#### Email Integration Tests (Task 87)
- Test email service sends email
- Test email contains quote summary
- Test email has PDF attachment
- Test Celery task queued correctly
- Test email retry on failure
- Test email tracking fields updated

### Test Fixtures
```python
@pytest.fixture
def quote_with_items():
    quote = QuoteFactory(status='DRAFT')
    QuoteLineItemFactory.create_batch(3, quote=quote)
    return quote

@pytest.fixture
def sent_quote():
    return QuoteFactory(status='SENT')
```

### Documentation Sections (Task 88)
- **Overview**: Module purpose and features
- **Models**: Quote, QuoteLineItem, QuoteHistory, QuoteSettings
- **Status Lifecycle**: State machine diagram
- **API Reference**: All endpoints with examples
- **PDF Generation**: Template configuration
- **Email Integration**: Setup and customization
- **Configuration**: QuoteSettings options
- **Sri Lanka**: LKR currency, VAT handling
