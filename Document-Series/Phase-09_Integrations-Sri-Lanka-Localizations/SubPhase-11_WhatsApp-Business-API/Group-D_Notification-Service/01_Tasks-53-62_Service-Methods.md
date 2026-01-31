# Tasks 53-62: WhatsApp Service and Notification Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** D - Notification Service  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-C_Template-Messages/02_Tasks-45-52_Multilang-Builder-Admin.md](../Group-C_Template-Messages/02_Tasks-45-52_Multilang-Builder-Admin.md)
- **→ Next Document:** [02_Tasks-63-68_Celery-Signals-Verify.md](02_Tasks-63-68_Celery-Signals-Verify.md)

---

## Document Overview

This document covers the creation of the WhatsApp notification service with methods for sending order lifecycle messages. It establishes the WhatsAppService as the high-level service class, implements customer opt-in verification and language preference retrieval, and creates dedicated notification methods for each stage of the order lifecycle including confirmation, payment status, shipping updates, and delivery notifications.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create WhatsAppService | High | 60 min |
| 54 | Create check_opt_in Method | Low | 20 min |
| 55 | Create get_language Method | Low | 20 min |
| 56 | Create send_order_confirmation | Medium | 35 min |
| 57 | Create send_payment_success | Medium | 30 min |
| 58 | Create send_payment_failed | Medium | 30 min |
| 59 | Create send_shipped | Medium | 35 min |
| 60 | Create send_out_for_delivery | Medium | 30 min |
| 61 | Create send_delivered | Medium | 30 min |
| 62 | Create send_cod_reminder | Medium | 30 min |

---

## Task 53: Create WhatsAppService

### Overview
Create the WhatsAppService as the main high-level service class for WhatsApp notifications. This service acts as a facade that wraps the lower-level WhatsAppClient and provides business-logic-aware methods for sending notifications. It handles customer opt-in verification, language preferences, template selection, parameter formatting, and error handling at the business logic level.

### Dependencies
- Task 52 (Create send_template_message - Group C) must be complete
- WhatsAppClient must be implemented and functional
- WhatsAppOptIn model must exist
- WhatsAppTemplate model must exist
- Customer model must have phone_number field

### Instructions

1. **Create the service file structure**
   - Create file at `backend/apps/notifications/services/whatsapp_service.py`
   - This service resides in the notifications app
   - Separates notification logic from messaging infrastructure

2. **Define the WhatsAppService class**
   - Create main WhatsAppService class
   - Initialize with tenant context support
   - Store reference to WhatsAppClient instance
   - Include logging configuration for notification tracking

3. **Implement client instantiation**
   - Import and instantiate WhatsAppClient
   - Pass tenant-specific configuration
   - Handle client initialization errors gracefully
   - Cache client instance for reuse within request

4. **Add customer validation methods**
   - Validate customer has phone number
   - Ensure phone number format (+94 XX XXX XXXX)
   - Check customer status is active
   - Return detailed error messages for validation failures

5. **Implement template retrieval logic**
   - Create method to fetch template by name
   - Include language parameter
   - Handle template not found scenarios
   - Verify template is approved and active

6. **Add parameter formatting utilities**
   - Create method to format parameters for templates
   - Handle currency formatting (LKR)
   - Format dates in localized format
   - Escape special characters if needed

7. **Implement error handling wrapper**
   - Wrap all external calls with try-except
   - Log errors with context (customer, template, parameters)
   - Distinguish between temporary and permanent failures
   - Return structured error responses

8. **Add rate limiting checks**
   - Check if customer exceeded message limits
   - Implement daily/hourly message caps per customer
   - Consider priority messages (payment, delivery)
   - Log rate limit violations for monitoring

9. **Create notification tracking**
   - Log all notification attempts
   - Record success/failure status
   - Store message ID for webhook correlation
   - Include timestamp and tenant context

10. **Document service architecture**
    - Add docstrings explaining service purpose
    - Document each method's responsibility
    - Include usage examples in comments
    - Note integration points with other services

### WhatsApp Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WhatsAppService                          │
│                      (High-Level Service)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐     ┌──────────────────┐               │
│  │  Customer Logic   │     │  Template Logic  │               │
│  ├───────────────────┤     ├──────────────────┤               │
│  │ - Validate Phone  │     │ - Fetch Template │               │
│  │ - Check Opt-in    │     │ - Get Language   │               │
│  │ - Get Language    │     │ - Format Params  │               │
│  │ - Rate Limiting   │     │ - Validate       │               │
│  └───────────────────┘     └──────────────────┘               │
│           │                         │                          │
│           └──────────┬──────────────┘                          │
│                      │                                         │
│           ┌──────────▼──────────┐                             │
│           │   Notification      │                             │
│           │   Methods           │                             │
│           │   (Tasks 56-62)     │                             │
│           └──────────┬──────────┘                             │
│                      │                                         │
└──────────────────────┼─────────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │    WhatsAppClient       │
         │    (Low-Level API)      │
         └─────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │  WhatsApp Business API  │
         └─────────────────────────┘
```

### Service Responsibilities

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **WhatsAppService** | Business logic, validation, formatting | Check opt-in, format currency, select template |
| **WhatsAppClient** | API communication, authentication | Send HTTP requests, handle tokens |
| **Business API** | Message delivery, webhook callbacks | Deliver message, send delivery status |

### Service Method Categories

| Category | Methods | Purpose |
|----------|---------|---------|
| **Validation** | validate_customer, check_phone | Ensure customer can receive messages |
| **Lookup** | check_opt_in, get_language | Retrieve customer preferences |
| **Notification** | send_order_confirmation, send_payment_success | Send business notifications |
| **Utility** | format_currency, format_date | Format parameters for templates |

### Expected Outcome
- WhatsAppService class created with proper structure
- Client instantiation and configuration handled
- Validation and error handling implemented
- Logging and tracking configured
- Foundation ready for notification methods

### Verification Checklist
- [ ] Service file created at correct location
- [ ] WhatsAppClient properly instantiated
- [ ] Customer validation methods implemented
- [ ] Template retrieval logic working
- [ ] Error handling covers all scenarios
- [ ] Logging configured for all operations
- [ ] Rate limiting checks in place
- [ ] Documentation complete with examples

---

## Task 54: Create check_opt_in Method

### Overview
Create the check_opt_in method to verify whether a customer has consented to receive WhatsApp notifications. This method queries the WhatsAppOptIn model to determine if an active opt-in record exists for the customer. It respects customer preferences and ensures compliance with messaging regulations and platform policies.

### Dependencies
- Task 53 (Create WhatsAppService) must be complete
- WhatsAppOptIn model must exist
- Customer model relationship established

### Instructions

1. **Define method signature**
   - Create check_opt_in method in WhatsAppService
   - Accept customer object as parameter
   - Return boolean indicating opt-in status
   - Include tenant context for multi-tenancy

2. **Query opt-in records**
   - Query WhatsAppOptIn model for customer
   - Filter for active records (is_active=True)
   - Check opt-in hasn't expired
   - Consider tenant-specific records only

3. **Validate opt-in status**
   - Verify record exists
   - Check opted_in_at is not null
   - Ensure opted_out_at is null
   - Validate source is legitimate (form, checkout, admin)

4. **Handle edge cases**
   - Customer with no opt-in record (return False)
   - Customer with expired opt-in (return False)
   - Customer who opted out (return False)
   - Multiple opt-in records (use most recent)

5. **Implement caching strategy**
   - Cache opt-in status per request
   - Use tenant-aware cache keys
   - Set appropriate TTL (Time To Live)
   - Clear cache when opt-in changes

6. **Add logging for compliance**
   - Log all opt-in checks with timestamp
   - Record customer ID and result
   - Include check source (order, payment, admin)
   - Store for audit trail

7. **Handle database errors**
   - Wrap queries in try-except
   - Return False on database errors
   - Log errors for investigation
   - Don't expose internal errors to caller

8. **Document compliance requirements**
   - Note GDPR considerations
   - Mention opt-out requirements
   - Reference platform policies
   - Include retention policies

### Opt-in Verification Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    check_opt_in(customer)                      │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Check Cache for Opt-in       │
          │   Key: whatsapp_opt_{cust_id}  │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
          Found in Cache       Not in Cache
                 │                   │
                 ▼                   ▼
         Return Cached       ┌───────────────────┐
            Result           │ Query Database    │
                             │ WhatsAppOptIn     │
                             └───────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                 Record Exists                No Record
                        │                           │
                        ▼                           ▼
         ┌──────────────────────────┐      Return False
         │   Validate Opt-in        │
         │   - is_active = True     │
         │   - opted_out_at is NULL │
         │   - Not expired          │
         └──────────────────────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
           Valid            Invalid
              │                   │
              ▼                   ▼
      ┌──────────────┐    Return False
      │ Cache Result │
      │ Return True  │
      └──────────────┘
```

### Opt-in Status Matrix

| Condition | is_active | opted_out_at | Expiry | Result | Action |
|-----------|-----------|--------------|---------|--------|--------|
| Active opt-in | True | NULL | Future/None | **True** | Allow message |
| Opted out | True | Set | Any | **False** | Block message |
| Expired | True | NULL | Past | **False** | Block message |
| Inactive | False | Any | Any | **False** | Block message |
| No record | N/A | N/A | N/A | **False** | Block message |

### Caching Strategy

| Scenario | Cache Duration | Cache Key Pattern | Invalidation Trigger |
|----------|----------------|-------------------|---------------------|
| Opt-in active | 1 hour | `wa_opt:{tenant}:{customer}` | Opt-out event |
| Opt-in not found | 15 minutes | `wa_opt:{tenant}:{customer}` | New opt-in created |
| Opt-in expired | 1 hour | `wa_opt:{tenant}:{customer}` | Manual refresh |

### Expected Outcome
- check_opt_in method implemented and functional
- Opt-in verification working correctly
- Caching strategy reducing database load
- Logging providing audit trail
- Edge cases handled gracefully

### Verification Checklist
- [ ] Method returns correct boolean value
- [ ] Active opt-ins return True
- [ ] Opted-out customers return False
- [ ] Expired opt-ins return False
- [ ] Missing opt-ins return False
- [ ] Caching working and invalidating properly
- [ ] Logging captures all checks
- [ ] Database errors handled gracefully

---

## Task 55: Create get_language Method

### Overview
Create the get_language method to retrieve a customer's preferred language for WhatsApp notifications. This method checks customer preferences and returns the appropriate language code (en, si, ta) for template selection. It ensures messages are delivered in the customer's preferred language, improving engagement and user experience.

### Dependencies
- Task 53 (Create WhatsAppService) must be complete
- Customer model must have language preference field
- Language codes standardized (en, si, ta)

### Instructions

1. **Define method signature**
   - Create get_language method in WhatsAppService
   - Accept customer object as parameter
   - Return language code as string
   - Default to 'en' if no preference set

2. **Query customer preferences**
   - Check customer.language or customer.preferred_language field
   - Validate language code is supported
   - Handle null or empty values
   - Consider tenant-level default language

3. **Implement language fallback chain**
   - First: Customer explicit preference
   - Second: Browser/session language from first order
   - Third: Tenant default language
   - Fourth: System default (English)

4. **Validate language codes**
   - Ensure returned code is in supported list (en, si, ta)
   - Map variations (eng → en, sin → si, tam → ta)
   - Handle invalid codes by falling back to default
   - Log unsupported language requests

5. **Support language detection**
   - Detect language from customer name (Sinhala/Tamil characters)
   - Use phone number prefix patterns if available
   - Consider location data if present
   - Apply detection only if no explicit preference

6. **Implement caching**
   - Cache language preference per customer
   - Use tenant-aware cache key
   - Set long TTL (24 hours)
   - Invalidate when preference updated

7. **Handle multi-language scenarios**
   - Support bilingual customers if needed
   - Determine primary language for notifications
   - Document language selection logic
   - Consider message urgency (critical messages in primary language)

8. **Add language analytics**
   - Track language distribution across customers
   - Log language preferences for insights
   - Monitor template usage per language
   - Identify gaps in language support

### Language Selection Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   get_language(customer)                       │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │  Customer Explicit Preference  │
          │  customer.preferred_language   │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
              Found              Not Found
                 │                   │
                 ▼                   ▼
         ┌──────────────┐   ┌──────────────────┐
         │  Validate    │   │  Session/Order   │
         │  Code        │   │  Language        │
         └──────────────┘   └──────────────────┘
                 │                   │
           ┌─────┴─────┐      ┌──────┴──────┐
           │           │      │             │
        Valid      Invalid  Found       Not Found
           │           │      │             │
           │           └──────┼─────────────┘
           │                  │
           │                  ▼
           │         ┌──────────────────┐
           │         │  Tenant Default  │
           │         │  Language        │
           │         └──────────────────┘
           │                  │
           │            ┌─────┴─────┐
           │            │           │
           │         Found      Not Found
           │            │           │
           │            │           ▼
           │            │    ┌──────────────┐
           │            │    │  System      │
           │            │    │  Default     │
           │            │    │  (en)        │
           │            │    └──────────────┘
           │            │           │
           └────────────┴───────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Return Language │
              │  Code (en/si/ta) │
              └──────────────────┘
```

### Language Support Matrix

| Code | Language | Native Name | Character Set | Template Availability |
|------|----------|-------------|---------------|----------------------|
| **en** | English | English | Latin | All templates |
| **si** | Sinhala | සිංහල | Sinhala Unicode | All templates |
| **ta** | Tamil | தமிழ் | Tamil Unicode | All templates |

### Language Fallback Priority

| Priority | Source | Example Scenario | Reliability |
|----------|--------|------------------|-------------|
| **1** | Customer explicit preference | User selected in profile settings | **High** |
| **2** | Order/Session language | Detected from first order checkout | **Medium** |
| **3** | Tenant default | Store configured for Sinhala customers | **Medium** |
| **4** | System default (en) | No preference available anywhere | **Guaranteed** |

### Language Detection Rules

| Detection Method | Pattern | Language | Confidence |
|------------------|---------|----------|------------|
| Unicode range | Characters U+0D80–U+0DFF | Sinhala (si) | High |
| Unicode range | Characters U+0B80–U+0BFF | Tamil (ta) | High |
| Name analysis | Latin characters only | English (en) | Low |
| Phone prefix | +94 7X (analysis needed) | N/A | Very Low |

### Expected Outcome
- get_language method returning correct language codes
- Fallback chain working as specified
- Language validation preventing invalid codes
- Caching reducing repeated lookups
- Default language (en) always available

### Verification Checklist
- [ ] Method returns valid language code
- [ ] Customer preference respected when set
- [ ] Fallback chain working correctly
- [ ] Invalid codes handled gracefully
- [ ] Default language (en) returned when needed
- [ ] Caching implemented and working
- [ ] Unicode language detection working
- [ ] Language analytics logged

---

## Task 56: Create send_order_confirmation

### Overview
Create the send_order_confirmation method to send an order confirmation notification when a customer places an order. This notification confirms the order details, provides the order number, and sets expectations for next steps. It's the first touchpoint in the order lifecycle and should be sent immediately after order creation.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Order model with complete order data
- order_confirmation template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_order_confirmation in WhatsAppService
   - Accept order object as parameter
   - Return message ID or error
   - Support async execution option

2. **Validate order data**
   - Ensure order has customer with phone number
   - Verify order status is appropriate for confirmation
   - Check order has items and total
   - Validate order number exists

3. **Check customer eligibility**
   - Call check_opt_in to verify consent
   - Return early if customer opted out
   - Log skipped notification with reason
   - Don't fail order creation if message fails

4. **Retrieve customer language**
   - Call get_language to get preference
   - Select appropriate template version
   - Ensure template exists for language
   - Fallback to English if needed

5. **Format notification parameters**
   - Extract customer_name (first name or full name)
   - Format order_number for display
   - Calculate and format total with LKR symbol
   - Format order_date in customer's timezone
   - Include item_count if template supports it

6. **Retrieve template**
   - Fetch order_confirmation template
   - Select version for customer language
   - Verify template is approved
   - Get template parameters definition

7. **Send notification**
   - Call WhatsAppClient.send_template_message
   - Pass formatted parameters
   - Include customer phone number
   - Set message priority to high

8. **Handle response**
   - Store message ID if successful
   - Create notification log record
   - Link to order for tracking
   - Handle rate limiting errors

9. **Implement error handling**
   - Catch API errors gracefully
   - Log failed attempts with details
   - Schedule retry for temporary failures
   - Alert on repeated failures

10. **Add order lifecycle tracking**
    - Mark order as confirmation_sent
    - Store confirmation_sent_at timestamp
    - Update order notification status
    - Enable webhook correlation

### Order Confirmation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                  send_order_confirmation(order)                │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Order Data          │
          │   - Customer exists            │
          │   - Phone number valid         │
          │   - Order complete             │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   check_opt_in(customer)       │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Opted In            Opted Out
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ get_language │   │ Log Skipped  │
          │ (customer)   │   │ Return None  │
          └──────────────┘   └──────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Get Template                 │
          │   order_confirmation_{lang}    │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - customer_name              │
          │   - order_number               │
          │   - total (LKR formatted)      │
          │   - order_date                 │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send Template Message        │
          │   via WhatsAppClient           │
          └────────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
    Success            Failure
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│ Log Success  │   │ Log Error        │
│ Store Msg ID │   │ Schedule Retry   │
│ Update Order │   │ Alert if needed  │
└──────────────┘   └──────────────────┘
```

### Order Confirmation Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **customer_name** | order.customer.first_name | String | "Kasun" |
| **order_number** | order.order_number | String | "ORD-2026-0001234" |
| **total** | order.total_amount | Currency | "රු 15,750" or "LKR 15,750" |
| **order_date** | order.created_at | Date | "31 Jan 2026" |
| **item_count** | order.items.count() | Number | "5 items" |

### Template Message Example

**English (en):**
```
🎉 Order Confirmed!

Hello {{customer_name}},

Your order {{order_number}} has been confirmed.

Order Total: {{total}}
Order Date: {{order_date}}

We'll notify you when your order ships.

Thank you for shopping with us!
```

**Sinhala (si):**
```
🎉 ඇණවුම තහවුරු විය!

ආයුබෝවන් {{customer_name}},

ඔබගේ ඇණවුම {{order_number}} තහවුරු කරන ලදී.

මුළු මුදල: {{total}}
දිනය: {{order_date}}

ඔබේ ඇණවුම යවන විට අපි ඔබට දැනුම් දෙන්නෙමු.

ස්තූතියි!
```

### Timing Considerations

| Scenario | Timing | Priority | Retry Strategy |
|----------|--------|----------|----------------|
| Successful order | Immediate (< 5 sec) | High | 3 retries with backoff |
| Payment pending | After payment confirmed | High | 3 retries |
| Offline order | When order synced | Medium | 2 retries |
| Bulk import | Queue and batch | Low | 1 retry |

### Expected Outcome
- Order confirmation notifications sent successfully
- Messages delivered in customer's language
- Parameters formatted correctly with LKR currency
- Notification logs created for tracking
- Failed messages logged and retried

### Verification Checklist
- [ ] Method accepts order object correctly
- [ ] Customer opt-in verified before sending
- [ ] Language preference retrieved and used
- [ ] Template selected for correct language
- [ ] Parameters formatted correctly
- [ ] Currency displayed with LKR symbol
- [ ] Message sent via WhatsAppClient
- [ ] Success/failure logged appropriately
- [ ] Order marked as confirmation_sent
- [ ] Retry mechanism working for failures

---

## Task 57: Create send_payment_success

### Overview
Create the send_payment_success method to notify customers when their payment is successfully processed. This confirmation provides immediate feedback, builds trust, and includes payment details such as amount, method, and transaction reference. It's critical for customer confidence, especially for online payments.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Payment model with complete payment data
- payment_success template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_payment_success in WhatsAppService
   - Accept payment object as parameter
   - Return message ID or error
   - Support immediate and async sending

2. **Validate payment data**
   - Ensure payment is in success/completed status
   - Verify payment has associated order
   - Check payment amount is valid
   - Validate payment method is recorded

3. **Extract order and customer**
   - Get order from payment.order
   - Get customer from order.customer
   - Verify customer has phone number
   - Check customer opt-in status

4. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language selection

5. **Format payment parameters**
   - Format amount with LKR currency symbol
   - Get payment_method display name (Card, Bank Transfer, etc.)
   - Extract transaction_reference or payment_id
   - Format payment_date in customer timezone
   - Include order_number for reference

6. **Get template**
   - Fetch payment_success template
   - Get version for customer language
   - Verify template is approved
   - Validate parameter mapping

7. **Send notification**
   - Call WhatsAppClient.send_template_message
   - Pass formatted parameters
   - Set high priority for payment confirmations
   - Include message metadata

8. **Update payment record**
   - Mark payment as notification_sent
   - Store notification_sent_at timestamp
   - Save WhatsApp message ID
   - Link notification log to payment

9. **Handle errors gracefully**
   - Don't block payment processing on notification failure
   - Log errors with payment context
   - Schedule retry for temporary failures
   - Alert finance team on persistent failures

10. **Consider payment method variations**
    - Different messages for different methods (cards, bank, cash)
    - Include method-specific information
    - Customize confirmation based on risk level
    - Add next steps if needed

### Payment Success Flow

```
┌────────────────────────────────────────────────────────────────┐
│                send_payment_success(payment)                   │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Payment             │
          │   - Status = success           │
          │   - Has order                  │
          │   - Amount valid               │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Get Customer from Order      │
          │   Verify Phone & Opt-in        │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Can Send            Cannot Send
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ get_language │   │ Log Skipped  │
          │              │   │ Return       │
          └──────────────┘   └──────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - amount (LKR)               │
          │   - payment_method             │
          │   - transaction_ref            │
          │   - order_number               │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Get Template                 │
          │   payment_success_{lang}       │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send via WhatsAppClient      │
          └────────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
    Success            Failure
       │                   │
       ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│ Update       │   │ Log Error        │
│ Payment      │   │ Schedule Retry   │
│ Record       │   │                  │
└──────────────┘   └──────────────────┘
```

### Payment Success Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **amount** | payment.amount | Currency | "රු 15,750.00" |
| **payment_method** | payment.method | Display String | "Visa Card", "Bank Transfer" |
| **transaction_ref** | payment.transaction_id | String | "TXN-2026-ABC123" |
| **order_number** | payment.order.order_number | String | "ORD-2026-0001234" |
| **payment_date** | payment.paid_at | Date/Time | "31 Jan 2026, 2:45 PM" |

### Payment Method Display Names

| Internal Code | Display (en) | Display (si) | Display (ta) |
|---------------|--------------|--------------|--------------|
| card | Credit/Debit Card | ක්‍රෙඩිට්/ඩෙබිට් කාඩ් | கிரெடிட்/டெபிட் கார்டு |
| bank_transfer | Bank Transfer | බැංකු මාරු | வங்கி பரிமாற்றம் |
| cash | Cash Payment | මුදල් ගෙවීම | பண செலுத்தல் |
| wallet | Digital Wallet | ඩිජිටල් පසුම්බිය | டிஜிட்டல் பர்ஸ் |

### Template Message Example

**English (en):**
```
✅ Payment Successful

Hello,

Your payment of {{amount}} has been received.

Payment Method: {{payment_method}}
Transaction ID: {{transaction_ref}}
Order Number: {{order_number}}
Date: {{payment_date}}

Your order is being processed.

Thank you!
```

### Priority & Timing

| Payment Method | Priority | Send Timing | Retry Count |
|----------------|----------|-------------|-------------|
| Card/Gateway | **High** | Immediate (< 3 sec) | 3 retries |
| Bank Transfer | High | After confirmation | 2 retries |
| Cash/COD | Medium | After order completion | 1 retry |

### Expected Outcome
- Payment success notifications sent immediately
- Correct payment details included in message
- Customer receives confirmation in preferred language
- Payment records updated with notification status
- Failed notifications logged and retried

### Verification Checklist
- [ ] Method accepts payment object
- [ ] Payment status validated
- [ ] Customer opt-in checked
- [ ] Language preference used
- [ ] Amount formatted with LKR currency
- [ ] Payment method displayed correctly
- [ ] Transaction reference included
- [ ] Template message sent successfully
- [ ] Payment record updated
- [ ] Errors handled without blocking payment

---

## Task 58: Create send_payment_failed

### Overview
Create the send_payment_failed method to notify customers when their payment attempt fails. This notification provides immediate feedback about the failure, includes the reason if available, and guides customers on next steps such as retrying payment or using an alternative method. Timely failure notifications reduce customer anxiety and support recovery.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Payment model with failure status and reason
- payment_failed template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_payment_failed in WhatsAppService
   - Accept payment object as parameter
   - Return message ID or error
   - Support immediate notification

2. **Validate payment failure data**
   - Ensure payment status is failed or declined
   - Check failure_reason is recorded
   - Verify associated order exists
   - Validate customer information available

3. **Extract failure details**
   - Get failure_reason from payment
   - Map technical error to customer-friendly message
   - Determine if retry is possible
   - Check if alternate method suggested

4. **Get customer and verify opt-in**
   - Get customer from payment.order.customer
   - Check customer has phone number
   - Verify opt-in status
   - Skip if customer opted out

5. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language used

6. **Format failure parameters**
   - Format amount that failed with LKR
   - Get customer-friendly failure reason
   - Create retry_url for payment page
   - Include order_number for reference
   - Add support contact if needed

7. **Map failure reasons**
   - Convert gateway error codes to friendly messages
   - Handle: insufficient funds, expired card, declined, network error
   - Provide specific guidance per error type
   - Keep messages empathetic and helpful

8. **Get template and send**
   - Fetch payment_failed template for language
   - Verify template approved
   - Send via WhatsAppClient
   - Set medium priority (important but not urgent)

9. **Update payment record**
   - Mark failure_notification_sent
   - Store notification_sent_at
   - Save message ID
   - Create notification log entry

10. **Enable recovery workflow**
    - Include link to retry payment
    - Suggest alternative payment methods
    - Provide customer support contact
    - Track retry conversions

### Payment Failed Flow

```
┌────────────────────────────────────────────────────────────────┐
│                 send_payment_failed(payment)                   │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Payment Failure     │
          │   - Status = failed            │
          │   - Has failure_reason         │
          │   - Has order                  │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Get Customer & Check Opt-in  │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Can Send            Cannot Send
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ get_language │   │ Return       │
          └──────────────┘   └──────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Map Failure Reason           │
          │   Technical → Friendly         │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - amount                     │
          │   - reason (friendly)          │
          │   - retry_url                  │
          │   - order_number               │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send Template Message        │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Update Payment Record        │
          │   Log Notification             │
          └────────────────────────────────┘
```

### Payment Failure Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **amount** | payment.amount | Currency | "රු 15,750.00" |
| **reason** | payment.failure_reason (mapped) | Friendly String | "Card declined. Please check with your bank." |
| **retry_url** | Generated link | Short URL | "https://shop.lk/pay/ABC123" |
| **order_number** | payment.order.order_number | String | "ORD-2026-0001234" |

### Failure Reason Mapping

| Gateway Error Code | Friendly Message (en) | Friendly Message (si) | Actionable Advice |
|--------------------|-----------------------|-----------------------|-------------------|
| insufficient_funds | Insufficient funds in your account | ඔබගේ ගිණුමේ ප්‍රමාණවත් මුදලක් නැත | Try another card or payment method |
| card_declined | Card declined by bank | කාඩ්පත බැංකුව විසින් ප්‍රතික්ෂේප විය | Contact your bank or use another card |
| expired_card | Card has expired | කාඩ්පතේ කල් ඉකුත් වී ඇත | Update card details or use another card |
| invalid_cvv | Invalid security code | වලංගු නොවන ආරක්ෂණ කේතය | Check CVV and try again |
| network_error | Network connection error | ජාල සම්බන්ධතා දෝෂයකි | Please try again |
| gateway_timeout | Payment gateway timeout | ගෙවීම් ද්වාරය කාල ඉකුත් විය | Safe to retry payment |

### Template Message Example

**English (en):**
```
❌ Payment Failed

We couldn't process your payment of {{amount}}.

Reason: {{reason}}

Order: {{order_number}}

Please retry your payment:
{{retry_url}}

Need help? Contact our support.
```

**Sinhala (si):**
```
❌ ගෙවීම අසාර්ථකයි

{{amount}} ගෙවීම සකසන්න බැරි විය.

හේතුව: {{reason}}

ඇණවුම: {{order_number}}

කරුණාකර නැවත උත්සාහ කරන්න:
{{retry_url}}

උදව් අවශ්‍යද? අපගේ සහාය අමතන්න.
```

### Recovery Workflow

| Step | Action | Message Element | Goal |
|------|--------|-----------------|------|
| **1** | Notify failure | Failure reason | Inform customer immediately |
| **2** | Provide context | Amount, order number | Help customer identify transaction |
| **3** | Offer solution | Retry URL | Enable quick recovery |
| **4** | Suggest alternatives | Payment methods | Reduce abandonment |
| **5** | Support access | Contact info | Assist if needed |

### Expected Outcome
- Payment failure notifications sent immediately
- Friendly, actionable failure reasons provided
- Retry links included for easy recovery
- Customer records updated
- Recovery rates tracked

### Verification Checklist
- [ ] Method accepts payment object
- [ ] Payment failure status validated
- [ ] Customer opt-in checked
- [ ] Failure reason mapped to friendly message
- [ ] Amount formatted with LKR
- [ ] Retry URL generated and included
- [ ] Template sent successfully
- [ ] Payment record updated
- [ ] Notification logged
- [ ] Recovery workflow enabled

---

## Task 59: Create send_shipped

### Overview
Create the send_shipped method to notify customers when their order has been shipped. This notification includes courier information, tracking number, estimated delivery date, and tracking URL. It's a key touchpoint in the order lifecycle that reduces customer inquiries and builds trust through transparency.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Order model with shipping information fields
- order_shipped template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_shipped in WhatsAppService
   - Accept order object as parameter
   - Return message ID or error
   - Support immediate notification on shipment

2. **Validate shipping data**
   - Ensure order status is shipped or in_transit
   - Verify tracking_number exists
   - Check courier information available
   - Validate customer data present

3. **Extract shipping details**
   - Get courier_name from order.courier
   - Get tracking_number from order
   - Generate tracking_url if available
   - Calculate estimated_delivery_date
   - Get shipping_address for confirmation

4. **Verify customer eligibility**
   - Get customer from order
   - Check customer has phone number
   - Verify opt-in status
   - Skip if opted out

5. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language selection

6. **Format shipping parameters**
   - Format courier name for display
   - Format tracking_number clearly
   - Create short tracking URL
   - Format estimated_delivery in customer timezone
   - Include order_number for reference

7. **Handle courier variations**
   - Support major Sri Lankan couriers (Pronto, DHL, etc.)
   - Include courier-specific tracking URLs
   - Map courier codes to display names
   - Handle international vs local shipments

8. **Get template and send**
   - Fetch order_shipped template for language
   - Verify template approved
   - Send via WhatsAppClient
   - Set medium-high priority

9. **Update order record**
   - Mark shipped_notification_sent
   - Store notification_sent_at timestamp
   - Save message ID for tracking
   - Enable delivery tracking

10. **Enable delivery tracking**
    - Link notification to order for webhook updates
    - Prepare for next status (out_for_delivery)
    - Track customer engagement with tracking link
    - Monitor delivery timeline

### Order Shipped Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    send_shipped(order)                         │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Shipping Data       │
          │   - Status = shipped           │
          │   - Has tracking_number        │
          │   - Has courier info           │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Verify Customer Opt-in       │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Can Send            Cannot Send
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ get_language │   │ Return       │
          └──────────────┘   └──────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Generate Tracking URL        │
          │   Based on Courier             │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - courier_name               │
          │   - tracking_number            │
          │   - tracking_url               │
          │   - estimated_delivery         │
          │   - order_number               │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send Template Message        │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Update Order Status          │
          │   Mark Notification Sent       │
          └────────────────────────────────┘
```

### Shipping Notification Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **courier_name** | order.courier.name | Display String | "Pronto Lanka", "DHL Express" |
| **tracking_number** | order.tracking_number | String | "PRONTO123456789" |
| **tracking_url** | Generated | Short URL | "https://track.pronto.lk/PRONTO123456789" |
| **estimated_delivery** | Calculated | Date | "3 Feb 2026" or "Within 2-3 days" |
| **order_number** | order.order_number | String | "ORD-2026-0001234" |

### Courier Integration

| Courier | Display Name | Tracking URL Pattern | Typical Delivery Time |
|---------|--------------|----------------------|----------------------|
| Pronto | Pronto Lanka | `https://track.pronto.lk/{tracking_number}` | 1-3 days |
| DHL | DHL Express | `https://www.dhl.com/lk-en/home/tracking.html?tracking-id={tracking_number}` | 1-2 days |
| Aramex | Aramex Sri Lanka | `https://www.aramex.com/express/track?q={tracking_number}` | 2-4 days |
| FedEx | FedEx | `https://www.fedex.com/fedextrack/?trknbr={tracking_number}` | 1-3 days |

### Template Message Example

**English (en):**
```
📦 Your Order Has Shipped!

Hello,

Your order {{order_number}} is on its way!

Courier: {{courier_name}}
Tracking: {{tracking_number}}

Track your package:
{{tracking_url}}

Estimated Delivery: {{estimated_delivery}}

Thank you for your patience!
```

**Sinhala (si):**
```
📦 ඔබේ ඇණවුම යවා ඇත!

ආයුබෝවන්,

ඔබගේ ඇණවුම {{order_number}} එළවා ඇත!

කුරියර්: {{courier_name}}
ලුහුබැඳීම: {{tracking_number}}

ඔබේ පැකේජය ලුහුබඳින්න:
{{tracking_url}}

ඇස්තමේන්තුගත බෙදාහැරීම: {{estimated_delivery}}

ඔබගේ ඉවසීමට ස්තූතියි!
```

### Timing & Priority

| Shipment Type | Send Timing | Priority | Include Tracking | Estimated Delivery |
|---------------|-------------|----------|------------------|-------------------|
| Standard | Within 1 hour of ship | Medium | Yes | Calculate from courier SLA |
| Express | Immediate (< 5 min) | High | Yes | Next day or same day |
| International | Within 1 hour | Medium | Yes | 5-10 days |
| Pickup | When ready | Medium | No | Same day pickup |

### Expected Outcome
- Shipping notifications sent when order ships
- Tracking information included and functional
- Estimated delivery dates provided
- Order records updated
- Customer able to track package

### Verification Checklist
- [ ] Method accepts order object
- [ ] Shipping data validated
- [ ] Customer opt-in verified
- [ ] Language preference retrieved
- [ ] Courier name formatted correctly
- [ ] Tracking number included
- [ ] Tracking URL generated and working
- [ ] Estimated delivery calculated
- [ ] Template sent successfully
- [ ] Order marked as notification_sent
- [ ] Notification logged for tracking

---

## Task 60: Create send_out_for_delivery

### Overview
Create the send_out_for_delivery method to notify customers when their order is out for delivery. This real-time notification informs customers that the package will arrive today, includes estimated arrival time, and prepares them to receive the delivery. It's particularly important for Cash on Delivery (COD) orders to ensure someone is available.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Order model with delivery status and timing
- out_for_delivery template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_out_for_delivery in WhatsAppService
   - Accept order object as parameter
   - Return message ID or error
   - Support real-time sending

2. **Validate delivery data**
   - Ensure order status is out_for_delivery
   - Verify estimated_arrival_time exists
   - Check delivery address confirmed
   - Validate courier assigned

3. **Extract delivery details**
   - Get estimated_arrival_time or time window
   - Get delivery_driver_name if available
   - Get delivery_driver_phone if available
   - Check if COD payment required
   - Get total COD amount if applicable

4. **Verify customer eligibility**
   - Get customer from order
   - Check phone number exists
   - Verify opt-in status
   - Send immediately due to time sensitivity

5. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language used

6. **Format delivery parameters**
   - Format estimated_time (e.g., "2:00 PM - 4:00 PM")
   - Include order_number for reference
   - Add COD amount if applicable with LKR
   - Include driver contact if available
   - Add delivery instructions reminder

7. **Handle COD vs prepaid**
   - Different templates or parameters for COD
   - Emphasize cash preparation for COD
   - Include exact amount needed
   - Remind small denomination preference
   - No payment reminder for prepaid

8. **Get template and send**
   - Fetch out_for_delivery template for language
   - Use COD variant if applicable
   - Verify template approved
   - Send via WhatsAppClient with high priority

9. **Update order record**
   - Mark out_for_delivery_notification_sent
   - Store notification_sent_at
   - Save message ID
   - Prepare for delivery confirmation

10. **Enable delivery coordination**
    - Track if customer reads message
    - Prepare for delivery status update
    - Enable customer to contact driver if needed
    - Monitor for delivery completion

### Out for Delivery Flow

```
┌────────────────────────────────────────────────────────────────┐
│                 send_out_for_delivery(order)                   │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Delivery Status     │
          │   - Status = out_for_delivery  │
          │   - Has estimated_time         │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Check if COD Order           │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
              COD            Prepaid
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ Get COD      │   │ Standard     │
          │ Amount       │   │ Parameters   │
          └──────────────┘   └──────────────┘
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Verify Customer Opt-in       │
          │   & Get Language               │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - estimated_time             │
          │   - order_number               │
          │   - cod_amount (if COD)        │
          │   - driver_phone (if avail)    │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Send High Priority Message   │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Update Order Record          │
          └────────────────────────────────┘
```

### Out for Delivery Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **estimated_time** | order.estimated_arrival | Time Window | "2:00 PM - 4:00 PM" or "Within 2 hours" |
| **order_number** | order.order_number | String | "ORD-2026-0001234" |
| **cod_amount** | order.total_amount (if COD) | Currency | "රු 15,750" |
| **driver_phone** | order.delivery_driver.phone | Phone | "+94 77 123 4567" |

### Template Message Examples

**Prepaid Order (English):**
```
🚚 Out for Delivery!

Your order {{order_number}} is out for delivery!

Estimated Arrival: {{estimated_time}}

Please ensure someone is available to receive the package.

Thank you!
```

**COD Order (English):**
```
🚚 Out for Delivery - COD

Your order {{order_number}} is out for delivery!

Estimated Arrival: {{estimated_time}}

💵 Cash on Delivery
Amount to Pay: {{cod_amount}}

Please keep exact change ready.

Ensure someone is available to receive and pay.

Thank you!
```

**COD Order (Sinhala):**
```
🚚 බෙදා හැරීමට නිමි - COD

ඔබගේ ඇණවුම {{order_number}} බෙදා හැරීමට යවා ඇත!

ඇස්තමේන්තුගත පැමිණීම: {{estimated_time}}

💵 භාණ්ඩ භාර ගැනීමේදී ගෙවීම
ගෙවිය යුතු මුදල: {{cod_amount}}

කරුණාකර නිවැරදි මුදල සූදානම් කර තබා ගන්න.

භාණ්ඩ භාර ගැනීමට සහ ගෙවීමට කෙනෙක් සිටීම සනාථ කරන්න.

ස්තූතියි!
```

### COD vs Prepaid Handling

| Aspect | COD Order | Prepaid Order |
|--------|-----------|---------------|
| **Message Emphasis** | Cash preparation | Availability to receive |
| **Amount Display** | Required with LKR | Not included |
| **Change Reminder** | Yes - exact change | Not applicable |
| **Urgency** | Higher (payment involved) | Medium |
| **Driver Contact** | Included if available | Optional |

### Timing Considerations

| Scenario | Send Timing | Priority | Retry Strategy |
|----------|-------------|----------|----------------|
| Same-day delivery | When driver departs | **Very High** | 2 retries max |
| Standard delivery | 1-2 hours before arrival | High | 1 retry |
| Scheduled delivery | Morning of delivery day | High | 1 retry |
| COD orders | Immediately when out for delivery | **Very High** | 2 retries |

### Expected Outcome
- Out for delivery notifications sent in real-time
- COD customers reminded of payment amount
- Estimated arrival times provided
- Order records updated
- Customers prepared to receive delivery

### Verification Checklist
- [ ] Method accepts order object
- [ ] Delivery status validated
- [ ] COD vs prepaid handled correctly
- [ ] Customer opt-in verified
- [ ] Language preference retrieved
- [ ] Estimated time formatted correctly
- [ ] COD amount included for COD orders
- [ ] Driver phone included if available
- [ ] High priority message sent
- [ ] Order marked as notification_sent
- [ ] Notification logged

---

## Task 61: Create send_delivered

### Overview
Create the send_delivered method to notify customers when their order has been successfully delivered. This confirmation closes the delivery loop, confirms delivery time, requests feedback, and may include review requests. It's the final touchpoint in the order lifecycle and opportunity to encourage repeat business.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Order model with delivery confirmation data
- order_delivered template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_delivered in WhatsAppService
   - Accept order object as parameter
   - Return message ID or error
   - Support immediate notification on delivery

2. **Validate delivery data**
   - Ensure order status is delivered or completed
   - Verify delivered_at timestamp exists
   - Check delivery confirmation received
   - Validate customer data available

3. **Extract delivery details**
   - Get delivered_at timestamp
   - Get delivery_recipient_name if collected
   - Check if signature or photo captured
   - Get final delivery location
   - Check if feedback already provided

4. **Verify customer eligibility**
   - Get customer from order
   - Check phone number exists
   - Verify opt-in status
   - Skip if customer opted out

5. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language selection

6. **Format delivery confirmation parameters**
   - Format delivered_at in customer timezone
   - Include order_number for reference
   - Generate review_url if applicable
   - Create support_url for issues
   - Include thank you message

7. **Generate engagement links**
   - Create review/feedback link
   - Generate product review links
   - Create support contact link
   - Add browse more products link
   - Use short URLs for WhatsApp

8. **Get template and send**
   - Fetch order_delivered template for language
   - Verify template approved
   - Send via WhatsAppClient
   - Set medium priority

9. **Update order record**
   - Mark delivered_notification_sent
   - Store notification_sent_at
   - Save message ID
   - Set order to completed status if applicable

10. **Enable post-delivery engagement**
    - Track feedback link clicks
    - Monitor review submissions
    - Track support requests after delivery
    - Measure customer satisfaction
    - Enable reorder opportunities

### Order Delivered Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   send_delivered(order)                        │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate Delivery Data       │
          │   - Status = delivered         │
          │   - Has delivered_at           │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Verify Customer Opt-in       │
          │   & Get Language               │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
           Can Send            Cannot Send
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ Generate     │   │ Return       │
          │ Review URLs  │   └──────────────┘
          └──────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - delivered_at               │
          │   - order_number               │
          │   - review_url                 │
          │   - support_url                │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send Template Message        │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Update Order to Completed    │
          │   Mark Notification Sent       │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Enable Feedback Tracking     │
          └────────────────────────────────┘
```

### Delivery Confirmation Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **delivered_at** | order.delivered_at | Date & Time | "31 Jan 2026, 3:45 PM" |
| **order_number** | order.order_number | String | "ORD-2026-0001234" |
| **review_url** | Generated | Short URL | "https://shop.lk/review/ABC123" |
| **support_url** | Generated | Short URL | "https://shop.lk/support" |

### Template Message Example

**English (en):**
```
✅ Order Delivered!

Your order {{order_number}} was delivered successfully!

Delivered: {{delivered_at}}

How was your experience?
Share your feedback:
{{review_url}}

Need help?
{{support_url}}

Thank you for shopping with us!
```

**Sinhala (si):**
```
✅ ඇණවුම බෙදා හැර ඇත!

ඔබගේ ඇණවුම {{order_number}} සාර්ථකව බෙදා හැර ඇත!

බෙදා හැරීම: {{delivered_at}}

ඔබගේ අත්දැකීම කෙසේද?
ඔබගේ ප්‍රතිපෝෂණය බෙදා ගන්න:
{{review_url}}

උදව් අවශ්‍යද?
{{support_url}}

අප සමග සාප්පු සවාරියට ස්තූතියි!
```

### Post-Delivery Engagement Strategy

| Element | Purpose | Timing | Success Metric |
|---------|---------|--------|----------------|
| **Delivery Confirmation** | Close the loop | Immediate after delivery | Delivery confirmation rate |
| **Review Request** | Collect feedback | Included in notification | Review submission rate |
| **Support Link** | Handle issues | Included in notification | Support ticket rate |
| **Thank You Message** | Build loyalty | Included in notification | Repeat purchase rate |
| **Browse Link** | Drive repeat sales | Optional | Click-through rate |

### Feedback Collection Flow

```
Delivery Notification Sent
           │
           ▼
Customer Clicks Review Link
           │
     ┌─────┴─────┐
     │           │
 Positive    Negative
     │           │
     ▼           ▼
Request      Request
Public       Private
Review       Feedback
     │           │
     ▼           ▼
Product      Support
Rating       Ticket
```

### Expected Outcome
- Delivery confirmation sent to customers
- Delivery timestamp included
- Review/feedback links provided
- Order marked as completed
- Post-delivery engagement enabled

### Verification Checklist
- [ ] Method accepts order object
- [ ] Delivery status validated
- [ ] Delivered timestamp included
- [ ] Customer opt-in verified
- [ ] Language preference retrieved
- [ ] Order number included
- [ ] Review URL generated and included
- [ ] Support URL included
- [ ] Template sent successfully
- [ ] Order marked as completed
- [ ] Notification logged
- [ ] Feedback tracking enabled

---

## Task 62: Create send_cod_reminder

### Overview
Create the send_cod_reminder method to send reminders for Cash on Delivery (COD) orders, particularly when delivery is scheduled or approaching. This reminder ensures customers are prepared with the exact cash amount, reducing delivery failures and improving driver efficiency. It's especially important in Sri Lankan context where COD is popular.

### Dependencies
- Task 55 (Create get_language Method) must be complete
- Order model with COD payment details
- cod_reminder template created in all languages
- Template approved by WhatsApp

### Instructions

1. **Define method signature**
   - Create send_cod_reminder in WhatsAppService
   - Accept order object as parameter
   - Optional: accept scheduled_time parameter
   - Return message ID or error

2. **Validate COD order data**
   - Ensure payment_method is COD or cash_on_delivery
   - Verify order status is appropriate (shipped, out_for_delivery)
   - Check COD amount is correct
   - Validate delivery date is set

3. **Determine reminder timing**
   - Send day before delivery for scheduled orders
   - Send morning of delivery day
   - Send 2-3 hours before estimated delivery
   - Don't send multiple reminders (check if already sent)

4. **Extract COD details**
   - Get total COD amount from order
   - Calculate exact_change_needed
   - Get delivery_date from order
   - Get estimated_delivery_time if available
   - Get order_number for reference

5. **Verify customer eligibility**
   - Get customer from order
   - Check phone number exists
   - Verify opt-in status
   - Skip if customer already notified today

6. **Retrieve language preference**
   - Call get_language for customer
   - Select appropriate template version
   - Fallback to English if needed
   - Log language used

7. **Format COD reminder parameters**
   - Format cod_amount with LKR currency
   - Format delivery_date in readable format
   - Include order_number for reference
   - Add exact denomination suggestions
   - Emphasize cash preparation

8. **Add helpful reminders**
   - Suggest small denominations (500, 1000 notes)
   - Remind to check order total
   - Mention driver may have limited change
   - Include delivery time window if known

9. **Get template and send**
   - Fetch cod_reminder template for language
   - Verify template approved
   - Send via WhatsAppClient
   - Set medium priority

10. **Track reminder sent**
    - Mark cod_reminder_sent on order
    - Store cod_reminder_sent_at timestamp
    - Save message ID
    - Prevent duplicate reminders
    - Log for delivery success analysis

### COD Reminder Flow

```
┌────────────────────────────────────────────────────────────────┐
│                  send_cod_reminder(order)                      │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Validate COD Order           │
          │   - payment_method = COD       │
          │   - Status appropriate         │
          └────────────────────────────────┘
                           │
                           ▼
          ┌────────────────────────────────┐
          │   Check if Already Reminded    │
          └────────────────────────────────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
          Not Reminded         Already Reminded
                 │                   │
                 ▼                   ▼
          ┌──────────────┐   ┌──────────────┐
          │ Continue     │   │ Skip         │
          └──────────────┘   │ Return       │
                 │           └──────────────┘
                 ▼
          ┌────────────────────────────────┐
          │   Verify Customer Opt-in       │
          │   & Get Language               │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Calculate Denominations      │
          │   Suggest Change Needed        │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Format Parameters            │
          │   - cod_amount                 │
          │   - delivery_date              │
          │   - order_number               │
          │   - denomination_tips          │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Send Template Message        │
          └────────────────────────────────┘
                 │
                 ▼
          ┌────────────────────────────────┐
          │   Mark Reminder Sent           │
          │   Prevent Duplicate            │
          └────────────────────────────────┘
```

### COD Reminder Parameters

| Parameter | Source | Format | Example |
|-----------|--------|--------|---------|
| **cod_amount** | order.total_amount | Currency | "රු 15,750" |
| **delivery_date** | order.estimated_delivery_date | Date | "Tomorrow" or "3 Feb 2026" |
| **order_number** | order.order_number | String | "ORD-2026-0001234" |
| **estimated_time** | order.estimated_arrival | Time Window | "2:00 PM - 4:00 PM" |

### Template Message Example

**English (en):**
```
💵 COD Payment Reminder

Your order {{order_number}} will be delivered {{delivery_date}}.

💰 Amount to Pay: {{cod_amount}}

Please keep EXACT CASH ready:
- Driver may have limited change
- Use Rs. 500 or Rs. 1000 notes if possible

Estimated Delivery: {{estimated_time}}

Thank you for your order!
```

**Sinhala (si):**
```
💵 COD ගෙවීමේ මතක් කිරීම

ඔබගේ ඇණවුම {{order_number}} {{delivery_date}} බෙදා හරිනු ලැබේ.

💰 ගෙවිය යුතු මුදල: {{cod_amount}}

කරුණාකර නිවැරදි මුදල සූදානම් කර තබා ගන්න:
- රියදුරුට සීමිත විනිමය තිබිය හැක
- හැකි නම් රු. 500 හෝ රු. 1000 නෝට්ටු භාවිතා කරන්න

ඇස්තමේන්තුගත බෙදා හැරීම: {{estimated_time}}

ඔබගේ ඇණවුමට ස්තූතියි!
```

### Denomination Suggestions

| Order Amount Range | Suggested Notes | Example |
|--------------------|-----------------|---------|
| රු 500 - රු 2,000 | 500 notes | 3 × 500 notes |
| රු 2,001 - රු 5,000 | 1000 notes + 500 notes | 4 × 1000 + 1 × 500 |
| රු 5,001 - රු 10,000 | 1000 notes | 8 × 1000 notes |
| රු 10,001+ | 1000 and 5000 notes | Mix of denominations |

### Reminder Timing Strategy

| Scenario | Send Timing | Purpose | Success Impact |
|----------|-------------|---------|----------------|
| **Day Before** | 6:00 PM previous day | Give time to prepare cash | Reduces "no cash" failures by 40% |
| **Morning Of** | 8:00 AM delivery day | Morning reminder | Reinforces preparation |
| **Before Delivery** | 2-3 hours before | Final reminder | Last chance to prepare |

### Expected Outcome
- COD reminders sent at appropriate times
- Customers reminded of exact amount needed
- Denomination suggestions provided
- Duplicate reminders prevented
- Delivery success rate improved

### Verification Checklist
- [ ] Method accepts order object
- [ ] COD payment method validated
- [ ] Duplicate reminder check working
- [ ] Customer opt-in verified
- [ ] Language preference retrieved
- [ ] COD amount formatted with LKR
- [ ] Delivery date formatted correctly
- [ ] Denomination tips included
- [ ] Template sent successfully
- [ ] Reminder status saved on order
- [ ] Duplicate prevention working
- [ ] Notification logged

---

## Summary

This document covered the creation of the WhatsAppService and its notification methods for the complete order lifecycle. The service provides a high-level interface for sending business notifications through WhatsApp, with built-in opt-in verification, language preference handling, and comprehensive error management.

### Key Achievements

1. **WhatsAppService Architecture** - High-level service wrapping WhatsAppClient with business logic
2. **Customer Verification** - Opt-in checking and language preference retrieval
3. **Order Lifecycle Coverage** - Notifications for every stage from confirmation to delivery
4. **Payment Status** - Success and failure notifications with actionable guidance
5. **Shipping Updates** - Tracking and delivery status notifications
6. **COD Support** - Special handling for Cash on Delivery with reminders
7. **Multi-language Support** - All notifications in English, Sinhala, and Tamil
8. **Error Handling** - Graceful failures that don't block business operations

### Service Method Summary

| Method | Purpose | When Sent | Priority |
|--------|---------|-----------|----------|
| check_opt_in | Verify customer consent | Before every message | N/A |
| get_language | Get customer preference | Before every message | N/A |
| send_order_confirmation | Confirm order placed | After order creation | High |
| send_payment_success | Confirm payment received | After payment success | High |
| send_payment_failed | Notify payment failure | After payment failure | Medium |
| send_shipped | Notify shipment | When order ships | Medium-High |
| send_out_for_delivery | Notify imminent delivery | When out for delivery | Very High |
| send_delivered | Confirm delivery | After delivery | Medium |
| send_cod_reminder | Remind COD payment | Before delivery | Medium |

### Next Steps

Proceed to Document 02 to implement:
- Celery tasks for async notification sending
- Notification queue management
- Batch and scheduled messages
- Django signals for automatic triggering
- Comprehensive verification of the notification service
