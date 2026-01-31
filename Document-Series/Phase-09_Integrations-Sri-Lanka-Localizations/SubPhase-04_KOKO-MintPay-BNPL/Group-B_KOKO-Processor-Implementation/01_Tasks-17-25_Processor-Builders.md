# Tasks 17-25: KOKO Processor and Data Builders

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 04 - KOKO/MintPay BNPL  
> **Group:** B - KOKO Processor Implementation  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-34_Payment-Callback-Verify.md](02_Tasks-26-34_Payment-Callback-Verify.md)

---

## Document Overview

This document covers the foundational implementation of the KOKO payment processor class and its supporting data builders. The KOKO processor extends the abstract PaymentProcessor base class to handle Buy Now Pay Later (BNPL) transactions with Sri Lankan localization features including NIC validation, +94 phone formatting, and LKR currency handling. This implementation creates the structural foundation for KOKO BNPL integration within the multi-tenant ERP system.

### Key Features
- **KOKO Processor Class:** Extend PaymentProcessor ABC with BNPL-specific functionality
- **Factory Registration:** Register processor with PaymentProcessorFactory for dependency injection
- **API Client Integration:** Implement secure HTTP client with authentication and request signing
- **Data Builders:** Create modular builders for orders, customers, items, and shipping data
- **Sri Lankan Localization:** Handle NIC formatting, +94 phone numbers, and LKR currency

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create KOKOProcessor Class | High | 60 min |
| 18 | Create Processor Registration | Low | 15 min |
| 19 | Create API Client | Medium | 45 min |
| 20 | Create Authentication | Medium | 40 min |
| 21 | Create Request Signing | Medium | 35 min |
| 22 | Create Amount Formatter | Low | 20 min |
| 23 | Create Order Data Builder | Medium | 50 min |
| 24 | Create Customer Data Builder | Medium | 45 min |
| 25 | Create NIC Formatter | Low | 25 min |

---

## KOKO Processor Architecture Overview

### File Structure

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   ├── __init__.py
        │   ├── base.py                    ← PaymentProcessor ABC
        │   ├── factory.py                 ← ProcessorFactory
        │   └── koko/
        │       ├── __init__.py           ← Export KOKOProcessor
        │       ├── processor.py          ← Main KOKOProcessor class
        │       ├── client.py             ← KOKO API client
        │       └── builders.py           ← Data builders
        └── models.py                      ← PaymentIntent, PaymentResult
```

### Class Architecture

```
PaymentProcessor (ABC)
└── KOKOProcessor
    ├── client: KOKOAPIClient
    ├── amount_formatter: AmountFormatter
    ├── order_builder: OrderDataBuilder
    ├── customer_builder: CustomerDataBuilder
    └── nic_formatter: NICFormatter
```

### Dependencies
- **httpx:** Async HTTP client for KOKO API requests
- **cryptography:** For HMAC request signing
- **pydantic:** Data validation and serialization
- **django-tenants:** Multi-tenant context handling

---

## Task 17: Create KOKOProcessor Class

### Overview
Create the main KOKOProcessor class that extends the PaymentProcessor abstract base class. This class serves as the entry point for all KOKO BNPL payment operations within the multi-tenant ERP system.

### Implementation Requirements

#### Class Definition
- **File Location:** `backend/apps/payments/processors/koko/processor.py`
- **Class Name:** `KOKOProcessor`
- **Parent Class:** `PaymentProcessor` (from `..base`)
- **Gateway Type:** `PaymentGateway.KOKO`
- **Payment Type:** BNPL (Buy Now Pay Later)

#### Core Attributes
```python
# Class-level attributes
gateway_type = PaymentGateway.KOKO
payment_method_type = PaymentMethodType.BNPL
supports_refunds = True
supports_partial_refunds = False
supports_webhooks = True
requires_redirect = True

# Instance attributes
client: KOKOAPIClient
amount_formatter: AmountFormatter
order_builder: OrderDataBuilder
customer_builder: CustomerDataBuilder
```

#### Constructor Implementation
- Accept `tenant` parameter for multi-tenant context
- Initialize all sub-components (client, formatters, builders)
- Load KOKO-specific configuration from tenant settings
- Validate required configuration parameters

#### Abstract Method Implementations
1. **`initiate_payment(payment_intent: PaymentIntent) -> PaymentResult`**
   - Primary payment initiation method (implemented in Task 29)
   - Placeholder implementation that raises NotImplementedError

2. **`handle_webhook(request_data: dict) -> WebhookResult`**
   - Webhook callback handler (implemented in Task 31)
   - Placeholder implementation that raises NotImplementedError

3. **`get_payment_status(transaction_id: str) -> PaymentStatus`**
   - Status inquiry method
   - Placeholder implementation that raises NotImplementedError

#### Configuration Management
- **API Endpoint:** Load from `KOKO_API_BASE_URL`
- **API Key:** Load from `KOKO_API_KEY`
- **API Secret:** Load from `KOKO_API_SECRET`
- **Webhook Secret:** Load from `KOKO_WEBHOOK_SECRET`
- **Timeout Settings:** Default 30 seconds
- **Retry Settings:** Default 3 attempts

#### Error Handling
- Import and use custom payment exceptions
- Implement proper logging with tenant context
- Handle configuration validation errors
- Provide meaningful error messages for debugging

#### Documentation Requirements
- Add comprehensive docstring explaining KOKO BNPL integration
- Document all configuration parameters
- Include usage examples
- Document Sri Lankan localization features

### Validation Steps
1. Verify class extends PaymentProcessor correctly
2. Confirm all abstract methods are defined (even if placeholder)
3. Test constructor with valid and invalid configurations
4. Verify proper error handling for missing configuration
5. Confirm logging includes tenant context
6. Test factory registration preparation

---

## Task 18: Create Processor Registration

### Overview
Register the KOKOProcessor with the PaymentProcessorFactory to enable dependency injection and factory-based processor instantiation throughout the ERP system.

### Implementation Requirements

#### Factory Registration
- **File Location:** `backend/apps/payments/processors/koko/__init__.py`
- **Registration Method:** `ProcessorFactory.register()`
- **Gateway Key:** `PaymentGateway.KOKO`
- **Processor Class:** `KOKOProcessor`

#### Import Structure
```python
from .processor import KOKOProcessor
from ..factory import ProcessorFactory
from ..enums import PaymentGateway

# Register KOKO processor with factory
ProcessorFactory.register(PaymentGateway.KOKO, KOKOProcessor)

# Export for external use
__all__ = ['KOKOProcessor']
```

#### Auto-Discovery Integration
- Ensure the registration executes on module import
- Add registration to payment processor discovery system
- Support dynamic loading for tenant-specific configurations

#### Factory Method Validation
- Verify factory can instantiate KOKOProcessor
- Test factory returns correct processor type
- Confirm tenant parameter passing works correctly
- Validate error handling for registration failures

#### Integration Testing
- Test processor retrieval through factory
- Verify correct processor instance returned
- Confirm tenant-specific configuration loading
- Test factory method with various parameters

### Validation Steps
1. Import processors module and verify registration occurs
2. Use factory to get KOKO processor instance
3. Verify instance is KOKOProcessor type
4. Test with different tenant contexts
5. Confirm no registration conflicts with other processors

---

## Task 19: Create API Client

### Overview
Implement the KOKOAPIClient class that handles all HTTP communication with the KOKO BNPL service. The client provides secure, authenticated requests with proper error handling and retry logic.

### Implementation Requirements

#### Client Class Structure
- **File Location:** `backend/apps/payments/processors/koko/client.py`
- **Class Name:** `KOKOAPIClient`
- **HTTP Library:** `httpx` for async/sync support
- **Timeout:** 30 seconds default
- **Retry Logic:** 3 attempts with exponential backoff

#### Configuration Management
```python
class KOKOAPIClient:
    def __init__(self, api_key: str, api_secret: str, base_url: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url.rstrip('/')
        self.session = httpx.Client(timeout=30)
```

#### Core HTTP Methods
1. **`_make_request(method: str, endpoint: str, data: dict = None) -> dict`**
   - Internal method for HTTP requests
   - Handle authentication headers
   - Implement retry logic with exponential backoff
   - Parse JSON responses and handle errors

2. **`create_order(order_data: dict) -> dict`**
   - POST request to create KOKO BNPL order
   - Return order creation response with checkout URL

3. **`get_order_status(order_id: str) -> dict`**
   - GET request to check order status
   - Return current order status and details

4. **`cancel_order(order_id: str) -> dict`**
   - POST request to cancel pending order
   - Return cancellation confirmation

#### Authentication Headers
```python
def _get_auth_headers(self, data: dict = None) -> dict:
    return {
        'X-API-Key': self.api_key,
        'Authorization': f'Bearer {self.api_key}',
        'Content-Type': 'application/json',
        'User-Agent': 'ERP-KOKO-Client/1.0'
    }
```

#### Request/Response Handling
- **Request Format:** JSON with proper serialization
- **Response Parsing:** JSON deserialization with error checking
- **Error Mapping:** Convert KOKO errors to internal exceptions
- **Logging:** Request/response logging with sensitive data masking

#### Retry Logic Implementation
- **Retry Conditions:** Network errors, 5xx responses, timeouts
- **Retry Strategy:** Exponential backoff (1s, 2s, 4s)
- **Max Retries:** 3 attempts
- **Non-Retryable:** 4xx client errors (except 429)

#### Error Handling
- **Network Errors:** Raise `KOKONetworkError`
- **API Errors:** Raise `KOKOAPIError` with error details
- **Timeout Errors:** Raise `KOKOTimeoutError`
- **Authentication Errors:** Raise `KOKOAuthenticationError`

#### Security Features
- Mask sensitive data in logs (API keys, customer data)
- Validate SSL certificates
- Use secure headers
- Implement request signing (prepared for Task 21)

### Validation Steps
1. Test successful API request to KOKO test endpoint
2. Verify authentication headers are correct
3. Test retry logic with network failures
4. Confirm error handling for various response codes
5. Validate timeout handling
6. Test JSON serialization/deserialization

---

## Task 20: Create Authentication

### Overview
Implement secure authentication mechanism for KOKO API requests using API key-based authentication with proper header management and credential validation.

### Implementation Requirements

#### Authentication Strategy
- **Method:** API Key Authentication
- **Header Name:** `X-API-Key`
- **Secondary Header:** `Authorization: Bearer {api_key}`
- **Credential Source:** Tenant-specific configuration
- **Validation:** Pre-request credential validation

#### Authentication Implementation
```python
class KOKOAuthentication:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = self._validate_api_key(api_key)
        self.api_secret = self._validate_api_secret(api_secret)
        
    def _validate_api_key(self, api_key: str) -> str:
        if not api_key or len(api_key) < 16:
            raise ValueError("Invalid KOKO API key format")
        return api_key
        
    def _validate_api_secret(self, api_secret: str) -> str:
        if not api_secret or len(api_secret) < 32:
            raise ValueError("Invalid KOKO API secret format")
        return api_secret
```

#### Authentication Headers
```python
def get_authentication_headers(self) -> dict:
    """Generate authentication headers for KOKO API requests."""
    return {
        'X-API-Key': self.api_key,
        'Authorization': f'Bearer {self.api_key}',
        'X-Client-Version': '1.0',
        'X-Integration-Type': 'ERP'
    }
```

#### Credential Management
- **Storage:** Encrypted in tenant configuration
- **Rotation:** Support for key rotation without downtime
- **Validation:** Real-time credential validation
- **Caching:** Cache valid credentials for performance

#### Environment-Specific Configuration
```python
# Production credentials
KOKO_PRODUCTION_API_KEY = "koko_prod_key_..."
KOKO_PRODUCTION_API_SECRET = "koko_prod_secret_..."

# Sandbox credentials
KOKO_SANDBOX_API_KEY = "koko_test_key_..."
KOKO_SANDBOX_API_SECRET = "koko_test_secret_..."
```

#### Authentication Middleware
- **Pre-Request:** Add authentication headers automatically
- **Response Handling:** Detect authentication failures
- **Token Refresh:** Handle token expiration (if applicable)
- **Error Recovery:** Retry with fresh credentials

#### Security Measures
- **Credential Masking:** Never log full credentials
- **Secure Storage:** Encrypt credentials at rest
- **Access Control:** Limit credential access to authorized services
- **Audit Trail:** Log authentication attempts and failures

#### Integration with API Client
```python
class KOKOAPIClient:
    def __init__(self, api_key: str, api_secret: str, base_url: str):
        self.auth = KOKOAuthentication(api_key, api_secret)
        
    def _prepare_headers(self, additional_headers: dict = None) -> dict:
        headers = self.auth.get_authentication_headers()
        if additional_headers:
            headers.update(additional_headers)
        return headers
```

### Validation Steps
1. Test authentication with valid KOKO credentials
2. Verify correct headers are generated
3. Test authentication failure handling
4. Validate credential format validation
5. Test environment switching (sandbox/production)
6. Confirm security measures (no credential logging)

---

## Task 21: Create Request Signing

### Overview
Implement HMAC-based request signing for KOKO API requests to ensure request integrity and prevent tampering. This adds an additional security layer beyond API key authentication.

### Implementation Requirements

#### Signing Algorithm
- **Algorithm:** HMAC-SHA256
- **Key:** API Secret from authentication
- **Signature Input:** Canonical request string
- **Output Format:** Hexadecimal digest
- **Header Name:** `X-KOKO-Signature`

#### Canonical Request Format
```python
def create_canonical_request(method: str, path: str, query_params: dict, 
                           headers: dict, body: str, timestamp: str) -> str:
    """Create canonical string for signing."""
    canonical_elements = [
        method.upper(),
        path,
        self._format_query_string(query_params),
        self._format_headers(headers),
        timestamp,
        self._hash_payload(body)
    ]
    return '\n'.join(canonical_elements)
```

#### Signature Generation
```python
import hmac
import hashlib
from datetime import datetime

class KOKORequestSigner:
    def __init__(self, api_secret: str):
        self.api_secret = api_secret.encode('utf-8')
    
    def sign_request(self, method: str, url: str, headers: dict, 
                    body: str = None) -> dict:
        """Generate signature and return headers."""
        timestamp = str(int(datetime.utcnow().timestamp()))
        parsed_url = urlparse(url)
        
        canonical_request = self.create_canonical_request(
            method, parsed_url.path, 
            parse_qs(parsed_url.query),
            headers, body or '', timestamp
        )
        
        signature = hmac.new(
            self.api_secret,
            canonical_request.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return {
            'X-KOKO-Signature': signature,
            'X-KOKO-Timestamp': timestamp,
            'X-KOKO-Algorithm': 'HMAC-SHA256'
        }
```

#### Integration with API Client
```python
class KOKOAPIClient:
    def __init__(self, api_key: str, api_secret: str, base_url: str):
        self.auth = KOKOAuthentication(api_key, api_secret)
        self.signer = KOKORequestSigner(api_secret)
    
    def _prepare_signed_request(self, method: str, url: str, 
                              data: dict = None) -> tuple:
        """Prepare request with authentication and signature."""
        headers = self.auth.get_authentication_headers()
        body = json.dumps(data) if data else None
        
        # Add signature headers
        signature_headers = self.signer.sign_request(method, url, headers, body)
        headers.update(signature_headers)
        
        return headers, body
```

#### Timestamp Validation
- **Tolerance Window:** 5 minutes before/after current time
- **Clock Skew:** Handle minor time differences
- **Replay Protection:** Prevent request replay attacks
- **Timestamp Format:** Unix timestamp (integer seconds)

#### Header Format
```python
# Required signature headers
X-KOKO-Signature: 3a7d8f2e9b1c4f6a8d2e5b7c9f1a3d6e8b4c7f2a5d8e1b4f7a2d5c8e1b4f7a2d
X-KOKO-Timestamp: 1674123456
X-KOKO-Algorithm: HMAC-SHA256
```

#### Error Handling
- **Invalid Signature:** Raise `KOKOSignatureError`
- **Timestamp Expired:** Raise `KOKOTimestampError`
- **Missing Headers:** Raise `KOKOMissingSignatureError`
- **Algorithm Mismatch:** Raise `KOKOAlgorithmError`

#### Security Considerations
- Never log the API secret used for signing
- Validate timestamp to prevent replay attacks
- Use constant-time comparison for signature verification
- Implement proper key rotation support

### Validation Steps
1. Test signature generation with known inputs
2. Verify signature headers are added correctly
3. Test timestamp validation logic
4. Confirm proper error handling for invalid signatures
5. Validate integration with authentication headers
6. Test request signing with various HTTP methods

---

## Task 22: Create Amount Formatter

### Overview
Implement the AmountFormatter class to handle proper currency formatting for KOKO BNPL transactions. This formatter ensures consistent LKR currency representation and decimal precision for Sri Lankan payment processing.

### Implementation Requirements

#### Formatter Class Structure
```python
class AmountFormatter:
    """Format monetary amounts for KOKO BNPL transactions."""
    
    DEFAULT_CURRENCY = 'LKR'
    DECIMAL_PLACES = 2
    MIN_AMOUNT = Decimal('100.00')  # 100 LKR minimum
    MAX_AMOUNT = Decimal('500000.00')  # 500,000 LKR maximum
```

#### Core Formatting Methods
```python
def format_amount(self, amount: Union[int, float, Decimal, str]) -> str:
    """Format amount to KOKO-compatible string format."""
    decimal_amount = self._to_decimal(amount)
    self._validate_amount(decimal_amount)
    return f"{decimal_amount:.2f}"

def format_currency_display(self, amount: Union[int, float, Decimal, str]) -> str:
    """Format amount for display with currency symbol."""
    formatted_amount = self.format_amount(amount)
    return f"LKR {formatted_amount:,}"
```

#### Amount Validation
```python
def _validate_amount(self, amount: Decimal) -> None:
    """Validate amount meets KOKO requirements."""
    if amount < self.MIN_AMOUNT:
        raise ValueError(f"Amount must be at least LKR {self.MIN_AMOUNT}")
    
    if amount > self.MAX_AMOUNT:
        raise ValueError(f"Amount cannot exceed LKR {self.MAX_AMOUNT}")
    
    if amount.as_tuple().exponent < -2:
        raise ValueError("Amount cannot have more than 2 decimal places")
```

#### Decimal Conversion
```python
def _to_decimal(self, amount: Union[int, float, Decimal, str]) -> Decimal:
    """Convert various amount types to Decimal with proper precision."""
    try:
        if isinstance(amount, Decimal):
            return amount.quantize(Decimal('0.01'))
        
        # Handle string amounts
        if isinstance(amount, str):
            # Remove commas and currency symbols
            clean_amount = amount.replace(',', '').replace('LKR', '').strip()
            return Decimal(clean_amount).quantize(Decimal('0.01'))
        
        # Convert float/int to Decimal
        return Decimal(str(amount)).quantize(Decimal('0.01'))
        
    except (InvalidOperation, ValueError) as e:
        raise ValueError(f"Invalid amount format: {amount}") from e
```

#### Sri Lankan Currency Specifics
```python
# KOKO BNPL amount limits for Sri Lanka
KOKO_MIN_AMOUNT = Decimal('1000.00')    # 1,000 LKR
KOKO_MAX_AMOUNT = Decimal('250000.00')  # 250,000 LKR
KOKO_INSTALLMENT_AMOUNTS = [
    Decimal('5000.00'),   # 5K LKR
    Decimal('10000.00'),  # 10K LKR
    Decimal('25000.00'),  # 25K LKR
    Decimal('50000.00'),  # 50K LKR
]
```

#### Integration with Payment Data
```python
def format_for_koko_api(self, payment_intent: PaymentIntent) -> dict:
    """Format payment amount for KOKO API request."""
    total_amount = self.format_amount(payment_intent.amount)
    
    return {
        'amount': total_amount,
        'currency': self.DEFAULT_CURRENCY,
        'amount_display': self.format_currency_display(payment_intent.amount),
        'installment_eligible': self._check_installment_eligibility(
            Decimal(total_amount)
        )
    }
```

#### Installment Calculation
```python
def calculate_installments(self, amount: Decimal, months: int = 3) -> list:
    """Calculate KOKO installment breakdown."""
    if not self._is_installment_eligible(amount):
        raise ValueError("Amount not eligible for installments")
    
    monthly_amount = (amount / months).quantize(Decimal('0.01'))
    installments = []
    
    for i in range(months):
        # Handle rounding for final installment
        if i == months - 1:
            final_amount = amount - (monthly_amount * (months - 1))
            installments.append(self.format_amount(final_amount))
        else:
            installments.append(self.format_amount(monthly_amount))
    
    return installments
```

#### Error Handling
- **Invalid Format:** Clear error messages for formatting issues
- **Out of Range:** Specific messages for min/max violations
- **Precision Errors:** Handle decimal precision overflow
- **Currency Mismatch:** Validate LKR currency requirement

### Validation Steps
1. Test amount formatting with various input types
2. Verify decimal precision handling
3. Test validation for min/max amounts
4. Confirm installment calculations
5. Validate error handling for invalid inputs
6. Test integration with KOKO API format requirements

---

## Task 23: Create Order Data Builder

### Overview
Implement the OrderDataBuilder class to construct properly formatted order data for KOKO BNPL API requests. This builder transforms internal PaymentIntent objects into KOKO-compatible order structures with proper Sri Lankan localization.

### Implementation Requirements

#### Builder Class Structure
```python
class OrderDataBuilder:
    """Build order data structures for KOKO BNPL API requests."""
    
    def __init__(self, amount_formatter: AmountFormatter):
        self.amount_formatter = amount_formatter
        self.logger = logging.getLogger(__name__)
```

#### Core Building Methods
```python
def build_order_data(self, payment_intent: PaymentIntent) -> dict:
    """Build complete order data for KOKO API."""
    order_data = {
        'order_id': self._generate_order_id(payment_intent),
        'merchant_reference': payment_intent.reference_id,
        'amount': self.amount_formatter.format_amount(payment_intent.amount),
        'currency': 'LKR',
        'description': self._build_order_description(payment_intent),
        'items': self._build_items_data(payment_intent),
        'customer': None,  # Will be set by CustomerDataBuilder
        'shipping': None,  # Will be set later
        'metadata': self._build_metadata(payment_intent)
    }
    
    return order_data
```

#### Order ID Generation
```python
def _generate_order_id(self, payment_intent: PaymentIntent) -> str:
    """Generate unique order ID for KOKO system."""
    # Format: KOKO-{tenant_id}-{timestamp}-{intent_id}
    tenant_id = payment_intent.tenant.id
    timestamp = int(datetime.utcnow().timestamp())
    intent_id = payment_intent.id
    
    order_id = f"KOKO-{tenant_id}-{timestamp}-{intent_id}"
    
    # Ensure ID meets KOKO requirements (alphanumeric, max 50 chars)
    if len(order_id) > 50:
        order_id = f"KOKO-{timestamp}-{intent_id}"
    
    return order_id
```

#### Order Description Builder
```python
def _build_order_description(self, payment_intent: PaymentIntent) -> str:
    """Build human-readable order description."""
    if payment_intent.description:
        return payment_intent.description
    
    # Generate description from order items
    items = payment_intent.order.items.all()
    if len(items) == 1:
        return f"Purchase: {items[0].product.name}"
    elif len(items) <= 3:
        product_names = [item.product.name for item in items]
        return f"Purchase: {', '.join(product_names)}"
    else:
        return f"Purchase: {len(items)} items"
```

#### Items Data Builder
```python
def _build_items_data(self, payment_intent: PaymentIntent) -> list:
    """Build items array for KOKO order."""
    items_data = []
    
    for order_item in payment_intent.order.items.all():
        item_data = {
            'sku': order_item.product.sku or f"ITEM-{order_item.product.id}",
            'name': order_item.product.name,
            'description': order_item.product.description or '',
            'quantity': int(order_item.quantity),
            'unit_price': self.amount_formatter.format_amount(
                order_item.unit_price
            ),
            'total_price': self.amount_formatter.format_amount(
                order_item.quantity * order_item.unit_price
            ),
            'category': self._get_product_category(order_item.product),
            'image_url': self._get_product_image(order_item.product)
        }
        items_data.append(item_data)
    
    return items_data
```

#### Product Category Mapping
```python
def _get_product_category(self, product) -> str:
    """Map internal product category to KOKO categories."""
    category_mapping = {
        'electronics': 'Electronics',
        'clothing': 'Fashion',
        'home': 'Home & Living',
        'books': 'Books & Media',
        'sports': 'Sports & Outdoor',
        'health': 'Health & Beauty',
        'food': 'Food & Beverage',
        'automotive': 'Automotive',
        'default': 'General Merchandise'
    }
    
    if hasattr(product, 'category') and product.category:
        category_key = product.category.slug.lower()
        return category_mapping.get(category_key, category_mapping['default'])
    
    return category_mapping['default']
```

#### Metadata Builder
```python
def _build_metadata(self, payment_intent: PaymentIntent) -> dict:
    """Build metadata for order tracking and analytics."""
    metadata = {
        'tenant_id': str(payment_intent.tenant.id),
        'order_id': str(payment_intent.order.id),
        'payment_intent_id': str(payment_intent.id),
        'source': 'erp_webstore',
        'integration_version': '1.0',
        'created_at': payment_intent.created_at.isoformat(),
        'customer_type': self._determine_customer_type(payment_intent),
        'order_channel': 'webstore'
    }
    
    # Add custom fields if available
    if hasattr(payment_intent, 'custom_fields'):
        metadata.update(payment_intent.custom_fields)
    
    return metadata
```

#### Customer Type Detection
```python
def _determine_customer_type(self, payment_intent: PaymentIntent) -> str:
    """Determine customer type for KOKO risk assessment."""
    customer = payment_intent.order.customer
    
    # Check order history
    previous_orders = customer.orders.filter(
        status__in=['completed', 'delivered']
    ).count()
    
    if previous_orders == 0:
        return 'new_customer'
    elif previous_orders < 5:
        return 'returning_customer'
    else:
        return 'loyal_customer'
```

#### Validation Methods
```python
def validate_order_data(self, order_data: dict) -> bool:
    """Validate order data meets KOKO requirements."""
    required_fields = ['order_id', 'amount', 'currency', 'items']
    
    for field in required_fields:
        if field not in order_data or not order_data[field]:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate amount format
    try:
        Decimal(order_data['amount'])
    except InvalidOperation:
        raise ValueError("Invalid amount format")
    
    # Validate items
    if not isinstance(order_data['items'], list) or len(order_data['items']) == 0:
        raise ValueError("Order must contain at least one item")
    
    return True
```

### Validation Steps
1. Test order data building with various PaymentIntent objects
2. Verify order ID generation uniqueness
3. Test items data formatting with different product types
4. Confirm metadata building with tenant context
5. Validate order description generation
6. Test error handling for missing required data

---

## Task 24: Create Customer Data Builder

### Overview
Implement the CustomerDataBuilder class to construct properly formatted customer data for KOKO BNPL API requests. This builder handles Sri Lankan customer information including NIC validation, phone number formatting, and address standardization for KOKO's risk assessment and verification processes.

### Implementation Requirements

#### Builder Class Structure
```python
class CustomerDataBuilder:
    """Build customer data structures for KOKO BNPL API requests."""
    
    def __init__(self):
        self.nic_formatter = NICFormatter()
        self.phone_formatter = PhoneFormatter()
        self.logger = logging.getLogger(__name__)
```

#### Core Building Methods
```python
def build_customer_data(self, payment_intent: PaymentIntent) -> dict:
    """Build complete customer data for KOKO API."""
    customer = payment_intent.order.customer
    
    customer_data = {
        'customer_id': str(customer.id),
        'reference_id': self._generate_customer_reference(customer),
        'personal_info': self._build_personal_info(customer),
        'contact_info': self._build_contact_info(customer),
        'address_info': self._build_address_info(customer, payment_intent),
        'identification': self._build_identification_info(customer),
        'account_info': self._build_account_info(customer),
        'preferences': self._build_preferences(customer)
    }
    
    return customer_data
```

#### Personal Information Builder
```python
def _build_personal_info(self, customer) -> dict:
    """Build personal information section."""
    return {
        'first_name': customer.first_name or '',
        'last_name': customer.last_name or '',
        'full_name': customer.get_full_name(),
        'date_of_birth': self._format_date_of_birth(customer),
        'gender': getattr(customer, 'gender', None),
        'title': getattr(customer, 'title', None),
        'preferred_name': getattr(customer, 'preferred_name', None)
    }
```

#### Contact Information Builder
```python
def _build_contact_info(self, customer) -> dict:
    """Build contact information with Sri Lankan formatting."""
    return {
        'email': customer.email,
        'email_verified': getattr(customer, 'email_verified', False),
        'phone': self.phone_formatter.format_for_koko(customer.phone),
        'phone_verified': getattr(customer, 'phone_verified', False),
        'alternative_phone': self._format_alternative_phone(customer),
        'preferred_contact_method': getattr(customer, 'preferred_contact', 'email')
    }
```

#### Address Information Builder
```python
def _build_address_info(self, customer, payment_intent: PaymentIntent) -> dict:
    """Build address information for billing and shipping."""
    # Get billing address
    billing_address = self._get_billing_address(customer, payment_intent)
    
    # Get shipping address
    shipping_address = self._get_shipping_address(payment_intent)
    
    return {
        'billing_address': self._format_address(billing_address),
        'shipping_address': self._format_address(shipping_address),
        'address_match': billing_address == shipping_address
    }
```

#### Address Formatting
```python
def _format_address(self, address) -> dict:
    """Format address for KOKO API."""
    if not address:
        return None
    
    return {
        'line_1': address.address_line_1 or '',
        'line_2': address.address_line_2 or '',
        'city': address.city or '',
        'district': getattr(address, 'district', ''),
        'province': getattr(address, 'province', ''),
        'postal_code': address.postal_code or '',
        'country': 'LK',  # Sri Lanka ISO code
        'landmark': getattr(address, 'landmark', ''),
        'address_type': getattr(address, 'address_type', 'residential')
    }
```

#### Identification Information Builder
```python
def _build_identification_info(self, customer) -> dict:
    """Build identification information with NIC formatting."""
    identification = {
        'nic': None,
        'nic_verified': False,
        'passport': None,
        'driving_license': None
    }
    
    # Format NIC if available
    if hasattr(customer, 'nic') and customer.nic:
        try:
            identification['nic'] = self.nic_formatter.format_for_koko(customer.nic)
            identification['nic_verified'] = getattr(customer, 'nic_verified', False)
        except ValueError as e:
            self.logger.warning(f"Invalid NIC format for customer {customer.id}: {e}")
    
    # Add other identification documents
    if hasattr(customer, 'passport') and customer.passport:
        identification['passport'] = customer.passport
    
    if hasattr(customer, 'driving_license') and customer.driving_license:
        identification['driving_license'] = customer.driving_license
    
    return identification
```

#### Account Information Builder
```python
def _build_account_info(self, customer) -> dict:
    """Build customer account information for risk assessment."""
    # Calculate account age
    account_age_days = (datetime.now().date() - customer.date_joined.date()).days
    
    # Count previous orders
    total_orders = customer.orders.count()
    completed_orders = customer.orders.filter(status='completed').count()
    
    # Calculate total spent
    total_spent = customer.orders.filter(
        status='completed'
    ).aggregate(
        total=models.Sum('total_amount')
    )['total'] or Decimal('0.00')
    
    return {
        'customer_since': customer.date_joined.isoformat(),
        'account_age_days': account_age_days,
        'total_orders': total_orders,
        'completed_orders': completed_orders,
        'total_spent': str(total_spent),
        'average_order_value': str(total_spent / max(completed_orders, 1)),
        'last_order_date': self._get_last_order_date(customer),
        'account_status': getattr(customer, 'account_status', 'active'),
        'loyalty_tier': self._determine_loyalty_tier(customer, total_spent)
    }
```

#### Preferences Builder
```python
def _build_preferences(self, customer) -> dict:
    """Build customer preferences for personalization."""
    return {
        'language': getattr(customer, 'preferred_language', 'en'),
        'currency_display': 'LKR',
        'communication_preferences': {
            'email_marketing': getattr(customer, 'email_marketing_opt_in', False),
            'sms_marketing': getattr(customer, 'sms_marketing_opt_in', False),
            'push_notifications': getattr(customer, 'push_notifications', True)
        },
        'payment_preferences': {
            'save_payment_methods': getattr(customer, 'save_payment_methods', True),
            'preferred_installments': getattr(customer, 'preferred_installments', 3)
        }
    }
```

#### Utility Methods
```python
def _generate_customer_reference(self, customer) -> str:
    """Generate unique customer reference for KOKO."""
    return f"CUST-{customer.id}-{int(customer.date_joined.timestamp())}"

def _format_date_of_birth(self, customer) -> str:
    """Format date of birth if available."""
    if hasattr(customer, 'date_of_birth') and customer.date_of_birth:
        return customer.date_of_birth.strftime('%Y-%m-%d')
    return None

def _determine_loyalty_tier(self, customer, total_spent: Decimal) -> str:
    """Determine customer loyalty tier based on spending."""
    if total_spent >= Decimal('500000.00'):  # 500K LKR
        return 'platinum'
    elif total_spent >= Decimal('200000.00'):  # 200K LKR
        return 'gold'
    elif total_spent >= Decimal('50000.00'):   # 50K LKR
        return 'silver'
    else:
        return 'bronze'
```

#### Validation Methods
```python
def validate_customer_data(self, customer_data: dict) -> bool:
    """Validate customer data meets KOKO requirements."""
    required_fields = ['personal_info', 'contact_info', 'identification']
    
    for field in required_fields:
        if field not in customer_data:
            raise ValueError(f"Missing required customer field: {field}")
    
    # Validate email
    personal_info = customer_data.get('personal_info', {})
    if not personal_info.get('full_name'):
        raise ValueError("Customer full name is required")
    
    # Validate contact info
    contact_info = customer_data.get('contact_info', {})
    if not contact_info.get('email') or not contact_info.get('phone'):
        raise ValueError("Customer email and phone are required")
    
    return True
```

### Validation Steps
1. Test customer data building with complete customer profiles
2. Verify address formatting for Sri Lankan addresses
3. Test identification info building with various NIC formats
4. Confirm phone number formatting integration
5. Validate account information calculations
6. Test error handling for incomplete customer data

---

## Task 25: Create NIC Formatter

### Overview
Implement the NICFormatter class to handle Sri Lankan National Identity Card (NIC) number formatting and validation. This formatter supports both old format (9 digits + V/X) and new format (12 digits) NICs, ensuring proper format standardization for KOKO BNPL verification processes.

### Implementation Requirements

#### Formatter Class Structure
```python
import re
from datetime import datetime

class NICFormatter:
    """Format and validate Sri Lankan NIC numbers."""
    
    # NIC format patterns
    OLD_NIC_PATTERN = re.compile(r'^(\d{9})([VvXx])$')
    NEW_NIC_PATTERN = re.compile(r'^(\d{12})$')
    
    # Valid suffixes for old format
    VALID_SUFFIXES = ['V', 'v', 'X', 'x']
```

#### Core Formatting Methods
```python
def format_for_koko(self, nic: str) -> str:
    """Format NIC for KOKO API requirements."""
    if not nic:
        raise ValueError("NIC cannot be empty")
    
    # Clean the input
    cleaned_nic = self._clean_nic_input(nic)
    
    # Validate and determine format
    if self._is_old_format(cleaned_nic):
        return self._format_old_nic(cleaned_nic)
    elif self._is_new_format(cleaned_nic):
        return self._format_new_nic(cleaned_nic)
    else:
        raise ValueError(f"Invalid NIC format: {nic}")

def _clean_nic_input(self, nic: str) -> str:
    """Clean NIC input by removing spaces and standardizing case."""
    # Remove spaces, hyphens, and other non-alphanumeric characters
    cleaned = re.sub(r'[^0-9VvXx]', '', nic.strip())
    return cleaned
```

#### Format Validation
```python
def _is_old_format(self, nic: str) -> bool:
    """Check if NIC matches old format (9 digits + V/X)."""
    return bool(self.OLD_NIC_PATTERN.match(nic))

def _is_new_format(self, nic: str) -> bool:
    """Check if NIC matches new format (12 digits)."""
    return bool(self.NEW_NIC_PATTERN.match(nic))

def validate_nic(self, nic: str) -> dict:
    """Validate NIC and return validation details."""
    try:
        formatted_nic = self.format_for_koko(nic)
        format_type = 'new' if len(formatted_nic) == 12 else 'old'
        
        validation_result = {
            'is_valid': True,
            'formatted_nic': formatted_nic,
            'format_type': format_type,
            'birth_year': self._extract_birth_year(formatted_nic),
            'gender': self._determine_gender(formatted_nic),
            'errors': []
        }
        
        return validation_result
        
    except ValueError as e:
        return {
            'is_valid': False,
            'formatted_nic': None,
            'format_type': None,
            'birth_year': None,
            'gender': None,
            'errors': [str(e)]
        }
```

#### Old Format Handling
```python
def _format_old_nic(self, nic: str) -> str:
    """Format old NIC (9 digits + V/X) with proper validation."""
    match = self.OLD_NIC_PATTERN.match(nic)
    if not match:
        raise ValueError("Invalid old NIC format")
    
    digits, suffix = match.groups()
    
    # Validate digit sequence
    if not self._validate_old_nic_digits(digits):
        raise ValueError("Invalid NIC digit sequence")
    
    # Standardize suffix to uppercase
    return digits + suffix.upper()

def _validate_old_nic_digits(self, digits: str) -> bool:
    """Validate old format NIC digit sequence."""
    # Check if all digits
    if not digits.isdigit():
        return False
    
    # Extract day of year (days 1-366)
    day_of_year = int(digits[2:5])
    
    # For females, subtract 500
    if day_of_year > 500:
        day_of_year -= 500
    
    # Validate day of year range
    return 1 <= day_of_year <= 366
```

#### New Format Handling
```python
def _format_new_nic(self, nic: str) -> str:
    """Format new NIC (12 digits) with proper validation."""
    if not nic.isdigit() or len(nic) != 12:
        raise ValueError("New NIC must be exactly 12 digits")
    
    # Validate digit sequence
    if not self._validate_new_nic_digits(nic):
        raise ValueError("Invalid new NIC digit sequence")
    
    return nic

def _validate_new_nic_digits(self, nic: str) -> bool:
    """Validate new format NIC digit sequence."""
    # Extract year (first 4 digits)
    year = int(nic[:4])
    current_year = datetime.now().year
    
    # Reasonable year range (1900 to current year)
    if not (1900 <= year <= current_year):
        return False
    
    # Extract day of year (next 3 digits)
    day_of_year = int(nic[4:7])
    
    # For females, subtract 500
    if day_of_year > 500:
        day_of_year -= 500
    
    # Validate day of year range
    return 1 <= day_of_year <= 366
```

#### Information Extraction
```python
def _extract_birth_year(self, formatted_nic: str) -> int:
    """Extract birth year from formatted NIC."""
    if len(formatted_nic) == 12:  # New format
        return int(formatted_nic[:4])
    else:  # Old format
        year_digits = int(formatted_nic[:2])
        # Assume 20th century for years 30-99, 21st century for 00-29
        return 2000 + year_digits if year_digits < 30 else 1900 + year_digits

def _determine_gender(self, formatted_nic: str) -> str:
    """Determine gender from NIC."""
    if len(formatted_nic) == 12:  # New format
        day_of_year = int(formatted_nic[4:7])
    else:  # Old format
        day_of_year = int(formatted_nic[2:5])
    
    # If day > 500, it's female (subtract 500 for actual day)
    return 'female' if day_of_year > 500 else 'male'
```

#### Display Formatting
```python
def format_for_display(self, nic: str) -> str:
    """Format NIC for human-readable display."""
    formatted_nic = self.format_for_koko(nic)
    
    if len(formatted_nic) == 12:  # New format
        # Format: YYYY XXX XXXX
        return f"{formatted_nic[:4]} {formatted_nic[4:7]} {formatted_nic[7:]}"
    else:  # Old format  
        # Format: XXXXXXXXX V
        return f"{formatted_nic[:-1]} {formatted_nic[-1]}"

def mask_nic_for_logging(self, nic: str) -> str:
    """Mask NIC for secure logging (show only first 3 and last 1 digits)."""
    if not nic or len(nic) < 4:
        return "****"
    
    return f"{nic[:3]}{'*' * (len(nic) - 4)}{nic[-1]}"
```

#### Conversion Methods
```python
def convert_old_to_new_format(self, old_nic: str) -> str:
    """Convert old format NIC to new format equivalent."""
    if not self._is_old_format(old_nic):
        raise ValueError("Input must be old format NIC")
    
    formatted_old = self._format_old_nic(old_nic)
    
    # Extract components
    year_digits = int(formatted_old[:2])
    day_of_year = int(formatted_old[2:5])
    serial = formatted_old[5:8]
    
    # Determine full year
    full_year = 2000 + year_digits if year_digits < 30 else 1900 + year_digits
    
    # Build new format: YYYY + day_of_year + serial + checksum
    new_nic_base = f"{full_year:04d}{day_of_year:03d}{serial}"
    
    # Add simple checksum (this is a simplified implementation)
    checksum = str(sum(int(d) for d in new_nic_base) % 10)
    
    return new_nic_base + checksum

def get_nic_info(self, nic: str) -> dict:
    """Get comprehensive information about the NIC."""
    validation = self.validate_nic(nic)
    
    if not validation['is_valid']:
        return validation
    
    formatted_nic = validation['formatted_nic']
    
    info = {
        **validation,
        'display_format': self.format_for_display(nic),
        'age_years': datetime.now().year - validation['birth_year'],
        'is_adult': (datetime.now().year - validation['birth_year']) >= 18,
        'masked_nic': self.mask_nic_for_logging(formatted_nic)
    }
    
    return info
```

### Validation Steps
1. Test old format NIC validation and formatting
2. Test new format NIC validation and formatting  
3. Verify gender and birth year extraction
4. Test error handling for invalid NIC formats
5. Confirm display formatting works correctly
6. Test NIC masking for secure logging

---

## Summary

This document has covered the implementation of the KOKO Processor foundation and data builders, establishing the core infrastructure for KOKO BNPL integration. The next document will focus on payment flow implementation, callback handling, and verification processes.

### Key Components Implemented
- **KOKOProcessor Class:** Main processor extending PaymentProcessor ABC
- **Factory Registration:** Integration with ProcessorFactory
- **API Client:** Secure HTTP client with authentication and signing
- **Data Builders:** Modular builders for orders, customers, and formatting
- **Sri Lankan Localization:** NIC formatting, +94 phones, LKR currency

### Next Steps
Continue with [Tasks 26-34: Payment Callback Verification](02_Tasks-26-34_Payment-Callback-Verify.md) to complete the KOKO processor implementation.