# Tasks 51-54: Barcode Validation & Filters

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** C - Product Search & Barcode  
> **Document:** 03 of 03  
> **Tasks Covered:** 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-46-50_Stock-Price-Quick-Buttons.md](02_Tasks-46-50_Stock-Price-Quick-Buttons.md)
- **→ Next Group:** [../Group-D_Payment-Processing/](../Group-D_Payment-Processing/)

---

## Document Overview

This document covers barcode format validation, weight-embedded barcode parsing, search history tracking, and category-based quick filtering. These features enhance the search experience and provide data integrity for barcode operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create barcode format validators | Medium | 25 min |
| 52 | Add weight-based barcode parsing | High | 30 min |
| 53 | Create search history tracking | Medium | 20 min |
| 54 | Add category quick filter | Medium | 20 min |

---

## Task 51: Create Barcode Format Validators

### Overview
Implement validators for common barcode formats (EAN-13, EAN-8, UPC-A, Code-128) to ensure barcode data integrity and provide format detection.

### Dependencies
- Python re (regex) module
- Django validators framework
- Product model with barcode field

### Instructions

1. **Create validators module structure**
   - File already exists at `apps/pos/search/validators.py`
   - Import required Django and Python modules
   - Import ValidationError from Django

2. **Define barcode format constants**
   - Create dictionary of format specifications
   - Include length, character set, check digit requirements
   - Define regex patterns for each format

3. **Create base BarcodeValidator class**
   - Abstract base class for all barcode validators
   - Common validation logic
   - Check digit calculation methods

4. **Implement EAN-13 validator**
   - Validate 13-digit numeric barcode
   - Check digit validation using EAN algorithm
   - Most common format internationally

5. **Implement EAN-8 validator**
   - Validate 8-digit numeric barcode
   - Check digit validation
   - Short version of EAN, less common

6. **Implement UPC-A validator**
   - Validate 12-digit numeric barcode
   - Check digit validation using UPC algorithm
   - Common in North America

7. **Implement Code-128 validator**
   - Validate alphanumeric barcode
   - Variable length (typically 6-20 characters)
   - Supports letters, numbers, special characters

8. **Create format detection function**
   - Function: `detect_barcode_format(barcode)`
   - Return format type (EAN-13, UPC-A, etc.)
   - Return None if no format matches

9. **Create unified validation function**
   - Function: `validate_barcode(barcode, format=None)`
   - If format specified, validate against that format
   - If format None, detect format and validate
   - Raise ValidationError if invalid

10. **Add check digit calculation**
    - Function: `calculate_ean_check_digit(barcode)`
    - Function: `calculate_upc_check_digit(barcode)`
    - Used for validation and generation

### Barcode Format Specifications

| Format | Length | Character Set | Check Digit | Use Case |
|--------|--------|---------------|-------------|----------|
| EAN-13 | 13 | Digits only | Yes (last digit) | International retail |
| EAN-8 | 8 | Digits only | Yes (last digit) | Small products |
| UPC-A | 12 | Digits only | Yes (last digit) | North America |
| Code-128 | Variable | Alphanumeric | Optional | Industrial, internal |

### Barcode Anatomy: EAN-13

```
┌─────┬──────────────┬──────────────┬───┐
│  2  │   123456     │    78901     │ 3 │
└──┬──┴──────┬───────┴──────┬───────┴─┬─┘
   │         │              │         │
   │         │              │         └─ Check Digit
   │         │              └─────────── Product Code
   │         └────────────────────────── Company Code
   └──────────────────────────────────── Country Code

Example: 2 123456 78901 3
- Country: 2x (Sri Lanka uses 955)
- Company: 123456
- Product: 78901
- Check: 3 (calculated)
```

### EAN-13 Check Digit Calculation

```
Barcode: 1234567890123
         ↓↓↓↓↓↓↓↓↓↓↓↓
Step 1: Separate last digit (check digit)
  Base: 123456789012
  Check: 3

Step 2: Sum odd positions × 1
  1 + 3 + 5 + 7 + 9 + 1 = 26

Step 3: Sum even positions × 3
  (2 + 4 + 6 + 8 + 0 + 2) × 3 = 22 × 3 = 66

Step 4: Total sum
  26 + 66 = 92

Step 5: Calculate check digit
  (10 - (92 % 10)) % 10 = (10 - 2) % 10 = 8

Expected check digit: 8
Actual check digit: 3
Result: Invalid barcode
```

### Validator Class Structure

```python
class BarcodeValidator:
    """
    Base class for barcode validators.
    """
    
    format_name = None
    expected_length = None
    pattern = None
    
    @classmethod
    def validate(cls, barcode):
        """
        Validate barcode format.
        
        Args:
            barcode: Barcode string to validate
            
        Returns:
            Boolean: True if valid
            
        Raises:
            ValidationError: If invalid with reason
        """
        pass
    
    @classmethod
    def calculate_check_digit(cls, barcode):
        """Calculate check digit for barcode."""
        pass
```

### EAN-13 Validator Implementation

```python
class EAN13Validator(BarcodeValidator):
    """
    Validator for EAN-13 barcodes.
    
    Format: 13 digits
    Example: 1234567890123
    """
    
    format_name = 'EAN-13'
    expected_length = 13
    pattern = r'^\d{13}$'
    
    @classmethod
    def validate(cls, barcode):
        """
        Validate EAN-13 barcode.
        
        Checks:
        1. Length is exactly 13 characters
        2. All characters are digits
        3. Check digit is correct
        """
        # Length check
        if len(barcode) != 13:
            raise ValidationError(f"EAN-13 must be 13 digits, got {len(barcode)}")
        
        # Numeric check
        if not barcode.isdigit():
            raise ValidationError("EAN-13 must contain only digits")
        
        # Check digit validation
        calculated_check = cls.calculate_check_digit(barcode[:-1])
        actual_check = int(barcode[-1])
        
        if calculated_check != actual_check:
            raise ValidationError(
                f"Invalid EAN-13 check digit. "
                f"Expected {calculated_check}, got {actual_check}"
            )
        
        return True
    
    @classmethod
    def calculate_check_digit(cls, barcode_without_check):
        """
        Calculate EAN-13 check digit.
        
        Algorithm:
        1. Sum odd positions (1st, 3rd, 5th...) × 1
        2. Sum even positions (2nd, 4th, 6th...) × 3
        3. Add sums together
        4. Check digit = (10 - (sum % 10)) % 10
        """
        # Implementation as shown in diagram above
        pass
```

### UPC-A Validator Implementation

```python
class UPCAValidator(BarcodeValidator):
    """
    Validator for UPC-A barcodes.
    
    Format: 12 digits
    Example: 012345678905
    """
    
    format_name = 'UPC-A'
    expected_length = 12
    pattern = r'^\d{12}$'
    
    @classmethod
    def calculate_check_digit(cls, barcode_without_check):
        """
        Calculate UPC-A check digit.
        
        Similar to EAN but with 11 base digits.
        """
        pass
```

### Code-128 Validator Implementation

```python
class Code128Validator(BarcodeValidator):
    """
    Validator for Code-128 barcodes.
    
    Format: Variable length, alphanumeric
    Example: ABC-12345
    """
    
    format_name = 'Code-128'
    expected_length = None  # Variable
    pattern = r'^[A-Za-z0-9\-_]+$'
    
    @classmethod
    def validate(cls, barcode):
        """
        Validate Code-128 barcode.
        
        Checks:
        1. Length between 6 and 20 characters
        2. Alphanumeric with hyphens/underscores
        """
        if not (6 <= len(barcode) <= 20):
            raise ValidationError(
                f"Code-128 must be 6-20 characters, got {len(barcode)}"
            )
        
        if not re.match(cls.pattern, barcode):
            raise ValidationError(
                "Code-128 must contain only letters, numbers, hyphens, underscores"
            )
        
        return True
```

### Format Detection Function

```python
def detect_barcode_format(barcode):
    """
    Detect barcode format from barcode string.
    
    Args:
        barcode: Barcode string
        
    Returns:
        String: Format name ('EAN-13', 'UPC-A', etc.)
        None: If no format matches
        
    Example:
        format = detect_barcode_format("1234567890123")
        # Returns: "EAN-13"
    """
    barcode = barcode.strip()
    
    # Try each validator
    validators = [
        EAN13Validator,
        EAN8Validator,
        UPCAValidator,
        Code128Validator,
    ]
    
    for validator_class in validators:
        try:
            if validator_class.validate(barcode):
                return validator_class.format_name
        except ValidationError:
            continue
    
    return None
```

### Unified Validation Function

```python
def validate_barcode(barcode, format=None):
    """
    Validate barcode with optional format specification.
    
    Args:
        barcode: Barcode string to validate
        format: Optional format name ('EAN-13', 'UPC-A', etc.)
                If None, auto-detects format
    
    Returns:
        Dict: {
            'valid': bool,
            'format': str,
            'message': str
        }
        
    Example:
        result = validate_barcode("1234567890123")
        if result['valid']:
            print(f"Valid {result['format']} barcode")
    """
    barcode = barcode.strip()
    
    if format:
        # Validate against specific format
        validator = get_validator_for_format(format)
        try:
            validator.validate(barcode)
            return {
                'valid': True,
                'format': format,
                'message': f'Valid {format} barcode'
            }
        except ValidationError as e:
            return {
                'valid': False,
                'format': format,
                'message': str(e)
            }
    else:
        # Auto-detect and validate
        detected_format = detect_barcode_format(barcode)
        if detected_format:
            return {
                'valid': True,
                'format': detected_format,
                'message': f'Valid {detected_format} barcode'
            }
        else:
            return {
                'valid': False,
                'format': None,
                'message': 'Unknown or invalid barcode format'
            }
```

### Usage in Product Model

Add barcode validation to Product model:

```python
from apps.pos.search.validators import validate_barcode

class Product(TenantModel):
    barcode = models.CharField(max_length=50)
    
    def clean(self):
        """Validate product data before saving."""
        super().clean()
        
        if self.barcode:
            result = validate_barcode(self.barcode)
            if not result['valid']:
                raise ValidationError({
                    'barcode': result['message']
                })
```

### Usage in Search Service

Validate barcode before searching:

```python
@classmethod
def barcode_search(cls, barcode):
    # Validate format first
    result = validate_barcode(barcode)
    if not result['valid']:
        # Log invalid barcode attempt
        logger.warning(f"Invalid barcode search: {barcode}")
        return None
    
    # Proceed with search
    # ...
```

### Barcode Format Statistics

Track format usage:
```
Store Statistics:
├─ EAN-13: 85% of products
├─ UPC-A: 10% of products
├─ Code-128: 4% of products
└─ EAN-8: 1% of products
```

### Error Messages

Provide clear validation errors:

| Error | Message |
|-------|---------|
| Wrong length | "EAN-13 must be 13 digits, got 12" |
| Non-numeric | "EAN-13 must contain only digits" |
| Invalid check | "Invalid check digit. Expected 8, got 3" |
| Unknown format | "Unknown or invalid barcode format" |

### Testing Barcode Validators

**Valid Test Cases:**
```python
# EAN-13
validate_barcode("5901234123457")  # Valid
validate_barcode("0012345678905")  # Valid

# UPC-A
validate_barcode("012345678905")   # Valid

# Code-128
validate_barcode("ABC-12345")      # Valid
```

**Invalid Test Cases:**
```python
# Wrong length
validate_barcode("12345")          # Invalid

# Wrong check digit
validate_barcode("5901234123456")  # Invalid

# Non-numeric EAN
validate_barcode("ABC1234567890")  # Invalid
```

### Verification Checklist
- [ ] validators.py file contains all validators
- [ ] BarcodeValidator base class created
- [ ] EAN13Validator implemented with check digit
- [ ] EAN8Validator implemented
- [ ] UPCAValidator implemented
- [ ] Code128Validator implemented
- [ ] detect_barcode_format function created
- [ ] validate_barcode unified function created
- [ ] Check digit calculation methods work correctly
- [ ] Validators raise ValidationError with clear messages
- [ ] Format detection works for all supported formats
- [ ] Integration with Product model

---

## Task 52: Add Weight-Based Barcode Parsing

### Overview
Implement parsing for weight-embedded barcodes used for products sold by weight (meat, produce, bulk items). These barcodes encode weight or price information.

### Dependencies
- Task 51: Barcode validators
- Product model with weight/price fields
- Unit of measure support

### Instructions

1. **Understand weight barcode format**
   - Common format: EAN-13 with embedded data
   - Prefix identifies weighted item (e.g., starts with "2")
   - Contains product code and weight/price
   - Check digit at end

2. **Define weight barcode structure**
   - Create dataclass or dict for parsed data
   - Fields: prefix, product_code, weight/price, check_digit
   - Unit of measure information

3. **Create WeightBarcodeParser class**
   - Class in validators.py module
   - Methods for detecting and parsing weight barcodes
   - Support multiple weight encoding schemes

4. **Implement detection method**
   - Method: `is_weight_barcode(barcode)`
   - Check if barcode starts with weight prefix
   - Return boolean

5. **Implement parsing method**
   - Method: `parse_weight_barcode(barcode)`
   - Extract product code
   - Extract weight or price value
   - Convert to appropriate units
   - Return parsed data structure

6. **Support price-embedded format**
   - Format: 2-PPPPP-PPPPP-C
   - PPPPP: Product code (5 digits)
   - PPPPP: Price in cents (5 digits)
   - C: Check digit

7. **Support weight-embedded format**
   - Format: 2-PPPPP-WWWWW-C
   - PPPPP: Product code (5 digits)
   - WWWWW: Weight in grams (5 digits)
   - C: Check digit

8. **Add unit conversion**
   - Convert weight from grams to kg
   - Convert price from cents to currency
   - Format for display

9. **Integrate with search service**
   - Update barcode_search to detect weight barcodes
   - Parse weight barcode
   - Look up product by embedded product code
   - Add weight/price to result

10. **Add configuration settings**
    - Configure weight barcode prefixes
    - Configure encoding format per tenant
    - Support regional variations

### Weight Barcode Anatomy

```
Standard Weight-Embedded Barcode (EAN-13):

┌───┬──────┬──────┬─┐
│ 2 │12345 │06789 │C│
└─┬─┴───┬──┴───┬──┴─┘
  │     │      │    └── Check Digit (1 digit)
  │     │      └─────── Weight: 6789 grams = 6.789 kg
  │     └────────────── Product Code: 12345
  └──────────────────── Prefix: 2 (indicates weighted item)

Full barcode: 2 12345 06789 C
```

### Price-Embedded Format

```
┌───┬──────┬──────┬─┐
│ 2 │12345 │01599 │C│
└─┬─┴───┬──┴───┬──┴─┘
  │     │      │    └── Check Digit
  │     │      └─────── Price: 1599 cents = ₨15.99
  │     └────────────── Product Code: 12345
  └──────────────────── Prefix: 2

Example: Chicken breast at ₨15.99
```

### WeightBarcodeParser Class

```python
class WeightBarcodeParser:
    """
    Parser for weight and price embedded barcodes.
    
    Supports:
    - Weight-embedded (grams)
    - Price-embedded (cents)
    """
    
    # Configuration
    WEIGHT_PREFIX = '2'  # Barcodes starting with 2
    PRICE_PREFIX = '29'  # Alternative for price-only
    
    @staticmethod
    def is_weight_barcode(barcode):
        """
        Check if barcode is weight/price embedded.
        
        Args:
            barcode: Barcode string
            
        Returns:
            Boolean: True if weight barcode
        """
        if len(barcode) != 13:
            return False
        
        return barcode.startswith(WeightBarcodeParser.WEIGHT_PREFIX)
    
    @staticmethod
    def parse_weight_barcode(barcode):
        """
        Parse weight-embedded barcode.
        
        Args:
            barcode: 13-digit barcode string
            
        Returns:
            Dict: {
                'type': 'weight' or 'price',
                'product_code': str,
                'value': Decimal (weight in kg or price in currency),
                'raw_value': int (original encoded value),
                'unit': str ('kg' or 'LKR'),
                'formatted_value': str
            }
            
        Raises:
            ValueError: If barcode format invalid
        """
        pass
```

### Parsing Implementation

```python
@staticmethod
def parse_weight_barcode(barcode):
    # Validate barcode format
    if not WeightBarcodeParser.is_weight_barcode(barcode):
        raise ValueError("Not a weight-embedded barcode")
    
    # Extract components
    prefix = barcode[0]  # '2'
    product_code = barcode[1:6]  # 5 digits
    encoded_value = int(barcode[6:11])  # 5 digits
    check_digit = barcode[12]  # 1 digit
    
    # Determine type (weight or price)
    # Convention: If product starts with 9, it's price-embedded
    if product_code.startswith('9'):
        barcode_type = 'price'
        # Convert cents to currency
        value = Decimal(encoded_value) / 100
        unit = 'LKR'
        formatted_value = f"₨{value:.2f}"
    else:
        barcode_type = 'weight'
        # Convert grams to kg
        value = Decimal(encoded_value) / 1000
        unit = 'kg'
        formatted_value = f"{value:.3f} kg"
    
    return {
        'type': barcode_type,
        'product_code': product_code,
        'value': value,
        'raw_value': encoded_value,
        'unit': unit,
        'formatted_value': formatted_value
    }
```

### Integration with Search

```python
@classmethod
def barcode_search(cls, barcode):
    # Check if weight barcode
    if WeightBarcodeParser.is_weight_barcode(barcode):
        return cls._search_weight_barcode(barcode)
    
    # Regular barcode search
    # ...

@classmethod
def _search_weight_barcode(cls, barcode):
    """
    Search using weight-embedded barcode.
    
    Extracts product code and weight/price,
    then searches for product by code.
    """
    try:
        parsed = WeightBarcodeParser.parse_weight_barcode(barcode)
    except ValueError as e:
        logger.error(f"Invalid weight barcode: {barcode}")
        return None
    
    # Search product by embedded product code
    products = cls._get_tenant_products()
    product = products.filter(
        # Match on product code field or SKU
        sku__endswith=parsed['product_code']
    ).first()
    
    if not product:
        return None
    
    # Format result with weight/price
    result = cls._format_product_result(product)
    
    # Add weight barcode specific data
    result['weight_barcode'] = True
    result['barcode_type'] = parsed['type']
    result['quantity'] = parsed['value'] if parsed['type'] == 'weight' else 1
    result['unit_price'] = parsed['value'] if parsed['type'] == 'price' else product.price
    result['formatted_quantity'] = parsed['formatted_value']
    
    return result
```

### Example Weight Barcode Flow

```
Scan Barcode: 2123450678901
       │
       ▼
┌──────────────────────┐
│ Detect Weight Barcode│
│ (starts with '2')    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Parse Components:    │
│ - Product: 12345     │
│ - Weight: 06789 g    │
│ - Check: 1           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Convert Units:       │
│ 6789g → 6.789kg      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Search Product       │
│ by code '12345'      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Return Result:       │
│ - Product: Chicken   │
│ - Quantity: 6.789kg  │
│ - Price: ₨450/kg     │
│ - Total: ₨3,055.05   │
└──────────────────────┘
```

### Product Setup for Weight Barcodes

Products sold by weight need special configuration:

```python
{
    'name': 'Chicken Breast',
    'sku': 'MEAT-12345',  # Last 5 digits used in weight barcode
    'price_per_unit': Decimal('450.00'),  # ₨450 per kg
    'unit_of_measure': 'kg',
    'sold_by_weight': True,  # Flag for weight barcode products
    'barcode': None,  # Parent product has no fixed barcode
}
```

### Weight Barcode Generation

For scale/printer systems:

```python
def generate_weight_barcode(product_code, weight_grams):
    """
    Generate weight-embedded barcode.
    
    Args:
        product_code: 5-digit product code
        weight_grams: Weight in grams (0-99999)
        
    Returns:
        13-digit EAN-13 barcode string
    """
    # Format: 2 + 5-digit product + 5-digit weight + check
    prefix = '2'
    product_code_str = str(product_code).zfill(5)
    weight_str = str(int(weight_grams)).zfill(5)
    
    # Calculate check digit
    barcode_without_check = prefix + product_code_str + weight_str
    check_digit = calculate_ean_check_digit(barcode_without_check)
    
    return barcode_without_check + str(check_digit)

# Example usage
barcode = generate_weight_barcode(12345, 6789)
# Returns: "2123450678901"
```

### Configuration Settings

```python
WEIGHT_BARCODE_SETTINGS = {
    'enabled': True,
    'prefix': '2',  # Barcode prefix for weight items
    'price_prefix': '29',  # Prefix for price-embedded
    'unit_weight': 'g',  # Grams in barcode
    'unit_price': 'cents',  # Cents in barcode
    'max_weight': 99999,  # Max weight in grams (99.999 kg)
    'max_price': 99999,  # Max price in cents (₨999.99)
}
```

### Use Cases

**Use Case 1: Meat Counter**
- Customer selects chicken breast
- Staff weighs: 2.5 kg
- Scale generates barcode: 2123450250000
- Cashier scans barcode
- System: Chicken, 2.5kg, ₨1,125.00

**Use Case 2: Produce Section**
- Customer bags tomatoes: 1.235 kg
- Scale prints label with barcode: 2567891235002
- Barcode contains weight: 1235g = 1.235kg
- POS calculates price: ₨185.25

**Use Case 3: Pre-packaged Items**
- Store pre-packs cheese: 0.500 kg
- Applies weight barcode sticker
- Customer scans at self-checkout
- System reads weight and calculates price

### Regional Variations

**Sri Lanka Format:**
- Prefix: 955 (country code) + 2 (weight indicator)
- Product: 4 digits
- Weight: 4 digits
- Check: 1 digit

**European Format (EAN-13):**
- As described above (2-PPPPP-WWWWW-C)

**Custom Formats:**
- Configurable per tenant
- Support different encoding schemes
- Backward compatible with standard EAN

### Error Handling

```python
# Invalid weight barcode scenarios
try:
    parsed = WeightBarcodeParser.parse_weight_barcode(barcode)
except ValueError as e:
    # Handle parsing errors
    if "Not a weight-embedded barcode" in str(e):
        # Not a weight barcode, try regular search
        pass
    elif "Invalid product code" in str(e):
        # Product code not found
        show_error("Product not found for weight barcode")
    else:
        # Other parsing error
        show_error("Invalid weight barcode format")
```

### Verification Checklist
- [ ] WeightBarcodeParser class created
- [ ] is_weight_barcode method implemented
- [ ] parse_weight_barcode method implemented
- [ ] Weight format parsing (grams to kg)
- [ ] Price format parsing (cents to currency)
- [ ] Product code extraction
- [ ] Check digit validation
- [ ] Integration with barcode_search
- [ ] Unit conversion logic
- [ ] Configuration settings defined
- [ ] Error handling for invalid formats
- [ ] Support for regional variations

---

## Task 53: Create Search History Tracking

### Overview
Implement search history tracking to remember recent searches per terminal or user, enabling quick access to frequently searched products.

### Dependencies
- POS Terminal model
- User model
- Django caching framework

### Instructions

1. **Create SearchHistory model**
   - Navigate to `apps/pos/search/models/`
   - Create file named `search_history.py`
   - Model to store search queries and results

2. **Define model fields**
   - **user**: ForeignKey to User (optional, for user-specific history)
   - **terminal**: ForeignKey to Terminal (optional, for terminal-specific)
   - **query**: CharField for search query text
   - **result_count**: IntegerField for number of results found
   - **selected_product**: ForeignKey to Product (optional, if product selected)
   - **search_method**: CharField for method used (barcode, sku, name, combined)
   - **timestamp**: DateTimeField for search time

3. **Add model indexes**
   - Index on (terminal, timestamp) for terminal history
   - Index on (user, timestamp) for user history
   - Index on timestamp for cleanup queries

4. **Implement model methods**
   - `__str__()`: Return query and timestamp
   - Class method: `get_recent_searches(terminal/user, limit)`
   - Class method: `get_popular_products(terminal/user, limit)`

5. **Create history tracking service**
   - Add method to ProductSearchService
   - Method: `track_search(query, results, method, user, terminal)`
   - Called after each search operation

6. **Implement recent searches retrieval**
   - Method: `get_recent_searches(terminal=None, user=None, limit=10)`
   - Return last N searches
   - Order by timestamp descending
   - Filter by terminal or user if specified

7. **Implement popular products**
   - Method: `get_popular_products(terminal=None, user=None, limit=10)`
   - Aggregate selected products
   - Count selections
   - Return most frequently selected

8. **Add search suggestions**
   - Method: `get_search_suggestions(partial_query, limit=5)`
   - Find similar past queries
   - Use for autocomplete
   - Order by frequency and recency

9. **Implement history cleanup**
   - Create management command: `cleanup_search_history`
   - Delete history older than N days (configurable)
   - Keep aggregate statistics

10. **Add privacy controls**
    - Option to disable history per user
    - Option to clear personal history
    - Anonymize old search data

### SearchHistory Model

```python
class SearchHistory(TenantModel):
    """
    Track search queries and results for analytics and quick access.
    """
    
    # Who performed the search
    user = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_history'
    )
    
    terminal = models.ForeignKey(
        'pos.Terminal',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_history'
    )
    
    # Search details
    query = models.CharField(max_length=200)
    result_count = models.IntegerField(default=0)
    search_method = models.CharField(
        max_length=20,
        choices=[
            ('barcode', 'Barcode'),
            ('sku', 'SKU'),
            ('name', 'Name'),
            ('combined', 'Combined'),
        ]
    )
    
    # Result interaction
    selected_product = models.ForeignKey(
        'inventory.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='search_selections'
    )
    
    # Timestamp
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pos_search_history'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['terminal', '-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.query} at {self.timestamp}"
```

### Tracking Search Method

```python
@classmethod
def track_search(cls, query, results, method, user=None, terminal=None, selected_product=None):
    """
    Track search query for history and analytics.
    
    Args:
        query: Search query string
        results: List of search results
        method: Search method used ('barcode', 'sku', 'name', 'combined')
        user: Optional User instance
        terminal: Optional Terminal instance
        selected_product: Optional Product instance if user selected one
    """
    from apps.pos.search.models import SearchHistory
    
    SearchHistory.objects.create(
        user=user,
        terminal=terminal,
        query=query,
        result_count=len(results) if results else 0,
        search_method=method,
        selected_product=selected_product
    )
```

### Integration with Search Methods

```python
@classmethod
def combined_search(cls, query, limit=20, user=None, terminal=None):
    # Perform search
    results = cls._perform_combined_search(query, limit)
    
    # Track search
    cls.track_search(
        query=query,
        results=results,
        method='combined',
        user=user,
        terminal=terminal
    )
    
    return results
```

### Recent Searches Retrieval

```python
@classmethod
def get_recent_searches(cls, terminal=None, user=None, limit=10):
    """
    Get recent search queries.
    
    Args:
        terminal: Optional Terminal instance
        user: Optional User instance
        limit: Maximum number of results (default 10)
        
    Returns:
        QuerySet of SearchHistory ordered by timestamp descending
        
    Example:
        recent = ProductSearchService.get_recent_searches(
            terminal=current_terminal,
            limit=5
        )
        for search in recent:
            print(f"{search.query} - {search.result_count} results")
    """
    from apps.pos.search.models import SearchHistory
    
    queryset = SearchHistory.objects.all()
    
    if terminal:
        queryset = queryset.filter(terminal=terminal)
    
    if user:
        queryset = queryset.filter(user=user)
    
    # Get unique queries (distinct)
    queryset = queryset.values('query').distinct()[:limit]
    
    return queryset
```

### Popular Products

```python
@classmethod
def get_popular_products(cls, terminal=None, user=None, limit=10, days=30):
    """
    Get most frequently selected products from search history.
    
    Args:
        terminal: Optional Terminal instance
        user: Optional User instance
        limit: Maximum number of products
        days: Look back period in days (default 30)
        
    Returns:
        List of dicts: [
            {
                'product': Product instance,
                'selection_count': int,
                'last_selected': datetime
            },
            ...
        ]
    """
    from apps.pos.search.models import SearchHistory
    from django.utils import timezone
    from datetime import timedelta
    
    # Filter history
    cutoff_date = timezone.now() - timedelta(days=days)
    queryset = SearchHistory.objects.filter(
        timestamp__gte=cutoff_date,
        selected_product__isnull=False
    )
    
    if terminal:
        queryset = queryset.filter(terminal=terminal)
    
    if user:
        queryset = queryset.filter(user=user)
    
    # Aggregate by product
    from django.db.models import Count, Max
    
    popular = queryset.values('selected_product').annotate(
        selection_count=Count('id'),
        last_selected=Max('timestamp')
    ).order_by('-selection_count')[:limit]
    
    # Convert to list with product instances
    result = []
    for item in popular:
        product = Product.objects.get(id=item['selected_product'])
        result.append({
            'product': product,
            'selection_count': item['selection_count'],
            'last_selected': item['last_selected']
        })
    
    return result
```

### Search Suggestions (Autocomplete)

```python
@classmethod
def get_search_suggestions(cls, partial_query, terminal=None, limit=5):
    """
    Get search suggestions based on partial query.
    
    Args:
        partial_query: Partial search text
        terminal: Optional Terminal instance
        limit: Maximum number of suggestions
        
    Returns:
        List of suggestion strings ordered by frequency
        
    Example:
        suggestions = ProductSearchService.get_search_suggestions("coc")
        # Returns: ["coca", "coca-cola", "coconut", ...]
    """
    from apps.pos.search.models import SearchHistory
    from django.db.models import Count
    
    queryset = SearchHistory.objects.filter(
        query__istartswith=partial_query
    )
    
    if terminal:
        queryset = queryset.filter(terminal=terminal)
    
    # Get most common queries
    suggestions = queryset.values('query').annotate(
        count=Count('id')
    ).order_by('-count', '-timestamp')[:limit]
    
    return [item['query'] for item in suggestions]
```

### Recent Searches UI Display

```
┌─────────────────────────────────────┐
│ Recent Searches:                    │
├─────────────────────────────────────┤
│ ⏱ coca cola      (5 results)       │
│ ⏱ bread          (12 results)      │
│ ⏱ milk           (8 results)       │
│ ⏱ 1234567890123  (1 result)        │
│ ⏱ snacks         (25 results)      │
└─────────────────────────────────────┘

Click to repeat search
```

### Popular Products UI Display

```
┌─────────────────────────────────────┐
│ Frequently Selected:                │
├─────────────────────────────────────┤
│ 🔥 Coca-Cola 500ml     (45 times)   │
│ 🔥 White Bread         (38 times)   │
│ 🔥 Full Cream Milk     (32 times)   │
│ 🔥 Potato Chips        (28 times)   │
│ 🔥 Bottled Water       (25 times)   │
└─────────────────────────────────────┘

Click to add to cart
```

### History Cleanup Command

```python
# management/commands/cleanup_search_history.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.pos.search.models import SearchHistory

class Command(BaseCommand):
    help = 'Clean up old search history records'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=90,
            help='Delete history older than N days (default: 90)'
        )
    
    def handle(self, *args, **options):
        days = options['days']
        cutoff_date = timezone.now() - timedelta(days=days)
        
        deleted_count = SearchHistory.objects.filter(
            timestamp__lt=cutoff_date
        ).delete()[0]
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Deleted {deleted_count} search history records older than {days} days'
            )
        )
```

### Privacy Controls

**Clear User History:**
```python
def clear_user_search_history(user):
    """Clear all search history for specific user."""
    SearchHistory.objects.filter(user=user).delete()
```

**Anonymize Old Data:**
```python
def anonymize_old_search_history(days=365):
    """
    Anonymize search history older than specified days.
    Keep query and stats, remove user/terminal links.
    """
    from django.utils import timezone
    from datetime import timedelta
    
    cutoff_date = timezone.now() - timedelta(days=days)
    
    SearchHistory.objects.filter(
        timestamp__lt=cutoff_date
    ).update(
        user=None,
        terminal=None
    )
```

### Configuration Settings

```python
SEARCH_HISTORY_SETTINGS = {
    'enabled': True,
    'retention_days': 90,  # Keep history for 90 days
    'max_recent_searches': 10,  # Show 10 recent searches
    'max_popular_products': 10,  # Show 10 popular products
    'enable_suggestions': True,  # Enable autocomplete suggestions
    'anonymize_after_days': 365,  # Anonymize after 1 year
}
```

### Analytics from Search History

**Search Analytics Dashboard:**
- Total searches per day/week/month
- Most common search queries
- Search success rate (result_count > 0)
- Most selected products
- Average results per search
- Search method distribution (barcode vs name)

### Verification Checklist
- [ ] SearchHistory model created with all fields
- [ ] Model indexes added for performance
- [ ] track_search method implemented
- [ ] get_recent_searches method implemented
- [ ] get_popular_products method implemented
- [ ] get_search_suggestions method implemented
- [ ] Integration with search methods
- [ ] History cleanup command created
- [ ] Privacy controls implemented
- [ ] Configuration settings defined
- [ ] UI displays for recent/popular

---

## Task 54: Add Category Quick Filter

### Overview
Implement category-based quick filtering to allow cashiers to filter search results or browse products by category quickly.

### Dependencies
- Product Category model
- ProductSearchService
- Task 40-44: Search methods

### Instructions

1. **Add category filter to search methods**
   - Update _get_tenant_products() to accept category parameter
   - Filter products by category if specified
   - Support category hierarchy (parent categories)

2. **Create get_categories method**
   - Class method: `get_active_categories()`
   - Return list of categories with product counts
   - Order by display order or name

3. **Implement category_filter method**
   - Method: `filter_by_category(category, query=None, limit=50)`
   - Return products in category
   - Optionally combine with search query
   - Support subcategories

4. **Add category hierarchy support**
   - If category has children, include products from subcategories
   - Recursive category filtering
   - Example: "Beverages" includes "Soft Drinks", "Juices", etc.

5. **Create category quick buttons**
   - Generate category buttons for UI
   - Method: `get_category_quick_filters()`
   - Return category data with icons, colors, product counts

6. **Integrate with combined search**
   - Add category parameter to combined_search
   - Filter results by category if specified
   - Maintain search relevance ordering

7. **Add category-based sorting**
   - Sort products within category
   - Options: name, price, popularity, newest
   - Configurable sort order

8. **Implement category product count**
   - Efficient count of products per category
   - Include subcategory products in count
   - Cache counts for performance

9. **Add category metadata**
   - Include category description
   - Include category icon/image
   - Include active promotion for category

10. **Create category navigation UI data**
    - Breadcrumb data for category hierarchy
    - Sibling categories (same level)
    - Child categories for drilling down

### Category Filter Flow

```
┌──────────────────────┐
│ User: Search "cola"  │
│ + Filter: Beverages  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ combined_search()    │
│ - query: "cola"      │
│ - category: Beverages│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Get Base Products    │
│ Filter by:           │
│ - Tenant ✓           │
│ - Category ✓         │
│ - Active ✓           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Apply Search Query   │
│ Within Category      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Results:             │
│ - Coca-Cola (Bev)    │
│ - Pepsi Cola (Bev)   │
│ (no cola from other  │
│  categories)         │
└──────────────────────┘
```

### Enhanced _get_tenant_products Method

```python
@classmethod
def _get_tenant_products(cls, category=None, include_subcategories=True):
    """
    Get optimized queryset of tenant products.
    
    Args:
        category: Optional Category instance to filter by
        include_subcategories: Include products from subcategories
        
    Returns:
        Optimized QuerySet of products
    """
    queryset = Product.objects.filter(
        is_active=True,
        # Other tenant filters
    )
    
    # Apply optimizations
    queryset = queryset.select_related('category', 'unit', 'brand')
    queryset = queryset.prefetch_related('variants', 'prices')
    
    # Apply category filter
    if category:
        if include_subcategories:
            # Get category and all descendants
            category_ids = cls._get_category_tree_ids(category)
            queryset = queryset.filter(category_id__in=category_ids)
        else:
            # Only direct category products
            queryset = queryset.filter(category=category)
    
    return queryset
```

### Get Active Categories

```python
@classmethod
def get_active_categories(cls):
    """
    Get list of active product categories with counts.
    
    Returns:
        List of dicts: [
            {
                'id': category_id,
                'name': category_name,
                'icon': icon_identifier,
                'color': hex_color,
                'product_count': int,
                'has_children': bool,
                'parent_id': parent_category_id or None
            },
            ...
        ]
    """
    from apps.inventory.models import Category
    from django.db.models import Count
    
    categories = Category.objects.filter(
        is_active=True
    ).annotate(
        product_count=Count('products', filter=Q(products__is_active=True))
    ).order_by('display_order', 'name')
    
    result = []
    for cat in categories:
        result.append({
            'id': cat.id,
            'name': cat.name,
            'icon': cat.icon,
            'color': cat.color,
            'product_count': cat.product_count,
            'has_children': cat.children.exists(),
            'parent_id': cat.parent_id
        })
    
    return result
```

### Category Filter Method

```python
@classmethod
def filter_by_category(cls, category, query=None, limit=50, sort_by='name'):
    """
    Filter products by category with optional search query.
    
    Args:
        category: Category instance or category ID
        query: Optional search query to filter within category
        limit: Maximum results to return
        sort_by: Sort field ('name', 'price', 'popularity')
        
    Returns:
        List of formatted product dictionaries
        
    Example:
        # Get all beverages
        products = ProductSearchService.filter_by_category(beverages_cat)
        
        # Search within beverages
        products = ProductSearchService.filter_by_category(
            category=beverages_cat,
            query="cola"
        )
    """
    # Get category-filtered products
    products = cls._get_tenant_products(category=category)
    
    # Apply search query if provided
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(sku__icontains=query)
        )
    
    # Apply sorting
    if sort_by == 'price':
        products = products.order_by('price')
    elif sort_by == 'popularity':
        # Order by recent sales or popularity metric
        products = products.order_by('-popularity_score')
    else:  # default: name
        products = products.order_by('name')
    
    # Limit results
    products = products[:limit]
    
    # Format results
    return [cls._format_product_result(p) for p in products]
```

### Category Hierarchy Support

```python
@classmethod
def _get_category_tree_ids(cls, category):
    """
    Get category ID and all descendant IDs.
    
    Supports hierarchical categories:
    Beverages
    ├─ Soft Drinks
    │  ├─ Cola
    │  └─ Lemon-Lime
    └─ Juices
    
    Args:
        category: Category instance
        
    Returns:
        List of category IDs (including children)
    """
    category_ids = [category.id]
    
    # Recursively get child categories
    children = category.children.filter(is_active=True)
    for child in children:
        category_ids.extend(cls._get_category_tree_ids(child))
    
    return category_ids
```

### Category Quick Filter UI

```
┌─────────────────────────────────────────┐
│ Category Filters:                       │
├─────────────────────────────────────────┤
│ [All] [Beverages] [Food] [Snacks] ...  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Selected: Beverages (234 products)      │
├─────────────────────────────────────────┤
│ Subcategories:                          │
│ • Soft Drinks (120)                     │
│ • Juices (45)                           │
│ • Water (35)                            │
│ • Tea & Coffee (34)                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Products in Beverages:                  │
├─────────────────────────────────────────┤
│ 1. Coca-Cola 500ml        ₨150.00      │
│ 2. Sprite 500ml           ₨150.00      │
│ 3. Orange Juice 1L        ₨350.00      │
│ ... (234 products total)                │
└─────────────────────────────────────────┘
```

### Combined Search with Category

```python
@classmethod
def combined_search(cls, query, category=None, limit=20):
    """
    Combined search with optional category filter.
    
    Args:
        query: Search query
        category: Optional category to filter results
        limit: Maximum results
        
    Returns:
        List of product dictionaries
    """
    # Get base products (with category filter if specified)
    base_queryset = cls._get_tenant_products(category=category)
    
    # Try barcode search first
    result = cls._barcode_search(query, base_queryset)
    if result:
        return [result]
    
    # Try exact SKU
    result = cls._sku_search_exact(query, base_queryset)
    if result:
        return [result]
    
    # Fuzzy searches
    name_results = cls._name_search(query, base_queryset, limit)
    sku_results = cls._sku_search_partial(query, base_queryset, limit)
    
    # Combine and deduplicate
    combined = name_results + sku_results
    deduplicated = cls._deduplicate_results(combined)
    
    return deduplicated[:limit]
```

### Category Navigation Data

```python
@classmethod
def get_category_navigation(cls, current_category=None):
    """
    Get category navigation data for UI.
    
    Args:
        current_category: Optional current category instance
        
    Returns:
        Dict: {
            'breadcrumb': [list of parent categories],
            'current': current category data,
            'children': list of child categories,
            'siblings': list of sibling categories
        }
    """
    if not current_category:
        # Return root categories
        return {
            'breadcrumb': [],
            'current': None,
            'children': cls._get_root_categories(),
            'siblings': []
        }
    
    # Build breadcrumb
    breadcrumb = []
    parent = current_category.parent
    while parent:
        breadcrumb.insert(0, {
            'id': parent.id,
            'name': parent.name
        })
        parent = parent.parent
    
    # Get children
    children = cls._format_categories(current_category.children.filter(is_active=True))
    
    # Get siblings
    if current_category.parent:
        siblings = cls._format_categories(
            current_category.parent.children.filter(is_active=True)
        )
    else:
        siblings = cls._get_root_categories()
    
    return {
        'breadcrumb': breadcrumb,
        'current': {
            'id': current_category.id,
            'name': current_category.name,
            'product_count': cls._count_category_products(current_category)
        },
        'children': children,
        'siblings': siblings
    }
```

### Category Product Count (with Cache)

```python
@classmethod
def get_category_product_count(cls, category, use_cache=True):
    """
    Get product count for category (including subcategories).
    
    Args:
        category: Category instance
        use_cache: Use cached count if available
        
    Returns:
        Integer: Product count
    """
    cache_key = f'category_product_count_{category.id}'
    
    if use_cache:
        from django.core.cache import cache
        count = cache.get(cache_key)
        if count is not None:
            return count
    
    # Calculate count
    category_ids = cls._get_category_tree_ids(category)
    count = Product.objects.filter(
        category_id__in=category_ids,
        is_active=True
    ).count()
    
    # Cache for 5 minutes
    if use_cache:
        cache.set(cache_key, count, 300)
    
    return count
```

### Example Category Filters

**Filter 1: Top-Level Categories**
```
All Products (1,234)
├─ Beverages (234)
├─ Food (456)
├─ Snacks (189)
├─ Personal Care (123)
└─ Home & Garden (232)
```

**Filter 2: Beverage Subcategories**
```
Beverages (234)
├─ Soft Drinks (120)
│  ├─ Cola (45)
│  ├─ Lemon-Lime (30)
│  └─ Orange (45)
├─ Juices (45)
├─ Water (35)
└─ Tea & Coffee (34)
```

### Use Cases

**Use Case 1: Browse by category**
- Cashier selects "Beverages" filter
- System shows all 234 beverage products
- Cashier can further filter to "Soft Drinks"

**Use Case 2: Search within category**
- Cashier selects "Food" category
- Types "bread" in search
- System returns only bread products from Food category

**Use Case 3: Category quick access**
- Cashier frequently sells beverages
- POS shows beverage category button
- One tap shows all beverages

**Use Case 4: Hierarchical drilling**
- Start at "All Products"
- Select "Beverages"
- Select "Soft Drinks"
- Select "Cola"
- See all Cola products

### Verification Checklist
- [ ] _get_tenant_products accepts category parameter
- [ ] get_active_categories method implemented
- [ ] filter_by_category method implemented
- [ ] Category hierarchy support (_get_category_tree_ids)
- [ ] Integration with combined_search
- [ ] Category product counting with caching
- [ ] Category navigation data method
- [ ] Subcategory inclusion logic
- [ ] Sort options implemented
- [ ] UI data structures defined

---

## Summary

This document covered barcode validation, weight parsing, search history, and category filtering:

1. **Task 51**: Created barcode format validators for EAN-13, UPC-A, Code-128
2. **Task 52**: Implemented weight-embedded barcode parsing for products sold by weight
3. **Task 53**: Created search history tracking for recent searches and popular products
4. **Task 54**: Added category-based quick filtering with hierarchy support

**Key Outcomes:**
- Barcode format validation ensures data integrity
- Weight barcode support enables produce and meat sales
- Search history provides quick access to recent searches
- Category filtering helps navigate large product catalogs
- Complete product search system for POS operations

**Group C Complete:**
- Product search submodule fully implemented
- Multiple search methods with intelligent prioritization
- Stock and price information in results
- Quick button system for fast access
- Barcode validation and special format support
- Search analytics and history tracking
- Category-based filtering and navigation

**Next Steps:**
- Move to Group D: Payment Processing
- Implement payment methods and transaction handling

---

## Related Documentation

- [Group Overview](00_GROUP_OVERVIEW.md)
- [Previous Document: Stock, Price & Quick Buttons](02_Tasks-46-50_Stock-Price-Quick-Buttons.md)
- [Next Group: Payment Processing](../Group-D_Payment-Processing/)
- [PostgreSQL Trigram Search](https://www.postgresql.org/docs/current/pgtrgm.html)
- [EAN/UPC Barcode Standards](https://www.gs1.org/standards/barcodes)

---

*Document maintained by LankaCommerce Development Team*  
*Last Updated: January 2026*
