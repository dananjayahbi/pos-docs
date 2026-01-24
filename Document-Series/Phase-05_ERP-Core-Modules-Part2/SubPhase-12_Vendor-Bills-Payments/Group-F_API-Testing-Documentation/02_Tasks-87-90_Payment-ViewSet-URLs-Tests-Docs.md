# Tasks 87-90: Payment ViewSet, URLs, Comprehensive Tests & Documentation

## Navigation
- **Parent**: [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous**: [01_Tasks-83-86_Bill-ViewSet-URLs-Tests.md](./01_Tasks-83-86_Bill-ViewSet-URLs-Tests.md)
- **Next**: None

---

## Overview

This document covers the final tasks in the Vendor Bills & Payments SubPhase, focusing on the VendorPaymentViewSet for payment management, URL registration, comprehensive testing across all module components, and complete module documentation. These tasks complete the API layer and ensure full test coverage and documentation for the entire vendor bills and payments system.

**Tasks Covered**:
- **Task 87**: VendorPaymentViewSet - Create API endpoints for vendor payment operations
- **Task 88**: Register Payment URLs - Configure URL routing for payment endpoints
- **Task 89**: Comprehensive Tests - Full test suite for models, services, matching, payments, and API
- **Task 90**: Module Documentation - Complete documentation for the vendor bills & payments module

---

## Task 87: VendorPaymentViewSet

### Objective
Implement a comprehensive ViewSet for vendor payment management with full CRUD operations, custom actions for payment processing, reconciliation, and reporting.

### Background
The VendorPaymentViewSet provides the REST API interface for all payment-related operations. It handles payment creation, processing, reconciliation with bills, payment method management, and reporting functionality. The ViewSet integrates with the VendorPaymentService for business logic and ensures proper authorization, validation, and audit logging.

### Requirements

#### 1. ViewSet Base Configuration
- **Class Definition**:
  - Extend `viewsets.ModelViewSet`
  - Configure `VendorPayment` as queryset model
  - Implement tenant-aware filtering
  - Set appropriate permission classes
  - Configure pagination settings

- **Serializer Management**:
  - Define `serializer_class` mapping
  - Implement `get_serializer_class()` for action-based serializers
  - Use `VendorPaymentSerializer` for list/retrieve
  - Use `VendorPaymentCreateSerializer` for create
  - Use `VendorPaymentUpdateSerializer` for update
  - Use `VendorPaymentDetailSerializer` for detail view

- **Query Optimization**:
  - Use `select_related()` for vendor, payment_method, currency
  - Use `prefetch_related()` for matched_bills, attachments
  - Implement `get_queryset()` with optimizations
  - Apply proper ordering (default: `-payment_date`, `-created_at`)

#### 2. Standard CRUD Operations

##### List Payments
- **Endpoint**: `GET /api/vendor-bills/payments/`
- **Functionality**:
  - Retrieve paginated list of payments
  - Apply tenant filtering automatically
  - Support search by reference_number, vendor name, notes
  - Filter by payment_date range, status, payment_method, vendor
  - Sort by multiple fields
  - Return summary statistics in response metadata

- **Query Parameters**:
  - `search`: Text search across multiple fields
  - `vendor`: Filter by vendor ID
  - `status`: Filter by payment status
  - `payment_method`: Filter by payment method
  - `payment_date_from`: Start date filter
  - `payment_date_to`: End date filter
  - `min_amount`: Minimum payment amount
  - `max_amount`: Maximum payment amount
  - `currency`: Filter by currency code
  - `reconciled`: Filter by reconciliation status
  - `ordering`: Sort field specification

##### Retrieve Payment
- **Endpoint**: `GET /api/vendor-bills/payments/{id}/`
- **Functionality**:
  - Return detailed payment information
  - Include all matched bill allocations
  - Include payment attachment list
  - Include vendor details
  - Include reconciliation status
  - Include audit trail information

##### Create Payment
- **Endpoint**: `POST /api/vendor-bills/payments/`
- **Functionality**:
  - Validate payment data through serializer
  - Delegate to VendorPaymentService for processing
  - Create payment record
  - Process bill allocations if provided
  - Update bill statuses based on payments
  - Create audit log entry
  - Send notifications if configured
  - Return created payment with allocations

- **Validation Requirements**:
  - Vendor must exist and be active
  - Payment date cannot be in future (unless configured)
  - Amount must be positive
  - Currency must match vendor's default or bills
  - Payment method must be valid
  - Bill allocations must not exceed payment amount
  - Allocated bills must belong to vendor
  - Cannot allocate more than bill outstanding amount

##### Update Payment
- **Endpoint**: `PUT/PATCH /api/vendor-bills/payments/{id}/`
- **Functionality**:
  - Allow updates only for pending/draft payments
  - Validate updated data
  - Re-calculate allocations if amount changed
  - Update bill statuses accordingly
  - Create audit log entry
  - Return updated payment

- **Restrictions**:
  - Cannot update processed/reconciled payments
  - Cannot change vendor after creation
  - Cannot change currency after creation
  - Amount changes require allocation re-validation

##### Delete Payment
- **Endpoint**: `DELETE /api/vendor-bills/payments/{id}/`
- **Functionality**:
  - Allow deletion only for draft/pending payments
  - Perform soft delete (mark as deleted)
  - Reverse bill allocations
  - Update bill statuses back to unpaid/partially paid
  - Create audit log entry
  - Return confirmation

#### 3. Custom Actions

##### Process Payment
- **Endpoint**: `POST /api/vendor-bills/payments/{id}/process/`
- **Method**: Custom action decorator `@action(detail=True, methods=['post'])`
- **Functionality**:
  - Validate payment is in draft/pending status
  - Perform payment processing via service
  - Update status to processed
  - Record processing timestamp and user
  - Trigger payment gateway integration if configured
  - Update bill statuses to paid/partially paid
  - Create audit log entry
  - Send confirmation notifications
  - Return processed payment with status

- **Request Body**:
  - `processing_date`: Optional processing date
  - `notes`: Optional processing notes
  - `gateway_transaction_id`: External transaction reference

##### Void Payment
- **Endpoint**: `POST /api/vendor-bills/payments/{id}/void/`
- **Method**: Custom action decorator
- **Functionality**:
  - Validate payment can be voided
  - Mark payment as voided
  - Reverse all bill allocations
  - Update bill statuses
  - Create reversal audit entries
  - Send void notifications
  - Return voided payment

- **Request Body**:
  - `void_reason`: Required reason for voiding
  - `void_date`: Optional void date (default: today)

##### Reconcile Payment
- **Endpoint**: `POST /api/vendor-bills/payments/{id}/reconcile/`
- **Method**: Custom action decorator
- **Functionality**:
  - Mark payment as reconciled with bank statement
  - Record reconciliation date
  - Link to bank statement if provided
  - Update reconciliation status
  - Create audit log entry
  - Return reconciled payment

- **Request Body**:
  - `reconciliation_date`: Date of reconciliation
  - `bank_statement_line_id`: Optional bank statement reference
  - `notes`: Reconciliation notes

##### Unreconcile Payment
- **Endpoint**: `POST /api/vendor-bills/payments/{id}/unreconcile/`
- **Method**: Custom action decorator
- **Functionality**:
  - Remove reconciliation status
  - Allow re-processing or editing
  - Create audit log entry
  - Return unreconciled payment

- **Request Body**:
  - `reason`: Required reason for unreconciliation

##### Allocate to Bills
- **Endpoint**: `POST /api/vendor-bills/payments/{id}/allocate/`
- **Method**: Custom action decorator
- **Functionality**:
  - Add or modify bill allocations for payment
  - Validate allocation amounts
  - Use auto-matching service if requested
  - Update bill statuses based on allocations
  - Return payment with updated allocations

- **Request Body**:
  - `allocations`: Array of bill allocations
    - `bill_id`: Vendor bill ID
    - `allocated_amount`: Amount to allocate
  - `auto_match`: Boolean to trigger auto-matching

##### Download Receipt
- **Endpoint**: `GET /api/vendor-bills/payments/{id}/download-receipt/`
- **Method**: Custom action decorator
- **Functionality**:
  - Generate payment receipt PDF
  - Include payment details
  - Include vendor information
  - Include matched bills list
  - Return PDF file response

##### Bulk Process
- **Endpoint**: `POST /api/vendor-bills/payments/bulk-process/`
- **Method**: Custom action decorator on list
- **Functionality**:
  - Process multiple payments in batch
  - Validate all payments can be processed
  - Process each payment via service
  - Return summary of results (success/failure counts)
  - Include error details for failed payments

- **Request Body**:
  - `payment_ids`: Array of payment IDs to process
  - `processing_date`: Optional date for all payments

##### Payment Report
- **Endpoint**: `GET /api/vendor-bills/payments/report/`
- **Method**: Custom action decorator on list
- **Functionality**:
  - Generate payment summary report
  - Filter by date range, vendor, status
  - Group by vendor, payment method, or date
  - Calculate totals and averages
  - Return aggregated data

- **Query Parameters**:
  - `date_from`: Report start date
  - `date_to`: Report end date
  - `vendor`: Filter by vendor
  - `group_by`: Grouping field (vendor/payment_method/date)
  - `format`: Response format (json/csv/pdf)

##### Vendor Summary
- **Endpoint**: `GET /api/vendor-bills/payments/vendor-summary/`
- **Method**: Custom action decorator on list
- **Functionality**:
  - Generate payment summary by vendor
  - Calculate total paid, average payment, payment count
  - Include date range filtering
  - Return vendor-grouped data

#### 4. Permission and Authorization

- **Permission Classes**:
  - Implement tenant-based permissions
  - Check user role-based access (AP Clerk, AP Manager, Finance Manager)
  - Restrict processing/voiding to authorized roles
  - Allow read access for broader roles

- **Custom Permission Checks**:
  - Verify user has access to vendor
  - Check payment amount limits for user role
  - Require approval for large payments
  - Enforce separation of duties for processing

- **Method-Level Permissions**:
  - `list`: Allow read access
  - `retrieve`: Allow read access
  - `create`: Require payment creation permission
  - `update`: Require payment modification permission
  - `delete`: Require payment deletion permission
  - `process`: Require payment processing permission
  - `void`: Require payment voiding permission
  - `reconcile`: Require reconciliation permission

#### 5. Filtering and Search

- **FilterSet Configuration**:
  - Use django-filter for advanced filtering
  - Define `VendorPaymentFilterSet` class
  - Support exact, range, and lookup filters
  - Enable multiple filter combinations

- **Search Implementation**:
  - Configure `search_fields` for text search
  - Search by reference number (exact/partial)
  - Search by vendor name
  - Search by notes/description
  - Use case-insensitive search

- **Ordering Options**:
  - Default: `-payment_date`, `-created_at`
  - Allow: `payment_date`, `amount`, `vendor__name`, `status`, `created_at`

#### 6. Response Enhancement

- **Metadata Inclusion**:
  - Add pagination metadata
  - Include filter summary
  - Add aggregate statistics (total paid, count)
  - Include available status choices

- **Related Data Optimization**:
  - Use serializer fields for related objects
  - Avoid N+1 query problems
  - Prefetch matched bills with details
  - Include vendor summary data

#### 7. Error Handling

- **Validation Errors**:
  - Return 400 for invalid payment data
  - Provide detailed field-level errors
  - Include business rule violation messages

- **Authorization Errors**:
  - Return 403 for permission denied
  - Provide clear authorization messages

- **Not Found Errors**:
  - Return 404 for non-existent payments
  - Handle tenant isolation (payment from different tenant)

- **Business Logic Errors**:
  - Return 400 for invalid state transitions
  - Provide clear error messages for business rule violations

#### 8. Audit Logging

- **Log All Actions**:
  - Create audit entries for all CRUD operations
  - Log custom action invocations
  - Include user, timestamp, changes
  - Log IP address and user agent

- **Change Tracking**:
  - Track field-level changes for updates
  - Log status transitions
  - Record allocation modifications
  - Track reconciliation changes

#### 9. Integration Points

- **VendorPaymentService Integration**:
  - Delegate business logic to service layer
  - Use service for payment processing
  - Use service for allocation management
  - Handle service-level exceptions

- **Notification Integration**:
  - Trigger notifications on payment creation
  - Send alerts for processing completion
  - Notify on void/cancellation
  - Alert on reconciliation

- **Reporting Integration**:
  - Generate payment receipts
  - Export payment data
  - Create summary reports
  - Integrate with BI tools

### Validation Criteria

#### Functional Validation
- [ ] All CRUD operations work correctly
- [ ] Custom actions execute successfully
- [ ] Tenant isolation is enforced
- [ ] Permissions are properly checked
- [ ] Payment processing updates bill statuses correctly
- [ ] Void operation reverses allocations properly
- [ ] Reconciliation marks payments correctly
- [ ] Bulk operations handle errors gracefully
- [ ] Reports generate accurate data

#### Technical Validation
- [ ] Query optimization eliminates N+1 problems
- [ ] Filtering and search work as expected
- [ ] Pagination handles large datasets
- [ ] Serializers return correct data structures
- [ ] Error responses follow REST standards
- [ ] Audit logging captures all changes
- [ ] Response times meet performance targets

#### Security Validation
- [ ] Authentication is required for all endpoints
- [ ] Authorization checks prevent unauthorized access
- [ ] Tenant isolation prevents cross-tenant access
- [ ] Input validation prevents injection attacks
- [ ] Large payment amounts require approval
- [ ] Sensitive data is not exposed in responses

### Testing Strategy

#### Unit Tests
- Test each ViewSet method independently
- Mock service layer dependencies
- Test serializer selection logic
- Test permission checking logic
- Test query optimization
- Test error handling paths

#### Integration Tests
- Test complete API workflows
- Test with real database
- Test service integration
- Test notification triggering
- Test audit log creation
- Test payment-bill linking

#### API Tests
- Test all endpoints with valid data
- Test authentication requirements
- Test authorization enforcement
- Test validation error responses
- Test pagination behavior
- Test filtering and search
- Test bulk operations
- Test custom actions

#### Performance Tests
- Test list endpoint with large datasets
- Test query optimization effectiveness
- Measure response times for complex operations
- Test concurrent payment processing

### Dependencies
- Task 77: VendorPaymentService (service layer for business logic)
- Task 79: VendorPaymentSerializer (serialization)
- Task 83: VendorBillViewSet (bill API reference)
- Task 85: VendorBillPaymentMatching (allocation logic)

---

## Task 88: Register Payment URLs

### Objective
Configure URL routing for the VendorPaymentViewSet, integrating payment endpoints into the vendor bills API structure.

### Background
URL registration connects the ViewSet to REST endpoints, defines the URL namespace, and establishes the routing structure for payment operations. Proper URL configuration ensures clean, RESTful endpoints and consistent API design.

### Requirements

#### 1. Router Configuration

- **Nested Router Setup**:
  - Use DefaultRouter or NestedRouter
  - Register VendorPaymentViewSet under `/api/vendor-bills/payments/`
  - Configure basename as `vendor-payment`
  - Set appropriate trailing slash settings

- **Router Registration**:
  - Import VendorPaymentViewSet
  - Register with router: `router.register(r'payments', VendorPaymentViewSet, basename='vendor-payment')`
  - Include in main URL patterns

#### 2. URL Structure Design

- **Base Payment URLs**:
  - `GET /api/vendor-bills/payments/` - List payments
  - `POST /api/vendor-bills/payments/` - Create payment
  - `GET /api/vendor-bills/payments/{id}/` - Retrieve payment
  - `PUT /api/vendor-bills/payments/{id}/` - Full update
  - `PATCH /api/vendor-bills/payments/{id}/` - Partial update
  - `DELETE /api/vendor-bills/payments/{id}/` - Delete payment

- **Custom Action URLs**:
  - `POST /api/vendor-bills/payments/{id}/process/` - Process payment
  - `POST /api/vendor-bills/payments/{id}/void/` - Void payment
  - `POST /api/vendor-bills/payments/{id}/reconcile/` - Reconcile payment
  - `POST /api/vendor-bills/payments/{id}/unreconcile/` - Unreconcile payment
  - `POST /api/vendor-bills/payments/{id}/allocate/` - Allocate to bills
  - `GET /api/vendor-bills/payments/{id}/download-receipt/` - Download receipt
  - `POST /api/vendor-bills/payments/bulk-process/` - Bulk process
  - `GET /api/vendor-bills/payments/report/` - Payment report
  - `GET /api/vendor-bills/payments/vendor-summary/` - Vendor summary

#### 3. URL Configuration File

- **Module Location**:
  - Define in `apps/vendor_bills/urls.py`
  - Import router from DRF
  - Import ViewSets
  - Define app_name for namespacing

- **URL Patterns Structure**:
  - Define router instance
  - Register all ViewSets
  - Include router URLs in patterns
  - Add any custom URL patterns if needed

- **Namespace Configuration**:
  - Set `app_name = 'vendor_bills'`
  - Allow reverse URL resolution: `reverse('vendor_bills:vendor-payment-list')`
  - Support namespace in API root

#### 4. Integration with Main URLs

- **Project URL Configuration**:
  - Include vendor bills URLs in main urls.py
  - Mount under `/api/vendor-bills/` prefix
  - Ensure consistent versioning if API versioning is used
  - Include in API schema generation

#### 5. API Root and Documentation

- **API Root Endpoint**:
  - Include payment URLs in API root
  - Provide discoverable links to payment endpoints
  - Include in browsable API

- **Schema Integration**:
  - Configure OpenAPI schema generation
  - Include payment endpoints in schema
  - Define request/response examples
  - Document query parameters and filters

#### 6. URL Name Patterns

- **Standard Names** (auto-generated by router):
  - `vendor-payment-list` - List/Create endpoint
  - `vendor-payment-detail` - Retrieve/Update/Delete endpoint
  - `vendor-payment-process` - Process action
  - `vendor-payment-void` - Void action
  - `vendor-payment-reconcile` - Reconcile action
  - `vendor-payment-unreconcile` - Unreconcile action
  - `vendor-payment-allocate` - Allocate action
  - `vendor-payment-download-receipt` - Receipt action
  - `vendor-payment-bulk-process` - Bulk process action
  - `vendor-payment-report` - Report action
  - `vendor-payment-vendor-summary` - Vendor summary action

#### 7. Relationship URLs

- **Nested Resources** (if applicable):
  - Consider vendor-nested payment URLs
  - Example: `/api/vendor-bills/vendors/{vendor_id}/payments/`
  - Use NestedRouter if implementing nested routes
  - Maintain backward compatibility

#### 8. URL Pattern Best Practices

- **RESTful Design**:
  - Use plural nouns for resources: `payments`
  - Use hyphens for multi-word actions: `bulk-process`
  - Use clear, descriptive action names
  - Follow REST conventions for HTTP methods

- **Consistency**:
  - Match URL patterns with bill endpoints
  - Use consistent naming across module
  - Follow project-wide URL conventions

### Validation Criteria

#### Functional Validation
- [ ] All payment URLs resolve correctly
- [ ] Standard CRUD operations accessible via correct URLs
- [ ] Custom actions accessible via defined URLs
- [ ] URL reverse resolution works correctly
- [ ] Namespace resolution functions properly

#### Technical Validation
- [ ] Router registration syntax is correct
- [ ] No URL pattern conflicts
- [ ] URLs integrate with main project URLs
- [ ] API schema includes all endpoints
- [ ] Browsable API displays all endpoints

#### Documentation Validation
- [ ] URL patterns are clearly documented
- [ ] API documentation includes all endpoints
- [ ] Examples show correct URL usage
- [ ] Query parameters are documented

### Testing Strategy

#### URL Resolution Tests
- Test each URL pattern resolves correctly
- Test reverse URL generation
- Test URL parameters are captured correctly
- Test namespace resolution

#### Integration Tests
- Test URL integration with ViewSet
- Test all HTTP methods on each endpoint
- Test custom action URLs
- Test nested route URLs if implemented

#### API Documentation Tests
- Verify schema includes all endpoints
- Test API root includes payment links
- Verify browsable API displays correctly

### Dependencies
- Task 87: VendorPaymentViewSet (ViewSet to be registered)
- Task 84: VendorBillViewSet URLs (URL structure reference)

---

## Task 89: Comprehensive Tests

### Objective
Create a complete test suite covering all components of the vendor bills and payments module, including models, services, matching, payment processing, and API endpoints.

### Background
Comprehensive testing ensures the reliability, correctness, and maintainability of the vendor bills and payments system. The test suite covers unit tests for individual components, integration tests for workflows, and API tests for endpoints, providing confidence in the system's behavior.

### Requirements

#### 1. Test Organization Structure

- **Test Module Layout**:
  ```
  apps/vendor_bills/tests/
  ├── __init__.py
  ├── test_models.py              # Model tests
  ├── test_services.py            # Service layer tests
  ├── test_matching.py            # Matching algorithm tests
  ├── test_payment_processing.py  # Payment processing tests
  ├── test_api_bills.py           # Bill API tests
  ├── test_api_payments.py        # Payment API tests
  ├── fixtures.py                 # Test fixtures and factories
  └── conftest.py                 # Pytest configuration
  ```

- **Test Base Classes**:
  - Create `VendorBillsTestCase` base class
  - Implement tenant setup/teardown
  - Provide common fixtures
  - Include helper methods for test data creation

#### 2. Model Tests (test_models.py)

##### VendorBill Model Tests
- **Basic Model Operations**:
  - Test bill creation with required fields
  - Test field validations (amount > 0, dates)
  - Test default values (status, currency)
  - Test string representation
  - Test model constraints (unique_together, check constraints)

- **Status Transitions**:
  - Test draft → pending transition
  - Test pending → approved transition
  - Test approved → paid transition
  - Test any status → void transition
  - Test invalid status transitions raise errors

- **Amount Calculations**:
  - Test `calculate_outstanding_amount()` with no payments
  - Test `calculate_outstanding_amount()` with partial payment
  - Test `calculate_outstanding_amount()` with full payment
  - Test `calculate_outstanding_amount()` with overpayment
  - Test amounts with different currencies

- **Payment Status Methods**:
  - Test `is_fully_paid()` returns True when outstanding = 0
  - Test `is_fully_paid()` returns False when outstanding > 0
  - Test `is_partially_paid()` when 0 < outstanding < total
  - Test `is_overdue()` based on due_date
  - Test status update on payment allocation

- **Relationship Tests**:
  - Test vendor relationship (foreign key)
  - Test currency relationship
  - Test payment allocations (reverse relationship)
  - Test line items if implemented
  - Test attachments relationship

- **Tenant Isolation**:
  - Test bills are filtered by tenant
  - Test cross-tenant access is prevented
  - Test tenant foreign key cascade behavior

##### VendorPayment Model Tests
- **Basic Model Operations**:
  - Test payment creation with required fields
  - Test field validations
  - Test default values
  - Test string representation
  - Test model constraints

- **Allocation Management**:
  - Test adding bill allocations
  - Test total allocated amount calculation
  - Test unallocated amount calculation
  - Test allocation validation (cannot exceed payment amount)
  - Test allocation updates

- **Status Management**:
  - Test draft → processed transition
  - Test processed → reconciled transition
  - Test void operation
  - Test status-based restrictions

- **Reconciliation Tests**:
  - Test reconciliation flag toggling
  - Test reconciliation date setting
  - Test unreconciliation

- **Relationship Tests**:
  - Test vendor relationship
  - Test payment method relationship
  - Test matched bills relationship
  - Test allocation amounts

##### VendorBillPaymentAllocation Model Tests
- **Allocation Creation**:
  - Test creating allocation linking bill and payment
  - Test allocated amount validation
  - Test allocation constraints

- **Amount Validations**:
  - Test allocation cannot exceed bill outstanding
  - Test allocation cannot exceed payment unallocated
  - Test negative amounts rejected
  - Test zero amounts handled

- **Cascading Effects**:
  - Test bill deletion handling
  - Test payment deletion handling
  - Test tenant cascade behavior

#### 3. Service Layer Tests (test_services.py)

##### VendorBillService Tests
- **Bill Creation**:
  - Test successful bill creation with valid data
  - Test vendor validation
  - Test amount validation
  - Test date validation
  - Test tenant assignment
  - Test audit log creation

- **Bill Updates**:
  - Test updating draft bills
  - Test updating approved bills
  - Test restrictions on paid bills
  - Test field-level validations
  - Test audit log for updates

- **Status Transitions**:
  - Test submit_for_approval() with draft bill
  - Test approve_bill() with pending bill
  - Test reject_bill() with pending bill
  - Test void_bill() with various statuses
  - Test invalid transitions raise exceptions

- **Payment Status Updates**:
  - Test auto status update on full payment
  - Test partial payment status
  - Test overpayment handling

- **Business Logic**:
  - Test due date calculation if auto-generated
  - Test overdue bill identification
  - Test aging calculation
  - Test validation of business rules

##### VendorPaymentService Tests
- **Payment Creation**:
  - Test creating payment with valid data
  - Test vendor validation
  - Test amount validation
  - Test payment method validation
  - Test currency validation
  - Test bill allocation on creation

- **Payment Processing**:
  - Test process_payment() changes status to processed
  - Test processing date is recorded
  - Test bill allocations are finalized
  - Test bill statuses update correctly
  - Test audit log creation

- **Void Operations**:
  - Test void_payment() with valid payment
  - Test void reverses allocations
  - Test bill statuses revert
  - Test cannot void reconciled payments
  - Test audit log for void

- **Allocation Management**:
  - Test allocate_to_bills() with valid bills
  - Test auto-allocation with no bills specified
  - Test allocation amount validations
  - Test partial allocations
  - Test reallocations

- **Reconciliation**:
  - Test reconcile_payment() marks payment reconciled
  - Test reconciliation date recorded
  - Test unreconcile_payment() reverts status
  - Test cannot modify reconciled payments

#### 4. Matching Algorithm Tests (test_matching.py)

##### Auto-Matching Tests
- **Exact Match Scenarios**:
  - Test matching payment to bill with exact amount
  - Test matching single payment to single bill
  - Test match scores for exact matches

- **Partial Match Scenarios**:
  - Test matching payment to multiple bills (split)
  - Test matching multiple payments to single bill
  - Test partial allocation calculations
  - Test match priority ordering

- **Match Scoring**:
  - Test reference number matching increases score
  - Test date proximity increases score
  - Test amount matching increases score
  - Test combined factor scoring

- **Match Filtering**:
  - Test vendor filtering (only bills from same vendor)
  - Test currency filtering (matching currencies)
  - Test status filtering (only unpaid/partial bills)
  - Test tenant filtering

- **Edge Cases**:
  - Test no matching bills found
  - Test all bills already paid
  - Test zero amount payments
  - Test currency mismatches
  - Test cross-tenant attempts

##### Manual Matching Tests
- **Manual Allocation**:
  - Test manually specifying bill allocations
  - Test allocation validations
  - Test partial manual allocations
  - Test combining manual and auto allocations

- **Validation Tests**:
  - Test cannot allocate more than payment amount
  - Test cannot allocate more than bill outstanding
  - Test allocation to non-existent bills rejected
  - Test allocation to different vendor rejected

#### 5. Payment Processing Tests (test_payment_processing.py)

##### End-to-End Payment Workflows
- **Simple Payment Flow**:
  - Create bill
  - Approve bill
  - Create payment
  - Process payment
  - Verify bill status updated to paid
  - Verify allocations created

- **Partial Payment Flow**:
  - Create bill with $1000 amount
  - Create payment with $400 amount
  - Process payment
  - Verify bill status = partially_paid
  - Verify outstanding = $600
  - Create second payment with $600
  - Verify bill status = paid

- **Multi-Bill Payment Flow**:
  - Create 3 bills with different amounts
  - Create single payment covering all
  - Auto-match bills
  - Process payment
  - Verify all bills marked paid
  - Verify allocations correct

- **Payment Reversal Flow**:
  - Create and process payment
  - Void payment
  - Verify bill status reverted
  - Verify allocations removed
  - Verify audit trail

##### Reconciliation Workflows
- **Bank Reconciliation**:
  - Create and process payment
  - Reconcile with bank statement
  - Verify reconciliation flag set
  - Test cannot modify reconciled payment
  - Unreconcile payment
  - Verify can now modify

##### Error Handling
- **Validation Failures**:
  - Test payment exceeding available funds (if limits)
  - Test invalid payment date
  - Test invalid vendor
  - Test allocation to paid bill
  - Test currency mismatches

- **Concurrency Tests**:
  - Test simultaneous payment processing
  - Test allocation race conditions
  - Test optimistic locking if implemented

#### 6. Bill API Tests (test_api_bills.py)

##### Authentication and Authorization
- **Authentication Tests**:
  - Test unauthenticated requests return 401
  - Test authenticated requests succeed
  - Test token-based authentication

- **Authorization Tests**:
  - Test user with permissions can access
  - Test user without permissions gets 403
  - Test tenant isolation (cannot access other tenant's bills)
  - Test role-based access control

##### CRUD Operations
- **List Bills**:
  - Test GET /api/vendor-bills/bills/ returns bill list
  - Test pagination works correctly
  - Test filtering by vendor
  - Test filtering by status
  - Test date range filtering
  - Test search functionality
  - Test ordering

- **Create Bill**:
  - Test POST /api/vendor-bills/bills/ creates bill
  - Test required fields validation
  - Test field value validation
  - Test successful response structure
  - Test audit log creation

- **Retrieve Bill**:
  - Test GET /api/vendor-bills/bills/{id}/ returns details
  - Test includes related data (vendor, payments)
  - Test 404 for non-existent bill
  - Test tenant isolation

- **Update Bill**:
  - Test PUT/PATCH updates bill
  - Test validation on update
  - Test restrictions on paid bills
  - Test audit log creation

- **Delete Bill**:
  - Test DELETE soft-deletes bill
  - Test restrictions on paid bills
  - Test cascade behavior

##### Custom Actions
- **Submit for Approval**:
  - Test POST /api/vendor-bills/bills/{id}/submit-for-approval/
  - Test status changes to pending
  - Test validation and error responses

- **Approve Bill**:
  - Test POST /api/vendor-bills/bills/{id}/approve/
  - Test status changes to approved
  - Test authorization requirement

- **Reject Bill**:
  - Test POST /api/vendor-bills/bills/{id}/reject/
  - Test requires rejection reason
  - Test status changes appropriately

- **Void Bill**:
  - Test POST /api/vendor-bills/bills/{id}/void/
  - Test void validation and restrictions

- **Bulk Actions**:
  - Test bulk approve
  - Test bulk void
  - Test error handling in bulk operations

#### 7. Payment API Tests (test_api_payments.py)

##### Authentication and Authorization
- **Authentication Tests**:
  - Test unauthenticated requests return 401
  - Test authenticated requests succeed

- **Authorization Tests**:
  - Test permissions for CRUD operations
  - Test permissions for processing
  - Test permissions for reconciliation
  - Test tenant isolation

##### CRUD Operations
- **List Payments**:
  - Test GET /api/vendor-bills/payments/ returns payment list
  - Test pagination
  - Test filtering by vendor, status, date
  - Test search
  - Test ordering

- **Create Payment**:
  - Test POST /api/vendor-bills/payments/ creates payment
  - Test with bill allocations
  - Test without allocations
  - Test validation errors
  - Test successful response includes allocations

- **Retrieve Payment**:
  - Test GET /api/vendor-bills/payments/{id}/ returns details
  - Test includes matched bills
  - Test includes vendor details

- **Update Payment**:
  - Test PUT/PATCH updates payment
  - Test restrictions on processed payments
  - Test reallocation on amount change

- **Delete Payment**:
  - Test DELETE removes payment
  - Test reverses allocations
  - Test restrictions on processed payments

##### Custom Actions
- **Process Payment**:
  - Test POST /api/vendor-bills/payments/{id}/process/
  - Test status updates
  - Test bill status updates
  - Test validation

- **Void Payment**:
  - Test POST /api/vendor-bills/payments/{id}/void/
  - Test reversals
  - Test requires reason

- **Reconcile Payment**:
  - Test POST /api/vendor-bills/payments/{id}/reconcile/
  - Test reconciliation flag set
  - Test reconciliation date recorded

- **Allocate to Bills**:
  - Test POST /api/vendor-bills/payments/{id}/allocate/
  - Test manual allocations
  - Test auto-match
  - Test allocation validations

- **Download Receipt**:
  - Test GET /api/vendor-bills/payments/{id}/download-receipt/
  - Test PDF generation
  - Test response format

- **Bulk Process**:
  - Test POST /api/vendor-bills/payments/bulk-process/
  - Test multiple payments processed
  - Test error handling

- **Reports**:
  - Test GET /api/vendor-bills/payments/report/
  - Test filtering and grouping
  - Test data accuracy

#### 8. Integration Tests

##### Complete Workflow Tests
- **Full Bill-to-Payment Flow**:
  - Create vendor
  - Create bill via API
  - Submit for approval via API
  - Approve bill via API
  - Create payment via API with allocation
  - Process payment via API
  - Verify bill status via API
  - Retrieve payment details via API
  - Verify allocation amounts

- **Reconciliation Workflow**:
  - Create and process multiple payments
  - Reconcile payments via API
  - Generate payment report
  - Verify reconciled payments included

##### Cross-Module Integration
- **Vendor Integration**:
  - Test bill creation with vendor from vendors module
  - Test payment to vendor
  - Test vendor balance updates if tracked

- **Currency Integration**:
  - Test multi-currency bills
  - Test multi-currency payments
  - Test currency conversion if supported

#### 9. Performance Tests

##### Query Optimization Tests
- **N+1 Query Prevention**:
  - Test list endpoints don't cause N+1 queries
  - Measure query count for list operations
  - Test prefetch and select_related effectiveness

- **Large Dataset Tests**:
  - Test pagination with 10,000+ bills
  - Test filtering performance
  - Test search performance with large datasets

##### Load Tests
- **Concurrent Operations**:
  - Test multiple concurrent bill creations
  - Test multiple concurrent payment processings
  - Test database locking behavior

#### 10. Test Infrastructure

##### Fixtures and Factories
- **Model Factories** (using factory_boy):
  - Create `VendorBillFactory`
  - Create `VendorPaymentFactory`
  - Create `VendorBillPaymentAllocationFactory`
  - Define realistic default values
  - Support trait variations

- **Fixture Data**:
  - Create vendors for testing
  - Create payment methods
  - Create currency data
  - Create user roles and permissions

##### Test Utilities
- **Helper Functions**:
  - `create_test_bill()` - Create bill with defaults
  - `create_test_payment()` - Create payment with defaults
  - `create_allocation()` - Create bill-payment allocation
  - `approve_bill()` - Shortcut for approval flow
  - `process_payment()` - Shortcut for payment processing

- **Assertion Helpers**:
  - `assert_bill_status()` - Check bill status with message
  - `assert_payment_processed()` - Verify payment processed
  - `assert_allocation_exists()` - Verify allocation created
  - `assert_audit_log_created()` - Verify audit entry

##### Test Configuration
- **pytest Configuration** (conftest.py):
  - Configure Django settings
  - Set up test database
  - Configure tenant for tests
  - Define session/module fixtures

- **Test Settings**:
  - Override settings for testing
  - Disable external integrations
  - Configure fast password hashers
  - Set debug flags

### Validation Criteria

#### Coverage Metrics
- [ ] Overall test coverage ≥ 90%
- [ ] Model test coverage = 100%
- [ ] Service test coverage ≥ 95%
- [ ] API test coverage ≥ 90%
- [ ] Critical paths have 100% coverage

#### Test Quality
- [ ] All tests pass consistently
- [ ] No flaky tests
- [ ] Tests are independent (can run in any order)
- [ ] Tests clean up after themselves
- [ ] Test names clearly describe what they test

#### Functionality Coverage
- [ ] All user workflows tested
- [ ] All edge cases covered
- [ ] All error conditions tested
- [ ] All validations tested
- [ ] All permissions tested
- [ ] All custom actions tested

#### Performance
- [ ] Test suite runs in < 2 minutes
- [ ] No unnecessary database queries in tests
- [ ] Fixtures load efficiently

### Testing Strategy

#### Test Execution
- Run full test suite: `python manage.py test apps.vendor_bills`
- Run specific test file: `python manage.py test apps.vendor_bills.tests.test_models`
- Run with coverage: `coverage run --source='apps/vendor_bills' manage.py test apps.vendor_bills`
- Generate coverage report: `coverage report` or `coverage html`

#### Continuous Integration
- Configure CI to run tests on every commit
- Require tests pass before merge
- Track coverage over time
- Run performance benchmarks

#### Test Maintenance
- Update tests when requirements change
- Refactor tests for clarity
- Remove obsolete tests
- Keep fixtures up to date

### Dependencies
- All previous tasks (models, services, matching, API)
- Testing frameworks: pytest, factory_boy, coverage

---

## Task 90: Module Documentation

### Objective
Create comprehensive documentation for the vendor bills and payments module, covering architecture, API reference, user guides, and development guidelines.

### Background
Complete module documentation ensures that developers, administrators, and end-users can effectively understand, use, and maintain the vendor bills and payments system. Documentation covers technical architecture, API usage, business processes, troubleshooting, and extension points.

### Requirements

#### 1. Documentation Structure

- **Documentation Organization**:
  ```
  docs/vendor_bills_payments/
  ├── README.md                      # Module overview
  ├── architecture.md                # Technical architecture
  ├── models.md                      # Data model documentation
  ├── api_reference.md               # API endpoint documentation
  ├── user_guide.md                  # User workflow guide
  ├── admin_guide.md                 # Administration guide
  ├── developer_guide.md             # Development and extension guide
  ├── testing_guide.md               # Testing documentation
  ├── troubleshooting.md             # Common issues and solutions
  ├── changelog.md                   # Version history
  └── examples/                      # Code examples
      ├── bill_creation.md
      ├── payment_processing.md
      ├── reconciliation.md
      └── custom_extensions.md
  ```

#### 2. Module Overview (README.md)

##### Introduction
- **Module Purpose**:
  - Overview of vendor bills and payments functionality
  - Key features and capabilities
  - Business value and use cases

- **Quick Start**:
  - Installation instructions
  - Basic configuration
  - First bill creation
  - First payment processing
  - 5-minute tutorial

##### Key Features
- **Bill Management**:
  - Bill creation and tracking
  - Multi-status workflow (draft, pending, approved, paid)
  - Bill approval process
  - Due date tracking and overdue alerts

- **Payment Processing**:
  - Payment creation and allocation
  - Auto-matching to bills
  - Multi-bill payment support
  - Payment processing and reconciliation

- **Financial Tracking**:
  - Outstanding balance calculation
  - Payment allocation tracking
  - Multi-currency support
  - Aging analysis

- **Reporting**:
  - Bill aging reports
  - Payment history
  - Vendor payment summaries
  - Reconciliation reports

##### Module Components
- List of key models: VendorBill, VendorPayment, VendorBillPaymentAllocation
- List of services: VendorBillService, VendorPaymentService, VendorBillPaymentMatching
- List of API endpoints: Bills, Payments
- List of background tasks if any

##### Prerequisites
- Django version requirements
- Database requirements (PostgreSQL with tenant support)
- Python dependencies
- Related module dependencies (vendors, currencies)

#### 3. Technical Architecture (architecture.md)

##### System Architecture
- **Module Structure**:
  - Overview of apps/vendor_bills structure
  - Layer separation (models, services, API)
  - Integration points with other modules

- **Design Patterns**:
  - Service layer pattern for business logic
  - Repository pattern for data access (if used)
  - Strategy pattern for matching algorithms
  - Observer pattern for notifications

- **Data Flow**:
  - Bill creation flow diagram
  - Payment processing flow diagram
  - Matching algorithm flow
  - Status transition flows

##### Multi-Tenancy Architecture
- **Tenant Isolation**:
  - How bills and payments are tenant-isolated
  - Tenant foreign key relationships
  - Query filtering mechanisms

- **Shared Resources**:
  - Payment methods (shared vs tenant-specific)
  - Currency handling across tenants

##### Database Design
- **Schema Overview**:
  - Entity-relationship diagram
  - Table descriptions
  - Index strategy
  - Constraint definitions

- **Optimization**:
  - Query optimization approaches
  - Caching strategy
  - Performance considerations

##### Security Architecture
- **Authentication**:
  - How authentication is enforced
  - Token management

- **Authorization**:
  - Permission model
  - Role-based access control
  - Tenant-based access control

- **Data Protection**:
  - Sensitive field handling
  - Audit logging
  - Data retention policies

#### 4. Data Model Documentation (models.md)

##### VendorBill Model
- **Field Reference**:
  - Table listing all fields with:
    - Field name
    - Data type
    - Description
    - Constraints (required, unique, default)
    - Validation rules

- **Relationships**:
  - Foreign keys to other models
  - Reverse relationships
  - Many-to-many relationships

- **Methods**:
  - Document all model methods
  - Parameters and return types
  - Usage examples

- **Status Workflow**:
  - Status state diagram
  - Valid status transitions
  - Business rules for each status

##### VendorPayment Model
- **Field Reference**: (same structure as VendorBill)
- **Relationships**: (same structure)
- **Methods**: (same structure)
- **Status Workflow**: (same structure)

##### VendorBillPaymentAllocation Model
- **Field Reference**: (same structure)
- **Purpose and Usage**: Explain allocation model
- **Constraints**: Document unique constraints and validations

##### Database Migrations
- **Migration History**:
  - List of migrations
  - Major schema changes
  - Migration dependencies

#### 5. API Reference Documentation (api_reference.md)

##### API Overview
- **Base URL**: `/api/vendor-bills/`
- **Authentication**: How to authenticate requests
- **Response Format**: Standard response structure
- **Error Handling**: Standard error format
- **Pagination**: How pagination works

##### Bill Endpoints

**List Bills**
- **Endpoint**: `GET /api/vendor-bills/bills/`
- **Description**: Retrieve paginated list of vendor bills
- **Authentication**: Required
- **Permissions**: Read bills permission
- **Query Parameters**:
  - Table of all query parameters with type, description, example
- **Response**:
  - Status code: 200 OK
  - Response body example (JSON)
  - Field descriptions
- **Example Request**:
  - cURL example
  - Python requests example
  - JavaScript fetch example

**Create Bill**
- **Endpoint**: `POST /api/vendor-bills/bills/`
- **Description**: Create new vendor bill
- **Authentication**: Required
- **Permissions**: Create bills permission
- **Request Body**:
  - JSON schema
  - Field descriptions
  - Required vs optional fields
- **Response**:
  - Status code: 201 Created
  - Response body example
- **Error Responses**:
  - 400 Bad Request - validation errors
  - 403 Forbidden - permission denied
- **Example Request**: (multiple language examples)

**Retrieve Bill**
- (Document structure similar to above for each endpoint)

**Update Bill**
- (Document structure)

**Delete Bill**
- (Document structure)

**Submit for Approval**
- (Document custom action)

**Approve Bill**
- (Document custom action)

**Reject Bill**
- (Document custom action)

**Void Bill**
- (Document custom action)

**Bulk Approve**
- (Document custom action)

##### Payment Endpoints

**List Payments**
- (Document similar to bill endpoints)

**Create Payment**
- (Document)

**Retrieve Payment**
- (Document)

**Update Payment**
- (Document)

**Delete Payment**
- (Document)

**Process Payment**
- (Document custom action)

**Void Payment**
- (Document custom action)

**Reconcile Payment**
- (Document custom action)

**Unreconcile Payment**
- (Document custom action)

**Allocate to Bills**
- (Document custom action)

**Download Receipt**
- (Document custom action)

**Bulk Process**
- (Document custom action)

**Payment Report**
- (Document custom action)

**Vendor Summary**
- (Document custom action)

##### Filtering and Search
- **Available Filters**: Document all filterset fields
- **Search Fields**: Document searchable fields
- **Ordering**: Document orderable fields
- **Examples**: Provide filtering examples

##### Webhooks and Notifications
- Document any webhook integrations
- List notification events
- Provide payload examples

#### 6. User Guide (user_guide.md)

##### Getting Started
- **Accessing the Module**: How to navigate to bills and payments
- **User Roles**: Explanation of roles (AP Clerk, AP Manager, Finance Manager)
- **Basic Concepts**: Explanation of bills, payments, allocations

##### Bill Management Workflows

**Creating a Bill**
- **Step-by-step Guide**:
  1. Navigate to bills section
  2. Click "Create New Bill"
  3. Fill in vendor information
  4. Enter bill details (invoice number, date, amount)
  5. Add line items if applicable
  6. Save as draft or submit for approval
- **Screenshots**: Include UI screenshots for each step
- **Tips and Best Practices**: Data entry tips

**Bill Approval Workflow**
- **Submitting for Approval**:
  - How to submit draft bill
  - What happens after submission
- **Approving Bills**:
  - Approval process for managers
  - Review checklist
  - How to approve or reject
- **Handling Rejections**:
  - What to do when bill is rejected
  - How to modify and resubmit

**Tracking Bills**
- **Viewing Bill List**: How to view and filter bills
- **Bill Status Meanings**: Explanation of each status
- **Overdue Bills**: How to identify and handle overdue bills
- **Bill Search**: How to search for specific bills

##### Payment Processing Workflows

**Creating a Payment**
- **Step-by-step Guide**:
  1. Navigate to payments section
  2. Click "Create New Payment"
  3. Select vendor
  4. Enter payment amount and method
  5. Allocate to bills (manual or auto-match)
  6. Review and save
- **Payment Methods**: Explanation of available methods
- **Payment Allocation**: How allocation works

**Processing Payments**
- **Processing Flow**: Steps to process a payment
- **Validation Checks**: What system validates
- **What Happens**: Effects of processing

**Payment Reconciliation**
- **Why Reconcile**: Importance of reconciliation
- **Reconciliation Process**: Step-by-step
- **Bank Statement Matching**: How to match with statements
- **Unreconciling**: When and how to unreconcile

##### Reporting and Analytics

**Bill Reports**
- **Aging Report**: How to generate and read aging report
- **Outstanding Bills**: How to view outstanding bills
- **Vendor Bill Summary**: How to get per-vendor summaries

**Payment Reports**
- **Payment History**: How to view payment history
- **Payment by Vendor**: Vendor-specific reports
- **Payment by Method**: Method-specific reports
- **Custom Date Ranges**: How to filter by dates

##### Common Tasks
- **Multi-Bill Payment**: How to pay multiple bills at once
- **Partial Payment**: How to make partial payments
- **Payment Void**: How and when to void payments
- **Bill Void**: How and when to void bills
- **Editing Bills**: What can be edited and when
- **Exporting Data**: How to export bills and payments

##### Tips and Best Practices
- **Data Entry Best Practices**: Tips for accurate data entry
- **Workflow Efficiency**: How to streamline common tasks
- **Error Prevention**: Common mistakes to avoid
- **Using Filters**: Efficient use of filters and search

#### 7. Administrator Guide (admin_guide.md)

##### Installation and Setup
- **Installation Steps**: How to install the module
- **Database Setup**: Migration instructions
- **Initial Configuration**: Settings to configure
- **Permission Setup**: How to configure permissions

##### Configuration

**Module Settings**
- **Available Settings**: List of all settings with descriptions
- **Default Values**: What the defaults are
- **Recommended Values**: Production recommendations

**Payment Methods**
- **Setting Up Payment Methods**: How to create payment methods
- **Method Configuration**: Options for each method

**Approval Workflows**
- **Configuring Approval Rules**: How to set approval thresholds
- **Multi-Level Approval**: Setting up approval chains
- **Approval Notifications**: Configuring alerts

##### User Management
- **Creating Users**: How to add users with bill/payment access
- **Assigning Roles**: How to assign AP roles
- **Permission Management**: Fine-grained permission control
- **User Groups**: Organizing users into groups

##### Maintenance Tasks

**Data Cleanup**
- **Archiving Old Bills**: How to archive or delete old bills
- **Purging Draft Bills**: Cleaning up abandoned drafts
- **Payment History**: Managing payment history

**Database Maintenance**
- **Running Migrations**: How to apply updates
- **Database Optimization**: Performance tuning
- **Backup Recommendations**: What to back up

##### Monitoring and Troubleshooting

**System Monitoring**
- **Key Metrics to Monitor**: Important metrics
- **Performance Indicators**: What to watch for
- **Log Locations**: Where to find logs

**Common Issues**
- **Payment Processing Failures**: Troubleshooting steps
- **Allocation Mismatches**: How to resolve
- **Reconciliation Issues**: Common problems and solutions

##### Security

**Access Control**
- **Permission Model**: Understanding permissions
- **Audit Logging**: What is logged
- **Compliance**: Regulatory considerations

**Data Protection**
- **Sensitive Data**: How sensitive data is protected
- **Encryption**: What is encrypted
- **Data Retention**: Retention policies

#### 8. Developer Guide (developer_guide.md)

##### Development Setup
- **Environment Setup**: Setting up dev environment
- **Dependencies**: Installing required packages
- **Database Setup**: Creating test database
- **Running Tests**: How to run test suite

##### Code Organization
- **Module Structure**: Overview of file organization
- **Naming Conventions**: Coding standards
- **Import Standards**: How to organize imports

##### Extending the Module

**Adding Custom Fields**
- **Model Extensions**: How to add fields to models
- **Migration Creation**: Creating migrations for custom fields
- **Serializer Updates**: Updating serializers
- **API Updates**: Exposing custom fields in API

**Custom Business Logic**
- **Extending Services**: How to override or extend service methods
- **Custom Validators**: Adding custom validation logic
- **Hooks and Signals**: Using Django signals for custom logic

**Custom Actions**
- **Adding ViewSet Actions**: How to add custom API actions
- **Action Decorators**: Using DRF decorators
- **Permission Checks**: Implementing action permissions

**Custom Matching Algorithms**
- **Matching Interface**: Interface to implement
- **Registering Algorithms**: How to register custom matchers
- **Algorithm Selection**: How matching algorithm is chosen

##### API Integration

**Calling APIs Programmatically**
- **Python Examples**: Using requests library
- **JavaScript Examples**: Using fetch API
- **Authentication**: Handling API authentication
- **Error Handling**: Handling API errors

**Webhooks**
- **Creating Webhooks**: How to set up webhooks
- **Webhook Payloads**: Payload structure
- **Security**: Webhook signature verification

##### Testing

**Writing Tests**
- **Test Structure**: How to organize tests
- **Using Fixtures**: Using test fixtures
- **Mocking**: Mocking external dependencies
- **Test Data**: Creating test data

**Running Tests**
- **Full Test Suite**: Running all tests
- **Specific Tests**: Running specific tests
- **Coverage Reports**: Generating coverage reports

##### Debugging

**Common Issues**
- **N+1 Queries**: How to identify and fix
- **Performance Problems**: Debugging slow queries
- **Test Failures**: Common test issues

**Debugging Tools**
- **Django Debug Toolbar**: Using debug toolbar
- **Logging**: Adding debug logging
- **Database Query Logging**: Logging queries

##### Contributing

**Code Standards**
- **PEP 8 Compliance**: Python coding standards
- **Docstring Format**: Documentation format
- **Type Hints**: Using type annotations

**Pull Request Process**
- **Creating PRs**: How to submit changes
- **Code Review**: Review process
- **Testing Requirements**: Test requirements for PRs

#### 9. Testing Guide (testing_guide.md)

##### Test Overview
- **Test Coverage**: Current coverage metrics
- **Test Organization**: How tests are organized
- **Test Types**: Unit, integration, API tests

##### Running Tests
- **Full Test Suite**: Command to run all tests
- **Specific Tests**: How to run specific test files or cases
- **With Coverage**: Running with coverage analysis
- **Continuous Integration**: How CI runs tests

##### Writing Tests

**Test Structure**
- **Test Case Organization**: How to structure test cases
- **Setup and Teardown**: Using setUp and tearDown
- **Fixtures**: Creating and using fixtures

**Model Tests**
- **Testing Models**: Best practices for model tests
- **Examples**: Example model test cases

**Service Tests**
- **Testing Services**: How to test service layer
- **Mocking**: Mocking dependencies
- **Examples**: Example service tests

**API Tests**
- **Testing API Endpoints**: How to test APIs
- **Authentication in Tests**: Handling auth in tests
- **Examples**: Example API tests

##### Test Data
- **Factories**: Using factory_boy for test data
- **Fixtures**: JSON fixtures for test data
- **Helper Functions**: Utility functions for creating test data

##### Performance Testing
- **Load Tests**: Running load tests
- **Query Counting**: Measuring query performance
- **Benchmarks**: Performance benchmarks

#### 10. Troubleshooting Guide (troubleshooting.md)

##### Common Issues

**Bill Creation Issues**
- **Issue**: "Vendor not found" error
  - **Cause**: Invalid vendor ID or vendor from different tenant
  - **Solution**: Verify vendor exists and belongs to current tenant

- **Issue**: "Amount validation failed"
  - **Cause**: Negative or zero amount
  - **Solution**: Ensure amount is positive

- **Issue**: "Cannot create bill in paid status"
  - **Cause**: Attempting to create bill with invalid initial status
  - **Solution**: Create as draft or pending, then transition

**Payment Processing Issues**
- **Issue**: "Payment processing failed"
  - **Cause**: Multiple possible causes
  - **Solution**: Check logs, verify bill statuses, check allocations

- **Issue**: "Allocation exceeds bill amount"
  - **Cause**: Allocated amount > bill outstanding
  - **Solution**: Verify bill outstanding amount, adjust allocation

- **Issue**: "Cannot process reconciled payment"
  - **Cause**: Attempting to modify reconciled payment
  - **Solution**: Unreconcile first, then modify

**Matching Issues**
- **Issue**: "Auto-match found no bills"
  - **Cause**: No unpaid bills for vendor
  - **Solution**: Verify bills exist and are approved

- **Issue**: "Currency mismatch in matching"
  - **Cause**: Payment and bill currencies don't match
  - **Solution**: Ensure currency consistency or add conversion

**API Issues**
- **Issue**: "401 Unauthorized"
  - **Cause**: Missing or invalid authentication token
  - **Solution**: Include valid token in Authorization header

- **Issue**: "403 Forbidden"
  - **Cause**: Insufficient permissions
  - **Solution**: Verify user has required permissions

- **Issue**: "Slow API response"
  - **Cause**: N+1 queries or large dataset
  - **Solution**: Check query optimization, add pagination

##### Error Messages Reference
- **Validation Errors**: List of validation error codes and meanings
- **Business Logic Errors**: List of business rule errors
- **System Errors**: List of system-level errors

##### Performance Issues

**Slow Queries**
- **Symptoms**: Slow API responses, database timeouts
- **Diagnosis**: Use Django Debug Toolbar, check database logs
- **Solutions**: Add indexes, optimize queries, add caching

**High Memory Usage**
- **Symptoms**: Server memory exhaustion
- **Diagnosis**: Profile query execution
- **Solutions**: Add pagination, limit queryset size, use iterator()

##### Data Integrity Issues

**Missing Allocations**
- **Symptoms**: Payments show as unallocated but bills show as paid
- **Diagnosis**: Check allocation table for orphaned records
- **Solutions**: Run data integrity check, recreate allocations

**Incorrect Outstanding Amounts**
- **Symptoms**: Bill outstanding amount doesn't match actual
- **Diagnosis**: Compare calculated vs stored amounts
- **Solutions**: Recalculate outstanding amounts, check allocation sums

##### Getting Help
- **Support Channels**: Where to get help
- **Bug Reports**: How to report bugs
- **Feature Requests**: How to request features

#### 11. Changelog (changelog.md)

##### Version History
- **v1.0.0** (Initial Release):
  - Initial vendor bills and payments functionality
  - Bill CRUD operations
  - Payment processing and allocation
  - Auto-matching algorithm
  - REST API endpoints
  - Multi-tenancy support

- **v1.1.0** (Future):
  - Planned enhancements
  - Bug fixes
  - Performance improvements

##### Migration Guides
- **Upgrading from v1.0.0 to v1.1.0**: Step-by-step upgrade guide

#### 12. Code Examples (examples/)

##### Bill Creation Example (bill_creation.md)
- **Basic Bill Creation**: Simple example
- **Bill with Line Items**: More complex example
- **Bulk Bill Creation**: Batch creation example
- **Error Handling**: Handling creation errors

##### Payment Processing Example (payment_processing.md)
- **Simple Payment**: Single bill payment
- **Multi-Bill Payment**: Payment allocated to multiple bills
- **Partial Payment**: Partial payment example
- **Payment with Auto-Match**: Using auto-matching

##### Reconciliation Example (reconciliation.md)
- **Bank Reconciliation**: Step-by-step reconciliation
- **Bulk Reconciliation**: Reconciling multiple payments
- **Unreconciliation**: Unreconciling example

##### Custom Extension Example (custom_extensions.md)
- **Adding Custom Field**: Adding custom field to model
- **Custom Validator**: Implementing custom validation
- **Custom Action**: Adding custom API action
- **Custom Matcher**: Implementing custom matching algorithm

### Validation Criteria

#### Documentation Completeness
- [ ] All models documented with all fields
- [ ] All API endpoints documented
- [ ] All custom actions documented
- [ ] All user workflows documented
- [ ] All configuration options documented
- [ ] All error messages documented

#### Documentation Quality
- [ ] Clear and concise writing
- [ ] Accurate information
- [ ] Up-to-date with current code
- [ ] Proper formatting and structure
- [ ] Working code examples
- [ ] Useful diagrams and screenshots

#### Documentation Accessibility
- [ ] Easy to navigate
- [ ] Good search/index
- [ ] Appropriate for target audience
- [ ] Available in multiple formats (web, PDF)
- [ ] Mobile-friendly

#### Example Quality
- [ ] All examples tested and working
- [ ] Examples cover common use cases
- [ ] Examples include error handling
- [ ] Examples are well-commented

### Documentation Maintenance

#### Update Process
- **When to Update**:
  - After any code changes
  - When adding new features
  - When fixing bugs
  - When receiving user feedback

- **Review Process**:
  - Technical review by developers
  - User review by end-users
  - Regular documentation audits

#### Documentation Tools
- **Generation Tools**:
  - Use Sphinx or MkDocs for documentation generation
  - Auto-generate API docs from code
  - Use docstrings for inline documentation

- **Version Control**:
  - Keep documentation in version control
  - Tag documentation versions
  - Maintain changelog

### Dependencies
- All previous tasks in the subphase (complete module implementation)

---

## Summary

Tasks 87-90 complete the Vendor Bills & Payments SubPhase by:

1. **Task 87 - VendorPaymentViewSet**: Implements comprehensive REST API for payment management with CRUD operations, custom actions for processing/voiding/reconciliation, and reporting functionality.

2. **Task 88 - Register Payment URLs**: Configures URL routing for payment endpoints, integrating them into the vendor bills API structure with proper namespacing and RESTful design.

3. **Task 89 - Comprehensive Tests**: Creates a complete test suite covering models, services, matching algorithms, payment processing, and API endpoints with high coverage targets and performance testing.

4. **Task 90 - Module Documentation**: Produces comprehensive documentation including technical architecture, API reference, user guides, administrator guides, developer guides, testing guides, troubleshooting, and code examples.

These final tasks ensure the vendor bills and payments module is production-ready with a complete API layer, robust testing, and thorough documentation for all stakeholders.

---

## Navigation
- **Parent**: [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous**: [01_Tasks-83-86_Bill-ViewSet-URLs-Tests.md](./01_Tasks-83-86_Bill-ViewSet-URLs-Tests.md)
- **Next**: None
