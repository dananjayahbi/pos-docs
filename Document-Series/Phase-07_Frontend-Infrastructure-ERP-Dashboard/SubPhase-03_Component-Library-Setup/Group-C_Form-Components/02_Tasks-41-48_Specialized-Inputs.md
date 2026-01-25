# Tasks 41-48: Specialized Input Components

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** C - Form Components  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_Form-Date-Money.md](01_Tasks-33-40_Form-Date-Money.md)

---

## Document Overview

This document covers the implementation of specialized input components that handle specific data types and use cases. These components extend beyond basic inputs to provide rich, interactive experiences for phone numbers, file uploads, image handling, multi-selection, and advanced search functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create PhoneInput Component | Medium | 45 min |
| 42 | Create SearchInput Component | Medium | 35 min |
| 43 | Create PasswordInput Component | Low | 25 min |
| 44 | Create FileUpload Component | High | 90 min |
| 45 | Create ImageUpload Component | High | 90 min |
| 46 | Create MultiSelect Component | High | 60 min |
| 47 | Create Combobox Component | High | 75 min |
| 48 | Create NumberInput Component | Medium | 40 min |

---

## Task 41: Create PhoneInput Component

### Overview
Create a specialized phone input component with Sri Lankan phone number formatting, including the +94 country prefix, automatic hyphenation, mobile number validation, and 10-digit maximum length enforcement. This component ensures consistent phone number data entry and validation across the ERP system.

### Dependencies
- Base Input component (Task 33)
- Form utilities and validation helpers
- Sri Lankan phone number regex patterns
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `PhoneInput.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define props interface extending base input props

2. **Define component props interface**
   - Extend base input props (value, onChange, disabled, error)
   - Add `autoFormat` prop (boolean) to enable/disable auto-hyphenation
   - Add `allowLandline` prop (boolean) for landline support
   - Add `defaultCountryCode` prop with default value '+94'

3. **Implement country code prefix display**
   - Create non-editable prefix element showing '+94'
   - Position prefix at start of input field
   - Style prefix with muted color to distinguish from input value
   - Ensure prefix aligns correctly with input text

4. **Implement digit-only input filtering**
   - Add input filter to accept only numeric characters
   - Remove any non-digit characters on input
   - Prevent alphabetic and special character entry
   - Allow backspace, delete, and arrow key navigation

5. **Add 10-digit maximum length enforcement**
   - Implement maxLength restriction at 10 digits
   - Show character counter (e.g., "7/10 digits")
   - Prevent additional input when limit reached
   - Provide visual feedback when approaching limit

6. **Implement automatic hyphenation**
   - Format pattern: XXX-XXX-XXXX (3-3-4 format)
   - Insert hyphens automatically at positions 3 and 6
   - Remove hyphens when user deletes characters
   - Maintain cursor position during formatting

7. **Add mobile number validation**
   - Validate Sri Lankan mobile prefixes (70, 71, 72, 75, 76, 77, 78)
   - Show real-time validation feedback
   - Display error for invalid mobile prefixes
   - Optional: Support landline patterns (11, 21, 31, etc.)

8. **Implement value normalization**
   - Store clean phone number (digits only) in state
   - Format displayed value with hyphens
   - Strip hyphens when passing to parent onChange
   - Handle paste operations with cleaning

9. **Add visual states and styling**
   - Default state with subtle border
   - Focus state with accent color
   - Error state with red border
   - Disabled state with muted appearance
   - Success state for valid numbers

10. **Implement accessibility features**
    - Add aria-label for screen readers
    - Include inputMode="tel" for mobile keyboards
    - Provide clear error messages
    - Support keyboard navigation

### Phone Number Format Structure

```
+94 XXX-XXX-XXXX
│   │   │   │
│   │   │   └── Last 4 digits
│   │   └────── Middle 3 digits (auto-hyphen)
│   └────────── First 3 digits (auto-hyphen)
└────────────── Country code (fixed prefix)
```

### Sri Lankan Mobile Prefixes

| Prefix | Network Operator | Type |
|--------|------------------|------|
| 70 | Mobitel | Mobile |
| 71 | Mobitel | Mobile |
| 72 | Hutch | Mobile |
| 75 | Airtel | Mobile |
| 76 | Dialog | Mobile |
| 77 | Dialog | Mobile |
| 78 | Hutch | Mobile |

### Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| Length | Exactly 10 digits | 0771234567 |
| Mobile Prefix | Must start with valid mobile prefix | 077, 070, 072 |
| Numeric Only | No letters or special characters | Numbers only |
| Formatted Display | Auto-hyphenation for readability | 077-123-4567 |

### Expected Outcome
- Functional phone input with Sri Lankan formatting
- Automatic hyphenation for improved readability
- Real-time validation of mobile prefixes
- Clean, normalized phone data output
- Accessible and user-friendly interface

### Verification Checklist
- [ ] Component accepts only numeric input
- [ ] Country code prefix (+94) displayed and non-editable
- [ ] Automatic hyphenation works at positions 3 and 6
- [ ] Maximum 10 digits enforced
- [ ] Mobile prefix validation (70, 71, 72, 75, 76, 77, 78)
- [ ] Error states display correctly
- [ ] Paste operation cleans and validates input
- [ ] Character counter shows progress
- [ ] Cursor position maintained during formatting
- [ ] Disabled state renders correctly
- [ ] Accessibility attributes present (aria-label, inputMode)
- [ ] Clean digit-only value passed to parent onChange

---

## Task 42: Create SearchInput Component

### Overview
Create a specialized search input component with debounced input handling, search icon, clear button, loading state, and keyboard shortcut support. This component optimizes search performance by preventing excessive API calls and provides an intuitive search experience.

### Dependencies
- Base Input component (Task 33)
- Debounce utility function
- Icon library (search, clear, loading icons)
- Keyboard event handling
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `SearchInput.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Extend base input props (value, onChange, placeholder)
   - Add `onSearch` callback for debounced search
   - Add `debounceMs` prop (default 300ms)
   - Add `showClearButton` boolean prop
   - Add `isSearching` boolean for loading state
   - Add `minChars` for minimum search length (default 0)
   - Add `shortcutKey` for keyboard shortcut (e.g., '/')

3. **Implement debounced search logic**
   - Use debounce utility or custom hook
   - Trigger search callback after specified delay
   - Cancel pending searches on input change
   - Clear timeout on component unmount
   - Provide immediate feedback on user input

4. **Add search icon prefix**
   - Display search icon at left side of input
   - Use magnifying glass icon from icon library
   - Style icon with subtle color
   - Position icon with appropriate padding

5. **Implement clear button**
   - Show clear button (X icon) when input has value
   - Position button at right side of input
   - Clear input and trigger search on click
   - Animate button appearance/disappearance
   - Style as interactive element with hover state

6. **Add loading indicator**
   - Display spinner when isSearching prop is true
   - Replace search icon with loading spinner
   - Animate spinner rotation
   - Show loading state during API requests
   - Disable input interaction during loading

7. **Implement minimum character threshold**
   - Only trigger search when input meets minChars length
   - Show helper text indicating minimum required
   - Provide visual feedback when threshold not met
   - Allow clearing search regardless of threshold

8. **Add keyboard shortcut support**
   - Listen for keyboard shortcut (e.g., '/' key)
   - Focus input when shortcut pressed
   - Show shortcut hint in placeholder or tooltip
   - Prevent default browser behavior for shortcut
   - Support Escape key to clear search

9. **Implement search state management**
   - Track input value in controlled manner
   - Manage debounced value separately
   - Clear pending timeouts appropriately
   - Handle rapid input changes gracefully

10. **Add visual states and styling**
    - Default state with search icon
    - Focus state with accent color ring
    - Loading state with spinner animation
    - Clear button hover and active states
    - Disabled state with muted appearance

11. **Implement accessibility features**
    - Add aria-label="Search"
    - Include role="searchbox"
    - Provide aria-live region for search status
    - Support keyboard navigation (Tab, Enter, Escape)
    - Announce search results count to screen readers

### Search Input State Flow

```
User Input → Debounce Wait → Trigger Search → Show Results
    │            │               │                │
    ├──→ Show Loading (optional) │                │
    │            │               │                │
    └──→ Cancel Previous Search  │                │
                 │               │                │
            (300ms delay)   API Call         Update UI
```

### Debounce Behavior

| Scenario | Behavior | Timing |
|----------|----------|--------|
| Rapid Typing | Cancels previous searches | Each keystroke resets timer |
| Pause in Typing | Triggers search callback | After 300ms (configurable) |
| Clear Button | Immediate search trigger | No debounce delay |
| Component Unmount | Cancels pending search | Cleanup on unmount |

### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `/` | Focus search input | Global (configurable) |
| Escape | Clear search and blur | Input focused |
| Enter | Force immediate search | Input focused |
| Backspace | Delete characters | Input focused |

### Expected Outcome
- Smooth, debounced search experience
- Reduced API call frequency
- Clear visual feedback during search
- Intuitive keyboard shortcuts
- Accessible search functionality

### Verification Checklist
- [ ] Search icon displays at left side
- [ ] Input value updates immediately on typing
- [ ] Search callback triggered after debounce delay (300ms)
- [ ] Clear button appears when input has value
- [ ] Clear button clears input and triggers search
- [ ] Loading spinner shows when isSearching is true
- [ ] Minimum character threshold enforced
- [ ] Keyboard shortcut (/) focuses input
- [ ] Escape key clears search
- [ ] Pending searches cancelled on rapid input
- [ ] Component cleans up timeouts on unmount
- [ ] Accessibility attributes present (role, aria-label)
- [ ] Focus state styled correctly
- [ ] Disabled state renders properly

---

## Task 43: Create PasswordInput Component

### Overview
Create a specialized password input component with show/hide toggle functionality, strength indicator, validation feedback, and security best practices. This component enhances password entry UX while maintaining security standards.

### Dependencies
- Base Input component (Task 33)
- Icon library (eye, eye-off icons)
- Password strength validation utility
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `PasswordInput.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define props interface extending base input

2. **Define component props interface**
   - Extend base input props (value, onChange, error)
   - Add `showStrengthIndicator` boolean prop
   - Add `showToggle` boolean prop (default true)
   - Add `strengthRules` prop for custom validation rules
   - Add `autoComplete` prop (default "current-password")

3. **Implement show/hide toggle button**
   - Add button at right side of input
   - Display eye icon when password hidden
   - Display eye-off icon when password visible
   - Toggle between type="password" and type="text"
   - Maintain focus on input when toggling

4. **Add toggle state management**
   - Track visibility state with useState hook
   - Default to hidden (type="password")
   - Update state on toggle button click
   - Preserve input value during toggle
   - Handle multiple password inputs independently

5. **Style toggle button**
   - Position absolutely within input container
   - Align vertically center
   - Add padding to prevent text overlap
   - Style with hover and active states
   - Use subtle colors (gray → accent on hover)
   - Ensure adequate click target size (min 44x44px)

6. **Implement password strength indicator (optional)**
   - Calculate strength based on rules (length, characters, patterns)
   - Display strength bar below input
   - Show strength levels: Weak, Fair, Good, Strong
   - Color-code strength: red, yellow, green
   - Update in real-time as user types

7. **Define strength calculation rules**
   - Minimum 8 characters
   - Contains uppercase letter
   - Contains lowercase letter
   - Contains number
   - Contains special character
   - Calculate score from 0-100

8. **Add validation feedback**
   - Show requirements checklist when focused
   - Check/uncheck requirements as met
   - Display error messages for invalid passwords
   - Show success state when all requirements met
   - Provide clear, helpful error messages

9. **Implement security best practices**
   - Disable autocomplete for new passwords
   - Set autocomplete="new-password" for creation
   - Set autocomplete="current-password" for login
   - Prevent paste in confirmation fields (optional)
   - Add copy prevention attribute (optional)

10. **Add visual states and styling**
    - Default state with subtle border
    - Focus state with accent ring
    - Error state with red border
    - Success state with green indicator
    - Disabled state with muted appearance

11. **Implement accessibility features**
    - Add aria-label for toggle button
    - Include aria-pressed state for toggle
    - Add aria-describedby for strength indicator
    - Support keyboard navigation (Tab, Enter)
    - Announce strength changes to screen readers

### Password Visibility Toggle

```
State: Hidden                State: Visible
┌─────────────────┐         ┌─────────────────┐
│ ••••••••••  👁 │         │ mypassword  👁̶ │
└─────────────────┘         └─────────────────┘
type="password"             type="text"
```

### Password Strength Levels

| Strength | Score | Color | Criteria |
|----------|-------|-------|----------|
| Weak | 0-25 | Red | < 8 chars or missing requirements |
| Fair | 26-50 | Orange | 8+ chars, some requirements met |
| Good | 51-75 | Yellow | 8+ chars, most requirements met |
| Strong | 76-100 | Green | 12+ chars, all requirements met |

### Strength Indicator Visual

```
Weak:    [████░░░░░░] 25%  (Red)
Fair:    [████████░░] 50%  (Orange)
Good:    [████████████] 75%  (Yellow)
Strong:  [██████████████] 100%  (Green)
```

### Requirements Checklist

| Requirement | Description | Points |
|-------------|-------------|--------|
| Length | Minimum 8 characters | 20 |
| Uppercase | Contains A-Z | 20 |
| Lowercase | Contains a-z | 20 |
| Number | Contains 0-9 | 20 |
| Special | Contains !@#$%^&* | 20 |

### Expected Outcome
- Secure password input with toggle visibility
- Optional real-time strength indicator
- Clear validation feedback
- User-friendly password entry experience
- Accessible for all users

### Verification Checklist
- [ ] Toggle button displays eye icon
- [ ] Click toggle switches between hidden/visible
- [ ] Input type changes between password/text
- [ ] Toggle button accessible via keyboard
- [ ] Strength indicator displays when enabled
- [ ] Strength calculation accurate
- [ ] Strength colors match levels (red/yellow/green)
- [ ] Requirements checklist shows real-time status
- [ ] Error messages display correctly
- [ ] AutoComplete attribute set appropriately
- [ ] Focus state styled correctly
- [ ] Disabled state renders properly
- [ ] Accessibility attributes present (aria-label, aria-pressed)
- [ ] Screen readers announce strength changes

---

## Task 44: Create FileUpload Component

### Overview
Create a comprehensive file upload component with drag-and-drop functionality, file validation, size limits, upload progress indication, multiple file support, and file preview. This component provides a modern, user-friendly file upload experience for document management throughout the ERP system.

### Dependencies
- React hooks (useState, useCallback, useRef)
- File validation utilities
- Icon library (upload, file, trash icons)
- Progress bar component
- Tailwind CSS for styling
- File API for drag-and-drop

### Instructions

1. **Create component file structure**
   - Create `FileUpload.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Add `accept` prop for allowed file types (MIME types)
   - Add `maxSize` prop for file size limit (in bytes)
   - Add `maxFiles` prop for maximum number of files
   - Add `multiple` boolean prop for multi-file support
   - Add `onFileSelect` callback with File[] parameter
   - Add `onFileRemove` callback with file index parameter
   - Add `onUploadProgress` callback with progress percentage
   - Add `disabled` boolean prop
   - Add `error` string prop for validation errors

3. **Create upload area markup**
   - Build dropzone container with border and padding
   - Add centered upload icon and instruction text
   - Include "Browse files" button
   - Show accepted file types and size limit
   - Display as dashed border for drop indication

4. **Implement drag-and-drop functionality**
   - Listen for dragEnter, dragOver, dragLeave, drop events
   - Track drag state to show visual feedback
   - Prevent default browser behavior
   - Highlight dropzone when dragging over
   - Handle file drop and extract files from DataTransfer

5. **Add file input element**
   - Create hidden file input element
   - Connect to "Browse files" button click
   - Set accept attribute from props
   - Set multiple attribute based on props
   - Trigger onFileSelect callback on file selection

6. **Implement file validation**
   - Validate file type against accept prop
   - Check file size against maxSize limit
   - Validate number of files against maxFiles limit
   - Reject invalid files with error messages
   - Show validation errors to user

7. **Display selected files list**
   - Show list of selected files below dropzone
   - Display file name, size, and type
   - Show file icon based on type (document, image, etc.)
   - Add remove button for each file
   - Show upload progress for each file

8. **Implement file size formatting**
   - Convert bytes to human-readable format
   - Display as KB, MB, or GB appropriately
   - Show formatted size next to file name
   - Example: 1024 bytes → "1 KB"

9. **Add upload progress indicator**
   - Display progress bar for each uploading file
   - Show percentage (0-100%)
   - Update progress via onUploadProgress callback
   - Change color based on status (uploading, complete, error)
   - Show checkmark icon when upload complete

10. **Implement file removal**
    - Add remove button (X icon) for each file
    - Confirm removal for large files (optional)
    - Update file list state on removal
    - Call onFileRemove callback with file index
    - Update UI immediately

11. **Add drag state visual feedback**
    - Change border color when dragging over
    - Show blue accent border during drag
    - Add background color change
    - Animate border style transition
    - Return to default state on drag leave

12. **Implement error states**
    - Display file type errors (unsupported format)
    - Display file size errors (exceeds limit)
    - Display max files errors (too many files)
    - Show errors with red text and icon
    - Allow user to correct errors

13. **Add accessibility features**
    - Include aria-label for dropzone
    - Add role="button" for clickable area
    - Support keyboard navigation (Tab, Enter)
    - Announce file selection to screen readers
    - Provide clear error messages

### File Upload Flow

```
User Action → Validation → File List → Upload → Progress → Complete
    │             │            │          │         │          │
  Drop or      Check type   Display    Trigger   Show %    Remove or
   Browse      Check size    files      upload   indicator   Keep file
```

### Drag-and-Drop States

```
Default State:
┌────────────────────────────┐
│   📤  Drop files here       │
│   or click to browse        │
│   (Max 10MB, PDF/DOC/XLS)   │
└────────────────────────────┘

Drag Over State:
┌════════════════════════════┐
║   📤  Drop files now!       ║
║   (Highlighted border)      ║
└════════════════════════════┘
```

### File List Display

```
Selected Files:
┌────────────────────────────────────┐
│ 📄 invoice.pdf    [████████] 100%  │ [X]
│    2.3 MB        ✓ Complete         │
├────────────────────────────────────┤
│ 📄 contract.docx  [████░░░░] 50%   │ [X]
│    1.8 MB        Uploading...       │
├────────────────────────────────────┤
│ ⚠️ large-file.zip  Too large!      │ [X]
│    15.2 MB       Exceeds 10MB limit │
└────────────────────────────────────┘
```

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| File Type | MIME type match | "Unsupported file type" |
| File Size | Size ≤ maxSize | "File exceeds maximum size of X MB" |
| File Count | Count ≤ maxFiles | "Maximum X files allowed" |
| Empty Drop | Files.length > 0 | "No files selected" |

### File Type Icons

| Type | Icon | Extensions |
|------|------|------------|
| Document | 📄 | .pdf, .doc, .docx, .txt |
| Spreadsheet | 📊 | .xls, .xlsx, .csv |
| Image | 🖼️ | .jpg, .png, .gif, .svg |
| Archive | 📦 | .zip, .rar, .7z |
| Generic | 📎 | Other types |

### Expected Outcome
- Modern drag-and-drop file upload interface
- Comprehensive file validation
- Real-time upload progress tracking
- Support for multiple files
- Clear error handling and user feedback

### Verification Checklist
- [ ] Dropzone displays with upload icon and instructions
- [ ] Drag-and-drop works correctly
- [ ] Drag over state shows visual feedback
- [ ] Browse button opens file picker
- [ ] File type validation works
- [ ] File size validation works
- [ ] Maximum files limit enforced
- [ ] Selected files list displays correctly
- [ ] File size formatted as KB/MB/GB
- [ ] Progress bars update during upload
- [ ] Remove button deletes file from list
- [ ] Error messages display for invalid files
- [ ] Multiple file selection works (when enabled)
- [ ] Disabled state renders correctly
- [ ] Accessibility attributes present
- [ ] Keyboard navigation supported

---

## Task 45: Create ImageUpload Component

### Overview
Create a specialized image upload component with drag-and-drop, image preview, cropping functionality, aspect ratio control, image optimization, and multiple image support. This component is optimized for product images, profile photos, and other visual content in the ERP system.

### Dependencies
- FileUpload base component (Task 44)
- Image cropping library (react-image-crop or similar)
- Image preview functionality
- Canvas API for image manipulation
- Icon library (image, crop, trash icons)
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `ImageUpload.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Add `accept` prop (default "image/*")
   - Add `maxSize` prop for image size limit
   - Add `maxImages` prop for maximum number of images
   - Add `aspectRatio` prop (e.g., 1:1, 16:9, 4:3, "free")
   - Add `cropEnabled` boolean prop
   - Add `optimizeImage` boolean prop
   - Add `maxWidth` and `maxHeight` for resizing
   - Add `quality` prop for JPEG compression (0-100)
   - Add `onImageSelect` callback with File[] or Blob[]
   - Add `previewSize` prop (sm, md, lg)

3. **Create image upload area**
   - Build dropzone with image-specific styling
   - Add image placeholder icon
   - Include "Upload Image" instruction text
   - Show accepted formats (JPG, PNG, GIF, WebP)
   - Display max size and max count information

4. **Implement drag-and-drop for images**
   - Listen for drag-and-drop events
   - Validate dropped files are images
   - Show drag-over state with visual feedback
   - Extract image files from drop event
   - Reject non-image files with error message

5. **Add image preview functionality**
   - Display thumbnail preview after selection
   - Show image in appropriate size (based on previewSize)
   - Add loading state while generating preview
   - Use FileReader to create preview URL
   - Revoke object URLs to prevent memory leaks

6. **Implement image cropping interface**
   - Show crop modal/overlay when cropEnabled is true
   - Display full image with crop selection box
   - Allow drag to reposition crop area
   - Allow resize handles to adjust crop size
   - Enforce aspect ratio if specified
   - Add "Crop" and "Cancel" buttons

7. **Add aspect ratio controls**
   - Provide predefined aspect ratio options (1:1, 16:9, 4:3, free)
   - Lock crop box to selected aspect ratio
   - Show aspect ratio selector in crop interface
   - Allow free-form cropping if ratio is "free"
   - Visual indicators for selected ratio

8. **Implement image optimization**
   - Resize image to maxWidth/maxHeight if specified
   - Compress JPEG images based on quality setting
   - Convert large PNGs to JPEG (optional)
   - Use Canvas API for image manipulation
   - Preserve aspect ratio during resizing
   - Show file size before and after optimization

9. **Process cropped image**
   - Extract crop coordinates from crop interface
   - Draw cropped portion to canvas
   - Convert canvas to Blob
   - Create File object from Blob
   - Pass processed image to onImageSelect callback

10. **Display multiple image previews**
    - Show grid of uploaded images
    - Display each image as thumbnail
    - Add remove button overlay on hover
    - Show image name and size
    - Reorder images via drag-and-drop (optional)

11. **Add image management actions**
    - Remove button to delete image
    - Re-crop button to edit existing image
    - Replace button to upload new version
    - Download button for original image (optional)

12. **Implement validation and errors**
    - Validate file is image type
    - Check image dimensions (min/max width/height)
    - Validate file size against maxSize
    - Show specific error messages
    - Prevent upload of invalid images

13. **Add accessibility features**
    - Include alt text input for each image
    - Add aria-label for upload area
    - Support keyboard navigation for controls
    - Announce image selection to screen readers
    - Provide clear instructions and errors

### Image Upload Flow

```
Select Image → Validate → Preview → Crop (optional) → Optimize → Upload
     │            │         │            │               │         │
  Drop or      Check type  Show      Adjust crop    Resize &    Save to
   Browse      Check size  preview    Apply ratio   Compress    server
```

### Image Preview Grid

```
Multiple Images:
┌─────────┬─────────┬─────────┐
│  [Img1] │  [Img2] │  [Img3] │
│  2.1 MB │  1.8 MB │  3.2 MB │
│   [X]   │   [X]   │   [X]   │
├─────────┼─────────┼─────────┤
│  [Img4] │  [+]    │         │
│  1.5 MB │  Add    │         │
│   [X]   │         │         │
└─────────┴─────────┴─────────┘
```

### Crop Interface

```
┌────────────────────────────┐
│  Crop Image                │
├────────────────────────────┤
│  Aspect Ratio:             │
│  [1:1] [16:9] [4:3] [Free] │
├────────────────────────────┤
│  ┌──────────────────┐      │
│  │ ╔═══════════╗    │      │
│  │ ║  Crop     ║    │      │
│  │ ║  Area     ║    │      │
│  │ ╚═══════════╝    │      │
│  └──────────────────┘      │
├────────────────────────────┤
│  [Cancel]  [Crop & Save]   │
└────────────────────────────┘
```

### Aspect Ratio Options

| Ratio | Use Case | Dimensions Example |
|-------|----------|-------------------|
| 1:1 | Profile photos, thumbnails | 400x400 |
| 16:9 | Banners, wide images | 1920x1080 |
| 4:3 | Product photos | 1600x1200 |
| 3:2 | Photography standard | 1500x1000 |
| Free | No constraint | Any size |

### Image Optimization

| Operation | Purpose | Settings |
|-----------|---------|----------|
| Resize | Reduce dimensions | maxWidth, maxHeight |
| Compress | Reduce file size | quality (0-100) |
| Format | Convert format | JPEG, PNG, WebP |
| Crop | Remove unwanted areas | Aspect ratio, coordinates |

### Expected Outcome
- Modern image upload with preview
- Optional cropping with aspect ratio control
- Automatic image optimization
- Support for multiple images
- Intuitive image management interface

### Verification Checklist
- [ ] Image dropzone displays correctly
- [ ] Drag-and-drop works for images
- [ ] Image preview appears after selection
- [ ] Non-image files rejected with error
- [ ] Crop interface opens when enabled
- [ ] Aspect ratio options work correctly
- [ ] Crop applies and updates preview
- [ ] Image resizing works (maxWidth/maxHeight)
- [ ] Image compression reduces file size
- [ ] Multiple images display in grid
- [ ] Remove button deletes image
- [ ] File size shown before/after optimization
- [ ] Validation errors display correctly
- [ ] Keyboard navigation supported
- [ ] Accessibility attributes present

---

## Task 46: Create MultiSelect Component

### Overview
Create a multi-select dropdown component with tag display, search/filter functionality, select all option, and chip-based selection visualization. This component allows users to select multiple options from a list and displays selections as removable tags.

### Dependencies
- Base Select component (Task 36)
- Dropdown positioning utilities
- Icon library (chevron, close, check icons)
- Search/filter logic
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `MultiSelect.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Add `options` array prop with label/value objects
   - Add `value` prop (array of selected values)
   - Add `onChange` callback with array of values
   - Add `placeholder` prop (default "Select options...")
   - Add `maxSelections` prop for selection limit
   - Add `showSelectAll` boolean prop
   - Add `searchable` boolean prop (default true)
   - Add `disabled` boolean prop
   - Add `error` string prop

3. **Create trigger button**
   - Display selected count or placeholder text
   - Show chevron icon indicating dropdown state
   - Add border and padding styling
   - Rotate chevron when dropdown open
   - Show focus ring on keyboard focus

4. **Implement dropdown panel**
   - Position below trigger button
   - Add max-height with scroll for many options
   - Show search input if searchable enabled
   - Display options list with checkboxes
   - Include "Select All" option if enabled
   - Close panel on outside click

5. **Add search/filter functionality**
   - Show search input at top of dropdown
   - Filter options based on search query
   - Update filtered list in real-time
   - Show "No results" message when empty
   - Maintain focus on search input

6. **Implement checkbox options list**
   - Display each option with checkbox
   - Show checkmark icon for selected items
   - Highlight selected options with background
   - Support click to toggle selection
   - Update value array on selection change

7. **Add "Select All" functionality**
   - Show "Select All" option at top of list
   - Toggle all options on/off
   - Update checkbox state (checked, unchecked, indeterminate)
   - Respect maxSelections limit
   - Show indeterminate state for partial selection

8. **Display selected items as tags**
   - Render selected items as chips/badges
   - Show label text with remove button (X icon)
   - Display tags in trigger button area
   - Wrap tags to multiple rows if needed
   - Truncate long labels with ellipsis

9. **Implement tag removal**
   - Add close icon (X) to each tag
   - Remove item from selection on click
   - Update value array immediately
   - Trigger onChange callback
   - Focus remains on component

10. **Add maximum selection limit**
    - Enforce maxSelections prop if specified
    - Disable unselected options when limit reached
    - Show message indicating limit reached
    - Allow removal of selected items
    - Update UI to reflect disabled state

11. **Implement keyboard navigation**
    - Arrow Up/Down to navigate options
    - Space/Enter to toggle selection
    - Tab to navigate between elements
    - Escape to close dropdown
    - Type to search/filter (when searchable)

12. **Add visual states and styling**
    - Default state with subtle border
    - Open state with dropdown visible
    - Focus state with accent ring
    - Disabled state with muted appearance
    - Error state with red border

13. **Implement accessibility features**
    - Add role="combobox" to trigger
    - Use aria-multiselectable="true"
    - Add aria-expanded for dropdown state
    - Include aria-label for options
    - Announce selection changes to screen readers

### MultiSelect UI Structure

```
Trigger Button:
┌────────────────────────────────┐
│ [Tag1 ×] [Tag2 ×] [Tag3 ×]  ⌄ │
└────────────────────────────────┘

Dropdown Panel:
┌────────────────────────────────┐
│ 🔍 Search options...           │
├────────────────────────────────┤
│ ☑ Select All                   │
├────────────────────────────────┤
│ ☑ Option 1                     │
│ ☑ Option 2                     │
│ ☐ Option 3                     │
│ ☐ Option 4                     │
│ ☑ Option 5                     │
└────────────────────────────────┘
```

### Selection States

| State | Checkbox | Visual | Behavior |
|-------|----------|--------|----------|
| Selected | Checked | Blue background, checkmark | Click to deselect |
| Unselected | Unchecked | Default background | Click to select |
| Disabled | Grayed out | Muted appearance | No interaction |
| Filtered | Hidden | Not visible | Excluded from search |

### Tag Display

```
Few selections:
[Product A ×] [Category B ×]

Many selections:
[Item 1 ×] [Item 2 ×] [Item 3 ×]
[Item 4 ×] [Item 5 ×] +3 more

Maximum width reached:
[Very Long Opt... ×] [Another... ×]
```

### Select All States

| State | Checkbox | Condition |
|-------|----------|-----------|
| Checked | ☑ | All options selected |
| Unchecked | ☐ | No options selected |
| Indeterminate | ☑̶ | Some options selected |

### Expected Outcome
- Functional multi-select dropdown
- Visual tag-based selection display
- Search/filter capability
- Select all functionality
- Accessible keyboard navigation

### Verification Checklist
- [ ] Trigger button displays selected tags
- [ ] Dropdown opens on click
- [ ] Chevron rotates when open/closed
- [ ] Search input filters options
- [ ] Checkbox toggles selection state
- [ ] Selected options show checkmark
- [ ] Tags display with remove button (X)
- [ ] Remove button deselects option
- [ ] Select All toggles all options
- [ ] Indeterminate state shows for partial selection
- [ ] Maximum selection limit enforced
- [ ] Disabled options not clickable
- [ ] Keyboard navigation works (arrows, enter, escape)
- [ ] Outside click closes dropdown
- [ ] Error state displays correctly
- [ ] Accessibility attributes present

---

## Task 47: Create Combobox Component

### Overview
Create an advanced combobox component combining text input with dropdown selection, featuring asynchronous search, autocomplete suggestions, keyboard navigation, and both pre-defined and dynamic options. This component is ideal for searchable dropdowns with large datasets or API-powered suggestions.

### Dependencies
- Base Input component (Task 33)
- Dropdown positioning utilities
- Async data fetching utilities
- Debounce utility
- Icon library (chevron, loading, check icons)
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `Combobox.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Add `options` array prop (for static options)
   - Add `value` prop (selected value or text)
   - Add `onChange` callback with selected value
   - Add `onSearch` async callback for dynamic search
   - Add `placeholder` prop
   - Add `allowCustomValue` boolean prop
   - Add `debounceMs` prop (default 300ms)
   - Add `minSearchChars` prop (default 2)
   - Add `isSearching` boolean prop (loading state)
   - Add `disabled` boolean prop
   - Add `error` string prop

3. **Create input field with dropdown toggle**
   - Build text input for typing/searching
   - Add dropdown chevron button on right side
   - Show selected option label in input
   - Allow typing to filter/search options
   - Toggle dropdown on chevron click

4. **Implement dropdown panel**
   - Position below input field
   - Show filtered options list
   - Add max-height with scroll
   - Highlight matching text in options
   - Display "No results" when empty
   - Show loading state during async search

5. **Add static options filtering**
   - Filter options array based on input text
   - Match against option label and value
   - Case-insensitive search
   - Update filtered list in real-time
   - Show all options when input empty

6. **Implement asynchronous search**
   - Call onSearch callback with query text
   - Debounce search to reduce API calls
   - Show loading spinner during search
   - Update options list with search results
   - Handle search errors gracefully
   - Cancel pending searches on input change

7. **Add minimum search character threshold**
   - Only trigger search after minSearchChars entered
   - Show hint message before threshold met
   - Display all static options when under threshold
   - Allow clearing threshold requirement

8. **Implement keyboard navigation**
   - Arrow Up/Down to navigate options
   - Enter to select highlighted option
   - Escape to close dropdown and clear input
   - Tab to move to next field
   - Type to search/filter options
   - Home/End to jump to first/last option

9. **Add option selection handling**
   - Click option to select
   - Update input value with selected label
   - Close dropdown after selection
   - Trigger onChange callback with value
   - Support both mouse and keyboard selection

10. **Implement custom value support**
    - Allow user to enter value not in options list
    - Enable when allowCustomValue is true
    - Show "Add [value]" option in dropdown
    - Save custom value on Enter or blur
    - Validate custom value format (optional)

11. **Add visual highlighting**
    - Highlight currently focused/hovered option
    - Bold matching text in option labels
    - Show checkmark for selected option
    - Different background for active option
    - Smooth hover transitions

12. **Implement dropdown state management**
    - Track open/closed state
    - Track highlighted option index
    - Track filtered/searched options
    - Track loading state during async search
    - Close on outside click and Escape key

13. **Add visual states and styling**
    - Default state with border
    - Focus state with accent ring
    - Open state with dropdown visible
    - Loading state with spinner
    - Error state with red border
    - Disabled state with muted appearance

14. **Implement accessibility features**
    - Add role="combobox" to input
    - Use aria-expanded for dropdown state
    - Add aria-autocomplete="list"
    - Include aria-activedescendant for highlighted option
    - Announce option count to screen readers
    - Provide clear instructions

### Combobox Interaction Flow

```
User Types → Debounce → Search → Display Results → Select
    │           │          │            │            │
  Filter      Wait      API Call    Show list    Update value
  static      300ms     (async)     highlight    Close dropdown
  options                           options
```

### Combobox UI States

```
Default State:
┌────────────────────────────────┐
│ Select or type...            ⌄ │
└────────────────────────────────┘

Searching State:
┌────────────────────────────────┐
│ appl                         ⌄ │
└────────────────────────────────┘
    ┌────────────────────────────┐
    │ 🔄 Searching...            │
    └────────────────────────────┘

Results State:
┌────────────────────────────────┐
│ appl                         ⌄ │
└────────────────────────────────┘
    ┌────────────────────────────┐
    │ ► Apple MacBook Pro       │
    │   Apple iPhone 13         │
    │   Apple Watch Series 7    │
    └────────────────────────────┘
```

### Search Behavior

| Mode | Options Source | Trigger | Behavior |
|------|---------------|---------|----------|
| Static | options prop | Immediate | Filter local array |
| Async | onSearch callback | After debounce | API request |
| Hybrid | Both | Immediate + async | Filter local first, then fetch |

### Option Highlighting

```
Keyboard Navigation:
┌────────────────────────────────┐
│   Option 1                     │  (normal)
│ ► Option 2  ✓                  │  (highlighted + selected)
│   Option 3                     │  (normal)
│   Option 4                     │  (normal)
└────────────────────────────────┘

Search Match:
┌────────────────────────────────┐
│ **Appl**e MacBook Pro          │  (bold match)
│ **Appl**e iPhone 13            │  (bold match)
│ **Appl**e Watch Series 7       │  (bold match)
└────────────────────────────────┘
```

### Custom Value Handling

```
User types "New Product":
┌────────────────────────────────┐
│ New Product                  ⌄ │
└────────────────────────────────┘
    ┌────────────────────────────┐
    │ No matching results found  │
    │ ► Add "New Product"       │
    └────────────────────────────┘
```

### Expected Outcome
- Functional combobox with search capability
- Support for both static and async options
- Smooth keyboard navigation
- Custom value entry support
- Debounced async search

### Verification Checklist
- [ ] Input field allows typing
- [ ] Dropdown toggles on chevron click
- [ ] Static options filter on typing
- [ ] Async search triggered after debounce delay
- [ ] Loading spinner shows during search
- [ ] Options list displays search results
- [ ] Keyboard navigation works (arrows, enter)
- [ ] Highlighted option changes with arrow keys
- [ ] Enter key selects highlighted option
- [ ] Click selects option
- [ ] Selected option shows checkmark
- [ ] Input updates with selected label
- [ ] Dropdown closes after selection
- [ ] Custom value option appears when allowCustomValue
- [ ] Minimum search characters enforced
- [ ] Outside click closes dropdown
- [ ] Escape key closes dropdown
- [ ] Error state displays correctly
- [ ] Disabled state renders correctly
- [ ] Accessibility attributes present

---

## Task 48: Create NumberInput Component

### Overview
Create a specialized number input component with increment/decrement buttons, step control, min/max validation, decimal support, and formatted number display. This component provides an intuitive interface for numeric data entry with visual controls for precise adjustments.

### Dependencies
- Base Input component (Task 33)
- Icon library (plus, minus, chevron icons)
- Number formatting utilities
- Tailwind CSS for styling

### Instructions

1. **Create component file structure**
   - Create `NumberInput.tsx` in form components directory
   - Set up TypeScript component with proper typing
   - Define comprehensive props interface

2. **Define component props interface**
   - Add `value` prop (number or null)
   - Add `onChange` callback with number value
   - Add `min` prop for minimum value
   - Add `max` prop for maximum value
   - Add `step` prop (default 1)
   - Add `decimals` prop for decimal places (default 0)
   - Add `showButtons` boolean prop (default true)
   - Add `showSpinner` boolean prop (alternative style)
   - Add `formatDisplay` boolean prop
   - Add `prefix` and `suffix` props (e.g., "$", "kg")
   - Add `disabled` boolean prop
   - Add `error` string prop

3. **Create input field with controls**
   - Build number input field (type="number" or type="text")
   - Add increment button on right side
   - Add decrement button on right side
   - Style buttons as compact controls
   - Align buttons vertically stacked or horizontally

4. **Implement increment button**
   - Add plus icon or up arrow
   - Increase value by step amount on click
   - Respect max value limit
   - Disable when value reaches max
   - Support keyboard (Up arrow)
   - Hold to repeat increment (optional)

5. **Implement decrement button**
   - Add minus icon or down arrow
   - Decrease value by step amount on click
   - Respect min value limit
   - Disable when value reaches min
   - Support keyboard (Down arrow)
   - Hold to repeat decrement (optional)

6. **Add min/max validation**
   - Validate value against min prop
   - Validate value against max prop
   - Show error message if out of range
   - Prevent manual entry beyond limits
   - Clamp value to range on blur

7. **Implement step control**
   - Increment/decrement by step amount
   - Support decimal steps (e.g., 0.1, 0.5)
   - Snap value to step increments
   - Allow manual entry of any valid number
   - Round to nearest step on blur (optional)

8. **Add decimal places support**
   - Format display to specified decimal places
   - Allow entry of decimal numbers
   - Round to decimals on blur
   - Show trailing zeros (e.g., "1.50" vs "1.5")
   - Validate decimal precision

9. **Implement number formatting**
   - Add thousands separator (e.g., "1,000")
   - Format based on locale (optional)
   - Show prefix/suffix (e.g., "$100", "50kg")
   - Preserve formatting during editing
   - Parse formatted value correctly

10. **Add keyboard support**
    - Up Arrow to increment
    - Down Arrow to decrement
    - Page Up to increment by large step (10x)
    - Page Down to decrement by large step (10x)
    - Home to jump to min value
    - End to jump to max value

11. **Implement button repeat functionality**
    - Hold mouse down on button to repeat action
    - Start slow, accelerate after delay
    - Stop on mouse up or leave
    - Provide smooth value changes

12. **Add visual states and styling**
    - Default state with subtle border
    - Focus state with accent ring
    - Hover state on buttons
    - Active state when pressing buttons
    - Disabled state with muted appearance
    - Error state with red border

13. **Implement accessibility features**
    - Add role="spinbutton" to input
    - Include aria-valuemin and aria-valuemax
    - Add aria-valuenow for current value
    - Support keyboard navigation
    - Announce value changes to screen readers

### NumberInput UI Layout

```
Horizontal Buttons:
┌────────────────────────────────┐
│  [-]  100  [+]                 │
└────────────────────────────────┘

Vertical Buttons (Spinner):
┌────────────────────────────┐
│  100                    [▲]│
│                         [▼]│
└────────────────────────────┘

With Prefix/Suffix:
┌────────────────────────────────┐
│  $ [-]  1,250.00  [+]          │
└────────────────────────────────┘
```

### Step Behavior

| Step Value | Increment Example | Use Case |
|------------|-------------------|----------|
| 1 | 0 → 1 → 2 → 3 | Whole numbers, quantities |
| 0.1 | 0.0 → 0.1 → 0.2 | Decimals, percentages |
| 0.5 | 0.0 → 0.5 → 1.0 | Half increments |
| 5 | 0 → 5 → 10 → 15 | Multiples of 5 |
| 10 | 0 → 10 → 20 → 30 | Multiples of 10 |

### Min/Max Validation

```
Range: 0 to 100, Step: 1

Value: -5   → Error: "Minimum value is 0"
Value: 0    → Valid (at minimum)
Value: 50   → Valid (within range)
Value: 100  → Valid (at maximum)
Value: 105  → Error: "Maximum value is 100"
```

### Button States

| State | Condition | Visual | Behavior |
|-------|-----------|--------|----------|
| Enabled | Value within range | Normal color | Click to increment/decrement |
| Disabled | Value at min/max | Muted, grayed out | No action on click |
| Hover | Mouse over button | Highlight background | Ready to click |
| Active | Mouse pressed | Darker background | Value changing |

### Keyboard Shortcuts

| Key | Action | Modifier | Effect |
|-----|--------|----------|--------|
| ↑ | Increment | None | +1 step |
| ↓ | Decrement | None | -1 step |
| Page Up | Large increment | None | +10 steps |
| Page Down | Large decrement | None | -10 steps |
| Home | Jump to min | None | Set to min value |
| End | Jump to max | None | Set to max value |

### Expected Outcome
- Intuitive number input with visual controls
- Precise increment/decrement functionality
- Min/max validation and enforcement
- Support for decimals and formatting
- Accessible keyboard controls

### Verification Checklist
- [ ] Number input field displays correctly
- [ ] Increment button increases value by step
- [ ] Decrement button decreases value by step
- [ ] Min value prevents further decrease
- [ ] Max value prevents further increase
- [ ] Buttons disable at min/max limits
- [ ] Step value applies correctly
- [ ] Decimal places formatted correctly
- [ ] Prefix/suffix display correctly
- [ ] Thousands separator works (if enabled)
- [ ] Keyboard shortcuts work (arrows, page up/down)
- [ ] Manual entry validates against min/max
- [ ] Hold button repeats action
- [ ] Focus state styled correctly
- [ ] Error state displays correctly
- [ ] Disabled state renders properly
- [ ] Accessibility attributes present (role, aria-*)

---

## Summary

This document covered the implementation of eight specialized input components that enhance data entry for specific use cases:

| Component | Primary Use | Key Features |
|-----------|-------------|--------------|
| PhoneInput | Sri Lankan phone numbers | +94 prefix, auto-hyphen, mobile validation |
| SearchInput | Search functionality | Debounce, loading state, keyboard shortcut |
| PasswordInput | Secure password entry | Show/hide toggle, strength indicator |
| FileUpload | Document uploads | Drag-drop, validation, progress, multi-file |
| ImageUpload | Image uploads | Crop, aspect ratio, preview, optimization |
| MultiSelect | Multiple selections | Tags, search, select all |
| Combobox | Searchable dropdown | Async search, autocomplete, custom values |
| NumberInput | Numeric entry | Increment/decrement, min/max, formatting |

These components complete the specialized input layer of the form component library, providing powerful tools for complex data entry scenarios throughout the ERP system.

---

**End of Document**
