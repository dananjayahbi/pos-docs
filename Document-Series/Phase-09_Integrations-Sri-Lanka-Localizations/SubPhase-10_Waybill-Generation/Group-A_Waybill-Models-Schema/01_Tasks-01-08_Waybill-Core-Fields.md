# Tasks 01-08: Waybill Core Fields

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** A - Waybill Models & Schema  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Address-Template-Migration.md](02_Tasks-09-16_Address-Template-Migration.md)

---

## Document Overview

This document covers the creation of the core Waybill model and its essential fields including unique waybill numbers, foreign key relationships to orders and shipments, courier type enumeration, status tracking, timestamp management, and PDF file storage. These foundational elements provide the core structure for Sri Lankan waybill generation with proper tracking and file management capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Waybill Model | Medium | 30 min |
| 02 | Create waybill_number Field | Low | 10 min |
| 03 | Create order FK | Low | 10 min |
| 04 | Create shipment FK | Low | 10 min |
| 05 | Create courier_type Field | Low | 15 min |
| 06 | Create status Field | Low | 15 min |
| 07 | Create generated_at Field | Low | 10 min |
| 08 | Create pdf_file Field | Low | 15 min |

---

## Task 01: Create Waybill Model

### Overview
Create the foundational Waybill model in the shipping app. This model serves as the primary entity for storing waybill information for Sri Lankan courier services. The model will inherit from BaseModel to include tenant isolation, timestamps, and soft delete functionality required for the multi-tenant architecture.

### Dependencies
- SubPhase-09: Shipping & Fulfillment System must be complete
- BaseModel mixins are implemented
- Django tenants configuration is active
- Shipping app is created and registered

### Instructions

1. **Navigate to shipping models directory**
   - Go to `backend/apps/shipping/models/` directory
   - Create new file named `waybill.py`
   - This separates waybill models from other shipping models

2. **Import required dependencies**
   - Import Django model classes and field types
   - Import BaseModel from core mixins
   - Import related models (Order, Shipment)
   - Import necessary validators and choices

3. **Define Waybill model class**
   - Create class named `Waybill` inheriting from BaseModel
   - Add proper class docstring describing purpose
   - Include table name in Meta class for database consistency

4. **Configure model metadata**
   - Set verbose name to "Waybill"
   - Set verbose name plural to "Waybills"
   - Configure ordering by creation date (newest first)
   - Add database table indexes for performance

5. **Prepare for field additions**
   - Structure class to accept multiple field additions
   - Plan field groupings (identification, relationships, tracking)
   - Ensure proper formatting for subsequent tasks

### Model Structure Planning

```
Waybill Model Architecture:
├── Identification Fields
│   ├── waybill_number (Task 02)
│   └── [Auto ID from BaseModel]
├── Relationship Fields  
│   ├── order (Task 03)
│   └── shipment (Task 04)
├── Configuration Fields
│   ├── courier_type (Task 05)
│   └── status (Task 06)
├── Tracking Fields
│   ├── generated_at (Task 07)
│   └── pdf_file (Task 08)
└── Address Fields (Document 02)
    ├── sender_address
    └── recipient_address
```

### BaseModel Inheritance Benefits

| Feature | Benefit |
|---------|---------|
| Tenant Isolation | Automatic schema filtering |
| Created/Updated | Timestamp tracking |
| Soft Delete | Data recovery capability |
| UUID Primary Key | Distributed system support |

### Database Considerations

| Aspect | Implementation |
|--------|----------------|
| Table Name | waybills |
| Primary Key | UUID (from BaseModel) |
| Indexing | waybill_number, order_id |
| Constraints | Unique waybill_number per tenant |

### Expected Outcome
- Waybill model class created with proper inheritance
- Model configured for multi-tenant environment
- Foundation ready for field additions
- Proper database metadata configuration

### Verification Checklist
- [ ] `backend/apps/shipping/models/waybill.py` file created
- [ ] Waybill class inherits from BaseModel
- [ ] Model includes proper docstring and Meta class
- [ ] File imports are organized and complete
- [ ] Model is structured for field additions

---

## Task 02: Create waybill_number Field

### Overview
Add the waybill_number field to the Waybill model. This field serves as the unique identifier for each waybill document and must be unique across the tenant to prevent duplicate waybill numbers. The field supports various Sri Lankan courier service numbering formats.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Add waybill_number field to Waybill model**
   - Define CharField with maximum length of 50 characters
   - Set unique=True to ensure no duplicate waybill numbers
   - Add db_index=True for query performance optimization
   - Include help_text for field documentation

2. **Configure field validation**
   - Add blank=False to make field required
   - Set null=False for database integrity
   - Consider regex validator for format consistency
   - Plan for auto-generation in business logic layer

3. **Add field metadata**
   - Set verbose_name to "Waybill Number"
   - Include descriptive help text
   - Document expected format patterns
   - Plan for Sri Lankan courier formats

4. **Update model's string representation**
   - Modify `__str__` method to return waybill_number
   - Ensure readable representation for admin interface
   - Include waybill number in model displays

### Waybill Number Formats

| Courier Service | Format Pattern | Example |
|----------------|----------------|---------|
| Koombiyo | KB + 8 digits | KB12345678 |
| Domex | DX + timestamp | DX2026013112345 |
| PromptX | PX + alphanumeric | PX26A12B34 |
| Royal Express | RE + 10 digits | RE1234567890 |
| Trance Express | TE + date + seq | TE26011501234 |

### Field Configuration Details

| Property | Value | Purpose |
|----------|-------|---------|
| max_length | 50 | Support all courier formats |
| unique | True | Prevent duplicates |
| db_index | True | Fast lookups |
| blank | False | Required field |
| null | False | Database integrity |

### Database Schema Impact

```
Column: waybill_number
├── Type: VARCHAR(50)
├── Constraints: NOT NULL, UNIQUE
├── Index: btree (waybill_number)
└── Purpose: Primary waybill identifier
```

### Expected Outcome
- Unique waybill_number field added to model
- Field supports all major Sri Lankan courier formats
- Database constraints prevent duplicate numbers
- Optimized for search and lookup operations

### Verification Checklist
- [ ] waybill_number field added with correct configuration
- [ ] Field is unique and indexed
- [ ] Field length supports all courier formats
- [ ] Model string representation updated
- [ ] Field validation properly configured

---

## Task 03: Create order FK

### Overview
Add the order foreign key field to establish the relationship between waybills and orders. This relationship links waybill generation to specific customer orders and enables tracking of which orders have waybills generated. The relationship uses PROTECT to prevent accidental order deletion when waybills exist.

### Dependencies
- Task 01: Create Waybill Model
- Order model exists in orders app

### Instructions

1. **Import Order model**
   - Add import statement for Order model
   - Use proper app path: `from apps.orders.models import Order`
   - Ensure circular import avoidance
   - Check Order model availability

2. **Add order field to Waybill model**
   - Define ForeignKey to Order model
   - Set on_delete=models.PROTECT for data integrity
   - Add related_name='waybills' for reverse lookups
   - Include verbose_name="Order"

3. **Configure relationship properties**
   - Set db_index=True for query performance
   - Add help_text explaining relationship
   - Consider blank/null settings based on business rules
   - Plan for order-to-waybill queries

4. **Update model relationships**
   - Ensure proper reverse relationship naming
   - Plan for multiple waybills per order scenario
   - Consider order status implications
   - Document relationship cardinality

### Order-Waybill Relationship

```
Order (1) ──────── (0..*) Waybill
     │                      │
     │                      │
     └── PROTECT           └── Tracks shipment for order
```

### Foreign Key Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| to | Order | Target model |
| on_delete | PROTECT | Prevent order deletion |
| related_name | waybills | Reverse relationship |
| db_index | True | Query optimization |
| verbose_name | Order | Admin display |

### Relationship Benefits

| Benefit | Description |
|---------|-------------|
| Data Integrity | PROTECT prevents orphaned waybills |
| Query Efficiency | Index enables fast order lookups |
| Reverse Access | Orders can access their waybills |
| Admin Integration | Proper display names |

### Business Logic Implications

| Scenario | Behavior |
|----------|----------|
| Order Deletion | Blocked if waybills exist |
| Waybill Creation | Requires valid order |
| Order Queries | Can fetch related waybills |
| Data Cleanup | Manual waybill cleanup needed |

### Expected Outcome
- Foreign key relationship established to Order model
- Data integrity protection via PROTECT constraint
- Efficient querying with database index
- Proper reverse relationship access

### Verification Checklist
- [ ] Order model imported correctly
- [ ] order field configured with ForeignKey
- [ ] on_delete=PROTECT set for data protection
- [ ] related_name='waybills' configured
- [ ] Database index enabled for performance

---

## Task 04: Create shipment FK

### Overview
Add the shipment foreign key field to link waybills with specific shipments. This relationship enables tracking of waybill generation for different shipment methods and allows nullable relationships since waybills might be created before shipment assignment. Uses CASCADE to auto-cleanup waybills when shipments are removed.

### Dependencies
- Task 01: Create Waybill Model
- Shipment model exists in shipping app

### Instructions

1. **Import Shipment model**
   - Add import for Shipment model if in separate file
   - Use relative import if in same app
   - Ensure model availability and avoid circular imports
   - Check Shipment model definition

2. **Add shipment field to Waybill model**
   - Define ForeignKey to Shipment model
   - Set on_delete=models.CASCADE for cleanup
   - Add related_name='waybills' for reverse access
   - Set blank=True and null=True for optional relationship

3. **Configure optional relationship**
   - Allow null values for pre-shipment waybills
   - Add appropriate help_text
   - Set verbose_name="Shipment"
   - Include db_index=True for performance

4. **Plan relationship workflow**
   - Waybill creation before shipment assignment
   - Shipment-based waybill queries
   - Cleanup behavior on shipment deletion
   - Multiple waybills per shipment support

### Shipment-Waybill Relationship

```
Shipment (1) ──────── (0..*) Waybill
       │                      │
       │                      │
       └── CASCADE           └── Optional until shipped
```

### Field Configuration Details

| Property | Value | Purpose |
|----------|-------|---------|
| to | Shipment | Target model |
| on_delete | CASCADE | Auto-cleanup waybills |
| related_name | waybills | Reverse relationship |
| null | True | Optional relationship |
| blank | True | Optional in forms |
| db_index | True | Query performance |

### Relationship Workflow

| Stage | Waybill State | Shipment State |
|-------|---------------|----------------|
| Pre-generation | order set, shipment null | Not created |
| Generated | order set, shipment null | Pending assignment |
| Assigned | order set, shipment set | Ready for shipping |
| Shipped | order set, shipment set | In transit |

### Null Relationship Scenarios

| Scenario | shipment Value | Use Case |
|----------|---------------|----------|
| Pre-assignment | NULL | Waybill ready, awaiting shipment |
| Bulk Generation | NULL | Multiple waybills before routing |
| Direct Ship | Shipment ID | Immediate shipment assignment |
| Re-assignment | Updated ID | Shipment method changed |

### Expected Outcome
- Optional foreign key relationship to Shipment model
- CASCADE deletion for automatic cleanup
- Support for pre-shipment waybill generation
- Efficient querying with proper indexing

### Verification Checklist
- [ ] Shipment model imported or referenced correctly
- [ ] shipment field configured as optional ForeignKey
- [ ] on_delete=CASCADE set for auto-cleanup
- [ ] null=True and blank=True configured
- [ ] related_name='waybills' set for reverse access

---

## Task 05: Create courier_type Field

### Overview
Add the courier_type field to specify which Sri Lankan courier service will handle the shipment. This enumeration field restricts values to supported courier services and enables proper waybill formatting and integration with each courier's systems and requirements.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Define courier type choices**
   - Create COURIER_CHOICES tuple with Sri Lankan services
   - Include major courier services: Koombiyo, Domex, PromptX
   - Add Royal Express and Trance Express options
   - Use uppercase constants for choice values

2. **Add courier_type field**
   - Define CharField with choices parameter
   - Set max_length=20 to accommodate service names
   - Add db_index=True for filtering and queries
   - Set verbose_name="Courier Service"

3. **Configure field validation**
   - Use choices to restrict valid values
   - Set blank=False to make field required
   - Add help_text describing available services
   - Plan for future courier service additions

4. **Plan integration implications**
   - Each courier has different API requirements
   - Different waybill number formats per courier
   - Varying tracking and status update methods
   - Service-specific template requirements

### Sri Lankan Courier Services

| Service | Code | Coverage | Features |
|---------|------|----------|----------|
| Koombiyo | koombiyo | Island-wide | Express, Standard |
| Domex | domex | Major cities | COD, Express |
| PromptX | promptx | Colombo region | Same-day delivery |
| Royal Express | royal_express | National | International shipping |
| Trance Express | trance_express | Western province | E-commerce focus |

### Courier Choice Configuration

```
COURIER_CHOICES = [
    ('koombiyo', 'Koombiyo'),
    ('domex', 'Domex'),
    ('promptx', 'PromptX'),
    ('royal_express', 'Royal Express'),
    ('trance_express', 'Trance Express'),
]
```

### Field Properties

| Property | Value | Purpose |
|----------|-------|---------|
| max_length | 20 | Accommodate service names |
| choices | COURIER_CHOICES | Restrict valid values |
| db_index | True | Enable filtering |
| blank | False | Required selection |
| verbose_name | Courier Service | User-friendly name |

### Integration Considerations

| Courier | API Type | Waybill Format | Special Requirements |
|---------|----------|----------------|---------------------|
| Koombiyo | REST API | KB + 8 digits | Authentication token |
| Domex | SOAP/XML | DX + timestamp | Customer code |
| PromptX | REST API | PX + alphanumeric | Zone validation |
| Royal Express | Custom | RE + 10 digits | Branch code |
| Trance Express | REST API | TE + date + seq | Service level |

### Expected Outcome
- Enumerated field restricting courier service selection
- Support for all major Sri Lankan courier services
- Database indexing for efficient filtering
- Foundation for service-specific integrations

### Verification Checklist
- [ ] COURIER_CHOICES tuple defined with all services
- [ ] courier_type field added with choices restriction
- [ ] Field is required and properly indexed
- [ ] Verbose names configured for user interface
- [ ] Field supports future courier additions

---

## Task 06: Create status Field

### Overview
Add the status field to track waybill generation and processing stages. This field enables workflow management from initial creation through final shipment, providing visibility into waybill lifecycle and supporting automated processing triggers for each status transition.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Define status choices**
   - Create STATUS_CHOICES with waybill lifecycle stages
   - Include PENDING for initial creation
   - Add GENERATED for completed PDF creation
   - Include PRINTED for physical label printing
   - Add SHIPPED for dispatched packages

2. **Add status field to model**
   - Define CharField with choices parameter
   - Set max_length=20 for status names
   - Set default='PENDING' for new waybills
   - Add db_index=True for status filtering

3. **Configure field properties**
   - Use choices to restrict valid status values
   - Set verbose_name="Status" for admin display
   - Add help_text describing status meanings
   - Plan for status transition validation

4. **Plan workflow automation**
   - PENDING → GENERATED: PDF creation complete
   - GENERATED → PRINTED: Label physically printed
   - PRINTED → SHIPPED: Package dispatched
   - Consider status change triggers and notifications

### Waybill Status Workflow

```
PENDING
   │
   ▼ (PDF Generated)
GENERATED
   │
   ▼ (Label Printed)
PRINTED
   │
   ▼ (Package Dispatched)
SHIPPED
```

### Status Definitions

| Status | Description | Trigger |
|--------|-------------|---------|
| PENDING | Waybill created, PDF not generated | Initial creation |
| GENERATED | PDF file created and stored | PDF generation complete |
| PRINTED | Physical label printed | Label printing confirmed |
| SHIPPED | Package dispatched to courier | Shipment confirmation |

### Status Choice Configuration

```
STATUS_CHOICES = [
    ('PENDING', 'Pending Generation'),
    ('GENERATED', 'PDF Generated'),
    ('PRINTED', 'Label Printed'),
    ('SHIPPED', 'Package Shipped'),
]
```

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| max_length | 20 | Accommodate status names |
| choices | STATUS_CHOICES | Restrict valid values |
| default | PENDING | Initial status |
| db_index | True | Enable status filtering |
| verbose_name | Status | Admin display |

### Business Process Integration

| Status | Automated Actions | User Actions |
|--------|------------------|--------------|
| PENDING | Queue for PDF generation | Manual generation trigger |
| GENERATED | File storage confirmation | Download PDF, print label |
| PRINTED | Update courier system | Confirm printing |
| SHIPPED | Tracking activation | Package handover |

### Expected Outcome
- Status field with defined workflow stages
- Default status for new waybill creation
- Database optimization for status-based queries
- Foundation for automated workflow processing

### Verification Checklist
- [ ] STATUS_CHOICES defined with all lifecycle stages
- [ ] status field configured with choices and default
- [ ] Field indexed for efficient status filtering
- [ ] Status workflow logically ordered
- [ ] Field supports workflow automation

---

## Task 07: Create generated_at Field

### Overview
Add the generated_at timestamp field to record when waybill PDF generation was completed. This field differs from the created_at timestamp (inherited from BaseModel) by specifically tracking the PDF generation event rather than initial record creation, enabling performance monitoring and SLA tracking.

### Dependencies
- Task 01: Create Waybill Model

### Instructions

1. **Add generated_at field to model**
   - Define DateTimeField for timestamp storage
   - Set null=True and blank=True for optional timestamps
   - Add db_index=True for time-based queries
   - Set verbose_name="Generated At"

2. **Configure timezone handling**
   - Ensure field stores timezone-aware datetimes
   - Use Asia/Colombo timezone for Sri Lankan context
   - Plan for UTC storage with local display
   - Consider daylight saving implications

3. **Add field documentation**
   - Include help_text explaining field purpose
   - Document difference from created_at timestamp
   - Explain null value meaning (not yet generated)
   - Plan for automated timestamp updates

4. **Plan timestamp automation**
   - Update field when PDF generation completes
   - Coordinate with status field changes
   - Consider timezone conversion for reports
   - Plan for generation time analytics

### Timestamp Field Comparison

| Field | Purpose | Set When | Nullable |
|-------|---------|----------|----------|
| created_at | Record creation | Model save | No |
| updated_at | Record modification | Any update | No |
| generated_at | PDF generation | Status → GENERATED | Yes |

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DateTimeField | Timestamp storage |
| null | True | Optional until generated |
| blank | True | Optional in forms |
| db_index | True | Time-based queries |
| verbose_name | Generated At | User-friendly name |

### Timezone Considerations

```
Storage: UTC (Database)
    │
    ▼ (Conversion)
Display: Asia/Colombo (User Interface)
    │
    ▼ (Business Logic)
Reports: Local business hours
```

### Use Cases for generated_at

| Use Case | Query Pattern |
|----------|---------------|
| SLA Monitoring | Time between created_at and generated_at |
| Daily Reports | Count of generated_at per day |
| Performance Metrics | Average generation time |
| Audit Trail | When was waybill actually created |

### Business Value

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Generation Speed | generated_at - created_at | Performance monitoring |
| Daily Volume | COUNT by generated_at date | Capacity planning |
| Peak Hours | generated_at time distribution | Resource allocation |
| SLA Compliance | % within target time | Service quality |

### Expected Outcome
- Timestamp field for PDF generation tracking
- Separate from record creation timestamps
- Timezone-aware datetime storage
- Foundation for performance analytics

### Verification Checklist
- [ ] generated_at field added as DateTimeField
- [ ] Field configured as nullable and optional
- [ ] Database index created for time queries
- [ ] Timezone handling properly configured
- [ ] Field documentation includes purpose

---

## Task 08: Create pdf_file Field

### Overview
Add the pdf_file field to store generated waybill PDF documents. This FileField enables secure file storage in S3 with tenant-specific organization and proper file naming conventions. The field supports Sri Lankan waybill requirements while maintaining multi-tenant data isolation.

### Dependencies
- Task 01: Create Waybill Model
- File storage configuration (S3) is set up
- Media handling middleware is configured

### Instructions

1. **Add pdf_file field to model**
   - Define FileField for PDF document storage
   - Set upload_to with dynamic path including tenant
   - Set null=True and blank=True for pre-generation state
   - Add verbose_name="PDF File"

2. **Configure file upload path**
   - Use pattern: `waybills/{tenant_schema}/{order_id}/`
   - Include waybill number in filename
   - Add timestamp for uniqueness
   - Plan for file organization and cleanup

3. **Set file storage properties**
   - Configure S3 storage backend
   - Set proper file permissions
   - Plan for secure URL generation
   - Consider file expiration policies

4. **Add file validation**
   - Restrict file types to PDF only
   - Set maximum file size limits
   - Plan for file integrity checks
   - Consider virus scanning integration

### File Storage Architecture

```
S3 Bucket: lcc-waybills
├── tenant_001/
│   ├── order_123/
│   │   ├── waybill_KB12345678_20260131_143022.pdf
│   │   └── waybill_KB12345678_20260131_143025.pdf (retry)
│   └── order_124/
└── tenant_002/
    └── order_456/
```

### Upload Path Configuration

| Component | Value | Purpose |
|-----------|-------|---------|
| Base Path | waybills/ | File category |
| Tenant | {tenant_schema}/ | Multi-tenant isolation |
| Order | {order_id}/ | Order-based organization |
| Filename | waybill_{number}_{timestamp}.pdf | Unique identification |

### File Field Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | FileField | File storage |
| upload_to | Dynamic function | Tenant-specific paths |
| null | True | Optional until generated |
| blank | True | Optional in forms |
| storage | S3 backend | Cloud storage |

### File Naming Convention

```
Filename Pattern:
waybill_{waybill_number}_{timestamp}.pdf

Examples:
- waybill_KB12345678_20260131_143022.pdf
- waybill_DX2026013112345_20260131_143045.pdf
- waybill_PX26A12B34_20260131_143108.pdf
```

### File Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Access Control | Tenant-based permissions |
| URL Security | Signed URLs with expiration |
| File Integrity | Checksum validation |
| Backup | S3 versioning enabled |

### Storage Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Bucket | lcc-waybills | Dedicated waybill storage |
| Region | Asia-Pacific | Reduced latency |
| Encryption | AES-256 | Data security |
| Versioning | Enabled | File history |

### Expected Outcome
- PDF file storage with tenant isolation
- Organized file structure by tenant and order
- Secure S3 storage with proper permissions
- Unique file naming with timestamp tracking

### Verification Checklist
- [ ] pdf_file field added as FileField
- [ ] Dynamic upload path configured with tenant isolation
- [ ] File storage backend properly configured
- [ ] File naming convention implemented
- [ ] Security and permissions properly set

---

## Summary

This document established the core Waybill model structure with essential fields for Sri Lankan waybill generation. The model includes unique identification, order relationships, courier service selection, status tracking, timestamp management, and secure file storage capabilities.

### Completed Tasks
1. ✓ Created Waybill model with BaseModel inheritance
2. ✓ Added waybill_number field with uniqueness constraints
3. ✓ Created order foreign key with data protection
4. ✓ Added optional shipment foreign key relationship
5. ✓ Implemented courier_type enumeration for Sri Lankan services
6. ✓ Added status field for workflow management
7. ✓ Created generated_at timestamp for PDF tracking
8. ✓ Implemented pdf_file storage with tenant isolation

### Next Steps
Proceed to [02_Tasks-09-16_Address-Template-Migration.md](02_Tasks-09-16_Address-Template-Migration.md) to add address fields, create the WaybillTemplate model, and generate database migrations for all waybill-related models.