# Tasks 61-68: Advanced Handlers (Shipping, Store, Escalation, Registry)

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** D - Action Handlers  
> **Document:** 02 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-60_Base-Order-Product-Return.md](01_Tasks-51-60_Base-Order-Product-Return.md)
- **→ Next Group:** [Group-E_LLM-Integration](../Group-E_LLM-Integration/)

---

## Document Overview

This document covers the completion of the return handler with the initiate_return method, implementation of ShippingHandler, StoreInfoHandler, and EscalationHandler classes, creation of the ActionRegistry for handler lookup, and comprehensive verification of all handlers. These components complete the action handler system, enabling the chatbot to process all major customer service intents.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create initiate_return | Medium | 35 min |
| 62 | Create ShippingHandler | Medium | 30 min |
| 63 | Create StoreInfoHandler | Low | 20 min |
| 64 | Create EscalationHandler | Medium | 35 min |
| 65 | Create notify_agent | Medium | 30 min |
| 66 | Create ActionRegistry | Medium | 30 min |
| 67 | Create get_handler Method | Low | 15 min |
| 68 | Verify Handlers | Low | 25 min |

---

## Task 61: Create initiate_return Method

### Overview
Create the initiate_return method within ReturnHandler that processes return requests from customers. This method validates the return request, creates a ReturnRequest object in the database, generates a return authorization number, and provides customers with instructions for completing the return process.

### Dependencies
- Task 60: Create get_return_policy Method
- ReturnRequest model exists
- Return eligibility validation implemented

### Instructions

1. **Open returns.py file**
   - Navigate to ReturnHandler class
   - Position after get_return_policy method
   - Prepare to add return initiation method

2. **Define initiate_return method**
   - Method name: initiate_return
   - Parameter 1: self
   - Parameter 2: order_id (str or int)
   - Parameter 3: reason (str, optional)
   - Parameter 4: customer (Customer object)
   - Return type: ActionResponse
   - Add method docstring

3. **Retrieve order**
   - Query Order by order_id
   - Filter by tenant for isolation
   - Use select_related for order items
   - Catch ObjectDoesNotExist exception

4. **Verify customer ownership**
   - Check order.customer matches provided customer
   - Raise PermissionDenied if mismatch
   - Log security violation attempt
   - Return error response to customer

5. **Check return eligibility**
   - Call _check_return_eligibility(order) method
   - Verify order is within return window
   - Check order status is DELIVERED
   - Verify items haven't been returned already

6. **Calculate return window**
   - Get order delivery date
   - Get tenant return_policy_days configuration
   - Calculate days since delivery
   - Compare against policy window

7. **Handle ineligible returns**
   - If eligibility check fails, return ActionResponse with error
   - Explain specific reason for ineligibility
   - Include relevant policy information
   - Offer escalation to agent if appropriate

8. **Create ReturnRequest object**
   - Instantiate ReturnRequest model
   - Set order foreign key
   - Set customer foreign key
   - Set tenant foreign key
   - Set return_reason field

9. **Generate return authorization number**
   - Create unique return authorization (RA) number
   - Format: "RA-{year}{month}-{sequence}"
   - Example: "RA-202401-001234"
   - Store in return_authorization_number field

10. **Set return request status**
    - Set status to PENDING
    - Set requested_at to current timestamp
    - Calculate expected_refund_date
    - Save ReturnRequest to database

11. **Send confirmation email**
    - Trigger return confirmation email
    - Include return authorization number
    - Include return instructions
    - Include return shipping address

12. **Build return instructions**
    - Create clear step-by-step instructions
    - Include return authorization number prominently
    - Provide return shipping address
    - Explain inspection and refund timeline

13. **Create ActionResponse**
    - Message: Return confirmation with RA number
    - data: Return request details
    - actions: Print return label, view instructions
    - follow_up: Ask if customer needs help with packing

### Return Eligibility Validation

| Check | Pass Condition | Fail Response |
|-------|---------------|---------------|
| Order exists | Order found in database | "Order not found" |
| Customer ownership | order.customer == customer | "Order not found" (security) |
| Order status | status == DELIVERED | "Order must be delivered first" |
| Return window | days_since_delivery <= policy_days | "Return window expired on {date}" |
| Already returned | No existing return request | "Return already initiated for this order" |
| Item restrictions | No restricted items | "Some items cannot be returned" |

### Return Window Calculation

```
Order Delivery Date: 2024-01-10
Current Date: 2024-01-20
Days Elapsed: 10 days

Tenant Policy: 14 days
Window Remaining: 4 days
Eligible: Yes

Formula: current_date - delivery_date <= policy_days
```

### ReturnRequest Object Fields

| Field | Value | Description |
|-------|-------|-------------|
| order | Order FK | Order being returned |
| customer | Customer FK | Customer requesting return |
| tenant | Tenant FK | Tenant context |
| return_authorization_number | String | Unique RA number |
| return_reason | Text | Customer's reason |
| status | Enum | PENDING, APPROVED, REJECTED, COMPLETED |
| requested_at | DateTime | Request timestamp |
| expected_refund_date | Date | Estimated refund date |

### Return Authorization Number Format

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | RA- | RA- |
| Year-Month | YYYYMM | 202401 |
| Separator | - | - |
| Sequence | 6 digits | 001234 |
| Full Format | RA-YYYYMM-NNNNNN | RA-202401-001234 |

### Return Instructions Template

**Section 1: Confirmation**
| Component | Text |
|-----------|------|
| Headline | "Return request approved!" |
| RA Number | "Return Authorization: {ra_number}" |
| Order | "Order #{order_number}" |

**Section 2: Instructions**
| Step | Action |
|------|--------|
| 1 | Pack items securely in original packaging |
| 2 | Include return authorization number inside package |
| 3 | Include original order receipt if available |
| 4 | Ship to: {return_address} |
| 5 | Keep tracking number for your records |

**Section 3: Timeline**
| Event | Timeline |
|-------|----------|
| Inspection | 2-3 business days after receipt |
| Approval | 1 business day after inspection |
| Refund processing | 5-7 business days to original payment |

### ActionResponse Structure

**Success Response:**
| Field | Value |
|-------|-------|
| message | "Return request approved. RA: {ra_number}" |
| data.ra_number | Return authorization number |
| data.order_id | Order identifier |
| data.return_address | Shipping address for returns |
| data.refund_timeline | Expected refund timeframe |
| actions[0] | {type: "button", label: "Print Return Label"} |
| actions[1] | {type: "button", label: "View Return Instructions"} |
| follow_up | "Do you need help packing your return?" |

**Error Response (Expired Window):**
| Field | Value |
|-------|-------|
| message | "Return window has expired" |
| data.order_date | Original order date |
| data.return_deadline | Last date for return |
| data.days_elapsed | Days since delivery |
| success | False |
| actions[0] | {type: "button", label: "Contact Support"} |

### Expected Outcome
- initiate_return method implemented
- ReturnRequest objects created in database
- Return authorization numbers generated
- Comprehensive return instructions provided

### Verification Checklist
- [ ] Method signature correct
- [ ] Order retrieval with error handling
- [ ] Customer ownership verification
- [ ] Eligibility validation complete
- [ ] Return window calculation correct
- [ ] ReturnRequest object created
- [ ] RA number generated uniquely
- [ ] Return instructions clear and complete
- [ ] ActionResponse properly structured
- [ ] Email notification triggered

---

## Task 62: Create ShippingHandler

### Overview
Create the ShippingHandler class that processes SHIPPING intents. This handler provides customers with shipping information including delivery timeframes, shipping costs, tracking information, and shipping policies. It accesses tenant-specific shipping configuration and presents the information in a clear, customer-friendly format.

### Dependencies
- Task 53: Create ActionResponse
- Tenant shipping configuration exists
- Shipping zone data available

### Instructions

1. **Create shipping.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `shipping.py`
   - This module contains ShippingHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import Tenant model for configuration
   - Import shipping rate models if applicable
   - Import typing utilities

3. **Define ShippingHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "SHIPPING"
   - Add class docstring
   - Document expected entities: shipping_method, destination

4. **Implement handle method**
   - Override abstract handle method
   - Check entities for specific shipping method inquiry
   - Check entities for destination (for rate calculation)
   - Default to general shipping information

5. **Access tenant shipping configuration**
   - Get shipping methods from self.tenant
   - Access standard shipping timeframe
   - Access express shipping timeframe
   - Access free shipping threshold

6. **Format standard shipping information**
   - Include delivery timeframe (e.g., 3-5 business days)
   - Include cost (flat rate or calculation method)
   - Explain coverage areas
   - Note business days vs calendar days

7. **Format express shipping information**
   - Include delivery timeframe (e.g., 1-2 business days)
   - Include cost (typically higher)
   - Explain express cutoff times
   - Note availability by location

8. **Explain free shipping threshold**
   - If tenant offers free shipping above threshold
   - State the minimum order amount
   - Example: "Free shipping on orders over Rs. 5,000"
   - Clarify if restrictions apply

9. **Handle destination-specific inquiries**
   - If destination entity present, provide specific info
   - Check if location is within delivery area
   - Provide timeframe for that zone
   - Note any location-specific restrictions

10. **Build shipping policy message**
    - Structure information by shipping method
    - Use clear section headers
    - Format costs in local currency
    - Make timeframes prominent

11. **Add helpful examples**
    - Example: "Order today before 2 PM for next-day processing"
    - Example: "Colombo area: 1-2 days, Other areas: 3-5 days"
    - Make information concrete and actionable

12. **Create ActionResponse**
    - Message: Formatted shipping information
    - data: Structured shipping rates and timeframes
    - actions: "Calculate Shipping" for specific address
    - follow_up: Ask if customer needs help with order

### ShippingHandler Structure

```
ShippingHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "SHIPPING"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── _get_shipping_methods() → List[Dict]
│   ├── _calculate_shipping_cost(destination, weight) → Decimal
│   └── _format_shipping_message() → str
└── Helper Methods
    ├── _format_timeframe(days)
    └── _format_cost(amount)
```

### Tenant Shipping Configuration

| Configuration | Type | Description |
|--------------|------|-------------|
| standard_shipping_days | int | Business days for standard |
| express_shipping_days | int | Business days for express |
| standard_shipping_cost | Decimal | Flat rate for standard |
| express_shipping_cost | Decimal | Flat rate for express |
| free_shipping_threshold | Decimal | Minimum for free shipping |
| shipping_zones | JSON | Zone-specific configurations |

### Shipping Methods Table

| Method | Timeframe | Cost | Notes |
|--------|-----------|------|-------|
| Standard | 3-5 business days | Rs. 300 | Most orders |
| Express | 1-2 business days | Rs. 600 | Premium service |
| Same Day | Same business day | Rs. 1,200 | Metro areas only, order by 10 AM |
| Free | 3-5 business days | Free | Orders above Rs. 5,000 |

### Shipping Zones Example (Sri Lanka)

| Zone | Areas | Standard | Express |
|------|-------|----------|---------|
| Zone 1 | Colombo Metro | 1-2 days | Next day |
| Zone 2 | Western Province | 2-3 days | 1-2 days |
| Zone 3 | Major Cities | 3-4 days | 2-3 days |
| Zone 4 | Other Areas | 4-5 days | 3-4 days |

### Response Message Template

**Header:**
| Component | Text |
|-----------|------|
| Greeting | "Here's our shipping information:" |

**Standard Shipping:**
| Component | Text |
|-----------|------|
| Name | "Standard Shipping" |
| Timeframe | "3-5 business days" |
| Cost | "Rs. 300 per order" |
| Coverage | "Available nationwide" |

**Express Shipping:**
| Component | Text |
|-----------|------|
| Name | "Express Shipping" |
| Timeframe | "1-2 business days" |
| Cost | "Rs. 600 per order" |
| Coverage | "Available in major cities" |

**Free Shipping:**
| Component | Text |
|-----------|------|
| Threshold | "Free shipping on orders over Rs. 5,000" |
| Method | "Standard shipping" |
| Timeline | "3-5 business days" |

### Expected Outcome
- ShippingHandler class implemented
- handle method provides shipping information
- Tenant-specific configuration accessed
- Clear, formatted shipping policy message

### Verification Checklist
- [ ] shipping.py file created
- [ ] ShippingHandler inherits from ActionHandler
- [ ] intent_name set to "SHIPPING"
- [ ] handle method implemented
- [ ] Tenant configuration accessed
- [ ] All shipping methods documented
- [ ] Costs formatted in local currency
- [ ] Timeframes clearly stated
- [ ] Free shipping threshold included
- [ ] ActionResponse properly constructed

---

## Task 63: Create StoreInfoHandler

### Overview
Create the StoreInfoHandler class that processes STORE_INFO intents. This handler provides customers with essential store information including business name, contact details, business hours, address, and other relevant store information. All data is retrieved from tenant configuration, ensuring each store displays its own information in the multi-tenant system.

### Dependencies
- Task 53: Create ActionResponse
- Tenant model includes store information fields

### Instructions

1. **Create store_info.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `store_info.py`
   - This module contains StoreInfoHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import timezone utilities for hours formatting
   - Import typing utilities

3. **Define StoreInfoHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "STORE_INFO"
   - Add class docstring
   - Document that this handler requires no entities

4. **Implement handle method**
   - Override abstract handle method
   - Check entities for specific info type (hours, address, contact)
   - Default to comprehensive store information
   - Retrieve all relevant tenant fields

5. **Access tenant store information**
   - Get store name from self.tenant.name
   - Get business_hours from tenant
   - Get phone number from tenant
   - Get email address from tenant
   - Get physical address from tenant

6. **Format store name**
   - Use tenant's display name
   - Include in response header
   - Example: "LankaCommerce Cloud"

7. **Format business hours**
   - Parse business_hours field (JSON or structured format)
   - Convert to readable format
   - Handle different hour formats (24-hour, 12-hour)
   - Group similar days (Mon-Fri: 9 AM - 6 PM)

8. **Format contact information**
   - Format phone number for display
   - Include international format if applicable
   - Display email address
   - Add website URL if available

9. **Format physical address**
   - Include street address
   - Include city and postal code
   - Include province/state
   - Include country
   - Format as multi-line address

10. **Handle specific inquiries**
    - If entities include "hours", focus on business hours
    - If entities include "phone", emphasize contact details
    - If entities include "address", emphasize location
    - Otherwise provide comprehensive information

11. **Build store info message**
    - Structure with clear sections
    - Use section headers
    - Format for readability
    - Include all relevant information

12. **Add helpful actions**
    - "Get Directions" action with map link
    - "Call Us" action with tel: link
    - "Email Us" action with mailto: link
    - "Visit Website" if applicable

13. **Create ActionResponse**
    - Message: Formatted store information
    - data: Structured store details
    - actions: Contact and location actions
    - follow_up: "How else can I help you?"

### StoreInfoHandler Structure

```
StoreInfoHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "STORE_INFO"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── _format_business_hours(hours) → str
│   ├── _format_address(address_fields) → str
│   └── _format_contact_info() → str
└── Helper Methods
    ├── _parse_hours_json(hours_data)
    └── _build_contact_actions()
```

### Tenant Store Information Fields

| Field | Type | Description |
|-------|------|-------------|
| name | str | Store/business name |
| business_hours | JSON | Operating hours by day |
| phone | str | Primary phone number |
| email | str | Customer support email |
| address_line1 | str | Street address |
| address_line2 | str | Suite/unit number |
| city | str | City name |
| state_province | str | Province |
| postal_code | str | Postal/ZIP code |
| country | str | Country |
| website | str | Store website URL |

### Business Hours Format Examples

**JSON Structure:**
```
{
  "monday": {"open": "09:00", "close": "18:00"},
  "tuesday": {"open": "09:00", "close": "18:00"},
  "wednesday": {"open": "09:00", "close": "18:00"},
  "thursday": {"open": "09:00", "close": "18:00"},
  "friday": {"open": "09:00", "close": "18:00"},
  "saturday": {"open": "10:00", "close": "15:00"},
  "sunday": {"closed": true}
}
```

**Formatted Display:**
| Day(s) | Hours |
|--------|-------|
| Monday - Friday | 9:00 AM - 6:00 PM |
| Saturday | 10:00 AM - 3:00 PM |
| Sunday | Closed |

### Store Information Response Template

**Header:**
| Component | Text |
|-----------|------|
| Store Name | "{tenant.name}" |
| Tagline | "We're here to help!" |

**Contact Information:**
| Field | Format |
|-------|--------|
| Phone | "📞 {phone}" |
| Email | "📧 {email}" |
| Website | "🌐 {website}" |

**Business Hours:**
| Component | Text |
|-----------|------|
| Header | "Business Hours" |
| Weekdays | "Monday - Friday: 9 AM - 6 PM" |
| Weekend | "Saturday: 10 AM - 3 PM" |
| Closed | "Sunday: Closed" |

**Address:**
| Component | Text |
|-----------|------|
| Header | "Visit Us" |
| Line 1 | "{address_line1}" |
| Line 2 | "{city}, {province} {postal_code}" |
| Country | "{country}" |

### Action Buttons

| Action | Type | Data |
|--------|------|------|
| Get Directions | external_link | Google Maps URL with address |
| Call Us | phone_link | tel:{phone_number} |
| Email Us | email_link | mailto:{email} |
| Visit Website | external_link | {website_url} |

### Expected Outcome
- StoreInfoHandler class implemented
- handle method retrieves tenant information
- All store details formatted clearly
- Contact actions provided

### Verification Checklist
- [ ] store_info.py file created
- [ ] StoreInfoHandler inherits from ActionHandler
- [ ] intent_name set to "STORE_INFO"
- [ ] handle method implemented
- [ ] All tenant fields accessed
- [ ] Business hours formatted properly
- [ ] Address formatted as multi-line
- [ ] Contact information included
- [ ] Action buttons for contact created
- [ ] ActionResponse properly constructed

---

## Task 64: Create EscalationHandler

### Overview
Create the EscalationHandler class that processes ESCALATE intents. This handler manages the transition from automated chatbot interaction to human agent support. It creates support tickets, notifies available agents, provides customers with confirmation and expected response times, and ensures seamless handoff of conversation context.

### Dependencies
- Task 53: Create ActionResponse
- Support ticket system exists
- Agent notification system available

### Instructions

1. **Create escalation.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `escalation.py`
   - This module contains EscalationHandler implementation

2. **Import required dependencies**
   - Import ActionHandler and ActionResponse from base
   - Import SupportTicket model (create if doesn't exist)
   - Import notification utilities (email, SMS)
   - Import Conversation model
   - Import Agent/Staff user model

3. **Define EscalationHandler class**
   - Create class that inherits from ActionHandler
   - Set intent_name class attribute to "ESCALATE"
   - Add class docstring
   - Document that this handler initiates human handoff

4. **Implement handle method**
   - Override abstract handle method
   - Access conversation from context
   - Extract escalation reason from entities if available
   - Create support ticket
   - Notify available agents
   - Update conversation status

5. **Update conversation status**
   - Set conversation.status to ESCALATED
   - Set conversation.escalated_at timestamp
   - Save conversation to database
   - This prevents bot from responding further

6. **Extract escalation context**
   - Get conversation history from context
   - Get customer information
   - Get current intent and entities
   - Get any unresolved issues
   - Compile for agent review

7. **Call notify_agent method**
   - Invoke notify_agent with conversation
   - Pass support ticket information
   - Handle notification success/failure
   - Log notification attempt

8. **Build customer confirmation message**
   - Acknowledge escalation request
   - Confirm ticket creation with ticket number
   - Provide expected response time
   - Offer alternative contact methods

9. **Create ActionResponse**
   - Message: Escalation confirmation
   - data: Support ticket details
   - actions: View ticket status
   - success: true

10. **Handle escalation errors**
    - If ticket creation fails, inform customer
    - Provide alternative contact methods
    - Log error with details
    - Maintain professional tone

### EscalationHandler Structure

```
EscalationHandler(ActionHandler)
├── Class Attributes
│   └── intent_name = "ESCALATE"
├── Methods
│   ├── handle(intent, entities, context) → ActionResponse
│   ├── notify_agent(conversation, ticket) → bool
│   ├── _create_support_ticket(conversation, reason) → SupportTicket
│   └── _compile_escalation_context(conversation) → Dict
└── Helper Methods
    ├── _find_available_agent() → Optional[Agent]
    ├── _format_confirmation_message(ticket) → str
    └── _get_expected_response_time() → str
```

### Conversation Status Update

| Field | Before | After |
|-------|--------|-------|
| status | ACTIVE | ESCALATED |
| escalated_at | NULL | Current timestamp |
| escalated_by | NULL | Bot identifier |
| escalation_reason | NULL | Reason text |

### Support Ticket Fields

| Field | Type | Description |
|-------|------|-------------|
| ticket_number | str | Unique ticket identifier |
| conversation | FK | Link to conversation |
| customer | FK | Customer requesting help |
| tenant | FK | Tenant context |
| subject | str | Auto-generated subject |
| description | text | Escalation reason + context |
| status | enum | OPEN, ASSIGNED, RESOLVED, CLOSED |
| priority | enum | LOW, MEDIUM, HIGH, URGENT |
| created_at | datetime | Ticket creation time |
| assigned_to | FK | Agent assigned (nullable) |

### Ticket Priority Assignment

| Criteria | Priority |
|----------|----------|
| Conversation has >10 messages | HIGH |
| Customer mentioned "urgent" | HIGH |
| Payment/order issue | HIGH |
| General inquiry | MEDIUM |
| Returns/shipping question | MEDIUM |
| Default | MEDIUM |

### Escalation Context Package

| Component | Content |
|-----------|---------|
| Conversation History | Last 10 messages |
| Customer Info | Name, email, customer_id |
| Current Intent | Intent that triggered escalation |
| Extracted Entities | All entities from conversation |
| Order Context | Related orders if any |
| Product Context | Products discussed if any |
| Session Duration | How long conversation lasted |

### Expected Outcome
- EscalationHandler class implemented
- handle method creates support tickets
- Conversation status updated to ESCALATED
- Foundation for notify_agent method (Task 65)

### Verification Checklist
- [ ] escalation.py file created
- [ ] EscalationHandler inherits from ActionHandler
- [ ] intent_name set to "ESCALATE"
- [ ] handle method implemented
- [ ] Conversation status update logic
- [ ] Support ticket creation logic
- [ ] Escalation context compilation
- [ ] Customer confirmation message
- [ ] Error handling for failed escalation
- [ ] ActionResponse properly constructed

---

## Task 65: Create notify_agent Method

### Overview
Create the notify_agent method within EscalationHandler that sends notifications to available human agents about escalated conversations. This method finds available agents, sends notifications via multiple channels (email, SMS, dashboard alert), and tracks notification delivery to ensure agents are promptly informed of customer needs.

### Dependencies
- Task 64: Create EscalationHandler
- Email notification system configured
- SMS notification system available (optional)

### Instructions

1. **Open escalation.py file**
   - Navigate to EscalationHandler class
   - Position after handle method
   - Prepare to add agent notification method

2. **Define notify_agent method**
   - Method name: notify_agent
   - Parameter 1: self
   - Parameter 2: conversation (Conversation object)
   - Parameter 3: ticket (SupportTicket object)
   - Return type: bool (success/failure)
   - Add method docstring

3. **Find available agents**
   - Query for agents/staff users in this tenant
   - Filter by is_active=True
   - Filter by is_available=True if field exists
   - Order by current workload (fewest assigned tickets)
   - Limit to agents with appropriate permissions

4. **Select primary agent**
   - If available agents exist, select first (least busy)
   - Assign ticket to this agent
   - Update ticket.assigned_to field
   - Log agent assignment

5. **Handle no available agents**
   - If no agents available, proceed with notification anyway
   - Notification goes to all agents for manual pickup
   - Set ticket status to UNASSIGNED
   - Log no agent available situation

6. **Build notification content**
   - Subject: "New support request: {ticket_number}"
   - Include customer name and contact info
   - Include escalation reason
   - Include conversation summary
   - Include direct link to ticket/conversation

7. **Send email notification**
   - Use Django email utilities
   - Send to assigned agent's email
   - If no assigned agent, send to support team email
   - Include ticket details and conversation link
   - Use HTML template for formatting

8. **Send SMS notification (if configured)**
   - Check if SMS notifications enabled in tenant config
   - Check if agent has phone number
   - Send brief SMS with ticket number and link
   - Handle SMS service failures gracefully

9. **Create dashboard notification**
   - Create in-app notification record
   - Notification appears in agent dashboard
   - Include link to ticket
   - Set notification priority based on ticket priority

10. **Log notification attempts**
    - Log email sent successfully
    - Log SMS sent if applicable
    - Log any notification failures
    - Store notification metadata with ticket

11. **Update ticket with notification info**
    - Set ticket.agent_notified = True
    - Set ticket.notified_at = current timestamp
    - Save notification delivery status
    - Save ticket to database

12. **Return success status**
    - Return True if any notification succeeded
    - Return False only if all notifications failed
    - Calling method can handle failure appropriately

### Agent Selection Query

```
Priority Order:
1. Is active (is_active=True)
2. Is available (is_available=True)
3. Has fewest assigned open tickets
4. Has handled tickets recently (experienced)
5. Is in same timezone as customer (if tracked)

Query:
User.objects.filter(
    tenant=self.tenant,
    is_active=True,
    is_staff=True,
    is_available=True
).annotate(
    open_tickets=Count('assigned_tickets', filter=Q(assigned_tickets__status='OPEN'))
).order_by('open_tickets')
```

### Email Notification Template

**Subject:**
```
New Support Request: {ticket_number} - {customer_name}
```

**Body Structure:**
| Section | Content |
|---------|---------|
| Greeting | "Hi {agent_name}," |
| Alert | "A customer needs your help!" |
| Customer | "Customer: {customer_name} ({customer_email})" |
| Ticket | "Ticket #: {ticket_number}" |
| Priority | "Priority: {priority}" |
| Reason | "Reason: {escalation_reason}" |
| Context | "Conversation summary: {summary}" |
| Action | "View Ticket: {ticket_url}" |
| Closing | "Please respond within {sla_time}" |

### SMS Notification Template

```
New support ticket {ticket_number} from {customer_name}. 
Priority: {priority}. 
View: {short_url}
```

### Dashboard Notification Object

| Field | Value |
|-------|-------|
| recipient | Agent user object |
| notification_type | TICKET_ASSIGNED |
| title | "New support ticket assigned" |
| message | "{customer_name} needs help with {reason}" |
| link | "/support/tickets/{ticket_id}" |
| priority | Matches ticket priority |
| read | False |
| created_at | Current timestamp |

### Notification Channels

| Channel | Priority | Fallback |
|---------|----------|----------|
| Dashboard | High | Always sent |
| Email | High | Log if fails |
| SMS | Medium | Optional, log if fails |
| Push Notification | Low | If mobile app exists |

### Agent Assignment Update

| Field | Value |
|-------|-------|
| ticket.assigned_to | Selected agent user |
| ticket.assigned_at | Current timestamp |
| ticket.status | ASSIGNED |
| ticket.agent_notified | True |
| ticket.notified_at | Current timestamp |

### Notification Success Criteria

| Scenario | Return Value |
|----------|--------------|
| Email sent successfully | True |
| SMS sent successfully | True |
| Dashboard notification created | True |
| All notifications failed | False |
| No agents available but email to team sent | True |

### Expected Outcome
- notify_agent method implemented
- Available agent selection logic
- Multi-channel notifications sent
- Ticket assignment completed

### Verification Checklist
- [ ] Method signature correct
- [ ] Agent query implemented with filters
- [ ] Agent selection based on workload
- [ ] Email notification sent
- [ ] SMS notification sent (if configured)
- [ ] Dashboard notification created
- [ ] Ticket assigned_to field updated
- [ ] Notification timestamps recorded
- [ ] Error handling for failed notifications
- [ ] Success/failure return value
- [ ] Comprehensive logging

---

## Task 66: Create ActionRegistry

### Overview
Create the ActionRegistry class that implements the registry pattern for action handlers. This registry maintains a mapping of intent names to handler classes, provides handler instantiation with dependency injection, enables dynamic handler registration, and serves as the central lookup mechanism for the conversation manager to route intents to appropriate handlers.

### Dependencies
- Task 65: Create notify_agent Method
- All handler classes implemented
- Registry pattern understood

### Instructions

1. **Create registry.py file**
   - Navigate to `backend/apps/chatbot/handlers/` directory
   - Create new file named `registry.py`
   - This module contains ActionRegistry implementation

2. **Import all handler classes**
   - Import OrderStatusHandler from order_status
   - Import ProductInfoHandler from product_info
   - Import ReturnHandler from returns
   - Import ShippingHandler from shipping
   - Import StoreInfoHandler from store_info
   - Import EscalationHandler from escalation

3. **Define ActionRegistry class**
   - Create class (not inheriting from anything)
   - Add class docstring explaining registry purpose
   - Implement Singleton pattern (optional but recommended)
   - Store registry as class-level dictionary

4. **Create registry class attribute**
   - Define _handlers class attribute as dict
   - Maps intent names (str) to handler classes
   - Initialize as empty dict
   - Will be populated during registration

5. **Implement __init__ method**
   - Accept tenant parameter
   - Store tenant for handler instantiation
   - Initialize instance-level handler cache
   - Cache prevents repeated instantiation

6. **Implement register method**
   - Class method or static method
   - Parameter: handler_class
   - Extract intent_name from handler_class
   - Store in _handlers dict: {intent_name: handler_class}
   - Allow registration of custom handlers

7. **Register all built-in handlers**
   - Call register for OrderStatusHandler
   - Call register for ProductInfoHandler
   - Call register for ReturnHandler
   - Call register for ShippingHandler
   - Call register for StoreInfoHandler
   - Call register for EscalationHandler
   - Do this in module initialization or class definition

8. **Implement get_handler method**
   - Accept intent_name parameter
   - Check if handler cached in instance
   - If cached, return cached instance
   - If not cached, instantiate from registry
   - Cache the instance for reuse

9. **Handle handler instantiation**
   - Retrieve handler class from _handlers dict
   - Instantiate with tenant: handler_class(self.tenant)
   - Store in instance cache
   - Return handler instance

10. **Handle unknown intents**
    - If intent_name not in _handlers
    - Raise UnknownIntentError with helpful message
    - Include list of registered intents
    - Log unknown intent attempt

11. **Implement list_handlers method**
    - Return list of registered intent names
    - Useful for debugging and documentation
    - Can include handler class names

12. **Add validation**
    - Validate handler classes have intent_name attribute
    - Validate handler classes inherit from ActionHandler
    - Raise ValueError if invalid handler registered

### ActionRegistry Structure

```
ActionRegistry
├── Class Attributes
│   └── _handlers: Dict[str, Type[ActionHandler]]
├── Constructor
│   └── __init__(tenant)
├── Methods
│   ├── register(handler_class) [classmethod]
│   ├── get_handler(intent_name) → ActionHandler
│   ├── list_handlers() → List[str]
│   └── is_registered(intent_name) → bool
└── Internal
    ├── _handler_cache: Dict[str, ActionHandler]
    └── tenant: Tenant
```

### Handler Registration

```
Initialization Flow:
1. ActionRegistry class is defined
2. register() called for each handler class
3. intent_name extracted from handler_class
4. Mapping stored: {intent_name: handler_class}

Registration in Code:
ActionRegistry.register(OrderStatusHandler)
ActionRegistry.register(ProductInfoHandler)
ActionRegistry.register(ReturnHandler)
...

Result:
_handlers = {
    "ORDER_STATUS": OrderStatusHandler,
    "PRODUCT_INFO": ProductInfoHandler,
    "RETURNS": ReturnHandler,
    "SHIPPING": ShippingHandler,
    "STORE_INFO": StoreInfoHandler,
    "ESCALATE": EscalationHandler,
}
```

### Registry Mapping Table

| Intent Name | Handler Class | Module |
|-------------|---------------|--------|
| ORDER_STATUS | OrderStatusHandler | order_status.py |
| PRODUCT_INFO | ProductInfoHandler | product_info.py |
| RETURNS | ReturnHandler | returns.py |
| SHIPPING | ShippingHandler | shipping.py |
| STORE_INFO | StoreInfoHandler | store_info.py |
| ESCALATE | EscalationHandler | escalation.py |
| GREETING | GreetingHandler | greeting.py (if exists) |
| FAREWELL | FarewellHandler | farewell.py (if exists) |

### Handler Instantiation Flow

```
Request Flow:
1. Conversation manager classifies intent
2. Intent name: "ORDER_STATUS"
3. Call: registry.get_handler("ORDER_STATUS")
4. Registry checks cache for tenant-specific instance
5. If not cached:
   a. Retrieve class from _handlers
   b. Instantiate: OrderStatusHandler(tenant)
   c. Cache instance
6. Return handler instance
7. Conversation manager calls: handler.handle(intent, entities, context)
```

### Handler Cache Structure

```
Instance-level cache (per tenant):
_handler_cache = {
    "ORDER_STATUS": <OrderStatusHandler instance>,
    "PRODUCT_INFO": <ProductInfoHandler instance>,
    "RETURNS": <ReturnHandler instance>,
    ...
}

Benefits:
- Handlers instantiated once per tenant
- Reduces overhead
- Maintains handler state if needed
```

### Error Handling

| Scenario | Exception | Message |
|----------|-----------|---------|
| Unknown intent | UnknownIntentError | "Intent '{name}' not registered" |
| Invalid handler | ValueError | "Handler must inherit from ActionHandler" |
| Missing intent_name | AttributeError | "Handler must define intent_name" |
| Duplicate registration | Warning | "Handler '{name}' already registered" |

### Expected Outcome
- ActionRegistry class implemented
- All handlers registered in mapping
- get_handler method returns handler instances
- Foundation for get_handler details (Task 67)

### Verification Checklist
- [ ] registry.py file created
- [ ] ActionRegistry class defined
- [ ] _handlers class attribute (dict)
- [ ] register method implemented
- [ ] All built-in handlers registered
- [ ] get_handler method defined
- [ ] Handler instantiation with tenant
- [ ] Handler caching implemented
- [ ] Unknown intent error handling
- [ ] list_handlers method for debugging

---

## Task 67: Create get_handler Method

### Overview
Create the get_handler method within ActionRegistry that retrieves the appropriate handler instance for a given intent name. This method implements lazy instantiation with caching, performs intent name validation, handles unknown intents gracefully, and serves as the primary interface for the conversation manager to access handlers.

### Dependencies
- Task 66: Create ActionRegistry

### Instructions

1. **Open registry.py file**
   - Navigate to ActionRegistry class
   - Locate method definitions section
   - Position after register method

2. **Define get_handler method**
   - Method name: get_handler
   - Parameter 1: self
   - Parameter 2: intent_name (str)
   - Return type: ActionHandler
   - Add method docstring

3. **Normalize intent name**
   - Convert intent_name to uppercase
   - Strip whitespace
   - Ensure consistent format matching registry keys
   - Log normalized intent name

4. **Check instance cache**
   - Look for intent_name in self._handler_cache
   - If found, return cached handler instance
   - Log cache hit for debugging
   - Skip instantiation if cached

5. **Check intent registration**
   - Look for intent_name in self._handlers
   - If not found, proceed to error handling
   - Log intent lookup attempt

6. **Handle unknown intent**
   - If intent_name not in _handlers
   - Create UnknownIntentError exception
   - Include intent_name in error message
   - Include list of registered intents in error
   - Log error with WARNING level
   - Raise exception

7. **Retrieve handler class**
   - Get handler class from _handlers dict
   - handler_class = self._handlers[intent_name]
   - Verify class is not None

8. **Instantiate handler**
   - Call handler class constructor with tenant
   - handler_instance = handler_class(self.tenant)
   - Handle instantiation errors
   - Log successful instantiation

9. **Cache handler instance**
   - Store in self._handler_cache
   - Key: intent_name, Value: handler_instance
   - Enables reuse for subsequent requests
   - Log cache storage

10. **Return handler instance**
    - Return the handler instance
    - Handler is ready to call handle() method
    - Log handler retrieval success

11. **Add error handling**
    - Wrap instantiation in try-except
    - Catch TypeError (invalid constructor signature)
    - Catch other instantiation errors
    - Log error details
    - Raise appropriate exception with context

12. **Add logging throughout**
    - Log intent name lookups
    - Log cache hits/misses
    - Log handler instantiation
    - Log errors and exceptions
    - Use appropriate log levels

### get_handler Method Flow Diagram

```
get_handler("ORDER_STATUS")
    │
    ├──> Normalize intent name
    │    └──> "ORDER_STATUS" (uppercase, stripped)
    │
    ├──> Check cache
    │    ├──> Cache hit? ──Yes──> Return cached instance
    │    └──> Cache miss ──────────┐
    │                               │
    ├──> Check registration ◄───────┘
    │    ├──> Registered? ──No──> Raise UnknownIntentError
    │    └──> Registered ──────────┐
    │                               │
    ├──> Retrieve class ◄───────────┘
    │    └──> OrderStatusHandler class
    │
    ├──> Instantiate handler
    │    └──> OrderStatusHandler(tenant)
    │
    ├──> Cache instance
    │    └──> _handler_cache["ORDER_STATUS"] = instance
    │
    └──> Return handler instance
```

### Intent Name Normalization

| Input | Normalized | Result |
|-------|------------|--------|
| "order_status" | "ORDER_STATUS" | Match |
| "Order_Status" | "ORDER_STATUS" | Match |
| " ORDER_STATUS " | "ORDER_STATUS" | Match |
| "product-info" | "PRODUCT-INFO" | No match (underscore vs hyphen) |

### Cache Behavior

| Scenario | Cache State | Action |
|----------|-------------|--------|
| First call | Empty | Instantiate, cache, return |
| Second call (same intent) | Contains instance | Return from cache |
| Second call (different intent) | Contains other instances | Instantiate new, cache, return |
| 100th call | Contains all used handlers | Return from cache |

### Error Scenarios and Responses

**Unknown Intent:**
```
Intent: "UNKNOWN_INTENT"
Exception: UnknownIntentError
Message: "Intent 'UNKNOWN_INTENT' is not registered. 
         Available intents: ['ORDER_STATUS', 'PRODUCT_INFO', 
         'RETURNS', 'SHIPPING', 'STORE_INFO', 'ESCALATE']"
```

**Invalid Handler Constructor:**
```
Scenario: Handler class requires extra parameters
Exception: TypeError
Message: "Failed to instantiate handler for intent 'ORDER_STATUS': 
         __init__() missing required positional argument"
```

**Handler Not ActionHandler:**
```
Scenario: Registered class doesn't inherit from ActionHandler
Exception: TypeError
Message: "Handler for 'ORDER_STATUS' must inherit from ActionHandler"
```

### Return Type Guarantees

| Condition | Return |
|-----------|--------|
| Valid intent, first call | New handler instance |
| Valid intent, subsequent call | Cached handler instance |
| Unknown intent | Raises exception (never returns) |
| Instantiation error | Raises exception (never returns) |

### Logging Examples

**Cache Hit:**
```
DEBUG: get_handler called for intent: ORDER_STATUS
DEBUG: Handler found in cache for ORDER_STATUS
DEBUG: Returning cached handler instance
```

**Cache Miss:**
```
DEBUG: get_handler called for intent: PRODUCT_INFO
DEBUG: Handler not in cache for PRODUCT_INFO
DEBUG: Retrieving handler class from registry
DEBUG: Instantiating ProductInfoHandler with tenant: TenantXYZ
DEBUG: Caching handler instance for PRODUCT_INFO
DEBUG: Returning new handler instance
```

**Unknown Intent:**
```
WARNING: Unknown intent requested: FAKE_INTENT
WARNING: Registered intents: ['ORDER_STATUS', 'PRODUCT_INFO', ...]
ERROR: Raising UnknownIntentError for FAKE_INTENT
```

### Expected Outcome
- get_handler method fully implemented
- Intent name normalization
- Cache check and storage
- Handler instantiation with error handling
- Comprehensive logging

### Verification Checklist
- [ ] Method signature correct
- [ ] Intent name normalization
- [ ] Cache check implemented
- [ ] Cache storage after instantiation
- [ ] Handler class retrieval from _handlers
- [ ] Handler instantiation with tenant
- [ ] UnknownIntentError for unknown intents
- [ ] Error handling for instantiation failures
- [ ] Type validation for handler class
- [ ] Comprehensive logging at all steps
- [ ] Return type matches specification

---

## Task 68: Verify Handlers

### Overview
Create comprehensive verification tests for all action handlers and the ActionRegistry. This task ensures that all handlers are properly registered, can be instantiated correctly, handle their respective intents appropriately, and produce valid ActionResponse objects. Verification includes unit tests, integration tests, and manual testing procedures.

### Dependencies
- Task 67: Create get_handler Method
- All handlers implemented
- Test framework configured

### Instructions

1. **Create test file**
   - Navigate to `backend/apps/chatbot/tests/` directory
   - Create file named `test_action_handlers.py`
   - Import necessary testing utilities
   - Import all handler classes and ActionRegistry

2. **Set up test fixtures**
   - Create test tenant instance
   - Create test customer instance
   - Create test order for OrderStatusHandler tests
   - Create test products for ProductInfoHandler tests
   - Set up test conversation context

3. **Test ActionRegistry registration**
   - Verify all handlers are registered
   - Test list_handlers() returns correct intents
   - Verify handler count matches expected
   - Test is_registered() for each intent

4. **Test handler instantiation**
   - Instantiate each handler via registry
   - Verify handler is correct class
   - Verify handler has tenant attribute
   - Verify handler has correct intent_name

5. **Test get_handler method**
   - Test retrieval of each handler type
   - Verify caching works (same instance returned)
   - Test unknown intent raises UnknownIntentError
   - Test case-insensitive intent names

6. **Test OrderStatusHandler**
   - Create mock Intent and entities
   - Test with valid order_id entity
   - Verify ActionResponse structure
   - Verify order data in response.data
   - Test with invalid order_id
   - Test with order belonging to different customer

7. **Test ProductInfoHandler**
   - Test with valid product_name entity
   - Test with valid product_id entity
   - Verify fuzzy matching works
   - Test with unknown product
   - Verify response includes product data

8. **Test ReturnHandler**
   - Test get_return_policy (no entities)
   - Test initiate_return with order_id
   - Verify eligibility checking
   - Test with expired return window
   - Verify ReturnRequest created

9. **Test ShippingHandler**
   - Test with no entities (general info)
   - Test with shipping_method entity
   - Verify response includes shipping methods
   - Verify costs formatted correctly

10. **Test StoreInfoHandler**
    - Test with no entities
    - Verify all tenant info included
    - Verify business hours formatted
    - Verify address formatted

11. **Test EscalationHandler**
    - Test handle creates support ticket
    - Verify conversation status updated to ESCALATED
    - Verify notify_agent called
    - Verify ActionResponse includes ticket number

12. **Test ActionResponse validation**
    - Verify all responses have message field
    - Verify success field is boolean
    - Verify data field is dict or None
    - Verify actions field is list or None

13. **Test error handling**
    - Test handlers with missing required entities
    - Test handlers with invalid data
    - Verify error messages are user-friendly
    - Verify errors logged appropriately

14. **Test multi-tenancy**
    - Create two tenant instances
    - Verify handlers respect tenant boundaries
    - Verify orders from tenant A not visible to tenant B
    - Verify registry maintains separate handler instances

15. **Create verification checklist**
    - Document all test cases
    - Document expected outcomes
    - Create manual testing guide
    - Document any known issues

### Test Structure

```
test_action_handlers.py
├── TestActionRegistry
│   ├── test_registration
│   ├── test_get_handler
│   ├── test_unknown_intent
│   └── test_handler_caching
├── TestOrderStatusHandler
│   ├── test_handle_valid_order
│   ├── test_handle_invalid_order
│   ├── test_customer_authorization
│   └── test_response_format
├── TestProductInfoHandler
│   ├── test_handle_by_name
│   ├── test_handle_by_id
│   ├── test_fuzzy_matching
│   └── test_unknown_product
├── TestReturnHandler
│   ├── test_get_policy
│   ├── test_initiate_return
│   ├── test_eligibility_checks
│   └── test_return_request_creation
├── TestShippingHandler
│   ├── test_general_info
│   └── test_response_format
├── TestStoreInfoHandler
│   ├── test_info_retrieval
│   └── test_response_format
└── TestEscalationHandler
    ├── test_ticket_creation
    ├── test_status_update
    └── test_notification
```

### Verification Checklist

**Registry Verification:**
- [ ] All handlers registered in ActionRegistry
- [ ] get_handler returns correct handler class
- [ ] get_handler caches handler instances
- [ ] Unknown intents raise UnknownIntentError
- [ ] list_handlers returns complete list

**OrderStatusHandler Verification:**
- [ ] Handles ORDER_STATUS intent
- [ ] Retrieves order from database
- [ ] Verifies customer ownership
- [ ] Formats order status correctly
- [ ] Returns valid ActionResponse
- [ ] Includes tracking info when available
- [ ] Handles order not found error
- [ ] Handles unauthorized access error

**ProductInfoHandler Verification:**
- [ ] Handles PRODUCT_INFO intent
- [ ] Searches by product ID
- [ ] Searches by product name
- [ ] Fuzzy matching works
- [ ] Returns valid ActionResponse
- [ ] Includes product data
- [ ] Handles product not found
- [ ] Stock status displayed correctly

**ReturnHandler Verification:**
- [ ] Handles RETURNS intent
- [ ] get_return_policy returns policy text
- [ ] initiate_return creates ReturnRequest
- [ ] Eligibility checks work correctly
- [ ] Return window validation works
- [ ] Return authorization generated
- [ ] Returns valid ActionResponse
- [ ] Handles expired window error

**ShippingHandler Verification:**
- [ ] Handles SHIPPING intent
- [ ] Returns shipping methods
- [ ] Costs formatted correctly
- [ ] Timeframes displayed clearly
- [ ] Free shipping threshold mentioned
- [ ] Returns valid ActionResponse

**StoreInfoHandler Verification:**
- [ ] Handles STORE_INFO intent
- [ ] Returns all tenant information
- [ ] Business hours formatted correctly
- [ ] Address formatted correctly
- [ ] Contact info included
- [ ] Returns valid ActionResponse

**EscalationHandler Verification:**
- [ ] Handles ESCALATE intent
- [ ] Creates support ticket
- [ ] Updates conversation status
- [ ] Calls notify_agent
- [ ] Returns ticket number
- [ ] Returns valid ActionResponse
- [ ] Agent notification sent

**Multi-Tenancy Verification:**
- [ ] Handlers respect tenant boundaries
- [ ] Orders isolated by tenant
- [ ] Products isolated by tenant
- [ ] Registry maintains separate instances
- [ ] No cross-tenant data leakage

### Test Execution Commands

```bash
# Run all handler tests
python manage.py test chatbot.tests.test_action_handlers

# Run specific test class
python manage.py test chatbot.tests.test_action_handlers.TestOrderStatusHandler

# Run with coverage
coverage run --source='.' manage.py test chatbot.tests.test_action_handlers
coverage report
```

### Manual Testing Guide

**Test Scenario 1: Order Status Inquiry**
1. Start chatbot conversation
2. Send message: "What's the status of order 12345?"
3. Verify intent classified as ORDER_STATUS
4. Verify order_id entity extracted
5. Verify OrderStatusHandler invoked
6. Verify response contains order status
7. Verify tracking info if available

**Test Scenario 2: Product Information**
1. Send message: "Tell me about the wireless mouse"
2. Verify intent classified as PRODUCT_INFO
3. Verify product_name entity extracted
4. Verify ProductInfoHandler invoked
5. Verify response contains product details
6. Verify price and stock status shown

**Test Scenario 3: Return Initiation**
1. Send message: "I want to return order 12345"
2. Verify intent classified as RETURNS
3. Verify order_id entity extracted
4. Verify ReturnHandler invoked
5. Verify eligibility checked
6. Verify ReturnRequest created
7. Verify RA number returned

**Test Scenario 4: Escalation**
1. Send message: "I need to speak to a human"
2. Verify intent classified as ESCALATE
3. Verify EscalationHandler invoked
4. Verify support ticket created
5. Verify conversation status changed to ESCALATED
6. Verify agent notified
7. Verify customer receives confirmation

### Expected Outcome
- All handlers verified and working
- Test coverage above 80%
- Manual testing completed
- Documentation updated
- Any issues documented and resolved

### Verification Checklist
- [ ] Test file created with all test classes
- [ ] Test fixtures set up correctly
- [ ] Registry tests passing
- [ ] All handler tests passing
- [ ] Error handling tests passing
- [ ] Multi-tenancy tests passing
- [ ] Manual testing completed
- [ ] Test coverage measured
- [ ] Documentation updated
- [ ] Known issues documented

---

## Handler Registry Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      ActionRegistry                          │
│                                                              │
│  _handlers = {                                              │
│    "ORDER_STATUS": OrderStatusHandler,                      │
│    "PRODUCT_INFO": ProductInfoHandler,                      │
│    "RETURNS": ReturnHandler,                                │
│    "SHIPPING": ShippingHandler,                             │
│    "STORE_INFO": StoreInfoHandler,                          │
│    "ESCALATE": EscalationHandler                            │
│  }                                                           │
│                                                              │
│  _handler_cache = {}  (per tenant instance)                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ get_handler("ORDER_STATUS")
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Handler Instantiation                      │
│                                                              │
│  1. Check cache for "ORDER_STATUS"                          │
│  2. If not cached:                                          │
│     a. Retrieve OrderStatusHandler class                    │
│     b. Instantiate: OrderStatusHandler(tenant)              │
│     c. Store in cache                                       │
│  3. Return handler instance                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ handler.handle(intent, entities, context)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  OrderStatusHandler                          │
│                                                              │
│  1. Extract order_id from entities                          │
│  2. Call get_order_status(order_id, customer)               │
│  3. Format response with format_order_response(order)       │
│  4. Build ActionResponse with message and data              │
│  5. Return ActionResponse                                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ ActionResponse
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ActionResponse                           │
│                                                              │
│  message: "Your order #12345 has been shipped..."          │
│  data: {                                                    │
│    order_id: 12345,                                         │
│    status: "shipped",                                       │
│    tracking_number: "LK123456789"                           │
│  }                                                           │
│  actions: [                                                 │
│    {type: "button", label: "Track Shipment"}               │
│  ]                                                           │
│  success: true                                              │
└─────────────────────────────────────────────────────────────┘
```

## Escalation Flow Diagram

```
Customer Message: "I need to speak with someone"
            │
            ▼
┌────────────────────────────┐
│   Intent Classification    │
│   Intent: ESCALATE         │
└────────────────────────────┘
            │
            ▼
┌────────────────────────────┐
│   Registry.get_handler     │
│   Returns: EscalationHandler│
└────────────────────────────┘
            │
            ▼
┌────────────────────────────┐
│ EscalationHandler.handle   │
│ 1. Update conversation     │
│    status → ESCALATED      │
│ 2. Create support ticket   │
│ 3. Call notify_agent()     │
└────────────────────────────┘
            │
            ├──────────────────────┬────────────────────┐
            ▼                      ▼                    ▼
┌─────────────────┐    ┌─────────────────┐  ┌─────────────────┐
│ Support Ticket  │    │ Update Status   │  │  notify_agent   │
│ Created         │    │ ACTIVE →        │  │                 │
│ RA-202401-001   │    │ ESCALATED       │  │ 1. Find agent   │
└─────────────────┘    └─────────────────┘  │ 2. Send email   │
                                             │ 3. Send SMS     │
                                             │ 4. Dashboard    │
                                             │    notification │
                                             └─────────────────┘
            │
            ▼
┌────────────────────────────┐
│    ActionResponse to       │
│    Customer:               │
│                            │
│    "I'm connecting you     │
│    with an agent.          │
│    Ticket: RA-202401-001"  │
└────────────────────────────┘
            │
            ▼
┌────────────────────────────┐
│   Agent Receives           │
│   Notifications            │
│   - Email                  │
│   - SMS                    │
│   - Dashboard alert        │
└────────────────────────────┘
            │
            ▼
┌────────────────────────────┐
│   Agent Responds           │
│   Conversation continues   │
│   with human agent         │
└────────────────────────────┘
```

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-60_Base-Order-Product-Return.md](01_Tasks-51-60_Base-Order-Product-Return.md)
- **→ Next Group:** [Group-E_LLM-Integration](../Group-E_LLM-Integration/)

---

*This document covers Tasks 61-68, completing the action handler system with return initiation, shipping/store/escalation handlers, the ActionRegistry for handler lookup, and comprehensive verification procedures.*
