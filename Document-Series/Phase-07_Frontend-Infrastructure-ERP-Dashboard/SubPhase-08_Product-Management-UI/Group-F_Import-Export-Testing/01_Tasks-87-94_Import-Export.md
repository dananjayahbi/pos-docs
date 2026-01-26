# Tasks 87-94: Import/Export Functionality

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** F - Import/Export & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 87, 88, 89, 90, 91, 92, 93, 94

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-95-96_Documentation-Testing.md](02_Tasks-95-96_Documentation-Testing.md)

---

## Document Overview

This document covers the implementation of product import and export functionality. It enables users to export product data in multiple formats (CSV, Excel, PDF) and import products from CSV or Excel files with column mapping, validation, and error handling. These features facilitate bulk product management and data migration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 87 | Create Export Products Button | Low | 20 min |
| 88 | Create Export Format Selector | Low | 25 min |
| 89 | Implement Export Logic | Medium | 45 min |
| 90 | Create Import Products Button | Low | 20 min |
| 91 | Create Import Dialog | Medium | 40 min |
| 92 | Create Import File Upload | Low | 30 min |
| 93 | Create Import Preview Table | Medium | 45 min |
| 94 | Implement Import Logic | Medium | 50 min |

---

## Task 87: Create Export Products Button

### Overview
Create an export button in the product list toolbar that allows users to initiate the export process. The button should be positioned in the top-right toolbar area alongside other action buttons and should open the export format selector when clicked.

### Dependencies
- Task 34: Create Product List Toolbar (from Group B)
- Product list page is functional
- Export components directory exists

### Instructions

1. **Create export components directory**
   - Navigate to `frontend/components/modules/products/`
   - Create new directory named `Export`
   - Create `index.ts` for barrel exports

2. **Create ExportButton component file**
   - Create `ExportButton.tsx` in `Export/` directory
   - Import required dependencies (Button, icons from Lucide)
   - Set up TypeScript React functional component

3. **Define component props interface**
   - Create `ExportButtonProps` interface
   - Include `selectedProducts` prop (array of product IDs)
   - Include `filters` prop (current active filters)
   - Include `onExport` callback function

4. **Implement button structure**
   - Use Button component from shared UI library
   - Add "Export" text label
   - Include Download icon from Lucide React
   - Set appropriate variant (outline or secondary)

5. **Add click handler**
   - Handle button click event
   - Call `onExport` callback with selection data
   - Show export format selector (Task 88)

6. **Implement disabled state**
   - Disable button when no products available
   - Show tooltip explaining why disabled
   - Update button appearance when disabled

7. **Add to product list toolbar**
   - Import ExportButton in product list page
   - Position in top-right toolbar area
   - Pass selected products and filters as props

### Button States

| State | Condition | Appearance |
|-------|-----------|------------|
| Default | Products available | Blue outline, enabled |
| Hover | Mouse over | Darker background |
| Disabled | No products | Gray, cursor-not-allowed |
| Loading | Export in progress | Spinner icon |

### Button Placement

```
┌─────────────────────────────────────────────────────┐
│ Products                                            │
├─────────────────────────────────────────────────────┤
│ [Filters] [Search...]    [+ Add] [Import] [Export] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Product list content...                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| selectedProducts | string[] | No | Array of selected product IDs |
| filters | ProductFilters | No | Current filter state |
| totalProducts | number | Yes | Total products available |
| onExport | () => void | Yes | Export initiation callback |

### Export Scope Options

| Scope | Description | Data Passed |
|-------|-------------|-------------|
| Selected | Export only selected products | selectedProducts array |
| Filtered | Export filtered results | current filters |
| All | Export entire product catalog | no filters |

### Expected Outcome
- Export button visible in product list toolbar
- Button opens export format selector on click
- Proper disabled state when no products exist
- Tooltip provides helpful context

### Verification Checklist
- [ ] ExportButton component created in `Export/` directory
- [ ] Button displays with Download icon and label
- [ ] Button positioned in toolbar correctly
- [ ] Click handler triggers export flow
- [ ] Disabled state works when no products
- [ ] Tooltip shows on hover
- [ ] Component properly typed with TypeScript
- [ ] Exports added to index.ts

---

## Task 88: Create Export Format Selector

### Overview
Create a dropdown or popover component that allows users to select the export format (CSV, Excel, PDF). This selector appears when the export button is clicked and provides format options with descriptions and icons.

### Dependencies
- Task 87: Create Export Products Button

### Instructions

1. **Create ExportFormatSelector component file**
   - Create `ExportFormatSelector.tsx` in `Export/` directory
   - Import Popover or DropdownMenu from UI library
   - Import format-specific icons (FileText, FileSpreadsheet, FilePdf)

2. **Define export formats configuration**
   - Create `EXPORT_FORMATS` constant array
   - Define format objects (id, label, description, icon, extension)
   - Include CSV, Excel (XLSX), and PDF formats

3. **Define component props interface**
   - Create `ExportFormatSelectorProps` interface
   - Include `open` boolean prop
   - Include `onOpenChange` callback
   - Include `onFormatSelect` callback with format parameter

4. **Implement popover structure**
   - Use Popover component as container
   - Trigger popover from ExportButton
   - Display format options in popover content

5. **Create format option items**
   - Render list of format options
   - Show icon, label, and description for each
   - Add hover and focus states
   - Style as clickable buttons or menu items

6. **Add format selection handler**
   - Handle click on format option
   - Call `onFormatSelect` with selected format
   - Close popover after selection
   - Initiate export with selected format

7. **Style format options**
   - Use consistent spacing and typography
   - Add icons with proper sizing
   - Show description text in lighter color
   - Add hover effects for interactivity

### Export Formats Configuration

| Format | Extension | Icon | Description | Generation |
|--------|-----------|------|-------------|------------|
| CSV | .csv | FileText | Comma-separated values | Client-side |
| Excel | .xlsx | FileSpreadsheet | Microsoft Excel workbook | Server-side |
| PDF | .pdf | FilePdf | Printable product report | Server-side |

### Format Selector Layout

```
┌─────────────────────────────────────┐
│ Select Export Format                │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [📄] CSV                        ││
│ │      Comma-separated values     ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [📊] Excel                      ││
│ │      Microsoft Excel workbook   ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ [📑] PDF                        ││
│ │      Printable product report   ││
│ └─────────────────────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### Format Object Structure

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique format identifier |
| label | string | Display name |
| description | string | Format description |
| icon | Component | Lucide icon component |
| extension | string | File extension |
| mimeType | string | MIME type for download |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| open | boolean | Yes | Popover open state |
| onOpenChange | (open: boolean) => void | Yes | Open state change handler |
| onFormatSelect | (format: string) => void | Yes | Format selection handler |

### Export Format Details

```typescript
CSV
├── Client-side generation
├── Uses Papa Parse or similar library
├── Columns: Name, SKU, Description, Cost, Price, Stock, Status
└── Fast, no server request needed

Excel
├── Server-side generation
├── API endpoint: POST /api/products/export/excel
├── Rich formatting with headers and totals
└── Supports multiple sheets if needed

PDF
├── Server-side generation
├── API endpoint: POST /api/products/export/pdf
├── Formatted table with branding
└── Includes summary statistics
```

### Expected Outcome
- Format selector appears when export button clicked
- Three format options displayed with icons and descriptions
- Selection triggers export with chosen format
- Popover closes after format selection

### Verification Checklist
- [ ] ExportFormatSelector component created
- [ ] Three format options rendered (CSV, Excel, PDF)
- [ ] Each option shows icon, label, and description
- [ ] Popover opens/closes properly
- [ ] Format selection triggers export flow
- [ ] Hover states work on format options
- [ ] Component properly typed with TypeScript
- [ ] Exports added to index.ts

---

## Task 89: Implement Export Logic

### Overview
Implement the core export functionality that generates and downloads product data in the selected format. For CSV, use client-side generation. For Excel and PDF, make API requests to server-side endpoints. Handle loading states, errors, and file downloads.

### Dependencies
- Task 88: Create Export Format Selector
- Product API is functional
- Export backend endpoints exist (for Excel/PDF)

### Instructions

1. **Create export utility functions**
   - Create `exportUtils.ts` in `Export/` directory or `lib/utils/`
   - Create separate functions for each format
   - Import necessary libraries (Papa Parse for CSV)

2. **Implement CSV export function**
   - Create `exportToCSV` function
   - Accept products array as parameter
   - Define column mapping configuration
   - Use Papa Parse to generate CSV string
   - Trigger browser download with Blob API

3. **Implement Excel export function**
   - Create `exportToExcel` function
   - Make POST request to `/api/products/export/excel`
   - Pass filters or product IDs in request body
   - Handle response as blob
   - Trigger file download with appropriate filename

4. **Implement PDF export function**
   - Create `exportToPDF` function
   - Make POST request to `/api/products/export/pdf`
   - Pass filters or product IDs in request body
   - Handle response as blob
   - Trigger file download with appropriate filename

5. **Create file download helper**
   - Create `downloadFile` utility function
   - Accept blob, filename, and mimeType parameters
   - Create object URL from blob
   - Create temporary anchor element
   - Trigger download and cleanup

6. **Add loading and error states**
   - Create `useExport` custom hook
   - Manage loading state during export
   - Handle errors and show toast notifications
   - Disable export button during export

7. **Integrate with ExportButton**
   - Import export functions in product list page
   - Call appropriate export function based on format
   - Show loading indicator during export
   - Display success/error messages

### Export Data Columns

| Column | Source Field | Type | Required |
|--------|--------------|------|----------|
| Name | name | string | Yes |
| SKU | sku | string | Yes |
| Description | description | string | No |
| Cost Price | cost_price | number | Yes |
| Selling Price | selling_price | number | Yes |
| Stock Quantity | stock_quantity | number | Yes |
| Status | status | string | Yes |
| Category | category.name | string | No |
| Created Date | created_at | date | No |

### Export Flow Diagram

```
User clicks Export Button
    │
    ▼
Format Selector Opens
    │
    ▼
User selects format (CSV/Excel/PDF)
    │
    ├─── CSV ──────────────┐
    │                      ▼
    │              Client-side generation
    │              Papa Parse converts data
    │              Browser downloads file
    │
    ├─── Excel ────────────┐
    │                      ▼
    │              API request with filters
    │              Server generates XLSX
    │              Blob response
    │              Browser downloads file
    │
    └─── PDF ──────────────┐
                           ▼
                   API request with filters
                   Server generates PDF
                   Blob response
                   Browser downloads file
```

### CSV Export Implementation

| Step | Action | Library/API |
|------|--------|-------------|
| 1 | Fetch product data | React Query or API call |
| 2 | Map to export columns | JavaScript map |
| 3 | Convert to CSV string | Papa Parse |
| 4 | Create blob | Blob API |
| 5 | Trigger download | Download helper |

### Excel/PDF Export Request

```typescript
POST /api/products/export/excel
Body:
{
  filters: {
    category: "electronics",
    status: "active",
    search: "laptop"
  },
  productIds: ["prod_1", "prod_2"], // if specific selection
  columns: ["name", "sku", "price", "stock"]
}

Response:
- Binary blob (application/vnd.openxmlformats or application/pdf)
- Headers: Content-Disposition with filename
```

### File Download Helper

| Parameter | Type | Description |
|-----------|------|-------------|
| blob | Blob | File data as blob |
| filename | string | Downloaded filename |
| mimeType | string | File MIME type |

### Error Handling

| Error Type | Handling Strategy |
|------------|-------------------|
| Network Error | Show toast: "Export failed. Please check your connection." |
| Empty Data | Show toast: "No products to export." |
| Server Error | Show toast: "Server error. Please try again." |
| Format Error | Show toast: "Export format not supported." |

### Loading States

| State | UI Feedback |
|-------|-------------|
| Preparing | "Preparing export..." |
| Downloading | "Downloading file..." |
| Complete | "Export complete!" (auto-dismiss) |
| Error | "Export failed" (with retry button) |

### Expected Outcome
- CSV export generates and downloads file client-side
- Excel export calls API and downloads XLSX file
- PDF export calls API and downloads PDF file
- Loading states provide user feedback
- Errors handled gracefully with notifications

### Verification Checklist
- [ ] CSV export function implemented and working
- [ ] Excel export API integration working
- [ ] PDF export API integration working
- [ ] File download helper function created
- [ ] Loading states show during export
- [ ] Error handling implemented with toast notifications
- [ ] Downloaded files have correct filenames and extensions
- [ ] Export includes all required columns
- [ ] Empty data scenarios handled
- [ ] TypeScript types defined for export functions

---

## Task 90: Create Import Products Button

### Overview
Create an import button in the product list toolbar that allows users to initiate the product import process. The button should be positioned alongside the export button and should open the import dialog when clicked.

### Dependencies
- Task 34: Create Product List Toolbar (from Group B)
- Product list page is functional
- Import components directory exists

### Instructions

1. **Create import components directory**
   - Navigate to `frontend/components/modules/products/`
   - Create new directory named `Import`
   - Create `index.ts` for barrel exports

2. **Create ImportButton component file**
   - Create `ImportButton.tsx` in `Import/` directory
   - Import required dependencies (Button, icons)
   - Set up TypeScript React functional component

3. **Define component props interface**
   - Create `ImportButtonProps` interface
   - Include `onImport` callback function
   - Include optional `disabled` prop

4. **Implement button structure**
   - Use Button component from UI library
   - Add "Import" text label
   - Include Upload icon from Lucide React
   - Set appropriate variant (outline or primary)

5. **Add click handler**
   - Handle button click event
   - Call `onImport` callback
   - Open import dialog (Task 91)

6. **Add permission check**
   - Verify user has import permissions
   - Disable button if no permission
   - Show tooltip explaining permission requirement

7. **Add to product list toolbar**
   - Import ImportButton in product list page
   - Position next to export button
   - Connect to import dialog state

### Button Placement

```
┌─────────────────────────────────────────────────────┐
│ Products                                            │
├─────────────────────────────────────────────────────┤
│ [Filters] [Search...]    [+ Add] [Import] [Export] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Product list content...                            │
│                                                     │
└─────────────────────────────────────────────────────┘
                                        ↑       ↑
                                     Import  Export
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onImport | () => void | Yes | Import dialog open callback |
| disabled | boolean | No | Disable button |
| permissions | string[] | No | User permissions array |

### Button States

| State | Condition | Appearance |
|-------|-----------|------------|
| Default | Has import permission | Primary or outline style |
| Hover | Mouse over | Darker background |
| Disabled | No permission | Gray, cursor-not-allowed |
| Active | Import in progress | Spinner replacing icon |

### Permission Requirements

| Permission | Required For | Fallback |
|------------|--------------|----------|
| products.import | Opening import dialog | Disable button, show tooltip |
| products.create | Creating products via import | Show warning in dialog |

### Expected Outcome
- Import button visible in product list toolbar
- Button opens import dialog on click
- Proper disabled state based on permissions
- Tooltip provides helpful context

### Verification Checklist
- [ ] ImportButton component created in `Import/` directory
- [ ] Button displays with Upload icon and label
- [ ] Button positioned in toolbar next to export button
- [ ] Click handler opens import dialog
- [ ] Permission check implemented
- [ ] Disabled state works correctly
- [ ] Tooltip shows on hover when disabled
- [ ] Component properly typed with TypeScript
- [ ] Exports added to index.ts

---

## Task 91: Create Import Dialog

### Overview
Create a multi-step dialog component that guides users through the product import process. The dialog includes steps for file upload, column mapping, data preview, and import confirmation. Use a stepper UI pattern to show progress through the import flow.

### Dependencies
- Task 90: Create Import Products Button

### Instructions

1. **Create ImportDialog component file**
   - Create `ImportDialog.tsx` in `Import/` directory
   - Import Dialog component from UI library
   - Import Stepper or Tabs component for multi-step UI

2. **Define component props interface**
   - Create `ImportDialogProps` interface
   - Include `open` boolean prop
   - Include `onOpenChange` callback
   - Include `onImportComplete` callback

3. **Define import steps state**
   - Create `ImportStep` enum or type (Upload, Map, Preview, Confirm)
   - Use useState to track current step
   - Create navigation functions (next, back, reset)

4. **Implement dialog structure**
   - Use Dialog component as container
   - Add DialogHeader with title and close button
   - Add DialogContent for step content
   - Add DialogFooter with navigation buttons

5. **Create step indicator/stepper**
   - Show all steps with labels
   - Highlight current step
   - Show completed steps with checkmarks
   - Allow clicking previous steps to go back

6. **Implement step navigation**
   - Create "Next" button to advance steps
   - Create "Back" button to return to previous step
   - Create "Cancel" button to close dialog
   - Create "Import" button for final step

7. **Add step-specific content**
   - Render different components based on current step
   - Show ImportFileUpload for upload step (Task 92)
   - Show column mapping UI for map step (Task 93)
   - Show ImportPreview for preview step (Task 93)
   - Show confirmation summary for final step

8. **Implement state management**
   - Store uploaded file in state
   - Store parsed data in state
   - Store column mappings in state
   - Store validation errors in state

### Import Steps

| Step | Label | Component | Actions |
|------|-------|-----------|---------|
| 1 | Upload File | ImportFileUpload | Select/drag CSV or Excel file |
| 2 | Map Columns | ColumnMappingTable | Map file columns to product fields |
| 3 | Preview Data | ImportPreview | Review data and validation errors |
| 4 | Confirm | ImportSummary | Confirm and submit import |

### Dialog Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ Import Products                            [X]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Step Indicator:                                 │
│ [1] Upload → [2] Map → [3] Preview → [4] Confirm│
│  ✓            •                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│          Step Content Goes Here                 │
│                                                 │
│  (ImportFileUpload / ColumnMapping /            │
│   ImportPreview / ImportSummary)                │
│                                                 │
├─────────────────────────────────────────────────┤
│                     [Cancel] [Back] [Next/Import]│
└─────────────────────────────────────────────────┘
```

### Component State

| State Variable | Type | Description |
|----------------|------|-------------|
| currentStep | number | Current step index (0-3) |
| file | File \| null | Uploaded file object |
| parsedData | any[][] | Parsed CSV/Excel data |
| columnMappings | Map | File column → Product field mapping |
| validationErrors | Error[] | Data validation errors |
| isImporting | boolean | Import in progress flag |

### Step Navigation Logic

| From Step | Action | Condition | To Step |
|-----------|--------|-----------|---------|
| Upload | Next | File uploaded & parsed | Map |
| Map | Next | All required columns mapped | Preview |
| Map | Back | Always | Upload |
| Preview | Next | Validation passed | Confirm |
| Preview | Back | Always | Map |
| Confirm | Import | User confirms | Close dialog |
| Confirm | Back | Always | Preview |

### Dialog Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| open | boolean | Yes | Dialog open state |
| onOpenChange | (open: boolean) => void | Yes | Open state change handler |
| onImportComplete | (result: ImportResult) => void | Yes | Import completion callback |

### Button States by Step

| Step | Cancel | Back | Next/Import |
|------|--------|------|-------------|
| Upload | Enabled | Hidden | Disabled until file selected |
| Map | Enabled | Enabled | Disabled until required mappings |
| Preview | Enabled | Enabled | Enabled |
| Confirm | Enabled | Enabled | "Import" button |

### Expected Outcome
- Multi-step dialog with clear navigation
- Step indicator shows current progress
- Each step renders appropriate content
- Navigation buttons enable/disable appropriately
- State persists between steps

### Verification Checklist
- [ ] ImportDialog component created
- [ ] Dialog opens when import button clicked
- [ ] Step indicator shows all four steps
- [ ] Current step highlighted
- [ ] Navigation buttons work (Next, Back, Cancel)
- [ ] Step-specific content renders correctly
- [ ] State management implemented for file, data, mappings
- [ ] Dialog closes on cancel or completion
- [ ] TypeScript types defined properly
- [ ] Component exports added to index.ts

---

## Task 92: Create Import File Upload

### Overview
Create a file upload component for the first step of the import dialog. Support drag-and-drop and click-to-browse functionality. Accept CSV and Excel (XLSX) files. Parse the uploaded file and extract data for column mapping.

### Dependencies
- Task 91: Create Import Dialog
- File parsing libraries installed (Papa Parse, xlsx)

### Instructions

1. **Create ImportFileUpload component file**
   - Create `ImportFileUpload.tsx` in `Import/` directory
   - Import file upload utilities and icons
   - Import Papa Parse (for CSV) and xlsx library (for Excel)

2. **Define component props interface**
   - Create `ImportFileUploadProps` interface
   - Include `onFileSelect` callback with file and parsed data
   - Include `acceptedTypes` array prop
   - Include error state props

3. **Implement file input element**
   - Create hidden file input element
   - Set accept attribute to ".csv,.xlsx"
   - Add onChange handler to process file

4. **Create drag-and-drop area**
   - Use div as drop zone
   - Add onDragOver and onDragLeave handlers
   - Add onDrop handler to accept dropped files
   - Show visual feedback during drag (border highlight)

5. **Implement file selection UI**
   - Show upload icon and instructions
   - Add "Click to browse" or "Drag & drop" text
   - Display accepted file types and size limit
   - Show selected filename after upload

6. **Add file validation**
   - Check file type (CSV or XLSX only)
   - Check file size (max 10MB)
   - Show validation errors in UI
   - Prevent invalid files from processing

7. **Implement file parsing**
   - For CSV: use Papa Parse to convert to array
   - For Excel: use xlsx library to read and convert
   - Extract headers from first row
   - Extract data rows
   - Pass parsed data to parent component

8. **Add loading state**
   - Show spinner while parsing file
   - Disable drop zone during parsing
   - Update UI to show progress

### File Upload UI States

```
Empty State
┌─────────────────────────────────────┐
│                                     │
│          [Upload Icon]              │
│                                     │
│   Drag & drop file here             │
│   or click to browse                │
│                                     │
│   Accepts: CSV, Excel (.xlsx)       │
│   Max size: 10MB                    │
│                                     │
└─────────────────────────────────────┘

Drag Over State
┌─────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░        [Upload Icon]          ░░ │
│░░                                ░░│
│░░      Drop file to upload       ░░│
│░░                                ░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────┘

File Selected State
┌─────────────────────────────────────┐
│  ✓ products.csv                     │
│  2,543 rows • 8 columns             │
│                                     │
│  [Change File]                      │
└─────────────────────────────────────┘
```

### Accepted File Types

| Type | Extension | MIME Type | Parser |
|------|-----------|-----------|--------|
| CSV | .csv | text/csv | Papa Parse |
| Excel | .xlsx | application/vnd.openxmlformats | xlsx library |

### File Validation Rules

| Rule | Limit | Error Message |
|------|-------|---------------|
| File type | .csv or .xlsx only | "Invalid file type. Please upload CSV or Excel file." |
| File size | Max 10MB | "File too large. Maximum size is 10MB." |
| Empty file | Min 2 rows (header + data) | "File is empty or missing data." |

### File Parsing Process

```
File Upload
    │
    ▼
Validate file type and size
    │
    ▼
Read file content
    │
    ├─── CSV ─────┐
    │             ▼
    │    Papa Parse.parse()
    │             │
    │             ▼
    │    Extract headers (row 0)
    │    Extract data (rows 1+)
    │
    ├─── Excel ───┐
    │             ▼
    │    xlsx.read()
    │    xlsx.utils.sheet_to_json()
    │             │
    │             ▼
    │    Extract headers (keys)
    │    Extract data (values)
    │
    └─────────────┘
             │
             ▼
    Return ParsedData
    {
      headers: string[],
      rows: any[][],
      totalRows: number
    }
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onFileSelect | (file: File, data: ParsedData) => void | Yes | File selection callback |
| acceptedTypes | string[] | No | Accepted MIME types |
| maxSize | number | No | Max file size in bytes |
| error | string | No | Error message to display |

### Parsed Data Structure

| Property | Type | Description |
|----------|------|-------------|
| headers | string[] | Column headers from first row |
| rows | any[][] | Data rows (excluding header) |
| totalRows | number | Total number of data rows |
| fileName | string | Original filename |

### Expected Outcome
- Drag-and-drop file upload area
- Click-to-browse file selection
- File type and size validation
- CSV and Excel parsing
- Parsed data passed to next step
- Loading state during parsing

### Verification Checklist
- [ ] ImportFileUpload component created
- [ ] Drag-and-drop functionality working
- [ ] Click-to-browse working
- [ ] CSV file parsing with Papa Parse
- [ ] Excel file parsing with xlsx library
- [ ] File validation (type, size, content)
- [ ] Error messages display correctly
- [ ] Selected file shows name and stats
- [ ] Loading state during parsing
- [ ] Parsed data structure correct
- [ ] Component properly typed with TypeScript

---

## Task 93: Create Import Preview Table

### Overview
Create a preview table component that displays parsed import data with column mapping UI and validation feedback. Allow users to map file columns to product fields, preview the first 10 rows, and see validation errors. This is used in both the Map and Preview steps of the import dialog.

### Dependencies
- Task 92: Create Import File Upload
- Product field definitions available

### Instructions

1. **Create ImportPreview component file**
   - Create `ImportPreview.tsx` in `Import/` directory
   - Import Table components from UI library
   - Import Select component for column mapping

2. **Define component props interface**
   - Create `ImportPreviewProps` interface
   - Include `data` prop (parsed file data)
   - Include `mappings` prop (current column mappings)
   - Include `onMappingsChange` callback
   - Include `validationErrors` prop

3. **Define product field mapping options**
   - Create `PRODUCT_FIELDS` constant array
   - Include all importable product fields (name, sku, description, etc.)
   - Include field labels, types, and required flags
   - Include validation rules for each field

4. **Create column mapping header**
   - Render table header with two rows
   - First row: mapping dropdowns for each file column
   - Second row: product field labels
   - Allow selecting target field for each column

5. **Implement column mapping selects**
   - Render Select dropdown for each file column
   - Options: all product fields + "Skip" option
   - Default: auto-detect based on header name
   - Update mappings on selection change

6. **Render preview data rows**
   - Display first 10 rows of parsed data
   - Show data in mapped column order
   - Highlight cells with validation errors
   - Show row numbers for reference

7. **Implement data validation**
   - Validate each cell based on mapped field type
   - Check required fields are mapped and not empty
   - Check data types (number, date, email, etc.)
   - Check format constraints (SKU pattern, price range)

8. **Display validation errors**
   - Show error icon on cells with issues
   - Show error tooltip on hover
   - Show error summary above table
   - Color-code errors (red) and warnings (yellow)

9. **Add auto-mapping logic**
   - Create function to auto-detect column mappings
   - Match file headers to field names (case-insensitive)
   - Handle common variations (e.g., "Price" → "selling_price")
   - Apply auto-mappings on component mount

### Product Fields Configuration

| Field | Label | Type | Required | Validation |
|-------|-------|------|----------|------------|
| name | Product Name | string | Yes | Max 200 chars |
| sku | SKU | string | Yes | Unique, alphanumeric |
| description | Description | text | No | Max 1000 chars |
| cost_price | Cost Price | number | No | >= 0 |
| selling_price | Selling Price | number | Yes | > cost_price |
| stock_quantity | Initial Stock | number | No | >= 0, integer |
| status | Status | enum | No | "active" or "inactive" |
| category_name | Category | string | No | Existing category |
| tags | Tags | string[] | No | Comma-separated |

### Column Mapping UI

```
┌────────────────────────────────────────────────────────┐
│ Column Mapping                                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│ File Column:    [Name ▼]  [Code ▼]  [Price ▼] [Qty ▼]│
│ Maps to:        Product    SKU       Selling   Stock  │
│                 Name                 Price     Qty    │
│                                                        │
├────────────────────────────────────────────────────────┤
│ # │ Product Name │ SKU    │ Selling Price │ Stock    │
├────────────────────────────────────────────────────────┤
│ 1 │ Laptop       │ LP-001 │ 999.00        │ 50       │
│ 2 │ Mouse        │ MS-002 │ 25.00         │ 100      │
│ 3 │ Keyboard !   │ KB-003 │ -10.00 ⚠      │ 75       │
│ 4 │ Monitor      │ MN-004 │ 350.00        │ 30       │
│ 5 │              │ HD-005 │ 45.00         │ 200      │
│   │ (Missing required field) ▲                        │
│ ...                                                    │
└────────────────────────────────────────────────────────┘

Legend:
! = Error     ⚠ = Warning
```

### Auto-Mapping Rules

| File Header (Case-Insensitive) | Maps To | Match Strategy |
|--------------------------------|---------|----------------|
| name, product, product_name | name | Exact or contains |
| sku, code, product_code | sku | Exact or contains |
| description, desc | description | Exact or contains |
| cost, cost_price | cost_price | Exact or contains |
| price, selling_price, sale_price | selling_price | Exact or contains |
| stock, quantity, qty, stock_qty | stock_quantity | Exact or contains |
| status, state | status | Exact |
| category | category_name | Exact or contains |

### Validation Rules

| Rule | Check | Error Level | Message |
|------|-------|-------------|---------|
| Required field | Not empty | Error | "This field is required" |
| Unique SKU | Not duplicate | Error | "SKU must be unique" |
| Price validation | > 0 | Error | "Price must be positive" |
| Price comparison | selling_price > cost_price | Warning | "Selling price below cost" |
| Integer stock | Is integer | Error | "Stock must be whole number" |
| Status enum | "active" or "inactive" | Error | "Invalid status value" |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | ParsedData | Yes | Parsed file data |
| mappings | ColumnMappings | Yes | Current column mappings |
| onMappingsChange | (mappings: ColumnMappings) => void | Yes | Mapping change handler |
| validationErrors | ValidationError[] | No | Validation errors |
| showMappingRow | boolean | No | Show/hide mapping dropdowns |

### Validation Error Structure

| Property | Type | Description |
|----------|------|-------------|
| row | number | Row index with error |
| column | string | Column name |
| field | string | Product field name |
| message | string | Error description |
| level | "error" \| "warning" | Severity level |

### Expected Outcome
- Table displays parsed file data preview
- Column mapping dropdowns allow field selection
- Auto-mapping applies intelligent defaults
- Validation runs on all preview data
- Errors highlighted in cells with tooltips
- Summary shows total errors and warnings

### Verification Checklist
- [ ] ImportPreview component created
- [ ] Table displays file data preview (first 10 rows)
- [ ] Column mapping dropdowns render for each column
- [ ] Product fields configuration defined
- [ ] Auto-mapping logic implemented
- [ ] Mapping changes update state correctly
- [ ] Data validation runs on all rows
- [ ] Validation errors display in cells
- [ ] Error tooltips show on hover
- [ ] Error summary shows above table
- [ ] Required field validation working
- [ ] Data type validation working
- [ ] Component properly typed with TypeScript

---

## Task 94: Implement Import Logic

### Overview
Implement the core import functionality that validates data, submits products to the API, and handles the import results. Process valid products, collect errors, show progress, and display import summary with success/failure counts.

### Dependencies
- Task 93: Create Import Preview Table
- Product creation API endpoint functional
- Import dialog state management ready

### Instructions

1. **Create import utility functions**
   - Create `importUtils.ts` in `Import/` directory or `lib/utils/`
   - Create validation function for all data
   - Create batch processing function
   - Create result aggregation function

2. **Implement validation function**
   - Create `validateImportData` function
   - Accept parsed data and column mappings
   - Return array of validation errors
   - Check all required fields present
   - Validate data types and formats
   - Check for duplicate SKUs

3. **Implement batch import function**
   - Create `importProducts` function
   - Accept validated product data array
   - Split into batches (e.g., 50 products per batch)
   - Make POST requests to `/api/products/bulk-import`
   - Process batches sequentially with delay
   - Handle partial failures

4. **Create progress tracking**
   - Create `useImportProgress` custom hook
   - Track current batch, total batches
   - Calculate percentage complete
   - Update UI with progress bar

5. **Implement error collection**
   - Collect validation errors from preview
   - Collect API errors from import requests
   - Associate errors with specific rows
   - Categorize errors by type

6. **Create import results component**
   - Create `ImportResults.tsx` component
   - Display success count and failure count
   - Show list of errors with row numbers
   - Provide option to download error report
   - Show option to retry failed imports

7. **Add import confirmation step**
   - Create summary view before import
   - Show total rows to import
   - Show total validation errors (if any)
   - Require user confirmation to proceed
   - Disable import if critical errors exist

8. **Integrate with import dialog**
   - Call validation on preview step
   - Call import on confirmation step
   - Show progress dialog during import
   - Show results dialog after completion
   - Refresh product list on success

### Import Flow Diagram

```
User confirms import
    │
    ▼
Validate all data
    │
    ├─ Has errors? ──Yes──> Show errors, block import
    │
    ▼ No
Split data into batches
    │
    ▼
Process Batch 1
    │
    ├─ POST /api/products/bulk-import
    │  Body: [product1, product2, ...]
    │
    ├─ Collect successes
    ├─ Collect failures
    │
    ▼
Update progress (batch 1/N complete)
    │
    ▼
Process Batch 2...
    │
    ▼
All batches complete
    │
    ▼
Aggregate results
    │
    ▼
Show results dialog
    │
    ├─ X products imported successfully
    ├─ Y products failed
    └─ Download error report
```

### Validation Function

| Check | Description | Error Level |
|-------|-------------|-------------|
| Required fields | All required fields mapped and not empty | Error |
| Unique SKU | No duplicate SKUs in import data | Error |
| Data types | Values match field type (number, string) | Error |
| Price validation | Prices are positive numbers | Error |
| Stock validation | Stock is non-negative integer | Error |
| Status validation | Status is "active" or "inactive" | Warning |
| Category exists | Category name exists in system | Warning |

### Batch Processing

| Setting | Value | Rationale |
|---------|-------|-----------|
| Batch size | 50 products | Balance between speed and reliability |
| Delay between batches | 500ms | Avoid overwhelming server |
| Max retries | 3 per batch | Handle temporary failures |
| Timeout | 30s per batch | Prevent hanging requests |

### API Request Structure

```typescript
POST /api/products/bulk-import
Headers:
  Content-Type: application/json
  Authorization: Bearer <token>

Body:
{
  products: [
    {
      name: "Laptop",
      sku: "LP-001",
      description: "15-inch laptop",
      cost_price: 800.00,
      selling_price: 999.00,
      stock_quantity: 50,
      status: "active",
      category_name: "Electronics"
    },
    // ... more products
  ]
}

Response:
{
  success: true,
  results: {
    total: 50,
    success: 48,
    failed: 2,
    errors: [
      {
        row: 15,
        sku: "LP-015",
        error: "Duplicate SKU"
      },
      {
        row: 32,
        sku: "LP-032",
        error: "Invalid category"
      }
    ]
  }
}
```

### Progress Tracking

| State | Type | Description |
|-------|------|-------------|
| currentBatch | number | Current batch being processed |
| totalBatches | number | Total number of batches |
| processedRows | number | Total rows processed so far |
| totalRows | number | Total rows to import |
| percentage | number | Percentage complete (0-100) |

### Import Results Display

```
┌─────────────────────────────────────┐
│ Import Complete                     │
├─────────────────────────────────────┤
│                                     │
│  ✓ 148 products imported            │
│  ✗ 2 products failed                │
│                                     │
│  Errors:                            │
│  • Row 15: Duplicate SKU (LP-015)   │
│  • Row 32: Invalid category         │
│                                     │
│  [Download Error Report]            │
│                                     │
├─────────────────────────────────────┤
│                          [Close]    │
└─────────────────────────────────────┘
```

### Error Report Structure

| Column | Description |
|--------|-------------|
| Row # | Original row number in file |
| Product Name | Product name if available |
| SKU | Product SKU if available |
| Error | Error message |
| Details | Additional error details |

### Component State

| State Variable | Type | Description |
|----------------|------|-------------|
| isImporting | boolean | Import in progress |
| progress | number | Import progress percentage |
| results | ImportResults | Import results |
| showResults | boolean | Show results dialog |

### Expected Outcome
- Data validation runs before import
- Batch processing imports products efficiently
- Progress bar shows import status
- Results dialog shows success/failure counts
- Error report downloadable as CSV
- Product list refreshes after successful import

### Verification Checklist
- [ ] Validation function implemented
- [ ] Batch import function created
- [ ] Progress tracking working
- [ ] API integration for bulk import
- [ ] Error collection implemented
- [ ] Import results component created
- [ ] Results dialog displays correctly
- [ ] Error report download working
- [ ] Product list refreshes after import
- [ ] Partial failure handling working
- [ ] Loading states show during import
- [ ] TypeScript types defined for all functions
- [ ] Error messages are user-friendly

---

## Summary

This document implemented comprehensive import and export functionality for the product management module. Users can export products in CSV, Excel, or PDF formats, and import products from CSV or Excel files with intelligent column mapping, data validation, and batch processing.

### Completed Tasks
1. ✓ Created export button in product list toolbar
2. ✓ Created export format selector with CSV, Excel, and PDF options
3. ✓ Implemented export logic with client-side CSV and server-side Excel/PDF
4. ✓ Created import button in product list toolbar
5. ✓ Created multi-step import dialog with stepper UI
6. ✓ Created file upload component with drag-and-drop support
7. ✓ Created import preview table with column mapping and validation
8. ✓ Implemented import logic with batch processing and error handling

### Key Features
- **Export:** Multiple formats (CSV, Excel, PDF), filtered or selected products
- **Import:** Drag-and-drop upload, intelligent column mapping, data validation
- **Preview:** First 10 rows preview with error highlighting
- **Progress:** Real-time progress tracking during import
- **Results:** Success/failure summary with downloadable error report

### Next Steps
Proceed to [02_Tasks-95-96_Documentation-Testing.md](02_Tasks-95-96_Documentation-Testing.md) to create comprehensive product module documentation and perform final verification testing of all product management features.
