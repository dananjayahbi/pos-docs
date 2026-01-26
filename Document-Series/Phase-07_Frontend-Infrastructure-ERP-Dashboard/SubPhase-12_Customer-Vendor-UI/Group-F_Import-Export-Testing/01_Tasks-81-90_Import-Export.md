# Tasks 81-90: Import/Export Functionality

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** F - Import/Export & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-91-96_Testing-Verify.md](02_Tasks-91-96_Testing-Verify.md)

---

## Document Overview

This document covers bulk import and export functionality for customers and vendors, including CSV mapping, validation, and error handling.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Customer Import Modal | Medium | 30 min |
| 82 | Create Import Mapping Component | Medium | 35 min |
| 83 | Create Import Preview | Medium | 30 min |
| 84 | Create Customer Export Action | Medium | 25 min |
| 85 | Create Vendor Import Modal | Medium | 30 min |
| 86 | Create Vendor Export Action | Medium | 25 min |
| 87 | Handle Import Errors | Medium | 30 min |
| 88 | Create Import Summary | Low | 20 min |
| 89 | Add Export Filters | Medium | 25 min |
| 90 | Test Import/Export Flow | Medium | 30 min |

---

## Task 81: Create Customer Import Modal

### Overview
Create CustomerImportModal component for bulk importing customers from CSV files.

### Dependencies
- Group B: Customer list exists
- SubPhase 05: Modal/Dialog components available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerImportModal.tsx`

2. **Create modal structure:**
   - Header: "Import Customers"
   - File upload area (drag & drop or click)
   - Accepted formats: CSV, Excel (.xlsx)
   - ImportMapping component (Task 82)
   - ImportPreview component (Task 83)
   - Action buttons (Cancel, Import)

3. **Handle file upload:**
   - Accept CSV and Excel files
   - Parse file content
   - Extract headers
   - Display preview

4. **Implement multi-step flow:**
   - Step 1: Upload file
   - Step 2: Map columns (Task 82)
   - Step 3: Preview and validate (Task 83)
   - Step 4: Import and show results (Task 88)

### Modal Layout

```
┌─────────────────────────────────────────────┐
│ Import Customers                        [✕] │
├─────────────────────────────────────────────┤
│                                             │
│ Step 1: Upload File                         │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │                                     │    │
│ │   Drag & drop CSV or Excel file     │    │
│ │              or                     │    │
│ │        [Choose File]                │    │
│ │                                     │    │
│ │   Supported: .csv, .xlsx            │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Download sample template                    │
│                                             │
│                      [Cancel]  [Next →]     │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Modal opens and displays upload area
- File upload parses correctly
- Multi-step wizard works

### Verification Checklist
- [ ] CustomerImportModal.tsx file created
- [ ] File upload functional
- [ ] CSV/Excel parsing works
- [ ] Step navigation works

---

## Task 82: Create Import Mapping Component

### Overview
Create ImportMapping component for mapping CSV columns to customer fields.

### Dependencies
- Task 81: Import modal created

### Instructions

1. **Create component file**
   - Create new file `ImportMapping.tsx`

2. **Display CSV headers:**
   - Show all columns from uploaded file
   - Display first row as example

3. **Create field mapping:**
   - For each customer field, provide dropdown
   - Dropdown lists CSV columns
   - Auto-detect common field names

4. **Required customer fields:**
   - **Name** (required)
   - **Phone** (required, Sri Lankan format)
   - **Email**
   - **Address Line 1**
   - **Address Line 2**
   - **City**
   - **District**
   - **Postal Code**
   - **Customer Type** (Individual/Business)
   - **Credit Limit**
   - **Tax ID**
   - **Notes**

5. **Implement auto-mapping:**
   - Match "name" → Name
   - Match "phone" / "mobile" → Phone
   - Match "email" / "e-mail" → Email
   - Match "address" → Address Line 1
   - Match "city" → City
   - Match "type" → Customer Type

6. **Validation:**
   - Ensure required fields mapped
   - Check for duplicate mappings
   - Warn unmapped columns

### Mapping Layout

```
┌─────────────────────────────────────────────┐
│ Step 2: Map Columns                         │
│                                             │
│ Map your CSV columns to customer fields:    │
│                                             │
│ Customer Field         CSV Column           │
│ ────────────────────────────────────────────│
│ Name *                [Name            ▼]   │
│ Phone *               [Phone Number    ▼]   │
│ Email                 [Email Address   ▼]   │
│ Address Line 1        [Street          ▼]   │
│ Address Line 2        [-- Not Mapped --▼]   │
│ City                  [City            ▼]   │
│ District              [District        ▼]   │
│ Postal Code           [Zip Code        ▼]   │
│ Customer Type         [Type            ▼]   │
│ Credit Limit          [Credit          ▼]   │
│ Tax ID                [-- Not Mapped --▼]   │
│ Notes                 [-- Not Mapped --▼]   │
│                                             │
│ Preview: Name column → "John Doe"           │
│                                             │
│              [← Back]  [Cancel]  [Next →]   │
└─────────────────────────────────────────────┘
```

### Auto-Detection Logic

```
Auto-Mapping Rules:
1. Exact match (case-insensitive)
2. Partial match (contains keyword)
3. Common aliases:
   - "name", "customer_name", "full_name" → Name
   - "phone", "mobile", "telephone" → Phone
   - "email", "e-mail", "mail" → Email
   - "address", "street" → Address Line 1
   - "type", "category" → Customer Type
```

### Expected Outcome
- Column mapping interface displays
- Auto-detection suggests mappings
- Required fields validated

### Verification Checklist
- [ ] ImportMapping.tsx file created
- [ ] CSV columns display
- [ ] Dropdowns work
- [ ] Auto-detection functional
- [ ] Validation catches errors

---

## Task 83: Create Import Preview

### Overview
Create ImportPreview component for previewing and validating imported data before saving.

### Dependencies
- Task 82: Import mapping created

### Instructions

1. **Create component file**
   - Create new file `ImportPreview.tsx`

2. **Display summary statistics:**
   - Total records
   - Valid records (green)
   - Records with warnings (yellow)
   - Records with errors (red)

3. **Show data preview:**
   - Display first 5-10 rows
   - Show mapped values
   - Highlight errors in red
   - Highlight warnings in yellow

4. **Validate each record:**
   - **Phone**: Check Sri Lankan format
   - **Email**: Validate email format
   - **Customer Type**: Must be "Individual" or "Business"
   - **Credit Limit**: Must be numeric
   - **Required fields**: Must not be empty

5. **Display validation messages:**
   - Row number
   - Field name
   - Error/Warning type
   - Suggested fix

6. **Allow error handling:**
   - Option to skip invalid rows
   - Option to fix and re-validate
   - Option to import valid rows only

### Preview Layout

```
┌─────────────────────────────────────────────┐
│ Step 3: Preview & Validate                  │
│                                             │
│ Import Summary                              │
│ ┌─────────────────────────────────────┐    │
│ │ Total Records:        250           │    │
│ │ ✓ Valid:              230  (92%)    │    │
│ │ ⚠ Warnings:            15  (6%)     │    │
│ │ ✗ Errors:               5  (2%)     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Data Preview (First 5 rows)                 │
│ ┌─────────────────────────────────────┐    │
│ │ Row  Name        Phone      Status  │    │
│ │ ─────────────────────────────────── │    │
│ │ 1    John Doe    0712345678  ✓      │    │
│ │ 2    Jane Smith  0771234567  ✓      │    │
│ │ 3    ABC Corp    Invalid     ✗      │    │
│ │      └─ Invalid phone format        │    │
│ │ 4    Bob Lee     0701234567  ⚠      │    │
│ │      └─ Missing email               │    │
│ │ 5    Sarah West  0711234567  ✓      │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ☐ Import only valid records                 │
│ ☐ Skip rows with errors                     │
│                                             │
│              [← Back]  [Cancel]  [Import]   │
└─────────────────────────────────────────────┘
```

### Validation Rules

| Field | Validation | Error Type | Message |
|-------|------------|------------|---------|
| Name | Required, non-empty | Error | "Name is required" |
| Phone | Sri Lankan format | Error | "Invalid phone format. Use: 07XXXXXXXX" |
| Email | Valid email or empty | Warning | "Invalid email format" |
| Customer Type | "Individual" or "Business" | Error | "Type must be Individual or Business" |
| Credit Limit | Numeric or empty | Error | "Credit limit must be a number" |
| District | Valid Sri Lankan district | Warning | "District not recognized" |

### Expected Outcome
- Preview displays summary and rows
- Validation runs on all records
- Errors/warnings highlighted
- Import options available

### Verification Checklist
- [ ] ImportPreview.tsx file created
- [ ] Summary statistics display
- [ ] Data preview shows rows
- [ ] Validation runs correctly
- [ ] Errors highlighted
- [ ] Import options work

---

## Task 84: Create Customer Export Action

### Overview
Create customer export functionality for exporting filtered customer data to CSV or Excel.

### Dependencies
- Group B: Customer list with filters

### Instructions

1. **Create export function**
   - Create new file `exportCustomers.ts` in utils directory

2. **Implement export logic:**
   - Fetch customers based on current filters
   - Format data for export
   - Generate CSV or Excel file
   - Trigger download

3. **Include customer fields:**
   - Name
   - Phone
   - Email
   - Address (combined)
   - City
   - District
   - Postal Code
   - Customer Type
   - Credit Limit
   - Outstanding Balance
   - Total Orders
   - Member Since

4. **Add to Customers page:**
   - Export button in CustomersHeader
   - Dropdown for format selection (CSV/Excel)
   - Apply current filters to export

5. **Generate filename:**
   - Format: `customers_export_YYYY-MM-DD.csv`
   - Or: `customers_export_YYYY-MM-DD.xlsx`

### Export Button Layout

```
┌─────────────────────────────────────────────┐
│ Customers                      [+ New]  [↓] │
│                                             │
│ Dropdown on [↓]:                            │
│ ┌─────────────────┐                         │
│ │ Export as CSV   │                         │
│ │ Export as Excel │                         │
│ └─────────────────┘                         │
└─────────────────────────────────────────────┘
```

### CSV Format

```
Name,Phone,Email,Address,City,District,Type,Credit Limit,Balance,Orders,Member Since
John Doe,0712345678,john@example.com,"123 Main St",Colombo,Colombo,Individual,50000,15000,12,2023-01-15
Jane Smith,0771234567,jane@example.com,"456 Park Ave",Kandy,Kandy,Business,100000,25000,28,2022-08-20
```

### Expected Outcome
- Export button added to header
- CSV/Excel export generates file
- Filtered data exported
- File downloads automatically

### Verification Checklist
- [ ] exportCustomers.ts file created
- [ ] Export button added
- [ ] CSV export works
- [ ] Excel export works
- [ ] Filters applied to export
- [ ] File downloads correctly

---

## Task 85: Create Vendor Import Modal

### Overview
Create VendorImportModal component for bulk importing vendors from CSV files.

### Dependencies
- Task 81-83: Customer import pattern established
- Group D: Vendor list exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Vendors/` directory
   - Create new file `VendorImportModal.tsx`

2. **Follow customer import pattern:**
   - Same multi-step flow
   - Upload → Map → Preview → Import

3. **Define vendor fields for mapping:**
   - **Company Name** (required)
   - **Contact Person**
   - **Phone** (required)
   - **Email**
   - **Website**
   - **Address**
   - **City**
   - **Payment Terms**
   - **Currency**
   - **Lead Time (days)**
   - **Minimum Order Value**
   - **Notes**

4. **Vendor-specific validations:**
   - Company name unique
   - Phone format (Sri Lankan or international)
   - Website format (valid URL)
   - Payment terms (numeric, days)
   - Lead time (numeric, days)
   - Minimum order value (numeric)

### Modal Flow

```
Step 1: Upload File
└─ Same as customer import

Step 2: Map Columns
└─ Vendor-specific fields:
   - Company Name * → "Company"
   - Contact Person → "Contact"
   - Phone * → "Phone"
   - Email → "Email"
   - Website → "URL", "Website"
   - Payment Terms → "Terms", "Payment"
   - Lead Time → "Lead", "Delivery Time"

Step 3: Preview & Validate
└─ Vendor-specific validation:
   - Duplicate company name
   - Website URL format
   - Numeric fields validation

Step 4: Import Results
└─ Show success/error counts
```

### Expected Outcome
- Vendor import modal works
- Vendor fields map correctly
- Validation specific to vendors

### Verification Checklist
- [ ] VendorImportModal.tsx file created
- [ ] Upload works
- [ ] Mapping functional
- [ ] Preview validates
- [ ] Import creates vendors

---

## Task 86: Create Vendor Export Action

### Overview
Create vendor export functionality for exporting vendor data to CSV or Excel.

### Dependencies
- Task 84: Customer export pattern established
- Group D: Vendor list with filters

### Instructions

1. **Create export function**
   - Create new file `exportVendors.ts` in utils directory

2. **Implement vendor export:**
   - Follow customer export pattern
   - Apply vendor filters

3. **Include vendor fields:**
   - Company Name
   - Contact Person
   - Phone
   - Email
   - Website
   - Address
   - City
   - Payment Terms
   - Currency
   - Lead Time
   - Minimum Order Value
   - Total Products
   - Total POs
   - Status

4. **Add to Vendors page:**
   - Export button in VendorsHeader
   - CSV/Excel format options

5. **Generate filename:**
   - Format: `vendors_export_YYYY-MM-DD.csv`

### Expected Outcome
- Vendor export button added
- CSV/Excel export works
- Filtered vendors exported

### Verification Checklist
- [ ] exportVendors.ts file created
- [ ] Export button added
- [ ] CSV export works
- [ ] Excel export works
- [ ] Filters applied

---

## Task 87: Handle Import Errors

### Overview
Implement comprehensive error handling for import operations with user-friendly messages.

### Dependencies
- Task 83: Import preview created

### Instructions

1. **Create error handler**
   - Create new file `importErrorHandler.ts`

2. **Define error types:**
   - **Validation Errors**: Invalid data format
   - **Duplicate Errors**: Record already exists
   - **Network Errors**: API request failed
   - **File Errors**: Invalid file format
   - **Mapping Errors**: Required fields not mapped

3. **Implement error display:**
   - Error list component
   - Group by error type
   - Show affected rows
   - Provide fix suggestions

4. **Create error recovery:**
   - Option to download error report
   - Option to fix and retry
   - Option to skip errors and continue

5. **Error report format:**
   - CSV with error column
   - Row number, field, error message

### Error Types and Messages

| Error Type | Example | Message | Action |
|------------|---------|---------|--------|
| Validation | Invalid phone | "Row 5: Invalid phone format" | "Fix phone number" |
| Duplicate | Name exists | "Row 12: Customer already exists" | "Skip or update" |
| Required | Missing name | "Row 8: Name is required" | "Add name" |
| Format | Bad email | "Row 15: Invalid email format" | "Correct email" |
| Network | API failed | "Import failed: Network error" | "Retry import" |

### Error Display Layout

```
┌─────────────────────────────────────────────┐
│ Import Errors                               │
│                                             │
│ 5 errors found in your import file:        │
│                                             │
│ Validation Errors (3)                       │
│ • Row 3: Invalid phone format               │
│   └─ Expected: 07XXXXXXXX                   │
│ • Row 8: Customer type must be Individual   │
│   or Business                               │
│ • Row 15: Invalid email format              │
│                                             │
│ Duplicate Errors (2)                        │
│ • Row 12: Customer "John Doe" already exists│
│ • Row 18: Phone number already in use       │
│                                             │
│ [Download Error Report]                     │
│                                             │
│ What would you like to do?                  │
│ ○ Skip error rows and import valid records  │
│ ○ Fix errors and retry import               │
│ ○ Cancel import                             │
│                                             │
│                      [Cancel]  [Continue]   │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- All error types handled
- User-friendly error messages
- Recovery options available

### Verification Checklist
- [ ] importErrorHandler.ts file created
- [ ] All error types caught
- [ ] Error display works
- [ ] Error report downloads
- [ ] Recovery options work

---

## Task 88: Create Import Summary

### Overview
Create ImportSummary component for displaying import results after completion.

### Dependencies
- Task 87: Error handling implemented

### Instructions

1. **Create component file**
   - Create new file `ImportSummary.tsx`

2. **Display import results:**
   - Total records processed
   - Successfully imported (green)
   - Skipped (yellow)
   - Failed (red)

3. **Show details:**
   - List of errors (if any)
   - Link to view imported records
   - Option to download error report

4. **Add success actions:**
   - View imported customers/vendors
   - Import another file
   - Close modal

### Summary Layout

```
┌─────────────────────────────────────────────┐
│ Import Complete                         [✕] │
├─────────────────────────────────────────────┤
│                                             │
│        ✓ Import Successful!                 │
│                                             │
│ Results:                                    │
│ ┌─────────────────────────────────────┐    │
│ │ Total Records:        250           │    │
│ │ ✓ Imported:           230  (92%)    │    │
│ │ ⊗ Skipped:             15  (6%)     │    │
│ │ ✗ Failed:               5  (2%)     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ 5 records failed to import due to           │
│ validation errors.                          │
│                                             │
│ [Download Error Report]                     │
│                                             │
│        [View Imported Records]  [Close]     │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Summary displays after import
- Results clearly shown
- Actions available

### Verification Checklist
- [ ] ImportSummary.tsx file created
- [ ] Results display correctly
- [ ] Error report downloads
- [ ] View records link works

---

## Task 89: Add Export Filters

### Overview
Enhance export functionality to respect current filters and allow date range selection.

### Dependencies
- Task 84, 86: Export functions created

### Instructions

1. **Update export functions:**
   - Apply current filter state
   - Add date range parameter

2. **Add export options modal:**
   - Select format (CSV/Excel)
   - Select date range
   - Select fields to export
   - Apply current filters option

3. **Implement field selection:**
   - Checkbox list of available fields
   - "Select All" / "Deselect All"
   - Default to all fields

4. **Show export preview:**
   - Count of records to export
   - Preview of filters applied

### Export Options Modal

```
┌─────────────────────────────────────────────┐
│ Export Customers                        [✕] │
├─────────────────────────────────────────────┤
│                                             │
│ Format                                      │
│ ○ CSV    ● Excel                            │
│                                             │
│ Date Range                                  │
│ From: [MM/DD/YYYY 📅]  To: [MM/DD/YYYY 📅] │
│                                             │
│ Fields to Export                            │
│ ☑ Name             ☑ Phone                  │
│ ☑ Email            ☑ Address                │
│ ☑ City             ☑ District               │
│ ☑ Customer Type    ☑ Credit Limit           │
│ ☑ Balance          ☑ Total Orders           │
│                                             │
│ [☑ Select All]                              │
│                                             │
│ Current Filters Applied:                    │
│ • Status: Active                            │
│ • Type: Business                            │
│                                             │
│ Records to export: 45                       │
│                                             │
│                      [Cancel]  [Export]     │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Export respects filters
- Field selection works
- Date range filters correctly

### Verification Checklist
- [ ] Export options modal created
- [ ] Format selection works
- [ ] Date range filters
- [ ] Field selection functional
- [ ] Filters applied correctly
- [ ] Record count accurate

---

## Task 90: Test Import/Export Flow

### Overview
Comprehensive testing of import and export functionality for both customers and vendors.

### Dependencies
- All previous Group F tasks complete

### Instructions

1. **Prepare test data:**
   - Create sample CSV files
   - Include valid records
   - Include invalid records (for error testing)
   - Include duplicate records

2. **Test customer import:**
   - Upload CSV
   - Verify auto-mapping
   - Check validation
   - Test error handling
   - Confirm successful import

3. **Test vendor import:**
   - Same steps as customer
   - Verify vendor-specific validations

4. **Test customer export:**
   - Apply various filters
   - Export as CSV
   - Export as Excel
   - Verify data accuracy
   - Test field selection

5. **Test vendor export:**
   - Same steps as customer

6. **Test edge cases:**
   - Empty CSV file
   - CSV with no data rows
   - CSV with special characters
   - Very large CSV (1000+ rows)
   - Duplicate entries
   - Network errors during import

7. **Document issues:**
   - Create list of bugs found
   - Note unexpected behavior
   - Record performance issues

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Valid Import | Upload valid CSV → Map → Import | All records imported |
| Invalid Data | Upload CSV with errors → Preview | Errors highlighted, can skip |
| Duplicate | Upload CSV with existing records | Duplicates detected, can update |
| Empty File | Upload empty CSV | Error message shown |
| Large Import | Upload 1000+ row CSV | Progress indicator, success |
| Export Filtered | Apply filters → Export | Only filtered records exported |
| Export All Fields | Select all fields → Export | All columns in export file |
| Export Custom | Select specific fields → Export | Only selected columns exported |

### Expected Outcome
- All imports work correctly
- All exports generate files
- Error handling robust
- Edge cases handled

### Verification Checklist
- [ ] Customer import tested
- [ ] Vendor import tested
- [ ] Customer export tested
- [ ] Vendor export tested
- [ ] Error handling verified
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Issues documented

---

## Summary

This document implemented comprehensive import/export functionality for the CRM module. The following were created:

### Customer Import
- CustomerImportModal - Multi-step import wizard
- ImportMapping - Column mapping with auto-detection
- ImportPreview - Validation and preview

### Vendor Import
- VendorImportModal - Vendor-specific import
- Vendor field mapping and validation

### Export Functionality
- Customer export (CSV/Excel)
- Vendor export (CSV/Excel)
- Export with filters
- Field selection

### Error Handling
- Validation errors
- Duplicate detection
- Network error handling
- Error recovery options
- Error report download

### Import Summary
- Results display
- Success/error counts
- View imported records
- Error report access

### Features
- Bulk import with validation
- CSV/Excel support
- Column auto-mapping
- Error highlighting and recovery
- Filtered exports
- Custom field selection
- Date range filtering

The next document will complete the CRM module with final testing and verification procedures.
