# Tasks 85-93: Account Settings

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** F - Account Settings & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88, 89, 90, 91, 92, 93

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Wishlist-Reviews](../Group-E_Wishlist-Reviews/)
- **→ Next Document:** [02_Tasks-94-96_Testing.md](02_Tasks-94-96_Testing.md)

---

## Document Overview

This document covers the creation of account settings functionality for the customer portal. It includes building a comprehensive settings page with profile management, password changes, notification preferences, and account deletion. The settings page provides customers with full control over their account information, security settings, and communication preferences.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create Settings Page | Low | 20 min |
| 86 | Create Profile Section | Low | 15 min |
| 87 | Create Profile Form | Medium | 30 min |
| 88 | Create Update Profile API Integration | Medium | 25 min |
| 89 | Create Password Section | Low | 15 min |
| 90 | Create Change Password Form | Medium | 30 min |
| 91 | Create Notification Settings | Low | 25 min |
| 92 | Create Delete Account Option | Low | 20 min |
| 93 | Create Delete Confirmation Modal | Medium | 25 min |

---

## Task 85: Create Settings Page

### Overview
Create the main settings page component that serves as a container for all account settings sections. The page uses an organized layout with separate sections for profile, password, notifications, and account deletion, making it easy for customers to manage different aspects of their account.

### Dependencies
- Task 84: Create Logout Functionality (Group E)
- SubPhase-07: Portal layout and navigation
- Form components from Phase-07

### Instructions

1. **Create SettingsPage component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `SettingsPage.tsx`
   - Define main component with settings container

2. **Design settings layout**
   - Create header section with "Account Settings" title
   - Add breadcrumb navigation (Home > Portal > Settings)
   - Design responsive container with max-width

3. **Implement sections structure**
   - Create four distinct sections in order
   - Add proper spacing between sections
   - Use dividers or card layout for separation

4. **Add section ordering**
   - First section: Profile (Tasks 86-88)
   - Second section: Password (Tasks 89-90)
   - Third section: Notifications (Task 91)
   - Fourth section: Delete Account (Tasks 92-93)

5. **Configure responsive behavior**
   - Single column layout for mobile
   - Wider layout for desktop
   - Ensure touch-friendly spacing on mobile

6. **Add loading and error states**
   - Show skeleton loaders while data loads
   - Display error messages if settings fail to load
   - Add retry mechanism for failed loads

### Settings Sections

| Section | Purpose | Order |
|---------|---------|-------|
| Profile | Edit personal information | 1 |
| Password | Change account password | 2 |
| Notifications | Manage communication preferences | 3 |
| Delete Account | Permanently delete account | 4 |

### Layout Structure
```
┌────────────────────────────────────────┐
│  Account Settings                       │
│  Home > Portal > Settings               │
├────────────────────────────────────────┤
│                                         │
│  ┌──── Profile Section ────────────┐  │
│  │ (Tasks 86-88)                    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──── Password Section ───────────┐  │
│  │ (Tasks 89-90)                    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──── Notification Settings ──────┐  │
│  │ (Task 91)                        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──── Delete Account ─────────────┐  │
│  │ (Tasks 92-93)                    │  │
│  └──────────────────────────────────┘  │
│                                         │
└────────────────────────────────────────┘
```

### Expected Outcome
- Settings page with organized section layout
- Responsive design for mobile and desktop
- Clear visual hierarchy between sections

### Verification Checklist
- [ ] Settings page accessible from portal navigation
- [ ] All four sections displayed in correct order
- [ ] Page responsive on mobile and desktop
- [ ] Loading and error states functional
- [ ] Breadcrumb navigation working

---

## Task 86: Create Profile Section

### Overview
Create the profile section component that displays user information and provides access to editing profile details. This section shows the user's name, email, phone number, and account creation date in a read-only display with an edit button.

### Dependencies
- Task 85: Create Settings Page

### Instructions

1. **Create ProfileSection component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `ProfileSection.tsx`
   - Define component with profile display structure

2. **Add section header**
   - Display "Profile Information" title
   - Add "Edit Profile" button aligned to right
   - Include descriptive subtitle about managing personal info

3. **Display user information fields**
   - Show first name and last name
   - Display email address with verified badge if applicable
   - Show phone number in +94 XX XXX XXXX format
   - Display account creation date

4. **Implement read-only view**
   - Display all fields as read-only text
   - Style fields to look like form inputs but non-editable
   - Add icons for each field type (user, email, phone)

5. **Add edit mode toggle**
   - Wire "Edit Profile" button to show ProfileForm
   - Hide read-only view when editing
   - Show cancel button in edit mode

6. **Style profile display**
   - Use card or bordered container
   - Add proper spacing between fields
   - Ensure visual consistency with portal design

### Profile Fields

| Field | Display | Editable |
|-------|---------|----------|
| First Name | Text display | Via form |
| Last Name | Text display | Via form |
| Email | With verified badge | View only |
| Phone | +94 format | Via form |
| Member Since | Date format | No |

### Expected Outcome
- Profile section showing user information clearly
- Edit button to access profile form
- Proper formatting for all field types

### Verification Checklist
- [ ] All user information displayed correctly
- [ ] Email shows verified badge if applicable
- [ ] Phone number in Sri Lanka format
- [ ] Edit button toggles to form view
- [ ] Visual styling consistent with portal

---

## Task 87: Create Profile Form

### Overview
Create the profile form component that allows customers to edit their personal information. The form includes fields for first name, last name, and phone number with proper validation, while email is displayed as read-only if verified.

### Dependencies
- Task 86: Create Profile Section

### Instructions

1. **Create ProfileForm component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `ProfileForm.tsx`
   - Set up React Hook Form integration

2. **Define form fields**
   - Add first name input (required, min 2 characters)
   - Add last name input (required, min 2 characters)
   - Add phone input with +94 format
   - Display email as read-only field

3. **Implement validation rules**
   - First name: required, minimum 2 characters, max 50
   - Last name: required, minimum 2 characters, max 50
   - Phone: valid Sri Lankan format (+94 XX XXX XXXX)
   - Show validation errors below each field

4. **Add phone number formatting**
   - Auto-format as user types
   - Ensure +94 prefix is maintained
   - Validate format: +94 XX XXX XXXX pattern
   - Show format hint below input

5. **Create form actions**
   - Add "Save Changes" primary button
   - Add "Cancel" secondary button
   - Disable save button while submitting
   - Show loading spinner during submission

6. **Handle form submission**
   - Call update profile API (Task 88)
   - Show success message on save
   - Handle validation errors from API
   - Return to read-only view on success

### Form Fields

| Field | Validation | Required |
|-------|-----------|----------|
| First Name | Min 2, max 50 chars | Yes |
| Last Name | Min 2, max 50 chars | Yes |
| Email | Read-only display | - |
| Phone | +94 XX XXX XXXX format | Yes |

### Phone Format Rules
```
Valid:   +94 77 123 4567
Valid:   +94 71 234 5678
Invalid: 94 77 123 4567  (missing +)
Invalid: +94 771234567   (missing spaces)
Invalid: +94 77 1234567  (wrong pattern)
```

### Expected Outcome
- Profile form with proper validation
- Phone number auto-formatting
- Clear error messages for invalid input

### Verification Checklist
- [ ] All fields display current user data
- [ ] Validation works for all fields
- [ ] Phone format enforced correctly
- [ ] Cancel button returns to read-only view
- [ ] Form submits successfully

---

## Task 88: Create Update Profile API Integration

### Overview
Create the API integration service that handles updating user profile information. This service sends the updated profile data to the backend and manages the response, including success states and error handling.

### Dependencies
- Task 87: Create Profile Form

### Instructions

1. **Create settings service file**
   - Navigate to `frontend/services/storefront/portal/` directory
   - Create new file `settingsService.ts`
   - Set up API client configuration

2. **Define update profile function**
   - Create `updateProfile` async function
   - Accept parameters: firstName, lastName, phone
   - Return updated user object on success

3. **Implement API call**
   - Send PATCH request to `/api/users/me`
   - Include authentication token in headers
   - Send payload with updated fields only

4. **Handle API response**
   - Parse successful response (200/204)
   - Update local user state/context
   - Return updated user data to component

5. **Implement error handling**
   - Catch validation errors (400)
   - Handle authentication errors (401)
   - Handle server errors (500)
   - Return user-friendly error messages

6. **Add request validation**
   - Validate data before sending
   - Ensure required fields present
   - Format phone number correctly
   - Strip unnecessary whitespace

### API Specification

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| /api/users/me | PATCH | Yes (JWT) |
| Request Type | application/json | - |
| Response Type | application/json | - |

### Request Payload
```
{
  firstName: string (required)
  lastName: string (required)
  phone: string (required, +94 format)
}
```

### Response Handling

| Status Code | Meaning | Action |
|-------------|---------|--------|
| 200/204 | Success | Update UI, show success |
| 400 | Validation error | Show field errors |
| 401 | Unauthorized | Redirect to login |
| 409 | Conflict (phone exists) | Show error message |
| 500 | Server error | Show generic error |

### Expected Outcome
- Working API integration for profile updates
- Proper error handling for all scenarios
- User state updated after successful save

### Verification Checklist
- [ ] API call sends correct data
- [ ] Success response updates user data
- [ ] Validation errors displayed properly
- [ ] Authentication errors handled
- [ ] Server errors show user-friendly message

---

## Task 89: Create Password Section

### Overview
Create the password section component that displays password security information and provides access to the change password form. This section shows the last password change date and contains a button to open the password change form.

### Dependencies
- Task 85: Create Settings Page

### Instructions

1. **Create PasswordSection component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `PasswordSection.tsx`
   - Define component with password section structure

2. **Add section header**
   - Display "Password & Security" title
   - Add "Change Password" button aligned to right
   - Include security icon in header

3. **Display password information**
   - Show masked password (••••••••)
   - Display "Last changed" date (e.g., "30 days ago")
   - Add security strength indicator if applicable

4. **Add security recommendations**
   - Display tip about strong passwords
   - Show password requirements reminder
   - Include link to security best practices

5. **Implement change mode toggle**
   - Wire "Change Password" button to show form
   - Hide info display when form is active
   - Show cancel button in change mode

6. **Style security display**
   - Use card or bordered container
   - Add lock icon for security context
   - Ensure visual distinction from profile section

### Password Display

| Element | Content | Purpose |
|---------|---------|---------|
| Title | "Password & Security" | Section identifier |
| Password | •••••••• | Masked display |
| Last Changed | "30 days ago" | Security info |
| Requirements | Strength rules | User guidance |

### Expected Outcome
- Password section with security information
- Change password button to access form
- Clear security recommendations

### Verification Checklist
- [ ] Password displayed as masked
- [ ] Last changed date accurate
- [ ] Change button opens form
- [ ] Security tips visible
- [ ] Styling consistent with settings page

---

## Task 90: Create Change Password Form

### Overview
Create the change password form component that allows customers to update their account password. The form requires the current password for verification and ensures the new password meets security requirements with confirmation field.

### Dependencies
- Task 89: Create Password Section

### Instructions

1. **Create ChangePasswordForm component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `ChangePasswordForm.tsx`
   - Set up React Hook Form integration

2. **Define form fields**
   - Add current password input (required)
   - Add new password input (required)
   - Add confirm new password input (required)
   - All fields with show/hide password toggle

3. **Implement password validation**
   - Current password: required
   - New password: minimum 8 characters
   - New password: must contain uppercase, lowercase, number
   - Confirm password: must match new password
   - Show strength meter for new password

4. **Add password strength indicator**
   - Calculate strength based on complexity
   - Display visual indicator (weak/medium/strong)
   - Show strength requirements checklist
   - Update in real-time as user types

5. **Create form actions**
   - Add "Update Password" primary button
   - Add "Cancel" secondary button
   - Disable submit while processing
   - Show loading state during submission

6. **Handle form submission**
   - Send current and new password to API
   - Show success message on update
   - Handle incorrect current password error
   - Clear form and return to info view on success

7. **Implement security features**
   - Require current password verification
   - Prevent reusing current password as new
   - Clear form on cancel
   - Log out other sessions option

### Password Requirements

| Requirement | Rule |
|-------------|------|
| Length | Minimum 8 characters |
| Uppercase | At least 1 uppercase letter |
| Lowercase | At least 1 lowercase letter |
| Number | At least 1 digit |
| Match | New and confirm must match |

### Password Strength Levels

| Level | Criteria | Color |
|-------|----------|-------|
| Weak | Only basic requirements | Red |
| Medium | Requirements + 10+ chars | Yellow |
| Strong | Requirements + 12+ chars + special | Green |

### Expected Outcome
- Change password form with proper validation
- Password strength indicator
- Secure password update process

### Verification Checklist
- [ ] All password fields functional
- [ ] Show/hide password toggles work
- [ ] Strength meter updates correctly
- [ ] Current password verified
- [ ] Form submits successfully
- [ ] Success/error messages display

---

## Task 91: Create Notification Settings

### Overview
Create the notification settings component that allows customers to manage their communication preferences. This includes toggles for email and WhatsApp notifications for order updates, promotional content, and newsletters.

### Dependencies
- Task 85: Create Settings Page

### Instructions

1. **Create NotificationSettings component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `NotificationSettings.tsx`
   - Define component with notification toggles

2. **Add section header**
   - Display "Notification Preferences" title
   - Add descriptive subtitle about managing communications
   - Include bell icon in header

3. **Create order notifications group**
   - Add "Order Updates" category header
   - Create email toggle for order notifications
   - Create WhatsApp toggle for order notifications
   - Add description for each option

4. **Create marketing notifications group**
   - Add "Marketing & Promotions" category header
   - Create promotional emails toggle
   - Create newsletter subscription toggle
   - Add description for each option

5. **Implement toggle functionality**
   - Use Switch/Toggle components
   - Save changes automatically on toggle
   - Show brief "Saved" confirmation
   - Maintain toggle state from API

6. **Add notification descriptions**
   - Explain what each notification type includes
   - Show estimated frequency (e.g., "As needed")
   - Add compliance text for marketing emails
   - Include opt-out reminder

7. **Handle API integration**
   - Fetch current preferences on load
   - Update preferences on each toggle
   - Handle errors gracefully
   - Show loading state while saving

### Notification Types

| Category | Type | Channel | Description |
|----------|------|---------|-------------|
| Order Updates | Order status | Email | Order status changes |
| Order Updates | Order status | WhatsApp | Order status via WhatsApp |
| Marketing | Promotions | Email | Special offers and deals |
| Marketing | Newsletter | Email | Weekly newsletter |

### Notification Channels

| Channel | Format | Frequency |
|---------|--------|-----------|
| Email | HTML email | As needed/Weekly |
| WhatsApp | Text message | As needed |

### Expected Outcome
- Notification settings with toggle switches
- Auto-save functionality on changes
- Clear descriptions for each option

### Verification Checklist
- [ ] All toggles display correctly
- [ ] Toggles reflect current preferences
- [ ] Changes save automatically
- [ ] Success confirmation shows briefly
- [ ] Error handling functional
- [ ] Descriptions clear and helpful

---

## Task 92: Create Delete Account Option

### Overview
Create the delete account option component that provides customers with the ability to permanently delete their account. This section displays a clear warning about account deletion and contains a button that triggers the deletion confirmation modal.

### Dependencies
- Task 85: Create Settings Page

### Instructions

1. **Create DeleteAccount component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `DeleteAccount.tsx`
   - Define component with danger zone styling

2. **Add danger zone header**
   - Display "Delete Account" title with warning icon
   - Style section with danger colors (red border)
   - Add "Danger Zone" label or badge

3. **Display deletion warning**
   - Show clear warning about permanent deletion
   - List what will be deleted (orders, addresses, wishlist)
   - Explain data cannot be recovered
   - Mention alternative to deactivation

4. **Add delete button**
   - Create prominent "Delete My Account" button
   - Style with danger/destructive colors
   - Position button to require intentional click
   - Add warning icon to button

5. **Implement confirmation trigger**
   - Wire button to open confirmation modal (Task 93)
   - Pass necessary data to modal
   - Handle modal open state

6. **Style danger section**
   - Use red/danger color scheme
   - Add border and background to separate from other sections
   - Ensure button stands out as serious action
   - Position at bottom of settings page

### Deletion Information

| Item | Action | Recoverable |
|------|--------|-------------|
| Account | Permanently deleted | No |
| Order History | Permanently deleted | No |
| Saved Addresses | Permanently deleted | No |
| Wishlist | Permanently deleted | No |
| Reviews | Anonymized | Partially |

### Warning Messages

| Type | Message |
|------|---------|
| Primary | "This action cannot be undone" |
| Data Loss | "All your data will be permanently deleted" |
| Alternative | "Consider disabling notifications instead" |

### Expected Outcome
- Delete account section with clear warnings
- Danger-styled button for deletion
- Prominent position at page bottom

### Verification Checklist
- [ ] Delete section clearly marked as danger zone
- [ ] Warning messages comprehensive
- [ ] Delete button styled appropriately
- [ ] Button opens confirmation modal
- [ ] Section positioned at page bottom

---

## Task 93: Create Delete Confirmation Modal

### Overview
Create the delete confirmation modal that requires explicit user confirmation before account deletion. The modal uses a typed confirmation pattern where users must type "DELETE" to enable the final deletion button, ensuring the action is intentional.

### Dependencies
- Task 92: Create Delete Account Option

### Instructions

1. **Create DeleteConfirmation component**
   - Navigate to `frontend/components/storefront/portal/Settings/` directory
   - Create new file `DeleteConfirmation.tsx`
   - Define modal component with confirmation flow

2. **Design modal header**
   - Display "Delete Account?" title with warning icon
   - Style with danger colors
   - Add close button (X)

3. **Add warning content**
   - Show bold warning text
   - List specific data that will be lost
   - Display "This action is permanent and cannot be undone"
   - Add final warning emphasis

4. **Implement typed confirmation**
   - Add text input field
   - Require user to type "DELETE" exactly
   - Display instruction: "Type DELETE to confirm"
   - Case-sensitive validation

5. **Add confirmation validation**
   - Check if input matches "DELETE" exactly
   - Enable/disable confirm button based on match
   - Show hint if input doesn't match
   - Clear input on modal close

6. **Create modal actions**
   - Add "Cancel" button (secondary, closes modal)
   - Add "Delete My Account" button (danger color)
   - Disable delete button until "DELETE" typed
   - Show loading state during deletion

7. **Handle deletion process**
   - Call delete account API
   - Show processing spinner
   - Handle successful deletion (logout and redirect)
   - Handle errors (show message, keep modal open)

8. **Add final safeguards**
   - Require checkbox for final confirmation
   - Add "Are you absolutely sure?" text
   - Prevent accidental clicks
   - Add short delay before enabling button

### Confirmation Requirements

| Step | Requirement | Purpose |
|------|-------------|---------|
| 1 | Read warnings | Inform user |
| 2 | Type "DELETE" | Verify intent |
| 3 | Check confirmation box | Final safeguard |
| 4 | Click delete button | Execute action |

### Modal Structure
```
┌──────────────────────────────────────┐
│  ⚠ Delete Account?              [X] │
├──────────────────────────────────────┤
│                                      │
│  WARNING: This is permanent!         │
│                                      │
│  The following will be deleted:      │
│  • Your account and profile          │
│  • All order history                 │
│  • Saved addresses                   │
│  • Wishlist items                    │
│  • Saved payment methods             │
│                                      │
│  Type DELETE to confirm:             │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  □ I understand this is permanent   │
│                                      │
│  ┌────────┐  ┌────────────────────┐│
│  │ Cancel │  │ Delete My Account  ││
│  └────────┘  └────────────────────┘│
└──────────────────────────────────────┘
```

### Deletion Flow

| Step | Action | Result |
|------|--------|--------|
| 1 | User clicks delete button | Modal opens |
| 2 | User reads warnings | - |
| 3 | User types "DELETE" | Button enabled |
| 4 | User checks confirmation | Final safeguard |
| 5 | User clicks delete | API called |
| 6 | Success | Logout, redirect to home |
| 7 | Error | Show error, retry option |

### Expected Outcome
- Confirmation modal with typed verification
- Multiple safeguards against accidental deletion
- Clear deletion process with error handling

### Verification Checklist
- [ ] Modal displays all warnings clearly
- [ ] Typed confirmation works correctly
- [ ] Delete button disabled until "DELETE" typed
- [ ] Confirmation checkbox required
- [ ] Cancel button closes modal
- [ ] Delete process works end-to-end
- [ ] Success redirects to home page
- [ ] Errors handled gracefully

---

## Phase Completion

All tasks in this document are now complete. The account settings functionality is fully implemented with profile management, password changes, notification preferences, and account deletion with proper safeguards.

### What We Built
- Comprehensive settings page with four sections
- Profile section with edit functionality
- Profile form with validation and phone formatting
- Update profile API integration
- Password section with security information
- Change password form with strength validation
- Notification settings with auto-save toggles
- Delete account option with clear warnings
- Delete confirmation modal with typed verification

### Next Steps
Proceed to [02_Tasks-94-96_Testing.md](02_Tasks-94-96_Testing.md) to test the complete customer portal functionality including dashboard, addresses, and mobile responsiveness.
