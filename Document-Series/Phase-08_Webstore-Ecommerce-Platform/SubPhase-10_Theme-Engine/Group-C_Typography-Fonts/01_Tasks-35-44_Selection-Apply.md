# Tasks 35-44: Typography Selection and Application

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** C - Typography & Fonts  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-50_Loading-Preview-Verify.md](02_Tasks-45-50_Loading-Preview-Verify.md)

---

## Document Overview

This document covers the creation of the typography customization system with font selectors, Google Fonts integration, preview capabilities, and dynamic CSS variable application. It establishes comprehensive font selection for both heading and body text, font size scales, line height settings, font weight options, and the mechanisms to apply these choices to the theme system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create Typography Section | Low | 20 min |
| 36 | Create Heading Font Selector | Low | 25 min |
| 37 | Create Body Font Selector | Low | 25 min |
| 38 | Create Font List | Medium | 35 min |
| 39 | Create Google Fonts Integration | High | 60 min |
| 40 | Create Font Preview | Medium | 40 min |
| 41 | Create Font Size Scale | Low | 20 min |
| 42 | Create Line Height Setting | Low | 20 min |
| 43 | Create Font Weight Options | Low | 25 min |
| 44 | Create Apply Fonts | Medium | 40 min |

---

## Task 35: Create Typography Section

### Overview
Create the typography settings section within the theme customizer. This section organizes all typography-related controls including font family selection, size scales, line height, and font weights. It serves as the container for all typography customization features.

### Dependencies
- Task 34 (Layout Section from Group B) must be complete
- Theme context and state management established
- CSS variables system configured

### Instructions

1. **Create typography components directory**
   - Navigate to `frontend/components/storefront/theme/` directory
   - Create new directory named `Typography`
   - This will house all typography-related components

2. **Create TypographySettings component file**
   - Create `TypographySettings.tsx` in the Typography directory
   - Set up TypeScript React functional component structure
   - Import necessary hooks and context

3. **Import theme context**
   - Import theme context to access current typography settings
   - Import update functions for typography changes
   - Set up state management for local UI state

4. **Define section structure**
   - Create main section container with proper heading
   - Add section title "Typography & Fonts"
   - Include description text explaining the purpose

5. **Organize subsections**
   - Font Selection subsection (heading and body fonts)
   - Font Scale subsection (size and line height)
   - Font Styling subsection (weight options)
   - Apply/Reset action buttons

6. **Implement section layout**
   - Use card or panel styling for visual separation
   - Add proper padding and spacing
   - Ensure responsive layout for mobile devices

7. **Add section controls**
   - Include expand/collapse functionality (optional)
   - Add reset typography button
   - Provide apply changes confirmation

### Section Structure

```
┌────────────────────────────────────────────┐
│  Typography & Fonts                        │
│  Customize fonts, sizes, and spacing      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Font Selection                      │ │
│  │  • Heading Font Selector             │ │
│  │  • Body Font Selector                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Font Scale                          │ │
│  │  • Base Size Selector                │ │
│  │  • Line Height Selector              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │  Font Styling                        │ │
│  │  • Heading Weight Options            │ │
│  │  • Body Weight Options               │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Reset Typography]  [Apply Changes]      │
└────────────────────────────────────────────┘
```

### Section Organization

| Subsection | Contents | Purpose |
|------------|----------|---------|
| Font Selection | Heading & body font dropdowns | Choose font families |
| Font Scale | Size & line height controls | Adjust spacing |
| Font Styling | Weight options | Set font weights |
| Actions | Reset & apply buttons | Manage changes |

### Typography State Structure

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| headingFont | string | "Inter" | Heading font family |
| bodyFont | string | "Inter" | Body text font family |
| fontSize | number | 16 | Base font size (px) |
| lineHeight | number | 1.5 | Base line height ratio |
| headingWeight | number | 700 | Heading font weight |
| bodyWeight | number | 400 | Body font weight |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isCollapsed | boolean | No | false | Initial collapsed state |
| onUpdate | function | No | - | Callback on settings update |
| className | string | No | "" | Additional CSS classes |

### Layout Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `space-y-6 p-6` | Main section spacing |
| Header | `text-lg font-semibold text-gray-900` | Section title |
| Description | `text-sm text-gray-600 mt-1` | Explanatory text |
| Subsection | `border border-gray-200 rounded-lg p-4` | Grouped controls |
| Actions | `flex gap-3 justify-end mt-6` | Button container |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Section Heading | Use semantic heading tag (h2 or h3) |
| Labels | Associate all inputs with labels |
| Focus Management | Maintain logical tab order |
| Screen Readers | Provide descriptive aria-labels |

### Expected Outcome
- Organized typography section with clear structure
- All subsections properly labeled and grouped
- Responsive layout for all device sizes
- Accessible controls with proper semantics

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/TypographySettings.tsx` created
- [ ] Section title and description displayed
- [ ] Subsections organized logically
- [ ] Proper spacing and layout applied
- [ ] Theme context integrated
- [ ] Component exports properly
- [ ] Responsive on mobile and desktop

---

## Task 36: Create Heading Font Selector

### Overview
Create the heading font selector component that allows users to choose the primary font for all heading elements (h1-h6) in the storefront theme. This component provides a dropdown interface with font preview, Google Fonts integration, and real-time visual feedback.

### Dependencies
- Task 35: Create Typography Section
- Task 38: Create Font List (for available fonts)

### Instructions

1. **Create FontSelector component file**
   - Create `FontSelector.tsx` in the Typography directory
   - Design as reusable component for both heading and body fonts
   - Accept props to distinguish between heading and body usage

2. **Define component props interface**
   - Include label prop for "Heading Font" or "Body Font"
   - Include value prop for currently selected font
   - Include onChange callback for font selection
   - Include fontType prop ("heading" or "body")

3. **Import font list**
   - Import available fonts list (from Task 38)
   - Filter fonts by category if needed
   - Ensure popular fonts are easily accessible

4. **Implement dropdown selector**
   - Use select element or custom dropdown component
   - Display font names in the dropdown
   - Render each option in its respective font family

5. **Add font preview in dropdown**
   - Apply actual font to each dropdown option
   - Show "Aa" or font name in that font
   - Include fallback fonts for loading states

6. **Implement search functionality (optional)**
   - Add search/filter input for large font lists
   - Filter fonts as user types
   - Highlight matching results

7. **Handle font selection**
   - Trigger onChange callback when font selected
   - Update theme context with new font
   - Initiate font loading if not already loaded

8. **Add visual indicators**
   - Show checkmark for currently selected font
   - Display loading spinner when font is loading
   - Indicate if font is already loaded

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | Yes | - | Selector label text |
| value | string | Yes | - | Currently selected font |
| onChange | function | Yes | - | Font selection handler |
| fontType | "heading" \| "body" | Yes | - | Font usage type |
| placeholder | string | No | "Select font" | Placeholder text |
| className | string | No | "" | Additional CSS classes |

### Font Selector Layout

```
┌─────────────────────────────────────────┐
│  Heading Font                           │
│  ┌───────────────────────────────────┐ │
│  │ Inter              ▼              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Dropdown Options:                      │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Inter        (in Inter font)   │ │
│  │   Roboto       (in Roboto font)  │ │
│  │   Open Sans    (in Open Sans)    │ │
│  │   Playfair     (in Playfair)     │ │
│  │   Montserrat   (in Montserrat)   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Font Categories

| Category | Characteristics | Example Fonts |
|----------|----------------|---------------|
| Sans-serif | Clean, modern, readable | Inter, Roboto, Open Sans |
| Serif | Traditional, elegant | Merriweather, Playfair Display |
| Display | Bold, decorative | Poppins, Montserrat, Bebas Neue |
| Monospace | Code-like, technical | Roboto Mono, Source Code Pro |

### Dropdown Behavior

| Action | Behavior |
|--------|----------|
| Click selector | Open dropdown with font list |
| Hover option | Highlight option |
| Click option | Select font and close dropdown |
| Click outside | Close dropdown without selection |
| Keyboard navigation | Arrow keys to navigate, Enter to select |

### Font Preview Display

| Element | Style | Purpose |
|---------|-------|---------|
| Font Name | Displayed in its own font | Visual preview |
| Sample Text | "Aa" or "The quick brown fox" | Demonstrate appearance |
| Font Info | Category (sans, serif) | Classification |

### Integration with Theme Context

| Step | Action |
|------|--------|
| 1 | User selects font from dropdown |
| 2 | Component calls onChange with font name |
| 3 | Parent updates theme context |
| 4 | Font loader initiates font download |
| 5 | CSS variables updated with new font |

### Expected Outcome
- Functional heading font selector with dropdown
- Font preview in dropdown options
- Real-time font selection and application
- Smooth user experience with loading states

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/FontSelector.tsx` created
- [ ] Component accepts all required props
- [ ] Dropdown displays available fonts
- [ ] Each option previews in its font
- [ ] Font selection triggers onChange callback
- [ ] Currently selected font indicated
- [ ] Accessible keyboard navigation
- [ ] Component exports properly

---

## Task 37: Create Body Font Selector

### Overview
Create the body font selector component that allows users to choose the font for all body text, paragraphs, and general content in the storefront theme. This component reuses the FontSelector component created in Task 36 but configured specifically for body text usage.

### Dependencies
- Task 35: Create Typography Section
- Task 36: Create Heading Font Selector

### Instructions

1. **Integrate FontSelector component**
   - Import FontSelector component from Task 36
   - Configure for body font usage
   - Pass appropriate props and handlers

2. **Define body font context**
   - Access current body font from theme context
   - Set up state for body font selection
   - Create update handler for body font changes

3. **Configure body-specific settings**
   - Set label to "Body Font" or "Body Text Font"
   - Use fontType prop as "body"
   - Provide current body font as value

4. **Implement font change handler**
   - Create callback function for font selection
   - Update theme context with new body font
   - Trigger font loading if necessary

5. **Add body font recommendations**
   - Display helper text suggesting readable fonts
   - Recommend sans-serif fonts for body text
   - Warn if font might reduce readability

6. **Implement font pairing suggestions**
   - Show complementary fonts based on heading font
   - Suggest popular pairings (e.g., Playfair + Open Sans)
   - Provide "use same as heading" quick option

7. **Add preview for body text**
   - Show sample paragraph in selected font
   - Display multiple font sizes (14px, 16px, 18px)
   - Demonstrate line height and readability

### Component Usage

```
<FontSelector
  label="Body Font"
  value={theme.bodyFont}
  onChange={handleBodyFontChange}
  fontType="body"
  placeholder="Select body font"
/>
```

### Body Font Considerations

| Factor | Consideration | Recommendation |
|--------|--------------|----------------|
| Readability | High priority for body text | Use sans-serif or readable serif |
| Size | Body text typically smaller | Ensure legibility at 14-16px |
| Line Height | More spacing for comfort | 1.5-1.75 recommended |
| Weight | Not too bold or light | 400-500 range |

### Font Pairing Recommendations

| Heading Font | Recommended Body Fonts | Style |
|--------------|----------------------|-------|
| Playfair Display | Open Sans, Lato | Classic elegance |
| Montserrat | Merriweather, Lora | Modern + traditional |
| Bebas Neue | Roboto, Source Sans Pro | Bold + clean |
| Inter | Inter, Roboto | Consistent modern |
| Poppins | Open Sans, Nunito | Friendly + approachable |

### Body Font Selection Flow

```
User Opens Body Font Selector
        │
        ├─→ View Available Fonts
        │   (Filtered for readability)
        │
        ├─→ Preview Fonts in Dropdown
        │   (Sample text in each font)
        │
        ├─→ Select Font
        │
        ├─→ Font Loads (if needed)
        │
        └─→ Applied to Body Text
            (CSS variables updated)
```

### Helper Text Examples

| Scenario | Helper Text |
|----------|-------------|
| Default | "Choose a readable font for body content" |
| Heading Set | "Pairs well with [Heading Font]" |
| Same Font | "Using same font as headings for consistency" |
| Display Font | "Display fonts may reduce readability for body text" |

### Sample Preview Text

| Preview Type | Text |
|--------------|------|
| Short | "The quick brown fox jumps over the lazy dog" |
| Medium | "This is how your body text will appear. Choose a font that is comfortable to read for longer periods." |
| Long | Full paragraph demonstrating font at various sizes |

### Accessibility Guidelines

| Guideline | Implementation |
|-----------|----------------|
| Minimum Size | Warn if font looks small below 14px |
| Contrast | Ensure sufficient contrast with background |
| Dyslexia | Suggest dyslexia-friendly fonts (OpenDyslexic) |
| Readability | Score fonts based on readability metrics |

### Expected Outcome
- Functional body font selector using reusable component
- Font pairing suggestions displayed
- Body text preview with sample content
- Accessibility considerations integrated

### Verification Checklist
- [ ] Body font selector implemented using FontSelector
- [ ] Connected to theme context for body font
- [ ] Font change handler updates theme correctly
- [ ] Font pairing suggestions displayed (optional)
- [ ] Sample body text preview shown
- [ ] Helper text provides guidance
- [ ] Accessibility warnings for poor choices
- [ ] Component integrates into TypographySettings

---

## Task 38: Create Font List

### Overview
Create a comprehensive list of available fonts for the theme customizer. This list includes popular Google Fonts across various categories (sans-serif, serif, display, monospace) with metadata such as font weights, variants, and categories. The font list serves as the data source for the font selectors.

### Dependencies
- Task 36: Create Heading Font Selector
- Task 37: Create Body Font Selector

### Instructions

1. **Create font list file**
   - Create `FontList.tsx` or `fontList.ts` in Typography directory
   - Alternatively, create in `lib/theme/` directory
   - Structure as TypeScript module for type safety

2. **Define font interface**
   - Create TypeScript interface for font metadata
   - Include: id, name, category, weights, variants
   - Add popularity score or recommendation level

3. **Curate sans-serif fonts**
   - Include popular options: Inter, Roboto, Open Sans
   - Add modern choices: Poppins, Montserrat, Nunito
   - Include system fallbacks: -apple-system, system-ui

4. **Curate serif fonts**
   - Include classic options: Merriweather, Lora
   - Add elegant choices: Playfair Display, Crimson Text
   - Include traditional: Georgia, Times New Roman

5. **Curate display fonts**
   - Include bold options: Bebas Neue, Oswald
   - Add decorative: Pacifico, Dancing Script
   - Provide variety for headings

6. **Add font metadata**
   - List available weights (400, 500, 600, 700)
   - Specify italic variants availability
   - Include category classification

7. **Organize font list**
   - Sort by popularity or alphabetically
   - Group by category
   - Mark recommended fonts for beginners

8. **Add font descriptions**
   - Brief description of font style
   - Suggested use cases
   - Pairing recommendations

### Font Interface Definition

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| family | string | CSS font-family value |
| category | "sans-serif" \| "serif" \| "display" \| "monospace" | Font classification |
| weights | number[] | Available font weights |
| hasItalic | boolean | Italic variant available |
| popularity | number | Popularity score (1-100) |
| recommended | boolean | Recommended for body text |
| pairsWith | string[] | Complementary font IDs |

### Sans-Serif Fonts

| Font Name | Weights | Use Case | Popularity |
|-----------|---------|----------|------------|
| Inter | 400-900 | Modern, versatile | Very High |
| Roboto | 300-900 | Clean, professional | Very High |
| Open Sans | 300-800 | Friendly, readable | Very High |
| Lato | 300-900 | Warm, approachable | High |
| Poppins | 400-700 | Geometric, modern | High |
| Montserrat | 400-900 | Bold, contemporary | High |
| Nunito | 400-800 | Rounded, friendly | Medium |
| Source Sans Pro | 400-900 | Professional | Medium |

### Serif Fonts

| Font Name | Weights | Use Case | Popularity |
|-----------|---------|----------|------------|
| Merriweather | 400-900 | Elegant, readable | High |
| Lora | 400-700 | Classic, refined | High |
| Playfair Display | 400-900 | Dramatic, editorial | High |
| Crimson Text | 400-700 | Traditional, book-like | Medium |
| PT Serif | 400-700 | Versatile, digital | Medium |

### Display Fonts

| Font Name | Weights | Use Case | Popularity |
|-----------|---------|----------|------------|
| Bebas Neue | 400 | Headlines, impact | High |
| Oswald | 400-700 | Bold, condensed | High |
| Pacifico | 400 | Playful, casual | Medium |
| Righteous | 400 | Bold, distinctive | Medium |

### Font List Structure

```typescript
{
  id: "inter",
  name: "Inter",
  family: "'Inter', sans-serif",
  category: "sans-serif",
  weights: [400, 500, 600, 700, 800],
  hasItalic: true,
  popularity: 95,
  recommended: true,
  pairsWith: ["merriweather", "lora"],
  description: "Modern sans-serif with excellent readability"
}
```

### Font Categories Organization

```
Fonts Library
│
├── Sans-Serif (15-20 fonts)
│   ├── Modern (Inter, Roboto)
│   ├── Geometric (Poppins, Montserrat)
│   └── Humanist (Open Sans, Lato)
│
├── Serif (10-15 fonts)
│   ├── Traditional (Merriweather, Lora)
│   ├── Display (Playfair Display)
│   └── Slab (Roboto Slab)
│
├── Display (5-10 fonts)
│   ├── Headlines (Bebas Neue, Oswald)
│   └── Decorative (Pacifico)
│
└── Monospace (3-5 fonts)
    └── Code (Roboto Mono, Fira Code)
```

### Font Filtering Options

| Filter | Purpose | Example |
|--------|---------|---------|
| Category | Filter by font type | "Show only sans-serif" |
| Recommended | Show beginner-friendly fonts | "Recommended for body text" |
| Popularity | Sort by usage frequency | "Most popular first" |
| Search | Find by name | "Search: rob..." → Roboto |

### Font Fallback Stacks

| Category | Fallback Stack |
|----------|----------------|
| Sans-serif | -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif |
| Serif | Georgia, "Times New Roman", Times, serif |
| Display | Impact, "Arial Black", sans-serif |
| Monospace | Consolas, Monaco, "Courier New", monospace |

### Expected Outcome
- Comprehensive font list with 30-40 quality fonts
- Complete metadata for each font
- Organized by category and popularity
- Ready for integration with font selectors

### Verification Checklist
- [ ] Font list file created with all fonts
- [ ] TypeScript interface defined for fonts
- [ ] 15+ sans-serif fonts included
- [ ] 10+ serif fonts included
- [ ] 5+ display fonts included
- [ ] All fonts have complete metadata
- [ ] Fonts organized by category
- [ ] Popularity and recommendations set
- [ ] Fallback stacks defined
- [ ] Module exports properly

---

## Task 39: Create Google Fonts Integration

### Overview
Create the Google Fonts integration system that dynamically loads selected fonts from the Google Fonts API. This system handles font URL construction, API requests, font loading, caching, and error handling. It ensures fonts are available when users select them from the font selectors.

### Dependencies
- Task 38: Create Font List
- Google Fonts API access (public, no key required)

### Instructions

1. **Create Google Fonts utility file**
   - Create `googleFonts.ts` in `lib/theme/` directory
   - Structure as utility module with exported functions
   - Add TypeScript types for type safety

2. **Define Google Fonts API interface**
   - Create types for API response
   - Define font loading options (weights, display)
   - Handle API URL construction

3. **Implement font URL builder**
   - Create function to construct Google Fonts API URL
   - Accept font family name as parameter
   - Include weight variants (400, 500, 600, 700)
   - Add display=swap for font loading optimization

4. **Create font loading function**
   - Implement dynamic font loading via link element
   - Create link element with Google Fonts URL
   - Append to document head
   - Handle loading completion and errors

5. **Implement font caching**
   - Track already loaded fonts to prevent duplicates
   - Use Set or Map to store loaded font names
   - Check cache before loading new font

6. **Add preconnect optimization**
   - Add preconnect link for fonts.googleapis.com
   - Add preconnect for fonts.gstatic.com
   - Improves font loading performance

7. **Handle multiple font loading**
   - Create function to load multiple fonts at once
   - Combine multiple fonts in single API request when possible
   - Use Promise.all for parallel loading

8. **Implement error handling**
   - Catch font loading failures
   - Provide fallback to system fonts
   - Log errors for debugging
   - Display user-friendly error messages

### Google Fonts API URL Structure

```
Base URL:
https://fonts.googleapis.com/css2?

Font Family:
family=Inter:wght@400;500;600;700

Display:
&display=swap

Complete URL:
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
```

### Font Loading Function Signature

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| loadGoogleFont | fontFamily: string, weights?: number[] | Promise<void> | Load single font |
| loadMultipleFonts | fonts: FontConfig[] | Promise<void[]> | Load multiple fonts |
| isFontLoaded | fontFamily: string | boolean | Check if loaded |
| preconnectGoogleFonts | - | void | Add preconnect links |

### Font Loading States

```
Initial State
    │
    ├─→ Check Cache
    │   ├─→ Already Loaded ──→ Return (Skip)
    │   └─→ Not Loaded ──→ Continue
    │
    ├─→ Construct URL
    │   (with weights and options)
    │
    ├─→ Create Link Element
    │   (add to document head)
    │
    ├─→ Wait for Load
    │   ├─→ Success ──→ Add to Cache
    │   └─→ Error ──→ Handle Fallback
    │
    └─→ Font Ready
```

### Font Weights Configuration

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, default |
| 500 | Medium | Emphasized text |
| 600 | Semi-bold | Subheadings |
| 700 | Bold | Headings, buttons |
| 800 | Extra-bold | Display text (optional) |

### Caching Strategy

| Cache Type | Implementation | Purpose |
|------------|----------------|---------|
| Memory | JavaScript Set/Map | Track loaded fonts in session |
| Local Storage | Store loaded font names | Persist across page loads |
| Service Worker | Cache font files | Offline availability (advanced) |

### Preconnect Implementation

| Domain | Purpose | Priority |
|--------|---------|----------|
| fonts.googleapis.com | Google Fonts API | High |
| fonts.gstatic.com | Font file hosting | High |

### Error Handling Scenarios

| Error | Cause | Handling |
|-------|-------|----------|
| Network failure | No internet connection | Use system font fallback |
| Font not found | Invalid font name | Log error, use fallback |
| Timeout | Slow connection | Retry once, then fallback |
| Blocked request | Ad blocker, CSP | Inform user, use fallback |

### Multiple Font Loading

| Strategy | When to Use | Advantage |
|----------|-------------|-----------|
| Single Request | Loading 1-2 fonts | Simpler implementation |
| Combined Request | Loading 3+ fonts | Fewer HTTP requests |
| Parallel Requests | Independent fonts | Faster with HTTP/2 |

### Font Display Options

| Option | Behavior | Use Case |
|--------|----------|----------|
| swap | Use fallback, swap when ready | Recommended default |
| block | Block rendering briefly | Critical fonts |
| fallback | Shorter block, faster timeout | Performance priority |
| optional | Use if available quickly | Non-critical fonts |

### Google Fonts API Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| CSS2 API | Use /css2 endpoint | Better compression |
| Variable Fonts | Add wght axis | Single file, all weights |
| Unicode Ranges | Subset fonts | Smaller file sizes |
| Font Display | Add display parameter | Control loading behavior |

### Expected Outcome
- Robust Google Fonts integration system
- Dynamic font loading with caching
- Error handling and fallbacks
- Optimized loading performance

### Verification Checklist
- [ ] `lib/theme/googleFonts.ts` file created
- [ ] Font URL construction function implemented
- [ ] Font loading function works correctly
- [ ] Caching system prevents duplicate loads
- [ ] Preconnect links added for optimization
- [ ] Error handling for network failures
- [ ] Multiple font loading supported
- [ ] Font display set to "swap"
- [ ] TypeScript types defined
- [ ] Module exports all necessary functions

---

## Task 40: Create Font Preview

### Overview
Create a font preview component that displays sample text in the selected font, allowing users to see how their font choices will appear in the storefront. The preview shows various heading levels, body text, and different font sizes to give a comprehensive view of the typography system.

### Dependencies
- Task 39: Create Google Fonts Integration
- Selected fonts must be loaded before preview

### Instructions

1. **Create FontPreview component file**
   - Create `FontPreview.tsx` in Typography directory
   - Set up React functional component
   - Import theme context for font values

2. **Define preview component props**
   - Include fontFamily prop for font to preview
   - Include fontType prop ("heading" or "body")
   - Include optional sampleText prop for custom text

3. **Design preview layout**
   - Create structured preview showing hierarchy
   - Include heading samples (H1, H2, H3)
   - Include paragraph/body text samples
   - Show font at various sizes

4. **Implement real-time preview**
   - Apply selected font to preview elements
   - Update preview when font changes
   - Show loading state while font loads

5. **Add preview controls**
   - Toggle between light and dark backgrounds
   - Adjust preview text size
   - Switch between sample texts

6. **Display font information**
   - Show font name and category
   - Display selected weights
   - Indicate if font is loaded

7. **Handle loading states**
   - Show skeleton or placeholder while loading
   - Display spinner for font loading
   - Smoothly transition when font ready

8. **Add accessibility features**
   - Ensure preview maintains readable contrast
   - Provide text alternatives
   - Support keyboard navigation for controls

### Preview Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| fontFamily | string | Yes | - | Font to preview |
| fontType | "heading" \| "body" | Yes | - | Font usage context |
| sampleText | string | No | Default samples | Custom preview text |
| showInfo | boolean | No | true | Display font metadata |
| className | string | No | "" | Additional CSS classes |

### Preview Layout Structure

```
┌─────────────────────────────────────────┐
│  Font Preview                           │
│                                         │
│  Inter (Sans-serif)         [Settings] │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  The Quick Brown Fox             │ │  ← H1 Sample
│  │  Jumps Over The Lazy Dog         │ │  ← H2 Sample
│  │  The five boxing wizards         │ │  ← H3 Sample
│  │                                   │ │
│  │  This is how your body text will │ │  ← Paragraph
│  │  appear. Choose a font that is   │ │
│  │  comfortable to read.             │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Weights: 400, 600, 700    [Light/Dark]│
└─────────────────────────────────────────┘
```

### Sample Text Options

| Sample Type | Text | Purpose |
|-------------|------|---------|
| Pangram | "The quick brown fox jumps over the lazy dog" | Shows all letters |
| Heading | "Welcome to Our Store" | Realistic heading |
| Body | "Browse our collection of premium products..." | Realistic paragraph |
| Numbers | "1234567890 $19.99" | Show numerals |
| Mixed | Combination of above | Comprehensive preview |

### Preview Elements Display

| Element | Font Size | Font Weight | Sample Text |
|---------|-----------|-------------|-------------|
| H1 | 36px (2.25rem) | 700 | "Large Heading" |
| H2 | 30px (1.875rem) | 600 | "Section Title" |
| H3 | 24px (1.5rem) | 600 | "Subsection" |
| Body | 16px (1rem) | 400 | Full paragraph |
| Small | 14px (0.875rem) | 400 | "Small text" |

### Background Toggle Options

| Mode | Background | Text Color | Purpose |
|------|------------|------------|---------|
| Light | White/Light gray | Dark gray/Black | Default view |
| Dark | Dark gray/Black | White/Light gray | Dark mode preview |

### Loading States

```
Initial State → Checking Font
      │
      ├─→ Font Loading
      │   (Show skeleton/spinner)
      │
      ├─→ Font Loaded
      │   (Display preview)
      │
      └─→ Font Error
          (Show error + fallback)
```

### Font Information Display

| Info Item | Display |
|-----------|---------|
| Font Name | "Inter" |
| Category | "Sans-serif" |
| Weights | "400, 500, 600, 700" |
| Variants | "Normal, Italic" |
| Status | "Loaded" / "Loading" / "Error" |

### Preview Interactions

| Control | Action | Effect |
|---------|--------|--------|
| Light/Dark Toggle | Switch background | Preview on different backgrounds |
| Size Slider | Adjust base size | See font at various sizes |
| Text Input | Custom text | Preview with user content |
| Refresh | Reload font | Force font refresh |

### Responsive Preview

| Screen Size | Adjustments |
|-------------|-------------|
| Mobile | Smaller preview area, stacked layout |
| Tablet | Medium preview area, side-by-side if space |
| Desktop | Full preview area, all elements visible |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Color Contrast | Minimum 4.5:1 ratio maintained |
| Font Scaling | Respects user preferences |
| Screen Reader | Announces font changes |
| Keyboard | All controls keyboard accessible |

### Expected Outcome
- Interactive font preview with sample text
- Real-time updates when font changes
- Multiple preview elements (headings, body)
- Background toggle for contrast checking

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/FontPreview.tsx` created
- [ ] Preview displays heading samples (H1, H2, H3)
- [ ] Preview displays body text samples
- [ ] Selected font applied to preview elements
- [ ] Loading state shown while font loads
- [ ] Light/dark background toggle works
- [ ] Font information displayed correctly
- [ ] Preview updates when font changes
- [ ] Accessible to keyboard and screen readers
- [ ] Component exports properly

---

## Task 41: Create Font Size Scale

### Overview
Create the font size scale selector that allows users to adjust the base font size for the entire theme. This control affects all text elements through a proportional scaling system, maintaining visual hierarchy while accommodating user preferences for larger or smaller text.

### Dependencies
- Task 35: Create Typography Section

### Instructions

1. **Create FontSizeScale component file**
   - Create `FontSizeScale.tsx` in Typography directory
   - Set up React functional component
   - Import theme context for size values

2. **Define size scale options**
   - Create predefined size options (Small, Medium, Large, Extra Large)
   - Map to pixel values (14px, 16px, 18px, 20px)
   - Set Medium (16px) as default

3. **Design scale selector interface**
   - Use radio buttons or segmented control
   - Display size labels (Small, Medium, Large, XL)
   - Show pixel values alongside labels

4. **Implement visual size preview**
   - Show sample text at each size option
   - Update preview in real-time as user hovers
   - Display current selection clearly

5. **Calculate relative sizes**
   - Define how base size affects heading sizes
   - Maintain proportional relationships
   - Update CSS custom properties

6. **Add scale adjustment handler**
   - Capture size selection changes
   - Update theme context with new base size
   - Recalculate all derived font sizes

7. **Implement accessibility features**
   - Support for user font size preferences
   - Ensure minimum readable sizes
   - Respect browser zoom settings

8. **Add reset to default option**
   - Include "Reset to Default" button
   - Return to 16px base size
   - Clear any custom adjustments

### Size Scale Options

| Option | Base Size | Use Case | Multiplier |
|--------|-----------|----------|------------|
| Small | 14px | Compact, desktop | 0.875 |
| Medium | 16px | Standard, recommended | 1.0 |
| Large | 18px | Comfortable reading | 1.125 |
| Extra Large | 20px | Accessibility, seniors | 1.25 |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | number | Yes | 16 | Current base size (px) |
| onChange | function | Yes | - | Size change handler |
| showPreview | boolean | No | true | Display size preview |
| className | string | No | "" | Additional CSS classes |

### Scale Selector Layout

```
┌─────────────────────────────────────────┐
│  Base Font Size                         │
│  Adjust the base text size for the     │
│  entire store                           │
│                                         │
│  ○ Small (14px)                        │
│     "Sample text at 14px"              │
│                                         │
│  ● Medium (16px) [Recommended]         │
│     "Sample text at 16px"              │
│                                         │
│  ○ Large (18px)                        │
│     "Sample text at 18px"              │
│                                         │
│  ○ Extra Large (20px)                  │
│     "Sample text at 20px"              │
│                                         │
│  [Reset to Default]                     │
└─────────────────────────────────────────┘
```

### Type Scale Calculation

| Element | Formula | Small (14px) | Medium (16px) | Large (18px) |
|---------|---------|--------------|---------------|--------------|
| Base | base | 14px | 16px | 18px |
| Small | base × 0.875 | 12.25px | 14px | 15.75px |
| H6 | base × 1 | 14px | 16px | 18px |
| H5 | base × 1.125 | 15.75px | 18px | 20.25px |
| H4 | base × 1.25 | 17.5px | 20px | 22.5px |
| H3 | base × 1.5 | 21px | 24px | 27px |
| H2 | base × 1.875 | 26.25px | 30px | 33.75px |
| H1 | base × 2.25 | 31.5px | 36px | 40.5px |

### Size Selection UI Options

| UI Pattern | Pros | Cons | Recommended |
|------------|------|------|-------------|
| Radio Buttons | Clear selection, accessible | Takes more space | Yes |
| Dropdown | Compact | Hides options | No |
| Slider | Granular control | Less precise | Alternative |
| Button Group | Visual, modern | Limited options | Yes |

### CSS Variables Update

| Variable | Formula | Purpose |
|----------|---------|---------|
| --font-size-base | User selection | Base text size |
| --font-size-sm | base × 0.875 | Small text |
| --font-size-lg | base × 1.125 | Large text |
| --font-size-xl | base × 1.25 | Extra large |
| --font-size-2xl | base × 1.5 | 2XL |
| --font-size-3xl | base × 1.875 | 3XL |
| --font-size-4xl | base × 2.25 | 4XL |

### Scale Impact Visualization

```
Extra Large (20px)
━━━━━━━━━━━━━━━━━━━━━
Large (18px)
━━━━━━━━━━━━━━━━━
Medium (16px)
━━━━━━━━━━━━━━
Small (14px)
━━━━━━━━━━━
```

### Accessibility Considerations

| Consideration | Implementation |
|---------------|----------------|
| Minimum Size | Never below 12px for body text |
| User Preference | Respect browser/OS settings |
| WCAG Compliance | Ensure readability at all sizes |
| Zoom Support | Works with browser zoom (100%-200%) |

### Size Recommendations by Use Case

| Use Case | Recommended Size | Reason |
|----------|------------------|--------|
| E-commerce | Medium (16px) | Balanced, professional |
| Content Heavy | Large (18px) | Long-form reading comfort |
| Data Dense | Small (14px) | Fit more information |
| Accessibility | Extra Large (20px) | Visually impaired users |

### Expected Outcome
- Functional font size scale selector
- Multiple size options with preview
- Proportional scaling system
- CSS variables updated correctly

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/FontSizeScale.tsx` created
- [ ] Four size options available (14, 16, 18, 20px)
- [ ] Each option shows preview text
- [ ] Current selection visually indicated
- [ ] onChange handler updates theme context
- [ ] All heading sizes scale proportionally
- [ ] Reset to default button works
- [ ] Accessible keyboard navigation
- [ ] Component exports properly

---

## Task 42: Create Line Height Setting

### Overview
Create the line height setting control that allows users to adjust the vertical spacing between lines of text. Proper line height improves readability and visual comfort, especially for longer content. This control provides predefined options from tight to loose spacing.

### Dependencies
- Task 35: Create Typography Section

### Instructions

1. **Create LineHeightSetting component file**
   - Create `LineHeightSetting.tsx` in Typography directory
   - Set up React functional component
   - Import theme context for line height values

2. **Define line height options**
   - Create predefined options: Tight, Normal, Relaxed, Loose
   - Map to numeric values: 1.25, 1.5, 1.75, 2.0
   - Set Normal (1.5) as default

3. **Design setting control interface**
   - Use radio buttons or segmented control
   - Display descriptive labels
   - Show numeric values alongside labels

4. **Implement visual preview**
   - Show sample paragraph with each line height
   - Display side-by-side or stacked comparison
   - Highlight current selection

5. **Add line height adjustment handler**
   - Capture line height changes
   - Update theme context with new value
   - Apply to all text elements

6. **Calculate context-specific line heights**
   - Different values for headings vs body text
   - Tighter for headings, normal for body
   - Update CSS custom properties

7. **Implement accessibility guidelines**
   - Ensure minimum line height for readability
   - WCAG recommends 1.5 for body text
   - Warn if selection may reduce readability

8. **Add reset option**
   - Include "Reset to Default" button
   - Return to 1.5 line height
   - Clear custom adjustments

### Line Height Options

| Option | Value | Use Case | Readability |
|--------|-------|----------|-------------|
| Tight | 1.25 | Headlines, compact design | Lower |
| Normal | 1.5 | Standard body text | Optimal |
| Relaxed | 1.75 | Long-form reading | High |
| Loose | 2.0 | Accessibility, dyslexia | Very High |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | number | Yes | 1.5 | Current line height |
| onChange | function | Yes | - | Line height change handler |
| showPreview | boolean | No | true | Display preview |
| className | string | No | "" | Additional CSS classes |

### Line Height Selector Layout

```
┌─────────────────────────────────────────┐
│  Line Height                            │
│  Control spacing between lines of text  │
│                                         │
│  ○ Tight (1.25)                        │
│     "Line one of sample text            │
│     Line two shows tight spacing"       │
│                                         │
│  ● Normal (1.5) [Recommended]          │
│     "Line one of sample text            │
│                                         │
│     Line two shows normal spacing"      │
│                                         │
│  ○ Relaxed (1.75)                      │
│     "Line one of sample text            │
│                                         │
│                                         │
│     Line two shows relaxed spacing"     │
│                                         │
│  ○ Loose (2.0)                         │
│     "Line one of sample text            │
│                                         │
│                                         │
│                                         │
│     Line two shows loose spacing"       │
│                                         │
│  [Reset to Default]                     │
└─────────────────────────────────────────┘
```

### Line Height Visual Comparison

```
Tight (1.25):
This is sample text showing tight line height.
It has less space between lines, suitable for
headlines or when space is limited.

Normal (1.5):
This is sample text showing normal line height.

It has comfortable spacing between lines,

recommended for most body text.

Relaxed (1.75):
This is sample text showing relaxed line height.

It has generous spacing between lines,

excellent for long-form reading.

Loose (2.0):
This is sample text showing loose line height.

It has maximum spacing between lines,

helpful for accessibility and dyslexia.
```

### Context-Specific Line Heights

| Element Type | Tight | Normal | Relaxed | Loose |
|--------------|-------|--------|---------|-------|
| Headings | 1.1 | 1.2 | 1.3 | 1.4 |
| Body Text | 1.25 | 1.5 | 1.75 | 2.0 |
| Small Text | 1.3 | 1.55 | 1.8 | 2.05 |
| Buttons | 1.0 | 1.0 | 1.0 | 1.0 |

### CSS Variables Update

| Variable | Formula | Purpose |
|----------|---------|---------|
| --line-height-base | User selection | Base line height |
| --line-height-tight | base - 0.25 | Compact spacing |
| --line-height-heading | base - 0.3 | Heading spacing |
| --line-height-loose | base + 0.25 | Extra spacing |

### Readability Guidelines

| Consideration | Guideline | Reason |
|---------------|-----------|--------|
| WCAG 2.1 | Minimum 1.5 for body text | Accessibility standard |
| Long-form | 1.6-1.8 recommended | Reading comfort |
| Short lines | Can use tighter (1.3-1.4) | Less eye travel |
| Wide columns | Need more spacing (1.75+) | Prevents eye strain |

### Use Case Recommendations

| Scenario | Recommended | Explanation |
|----------|-------------|-------------|
| Product Listings | Tight (1.25) | Compact, information-dense |
| Blog Articles | Relaxed (1.75) | Long-form reading comfort |
| Descriptions | Normal (1.5) | Standard readability |
| Accessibility Mode | Loose (2.0) | Maximum clarity |

### Line Height Effect on Other Properties

| Property | Impact | Adjustment |
|----------|--------|------------|
| Paragraph Spacing | More line height = less bottom margin | Reduce margin-bottom |
| List Item Spacing | Affects list readability | Adjust list-item margin |
| Button Padding | Affects vertical padding | May need adjustment |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Dyslexia Support | Recommend 1.75-2.0 |
| Low Vision | Ensure sufficient spacing |
| Screen Magnification | Test with 200% zoom |
| Reading Mode | Allow user override |

### Expected Outcome
- Functional line height setting control
- Four spacing options with previews
- Real-time updates to text spacing
- Accessibility compliance

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/LineHeightSetting.tsx` created
- [ ] Four line height options available (1.25, 1.5, 1.75, 2.0)
- [ ] Each option shows preview paragraph
- [ ] Current selection visually indicated
- [ ] onChange handler updates theme context
- [ ] CSS variables updated correctly
- [ ] Different line heights for headings vs body
- [ ] Reset to default button works
- [ ] Accessible keyboard navigation
- [ ] Component exports properly

---

## Task 43: Create Font Weight Options

### Overview
Create font weight selectors that allow users to choose the boldness of heading and body text independently. Font weight affects visual hierarchy, readability, and overall aesthetic. This component provides standard weight options from regular to bold.

### Dependencies
- Task 35: Create Typography Section

### Instructions

1. **Create FontWeightOptions component file**
   - Create `FontWeightOptions.tsx` in Typography directory
   - Set up React functional component
   - Import theme context for weight values

2. **Define weight options**
   - Regular (400), Medium (500), Semi-bold (600), Bold (700)
   - Create separate controls for heading and body weights
   - Set appropriate defaults (700 for headings, 400 for body)

3. **Design weight selector interface**
   - Use dropdown or radio buttons
   - Display weight names and numeric values
   - Show visual preview at each weight

4. **Implement heading weight selector**
   - Create dedicated selector for heading font weight
   - Preview showing heading at different weights
   - Apply to all heading levels (H1-H6)

5. **Implement body weight selector**
   - Create dedicated selector for body font weight
   - Preview showing paragraph at different weights
   - Apply to body text, lists, etc.

6. **Add weight preview**
   - Display "Aa" or sample text at each weight
   - Update preview in real-time
   - Show current selection highlighted

7. **Validate weight combinations**
   - Ensure heading weight ≥ body weight
   - Warn if weights are too similar
   - Suggest maintaining visual hierarchy

8. **Handle weight availability**
   - Check if selected font supports chosen weights
   - Show only available weights for current font
   - Fall back to nearest available weight

### Font Weight Options

| Weight Value | Name | Common Usage | Visual Impact |
|--------------|------|--------------|---------------|
| 400 | Regular | Body text, default | Standard |
| 500 | Medium | Emphasized text | Slightly heavier |
| 600 | Semi-bold | Subheadings, buttons | Noticeably bold |
| 700 | Bold | Headings, CTA | Very bold |
| 800 | Extra-bold | Display headlines | Extremely bold |

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| headingWeight | number | Yes | 700 | Current heading weight |
| bodyWeight | number | Yes | 400 | Current body weight |
| onHeadingWeightChange | function | Yes | - | Heading weight handler |
| onBodyWeightChange | function | Yes | - | Body weight handler |
| availableWeights | number[] | No | [400-700] | Available font weights |
| className | string | No | "" | Additional CSS classes |

### Weight Selector Layout

```
┌─────────────────────────────────────────┐
│  Font Weights                           │
│                                         │
│  Heading Weight                         │
│  ┌───────────────────────────────────┐ │
│  │ Bold (700)               ▼        │ │
│  └───────────────────────────────────┘ │
│  Preview: Sample Heading Text           │
│          (shown in weight 700)          │
│                                         │
│  Body Weight                            │
│  ┌───────────────────────────────────┐ │
│  │ Regular (400)            ▼        │ │
│  └───────────────────────────────────┘ │
│  Preview: Sample body text paragraph    │
│          (shown in weight 400)          │
│                                         │
│  [Reset to Defaults]                    │
└─────────────────────────────────────────┘
```

### Weight Combinations

| Heading | Body | Contrast | Recommended |
|---------|------|----------|-------------|
| 700 | 400 | High | ✓ Yes (Standard) |
| 600 | 400 | Medium | ✓ Yes |
| 700 | 500 | Medium | ✓ Yes |
| 600 | 500 | Low | △ Acceptable |
| 500 | 500 | None | ✗ No (Poor hierarchy) |
| 400 | 600 | Inverted | ✗ No (Wrong hierarchy) |

### Weight Preview Display

```
Regular (400)
Sample Text in Regular Weight

Medium (500)
Sample Text in Medium Weight

Semi-bold (600)
Sample Text in Semi-bold Weight

Bold (700)
Sample Text in Bold Weight
```

### Visual Hierarchy Guidelines

| Principle | Implementation |
|-----------|----------------|
| Contrast | Headings should be bolder than body |
| Consistency | Use consistent weights throughout |
| Readability | Body text typically 400 or 500 |
| Emphasis | Headings typically 600-700 |

### Font Weight Availability Check

| Font | Available Weights | Notes |
|------|-------------------|-------|
| Inter | 400-900 | Full range |
| Roboto | 300-900 | Full range |
| Playfair | 400-900 | Limited to specific values |
| Bebas Neue | 400 | Single weight only |

### CSS Variables Update

| Variable | Source | Purpose |
|----------|--------|---------|
| --font-weight-heading | User selection | All heading elements |
| --font-weight-body | User selection | Body text |
| --font-weight-medium | body + 100 | Emphasized text |
| --font-weight-bold | heading | Bold inline text |

### Weight Selection UI

| UI Element | Options | Display |
|------------|---------|---------|
| Heading Dropdown | 400-700 | "Bold (700)" |
| Body Dropdown | 400-600 | "Regular (400)" |
| Preview | Real-time | Sample text |
| Warning | Conditional | "Weights too similar" |

### Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| Hierarchy | Heading ≥ Body | Allow if true |
| Same Weight | Heading = Body | Warn user |
| Inverted | Heading < Body | Block/warn |
| Availability | Weight in font | Fallback to nearest |

### Responsive Considerations

| Screen Size | Adjustment |
|-------------|------------|
| Mobile | May reduce weights for performance |
| Tablet | Standard weights |
| Desktop | Full weight range available |

### Expected Outcome
- Functional font weight selectors for heading and body
- Visual preview at each weight
- Validation for proper hierarchy
- CSS variables updated correctly

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Typography/FontWeightOptions.tsx` created
- [ ] Heading weight selector implemented
- [ ] Body weight selector implemented
- [ ] Weight options (400, 500, 600, 700) available
- [ ] Visual preview for each weight
- [ ] Validation prevents poor combinations
- [ ] Warning shown for similar weights
- [ ] CSS variables updated on change
- [ ] Checks font weight availability
- [ ] Reset to defaults button works
- [ ] Component exports properly

---

## Task 44: Create Apply Fonts

### Overview
Create the font application function that takes user-selected typography settings and applies them to the theme by updating CSS custom properties (CSS variables). This function serves as the bridge between the typography controls and the actual visual output, ensuring all text elements throughout the storefront reflect the chosen settings.

### Dependencies
- Task 39: Create Google Fonts Integration
- Task 41: Create Font Size Scale
- Task 42: Create Line Height Setting
- Task 43: Create Font Weight Options

### Instructions

1. **Create apply fonts utility file**
   - Create `applyFonts.ts` in `lib/theme/` directory
   - Structure as utility module with exported functions
   - Include TypeScript interfaces for type safety

2. **Define typography configuration interface**
   - Create interface for complete typography settings
   - Include: headingFont, bodyFont, fontSize, lineHeight, weights
   - Add validation and default values

3. **Implement CSS variable update function**
   - Create function to update CSS custom properties
   - Target document root element (:root)
   - Update all typography-related variables

4. **Map font selections to CSS variables**
   - Heading font → --font-heading
   - Body font → --font-body
   - Base size → --font-size-base
   - Line height → --line-height-base
   - Weights → --font-weight-heading, --font-weight-body

5. **Calculate derived values**
   - Compute font size scale from base size
   - Calculate heading line heights (tighter than body)
   - Generate complete font stack with fallbacks

6. **Integrate with font loader**
   - Ensure fonts are loaded before applying
   - Handle loading state and errors
   - Apply fallback fonts if loading fails

7. **Implement atomic updates**
   - Apply all changes together to prevent FOUC
   - Use requestAnimationFrame for smooth transitions
   - Batch CSS variable updates

8. **Add persistence option**
   - Save typography settings to localStorage
   - Restore settings on page load
   - Handle migration for setting schema changes

### Typography Configuration Interface

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| headingFont | string | Yes | "Inter" | Heading font family |
| bodyFont | string | Yes | "Inter" | Body font family |
| fontSize | number | Yes | 16 | Base font size (px) |
| lineHeight | number | Yes | 1.5 | Base line height |
| headingWeight | number | Yes | 700 | Heading font weight |
| bodyWeight | number | Yes | 400 | Body font weight |

### CSS Variables Mapping

| Typography Setting | CSS Variable | Value Format |
|-------------------|--------------|--------------|
| Heading Font | --font-heading | "'Inter', sans-serif" |
| Body Font | --font-body | "'Inter', sans-serif" |
| Base Size | --font-size-base | "16px" |
| Line Height | --line-height-base | "1.5" |
| Heading Weight | --font-weight-heading | "700" |
| Body Weight | --font-weight-body | "400" |

### Font Application Flow

```
User Adjusts Typography Settings
        │
        ├─→ Validate Settings
        │   (Check required fields)
        │
        ├─→ Load Fonts
        │   (Google Fonts if needed)
        │
        ├─→ Calculate Derived Values
        │   (Size scale, line heights)
        │
        ├─→ Construct Font Stacks
        │   (With fallbacks)
        │
        ├─→ Update CSS Variables
        │   (Batch update to :root)
        │
        ├─→ Save to Storage
        │   (Persist for next session)
        │
        └─→ Typography Applied
            (Visual update complete)
```

### Derived Values Calculation

| Derived Value | Formula | Purpose |
|---------------|---------|---------|
| font-size-sm | base × 0.875 | Small text |
| font-size-lg | base × 1.125 | Large text |
| font-size-xl | base × 1.25 | Extra large |
| font-size-2xl | base × 1.5 | 2X large |
| font-size-3xl | base × 1.875 | 3X large |
| font-size-4xl | base × 2.25 | 4X large |
| line-height-heading | base - 0.3 | Tighter for headings |
| line-height-tight | base - 0.25 | Compact spacing |

### Font Stack Construction

| Font Type | Stack Construction | Example |
|-----------|-------------------|---------|
| Sans-serif | [Font], -apple-system, sans-serif | "Inter, -apple-system, sans-serif" |
| Serif | [Font], Georgia, serif | "Merriweather, Georgia, serif" |
| Display | [Font], Impact, sans-serif | "Bebas Neue, Impact, sans-serif" |
| Monospace | [Font], Consolas, monospace | "Roboto Mono, Consolas, monospace" |

### CSS Variable Update Implementation

```typescript
function applyFonts(config: TypographyConfig) {
  // Get document root
  const root = document.documentElement;
  
  // Update font families
  root.style.setProperty('--font-heading', config.headingFont);
  root.style.setProperty('--font-body', config.bodyFont);
  
  // Update sizes
  root.style.setProperty('--font-size-base', `${config.fontSize}px`);
  root.style.setProperty('--line-height-base', config.lineHeight);
  
  // Update weights
  root.style.setProperty('--font-weight-heading', config.headingWeight);
  root.style.setProperty('--font-weight-body', config.bodyWeight);
  
  // Calculate and apply derived values
  applyDerivedValues(config);
}
```

### Batch Update Strategy

| Step | Action | Benefit |
|------|--------|---------|
| 1. Collect | Gather all variable updates | Organize changes |
| 2. Validate | Check all values | Prevent errors |
| 3. Batch | Apply all at once | Single reflow |
| 4. Animate | Use transitions | Smooth update |

### Error Handling

| Error Type | Handling | Fallback |
|------------|----------|----------|
| Font load failure | Use system font | Apply default stack |
| Invalid size | Use default (16px) | Log warning |
| Missing weight | Use nearest available | Log info |
| CSS variable error | Skip variable | Continue with others |

### Persistence Strategy

| Storage | Key | Value |
|---------|-----|-------|
| localStorage | 'theme-typography' | JSON config |
| Session | 'temp-typography' | Temporary changes |
| Cookie | 'typography' | Server-side sync |

### Performance Considerations

| Optimization | Implementation | Impact |
|--------------|----------------|--------|
| Batching | Single DOM update | Minimize reflow |
| RAF | Use requestAnimationFrame | Smooth rendering |
| Debouncing | Delay rapid updates | Reduce load |
| Caching | Store computed values | Faster re-apply |

### Integration Points

| System | Integration | Purpose |
|--------|-------------|---------|
| Theme Context | Read/write settings | State management |
| Font Loader | Trigger font loading | Ensure fonts available |
| Preview | Real-time preview | Visual feedback |
| Storage | Persist settings | Cross-session |

### Expected Outcome
- Robust function to apply typography settings
- CSS variables updated correctly
- Smooth visual transitions
- Settings persisted across sessions

### Verification Checklist
- [ ] `lib/theme/applyFonts.ts` file created
- [ ] Typography config interface defined
- [ ] CSS variable update function implemented
- [ ] All typography variables mapped
- [ ] Derived values calculated correctly
- [ ] Font stacks constructed with fallbacks
- [ ] Fonts loaded before application
- [ ] Batch updates prevent layout thrashing
- [ ] Error handling for edge cases
- [ ] Settings persisted to localStorage
- [ ] TypeScript types defined
- [ ] Module exports all functions

---

## Summary

This document established the comprehensive typography selection and application system, including typography section organization, font selectors for heading and body text, curated font list, Google Fonts integration, real-time font preview, font size scale control, line height adjustment, font weight options, and the mechanism to apply all settings via CSS variables. These components provide users with complete control over the typographic appearance of their storefront.

### Completed Tasks
1. ✓ Created typography section with organized subsections
2. ✓ Created heading font selector with dropdown and preview
3. ✓ Created body font selector with pairing suggestions
4. ✓ Created comprehensive font list with 30+ quality fonts
5. ✓ Created Google Fonts integration for dynamic loading
6. ✓ Created font preview with sample text at multiple sizes
7. ✓ Created font size scale with four preset options
8. ✓ Created line height setting with readability guidelines
9. ✓ Created font weight options with hierarchy validation
10. ✓ Created apply fonts function with CSS variable updates

### Next Steps
Proceed to [02_Tasks-45-50_Loading-Preview-Verify.md](02_Tasks-45-50_Loading-Preview-Verify.md) to create the font loader component, font loading states, fallback management, typography reset, comprehensive preview section, and system verification.
