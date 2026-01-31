# Tasks 51-60: Logo & Banner Management

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** D - Logo & Images  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-61-66_Optimize-Apply-Verify.md](02_Tasks-61-66_Optimize-Apply-Verify.md)

---

## Document Overview

This document covers the creation of logo and banner image management systems for the webstore theme engine. It includes logo upload functionality with preview and size controls, favicon and mobile logo options, banner section creation, hero image uploads, and text overlay configuration. These features allow store owners to customize their brand identity and homepage hero sections.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Logo Section | Low | 30 min |
| 52 | Create Logo Upload | Medium | 45 min |
| 53 | Create Logo Preview | Low | 25 min |
| 54 | Create Logo Size Control | Low | 30 min |
| 55 | Create Logo Alt Text | Low | 20 min |
| 56 | Create Favicon Upload | Medium | 40 min |
| 57 | Create Mobile Logo | Low | 30 min |
| 58 | Create Banner Section | Low | 30 min |
| 59 | Create Hero Image Upload | Medium | 45 min |
| 60 | Create Hero Text Overlay | Medium | 40 min |

---

## Task 51: Create Logo Section

### Overview
Create the logo management section within the theme customization panel. This section serves as the container for all logo-related settings including main logo, favicon, and mobile logo options. It provides organized access to brand identity controls.

### Dependencies
- Task 50: Create Image Management Tab (from previous group)
- Theme customization panel structure exists
- File upload infrastructure available

### Instructions

1. **Create Logo Settings component directory**
   - Navigate to `frontend/components/storefront/theme/` directory
   - Create new directory named `Logo`
   - This will house all logo-related components

2. **Create LogoSettings parent component**
   - Create `LogoSettings.tsx` file in `Logo/` directory
   - Set up React functional component structure
   - This component will orchestrate all logo sub-components

3. **Define logo settings data structure**
   - Create TypeScript interface for logo settings
   - Include fields: mainLogo, favicon, mobileLogo, logoHeight, logoAlt
   - Define file metadata structure (url, filename, size)

4. **Implement section layout**
   - Create collapsible or tabbed section header
   - Title: "Logo Settings"
   - Description: "Manage your store's logo, favicon, and mobile branding"

5. **Add section organization**
   - Create subsections for different logo types
   - Main Logo subsection
   - Favicon subsection
   - Mobile Logo subsection (optional)

6. **Implement state management**
   - Use React state or form context for logo data
   - Initialize with existing theme values if available
   - Prepare for save/update operations

7. **Add section visibility controls**
   - Allow collapse/expand functionality
   - Show badge with "configured" status if logo exists
   - Provide reset to defaults option

### Logo Settings Structure

```
┌─────────────────────────────────────────┐
│  Logo Settings                      [▼] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─── Main Logo ────────────────────┐  │
│  │  - Upload                         │  │
│  │  - Preview                        │  │
│  │  - Size Control                   │  │
│  │  - Alt Text                       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─── Favicon ───────────────────────┐ │
│  │  - Upload                         │  │
│  │  - Preview                        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─── Mobile Logo (Optional) ────────┐ │
│  │  - Upload                         │  │
│  │  - Preview                        │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Logo Settings Data Model

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| mainLogo | File/URL | Yes | null | Primary store logo |
| logoHeight | number | No | 60 | Logo height in pixels |
| logoAlt | string | No | "Store Logo" | Alt text for accessibility |
| favicon | File/URL | No | null | Browser favicon |
| mobileLogo | File/URL | No | null | Optional mobile logo |

### Section Features

| Feature | Implementation |
|---------|----------------|
| Collapsible | Click to expand/collapse |
| Status Indicator | Badge showing configured state |
| Preview Thumbnails | Small previews of uploaded images |
| Quick Actions | Clear all, reset to defaults |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| themeId | string | Yes | Current theme identifier |
| initialSettings | LogoSettings | No | Existing logo configuration |
| onSave | Function | Yes | Callback for saving changes |
| onCancel | Function | No | Callback for canceling edits |

### Expected Outcome
- Organized logo settings section in theme panel
- Clear visual hierarchy for different logo types
- Foundation for logo upload and configuration components
- Proper state management for logo data

### Verification Checklist
- [ ] LogoSettings component created in correct directory
- [ ] Section header with title and description
- [ ] Subsections for main logo, favicon, mobile logo
- [ ] Data structure defined with TypeScript interfaces
- [ ] State management implemented
- [ ] Component exports properly
- [ ] Integrates with theme customization panel

---

## Task 52: Create Logo Upload

### Overview
Create the logo upload functionality that allows users to select and upload image files for their store logo. This component handles file selection, validation, client-side preview, and server upload with progress tracking.

### Dependencies
- Task 51: Create Logo Section

### Instructions

1. **Create LogoUpload component**
   - Create `LogoUpload.tsx` file in `Logo/` directory
   - Set up as reusable upload component
   - Accept configuration for different logo types

2. **Implement file input interface**
   - Create hidden file input element
   - Create styled upload button or dropzone
   - Use click handler to trigger file input
   - Support drag-and-drop functionality

3. **Add file type validation**
   - Accept: PNG, JPG, JPEG, SVG
   - Validate file extension and MIME type
   - Show error message for invalid formats

4. **Add file size validation**
   - Maximum size: 2MB for logos
   - Check file size before upload
   - Display error if size exceeds limit

5. **Implement image dimension validation**
   - Recommended minimum: 200x50px
   - Check dimensions using Image object
   - Warn if dimensions are too small

6. **Create client-side preview**
   - Generate preview using FileReader API
   - Display preview thumbnail immediately
   - Show filename and file size

7. **Implement upload functionality**
   - Create FormData with file
   - Send POST request to upload endpoint
   - Include tenant context and logo type metadata

8. **Add upload progress indicator**
   - Track upload progress percentage
   - Display progress bar during upload
   - Show success/error status after completion

9. **Handle upload response**
   - Receive uploaded file URL from server
   - Store URL in component state
   - Trigger parent component callback with new URL

10. **Add replace/remove functionality**
    - Show "Replace" button if logo exists
    - Add "Remove" button to clear logo
    - Confirm before removing existing logo

### File Upload Flow

```
User Action
    │
    ▼
File Selection (Input/Drag-Drop)
    │
    ├─── Validate Type ───┐
    │                     │
    ├─── Validate Size ───┤
    │                     │
    ├─── Validate Dims ───┤
    │                     │
    ▼                     ▼
Preview Generation    Error Display
    │
    ▼
Upload to Server (with Progress)
    │
    ├─── Success ─────┐
    │                 │
    ▼                 ▼
Store URL         Error Message
    │
    ▼
Update Parent State
    │
    ▼
Display Uploaded Logo
```

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| File Type | PNG, JPG, JPEG, SVG | "Please upload PNG, JPG, or SVG file" |
| File Size | Max 2MB | "File must be smaller than 2MB" |
| Dimensions | Min 200x50px | "Logo should be at least 200x50 pixels" |
| File Exists | Required field | "Please select a file to upload" |

### Upload Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| logoType | "main" \| "favicon" \| "mobile" | Yes | Type of logo being uploaded |
| currentUrl | string | No | Existing logo URL if any |
| onUploadComplete | Function | Yes | Callback with uploaded URL |
| maxSizeMB | number | No | Max file size (default 2) |
| acceptedFormats | string[] | No | Accepted file formats |

### Upload States

| State | UI Display |
|-------|------------|
| Idle | "Choose File" button or drop zone |
| Validating | Loading spinner |
| Uploading | Progress bar with percentage |
| Success | Green checkmark + preview |
| Error | Red error message |

### Upload Endpoint Specification

| Property | Value |
|----------|-------|
| Method | POST |
| Path | `/api/theme/logo/upload` |
| Content-Type | multipart/form-data |
| Body | file, logoType, tenantId |
| Response | { success, url, filename } |

### Error Handling

| Error Type | Handling |
|------------|----------|
| Invalid Format | Show inline error, prevent upload |
| File Too Large | Show size error, prevent upload |
| Network Error | Show retry button, log error |
| Server Error | Display error message, allow retry |

### Expected Outcome
- Functional file upload component with validation
- Client-side preview before upload
- Progress tracking during upload
- Error handling for common issues
- Success state with uploaded URL

### Verification Checklist
- [ ] LogoUpload component created
- [ ] File input with styled trigger button
- [ ] Drag-and-drop functionality working
- [ ] File type validation implemented
- [ ] File size validation implemented
- [ ] Client-side preview displays correctly
- [ ] Upload progress indicator shows
- [ ] Upload endpoint integration complete
- [ ] Error messages display appropriately
- [ ] Replace and remove buttons functional
- [ ] Callback to parent component works

---

## Task 53: Create Logo Preview

### Overview
Create the logo preview component that displays the uploaded logo image with proper styling and aspect ratio. This component shows how the logo will appear in the store header, allowing users to verify their upload before applying changes.

### Dependencies
- Task 52: Create Logo Upload

### Instructions

1. **Create LogoPreview component**
   - Create `LogoPreview.tsx` file in `Logo/` directory
   - Accept logo URL and display settings as props
   - Set up responsive image display

2. **Implement image display**
   - Use Next.js Image component or img tag
   - Load image from provided URL
   - Handle loading state with skeleton

3. **Add aspect ratio preservation**
   - Maintain original image aspect ratio
   - Use CSS object-fit: contain
   - Prevent image distortion

4. **Create preview container styling**
   - Add border to define preview area
   - Use background pattern (checkerboard) for transparency
   - Set fixed or constrained dimensions

5. **Implement size preview**
   - Apply configured logo height setting
   - Calculate width automatically based on aspect ratio
   - Show actual pixel dimensions below preview

6. **Add context preview (optional)**
   - Show logo in simulated header context
   - Display with background color settings
   - Demonstrate how logo appears in use

7. **Handle error states**
   - Display placeholder if image fails to load
   - Show broken image icon with error message
   - Provide retry or re-upload option

8. **Add preview controls**
   - Zoom in/out controls for detailed view
   - Toggle between actual size and fit-to-container
   - Background color switcher to test contrast

9. **Implement loading state**
   - Show skeleton loader while image loads
   - Display spinner or progress indicator
   - Smooth transition to loaded state

### Preview Component Structure

```
┌─────────────────────────────────────┐
│  Logo Preview                       │
├─────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  ░░░ Background Pattern ░░░  │  │
│  │  ░                        ░  │  │
│  │  ░   ┌──────────────┐    ░  │  │
│  │  ░   │ [Store Logo] │    ░  │  │
│  │  ░   └──────────────┘    ░  │  │
│  │  ░                        ░  │  │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  └──────────────────────────────┘  │
│                                     │
│  Dimensions: 180 x 60 px            │
│  Format: PNG                        │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| imageUrl | string | Yes | URL of logo to preview |
| logoHeight | number | No | Height in pixels |
| alt | string | No | Alt text for image |
| showDimensions | boolean | No | Display size info |
| containerHeight | number | No | Preview container height |

### Preview Container Styling

| Style Property | Value | Purpose |
|----------------|-------|---------|
| Border | 1px solid gray-300 | Define boundaries |
| Border Radius | 8px | Rounded corners |
| Background | Checkerboard pattern | Show transparency |
| Padding | 20px | Spacing around logo |
| Min Height | 120px | Ensure visibility |

### Preview States

| State | Display |
|-------|---------|
| Loading | Skeleton or spinner |
| Loaded | Logo image with dimensions |
| Error | Broken image icon + message |
| Empty | "No logo uploaded" placeholder |

### Image Loading Strategy

```
Component Mount
    │
    ▼
Show Loading Skeleton
    │
    ▼
Load Image (with src URL)
    │
    ├─── onLoad ──────┐
    │                 │
    ▼                 ▼
Hide Skeleton    Show Error
    │
    ▼
Display Logo + Info
```

### Background Pattern Options

| Pattern | Use Case |
|---------|----------|
| Checkerboard | Show PNG transparency |
| Solid White | Standard preview |
| Solid Dark | Test logo on dark theme |
| Brand Color | Preview in header context |

### Information Display

| Information | Format | Example |
|-------------|--------|---------|
| Dimensions | Width x Height px | "180 x 60 px" |
| File Format | Extension | "PNG" |
| File Size | KB or MB | "84 KB" |
| Aspect Ratio | W:H | "3:1" |

### Expected Outcome
- Clear preview of uploaded logo
- Accurate representation of final appearance
- Dimension and format information displayed
- Proper handling of loading and error states
- Responsive preview that adapts to container

### Verification Checklist
- [ ] LogoPreview component created
- [ ] Image displays with correct aspect ratio
- [ ] Loading state shows skeleton/spinner
- [ ] Error state displays properly
- [ ] Dimensions and format info shown
- [ ] Background pattern implemented
- [ ] Preview updates when logo changes
- [ ] Responsive to container size changes
- [ ] Component exports properly

---

## Task 54: Create Logo Size Control

### Overview
Create an interactive control that allows users to adjust the logo height. This component provides a slider or input field to set the logo size, with real-time preview updates showing how the logo will appear at different sizes.

### Dependencies
- Task 51: Create Logo Section
- Task 53: Create Logo Preview

### Instructions

1. **Create LogoSizeControl component**
   - Create `LogoSizeControl.tsx` file in `Logo/` directory
   - Set up as controlled input component
   - Accept current size and onChange callback

2. **Implement size input interface**
   - Create range slider for visual adjustment
   - Add number input for precise value entry
   - Sync slider and input values bidirectionally

3. **Define size constraints**
   - Minimum size: 40px (mobile-friendly minimum)
   - Maximum size: 100px (reasonable header limit)
   - Default size: 60px (standard logo height)
   - Step increment: 5px for slider

4. **Add size presets**
   - Small: 40px
   - Medium: 60px
   - Large: 80px
   - Extra Large: 100px
   - Quick-select buttons for presets

5. **Implement real-time preview**
   - Update logo preview as slider moves
   - Debounce updates to optimize performance
   - Show pixel value next to slider

6. **Create visual feedback**
   - Display current size value prominently
   - Show size comparison markers
   - Highlight selected preset if applicable

7. **Add responsive behavior**
   - Note that size applies to desktop view
   - Mobile logo may scale differently
   - Show information tooltip about responsiveness

8. **Handle edge cases**
   - Prevent values outside min/max range
   - Validate numeric input
   - Default to safe value if invalid

### Size Control Layout

```
┌──────────────────────────────────────┐
│  Logo Size                           │
├──────────────────────────────────────┤
│                                      │
│  [S] [M] [L] [XL]  ← Presets        │
│                                      │
│  40 ●━━━━━●━━━━━━━━━━━━━━━━━ 100   │
│     ↑      ↑                         │
│     Min    Current (60px)    Max     │
│                                      │
│  Height: [60] px                     │
│                                      │
└──────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | number | Yes | Current logo height |
| onChange | Function | Yes | Callback when size changes |
| min | number | No | Minimum size (default 40) |
| max | number | No | Maximum size (default 100) |
| step | number | No | Slider step (default 5) |
| disabled | boolean | No | Disable control |

### Size Presets Configuration

| Preset | Size | Label | Use Case |
|--------|------|-------|----------|
| Small | 40px | S | Compact header |
| Medium | 60px | M | Standard header |
| Large | 80px | L | Prominent branding |
| Extra Large | 100px | XL | Hero-style header |

### Size Constraints

| Constraint | Value | Reason |
|------------|-------|--------|
| Minimum | 40px | Maintains mobile readability |
| Maximum | 100px | Prevents oversized logos |
| Default | 60px | Industry standard |
| Step | 5px | Granular control |

### Control Components

| Element | Type | Purpose |
|---------|------|---------|
| Preset Buttons | Button Group | Quick size selection |
| Range Slider | Input Range | Visual adjustment |
| Number Input | Input Number | Precise value entry |
| Value Display | Text | Show current size |

### Size Calculation Logic

```
Logo Height Set
    │
    ▼
Calculate Width (maintain aspect ratio)
    │
    ▼
Update Preview Component
    │
    ▼
Apply to Theme Settings
    │
    ▼
Save to Database (on form submit)
```

### Responsiveness Notes

| Screen Size | Logo Behavior |
|-------------|---------------|
| Desktop | Uses configured height |
| Tablet | May scale to 80% of desktop |
| Mobile | Typically 50-70% of desktop |
| Auto-scaling | CSS media queries handle sizing |

### Expected Outcome
- Interactive slider for logo size adjustment
- Preset buttons for common sizes
- Real-time preview updates
- Constrained values within safe range
- Clear indication of current size

### Verification Checklist
- [ ] LogoSizeControl component created
- [ ] Range slider functional
- [ ] Number input synced with slider
- [ ] Size presets buttons working
- [ ] Min/max constraints enforced
- [ ] Preview updates in real-time
- [ ] Current value displayed clearly
- [ ] onChange callback triggers correctly
- [ ] Component exports properly

---

## Task 55: Create Logo Alt Text

### Overview
Create an input field for specifying alternative text for the logo image. This component ensures accessibility compliance by allowing users to provide descriptive text that screen readers will announce to visually impaired users.

### Dependencies
- Task 51: Create Logo Section

### Instructions

1. **Create LogoAltText component**
   - Create separate component file or integrate into LogoSettings
   - Set up as controlled text input
   - Accept current value and onChange callback

2. **Implement text input field**
   - Create standard text input element
   - Label: "Logo Alt Text" or "Alternative Text"
   - Placeholder: "e.g., Your Store Name Logo"

3. **Add character limit**
   - Maximum length: 125 characters (accessibility best practice)
   - Display character counter below input
   - Show remaining characters

4. **Provide default value**
   - If empty, suggest store name + " Logo"
   - Automatically populate from store settings
   - Allow user to override default

5. **Add helper text**
   - Explain purpose of alt text
   - Provide examples of good alt text
   - Link to accessibility guidelines

6. **Implement validation**
   - Warn if alt text is too short (< 5 characters)
   - Suggest including "logo" or brand name
   - Flag generic text like "image" or "logo"

7. **Show preview of alt text usage**
   - Display how screen reader would announce it
   - Show alt text in image tooltip
   - Demonstrate accessibility impact

### Alt Text Input Structure

```
┌──────────────────────────────────────┐
│  Logo Alt Text                       │
├──────────────────────────────────────┤
│  Alternative text for accessibility  │
│  (announced by screen readers)       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ MyStore Logo                   │ │
│  └────────────────────────────────┘ │
│                                      │
│  13 / 125 characters                 │
│                                      │
│  ℹ️ Good examples:                   │
│  • "MyStore Logo"                    │
│  • "MyStore - Premium Products"      │
│  • "MyStore Home"                    │
└──────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| value | string | Yes | Current alt text |
| onChange | Function | Yes | Callback when text changes |
| storeName | string | No | Store name for default |
| maxLength | number | No | Max characters (default 125) |
| required | boolean | No | Whether field is required |

### Alt Text Best Practices

| Good Alt Text | Poor Alt Text | Reason |
|---------------|---------------|---------|
| "Acme Store Logo" | "image" | Too generic |
| "TechMart Home" | "logo" | Not descriptive |
| "Fashion Hub" | "company logo image" | Too verbose |
| "GreenLeaf Organics" | "click here" | Not image description |

### Character Limits

| Limit | Value | Purpose |
|-------|-------|---------|
| Minimum Suggested | 5 chars | Meaningful description |
| Maximum Allowed | 125 chars | Screen reader brevity |
| Optimal Range | 20-60 chars | Clear, concise description |

### Validation Rules

| Rule | Message |
|------|---------|
| Empty | "Alt text is recommended for accessibility" |
| Too Short | "Alt text should be more descriptive" |
| Generic | "Consider including your brand name" |
| Too Long | "Alt text should be under 125 characters" |

### Helper Text Guidelines

Include information about:
- Purpose: Helps visually impaired users understand image content
- Best practices: Use descriptive, concise text
- What to include: Brand name and context
- What to avoid: "Image of", "picture of", overly detailed descriptions

### Default Value Logic

```
Check if custom alt text exists
    │
    ├─── Yes ────> Use custom value
    │
    └─── No ─────> Generate default
                        │
                        ├─── Use store name
                        │
                        └─── Append "Logo"
```

### Accessibility Impact

| Scenario | Experience Without Alt Text | Experience With Alt Text |
|----------|------------------------------|--------------------------|
| Screen Reader | "Image" or URL announced | "MyStore Logo" announced |
| Image Broken | No information shown | Alt text displayed |
| SEO | Missed opportunity | Image indexed properly |

### Expected Outcome
- Text input for alt text configuration
- Character counter and validation
- Default value based on store name
- Helper text explaining best practices
- Real-time validation feedback

### Verification Checklist
- [ ] Alt text input field created
- [ ] Character counter displays correctly
- [ ] Maximum length enforced (125 chars)
- [ ] Default value generated from store name
- [ ] Helper text with examples provided
- [ ] Validation warnings show appropriately
- [ ] onChange callback works correctly
- [ ] Integration with logo settings complete

---

## Task 56: Create Favicon Upload

### Overview
Create a specialized upload component for favicon images. Favicons are small icons displayed in browser tabs and bookmarks, requiring specific size and format considerations. This component handles favicon upload with appropriate validation and preview.

### Dependencies
- Task 51: Create Logo Section
- Task 52: Create Logo Upload (can reuse logic)

### Instructions

1. **Create FaviconUpload component**
   - Create `FaviconUpload.tsx` file in `Logo/` directory
   - Extend or reuse LogoUpload component logic
   - Customize for favicon-specific requirements

2. **Implement favicon file validation**
   - Accept: ICO, PNG (32x32, 64x64, 192x192)
   - Validate file format
   - Check image dimensions

3. **Add dimension requirements**
   - Recommended sizes: 16x16, 32x32, 64x64
   - Optimal size: 32x32 for best compatibility
   - Support 192x192 for high-DPI displays

4. **Create favicon preview**
   - Show preview at actual size (16x16 or 32x32)
   - Display in simulated browser tab context
   - Show on both light and dark backgrounds

5. **Implement multi-size generation**
   - Generate multiple sizes from uploaded image
   - Create 16x16, 32x32, and 192x192 versions
   - Use server-side processing or client library

6. **Add favicon format conversion**
   - Accept PNG uploads
   - Optionally convert to ICO format on server
   - Store both formats for compatibility

7. **Create browser tab preview**
   - Simulate browser tab with favicon
   - Show how favicon appears in actual use
   - Include browser UI elements for context

8. **Handle favicon deployment**
   - Upload to public directory or CDN
   - Update HTML meta tags with new favicon URL
   - Clear browser cache with version query string

### Favicon Sizes Guide

| Size | Use Case | Priority |
|------|----------|----------|
| 16x16 | Browser tabs (standard) | Medium |
| 32x32 | Browser tabs (high-DPI) | High |
| 64x64 | Windows taskbar | Low |
| 192x192 | Android home screen | Medium |
| 512x512 | iOS home screen | Medium |

### File Format Support

| Format | Compatibility | Recommendation |
|--------|---------------|----------------|
| ICO | All browsers | Best for multi-size |
| PNG | Modern browsers | Simpler format |
| SVG | Limited support | Not recommended |
| GIF | Older browsers | Not recommended |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| currentFavicon | string | No | Current favicon URL |
| onUploadComplete | Function | Yes | Callback with new URL |
| autoGenerate | boolean | No | Generate multiple sizes |

### Validation Rules

| Rule | Requirement | Error Message |
|------|-------------|---------------|
| Format | PNG or ICO | "Favicon must be PNG or ICO format" |
| Size | Square dimensions | "Favicon must be square (same width and height)" |
| Dimensions | 16x16 to 512x512 | "Favicon size should be 32x32 or 192x192 pixels" |
| File Size | Max 100KB | "Favicon must be smaller than 100KB" |

### Upload and Processing Flow

```
User Uploads Favicon
    │
    ▼
Validate Format (PNG/ICO)
    │
    ▼
Check Dimensions (Square)
    │
    ▼
Generate Multiple Sizes
    ├── 16x16
    ├── 32x32
    ├── 64x64
    └── 192x192
    │
    ▼
Upload All Sizes to Server
    │
    ▼
Update HTML <link rel="icon">
    │
    ▼
Clear Browser Cache (add ?v=timestamp)
    │
    ▼
Show Preview in Browser Tab Context
```

### Browser Tab Preview

```
┌─────────────────────────────────┐
│  [🔍] [*] MyStore  │ □ ⊗        │  ← Browser Tab
└─────────────────────────────────┘
     ↑
  Favicon Preview
```

### HTML Meta Tags to Update

| Tag | Purpose |
|-----|---------|
| `<link rel="icon">` | Standard favicon |
| `<link rel="apple-touch-icon">` | iOS home screen |
| `<link rel="manifest">` | PWA manifest icons |
| `<meta name="msapplication-TileImage">` | Windows tiles |

### Storage Strategy

| Storage | File Naming | Example |
|---------|-------------|---------|
| S3/CDN | `/favicons/{tenantId}/favicon-{size}.png` | `favicon-32x32.png` |
| Version | Add timestamp or hash | `favicon.png?v=1642335600` |
| Cache | Long expiry with version | Cache 1 year, bust with query param |

### Expected Outcome
- Specialized favicon upload component
- Validation for square dimensions
- Multi-size generation capability
- Preview in browser tab context
- Proper HTML meta tag updates

### Verification Checklist
- [ ] FaviconUpload component created
- [ ] File format validation (ICO, PNG)
- [ ] Dimension validation (square images)
- [ ] Size validation (appropriate dimensions)
- [ ] Multi-size generation implemented
- [ ] Browser tab preview displays
- [ ] Upload to server successful
- [ ] HTML meta tags updated
- [ ] Cache busting query parameter added
- [ ] Preview shows on light and dark backgrounds

---

## Task 57: Create Mobile Logo

### Overview
Create an optional mobile logo upload and configuration feature. This allows store owners to upload a different, typically smaller or simpler logo specifically for mobile devices, optimizing for smaller screens and touch interfaces.

### Dependencies
- Task 51: Create Logo Section
- Task 52: Create Logo Upload

### Instructions

1. **Create MobileLogo component section**
   - Add to LogoSettings as optional section
   - Include toggle to enable/disable mobile logo
   - Show description of mobile logo purpose

2. **Add enable/disable toggle**
   - Checkbox or switch: "Use different logo on mobile"
   - When disabled, use main logo on all devices
   - When enabled, show mobile logo upload

3. **Implement mobile logo upload**
   - Reuse LogoUpload component
   - Pass "mobile" as logoType
   - Configure for smaller recommended dimensions

4. **Add mobile-specific guidance**
   - Recommend simpler design for mobile
   - Suggest smaller file size
   - Recommend square or compact aspect ratio

5. **Create mobile preview**
   - Show preview in mobile screen mockup
   - Display at actual mobile size
   - Simulate mobile header context

6. **Configure mobile dimensions**
   - Recommended height: 40-50px
   - Recommended aspect ratio: 1:1 or 2:1
   - Maximum width: 200px

7. **Add responsive behavior notes**
   - Explain breakpoint where mobile logo appears
   - Typical breakpoint: < 768px
   - Show media query threshold

8. **Implement fallback logic**
   - If no mobile logo, use main logo
   - Scale main logo appropriately
   - Ensure consistent branding

### Mobile Logo Purpose

| Reason | Benefit |
|--------|---------|
| Simpler Design | Easier to read on small screens |
| Compact Size | Fits better in mobile header |
| Faster Loading | Smaller file size for mobile networks |
| Icon-Only | Use logomark without text |

### Mobile Logo Toggle

```
┌──────────────────────────────────────┐
│  Mobile Logo (Optional)              │
├──────────────────────────────────────┤
│                                      │
│  [✓] Use different logo on mobile   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Upload Mobile Logo            │ │
│  │  [Choose File]                 │ │
│  └────────────────────────────────┘ │
│                                      │
│  Mobile screens use a simplified    │
│  version of your logo that works    │
│  better on smaller displays.        │
└──────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| enabled | boolean | Yes | Whether mobile logo is enabled |
| onToggle | Function | Yes | Callback for enable/disable |
| mobileLogoUrl | string | No | Current mobile logo URL |
| onUpload | Function | Yes | Callback when mobile logo uploaded |

### Mobile Logo Specifications

| Property | Desktop Logo | Mobile Logo |
|----------|--------------|-------------|
| Height | 60-80px | 40-50px |
| Width | Variable | Max 200px |
| Aspect Ratio | 3:1 typical | 1:1 or 2:1 |
| File Size | < 2MB | < 500KB |
| Design | Full logo | Icon/simplified |

### Mobile Preview Mockup

```
┌──────────────────┐
│ ☰  [Logo] [🔍][🛒]│  ← Mobile Header (< 768px)
├──────────────────┤
│                  │
│   Page Content   │
│                  │
└──────────────────┘
```

### Responsive Breakpoint Configuration

| Breakpoint | Logo Used | Typical Screen |
|------------|-----------|----------------|
| ≥ 1024px | Desktop (main) | Desktop monitors |
| 768px - 1023px | Desktop or mobile | Tablets |
| < 768px | Mobile (if set) | Mobile phones |

### Fallback Logic

```
Check if mobile logo enabled
    │
    ├─── Yes ────> Check if mobile logo uploaded
    │                  │
    │                  ├─── Yes ────> Use mobile logo
    │                  │
    │                  └─── No ─────> Use main logo (scaled)
    │
    └─── No ─────> Use main logo on all devices
```

### Mobile Logo Design Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Simplicity | Remove taglines, use icon only |
| Contrast | Ensure visibility on mobile |
| Size | Optimized for mobile networks |
| Format | PNG with transparency preferred |

### CSS Implementation Strategy

```css
/* Example media query approach */
.site-logo-desktop {
  display: block;
}
.site-logo-mobile {
  display: none;
}

@media (max-width: 767px) {
  .site-logo-desktop {
    display: none;
  }
  .site-logo-mobile {
    display: block;
  }
}
```

### Expected Outcome
- Optional mobile logo configuration
- Enable/disable toggle
- Mobile logo upload functionality
- Mobile preview in context
- Fallback to main logo if not set
- Responsive breakpoint documentation

### Verification Checklist
- [ ] Mobile logo section added to LogoSettings
- [ ] Enable/disable toggle working
- [ ] Mobile logo upload functional
- [ ] Mobile preview displays correctly
- [ ] Recommended dimensions documented
- [ ] Fallback to main logo working
- [ ] Responsive breakpoint configured
- [ ] Media queries implemented
- [ ] File size optimized for mobile

---

## Task 58: Create Banner Section

### Overview
Create the banner management section for homepage hero images and promotional banners. This section provides organized access to hero image configuration including image upload, text overlays, and call-to-action buttons.

### Dependencies
- Task 51: Create Logo Section (similar structure)
- Theme customization panel infrastructure

### Instructions

1. **Create Banner component directory**
   - Navigate to `frontend/components/storefront/theme/` directory
   - Create new directory named `Banner`
   - This will house banner-related components

2. **Create BannerSettings parent component**
   - Create `BannerSettings.tsx` file in `Banner/` directory
   - Set up component structure similar to LogoSettings
   - This orchestrates all banner sub-components

3. **Define banner settings data structure**
   - Create TypeScript interface for banner configuration
   - Include: heroImage, heroTitle, heroSubtitle, heroTextPosition, heroCTA
   - Define overlay settings: text color, background overlay, opacity

4. **Implement section layout**
   - Create collapsible section header
   - Title: "Banner & Hero Section"
   - Description: "Configure homepage hero image and promotional banners"

5. **Add section organization**
   - Hero Image subsection
   - Text Overlay subsection
   - Call-to-Action Button subsection
   - Optional: Additional banner slots

6. **Implement state management**
   - Use React state for banner configuration
   - Initialize with existing theme values
   - Prepare for save/update operations

7. **Create section preview**
   - Show full-width preview of hero banner
   - Display with configured text and CTA
   - Update preview in real-time as settings change

8. **Add banner templates (optional)**
   - Provide preset banner layouts
   - Quick-select common configurations
   - Example: Left-aligned text, centered text, right-aligned text

### Banner Section Structure

```
┌─────────────────────────────────────────┐
│  Banner & Hero Section              [▼] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─── Hero Image ─────────────────────┐│
│  │  - Upload Image                    ││
│  │  - Image Dimensions                ││
│  │  - Background Position             ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌─── Text Overlay ───────────────────┐│
│  │  - Hero Title                      ││
│  │  - Hero Subtitle                   ││
│  │  - Text Position                   ││
│  │  - Text Color                      ││
│  │  - Background Overlay              ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌─── Call-to-Action ─────────────────┐│
│  │  - Button Text                     ││
│  │  - Button Link                     ││
│  │  - Button Style                    ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌─── Preview ─────────────────────────│
│  │  [Full-width hero banner preview]  ││
│  └────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### Banner Settings Data Model

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| heroImage | File/URL | No | null | Main hero background image |
| heroTitle | string | No | "" | Large headline text |
| heroSubtitle | string | No | "" | Supporting subtitle text |
| textPosition | enum | No | "center" | left, center, right |
| textColor | string | No | "#FFFFFF" | Overlay text color |
| overlayOpacity | number | No | 0.3 | Dark overlay opacity (0-1) |
| ctaText | string | No | "" | Button label |
| ctaLink | string | No | "" | Button destination URL |
| ctaStyle | enum | No | "primary" | Button style variant |

### Banner Types

| Type | Purpose | Typical Size |
|------|---------|--------------|
| Hero Banner | Homepage main banner | 1920 x 600px |
| Promotional | Category or sale banner | 1920 x 400px |
| Announcement | Top-of-page message | 1920 x 80px |

### Text Position Options

| Position | Description | Use Case |
|----------|-------------|----------|
| Left | Text aligned to left side | Product showcase |
| Center | Text centered | Welcome message |
| Right | Text aligned to right side | Call-to-action focus |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| themeId | string | Yes | Theme identifier |
| initialSettings | BannerSettings | No | Existing configuration |
| onSave | Function | Yes | Save callback |
| onPreview | Function | No | Live preview callback |

### Banner Templates

| Template | Layout | Text Position | Overlay |
|----------|--------|---------------|---------|
| Classic | Full-width image | Center | Medium (40%) |
| Product Focus | Split left/right | Left | Light (20%) |
| CTA Emphasis | Centered content | Center | Dark (60%) |
| Minimal | Large image | Right | None (0%) |

### Expected Outcome
- Organized banner settings section
- Clear subsections for image, text, and CTA
- Data structure for banner configuration
- Foundation for hero image upload component
- State management for banner data

### Verification Checklist
- [ ] BannerSettings component created
- [ ] Section header with title and description
- [ ] Subsections for image, text overlay, CTA
- [ ] Data structure defined with TypeScript
- [ ] State management implemented
- [ ] Preview area included
- [ ] Component exports properly
- [ ] Integration with theme panel complete

---

## Task 59: Create Hero Image Upload

### Overview
Create the hero image upload component for homepage banners. This component handles large image uploads with appropriate validation for banner dimensions, supports cropping for optimal display, and provides a preview of how the hero image will appear on the storefront.

### Dependencies
- Task 58: Create Banner Section

### Instructions

1. **Create HeroUpload component**
   - Create `HeroUpload.tsx` file in `Banner/` directory
   - Extend upload logic from LogoUpload
   - Customize for large banner images

2. **Implement hero image validation**
   - Accept: JPG, PNG, WebP
   - Recommended dimensions: 1920 x 600px
   - Minimum dimensions: 1200 x 400px
   - Maximum file size: 5MB

3. **Add dimension guidance**
   - Show recommended size prominently
   - Accept wider aspect ratios (16:9, 21:9, 3:1)
   - Warn if image is too small or wrong aspect ratio

4. **Create image preview**
   - Show full-width preview of hero image
   - Display at scaled-down size to fit panel
   - Include zoom capability for detail view

5. **Implement background position control**
   - Add position picker: top, center, bottom
   - Show how image will be cropped on different screens
   - Preview with responsive breakpoints

6. **Add image optimization option**
   - Checkbox to auto-compress image
   - Target compression: 80% quality
   - Show original vs optimized file size

7. **Create aspect ratio helper**
   - Show current image aspect ratio
   - Calculate how image will display
   - Suggest cropping if aspect ratio doesn't match

8. **Implement mobile preview**
   - Show how hero appears on mobile
   - Hero images often crop differently on mobile
   - Preview both desktop and mobile views

9. **Add replace functionality**
   - Replace existing hero image
   - Confirm before replacing
   - Option to restore previous image

### Hero Image Specifications

| Property | Recommended | Minimum | Maximum |
|----------|-------------|---------|---------|
| Width | 1920px | 1200px | 3840px |
| Height | 600px | 400px | 1200px |
| Aspect Ratio | 3:1 or 16:9 | 2:1 | 4:1 |
| File Size | 500KB - 1MB | - | 5MB |
| Format | JPG | PNG, WebP | - |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| currentImage | string | No | Current hero image URL |
| onUploadComplete | Function | Yes | Callback with uploaded URL |
| maxSizeMB | number | No | Max file size (default 5) |
| recommendedWidth | number | No | Recommended width (default 1920) |
| recommendedHeight | number | No | Recommended height (default 600) |

### Validation Rules

| Rule | Requirement | Error/Warning |
|------|-------------|---------------|
| Format | JPG, PNG, WebP | "Please upload JPG or PNG image" |
| Dimensions | Min 1200x400px | "Image too small for hero banner" |
| Aspect Ratio | 2:1 to 4:1 | "Unusual aspect ratio, may crop unexpectedly" |
| File Size | Max 5MB | "File too large, please compress" |

### Upload Flow

```
User Selects Image
    │
    ▼
Validate Format & Size
    │
    ▼
Check Dimensions
    │
    ├─── Too Small ────> Show Error
    │
    ├─── Good Size ────> Proceed
    │
    ▼
Show Preview
    │
    ▼
Optional: Crop/Adjust
    │
    ▼
Optional: Compress (if > 2MB)
    │
    ▼
Upload to Server
    │
    ▼
Generate Responsive Versions
    ├── Desktop: 1920px
    ├── Tablet: 1200px
    └── Mobile: 800px
    │
    ▼
Store URLs
    │
    ▼
Update Preview
```

### Background Position Control

```
┌────────────────────────────────┐
│  Background Position           │
├────────────────────────────────┤
│  ( ) Top                       │
│  (•) Center    ← Selected      │
│  ( ) Bottom                    │
│                                │
│  Controls how image is cropped │
│  when container size changes   │
└────────────────────────────────┘
```

### Preview Structure

```
┌──────────────────────────────────────────┐
│  Desktop Preview (1920 x 600)            │
│  ┌────────────────────────────────────┐  │
│  │  [Hero Image Background]           │  │
│  │                                    │  │
│  │    Hero Title Here                 │  │
│  │    Subtitle text here              │  │
│  │    [CTA Button]                    │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

┌─────────────────────────┐
│  Mobile Preview (375px) │
│  ┌───────────────────┐  │
│  │ [Hero Crop]       │  │
│  │                   │  │
│  │  Hero Title       │  │
│  │  [CTA]            │  │
│  │                   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Responsive Image Strategy

| Device | Width | Height | Image Used |
|--------|-------|--------|------------|
| Desktop | 1920px | 600px | Full resolution |
| Tablet | 1024px | 400px | Medium resolution |
| Mobile | 375px | 300px | Small resolution |

### Image Optimization Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| Format | WebP + JPG fallback | Modern format support |
| Quality | 80% | Balance quality and size |
| Progressive | Yes | Faster perceived loading |
| Lazy Load | Yes | Performance optimization |

### Expected Outcome
- Hero image upload with large file support
- Validation for appropriate dimensions
- Preview showing desktop and mobile views
- Background position control
- Optional compression before upload
- Responsive image generation

### Verification Checklist
- [ ] HeroUpload component created
- [ ] File format validation (JPG, PNG, WebP)
- [ ] Dimension validation (min 1200x400px)
- [ ] File size validation (max 5MB)
- [ ] Desktop preview displays correctly
- [ ] Mobile preview shows crop appropriately
- [ ] Background position selector working
- [ ] Image optimization option available
- [ ] Upload to server successful
- [ ] Responsive versions generated
- [ ] Replace functionality working

---

## Task 60: Create Hero Text Overlay

### Overview
Create the text overlay configuration component for hero banners. This component allows users to add and style headline text, subtitles, and configure text positioning, colors, and background overlays to ensure text readability over hero images.

### Dependencies
- Task 59: Create Hero Image Upload

### Instructions

1. **Create HeroTextOverlay component**
   - Create `HeroTextOverlay.tsx` file in `Banner/` directory
   - Set up form for text content and styling
   - Provide real-time preview of text over hero image

2. **Add hero title input**
   - Text input for main headline
   - Character limit: 60 characters
   - Placeholder: "Welcome to Our Store"
   - Large, prominent text in preview

3. **Add hero subtitle input**
   - Text input or textarea for supporting text
   - Character limit: 150 characters
   - Placeholder: "Discover amazing products at great prices"
   - Medium-sized text below title

4. **Implement text position selector**
   - Radio buttons or select dropdown
   - Options: Left, Center, Right
   - Also: Top, Middle, Bottom vertical position
   - Update preview immediately when changed

5. **Add text color picker**
   - Color input for text color
   - Default: White (#FFFFFF)
   - Show color contrast ratio with background
   - Warn if contrast is insufficient

6. **Create background overlay controls**
   - Enable/disable dark overlay checkbox
   - Overlay opacity slider (0-100%)
   - Overlay color picker (default: black)
   - Preview overlay effect in real-time

7. **Add text styling options**
   - Font size adjustments (Large, X-Large, 2X-Large)
   - Font weight: Normal, Medium, Bold
   - Text shadow option for better readability
   - Line height adjustment

8. **Implement responsive text preview**
   - Show how text appears on desktop
   - Show how text scales on mobile
   - Adjust font sizes for different breakpoints

9. **Add text animation options (optional)**
   - Fade in animation
   - Slide in from left/right
   - No animation option
   - Preview animation effect

### Text Overlay Structure

```
┌─────────────────────────────────────────┐
│  Hero Text Overlay                      │
├─────────────────────────────────────────┤
│  Hero Title                             │
│  ┌───────────────────────────────────┐  │
│  │ Welcome to Our Store              │  │
│  └───────────────────────────────────┘  │
│  0 / 60 characters                      │
│                                         │
│  Hero Subtitle                          │
│  ┌───────────────────────────────────┐  │
│  │ Discover amazing products...      │  │
│  └───────────────────────────────────┘  │
│  0 / 150 characters                     │
│                                         │
│  Text Position                          │
│  Horizontal: (•) Left  ( ) Center  ( ) Right │
│  Vertical:   ( ) Top   (•) Middle  ( ) Bottom│
│                                         │
│  Text Color                             │
│  [#FFFFFF] [Color Picker]               │
│                                         │
│  Background Overlay                     │
│  [✓] Enable dark overlay                │
│  Opacity: ●━━━━━━━━━━━━━━━━ 40%        │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| heroImage | string | Yes | Hero image URL for preview |
| title | string | No | Current title text |
| subtitle | string | No | Current subtitle text |
| position | TextPosition | No | Text positioning |
| textColor | string | No | Text color (hex) |
| overlayEnabled | boolean | No | Dark overlay enabled |
| overlayOpacity | number | No | Overlay opacity (0-1) |
| onChange | Function | Yes | Callback when text changes |

### Text Position Configuration

| Position | Alignment | Use Case |
|----------|-----------|----------|
| Left-Top | Left-aligned, top | Product showcase |
| Left-Middle | Left-aligned, center | Balanced layout |
| Left-Bottom | Left-aligned, bottom | Footer-style |
| Center-Middle | Centered, center | Welcome message |
| Right-Middle | Right-aligned, center | CTA focus |

### Text Styling Options

| Property | Options | Default | Purpose |
|----------|---------|---------|---------|
| Title Size | 2XL, 3XL, 4XL | 3XL | Headline prominence |
| Subtitle Size | LG, XL, 2XL | XL | Supporting text |
| Font Weight | 400, 500, 600, 700 | 700 | Text boldness |
| Text Shadow | None, Small, Medium | Small | Readability |

### Color Contrast Guidelines

| Background | Recommended Text Color | Contrast Ratio |
|------------|------------------------|----------------|
| Light Image | Dark text (#000000) | > 4.5:1 |
| Dark Image | Light text (#FFFFFF) | > 4.5:1 |
| Mixed | White with dark overlay | > 7:1 |

### Background Overlay Configuration

```
No Overlay (opacity: 0%)
┌────────────────────────┐
│ [Bright Image]         │
│                        │
│ Hero Text (may be hard to read) │
└────────────────────────┘

Light Overlay (opacity: 30%)
┌────────────────────────┐
│ [Darkened Image] ░░░   │
│                        │
│ Hero Text (better)     │
└────────────────────────┘

Dark Overlay (opacity: 60%)
┌────────────────────────┐
│ [Very Dark Image] ▓▓   │
│                        │
│ Hero Text (excellent)  │
└────────────────────────┘
```

### Responsive Text Scaling

| Screen Size | Title Size | Subtitle Size | Padding |
|-------------|------------|---------------|---------|
| Desktop (≥1024px) | 48px (3xl) | 20px (xl) | 80px |
| Tablet (768-1023px) | 36px (2xl) | 18px (lg) | 40px |
| Mobile (<768px) | 28px (xl) | 16px (base) | 20px |

### Character Limits Rationale

| Field | Limit | Reason |
|-------|-------|--------|
| Title | 60 chars | Fits on one line, mobile-friendly |
| Subtitle | 150 chars | 2-3 lines maximum, scannable |

### Text Shadow Options

| Option | CSS Value | Use Case |
|--------|-----------|----------|
| None | none | High contrast backgrounds |
| Small | 0 1px 2px rgba(0,0,0,0.5) | Slight enhancement |
| Medium | 0 2px 4px rgba(0,0,0,0.8) | Better readability |
| Large | 0 4px 6px rgba(0,0,0,0.9) | Maximum contrast |

### Live Preview Display

```
┌────────────────────────────────────────┐
│  [Hero Image Background with Overlay]  │
│                                        │
│          Welcome to Our Store          │  ← Title
│     Discover amazing products at       │  ← Subtitle
│          great prices                  │
│          [Shop Now Button]             │  ← CTA (next task)
│                                        │
└────────────────────────────────────────┘
```

### Expected Outcome
- Text input fields for title and subtitle
- Position selectors for text placement
- Color picker with contrast validation
- Overlay controls for readability
- Real-time preview of text over hero image
- Responsive text scaling configuration

### Verification Checklist
- [ ] HeroTextOverlay component created
- [ ] Title input with character limit
- [ ] Subtitle input with character limit
- [ ] Position selector (horizontal and vertical)
- [ ] Text color picker functional
- [ ] Background overlay controls working
- [ ] Overlay opacity slider functional
- [ ] Text preview updates in real-time
- [ ] Contrast ratio validation implemented
- [ ] Text shadow options available
- [ ] Responsive preview shows mobile scaling
- [ ] onChange callback triggers correctly

---

## Summary

This document established the logo and banner management system for the webstore theme engine. All components for logo upload, preview, sizing, alt text, favicon, mobile logo, banner section, hero image upload, and text overlay configuration have been defined. These features provide comprehensive brand identity and hero banner customization capabilities.

### Completed Tasks
1. ✓ Created Logo Section with organized subsections
2. ✓ Created Logo Upload with validation and preview
3. ✓ Created Logo Preview component
4. ✓ Created Logo Size Control with slider and presets
5. ✓ Created Logo Alt Text input for accessibility
6. ✓ Created Favicon Upload with multi-size generation
7. ✓ Created Mobile Logo option with fallback
8. ✓ Created Banner Section structure
9. ✓ Created Hero Image Upload with responsive handling
10. ✓ Created Hero Text Overlay with positioning and styling

### Next Steps
Proceed to [02_Tasks-61-66_Optimize-Apply-Verify.md](02_Tasks-61-66_Optimize-Apply-Verify.md) to create hero CTA button configuration, image optimization, image cropper, delete functionality, logo application, and verification of the complete image upload flow.

---

*Document prepared for AI agent execution. Follow instructions precisely, implementing each component according to specifications. Ensure all validation, preview, and state management features are functional before proceeding to next document.*
