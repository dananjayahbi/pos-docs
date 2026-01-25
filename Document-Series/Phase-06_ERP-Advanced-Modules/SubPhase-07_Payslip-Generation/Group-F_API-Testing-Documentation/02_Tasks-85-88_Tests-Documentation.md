# Tasks 85-88: Testing and API Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** F - API, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-84_Admin-API.md](01_Tasks-79-84_Admin-API.md)

---

## Document Overview

This document covers the comprehensive testing strategy for the payslip generation system and the creation of detailed API documentation. Testing includes unit tests for models, integration tests for PDF generation, mocked tests for email distribution, and API endpoint testing. The documentation task establishes OpenAPI/Swagger specifications for all payslip endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Write Payslip Model Tests | High | 35 min |
| 86 | Write PDF Generation Tests | High | 35 min |
| 87 | Write Email Distribution Tests | Medium | 30 min |
| 88 | Create Payslip API Documentation | Medium | 30 min |

---

## Task 85: Write Payslip Model Tests

### Overview
Implement comprehensive unit tests for the Payslip model and related models (PayslipLineItem, PayslipBatch). These tests validate model constraints, validation logic, computed properties, methods, and database integrity. Unit tests ensure that model behavior is correct in isolation before integration testing.

### Dependencies
- Payslip model (Task 01)
- PayslipLineItem model (Task 17)
- PayslipBatch model (Task 22)
- pytest and pytest-django installed
- Factory pattern libraries (factory_boy recommended)

### Instructions

1. **Create test module structure**
   - Navigate to `apps/payslip/tests/` directory
   - Create `test_models.py` file
   - Add module docstring explaining test coverage
   - Import pytest, Django test utilities, and models

2. **Set up test fixtures and factories**
   - Use pytest fixtures for reusable test data
   - Create factory classes using factory_boy for model instances
   - Define PayslipFactory for creating test payslips
   - Define PayslipLineItemFactory for line items
   - Define PayslipBatchFactory for batch operations
   - Factories should handle required relationships (tenant, employee, period)

3. **Design fixture scope strategy**
   - Use function-scoped fixtures for most tests (default)
   - Use class-scoped fixtures for expensive setup (database schemas)
   - Use session-scoped fixtures for tenant setup in multi-tenant context
   - Ensure proper cleanup with yield fixtures
   - Leverage pytest's fixture dependency injection

4. **Test data setup patterns**
   - Create base fixture for authenticated tenant context
   - Create fixture for test employee with valid configuration
   - Create fixture for test payroll period
   - Create fixture for payslip with all required relationships
   - Use SubFactory pattern for nested relationships
   - Avoid hardcoded values; use Faker for realistic data

5. **Test model field constraints**
   - Test required fields raise validation errors when missing
   - Test unique constraints (payslip_number per tenant)
   - Test foreign key constraints and cascade behavior
   - Test field max_length constraints
   - Test choice field validation (status, payment_method)
   - Test decimal field precision and scale
   - Test date field validation and ordering

6. **Test model validation logic**
   - Test custom clean methods
   - Test cross-field validation (e.g., gross_pay vs. net_pay consistency)
   - Test status transition validation (draft → approved → paid)
   - Test period validation (payslip dates within period)
   - Test negative value validation (no negative amounts)
   - Test employee-period uniqueness validation
   - Use pytest.raises for expected validation errors

7. **Test computed properties**
   - Test total_earnings calculation from line items
   - Test total_deductions calculation from line items
   - Test net_pay calculation (gross - deductions + additions)
   - Test tax_amount computation from line items
   - Test is_finalized property based on status
   - Test is_editable property based on status and approval
   - Verify computed values match manual calculations

8. **Test model methods**
   - Test generate_payslip_number method
   - Test approve method (status change, approval timestamp)
   - Test finalize method (status change, finalization logic)
   - Test void method (status change, reversal handling)
   - Test recalculate method (recalculates line items and totals)
   - Test clone method (creates copy for adjustments)
   - Test get_pdf_filename method (consistent naming)

9. **Test line item aggregation**
   - Test line items are correctly associated with payslip
   - Test ordering of line items (display_order field)
   - Test filtering line items by type (earning, deduction, tax)
   - Test summing line items by category
   - Test cascade deletion (payslip deleted → line items deleted)
   - Test orphaned line items are not allowed

10. **Test batch relationship**
    - Test payslip belongs to correct batch
    - Test batch statistics (total count, completed count)
    - Test batch status calculation from member payslips
    - Test batch filtering by status
    - Test batch completion detection
    - Test batch failure handling

11. **Test database integrity**
    - Test atomic transactions (all-or-nothing saves)
    - Test concurrent modification handling
    - Test database-level constraints (check constraints)
    - Test triggers if any are defined
    - Test default values are applied
    - Test auto-generated fields (UUIDs, timestamps)

12. **Test tenant isolation**
    - Test payslips are filtered by tenant
    - Test cross-tenant access is prevented
    - Test payslip_number uniqueness is per-tenant
    - Test employee relationships respect tenant boundaries
    - Test queryset filtering includes tenant context
    - Use multi-tenant test fixtures

13. **Test edge cases**
    - Test payslip with zero net pay
    - Test payslip with only deductions (no earnings)
    - Test payslip with fractional currency amounts
    - Test payslip with maximum decimal values
    - Test payslip with null optional fields
    - Test payslip with very long notes/descriptions
    - Test payslip generation on period boundaries

14. **Test data integrity constraints**
    - Test referential integrity (employee exists, period exists)
    - Test data consistency after updates
    - Test cascade behavior on related model deletion
    - Test soft delete behavior if implemented
    - Test audit trail creation on changes
    - Test version tracking if implemented

15. **Organize test classes**
    - Group tests by model (TestPayslipModel, TestPayslipLineItemModel)
    - Group tests by functionality (TestValidation, TestCalculations)
    - Use descriptive test method names (test_payslip_number_uniqueness_per_tenant)
    - Add docstrings to complex tests
    - Use parametrize for testing multiple scenarios
    - Keep tests independent and idempotent

### Testing Strategy

| Test Category | Approach | Tools |
|---------------|----------|-------|
| Field Constraints | Attempt invalid data, assert ValidationError | pytest, Django ORM |
| Validation Logic | Call clean(), assert errors | Django validation |
| Computations | Create instances, assert calculations | Direct assertion |
| Methods | Call method, verify state changes | Mock if needed |
| Relationships | Create related objects, verify associations | ORM queries |
| Transactions | Use TransactionTestCase for atomicity | Django test utils |
| Concurrency | Use threading or celery tasks | Threading, Mock |
| Performance | Use pytest-benchmark for timing | pytest-benchmark |

### Test Data Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| Factory Pattern | Create test instances | factory_boy |
| Fixture Pattern | Reusable test data | pytest fixtures |
| Builder Pattern | Complex object construction | Custom builder classes |
| Fake Data | Realistic test data | Faker library |
| Minimal Data | Fast test execution | Bare minimum fields |
| Edge Case Data | Boundary testing | Explicit edge values |

### Expected Test Coverage

| Component | Target Coverage |
|-----------|----------------|
| Model fields | 100% |
| Validation methods | 100% |
| Computed properties | 100% |
| Model methods | 95%+ |
| Edge cases | Key scenarios covered |
| Error paths | All validation errors tested |

### Verification Checklist
- [ ] `tests/test_models.py` file created
- [ ] Test fixtures defined using pytest fixtures
- [ ] Factory classes created for all models
- [ ] All model fields tested for constraints
- [ ] All validation logic tested
- [ ] All computed properties tested
- [ ] All model methods tested
- [ ] Line item relationships tested
- [ ] Batch relationships tested
- [ ] Tenant isolation tested
- [ ] Edge cases covered
- [ ] Tests pass independently and together
- [ ] Test coverage report generated
- [ ] Tests run in under 2 seconds for fast feedback

---

## Task 86: Write PDF Generation Tests

### Overview
Implement integration tests for the PDF generation system, validating that PayslipPDFGenerator correctly creates PDF documents with proper formatting, data accuracy, and error handling. These tests ensure PDF output quality, template rendering, and WeasyPrint integration work correctly.

### Dependencies
- PayslipPDFGenerator service (Task 31)
- Payslip template models (Task 32-37)
- WeasyPrint library installed
- Test payslip data (from Task 85 fixtures)
- File system access for temporary PDFs

### Instructions

1. **Create PDF generation test module**
   - Navigate to `apps/payslip/tests/` directory
   - Create `test_generator.py` file
   - Add module docstring explaining PDF test coverage
   - Import PayslipPDFGenerator, models, pytest, and PDF libraries

2. **Set up test fixtures for PDF generation**
   - Create fixture for template configuration
   - Create fixture for payslip with complete data
   - Create fixture for payslip with line items
   - Create fixture for template with custom branding
   - Use temporary directory for PDF output during tests
   - Clean up generated files after tests

3. **Configure test environment**
   - Set up Django settings for test mode
   - Configure media root to temporary directory
   - Set up WeasyPrint test configuration
   - Mock or disable external font loading if needed
   - Configure timezone for consistent date rendering
   - Set up logging to capture generation errors

4. **Test basic PDF generation**
   - Test generator creates PDF file
   - Test generated file exists at expected path
   - Test PDF file has non-zero size
   - Test PDF is valid format (can be opened)
   - Test PDF metadata (creator, creation date)
   - Test PDF page count matches expectations
   - Use PyPDF2 or similar library to validate structure

5. **Test PDF content accuracy**
   - Test payslip number appears in PDF
   - Test employee name and ID are correct
   - Test period dates are rendered correctly
   - Test all line items are present in PDF
   - Test amounts are formatted correctly (currency, decimals)
   - Test totals match model calculations
   - Extract text from PDF using pdfplumber or PyPDF2

6. **Test template rendering**
   - Test header section renders correctly
   - Test company logo appears if configured
   - Test footer text is present
   - Test custom fields render when set
   - Test conditional sections (e.g., show deductions only if present)
   - Test multi-page PDFs for large payslips
   - Test page breaks are appropriate

7. **Test data formatting**
   - Test currency formatting (e.g., $1,234.56)
   - Test date formatting (e.g., January 15, 2026)
   - Test percentage formatting (e.g., 12.5%)
   - Test hour formatting for time worked
   - Test alignment of numerical columns
   - Test text truncation for long descriptions
   - Test handling of special characters

8. **Test template customization**
   - Test different paper sizes (A4, Letter, A5)
   - Test different header configurations
   - Test custom color schemes
   - Test custom fonts (if supported)
   - Test logo positioning and sizing
   - Test watermark application
   - Test different footer configurations

9. **Test edge cases**
   - Test payslip with no line items (minimal payslip)
   - Test payslip with many line items (pagination)
   - Test payslip with very long employee name
   - Test payslip with special characters in names
   - Test payslip with zero amounts
   - Test payslip with negative adjustments
   - Test payslip with all optional fields empty

10. **Test error handling**
    - Test generation with missing template (should use default)
    - Test generation with invalid template configuration
    - Test generation with missing logo file
    - Test generation with invalid image formats
    - Test generation with corrupted template data
    - Test WeasyPrint errors are caught and logged
    - Assert appropriate exceptions are raised

11. **Test performance**
    - Test generation completes within time limit (e.g., 5 seconds)
    - Test batch generation performance
    - Test memory usage stays within bounds
    - Test concurrent generation handling
    - Use pytest-benchmark for performance regression testing
    - Test cleanup of temporary files

12. **Mock external dependencies**
    - Mock file storage system for cloud storage tests
    - Mock WeasyPrint for unit test isolation (optional)
    - Mock font loading for faster tests
    - Mock network requests if external resources needed
    - Use unittest.mock or pytest-mock
    - Verify mock interactions

13. **Test file storage integration**
    - Test PDF saved to correct storage backend (local, S3)
    - Test file path construction
    - Test file permissions are correct
    - Test file overwrite behavior
    - Test file cleanup on regeneration
    - Test storage error handling (disk full, permissions)

14. **Test batch PDF generation**
    - Test multiple PDFs generated in sequence
    - Test batch generation maintains quality
    - Test batch progress tracking
    - Test batch error recovery (one failure doesn't stop batch)
    - Test batch cleanup on completion
    - Test batch cancellation handling

15. **Validate PDF accessibility**
    - Test PDF has proper document structure
    - Test PDF is searchable (text not as images)
    - Test PDF can be printed correctly
    - Test PDF renders consistently across viewers
    - Test PDF file size is reasonable
    - Test PDF compression if implemented

### Testing Strategy

| Test Category | Approach | Tools |
|---------------|----------|-------|
| PDF Creation | Generate PDF, verify file exists | os.path, pytest |
| Content Validation | Extract text, compare with source | pdfplumber, PyPDF2 |
| Template Rendering | Visual inspection or snapshot testing | pytest-snapshot |
| Data Accuracy | Parse PDF, assert values | Custom parsers |
| Error Handling | Trigger errors, assert exceptions | pytest.raises |
| Performance | Time generation, assert limits | pytest-benchmark |
| Storage | Mock storage, verify calls | unittest.mock |
| Integration | End-to-end generation flow | Full stack test |

### Mock Dependencies

| Dependency | Mock Strategy | Reason |
|------------|---------------|--------|
| File Storage | Mock storage backend | Avoid actual file I/O in unit tests |
| WeasyPrint | Optional mock for unit tests | Speed up isolated tests |
| Image Loading | Mock or use test images | Avoid external dependencies |
| Font Loading | Use system fonts | Avoid font download |
| Network Requests | Mock all external calls | Prevent external dependencies |

### Test Data Requirements

| Data Type | Requirements |
|-----------|-------------|
| Payslip | Complete with all fields, multiple line items |
| Template | Valid configuration, test logo image |
| Employee | Realistic name, ID, department |
| Period | Valid date range, fiscal year |
| Line Items | Various types (earnings, deductions, taxes) |
| Amounts | Edge cases (zero, negative, large, decimal) |

### Expected Test Coverage

| Component | Target Coverage |
|-----------|----------------|
| Generator class | 90%+ |
| Template rendering | 85%+ |
| Error handlers | 100% |
| Data formatters | 95%+ |
| Storage integration | 90%+ |
| Edge cases | Key scenarios covered |

### Verification Checklist
- [ ] `tests/test_generator.py` file created
- [ ] Test fixtures for PDF generation defined
- [ ] Temporary directory setup for test PDFs
- [ ] Basic PDF generation tested
- [ ] PDF content accuracy validated
- [ ] Template rendering tested
- [ ] Data formatting verified
- [ ] Template customization options tested
- [ ] Edge cases covered (empty, large, special chars)
- [ ] Error handling tested
- [ ] Performance benchmarks established
- [ ] External dependencies mocked appropriately
- [ ] File storage integration tested
- [ ] Batch generation tested
- [ ] PDF quality validated
- [ ] Test cleanup verified (no leftover files)

---

## Task 87: Write Email Distribution Tests

### Overview
Implement comprehensive tests for the email distribution system, validating that PayslipEmailer correctly sends emails with PDF attachments, handles errors gracefully, respects throttling limits, and integrates with SMTP backends. These tests use mocking to avoid sending actual emails during test execution.

### Dependencies
- PayslipEmailer service (Task 66)
- Email templates (Task 67-68)
- Payslip PDF files (from Task 86 fixtures)
- Email backend configured
- Mock library for SMTP mocking

### Instructions

1. **Create email distribution test module**
   - Navigate to `apps/payslip/tests/` directory
   - Create `test_emailer.py` file
   - Add module docstring explaining email test coverage
   - Import PayslipEmailer, email utilities, pytest, and mock libraries

2. **Set up email test configuration**
   - Configure Django test email backend (console or memory)
   - Set `EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'` for tests
   - Clear email outbox before each test
   - Create fixtures for email configuration
   - Mock SMTP connection for unit tests
   - Set up test email templates

3. **Create test fixtures for email testing**
   - Create fixture for payslip with generated PDF
   - Create fixture for employee with valid email
   - Create fixture for email template configuration
   - Create fixture for SMTP settings
   - Create fixture for email distribution batch
   - Use temporary files for PDF attachments

4. **Mock SMTP backend**
   - Use unittest.mock to mock smtplib.SMTP
   - Mock SMTP connection, login, and send methods
   - Track mock call counts and arguments
   - Simulate SMTP connection success and failure
   - Mock SMTP authentication
   - Mock SMTP send_message method

5. **Test basic email sending**
   - Test email is created with correct recipient
   - Test email has correct subject
   - Test email has correct body content
   - Test email has correct sender (from address)
   - Test email includes PDF attachment
   - Test email is added to outbox (locmem backend)
   - Verify email count in outbox

6. **Test email content**
   - Test email body includes employee name
   - Test email body includes payslip number
   - Test email body includes period information
   - Test email body has clickable links (if any)
   - Test email uses correct template
   - Test email has proper formatting (HTML or plain text)
   - Test personalization variables are replaced

7. **Test PDF attachment**
   - Test attachment is included in email
   - Test attachment has correct filename
   - Test attachment has correct MIME type (application/pdf)
   - Test attachment content matches generated PDF
   - Test attachment size is reasonable
   - Test multiple attachments if supported
   - Test attachment encoding (base64)

8. **Test email template rendering**
   - Test subject line template rendering
   - Test body template rendering with context
   - Test HTML email template rendering
   - Test plain text fallback
   - Test template variables are replaced
   - Test missing variables are handled gracefully
   - Test template inheritance and includes

9. **Test error handling**
   - Test handling of invalid email addresses
   - Test handling of missing PDF files
   - Test handling of SMTP connection failures
   - Test handling of SMTP authentication failures
   - Test handling of SMTP send failures
   - Test handling of attachment errors
   - Test appropriate exceptions are raised or logged

10. **Test retry logic**
    - Test failed emails are retried
    - Test retry count is tracked
    - Test exponential backoff for retries
    - Test max retry limit is respected
    - Test retry state is persisted
    - Test successful retry updates status
    - Test permanent failures are marked

11. **Test throttling and rate limiting**
    - Test email sending respects rate limits
    - Test delay between emails is enforced
    - Test batch sending stays within limits
    - Test throttling can be configured
    - Test throttling is per-tenant or global
    - Test priority emails bypass throttling (if supported)
    - Mock time.sleep for faster tests

12. **Test batch email sending**
    - Test multiple emails are sent in batch
    - Test batch progress is tracked
    - Test batch errors don't stop remaining sends
    - Test batch status is updated correctly
    - Test batch completion notification
    - Test batch partial success handling
    - Test batch cancellation

13. **Test email status tracking**
    - Test email status changes from PENDING to SENT
    - Test failed emails marked as FAILED
    - Test sent timestamp is recorded
    - Test error messages are stored
    - Test retry count is incremented
    - Test delivery confirmation (if supported)
    - Test bounce handling (if implemented)

14. **Test employee email validation**
    - Test employees without email are skipped
    - Test invalid email addresses are rejected
    - Test duplicate emails are handled
    - Test opt-out employees are skipped
    - Test inactive employees are skipped
    - Test validation errors are logged
    - Test validation doesn't crash batch process

15. **Test security and privacy**
    - Test emails are sent to correct recipients only
    - Test BCC is used for bulk sends (if configured)
    - Test employee data is not leaked in headers
    - Test SMTP credentials are not logged
    - Test PDF attachments are secured
    - Test tenant isolation in email sending
    - Test email logs don't contain sensitive data

16. **Test integration with celery tasks**
    - Test send_email task can be called
    - Test task executes email sending
    - Test task handles failures gracefully
    - Test task retry logic works
    - Mock celery task execution for unit tests
    - Test task result is returned correctly
    - Test task logging and monitoring

17. **Test configuration options**
    - Test different email backends (console, SMTP, file)
    - Test custom SMTP settings
    - Test TLS/SSL configuration
    - Test email timeout settings
    - Test custom templates per tenant
    - Test from address customization
    - Test reply-to address configuration

### Testing Strategy

| Test Category | Approach | Tools |
|---------------|----------|-------|
| Email Creation | Use locmem backend, inspect outbox | django.core.mail |
| Content Validation | Parse email, assert fields | email.parser |
| Attachment Testing | Extract attachment, verify content | email library |
| SMTP Mocking | Mock smtplib, verify calls | unittest.mock |
| Error Handling | Trigger failures, assert behavior | pytest.raises |
| Retry Logic | Mock failures, verify retries | Mock + assertions |
| Throttling | Mock time, verify delays | Mock time.sleep |
| Batch Sending | Send multiple, track progress | Custom tracking |
| Integration | Use test Celery setup | celery test utils |

### Mock Dependencies

| Dependency | Mock Strategy | Reason |
|------------|---------------|--------|
| SMTP Connection | Mock smtplib.SMTP class | Avoid real email sending |
| SMTP Authentication | Mock login method | Avoid real credentials |
| SMTP Send | Mock send_message | Track sends, avoid network |
| PDF File | Use test PDF or mock file | Avoid file system dependencies |
| Celery Tasks | Mock apply_async | Avoid task queue in tests |
| Time | Mock time.sleep | Speed up throttling tests |
| Email Backend | Use locmem or mock backend | Capture emails without sending |

### Test Data Requirements

| Data Type | Requirements |
|-----------|-------------|
| Payslip | With generated PDF, valid employee |
| Employee | Valid email address, active status |
| Email Template | Subject and body templates |
| PDF Attachment | Small test PDF file |
| SMTP Settings | Test credentials, server |
| Batch Data | Multiple payslips and employees |

### Expected Test Coverage

| Component | Target Coverage |
|-----------|----------------|
| Emailer class | 90%+ |
| Email creation | 95%+ |
| Attachment handling | 95%+ |
| Error handlers | 100% |
| Retry logic | 100% |
| Throttling | 90%+ |
| Batch sending | 90%+ |
| Status tracking | 95%+ |

### Verification Checklist
- [ ] `tests/test_emailer.py` file created
- [ ] Email test configuration set up (locmem backend)
- [ ] Test fixtures for email testing created
- [ ] SMTP backend mocked appropriately
- [ ] Basic email sending tested
- [ ] Email content validated
- [ ] PDF attachment verified
- [ ] Email templates tested
- [ ] Error handling tested (connection, auth, send failures)
- [ ] Retry logic tested with various failure scenarios
- [ ] Throttling and rate limiting tested
- [ ] Batch email sending tested
- [ ] Email status tracking verified
- [ ] Employee email validation tested
- [ ] Security and privacy checks implemented
- [ ] Celery task integration tested
- [ ] Configuration options tested
- [ ] No actual emails sent during tests
- [ ] Test cleanup verified (clear outbox)

---

## Task 88: Create Payslip API Documentation

### Overview
Create comprehensive API documentation for all payslip endpoints using OpenAPI/Swagger specifications. This documentation serves as a contract between frontend and backend, enables auto-generated client libraries, and provides an interactive API explorer for developers and administrators.

### Dependencies
- All payslip ViewSets and endpoints (Tasks 43-84)
- Django REST Framework installed
- drf-yasg or drf-spectacular for OpenAPI generation
- Markdown documentation files

### Instructions

1. **Choose OpenAPI documentation tool**
   - Evaluate drf-yasg vs. drf-spectacular
   - drf-spectacular is recommended (modern, maintained, OpenAPI 3.0)
   - Install chosen library via pip
   - Add to Django INSTALLED_APPS
   - Configure base settings in Django settings

2. **Configure OpenAPI settings**
   - Set API title: "ERP Payslip Management API"
   - Set API version: "1.0.0"
   - Set API description with key features
   - Configure authentication schemes (Token, JWT, Session)
   - Set contact information and license
   - Configure server URLs (development, staging, production)
   - Set terms of service URL if applicable

3. **Generate base OpenAPI schema**
   - Run management command to generate schema
   - Output schema to `docs/openapi.yaml` or `docs/openapi.json`
   - Verify schema is valid OpenAPI 3.0 spec
   - Use online validators (Swagger Editor) to check
   - Commit schema to version control
   - Set up automatic regeneration on schema changes

4. **Add endpoint descriptions**
   - Add docstrings to all ViewSet classes
   - Add docstrings to all custom actions
   - Use drf-spectacular's schema decorators
   - Document expected behavior for each endpoint
   - Include permission requirements in docstrings
   - Document filtering, search, and ordering options
   - Explain pagination behavior

5. **Document employee endpoints**
   - Document GET /api/v1/payslip/employee/my-payslips/ (list employee's payslips)
   - Document GET /api/v1/payslip/employee/my-payslips/{id}/ (retrieve detail)
   - Document GET /api/v1/payslip/employee/download/{id}/ (download PDF)
   - Include query parameter descriptions (period, year, status)
   - Document response schemas with examples
   - Document error responses (401, 403, 404)
   - Add request/response examples

6. **Document admin endpoints**
   - Document GET /api/v1/payslip/admin/payslips/ (list all payslips)
   - Document POST /api/v1/payslip/admin/payslips/ (create payslip)
   - Document GET /api/v1/payslip/admin/payslips/{id}/ (retrieve detail)
   - Document PUT /api/v1/payslip/admin/payslips/{id}/ (update payslip)
   - Document PATCH /api/v1/payslip/admin/payslips/{id}/ (partial update)
   - Document DELETE /api/v1/payslip/admin/payslips/{id}/ (delete payslip)
   - Include all custom actions (generate, send, approve)

7. **Document custom actions**
   - Document POST /api/v1/payslip/admin/payslips/{id}/generate/ (generate PDF)
   - Document POST /api/v1/payslip/admin/payslips/{id}/send/ (send email)
   - Document POST /api/v1/payslip/admin/payslips/{id}/approve/ (approve payslip)
   - Document POST /api/v1/payslip/admin/generate-bulk/ (bulk generate)
   - Document POST /api/v1/payslip/admin/send-bulk/ (bulk send)
   - Document GET /api/v1/payslip/admin/batches/{id}/status/ (batch progress)
   - Include expected request payloads and responses

8. **Document request schemas**
   - Define schema for PayslipCreateRequest
   - Define schema for PayslipUpdateRequest
   - Define schema for BulkGenerateRequest
   - Define schema for BulkSendRequest
   - Include all required and optional fields
   - Specify field types, formats, and constraints
   - Add field descriptions and examples
   - Document nested objects (line items)

9. **Document response schemas**
   - Define schema for PayslipListResponse
   - Define schema for PayslipDetailResponse
   - Define schema for GenerationResponse
   - Define schema for BatchStatusResponse
   - Include all response fields with descriptions
   - Document nested objects and arrays
   - Add example responses for success cases
   - Document pagination metadata

10. **Document error responses**
    - Define schema for ErrorResponse
    - Document 400 Bad Request (validation errors)
    - Document 401 Unauthorized (not authenticated)
    - Document 403 Forbidden (insufficient permissions)
    - Document 404 Not Found (resource doesn't exist)
    - Document 409 Conflict (state conflicts, e.g., already generated)
    - Document 500 Internal Server Error (unexpected errors)
    - Include error message structure and codes

11. **Document authentication**
    - Explain authentication methods (Token, JWT, Session)
    - Document how to obtain authentication token
    - Show example authentication headers
    - Document token expiration and refresh
    - Explain permission levels (employee, admin, super admin)
    - Document RBAC rules for endpoints
    - Add authentication flow diagrams

12. **Document filtering and search**
    - List all filterable fields per endpoint
    - Explain filter syntax (e.g., ?status=approved)
    - Document multiple filter combination (AND logic)
    - Explain search functionality (full-text search)
    - Document date range filtering (e.g., ?generated_at_after=2026-01-01)
    - Document ordering (e.g., ?ordering=-generated_at)
    - Provide query parameter examples

13. **Document pagination**
    - Explain pagination type (page number, cursor, limit-offset)
    - Document page size default and maximum
    - Show pagination query parameters (?page=2&page_size=50)
    - Document pagination response metadata (count, next, previous)
    - Provide pagination examples
    - Explain how to iterate through pages
    - Document cursor-based pagination if used

14. **Add usage examples**
    - Provide curl examples for each endpoint
    - Provide JavaScript/Axios examples
    - Provide Python requests examples
    - Show complete request-response cycles
    - Include authentication in examples
    - Show error handling examples
    - Add postman collection or OpenAPI import

15. **Document rate limiting**
    - Explain rate limit policies (e.g., 1000 requests/hour)
    - Document rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)
    - Explain rate limit scope (per user, per tenant, global)
    - Document rate limit exceeded response (429 Too Many Requests)
    - Explain retry-after header
    - Document throttling for email actions
    - Provide guidance on avoiding rate limits

16. **Create README documentation**
   - Create `docs/README.md` for payslip API
   - Include getting started guide
   - List all endpoints with brief descriptions
   - Provide quickstart examples
   - Link to OpenAPI spec and Swagger UI
   - Include authentication guide
   - Add troubleshooting section
   - Link to related documentation (payroll, employees)

17. **Set up Swagger UI**
   - Configure Swagger UI endpoint (e.g., /api/docs/)
   - Customize Swagger UI branding (logo, colors)
   - Enable "Try it out" functionality
   - Configure default authentication
   - Add custom CSS for better styling
   - Ensure Swagger UI is accessible to authorized users
   - Document how to access Swagger UI

18. **Set up ReDoc alternative**
   - Configure ReDoc endpoint (e.g., /api/redoc/)
   - ReDoc provides cleaner, more readable docs
   - Configure three-panel layout
   - Add custom logo and theme
   - Enable search functionality
   - Provide alternative documentation view
   - Document when to use Swagger vs. ReDoc

19. **Generate client libraries**
   - Use OpenAPI Generator to create client SDKs
   - Generate Python client library
   - Generate JavaScript/TypeScript client
   - Generate Java client (if needed)
   - Document how to use generated clients
   - Publish clients to package repositories
   - Maintain client library versions with API versions

20. **Validate documentation completeness**
   - Review all endpoints are documented
   - Verify all request/response schemas are complete
   - Check all error cases are documented
   - Ensure examples are accurate and tested
   - Validate OpenAPI schema with tools
   - Test Swagger UI "Try it out" feature
   - Gather feedback from frontend developers
   - Update documentation based on feedback

### OpenAPI Documentation Structure

```
openapi: 3.0.0
info:
  title: ERP Payslip Management API
  version: 1.0.0
  description: API for managing employee payslips
  contact:
    name: API Support
    email: api@example.com

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

security:
  - bearerAuth: []

paths:
  /payslip/employee/my-payslips/:
    get:
      summary: List employee's payslips
      description: Returns paginated list of payslips for authenticated employee
      tags: [Employee Payslips]
      parameters:
        - name: period
          in: query
          schema:
            type: string
            format: uuid
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, approved, paid, cancelled]
      responses:
        200:
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPayslipList'

components:
  schemas:
    PayslipDetail:
      type: object
      properties:
        id:
          type: string
          format: uuid
        payslip_number:
          type: string
        employee:
          $ref: '#/components/schemas/EmployeeBrief'
        period:
          $ref: '#/components/schemas/PeriodBrief'
        gross_pay:
          type: number
          format: decimal
        net_pay:
          type: number
          format: decimal
        status:
          type: string
          enum: [draft, approved, paid, cancelled]
        generated_at:
          type: string
          format: date-time
        line_items:
          type: array
          items:
            $ref: '#/components/schemas/PayslipLineItem'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Documentation Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| drf-spectacular | OpenAPI schema generation | Decorators on ViewSets |
| Swagger UI | Interactive API explorer | Web interface at /api/docs/ |
| ReDoc | Alternative doc viewer | Web interface at /api/redoc/ |
| OpenAPI Generator | Client SDK generation | CLI tool for generating clients |
| Postman | API testing | Import OpenAPI spec |
| Swagger Editor | Schema validation | Online tool for editing |

### Documentation Best Practices

| Practice | Benefit |
|----------|---------|
| Use clear, concise descriptions | Improves developer understanding |
| Provide realistic examples | Speeds up integration |
| Document all error cases | Reduces support requests |
| Keep docs in sync with code | Prevents confusion |
| Version API and docs together | Maintains compatibility |
| Include authentication examples | Clarifies security requirements |
| Add usage guidelines | Promotes best practices |
| Link related resources | Provides context |

### Schema Decorators (drf-spectacular)

| Decorator | Purpose | Example |
|-----------|---------|---------|
| @extend_schema | Document endpoint | @extend_schema(summary="List payslips") |
| @extend_schema_view | Document ViewSet | Applied to class |
| @extend_schema_serializer | Document serializer | Applied to serializer class |
| @extend_schema_field | Document field | Applied to serializer field |

### Documentation Sections

| Section | Content |
|---------|---------|
| Introduction | API overview, purpose, key features |
| Authentication | Auth methods, obtaining tokens, permissions |
| Endpoints | Complete list with descriptions |
| Request/Response | Schemas for all payloads |
| Errors | Error codes, messages, resolution |
| Pagination | Pagination structure and usage |
| Filtering | Available filters and syntax |
| Rate Limiting | Limits, headers, throttling |
| Examples | Code examples in multiple languages |
| Changelog | API version history |

### Expected Deliverables

| Deliverable | Location |
|-------------|----------|
| OpenAPI Schema | `docs/openapi.yaml` |
| README Documentation | `docs/README.md` |
| Swagger UI | `/api/docs/` endpoint |
| ReDoc UI | `/api/redoc/` endpoint |
| Python Client | `clients/python/` (optional) |
| JavaScript Client | `clients/javascript/` (optional) |
| Postman Collection | `docs/postman_collection.json` |

### Verification Checklist
- [ ] OpenAPI documentation tool installed and configured
- [ ] OpenAPI schema file generated
- [ ] Schema validated with online tools
- [ ] All employee endpoints documented
- [ ] All admin endpoints documented
- [ ] All custom actions documented
- [ ] Request schemas defined with examples
- [ ] Response schemas defined with examples
- [ ] Error responses documented
- [ ] Authentication documented with examples
- [ ] Filtering and search documented
- [ ] Pagination documented
- [ ] Usage examples provided (curl, Python, JS)
- [ ] Rate limiting documented
- [ ] README documentation created
- [ ] Swagger UI configured and accessible
- [ ] ReDoc configured (optional)
- [ ] Client libraries generated (optional)
- [ ] Documentation reviewed by frontend team
- [ ] Documentation is accurate and up-to-date

---

## Group Completion

### Summary of Testing and Documentation Deliverables

| Task | Deliverable | Status |
|------|-------------|--------|
| 85 | Payslip Model Tests | `tests/test_models.py` |
| 86 | PDF Generation Tests | `tests/test_generator.py` |
| 87 | Email Distribution Tests | `tests/test_emailer.py` |
| 88 | Payslip API Documentation | `docs/openapi.yaml`, `docs/README.md` |

### Testing Strategy Summary

| Test Type | Purpose | Coverage Target |
|-----------|---------|-----------------|
| Unit Tests | Test models in isolation | 95%+ |
| Integration Tests | Test PDF generation end-to-end | 90%+ |
| Mock Tests | Test email without sending | 90%+ |
| API Tests | Test endpoints with authentication | 90%+ |

### Documentation Outputs

| Output | Purpose | Audience |
|--------|---------|----------|
| OpenAPI Schema | Machine-readable API spec | Tools, generators |
| Swagger UI | Interactive API explorer | Developers, QA |
| ReDoc | Clean, readable docs | Developers |
| README | Human-readable guide | All users |
| Client SDKs | Pre-built API clients | Frontend developers |

### Quality Assurance Checklist

- [ ] All tests pass independently
- [ ] All tests pass when run together
- [ ] Test coverage meets targets (90%+)
- [ ] No flaky tests (tests pass consistently)
- [ ] Tests run in reasonable time (<5 minutes)
- [ ] External dependencies properly mocked
- [ ] Test data is cleaned up after tests
- [ ] Tests are well-documented
- [ ] API documentation is complete
- [ ] API documentation is accurate
- [ ] Swagger UI is functional
- [ ] Examples in documentation work
- [ ] Documentation is reviewed and approved

### Maintenance Considerations

1. **Test Maintenance**
   - Update tests when models change
   - Add tests for new features
   - Refactor tests as needed for clarity
   - Keep test data factories up-to-date
   - Monitor test performance

2. **Documentation Maintenance**
   - Regenerate OpenAPI schema on API changes
   - Update examples when endpoints change
   - Version documentation with API versions
   - Keep error codes up-to-date
   - Maintain changelog for API changes

3. **Continuous Integration**
   - Run tests on every commit
   - Fail build if tests fail
   - Generate coverage reports
   - Validate OpenAPI schema in CI
   - Deploy documentation automatically

### Best Practices Applied

1. **Testing Best Practices**
   - Tests are independent and idempotent
   - One assertion per test (when possible)
   - Descriptive test names
   - Fixtures for reusable data
   - Mocks for external dependencies
   - Fast execution time

2. **Documentation Best Practices**
   - OpenAPI 3.0 standard compliance
   - Clear, concise descriptions
   - Realistic examples
   - Complete error documentation
   - Version control for docs
   - Automated generation

---

## Final Notes

This document completes the documentation for SubPhase-07 Payslip Generation. With comprehensive tests and API documentation in place, the payslip system is ready for production deployment. The testing suite ensures reliability and correctness, while the API documentation enables seamless integration by frontend developers and third-party systems.

### Key Achievements

1. **Comprehensive Test Coverage** - Models, PDF generation, email distribution fully tested
2. **Reliable System** - Error handling and edge cases covered
3. **Developer-Friendly** - Complete API documentation with examples
4. **Maintainable** - Well-structured tests and documentation
5. **Production-Ready** - Quality assurance measures in place

### SubPhase-07 Complete

All tasks in SubPhase-07 Payslip Generation have been documented. The system is ready for implementation following the detailed specifications provided across all six groups.

---

**End of Document**
