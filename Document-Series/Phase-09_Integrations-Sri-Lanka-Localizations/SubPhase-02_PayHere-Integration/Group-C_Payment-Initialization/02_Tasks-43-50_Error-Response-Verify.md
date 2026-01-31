# Tasks 43-50: Error Handling, Response Parsing, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** C - Payment Initialization  
> **Document:** 02 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_Initiate-Token-Lock.md](01_Tasks-35-42_Initiate-Token-Lock.md)

---

## Document Overview

Implement comprehensive error handling for payment initialization. Creates payment logging for audit trail. Creates error handling with proper exception management. Creates retry logic for transient failures. Creates timeout handling for API calls. Creates response parsing for PayHere API responses. Creates success and error response handlers. Verifies complete payment initialization flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create Payment Logging | Low | 20 min |
| 44 | Create Error Handling | Medium | 35 min |
| 45 | Create Retry Logic | Medium | 30 min |
| 46 | Create Timeout Handling | Medium | 25 min |
| 47 | Create Response Parsing | Medium | 30 min |
| 48 | Create Success Response Handler | Low | 20 min |
| 49 | Create Error Response Handler | Low | 20 min |
| 50 | Verify Payment Initialization | Low | 25 min |

---

## Task 43: Create Payment Logging

### Overview
Implement comprehensive logging for all payment initialization attempts. Logging provides an audit trail for debugging, compliance, and analytics. Every payment initiation should be logged with order details, customer information, amounts, and results. Logs should be structured, searchable, and include security-sensitive data handling.

### Dependencies
- Task 35: Create initiate_payment Method
- Python logging framework
- Structured logging library (optional)

### Instructions

1. **Configure payment logger**
   - Create dedicated logger for payments
   - Logger name: `payments.payhere`
   - Set appropriate log level (INFO)
   - Configure log handlers

2. **Create logging utility module**
   - Navigate to `backend/apps/payments/utils/`
   - Create file `logging.py`
   - Add payment logging functions

3. **Define log entry structure**
   - Event type: payment_initiation_started, payment_initiation_completed, etc.
   - Timestamp: ISO format
   - Order ID: Order identifier
   - Amount: Payment amount
   - Currency: Payment currency
   - Customer ID: Customer identifier
   - Status: success, error, timeout
   - Duration: Time taken in milliseconds

4. **Create log_payment_start function**
   - Function name: `log_payment_start()`
   - Accept parameters: order, amount, currency
   - Log initiation start event
   - Include order ID, amount, customer info

5. **Create log_payment_success function**
   - Function name: `log_payment_success()`
   - Accept parameters: order, payment_token, duration
   - Log successful initiation
   - Include token ID, redirect URL

6. **Create log_payment_error function**
   - Function name: `log_payment_error()`
   - Accept parameters: order, error, duration
   - Log error details
   - Include error type, message, stack trace

7. **Sanitize sensitive data**
   - Never log full merchant_secret
   - Never log full payment hash
   - Never log customer password
   - Mask email partially: k***n@example.com
   - Mask phone partially: +947712***67

8. **Add structured logging**
   - Use JSON format for logs
   - Include contextual data
   - Add correlation ID for tracking
   - Enable log aggregation

9. **Log form data sanitized**
   - Log payment form data
   - Remove hash field
   - Remove merchant_secret
   - Keep order_id, amount, customer name

10. **Add performance logging**
    - Log operation duration
    - Log database query time
    - Log external API call time
    - Track slow payment initiations

11. **Create log aggregation tags**
    - Tag: payment_gateway (payhere)
    - Tag: environment (sandbox/production)
    - Tag: status (success/error)
    - Enable filtering and search

12. **Integrate with initiate_payment**
    - Log at start of method
    - Log before each major step
    - Log success at end
    - Log errors in exception handler

13. **Add log rotation**
    - Configure log file rotation
    - Keep logs for 90 days
    - Archive old logs
    - Comply with data retention policies

### Payment Logging Flow

```
Payment Initiation Start
        │
        ▼
Log Start Event
        │
        log_payment_start(
            order_id=order.id,
            amount=amount,
            currency=currency,
            customer_id=customer.id
        )
        │
        ▼
Process Payment
        │
        ├─── Success
        │       │
        │       ▼
        │   Log Success Event
        │       │
        │       log_payment_success(
        │           order_id=order.id,
        │           token=token.token,
        │           duration=duration_ms
        │       )
        │
        └─── Error
                │
                ▼
            Log Error Event
                │
                log_payment_error(
                    order_id=order.id,
                    error=error,
                    duration=duration_ms
                )
```

### Log Entry Structure

**Start Event:**
```
{
    "timestamp": "2026-01-31T10:30:00.123Z",
    "event": "payment_initiation_started",
    "gateway": "payhere",
    "environment": "sandbox",
    "order_id": 12345,
    "order_number": "ORD-2026-001",
    "amount": "1250.00",
    "currency": "LKR",
    "customer_id": 67890,
    "customer_email": "k***n@example.com",
    "ip_address": "203.94.xxx.xxx"
}
```

**Success Event:**
```
{
    "timestamp": "2026-01-31T10:30:01.456Z",
    "event": "payment_initiation_completed",
    "gateway": "payhere",
    "environment": "sandbox",
    "order_id": 12345,
    "payment_token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "redirect_url": "https://sandbox.payhere.lk/pay/checkout",
    "duration_ms": 1333,
    "status": "success"
}
```

**Error Event:**
```
{
    "timestamp": "2026-01-31T10:30:02.789Z",
    "event": "payment_initiation_failed",
    "gateway": "payhere",
    "environment": "sandbox",
    "order_id": 12345,
    "error_type": "ValidationError",
    "error_message": "Invalid customer email format",
    "duration_ms": 2666,
    "status": "error"
}
```

### Logging Functions

```
def log_payment_start(order, amount, currency):
    Log payment initiation start
    
    logger.info(
        "Payment initiation started",
        extra={
            'event': 'payment_initiation_started',
            'order_id': order.id,
            'amount': str(amount),
            'currency': currency,
            'customer_id': order.customer.id,
            'customer_email': mask_email(order.customer.email)
        }
    )

def log_payment_success(order, token, duration_ms):
    Log successful payment initiation
    
    logger.info(
        "Payment initiation completed",
        extra={
            'event': 'payment_initiation_completed',
            'order_id': order.id,
            'payment_token': str(token),
            'duration_ms': duration_ms,
            'status': 'success'
        }
    )

def log_payment_error(order, error, duration_ms):
    Log payment initiation error
    
    logger.error(
        "Payment initiation failed",
        extra={
            'event': 'payment_initiation_failed',
            'order_id': order.id,
            'error_type': type(error).__name__,
            'error_message': str(error),
            'duration_ms': duration_ms,
            'status': 'error'
        },
        exc_info=True
    )
```

### Sensitive Data Masking

| Data Type | Masking Strategy | Example |
|-----------|------------------|---------|
| Email | Show first char + domain | k***n@example.com |
| Phone | Show country code + last 2 | +9477123***67 |
| Hash | Show first 8 chars | A1B2C3D4*** |
| Secret | Never log | [REDACTED] |
| Address | Show city only | Colombo |

### Log Levels

| Level | Use Case |
|-------|----------|
| DEBUG | Detailed flow, variables |
| INFO | Normal operations, success |
| WARNING | Non-critical issues |
| ERROR | Payment failures, exceptions |
| CRITICAL | System failures |

---

## Task 44: Create Error Handling

### Overview
Implement comprehensive error handling for payment initialization. The payment flow can fail at multiple points due to validation errors, network issues, database problems, or PayHere API errors. Each error type should be handled appropriately with clear error messages, proper logging, resource cleanup, and appropriate user feedback.

### Dependencies
- Task 43: Create Payment Logging
- Task 35: Create initiate_payment Method

### Instructions

1. **Define custom exception hierarchy**
   - Base: PaymentError (extends Exception)
   - Validation: PaymentValidationError
   - Gateway: PayHereAPIError
   - Lock: OrderLockError
   - Token: TokenError
   - Network: PaymentNetworkError

2. **Create exceptions module**
   - Navigate to `backend/apps/payments/exceptions/`
   - Create file `payhere.py`
   - Define all PayHere-specific exceptions

3. **Implement PaymentError base class**
   - Base exception for all payment errors
   - Include error_code attribute
   - Include user_message attribute
   - Include log_message attribute
   - Support error context dict

4. **Create validation error handler**
   - Catch ValidationError
   - Log validation failure details
   - Return clear error message
   - Include field-specific errors

5. **Create network error handler**
   - Catch ConnectionError, Timeout
   - Log network issue
   - Return user-friendly message
   - Trigger retry logic (Task 45)

6. **Create API error handler**
   - Catch PayHere API errors
   - Parse API error response
   - Log error details
   - Return specific error message

7. **Create lock error handler**
   - Catch OrderLockError
   - Log lock conflict
   - Return message: "Payment already in progress"
   - Don't retry (lock held by another process)

8. **Create database error handler**
   - Catch DatabaseError
   - Log database issue
   - Return generic error message
   - Alert operations team

9. **Implement try-except structure**
   - Wrap initiate_payment in try-except
   - Catch specific exceptions first
   - Catch generic Exception last
   - Always execute cleanup in finally

10. **Add cleanup logic**
    - Release order lock on error
    - Delete partial payment token
    - Rollback database transaction
    - Clear any cached data

11. **Create error response builder**
    - Function: `build_error_response()`
    - Accept exception parameter
    - Return PaymentResult with success=False
    - Include error_code and error_message

12. **Add error notifications**
    - Send email for critical errors
    - Send Slack notification for API errors
    - Create support ticket for database errors
    - Log all errors to monitoring

13. **Map errors to user messages**
    - Technical errors → generic message
    - Validation errors → specific field errors
    - Gateway errors → "Payment service unavailable"
    - Provide actionable guidance

14. **Add error recovery suggestions**
    - For validation: Fix data and retry
    - For network: Try again later
    - For lock: Wait and retry
    - For gateway: Contact support

### Error Handling Flow

```
Payment Initiation
        │
        try:
        │   ▼
        │   Validate input
        │   Check duplicates
        │   Acquire lock
        │   Create token
        │   Build form
        │   Return result
        │
        except ValidationError as e:
        │   ▼
        │   Log validation error
        │   Return error response
        │   Don't retry
        │
        except OrderLockError as e:
        │   ▼
        │   Log lock error
        │   Return "Payment in progress"
        │   Don't retry
        │
        except PaymentNetworkError as e:
        │   ▼
        │   Log network error
        │   Trigger retry logic
        │   Return after retry exhausted
        │
        except PayHereAPIError as e:
        │   ▼
        │   Log API error
        │   Parse error message
        │   Return specific error
        │
        except Exception as e:
        │   ▼
        │   Log unexpected error
        │   Alert operations
        │   Return generic error
        │
        finally:
        │   ▼
        │   Release lock if held
        │   Cleanup resources
```

### Exception Class Structure

```
class PaymentError(Exception):
    Base exception for payment errors
    
    def __init__(self, message, error_code=None, context=None):
        self.message = message
        self.error_code = error_code or 'PAYMENT_ERROR'
        self.context = context or {}
        super().__init__(self.message)

class PaymentValidationError(PaymentError):
    Validation errors
    
    error_code = 'VALIDATION_ERROR'

class PayHereAPIError(PaymentError):
    PayHere API errors
    
    error_code = 'GATEWAY_ERROR'

class OrderLockError(PaymentError):
    Order lock errors
    
    error_code = 'ORDER_LOCKED'

class TokenError(PaymentError):
    Token errors
    
    error_code = 'TOKEN_ERROR'

class PaymentNetworkError(PaymentError):
    Network errors
    
    error_code = 'NETWORK_ERROR'
```

### Error Handler Implementation

```
def initiate_payment(payment_intent):
    lock = None
    token = None
    
    try:
        # Validate input
        validate_payment_intent(payment_intent)
        
        # Check duplicates
        check_duplicate_payment(payment_intent.order)
        
        # Acquire lock
        lock = acquire_payment_lock(payment_intent.order_id)
        
        # Create token
        token = create_payment_token(...)
        
        # Build form
        form_data = build_payment_form_data(...)
        
        # Return success
        return PaymentResult(success=True, ...)
    
    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        return build_error_response(e)
    
    except OrderLockError as e:
        logger.warning(f"Order locked: {e}")
        return build_error_response(e)
    
    except PaymentNetworkError as e:
        logger.error(f"Network error: {e}")
        # Retry logic handles this
        raise
    
    except PayHereAPIError as e:
        logger.error(f"PayHere API error: {e}")
        return build_error_response(e)
    
    except Exception as e:
        logger.critical(f"Unexpected error: {e}", exc_info=True)
        alert_operations(e)
        return build_error_response(e)
    
    finally:
        # Cleanup
        if lock:
            release_payment_lock(lock)
```

### Error Response Format

```
Error Response:
{
    "success": false,
    "error_code": "VALIDATION_ERROR",
    "error_message": "Invalid customer email format",
    "user_message": "Please check your email address and try again",
    "field_errors": {
        "email": "Invalid email format"
    },
    "retry_allowed": false
}
```

### Error Code Mapping

| Error Code | User Message | Retry |
|------------|--------------|-------|
| VALIDATION_ERROR | Check your information | No |
| ORDER_LOCKED | Payment in progress | No |
| NETWORK_ERROR | Try again later | Yes |
| GATEWAY_ERROR | Service unavailable | Yes |
| TOKEN_ERROR | Unable to process | No |
| DATABASE_ERROR | System error | No |

---

## Task 45: Create Retry Logic

### Overview
Implement retry logic for transient failures during payment initialization. Network issues, temporary API outages, and timeouts should trigger automatic retries with exponential backoff. The retry logic should be smart, only retrying recoverable errors and respecting maximum retry attempts to avoid infinite loops.

### Dependencies
- Task 44: Create Error Handling
- Task 46: Create Timeout Handling

### Instructions

1. **Define retryable errors**
   - Network errors (ConnectionError)
   - Timeout errors (TimeoutError)
   - Temporary API errors (503 Service Unavailable)
   - Do NOT retry validation errors
   - Do NOT retry lock errors

2. **Create retry configuration**
   - Max retry attempts: 3
   - Initial delay: 1 second
   - Backoff multiplier: 2 (exponential)
   - Max delay: 10 seconds
   - Make configurable

3. **Create retry decorator**
   - Decorator name: `@retry_on_failure`
   - Accept retry config parameters
   - Wrap function with retry logic
   - Log each retry attempt

4. **Implement exponential backoff**
   - First retry: wait 1 second
   - Second retry: wait 2 seconds
   - Third retry: wait 4 seconds
   - Formula: delay = initial_delay * (multiplier ^ attempt)

5. **Add jitter**
   - Add random jitter to delay
   - Prevents thundering herd
   - Jitter: random 0-500ms
   - Formula: delay + random(0, 0.5)

6. **Create retry function**
   - Function name: `retry_payment_operation()`
   - Accept operation callable
   - Accept retry config
   - Execute with retry logic

7. **Log retry attempts**
   - Log before each retry
   - Include attempt number
   - Include wait time
   - Include error that triggered retry

8. **Check if error is retryable**
   - Function: `is_retryable_error()`
   - Check error type
   - Check error code
   - Return boolean

9. **Implement max retries**
   - Track attempt count
   - Stop after max attempts
   - Raise last error if exhausted
   - Don't retry forever

10. **Add circuit breaker pattern**
    - Track failure rate
    - Open circuit after threshold
    - Stop retries when circuit open
    - Close circuit after cooldown

11. **Create retry context**
    - Store retry metadata
    - Track total attempts
    - Track total delay
    - Include in error response

12. **Integrate with initiate_payment**
    - Wrap network operations
    - Wrap API calls
    - Don't wrap validation
    - Don't wrap lock acquisition

### Retry Logic Flow

```
Payment Operation
        │
        ▼
Execute Operation
        │
        ├─── Success
        │       │
        │       ▼
        │   Return result
        │
        └─── Error
                │
                ▼
            Check if Retryable
                │
                ├─── Not retryable
                │       │
                │       ▼
                │   Raise error immediately
                │
                └─── Retryable
                        │
                        ▼
                    Check Retry Attempts
                        │
                        ├─── Max retries reached
                        │       │
                        │       ▼
                        │   Raise last error
                        │
                        └─── Retries available
                                │
                                ▼
                            Calculate Delay
                                │
                                delay = 1s * (2 ^ attempt) + jitter
                                │
                                ▼
                            Log Retry Attempt
                                │
                                ▼
                            Wait (sleep)
                                │
                                ▼
                            Retry Operation
                                (loop back to Execute)
```

### Retry Decorator

```
def retry_on_failure(max_attempts=3, initial_delay=1, multiplier=2, max_delay=10):
    Decorator to retry function on failure
    
    def decorator(func):
        def wrapper(*args, **kwargs):
            attempt = 0
            last_error = None
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                
                except Exception as e:
                    last_error = e
                    
                    if not is_retryable_error(e):
                        raise
                    
                    attempt += 1
                    
                    if attempt >= max_attempts:
                        raise
                    
                    # Calculate delay
                    delay = min(
                        initial_delay * (multiplier ** attempt),
                        max_delay
                    )
                    
                    # Add jitter
                    jitter = random.uniform(0, 0.5)
                    total_delay = delay + jitter
                    
                    logger.warning(
                        f"Retry attempt {attempt}/{max_attempts} "
                        f"after {total_delay:.2f}s: {e}"
                    )
                    
                    time.sleep(total_delay)
            
            raise last_error
        
        return wrapper
    return decorator
```

### Retryable Error Check

```
def is_retryable_error(error: Exception) -> bool:
    Check if error is retryable
    
    retryable_types = (
        PaymentNetworkError,
        TimeoutError,
        ConnectionError,
        requests.exceptions.Timeout,
        requests.exceptions.ConnectionError
    )
    
    if isinstance(error, retryable_types):
        return True
    
    if isinstance(error, PayHereAPIError):
        # Only retry 503 Service Unavailable
        return error.status_code == 503
    
    return False
```

### Retry Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| max_attempts | 3 | Maximum retry attempts |
| initial_delay | 1 second | First retry delay |
| multiplier | 2 | Exponential multiplier |
| max_delay | 10 seconds | Maximum delay cap |
| add_jitter | True | Add random jitter |

### Retry Delay Calculation

| Attempt | Base Delay | With Multiplier | With Jitter |
|---------|------------|-----------------|-------------|
| 1 | 1s | 1s | 1.0-1.5s |
| 2 | 1s | 2s | 2.0-2.5s |
| 3 | 1s | 4s | 4.0-4.5s |

### Usage Example

```
@retry_on_failure(max_attempts=3)
def call_payhere_preapproval_api(data):
    Call PayHere pre-approval API with retry
    
    response = requests.post(
        url,
        json=data,
        timeout=10
    )
    response.raise_for_status()
    return response.json()
```

---

## Task 46: Create Timeout Handling

### Overview
Implement timeout handling for all external API calls and long-running operations during payment initialization. Timeouts prevent the system from hanging indefinitely when external services are slow or unresponsive. Each operation should have appropriate timeout values, and timeouts should be handled gracefully with proper error messages.

### Dependencies
- Task 44: Create Error Handling
- Task 45: Create Retry Logic

### Instructions

1. **Define timeout values**
   - Pre-approval API: 10 seconds
   - Hash generation: 2 seconds
   - Database query: 5 seconds
   - Total initiate_payment: 30 seconds
   - Make configurable

2. **Create timeout configuration**
   - Navigate to PayHere config
   - Add timeout settings
   - Set per-operation timeouts
   - Set global timeout

3. **Implement API call timeout**
   - Use requests library timeout parameter
   - Set connect timeout: 5 seconds
   - Set read timeout: 10 seconds
   - Tuple: (connect_timeout, read_timeout)

4. **Create timeout exception**
   - Exception name: PaymentTimeoutError
   - Extend PaymentError
   - Include operation name
   - Include timeout value

5. **Add timeout decorator**
   - Decorator name: `@timeout`
   - Accept timeout seconds parameter
   - Raise TimeoutError if exceeded
   - Use signal.alarm (Unix) or threading.Timer

6. **Implement function timeout**
   - Wrap long operations
   - Set timeout before operation
   - Cancel timeout after operation
   - Raise TimeoutError if triggered

7. **Handle timeout in retry logic**
   - Mark timeout as retryable
   - Retry once on timeout
   - Don't retry repeatedly
   - Log timeout occurrence

8. **Add database query timeout**
   - Set statement_timeout in PostgreSQL
   - Use connection timeout parameter
   - Wrap queries in timeout context
   - Rollback on timeout

9. **Create timeout context manager**
   - Name: OperationTimeout
   - Set timeout on enter
   - Clear timeout on exit
   - Raise TimeoutError if exceeded

10. **Log timeout events**
    - Log when timeout occurs
    - Include operation name
    - Include timeout value
    - Include elapsed time

11. **Add timeout monitoring**
    - Track operations approaching timeout
    - Alert if operations consistently slow
    - Adjust timeout values if needed

12. **Integrate with initiate_payment**
    - Set global timeout for method
    - Set specific timeouts for sub-operations
    - Handle TimeoutError appropriately
    - Return clear error message

### Timeout Handling Flow

```
Payment Operation Start
        │
        Set Timeout (30 seconds)
        │
        ▼
Execute Operation
        │
        ├─── Completes within timeout
        │       │
        │       ▼
        │   Clear timeout
        │   Return result
        │
        └─── Exceeds timeout
                │
                ▼
            Timeout Triggered
                │
                ▼
            Raise TimeoutError
                │
                ▼
            Catch TimeoutError
                │
                ▼
            Log Timeout Event
                │
                ▼
            Check Retry Eligible
                │
                ├─── Retry available
                │       │
                │       ▼
                │   Retry operation
                │
                └─── No retry
                        │
                        ▼
                    Return error response
                    "Operation timed out"
```

### Timeout Configuration

| Operation | Timeout | Retry on Timeout |
|-----------|---------|------------------|
| Pre-approval API | 10s | Yes (once) |
| Hash generation | 2s | No |
| Database query | 5s | No |
| Lock acquisition | 3s | No |
| Total initiate_payment | 30s | No |

### API Call with Timeout

```
Make API call with timeout:

import requests

def call_payhere_api(url, data):
    try:
        response = requests.post(
            url,
            json=data,
            timeout=(5, 10)  # (connect, read)
        )
        return response.json()
    
    except requests.exceptions.Timeout as e:
        logger.error(f"API call timed out: {url}")
        raise PaymentTimeoutError(
            f"PayHere API call timed out after 10 seconds",
            operation="preapproval_api"
        )
```

### Timeout Decorator

```
import signal

class TimeoutError(Exception):
    pass

def timeout(seconds):
    Decorator to timeout a function
    
    def decorator(func):
        def handler(signum, frame):
            raise TimeoutError(f"Operation timed out after {seconds}s")
        
        def wrapper(*args, **kwargs):
            # Set alarm
            signal.signal(signal.SIGALRM, handler)
            signal.alarm(seconds)
            
            try:
                result = func(*args, **kwargs)
            finally:
                # Cancel alarm
                signal.alarm(0)
            
            return result
        
        return wrapper
    return decorator

Usage:

@timeout(30)
def initiate_payment(payment_intent):
    # Will timeout after 30 seconds
    ...
```

### Timeout Context Manager

```
class OperationTimeout:
    Context manager for operation timeout
    
    def __init__(self, seconds, operation_name):
        self.seconds = seconds
        self.operation_name = operation_name
    
    def __enter__(self):
        self.start_time = time.time()
        signal.signal(signal.SIGALRM, self._timeout_handler)
        signal.alarm(self.seconds)
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        signal.alarm(0)
        elapsed = time.time() - self.start_time
        
        if elapsed > self.seconds * 0.8:
            logger.warning(
                f"{self.operation_name} took {elapsed:.2f}s "
                f"(timeout: {self.seconds}s)"
            )
    
    def _timeout_handler(self, signum, frame):
        raise PaymentTimeoutError(
            f"{self.operation_name} timed out after {self.seconds}s"
        )

Usage:

with OperationTimeout(10, "preapproval_api"):
    result = call_payhere_api(...)
```

### Database Timeout

```
Set database query timeout:

from django.db import connection

def create_payment_token_with_timeout(data, timeout=5):
    with connection.cursor() as cursor:
        # Set statement timeout
        cursor.execute(f"SET statement_timeout = '{timeout}s'")
        
        # Create token
        token = PaymentToken.objects.create(**data)
        
        return token
```

### Timeout Error Response

```
{
    "success": false,
    "error_code": "TIMEOUT_ERROR",
    "error_message": "Payment initiation timed out",
    "user_message": "The payment service is taking too long. Please try again.",
    "operation": "payment_initiation",
    "timeout_seconds": 30,
    "retry_allowed": true
}
```

---

## Task 47: Create Response Parsing

### Overview
Create a response parser to handle and structure responses from payment initiation. The parser converts raw payment data into standardized PaymentResult objects, handles both success and error cases, validates response data, and ensures consistent response format for frontend consumption. The parser is the bridge between backend processing and API response.

### Dependencies
- Task 48: Create Success Response Handler
- Task 49: Create Error Response Handler

### Instructions

1. **Create response parser module**
   - Navigate to `backend/apps/payments/processors/payhere/`
   - Create file `response_parser.py`
   - Add parsing functions

2. **Define PaymentResult model**
   - Class name: PaymentResult
   - Dataclass or Pydantic model
   - Include all response fields
   - Ensure type safety

3. **Define response fields**
   - success: boolean (required)
   - redirect_url: string (if success)
   - form_data: dict (if success)
   - payment_token: UUID (if success)
   - error_code: string (if error)
   - error_message: string (if error)
   - metadata: dict (optional)

4. **Create parse_payment_response function**
   - Function name: `parse_payment_response()`
   - Accept raw data parameters
   - Determine success or error
   - Call appropriate handler

5. **Implement success response parsing**
   - Call parse_success_response (Task 48)
   - Validate all required fields present
   - Convert types as needed
   - Build PaymentResult object

6. **Implement error response parsing**
   - Call parse_error_response (Task 49)
   - Extract error details
   - Map to standard error codes
   - Build PaymentResult object

7. **Add response validation**
   - Validate redirect_url is valid URL
   - Validate form_data has required fields
   - Validate payment_token is valid UUID
   - Raise ParsingError if invalid

8. **Create response serializer**
   - Convert PaymentResult to dict
   - Format for JSON response
   - Remove null fields
   - Maintain consistent structure

9. **Add metadata extraction**
   - Extract additional context
   - Include timestamps
   - Include operation duration
   - Include gateway info

10. **Handle partial responses**
    - Some operations may return partial data
    - Validate minimum required fields
    - Fill defaults for optional fields
    - Log incomplete responses

11. **Add response logging**
    - Log parsed response
    - Sanitize sensitive data
    - Include success/error status
    - Include response size

12. **Create response validator**
    - Function: `validate_payment_response()`
    - Check response structure
    - Check required fields
    - Raise ValidationError if invalid

### Response Parsing Flow

```
Raw Payment Data
        │
        ▼
Determine Response Type
        │
        ├─── Success
        │       │
        │       ▼
        │   Parse Success Response
        │       │
        │       ├─── Extract redirect_url
        │       ├─── Extract form_data
        │       ├─── Extract payment_token
        │       └─── Extract metadata
        │       │
        │       ▼
        │   Validate Response
        │       │
        │       ├─── Check redirect_url valid
        │       ├─── Check form_data complete
        │       └─── Check token valid
        │       │
        │       ▼
        │   Build PaymentResult
        │       │
        │       success=True
        │       redirect_url=url
        │       form_data=form
        │       payment_token=token
        │
        └─── Error
                │
                ▼
            Parse Error Response
                │
                ├─── Extract error_code
                ├─── Extract error_message
                └─── Extract context
                │
                ▼
            Validate Error
                │
                ├─── Check error_code present
                └─── Check error_message present
                │
                ▼
            Build PaymentResult
                │
                success=False
                error_code=code
                error_message=message
                │
                ▼
            Return PaymentResult
```

### PaymentResult Structure

```
@dataclass
class PaymentResult:
    Payment result data structure
    
    success: bool
    redirect_url: Optional[str] = None
    form_data: Optional[Dict[str, str]] = None
    payment_token: Optional[UUID] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    user_message: Optional[str] = None
    metadata: Optional[Dict] = None
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict:
        Convert to dictionary
        
        return {
            'success': self.success,
            'redirect_url': self.redirect_url,
            'form_data': self.form_data,
            'payment_token': str(self.payment_token) if self.payment_token else None,
            'error_code': self.error_code,
            'error_message': self.error_message,
            'user_message': self.user_message,
            'metadata': self.metadata,
            'timestamp': self.timestamp.isoformat()
        }
```

### Parse Payment Response

```
def parse_payment_response(success, **data) -> PaymentResult:
    Parse payment response data
    
    if success:
        return parse_success_response(**data)
    else:
        return parse_error_response(**data)
```

### Response Validation

```
def validate_payment_response(result: PaymentResult) -> None:
    Validate payment result
    
    if result.success:
        # Validate success response
        if not result.redirect_url:
            raise ValidationError("Missing redirect_url")
        
        if not result.form_data:
            raise ValidationError("Missing form_data")
        
        if not result.payment_token:
            raise ValidationError("Missing payment_token")
        
        # Validate URL format
        if not result.redirect_url.startswith('https://'):
            raise ValidationError("Invalid redirect_url")
    
    else:
        # Validate error response
        if not result.error_code:
            raise ValidationError("Missing error_code")
        
        if not result.error_message:
            raise ValidationError("Missing error_message")
```

### Example Responses

**Success Response:**
```
PaymentResult(
    success=True,
    redirect_url="https://sandbox.payhere.lk/pay/checkout",
    form_data={
        "merchant_id": "1234567",
        "order_id": "PAY-ORDER-123",
        "amount": "1250.00",
        ... (all form fields)
    },
    payment_token=UUID("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
    metadata={
        "gateway": "payhere",
        "environment": "sandbox",
        "duration_ms": 1250
    }
)
```

**Error Response:**
```
PaymentResult(
    success=False,
    error_code="VALIDATION_ERROR",
    error_message="Invalid customer email format",
    user_message="Please check your email address",
    metadata={
        "field": "email",
        "value": "invalid-email"
    }
)
```

---

## Task 48: Create Success Response Handler

### Overview
Create a success response handler to build standardized success responses for payment initiation. When payment initialization succeeds, the handler constructs a complete PaymentResult object with redirect URL, form data, payment token, and metadata. The success response provides all information needed by the frontend to redirect the customer to PayHere checkout.

### Dependencies
- Task 47: Create Response Parsing

### Instructions

1. **Create success handler function**
   - Function name: `parse_success_response()`
   - Accept parameters: redirect_url, form_data, payment_token
   - Return PaymentResult object

2. **Validate success parameters**
   - Check redirect_url is not None
   - Check form_data is not empty dict
   - Check payment_token is valid UUID
   - Raise error if any missing

3. **Build success result**
   - Set success = True
   - Set redirect_url from parameter
   - Set form_data from parameter
   - Convert payment_token to string

4. **Add metadata**
   - Include gateway: "payhere"
   - Include environment: "sandbox" or "production"
   - Include timestamp
   - Include duration if available

5. **Add user message**
   - Optional success message
   - Example: "Redirecting to payment gateway"
   - Helpful for UI feedback

6. **Format form data**
   - Ensure all values are strings
   - Remove any null values
   - Validate required fields present
   - Maintain field order

7. **Create response wrapper**
   - Wrap in consistent structure
   - Include status code (200)
   - Include headers if needed
   - Maintain API contract

8. **Add logging**
   - Log success response created
   - Include order ID
   - Include payment token
   - Sanitize form data

### Success Response Structure

```
PaymentResult (Success):
    success: True
    redirect_url: "https://sandbox.payhere.lk/pay/checkout"
    form_data: {
        "merchant_id": "1234567",
        "order_id": "PAY-ORDER-123-1234567890",
        "items": "Product A, Product B",
        "currency": "LKR",
        "amount": "1250.00",
        "first_name": "Kasun",
        "last_name": "Perera",
        "email": "kasun.perera@example.com",
        "phone": "+94771234567",
        "address": "123 Galle Road",
        "city": "Colombo",
        "country": "Sri Lanka",
        "return_url": "https://example.com/payment/return",
        "cancel_url": "https://example.com/payment/cancel",
        "notify_url": "https://example.com/payment/notify",
        "hash": "A1B2C3D4E5F6...",
        "platform": "Web"
    }
    payment_token: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    metadata: {
        "gateway": "payhere",
        "environment": "sandbox",
        "order_id": 12345,
        "duration_ms": 1250,
        "timestamp": "2026-01-31T10:30:00Z"
    }
```

### Parse Success Response Function

```
def parse_success_response(
    redirect_url: str,
    form_data: Dict[str, str],
    payment_token: UUID,
    metadata: Optional[Dict] = None
) -> PaymentResult:
    Parse and build success payment result
    
    # Validate inputs
    if not redirect_url:
        raise ValueError("redirect_url is required")
    if not form_data:
        raise ValueError("form_data is required")
    if not payment_token:
        raise ValueError("payment_token is required")
    
    # Build metadata
    result_metadata = {
        'gateway': 'payhere',
        'timestamp': datetime.now().isoformat()
    }
    if metadata:
        result_metadata.update(metadata)
    
    # Build result
    result = PaymentResult(
        success=True,
        redirect_url=redirect_url,
        form_data=form_data,
        payment_token=payment_token,
        user_message="Redirecting to payment gateway",
        metadata=result_metadata
    )
    
    # Log success
    logger.info(
        f"Success response created for token {payment_token}"
    )
    
    return result
```

### Frontend Usage

```
Frontend receives success response:

{
    "success": true,
    "redirect_url": "https://sandbox.payhere.lk/pay/checkout",
    "form_data": { ... },
    "payment_token": "a1b2c3d4-...",
    "metadata": { ... }
}

Frontend action:
1. Create HTML form with form_data fields
2. Set form action to redirect_url
3. Auto-submit form to redirect user to PayHere
4. Store payment_token for callback verification
```

---

## Task 49: Create Error Response Handler

### Overview
Create an error response handler to build standardized error responses for payment initiation failures. When payment initialization fails, the handler constructs a PaymentResult object with error details, user-friendly messages, and context for debugging. The error response helps frontend display appropriate error messages and guide users on next steps.

### Dependencies
- Task 47: Create Response Parsing
- Task 44: Create Error Handling

### Instructions

1. **Create error handler function**
   - Function name: `parse_error_response()`
   - Accept parameters: error or error_code, error_message
   - Return PaymentResult object

2. **Extract error details**
   - Get error type from exception
   - Get error message from exception
   - Map to standard error code
   - Generate user-friendly message

3. **Map error codes**
   - ValidationError → VALIDATION_ERROR
   - OrderLockError → ORDER_LOCKED
   - PaymentNetworkError → NETWORK_ERROR
   - PayHereAPIError → GATEWAY_ERROR
   - Generic → PAYMENT_ERROR

4. **Build error result**
   - Set success = False
   - Set error_code
   - Set error_message (technical)
   - Set user_message (friendly)
   - Include metadata

5. **Generate user messages**
   - VALIDATION_ERROR → "Please check your information"
   - ORDER_LOCKED → "Payment already in progress"
   - NETWORK_ERROR → "Please try again later"
   - GATEWAY_ERROR → "Payment service unavailable"
   - PAYMENT_ERROR → "Unable to process payment"

6. **Add error context**
   - Include field errors if validation
   - Include retry information
   - Include support contact if needed
   - Include error timestamp

7. **Add debugging info**
   - In development: include stack trace
   - In production: exclude sensitive data
   - Include correlation ID
   - Include error path

8. **Handle known errors**
   - Create specific handlers for common errors
   - Provide actionable guidance
   - Include retry flag
   - Link to documentation

9. **Add error logging**
   - Log error response created
   - Include error code and message
   - Include context
   - Sanitize sensitive data

### Error Response Structure

```
PaymentResult (Error):
    success: False
    error_code: "VALIDATION_ERROR"
    error_message: "Invalid customer email format"
    user_message: "Please check your email address and try again"
    metadata: {
        "field_errors": {
            "email": "Invalid email format"
        },
        "retry_allowed": false,
        "timestamp": "2026-01-31T10:30:00Z"
    }
```

### Parse Error Response Function

```
def parse_error_response(
    error: Exception,
    context: Optional[Dict] = None
) -> PaymentResult:
    Parse and build error payment result
    
    # Map error to code
    error_code = map_error_to_code(error)
    
    # Get error message
    error_message = str(error)
    
    # Generate user message
    user_message = generate_user_message(error_code)
    
    # Build metadata
    metadata = {
        'timestamp': datetime.now().isoformat(),
        'error_type': type(error).__name__,
        'retry_allowed': is_retryable_error(error)
    }
    if context:
        metadata.update(context)
    
    # Build result
    result = PaymentResult(
        success=False,
        error_code=error_code,
        error_message=error_message,
        user_message=user_message,
        metadata=metadata
    )
    
    # Log error
    logger.error(
        f"Error response created: {error_code}",
        extra={'error': error_message}
    )
    
    return result
```

### Error Code Mapping

```
def map_error_to_code(error: Exception) -> str:
    Map exception to error code
    
    error_map = {
        ValidationError: 'VALIDATION_ERROR',
        OrderLockError: 'ORDER_LOCKED',
        PaymentNetworkError: 'NETWORK_ERROR',
        PayHereAPIError: 'GATEWAY_ERROR',
        TimeoutError: 'TIMEOUT_ERROR',
        TokenError: 'TOKEN_ERROR'
    }
    
    for error_type, code in error_map.items():
        if isinstance(error, error_type):
            return code
    
    return 'PAYMENT_ERROR'
```

### User Message Generation

```
def generate_user_message(error_code: str) -> str:
    Generate user-friendly error message
    
    messages = {
        'VALIDATION_ERROR': 'Please check your information and try again',
        'ORDER_LOCKED': 'A payment is already being processed for this order',
        'NETWORK_ERROR': 'Connection issue. Please try again in a moment',
        'GATEWAY_ERROR': 'Payment service is temporarily unavailable',
        'TIMEOUT_ERROR': 'Request timed out. Please try again',
        'TOKEN_ERROR': 'Unable to create payment token',
        'PAYMENT_ERROR': 'Unable to process payment. Please contact support'
    }
    
    return messages.get(error_code, messages['PAYMENT_ERROR'])
```

### Error Response Examples

**Validation Error:**
```
{
    "success": false,
    "error_code": "VALIDATION_ERROR",
    "error_message": "Invalid customer email format",
    "user_message": "Please check your information and try again",
    "metadata": {
        "field_errors": {"email": "Invalid format"},
        "retry_allowed": false
    }
}
```

**Lock Error:**
```
{
    "success": false,
    "error_code": "ORDER_LOCKED",
    "error_message": "Order 12345 is currently locked",
    "user_message": "A payment is already being processed for this order",
    "metadata": {
        "order_id": 12345,
        "retry_allowed": false
    }
}
```

**Network Error:**
```
{
    "success": false,
    "error_code": "NETWORK_ERROR",
    "error_message": "Connection timeout to PayHere API",
    "user_message": "Connection issue. Please try again in a moment",
    "metadata": {
        "retry_allowed": true,
        "retry_after": 5
    }
}
```

---

## Task 50: Verify Payment Initialization

### Overview
Verify the complete payment initialization flow by testing all components end-to-end. This includes manual testing, automated tests, integration tests, and validation of all success and error scenarios. Verification ensures payment initiation works correctly, handles all edge cases, and is production-ready.

### Dependencies
- All previous tasks in Group C (Tasks 35-49)

### Instructions

1. **Create test module**
   - Navigate to `backend/apps/payments/tests/`
   - Create file `test_payment_initialization.py`
   - Import all required components

2. **Test successful payment initiation**
   - Create test: `test_initiate_payment_success()`
   - Provide valid PaymentIntent
   - Call initiate_payment
   - Assert success = True
   - Assert redirect_url present
   - Assert form_data complete
   - Assert payment_token created

3. **Test form data generation**
   - Create test: `test_build_payment_form_data()`
   - Provide order with all fields
   - Build form data
   - Assert all required fields present
   - Assert hash correctly generated
   - Assert amounts formatted correctly

4. **Test checkout URL selection**
   - Create test: `test_get_checkout_url_sandbox()`
   - Set sandbox mode
   - Get checkout URL
   - Assert returns sandbox URL
   - Test production mode similarly

5. **Test pre-approval API**
   - Create test: `test_preapproval_success()`
   - Mock PayHere API response
   - Call pre-approval
   - Assert token returned
   - Test error handling

6. **Test payment token creation**
   - Create test: `test_create_payment_token()`
   - Create token
   - Assert saved to database
   - Assert expiry set correctly
   - Assert status is pending

7. **Test token expiry**
   - Create test: `test_token_expiry()`
   - Create token with past expiry
   - Check is_expired property
   - Assert returns True
   - Test mark_expired method

8. **Test duplicate prevention**
   - Create test: `test_duplicate_payment_rejected()`
   - Create active token
   - Try initiating another payment
   - Assert raises DuplicatePaymentError

9. **Test order lock**
   - Create test: `test_order_lock_prevents_concurrent()`
   - Acquire lock on order
   - Try acquiring again
   - Assert raises OrderLockError
   - Test lock release

10. **Test validation errors**
    - Create test: `test_validation_errors()`
    - Provide invalid data (negative amount, wrong currency)
    - Assert raises ValidationError
    - Test error messages correct

11. **Test error handling**
    - Create test: `test_error_handling()`
    - Simulate various errors
    - Assert proper error responses
    - Test cleanup executed

12. **Test retry logic**
    - Create test: `test_retry_on_network_error()`
    - Mock network error
    - Assert retries attempted
    - Assert exponential backoff
    - Test max retries respected

13. **Test timeout handling**
    - Create test: `test_timeout_error()`
    - Mock slow operation
    - Set low timeout
    - Assert raises TimeoutError

14. **Test response parsing**
    - Create test: `test_parse_success_response()`
    - Build success response
    - Parse response
    - Assert PaymentResult correct
    - Test error response parsing

15. **Test integration flow**
    - Create test: `test_full_payment_flow()`
    - Simulate complete flow
    - From intent to response
    - Assert all steps execute
    - Verify database state

16. **Manual testing checklist**
    - Test with sandbox credentials
    - Initiate payment for test order
    - Verify redirect to PayHere
    - Check payment token saved
    - Check order locked
    - Test duplicate prevention
    - Test error scenarios

17. **Performance testing**
    - Measure initiate_payment duration
    - Should complete under 2 seconds
    - Test under load
    - Check database query count

18. **Security verification**
    - Verify hash correctly generated
    - Verify no secrets logged
    - Verify SQL injection protection
    - Verify XSS protection in form data

### Verification Checklist

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Valid payment intent | Success response | ☐ |
| Form data complete | All fields present | ☐ |
| Hash generation | Correct MD5 hash | ☐ |
| Token creation | Saved in database | ☐ |
| Token expiry | Expires after 30min | ☐ |
| Duplicate check | Rejects duplicate | ☐ |
| Order lock | Prevents concurrent | ☐ |
| Invalid data | Validation error | ☐ |
| Network error | Retry logic works | ☐ |
| Timeout | Timeout error raised | ☐ |
| Success response | Correct structure | ☐ |
| Error response | Correct structure | ☐ |

### Integration Test Example

```
def test_full_payment_initialization_flow():
    Test complete payment initialization
    
    # Setup
    order = create_test_order()
    payment_intent = PaymentIntent(
        order=order,
        amount=Decimal('1250.00'),
        currency='LKR',
        return_url='https://example.com/return',
        cancel_url='https://example.com/cancel'
    )
    
    # Execute
    processor = PayHereProcessor(config=test_config)
    result = processor.initiate_payment(payment_intent)
    
    # Assert result
    assert result.success is True
    assert result.redirect_url is not None
    assert result.form_data is not None
    assert result.payment_token is not None
    
    # Assert token created
    token = PaymentToken.objects.get(token=result.payment_token)
    assert token.order == order
    assert token.status == 'pending'
    assert token.is_active is True
    
    # Assert form data
    assert result.form_data['merchant_id'] == test_config.merchant_id
    assert result.form_data['amount'] == '1250.00'
    assert result.form_data['currency'] == 'LKR'
    assert 'hash' in result.form_data
    
    # Assert order locked
    with pytest.raises(OrderLockError):
        acquire_payment_lock(order.id)
```

### Manual Testing Steps

```
1. Start Django server
   python manage.py runserver

2. Create test order
   - Order ID: TEST-001
   - Amount: LKR 1250.00
   - Customer: test@example.com

3. Call payment API
   POST /api/payments/initiate/
   {
       "order_id": "TEST-001",
       "return_url": "http://localhost:8000/return",
       "cancel_url": "http://localhost:8000/cancel"
   }

4. Verify response
   - Check success: true
   - Check redirect_url present
   - Check form_data complete
   - Check payment_token returned

5. Check database
   - Verify PaymentToken created
   - Verify status = 'pending'
   - Verify expires_at set

6. Test redirect
   - Submit form to redirect_url
   - Should reach PayHere sandbox
   - Should show payment form

7. Test duplicate
   - Call API again with same order
   - Should return error
   - Error: "Payment already in progress"

8. Test expiry
   - Wait 30 minutes (or update DB)
   - Token should be expired
   - Should allow new payment
```

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_Initiate-Token-Lock.md](01_Tasks-35-42_Initiate-Token-Lock.md)

---

**Document End - Tasks 43-50 Complete**

**Group C: Payment Initialization - All Tasks Complete**
