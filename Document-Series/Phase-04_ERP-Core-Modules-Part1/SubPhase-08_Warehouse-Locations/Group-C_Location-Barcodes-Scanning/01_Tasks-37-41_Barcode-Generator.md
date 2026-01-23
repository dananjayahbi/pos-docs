# Tasks 37-41: Barcode Generator

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** C - Location Barcodes & Scanning  
> **Document:** 01 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-42-46_Lookup-Labels-QR.md](02_Tasks-42-46_Lookup-Labels-QR.md)

---

## Document Overview

This document covers barcode format specification, barcode generation service, validation with check digits, and automatic barcode generation using Django signals. Barcodes enable quick and accurate location identification during warehouse operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Define barcode format constants | Low | 10 min |
| 38 | Create BarcodeGenerator service | Medium | 25 min |
| 39 | Implement generate_location_barcode | Low | 20 min |
| 40 | Add barcode validation method | Low | 20 min |
| 41 | Create auto-generate barcode signal | Low | 20 min |

---

## Task 37: Define Barcode Format Constants

### Overview
Define constants for barcode format specification including prefix, structure, and validation rules. A standardized format ensures consistency across the system and enables reliable scanning.

### Dependencies
- Group A: Warehouse model complete
- Group B: StorageLocation model complete

### Instructions

1. **Open constants.py file**
   - Navigate to `inventory/warehouses/constants.py`
   - Add new section for barcode constants

2. **Add section header comment**
   - Comment: "Location Barcode Format Constants"
   - Explain barcode structure and purpose

3. **Define barcode prefix**
   - BARCODE_PREFIX_LOCATION = 'LOC'
   - Identifies barcode as location barcode
   - Distinguishes from product barcodes

4. **Define barcode separator**
   - BARCODE_SEPARATOR = '-'
   - Separates barcode components
   - Human-readable format

5. **Define barcode component lengths**
   - BARCODE_TENANT_PREFIX_LENGTH = 3
   - BARCODE_WAREHOUSE_CODE_LENGTH = 6
   - BARCODE_LOCATION_CODE_LENGTH = 15 (max)
   - CHECK_DIGIT_LENGTH = 1

6. **Define maximum barcode length**
   - BARCODE_MAX_LENGTH = 100
   - Matches model field max_length
   - Allows flexibility for long codes

7. **Add format documentation**
   - Document structure: LOC-{TENANT}-{WAREHOUSE}-{LOCATION}-{CHECK}
   - Provide examples
   - Explain each component

8. **Add check digit algorithm constant**
   - BARCODE_CHECK_ALGORITHM = 'luhn'
   - Use Luhn algorithm for validation
   - Industry standard for check digits

### Barcode Format Specification

```
Format: LOC-{TENANT_PREFIX}-{WAREHOUSE_CODE}-{LOCATION_CODE}-{CHECK_DIGIT}

Components:
1. LOC: Fixed prefix (3 chars)
2. TENANT_PREFIX: Tenant identifier (3 chars, uppercase)
3. WAREHOUSE_CODE: Warehouse code without hyphens (4-6 chars)
4. LOCATION_CODE: Location code without hyphens (5-15 chars)
5. CHECK_DIGIT: Luhn check digit (1 digit)

Total Length: 15-30 characters (depending on code lengths)

Example:
  Tenant: ABC Company → ABC
  Warehouse: WH-CMB-01 → WHCMB01
  Location: A03-R02-S01-B05 → A03R02S01B05
  Check: 7 (calculated)
  Barcode: LOC-ABC-WHCMB01-A03R02S01B05-7
```

### Format Variations

**Full Format (Default):**
```
LOC-ABC-WHCMB01-A03R02S01B05-7
^   ^   ^       ^            ^
│   │   │       │            └─ Check digit
│   │   │       └─ Location code (no hyphens)
│   │   └─ Warehouse code (no hyphens)
│   └─ Tenant prefix (3 letters)
└─ Type prefix (LOC = Location)
```

**Compact Format (No Separators):**
```
LOCABCWHCMB01A03R02S01B057
(Harder to read, more compact)
```

**Displayable Format (On Labels):**
```
Short: A03R02S01B05
Full:  LOC-ABC-WHCMB01-A03R02S01B05-7
```

### Check Digit Calculation (Luhn Algorithm)

The Luhn algorithm validates barcode integrity:

1. Take barcode without check digit
2. Starting from right, double every other digit
3. If doubled value > 9, subtract 9
4. Sum all digits
5. Check digit makes sum divisible by 10

Example for "LOCABCWHCMB01A03R02S01B05":
```
1. Convert to numeric: 1026012281301621020115
2. Double alternating: 1 0 4 6 0 2 4 2 1 6 0 2 1 4 2 2 0 4 1 2
3. Sum: 44
4. Check digit: (10 - (44 % 10)) % 10 = 6
5. Final: LOCABCWHCMB01A03R02S01B05-6
```

### Barcode Types Support

Different barcode symbologies for various use cases:

| Symbology | Type | Data Capacity | Use Case |
|-----------|------|---------------|----------|
| **Code 128** | 1D | Alphanumeric | Primary barcode (compact) |
| **Code 39** | 1D | Alphanumeric | Legacy compatibility |
| **QR Code** | 2D | High | Additional data (JSON) |
| **Data Matrix** | 2D | Medium | Small labels |
| **PDF417** | 2D | High | Document encoding |

**Recommendation:** Use Code 128 as primary + QR Code for enhanced data

### Expected Outcome
Constants file with comprehensive barcode format specification.

### Verification Checklist
- [ ] BARCODE_PREFIX_LOCATION defined
- [ ] Component length constants defined
- [ ] Format documented with examples
- [ ] Check digit algorithm specified
- [ ] Separator constant defined
- [ ] Maximum length defined
- [ ] Comments explain structure

---

## Task 38: Create BarcodeGenerator Service

### Overview
Create service class to handle barcode generation logic. The service centralizes barcode creation, ensuring consistent format and validation across the system.

### Dependencies
- Task 37: Define barcode format constants

### Instructions

1. **Create services directory**
   - Create `services/` directory in `warehouses/`
   - Create `__init__.py` in services directory

2. **Create barcode_generator.py file**
   - Add comprehensive module docstring
   - Explain barcode generation process

3. **Import required modules**
   - Import barcode constants
   - Import Luhn algorithm utilities
   - Import models (Warehouse, StorageLocation)

4. **Create BarcodeGenerator class**
   - Service class (not a model)
   - Stateless methods
   - Pure functions for generation

5. **Add tenant prefix extraction method**
   - Extract 3-letter prefix from tenant name
   - Convert to uppercase
   - Handle special characters

6. **Add code normalization method**
   - Remove hyphens and spaces
   - Convert to uppercase
   - Validate length constraints

7. **Add check digit calculation method**
   - Implement Luhn algorithm
   - Return single digit
   - Validate input format

8. **Add format validation method**
   - Validate generated barcode format
   - Check component lengths
   - Ensure no invalid characters

### BarcodeGenerator Implementation

```python
class BarcodeGenerator:
    """
    Service for generating location barcodes.
    
    Barcodes follow the format:
    LOC-{TENANT_PREFIX}-{WAREHOUSE_CODE}-{LOCATION_CODE}-{CHECK_DIGIT}
    
    Example: LOC-ABC-WHCMB01-A03R02S01B05-7
    """
    
    def __init__(self):
        """Initialize barcode generator."""
        self.prefix = BARCODE_PREFIX_LOCATION
        self.separator = BARCODE_SEPARATOR
    
    def get_tenant_prefix(self, tenant):
        """
        Extract 3-letter prefix from tenant name.
        
        Args:
            tenant: Tenant model instance
            
        Returns:
            str: 3-character uppercase prefix
        """
        # Get tenant name or code
        name = getattr(tenant, 'code', None) or getattr(tenant, 'name', 'TEN')
        
        # Remove non-alphanumeric characters
        cleaned = ''.join(c for c in name if c.isalnum())
        
        # Take first 3 characters, pad if needed
        prefix = (cleaned[:3]).upper().ljust(3, 'X')
        
        return prefix
    
    def normalize_code(self, code):
        """
        Normalize warehouse or location code.
        Removes hyphens and spaces, converts to uppercase.
        
        Args:
            code: Raw code string
            
        Returns:
            str: Normalized code
        """
        if not code:
            return ''
        
        # Remove separators
        normalized = code.replace('-', '').replace(' ', '')
        
        # Convert to uppercase
        normalized = normalized.upper()
        
        # Keep only alphanumeric
        normalized = ''.join(c for c in normalized if c.isalnum())
        
        return normalized
    
    def calculate_check_digit(self, barcode_base):
        """
        Calculate Luhn check digit for barcode.
        
        Args:
            barcode_base: Barcode without check digit
            
        Returns:
            str: Single check digit (0-9)
        """
        # Convert to numeric string (map letters to numbers)
        numeric = self._to_numeric_string(barcode_base)
        
        # Apply Luhn algorithm
        total = 0
        is_second = False
        
        # Process from right to left
        for digit in reversed(numeric):
            n = int(digit)
            
            if is_second:
                n *= 2
                if n > 9:
                    n -= 9
            
            total += n
            is_second = not is_second
        
        # Calculate check digit
        check = (10 - (total % 10)) % 10
        
        return str(check)
    
    def _to_numeric_string(self, text):
        """
        Convert alphanumeric text to numeric string.
        A=10, B=11, ..., Z=35
        """
        result = []
        for char in text.upper():
            if char.isdigit():
                result.append(char)
            elif char.isalpha():
                # A=10, B=11, etc.
                result.append(str(ord(char) - ord('A') + 10))
        
        return ''.join(result)
    
    def validate_barcode_format(self, barcode):
        """
        Validate barcode format.
        
        Args:
            barcode: Complete barcode string
            
        Returns:
            bool: True if valid format
        """
        if not barcode:
            return False
        
        # Check prefix
        if not barcode.startswith(self.prefix):
            return False
        
        # Check separator usage
        parts = barcode.split(self.separator)
        if len(parts) != 5:
            return False
        
        # Validate components
        prefix, tenant, warehouse, location, check = parts
        
        if prefix != self.prefix:
            return False
        
        if len(tenant) != BARCODE_TENANT_PREFIX_LENGTH:
            return False
        
        if len(check) != CHECK_DIGIT_LENGTH:
            return False
        
        if not check.isdigit():
            return False
        
        return True
```

### Service Pattern Benefits

**Centralized Logic:**
- Single source of truth for barcode generation
- Easy to update format across system
- Consistent validation

**Testability:**
- Pure functions easy to unit test
- No database dependencies for core logic
- Mock-friendly for testing

**Reusability:**
- Use in signals, admin actions, API endpoints
- Use in scripts and management commands
- Use in frontend via API

### Expected Outcome
```
backend/apps/inventory/warehouses/services/
├── __init__.py (NEW)
└── barcode_generator.py (NEW)
```

### Verification Checklist
- [ ] barcode_generator.py created
- [ ] BarcodeGenerator class defined
- [ ] get_tenant_prefix() method implemented
- [ ] normalize_code() method implemented
- [ ] calculate_check_digit() method implemented
- [ ] Luhn algorithm correct
- [ ] validate_barcode_format() method implemented
- [ ] Comprehensive docstrings
- [ ] Constants imported and used

---

## Task 39: Implement generate_location_barcode

### Overview
Add the main barcode generation method that combines all components into a complete location barcode. This method orchestrates the entire generation process.

### Dependencies
- Task 38: Create BarcodeGenerator service

### Instructions

1. **Add generate_location_barcode method**
   - Add to BarcodeGenerator class
   - Primary public method
   - Accepts location instance

2. **Extract required components**
   - Get tenant from location
   - Get warehouse code
   - Get location code
   - Normalize all codes

3. **Build barcode base**
   - Combine prefix, tenant, warehouse, location
   - Use separator between components
   - Format consistently

4. **Calculate check digit**
   - Use calculate_check_digit method
   - Append to barcode base

5. **Validate generated barcode**
   - Verify format is correct
   - Check length constraints
   - Ensure uniqueness (query database)

6. **Return complete barcode**
   - Return formatted string
   - Or raise exception if invalid

7. **Add error handling**
   - Handle missing required fields
   - Handle invalid characters
   - Provide clear error messages

### Implementation

```python
def generate_location_barcode(self, location):
    """
    Generate complete barcode for storage location.
    
    Args:
        location: StorageLocation model instance
        
    Returns:
        str: Complete barcode string
        
    Raises:
        ValueError: If required fields missing or invalid
    """
    # Validate inputs
    if not location.warehouse:
        raise ValueError("Location must have warehouse assigned")
    
    if not location.code:
        raise ValueError("Location must have code assigned")
    
    # Get tenant
    tenant = location.tenant
    if not tenant:
        raise ValueError("Location must be associated with tenant")
    
    # Extract components
    tenant_prefix = self.get_tenant_prefix(tenant)
    warehouse_code = self.normalize_code(location.warehouse.code)
    location_code = self.normalize_code(location.code)
    
    # Validate component lengths
    if len(warehouse_code) > BARCODE_WAREHOUSE_CODE_LENGTH:
        warehouse_code = warehouse_code[:BARCODE_WAREHOUSE_CODE_LENGTH]
    
    if len(location_code) > BARCODE_LOCATION_CODE_LENGTH:
        location_code = location_code[:BARCODE_LOCATION_CODE_LENGTH]
    
    # Build barcode base
    barcode_base = self.separator.join([
        self.prefix,
        tenant_prefix,
        warehouse_code,
        location_code
    ])
    
    # Calculate check digit
    check_digit = self.calculate_check_digit(barcode_base)
    
    # Complete barcode
    barcode = f"{barcode_base}{self.separator}{check_digit}"
    
    # Validate format
    if not self.validate_barcode_format(barcode):
        raise ValueError(f"Generated barcode has invalid format: {barcode}")
    
    # Check uniqueness
    if self._barcode_exists(barcode, location):
        # Append sequence number if duplicate
        barcode = self._make_unique(barcode, location)
    
    return barcode

def _barcode_exists(self, barcode, exclude_location=None):
    """
    Check if barcode already exists.
    
    Args:
        barcode: Barcode to check
        exclude_location: Location to exclude from check
        
    Returns:
        bool: True if barcode exists
    """
    from .models import StorageLocation
    
    queryset = StorageLocation.objects.filter(barcode=barcode)
    
    if exclude_location and exclude_location.pk:
        queryset = queryset.exclude(pk=exclude_location.pk)
    
    return queryset.exists()

def _make_unique(self, barcode, location):
    """
    Make barcode unique by appending sequence.
    
    This should rarely happen with proper codes.
    """
    base = barcode.rsplit(self.separator, 1)[0]
    
    for i in range(1, 100):
        new_barcode = f"{base}{self.separator}{i:02d}"
        if not self._barcode_exists(new_barcode, location):
            return new_barcode
    
    raise ValueError("Could not generate unique barcode")
```

### Generation Process Flow

```
1. VALIDATE INPUT
   ├─ Check location.warehouse exists
   ├─ Check location.code exists
   └─ Check location.tenant exists
   
2. EXTRACT COMPONENTS
   ├─ Tenant prefix: ABC
   ├─ Warehouse code: WHCMB01
   └─ Location code: A03R02S01B05
   
3. BUILD BARCODE BASE
   LOC-ABC-WHCMB01-A03R02S01B05
   
4. CALCULATE CHECK DIGIT
   Luhn algorithm → 7
   
5. COMPLETE BARCODE
   LOC-ABC-WHCMB01-A03R02S01B05-7
   
6. VALIDATE FORMAT
   ✓ Prefix correct
   ✓ Component lengths valid
   ✓ Separator usage correct
   
7. CHECK UNIQUENESS
   Query database for existing barcode
   
8. RETURN BARCODE
   LOC-ABC-WHCMB01-A03R02S01B05-7
```

### Usage Examples

```python
# Create generator
generator = BarcodeGenerator()

# Generate barcode for location
location = StorageLocation.objects.get(code='A03-R02-S01-B05')
barcode = generator.generate_location_barcode(location)
# Result: "LOC-ABC-WHCMB01-A03R02S01B05-7"

# Assign to location
location.barcode = barcode
location.save()
```

### Expected Outcome
Complete barcode generation method producing valid, unique barcodes.

### Verification Checklist
- [ ] generate_location_barcode() method added
- [ ] Component extraction works
- [ ] Barcode base built correctly
- [ ] Check digit calculated
- [ ] Format validation performed
- [ ] Uniqueness checked
- [ ] Error handling implemented
- [ ] Usage examples documented

---

## Task 40: Add Barcode Validation Method

### Overview
Create validation method to verify existing barcodes. This method checks format compliance and validates check digits, useful for scanning operations.

### Dependencies
- Task 38: Create BarcodeGenerator service

### Instructions

1. **Add validate_barcode method**
   - Add to BarcodeGenerator class
   - Public validation method
   - Accepts barcode string

2. **Check format compliance**
   - Use validate_barcode_format method
   - Verify structure is correct

3. **Extract check digit**
   - Parse check digit from barcode
   - Extract barcode base

4. **Recalculate check digit**
   - Calculate expected check digit
   - Compare with provided check digit

5. **Return validation result**
   - Return True if valid
   - Return False if invalid
   - Option: Return tuple (valid, error_message)

6. **Add detailed validation method**
   - Return validation details
   - List specific errors found
   - Useful for debugging

### Implementation

```python
def validate_barcode(self, barcode):
    """
    Validate location barcode format and check digit.
    
    Args:
        barcode: Barcode string to validate
        
    Returns:
        bool: True if barcode is valid
    """
    # Check basic format
    if not self.validate_barcode_format(barcode):
        return False
    
    # Extract components
    parts = barcode.split(self.separator)
    if len(parts) != 5:
        return False
    
    # Extract check digit
    provided_check = parts[-1]
    
    # Rebuild barcode base
    barcode_base = self.separator.join(parts[:-1])
    
    # Calculate expected check digit
    expected_check = self.calculate_check_digit(barcode_base)
    
    # Compare
    return provided_check == expected_check

def validate_barcode_detailed(self, barcode):
    """
    Validate barcode with detailed error reporting.
    
    Returns:
        tuple: (is_valid, error_messages)
    """
    errors = []
    
    if not barcode:
        return False, ["Barcode is empty"]
    
    # Check prefix
    if not barcode.startswith(self.prefix):
        errors.append(f"Barcode must start with {self.prefix}")
    
    # Check separator count
    parts = barcode.split(self.separator)
    if len(parts) != 5:
        errors.append(f"Barcode must have 5 components separated by {self.separator}")
        return False, errors
    
    prefix, tenant, warehouse, location, check = parts
    
    # Validate prefix
    if prefix != self.prefix:
        errors.append(f"Invalid prefix: {prefix}")
    
    # Validate tenant prefix length
    if len(tenant) != BARCODE_TENANT_PREFIX_LENGTH:
        errors.append(f"Tenant prefix must be {BARCODE_TENANT_PREFIX_LENGTH} characters")
    
    # Validate check digit
    if not check.isdigit():
        errors.append("Check digit must be a number")
    else:
        barcode_base = self.separator.join(parts[:-1])
        expected_check = self.calculate_check_digit(barcode_base)
        if check != expected_check:
            errors.append(f"Invalid check digit: expected {expected_check}, got {check}")
    
    is_valid = len(errors) == 0
    return is_valid, errors

def parse_barcode(self, barcode):
    """
    Parse barcode into components.
    
    Args:
        barcode: Barcode string
        
    Returns:
        dict: Components or None if invalid
    """
    if not self.validate_barcode(barcode):
        return None
    
    parts = barcode.split(self.separator)
    
    return {
        'prefix': parts[0],
        'tenant_prefix': parts[1],
        'warehouse_code': parts[2],
        'location_code': parts[3],
        'check_digit': parts[4],
        'is_valid': True
    }
```

### Validation Scenarios

**Valid Barcode:**
```python
barcode = "LOC-ABC-WHCMB01-A03R02S01B05-7"
generator.validate_barcode(barcode)  # Returns True

parsed = generator.parse_barcode(barcode)
# {
#     'prefix': 'LOC',
#     'tenant_prefix': 'ABC',
#     'warehouse_code': 'WHCMB01',
#     'location_code': 'A03R02S01B05',
#     'check_digit': '7',
#     'is_valid': True
# }
```

**Invalid Check Digit:**
```python
barcode = "LOC-ABC-WHCMB01-A03R02S01B05-9"  # Wrong check digit
generator.validate_barcode(barcode)  # Returns False

valid, errors = generator.validate_barcode_detailed(barcode)
# valid = False
# errors = ["Invalid check digit: expected 7, got 9"]
```

**Invalid Format:**
```python
barcode = "INVALID-BARCODE"
generator.validate_barcode(barcode)  # Returns False

valid, errors = generator.validate_barcode_detailed(barcode)
# valid = False
# errors = ["Barcode must start with LOC", "Barcode must have 5 components..."]
```

### Use Cases for Validation

1. **Scanning Verification:** Validate scanned barcode before lookup
2. **Import Validation:** Check barcodes in bulk import files
3. **API Input:** Validate barcode parameters in API requests
4. **Label Printing:** Verify barcode before printing labels
5. **Audit Reports:** Identify locations with invalid barcodes
6. **Migration Scripts:** Validate barcodes after data migration

### Expected Outcome
Comprehensive barcode validation methods for all use cases.

### Verification Checklist
- [ ] validate_barcode() method added
- [ ] Check digit validation works
- [ ] validate_barcode_detailed() added
- [ ] Error messages clear and specific
- [ ] parse_barcode() method added
- [ ] Returns component dictionary
- [ ] Usage examples documented
- [ ] Edge cases handled

---

## Task 41: Create Auto-Generate Barcode Signal

### Overview
Implement Django signal to automatically generate barcodes when locations are created. This ensures every location receives a barcode without manual intervention.

### Dependencies
- Task 39: Implement generate_location_barcode
- StorageLocation model complete

### Instructions

1. **Create signals.py file**
   - Create in `warehouses/` directory
   - Add module docstring

2. **Import required modules**
   - Import Django signals (pre_save, post_save)
   - Import receiver decorator
   - Import models and services

3. **Create pre_save signal receiver**
   - Trigger before location is saved
   - Check if barcode is empty
   - Generate barcode if needed

4. **Add conditional generation**
   - Only generate if barcode is None or empty
   - Skip if barcode already provided
   - Respect manual barcode assignment

5. **Handle errors gracefully**
   - Catch generation exceptions
   - Log errors
   - Don't prevent save on barcode error

6. **Register signal in AppConfig**
   - Import signals in apps.py ready() method
   - Ensure signals are registered on startup

7. **Add signal for barcode regeneration**
   - Optional: Create management command
   - Regenerate barcodes for existing locations
   - Useful for migration or fixes

### Signal Implementation

```python
"""
Signals for warehouse location barcode management.
"""
from django.db.models.signals import pre_save
from django.dispatch import receiver
import logging

from .models import StorageLocation
from .services.barcode_generator import BarcodeGenerator

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=StorageLocation)
def auto_generate_barcode(sender, instance, **kwargs):
    """
    Automatically generate barcode for storage location if not provided.
    
    Triggers before save to ensure barcode exists.
    """
    # Only generate if barcode is empty
    if instance.barcode:
        return
    
    # Skip if required fields not yet set
    if not instance.warehouse or not instance.code:
        # Will generate on next save after fields are set
        return
    
    # Generate barcode
    try:
        generator = BarcodeGenerator()
        instance.barcode = generator.generate_location_barcode(instance)
        logger.info(
            f"Auto-generated barcode {instance.barcode} for location {instance.code}"
        )
    except Exception as e:
        logger.error(
            f"Failed to auto-generate barcode for location {instance.code}: {e}"
        )
        # Don't prevent save - barcode can be generated later


@receiver(pre_save, sender=StorageLocation)
def regenerate_barcode_if_code_changed(sender, instance, **kwargs):
    """
    Regenerate barcode if location code changes.
    
    Optional: Uncomment to enable automatic regeneration on code change.
    """
    # Check if this is an update (not a new instance)
    if not instance.pk:
        return
    
    # Get old instance from database
    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return
    
    # Check if code changed
    if old_instance.code != instance.code:
        # Code changed - regenerate barcode
        try:
            generator = BarcodeGenerator()
            instance.barcode = generator.generate_location_barcode(instance)
            logger.info(
                f"Regenerated barcode for location {instance.code} "
                f"(old code: {old_instance.code})"
            )
        except Exception as e:
            logger.error(
                f"Failed to regenerate barcode for location {instance.code}: {e}"
            )
```

### Register Signals in AppConfig

```python
# In inventory/apps.py

from django.apps import AppConfig


class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventory'
    verbose_name = 'Inventory Management'
    
    def ready(self):
        """
        Import signals when app is ready.
        """
        # Import signals to register them
        from .warehouses import signals
```

### Signal Behavior

**On Location Creation:**
```python
# Create location without barcode
location = StorageLocation.objects.create(
    warehouse=warehouse,
    location_type=LOCATION_TYPE_BIN,
    code='A03-R02-S01-B05',
    name='Bin 5'
)

# Signal automatically generates barcode before save
# location.barcode now contains: "LOC-ABC-WHCMB01-A03R02S01B05-7"
```

**Manual Barcode Override:**
```python
# Create location with manual barcode
location = StorageLocation.objects.create(
    warehouse=warehouse,
    location_type=LOCATION_TYPE_BIN,
    code='A03-R02-S01-B05',
    name='Bin 5',
    barcode='CUSTOM-BARCODE-123'  # Manual barcode
)

# Signal skips generation - respects manual value
# location.barcode remains: "CUSTOM-BARCODE-123"
```

**Code Change (Optional):**
```python
# Change location code
location.code = 'A03-R02-S01-B06'
location.save()

# Optional signal regenerates barcode
# Old: LOC-ABC-WHCMB01-A03R02S01B05-7
# New: LOC-ABC-WHCMB01-A03R02S01B06-4
```

### Management Command for Bulk Generation

```python
# Optional: Create management command for bulk regeneration
# File: management/commands/generate_location_barcodes.py

from django.core.management.base import BaseCommand
from apps.inventory.warehouses.models import StorageLocation
from apps.inventory.warehouses.services.barcode_generator import BarcodeGenerator


class Command(BaseCommand):
    help = 'Generate barcodes for locations without them'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--regenerate',
            action='store_true',
            help='Regenerate all barcodes (even if already set)'
        )
    
    def handle(self, *args, **options):
        regenerate = options['regenerate']
        
        if regenerate:
            locations = StorageLocation.objects.all()
            message = "Regenerating barcodes for all locations"
        else:
            locations = StorageLocation.objects.filter(barcode__isnull=True)
            message = "Generating barcodes for locations without them"
        
        self.stdout.write(message)
        
        generator = BarcodeGenerator()
        count = 0
        errors = 0
        
        for location in locations:
            try:
                location.barcode = generator.generate_location_barcode(location)
                location.save(update_fields=['barcode'])
                count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error for {location.code}: {e}")
                )
                errors += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Generated {count} barcodes ({errors} errors)"
            )
        )
```

### Expected Outcome
```
backend/apps/inventory/warehouses/
├── signals.py (NEW)
└── apps.py (UPDATED - imports signals)
```

### Verification Checklist
- [ ] signals.py file created
- [ ] auto_generate_barcode signal implemented
- [ ] pre_save decorator used
- [ ] Conditional generation (only if empty)
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Signal registered in apps.py ready()
- [ ] Optional code change signal
- [ ] Management command documented
- [ ] Usage examples provided

---

## Summary

These first five tasks established the barcode generation system:

1. **Barcode format constants** defined structure: LOC-{TENANT}-{WAREHOUSE}-{LOCATION}-{CHECK}
2. **BarcodeGenerator service** created with tenant prefix, code normalization, check digit calculation
3. **generate_location_barcode method** combines all components with validation and uniqueness checks
4. **Barcode validation** verifies format and check digits with detailed error reporting
5. **Auto-generate signal** creates barcodes automatically on location creation

### What's Next?

The next document covers barcode lookup service, label generation, and QR code support.

**→ Continue to:** [02_Tasks-42-46_Lookup-Labels-QR.md](02_Tasks-42-46_Lookup-Labels-QR.md)
