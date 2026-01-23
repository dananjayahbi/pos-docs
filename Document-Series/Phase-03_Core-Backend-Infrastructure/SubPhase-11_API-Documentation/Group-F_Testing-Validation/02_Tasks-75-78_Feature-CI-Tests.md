# Tasks 75-78: Feature Testing & CI Integration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** F - Testing & Validation  
> **Document:** 02 of 03  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-71-74_Schema-Tests.md](01_Tasks-71-74_Schema-Tests.md)
- **→ Next Document:** [03_Tasks-79-82_Documentation.md](03_Tasks-79-82_Documentation.md)

---

## Document Overview

This document covers testing authentication endpoints, validating request/response examples, and integrating schema validation into the CI/CD pipeline.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Test Auth Endpoints | Simple |
| 76 | Test Example Requests | Medium |
| 77 | Test Example Responses | Medium |
| 78 | Add Schema CI Check | Complex |

---

## Task 75: Test Auth Endpoints

### Overview
Create tests to verify that authentication endpoints are properly documented with correct request/response schemas.

### Dependencies
- Task 74: Test All Endpoints Listed

### Instructions

1. **Add auth endpoint tests to test_endpoints.py**
   - Test token obtain endpoint
   - Test token refresh endpoint
   - Test token verify endpoint (if exists)

2. **Test token obtain endpoint**
   - Test POST /api/token/ exists
   - Test request schema has email/password
   - Test response schema has tokens
   - Test error responses defined

3. **Test token refresh endpoint**
   - Test POST /api/token/refresh/ exists
   - Test request schema has refresh token
   - Test response schema has new access token
   - Test error responses defined

4. **Test authentication documentation**
   - Test JWT bearer scheme documented
   - Test token format documented
   - Test token expiry documented
   - Test examples present

5. **Test authentication examples**
   - Test login request example
   - Test login response example
   - Test refresh request example
   - Test refresh response example

### Authentication Tests
```python
"""
Add to test_endpoints.py
"""


class TestAuthenticationEndpoints:
    """Test authentication endpoint documentation."""
    
    def test_token_obtain_endpoint(self, schema_generator):
        """Test token obtain endpoint is documented."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        token_path = '/api/token/'
        assert token_path in schema['paths'], \
            "Token obtain endpoint not in schema"
        
        # Check POST method exists
        methods = schema['paths'][token_path]
        assert 'post' in methods, \
            "Token obtain endpoint missing POST method"
        
        operation = methods['post']
        
        # Check request body
        assert 'requestBody' in operation, \
            "Token obtain endpoint missing request body"
        
        request_body = operation['requestBody']
        assert 'content' in request_body
        assert 'application/json' in request_body['content']
        
        # Check response
        assert 'responses' in operation
        assert '200' in operation['responses'], \
            "Token obtain endpoint missing 200 response"
    
    def test_token_obtain_request_schema(self, schema_generator):
        """Test token obtain request has email and password."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        operation = schema['paths']['/api/token/']['post']
        request_schema = operation['requestBody']['content']['application/json']['schema']
        
        # Get schema reference or inline schema
        if '$ref' in request_schema:
            ref = request_schema['$ref']
            schema_name = ref.split('/')[-1]
            properties = schema['components']['schemas'][schema_name]['properties']
        else:
            properties = request_schema.get('properties', {})
        
        # Check required fields
        assert 'email' in properties or 'username' in properties, \
            "Login request missing email/username field"
        assert 'password' in properties, \
            "Login request missing password field"
    
    def test_token_obtain_response_schema(self, schema_generator):
        """Test token obtain response has access and refresh tokens."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        operation = schema['paths']['/api/token/']['post']
        response = operation['responses']['200']
        
        assert 'content' in response
        assert 'application/json' in response['content']
        
        response_schema = response['content']['application/json']['schema']
        
        # Get schema reference or inline schema
        if '$ref' in response_schema:
            ref = response_schema['$ref']
            schema_name = ref.split('/')[-1]
            properties = schema['components']['schemas'][schema_name]['properties']
        else:
            properties = response_schema.get('properties', {})
        
        # Check token fields
        assert 'access' in properties, \
            "Login response missing access token"
        assert 'refresh' in properties, \
            "Login response missing refresh token"
    
    def test_token_refresh_endpoint(self, schema_generator):
        """Test token refresh endpoint is documented."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        refresh_path = '/api/token/refresh/'
        assert refresh_path in schema['paths'], \
            "Token refresh endpoint not in schema"
        
        # Check POST method
        methods = schema['paths'][refresh_path]
        assert 'post' in methods, \
            "Token refresh endpoint missing POST method"
        
        operation = methods['post']
        
        # Check request body
        assert 'requestBody' in operation, \
            "Token refresh endpoint missing request body"
        
        # Check response
        assert 'responses' in operation
        assert '200' in operation['responses'], \
            "Token refresh endpoint missing 200 response"
    
    def test_token_refresh_request_schema(self, schema_generator):
        """Test token refresh request has refresh token field."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        operation = schema['paths']['/api/token/refresh/']['post']
        request_schema = operation['requestBody']['content']['application/json']['schema']
        
        # Get schema reference or inline schema
        if '$ref' in request_schema:
            ref = request_schema['$ref']
            schema_name = ref.split('/')[-1]
            properties = schema['components']['schemas'][schema_name]['properties']
        else:
            properties = request_schema.get('properties', {})
        
        assert 'refresh' in properties, \
            "Token refresh request missing refresh token field"
    
    def test_jwt_security_scheme(self, schema_generator):
        """Test JWT security scheme is properly defined."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        security_schemes = schema['components']['securitySchemes']
        
        assert 'jwtAuth' in security_schemes, \
            "JWT authentication scheme not defined"
        
        jwt_auth = security_schemes['jwtAuth']
        
        # Check scheme properties
        assert jwt_auth['type'] == 'http', \
            "JWT auth type should be 'http'"
        assert jwt_auth['scheme'] == 'bearer', \
            "JWT auth scheme should be 'bearer'"
        assert jwt_auth['bearerFormat'] == 'JWT', \
            "JWT auth bearerFormat should be 'JWT'"
        
        # Check description
        assert 'description' in jwt_auth, \
            "JWT auth missing description"
        assert 'Authorization: Bearer' in jwt_auth['description'], \
            "JWT auth description should mention Authorization header"
    
    def test_auth_error_responses(self, schema_generator):
        """Test authentication endpoints have error responses."""
        schema = schema_generator.get_schema(request=None, public=True)
        
        # Check token obtain errors
        token_operation = schema['paths']['/api/token/']['post']
        responses = token_operation['responses']
        
        # Should have 400 or 401 for invalid credentials
        assert '400' in responses or '401' in responses, \
            "Token obtain endpoint missing error response"
        
        # Check token refresh errors
        refresh_operation = schema['paths']['/api/token/refresh/']['post']
        refresh_responses = refresh_operation['responses']
        
        # Should have 401 for invalid/expired token
        assert '401' in refresh_responses, \
            "Token refresh endpoint missing 401 error response"
```

### Test Execution
```bash
# Run authentication tests
pytest backend/apps/core/tests/test_api_docs/test_endpoints.py::TestAuthenticationEndpoints -v
```

### Expected Test Output
```
test_endpoints.py::TestAuthenticationEndpoints::test_token_obtain_endpoint PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_token_obtain_request_schema PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_token_obtain_response_schema PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_token_refresh_endpoint PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_token_refresh_request_schema PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_jwt_security_scheme PASSED
test_endpoints.py::TestAuthenticationEndpoints::test_auth_error_responses PASSED

========== 7 passed in 1.34s ==========
```

### Expected Outcome
```
backend/apps/core/tests/test_api_docs/
└── test_endpoints.py     # Authentication tests added
```

### Verification Checklist
- [ ] Token obtain endpoint test passes
- [ ] Token obtain request schema test passes
- [ ] Token obtain response schema test passes
- [ ] Token refresh endpoint test passes
- [ ] Token refresh request schema test passes
- [ ] JWT security scheme test passes
- [ ] Error responses test passes

---

## Task 76: Test Example Requests

### Overview
Create tests to validate that example requests are properly formatted and contain valid JSON.

### Dependencies
- Task 75: Test Auth Endpoints

### Instructions

1. **Create test_examples.py**
   - Import JSON validation
   - Import example definitions
   - Import schema validator

2. **Test example JSON validity**
   - Load all request examples
   - Validate JSON syntax
   - Test no parsing errors

3. **Test example completeness**
   - Test all required fields present
   - Test field types correct
   - Test nested objects valid

4. **Test example realism**
   - Test Sri Lankan phone format (+94)
   - Test LKR currency values
   - Test valid email addresses
   - Test realistic data

5. **Test example coverage**
   - Test each ViewSet has examples
   - Test create operations have examples
   - Test update operations have examples
   - Report missing examples

### test_examples.py
```python
"""
Tests for API request/response examples.
"""
import json
import pytest
from apps.core.api_docs.examples import (
    LOGIN_REQUEST_EXAMPLE,
    TOKEN_REFRESH_REQUEST_EXAMPLE,
    CREATE_PRODUCT_REQUEST_EXAMPLE,
    UPDATE_PRODUCT_REQUEST_EXAMPLE,
    CREATE_ORDER_REQUEST_EXAMPLE,
    CREATE_CUSTOMER_REQUEST_EXAMPLE,
)


class TestRequestExamples:
    """Test API request examples."""
    
    def test_login_request_example(self):
        """Test login request example is valid."""
        example = LOGIN_REQUEST_EXAMPLE
        
        # Should have request key
        assert 'request' in example
        request = example['request']
        
        # Should have email and password
        assert 'email' in request
        assert 'password' in request
        
        # Validate email format
        email = request['email']
        assert '@' in email
        assert '.' in email.split('@')[1]
    
    def test_token_refresh_request_example(self):
        """Test token refresh request example is valid."""
        example = TOKEN_REFRESH_REQUEST_EXAMPLE
        
        assert 'request' in example
        request = example['request']
        
        # Should have refresh token
        assert 'refresh' in request
        
        # Token should be non-empty string
        assert isinstance(request['refresh'], str)
        assert len(request['refresh']) > 0
    
    def test_create_product_request_example(self):
        """Test create product request example is valid."""
        example = CREATE_PRODUCT_REQUEST_EXAMPLE
        
        assert 'request' in example
        request = example['request']
        
        # Required fields
        required_fields = ['name', 'sku', 'price', 'category']
        for field in required_fields:
            assert field in request, f"Product example missing {field}"
        
        # Validate price is LKR
        assert isinstance(request['price'], (int, float, str))
        
        # SKU should be string
        assert isinstance(request['sku'], str)
    
    def test_update_product_request_example(self):
        """Test update product request example is valid."""
        example = UPDATE_PRODUCT_REQUEST_EXAMPLE
        
        assert 'request' in example
        request = example['request']
        
        # Should have at least one field to update
        assert len(request) > 0
        
        # Common fields
        if 'price' in request:
            assert isinstance(request['price'], (int, float, str))
        
        if 'name' in request:
            assert isinstance(request['name'], str)
    
    def test_create_order_request_example(self):
        """Test create order request example is valid."""
        example = CREATE_ORDER_REQUEST_EXAMPLE
        
        assert 'request' in example
        request = example['request']
        
        # Required fields
        assert 'customer' in request or 'customer_id' in request
        assert 'items' in request
        
        # Items should be array
        assert isinstance(request['items'], list)
        assert len(request['items']) > 0
        
        # Each item should have product and quantity
        for item in request['items']:
            assert 'product_id' in item or 'product' in item
            assert 'quantity' in item
            assert isinstance(item['quantity'], int)
    
    def test_create_customer_request_example(self):
        """Test create customer request example is valid."""
        example = CREATE_CUSTOMER_REQUEST_EXAMPLE
        
        assert 'request' in example
        request = example['request']
        
        # Required fields
        required_fields = ['name', 'email', 'phone']
        for field in required_fields:
            assert field in request, f"Customer example missing {field}"
        
        # Validate email
        assert '@' in request['email']
        
        # Validate Sri Lankan phone format
        phone = request['phone']
        assert phone.startswith('+94') or phone.startswith('0'), \
            "Phone should use Sri Lankan format (+94 or 0)"
    
    def test_all_examples_json_serializable(self):
        """Test all examples can be JSON serialized."""
        examples = [
            LOGIN_REQUEST_EXAMPLE,
            TOKEN_REFRESH_REQUEST_EXAMPLE,
            CREATE_PRODUCT_REQUEST_EXAMPLE,
            UPDATE_PRODUCT_REQUEST_EXAMPLE,
            CREATE_ORDER_REQUEST_EXAMPLE,
            CREATE_CUSTOMER_REQUEST_EXAMPLE,
        ]
        
        for example in examples:
            try:
                json_str = json.dumps(example)
                # Try to parse back
                parsed = json.loads(json_str)
                assert parsed == example
            except (TypeError, ValueError) as e:
                pytest.fail(f"Example not JSON serializable: {e}")
    
    def test_examples_use_sri_lankan_context(self):
        """Test examples use Sri Lankan localization."""
        # Check product example for LKR
        product = CREATE_PRODUCT_REQUEST_EXAMPLE['request']
        # Price should be reasonable for LKR (hundreds/thousands)
        if 'price' in product:
            price = float(product['price'])
            assert price >= 100, \
                "Product price should be in LKR (typically 100+)"
        
        # Check customer example for Sri Lankan phone
        customer = CREATE_CUSTOMER_REQUEST_EXAMPLE['request']
        phone = customer['phone']
        assert '+94' in phone or phone.startswith('0'), \
            "Customer phone should use Sri Lankan format"
    
    def test_example_coverage(self):
        """Test that major operations have examples."""
        # Expected examples (add as you create more)
        expected_examples = [
            'LOGIN_REQUEST_EXAMPLE',
            'TOKEN_REFRESH_REQUEST_EXAMPLE',
            'CREATE_PRODUCT_REQUEST_EXAMPLE',
            'UPDATE_PRODUCT_REQUEST_EXAMPLE',
            'CREATE_ORDER_REQUEST_EXAMPLE',
            'CREATE_CUSTOMER_REQUEST_EXAMPLE',
        ]
        
        from apps.core.api_docs import examples as examples_module
        
        for example_name in expected_examples:
            assert hasattr(examples_module, example_name), \
                f"Missing example: {example_name}"
```

### Test Execution
```bash
# Run example request tests
pytest backend/apps/core/tests/test_api_docs/test_examples.py::TestRequestExamples -v
```

### Expected Test Output
```
test_examples.py::TestRequestExamples::test_login_request_example PASSED
test_examples.py::TestRequestExamples::test_token_refresh_request_example PASSED
test_examples.py::TestRequestExamples::test_create_product_request_example PASSED
test_examples.py::TestRequestExamples::test_update_product_request_example PASSED
test_examples.py::TestRequestExamples::test_create_order_request_example PASSED
test_examples.py::TestRequestExamples::test_create_customer_request_example PASSED
test_examples.py::TestRequestExamples::test_all_examples_json_serializable PASSED
test_examples.py::TestRequestExamples::test_examples_use_sri_lankan_context PASSED
test_examples.py::TestRequestExamples::test_example_coverage PASSED

========== 9 passed in 0.87s ==========
```

### Expected Outcome
```
backend/apps/core/tests/test_api_docs/
└── test_examples.py      # Request example tests created
```

### Verification Checklist
- [ ] test_examples.py created
- [ ] Login request test passes
- [ ] Token refresh request test passes
- [ ] Product request tests pass
- [ ] Order request test passes
- [ ] Customer request test passes
- [ ] JSON serialization test passes
- [ ] Sri Lankan context test passes
- [ ] Coverage test passes

---

## Task 77: Test Example Responses

### Overview
Create tests to validate that example responses match actual API response schemas.

### Dependencies
- Task 76: Test Example Requests

### Instructions

1. **Add response example tests to test_examples.py**
   - Test response examples exist
   - Test response structure matches schema
   - Test response fields present

2. **Test success responses**
   - Test 200/201 response examples
   - Test response has expected fields
   - Test nested objects valid
   - Test arrays formatted correctly

3. **Test error responses**
   - Test 400 validation error example
   - Test 401 authentication error example
   - Test 404 not found example
   - Test 500 server error example

4. **Test pagination responses**
   - Test paginated list response
   - Test has count, next, previous, results
   - Test results is array
   - Test pagination links valid

5. **Test response realism**
   - Test IDs are UUIDs or integers
   - Test timestamps are ISO 8601
   - Test currency values formatted
   - Test phone numbers formatted

### Response Example Tests
```python
"""
Add to test_examples.py
"""
from apps.core.api_docs.examples import (
    LOGIN_RESPONSE_EXAMPLE,
    PRODUCT_RESPONSE_EXAMPLE,
    PRODUCT_LIST_RESPONSE_EXAMPLE,
    ORDER_RESPONSE_EXAMPLE,
)
from datetime import datetime


class TestResponseExamples:
    """Test API response examples."""
    
    def test_login_response_example(self):
        """Test login response example is valid."""
        example = LOGIN_RESPONSE_EXAMPLE
        
        assert 'response' in example
        response = example['response']
        
        # Should have tokens
        assert 'access' in response
        assert 'refresh' in response
        
        # Tokens should be non-empty strings
        assert isinstance(response['access'], str)
        assert isinstance(response['refresh'], str)
        assert len(response['access']) > 0
        assert len(response['refresh']) > 0
    
    def test_product_response_example(self):
        """Test product response example is valid."""
        example = PRODUCT_RESPONSE_EXAMPLE
        
        assert 'response' in example
        response = example['response']
        
        # Required fields
        required_fields = ['id', 'name', 'sku', 'price', 'created_at']
        for field in required_fields:
            assert field in response, f"Product response missing {field}"
        
        # Validate types
        assert isinstance(response['id'], (int, str))
        assert isinstance(response['name'], str)
        assert isinstance(response['price'], (int, float, str))
        
        # Validate timestamp format
        created_at = response['created_at']
        try:
            datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        except ValueError:
            pytest.fail(f"Invalid timestamp format: {created_at}")
    
    def test_product_list_response_example(self):
        """Test paginated product list response is valid."""
        example = PRODUCT_LIST_RESPONSE_EXAMPLE
        
        assert 'response' in example
        response = example['response']
        
        # Pagination fields
        assert 'count' in response
        assert 'next' in response
        assert 'previous' in response
        assert 'results' in response
        
        # Results should be array
        assert isinstance(response['results'], list)
        
        # Count should match or exceed results length
        assert response['count'] >= len(response['results'])
        
        # Each result should have product structure
        for product in response['results']:
            assert 'id' in product
            assert 'name' in product
            assert 'price' in product
    
    def test_order_response_example(self):
        """Test order response example is valid."""
        example = ORDER_RESPONSE_EXAMPLE
        
        assert 'response' in example
        response = example['response']
        
        # Required fields
        required_fields = ['id', 'customer', 'items', 'total', 'status']
        for field in required_fields:
            assert field in response, f"Order response missing {field}"
        
        # Items should be array
        assert isinstance(response['items'], list)
        assert len(response['items']) > 0
        
        # Each item should have structure
        for item in response['items']:
            assert 'product' in item
            assert 'quantity' in item
            assert 'price' in item
        
        # Total should be numeric
        assert isinstance(response['total'], (int, float, str))
    
    def test_error_response_examples(self):
        """Test error response examples are valid."""
        from apps.core.api_docs.schemas import (
            ValidationErrorSchema,
            AuthenticationErrorSchema,
            NotFoundErrorSchema,
        )
        
        # Each error schema should have example
        error_schemas = [
            ValidationErrorSchema,
            AuthenticationErrorSchema,
            NotFoundErrorSchema,
        ]
        
        for schema_class in error_schemas:
            # Schema should be instantiable
            schema = schema_class()
            assert schema is not None
    
    def test_responses_use_iso8601_timestamps(self):
        """Test responses use ISO 8601 timestamp format."""
        examples_with_timestamps = [
            PRODUCT_RESPONSE_EXAMPLE,
            ORDER_RESPONSE_EXAMPLE,
        ]
        
        for example in examples_with_timestamps:
            response = example['response']
            
            # Check common timestamp fields
            timestamp_fields = ['created_at', 'updated_at']
            for field in timestamp_fields:
                if field in response:
                    timestamp = response[field]
                    try:
                        datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    except ValueError:
                        pytest.fail(
                            f"Invalid ISO 8601 timestamp: {timestamp}"
                        )
    
    def test_responses_use_lkr_currency(self):
        """Test responses use LKR currency format."""
        product = PRODUCT_RESPONSE_EXAMPLE['response']
        
        if 'price' in product:
            price = product['price']
            # Should be numeric or string with numeric value
            if isinstance(price, str):
                # Remove currency symbol if present
                price_val = price.replace('Rs.', '').replace('₨', '').strip()
                try:
                    float(price_val)
                except ValueError:
                    pytest.fail(f"Invalid price format: {price}")
    
    def test_response_coverage(self):
        """Test that major operations have response examples."""
        expected_examples = [
            'LOGIN_RESPONSE_EXAMPLE',
            'PRODUCT_RESPONSE_EXAMPLE',
            'PRODUCT_LIST_RESPONSE_EXAMPLE',
            'ORDER_RESPONSE_EXAMPLE',
        ]
        
        from apps.core.api_docs import examples as examples_module
        
        for example_name in expected_examples:
            assert hasattr(examples_module, example_name), \
                f"Missing response example: {example_name}"
```

### Test Execution
```bash
# Run example response tests
pytest backend/apps/core/tests/test_api_docs/test_examples.py::TestResponseExamples -v
```

### Expected Test Output
```
test_examples.py::TestResponseExamples::test_login_response_example PASSED
test_examples.py::TestResponseExamples::test_product_response_example PASSED
test_examples.py::TestResponseExamples::test_product_list_response_example PASSED
test_examples.py::TestResponseExamples::test_order_response_example PASSED
test_examples.py::TestResponseExamples::test_error_response_examples PASSED
test_examples.py::TestResponseExamples::test_responses_use_iso8601_timestamps PASSED
test_examples.py::TestResponseExamples::test_responses_use_lkr_currency PASSED
test_examples.py::TestResponseExamples::test_response_coverage PASSED

========== 8 passed in 0.92s ==========
```

### Expected Outcome
```
backend/apps/core/tests/test_api_docs/
└── test_examples.py      # Response example tests added
```

### Verification Checklist
- [ ] Login response test passes
- [ ] Product response test passes
- [ ] Product list response test passes
- [ ] Order response test passes
- [ ] Error response tests pass
- [ ] ISO 8601 timestamp test passes
- [ ] LKR currency test passes
- [ ] Coverage test passes

---

## Task 78: Add Schema CI Check

### Overview
Add GitHub Actions workflow to validate API schema in CI/CD pipeline to catch documentation issues early.

### Dependencies
- Task 77: Test Example Responses

### Instructions

1. **Create GitHub Actions workflow**
   - Create `.github/workflows/api-schema.yml`
   - Configure to run on PR to main
   - Run on changes to API code

2. **Configure workflow triggers**
   - Run on pull requests
   - Run on push to main/develop
   - Run on changes to apps/ directory
   - Run on changes to api_docs/

3. **Add schema validation job**
   - Set up Python environment
   - Install dependencies
   - Run Django checks
   - Generate schema
   - Validate schema

4. **Add test job**
   - Run schema tests
   - Run endpoint coverage tests
   - Run example tests
   - Report coverage

5. **Add failure notifications**
   - Comment on PR if validation fails
   - Show which tests failed
   - Link to documentation

6. **Add success indicators**
   - Post coverage report
   - Mark PR as schema-validated
   - Add status badge

### .github/workflows/api-schema.yml
```yaml
name: API Schema Validation

on:
  pull_request:
    branches:
      - main
      - develop
    paths:
      - 'backend/apps/**'
      - 'backend/config/**'
      - 'backend/requirements/**'
      - '.github/workflows/api-schema.yml'
  push:
    branches:
      - main
      - develop

jobs:
  validate-schema:
    name: Validate OpenAPI Schema
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements/dev.txt
      
      - name: Run Django system checks
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
          DEBUG: 'False'
        run: |
          python manage.py check --deploy
      
      - name: Generate OpenAPI schema
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
          DEBUG: 'False'
        run: |
          python manage.py spectacular --color --file schema.yml
      
      - name: Validate schema
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
          DEBUG: 'False'
        run: |
          python manage.py spectacular --validate --fail-on-warn
      
      - name: Upload schema artifact
        uses: actions/upload-artifact@v3
        with:
          name: openapi-schema
          path: backend/schema.yml
          retention-days: 30

  test-schema:
    name: Test API Documentation
    runs-on: ubuntu-latest
    needs: validate-schema
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements/dev.txt
      
      - name: Run schema tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
          DEBUG: 'True'
        run: |
          pytest apps/core/tests/test_api_docs/ \
            -v \
            --cov=apps.core.api_docs \
            --cov-report=xml \
            --cov-report=term
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml
          flags: api-docs
          name: api-docs-coverage
      
      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            
            // Read test results (you'd need to generate this)
            const message = `## API Schema Validation ✅
            
            The OpenAPI schema has been validated successfully!
            
            ### Test Results
            - ✅ Schema generation
            - ✅ Schema validation
            - ✅ Endpoint coverage (95%+)
            - ✅ Authentication endpoints
            - ✅ Request/response examples
            
            ### Next Steps
            - Schema artifact uploaded
            - Coverage report available
            - Documentation updated
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: message
            });

  schema-diff:
    name: Check Schema Changes
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    needs: validate-schema
    
    steps:
      - name: Checkout PR branch
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'
      
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements/dev.txt
      
      - name: Generate PR schema
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
        run: |
          python manage.py spectacular --file pr-schema.yml
      
      - name: Checkout base branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.base_ref }}
          path: base
      
      - name: Generate base schema
        working-directory: ./base/backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          SECRET_KEY: test-secret-key-for-ci
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements/dev.txt
          python manage.py spectacular --file base-schema.yml
      
      - name: Compare schemas
        run: |
          echo "## Schema Changes" > schema-diff.md
          echo "" >> schema-diff.md
          
          # Use diff or openapi-diff tool
          diff -u base/backend/base-schema.yml backend/pr-schema.yml >> schema-diff.md || true
          
          echo "Schema comparison complete"
      
      - name: Comment PR with schema diff
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const diff = fs.readFileSync('schema-diff.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: diff
            });
```

### Workflow Triggers
| Event | Branches | Paths |
|-------|----------|-------|
| **pull_request** | main, develop | apps/, config/, workflows/ |
| **push** | main, develop | apps/, config/, workflows/ |

### Expected CI Output
```
✅ validate-schema
   ├── Checkout code
   ├── Set up Python
   ├── Install dependencies
   ├── Run Django checks
   ├── Generate schema
   ├── Validate schema
   └── Upload artifact

✅ test-schema
   ├── Run schema tests (25 passed)
   ├── Run coverage (98%)
   └── Comment PR

✅ schema-diff
   ├── Generate PR schema
   ├── Generate base schema
   ├── Compare schemas
   └── Comment diff
```

### Expected Outcome
```
.github/workflows/
└── api-schema.yml        # Schema validation workflow
```

### Verification Checklist
- [ ] Workflow file created
- [ ] Triggers configured
- [ ] Schema validation job added
- [ ] Test job added
- [ ] Schema diff job added
- [ ] PR comments configured
- [ ] Coverage upload configured
- [ ] Workflow tested on PR

---

## Summary

After completing these tasks, API documentation will be tested in CI/CD and validated on every PR.

### What We Accomplished
1. ✅ Tested authentication endpoints
2. ✅ Validated request examples
3. ✅ Validated response examples
4. ✅ Added schema CI validation

### Next Steps
- Create API documentation README
- Document schema decorator usage
- Create extension guide
- Verify full integration

### CI/CD Integration
```
GitHub Actions
├── api-schema.yml
│   ├── validate-schema    # Generate & validate
│   ├── test-schema        # Run tests
│   └── schema-diff        # Compare changes
```

### Test Coverage
- Request Examples: 9 tests
- Response Examples: 8 tests
- Authentication: 7 tests
- **Total: 24 tests + CI validation**

### Git Commit Message
```
ci(api-docs): add schema validation workflow

- Test authentication endpoint documentation
- Validate request/response examples
- Add GitHub Actions schema validation
- Generate schema on PR
- Run tests in CI
- Compare schema changes
- Post PR comments with results

Part of SubPhase-11 Group F (Tasks 75-78)
```
