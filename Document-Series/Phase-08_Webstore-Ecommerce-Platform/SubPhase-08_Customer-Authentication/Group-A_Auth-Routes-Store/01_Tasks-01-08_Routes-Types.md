# Tasks 01-08: Routes and Type Definitions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** A - Auth Routes & Store  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Store-Guards-Verify.md](02_Tasks-09-16_Store-Guards-Verify.md)

---

## Document Overview

This document covers the creation of the customer authentication route structure and type definitions. It establishes the foundational structure for all customer-facing authentication pages in the webstore, including the account directory setup, shared auth layout component, individual authentication page routes (login, register, forgot-password, reset-password), Zustand auth store initialization, and TypeScript type definitions for User and authentication state.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Account Directory | Low | 15 min |
| 02 | Create Account Layout | Medium | 30 min |
| 03 | Create Login Page Route | Low | 20 min |
| 04 | Create Register Page Route | Low | 20 min |
| 05 | Create Forgot Password Route | Low | 20 min |
| 06 | Create Reset Password Route | Low | 20 min |
| 07 | Create Auth Store | Medium | 35 min |
| 08 | Create User Type | Low | 15 min |

---

## Task 01: Create Account Directory

### Overview
Create the `account` directory within the storefront route structure. This directory will house all customer authentication-related pages including login, registration, password reset, and account management. Unlike the ERP dashboard which uses an (auth) route group, the webstore uses a standard /account route that appears in the URL path.

### Dependencies
- SubPhase-07 (Storefront Layout & Navigation) must be complete
- Next.js App Router structure is established
- Frontend project is initialized with storefront structure

### Instructions

1. **Navigate to the storefront directory**
   - Go to `frontend/app/(storefront)/` directory
   - This is where all customer-facing routes are located
   - Verify the (storefront) route group exists

2. **Create the account directory**
   - Create a new directory named `account` (no parentheses)
   - This will create the `/account` URL path
   - All authentication pages will be under this route

3. **Understand storefront routing behavior**
   - `app/(storefront)/account/login/page.tsx` → `/account/login`
   - `app/(storefront)/account/register/page.tsx` → `/account/register`
   - The (storefront) route group doesn't add to URL
   - The account directory DOES appear in the URL

4. **Verify directory creation**
   - Confirm `frontend/app/(storefront)/account/` directory exists
   - Ensure proper naming without parentheses
   - Ready for child pages and layout

### Account Directory Purpose

| Feature | Benefit |
|---------|---------|
| URL Clarity | Clear `/account/*` routes for customers |
| Shared Layout | All account pages use same layout |
| Organization | Groups all auth pages together |
| SEO Friendly | Semantic URL structure |

### Directory Structure
```
frontend/app/
├── (storefront)/              # Storefront route group
│   ├── account/               # Account directory (Task 01)
│   │   └── layout.tsx         # (Created in Task 02)
│   ├── products/              # (Created in other SubPhases)
│   ├── cart/                  # (Created in other SubPhases)
│   └── checkout/              # (Created in other SubPhases)
└── (erp)/                     # (Separate ERP structure)
```

### URL Mapping Example

| File Path | URL Path |
|-----------|----------|
| `app/(storefront)/account/login/page.tsx` | `/account/login` |
| `app/(storefront)/account/register/page.tsx` | `/account/register` |
| `app/(storefront)/account/forgot-password/page.tsx` | `/account/forgot-password` |
| `app/(storefront)/account/reset-password/page.tsx` | `/account/reset-password` |

### Expected Outcome
- Account directory created in proper location
- Foundation for customer authentication pages
- Clean URL structure for authentication routes
- Organized separation from other storefront features

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/` directory exists
- [ ] Directory name does NOT include parentheses
- [ ] Located directly under `(storefront)/` directory
- [ ] Ready to receive child pages and layout

---

## Task 02: Create Account Layout

### Overview
Create the layout component for the account directory that provides a consistent structure for all customer authentication pages. This layout features a centered design optimized for mobile-first experience, with the store logo, centered authentication card area, and footer information. Unlike the ERP dashboard layout, this is designed for public-facing customers with brand prominence.

### Dependencies
- Task 01: Create Account Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages in the account directory

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import Link from 'next/link'
   - Import Image from 'next/image' for logo
   - Import any custom components (StoreLogo, AccountFooter)

3. **Define layout metadata**
   - Export metadata object with page title template
   - Set title template to "%s | LankaCommerce Cloud"
   - Configure description for customer authentication
   - Add relevant keywords for SEO

4. **Create layout component structure**
   - Define default export function `AccountLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with main sections

5. **Implement three-section layout**
   - Top section: Store logo with link to homepage
   - Center section: children (authentication page content)
   - Bottom section: Footer with links and copyright

6. **Add responsive container**
   - Wrap content in container with max-width (max-w-md)
   - Center content horizontally with mx-auto
   - Add proper padding for mobile devices (px-4)
   - Ensure full viewport height (min-h-screen)

7. **Style for customer experience**
   - Use brand colors consistent with storefront
   - Add subtle background color or gradient
   - Ensure mobile-first responsive design
   - Maintain proper spacing and breathing room

### Layout Structure

```
┌─────────────────────────────────────┐
│         [Store Logo + Link]         │
│                                     │
│                                     │
│      ┌─────────────────┐           │
│      │                 │           │
│      │    {children}   │           │
│      │  (Account Pages)│           │
│      │                 │           │
│      └─────────────────┘           │
│                                     │
│                                     │
│      [Links] | [Support] | [Help]  │
│      © 2026 LankaCommerce Cloud    │
└─────────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Account page content to render |

### Layout Sections

| Section | Content | Position | Purpose |
|---------|---------|----------|---------|
| Header | Store Logo | Top | Brand identity and navigation |
| Main | children | Center | Account page content |
| Footer | Links & Copyright | Bottom | Support and legal info |

### Responsive Design Specifications

| Breakpoint | Container Width | Padding | Logo Size |
|------------|----------------|---------|-----------|
| Mobile (<640px) | Full width | px-4 | Small (120px) |
| Tablet (640px-1024px) | max-w-md | px-6 | Medium (140px) |
| Desktop (>1024px) | max-w-md | px-8 | Medium (140px) |

### Layout Styling Guide

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `min-h-screen flex flex-col bg-gray-50` | Full height, vertical layout |
| Logo Section | `py-8 flex justify-center` | Spacing and centering |
| Content Wrapper | `flex-grow flex items-center justify-center` | Centered content |
| Content Container | `w-full max-w-md px-4` | Width constraint and padding |
| Footer | `py-6 text-center border-t border-gray-200` | Bottom spacing and separation |

### Expected Outcome
- Functional layout component for all account pages
- Three-section structure (logo, content, footer)
- Mobile-first responsive design
- Consistent brand appearance
- Ready to receive authentication page content

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/layout.tsx` file created
- [ ] Layout component exports properly as default
- [ ] Accepts children prop with correct typing
- [ ] Three sections defined (logo, content, footer)
- [ ] Metadata configured for SEO
- [ ] Responsive design implemented
- [ ] Store logo links to homepage
- [ ] Footer includes support links

---

## Task 03: Create Login Page Route

### Overview
Create the login page route for customer authentication. This page allows existing customers to sign in to their accounts using email and password. The page will use the account layout and provide a clean, focused login experience optimized for conversion.

### Dependencies
- Task 01: Create Account Directory
- Task 02: Create Account Layout (for consistent styling)

### Instructions

1. **Create login directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `login`
   - This creates the `/account/login` route

2. **Create page.tsx file**
   - Inside the `login` directory, create `page.tsx`
   - This file represents the login page component
   - Must be named exactly `page.tsx` for App Router

3. **Define page metadata**
   - Export metadata object at top of file
   - Set title to "Login"
   - Add description: "Sign in to your LankaCommerce Cloud account"
   - Include relevant keywords for SEO

4. **Create page component structure**
   - Define default export function `LoginPage`
   - Return JSX structure for login page
   - Import any required components

5. **Plan page sections**
   - Heading: "Welcome Back" or "Login to Your Account"
   - Login form container (to be created in Group B)
   - Link to register page: "Don't have an account? Sign up"
   - Link to forgot password page
   - Optional: Social login section

6. **Add navigation links**
   - Register link: `/account/register`
   - Forgot password link: `/account/forgot-password`
   - Use Next.js Link component
   - Style links with brand colors

7. **Prepare for form integration**
   - Add placeholder for login form component (Group B)
   - Ensure proper spacing for form elements
   - Plan layout for labels, inputs, and submit button

### Page Structure

```
┌─────────────────────────────────────┐
│      Welcome Back                   │
│      Login to Your Account          │
│                                     │
│      [Login Form Placeholder]       │
│      - Email Input                  │
│      - Password Input               │
│      - Remember Me Checkbox         │
│      - Login Button                 │
│                                     │
│      Forgot Password?               │
│                                     │
│      ────── OR ──────               │
│                                     │
│      [Social Login Buttons]         │
│                                     │
│      Don't have an account? Sign up │
└─────────────────────────────────────┘
```

### Page Metadata

| Field | Value |
|-------|-------|
| title | "Login" |
| description | "Sign in to your LankaCommerce Cloud account" |
| keywords | "login, sign in, customer account" |

### Navigation Links

| Link Text | Destination | Purpose |
|-----------|-------------|---------|
| Sign up | `/account/register` | New customer registration |
| Forgot Password? | `/account/forgot-password` | Password recovery |
| Back to Store | `/` | Return to homepage |

### Component Sections

| Section | Description | Priority |
|---------|-------------|----------|
| Heading | Page title and subtitle | High |
| Form Container | Login form (Group B) | High |
| Forgot Link | Password recovery link | Medium |
| Register Link | New account creation | Medium |
| Social Login | OAuth providers (optional) | Low |

### URL and Route Information

| Property | Value |
|----------|-------|
| File Path | `app/(storefront)/account/login/page.tsx` |
| URL Path | `/account/login` |
| Parent Layout | `account/layout.tsx` |
| Route Type | Public (with GuestGuard) |

### Expected Outcome
- Functional login page route at `/account/login`
- Page title and metadata configured
- Navigation links to register and forgot password
- Prepared structure for login form integration
- Consistent with account layout styling

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/login/` directory created
- [ ] `frontend/app/(storefront)/account/login/page.tsx` file created
- [ ] Page metadata exported correctly
- [ ] Page component exports as default
- [ ] Heading and description added
- [ ] Link to register page included
- [ ] Link to forgot password included
- [ ] Placeholder for login form ready
- [ ] Page accessible at `/account/login`

---

## Task 04: Create Register Page Route

### Overview
Create the registration page route for new customer sign-up. This page allows prospective customers to create a new account by providing their personal information, email, and password. The page emphasizes a smooth onboarding experience with clear guidance and validation.

### Dependencies
- Task 01: Create Account Directory
- Task 02: Create Account Layout (for consistent styling)

### Instructions

1. **Create register directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `register`
   - This creates the `/account/register` route

2. **Create page.tsx file**
   - Inside the `register` directory, create `page.tsx`
   - This file represents the registration page component
   - Must be named exactly `page.tsx` for App Router

3. **Define page metadata**
   - Export metadata object at top of file
   - Set title to "Create Account" or "Register"
   - Add description: "Create your LankaCommerce Cloud account"
   - Include relevant keywords for SEO

4. **Create page component structure**
   - Define default export function `RegisterPage`
   - Return JSX structure for registration page
   - Import any required components

5. **Plan page sections**
   - Heading: "Create Your Account" or "Get Started"
   - Registration form container (to be created in Group B)
   - Link to login page: "Already have an account? Sign in"
   - Terms and privacy policy agreement
   - Optional: Benefits of creating an account

6. **Add navigation links**
   - Login link: `/account/login`
   - Privacy policy link: `/privacy`
   - Terms of service link: `/terms`
   - Use Next.js Link component

7. **Prepare for form integration**
   - Add placeholder for registration form component (Group B)
   - Plan layout for multiple input fields
   - Ensure proper spacing for labels, inputs, and submit button
   - Consider field grouping (personal info, credentials)

### Page Structure

```
┌─────────────────────────────────────┐
│      Create Your Account            │
│      Join thousands of customers    │
│                                     │
│      [Registration Form]            │
│      - First Name                   │
│      - Last Name                    │
│      - Email Address                │
│      - Phone Number (Optional)      │
│      - Password                     │
│      - Confirm Password             │
│                                     │
│      ☑ I agree to Terms & Privacy   │
│                                     │
│      [Create Account Button]        │
│                                     │
│      ────── OR ──────               │
│                                     │
│      [Social Registration]          │
│                                     │
│      Already have an account? Sign in│
└─────────────────────────────────────┘
```

### Page Metadata

| Field | Value |
|-------|-------|
| title | "Create Account" |
| description | "Create your LankaCommerce Cloud account to start shopping" |
| keywords | "register, sign up, create account, new customer" |

### Navigation Links

| Link Text | Destination | Purpose |
|-----------|-------------|---------|
| Sign in | `/account/login` | Existing customer login |
| Privacy Policy | `/privacy` | Privacy information |
| Terms of Service | `/terms` | Terms and conditions |
| Back to Store | `/` | Return to homepage |

### Form Field Planning

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | text | Yes | Min 2 chars |
| Last Name | text | Yes | Min 2 chars |
| Email | email | Yes | Valid email format |
| Phone | tel | No | Valid phone format |
| Password | password | Yes | Min 8 chars, complexity |
| Confirm Password | password | Yes | Must match password |
| Terms Checkbox | checkbox | Yes | Must be checked |

### Component Sections

| Section | Description | Priority |
|---------|-------------|----------|
| Heading | Page title and subtitle | High |
| Form Container | Registration form (Group B) | High |
| Terms Agreement | Checkbox with links | High |
| Login Link | Existing account link | Medium |
| Social Registration | OAuth providers (optional) | Low |
| Benefits | Why create an account | Low |

### URL and Route Information

| Property | Value |
|----------|-------|
| File Path | `app/(storefront)/account/register/page.tsx` |
| URL Path | `/account/register` |
| Parent Layout | `account/layout.tsx` |
| Route Type | Public (with GuestGuard) |

### Expected Outcome
- Functional registration page route at `/account/register`
- Page title and metadata configured
- Navigation link to login page
- Links to privacy policy and terms
- Prepared structure for registration form
- Terms and privacy agreement checkbox area

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/register/` directory created
- [ ] `frontend/app/(storefront)/account/register/page.tsx` file created
- [ ] Page metadata exported correctly
- [ ] Page component exports as default
- [ ] Heading and description added
- [ ] Link to login page included
- [ ] Links to privacy and terms included
- [ ] Placeholder for registration form ready
- [ ] Terms agreement section included
- [ ] Page accessible at `/account/register`

---

## Task 05: Create Forgot Password Route

### Overview
Create the forgot password page route for password recovery initiation. This page allows customers who have forgotten their password to request a password reset link via email. The page emphasizes simplicity with a single email input and clear instructions.

### Dependencies
- Task 01: Create Account Directory
- Task 02: Create Account Layout (for consistent styling)

### Instructions

1. **Create forgot-password directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `forgot-password`
   - This creates the `/account/forgot-password` route

2. **Create page.tsx file**
   - Inside the `forgot-password` directory, create `page.tsx`
   - This file represents the forgot password page component
   - Must be named exactly `page.tsx` for App Router

3. **Define page metadata**
   - Export metadata object at top of file
   - Set title to "Forgot Password"
   - Add description: "Reset your LankaCommerce Cloud account password"
   - Include relevant keywords for SEO

4. **Create page component structure**
   - Define default export function `ForgotPasswordPage`
   - Return JSX structure for forgot password page
   - Import any required components

5. **Plan page sections**
   - Heading: "Forgot Your Password?" or "Reset Password"
   - Instruction text: "Enter your email and we'll send you a reset link"
   - Email input form (to be created in Group B)
   - Submit button: "Send Reset Link"
   - Success message area (conditional)
   - Link back to login page

6. **Add navigation links**
   - Login link: `/account/login` - "Back to Login"
   - Register link: `/account/register` - "Create Account"
   - Use Next.js Link component

7. **Prepare for form integration**
   - Add placeholder for email input form (Group B)
   - Plan success message display
   - Plan error message handling
   - Consider resend functionality

### Page Structure

```
┌─────────────────────────────────────┐
│      Forgot Your Password?          │
│                                     │
│      Enter your email address and   │
│      we'll send you a link to reset│
│      your password.                 │
│                                     │
│      [Email Input Field]            │
│                                     │
│      [Send Reset Link Button]       │
│                                     │
│      [Success Message Area]         │
│      ✓ Reset link sent to your email│
│        Check your inbox and spam.   │
│                                     │
│      ← Back to Login                │
│      Don't have an account? Sign up │
└─────────────────────────────────────┘
```

### Page Metadata

| Field | Value |
|-------|-------|
| title | "Forgot Password" |
| description | "Reset your LankaCommerce Cloud account password" |
| keywords | "forgot password, reset password, password recovery" |

### Navigation Links

| Link Text | Destination | Purpose |
|-----------|-------------|---------|
| Back to Login | `/account/login` | Return to login page |
| Sign up | `/account/register` | New customer registration |

### Page States

| State | Description | Display |
|-------|-------------|---------|
| Initial | Form ready for input | Email field + submit button |
| Loading | Processing request | Loading spinner |
| Success | Email sent successfully | Success message + instructions |
| Error | Failed to send | Error message + retry option |

### Component Sections

| Section | Description | Priority |
|---------|-------------|----------|
| Heading | Page title | High |
| Instructions | User guidance | High |
| Form Container | Email input form (Group B) | High |
| Success Message | Confirmation message | High |
| Navigation Links | Back to login, register | Medium |

### URL and Route Information

| Property | Value |
|----------|-------|
| File Path | `app/(storefront)/account/forgot-password/page.tsx` |
| URL Path | `/account/forgot-password` |
| Parent Layout | `account/layout.tsx` |
| Route Type | Public (with GuestGuard) |

### User Flow Diagram

```
User enters email
      ↓
Clicks "Send Reset Link"
      ↓
API validates email
      ↓
   ┌──────┴──────┐
   ↓             ↓
Success       Error
   ↓             ↓
Show message  Retry
   ↓
User checks email
   ↓
Clicks reset link
   ↓
→ /account/reset-password
```

### Expected Outcome
- Functional forgot password page at `/account/forgot-password`
- Clear instructions for password reset
- Email input field ready for integration
- Success and error message areas
- Navigation back to login page
- Prepared for API integration

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/forgot-password/` directory created
- [ ] `frontend/app/(storefront)/account/forgot-password/page.tsx` file created
- [ ] Page metadata exported correctly
- [ ] Page component exports as default
- [ ] Heading and instructions added
- [ ] Placeholder for email form ready
- [ ] Success message area included
- [ ] Link back to login page included
- [ ] Page accessible at `/account/forgot-password`

---

## Task 06: Create Reset Password Route

### Overview
Create the reset password page route for completing the password recovery process. This page allows customers to set a new password after clicking the reset link from their email. The page validates the reset token and provides a secure interface for password update.

### Dependencies
- Task 01: Create Account Directory
- Task 02: Create Account Layout (for consistent styling)
- Task 05: Create Forgot Password Route (user flow connection)

### Instructions

1. **Create reset-password directory**
   - Navigate to `frontend/app/(storefront)/account/` directory
   - Create new directory named `reset-password`
   - This creates the `/account/reset-password` route

2. **Create page.tsx file**
   - Inside the `reset-password` directory, create `page.tsx`
   - This file represents the reset password page component
   - Must be named exactly `page.tsx` for App Router

3. **Define page metadata**
   - Export metadata object at top of file
   - Set title to "Reset Password"
   - Add description: "Set a new password for your account"
   - Include relevant keywords for SEO

4. **Create page component structure**
   - Define default export function `ResetPasswordPage`
   - Return JSX structure for reset password page
   - Import any required components
   - Access URL query parameters (token, email)

5. **Plan page sections**
   - Heading: "Reset Your Password" or "Create New Password"
   - Instruction text: "Enter your new password below"
   - Password input fields (to be created in Group B)
   - Password strength indicator
   - Submit button: "Reset Password"
   - Success/error message area

6. **Handle token validation**
   - Extract token from URL query parameters
   - Validate token on page load (Group C)
   - Show error if token is invalid or expired
   - Redirect to forgot-password if no token

7. **Prepare for form integration**
   - Add placeholder for password form (Group B)
   - Plan password validation rules
   - Include password confirmation field
   - Add password strength indicator
   - Consider showing password requirements

### Page Structure

```
┌─────────────────────────────────────┐
│      Reset Your Password            │
│                                     │
│      Enter a new password for your  │
│      account. Make it strong!       │
│                                     │
│      [New Password Input]           │
│      [Password Strength: ████░░]    │
│                                     │
│      [Confirm Password Input]       │
│                                     │
│      Password Requirements:         │
│      • At least 8 characters        │
│      • One uppercase letter         │
│      • One number                   │
│      • One special character        │
│                                     │
│      [Reset Password Button]        │
│                                     │
│      [Success/Error Message]        │
└─────────────────────────────────────┘
```

### Page Metadata

| Field | Value |
|-------|-------|
| title | "Reset Password" |
| description | "Set a new password for your LankaCommerce Cloud account" |
| keywords | "reset password, change password, new password" |

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | Yes | Password reset token |
| email | string | Yes | User's email address |

### Example URL
```
/account/reset-password?token=abc123xyz&email=customer@example.com
```

### Password Requirements

| Requirement | Description | Validation |
|-------------|-------------|------------|
| Length | Minimum 8 characters | length >= 8 |
| Uppercase | At least one uppercase letter | /[A-Z]/ |
| Lowercase | At least one lowercase letter | /[a-z]/ |
| Number | At least one number | /[0-9]/ |
| Special | At least one special character | /[!@#$%^&*]/ |
| Match | Passwords must match | password === confirm |

### Password Strength Levels

| Level | Description | Color | Criteria |
|-------|-------------|-------|----------|
| Weak | Basic requirements only | Red | Meets minimum |
| Fair | Meets most requirements | Yellow | 3-4 criteria |
| Good | All requirements met | Blue | All criteria |
| Strong | Exceeds requirements | Green | All + 12+ chars |

### Page States

| State | Description | Display |
|-------|-------------|---------|
| Loading | Validating token | Loading spinner |
| Valid Token | Token is valid | Password form |
| Invalid Token | Token expired/invalid | Error + redirect link |
| Success | Password reset complete | Success + login link |
| Error | Reset failed | Error message + retry |

### Component Sections

| Section | Description | Priority |
|---------|-------------|----------|
| Heading | Page title | High |
| Instructions | User guidance | High |
| Form Container | Password inputs (Group B) | High |
| Requirements | Password rules display | High |
| Strength Indicator | Visual feedback | Medium |
| Success Message | Completion confirmation | High |

### URL and Route Information

| Property | Value |
|----------|-------|
| File Path | `app/(storefront)/account/reset-password/page.tsx` |
| URL Path | `/account/reset-password` |
| Parent Layout | `account/layout.tsx` |
| Route Type | Public (with GuestGuard) |

### User Flow Diagram

```
User clicks email link
      ↓
Lands on reset-password page
      ↓
Token validated
      ↓
   ┌──────┴──────┐
   ↓             ↓
Valid        Invalid
   ↓             ↓
Show form    Show error
   ↓             ↓
User enters   Redirect to
new password  forgot-password
   ↓
Submits form
   ↓
Password updated
   ↓
Show success + login link
   ↓
→ /account/login
```

### Expected Outcome
- Functional reset password page at `/account/reset-password`
- Token validation from URL parameters
- Password input fields ready for integration
- Password strength indicator planned
- Requirements display included
- Success state with login link
- Error handling for invalid tokens

### Verification Checklist
- [ ] `frontend/app/(storefront)/account/reset-password/` directory created
- [ ] `frontend/app/(storefront)/account/reset-password/page.tsx` file created
- [ ] Page metadata exported correctly
- [ ] Page component exports as default
- [ ] Heading and instructions added
- [ ] URL parameter handling planned
- [ ] Placeholder for password form ready
- [ ] Password requirements list included
- [ ] Strength indicator section added
- [ ] Token validation logic planned
- [ ] Page accessible at `/account/reset-password`

---

## Task 07: Create Auth Store

### Overview
Create a Zustand store for managing customer authentication state in the webstore. This store handles user login state, user data, loading states, and authentication-related actions. Unlike Redux, Zustand provides a simpler, more lightweight state management solution that's perfect for focused use cases like authentication.

### Dependencies
- Task 01: Create Account Directory (general project structure)
- Zustand library must be installed in frontend project

### Instructions

1. **Create stores directory structure**
   - Navigate to `frontend/` directory
   - Create `stores` directory if it doesn't exist
   - Create `storefront` subdirectory within stores
   - This separates storefront stores from ERP stores

2. **Install Zustand (if not already installed)**
   - Run: `npm install zustand` in frontend directory
   - Or: `pnpm add zustand` or `yarn add zustand`
   - Verify installation in package.json

3. **Create authStore.ts file**
   - Navigate to `frontend/stores/storefront/` directory
   - Create new file named `authStore.ts`
   - This will house the authentication store

4. **Import Zustand dependencies**
   - Import `create` from 'zustand'
   - Import `persist` from 'zustand/middleware' for persistence
   - Import type definitions (to be created in Task 08)

5. **Define store state structure**
   - user: User object or null (logged-in user data)
   - isAuthenticated: boolean (authentication status)
   - isLoading: boolean (async operation indicator)
   - error: string or null (error messages)

6. **Define store actions**
   - login: Async function to authenticate user
   - logout: Function to clear user session
   - setUser: Function to update user data
   - clearError: Function to reset error state
   - checkAuth: Function to verify auth status

7. **Implement store creation**
   - Use Zustand `create` function
   - Implement persist middleware for localStorage
   - Configure persist options (name, storage)
   - Return store instance

8. **Configure persistence**
   - Store name: 'storefront-auth-storage'
   - Persist: user, isAuthenticated
   - Do not persist: isLoading, error (transient state)
   - Use localStorage for web storage

9. **Add TypeScript typing**
   - Define AuthStore interface
   - Include state properties and action signatures
   - Export types for use in components

### Store State Structure

| Property | Type | Initial Value | Persisted | Description |
|----------|------|---------------|-----------|-------------|
| user | User \| null | null | Yes | Current user data |
| isAuthenticated | boolean | false | Yes | Authentication status |
| isLoading | boolean | false | No | Loading indicator |
| error | string \| null | null | No | Error message |

### Store Actions

| Action | Parameters | Return Type | Description |
|--------|-----------|-------------|-------------|
| login | credentials: LoginCredentials | Promise<void> | Authenticate user |
| logout | none | void | Clear user session |
| setUser | user: User | void | Update user data |
| clearError | none | void | Reset error state |
| checkAuth | none | Promise<boolean> | Verify auth status |

### Zustand Store Pattern

```
Create Store
    ├── State Properties
    │   ├── user
    │   ├── isAuthenticated
    │   ├── isLoading
    │   └── error
    │
    └── Actions
        ├── login()
        ├── logout()
        ├── setUser()
        ├── clearError()
        └── checkAuth()
```

### Persistence Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Storage | localStorage | Browser storage |
| Key | 'storefront-auth-storage' | Unique identifier |
| Whitelist | user, isAuthenticated | Persist only essential state |
| Blacklist | isLoading, error | Don't persist transient state |

### Store Implementation Flow

```
1. Define State Interface
        ↓
2. Define Actions Interface
        ↓
3. Create Store with create()
        ↓
4. Implement State Initialization
        ↓
5. Implement Action Functions
        ↓
6. Add Persist Middleware
        ↓
7. Export Store Hook
```

### Usage Pattern in Components

| Pattern | Purpose |
|---------|---------|
| `const { user } = useAuthStore()` | Access state |
| `const { login } = useAuthStore()` | Access action |
| `const isAuthenticated = useAuthStore(s => s.isAuthenticated)` | Selective subscription |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Token Storage | Store in httpOnly cookies (not in store) |
| Sensitive Data | Don't store passwords or tokens |
| Persistence | Only persist non-sensitive user info |
| XSS Protection | Sanitize user data before storing |

### File Structure

```
frontend/
└── stores/
    ├── storefront/
    │   ├── authStore.ts        # (Task 07)
    │   ├── cartStore.ts        # (Other SubPhases)
    │   └── wishlistStore.ts    # (Other SubPhases)
    └── erp/
        └── authStore.ts         # (Separate ERP store)
```

### Expected Outcome
- Zustand auth store created and configured
- State properties defined with proper types
- Action functions prepared (implementation in Tasks 09-12)
- Persist middleware configured for localStorage
- Store ready to be used in components
- TypeScript types properly defined

### Verification Checklist
- [ ] `frontend/stores/storefront/` directory created
- [ ] `frontend/stores/storefront/authStore.ts` file created
- [ ] Zustand installed in package.json
- [ ] Store state structure defined
- [ ] Store actions declared
- [ ] Persist middleware configured
- [ ] TypeScript interfaces defined
- [ ] Store exports default hook
- [ ] Persistence settings configured
- [ ] Ready for action implementation

---

## Task 08: Create User Type

### Overview
Create TypeScript type definitions for the User entity in the webstore authentication system. This type represents a customer user with their profile information and is used throughout the authentication flow, user profile pages, and order history. Clear type definitions improve code quality, enable better IDE support, and prevent runtime errors.

### Dependencies
- Task 07: Create Auth Store (types will be used in store)

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/` directory
   - Create `types` directory if it doesn't exist
   - Create `storefront` subdirectory within types
   - This separates storefront types from ERP types

2. **Create auth.types.ts file**
   - Navigate to `frontend/types/storefront/` directory
   - Create new file named `auth.types.ts`
   - This will house authentication-related types

3. **Define User interface**
   - Create interface named `User`
   - Include all customer profile properties
   - Use proper TypeScript types for each property
   - Mark optional fields appropriately

4. **Define required user properties**
   - id: string (unique user identifier)
   - email: string (user's email address)
   - firstName: string (user's first name)
   - lastName: string (user's last name)

5. **Define optional user properties**
   - phone?: string (contact phone number)
   - avatar?: string (profile picture URL)
   - createdAt?: string (account creation date)
   - updatedAt?: string (last update timestamp)
   - emailVerified?: boolean (email verification status)

6. **Add computed properties**
   - fullName?: string (concatenated first + last name)
   - initials?: string (first letters of name)
   - Consider adding these as derived values in components

7. **Define related types**
   - Create LoginCredentials interface
   - Create RegisterData interface
   - Create ForgotPasswordData interface
   - Create ResetPasswordData interface

8. **Add JSDoc comments**
   - Document each interface and property
   - Explain purpose and usage
   - Provide examples where helpful

9. **Export all types**
   - Export User interface
   - Export all related credential interfaces
   - Make available for import across project

### User Type Structure

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique user identifier (UUID) |
| email | string | Yes | User's email address |
| firstName | string | Yes | User's first name |
| lastName | string | Yes | User's last name |
| phone | string | No | Contact phone number |
| avatar | string | No | Profile picture URL |
| createdAt | string | No | Account creation timestamp (ISO) |
| updatedAt | string | No | Last update timestamp (ISO) |
| emailVerified | boolean | No | Email verification status |

### Related Type Interfaces

| Interface | Properties | Purpose |
|-----------|-----------|---------|
| LoginCredentials | email, password, rememberMe? | Login form data |
| RegisterData | email, password, firstName, lastName, phone?, termsAccepted | Registration form data |
| ForgotPasswordData | email | Forgot password form data |
| ResetPasswordData | token, email, password, confirmPassword | Reset password form data |

### LoginCredentials Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes | User's email |
| password | string | Yes | User's password |
| rememberMe | boolean | No | Keep logged in |

### RegisterData Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes | New user email |
| password | string | Yes | New password |
| confirmPassword | string | Yes | Password confirmation |
| firstName | string | Yes | First name |
| lastName | string | Yes | Last name |
| phone | string | No | Phone number |
| termsAccepted | boolean | Yes | Terms agreement |

### ForgotPasswordData Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| email | string | Yes | Account email |

### ResetPasswordData Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| token | string | Yes | Reset token from email |
| email | string | Yes | Account email |
| password | string | Yes | New password |
| confirmPassword | string | Yes | Password confirmation |

### Type Hierarchy Diagram

```
auth.types.ts
    │
    ├── User
    │   ├── id: string
    │   ├── email: string
    │   ├── firstName: string
    │   ├── lastName: string
    │   ├── phone?: string
    │   ├── avatar?: string
    │   ├── createdAt?: string
    │   ├── updatedAt?: string
    │   └── emailVerified?: boolean
    │
    ├── LoginCredentials
    │   ├── email: string
    │   ├── password: string
    │   └── rememberMe?: boolean
    │
    ├── RegisterData
    │   ├── email: string
    │   ├── password: string
    │   ├── confirmPassword: string
    │   ├── firstName: string
    │   ├── lastName: string
    │   ├── phone?: string
    │   └── termsAccepted: boolean
    │
    ├── ForgotPasswordData
    │   └── email: string
    │
    └── ResetPasswordData
        ├── token: string
        ├── email: string
        ├── password: string
        └── confirmPassword: string
```

### File Structure

```
frontend/
└── types/
    ├── storefront/
    │   ├── auth.types.ts       # (Task 08)
    │   ├── product.types.ts    # (Other SubPhases)
    │   ├── order.types.ts      # (Other SubPhases)
    │   └── index.ts            # (Barrel export)
    └── erp/
        └── auth.types.ts        # (Separate ERP types)
```

### Usage Examples

| Usage Context | Example |
|--------------|---------|
| Component Props | `user: User` |
| Store State | `user: User \| null` |
| API Response | `Promise<User>` |
| Form Data | `data: LoginCredentials` |
| Array of Users | `users: User[]` |

### TypeScript Benefits

| Benefit | Description |
|---------|-------------|
| Type Safety | Catch errors at compile time |
| Autocomplete | IDE suggestions for properties |
| Documentation | Self-documenting code |
| Refactoring | Safe property renaming |
| Validation | Ensure data structure consistency |

### Expected Outcome
- User type interface fully defined
- All required and optional properties specified
- Related credential interfaces created
- Types properly exported for project-wide use
- JSDoc comments for documentation
- Ready to be imported in components and stores

### Verification Checklist
- [ ] `frontend/types/storefront/` directory created
- [ ] `frontend/types/storefront/auth.types.ts` file created
- [ ] User interface defined with all properties
- [ ] Required properties marked correctly
- [ ] Optional properties marked with ?
- [ ] LoginCredentials interface defined
- [ ] RegisterData interface defined
- [ ] ForgotPasswordData interface defined
- [ ] ResetPasswordData interface defined
- [ ] All interfaces exported properly
- [ ] JSDoc comments added
- [ ] Types ready for import in authStore

---

## Summary

This document established the foundational route structure and type definitions for customer authentication in the webstore. It created the account directory with shared layout, individual authentication page routes, Zustand auth store initialization, and comprehensive TypeScript type definitions for users and authentication data.

### Completed Tasks
1. ✓ Created account directory for authentication routes
2. ✓ Created account layout with brand-consistent design
3. ✓ Created login page route at /account/login
4. ✓ Created register page route at /account/register
5. ✓ Created forgot password route at /account/forgot-password
6. ✓ Created reset password route at /account/reset-password
7. ✓ Created Zustand auth store with state and actions structure
8. ✓ Created User type and authentication-related TypeScript interfaces

### Next Steps
Proceed to [02_Tasks-09-16_Store-Guards-Verify.md](02_Tasks-09-16_Store-Guards-Verify.md) to implement store action logic, create authentication guards, and verify all routes are functioning correctly.

### Route Structure Recap

```
/account
├── /login              ✓ Created
├── /register           ✓ Created
├── /forgot-password    ✓ Created
└── /reset-password     ✓ Created
```

### State Management Recap

```
authStore (Zustand)
├── State
│   ├── user            ✓ Defined
│   ├── isAuthenticated ✓ Defined
│   ├── isLoading       ✓ Defined
│   └── error           ✓ Defined
│
└── Actions (To be implemented in Doc 02)
    ├── login()         → Task 10
    ├── logout()        → Task 11
    ├── setUser()       → Task 12
    ├── clearError()
    └── checkAuth()
```

### Type Definitions Recap

```
Types Created
├── User                ✓ Complete
├── LoginCredentials    ✓ Complete
├── RegisterData        ✓ Complete
├── ForgotPasswordData  ✓ Complete
└── ResetPasswordData   ✓ Complete
```
