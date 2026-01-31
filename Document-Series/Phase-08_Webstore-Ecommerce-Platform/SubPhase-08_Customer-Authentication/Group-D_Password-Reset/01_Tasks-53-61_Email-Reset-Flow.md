# Tasks 53-61: Password Reset Email Flow

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 08 - Customer Authentication  
> **Group:** D - Password Reset  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-62-68_WhatsApp-OTP-Verification.md](02_Tasks-62-68_WhatsApp-OTP-Verification.md)

---

## Document Overview

This document covers the password reset flow for the storefront customer authentication system. It includes creating the forgot password page, email/phone input form, reset request API integration, email confirmation message, WhatsApp OTP option, OTP input component, OTP verification API, reset password page, new password form, reset password API, and success redirect to login.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create Forgot Password Page | Low | 20 min |
| 54 | Create Forgot Password Form | Low | 25 min |
| 55 | Create Email/Phone Input Field | Low | 20 min |
| 56 | Implement Reset Request Submit | Low | 20 min |
| 57 | Create Reset Request API | Medium | 30 min |
| 58 | Create Email Sent Confirmation | Low | 20 min |
| 59 | Create Reset Password Page | Low | 20 min |
| 60 | Create New Password Form | Low | 25 min |
| 61 | Implement Reset Password API | Medium | 30 min |

---

## Task 53: Create Forgot Password Page

### Overview
Create the forgot password page that provides a clean interface for customers to initiate a password reset. The page displays a centered form with the LCC brand, clear instructions, and easy navigation back to login.

### Dependencies
- Group C: Login Flow (Tasks 35-52) must be complete
- Auth layout components from Group A
- Form components from Phase 07

### Instructions

1. **Navigate to storefront auth pages directory**
   - Go to `frontend/app/(storefront)/` directory
   - Create `forgot-password/` directory if it doesn't exist
   - This page lives at the root level alongside login and register

2. **Create page.tsx file**
   - Create `page.tsx` in `forgot-password/` directory
   - Use Next.js App Router page convention
   - Export default page component

3. **Import required dependencies**
   ```typescript
   import { Metadata } from 'next';
   import Link from 'next/link';
   import { ForgotPasswordForm } from '@/components/storefront/auth/ForgotPassword/ForgotPasswordForm';
   import { ArrowLeft } from 'lucide-react';
   ```

4. **Define page metadata**
   ```typescript
   export const metadata: Metadata = {
     title: 'Reset Password | LankaCommerce Cloud',
     description: 'Reset your customer account password',
   };
   ```

5. **Create page component structure**
   - Use storefront auth layout styling
   - Center content vertically and horizontally
   - Display brand logo at top
   - Show reset password title and description
   - Include ForgotPasswordForm component
   - Add back to login link at bottom

6. **Implement responsive design**
   - Mobile: Full width with padding
   - Tablet: Max-width 480px
   - Desktop: Centered card layout

7. **Add accessibility features**
   - Proper heading hierarchy (h1 for page title)
   - ARIA labels for navigation links
   - Focus management for form inputs
   - Screen reader friendly descriptions

### Page Structure

```
┌─────────────────────────────────────┐
│         LCC Logo (Brand)            │
│                                     │
│      Reset Your Password            │ (h1)
│      Enter your email to receive    │
│      a password reset link          │
│                                     │
│      ┌─────────────────────┐       │
│      │ ForgotPasswordForm  │       │
│      │ (Created in Task 54)│       │
│      └─────────────────────┘       │
│                                     │
│      ← Back to login                │
│                                     │
└─────────────────────────────────────┘
```

### Implementation Code

```typescript
// frontend/app/(storefront)/forgot-password/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/storefront/auth/ForgotPassword/ForgotPasswordForm';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reset Password | LankaCommerce Cloud',
  description: 'Reset your customer account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Lanka<span className="text-blue-600">Commerce</span> Cloud
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customer Portal</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Page Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Enter your email address or phone number and we'll send you instructions to reset your password.
            </p>
          </div>

          {/* Forgot Password Form */}
          <ForgotPasswordForm />

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>

        {/* Footer Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <Link href="/support" className="text-blue-600 hover:underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Styling Specifications

| Element | Styling |
|---------|---------|
| Background | Gradient from blue-50 to indigo-50 |
| Card | White background, rounded-lg, shadow-lg |
| Title | 2xl font, semibold, gray-900 |
| Description | sm text, gray-600 |
| Link | Blue-600, hover blue-700 |
| Max Width | 448px (max-w-md) |

### Expected Outcome
- Clean, centered forgot password page
- LCC brand prominently displayed
- Clear instructions for users
- Ready to contain forgot password form
- Easy navigation back to login
- Mobile-responsive design

### Verification Checklist
- [ ] Page accessible at `/forgot-password`
- [ ] Page title displayed correctly
- [ ] Clear instructions provided
- [ ] Back to login link functional
- [ ] Responsive on all screen sizes
- [ ] Proper heading hierarchy
- [ ] Accessibility features implemented

---

## Task 54: Create Forgot Password Form

### Overview
Create the forgot password form component that collects the customer's email or phone number to initiate a password reset. The form validates input and handles submission to the reset request API.

### Dependencies
- Task 53: Create Forgot Password Page
- Form validation utilities from Phase 07

### Instructions

1. **Create component directory**
   - Navigate to `frontend/components/storefront/auth/`
   - Create `ForgotPassword/` directory
   - This will house all forgot password components

2. **Create ForgotPasswordForm.tsx**
   ```typescript
   'use client';
   
   import { useState } from 'react';
   import { useRouter } from 'next/navigation';
   ```

3. **Define form state**
   - Create state for contact (email or phone)
   - Create state for loading status
   - Create state for error messages
   - Create state for success message

4. **Implement contact validation**
   - Detect if input is email or phone
   - Validate email format
   - Validate Sri Lankan phone format
   - Show appropriate error messages

5. **Create form structure**
   - Single input field for email/phone
   - Submit button with loading state
   - Error message display
   - Success message display

6. **Handle form submission**
   - Prevent default form behavior
   - Validate contact input
   - Call reset request API (Task 57)
   - Handle success and error states
   - Show appropriate confirmation

7. **Add form accessibility**
   - Proper labels and ARIA attributes
   - Error announcements for screen readers
   - Focus management
   - Keyboard navigation support

### Form State Management

| State | Type | Purpose |
|-------|------|---------|
| contact | string | Email or phone input |
| isLoading | boolean | Submit loading state |
| error | string \| null | Error message |
| success | boolean | Success state |
| resetMethod | 'email' \| 'otp' \| null | Reset method returned |

### Implementation Code

```typescript
// frontend/components/storefront/auth/ForgotPassword/ForgotPasswordForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { requestPasswordReset } from '@/services/storefront/auth/passwordResetService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetMethod, setResetMethod] = useState<'email' | 'otp' | null>(null);

  // Detect if input is email or phone
  const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isPhone = (value: string): boolean => {
    const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  };

  // Validate contact input
  const validateContact = (): boolean => {
    if (!contact.trim()) {
      setError('Please enter your email or phone number');
      return false;
    }

    if (!isEmail(contact) && !isPhone(contact)) {
      setError('Please enter a valid email address or Sri Lankan phone number');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateContact()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call reset request API
      const response = await requestPasswordReset(contact);

      // Set success state and method
      setSuccess(true);
      setResetMethod(response.method);

      // Show confirmation based on method
      // Email confirmation shown in Task 58
      // OTP input shown in Task 60
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If successful, show confirmation (Task 58)
  if (success && resetMethod === 'email') {
    return <EmailSentMessage email={contact} />;
  }

  // If successful with OTP, show OTP input (Task 60)
  if (success && resetMethod === 'otp') {
    return <OTPInput contact={contact} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Contact Input */}
      <div>
        <Label htmlFor="contact">Email or Phone Number</Label>
        <Input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="you@example.com or 0771234567"
          disabled={isLoading}
          required
          aria-describedby={error ? 'contact-error' : undefined}
          className="mt-1"
        />
        {error && (
          <p id="contact-error" className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter the email or phone number associated with your account
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>
    </form>
  );
}
```

### Validation Rules

| Input Type | Validation |
|------------|------------|
| Email | RFC 5322 format |
| Phone | Sri Lankan format (07XXXXXXXX) |
| Required | Cannot be empty |
| Format | Must match email OR phone pattern |

### Expected Outcome
- Functional forgot password form
- Email and phone input validation
- Loading state during submission
- Error handling with clear messages
- Success state transition to confirmation
- Accessible form with proper labels

### Verification Checklist
- [ ] Form accepts email input
- [ ] Form accepts phone input
- [ ] Validation works correctly
- [ ] Error messages displayed
- [ ] Loading state shown during submit
- [ ] Success state triggers next step
- [ ] Accessibility features working

---

## Task 55: Create Email/Phone Input Field

### Overview
Create a smart input field component that automatically detects whether the user is entering an email or phone number and provides appropriate validation feedback and formatting.

### Dependencies
- Task 54: Create Forgot Password Form
- Validation utilities

### Instructions

1. **Create ContactInput.tsx component**
   - Navigate to `frontend/components/storefront/auth/ForgotPassword/`
   - Create new file `ContactInput.tsx`
   - This is a reusable smart input component

2. **Import dependencies**
   ```typescript
   'use client';
   
   import { useState, useEffect } from 'react';
   import { Input } from '@/components/ui/Input';
   import { Label } from '@/components/ui/Label';
   ```

3. **Define component props**
   ```typescript
   interface ContactInputProps {
     value: string;
     onChange: (value: string) => void;
     onValidChange?: (isValid: boolean, type: 'email' | 'phone' | null) => void;
     disabled?: boolean;
     error?: string;
   }
   ```

4. **Implement detection logic**
   - Detect input type as user types
   - Show appropriate placeholder
   - Apply phone number formatting if needed
   - Provide real-time validation feedback

5. **Add visual indicators**
   - Show email icon when email detected
   - Show phone icon when phone detected
   - Display validation status
   - Highlight errors

6. **Format phone numbers**
   - Auto-format Sri Lankan numbers
   - Add spaces for readability
   - Strip formatting on submit
   - Support +94 and 0 prefixes

### Implementation Code

```typescript
// frontend/components/storefront/auth/ForgotPassword/ContactInput.tsx

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail, Phone, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean, type: 'email' | 'phone' | null) => void;
  disabled?: boolean;
  error?: string;
}

export function ContactInput({
  value,
  onChange,
  onValidChange,
  disabled,
  error,
}: ContactInputProps) {
  const [inputType, setInputType] = useState<'email' | 'phone' | null>(null);
  const [isValid, setIsValid] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Sri Lanka)
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
  };

  // Format phone number for display
  const formatPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/\s/g, '');
    
    if (cleanPhone.startsWith('+94')) {
      const number = cleanPhone.substring(3);
      return `+94 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
    
    if (cleanPhone.startsWith('0')) {
      return `${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
    }
    
    return phone;
  };

  // Detect input type and validate
  useEffect(() => {
    if (!value.trim()) {
      setInputType(null);
      setIsValid(false);
      onValidChange?.(false, null);
      return;
    }

    // Detect email
    if (value.includes('@')) {
      setInputType('email');
      const valid = validateEmail(value);
      setIsValid(valid);
      onValidChange?.(valid, 'email');
      return;
    }

    // Detect phone
    if (/^[+0-9\s]/.test(value)) {
      setInputType('phone');
      const valid = validatePhone(value);
      setIsValid(valid);
      onValidChange?.(valid, 'phone');
      return;
    }

    setInputType(null);
    setIsValid(false);
    onValidChange?.(false, null);
  }, [value, onValidChange]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Format phone number as user types
    if (inputType === 'phone' && /^[+0-9]/.test(newValue)) {
      const cleanValue = newValue.replace(/\s/g, '');
      if (cleanValue.length <= 12) {
        onChange(cleanValue);
      }
    } else {
      onChange(newValue);
    }
  };

  // Get display value (formatted for phone)
  const displayValue = inputType === 'phone' ? formatPhone(value) : value;

  return (
    <div className="space-y-1">
      <Label htmlFor="contact">Email or Phone Number</Label>
      <div className="relative">
        {/* Input Field */}
        <Input
          id="contact"
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder="you@example.com or 0771234567"
          disabled={disabled}
          required
          className={cn(
            'pr-20',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />

        {/* Type Indicator & Validation Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputType === 'email' && (
            <Mail className="w-4 h-4 text-gray-400" />
          )}
          {inputType === 'phone' && (
            <Phone className="w-4 h-4 text-gray-400" />
          )}
          
          {value && inputType && (
            <>
              {isValid ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Helper Text */}
      {!error && (
        <p className="text-xs text-gray-500">
          {inputType === 'email' && 'We\'ll send a reset link to your email'}
          {inputType === 'phone' && 'We\'ll send an OTP to your WhatsApp'}
          {!inputType && 'Enter the email or phone associated with your account'}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
```

### Input Detection Logic

| Input Pattern | Detected As | Validation Rule |
|---------------|-------------|-----------------|
| Contains @ | Email | RFC 5322 format |
| Starts with +94 | Phone | 12 digits total |
| Starts with 0 | Phone | 10 digits total |
| Other | Unknown | Not valid |

### Phone Format Examples

| Input | Formatted Display |
|-------|-------------------|
| 0771234567 | 077 123 4567 |
| +94771234567 | +94 77 123 4567 |
| 94771234567 | 947 712 34567 |

### Expected Outcome
- Smart input that detects type
- Real-time validation feedback
- Phone number formatting
- Visual type indicators
- Contextual helper text
- Error state handling

### Verification Checklist
- [ ] Detects email format
- [ ] Detects phone format
- [ ] Shows appropriate icon
- [ ] Formats phone numbers
- [ ] Displays validation status
- [ ] Shows contextual help text
- [ ] Error handling works

---

## Task 56: Implement Reset Request Submit

### Overview
Implement the submission logic for the forgot password form. This handles the API call to request a password reset and manages the response flow for both email and OTP methods.

### Dependencies
- Task 54: Create Forgot Password Form
- Task 55: Create Email/Phone Input Field

### Instructions

1. **Update ForgotPasswordForm component**
   - Add submission handler
   - Implement API call logic
   - Handle loading states
   - Manage error scenarios

2. **Create request payload**
   ```typescript
   interface ResetRequestPayload {
     contact: string;
     contactType: 'email' | 'phone';
   }
   ```

3. **Implement submit handler**
   - Validate input before submission
   - Determine contact type (email or phone)
   - Call password reset API
   - Handle response
   - Update UI based on response

4. **Handle different response types**
   - Email method: Show email sent message
   - OTP method: Show OTP input form
   - Error: Display error message

5. **Add loading states**
   - Disable form during submission
   - Show loading spinner on button
   - Prevent duplicate submissions

6. **Implement error handling**
   - Network errors
   - Validation errors from API
   - Account not found errors
   - Rate limiting errors

### Submission Flow

```
User enters contact
      ↓
Validate input
      ↓
Determine type (email/phone)
      ↓
Submit to API
      ↓
   ┌──┴──┐
   ▼     ▼
Email   OTP
Method Method
   ↓     ↓
Show    Show
Confirm OTP
        Input
```

### Implementation Code

```typescript
// Update to ForgotPasswordForm.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(false);

  // Validate contact input
  if (!contact.trim()) {
    setError('Please enter your email or phone number');
    return;
  }

  // Determine contact type
  const contactType = isEmail(contact) ? 'email' : 'phone';

  // Validate based on type
  if (contactType === 'email' && !isEmail(contact)) {
    setError('Please enter a valid email address');
    return;
  }

  if (contactType === 'phone' && !isPhone(contact)) {
    setError('Please enter a valid Sri Lankan phone number');
    return;
  }

  setIsLoading(true);

  try {
    // Call reset request API (Task 57)
    const response = await requestPasswordReset({
      contact: contact.trim(),
      contactType,
    });

    // Set success state
    setSuccess(true);
    setResetMethod(response.method);

    // Store contact for next steps
    sessionStorage.setItem('reset_contact', contact);
    sessionStorage.setItem('reset_method', response.method);
    
    if (response.method === 'otp') {
      sessionStorage.setItem('reset_token', response.tempToken);
    }

  } catch (err: any) {
    // Handle specific errors
    if (err.status === 404) {
      setError('No account found with this email or phone number');
    } else if (err.status === 429) {
      setError('Too many attempts. Please try again later');
    } else if (err.status === 400) {
      setError(err.message || 'Invalid email or phone number');
    } else {
      setError('Failed to send reset instructions. Please try again');
    }
  } finally {
    setIsLoading(false);
  }
};
```

### Error Handling

| Error Type | Status Code | Message |
|------------|-------------|---------|
| Not Found | 404 | No account found |
| Rate Limited | 429 | Too many attempts |
| Invalid Input | 400 | Invalid email/phone |
| Network Error | - | Connection failed |
| Server Error | 500 | Server error occurred |

### Session Storage Keys

| Key | Purpose | Value |
|-----|---------|-------|
| reset_contact | Store contact for later steps | Email or phone |
| reset_method | Store chosen method | 'email' or 'otp' |
| reset_token | Store temp token for OTP | JWT token |

### Expected Outcome
- Working submit functionality
- Proper validation before submission
- Loading states during API call
- Error handling for all scenarios
- Success flow to next step
- Session data stored for continuity

### Verification Checklist
- [ ] Submit validates input
- [ ] Loading state displayed
- [ ] API called correctly
- [ ] Errors handled gracefully
- [ ] Success transitions to next step
- [ ] Session data stored
- [ ] No duplicate submissions

---

## Task 57: Create Reset Request API

### Overview
Create the API service function that sends the password reset request to the backend. The API determines whether to send an email reset link or an OTP based on the contact type and tenant configuration.

### Dependencies
- Task 56: Implement Reset Request Submit
- Backend password reset endpoint

### Instructions

1. **Create password reset service file**
   - Navigate to `frontend/services/storefront/auth/`
   - Create `passwordResetService.ts`
   - This will house all password reset API functions

2. **Define request/response types**
   ```typescript
   interface ResetRequestPayload {
     contact: string;
     contactType: 'email' | 'phone';
   }

   interface ResetRequestResponse {
     method: 'email' | 'otp';
     message: string;
     tempToken?: string; // For OTP method
   }
   ```

3. **Implement API call**
   - Use fetch or axios
   - Include tenant context in headers
   - Handle authentication
   - Parse response
   - Handle errors

4. **Add error handling**
   - Network errors
   - API errors
   - Validation errors
   - Rate limiting

5. **Implement retry logic**
   - Retry on network failures
   - Exponential backoff
   - Maximum retry attempts

### Implementation Code

```typescript
// frontend/services/storefront/auth/passwordResetService.ts

import { apiClient } from '@/lib/apiClient';

/**
 * Request password reset
 */
export interface ResetRequestPayload {
  contact: string;
  contactType: 'email' | 'phone';
}

export interface ResetRequestResponse {
  method: 'email' | 'otp';
  message: string;
  tempToken?: string;
  expiresAt?: string;
}

export async function requestPasswordReset(
  payload: ResetRequestPayload
): Promise<ResetRequestResponse> {
  try {
    const response = await apiClient.post<ResetRequestResponse>(
      '/api/storefront/auth/forgot-password',
      payload
    );

    return response.data;
  } catch (error: any) {
    // Handle API errors
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || 'Failed to send reset request',
      };
    }

    // Handle network errors
    if (error.request) {
      throw {
        status: 0,
        message: 'Network error. Please check your connection',
      };
    }

    // Handle other errors
    throw {
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Verify OTP code
 */
export interface VerifyOTPPayload {
  contact: string;
  otp: string;
  tempToken: string;
}

export interface VerifyOTPResponse {
  resetToken: string;
  expiresAt: string;
  message: string;
}

export async function verifyOTP(
  payload: VerifyOTPPayload
): Promise<VerifyOTPResponse> {
  try {
    const response = await apiClient.post<VerifyOTPResponse>(
      '/api/storefront/auth/verify-otp',
      payload
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || 'Invalid or expired OTP',
      };
    }

    throw {
      status: 500,
      message: 'Failed to verify OTP',
    };
  }
}

/**
 * Resend OTP code
 */
export interface ResendOTPPayload {
  contact: string;
  tempToken: string;
}

export interface ResendOTPResponse {
  message: string;
  expiresAt: string;
  canResendAt: string;
}

export async function resendOTP(
  payload: ResendOTPPayload
): Promise<ResendOTPResponse> {
  try {
    const response = await apiClient.post<ResendOTPResponse>(
      '/api/storefront/auth/resend-otp',
      payload
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || 'Failed to resend OTP',
      };
    }

    throw {
      status: 500,
      message: 'Failed to resend OTP',
    };
  }
}

/**
 * Reset password with token
 */
export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  redirectUrl?: string;
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  try {
    const response = await apiClient.post<ResetPasswordResponse>(
      '/api/storefront/auth/reset-password',
      payload
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        message: error.response.data?.message || 'Failed to reset password',
      };
    }

    throw {
      status: 500,
      message: 'Failed to reset password',
    };
  }
}
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/storefront/auth/forgot-password | POST | Request reset |
| /api/storefront/auth/verify-otp | POST | Verify OTP |
| /api/storefront/auth/resend-otp | POST | Resend OTP |
| /api/storefront/auth/reset-password | POST | Reset password |

### Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Type | application/json | JSON payload |
| X-Tenant-ID | {tenant-id} | Tenant context |
| Accept | application/json | JSON response |

### Response Format

**Email Method:**
```json
{
  "method": "email",
  "message": "Password reset link sent to your email"
}
```

**OTP Method:**
```json
{
  "method": "otp",
  "message": "OTP sent to your WhatsApp",
  "tempToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expiresAt": "2026-01-31T10:45:00Z"
}
```

### Expected Outcome
- Working API service functions
- Proper error handling
- Type-safe requests and responses
- Retry logic for network failures
- Clean error messages
- Session token management

### Verification Checklist
- [ ] API functions created
- [ ] Request types defined
- [ ] Response types defined
- [ ] Error handling implemented
- [ ] Network errors handled
- [ ] API client configured
- [ ] Types exported correctly

---

## Task 58: Create Email Sent Confirmation

### Overview
Create a confirmation message component that displays after successfully requesting a password reset via email. Shows a success message with instructions to check email and spam folder.

### Dependencies
- Task 57: Create Reset Request API
- Task 54: Create Forgot Password Form

### Instructions

1. **Create EmailSentMessage component**
   - Navigate to `frontend/components/storefront/auth/ForgotPassword/`
   - Create `EmailSentMessage.tsx`
   - This replaces the form after successful submission

2. **Import dependencies**
   ```typescript
   import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
   import Link from 'next/link';
   import { Button } from '@/components/ui/Button';
   ```

3. **Define component props**
   ```typescript
   interface EmailSentMessageProps {
     email: string;
   }
   ```

4. **Create success message structure**
   - Show success icon
   - Display confirmation heading
   - Show email address
   - Provide clear instructions
   - Add spam folder reminder
   - Include back to login link
   - Add resend option

5. **Add helpful information**
   - Email delivery time (usually a few minutes)
   - Spam folder check reminder
   - Support contact information
   - Link expiration notice

### Implementation Code

```typescript
// frontend/components/storefront/auth/ForgotPassword/EmailSentMessage.tsx

import { Mail, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface EmailSentMessageProps {
  email: string;
  onResend?: () => Promise<void>;
}

export function EmailSentMessage({ email, onResend }: EmailSentMessageProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    if (!onResend) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      await onResend();
      setResendSuccess(true);
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Check Your Email
      </h2>

      {/* Email Display */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
        <Mail className="w-4 h-4" />
        <span className="font-medium">{email}</span>
      </div>

      {/* Instructions */}
      <div className="space-y-3 text-sm text-gray-600 mb-6">
        <p>
          We've sent a password reset link to your email address.
          Click the link in the email to reset your password.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
          <p className="font-medium text-blue-900 mb-1">
            📧 Didn't receive the email?
          </p>
          <ul className="space-y-1 text-blue-800 text-xs">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• The email may take a few minutes to arrive</li>
            <li>• Check all tabs in your inbox (Promotions, Updates, etc.)</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500">
          The reset link will expire in <strong>1 hour</strong> for security reasons.
        </p>
      </div>

      {/* Resend Success Message */}
      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Email sent successfully!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {/* Resend Button */}
        {onResend && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending || resendSuccess}
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Email Sent
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Email
              </>
            )}
          </Button>
        )}

        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>
      </div>

      {/* Support Link */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Still having trouble?{' '}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
```

### Message Structure

```
┌─────────────────────────────────────┐
│         ✓ (Success Icon)            │
│                                     │
│      Check Your Email               │ (h2)
│      📧 user@example.com            │
│                                     │
│   We've sent a password reset...   │
│                                     │
│   ┌─────────────────────────┐     │
│   │ 📧 Didn't receive?      │     │
│   │ • Check spam            │     │
│   │ • Verify email          │     │
│   │ • Wait a few minutes    │     │
│   └─────────────────────────┘     │
│                                     │
│   Link expires in 1 hour           │
│                                     │
│   [Resend Email]                   │
│   ← Back to login                  │
│                                     │
│   Still having trouble? Contact... │
└─────────────────────────────────────┘
```

### Content Guidelines

| Element | Content |
|---------|---------|
| Heading | "Check Your Email" |
| Icon | Green checkmark in circle |
| Email Display | Show user's email |
| Instructions | Clear, step-by-step |
| Spam Reminder | Prominent blue box |
| Expiry Notice | 1 hour expiration |
| Support Link | At bottom |

### Expected Outcome
- Clear success confirmation
- User's email displayed
- Helpful troubleshooting tips
- Resend option available
- Easy navigation back
- Professional appearance

### Verification Checklist
- [ ] Success icon displayed
- [ ] Email shown correctly
- [ ] Instructions clear
- [ ] Spam reminder visible
- [ ] Resend button works
- [ ] Back link functional
- [ ] Support link present

---

## Task 59: Create Reset Password Page

### Overview
Create the reset password page where users arrive after clicking the reset link in their email or after successfully verifying their OTP. This page contains the form to set a new password.

### Dependencies
- Task 58: Create Email Sent Confirmation
- Email reset link functionality

### Instructions

1. **Create reset password page**
   - Navigate to `frontend/app/(storefront)/`
   - Create `reset-password/` directory
   - Create `page.tsx` in reset-password directory

2. **Handle URL parameters**
   - Extract reset token from URL query params
   - Validate token presence
   - Show error if token missing or invalid

3. **Define page metadata**
   ```typescript
   export const metadata: Metadata = {
     title: 'Reset Password | LankaCommerce Cloud',
     description: 'Create a new password for your account',
   };
   ```

4. **Create page component**
   - Display LCC brand
   - Show reset password title
   - Include security icon
   - Display reset password form
   - Add password requirements

5. **Implement token validation**
   - Check if token exists in URL
   - Verify token is not expired
   - Show error message if invalid
   - Provide link to request new reset

6. **Add security messaging**
   - Explain password requirements
   - Show password strength indicator
   - Remind about security best practices

### Implementation Code

```typescript
// frontend/app/(storefront)/reset-password/page.tsx

import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/storefront/auth/ResetPassword/ResetPasswordForm';
import { Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export const metadata: Metadata = {
  title: 'Reset Password | LankaCommerce Cloud',
  description: 'Create a new password for your account',
};

function ResetPasswordContent() {
  // Get token from URL
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const token = searchParams.get('token');

  // If no token, show error
  if (!token) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Invalid Reset Link
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          This password reset link is invalid or has expired.
          Please request a new password reset.
        </p>

        <div className="space-y-3">
          <Link
            href="/forgot-password"
            className="inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request New Reset Link
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Lanka<span className="text-blue-600">Commerce</span> Cloud
          </h1>
          <p className="text-sm text-gray-500 mt-1">Customer Portal</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Security Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create New Password
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Your new password must be different from previously used passwords
            </p>
          </div>

          {/* Reset Password Form */}
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>

        {/* Security Notice */}
        <div className="mt-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              For your security, this reset link will expire in 1 hour.
              Your password will be encrypted and securely stored.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
```

### Page Structure

```
┌─────────────────────────────────────┐
│         LCC Logo (Brand)            │
│                                     │
│      🛡️ (Security Icon)            │
│                                     │
│      Create New Password            │ (h2)
│      Must be different from         │
│      previously used passwords      │
│                                     │
│      ┌─────────────────────┐       │
│      │ ResetPasswordForm   │       │
│      │ (Created in Task 60)│       │
│      └─────────────────────┘       │
│                                     │
│   🛡️ Link expires in 1 hour        │
│                                     │
└─────────────────────────────────────┘
```

### URL Structure

| URL | Purpose |
|-----|---------|
| /reset-password?token=abc123 | Valid reset link |
| /reset-password | No token (error) |

### Expected Outcome
- Reset password page accessible
- Token extracted from URL
- Invalid token handled gracefully
- Security messaging displayed
- Ready for reset form component
- Professional appearance

### Verification Checklist
- [ ] Page accessible at URL
- [ ] Token extracted from query
- [ ] Invalid token shows error
- [ ] Brand displayed correctly
- [ ] Security icon present
- [ ] Title and description clear
- [ ] Ready for form component

---

## Task 60: Create New Password Form

### Overview
Create the reset password form component where users enter and confirm their new password. Includes password strength validation, visibility toggle, and requirements display.

### Dependencies
- Task 59: Create Reset Password Page
- Password validation utilities

### Instructions

1. **Create ResetPasswordForm component**
   - Navigate to `frontend/components/storefront/auth/ResetPassword/`
   - Create `ResetPasswordForm.tsx`
   - Accept reset token as prop

2. **Define form state**
   ```typescript
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   ```

3. **Implement password validation**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
   - Passwords must match

4. **Create password strength indicator**
   - Weak: Basic requirements only
   - Medium: Most requirements met
   - Strong: All requirements met
   - Visual indicator with colors

5. **Add password requirements display**
   - Show all requirements
   - Mark met requirements with checkmarks
   - Mark unmet requirements with X
   - Update in real-time

6. **Implement form submission**
   - Validate passwords
   - Check passwords match
   - Call reset password API
   - Handle success and errors
   - Redirect on success

### Implementation Code

```typescript
// frontend/components/storefront/auth/ResetPassword/ResetPasswordForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { resetPassword } from '@/services/storefront/auth/passwordResetService';
import { Eye, EyeOff, AlertCircle, CheckCircle2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResetPasswordFormProps {
  token: string;
}

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
  { id: 'uppercase', label: 'One uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'One lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'One number', test: (pwd: string) => /\d/.test(pwd) },
  { id: 'special', label: 'One special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check password strength
  const passwordStrength = () => {
    const metRequirements = PASSWORD_REQUIREMENTS.filter(req => req.test(newPassword)).length;
    if (metRequirements <= 2) return { label: 'Weak', color: 'red', value: 33 };
    if (metRequirements <= 4) return { label: 'Medium', color: 'yellow', value: 66 };
    return { label: 'Strong', color: 'green', value: 100 };
  };

  const strength = newPassword ? passwordStrength() : null;

  // Validate form
  const validateForm = (): boolean => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    const unmetRequirements = PASSWORD_REQUIREMENTS.filter(req => !req.test(newPassword));
    if (unmetRequirements.length > 0) {
      setError('Password does not meet all requirements');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        resetToken: token,
        newPassword,
        confirmPassword,
      });

      // Success - redirect to login
      router.push('/login?reset=success');
    } catch (err: any) {
      if (err.status === 400) {
        setError('Invalid or expired reset link');
      } else if (err.status === 422) {
        setError(err.message || 'Password does not meet requirements');
      } else {
        setError('Failed to reset password. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* New Password Field */}
      <div>
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative mt-1">
          <Input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isLoading}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {strength && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Password strength:</span>
              <span className={cn(
                'text-xs font-medium',
                strength.color === 'red' && 'text-red-600',
                strength.color === 'yellow' && 'text-yellow-600',
                strength.color === 'green' && 'text-green-600'
              )}>
                {strength.label}
              </span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  strength.color === 'red' && 'bg-red-500',
                  strength.color === 'yellow' && 'bg-yellow-500',
                  strength.color === 'green' && 'bg-green-500'
                )}
                style={{ width: `${strength.value}%` }}
              />
            </div>
          </div>
        )}

        {/* Password Requirements */}
        {newPassword && (
          <div className="mt-3 space-y-1">
            {PASSWORD_REQUIREMENTS.map((req) => {
              const met = req.test(newPassword);
              return (
                <div key={req.id} className="flex items-center gap-2 text-xs">
                  {met ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-400" />
                  )}
                  <span className={met ? 'text-green-600' : 'text-gray-600'}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative mt-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isLoading}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {newPassword === confirmPassword ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3 text-red-500" />
                <span className="text-red-600">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !newPassword || !confirmPassword}
        loading={isLoading}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>
    </form>
  );
}
```

### Password Requirements

| Requirement | Rule | Icon |
|-------------|------|------|
| Length | 8+ characters | ✓/✗ |
| Uppercase | A-Z | ✓/✗ |
| Lowercase | a-z | ✓/✗ |
| Number | 0-9 | ✓/✗ |
| Special | !@#$%^&* | ✓/✗ |

### Password Strength Levels

| Strength | Requirements Met | Color | Width |
|----------|------------------|-------|-------|
| Weak | 0-2 | Red | 33% |
| Medium | 3-4 | Yellow | 66% |
| Strong | 5 | Green | 100% |

### Expected Outcome
- Working password reset form
- Real-time password validation
- Strength indicator display
- Requirements checklist
- Password visibility toggle
- Match validation
- Successful password reset

### Verification Checklist
- [ ] Form accepts password input
- [ ] Strength indicator works
- [ ] Requirements display correctly
- [ ] Passwords match validation
- [ ] Visibility toggle functions
- [ ] Submit calls API
- [ ] Success redirects to login
- [ ] Errors handled properly

---

## Task 61: Implement Reset Password API

### Overview
Create the final API call that submits the new password with the reset token to the backend. Handle success with redirect to login page with a success message.

### Dependencies
- Task 60: Create New Password Form
- Backend reset password endpoint

### Instructions

1. **Update password reset service**
   - Add resetPassword function to service
   - Accept reset token and new password
   - Return success response
   - Handle errors

2. **Implement API call**
   ```typescript
   POST /api/storefront/auth/reset-password
   Body: {
     resetToken: string,
     newPassword: string,
     confirmPassword: string
   }
   ```

3. **Handle success response**
   - Clear session storage
   - Store success flag
   - Redirect to login page
   - Show success message on login page

4. **Handle error scenarios**
   - Invalid or expired token
   - Password validation errors
   - Network errors
   - Server errors

5. **Add success redirect logic**
   - Navigate to /login?reset=success
   - Pass success message
   - Auto-focus login form

6. **Update login page**
   - Check for reset=success query param
   - Display success alert
   - Auto-dismiss after 5 seconds

### API Implementation

```typescript
// Already implemented in Task 57
// See passwordResetService.ts - resetPassword function
```

### Success Flow Implementation

```typescript
// frontend/components/storefront/auth/ResetPassword/ResetPasswordForm.tsx

// On successful password reset
try {
  await resetPassword({
    resetToken: token,
    newPassword,
    confirmPassword,
  });

  // Clear any reset-related session data
  sessionStorage.removeItem('reset_contact');
  sessionStorage.removeItem('reset_method');
  sessionStorage.removeItem('reset_token');

  // Redirect to login with success message
  router.push('/login?reset=success');
  
} catch (err: any) {
  // Handle errors
}
```

### Login Page Success Message

```typescript
// frontend/app/(storefront)/login/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setShowSuccess(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div>
      {showSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Password reset successful! You can now log in with your new password.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Rest of login page */}
    </div>
  );
}
```

### API Response Handling

**Success Response:**
```json
{
  "message": "Password reset successful",
  "redirectUrl": "/login"
}
```

**Error Responses:**

| Status | Error | Message |
|--------|-------|---------|
| 400 | Invalid Token | Token is invalid or expired |
| 422 | Validation Error | Password doesn't meet requirements |
| 429 | Rate Limited | Too many attempts |
| 500 | Server Error | Internal server error |

### Session Cleanup

| Key | Action |
|-----|--------|
| reset_contact | Remove |
| reset_method | Remove |
| reset_token | Remove |

### Expected Outcome
- Password reset API functional
- Success redirects to login
- Success message displayed
- Session data cleaned up
- Errors handled gracefully
- Complete reset flow working

### Verification Checklist
- [ ] API call implemented
- [ ] Success redirects correctly
- [ ] Success message shows on login
- [ ] Session data cleared
- [ ] Errors handled properly
- [ ] Login page accepts new password
- [ ] Complete flow tested

---

## Testing & Verification

### Complete Flow Test

1. **Navigate to forgot password**
   - Go to `/forgot-password`
   - Page loads correctly
   - Form displayed

2. **Enter email address**
   - Enter valid email
   - Validation passes
   - Submit form

3. **Receive confirmation**
   - Email sent message displayed
   - User's email shown
   - Instructions clear

4. **Check email (or skip to reset)**
   - Email received (in real scenario)
   - Reset link valid
   - Click link to reset page

5. **Reset password page**
   - Page loads with token
   - Form displayed
   - Security messaging shown

6. **Enter new password**
   - Password meets requirements
   - Strength indicator updates
   - Passwords match

7. **Submit reset**
   - API called successfully
   - Redirect to login
   - Success message displayed

8. **Log in with new password**
   - Login form ready
   - New password works
   - Access granted

### Edge Cases to Test

| Scenario | Expected Behavior |
|----------|-------------------|
| No token in URL | Show error message |
| Expired token | Invalid link error |
| Weak password | Requirements not met |
| Passwords don't match | Validation error |
| Network failure | Retry or error message |
| Already used token | Token invalid error |

### Validation Tests

| Test | Input | Expected |
|------|-------|----------|
| Valid email | user@example.com | Success |
| Invalid email | invalid-email | Validation error |
| Valid phone | 0771234567 | Success |
| Invalid phone | 123456 | Validation error |
| Short password | Pass1! | Requirements not met |
| Weak password | password | Strength: Weak |
| Strong password | P@ssw0rd123! | Strength: Strong |

---

## Summary

### What We Built

This document covered the complete email-based password reset flow:

1. **Forgot Password Page** - Clean interface for initiating reset
2. **Forgot Password Form** - Email/phone input with validation
3. **Contact Input Field** - Smart detection and validation
4. **Request Submit** - API call with loading and error states
5. **Reset Request API** - Service functions for all APIs
6. **Email Confirmation** - Success message with instructions
7. **Reset Password Page** - Secure page for new password
8. **New Password Form** - Password input with strength indicator
9. **Reset Password API** - Final submission and success redirect

### Key Features

- **Smart Input Detection** - Automatically detects email vs phone
- **Real-time Validation** - Immediate feedback on input
- **Password Strength** - Visual indicator with requirements
- **Error Handling** - Comprehensive error scenarios covered
- **Security Messaging** - Clear communication about security
- **Success Flow** - Smooth transition to login after reset
- **Accessibility** - Full keyboard and screen reader support

### Files Created

```
frontend/
├── app/
│   └── (storefront)/
│       ├── forgot-password/
│       │   └── page.tsx
│       └── reset-password/
│           └── page.tsx
├── components/
│   └── storefront/
│       └── auth/
│           ├── ForgotPassword/
│           │   ├── ForgotPasswordForm.tsx
│           │   ├── ContactInput.tsx
│           │   └── EmailSentMessage.tsx
│           └── ResetPassword/
│               └── ResetPasswordForm.tsx
└── services/
    └── storefront/
        └── auth/
            └── passwordResetService.ts
```

### Next Steps

Continue to [02_Tasks-62-68_WhatsApp-OTP-Verification.md](02_Tasks-62-68_WhatsApp-OTP-Verification.md) for:
- WhatsApp OTP option
- 6-digit OTP input
- OTP verification API
- Resend OTP with countdown
- Complete password reset flow verification

---

**Document Complete** ✓
