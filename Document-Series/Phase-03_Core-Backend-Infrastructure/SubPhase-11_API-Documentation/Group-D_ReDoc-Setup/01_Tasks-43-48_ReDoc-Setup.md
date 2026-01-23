# Tasks 43-48: ReDoc Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** D - ReDoc Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Swagger-UI-Setup/](../Group-C_Swagger-UI-Setup/)
- **→ Next Document:** [02_Tasks-49-54_Features-Testing.md](02_Tasks-49-54_Features-Testing.md)

---

## Document Overview

This document covers setting up ReDoc as an alternative API documentation interface with custom theme configuration, typography, and menu layout.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Configure REDOC Settings | Medium |
| 44 | Add ReDoc URL | Simple |
| 45 | Configure ReDoc Theme | Medium |
| 46 | Configure Primary Color | Simple |
| 47 | Configure Typography | Simple |
| 48 | Configure Menu Layout | Simple |

---

## Task 43: Configure REDOC Settings

### Overview
Create the REDOC_UI_SETTINGS dictionary to configure ReDoc's appearance and behavior as an alternative documentation interface.

### Dependencies
- Task 42: Test API Calls (Group C)

### Instructions

1. **Open api_docs settings file**
   - Navigate to `backend/config/settings/api_docs.py`
   - Add settings after SWAGGER_UI_SETTINGS
   - Prepare new dictionary

2. **Create REDOC_UI_SETTINGS dictionary**
   - Initialize REDOC_UI_SETTINGS
   - Add docstring comment
   - Note ReDoc configuration purpose

3. **Understand ReDoc differences**
   - ReDoc is read-only (no "Try It Out")
   - Three-panel layout (menu, content, examples)
   - Designed for comprehensive documentation
   - Better for external/public docs

4. **Plan configuration categories**
   - Theme settings
   - Typography configuration
   - Menu behavior
   - Display options

5. **Add configuration comment**
   - Explain ReDoc purpose
   - Note difference from Swagger UI
   - Reference use cases

### ReDoc Settings Structure
```python
# ReDoc UI Configuration
REDOC_UI_SETTINGS = {
    # Settings will be added in subsequent tasks
}
```

### ReDoc vs Swagger UI
| Aspect | Swagger UI | ReDoc |
|--------|------------|-------|
| **Purpose** | Interactive testing | Comprehensive docs |
| **Layout** | Single column | Three-panel |
| **Try It Out** | Yes | No |
| **Use Case** | Development | Production docs |
| **Customization** | Extensive | Theme-focused |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # REDOC_UI_SETTINGS created
```

### Verification Checklist
- [ ] REDOC_UI_SETTINGS dictionary created
- [ ] Added after SWAGGER_UI_SETTINGS
- [ ] Docstring comment added
- [ ] Proper Python syntax
- [ ] Ready for configuration

---

## Task 44: Add ReDoc URL

### Overview
Add a URL pattern to serve the ReDoc documentation interface at a dedicated endpoint.

### Dependencies
- Task 43: Configure REDOC Settings

### Instructions

1. **Open api_docs URLs file**
   - Navigate to `backend/apps/core/api_docs/urls.py`
   - Locate urlpatterns list
   - Prepare to add new pattern

2. **Import ReDoc view**
   - Import SpectacularRedocView
   - From drf_spectacular.views
   - Add to imports section

3. **Add ReDoc URL pattern**
   - Add path for 'redoc/'
   - Use SpectacularRedocView.as_view()
   - Set name to 'redoc'

4. **Configure view parameters**
   - Pass url_name='api_docs:schema'
   - Links to schema endpoint
   - Enables schema loading

5. **Add pattern comment**
   - Explain ReDoc endpoint
   - Note read-only documentation
   - Reference comprehensive docs purpose

### URL Pattern Configuration
```python
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI - Interactive API documentation
    path(
        'docs/',
        SpectacularSwaggerView.as_view(url_name='api_docs:schema'),
        name='swagger-ui'
    ),
    
    # ReDoc - Comprehensive API documentation
    path(
        'redoc/',
        SpectacularRedocView.as_view(url_name='api_docs:schema'),
        name='redoc'
    ),
]
```

### URL Details
| Aspect | Value |
|--------|-------|
| **Path** | redoc/ |
| **Full URL** | /api/redoc/ |
| **View** | SpectacularRedocView |
| **Name** | redoc |
| **Purpose** | Read-only documentation |

### Expected Outcome
```
backend/apps/core/api_docs/
└── urls.py                  # ReDoc URL added
```

### Verification Checklist
- [ ] SpectacularRedocView imported
- [ ] URL pattern added for 'redoc/'
- [ ] View configured with url_name parameter
- [ ] Name set to 'redoc'
- [ ] Comment added
- [ ] Proper syntax

---

## Task 45: Configure ReDoc Theme

### Overview
Configure the ReDoc theme settings to customize colors and overall appearance to match LankaCommerce Cloud branding.

### Dependencies
- Task 44: Add ReDoc URL

### Instructions

1. **Add theme configuration**
   - Open REDOC_UI_SETTINGS
   - Add 'theme' nested dictionary
   - Define color scheme

2. **Configure colors object**
   - Add 'colors' dictionary
   - Define primary colors
   - Define text colors
   - Define background colors

3. **Set brand colors**
   - Use LankaCommerce brand palette
   - Primary: #1976d2 (blue)
   - Success: #4caf50 (green)
   - Warning: #ff9800 (orange)
   - Error: #f44336 (red)

4. **Configure background**
   - Set main background color
   - Set sidebar background
   - Set code block background

5. **Add theme comment**
   - Explain color scheme
   - Note brand consistency
   - Reference LankaCommerce palette

### Theme Configuration
```python
REDOC_UI_SETTINGS = {
    'theme': {
        'colors': {
            'primary': {
                'main': '#1976d2',  # LankaCommerce primary blue
            },
            'success': {
                'main': '#4caf50',
            },
            'warning': {
                'main': '#ff9800',
            },
            'error': {
                'main': '#f44336',
            },
            'text': {
                'primary': '#333333',
                'secondary': '#666666',
            },
        },
    },
}
```

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | #1976d2 | Links, headers, accents |
| **Success** | #4caf50 | Success responses, GET |
| **Warning** | #ff9800 | Warnings, PUT/PATCH |
| **Error** | #f44336 | Errors, DELETE |
| **Text Primary** | #333333 | Body text |
| **Text Secondary** | #666666 | Secondary text |

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # ReDoc theme configured
```

### Verification Checklist
- [ ] theme dictionary added
- [ ] colors object configured
- [ ] Primary color set
- [ ] Success, warning, error colors set
- [ ] Text colors configured
- [ ] Brand colors match LankaCommerce

---

## Task 46: Configure Primary Color

### Overview
Fine-tune the primary color configuration to ensure it applies consistently across all ReDoc UI elements.

### Dependencies
- Task 45: Configure ReDoc Theme

### Instructions

1. **Verify primary color**
   - Confirm primary.main set to #1976d2
   - Check color is LankaCommerce blue
   - Ensure proper hex format

2. **Add contrast color**
   - Add contrastText to primary
   - Set to white (#ffffff) for readability
   - Ensures text visibility

3. **Configure hover states**
   - Consider hover variations
   - Slightly lighter/darker shades
   - Improve interactivity

4. **Test color contrast**
   - Verify text readability
   - Check WCAG accessibility
   - Ensure sufficient contrast ratios

5. **Add color comment**
   - Document color choice
   - Note brand alignment
   - Reference accessibility

### Primary Color Configuration
```python
REDOC_UI_SETTINGS = {
    'theme': {
        'colors': {
            'primary': {
                'main': '#1976d2',         # LankaCommerce blue
                'contrastText': '#ffffff', # White text on primary
            },
            # ... other colors ...
        },
    },
}
```

### Color Specifications
| Property | Value | Purpose |
|----------|-------|---------|
| **main** | #1976d2 | Primary brand color |
| **contrastText** | #ffffff | Text on primary background |

### Accessibility Considerations
- **Contrast Ratio:** Minimum 4.5:1 for normal text
- **WCAG Level:** AA compliance
- **Testing:** Use contrast checker tools
- **Readability:** Test with actual content

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Primary color refined
```

### Verification Checklist
- [ ] Primary main color confirmed
- [ ] contrastText added
- [ ] Hex format correct
- [ ] Contrast ratio acceptable
- [ ] Comment added

---

## Task 47: Configure Typography

### Overview
Configure ReDoc typography settings including font families, sizes, and weights for optimal readability.

### Dependencies
- Task 46: Configure Primary Color

### Instructions

1. **Add typography configuration**
   - Add 'typography' to theme
   - Define font settings
   - Configure text sizes

2. **Set font families**
   - Use system font stack
   - Fallback fonts for compatibility
   - Consider web fonts if needed

3. **Configure font sizes**
   - Set base font size
   - Define heading sizes
   - Set code font size

4. **Set font weights**
   - Regular text weight
   - Bold for emphasis
   - Medium for headings

5. **Configure line height**
   - Set readable line spacing
   - Optimize for long-form content
   - Balance density and readability

### Typography Configuration
```python
REDOC_UI_SETTINGS = {
    'theme': {
        'colors': {
            # ... colors configuration ...
        },
        'typography': {
            'fontSize': '14px',
            'lineHeight': '1.6',
            'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            'headings': {
                'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                'fontWeight': '600',
            },
            'code': {
                'fontSize': '13px',
                'fontFamily': '"Courier New", Courier, monospace',
                'backgroundColor': '#f5f5f5',
            },
        },
    },
}
```

### Typography Specifications
| Element | Setting | Value |
|---------|---------|-------|
| **Body Font** | fontSize | 14px |
| **Body Font** | lineHeight | 1.6 |
| **Body Font** | fontFamily | System fonts |
| **Headings** | fontWeight | 600 |
| **Code** | fontSize | 13px |
| **Code** | fontFamily | Monospace |

### Font Stack Benefits
- **System Fonts:** Fast loading, native appearance
- **Fallbacks:** Cross-platform compatibility
- **Readability:** Optimized for screens
- **Performance:** No external font loading

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Typography configured
```

### Verification Checklist
- [ ] fontSize set to 14px
- [ ] lineHeight set to 1.6
- [ ] System font stack configured
- [ ] Headings fontWeight set
- [ ] Code font configured
- [ ] All typography settings added

---

## Task 48: Configure Menu Layout

### Overview
Configure the ReDoc menu layout and behavior to optimize navigation and endpoint organization.

### Dependencies
- Task 47: Configure Typography

### Instructions

1. **Add menu configuration**
   - Add top-level menu settings
   - Configure menu behavior
   - Set navigation options

2. **Configure menu width**
   - Set sidebar width
   - Balance content visibility
   - Ensure adequate space

3. **Configure grouping**
   - Enable tag grouping
   - Configure nesting
   - Set expansion behavior

4. **Set scroll behavior**
   - Enable smooth scrolling
   - Configure scroll spy
   - Highlight active section

5. **Configure search**
   - Enable menu search
   - Configure search behavior
   - Set search placeholder

### Menu Configuration
```python
REDOC_UI_SETTINGS = {
    'theme': {
        # ... theme configuration ...
    },
    
    # Menu and navigation
    'scrollYOffset': 0,
    'hideDownloadButton': False,
    'expandResponses': 'all',
    'menuToggle': True,
    'pathInMiddlePanel': True,
    'hideHostname': False,
    'sortPropsAlphabetically': True,
}
```

### Menu Settings
| Setting | Value | Purpose |
|---------|-------|---------|
| **scrollYOffset** | 0 | Scroll offset for fixed header |
| **hideDownloadButton** | False | Show schema download |
| **expandResponses** | 'all' | Expand all responses |
| **menuToggle** | True | Enable menu toggle |
| **pathInMiddlePanel** | True | Show path in content |
| **sortPropsAlphabetically** | True | Sort properties |

### Menu Layout Features
- **Three-Panel:** Menu, content, code examples
- **Collapsible:** Can hide/show menu
- **Searchable:** Find endpoints quickly
- **Organized:** Group by tags
- **Responsive:** Adapts to screen size

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # Menu layout configured
```

### Verification Checklist
- [ ] Menu settings added
- [ ] scrollYOffset configured
- [ ] Download button setting added
- [ ] Expand responses configured
- [ ] Menu toggle enabled
- [ ] Path display configured
- [ ] Sorting configured

---

## Summary

After completing these tasks, ReDoc will be configured with custom theme, typography, and menu layout matching LankaCommerce Cloud branding.

### What We Accomplished
1. ✅ Created REDOC_UI_SETTINGS dictionary
2. ✅ Added ReDoc URL at /api/redoc/
3. ✅ Configured custom theme with brand colors
4. ✅ Fine-tuned primary color with contrast
5. ✅ Configured typography for readability
6. ✅ Configured menu layout and navigation

### Next Steps
- Configure search functionality
- Configure expand responses behavior
- Hide download button option
- Add LankaCommerce logo
- Test ReDoc interface
- Compare with Swagger UI

### Current Configuration
```python
# backend/config/settings/api_docs.py

REDOC_UI_SETTINGS = {
    'theme': {
        'colors': {
            'primary': {
                'main': '#1976d2',
                'contrastText': '#ffffff',
            },
            'success': {'main': '#4caf50'},
            'warning': {'main': '#ff9800'},
            'error': {'main': '#f44336'},
            'text': {
                'primary': '#333333',
                'secondary': '#666666',
            },
        },
        'typography': {
            'fontSize': '14px',
            'lineHeight': '1.6',
            'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'headings': {
                'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                'fontWeight': '600',
            },
            'code': {
                'fontSize': '13px',
                'fontFamily': '"Courier New", Courier, monospace',
                'backgroundColor': '#f5f5f5',
            },
        },
    },
    'scrollYOffset': 0,
    'hideDownloadButton': False,
    'expandResponses': 'all',
    'menuToggle': True,
    'pathInMiddlePanel': True,
    'sortPropsAlphabetically': True,
}
```

### Git Commit Message
```
feat(api-docs): configure ReDoc with custom theme and layout

- Create REDOC_UI_SETTINGS configuration
- Add ReDoc URL endpoint at /api/redoc/
- Configure custom theme with LankaCommerce colors
- Set primary color with contrast text
- Configure typography with system fonts
- Configure menu layout and navigation settings
- Enable menu toggle and path display

Part of SubPhase-11 Group D (Tasks 43-48)
```
