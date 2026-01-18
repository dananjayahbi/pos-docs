# SubPhase 10: Theme Engine - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 10 of 14  
> **SubPhase Goal:** Build tenant-customizable storefront theme system with colors, fonts, logos, and homepage sections  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Customer-Portal](../SubPhase-09_Customer-Portal/)
- **→ Next SubPhase:** [SubPhase-11_Static-Pages-CMS](../SubPhase-11_Static-Pages-CMS/)

---

## SubPhase Overview

This sub-phase creates the theme customization engine allowing each tenant to customize their storefront appearance including logos, colors, fonts, and homepage layout sections.

### Key Outcomes
- Logo upload and management
- Brand colors (primary, secondary)
- Typography settings (fonts)
- Homepage section configuration
- Banner/hero image management
- Navigation structure customization
- Live theme preview

### Customization Options
- Logo upload
- Brand colors (primary, secondary)
- Typography (font family)
- Homepage layout sections
- Banner images
- Navigation structure

### Theme Settings Structure
```json
{
  "logo": "/uploads/logo.png",
  "colors": {
    "primary": "#2563eb",
    "secondary": "#64748b"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Open Sans"
  },
  "homepage": {
    "sections": ["hero", "featured", "categories", "testimonials"]
  }
}
```

### Technology Context
- **Storage:** Theme settings in tenant configuration
- **CSS Variables:** Dynamic CSS custom properties
- **Fonts:** Google Fonts integration
- **Preview:** Real-time preview system

---

## Task Execution Order

```
TASK GROUP A: Theme Provider & Context (Tasks 01-16)
        │
        ▼
TASK GROUP B: Color Customization (Tasks 17-34)
        │
        ▼
TASK GROUP C: Typography & Fonts (Tasks 35-50)
        │
        ▼
TASK GROUP D: Logo & Images (Tasks 51-66)
        │
        ▼
TASK GROUP E: Homepage Sections (Tasks 67-80)
        │
        ▼
TASK GROUP F: Preview & Testing (Tasks 81-92)
```

---

## Task Index

### Group A: Theme Provider & Context (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Theme Directory** | Set up theme/ components | SubPhase-09 | 🔴 Not Created |
| 02 | **Create Theme Types** | TypeScript theme interfaces | Task 01 | 🔴 Not Created |
| 03 | **Create Theme Context** | React Context for theme | Task 02 | 🔴 Not Created |
| 04 | **Create Theme Provider** | Provider wrapper | Task 03 | 🔴 Not Created |
| 05 | **Create useTheme Hook** | Hook to access theme | Task 04 | 🔴 Not Created |
| 06 | **Create Default Theme** | Default theme values | Task 02 | 🔴 Not Created |
| 07 | **Create Theme Loader** | Load theme from API | Task 04 | 🔴 Not Created |
| 08 | **Create Theme API Service** | Fetch/save theme API | Task 07 | 🔴 Not Created |
| 09 | **Create CSS Variables Injector** | Inject CSS vars | Task 04 | 🔴 Not Created |
| 10 | **Create Root CSS Variables** | :root CSS vars | Task 09 | 🔴 Not Created |
| 11 | **Create Theme Zustand Store** | Theme state store | Task 04 | 🔴 Not Created |
| 12 | **Create Theme Update Action** | Update theme in store | Task 11 | 🔴 Not Created |
| 13 | **Create Theme Reset Action** | Reset to defaults | Task 11 | 🔴 Not Created |
| 14 | **Create Theme Validation** | Validate theme object | Task 02 | 🔴 Not Created |
| 15 | **Create Theme Cache** | Cache theme locally | Task 07 | 🔴 Not Created |
| 16 | **Verify Theme Provider** | Test provider setup | Task 15 | 🔴 Not Created |

---

### Group B: Color Customization (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Color Settings Section** | Color settings UI | Task 16 | 🔴 Not Created |
| 18 | **Create Primary Color Picker** | Primary color input | Task 17 | 🔴 Not Created |
| 19 | **Create Secondary Color Picker** | Secondary color input | Task 17 | 🔴 Not Created |
| 20 | **Create Color Picker Component** | Reusable color picker | Task 18 | 🔴 Not Created |
| 21 | **Create Color Swatch Preview** | Preview swatch | Task 20 | 🔴 Not Created |
| 22 | **Create Hex Input** | Hex color text input | Task 20 | 🔴 Not Created |
| 23 | **Create Color Presets** | Preset color options | Task 17 | 🔴 Not Created |
| 24 | **Create Accent Color** | Accent/highlight color | Task 17 | 🔴 Not Created |
| 25 | **Create Background Color** | Page background | Task 17 | 🔴 Not Created |
| 26 | **Create Text Color** | Primary text color | Task 17 | 🔴 Not Created |
| 27 | **Create Generate Palette** | Auto-generate shades | Task 18 | 🔴 Not Created |
| 28 | **Create Color Contrast Check** | Accessibility check | Task 27 | 🔴 Not Created |
| 29 | **Create Apply Colors** | Apply to CSS vars | Task 09 | 🔴 Not Created |
| 30 | **Create Color Reset** | Reset to defaults | Task 17 | 🔴 Not Created |
| 31 | **Create Button Color Preview** | Preview on buttons | Task 29 | 🔴 Not Created |
| 32 | **Create Link Color Preview** | Preview on links | Task 29 | 🔴 Not Created |
| 33 | **Create Header Color Preview** | Preview on header | Task 29 | 🔴 Not Created |
| 34 | **Verify Color System** | Test color application | Task 33 | 🔴 Not Created |

---

### Group C: Typography & Fonts (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Typography Section** | Font settings UI | Task 34 | 🔴 Not Created |
| 36 | **Create Heading Font Selector** | Heading font dropdown | Task 35 | 🔴 Not Created |
| 37 | **Create Body Font Selector** | Body font dropdown | Task 35 | 🔴 Not Created |
| 38 | **Create Font List** | Available fonts list | Task 36 | 🔴 Not Created |
| 39 | **Create Google Fonts Integration** | Load Google Fonts | Task 38 | 🔴 Not Created |
| 40 | **Create Font Preview** | Preview font on text | Task 39 | 🔴 Not Created |
| 41 | **Create Font Size Scale** | Base font size option | Task 35 | 🔴 Not Created |
| 42 | **Create Line Height Setting** | Line height config | Task 35 | 🔴 Not Created |
| 43 | **Create Font Weight Options** | Bold/regular settings | Task 35 | 🔴 Not Created |
| 44 | **Create Apply Fonts** | Apply font CSS vars | Task 39 | 🔴 Not Created |
| 45 | **Create Font Loader** | Dynamic font loading | Task 39 | 🔴 Not Created |
| 46 | **Create Font Loading State** | Loading indicator | Task 45 | 🔴 Not Created |
| 47 | **Create Font Fallbacks** | Fallback font stack | Task 44 | 🔴 Not Created |
| 48 | **Create Reset Typography** | Reset to defaults | Task 35 | 🔴 Not Created |
| 49 | **Create Typography Preview** | Full preview section | Task 44 | 🔴 Not Created |
| 50 | **Verify Typography System** | Test font application | Task 49 | 🔴 Not Created |

---

### Group D: Logo & Images (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Logo Section** | Logo settings UI | Task 50 | 🔴 Not Created |
| 52 | **Create Logo Upload** | Logo file upload | Task 51 | 🔴 Not Created |
| 53 | **Create Logo Preview** | Preview uploaded logo | Task 52 | 🔴 Not Created |
| 54 | **Create Logo Size Control** | Logo size adjustment | Task 51 | 🔴 Not Created |
| 55 | **Create Logo Alt Text** | Alt text input | Task 51 | 🔴 Not Created |
| 56 | **Create Favicon Upload** | Favicon image | Task 51 | 🔴 Not Created |
| 57 | **Create Mobile Logo** | Separate mobile logo | Task 51 | 🔴 Not Created |
| 58 | **Create Banner Section** | Banner/hero images | Task 50 | 🔴 Not Created |
| 59 | **Create Hero Image Upload** | Hero banner upload | Task 58 | 🔴 Not Created |
| 60 | **Create Hero Text Overlay** | Text on hero | Task 59 | 🔴 Not Created |
| 61 | **Create Hero CTA Button** | Button on hero | Task 60 | 🔴 Not Created |
| 62 | **Create Image Optimization** | Optimize uploads | Task 52 | 🔴 Not Created |
| 63 | **Create Image Cropper** | Crop uploaded images | Task 52 | 🔴 Not Created |
| 64 | **Create Delete Image** | Remove uploaded image | Task 52 | 🔴 Not Created |
| 65 | **Create Logo Apply** | Apply logo to header | Task 53 | 🔴 Not Created |
| 66 | **Verify Image Uploads** | Test upload flow | Task 65 | 🔴 Not Created |

---

### Group E: Homepage Sections (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Homepage Builder** | Section manager UI | Task 66 | 🔴 Not Created |
| 68 | **Create Section List** | Draggable section list | Task 67 | 🔴 Not Created |
| 69 | **Create Section Drag Handle** | Reorder handle | Task 68 | 🔴 Not Created |
| 70 | **Create Section Toggle** | Enable/disable section | Task 68 | 🔴 Not Created |
| 71 | **Create Hero Section Config** | Hero settings | Task 67 | 🔴 Not Created |
| 72 | **Create Featured Products Config** | Featured products | Task 67 | 🔴 Not Created |
| 73 | **Create Categories Section Config** | Category grid | Task 67 | 🔴 Not Created |
| 74 | **Create Testimonials Config** | Testimonials section | Task 67 | 🔴 Not Created |
| 75 | **Create Newsletter Config** | Newsletter signup | Task 67 | 🔴 Not Created |
| 76 | **Create Add Section** | Add new section | Task 67 | 🔴 Not Created |
| 77 | **Create Section Settings** | Per-section settings | Task 68 | 🔴 Not Created |
| 78 | **Create Save Section Order** | Save order to API | Task 68 | 🔴 Not Created |
| 79 | **Create Homepage Preview** | Preview homepage | Task 78 | 🔴 Not Created |
| 80 | **Verify Section Builder** | Test section ordering | Task 79 | 🔴 Not Created |

---

### Group F: Preview & Testing (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Theme Preview Panel** | Live preview panel | Task 80 | 🔴 Not Created |
| 82 | **Create Preview Frame** | Iframe preview | Task 81 | 🔴 Not Created |
| 83 | **Create Desktop Preview** | Desktop viewport | Task 82 | 🔴 Not Created |
| 84 | **Create Mobile Preview** | Mobile viewport | Task 82 | 🔴 Not Created |
| 85 | **Create Preview Refresh** | Refresh preview | Task 82 | 🔴 Not Created |
| 86 | **Create Save Theme Button** | Save all settings | Task 81 | 🔴 Not Created |
| 87 | **Create Publish Theme** | Publish changes live | Task 86 | 🔴 Not Created |
| 88 | **Create Draft Mode** | Save as draft | Task 86 | 🔴 Not Created |
| 89 | **Create Undo Changes** | Undo recent changes | Task 86 | 🔴 Not Created |
| 90 | **Test Color Application** | Colors appear correctly | Task 34 | 🔴 Not Created |
| 91 | **Test Font Loading** | Fonts load correctly | Task 50 | 🔴 Not Created |
| 92 | **Test Theme Persistence** | Theme saves and loads | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── components/
    └── storefront/
        └── theme/
            ├── Provider/
            │   ├── ThemeProvider.tsx           # Provider (Task 04)
            │   ├── ThemeContext.tsx            # Context (Task 03)
            │   └── CSSVariablesInjector.tsx    # CSS vars (Task 09)
            ├── Colors/
            │   ├── ColorSettings.tsx           # Settings (Task 17)
            │   ├── ColorPicker.tsx             # Picker (Task 20)
            │   ├── ColorPresets.tsx            # Presets (Task 23)
            │   └── ContrastCheck.tsx           # Contrast (Task 28)
            ├── Typography/
            │   ├── TypographySettings.tsx      # Settings (Task 35)
            │   ├── FontSelector.tsx            # Selector (Task 36)
            │   ├── FontPreview.tsx             # Preview (Task 40)
            │   └── FontLoader.tsx              # Loader (Task 45)
            ├── Logo/
            │   ├── LogoSettings.tsx            # Settings (Task 51)
            │   ├── LogoUpload.tsx              # Upload (Task 52)
            │   ├── FaviconUpload.tsx           # Favicon (Task 56)
            │   └── ImageCropper.tsx            # Cropper (Task 63)
            ├── Homepage/
            │   ├── HomepageBuilder.tsx         # Builder (Task 67)
            │   ├── SectionList.tsx             # List (Task 68)
            │   ├── SectionConfig.tsx           # Config (Task 77)
            │   └── HomepagePreview.tsx         # Preview (Task 79)
            └── Preview/
                ├── PreviewPanel.tsx            # Panel (Task 81)
                ├── PreviewFrame.tsx            # Frame (Task 82)
                └── ViewportToggle.tsx          # Viewport (Task 83)
└── stores/
    └── storefront/
        └── themeStore.ts                       # Theme store (Task 11)
└── hooks/
    └── storefront/
        └── useTheme.ts                         # Theme hook (Task 05)
└── services/
    └── storefront/
        └── themeService.ts                     # Theme API (Task 08)
└── types/
    └── storefront/
        └── theme.types.ts                      # Types (Task 02)
└── styles/
    └── theme/
        ├── variables.css                       # CSS vars template
        └── defaults.ts                         # Default values (Task 06)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Theme Provider & Context | 16 | 0 | 0% |
| B | Color Customization | 18 | 0 | 0% |
| C | Typography & Fonts | 16 | 0 | 0% |
| D | Logo & Images | 16 | 0 | 0% |
| E | Homepage Sections | 14 | 0 | 0% |
| F | Preview & Testing | 12 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **CSS Variables** - Use CSS custom properties for theming
3. **Google Fonts** - Dynamic loading for font selection
4. **Per-tenant settings** - Each tenant has own theme
5. **Image optimization** - Compress uploaded images
6. **Live preview** - Real-time preview of changes
7. **Draft mode** - Allow saving without publishing
8. **Contrast check** - Ensure text readability
9. **Responsive preview** - Desktop and mobile previews
