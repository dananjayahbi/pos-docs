# Tasks 15-26: General Settings & Company Profile

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** B - General & Company Settings  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Preferences.md](02_Tasks-27-32_Preferences.md)

---

## Document Overview

This document covers the creation of general settings page with localization options (timezone, currency, date format), notification preferences, and the company settings page with company profile information including name, logo, address, and tax details.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create General Settings Page | Low | 20 min |
| 16 | Create Settings Section Card | Low | 15 min |
| 17 | Create Localization Settings | Medium | 30 min |
| 18 | Create Timezone Select | Low | 20 min |
| 19 | Create Currency Select | Low | 20 min |
| 20 | Create Date Format Select | Low | 15 min |
| 21 | Create Notification Settings | Medium | 25 min |
| 22 | Create Company Settings Page | Medium | 25 min |
| 23 | Create Company Form Schema | Medium | 20 min |
| 24 | Create Company Name Input | Low | 15 min |
| 25 | Create Logo Upload | Medium | 30 min |
| 26 | Create Logo Preview | Low | 15 min |

---

## Task 15: Create General Settings Page

### Overview
Create the main general settings page component that serves as the container for all general application settings. This page includes localization settings (timezone, currency, date format) and notification preferences organized into clear sections.

### Dependencies
- Group A: Settings route structure created
- SubPhase-05: Form components available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create directory structure if needed
   - Create file `GeneralSettings.tsx`

2. **Import dependencies**
   - Import form components from SubPhase-05
   - Import SettingsSectionCard component (Task 16)
   - Import localization components (Tasks 17-20)
   - Import notification components (Task 21)

3. **Define component structure**
   - Create main container with proper spacing
   - Add page header with title and description
   - Organize sections vertically

4. **Include settings sections**
   - Add localization settings section
   - Add notification settings section
   - Add save button at bottom

5. **Implement form state management**
   - Use React Hook Form for form handling
   - Define form schema with Zod validation
   - Handle form submission

6. **Add save functionality**
   - Create save handler function
   - Show loading state during save
   - Display success/error toast messages
   - Update settings via API

### Page Structure

```
General Settings Page
─────────────────────────────────────
┌─────────────────────────────────────────┐
│ General Settings                        │
│ Manage your account preferences         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Localization                      │ │
│  │ Configure regional settings       │ │
│  ├───────────────────────────────────┤ │
│  │ Timezone: [Asia/Colombo      ▾]  │ │
│  │ Currency: [LKR - ₨          ▾]  │ │
│  │ Date Format: [DD/MM/YYYY    ▾]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Notifications                     │ │
│  │ Manage notification preferences   │ │
│  ├───────────────────────────────────┤ │
│  │ ☑ Email Notifications            │ │
│  │ ☑ Order Alerts                   │ │
│  │ ☑ Low Stock Alerts               │ │
│  │ ☐ Daily Reports                  │ │
│  │ ☑ Push Notifications             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Save Changes]                         │
│                                         │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| initialSettings | GeneralSettings | No | Pre-loaded settings |

### Settings Data Structure

```typescript
interface GeneralSettings {
  timezone: string;
  currency: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    orderAlerts: boolean;
    lowStockAlerts: boolean;
    dailyReports: boolean;
    push: boolean;
  };
}
```

### Form Sections

| Section | Components | Purpose |
|---------|-----------|---------|
| Localization | Timezone, Currency, Date Format | Regional settings |
| Notifications | Email, Push, Alert toggles | Notification preferences |
| Actions | Save button | Submit changes |

### Expected Outcome
- General settings page component created
- Sections properly organized
- Form state management implemented
- Save functionality working

### Verification Checklist
- [ ] GeneralSettings.tsx component created
- [ ] Page header displayed
- [ ] Sections organized clearly
- [ ] Form state managed correctly
- [ ] Save button functional

---

## Task 16: Create Settings Section Card

### Overview
Create a reusable settings section card component that provides consistent styling and structure for all settings sections. This component wraps settings groups with a title, description, and content area.

### Dependencies
- Task 15: General Settings Page created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `SettingsSectionCard.tsx`

2. **Define component props**
   - Accept title prop (string)
   - Accept description prop (optional string)
   - Accept children prop (ReactNode)
   - Accept className prop for additional styling

3. **Implement card structure**
   - Create card container with border
   - Add header section with title and description
   - Add content area for children
   - Apply consistent padding and spacing

4. **Apply styling**
   - Use card component from UI library
   - Add subtle border and shadow
   - Ensure proper spacing between elements
   - Make responsive for mobile

5. **Export component**
   - Export as named and default export
   - Add TypeScript types
   - Document props in comments

### Card Structure

```
Settings Section Card
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Title                               │
│ Description text here               │
├─────────────────────────────────────┤
│                                     │
│  {children}                         │
│  - Form fields                      │
│  - Toggle switches                  │
│  - Other controls                   │
│                                     │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Section title |
| description | string | No | Section description |
| children | ReactNode | Yes | Section content |
| className | string | No | Additional CSS classes |

### Styling Guidelines

| Element | Style |
|---------|-------|
| Card | Border, shadow, rounded corners |
| Header | Padding, border-bottom |
| Title | Large font, semi-bold |
| Description | Smaller font, muted color |
| Content | Padding, spacing |

### Usage Example Pattern

```
<SettingsSectionCard
  title="Localization"
  description="Configure regional settings"
>
  <TimezoneSelect />
  <CurrencySelect />
  <DateFormatSelect />
</SettingsSectionCard>
```

### Expected Outcome
- Reusable settings section card component
- Consistent styling across sections
- Flexible for different content types
- Responsive design

### Verification Checklist
- [ ] SettingsSectionCard.tsx component created
- [ ] Props properly typed
- [ ] Card structure implemented
- [ ] Styling applied correctly
- [ ] Component exported

---

## Task 17: Create Localization Settings

### Overview
Create the localization settings section that groups timezone, currency, and date format selects together. This component organizes regional settings in a cohesive manner with proper labels and help text.

### Dependencies
- Task 16: Settings Section Card created
- Tasks 18-20: Select components (created next)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `LocalizationSettings.tsx`

2. **Import dependencies**
   - Import SettingsSectionCard component
   - Import form components (Label, FormField)
   - Import select components (Tasks 18-20)

3. **Define component structure**
   - Wrap in SettingsSectionCard
   - Create form field for each setting
   - Add labels and help text

4. **Implement form integration**
   - Connect to parent form context
   - Register fields with React Hook Form
   - Handle value changes

5. **Add layout and spacing**
   - Vertical stack for form fields
   - Consistent spacing between fields
   - Responsive grid on larger screens

6. **Include help text**
   - Explain each setting's purpose
   - Provide examples where helpful
   - Use muted text styling

### Section Structure

```
Localization Settings
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Localization                        │
│ Configure your regional settings    │
├─────────────────────────────────────┤
│                                     │
│  Timezone *                         │
│  [Asia/Colombo                  ▾]  │
│  Select your local timezone         │
│                                     │
│  Currency *                         │
│  [LKR - Sri Lankan Rupees       ▾]  │
│  Default currency for transactions  │
│                                     │
│  Date Format *                      │
│  [DD/MM/YYYY                    ▾]  │
│  How dates are displayed            │
│                                     │
└─────────────────────────────────────┘
```

### Form Fields

| Field | Label | Help Text |
|-------|-------|-----------|
| Timezone | Timezone | Select your local timezone |
| Currency | Currency | Default currency for transactions |
| Date Format | Date Format | How dates are displayed |

### Field Layout

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column, stacked |
| Tablet (≥768px) | Single column, stacked |
| Desktop (≥1024px) | Optional: 2-column grid |

### Expected Outcome
- Localization settings section created
- Form fields properly labeled
- Help text displayed
- Integrated with form state

### Verification Checklist
- [ ] LocalizationSettings.tsx component created
- [ ] Wrapped in SettingsSectionCard
- [ ] All three selects included
- [ ] Labels and help text added
- [ ] Form integration working

---

## Task 18: Create Timezone Select

### Overview
Create a timezone select dropdown with common timezones, defaulting to Asia/Colombo for Sri Lankan users. The component allows users to select their local timezone which affects date and time displays throughout the application.

### Dependencies
- Task 17: Localization Settings section created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `TimezoneSelect.tsx`

2. **Define timezone options**
   - Create array of timezone objects
   - Include value and display label
   - Group by region (optional)
   - Put Asia/Colombo at top or as default

3. **Import select component**
   - Use Select component from UI library
   - Import necessary types
   - Setup proper event handlers

4. **Implement component**
   - Accept value and onChange props
   - Render select with timezone options
   - Set default value to Asia/Colombo
   - Display timezone labels clearly

5. **Add search/filter (optional)**
   - Allow typing to filter timezones
   - Show matching results
   - Improve usability for long list

6. **Show timezone offset**
   - Display UTC offset in labels
   - Example: "Asia/Colombo (UTC+5:30)"
   - Help users identify correct timezone

### Timezone Options

| Region | Timezone | UTC Offset | Label |
|--------|----------|------------|-------|
| Sri Lanka | Asia/Colombo | +5:30 | Sri Lanka (Colombo) |
| India | Asia/Kolkata | +5:30 | India (Kolkata) |
| Singapore | Asia/Singapore | +8:00 | Singapore |
| Dubai | Asia/Dubai | +4:00 | UAE (Dubai) |
| London | Europe/London | +0:00 | UK (London) |
| New York | America/New_York | -5:00 | US (New York) |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | Yes | Selected timezone |
| onChange | function | Yes | Change handler |
| defaultValue | string | No | Default: Asia/Colombo |

### Select Display Format

```
Timezone Select
─────────────────────────────────────
[Asia/Colombo (UTC+5:30)        ▾]

Dropdown:
┌─────────────────────────────────┐
│ Asia/Colombo (UTC+5:30)    ✓   │
│ Asia/Kolkata (UTC+5:30)        │
│ Asia/Singapore (UTC+8:00)      │
│ Asia/Dubai (UTC+4:00)          │
│ Europe/London (UTC+0:00)       │
│ America/New_York (UTC-5:00)    │
└─────────────────────────────────┘
```

### Common Sri Lankan Timezones

| Timezone | Used By |
|----------|---------|
| Asia/Colombo | Sri Lanka (default) |
| Asia/Kolkata | India (same offset) |
| Asia/Dhaka | Bangladesh |

### Expected Outcome
- Timezone select component created
- Default value set to Asia/Colombo
- Options include common timezones
- UTC offset displayed in labels

### Verification Checklist
- [ ] TimezoneSelect.tsx component created
- [ ] Timezone options defined
- [ ] Default value is Asia/Colombo
- [ ] UTC offsets displayed
- [ ] Change handler working

---

## Task 19: Create Currency Select

### Overview
Create a currency select dropdown with support for Sri Lankan Rupees (LKR) as the default, along with other common currencies. The component allows users to set their preferred currency for display and transactions.

### Dependencies
- Task 17: Localization Settings section created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `CurrencySelect.tsx`

2. **Define currency options**
   - Create array of currency objects
   - Include code, symbol, and name
   - Put LKR at top or as default
   - Include common international currencies

3. **Import select component**
   - Use Select component from UI library
   - Setup proper props and handlers

4. **Implement component**
   - Accept value and onChange props
   - Render select with currency options
   - Set default value to LKR
   - Display currency with symbol and name

5. **Format currency display**
   - Show: "LKR - Sri Lankan Rupees (₨)"
   - Include currency code, name, and symbol
   - Make easy to identify

6. **Add currency symbol display**
   - Show symbol prominently
   - Display in option labels
   - Help visual identification

### Currency Options

| Code | Symbol | Name | Default |
|------|--------|------|---------|
| LKR | ₨ | Sri Lankan Rupees | Yes |
| USD | $ | US Dollar | No |
| EUR | € | Euro | No |
| GBP | £ | British Pound | No |
| INR | ₹ | Indian Rupee | No |
| SGD | S$ | Singapore Dollar | No |
| AED | د.إ | UAE Dirham | No |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | Yes | Selected currency code |
| onChange | function | Yes | Change handler |
| defaultValue | string | No | Default: LKR |

### Select Display Format

```
Currency Select
─────────────────────────────────────
[LKR - Sri Lankan Rupees (₨)    ▾]

Dropdown:
┌─────────────────────────────────┐
│ LKR - Sri Lankan Rupees (₨) ✓  │
│ USD - US Dollar ($)            │
│ EUR - Euro (€)                 │
│ GBP - British Pound (£)        │
│ INR - Indian Rupee (₹)         │
│ SGD - Singapore Dollar (S$)    │
│ AED - UAE Dirham (د.إ)         │
└─────────────────────────────────┘
```

### Currency Display Components

| Component | Display |
|-----------|---------|
| Code | LKR |
| Name | Sri Lankan Rupees |
| Symbol | ₨ |
| Full | LKR - Sri Lankan Rupees (₨) |

### Expected Outcome
- Currency select component created
- Default value set to LKR
- Options include common currencies
- Currency symbols displayed

### Verification Checklist
- [ ] CurrencySelect.tsx component created
- [ ] Currency options defined with symbols
- [ ] Default value is LKR
- [ ] Display format includes code, name, symbol
- [ ] Change handler working

---

## Task 20: Create Date Format Select

### Overview
Create a date format select dropdown that allows users to choose how dates are displayed throughout the application. Common formats include DD/MM/YYYY (default for Sri Lanka), MM/DD/YYYY, and YYYY-MM-DD.

### Dependencies
- Task 17: Localization Settings section created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `DateFormatSelect.tsx`

2. **Define date format options**
   - Create array of format objects
   - Include format string and example
   - Set DD/MM/YYYY as default
   - Include common international formats

3. **Import select component**
   - Use Select component from UI library
   - Setup proper props and handlers

4. **Implement component**
   - Accept value and onChange props
   - Render select with format options
   - Set default to DD/MM/YYYY
   - Show examples with current date

5. **Display format examples**
   - Show format with example date
   - Example: "DD/MM/YYYY (25/01/2026)"
   - Help users visualize output
   - Use consistent example date

6. **Handle format string**
   - Store format as string (DD/MM/YYYY)
   - Use for date formatting throughout app
   - Support common format tokens

### Date Format Options

| Format | Example | Region | Default |
|--------|---------|--------|---------|
| DD/MM/YYYY | 25/01/2026 | Sri Lanka, UK, Europe | Yes |
| MM/DD/YYYY | 01/25/2026 | United States | No |
| YYYY-MM-DD | 2026-01-25 | ISO 8601, Technical | No |
| DD.MM.YYYY | 25.01.2026 | Germany, Russia | No |
| DD-MM-YYYY | 25-01-2026 | Alternative | No |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | Yes | Selected format |
| onChange | function | Yes | Change handler |
| defaultValue | string | No | Default: DD/MM/YYYY |

### Select Display Format

```
Date Format Select
─────────────────────────────────────
[DD/MM/YYYY (25/01/2026)        ▾]

Dropdown:
┌─────────────────────────────────┐
│ DD/MM/YYYY (25/01/2026)    ✓   │
│ MM/DD/YYYY (01/25/2026)        │
│ YYYY-MM-DD (2026-01-25)        │
│ DD.MM.YYYY (25.01.2026)        │
│ DD-MM-YYYY (25-01-2026)        │
└─────────────────────────────────┘
```

### Format String Tokens

| Token | Meaning |
|-------|---------|
| DD | Day (01-31) |
| MM | Month (01-12) |
| YYYY | Year (4 digits) |
| / | Separator (slash) |
| - | Separator (dash) |
| . | Separator (dot) |

### Expected Outcome
- Date format select component created
- Default value set to DD/MM/YYYY
- Options include common formats
- Examples displayed with each format

### Verification Checklist
- [ ] DateFormatSelect.tsx component created
- [ ] Format options defined with examples
- [ ] Default value is DD/MM/YYYY
- [ ] Display includes format and example
- [ ] Change handler working

---

## Task 21: Create Notification Settings

### Overview
Create the notification settings section that allows users to configure their notification preferences. Users can enable or disable email notifications, push notifications, and specific alert types such as order alerts, low stock alerts, and daily reports.

### Dependencies
- Task 16: Settings Section Card created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/General/`
   - Create file `NotificationSettings.tsx`

2. **Import dependencies**
   - Import SettingsSectionCard component
   - Import Switch/Toggle component
   - Import form components

3. **Define notification options**
   - Email notifications toggle
   - Push notifications toggle
   - Order alerts toggle
   - Low stock alerts toggle
   - Daily reports toggle
   - Marketing emails toggle (optional)

4. **Implement component structure**
   - Wrap in SettingsSectionCard
   - Create list of notification settings
   - Each setting has label, description, toggle

5. **Handle toggle states**
   - Connect to form state
   - Update on toggle change
   - Persist to API on save

6. **Add descriptions**
   - Explain what each notification does
   - Help users make informed decisions
   - Use clear, concise language

### Section Structure

```
Notification Settings
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Notifications                       │
│ Manage your notification preferences│
├─────────────────────────────────────┤
│                                     │
│  Email Notifications          [✓]  │
│  Receive email updates              │
│                                     │
│  Order Alerts                 [✓]  │
│  Get notified about new orders      │
│                                     │
│  Low Stock Alerts             [✓]  │
│  Alert when inventory is low        │
│                                     │
│  Daily Reports                [ ]  │
│  Receive daily summary reports      │
│                                     │
│  Push Notifications           [✓]  │
│  Browser and mobile push alerts     │
│                                     │
└─────────────────────────────────────┘
```

### Notification Options

| Setting | Label | Description | Default |
|---------|-------|-------------|---------|
| email | Email Notifications | Receive email updates | On |
| orderAlerts | Order Alerts | Get notified about new orders | On |
| lowStockAlerts | Low Stock Alerts | Alert when inventory is low | On |
| dailyReports | Daily Reports | Receive daily summary reports | Off |
| push | Push Notifications | Browser and mobile push alerts | On |

### Toggle Layout

| Element | Style |
|---------|-------|
| Container | Flex, space between |
| Left Side | Label and description |
| Right Side | Toggle switch |
| Label | Semi-bold, larger |
| Description | Smaller, muted |

### Form Integration

```typescript
interface NotificationSettings {
  email: boolean;
  orderAlerts: boolean;
  lowStockAlerts: boolean;
  dailyReports: boolean;
  push: boolean;
}
```

### Expected Outcome
- Notification settings section created
- Toggle switches for each option
- Clear labels and descriptions
- Form state integration working

### Verification Checklist
- [ ] NotificationSettings.tsx component created
- [ ] Wrapped in SettingsSectionCard
- [ ] All notification toggles included
- [ ] Labels and descriptions added
- [ ] Form integration working

---

## Task 22: Create Company Settings Page

### Overview
Create the company settings page component that allows administrators to configure company profile information including company name, logo, business address, tax information, and contact details. This page is used to set up the business identity in the system.

### Dependencies
- Group A: Company route created
- Tasks 23-26: Company form components

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create directory if needed
   - Create file `CompanySettings.tsx`

2. **Import dependencies**
   - Import form components
   - Import company form schema (Task 23)
   - Import child components (Tasks 24-26, 27-30)

3. **Implement form structure**
   - Use React Hook Form
   - Apply Zod schema validation
   - Organize form sections

4. **Create sections**
   - Company Information (name, logo)
   - Business Address
   - Tax Information
   - Contact Details

5. **Add form submission**
   - Create submit handler
   - Show loading state
   - Display success/error messages
   - Update company data via API

6. **Include save button**
   - Add at bottom of form
   - Show loading state during save
   - Disable when no changes

### Page Structure

```
Company Settings Page
─────────────────────────────────────
┌─────────────────────────────────────┐
│ Company Profile                     │
│ Manage your company information     │
├─────────────────────────────────────┤
│                                     │
│  Company Information                │
│  Name: [________________]           │
│  Logo: [Upload] [Preview]           │
│                                     │
│  Business Address                   │
│  Street: [__________________]       │
│  City: [___________]                │
│  Province: [_________]              │
│  Postal Code: [_______]             │
│  Country: [Sri Lanka]               │
│                                     │
│  Tax Information                    │
│  TIN: [______________]              │
│  VAT Number: [______________]       │
│  Tax Type: [Registered      ▾]     │
│                                     │
│  Contact Details                    │
│  Phone: [+94 __________]            │
│  Email: [______________]            │
│  Website: [______________]          │
│                                     │
│  [Save Changes]                     │
│                                     │
└─────────────────────────────────────┘
```

### Form Sections

| Section | Components | Purpose |
|---------|-----------|---------|
| Company Information | Name Input, Logo Upload | Basic company details |
| Business Address | Address Form | Physical location |
| Tax Information | TIN, VAT, Tax Type | Tax registration |
| Contact Details | Phone, Email, Website | Contact information |

### Expected Outcome
- Company settings page component created
- Form sections organized
- Validation implemented
- Save functionality working

### Verification Checklist
- [ ] CompanySettings.tsx component created
- [ ] Form structure implemented
- [ ] All sections included
- [ ] Form submission working
- [ ] Validation applied

---

## Task 23: Create Company Form Schema

### Overview
Create the Zod validation schema for the company settings form. This schema defines the structure and validation rules for company data including name, address, tax information, and contact details.

### Dependencies
- Task 22: Company Settings Page created

### Instructions

1. **Create schema file**
   - Navigate to `frontend/lib/validations/`
   - Create file `company.ts`

2. **Import Zod**
   - Import z from zod library
   - Import type utilities if needed

3. **Define address schema**
   - Create nested schema for address
   - Include street, city, province, postal code
   - Add validation rules for each field

4. **Define main company schema**
   - Company name (required, 2-200 chars)
   - Logo (optional, file validation)
   - Address (required, use address schema)
   - TIN (optional, format validation)
   - VAT Number (optional)
   - Phone (required, Sri Lankan format)
   - Email (required, valid email)
   - Website (optional, valid URL)

5. **Export schema and type**
   - Export schema for form validation
   - Export TypeScript type for typing

6. **Add custom error messages**
   - Provide clear error messages
   - Make messages user-friendly
   - Include format examples where helpful

### Schema Structure

```typescript
const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().default("Sri Lanka"),
});

const companySchema = z.object({
  name: z.string().min(2).max(200),
  logo: z.string().optional(),
  address: addressSchema,
  tin: z.string().optional(),
  vatNumber: z.string().optional(),
  phone: z.string().regex(/^\+94\d{9}$/),
  email: z.string().email(),
  website: z.string().url().optional(),
});
```

### Field Validations

| Field | Type | Validation Rules |
|-------|------|-----------------|
| name | string | Required, 2-200 characters |
| logo | string | Optional, URL or file path |
| address.street | string | Required, min 1 character |
| address.city | string | Required, min 1 character |
| address.province | string | Required, min 1 character |
| address.postalCode | string | Required, min 1 character |
| address.country | string | Default: "Sri Lanka" |
| tin | string | Optional, alphanumeric |
| vatNumber | string | Optional, alphanumeric |
| phone | string | Required, Sri Lankan format (+94) |
| email | string | Required, valid email format |
| website | string | Optional, valid URL |

### Phone Number Format

| Format | Pattern | Example |
|--------|---------|---------|
| Sri Lankan | +94XXXXXXXXX | +94771234567 |
| Digits | 9 digits after +94 | 771234567 |

### Error Messages

| Field | Error Message |
|-------|--------------|
| name | "Company name must be 2-200 characters" |
| phone | "Please enter a valid Sri Lankan phone number (+94XXXXXXXXX)" |
| email | "Please enter a valid email address" |
| website | "Please enter a valid URL" |

### Expected Outcome
- Company form schema created with Zod
- All fields properly validated
- Error messages clear and helpful
- TypeScript types exported

### Verification Checklist
- [ ] company.ts schema file created
- [ ] Address schema defined
- [ ] Company schema defined
- [ ] Validation rules applied
- [ ] Types exported

---

## Task 24: Create Company Name Input

### Overview
Create the company name input field component with validation. This is a simple text input that allows administrators to enter or update the company name, which appears throughout the application.

### Dependencies
- Task 23: Company Form Schema created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `CompanyNameInput.tsx`

2. **Import dependencies**
   - Import Input component from UI library
   - Import FormField, FormLabel, FormMessage
   - Import form hook utilities

3. **Implement component**
   - Create form field with label
   - Add input for company name
   - Connect to form state
   - Show validation errors

4. **Add field properties**
   - Label: "Company Name"
   - Placeholder: "Enter company name"
   - Required indicator (*)
   - Help text (optional)

5. **Handle validation**
   - Display error messages from schema
   - Show error state styling
   - Validate on blur and submit

### Input Structure

```
Company Name Input
─────────────────────────────────────
Company Name *
[Enter company name                ]
Your business or trading name

(If error)
[Enter company name                ]
✗ Company name must be 2-200 characters
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Form field name |
| control | Control | Yes | React Hook Form control |

### Field Attributes

| Attribute | Value |
|-----------|-------|
| Label | Company Name |
| Placeholder | Enter company name |
| Required | Yes |
| Min Length | 2 characters |
| Max Length | 200 characters |

### Expected Outcome
- Company name input component created
- Connected to form state
- Validation working
- Error messages displayed

### Verification Checklist
- [ ] CompanyNameInput.tsx component created
- [ ] Input field rendered
- [ ] Label and placeholder added
- [ ] Validation working
- [ ] Error messages shown

---

## Task 25: Create Logo Upload

### Overview
Create the company logo upload component that allows administrators to upload a company logo image. The component supports drag-and-drop, file selection, and image preview with the ability to remove the uploaded logo.

### Dependencies
- Task 22: Company Settings Page created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `LogoUpload.tsx`

2. **Import dependencies**
   - Import file upload utilities
   - Import icon components
   - Import Button component

3. **Implement upload area**
   - Create upload zone (drag-and-drop)
   - Add file input (hidden)
   - Show upload instructions
   - Display selected file name

4. **Handle file selection**
   - Accept only image files (PNG, JPG, SVG)
   - Validate file size (max 2MB)
   - Show error if invalid file
   - Store file in form state

5. **Add upload button**
   - Trigger file input on click
   - Show loading state during upload
   - Display success message

6. **Implement drag and drop**
   - Highlight zone on drag over
   - Handle file drop event
   - Validate dropped file

### Upload Area Structure

```
Logo Upload
─────────────────────────────────────
┌─────────────────────────────────────┐
│         [Upload Icon]               │
│                                     │
│  Drop your logo here or click to   │
│  browse                             │
│                                     │
│  [Choose File]                      │
│                                     │
│  PNG, JPG, SVG up to 2MB            │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | No | Current logo URL |
| onChange | function | Yes | File change handler |
| onRemove | function | No | Remove logo handler |

### Accepted File Types

| Format | MIME Type | Extension |
|--------|-----------|-----------|
| PNG | image/png | .png |
| JPEG | image/jpeg | .jpg, .jpeg |
| SVG | image/svg+xml | .svg |

### File Validation

| Rule | Value |
|------|-------|
| Max Size | 2MB (2,097,152 bytes) |
| Formats | PNG, JPG, JPEG, SVG |
| Dimensions | Recommended: 200x200px |

### Upload States

| State | Display |
|-------|---------|
| Empty | Upload area with instructions |
| Dragging | Highlighted border |
| Selected | File name shown |
| Uploading | Progress indicator |
| Uploaded | Preview shown (Task 26) |
| Error | Error message |

### Expected Outcome
- Logo upload component created
- File selection working
- Drag-and-drop functional
- File validation applied

### Verification Checklist
- [ ] LogoUpload.tsx component created
- [ ] Upload area rendered
- [ ] File selection working
- [ ] Drag-and-drop implemented
- [ ] File validation working

---

## Task 26: Create Logo Preview

### Overview
Create the logo preview component that displays the uploaded company logo with options to view full size and remove the logo. The preview shows a thumbnail of the logo with action buttons.

### Dependencies
- Task 25: Logo Upload created

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/Company/`
   - Create file `LogoPreview.tsx`

2. **Import dependencies**
   - Import Image component (Next.js)
   - Import Button component
   - Import icon components (X, Eye)

3. **Implement preview display**
   - Show logo thumbnail (100x100px or similar)
   - Add border and shadow
   - Apply rounded corners
   - Make responsive

4. **Add action buttons**
   - View button (open in new tab or modal)
   - Remove button (delete logo)
   - Position buttons over preview

5. **Handle remove action**
   - Call onRemove callback
   - Clear logo from form state
   - Show upload area again

6. **Add hover effects**
   - Dim preview on hover
   - Show action buttons on hover
   - Add smooth transitions

### Preview Structure

```
Logo Preview
─────────────────────────────────────
┌───────────────┐
│               │
│   [LOGO IMG]  │
│               │
│  [👁] [✕]     │
└───────────────┘

On Hover:
┌───────────────┐
│    ░░░░░      │  ← Dimmed
│  [👁] [✕]     │  ← Buttons visible
│    ░░░░░      │
└───────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| src | string | Yes | Logo image URL |
| alt | string | No | Alt text (default: "Company logo") |
| onRemove | function | Yes | Remove handler |

### Preview Styling

| Element | Style |
|---------|-------|
| Container | 120x120px, border, shadow |
| Image | 100x100px, centered, rounded |
| Buttons | Overlay, centered, with icons |
| Hover | Dim background, show buttons |

### Action Buttons

| Button | Icon | Action |
|--------|------|--------|
| View | Eye | Open logo in new tab/modal |
| Remove | X | Delete logo, show upload area |

### Expected Outcome
- Logo preview component created
- Thumbnail displayed correctly
- Action buttons functional
- Hover effects working

### Verification Checklist
- [ ] LogoPreview.tsx component created
- [ ] Logo thumbnail displayed
- [ ] View button working
- [ ] Remove button working
- [ ] Hover effects applied

---

## Summary

This document covered the creation of general settings and company profile components:

**General Settings:**
1. **General Settings Page** - Main settings container
2. **Settings Section Card** - Reusable section wrapper
3. **Localization Settings** - Regional settings section
4. **Timezone Select** - Timezone selection (Asia/Colombo default)
5. **Currency Select** - Currency selection (LKR default)
6. **Date Format Select** - Date format selection (DD/MM/YYYY default)
7. **Notification Settings** - Notification preferences

**Company Settings:**
8. **Company Settings Page** - Company profile container
9. **Company Form Schema** - Zod validation schema
10. **Company Name Input** - Company name field
11. **Logo Upload** - Company logo upload
12. **Logo Preview** - Logo thumbnail with actions

### Next Steps

Continue to [02_Tasks-27-32_Preferences.md](02_Tasks-27-32_Preferences.md) to complete:
- Company Address Form
- Tax Information Section
- Contact Information Section
- Save Company Settings Action

---

**End of Document 01 of 02**
