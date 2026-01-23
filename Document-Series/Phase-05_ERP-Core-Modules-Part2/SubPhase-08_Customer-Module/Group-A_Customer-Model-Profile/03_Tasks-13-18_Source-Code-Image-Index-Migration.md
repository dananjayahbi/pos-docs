# Tasks 13-18: Source, Code Generator, Image, Indexes, and Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** A - Customer Model & Profile  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md](02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md)

---

## Document Overview

This document completes the Customer model with source tracking, automated customer code generation, profile image upload, database performance optimization through indexes and constraints, and initial database migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Customer Source Field | Low | 15 min |
| 14 | Create Customer Code Generator | Medium | 25 min |
| 15 | Add Customer Profile Image | Medium | 20 min |
| 16 | Create Customer Model Indexes | Medium | 20 min |
| 17 | Create Customer Model Constraints | Medium | 20 min |
| 18 | Run Initial Customer Migrations | Low | 15 min |

---

## Task 13: Add Customer Source Field

### Overview
Add a source field to track how customers were created in the system. This helps analyze customer acquisition channels and ensures proper data attribution for manual entries, POS transactions, webstore registrations, and bulk imports.

### Dependencies
- Task 12: Add Customer Notes Fields
- constants.py file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/customers/constants.py`
   - Add customer source constants section

2. **Define CUSTOMER_SOURCE_MANUAL constant**
   - Value: 'manual'
   - Purpose: Manually created by staff
   - Most common for B2B customers

3. **Define CUSTOMER_SOURCE_POS constant**
   - Value: 'pos'
   - Purpose: Created during POS transaction
   - Quick customer registration

4. **Define CUSTOMER_SOURCE_WEBSTORE constant**
   - Value: 'webstore'
   - Purpose: Registered via online store
   - Self-service registration

5. **Define CUSTOMER_SOURCE_IMPORT constant**
   - Value: 'import'
   - Purpose: Imported from CSV or external system
   - Bulk data migration

6. **Define CUSTOMER_SOURCE_CHOICES tuple**
   - Create tuple of source choices
   - Follow Django's choices pattern

7. **Open customer.py model file**
   - Navigate to `apps/customers/models/customer.py`
   - Locate Customer model class

8. **Add source field**
   - CharField with CUSTOMER_SOURCE_CHOICES
   - Default to CUSTOMER_SOURCE_MANUAL
   - Required field

9. **Add created_by field**
   - ForeignKey to User model
   - Optional (blank=True, null=True)
   - Track who created the customer
   - Set on_delete=SET_NULL

10. **Update model docstring**
    - Document source tracking purpose

### Customer Source Constants

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| CUSTOMER_SOURCE_MANUAL | 'manual' | Manual Entry | Staff creates customer manually |
| CUSTOMER_SOURCE_POS | 'pos' | POS | Created during POS transaction |
| CUSTOMER_SOURCE_WEBSTORE | 'webstore' | Webstore | Customer self-registration |
| CUSTOMER_SOURCE_IMPORT | 'import' | Import | CSV or system import |

### Source Field Structure

```
┌─────────────────────────────────────────────────┐
│          Customer Source Tracking               │
├─────────────────────────────────────────────────┤
│  • source (CharField with choices)              │
│    Track creation channel                       │
│                                                 │
│  • created_by (ForeignKey to User)              │
│    Track staff member who created               │
└─────────────────────────────────────────────────┘
```

### Source Usage Scenarios

#### Manual Entry (MANUAL)
```
Manual Customer Creation Workflow
══════════════════════════════════

Use Case:
  • B2B customer onboarding
  • Walk-in customer pre-registration
  • Phone order customer setup

Process:
  1. Staff opens customer form
  2. Enters customer details
  3. source = CUSTOMER_SOURCE_MANUAL
  4. created_by = current_user
  5. Save customer

Fields Typically Filled:
  • Complete contact information
  • Tax details (for business)
  • Credit limit
  • Payment terms
```

#### POS Creation (POS)
```
POS Quick Registration Workflow
════════════════════════════════

Use Case:
  • First-time customer at checkout
  • Quick customer lookup failed
  • Minimal information available

Process:
  1. Cashier can't find customer
  2. Clicks "New Customer" in POS
  3. Enters name and phone
  4. source = CUSTOMER_SOURCE_POS
  5. created_by = cashier
  6. Continue with sale

Fields Typically Filled:
  • Name or company name
  • Phone number
  • Minimal details
```

#### Webstore Registration (WEBSTORE)
```
Webstore Self-Registration Workflow
════════════════════════════════════

Use Case:
  • Online customer account creation
  • Self-service registration
  • Email verification

Process:
  1. Customer fills registration form
  2. Submits with email/password
  3. source = CUSTOMER_SOURCE_WEBSTORE
  4. created_by = null (self-registered)
  5. Email verification sent

Fields Typically Filled:
  • Email (required)
  • Name
  • Password
  • Basic contact info
```

#### Import Creation (IMPORT)
```
Bulk Import Workflow
════════════════════

Use Case:
  • System migration
  • Data from legacy system
  • Bulk customer upload

Process:
  1. Prepare CSV file
  2. Upload via import interface
  3. source = CUSTOMER_SOURCE_IMPORT
  4. created_by = importing_user
  5. Batch creation

Fields Typically Filled:
  • Variable based on import file
  • All available data from source
```

### Source-Based Analytics

| Report | Query | Purpose |
|--------|-------|---------|
| Acquisition Channels | Count by source | Identify main customer sources |
| POS Efficiency | WHERE source = 'pos' | Quick registration usage |
| Webstore Growth | WHERE source = 'webstore' | Online customer acquisition |
| Import Tracking | WHERE source = 'import' | Migration completion |

### Source Statistics Dashboard

```
Customer Acquisition Overview
══════════════════════════════

Total Customers: 10,000

By Source:
  ├── Manual: 4,500 (45%)
  ├── POS: 3,200 (32%)
  ├── Webstore: 2,100 (21%)
  └── Import: 200 (2%)

Growth Trend:
  • Last 30 days:
    - Manual: 150 new
    - POS: 280 new
    - Webstore: 95 new
    - Import: 0
```

### Created By Tracking

```
Staff Performance Tracking
══════════════════════════

Use created_by field to:
  • Track which staff members create customers
  • Monitor data entry accuracy
  • Identify training needs
  • Audit customer creation

Example Query:
  SELECT created_by, COUNT(*) as customer_count
  FROM customers
  WHERE created_at >= '2026-01-01'
  GROUP BY created_by
  ORDER BY customer_count DESC
```

### Expected Outcome
- Customer acquisition channel tracking
- Source-based analytics capability
- Staff attribution for manual entries
- Import tracking for migrations
- Data quality auditing

### Verification Checklist
- [ ] CUSTOMER_SOURCE_MANUAL constant defined
- [ ] CUSTOMER_SOURCE_POS constant defined
- [ ] CUSTOMER_SOURCE_WEBSTORE constant defined
- [ ] CUSTOMER_SOURCE_IMPORT constant defined
- [ ] CUSTOMER_SOURCE_CHOICES tuple created
- [ ] source field added to Customer model
- [ ] created_by field added (FK to User)
- [ ] Default source set to MANUAL
- [ ] Model docstring updated

---

## Task 14: Create Customer Code Generator

### Overview
Create a service to automatically generate unique customer codes in the format CUST-{sequence}. This generator ensures sequential numbering per tenant, handles concurrency, and provides a consistent customer identification system.

### Dependencies
- Task 13: Add Customer Source Field
- Customer model exists with customer_code field

### Instructions

1. **Create code_generator.py service file**
   - Create file at `apps/customers/services/code_generator.py`
   - Import necessary modules

2. **Import required modules**
   - Import Django database transaction utilities
   - Import F expression for atomic operations
   - Import Customer model

3. **Define CustomerCodeGenerator class**
   - Create service class for code generation
   - Add class docstring

4. **Define PREFIX constant**
   - Set class constant PREFIX = "CUST"
   - Used as customer code prefix

5. **Define SEQUENCE_LENGTH constant**
   - Set class constant SEQUENCE_LENGTH = 5
   - Zero-padded sequence length

6. **Create generate method**
   - Accept tenant parameter
   - Generate unique customer code for tenant
   - Handle concurrent requests safely

7. **Implement sequence logic**
   - Query last customer code for tenant
   - Extract sequence number
   - Increment by 1
   - Handle first customer (sequence = 1)

8. **Format customer code**
   - Combine prefix and sequence
   - Zero-pad sequence to specified length
   - Return formatted code (e.g., "CUST-00001")

9. **Add uniqueness check**
   - Verify generated code is unique
   - Retry with next sequence if collision
   - Use database-level locking if needed

10. **Update services/__init__.py**
    - Import CustomerCodeGenerator
    - Add to __all__ list

11. **Integrate with Customer model save**
    - Override save method if needed
    - Auto-generate code on creation if not provided
    - Set customer_code before first save

### Code Generator Structure

```
┌─────────────────────────────────────────────────┐
│         CustomerCodeGenerator Service           │
├─────────────────────────────────────────────────┤
│ Constants:                                      │
│  • PREFIX = "CUST"                              │
│  • SEQUENCE_LENGTH = 5                          │
│                                                 │
│ Methods:                                        │
│  • generate(tenant) → str                       │
│    Generate unique customer code                │
│                                                 │
│  • _get_next_sequence(tenant) → int             │
│    Get next sequence number                     │
│                                                 │
│  • _format_code(sequence) → str                 │
│    Format code with prefix and padding          │
└─────────────────────────────────────────────────┘
```

### Customer Code Format

```
Customer Code Structure
═══════════════════════

Format: {PREFIX}-{SEQUENCE}

Components:
  • PREFIX: "CUST" (configurable)
  • SEPARATOR: "-"
  • SEQUENCE: Zero-padded to 5 digits

Examples:
  CUST-00001  ← First customer
  CUST-00002  ← Second customer
  CUST-12345  ← Customer 12,345
  CUST-99999  ← Customer 99,999

Maximum Customers:
  • With 5-digit sequence: 99,999 customers
  • Can increase SEQUENCE_LENGTH if needed
```

### Sequence Generation Algorithm

```
Next Sequence Number Logic
═══════════════════════════

Step 1: Query Last Customer
  last_customer = Customer.objects
    .filter(tenant=tenant)
    .order_by('-customer_code')
    .first()

Step 2: Extract Sequence
  if last_customer:
      last_code = last_customer.customer_code
      # Extract "00123" from "CUST-00123"
      sequence_str = last_code.split('-')[1]
      last_sequence = int(sequence_str)
      next_sequence = last_sequence + 1
  else:
      next_sequence = 1  # First customer

Step 3: Format Code
  sequence_str = str(next_sequence).zfill(5)
  new_code = f"{PREFIX}-{sequence_str}"
  return new_code
```

### Concurrency Handling

```
Thread-Safe Code Generation
════════════════════════════

Problem:
  Multiple users creating customers simultaneously
  → Risk of duplicate codes

Solution: Database-Level Locking

Method 1: Select For Update
  with transaction.atomic():
      last_customer = Customer.objects
        .select_for_update()
        .filter(tenant=tenant)
        .order_by('-customer_code')
        .first()
      # Generate and save customer

Method 2: Retry on Collision
  max_retries = 5
  for attempt in range(max_retries):
      code = generate_code()
      if not Customer.objects.filter(
          tenant=tenant,
          customer_code=code
      ).exists():
          return code
      # Code exists, increment and retry
```

### Integration with Customer Model

```
Auto-Generation on Save
═══════════════════════

Customer Model Override:
  def save(self, *args, **kwargs):
      if not self.customer_code:
          generator = CustomerCodeGenerator()
          self.customer_code = generator.generate(self.tenant)
      super().save(*args, **kwargs)

Usage:
  customer = Customer(
      tenant=current_tenant,
      first_name="Saman",
      last_name="Perera"
  )
  customer.save()
  # customer_code automatically set to "CUST-00001"
```

### Customization Options

| Setting | Default | Purpose |
|---------|---------|---------|
| PREFIX | "CUST" | Customer code prefix |
| SEQUENCE_LENGTH | 5 | Zero-padding length |
| SEPARATOR | "-" | Prefix-sequence separator |

### Multi-Tenant Isolation

```
Tenant-Specific Sequences
═════════════════════════

Tenant A:
  CUST-00001
  CUST-00002
  CUST-00003

Tenant B:
  CUST-00001  ← Same sequence, different tenant
  CUST-00002
  CUST-00003

Each tenant has independent sequence
No conflicts between tenants
```

### Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Sequence exhausted | Reached 99,999 customers | Increase SEQUENCE_LENGTH |
| Duplicate code | Race condition | Retry with next sequence |
| Invalid tenant | Tenant not provided | Raise validation error |

### Expected Outcome
- Automated customer code generation
- Unique codes per tenant
- Sequential numbering
- Thread-safe implementation
- Consistent formatting

### Verification Checklist
- [ ] code_generator.py file created
- [ ] CustomerCodeGenerator class defined
- [ ] PREFIX constant set to "CUST"
- [ ] SEQUENCE_LENGTH constant set to 5
- [ ] generate method implemented
- [ ] Sequence extraction logic added
- [ ] Code formatting implemented
- [ ] Uniqueness check added
- [ ] Concurrency handling implemented
- [ ] Service imported in __init__.py
- [ ] Integration with Customer.save() added

---

## Task 15: Add Customer Profile Image

### Overview
Add profile image upload capability to the Customer model. This feature allows storing customer photos or company logos, enhancing visual identification and personalization throughout the system.

### Dependencies
- Task 14: Create Customer Code Generator
- File storage configured (local or cloud)

### Instructions

1. **Open customer.py model file**
   - Navigate to `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add profile_image field**
   - ImageField with upload_to parameter
   - Optional field (blank=True, null=True)
   - Store in 'customers/profile_images/' directory

3. **Define upload path function**
   - Create function to generate upload path
   - Include tenant ID in path for isolation
   - Format: customers/{tenant_id}/profile_images/{customer_code}.{ext}

4. **Add image validation**
   - Maximum file size (e.g., 2MB)
   - Allowed formats (JPEG, PNG)
   - Consider using validators

5. **Add image_url property**
   - Create @property method
   - Return full URL to profile image
   - Return None or default image if not set

6. **Add has_profile_image property**
   - Create @property method
   - Return boolean indicating image existence

7. **Update model docstring**
   - Document profile image functionality

### Profile Image Field Structure

```
┌─────────────────────────────────────────────────┐
│         Customer Profile Image                  │
├─────────────────────────────────────────────────┤
│ Storage Field:                                  │
│  • profile_image (ImageField)                   │
│    Path: customers/{tenant}/profile_images/     │
│                                                 │
│ Properties:                                     │
│  • image_url → Full URL to image                │
│  • has_profile_image → Boolean                  │
└─────────────────────────────────────────────────┘
```

### Upload Path Structure

```
File Storage Organization
═════════════════════════

Storage Root
└── customers/
    ├── tenant-001/
    │   └── profile_images/
    │       ├── CUST-00001.jpg
    │       ├── CUST-00002.png
    │       └── CUST-00003.jpg
    └── tenant-002/
        └── profile_images/
            ├── CUST-00001.jpg
            └── CUST-00002.png

Path Format:
  customers/{tenant_id}/profile_images/{customer_code}.{ext}

Example:
  customers/abc-123-def/profile_images/CUST-00045.jpg
```

### Image Validation Requirements

| Requirement | Value | Purpose |
|------------|-------|---------|
| Max file size | 2 MB | Performance, storage optimization |
| Allowed formats | JPEG, PNG | Standard web formats |
| Max dimensions | 1000x1000 px | Display optimization |
| Min dimensions | 100x100 px | Quality assurance |

### Image Processing Workflow

```
Profile Image Upload Flow
═════════════════════════

1. User selects image file
   ↓
2. Validate file:
   • Check file size (<= 2MB)
   • Verify format (JPEG/PNG)
   • Validate dimensions
   ↓
3. Generate upload path:
   • customers/{tenant}/profile_images/
   • Filename: {customer_code}.{ext}
   ↓
4. Upload to storage:
   • Local filesystem or
   • Cloud storage (S3, etc.)
   ↓
5. Save path to profile_image field
   ↓
6. Generate thumbnail (optional):
   • 200x200 for listings
   • 400x400 for detail view
```

### Image URL Property

```
Image URL Generation
════════════════════

Property Method:
  @property
  def image_url(self):
      if self.profile_image:
          return self.profile_image.url
      return None  # or default image URL

Usage in Templates:
  {% if customer.has_profile_image %}
      <img src="{{ customer.image_url }}" 
           alt="{{ customer.display_name }}">
  {% else %}
      <img src="/static/images/default-avatar.png" 
           alt="Default Avatar">
  {% endif %}

Usage in API:
  {
    "customer_code": "CUST-00001",
    "display_name": "Saman Perera",
    "image_url": "https://cdn.example.com/customers/.../CUST-00001.jpg"
  }
```

### Use Cases

#### Individual Customers
```
Personal Profile Photos
═══════════════════════

Purpose:
  • Visual identification at POS
  • Loyalty program cards
  • Customer recognition

Upload Sources:
  • Staff uploads customer photo
  • Webcam capture at registration
  • Customer uploads in webstore profile
```

#### Business Customers
```
Company Logos
═════════════

Purpose:
  • Company branding
  • Invoice customization
  • B2B portal personalization

Upload Sources:
  • Staff uploads company logo
  • Customer uploads in business portal
  • Import from company website
```

### Storage Backends

| Backend | Configuration | Use Case |
|---------|--------------|----------|
| Local Filesystem | MEDIA_ROOT setting | Development, small deployments |
| Amazon S3 | django-storages | Production, scalability |
| Azure Blob Storage | django-storages | Azure environments |
| Google Cloud Storage | django-storages | Google Cloud environments |

### Image Management Features

```
Image Operations
════════════════

Update Image:
  • Upload new image
  • Automatically replaces old image
  • Old image deleted from storage

Delete Image:
  • Set profile_image = None
  • Delete file from storage
  • Revert to default avatar

Crop/Resize:
  • Auto-crop to square aspect ratio
  • Resize to standard dimensions
  • Maintain aspect ratio if rectangular
```

### Expected Outcome
- Profile image upload capability
- Tenant-isolated file storage
- Image validation and processing
- URL generation for display
- Default avatar fallback

### Verification Checklist
- [ ] profile_image field added (ImageField)
- [ ] upload_to parameter configured
- [ ] Upload path includes tenant ID
- [ ] Image validation added
- [ ] image_url property created
- [ ] has_profile_image property created
- [ ] Model docstring updated
- [ ] File storage configured

---

## Task 16: Create Customer Model Indexes

### Overview
Add database indexes to the Customer model to optimize query performance. Indexes speed up common queries such as customer lookup by code, name search, email search, and status filtering.

### Dependencies
- Task 15: Add Customer Profile Image
- All Customer model fields defined

### Instructions

1. **Open customer.py model file**
   - Navigate to `apps/customers/models/customer.py`
   - Locate Customer model Meta class

2. **Add indexes list to Meta class**
   - Create indexes = [] list in Meta
   - Define all performance-critical indexes

3. **Add customer_code index**
   - Index on (tenant, customer_code)
   - Most frequent lookup query
   - Unique together index

4. **Add email index**
   - Index on (tenant, email)
   - Used for login and search
   - Unique together index

5. **Add primary_phone index**
   - Index on (tenant, primary_phone)
   - Quick phone lookup (POS use case)

6. **Add name composite index**
   - Index on (tenant, first_name, last_name)
   - Name-based search optimization

7. **Add display_name index**
   - Index on (tenant, display_name)
   - Display name search and sorting

8. **Add status index**
   - Index on (tenant, status)
   - Filter active/inactive customers

9. **Add customer_type index**
   - Index on (tenant, customer_type)
   - Filter by customer type

10. **Add created_at index**
    - Index on (tenant, created_at)
    - Date range queries, reporting

11. **Add last_purchase_date index**
    - Index on (tenant, last_purchase_date)
    - Identify inactive customers

12. **Add outstanding_balance index**
    - Index on (tenant, outstanding_balance)
    - Financial queries, collections

13. **Add source index**
    - Index on (tenant, source)
    - Acquisition channel analytics

### Index Strategy Overview

```
┌─────────────────────────────────────────────────┐
│          Customer Model Indexes                 │
├─────────────────────────────────────────────────┤
│ Lookup Indexes:                                 │
│  • (tenant, customer_code) - UNIQUE             │
│  • (tenant, email) - UNIQUE                     │
│  • (tenant, primary_phone)                      │
│                                                 │
│ Search Indexes:                                 │
│  • (tenant, first_name, last_name)              │
│  • (tenant, display_name)                       │
│                                                 │
│ Filter Indexes:                                 │
│  • (tenant, status)                             │
│  • (tenant, customer_type)                      │
│  • (tenant, source)                             │
│                                                 │
│ Date/Financial Indexes:                         │
│  • (tenant, created_at)                         │
│  • (tenant, last_purchase_date)                 │
│  • (tenant, outstanding_balance)                │
└─────────────────────────────────────────────────┘
```

### Index Usage by Query Type

| Query Type | Index Used | Example Query |
|-----------|-----------|---------------|
| Lookup by code | (tenant, customer_code) | WHERE customer_code = 'CUST-00001' |
| Login by email | (tenant, email) | WHERE email = 'user@example.com' |
| POS phone search | (tenant, primary_phone) | WHERE primary_phone = '+94 77 123 4567' |
| Name search | (tenant, first_name, last_name) | WHERE first_name ILIKE 'Saman%' |
| Display name sort | (tenant, display_name) | ORDER BY display_name |
| Active customers | (tenant, status) | WHERE status = 'ACTIVE' |
| Business customers | (tenant, customer_type) | WHERE customer_type = 'BUSINESS' |
| New customers | (tenant, created_at) | WHERE created_at >= '2026-01-01' |
| Inactive customers | (tenant, last_purchase_date) | WHERE last_purchase_date < date_90_days_ago |
| Collections list | (tenant, outstanding_balance) | WHERE outstanding_balance > 0 ORDER BY outstanding_balance DESC |

### Composite Index Advantages

```
Composite Index Benefits
════════════════════════

Index: (tenant, first_name, last_name)

Supports Queries:
  1. WHERE tenant_id = X AND first_name = 'Saman'
  2. WHERE tenant_id = X AND first_name = 'Saman' 
     AND last_name = 'Perera'
  3. WHERE tenant_id = X (less efficient)

Does NOT Support:
  • WHERE last_name = 'Perera' (last_name not first in index)
  • WHERE first_name = 'Saman' (no tenant filter)

Index Order Matters:
  • Most selective column first (tenant)
  • Then commonly queried columns
```

### Index Performance Impact

| Index | Storage Impact | Query Speedup | Maintenance Cost |
|-------|---------------|---------------|------------------|
| customer_code | Low | 100-1000x | Low |
| email | Low | 100-1000x | Low |
| primary_phone | Low | 50-500x | Low |
| name composite | Medium | 10-100x | Medium |
| display_name | Low | 10-100x | Low |
| status | Very Low | 5-50x | Very Low |
| created_at | Low | 10-100x | Low |
| outstanding_balance | Low | 10-100x | Low |

### Multi-Tenancy Index Consideration

```
Tenant Isolation in Indexes
════════════════════════════

Why Include tenant in Every Index:
  • Row-Level Security (RLS) queries always filter by tenant
  • Without tenant in index, database scans all tenants
  • Massive performance impact in multi-tenant systems

Example Without Tenant:
  SELECT * FROM customers WHERE customer_code = 'CUST-00001'
  → Scans all tenants' customer_code values
  → Slow, scales poorly

Example With Tenant:
  SELECT * FROM customers 
  WHERE tenant_id = X AND customer_code = 'CUST-00001'
  → Uses (tenant, customer_code) index
  → Fast, tenant-isolated
```

### Index Naming Conventions

```
PostgreSQL Index Names
══════════════════════

Auto-generated:
  customers_customer_tenant_id_customer_code_idx
  customers_customer_tenant_id_email_idx

Manual naming:
  idx_customer_code
  idx_customer_email
  idx_customer_name

Use Meta.indexes with explicit names:
  models.Index(
      fields=['tenant', 'customer_code'],
      name='idx_customer_code'
  )
```

### Expected Outcome
- Optimized query performance
- Fast customer lookups
- Efficient filtering and sorting
- Scalable for large datasets
- Proper multi-tenancy support

### Verification Checklist
- [ ] indexes list added to Meta class
- [ ] (tenant, customer_code) index added
- [ ] (tenant, email) index added
- [ ] (tenant, primary_phone) index added
- [ ] (tenant, first_name, last_name) index added
- [ ] (tenant, display_name) index added
- [ ] (tenant, status) index added
- [ ] (tenant, customer_type) index added
- [ ] (tenant, created_at) index added
- [ ] (tenant, last_purchase_date) index added
- [ ] (tenant, outstanding_balance) index added
- [ ] (tenant, source) index added
- [ ] All indexes include tenant for multi-tenancy

---

## Task 17: Create Customer Model Constraints

### Overview
Add database-level constraints to enforce data integrity rules. Constraints prevent invalid data at the database level, ensuring consistency across all application entry points and protecting against programming errors.

### Dependencies
- Task 16: Create Customer Model Indexes

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model Meta class

2. **Add constraints list to Meta class**
   - Create constraints = [] list in Meta
   - Define all data integrity constraints

3. **Add unique customer_code constraint**
   - UniqueConstraint on (tenant, customer_code)
   - Ensure code uniqueness per tenant
   - Name: 'unique_customer_code_per_tenant'

4. **Add unique email constraint**
   - UniqueConstraint on (tenant, email)
   - When email is not null
   - Name: 'unique_customer_email_per_tenant'

5. **Add business name requirement constraint**
   - CheckConstraint
   - If customer_type is BUSINESS, company_name must not be empty
   - Name: 'business_requires_company_name'

6. **Add positive balance constraints**
   - CheckConstraint on total_purchases >= 0
   - CheckConstraint on total_payments >= 0
   - Prevent negative financial values

7. **Add credit limit positive constraint**
   - CheckConstraint on credit_limit >= 0
   - When credit_limit is not null

8. **Add email format constraint (optional)**
   - CheckConstraint for basic email validation
   - Additional layer beyond Django validation

9. **Update model docstring**
   - Document constraint purpose
   - List all constraints

### Constraints Structure

```
┌─────────────────────────────────────────────────┐
│         Customer Model Constraints              │
├─────────────────────────────────────────────────┤
│ Uniqueness Constraints:                         │
│  • unique_customer_code_per_tenant              │
│  • unique_customer_email_per_tenant             │
│                                                 │
│ Business Logic Constraints:                     │
│  • business_requires_company_name               │
│                                                 │
│ Financial Constraints:                          │
│  • positive_total_purchases                     │
│  • positive_total_payments                      │
│  • positive_credit_limit                        │
└─────────────────────────────────────────────────┘
```

### Uniqueness Constraints

#### Unique Customer Code
```
UniqueConstraint Configuration
══════════════════════════════

Constraint:
  UniqueConstraint(
      fields=['tenant', 'customer_code'],
      name='unique_customer_code_per_tenant'
  )

Purpose:
  • Prevent duplicate customer codes within tenant
  • Allow same code across different tenants

Violation Example:
  Tenant A already has CUST-00001
  Attempting to create another CUST-00001 in Tenant A
  → Database raises IntegrityError
```

#### Unique Email
```
Conditional Unique Email
════════════════════════

Constraint:
  UniqueConstraint(
      fields=['tenant', 'email'],
      condition=Q(email__isnull=False),
      name='unique_customer_email_per_tenant'
  )

Purpose:
  • One customer per email per tenant
  • Null emails don't violate uniqueness
  • Supports multiple customers without email

Scenarios:
  ✅ Customer A: email = 'user@example.com'
  ✅ Customer B: email = None
  ✅ Customer C: email = None
  ❌ Customer D: email = 'user@example.com' (duplicate!)
```

### Business Logic Constraints

```
Business Type Validation
════════════════════════

Constraint:
  CheckConstraint(
      check=Q(customer_type='business') 
            & ~Q(company_name='') 
            | ~Q(customer_type='business'),
      name='business_requires_company_name'
  )

Logic:
  IF customer_type = 'BUSINESS'
  THEN company_name MUST NOT be empty

Violation Example:
  customer_type = 'BUSINESS'
  company_name = '' (empty string)
  → Database raises IntegrityError

Valid Examples:
  • customer_type = 'BUSINESS', company_name = 'ABC Ltd'
  • customer_type = 'INDIVIDUAL', company_name = ''
```

### Financial Constraints

```
Positive Financial Values
═════════════════════════

Constraints:
  CheckConstraint(
      check=Q(total_purchases__gte=0),
      name='positive_total_purchases'
  )
  
  CheckConstraint(
      check=Q(total_payments__gte=0),
      name='positive_total_payments'
  )
  
  CheckConstraint(
      check=Q(credit_limit__gte=0) | Q(credit_limit__isnull=True),
      name='positive_credit_limit'
  )

Purpose:
  • Prevent negative purchase totals
  • Prevent negative payment totals
  • Prevent negative credit limits

Violation Examples:
  total_purchases = -1000  ❌
  total_payments = -500    ❌
  credit_limit = -10000    ❌

Valid Examples:
  total_purchases = 0      ✅
  total_purchases = 50000  ✅
  credit_limit = null      ✅
  credit_limit = 100000    ✅
```

### Constraint Benefits

| Benefit | Description |
|---------|-------------|
| Data Integrity | Prevent invalid data at database level |
| Defense in Depth | Protection even if application validation fails |
| Consistency | Enforce rules across all access methods (API, admin, scripts) |
| Documentation | Constraints document business rules |
| Error Detection | Early detection of logic errors |

### Constraint vs Validation

```
Constraint vs Application Validation
═════════════════════════════════════

Application Validation:
  • Django model clean() method
  • Form validation
  • Serializer validation
  • Can be bypassed (bulk operations, raw SQL)

Database Constraints:
  • Enforced at database level
  • Cannot be bypassed
  • Always active
  • Last line of defense

Best Practice:
  Implement both for optimal protection:
    1. Application validation (user-friendly errors)
    2. Database constraints (ultimate protection)
```

### Constraint Error Handling

```
Handling Constraint Violations
══════════════════════════════

Try-Catch Pattern:
  from django.db import IntegrityError
  
  try:
      customer.save()
  except IntegrityError as e:
      if 'unique_customer_code' in str(e):
          return "Customer code already exists"
      elif 'unique_customer_email' in str(e):
          return "Email already registered"
      elif 'business_requires_company_name' in str(e):
          return "Business customers must have company name"
      else:
          raise
```

### Expected Outcome
- Database-level data integrity
- Prevention of invalid data
- Protection against programming errors
- Documented business rules
- Consistent data quality

### Verification Checklist
- [ ] constraints list added to Meta class
- [ ] unique_customer_code_per_tenant constraint added
- [ ] unique_customer_email_per_tenant constraint added
- [ ] business_requires_company_name constraint added
- [ ] positive_total_purchases constraint added
- [ ] positive_total_payments constraint added
- [ ] positive_credit_limit constraint added
- [ ] All constraints properly named
- [ ] Model docstring updated

---

## Task 18: Run Initial Customer Migrations

### Overview
Generate and apply the initial database migration for the Customer model. This migration creates the customers_customer table with all fields, indexes, and constraints defined in previous tasks.

### Dependencies
- Task 17: Create Customer Model Constraints
- All Customer model fields, indexes, and constraints defined
- Database connection configured

### Instructions

1. **Verify model is complete**
   - Review Customer model
   - Ensure all fields added
   - Verify indexes and constraints

2. **Make migrations**
   - Run Django's makemigrations command
   - Specify customers app
   - Review generated migration file

3. **Review migration file**
   - Open generated migration in migrations/
   - Verify all fields present
   - Check index and constraint creation
   - Ensure foreign key relationships correct

4. **Test migration (dry run)**
   - Run migration with --plan flag
   - Review planned operations
   - Ensure no errors

5. **Apply migration to development database**
   - Run migrate command
   - Apply to local/development database first
   - Verify table creation

6. **Verify table structure**
   - Connect to database
   - Inspect customers_customer table
   - Verify all columns exist
   - Check indexes created
   - Verify constraints applied

7. **Test model operations**
   - Create test customer
   - Retrieve customer
   - Update customer
   - Verify constraints work (test violations)

8. **Commit migration file**
   - Add migration file to version control
   - Commit with descriptive message

### Migration Commands

```
Django Migration Commands
═════════════════════════

1. Make Migrations:
   python manage.py makemigrations customers

   Output:
   Migrations for 'customers':
     customers/migrations/0001_initial.py
       - Create model Customer

2. Show Migration Plan:
   python manage.py migrate customers --plan

   Output:
   Planned operations:
   customers.0001_initial
     - Create model Customer
       - Create index customers_customer_tenant_id_customer_code_idx
       - Create constraint unique_customer_code_per_tenant
       - ...

3. Apply Migration:
   python manage.py migrate customers

   Output:
   Running migrations:
     Applying customers.0001_initial... OK

4. Show Migrations Status:
   python manage.py showmigrations customers

   Output:
   customers
    [X] 0001_initial
```

### Migration File Structure

```
Generated Migration File
════════════════════════

File: customers/migrations/0001_initial.py

Contents:
  • dependencies: List of dependent migrations
  • operations:
    - CreateModel: Customer model
    - AddField: All model fields
    - AddIndex: All indexes
    - AddConstraint: All constraints

Example Structure:
  class Migration(migrations.Migration):
      dependencies = [
          ('tenants', '0001_initial'),
          ('auth', '0012_user_model'),
      ]
      
      operations = [
          migrations.CreateModel(
              name='Customer',
              fields=[
                  ('id', models.UUIDField(...)),
                  ('customer_code', models.CharField(...)),
                  # ... all fields
              ],
              options={
                  'verbose_name': 'Customer',
                  'verbose_name_plural': 'Customers',
                  'ordering': ['display_name'],
              },
          ),
          migrations.AddIndex(...),
          migrations.AddConstraint(...),
      ]
```

### Database Table Verification

```
SQL Table Structure
═══════════════════

Table: customers_customer

Columns:
  id                      UUID PRIMARY KEY
  tenant_id               UUID NOT NULL REFERENCES tenants_tenant
  customer_code           VARCHAR(50) NOT NULL
  first_name              VARCHAR(100)
  last_name               VARCHAR(100)
  display_name            VARCHAR(200)
  customer_type           VARCHAR(20) NOT NULL
  status                  VARCHAR(20) NOT NULL
  company_name            VARCHAR(200)
  email                   VARCHAR(255) UNIQUE
  primary_phone           VARCHAR(20)
  tax_id                  VARCHAR(50)
  vat_number              VARCHAR(50)
  total_purchases         DECIMAL(15,2) DEFAULT 0
  total_payments          DECIMAL(15,2) DEFAULT 0
  outstanding_balance     DECIMAL(15,2) DEFAULT 0
  order_count             INTEGER DEFAULT 0
  credit_limit            DECIMAL(15,2)
  accepts_marketing       BOOLEAN DEFAULT FALSE
  source                  VARCHAR(20) NOT NULL
  profile_image           VARCHAR(255)
  created_at              TIMESTAMP NOT NULL
  updated_at              TIMESTAMP NOT NULL
  # ... other fields

Indexes:
  idx_customer_code       (tenant_id, customer_code)
  idx_customer_email      (tenant_id, email)
  # ... other indexes

Constraints:
  unique_customer_code_per_tenant
  unique_customer_email_per_tenant
  positive_total_purchases
  # ... other constraints
```

### Testing Migration

```
Post-Migration Testing
══════════════════════

Test 1: Create Customer
  customer = Customer.objects.create(
      tenant=test_tenant,
      first_name="Saman",
      last_name="Perera",
      customer_type=CUSTOMER_TYPE_INDIVIDUAL,
      status=CUSTOMER_STATUS_ACTIVE,
      source=CUSTOMER_SOURCE_MANUAL
  )
  # Should auto-generate customer_code

Test 2: Unique Code Constraint
  customer2 = Customer.objects.create(
      tenant=test_tenant,
      customer_code=customer.customer_code,  # Duplicate!
      ...
  )
  # Should raise IntegrityError

Test 3: Business Name Constraint
  business = Customer.objects.create(
      tenant=test_tenant,
      customer_type=CUSTOMER_TYPE_BUSINESS,
      company_name="",  # Empty!
      ...
  )
  # Should raise IntegrityError

Test 4: Query Performance
  # Test that indexes work
  customer = Customer.objects.get(
      tenant=test_tenant,
      customer_code="CUST-00001"
  )
  # Should be fast (uses index)
```

### Rollback Plan

```
Migration Rollback
══════════════════

If Issues Found:
  python manage.py migrate customers zero

  This will:
  • Drop customers_customer table
  • Remove all indexes
  • Remove all constraints

Then:
  • Fix model issues
  • Delete migration file
  • Regenerate migration
  • Reapply
```

### Multi-Tenant Migration Notes

```
Tenant Schema Migration
═══════════════════════

In django-tenants:
  • Public schema migrations run first
  • Then applied to all tenant schemas
  • Customer model in TENANT_APPS
  • Table created in each tenant schema

Migration Scope:
  Public Schema: No customers_customer table
  Tenant Schema 1: customers_customer table
  Tenant Schema 2: customers_customer table
  Tenant Schema 3: customers_customer table
  # ... etc.

Each tenant has isolated customer data
```

### Expected Outcome
- Database table created
- All fields present
- Indexes created and functional
- Constraints enforced
- Model ready for use
- Migration file in version control

### Verification Checklist
- [ ] makemigrations command executed successfully
- [ ] Migration file generated in migrations/
- [ ] Migration file reviewed for accuracy
- [ ] migrate command executed successfully
- [ ] Database table created
- [ ] All columns present in table
- [ ] Indexes created
- [ ] Constraints enforced
- [ ] Test customer creation successful
- [ ] Constraint violations properly caught
- [ ] Migration file committed to Git

---

## Summary

This document completed the Customer model implementation:

### Completed Features
- ✅ Customer source tracking (manual, POS, webstore, import)
- ✅ Automated customer code generation (CUST-{sequence})
- ✅ Profile image upload support
- ✅ Performance-optimized database indexes
- ✅ Data integrity constraints
- ✅ Initial database migrations applied

### Key Achievements
1. **Source Attribution** - Track customer acquisition channels
2. **Code Generation** - Automated unique customer identification
3. **Visual Identity** - Profile image storage and display
4. **Performance** - Comprehensive indexing strategy
5. **Data Integrity** - Database-level constraint enforcement
6. **Deployment Ready** - Migrations generated and applied

### Customer Model Complete
The Customer model is now fully implemented with:
- 30+ fields covering all aspects of customer data
- Multi-tenancy support with proper isolation
- Sri Lanka-specific features (tax IDs, address formats)
- Financial tracking and credit management
- Marketing consent and privacy compliance
- Comprehensive indexing and constraints
- Automated code generation
- Profile image support

### Next Group
Proceed to Group B to implement multi-address and multi-phone functionality with Sri Lanka location data support.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1360
