# Tasks 71-76: 2FA Setup & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 06 - Authentication UI  
> **Group:** E - Email Verification & 2FA  
> **Document:** 02 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-70_Email-Verification.md](01_Tasks-63-70_Email-Verification.md)

---

## Document Overview

This document covers the complete two-factor authentication (2FA) implementation including the setup page with QR code generation, the verification page with OTP input, specialized components for OTP entry and backup codes display, and comprehensive testing of all email verification and 2FA flows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create 2FA Setup Page | Medium | 35 min |
| 72 | Create 2FA Verification Page | Medium | 30 min |
| 73 | Create OTP Input Component | Medium | 40 min |
| 74 | Create Backup Codes Display | Low | 25 min |
| 75 | Implement 2FA Verification | Medium | 35 min |
| 76 | Test Email & 2FA Flows | Low | 45 min |

---

## Task 71: Create 2FA Setup Page

### Overview
Create the 2FA setup page that allows users to enable two-factor authentication on their account. This page displays a QR code for authenticator apps, shows a manual entry code, provides an input to verify the first OTP, and generates backup codes upon successful setup.

### Dependencies
- Task 14: Verify Auth Layout Structure

### Instructions

1. **Create two-factor setup directory structure**
   - Navigate to `frontend/app/(auth)/` directory
   - Create `two-factor/` directory
   - Create `setup/` directory inside `two-factor/`
   - Create `page.tsx` file inside `setup/`

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for QR code generation and form handling

3. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import useRouter from next/navigation
   - Import AuthCard and AuthHeading components
   - Import UI components (Button, Input, Card)
   - Import BackupCodesDisplay component (Task 74)
   - Import QR code library (qrcode.react or similar)

4. **Set up page state**
   - Create state for 2FA secret (TOTP secret)
   - Create state for QR code data URL
   - Create state for OTP input value
   - Create state for setup status (idle, verifying, success)
   - Create state for backup codes array
   - Create state for error message

5. **Create setup initialization**
   - Define useEffect to fetch 2FA setup data on mount
   - Call backend API to generate TOTP secret
   - Receive secret and QR code URL
   - Update state with received data

6. **Implement QR code display**
   - Show QR code image from backend or generate client-side
   - Use QRCode component with TOTP URL
   - Format: `otpauth://totp/AppName:user@email?secret=SECRET&issuer=AppName`
   - Center QR code on page

7. **Add manual entry code display**
   - Show the secret key in readable format
   - Break into groups of 4 characters
   - Add copy button for secret
   - Explain this is for manual entry in authenticator apps

8. **Create verification input**
   - Add input field for 6-digit OTP
   - Label: "Verify Authenticator"
   - Placeholder: "Enter 6-digit code"
   - Input type: text or number
   - Max length: 6 digits

9. **Add setup instructions**
   - Step 1: Scan QR code with authenticator app
   - Step 2: Or enter the secret key manually
   - Step 3: Enter the 6-digit code to verify
   - List compatible authenticator apps (Google Authenticator, Authy, etc.)

10. **Implement verify button**
    - Label: "Verify and Enable 2FA"
    - Disabled when OTP is not 6 digits
    - Show loading state during verification
    - Click triggers verification API call

11. **Handle successful setup**
    - On successful verification, receive backup codes
    - Update state to show backup codes
    - Hide QR code and input
    - Show BackupCodesDisplay component (Task 74)
    - Mark 2FA as enabled in user profile

12. **Add error handling**
    - Show error message for invalid OTP
    - Allow retry without regenerating secret
    - Handle API errors gracefully

### Page Structure (Before Verification)

```
┌────────────────────────────────────────┐
│   Enable Two-Factor Authentication     │
│   Add extra security to your account   │
│                                        │
│   Step 1: Scan QR Code                 │
│   ┌────────────────┐                   │
│   │                │                   │
│   │   [QR CODE]    │                   │
│   │                │                   │
│   └────────────────┘                   │
│                                        │
│   Step 2: Or Enter Manually            │
│   Secret Key: ABCD EFGH IJKL MNOP      │
│   [Copy]                               │
│                                        │
│   Step 3: Verify Code                  │
│   ┌────────────────────────────────┐   │
│   │ Enter 6-digit code             │   │
│   └────────────────────────────────┘   │
│                                        │
│   [Verify and Enable 2FA]              │
│                                        │
│   Compatible Apps:                     │
│   • Google Authenticator               │
│   • Microsoft Authenticator            │
│   • Authy                              │
└────────────────────────────────────────┘
```

### Page Structure (After Verification)

```
┌────────────────────────────────────────┐
│   2FA Enabled Successfully!            │
│                                        │
│   ✓ Two-factor authentication is now   │
│     active on your account             │
│                                        │
│   Backup Codes                         │
│   ┌────────────────────────────────┐   │
│   │ [BackupCodesDisplay Component] │   │
│   │ Shows 8 backup codes           │   │
│   │ Download and copy options      │   │
│   └────────────────────────────────┘   │
│                                        │
│   [Continue to Dashboard]              │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/two-factor/setup/page.tsx` | `/two-factor/setup` | Enable 2FA |

### TOTP URL Format

```
otpauth://totp/LankaCommerce:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=LankaCommerce
```

| Component | Value | Purpose |
|-----------|-------|---------|
| Protocol | otpauth://totp/ | TOTP type |
| Label | LankaCommerce:user@example.com | Display name |
| secret | JBSWY3DPEHPK3PXP | TOTP secret key |
| issuer | LankaCommerce | App name |

### Setup API Flow

```
Component Mount
    │
    ▼
Fetch 2FA Setup Data
    │
    ▼
Backend Generates Secret
    │
    ▼
Return Secret + QR URL
    │
    ▼
Display QR Code + Manual Key
    │
    ▼
User Scans QR Code
    │
    ▼
User Enters OTP
    │
    ▼
Submit for Verification (Task 75)
    │
    ├──────────────────┐
    ▼                  ▼
Success            Failure
    │                  │
    ▼                  ▼
Show Backup     Show Error
Codes           + Retry
```

### Setup State Management

| Variable | Type | Purpose |
|----------|------|---------|
| secret | string \| null | TOTP secret key |
| qrCodeUrl | string \| null | QR code data URL |
| otpInput | string | User-entered OTP |
| setupStatus | 'idle' \| 'verifying' \| 'success' | Current state |
| backupCodes | string[] | Generated backup codes |
| error | string \| null | Error message |

### Authenticator App Compatibility

| App | Platform | Notes |
|-----|----------|-------|
| Google Authenticator | iOS, Android | Most popular |
| Microsoft Authenticator | iOS, Android | Push notifications |
| Authy | iOS, Android, Desktop | Cloud backup |
| 1Password | All platforms | Password manager integration |
| LastPass Authenticator | iOS, Android | Password manager integration |

### Manual Key Display Format

| Format | Example | Purpose |
|--------|---------|---------|
| Raw | JBSWY3DPEHPK3PXP | Complete secret |
| Grouped | JBSW Y3DP EHPK 3PXP | Easier to read |
| Copy Button | [Copy] | Quick copy to clipboard |

### Expected Outcome
- Functional 2FA setup page
- QR code displayed for scanning
- Manual entry option available
- Verification input ready
- Clear step-by-step instructions
- Success state shows backup codes

### Verification Checklist
- [ ] Directory structure created: `app/(auth)/two-factor/setup/`
- [ ] `page.tsx` file created
- [ ] 'use client' directive added
- [ ] State variables defined
- [ ] API call to fetch 2FA setup data
- [ ] QR code displayed
- [ ] Manual secret key displayed with copy button
- [ ] Verification OTP input added
- [ ] Verify button implemented
- [ ] Setup instructions displayed
- [ ] Success state shows backup codes
- [ ] Error handling implemented

---

## Task 72: Create 2FA Verification Page

### Overview
Create the 2FA verification page that is shown during login when a user has 2FA enabled. This page prompts the user to enter their 6-digit OTP from their authenticator app, includes an option to use backup codes, and handles verification through the backend API.

### Dependencies
- Task 71: Create 2FA Setup Page

### Instructions

1. **Create verify page file**
   - Navigate to `frontend/app/(auth)/two-factor/` directory
   - Create `verify/` directory
   - Create `page.tsx` file inside `verify/`

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for OTP input and form handling

3. **Import required dependencies**
   - Import React hooks (useState, useEffect, useRef)
   - Import useRouter and useSearchParams from next/navigation
   - Import AuthCard and AuthHeading components
   - Import OTPInput component (to be created in Task 73)
   - Import UI components (Button, Alert)

4. **Set up page state**
   - Create state for OTP value (6 digits)
   - Create state for verification status (idle, verifying, error)
   - Create state for error message
   - Create state for show backup code input toggle
   - Create state for backup code value

5. **Extract session token from URL**
   - Use useSearchParams to get session or temp token
   - This token is provided by login flow when 2FA is required
   - Store in component state or ref

6. **Create page structure**
   - Define default export function `TwoFactorVerifyPage`
   - Wrap content in AuthCard component
   - Add AuthHeading with title "Two-Factor Authentication"
   - Add subtitle explaining verification requirement

7. **Implement OTP input section**
   - Use OTPInput component (Task 73)
   - Pass value and onChange handler
   - Auto-submit when 6 digits entered
   - Clear input on error

8. **Add verify button**
   - Label: "Verify"
   - Enabled when OTP is exactly 6 digits
   - Show loading state during verification
   - Trigger verification API call (Task 75)

9. **Implement backup code option**
   - Add toggle link: "Use backup code instead"
   - Show/hide backup code input when clicked
   - Backup code input: text field for 8-character code
   - Separate submit button for backup code

10. **Add informational text**
    - Explain where to find the code (authenticator app)
    - Mention backup codes as alternative
    - Link to support if user lost access

11. **Handle verification success**
    - On successful verification, redirect to intended destination
    - Default: redirect to dashboard
    - Use router.push with URL from query params or default

12. **Handle verification failure**
    - Display error message
    - Clear OTP input for retry
    - Allow unlimited retries (backend may rate limit)
    - Suggest backup codes if multiple failures

### Page Structure (OTP Mode)

```
┌────────────────────────────────────────┐
│   Two-Factor Authentication            │
│   Enter the code from your             │
│   authenticator app                    │
│                                        │
│   ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐            │
│   │ │ │ │ │ │ │ │ │ │ │ │  (OTP)    │
│   └─┘ └─┘ └─┘ └─┘ └─┘ └─┘            │
│                                        │
│   [Verify]                             │
│                                        │
│   Can't access your authenticator?     │
│   [Use backup code instead]            │
│                                        │
│   [Error Alert - if any]               │
└────────────────────────────────────────┘
```

### Page Structure (Backup Code Mode)

```
┌────────────────────────────────────────┐
│   Two-Factor Authentication            │
│   Enter a backup code                  │
│                                        │
│   Backup Code                          │
│   ┌────────────────────────────────┐   │
│   │ XXXX-XXXX                      │   │
│   └────────────────────────────────┘   │
│                                        │
│   [Verify Backup Code]                 │
│                                        │
│   [Use authenticator code instead]     │
│                                        │
│   Lost your backup codes?              │
│   [Contact Support]                    │
└────────────────────────────────────────┘
```

### URL Mapping

| File Path | URL | Purpose |
|-----------|-----|---------|
| `app/(auth)/two-factor/verify/page.tsx` | `/two-factor/verify?session=xyz` | Verify 2FA during login |

### URL Parameters

| Parameter | Example | Purpose |
|-----------|---------|---------|
| session | abc123temp | Temporary session token |
| redirect | /dashboard | Post-verification redirect |

### Verification Flow

```
Login Success + 2FA Enabled
    │
    ▼
Redirect to /two-factor/verify
    │
    ▼
Display OTP Input
    │
    ▼
User Enters 6-digit OTP
    │
    ▼
Submit OTP (Task 75)
    │
    ├──────────────────┐
    ▼                  ▼
Success            Failure
    │                  │
    ▼                  ▼
Redirect to     Show Error
Intended Page   + Allow Retry
                    │
                    ▼
                Suggest Backup Code
```

### Page State Management

| Variable | Type | Purpose |
|----------|------|---------|
| otpValue | string | Current OTP input (0-6 digits) |
| verificationStatus | 'idle' \| 'verifying' \| 'error' | Current state |
| errorMessage | string \| null | Error to display |
| showBackupCode | boolean | Toggle backup code input |
| backupCodeValue | string | Backup code input |
| sessionToken | string \| null | Temporary session from URL |

### Input Modes

| Mode | Input Type | Length | Format |
|------|------------|--------|--------|
| OTP | 6 separate inputs | 6 digits | 123456 |
| Backup Code | Single input | 8-9 chars | XXXX-XXXX |

### Error Messages

| Scenario | Message |
|----------|---------|
| Invalid OTP | "Invalid code. Please try again." |
| Expired Session | "Session expired. Please log in again." |
| Rate Limited | "Too many attempts. Please try again in a few minutes." |
| Network Error | "Connection error. Please check your internet connection." |

### Backup Code Guidance

| Scenario | Guidance |
|----------|----------|
| First Failure | Show OTP error, allow retry |
| Multiple Failures | Suggest using backup code |
| Lost Codes | Link to account recovery support |

### Expected Outcome
- Functional 2FA verification page
- OTP input for 6-digit codes
- Backup code input as alternative
- Clear instructions and error messages
- Successful verification redirects to intended page

### Verification Checklist
- [ ] Directory created: `app/(auth)/two-factor/verify/`
- [ ] `page.tsx` file created
- [ ] 'use client' directive added
- [ ] State variables defined
- [ ] Session token extracted from URL
- [ ] OTPInput component integrated (Task 73)
- [ ] Verify button implemented
- [ ] Backup code toggle added
- [ ] Backup code input implemented
- [ ] Success handling with redirect
- [ ] Error handling with clear messages
- [ ] Page accessible at `/two-factor/verify`

---

## Task 73: Create OTP Input Component

### Overview
Create a specialized OTP (One-Time Password) input component with 6 separate input fields. This component provides an excellent user experience with features like auto-focus advancement, backspace handling, paste support, and automatic submission when all 6 digits are entered.

### Dependencies
- Task 72: Create 2FA Verification Page

### Instructions

1. **Create OTPInput component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `OTPInput.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for refs and DOM manipulation

3. **Import required dependencies**
   - Import React hooks (useRef, useState, useEffect)
   - Import UI components if needed (Input from Shadcn/UI)
   - Import keyboard event types

4. **Define component props interface**
   - value: string (current OTP value, 0-6 characters)
   - onChange: (value: string) => void (callback with new value)
   - onComplete: optional (value: string) => void (called when 6 digits entered)
   - disabled: optional boolean (disable all inputs)
   - hasError: optional boolean (show error state styling)

5. **Set up refs for inputs**
   - Create ref array for 6 input elements
   - Use useRef<HTMLInputElement[]>
   - Initialize array in component

6. **Create local state**
   - Store individual digit values in array
   - Use value prop to initialize digits
   - Update when value prop changes

7. **Implement input rendering**
   - Render 6 separate input elements
   - Each input holds one digit
   - Apply consistent styling
   - Set maxLength to 1 per input

8. **Add auto-focus logic**
   - When user enters digit in input, focus next input
   - Use refs to call focus() on next element
   - Only advance if input is filled

9. **Implement backspace handling**
   - When user presses backspace on empty input, focus previous
   - Clear current input and move back
   - Allow editing previous digits

10. **Add paste support**
    - Listen for paste event on first input
    - Extract numeric characters from pasted text
    - Distribute digits across 6 inputs
    - Take first 6 digits if more pasted
    - Focus appropriate input after paste

11. **Implement onChange callback**
    - Collect all 6 digits into single string
    - Call onChange prop with combined value
    - Fire on every digit change

12. **Add onComplete logic**
    - Check if all 6 inputs are filled
    - If yes and onComplete exists, call it
    - Pass complete 6-digit value
    - Useful for auto-submission

13. **Apply styling and states**
    - Default state: neutral border
    - Focus state: highlighted border
    - Error state: red border (if hasError prop true)
    - Disabled state: gray background
    - Use Tailwind CSS classes

14. **Add accessibility attributes**
    - Set inputMode="numeric" for mobile keyboards
    - Set pattern="[0-9]*" for numeric input
    - Add aria-label for each input
    - Set autocomplete="off"

15. **Handle edge cases**
    - Non-numeric input: ignore or filter
    - Empty value prop: clear all inputs
    - Focus first empty input on mount

### Component Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current OTP value (0-6 chars) |
| onChange | (value: string) => void | Yes | - | Callback when value changes |
| onComplete | (value: string) => void | No | undefined | Called when 6 digits entered |
| disabled | boolean | No | false | Disable all inputs |
| hasError | boolean | No | false | Show error styling |
| className | string | No | "" | Additional CSS classes |

### Component Structure

```
┌─────────────────────────────────────┐
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 ││
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘│
│   [0]   [1]   [2]   [3]   [4]   [5] │
└─────────────────────────────────────┘
   ↑ Individual input boxes with indices
```

### Input Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| type | text | Allow inputMode |
| maxLength | 1 | Single digit |
| inputMode | numeric | Mobile numeric keyboard |
| pattern | [0-9]* | Numeric only |
| autocomplete | off | No autocomplete |
| size | 1 | Visual sizing |

### Auto-Focus Behavior

```
User Types in Input [0]
    │
    ▼
Is digit valid (0-9)?
    │
Yes │         │ No
    ▼         ▼
Set value  Ignore
    │
    ▼
Input [0] filled?
    │
Yes │         │ No
    ▼         ▼
Focus      Stay
Input [1]  focused
```

### Backspace Handling

```
User Presses Backspace in Input [3]
    │
    ▼
Is Input [3] empty?
    │
Yes │              │ No
    ▼              ▼
Focus         Clear value
Input [2]     Stay focused
```

### Paste Support Flow

```
User Pastes "123456789" in Input [0]
    │
    ▼
Extract numeric chars: "123456789"
    │
    ▼
Take first 6 digits: "123456"
    │
    ▼
Distribute to inputs:
Input [0] = "1"
Input [1] = "2"
Input [2] = "3"
Input [3] = "4"
Input [4] = "5"
Input [5] = "6"
    │
    ▼
Focus Input [5] (last filled)
    │
    ▼
Call onComplete("123456")
```

### Styling States

| State | Border Color | Background | Cursor |
|-------|--------------|------------|--------|
| Default | border-gray-300 | bg-white | text |
| Focus | border-blue-500 | bg-white | text |
| Error | border-red-500 | bg-red-50 | text |
| Disabled | border-gray-200 | bg-gray-100 | not-allowed |
| Filled | border-gray-400 | bg-white | text |

### Input Dimensions

| Property | Value | Purpose |
|----------|-------|---------|
| Width | 48px (3rem) | Single digit + padding |
| Height | 56px (3.5rem) | Touch-friendly |
| Font Size | 24px (1.5rem) | Clearly visible |
| Gap | 8px (0.5rem) | Spacing between inputs |

### Keyboard Event Handling

| Key | Current Input Empty | Current Input Filled | Action |
|-----|---------------------|----------------------|--------|
| 0-9 | Yes | - | Set value, focus next |
| 0-9 | No | Yes | Replace value, focus next |
| Backspace | Yes | - | Focus previous |
| Backspace | No | Yes | Clear value, stay |
| Left Arrow | - | - | Focus previous |
| Right Arrow | - | - | Focus next |
| Paste | - | - | Distribute digits |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Input Mode | inputMode="numeric" for mobile |
| Pattern | pattern="[0-9]*" for validation |
| Labels | aria-label="Digit 1" through "Digit 6" |
| Focus | Clear focus indicators |
| Error | aria-invalid when hasError true |
| Autocomplete | Off to prevent suggestions |

### Edge Case Handling

| Case | Behavior |
|------|----------|
| Non-numeric input | Filter out, ignore |
| Empty value prop | Clear all inputs |
| Partial value (3 digits) | Fill first 3 inputs |
| More than 6 digits pasted | Take first 6 only |
| Special characters in paste | Extract numbers only |

### Expected Outcome
- Highly usable OTP input component
- Auto-focus between inputs
- Paste support for convenience
- Backspace navigation
- Auto-complete callback
- Clean, professional styling
- Mobile-optimized

### Verification Checklist
- [ ] `frontend/components/auth/OTPInput.tsx` file created
- [ ] 'use client' directive added
- [ ] Props interface defined
- [ ] Refs created for 6 inputs
- [ ] 6 input elements rendered
- [ ] Auto-focus on input implemented
- [ ] Backspace navigation implemented
- [ ] Paste support implemented
- [ ] onChange callback fires correctly
- [ ] onComplete callback implemented
- [ ] Error state styling applied
- [ ] Disabled state handled
- [ ] Mobile keyboard optimization (inputMode)
- [ ] Accessibility attributes added
- [ ] Edge cases handled

---

## Task 74: Create Backup Codes Display

### Overview
Create the BackupCodesDisplay component that shows 8 backup codes after successful 2FA setup. This component includes download functionality, copy-all functionality, and clear warnings about saving the codes securely as they are shown only once.

### Dependencies
- Task 71: Create 2FA Setup Page

### Instructions

1. **Create BackupCodesDisplay component file**
   - Navigate to `frontend/components/auth/` directory
   - Create `BackupCodesDisplay.tsx` file
   - This will be a client component

2. **Mark as client component**
   - Add 'use client' directive at top of file
   - Required for download and copy functionality

3. **Import required dependencies**
   - Import React hooks (useState)
   - Import UI components (Button, Card, Alert)
   - Import icons (Download, Copy, AlertTriangle)

4. **Define component props interface**
   - codes: string[] (array of 8 backup codes)
   - onContinue: optional () => void (callback after user confirms)

5. **Create component structure**
   - Render Card component as container
   - Add prominent warning message at top
   - Display codes in a grid layout
   - Add action buttons (download, copy)
   - Add continue/acknowledge button

6. **Display backup codes**
   - Render each code in monospace font
   - Format: XXXX-XXXX (e.g., "A1B2-C3D4")
   - Use grid layout: 2 columns on desktop, 1 on mobile
   - Each code in its own box with border

7. **Add warning message**
   - Use Alert component with warning style
   - Include warning icon
   - Text: "Save these codes in a secure location"
   - Emphasize: "These codes will only be shown once"

8. **Implement copy all functionality**
   - Add "Copy All" button
   - Copy all 8 codes to clipboard (one per line)
   - Show success toast/message after copy
   - Include timestamp in copied text

9. **Implement download functionality**
   - Add "Download" button
   - Create text file with codes
   - Include header text with instructions
   - Filename: `lankacommerce-backup-codes-[date].txt`
   - Trigger browser download

10. **Create download file content**
    - Header: "LankaCommerce Backup Codes"
    - Generation date and time
    - User email or username
    - List all 8 codes
    - Footer: Instructions on usage

11. **Add usage instructions**
    - Explain backup codes are one-time use
    - Each code can only be used once
    - Use when authenticator is unavailable
    - Store securely (password manager recommended)

12. **Implement acknowledge/continue button**
    - Label: "I've Saved My Codes"
    - Must be clicked before proceeding
    - Optional: Require checkbox confirmation
    - Calls onContinue callback

13. **Add styling and layout**
    - Warning section: prominent yellow/orange
    - Code boxes: light background, monospace font
    - Grid layout responsive
    - Button spacing and alignment

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| codes | string[] | Yes | Array of 8 backup codes |
| onContinue | () => void | No | Callback when user acknowledges |
| className | string | No | Additional CSS classes |

### Component Structure

```
┌─────────────────────────────────────────┐
│  ⚠ Important: Save Your Backup Codes    │
│  These codes will only be shown once.    │
│  Store them in a secure location.        │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────┐  ┌────────────┐         │
│  │ A1B2-C3D4  │  │ E5F6-G7H8  │         │
│  └────────────┘  └────────────┘         │
│  ┌────────────┐  ┌────────────┐         │
│  │ I9J0-K1L2  │  │ M3N4-O5P6  │         │
│  └────────────┘  └────────────┘         │
│  ┌────────────┐  ┌────────────┐         │
│  │ Q7R8-S9T0  │  │ U1V2-W3X4  │         │
│  └────────────┘  └────────────┘         │
│  ┌────────────┐  ┌────────────┐         │
│  │ Y5Z6-A7B8  │  │ C9D0-E1F2  │         │
│  └────────────┘  └────────────┘         │
│                                          │
│  [Download] [Copy All]                   │
│                                          │
│  Usage Instructions:                     │
│  • Each code can only be used once       │
│  • Use when authenticator is unavailable │
│  • Store securely (password manager)     │
│                                          │
│  □ I have saved my backup codes          │
│  [I've Saved My Codes]                   │
└─────────────────────────────────────────┘
```

### Backup Code Format

| Element | Format | Example |
|---------|--------|---------|
| Pattern | XXXX-XXXX | A1B2-C3D4 |
| Characters | Alphanumeric | 0-9, A-Z |
| Case | Uppercase | Always caps |
| Length | 9 chars (including dash) | 4 + dash + 4 |
| Quantity | 8 codes | Fixed amount |

### Code Display Grid

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile (<768px) | 1 | 12px |
| Tablet (768px+) | 2 | 16px |
| Desktop (1024px+) | 2 | 20px |

### Download File Content Template

```
===============================================
LankaCommerce Cloud - Backup Codes
===============================================

Generated: [Date and Time]
User: [Email Address]

These are your two-factor authentication backup
codes. Each code can be used once in place of
your authenticator app.

BACKUP CODES:
-------------
A1B2-C3D4
E5F6-G7H8
I9J0-K1L2
M3N4-O5P6
Q7R8-S9T0
U1V2-W3X4
Y5Z6-A7B8
C9D0-E1F2

IMPORTANT:
- Store these codes in a secure location
- Each code can only be used once
- Use when your authenticator app is unavailable
- Do not share these codes with anyone
- Generate new codes if you lose these

===============================================
```

### Copy All Functionality

```
User Clicks "Copy All"
    │
    ▼
Format codes (one per line)
    │
    ▼
Copy to clipboard
    │
    ▼
Show success message: "Copied to clipboard!"
    │
    ▼
Message disappears after 3 seconds
```

### Copied Text Format

```
LankaCommerce Backup Codes - [Date]

A1B2-C3D4
E5F6-G7H8
I9J0-K1L2
M3N4-O5P6
Q7R8-S9T0
U1V2-W3X4
Y5Z6-A7B8
C9D0-E1F2

Keep these codes in a secure location.
```

### Download Functionality

```
User Clicks "Download"
    │
    ▼
Create Blob with file content
    │
    ▼
Create object URL from Blob
    │
    ▼
Create temporary <a> element
    │
    ▼
Set href to object URL
    │
    ▼
Set download attribute with filename
    │
    ▼
Programmatically click <a> element
    │
    ▼
Remove <a> element
    │
    ▼
Revoke object URL (cleanup)
```

### Warning Message Details

| Element | Content |
|---------|---------|
| Icon | ⚠ Warning Triangle |
| Color | Yellow/Orange (warning) |
| Primary Text | "Save these codes in a secure location" |
| Secondary Text | "These codes will only be shown once" |
| Style | Prominent, cannot be missed |

### Usage Instructions

| Instruction | Explanation |
|-------------|-------------|
| One-time use | Each code works only once, then becomes invalid |
| Unavailable authenticator | Use when phone is lost/broken/unavailable |
| Secure storage | Save in password manager or secure vault |
| Don't share | Never share codes with anyone |
| Regenerate if needed | Can generate new codes from account settings |

### Component State Management

| Variable | Type | Purpose |
|----------|------|---------|
| copied | boolean | Show "copied" feedback |
| acknowledged | boolean | User confirmed saving codes |

### Action Buttons

| Button | Icon | Action | Style |
|--------|------|--------|-------|
| Download | Download icon | Download .txt file | Secondary |
| Copy All | Copy icon | Copy to clipboard | Secondary |
| I've Saved My Codes | None | Acknowledge and continue | Primary |

### Expected Outcome
- Clear display of 8 backup codes
- Prominent warning about one-time display
- Easy download functionality
- Copy-all functionality
- Clear usage instructions
- User must acknowledge before continuing

### Verification Checklist
- [ ] `frontend/components/auth/BackupCodesDisplay.tsx` file created
- [ ] 'use client' directive added
- [ ] Props interface defined
- [ ] 8 codes displayed in grid layout
- [ ] Monospace font for codes
- [ ] Warning message prominent
- [ ] Copy all functionality implemented
- [ ] Copy success feedback shown
- [ ] Download functionality implemented
- [ ] Download file format correct
- [ ] Usage instructions displayed
- [ ] Acknowledge button implemented
- [ ] onContinue callback called
- [ ] Responsive layout works

---

## Task 75: Implement 2FA Verification

### Overview
Implement the complete API integration for 2FA verification including setup verification (first OTP during setup) and login verification (OTP during login). This task handles both authenticator codes and backup codes, with proper error handling and session management.

### Dependencies
- Task 73: Create OTP Input Component
- Task 74: Create Backup Codes Display

### Instructions

1. **Create API service functions**
   - Navigate to `frontend/lib/api/auth.ts` file
   - Add multiple 2FA-related functions
   - Export all functions

2. **Create setup2FA function**
   - Fetches initial 2FA setup data from backend
   - Returns TOTP secret and QR code URL
   - Endpoint: `/api/auth/2fa/setup/`
   - Method: GET or POST

3. **Create verify2FASetup function**
   - Verifies first OTP during 2FA setup
   - Accepts secret and OTP code
   - Returns backup codes on success
   - Endpoint: `/api/auth/2fa/verify-setup/`
   - Method: POST

4. **Create verify2FALogin function**
   - Verifies OTP during login
   - Accepts session token and OTP code
   - Returns authentication tokens on success
   - Endpoint: `/api/auth/2fa/verify/`
   - Method: POST

5. **Create verify2FABackupCode function**
   - Verifies backup code during login
   - Accepts session token and backup code
   - Returns authentication tokens on success
   - Marks backup code as used
   - Endpoint: `/api/auth/2fa/verify-backup/`
   - Method: POST

6. **Implement setup2FA function**
   - Call on 2FA setup page mount
   - Handle response with secret and QR URL
   - Update component state
   - Handle errors (user already has 2FA, server error)

7. **Implement verify2FASetup function**
   - Called when user submits first OTP in setup
   - Send secret and OTP to backend
   - On success: receive and display backup codes
   - On error: show invalid code message

8. **Implement verify2FALogin function**
   - Called from 2FA verify page with OTP
   - Send session token and OTP
   - On success: store auth tokens, redirect to app
   - On error: show invalid code, allow retry

9. **Implement verify2FABackupCode function**
   - Alternative verification method
   - Send session token and backup code
   - On success: store auth tokens, redirect, warn about code usage
   - On error: show invalid code message

10. **Add error handling for all functions**
    - Network errors
    - Invalid code errors
    - Expired session errors
    - Rate limiting errors
    - Server errors

11. **Implement token storage on success**
    - Store JWT tokens in httpOnly cookies (preferred)
    - Or store in localStorage if needed
    - Update authentication context/state
    - Redirect to intended page

12. **Add rate limiting handling**
    - Backend may limit verification attempts
    - Show "too many attempts" message
    - Display wait time if provided
    - Prevent additional submissions during cooldown

### API Endpoints Overview

| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| setup2FA | `/api/auth/2fa/setup/` | POST | Get TOTP secret |
| verify2FASetup | `/api/auth/2fa/verify-setup/` | POST | Verify first OTP |
| verify2FALogin | `/api/auth/2fa/verify/` | POST | Verify OTP during login |
| verify2FABackupCode | `/api/auth/2fa/verify-backup/` | POST | Verify backup code |

### setup2FA Request/Response

**Request:**
```json
{
  "method": "POST",
  "endpoint": "/api/auth/2fa/setup/",
  "body": {}
}
```

**Response (Success):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code_url": "otpauth://totp/LankaCommerce:user@email?secret=...",
  "backup_codes": null
}
```

### verify2FASetup Request/Response

**Request:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "2FA enabled successfully",
  "backup_codes": [
    "A1B2-C3D4",
    "E5F6-G7H8",
    "I9J0-K1L2",
    "M3N4-O5P6",
    "Q7R8-S9T0",
    "U1V2-W3X4",
    "Y5Z6-A7B8",
    "C9D0-E1F2"
  ]
}
```

### verify2FALogin Request/Response

**Request:**
```json
{
  "session_token": "temp_session_abc123",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### verify2FABackupCode Request/Response

**Request:**
```json
{
  "session_token": "temp_session_abc123",
  "backup_code": "A1B2-C3D4"
}
```

**Response (Success):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Backup code used successfully",
  "remaining_codes": 7
}
```

### Error Response Structure

```json
{
  "error": "invalid_otp",
  "message": "Invalid verification code",
  "detail": "The code you entered is incorrect"
}
```

### Error Types and Handling

| Error Code | HTTP Status | Display Message | Action |
|------------|-------------|-----------------|--------|
| invalid_otp | 400 | "Invalid code. Please try again." | Allow retry |
| expired_session | 401 | "Session expired. Please log in again." | Redirect to login |
| rate_limit_exceeded | 429 | "Too many attempts. Try again in {X} minutes." | Show countdown |
| already_enabled | 400 | "2FA is already enabled on your account." | Redirect to settings |
| invalid_backup_code | 400 | "Invalid backup code." | Allow retry |
| backup_code_used | 400 | "This backup code has already been used." | Suggest different code |
| server_error | 500 | "An error occurred. Please try again." | Allow retry |

### 2FA Setup Flow Implementation

```
User Clicks "Enable 2FA"
    │
    ▼
Call setup2FA()
    │
    ▼
Backend Generates Secret
    │
    ▼
Display QR Code + Manual Key
    │
    ▼
User Scans QR Code
    │
    ▼
User Enters OTP in Setup Page
    │
    ▼
Call verify2FASetup(secret, otp)
    │
    ├──────────────────┐
    ▼                  ▼
Success            Failure
    │                  │
    ▼                  ▼
Receive         Show "Invalid
Backup Codes    Code" Error
    │                  │
    ▼                  ▼
Display Codes   Allow Retry
```

### 2FA Login Flow Implementation

```
User Logs In
    │
    ▼
Backend Detects 2FA Enabled
    │
    ▼
Return Temp Session Token
    │
    ▼
Redirect to /two-factor/verify?session=X
    │
    ▼
User Enters OTP
    │
    ▼
Call verify2FALogin(sessionToken, otp)
    │
    ├──────────────────┐
    ▼                  ▼
Success            Failure
    │                  │
    ▼                  ▼
Store Tokens    Show Error
    │                  │
    ▼                  ▼
Redirect to     Suggest Backup
Dashboard       Code Option
```

### Backup Code Usage Flow

```
User Can't Access Authenticator
    │
    ▼
Click "Use Backup Code Instead"
    │
    ▼
Show Backup Code Input
    │
    ▼
User Enters Backup Code
    │
    ▼
Call verify2FABackupCode(sessionToken, code)
    │
    ├──────────────────┐
    ▼                  ▼
Success            Failure
    │                  │
    ▼                  ▼
Store Tokens    Show Error
    │           (Invalid or Used)
    ▼                  │
Show Warning:          ▼
"X codes remain"   Allow Retry
    │
    ▼
Redirect to Dashboard
```

### Token Storage Implementation

| Method | Storage Location | Security | Pros | Cons |
|--------|------------------|----------|------|------|
| HttpOnly Cookie | Cookie (httpOnly, secure) | High | XSS protected, auto-sent | CSRF risk |
| localStorage | localStorage | Medium | Easy access | XSS vulnerable |
| sessionStorage | sessionStorage | Medium | Tab-isolated | Lost on close |

Recommended: HttpOnly cookie with CSRF token

### Rate Limiting Handling

```
API Returns 429 Status
    │
    ▼
Parse retry_after header (seconds)
    │
    ▼
Convert to minutes
    │
    ▼
Disable submit button
    │
    ▼
Show: "Too many attempts.
Try again in X minutes."
    │
    ▼
Optional: Show countdown timer
    │
    ▼
Re-enable after wait period
```

### Component Integration Points

| Component | Function Called | On Success | On Error |
|-----------|----------------|------------|----------|
| Setup Page (Task 71) | setup2FA → verify2FASetup | Show backup codes | Show error, retry |
| Verify Page (Task 72) | verify2FALogin | Redirect to dashboard | Show error, retry |
| Verify Page (backup) | verify2FABackupCode | Redirect to dashboard | Show error, retry |

### Expected Outcome
- Complete API integration for all 2FA functions
- Setup flow working from start to backup codes
- Login verification working with OTP
- Backup code verification working
- Comprehensive error handling
- Token storage and session management
- Rate limiting handled gracefully

### Verification Checklist
- [ ] API service file updated (`lib/api/auth.ts`)
- [ ] setup2FA function implemented
- [ ] verify2FASetup function implemented
- [ ] verify2FALogin function implemented
- [ ] verify2FABackupCode function implemented
- [ ] Error handling for all functions
- [ ] Setup page integrated with setup2FA
- [ ] Setup page integrated with verify2FASetup
- [ ] Verify page integrated with verify2FALogin
- [ ] Backup code input integrated with verify2FABackupCode
- [ ] Token storage implemented
- [ ] Redirect after successful verification
- [ ] Rate limiting handled
- [ ] All error messages displayed correctly

---

## Task 76: Test Email & 2FA Flows

### Overview
Conduct comprehensive testing of all email verification and two-factor authentication flows. This includes functional testing, user experience testing, error scenario testing, edge case testing, and accessibility testing to ensure all features work correctly and provide excellent user experience.

### Dependencies
- All previous tasks (63-75)

### Instructions

1. **Set up testing environment**
   - Ensure backend is running
   - Ensure frontend dev server is running
   - Have authenticator app ready (Google Authenticator or similar)
   - Have test user accounts prepared
   - Clear browser cache and cookies

2. **Test email verification - happy path**
   - Register new user account
   - Receive verification email
   - Click verification link
   - Verify success message displays
   - Verify countdown timer works
   - Verify auto-redirect to login
   - Verify can login after verification

3. **Test email verification - expired token**
   - Use or generate expired verification token
   - Click verification link
   - Verify error message: "Link expired"
   - Verify resend link displayed
   - Click resend link
   - Verify navigate to resend page

4. **Test email verification - invalid token**
   - Modify token in URL manually
   - Visit verification page with invalid token
   - Verify error message: "Invalid link"
   - Verify resend option available

5. **Test email verification - already verified**
   - Verify an account
   - Click same verification link again
   - Verify message: "Already verified"
   - Verify login link displayed

6. **Test resend verification - happy path**
   - Go to `/resend-verification`
   - Enter valid email address
   - Submit form
   - Verify success message
   - Check email inbox for new verification link
   - Click new link and verify it works

7. **Test resend verification - invalid email**
   - Enter invalid email format
   - Verify validation error displays
   - Correct email format
   - Verify error clears

8. **Test resend verification - rate limiting**
   - Submit resend form
   - Immediately submit again
   - Verify rate limit error message
   - Verify wait time displayed

9. **Test 2FA setup - happy path**
   - Login to account
   - Navigate to 2FA setup page
   - Verify QR code displays
   - Scan QR code with authenticator app
   - Enter OTP from app
   - Submit verification
   - Verify backup codes display
   - Download backup codes
   - Verify file downloads correctly
   - Copy all codes
   - Verify copied to clipboard
   - Click "I've Saved My Codes"
   - Verify redirect or completion

10. **Test 2FA setup - invalid OTP**
    - Start 2FA setup
    - Scan QR code
    - Enter incorrect OTP
    - Verify error message: "Invalid code"
    - Enter correct OTP
    - Verify setup completes

11. **Test 2FA login - happy path**
    - Login with 2FA-enabled account
    - Enter correct credentials
    - Verify redirect to `/two-factor/verify`
    - OTP input displays
    - Open authenticator app
    - Enter 6-digit OTP
    - Verify auto-submit when 6 digits entered
    - Verify successful login
    - Verify redirect to dashboard

12. **Test OTP input component**
    - Test auto-focus advancement
    - Type digits, verify focus moves automatically
    - Test backspace navigation
    - Press backspace, verify focus moves back
    - Test paste functionality
    - Copy "123456" and paste in first input
    - Verify all 6 inputs fill correctly
    - Test paste with more than 6 digits
    - Paste "123456789"
    - Verify only first 6 digits used

13. **Test 2FA login - invalid OTP**
    - Reach 2FA verification page
    - Enter incorrect OTP
    - Verify error message displays
    - Verify OTP inputs clear
    - Enter correct OTP
    - Verify login succeeds

14. **Test backup code verification**
    - Login with 2FA account
    - On verification page, click "Use backup code"
    - Verify backup code input displays
    - Enter valid backup code
    - Verify successful login
    - Verify warning about remaining codes

15. **Test backup code - already used**
    - Login again with same account
    - Try to use same backup code
    - Verify error: "Code already used"
    - Try different backup code
    - Verify login succeeds

16. **Test mobile responsiveness**
    - Open all pages on mobile viewport
    - Verify layouts are responsive
    - Verify OTP inputs are usable on mobile
    - Verify buttons are easily tappable
    - Verify QR code displays appropriately

17. **Test keyboard navigation**
    - Navigate through forms using Tab key
    - Verify focus order is logical
    - Press Enter to submit forms
    - Use arrow keys in OTP input
    - Verify all interactive elements are accessible

18. **Test accessibility features**
    - Use screen reader to test pages
    - Verify labels are read correctly
    - Verify error messages are announced
    - Verify success messages are announced
    - Check color contrast ratios
    - Verify focus indicators are visible

19. **Test error recovery**
    - Simulate network error during verification
    - Verify error message displays
    - Restore network
    - Retry verification
    - Verify succeeds

20. **Test edge cases**
    - Very slow network connection
    - Rapidly clicking submit buttons
    - Browser back button during flows
    - Refreshing page during verification
    - Multiple tabs/windows

21. **Document test results**
    - Create test results matrix
    - Note any bugs or issues
    - Document browser compatibility
    - Note any UX improvements needed

22. **Create bug reports if needed**
    - Document steps to reproduce
    - Include screenshots
    - Note expected vs actual behavior
    - Assign priority

### Testing Matrix: Email Verification

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Valid token verification | Success message, auto-redirect | ☐ Pass ☐ Fail | - |
| Expired token | Error with resend link | ☐ Pass ☐ Fail | - |
| Invalid token | Error with resend link | ☐ Pass ☐ Fail | - |
| Missing token | Error with resend link | ☐ Pass ☐ Fail | - |
| Already verified | Info message with login link | ☐ Pass ☐ Fail | - |
| Countdown timer | Counts 3 to 0, then redirects | ☐ Pass ☐ Fail | - |
| Manual redirect button | Immediate redirect to login | ☐ Pass ☐ Fail | - |

### Testing Matrix: Resend Verification

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Valid email submit | Success message, email sent | ☐ Pass ☐ Fail | - |
| Invalid email format | Validation error | ☐ Pass ☐ Fail | - |
| Empty email | Required field error | ☐ Pass ☐ Fail | - |
| Nonexistent email | Generic success (security) | ☐ Pass ☐ Fail | - |
| Rate limiting | Error with wait time | ☐ Pass ☐ Fail | - |
| Network error | Connection error message | ☐ Pass ☐ Fail | - |

### Testing Matrix: 2FA Setup

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| QR code generation | QR code displays | ☐ Pass ☐ Fail | - |
| Manual key display | Secret key shown, copyable | ☐ Pass ☐ Fail | - |
| Valid OTP verification | Backup codes displayed | ☐ Pass ☐ Fail | - |
| Invalid OTP | Error message, retry allowed | ☐ Pass ☐ Fail | - |
| Download backup codes | File downloads correctly | ☐ Pass ☐ Fail | - |
| Copy all codes | Codes copied to clipboard | ☐ Pass ☐ Fail | - |
| Acknowledge codes | Continue button works | ☐ Pass ☐ Fail | - |

### Testing Matrix: 2FA Login

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Valid OTP | Login success, redirect | ☐ Pass ☐ Fail | - |
| Invalid OTP | Error message, retry | ☐ Pass ☐ Fail | - |
| Valid backup code | Login success, warning | ☐ Pass ☐ Fail | - |
| Invalid backup code | Error message | ☐ Pass ☐ Fail | - |
| Used backup code | Error: code already used | ☐ Pass ☐ Fail | - |
| Session expiry | Error, redirect to login | ☐ Pass ☐ Fail | - |
| Rate limiting | Error with cooldown | ☐ Pass ☐ Fail | - |

### Testing Matrix: OTP Input Component

| Test Case | Expected Result | Status | Notes |
|-----------|-----------------|--------|-------|
| Auto-focus advancement | Focus moves to next input | ☐ Pass ☐ Fail | - |
| Backspace navigation | Focus moves to previous | ☐ Pass ☐ Fail | - |
| Paste 6 digits | All inputs fill correctly | ☐ Pass ☐ Fail | - |
| Paste >6 digits | First 6 used only | ☐ Pass ☐ Fail | - |
| Paste non-numeric | Numeric extracted | ☐ Pass ☐ Fail | - |
| Auto-submit on complete | onComplete callback fired | ☐ Pass ☐ Fail | - |
| Error state styling | Red border on error | ☐ Pass ☐ Fail | - |
| Mobile numeric keyboard | Correct keyboard shown | ☐ Pass ☐ Fail | - |

### Browser Compatibility Testing

| Browser | Version | Email Verify | Resend | 2FA Setup | 2FA Login | Notes |
|---------|---------|--------------|--------|-----------|-----------|-------|
| Chrome | Latest | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |
| Firefox | Latest | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |
| Safari | Latest | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |
| Edge | Latest | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |
| Mobile Safari | iOS 15+ | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |
| Mobile Chrome | Android | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | ☐ Pass ☐ Fail | - |

### Accessibility Testing Checklist

| Feature | Test | Status | Notes |
|---------|------|--------|-------|
| Keyboard Navigation | Tab through all interactive elements | ☐ Pass ☐ Fail | - |
| Focus Indicators | Visible focus states | ☐ Pass ☐ Fail | - |
| Screen Reader | All labels read correctly | ☐ Pass ☐ Fail | - |
| Error Announcements | Errors announced to screen reader | ☐ Pass ☐ Fail | - |
| Color Contrast | WCAG AA compliance | ☐ Pass ☐ Fail | - |
| Form Labels | All inputs have labels | ☐ Pass ☐ Fail | - |
| Button Labels | All buttons have clear labels | ☐ Pass ☐ Fail | - |
| Alt Text | All images have alt text | ☐ Pass ☐ Fail | - |

### Mobile Testing Checklist

| Feature | Test | Status | Notes |
|---------|------|--------|-------|
| Layout Responsive | All pages adapt to mobile | ☐ Pass ☐ Fail | - |
| Touch Targets | Minimum 44x44px | ☐ Pass ☐ Fail | - |
| Text Readable | No horizontal scroll needed | ☐ Pass ☐ Fail | - |
| Keyboard Type | Appropriate keyboards shown | ☐ Pass ☐ Fail | - |
| OTP Input Usable | Easy to enter on mobile | ☐ Pass ☐ Fail | - |
| QR Code Scannable | QR code works with camera | ☐ Pass ☐ Fail | - |
| Download Works | File download on mobile | ☐ Pass ☐ Fail | - |

### Performance Testing

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Email verify page load | <2s | - | ☐ Pass ☐ Fail |
| 2FA setup page load | <2s | - | ☐ Pass ☐ Fail |
| API response time | <500ms | - | ☐ Pass ☐ Fail |
| QR code generation | <1s | - | ☐ Pass ☐ Fail |
| OTP input responsiveness | Immediate | - | ☐ Pass ☐ Fail |

### User Experience Testing

| Aspect | Evaluation | Rating (1-5) | Notes |
|--------|------------|--------------|-------|
| Clarity of Instructions | Are steps clear? | - | - |
| Error Messages | Are errors helpful? | - | - |
| Visual Feedback | Is feedback immediate? | - | - |
| Loading States | Are loading states clear? | - | - |
| Success States | Are successes celebrated? | - | - |
| Overall Flow | Is process smooth? | - | - |

### Bug Report Template

```
Title: [Short description of issue]

Severity: [Critical/High/Medium/Low]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [And so on...]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Environment:
- Browser: [Chrome 120]
- OS: [Windows 11]
- Device: [Desktop/Mobile]
- Screen Size: [1920x1080]

Screenshots:
[Attach screenshots]

Additional Notes:
[Any other relevant information]
```

### Expected Outcome
- All flows thoroughly tested
- Test results documented
- Bugs identified and reported
- Confidence in feature quality
- Ready for production deployment

### Verification Checklist
- [ ] Email verification happy path tested
- [ ] Email verification error scenarios tested
- [ ] Resend verification tested
- [ ] 2FA setup happy path tested
- [ ] 2FA setup error scenarios tested
- [ ] 2FA login happy path tested
- [ ] 2FA login error scenarios tested
- [ ] OTP input component tested thoroughly
- [ ] Backup codes functionality tested
- [ ] Mobile responsiveness verified
- [ ] Keyboard navigation tested
- [ ] Accessibility features tested
- [ ] Browser compatibility tested
- [ ] Performance metrics measured
- [ ] User experience evaluated
- [ ] All bugs documented
- [ ] Test results matrix completed

---

## Complete Flow Diagram: Email Verification & 2FA

```
┌───────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                          │
└─────────────────────────┬─────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Verification Email   │
              │  Sent to User         │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  User Clicks Link     │
              │  /verify-email?token= │
              └───────────────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
            Token Valid    Token Invalid/Expired
                    │           │
                    ▼           ▼
            ┌──────────┐   ┌──────────────────┐
            │ Success  │   │ Show Error       │
            │ Message  │   │ + Resend Link    │
            └──────────┘   └──────────────────┘
                    │           │
                    │           ▼
                    │   ┌──────────────────────┐
                    │   │ /resend-verification │
                    │   │ User Enters Email    │
                    │   └──────────────────────┘
                    │           │
                    │           ▼
                    │   ┌──────────────────────┐
                    │   │ New Email Sent       │
                    │   └──────────────────────┘
                    │           │
                    └───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  User Can Login       │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  User Enables 2FA     │
              │  /two-factor/setup    │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Generate TOTP Secret │
              │  Display QR Code      │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  User Scans QR        │
              │  Enters First OTP     │
              └───────────────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
            OTP Valid      OTP Invalid
                    │           │
                    ▼           ▼
            ┌──────────┐   ┌──────────┐
            │ Generate │   │ Show     │
            │ 8 Backup │   │ Error    │
            │ Codes    │   │ Retry    │
            └──────────┘   └──────────┘
                    │
                    ▼
            ┌──────────────────┐
            │ Display Backup   │
            │ Codes (Once)     │
            │ Download + Copy  │
            └──────────────────┘
                    │
                    ▼
            ┌──────────────────┐
            │ 2FA Enabled      │
            │ Complete         │
            └──────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│                    SUBSEQUENT LOGINS                          │
└─────────────────────────┬─────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  User Enters          │
              │  Credentials          │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Backend Detects 2FA  │
              │  Enabled              │
              └───────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Redirect to          │
              │  /two-factor/verify   │
              └───────────────────────┘
                          │
                    ┌─────┴──────┐
                    ▼            ▼
            Use OTP          Use Backup Code
                    │            │
                    ▼            ▼
            ┌──────────┐    ┌──────────┐
            │ Enter    │    │ Enter    │
            │ 6-digit  │    │ Backup   │
            │ OTP      │    │ Code     │
            └──────────┘    └──────────┘
                    │            │
                    │            │
                    └─────┬──────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
            Code Valid     Code Invalid
                    │           │
                    ▼           ▼
            ┌──────────┐   ┌──────────┐
            │ Login    │   │ Show     │
            │ Success  │   │ Error    │
            │          │   │ Retry    │
            └──────────┘   └──────────┘
                    │
                    ▼
            ┌──────────────────┐
            │ Redirect to      │
            │ Dashboard        │
            └──────────────────┘
```

---

## Summary

This document covered the complete two-factor authentication implementation (Tasks 71-76):

**2FA Setup (71, 74):**
- Created 2FA setup page with QR code generation
- Implemented manual entry code display
- Created BackupCodesDisplay component
- Added download and copy functionality for backup codes
- Comprehensive setup instructions

**2FA Verification (72, 73):**
- Created 2FA verification page for login
- Built specialized OTP input component
- Implemented 6-digit input with auto-focus and paste support
- Added backup code alternative option

**API Integration (75):**
- Implemented all 2FA API functions
- Setup verification with backup code generation
- Login verification with OTP and backup codes
- Comprehensive error handling and rate limiting

**Testing (76):**
- Complete testing matrices for all flows
- Browser compatibility testing
- Accessibility and mobile testing
- Performance and UX evaluation
- Bug documentation template

All email verification and 2FA functionality is now complete, tested, and ready for production use. These features provide enterprise-grade security for the LankaCommerce Cloud ERP system.

---

**End of Document 02**

**End of Group E: Email Verification & 2FA**
