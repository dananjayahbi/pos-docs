# Tasks 83-92: WhatsApp Frontend Components & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** F - Frontend & Testing  
> **Document:** 01 of 01  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-E_Webhooks-Delivery/02_Tasks-79-82_Handler-Alert-Verify.md](../Group-E_Webhooks-Delivery/02_Tasks-79-82_Handler-Alert-Verify.md)
- **→ Next SubPhase:** [../../SubPhase-12_SMS-Gateway-Integration/](../../SubPhase-12_SMS-Gateway-Integration/)

---

## Document Overview

This document covers the creation of the complete frontend layer for WhatsApp Business API integration, including TypeScript types, API client, customer-facing components, admin interfaces, comprehensive testing, and documentation. These tasks transform the backend WhatsApp infrastructure into a fully functional user experience.

The TypeScript types ensure type safety across the frontend. The API client provides a clean interface to backend endpoints. Customer components enable WhatsApp opt-in and notification management. Admin interfaces provide template management, configuration, and delivery analytics. Integration tests validate the entire E2E flow. Documentation ensures successful adoption by developers, admins, and customers.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create WhatsApp Types | Low | 20 min |
| 84 | Create WhatsApp API Client | Medium | 45 min |
| 85 | Create Opt-In Checkbox | Medium | 35 min |
| 86 | Create Opt-In Settings | Medium | 40 min |
| 87 | Create Message History UI | Medium | 50 min |
| 88 | Create Template Manager UI | Medium | 60 min |
| 89 | Create WhatsApp Config UI | Medium | 55 min |
| 90 | Create Delivery Report UI | Medium | 65 min |
| 91 | Create Integration Tests | Medium | 45 min |
| 92 | Create Documentation | Medium | 40 min |

---

## Task 83: Create WhatsApp Types

### Overview

Create comprehensive TypeScript interfaces and types for all WhatsApp-related data structures used in the frontend. This establishes type safety across components, ensures consistent data shapes, prevents runtime errors, and provides IDE autocomplete support. Types cover configuration, templates, messages, logs, opt-in status, and API responses.

Well-defined types are the foundation of a robust TypeScript application. They catch errors at compile time, document expected data structures, and make refactoring safer. Every component, API client method, and state management slice depends on these types.

### Dependencies

- Task 82: Verify Webhook Flow (backend complete and verified)
- Frontend project initialized (Phase-07)
- Understanding of TypeScript interfaces and enums

### Instructions

1. **Create types file**
   - Navigate to frontend project directory
   - Create directory `lib/notifications/whatsapp/`
   - Create file `types.ts` in this directory
   - This file exports all WhatsApp-related types

2. **Define WhatsAppConfig interface**
   - Represents tenant WhatsApp configuration
   - Fields: id, tenant_id, phone_number_id, business_account_id, access_token (never exposed), is_enabled, daily_limit, messages_sent_today, created_at, updated_at
   - Match backend WhatsAppConfig model (Task 20)
   - Use optional fields where appropriate

3. **Define MessageTemplate interface**
   - Represents WhatsApp message template
   - Fields: id, tenant_id, name, language, category, status, header_type, header_text, body_text, footer_text, buttons, template_params, is_active, meta_template_id, created_at, updated_at
   - Match backend MessageTemplate model (Task 44)
   - Support all template types (TEXT, MEDIA, INTERACTIVE)

4. **Define TemplateButton interface**
   - Represents template button configuration
   - Fields: type (QUICK_REPLY, CALL_TO_ACTION), text, url, phone_number
   - Used in MessageTemplate.buttons array
   - Support all button types

5. **Define WhatsAppMessage interface**
   - Represents outbound WhatsApp message
   - Fields: id, tenant_id, customer, template, parameters, scheduled_for, trigger_type, order, shipment, status, sent_at, created_at
   - Match backend WhatsAppMessage model (Task 46)
   - Include related objects (customer, template, order)

6. **Define MessageLog interface**
   - Represents message delivery tracking
   - Fields: id, message, message_id (Meta ID), status, delivered_at, read_at, failed_reason, created_at, updated_at
   - Match backend MessageLog model (Tasks 76-78)
   - Status enum: PENDING, SENT, DELIVERED, READ, FAILED

7. **Define OptInStatus interface**
   - Represents customer opt-in preference
   - Fields: customer_id, opted_in (boolean), opted_in_at, opted_out_at
   - Simple structure for checkbox state
   - Used in checkout and account settings

8. **Define MessageStatus enum**
   - Values: PENDING, SENT, DELIVERED, READ, FAILED
   - Used across multiple interfaces
   - Consistent with backend status choices

9. **Define TemplateCategory enum**
   - Values: MARKETING, UTILITY, AUTHENTICATION
   - Matches Meta WhatsApp template categories
   - Used in MessageTemplate interface

10. **Define API response types**
    - PaginatedResponse<T> for list endpoints
    - ApiError for error responses
    - DeliveryStats for analytics (Task 90)
    - ConfigUpdatePayload for config updates

### WhatsApp Types Structure

```
Type Hierarchy:
┌──────────────────────────────────────────┐
│                                          │
│  Core Configuration                      │
│  ├── WhatsAppConfig                      │
│  └── OptInStatus                         │
│                                          │
│  Templates & Messages                    │
│  ├── MessageTemplate                     │
│  │   └── TemplateButton[]                │
│  ├── WhatsAppMessage                     │
│  └── MessageLog                          │
│                                          │
│  Enums                                   │
│  ├── MessageStatus                       │
│  ├── TemplateCategory                    │
│  ├── TriggerType                         │
│  └── HeaderType                          │
│                                          │
│  API Types                               │
│  ├── PaginatedResponse<T>                │
│  ├── DeliveryStats                       │
│  └── ApiError                            │
│                                          │
└──────────────────────────────────────────┘
```

### Key Interfaces

| Interface | Purpose | Key Fields |
|-----------|---------|------------|
| WhatsAppConfig | Tenant configuration | phone_number_id, is_enabled, daily_limit |
| MessageTemplate | Template definition | name, language, body_text, buttons |
| WhatsAppMessage | Outbound message | template, parameters, status |
| MessageLog | Delivery tracking | message_id, status, delivered_at, read_at |
| OptInStatus | Customer preference | customer_id, opted_in, opted_in_at |

### Type Safety Benefits

| Benefit | Impact |
|---------|--------|
| Compile-Time Errors | Catch typos and missing fields before runtime |
| IDE Autocomplete | Faster development with suggestions |
| Refactoring Safety | Update types in one place, catch all usages |
| Documentation | Types serve as inline documentation |
| API Contract | Ensures frontend matches backend schema |

### Expected Outcome

- Comprehensive TypeScript types for all WhatsApp entities
- Exported interfaces available for import across frontend
- Strong type safety for all WhatsApp-related code
- Foundation for API client and components

### Verification Checklist

- [ ] `lib/notifications/whatsapp/types.ts` file created
- [ ] All interfaces match backend models
- [ ] Enums defined for status, category, trigger type
- [ ] API response types included
- [ ] All fields properly typed (string, number, Date, optional)
- [ ] File exports all types for use in other files
- [ ] No TypeScript compilation errors

---

## Task 84: Create WhatsApp API Client

### Overview

Create a frontend API client that provides a clean, type-safe interface to all WhatsApp backend endpoints. The client encapsulates HTTP requests, handles authentication, manages errors, and returns properly typed responses. This abstraction layer separates API communication from component logic, making components cleaner and API changes easier to manage.

The client includes methods for fetching configuration, managing templates, sending messages, retrieving message history, fetching delivery statistics, and updating customer opt-in status. All methods use the types from Task 83 and return promises for async/await usage.

### Dependencies

- Task 83: Create WhatsApp Types (types available)
- Frontend authentication system (Phase-07)
- HTTP client library (fetch or axios)

### Instructions

1. **Create client file**
   - Create file `lib/notifications/whatsapp/client.ts`
   - Import all types from `types.ts`
   - Import HTTP client and auth utilities
   - Export class WhatsAppClient

2. **Define base API configuration**
   - Set base URL for WhatsApp API endpoints
   - Typically `/api/whatsapp/` for all endpoints
   - Include auth token in request headers
   - Handle tenant context automatically

3. **Implement getConfig method**
   - Endpoint: GET `/api/whatsapp/config/`
   - Returns: WhatsAppConfig
   - Fetches current tenant's WhatsApp configuration
   - Used in config UI (Task 89)

4. **Implement updateConfig method**
   - Endpoint: PUT `/api/whatsapp/config/`
   - Accepts: Partial<WhatsAppConfig>
   - Returns: WhatsAppConfig
   - Updates tenant configuration fields
   - Validates input before sending

5. **Implement getTemplates method**
   - Endpoint: GET `/api/whatsapp/templates/`
   - Query params: page, search, category, is_active
   - Returns: PaginatedResponse<MessageTemplate>
   - Supports filtering and pagination
   - Used in template manager (Task 88)

6. **Implement getTemplate method**
   - Endpoint: GET `/api/whatsapp/templates/{id}/`
   - Returns: MessageTemplate
   - Fetches single template by ID
   - Used for template editing

7. **Implement createTemplate method**
   - Endpoint: POST `/api/whatsapp/templates/`
   - Accepts: Omit<MessageTemplate, 'id' | 'created_at' | 'updated_at'>
   - Returns: MessageTemplate
   - Creates new template
   - Validates required fields

8. **Implement updateTemplate method**
   - Endpoint: PUT `/api/whatsapp/templates/{id}/`
   - Accepts: Partial<MessageTemplate>
   - Returns: MessageTemplate
   - Updates existing template
   - Only allows updates to editable fields

9. **Implement deleteTemplate method**
   - Endpoint: DELETE `/api/whatsapp/templates/{id}/`
   - Returns: void
   - Soft-deletes template (sets is_active = false)
   - Confirms deletion before sending

10. **Implement getMessages method**
    - Endpoint: GET `/api/whatsapp/messages/`
    - Query params: page, status, template_id, date_from, date_to
    - Returns: PaginatedResponse<WhatsAppMessage>
    - Fetches message history with filters
    - Used in message history UI (Task 87)

11. **Implement getMessageLogs method**
    - Endpoint: GET `/api/whatsapp/message-logs/`
    - Query params: page, message_id, status
    - Returns: PaginatedResponse<MessageLog>
    - Fetches delivery tracking logs
    - Used in message history and delivery reports

12. **Implement getDeliveryStats method**
    - Endpoint: GET `/api/whatsapp/stats/`
    - Query params: date_from, date_to, template_id
    - Returns: DeliveryStats
    - Fetches aggregated delivery metrics
    - Used in delivery report UI (Task 90)

13. **Implement updateOptIn method**
    - Endpoint: POST `/api/whatsapp/opt-in/`
    - Accepts: { opted_in: boolean }
    - Returns: OptInStatus
    - Updates current customer's opt-in preference
    - Used in opt-in checkbox (Task 85) and settings (Task 86)

14. **Implement getOptInStatus method**
    - Endpoint: GET `/api/whatsapp/opt-in/`
    - Returns: OptInStatus
    - Fetches current customer's opt-in status
    - Used to initialize checkbox and settings

15. **Add comprehensive error handling**
    - Catch network errors and timeouts
    - Parse API error responses
    - Return typed ApiError objects
    - Log errors for debugging
    - Provide user-friendly error messages

16. **Add request/response logging**
    - Log all API calls in development
    - Include endpoint, method, params
    - Log response status and duration
    - Sanitize sensitive data (tokens, phone numbers)

### API Client Architecture

```
WhatsApp API Client:
┌───────────────────────────────────────────┐
│                                           │
│  Configuration Methods                    │
│  ├── getConfig()                          │
│  └── updateConfig()                       │
│                                           │
│  Template Methods                         │
│  ├── getTemplates()                       │
│  ├── getTemplate(id)                      │
│  ├── createTemplate()                     │
│  ├── updateTemplate(id)                   │
│  └── deleteTemplate(id)                   │
│                                           │
│  Message Methods                          │
│  ├── getMessages()                        │
│  └── getMessageLogs()                     │
│                                           │
│  Analytics Methods                        │
│  └── getDeliveryStats()                   │
│                                           │
│  Opt-In Methods                           │
│  ├── getOptInStatus()                     │
│  └── updateOptIn()                        │
│                                           │
└───────────────────────────────────────────┘
```

### API Client Methods

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| getConfig | GET | /api/whatsapp/config/ | Fetch configuration |
| updateConfig | PUT | /api/whatsapp/config/ | Update configuration |
| getTemplates | GET | /api/whatsapp/templates/ | List templates |
| createTemplate | POST | /api/whatsapp/templates/ | Create template |
| updateTemplate | PUT | /api/whatsapp/templates/{id}/ | Update template |
| deleteTemplate | DELETE | /api/whatsapp/templates/{id}/ | Delete template |
| getMessages | GET | /api/whatsapp/messages/ | List messages |
| getMessageLogs | GET | /api/whatsapp/message-logs/ | List logs |
| getDeliveryStats | GET | /api/whatsapp/stats/ | Get analytics |
| getOptInStatus | GET | /api/whatsapp/opt-in/ | Get opt-in status |
| updateOptIn | POST | /api/whatsapp/opt-in/ | Update opt-in |

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Network Error | Retry with exponential backoff |
| 401 Unauthorized | Redirect to login |
| 403 Forbidden | Show permission error |
| 404 Not Found | Show not found message |
| 429 Rate Limit | Show rate limit message, retry after delay |
| 500 Server Error | Show generic error, log for investigation |

### Expected Outcome

- Fully functional API client class
- Type-safe methods for all WhatsApp endpoints
- Comprehensive error handling
- Ready for use in all components

### Verification Checklist

- [ ] `lib/notifications/whatsapp/client.ts` file created
- [ ] All API methods implemented and typed
- [ ] Error handling for network and API errors
- [ ] Authentication headers included
- [ ] Tenant context handled automatically
- [ ] All methods return properly typed promises
- [ ] No TypeScript compilation errors

---

## Task 85: Create Opt-In Checkbox

### Overview

Create a WhatsApp opt-in checkbox component for the checkout page. This checkbox allows customers to consent to receiving order notifications via WhatsApp during the checkout process. The component displays clear consent text, handles opt-in state, calls the API client to save preference, and follows GDPR and data privacy best practices.

The opt-in must be unchecked by default (explicit consent), clearly explain what customers are consenting to, and persist the choice to the backend. This component is the primary mechanism for customers to enable WhatsApp notifications.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Checkout page component (Phase-08 webstore)
- Shadcn/UI checkbox component

### Instructions

1. **Create component file**
   - Navigate to `components/checkout/` directory
   - Create file `WhatsAppOptIn.tsx`
   - Import checkbox from Shadcn/UI
   - Import WhatsApp API client

2. **Define component props**
   - No props required (uses current customer context)
   - Or accept onOptInChange callback for parent notification
   - Keep component self-contained and reusable

3. **Initialize component state**
   - Create state for opted_in boolean (default: false)
   - Create state for loading boolean (during API call)
   - Create state for error message if API fails

4. **Fetch initial opt-in status**
   - On component mount, call getOptInStatus()
   - Set opted_in state to returned value
   - Handle case where customer has no existing preference
   - Show loading state during fetch

5. **Render checkbox with label**
   - Use Shadcn/UI Checkbox component
   - Label text: "I want to receive order updates via WhatsApp"
   - Additional info: "You'll receive order confirmations, shipping updates, and delivery notifications"
   - Checkbox is controlled by opted_in state

6. **Handle checkbox change**
   - On checkbox toggle, update local state immediately (optimistic UI)
   - Call updateOptIn() with new value
   - Handle API success: maintain new state
   - Handle API error: revert state, show error message

7. **Display consent information**
   - Show icon (WhatsApp logo or message icon)
   - Clear, concise consent text
   - Link to privacy policy or terms
   - Emphasize benefits (faster updates, order tracking)

8. **Implement error handling**
   - Display error message if API call fails
   - Allow customer to retry
   - Don't block checkout if API fails
   - Log errors for debugging

9. **Add accessibility features**
   - Proper label association with checkbox
   - Keyboard navigation support
   - Screen reader announcements for state changes
   - Focus indicators

10. **Style component**
    - Consistent with checkout page design
    - WhatsApp brand color (green) for checkbox when checked
    - Subtle, non-intrusive placement
    - Clear visual hierarchy

### Opt-In Checkbox Layout

```
Checkout Page - Order Summary Section:
┌──────────────────────────────────────────┐
│                                          │
│  Order Summary                           │
│  ────────────────                        │
│                                          │
│  [Order details...]                      │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 📱 WhatsApp Notifications          │ │
│  │                                    │ │
│  │ ☐ I want to receive order updates │ │
│  │    via WhatsApp                    │ │
│  │                                    │ │
│  │ You'll receive order confirmations,│ │
│  │ shipping updates, and delivery     │ │
│  │ notifications.                     │ │
│  │                                    │ │
│  │ Learn more about our Privacy Policy│ │
│  └────────────────────────────────────┘ │
│                                          │
│  [Place Order Button]                    │
│                                          │
└──────────────────────────────────────────┘
```

### Consent Text Options

| Text Option | Tone | Length |
|-------------|------|--------|
| "Receive order updates via WhatsApp" | Concise | Short |
| "Send me WhatsApp notifications for my order" | Direct | Short |
| "I agree to receive order status updates on WhatsApp" | Formal | Medium |
| "Keep me informed via WhatsApp about my order" | Friendly | Medium |

### Checkbox States

| State | Visual | Behavior |
|-------|--------|----------|
| Unchecked (default) | Empty checkbox | No opt-in, no API call on mount |
| Checked | Checkbox with checkmark | Opted in, API call to save |
| Loading | Spinner or disabled | API call in progress |
| Error | Red text, error icon | API failed, allow retry |

### Expected Outcome

- Functional opt-in checkbox on checkout page
- Clear consent text and privacy information
- Persists opt-in preference to backend
- Accessible and user-friendly

### Verification Checklist

- [ ] `components/checkout/WhatsAppOptIn.tsx` file created
- [ ] Checkbox unchecked by default (explicit consent)
- [ ] Fetches initial opt-in status on mount
- [ ] Updates backend when checkbox toggled
- [ ] Clear consent text displayed
- [ ] Error handling for API failures
- [ ] Accessible (keyboard, screen reader)
- [ ] Styled consistently with checkout page

---

## Task 86: Create Opt-In Settings

### Overview

Create a notification settings page where customers can manage their WhatsApp preferences in their account settings. This page allows customers to view their current opt-in status, toggle WhatsApp notifications on/off, see when they opted in/out, and view message history. This provides transparency and control over communication preferences, meeting privacy and compliance requirements.

Unlike the checkout checkbox (Task 85) which is a simple toggle, this settings page provides a comprehensive interface with history, explanation, and management options. It's part of the customer account dashboard.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Task 85: Create Opt-In Checkbox (reusable logic)
- Account settings page structure (Phase-08 webstore)

### Instructions

1. **Create settings page**
   - Navigate to `app/(customer)/account/notifications/` directory
   - Create file `page.tsx` for notification settings
   - Or add WhatsApp section to existing notifications page
   - Import WhatsApp API client and types

2. **Fetch opt-in status**
   - On page load, call getOptInStatus()
   - Display loading state during fetch
   - Show current opted_in status
   - Display opted_in_at or opted_out_at timestamp

3. **Display current status**
   - Show toggle switch for opt-in (on/off)
   - Display status text: "WhatsApp notifications are ON/OFF"
   - Show last action timestamp: "Opted in on [date]"
   - Use green checkmark for enabled, gray icon for disabled

4. **Implement toggle functionality**
   - Provide toggle switch or button to change preference
   - On toggle, call updateOptIn() with new value
   - Show loading spinner during API call
   - Update UI with new status on success

5. **Display explanation and benefits**
   - Section explaining what WhatsApp notifications include
   - List message types: order confirmations, shipping updates, delivery notifications
   - Emphasize convenience and real-time updates
   - Link to sample message templates

6. **Show message history preview**
   - Display recent WhatsApp messages sent to customer
   - Use getMessages() with customer filter
   - Show 5-10 most recent messages
   - Include message type, date, delivery status
   - Link to full message history (Task 87 or expand inline)

7. **Add opt-in/opt-out confirmation**
   - When enabling, show confirmation message: "You'll receive WhatsApp notifications"
   - When disabling, show confirmation: "WhatsApp notifications disabled"
   - Optionally show confirmation dialog for opt-out
   - Clear, positive feedback for user actions

8. **Implement privacy information section**
   - Explain how phone number is used
   - Link to privacy policy
   - Explain data retention and GDPR rights
   - Provide contact info for support

9. **Handle error states**
   - Display error message if API call fails
   - Provide retry button
   - Don't block entire settings page on error
   - Log errors for investigation

10. **Add mobile-responsive design**
    - Ensure settings page works on all screen sizes
    - Optimize for mobile (common for account settings)
    - Use responsive layout (stack sections on mobile)
    - Touch-friendly controls

### Notification Settings Page Layout

```
Account > Notification Settings:
┌──────────────────────────────────────────┐
│                                          │
│  Notification Settings                   │
│  ══════════════════════                  │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 📱 WhatsApp Notifications          │ │
│  │                                    │ │
│  │ [Toggle: ON ✓]                     │ │
│  │                                    │ │
│  │ Status: WhatsApp notifications     │ │
│  │ are enabled                        │ │
│  │                                    │ │
│  │ Opted in on: Jan 15, 2026          │ │
│  │                                    │ │
│  │ ─────────────────                  │ │
│  │                                    │ │
│  │ You'll receive:                    │ │
│  │ • Order confirmations              │ │
│  │ • Shipping updates                 │ │
│  │ • Delivery notifications           │ │
│  │                                    │ │
│  │ ─────────────────                  │ │
│  │                                    │ │
│  │ Recent Messages:                   │ │
│  │ • Order Confirmed - Jan 20         │ │
│  │ • Shipped - Jan 21                 │ │
│  │ • Delivered - Jan 22               │ │
│  │                                    │ │
│  │ [View All Messages →]              │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ 🔒 Privacy & Data                  │ │
│  │                                    │ │
│  │ Your phone number is only used to  │ │
│  │ send order updates. Read our       │ │
│  │ [Privacy Policy].                  │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
└──────────────────────────────────────────┘
```

### Settings Page Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Status Toggle | Switch and current status | Enable/disable notifications |
| Opt-In Timestamp | Date/time of last action | Transparency and confirmation |
| Message Types | List of notification types | Set expectations |
| Message History | Recent messages preview | Show value and activity |
| Privacy Info | Data usage and policies | Build trust and compliance |

### Toggle States

| State | Display | Action |
|-------|---------|--------|
| Enabled | Toggle ON, green checkmark | Can toggle OFF |
| Disabled | Toggle OFF, gray icon | Can toggle ON |
| Loading | Spinner on toggle | API call in progress |
| Error | Error message, retry button | Allow retry |

### Expected Outcome

- Comprehensive notification settings page
- Clear opt-in/opt-out controls
- Message history preview
- Privacy and transparency information

### Verification Checklist

- [ ] Settings page created in account section
- [ ] Fetches and displays current opt-in status
- [ ] Toggle functionality updates backend
- [ ] Shows opt-in/opt-out timestamp
- [ ] Displays recent message history
- [ ] Privacy information included
- [ ] Mobile-responsive design
- [ ] Error handling for API failures

---

## Task 87: Create Message History UI

### Overview

Create an admin interface for viewing WhatsApp message history. This UI displays all WhatsApp messages sent by the tenant, with filtering, sorting, and detailed views. Admins can see message details, delivery status, recipient information, template used, and delivery timeline. This interface is essential for monitoring WhatsApp usage, troubleshooting delivery issues, and understanding customer communication.

The message history UI combines data from WhatsAppMessage and MessageLog models, showing both the message intent (what was sent, why, when) and delivery tracking (status, delivered_at, read_at). It provides comprehensive visibility into the WhatsApp messaging system.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Admin dashboard structure (Phase-07)
- Shadcn/UI table and filter components

### Instructions

1. **Create message history page**
   - Navigate to `app/(admin)/whatsapp/messages/` directory
   - Create file `page.tsx` for message history
   - Import WhatsApp API client and types
   - Import table, pagination, and filter components

2. **Fetch messages on page load**
   - Call getMessages() and getMessageLogs() APIs
   - Support pagination (page, limit)
   - Join message and log data by message_id
   - Show loading state during fetch

3. **Design table structure**
   - Columns: Date, Customer, Template, Status, Delivered, Read, Actions
   - Use Shadcn/UI Data Table component
   - Support sorting by date, status
   - Responsive design (hide some columns on mobile)

4. **Implement Date column**
   - Display sent_at timestamp
   - Format: "Jan 20, 2026 10:30 AM"
   - Show relative time on hover: "2 days ago"
   - Sort by date (default: newest first)

5. **Implement Customer column**
   - Display customer name
   - Show phone number (masked for privacy): "+94 77 *** **34"
   - Link to customer profile (if available)
   - Show customer ID on hover

6. **Implement Template column**
   - Display template name: "Order Confirmation"
   - Show template category badge (UTILITY, MARKETING)
   - Color-coded by category
   - Link to template details (Task 88)

7. **Implement Status column**
   - Display current status with icon
   - PENDING: Clock icon, gray
   - SENT: Checkmark icon, blue
   - DELIVERED: Double checkmark, green
   - READ: Double checkmark, blue
   - FAILED: X icon, red
   - Show status badge with color

8. **Implement Delivered column**
   - Display delivered_at timestamp if status is DELIVERED or READ
   - Format: "Jan 20, 10:32 AM"
   - Show "—" if not delivered
   - Calculate delivery time (sent_at to delivered_at)

9. **Implement Read column**
   - Display read_at timestamp if status is READ
   - Format: "Jan 20, 11:05 AM"
   - Show "—" if not read
   - Calculate read time (delivered_at to read_at)

10. **Implement Actions column**
    - "View Details" button to open detail modal
    - "Resend" button for failed messages (if applicable)
    - Copy message_id to clipboard
    - Dropdown menu for more actions

11. **Add filtering capabilities**
    - Filter by status (dropdown: All, Sent, Delivered, Read, Failed)
    - Filter by template (dropdown: All templates + specific)
    - Filter by date range (date picker: from, to)
    - Filter by customer (search input)
    - Apply filters button, clear filters button

12. **Implement search functionality**
    - Search by customer name, phone number
    - Search by message_id
    - Debounce search input for performance
    - Show search results count

13. **Add pagination controls**
    - Show total messages count
    - Page size selector (10, 25, 50, 100)
    - Previous/Next page buttons
    - Page number input for direct navigation

14. **Create message detail modal**
    - Opens when "View Details" clicked
    - Shows full message information:
      - Customer details
      - Template name and content
      - Parameters used (filled template)
      - Trigger type (order_created, order_shipped, etc.)
      - Related order or shipment (link)
      - Full delivery timeline with all status transitions
      - failed_reason JSON if status is FAILED
    - Close button and keyboard shortcut (ESC)

15. **Display delivery timeline in modal**
    - Visual timeline of message journey
    - Created → Sent → Delivered → Read
    - Show timestamp for each status
    - Highlight current status
    - Show duration between statuses

16. **Add export functionality**
    - Export button to download message history as CSV
    - Include filters in export
    - Fields: Date, Customer, Phone, Template, Status, Delivered At, Read At
    - Useful for reporting and analysis

### Message History Table Layout

```
Admin > WhatsApp > Messages:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WhatsApp Messages                           [Export CSV]         │
│  ══════════════════                                                │
│                                                                    │
│  Filters:                                                          │
│  [Status: All ▼] [Template: All ▼] [From: Jan 1] [To: Jan 31]    │
│  [Search customer...] [Apply Filters] [Clear]                     │
│                                                                    │
│  Total: 243 messages                                               │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Date         │ Customer  │ Template │ Status │ Delivered     │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ Jan 22 10:30 │ John Doe  │ Order    │ ✓✓ READ│ Jan 22 10:32  │ │
│  │              │ +94 77*** │ Confirm  │  Blue  │               │ │
│  │              │           │          │        │ [View Details]│ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ Jan 21 15:45 │ Jane Smith│ Shipped  │ ✓✓ DELI│ Jan 21 15:47  │ │
│  │              │ +94 71*** │          │  Green │               │ │
│  │              │           │          │        │ [View Details]│ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ Jan 20 09:15 │ Bob Wilson│ Order    │ ✓ SENT │ —             │ │
│  │              │ +94 77*** │ Confirm  │  Blue  │               │ │
│  │              │           │          │        │ [View Details]│ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │ Jan 19 14:20 │ Alice Lee │ Delivered│ ✗ FAIL │ —             │ │
│  │              │ +94 76*** │          │  Red   │               │ │
│  │              │           │          │        │ [View Details]│ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Page: [<] 1 2 3 ... 25 [>]    Show: [25 ▼] per page             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Message Detail Modal Layout

```
Message Details Modal:
┌──────────────────────────────────────────┐
│  Message Details                    [X]  │
│  ════════════════                        │
│                                          │
│  Customer Information                    │
│  ─────────────────────                   │
│  Name: John Doe                          │
│  Phone: +94 77 123 4567                  │
│  Email: john@example.com                 │
│                                          │
│  Message Information                     │
│  ────────────────────                    │
│  Template: Order Confirmation            │
│  Trigger: Order Created                  │
│  Order: #ORD-2026-0123 [View Order →]   │
│                                          │
│  Message Content                         │
│  ───────────────                         │
│  Hi John, your order #ORD-2026-0123 has  │
│  been confirmed. Total: Rs. 5,450.       │
│  Delivery: Jan 25-27.                    │
│                                          │
│  Delivery Timeline                       │
│  ───────────────────                     │
│  ● Created    Jan 22, 10:30:15 AM        │
│  ● Sent       Jan 22, 10:30:17 AM (2s)   │
│  ● Delivered  Jan 22, 10:32:05 AM (1m48s)│
│  ● Read       Jan 22, 11:05:32 AM (33m)  │
│                                          │
│  Meta Information                        │
│  ─────────────────                       │
│  Message ID: wamid.HBgL...                │
│  Status: READ ✓✓                         │
│                                          │
│  [Close]                                 │
│                                          │
└──────────────────────────────────────────┘
```

### Table Columns

| Column | Data | Sorting | Width |
|--------|------|---------|-------|
| Date | sent_at formatted | Yes (default desc) | 140px |
| Customer | Name, phone masked | Yes (alphabetical) | 150px |
| Template | Template name, category badge | Yes | 150px |
| Status | Status badge with icon | Yes (by status order) | 120px |
| Delivered | delivered_at formatted | Yes | 140px |
| Read | read_at formatted | Yes | 140px |
| Actions | View Details button | No | 120px |

### Status Badge Colors

| Status | Color | Icon |
|--------|-------|------|
| PENDING | Gray | Clock |
| SENT | Blue | Single checkmark |
| DELIVERED | Green | Double checkmark |
| READ | Blue | Double checkmark |
| FAILED | Red | X mark |

### Expected Outcome

- Comprehensive message history interface
- Filterable, sortable, searchable table
- Detailed message view with delivery timeline
- Export functionality for reporting

### Verification Checklist

- [ ] Message history page created in admin section
- [ ] Table displays messages with all columns
- [ ] Filtering by status, template, date range works
- [ ] Search by customer or message_id works
- [ ] Pagination controls function correctly
- [ ] Detail modal shows full message information
- [ ] Delivery timeline visualized clearly
- [ ] Export to CSV functionality works
- [ ] Mobile-responsive design

---

## Task 88: Create Template Manager UI

### Overview

Create an admin interface for managing WhatsApp message templates. This UI allows admins to view all templates, create new templates, edit existing templates, deactivate templates, and sync templates with Meta. The interface provides a template library with preview functionality, form-based editing, parameter management, and validation.

Templates are the foundation of the WhatsApp messaging system. This interface makes template management accessible to non-technical admins, removing the need for database or API access. It bridges Meta's template approval process with the LCC admin dashboard.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Admin dashboard structure (Phase-07)
- Shadcn/UI form components

### Instructions

1. **Create template manager page**
   - Navigate to `app/(admin)/whatsapp/templates/` directory
   - Create file `page.tsx` for template list
   - Create file `[id]/page.tsx` for template edit
   - Create file `new/page.tsx` for template creation
   - Import WhatsApp API client and types

2. **Design template list view**
   - Display templates in card grid or table
   - Show template name, language, category, status
   - Show approval status from Meta (approved, pending, rejected)
   - Filter by category, language, active status
   - Search by name

3. **Implement template cards**
   - Each card shows template name, category badge
   - Display template body text (truncated)
   - Show active/inactive indicator
   - Show approval status badge
   - "Edit" and "Deactivate" action buttons

4. **Add create template button**
   - Prominent "Create Template" button at top
   - Opens new template form page
   - Or opens modal with form
   - Clear, inviting call-to-action

5. **Create template form**
   - Used for both create and edit
   - Sections: Basic Info, Content, Buttons, Preview
   - Use Shadcn/UI form components
   - Real-time validation with error messages

6. **Implement Basic Info section**
   - Fields: Name (unique), Language (dropdown), Category (dropdown)
   - Name validation: alphanumeric, underscores, no spaces
   - Language: options like en, si, ta
   - Category: UTILITY, MARKETING, AUTHENTICATION

7. **Implement Content section**
   - Header (optional): Type (TEXT or MEDIA), content
   - Body (required): Textarea with parameter support
   - Footer (optional): Text input
   - Show character count for each field

8. **Add parameter management**
   - Body text supports parameters: {{1}}, {{2}}, {{3}}
   - Highlight parameters in textarea
   - List parameters below textarea
   - Example: "Hi {{1}}, your order {{2}} is ready."
   - Validate parameter sequence (no gaps: {{1}}, {{2}}, not {{1}}, {{3}})

9. **Implement Buttons section**
   - Support up to 3 buttons per template
   - Button types: QUICK_REPLY, CALL_TO_ACTION (URL, Phone)
   - Quick Reply: Just text
   - CTA URL: Text + URL with parameters
   - CTA Phone: Text + phone number
   - Add/remove button controls

10. **Create live preview panel**
    - Show template as it would appear in WhatsApp
    - Fill parameters with sample data
    - Render header, body, footer, buttons
    - WhatsApp-like styling (green bubbles)
    - Updates in real-time as form changes

11. **Implement form validation**
    - Required fields: Name, Language, Category, Body
    - Name uniqueness check (API call)
    - Parameter sequence validation
    - URL format validation for CTA buttons
    - Phone number format validation
    - Display validation errors clearly

12. **Add template submit action**
    - For create: call createTemplate() API
    - For edit: call updateTemplate() API
    - Show loading spinner during API call
    - On success: show success message, redirect to list
    - On error: display error message, keep form open

13. **Implement template sync feature**
    - "Sync with Meta" button on list page
    - Calls backend API to fetch templates from Meta
    - Updates local database with Meta approval statuses
    - Shows sync progress and results
    - Use when templates approved/rejected on Meta

14. **Add template deactivation**
    - "Deactivate" button on each template card
    - Confirmation dialog: "Deactivate template?"
    - Calls deleteTemplate() (soft delete)
    - Template no longer available for new messages
    - Can be reactivated later

15. **Display approval status**
    - Show Meta approval status badge on each template
    - Approved: Green badge, ready to use
    - Pending: Yellow badge, awaiting Meta review
    - Rejected: Red badge, show rejection reason
    - Not Submitted: Gray badge, local only
    - Link to Meta Business Manager for submissions

16. **Add template usage statistics**
    - Show usage count on each template card
    - "Used 234 times this month"
    - Link to message history filtered by template
    - Helps identify most/least used templates

### Template List Layout

```
Admin > WhatsApp > Templates:
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WhatsApp Templates                      [+ Create Template]      │
│  ═══════════════════                     [Sync with Meta]         │
│                                                                    │
│  Filters: [Category: All ▼] [Language: All ▼] [Status: All ▼]    │
│  [Search templates...]                                             │
│                                                                    │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │ Order Confirmation │  │ Order Shipped      │                  │
│  │ ──────────────────│  │ ────────────────  │                  │
│  │                    │  │                    │                  │
│  │ Category: UTILITY  │  │ Category: UTILITY  │                  │
│  │ Language: English  │  │ Language: English  │                  │
│  │                    │  │                    │                  │
│  │ Hi {{1}}, your     │  │ Great news {{1}}!  │                  │
│  │ order {{2}} has... │  │ Your order {{2}}...│                  │
│  │                    │  │                    │                  │
│  │ Status: ✓ Approved │  │ Status: ⏱ Pending  │                  │
│  │ Used: 1,234 times  │  │ Used: 45 times     │                  │
│  │                    │  │                    │                  │
│  │ [Edit] [Deactivate]│  │ [Edit] [Deactivate]│                  │
│  └────────────────────┘  └────────────────────┘                  │
│                                                                    │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │ Delivery Complete  │  │ Payment Received   │                  │
│  │ ...                │  │ ...                │                  │
│  └────────────────────┘  └────────────────────┘                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Template Form Layout

```
Create/Edit Template:
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Create Template                                     [Cancel]     │
│  ═══════════════                                     [Save]       │
│                                                                    │
│  ┌─────────────────────────────────┐ ┌──────────────────────┐   │
│  │ Form                            │ │ Preview              │   │
│  │                                 │ │                      │   │
│  │ Basic Information               │ │ ┌──────────────────┐│   │
│  │ ─────────────────               │ │ │ WhatsApp Message ││   │
│  │ Name*: [order_confirmation___]  │ │ │                  ││   │
│  │ Language*: [English ▼]          │ │ │ Hi John,         ││   │
│  │ Category*: [UTILITY ▼]          │ │ │                  ││   │
│  │                                 │ │ │ Your order #123  ││   │
│  │ Content                         │ │ │ has been         ││   │
│  │ ───────                         │ │ │ confirmed.       ││   │
│  │ Body*:                          │ │ │                  ││   │
│  │ [Hi {{1}}, your order {{2}} has │ │ │ Total: Rs. 5,000 ││   │
│  │  been confirmed. Total: {{3}}.  │ │ │                  ││   │
│  │  Delivery: {{4}}.           ]   │ │ │ Delivery: Jan 25 ││   │
│  │                                 │ │ │                  ││   │
│  │ Parameters: {{1}} {{2}} {{3}}   │ │ │ [Track Order]    ││   │
│  │ {{4}}                           │ │ └──────────────────┘│   │
│  │                                 │ │                      │   │
│  │ Footer:                         │ │                      │   │
│  │ [Thank you for shopping!____]   │ │                      │   │
│  │                                 │ │                      │   │
│  │ Buttons                         │ │                      │   │
│  │ ───────                         │ │                      │   │
│  │ Button 1: [CTA URL ▼]           │ │                      │   │
│  │ Text: [Track Order_________]    │ │                      │   │
│  │ URL: [https://lcc.lk/track/{{1}│ │                      │   │
│  │                                 │ │                      │   │
│  │ [+ Add Button]                  │ │                      │   │
│  │                                 │ │                      │   │
│  └─────────────────────────────────┘ └──────────────────────┘   │
│                                                                    │
│  [Cancel]                                                [Save]   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Form Sections

| Section | Fields | Validation |
|---------|--------|------------|
| Basic Info | Name, Language, Category | Required, unique name |
| Header | Type (TEXT/MEDIA), Content | Optional |
| Body | Text with parameters | Required, valid params |
| Footer | Text | Optional, max 60 chars |
| Buttons | Type, Text, URL/Phone | Max 3, valid URLs |

### Parameter Validation

| Rule | Example | Valid? |
|------|---------|--------|
| Sequential | {{1}}, {{2}}, {{3}} | ✓ Yes |
| Gap in sequence | {{1}}, {{3}} | ✗ No |
| Start from 1 | {{1}}, {{2}} | ✓ Yes |
| Start from 2 | {{2}}, {{3}} | ✗ No |
| Max 10 parameters | {{1}} to {{10}} | ✓ Yes |
| Over 10 | {{11}} | ✗ No |

### Expected Outcome

- Comprehensive template management interface
- Form-based template creation and editing
- Live preview of templates
- Template sync with Meta
- Usage statistics

### Verification Checklist

- [ ] Template list page displays all templates
- [ ] Create template form with all fields
- [ ] Edit template form pre-populated
- [ ] Live preview panel updates in real-time
- [ ] Form validation for all fields
- [ ] Parameter validation (sequential, max 10)
- [ ] Template CRUD operations work (create, read, update, delete)
- [ ] Sync with Meta functionality
- [ ] Approval status badges displayed
- [ ] Usage statistics shown

---

## Task 89: Create WhatsApp Config UI

### Overview

Create an admin interface for configuring WhatsApp Business API settings at the tenant level. This UI allows admins to connect their WhatsApp Business account, enter API credentials, configure daily message limits, enable/disable WhatsApp functionality, and test the connection. This is the primary configuration entry point for WhatsApp integration.

The config UI handles sensitive data (access tokens, business account IDs) and provides validation and testing. It's designed for one-time setup followed by occasional updates. Clear instructions and help text guide admins through the Meta Business API setup process.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Admin dashboard structure (Phase-07)
- Shadcn/UI form components

### Instructions

1. **Create config page**
   - Navigate to `app/(admin)/whatsapp/config/` directory
   - Create file `page.tsx` for configuration
   - Import WhatsApp API client and types
   - Import form, input, and validation components

2. **Fetch current configuration**
   - On page load, call getConfig() API
   - Display loading state during fetch
   - If config exists, pre-populate form
   - If no config, show empty form with instructions

3. **Design configuration form**
   - Sections: Connection, Limits, Status
   - Use Shadcn/UI form components
   - Clear labels and help text
   - Validation for all fields

4. **Implement Connection section**
   - Field: Phone Number ID (text input)
   - Help text: "From Meta Business Manager > WhatsApp > API Setup"
   - Field: Business Account ID (text input)
   - Help text: "Your WhatsApp Business Account ID"
   - Field: Access Token (password input)
   - Help text: "System User Token from Meta Business Manager"
   - Show/hide access token button (eye icon)

5. **Add setup instructions**
   - Expandable section: "How to get these values"
   - Step-by-step guide:
     1. Go to Meta Business Manager
     2. Navigate to WhatsApp > API Setup
     3. Copy Phone Number ID
     4. Copy Business Account ID
     5. Create System User
     6. Generate Access Token
     7. Copy token and paste here
   - Link to Meta Business Manager
   - Link to LCC documentation

6. **Implement Limits section**
   - Field: Daily Message Limit (number input)
   - Help text: "Maximum messages per day (default: 1000)"
   - Range: 0 to 100,000
   - Shows current usage: "Used 234/1000 today"
   - Prevents exceeding Meta tier limits

7. **Implement Status section**
   - Toggle: Enable WhatsApp Notifications
   - When OFF, no messages sent (all triggers disabled)
   - Clear indication of current status
   - Confirmation dialog when disabling

8. **Add test connection button**
   - "Test Connection" button below form
   - Calls backend API to verify credentials
   - Test sends a test message to configured number
   - Shows success or error message with details
   - Validates before allowing save

9. **Implement form validation**
   - Required fields: Phone Number ID, Business Account ID, Access Token
   - Format validation for IDs (numeric)
   - Token validation (starts with "EAAA...")
   - Daily limit validation (positive integer)
   - Real-time validation with error messages

10. **Add save configuration action**
    - "Save Configuration" button
    - Calls updateConfig() API with form data
    - Show loading spinner during save
    - On success: show success message, update UI
    - On error: display error message, keep form open

11. **Display current status and usage**
    - Show connection status: Connected (green) or Not Connected (red)
    - Display daily usage: "234 messages sent today out of 1000"
    - Show usage percentage bar
    - Reset time: "Resets at midnight Asia/Colombo"

12. **Add warning for sensitive data**
    - Prominent warning: "Access tokens are sensitive. Never share them."
    - Note: "Tokens are encrypted and stored securely."
    - Link to security documentation
    - Option to regenerate token (links to Meta)

13. **Implement reset configuration**
    - "Reset Configuration" button (dangerous action)
    - Confirmation dialog with warning
    - Clears all WhatsApp settings
    - Disables WhatsApp functionality
    - Use when switching accounts or troubleshooting

14. **Add webhooks configuration section**
    - Display webhook URL for Meta configuration
    - Format: `https://yourtenant.lcc.lk/api/webhooks/whatsapp/`
    - Display webhook verify token (read-only)
    - Copy to clipboard buttons
    - Instructions for configuring in Meta

15. **Show logs and recent activity**
    - Display recent WhatsApp API calls
    - Show errors or warnings
    - Link to full logs or message history
    - Helps troubleshooting

### Configuration Form Layout

```
Admin > WhatsApp > Configuration:
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WhatsApp Configuration                                           │
│  ═══════════════════════                                          │
│                                                                    │
│  Connection Status: ✓ Connected                                   │
│  Daily Usage: 234 / 1,000 messages  [████████░░] 23%             │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Connection Details                                         │  │
│  │ ──────────────────                                         │  │
│  │                                                            │  │
│  │ Phone Number ID*:                                          │  │
│  │ [1234567890123456_________________________]                │  │
│  │ ℹ From Meta Business Manager > WhatsApp > API Setup        │  │
│  │                                                            │  │
│  │ Business Account ID*:                                      │  │
│  │ [9876543210_________________________________]              │  │
│  │ ℹ Your WhatsApp Business Account ID                        │  │
│  │                                                            │  │
│  │ Access Token*:                                             │  │
│  │ [••••••••••••••••••••••••••••••••] [👁 Show]             │  │
│  │ ℹ System User Token from Meta Business Manager             │  │
│  │                                                            │  │
│  │ [▶ How to get these values]                                │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Message Limits                                             │  │
│  │ ───────────────                                            │  │
│  │                                                            │  │
│  │ Daily Message Limit:                                       │  │
│  │ [1000____________] messages per day                        │  │
│  │ ℹ Maximum messages to send daily (prevents quota exceed)   │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Status                                                     │  │
│  │ ──────                                                     │  │
│  │                                                            │  │
│  │ Enable WhatsApp Notifications: [Toggle: ON ✓]             │  │
│  │ ℹ When disabled, no messages will be sent                  │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Webhooks                                                   │  │
│  │ ─────────                                                  │  │
│  │                                                            │  │
│  │ Webhook URL:                                               │  │
│  │ https://yourtenant.lcc.lk/api/webhooks/whatsapp/           │  │
│  │ [Copy]                                                     │  │
│  │                                                            │  │
│  │ Verify Token:                                              │  │
│  │ lcc_whatsapp_verify_token_2026 [Copy]                     │  │
│  │                                                            │  │
│  │ ℹ Configure these in Meta Business Manager > Webhooks      │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ⚠ Warning: Access tokens are sensitive. Keep them secure.        │
│                                                                    │
│  [Test Connection]  [Save Configuration]  [Reset Configuration]   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Configuration Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Phone Number ID | Text | Yes | Numeric, 16 digits |
| Business Account ID | Text | Yes | Numeric, 10+ digits |
| Access Token | Password | Yes | Starts with "EAAA" |
| Daily Limit | Number | Yes | 1 to 100,000 |
| Enable WhatsApp | Toggle | Yes | Boolean |

### Connection Test Flow

```
Test Connection Process:
1. Admin clicks "Test Connection"
2. Frontend validates form fields
3. Calls backend test endpoint with credentials
4. Backend attempts to:
   - Validate credentials format
   - Call Meta API to verify access
   - Send test message (optional)
5. Backend returns result:
   - Success: "Connection successful! ✓"
   - Error: "Connection failed: Invalid token"
6. Display result to admin
7. If successful, enable Save button
```

### Expected Outcome

- Comprehensive WhatsApp configuration interface
- Clear setup instructions and help text
- Connection testing functionality
- Webhook configuration display
- Secure handling of sensitive credentials

### Verification Checklist

- [ ] Configuration page created in admin section
- [ ] Form fetches and displays current config
- [ ] All configuration fields present and validated
- [ ] Setup instructions expandable section
- [ ] Test connection functionality works
- [ ] Save configuration updates backend
- [ ] Daily usage and status displayed
- [ ] Webhook URLs and tokens shown with copy buttons
- [ ] Security warnings for sensitive data
- [ ] Reset configuration with confirmation dialog

---

## Task 90: Create Delivery Report UI

### Overview

Create an analytics dashboard for WhatsApp message delivery metrics. This UI displays key performance indicators (KPIs), delivery statistics, trend charts, template performance, and failure analysis. Admins can view aggregate metrics, filter by date range and template, and export reports. This interface provides visibility into WhatsApp effectiveness and helps identify issues.

The delivery report combines data from WhatsAppMessage and MessageLog models to calculate metrics like delivery rate, read rate, failure rate, average delivery time, and more. Charts visualize trends over time, showing the health and performance of WhatsApp messaging.

### Dependencies

- Task 84: Create WhatsApp API Client (API methods available)
- Task 87: Create Message History UI (similar table components)
- Admin dashboard structure (Phase-07)
- Charting library (Recharts, Chart.js, or similar)

### Instructions

1. **Create delivery report page**
   - Navigate to `app/(admin)/whatsapp/reports/` directory
   - Create file `page.tsx` for delivery report
   - Import WhatsApp API client and types
   - Import chart components and card components

2. **Fetch delivery statistics**
   - On page load, call getDeliveryStats() API
   - Default date range: last 30 days
   - Support custom date range selection
   - Show loading state during fetch

3. **Design KPI cards section**
   - Display 4-6 key metrics in cards
   - Metrics: Total Sent, Delivered, Read, Failed, Delivery Rate, Read Rate
   - Use large numbers with icons
   - Show percentage change vs previous period
   - Color-coded: green for good, red for bad

4. **Implement Total Sent metric**
   - Display total messages sent in date range
   - Icon: Paper plane or message icon
   - Show count: "1,234"
   - Percentage change: "+12% vs last period"

5. **Implement Delivered metric**
   - Display messages with status DELIVERED or READ
   - Icon: Checkmark or delivered icon
   - Show count and percentage of total: "1,180 (95.6%)"
   - Percentage change vs previous period

6. **Implement Read metric**
   - Display messages with status READ
   - Icon: Double checkmark or eye icon
   - Show count and percentage: "987 (80%)"
   - Read rate = Read / Delivered

7. **Implement Failed metric**
   - Display messages with status FAILED
   - Icon: X mark or error icon
   - Show count and percentage: "54 (4.4%)"
   - Percentage change vs previous period
   - Red color to indicate problem

8. **Implement Delivery Rate metric**
   - Calculate: (Delivered + Read) / Total Sent * 100
   - Display as percentage: "95.6%"
   - Show trend indicator (up/down arrow)
   - Target: > 95%

9. **Implement Read Rate metric**
   - Calculate: Read / (Delivered + Read) * 100
   - Display as percentage: "80%"
   - Shows customer engagement
   - Target: > 70%

10. **Create delivery trend chart**
    - Line or area chart showing messages over time
    - X-axis: Date (daily, weekly, or monthly buckets)
    - Y-axis: Message count
    - Multiple lines: Sent, Delivered, Read, Failed
    - Color-coded for clarity
    - Interactive hover showing exact values

11. **Create delivery funnel chart**
    - Funnel visualization showing message journey
    - Stages: Sent → Delivered → Read
    - Show count and percentage at each stage
    - Visualizes drop-off rate
    - Helps identify delivery issues

12. **Implement template performance table**
    - Table showing metrics by template
    - Columns: Template Name, Sent, Delivered, Read, Delivery Rate, Read Rate
    - Sort by any column
    - Identifies best/worst performing templates
    - Link to message history filtered by template

13. **Add date range filter**
    - Date picker for start and end dates
    - Preset options: Last 7 days, Last 30 days, Last 90 days, This Month, Last Month
    - Apply button to fetch new data
    - Show selected range prominently

14. **Add template filter**
    - Dropdown to select specific template
    - Option: "All Templates" or specific template
    - Filters all charts and tables
    - Useful for analyzing individual templates

15. **Implement failure analysis section**
    - Table of failed messages with reasons
    - Parse failed_reason JSON
    - Group by error type
    - Show count for each error type
    - Help text explaining common errors

16. **Add export functionality**
    - "Export Report" button
    - Exports data as CSV or PDF
    - Includes all metrics, charts (as images), and tables
    - Useful for sharing with stakeholders

17. **Calculate average delivery time**
    - Metric: Average time from sent to delivered
    - Display in seconds or minutes: "Avg: 2.3 seconds"
    - Helps assess Meta API performance
    - Lower is better

18. **Show hourly distribution chart**
    - Bar chart showing messages sent by hour of day
    - X-axis: Hour (0-23)
    - Y-axis: Message count
    - Identifies peak sending times
    - Useful for capacity planning

### Delivery Report Layout

```
Admin > WhatsApp > Reports:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WhatsApp Delivery Report                        [Export Report]  │
│  ═════════════════════════                                         │
│                                                                    │
│  Date Range: [Last 30 days ▼] [Jan 1, 2026] to [Jan 31, 2026]    │
│  Template: [All Templates ▼]                     [Apply Filters]  │
│                                                                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │ 📤 Total   │ │ ✓ Delivered│ │ 👁 Read     │ │ ✗ Failed   │    │
│  │            │ │            │ │            │ │            │    │
│  │  1,234     │ │  1,180     │ │    987     │ │     54     │    │
│  │            │ │  (95.6%)   │ │  (80.0%)   │ │  (4.4%)    │    │
│  │            │ │            │ │            │ │            │    │
│  │ +12% ↑     │ │  +2% ↑     │ │  +5% ↑     │ │  -10% ↓    │    │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                    │
│  ┌────────────┐ ┌────────────┐                                   │
│  │ Delivery   │ │ Read Rate  │                                   │
│  │ Rate       │ │            │                                   │
│  │            │ │            │                                   │
│  │  95.6%     │ │   80.0%    │                                   │
│  │            │ │            │                                   │
│  │  Target:   │ │  Target:   │                                   │
│  │   >95%     │ │   >70%     │                                   │
│  └────────────┘ └────────────┘                                   │
│                                                                    │
│  Delivery Trend (Last 30 Days)                                    │
│  ────────────────────────────                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1400 │                              ╱────  Sent           │   │
│  │ 1200 │                         ╱────     ─  Delivered     │   │
│  │ 1000 │                    ╱────            ─ Read         │   │
│  │  800 │               ╱────                                │   │
│  │  600 │          ╱────                                     │   │
│  │  400 │     ╱────                                          │   │
│  │  200 │╱────                                               │   │
│  │    0 └────────────────────────────────────────────────── │   │
│  │      Jan 1      Jan 10      Jan 20      Jan 31           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  Template Performance                                              │
│  ────────────────────                                             │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Template       │ Sent│ Delivered│ Read│ Delivery %│ Read %  ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ Order Confirm  │ 456 │   442    │ 398 │   96.9%   │  90.0%  ││
│  │ Order Shipped  │ 398 │   384    │ 312 │   96.5%   │  81.3%  ││
│  │ Delivered      │ 342 │   326    │ 258 │   95.3%   │  79.1%  ││
│  │ Payment Rcvd   │ 38  │    28    │  19 │   73.7%   │  67.9%  ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                    │
│  Failure Analysis                                                  │
│  ─────────────────                                                │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Error Type              │ Count │ Percentage                 ││
│  ├──────────────────────────────────────────────────────────────┤│
│  │ Invalid Phone Number    │  24   │ 44.4%                      ││
│  │ Recipient Not on WA     │  18   │ 33.3%                      ││
│  │ Template Not Approved   │   8   │ 14.8%                      ││
│  │ Rate Limit Exceeded     │   4   │  7.4%                      ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### KPI Metrics

| Metric | Calculation | Target | Purpose |
|--------|-------------|--------|---------|
| Total Sent | Count of all messages | N/A | Overall volume |
| Delivered | Count where status = DELIVERED or READ | N/A | Successful delivery |
| Read | Count where status = READ | N/A | Customer engagement |
| Failed | Count where status = FAILED | < 5% | Issue identification |
| Delivery Rate | (Delivered + Read) / Total * 100 | > 95% | Delivery success |
| Read Rate | Read / (Delivered + Read) * 100 | > 70% | Engagement level |

### Chart Types

| Chart | Data | Insight |
|-------|------|---------|
| Line Chart | Daily sent/delivered/read/failed | Trend over time |
| Funnel Chart | Sent → Delivered → Read | Drop-off visualization |
| Bar Chart | Messages by hour | Peak usage times |
| Table | Template performance | Best/worst templates |

### Expected Outcome

- Comprehensive delivery analytics dashboard
- Key metrics displayed clearly
- Trend visualization with charts
- Template performance comparison
- Failure analysis for troubleshooting

### Verification Checklist

- [ ] Delivery report page created in admin section
- [ ] KPI cards display all key metrics
- [ ] Delivery trend chart shows data over time
- [ ] Template performance table works
- [ ] Date range filter updates data
- [ ] Template filter works
- [ ] Failure analysis section shows error types
- [ ] Export functionality generates report
- [ ] All calculations accurate (delivery rate, read rate)
- [ ] Charts render correctly with proper labels

---

## Task 91: Create Integration Tests

### Overview

Create comprehensive end-to-end integration tests for the WhatsApp Business API integration. These tests validate the entire flow from configuration to message sending to webhook delivery tracking. Tests cover happy paths, error scenarios, edge cases, and cross-system interactions. They ensure reliability, catch regressions, and provide confidence in production deployment.

Integration tests run against a test environment with mocked Meta API responses. They test backend APIs, frontend components, database interactions, webhook handling, and business logic. Tests use pytest for backend and Jest/Playwright for frontend.

### Dependencies

- Task 90: Create Delivery Report UI (all components complete)
- All backend tasks (Groups A-E) complete
- Test environment configured
- Mock Meta API responses set up

### Instructions

1. **Set up test environment**
   - Create test database with schema
   - Configure test settings (separate from production)
   - Set up mock Meta API server or use fixtures
   - Prepare test data (tenants, customers, templates)

2. **Create test fixtures**
   - Define reusable fixtures for common objects
   - Fixtures: test tenant, test customer, test template, test config
   - Use pytest fixtures for backend, Jest fixtures for frontend
   - Ensure fixtures are isolated and idempotent

3. **Test WhatsApp configuration (Task 20-24)**
   - Test creating WhatsAppConfig
   - Test updating config fields
   - Test validation (invalid phone number ID, missing token)
   - Test enabling/disabling WhatsApp
   - Test daily limit enforcement

4. **Test template management (Task 44-47)**
   - Test creating MessageTemplate
   - Test updating template fields
   - Test parameter validation (sequential, max 10)
   - Test button configuration (CTA URL, Quick Reply)
   - Test template activation/deactivation

5. **Test message sending (Task 46-51)**
   - Test creating WhatsAppMessage
   - Test filling template with parameters
   - Test message status progression (PENDING → SENT)
   - Test daily limit enforcement (reject when over limit)
   - Test sending when WhatsApp disabled (should skip)

6. **Test notification triggers (Task 52-62)**
   - Test order_created trigger sends confirmation
   - Test order_paid trigger sends payment receipt
   - Test order_shipped trigger sends shipping update
   - Test order_delivered trigger sends delivery notification
   - Test shipment_created trigger sends tracking info
   - Test opt-out prevents message sending

7. **Test Meta API client (Task 33-38)**
   - Test send_message() with valid data
   - Test error handling (invalid token, rate limit)
   - Test retry logic for transient failures
   - Test logging of API calls
   - Use mock responses to simulate Meta API

8. **Test webhook processing (Task 69-82)**
   - Test webhook signature validation (valid, invalid)
   - Test parsing message status updates
   - Test updating MessageLog from webhook
   - Test handling status transitions (sent → delivered → read)
   - Test failure reason extraction
   - Test webhook queue for async processing
   - Test idempotency (same webhook received twice)

9. **Test opt-in functionality (Task 85-86)**
   - Test customer can opt-in during checkout
   - Test opt-in status saved to database
   - Test customer can opt-out in settings
   - Test opted-out customers don't receive messages
   - Test opt-in timestamp recorded correctly

10. **Test frontend API client (Task 84)**
    - Test all API client methods (getConfig, getTemplates, etc.)
    - Test error handling for 400, 401, 403, 404, 500 errors
    - Test authentication headers included
    - Test pagination for list endpoints
    - Use mock API responses or test backend

11. **Test frontend components (Task 85-90)**
    - Test WhatsApp opt-in checkbox renders and toggles
    - Test notification settings page displays status
    - Test message history table loads and displays data
    - Test template manager form validation
    - Test config UI form validation and save
    - Test delivery report displays metrics correctly
    - Use Jest and React Testing Library or Playwright

12. **Create E2E user flow test**
    - Full flow from admin setup to customer opt-in to message delivery
    - Steps:
      1. Admin configures WhatsApp (phone number, token)
      2. Admin creates message template
      3. Customer places order and opts into WhatsApp
      4. Order confirmation message sent automatically
      5. Webhook received with delivery status
      6. MessageLog updated to DELIVERED
      7. Delivery report shows message
    - Use Playwright or Cypress for browser automation

13. **Test error scenarios**
    - Invalid Meta API token (401 error)
    - Rate limit exceeded (429 error)
    - Invalid phone number (400 error)
    - Template not approved by Meta
    - Daily limit reached (message rejected)
    - Webhook signature validation failure
    - Database connection failure (retry logic)

14. **Test edge cases**
    - Customer opts in and out multiple times
    - Message sent before opt-in recorded (race condition)
    - Webhook arrives before message created
    - Multiple webhooks for same message (idempotency)
    - Template deleted while message pending
    - Config disabled while messages in queue

15. **Add performance tests**
    - Test webhook processing speed (< 100ms per webhook)
    - Test sending 100 messages concurrently
    - Test database query performance with 10k messages
    - Test frontend rendering with large message list

16. **Create test coverage report**
    - Run pytest with coverage flag for backend
    - Run Jest with coverage for frontend
    - Target: > 80% code coverage
    - Identify untested code paths

17. **Document test execution**
    - Create test README with setup instructions
    - Document how to run tests locally
    - Document how to run in CI/CD pipeline
    - Provide troubleshooting tips for common issues

### Test Structure

```
tests/
├── integration/
│   ├── whatsapp/
│   │   ├── test_config.py
│   │   ├── test_templates.py
│   │   ├── test_messages.py
│   │   ├── test_triggers.py
│   │   ├── test_meta_api.py
│   │   ├── test_webhooks.py
│   │   └── test_e2e_flow.py
│   └── frontend/
│       ├── test_api_client.ts
│       ├── test_components.tsx
│       └── test_e2e.spec.ts
└── fixtures/
    ├── whatsapp_config.py
    ├── templates.py
    └── messages.py
```

### Test Coverage Matrix

| Component | Tests | Coverage Target |
|-----------|-------|-----------------|
| Configuration | 12 tests | 90% |
| Templates | 15 tests | 85% |
| Messages | 18 tests | 90% |
| Triggers | 20 tests | 95% |
| Meta API Client | 12 tests | 85% |
| Webhooks | 16 tests | 90% |
| Opt-In | 8 tests | 90% |
| Frontend API | 11 tests | 80% |
| Frontend Components | 15 tests | 75% |
| E2E Flow | 5 tests | N/A |

### Key Test Scenarios

| Scenario | Type | Priority |
|----------|------|----------|
| Order created sends confirmation | Integration | High |
| Webhook updates MessageLog | Integration | High |
| Template parameter validation | Unit | High |
| Daily limit enforcement | Integration | High |
| Opt-out prevents sending | Integration | High |
| Invalid token error handling | Unit | Medium |
| Webhook signature validation | Unit | High |
| Idempotent webhook processing | Integration | Medium |
| Frontend form validation | Component | Medium |
| E2E: Setup to delivery | E2E | High |

### Expected Outcome

- Comprehensive test suite covering all WhatsApp functionality
- Backend integration tests with pytest
- Frontend component and E2E tests with Jest/Playwright
- High code coverage (> 80%)
- CI/CD integration ready

### Verification Checklist

- [ ] Test environment set up with test database
- [ ] Fixtures created for common test objects
- [ ] Configuration tests written and passing
- [ ] Template tests written and passing
- [ ] Message sending tests written and passing
- [ ] Trigger tests written and passing
- [ ] Meta API client tests written and passing
- [ ] Webhook processing tests written and passing
- [ ] Opt-in tests written and passing
- [ ] Frontend API client tests written and passing
- [ ] Frontend component tests written and passing
- [ ] E2E user flow test written and passing
- [ ] Error scenario tests written and passing
- [ ] Edge case tests written and passing
- [ ] Test coverage report generated (> 80%)
- [ ] Test documentation written

---

## Task 92: Create Documentation

### Overview

Create comprehensive documentation for the WhatsApp Business API integration. Documentation covers setup instructions, configuration guides, user guides for customers and admins, troubleshooting, API reference, and best practices. This documentation ensures successful adoption, reduces support burden, and serves as a reference for future development.

Documentation is written in Markdown and includes screenshots, diagrams, and examples. It's organized into admin documentation (for tenant admins setting up WhatsApp) and user documentation (for customers managing preferences). Developer documentation explains architecture and API endpoints.

### Dependencies

- Task 91: Create Integration Tests (all functionality complete and tested)
- All features implemented and working
- Screenshots captured from live system

### Instructions

1. **Create documentation structure**
   - Navigate to `docs/integrations/` directory
   - Create directory `whatsapp/`
   - Create main file `README.md` (overview and index)
   - Create subdirectories: `setup/`, `user-guide/`, `admin-guide/`, `api/`, `troubleshooting/`

2. **Write overview documentation**
   - File: `whatsapp/README.md`
   - Sections: What is WhatsApp Integration, Features, Benefits, Architecture Overview, Getting Started
   - High-level explanation of WhatsApp functionality
   - Links to detailed guides

3. **Create setup guide for admins**
   - File: `setup/getting-started.md`
   - Step-by-step instructions for first-time setup
   - Sections:
     1. Prerequisites (Meta Business Manager account)
     2. Create WhatsApp Business Account
     3. Get Phone Number ID and Access Token
     4. Configure LCC WhatsApp Settings
     5. Create Message Templates
     6. Configure Webhooks
     7. Test Configuration
   - Include screenshots for each step

4. **Document Meta Business Manager setup**
   - File: `setup/meta-business-manager.md`
   - Detailed guide for Meta setup
   - Steps:
     1. Create Business Manager account
     2. Add WhatsApp product
     3. Register phone number
     4. Create System User
     5. Generate Access Token
     6. Configure webhooks
   - Screenshots of Meta interface

5. **Write template creation guide**
   - File: `admin-guide/creating-templates.md`
   - Explain template structure and components
   - Document template parameters and buttons
   - Provide examples for each template type:
     - Order Confirmation
     - Order Shipped
     - Delivery Complete
     - Payment Received
   - Include best practices (keep body text under 1024 chars, use clear CTAs)

6. **Document configuration settings**
   - File: `admin-guide/configuration.md`
   - Explain each configuration field
   - Phone Number ID: what it is, where to find it
   - Access Token: how to generate, security best practices
   - Daily Limit: how it works, recommended values
   - Enable/Disable toggle: impact of disabling
   - Webhook configuration

7. **Write customer user guide**
   - File: `user-guide/opting-in.md`
   - Explain how customers opt-in during checkout
   - Document notification settings page
   - Explain how to opt-out
   - Describe what messages customers will receive
   - Privacy and data usage information

8. **Document notification triggers**
   - File: `admin-guide/notification-triggers.md`
   - Table of all triggers (order_created, order_shipped, etc.)
   - Explain when each trigger fires
   - Show which templates are used for each trigger
   - Explain how to enable/disable triggers

9. **Create API reference**
   - File: `api/endpoints.md`
   - Document all WhatsApp API endpoints
   - For each endpoint:
     - HTTP method and path
     - Request parameters
     - Request body schema
     - Response schema
     - Example request/response
     - Error codes
   - Use OpenAPI/Swagger format if available

10. **Document webhook endpoints**
    - File: `api/webhooks.md`
    - Explain webhook flow and signature validation
    - Document webhook payload structure
    - Provide examples of different webhook events (sent, delivered, read, failed)
    - Explain how to test webhooks locally

11. **Write troubleshooting guide**
    - File: `troubleshooting/common-issues.md`
    - Common issues and solutions:
      - "Messages not sending" → Check config, daily limit, opt-in status
      - "Invalid token error" → Regenerate token in Meta
      - "Template not found" → Check template active and approved
      - "Webhook signature invalid" → Check verify token matches
      - "Daily limit exceeded" → Increase limit or wait for reset
    - Include diagnostic steps and log locations

12. **Document error codes**
    - File: `troubleshooting/error-codes.md`
    - Table of Meta API error codes with explanations
    - Example: 190 = Invalid token, 100 = Invalid phone number
    - Include resolution steps for each error

13. **Create best practices guide**
    - File: `admin-guide/best-practices.md`
    - Recommendations for effective WhatsApp usage:
      - Keep messages concise and relevant
      - Use clear, actionable CTAs
      - Respect customer preferences (opt-in/opt-out)
      - Monitor delivery rates and adjust
      - Test templates before production
      - Use appropriate template categories (UTILITY for transactional)
      - Don't exceed Meta tier limits
    - Compliance with WhatsApp Business Policy

14. **Add architecture documentation**
    - File: `api/architecture.md`
    - High-level architecture diagram showing:
      - LCC Backend (Django)
      - Meta WhatsApp API
      - Webhook flow
      - Database models
      - Frontend components
    - Explain data flow from trigger to delivery
    - Describe async processing with Celery

15. **Include sample code snippets**
    - File: `api/examples.md`
    - Code examples for common operations:
      - Sending a message via API (curl, Python)
      - Creating a template via API
      - Processing a webhook in custom code
    - Use clear, commented code

16. **Create FAQ section**
    - File: `FAQ.md`
    - Common questions and answers:
      - "How much does WhatsApp cost?" → Free for transactional messages
      - "Can customers reply to messages?" → Yes, but not handled in v1
      - "How do I get more templates?" → Create in template manager
      - "What happens if I disable WhatsApp?" → Messages not sent
      - "Can I send marketing messages?" → Only with approved MARKETING templates

17. **Add changelog**
    - File: `CHANGELOG.md`
    - Document version history and changes
    - Current version: v1.0.0 - Initial release
    - Include: features added, bug fixes, breaking changes
    - Keep updated with future releases

18. **Include screenshots and diagrams**
    - Capture screenshots of all UI components:
      - Configuration page
      - Template manager
      - Message history
      - Delivery report
      - Opt-in checkbox
      - Notification settings
    - Create diagrams:
      - System architecture
      - Message flow (trigger → Meta → webhook)
      - Database schema
      - Frontend component hierarchy
    - Use tools like Figma, Draw.io, or Mermaid

### Documentation Structure

```
docs/
└── integrations/
    └── whatsapp/
        ├── README.md (Overview and index)
        ├── setup/
        │   ├── getting-started.md
        │   └── meta-business-manager.md
        ├── admin-guide/
        │   ├── configuration.md
        │   ├── creating-templates.md
        │   ├── notification-triggers.md
        │   └── best-practices.md
        ├── user-guide/
        │   └── opting-in.md
        ├── api/
        │   ├── endpoints.md
        │   ├── webhooks.md
        │   ├── architecture.md
        │   └── examples.md
        ├── troubleshooting/
        │   ├── common-issues.md
        │   └── error-codes.md
        ├── FAQ.md
        └── CHANGELOG.md
```

### Documentation Sections

| Section | Audience | Content |
|---------|----------|---------|
| Overview | All | High-level intro, features, benefits |
| Setup | Admins | Step-by-step first-time setup |
| Configuration | Admins | Detailed config field explanations |
| Templates | Admins | How to create and manage templates |
| User Guide | Customers | How to opt-in and manage preferences |
| API Reference | Developers | All endpoints, schemas, examples |
| Webhooks | Developers | Webhook structure and handling |
| Troubleshooting | Admins, Devs | Common issues and solutions |
| Best Practices | Admins | Recommendations and compliance |
| FAQ | All | Quick answers to common questions |

### Key Documentation Topics

| Topic | File | Purpose |
|-------|------|---------|
| Getting Started | setup/getting-started.md | First-time setup guide |
| Meta Setup | setup/meta-business-manager.md | Meta platform configuration |
| Configuration | admin-guide/configuration.md | LCC settings explanation |
| Templates | admin-guide/creating-templates.md | Template creation and management |
| Triggers | admin-guide/notification-triggers.md | When messages are sent |
| Opt-In | user-guide/opting-in.md | Customer preference management |
| API Endpoints | api/endpoints.md | Backend API reference |
| Webhooks | api/webhooks.md | Webhook handling |
| Architecture | api/architecture.md | System design and data flow |
| Troubleshooting | troubleshooting/common-issues.md | Problem solving |

### Expected Outcome

- Comprehensive, well-organized documentation
- Clear setup and configuration guides
- API reference with examples
- Troubleshooting resources
- Best practices and compliance guidance

### Verification Checklist

- [ ] Documentation structure created in `docs/integrations/whatsapp/`
- [ ] Overview README.md written with index
- [ ] Setup guide with step-by-step instructions
- [ ] Meta Business Manager setup documented
- [ ] Template creation guide with examples
- [ ] Configuration settings documented
- [ ] Customer user guide written
- [ ] Notification triggers documented
- [ ] API reference with all endpoints
- [ ] Webhook documentation complete
- [ ] Troubleshooting guide with common issues
- [ ] Error codes documented
- [ ] Best practices guide written
- [ ] Architecture documentation with diagrams
- [ ] Code examples provided
- [ ] FAQ section written
- [ ] Screenshots captured and included
- [ ] Diagrams created (architecture, flow, schema)
- [ ] CHANGELOG.md created
- [ ] Documentation reviewed for accuracy and clarity

---

## Summary

This document has covered all 10 tasks for WhatsApp Business API frontend, testing, and documentation:

- **Task 83:** TypeScript types for type safety
- **Task 84:** API client for backend communication
- **Task 85:** Opt-in checkbox for checkout
- **Task 86:** Notification settings for customer control
- **Task 87:** Message history UI for admin visibility
- **Task 88:** Template manager UI for admin CRUD
- **Task 89:** Configuration UI for WhatsApp setup
- **Task 90:** Delivery report UI for analytics
- **Task 91:** Integration tests for reliability
- **Task 92:** Comprehensive documentation for adoption

Together, these tasks complete the WhatsApp Business API integration, providing a full-featured, production-ready system for WhatsApp messaging in LankaCommerce Cloud.
