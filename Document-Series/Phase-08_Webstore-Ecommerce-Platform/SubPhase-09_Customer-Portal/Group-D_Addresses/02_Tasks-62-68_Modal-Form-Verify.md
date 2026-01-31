# Tasks 62-68: Modal, Form, and Verification

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** D - Addresses  
> **Document:** 02 of 02  
> **Tasks Covered:** 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-61_Grid-Cards.md](01_Tasks-53-61_Grid-Cards.md)
- **→ Next Group:** [Group-E_Wishlist-Reviews](../Group-E_Wishlist-Reviews/)

---

## Document Overview

This document covers the creation of the address form modal with Sri Lanka-specific cascading dropdowns and complete CRUD operations. It establishes the address form with Province, District, City cascading dropdowns, form validation, API integration for saving addresses, delete confirmation modal, and comprehensive verification of all address management functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 62 | Create Add New Address Button | Low | 15 min |
| 63 | Create Address Form Modal | Medium | 25 min |
| 64 | Create Address Form | High | 45 min |
| 65 | Create Address Validation | Medium | 30 min |
| 66 | Create Save Address API Integration | Medium | 30 min |
| 67 | Create Delete Confirmation Modal | Low | 20 min |
| 68 | Verify Address Management | Low | 30 min |

---

## Task 62: Create Add New Address Button

### Overview
Create the add new address button that triggers the address form modal in create mode. This button is the primary action for adding new addresses and should be prominently displayed in the addresses header.

### Dependencies
- Task 54: Create Addresses Header

### Instructions

1. **Update AddressesHeader component**
   - Open `frontend/components/storefront/portal/Addresses/AddressesHeader.tsx`
   - Ensure add button is already implemented from Task 54
   - Verify button triggers modal open callback

2. **Verify button placement**
   - Confirm button is in header component
   - Check button is aligned to the right on desktop
   - Check button is full width on mobile
   - Ensure proper spacing from title

3. **Confirm button styling**
   - Use primary button variant
   - Include Plus icon before text
   - Display "Add New Address" text
   - Apply webstore primary color

4. **Verify callback integration**
   - Ensure button calls onAddClick prop
   - Verify callback opens modal in create mode
   - Check callback resets form state
   - Ensure proper event handling

5. **Test responsive behavior**
   - Verify button on mobile devices
   - Check button on tablet screens
   - Confirm button on desktop screens
   - Test with different viewport sizes

### Button Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Variant | Primary | Main action emphasis |
| Icon | Plus | Visual add indicator |
| Text | Add New Address | Clear action label |
| Position | Header right | Easy discovery |

### Expected Outcome
- Button integrated into addresses header
- Button triggers modal in create mode
- Button is responsive across devices
- Button follows design system styling
- Button is accessible with keyboard

### Verification Checklist
- [ ] Button exists in AddressesHeader
- [ ] Button opens modal on click
- [ ] Button displays Plus icon
- [ ] Button is responsive
- [ ] Button is keyboard accessible

---

## Task 63: Create Address Form Modal

### Overview
Create the modal component that contains the address form for adding and editing addresses. This modal provides a clean interface for address data entry, supporting both create and edit modes with proper state management.

### Dependencies
- Task 62: Create Add New Address Button

### Instructions

1. **Create the modal component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressFormModal.tsx`
   - This component wraps the address form in a modal dialog

2. **Import required dependencies**
   - Import Dialog or Modal component from UI library
   - Import address form component (created in Task 64)
   - Import TypeScript types for Address model
   - Import React hooks (useState, useEffect)

3. **Define component props interface**
   - Create interface for modal props
   - Include isOpen boolean for visibility control
   - Include onClose callback for closing modal
   - Include address prop for edit mode (optional)
   - Include onSave callback for form submission
   - Include mode prop ('create' or 'edit')

4. **Implement modal state management**
   - Control modal visibility with isOpen prop
   - Handle modal close on backdrop click
   - Handle modal close on escape key
   - Reset form state on close

5. **Create modal structure**
   - Use Dialog or Modal as container
   - Add modal header with title
   - Add close button in header
   - Add form component in modal body
   - Add footer with action buttons (optional)

6. **Implement dynamic title**
   - Display "Add New Address" for create mode
   - Display "Edit Address" for edit mode
   - Use conditional rendering based on mode
   - Apply proper typography styling

7. **Handle form submission**
   - Capture form submit event from child form
   - Call onSave callback with form data
   - Show loading state during save
   - Close modal on successful save
   - Show error message on failure

8. **Add modal animations**
   - Apply fade-in animation for backdrop
   - Apply slide-up or scale animation for modal
   - Add smooth transitions
   - Use design system animation utilities

### Modal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Modal visibility |
| onClose | () => void | Yes | Close callback |
| address | Address | null | No | Address to edit |
| onSave | (data) => Promise<void> | Yes | Save callback |
| mode | 'create' | 'edit' | Yes | Form mode |

### Modal Layout

```
┌─────────────────────────────────────┐
│ [Add New Address]            [X]   │ Header
├─────────────────────────────────────┤
│                                     │
│        Address Form Fields          │ Body
│        (Form component)             │
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Save]        │ Footer
└─────────────────────────────────────┘
```

### Modal Sizes

| Screen | Width | Height | Padding |
|--------|-------|--------|---------|
| Mobile | 95vw | Auto | 1rem |
| Tablet | 600px | Auto | 1.5rem |
| Desktop | 700px | Auto | 2rem |

### Expected Outcome
- Modal component for address form
- Supports create and edit modes
- Proper open/close behavior
- Form submission handling
- Responsive modal sizing

### Verification Checklist
- [ ] `AddressFormModal.tsx` file created
- [ ] Modal opens and closes correctly
- [ ] Modal title changes based on mode
- [ ] Modal integrates with form component
- [ ] Modal is responsive on all screens

---

## Task 64: Create Address Form

### Overview
Create the comprehensive address form with Sri Lanka-specific cascading dropdowns for Province, District, and City. This form handles both creating new addresses and editing existing ones, with proper validation and user experience for the cascading location selection.

### Dependencies
- Task 63: Create Address Form Modal

### Instructions

1. **Create the form component file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `AddressForm.tsx`
   - This component renders the complete address form

2. **Import required dependencies**
   - Import form components from UI library (Input, Select, Button)
   - Import React Hook Form or form management library
   - Import TypeScript types for Address model
   - Import location data for Sri Lanka (provinces, districts, cities)
   - Import validation schema (created in Task 65)

3. **Define form data interface**
   - Create interface matching Address model
   - Include all required fields for Sri Lanka address
   - Include optional fields (addressLine2, recipientName)
   - Include type field (shipping or billing)

4. **Set up form state and validation**
   - Initialize form with React Hook Form or similar
   - Connect validation schema from Task 65
   - Set default values for edit mode
   - Set empty values for create mode

5. **Create recipient information section**
   - Add input field for recipient name (optional)
   - Add input field for phone number (required)
   - Format phone as +94 XX XXX XXXX
   - Validate phone format

6. **Implement Province dropdown**
   - Create dropdown with all Sri Lanka provinces
   - Set as first field in location cascade
   - Load province list from static data or API
   - Handle province selection to load districts

7. **Implement District dropdown (cascading)**
   - Create dropdown that depends on selected province
   - Load districts based on selected province
   - Reset district and city when province changes
   - Disable until province is selected

8. **Implement City dropdown (cascading)**
   - Create dropdown that depends on selected district
   - Load cities based on selected district
   - Reset city when district changes
   - Disable until district is selected

9. **Create address line fields**
   - Add input field for address line 1 (required)
   - Add input field for address line 2 (optional)
   - Use textarea or multi-line input
   - Add character count if needed

10. **Add address type selector**
    - Create radio buttons or dropdown for type
    - Support "Shipping" and "Billing" options
    - Set default based on context
    - Style selected option clearly

11. **Add default address checkbox**
    - Create checkbox for "Set as default address"
    - Show separate checkbox for shipping and billing
    - Pre-check if editing current default
    - Explain default address behavior

12. **Implement form submission**
    - Create submit button at bottom of form
    - Trigger validation on submit
    - Call onSubmit callback with form data
    - Show loading state during submission
    - Display success or error messages

### Sri Lanka Location Hierarchy

```
Province (9 total)
  │
  ├─ District (25 total)
  │    │
  │    └─ City (Multiple per district)
  │
  └─ Selected → Filters → Cascades
```

### Form Fields Configuration

| Field | Type | Required | Cascade Level | Validation |
|-------|------|----------|---------------|------------|
| Recipient Name | Text | No | - | Min 2 chars |
| Phone | Text | Yes | - | +94 format |
| Province | Dropdown | Yes | 1 | Must select |
| District | Dropdown | Yes | 2 | Depends on province |
| City | Dropdown | Yes | 3 | Depends on district |
| Address Line 1 | Textarea | Yes | - | Min 5 chars |
| Address Line 2 | Textarea | No | - | Max 100 chars |
| Type | Radio | Yes | - | Shipping or Billing |
| Set as Default | Checkbox | No | - | Boolean |

### Cascading Dropdown Logic

| Action | Effect | Reset |
|--------|--------|-------|
| Select Province | Load districts for province | Clear district & city |
| Select District | Load cities for district | Clear city |
| Select City | Enable form submission | - |

### Form Layout Structure

```
┌─────────────────────────────────────┐
│ Contact Information                 │
│ ├─ Recipient Name (optional)        │
│ └─ Phone Number (+94 XX XXX XXXX)  │
├─────────────────────────────────────┤
│ Location (Sri Lanka Format)         │
│ ├─ Province Dropdown                │
│ ├─ District Dropdown (cascading)    │
│ └─ City Dropdown (cascading)        │
├─────────────────────────────────────┤
│ Address Details                     │
│ ├─ Address Line 1                   │
│ └─ Address Line 2 (optional)        │
├─────────────────────────────────────┤
│ Address Type                        │
│ ├─ ○ Shipping Address              │
│ └─ ○ Billing Address               │
├─────────────────────────────────────┤
│ ☐ Set as default address           │
├─────────────────────────────────────┤
│           [Cancel] [Save Address]   │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| address | Address | null | No | Address to edit |
| onSubmit | (data) => void | Yes | Submit callback |
| onCancel | () => void | Yes | Cancel callback |
| loading | boolean | No | Loading state |

### Expected Outcome
- Complete address form with all fields
- Working Province → District → City cascade
- Proper validation on all fields
- Support for create and edit modes
- Sri Lanka-specific phone and location format
- Clear UX with loading and error states

### Verification Checklist
- [ ] `AddressForm.tsx` file created
- [ ] All form fields implemented
- [ ] Cascading dropdowns work correctly
- [ ] Form validates properly
- [ ] Form submits data correctly
- [ ] Form resets after submission
- [ ] Form is responsive on mobile

---

## Task 65: Create Address Validation

### Overview
Create comprehensive validation schema for the address form using a validation library like Zod or Yup. This validation ensures data integrity, proper formatting for Sri Lanka addresses, and provides user-friendly error messages.

### Dependencies
- Task 64: Create Address Form

### Instructions

1. **Create validation schema file**
   - Navigate to `frontend/lib/validations/` directory
   - Create new file named `addressSchema.ts`
   - This file contains all address validation rules

2. **Import validation library**
   - Import Zod, Yup, or preferred validation library
   - Import any custom validators
   - Import TypeScript types for Address

3. **Define phone number validation**
   - Create regex pattern for Sri Lanka phone format
   - Pattern should match: +94 XX XXX XXXX
   - Accept with or without spaces
   - Provide clear error message for invalid format

4. **Create province validation**
   - Validate province is selected
   - Ensure province is from valid list
   - Provide error message if not selected
   - Consider using enum for province values

5. **Create district validation**
   - Validate district is selected
   - Ensure district is from valid list for province
   - Check district belongs to selected province
   - Provide contextual error message

6. **Create city validation**
   - Validate city is selected
   - Ensure city is from valid list for district
   - Check city belongs to selected district
   - Provide contextual error message

7. **Validate address lines**
   - Require address line 1 with minimum length
   - Make address line 2 optional
   - Set maximum character limits
   - Trim whitespace and validate

8. **Validate address type**
   - Ensure type is either 'shipping' or 'billing'
   - Make type selection required
   - Use enum or union type
   - Provide clear error message

9. **Create complete schema object**
   - Combine all field validations
   - Export schema for use in form
   - Include TypeScript type inference
   - Add custom error messages for each field

10. **Add custom validation rules**
    - Create custom validator for cascading selections
    - Validate province-district-city relationships
    - Ensure logical consistency
    - Provide helpful error messages

### Validation Rules Summary

| Field | Rules | Error Message |
|-------|-------|---------------|
| Recipient Name | Optional, min 2 chars | "Name must be at least 2 characters" |
| Phone | Required, +94 format | "Enter valid Sri Lanka phone: +94 XX XXX XXXX" |
| Province | Required, from list | "Please select a province" |
| District | Required, from list | "Please select a district" |
| City | Required, from list | "Please select a city" |
| Address Line 1 | Required, min 5 chars | "Address must be at least 5 characters" |
| Address Line 2 | Optional, max 100 chars | "Address line 2 too long" |
| Type | Required, enum | "Please select address type" |

### Phone Validation Pattern

```
Pattern: +94 XX XXX XXXX
Valid: +94 77 123 4567
Valid: +94 71 234 5678
Invalid: 0771234567
Invalid: +941234567
Invalid: 771234567
```

### Location Validation Logic

| Validation | Check | Error |
|------------|-------|-------|
| Province-District | District exists in province | "District not in selected province" |
| District-City | City exists in district | "City not in selected district" |
| Complete Path | All three selected | "Complete location selection required" |

### Expected Outcome
- Comprehensive validation schema for addresses
- Sri Lanka-specific phone format validation
- Cascading location validation
- Clear, user-friendly error messages
- Type-safe validation with TypeScript
- Reusable across application

### Verification Checklist
- [ ] `addressSchema.ts` file created in validations directory
- [ ] Phone validation matches +94 format
- [ ] Province-District-City cascade validated
- [ ] Address lines validated properly
- [ ] Type validation implemented
- [ ] Error messages are clear and helpful

---

## Task 66: Create Save Address API Integration

### Overview
Create the API integration service for saving addresses, supporting both creating new addresses and updating existing ones. This service handles API calls, error handling, and data transformation for address management operations.

### Dependencies
- Task 65: Create Address Validation

### Instructions

1. **Create address service file**
   - Navigate to `frontend/services/storefront/portal/` directory
   - Create new file named `addressService.ts`
   - This service handles all address-related API calls

2. **Import required dependencies**
   - Import API client or fetch utilities
   - Import TypeScript types for Address model
   - Import error handling utilities
   - Import authentication token helper

3. **Define API endpoints**
   - Create constant for base API URL
   - Define endpoint for creating address (POST)
   - Define endpoint for updating address (PUT/PATCH)
   - Define endpoint for deleting address (DELETE)
   - Define endpoint for fetching addresses (GET)
   - Define endpoint for setting default (PATCH)

4. **Create fetchAddresses function**
   - Implement GET request to fetch all customer addresses
   - Include authentication token in headers
   - Handle loading and error states
   - Return array of Address objects
   - Cache results if appropriate

5. **Create createAddress function**
   - Implement POST request to create new address
   - Accept address data as parameter
   - Include authentication token in headers
   - Transform data to match API format
   - Handle success and error responses
   - Return created address object

6. **Create updateAddress function**
   - Implement PUT/PATCH request to update address
   - Accept address ID and updated data
   - Include authentication token in headers
   - Transform data to match API format
   - Handle success and error responses
   - Return updated address object

7. **Create deleteAddress function**
   - Implement DELETE request to remove address
   - Accept address ID as parameter
   - Include authentication token in headers
   - Handle success and error responses
   - Return success status

8. **Create setDefaultAddress function**
   - Implement PATCH request to set default address
   - Accept address ID and type (shipping/billing)
   - Include authentication token in headers
   - Handle business logic (one default per type)
   - Return updated address

9. **Implement error handling**
   - Create error handling wrapper
   - Parse API error responses
   - Transform errors to user-friendly messages
   - Handle network errors
   - Handle authentication errors

10. **Add request/response transformers**
    - Transform frontend data to API format
    - Transform API response to frontend format
    - Handle date formatting
    - Handle null/undefined values

### API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/portal/addresses` | Fetch all addresses | Yes |
| POST | `/api/portal/addresses` | Create new address | Yes |
| PATCH | `/api/portal/addresses/:id` | Update address | Yes |
| DELETE | `/api/portal/addresses/:id` | Delete address | Yes |
| PATCH | `/api/portal/addresses/:id/default` | Set as default | Yes |

### Service Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| fetchAddresses | - | Promise<Address[]> | Get all addresses |
| createAddress | addressData | Promise<Address> | Create address |
| updateAddress | id, addressData | Promise<Address> | Update address |
| deleteAddress | id | Promise<void> | Delete address |
| setDefaultAddress | id, type | Promise<Address> | Set default |

### Error Handling

| Error Type | HTTP Code | User Message |
|------------|-----------|--------------|
| Validation | 400 | "Please check your input" |
| Unauthorized | 401 | "Please log in again" |
| Not Found | 404 | "Address not found" |
| Server Error | 500 | "Something went wrong" |
| Network Error | - | "Check your connection" |

### Request/Response Format

```
Frontend Format (TypeScript):
{
  id: string
  recipientName?: string
  phone: string
  province: string
  district: string
  city: string
  addressLine1: string
  addressLine2?: string
  type: 'shipping' | 'billing'
  isDefault: boolean
}

API Format (JSON):
{
  id: "uuid"
  recipient_name: string | null
  phone: string
  province: string
  district: string
  city: string
  address_line_1: string
  address_line_2: string | null
  address_type: "shipping" | "billing"
  is_default: boolean
}
```

### Expected Outcome
- Complete address service with all CRUD operations
- Proper error handling for all requests
- Data transformation between frontend and API
- Authentication token included in requests
- Type-safe functions with TypeScript
- Reusable service across components

### Verification Checklist
- [ ] `addressService.ts` file created
- [ ] All CRUD functions implemented
- [ ] Authentication tokens included
- [ ] Error handling implemented
- [ ] Data transformation working
- [ ] TypeScript types defined

---

## Task 67: Create Delete Confirmation Modal

### Overview
Create a confirmation modal that appears before deleting an address, preventing accidental deletions. This modal provides clear information about the action and requires explicit user confirmation before proceeding with deletion.

### Dependencies
- Task 60: Create Delete Address Button

### Instructions

1. **Create confirmation modal file**
   - Navigate to `frontend/components/storefront/portal/Addresses/` directory
   - Create new file named `DeleteConfirmation.tsx`
   - This component renders the delete confirmation dialog

2. **Import required dependencies**
   - Import Dialog or AlertDialog component from UI library
   - Import button components
   - Import warning or alert icon
   - Import TypeScript types for props

3. **Define component props interface**
   - Create interface for modal props
   - Include isOpen boolean for visibility
   - Include onClose callback for cancel
   - Include onConfirm callback for deletion
   - Include addressInfo for displaying details
   - Include loading state for delete operation

4. **Create modal structure**
   - Use AlertDialog or destructive modal variant
   - Add warning icon in header
   - Display clear warning title
   - Show address preview information
   - Add explanation of consequences

5. **Implement modal header**
   - Use warning icon with red/orange color
   - Display "Delete Address?" title
   - Use appropriate heading level
   - Apply warning visual styling

6. **Implement modal body**
   - Show brief address preview (city, type)
   - Display warning message
   - Explain action is permanent
   - Note any related consequences
   - Use clear, concise language

7. **Implement modal footer**
   - Add Cancel button (secondary/ghost variant)
   - Add Delete button (destructive/danger variant)
   - Position Cancel on left, Delete on right
   - Apply proper spacing between buttons

8. **Handle confirmation flow**
   - Connect Cancel button to onClose callback
   - Connect Delete button to onConfirm callback
   - Show loading state on Delete button
   - Disable buttons during deletion
   - Close modal on successful deletion

9. **Add accessibility features**
   - Set focus on Cancel button by default
   - Support Escape key to cancel
   - Add proper ARIA labels
   - Use semantic HTML structure
   - Ensure keyboard navigation

### Modal Content Structure

```
┌─────────────────────────────────────┐
│         ⚠️  Delete Address?         │ Header
├─────────────────────────────────────┤
│                                     │
│ Are you sure you want to delete     │
│ this address?                       │
│                                     │
│ Colombo, Western Province           │ Preview
│ Shipping Address                    │
│                                     │
│ This action cannot be undone.       │ Warning
│                                     │
├─────────────────────────────────────┤
│          [Cancel]    [Delete]       │ Footer
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Modal visibility |
| onClose | () => void | Yes | Cancel callback |
| onConfirm | () => Promise<void> | Yes | Delete callback |
| addressInfo | { city, type } | Yes | Address preview |
| loading | boolean | No | Delete in progress |

### Button Configuration

| Button | Variant | Color | Position | Action |
|--------|---------|-------|----------|--------|
| Cancel | Secondary | Neutral | Left | Close modal |
| Delete | Danger | Red | Right | Confirm delete |

### Warning Messages

| Scenario | Message |
|----------|---------|
| Default | "Cannot delete default address. Set another as default first." |
| Last Address | "Warning: This is your only address." |
| Standard | "This action cannot be undone." |

### Expected Outcome
- Confirmation modal before deletion
- Clear warning with address preview
- Cancel and Delete buttons
- Loading state during deletion
- Prevents accidental deletions
- Accessible and keyboard-friendly

### Verification Checklist
- [ ] `DeleteConfirmation.tsx` file created
- [ ] Modal displays warning clearly
- [ ] Cancel button closes modal
- [ ] Delete button calls onConfirm
- [ ] Loading state shows during delete
- [ ] Modal is keyboard accessible

---

## Task 68: Verify Address Management

### Overview
Perform comprehensive verification of all address management functionality to ensure proper operation of CRUD operations, cascading dropdowns, validation, API integration, and user experience. This task validates the complete address management feature.

### Dependencies
- Task 67: Create Delete Confirmation Modal
- All previous tasks in this group

### Instructions

1. **Verify addresses page display**
   - Navigate to customer portal addresses page
   - Confirm page loads without errors
   - Verify addresses header displays correctly
   - Confirm address grid shows with proper layout
   - Check responsive behavior on different screen sizes

2. **Verify empty state**
   - Test with customer account having no addresses
   - Confirm empty state displays correctly
   - Verify empty state message is clear
   - Check add address call-to-action is visible
   - Ensure styling matches design system

3. **Verify address card display**
   - Add test addresses with different types
   - Confirm all address fields display correctly
   - Verify Sri Lanka format (Province, District, City)
   - Check phone number displays with +94 format
   - Verify default badge shows only for default addresses
   - Confirm address type labels display correctly

4. **Test create address flow**
   - Click "Add New Address" button
   - Verify modal opens with empty form
   - Confirm modal title shows "Add New Address"
   - Test all form fields are empty and enabled
   - Verify Province dropdown has all provinces
   - Test District dropdown is disabled until province selected

5. **Test cascading dropdowns**
   - Select a province from dropdown
   - Verify districts load for selected province
   - Confirm district dropdown becomes enabled
   - Select a district from dropdown
   - Verify cities load for selected district
   - Confirm city dropdown becomes enabled
   - Change province and verify district/city reset

6. **Test form validation**
   - Try submitting empty form
   - Verify all required field errors display
   - Test phone number format validation
   - Verify error messages are clear and helpful
   - Test character limits on address lines
   - Confirm validation prevents form submission

7. **Test successful address creation**
   - Fill all required fields correctly
   - Select Province → District → City
   - Enter valid phone number with +94 format
   - Enter address lines
   - Select address type (shipping or billing)
   - Submit form and verify loading state
   - Confirm modal closes on success
   - Verify new address appears in grid

8. **Test edit address flow**
   - Click Edit button on existing address
   - Verify modal opens with pre-filled data
   - Confirm modal title shows "Edit Address"
   - Verify all fields populated with current values
   - Verify cascading dropdowns show correct selections
   - Make changes to some fields
   - Submit and verify updates appear

9. **Test set default functionality**
   - Create multiple addresses of same type
   - Click "Set as Default" on non-default address
   - Verify loading state on button
   - Confirm default badge moves to selected address
   - Verify previous default no longer shows badge
   - Test with both shipping and billing types

10. **Test delete address flow**
    - Click Delete button on non-default address
    - Verify confirmation modal appears
    - Check modal shows address preview
    - Click Cancel and verify modal closes
    - Click Delete button again
    - Click Delete in confirmation modal
    - Verify address is removed from grid

11. **Test delete restrictions**
    - Try deleting default address
    - Verify delete button is disabled
    - Hover over disabled button
    - Confirm tooltip explains restriction
    - Set another address as default first
    - Verify original address can now be deleted

12. **Test API error handling**
    - Simulate network error (disable network)
    - Try creating address
    - Verify error message displays
    - Confirm user can retry
    - Re-enable network and verify success
    - Test validation errors from API

13. **Test responsive design**
    - View addresses page on mobile device (< 640px)
    - Verify grid shows single column
    - Confirm cards display properly
    - Check modal is responsive
    - Test form fields on mobile
    - Verify buttons are accessible on small screens

14. **Verify accessibility**
    - Navigate page using keyboard only
    - Verify all interactive elements are reachable
    - Test modal opening and closing with keyboard
    - Verify form submission with Enter key
    - Check screen reader announcements
    - Confirm proper heading hierarchy

15. **Test edge cases**
    - Test with very long address lines
    - Test with special characters in address
    - Test with multiple addresses (10+)
    - Test rapid clicking of buttons
    - Test concurrent edit operations
    - Test browser back button behavior

### Verification Checklist

#### Display & Layout
- [ ] Addresses page loads correctly
- [ ] Empty state displays when no addresses
- [ ] Address grid shows 2 columns on desktop
- [ ] Address grid shows 1 column on mobile
- [ ] All address cards display properly
- [ ] Header with add button displays correctly

#### Address Card Components
- [ ] Address type labels show correct color (blue/purple)
- [ ] Default badge shows only for default addresses
- [ ] All address fields display properly formatted
- [ ] Phone numbers show with +94 format
- [ ] Sri Lanka location shows Province, District, City
- [ ] Action buttons (Edit, Delete, Set Default) are visible

#### Create Address Flow
- [ ] Add button opens modal
- [ ] Modal title shows "Add New Address"
- [ ] Form fields are empty initially
- [ ] Province dropdown populated correctly
- [ ] District dropdown disabled until province selected
- [ ] City dropdown disabled until district selected
- [ ] Cascading dropdowns work correctly
- [ ] Form validation prevents invalid submission
- [ ] Success creates address and closes modal
- [ ] New address appears in grid

#### Edit Address Flow
- [ ] Edit button opens modal with data
- [ ] Modal title shows "Edit Address"
- [ ] All fields pre-filled with current data
- [ ] Cascading dropdowns show current selections
- [ ] Changes save correctly
- [ ] Updated data displays in card
- [ ] Modal closes on successful save

#### Delete Address Flow
- [ ] Delete button opens confirmation modal
- [ ] Confirmation shows address preview
- [ ] Cancel button closes modal
- [ ] Delete button removes address
- [ ] Delete button disabled for default address
- [ ] Tooltip explains why button disabled

#### Set Default Functionality
- [ ] Set Default button hidden for default addresses
- [ ] Set Default button visible for non-default
- [ ] Clicking button sets address as default
- [ ] Default badge updates correctly
- [ ] Only one default per type (shipping/billing)
- [ ] Loading state shows during update

#### Validation
- [ ] Required fields show error when empty
- [ ] Phone validation requires +94 format
- [ ] Province selection required
- [ ] District selection required (after province)
- [ ] City selection required (after district)
- [ ] Address line 1 requires minimum length
- [ ] Error messages are clear and helpful

#### API Integration
- [ ] Addresses load on page mount
- [ ] Create address calls API correctly
- [ ] Update address calls API correctly
- [ ] Delete address calls API correctly
- [ ] Set default calls API correctly
- [ ] Loading states display during API calls
- [ ] Error messages display on API failures
- [ ] Success messages display appropriately

#### Responsive Design
- [ ] Mobile view (< 640px) works correctly
- [ ] Tablet view (640px - 1024px) works correctly
- [ ] Desktop view (> 1024px) works correctly
- [ ] Modal is responsive on all screen sizes
- [ ] Form is usable on mobile devices
- [ ] Buttons are accessible on small screens

#### Accessibility
- [ ] All elements keyboard navigable
- [ ] Focus visible on all interactive elements
- [ ] Modal traps focus when open
- [ ] Escape key closes modal
- [ ] Enter key submits form
- [ ] Screen reader labels present
- [ ] Color contrast meets WCAG standards

#### Edge Cases
- [ ] Long addresses truncate or wrap properly
- [ ] Special characters handled in addresses
- [ ] Multiple addresses (10+) display correctly
- [ ] Rapid button clicks handled properly
- [ ] Concurrent operations prevented
- [ ] Browser back button works correctly

### Expected Outcome
- All address CRUD operations working correctly
- Sri Lanka cascading dropdowns functioning properly
- Form validation working with clear error messages
- API integration successful for all operations
- Responsive design working on all devices
- Accessibility standards met
- User experience smooth and intuitive
- No console errors or warnings
- All edge cases handled gracefully

### Final Deliverables

```
frontend/components/storefront/portal/Addresses/
├── AddressesPage.tsx           # Main page (Task 53)
├── AddressesHeader.tsx         # Header with add button (Tasks 54, 62)
├── AddressGrid.tsx             # Grid layout (Task 55)
├── AddressCard.tsx             # Address card (Task 56)
├── DefaultBadge.tsx            # Default indicator (Task 57)
├── AddressType.tsx             # Type label (Task 58)
├── AddressActions.tsx          # Action buttons (Tasks 59-61)
├── AddressFormModal.tsx        # Form modal (Task 63)
├── AddressForm.tsx             # Form with cascade (Task 64)
├── DeleteConfirmation.tsx      # Delete confirmation (Task 67)
└── index.ts                    # Exports

frontend/lib/validations/
└── addressSchema.ts            # Validation schema (Task 65)

frontend/services/storefront/portal/
└── addressService.ts           # API integration (Task 66)
```

---

## Notes for AI Agents

- This document completes address management feature
- Sri Lanka format is critical: Province → District → City (no zip code)
- Phone format must be +94 XX XXX XXXX
- Cascading dropdowns must reset properly on parent change
- Default address per type (shipping and billing separate)
- Cannot delete default address without setting another first
- Comprehensive testing required for cascading functionality
- Form validation must be user-friendly with clear messages
- API integration must handle all CRUD operations
- Responsive design essential for mobile users
- Accessibility is required, not optional
- All components should use existing design system
- Maintain consistency with customer portal styling
- Verification task ensures complete feature functionality
- Edge cases and error handling are critical for production readiness
