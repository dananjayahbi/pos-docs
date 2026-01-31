# Tasks 33-44: MessageTemplate Model and Template Creation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** C - Template Messages  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../../Group-B_API-Client-Auth/02_Tasks-26-32_Media-Phone-Verify.md](../../Group-B_API-Client-Auth/02_Tasks-26-32_Media-Phone-Verify.md)
- **→ Next Document:** [02_Tasks-45-52_Multilang-Builder-Admin.md](02_Tasks-45-52_Multilang-Builder-Admin.md)

---

## Document Overview

This document covers the creation of the MessageTemplate model and the implementation of core template definitions for order lifecycle notifications. The MessageTemplate model stores pre-approved WhatsApp Business templates with multilingual support, including template identifiers, language codes, template types, and parameter placeholders. It also creates seven essential templates: order confirmation, payment success, payment failed, shipped, out for delivery, delivered notifications, and COD reminder for cash-on-delivery orders.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create MessageTemplate Model | Medium | 45 min |
| 34 | Create template_name Field | Low | 10 min |
| 35 | Create language Field | Low | 15 min |
| 36 | Create template_type Field | Low | 20 min |
| 37 | Create header_params Field | Low | 15 min |
| 38 | Create body_params Field | Low | 15 min |
| 39 | Create Order Confirmation Template | Medium | 30 min |
| 40 | Create Payment Success Template | Medium | 25 min |
| 41 | Create Payment Failed Template | Medium | 25 min |
| 42 | Create Shipped Template | Medium | 25 min |
| 43 | Create Out for Delivery Template | Medium | 20 min |
| 44 | Create Delivered Template | Medium | 20 min |

---

## Task 33: Create MessageTemplate Model

### Overview

Create the MessageTemplate model to store WhatsApp Business API template definitions. This model serves as the central repository for all approved message templates used across the system. Each template must be pre-approved by Meta (Facebook) before it can be sent through the WhatsApp Business API. The model includes multi-tenancy support, tracks template approval status, and stores template structure including placeholders and components.

### Dependencies

- Task 32: WhatsApp API Client phone verification must be complete
- notifications app must exist in backend
- PostgreSQL database configured with multi-tenancy
- django-tenants installed and configured

### Instructions

1. **Create model file in notifications app**
   - Navigate to backend notifications app models directory
   - Create new file named message_template.py
   - This file will store all template-related models

2. **Import required Django modules**
   - Import models from django.db
   - Import timezone utilities for timestamp fields
   - Import TenantMixin if implementing tenant-specific templates
   - Import JSONField for storing parameter arrays

3. **Define MessageTemplate class**
   - Extend Django Model class
   - Add docstring explaining purpose and WhatsApp API requirements
   - Note that templates must be approved by Meta before use

4. **Add timestamp fields**
   - Include created_at field with auto_now_add
   - Include updated_at field with auto_now
   - These track template creation and modification dates

5. **Add approval tracking fields**
   - Include is_approved BooleanField defaulting to False
   - Include approval_date DateTimeField nullable
   - Include meta_template_id field to store WhatsApp's template ID

6. **Add template content fields**
   - Include template_content TextField for full template text
   - Include template_category field for WhatsApp categories
   - Include components JSONField for structured template parts

7. **Configure model metadata**
   - Set verbose_name to "Message Template"
   - Set verbose_name_plural to "Message Templates"
   - Add unique_together constraint on template_name and language
   - Add ordering by template_type then template_name

8. **Implement string representation**
   - Return format showing template_name and language
   - Example: "order_confirmation (en)"

9. **Add model validation methods**
   - Create clean method to validate JSONField formats
   - Validate that param names match between header and body
   - Ensure language code is valid

10. **Register model in init file**
    - Import MessageTemplate in models init file
    - Ensure model is discoverable by Django

### MessageTemplate Model Structure

| Field Category | Fields | Purpose |
|----------------|--------|---------|
| Identification | id, template_name, language | Unique template identification |
| Categorization | template_type, template_category | Template classification |
| Parameters | header_params, body_params | Placeholder definitions |
| Content | template_content, components | Template structure |
| Status | is_approved, approval_date, meta_template_id | Approval tracking |
| Timestamps | created_at, updated_at | Audit trail |
| Multi-tenancy | tenant (optional) | Tenant-specific templates |

### Template Approval Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Template Lifecycle                      │
└─────────────────────────────────────────────────────────┘

1. Create Template
   └─> is_approved = False
       
2. Submit to Meta
   └─> Store meta_template_id
   
3. Meta Reviews (24-48 hours)
   └─> Check compliance
   
4. Approval Received
   └─> is_approved = True
   └─> approval_date set
   
5. Ready for Use
   └─> Can send messages
```

### Template Categories

| Category | Description | Use Case |
|----------|-------------|----------|
| TRANSACTIONAL | Order updates, confirmations | E-commerce notifications |
| MARKETING | Promotions, offers | Marketing campaigns |
| AUTHENTICATION | OTP, verification | Security codes |
| UTILITY | Reminders, alerts | General notifications |

### Expected Outcome

- MessageTemplate model created with all required fields
- Model supports multi-language templates
- Approval tracking functionality implemented
- Unique constraints prevent duplicate templates
- Model registered and migrations ready to create

### Verification Checklist

- [ ] MessageTemplate model class defined
- [ ] All timestamp fields included
- [ ] Approval tracking fields present
- [ ] JSONField for parameters configured
- [ ] Model metadata properly configured
- [ ] String representation implemented
- [ ] Clean validation method added
- [ ] Unique constraints defined
- [ ] Model registered in models init file
- [ ] No syntax errors in model definition

---

## Task 34: Create template_name Field

### Overview

Add the template_name field to MessageTemplate model. This field stores the unique identifier for each template type, such as "order_confirmation" or "payment_success". The template_name acts as a human-readable key that allows the system to reference specific templates programmatically. It must be unique per language to ensure correct template selection.

### Dependencies

- Task 33: MessageTemplate Model must be created

### Instructions

1. **Add CharField for template_name**
   - Add field to MessageTemplate model
   - Set max_length to 100 characters
   - Make field required (no null, no blank)

2. **Configure field constraints**
   - Add db_index=True for query performance
   - Templates will be frequently queried by name
   - Index improves lookup speed

3. **Add descriptive help_text**
   - Set help_text explaining naming convention
   - Example: "Unique template identifier (e.g., order_confirmation)"
   - Mention lowercase with underscores convention

4. **Define naming conventions in documentation**
   - Template names use lowercase letters
   - Words separated by underscores
   - Language code not included in name
   - Descriptive but concise

5. **Add field-level validation**
   - Validate format using regex or clean method
   - Ensure only lowercase, underscores, and numbers
   - Prevent special characters or spaces
   - Maximum length validation

6. **Update unique_together constraint**
   - Modify Meta class unique_together
   - Set to ('template_name', 'language')
   - This allows same template name in different languages
   - Prevents duplicate templates in same language

7. **Update string representation**
   - Modify __str__ method to use template_name
   - Display as "template_name (language_code)"

### Template Name Format

```
┌─────────────────────────────────────────┐
│     Template Name Format Rules          │
└─────────────────────────────────────────┘

Format: {action}_{context}_{type}

Examples:
- order_confirmation
- payment_success
- payment_failed
- order_shipped
- out_for_delivery
- order_delivered
- cod_reminder
- abandoned_cart
- low_stock_alert

Rules:
✓ Lowercase only
✓ Underscores for word separation
✓ Descriptive and clear
✓ No language suffix
✗ No special characters
✗ No spaces
✗ No uppercase
```

### Template Name Examples

| Template Type | template_name | Description |
|---------------|---------------|-------------|
| Order | order_confirmation | Order placed successfully |
| Payment | payment_success | Payment received |
| Payment | payment_failed | Payment declined |
| Shipping | order_shipped | Order dispatched |
| Delivery | out_for_delivery | En route to customer |
| Delivery | order_delivered | Delivery completed |
| Reminder | cod_reminder | Cash payment reminder |
| Cart | abandoned_cart | Incomplete checkout |
| Inventory | low_stock_alert | Stock running low |

### Database Schema

```
┌─────────────────────────────────────────────┐
│         MessageTemplate Table                │
├─────────────────────────────────────────────┤
│ id (PK)                    INTEGER           │
│ template_name              VARCHAR(100) ✓    │
│ language                   VARCHAR(2)        │
│ ...                                          │
│ UNIQUE (template_name, language)            │
│ INDEX ON (template_name)                    │
└─────────────────────────────────────────────┘
```

### Expected Outcome

- template_name field added to MessageTemplate model
- Field indexed for performance
- Unique constraint with language prevents duplicates
- Clear naming convention established
- Validation ensures consistent format

### Verification Checklist

- [ ] template_name field defined as CharField
- [ ] max_length set to 100
- [ ] Field is required (not nullable)
- [ ] db_index=True for performance
- [ ] Helpful help_text provided
- [ ] Unique constraint with language configured
- [ ] Naming convention documented
- [ ] Validation logic implemented
- [ ] String representation updated

---

## Task 35: Create language Field

### Overview

Add the language field to MessageTemplate model to support multilingual message templates. This field stores the ISO 639-1 language code (two-letter code) for each template. LankaCommerce Cloud supports three languages: English (en), Sinhala (si), and Tamil (ta) to serve the diverse Sri Lankan market. Each template can have versions in all three languages, allowing customers to receive notifications in their preferred language.

### Dependencies

- Task 33: MessageTemplate Model must be created
- Task 34: template_name field must exist

### Instructions

1. **Define language choices tuple**
   - Create LANGUAGE_CHOICES at model class level
   - Include tuples for each supported language
   - Format: (code, display_name)

2. **Add language choices**
   - Add ('en', 'English') for English
   - Add ('si', 'Sinhala') for Sinhala (සිංහල)
   - Add ('ta', 'Tamil') for Tamil (தமிழ்)

3. **Add CharField for language**
   - Set max_length to 2 (ISO 639-1 standard)
   - Set choices parameter to LANGUAGE_CHOICES
   - Set default to 'en' for English
   - Make field required

4. **Add field index**
   - Set db_index=True for query performance
   - Language will be queried frequently
   - Improves template lookup by language

5. **Add help_text**
   - Set help_text to "Template language (en/si/ta)"
   - Clarify the three supported languages

6. **Update unique_together constraint**
   - Ensure Meta class includes ('template_name', 'language')
   - Allows same template in different languages
   - Prevents duplicate language versions

7. **Add language display method**
   - Create get_language_display property
   - Returns full language name from choices
   - Use Django's built-in get_FOO_display method

8. **Update string representation**
   - Modify __str__ to show language code
   - Format: "template_name (language)"

### Language Support Structure

```
┌──────────────────────────────────────────────────────┐
│          Sri Lankan Language Support                  │
└──────────────────────────────────────────────────────┘

┌──────────────┬──────────┬─────────────┬──────────────┐
│   Language   │   Code   │   Script    │   Usage      │
├──────────────┼──────────┼─────────────┼──────────────┤
│   English    │    en    │   Latin     │   Official   │
│   Sinhala    │    si    │   Sinhala   │   75% pop    │
│   Tamil      │    ta    │   Tamil     │   15% pop    │
└──────────────┴──────────┴─────────────┴──────────────┘

Language Selection Priority:
1. Customer's preferred language (from profile)
2. Tenant's default language
3. System default (English)
```

### Language Field Configuration

| Attribute | Value | Reason |
|-----------|-------|--------|
| Type | CharField | Store code efficiently |
| max_length | 2 | ISO 639-1 standard |
| choices | LANGUAGE_CHOICES | Restrict to supported languages |
| default | 'en' | English fallback |
| db_index | True | Fast language queries |
| blank | False | Always required |
| null | False | No null values |

### Multi-Language Template Example

```
┌─────────────────────────────────────────────────────┐
│       Order Confirmation in Three Languages          │
└─────────────────────────────────────────────────────┘

English (en):
┌─────────────────────────────────────────────────────┐
│ Header: Order #12345 Confirmed                      │
│ Body: Thank you {name}! Your order of ₨{total}      │
│       has been confirmed. Track: {url}              │
└─────────────────────────────────────────────────────┘

Sinhala (si):
┌─────────────────────────────────────────────────────┐
│ Header: ඇණවුම #12345 තහවුරු කරන ලදී                 │
│ Body: ස්තූතියි {name}! ඔබගේ ඇණවුම ₨{total}         │
│       තහවුරු කර ඇත. ට්‍රැක්: {url}                   │
└─────────────────────────────────────────────────────┘

Tamil (ta):
┌─────────────────────────────────────────────────────┐
│ Header: ஆர்டர் #12345 உறுதிப்படுத்தப்பட்டது            │
│ Body: நன்றி {name}! உங்கள் ஆர்டர் ₨{total}          │
│       உறுதிப்படுத்தப்பட்டது. டிராக்: {url}           │
└─────────────────────────────────────────────────────┘
```

### Language Detection Flow

```
Customer places order
    │
    ▼
Check customer.preferred_language
    │
    ├─> Has preference? ────> Use preferred language
    │
    └─> No preference?
        │
        ▼
    Check tenant.default_language
        │
        ├─> Has default? ────> Use tenant default
        │
        └─> No default? ────> Use 'en' (English)
```

### Expected Outcome

- language field added with three supported languages
- Field indexed for efficient queries
- Default language set to English
- Multi-language template support enabled
- Unique constraint prevents duplicate language versions

### Verification Checklist

- [ ] LANGUAGE_CHOICES tuple defined
- [ ] All three languages included (en, si, ta)
- [ ] language field added as CharField(max_length=2)
- [ ] choices parameter set to LANGUAGE_CHOICES
- [ ] default set to 'en'
- [ ] db_index=True configured
- [ ] unique_together includes language field
- [ ] get_language_display method works
- [ ] String representation includes language

---

## Task 36: Create template_type Field

### Overview

Add the template_type field to MessageTemplate model to categorize templates by their notification purpose. This field enables the system to identify which template to use for specific events in the order lifecycle. For example, when an order is confirmed, the system knows to select templates with type "ORDER_CONFIRMATION". The template_type field acts as a business logic identifier that maps system events to appropriate notification templates.

### Dependencies

- Task 33: MessageTemplate Model must be created
- Task 35: language field must exist for multi-language support

### Instructions

1. **Define template type choices constant**
   - Create TEMPLATE_TYPE_CHOICES at model class level
   - Define all order lifecycle notification types
   - Use descriptive constant names in uppercase

2. **Add order lifecycle template types**
   - Add ORDER_CONFIRMATION type for order placed
   - Add PAYMENT_SUCCESS type for payment received
   - Add PAYMENT_FAILED type for payment declined
   - Add SHIPPED type for order dispatched
   - Add OUT_FOR_DELIVERY type for in-transit
   - Add DELIVERED type for delivery complete
   - Add COD_REMINDER type for cash-on-delivery reminder

3. **Add CharField for template_type**
   - Set max_length to 50 characters
   - Set choices parameter to TEMPLATE_TYPE_CHOICES
   - Make field required (not nullable)
   - Add db_index for query performance

4. **Add descriptive help_text**
   - Explain that type determines when template is used
   - Example: "Notification type (e.g., ORDER_CONFIRMATION)"

5. **Add type validation**
   - Ensure value matches one of defined choices
   - Django automatically validates choices
   - Add custom validation if needed for business rules

6. **Configure field indexing**
   - Set db_index=True for filtering by type
   - System will query templates by type frequently
   - Improves performance for template selection

7. **Add get_template_type_display method**
   - Django auto-generates this from choices
   - Returns human-readable type name
   - Use in admin interface and logs

8. **Update model ordering**
   - Modify Meta class ordering
   - Set to ['template_type', 'template_name']
   - Groups templates by type in admin

### Template Type Structure

```
┌─────────────────────────────────────────────────────┐
│           Order Lifecycle Template Types             │
└─────────────────────────────────────────────────────┘

Customer Journey         →         Template Types
─────────────────────────────────────────────────────

1. Order Placed          →    ORDER_CONFIRMATION
   └─> Confirmation sent

2. Payment Processing
   ├─> Success           →    PAYMENT_SUCCESS
   └─> Failed            →    PAYMENT_FAILED

3. Order Fulfillment
   └─> Packed & Shipped  →    SHIPPED

4. Delivery Process
   ├─> Out for Delivery  →    OUT_FOR_DELIVERY
   ├─> Delivered         →    DELIVERED
   └─> COD Collection    →    COD_REMINDER

Additional Types (Future):
- ABANDONED_CART
- RETURN_INITIATED
- REFUND_PROCESSED
- FEEDBACK_REQUEST
```

### Template Type Mapping

| Event | template_type | When Sent | Priority |
|-------|---------------|-----------|----------|
| Order created | ORDER_CONFIRMATION | Immediately after order | High |
| Payment successful | PAYMENT_SUCCESS | After payment gateway confirmation | High |
| Payment declined | PAYMENT_FAILED | After payment failure | High |
| Order shipped | SHIPPED | When tracking number assigned | Medium |
| Out for delivery | OUT_FOR_DELIVERY | When courier scans for delivery | Medium |
| Delivered | DELIVERED | After successful delivery | Medium |
| COD reminder | COD_REMINDER | 2 hours before delivery | High |

### Template Type Choices Format

```
TEMPLATE_TYPE_CHOICES = (
    ('ORDER_CONFIRMATION', 'Order Confirmation'),
    ('PAYMENT_SUCCESS', 'Payment Success'),
    ('PAYMENT_FAILED', 'Payment Failed'),
    ('SHIPPED', 'Order Shipped'),
    ('OUT_FOR_DELIVERY', 'Out for Delivery'),
    ('DELIVERED', 'Order Delivered'),
    ('COD_REMINDER', 'COD Reminder'),
)
```

### Template Selection Logic

```
┌──────────────────────────────────────────────────┐
│         Template Selection Algorithm              │
└──────────────────────────────────────────────────┘

Input: event_type, language_code, tenant

1. Filter by template_type
   └─> WHERE template_type = event_type

2. Filter by language
   └─> AND language = language_code

3. Filter by approval status
   └─> AND is_approved = True

4. Get active template
   └─> ORDER BY updated_at DESC
   └─> LIMIT 1

5. Fallback to English if language not found
   └─> Retry with language = 'en'
```

### Template Type Usage Statistics

| Type | Frequency | Timing | Customer Impact |
|------|-----------|--------|-----------------|
| ORDER_CONFIRMATION | Every order | Immediate | Critical - confirms order |
| PAYMENT_SUCCESS | 95% of orders | Within 30 sec | High - confirms payment |
| PAYMENT_FAILED | 5% of orders | Immediate | Critical - requires action |
| SHIPPED | 95% of orders | 1-3 days after | Medium - tracking info |
| OUT_FOR_DELIVERY | 90% of orders | Delivery day | High - prepares customer |
| DELIVERED | 85% of orders | Post-delivery | Low - confirmation |
| COD_REMINDER | 30% of orders | Pre-delivery | High - payment prep |

### Expected Outcome

- template_type field added with clear categorization
- All order lifecycle events have corresponding types
- Field indexed for efficient template lookup
- Template selection logic can filter by type
- Types are descriptive and self-documenting

### Verification Checklist

- [ ] TEMPLATE_TYPE_CHOICES constant defined
- [ ] All seven lifecycle types included
- [ ] template_type field added as CharField(max_length=50)
- [ ] choices parameter set correctly
- [ ] Field is required (not nullable)
- [ ] db_index=True configured
- [ ] help_text explains purpose
- [ ] Model ordering updated to include template_type
- [ ] get_template_type_display method available

---

## Task 37: Create header_params Field

### Overview

Add the header_params field to MessageTemplate model to store the list of placeholder parameters used in the template header. WhatsApp Business templates support headers with dynamic content through named parameters. This field stores an array of parameter names that will be replaced with actual values when sending messages. For example, an order confirmation header might use {order_number} as a parameter. The header_params field defines which parameters are expected and their order.

### Dependencies

- Task 33: MessageTemplate Model must be created
- PostgreSQL JSONField support configured
- Django JSONField imported

### Instructions

1. **Import JSONField**
   - Import JSONField from django.db.models
   - Available in Django 3.1+ for PostgreSQL
   - Stores JSON array of parameter names

2. **Add JSONField for header_params**
   - Add field to MessageTemplate model
   - Set field type to JSONField
   - Set default to empty list []
   - Make field nullable (blank=True, null=True)

3. **Configure field properties**
   - Set blank=True to allow templates without headers
   - Set null=True for database compatibility
   - Set default=list for empty default (not [])
   - Some templates may not have headers

4. **Add comprehensive help_text**
   - Explain field stores parameter names as array
   - Example: "['order_number', 'customer_name']"
   - Note parameters must match header placeholders

5. **Add field documentation comment**
   - Document expected JSON structure
   - Explain parameter order matters
   - Provide examples of valid values

6. **Implement validation in clean method**
   - Validate JSON format is list
   - Ensure all items are strings
   - Check parameter names use valid format
   - Prevent special characters in param names

7. **Add parameter naming validation**
   - Parameter names should use snake_case
   - Only lowercase letters, numbers, underscores
   - No spaces or special characters
   - Maximum length per parameter name

8. **Create helper method for parameter count**
   - Add method get_header_param_count
   - Returns length of header_params array
   - Useful for validation and display

### Header Parameter Structure

```
┌─────────────────────────────────────────────────────┐
│         Header Parameter Configuration               │
└─────────────────────────────────────────────────────┘

JSON Structure:
┌──────────────────────────────────────────────────┐
│ header_params = [                                │
│     "param_name_1",                              │
│     "param_name_2",                              │
│     "param_name_3"                               │
│ ]                                                │
└──────────────────────────────────────────────────┘

Example - Order Confirmation:
┌──────────────────────────────────────────────────┐
│ header_params = ["order_number"]                │
│                                                  │
│ Template Header Text:                           │
│ "Order #{1} Confirmed"                          │
│                                                  │
│ Actual Message Header:                          │
│ "Order #12345 Confirmed"                        │
└──────────────────────────────────────────────────┘

Example - Shipped:
┌──────────────────────────────────────────────────┐
│ header_params = ["order_number", "courier"]     │
│                                                  │
│ Template Header Text:                           │
│ "Order #{1} Shipped via {2}"                    │
│                                                  │
│ Actual Message Header:                          │
│ "Order #12345 Shipped via DHL"                  │
└──────────────────────────────────────────────────┘
```

### Parameter Naming Conventions

| Aspect | Rule | Examples |
|--------|------|----------|
| Case | snake_case | order_number, customer_name |
| Characters | Letters, numbers, underscore | total_amount, item_count |
| Format | Descriptive but concise | tracking_url (not url) |
| Avoid | Special chars, spaces | ❌ order-number, order number |
| Length | 3-30 characters | ✓ order_id, ❌ o, ❌ customer_first_name_with_title |

### Header Parameter Examples by Template Type

```
┌─────────────────────────────────────────────────────┐
│        Common Header Parameters by Type              │
└─────────────────────────────────────────────────────┘

ORDER_CONFIRMATION
└─> ["order_number"]

PAYMENT_SUCCESS
└─> ["payment_id", "amount"]

PAYMENT_FAILED
└─> ["order_number", "reason"]

SHIPPED
└─> ["order_number", "tracking_number"]

OUT_FOR_DELIVERY
└─> ["order_number", "estimated_time"]

DELIVERED
└─> ["order_number", "delivery_time"]

COD_REMINDER
└─> ["order_number", "amount"]
```

### Parameter Validation Rules

```
┌─────────────────────────────────────────────────┐
│          Parameter Validation Logic              │
└─────────────────────────────────────────────────┘

1. Type Validation
   ├─> Must be list/array
   └─> Cannot be dictionary or string

2. Item Validation
   ├─> Each item must be string
   └─> No numeric or boolean items

3. Name Validation
   ├─> Match pattern: ^[a-z][a-z0-9_]*$
   ├─> Start with letter
   ├─> Only lowercase, numbers, underscores
   └─> Length: 3-30 characters

4. Count Validation
   ├─> Maximum 5 parameters per header
   └─> Minimum 0 (no header parameters)

5. Uniqueness
   └─> No duplicate parameter names
```

### Database Storage

```
┌────────────────────────────────────────────────────┐
│           PostgreSQL JSONB Storage                  │
└────────────────────────────────────────────────────┘

Column: header_params
Type: JSONB
Default: '[]'
Nullable: Yes

Example stored values:
┌────────────────────────────────────────────────┐
│ NULL                                           │  ← No header
│ []                                             │  ← Empty header
│ ["order_number"]                               │  ← Single param
│ ["order_number", "customer_name", "amount"]    │  ← Multiple params
└────────────────────────────────────────────────┘

Benefits of JSONB:
- Efficient storage
- Fast querying
- Flexible schema
- Native validation
```

### Expected Outcome

- header_params field added to store parameter arrays
- Field accepts JSON array of parameter names
- Empty default allows templates without headers
- Validation ensures correct JSON structure
- Parameter naming follows conventions

### Verification Checklist

- [ ] JSONField imported from django.db.models
- [ ] header_params field defined as JSONField
- [ ] default=list configured (not [])
- [ ] blank=True and null=True set
- [ ] Comprehensive help_text added
- [ ] Parameter validation in clean method
- [ ] Naming convention validation implemented
- [ ] Helper method for param count added
- [ ] Field properly documented

---

## Task 38: Create body_params Field

### Overview

Add the body_params field to MessageTemplate model to store the list of placeholder parameters used in the template body. The body contains the main message content and typically includes more parameters than the header. This field stores an ordered array of parameter names that will be substituted with actual values when sending messages. For example, an order confirmation body might include {customer_name}, {total_amount}, and {tracking_url} parameters.

### Dependencies

- Task 33: MessageTemplate Model must be created
- Task 37: header_params field must exist (for consistency)
- JSONField support configured

### Instructions

1. **Add JSONField for body_params**
   - Add field below header_params in model
   - Set field type to JSONField
   - Set default to empty list
   - Configure similar to header_params

2. **Configure field properties**
   - Set blank=True to allow simple messages
   - Set null=True for database compatibility
   - Set default=list for empty default
   - Most templates will have body parameters

3. **Add detailed help_text**
   - Explain stores body parameter names
   - Provide example array format
   - Note parameters must match body placeholders
   - Mention order matters for substitution

4. **Implement comprehensive validation**
   - Validate JSON structure is list
   - Ensure all items are strings
   - Check parameter name format
   - Validate against naming conventions

5. **Add parameter count limits**
   - Maximum 10 parameters for body
   - More than header to allow detailed messages
   - Validate count in clean method
   - Prevent excessive parameterization

6. **Add parameter name validation**
   - Use same rules as header_params
   - snake_case format required
   - Only lowercase, numbers, underscores
   - Descriptive but concise names

7. **Create body parameter count method**
   - Add get_body_param_count method
   - Returns length of body_params array
   - Used for validation and statistics

8. **Add total parameter count method**
   - Create get_total_param_count method
   - Sums header and body parameter counts
   - Useful for complexity metrics
   - WhatsApp has limits on total parameters

9. **Implement duplicate check**
   - Validate no duplicate names in body_params
   - Check across header_params and body_params
   - Prevent confusion in parameter mapping
   - Add validation in clean method

### Body Parameter Structure

```
┌─────────────────────────────────────────────────────┐
│          Body Parameter Configuration                │
└─────────────────────────────────────────────────────┘

JSON Structure:
┌──────────────────────────────────────────────────┐
│ body_params = [                                  │
│     "customer_name",                             │
│     "order_number",                              │
│     "total_amount",                              │
│     "payment_method",                            │
│     "tracking_url"                               │
│ ]                                                │
└──────────────────────────────────────────────────┘

Template Body Text:
┌──────────────────────────────────────────────────┐
│ "Thank you {1}! Your order #{2} of ₨{3}         │
│  has been confirmed. Payment via {4}.            │
│  Track your order: {5}"                          │
└──────────────────────────────────────────────────┘

Actual Message Body:
┌──────────────────────────────────────────────────┐
│ "Thank you Kasun! Your order #12345 of ₨5,250   │
│  has been confirmed. Payment via Card.           │
│  Track your order: https://lcc.lk/track/12345"  │
└──────────────────────────────────────────────────┘
```

### Body Parameters by Template Type

```
┌─────────────────────────────────────────────────────┐
│       Body Parameters for Each Template Type         │
└─────────────────────────────────────────────────────┘

ORDER_CONFIRMATION
├─> customer_name
├─> order_number
├─> total_amount
├─> item_count
├─> payment_method
└─> tracking_url

PAYMENT_SUCCESS
├─> customer_name
├─> payment_amount
├─> payment_method
├─> transaction_id
└─> order_number

PAYMENT_FAILED
├─> customer_name
├─> order_number
├─> failed_amount
├─> failure_reason
└─> retry_url

SHIPPED
├─> customer_name
├─> order_number
├─> tracking_number
├─> tracking_url
├─> courier_name
└─> estimated_delivery

OUT_FOR_DELIVERY
├─> customer_name
├─> order_number
├─> delivery_agent
├─> agent_phone
├─> estimated_time
└─> address

DELIVERED
├─> customer_name
├─> order_number
├─> delivery_time
├─> receiver_name
└─> feedback_url

COD_REMINDER
├─> customer_name
├─> order_number
├─> cod_amount
├─> delivery_time
└─> delivery_instructions
```

### Parameter Complexity Guidelines

| Template Type | Header Params | Body Params | Total | Complexity |
|---------------|---------------|-------------|-------|------------|
| ORDER_CONFIRMATION | 1 | 6 | 7 | Medium |
| PAYMENT_SUCCESS | 2 | 5 | 7 | Medium |
| PAYMENT_FAILED | 2 | 5 | 7 | Medium |
| SHIPPED | 2 | 6 | 8 | High |
| OUT_FOR_DELIVERY | 2 | 6 | 8 | High |
| DELIVERED | 1 | 5 | 6 | Low |
| COD_REMINDER | 2 | 5 | 7 | Medium |

### Parameter Validation Matrix

```
┌────────────────────────────────────────────────────┐
│         Body Parameter Validation Rules             │
└────────────────────────────────────────────────────┘

Aspect              Rule                Example
─────────────────────────────────────────────────────
Type                List[str]           ["name", "amount"]
Min Count           0                   [] (allowed)
Max Count           10                  10 parameters max
Item Type           String              "customer_name"
Name Format         snake_case          order_number
Start Char          Lowercase letter    customer_name
Allowed Chars       a-z, 0-9, _        order_id_123
Min Length          3 characters        qty
Max Length          30 characters       estimated_delivery_date
Uniqueness          No duplicates       Each name once
Cross-check         No header overlap   Different from header
```

### Complete Parameter Example

```
┌─────────────────────────────────────────────────────┐
│      Complete Template with All Parameters           │
└─────────────────────────────────────────────────────┘

Template: ORDER_CONFIRMATION (English)

header_params:
["order_number"]

body_params:
["customer_name", "order_number", "total_amount", 
 "item_count", "payment_method", "tracking_url"]

Template Text:
─────────────────────────────────────────────────────
Header: Order #{1} Confirmed

Body: Thank you {1}! Your order #{2} totaling 
₨{3} with {4} items has been confirmed. Payment 
via {5}. Track your order: {6}

Footer: LankaCommerce Cloud
─────────────────────────────────────────────────────

Substitution Values:
{order_number} → "12345"
{customer_name} → "Kasun Perera"
{total_amount} → "5,250.00"
{item_count} → "3"
{payment_method} → "Card"
{tracking_url} → "https://lcc.lk/track/12345"

Final Message:
─────────────────────────────────────────────────────
Header: Order #12345 Confirmed

Body: Thank you Kasun Perera! Your order #12345 
totaling ₨5,250.00 with 3 items has been confirmed. 
Payment via Card. Track your order: 
https://lcc.lk/track/12345

Footer: LankaCommerce Cloud
─────────────────────────────────────────────────────
```

### Expected Outcome

- body_params field added to store message parameters
- Field accepts ordered array of parameter names
- Validation ensures correct format and naming
- Parameter count limits prevent complexity
- Cross-validation with header_params prevents duplicates

### Verification Checklist

- [ ] body_params field defined as JSONField
- [ ] default=list configured correctly
- [ ] blank=True and null=True set
- [ ] Comprehensive help_text added
- [ ] Maximum 10 parameters validated
- [ ] Parameter name format validated
- [ ] Duplicate parameter check implemented
- [ ] Cross-check with header_params added
- [ ] Helper methods created (count, total)
- [ ] Validation in clean method complete

---

## Task 39: Create Order Confirmation Template

### Overview

Create the first message template: Order Confirmation. This template is sent immediately after a customer successfully places an order. It confirms receipt of the order, provides the order number for reference, summarizes the order details including total amount and item count, confirms the payment method, and provides a tracking URL. This is one of the most critical templates as it reassures customers their order was received and provides essential reference information.

### Dependencies

- Task 38: body_params field must exist
- All model fields (tasks 33-38) must be complete
- Database migrations must be ready to run

### Instructions

1. **Create template data structure**
   - Define template details for order confirmation
   - Set template_name to "order_confirmation"
   - Set language to "en" (English version)
   - Set template_type to "ORDER_CONFIRMATION"

2. **Define header parameters**
   - Set header_params to ["order_number"]
   - Header displays order number for quick reference
   - Simple single-parameter header

3. **Define body parameters**
   - Set body_params array with 6 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference number
     - "total_amount" - Formatted total with currency
     - "item_count" - Number of items in order
     - "payment_method" - Payment method used
     - "tracking_url" - Link to track order

4. **Write template content**
   - Create professional, friendly tone
   - Thank customer by name
   - Confirm order with number and amount
   - Mention item count for clarity
   - State payment method for transparency
   - Provide tracking link for convenience

5. **Design template structure**
   - Header: "Order #{order_number} Confirmed"
   - Body: Multi-line message with all details
   - Include call-to-action (track order)
   - Keep message concise but complete

6. **Set template category**
   - Set template_category to "TRANSACTIONAL"
   - Transactional category for order updates
   - Ensures high deliverability

7. **Configure approval fields**
   - Set is_approved to False initially
   - Leave approval_date null
   - Leave meta_template_id empty
   - Template needs Meta approval before use

8. **Add template components**
   - Define components JSONField structure
   - Include header, body, and footer components
   - Specify parameter positions
   - Follow WhatsApp API template format

9. **Create migration or fixture**
   - Create Django migration for template data
   - Or create fixture file for template loading
   - Ensure repeatable installation

10. **Document parameter requirements**
    - Document expected value formats
    - Specify order_number format (e.g., #12345)
    - Define total_amount format (₨5,250.00)
    - Clarify tracking_url format

### Order Confirmation Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Order Confirmation Template                 │
└─────────────────────────────────────────────────────┘

Template Name: order_confirmation
Language: en
Type: ORDER_CONFIRMATION
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} Confirmed ✓                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Thank you {customer_name}! 🎉                       │
│                                                      │
│ Your order #{order_number} has been successfully    │
│ confirmed.                                           │
│                                                      │
│ Order Details:                                       │
│ • Total: ₨{total_amount}                            │
│ • Items: {item_count}                               │
│ • Payment: {payment_method}                         │
│                                                      │
│ Track your order:                                    │
│ {tracking_url}                                       │
│                                                      │
│ We'll notify you when your order ships!             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Need help? Reply to this message                    │
└─────────────────────────────────────────────────────┘
```

### Parameter Value Examples

| Parameter | Format | Example | Validation |
|-----------|--------|---------|------------|
| order_number | #XXXXX | #12345 | 5 digits, # prefix |
| customer_name | First name | Kasun, Nimal, Sita | 2-50 chars |
| total_amount | ₨X,XXX.XX | ₨5,250.00 | Formatted with commas |
| item_count | Number | 3, 1, 15 | Positive integer |
| payment_method | Method name | Card, Cash, Bank | Predefined list |
| tracking_url | Full URL | https://lcc.lk/track/12345 | Valid URL |

### Template Usage Scenario

```
┌────────────────────────────────────────────────────┐
│         Order Confirmation Flow                     │
└────────────────────────────────────────────────────┘

1. Customer completes checkout
   └─> Order created in database

2. Payment processed successfully
   └─> Order status: CONFIRMED

3. Trigger notification service
   └─> Event: ORDER_CONFIRMED

4. Select template
   └─> Type: ORDER_CONFIRMATION
   └─> Language: Customer's preferred language

5. Build parameter values
   ├─> order_number from order.id
   ├─> customer_name from order.customer.first_name
   ├─> total_amount from order.total_formatted
   ├─> item_count from order.items.count()
   ├─> payment_method from order.payment_method.name
   └─> tracking_url from order.tracking_url

6. Send WhatsApp message
   └─> Via Business API

7. Log notification
   └─> Store in WhatsAppMessage model
```

### Customer Perspective

```
┌────────────────────────────────────────────────────┐
│  What Customer Sees (Example)                      │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 10:45 AM

Order #12345 Confirmed ✓

Thank you Kasun! 🎉

Your order #12345 has been successfully confirmed.

Order Details:
• Total: ₨5,250.00
• Items: 3
• Payment: Card

Track your order:
https://lcc.lk/track/12345

We'll notify you when your order ships!

─────────────────────────────────────────────
LankaCommerce Cloud
Need help? Reply to this message
```

### Expected Outcome

- Order confirmation template created with English content
- All required parameters defined (1 header, 6 body)
- Template follows WhatsApp Business API format
- Content is professional, clear, and customer-friendly
- Template ready for Meta approval submission

### Verification Checklist

- [ ] Template name set to "order_confirmation"
- [ ] Language set to "en"
- [ ] template_type set to "ORDER_CONFIRMATION"
- [ ] header_params contains ["order_number"]
- [ ] body_params contains all 6 required parameters
- [ ] Template content written professionally
- [ ] Parameter placeholders correctly positioned
- [ ] template_category set to "TRANSACTIONAL"
- [ ] is_approved set to False (awaiting approval)
- [ ] Template structure follows WhatsApp guidelines
- [ ] Migration or fixture created
- [ ] Documentation for parameter formats complete

---

## Task 40: Create Payment Success Template

### Overview

Create the Payment Success template sent when a payment is successfully processed and confirmed. This template provides immediate confirmation that payment was received, includes the transaction reference for customer records, confirms the payment amount and method, and reassures the customer that their order will proceed to fulfillment. Quick payment confirmation is critical for customer trust and reduces payment-related support inquiries.

### Dependencies

- Task 39: Order Confirmation template created (for consistency)
- All model fields complete
- Template structure established

### Instructions

1. **Define template identification**
   - Set template_name to "payment_success"
   - Set language to "en" (English version)
   - Set template_type to "PAYMENT_SUCCESS"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["payment_id", "amount"]
   - Shows payment reference and amount upfront
   - Two-parameter header for complete context

3. **Define body parameters**
   - Set body_params array with 5 parameters:
     - "customer_name" - Customer's first name
     - "payment_amount" - Amount paid with currency
     - "payment_method" - Method used (Card, Bank, etc.)
     - "transaction_id" - Payment gateway transaction ID
     - "order_number" - Associated order reference

4. **Write template content**
   - Congratulate customer on successful payment
   - Provide transaction ID for records
   - Confirm amount and method
   - Link payment to order number
   - Reassure order processing will continue

5. **Design header**
   - Format: "Payment ₨{amount} Received ✓"
   - Shows amount clearly in header
   - Uses checkmark for positive reinforcement

6. **Structure body message**
   - Thank customer personally
   - Confirm payment details prominently
   - Provide transaction reference
   - Connect to order for context
   - Set expectation for next step (shipping)

7. **Add reassuring elements**
   - Confirm security of payment
   - Mention order will proceed
   - Provide contact option for questions
   - Keep tone positive and confident

8. **Configure meta fields**
   - Set is_approved to False
   - Leave approval fields empty
   - Ready for Meta submission

### Payment Success Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Payment Success Template                    │
└─────────────────────────────────────────────────────┘

Template Name: payment_success
Language: en
Type: PAYMENT_SUCCESS
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Payment ₨{amount} Received ✓                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Thank you {customer_name}! 💳                       │
│                                                      │
│ We've successfully received your payment.           │
│                                                      │
│ Payment Details:                                     │
│ • Amount: ₨{payment_amount}                         │
│ • Method: {payment_method}                          │
│ • Transaction ID: {transaction_id}                  │
│ • Order: #{order_number}                            │
│                                                      │
│ Your order is now being processed and will ship     │
│ soon. We'll notify you with tracking details!       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Secure payments powered by LCC                      │
└─────────────────────────────────────────────────────┘
```

### Payment Success Use Cases

| Payment Method | When Sent | Priority | Customer Action |
|----------------|-----------|----------|-----------------|
| Credit/Debit Card | Immediately after gateway confirmation | High | None (automated) |
| Bank Transfer | After bank confirms transfer | High | Keep transaction ID |
| Mobile Wallet | Immediately after wallet confirmation | High | None (automated) |
| COD (Advance) | After advance payment received | Medium | Prepare balance for delivery |

### Parameter Requirements

```
┌────────────────────────────────────────────────────┐
│        Payment Success Parameter Formats            │
└────────────────────────────────────────────────────┘

customer_name
├─> First name only
├─> Properly capitalized
└─> Example: "Kasun", "Sita"

payment_amount
├─> Formatted with commas
├─> Two decimal places
├─> Currency symbol included
└─> Example: "₨5,250.00"

payment_method
├─> Friendly name (not code)
├─> Options: "Credit Card", "Debit Card", 
│           "Bank Transfer", "Mobile Wallet"
└─> Example: "Credit Card"

transaction_id
├─> Payment gateway reference
├─> Alphanumeric string
├─> Varies by gateway
└─> Example: "TXN20250131ABC123"

order_number
├─> Order reference with # prefix
├─> 5-digit number
└─> Example: "#12345"
```

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 10:46 AM (1 minute after order)

Payment ₨5,250.00 Received ✓

Thank you Kasun! 💳

We've successfully received your payment.

Payment Details:
• Amount: ₨5,250.00
• Method: Credit Card
• Transaction ID: TXN20250131ABC123
• Order: #12345

Your order is now being processed and will ship soon. 
We'll notify you with tracking details!

─────────────────────────────────────────────
LankaCommerce Cloud
Secure payments powered by LCC
```

### Expected Outcome

- Payment success template created with English content
- Template confirms payment receipt immediately
- All payment details included for customer records
- Message tone is positive and reassuring
- Links payment to order for context

### Verification Checklist

- [ ] Template name set to "payment_success"
- [ ] Language set to "en"
- [ ] template_type set to "PAYMENT_SUCCESS"
- [ ] header_params contains ["payment_id", "amount"]
- [ ] body_params contains all 5 required parameters
- [ ] Template content professionally written
- [ ] Amount shown in both header and body
- [ ] Transaction ID included for records
- [ ] Order number links payment to order
- [ ] Reassuring message about order processing
- [ ] is_approved set to False

---

## Task 41: Create Payment Failed Template

### Overview

Create the Payment Failed template sent when a payment attempt is declined or fails. This is a critical customer communication that requires careful tone management - it must inform the customer of the failure while being helpful and non-judgmental. The template should clearly state the failure, provide the reason if available, explain what happens next, and make it easy for the customer to retry payment or choose an alternative method.

### Dependencies

- Task 40: Payment Success template created (for contrast)
- Template structure and patterns established

### Instructions

1. **Define template identification**
   - Set template_name to "payment_failed"
   - Set language to "en"
   - Set template_type to "PAYMENT_FAILED"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["order_number", "reason"]
   - Shows which order and why payment failed
   - Provides immediate context in header

3. **Define body parameters**
   - Set body_params array with 5 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference
     - "failed_amount" - Amount that wasn't charged
     - "failure_reason" - Specific reason for decline
     - "retry_url" - Direct link to retry payment

4. **Write empathetic content**
   - Use neutral, non-alarming tone
   - State failure clearly but gently
   - Provide specific failure reason
   - Offer immediate solution (retry link)
   - Mention alternative payment methods

5. **Design header carefully**
   - Format: "Order #{order_number} - Payment Issue"
   - Avoid harsh words like "Failed" or "Declined" in header
   - Use "Issue" or "Not Processed" for softer tone

6. **Structure body with solutions**
   - Acknowledge the payment issue
   - Explain what happened
   - Reassure order is still held
   - Provide easy retry option
   - Mention support availability

7. **Add time-sensitive information**
   - State how long order will be held
   - Mention timeout period (typically 24-48 hours)
   - Create gentle urgency without pressure

8. **Include alternative options**
   - Mention other payment methods available
   - Suggest contacting support if needed
   - Provide multiple paths to complete payment

### Payment Failed Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Payment Failed Template                     │
└─────────────────────────────────────────────────────┘

Template Name: payment_failed
Language: en
Type: PAYMENT_FAILED
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} - Payment Issue               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Hi {customer_name},                                 │
│                                                      │
│ We couldn't process your payment for order          │
│ #{order_number}.                                     │
│                                                      │
│ Details:                                             │
│ • Amount: ₨{failed_amount}                          │
│ • Reason: {failure_reason}                          │
│                                                      │
│ Your order is still reserved for 24 hours.          │
│                                                      │
│ To complete your order:                              │
│ 1. Retry payment: {retry_url}                       │
│ 2. Or choose a different payment method             │
│                                                      │
│ Need help? Reply to this message or contact our     │
│ support team.                                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ We're here to help                                  │
└─────────────────────────────────────────────────────┘
```

### Common Failure Reasons

| Reason Code | Customer-Friendly Message | Next Action |
|-------------|---------------------------|-------------|
| insufficient_funds | Insufficient funds | Try different card or bank transfer |
| card_declined | Card declined by bank | Contact bank or try another card |
| expired_card | Card has expired | Update card details |
| incorrect_cvv | Incorrect security code | Check CVV and retry |
| network_error | Payment gateway timeout | Retry payment |
| limit_exceeded | Transaction limit exceeded | Use different payment method |
| card_not_supported | Card type not supported | Try another card type |

### Parameter Specifications

```
┌────────────────────────────────────────────────────┐
│        Payment Failed Parameter Formats             │
└────────────────────────────────────────────────────┘

customer_name
└─> Example: "Kasun", "Nimal"

order_number
├─> With # prefix
└─> Example: "#12345"

failed_amount
├─> Formatted amount that wasn't charged
└─> Example: "₨5,250.00"

failure_reason
├─> User-friendly explanation
├─> NOT technical error codes
└─> Examples:
    • "Insufficient funds in account"
    • "Card declined by your bank"
    • "Payment gateway timeout"
    • "Card has expired"

retry_url
├─> Direct link to payment page
├─> Pre-filled with order details
├─> Example: "https://lcc.lk/payment/retry/12345"
└─> URL must be shortened or validated
```

### Tone and Messaging Guidelines

```
┌────────────────────────────────────────────────────┐
│        Communication Best Practices                 │
└────────────────────────────────────────────────────┘

✓ DO:
- Use neutral, helpful tone
- Provide specific reason
- Offer immediate solution
- Mention order is still held
- Make retry process easy
- Offer human support

✗ DON'T:
- Use alarming language
- Blame the customer
- Use technical jargon
- Create excessive urgency
- Hide the real reason
- Make retry complicated
```

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 10:46 AM

Order #12345 - Payment Issue

Hi Kasun,

We couldn't process your payment for order #12345.

Details:
• Amount: ₨5,250.00
• Reason: Card declined by your bank

Your order is still reserved for 24 hours.

To complete your order:
1. Retry payment: https://lcc.lk/payment/retry/12345
2. Or choose a different payment method

Need help? Reply to this message or contact our 
support team.

─────────────────────────────────────────────
LankaCommerce Cloud
We're here to help
```

### Expected Outcome

- Payment failed template created with empathetic tone
- Failure reason clearly communicated
- Easy retry option provided
- Order hold period mentioned
- Support access emphasized

### Verification Checklist

- [ ] Template name set to "payment_failed"
- [ ] Language set to "en"
- [ ] template_type set to "PAYMENT_FAILED"
- [ ] header_params contains ["order_number", "reason"]
- [ ] body_params contains all 5 parameters
- [ ] Tone is neutral and helpful (not alarming)
- [ ] Failure reason parameter included
- [ ] Retry URL provided prominently
- [ ] Order hold period mentioned
- [ ] Alternative payment methods suggested
- [ ] Support contact information included

---

## Task 42: Create Shipped Template

### Overview

Create the Shipped template sent when an order is dispatched from the warehouse or fulfillment center. This template marks the transition from order processing to active delivery. It provides the tracking number, shipping courier information, estimated delivery date, and a link to track the shipment in real-time. This is a high-impact customer touchpoint that sets expectations for delivery and reduces "where is my order" inquiries.

### Dependencies

- Task 41: Payment Failed template created
- Order lifecycle template patterns established

### Instructions

1. **Define template identification**
   - Set template_name to "order_shipped"
   - Set language to "en"
   - Set template_type to "SHIPPED"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["order_number", "tracking_number"]
   - Shows order reference and tracking number upfront
   - Two key pieces of information in header

3. **Define body parameters**
   - Set body_params array with 6 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference
     - "tracking_number" - Courier tracking number
     - "tracking_url" - Live tracking link
     - "courier_name" - Shipping company name
     - "estimated_delivery" - Expected delivery date

4. **Write shipping notification content**
   - Announce shipment with excitement
   - Provide tracking number prominently
   - Include courier name for context
   - Show estimated delivery date
   - Emphasize tracking link
   - Mention next notification (out for delivery)

5. **Design header**
   - Format: "Order #{order_number} Shipped 📦"
   - Use package emoji for visual impact
   - Includes both order and tracking reference

6. **Structure body with tracking emphasis**
   - Congratulate on shipment
   - List shipping details clearly
   - Make tracking URL prominent
   - Set delivery expectations
   - Preview next update

7. **Add helpful information**
   - Mention how to track order
   - Provide courier name and tracking number
   - State estimated delivery timeframe
   - Offer support for delivery questions

### Shipped Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Order Shipped Template                      │
└─────────────────────────────────────────────────────┘

Template Name: order_shipped
Language: en
Type: SHIPPED
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} Shipped 📦                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Great news {customer_name}! 🚚                      │
│                                                      │
│ Your order #{order_number} has been shipped and is  │
│ on its way to you!                                   │
│                                                      │
│ Shipping Details:                                    │
│ • Courier: {courier_name}                           │
│ • Tracking #: {tracking_number}                     │
│ • Est. Delivery: {estimated_delivery}               │
│                                                      │
│ Track your package:                                  │
│ {tracking_url}                                       │
│                                                      │
│ We'll notify you when your order is out for         │
│ delivery!                                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Questions about delivery? Reply here                │
└─────────────────────────────────────────────────────┘
```

### Shipping Timeline Context

```
┌────────────────────────────────────────────────────┐
│        Order Lifecycle - Shipping Stage            │
└────────────────────────────────────────────────────┘

1. Order Confirmed ✓
   └─> Payment Success sent

2. Order Processing (1-2 days)
   └─> Warehouse picks and packs

3. ► SHIPPED ◄ (Current notification)
   └─> Handed to courier
   └─> Tracking activated

4. Out for Delivery (Next notification)
   └─> On delivery vehicle

5. Delivered (Final notification)
   └─> Successfully delivered
```

### Parameter Formats

| Parameter | Format | Example | Notes |
|-----------|--------|---------|-------|
| customer_name | First name | Kasun, Nimal | Personalization |
| order_number | #XXXXX | #12345 | With # prefix |
| tracking_number | Courier format | TRK987654321 | Varies by courier |
| tracking_url | Full URL | https://track.courier.lk/TRK987654321 | Clickable link |
| courier_name | Company name | DHL, Aramex, Pronto | Official name |
| estimated_delivery | Date format | Feb 5, 2026 | 3-5 days from ship |

### Courier Integration

```
┌────────────────────────────────────────────────────┐
│        Sri Lankan Courier Services                  │
└────────────────────────────────────────────────────┘

National Couriers:
├─> Pronto Lanka
│   └─> Tracking: https://pronto.lk/track/{number}
├─> Aramex Lanka
│   └─> Tracking: https://aramex.lk/track/{number}
├─> DHL Sri Lanka
│   └─> Tracking: https://dhl.lk/track/{number}
└─> Kapruka Courier
    └─> Tracking: https://kapruka.com/track/{number}

International Couriers:
├─> DHL Express
├─> FedEx
└─> UPS

Tracking Number Formats:
- Pronto: PLK123456789
- Aramex: ARX987654321
- DHL: DHL1234567890
```

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 2:30 PM (2 days after order)

Order #12345 Shipped 📦

Great news Kasun! 🚚

Your order #12345 has been shipped and is on its 
way to you!

Shipping Details:
• Courier: Pronto Lanka
• Tracking #: PLK123456789
• Est. Delivery: Feb 5, 2026

Track your package:
https://pronto.lk/track/PLK123456789

We'll notify you when your order is out for delivery!

─────────────────────────────────────────────
LankaCommerce Cloud
Questions about delivery? Reply here
```

### Expected Outcome

- Shipped template created with tracking emphasis
- All shipping details included
- Tracking URL provided for real-time updates
- Estimated delivery date sets expectations
- Courier information included for customer reference

### Verification Checklist

- [ ] Template name set to "order_shipped"
- [ ] Language set to "en"
- [ ] template_type set to "SHIPPED"
- [ ] header_params contains ["order_number", "tracking_number"]
- [ ] body_params contains all 6 parameters
- [ ] Tracking number prominently displayed
- [ ] Tracking URL included
- [ ] Courier name specified
- [ ] Estimated delivery date mentioned
- [ ] Next notification previewed
- [ ] Positive, exciting tone used

---

## Task 43: Create Out for Delivery Template

### Overview

Create the Out for Delivery template sent when the package is loaded onto the delivery vehicle and is en route to the customer. This is the most time-sensitive notification as it alerts customers that delivery will happen within hours. It includes the delivery agent's name and contact number, provides a narrow estimated delivery window, confirms the delivery address, and may include special delivery instructions. This notification helps ensure someone is available to receive the package.

### Dependencies

- Task 42: Shipped template created
- Delivery notification sequence established

### Instructions

1. **Define template identification**
   - Set template_name to "out_for_delivery"
   - Set language to "en"
   - Set template_type to "OUT_FOR_DELIVERY"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["order_number", "estimated_time"]
   - Shows which order and when it will arrive
   - Time-critical information in header

3. **Define body parameters**
   - Set body_params array with 6 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference
     - "delivery_agent" - Agent's first name
     - "agent_phone" - Agent's contact number
     - "estimated_time" - Delivery time window
     - "address" - Delivery address (abbreviated)

4. **Write urgent but friendly content**
   - Create sense of immediacy
   - Provide delivery agent details
   - Give narrow time window
   - Confirm delivery address
   - Mention how to contact agent

5. **Design time-sensitive header**
   - Format: "Order #{order_number} Arriving Soon! 🚚"
   - Use urgent but positive language
   - Include emoji for attention

6. **Structure body with agent info**
   - Announce imminent delivery
   - Name the delivery agent
   - Provide agent's phone number
   - State arrival time window
   - Confirm delivery location
   - Offer agent contact option

7. **Add delivery preparation guidance**
   - Mention preparation steps if needed
   - For COD, remind about payment
   - Suggest being available
   - Provide agent contact method

### Out for Delivery Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Out for Delivery Template                   │
└─────────────────────────────────────────────────────┘

Template Name: out_for_delivery
Language: en
Type: OUT_FOR_DELIVERY
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} Arriving Soon! 🚚             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Hi {customer_name}! 📍                              │
│                                                      │
│ Your order #{order_number} is out for delivery and  │
│ will arrive within the next few hours!              │
│                                                      │
│ Delivery Details:                                    │
│ • Agent: {delivery_agent}                           │
│ • Phone: {agent_phone}                              │
│ • Est. Time: {estimated_time}                       │
│ • Address: {address}                                │
│                                                      │
│ Please ensure someone is available to receive the   │
│ package. You can contact {delivery_agent} directly  │
│ at {agent_phone} if needed.                         │
│                                                      │
│ Almost there! 🎉                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Delivery in progress                                │
└─────────────────────────────────────────────────────┘
```

### Delivery Timeline

```
┌────────────────────────────────────────────────────┐
│        Out for Delivery Timing                      │
└────────────────────────────────────────────────────┘

Morning Route (9 AM - 1 PM)
├─> Notification sent: 8:30 AM
├─> Estimated window: "10 AM - 12 PM"
└─> Typical delivery: 10:30 AM

Afternoon Route (1 PM - 5 PM)
├─> Notification sent: 12:30 PM
├─> Estimated window: "2 PM - 4 PM"
└─> Typical delivery: 2:30 PM

Evening Route (5 PM - 8 PM)
├─> Notification sent: 4:30 PM
├─> Estimated window: "6 PM - 8 PM"
└─> Typical delivery: 6:30 PM

Note: Notification sent 30 minutes before route starts
```

### Parameter Specifications

```
┌────────────────────────────────────────────────────┐
│        Out for Delivery Parameter Formats           │
└────────────────────────────────────────────────────┘

customer_name
└─> Example: "Kasun", "Nimal"

order_number
└─> Example: "#12345"

delivery_agent
├─> Agent's first name for familiarity
└─> Example: "Amal", "Ruwan", "Nimal"

agent_phone
├─> Sri Lankan mobile format
├─> Formatted: +94 77 XXX XXXX
└─> Example: "+94 77 123 4567"

estimated_time
├─> Time window (2-3 hour range)
├─> Format: "HH:MM AM/PM - HH:MM AM/PM"
└─> Examples:
    • "10:00 AM - 12:00 PM"
    • "2:00 PM - 4:00 PM"
    • "Next 2-3 hours"

address
├─> Abbreviated delivery address
├─> Include area and landmark
└─> Example: "123 Galle Rd, Colombo 03"
```

### Special Scenarios

| Scenario | Additional Message | Parameter |
|----------|-------------------|-----------|
| COD Order | "Please have ₨{cod_amount} ready" | cod_amount |
| Signature Required | "Signature required upon delivery" | signature_required |
| ID Verification | "ID verification may be needed" | requires_id |
| Heavy Package | "Package requires assistance to carry" | is_heavy |
| Fragile | "Handle with care - fragile items" | is_fragile |

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 9:00 AM (Delivery day)

Order #12345 Arriving Soon! 🚚

Hi Kasun! 📍

Your order #12345 is out for delivery and will 
arrive within the next few hours!

Delivery Details:
• Agent: Amal
• Phone: +94 77 123 4567
• Est. Time: 10:00 AM - 12:00 PM
• Address: 123 Galle Rd, Colombo 03

Please ensure someone is available to receive the 
package. You can contact Amal directly at 
+94 77 123 4567 if needed.

Almost there! 🎉

─────────────────────────────────────────────
LankaCommerce Cloud
Delivery in progress
```

### Expected Outcome

- Out for delivery template created with urgency
- Delivery agent information included
- Contact number provided for coordination
- Narrow time window sets clear expectations
- Message encourages customer to be available

### Verification Checklist

- [ ] Template name set to "out_for_delivery"
- [ ] Language set to "en"
- [ ] template_type set to "OUT_FOR_DELIVERY"
- [ ] header_params contains ["order_number", "estimated_time"]
- [ ] body_params contains all 6 parameters
- [ ] Delivery agent name included
- [ ] Agent phone number provided
- [ ] Estimated time window specified
- [ ] Delivery address confirmed
- [ ] Urgent but friendly tone maintained
- [ ] Agent contact option emphasized

---

## Task 44: Create Delivered Template

### Overview

Create the Delivered template sent after successful package delivery. This template confirms completion of the order lifecycle, requests delivery confirmation details such as who received the package, invites customer feedback on the product and delivery experience, and may offer support for any delivery issues. This is the final transactional notification and transitions into potential marketing engagement (reviews, repeat purchases).

### Dependencies

- Task 43: Out for Delivery template created
- Complete order lifecycle template sequence established

### Instructions

1. **Define template identification**
   - Set template_name to "order_delivered"
   - Set language to "en"
   - Set template_type to "DELIVERED"
   - Set category to "TRANSACTIONAL"

2. **Define header parameters**
   - Set header_params to ["order_number"]
   - Simple celebratory header
   - Focus on successful completion

3. **Define body parameters**
   - Set body_params array with 5 parameters:
     - "customer_name" - Customer's first name
     - "order_number" - Order reference
     - "delivery_time" - Actual delivery timestamp
     - "receiver_name" - Name of person who received
     - "feedback_url" - Link to review/feedback form

4. **Write completion message**
   - Celebrate successful delivery
   - Confirm delivery details
   - Request feedback naturally
   - Thank customer for business
   - Offer support if issues

5. **Design celebratory header**
   - Format: "Order #{order_number} Delivered! ✅"
   - Use checkmark emoji for completion
   - Positive, achievement tone

6. **Structure body with feedback focus**
   - Confirm delivery completion
   - Show delivery time and receiver
   - Invite product review
   - Thank customer warmly
   - Offer problem resolution path

7. **Add engagement elements**
   - Include feedback/review link
   - Mention points or rewards for review (if applicable)
   - Suggest next actions (shop again)
   - Reinforce brand relationship

8. **Include support option**
   - Mention support for delivery issues
   - Provide contact method
   - Keep support offer subtle (not alarming)

### Delivered Template Structure

```
┌─────────────────────────────────────────────────────┐
│          Order Delivered Template                    │
└─────────────────────────────────────────────────────┘

Template Name: order_delivered
Language: en
Type: DELIVERED
Category: TRANSACTIONAL

┌─────────────────────────────────────────────────────┐
│ HEADER                                               │
├─────────────────────────────────────────────────────┤
│ Order #{order_number} Delivered! ✅                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ BODY                                                 │
├─────────────────────────────────────────────────────┤
│ Congratulations {customer_name}! 🎉                 │
│                                                      │
│ Your order #{order_number} has been successfully    │
│ delivered!                                           │
│                                                      │
│ Delivery Confirmation:                               │
│ • Delivered: {delivery_time}                        │
│ • Received by: {receiver_name}                      │
│                                                      │
│ We hope you love your purchase! Please take a       │
│ moment to share your experience:                     │
│ {feedback_url}                                       │
│                                                      │
│ Thank you for choosing LankaCommerce Cloud! 💙      │
│                                                      │
│ Any issues with your delivery? Reply here and       │
│ we'll help immediately.                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FOOTER                                               │
├─────────────────────────────────────────────────────┤
│ LankaCommerce Cloud                                  │
│ Shop again: www.lcc.lk                              │
└─────────────────────────────────────────────────────┘
```

### Delivery Confirmation Details

```
┌────────────────────────────────────────────────────┐
│        Delivery Confirmation Data                   │
└────────────────────────────────────────────────────┘

Data Captured:
├─> Delivery timestamp (from courier system)
├─> Receiver name (who signed/accepted)
├─> GPS coordinates (optional)
├─> Photo proof (optional)
└─> Agent signature (digital)

Used for:
├─> Customer confirmation
├─> Dispute resolution
├─> Delivery analytics
└─> Agent performance tracking
```

### Parameter Formats

| Parameter | Format | Example | Source |
|-----------|--------|---------|--------|
| customer_name | First name | Kasun, Nimal | Customer profile |
| order_number | #XXXXX | #12345 | Order ID |
| delivery_time | Date & Time | Feb 3, 2026 at 11:30 AM | Courier system |
| receiver_name | Full name | Kasun Perera, Self | Delivery agent input |
| feedback_url | Short URL | https://lcc.lk/review/12345 | Generated link |

### Feedback Request Strategy

```
┌────────────────────────────────────────────────────┐
│        Post-Delivery Engagement                     │
└────────────────────────────────────────────────────┘

Immediate (Delivery notification):
└─> Include feedback URL
    └─> Keep optional, not pushy

Follow-up (24 hours later):
└─> Separate feedback request message
    └─> If no review submitted

Incentivized (Optional):
└─> Offer loyalty points for review
    └─> "Earn 50 points for your review!"

Review Form Includes:
├─> Product rating (1-5 stars)
├─> Delivery rating (1-5 stars)
├─> Written review (optional)
├─> Photo upload (optional)
└─> Recommend to others? (Yes/No)
```

### Order Lifecycle Completion

```
┌────────────────────────────────────────────────────┐
│        Complete Order Journey                       │
└────────────────────────────────────────────────────┘

Day 0:  Order Confirmed ✓
        Payment Success ✓

Day 1-2: [Processing]

Day 2:  Shipped 📦

Day 3-5: [In Transit]

Day 5:  Out for Delivery 🚚

Day 5:  ► DELIVERED ✅ ◄ (Final notification)

Day 6:  [Feedback Request]

───────────────────────────────────────────────────
Total Notifications: 5-7 messages
Duration: 5-7 days (typical)
Customer Experience: Informed throughout
```

### Example Message

```
┌────────────────────────────────────────────────────┐
│  Customer Receives (Example)                       │
└────────────────────────────────────────────────────┘

From: LankaCommerce Cloud
Time: Today, 11:35 AM

Order #12345 Delivered! ✅

Congratulations Kasun! 🎉

Your order #12345 has been successfully delivered!

Delivery Confirmation:
• Delivered: Feb 3, 2026 at 11:30 AM
• Received by: Kasun Perera

We hope you love your purchase! Please take a moment 
to share your experience:
https://lcc.lk/review/12345

Thank you for choosing LankaCommerce Cloud! 💙

Any issues with your delivery? Reply here and we'll 
help immediately.

─────────────────────────────────────────────
LankaCommerce Cloud
Shop again: www.lcc.lk
```

### Expected Outcome

- Delivered template created with celebratory tone
- Delivery confirmation details included
- Feedback request integrated naturally
- Customer thanked for business
- Support path provided for issues
- Complete order lifecycle notification sequence finished

### Verification Checklist

- [ ] Template name set to "order_delivered"
- [ ] Language set to "en"
- [ ] template_type set to "DELIVERED"
- [ ] header_params contains ["order_number"]
- [ ] body_params contains all 5 parameters
- [ ] Celebratory, positive tone used
- [ ] Delivery time and receiver confirmed
- [ ] Feedback URL included
- [ ] Thank you message included
- [ ] Support option mentioned
- [ ] Encourages future engagement
- [ ] Completes order lifecycle sequence

---

## Summary

This document covered the creation of the MessageTemplate model foundation and the first six core order lifecycle templates. The model now supports multi-language templates with parameter substitution, approval tracking, and proper categorization. The six templates created (Order Confirmation, Payment Success, Payment Failed, Shipped, Out for Delivery, and Delivered) form the backbone of the order notification system and cover the entire customer journey from purchase to delivery completion.

All templates follow consistent structure, use appropriate parameters, maintain professional yet friendly tone, and are designed specifically for the Sri Lankan market with consideration for local courier services and customer communication preferences. These templates are ready for Meta approval submission and subsequent use in the WhatsApp Business API notification system.
