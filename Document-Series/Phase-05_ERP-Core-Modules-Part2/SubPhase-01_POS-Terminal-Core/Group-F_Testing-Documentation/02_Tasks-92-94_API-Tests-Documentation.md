# Tasks 92-94: API Tests & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-87-91_Unit-Integration-Tests.md](01_Tasks-87-91_Unit-Integration-Tests.md)
- **→ Next SubPhase:** [../../SubPhase-02_Offline-Mode-Sync/](../../SubPhase-02_Offline-Mode-Sync/)

---

## Document Overview

This document covers API endpoint testing and comprehensive documentation for the POS module, including ViewSet tests, module documentation, and end-user guides.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 92 | Create API endpoint tests | High | 35 min |
| 93 | Write POS module documentation | Medium | 45 min |
| 94 | Create POS user guide | Medium | 35 min |

---

## Task 92: Create API Endpoint Tests

### Overview
Create comprehensive tests for all POS API endpoints including ViewSets for terminals, sessions, carts, search, payments, and transactions. Test all CRUD operations, custom actions, authentication, and authorization.

### Dependencies
- Task 86: Implement POS API endpoints
- Tasks 87-91: Service and integration tests
- Django REST Framework test utilities

### Instructions

1. **Create API test file**
   - Create `apps/pos/tests/test_views.py` (or `test_api.py`)
   - Import Django REST Framework test utilities
   - Import pytest, APIClient, and factories
   - Mark module with `@pytest.mark.django_db`

2. **Add API test fixtures to conftest.py**
   - Create `api_client` fixture returning APIClient instance
   - Create `authenticated_client` fixture with logged-in user
   - Create `cashier_client` fixture with cashier user
   - Create `manager_client` fixture with manager user
   - Create `auth_headers` fixture for JWT/token authentication

3. **Create Terminal ViewSet tests**
   - Test `GET /api/pos/terminals/` - list all terminals
   - Test `GET /api/pos/terminals/{id}/` - retrieve single terminal
   - Test `POST /api/pos/terminals/` - create new terminal (admin only)
   - Test `PUT /api/pos/terminals/{id}/` - update terminal (admin only)
   - Test `PATCH /api/pos/terminals/{id}/` - partial update
   - Test `DELETE /api/pos/terminals/{id}/` - delete terminal (admin only)
   - Test list filtering by store, is_active
   - Test authentication requirement (401 if not authenticated)
   - Test authorization (403 if insufficient permissions)

4. **Create Session ViewSet tests**
   - Test `GET /api/pos/sessions/` - list sessions
   - Test `GET /api/pos/sessions/{id}/` - retrieve session details
   - Test `POST /api/pos/sessions/open/` - open new session (custom action)
   - Test open_session requires terminal_id, cashier, opening_balance
   - Test open_session validates terminal availability
   - Test `POST /api/pos/sessions/{id}/close/` - close session (custom action)
   - Test close_session requires closing_cash_amount
   - Test close_session calculates cash_variance
   - Test list filtering by status, cashier, date_range
   - Test session status validation

5. **Create Cart ViewSet tests**
   - Test `GET /api/pos/carts/` - list active carts
   - Test `GET /api/pos/carts/{id}/` - retrieve cart with items
   - Test `POST /api/pos/carts/` - create new cart
   - Test `POST /api/pos/carts/{id}/add_item/` - add item to cart
   - Test add_item requires product_id, quantity
   - Test add_item with optional variant_id
   - Test `POST /api/pos/carts/{id}/update_item/` - update item quantity
   - Test update_item requires cart_item_id, quantity
   - Test `POST /api/pos/carts/{id}/remove_item/` - remove item from cart
   - Test remove_item requires cart_item_id
   - Test `POST /api/pos/carts/{id}/apply_discount/` - apply cart discount
   - Test apply_discount requires discount_type, discount_value
   - Test `POST /api/pos/carts/{id}/hold/` - hold cart
   - Test `POST /api/pos/carts/{id}/recall/` - recall held cart
   - Test `DELETE /api/pos/carts/{id}/` - clear cart

6. **Create Search endpoint tests**
   - Test `GET /api/pos/search/?q={query}` - search products
   - Test search with barcode query parameter
   - Test search with SKU query parameter
   - Test search with name query parameter
   - Test search with combined query
   - Test search filters: include_out_of_stock, category, price_range
   - Test search pagination (limit, offset)
   - Test search result format (product details, variants, stock, price)
   - Test search with empty query (400 error)
   - Test search performance (response time)

7. **Create Payment endpoint tests**
   - Test `POST /api/pos/payments/process/` - process payment
   - Test process_payment requires cart_id, payment_method, amount
   - Test process_payment with cash method
   - Test process_payment with card method (mocked gateway)
   - Test process_payment with mobile method
   - Test process_payment with store_credit method
   - Test `POST /api/pos/payments/split/` - split payment
   - Test split_payment requires cart_id, payments array
   - Test split_payment validation (total matches cart total)
   - Test payment response includes transaction details

8. **Create Transaction ViewSet tests**
   - Test `GET /api/pos/transactions/` - list transactions
   - Test `GET /api/pos/transactions/{id}/` - retrieve transaction details
   - Test transaction details include cart items, payments, totals
   - Test `POST /api/pos/transactions/{id}/void/` - void transaction
   - Test void_transaction requires reason, manager_authorization
   - Test void_transaction updates status, restores stock
   - Test `GET /api/pos/transactions/{id}/receipt/` - get receipt data
   - Test list filtering by session, date_range, cashier, status
   - Test transaction search by transaction_number

9. **Create authentication tests**
   - Test all endpoints require authentication (401 without token)
   - Test JWT token authentication
   - Test session authentication
   - Test token expiration handling
   - Test refresh token flow

10. **Create authorization tests**
    - Test cashier role can access session, cart, payment endpoints
    - Test cashier cannot access terminal CRUD (admin only)
    - Test manager can void transactions
    - Test regular cashier cannot void transactions
    - Test tenant isolation (user can only access own tenant data)

11. **Create request/response validation tests**
    - Test invalid request data returns 400 with error details
    - Test missing required fields returns 400
    - Test invalid data types returns 400
    - Test response format matches API schema
    - Test error response format (status, message, errors)
    - Test successful response format (status, data)

12. **Create API performance tests**
    - Test response time for list endpoints (< 200ms)
    - Test response time for detail endpoints (< 100ms)
    - Test pagination performance with large datasets
    - Test search performance with large catalog
    - Test concurrent requests handling

13. **Create API edge case tests**
    - Test handling of non-existent resource IDs (404)
    - Test handling of invalid UUIDs (400)
    - Test concurrent cart updates (optimistic locking)
    - Test rate limiting (if implemented)
    - Test CORS headers (if applicable)

### API Testing Diagram

```
API Endpoint Testing Flow
┌─────────────────────────────────────────────────┐
│         Authentication Layer                    │
│  ┌──────────────────────────────────────────┐  │
│  │ JWT Token / Session Auth                 │  │
│  │ → 401 if not authenticated               │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Authorization Layer                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Role-based permissions                   │  │
│  │ Tenant isolation                         │  │
│  │ → 403 if insufficient permissions        │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Request Validation                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Required fields present                  │  │
│  │ Data types correct                       │  │
│  │ Business rules validated                 │  │
│  │ → 400 if validation fails                │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Business Logic                          │
│  ┌──────────────────────────────────────────┐  │
│  │ Service layer invocation                 │  │
│  │ Database operations                      │  │
│  │ Side effects (stock update, etc.)        │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Response Formation                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Serialize data                           │  │
│  │ Format response (status, data/errors)    │  │
│  │ Set HTTP status code                     │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Return Response                         │
│  200 OK | 201 Created | 400 Bad Request         │
│  401 Unauthorized | 403 Forbidden | 404 Not Found
└─────────────────────────────────────────────────┘
```

### API Test Scenarios

| Endpoint | Method | Scenario | Expected Status |
|----------|--------|----------|-----------------|
| `/api/pos/terminals/` | GET | List all terminals (authenticated) | 200 |
| `/api/pos/terminals/` | GET | List without auth | 401 |
| `/api/pos/sessions/open/` | POST | Open session (valid data) | 201 |
| `/api/pos/sessions/open/` | POST | Open session (terminal in use) | 400 |
| `/api/pos/carts/{id}/add_item/` | POST | Add valid item | 200 |
| `/api/pos/carts/{id}/add_item/` | POST | Add out-of-stock item | 400 |
| `/api/pos/search/` | GET | Search with valid query | 200 |
| `/api/pos/search/` | GET | Search with empty query | 400 |
| `/api/pos/payments/process/` | POST | Valid cash payment | 201 |
| `/api/pos/payments/process/` | POST | Insufficient payment amount | 400 |
| `/api/pos/transactions/{id}/` | GET | Retrieve transaction (own tenant) | 200 |
| `/api/pos/transactions/{id}/` | GET | Retrieve transaction (other tenant) | 404 |
| `/api/pos/transactions/{id}/void/` | POST | Void as manager | 200 |
| `/api/pos/transactions/{id}/void/` | POST | Void as cashier | 403 |

### Testing Best Practices
- Use APIClient for making HTTP requests
- Test all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Test custom actions (open_session, close_session, etc.)
- Verify response status codes
- Verify response data structure and content
- Test authentication and authorization separately
- Mock external services (payment gateways)
- Use fixtures for authenticated clients
- Test tenant isolation
- Test error responses and messages

### Test Coverage Goals
- Terminal ViewSet: 100% coverage
- Session ViewSet: 100% coverage
- Cart ViewSet: 100% coverage
- Search endpoint: 100% coverage
- Payment endpoint: 100% coverage
- Transaction ViewSet: 100% coverage
- Authentication/authorization: 100% coverage

### Expected Test File Structure

```
API Endpoint Tests
├── Setup & Fixtures
│   ├── API client fixtures
│   ├── Authenticated clients
│   └── Auth headers
├── Terminal ViewSet
│   ├── Test list terminals
│   ├── Test retrieve terminal
│   ├── Test create terminal
│   ├── Test update terminal
│   ├── Test delete terminal
│   └── Test authentication/authorization
├── Session ViewSet
│   ├── Test list sessions
│   ├── Test retrieve session
│   ├── Test open session (custom action)
│   ├── Test close session (custom action)
│   └── Test validation
├── Cart ViewSet
│   ├── Test list carts
│   ├── Test retrieve cart
│   ├── Test create cart
│   ├── Test add_item (custom action)
│   ├── Test update_item (custom action)
│   ├── Test remove_item (custom action)
│   ├── Test apply_discount (custom action)
│   ├── Test hold/recall (custom actions)
│   └── Test clear cart
├── Search Endpoint
│   ├── Test search by barcode
│   ├── Test search by SKU
│   ├── Test search by name
│   ├── Test search filters
│   ├── Test pagination
│   └── Test result format
├── Payment Endpoint
│   ├── Test process cash payment
│   ├── Test process card payment
│   ├── Test process mobile payment
│   ├── Test process store credit
│   ├── Test split payment
│   └── Test validation
├── Transaction ViewSet
│   ├── Test list transactions
│   ├── Test retrieve transaction
│   ├── Test void transaction
│   ├── Test receipt data
│   └── Test filtering
├── Authentication
│   ├── Test token authentication
│   ├── Test session authentication
│   ├── Test 401 responses
│   └── Test token expiration
├── Authorization
│   ├── Test role-based access
│   ├── Test tenant isolation
│   └── Test 403 responses
├── Validation
│   ├── Test request validation
│   ├── Test response format
│   └── Test error messages
└── Edge Cases
    ├── Test 404 responses
    ├── Test concurrent requests
    └── Test rate limiting
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_views.py -v` | Run all API tests |
| `pytest -k "test_terminal"` | Run terminal endpoint tests |
| `pytest -k "test_session"` | Run session endpoint tests |
| `pytest -k "test_cart"` | Run cart endpoint tests |
| `pytest apps/pos/tests/test_views.py --cov=apps/pos/views.py` | Coverage for API views |

### API Documentation Tools
- Use `drf-spectacular` for OpenAPI schema generation
- Use `Postman` for manual API testing
- Use `ReDoc` or `Swagger UI` for interactive API docs
- Generate API documentation from tests

### Verification Checklist
- [ ] Terminal ViewSet tests created (8-10 tests)
- [ ] Session ViewSet tests created (10-12 tests)
- [ ] Cart ViewSet tests created (12-15 tests)
- [ ] Search endpoint tests created (8-10 tests)
- [ ] Payment endpoint tests created (8-10 tests)
- [ ] Transaction ViewSet tests created (10-12 tests)
- [ ] Authentication tests created (5-6 tests)
- [ ] Authorization tests created (6-8 tests)
- [ ] Validation tests created (8-10 tests)
- [ ] Edge case tests created (5-6 tests)
- [ ] All API tests pass successfully
- [ ] API coverage > 95%

---

## Task 93: Write POS Module Documentation

### Overview
Create comprehensive technical documentation for the POS module covering architecture, models, services, API reference, configuration, and integration guidelines.

### Dependencies
- All POS module tasks completed (Tasks 73-92)
- MkDocs or similar documentation framework
- API schema generation

### Instructions

1. **Set up documentation structure**
   - Create `docs/modules/pos/` directory
   - Create `index.md` as main POS documentation page
   - Create separate markdown files for each major topic
   - Configure MkDocs navigation for POS module

2. **Create POS module overview (index.md)**
   - Write POS module introduction
   - Explain POS system purpose and scope
   - List key features: terminal management, cart operations, payment processing, transaction completion
   - Describe multi-tenant support
   - Include high-level architecture diagram
   - Link to all sub-pages

3. **Create architecture documentation (architecture.md)**
   - Document POS module architecture
   - Explain service-oriented design
   - Document models layer (POSTerminal, POSSession, POSCart, etc.)
   - Document services layer (TerminalService, CartService, PaymentService, etc.)
   - Document API layer (ViewSets, serializers)
   - Include component diagram showing layer interactions
   - Document design patterns used (factory, repository, etc.)

4. **Create terminal management documentation (terminal.md)**
   - Document POSTerminal model fields and relationships
   - Document POSSession model fields and relationships
   - Explain terminal setup and configuration
   - Document session lifecycle: open → active → closed
   - Document cash reconciliation process
   - Include session workflow diagram
   - Document terminal settings (currency, printer, receipt format)
   - Provide terminal configuration examples

5. **Create cart operations documentation (cart.md)**
   - Document POSCart model and POSCartItem model
   - Explain cart lifecycle: active → completed/held/void
   - Document add_to_cart operation
   - Document update_quantity operation
   - Document remove_from_cart operation
   - Document discount application (line and cart level)
   - Document calculate_totals logic
   - Include cart state diagram
   - Provide cart operation examples

6. **Create product search documentation (search.md)**
   - Document search service methods: barcode_search, sku_search, name_search, combined_search
   - Explain search algorithm and prioritization
   - Document search filters: active products, stock availability
   - Document variant resolution
   - Document search result format
   - Include search flow diagram
   - Provide search API examples

7. **Create payment processing documentation (payment.md)**
   - Document payment methods: cash, card, mobile, store_credit
   - Explain payment flow for each method
   - Document split payment logic
   - Document payment validation rules
   - Document payment status transitions: pending → completed/failed
   - Include payment flow diagram
   - Document payment gateway integration (mocked/real)
   - Provide payment API examples

8. **Create transaction documentation (transaction.md)**
   - Document POSTransaction model
   - Explain transaction lifecycle
   - Document transaction completion process
   - Document stock update logic
   - Document session totals update
   - Document transaction void process
   - Include end-to-end transaction flow diagram
   - Provide transaction API examples

9. **Create API reference documentation (api.md)**
   - Document all POS API endpoints
   - For each endpoint, include:
     - HTTP method and path
     - Authentication requirement
     - Request parameters (query, path, body)
     - Request body schema (JSON)
     - Response format (success and error)
     - Example request and response
   - Group endpoints by resource: terminals, sessions, carts, search, payments, transactions
   - Include authentication and authorization details
   - Use OpenAPI/Swagger schema if available

10. **Create configuration documentation (configuration.md)**
    - Document POS module settings in Django settings.py
    - Document environment variables for POS
    - Document payment gateway configuration
    - Document receipt printer configuration
    - Document currency and localization settings
    - Document session timeout settings
    - Provide configuration examples

11. **Create integration documentation (integration.md)**
    - Document integration with inventory module (stock updates)
    - Document integration with customer module (customer lookup)
    - Document integration with accounting module (transaction recording)
    - Document integration with payment gateways
    - Document webhook handling (for async payments)
    - Provide integration code examples

12. **Create troubleshooting documentation (troubleshooting.md)**
    - Document common issues and solutions
    - Document error codes and meanings
    - Document debugging tips
    - Document logging configuration
    - Document performance optimization tips

13. **Add diagrams throughout documentation**
    - Use Mermaid, PlantUML, or similar for diagrams
    - Include architecture diagrams
    - Include workflow diagrams (session, cart, payment, transaction)
    - Include state transition diagrams
    - Include sequence diagrams for complex flows
    - Include entity-relationship diagrams

### Documentation Structure Diagram

```
POS Module Documentation
├── index.md (Overview)
│   ├── Introduction
│   ├── Key Features
│   ├── Architecture Overview
│   └── Quick Links
├── architecture.md
│   ├── System Architecture
│   ├── Models Layer
│   ├── Services Layer
│   ├── API Layer
│   └── Design Patterns
├── terminal.md
│   ├── POSTerminal Model
│   ├── POSSession Model
│   ├── Session Lifecycle
│   ├── Cash Reconciliation
│   └── Configuration
├── cart.md
│   ├── POSCart Model
│   ├── POSCartItem Model
│   ├── Cart Operations
│   ├── Discount Logic
│   └── Total Calculation
├── search.md
│   ├── Search Methods
│   ├── Search Algorithm
│   ├── Filters & Options
│   └── Result Format
├── payment.md
│   ├── Payment Methods
│   ├── Payment Flow
│   ├── Split Payment
│   ├── Gateway Integration
│   └── Validation Rules
├── transaction.md
│   ├── Transaction Model
│   ├── Transaction Lifecycle
│   ├── Completion Process
│   ├── Void Process
│   └── Stock Updates
├── api.md (API Reference)
│   ├── Authentication
│   ├── Terminal Endpoints
│   ├── Session Endpoints
│   ├── Cart Endpoints
│   ├── Search Endpoints
│   ├── Payment Endpoints
│   └── Transaction Endpoints
├── configuration.md
│   ├── Django Settings
│   ├── Environment Variables
│   ├── Payment Gateway Config
│   └── Printer Configuration
├── integration.md
│   ├── Inventory Integration
│   ├── Customer Integration
│   ├── Accounting Integration
│   └── External Services
└── troubleshooting.md
    ├── Common Issues
    ├── Error Codes
    ├── Debugging Tips
    └── Performance Optimization
```

### Documentation Best Practices
- Use clear, concise language
- Include code examples for all operations
- Use diagrams to illustrate complex flows
- Keep documentation up-to-date with code changes
- Use consistent formatting and structure
- Include table of contents for long pages
- Use syntax highlighting for code blocks
- Include links between related documentation pages
- Add version information (e.g., "Added in v1.2")

### Example Diagram (Mermaid Syntax)

Session Lifecycle Diagram:
```
stateDiagram-v2
    [*] --> Open: open_session()
    Open --> Closed: close_session()
    Closed --> [*]
    Open --> Open: process transactions
    note right of Open
        Active session
        Accepts transactions
    end note
    note right of Closed
        Reconciled
        Cash variance calculated
    end note
```

### Documentation Content Checklist

| Section | Content |
|---------|---------|
| **Overview** | Introduction, features, architecture |
| **Models** | All model fields, relationships, constraints |
| **Services** | All service methods, parameters, return values |
| **API** | All endpoints, request/response formats |
| **Workflows** | Session, cart, payment, transaction flows |
| **Configuration** | All settings, environment variables |
| **Integration** | External system connections |
| **Examples** | Code examples for common operations |
| **Diagrams** | Architecture, workflow, state, sequence |
| **Troubleshooting** | Common issues, solutions, debugging |

### Verification Checklist
- [ ] `docs/modules/pos/index.md` created
- [ ] `docs/modules/pos/architecture.md` created
- [ ] `docs/modules/pos/terminal.md` created
- [ ] `docs/modules/pos/cart.md` created
- [ ] `docs/modules/pos/search.md` created
- [ ] `docs/modules/pos/payment.md` created
- [ ] `docs/modules/pos/transaction.md` created
- [ ] `docs/modules/pos/api.md` created
- [ ] `docs/modules/pos/configuration.md` created
- [ ] `docs/modules/pos/integration.md` created
- [ ] `docs/modules/pos/troubleshooting.md` created
- [ ] All diagrams included
- [ ] All code examples included
- [ ] MkDocs navigation configured
- [ ] Documentation builds successfully
- [ ] All links are functional

---

## Task 94: Create POS User Guide

### Overview
Create end-user documentation for cashiers and store managers covering day-to-day POS operations, including opening/closing shifts, processing sales, handling payments, and troubleshooting common issues.

### Dependencies
- Task 93: POS module technical documentation
- POS UI/frontend completed
- User testing feedback (if available)

### Instructions

1. **Set up user guide structure**
   - Create `docs/guides/pos-user-guide.md` or separate directory
   - Use user-friendly language (non-technical)
   - Include screenshots or mockups of UI
   - Structure content by user tasks/workflows

2. **Create user guide overview**
   - Introduce the POS system
   - Explain who the guide is for (cashiers, managers)
   - List what the guide covers
   - Include navigation/table of contents

3. **Create "Getting Started" section**
   - Explain POS system login
   - Describe POS dashboard/home screen
   - Explain terminal selection (if multiple terminals)
   - Describe user roles and permissions (cashier vs manager)

4. **Create "Opening a Shift" section**
   - Step-by-step instructions for opening a session
   - Explain opening cash balance entry
   - Explain why opening balance matters (for reconciliation)
   - Include screenshots of open session screen
   - Troubleshooting: What if terminal is already in use?

5. **Create "Processing a Sale" section**
   - Step-by-step instructions for processing a transaction
   - Subsection: Searching for products (barcode, SKU, name)
   - Subsection: Adding items to cart
   - Subsection: Updating item quantities
   - Subsection: Removing items from cart
   - Subsection: Applying discounts (line and cart level)
   - Subsection: Reviewing cart totals
   - Subsection: Processing payment (cash, card, mobile)
   - Subsection: Printing receipt
   - Include screenshots for each step
   - Tips for faster checkout

6. **Create "Payment Methods" section**
   - Subsection: Cash payment
     - How to enter cash amount
     - How to calculate change (automatic)
     - How to open cash drawer
   - Subsection: Card payment
     - How to process card payment
     - What to do while waiting for approval
     - How to handle declined card
   - Subsection: Mobile payment (eZ Cash, mCash)
     - How to enter mobile number
     - How to confirm mobile payment
     - What to do if payment pending
   - Subsection: Store credit
     - How to apply store credit
     - How to check customer credit balance
   - Subsection: Split payment
     - How to split payment across methods
     - Example: Part cash, part card

7. **Create "Discounts and Promotions" section**
   - How to apply line-level discount (per item)
   - How to apply cart-level discount (total)
   - How to apply promotion codes (if applicable)
   - Discount authorization (if manager approval required)
   - Examples of discount scenarios

8. **Create "Holding and Recalling Carts" section**
   - When to hold a cart (customer steps away, etc.)
   - How to hold a cart (save for later)
   - How to recall a held cart (by reference number or customer)
   - How many carts can be held at once
   - Include screenshots

9. **Create "Voiding a Transaction" section**
   - When to void a transaction (wrong items, customer cancels)
   - How to void a transaction (manager authorization may be required)
   - What happens when a transaction is voided (stock restored)
   - Void reason entry
   - Include screenshot of void dialog

10. **Create "Closing a Shift" section**
    - Step-by-step instructions for closing a session
    - How to count closing cash
    - How to enter closing cash amount
    - Understanding cash variance (over/short)
    - Reviewing shift summary (total sales, transactions)
    - Printing shift report
    - What to do if cash short (notify manager)

11. **Create "Troubleshooting" section**
    - Common issue: Product not found in search
      - Solution: Check barcode, try SKU or name search
    - Common issue: Out of stock error
      - Solution: Check inventory, suggest alternative product
    - Common issue: Payment declined
      - Solution: Try different card, alternative payment method
    - Common issue: Mobile payment pending
      - Solution: Wait for confirmation, or use alternative method
    - Common issue: Printer not working
      - Solution: Check printer connection, paper, restart printer
    - Common issue: Session won't close
      - Solution: Ensure all carts are completed or voided
    - Contact information for technical support

12. **Create "Frequently Asked Questions (FAQ)" section**
    - Q: Can I process a sale without a session open?
      - A: No, you must open a session first.
    - Q: What if I forget to open a session?
      - A: Open the session before processing any sales.
    - Q: Can I close a session with held carts?
      - A: Yes, but they will need to be recalled in the next session.
    - Q: How do I handle a return?
      - A: (Link to returns process if implemented, or note future feature)
    - Q: Can I change the price of an item?
      - A: Only if authorized (manager override).
    - Q: What currency is supported?
      - A: Sri Lankan Rupees (LKR).

13. **Create "Tips and Best Practices" section**
    - Keep your session open only during your shift
    - Count cash carefully to avoid variance
    - Use barcode scanner for faster checkout
    - Double-check totals before processing payment
    - Always print receipt for customer
    - Be friendly and efficient

14. **Add visual aids throughout guide**
    - Include screenshots of every major screen
    - Use numbered annotations on screenshots (1, 2, 3 for steps)
    - Use callout boxes for important tips
    - Use icons for different payment methods
    - Use color coding for warnings (e.g., red for errors)

### User Guide Structure Diagram

```
POS User Guide
├── Overview
│   ├── Introduction
│   ├── Who This Guide Is For
│   └── Table of Contents
├── Getting Started
│   ├── Logging In
│   ├── Dashboard Overview
│   └── User Roles
├── Opening a Shift
│   ├── Step-by-step Instructions
│   ├── Opening Balance
│   └── Troubleshooting
├── Processing a Sale
│   ├── Searching for Products
│   ├── Adding Items to Cart
│   ├── Updating Quantities
│   ├── Removing Items
│   ├── Applying Discounts
│   ├── Reviewing Totals
│   ├── Processing Payment
│   └── Printing Receipt
├── Payment Methods
│   ├── Cash Payment
│   ├── Card Payment
│   ├── Mobile Payment
│   ├── Store Credit
│   └── Split Payment
├── Discounts & Promotions
│   ├── Line Discount
│   ├── Cart Discount
│   └── Promotion Codes
├── Holding & Recalling Carts
│   ├── When to Hold
│   ├── How to Hold
│   └── How to Recall
├── Voiding a Transaction
│   ├── When to Void
│   ├── How to Void
│   └── Manager Authorization
├── Closing a Shift
│   ├── Counting Cash
│   ├── Entering Closing Balance
│   ├── Cash Variance
│   ├── Shift Summary
│   └── Printing Report
├── Troubleshooting
│   ├── Product Not Found
│   ├── Out of Stock
│   ├── Payment Declined
│   ├── Printer Issues
│   └── Support Contact
├── FAQ
│   └── Common Questions & Answers
└── Tips & Best Practices
    └── Efficiency & Accuracy Tips
```

### User Guide Best Practices
- Use simple, clear language (avoid technical jargon)
- Structure content by user tasks, not system features
- Use screenshots extensively (annotated)
- Use step-by-step numbered instructions
- Include tips, warnings, and notes in callout boxes
- Test the guide with actual users (if possible)
- Keep guide up-to-date with UI changes
- Provide both online and printable versions

### Screenshot Annotations Example

For "Adding Item to Cart" screenshot:
- ① Search bar (enter barcode, SKU, or name)
- ② Search results (click to add)
- ③ Cart items list (current cart)
- ④ Item quantity (adjust as needed)
- ⑤ Cart totals (subtotal, discount, grand total)

### User Guide Tone
- Friendly and encouraging
- Use "you" to address the user
- Use active voice (e.g., "Click the button" not "The button should be clicked")
- Provide reassurance for error scenarios
- Use positive language

### Example Content Snippet

**Processing a Cash Payment**

1. After adding all items to the cart, review the **Grand Total** displayed at the bottom right.
2. Click the **"Pay"** button to proceed to payment.
3. Select **"Cash"** as the payment method.
4. Enter the amount of cash received from the customer.
   - **Tip:** The system will automatically calculate the change owed.
5. Click **"Complete Payment"**.
6. The system will display the change amount. Give the change to the customer.
7. The receipt will print automatically. Hand it to the customer.

**What if the customer doesn't have enough cash?**
- Ask if they'd like to pay with a different method (card or mobile).
- Or use **Split Payment** to combine cash with another method.

### Verification Checklist
- [ ] User guide structure created
- [ ] Overview section written
- [ ] Getting Started section written
- [ ] Opening a Shift section written (with screenshots)
- [ ] Processing a Sale section written (with screenshots)
- [ ] Payment Methods section written (all methods covered)
- [ ] Discounts section written
- [ ] Holding/Recalling Carts section written
- [ ] Voiding Transactions section written
- [ ] Closing a Shift section written (with screenshots)
- [ ] Troubleshooting section written
- [ ] FAQ section written
- [ ] Tips & Best Practices section written
- [ ] All screenshots included and annotated
- [ ] Callout boxes for tips and warnings
- [ ] Guide reviewed by actual users (if possible)
- [ ] Guide accessible in both online and printable formats

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 92 | Create API endpoint tests | Complete ViewSet and API tests |
| 93 | Write POS module documentation | Technical documentation for developers |
| 94 | Create POS user guide | End-user guide for cashiers and managers |

### Group F Final Deliverables

```
apps/pos/tests/
├── test_views.py            # Task 92: API endpoint tests

docs/modules/pos/
├── index.md                 # Task 93: POS overview
├── architecture.md          # Task 93: System architecture
├── terminal.md              # Task 93: Terminal management
├── cart.md                  # Task 93: Cart operations
├── search.md                # Task 93: Product search
├── payment.md               # Task 93: Payment processing
├── transaction.md           # Task 93: Transactions
├── api.md                   # Task 93: API reference
├── configuration.md         # Task 93: Configuration guide
├── integration.md           # Task 93: Integration guide
└── troubleshooting.md       # Task 93: Troubleshooting

docs/guides/
└── pos-user-guide.md        # Task 94: End-user guide
```

### Documentation Statistics
| Document Type | Pages/Sections | Estimated Length |
|---------------|----------------|------------------|
| API Tests | 10+ test suites | 60-80 tests |
| Technical Docs | 11 markdown files | ~200-300 pages |
| User Guide | 12 sections | ~50-80 pages |

### Complete Group F Summary (Tasks 87-94)

| Task # | Task Name | Deliverable |
|--------|-----------|-------------|
| 87 | Terminal/session tests | `test_terminal.py`, `test_session.py` |
| 88 | Cart operation tests | `test_cart.py` |
| 89 | Product search tests | `test_search.py` |
| 90 | Payment processing tests | `test_payment.py` |
| 91 | Transaction flow tests | `test_transaction.py` |
| 92 | API endpoint tests | `test_views.py` |
| 93 | POS module documentation | 11 technical documentation files |
| 94 | POS user guide | 1 comprehensive user guide |

### Testing & Documentation Coverage

```
POS Module Completeness
├── Unit Tests: ✓ Complete
│   ├── Models: 100% coverage
│   ├── Services: 95%+ coverage
│   └── Edge cases: Covered
├── Integration Tests: ✓ Complete
│   ├── Transaction flows: 95%+ coverage
│   └── Multi-component: Covered
├── API Tests: ✓ Complete
│   ├── All endpoints: 100% coverage
│   ├── Auth/authz: 100% coverage
│   └── Validation: Covered
├── Technical Documentation: ✓ Complete
│   ├── Architecture: Documented
│   ├── Models: Documented
│   ├── Services: Documented
│   ├── API: Fully documented
│   └── Integration: Documented
└── User Documentation: ✓ Complete
    ├── User guide: Complete
    ├── Screenshots: Included
    └── Troubleshooting: Included
```

### Next Steps
1. Run complete test suite: `pytest apps/pos/tests/ -v --cov=apps/pos`
2. Generate coverage report: `pytest apps/pos/tests/ --cov=apps/pos --cov-report=html`
3. Build technical documentation: `mkdocs build`
4. Review user guide with actual users
5. Ensure all test coverage > 95%
6. Deploy documentation to internal docs site
7. Proceed to next SubPhase: Offline Mode & Sync

---

## Notes for AI Agents

1. **API Testing Framework:** Use Django REST Framework's test utilities (APIClient, APITestCase)
2. **Authentication:** Test with both JWT and session authentication
3. **Tenant Isolation:** Every API test must verify tenant data isolation
4. **Documentation Format:** Use Markdown with Mermaid/PlantUML for diagrams
5. **User Guide Language:** Keep language simple and user-friendly (8th-grade reading level)
6. **Screenshots:** Placeholder text acceptable in documentation; actual screenshots to be added during UI implementation
7. **MkDocs Configuration:** Ensure POS module documentation is integrated into main docs navigation
8. **API Schema:** Use drf-spectacular for OpenAPI 3.0 schema generation
9. **Versioning:** Include version information in documentation (e.g., "Added in v1.2")
10. **Maintenance:** Documentation should be updated alongside code changes
