# Tasks 27-34: Validation, Submission, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** B - Registration Flow  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_Form-Inputs.md](01_Tasks-17-26_Form-Inputs.md)

---

## Document Overview

This document covers the validation schema, form submission logic, API integration, and complete verification of the customer registration flow. It establishes password requirements display, terms acceptance, Zod validation schema for all form fields, registration API service, success handling with redirects, and comprehensive flow verification.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Password Requirements List | Low | 20 min |
| 28 | Create Terms Checkbox | Low | 25 min |
| 29 | Create Zod Validation Schema | Medium | 35 min |
| 30 | Implement Form Submission Logic | Medium | 30 min |
| 31 | Create Register API Service | Medium | 30 min |
| 32 | Handle Registration Success | Low | 20 min |
| 33 | Create Login Link Component | Low | 15 min |
| 34 | Verify Registration Flow | Low | 30 min |

---

## Task 27: Create Password Requirements List

### Overview
Create a visual password requirements list component that displays all password criteria with real-time validation feedback. This component shows requirements for minimum length, uppercase letters, lowercase letters, numbers, and special characters, updating each requirement's status as the user types their password.

### Dependencies
- Task 24: Create Password Input

### Instructions

1. **Create PasswordRequirements.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `PasswordRequirements.tsx`
   - This displays password criteria with status

2. **Import required dependencies**
   - Import React hooks (useMemo)
   - Import Check and X icons from lucide-react
   - Import cn utility for conditional classes
   - Import useFormContext hook

3. **Define component props interface**
   - Create PasswordRequirementsProps interface
   - Include password prop (string) for validation
   - Include optional className prop

4. **Create requirements configuration array**
   - Define array of requirement objects
   - Each object has: id, label, test function
   - Cover all password criteria

5. **Define individual requirement tests**
   - Minimum length: test for 8+ characters
   - Uppercase: test for /[A-Z]/
   - Lowercase: test for /[a-z]/
   - Number: test for /[0-9]/
   - Special: test for /[!@#$%^&*(),.?":{}|<>]/

6. **Create PasswordRequirements component**
   - Define function component with props
   - Get form context if needed
   - Calculate requirement status with useMemo

7. **Implement requirement status calculation**
   - Map through requirements array
   - Test each requirement against password
   - Return array with id, label, met status

8. **Structure requirements display**
   - Create unordered list container
   - Map through requirement statuses
   - Display each requirement as list item

9. **Render requirement item**
   - Show check icon if requirement met (green)
   - Show X icon if requirement not met (gray)
   - Display requirement label text
   - Apply conditional styling based on status

10. **Add conditional styling**
    - Met requirement: green text, check icon
    - Unmet requirement: gray text, X icon
    - Smooth transition between states
    - Proper spacing and alignment

11. **Add accessibility features**
    - Use semantic HTML (ul, li)
    - Add aria-label for status icons
    - Ensure sufficient color contrast
    - Support screen readers

### Requirements Structure

```
┌──────────────────────────────────────┐
│ Password Requirements                │
│                                      │
│ ✓ At least 8 characters             │
│ ✗ One uppercase letter              │
│ ✓ One lowercase letter              │
│ ✗ One number                         │
│ ✗ One special character              │
└──────────────────────────────────────┘
```

### Requirements Configuration

| Requirement | Test Pattern | Label |
|-------------|-------------|-------|
| Length | `password.length >= 8` | "At least 8 characters" |
| Uppercase | `/[A-Z]/.test(password)` | "One uppercase letter" |
| Lowercase | `/[a-z]/.test(password)` | "One lowercase letter" |
| Number | `/[0-9]/.test(password)` | "One number" |
| Special | `/[!@#$%^&*]/.test(password)` | "One special character" |

### Requirement States

| State | Icon | Color | Text Style |
|-------|------|-------|------------|
| Met | Check (✓) | Green | text-green-600 |
| Unmet | X (✗) | Gray | text-gray-500 |
| Pending | X (✗) | Gray | text-gray-400 |

### Component Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-2 mt-4` | List spacing |
| List Item | `flex items-center gap-2 text-sm` | Item layout |
| Icon Met | `text-green-600 w-4 h-4` | Success indicator |
| Icon Unmet | `text-gray-400 w-4 h-4` | Pending indicator |
| Label | `text-gray-700` | Readable text |

### Requirement Logic Flow

```
Password Input Change
    │
    ▼
Test Each Requirement
    │
    ├──→ Length Check → Met/Unmet
    ├──→ Uppercase Check → Met/Unmet
    ├──→ Lowercase Check → Met/Unmet
    ├──→ Number Check → Met/Unmet
    └──→ Special Check → Met/Unmet
         │
         ▼
Update UI Display
```

### Expected Outcome
- Interactive password requirements list
- Real-time requirement validation feedback
- Clear visual indicators (checkmarks/X marks)
- All five password criteria displayed
- Smooth updates as user types

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/PasswordRequirements.tsx` file created
- [ ] All five requirements defined (length, uppercase, lowercase, number, special)
- [ ] Real-time validation as password changes
- [ ] Check icon shown for met requirements (green)
- [ ] X icon shown for unmet requirements (gray)
- [ ] Proper styling and spacing applied
- [ ] Component exports properly
- [ ] Accessibility features implemented

---

## Task 28: Create Terms Checkbox

### Overview
Create the terms and conditions checkbox component that allows users to accept the Terms of Service and Privacy Policy before registration. This component displays a checkbox with linked text to terms documents and validates that users must agree before proceeding.

### Dependencies
- Task 18: Create Register Form

### Instructions

1. **Create TermsCheckbox.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `TermsCheckbox.tsx`
   - This handles terms acceptance

2. **Import required dependencies**
   - Import FormField, FormItem, FormControl, FormMessage
   - Import Checkbox component from shadcn/ui
   - Import Link component from Next.js
   - Import useFormContext hook

3. **Define component props interface**
   - Create TermsCheckboxProps interface
   - Include name prop for form field name
   - Include disabled prop for loading state

4. **Create TermsCheckbox component**
   - Define function component with props
   - Get form context from useFormContext
   - Return FormField structure

5. **Configure FormField**
   - Set field name to "terms"
   - Connect to form control
   - Handle boolean value for checkbox

6. **Structure checkbox field**
   - Add FormItem wrapper with flex layout
   - Include FormControl with Checkbox component
   - Add label with linked terms text
   - Include FormMessage for errors

7. **Configure Checkbox component**
   - Set checked state from form field
   - Handle onCheckedChange event
   - Apply proper styling
   - Add aria-label for accessibility

8. **Create linked label text**
   - Start with "I agree to the "
   - Add Link to "/terms" with "Terms of Service"
   - Add " and "
   - Add Link to "/privacy" with "Privacy Policy"
   - Style links as blue with underline on hover

9. **Style link components**
   - Apply text-blue-600 color
   - Add hover:underline effect
   - Set font-medium weight
   - Ensure proper spacing

10. **Add error state handling**
    - Display FormMessage below checkbox
    - Show error if terms not accepted on submit
    - Apply error styling to checkbox border

11. **Configure accessibility**
    - Add proper label association
    - Ensure keyboard navigation works
    - Add aria-required attribute
    - Support screen readers

### Checkbox Structure

```
┌──────────────────────────────────────┐
│ ☐ I agree to the Terms of Service   │
│   and Privacy Policy                 │
│ [Error if not checked]               │
└──────────────────────────────────────┘
```

### Terms Checkbox Specifications

| Component | Purpose | Destination |
|-----------|---------|-------------|
| Checkbox | Accept/Decline | Boolean state |
| "Terms of Service" Link | View terms | `/terms` |
| "Privacy Policy" Link | View privacy | `/privacy` |

### Label Text Format

| Part | Content | Style |
|------|---------|-------|
| Prefix | "I agree to the " | Regular text |
| Terms Link | "Terms of Service" | Blue, hover underline |
| Connector | " and " | Regular text |
| Privacy Link | "Privacy Policy" | Blue, hover underline |

### Link Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Link | `text-blue-600 hover:underline font-medium` | Interactive link |
| Label Container | `flex items-start gap-2` | Checkbox alignment |
| Text | `text-sm text-gray-700` | Readable label |

### Error States

| Scenario | Message | Trigger |
|----------|---------|---------|
| Not Checked | "You must accept the terms" | Submit attempt |
| Unchecked After Check | - | User uncheck |

### Link Behavior Options

| Option | Implementation | Use Case |
|--------|----------------|----------|
| New Tab | `target="_blank"` | External document |
| Modal | Custom modal component | In-app viewing |
| Same Page | Default Link | Dedicated pages |

### Checkbox States

```
Unchecked (Default)
    │
    ▼
User Clicks Checkbox
    │
    ▼
Checked (Accepted)
    │
    ▼
Form Validation Passes
```

### Expected Outcome
- Functional checkbox for terms acceptance
- Clickable links to Terms and Privacy pages
- Required field validation
- Clear error message if not checked
- Proper keyboard and screen reader support

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/TermsCheckbox.tsx` file created
- [ ] Checkbox component integrated
- [ ] Label text includes linked terms
- [ ] Link to Terms of Service works
- [ ] Link to Privacy Policy works
- [ ] Required validation configured
- [ ] Error message displays correctly
- [ ] Checkbox state managed by form
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 29: Create Zod Validation Schema

### Overview
Create the comprehensive Zod validation schema for the registration form that validates all input fields including conditional email OR phone validation, password matching, strength requirements, name fields, and terms acceptance. This schema ensures data integrity before submission.

### Dependencies
- Task 18: Create Register Form
- All input components (Tasks 19-28)

### Instructions

1. **Create registerSchema.ts file**
   - Navigate to `frontend/lib/validations/` directory
   - Create new file named `registerSchema.ts`
   - This defines validation rules

2. **Import required dependencies**
   - Import z from "zod"
   - Import any custom validation helpers
   - Import type definitions if needed

3. **Define registration method enum**
   - Create enum or union type for "email" | "phone"
   - This determines which field is required
   - Used in conditional validation logic

4. **Create base schema structure**
   - Define registerSchema using z.object
   - Include all form fields
   - Set up field-level validations

5. **Add registration method validation**
   - Define registrationMethod field
   - Validate as enum: z.enum(["email", "phone"])
   - Set default to "email"

6. **Create email field validation**
   - Define optional email field
   - Validate email format using z.email()
   - Refine to require when registrationMethod is "email"

7. **Create phone field validation**
   - Define optional phone field
   - Validate Sri Lankan phone format (+94 XX XXX XXXX)
   - Use regex pattern for validation
   - Refine to require when registrationMethod is "phone"

8. **Add name field validations**
   - Define firstName field: required, min 2 chars
   - Define lastName field: required, min 2 chars
   - Trim whitespace in transformation

9. **Create password validation**
   - Define password field: required, min 8 chars
   - Add regex validation for strength requirements
   - Check for uppercase, lowercase, number, special char

10. **Add confirm password validation**
    - Define confirmPassword field
    - Must match password field
    - Use refine method for comparison

11. **Add terms acceptance validation**
    - Define terms field as boolean
    - Must be true (accepted)
    - Use refine to validate acceptance

12. **Implement conditional validation refinements**
    - Add superRefine for email OR phone requirement
    - Ensure at least one contact method provided
    - Add custom error messages for each field

13. **Add password matching refinement**
    - Compare password and confirmPassword
    - Set error on confirmPassword field if mismatch
    - Provide clear error message

14. **Create TypeScript type from schema**
    - Export type RegisterFormData = z.infer<typeof registerSchema>
    - This provides type safety for form data

15. **Add custom error messages**
    - Define clear, user-friendly messages
    - Cover all validation scenarios
    - Include format requirements in messages

### Schema Structure

```
registerSchema
├── registrationMethod: enum["email", "phone"]
├── email: optional().email() + conditional
├── phone: optional().regex() + conditional
├── firstName: min(2).trim()
├── lastName: min(2).trim()
├── password: min(8) + strength rules
├── confirmPassword: string()
└── terms: boolean().refine(true)
    │
    ├── Refinements
    │   ├── Email OR Phone required
    │   └── Password matching
    └── SuperRefinements
        └── Conditional field requirements
```

### Validation Rules Table

| Field | Rules | Error Messages |
|-------|-------|---------------|
| registrationMethod | Must be "email" or "phone" | "Select registration method" |
| email | Valid email format (if selected) | "Please enter a valid email" |
| phone | +94 XX XXX XXXX format (if selected) | "Please enter valid Sri Lankan mobile" |
| firstName | Required, min 2 chars | "First name must be at least 2 characters" |
| lastName | Required, min 2 chars | "Last name must be at least 2 characters" |
| password | Min 8, uppercase, lowercase, number, special | "Password must meet requirements" |
| confirmPassword | Must match password | "Passwords do not match" |
| terms | Must be true | "You must accept the terms" |

### Phone Validation Pattern

| Component | Pattern | Example |
|-----------|---------|---------|
| Full Pattern | `^7[0-9]{8}$` | 712345678 |
| Network Codes | 70, 71, 72, 75, 76, 77, 78 | 71XXXXXXX |
| Length | 9 digits (without +94) | 9 digits |

### Password Strength Regex

| Requirement | Pattern | Description |
|-------------|---------|-------------|
| Minimum Length | `.{8,}` | At least 8 characters |
| Uppercase | `(?=.*[A-Z])` | At least one uppercase |
| Lowercase | `(?=.*[a-z])` | At least one lowercase |
| Number | `(?=.*[0-9])` | At least one digit |
| Special | `(?=.*[!@#$%^&*])` | At least one special char |

### Conditional Validation Logic

```
IF registrationMethod === "email"
    THEN email is REQUIRED
    AND phone is OPTIONAL
ELSE IF registrationMethod === "phone"
    THEN phone is REQUIRED
    AND email is OPTIONAL
```

### Schema Export Structure

| Export | Type | Purpose |
|--------|------|---------|
| registerSchema | ZodObject | Validation schema |
| RegisterFormData | TypeScript Type | Form data type |

### Error Message Guidelines

| Type | Format | Example |
|------|--------|---------|
| Required | "{Field} is required" | "Email is required" |
| Format | "Please enter valid {field}" | "Please enter valid email" |
| Length | "{Field} must be at least {n} characters" | "Password must be at least 8 characters" |
| Match | "{Field} do not match" | "Passwords do not match" |

### Expected Outcome
- Complete Zod validation schema for registration
- Conditional email OR phone validation
- Password strength and matching validation
- Type-safe form data interface
- Clear, user-friendly error messages
- Sri Lankan phone format validation

### Verification Checklist
- [ ] `frontend/lib/validations/registerSchema.ts` file created
- [ ] All form fields included in schema
- [ ] Email validation with proper format check
- [ ] Phone validation with +94 format regex
- [ ] Conditional email OR phone validation working
- [ ] Name fields with min length validation
- [ ] Password strength validation implemented
- [ ] Confirm password matching validation
- [ ] Terms checkbox boolean validation
- [ ] Custom error messages defined
- [ ] TypeScript type exported
- [ ] Schema exports properly

---

## Task 30: Implement Form Submission Logic

### Overview
Create the form submission handler that processes registration form data, manages loading states, handles errors, and coordinates the API call. This function orchestrates the entire registration process from form validation through API submission to success/error handling.

### Dependencies
- Task 29: Create Register Validation Schema
- Task 18: Create Register Form

### Instructions

1. **Locate RegisterForm component**
   - Open `frontend/components/storefront/auth/Register/RegisterForm.tsx`
   - Find form component definition
   - Identify form configuration section

2. **Import required dependencies**
   - Import useState for loading state
   - Import useRouter from Next.js for navigation
   - Import toast from sonner for notifications
   - Import registerService (created in Task 31)

3. **Define loading state**
   - Add useState for isLoading boolean
   - Initialize to false
   - Use to disable form during submission

4. **Access router instance**
   - Use useRouter hook
   - Store in router constant
   - Use for post-registration navigation

5. **Create onSubmit handler function**
   - Define async function accepting form data
   - Type parameter as RegisterFormData
   - Implement try-catch error handling

6. **Implement submission flow start**
   - Set isLoading to true
   - Clear any previous errors
   - Prepare data for API call

7. **Transform form data for API**
   - Extract registrationMethod
   - Build payload with correct contact field
   - If email method: include email
   - If phone method: include phone with +94

8. **Add API call execution**
   - Call registerService with transformed data
   - Await response
   - Handle response data

9. **Handle successful registration**
   - Show success toast notification
   - Store authentication tokens if provided
   - Call success handler (Task 32)
   - Navigate to appropriate route

10. **Implement error handling**
    - Catch API errors
    - Extract error message from response
    - Display error toast to user
    - Set form errors if field-specific

11. **Add finally block**
    - Set isLoading to false
    - Re-enable form controls
    - Clean up any temporary state

12. **Configure form submit button**
    - Pass isLoading to button disabled prop
    - Show loading spinner when submitting
    - Display appropriate button text

13. **Add form-level error display**
    - Show general error message if API fails
    - Display above or below form
    - Provide retry guidance

14. **Disable all inputs during loading**
    - Pass isLoading prop to all input components
    - Prevent user changes during submission
    - Disable submit button

### Submission Flow Diagram

```
User Clicks Submit
    │
    ▼
Validate Form (Zod)
    │
    ├──→ Invalid → Show Errors → STOP
    │
    ▼
Set Loading State
    │
    ▼
Transform Data
    │
    ▼
Call Register API
    │
    ├──→ Success ──→ Store Tokens ──→ Show Toast ──→ Navigate
    │
    └──→ Error ──→ Show Error Toast ──→ Re-enable Form
         │
         ▼
    Finally: isLoading = false
```

### Loading States

| State | isLoading | Button Text | Button Disabled | Inputs Disabled |
|-------|-----------|-------------|-----------------|-----------------|
| Initial | false | "Create Account" | false | false |
| Submitting | true | "Creating Account..." | true | true |
| Success | false | (Navigated away) | - | - |
| Error | false | "Create Account" | false | false |

### Data Transformation Example

| Input Data | API Payload (Email) | API Payload (Phone) |
|------------|---------------------|---------------------|
| registrationMethod: "email" | email: "user@example.com" | - |
| email: "user@example.com" | firstName: "John" | - |
| phone: "712345678" | lastName: "Doe" | phone: "+94712345678" |
| firstName: "John" | password: "****" | firstName: "John" |
| lastName: "Doe" | - | lastName: "Doe" |
| password: "****" | - | password: "****" |

### Error Handling Matrix

| Error Type | Source | Display Method | Action |
|------------|--------|----------------|--------|
| Validation | Zod | Field errors | Fix fields |
| Network | API | Toast | Retry |
| Email Exists | API | Field error | Use different email |
| Phone Exists | API | Field error | Use different phone |
| Server Error | API | Toast | Try again later |

### Toast Notification Configuration

| Event | Type | Message | Duration |
|-------|------|---------|----------|
| Success | Success | "Account created successfully!" | 3s |
| Error | Error | API error message | 5s |
| Network | Error | "Network error. Please try again." | 5s |

### Button States

```
┌─────────────────────────┐
│   Create Account        │  ← Initial
└─────────────────────────┘

┌─────────────────────────┐
│ ⟳ Creating Account...   │  ← Loading (spinner + text)
└─────────────────────────┘

┌─────────────────────────┐
│   Create Account        │  ← Error (back to initial)
└─────────────────────────┘
```

### Form Disabled Behavior

| Component | Loading = False | Loading = True |
|-----------|-----------------|----------------|
| All Inputs | Enabled | Disabled |
| Toggle | Enabled | Disabled |
| Checkboxes | Enabled | Disabled |
| Submit Button | Enabled | Disabled |

### Expected Outcome
- Complete form submission handler implemented
- Loading state management working
- Data transformation for API call
- Success handling with navigation
- Comprehensive error handling
- User feedback via toast notifications
- Form disabled during submission

### Verification Checklist
- [ ] onSubmit handler function created
- [ ] isLoading state implemented
- [ ] Form validation runs before submission
- [ ] Data transformed correctly for API
- [ ] API call made with proper error handling
- [ ] Success toast notification shown
- [ ] Error toast notification shown
- [ ] Form re-enabled after submission
- [ ] Loading spinner shown on button
- [ ] All inputs disabled during loading
- [ ] Router navigation configured
- [ ] Try-catch-finally structure implemented

---

## Task 31: Create Register API Service

### Overview
Create the registration API service function that communicates with the backend authentication endpoint. This service handles HTTP requests to the `/api/storefront/auth/register` endpoint, sends user registration data, processes the response, and returns authentication tokens and user information.

### Dependencies
- Task 30: Implement Form Submission Logic
- Backend registration endpoint available

### Instructions

1. **Create registerService.ts file**
   - Navigate to `frontend/services/storefront/auth/` directory
   - Create new file named `registerService.ts`
   - This handles registration API calls

2. **Import required dependencies**
   - Import axios or fetch utility
   - Import API base URL configuration
   - Import type definitions for request/response

3. **Define request payload interface**
   - Create RegisterRequestPayload interface
   - Include registrationMethod field
   - Include conditional email or phone field
   - Include firstName, lastName, password

4. **Define response payload interface**
   - Create RegisterResponsePayload interface
   - Include user object with id, email/phone, name
   - Include accessToken and refreshToken
   - Include success status and message

5. **Define error response interface**
   - Create RegisterErrorResponse interface
   - Include error message
   - Include field-specific errors if applicable
   - Include status code

6. **Create registerUser service function**
   - Define async function accepting payload
   - Type parameter as RegisterRequestPayload
   - Return Promise<RegisterResponsePayload>

7. **Build API endpoint URL**
   - Construct full URL: `${API_BASE_URL}/storefront/auth/register`
   - Ensure proper path concatenation
   - Support environment-based URLs

8. **Configure request headers**
   - Set Content-Type to "application/json"
   - Add any required API keys or headers
   - Include CSRF token if needed

9. **Prepare request body**
   - Transform payload if needed
   - Ensure phone includes +94 prefix
   - Stringify data for JSON body

10. **Make POST request**
    - Use axios.post or fetch with POST method
    - Send to registration endpoint
    - Include headers and body
    - Set appropriate timeout

11. **Handle successful response**
    - Parse response data
    - Extract user information
    - Extract authentication tokens
    - Return structured response

12. **Implement error handling**
    - Catch network errors
    - Catch API errors (4xx, 5xx)
    - Extract error messages
    - Throw formatted error object

13. **Add response validation**
    - Verify response structure
    - Check for required fields
    - Validate token format
    - Handle unexpected responses

14. **Add logging (optional)**
    - Log request for debugging
    - Log response or error
    - Exclude sensitive data
    - Use environment-based logging

15. **Export service function**
    - Export registerUser as named export
    - Export types for consumer use
    - Add JSDoc comments for documentation

### API Service Structure

```
registerUser(payload)
    │
    ▼
Build Request
    ├── URL: /api/storefront/auth/register
    ├── Method: POST
    ├── Headers: Content-Type, etc.
    └── Body: JSON payload
    │
    ▼
Send Request
    │
    ├──→ Success (200)
    │    ├── Parse Response
    │    ├── Extract Tokens
    │    └── Return User Data
    │
    └──→ Error (4xx/5xx)
         ├── Extract Error Message
         └── Throw Error
```

### Request Payload Structure

| Field | Type | Required | Conditional |
|-------|------|----------|-------------|
| registrationMethod | "email" \| "phone" | Yes | - |
| email | string | No | If method = "email" |
| phone | string | No | If method = "phone" |
| firstName | string | Yes | - |
| lastName | string | Yes | - |
| password | string | Yes | - |

### Email Registration Payload Example

```
{
  "registrationMethod": "email",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123!"
}
```

### Phone Registration Payload Example

```
{
  "registrationMethod": "phone",
  "phone": "+94712345678",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "SecurePass123!"
}
```

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Registration success status |
| message | string | Success message |
| user | object | User information |
| user.id | string | User unique ID |
| user.email | string | User email (if applicable) |
| user.phone | string | User phone (if applicable) |
| user.firstName | string | User first name |
| user.lastName | string | User last name |
| accessToken | string | JWT access token |
| refreshToken | string | JWT refresh token |

### Success Response Example

```
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "usr_abc123",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Error Response Structure

| Status Code | Scenario | Error Message |
|-------------|----------|---------------|
| 400 | Invalid data | "Validation error: {details}" |
| 409 | Email exists | "Email already registered" |
| 409 | Phone exists | "Phone number already registered" |
| 500 | Server error | "Registration failed. Please try again." |
| Network | Connection | "Network error. Check connection." |

### Error Handling Flow

```
API Error Occurred
    │
    ▼
Check Error Type
    │
    ├──→ 400 Validation
    │    └── Extract Field Errors
    │
    ├──→ 409 Conflict
    │    └── "Account already exists"
    │
    ├──→ 500 Server
    │    └── "Server error. Try again."
    │
    └──→ Network Error
         └── "Connection failed"
```

### HTTP Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Method | POST | Create new resource |
| Content-Type | application/json | JSON request body |
| Timeout | 10000ms | Prevent hanging |
| withCredentials | true | Send cookies |

### Expected Outcome
- Functional API service for registration
- Proper request/response typing
- Comprehensive error handling
- Token extraction and return
- Network error handling
- Type-safe service function

### Verification Checklist
- [ ] `frontend/services/storefront/auth/registerService.ts` file created
- [ ] RegisterRequestPayload interface defined
- [ ] RegisterResponsePayload interface defined
- [ ] RegisterErrorResponse interface defined
- [ ] registerUser function implemented
- [ ] POST request to correct endpoint
- [ ] Request headers configured
- [ ] Request body properly formatted
- [ ] Response parsing implemented
- [ ] Token extraction working
- [ ] Error handling comprehensive
- [ ] Network error handling included
- [ ] TypeScript types defined
- [ ] Function exported properly
- [ ] JSDoc comments added

---

## Task 32: Handle Registration Success

### Overview
Create the success handler that processes successful registration responses, stores authentication tokens, updates application state, shows confirmation messages, and redirects users to the appropriate destination. This handler completes the registration flow with a smooth user experience.

### Dependencies
- Task 31: Create Register API Service
- Task 30: Implement Form Submission Logic

### Instructions

1. **Locate success handling section**
   - Open `frontend/components/storefront/auth/Register/RegisterForm.tsx`
   - Find onSubmit handler's success block
   - Identify post-API-call section

2. **Import required dependencies**
   - Import token storage utilities
   - Import user state management (context/store)
   - Import router for navigation
   - Import toast for notifications

3. **Create handleRegistrationSuccess function**
   - Define function accepting response data
   - Type parameter as RegisterResponsePayload
   - Make async if needed for storage operations

4. **Extract response data**
   - Destructure user object
   - Extract accessToken
   - Extract refreshToken
   - Extract any additional data

5. **Store authentication tokens**
   - Save accessToken to localStorage
   - Save refreshToken to localStorage
   - Use secure storage for sensitive data
   - Set token expiry if provided

6. **Update application state**
   - Set user authenticated status
   - Store user information in state
   - Update global auth context
   - Trigger auth state refresh

7. **Show success notification**
   - Display success toast
   - Message: "Account created successfully!"
   - Duration: 3000ms
   - Include welcome message with user name

8. **Handle return URL redirect**
   - Check for returnUrl query parameter
   - Validate return URL for security
   - Default to `/account` if no return URL
   - Use router.push for navigation

9. **Implement navigation logic**
   - If returnUrl exists: navigate to returnUrl
   - Else: navigate to `/account` dashboard
   - Use replace instead of push to prevent back
   - Add small delay for UX (optional)

10. **Track registration analytics**
    - Send registration event to analytics
    - Include registration method (email/phone)
    - Track timestamp and user ID
    - Fire conversion tracking if applicable

11. **Clear form state (optional)**
    - Reset form fields
    - Clear validation errors
    - Clean up component state

12. **Handle auto-login**
    - Set axios default authorization header
    - Configure API client with new token
    - Update authenticated flag globally

13. **Add success animation (optional)**
    - Show checkmark animation
    - Brief success message display
    - Smooth transition to redirect

### Success Flow Diagram

```
Registration Success
    │
    ▼
Extract Response Data
    ├── User Object
    ├── Access Token
    └── Refresh Token
    │
    ▼
Store Tokens
    ├── localStorage.setItem("accessToken")
    └── localStorage.setItem("refreshToken")
    │
    ▼
Update App State
    ├── Set isAuthenticated = true
    └── Set currentUser = user
    │
    ▼
Show Success Toast
    │
    ▼
Check Return URL
    │
    ├──→ Return URL Exists ──→ Navigate to Return URL
    │
    └──→ No Return URL ──→ Navigate to /account
```

### Token Storage Strategy

| Storage Method | Use Case | Security Level |
|----------------|----------|----------------|
| localStorage | Access token | Medium |
| httpOnly Cookie | Refresh token | High |
| sessionStorage | Temporary session | Low |
| Memory | High security apps | Very High |

### Redirect Destinations

| Scenario | Destination | Use Case |
|----------|-------------|----------|
| Return URL Present | Query param URL | Continue shopping |
| No Return URL | `/account` | General registration |
| First-Time User | `/welcome` | Onboarding flow |
| Error | Stay on page | Show error |

### Success Toast Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | Success | Visual indicator |
| Message | "Account created successfully!" | Clear feedback |
| Description | "Welcome, {firstName}!" | Personalization |
| Duration | 3000ms | Sufficient reading time |
| Position | Top-right | Non-intrusive |

### State Update Operations

| Operation | Target | Value |
|-----------|--------|-------|
| Set User | authContext.user | Response user object |
| Set Authenticated | authContext.isAuthenticated | true |
| Set Token | axios.defaults.headers | `Bearer ${token}` |
| Clear Loading | isLoading | false |

### Return URL Validation

```
Check Return URL
    │
    ▼
Is URL Present?
    │
    ├──→ No → Use Default (/account)
    │
    ▼
Is URL Internal?
    │
    ├──→ No → Use Default (security)
    │
    ▼
Is URL Safe?
    │
    ├──→ No → Use Default
    │
    ▼
Use Return URL
```

### Navigation Timing

| Action | Delay | Reason |
|--------|-------|--------|
| Show Toast | Immediate | User feedback |
| Store Tokens | Immediate | Auth setup |
| Navigate | 500-1000ms | Toast visibility |

### Analytics Events

| Event Name | Properties | Purpose |
|------------|------------|---------|
| user_registered | method, timestamp | Track conversion |
| registration_complete | userId, method | User acquisition |
| account_created | source, medium | Marketing attribution |

### Error Scenarios in Success Handler

| Scenario | Action | Fallback |
|----------|--------|----------|
| Token storage fails | Show warning | Redirect anyway |
| State update fails | Log error | Continue flow |
| Navigation fails | Show error | Manual navigation link |

### Expected Outcome
- Tokens stored securely in browser
- User state updated globally
- Success notification displayed
- Automatic navigation to destination
- Auto-login completed
- Analytics tracked

### Verification Checklist
- [ ] handleRegistrationSuccess function created
- [ ] Access token stored in localStorage
- [ ] Refresh token stored securely
- [ ] User state updated in auth context
- [ ] Success toast notification shown
- [ ] Toast includes personalized message
- [ ] Return URL parameter checked
- [ ] Navigation to correct destination
- [ ] Router.push/replace used appropriately
- [ ] Axios auth header configured
- [ ] Analytics event fired
- [ ] Form state cleaned up
- [ ] Auto-login completed

---

## Task 33: Create Login Link Component

### Overview
Create a link component at the bottom of the registration form that directs existing users to the login page. This component provides clear navigation for users who mistakenly started registration when they already have an account, improving user experience and reducing confusion.

### Dependencies
- Task 17: Create Register Page

### Instructions

1. **Create LoginLink.tsx file**
   - Navigate to `frontend/components/storefront/auth/Register/` directory
   - Create new file named `LoginLink.tsx`
   - This displays link to login page

2. **Import required dependencies**
   - Import Link component from Next.js
   - Import any styling utilities
   - Import ArrowRight icon (optional)

3. **Define component props interface**
   - Create LoginLinkProps interface
   - Include optional className prop
   - Keep props minimal for simplicity

4. **Create LoginLink component**
   - Define function component with props
   - Return structured JSX
   - No state management needed

5. **Structure component layout**
   - Create container div with centered text
   - Add descriptive text "Already have an account?"
   - Add Link component to login page
   - Apply proper spacing

6. **Configure Link component**
   - Set href to `/login`
   - Add link text: "Log in here"
   - Style as interactive link
   - Add hover effects

7. **Apply component styling**
   - Center text horizontally
   - Use subtle gray color for question text
   - Use blue color for link
   - Add hover underline effect

8. **Add visual separator**
   - Include subtle divider line above component
   - Or add top margin for spacing
   - Separate from form visually

9. **Enhance with icon (optional)**
   - Add ArrowRight icon after link text
   - Style icon to match link
   - Animate on hover

10. **Configure accessibility**
    - Ensure link has proper contrast
    - Add focus indicators
    - Use semantic HTML
    - Support keyboard navigation

11. **Add to RegisterPage**
    - Import LoginLink component
    - Place below RegisterForm
    - Position at bottom of card

### Component Structure

```
┌──────────────────────────────────────┐
│                                      │
│         [Register Form]              │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Already have an account?            │
│  Log in here →                       │
│                                      │
└──────────────────────────────────────┘
```

### Component Layout

| Element | Content | Style |
|---------|---------|-------|
| Container | Flex centered | `flex justify-center items-center gap-1` |
| Question Text | "Already have an account?" | `text-sm text-gray-600` |
| Login Link | "Log in here" | `text-sm text-blue-600 hover:underline` |

### Link Styling

| Property | Value | Purpose |
|----------|-------|---------|
| Color | text-blue-600 | Brand consistency |
| Hover | hover:underline | Interaction feedback |
| Font Weight | font-medium | Emphasis |
| Cursor | pointer (default) | Clickable indication |

### Spacing Options

| Approach | Implementation | Visual Effect |
|----------|----------------|---------------|
| Top Margin | `mt-6` | Space from form |
| Top Border | `border-t pt-4` | Visual divider |
| Padding | `py-4` | Breathing room |

### Accessibility Features

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Contrast Ratio | 4.5:1 minimum | Readability |
| Focus Ring | `focus:ring-2 focus:ring-blue-500` | Keyboard nav |
| Semantic Link | `<Link>` component | Screen readers |

### Text Variations

| Style | Text | Use Case |
|-------|------|----------|
| Standard | "Already have an account? Log in here" | Default |
| Casual | "Already registered? Sign in" | Informal tone |
| Formal | "Existing user? Access your account" | Professional |

### Placement Options

| Location | Approach | Context |
|----------|----------|---------|
| Below Form | Separate component | Clear separation |
| In Card Footer | CardFooter section | Contained |
| Fixed Bottom | Sticky position | Always visible |

### Icon Enhancement

```
Already have an account?  Log in here →
                                      ↑
                                   Icon
```

### Link States

| State | Styling | Description |
|-------|---------|-------------|
| Default | Blue text | Initial state |
| Hover | Underlined | Mouse over |
| Focus | Ring outline | Keyboard focus |
| Active | Slightly darker | Click moment |

### Expected Outcome
- Functional link component to login page
- Clear, centered text layout
- Proper styling with brand colors
- Hover effects for interactivity
- Accessible keyboard navigation
- Visual separation from form

### Verification Checklist
- [ ] `frontend/components/storefront/auth/Register/LoginLink.tsx` file created
- [ ] Link component properly configured
- [ ] href points to `/login`
- [ ] Text content clear and descriptive
- [ ] Styling matches design system
- [ ] Hover effects working
- [ ] Component centered horizontally
- [ ] Visual separation from form
- [ ] Accessibility features implemented
- [ ] Component exported properly
- [ ] Integrated into RegisterPage

---

## Task 34: Verify Registration Flow

### Overview
Conduct comprehensive verification of the entire customer registration flow from initial page load through successful account creation. This verification ensures all components work together correctly, validation functions properly, API integration succeeds, and the user experience is smooth across all scenarios including error cases.

### Dependencies
- Task 33: Create Login Link Component
- All previous tasks in Group B

### Instructions

1. **Set up test environment**
   - Ensure development server running
   - Configure backend API connectivity
   - Prepare test data for registration
   - Clear browser storage

2. **Verify page load and rendering**
   - Navigate to `/register` route
   - Confirm RegisterPage component renders
   - Check all form fields display correctly
   - Verify layout and styling proper

3. **Test email registration flow**
   - Select email registration method
   - Verify phone field hidden
   - Enter valid email address
   - Complete all required fields
   - Submit form and verify success

4. **Test phone registration flow**
   - Select phone registration method
   - Verify email field hidden
   - Enter valid +94 phone number
   - Verify formatting applies correctly
   - Submit form and verify success

5. **Verify name input fields**
   - Test first name field validation
   - Test last name field validation
   - Verify minimum length requirements
   - Test whitespace trimming

6. **Test password requirements**
   - Enter password progressively
   - Verify requirements list updates real-time
   - Confirm all requirements check marks
   - Test password visibility toggle

7. **Test confirm password matching**
   - Enter non-matching passwords
   - Verify error message displays
   - Enter matching passwords
   - Verify error clears

8. **Test password strength meter**
   - Enter weak password (< 8 chars)
   - Verify meter shows "Weak" (red)
   - Add characters progressively
   - Verify meter progresses through levels

9. **Verify terms checkbox**
   - Submit without checking terms
   - Verify error message displays
   - Click terms link, verify modal/page opens
   - Check checkbox, verify error clears

10. **Test form validation**
    - Submit empty form
    - Verify all field errors display
    - Correct one field at a time
    - Verify errors clear appropriately

11. **Test API integration**
    - Complete valid form data
    - Submit form
    - Verify loading state displays
    - Confirm API call succeeds
    - Verify tokens received

12. **Verify success handling**
    - Confirm success toast displays
    - Verify tokens stored in localStorage
    - Check user state updated
    - Confirm redirect to destination

13. **Test error scenarios**
    - Register with existing email
    - Verify "Email exists" error
    - Test network error simulation
    - Verify error toast displays

14. **Test loading states**
    - Submit form
    - Verify form fields disabled
    - Verify button shows loading spinner
    - Confirm submit button disabled

15. **Verify responsive design**
    - Test on mobile viewport (< 640px)
    - Test on tablet viewport (640-1024px)
    - Test on desktop viewport (> 1024px)
    - Verify layout adapts properly

16. **Test keyboard navigation**
    - Tab through all form fields
    - Verify focus indicators visible
    - Test Enter key submission
    - Test Escape key behaviors

17. **Verify accessibility**
    - Test with screen reader
    - Verify proper ARIA labels
    - Check color contrast ratios
    - Ensure keyboard-only navigation works

18. **Test login link**
    - Click "Log in here" link
    - Verify navigation to `/login`
    - Verify query parameters preserved (if any)

19. **Verify phone formatting**
    - Enter raw digits
    - Verify automatic formatting (XX XXX XXXX)
    - Test backspace handling
    - Verify stored value correct (+94)

20. **Create verification checklist document**
    - Document all test cases
    - Note any issues found
    - Record browser compatibility
    - Document mobile testing results

### Verification Flow Diagram

```
Start Verification
    │
    ├──→ Page Load Tests
    │    ├── Route accessible
    │    ├── Components render
    │    └── Initial state correct
    │
    ├──→ Email Registration Path
    │    ├── Toggle to email
    │    ├── Fill all fields
    │    ├── Validate
    │    └── Submit
    │
    ├──→ Phone Registration Path
    │    ├── Toggle to phone
    │    ├── Fill with +94 format
    │    ├── Validate
    │    └── Submit
    │
    ├──→ Validation Tests
    │    ├── Empty form
    │    ├── Invalid email
    │    ├── Invalid phone
    │    ├── Weak password
    │    ├── Password mismatch
    │    └── Terms unchecked
    │
    ├──→ Password Feature Tests
    │    ├── Requirements list
    │    ├── Strength meter
    │    ├── Confirm password
    │    └── Visibility toggle
    │
    ├──→ Error Scenario Tests
    │    ├── Email exists
    │    ├── Phone exists
    │    ├── Network error
    │    └── Server error
    │
    ├──→ Success Flow Tests
    │    ├── API response
    │    ├── Token storage
    │    ├── State update
    │    └── Redirect
    │
    ├──→ UI/UX Tests
    │    ├── Loading states
    │    ├── Responsive design
    │    ├── Accessibility
    │    └── Keyboard nav
    │
    └──→ Integration Tests
         ├── Links navigation
         ├── Terms modal
         └── Return URL handling
```

### Test Cases Matrix

| Test Case # | Scenario | Expected Result | Priority |
|-------------|----------|-----------------|----------|
| TC-01 | Load register page | Page renders correctly | High |
| TC-02 | Submit empty form | All field errors shown | High |
| TC-03 | Email registration | Success with redirect | High |
| TC-04 | Phone registration | Success with redirect | High |
| TC-05 | Invalid email format | Email error shown | High |
| TC-06 | Invalid phone format | Phone error shown | High |
| TC-07 | Password too short | Error shown | High |
| TC-08 | Password mismatch | Error on confirm field | High |
| TC-09 | Terms not checked | Error shown | High |
| TC-10 | Email already exists | Error message | Medium |
| TC-11 | Phone already exists | Error message | Medium |
| TC-12 | Network error | Error toast | Medium |
| TC-13 | Loading state | Disabled form | Medium |
| TC-14 | Password strength weak | Red meter | Low |
| TC-15 | Password strength strong | Green meter | Low |
| TC-16 | Phone formatting | XX XXX XXXX | Low |
| TC-17 | Click login link | Navigate to /login | Low |
| TC-18 | Responsive mobile | Layout adapts | Medium |
| TC-19 | Keyboard navigation | All fields accessible | Medium |
| TC-20 | Screen reader | Proper labels | Low |

### Email Registration Test Data

| Field | Valid Input | Invalid Input |
|-------|-------------|---------------|
| Registration Method | "email" | - |
| Email | "test@example.com" | "invalid-email" |
| First Name | "John" | "J" (too short) |
| Last Name | "Doe" | "" (empty) |
| Password | "SecurePass123!" | "weak" (too short) |
| Confirm Password | "SecurePass123!" | "Mismatch123!" |
| Terms | Checked | Unchecked |

### Phone Registration Test Data

| Field | Valid Input | Invalid Input |
|-------|-------------|---------------|
| Registration Method | "phone" | - |
| Phone | "712345678" | "12345" (too short) |
| First Name | "Jane" | "J" (too short) |
| Last Name | "Smith" | "" (empty) |
| Password | "SecurePass123!" | "weak" |
| Confirm Password | "SecurePass123!" | "Mismatch123!" |
| Terms | Checked | Unchecked |

### Browser Compatibility Checklist

| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome | Latest | ✓ | ✓ | Test |
| Firefox | Latest | ✓ | ✓ | Test |
| Safari | Latest | ✓ | ✓ | Test |
| Edge | Latest | ✓ | ✓ | Test |
| Mobile Safari | iOS 14+ | - | ✓ | Test |
| Chrome Mobile | Latest | - | ✓ | Test |

### Responsive Breakpoints

| Breakpoint | Width | Test Focus |
|------------|-------|------------|
| Mobile | < 640px | Stack layout, touch targets |
| Tablet | 640-1024px | Optimized spacing |
| Desktop | > 1024px | Full feature display |

### Accessibility Verification

| Criterion | Standard | Test Method |
|-----------|----------|-------------|
| Contrast Ratio | WCAG 4.5:1 | Color contrast checker |
| Keyboard Nav | WCAG 2.1 A | Manual keyboard test |
| Screen Reader | WCAG 2.1 AA | NVDA/JAWS test |
| Focus Indicators | WCAG 2.1 AA | Visual inspection |

### Error Message Verification

| Error Scenario | Expected Message | Location |
|----------------|------------------|----------|
| Empty email | "Email is required" | Below email field |
| Invalid email | "Please enter valid email" | Below email field |
| Empty phone | "Phone is required" | Below phone field |
| Invalid phone | "Please enter valid Sri Lankan mobile" | Below phone field |
| Short password | "Password must be at least 8 characters" | Below password field |
| Password mismatch | "Passwords do not match" | Below confirm field |
| Terms unchecked | "You must accept the terms" | Below checkbox |
| Email exists | "Email already registered" | Toast or field |
| Network error | "Network error. Please try again." | Toast |

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load | < 2s | Chrome DevTools |
| Form Submit | < 3s | Network tab |
| Validation | < 100ms | React DevTools |
| Animation | 60fps | Performance monitor |

### Expected Outcome
- Complete registration flow verified and working
- All validation scenarios tested
- Email and phone registration paths functional
- Error handling comprehensive
- Success flow smooth with proper redirects
- Responsive design verified
- Accessibility standards met
- All edge cases handled

### Verification Checklist
- [ ] Register page loads successfully at `/register`
- [ ] All form fields render correctly
- [ ] Email registration method works end-to-end
- [ ] Phone registration method works end-to-end
- [ ] Email input validation working
- [ ] Phone input validation and formatting working
- [ ] First name validation working (min 2 chars)
- [ ] Last name validation working (min 2 chars)
- [ ] Password requirements list updates real-time
- [ ] Password strength meter progresses correctly
- [ ] Confirm password matching validation working
- [ ] Terms checkbox validation working
- [ ] Terms links open correctly
- [ ] Form submission calls API correctly
- [ ] Loading state disables form during submission
- [ ] Success response stores tokens
- [ ] Success response updates user state
- [ ] Success toast notification displays
- [ ] Redirect to correct destination after success
- [ ] Error scenarios show appropriate messages
- [ ] Email exists error handled
- [ ] Phone exists error handled
- [ ] Network error handled with toast
- [ ] Login link navigates to `/login`
- [ ] Responsive design works on mobile
- [ ] Responsive design works on tablet
- [ ] Responsive design works on desktop
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] Screen reader compatibility verified
- [ ] Color contrast meets WCAG standards
- [ ] All test cases passed

---

## Summary

This document established the complete validation, submission, and verification infrastructure for the customer registration flow. It includes password requirements display, terms acceptance, comprehensive Zod validation schema with conditional email OR phone logic, form submission handling with loading states, registration API service integration, success handling with token storage and redirects, login navigation link, and thorough verification testing.

### Completed Tasks
1. ✓ Created password requirements list with real-time validation
2. ✓ Created terms checkbox with linked terms documents
3. ✓ Created Zod validation schema with conditional email/phone logic
4. ✓ Implemented form submission handler with loading states
5. ✓ Created register API service with error handling
6. ✓ Implemented registration success handling with redirects
7. ✓ Created login link component for existing users
8. ✓ Verified complete registration flow end-to-end

### Component Architecture

```
Register Flow Components
├── RegisterPage.tsx (from Doc 1)
├── RegisterForm.tsx (from Doc 1)
├── Input Fields (from Doc 1)
│   ├── EmailInput.tsx
│   ├── PhoneInput.tsx
│   ├── EmailPhoneToggle.tsx
│   ├── NameInputs.tsx (FirstName, LastName)
│   ├── PasswordInput.tsx
│   └── ConfirmPassword.tsx
├── Password Features (from Doc 1 & 2)
│   ├── PasswordStrength.tsx
│   └── PasswordRequirements.tsx
├── Terms & Links (Doc 2)
│   ├── TermsCheckbox.tsx
│   └── LoginLink.tsx
├── Validation (Doc 2)
│   └── registerSchema.ts
├── Service Layer (Doc 2)
│   └── registerService.ts
└── Submission Logic (Doc 2)
    ├── onSubmit handler
    └── handleRegistrationSuccess
```

### Registration Flow Summary

```
User Loads /register
    │
    ▼
Select Email or Phone Method
    │
    ├──→ Email Path
    │    ├── Enter email
    │    ├── Enter name
    │    ├── Enter password (with strength meter)
    │    ├── Confirm password
    │    ├── Accept terms
    │    └── Submit
    │
    └──→ Phone Path
         ├── Enter +94 phone (formatted)
         ├── Enter name
         ├── Enter password (with strength meter)
         ├── Confirm password
         ├── Accept terms
         └── Submit
              │
              ▼
         Validate with Zod Schema
              │
              ├──→ Invalid → Show Errors
              │
              ▼
         Call Register API
              │
              ├──→ Success
              │    ├── Store tokens
              │    ├── Update state
              │    ├── Show toast
              │    └── Redirect to /account
              │
              └──→ Error
                   ├── Show error toast
                   └── Re-enable form
```

### Next Steps
Proceed to [Group-C_Login-Flow](../Group-C_Login-Flow/) to implement customer login functionality with email/phone support, password validation, remember me option, and forgot password integration.
