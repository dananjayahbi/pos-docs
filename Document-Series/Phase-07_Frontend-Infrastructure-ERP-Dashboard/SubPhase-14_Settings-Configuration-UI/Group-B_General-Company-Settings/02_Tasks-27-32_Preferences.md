# Tasks 27-32: Company Address, Tax & Contact Information

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** B - General & Company Settings  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-26_Company-Profile.md](01_Tasks-15-26_Company-Profile.md)
- **→ Next Group:** [Group-C_User-Management](../Group-C_User-Management/)

---

## Document Overview

This document covers the completion of the company settings page including business address form, tax information section, contact details, and the save functionality to persist company profile changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Company Address Form | Medium | 30 min |
| 28 | Create Tax Information Section | Medium | 25 min |
| 29 | Create Contact Information | Low | 20 min |
| 30 | Create Save Company Settings | Medium | 25 min |

---

## Task 27: Create Company Address Form

### Overview
Create the business address form component that captures the company's physical location including street address, city, province, postal code, and country. This information is used for invoices, shipping, and official documentation.

### Dependencies
- Task 23: Company Form Schema created
- Task 22: Company Settings Page created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `CompanyAddressForm.tsx`

2. **Import dependencies**
   - Import form components (Input, Select)
   - Import FormField, FormLabel, FormMessage
   - Import form control utilities

3. **Implement address fields**
   - Street address input (text area for multiple lines)
   - City input
   - Province/State select
   - Postal code input
   - Country input (default: Sri Lanka, read-only or select)

4. **Add field labels and validation**
   - Label each field clearly
   - Mark required fields with asterisk
   - Connect to form validation schema
   - Display validation errors

5. **Include province options for Sri Lanka**
   - Create dropdown with all Sri Lankan provinces
   - Pre-populate if editing existing address
   - Allow selection

6. **Organize layout**
   - Street address: full width
   - City: half width
   - Province: half width (same row as city)
   - Postal code: half width
   - Country: half width (same row as postal code)

### Address Form Structure

```
Company Address Form
─────────────────────────────────────
Business Address *

Street Address *
[_________________________________]
[_________________________________]

City *                 Province *
[______________]       [__________ ▾]

Postal Code *          Country *
[______________]       [Sri Lanka    ]
```

### Form Fields

| Field | Type | Required | Width |
|-------|------|----------|-------|
| Street Address | Textarea | Yes | Full |
| City | Input | Yes | Half |
| Province | Select | Yes | Half |
| Postal Code | Input | Yes | Half |
| Country | Input/Select | Yes | Half |

### Sri Lankan Provinces

| Province | Value |
|----------|-------|
| Western | western |
| Central | central |
| Southern | southern |
| Northern | northern |
| Eastern | eastern |
| North Western | north_western |
| North Central | north_central |
| Uva | uva |
| Sabaragamuwa | sabaragamuwa |

### Field Validation

| Field | Validation |
|-------|------------|
| Street | Required, min 1 character |
| City | Required, min 1 character |
| Province | Required, valid option |
| Postal Code | Required, numeric (5 digits for LK) |
| Country | Default: Sri Lanka |

### Layout Grid

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column |
| Tablet (≥768px) | Two columns for city/province, postal/country |
| Desktop (≥1024px) | Same as tablet |

### Expected Outcome
- Company address form component created
- All address fields included
- Province dropdown populated
- Form validation working

### Verification Checklist
- [ ] CompanyAddressForm.tsx component created
- [ ] All address fields rendered
- [ ] Province options populated
- [ ] Layout responsive
- [ ] Validation working

---

## Task 28: Create Tax Information Section

### Overview
Create the tax information section component that captures company tax registration details including TIN (Tax Identification Number), VAT number, and tax registration type. This information is essential for invoicing and tax compliance.

### Dependencies
- Task 23: Company Form Schema created
- Task 22: Company Settings Page created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `TaxInfoSection.tsx`

2. **Import dependencies**
   - Import form components
   - Import Select component for tax type
   - Import form utilities

3. **Implement tax fields**
   - TIN (Tax Identification Number) input
   - VAT number input
   - Tax registration type select
   - All fields optional (not all businesses registered)

4. **Add TIN input**
   - Label: "Tax Identification Number (TIN)"
   - Placeholder: "Enter TIN"
   - Format: Alphanumeric
   - Help text: "Your business tax ID"

5. **Add VAT number input**
   - Label: "VAT Number"
   - Placeholder: "Enter VAT number"
   - Optional field
   - Help text: "If VAT registered"

6. **Add tax type select**
   - Label: "Tax Registration Type"
   - Options: Not Registered, VAT Registered, Income Tax Only, Both
   - Default: Not Registered
   - Help text explaining each type

7. **Organize in section card**
   - Use SettingsSectionCard component
   - Title: "Tax Information"
   - Description: "Tax registration and identification"

### Tax Section Structure

```
Tax Information Section
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Tax Information                     │
│ Tax registration and identification │
├─────────────────────────────────────┤
│                                     │
│  Tax Identification Number (TIN)   │
│  [_______________________]          │
│  Your business tax ID               │
│                                     │
│  VAT Number                         │
│  [_______________________]          │
│  If VAT registered                  │
│                                     │
│  Tax Registration Type              │
│  [Not Registered            ▾]     │
│  Select your tax status             │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TIN | Input | No | Tax Identification Number |
| VAT Number | Input | No | VAT registration number |
| Tax Type | Select | No | Type of tax registration |

### Tax Registration Types

| Option | Value | Description |
|--------|-------|-------------|
| Not Registered | none | No tax registration |
| VAT Registered | vat | Registered for VAT |
| Income Tax Only | income_tax | Income tax registration only |
| Both | both | VAT and Income Tax |

### Field Formats

| Field | Format | Example |
|-------|--------|---------|
| TIN | Alphanumeric | 123456789V or 987654321 |
| VAT Number | Alphanumeric | VAT123456789 |

### Help Text

| Field | Help Text |
|-------|-----------|
| TIN | "Your business tax identification number" |
| VAT Number | "Required if VAT registered" |
| Tax Type | "Select your current tax registration status" |

### Expected Outcome
- Tax information section created
- All tax fields included
- Optional validation applied
- Section wrapped in card

### Verification Checklist
- [ ] TaxInfoSection.tsx component created
- [ ] TIN input rendered
- [ ] VAT input rendered
- [ ] Tax type select populated
- [ ] Section card applied

---

## Task 29: Create Contact Information

### Overview
Create the contact information section component that captures company contact details including phone number, email address, and website URL. This information is used for customer communication and displayed on documents.

### Dependencies
- Task 23: Company Form Schema created
- Task 22: Company Settings Page created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `ContactInfoSection.tsx`

2. **Import dependencies**
   - Import form components
   - Import Input component
   - Import phone input component (if available)

3. **Implement contact fields**
   - Phone number input with +94 prefix
   - Email address input
   - Website URL input

4. **Add phone input**
   - Label: "Phone Number"
   - Format: +94 prefix for Sri Lankan numbers
   - Required field
   - Validation: 9 digits after +94
   - Placeholder: "+94 771234567"

5. **Add email input**
   - Label: "Email Address"
   - Type: email
   - Required field
   - Validation: Valid email format
   - Placeholder: "contact@company.lk"

6. **Add website input**
   - Label: "Website"
   - Type: url
   - Optional field
   - Validation: Valid URL if provided
   - Placeholder: "https://www.company.lk"

7. **Organize in section card**
   - Use SettingsSectionCard component
   - Title: "Contact Information"
   - Description: "How customers can reach you"

### Contact Section Structure

```
Contact Information Section
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Contact Information                 │
│ How customers can reach you         │
├─────────────────────────────────────┤
│                                     │
│  Phone Number *                     │
│  [+94] [_________________]          │
│  Business phone number              │
│                                     │
│  Email Address *                    │
│  [_______________________]          │
│  Business email address             │
│                                     │
│  Website                            │
│  [_______________________]          │
│  Company website URL                │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Phone | Tel | Yes | +94 format, 9 digits |
| Email | Email | Yes | Valid email |
| Website | URL | No | Valid URL if provided |

### Phone Number Format

| Component | Value |
|-----------|-------|
| Country Code | +94 |
| Area Code | 7x, 8x, 9x |
| Number | 7 digits |
| Full Format | +94771234567 |

### Email Validation

| Rule | Example |
|------|---------|
| Valid | contact@company.lk |
| Valid | info@mycompany.com |
| Invalid | notanemail |
| Invalid | @company.com |

### Website URL Format

| Format | Example |
|--------|---------|
| With Protocol | https://www.company.lk |
| With Protocol | http://company.com |
| Without Protocol | Not allowed (must include http:// or https://) |

### Expected Outcome
- Contact information section created
- Phone input with +94 prefix
- Email input with validation
- Website input (optional)

### Verification Checklist
- [ ] ContactInfoSection.tsx component created
- [ ] Phone input with country code
- [ ] Email input rendered
- [ ] Website input rendered
- [ ] Section card applied

---

## Task 30: Create Save Company Settings

### Overview
Create the save functionality for the company settings form. This includes the save button, form submission handling, API integration, loading states, and success/error feedback to the user.

### Dependencies
- Tasks 22-29: All company form components created

### Instructions

1. **Implement form submission handler**
   - Create async function to handle form submit
   - Extract form data
   - Validate data using schema
   - Prepare payload for API

2. **Add API integration**
   - Create API call to save company settings
   - Use PUT or PATCH method
   - Send form data as JSON
   - Handle response

3. **Implement loading state**
   - Show loading spinner on button during save
   - Disable form fields during save
   - Prevent multiple submissions
   - Show loading overlay (optional)

4. **Add success feedback**
   - Display success toast message
   - Message: "Company settings saved successfully"
   - Auto-dismiss after 3-5 seconds
   - Update local state with saved data

5. **Add error handling**
   - Catch API errors
   - Display error toast message
   - Show field-specific errors if available
   - Allow retry

6. **Create save button**
   - Position at bottom of form
   - Primary button styling
   - Show "Save Changes" text
   - Show loading spinner when saving
   - Disable when form invalid or unchanged

7. **Track form changes**
   - Detect if form has been modified
   - Enable save button only when changed
   - Prompt user if navigating away with unsaved changes

### Save Flow Diagram

```
Form Submission Flow
─────────────────────────────────────
User fills form
      │
      ▼
Clicks Save
      │
      ▼
Validate form data
      │
      ├─────────────────┐
      ▼                 ▼
   Valid             Invalid
      │                 │
      ▼                 ▼
Send to API      Show errors
      │
      ├─────────────────┐
      ▼                 ▼
   Success           Failure
      │                 │
      ▼                 ▼
Show success      Show error
toast             toast
      │
      ▼
Update local
state
```

### Save Button States

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | Blue, enabled | Clickable |
| Disabled | Gray, disabled | Not clickable (no changes) |
| Loading | Blue, spinner | Not clickable (saving) |
| Success | Green flash (momentary) | Feedback |
| Error | Red flash (momentary) | Feedback |

### API Endpoint

| Method | Endpoint | Payload |
|--------|----------|---------|
| PUT | /api/company/settings | Company data JSON |
| PATCH | /api/company/settings | Partial company data |

### Success Response

```json
{
  "success": true,
  "message": "Company settings updated successfully",
  "data": {
    "id": "comp_123",
    "name": "Company Name",
    "updatedAt": "2026-01-26T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to update company settings",
  "errors": {
    "phone": "Invalid phone number format",
    "email": "Email already in use"
  }
}
```

### Toast Messages

| Type | Message | Duration |
|------|---------|----------|
| Success | "Company settings saved successfully" | 3 seconds |
| Error | "Failed to save settings. Please try again." | 5 seconds |
| Validation | "Please fix form errors before saving" | 4 seconds |

### Form Change Detection

| Scenario | Save Button |
|----------|-------------|
| No changes | Disabled |
| Has changes | Enabled |
| Invalid data | Disabled |
| Saving | Disabled with spinner |

### Unsaved Changes Warning

```
Navigation Dialog
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Unsaved Changes                     │
├─────────────────────────────────────┤
│ You have unsaved changes.           │
│ Are you sure you want to leave?     │
│                                     │
│  [Cancel]  [Leave Without Saving]   │
└─────────────────────────────────────┘
```

### Expected Outcome
- Save functionality implemented
- API integration working
- Loading states displayed
- Success/error feedback shown
- Form change detection working

### Verification Checklist
- [ ] Form submission handler created
- [ ] API integration implemented
- [ ] Loading state shows during save
- [ ] Success toast displays
- [ ] Error handling implemented
- [ ] Save button states correct
- [ ] Form change detection working

---

## Summary

This document completed the company settings implementation:

1. **Company Address Form** - Street, city, province, postal code, country
2. **Tax Information Section** - TIN, VAT number, tax registration type
3. **Contact Information** - Phone (+94), email, website
4. **Save Company Settings** - Form submission, API integration, feedback

### Complete Company Settings Structure

```
Company Settings (Group B Complete)
├── General Settings Page ✓
│   ├── Settings Section Card ✓
│   ├── Localization Settings ✓
│   │   ├── Timezone Select (Asia/Colombo) ✓
│   │   ├── Currency Select (LKR) ✓
│   │   └── Date Format Select (DD/MM/YYYY) ✓
│   └── Notification Settings ✓
│
└── Company Settings Page ✓
    ├── Company Form Schema ✓
    ├── Company Name Input ✓
    ├── Logo Upload ✓
    ├── Logo Preview ✓
    ├── Company Address Form ✓
    ├── Tax Information Section ✓
    ├── Contact Information ✓
    └── Save Company Settings ✓
```

### Completed Components

```
frontend/components/modules/settings/
├── General/
│   ├── GeneralSettings.tsx
│   ├── SettingsSectionCard.tsx
│   ├── LocalizationSettings.tsx
│   ├── TimezoneSelect.tsx
│   ├── CurrencySelect.tsx
│   ├── DateFormatSelect.tsx
│   └── NotificationSettings.tsx
└── Company/
    ├── CompanySettings.tsx
    ├── CompanyNameInput.tsx
    ├── LogoUpload.tsx
    ├── LogoPreview.tsx
    ├── CompanyAddressForm.tsx
    ├── TaxInfoSection.tsx
    └── ContactInfoSection.tsx
```

### Next Steps

Continue to [Group-C_User-Management](../Group-C_User-Management/) to build:
- User management page with table
- User invitation modal and flow
- User actions (edit, disable, remove)
- Pending invitations management

---

**End of Document 02 of 02 - Group B Complete**
