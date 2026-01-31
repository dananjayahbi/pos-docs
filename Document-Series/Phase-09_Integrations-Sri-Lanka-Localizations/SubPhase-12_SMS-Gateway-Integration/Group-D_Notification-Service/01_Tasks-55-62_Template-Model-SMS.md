# Tasks 55-62: Template Model and SMS Templates

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** D - Notification Service  
> **Document:** 01 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-C_OTP-System/02_Tasks-49-54_OTP-Service-View-Testing.md](../Group-C_OTP-System/02_Tasks-49-54_OTP-Service-View-Testing.md)
- **→ Next Document:** [02_Tasks-63-68_Service-Celery-Queue.md](02_Tasks-63-68_Service-Celery-Queue.md)

---

## Document Overview

This document covers the creation of the SMS template system for the LankaCommerce Cloud platform. It establishes the SMSTemplate model with multi-language support (English, Sinhala, Tamil) and creates predefined templates for the order lifecycle: order confirmation, shipping notification, delivery confirmation, and COD payment reminder.

The template system uses a placeholder-based approach for dynamic content insertion, ensuring consistent messaging across all customer touchpoints while maintaining localization flexibility for Sri Lankan customers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 55 | Create SMSTemplate Model | Medium | 30 min |
| 56 | Create template_name Field | Low | 10 min |
| 57 | Create template_text Field | Low | 15 min |
| 58 | Create language Field | Low | 15 min |
| 59 | Create Order Confirm SMS | Medium | 25 min |
| 60 | Create Shipped SMS | Medium | 25 min |
| 61 | Create Delivered SMS | Medium | 20 min |
| 62 | Create COD Reminder SMS | Medium | 25 min |

---

## SMS Template System Architecture

### Template Structure Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SMSTemplate Model                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  template_name (CharField, max=50)               │     │
│  │  - order_confirm                                 │     │
│  │  - order_shipped                                 │     │
│  │  - order_delivered                               │     │
│  │  - cod_reminder                                  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  template_text (TextField)                       │     │
│  │  - Contains placeholders: {variable_name}        │     │
│  │  - Dynamic content: {order_number}, {amount}     │     │
│  │  - Customer data: {customer_name}, {phone}       │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  language (CharField, choices)                   │     │
│  │  - en: English                                   │     │
│  │  - si: Sinhala (සිංහල)                          │     │
│  │  - ta: Tamil (தமிழ்)                             │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  + BaseModel fields (tenant, created, modified)            │
│  + Meta: unique_together = (template_name, language)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Language Flow Diagram

```
┌──────────────┐
│ Order Event  │
│  (Confirm,   │
│   Shipped,   │
│  Delivered,  │
│     COD)     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ Get Customer Language Pref   │
│ - From Tenant settings       │
│ - From Customer profile      │
│ - Default: en                │
└──────┬───────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│ Fetch Template (template_name + language)     │
├────────────────────────────────────────────────┤
│                                                │
│  Query: SMSTemplate.objects.get(              │
│      template_name='order_confirm',           │
│      language='si'                            │
│  )                                            │
│                                                │
└──────┬─────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────┐
│ Replace Placeholders                           │
├────────────────────────────────────────────────┤
│                                                │
│  template_text.format(                        │
│      order_number=order.number,               │
│      amount=order.total,                      │
│      customer_name=customer.name              │
│  )                                            │
│                                                │
└──────┬─────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Send SMS via Gateway         │
│ (Dialog Axiata)              │
└──────────────────────────────┘
```

### Placeholder System Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Available Placeholders                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ORDER-RELATED:                                         │
│  ┌───────────────────────────────────────────┐         │
│  │ {order_number}    Order ID (e.g., #12345) │         │
│  │ {amount}          Total amount (Rs. 5,000) │         │
│  │ {item_count}      Number of items (3)      │         │
│  │ {payment_method}  COD/Online               │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  CUSTOMER-RELATED:                                      │
│  ┌───────────────────────────────────────────┐         │
│  │ {customer_name}   Customer full name       │         │
│  │ {phone}           Phone number             │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  SHIPPING-RELATED:                                      │
│  ┌───────────────────────────────────────────┐         │
│  │ {courier}         Courier name (DHL, etc.) │         │
│  │ {tracking_number} Tracking code            │         │
│  │ {tracking_url}    Tracking link            │         │
│  │ {delivery_date}   Expected delivery date   │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
│  BRAND-RELATED:                                         │
│  ┌───────────────────────────────────────────┐         │
│  │ {store_name}      Tenant store name        │         │
│  │ {support_phone}   Support contact          │         │
│  │ {website}         Store URL                │         │
│  └───────────────────────────────────────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘

Example Template:
"Dear {customer_name}, your order {order_number} for Rs. {amount} 
has been confirmed. Thank you for shopping at {store_name}!"

After Replacement:
"Dear Kasun Perera, your order #12345 for Rs. 5,000 has been 
confirmed. Thank you for shopping at Fashion Store!"
```

---

## Task 55: Create SMSTemplate Model

### Overview
Create the SMSTemplate model as the foundation for the SMS notification system. This model stores reusable message templates with multi-language support, enabling consistent customer communication across the order lifecycle. The model extends BaseModel for tenant isolation and includes created/modified timestamps.

The SMSTemplate model serves as a content repository where marketing teams and administrators can manage SMS content without requiring code changes, supporting business agility and localization requirements.

### Dependencies
- Group-C Task 54: SMS Service Testing (completed)
- Phase-03 SubPhase-03: BaseModel implementation
- Phase-02: Multi-tenancy system (tenant field)
- Django ORM framework

### Instructions

1. **Navigate to the sms_gateway app models directory**
   - Go to `backend/apps/sms_gateway/models/` directory
   - Create or open `sms_template.py` file
   - This file will contain the SMSTemplate model

2. **Import required dependencies**
   - Import Django model fields (CharField, TextField, DateTimeField)
   - Import BaseModel from core app
   - Import gettext_lazy for translation support
   - Import timezone utilities for timestamp handling

3. **Define the SMSTemplate model class**
   - Create class named `SMSTemplate` inheriting from `BaseModel`
   - Include comprehensive docstring explaining model purpose
   - Document the multi-language support feature
   - Explain template_name usage and naming conventions

4. **Add model fields (details in Tasks 56-58)**
   - template_name: CharField for template identifier
   - template_text: TextField for message content with placeholders
   - language: CharField with choices for language selection
   - BaseModel provides: tenant, created_at, modified_at, is_active

5. **Configure Meta class**
   - Set verbose_name = "SMS Template"
   - Set verbose_name_plural = "SMS Templates"
   - Set db_table = "sms_template"
   - Define unique_together = [('template_name', 'language', 'tenant')]
   - Add ordering = ['template_name', 'language']
   - Add indexes for performance optimization

6. **Implement __str__ method**
   - Return readable string representation
   - Format: "{template_name} ({language})"
   - Example output: "order_confirm (en)"

7. **Add helper methods**
   - `render(context)`: Replace placeholders with actual values
   - `get_preview()`: Generate preview text with sample data
   - `validate_placeholders()`: Check template_text syntax
   - `clone_to_language(target_language)`: Create translation

8. **Register model in __init__.py**
   - Add SMSTemplate to `backend/apps/sms_gateway/models/__init__.py`
   - Ensure model is importable from sms_gateway.models

### SMSTemplate Model Purpose

| Feature | Benefit |
|---------|---------|
| Centralized Templates | Single source of truth for SMS content |
| Multi-Language | Support for en/si/ta markets |
| Placeholder System | Dynamic content insertion |
| Tenant Isolation | Each tenant has custom templates |
| Version Control | Track changes with timestamps |
| Reusability | Same template for multiple orders |

### Model Relationships Diagram

```
┌─────────────────────┐
│    BaseModel        │ (Abstract)
│  - tenant           │
│  - created_at       │
│  - modified_at      │
│  - is_active        │
└──────────┬──────────┘
           │ inherits
           ▼
┌─────────────────────┐
│   SMSTemplate       │
│  - template_name    │
│  - template_text    │
│  - language         │
└──────────┬──────────┘
           │ used by
           ▼
┌─────────────────────┐
│ SMSNotificationLog  │ (Task 63)
│  - template_used    │
│  - sent_text        │
└─────────────────────┘
```

### Database Schema

```sql
CREATE TABLE sms_template (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    template_name VARCHAR(50) NOT NULL,
    template_text TEXT NOT NULL,
    language VARCHAR(2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    UNIQUE (template_name, language, tenant_id)
);

CREATE INDEX idx_sms_template_name ON sms_template(template_name);
CREATE INDEX idx_sms_template_language ON sms_template(language);
CREATE INDEX idx_sms_template_tenant ON sms_template(tenant_id);
```

### Expected Outcome
- SMSTemplate model defined in `backend/apps/sms_gateway/models/sms_template.py`
- Model inherits from BaseModel with tenant isolation
- Meta class configured with unique constraints
- Helper methods for template rendering and validation
- Model registered and importable

### Verification Checklist
- [ ] SMSTemplate class created in sms_template.py
- [ ] Model extends BaseModel
- [ ] Meta class includes unique_together constraint
- [ ] __str__ method returns readable format
- [ ] render() method signature defined
- [ ] Model registered in __init__.py
- [ ] Import statement works: `from sms_gateway.models import SMSTemplate`

---

## Task 56: Create template_name Field

### Overview
Create the template_name field as the primary identifier for SMS templates. This field uses a standardized naming convention (snake_case) to uniquely identify each template type. Values like "order_confirm", "order_shipped", "order_delivered", and "cod_reminder" provide clear, programmatic references for the notification service.

The template_name acts as a lookup key when the system needs to send a specific type of SMS, enabling developers to reference templates by name rather than database IDs.

### Dependencies
- Task 55: Create SMSTemplate Model
- Django CharField implementation
- Understanding of naming conventions

### Instructions

1. **Add template_name field to SMSTemplate model**
   - Location: Within the SMSTemplate class definition
   - Field type: CharField
   - Position: First field after class declaration

2. **Configure field parameters**
   - max_length = 50
   - blank = False (required field)
   - null = False
   - db_index = True (for query performance)
   - help_text = "Unique identifier for template type (e.g., order_confirm, order_shipped)"

3. **Add validation constraints**
   - Use validators.RegexValidator
   - Pattern: r'^[a-z][a-z0-9_]*$' (lowercase, underscores, numbers)
   - Enforce snake_case naming convention
   - Prevent spaces and special characters

4. **Document standard template names**
   - Add comment block listing predefined template names
   - order_confirm: Order confirmation message
   - order_shipped: Shipping notification
   - order_delivered: Delivery confirmation
   - cod_reminder: Cash on delivery payment reminder
   - order_cancelled: Order cancellation notice
   - refund_processed: Refund confirmation

5. **Add field-level validation method**
   - Create clean_template_name() method if needed
   - Convert to lowercase automatically
   - Strip whitespace
   - Validate format

6. **Consider future extensibility**
   - Document that new template types can be added
   - Maintain naming convention documentation
   - Reserve common names for system use

### Template Name Convention

| Convention | Example | Valid | Invalid |
|------------|---------|-------|---------|
| Snake Case | order_confirm | ✓ | OrderConfirm |
| Lowercase | shipped_notify | ✓ | ShippedNotify |
| Descriptive | cod_reminder | ✓ | cr |
| No Spaces | order_ready | ✓ | order ready |
| No Special | delivery_update | ✓ | delivery-update |

### Standard Template Names Reference

```
┌────────────────────────────────────────────────────────────┐
│           Standard Template Names Registry                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ORDER LIFECYCLE:                                          │
│  ├─ order_confirm        (Order placed successfully)       │
│  ├─ order_processing     (Order being prepared)            │
│  ├─ order_ready          (Ready for pickup/dispatch)       │
│  ├─ order_shipped        (Shipped with courier)            │
│  ├─ order_out_delivery   (Out for delivery)                │
│  ├─ order_delivered      (Successfully delivered)          │
│  ├─ order_cancelled      (Order cancelled)                 │
│  └─ order_failed         (Order processing failed)         │
│                                                            │
│  PAYMENT RELATED:                                          │
│  ├─ payment_received     (Payment confirmed)               │
│  ├─ payment_pending      (Awaiting payment)                │
│  ├─ cod_reminder         (COD payment reminder)            │
│  ├─ refund_initiated     (Refund started)                  │
│  └─ refund_processed     (Refund completed)                │
│                                                            │
│  CUSTOMER SUPPORT:                                         │
│  ├─ support_ticket       (Ticket created)                  │
│  ├─ support_reply        (Support team replied)            │
│  └─ support_resolved     (Ticket resolved)                 │
│                                                            │
│  PROMOTIONAL:                                              │
│  ├─ promo_new            (New promotion alert)             │
│  ├─ promo_reminder       (Sale ending soon)                │
│  └─ abandoned_cart       (Cart reminder)                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Field Validation Example

```
Valid template_name values:
✓ "order_confirm"
✓ "order_shipped"
✓ "cod_reminder"
✓ "order_delivered_2"

Invalid template_name values:
✗ "Order Confirm"        (uppercase, space)
✗ "order-shipped"        (hyphen instead of underscore)
✗ "OrderConfirm"         (camelCase)
✗ "order confirm"        (space)
✗ "order.shipped"        (dot character)
✗ ""                     (empty)
✗ "a"                    (too short, not descriptive)
```

### Expected Outcome
- template_name field added to SMSTemplate model
- Field enforces snake_case naming convention
- Database index created for performance
- Validation prevents invalid naming formats
- Documentation of standard template names

### Verification Checklist
- [ ] template_name field defined with max_length=50
- [ ] db_index=True for query optimization
- [ ] RegexValidator enforces snake_case format
- [ ] help_text provides clear usage guidance
- [ ] Field is required (blank=False, null=False)
- [ ] Comment block documents standard template names
- [ ] Validation rejects uppercase and special characters

---

## Task 57: Create template_text Field

### Overview
Create the template_text field to store the actual SMS message content with placeholder support. This TextField holds the message template with curly-brace placeholders like {order_number}, {amount}, and {customer_name} that will be dynamically replaced with real data when sending SMS messages.

The placeholder system provides flexibility for personalized messages while maintaining template consistency. The field supports multi-line text for longer messages and includes validation to ensure proper placeholder syntax.

### Dependencies
- Task 55: Create SMSTemplate Model
- Task 56: Create template_name Field
- Django TextField implementation
- Python string formatting (.format() method)

### Instructions

1. **Add template_text field to SMSTemplate model**
   - Field type: TextField (no max_length limit)
   - Position: After template_name field
   - Allows multi-line content

2. **Configure field parameters**
   - blank = False (required field)
   - null = False
   - help_text = "Message template with placeholders. Use {variable_name} format."

3. **Document placeholder syntax**
   - Add comprehensive docstring
   - Explain curly-brace format: {placeholder_name}
   - List common placeholders (see diagram above)
   - Provide example templates

4. **Add character count considerations**
   - Document SMS length limits (160 chars per segment)
   - Note: English = 160 chars, Unicode (Sinhala/Tamil) = 70 chars
   - Recommend templates under 160 characters
   - Warn about multi-part SMS costs

5. **Implement placeholder validation**
   - Create validate_placeholders() method
   - Check for balanced curly braces
   - Verify placeholder names are valid Python identifiers
   - Detect common syntax errors

6. **Create render method**
   - Method signature: `render(self, context: dict) -> str`
   - Use Python .format() for placeholder replacement
   - Handle missing keys gracefully
   - Return rendered message string

7. **Add preview functionality**
   - Create get_preview() method
   - Provide sample data for all placeholders
   - Generate realistic preview text
   - Useful for admin interface testing

8. **Handle special characters**
   - Document Unicode support for Sinhala and Tamil
   - Test emoji compatibility (may count as multiple chars)
   - Consider GSM 7-bit character set for English

### Placeholder Format Guidelines

| Format | Example | Purpose |
|--------|---------|---------|
| Simple | {amount} | Replace with single value |
| Descriptive | {customer_name} | Clear variable meaning |
| Snake Case | {tracking_number} | Consistent naming |
| No Spaces | {order_number} | Valid Python identifier |
| No Special | {item_count} | Alphanumeric + underscore |

### SMS Length Calculation

```
┌────────────────────────────────────────────────────────────┐
│              SMS Character Limits                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  STANDARD GSM (English):                                   │
│  ┌──────────────────────────────────────────┐             │
│  │ Single SMS:  160 characters              │             │
│  │ 2-part SMS:  306 characters (153 x 2)    │             │
│  │ 3-part SMS:  459 characters (153 x 3)    │             │
│  └──────────────────────────────────────────┘             │
│                                                            │
│  UNICODE (Sinhala/Tamil):                                  │
│  ┌──────────────────────────────────────────┐             │
│  │ Single SMS:  70 characters               │             │
│  │ 2-part SMS:  134 characters (67 x 2)     │             │
│  │ 3-part SMS:  201 characters (67 x 3)     │             │
│  └──────────────────────────────────────────┘             │
│                                                            │
│  COST CONSIDERATION:                                       │
│  - Each SMS segment = 1 credit                            │
│  - 2-part SMS = 2 credits                                 │
│  - Keep templates concise to minimize costs               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Template Text Examples

```python
# Order Confirmation (English)
"Dear {customer_name}, your order {order_number} for Rs. {amount} 
has been confirmed. We'll notify you when shipped. 
Thank you - {store_name}"

# Order Shipped (Sinhala)
"ආදරණීය {customer_name}, ඔබගේ {order_number} ඇණවුම {courier} 
ආයතනය හරහා යවා ඇත. ට්‍රැකිං: {tracking_number}"

# Delivered (Tamil)
"அன்பான {customer_name}, உங்கள் ஆர்டர் {order_number} 
வெற்றிகரமாக டெலிவரி செய்யப்பட்டது. நன்றி!"

# COD Reminder (English)
"Hi {customer_name}, your order {order_number} (Rs. {amount}) 
will be delivered today. Please keep cash ready. COD: Rs. {cod_amount}"
```

### Placeholder Rendering Flow

```
┌─────────────────────────┐
│ Template Text           │
│ "Order {order_number}   │
│  for Rs. {amount}"      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Context Dictionary      │
│ {                       │
│   'order_number': #123  │
│   'amount': '5,000'     │
│ }                       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ render(context)         │
│ template_text.format(   │
│   **context             │
│ )                       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Rendered Message        │
│ "Order #123 for         │
│  Rs. 5,000"             │
└─────────────────────────┘
```

### Expected Outcome
- template_text TextField added to SMSTemplate model
- Field supports multi-line content with placeholders
- render() method replaces placeholders with actual values
- validate_placeholders() checks template syntax
- get_preview() generates sample message
- Documentation of character limits and placeholder usage

### Verification Checklist
- [ ] template_text field defined as TextField
- [ ] Field is required (blank=False, null=False)
- [ ] help_text explains placeholder format
- [ ] render(context) method implemented
- [ ] validate_placeholders() method created
- [ ] get_preview() method returns sample message
- [ ] Character limit guidelines documented
- [ ] Example templates provided in docstring

---

## Task 58: Create language Field

### Overview
Create the language field to support multi-language SMS templates for Sri Lankan customers. This CharField with predefined choices enables the system to store and retrieve templates in English (en), Sinhala (si), and Tamil (ta), ensuring customers receive messages in their preferred language.

The language field works in conjunction with template_name to ensure unique templates per language, supporting the diverse linguistic landscape of Sri Lanka's eCommerce market.

### Dependencies
- Task 55: Create SMSTemplate Model
- Task 56: Create template_name Field
- Task 57: Create template_text Field
- Django CharField with choices

### Instructions

1. **Define language choices constant**
   - Create LANGUAGE_CHOICES tuple at class level
   - Position: Before field definitions in SMSTemplate model
   - Use ISO 639-1 two-letter codes

2. **Configure language choice options**
   - Format: (('en', 'English'), ('si', 'Sinhala (සිංහල)'), ('ta', 'Tamil (தமிழ்)'))
   - Include native script names for clarity
   - Order by usage frequency (en, si, ta)

3. **Add language field to model**
   - Field type: CharField
   - max_length = 2 (ISO 639-1 standard)
   - choices = LANGUAGE_CHOICES
   - default = 'en'

4. **Configure field parameters**
   - blank = False (required)
   - null = False
   - db_index = True (for filtering by language)
   - help_text = "Language for this template version"

5. **Update unique_together constraint**
   - In Meta class, ensure: unique_together = [('template_name', 'language', 'tenant')]
   - This prevents duplicate templates for same name+language+tenant
   - Allows same template_name with different languages

6. **Add language helper methods**
   - `get_language_display()`: Django built-in, returns "English", "Sinhala", etc.
   - `get_all_translations()`: Classmethod to fetch all language versions
   - `has_translation(lang_code)`: Check if translation exists

7. **Create default template creation logic**
   - Plan data migration to create default templates
   - Start with English templates
   - Mark Sinhala/Tamil as needing translation
   - Document translation workflow

8. **Consider language fallback logic**
   - If requested language not found, fallback to English
   - Document fallback behavior in service layer (Task 63)
   - Log missing translations for admin attention

### Language Support Matrix

| Language | Code | Script | Character Limit | Market Share (SL) |
|----------|------|--------|-----------------|-------------------|
| English | en | Latin | 160 chars | 85% (business) |
| Sinhala | si | සිංහල | 70 chars | 75% (local) |
| Tamil | ta | தமிழ் | 70 chars | 20% (north/east) |

### Multi-Language Template Structure

```
┌─────────────────────────────────────────────────────────────┐
│         Template: "order_confirm" (3 languages)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────┐        │
│  │ English (en) - DEFAULT                         │        │
│  │ template_name: "order_confirm"                 │        │
│  │ language: "en"                                 │        │
│  │ template_text: "Dear {customer_name}, your     │        │
│  │   order {order_number} for Rs. {amount} has    │        │
│  │   been confirmed. Thank you!"                  │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  ┌────────────────────────────────────────────────┐        │
│  │ Sinhala (si)                                   │        │
│  │ template_name: "order_confirm"                 │        │
│  │ language: "si"                                 │        │
│  │ template_text: "ආදරණීය {customer_name},        │        │
│  │   ඔබගේ {order_number} ඇණවුම රු. {amount}       │        │
│  │   සඳහා තහවුරු කර ඇත. ස්තූතියි!"              │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
│  ┌────────────────────────────────────────────────┐        │
│  │ Tamil (ta)                                     │        │
│  │ template_name: "order_confirm"                 │        │
│  │ language: "ta"                                 │        │
│  │ template_text: "அன்பான {customer_name},        │        │
│  │   உங்கள் ஆர்டர் {order_number} ரூ. {amount}    │        │
│  │   உறுதிப்படுத்தப்பட்டது. நன்றி!"              │        │
│  └────────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Language Selection Flow

```
┌──────────────────────┐
│ Order Created Event  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Determine Customer Language      │
├──────────────────────────────────┤
│ 1. Customer.language_preference  │
│ 2. Tenant.default_language       │
│ 3. Fallback to 'en'              │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Fetch Template                   │
│ SMSTemplate.objects.get(         │
│   template_name='order_confirm', │
│   language='si',                 │
│   tenant=tenant                  │
│ )                                │
└──────────┬───────────────────────┘
           │
           ├─── Found: Use template
           │
           └─── Not Found:
                ▼
           ┌──────────────────────┐
           │ Fallback to English  │
           │ language='en'        │
           └──────────────────────┘
```

### Database Records Example

```
+--------------------------------------+------------------+----------+--------+
| id                                   | template_name    | language | tenant |
+--------------------------------------+------------------+----------+--------+
| 550e8400-e29b-41d4-a716-446655440001 | order_confirm    | en       | T1     |
| 550e8400-e29b-41d4-a716-446655440002 | order_confirm    | si       | T1     |
| 550e8400-e29b-41d4-a716-446655440003 | order_confirm    | ta       | T1     |
| 550e8400-e29b-41d4-a716-446655440004 | order_shipped    | en       | T1     |
| 550e8400-e29b-41d4-a716-446655440005 | order_shipped    | si       | T1     |
| 550e8400-e29b-41d4-a716-446655440006 | order_shipped    | ta       | T1     |
+--------------------------------------+------------------+----------+--------+

Unique Constraint: (template_name, language, tenant) ensures no duplicates
```

### Expected Outcome
- language field added with three choices (en, si, ta)
- Default language set to English (en)
- unique_together constraint includes language
- Helper methods for translation management
- Fallback logic documented for missing translations
- Database indexed for language filtering

### Verification Checklist
- [ ] LANGUAGE_CHOICES constant defined with three options
- [ ] language field uses choices parameter
- [ ] max_length=2 (ISO 639-1 standard)
- [ ] default='en' configured
- [ ] db_index=True for performance
- [ ] unique_together includes (template_name, language, tenant)
- [ ] get_language_display() works correctly
- [ ] Native language names included in choices

---

## Task 59: Create Order Confirm SMS

### Overview
Create the order confirmation SMS template in all three languages (English, Sinhala, Tamil). This template is sent immediately after a customer successfully places an order, confirming receipt of the order and providing essential details like order number, amount, and expected next steps.

This is the first touchpoint in the order lifecycle SMS journey and sets customer expectations. The message should be concise, professional, and reassuring.

### Dependencies
- Task 55: Create SMSTemplate Model
- Task 56: Create template_name Field
- Task 57: Create template_text Field
- Task 58: Create language Field
- Database migration applied

### Instructions

1. **Create English version (en)**
   - template_name: "order_confirm"
   - language: "en"
   - Craft professional, concise message
   - Include key placeholders: {customer_name}, {order_number}, {amount}, {store_name}

2. **Design message structure**
   - Opening: Personalized greeting
   - Body: Order confirmation with order number and amount
   - Closing: Next steps (shipping notification) and thank you
   - Keep under 160 characters if possible

3. **Create Sinhala version (si)**
   - template_name: "order_confirm"
   - language: "si"
   - Translate English version to Sinhala (සිංහල)
   - Maintain cultural appropriateness
   - Use same placeholders in Sinhala context
   - Keep under 70 characters (Unicode limit)

4. **Create Tamil version (ta)**
   - template_name: "order_confirm"
   - language: "ta"
   - Translate English version to Tamil (தமிழ்)
   - Maintain formal yet friendly tone
   - Use same placeholders
   - Keep under 70 characters (Unicode limit)

5. **Create data migration or management command**
   - Create script to insert default templates
   - Use Django data migration or custom management command
   - Apply to all existing tenants
   - Mark as system templates (is_system=True if field exists)

6. **Test placeholder rendering**
   - Create sample context data
   - Test render() method with each language version
   - Verify placeholders replaced correctly
   - Check character counts

7. **Document usage in notification service**
   - When to trigger: After order.status = 'confirmed'
   - Which service method: send_order_sms('order_confirm', order, customer)
   - Expected delivery time: Within 1 minute

8. **Create admin preview interface**
   - Allow admins to preview templates
   - Show sample data rendering
   - Display character count
   - Enable inline editing

### Order Confirmation Template Content

```
┌─────────────────────────────────────────────────────────────┐
│                 English Version (en)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_confirm                               │
│  language: en                                               │
│  template_text:                                             │
│                                                             │
│  "Dear {customer_name}, your order {order_number} for       │
│   Rs. {amount} has been confirmed. We'll notify you when    │
│   shipped. Thank you for shopping at {store_name}!"         │
│                                                             │
│  Character count: ~145 characters (fits in single SMS)      │
│                                                             │
│  Placeholders:                                              │
│  - {customer_name}: Customer's first name or full name      │
│  - {order_number}: Order ID with # prefix                   │
│  - {amount}: Formatted amount with thousands separator      │
│  - {store_name}: Tenant store name                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Sinhala Version (සිංහල) (si)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_confirm                               │
│  language: si                                               │
│  template_text:                                             │
│                                                             │
│  "ආදරණීය {customer_name}, ඔබගේ {order_number} ඇණවුම       │
│   රු. {amount} සඳහා තහවුරු කර ඇත. යවන විට දැනුම් දෙමු.      │
│   {store_name} - ස්තූතියි!"                                │
│                                                             │
│  Character count: ~120 characters (fits in 2 SMS segments)  │
│                                                             │
│  Placeholders: Same as English                              │
│                                                             │
│  Translation Notes:                                         │
│  - "Dear" = "ආදරණීය" (formal greeting)                     │
│  - "confirmed" = "තහවුරු කර ඇත"                             │
│  - "Thank you" = "ස්තූතියි"                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Tamil Version (தமிழ்) (ta)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_confirm                               │
│  language: ta                                               │
│  template_text:                                             │
│                                                             │
│  "அன்பான {customer_name}, உங்கள் ஆர்டர் {order_number}      │
│   ரூ. {amount} உறுதிப்படுத்தப்பட்டது. அனுப்பும்போது          │
│   தெரிவிப்போம். {store_name} - நன்றி!"                      │
│                                                             │
│  Character count: ~115 characters (fits in 2 SMS segments)  │
│                                                             │
│  Placeholders: Same as English                              │
│                                                             │
│  Translation Notes:                                         │
│  - "Dear" = "அன்பான" (affectionate greeting)                │
│  - "confirmed" = "உறுதிப்படுத்தப்பட்டது"                    │
│  - "Thank you" = "நன்றி"                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sample Rendered Messages

```
English Example:
───────────────
"Dear Kasun Perera, your order #12345 for Rs. 5,000 has been 
confirmed. We'll notify you when shipped. Thank you for shopping 
at Fashion Store!"

Sinhala Example:
───────────────
"ආදරණීය කසුන් පෙරේරා, ඔබගේ #12345 ඇණවුම රු. 5,000 සඳහා 
තහවුරු කර ඇත. යවන විට දැනුම් දෙමු. Fashion Store - ස්තූතියි!"

Tamil Example:
──────────────
"அன்பான கசுன் பெரேரா, உங்கள் ஆர்டர் #12345 ரூ. 5,000 
உறுதிப்படுத்தப்பட்டது. அனுப்பும்போது தெரிவிப்போம். 
Fashion Store - நன்றி!"
```

### Data Migration Script Structure

```python
# Migration: Create default order_confirm templates

def create_order_confirm_templates(apps, schema_editor):
    SMSTemplate = apps.get_model('sms_gateway', 'SMSTemplate')
    Tenant = apps.get_model('tenants', 'Tenant')
    
    templates = [
        {
            'template_name': 'order_confirm',
            'language': 'en',
            'template_text': 'Dear {customer_name}, your order...'
        },
        {
            'template_name': 'order_confirm',
            'language': 'si',
            'template_text': 'ආදරණීය {customer_name}...'
        },
        {
            'template_name': 'order_confirm',
            'language': 'ta',
            'template_text': 'அன்பான {customer_name}...'
        }
    ]
    
    for tenant in Tenant.objects.filter(is_active=True):
        for template_data in templates:
            SMSTemplate.objects.create(
                tenant=tenant,
                **template_data
            )
```

### Expected Outcome
- Three order_confirm templates created (en, si, ta)
- Templates stored in database for all tenants
- Character counts optimized for SMS limits
- Placeholders properly formatted
- Data migration or management command ready
- Admin interface can preview templates

### Verification Checklist
- [ ] English template created with template_name='order_confirm', language='en'
- [ ] Sinhala template created with language='si'
- [ ] Tamil template created with language='ta'
- [ ] All templates use same placeholder names
- [ ] Character counts documented
- [ ] Data migration script written
- [ ] Templates applied to at least one test tenant
- [ ] render() method successfully replaces placeholders
- [ ] Preview shows correct formatting

---

## Task 60: Create Shipped SMS

### Overview
Create the shipping notification SMS template in all three languages. This template is sent when an order status changes to 'shipped', informing customers that their package is on the way. It includes courier information, tracking number, and tracking URL for customer convenience.

This message is crucial for setting delivery expectations and reducing "where is my order?" support inquiries.

### Dependencies
- Task 59: Create Order Confirm SMS
- Courier integration system (for courier name and tracking data)
- URL shortening service (for tracking_url)

### Instructions

1. **Create English version (en)**
   - template_name: "order_shipped"
   - language: "en"
   - Include placeholders: {customer_name}, {order_number}, {courier}, {tracking_number}, {tracking_url}

2. **Design message structure**
   - Opening: Positive announcement (shipped!)
   - Body: Courier and tracking details
   - Closing: Tracking link and expected delivery timeframe
   - Keep informative but concise

3. **Create Sinhala version (si)**
   - template_name: "order_shipped"
   - language: "si"
   - Translate with cultural appropriateness
   - Include same tracking placeholders

4. **Create Tamil version (ta)**
   - template_name: "order_shipped"
   - language: "ta"
   - Maintain formal yet friendly tone

5. **Handle tracking URL length**
   - Use URL shortener (bit.ly, yourstore.lk/t/{code})
   - Keep SMS under character limits
   - Test URL accessibility

6. **Add delivery time estimate**
   - Optional placeholder: {delivery_estimate}
   - Example: "2-3 business days"
   - Based on courier and delivery zone

7. **Create data migration**
   - Add to existing migration or create new one
   - Apply to all tenants
   - Test with sample courier data

### Shipped SMS Template Content

```
┌─────────────────────────────────────────────────────────────┐
│                 English Version (en)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_shipped                               │
│  language: en                                               │
│  template_text:                                             │
│                                                             │
│  "Great news {customer_name}! Your order {order_number}     │
│   has been shipped via {courier}. Track your package:       │
│   {tracking_url} - Delivery in 2-3 days. {store_name}"      │
│                                                             │
│  Character count: ~150 characters                           │
│                                                             │
│  Placeholders:                                              │
│  - {customer_name}: Customer first name                     │
│  - {order_number}: Order ID                                 │
│  - {courier}: Courier name (DHL, Aramex, Pronto)            │
│  - {tracking_number}: Tracking code (optional in SMS)       │
│  - {tracking_url}: Shortened tracking link                  │
│  - {store_name}: Store name                                 │
│                                                             │
│  URL Shortening:                                            │
│  - Long: https://track.dhl.com/tracking/12345678901234      │
│  - Short: https://yourstore.lk/t/ab12cd                     │
│  - Saves ~40 characters                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Sinhala Version (සිංහල) (si)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_shipped                               │
│  language: si                                               │
│  template_text:                                             │
│                                                             │
│  "සුභ පුවතක් {customer_name}! ඔබගේ {order_number} ඇණවුම    │
│   {courier} හරහා යවා ඇත. ට්‍රැක් කරන්න: {tracking_url}      │
│   දින 2-3 කින් ලැබෙයි. {store_name}"                        │
│                                                             │
│  Character count: ~135 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "Great news" = "සුභ පුවතක්"                              │
│  - "shipped" = "යවා ඇත"                                     │
│  - "Track" = "ට්‍රැක් කරන්න"                                 │
│  - "Delivery in 2-3 days" = "දින 2-3 කින් ලැබෙයි"          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Tamil Version (தமிழ்) (ta)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_shipped                               │
│  language: ta                                               │
│  template_text:                                             │
│                                                             │
│  "நல்ல செய்தி {customer_name}! உங்கள் ஆர்டர்                │
│   {order_number} {courier} மூலம் அனுப்பப்பட்டது.             │
│   கண்காணிக்க: {tracking_url} 2-3 நாட்களில் டெலிவரி.        │
│   {store_name}"                                             │
│                                                             │
│  Character count: ~140 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "Great news" = "நல்ல செய்தி"                            │
│  - "shipped" = "அனுப்பப்பட்டது"                             │
│  - "Track" = "கண்காணிக்க"                                   │
│  - "Delivery in 2-3 days" = "2-3 நாட்களில் டெலிவரி"       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tracking URL Implementation

```
┌────────────────────────────────────────────────────────────┐
│              Tracking URL Strategy                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  OPTION 1: Direct Courier Link (Long)                     │
│  https://track.dhl.com/tracking/1234567890123456           │
│  - Pros: Direct to courier site                           │
│  - Cons: Very long URL (40-60 chars)                      │
│                                                            │
│  OPTION 2: Custom Short Link (Recommended)                │
│  https://yourstore.lk/t/ab12cd                             │
│  - Pros: Short (25-30 chars), branded                     │
│  - Cons: Requires redirect service                        │
│                                                            │
│  OPTION 3: Bit.ly / URL Shortener                         │
│  https://bit.ly/3xyz123                                    │
│  - Pros: Very short (20 chars)                            │
│  - Cons: Third-party dependency, not branded              │
│                                                            │
│  IMPLEMENTATION:                                           │
│  1. Create TrackingLink model with short_code             │
│  2. Generate unique 6-char code (base62)                  │
│  3. Store mapping: short_code -> full_tracking_url        │
│  4. Create view: /t/{short_code} redirects to courier     │
│  5. Use in SMS: {tracking_url} = https://store.lk/t/xyz   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Sample Rendered Messages

```
English Example:
───────────────
"Great news Kasun Perera! Your order #12345 has been shipped 
via DHL. Track your package: https://yourstore.lk/t/ab12cd - 
Delivery in 2-3 days. Fashion Store"

Sinhala Example:
───────────────
"සුභ පුවතක් කසුන් පෙරේරා! ඔබගේ #12345 ඇණවුම DHL හරහා 
යවා ඇත. ට්‍රැක් කරන්න: https://yourstore.lk/t/ab12cd 
දින 2-3 කින් ලැබෙයි. Fashion Store"

Tamil Example:
──────────────
"நல்ல செய்தி கசுன் பெரேரா! உங்கள் ஆர்டர் #12345 DHL மூலம் 
அனுப்பப்பட்டது. கண்காணிக்க: https://yourstore.lk/t/ab12cd 
2-3 நாட்களில் டெலிவரி. Fashion Store"
```

### Expected Outcome
- Three order_shipped templates created (en, si, ta)
- Tracking URL placeholder included
- URL shortening strategy documented
- Templates optimized for SMS length
- Data migration prepared

### Verification Checklist
- [ ] English template created with template_name='order_shipped', language='en'
- [ ] Sinhala template created with language='si'
- [ ] Tamil template created with language='ta'
- [ ] {tracking_url} placeholder included
- [ ] {courier} placeholder for courier name
- [ ] Character counts within SMS limits
- [ ] Data migration script includes all three languages
- [ ] URL shortening service planned or implemented

---

## Task 61: Create Delivered SMS

### Overview
Create the delivery confirmation SMS template in all three languages. This template is sent when the order status changes to 'delivered', confirming successful delivery and thanking the customer. It's a positive touchpoint that closes the order lifecycle loop and encourages future purchases.

This message should be warm, appreciative, and can include subtle prompts for feedback or future shopping.

### Dependencies
- Task 60: Create Shipped SMS
- Order delivery confirmation system
- Optional: Review/feedback link system

### Instructions

1. **Create English version (en)**
   - template_name: "order_delivered"
   - language: "en"
   - Include placeholders: {customer_name}, {order_number}
   - Optional: {review_link} for product review

2. **Design message structure**
   - Opening: Delivery confirmation
   - Body: Thank you message
   - Closing: Invitation for feedback or future shopping
   - Keep positive and brief

3. **Create Sinhala version (si)**
   - template_name: "order_delivered"
   - language: "si"
   - Culturally appropriate thank you message

4. **Create Tamil version (ta)**
   - template_name: "order_delivered"
   - language: "ta"
   - Warm, appreciative tone

5. **Consider additional elements**
   - Customer satisfaction survey link (optional)
   - Discount code for next purchase (optional)
   - Social media follow request (optional)
   - Keep core message simple

6. **Create data migration**
   - Add to templates migration
   - Apply to all tenants

### Delivered SMS Template Content

```
┌─────────────────────────────────────────────────────────────┐
│                 English Version (en)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_delivered                             │
│  language: en                                               │
│  template_text:                                             │
│                                                             │
│  "Your order {order_number} has been delivered              │
│   successfully! Thank you for shopping with {store_name},   │
│   {customer_name}. We hope to serve you again soon! 😊"     │
│                                                             │
│  Character count: ~135 characters                           │
│                                                             │
│  Placeholders:                                              │
│  - {customer_name}: Customer first name                     │
│  - {order_number}: Order ID                                 │
│  - {store_name}: Store name                                 │
│                                                             │
│  Emoji Note:                                                │
│  - 😊 counts as 2-4 characters in SMS encoding              │
│  - Optional: Remove emoji to reduce length                  │
│                                                             │
│  Alternative with Review Link:                              │
│  "Order {order_number} delivered! Thank you {customer_name} │
│   for shopping at {store_name}. Rate your experience:       │
│   {review_link}"                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Sinhala Version (සිංහල) (si)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_delivered                             │
│  language: si                                               │
│  template_text:                                             │
│                                                             │
│  "ඔබගේ {order_number} ඇණවුම සාර්ථකව ලබා දී ඇත!             │
│   {store_name} හි සාප්පු සවාරිය ගැන ස්තූතියි                │
│   {customer_name}. නැවත සාදරයෙන් පිළිගනිමු!"                │
│                                                             │
│  Character count: ~120 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "delivered successfully" = "සාර්ථකව ලබා දී ඇත"          │
│  - "Thank you for shopping" = "සාප්පු සවාරිය ගැන ස්තූතියි"  │
│  - "We hope to serve you again" = "නැවත සාදරයෙන් පිළිගනිමු" │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Tamil Version (தமிழ்) (ta)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: order_delivered                             │
│  language: ta                                               │
│  template_text:                                             │
│                                                             │
│  "உங்கள் ஆர்டர் {order_number} வெற்றிகரமாக                 │
│   டெலிவரி செய்யப்பட்டது! {store_name} இல்                 │
│   ஷாப்பிங் செய்ததற்கு நன்றி {customer_name}.               │
│   மீண்டும் வரவேற்கிறோம்!"                                  │
│                                                             │
│  Character count: ~125 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "delivered successfully" = "வெற்றிகரமாக டெலிவரி"        │
│  - "Thank you for shopping" = "ஷாப்பிங் செய்ததற்கு நன்றி"   │
│  - "We hope to serve you again" = "மீண்டும் வரவேற்கிறோம்"  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sample Rendered Messages

```
English Example:
───────────────
"Your order #12345 has been delivered successfully! Thank you 
for shopping with Fashion Store, Kasun Perera. We hope to serve 
you again soon! 😊"

Sinhala Example:
───────────────
"ඔබගේ #12345 ඇණවුම සාර්ථකව ලබා දී ඇත! Fashion Store හි 
සාප්පු සවාරිය ගැන ස්තූතියි කසුන් පෙරේරා. 
නැවත සාදරයෙන් පිළිගනිමු!"

Tamil Example:
──────────────
"உங்கள் ஆர்டர் #12345 வெற்றிகரமாக டெலிவரி செய்யப்பட்டது! 
Fashion Store இல் ஷாப்பிங் செய்ததற்கு நன்றி கசுன் பெரேரா. 
மீண்டும் வரவேற்கிறோம்!"
```

### Expected Outcome
- Three order_delivered templates created (en, si, ta)
- Positive, appreciative messaging
- Optional review/feedback link support
- Templates optimized for brevity

### Verification Checklist
- [ ] English template created with template_name='order_delivered', language='en'
- [ ] Sinhala template created with language='si'
- [ ] Tamil template created with language='ta'
- [ ] Thank you message included
- [ ] Character counts within SMS limits
- [ ] Emoji handling considered
- [ ] Data migration includes all three languages

---

## Task 62: Create COD Reminder SMS

### Overview
Create the Cash on Delivery (COD) reminder SMS template in all three languages. This template is sent before delivery to remind customers to keep the cash amount ready for payment. It's crucial for COD orders to reduce delivery failures and ensure smooth handover.

This message should clearly state the COD amount, remind about exact change if possible, and confirm delivery timing.

### Dependencies
- Task 61: Create Delivered SMS
- COD payment system
- Order delivery scheduling system

### Instructions

1. **Create English version (en)**
   - template_name: "cod_reminder"
   - language: "en"
   - Include placeholders: {customer_name}, {order_number}, {cod_amount}, {delivery_time}

2. **Design message structure**
   - Opening: Friendly reminder
   - Body: COD amount to keep ready
   - Details: Delivery timing
   - Closing: Contact info for issues

3. **Emphasize COD amount**
   - Make amount highly visible
   - Suggest exact change if possible
   - Mention accepted denominations (optional)

4. **Create Sinhala version (si)**
   - template_name: "cod_reminder"
   - language: "si"
   - Clear COD instructions in Sinhala

5. **Create Tamil version (ta)**
   - template_name: "cod_reminder"
   - language: "ta"
   - Emphasize cash preparation

6. **Add delivery timing**
   - Use {delivery_time} placeholder
   - Example: "between 10 AM - 2 PM"
   - Help customer plan availability

7. **Create data migration**
   - Add to templates migration
   - Apply to all tenants

### COD Reminder SMS Template Content

```
┌─────────────────────────────────────────────────────────────┐
│                 English Version (en)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: cod_reminder                                │
│  language: en                                               │
│  template_text:                                             │
│                                                             │
│  "Hi {customer_name}, your order {order_number} will be     │
│   delivered {delivery_time}. Please keep Rs. {cod_amount}   │
│   ready (cash on delivery). Exact change appreciated.       │
│   {store_name}"                                             │
│                                                             │
│  Character count: ~145 characters                           │
│                                                             │
│  Placeholders:                                              │
│  - {customer_name}: Customer first name                     │
│  - {order_number}: Order ID                                 │
│  - {cod_amount}: COD payment amount (formatted)             │
│  - {delivery_time}: Time window (e.g., "today 2-4 PM")     │
│  - {store_name}: Store name                                 │
│                                                             │
│  Alternative (with contact):                                │
│  "Order {order_number} arriving {delivery_time}. COD:       │
│   Rs. {cod_amount}. Keep cash ready. Issues? Call           │
│   {support_phone}. {store_name}"                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Sinhala Version (සිංහල) (si)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: cod_reminder                                │
│  language: si                                               │
│  template_text:                                             │
│                                                             │
│  "හායි {customer_name}, ඔබගේ {order_number} ඇණවුම          │
│   {delivery_time} ලබා දෙනු ලැබේ. කරුණාකර රු. {cod_amount}  │
│   මුදල් සූදානම් කර තබා ගන්න. {store_name}"                 │
│                                                             │
│  Character count: ~115 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "Hi" = "හායි" (casual greeting)                         │
│  - "will be delivered" = "ලබා දෙනු ලැබේ"                   │
│  - "Please keep ready" = "කරුණාකර සූදානම් කර තබා ගන්න"     │
│  - "cash on delivery" = COD (commonly used term)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                Tamil Version (தமிழ்) (ta)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  template_name: cod_reminder                                │
│  language: ta                                               │
│  template_text:                                             │
│                                                             │
│  "வணக்கம் {customer_name}, உங்கள் ஆர்டர்                    │
│   {order_number} {delivery_time} டெலிவரி செய்யப்படும்.      │
│   ரூ. {cod_amount} பணம் தயாராக வைத்திருங்கள். {store_name}" │
│                                                             │
│  Character count: ~125 characters (2 SMS segments)          │
│                                                             │
│  Translation Notes:                                         │
│  - "Hi" = "வணக்கம்" (respectful greeting)                   │
│  - "will be delivered" = "டெலிவரி செய்யப்படும்"            │
│  - "keep cash ready" = "பணம் தயாராக வைத்திருங்கள்"          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### COD Amount Formatting

```
┌────────────────────────────────────────────────────────────┐
│              COD Amount Display Guidelines                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  FORMAT: Rs. {amount}                                      │
│                                                            │
│  Examples:                                                 │
│  ├─ Rs. 1,500         (with thousands separator)          │
│  ├─ Rs. 10,250        (larger amount)                     │
│  ├─ Rs. 500           (no separator needed)               │
│  └─ Rs. 1,50,000      (Indian system - optional)          │
│                                                            │
│  Denomination Breakdown (Optional):                        │
│  "Rs. 5,000 (2 x Rs. 2,000 + 1 x Rs. 1,000 notes)"        │
│  - Helps customers prepare exact change                    │
│  - Reduces delivery delays                                │
│                                                            │
│  Rounding:                                                 │
│  - Always show full amount, no rounding                    │
│  - Include cents/paisa only if non-zero                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Delivery Time Formatting

```
Examples of {delivery_time} values:

"today between 2-4 PM"
"tomorrow morning (9-12 PM)"
"on Jan 31 (afternoon)"
"within 2 hours"
"this evening (5-7 PM)"

Sinhala:
"අද දහවල් 2-4"
"හෙට උදෑසන"

Tamil:
"இன்று மதியம் 2-4"
"நாளை காலை"
```

### Sample Rendered Messages

```
English Example:
───────────────
"Hi Kasun Perera, your order #12345 will be delivered today 
between 2-4 PM. Please keep Rs. 5,000 ready (cash on delivery). 
Exact change appreciated. Fashion Store"

Sinhala Example:
───────────────
"හායි කසුන් පෙරේරා, ඔබගේ #12345 ඇණවුම අද දහවල් 2-4 
ලබා දෙනු ලැබේ. කරුණාකර රු. 5,000 මුදල් සූදානම් කර 
තබා ගන්න. Fashion Store"

Tamil Example:
──────────────
"வணக்கம் கசுன் பெரேரா, உங்கள் ஆர்டர் #12345 இன்று 
மதியம் 2-4 டெலிவரி செய்யப்படும். ரூ. 5,000 பணம் 
தயாராக வைத்திருங்கள். Fashion Store"
```

### Expected Outcome
- Three cod_reminder templates created (en, si, ta)
- COD amount prominently featured
- Delivery timing included
- Clear instructions for cash preparation
- Templates optimized for delivery success

### Verification Checklist
- [ ] English template created with template_name='cod_reminder', language='en'
- [ ] Sinhala template created with language='si'
- [ ] Tamil template created with language='ta'
- [ ] {cod_amount} placeholder included and formatted
- [ ] {delivery_time} placeholder for scheduling
- [ ] "Exact change" suggestion included
- [ ] Character counts within SMS limits
- [ ] Data migration includes all three languages
- [ ] All four template types now complete (confirm, shipped, delivered, COD)

---

## Summary

This document covered the creation of the SMS template infrastructure with multi-language support:

### Completed Components

1. **SMSTemplate Model** (Task 55)
   - BaseModel inheritance with tenant isolation
   - Template storage and management
   - Helper methods for rendering and validation

2. **template_name Field** (Task 56)
   - Snake_case naming convention
   - Standard template registry
   - Validation for format consistency

3. **template_text Field** (Task 57)
   - Placeholder-based content system
   - Multi-line support
   - Character limit considerations

4. **language Field** (Task 58)
   - Three language support (en, si, ta)
   - Unique constraint with template_name
   - Fallback logic to English

5. **Four SMS Template Types** (Tasks 59-62)
   - Order Confirmation
   - Shipping Notification
   - Delivery Confirmation
   - COD Payment Reminder

### Template Count

```
Total Templates Created: 12
├── order_confirm (en, si, ta)    = 3
├── order_shipped (en, si, ta)    = 3
├── order_delivered (en, si, ta)  = 3
└── cod_reminder (en, si, ta)     = 3
```

### Next Steps

The next document (02_Tasks-63-68) will cover:
- SMSNotificationService implementation
- send_order_sms and send_shipping_sms methods
- SMSSendTask Celery task for async sending
- SMS queue management
- Service verification and testing

These templates will be used by the notification service to send dynamic, personalized SMS messages to customers throughout the order lifecycle.

---

## Document Complete

**End of Document 01 - Tasks 55-62: Template Model and SMS Templates**
