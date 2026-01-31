# Tasks 81-89: Preview Panel and Actions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** F - Preview & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-90-92_Testing.md](02_Tasks-90-92_Testing.md)

---

## Document Overview

This document covers the creation of the theme preview panel with live preview capabilities and action buttons. It establishes the preview infrastructure including iframe-based rendering, viewport toggling (desktop/mobile), refresh functionality, and theme management actions (save, publish, draft mode, undo). The preview system allows theme designers to see changes in real-time before applying them to the live storefront.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Theme Preview Panel | Medium | 45 min |
| 82 | Create Preview Frame | Medium | 40 min |
| 83 | Create Desktop Preview | Low | 20 min |
| 84 | Create Mobile Preview | Low | 25 min |
| 85 | Create Preview Refresh | Low | 15 min |
| 86 | Create Save Theme Button | Medium | 30 min |
| 87 | Create Publish Theme | Medium | 35 min |
| 88 | Create Draft Mode | Medium | 30 min |
| 89 | Create Undo Changes | Medium | 35 min |

---

## Task 81: Create Theme Preview Panel

### Overview
Create the main theme preview panel component that serves as the container for the live preview system. This panel displays on the right side of the theme editor (or as a modal) and houses the preview frame, viewport controls, and action buttons. The panel should be resizable or toggleable to accommodate different working preferences.

### Dependencies
- Task 80 (Font Loading Mechanism) must be complete
- Theme context with current theme state is available
- Component library structure is established

### Instructions

1. **Create preview components directory**
   - Navigate to `frontend/components/storefront/theme/` directory
   - Create new directory named `Preview`
   - This will house all preview-related components

2. **Create PreviewPanel component file**
   - Create `PreviewPanel.tsx` in `Preview/` directory
   - Set up TypeScript React functional component structure
   - Import necessary dependencies (React, hooks, types)

3. **Define component props interface**
   - Create `PreviewPanelProps` interface
   - Include `isOpen` prop for visibility toggle
   - Include `onClose` optional callback for closing panel
   - Include `className` for additional styling

4. **Implement panel container structure**
   - Create main container div with fixed or absolute positioning
   - Set appropriate width (50% of screen or fixed pixel width)
   - Apply proper z-index for layering
   - Add background color and border styling

5. **Create panel header section**
   - Add header with title "Theme Preview"
   - Include close button (X icon) if modal mode
   - Add resize handle if resizable mode enabled
   - Include viewport toggle controls (Tasks 83-84)

6. **Create panel toolbar**
   - Add toolbar container below header
   - Position action buttons (refresh, save, publish, etc.)
   - Include viewport selection buttons
   - Add status indicator (draft/published/unsaved)

7. **Create main preview area**
   - Add container div for preview frame (Task 82)
   - Set flex-grow to fill available space
   - Apply overflow handling for scrolling
   - Add loading indicator placeholder

8. **Implement visibility controls**
   - Control panel display with `isOpen` prop
   - Add transition animations for smooth show/hide
   - Ensure proper cleanup on unmount

9. **Add responsive behavior**
   - Full width on mobile devices
   - Split view on tablet and desktop
   - Adjust toolbar layout for smaller screens

### Panel Layout Structure

```
┌──────────────────────────────────────────────┐
│  Theme Preview                        [×]    │ ← Header
├──────────────────────────────────────────────┤
│  [Desktop] [Mobile]  [↻] [Save] [Publish]   │ ← Toolbar
├──────────────────────────────────────────────┤
│                                              │
│                                              │
│          Preview Frame Area                  │ ← Main Area
│          (Task 82)                           │
│                                              │
│                                              │
├──────────────────────────────────────────────┤
│  Status: Draft • Last saved: 2 min ago      │ ← Footer
└──────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | boolean | Yes | - | Control panel visibility |
| onClose | () => void | No | undefined | Close callback function |
| className | string | No | "" | Additional CSS classes |
| position | "right" \| "modal" | No | "right" | Panel display mode |

### Panel Positioning Options

| Position | Description | Use Case |
|----------|-------------|----------|
| Right Side | Fixed right panel, 50% width | Desktop editing |
| Modal | Overlay modal, centered | Mobile or full preview |
| Resizable | Draggable width adjustment | Custom layout |

### Panel Sections

| Section | Component | Purpose |
|---------|-----------|---------|
| Header | Title + Close | Panel identification |
| Toolbar | Controls + Actions | Preview and theme controls |
| Main | PreviewFrame | Live preview rendering |
| Footer | Status Info | Save status and metadata |

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| viewport | "desktop" \| "mobile" | Current viewport mode |
| isLoading | boolean | Preview loading state |
| lastSaved | Date \| null | Last save timestamp |
| hasChanges | boolean | Unsaved changes indicator |

### Panel Behavior

```
User Opens Theme Editor
        │
        ▼
PreviewPanel Mounts
        │
        ├─→ Load Current Theme
        ├─→ Initialize Preview Frame
        ├─→ Subscribe to Theme Changes
        │
        ▼
Ready for User Interaction
        │
        ├─→ Viewport Toggle (Tasks 83-84)
        ├─→ Refresh (Task 85)
        ├─→ Save (Task 86)
        ├─→ Publish (Task 87)
        └─→ Undo (Task 89)
```

### Expected Outcome
- Functional preview panel container
- Proper layout structure with sections
- Responsive behavior across devices
- Ready to integrate preview frame and controls

### Verification Checklist
- [ ] `PreviewPanel.tsx` file created in correct directory
- [ ] Component accepts required props
- [ ] Panel displays with proper positioning
- [ ] Header with title and close button
- [ ] Toolbar area for controls
- [ ] Main area for preview frame
- [ ] Footer with status information
- [ ] Responsive layout implemented
- [ ] Visibility controlled by props
- [ ] Component exports properly

---

## Task 82: Create Preview Frame

### Overview
Create the PreviewFrame component that renders an iframe displaying the storefront homepage with applied theme styles. This component is the core of the preview system, injecting CSS custom properties from the current theme configuration and handling iframe communication for live updates.

### Dependencies
- Task 81: Create Theme Preview Panel

### Instructions

1. **Create PreviewFrame component file**
   - Create `PreviewFrame.tsx` in `Preview/` directory
   - Set up React functional component with iframe element
   - Import theme context and CSS generation utilities

2. **Define component props interface**
   - Create `PreviewFrameProps` interface
   - Include `viewport` prop ("desktop" | "mobile")
   - Include `themeConfig` prop with current theme data
   - Include optional `loading` callback

3. **Implement iframe element**
   - Create iframe with proper attributes
   - Set `src` to storefront homepage URL
   - Add `sandbox` attribute with appropriate permissions
   - Set `title` for accessibility

4. **Configure iframe sandbox permissions**
   - Allow scripts: `allow-scripts`
   - Allow same-origin: `allow-same-origin`
   - Allow forms: `allow-forms`
   - Restrict popups and navigation as needed

5. **Generate theme CSS injection**
   - Create function to convert theme config to CSS variables
   - Generate CSS string with all color variables
   - Generate CSS string with font family declarations
   - Include spacing, border radius, and other design tokens

6. **Inject CSS into iframe**
   - Listen for iframe load event
   - Access iframe contentWindow and document
   - Create style element in iframe head
   - Inject generated CSS variables

7. **Handle iframe communication**
   - Set up postMessage listener for iframe
   - Send theme updates to iframe on changes
   - Receive confirmation messages from iframe
   - Handle iframe navigation events

8. **Apply viewport-specific styling**
   - Set iframe dimensions based on viewport prop
   - Apply device frame styling for mobile preview
   - Add responsive scaling if needed

9. **Implement loading state**
   - Show loading indicator before iframe loads
   - Hide indicator after load complete
   - Handle iframe load errors gracefully

10. **Add refresh capability**
    - Create method to reload iframe content
    - Clear cache if needed
    - Maintain current theme state after refresh

### Iframe Configuration

| Attribute | Value | Purpose |
|-----------|-------|---------|
| src | `/storefront` or preview URL | Content to display |
| sandbox | `allow-scripts allow-same-origin` | Security restrictions |
| title | "Theme Preview" | Accessibility |
| loading | "lazy" | Performance |

### CSS Variables Injection

| Variable Category | Example Variables | Source |
|-------------------|-------------------|--------|
| Colors | `--color-primary`, `--color-secondary` | Task 34 palette |
| Typography | `--font-heading`, `--font-body` | Task 50 fonts |
| Spacing | `--spacing-base`, `--spacing-lg` | Task 66 settings |
| Effects | `--border-radius`, `--shadow` | Task 66 settings |

### CSS Injection Process

```
Theme Config Changed
        │
        ▼
Generate CSS Variables
        │
        ▼
Convert to CSS String
        │
        ▼
Inject into Iframe <head>
        │
        ▼
Styles Applied to Storefront
        │
        ▼
User Sees Live Update
```

### Viewport Dimensions

| Viewport | Width | Height | Frame Style |
|----------|-------|--------|-------------|
| Desktop | 100% | 100% | No frame |
| Mobile | 375px | 667px | Phone bezel |

### Communication Flow

```
Parent Component (Theme Editor)
        │
        │ Theme Changes
        ├────────────────→ PreviewFrame
        │                       │
        │                       │ Generate CSS
        │                       ├──────────→ CSS Variables
        │                       │
        │                       │ postMessage
        │                       ├──────────→ Iframe
        │                       │
        │                       │ Apply Styles
        │ Confirmation          │
        ←────────────────────────┘
```

### CSS Generation Example Structure

```css
:root {
  /* Primary Colors */
  --color-primary: #0066CC;
  --color-primary-hover: #0052A3;
  
  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  
  /* Spacing */
  --spacing-base: 1rem;
  --border-radius: 0.5rem;
}
```

### Error Handling

| Error Type | Handling Strategy |
|------------|-------------------|
| Iframe load failure | Show error message, retry button |
| CSS injection failure | Fallback to default styles |
| Communication timeout | Reset iframe connection |
| Invalid theme config | Use last valid config |

### Expected Outcome
- Functional iframe displaying storefront
- Live CSS injection working correctly
- Theme changes reflected immediately
- Proper viewport sizing and scaling
- Error handling for edge cases

### Verification Checklist
- [ ] `PreviewFrame.tsx` file created
- [ ] Iframe element configured with proper attributes
- [ ] Sandbox permissions set correctly
- [ ] CSS variable generation working
- [ ] CSS injection into iframe functional
- [ ] Theme changes reflect in real-time
- [ ] Viewport dimensions applied correctly
- [ ] Loading state displayed properly
- [ ] Error handling implemented
- [ ] Component exports properly

---

## Task 83: Create Desktop Preview

### Overview
Create the desktop preview mode that displays the preview frame at full width, simulating how the theme appears on desktop devices. This component sets the viewport mode to desktop and applies appropriate scaling and dimensions to the preview frame.

### Dependencies
- Task 82: Create Preview Frame

### Instructions

1. **Create DesktopPreview component file**
   - Create `DesktopPreview.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import PreviewFrame component

2. **Define component props interface**
   - Create `DesktopPreviewProps` interface
   - Include `themeConfig` prop for current theme
   - Include optional `onLoad` callback
   - Include `className` for styling

3. **Implement desktop viewport container**
   - Create container div with full width
   - Remove device frame styling
   - Allow full height utilization
   - Apply minimal padding

4. **Integrate PreviewFrame component**
   - Render PreviewFrame with viewport="desktop"
   - Pass themeConfig prop through
   - Handle loading states
   - Forward callbacks appropriately

5. **Configure desktop dimensions**
   - Set frame width to 100% of container
   - Set frame height to fill available space
   - Remove maximum width constraints
   - Ensure responsive behavior

6. **Add desktop-specific styling**
   - No device bezel or frame decoration
   - Clean, edge-to-edge display
   - Optional subtle border
   - Match editor color scheme

7. **Implement active state indicator**
   - Show visual indicator when desktop mode active
   - Highlight desktop button in toolbar
   - Update preview panel title if needed

### Desktop Preview Layout

```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │                                      │ │
│  │        Storefront Content           │ │
│  │        (Full Width Desktop)         │ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| themeConfig | ThemeConfig | Yes | - | Current theme configuration |
| onLoad | () => void | No | undefined | Callback after frame loads |
| className | string | No | "" | Additional CSS classes |

### Desktop Viewport Specifications

| Property | Value | Rationale |
|----------|-------|-----------|
| Width | 100% | Full container utilization |
| Height | 100% | Maximize vertical space |
| Min Width | 768px | Minimum desktop width |
| Scaling | 1:1 | No scaling needed |

### Comparison with Mobile Preview

| Aspect | Desktop Preview | Mobile Preview |
|--------|----------------|----------------|
| Width | 100% | 375px |
| Frame | None | Phone bezel |
| Scaling | None | Optional fit-to-panel |
| Navigation | Full navbar | Collapsed menu |

### State Management

| State | Type | Purpose |
|-------|------|---------|
| isLoading | boolean | Track frame loading |
| error | Error \| null | Handle load errors |

### Expected Outcome
- Full-width desktop preview rendering
- Clean, frameless display
- Proper theme application
- Responsive to container size

### Verification Checklist
- [ ] `DesktopPreview.tsx` file created
- [ ] Component renders PreviewFrame correctly
- [ ] Desktop viewport prop passed correctly
- [ ] Full-width display implemented
- [ ] No device frame visible
- [ ] Theme config applied properly
- [ ] Loading state handled
- [ ] Component exports properly

---

## Task 84: Create Mobile Preview

### Overview
Create the mobile preview mode that displays the preview frame with mobile device dimensions and styling. This component simulates a phone viewport (375x667px) and adds a device frame bezel for visual context, allowing theme designers to see how their theme appears on mobile devices.

### Dependencies
- Task 82: Create Preview Frame

### Instructions

1. **Create MobilePreview component file**
   - Create `MobilePreview.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import PreviewFrame component

2. **Define component props interface**
   - Create `MobilePreviewProps` interface
   - Include `themeConfig` prop for current theme
   - Include optional `deviceType` prop (iPhone, Android)
   - Include optional `onLoad` callback
   - Include `className` for styling

3. **Implement mobile viewport container**
   - Create centered container for device frame
   - Set fixed dimensions (375x667px standard)
   - Add device frame bezel styling
   - Center within preview panel

4. **Create device frame decoration**
   - Add phone-like border with rounded corners
   - Include top notch or status bar area
   - Add bottom home indicator (for modern devices)
   - Apply device shadow for depth

5. **Integrate PreviewFrame component**
   - Render PreviewFrame with viewport="mobile"
   - Set dimensions to mobile viewport size
   - Pass themeConfig prop through
   - Handle loading states

6. **Configure mobile dimensions**
   - Set frame width to 375px (iPhone base size)
   - Set frame height to 667px (iPhone 8 base)
   - Optionally support other device sizes
   - Apply proper aspect ratio

7. **Add scrolling behavior**
   - Enable vertical scrolling within mobile frame
   - Hide or style scrollbar appropriately
   - Test long content scrolling
   - Ensure touch-friendly (if touch events enabled)

8. **Implement device type variants**
   - Support iPhone-style notch and design
   - Support Android-style frame (optional)
   - Allow switching between device types
   - Apply appropriate bezels and decorations

9. **Add active state indicator**
   - Show visual indicator when mobile mode active
   - Highlight mobile button in toolbar
   - Update preview panel if needed

### Mobile Preview Layout

```
┌────────────────────────────────────────┐
│                                        │
│         ┌────────────────┐            │
│         │ ●   ━━━━   📶 │ ← Status   │
│         ├────────────────┤            │
│         │                │            │
│         │   Storefront   │            │
│         │   Content      │            │
│         │   (Mobile)     │            │
│         │                │            │
│         │    [Scroll]    │            │
│         │                │            │
│         ├────────────────┤            │
│         │    ─────       │ ← Home     │
│         └────────────────┘            │
│                                        │
└────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| themeConfig | ThemeConfig | Yes | - | Current theme configuration |
| deviceType | "iphone" \| "android" | No | "iphone" | Device frame style |
| onLoad | () => void | No | undefined | Callback after frame loads |
| className | string | No | "" | Additional CSS classes |

### Mobile Device Specifications

| Device | Width | Height | Aspect Ratio |
|--------|-------|--------|--------------|
| iPhone 8/SE | 375px | 667px | 9:16 |
| iPhone X+ | 375px | 812px | 9:19.5 |
| Pixel/Android | 360px | 640px | 9:16 |

### Device Frame Components

| Component | Description | Styling |
|-----------|-------------|---------|
| Bezel | Outer phone frame | Border, rounded corners, shadow |
| Notch | Top cutout (iPhone X+) | Centered, rounded |
| Status Bar | Time, battery, signal | Small text, icons |
| Home Indicator | Bottom bar (iPhone X+) | Centered, white bar |

### Mobile-Specific Behaviors

| Behavior | Implementation |
|----------|----------------|
| Touch Events | Disabled (click only in iframe) |
| Scrolling | Vertical scroll enabled |
| Pinch Zoom | Disabled (fixed scale) |
| Orientation | Portrait only (landscape optional) |

### Comparison Table

| Aspect | Desktop Preview | Mobile Preview |
|--------|-----------------|----------------|
| Width | 100% | 375px |
| Height | 100% | 667px |
| Frame | None | Phone bezel |
| Centering | Edge-to-edge | Centered |
| Scrollbar | Default | Hidden or thin |

### Expected Outcome
- Mobile-sized preview with device frame
- Proper dimensions and aspect ratio
- Realistic mobile appearance
- Scrolling functionality working

### Verification Checklist
- [ ] `MobilePreview.tsx` file created
- [ ] Component renders PreviewFrame correctly
- [ ] Mobile viewport prop passed correctly
- [ ] Device frame bezel implemented
- [ ] Correct mobile dimensions (375x667)
- [ ] Preview centered in panel
- [ ] Scrolling works properly
- [ ] Theme config applied correctly
- [ ] Component exports properly

---

## Task 85: Create Preview Refresh

### Overview
Create the preview refresh functionality that allows users to manually reload the preview iframe. This is useful when changes don't automatically update, when testing theme loading behavior, or when the preview encounters an error. The refresh button should provide visual feedback and handle loading states properly.

### Dependencies
- Task 82: Create Preview Frame

### Instructions

1. **Create PreviewRefresh component file**
   - Create `PreviewRefresh.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import necessary icons (refresh/reload icon)

2. **Define component props interface**
   - Create `PreviewRefreshProps` interface
   - Include `onRefresh` callback function
   - Include optional `loading` state prop
   - Include optional `disabled` prop
   - Include `className` for styling

3. **Implement refresh button**
   - Create button element with refresh icon
   - Apply appropriate styling (icon button)
   - Add tooltip "Refresh Preview"
   - Position in toolbar area

4. **Handle refresh action**
   - Call onRefresh callback when clicked
   - Trigger iframe reload in parent component
   - Show loading spinner during refresh
   - Disable button during loading

5. **Add visual feedback**
   - Rotate icon on click (animation)
   - Show loading spinner during refresh
   - Disable button while refreshing
   - Display success indicator briefly

6. **Implement loading state**
   - Accept loading prop from parent
   - Show spinner icon instead of refresh icon
   - Disable button interaction
   - Add animated rotation to spinner

7. **Handle error states**
   - Display error if refresh fails
   - Allow retry after error
   - Show error toast or inline message
   - Reset to normal state after error handled

8. **Add keyboard shortcut (optional)**
   - Support Ctrl+R or Cmd+R for refresh
   - Prevent browser refresh (preventDefault)
   - Scope shortcut to preview panel
   - Show shortcut in tooltip

### Refresh Button Structure

```
┌─────────────────────────────┐
│  [🖥️ Desktop] [📱 Mobile]  │
│                             │
│  [↻ Refresh]  [Save] ...   │ ← Refresh Button
│                             │
└─────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onRefresh | () => void | Yes | - | Callback to trigger refresh |
| loading | boolean | No | false | Loading state indicator |
| disabled | boolean | No | false | Disable button |
| className | string | No | "" | Additional CSS classes |

### Refresh Button States

| State | Icon | Action | Appearance |
|-------|------|--------|------------|
| Idle | ↻ (Refresh) | Clickable | Default styling |
| Loading | ⟳ (Spinner) | Disabled | Rotating animation |
| Error | ⚠️ (Warning) | Retry | Error color |
| Success | ✓ (Check) | Brief display | Success color |

### Refresh Process Flow

```
User Clicks Refresh
        │
        ▼
Set Loading State
        │
        ▼
Call onRefresh Callback
        │
        ▼
Parent Reloads Iframe
        │
        ├─→ Success → Clear Loading → Show Check (1s)
        │
        └─→ Error → Clear Loading → Show Error → Allow Retry
```

### Button Styling

| Aspect | Value | Purpose |
|--------|-------|---------|
| Size | 36x36px or 40x40px | Touch-friendly |
| Icon Size | 20px | Clear visibility |
| Padding | 8px | Comfortable spacing |
| Border | 1px gray | Define boundaries |
| Hover | Background change | Interaction feedback |

### Animation Specifications

| Animation | Duration | Timing | Purpose |
|-----------|----------|--------|---------|
| Icon Rotation | 500ms | ease-in-out | Click feedback |
| Spinner Rotation | 1000ms | linear, infinite | Loading indicator |
| Success Check | 1000ms | ease-in-out | Confirmation |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Tooltip | "Refresh Preview (Ctrl+R)" |
| ARIA Label | "Refresh preview" |
| Focus Indicator | Visible outline |
| Disabled State | aria-disabled="true" |

### Expected Outcome
- Functional refresh button in toolbar
- Visual feedback during loading
- Proper state management
- Accessible and user-friendly

### Verification Checklist
- [ ] `PreviewRefresh.tsx` file created
- [ ] Button renders with refresh icon
- [ ] onRefresh callback triggered on click
- [ ] Loading state disables button
- [ ] Spinning animation during loading
- [ ] Tooltip displayed on hover
- [ ] Error handling implemented
- [ ] Success feedback shown
- [ ] Keyboard shortcut working (if implemented)
- [ ] Component exports properly

---

## Task 86: Create Save Theme Button

### Overview
Create the save theme button that allows users to save their current theme configuration to the database. This button should detect unsaved changes, display appropriate states (clean/dirty), trigger API save operations, and provide feedback on success or failure. The save action stores the theme as a draft by default (unless published).

### Dependencies
- Task 81: Create Theme Preview Panel

### Instructions

1. **Create SaveThemeButton component file**
   - Create `SaveThemeButton.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import API client for theme saving

2. **Define component props interface**
   - Create `SaveThemeButtonProps` interface
   - Include `themeConfig` prop with current theme
   - Include `hasChanges` prop to indicate dirty state
   - Include optional `onSave` callback
   - Include optional `onSuccess` callback
   - Include `className` for styling

3. **Implement save button UI**
   - Create button with "Save" label
   - Add save icon (floppy disk or checkmark)
   - Apply primary or accent button styling
   - Position in toolbar area

4. **Track unsaved changes**
   - Accept hasChanges prop from parent
   - Disable button when no changes exist
   - Enable button when changes detected
   - Show visual indicator for unsaved changes

5. **Implement save handler**
   - Create async function to handle save action
   - Call theme API endpoint with current config
   - Set loading state during API call
   - Handle response and errors

6. **Build API request payload**
   - Serialize current theme configuration
   - Include all theme sections (colors, fonts, etc.)
   - Add metadata (tenant ID, theme name, version)
   - Set status to "draft" (not published)

7. **Handle save response**
   - On success: Show success toast notification
   - On success: Update last saved timestamp
   - On success: Mark changes as saved (hasChanges = false)
   - On success: Call onSuccess callback if provided
   - On error: Display error message
   - On error: Keep changes marked as unsaved

8. **Add loading state**
   - Show loading spinner during save
   - Disable button during save operation
   - Display loading text "Saving..."
   - Prevent multiple concurrent saves

9. **Implement auto-save (optional)**
   - Debounce changes (30 seconds after last edit)
   - Auto-save only if user opted in
   - Show auto-save indicator
   - Don't interrupt user editing

10. **Add keyboard shortcut**
    - Support Ctrl+S or Cmd+S for save
    - Prevent browser save dialog
    - Only trigger if changes exist
    - Provide shortcut hint in tooltip

### Save Button Structure

```
┌─────────────────────────────────────┐
│  [↻]  [💾 Save*]  [Publish]  [↶]   │
│         ↑                           │
│    Dirty State                      │
│    (* indicates unsaved)            │
└─────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| themeConfig | ThemeConfig | Yes | - | Current theme configuration |
| hasChanges | boolean | Yes | - | Unsaved changes indicator |
| onSave | () => void | No | undefined | Pre-save callback |
| onSuccess | () => void | No | undefined | Post-save success callback |
| className | string | No | "" | Additional CSS classes |

### Button States

| State | Label | Icon | Enabled | Appearance |
|-------|-------|------|---------|------------|
| Clean | "Saved" | ✓ | No | Disabled, gray |
| Dirty | "Save*" | 💾 | Yes | Primary color |
| Saving | "Saving..." | ⟳ | No | Loading spinner |
| Error | "Retry" | ⚠️ | Yes | Error color |

### Save Process Flow

```
User Makes Changes
        │
        ▼
hasChanges = true
        │
        ▼
Button Enabled
        │
        ▼
User Clicks Save (or Ctrl+S)
        │
        ▼
Call onSave (validation)
        │
        ▼
Set Loading State
        │
        ▼
API Call: POST /api/themes/save
        │
        ├─→ Success
        │   ├─→ Update lastSaved
        │   ├─→ hasChanges = false
        │   ├─→ Show "Saved" toast
        │   └─→ Call onSuccess
        │
        └─→ Error
            ├─→ Show error toast
            ├─→ Keep hasChanges = true
            └─→ Allow retry
```

### API Request Structure

| Field | Type | Description |
|-------|------|-------------|
| tenantId | string | Current tenant identifier |
| themeName | string | Name of theme (e.g., "Custom Theme") |
| status | "draft" | Theme status (not published) |
| config | ThemeConfig | Full theme configuration object |
| version | number | Version number (incremented) |

### Success Response Handling

| Response Field | Action |
|----------------|--------|
| themeId | Store in state |
| savedAt | Update timestamp |
| version | Update version number |
| message | Show in toast |

### Error Scenarios

| Error Type | User Message | Action |
|------------|--------------|--------|
| Network Error | "Could not save. Check connection." | Allow retry |
| Validation Error | "Invalid theme data. Please check." | Show details |
| Permission Error | "You don't have permission to save." | Disable save |
| Server Error | "Server error. Please try again." | Allow retry |

### Auto-Save Behavior

| Trigger | Delay | Condition |
|---------|-------|-----------|
| User stops editing | 30 seconds | hasChanges = true |
| Navigate away | Immediate | Prompt to save |
| Session timeout | Before timeout | Auto-save draft |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Tooltip | "Save Theme (Ctrl+S)" |
| ARIA Label | "Save theme changes" |
| Disabled State | aria-disabled="true" when clean |
| Focus Indicator | Visible outline |

### Expected Outcome
- Functional save button with proper states
- API integration for saving themes
- Success and error handling
- Keyboard shortcut support
- User feedback via toasts

### Verification Checklist
- [ ] `SaveThemeButton.tsx` file created
- [ ] Button renders with correct label and icon
- [ ] hasChanges prop controls enabled state
- [ ] API call implemented correctly
- [ ] Loading state displayed during save
- [ ] Success toast shown after save
- [ ] Error handling implemented
- [ ] lastSaved timestamp updated
- [ ] Keyboard shortcut (Ctrl+S) working
- [ ] Component exports properly

---

## Task 87: Create Publish Theme

### Overview
Create the publish theme functionality that takes a saved draft theme and applies it to the live storefront. Publishing makes the theme visible to all customers and should include confirmation prompts, validation checks, and rollback capabilities. This action is separate from save to prevent accidental publishing.

### Dependencies
- Task 86: Create Save Theme Button

### Instructions

1. **Create PublishTheme component file**
   - Create `PublishTheme.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import API client and confirmation dialog

2. **Define component props interface**
   - Create `PublishThemeProps` interface
   - Include `themeConfig` prop with current theme
   - Include `themeId` prop (must be saved first)
   - Include `isSaved` prop to ensure theme is saved
   - Include optional `onPublish` callback
   - Include optional `onSuccess` callback
   - Include `className` for styling

3. **Implement publish button UI**
   - Create button with "Publish" or "Go Live" label
   - Add publish icon (rocket, cloud upload, or eye)
   - Apply distinctive styling (success/green color)
   - Position after save button in toolbar

4. **Add validation checks**
   - Verify theme is saved (has themeId)
   - Verify theme is valid (no errors)
   - Check for required fields (colors, fonts)
   - Disable button if validation fails

5. **Create confirmation dialog**
   - Show modal or dialog before publishing
   - Display message: "Publish theme to live store?"
   - Show preview of changes (summary)
   - Include "Cancel" and "Publish" buttons
   - Warn about customer visibility

6. **Implement publish handler**
   - Open confirmation dialog on button click
   - On confirm: Call theme publish API endpoint
   - Set loading state during API call
   - Handle response and errors appropriately

7. **Build API request**
   - Send PUT request to publish endpoint
   - Include themeId in URL or payload
   - Set status to "published"
   - Include publish timestamp

8. **Handle publish response**
   - On success: Show success toast
   - On success: Update theme status to "published"
   - On success: Show "Published" indicator
   - On success: Call onSuccess callback
   - On error: Display error message
   - On error: Revert to draft status

9. **Add publish status indicator**
   - Show "Published" badge when live
   - Show "Draft" badge when not published
   - Display publish timestamp
   - Update immediately after publish

10. **Implement unpublish (optional)**
    - Add "Unpublish" button for published themes
    - Revert to previous published theme
    - Confirm before unpublishing
    - Update status to draft

11. **Add rollback capability**
    - Keep previous published version
    - Allow rollback to previous version
    - Show version history (optional)
    - Implement one-click rollback

### Publish Button Structure

```
┌─────────────────────────────────────────┐
│  [💾 Save]  [🚀 Publish]  [↶ Undo]     │
│                                         │
│  Status: Draft • Last saved: 2 min ago │
└─────────────────────────────────────────┘
                    ↓
            User Clicks Publish
                    ↓
┌─────────────────────────────────────────┐
│  ⚠️  Publish Theme?                     │
│                                         │
│  This will make your theme visible to  │
│  all customers on your live store.     │
│                                         │
│  Changes: 3 colors, 2 fonts, spacing   │
│                                         │
│     [Cancel]    [Publish Theme]         │
└─────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| themeConfig | ThemeConfig | Yes | - | Current theme configuration |
| themeId | string \| null | Yes | - | Saved theme ID |
| isSaved | boolean | Yes | - | Whether theme is saved |
| onPublish | () => void | No | undefined | Pre-publish callback |
| onSuccess | () => void | No | undefined | Post-publish success callback |
| className | string | No | "" | Additional CSS classes |

### Button States

| State | Label | Icon | Enabled | Appearance |
|-------|-------|------|---------|------------|
| Not Saved | "Publish" | 🚀 | No | Disabled, gray |
| Draft | "Publish" | 🚀 | Yes | Green/success color |
| Publishing | "Publishing..." | ⟳ | No | Loading spinner |
| Published | "Published" | ✓ | No | Success, disabled |

### Validation Requirements

| Check | Requirement | Error Message |
|-------|-------------|---------------|
| Theme Saved | themeId exists | "Save theme before publishing" |
| Primary Color | Must be set | "Primary color required" |
| Body Font | Must be set | "Body font required" |
| Heading Font | Must be set | "Heading font required" |

### Publish Process Flow

```
User Clicks Publish
        │
        ▼
Validate Theme
        │
        ├─→ Invalid → Show Error → Stop
        │
        ▼
Show Confirmation Dialog
        │
        ├─→ Cancel → Close Dialog
        │
        ▼
User Confirms
        │
        ▼
Call onPublish (pre-publish hook)
        │
        ▼
Set Loading State
        │
        ▼
API Call: PUT /api/themes/:id/publish
        │
        ├─→ Success
        │   ├─→ Update status = "published"
        │   ├─→ Update publishedAt timestamp
        │   ├─→ Show "Published!" toast
        │   ├─→ Invalidate storefront cache
        │   └─→ Call onSuccess
        │
        └─→ Error
            ├─→ Show error toast
            ├─→ Keep status = "draft"
            └─→ Allow retry
```

### Confirmation Dialog Content

| Section | Content |
|---------|---------|
| Title | "Publish Theme?" |
| Icon | Warning or Info icon |
| Message | "This will make your theme visible to all customers." |
| Summary | List of changed elements (colors, fonts, etc.) |
| Warning | "Previous theme will be replaced" (optional) |
| Actions | Cancel (secondary), Publish (primary) |

### API Request Structure

| Field | Type | Description |
|-------|------|-------------|
| themeId | string | ID of theme to publish |
| status | "published" | New status |
| publishedAt | ISO date | Publish timestamp |

### Publish Status Indicator

| Status | Badge | Color | Icon |
|--------|-------|-------|------|
| Draft | "Draft" | Gray | 📝 |
| Published | "Published" | Green | ✓ |
| Publishing | "Publishing..." | Blue | ⟳ |

### Post-Publish Actions

| Action | Description |
|--------|-------------|
| Cache Invalidation | Clear storefront cache |
| CDN Purge | Purge CDN cache (if applicable) |
| Notification | Email admin about publish (optional) |
| Analytics | Log publish event |

### Rollback Capability

| Feature | Implementation |
|---------|----------------|
| Previous Version | Store before publishing |
| Rollback Button | "Revert to Previous" |
| Confirmation | Confirm rollback action |
| API Endpoint | POST /api/themes/:id/rollback |

### Expected Outcome
- Functional publish button with validation
- Confirmation dialog before publishing
- API integration for theme publishing
- Status indicator showing publish state
- Success and error handling

### Verification Checklist
- [ ] `PublishTheme.tsx` file created
- [ ] Button renders with correct label and icon
- [ ] Validation checks implemented
- [ ] Button disabled until theme saved
- [ ] Confirmation dialog displays
- [ ] API call implemented correctly
- [ ] Loading state displayed during publish
- [ ] Success toast shown after publish
- [ ] Status indicator updated to "Published"
- [ ] Error handling implemented
- [ ] Component exports properly

---

## Task 88: Create Draft Mode

### Overview
Create the draft mode functionality that allows users to save theme changes without publishing them to the live storefront. Draft mode is the default saving state, allowing designers to iterate on themes, collaborate with team members, and test thoroughly before going live. This task focuses on managing draft status, indicators, and transitions.

### Dependencies
- Task 86: Create Save Theme Button

### Instructions

1. **Create DraftMode component file**
   - Create `DraftMode.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import status badge and indicator components

2. **Define component props interface**
   - Create `DraftModeProps` interface
   - Include `status` prop ("draft" | "published")
   - Include `lastSaved` prop for timestamp
   - Include optional `onSaveAsDraft` callback
   - Include `className` for styling

3. **Implement draft status badge**
   - Create badge component showing "Draft" or "Published"
   - Position in toolbar or header area
   - Apply color coding (gray for draft, green for published)
   - Add icon indicator (pencil for draft, check for published)

4. **Add last saved timestamp**
   - Display "Last saved: X minutes ago"
   - Update timestamp dynamically
   - Use relative time formatting
   - Position near status badge

5. **Create "Save as Draft" button variant**
   - Explicitly labeled button for clarity
   - Alternative to generic "Save" button
   - Make default save action clear
   - Position with other action buttons

6. **Implement draft indicator logic**
   - Check theme status from API or state
   - Display appropriate badge based on status
   - Update badge after save/publish actions
   - Handle loading states during transitions

7. **Add draft warning prompt**
   - Show warning when navigating away with unsaved changes
   - Prompt to save as draft before leaving
   - Don't warn if no changes exist
   - Provide "Save", "Discard", "Cancel" options

8. **Create draft list/history (optional)**
   - Show list of saved draft versions
   - Allow loading previous draft
   - Display draft save timestamps
   - Implement version comparison

9. **Add draft sharing (optional)**
   - Generate shareable preview link for draft
   - Allow team members to view draft
   - Set expiration for preview links
   - Restrict access to authorized users

10. **Implement draft discard option**
    - Add "Discard Draft" button
    - Confirm before discarding changes
    - Revert to last published version
    - Clear unsaved changes flag

### Draft Mode Interface

```
┌──────────────────────────────────────────┐
│  Theme Preview                  📝 Draft │ ← Status Badge
│                                          │
│  [🖥️] [📱]  [↻]  [💾 Save Draft]       │ ← Actions
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │        Preview Frame               │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  📝 Draft • Last saved: 3 minutes ago   │ ← Footer Status
└──────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | "draft" \| "published" | Yes | - | Current theme status |
| lastSaved | Date \| null | Yes | - | Last save timestamp |
| onSaveAsDraft | () => void | No | undefined | Save as draft callback |
| className | string | No | "" | Additional CSS classes |

### Status Badge Variants

| Status | Label | Icon | Color | Background |
|--------|-------|------|-------|------------|
| Draft | "Draft" | 📝 | Gray/Blue | Light gray/blue |
| Published | "Published" | ✓ | Green | Light green |
| Unsaved | "Unsaved Changes*" | ⚠️ | Orange | Light orange |

### Timestamp Formatting

| Time Elapsed | Display |
|--------------|---------|
| < 1 minute | "Just now" |
| 1-59 minutes | "X minutes ago" |
| 1-23 hours | "X hours ago" |
| 1-6 days | "X days ago" |
| > 7 days | "MM/DD/YYYY" |

### Draft Save Flow

```
User Edits Theme
        │
        ▼
hasChanges = true
        │
        ▼
"Unsaved Changes" Indicator
        │
        ▼
User Clicks "Save" or "Save as Draft"
        │
        ▼
API Call: POST /api/themes/save
        │  (status: "draft")
        │
        ▼
Success → Update Status Badge
        │
        ▼
"Draft • Last saved: Just now"
```

### Navigation Warning Flow

```
User Attempts to Navigate Away
        │
        ▼
Check: hasChanges?
        │
        ├─→ No → Allow Navigation
        │
        ▼
Show Confirmation Dialog
        │
        ├─→ "Save Draft" → Save → Navigate
        ├─→ "Discard" → Clear Changes → Navigate
        └─→ "Cancel" → Stay on Page
```

### Draft Management Options

| Action | Description | API Call |
|--------|-------------|----------|
| Save as Draft | Save without publishing | POST /api/themes/save |
| Discard Draft | Revert to published | DELETE /api/themes/:id/draft |
| Publish Draft | Make live | PUT /api/themes/:id/publish |
| Duplicate Draft | Create copy | POST /api/themes/:id/duplicate |

### Warning Dialog Content

```
┌─────────────────────────────────────┐
│  ⚠️  Unsaved Changes                │
│                                     │
│  You have unsaved changes to your  │
│  theme. What would you like to do? │
│                                     │
│  [Discard]  [Save Draft]  [Cancel] │
└─────────────────────────────────────┘
```

### Draft Sharing (Optional)

| Feature | Implementation |
|---------|----------------|
| Generate Link | POST /api/themes/:id/preview-link |
| Link Format | `/preview/:token` |
| Expiration | 7 days default |
| Access Control | Requires authentication or token |

### Expected Outcome
- Clear draft status indicator
- Save as draft functionality
- Last saved timestamp display
- Navigation warning for unsaved changes
- Draft management options

### Verification Checklist
- [ ] `DraftMode.tsx` file created
- [ ] Status badge displays correctly
- [ ] Badge updates after save/publish
- [ ] Last saved timestamp shown
- [ ] Timestamp updates dynamically
- [ ] Navigation warning implemented
- [ ] "Save as Draft" button functional
- [ ] Draft status persists across sessions
- [ ] Component exports properly

---

## Task 89: Create Undo Changes

### Overview
Create the undo changes functionality that allows users to revert their recent theme modifications. This can include undoing the last change, undoing all unsaved changes, or reverting to the last saved/published version. The undo system should provide clear feedback about what will be reverted and require confirmation for major undo operations.

### Dependencies
- Task 86: Create Save Theme Button

### Instructions

1. **Create UndoChanges component file**
   - Create `UndoChanges.tsx` in `Preview/` directory
   - Set up React functional component structure
   - Import confirmation dialog and toast notifications

2. **Define component props interface**
   - Create `UndoChangesProps` interface
   - Include `hasChanges` prop to indicate revertable changes
   - Include `onUndo` callback to trigger undo
   - Include `undoScope` prop ("last" | "all" | "to-saved")
   - Include optional `changeHistory` array
   - Include `className` for styling

3. **Implement undo button UI**
   - Create button with "Undo" label
   - Add undo icon (curved arrow or back arrow)
   - Apply secondary or neutral button styling
   - Position in toolbar area (right side)

4. **Track change history**
   - Maintain array of changes in state or context
   - Record each change type (color, font, spacing)
   - Store previous values for each change
   - Implement maximum history limit (20-50 changes)

5. **Implement single-step undo**
   - Revert only the most recent change
   - Apply previous value from history
   - Remove change from history array
   - Update preview immediately

6. **Implement undo all changes**
   - Revert all unsaved changes
   - Reset to last saved version
   - Show confirmation dialog
   - Clear change history after confirm

7. **Create undo confirmation dialog**
   - Show dialog for "undo all" operations
   - Display number of changes to be reverted
   - List affected sections (colors, fonts, etc.)
   - Include "Cancel" and "Undo All" buttons

8. **Add undo dropdown menu (optional)**
   - Show dropdown with undo options
   - Options: "Undo Last", "Undo All", "Revert to Saved"
   - Show change descriptions in dropdown
   - Allow clicking specific change to undo to that point

9. **Implement redo functionality (optional)**
   - Track undone changes for redo
   - Add "Redo" button next to "Undo"
   - Clear redo history after new change
   - Support Ctrl+Shift+Z shortcut

10. **Add keyboard shortcuts**
    - Support Ctrl+Z or Cmd+Z for undo
    - Support Ctrl+Shift+Z for redo (if implemented)
    - Scope shortcuts to theme editor
    - Show shortcuts in tooltips

11. **Provide visual feedback**
    - Show toast notification after undo
    - Display what was reverted ("Color reverted")
    - Animate preview update
    - Update change counter

12. **Handle undo errors**
    - Handle case where undo fails
    - Restore state if undo unsuccessful
    - Show error message to user
    - Allow retry or cancel

### Undo Button Structure

```
┌──────────────────────────────────────────┐
│  [💾 Save]  [🚀 Publish]  [↶ Undo]      │
│                                          │
│  Unsaved changes: 5                      │
└──────────────────────────────────────────┘

With Dropdown:
┌──────────────────────────────────────────┐
│  [💾 Save]  [🚀 Publish]  [↶ Undo ▾]    │
└──────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────┐
        │ ↶ Undo Last (Primary Color)  │
        │ ↶ Undo All Changes (5)       │
        │ ↶ Revert to Last Saved       │
        └──────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| hasChanges | boolean | Yes | - | Whether changes exist to undo |
| onUndo | (scope) => void | Yes | - | Undo callback function |
| undoScope | "last" \| "all" \| "to-saved" | No | "last" | Undo operation scope |
| changeHistory | Change[] | No | [] | Array of change objects |
| className | string | No | "" | Additional CSS classes |

### Change History Structure

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique change identifier |
| timestamp | Date | When change was made |
| changeType | string | Type of change (color, font, etc.) |
| description | string | Human-readable description |
| previousValue | any | Value before change |
| newValue | any | Value after change |

### Undo Scopes

| Scope | Description | Confirmation Required |
|-------|-------------|----------------------|
| Last | Undo most recent change | No |
| All | Undo all unsaved changes | Yes |
| To Saved | Revert to last saved version | Yes |
| To Published | Revert to published version | Yes |

### Undo Process Flow

```
User Clicks Undo
        │
        ▼
Check Undo Scope
        │
        ├─→ "last" (Single Undo)
        │   ├─→ Get Last Change from History
        │   ├─→ Apply Previous Value
        │   ├─→ Remove from History
        │   ├─→ Update Preview
        │   └─→ Show "Undone" Toast
        │
        └─→ "all" or "to-saved"
            ├─→ Show Confirmation Dialog
            ├─→ User Cancels → Stop
            │
            ▼
            User Confirms
            ├─→ Restore Saved Version
            ├─→ Clear Change History
            ├─→ Update Preview
            ├─→ hasChanges = false
            └─→ Show "Reverted" Toast
```

### Confirmation Dialog Content

```
┌─────────────────────────────────────┐
│  ⚠️  Undo All Changes?              │
│                                     │
│  This will revert 5 unsaved changes:│
│  • Primary color changed            │
│  • Heading font changed             │
│  • Button radius changed            │
│  • 2 more changes...                │
│                                     │
│  [Cancel]  [Undo All]               │
└─────────────────────────────────────┘
```

### Button States

| State | Label | Icon | Enabled | Tooltip |
|-------|-------|------|---------|---------|
| No Changes | "Undo" | ↶ | No | "No changes to undo" |
| Has Changes | "Undo" | ↶ | Yes | "Undo last change (Ctrl+Z)" |
| Undoing | "Undoing..." | ⟳ | No | - |

### Keyboard Shortcuts

| Shortcut | Action | Condition |
|----------|--------|-----------|
| Ctrl+Z (Cmd+Z) | Undo last change | hasChanges = true |
| Ctrl+Shift+Z | Redo last undo | redo history exists |
| Escape | Cancel undo dialog | Dialog open |

### Undo Notifications

| Action | Toast Message |
|--------|---------------|
| Single Undo | "Primary color reverted" |
| Undo All | "All changes reverted" |
| Revert to Saved | "Theme reverted to last saved version" |
| Undo Failed | "Could not undo change. Please try again." |

### Redo Functionality (Optional)

| Feature | Implementation |
|---------|----------------|
| Redo Button | Next to Undo button |
| Redo History | Stack of undone changes |
| Clear Redo | After new change made |
| Keyboard | Ctrl+Shift+Z |

### Change History Examples

| Description | changeType | previousValue | newValue |
|-------------|------------|---------------|----------|
| "Primary color changed" | "color" | "#0066CC" | "#FF5733" |
| "Heading font changed" | "font" | "Inter" | "Roboto" |
| "Button radius changed" | "spacing" | "4px" | "8px" |

### Expected Outcome
- Functional undo button with proper states
- Single-step undo working correctly
- Undo all with confirmation
- Change history tracking
- Keyboard shortcut support
- Clear user feedback

### Verification Checklist
- [ ] `UndoChanges.tsx` file created
- [ ] Button renders with correct label and icon
- [ ] Button disabled when no changes exist
- [ ] Single undo reverts last change
- [ ] Undo all shows confirmation dialog
- [ ] Change history tracked correctly
- [ ] Keyboard shortcut (Ctrl+Z) working
- [ ] Toast notifications displayed
- [ ] Preview updates after undo
- [ ] Component exports properly

---

## Summary

This document established the theme preview system with live preview panel, viewport controls, and theme management actions. The preview panel provides real-time feedback through iframe rendering, allows testing across desktop and mobile viewports, and offers complete theme management including save, publish, draft mode, and undo capabilities.

### Completed Tasks
1. ✓ Created theme preview panel with layout structure
2. ✓ Created preview frame with iframe and CSS injection
3. ✓ Created desktop preview mode with full-width display
4. ✓ Created mobile preview mode with device frame
5. ✓ Created preview refresh functionality
6. ✓ Created save theme button with change tracking
7. ✓ Created publish theme with confirmation and validation
8. ✓ Created draft mode with status indicators
9. ✓ Created undo changes with history tracking

### Next Steps
Proceed to [02_Tasks-90-92_Testing.md](02_Tasks-90-92_Testing.md) to perform comprehensive testing of color application, font loading, and theme persistence across sessions.

---

## Additional Notes

### Preview System Architecture

```
Theme Editor (Left Side)
        │
        │ Theme Changes
        ▼
Theme Context (State)
        │
        │ Current Config
        ▼
PreviewPanel (Right Side)
        │
        ├─→ Toolbar (Controls)
        │   ├─→ Viewport Toggle
        │   ├─→ Refresh Button
        │   ├─→ Save Button
        │   ├─→ Publish Button
        │   └─→ Undo Button
        │
        └─→ PreviewFrame (Iframe)
            │
            │ CSS Injection
            ▼
        Storefront Display
        (Live Theme Preview)
```

### Data Flow Diagram

```
User Edits Color Picker
        │
        ▼
Update Theme Context
        │
        ▼
Generate CSS Variables
        │
        ▼
Inject into Iframe
        │
        ▼
Storefront Renders Updated Theme
        │
        ▼
User Sees Change Immediately
```

### Component Hierarchy

```
PreviewPanel
├── PreviewHeader
│   ├── Title
│   └── CloseButton
├── PreviewToolbar
│   ├── ViewportToggle
│   │   ├── DesktopButton
│   │   └── MobileButton
│   ├── PreviewRefresh
│   ├── SaveThemeButton
│   ├── PublishTheme
│   └── UndoChanges
├── PreviewFrame
│   ├── DesktopPreview (conditional)
│   └── MobilePreview (conditional)
└── PreviewFooter
    ├── DraftMode (status badge)
    └── LastSaved (timestamp)
```

### Best Practices

| Practice | Rationale |
|----------|-----------|
| Auto-update preview | Immediate visual feedback |
| Require save before publish | Prevent accidental publishing |
| Confirm destructive actions | Prevent accidental data loss |
| Show loading states | Inform user of processing |
| Provide keyboard shortcuts | Improve workflow efficiency |
| Track change history | Enable undo functionality |
| Validate before publish | Ensure theme completeness |
| Display status clearly | Avoid user confusion |

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Preview lag | Debounce CSS injection (300ms) |
| Iframe reload | Only reload on major changes |
| Change history | Limit to 50 most recent |
| API calls | Debounce save operations |
| CSS generation | Memoize CSS string generation |

### Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS in iframe | Use sandbox attribute |
| CSRF on publish | Include CSRF token |
| Unauthorized publish | Check user permissions |
| Malicious CSS | Validate and sanitize CSS values |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Button labels | Clear, descriptive text |
| Keyboard support | Ctrl+S, Ctrl+Z shortcuts |
| Focus management | Visible focus indicators |
| Screen readers | Proper ARIA labels |
| Color contrast | High contrast for UI elements |

### Testing Checklist

- [ ] Preview updates when colors change
- [ ] Preview updates when fonts change
- [ ] Desktop/mobile toggle works correctly
- [ ] Refresh reloads preview properly
- [ ] Save button enables with changes
- [ ] Save button saves to API correctly
- [ ] Publish requires confirmation
- [ ] Publish updates live storefront
- [ ] Draft status displays correctly
- [ ] Undo reverts changes correctly
- [ ] Keyboard shortcuts work
- [ ] Error states display properly
- [ ] Loading states show during operations
- [ ] Confirmation dialogs appear when expected
- [ ] Toast notifications display correctly
