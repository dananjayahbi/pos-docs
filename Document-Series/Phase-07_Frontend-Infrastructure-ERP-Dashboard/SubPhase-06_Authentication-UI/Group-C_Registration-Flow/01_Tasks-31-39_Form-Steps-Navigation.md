# Tasks 31-39: Form Steps and Navigation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** C - Registration Flow  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38, 39

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-40-46_Validation-Submission.md](02_Tasks-40-46_Validation-Submission.md)

---

## Document Overview

This document covers the creation of the multi-step registration flow for new tenants. It includes setting up the registration page route, creating comprehensive Zod validation schemas for all steps, building the RegisterForm component with four distinct steps (Business Info, Admin User, Contact Info, Plan Selection), implementing a visual step indicator, and adding navigation controls for moving between steps.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create Registration Page Route | Low | 15 min |
| 32 | Create Registration Form Schema | Medium | 40 min |
| 33 | Create Registration Form Component | Medium | 35 min |
| 34 | Create Step 1: Business Info | Medium | 30 min |
| 35 | Create Step 2: Admin User | Medium | 35 min |
| 36 | Create Step 3: Contact Info | Medium | 30 min |
| 37 | Create Step 4: Plan Selection | Medium | 30 min |
| 38 | Create Step Indicator Component | Low | 25 min |
| 39 | Add Step Navigation Buttons | Low | 20 min |

---

## Task 31: Create Registration Page Route

### Overview
Create the registration page route within the (auth) route group. This page serves as the entry point for new tenants to create their account in the LankaCommerce Cloud ERP system. The page uses the auth layout and displays the multi-step registration form component.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create register directory**
   - Navigate to `frontend/app/(auth)/` directory
   - Create new directory named `register`
   - This follows Next.js App Router convention for routes

2. **Create page component file**
   - Create `page.tsx` file inside `register/` directory
   - This file will be the registration page component

3. **Import required dependencies**
   - Import React types
   - Import Metadata type from Next.js
   - Import auth components (AuthCard, AuthHeading)
   - Import RegisterForm component (to be created in Task 33)

4. **Define page metadata**
   - Export metadata object with type `Metadata`
   - Set title to "Register"
   - Set description for SEO and clarity

5. **Create page component**
   - Define default export function `RegisterPage`
   - Return JSX structure using auth components
   - Keep component clean and focused

6. **Implement page structure**
   - Wrap RegisterForm in AuthCard component
   - Add AuthHeading with title and subtitle
   - Add link to login page below form

7. **Configure page styling**
   - Use existing auth layout for centering
   - No additional container needed (layout handles it)
   - Ensure consistent spacing with login page

### Page Structure

```
┌────────────────────────────────────────┐
│         [Auth Layout Header]           │
│                                        │
│    ┌──────────────────────────────┐   │
│    │    Create Your Account       │   │
│    │  Get started with LankaComm  │   │
│    │                              │   │
│    │  [Step Indicator]            │   │
│    │                              │   │
│    │  [Registration Form]         │   │
│    │  [Current Step Content]      │   │
│    │                              │   │
│    │  [Navigation Buttons]        │   │
│    │                              │   │
│    │  Already have an account?    │   │
│    │      [Login Link]            │   │
│    └──────────────────────────────┘   │
│                                        │
│         [Auth Layout Footer]           │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/register/page.tsx` | `/register` | Main registration page |

### Page Metadata

| Field | Value | Purpose |
|-------|-------|---------|
| title | "Register" | Browser tab title |
| description | "Create your LankaCommerce Cloud account" | SEO description |

### Expected Outcome
- Functional registration page accessible at `/register`
- Page uses auth layout with centered content
- Proper metadata for SEO
- Ready to receive RegisterForm component
- Consistent styling with login page

### Verification Checklist
- [ ] `frontend/app/(auth)/register/` directory created
- [ ] `frontend/app/(auth)/register/page.tsx` file created
- [ ] Metadata exported with title and description
- [ ] Page component structure implemented
- [ ] AuthCard and AuthHeading components used
- [ ] Login link added below form
- [ ] Page accessible at `/register` URL

---

## Task 32: Create Registration Form Schema

### Overview
Create comprehensive Zod validation schemas for the multi-step registration form. This task defines the structure and validation rules for all four registration steps: Business Info, Admin User, Contact Info, and Plan Selection. Each step has its own schema for progressive validation, and a master schema combines all steps for final submission.

### Dependencies
- Task 31: Create Registration Page Route

### Instructions

1. **Create register validation file**
   - Navigate to `frontend/lib/validations/` directory
   - Create `register.ts` file
   - This file will contain all registration schemas

2. **Import Zod library**
   - Import z from 'zod'
   - Import custom validation utilities if needed
   - Ensure Zod is installed in project dependencies

3. **Define Step 1 schema (Business Info)**
   - Create `businessInfoSchema` using `z.object()`
   - Define businessName field with validation
   - Define businessType field with enum validation
   - Define optional registrationNumber field

4. **Define Step 2 schema (Admin User)**
   - Create `adminUserSchema` using `z.object()`
   - Define firstName and lastName fields
   - Define email field with email validation
   - Define password field with strength requirements
   - Define confirmPassword field with match validation

5. **Define Step 3 schema (Contact Info)**
   - Create `contactInfoSchema` using `z.object()`
   - Define phone field with Sri Lankan format validation
   - Define optional address object with street, city, postal code
   - Define timezone field with default value

6. **Define Step 4 schema (Plan Selection)**
   - Create `planSelectionSchema` using `z.object()`
   - Define plan field with enum of available plans
   - Add validation for plan value

7. **Create master registration schema**
   - Combine all step schemas into `registerSchema`
   - Use `z.object()` to merge all fields
   - This schema validates the complete registration data

8. **Export TypeScript types**
   - Infer types from each schema
   - Export `BusinessInfoData`, `AdminUserData`, etc.
   - Export `RegisterFormData` for complete form

9. **Define business type enum**
   - Create array of business types
   - Include common options: Retail, Wholesale, Restaurant, Service
   - Make extensible for future types

10. **Define plan enum**
    - Create array of subscription plans
    - Include Starter, Professional, Enterprise
    - Match backend plan identifiers

### Schema Structure

#### Step 1: Business Info Schema

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| businessName | string | Yes | 2-100 characters |
| businessType | string | Yes | Must be valid business type |
| registrationNumber | string | No | If provided, must be valid format |

#### Step 2: Admin User Schema

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| firstName | string | Yes | 2-50 characters |
| lastName | string | Yes | 2-50 characters |
| email | string | Yes | Valid email format |
| password | string | Yes | Min 8 chars, uppercase, lowercase, number |
| confirmPassword | string | Yes | Must match password |

#### Step 3: Contact Info Schema

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| phone | string | Yes | Sri Lankan format (+94 XX XXX XXXX) |
| address | object | No | Optional address details |
| address.street | string | No | If address provided |
| address.city | string | No | If address provided |
| address.postalCode | string | No | If address provided |
| timezone | string | Yes | Default: Asia/Colombo |

#### Step 4: Plan Selection Schema

| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| plan | string | Yes | Must be valid plan type |

### Business Type Options

| Value | Display Name | Description |
|-------|--------------|-------------|
| retail | Retail | Retail stores and shops |
| wholesale | Wholesale | Wholesale distribution |
| restaurant | Restaurant | Food and beverage services |
| service | Service | Service-based businesses |
| manufacturing | Manufacturing | Production and manufacturing |
| ecommerce | E-commerce | Online-only businesses |

### Plan Options

| Plan | Features | Monthly Price |
|------|----------|---------------|
| starter | Basic features, 1 location | ₨ 5,000 |
| professional | Advanced features, 5 locations | ₨ 15,000 |
| enterprise | All features, unlimited locations | Custom |

### Password Validation Rules

```
Password Requirements:
├── Minimum length: 8 characters
├── Must contain: uppercase letter
├── Must contain: lowercase letter
├── Must contain: number
├── Optional: special character (for stronger password)
└── Must match confirmPassword field
```

### Phone Number Validation

```
Sri Lankan Phone Format:
├── Format: +94 XX XXX XXXX
├── Country code: +94 (required)
├── Area code: 2 digits
├── Number: 7 digits (with space formatting)
└── Examples:
    ├── +94 11 234 5678 (Colombo)
    ├── +94 77 123 4567 (Mobile)
    └── +94 81 222 3333 (Kandy)
```

### Schema Error Messages

| Field | Error Type | Message |
|-------|------------|---------|
| businessName | Required | "Business name is required" |
| businessName | Too short | "Business name must be at least 2 characters" |
| businessName | Too long | "Business name must not exceed 100 characters" |
| businessType | Required | "Please select a business type" |
| email | Required | "Email is required" |
| email | Invalid | "Please enter a valid email address" |
| password | Required | "Password is required" |
| password | Too short | "Password must be at least 8 characters" |
| password | Weak | "Password must contain uppercase, lowercase, and number" |
| confirmPassword | Mismatch | "Passwords do not match" |
| phone | Required | "Phone number is required" |
| phone | Invalid | "Please enter a valid Sri Lankan phone number" |
| plan | Required | "Please select a subscription plan" |

### Expected Outcome
- Complete validation schemas for all registration steps
- Type-safe form data structures
- Clear, user-friendly error messages
- Support for Sri Lankan phone format
- Password strength validation
- Plan and business type validation

### Verification Checklist
- [ ] `frontend/lib/validations/register.ts` file created
- [ ] businessInfoSchema defined with all fields
- [ ] adminUserSchema defined with password validation
- [ ] contactInfoSchema defined with phone validation
- [ ] planSelectionSchema defined
- [ ] Master registerSchema combines all steps
- [ ] TypeScript types exported for each schema
- [ ] Business type enum defined
- [ ] Plan enum defined
- [ ] Error messages are clear and helpful
- [ ] Password confirmation validation works
- [ ] Phone number format validation includes Sri Lankan format

---

## Task 33: Create Registration Form Component

### Overview
Create the main RegisterForm component that manages the multi-step registration flow. This component handles state management for the current step, form data persistence across steps, form submission, and orchestrates the rendering of individual step components and navigation controls.

### Dependencies
- Task 32: Create Registration Form Schema

### Instructions

1. **Create RegisterForm component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `RegisterForm.tsx` file
   - This will be the main registration form component

2. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import React Hook Form (useForm, FormProvider)
   - Import Zod resolver for validation
   - Import registration schemas from lib/validations
   - Import Card components from Shadcn/UI
   - Import step components (to be created in Tasks 34-37)

3. **Define component props interface**
   - Create interface for any props (if needed)
   - May include callback functions or configuration
   - Keep props minimal for initial version

4. **Initialize form with React Hook Form**
   - Use useForm hook with Zod resolver
   - Set default values for all form fields
   - Configure validation mode (onChange or onBlur)
   - Enable form state tracking

5. **Create step state management**
   - Use useState to track current step (1-4)
   - Initialize with step 1
   - Create functions to navigate steps

6. **Create step navigation functions**
   - Define nextStep function to advance
   - Define previousStep function to go back
   - Add validation before advancing
   - Ensure step boundaries (1-4)

7. **Create form data state**
   - Use form state from React Hook Form
   - Persist data across step changes
   - Maintain partial form data

8. **Implement step rendering logic**
   - Create conditional rendering based on currentStep
   - Render appropriate step component
   - Pass form control and field state to steps

9. **Structure component layout**
   - Wrap form in Card component
   - Add CardHeader with title and step indicator
   - Add CardContent with current step
   - Add CardFooter with navigation buttons

10. **Add form submission handler**
    - Create onSubmit function (implementation in Task 42)
    - Validate all steps before submission
    - Prepare final submission payload

11. **Add accessibility features**
    - Use semantic HTML (form element)
    - Add aria-labels for screen readers
    - Ensure keyboard navigation works
    - Add form submission prevention on Enter (except in last step)

### Component Structure

```
RegisterForm
├── FormProvider (React Hook Form context)
│   ├── Form element
│   │   ├── StepIndicator (Task 38)
│   │   │   ├── Step 1: Business Info
│   │   │   ├── Step 2: Admin User
│   │   │   ├── Step 3: Contact Info
│   │   │   └── Step 4: Plan Selection
│   │   │
│   │   ├── Current Step Content
│   │   │   ├── Step 1 Component (Task 34)
│   │   │   ├── Step 2 Component (Task 35)
│   │   │   ├── Step 3 Component (Task 36)
│   │   │   └── Step 4 Component (Task 37)
│   │   │
│   │   └── Navigation Buttons (Task 39)
│   │       ├── Previous Button
│   │       └── Next/Submit Button
│   │
│   └── Login Link (Task 45)
```

### Form State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| currentStep | number (1-4) | Tracks active step |
| formData | RegisterFormData | Stores all form values |
| isSubmitting | boolean | Tracks submission state |
| errors | object | Validation errors |

### Step Navigation Flow

```
Step 1 (Business Info)
        │
        ├─ Validate Step 1
        ↓
Step 2 (Admin User)
        │
        ├─ Validate Step 2
        ↓
Step 3 (Contact Info)
        │
        ├─ Validate Step 3
        ↓
Step 4 (Plan Selection)
        │
        ├─ Validate Step 4
        ↓
    Submit Form
```

### Form Default Values

| Field | Default Value | Reason |
|-------|---------------|--------|
| businessName | "" | Empty string |
| businessType | "" | User must select |
| registrationNumber | "" | Optional field |
| firstName | "" | Empty string |
| lastName | "" | Empty string |
| email | "" | Empty string |
| password | "" | Empty string |
| confirmPassword | "" | Empty string |
| phone | "+94 " | Sri Lankan prefix |
| timezone | "Asia/Colombo" | Sri Lankan timezone |
| plan | "" | User must select |

### Step Validation Logic

| Step | Fields to Validate | Action on Success |
|------|-------------------|-------------------|
| 1 | businessName, businessType | Enable Next button |
| 2 | firstName, lastName, email, password | Enable Next button |
| 3 | phone, timezone | Enable Next button |
| 4 | plan | Enable Submit button |

### Component Props

| Prop | Type | Optional | Description |
|------|------|----------|-------------|
| onSuccess | (data) => void | Yes | Callback after successful registration |
| redirectTo | string | Yes | Custom redirect URL after success |

### Form Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| mode | "onChange" | Validate as user types |
| reValidateMode | "onChange" | Re-validate on change |
| defaultValues | Object | Initial form state |
| resolver | zodResolver | Zod schema validation |

### Expected Outcome
- Functional multi-step form component
- State management for current step
- Form data persistence across steps
- Ready to integrate step components
- Navigation logic prepared
- Form validation configured

### Verification Checklist
- [ ] `frontend/components/auth/RegisterForm.tsx` file created
- [ ] React Hook Form initialized with Zod resolver
- [ ] currentStep state created and managed
- [ ] Step navigation functions implemented
- [ ] Default values set for all fields
- [ ] FormProvider wraps the form
- [ ] Conditional rendering for steps implemented
- [ ] Form structure uses Card components
- [ ] Form submission handler prepared
- [ ] Component exports correctly

---

## Task 34: Create Step 1: Business Info

### Overview
Create the Business Info step component that collects information about the tenant's business. This is the first step of the registration process and includes fields for business name, business type selection, and optional registration number. The component integrates with React Hook Form and uses Shadcn/UI components.

### Dependencies
- Task 33: Create Registration Form Component

### Instructions

1. **Create BusinessInfoStep component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `BusinessInfoStep.tsx` file
   - This component renders Step 1 fields

2. **Import required dependencies**
   - Import React
   - Import useFormContext from React Hook Form
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input, Select components from Shadcn/UI
   - Import businessInfoSchema from validations

3. **Define component props interface**
   - Accept form control from parent
   - Accept any additional configuration props
   - Keep interface simple and focused

4. **Access form context**
   - Use useFormContext hook to get form methods
   - Access control, formState, getValues
   - Enable field registration and validation

5. **Create business name input field**
   - Use FormField with name "businessName"
   - Add Input component with proper styling
   - Include label "Business Name"
   - Add placeholder text
   - Show validation errors below field

6. **Create business type select field**
   - Use FormField with name "businessType"
   - Add Select component from Shadcn/UI
   - Populate with business type options
   - Include label "Business Type"
   - Add placeholder "Select your business type"
   - Show validation errors below field

7. **Create registration number input field**
   - Use FormField with name "registrationNumber"
   - Add Input component
   - Include label "Business Registration Number (Optional)"
   - Add placeholder text
   - Mark as optional in UI
   - Show validation errors if applicable

8. **Add field descriptions**
   - Add helper text for each field
   - Explain business type selection
   - Note that registration number is optional
   - Provide examples where helpful

9. **Structure component layout**
   - Use consistent spacing between fields
   - Stack fields vertically
   - Ensure proper label-input association
   - Add appropriate margins and padding

10. **Add accessibility features**
    - Ensure proper label-input associations
    - Add aria-describedby for helper text
    - Include required/optional indicators
    - Test keyboard navigation

### Component Structure

```
BusinessInfoStep
├── Business Name Field
│   ├── Label: "Business Name *"
│   ├── Input: Text field
│   ├── Placeholder: "Enter your business name"
│   └── Error message (if invalid)
│
├── Business Type Field
│   ├── Label: "Business Type *"
│   ├── Select: Dropdown menu
│   ├── Placeholder: "Select your business type"
│   ├── Options:
│   │   ├── Retail
│   │   ├── Wholesale
│   │   ├── Restaurant
│   │   ├── Service
│   │   ├── Manufacturing
│   │   └── E-commerce
│   └── Error message (if invalid)
│
└── Registration Number Field
    ├── Label: "Business Registration Number (Optional)"
    ├── Input: Text field
    ├── Placeholder: "e.g., BRN123456789"
    └── Error message (if invalid)
```

### Field Specifications

#### Business Name

| Property | Value | Purpose |
|----------|-------|---------|
| Name | businessName | Form field identifier |
| Type | Text input | Free text entry |
| Required | Yes | Must be provided |
| Min Length | 2 characters | Prevent too short names |
| Max Length | 100 characters | Reasonable business name limit |
| Placeholder | "Enter your business name" | Guide user input |

#### Business Type

| Property | Value | Purpose |
|----------|-------|---------|
| Name | businessType | Form field identifier |
| Type | Select dropdown | Limited options |
| Required | Yes | Must be selected |
| Options | See Business Types table | Predefined choices |
| Placeholder | "Select your business type" | Guide user selection |

#### Registration Number

| Property | Value | Purpose |
|----------|-------|---------|
| Name | registrationNumber | Form field identifier |
| Type | Text input | Free text entry |
| Required | No | Optional field |
| Format | Alphanumeric | Business registration format |
| Placeholder | "e.g., BRN123456789" | Show format example |

### Business Types

| Value | Display Name | Icon Suggestion |
|-------|--------------|-----------------|
| retail | Retail | 🏪 Store icon |
| wholesale | Wholesale | 📦 Box icon |
| restaurant | Restaurant | 🍽️ Restaurant icon |
| service | Service | 🛠️ Tool icon |
| manufacturing | Manufacturing | 🏭 Factory icon |
| ecommerce | E-commerce | 🛒 Cart icon |

### Field Validation Messages

| Field | Error Type | Message |
|-------|------------|---------|
| businessName | Required | "Business name is required" |
| businessName | Too short | "Business name must be at least 2 characters" |
| businessName | Too long | "Business name must not exceed 100 characters" |
| businessType | Required | "Please select a business type" |
| registrationNumber | Invalid format | "Please enter a valid registration number" |

### Field Layout

```
┌─────────────────────────────────────┐
│  Business Name *                    │
│  ┌───────────────────────────────┐ │
│  │ Enter your business name      │ │
│  └───────────────────────────────┘ │
│                                     │
│  Business Type *                    │
│  ┌───────────────────────────────┐ │
│  │ Select your business type  ▼  │ │
│  └───────────────────────────────┘ │
│                                     │
│  Business Registration Number       │
│  (Optional)                         │
│  ┌───────────────────────────────┐ │
│  │ e.g., BRN123456789            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Helper Text

| Field | Helper Text |
|-------|-------------|
| businessName | "This will be displayed to your customers" |
| businessType | "Choose the category that best describes your business" |
| registrationNumber | "Enter your official business registration number if applicable" |

### Expected Outcome
- Functional Business Info step component
- All three fields properly connected to form
- Business type select with all options
- Proper validation and error messages
- Clean, user-friendly layout
- Accessible form fields

### Verification Checklist
- [ ] `frontend/components/auth/BusinessInfoStep.tsx` file created
- [ ] useFormContext hook used to access form
- [ ] Business name field implemented with validation
- [ ] Business type select field with all options
- [ ] Registration number field implemented (optional)
- [ ] All fields have proper labels
- [ ] Placeholder text added to all fields
- [ ] Error messages display correctly
- [ ] Required fields marked with asterisk
- [ ] Component properly exports
- [ ] Fields are accessible via keyboard

---

## Task 35: Create Step 2: Admin User

### Overview
Create the Admin User step component that collects information about the primary administrator account. This is the second step of the registration process and includes fields for first name, last name, email, password, and password confirmation. This step creates the first user account for the new tenant.

### Dependencies
- Task 34: Create Step 1: Business Info

### Instructions

1. **Create AdminUserStep component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `AdminUserStep.tsx` file
   - This component renders Step 2 fields

2. **Import required dependencies**
   - Import React and hooks (useState)
   - Import useFormContext from React Hook Form
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input, Button components from Shadcn/UI
   - Import Eye, EyeOff icons for password toggle
   - Import adminUserSchema from validations

3. **Access form context**
   - Use useFormContext hook
   - Get control, formState, watch methods
   - Enable field registration and validation

4. **Create first name input field**
   - Use FormField with name "firstName"
   - Add Input component
   - Include label "First Name"
   - Add placeholder text
   - Show validation errors

5. **Create last name input field**
   - Use FormField with name "lastName"
   - Add Input component
   - Include label "Last Name"
   - Add placeholder text
   - Show validation errors

6. **Create email input field**
   - Use FormField with name "email"
   - Add Input component with type "email"
   - Include label "Email Address"
   - Add placeholder "you@example.com"
   - Show validation errors

7. **Create password input field with toggle**
   - Use FormField with name "password"
   - Add Input component with dynamic type
   - Include show/hide password toggle button
   - Add label "Password"
   - Show validation errors
   - Display password requirements hint

8. **Create confirm password field**
   - Use FormField with name "confirmPassword"
   - Add Input component with dynamic type
   - Include show/hide toggle button
   - Add label "Confirm Password"
   - Show validation errors
   - Highlight if passwords don't match

9. **Implement password visibility toggle**
   - Create state for password visibility (showPassword)
   - Create state for confirm password visibility
   - Toggle between "password" and "text" input types
   - Use Eye/EyeOff icons in toggle button

10. **Add password strength indicator placeholder**
    - Reserve space for password strength component
    - Will be implemented in Task 40
    - Position below password field

11. **Add field descriptions**
    - Add helper text for email field
    - Display password requirements clearly
    - Note about password matching

### Component Structure

```
AdminUserStep
├── First Name Field
│   ├── Label: "First Name *"
│   ├── Input: Text field
│   └── Error message (if invalid)
│
├── Last Name Field
│   ├── Label: "Last Name *"
│   ├── Input: Text field
│   └── Error message (if invalid)
│
├── Email Field
│   ├── Label: "Email Address *"
│   ├── Input: Email field
│   ├── Helper text: "This will be your login email"
│   └── Error message (if invalid)
│
├── Password Field
│   ├── Label: "Password *"
│   ├── Input: Password field with toggle
│   ├── Toggle: Show/Hide button
│   ├── Helper text: Password requirements
│   ├── Password Strength Indicator (Task 40)
│   └── Error message (if invalid)
│
└── Confirm Password Field
    ├── Label: "Confirm Password *"
    ├── Input: Password field with toggle
    ├── Toggle: Show/Hide button
    └── Error message (if invalid)
```

### Field Specifications

#### First Name

| Property | Value | Purpose |
|----------|-------|---------|
| Name | firstName | Form field identifier |
| Type | Text input | Free text entry |
| Required | Yes | Must be provided |
| Min Length | 2 characters | Prevent single letters |
| Max Length | 50 characters | Reasonable name limit |
| Placeholder | "Enter your first name" | Guide user input |

#### Last Name

| Property | Value | Purpose |
|----------|-------|---------|
| Name | lastName | Form field identifier |
| Type | Text input | Free text entry |
| Required | Yes | Must be provided |
| Min Length | 2 characters | Prevent single letters |
| Max Length | 50 characters | Reasonable name limit |
| Placeholder | "Enter your last name" | Guide user input |

#### Email

| Property | Value | Purpose |
|----------|-------|---------|
| Name | email | Form field identifier |
| Type | Email input | Email-specific validation |
| Required | Yes | Must be provided |
| Format | Valid email | Standard email format |
| Placeholder | "you@example.com" | Show email format |

#### Password

| Property | Value | Purpose |
|----------|-------|---------|
| Name | password | Form field identifier |
| Type | Password/Text (toggled) | Secure input |
| Required | Yes | Must be provided |
| Min Length | 8 characters | Security requirement |
| Validation | See Password Rules | Strength validation |
| Toggle | Show/Hide | User can view password |

#### Confirm Password

| Property | Value | Purpose |
|----------|-------|---------|
| Name | confirmPassword | Form field identifier |
| Type | Password/Text (toggled) | Secure input |
| Required | Yes | Must be provided |
| Validation | Must match password | Prevent typos |
| Toggle | Show/Hide | User can view password |

### Password Requirements

```
Password must contain:
├── Minimum 8 characters
├── At least one uppercase letter (A-Z)
├── At least one lowercase letter (a-z)
├── At least one number (0-9)
└── Optional: Special character (!@#$%^&*)
```

### Password Validation Messages

| Field | Error Type | Message |
|-------|------------|---------|
| password | Required | "Password is required" |
| password | Too short | "Password must be at least 8 characters" |
| password | No uppercase | "Password must contain at least one uppercase letter" |
| password | No lowercase | "Password must contain at least one lowercase letter" |
| password | No number | "Password must contain at least one number" |
| confirmPassword | Required | "Please confirm your password" |
| confirmPassword | Mismatch | "Passwords do not match" |

### Field Layout

```
┌─────────────────────────────────────┐
│  First Name *          Last Name *  │
│  ┌──────────────┐    ┌───────────┐ │
│  │ Enter first  │    │ Enter last│ │
│  └──────────────┘    └───────────┘ │
│                                     │
│  Email Address *                    │
│  ┌───────────────────────────────┐ │
│  │ you@example.com               │ │
│  └───────────────────────────────┘ │
│  This will be your login email      │
│                                     │
│  Password *                         │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••            [👁]    │ │
│  └───────────────────────────────┘ │
│  Min 8 chars, uppercase, lowercase, │
│  and number required                │
│  [Password Strength Indicator]      │
│                                     │
│  Confirm Password *                 │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••            [👁]    │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Password Toggle Implementation

| State | Input Type | Icon | Purpose |
|-------|------------|------|---------|
| Hidden | "password" | 👁️ Eye | Password masked |
| Visible | "text" | 👁️‍🗨️ EyeOff | Password visible |

### Form Layout Patterns

#### Two-Column Layout (Name Fields)
- First Name and Last Name side by side
- Uses grid layout (md:grid-cols-2)
- Stacks vertically on mobile
- Equal column widths

#### Single Column Layout (Other Fields)
- Email, Password, Confirm Password full width
- Better readability for longer fields
- Consistent with login form

### Helper Text

| Field | Helper Text |
|-------|-------------|
| email | "This will be your login email address" |
| password | "Must be at least 8 characters with uppercase, lowercase, and number" |
| confirmPassword | "Re-enter your password to confirm" |

### Expected Outcome
- Functional Admin User step component
- All five fields properly connected to form
- Password visibility toggle working
- Name fields in two-column layout
- Proper validation and error messages
- Space reserved for password strength indicator
- Clean, user-friendly layout

### Verification Checklist
- [ ] `frontend/components/auth/AdminUserStep.tsx` file created
- [ ] useFormContext hook used
- [ ] First name field implemented
- [ ] Last name field implemented
- [ ] Email field implemented with email type
- [ ] Password field with show/hide toggle
- [ ] Confirm password field with show/hide toggle
- [ ] Password visibility toggle functions work
- [ ] All fields have proper labels
- [ ] Error messages display correctly
- [ ] Password requirements displayed
- [ ] Name fields in two-column layout on desktop
- [ ] Fields are accessible via keyboard

---

## Task 36: Create Step 3: Contact Info

### Overview
Create the Contact Info step component that collects the tenant's contact details and location information. This is the third step of the registration process and includes fields for phone number (with Sri Lankan format), optional address details, and timezone selection with Asia/Colombo as the default.

### Dependencies
- Task 35: Create Step 2: Admin User

### Instructions

1. **Create ContactInfoStep component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `ContactInfoStep.tsx` file
   - This component renders Step 3 fields

2. **Import required dependencies**
   - Import React
   - Import useFormContext from React Hook Form
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Input, Select components from Shadcn/UI
   - Import contactInfoSchema from validations

3. **Access form context**
   - Use useFormContext hook
   - Get control, formState methods
   - Enable field registration and validation

4. **Create phone number input field**
   - Use FormField with name "phone"
   - Add Input component with type "tel"
   - Include label "Phone Number"
   - Pre-fill with "+94 " (Sri Lankan code)
   - Add placeholder for format guidance
   - Show validation errors

5. **Add phone number formatting helper**
   - Display expected format below field
   - Show example: "+94 77 123 4567"
   - Note about mobile and landline formats

6. **Create address section**
   - Add section heading "Business Address (Optional)"
   - Group address fields together
   - Make entire section optional

7. **Create street address field**
   - Use FormField with name "address.street"
   - Add Input component
   - Include label "Street Address"
   - Add placeholder text
   - Make optional

8. **Create city field**
   - Use FormField with name "address.city"
   - Add Input component
   - Include label "City"
   - Add placeholder text
   - Make optional

9. **Create postal code field**
   - Use FormField with name "address.postalCode"
   - Add Input component
   - Include label "Postal Code"
   - Add placeholder text (Sri Lankan format)
   - Make optional

10. **Create timezone select field**
    - Use FormField with name "timezone"
    - Add Select component
    - Include label "Timezone"
    - Default to "Asia/Colombo"
    - Include common Sri Lankan and neighboring timezones
    - Show validation errors

11. **Add field descriptions**
    - Explain phone format requirements
    - Note that address is optional
    - Explain timezone importance for reports

### Component Structure

```
ContactInfoStep
├── Phone Number Field
│   ├── Label: "Phone Number *"
│   ├── Input: Tel field (starts with +94)
│   ├── Helper text: Format example
│   └── Error message (if invalid)
│
├── Address Section (Optional)
│   ├── Section heading: "Business Address (Optional)"
│   │
│   ├── Street Address Field
│   │   ├── Label: "Street Address"
│   │   ├── Input: Text field
│   │   └── Error message (if invalid)
│   │
│   ├── City Field
│   │   ├── Label: "City"
│   │   ├── Input: Text field
│   │   └── Error message (if invalid)
│   │
│   └── Postal Code Field
│       ├── Label: "Postal Code"
│       ├── Input: Text field
│       └── Error message (if invalid)
│
└── Timezone Field
    ├── Label: "Timezone *"
    ├── Select: Dropdown menu
    ├── Default: "Asia/Colombo"
    └── Error message (if invalid)
```

### Field Specifications

#### Phone Number

| Property | Value | Purpose |
|----------|-------|---------|
| Name | phone | Form field identifier |
| Type | Tel input | Phone-specific input |
| Required | Yes | Must be provided |
| Format | +94 XX XXX XXXX | Sri Lankan format |
| Default | "+94 " | Country code pre-filled |
| Placeholder | "+94 77 123 4567" | Show complete example |

#### Street Address

| Property | Value | Purpose |
|----------|-------|---------|
| Name | address.street | Nested field |
| Type | Text input | Free text entry |
| Required | No | Optional field |
| Max Length | 200 characters | Reasonable address limit |
| Placeholder | "e.g., No. 123, Main Street" | Show Sri Lankan format |

#### City

| Property | Value | Purpose |
|----------|-------|---------|
| Name | address.city | Nested field |
| Type | Text input | Free text entry |
| Required | No | Optional field |
| Max Length | 50 characters | City name limit |
| Placeholder | "e.g., Colombo, Kandy, Galle" | Show Sri Lankan cities |

#### Postal Code

| Property | Value | Purpose |
|----------|-------|---------|
| Name | address.postalCode | Nested field |
| Type | Text input | Free text entry |
| Required | No | Optional field |
| Format | XXXXX | 5-digit Sri Lankan format |
| Placeholder | "e.g., 10400" | Show example |

#### Timezone

| Property | Value | Purpose |
|----------|-------|---------|
| Name | timezone | Form field identifier |
| Type | Select dropdown | Limited options |
| Required | Yes | Must be selected |
| Default | "Asia/Colombo" | Sri Lankan timezone |
| Options | See Timezone table | Common timezones |

### Sri Lankan Phone Formats

| Type | Format | Example |
|------|--------|---------|
| Colombo Landline | +94 11 XXX XXXX | +94 11 234 5678 |
| Other Landline | +94 XX XXX XXXX | +94 81 222 3333 |
| Mobile | +94 7X XXX XXXX | +94 77 123 4567 |

### Timezone Options

| Value | Display Name | UTC Offset |
|-------|--------------|------------|
| Asia/Colombo | Sri Lanka Time (Asia/Colombo) | UTC+5:30 |
| Asia/Kolkata | India Time (Asia/Kolkata) | UTC+5:30 |
| Asia/Dhaka | Bangladesh Time (Asia/Dhaka) | UTC+6:00 |
| Asia/Dubai | UAE Time (Asia/Dubai) | UTC+4:00 |
| UTC | Coordinated Universal Time | UTC+0:00 |

### Field Validation Messages

| Field | Error Type | Message |
|-------|------------|---------|
| phone | Required | "Phone number is required" |
| phone | Invalid format | "Please enter a valid Sri Lankan phone number (+94 XX XXX XXXX)" |
| address.street | Too long | "Street address must not exceed 200 characters" |
| address.city | Too long | "City name must not exceed 50 characters" |
| address.postalCode | Invalid | "Please enter a valid 5-digit postal code" |
| timezone | Required | "Please select your timezone" |

### Field Layout

```
┌─────────────────────────────────────┐
│  Phone Number *                     │
│  ┌───────────────────────────────┐ │
│  │ +94 77 123 4567               │ │
│  └───────────────────────────────┘ │
│  Format: +94 XX XXX XXXX            │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  Business Address (Optional)        │
│                                     │
│  Street Address                     │
│  ┌───────────────────────────────┐ │
│  │ No. 123, Main Street          │ │
│  └───────────────────────────────┘ │
│                                     │
│  City                               │
│  ┌───────────────────────────────┐ │
│  │ Colombo                       │ │
│  └───────────────────────────────┘ │
│                                     │
│  Postal Code                        │
│  ┌───────────────────────────────┐ │
│  │ 10400                         │ │
│  └───────────────────────────────┘ │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  Timezone *                         │
│  ┌───────────────────────────────┐ │
│  │ Asia/Colombo              ▼   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Section Styling

| Section | Visual Treatment |
|---------|------------------|
| Phone Number | Standard field |
| Address Section | Light background, grouped with border |
| Timezone | Standard field |

### Helper Text

| Field | Helper Text |
|-------|-------------|
| phone | "Format: +94 XX XXX XXXX (e.g., +94 77 123 4567)" |
| address section | "Providing your business address helps with location-based features" |
| timezone | "Used for scheduling, reports, and time-based features" |

### Sri Lankan Context

#### Major Cities
- Colombo (10400)
- Kandy (20000)
- Galle (80000)
- Jaffna (40000)
- Negombo (11500)

#### Common Area Codes
- 011: Colombo
- 081: Kandy
- 091: Galle
- 021: Jaffna
- 031: Negombo

### Expected Outcome
- Functional Contact Info step component
- Phone field with Sri Lankan format validation
- Optional address fields grouped together
- Timezone selector with appropriate options
- Proper validation and error messages
- Clean, organized layout

### Verification Checklist
- [ ] `frontend/components/auth/ContactInfoStep.tsx` file created
- [ ] useFormContext hook used
- [ ] Phone number field implemented with "+94" prefix
- [ ] Phone format validation working
- [ ] Street address field implemented (optional)
- [ ] City field implemented (optional)
- [ ] Postal code field implemented (optional)
- [ ] Address fields grouped with heading
- [ ] Timezone select field implemented
- [ ] Default timezone set to "Asia/Colombo"
- [ ] All fields have proper labels
- [ ] Helper text added
- [ ] Error messages display correctly
- [ ] Fields are accessible via keyboard

---

## Task 37: Create Step 4: Plan Selection

### Overview
Create the Plan Selection step component that allows new tenants to choose their subscription plan. This is the final step of the registration process and displays available plans (Starter, Professional, Enterprise) with their features, pricing, and selection mechanism. The component uses a card-based layout for visual comparison.

### Dependencies
- Task 36: Create Step 3: Contact Info

### Instructions

1. **Create PlanSelectionStep component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `PlanSelectionStep.tsx` file
   - This component renders Step 4 content

2. **Import required dependencies**
   - Import React
   - Import useFormContext from React Hook Form
   - Import FormField, FormItem, FormLabel, FormControl, FormMessage
   - Import Card, CardHeader, CardContent components from Shadcn/UI
   - Import Button or RadioGroup for selection
   - Import planSelectionSchema from validations

3. **Access form context**
   - Use useFormContext hook
   - Get control, formState, setValue, watch methods
   - Enable field registration and validation

4. **Define plan data structure**
   - Create array of plan objects
   - Include plan details: id, name, price, features
   - Keep data in component or separate constants file

5. **Create plan selection field**
   - Use FormField with name "plan"
   - Use RadioGroup or custom card selection
   - Allow only one plan selection
   - Show validation errors

6. **Create plan card component**
   - Design card layout for each plan
   - Show plan name prominently
   - Display monthly price in LKR
   - List key features with checkmarks
   - Add selection indicator

7. **Implement Starter plan card**
   - Name: "Starter"
   - Price: ₨ 5,000/month
   - Features: Basic features, 1 location, 2 users, Email support
   - Target: Small businesses

8. **Implement Professional plan card**
   - Name: "Professional"
   - Price: ₨ 15,000/month
   - Features: Advanced features, 5 locations, 10 users, Priority support
   - Target: Growing businesses
   - Mark as "Most Popular" (optional badge)

9. **Implement Enterprise plan card**
   - Name: "Enterprise"
   - Price: Custom pricing
   - Features: All features, Unlimited locations, Unlimited users, Dedicated support
   - Target: Large businesses
   - Add "Contact Sales" note

10. **Add plan selection logic**
    - Handle card click to select plan
    - Update form field value
    - Show visual feedback for selected plan
    - Ensure only one plan selected at a time

11. **Add plan comparison layout**
    - Display plans in a grid (3 columns on desktop)
    - Stack vertically on mobile
    - Ensure equal card heights
    - Add responsive spacing

12. **Add additional information**
    - Note about plan changes after registration
    - Link to full pricing page (optional)
    - Trial period information if applicable

### Component Structure

```
PlanSelectionStep
├── Section Header
│   ├── Title: "Choose Your Plan"
│   └── Description: "Select the plan that fits your business"
│
├── Plan Grid (FormField: "plan")
│   ├── Starter Plan Card
│   │   ├── Plan Badge (if any)
│   │   ├── Plan Name
│   │   ├── Price Display
│   │   ├── Feature List
│   │   └── Selection Indicator
│   │
│   ├── Professional Plan Card
│   │   ├── "Most Popular" Badge
│   │   ├── Plan Name
│   │   ├── Price Display
│   │   ├── Feature List
│   │   └── Selection Indicator
│   │
│   └── Enterprise Plan Card
│       ├── Plan Badge (if any)
│       ├── Plan Name
│       ├── Price Display
│       ├── Feature List
│       └── Selection Indicator
│
├── Additional Info
│   ├── Note about plan changes
│   └── Link to pricing details
│
└── Error message (if no plan selected)
```

### Plan Specifications

#### Starter Plan

| Attribute | Value | Purpose |
|-----------|-------|---------|
| ID | "starter" | Form value |
| Name | "Starter" | Display name |
| Price | "₨ 5,000/month" | Monthly cost |
| Target | "Perfect for small businesses" | Audience |
| Features | See Features table | Plan capabilities |

**Starter Features:**
- 1 business location
- 2 user accounts
- Basic inventory management
- Sales and invoicing
- Basic reports
- Email support
- Mobile app access

#### Professional Plan

| Attribute | Value | Purpose |
|-----------|-------|---------|
| ID | "professional" | Form value |
| Name | "Professional" | Display name |
| Price | "₨ 15,000/month" | Monthly cost |
| Badge | "Most Popular" | Recommendation |
| Target | "Ideal for growing businesses" | Audience |
| Features | See Features table | Plan capabilities |

**Professional Features:**
- 5 business locations
- 10 user accounts
- Advanced inventory management
- Sales and invoicing
- Advanced reports and analytics
- Priority email & phone support
- Mobile app access
- API access
- Multi-currency support

#### Enterprise Plan

| Attribute | Value | Purpose |
|-----------|-------|---------|
| ID | "enterprise" | Form value |
| Name | "Enterprise" | Display name |
| Price | "Custom Pricing" | Contact for quote |
| Target | "Built for large businesses" | Audience |
| Features | See Features table | Plan capabilities |
| Note | "Contact sales for pricing" | Call to action |

**Enterprise Features:**
- Unlimited locations
- Unlimited users
- All features included
- Custom integrations
- Dedicated account manager
- 24/7 phone & email support
- SLA guarantee
- Custom training
- White-label options

### Plan Card Layout

```
┌─────────────────────────────────┐
│  [BADGE: Most Popular]          │
│                                 │
│  Professional                   │
│  ₨ 15,000/month                 │
│                                 │
│  ✓ 5 business locations         │
│  ✓ 10 user accounts             │
│  ✓ Advanced inventory           │
│  ✓ Advanced reports             │
│  ✓ Priority support             │
│  ✓ Mobile app access            │
│  ✓ API access                   │
│                                 │
│  [●] Selected                   │
│  or                             │
│  [ ] Select This Plan           │
└─────────────────────────────────┘
```

### Plan Grid Layout

```
Desktop (3 columns):
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Starter │  │  Prof.  │  │  Enter. │
│  Plan   │  │  Plan   │  │  Plan   │
└─────────┘  └─────────┘  └─────────┘

Tablet (2 columns):
┌─────────┐  ┌─────────┐
│ Starter │  │  Prof.  │
└─────────┘  └─────────┘
┌─────────┐
│  Enter. │
└─────────┘

Mobile (1 column):
┌─────────┐
│ Starter │
└─────────┘
┌─────────┐
│  Prof.  │
└─────────┘
┌─────────┐
│  Enter. │
└─────────┘
```

### Selection States

| State | Visual Indicator | Behavior |
|-------|------------------|----------|
| Unselected | Gray border, white background | Clickable to select |
| Hovered | Blue border, slight shadow | Shows interactivity |
| Selected | Blue border, blue accent, checkmark | Shows current selection |
| Disabled | Grayed out, cursor not-allowed | Cannot select (if applicable) |

### Plan Card Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Card | `border rounded-lg p-6` | Container |
| Card (selected) | `border-blue-600 border-2` | Selection highlight |
| Plan name | `text-2xl font-bold` | Emphasis |
| Price | `text-3xl font-bold text-blue-600` | Highlight cost |
| Features list | `space-y-2` | Vertical spacing |
| Feature item | `flex items-start` | Icon alignment |
| Checkmark | `text-green-500` | Feature indicator |
| Badge | `bg-blue-600 text-white px-3 py-1 rounded-full` | Popular indicator |

### Feature List Icons

| Feature Status | Icon | Color |
|----------------|------|-------|
| Included | ✓ Checkmark | Green |
| Not Included | ✗ X-mark | Gray (if showing) |
| Unlimited | ∞ Infinity | Blue |

### Field Validation

| Validation | Rule | Message |
|------------|------|---------|
| Required | Must select a plan | "Please select a subscription plan" |

### Additional Information Text

| Info Type | Text |
|-----------|------|
| Change plans | "You can upgrade or downgrade your plan at any time after registration" |
| Trial | "All plans include a 14-day free trial" (if applicable) |
| Pricing details | "View detailed pricing and features →" (link to pricing page) |

### Expected Outcome
- Functional Plan Selection step component
- Three plan cards with clear information
- Visual selection mechanism
- Responsive grid layout
- Clear pricing in Sri Lankan Rupees
- Feature comparison at a glance
- Professional plan recommended

### Verification Checklist
- [ ] `frontend/components/auth/PlanSelectionStep.tsx` file created
- [ ] useFormContext hook used
- [ ] Plan data structure defined
- [ ] Starter plan card implemented
- [ ] Professional plan card implemented with "Most Popular" badge
- [ ] Enterprise plan card implemented
- [ ] Plan selection logic working
- [ ] Only one plan can be selected at a time
- [ ] Selected plan visually highlighted
- [ ] Grid layout responsive (3/2/1 columns)
- [ ] All features listed for each plan
- [ ] Pricing displayed in LKR (₨)
- [ ] Error message shows if no plan selected
- [ ] Cards are clickable and accessible via keyboard

---

## Task 38: Create Step Indicator Component

### Overview
Create a reusable StepIndicator component that visually displays the current step in the multi-step registration process. This component shows all four steps with visual indicators for completed, current, and upcoming steps, helping users understand their progress through the registration flow.

### Dependencies
- Task 33: Create Registration Form Component

### Instructions

1. **Create StepIndicator component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `StepIndicator.tsx` file
   - This component will be reusable for any multi-step form

2. **Import required dependencies**
   - Import React
   - Import Check icon for completed steps
   - Import cn utility for conditional styling
   - Import any required Shadcn/UI components

3. **Define component props interface**
   - Accept currentStep prop (number 1-4)
   - Accept totalSteps prop (default 4)
   - Accept optional step labels array
   - Accept optional className prop

4. **Define step data structure**
   - Create array of step objects
   - Include step number, label, description
   - Keep data in component or accept as props

5. **Create step data for registration**
   - Step 1: "Business Info" / "Your business details"
   - Step 2: "Admin User" / "Create admin account"
   - Step 3: "Contact Info" / "Contact details"
   - Step 4: "Plan Selection" / "Choose your plan"

6. **Implement step rendering logic**
   - Map through steps array
   - Determine status for each step (completed, current, upcoming)
   - Render appropriate visual indicator

7. **Create step circle indicator**
   - Show checkmark for completed steps
   - Show step number for current/upcoming steps
   - Apply different styling based on status

8. **Create connecting lines between steps**
   - Render lines between step circles
   - Style completed segments differently
   - Hide line after last step

9. **Add step labels**
   - Display step label below circle
   - Show step description (optional)
   - Style based on step status

10. **Implement responsive design**
    - Horizontal layout on desktop
    - Consider vertical or simplified layout on mobile
    - Ensure readability at all screen sizes

11. **Add accessibility features**
    - Use semantic HTML
    - Add aria-label for current step
    - Add aria-current="step" for active step
    - Ensure proper color contrast

### Component Structure

```
StepIndicator
├── Steps Container (flex horizontal)
│   ├── Step 1
│   │   ├── Circle Indicator
│   │   │   ├── Checkmark (if completed)
│   │   │   └── Number (if current/upcoming)
│   │   ├── Connecting Line →
│   │   ├── Label: "Business Info"
│   │   └── Description: "Your business details"
│   │
│   ├── Step 2
│   │   ├── Circle Indicator
│   │   ├── Connecting Line →
│   │   ├── Label: "Admin User"
│   │   └── Description: "Create admin account"
│   │
│   ├── Step 3
│   │   ├── Circle Indicator
│   │   ├── Connecting Line →
│   │   ├── Label: "Contact Info"
│   │   └── Description: "Contact details"
│   │
│   └── Step 4
│       ├── Circle Indicator
│       ├── Label: "Plan Selection"
│       └── Description: "Choose your plan"
```

### Step States

| State | Circle Style | Number/Icon | Line Style | Label Style |
|-------|-------------|-------------|------------|-------------|
| Completed | Blue filled | White checkmark | Blue solid | Blue text |
| Current | Blue border, white bg | Blue number | Gray dashed | Black bold text |
| Upcoming | Gray border, white bg | Gray number | Gray dashed | Gray text |

### Visual Representation

```
Completed      Current       Upcoming      Upcoming
   [✓]---------> [2]- - - - - [3]- - - - - [4]
 Business      Admin        Contact       Plan
   Info         User         Info       Selection
```

### Step Indicator Styling

#### Circle Indicator

| State | Size | Background | Border | Icon/Number Color |
|-------|------|------------|--------|-------------------|
| Completed | 40px | Blue (bg-blue-600) | None | White |
| Current | 40px | White | Blue 2px | Blue |
| Upcoming | 40px | White | Gray 2px | Gray |

#### Connecting Line

| State | Height | Color | Style |
|-------|--------|-------|-------|
| Completed | 2px | Blue | Solid |
| Upcoming | 2px | Gray | Dashed |

#### Label Text

| State | Font Size | Font Weight | Color |
|-------|-----------|-------------|-------|
| Completed | sm | medium | Blue |
| Current | sm | bold | Black |
| Upcoming | sm | normal | Gray |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| currentStep | number | Yes | - | Current active step (1-4) |
| totalSteps | number | No | 4 | Total number of steps |
| steps | Step[] | No | registration steps | Custom step definitions |
| className | string | No | "" | Additional CSS classes |

### Step Interface

| Property | Type | Description |
|----------|------|-------------|
| number | number | Step number (1-4) |
| label | string | Step label (e.g., "Business Info") |
| description | string | Step description (optional) |

### Layout Patterns

#### Desktop Layout (Horizontal)
```
[1]───────[2]───────[3]───────[4]
Business  Admin    Contact    Plan
  Info    User     Info    Selection
```

#### Mobile Layout (Compact Horizontal)
```
[1]──[2]──[3]──[4]
```

Or

#### Mobile Layout (Vertical)
```
[1] Business Info
│
[2] Admin User
│
[3] Contact Info
│
[4] Plan Selection
```

### Status Determination Logic

```
For each step:
  If step.number < currentStep:
    status = "completed"
  Else if step.number === currentStep:
    status = "current"
  Else:
    status = "upcoming"
```

### Accessibility Attributes

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| Container | role | "navigation" | Semantic meaning |
| Container | aria-label | "Registration progress" | Screen reader label |
| Current step | aria-current | "step" | Indicates current |
| Step | aria-label | "Step X: [Label]" | Descriptive label |

### Responsive Breakpoints

| Screen Size | Layout | Changes |
|-------------|--------|---------|
| Desktop (≥768px) | Horizontal, full labels | Show all text |
| Tablet (≥640px) | Horizontal, labels | Smaller spacing |
| Mobile (<640px) | Compact horizontal or vertical | Hide descriptions, smaller circles |

### Expected Outcome
- Functional step indicator component
- Clear visual representation of progress
- Shows completed, current, and upcoming steps
- Responsive design for all screen sizes
- Accessible to screen readers and keyboard users
- Reusable for other multi-step forms

### Verification Checklist
- [ ] `frontend/components/auth/StepIndicator.tsx` file created
- [ ] Component accepts currentStep prop
- [ ] Step data defined for registration steps
- [ ] Completed steps show checkmark
- [ ] Current step highlighted
- [ ] Upcoming steps styled differently
- [ ] Connecting lines between steps
- [ ] Step labels displayed
- [ ] Responsive layout implemented
- [ ] Aria attributes added for accessibility
- [ ] Component properly exports

---

## Task 39: Add Step Navigation Buttons

### Overview
Add navigation buttons to the RegisterForm component that allow users to move between steps. This includes a "Previous" button to go back, a "Next" button to advance after validation, and a "Submit" button on the final step. The buttons include proper enabling/disabling logic based on form validation and current step.

### Dependencies
- Task 38: Create Step Indicator Component

### Instructions

1. **Locate button placement in RegisterForm**
   - Navigate to `frontend/components/auth/RegisterForm.tsx`
   - Identify footer area of the form card
   - Plan button layout (left: Previous, right: Next/Submit)

2. **Import required components**
   - Import Button component from Shadcn/UI
   - Import Loader2 icon for loading states
   - Import ArrowLeft, ArrowRight icons (optional)

3. **Create navigation button container**
   - Add container div in form footer
   - Use flexbox for layout (justify-between)
   - Ensure proper spacing and alignment

4. **Implement Previous button**
   - Add button with "Previous" text
   - Set type="button" (not submit)
   - Call previousStep function on click
   - Disable on first step
   - Add left arrow icon (optional)

5. **Implement Next button**
   - Add button with "Next" text
   - Set type="button" (not submit)
   - Call nextStep function on click
   - Hide on last step
   - Validate current step before advancing
   - Add right arrow icon (optional)

6. **Implement Submit button**
   - Add button with "Create Account" text
   - Set type="submit"
   - Show only on last step (step 4)
   - Disable when form is invalid or submitting
   - Show loading spinner when submitting

7. **Add step validation before Next**
   - Trigger validation for current step fields
   - Check if current step is valid
   - Show errors if validation fails
   - Only advance if validation passes

8. **Implement button enabling logic**
   - Previous: disabled on step 1
   - Next: disabled if current step invalid
   - Submit: disabled if any step invalid or isSubmitting

9. **Add loading states**
   - Disable all buttons during submission
   - Show spinner on Submit button
   - Prevent navigation during submission

10. **Add button styling**
    - Previous: secondary or outline variant
    - Next: primary variant
    - Submit: primary variant
    - Ensure proper sizing and spacing

11. **Add keyboard support**
    - Enable Tab navigation between buttons
    - Support Enter key for Next/Submit
    - Support Escape key to cancel (optional)

### Button Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│  [Current Step Content]             │
│                                     │
│─────────────────────────────────────│
│                                     │
│  [Previous]              [Next →]   │
│  or                      or         │
│  [Previous]      [Create Account]   │
│                                     │
└─────────────────────────────────────┘
```

### Button States by Step

| Step | Previous Button | Next/Submit Button |
|------|-----------------|--------------------|
| 1 | Disabled/Hidden | "Next" (enabled if valid) |
| 2 | "Previous" (enabled) | "Next" (enabled if valid) |
| 3 | "Previous" (enabled) | "Next" (enabled if valid) |
| 4 | "Previous" (enabled) | "Create Account" (enabled if valid) |

### Button Specifications

#### Previous Button

| Property | Value | Purpose |
|----------|-------|---------|
| Type | "button" | Prevent form submission |
| Variant | "outline" or "secondary" | Visual hierarchy |
| Text | "Previous" or "← Previous" | Clear action |
| onClick | previousStep() | Navigate back |
| Disabled | currentStep === 1 | Can't go before step 1 |
| Visibility | Hidden on step 1 (optional) | Cleaner UI |

#### Next Button

| Property | Value | Purpose |
|----------|-------|---------|
| Type | "button" | Prevent form submission |
| Variant | "default" or "primary" | Primary action |
| Text | "Next" or "Next →" | Clear action |
| onClick | handleNext() | Validate & advance |
| Disabled | Current step invalid | Enforce validation |
| Visibility | Hidden on step 4 | Show Submit instead |

#### Submit Button

| Property | Value | Purpose |
|----------|-------|---------|
| Type | "submit" | Trigger form submission |
| Variant | "default" or "primary" | Primary action |
| Text | "Create Account" | Clear action |
| Disabled | Form invalid or isSubmitting | Prevent invalid submission |
| Loading | isSubmitting | Show spinner |
| Visibility | Show only on step 4 | Final step action |

### Validation Logic for Next Button

```
Current Step Validation:
├── Step 1: Validate businessName, businessType
├── Step 2: Validate firstName, lastName, email, password, confirmPassword
├── Step 3: Validate phone, timezone
└── Step 4: Validate plan

If current step valid:
  → Enable Next button
  → On click: advance to next step
Else:
  → Disable Next button
  → Show validation errors
```

### Button Interaction Flow

```
Step 1:
  No Previous button (or disabled)
  Next button validates Step 1
  If valid → move to Step 2

Step 2-3:
  Previous button → go back (no validation)
  Next button validates current step
  If valid → move to next step

Step 4:
  Previous button → go back to Step 3
  No Next button
  Submit button validates all steps
  If valid → submit form
```

### Button Styling

| Button | Tailwind Classes | Purpose |
|--------|------------------|---------|
| Previous | `variant="outline"` | Secondary action |
| Next | `variant="default"` | Primary action |
| Submit | `variant="default"` | Primary action |
| Container | `flex justify-between items-center` | Layout |
| Container | `pt-4 mt-6 border-t` | Visual separation |

### Loading State

| State | Previous | Next | Submit |
|-------|----------|------|--------|
| Not submitting | Enabled (if not step 1) | Enabled (if valid) | Enabled (if valid) |
| Submitting | Disabled | Disabled | Disabled + Spinner |

### Submit Button Loading State

```
Normal State:
┌──────────────────┐
│ Create Account   │
└──────────────────┘

Loading State:
┌──────────────────┐
│ [●] Creating...  │
└──────────────────┘
```

### Keyboard Shortcuts (Optional)

| Key | Action | Condition |
|-----|--------|-----------|
| Enter | Next/Submit | When button focused |
| Escape | Cancel/Previous | Optional |
| Tab | Navigate buttons | Standard |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Step 1 invalid | Next button disabled, show errors |
| Step 2 invalid | Next button disabled, show errors |
| Step 3 invalid | Next button disabled, show errors |
| Step 4 invalid | Submit button disabled, show errors |
| API error on submit | Re-enable buttons, show error (Task 44) |

### Expected Outcome
- Functional navigation buttons in RegisterForm
- Previous button for going back
- Next button with step validation
- Submit button on final step
- Proper enabling/disabling logic
- Loading state during submission
- Clear visual hierarchy

### Verification Checklist
- [ ] Navigation button container added to RegisterForm
- [ ] Previous button implemented
- [ ] Previous button disabled on step 1
- [ ] Next button implemented
- [ ] Next button validates current step
- [ ] Next button advances only if valid
- [ ] Next button hidden on step 4
- [ ] Submit button implemented
- [ ] Submit button shown only on step 4
- [ ] Submit button disabled when invalid
- [ ] Submit button shows loading spinner
- [ ] All buttons properly styled
- [ ] Button layout responsive
- [ ] Keyboard navigation works
- [ ] previousStep function called correctly
- [ ] nextStep function called correctly

---

## Summary

This document established the complete multi-step registration form infrastructure including the page route, comprehensive validation schemas for all four steps, the main RegisterForm component, individual step components for Business Info, Admin User, Contact Info, and Plan Selection, a visual step indicator, and navigation buttons with validation logic.

### Completed Tasks
31. ✓ Created registration page route at `/register`
32. ✓ Created comprehensive Zod schemas for all registration steps
33. ✓ Created RegisterForm component with multi-step management
34. ✓ Created Step 1: Business Info component
35. ✓ Created Step 2: Admin User component with password fields
36. ✓ Created Step 3: Contact Info component with Sri Lankan phone validation
37. ✓ Created Step 4: Plan Selection component with three plan options
38. ✓ Created StepIndicator component for progress visualization
39. ✓ Added step navigation buttons with validation

### Next Steps
Proceed to [02_Tasks-40-46_Validation-Submission.md](02_Tasks-40-46_Validation-Submission.md) to add password strength indicator, terms acceptance checkbox, implement registration submission logic, handle success and error responses, add login link, and test the complete registration flow.
