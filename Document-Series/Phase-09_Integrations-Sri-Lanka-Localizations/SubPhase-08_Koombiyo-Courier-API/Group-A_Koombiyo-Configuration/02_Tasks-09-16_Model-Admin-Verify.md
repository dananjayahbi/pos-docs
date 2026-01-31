# Tasks 09-16: Model, Admin, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** A - Koombiyo Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Constants-Settings.md](01_Tasks-01-08_Constants-Settings.md)
- **→ Next Group:** [Group-B_API-Client-Implementation](../Group-B_API-Client-Implementation/)

---

## Document Overview

This document covers the creation of the KoombiyoConfig model for tenant-specific configuration, including pickup address details, contact information, default package settings, and COD enablement. It also includes configuration validation, Django admin interface setup, and final verification of the complete configuration system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create KoombiyoConfig Model | Medium | 45 min |
| 10 | Create Pickup Address | Low | 20 min |
| 11 | Create Contact Details | Low | 20 min |
| 12 | Create Default Weight | Low | 15 min |
| 13 | Create COD Enabled | Low | 15 min |
| 14 | Create Config Validation | Medium | 30 min |
| 15 | Create Config Admin | Medium | 35 min |
| 16 | Verify Configuration | Low | 20 min |

---

## Task 09: Create KoombiyoConfig Model

### Overview
Create the KoombiyoConfig Django model to store tenant-specific Koombiyo configuration. This model allows each tenant to have their own API credentials, preferences, and settings for the Koombiyo courier service, supporting the multi-tenant architecture of the platform.

### Dependencies
- Task 04: Create Koombiyo Settings
- SubPhase-02: Database Architecture & Multi-Tenancy (Tenant model exists)

### Instructions

1. **Navigate to shipping models**
   - Go to `backend/apps/shipping/` directory
   - Locate or create `models/` subdirectory
   - Create `koombiyo.py` model file

2. **Import required dependencies**
   - Import Django model classes and field types
   - Import tenant model from multi-tenancy app
   - Import base model mixins (TimestampMixin, etc.)
   - Import validators if needed

3. **Define KoombiyoConfig model class**
   - Create class `KoombiyoConfig` extending appropriate base
   - Add class Meta with table name, ordering, verbose names
   - Include docstring explaining model purpose

4. **Add tenant relationship field**
   - Create `tenant` ForeignKey to Tenant model
   - Set `on_delete=models.CASCADE`
   - Add `related_name='koombiyo_config'`
   - Set `unique=True` (one config per tenant)

5. **Add authentication fields**
   - Create `api_key` CharField for Koombiyo API key
   - Set `max_length=255`, `blank=False`
   - Create `merchant_id` CharField for merchant identifier
   - Set `max_length=100`, `blank=False`

6. **Add status and control fields**
   - Create `is_active` BooleanField (default=True)
   - Create `sandbox_mode` BooleanField (default=False)
   - Add `auto_generate_labels` BooleanField (default=True)

7. **Add timestamp fields**
   - Include created_at and updated_at if using mixin
   - Otherwise manually add DateTimeField with auto_now_add and auto_now

8. **Add model methods**
   - Create `__str__` method returning tenant name
   - Create `get_base_url` method returning appropriate URL based on sandbox_mode
   - Create `is_configured` property checking if credentials set

9. **Register model in __init__.py**
   - Open `backend/apps/shipping/models/__init__.py`
   - Import and expose KoombiyoConfig model
   - Ensure model is discoverable by Django

### Model Field Structure

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| tenant | ForeignKey | Link to tenant | Unique, CASCADE |
| api_key | CharField | Koombiyo API key | Max 255, required |
| merchant_id | CharField | Merchant identifier | Max 100, required |
| is_active | BooleanField | Config enabled | Default True |
| sandbox_mode | BooleanField | Use test API | Default False |
| auto_generate_labels | BooleanField | Auto-create labels | Default True |
| created_at | DateTimeField | Creation timestamp | Auto |
| updated_at | DateTimeField | Update timestamp | Auto |

### Model Relationships

```
Tenant-to-KoombiyoConfig Relationship
├── One-to-One Relationship
│   ├── Each tenant has one KoombiyoConfig
│   └── Each config belongs to one tenant
├── Cascade Deletion
│   └── Deleting tenant deletes its config
└── Access Patterns
    ├── From tenant: tenant.koombiyo_config
    └── From config: config.tenant
```

### Model Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `__str__()` | str | String representation |
| `get_base_url()` | str | Get API URL based on mode |
| `is_configured()` | bool | Check if credentials set |
| `get_credentials()` | dict | Return API credentials |
| `validate_credentials()` | bool | Test API connection |

### Base URL Selection Logic

```
get_base_url() Method Logic
├── Check self.sandbox_mode
│   ├── If True
│   │   └── Return SANDBOX_BASE_URL
│   └── If False
│       └── Return PRODUCTION_BASE_URL
├── Import from constants module
└── Usage in API client
    └── client = KoombiyoClient(config.get_base_url())
```

### Model Meta Configuration

| Meta Attribute | Value | Purpose |
|----------------|-------|---------|
| db_table | `shipping_koombiyo_config` | Table name |
| verbose_name | `Koombiyo Configuration` | Admin display |
| verbose_name_plural | `Koombiyo Configurations` | Admin display |
| ordering | `['tenant__name']` | Default sort |
| unique_together | None | Handled by unique tenant FK |

### Expected Outcome
- KoombiyoConfig model created and migrated
- Tenant relationship established
- Authentication fields defined
- Control fields for behavior configuration
- Model methods for common operations
- Ready for admin interface and API usage

### Verification Checklist
- [ ] `backend/apps/shipping/models/koombiyo.py` file created
- [ ] KoombiyoConfig model class defined
- [ ] All required fields added with proper types
- [ ] Tenant ForeignKey with unique constraint
- [ ] Model methods implemented (__str__, get_base_url)
- [ ] Model Meta configuration set
- [ ] Model imported in models/__init__.py
- [ ] Migration created successfully
- [ ] No migration errors

---

## Task 10: Create Pickup Address

### Overview
Add pickup address fields to the KoombiyoConfig model to store the sender's address from which Koombiyo will collect packages. This information is required for every shipment booking and should be stored per tenant for convenience.

### Dependencies
- Task 09: Create KoombiyoConfig Model
- Sri Lanka location models (City, District) should exist from earlier phases

### Instructions

1. **Open KoombiyoConfig model**
   - Navigate to `backend/apps/shipping/models/koombiyo.py`
   - Locate model field definitions section
   - Plan to add pickup address fields

2. **Add address line field**
   - Create `pickup_address` TextField for street address
   - Include help_text explaining format
   - Set `blank=False` (required field)

3. **Add city relationship**
   - Create `pickup_city` ForeignKey to City model
   - Import City from location models
   - Set `on_delete=models.PROTECT` (don't delete if cities removed)
   - Add `related_name='koombiyo_pickups'`

4. **Add district relationship**
   - Create `pickup_district` ForeignKey to District model
   - Import District from location models
   - Set `on_delete=models.PROTECT`
   - Add `related_name='koombiyo_pickups'`

5. **Add postal code field**
   - Create `pickup_postal_code` CharField
   - Set `max_length=10`, `blank=True` (optional)
   - Add help_text for Sri Lankan postal codes

6. **Add landmark field (optional)**
   - Create `pickup_landmark` CharField
   - Set `max_length=200`, `blank=True`
   - Help text: "Nearby landmark for easy location"

7. **Add address validation**
   - Create `clean()` method for model validation
   - Ensure city belongs to selected district
   - Validate postal code format if provided

8. **Create formatted address method**
   - Add `get_formatted_pickup_address()` method
   - Return complete address as formatted string
   - Include all address components

### Pickup Address Fields

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| pickup_address | TextField | Street address | Required |
| pickup_city | ForeignKey | City for pickup | Required, PROTECT |
| pickup_district | ForeignKey | District for pickup | Required, PROTECT |
| pickup_postal_code | CharField | Postal/ZIP code | Optional, max 10 |
| pickup_landmark | CharField | Nearby landmark | Optional, max 200 |

### Address Structure

```
Complete Pickup Address
├── Street Address (pickup_address)
│   └── Example: "123, Main Street, Colombo 03"
├── City (pickup_city)
│   └── Example: City object (Colombo)
├── District (pickup_district)
│   └── Example: District object (Colombo District)
├── Postal Code (pickup_postal_code)
│   └── Example: "00300"
└── Landmark (pickup_landmark)
    └── Example: "Near Liberty Plaza"

Formatted Output:
"123, Main Street, Colombo 03
Colombo, Colombo District 00300
Near Liberty Plaza"
```

### Sri Lankan Address Considerations

| Aspect | Implementation | Notes |
|--------|----------------|-------|
| City/Town | ForeignKey to City | Predefined list |
| District | ForeignKey to District | 25 districts |
| Postal Code | Optional field | Not always known |
| Landmarks | Very important | Common in Sri Lanka |
| Format | Flexible | Various address styles |

### Address Validation Logic

```
Model clean() Method
├── Validate City-District Relationship
│   ├── Ensure city belongs to selected district
│   └── Raise ValidationError if mismatch
├── Validate Postal Code Format
│   ├── Check if alphanumeric
│   ├── Verify length (5-10 characters)
│   └── Optional validation (can be blank)
└── Validate Address Completeness
    └── Ensure pickup_address is not empty
```

### Formatted Address Method

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `get_formatted_pickup_address()` | str | Full formatted address |
| `get_pickup_summary()` | str | Short address (city, district) |
| `get_pickup_coordinates()` | tuple | Lat/long if geocoding added |

### Usage in Shipment Booking

```
Creating Shipment with Pickup Address
├── Retrieve Tenant Config
│   └── config = tenant.koombiyo_config
├── Get Pickup Address
│   └── address = config.get_formatted_pickup_address()
├── Include in API Request
│   ├── pickup_address: config.pickup_address
│   ├── pickup_city: config.pickup_city.name
│   ├── pickup_district: config.pickup_district.name
│   └── pickup_postal_code: config.pickup_postal_code
└── Send to Koombiyo API
    └── Booking request with pickup details
```

### Expected Outcome
- Pickup address fields added to model
- City and district relationships established
- Address validation implemented
- Formatted address method available
- Ready to use in shipment bookings

### Verification Checklist
- [ ] Pickup address fields added to KoombiyoConfig
- [ ] City and District ForeignKeys created
- [ ] Postal code and landmark fields added
- [ ] Address validation in clean() method
- [ ] get_formatted_pickup_address() method implemented
- [ ] City-district relationship validated
- [ ] Migration created and applied
- [ ] No errors when creating config with address

---

## Task 11: Create Contact Details

### Overview
Add contact detail fields to the KoombiyoConfig model to store the pickup contact person's information. Koombiyo couriers need contact details to coordinate package pickups, making this information essential for successful shipment operations.

### Dependencies
- Task 09: Create KoombiyoConfig Model

### Instructions

1. **Open KoombiyoConfig model**
   - Navigate to `backend/apps/shipping/models/koombiyo.py`
   - Locate model field definitions (after address fields)
   - Plan contact detail fields

2. **Add contact name field**
   - Create `contact_name` CharField
   - Set `max_length=200`, `blank=False`
   - Add help_text: "Person to contact for pickups"

3. **Add contact phone field**
   - Create `contact_phone` CharField
   - Set `max_length=15` (to accommodate +94 format)
   - Add phone number validator
   - Set `blank=False` (required)

4. **Add alternative phone field**
   - Create `contact_phone_alt` CharField
   - Set `max_length=15`, `blank=True` (optional)
   - Add same phone validator
   - Help text: "Alternative contact number"

5. **Add contact email field**
   - Create `contact_email` EmailField
   - Set `blank=True` (optional but recommended)
   - Add help_text: "For shipment notifications"

6. **Create phone validator**
   - Import or create Sri Lankan phone validator
   - Validate format: +94 XX XXX XXXX or 0XX XXX XXXX
   - Apply to both phone fields

7. **Add contact formatting methods**
   - Create `get_formatted_phone()` method
   - Format phone to standard Sri Lankan format
   - Create `get_primary_contact()` method returning name and phone

8. **Add contact validation**
   - Update `clean()` method for phone validation
   - Ensure at least one phone number provided
   - Validate email format if provided

### Contact Detail Fields

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| contact_name | CharField | Pickup contact person | Required, max 200 |
| contact_phone | CharField | Primary phone | Required, max 15, validated |
| contact_phone_alt | CharField | Alternative phone | Optional, max 15, validated |
| contact_email | EmailField | Email address | Optional, recommended |

### Sri Lankan Phone Format

```
Sri Lankan Phone Number Formats
├── Mobile Numbers
│   ├── International: +94 77 123 4567
│   ├── Local: 077 123 4567
│   └── Compact: 0771234567
├── Landline Numbers
│   ├── International: +94 11 234 5678
│   ├── Local: 011 234 5678
│   └── Compact: 0112345678
└── Storage Format
    ├── Store with country code: +94 XX XXX XXXX
    └── Display format configurable
```

### Phone Validator Implementation

| Validation Rule | Check | Error Message |
|-----------------|-------|---------------|
| Format | +94 or 0 prefix | "Invalid Sri Lankan phone number" |
| Length | 10-13 characters | "Phone number length invalid" |
| Digits | Numeric after prefix | "Phone must contain only digits" |
| Mobile Range | 7X, 77, 78, 76, etc. | "Invalid mobile number prefix" |

### Contact Information Structure

```
Complete Contact Information
├── Primary Contact
│   ├── Name: contact_name
│   └── Phone: contact_phone
├── Alternative Contact
│   └── Phone: contact_phone_alt (optional)
└── Electronic Contact
    └── Email: contact_email (optional)

Usage in Pickup Request:
{
    "contact_person": "John Perera",
    "contact_phone": "+94 77 123 4567",
    "contact_email": "john@example.com"
}
```

### Contact Formatting Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `get_formatted_phone()` | str | Format primary phone |
| `get_all_phones()` | list | Return all phone numbers |
| `get_primary_contact()` | dict | Name and primary phone |
| `get_contact_info()` | dict | Complete contact details |

### Validation Logic

```
Contact Validation (clean method)
├── Phone Number Validation
│   ├── Validate primary phone format
│   ├── Validate alternative phone format (if provided)
│   └── Ensure at least one phone is valid
├── Email Validation
│   ├── Validate email format (if provided)
│   └── Optional but recommended warning
└── Name Validation
    ├── Ensure name is not empty
    └── Check for reasonable length
```

### Usage in Koombiyo API

```
Contact Details in Booking
├── Pickup Request
│   ├── "pickup_contact_name": config.contact_name
│   ├── "pickup_contact_phone": config.get_formatted_phone()
│   └── "pickup_contact_email": config.contact_email
├── Delivery Coordination
│   └── Koombiyo uses these to call for pickup
└── Notifications
    └── Email for status updates (if provided)
```

### Expected Outcome
- Contact detail fields added to model
- Phone number validation implemented
- Multiple phone numbers supported
- Email field for notifications
- Formatting methods for display
- Ready for courier coordination

### Verification Checklist
- [ ] Contact name field added
- [ ] Primary phone field with validation
- [ ] Alternative phone field added
- [ ] Email field added
- [ ] Sri Lankan phone validator implemented
- [ ] Formatting methods created
- [ ] Validation in clean() method updated
- [ ] Migration created and applied
- [ ] Phone numbers validate correctly

---

## Task 12: Create Default Weight

### Overview
Add a default package weight field to the KoombiyoConfig model to provide a fallback weight value when specific package weight is not specified. This simplifies the booking process for standard shipments and ensures rate calculations always have weight information.

### Dependencies
- Task 09: Create KoombiyoConfig Model

### Instructions

1. **Open KoombiyoConfig model**
   - Navigate to `backend/apps/shipping/models/koombiyo.py`
   - Locate model field definitions
   - Add default weight field after contact details

2. **Add default weight field**
   - Create `default_weight` DecimalField
   - Set `max_digits=6`, `decimal_places=2`
   - Set `default=0.5` (500 grams)
   - Add `validators=[MinValueValidator(0.1)]`

3. **Add weight unit constant**
   - Add comment or help_text specifying unit (kg)
   - Consider adding `weight_unit` CharField if multiple units supported
   - For now, assume all weights in kilograms

4. **Add weight range validation**
   - Import `MinValueValidator` and `MaxValueValidator`
   - Set minimum weight (e.g., 0.1 kg = 100g)
   - Set maximum weight (e.g., 30 kg for standard Koombiyo limit)

5. **Create weight helper methods**
   - Add `get_weight_in_grams()` method (returns weight * 1000)
   - Add `get_weight_display()` method (formatted string with unit)
   - Add `validate_weight()` method for custom validation

6. **Add weight documentation**
   - Add help_text explaining default weight purpose
   - Document typical package weight ranges
   - Note Koombiyo weight limitations

7. **Consider default dimension fields**
   - Optionally add `default_length`, `default_width`, `default_height`
   - All DecimalField with cm as unit
   - Useful for rate calculation if dimensions required

### Default Weight Field

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| default_weight | DecimalField | Default package weight (kg) | Min 0.1, max 30, default 0.5 |
| weight_unit | CharField | Weight unit (display) | Fixed to "kg" |

### Weight Configuration

```
Weight Field Specifications
├── Database Type: Decimal(6,2)
├── Unit: Kilograms (kg)
├── Default Value: 0.5 kg (500 grams)
├── Minimum: 0.1 kg (100 grams)
├── Maximum: 30 kg (Koombiyo standard limit)
└── Precision: 2 decimal places (e.g., 1.25 kg)

Common Default Weights:
├── Documents/Letters: 0.1 - 0.5 kg
├── Small Packages: 0.5 - 2.0 kg
├── Medium Packages: 2.0 - 5.0 kg
├── Large Packages: 5.0 - 15.0 kg
└── Heavy Items: 15.0 - 30.0 kg
```

### Weight Validation

| Validation | Rule | Error Message |
|------------|------|---------------|
| Minimum | >= 0.1 kg | "Weight must be at least 100 grams" |
| Maximum | <= 30 kg | "Weight exceeds Koombiyo limit of 30kg" |
| Format | 2 decimal places | "Use maximum 2 decimal places" |
| Positive | > 0 | "Weight must be positive" |

### Weight Helper Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `get_weight_in_grams()` | int | Convert kg to grams |
| `get_weight_display()` | str | Formatted weight with unit |
| `validate_weight(weight)` | bool | Check if weight valid |
| `is_express_eligible()` | bool | Check if weight allows express |

### Usage in Rate Calculation

```
Using Default Weight
├── Shipment Creation Without Weight
│   ├── User creates shipment
│   ├── Weight not specified
│   └── Use config.default_weight
├── Rate Calculation API Call
│   ├── weight = shipment.weight or config.default_weight
│   ├── Send to Koombiyo API
│   └── Get rate based on weight
└── Booking Creation
    ├── Include actual or default weight
    └── Store which weight used for records
```

### Optional Dimension Fields

| Field | Type | Unit | Default | Purpose |
|-------|------|------|---------|---------|
| default_length | DecimalField | cm | 20 | Package length |
| default_width | DecimalField | cm | 15 | Package width |
| default_height | DecimalField | cm | 10 | Package height |
| dimensions_required | BooleanField | - | False | Enforce dimensions |

### Weight-Based Features

```
Weight-Dependent Logic
├── Rate Calculation
│   ├── Light (<2kg): Standard rate
│   ├── Medium (2-10kg): Medium rate
│   └── Heavy (>10kg): Heavy rate
├── Service Availability
│   ├── Express: Up to 5kg
│   ├── Standard: Up to 30kg
│   └── Freight: Over 30kg (special handling)
└── Delivery Time
    ├── Lighter packages: Faster
    └── Heavier packages: May take longer
```

### Expected Outcome
- Default weight field added with proper validation
- Weight unit specified (kilograms)
- Helper methods for weight conversion and display
- Validation ensures weights within Koombiyo limits
- Optional dimension fields for enhanced functionality
- Ready to use in shipment rate calculations

### Verification Checklist
- [ ] default_weight field added as DecimalField
- [ ] Minimum and maximum validators applied
- [ ] Default value set to 0.5 kg
- [ ] Weight unit documented in help_text
- [ ] get_weight_in_grams() method implemented
- [ ] get_weight_display() method implemented
- [ ] Validation in clean() method if needed
- [ ] Migration created and applied
- [ ] Weight validation works correctly

---

## Task 13: Create COD Enabled

### Overview
Add a cash-on-delivery (COD) enablement field to the KoombiyoConfig model to control whether COD shipments are allowed for the tenant. COD is a popular payment option in Sri Lanka, and this setting allows tenants to enable or disable it based on their business needs.

### Dependencies
- Task 09: Create KoombiyoConfig Model

### Instructions

1. **Open KoombiyoConfig model**
   - Navigate to `backend/apps/shipping/models/koombiyo.py`
   - Locate model field definitions
   - Add COD field in features section

2. **Add COD enabled field**
   - Create `cod_enabled` BooleanField
   - Set `default=True` (most tenants want COD)
   - Add help_text explaining COD functionality

3. **Add COD collection settings**
   - Create `cod_collection_method` CharField with choices
   - Options: 'auto' (Koombiyo collects), 'manual' (tenant manages)
   - Set `default='auto'`

4. **Add COD fee configuration**
   - Create `cod_fee_percentage` DecimalField
   - Set `max_digits=4`, `decimal_places=2`
   - Set `default=0.00` (no additional fee)
   - Validate range 0-10% (reasonable COD fee range)

5. **Add COD documentation**
   - Document how COD works with Koombiyo
   - Explain collection timeline
   - Note any Koombiyo COD fees

6. **Create COD validation methods**
   - Add `is_cod_available()` method
   - Check if COD enabled and properly configured
   - Add `calculate_cod_fee(amount)` method

7. **Add COD-related properties**
   - Create `@property` for COD status
   - Add methods to check COD eligibility for shipments

### COD Configuration Fields

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| cod_enabled | BooleanField | Allow COD shipments | Default True |
| cod_collection_method | CharField | Collection method | Choices, default 'auto' |
| cod_fee_percentage | DecimalField | Additional COD fee | 0-10%, default 0 |
| cod_max_amount | DecimalField | Maximum COD value | Optional, in LKR |

### COD in Sri Lankan E-commerce

```
Cash on Delivery Importance
├── Customer Preference
│   ├── Many customers prefer COD
│   ├── Trust issues with online payments
│   └── No credit card requirement
├── Business Benefits
│   ├── Increased conversion rates
│   ├── Wider customer reach
│   └── Reduced abandoned carts
└── Challenges
    ├── Returns and refusals
    ├── Cash handling
    └── Collection delays
```

### COD Collection Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| auto | Koombiyo collects and remits | Standard, recommended |
| manual | Tenant manages collection | Special arrangements |
| escrow | Held by Koombiyo temporarily | High-value items |

### COD Fee Structure

```
COD Fee Calculation
├── Base Shipping Fee
│   └── Standard Koombiyo rate
├── Koombiyo COD Fee
│   └── Typically 1-3% of COD amount
├── Tenant Additional Fee (Optional)
│   └── config.cod_fee_percentage
└── Total Customer Cost
    └── Shipping + All COD fees

Example:
├── Shipping: LKR 500
├── COD Amount: LKR 5,000
├── Koombiyo Fee (2%): LKR 100
├── Tenant Fee (1%): LKR 50
└── Total: LKR 650
```

### COD Validation Logic

```
COD Availability Check (is_cod_available method)
├── Check cod_enabled flag
│   └── If False → COD not available
├── Check merchant configuration
│   └── API credentials valid?
├── Check COD amount limits
│   ├── Minimum COD (e.g., LKR 100)
│   └── Maximum COD (if configured)
└── Check delivery location
    └── COD available in destination?

Return: True if all checks pass, False otherwise
```

### COD Helper Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| `is_cod_available()` | bool | Check if COD enabled |
| `calculate_cod_fee(amount)` | Decimal | Calculate COD fee |
| `get_cod_max_amount()` | Decimal | Get max COD value |
| `validate_cod_shipment(amount)` | bool | Validate COD shipment |

### COD in Booking Flow

```
Creating COD Shipment
├── Check COD Availability
│   └── config.is_cod_available()
├── Validate COD Amount
│   ├── Check minimum (e.g., >= LKR 100)
│   ├── Check maximum (if set)
│   └── Validate against config.cod_max_amount
├── Calculate Fees
│   ├── Get base shipping rate
│   ├── Add Koombiyo COD fee
│   └── Add tenant COD fee (if any)
├── Create Booking with COD
│   ├── cod_enabled: True
│   ├── cod_amount: Order total
│   └── cod_fee: Calculated fee
└── Track COD Collection
    └── Monitor when Koombiyo remits payment
```

### COD Settings in Admin

| Setting | Admin Control | Description |
|---------|---------------|-------------|
| Enable/Disable | Checkbox | Toggle COD availability |
| Collection Method | Dropdown | How COD is collected |
| Fee Percentage | Number input | Additional fee (0-10%) |
| Max Amount | Number input | Limit COD value |

### Expected Outcome
- COD enabled field with proper default
- Collection method configuration
- Optional COD fee settings
- COD validation and calculation methods
- Ready to support COD shipments
- Clear documentation of COD workflow

### Verification Checklist
- [ ] cod_enabled field added as BooleanField
- [ ] Default set to True
- [ ] cod_collection_method field with choices
- [ ] cod_fee_percentage field with validation
- [ ] is_cod_available() method implemented
- [ ] calculate_cod_fee() method implemented
- [ ] Help text explaining COD functionality
- [ ] Migration created and applied
- [ ] COD settings work correctly in admin

---

## Task 14: Create Config Validation

### Overview
Implement configuration validation to ensure KoombiyoConfig settings are correct and functional before allowing API operations. This includes validating API credentials, testing connectivity, and verifying that all required fields are properly configured.

### Dependencies
- Task 09: Create KoombiyoConfig Model
- All field tasks (10-13) completed

### Instructions

1. **Create validation method in model**
   - Open `backend/apps/shipping/models/koombiyo.py`
   - Add `validate_configuration()` method to model
   - Return validation result and error messages

2. **Validate required fields**
   - Check that tenant is set
   - Ensure API key is not empty
   - Ensure merchant ID is not empty
   - Verify pickup address fields are complete

3. **Validate contact information**
   - Check that contact name is provided
   - Validate phone number format
   - Verify at least one phone number exists
   - Optionally check email if provided

4. **Validate pickup address**
   - Ensure all address fields are filled
   - Verify city-district relationship is valid
   - Check that pickup_city belongs to pickup_district
   - Validate postal code format if provided

5. **Test API credentials**
   - Create method `test_api_connection()`
   - Make a simple API call to Koombiyo (e.g., test endpoint or rate check)
   - Catch authentication errors
   - Return success/failure with error details

6. **Create validation result structure**
   - Return dictionary with validation results
   - Include `is_valid` boolean
   - Include `errors` list with specific error messages
   - Include `warnings` list for non-critical issues

7. **Add model clean() method**
   - Override Django's `clean()` method
   - Run field validations
   - Raise `ValidationError` for critical issues
   - Provide clear error messages

8. **Create validation command**
   - Create management command `validate_koombiyo_config`
   - Allow validating specific tenant or all tenants
   - Output validation results to console
   - Useful for deployment checks

### Validation Categories

| Category | Checks | Severity |
|----------|--------|----------|
| Required Fields | API key, merchant ID, tenant | Critical |
| Contact Info | Name, phone, email format | Critical |
| Address | Complete address, city-district | Critical |
| Credentials | API connection test | Critical |
| Optional Fields | Landmarks, alt phone | Warning |
| Defaults | Weight, COD settings | Warning |

### Validation Flow

```
Configuration Validation Process
├── Field Completeness Check
│   ├── Validate required fields present
│   ├── Check field format validity
│   └── Verify field relationships
├── Business Logic Validation
│   ├── City belongs to district
│   ├── Phone numbers valid format
│   └── Weight within limits
├── API Credential Validation
│   ├── Test API connection
│   ├── Verify authentication
│   └── Check API key validity
└── Return Validation Result
    ├── is_valid: True/False
    ├── errors: List of critical issues
    └── warnings: List of minor issues
```

### Validation Result Structure

```python
{
    "is_valid": False,
    "errors": [
        "API key is required",
        "Contact phone number is invalid",
        "City does not belong to selected district"
    ],
    "warnings": [
        "Alternative phone not provided",
        "Postal code not specified",
        "Email not provided for notifications"
    ],
    "api_test": {
        "success": False,
        "message": "Authentication failed",
        "status_code": 401
    }
}
```

### API Connection Test

```
test_api_connection() Method
├── Select API Base URL
│   └── Based on sandbox_mode setting
├── Prepare Test Request
│   ├── Use minimal API endpoint (e.g., /auth/test)
│   ├── Include API key in headers
│   └── Include merchant ID if required
├── Make API Call
│   ├── Set reasonable timeout (10 seconds)
│   ├── Handle connection errors
│   └── Handle timeout errors
├── Evaluate Response
│   ├── 200: Success → Credentials valid
│   ├── 401: Auth error → Invalid credentials
│   ├── 403: Forbidden → Account issue
│   └── Others: Connection or server issue
└── Return Result
    └── Dict with success status and message
```

### Validation Error Messages

| Issue | Error Message | Solution |
|-------|---------------|----------|
| Missing API key | "API key is required for Koombiyo integration" | Set KOOMBIYO_API_KEY |
| Missing merchant ID | "Merchant ID must be configured" | Provide merchant ID |
| Invalid phone | "Contact phone number format is invalid" | Use +94 XX XXX XXXX |
| City-district mismatch | "Selected city does not belong to the district" | Fix city/district |
| API auth failed | "API credentials are invalid" | Check API key/merchant ID |

### Management Command

```
Django Management Command: validate_koombiyo_config
├── Command Options
│   ├── --tenant=<tenant_id>: Validate specific tenant
│   ├── --all: Validate all tenant configs
│   └── --verbose: Show detailed output
├── Execution
│   ├── Load config(s) from database
│   ├── Run validate_configuration() for each
│   ├── Display results in table format
│   └── Exit with error code if any fail
└── Output
    ├── Success count
    ├── Error count
    └── Detailed errors for each failed config
```

### Clean() Method Implementation

```
Model clean() Override
├── Call super().clean()
├── Validate Required Fields
│   └── Raise ValidationError if missing
├── Validate Field Relationships
│   └── E.g., city in district
├── Validate Formats
│   └── Phone, email, postal code
└── Optionally Test API
    └── Skip if expensive operation
```

### Expected Outcome
- Comprehensive validation method
- API credential testing
- Field relationship validation
- Clear error and warning messages
- Management command for bulk validation
- Prevents invalid configurations from being saved

### Verification Checklist
- [ ] validate_configuration() method implemented
- [ ] Required field validation working
- [ ] Contact info validation implemented
- [ ] Address validation with city-district check
- [ ] test_api_connection() method created
- [ ] Validation result structure defined
- [ ] Model clean() method overridden
- [ ] Management command created (optional)
- [ ] Validation catches common errors
- [ ] Clear error messages provided

---

## Task 15: Create Config Admin

### Overview
Create a Django admin interface for the KoombiyoConfig model to allow staff and superusers to manage Koombiyo configurations for tenants. The admin should provide an intuitive interface for viewing, editing, and validating configurations with proper organization and validation feedback.

### Dependencies
- Task 09: Create KoombiyoConfig Model
- Task 14: Create Config Validation

### Instructions

1. **Create admin file**
   - Navigate to `backend/apps/shipping/` directory
   - Open or create `admin.py` file
   - Import necessary admin classes and decorators

2. **Import model and dependencies**
   - Import KoombiyoConfig model
   - Import Django admin classes
   - Import any custom widgets or forms needed

3. **Create ModelAdmin class**
   - Create `KoombiyoConfigAdmin` class extending `admin.ModelAdmin`
   - Add class-level docstring
   - Configure basic admin options

4. **Configure list display**
   - Set `list_display` tuple with key fields
   - Include: tenant, is_active, sandbox_mode, cod_enabled
   - Add custom admin methods for formatted display

5. **Configure list filters**
   - Set `list_filter` with: is_active, sandbox_mode, cod_enabled
   - Add custom filters if needed

6. **Configure search fields**
   - Set `search_fields` with: tenant name, merchant_id, contact_name
   - Enable searching by key identifiers

7. **Organize fields into fieldsets**
   - Create `fieldsets` tuple organizing fields into logical sections
   - Sections: Tenant, Authentication, Pickup Address, Contact, Defaults, Features
   - Use collapsible sections for less-used fields

8. **Add readonly fields**
   - Set `readonly_fields` for: created_at, updated_at
   - Add custom readonly fields for validation status
   - Create methods for formatted display of computed fields

9. **Create custom admin actions**
   - Add "Validate Configuration" action
   - Add "Test API Connection" action
   - Add "Enable/Disable" actions

10. **Add inline validation**
    - Override `save_model()` to validate before saving
    - Display validation errors to user
    - Show success messages after save

11. **Create custom admin methods**
    - Add `colored_status()` method with color-coded status
    - Add `connection_test()` method to show test result
    - Add `formatted_address()` method to display pickup address

12. **Register admin class**
    - Use `@admin.register(KoombiyoConfig)` decorator
    - Or use `admin.site.register(KoombiyoConfig, KoombiyoConfigAdmin)`

### Admin Configuration Structure

| Admin Attribute | Value | Purpose |
|-----------------|-------|---------|
| list_display | Multiple fields | Table columns |
| list_filter | Status fields | Sidebar filters |
| search_fields | Text fields | Search functionality |
| fieldsets | Organized sections | Form organization |
| readonly_fields | Timestamps, computed | Non-editable fields |
| actions | Custom actions | Bulk operations |

### List Display Fields

```
Admin List View Columns
├── Tenant
│   └── tenant__name (linked to edit)
├── Status
│   ├── colored_status() (custom method with icon)
│   └── is_active (boolean icon)
├── Environment
│   └── sandbox_mode (boolean icon)
├── Features
│   └── cod_enabled (boolean icon)
├── Contact
│   └── contact_name
└── Actions
    └── Quick links for validation/testing
```

### Fieldsets Organization

```
Admin Form Fieldsets
├── Tenant Information
│   └── tenant (ForeignKey select)
├── Authentication
│   ├── api_key (password input)
│   ├── merchant_id
│   ├── sandbox_mode (checkbox)
│   └── is_active (checkbox)
├── Pickup Address
│   ├── pickup_address (textarea)
│   ├── pickup_city (select)
│   ├── pickup_district (select)
│   ├── pickup_postal_code
│   └── pickup_landmark
├── Contact Information
│   ├── contact_name
│   ├── contact_phone
│   ├── contact_phone_alt
│   └── contact_email
├── Default Settings
│   ├── default_weight
│   ├── auto_generate_labels
│   └── cod_enabled
├── COD Configuration (collapsible)
│   ├── cod_collection_method
│   ├── cod_fee_percentage
│   └── cod_max_amount
└── Metadata (read-only, collapsible)
    ├── created_at
    └── updated_at
```

### Custom Admin Actions

| Action | Description | Permission |
|--------|-------------|------------|
| Validate Configuration | Run validation on selected configs | Staff |
| Test API Connection | Test credentials for selected configs | Staff |
| Enable Configs | Set is_active=True | Superuser |
| Disable Configs | Set is_active=False | Superuser |

### Custom Admin Methods

| Method | Return Type | Display |
|--------|-------------|---------|
| colored_status | HTML | Green/red icon based on validation |
| formatted_address | String | Complete pickup address |
| connection_test | HTML | Button to test API |
| cod_status | String | "Enabled" or "Disabled" with icon |

### Validation Integration

```
Admin Save Process with Validation
├── User Submits Form
├── save_model() Called
│   ├── Run validation: config.validate_configuration()
│   ├── Check result
│   │   ├── If errors → Show error message
│   │   └── If warnings → Show warning message
│   └── Save if valid or user confirms
├── Display Messages
│   ├── Success: "Configuration saved and validated successfully"
│   ├── Warning: "Saved with warnings: [list]"
│   └── Error: "Cannot save: [error list]"
└── Redirect or Stay on Form
```

### Admin Action Implementation

```
Validate Configuration Action
├── Select multiple configs in list view
├── Choose "Validate Configuration" action
├── Action executed
│   ├── For each selected config
│   │   ├── Call validate_configuration()
│   │   ├── Collect results
│   │   └── Count successes/failures
│   └── Display summary message
└── Message Format
    └── "Validated 5 configs: 3 passed, 2 failed"
```

### Expected Outcome
- Functional Django admin for KoombiyoConfig
- Organized form with logical field grouping
- List view with key information at a glance
- Search and filter capabilities
- Custom actions for validation and testing
- Inline validation feedback
- User-friendly interface for configuration management

### Verification Checklist
- [ ] Admin class created and registered
- [ ] list_display configured with key fields
- [ ] list_filter and search_fields set up
- [ ] Fieldsets organized into logical sections
- [ ] Readonly fields for timestamps
- [ ] Custom admin methods implemented
- [ ] Admin actions for validation created
- [ ] Validation integration in save_model()
- [ ] Admin accessible at /admin/shipping/koombiyoconfig/
- [ ] Can create, edit, and delete configs via admin
- [ ] Validation errors display properly

---

## Task 16: Verify Configuration

### Overview
Perform comprehensive verification of the complete KoombiyoConfig system to ensure all components work together correctly. This includes testing model creation, validation, admin interface, and integration with settings and constants.

### Dependencies
- All previous tasks (01-15) must be complete

### Instructions

1. **Verify database migration**
   - Check that all migrations have been created
   - Run migrations to ensure no errors
   - Verify table exists in database
   - Check that all fields created correctly

2. **Test model creation via Django shell**
   - Open Django shell: `python manage.py shell`
   - Import necessary models (Tenant, KoombiyoConfig, City, District)
   - Create test KoombiyoConfig instance
   - Verify all fields save correctly

3. **Test model methods**
   - Call `get_base_url()` and verify correct URL returned
   - Test `get_formatted_pickup_address()` method
   - Call `validate_configuration()` and check results
   - Test `is_cod_available()` method

4. **Test validation**
   - Create config with missing required fields
   - Verify validation catches errors
   - Fix errors and verify validation passes
   - Test API connection if credentials available

5. **Verify admin interface**
   - Access admin at `/admin/shipping/koombiyoconfig/`
   - Create new config via admin
   - Edit existing config
   - Test custom actions (validation, test connection)
   - Verify fieldsets display correctly

6. **Test settings integration**
   - Verify KOOMBIYO_* settings accessible
   - Check environment variable loading works
   - Test sandbox toggle affects base URL
   - Verify settings values in config creation

7. **Test constants usage**
   - Import constants from constants.py
   - Verify URLs defined and accessible
   - Check endpoint paths available
   - Test status mappings

8. **Verify tenant isolation**
   - Create configs for multiple tenants
   - Verify each tenant has independent config
   - Test that tenant deletion cascades to config
   - Ensure configs are properly isolated

9. **Test data integrity**
   - Create config with complete valid data
   - Verify all fields saved correctly
   - Check foreign key relationships (city, district)
   - Verify timestamps updated properly

10. **Document verification results**
    - Create checklist of tested components
    - Note any issues or edge cases discovered
    - Document successful test scenarios
    - Record any necessary follow-up tasks

### Verification Checklist

| Component | What to Verify | Expected Result |
|-----------|----------------|-----------------|
| Migrations | All created and applied | No errors, table exists |
| Model | Creates and saves | Instance created successfully |
| Fields | All fields work | Data saves and retrieves correctly |
| Methods | All methods function | Return expected values |
| Validation | Catches errors | Errors detected and reported |
| Admin | CRUD operations | Can create/edit/delete configs |
| Settings | Environment vars load | Settings accessible in code |
| Constants | Imports work | Constants available |

### Test Scenarios

```
Test Scenario 1: Complete Valid Config
├── Create tenant
├── Create city and district
├── Create KoombiyoConfig with all fields
├── Save config
├── Verify saved successfully
└── Validate configuration → Should pass

Test Scenario 2: Invalid Config (Missing Fields)
├── Create KoombiyoConfig
├── Leave api_key blank
├── Attempt to save
├── Verify validation error
└── Fix error and save → Should succeed

Test Scenario 3: City-District Mismatch
├── Create config
├── Select city from District A
├── Select District B
├── Attempt to save
├── Verify validation catches mismatch
└── Fix and save → Should succeed

Test Scenario 4: API Connection Test
├── Create config with valid credentials
├── Call test_api_connection()
├── Verify connection succeeds (if credentials valid)
└── Or verify error message (if invalid)

Test Scenario 5: Sandbox Mode Toggle
├── Create config with sandbox_mode=True
├── Call get_base_url()
├── Verify returns sandbox URL
├── Set sandbox_mode=False
├── Verify returns production URL
```

### Django Shell Test Commands

```python
# Import models
from apps.shipping.models import KoombiyoConfig
from apps.tenants.models import Tenant
from apps.locations.models import City, District

# Get or create test tenant
tenant = Tenant.objects.first()

# Get locations
district = District.objects.get(name="Colombo")
city = City.objects.filter(district=district).first()

# Create config
config = KoombiyoConfig.objects.create(
    tenant=tenant,
    api_key="test_api_key_123",
    merchant_id="TEST_MERCHANT_001",
    sandbox_mode=True,
    pickup_address="123 Test Street, Colombo 03",
    pickup_city=city,
    pickup_district=district,
    pickup_postal_code="00300",
    contact_name="Test Contact",
    contact_phone="+94 77 123 4567",
    contact_email="test@example.com",
    default_weight=0.5,
    cod_enabled=True
)

# Test methods
print(config.get_base_url())  # Should print sandbox URL
print(config.get_formatted_pickup_address())
print(config.validate_configuration())
print(config.is_cod_available())

# Save and verify
config.save()
print(f"Config saved: {config}")
```

### Admin Verification Steps

```
Admin Interface Testing
├── Navigate to /admin/
├── Login as superuser
├── Go to Shipping → Koombiyo Configurations
├── List View
│   ├── Verify columns display correctly
│   ├── Test search functionality
│   ├── Test filters in sidebar
│   └── Check pagination if many configs
├── Add New Config
│   ├── Fill all required fields
│   ├── Submit form
│   ├── Verify success message
│   └── Check config created in list
├── Edit Config
│   ├── Click on config to edit
│   ├── Modify fields
│   ├── Save changes
│   └── Verify updates saved
├── Custom Actions
│   ├── Select one or more configs
│   ├── Choose "Validate Configuration"
│   ├── Execute action
│   └── Verify results displayed
└── Delete Config
    ├── Delete test config
    └── Verify deletion successful
```

### Integration Verification

| Integration Point | Verification Method | Pass Criteria |
|-------------------|---------------------|---------------|
| Settings Module | Import and access settings | No import errors |
| Constants Module | Import constants | No import errors |
| Tenant Model | Create config for tenant | Foreign key works |
| Location Models | Link city and district | Relationships work |
| Validation System | Run validation | Errors detected correctly |
| Admin Interface | Perform CRUD operations | All operations succeed |

### Expected Outcome
- All KoombiyoConfig components verified working
- Model creates, saves, and validates correctly
- Admin interface fully functional
- Settings and constants integrated properly
- Tenant isolation verified
- System ready for API client implementation

### Final Verification Checklist
- [ ] Database migrations applied successfully
- [ ] Model creates and saves without errors
- [ ] All model methods return expected results
- [ ] Validation catches errors appropriately
- [ ] Admin interface accessible and functional
- [ ] Can create config via admin
- [ ] Can edit config via admin
- [ ] Search and filters work in admin
- [ ] Custom actions execute correctly
- [ ] Settings load from environment variables
- [ ] Constants import without errors
- [ ] Base URL selection works (sandbox/production)
- [ ] Tenant isolation verified
- [ ] Foreign key relationships functional
- [ ] Complete valid config validates successfully
- [ ] Invalid configs fail validation with clear errors
- [ ] All test scenarios pass
- [ ] No errors in Django logs during testing

---

## Summary

This document completed the KoombiyoConfig model implementation with all necessary fields for tenant-specific configuration, including pickup address, contact details, default package settings, and COD enablement. We also implemented comprehensive validation, created a full-featured Django admin interface, and verified the entire configuration system.

### Completed Tasks
9. ✓ Created KoombiyoConfig model with tenant relationship and authentication fields
10. ✓ Added pickup address fields with city and district relationships
11. ✓ Added contact detail fields with Sri Lankan phone validation
12. ✓ Added default weight field with proper validation and helper methods
13. ✓ Added COD enabled field with collection method and fee configuration
14. ✓ Implemented comprehensive configuration validation with API testing
15. ✓ Created Django admin interface with organized fieldsets and custom actions
16. ✓ Verified complete configuration system functionality

### Next Steps
Proceed to [Group-B_API-Client-Implementation](../Group-B_API-Client-Implementation/) to create the Koombiyo API client that will use these configurations to interact with the Koombiyo courier service for rate calculations, bookings, tracking, and label generation.
