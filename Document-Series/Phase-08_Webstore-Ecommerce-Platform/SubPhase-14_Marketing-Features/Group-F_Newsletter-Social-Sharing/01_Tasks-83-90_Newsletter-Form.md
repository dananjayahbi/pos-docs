# Tasks 83-90: Newsletter Form Implementation

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** F - Newsletter & Social Sharing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-91-96_Social-Share-Verify.md](02_Tasks-91-96_Social-Share-Verify.md)

---

## Document Overview

This document covers the implementation of newsletter subscription features for the webstore. It establishes the type definitions, API integration, React hooks, form components, validation logic, success feedback, and newsletter placements in footer and popup modal contexts.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Newsletter Types | Low | 15 min |
| 84 | Create Newsletter API | Medium | 30 min |
| 85 | Create Subscribe Mutation | Medium | 25 min |
| 86 | Create NewsletterForm Component | Medium | 35 min |
| 87 | Create Newsletter Validation | Low | 20 min |
| 88 | Create Newsletter Success | Low | 20 min |
| 89 | Create Footer Newsletter | Medium | 30 min |
| 90 | Create Popup Newsletter | Medium | 35 min |

---

## Task 83: Create Newsletter Types

### Overview
Define TypeScript type definitions for newsletter subscription functionality. These types ensure type safety across the newsletter feature, covering subscription requests, API responses, preference settings, and form data structures.

### Dependencies
- Task 82 (WhatsApp Integration Complete) from previous group
- TypeScript configuration established
- Frontend types directory structure

### Instructions

1. **Create newsletter types directory**
   - Navigate to `frontend/types/marketing/` directory
   - Create new file named `newsletter.types.ts`
   - This centralizes all newsletter-related type definitions

2. **Define NewsletterSubscription type**
   - Include email field (string, required)
   - Include name field (string, optional)
   - Include source field (string) to track subscription origin
   - Add timestamp field (Date or string)

3. **Define NewsletterResponse type**
   - Include success field (boolean)
   - Include message field (string) for user feedback
   - Include optional error field for failure details
   - Add optional subscriptionId for tracking

4. **Define NewsletterPreferences type**
   - Include categories array (string[]) for topic preferences
   - Include frequency field (daily, weekly, monthly)
   - Include emailFormat field (html, plain)
   - Add optional fields for future expansion

5. **Define NewsletterFormData type**
   - Match form input structure
   - Include validation requirements
   - Prepare for React Hook Form integration

6. **Add subscription source enum**
   - Define sources: footer, popup, checkout, product-page
   - Use TypeScript enum or union type
   - Helps track conversion sources

### Type Definitions Structure

| Type | Purpose | Key Fields |
|------|---------|------------|
| NewsletterSubscription | Subscription payload | email, name, source |
| NewsletterResponse | API response | success, message |
| NewsletterPreferences | User preferences | categories, frequency |
| NewsletterFormData | Form structure | email, consent |
| SubscriptionSource | Origin tracking | Enum of sources |

### Data Flow

```
User Input (Form)
    │
    ▼
NewsletterFormData (validation)
    │
    ▼
NewsletterSubscription (API payload)
    │
    ▼
Backend Processing
    │
    ▼
NewsletterResponse (result)
    │
    ▼
UI Feedback (success/error)
```

### Type Safety Benefits

| Benefit | Description |
|---------|-------------|
| Compile-time Checks | Catch errors before runtime |
| IDE Autocomplete | Better development experience |
| Documentation | Types serve as inline docs |
| Refactoring | Safe code changes |

### Expected Outcome
- Complete type definitions for newsletter feature
- Type-safe data structures throughout application
- Foundation for API and form implementations
- Clear interfaces for all newsletter operations

### Verification Checklist
- [ ] `frontend/types/marketing/newsletter.types.ts` file created
- [ ] NewsletterSubscription type defined
- [ ] NewsletterResponse type defined
- [ ] NewsletterPreferences type defined
- [ ] NewsletterFormData type defined
- [ ] SubscriptionSource enum or type defined
- [ ] All types exported properly
- [ ] Types include JSDoc comments for clarity

---

## Task 84: Create Newsletter API

### Overview
Implement the API client for newsletter subscription operations. This module handles communication with the backend newsletter endpoints, manages request formatting, handles responses, and provides error handling for subscription operations.

### Dependencies
- Task 83: Create Newsletter Types
- API client infrastructure established
- Environment variables configured (API URL)

### Instructions

1. **Create newsletter API module**
   - Navigate to `frontend/lib/marketing/` directory
   - Create new file named `newsletter.ts`
   - This contains all newsletter API functions

2. **Import required dependencies**
   - Import newsletter types from Task 83
   - Import API client utilities (axios, fetch)
   - Import error handling utilities

3. **Define base API endpoint**
   - Set newsletter API base path: `/api/newsletter/`
   - Use environment variable for API URL
   - Prepare for multiple endpoints

4. **Implement subscribe function**
   - Create async function `subscribeToNewsletter`
   - Accept NewsletterSubscription parameter
   - Return Promise<NewsletterResponse>

5. **Build subscription request**
   - Method: POST
   - Endpoint: `/api/newsletter/subscribe`
   - Body: JSON with email, name, source
   - Headers: Content-Type application/json

6. **Implement response handling**
   - Parse successful response (200-299 status)
   - Extract success flag and message
   - Return formatted NewsletterResponse

7. **Implement error handling**
   - Catch network errors
   - Handle 4xx validation errors (email exists, invalid format)
   - Handle 5xx server errors
   - Return user-friendly error messages

8. **Add request timeout**
   - Set 10-second timeout for subscription
   - Handle timeout as error
   - Provide timeout message to user

9. **Implement unsubscribe function (optional)**
   - Create async function `unsubscribeFromNewsletter`
   - Accept email and token parameters
   - Handle unsubscribe endpoint

### API Endpoints

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| subscribeToNewsletter | POST | `/api/newsletter/subscribe` | New subscription |
| unsubscribeFromNewsletter | POST | `/api/newsletter/unsubscribe` | Cancel subscription |
| updatePreferences | PATCH | `/api/newsletter/preferences` | Update settings |

### Request Format

```
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "customer@example.com",
  "name": "John Silva",
  "source": "footer"
}
```

### Response Format

```
Success (200)
{
  "success": true,
  "message": "Successfully subscribed!",
  "subscriptionId": "sub_abc123"
}

Error (400)
{
  "success": false,
  "message": "Email already subscribed",
  "error": "DUPLICATE_EMAIL"
}
```

### Error Handling Strategy

| Error Type | Status | User Message |
|------------|--------|--------------|
| Network Error | N/A | "Connection failed. Please try again." |
| Invalid Email | 400 | "Please enter a valid email address." |
| Already Subscribed | 400 | "This email is already subscribed." |
| Server Error | 500 | "Something went wrong. Please try later." |
| Timeout | N/A | "Request timed out. Please try again." |

### Sri Lanka Considerations

| Aspect | Implementation |
|--------|----------------|
| Language Support | Accept Sinhala/Tamil names |
| Email Validation | International format support |
| Timezone | Handle LK timezone (UTC+5:30) |

### Expected Outcome
- Functional API client for newsletter operations
- Proper error handling and user feedback
- Type-safe request and response handling
- Ready for integration with React components

### Verification Checklist
- [ ] `frontend/lib/marketing/newsletter.ts` file created
- [ ] subscribeToNewsletter function implemented
- [ ] Types imported and used correctly
- [ ] POST request properly formatted
- [ ] Response parsing implemented
- [ ] Error handling covers all scenarios
- [ ] Timeout configured
- [ ] Functions exported properly
- [ ] API base URL from environment variable

---

## Task 85: Create Subscribe Mutation

### Overview
Create a custom React hook using React Query for managing newsletter subscription mutations. This hook provides state management, loading states, error handling, success callbacks, and caching for newsletter subscription operations.

### Dependencies
- Task 84: Create Newsletter API
- React Query configured in application
- React hooks infrastructure

### Instructions

1. **Create newsletter hooks directory**
   - Navigate to `frontend/hooks/marketing/` directory
   - Create new file named `useNewsletter.ts`
   - This houses newsletter-related hooks

2. **Import required dependencies**
   - Import useMutation from React Query
   - Import subscribeToNewsletter from Task 84
   - Import newsletter types

3. **Define hook options interface**
   - Create UseSubscribeOptions interface
   - Include onSuccess callback (optional)
   - Include onError callback (optional)
   - Include onSettled callback (optional)

4. **Implement useSubscribe hook**
   - Create function `useSubscribe`
   - Accept options parameter
   - Return useMutation result

5. **Configure mutation function**
   - Pass subscribeToNewsletter as mutationFn
   - Handle async API call execution
   - Return mutation result

6. **Implement success handling**
   - Execute onSuccess callback when provided
   - Pass response data to callback
   - Reset form state if needed

7. **Implement error handling**
   - Execute onError callback when provided
   - Pass error details to callback
   - Provide user-friendly error messages

8. **Configure retry logic**
   - Set retry count (1-2 times)
   - Avoid retry on 4xx errors (user errors)
   - Retry on network/5xx errors

9. **Add mutation state tracking**
   - Expose isLoading state
   - Expose isError state
   - Expose isSuccess state
   - Expose error and data values

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| mutate | Function | Trigger subscription |
| mutateAsync | Function | Promise-based trigger |
| isLoading | boolean | Request in progress |
| isError | boolean | Request failed |
| isSuccess | boolean | Request succeeded |
| error | Error | Error details |
| data | NewsletterResponse | Success data |
| reset | Function | Reset mutation state |

### Hook Usage Flow

```
Component
    │
    ▼
useSubscribe hook
    │
    ├─→ mutate(subscriptionData)
    │       │
    │       ▼
    │   API Call (subscribeToNewsletter)
    │       │
    │       ├─→ Success
    │       │     │
    │       │     ▼
    │       │   onSuccess callback
    │       │     │
    │       │     ▼
    │       │   Show success message
    │       │
    │       └─→ Error
    │             │
    │             ▼
    │       onError callback
    │             │
    │             ▼
    │       Show error message
    │
    └─→ Access loading/error states
```

### Callback Configuration

| Callback | When Triggered | Use Case |
|----------|----------------|----------|
| onSuccess | Subscription succeeds | Show success toast, reset form |
| onError | Subscription fails | Show error toast, log error |
| onSettled | Request completes | Clean up, analytics |

### State Management Benefits

| Feature | Benefit |
|---------|---------|
| Loading State | Show spinner, disable button |
| Error State | Display error message |
| Success State | Show confirmation |
| Data Caching | Avoid duplicate requests |
| Automatic Retries | Handle transient failures |

### Expected Outcome
- Custom React hook for newsletter subscriptions
- Proper state management for UI feedback
- Callback support for success/error handling
- Integration-ready for form components

### Verification Checklist
- [ ] `frontend/hooks/marketing/useNewsletter.ts` file created
- [ ] useSubscribe hook implemented
- [ ] useMutation configured correctly
- [ ] Success and error callbacks supported
- [ ] Loading, error, and success states exposed
- [ ] Retry logic configured
- [ ] Hook exports properly
- [ ] TypeScript types correct

---

## Task 86: Create NewsletterForm Component

### Overview
Build a reusable NewsletterForm component that handles newsletter subscription UI and logic. This component integrates form validation, API submission via the mutation hook, loading states, and provides a flexible interface for different placement contexts.

### Dependencies
- Task 85: Create Subscribe Mutation
- React Hook Form library configured
- UI component library available

### Instructions

1. **Create newsletter components directory**
   - Navigate to `frontend/components/marketing/` directory
   - Create subdirectory named `newsletter`
   - Create file `NewsletterForm.tsx`

2. **Import required dependencies**
   - Import React Hook Form (useForm)
   - Import useSubscribe hook from Task 85
   - Import newsletter types
   - Import UI components (Input, Button)

3. **Define component props interface**
   - Create NewsletterFormProps interface
   - Include onSuccess callback (optional)
   - Include placeholder prop (string, optional)
   - Include buttonText prop (string, optional)
   - Include variant prop (inline, stacked)

4. **Initialize form with React Hook Form**
   - Use useForm hook with NewsletterFormData type
   - Configure default values
   - Set validation mode (onBlur or onChange)

5. **Initialize subscription mutation**
   - Use useSubscribe hook
   - Configure onSuccess callback
   - Configure onError callback
   - Handle mutation states

6. **Implement form submission handler**
   - Create async onSubmit function
   - Format form data with source tracking
   - Call mutation with formatted data
   - Handle success/error responses

7. **Build form UI structure**
   - Create form element with onSubmit handler
   - Add email input field with proper attributes
   - Add submit button with loading state
   - Apply variant-specific styling (inline vs stacked)

8. **Implement inline variant**
   - Email input and button on same row
   - Use flexbox for horizontal layout
   - Optimize for narrow spaces (footer)

9. **Implement stacked variant**
   - Email input above button
   - Full-width layout
   - Better for mobile and popups

10. **Add GDPR consent (optional)**
    - Add checkbox for privacy consent
    - Link to privacy policy
    - Required before submission

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onSuccess | () => void | No | - | Success callback |
| placeholder | string | No | "Enter your email" | Input placeholder |
| buttonText | string | No | "Subscribe" | Button label |
| variant | "inline" \| "stacked" | No | "inline" | Layout style |
| source | string | Yes | - | Subscription source |

### Form Variants

**Inline Layout (Footer)**
```
┌──────────────────────────────────────┐
│ [  Email Address  ] [ Subscribe ]    │
└──────────────────────────────────────┘
```

**Stacked Layout (Popup)**
```
┌──────────────────────────────────────┐
│ [  Enter your email address...   ]  │
│                                      │
│ [       Subscribe Now            ]  │
└──────────────────────────────────────┘
```

### Form States

| State | UI Behavior |
|-------|-------------|
| Idle | Normal input and button |
| Loading | Button shows spinner, input disabled |
| Success | Show success message (Task 88) |
| Error | Show error message below input |

### Validation Integration

| Field | Validation | Error Message |
|-------|------------|---------------|
| Email | Required | "Email is required" |
| Email | Format (Task 87) | "Invalid email address" |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Labels | Use aria-label or visible label |
| Error Messages | aria-describedby for errors |
| Loading State | aria-busy during submission |
| Keyboard Nav | Proper tab order |

### Expected Outcome
- Reusable newsletter form component
- Support for inline and stacked layouts
- Integrated validation and submission
- Proper loading and error states
- Ready for footer and popup placement

### Verification Checklist
- [ ] `frontend/components/marketing/newsletter/NewsletterForm.tsx` created
- [ ] Component accepts all required props
- [ ] React Hook Form integrated
- [ ] useSubscribe hook connected
- [ ] Form submission handler implemented
- [ ] Inline variant styled correctly
- [ ] Stacked variant styled correctly
- [ ] Loading state disables form
- [ ] Validation integrated (Task 87)
- [ ] Component exports properly

---

## Task 87: Create Newsletter Validation

### Overview
Implement robust email validation for the newsletter subscription form. This includes client-side validation using regex patterns, real-time feedback, error messages, and integration with React Hook Form validation system.

### Dependencies
- Task 86: Create NewsletterForm Component
- React Hook Form validation system

### Instructions

1. **Define email validation regex**
   - Use RFC 5322 compliant regex pattern
   - Balance strictness with usability
   - Handle international domains

2. **Create validation utilities file**
   - Navigate to `frontend/lib/marketing/` directory
   - Create file `validation.ts` or add to existing
   - Export validation functions

3. **Implement email format validation**
   - Create function `isValidEmail`
   - Accept email string parameter
   - Return boolean (valid/invalid)
   - Use regex test method

4. **Add email domain validation**
   - Check for common typos (gmial.com → gmail.com)
   - Suggest corrections if possible
   - Warn on suspicious domains (optional)

5. **Integrate with React Hook Form**
   - Add validation rules to email field
   - Use `register` function with options
   - Specify required and pattern rules

6. **Configure validation messages**
   - "Email is required" for empty field
   - "Please enter a valid email address" for format errors
   - Keep messages user-friendly

7. **Implement real-time validation**
   - Set validation mode to "onBlur" or "onChange"
   - Show errors after user leaves field
   - Clear errors when user corrects input

8. **Add visual error indicators**
   - Red border on invalid input
   - Error message below input field
   - Error icon next to input (optional)

### Email Validation Regex

| Pattern | Use Case |
|---------|----------|
| Basic | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Strict | RFC 5322 compliant regex |
| Recommended | Balance between strict and usable |

### Validation Rules

| Rule | Requirement | Message |
|------|-------------|---------|
| Required | Email must not be empty | "Email is required" |
| Format | Must match email pattern | "Invalid email address" |
| Length | Max 254 characters | "Email too long" |

### Validation Flow

```
User Types Email
    │
    ▼
Blur Event (onBlur)
    │
    ▼
Run Validation
    │
    ├─→ Valid
    │     │
    │     ▼
    │   Clear errors
    │   Enable submit
    │
    └─→ Invalid
          │
          ▼
      Show error message
      Disable submit (optional)
```

### Error Display

| State | UI Element | Styling |
|-------|------------|---------|
| No Error | Normal input | Default border |
| Error | Red border + message | `border-red-500` |
| Success | Green border (optional) | `border-green-500` |

### Common Email Typos

| Typo | Suggestion |
|------|------------|
| gmial.com | gmail.com |
| yahooo.com | yahoo.com |
| hotmial.com | hotmail.com |

### Sri Lanka Specific

| Consideration | Implementation |
|---------------|----------------|
| Local Domains | Support .lk domains |
| Unicode Names | Support international characters |
| Mobile Numbers | Reject phone numbers as emails |

### Expected Outcome
- Robust email validation implementation
- User-friendly error messages
- Real-time validation feedback
- Integration with form submission

### Verification Checklist
- [ ] Email validation regex defined
- [ ] Validation function implemented
- [ ] React Hook Form validation rules configured
- [ ] Error messages defined
- [ ] Real-time validation working
- [ ] Error messages display correctly
- [ ] Valid emails pass validation
- [ ] Invalid emails show errors
- [ ] Submit button respects validation state

---

## Task 88: Create Newsletter Success

### Overview
Implement success feedback mechanism for newsletter subscriptions. This includes success message display, animated confirmation, auto-dismiss functionality, and optional redirect or form reset after successful subscription.

### Dependencies
- Task 86: Create NewsletterForm Component
- Task 85: Create Subscribe Mutation

### Instructions

1. **Define success message component**
   - Create `NewsletterSuccess.tsx` in newsletter directory
   - Accept props for customization
   - Display confirmation message

2. **Design success message UI**
   - Show checkmark icon or success icon
   - Display "Thanks for subscribing!" message
   - Add personalized text if name provided
   - Use brand colors for positive feedback

3. **Implement success animation**
   - Add fade-in animation on display
   - Optionally animate checkmark
   - Use CSS transitions or animation library
   - Keep animation subtle (200-300ms)

4. **Add auto-dismiss functionality**
   - Display success message for 3-5 seconds
   - Automatically hide after duration
   - Optionally reset form after dismiss
   - Use setTimeout or similar

5. **Integrate with form component**
   - Show success message when mutation succeeds
   - Hide form fields during success display
   - Replace form with success message
   - Provide option to return to form

6. **Implement form reset**
   - Clear email input after success
   - Reset form validation state
   - Prepare form for new submission
   - Use React Hook Form reset function

7. **Add success analytics tracking**
   - Track successful subscriptions
   - Record subscription source
   - Send to analytics platform
   - Help measure conversion rates

8. **Handle edge cases**
   - Already subscribed scenario
   - Show appropriate message
   - Don't treat as error

### Success Message Variations

| Context | Message | Duration |
|---------|---------|----------|
| Footer | "Thanks for subscribing!" | 3 seconds |
| Popup | "You're all set! Check your email." | 5 seconds |
| Checkout | "Subscribed! You'll get exclusive offers." | 4 seconds |

### Success Animation

```
Initial State (Hidden)
    │
    ▼
Mutation Success
    │
    ▼
Fade In (300ms)
    │
    ▼
Display (3 seconds)
    │
    ▼
Fade Out (300ms)
    │
    ▼
Reset Form
```

### Success UI Components

| Element | Purpose | Styling |
|---------|---------|---------|
| Icon | Visual confirmation | Green checkmark |
| Heading | Primary message | Bold, large |
| Subtext | Additional info | Smaller, gray |
| Container | Wrapper | Centered, padded |

### Success Message Examples

```
Standard:
✓ Thanks for subscribing!
  We'll send you updates about new products and offers.

With Name:
✓ Thanks, Nimal!
  Check your inbox for a confirmation email.

Incentive:
✓ Success! Enjoy 10% off your first order.
  Use code: WELCOME10
```

### Form State Management

| State | Form Display | Success Display |
|-------|--------------|-----------------|
| Idle | Visible | Hidden |
| Loading | Disabled | Hidden |
| Success | Hidden | Visible (3s) |
| After Success | Visible (Reset) | Hidden |

### Analytics Events

| Event | Properties | Purpose |
|-------|------------|---------|
| newsletter_subscribe | source, email_domain | Track subscriptions |
| newsletter_success | duration, variant | Measure UX |

### Expected Outcome
- Animated success feedback display
- Auto-dismiss after appropriate duration
- Form reset for new subscriptions
- Analytics tracking implemented
- Positive user experience

### Verification Checklist
- [ ] Success message component created
- [ ] Success icon displayed
- [ ] Confirmation message shows
- [ ] Animation implemented
- [ ] Auto-dismiss working (3-5 seconds)
- [ ] Form resets after success
- [ ] Analytics tracking added
- [ ] Already-subscribed case handled
- [ ] Success state integrated with form

---

## Task 89: Create Footer Newsletter

### Overview
Implement newsletter subscription section in the webstore footer. This provides a prominent, always-visible subscription opportunity that integrates the NewsletterForm component with appropriate styling, messaging, and layout for the footer context.

### Dependencies
- Task 86: Create NewsletterForm Component
- Task 88: Create Newsletter Success
- Footer component structure established

### Instructions

1. **Locate footer component**
   - Navigate to webstore footer component
   - Identify newsletter section placement
   - Plan integration approach

2. **Create footer newsletter section**
   - Add newsletter section to footer layout
   - Position prominently (top or center of footer)
   - Allocate appropriate space

3. **Add newsletter heading**
   - Create compelling heading text
   - Example: "Stay Updated"
   - Add supporting subheading
   - Example: "Subscribe for exclusive offers and updates"

4. **Integrate NewsletterForm component**
   - Use inline variant for horizontal layout
   - Pass "footer" as source prop
   - Configure appropriate button text
   - Set placeholder text

5. **Style newsletter section**
   - Match footer color scheme
   - Ensure sufficient contrast
   - Add padding/spacing
   - Use responsive design

6. **Add decorative elements (optional)**
   - Newsletter icon or envelope graphic
   - Subtle background color difference
   - Border or divider lines
   - Keep design clean

7. **Implement responsive layout**
   - Inline on desktop (email + button horizontal)
   - Stack on mobile (email above button)
   - Adjust spacing for different screen sizes

8. **Add privacy assurance text**
   - Small text: "We respect your privacy"
   - Link to privacy policy
   - Build trust with subscribers

### Footer Newsletter Layout

**Desktop**
```
┌─────────────────────────────────────────────┐
│              STAY UPDATED                   │
│  Subscribe for exclusive offers & updates   │
│                                             │
│  [    Your email address    ] [Subscribe]  │
│                                             │
│  We respect your privacy                    │
└─────────────────────────────────────────────┘
```

**Mobile**
```
┌──────────────────────────┐
│     STAY UPDATED         │
│  Subscribe for offers    │
│                          │
│  [ Your email address ]  │
│  [   Subscribe Now   ]   │
│                          │
│  We respect privacy      │
└──────────────────────────┘
```

### Section Content

| Element | Content | Purpose |
|---------|---------|---------|
| Heading | "Stay Updated" | Attention grabber |
| Subheading | "Get exclusive offers..." | Value proposition |
| Form | NewsletterForm (inline) | Subscription input |
| Privacy | "We respect your privacy" | Trust building |

### Styling Specifications

| Property | Desktop | Mobile |
|----------|---------|--------|
| Layout | Horizontal form | Stacked form |
| Width | max-w-md | Full width (with padding) |
| Spacing | mb-8 | mb-6 |
| Alignment | Center | Center |

### Footer Integration Points

| Location | Priority | Visibility |
|----------|----------|------------|
| Top of Footer | High | Prominent |
| Center Column | Medium | Balanced |
| Right Column | Medium | Sidebar-like |

### Value Propositions

| Message | Target Audience |
|---------|-----------------|
| "Exclusive offers and updates" | Discount seekers |
| "New arrival alerts" | Fashion enthusiasts |
| "Weekly tips and trends" | Information seekers |
| "Be the first to know" | Early adopters |

### Sri Lanka Context

| Element | Localization |
|---------|--------------|
| Language | English (or Sinhala/Tamil) |
| Incentives | LKR discounts |
| Privacy | GDPR/local law compliant |

### Expected Outcome
- Newsletter section integrated in footer
- Inline form layout on desktop
- Stacked form on mobile
- Compelling value proposition
- Privacy assurance included
- Matches footer design aesthetics

### Verification Checklist
- [ ] Newsletter section added to footer
- [ ] Heading and subheading added
- [ ] NewsletterForm component integrated
- [ ] Source prop set to "footer"
- [ ] Inline variant used
- [ ] Responsive layout working
- [ ] Privacy text and link added
- [ ] Styling matches footer theme
- [ ] Success message displays correctly
- [ ] Section visible on all pages

---

## Task 90: Create Popup Newsletter

### Overview
Implement a modal popup newsletter subscription form that appears based on user behavior triggers (exit intent, time on site, scroll depth). This provides an additional touchpoint for newsletter subscriptions with a more prominent, focused presentation.

### Dependencies
- Task 86: Create NewsletterForm Component
- Task 88: Create Newsletter Success
- Modal/Dialog component library

### Instructions

1. **Create popup newsletter component**
   - Create `PopupNewsletter.tsx` in newsletter directory
   - Implement modal/dialog structure
   - Include NewsletterForm component

2. **Design popup layout**
   - Create modal overlay (semi-transparent background)
   - Center modal content on screen
   - Add close button (X icon)
   - Include dismiss on outside click

3. **Add incentive messaging**
   - Create compelling headline
   - Example: "Get 10% Off Your First Order!"
   - Add supporting text about benefits
   - Highlight exclusive offers

4. **Integrate NewsletterForm**
   - Use stacked variant for better mobile UX
   - Pass "popup" as source prop
   - Configure button text (e.g., "Get My Discount")
   - Set appropriate placeholder

5. **Implement trigger mechanisms**
   - Exit intent: mouse moves toward browser close
   - Time-based: after 30-60 seconds on site
   - Scroll-based: after 50% page scroll
   - Choose one or combine triggers

6. **Add frequency control**
   - Store popup display in localStorage/cookies
   - Don't show more than once per session
   - Option: once per 7 days
   - Respect user dismissals

7. **Implement animation**
   - Fade in overlay
   - Slide in or scale modal
   - Smooth transitions (300-400ms)
   - Use Framer Motion or CSS animations

8. **Add close functionality**
   - Close button (X icon) in top-right
   - Click outside modal to dismiss
   - ESC key to close
   - Track dismissals in analytics

9. **Handle success state**
   - Show success message in popup
   - Auto-close after 3 seconds
   - Mark as subscribed to prevent reshowing

10. **Add GDPR compliance**
    - Privacy policy link
    - Consent checkbox if required
    - Clear unsubscribe information

### Popup Trigger Options

| Trigger | When | Use Case |
|---------|------|----------|
| Exit Intent | Mouse near browser top | Capture leaving users |
| Time Delay | 30-60 seconds | Engaged visitors |
| Scroll Depth | 50% page scroll | Interested readers |
| Scroll to Bottom | End of page | Content consumers |
| Manual | User clicks "Subscribe" | Intentional action |

### Popup Layout

```
┌──────────────────────────────────────┐
│  ╔════════════════════════════════╗  │
│  ║  Get 10% Off First Order!  [X] ║  │
│  ║                                ║  │
│  ║  Join our newsletter for       ║  │
│  ║  exclusive deals & updates     ║  │
│  ║                                ║  │
│  ║  [ Enter your email...      ]  ║  │
│  ║  [ Get My Discount         ]  ║  │
│  ║                                ║  │
│  ║  [Privacy Policy]              ║  │
│  ╚════════════════════════════════╝  │
└──────────────────────────────────────┘
```

### Popup Content Elements

| Element | Content | Purpose |
|---------|---------|---------|
| Headline | "Get 10% Off!" | Grab attention |
| Subheadline | Benefits description | Explain value |
| Form | NewsletterForm (stacked) | Capture email |
| Close Button | X icon | Allow dismissal |
| Privacy Link | Policy link | Build trust |

### Frequency Control

| Strategy | Storage | Duration |
|----------|---------|----------|
| Session | sessionStorage | Until browser close |
| Weekly | localStorage | 7 days |
| Once Subscribed | localStorage | Permanent |
| Per Dismissal | Count dismissals | After 3x, stop |

### Animation Sequence

```
Trigger Event
    │
    ▼
Check Frequency Control
    │
    ├─→ Recently shown → Cancel
    │
    └─→ Can show
          │
          ▼
      Fade in overlay (200ms)
          │
          ▼
      Scale in modal (300ms)
          │
          ▼
      Display popup
          │
          ├─→ User subscribes → Success → Close
          ├─→ User closes → Track dismissal
          └─→ Click outside → Track dismissal
```

### Close Interactions

| Action | Effect | Analytics |
|--------|--------|-----------|
| X button | Close popup | Track "close_button" |
| Outside click | Close popup | Track "outside_click" |
| ESC key | Close popup | Track "esc_key" |
| Subscribe | Show success, close | Track "subscribed" |

### Incentive Ideas

| Offer | Sri Lanka Context |
|-------|-------------------|
| 10% off first order | ₨ discount on purchase |
| Free shipping | Applicable for LK addresses |
| Early access | New product launches |
| Exclusive deals | Special LKR pricing |

### Expected Outcome
- Modal popup newsletter form implemented
- Trigger mechanism working (exit intent or timer)
- Frequency control preventing spam
- Compelling incentive messaging
- Smooth animations and transitions
- GDPR compliant with privacy link

### Verification Checklist
- [ ] `PopupNewsletter.tsx` component created
- [ ] Modal overlay and content styled
- [ ] Close button functional
- [ ] NewsletterForm integrated (stacked variant)
- [ ] Source prop set to "popup"
- [ ] Trigger mechanism implemented
- [ ] Frequency control working (localStorage)
- [ ] Animation smooth and professional
- [ ] Outside click closes modal
- [ ] ESC key closes modal
- [ ] Success state handled correctly
- [ ] Privacy policy link included
- [ ] Responsive on mobile and desktop
- [ ] Analytics tracking dismissals

---

## Summary

This document established the newsletter subscription feature for the webstore, including type definitions, API integration, React hooks for state management, a flexible form component with validation, success feedback, and two placement implementations (footer and popup). These elements provide comprehensive newsletter capture capabilities.

### Completed Tasks
1. ✓ Created newsletter TypeScript types for type safety
2. ✓ Created newsletter API client for backend communication
3. ✓ Created useSubscribe mutation hook for state management
4. ✓ Created NewsletterForm component with inline and stacked variants
5. ✓ Created email validation with real-time feedback
6. ✓ Created success message display with auto-dismiss
7. ✓ Created footer newsletter section with inline form
8. ✓ Created popup newsletter with exit intent and frequency control

### Key Deliverables
- Newsletter type definitions with subscription, response, and preferences
- API client with error handling and timeout configuration
- Custom React hook for subscription mutations
- Reusable NewsletterForm component supporting multiple layouts
- Robust email validation with user-friendly messages
- Animated success feedback with auto-dismiss
- Footer integration with responsive design
- Modal popup with behavioral triggers and frequency control

### Next Steps
Proceed to [02_Tasks-91-96_Social-Share-Verify.md](02_Tasks-91-96_Social-Share-Verify.md) to implement social sharing functionality and verify all marketing features.
