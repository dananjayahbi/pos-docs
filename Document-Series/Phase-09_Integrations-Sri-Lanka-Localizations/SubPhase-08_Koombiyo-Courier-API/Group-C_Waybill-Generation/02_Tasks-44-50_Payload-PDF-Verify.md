# Tasks 44-50: Payload Completion, PDF Handling, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** C - Waybill Generation  
> **Document:** 02 of 02  
> **Tasks Covered:** 44, 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-43_Model-API.md](01_Tasks-35-43_Model-API.md)
- **→ Next Group:** [../Group-D_Tracking-Webhooks/](../Group-D_Tracking-Webhooks/)

---

## Document Overview

This document completes the waybill payload construction with package dimensions, COD payment data, and order items description. It implements the response parser for handling Koombiyo API responses, creates the PDF label download functionality with local storage, and establishes comprehensive verification procedures for the entire waybill generation workflow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 44 | Create Package Data | Low | 20 min |
| 45 | Create COD Data | Low | 20 min |
| 46 | Create Items Description | Low | 20 min |
| 47 | Create Waybill Response | Medium | 30 min |
| 48 | Create Label Download | Medium | 30 min |
| 49 | Create Local Label Storage | Medium | 35 min |
| 50 | Verify Waybill Generation | Low | 25 min |

---

## Task 44: Create Package Data

### Overview
Implement the build_package_data method that constructs the package information section of the waybill request payload. This includes physical dimensions (weight, length, width, height) and any special handling requirements. Package data is used for shipping cost calculation and logistics planning.

### Dependencies
- Task 41: Create create_waybill API
- Order model with product/item relationships
- Product model with weight/dimension fields

### Instructions

1. **Create package data builder method**
   - Define method `build_package_data(order, **kwargs)`
   - Return dictionary with package fields
   - Accept optional custom dimensions parameter

2. **Calculate total weight**
   - Sum weight from all order items
   - Multiply product weight by quantity
   - Use default weight if product weight not set
   - Convert weight to Koombiyo's expected unit (kg)

3. **Determine package dimensions**
   - Check if custom dimensions provided in kwargs
   - Use order-level dimensions if configured
   - Use product dimensions for single-item orders
   - Use default/estimated dimensions for multi-item orders

4. **Build package data dictionary**
   - Add weight (in kilograms)
   - Add length (in centimeters)
   - Add width (in centimeters)
   - Add height (in centimeters)
   - Add package type (if applicable)
   - Add declared value (order total)

5. **Apply business rules**
   - Set minimum weight (0.1 kg) if calculated too low
   - Set maximum dimensions based on Koombiyo limits
   - Round weight to 2 decimal places
   - Round dimensions to 1 decimal place

6. **Handle missing data**
   - Use sensible defaults for missing dimensions
   - Calculate volumetric weight if needed
   - Log warning if using default values

7. **Validate package data**
   - Ensure weight is positive and reasonable
   - Ensure dimensions are positive
   - Check package fits Koombiyo size limits
   - Raise ValidationError if invalid

### Package Data Fields

| Field | Source | Required | Unit | Default |
|-------|--------|----------|------|---------|
| weight | Sum of item weights | Yes | kg | 1.0 kg |
| length | Product/order dimensions | No | cm | 30 cm |
| width | Product/order dimensions | No | cm | 20 cm |
| height | Product/order dimensions | No | cm | 10 cm |
| declared_value | Order total | Yes | LKR | Order total |
| package_type | Order config | No | - | "parcel" |

### Weight Calculation Logic

```
Calculate Total Weight:
    ├── For each order item:
    │   ├── Get product weight (kg)
    │   ├── Multiply by item quantity
    │   └── Add to total weight
    │
    ├── If total weight < 0.1 kg:
    │   └── Set weight = 0.1 kg (minimum)
    │
    ├── If total weight > 30 kg:
    │   └── Raise error (exceeds limit)
    │
    └── Round to 2 decimal places
```

### Package Data Structure

```json
{
  "package": {
    "weight": 2.5,
    "length": 35.0,
    "width": 25.0,
    "height": 15.0,
    "declared_value": 15000.00,
    "package_type": "parcel"
  }
}
```

### Weight Calculation Examples

| Scenario | Items | Calculation | Result |
|----------|-------|-------------|--------|
| Single item | 1x T-shirt (0.2kg) | 0.2 × 1 | 0.2 kg |
| Multiple same | 3x T-shirt (0.2kg) | 0.2 × 3 | 0.6 kg |
| Multiple different | 2x T-shirt (0.2kg), 1x Shoes (0.8kg) | (0.2×2) + (0.8×1) | 1.2 kg |
| No weight data | Any items | Default | 1.0 kg |

### Dimension Strategies

| Strategy | When to Use | Implementation |
|----------|-------------|----------------|
| Product dimensions | Single-item order | Use product.length/width/height |
| Custom dimensions | Manual override | Use kwargs['dimensions'] |
| Calculated dimensions | Multiple items | Estimate based on item count |
| Default dimensions | No data available | Use preset values (30×20×10) |

### Business Rules

| Rule | Value | Purpose |
|------|-------|---------|
| Minimum weight | 0.1 kg | Prevent zero/negative |
| Maximum weight | 30 kg | Koombiyo standard limit |
| Minimum dimension | 1 cm | Realistic minimum |
| Maximum dimension | 100 cm | Koombiyo size limit |
| Weight precision | 2 decimals | Standard precision |
| Dimension precision | 1 decimal | Centimeter accuracy |

### Volumetric Weight Calculation

```
Volumetric Weight Formula:
    (Length × Width × Height) / 5000

Example:
    (30cm × 20cm × 10cm) / 5000 = 1.2 kg

Billable Weight:
    max(actual_weight, volumetric_weight)
```

### Package Types

| Type | Code | Description |
|------|------|-------------|
| Parcel | "parcel" | Standard package |
| Document | "document" | Documents only |
| Fragile | "fragile" | Handle with care |
| Perishable | "perishable" | Time-sensitive |

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| weight | > 0 and <= 30 | "Weight must be between 0.1kg and 30kg" |
| length | > 0 and <= 100 | "Length must be between 1cm and 100cm" |
| width | > 0 and <= 100 | "Width must be between 1cm and 100cm" |
| height | > 0 and <= 100 | "Height must be between 1cm and 100cm" |
| declared_value | > 0 | "Declared value must be positive" |

### Default Values

| Field | Default | Reason |
|-------|---------|--------|
| weight | 1.0 kg | Typical small parcel |
| length | 30 cm | Standard shoe box |
| width | 20 cm | Standard shoe box |
| height | 10 cm | Standard shoe box |
| package_type | "parcel" | Most common type |

### Expected Outcome
- Functional build_package_data method
- Returns properly formatted package dictionary
- Calculates weight from order items
- Uses sensible defaults when data missing
- Validates dimensions within acceptable ranges

### Verification Checklist
- [ ] build_package_data method created
- [ ] Calculates total weight from order items
- [ ] Handles missing weight with defaults
- [ ] Determines package dimensions appropriately
- [ ] Applies minimum/maximum constraints
- [ ] Rounds values to proper precision
- [ ] Validates all fields
- [ ] Returns dictionary matching API requirements
- [ ] Logs warnings for default values used

---

## Task 45: Create COD Data

### Overview
Implement the build_cod_data method that constructs the Cash on Delivery (COD) payment information for the waybill request payload. This data is only included when the order payment method is COD, and it tells the courier how much cash to collect from the customer upon delivery.

### Dependencies
- Task 41: Create create_waybill API
- Order model with payment_method field
- Tenant configuration for COD fees

### Instructions

1. **Create COD data builder method**
   - Define method `build_cod_data(order, **kwargs)`
   - Return dictionary with COD fields or None
   - Check if order payment method is COD

2. **Check if COD payment**
   - Get order payment method
   - Return None if not COD (skip COD data)
   - Proceed with COD data if payment is COD

3. **Calculate COD amount**
   - Get order total amount
   - Include any delivery charges
   - Round to 2 decimal places
   - Ensure amount is positive

4. **Calculate COD fee**
   - Get COD fee from tenant configuration
   - Apply percentage-based fee if configured
   - Apply flat fee if configured
   - Default to 0 if no fee configured

5. **Build COD data dictionary**
   - Add cod_amount (amount to collect)
   - Add cod_fee (courier collection fee)
   - Add currency (LKR)
   - Add payment instructions (if applicable)

6. **Validate COD data**
   - Ensure COD amount is positive
   - Ensure COD amount matches order total
   - Validate fee calculation
   - Raise ValidationError if inconsistent

7. **Handle COD configuration**
   - Check tenant has COD enabled
   - Check Koombiyo supports COD
   - Use tenant's COD fee settings
   - Log COD transaction details

### COD Data Fields

| Field | Source | Required | Format |
|-------|--------|----------|--------|
| cod_amount | Order total | Yes | Decimal, 2 places |
| cod_fee | Tenant config | No | Decimal, 2 places |
| currency | Fixed | Yes | "LKR" |
| payment_instructions | Config | No | String |

### COD Detection Logic

```
Check Payment Method:
    ├── If order.payment_method == "COD":
    │   └── Build COD data
    │
    ├── If order.payment_method in ["card", "online"]:
    │   └── Return None (no COD data)
    │
    └── If order.payment_method == "bank_transfer":
        └── Return None (already paid)
```

### COD Data Structure

```json
{
  "cod": {
    "cod_amount": 15000.00,
    "cod_fee": 150.00,
    "currency": "LKR",
    "payment_instructions": "Collect cash and provide receipt"
  }
}
```

### COD Amount Calculation

| Component | Source | Example |
|-----------|--------|---------|
| Product subtotal | Order items | ₨12,000 |
| Delivery charge | Order shipping | ₨500 |
| Discount | Order discount | -₨500 |
| **Total COD Amount** | **Sum** | **₨12,000** |

### COD Fee Calculation

| Fee Type | Configuration | Calculation | Example |
|----------|---------------|-------------|---------|
| Percentage | 1% of order | amount × 0.01 | ₨12,000 × 0.01 = ₨120 |
| Flat rate | ₨150 per order | Fixed value | ₨150 |
| Tiered | By order value | Lookup table | < ₨10k = ₨100, >= ₨10k = ₨150 |
| None | Not configured | 0 | ₨0 |

### COD Fee Tiers Example

| Order Value Range | COD Fee |
|-------------------|---------|
| ₨0 - ₨5,000 | ₨75 |
| ₨5,001 - ₨10,000 | ₨100 |
| ₨10,001 - ₨20,000 | ₨150 |
| ₨20,001+ | ₨200 |

### Payment Method Mapping

| Payment Method | Code | Include COD Data |
|----------------|------|------------------|
| Cash on Delivery | "COD" | Yes |
| Credit Card | "card" | No |
| Online Payment | "online" | No |
| Bank Transfer | "bank_transfer" | No |
| Wallet | "wallet" | No |

### COD Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| Amount positive | cod_amount > 0 | "COD amount must be positive" |
| Amount matches order | cod_amount == order.total | "COD amount mismatch" |
| Fee is reasonable | cod_fee <= cod_amount × 0.1 | "COD fee too high" |
| Currency correct | currency == "LKR" | "Invalid currency" |

### COD Configuration Check

| Check | Purpose | Action if Failed |
|-------|---------|------------------|
| Tenant COD enabled | Feature flag | Raise ConfigurationError |
| COD fee configured | Pricing setup | Use default 0 or warn |
| Koombiyo supports COD | Provider capability | Raise ServiceError |
| Order amount within limit | Risk management | Raise ValidationError |

### COD Limit Enforcement

| Limit Type | Value | Purpose |
|------------|-------|---------|
| Minimum order | ₨500 | Avoid small COD |
| Maximum order | ₨100,000 | Risk management |
| Maximum fee | ₨500 | Customer protection |

### Expected Outcome
- Functional build_cod_data method
- Returns COD dictionary only for COD orders
- Returns None for non-COD orders
- Calculates COD fee based on tenant configuration
- Validates COD amount matches order total

### Verification Checklist
- [ ] build_cod_data method created
- [ ] Checks if order is COD payment
- [ ] Returns None for non-COD orders
- [ ] Calculates COD amount from order total
- [ ] Calculates COD fee from configuration
- [ ] Validates COD data
- [ ] Returns dictionary matching API requirements
- [ ] Handles missing COD configuration gracefully

---

## Task 46: Create Items Description

### Overview
Implement the build_items_description method that generates a text description of the order items for the waybill. This description appears on the shipping label and helps courier staff and customers identify the package contents. The description should be concise yet informative.

### Dependencies
- Task 41: Create create_waybill API
- Order model with order items relationship
- Product model with names and SKUs

### Instructions

1. **Create items description builder method**
   - Define method `build_items_description(order, **kwargs)`
   - Return string description of items
   - Accept optional format parameter

2. **Retrieve order items**
   - Get all items from order.items.all()
   - Include product name and quantity
   - Sort items alphabetically or by quantity

3. **Format item descriptions**
   - Format each item as "Quantity x Product Name"
   - Example: "2 x Cotton T-Shirt, 1 x Running Shoes"
   - Keep description concise (max 200 characters)

4. **Handle long descriptions**
   - Truncate if exceeds max length
   - Use "..." to indicate truncation
   - Prioritize most important items
   - Ensure meaningful truncation

5. **Add item categories (optional)**
   - Group items by category if helpful
   - Example: "Clothing (3 items), Accessories (2 items)"
   - Use only for multi-category orders

6. **Build description string**
   - Join item descriptions with commas
   - Add total item count if many items
   - Example: "5 items: T-Shirt, Jeans, Hat, ..."

7. **Validate description**
   - Ensure description is not empty
   - Check length within limits
   - Remove special characters if needed
   - Ensure UTF-8 compatible

### Items Description Format

| Format Style | Example | Use Case |
|--------------|---------|----------|
| Detailed | "2 x Cotton T-Shirt (Blue), 1 x Denim Jeans" | Few items |
| Simple | "T-Shirt, Jeans, Shoes" | Medium items |
| Summarized | "5 items: Clothing and Accessories" | Many items |
| Categorized | "Clothing (3), Electronics (1)" | Mixed items |

### Description Building Logic

```
Build Items Description:
    ├── Get all order items
    │
    ├── For each item:
    │   ├── Format: "{quantity} x {product_name}"
    │   └── Add to items list
    │
    ├── Join items with ", "
    │
    ├── If length > 200 characters:
    │   ├── Take first N items that fit
    │   └── Add "..." at end
    │
    └── Return description string
```

### Description Examples

| Order Items | Generated Description |
|-------------|-----------------------|
| 1 T-Shirt | "Cotton T-Shirt" |
| 2 T-Shirts, 1 Jeans | "2 x Cotton T-Shirt, Denim Jeans" |
| 5 different items | "T-Shirt, Jeans, Shoes, Hat, Belt" |
| 10+ items | "10 items: Clothing and Accessories" |

### Character Limit Handling

| Total Length | Strategy | Example |
|--------------|----------|---------|
| < 100 chars | Use full names | "Cotton T-Shirt, Denim Jeans, Running Shoes" |
| 100-150 chars | Abbreviate | "T-Shirt, Jeans, Shoes, Hat, Belt" |
| 150-200 chars | Truncate | "T-Shirt, Jeans, Shoes, Hat, ..." |
| > 200 chars | Summarize | "8 items: Clothing (5), Accessories (3)" |

### Product Name Simplification

| Original Name | Simplified | Reason |
|---------------|------------|--------|
| "Premium Cotton T-Shirt - Blue - Large" | "T-Shirt" | Remove details |
| "Men's Denim Jeans - Slim Fit - 32x34" | "Jeans" | Core item name |
| "Nike Running Shoes - Air Max" | "Running Shoes" | Generic name |

### Special Characters Handling

| Character | Action | Reason |
|-----------|--------|--------|
| & | Replace with "and" | Better readability |
| " | Remove | Avoid quote issues |
| < > | Remove | Avoid HTML/XML issues |
| Emoji | Remove | API compatibility |

### Multi-Item Formatting

| Item Count | Format | Example |
|------------|--------|---------|
| 1 item | "{product}" | "Cotton T-Shirt" |
| 2-3 items | "{item1}, {item2}" | "T-Shirt, Jeans" |
| 4-6 items | "{item1}, {item2}, ..." | "T-Shirt, Jeans, Shoes, ..." |
| 7+ items | "{count} items" | "8 items: Assorted Clothing" |

### Category Grouping

| Categories | Description Format |
|------------|-------------------|
| Single category | "Clothing (5 items)" |
| Two categories | "Clothing (3), Accessories (2)" |
| Three+ categories | "Clothing, Accessories, Electronics" |

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| Not empty | description != "" | "Items description required" |
| Max length | len <= 200 | "Description too long" |
| Valid characters | UTF-8 compatible | "Invalid characters in description" |
| At least one item | order.items.count() > 0 | "Order has no items" |

### Expected Outcome
- Functional build_items_description method
- Returns concise description of order items
- Handles long descriptions with truncation
- Removes special characters if needed
- Stays within character limits

### Verification Checklist
- [ ] build_items_description method created
- [ ] Retrieves all order items
- [ ] Formats items as "quantity x name"
- [ ] Joins items with appropriate separator
- [ ] Truncates if exceeds max length
- [ ] Handles single vs multiple items
- [ ] Validates description not empty
- [ ] Returns string within character limit

---

## Task 47: Create Waybill Response

### Overview
Implement the parse_waybill_response method that parses the JSON response from Koombiyo's waybill creation API. This parser extracts essential data (waybill_number, barcode, pdf_url) and handles various response formats and error conditions.

### Dependencies
- Task 41: Create create_waybill API
- Understanding of Koombiyo API response format

### Instructions

1. **Create response parser method**
   - Define method `parse_waybill_response(response, **kwargs)`
   - Accept response object or JSON dict
   - Return dictionary with parsed data
   - Raise exception on parse errors

2. **Validate response status**
   - Check HTTP status code is 200
   - Check response has valid JSON
   - Check JSON has expected structure
   - Raise APIError if invalid

3. **Parse success response**
   - Extract waybill_number from response
   - Extract barcode from response
   - Extract pdf_url from response
   - Extract any additional metadata

4. **Handle response variations**
   - Handle different field names (waybill_no vs waybill_number)
   - Handle nested response structure
   - Handle missing optional fields
   - Handle different data types

5. **Parse error responses**
   - Check for error flag in response
   - Extract error message if present
   - Extract error code if present
   - Raise appropriate exception with details

6. **Validate parsed data**
   - Ensure waybill_number is not empty
   - Ensure barcode is not empty
   - Ensure pdf_url is valid URL
   - Raise ValidationError if invalid

7. **Build result dictionary**
   - Create standardized dictionary structure
   - Include all extracted fields
   - Include metadata if available
   - Return for Waybill model population

### Response Structure Examples

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "waybill_number": "KBY123456789",
    "barcode": "123456789",
    "pdf_url": "https://api.koombiyo.lk/labels/KBY123456789.pdf",
    "tracking_url": "https://koombiyo.lk/track/KBY123456789",
    "estimated_delivery": "2026-02-01"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "Receiver address is invalid or unserviceable"
  }
}
```

### Response Parsing Flow

```
Parse Response:
    ├── Validate HTTP status code
    │   └── If not 200: Raise APIError
    │
    ├── Parse JSON
    │   └── If parse fails: Raise ResponseParseError
    │
    ├── Check status field
    │   ├── If "success": Parse data
    │   └── If "error": Raise APIError with message
    │
    ├── Extract fields:
    │   ├── waybill_number (required)
    │   ├── barcode (required)
    │   ├── pdf_url (required)
    │   └── metadata (optional)
    │
    ├── Validate extracted data
    │
    └── Return parsed dictionary
```

### Field Mapping

| API Response Field | Internal Field | Required | Fallback |
|--------------------|---------------|----------|----------|
| waybill_number / waybill_no | waybill_number | Yes | Raise error |
| barcode / barcode_value | barcode | Yes | Use waybill_number |
| pdf_url / label_url | pdf_url | Yes | Raise error |
| tracking_url | tracking_url | No | Generate from waybill |
| estimated_delivery | estimated_delivery | No | None |

### Response Status Codes

| HTTP Code | Meaning | Action |
|-----------|---------|--------|
| 200 | Success | Parse data |
| 400 | Bad request | Extract error message |
| 401 | Unauthorized | Check API credentials |
| 500 | Server error | Retry or escalate |
| 503 | Service unavailable | Retry later |

### Error Code Handling

| Error Code | Meaning | User Message |
|------------|---------|--------------|
| INVALID_ADDRESS | Address not serviceable | "Delivery not available to this address" |
| INVALID_PHONE | Phone format wrong | "Please provide valid phone number" |
| INSUFFICIENT_BALANCE | Account credit low | "Courier service temporarily unavailable" |
| DUPLICATE_ORDER | Already created | "Waybill already exists for this order" |

### Data Validation

| Field | Validation | Error Message |
|-------|------------|---------------|
| waybill_number | Not empty, alphanumeric | "Invalid waybill number in response" |
| barcode | Not empty | "Missing barcode in response" |
| pdf_url | Valid URL, HTTPS | "Invalid PDF URL in response" |

### Parsed Result Structure

```python
{
    'waybill_number': 'KBY123456789',
    'barcode': '123456789',
    'pdf_url': 'https://api.koombiyo.lk/labels/KBY123456789.pdf',
    'tracking_url': 'https://koombiyo.lk/track/KBY123456789',
    'metadata': {
        'estimated_delivery': '2026-02-01',
        'service_type': 'standard'
    }
}
```

### Error Handling Strategy

| Error Type | Exception Class | Recovery |
|------------|----------------|----------|
| Invalid JSON | ResponseParseError | Log and alert |
| Missing required field | ResponseParseError | Log and alert |
| API error response | APIError | Show to user |
| Network error | APIConnectionError | Retry |

### Logging Requirements

| Event | Log Level | Details to Log |
|-------|-----------|----------------|
| Response received | DEBUG | Full response JSON |
| Parse success | INFO | Waybill number |
| Parse error | ERROR | Error details, response |
| Field missing | WARNING | Field name, response |

### Expected Outcome
- Functional parse_waybill_response method
- Extracts all required fields from API response
- Handles success and error responses
- Validates parsed data
- Returns standardized dictionary

### Verification Checklist
- [ ] parse_waybill_response method created
- [ ] Validates HTTP status code
- [ ] Parses JSON response
- [ ] Extracts waybill_number
- [ ] Extracts barcode
- [ ] Extracts pdf_url
- [ ] Handles error responses
- [ ] Validates extracted data
- [ ] Returns standardized dictionary
- [ ] Raises appropriate exceptions on errors
- [ ] Logs parsing events

---

## Task 48: Create Label Download

### Overview
Implement the download_label method that downloads the shipping label PDF from the URL provided in the waybill creation response. This method handles HTTP downloads, validates the PDF content, and prepares the file for local storage.

### Dependencies
- Task 47: Create Waybill Response Parser
- Waybill model with pdf_url field
- HTTP client library (requests)

### Instructions

1. **Create label download method**
   - Define method `download_label(waybill, **kwargs)`
   - Accept waybill instance with pdf_url
   - Return PDF file content as bytes
   - Raise exception on download failure

2. **Validate PDF URL**
   - Check pdf_url is not empty
   - Check URL is valid format
   - Check URL uses HTTPS protocol
   - Raise ValidationError if invalid

3. **Configure HTTP request**
   - Set reasonable timeout (30 seconds)
   - Add user agent header
   - Add authentication if required
   - Configure retry logic

4. **Make download request**
   - Send GET request to pdf_url
   - Stream response to handle large files
   - Check response status code
   - Read response content

5. **Validate PDF content**
   - Check response content-type is PDF
   - Check file starts with PDF magic number (%PDF)
   - Check file size is reasonable (> 1KB, < 10MB)
   - Raise ValidationError if invalid

6. **Handle download errors**
   - Catch connection timeout errors
   - Catch HTTP errors (404, 403, 500)
   - Catch SSL/TLS errors
   - Log error details and retry if appropriate

7. **Return PDF content**
   - Return PDF as bytes object
   - Include metadata (filename, size)
   - Ready for storage (Task 49)

### Label Download Flow

```
Download Label:
    ├── Validate pdf_url exists
    │
    ├── Configure HTTP client
    │   ├── Timeout: 30 seconds
    │   ├── User-Agent: LCC/1.0
    │   └── Stream: True
    │
    ├── Send GET request
    │   └── If timeout: Retry 2 times
    │
    ├── Check status code
    │   ├── 200: Continue
    │   ├── 404: Raise NotFoundError
    │   └── Other: Raise APIError
    │
    ├── Validate content
    │   ├── Content-Type: application/pdf
    │   ├── Magic number: %PDF
    │   └── Size: 1KB - 10MB
    │
    └── Return PDF bytes
```

### HTTP Request Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Method | GET | Download resource |
| Timeout | 30 seconds | Prevent hanging |
| User-Agent | "LCC/1.0" | Identify client |
| Stream | True | Handle large files |
| Verify SSL | True | Security |
| Max Redirects | 3 | Follow redirects |

### PDF Validation Checks

| Check | Method | Purpose |
|-------|--------|---------|
| Content-Type | Check response header | Ensure PDF type |
| Magic Number | Check first 4 bytes == b'%PDF' | Verify PDF format |
| File Size | Check content length | Reasonable size |
| Readability | Try opening with PDF library | Valid PDF structure |

### PDF Magic Number

```
Valid PDF files start with:
    %PDF-1.4
    %PDF-1.5
    %PDF-1.7

Bytes representation:
    b'%PDF'
    hex: 25 50 44 46
```

### File Size Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Minimum | 1 KB | Too small to be valid |
| Maximum | 10 MB | Unusually large label |
| Typical | 50-200 KB | Expected range |

### HTTP Status Code Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Download content |
| 301/302 | Redirect | Follow redirect |
| 403 | Forbidden | Check authentication |
| 404 | Not found | PDF expired or invalid |
| 500 | Server error | Retry after delay |
| 503 | Unavailable | Retry after delay |

### Error Handling

| Error Type | Exception | Retry | User Message |
|------------|-----------|-------|--------------|
| Timeout | TimeoutError | Yes (2x) | "Download timed out, retrying..." |
| 404 Not Found | NotFoundError | No | "Label PDF not found" |
| Invalid PDF | ValidationError | No | "Downloaded file is not valid PDF" |
| Connection error | ConnectionError | Yes (2x) | "Connection failed, retrying..." |

### Retry Logic

```
Retry Strategy:
    ├── Max retries: 2
    ├── Initial delay: 2 seconds
    ├── Backoff multiplier: 2
    │
    ├── Attempt 1: Immediate
    ├── Attempt 2: Wait 2 seconds
    └── Attempt 3: Wait 4 seconds
```

### Download Metadata

| Metadata | Source | Use |
|----------|--------|-----|
| Filename | URL path or waybill_number | Storage path |
| File size | Content-Length header | Validation |
| Content type | Content-Type header | Validation |
| Download time | Timestamp | Auditing |

### Expected Outcome
- Functional download_label method
- Downloads PDF from provided URL
- Validates PDF content and format
- Handles errors with retry logic
- Returns PDF bytes ready for storage

### Verification Checklist
- [ ] download_label method created
- [ ] Validates pdf_url before download
- [ ] Configures HTTP client with timeout
- [ ] Sends GET request to PDF URL
- [ ] Checks response status code
- [ ] Validates content-type is PDF
- [ ] Checks PDF magic number
- [ ] Validates file size range
- [ ] Implements retry logic for failures
- [ ] Returns PDF content as bytes
- [ ] Logs download events

---

## Task 49: Create Local Label Storage

### Overview
Implement the store_label method that saves the downloaded PDF label to local or S3 storage. This provides permanent access to labels even if the original Koombiyo URL expires, and allows for faster retrieval when displaying or reprinting labels.

### Dependencies
- Task 48: Create Label Download
- File storage configuration (local or S3)
- Waybill model with storage path field

### Instructions

1. **Create label storage method**
   - Define method `store_label(waybill, pdf_content, **kwargs)`
   - Accept waybill instance and PDF bytes
   - Return storage path or URL
   - Raise exception on storage failure

2. **Determine storage path**
   - Create path structure: `waybills/{tenant_id}/{order_id}/`
   - Generate filename: `{waybill_number}.pdf`
   - Full path: `waybills/{tenant_id}/{order_id}/{waybill_number}.pdf`
   - Ensure path is unique and organized

3. **Create directory structure**
   - Check if directory exists
   - Create directory if needed
   - Set appropriate permissions
   - Handle permission errors

4. **Save PDF file**
   - Write PDF bytes to file
   - Use Django's file storage API
   - Handle local or S3 storage transparently
   - Verify file saved successfully

5. **Update waybill record**
   - Add local_path field to Waybill model (if not exists)
   - Store relative path in local_path field
   - Maintain pdf_url for original URL
   - Save waybill instance

6. **Generate access URL**
   - Generate URL for accessing stored PDF
   - Use Django's storage URL method
   - Return URL for display/download
   - Handle private vs public storage

7. **Implement cleanup (optional)**
   - Plan for old label cleanup
   - Consider retention policy
   - Document cleanup strategy

### Storage Path Structure

```
Storage Root
└── waybills/
    └── {tenant_id}/
        └── {order_id}/
            ├── KBY123456789.pdf
            ├── KBY987654321.pdf (if re-shipped)
            └── ...
```

### Path Components

| Component | Example | Purpose |
|-----------|---------|---------|
| Storage root | `/media/` or `s3://bucket/` | Storage location |
| App folder | `waybills/` | Organize by type |
| Tenant ID | `tenant_abc123/` | Tenant isolation |
| Order ID | `order_456/` | Group by order |
| Filename | `KBY123456789.pdf` | Unique identifier |

### Full Path Examples

| Storage Type | Full Path |
|--------------|-----------|
| Local | `/media/waybills/tenant_123/order_456/KBY789.pdf` |
| S3 | `s3://lcc-media/waybills/tenant_123/order_456/KBY789.pdf` |
| Azure | `https://lcc.blob.core.windows.net/waybills/tenant_123/order_456/KBY789.pdf` |

### File Storage Configuration

| Setting | Local | S3 | Purpose |
|---------|-------|-------|---------|
| MEDIA_ROOT | `/app/media/` | N/A | Local storage path |
| MEDIA_URL | `/media/` | N/A | URL prefix |
| AWS_STORAGE_BUCKET_NAME | N/A | `lcc-media` | S3 bucket |
| AWS_S3_REGION_NAME | N/A | `ap-south-1` | S3 region |

### Storage Method Flow

```
Store Label:
    ├── Generate storage path
    │   └── waybills/{tenant}/{order}/{waybill_number}.pdf
    │
    ├── Check directory exists
    │   └── Create if needed
    │
    ├── Write PDF file
    │   ├── Open file handle
    │   ├── Write bytes
    │   └── Close handle
    │
    ├── Verify file saved
    │   └── Check file exists and size > 0
    │
    ├── Update Waybill model
    │   ├── Set local_path
    │   └── Save instance
    │
    └── Return access URL
```

### Django File Storage API

| Method | Purpose | Example |
|--------|---------|---------|
| storage.save() | Save file | `storage.save(path, ContentFile(pdf_bytes))` |
| storage.exists() | Check existence | `storage.exists(path)` |
| storage.url() | Get URL | `storage.url(path)` |
| storage.delete() | Delete file | `storage.delete(path)` |

### Waybill Model Update

```python
# Add field to Waybill model:
local_path = models.CharField(
    max_length=500,
    null=True,
    blank=True,
    help_text="Local storage path for label PDF"
)

# Update after storage:
waybill.local_path = storage_path
waybill.save(update_fields=['local_path'])
```

### Access URL Generation

| Storage Type | URL Format |
|--------------|------------|
| Local | `http://localhost:8000/media/waybills/...pdf` |
| S3 Public | `https://s3.region.amazonaws.com/bucket/waybills/...pdf` |
| S3 Signed | `https://bucket.s3.amazonaws.com/...pdf?signature=...` |

### File Permissions

| Storage Type | Permissions | Purpose |
|--------------|-------------|---------|
| Local | 644 (rw-r--r--) | Owner write, others read |
| S3 Private | ACL: private | Tenant-only access |
| S3 Public | ACL: public-read | Anyone can access |

### Error Handling

| Error Type | Exception | Action |
|------------|-----------|--------|
| Directory creation failed | PermissionError | Log and alert admin |
| Disk full | IOError | Alert admin, use fallback |
| S3 connection failed | ConnectionError | Retry with backoff |
| File write failed | IOError | Log and return original URL |

### Storage Fallback Strategy

```
Primary: Save to configured storage
    │
    ├── Success: Return local path
    │
    └── Failure:
        └── Keep original pdf_url
        └── Log error
        └── Alert admin
        └── Continue (use original URL)
```

### Retention Policy

| Policy | Duration | Action |
|--------|----------|--------|
| Active orders | Permanent | Keep indefinitely |
| Completed orders | 2 years | Keep for compliance |
| Cancelled orders | 6 months | Delete after period |
| Old waybills | 1 year | Archive to cold storage |

### Expected Outcome
- Functional store_label method
- Saves PDF to configured storage
- Organized directory structure
- Updates Waybill model with storage path
- Returns access URL for the stored PDF

### Verification Checklist
- [ ] store_label method created
- [ ] Generates proper storage path
- [ ] Creates directory structure
- [ ] Saves PDF file successfully
- [ ] Works with local storage
- [ ] Works with S3 storage (if configured)
- [ ] Updates Waybill.local_path field
- [ ] Generates access URL
- [ ] Handles storage errors gracefully
- [ ] Logs storage events
- [ ] File accessible via returned URL

---

## Task 50: Verify Waybill Generation

### Overview
Implement comprehensive verification procedures for the entire waybill generation workflow. This includes unit tests, integration tests, end-to-end testing scenarios, and manual verification steps to ensure all components work together correctly and handle edge cases appropriately.

### Dependencies
- All previous tasks (35-49) must be complete
- Test framework configured
- Sample order data available
- Koombiyo test API credentials

### Instructions

1. **Create unit tests**
   - Test Waybill model field validations
   - Test builder methods (sender, receiver, package, COD, items)
   - Test response parser with various inputs
   - Test individual helper methods
   - Mock external API calls

2. **Create integration tests**
   - Test complete create_waybill flow
   - Test with real database
   - Test with mocked API responses
   - Test error handling paths
   - Test transaction rollback on failure

3. **Create end-to-end tests**
   - Test with Koombiyo test API
   - Test complete flow from order to PDF storage
   - Test PDF download and storage
   - Test with various order types (COD, prepaid)
   - Test with different product configurations

4. **Test edge cases**
   - Empty or missing data
   - Very long product names
   - Special characters in addresses
   - Invalid phone numbers
   - API timeout scenarios
   - Network failures
   - Duplicate waybill creation attempts

5. **Create manual test cases**
   - Document step-by-step verification process
   - Create test orders with various scenarios
   - Verify PDF generation and display
   - Verify data accuracy on labels
   - Check database records

6. **Implement validation checks**
   - Verify waybill number is unique
   - Verify PDF is valid and printable
   - Verify order status updates
   - Verify local storage works
   - Verify URLs are accessible

7. **Create monitoring and alerts**
   - Log all waybill creations
   - Track success/failure rates
   - Alert on repeated failures
   - Monitor API response times
   - Track storage usage

### Test Categories

| Category | Focus | Tools |
|----------|-------|-------|
| Unit Tests | Individual functions | pytest, unittest |
| Integration Tests | Component interaction | pytest, Django TestCase |
| E2E Tests | Full workflow | pytest, factory_boy |
| Manual Tests | User scenarios | Test checklist |
| Performance Tests | Load and speed | pytest-benchmark |

### Unit Test Coverage

| Component | Test Cases | Example |
|-----------|------------|---------|
| Waybill Model | Field validation | Test unique waybill_number |
| build_sender_data | Data building | Test with missing phone |
| build_receiver_data | Data extraction | Test with invalid address |
| build_package_data | Weight calculation | Test with multiple items |
| build_cod_data | COD detection | Test with non-COD order |
| build_items_description | Text generation | Test with long names |
| parse_waybill_response | Response parsing | Test with error response |
| download_label | PDF download | Test with invalid URL |
| store_label | File storage | Test with permissions error |

### Integration Test Scenarios

| Scenario | Description | Expected Outcome |
|----------|-------------|------------------|
| Happy path | Valid order, all data present | Waybill created successfully |
| COD order | Order with COD payment | COD data included, fee calculated |
| Multi-item order | Order with 5+ items | Items description truncated |
| Missing phone | Customer phone missing | ValidationError raised |
| API timeout | Koombiyo API times out | Retry attempted, then error |
| Invalid response | API returns malformed JSON | ResponseParseError raised |
| Storage failure | Disk full or S3 down | Original URL retained, error logged |

### End-to-End Test Flow

```
E2E Test:
    ├── Create test order
    │   ├── 2 products
    │   ├── COD payment
    │   └── Valid shipping address
    │
    ├── Call create_waybill(order)
    │
    ├── Verify API called
    │   └── Check request payload
    │
    ├── Verify Waybill created
    │   ├── waybill_number populated
    │   ├── barcode populated
    │   ├── pdf_url populated
    │   └── status = PENDING
    │
    ├── Verify PDF downloaded
    │   └── local_path populated
    │
    ├── Verify file exists
    │   ├── File path correct
    │   ├── File size > 1KB
    │   └── File is valid PDF
    │
    └── Verify access URL works
        └── GET request returns PDF
```

### Edge Case Tests

| Edge Case | Test Input | Expected Behavior |
|-----------|------------|-------------------|
| No phone number | customer.phone = None | Raise ValidationError |
| Very long address | 300 character address | Truncate to 200 chars |
| Special chars | Name with emoji | Remove invalid chars |
| Zero weight | All products weight = 0 | Use default 1.0 kg |
| Huge order | 50 items | Summarize items description |
| Duplicate call | Call twice for same order | Return existing waybill |
| API 500 error | Koombiyo returns 500 | Retry then raise error |

### Manual Verification Checklist

- [ ] Create test order in admin panel
- [ ] Set payment method to COD
- [ ] Add shipping address with valid phone
- [ ] Trigger waybill generation
- [ ] Verify waybill record created in database
- [ ] Check waybill_number is populated
- [ ] Check barcode is populated
- [ ] Check status is PENDING
- [ ] Click PDF URL link
- [ ] Verify PDF opens and displays correctly
- [ ] Check sender address is correct
- [ ] Check receiver address is correct
- [ ] Check items list is accurate
- [ ] Check COD amount is correct
- [ ] Verify barcode is scannable
- [ ] Print PDF and verify quality
- [ ] Check local storage path exists
- [ ] Access PDF via local URL
- [ ] Test with prepaid order (no COD)
- [ ] Test with multiple items

### Validation Checks

| Check | Method | Expected Result |
|-------|--------|-----------------|
| Waybill uniqueness | Query database | One waybill per order (or more if re-shipped) |
| PDF validity | Open with PDF reader | PDF opens without errors |
| PDF content | Visual inspection | All data correct and readable |
| Barcode scannable | Scan with app | Barcode scans successfully |
| Data accuracy | Compare with order | All fields match order data |
| Phone format | Check on PDF | +94 XX XXX XXXX format |
| COD amount | Check on PDF | Matches order total |

### Performance Benchmarks

| Operation | Target Time | Acceptable Time | Alert If |
|-----------|-------------|-----------------|----------|
| create_waybill (full) | < 3 seconds | < 5 seconds | > 10 seconds |
| API call | < 2 seconds | < 3 seconds | > 5 seconds |
| PDF download | < 1 second | < 2 seconds | > 5 seconds |
| File storage | < 0.5 seconds | < 1 second | > 3 seconds |

### Monitoring Metrics

| Metric | Track | Alert Threshold |
|--------|-------|-----------------|
| Success rate | Successful creations / Total | < 95% |
| API errors | 4xx, 5xx responses | > 5% |
| Timeouts | Request timeouts | > 2% |
| Storage failures | Failed file saves | > 1% |
| Average time | Mean creation time | > 5 seconds |

### Error Logging

| Event | Log Level | Include |
|-------|-----------|---------|
| Waybill created | INFO | Order ID, waybill number |
| Validation error | WARNING | Error message, order data |
| API error | ERROR | Status code, response, order |
| Storage error | ERROR | Error message, path, order |
| Unexpected error | CRITICAL | Full traceback, context |

### Success Criteria

| Criterion | Requirement |
|-----------|-------------|
| All tests pass | 100% pass rate |
| Code coverage | > 90% for waybill code |
| No critical bugs | All edge cases handled |
| Performance | Meet timing benchmarks |
| Documentation | All methods documented |
| Error handling | All errors logged and handled |

### Expected Outcome
- Comprehensive test suite covering all scenarios
- Manual verification procedures documented
- All edge cases identified and handled
- Monitoring and alerting in place
- High confidence in waybill generation reliability

### Verification Checklist
- [ ] Unit tests written for all builder methods
- [ ] Integration tests cover happy path
- [ ] Integration tests cover error paths
- [ ] E2E test with mocked API
- [ ] E2E test with real API (test environment)
- [ ] Edge cases identified and tested
- [ ] Manual test checklist created
- [ ] Manual tests executed successfully
- [ ] Performance benchmarks measured
- [ ] Monitoring and logging implemented
- [ ] Error alerting configured
- [ ] Documentation complete
- [ ] Code coverage > 90%
- [ ] All tests passing

---

## Summary

This document completed the waybill generation implementation with package data, COD handling, items description, response parsing, PDF label management, and comprehensive verification. The system now supports full waybill creation workflow from order data through API integration to local PDF storage with proper error handling and monitoring.

### Completed Tasks
1. ✓ Implemented package data builder with weight calculation
2. ✓ Implemented COD data builder for cash-on-delivery orders
3. ✓ Implemented items description generator
4. ✓ Created response parser for Koombiyo API responses
5. ✓ Implemented PDF label download with validation
6. ✓ Created local label storage with organized structure
7. ✓ Established comprehensive verification procedures

### Next Steps
Proceed to [../Group-D_Tracking-Webhooks/](../Group-D_Tracking-Webhooks/) to implement shipment tracking updates via webhooks, status synchronization, and tracking history management.
