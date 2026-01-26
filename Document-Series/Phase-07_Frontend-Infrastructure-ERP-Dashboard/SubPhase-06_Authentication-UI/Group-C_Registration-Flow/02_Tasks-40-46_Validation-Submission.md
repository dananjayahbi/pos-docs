# Tasks 40-46: Validation and Submission

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** C - Registration Flow  
> **Document:** 02 of 02  
> **Tasks Covered:** 40, 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-39_Form-Steps-Navigation.md](01_Tasks-31-39_Form-Steps-Navigation.md)

---

## Document Overview

This document covers the final enhancements to the registration form including password strength indication, terms acceptance validation, complete registration submission logic, success and error handling with appropriate user feedback, navigation links to the login page, and comprehensive testing of the entire registration flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 40 | Add Password Strength Indicator | Low | 25 min |
| 41 | Add Terms Acceptance Checkbox | Low | 20 min |
| 42 | Implement Registration Submission | Medium | 40 min |
| 43 | Handle Registration Success | Low | 20 min |
| 44 | Handle Registration Errors | Medium | 30 min |
| 45 | Add Login Link | Low | 10 min |
| 46 | Test Registration Flow | Low | 30 min |

---

## Task 40: Add Password Strength Indicator

### Overview
Create a visual password strength indicator component that provides real-time feedback on password quality as users type in the password field during Step 2 (Admin User). The indicator displays strength levels (Weak, Fair, Good, Strong) with color-coded visual feedback and lists which requirements are met.

### Dependencies
- Task 35: Create Step 2: Admin User

### Instructions

1. **Create PasswordStrength component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `PasswordStrength.tsx` file
   - This component will be reusable for password fields

2. **Import required dependencies**
   - Import React
   - Import cn utility for conditional styling
   - Import Check and X icons for requirement indicators
   - Import Progress component from Shadcn/UI (optional)

3. **Define component props interface**
   - Accept password prop (string)
   - Accept optional className prop
   - Accept optional showRequirements prop (boolean)

4. **Create password strength calculation function**
   - Analyze password for various criteria
   - Calculate strength score (0-100)
   - Determine strength level (Weak, Fair, Good, Strong)

5. **Define strength criteria**
   - Length: minimum 8 characters
   - Has uppercase letter
   - Has lowercase letter
   - Has number
   - Has special character (optional for basic strength)

6. **Calculate strength score**
   - Base score: 0
   - Length ≥ 8: +25 points
   - Uppercase present: +20 points
   - Lowercase present: +20 points
   - Number present: +20 points
   - Special character: +15 points
   - Total possible: 100 points

7. **Determine strength level from score**
   - 0-25: Weak (red)
   - 26-50: Fair (orange)
   - 51-75: Good (yellow)
   - 76-100: Strong (green)

8. **Create visual strength indicator**
   - Display strength level text
   - Show color-coded progress bar or segments
   - Use appropriate colors for each level

9. **Create requirements checklist**
   - List all password requirements
   - Show checkmark for met requirements
   - Show X or gray state for unmet requirements
   - Update in real-time as user types

10. **Add component styling**
    - Use Tailwind classes for colors
    - Ensure good contrast for readability
    - Make responsive if needed

11. **Integrate into AdminUserStep**
    - Import PasswordStrength component
    - Place below password input field
    - Pass current password value as prop
    - Show only when password field has value

### Component Structure

```
PasswordStrength
├── Strength Indicator Bar
│   ├── Strength Label (Weak/Fair/Good/Strong)
│   └── Visual Bar (color-coded)
│
└── Requirements Checklist
    ├── ✓/✗ At least 8 characters
    ├── ✓/✗ One uppercase letter
    ├── ✓/✗ One lowercase letter
    ├── ✓/✗ One number
    └── ✓/✗ One special character (optional)
```

### Strength Levels

| Level | Score Range | Color | Label | Description |
|-------|-------------|-------|-------|-------------|
| Weak | 0-25 | Red (#EF4444) | Weak | Insufficient security |
| Fair | 26-50 | Orange (#F97316) | Fair | Basic security |
| Good | 51-75 | Yellow (#EAB308) | Good | Adequate security |
| Strong | 76-100 | Green (#22C55E) | Strong | Excellent security |

### Strength Calculation

```
Strength Score Calculation:
├── Length ≥ 8 chars: +25 points
├── Contains uppercase (A-Z): +20 points
├── Contains lowercase (a-z): +20 points
├── Contains number (0-9): +20 points
└── Contains special (!@#$%^&*): +15 points

Total: 100 points maximum

Examples:
├── "pass" → 20 points (lowercase only) → Weak
├── "password" → 45 points (8+ chars, lowercase) → Fair
├── "Password1" → 85 points (8+ chars, upper, lower, number) → Strong
└── "P@ssw0rd!" → 100 points (all criteria) → Strong
```

### Requirements Checklist

| Requirement | Regex/Logic | Points | Priority |
|-------------|-------------|--------|----------|
| At least 8 characters | `password.length >= 8` | 25 | Required |
| One uppercase letter | `/[A-Z]/.test(password)` | 20 | Required |
| One lowercase letter | `/[a-z]/.test(password)` | 20 | Required |
| One number | `/[0-9]/.test(password)` | 20 | Required |
| One special character | `/[!@#$%^&*]/.test(password)` | 15 | Optional |

### Visual Representation

#### Strength Bar - Segments

```
Weak (0-25):
[████░░░░░░░░] Weak

Fair (26-50):
[████████░░░░] Fair

Good (51-75):
[████████████] Good

Strong (76-100):
[████████████] Strong
```

#### Strength Bar - Progress

```
Weak:
Weak                            [▓▓▓░░░░░░░░░]

Fair:
Fair                            [▓▓▓▓▓▓░░░░░░]

Good:
Good                            [▓▓▓▓▓▓▓▓▓░░░]

Strong:
Strong                          [▓▓▓▓▓▓▓▓▓▓▓▓]
```

### Requirements Display

```
Password must contain:
✓ At least 8 characters
✓ One uppercase letter
✗ One lowercase letter
✓ One number
✗ One special character
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| password | string | Yes | - | Current password value |
| showRequirements | boolean | No | true | Show requirements list |
| className | string | No | "" | Additional CSS classes |

### Strength Indicator Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-2` | Vertical spacing |
| Strength label (Weak) | `text-red-600 font-medium` | Red emphasis |
| Strength label (Fair) | `text-orange-600 font-medium` | Orange emphasis |
| Strength label (Good) | `text-yellow-600 font-medium` | Yellow emphasis |
| Strength label (Strong) | `text-green-600 font-medium` | Green emphasis |
| Progress bar bg | `bg-gray-200 h-2 rounded` | Bar background |
| Progress fill (Weak) | `bg-red-600` | Red fill |
| Progress fill (Fair) | `bg-orange-600` | Orange fill |
| Progress fill (Good) | `bg-yellow-600` | Yellow fill |
| Progress fill (Strong) | `bg-green-600` | Green fill |

### Requirements Checklist Styling

| Element | State | Icon | Color |
|---------|-------|------|-------|
| Requirement met | ✓ | Check | Green (#22C55E) |
| Requirement not met | ✗ | X or empty | Gray (#9CA3AF) |
| Text (met) | - | - | Gray-700 |
| Text (not met) | - | - | Gray-400 |

### Integration Example

```
AdminUserStep Layout:

Password *
[password input field                    ] [👁]
┌────────────────────────────────────────┐
│ Strong              [▓▓▓▓▓▓▓▓▓▓▓▓]     │
│                                        │
│ Password must contain:                 │
│ ✓ At least 8 characters                │
│ ✓ One uppercase letter                 │
│ ✓ One lowercase letter                 │
│ ✓ One number                           │
│ ✓ One special character                │
└────────────────────────────────────────┘
```

### Real-Time Update Behavior

| User Action | Component Behavior |
|-------------|-------------------|
| Types 1st character | Shows "Weak", no requirements met |
| Types 8 characters | "Length" requirement checked |
| Adds uppercase | "Uppercase" requirement checked, strength increases |
| Adds number | "Number" requirement checked, strength increases |
| All met | Shows "Strong" with all checks |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Color blind friendly | Use icons + text, not just color |
| Screen readers | aria-label with strength description |
| Contrast | Ensure text readable on all backgrounds |
| Live region | aria-live="polite" for strength updates |

### Expected Outcome
- Functional password strength indicator component
- Real-time strength calculation as user types
- Visual strength bar with color coding
- Requirements checklist with met/unmet states
- Integrated into Step 2 password field
- Helps users create stronger passwords

### Verification Checklist
- [ ] `frontend/components/auth/PasswordStrength.tsx` file created
- [ ] Component accepts password prop
- [ ] Strength calculation function implemented
- [ ] Four strength levels defined (Weak, Fair, Good, Strong)
- [ ] Scoring logic based on criteria
- [ ] Visual strength bar/indicator created
- [ ] Requirements checklist implemented
- [ ] Checkmarks/X marks for requirements
- [ ] Color-coded by strength level
- [ ] Real-time updates as user types
- [ ] Component integrated into AdminUserStep
- [ ] Positioned below password field
- [ ] Accessible with aria attributes
- [ ] Component properly exports

---

## Task 41: Add Terms Acceptance Checkbox

### Overview
Add a terms and conditions acceptance checkbox to the registration form in Step 3 (Contact Info) or Step 4 (Plan Selection). This checkbox is required for form submission and includes links to the Terms of Service and Privacy Policy pages. Users must explicitly accept the terms before creating their account.

### Dependencies
- Task 36: Create Step 3: Contact Info

### Instructions

1. **Decide checkbox placement**
   - Consider Step 3 (after contact info) or Step 4 (before submit)
   - Step 4 is recommended (just before plan selection or after)
   - Ensures users see terms before final commitment

2. **Add terms field to validation schema**
   - Open `frontend/lib/validations/register.ts`
   - Add `acceptTerms` field to appropriate step schema
   - Set as required boolean field
   - Add custom error message

3. **Update form default values**
   - Open `frontend/components/auth/RegisterForm.tsx`
   - Add `acceptTerms: false` to default values
   - Ensure field is tracked by form state

4. **Add checkbox to chosen step component**
   - Open ContactInfoStep or PlanSelectionStep component
   - Import Checkbox component from Shadcn/UI
   - Import FormField, FormControl components

5. **Create terms acceptance field**
   - Use FormField with name "acceptTerms"
   - Add Checkbox component
   - Include label with terms links
   - Show validation error if not checked

6. **Create terms label text with links**
   - Text: "I agree to the"
   - Link: "Terms of Service"
   - Text: "and"
   - Link: "Privacy Policy"
   - Ensure links open in new tab (target="_blank")

7. **Style checkbox and label**
   - Position checkbox and label inline
   - Ensure proper spacing
   - Make label text clickable (toggles checkbox)
   - Style links with brand color

8. **Configure link URLs**
   - Terms link: "/terms" or "/legal/terms"
   - Privacy link: "/privacy" or "/legal/privacy"
   - Use Next.js Link component
   - Add rel="noopener noreferrer" for external links

9. **Add validation logic**
   - Checkbox must be checked to submit
   - Show error message if unchecked on submit
   - Disable submit button if not checked (optional)

10. **Add accessibility features**
    - Ensure checkbox is keyboard accessible
    - Add proper label association
    - Include aria-required="true"
    - Error message with aria-describedby

### Checkbox Structure

```
Terms Acceptance Section
├── Checkbox Input
│   ├── Input: Checkbox (checked/unchecked)
│   └── FormControl wrapper
│
├── Label Text and Links
│   ├── Text: "I agree to the"
│   ├── Link: "Terms of Service" → /terms
│   ├── Text: "and"
│   └── Link: "Privacy Policy" → /privacy
│
└── Error Message (if not checked)
    └── Text: "You must accept the terms to continue"
```

### Checkbox Placement Options

#### Option A: End of Step 3 (Contact Info)
```
ContactInfoStep:
├── Phone Number
├── Address Section
├── Timezone
└── [✓] Terms Acceptance
```

#### Option B: Beginning of Step 4 (Plan Selection)
```
PlanSelectionStep:
├── [✓] Terms Acceptance
└── Plan Cards
```

#### Option C: End of Step 4 (Recommended)
```
PlanSelectionStep:
├── Plan Cards
└── [✓] Terms Acceptance
```

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Name | acceptTerms | Form field identifier |
| Type | Boolean checkbox | Binary choice |
| Required | Yes | Must be checked |
| Default | false | User must actively check |
| Error message | "You must accept the terms to continue" | Clear requirement |

### Terms Label Layout

```
Visual Layout:
[✓] I agree to the Terms of Service and Privacy Policy
     └──────────────┘          └──────────────┘
         Link (blue)              Link (blue)
```

### Links Specifications

| Link | Text | URL | Target |
|------|------|-----|--------|
| Terms | "Terms of Service" | /terms | _blank |
| Privacy | "Privacy Policy" | /privacy | _blank |

### Validation Schema Addition

```
Add to contactInfoSchema or planSelectionSchema:

acceptTerms: z.boolean()
  .refine((val) => val === true, {
    message: "You must accept the terms to continue"
  })
```

Or using Zod literal:

```
acceptTerms: z.literal(true, {
  errorMap: () => ({
    message: "You must accept the terms to continue"
  })
})
```

### Checkbox Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-start space-x-2` | Layout |
| Checkbox | `mt-1` | Align with text top |
| Label | `text-sm text-gray-700` | Readable size |
| Link | `text-blue-600 hover:underline` | Brand styling |
| Link | `font-medium` | Emphasis |
| Error | `text-sm text-red-600 mt-1` | Error styling |

### Complete Component Example

```
Form Layout:

[Previous step content]

┌────────────────────────────────────────┐
│ [✓] I agree to the Terms of Service   │
│     and Privacy Policy                 │
└────────────────────────────────────────┘
     └────────────┘     └──────────────┘
       Link (blue)        Link (blue)

[Navigation buttons]
```

### Link Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| target | "_blank" | Open in new tab |
| rel | "noopener noreferrer" | Security |
| className | "text-blue-600 hover:underline font-medium" | Styling |

### Form Submission Logic

```
On Submit:
├── Check if acceptTerms === true
│   ├── If true: Proceed with submission
│   └── If false: Show error, prevent submission
└── Validation error message appears below checkbox
```

### Error States

| State | Display | Behavior |
|-------|---------|----------|
| Not checked on submit | Red error text below | Submit blocked |
| User checks box | Error clears | Submit enabled |
| User unchecks | Error returns on next submit | Submit blocked |

### Accessibility Attributes

| Element | Attribute | Value |
|---------|-----------|-------|
| Checkbox | aria-required | "true" |
| Checkbox | aria-describedby | Error message ID (if error) |
| Label | htmlFor | Checkbox ID |
| Links | aria-label | "Opens in new tab" |

### Legal Page Stubs (Optional)

If terms/privacy pages don't exist yet:

| Page | Path | Content |
|------|------|---------|
| Terms | /terms | Terms of Service placeholder |
| Privacy | /privacy | Privacy Policy placeholder |

### Expected Outcome
- Required terms acceptance checkbox added to registration
- Checkbox with clear label and links
- Links to Terms and Privacy pages (opens in new tab)
- Validation prevents submission if not checked
- Clear error message if unchecked
- Accessible via keyboard and screen readers

### Verification Checklist
- [ ] acceptTerms field added to validation schema
- [ ] acceptTerms added to form default values (false)
- [ ] Checkbox component added to appropriate step
- [ ] Checkbox uses FormField with name "acceptTerms"
- [ ] Label text includes terms language
- [ ] "Terms of Service" link added
- [ ] "Privacy Policy" link added
- [ ] Links open in new tab (target="_blank")
- [ ] Links have security attributes (rel="noopener noreferrer")
- [ ] Checkbox required for form submission
- [ ] Error message displays if unchecked
- [ ] Error message clears when checked
- [ ] Checkbox is keyboard accessible
- [ ] Label is clickable (toggles checkbox)
- [ ] Proper styling applied

---

## Task 42: Implement Registration Submission

### Overview
Implement the complete registration submission logic that collects data from all four steps, formats the payload according to API specifications, sends the registration request to the backend authentication service, and manages the submission state including loading indicators and error handling preparation.

### Dependencies
- Task 41: Add Terms Acceptance Checkbox

### Instructions

1. **Import authentication service**
   - Open `frontend/components/auth/RegisterForm.tsx`
   - Import authService from lib/services/auth
   - Ensure service module exists (SubPhase-05)
   - Import necessary types (RegisterRequest, RegisterResponse)

2. **Review API registration endpoint specification**
   - Endpoint: POST /api/auth/register
   - Expected payload format
   - Response structure
   - Error response format

3. **Implement onSubmit handler**
   - Locate or create onSubmit function in RegisterForm
   - Mark function as async
   - Accept validated form data parameter (RegisterFormData)

4. **Add submission state management**
   - Use useState for isSubmitting boolean
   - Set to true at submission start
   - Set to false after completion/error
   - Use to disable buttons and show loading

5. **Prepare registration payload**
   - Extract data from all form steps
   - Format according to API specification
   - Structure tenant data, admin user data, contact info, plan

6. **Structure payload format**
   - Tenant information (business name, type, registration number)
   - Admin user information (name, email, password)
   - Contact information (phone, address, timezone)
   - Plan selection
   - Terms acceptance timestamp

7. **Make API call**
   - Call authService.register() with payload
   - Wrap in try-catch block for error handling
   - Use await for async operation
   - Handle both success and error responses

8. **Handle loading state**
   - Set isSubmitting to true before API call
   - Disable all form inputs during submission
   - Show loading spinner on submit button
   - Use finally block to ensure state is reset

9. **Prepare for success handling**
   - On successful response, prepare to call Task 43 logic
   - Do not implement redirect yet (Task 43)
   - Store success state for now

10. **Prepare for error handling**
    - On error response, prepare to call Task 44 logic
    - Do not implement error display yet (Task 44)
    - Store error state for now

11. **Add request timeout**
    - Implement timeout mechanism (optional)
    - Show timeout error if request exceeds limit
    - Typical timeout: 60 seconds for registration

12. **Add logging for debugging**
    - Log submission start (development only)
    - Log successful registration (no sensitive data)
    - Log errors for debugging
    - Never log passwords or sensitive information

### Registration Flow

```
User completes Step 4 and clicks "Create Account"
        ↓
Form validates all steps (React Hook Form + Zod)
        ↓
If all valid: onSubmit called with form data
        ↓
Set isSubmitting = true
        ↓
Format registration payload
        ↓
Call authService.register(payload)
        ↓
Wait for API response
        ↓
        ├─ Success → Handle success (Task 43)
        │   ├── Store tokens
        │   ├── Show success message
        │   └── Redirect to verification
        │
        └─ Error → Handle error (Task 44)
            ├── Parse error message
            ├── Display user-friendly error
            └── Re-enable form
        ↓
Set isSubmitting = false (finally block)
```

### API Request Structure

| Section | Fields | Example |
|---------|--------|---------|
| Tenant | businessName, businessType, registrationNumber | "ABC Store", "retail", "BRN123" |
| Admin | firstName, lastName, email, password | "John", "Doe", "john@abc.com", "Pass123!" |
| Contact | phone, address (optional), timezone | "+94 77 123 4567", {...}, "Asia/Colombo" |
| Plan | plan | "professional" |
| Terms | acceptTerms, acceptedAt | true, ISO timestamp |

### Expected Request Payload

```json
{
  "tenant": {
    "name": "ABC Retail Store",
    "businessType": "retail",
    "registrationNumber": "BRN123456789"
  },
  "adminUser": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@abc.com",
    "password": "SecurePass123!"
  },
  "contact": {
    "phone": "+94 77 123 4567",
    "address": {
      "street": "No. 123, Main Street",
      "city": "Colombo",
      "postalCode": "10400"
    },
    "timezone": "Asia/Colombo"
  },
  "subscription": {
    "plan": "professional"
  },
  "terms": {
    "accepted": true,
    "acceptedAt": "2026-01-25T10:30:00Z"
  }
}
```

### Expected Success Response

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "tenantId": "tenant_abc123",
    "userId": "user_xyz789",
    "email": "john@abc.com",
    "verificationRequired": true,
    "verificationEmailSent": true
  }
}
```

### Expected Error Response

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Email already exists",
  "errors": {
    "email": "This email is already registered"
  },
  "statusCode": 400
}
```

### Error Types to Handle

| Error Type | Status Code | Cause | User Message |
|------------|-------------|-------|--------------|
| Validation Error | 400 | Invalid data | Specific field errors |
| Email Exists | 409 | Email already registered | "This email is already registered" |
| Network Error | - | Connection issues | "Unable to connect. Check your internet." |
| Server Error | 500 | Backend problem | "Something went wrong. Please try again." |
| Timeout Error | 408 | Request too slow | "Request timed out. Please try again." |

### Submission State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| isSubmitting | boolean | Track submission in progress |
| submissionError | string \| null | Store error message |
| submissionSuccess | boolean | Track successful submission |

### Form State During Submission

| Element | State | Behavior |
|---------|-------|----------|
| All inputs | Disabled | Cannot edit |
| Previous button | Disabled | Cannot navigate back |
| Submit button | Disabled + spinner | Shows "Creating account..." |
| Form | Not re-submittable | Prevents duplicate submission |

### Payload Preparation Logic

```
Collect from formData:
├── Business Info (Step 1)
│   ├── businessName
│   ├── businessType
│   └── registrationNumber
│
├── Admin User (Step 2)
│   ├── firstName
│   ├── lastName
│   ├── email
│   └── password (never log this!)
│
├── Contact Info (Step 3)
│   ├── phone
│   ├── address (if provided)
│   └── timezone
│
└── Plan & Terms (Step 4)
    ├── plan
    └── acceptTerms

Transform to API format:
└── Nest into tenant, adminUser, contact, subscription, terms objects
```

### Security Considerations

| Practice | Implementation |
|----------|----------------|
| HTTPS Only | Ensure API uses HTTPS |
| No Password Logging | Never log passwords to console |
| Password Transmission | Sent encrypted over HTTPS |
| Token Security | Prepare for secure storage (Task 43) |
| CSRF Protection | Include CSRF token if required |
| Rate Limiting | Handle 429 responses appropriately |

### Logging Best Practices

```
✓ DO Log:
- Submission attempt started
- Submission success (no sensitive data)
- Error type and status code
- Timestamp of events

✗ DO NOT Log:
- Passwords
- Password hashes
- Full payload with sensitive data
- Tokens or secrets
```

### Timeout Implementation (Optional)

```
Timeout Configuration:
├── Create AbortController
├── Set timeout (e.g., 60 seconds)
├── Pass signal to fetch request
├── On timeout: abort request
└── Show timeout error message
```

### Expected Outcome
- Complete registration submission logic implemented
- Data from all steps collected and formatted
- API call to backend registration endpoint
- Loading state properly managed
- Submission state prevents duplicate submissions
- Error and success handling prepared
- No sensitive data logged

### Verification Checklist
- [ ] authService imported and available
- [ ] onSubmit handler implemented and async
- [ ] isSubmitting state created and managed
- [ ] Form data extracted from all four steps
- [ ] Payload formatted according to API spec
- [ ] Tenant object structured correctly
- [ ] Admin user object structured correctly
- [ ] Contact info object structured correctly
- [ ] Plan and terms included in payload
- [ ] Try-catch block wraps API call
- [ ] authService.register() called with payload
- [ ] Finally block resets isSubmitting state
- [ ] Form disabled during submission
- [ ] Submit button shows loading state
- [ ] No passwords logged to console
- [ ] Success response stored for Task 43
- [ ] Error response stored for Task 44

---

## Task 43: Handle Registration Success

### Overview
Implement the success handling logic that executes after a successful registration API response. This includes displaying a success message to the user, informing them about the verification email sent to their inbox, and redirecting them to either the email verification page or the login page to complete the onboarding process.

### Dependencies
- Task 42: Implement Registration Submission

### Instructions

1. **Import toast notification utility**
   - Import toast or notification component
   - Import from toast utility or Shadcn/UI
   - Ensure toast/notification system is configured

2. **Import Next.js router for navigation**
   - Import useRouter from Next.js
   - Initialize router in component
   - Prepare for redirect after success

3. **Create success handler function**
   - Create handleRegistrationSuccess function
   - Accept registration response as parameter
   - Place in RegisterForm component

4. **Display success toast message**
   - Show success notification
   - Message: "Account created successfully!"
   - Include checkmark or success icon
   - Auto-dismiss after a few seconds

5. **Show verification email notice**
   - Display secondary message about email verification
   - Message: "A verification email has been sent to [email]"
   - Explain next steps
   - Make email address prominent

6. **Add brief delay before redirect**
   - Use setTimeout for 2-3 second delay
   - Allows user to read success message
   - Provides better UX than immediate redirect

7. **Determine redirect destination**
   - Option A: Redirect to /verify-email page
   - Option B: Redirect to /login page with message
   - Option C: Keep on page with verification prompt
   - Choose based on verification flow

8. **Implement redirect logic**
   - Use router.push() to navigate
   - Pass email as query parameter if needed
   - Example: /verify-email?email=[email]
   - Clear form state before redirect

9. **Store user email temporarily**
   - Store email in sessionStorage or state
   - Used for verification page if needed
   - Clear after verification complete

10. **Handle edge cases**
    - If no verification required, redirect to dashboard
    - If verification email not sent, show manual send option
    - Handle API response variations

11. **Add analytics event (optional)**
    - Track successful registration
    - Record conversion event
    - Don't track sensitive information

### Success Flow

```
Registration API Success Response Received
        ↓
Call handleRegistrationSuccess(response)
        ↓
Display success toast notification
        ↓
Show verification email message
        ↓
Wait 2-3 seconds (allow user to read message)
        ↓
Store email in sessionStorage (if needed)
        ↓
Redirect to appropriate page:
├─ If verification required → /verify-email
├─ If auto-verified → /login or /dashboard
└─ If error in verification → /login with notice
```

### Success Response Structure

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "tenantId": "tenant_abc123",
    "userId": "user_xyz789",
    "email": "john@abc.com",
    "verificationRequired": true,
    "verificationEmailSent": true,
    "verificationToken": "token_xyz" // Optional
  }
}
```

### Toast Notification Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Type | Success | Indicates positive outcome |
| Title | "Account Created!" | Clear success message |
| Description | "Check your email for verification" | Next step guidance |
| Duration | 5000ms (5 seconds) | Long enough to read |
| Icon | ✓ Checkmark | Visual confirmation |
| Position | Top-right or top-center | Prominent visibility |

### Success Messages

#### Primary Success Message
```
🎉 Account Created Successfully!
```

#### Verification Notice
```
📧 We've sent a verification email to john@abc.com
Please check your inbox and verify your email to get started.
```

#### Alternative Messages
```
If verification not required:
✓ Account created! You can now log in.

If email not sent:
⚠️ Account created, but verification email failed to send.
Please request a new verification email.
```

### Redirect Options

#### Option A: Verify Email Page (Recommended)

| Destination | Purpose | URL |
|-------------|---------|-----|
| /verify-email | Dedicated verification page | /verify-email?email=john@abc.com |

**Page includes:**
- Verification instructions
- Resend email button
- Email not received FAQ
- Login link

#### Option B: Login Page with Message

| Destination | Purpose | URL |
|-------------|---------|-----|
| /login | Login with verification notice | /login?message=verify-email |

**Login page shows:**
- Success banner
- Verification reminder
- Login form (disabled until verified?)

#### Option C: Stay on Page

| Destination | Purpose | Behavior |
|-------------|---------|----------|
| Current page | Show success modal | Display modal with instructions |

**Modal includes:**
- Success message
- Verification instructions
- Go to Login button

### Redirect Implementation

```
Redirect with Email Parameter:
router.push(`/verify-email?email=${encodeURIComponent(email)}`);

Redirect with Message Parameter:
router.push('/login?verified=false&message=check-email');

Conditional Redirect:
if (response.data.verificationRequired) {
  router.push('/verify-email');
} else {
  router.push('/login');
}
```

### SessionStorage Usage

| Key | Value | Purpose |
|-----|-------|---------|
| registrationEmail | User's email | For verification page |
| registrationTimestamp | ISO timestamp | Track registration time |
| verificationPending | true | Indicate verification needed |

### Success Page Content (if creating /verify-email)

```
┌──────────────────────────────────────┐
│                                      │
│         📧 Verify Your Email         │
│                                      │
│  We've sent a verification link to:  │
│     john@abc.com                     │
│                                      │
│  Please check your inbox and click   │
│  the verification link to activate   │
│  your account.                       │
│                                      │
│  [Resend Verification Email]         │
│                                      │
│  Didn't receive the email?           │
│  Check your spam folder              │
│                                      │
│  [Go to Login]                       │
│                                      │
└──────────────────────────────────────┘
```

### Timing Sequence

| Action | Timing | Purpose |
|--------|--------|---------|
| Success response received | 0ms | API completes |
| Toast displays | 0ms | Immediate feedback |
| Form disabled | 0ms | Prevent re-submission |
| User reads message | 2-3 seconds | UX consideration |
| Redirect initiated | 3000ms | Automatic navigation |

### Edge Cases to Handle

| Scenario | Handling |
|----------|----------|
| Verification not required | Skip verification, redirect to login |
| Email send failed | Show error, offer manual resend |
| Already verified email | Show notice, redirect to login |
| Network error during verification | Show error, offer retry |
| User closes tab before redirect | Store state in sessionStorage |

### Analytics Events (Optional)

| Event | Data | Purpose |
|-------|------|---------|
| registration_complete | plan, businessType | Track conversions |
| verification_email_sent | success/failure | Monitor email delivery |
| registration_success | timestamp | Funnel analysis |

**Never track:**
- Passwords
- Email content
- Personal identifying details beyond email

### Expected Outcome
- Success message displayed to user
- Clear verification instructions provided
- Automatic redirect to appropriate page
- User email stored for verification page
- Smooth transition from registration to verification
- Professional, polished success experience

### Verification Checklist
- [ ] Success handler function created
- [ ] Toast notification utility imported
- [ ] Success toast displays on registration success
- [ ] Verification email message shown
- [ ] User email displayed in message
- [ ] Next steps clearly communicated
- [ ] Redirect destination determined
- [ ] Router.push() implemented for redirect
- [ ] Delay added before redirect (2-3 seconds)
- [ ] Email stored in sessionStorage (if needed)
- [ ] Form disabled after success
- [ ] Edge cases handled (no verification required, etc.)
- [ ] Success message is clear and encouraging
- [ ] Redirect works correctly

---

## Task 44: Handle Registration Errors

### Overview
Implement comprehensive error handling for the registration process. This includes catching and parsing various error types from the API, displaying user-friendly error messages with specific field-level validation errors, providing actionable guidance for resolution, and ensuring the form remains functional for retry attempts.

### Dependencies
- Task 42: Implement Registration Submission

### Instructions

1. **Import toast notification utility**
   - Import toast or notification component
   - Use for displaying error messages
   - Ensure error styling is available

2. **Create error handler function**
   - Create handleRegistrationError function
   - Accept error object as parameter
   - Place in RegisterForm component or separate utility

3. **Parse error response structure**
   - Handle different error formats from API
   - Extract error message and field-specific errors
   - Distinguish between validation, conflict, and server errors

4. **Map API errors to form fields**
   - Match API error keys to form field names
   - Set field-level errors using React Hook Form
   - Use setError function from form methods

5. **Display general error toast**
   - Show error notification for major issues
   - Message based on error type
   - Auto-dismiss or require user action

6. **Handle validation errors (400)**
   - Parse field-specific errors
   - Set errors on corresponding form fields
   - Show errors below respective inputs
   - Keep user on current step for correction

7. **Handle email exists error (409)**
   - Display specific message: "Email already registered"
   - Add "Try logging in" link
   - Offer password reset option
   - Set error on email field in Step 2

8. **Handle network errors**
   - Detect network connectivity issues
   - Display: "Connection error. Check your internet."
   - Offer retry button
   - Don't navigate away from form

9. **Handle server errors (500)**
   - Display: "Server error. Please try again later."
   - Log error for debugging
   - Offer retry option
   - Consider fallback contact information

10. **Re-enable form for retry**
    - Set isSubmitting to false
    - Enable all form fields
    - Enable submit button
    - Clear any loading states

11. **Add retry mechanism**
    - Keep form data intact after error
    - Allow user to fix errors and resubmit
    - Don't clear form on error

12. **Navigate to appropriate step for field errors**
    - If error in Step 1 fields, navigate to Step 1
    - If error in Step 2 fields, navigate to Step 2
    - Helps user quickly fix the issue

### Error Handling Flow

```
Registration API Error Response Received
        ↓
Call handleRegistrationError(error)
        ↓
Determine error type:
├─ Validation Error (400)
│   ├── Parse field errors
│   ├── Set form field errors
│   ├── Navigate to step with errors
│   └── Show toast with summary
│
├─ Email Exists (409)
│   ├── Show "Email already registered" message
│   ├── Set error on email field
│   ├── Navigate to Step 2
│   └── Suggest login or password reset
│
├─ Network Error
│   ├── Show connection error message
│   └── Offer retry button
│
└─ Server Error (500)
    ├── Show generic error message
    ├── Log error details
    └── Suggest trying again later
        ↓
Re-enable form (set isSubmitting = false)
        ↓
Allow user to correct and retry
```

### Error Response Structures

#### Validation Error (400)

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": {
    "businessName": "Business name is required",
    "email": "Email format is invalid",
    "phone": "Phone number must be in Sri Lankan format"
  },
  "statusCode": 400
}
```

#### Email Exists Error (409)

```json
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "Email already registered",
  "field": "email",
  "statusCode": 409
}
```

#### Server Error (500)

```json
{
  "success": false,
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

### Error Types and Messages

| Error Type | Status Code | User-Friendly Message | Action |
|------------|-------------|----------------------|--------|
| Validation Error | 400 | "Please check the highlighted fields" | Show field errors |
| Email Exists | 409 | "This email is already registered" | Link to login |
| Network Error | - | "Unable to connect. Check your internet." | Retry button |
| Server Error | 500 | "Something went wrong. Please try again." | Retry button |
| Timeout | 408 | "Request timed out. Please try again." | Retry button |
| Rate Limit | 429 | "Too many attempts. Please wait and try again." | Wait message |

### Field Error Mapping

| API Field Key | Form Field Name | Form Step | Example Error |
|---------------|-----------------|-----------|---------------|
| businessName | businessName | 1 | "Business name is required" |
| businessType | businessType | 1 | "Please select a business type" |
| email | email | 2 | "Email already exists" |
| password | password | 2 | "Password too weak" |
| phone | phone | 3 | "Invalid phone format" |
| plan | plan | 4 | "Please select a plan" |

### Toast Error Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Type | Error | Indicates problem |
| Title | Error-specific | Clear problem statement |
| Description | Actionable guidance | How to resolve |
| Duration | 8000ms (8 seconds) | Longer for reading |
| Icon | ✗ X-mark or ⚠️ Warning | Visual indicator |
| Position | Top-right or top-center | Prominent visibility |
| Dismissible | Yes | User can close |

### Error Toast Messages

#### Validation Error Toast
```
❌ Registration Error
Please check the highlighted fields and try again.
```

#### Email Exists Toast
```
⚠️ Email Already Registered
This email is already in use. Try logging in instead.
[Go to Login]
```

#### Network Error Toast
```
🌐 Connection Error
Unable to connect to the server. Check your internet connection and try again.
[Retry]
```

#### Server Error Toast
```
❌ Server Error
Something went wrong on our end. Please try again in a few moments.
[Retry]
```

### Setting Form Field Errors

```typescript
Using React Hook Form setError:

// Single field error
setError('email', {
  type: 'manual',
  message: 'This email is already registered'
});

// Multiple field errors
Object.keys(errors).forEach((field) => {
  setError(field, {
    type: 'manual',
    message: errors[field]
  });
});
```

### Step Navigation Logic

```
Navigate to step with first error:

If errors in Step 1 fields:
  → setCurrentStep(1)
Else if errors in Step 2 fields:
  → setCurrentStep(2)
Else if errors in Step 3 fields:
  → setCurrentStep(3)
Else if errors in Step 4 fields:
  → setCurrentStep(4)
```

### Error Display Examples

#### Field-Level Error
```
Email Address *
[john@example.com                         ]
❌ This email is already registered
   Try logging in or use a different email
```

#### Form-Level Error Toast
```
┌────────────────────────────────────┐
│ ❌ Registration Failed             │
│                                    │
│ Please check the highlighted       │
│ fields and try again.              │
│                                    │
│               [Dismiss]            │
└────────────────────────────────────┘
```

### Retry Button Implementation

```
Add retry button in error toast or modal:

[Retry Registration]
- onClick: Re-submit form with current data
- Clears previous errors
- Re-enables submit button
- Initiates new API call
```

### Email Exists Special Handling

```
┌────────────────────────────────────┐
│ ⚠️ Email Already Registered        │
│                                    │
│ It looks like you already have an  │
│ account with this email.           │
│                                    │
│ [Go to Login]  [Forgot Password?]  │
└────────────────────────────────────┘
```

### Error Recovery Steps

| User Action | System Response |
|-------------|-----------------|
| Fixes validation errors | Errors clear as fields become valid |
| Changes email (if exists error) | Can retry submission |
| Clicks retry after network error | Re-attempts API call |
| Waits after rate limit | Allows retry after cooldown |
| Refreshes page | Form data lost (consider localStorage) |

### Error Logging (Development)

```
✓ DO Log:
- Error type and status code
- API endpoint and method
- Timestamp
- General error message
- Field names with errors (not values)

✗ DO NOT Log:
- User passwords
- Full form payload
- Sensitive personal information
- API tokens or keys
```

### Accessibility for Errors

| Feature | Implementation |
|---------|----------------|
| Screen reader announcement | aria-live="assertive" for errors |
| Focus management | Focus first error field |
| Error summary | Announce error count |
| Color contrast | Red errors meet WCAG AA standards |

### Expected Outcome
- Comprehensive error handling for all error types
- Clear, user-friendly error messages
- Field-level errors displayed on form
- Navigation to step with errors
- Form re-enabled for retry attempts
- Email exists error with login link
- Network and server errors handled gracefully
- Professional error experience

### Verification Checklist
- [ ] Error handler function created
- [ ] Error parsing logic implemented
- [ ] Validation errors (400) handled
- [ ] Field-specific errors set using setError
- [ ] Email exists error (409) handled
- [ ] Network errors caught and displayed
- [ ] Server errors (500) handled
- [ ] Error toast displays appropriate messages
- [ ] Form re-enabled after error (isSubmitting = false)
- [ ] User can retry submission
- [ ] Form data preserved after error
- [ ] Navigation to step with errors implemented
- [ ] Login link added for email exists error
- [ ] Retry button included where appropriate
- [ ] Errors are accessible (aria attributes)
- [ ] Error logging implemented (development only)

---

## Task 45: Add Login Link

### Overview
Add a prominent link to the login page on the registration page for users who already have an account. This link provides an easy way to navigate between registration and login flows, improving user experience and reducing friction for returning users who mistakenly landed on the registration page.

### Dependencies
- Task 33: Create Registration Form Component

### Instructions

1. **Locate link placement**
   - Navigate to `frontend/app/(auth)/register/page.tsx`
   - Identify area below the RegisterForm component
   - Plan placement in the page footer area

2. **Import Next.js Link component**
   - Import Link from 'next/link'
   - Ensure proper typing for TypeScript

3. **Create login link container**
   - Add container div below RegisterForm
   - Use flexbox or text-center for alignment
   - Ensure proper spacing from form

4. **Add link text**
   - Text: "Already have an account?"
   - Followed by login link
   - Make visually distinct

5. **Create login link**
   - Use Next.js Link component
   - href: "/login"
   - Text: "Sign in"
   - Style as interactive link

6. **Apply styling**
   - Use brand color for link (blue-600)
   - Add hover effect (underline or color change)
   - Ensure proper font size and weight
   - Make touch-friendly on mobile

7. **Add spacing**
   - Space above the link container
   - Ensure visual separation from form
   - Consistent with login page layout

8. **Ensure accessibility**
   - Proper color contrast
   - Keyboard accessible
   - Clear focus indicators

### Link Placement Options

#### Option A: Below Form (Recommended)
```
┌──────────────────────────────┐
│   [Registration Form]        │
│   [Step Indicator]           │
│   [Form Fields]              │
│   [Navigation Buttons]       │
└──────────────────────────────┘

   Already have an account? Sign in
```

#### Option B: In Form Footer
```
┌──────────────────────────────┐
│   [Registration Form]        │
│   [Form Fields]              │
│   [Navigation Buttons]       │
│   ─────────────────────────  │
│   Already have an account?   │
│   Sign in                    │
└──────────────────────────────┘
```

### Link Structure

```
HTML/JSX Structure:
<div className="text-center">
  <p className="text-sm text-gray-600">
    Already have an account?{' '}
    <Link href="/login" className="...">
      Sign in
    </Link>
  </p>
</div>
```

### Link Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| href | "/login" | Login page route |
| text | "Sign in" | Clear action |
| Container text | "Already have an account?" | Context |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `text-center mt-6` | Centered with spacing |
| Text | `text-sm text-gray-600` | Muted, readable |
| Link | `text-blue-600 hover:text-blue-800` | Brand color |
| Link | `font-medium hover:underline` | Emphasis and interaction |
| Link | `transition-colors` | Smooth hover effect |

### Visual Examples

#### Desktop View
```
┌──────────────────────────────────────┐
│                                      │
│    [Create Your Account Form]        │
│    [Registration Complete]           │
│                                      │
│  Already have an account? Sign in    │
│                             ────────  │
│                              (hover)  │
└──────────────────────────────────────┘
```

#### Mobile View
```
┌─────────────────────────┐
│  [Registration Form]    │
│                         │
│  Already have account?  │
│      Sign in            │
│      ────────           │
└─────────────────────────┘
```

### Consistency with Login Page

The registration page login link should mirror the login page registration link:

| Page | Link Text | Destination |
|------|-----------|-------------|
| Login | "Don't have an account? Register" | /register |
| Register | "Already have an account? Sign in" | /login |

### Complete Page Structure

```
RegisterPage (/register)
├── AuthCard
│   ├── AuthHeading
│   │   ├── Title: "Create Your Account"
│   │   └── Subtitle: "Get started with LankaCommerce"
│   │
│   ├── RegisterForm
│   │   ├── StepIndicator
│   │   ├── Current Step Content
│   │   └── Navigation Buttons
│   │
│   └── Login Link Section
│       └── "Already have an account? Sign in"
│
└── [Auth Layout Footer]
```

### Accessibility Attributes

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| Link | role | "link" | Semantic meaning (implicit) |
| Link | aria-label | "Sign in to existing account" | Screen reader clarity |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus link |
| Enter | Navigate to login |
| Space | Navigate to login |

### Link States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Blue text | Clickable |
| Hover | Darker blue + underline | Shows interactivity |
| Focus | Blue outline | Keyboard accessible |
| Active | Slightly darker | Click feedback |
| Visited | Same as default | No color change |

### Mobile Considerations

| Aspect | Implementation |
|--------|----------------|
| Touch target | Minimum 44x44px |
| Font size | At least 16px (no zoom on tap) |
| Spacing | Adequate padding around link |
| Contrast | Meets WCAG AA standards |

### Expected Outcome
- Login link added below registration form
- Clear text: "Already have an account? Sign in"
- Link navigates to /login page
- Consistent styling with brand
- Accessible via keyboard and screen readers
- Professional appearance

### Verification Checklist
- [ ] Login link added to register page
- [ ] Link placed below RegisterForm
- [ ] Text reads "Already have an account? Sign in"
- [ ] Link uses Next.js Link component
- [ ] href set to "/login"
- [ ] Link styled with brand colors
- [ ] Hover effect implemented
- [ ] Proper spacing above link
- [ ] Link is keyboard accessible
- [ ] Focus indicator visible
- [ ] Touch target adequate for mobile
- [ ] Contrast ratio meets accessibility standards
- [ ] Link mirrors login page structure

---

## Task 46: Test Registration Flow

### Overview
Conduct comprehensive testing of the entire registration flow from start to finish. This includes testing all four steps individually, validating field inputs, testing step navigation, verifying form submission, checking error handling, testing success flow, and ensuring the experience works across different browsers and devices.

### Dependencies
- Task 45: Add Login Link

### Instructions

1. **Prepare testing environment**
   - Ensure backend API is running
   - Test database is accessible
   - Test email service is configured (or mocked)
   - Development environment is running

2. **Create test plan document**
   - List all test cases
   - Define expected outcomes
   - Create test data sets
   - Document test results

3. **Test page access and routing**
   - Navigate to /register URL
   - Verify page loads correctly
   - Check that auth layout renders
   - Verify initial state (Step 1 displayed)

4. **Test Step 1: Business Info**
   - Test empty field validation
   - Test minimum length validation
   - Test business type selection
   - Test optional registration number
   - Test Next button enabling/disabling
   - Test navigation to Step 2

5. **Test Step 2: Admin User**
   - Test all required fields
   - Test email format validation
   - Test password strength requirements
   - Test password visibility toggle
   - Test password confirmation matching
   - Test password strength indicator
   - Test Previous and Next buttons

6. **Test Step 3: Contact Info**
   - Test phone number formatting
   - Test Sri Lankan phone validation
   - Test optional address fields
   - Test timezone selection
   - Test navigation buttons

7. **Test Step 4: Plan Selection**
   - Test plan card selection
   - Test single plan selection (radio behavior)
   - Test visual selection indicator
   - Test terms acceptance checkbox
   - Test Submit button enabling

8. **Test step navigation**
   - Test Previous button on each step
   - Test Next button validation
   - Test step indicator updates
   - Test form data persistence across steps
   - Test direct step jumps (if applicable)

9. **Test form submission**
   - Complete all steps with valid data
   - Click Create Account button
   - Verify loading state displays
   - Verify form is disabled during submission
   - Wait for API response

10. **Test success flow**
    - Verify success toast appears
    - Check verification email message
    - Verify redirect to verification/login page
    - Check email stored correctly
    - Test success page content

11. **Test error handling**
    - Test validation errors (invalid data)
    - Test email already exists error
    - Test network error (disconnect internet)
    - Test server error (stop backend)
    - Verify error messages display
    - Verify form re-enables after error
    - Test error recovery (fix and retry)

12. **Test edge cases**
    - Test with very long inputs
    - Test with special characters
    - Test with SQL injection attempts (security)
    - Test with XSS attempts (security)
    - Test rapid clicking (duplicate prevention)
    - Test browser back button
    - Test page refresh (data loss)

13. **Test accessibility**
    - Test keyboard navigation (Tab, Enter, Space)
    - Test screen reader announcements (if possible)
    - Test focus indicators visibility
    - Test color contrast
    - Test with browser zoom (150%, 200%)
    - Test with high contrast mode

14. **Test responsive design**
    - Test on mobile viewport (320px, 375px, 414px)
    - Test on tablet viewport (768px, 1024px)
    - Test on desktop viewport (1280px, 1920px)
    - Verify layout adjusts appropriately
    - Test touch interactions on mobile

15. **Test browser compatibility**
    - Test on Chrome/Edge (Chromium)
    - Test on Firefox
    - Test on Safari (if available)
    - Verify consistent behavior
    - Document any browser-specific issues

16. **Test performance**
    - Check page load time
    - Check form interaction responsiveness
    - Check API call timing
    - Verify no memory leaks (console)
    - Check bundle size (if concerned)

17. **Document test results**
    - Record all passed tests
    - Document any failures
    - Note browser/device-specific issues
    - Create bug reports for failures
    - Verify fixes for any bugs found

### Test Cases

#### Step 1 Test Cases

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Empty business name | "" | Error: "Business name is required" | ☐ Pass / ☐ Fail |
| Short business name | "A" | Error: "At least 2 characters" | ☐ Pass / ☐ Fail |
| Valid business name | "ABC Store" | No error, Next enabled | ☐ Pass / ☐ Fail |
| No business type | (empty) | Error: "Select business type" | ☐ Pass / ☐ Fail |
| Valid business type | "Retail" | No error, Next enabled | ☐ Pass / ☐ Fail |
| Optional reg number | "" | No error (optional) | ☐ Pass / ☐ Fail |
| Next button disabled | Invalid data | Button disabled | ☐ Pass / ☐ Fail |
| Next button enabled | Valid data | Button enabled, advances | ☐ Pass / ☐ Fail |

#### Step 2 Test Cases

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Empty email | "" | Error: "Email is required" | ☐ Pass / ☐ Fail |
| Invalid email format | "notanemail" | Error: "Invalid email" | ☐ Pass / ☐ Fail |
| Valid email | "user@example.com" | No error | ☐ Pass / ☐ Fail |
| Empty password | "" | Error: "Password required" | ☐ Pass / ☐ Fail |
| Weak password | "pass" | Error: "Too weak" | ☐ Pass / ☐ Fail |
| Strong password | "Pass123!" | No error, strength: Strong | ☐ Pass / ☐ Fail |
| Password mismatch | Different values | Error: "Passwords don't match" | ☐ Pass / ☐ Fail |
| Password match | Same values | No error | ☐ Pass / ☐ Fail |
| Toggle password | Click eye icon | Password shows/hides | ☐ Pass / ☐ Fail |
| Strength indicator | Type password | Updates in real-time | ☐ Pass / ☐ Fail |

#### Step 3 Test Cases

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| Empty phone | "" | Error: "Phone required" | ☐ Pass / ☐ Fail |
| Invalid phone | "123" | Error: "Invalid format" | ☐ Pass / ☐ Fail |
| Valid phone | "+94 77 123 4567" | No error | ☐ Pass / ☐ Fail |
| Optional address | Empty | No error (optional) | ☐ Pass / ☐ Fail |
| Default timezone | "Asia/Colombo" | Pre-selected | ☐ Pass / ☐ Fail |

#### Step 4 Test Cases

| Test Case | Input | Expected Result | Status |
|-----------|-------|-----------------|--------|
| No plan selected | (none) | Error: "Select a plan" | ☐ Pass / ☐ Fail |
| Plan selection | Click card | Card highlighted | ☐ Pass / ☐ Fail |
| Multiple selection | Click two cards | Only one selected | ☐ Pass / ☐ Fail |
| Terms unchecked | false | Error: "Accept terms" | ☐ Pass / ☐ Fail |
| Terms checked | true | No error, Submit enabled | ☐ Pass / ☐ Fail |

#### Submission Test Cases

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| Valid submission | All fields valid | Success, redirect | ☐ Pass / ☐ Fail |
| Email exists | Existing email | Error: "Email exists" | ☐ Pass / ☐ Fail |
| Network error | No connection | Error: "Connection error" | ☐ Pass / ☐ Fail |
| Server error | Backend down | Error: "Server error" | ☐ Pass / ☐ Fail |
| Loading state | During submit | Button disabled, spinner | ☐ Pass / ☐ Fail |
| Duplicate click | Click twice | Only one submission | ☐ Pass / ☐ Fail |

#### Navigation Test Cases

| Test Case | Action | Expected Result | Status |
|-----------|--------|-----------------|--------|
| Previous on Step 2 | Click Previous | Go to Step 1 | ☐ Pass / ☐ Fail |
| Previous on Step 1 | Click Previous | Disabled/Hidden | ☐ Pass / ☐ Fail |
| Next validation | Invalid data | Button disabled | ☐ Pass / ☐ Fail |
| Step indicator | Change steps | Indicator updates | ☐ Pass / ☐ Fail |
| Data persistence | Navigate steps | Data preserved | ☐ Pass / ☐ Fail |

### Test Data Sets

#### Valid Registration Data Set 1

| Field | Value |
|-------|-------|
| businessName | "ABC Retail Store" |
| businessType | "retail" |
| registrationNumber | "BRN123456789" |
| firstName | "John" |
| lastName | "Doe" |
| email | "john.doe@example.com" |
| password | "SecurePass123!" |
| phone | "+94 77 123 4567" |
| timezone | "Asia/Colombo" |
| plan | "professional" |
| acceptTerms | true |

#### Valid Registration Data Set 2

| Field | Value |
|-------|-------|
| businessName | "Quick Service Restaurant" |
| businessType | "restaurant" |
| registrationNumber | "" (optional) |
| firstName | "Jane" |
| lastName | "Smith" |
| email | "jane.smith@example.com" |
| password | "MyP@ssw0rd" |
| phone | "+94 11 234 5678" |
| timezone | "Asia/Colombo" |
| plan | "starter" |
| acceptTerms | true |

#### Invalid Data Sets (for Error Testing)

| Field | Invalid Value | Expected Error |
|-------|---------------|----------------|
| email | "notanemail" | "Invalid email format" |
| password | "weak" | "Password too weak" |
| phone | "1234567890" | "Invalid phone format" |
| businessName | "A" | "Too short" |

### Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | Latest | ☐ | ☐ | Pass/Fail |
| Firefox | Latest | ☐ | ☐ | Pass/Fail |
| Safari | Latest | ☐ | ☐ | Pass/Fail |
| Edge | Latest | ☐ | ☐ | Pass/Fail |

### Device Testing Matrix

| Device Type | Screen Size | Orientation | Status |
|-------------|-------------|-------------|--------|
| Mobile | 375x667 | Portrait | ☐ Pass / ☐ Fail |
| Mobile | 414x896 | Portrait | ☐ Pass / ☐ Fail |
| Tablet | 768x1024 | Portrait | ☐ Pass / ☐ Fail |
| Tablet | 1024x768 | Landscape | ☐ Pass / ☐ Fail |
| Desktop | 1280x720 | Landscape | ☐ Pass / ☐ Fail |
| Desktop | 1920x1080 | Landscape | ☐ Pass / ☐ Fail |

### Accessibility Testing Checklist

- [ ] All form fields keyboard accessible
- [ ] Tab order is logical
- [ ] Enter key submits form appropriately
- [ ] Focus indicators visible on all interactive elements
- [ ] Error messages announced by screen readers
- [ ] Form labels associated with inputs
- [ ] Required fields marked with asterisk and aria-required
- [ ] Color contrast meets WCAG AA standards
- [ ] Page works at 200% zoom
- [ ] No keyboard traps

### Performance Benchmarks

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Initial page load | < 2s | ___s | ☐ Pass / ☐ Fail |
| Step navigation | < 100ms | ___ms | ☐ Pass / ☐ Fail |
| Form validation | < 50ms | ___ms | ☐ Pass / ☐ Fail |
| API submission | < 3s | ___s | ☐ Pass / ☐ Fail |

### Expected Outcome
- All test cases documented and executed
- Registration flow works end-to-end
- All validation working correctly
- Error handling covers all scenarios
- Success flow redirects appropriately
- Responsive design works on all devices
- Accessible to keyboard and screen reader users
- Cross-browser compatible
- Any bugs documented and reported

### Verification Checklist
- [ ] Test plan created
- [ ] Page routing tested (/register accessible)
- [ ] Step 1 fields tested (business info)
- [ ] Step 2 fields tested (admin user)
- [ ] Step 3 fields tested (contact info)
- [ ] Step 4 fields tested (plan selection)
- [ ] Step navigation tested (Previous/Next)
- [ ] Step indicator updates correctly
- [ ] Form data persists across steps
- [ ] Password strength indicator works
- [ ] Password visibility toggle works
- [ ] Terms checkbox required
- [ ] Form submission tested (valid data)
- [ ] Loading state displays during submission
- [ ] Success flow tested (toast + redirect)
- [ ] Validation errors tested
- [ ] Email exists error tested
- [ ] Network error tested
- [ ] Server error tested
- [ ] Form re-enables after error
- [ ] Login link works
- [ ] Keyboard navigation tested
- [ ] Mobile responsive tested
- [ ] Tablet responsive tested
- [ ] Desktop responsive tested
- [ ] Chrome/Edge tested
- [ ] Firefox tested
- [ ] Safari tested (if available)
- [ ] Accessibility features tested
- [ ] Test results documented

---

## Summary

This document completed the registration form implementation with password strength indication, terms acceptance validation, complete submission logic connecting to the backend API, comprehensive success handling with verification instructions and redirect, robust error handling for all error types with user-friendly messages, a login link for easy navigation, and a comprehensive testing plan covering functionality, accessibility, and cross-browser compatibility.

### Completed Tasks
40. ✓ Added password strength indicator with real-time feedback
41. ✓ Added required terms acceptance checkbox with policy links
42. ✓ Implemented registration submission with API integration
43. ✓ Handled registration success with toast, message, and redirect
44. ✓ Handled registration errors with field-level and general error messages
45. ✓ Added login link for existing users
46. ✓ Created comprehensive testing plan for entire registration flow

### Registration Flow Complete
The Group C Registration Flow is now fully implemented with:
- Multi-step form (4 steps) with progress indicator
- Comprehensive validation for all fields
- Sri Lankan localization (phone, timezone, currency)
- Password strength indicator
- Terms acceptance requirement
- Complete API integration
- Success and error handling
- Professional UX with loading states
- Responsive design
- Accessibility features
- Comprehensive test coverage

### Next Group
Proceed to Group-D_Password-Reset-Flow to implement the forgot password and reset password functionality.
