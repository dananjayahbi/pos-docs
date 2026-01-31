# Tasks 09-16: Address Template Migration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** A - Waybill Models & Schema  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Waybill-Core-Fields.md](01_Tasks-01-08_Waybill-Core-Fields.md)

---

## Document Overview

This document completes the Waybill model by adding tracking data fields (barcode and QR code), JSON address fields for sender and recipient information, creating the WaybillTemplate model for tenant-specific customization, and generating the necessary database migrations. These components enable complete waybill functionality with Sri Lankan address formats and custom template support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Create barcode_data Field | Low | 10 min |
| 10 | Create qr_data Field | Low | 10 min |
| 11 | Create sender_address Field | Low | 15 min |
| 12 | Create recipient_address Field | Low | 15 min |
| 13 | Create WaybillTemplate Model | Medium | 25 min |
| 14 | Create template_name Field | Low | 10 min |
| 15 | Create template_html Field | Low | 10 min |
| 16 | Create Waybill Migrations | Low | 20 min |

---

## Task 09: Create barcode_data Field

### Overview
Add the barcode_data field to store encoded barcode values for waybill identification. This field contains the data that will be rendered as a barcode on the physical waybill, enabling quick scanning and automated processing by courier services and tracking systems.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Add barcode_data field to Waybill model**
   - Define CharField with max_length=100 characters
   - Set blank=True and null=True for optional data
   - Add db_index=True for barcode lookups
   - Set verbose_name="Barcode Data"

2. **Plan barcode encoding strategies**
   - Support Code 128 format for alphanumeric data
   - Include waybill number as primary identifier
   - Consider courier-specific encoding requirements
   - Plan for validation and checksum verification

3. **Configure field for automation**
   - Auto-populate during PDF generation
   - Coordinate with PDF barcode rendering
   - Plan for barcode format validation
   - Support scanner integration requirements

4. **Document barcode specifications**
   - Include help_text for field usage
   - Document supported barcode formats
   - Plan for courier service compatibility
   - Consider future barcode standard changes

### Barcode Data Formats

| Courier | Format | Content | Example |
|---------|--------|---------|---------|
| Koombiyo | Code 128 | Waybill number | KB12345678 |
| Domex | Code 39 | Number + checksum | DX2026013112345C |
| PromptX | Code 128 | Alphanumeric ID | PX26A12B34 |
| Royal Express | Code 128 | 10-digit number | RE1234567890 |
| Trance Express | Code 128 | Date + sequence | TE26011501234 |

### Barcode Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| max_length | 100 | Support all formats |
| blank | True | Optional until generated |
| null | True | Database nullable |
| db_index | True | Barcode lookup optimization |
| verbose_name | Barcode Data | User-friendly name |

### Barcode Generation Process

```
Waybill Creation
       │
       ▼
   PDF Generation
       │
       ▼ (Extract/Format)
  Barcode Data
       │
       ▼ (Render)
  Physical Barcode
       │
       ▼ (Scan)
  Tracking System
```

### Barcode Standards Support

| Standard | Usage | Character Set |
|----------|-------|---------------|
| Code 128 | Primary format | Full ASCII |
| Code 39 | Legacy support | Alphanumeric + symbols |
| EAN-13 | Numeric only | 0-9 digits |
| DataMatrix | High density | Full ASCII |

### Expected Outcome
- Barcode data field for tracking integration
- Support for multiple barcode formats
- Automated population during PDF generation
- Database optimization for barcode lookups

### Verification Checklist
- [ ] barcode_data field added as CharField
- [ ] Field configured as optional with proper length
- [ ] Database index created for lookup performance
- [ ] Field supports all courier barcode formats
- [ ] Documentation includes barcode specifications

---

## Task 10: Create qr_data Field

### Overview
Add the qr_data field to store QR code tracking URLs for modern mobile scanning capabilities. This field contains the complete URL that customers and courier staff can scan to access real-time tracking information and delivery status updates.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Add qr_data field to Waybill model**
   - Define TextField for URL storage (unlimited length)
   - Set blank=True and null=True for optional data
   - Add verbose_name="QR Code Data"
   - Include help_text explaining QR purpose

2. **Plan QR code URL structure**
   - Include tenant subdomain for multi-tenant support
   - Add waybill number as tracking identifier
   - Include authentication tokens for security
   - Plan for mobile-optimized tracking pages

3. **Configure QR data generation**
   - Auto-populate during PDF creation
   - Generate tenant-specific tracking URLs
   - Include security parameters for access control
   - Plan for URL expiration and refresh

4. **Design tracking URL format**
   - Use HTTPS for secure connections
   - Include tenant identification
   - Add waybill tracking parameters
   - Plan for mobile browser compatibility

### QR Code URL Structure

```
Base URL Format:
https://{tenant}.lankacommerce.cloud/track/{waybill_number}?token={access_token}&source=qr

Components:
├── Protocol: HTTPS (secure)
├── Subdomain: {tenant_schema}
├── Domain: lankacommerce.cloud
├── Path: /track/{waybill_number}
├── Token: Access authentication
└── Source: QR tracking source
```

### QR URL Examples

| Tenant | Waybill | Generated QR URL |
|--------|---------|------------------|
| shop001 | KB12345678 | https://shop001.lankacommerce.cloud/track/KB12345678?token=abc123&source=qr |
| store02 | DX2026013112345 | https://store02.lankacommerce.cloud/track/DX2026013112345?token=def456&source=qr |
| retail3 | PX26A12B34 | https://retail3.lankacommerce.cloud/track/PX26A12B34?token=ghi789&source=qr |

### QR Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | TextField | Unlimited URL length |
| blank | True | Optional until generated |
| null | True | Database nullable |
| verbose_name | QR Code Data | User-friendly name |
| help_text | URL for QR tracking | Field documentation |

### QR Code Features

| Feature | Benefit | Implementation |
|---------|---------|----------------|
| Mobile Scanning | Customer convenience | QR code on waybill |
| Real-time Tracking | Live status updates | Dynamic web page |
| Multi-language | Sri Lankan languages | Localized interface |
| Secure Access | Data protection | Token-based auth |

### Mobile Tracking Page Content

```
Mobile Tracking Page Layout:
├── Header: LCC Logo + Tenant Brand
├── Status: Current shipment status
├── Timeline: Delivery progress steps  
├── Details: Sender/recipient info
├── Map: Delivery route (if available)
├── Contact: Courier service details
└── Footer: Help and support links
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Access Tokens | Time-limited JWT tokens |
| Rate Limiting | Prevent abuse of tracking |
| Data Privacy | Limited info exposure |
| HTTPS Only | Secure data transmission |

### Expected Outcome
- QR code field for mobile tracking URLs
- Tenant-specific tracking page access
- Secure token-based authentication
- Mobile-optimized tracking experience

### Verification Checklist
- [ ] qr_data field added as TextField
- [ ] Field configured as optional for pre-generation
- [ ] QR URL format planned with security tokens
- [ ] Mobile tracking page structure designed
- [ ] Multi-tenant URL structure implemented

---

## Task 11: Create sender_address Field

### Overview
Add the sender_address JSON field to store structured sender address information. This field contains complete sender details including name, address lines, city, postal code, and phone number in a format compatible with Sri Lankan addressing standards and courier service requirements.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Add sender_address field to Waybill model**
   - Define JSONField for structured address data
   - Set blank=True and null=True for optional data
   - Add verbose_name="Sender Address"
   - Include help_text describing JSON structure

2. **Design JSON schema for sender data**
   - Include name field for sender identification
   - Add address_line_1 for primary address
   - Include address_line_2 for additional details
   - Add city, postal_code, and phone fields

3. **Plan Sri Lankan address format**
   - Support Sinhala and English address formats
   - Include district and province for location
   - Handle postal code validation
   - Support mobile phone format (+94 XX XXX XXXX)

4. **Configure address validation**
   - Plan JSON schema validation
   - Validate phone number formats
   - Check postal code patterns
   - Ensure required field completion

### Sri Lankan Address Structure

```json
{
  "name": "Sender Name",
  "address_line_1": "123, Main Street",
  "address_line_2": "Near Temple",
  "city": "Colombo",
  "district": "Colombo",
  "province": "Western",
  "postal_code": "00100",
  "phone": "+94 77 123 4567",
  "email": "sender@example.com"
}
```

### Address Field Schema

| Field | Type | Required | Format | Example |
|-------|------|----------|---------|---------|
| name | String | Yes | Full name | "Kasun Perera" |
| address_line_1 | String | Yes | Primary address | "123, Galle Road" |
| address_line_2 | String | No | Additional info | "Near Bus Stand" |
| city | String | Yes | City name | "Colombo" |
| district | String | Yes | District | "Colombo" |
| province | String | Yes | Province | "Western" |
| postal_code | String | Yes | 5 digits | "00100" |
| phone | String | Yes | +94 format | "+94 77 123 4567" |
| email | String | No | Email address | "user@email.com" |

### JSON Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Structured data storage |
| blank | True | Optional until set |
| null | True | Database nullable |
| default | dict | Empty dictionary default |
| verbose_name | Sender Address | User-friendly name |

### Sri Lankan Districts and Provinces

| Province | Districts | Major Cities |
|----------|-----------|--------------|
| Western | Colombo, Gampaha, Kalutara | Colombo, Gampaha, Kalutara |
| Central | Kandy, Matale, Nuwara Eliya | Kandy, Matale, Nuwara Eliya |
| Southern | Galle, Matara, Hambantota | Galle, Matara, Hambantota |
| Northern | Jaffna, Kilinochchi, Mannar | Jaffna, Vavuniya, Mannar |
| Eastern | Trincomalee, Batticaloa, Ampara | Trincomalee, Batticaloa |

### Address Validation Rules

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| phone | Matches +94 XX XXX XXXX | Invalid Sri Lankan phone format |
| postal_code | 5 digits | Postal code must be 5 digits |
| email | Valid email format | Invalid email address |
| name | Non-empty string | Sender name is required |

### Expected Outcome
- Structured sender address storage in JSON format
- Support for complete Sri Lankan address standards
- Validation for phone numbers and postal codes
- Flexible structure for additional address fields

### Verification Checklist
- [ ] sender_address field added as JSONField
- [ ] JSON schema designed for Sri Lankan addresses
- [ ] Phone number and postal code validation planned
- [ ] Default empty dictionary configured
- [ ] Address structure supports courier requirements

---

## Task 12: Create recipient_address Field

### Overview
Add the recipient_address JSON field to store structured recipient address information. This field mirrors the sender_address structure but focuses on delivery destination details, supporting Sri Lankan addressing standards and enabling accurate delivery routing by courier services.

### Dependencies
- Task 01: Create Waybill Model
- Task 11: Create sender_address Field (for consistency)

### Instructions

1. **Add recipient_address field to Waybill model**
   - Define JSONField with same structure as sender_address
   - Set blank=True and null=True for optional data
   - Add verbose_name="Recipient Address"
   - Include help_text describing delivery address

2. **Reuse sender address JSON schema**
   - Apply same JSON structure for consistency
   - Include all address components (name, lines, city, etc.)
   - Maintain phone and postal code validation
   - Support same Sri Lankan address format

3. **Plan delivery-specific features**
   - Add delivery_instructions for courier notes
   - Include contact_person for alternate recipient
   - Support landmark references for location
   - Plan for GPS coordinates (future enhancement)

4. **Configure recipient validation**
   - Apply same validation rules as sender
   - Ensure delivery address completeness
   - Validate recipient phone accessibility
   - Plan for address verification services

### Recipient Address JSON Structure

```json
{
  "name": "Recipient Name",
  "contact_person": "Alternate Contact (Optional)",
  "address_line_1": "456, Kandy Road",
  "address_line_2": "Near School",
  "city": "Gampaha",
  "district": "Gampaha", 
  "province": "Western",
  "postal_code": "11000",
  "phone": "+94 71 987 6543",
  "alternate_phone": "+94 11 234 5678",
  "email": "recipient@example.com",
  "delivery_instructions": "Ring bell twice, leave at gate if no answer",
  "landmark": "Opposite the main temple"
}
```

### Enhanced Recipient Fields

| Field | Purpose | Example |
|-------|---------|---------|
| contact_person | Alternate recipient | "Security guard" |
| alternate_phone | Backup contact | "+94 11 234 5678" |
| delivery_instructions | Special instructions | "Office hours: 9AM-5PM" |
| landmark | Location reference | "Next to Post Office" |

### Delivery Address Validation

| Validation | Rule | Purpose |
|------------|------|---------|
| Required Fields | name, address_line_1, city, phone | Complete delivery info |
| Phone Format | Sri Lankan mobile/landline | Contact accessibility |
| Postal Code | District-specific codes | Accurate routing |
| Address Lines | Non-empty strings | Clear location |

### Courier Delivery Requirements

| Courier | Special Requirements | Address Fields Used |
|---------|---------------------|-------------------|
| Koombiyo | GPS coordinates preferred | All standard fields |
| Domex | Landmark references | landmark, delivery_instructions |
| PromptX | Time-specific delivery | delivery_instructions |
| Royal Express | Contact verification | phone, alternate_phone |
| Trance Express | Building/floor details | address_line_2 |

### Address Matching and Validation

```
Address Validation Process:
├── Required Field Check
├── Phone Number Format Validation
├── Postal Code District Matching
├── City-District Consistency Check
├── Landmark Reference Verification
└── Delivery Instruction Parsing
```

### JSON Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | JSONField | Structured delivery data |
| blank | True | Optional until order processing |
| null | True | Database nullable |
| default | dict | Empty dictionary default |
| verbose_name | Recipient Address | User-friendly name |

### Expected Outcome
- Complete recipient address storage with delivery details
- Consistent JSON structure with sender address
- Enhanced delivery-specific fields for courier services
- Address validation supporting Sri Lankan formats

### Verification Checklist
- [ ] recipient_address field added as JSONField
- [ ] JSON structure matches sender_address consistency
- [ ] Delivery-specific fields added (instructions, landmarks)
- [ ] Address validation rules applied
- [ ] Field supports all courier delivery requirements

---

## Task 13: Create WaybillTemplate Model

### Overview
Create the WaybillTemplate model to support tenant-specific waybill customization. This model enables each tenant to define custom HTML templates for waybill PDF generation, allowing brand customization while maintaining required courier service data fields and compliance requirements.

### Dependencies
- Task 01: Create Waybill Model
- BaseModel mixins are available
- Django tenants configuration is active

### Instructions

1. **Create WaybillTemplate model class**
   - Navigate to `backend/apps/shipping/models/waybill.py`
   - Add WaybillTemplate class inheriting from BaseModel
   - Include proper class docstring explaining template purpose
   - Configure model metadata for admin interface

2. **Design template structure**
   - Support HTML templates with Jinja2 syntax
   - Enable CSS styling within templates
   - Plan for dynamic data injection (order, addresses, etc.)
   - Support multiple templates per tenant

3. **Configure model relationships**
   - Link to tenant through BaseModel inheritance
   - Plan for default template assignment
   - Support template versioning for updates
   - Enable template activation/deactivation

4. **Add template metadata**
   - Set verbose names for admin display
   - Configure model ordering by name
   - Add database constraints for uniqueness
   - Plan for template validation and testing

### WaybillTemplate Model Structure

```
WaybillTemplate Model:
├── Identification
│   ├── template_name (Task 14)
│   └── [UUID from BaseModel]
├── Content
│   ├── template_html (Task 15)
│   └── css_styles (future)
├── Configuration
│   ├── is_active (boolean)
│   ├── is_default (boolean)
│   └── courier_types (supported)
└── Metadata
    ├── created_at (BaseModel)
    ├── updated_at (BaseModel)
    └── tenant (BaseModel)
```

### Template Use Cases

| Use Case | Template Type | Customization |
|----------|---------------|---------------|
| Standard Waybill | Default template | Minimal branding |
| Branded Waybill | Custom template | Full brand styling |
| Courier-specific | Service template | Courier requirements |
| International | Export template | Customs information |

### Model Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Base Class | BaseModel | Tenant isolation |
| Table Name | waybill_templates | Database table |
| Ordering | ['template_name'] | Alphabetical listing |
| Verbose Name | Waybill Template | Admin display |

### Template Data Context

```
Template Context Variables:
├── waybill (Waybill instance)
│   ├── waybill_number
│   ├── status
│   ├── courier_type
│   └── generated_at
├── order (Order instance)
│   ├── order_number
│   ├── total_amount
│   └── order_date
├── sender_address (JSON data)
├── recipient_address (JSON data)
├── barcode_data (string)
├── qr_data (URL)
└── tenant (Tenant instance)
    ├── name
    ├── logo_url
    └── contact_info
```

### Template Validation Requirements

| Validation | Purpose | Implementation |
|------------|---------|----------------|
| HTML Syntax | Valid markup | HTML parser validation |
| Required Fields | Courier compliance | Template field checking |
| CSS Validation | Styling integrity | CSS syntax validation |
| Data Binding | Variable checking | Jinja2 template validation |

### Expected Outcome
- WaybillTemplate model for tenant customization
- Support for HTML/CSS template storage
- Foundation for PDF generation with custom styling
- Multi-template support per tenant

### Verification Checklist
- [ ] WaybillTemplate model class created
- [ ] Model inherits from BaseModel for tenant isolation
- [ ] Model metadata properly configured
- [ ] Template structure supports HTML/CSS content
- [ ] Model prepared for template fields addition

---

## Task 14: Create template_name Field

### Overview
Add the template_name field to the WaybillTemplate model for identifying and organizing custom templates. This field serves as the human-readable identifier for templates and ensures uniqueness within each tenant's template collection.

### Dependencies
- Task 13: Create WaybillTemplate Model

### Instructions

1. **Add template_name field to WaybillTemplate**
   - Define CharField with max_length=100 characters
   - Set blank=False and null=False for required field
   - Add db_index=True for template lookups
   - Set verbose_name="Template Name"

2. **Configure field uniqueness**
   - Ensure template names are unique per tenant
   - Use database constraints for uniqueness enforcement
   - Plan for case-insensitive template names
   - Support template name validation

3. **Add field validation**
   - Restrict special characters in template names
   - Support alphanumeric characters and spaces
   - Plan for template naming conventions
   - Add help_text for naming guidelines

4. **Plan template organization**
   - Support descriptive template names
   - Enable template categorization by name
   - Plan for default template identification
   - Support template name searching and filtering

### Template Naming Conventions

| Category | Naming Pattern | Examples |
|----------|----------------|----------|
| Default | "Default {Type}" | "Default Waybill", "Default Express" |
| Branded | "{Brand} {Type}" | "MyShop Standard", "Fashion Store Express" |
| Courier | "{Courier} {Type}" | "Koombiyo Standard", "Domex Express" |
| Special | "{Purpose} {Type}" | "International Waybill", "COD Template" |

### Template Name Examples

| Template Name | Use Case | Description |
|---------------|----------|-------------|
| "Standard Waybill" | General shipping | Basic waybill template |
| "Express Delivery" | Fast shipping | Priority delivery template |
| "Koombiyo Premium" | Courier-specific | Koombiyo branded template |
| "International Export" | Export orders | Customs documentation |
| "COD Collection" | Cash on delivery | Payment collection info |

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| max_length | 100 | Descriptive name support |
| blank | False | Required field |
| null | False | Database integrity |
| db_index | True | Template lookup performance |
| unique | False | Allow duplicate names across tenants |

### Template Name Validation

| Rule | Pattern | Error Message |
|------|---------|---------------|
| Required | Non-empty | Template name is required |
| Length | 1-100 characters | Name must be 1-100 characters |
| Characters | Alphanumeric + spaces | Invalid characters in name |
| Uniqueness | Per tenant | Template name already exists |

### Template Management Features

```
Template Organization:
├── Default Templates
│   ├── Standard Waybill
│   └── Express Waybill
├── Custom Templates
│   ├── Brand-specific designs
│   └── Courier-optimized layouts
├── Archive Templates
│   ├── Inactive templates
│   └── Version history
└── Template Categories
    ├── By courier service
    ├── By shipping type
    └── By document purpose
```

### Database Constraints

| Constraint Type | Definition | Purpose |
|----------------|------------|---------|
| Unique Together | (template_name, tenant) | Prevent duplicate names per tenant |
| Check Constraint | Name length > 0 | Ensure non-empty names |
| Index | template_name | Fast name-based queries |

### Expected Outcome
- Template identification field with descriptive names
- Per-tenant template name uniqueness
- Template organization and categorization support
- Efficient template lookup and management

### Verification Checklist
- [ ] template_name field added with proper length limit
- [ ] Field configured as required with validation
- [ ] Database index created for performance
- [ ] Template naming conventions documented
- [ ] Per-tenant uniqueness constraint planned

---

## Task 15: Create template_html Field

### Overview
Add the template_html field to store the complete HTML template content for waybill PDF generation. This field contains Jinja2-compatible HTML templates with embedded CSS styling and dynamic data placeholders for generating customized waybill documents.

### Dependencies
- Task 13: Create WaybillTemplate Model
- Task 14: Create template_name Field

### Instructions

1. **Add template_html field to WaybillTemplate**
   - Define TextField for unlimited HTML content storage
   - Set blank=True and null=True for optional content
   - Add verbose_name="Template HTML"
   - Include help_text explaining HTML/Jinja2 syntax

2. **Plan HTML template structure**
   - Support full HTML document structure
   - Include CSS styling within `<style>` tags
   - Use Jinja2 template syntax for dynamic content
   - Plan for print-optimized CSS layout

3. **Design template data binding**
   - Include placeholders for waybill data
   - Support order and address information
   - Add barcode and QR code placement
   - Plan for tenant branding integration

4. **Configure template validation**
   - Plan HTML syntax validation
   - Validate Jinja2 template syntax
   - Check required field presence
   - Support template testing and preview

### HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Waybill {{ waybill.waybill_number }}</title>
    <style>
        /* Print-optimized CSS */
        @page { size: A4; margin: 10mm; }
        .waybill-container { width: 100%; font-family: Arial; }
        .header { display: flex; justify-content: space-between; }
        .addresses { display: flex; margin: 20px 0; }
        .barcode-section { text-align: center; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="waybill-container">
        <!-- Header with logo and waybill number -->
        <div class="header">
            <img src="{{ tenant.logo_url }}" alt="{{ tenant.name }}">
            <h2>Waybill: {{ waybill.waybill_number }}</h2>
        </div>
        
        <!-- Address sections -->
        <div class="addresses">
            <div class="sender">
                <h3>From:</h3>
                <p>{{ waybill.sender_address.name }}</p>
                <p>{{ waybill.sender_address.address_line_1 }}</p>
            </div>
            <div class="recipient">
                <h3>To:</h3>
                <p>{{ waybill.recipient_address.name }}</p>
                <p>{{ waybill.recipient_address.address_line_1 }}</p>
            </div>
        </div>
        
        <!-- Tracking codes -->
        <div class="barcode-section">
            <img src="data:image/png;base64,{{ barcode_image }}" alt="Barcode">
            <img src="data:image/png;base64,{{ qr_image }}" alt="QR Code">
        </div>
    </div>
</body>
</html>
```

### Template Variable Categories

| Category | Variables | Usage |
|----------|-----------|-------|
| Waybill Data | waybill.*, barcode_data, qr_data | Core tracking info |
| Order Info | order.*, items.* | Order details |
| Addresses | sender_address.*, recipient_address.* | Contact information |
| Tenant Data | tenant.*, logo_url | Branding |
| Generated Data | barcode_image, qr_image | Rendered codes |

### CSS Styling Guidelines

| Section | CSS Focus | Purpose |
|---------|-----------|---------|
| Page Setup | @page, margins | Print optimization |
| Layout | Flexbox, grid | Responsive design |
| Typography | Font families, sizes | Readability |
| Branding | Colors, logos | Tenant identity |
| Barcodes | Positioning, sizing | Scan compatibility |

### Template Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | TextField | Unlimited HTML content |
| blank | True | Optional until designed |
| null | True | Database nullable |
| verbose_name | Template HTML | User-friendly name |
| help_text | HTML with Jinja2 syntax | Usage instructions |

### Print Optimization Requirements

```
Print CSS Considerations:
├── Page Size: A4 (210mm × 297mm)
├── Margins: 10mm all sides
├── Font Size: Minimum 10pt for legibility
├── Barcode Size: 40mm width minimum
├── QR Code Size: 20mm × 20mm minimum
├── Color: Black and white printing support
└── Resolution: 300 DPI for crisp output
```

### Template Testing Workflow

| Step | Action | Validation |
|------|--------|------------|
| 1 | HTML Syntax | Parse HTML structure |
| 2 | Jinja2 Syntax | Template compilation |
| 3 | CSS Validation | Style sheet parsing |
| 4 | Data Binding | Variable substitution |
| 5 | PDF Generation | Render to PDF |
| 6 | Print Test | Physical output quality |

### Expected Outcome
- Complete HTML template storage with CSS styling
- Jinja2 template syntax support for dynamic content
- Print-optimized layout for waybill generation
- Flexible template structure for tenant customization

### Verification Checklist
- [ ] template_html field added as TextField
- [ ] Field supports unlimited HTML content storage
- [ ] Template structure includes CSS and Jinja2 syntax
- [ ] Print optimization guidelines documented
- [ ] Template validation workflow planned

---

## Task 16: Create Waybill Migrations

### Overview
Generate Django database migrations for all waybill-related models including the Waybill model with all its fields and the WaybillTemplate model. This task creates the necessary database schema changes to implement the complete waybill system with proper indexes, constraints, and relationships.

### Dependencies
- All previous tasks (01-15) must be completed
- Waybill model with all fields defined
- WaybillTemplate model with all fields defined
- Django migration system configured

### Instructions

1. **Prepare migration environment**
   - Ensure all model changes are saved
   - Verify model imports and field definitions
   - Check for any syntax errors in model files
   - Confirm database connection is active

2. **Generate initial migration**
   - Run Django makemigrations command for shipping app
   - Review generated migration file content
   - Verify all model fields are included
   - Check foreign key relationships and constraints

3. **Review migration dependencies**
   - Ensure proper migration dependencies on related apps
   - Verify Order and Shipment model references
   - Check BaseModel migration dependencies
   - Confirm tenant schema compatibility

4. **Apply and test migration**
   - Run migration in development environment
   - Verify database tables are created correctly
   - Test model creation and field constraints
   - Validate indexes and foreign key relationships

### Migration File Structure

```python
# Generated migration file structure
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    dependencies = [
        ('orders', '0001_initial'),
        ('shipping', '0001_initial'),
    ]
    
    operations = [
        # Create Waybill model
        migrations.CreateModel(
            name='Waybill',
            fields=[
                # All waybill fields (Tasks 01-12)
            ],
            options={
                'verbose_name': 'Waybill',
                'verbose_name_plural': 'Waybills',
                'ordering': ['-created_at'],
            },
        ),
        # Create WaybillTemplate model  
        migrations.CreateModel(
            name='WaybillTemplate',
            fields=[
                # Template fields (Tasks 13-15)
            ],
        ),
        # Add indexes and constraints
        migrations.AddIndex(
            model_name='waybill',
            index=models.Index(['waybill_number'], name='waybill_number_idx'),
        ),
    ]
```

### Database Schema Verification

| Table | Expected Columns | Constraints |
|-------|------------------|-------------|
| waybills | id, waybill_number, order_id, shipment_id, courier_type, status, generated_at, pdf_file, barcode_data, qr_data, sender_address, recipient_address, created_at, updated_at | PK, FK, Unique, Indexes |
| waybill_templates | id, template_name, template_html, created_at, updated_at | PK, Indexes |

### Index Creation Plan

| Index Name | Table | Columns | Purpose |
|------------|-------|---------|---------|
| waybill_number_idx | waybills | waybill_number | Fast waybill lookup |
| courier_type_idx | waybills | courier_type | Filter by courier |
| status_idx | waybills | status | Status-based queries |
| generated_at_idx | waybills | generated_at | Time-based reports |
| template_name_idx | waybill_templates | template_name | Template lookup |

### Migration Commands

```bash
# Generate migrations
python manage.py makemigrations shipping

# Review migration file
python manage.py showmigrations shipping

# Apply migrations
python manage.py migrate shipping

# Verify database schema
python manage.py dbshell
\d waybills
\d waybill_templates
```

### Foreign Key Relationships

```
Database Relationship Diagram:
┌─────────────┐     ┌─────────────┐
│   Orders    │────▶│  Waybills   │
│             │     │             │
└─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Shipments  │
                    │             │
                    └─────────────┘

┌─────────────┐
│   Tenants   │────▶ [All Models]
│             │     
└─────────────┘     

┌─────────────┐     ┌─────────────┐
│   Tenants   │────▶│ Waybill     │
│             │     │ Templates   │
└─────────────┘     └─────────────┘
```

### Migration Validation Checklist

| Validation | Check | Expected Result |
|------------|-------|----------------|
| Model Creation | Tables exist | waybills, waybill_templates |
| Field Types | Column types | Correct data types |
| Constraints | Unique, FK | Proper constraints |
| Indexes | Index creation | Performance indexes |
| Relationships | FK references | Valid relationships |

### Expected Migration Output

```
Operations to perform:
  Apply all migrations: shipping
Running migrations:
  Applying shipping.0002_waybill_waybilltemplate... OK

Migration Summary:
✓ Created waybills table with 12 fields
✓ Created waybill_templates table with 3 fields  
✓ Added 5 database indexes
✓ Created 2 foreign key constraints
✓ Applied tenant isolation constraints
```

### Post-Migration Verification

| Test | Command | Expected Result |
|------|---------|-----------------|
| Table Creation | `\dt` in psql | Both tables listed |
| Field Structure | `\d waybills` | All fields present |
| Constraints | `\d waybills` | FK and unique constraints |
| Indexes | `\di` | All indexes created |
| Model Import | Python shell | Models import successfully |

### Expected Outcome
- Complete database schema for waybill system
- All model fields properly migrated to database
- Indexes and constraints correctly applied
- Foreign key relationships established

### Verification Checklist
- [ ] Migration files generated without errors
- [ ] All model fields included in migration
- [ ] Database tables created successfully
- [ ] Indexes and constraints applied correctly
- [ ] Foreign key relationships working properly
- [ ] Models can be imported and used in Django shell

---

## Summary

This document completed the Waybill model implementation by adding tracking data fields, JSON address storage, creating the WaybillTemplate model for tenant customization, and generating the necessary database migrations. The waybill system now supports complete Sri Lankan shipping requirements with custom template capabilities.

### Completed Tasks
9. ✓ Added barcode_data field for tracking integration
10. ✓ Created qr_data field for mobile tracking URLs
11. ✓ Implemented sender_address JSON field with Sri Lankan format
12. ✓ Added recipient_address field with delivery-specific features
13. ✓ Created WaybillTemplate model for tenant customization
14. ✓ Added template_name field for template identification
15. ✓ Implemented template_html field for HTML/CSS storage
16. ✓ Generated complete database migrations for all models

### Final Deliverables
The waybill models are now fully implemented with:
- Complete Waybill model with all required fields for Sri Lankan couriers
- JSON address fields supporting local addressing standards
- Barcode and QR code data for modern tracking capabilities
- WaybillTemplate model enabling tenant-specific customization
- Database schema with proper indexes and constraints
- Foundation for PDF generation and courier service integration

### Next Group
Proceed to [Group-B_PDF-Generation-Engine](../Group-B_PDF-Generation-Engine/) to implement the PDF generation system that will use these models to create physical waybill documents.