# Tasks 35-45: Shipping Address Form & Saved Addresses

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** C - Step 2 - Shipping  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-46-52_Shipping-Methods-Verify.md](02_Tasks-46-52_Shipping-Methods-Verify.md)

---

## Document Overview

This document covers the creation of the shipping address form for Sri Lankan e-commerce, including specialized components for handling the Sri Lankan address format with provinces, districts, and cities. It also implements saved addresses functionality for logged-in users, allowing them to select from previously used addresses or add new ones. The implementation focuses on cascading dropdowns, postal code validation, and user-friendly address management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Shipping Page | Low | 30 min |
| 36 | Create Address Section | Low | 25 min |
| 37 | Create Province Dropdown | Low | 25 min |
| 38 | Create District Dropdown | Medium | 40 min |
| 39 | Create City Dropdown | Medium | 40 min |
| 40 | Create Address Line 1 | Low | 20 min |
| 41 | Create Address Line 2 | Low | 15 min |
| 42 | Create Landmark Input | Low | 20 min |
| 43 | Create Saved Addresses | Medium | 45 min |
| 44 | Create Select Saved Address | Low | 25 min |
| 45 | Create Add New Address | Low | 30 min |

---

## Task 35: Create Shipping Page

### Overview
Create the main ShippingStep page component that serves as the container for step 2 of the checkout flow. This page displays the step header, shipping address form, saved addresses list, and provides the foundation for the shipping methods section (covered in Document 02). The page manages the overall layout and state coordination between address selection and shipping method selection.

### Dependencies
- Task 02: Create Checkout Layout (from Group A)
- Task 10: Create Checkout Types (from Group A)
- Task 34: Verify Step 1 Flow (from Group B)

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/storefront/checkout/` directory
   - Create new directory named `Shipping`
   - This directory will contain all shipping step components

2. **Create ShippingStep component file**
   - Create `ShippingStep.tsx` in `Shipping/` directory
   - Set up React functional component with TypeScript
   - Import CheckoutLayout wrapper

3. **Set up page state management**
   - Import useCheckoutStore from checkout store
   - Access shipping address state
   - Access saved addresses from user data
   - Track editing mode (new address vs saved address)

4. **Define page layout structure**
   - Create main container with proper spacing
   - Add step header with step number and title
   - Create two-column layout for desktop (address left, summary right)
   - Stack single column for mobile

5. **Import required child components**
   - Import AddressSection component (Task 36)
   - Import SavedAddresses component (Task 43)
   - Import ShippingMethods component (from Document 02)
   - Import CheckoutSummary component

6. **Implement authentication check**
   - Check if user is logged in
   - Show saved addresses section only for authenticated users
   - Show guest checkout address form by default
   - Handle state transition when user logs in mid-checkout

7. **Create page header section**
   - Display "Shipping" as main heading
   - Add step indicator (Step 2 of 4)
   - Include optional back link to information step
   - Show progress bar (from CheckoutLayout)

8. **Render address selection area**
   - Show SavedAddresses component if user logged in and has saved addresses
   - Show AddressSection component for new address entry
   - Include toggle between saved and new address
   - Manage visibility based on selection mode

9. **Implement form state management**
   - Track active address (saved or new)
   - Validate address completeness before allowing proceed
   - Update checkout store with selected address
   - Handle form submission

10. **Add navigation controls**
    - Include BackButton to return to information step
    - Include ContinueButton to proceed to payment
    - Disable continue until address is selected/completed
    - Show validation messages if address incomplete

11. **Implement responsive layout**
    - Stack sections vertically on mobile
    - Use two-column layout on desktop
    - Adjust spacing for different screen sizes
    - Ensure touch-friendly controls on mobile

12. **Add accessibility features**
    - Set page title for screen readers
    - Add landmark regions (main, aside)
    - Ensure keyboard navigation between sections
    - Provide skip links if needed

### Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  CHECKOUT                                          [Step 2 of 4] │
│  ●━━━━●━━━━○━━━━○                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Back to Information                                           │
│                                                                   │
│  Shipping Address                                                │
│  ─────────────────────────────────────────────────────           │
│                                                                   │
│  ┌─────────────────────────┐  ┌────────────────────────────┐   │
│  │                         │  │                            │   │
│  │   SAVED ADDRESSES       │  │   ORDER SUMMARY            │   │
│  │   (If logged in)        │  │                            │   │
│  │                         │  │   3 items          ₨4,500  │   │
│  │   OR                    │  │   Shipping         ₨350    │   │
│  │                         │  │   ─────────────────────    │   │
│  │   ADDRESS FORM          │  │   Total            ₨4,850  │   │
│  │   (New address)         │  │                            │   │
│  │                         │  └────────────────────────────┘   │
│  └─────────────────────────┘                                    │
│                                                                   │
│  Shipping Methods                                                │
│  ─────────────────────────────────────────────────────           │
│  (Covered in Document 02)                                        │
│                                                                   │
│  [← Back]                          [Continue to Payment →]       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| selectedAddressId | string \| null | ID of selected saved address |
| isEditingNew | boolean | Whether user is entering new address |
| shippingAddress | ShippingAddress | Current address data |
| savedAddresses | ShippingAddress[] | User's saved addresses |
| isLoadingAddresses | boolean | Loading state for saved addresses |

### Authentication States

| User State | Display Behavior |
|------------|------------------|
| Not Logged In | Show address form only |
| Logged In (No Saved) | Show address form with save option |
| Logged In (Has Saved) | Show saved addresses list + "Add New" option |
| Guest Checkout | Show address form without save option |

### Validation Requirements

| Requirement | Description |
|-------------|-------------|
| Address Selected | Either saved address selected or new address completed |
| Required Fields | All required address fields filled |
| Postal Code Format | Valid 5-digit Sri Lankan postal code |
| Province/District/City | Valid cascading selection |

### Expected Outcome
- Complete shipping page with proper layout
- Conditional rendering based on authentication
- Proper state management for address selection
- Navigation controls with validation
- Responsive design for all screen sizes

### Verification Checklist
- [ ] `ShippingStep.tsx` created in Shipping directory
- [ ] Page renders within CheckoutLayout
- [ ] Authentication check implemented
- [ ] Saved addresses shown for logged-in users
- [ ] Address form displayed appropriately
- [ ] Navigation buttons functional
- [ ] Two-column layout on desktop
- [ ] Single-column layout on mobile
- [ ] Progress indicator displays step 2
- [ ] Continue button disabled until address selected
- [ ] TypeScript types used correctly

---

## Task 36: Create Address Section

### Overview
Create the AddressSection component that serves as a container for all address input fields. This component organizes the Sri Lankan address format with cascading location dropdowns (Province → District → City) and standard address input fields. It manages the layout, grouping, and state coordination for all address-related inputs.

### Dependencies
- Task 35: Create Shipping Page
- Task 10: Create Checkout Types

### Instructions

1. **Create AddressSection component file**
   - Create `AddressSection.tsx` in `Shipping/` directory
   - Set up React functional component structure
   - Import necessary form components

2. **Define component props**
   - Create `AddressSectionProps` interface
   - Include address state object
   - Include onChange handler function
   - Include optional validation errors object
   - Include optional disabled prop

3. **Set up internal state**
   - Track current province selection
   - Track current district selection
   - Track current city selection
   - Maintain form field values

4. **Create section layout**
   - Add section title "Shipping Address"
   - Create form group container
   - Organize fields in logical order
   - Add spacing between field groups

5. **Implement location dropdowns group**
   - Add subheading "Location"
   - Include ProvinceDropdown component (Task 37)
   - Include DistrictDropdown component (Task 38)
   - Include CityDropdown component (Task 39)
   - Arrange in single row on desktop, stack on mobile

6. **Implement address lines group**
   - Add subheading "Street Address"
   - Include Address Line 1 input (Task 40)
   - Include Address Line 2 input (Task 41)
   - Stack vertically with proper spacing

7. **Implement landmark field**
   - Add LandmarkInput component (Task 42)
   - Place below address lines
   - Include helpful description text
   - Mark as optional but recommended

8. **Add postal code field**
   - Create postal code input field
   - Add label "Postal Code"
   - Implement 5-digit validation
   - Show validation error messages
   - Auto-format as user types

9. **Implement field validation**
   - Validate required fields on blur
   - Show error messages below fields
   - Highlight invalid fields with red border
   - Disable continue button if invalid

10. **Handle cascading updates**
    - Clear district when province changes
    - Clear city when district changes
    - Update parent component with changes
    - Maintain form state consistency

11. **Add save address checkbox**
    - Show "Save this address for future use" checkbox
    - Only display for logged-in users
    - Store preference in form state
    - Position below all address fields

12. **Implement responsive layout**
    - Three-column location grid on desktop
    - Two-column on tablet
    - Single column on mobile
    - Adjust spacing for each breakpoint

### Section Layout Structure

```
Shipping Address
───────────────────────────────────────────────

Location
┌──────────────┬──────────────┬──────────────┐
│ Province *   │ District *   │ City *       │
│ [Dropdown]   │ [Dropdown]   │ [Dropdown]   │
└──────────────┴──────────────┴──────────────┘

Street Address
┌───────────────────────────────────────────────┐
│ Address Line 1 *                              │
│ [House no., Street name]                      │
├───────────────────────────────────────────────┤
│ Address Line 2 (Optional)                     │
│ [Apartment, suite, building]                  │
└───────────────────────────────────────────────┘

Additional Details
┌───────────────────────────────────────────────┐
│ Landmark (Recommended)                        │
│ [Near school, opposite bank...]               │
├────────────────────────────┬──────────────────┤
│ Postal Code *              │                  │
│ [12345]                    │                  │
└────────────────────────────┴──────────────────┘

☐ Save this address for future use
```

### Field Groups Organization

| Group | Fields | Layout |
|-------|--------|--------|
| Location | Province, District, City | 3 columns (desktop) |
| Street Address | Line 1, Line 2 | Full width, stacked |
| Additional | Landmark, Postal Code | Full width + half width |
| Options | Save checkbox | Full width |

### Postal Code Validation

| Validation Rule | Description | Error Message |
|----------------|-------------|---------------|
| Required | Must not be empty | "Postal code is required" |
| Format | Exactly 5 digits | "Postal code must be 5 digits" |
| Numeric | Only numbers allowed | "Postal code must contain only numbers" |
| Valid Range | Valid Sri Lankan postal code | "Invalid postal code for Sri Lanka" |

### Sri Lankan Postal Code Format

| Region | Postal Code Range | Examples |
|--------|-------------------|----------|
| Colombo | 00100-01599 | 00100, 00300, 01000 |
| Gampaha | 11000-11830 | 11000, 11500, 11800 |
| Kandy | 20000-20850 | 20000, 20400, 20700 |
| Galle | 80000-80650 | 80000, 80200, 80500 |

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| address | ShippingAddress | Yes | Current address data |
| onChange | (field, value) => void | Yes | Field change handler |
| errors | ValidationErrors | No | Field validation errors |
| disabled | boolean | No | Disable all fields |
| showSaveOption | boolean | No | Show save address checkbox |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| selectedProvince | string | Currently selected province |
| selectedDistrict | string | Currently selected district |
| selectedCity | string | Currently selected city |
| postalCode | string | Postal code input value |
| saveAddress | boolean | Whether to save address |

### Expected Outcome
- Well-organized address form section
- Cascading location dropdowns
- Proper validation and error handling
- Responsive layout for all devices
- Save option for logged-in users

### Verification Checklist
- [ ] `AddressSection.tsx` created in Shipping directory
- [ ] Component accepts address and onChange props
- [ ] Location dropdowns render in proper order
- [ ] Address line inputs display correctly
- [ ] Postal code validation works
- [ ] Save checkbox shows for logged-in users
- [ ] Form layout responsive across devices
- [ ] Field validation displays errors
- [ ] Required fields marked with asterisk
- [ ] Component exports properly

---

## Task 37: Create Province Dropdown

### Overview
Create the ProvinceDropdown component that displays Sri Lanka's 9 provinces. This is the first level in the cascading location selection system. When a province is selected, it triggers the district dropdown to show only districts within that province. The component uses static data for province options.

### Dependencies
- Task 36: Create Address Section
- Sri Lanka geographic data

### Instructions

1. **Create component file**
   - Create `ProvinceDropdown.tsx` in `Shipping/` directory
   - Set up React functional component
   - Import Select component from UI library

2. **Define province data structure**
   - Create `provinces.ts` file in `frontend/data/srilanka/` directory
   - Define Province interface with id, name, code properties
   - Export array of all 9 provinces
   - Include Sinhala and Tamil translations if needed

3. **Define component props**
   - Create `ProvinceDropdownProps` interface
   - Include value prop (selected province)
   - Include onChange callback
   - Include optional error prop
   - Include optional disabled prop

4. **Import province data**
   - Import provinces array from data file
   - Sort alphabetically by name
   - Prepare options for select component
   - Add "Select Province" placeholder option

5. **Implement select dropdown**
   - Render Select component
   - Map provinces to option elements
   - Display province name as label
   - Use province code or id as value

6. **Handle selection change**
   - Capture onChange event
   - Extract selected province value
   - Call parent onChange callback
   - Trigger district dropdown reset

7. **Add field styling**
   - Apply consistent form field styles
   - Add required field indicator (asterisk)
   - Style error state with red border
   - Add focus state styling

8. **Implement error display**
   - Show error message below dropdown if provided
   - Style error text in red
   - Add error icon for visibility
   - Clear error on valid selection

9. **Add search/filter functionality**
   - Enable type-to-search in dropdown (if supported by UI library)
   - Filter provinces as user types
   - Highlight matching text
   - Improve usability for users

10. **Implement accessibility**
    - Add label element with htmlFor
    - Include aria-label or aria-labelledby
    - Mark as required with aria-required
    - Add aria-invalid when error present

### Sri Lanka Provinces Data

| ID | Province Name | Code | Districts Count |
|----|---------------|------|-----------------|
| 1 | Western | WP | 3 (Colombo, Gampaha, Kalutara) |
| 2 | Central | CP | 3 (Kandy, Matale, Nuwara Eliya) |
| 3 | Southern | SP | 3 (Galle, Matara, Hambantota) |
| 4 | Northern | NP | 5 (Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya) |
| 5 | Eastern | EP | 3 (Ampara, Batticaloa, Trincomalee) |
| 6 | North Western | NWP | 2 (Kurunegala, Puttalam) |
| 7 | North Central | NCP | 2 (Anuradhapura, Polonnaruwa) |
| 8 | Uva | UP | 2 (Badulla, Monaragala) |
| 9 | Sabaragamuwa | SGP | 2 (Ratnapura, Kegalle) |

### Dropdown Component Structure

```
┌─────────────────────────────────────────┐
│ Province *                              │
│ ┌─────────────────────────────────────┐ │
│ │ Select Province              ▼     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

When opened:
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Search...                          │ │
│ ├─────────────────────────────────────┤ │
│ │ Central                            │ │
│ │ Eastern                            │ │
│ │ North Central                      │ │
│ │ North Western                      │ │
│ │ Northern                           │ │
│ │ Sabaragamuwa                       │ │
│ │ Southern                           │ │
│ │ Uva                                │ │
│ │ Western                            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Selected province code |
| onChange | (value: string) => void | Yes | - | Selection change handler |
| error | string | No | - | Validation error message |
| disabled | boolean | No | false | Disable dropdown |
| required | boolean | No | true | Mark as required field |

### Province Data Structure

```
interface Province {
  id: string;
  name: string;
  code: string;
  nameSi?: string;  // Sinhala name
  nameTa?: string;  // Tamil name
}

const provinces: Province[] = [
  { id: "1", name: "Western", code: "WP" },
  { id: "2", name: "Central", code: "CP" },
  // ... etc
];
```

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Required | Must select a province | "Province is required" |
| Valid Option | Must be one of the 9 provinces | "Invalid province selected" |

### Expected Outcome
- Functional province dropdown with 9 options
- Proper styling and error states
- Selection triggers district dropdown update
- Accessible and keyboard-friendly
- Search/filter functionality

### Verification Checklist
- [ ] `ProvinceDropdown.tsx` created
- [ ] `provinces.ts` data file created with all 9 provinces
- [ ] Dropdown renders all province options
- [ ] Selection updates parent component state
- [ ] Required field indicator displayed
- [ ] Error state styling applied when error present
- [ ] Label properly associated with dropdown
- [ ] Accessible keyboard navigation
- [ ] Search/filter works (if implemented)
- [ ] Component exports properly

---

## Task 38: Create District Dropdown

### Overview
Create the DistrictDropdown component that displays Sri Lanka's 25 districts, filtered based on the selected province. This is the second level in the cascading location system. The dropdown dynamically updates its options when the province selection changes, showing only districts that belong to the selected province.

### Dependencies
- Task 37: Create Province Dropdown
- Task 36: Create Address Section

### Instructions

1. **Create component file**
   - Create `DistrictDropdown.tsx` in `Shipping/` directory
   - Set up React functional component with TypeScript
   - Import Select component

2. **Create district data structure**
   - Create `districts.ts` file in `frontend/data/srilanka/` directory
   - Define District interface with id, name, code, provinceId properties
   - Export array of all 25 districts
   - Link each district to parent province

3. **Define component props**
   - Create `DistrictDropdownProps` interface
   - Include value prop (selected district)
   - Include provinceValue prop (for filtering)
   - Include onChange callback
   - Include optional error and disabled props

4. **Implement filtering logic**
   - Filter districts based on selected province
   - Use useMemo to optimize filtering
   - Return empty array if no province selected
   - Update filtered list when province changes

5. **Handle province dependency**
   - Disable dropdown if no province selected
   - Show "Select province first" message when disabled
   - Clear district selection when province changes
   - Update options list dynamically

6. **Implement select dropdown**
   - Render Select component with filtered districts
   - Map filtered districts to option elements
   - Display district name as label
   - Use district code or id as value

7. **Handle selection change**
   - Capture onChange event
   - Extract selected district value
   - Call parent onChange callback
   - Trigger city dropdown reset

8. **Add placeholder handling**
   - Show appropriate placeholder based on state
   - "Select province first" when province not selected
   - "Select District" when province selected
   - Clear placeholder after selection

9. **Implement error and validation**
   - Display validation errors below dropdown
   - Apply error styling (red border)
   - Validate district belongs to selected province
   - Mark as required field

10. **Add accessibility features**
    - Include proper labels
    - Add aria-disabled when province not selected
    - Include aria-describedby for helper text
    - Ensure keyboard navigation

### Sri Lanka Districts by Province

| Province | Districts |
|----------|-----------|
| Western (3) | Colombo, Gampaha, Kalutara |
| Central (3) | Kandy, Matale, Nuwara Eliya |
| Southern (3) | Galle, Matara, Hambantota |
| Northern (5) | Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya |
| Eastern (3) | Ampara, Batticaloa, Trincomalee |
| North Western (2) | Kurunegala, Puttalam |
| North Central (2) | Anuradhapura, Polonnaruwa |
| Uva (2) | Badulla, Monaragala |
| Sabaragamuwa (2) | Ratnapura, Kegalle |

### Dropdown States Visual

```
State 1: No Province Selected
┌─────────────────────────────────────────┐
│ District *                              │
│ ┌─────────────────────────────────────┐ │
│ │ Select province first        ▼     │ │ [DISABLED]
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

State 2: Province Selected (e.g., Western)
┌─────────────────────────────────────────┐
│ District *                              │
│ ┌─────────────────────────────────────┐ │
│ │ Select District              ▼     │ │ [ENABLED]
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

State 3: Opened (Western Province)
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ Colombo                            │ │
│ │ Gampaha                            │ │
│ │ Kalutara                           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Selected district code |
| provinceValue | string | Yes | - | Selected province (for filtering) |
| onChange | (value: string) => void | Yes | - | Selection change handler |
| error | string | No | - | Validation error message |
| disabled | boolean | No | false | Disable dropdown |

### District Data Structure

```
interface District {
  id: string;
  name: string;
  code: string;
  provinceId: string;  // Links to province
  nameSi?: string;
  nameTa?: string;
}

const districts: District[] = [
  { id: "1", name: "Colombo", code: "CO", provinceId: "1" },
  { id: "2", name: "Gampaha", code: "GA", provinceId: "1" },
  { id: "3", name: "Kalutara", code: "KA", provinceId: "1" },
  // ... etc
];
```

### Filtering Logic

```
Filter Districts by Province
─────────────────────────────

Input: selectedProvince = "1" (Western)

Step 1: Filter districts array
  districts.filter(d => d.provinceId === selectedProvince)

Step 2: Result
  [
    { name: "Colombo", provinceId: "1" },
    { name: "Gampaha", provinceId: "1" },
    { name: "Kalutara", provinceId: "1" }
  ]

Step 3: Sort alphabetically
  result.sort((a, b) => a.name.localeCompare(b.name))
```

### Cascading Reset Logic

| Event | Action |
|-------|--------|
| Province Changes | Clear district value, clear city value, update district options |
| District Selected | Clear city value, trigger city options update |
| District Changes | Clear city value, update city options |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Required | Must select a district | "District is required" |
| Valid Option | Must belong to selected province | "Invalid district for selected province" |
| Province Required | Province must be selected first | "Please select province first" |

### Expected Outcome
- Dynamic district dropdown filtered by province
- Proper cascading behavior with automatic reset
- Clear user feedback when province not selected
- Accessible and keyboard-friendly

### Verification Checklist
- [ ] `DistrictDropdown.tsx` created
- [ ] `districts.ts` data file created with all 25 districts
- [ ] Dropdown disabled when no province selected
- [ ] Districts filtered correctly by province
- [ ] Selection clears city dropdown
- [ ] Province change clears district selection
- [ ] Error states display correctly
- [ ] Accessibility features implemented
- [ ] Search/filter works within filtered options
- [ ] Component exports properly

---

## Task 39: Create City Dropdown

### Overview
Create the CityDropdown component that displays cities/towns within the selected district. This is the third and final level in the cascading location system. The dropdown shows only cities that belong to the selected district. Given the large number of cities in Sri Lanka, this component may load data dynamically from an API or use a comprehensive static data file.

### Dependencies
- Task 38: Create District Dropdown
- Task 36: Create Address Section

### Instructions

1. **Create component file**
   - Create `CityDropdown.tsx` in `Shipping/` directory
   - Set up React functional component with TypeScript
   - Import Select component and loading indicator

2. **Create or configure city data**
   - Option A: Create `cities.ts` file with static city data
   - Option B: Configure API endpoint for fetching cities by district
   - Define City interface with id, name, districtId, postalCode properties
   - Consider data volume and loading strategy

3. **Define component props**
   - Create `CityDropdownProps` interface
   - Include value prop (selected city)
   - Include districtValue prop (for filtering)
   - Include onChange callback
   - Include optional error, disabled, and loading props

4. **Implement data loading strategy**
   - For static data: Import and filter cities array
   - For API data: Fetch cities when district selected
   - Show loading indicator while fetching
   - Handle loading errors gracefully

5. **Implement filtering logic**
   - Filter cities based on selected district
   - Use useMemo for static data optimization
   - Handle empty results appropriately
   - Sort cities alphabetically

6. **Handle district dependency**
   - Disable dropdown if no district selected
   - Show "Select district first" when disabled
   - Clear city selection when district changes
   - Update options when district changes

7. **Implement select dropdown**
   - Render Select component with filtered cities
   - Map cities to option elements
   - Display city name as label
   - Include postal code in option text if helpful

8. **Add search functionality**
   - Enable type-to-search for large city lists
   - Implement fuzzy search or startsWith filter
   - Highlight matching text
   - Improve user experience for finding cities

9. **Handle selection change**
   - Capture onChange event
   - Extract selected city value
   - Optionally auto-populate postal code
   - Call parent onChange callback

10. **Implement virtual scrolling**
    - For large city lists (>100 items)
    - Implement virtual scrolling or pagination
    - Optimize rendering performance
    - Maintain smooth user experience

11. **Add error handling**
    - Display validation errors
    - Handle API fetch errors
    - Show fallback UI if data unavailable
    - Provide retry mechanism if needed

12. **Implement accessibility**
    - Add proper labels and descriptions
    - Support keyboard navigation
    - Add aria-busy during loading
    - Include screen reader announcements

### Major Cities by District (Examples)

| District | Major Cities | Postal Code Range |
|----------|--------------|-------------------|
| Colombo | Colombo 01-15, Dehiwala, Nugegoda, Kotte, Maharagama | 00100-01599 |
| Gampaha | Gampaha, Negombo, Ja-Ela, Wattala, Kelaniya | 11000-11830 |
| Kandy | Kandy, Peradeniya, Gampola, Katugastota | 20000-20850 |
| Galle | Galle, Hikkaduwa, Ambalangoda, Bentota | 80000-80650 |
| Jaffna | Jaffna, Chavakachcheri, Point Pedro | 40000-40530 |

### Dropdown States Visual

```
State 1: No District Selected
┌─────────────────────────────────────────┐
│ City *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Select district first        ▼     │ │ [DISABLED]
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

State 2: Loading Cities
┌─────────────────────────────────────────┐
│ City *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Loading cities...       ⟳          │ │ [LOADING]
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

State 3: District Selected (e.g., Colombo)
┌─────────────────────────────────────────┐
│ City *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Select City                  ▼     │ │ [ENABLED]
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

State 4: Opened with Search
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Search cities...                 │ │
│ ├─────────────────────────────────────┤ │
│ │ Colombo 01 - Fort                  │ │
│ │ Colombo 02 - Slave Island          │ │
│ │ Colombo 03 - Kollupitiya           │ │
│ │ Colombo 04 - Bambalapitiya         │ │
│ │ Colombo 05 - Narahenpita           │ │
│ │ ...                                 │ │
│ │ [Virtual scroll - 50 more]         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Selected city |
| districtValue | string | Yes | - | Selected district (for filtering) |
| onChange | (value: string) => void | Yes | - | Selection change handler |
| error | string | No | - | Validation error message |
| disabled | boolean | No | false | Disable dropdown |
| loading | boolean | No | false | Show loading state |

### City Data Structure

```
interface City {
  id: string;
  name: string;
  districtId: string;  // Links to district
  postalCode: string;  // Primary postal code
  nameSi?: string;
  nameTa?: string;
}

const cities: City[] = [
  { 
    id: "1", 
    name: "Colombo 01 - Fort", 
    districtId: "1", 
    postalCode: "00100" 
  },
  { 
    id: "2", 
    name: "Colombo 02 - Slave Island", 
    districtId: "1", 
    postalCode: "00200" 
  },
  // ... hundreds more
];
```

### Data Loading Strategy

| Strategy | Pros | Cons | Best For |
|----------|------|------|----------|
| Static File | Fast, offline, no API calls | Large bundle size | Small to medium city lists |
| API on Mount | Small bundle, up-to-date data | Requires network, slower | Large city lists |
| API on District Select | Smaller requests, faster | Multiple API calls | Very large datasets |
| Hybrid (Common + API) | Fast for common, complete for all | Complex logic | Production apps |

### Search and Filter Logic

```
City Search Implementation
──────────────────────────

User types: "colo"

Step 1: Filter cities
  cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

Step 2: Results
  - Colombo 01 - Fort
  - Colombo 02 - Slave Island
  - Colombo 03 - Kollupitiya
  ... (all Colombo areas)

Step 3: Limit results (optional)
  results.slice(0, 50)  // Show first 50 matches
```

### Auto-populate Postal Code

| City Selection | Action |
|----------------|--------|
| City Selected | Extract postal code from city data |
| Update Parent | Call onChange with city and postal code |
| Populate Field | Auto-fill postal code input field |
| User Override | Allow user to edit postal code if needed |

### Performance Optimization

| Technique | Implementation | Impact |
|-----------|----------------|--------|
| Memoization | useMemo for filtered list | Prevents re-filtering on every render |
| Debounce | Debounce search input | Reduces filter calls |
| Virtual Scroll | react-window or similar | Handles 1000+ items smoothly |
| Lazy Loading | Load cities on demand | Reduces initial load |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Required | Must select a city | "City is required" |
| Valid Option | Must belong to selected district | "Invalid city for selected district" |
| District Required | District must be selected first | "Please select district first" |

### Expected Outcome
- Functional city dropdown with district filtering
- Search functionality for easy selection
- Performance optimized for large lists
- Auto-populate postal code when city selected
- Accessible and keyboard-friendly

### Verification Checklist
- [ ] `CityDropdown.tsx` created
- [ ] City data source configured (static or API)
- [ ] Dropdown disabled when no district selected
- [ ] Cities filtered correctly by district
- [ ] Search/filter functionality works
- [ ] Loading state displays during data fetch
- [ ] Postal code auto-populates on selection
- [ ] Virtual scrolling implemented (if needed)
- [ ] Error handling for data loading
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 40: Create Address Line 1

### Overview
Create the address line 1 input field for the street address. This is a required field where users enter their house number, building name, and street name. This field is the primary address identifier and must be validated for completeness.

### Dependencies
- Task 36: Create Address Section

### Instructions

1. **Create component file** (or add to AddressSection)
   - This can be a simple Input component usage
   - Or create `AddressLineInputs.tsx` for both line 1 and 2
   - Use standard text input component

2. **Define field properties**
   - Label: "Address Line 1" or "Street Address"
   - Placeholder: "House no., Building name, Street name"
   - Required: Yes (mark with asterisk)
   - MaxLength: 100 characters
   - Type: text

3. **Implement input field**
   - Render TextInput component
   - Apply consistent form field styling
   - Add required field indicator
   - Connect to form state

4. **Add validation rules**
   - Required: Must not be empty
   - Minimum length: 5 characters
   - Maximum length: 100 characters
   - No special characters only (must contain alphanumeric)

5. **Handle input changes**
   - Capture onChange event
   - Trim leading/trailing spaces
   - Update parent component state
   - Trigger validation on blur

6. **Display validation errors**
   - Show error message below input
   - Apply error styling (red border)
   - Clear error on valid input
   - Validate on blur and on submit

7. **Add helper text**
   - Show example: "e.g., 123, Green Street"
   - Display character count if needed
   - Show formatting hints
   - Position below input field

8. **Implement accessibility**
   - Associate label with input
   - Add aria-required="true"
   - Include aria-invalid when error present
   - Add aria-describedby for helper text

### Input Field Visual

```
┌─────────────────────────────────────────────────────┐
│ Address Line 1 *                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │ House no., Building name, Street name           │ │
│ └─────────────────────────────────────────────────┘ │
│ e.g., 123/A, Green Villa, Galle Road                │
└─────────────────────────────────────────────────────┘

Error State:
┌─────────────────────────────────────────────────────┐
│ Address Line 1 *                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 123                                             │ │ [RED BORDER]
│ └─────────────────────────────────────────────────┘ │
│ ⚠ Address line 1 must be at least 5 characters      │
└─────────────────────────────────────────────────────┘
```

### Field Specifications

| Property | Value |
|----------|-------|
| Label | "Address Line 1" or "Street Address" |
| Placeholder | "House no., Building name, Street name" |
| Required | Yes |
| Type | text |
| MinLength | 5 |
| MaxLength | 100 |
| AutoComplete | "address-line1" |

### Sri Lankan Address Examples

| Valid Format | Description |
|--------------|-------------|
| 123/A, Galle Road | House number with fraction, street name |
| Green Villa, Station Road | Building name, street name |
| No. 45, 3rd Lane, Colombo 03 | House number, lane, area |
| Apartment 5B, Royal Gardens, Kandy Road | Apartment, complex, street |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Required | Field must not be empty | "Street address is required" |
| Min Length | At least 5 characters | "Address must be at least 5 characters" |
| Max Length | No more than 100 characters | "Address cannot exceed 100 characters" |
| Content | Must contain alphanumeric | "Address must contain valid characters" |

### Expected Outcome
- Functional text input for address line 1
- Proper validation and error handling
- Clear placeholder and helper text
- Accessible and user-friendly

### Verification Checklist
- [ ] Address line 1 input field created
- [ ] Required field indicator displayed
- [ ] Placeholder text helpful and clear
- [ ] Validation rules implemented
- [ ] Error messages display correctly
- [ ] Character length constraints enforced
- [ ] Helper text/examples shown
- [ ] Accessibility attributes added
- [ ] Integrates with parent form state

---

## Task 41: Create Address Line 2

### Overview
Create the address line 2 input field for optional additional address information. This field allows users to enter apartment numbers, suite numbers, floor numbers, or additional location details. This field is optional but can be helpful for precise delivery.

### Dependencies
- Task 36: Create Address Section
- Task 40: Create Address Line 1

### Instructions

1. **Create input field** (can be in same component as Line 1)
   - Use same component structure as Address Line 1
   - Render below Address Line 1
   - Mark as optional (no asterisk)

2. **Define field properties**
   - Label: "Address Line 2 (Optional)"
   - Placeholder: "Apartment, suite, floor, building"
   - Required: No
   - MaxLength: 100 characters
   - Type: text

3. **Implement input field**
   - Render TextInput component
   - Apply consistent styling with Line 1
   - No required indicator
   - Connect to form state

4. **Add validation rules** (minimal for optional field)
   - Maximum length: 100 characters
   - Allow empty value
   - No special validation needed
   - Optional trim on submit

5. **Handle input changes**
   - Capture onChange event
   - Update parent component state
   - No validation on blur (optional field)
   - Trim spaces on form submit

6. **Add helper text**
   - Show example: "e.g., Apt 5B, 2nd Floor"
   - Clarify purpose: "Apartment, suite, or floor number"
   - Keep subtle since optional
   - Position below input

7. **Implement accessibility**
   - Associate label with input
   - Do NOT include aria-required (false)
   - Add aria-describedby for helper text
   - Ensure keyboard accessible

### Input Field Visual

```
┌─────────────────────────────────────────────────────┐
│ Address Line 2 (Optional)                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Apartment, suite, floor, building               │ │
│ └─────────────────────────────────────────────────┘ │
│ e.g., Apartment 5B, 3rd Floor                       │
└─────────────────────────────────────────────────────┘
```

### Field Specifications

| Property | Value |
|----------|-------|
| Label | "Address Line 2 (Optional)" |
| Placeholder | "Apartment, suite, floor, building" |
| Required | No |
| Type | text |
| MaxLength | 100 |
| AutoComplete | "address-line2" |

### Sri Lankan Address Line 2 Examples

| Valid Format | Use Case |
|--------------|----------|
| Apartment 5B | Apartment in building |
| 3rd Floor | Floor number in building |
| Block A | Section in housing complex |
| Near Main Gate | Location within compound |
| C/O Mr. Silva | Care of notation for delivery |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Max Length | No more than 100 characters | "Address line 2 cannot exceed 100 characters" |
| Optional | Can be left empty | (none) |

### Layout with Line 1

```
Street Address
┌───────────────────────────────────────────────┐
│ Address Line 1 *                              │
│ [123, Green Villa, Galle Road]                │
├───────────────────────────────────────────────┤
│ Address Line 2 (Optional)                     │
│ [Apartment 5B, 3rd Floor]                     │
└───────────────────────────────────────────────┘
```

### Expected Outcome
- Functional optional input for address line 2
- Clear indication that field is optional
- Helpful placeholder and examples
- Consistent styling with line 1

### Verification Checklist
- [ ] Address line 2 input field created
- [ ] Marked as optional (no asterisk)
- [ ] Placeholder text helpful
- [ ] Maximum length validation works
- [ ] No error for empty value
- [ ] Helper text displayed
- [ ] Accessibility attributes correct
- [ ] Integrates with parent form state

---

## Task 42: Create Landmark Input

### Overview
Create the landmark input field that allows users to provide a nearby landmark or reference point for delivery. This field is highly recommended for Sri Lankan addresses as it significantly helps delivery personnel locate the address, especially in areas with unclear or inconsistent street numbering. While technically optional, it should be encouraged.

### Dependencies
- Task 36: Create Address Section

### Instructions

1. **Create component file** (or add to AddressSection)
   - Can be part of AddressLineInputs component
   - Or standalone LandmarkInput component
   - Use standard text input

2. **Define field properties**
   - Label: "Landmark" or "Nearby Landmark"
   - Sublabel: "(Recommended for easy delivery)"
   - Placeholder: "Near school, opposite bank, next to temple..."
   - Required: No, but recommended
   - MaxLength: 150 characters

3. **Implement input field**
   - Render TextInput component
   - Add info icon with tooltip explaining importance
   - Apply consistent styling
   - Connect to form state

4. **Add helper/description text**
   - Explain purpose: "Helps delivery person find your address easily"
   - Show examples: "Near St. Mary's School, Opposite Commercial Bank"
   - Make it prominent to encourage usage
   - Use friendly, helpful tone

5. **Implement validation** (minimal)
   - Maximum length: 150 characters
   - Allow empty value
   - Trim whitespace
   - Optional: Suggest adding if empty on submit

6. **Add encouragement UI**
   - Show small badge: "Recommended"
   - Use friendly color (blue/orange, not red)
   - Add icon (map pin or location)
   - Subtle highlighting without being intrusive

7. **Handle input changes**
   - Capture onChange event
   - Update parent component state
   - No strict validation
   - Update form completeness indicator

8. **Implement accessibility**
   - Associate label with input
   - Add aria-describedby for helper text
   - Include role="note" for description
   - Ensure keyboard accessible

### Input Field Visual

```
┌─────────────────────────────────────────────────────┐
│ Landmark (Recommended for delivery) ℹ               │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Near school, opposite bank, next to temple...   │ │
│ └─────────────────────────────────────────────────┘ │
│ 💡 Helps the delivery person locate your address    │
│ e.g., "Next to Royal College" or "Opposite HNB"     │
└─────────────────────────────────────────────────────┘

With Recommended Badge:
┌─────────────────────────────────────────────────────┐
│ Landmark [🔵 Recommended]                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Opposite Commercial Bank, Galle Road            │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Field Specifications

| Property | Value |
|----------|-------|
| Label | "Landmark" or "Nearby Landmark" |
| Sublabel | "(Recommended for easy delivery)" |
| Placeholder | "Near school, opposite bank, next to temple..." |
| Required | No (but encouraged) |
| MaxLength | 150 |
| Type | text |

### Common Sri Lankan Landmarks

| Category | Examples |
|----------|----------|
| Religious | Near Buddhist Temple, Opposite St. Mary's Church, Next to Kovil |
| Educational | Next to Royal College, Near University of Colombo |
| Commercial | Opposite Commercial Bank, Near Keells Supermarket |
| Government | Next to Post Office, Near Police Station |
| Infrastructure | Close to Galle Road Junction, Near Baseline Road Junction |

### Landmark Examples

| Good Landmark | Why It's Good |
|---------------|---------------|
| "Opposite Commercial Bank, Galle Road" | Specific, well-known, on main road |
| "Next to Royal College main gate" | Clear reference, major institution |
| "Near Majestic City shopping complex" | Large, well-known building |
| "50m after Kirulapone Junction" | Specific distance and junction |

| Poor Landmark | Why It's Poor |
|---------------|---------------|
| "Near a shop" | Too vague, not specific |
| "Close to home" | Not helpful |
| "On the left" | No clear reference point |

### Encouragement Strategy

| Element | Purpose | Implementation |
|---------|---------|----------------|
| Badge | Visual indicator | "Recommended" badge in blue |
| Icon | Attention grabber | Map pin or location icon |
| Helper Text | Education | Explain why it's useful |
| Examples | Guidance | Show good landmark examples |
| Tooltip | Additional info | "Landmarks help couriers find your address faster" |

### Validation Rules

| Rule | Description | Error Message |
|------|-------------|---------------|
| Max Length | No more than 150 characters | "Landmark cannot exceed 150 characters" |
| Optional | Can be left empty | (none) |

### Expected Outcome
- User-friendly landmark input field
- Clear indication that it's recommended
- Helpful examples and guidance
- Encourages users to fill it out

### Verification Checklist
- [ ] Landmark input field created
- [ ] Marked as recommended (badge or label)
- [ ] Helper text explains purpose
- [ ] Examples provided
- [ ] Info icon with tooltip
- [ ] Maximum length validation works
- [ ] Friendly, encouraging UI
- [ ] Accessibility features implemented
- [ ] Integrates with parent form state

---

## Task 43: Create Saved Addresses

### Overview
Create the SavedAddresses component that displays a list of the user's previously saved shipping addresses. This component allows logged-in users to quickly select from their saved addresses instead of re-entering address information. It shows a list of address cards with select functionality and includes an option to add a new address.

### Dependencies
- Task 35: Create Shipping Page
- Task 36: Create Address Section
- User authentication system
- Address storage/API

### Instructions

1. **Create component file**
   - Create `SavedAddresses.tsx` in `Shipping/` directory
   - Set up React functional component
   - Import address card component

2. **Define component props**
   - Create `SavedAddressesProps` interface
   - Include addresses array prop
   - Include selectedAddressId prop
   - Include onSelect callback
   - Include onAddNew callback
   - Include optional loading prop

3. **Fetch saved addresses**
   - Check user authentication status
   - Fetch addresses from API or state management
   - Handle loading state
   - Handle empty state (no saved addresses)
   - Handle fetch errors

4. **Create section header**
   - Add heading "Your Saved Addresses"
   - Include address count badge
   - Add "Add New Address" button in header
   - Style consistently with other sections

5. **Implement addresses list**
   - Map over addresses array
   - Render SavedAddressCard for each address (Task 44)
   - Apply grid or list layout
   - Handle selection state

6. **Handle empty state**
   - Show message: "No saved addresses yet"
   - Display friendly illustration or icon
   - Prominent "Add Your First Address" button
   - Provide helpful text

7. **Implement loading state**
   - Show skeleton loaders for address cards
   - Display 2-3 placeholder cards
   - Maintain layout consistency
   - Provide loading indicator

8. **Add "Add New Address" action**
   - Primary action button
   - Opens new address form
   - Collapses saved addresses list (optional)
   - Calls onAddNew callback

9. **Implement selection handling**
   - Pass selected address ID to cards
   - Highlight selected address
   - Call onSelect when address clicked
   - Update parent component state

10. **Add address management actions**
    - Edit button for each address
    - Delete button with confirmation
    - Set as default option
    - Handle action callbacks

11. **Implement responsive design**
    - Grid layout on desktop (2 columns)
    - Single column on mobile
    - Stack cards vertically
    - Adjust button sizes

12. **Add accessibility features**
    - Use semantic HTML (ul, li)
    - Add aria-label to list
    - Ensure keyboard navigation
    - Announce selection to screen readers

### Component Layout

```
┌─────────────────────────────────────────────────────┐
│ Your Saved Addresses (3)      [+ Add New Address]  │
│                                                     │
│ ┌─────────────────────┐  ┌─────────────────────┐  │
│ │ ○ Home              │  │ ○ Office            │  │
│ │                     │  │                     │  │
│ │ 123, Green Villa    │  │ 456, Business       │  │
│ │ Galle Road          │  │ Center, Union Place │  │
│ │ Colombo 03          │  │ Colombo 02          │  │
│ │ Western Province    │  │ Western Province    │  │
│ │                     │  │                     │  │
│ │ [Edit] [Delete]     │  │ [Edit] [Delete]     │  │
│ └─────────────────────┘  └─────────────────────┘  │
│                                                     │
│ ┌─────────────────────┐                            │
│ │ ● Parent's House    │ [SELECTED]                 │
│ │   (Default)         │                            │
│ │                     │                            │
│ │ 789, Lake View      │                            │
│ │ Kandy Road          │                            │
│ │ Kandy               │                            │
│ │ Central Province    │                            │
│ │                     │                            │
│ │ [Edit] [Delete]     │                            │
│ └─────────────────────┘                            │
└─────────────────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────────────────┐
│ Your Saved Addresses                                │
│                                                     │
│              📍                                      │
│                                                     │
│     No saved addresses yet                         │
│     Save addresses for faster checkout             │
│                                                     │
│     [+ Add Your First Address]                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────────────────────────────┐
│ Your Saved Addresses              [Loading...]      │
│                                                     │
│ ┌─────────────────────┐  ┌─────────────────────┐  │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │  │
│ │ ▓▓▓▓▓▓▓▓▓▓         │  │ ▓▓▓▓▓▓▓▓▓▓         │  │
│ │ ▓▓▓▓▓▓▓▓           │  │ ▓▓▓▓▓▓▓▓           │  │
│ └─────────────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| addresses | SavedAddress[] | Yes | Array of saved addresses |
| selectedAddressId | string \| null | Yes | Currently selected address ID |
| onSelect | (id: string) => void | Yes | Address selection handler |
| onAddNew | () => void | Yes | Add new address handler |
| onEdit | (id: string) => void | No | Edit address handler |
| onDelete | (id: string) => void | No | Delete address handler |
| loading | boolean | No | Loading state |

### Saved Address Data Structure

```
interface SavedAddress {
  id: string;
  label: string;            // "Home", "Office", etc.
  isDefault: boolean;
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    province: string;
    postalCode: string;
    landmark?: string;
  };
  createdAt: Date;
  lastUsed: Date;
}
```

### Address Card Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Selection | Radio button or checkmark | Visual indicator when selected |
| Label | "Home", "Office", custom | Display prominently |
| Default Badge | Shows default address | "Default" badge |
| Actions | Edit, Delete | Icon buttons or links |
| Hover State | Highlight on hover | Border or shadow effect |

### User Actions

| Action | Trigger | Behavior |
|--------|---------|----------|
| Select Address | Click on card | Select address, populate form preview |
| Add New | Click "Add New" button | Show address form, collapse saved list |
| Edit | Click Edit button | Open address in edit mode |
| Delete | Click Delete button | Show confirmation, delete on confirm |
| Set Default | Click default option | Update default address |

### Expected Outcome
- Functional saved addresses list
- Clear selection mechanism
- Add new address option
- Edit and delete capabilities
- Responsive card layout

### Verification Checklist
- [ ] `SavedAddresses.tsx` created
- [ ] Addresses fetched and displayed
- [ ] Selection functionality works
- [ ] "Add New Address" button functional
- [ ] Empty state displays correctly
- [ ] Loading state implemented
- [ ] Edit and delete actions work
- [ ] Default address indicator shown
- [ ] Grid layout responsive
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 44: Create Select Saved Address

### Overview
Create the SavedAddressCard component that displays a single saved address with selection functionality. This card is used within the SavedAddresses list and provides a clickable interface for selecting an address. It shows the address label, formatted address details, and action buttons for editing or deleting.

### Dependencies
- Task 43: Create Saved Addresses

### Instructions

1. **Create component file**
   - Create `SavedAddressCard.tsx` in `Shipping/` directory
   - Set up React functional component
   - Import icon components (MapPin, Edit, Trash)

2. **Define component props**
   - Create `SavedAddressCardProps` interface
   - Include address object prop
   - Include isSelected boolean prop
   - Include onSelect callback
   - Include optional onEdit and onDelete callbacks

3. **Create card container**
   - Use Card or BorderBox component
   - Add click handler for selection
   - Apply hover effects
   - Add selected state styling

4. **Implement selection indicator**
   - Radio button or checkmark icon
   - Position in top-left or left side
   - Show filled when selected
   - Show outline when not selected

5. **Display address label**
   - Show custom label ("Home", "Office", etc.)
   - Display prominently as card title
   - Add default badge if applicable
   - Use bold or larger font

6. **Format and display address**
   - Show address line 1
   - Show address line 2 if present
   - Show city, district, province
   - Show postal code
   - Show landmark if present
   - Format as multi-line readable text

7. **Add action buttons**
   - Edit button with pencil icon
   - Delete button with trash icon
   - Position in bottom-right or top-right
   - Stop click propagation (don't trigger select)
   - Show on hover or always visible

8. **Implement selected state styling**
   - Apply accent border color (blue/green)
   - Show filled radio button/checkmark
   - Slight background color change
   - Add glow or shadow effect

9. **Implement hover state**
   - Subtle border color change
   - Slight shadow increase
   - Show action buttons if hidden
   - Cursor pointer

10. **Add default badge**
    - Show "Default" badge if isDefault is true
    - Position next to label
    - Use subtle background color
    - Small, unobtrusive styling

11. **Implement accessibility**
    - Use button or div with role="button"
    - Add aria-checked for selection
    - Include keyboard support (Enter/Space)
    - Add focus visible styles

12. **Handle responsive design**
    - Full width on mobile
    - Fixed width or flex on desktop
    - Adjust padding for mobile
    - Stack elements if needed

### Card Component Visual

```
Default State:
┌─────────────────────────────────────────┐
│ ○ Home                      [Edit] [X]  │
│                                         │
│ 123, Green Villa                        │
│ Galle Road, Colombo 03                  │
│ Western Province                        │
│ Postal Code: 00300                      │
│ Near Royal College                      │
└─────────────────────────────────────────┘

Selected State:
┌─────────────────────────────────────────┐ [BLUE BORDER]
│ ● Home [Default]            [Edit] [X]  │
│                                         │
│ 123, Green Villa                        │
│ Galle Road, Colombo 03                  │
│ Western Province                        │
│ Postal Code: 00300                      │
│ Near Royal College                      │
└─────────────────────────────────────────┘

Mobile Layout:
┌───────────────────────┐
│ ○ Home                │
│   [Default]           │
│                       │
│ 123, Green Villa      │
│ Galle Road            │
│ Colombo 03            │
│ Western Province      │
│ 00300                 │
│                       │
│ Landmark:             │
│ Near Royal College    │
│                       │
│ [Edit]       [Delete] │
└───────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| address | SavedAddress | Yes | Address data |
| isSelected | boolean | Yes | Whether this address is selected |
| onSelect | () => void | Yes | Selection handler |
| onEdit | () => void | No | Edit button handler |
| onDelete | () => void | No | Delete button handler |
| showActions | boolean | No | Show edit/delete buttons |

### Address Display Format

| Field | Display Format | Example |
|-------|---------------|---------|
| Label | Bold, larger text | **Home** |
| Line 1 | Regular text | 123, Green Villa |
| Line 2 | Regular text, indented | Apartment 5B |
| City, Province | Combined with comma | Colombo 03, Western Province |
| Postal Code | Prefixed label | Postal Code: 00300 |
| Landmark | Prefixed, lighter | Near: Royal College |

### Card States

| State | Visual Indicators |
|-------|------------------|
| Default | Gray border, outline radio |
| Hover | Blue border, shadow increase |
| Selected | Blue border, filled radio, accent background |
| Focus | Focus ring, blue outline |

### Selection Indicator Styles

| Type | Not Selected | Selected |
|------|--------------|----------|
| Radio Button | ○ (outline circle) | ● (filled circle) |
| Checkbox | ☐ (outline square) | ☑ (checked square) |
| Checkmark | (hidden) | ✓ (green checkmark) |

### Action Buttons

| Action | Icon | Behavior | Confirmation |
|--------|------|----------|--------------|
| Edit | Pencil/Edit icon | Open edit mode | No |
| Delete | Trash icon | Delete address | Yes, show modal |

### Delete Confirmation Modal

```
┌─────────────────────────────────────────┐
│  Delete Address?                        │
│                                         │
│  Are you sure you want to delete this   │
│  address? This action cannot be undone. │
│                                         │
│  Home                                   │
│  123, Green Villa, Colombo 03           │
│                                         │
│  [Cancel]              [Delete]         │
└─────────────────────────────────────────┘
```

### Default Badge

```
Home [Default]
     ─────────
     Small badge with
     light background
```

### Expected Outcome
- Clickable address card with selection
- Clear visual states (default, hover, selected)
- Action buttons for edit and delete
- Formatted, readable address display
- Responsive design

### Verification Checklist
- [ ] `SavedAddressCard.tsx` created
- [ ] Card displays address information correctly
- [ ] Selection indicator shows correct state
- [ ] Click handler selects address
- [ ] Edit button functional (if provided)
- [ ] Delete button functional with confirmation
- [ ] Selected state styling applied
- [ ] Hover effects work
- [ ] Default badge displays if applicable
- [ ] Responsive layout on mobile
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Task 45: Create Add New Address

### Overview
Create functionality to add a new address from the saved addresses section. This includes an "Add New Address" button that toggles the address form, allows users to enter a new address, optionally set a label and default status, and save it to their account. This feature enhances the saved addresses workflow by allowing inline address creation.

### Dependencies
- Task 43: Create Saved Addresses
- Task 36: Create Address Section

### Instructions

1. **Add "Add New Address" button**
   - Add prominent button in SavedAddresses component header
   - Use primary or secondary button style
   - Include plus icon
   - Label: "+ Add New Address"

2. **Implement toggle mechanism**
   - Track state: `isAddingNew` boolean
   - Show address form when true
   - Hide saved addresses list (optional) or show below
   - Provide "Cancel" button to return to list

3. **Reuse AddressSection component**
   - Show AddressSection component when adding new
   - Clear all field values (empty form)
   - Include all address fields from Task 36
   - Add additional fields for saved address

4. **Add address label field**
   - Text input for custom label
   - Placeholder: "Label (e.g., Home, Office)"
   - Quick select buttons: [Home] [Office] [Work]
   - MaxLength: 30 characters

5. **Add "Set as default" checkbox**
   - Checkbox: "Set as default address"
   - Position below address form
   - Checked by default if user has no addresses
   - Update user's default address preference

6. **Implement form validation**
   - Validate all required address fields
   - Validate address label (required for saved addresses)
   - Show validation errors
   - Disable save button until valid

7. **Add save address action**
   - "Save Address" button
   - Send POST request to save address API
   - Include all address fields and metadata
   - Show loading state during save

8. **Handle save response**
   - On success: Add address to list, close form, show success message
   - On error: Display error message, keep form open
   - Update local state immediately for optimistic UI
   - Refetch addresses if needed

9. **Add cancel functionality**
   - "Cancel" button next to "Save"
   - Confirm if form has changes (optional)
   - Clear form fields
   - Return to saved addresses list

10. **Implement API integration**
    - Define API endpoint: POST /api/user/addresses
    - Send address data in request body
    - Handle authentication token
    - Handle network errors

11. **Add success feedback**
    - Show toast notification: "Address saved successfully"
    - Highlight newly added address
    - Auto-select new address (optional)
    - Scroll to new address in list

12. **Handle edge cases**
    - Maximum addresses limit (e.g., 10 addresses)
    - Duplicate address detection (optional)
    - Network offline handling
    - Session expiration

### Add New Address Flow

```
State 1: Saved Addresses List
┌─────────────────────────────────────────────────────┐
│ Your Saved Addresses (2)      [+ Add New Address]  │
│                                                     │
│ [Saved address cards displayed...]                 │
└─────────────────────────────────────────────────────┘
              ↓ (Click "Add New Address")
              
State 2: Add New Address Form
┌─────────────────────────────────────────────────────┐
│ ← Back to Saved Addresses                           │
│                                                     │
│ Add New Address                                     │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ Address Label *                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Home                                            │ │
│ └─────────────────────────────────────────────────┘ │
│ Quick: [Home] [Office] [Work] [Other]               │
│                                                     │
│ [AddressSection component with all fields]          │
│                                                     │
│ ☐ Set as default address                            │
│                                                     │
│ [Cancel]                          [Save Address]    │
└─────────────────────────────────────────────────────┘
              ↓ (Click "Save Address")
              
State 3: Saving... (Loading)
┌─────────────────────────────────────────────────────┐
│ [Saving address...]                                 │
│ ⟳ Saving...                                         │
└─────────────────────────────────────────────────────┘
              ↓ (Save successful)
              
State 4: Back to List with New Address
┌─────────────────────────────────────────────────────┐
│ Your Saved Addresses (3)      [+ Add New Address]  │
│                                                     │
│ ✓ Address saved successfully!                       │
│                                                     │
│ ┌─────────────────────┐                            │
│ │ ● Home [NEW]        │ [SELECTED, HIGHLIGHTED]    │
│ │ 123, Green Villa    │                            │
│ │ Colombo 03          │                            │
│ └─────────────────────┘                            │
│                                                     │
│ [Other saved address cards...]                      │
└─────────────────────────────────────────────────────┘
```

### Address Label Field

```
┌─────────────────────────────────────────────────────┐
│ Address Label *                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Home                                            │ │
│ └─────────────────────────────────────────────────┘ │
│ Quick select: [Home] [Office] [Work] [Other]       │
└─────────────────────────────────────────────────────┘
```

### Form Fields Summary

| Field | Required | Description |
|-------|----------|-------------|
| Address Label | Yes | Custom label for the address |
| Province | Yes | From cascading dropdown |
| District | Yes | From cascading dropdown |
| City | Yes | From cascading dropdown |
| Address Line 1 | Yes | Street address |
| Address Line 2 | No | Apartment, suite, etc. |
| Postal Code | Yes | 5-digit code |
| Landmark | No | Nearby landmark |
| Set as Default | No | Checkbox option |

### API Integration

| Endpoint | Method | Request Body |
|----------|--------|--------------|
| `/api/user/addresses` | POST | `{ label, address: {...}, isDefault }` |

**Request Example:**
```
POST /api/user/addresses
Content-Type: application/json
Authorization: Bearer <token>

{
  "label": "Home",
  "address": {
    "line1": "123, Green Villa",
    "line2": "Apartment 5B",
    "city": "Colombo 03",
    "district": "Colombo",
    "province": "Western",
    "postalCode": "00300",
    "landmark": "Near Royal College"
  },
  "isDefault": true
}
```

**Response Example:**
```
{
  "id": "addr_123abc",
  "label": "Home",
  "address": { ... },
  "isDefault": true,
  "createdAt": "2026-01-31T10:30:00Z"
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Label | Required, max 30 chars | "Address label is required" |
| All Address Fields | Follow Task 36-42 rules | (respective error messages) |

### Success Notification

```
┌─────────────────────────────────────────┐
│ ✓ Address saved successfully!           │
│   You can now use this address for      │
│   checkout.                             │
└─────────────────────────────────────────┘
```

### Error Handling

| Error Type | User Message | Action |
|------------|--------------|--------|
| Validation Error | "Please check the form fields" | Show field errors |
| Network Error | "Unable to save address. Please try again." | Retry button |
| Max Limit Reached | "You've reached the maximum of 10 addresses" | Remove one first |
| Session Expired | "Your session has expired. Please log in." | Redirect to login |

### Expected Outcome
- Functional "Add New Address" button and form
- Complete address entry with label and default option
- API integration to save addresses
- Success and error feedback
- Return to saved addresses list with new address

### Verification Checklist
- [ ] "Add New Address" button functional
- [ ] Clicking button shows address form
- [ ] Address label field with quick select buttons
- [ ] AddressSection component reused
- [ ] "Set as default" checkbox works
- [ ] Form validation implemented
- [ ] Save address API integration works
- [ ] Success message displayed after save
- [ ] New address appears in list
- [ ] Cancel button returns to list
- [ ] Loading state during save
- [ ] Error handling implemented
- [ ] Maximum addresses limit enforced

---

## Diagrams

### Address Form Component Hierarchy

```
ShippingStep
    │
    ├─── SavedAddresses (if logged in)
    │       │
    │       ├─── SavedAddressCard
    │       ├─── SavedAddressCard
    │       └─── Add New Address Button
    │
    └─── AddressSection
            │
            ├─── ProvinceDropdown
            ├─── DistrictDropdown (filtered by province)
            ├─── CityDropdown (filtered by district)
            ├─── Address Line 1 Input
            ├─── Address Line 2 Input (optional)
            ├─── Postal Code Input
            └─── Landmark Input (recommended)
```

### Cascading Dropdown Flow

```
User selects Province
         │
         ▼
┌─────────────────────┐
│ Province: Western   │
└─────────────────────┘
         │
         ▼
Filter Districts where provinceId = "Western"
         │
         ▼
┌─────────────────────┐
│ Districts:          │
│ - Colombo           │
│ - Gampaha           │
│ - Kalutara          │
└─────────────────────┘
         │
         ▼ User selects District
         │
┌─────────────────────┐
│ District: Colombo   │
└─────────────────────┘
         │
         ▼
Filter Cities where districtId = "Colombo"
         │
         ▼
┌─────────────────────┐
│ Cities:             │
│ - Colombo 01        │
│ - Colombo 02        │
│ - Colombo 03        │
│ - ... (many more)   │
└─────────────────────┘
         │
         ▼ User selects City
         │
┌─────────────────────┐
│ City: Colombo 03    │
└─────────────────────┘
         │
         ▼
Auto-populate Postal Code: 00300
```

### Saved Address Selection Flow

```
User lands on Shipping Step
         │
         ▼
    Is user logged in?
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
Has saved   Show new
addresses?  address form
    │
  ┌─┴─┐
 YES  NO
  │    │
  ▼    ▼
Show  Show "Add
list  First Addr"
  │
  ▼
User selects saved address
  │
  ▼
Address populated in form (read-only preview)
  │
  ▼
Continue to Shipping Methods
```

### Add New Address Flow

```
Click "+ Add New Address"
         │
         ▼
Show Address Form
         │
         ├─── Address Label Input
         ├─── Province Dropdown
         ├─── District Dropdown
         ├─── City Dropdown
         ├─── Address Lines
         ├─── Postal Code
         ├─── Landmark
         └─── Set as Default
         │
         ▼
Fill out form fields
         │
         ▼
Click "Save Address"
         │
         ▼
Validate all fields
    ┌────┴────┐
  VALID    INVALID
    │         │
    ▼         ▼
Send POST  Show errors
to API
    │
    ▼
API saves address
    │
    ▼
Return address ID
    │
    ▼
Add to local state
    │
    ▼
Show success message
    │
    ▼
Return to saved addresses list
    │
    ▼
Highlight new address (optional: auto-select)
```

### Postal Code Validation Flow

```
User enters postal code
         │
         ▼
Check length = 5?
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
Check all   Show error:
digits?     "Must be 5 digits"
    │
  ┌─┴─┐
 YES  NO
  │    │
  ▼    ▼
Check  Show error:
valid  "Only numbers"
range?
  │
┌─┴─┐
YES  NO
│    │
▼    ▼
Valid  Show error:
       "Invalid postal code"
│
▼
Clear error, enable continue
```

### State Management Diagram

```
┌─────────────────────────────────────────────┐
│         Checkout Store (Zustand)            │
├─────────────────────────────────────────────┤
│  shippingAddress: {                         │
│    selectedAddressId: string | null         │
│    isUsingNew: boolean                      │
│    newAddress: {                            │
│      province: string                       │
│      district: string                       │
│      city: string                           │
│      line1: string                          │
│      line2: string                          │
│      postalCode: string                     │
│      landmark: string                       │
│    }                                        │
│  }                                          │
│  savedAddresses: SavedAddress[]             │
│  updateShippingAddress(data)                │
│  selectSavedAddress(id)                     │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│         ShippingStep Component              │
│  - Reads state from store                   │
│  - Dispatches updates                       │
│  - Manages UI state (editing, loading)      │
└─────────────────────────────────────────────┘
              │
       ┌──────┴──────┐
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│ SavedAddrs   │  │ AddressForm  │
│ Component    │  │ Component    │
└──────────────┘  └──────────────┘
```

---

## Summary

This document covered Tasks 35-45, creating the shipping address functionality for the checkout flow with Sri Lankan-specific address handling. Key accomplishments:

### Components Created
1. **ShippingStep** - Main page container for step 2
2. **AddressSection** - Address form container
3. **ProvinceDropdown** - 9 provinces of Sri Lanka
4. **DistrictDropdown** - 25 districts with cascading filter
5. **CityDropdown** - Cities with district-based filtering
6. **Address Line Inputs** - Line 1 (required) and Line 2 (optional)
7. **LandmarkInput** - Recommended field for delivery help
8. **SavedAddresses** - List of user's saved addresses
9. **SavedAddressCard** - Individual address card with selection
10. **Add New Address** - Functionality to save addresses

### Key Features Implemented
- **Cascading Location Selection**: Province → District → City
- **Postal Code Validation**: 5-digit Sri Lankan postal codes
- **Saved Addresses**: For logged-in users with select, edit, delete
- **Landmark Support**: Recommended field for Sri Lankan deliveries
- **Address Labels**: Custom labels like "Home", "Office"
- **Default Address**: Set preferred default address
- **Responsive Design**: Mobile-first with desktop optimization
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Sri Lankan Address Format
The implementation follows the standard Sri Lankan address structure:
1. Province (9 options)
2. District (25 options, filtered by province)
3. City (hundreds of options, filtered by district)
4. Address Line 1 (required)
5. Address Line 2 (optional)
6. Postal Code (5 digits, required)
7. Landmark (optional but recommended)

### Next Steps
Document 02 will cover:
- **Tasks 46-52**: Shipping methods section
- Standard and Express shipping options
- Shipping cost display in LKR
- Delivery time estimates
- Step 2 flow verification

---

## End of Document

**Total Tasks Covered:** 11 (Tasks 35-45)  
**Document Length:** ~950 lines  
**Next Document:** [02_Tasks-46-52_Shipping-Methods-Verify.md](02_Tasks-46-52_Shipping-Methods-Verify.md)
