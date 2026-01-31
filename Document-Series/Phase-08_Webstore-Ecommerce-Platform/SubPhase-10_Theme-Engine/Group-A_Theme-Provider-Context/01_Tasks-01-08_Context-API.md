# Tasks 01-08: Theme Context, Provider, and API

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 10 - Theme Engine  
> **Group:** A - Theme Provider & Context  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_CSS-Store-Verify.md](02_Tasks-09-16_CSS-Store-Verify.md)

---

## Document Overview

This document covers the creation of the theme provider infrastructure for the webstore. It establishes the foundational theme system including directory structure, TypeScript type definitions, React Context API implementation, theme provider wrapper, custom hooks, default theme configuration, theme loader mechanism, and API service integration. These components work together to provide dynamic theming capabilities that allow each webstore instance to maintain its own brand identity through customizable colors, fonts, and visual elements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Theme Directory | Low | 15 min |
| 02 | Create Theme Types | Medium | 30 min |
| 03 | Create Theme Context | Low | 20 min |
| 04 | Create Theme Provider | Medium | 40 min |
| 05 | Create useTheme Hook | Low | 15 min |
| 06 | Create Default Theme | Low | 25 min |
| 07 | Create Theme Loader | Medium | 35 min |
| 08 | Create Theme API Service | Medium | 30 min |

---

## Task 01: Create Theme Directory

### Overview
Establish the directory structure for the theme system. This creates organized locations for theme-related components, types, stores, hooks, services, and styles. Proper directory structure ensures maintainability and clear separation of concerns as the theme system grows in complexity.

### Dependencies
- SubPhase-09 (State Management & API Integration) must be complete
- Frontend project structure is established
- Storefront directory exists

### Instructions

1. **Navigate to frontend directory**
   - Go to `frontend/` root directory
   - Identify existing directory structure
   - Plan theme-related file locations

2. **Create theme component directory**
   - Navigate to `frontend/components/storefront/` directory
   - Create new directory named `theme`
   - Create subdirectory `Provider` for provider components
   - This will house ThemeProvider and related components

3. **Create theme types directory**
   - Navigate to `frontend/types/storefront/` directory
   - Create file location for `theme.types.ts`
   - This will define all theme-related TypeScript interfaces

4. **Create theme store directory**
   - Navigate to `frontend/stores/storefront/` directory
   - Create file location for `themeStore.ts`
   - This will house Zustand theme state management

5. **Create theme hooks directory**
   - Navigate to `frontend/hooks/storefront/` directory
   - Create file location for `useTheme.ts`
   - This will contain custom theme hooks

6. **Create theme services directory**
   - Navigate to `frontend/services/storefront/` directory
   - Create file location for `themeService.ts`
   - This will handle API communication for themes

7. **Create theme styles directory**
   - Navigate to `frontend/styles/` directory
   - Create subdirectory named `theme`
   - Create locations for `variables.css` and `defaults.ts`
   - This will store CSS variables and default configurations

### Directory Structure

```
frontend/
├── components/
│   └── storefront/
│       └── theme/
│           └── Provider/
│               ├── ThemeProvider.tsx        (Task 04)
│               ├── ThemeContext.tsx         (Task 03)
│               ├── CSSVariablesInjector.tsx (Task 09)
│               └── index.ts
├── types/
│   └── storefront/
│       └── theme.types.ts                   (Task 02)
├── stores/
│   └── storefront/
│       └── themeStore.ts                    (Task 11)
├── hooks/
│   └── storefront/
│       └── useTheme.ts                      (Task 05)
├── services/
│   └── storefront/
│       └── themeService.ts                  (Task 08)
└── styles/
    └── theme/
        ├── variables.css                    (Task 10)
        └── defaults.ts                      (Task 06)
```

### Directory Organization Purpose

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| components/storefront/theme/Provider | Theme provider components | ThemeProvider, ThemeContext |
| types/storefront | TypeScript type definitions | theme.types.ts |
| stores/storefront | Zustand state management | themeStore.ts |
| hooks/storefront | Custom React hooks | useTheme.ts |
| services/storefront | API service layer | themeService.ts |
| styles/theme | CSS and default values | variables.css, defaults.ts |

### File Organization Strategy

```
Theme System Architecture
├── Types Layer (theme.types.ts)
│   └── Defines interfaces and types
├── Service Layer (themeService.ts)
│   └── Handles API communication
├── State Layer (themeStore.ts)
│   └── Manages theme state with Zustand
├── Context Layer (ThemeContext.tsx)
│   └── React Context for theme access
├── Provider Layer (ThemeProvider.tsx)
│   └── Wraps app with theme functionality
├── Hook Layer (useTheme.ts)
│   └── Custom hooks for easy access
└── Style Layer (variables.css, defaults.ts)
    └── CSS variables and defaults
```

### Expected Outcome
- Complete directory structure for theme system
- Organized file locations for all theme components
- Clear separation of concerns by functionality
- Foundation ready for implementation

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Provider/` directory created
- [ ] `frontend/types/storefront/` directory exists or created
- [ ] `frontend/stores/storefront/` directory exists or created
- [ ] `frontend/hooks/storefront/` directory exists or created
- [ ] `frontend/services/storefront/` directory exists or created
- [ ] `frontend/styles/theme/` directory created
- [ ] All directories accessible and properly nested

---

## Task 02: Create Theme Types

### Overview
Define comprehensive TypeScript interfaces and types for the theme system. These types ensure type safety throughout the application and define the structure of theme data including colors, fonts, logos, homepage settings, and metadata. Strong typing prevents errors and provides excellent IDE autocomplete support.

### Dependencies
- Task 01: Create Theme Directory

### Instructions

1. **Create theme types file**
   - Navigate to `frontend/types/storefront/` directory
   - Create new file named `theme.types.ts`
   - Set up TypeScript exports

2. **Define ThemeColors interface**
   - Create interface with all color properties
   - Include primary, secondary, accent colors
   - Include background, surface, and text colors
   - Include border and shadow colors
   - Include success, warning, error, info colors
   - Use string type for hex color values

3. **Define ThemeFonts interface**
   - Create interface for font configuration
   - Include heading font family
   - Include body font family
   - Include font scale multipliers
   - Include font weight options

4. **Define ThemeLogo interface**
   - Create interface for logo configuration
   - Include URL property for logo image
   - Include alt text for accessibility
   - Include width and height for dimensions
   - Include dark mode variant URL

5. **Define ThemeHomepage interface**
   - Create interface for homepage settings
   - Include hero section configuration
   - Include featured products settings
   - Include banner configuration
   - Include layout options

6. **Define main Theme interface**
   - Create comprehensive Theme interface
   - Include id, tenantId, name properties
   - Include colors object (ThemeColors)
   - Include fonts object (ThemeFonts)
   - Include logo object (ThemeLogo)
   - Include homepage object (ThemeHomepage)
   - Include timestamps (createdAt, updatedAt)
   - Include isActive flag

7. **Define ThemeContextValue interface**
   - Create interface for context value
   - Include current theme object
   - Include updateTheme function signature
   - Include resetTheme function signature
   - Include isLoading boolean
   - Include error property

8. **Create utility types**
   - Define PartialTheme type for updates
   - Define ThemeValidationError type
   - Create type guards for theme validation
   - Define color palette constants type

### Theme Type Hierarchy

```
Theme (Main Interface)
├── id: string
├── tenantId: string
├── name: string
├── colors: ThemeColors
│   ├── primary: string
│   ├── secondary: string
│   ├── accent: string
│   ├── background: string
│   ├── surface: string
│   ├── text: object
│   │   ├── primary: string
│   │   ├── secondary: string
│   │   └── disabled: string
│   ├── border: object
│   │   ├── light: string
│   │   └── dark: string
│   └── status: object
│       ├── success: string
│       ├── warning: string
│       ├── error: string
│       └── info: string
├── fonts: ThemeFonts
│   ├── heading: string
│   ├── body: string
│   ├── scale: number
│   └── weights: object
│       ├── light: number
│       ├── normal: number
│       ├── medium: number
│       └── bold: number
├── logo: ThemeLogo
│   ├── url: string
│   ├── alt: string
│   ├── width: number
│   ├── height: number
│   └── darkModeUrl?: string
├── homepage: ThemeHomepage
│   ├── hero: object
│   ├── featuredProducts: object
│   └── banners: array
├── isActive: boolean
├── createdAt: Date
└── updatedAt: Date
```

### ThemeColors Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| primary | string | Main brand color | "#2563eb" |
| secondary | string | Secondary accent | "#64748b" |
| accent | string | Highlight color | "#f59e0b" |
| background | string | Page background | "#ffffff" |
| surface | string | Card/component background | "#f8fafc" |
| text.primary | string | Primary text color | "#0f172a" |
| text.secondary | string | Secondary text | "#64748b" |
| text.disabled | string | Disabled state | "#cbd5e1" |
| border.light | string | Light borders | "#e2e8f0" |
| border.dark | string | Dark borders | "#94a3b8" |

### ThemeFonts Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| heading | string | Heading font family | "Inter" |
| body | string | Body text font | "Open Sans" |
| scale | number | Font size multiplier | 1.0 |
| weights.light | number | Light font weight | 300 |
| weights.normal | number | Normal font weight | 400 |
| weights.medium | number | Medium font weight | 500 |
| weights.bold | number | Bold font weight | 700 |

### ThemeLogo Properties

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| url | string | Logo image URL | "/uploads/logo.png" |
| alt | string | Accessibility text | "Store Logo" |
| width | number | Logo width in pixels | 200 |
| height | number | Logo height in pixels | 60 |
| darkModeUrl | string? | Dark mode variant | "/uploads/logo-dark.png" |

### ThemeContextValue Properties

| Property | Type | Description |
|----------|------|-------------|
| theme | Theme \| null | Current active theme |
| updateTheme | (updates: PartialTheme) => Promise<void> | Update theme function |
| resetTheme | () => Promise<void> | Reset to default |
| isLoading | boolean | Loading state |
| error | string \| null | Error message |

### Type Guards and Validation

| Function | Purpose | Returns |
|----------|---------|---------|
| isValidColor | Check hex color format | boolean |
| isValidTheme | Validate complete theme | boolean |
| isThemeColors | Type guard for colors | boolean |
| isThemeFonts | Type guard for fonts | boolean |

### Expected Outcome
- Comprehensive TypeScript type definitions
- Strong typing for all theme properties
- Type safety throughout the application
- Excellent IDE autocomplete support

### Verification Checklist
- [ ] `frontend/types/storefront/theme.types.ts` file created
- [ ] Theme interface defined with all properties
- [ ] ThemeColors interface defined
- [ ] ThemeFonts interface defined
- [ ] ThemeLogo interface defined
- [ ] ThemeHomepage interface defined
- [ ] ThemeContextValue interface defined
- [ ] Utility types created
- [ ] All types exported properly

---

## Task 03: Create Theme Context

### Overview
Create React Context for theme management. This provides a centralized way to access and update theme data throughout the component tree without prop drilling. The context serves as the foundation for the theme provider system and enables any component to consume theme values.

### Dependencies
- Task 02: Create Theme Types

### Instructions

1. **Create ThemeContext file**
   - Navigate to `frontend/components/storefront/theme/Provider/` directory
   - Create new file named `ThemeContext.tsx`
   - Import React and createContext

2. **Import theme types**
   - Import Theme interface from theme.types.ts
   - Import ThemeContextValue interface
   - Import necessary React types

3. **Define initial context value**
   - Create default context value object
   - Set theme to null initially
   - Define placeholder functions for updateTheme and resetTheme
   - Set isLoading to false
   - Set error to null

4. **Create ThemeContext**
   - Use React.createContext with ThemeContextValue type
   - Pass initial context value as default
   - Add context display name for DevTools

5. **Create ThemeContext.Provider export**
   - Export the context for use in provider
   - Document context usage patterns
   - Add JSDoc comments for clarity

6. **Create useThemeContext hook**
   - Create internal hook to access context
   - Add error checking for usage outside provider
   - Throw descriptive error if context is undefined
   - Return typed context value

7. **Add TypeScript generic support**
   - Ensure proper typing for context consumers
   - Enable type inference for consumers
   - Document type usage examples

### Context Structure

```
ThemeContext
├── Provider (Created in Task 04)
│   └── Wraps application/storefront
└── Consumer (via useThemeContext)
    └── Access theme in components
```

### ThemeContextValue Interface

| Property | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| theme | Theme \| null | null | Current theme data |
| updateTheme | Function | () => {} | Update theme values |
| resetTheme | Function | () => {} | Reset to defaults |
| isLoading | boolean | false | Loading indicator |
| error | string \| null | null | Error messages |

### Context Usage Pattern

```
Component Tree
├── ThemeProvider (Provides context)
│   ├── StorefrontLayout
│   │   ├── Header (Consumes theme)
│   │   ├── ProductList (Consumes theme)
│   │   └── Footer (Consumes theme)
│   └── CustomizationPanel (Updates theme)
```

### Error Handling Strategy

| Scenario | Error Message |
|----------|---------------|
| No Provider | "useThemeContext must be used within ThemeProvider" |
| Invalid Context | "ThemeContext is undefined" |
| Missing Theme | Warning logged, returns null |

### Context Best Practices

| Practice | Implementation |
|----------|----------------|
| Default Values | Provide safe fallbacks |
| Type Safety | Use TypeScript generics |
| Error Boundaries | Wrap in error boundary |
| DevTools | Set displayName |

### Expected Outcome
- Functional React Context for theme
- Type-safe context value structure
- Error handling for improper usage
- Foundation for provider implementation

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Provider/ThemeContext.tsx` created
- [ ] ThemeContext created with createContext
- [ ] Initial context value defined
- [ ] ThemeContextValue interface used for typing
- [ ] useThemeContext hook created
- [ ] Error handling implemented
- [ ] Context exports properly
- [ ] JSDoc comments added

---

## Task 04: Create Theme Provider

### Overview
Create the ThemeProvider component that wraps the storefront application and provides theme context to all child components. This component handles theme initialization, loading from API, state management, and provides update/reset functionality. It serves as the central orchestrator of the theme system.

### Dependencies
- Task 03: Create Theme Context

### Instructions

1. **Create ThemeProvider file**
   - Navigate to `frontend/components/storefront/theme/Provider/` directory
   - Create new file named `ThemeProvider.tsx`
   - Set up React functional component structure

2. **Import dependencies**
   - Import React hooks (useState, useEffect, useCallback)
   - Import ThemeContext from ThemeContext.tsx
   - Import Theme and ThemeContextValue types
   - Import theme service (created in Task 08)
   - Import default theme (created in Task 06)

3. **Define ThemeProvider props**
   - Create ThemeProviderProps interface
   - Include children prop (ReactNode)
   - Include optional tenantId prop
   - Include optional initialTheme prop
   - Include optional onThemeChange callback

4. **Initialize component state**
   - Create state for current theme (useState)
   - Create state for loading status (useState)
   - Create state for error messages (useState)
   - Initialize with default theme or null

5. **Implement theme loading on mount**
   - Create useEffect hook for initialization
   - Check if theme exists in cache (Task 15)
   - If cached and fresh, use cached theme
   - If not cached or stale, fetch from API
   - Handle loading states appropriately
   - Handle API errors gracefully
   - Apply theme after successful load

6. **Create updateTheme function**
   - Define async function to update theme
   - Accept partial theme updates
   - Merge updates with current theme
   - Validate updated theme (Task 14)
   - Update state optimistically
   - Trigger CSS variable injection (Task 09)
   - Call onThemeChange callback if provided
   - Handle update errors

7. **Create resetTheme function**
   - Define async function to reset theme
   - Set theme back to default values
   - Clear any customizations
   - Update CSS variables
   - Handle reset errors

8. **Assemble context value**
   - Create context value object with useCallback
   - Include current theme
   - Include updateTheme function
   - Include resetTheme function
   - Include isLoading state
   - Include error state

9. **Render ThemeContext.Provider**
   - Wrap children with ThemeContext.Provider
   - Pass assembled context value
   - Render children when theme is ready

10. **Add error boundary handling**
    - Consider wrapping in error boundary
    - Handle theme loading failures gracefully
    - Provide fallback UI if theme fails

11. **Create provider index file**
    - Create `index.ts` in Provider directory
    - Export ThemeProvider as default
    - Export ThemeContext for consumption
    - Export useThemeContext hook

### Provider Component Flow

```
ThemeProvider Lifecycle
│
├── Mount
│   ├── Check cache for theme
│   ├── Load from API if needed
│   ├── Apply default if API fails
│   └── Inject CSS variables
│
├── Update
│   ├── Receive theme updates
│   ├── Validate updates
│   ├── Merge with current theme
│   ├── Update state
│   └── Re-inject CSS variables
│
└── Unmount
    └── Cleanup listeners
```

### ThemeProvider Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | App content to wrap |
| tenantId | string | No | Auto-detect | Specific tenant ID |
| initialTheme | Theme | No | null | Pre-loaded theme |
| onThemeChange | Function | No | undefined | Change callback |

### State Management

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| theme | Theme \| null | null | Current theme data |
| isLoading | boolean | true | Loading indicator |
| error | string \| null | null | Error message |

### Provider Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| Load Theme | Fetch from API on mount |
| Cache Theme | Store in localStorage |
| Apply Theme | Inject CSS variables |
| Update Theme | Handle partial updates |
| Reset Theme | Restore defaults |
| Error Handling | Catch and display errors |

### Loading States

```
Loading Flow
├── Initial: isLoading = true, theme = null
├── Loading: isLoading = true, theme = default
├── Loaded: isLoading = false, theme = loaded
├── Error: isLoading = false, theme = default, error = message
└── Updating: isLoading = false, theme = current (optimistic)
```

### Error Handling Strategy

| Error Type | Recovery Strategy |
|------------|-------------------|
| API Failure | Use cached theme or default |
| Invalid Theme | Use default and log error |
| Network Error | Retry after delay |
| Validation Error | Revert to previous theme |

### Context Value Structure

```javascript
{
  theme: Theme | null,
  updateTheme: async (updates: PartialTheme) => void,
  resetTheme: async () => void,
  isLoading: boolean,
  error: string | null
}
```

### Expected Outcome
- Fully functional theme provider component
- Automatic theme loading and caching
- Update and reset functionality
- Error handling and loading states
- Clean integration with Context API

### Verification Checklist
- [ ] `frontend/components/storefront/theme/Provider/ThemeProvider.tsx` created
- [ ] ThemeProvider component defined
- [ ] Props interface created
- [ ] State initialized properly
- [ ] Theme loading on mount implemented
- [ ] updateTheme function created
- [ ] resetTheme function created
- [ ] Context value assembled correctly
- [ ] ThemeContext.Provider renders children
- [ ] Error handling implemented
- [ ] index.ts file created with exports

---

## Task 05: Create useTheme Hook

### Overview
Create a custom React hook that provides convenient access to theme data and operations. This hook simplifies theme consumption in components by providing direct access to theme values, colors, fonts, and update functions. It abstracts away the context usage and provides a clean API for components.

### Dependencies
- Task 04: Create Theme Provider

### Instructions

1. **Create useTheme hook file**
   - Navigate to `frontend/hooks/storefront/` directory
   - Create new file named `useTheme.ts`
   - Set up TypeScript hook structure

2. **Import dependencies**
   - Import useThemeContext from ThemeProvider
   - Import Theme type and related types
   - Import necessary React hooks if needed

3. **Define useTheme return type**
   - Create UseThemeReturn interface
   - Include theme object
   - Include individual theme properties (colors, fonts, logo)
   - Include helper functions (updateTheme, resetTheme)
   - Include state properties (isLoading, error)

4. **Implement useTheme hook**
   - Call useThemeContext to get context value
   - Destructure context values
   - Create convenience accessors for colors
   - Create convenience accessors for fonts
   - Create convenience accessors for logo
   - Return comprehensive object

5. **Add color utility functions**
   - Create functions to get color by name
   - Create function to get all colors
   - Create function to check if color exists

6. **Add font utility functions**
   - Create functions to get font by type
   - Create function to get font scale
   - Create function to get font weight

7. **Add theme query helpers**
   - Create function to check if theme is loaded
   - Create function to check if theme is loading
   - Create function to check if theme has errors

8. **Add TypeScript type exports**
   - Export UseThemeReturn interface
   - Export all utility types
   - Add JSDoc comments for documentation

### Hook Return Structure

```
useTheme() returns:
├── theme: Theme | null
├── colors: ThemeColors | null
├── fonts: ThemeFonts | null
├── logo: ThemeLogo | null
├── homepage: ThemeHomepage | null
├── updateTheme: (updates) => Promise<void>
├── resetTheme: () => Promise<void>
├── isLoading: boolean
├── error: string | null
├── getColor: (name: string) => string
├── getFont: (type: string) => string
└── isThemeReady: boolean
```

### UseThemeReturn Properties

| Property | Type | Description |
|----------|------|-------------|
| theme | Theme \| null | Complete theme object |
| colors | ThemeColors \| null | Color palette |
| fonts | ThemeFonts \| null | Font configuration |
| logo | ThemeLogo \| null | Logo settings |
| homepage | ThemeHomepage \| null | Homepage config |
| updateTheme | Function | Update theme values |
| resetTheme | Function | Reset to defaults |
| isLoading | boolean | Loading indicator |
| error | string \| null | Error message |
| isThemeReady | boolean | Theme loaded flag |

### Utility Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| getColor | name: string | string | Get color by name |
| getFont | type: 'heading' \| 'body' | string | Get font family |
| getFontWeight | weight: string | number | Get font weight |
| isThemeReady | - | boolean | Check if loaded |

### Hook Usage Patterns

```
Component Usage Examples:

// Basic usage
const { theme, colors } = useTheme();

// Access specific colors
const { getColor } = useTheme();
const primary = getColor('primary');

// Update theme
const { updateTheme } = useTheme();
await updateTheme({ colors: { primary: '#ff0000' } });

// Check loading state
const { isLoading, isThemeReady } = useTheme();
if (!isThemeReady) return <Loader />;

// Access fonts
const { fonts, getFont } = useTheme();
const headingFont = getFont('heading');
```

### Hook Benefits

| Benefit | Description |
|---------|-------------|
| Convenience | Direct access to theme properties |
| Type Safety | Full TypeScript support |
| Simplicity | Clean API for components |
| Utilities | Helper functions included |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| No Provider | Throws error from useThemeContext |
| Theme null | Returns null for theme properties |
| Invalid color | getColor returns fallback |
| Invalid font | getFont returns fallback |

### Expected Outcome
- Custom hook for easy theme access
- Convenience functions for common operations
- Type-safe theme consumption
- Simplified component integration

### Verification Checklist
- [ ] `frontend/hooks/storefront/useTheme.ts` file created
- [ ] useTheme hook defined
- [ ] UseThemeReturn interface created
- [ ] Hook calls useThemeContext
- [ ] Convenience accessors for colors created
- [ ] Convenience accessors for fonts created
- [ ] Utility functions implemented
- [ ] TypeScript types exported
- [ ] JSDoc comments added

---

## Task 06: Create Default Theme

### Overview
Define the default theme configuration with LankaCommerce Cloud brand colors, fonts, and settings. This serves as the fallback theme when no custom theme is loaded, during initial load, or when API fails. The default theme ensures the storefront always has a professional, functional appearance.

### Dependencies
- Task 02: Create Theme Types

### Instructions

1. **Create defaults file**
   - Navigate to `frontend/styles/theme/` directory
   - Create new file named `defaults.ts`
   - Set up TypeScript exports

2. **Import theme types**
   - Import Theme interface
   - Import ThemeColors, ThemeFonts, ThemeLogo types
   - Import any required utilities

3. **Define default colors**
   - Create defaultColors object of type ThemeColors
   - Set primary color (LCC blue: #2563eb)
   - Set secondary color (slate gray: #64748b)
   - Set accent color (amber: #f59e0b)
   - Set background colors (white, light gray)
   - Set text colors (dark for readability)
   - Set border colors (light and dark variants)
   - Set status colors (success, warning, error, info)

4. **Define default fonts**
   - Create defaultFonts object of type ThemeFonts
   - Set heading font (Inter or similar)
   - Set body font (Open Sans or similar)
   - Set font scale to 1.0 (base size)
   - Set font weights (light, normal, medium, bold)

5. **Define default logo**
   - Create defaultLogo object of type ThemeLogo
   - Set placeholder logo URL
   - Set descriptive alt text
   - Set reasonable dimensions (200x60)
   - Include dark mode variant if available

6. **Define default homepage settings**
   - Create defaultHomepage object
   - Configure hero section defaults
   - Configure featured products settings
   - Configure banner defaults
   - Set layout preferences

7. **Assemble complete default theme**
   - Create defaultTheme object of type Theme
   - Set id to 'default'
   - Set name to 'LankaCommerce Default'
   - Include default colors
   - Include default fonts
   - Include default logo
   - Include default homepage settings
   - Set isActive to true
   - Set timestamps

8. **Export default theme**
   - Export defaultTheme as named export
   - Export individual sections (colors, fonts, etc.)
   - Add JSDoc comments with usage examples

### Default Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| Primary | #2563eb | Buttons, links, primary actions |
| Secondary | #64748b | Secondary buttons, less emphasis |
| Accent | #f59e0b | Highlights, call-to-action |
| Background | #ffffff | Page background |
| Surface | #f8fafc | Cards, panels |
| Text Primary | #0f172a | Main text content |
| Text Secondary | #64748b | Less important text |
| Text Disabled | #cbd5e1 | Disabled elements |
| Border Light | #e2e8f0 | Subtle borders |
| Border Dark | #94a3b8 | Emphasized borders |
| Success | #10b981 | Success messages |
| Warning | #f59e0b | Warnings |
| Error | #ef4444 | Error messages |
| Info | #3b82f6 | Information |

### Default Font Configuration

| Property | Value | Usage |
|----------|-------|-------|
| Heading | "Inter, system-ui, sans-serif" | H1-H6 elements |
| Body | "Open Sans, system-ui, sans-serif" | Paragraph, general text |
| Scale | 1.0 | Base font size multiplier |
| Light | 300 | Light weight text |
| Normal | 400 | Regular text |
| Medium | 500 | Slightly emphasized |
| Bold | 700 | Strong emphasis |

### Default Logo Configuration

| Property | Value | Description |
|----------|-------|-------------|
| URL | "/images/default-logo.png" | Placeholder logo |
| Alt | "Store Logo" | Accessibility text |
| Width | 200 | Logo width (px) |
| Height | 60 | Logo height (px) |
| Dark Mode URL | "/images/default-logo-dark.png" | Dark variant |

### Default Homepage Configuration

| Section | Default Values |
|---------|----------------|
| Hero | Title, subtitle, CTA, background |
| Featured Products | Count: 8, Layout: grid |
| Banners | Count: 2, Position: middle |
| Layout | Type: standard, Columns: 4 |

### Theme Hierarchy

```
defaultTheme
├── id: 'default'
├── name: 'LankaCommerce Default'
├── colors: defaultColors
│   ├── primary: '#2563eb'
│   ├── secondary: '#64748b'
│   └── ... (all colors)
├── fonts: defaultFonts
│   ├── heading: 'Inter'
│   ├── body: 'Open Sans'
│   └── ... (all font settings)
├── logo: defaultLogo
│   ├── url: '/images/default-logo.png'
│   └── ... (logo settings)
├── homepage: defaultHomepage
│   └── ... (homepage settings)
└── metadata
    ├── isActive: true
    └── timestamps
```

### Color Accessibility

| Pairing | Contrast Ratio | WCAG Level |
|---------|----------------|------------|
| Primary on white | 7.0:1 | AAA |
| Text primary on white | 15.4:1 | AAA |
| Text secondary on white | 4.8:1 | AA |
| Primary on surface | 6.5:1 | AAA |

### Expected Outcome
- Comprehensive default theme configuration
- Brand-consistent colors and fonts
- Accessible color combinations
- Professional default appearance
- Fallback for API failures

### Verification Checklist
- [ ] `frontend/styles/theme/defaults.ts` file created
- [ ] defaultColors object defined
- [ ] defaultFonts object defined
- [ ] defaultLogo object defined
- [ ] defaultHomepage object defined
- [ ] Complete defaultTheme object created
- [ ] All colors meet accessibility standards
- [ ] All types match Theme interface
- [ ] Exports configured properly
- [ ] JSDoc comments added

---

## Task 07: Create Theme Loader

### Overview
Create the theme loader mechanism that fetches theme data from the API, handles caching, and manages theme updates. This component orchestrates the initial theme load, checks cache validity, fetches fresh data when needed, and coordinates with the theme store and CSS injection system.

### Dependencies
- Task 04: Create Theme Provider

### Instructions

1. **Add loader to ThemeProvider**
   - Open ThemeProvider.tsx file
   - Identify initialization section
   - Plan loader integration points

2. **Create loadTheme function**
   - Define async function within ThemeProvider
   - Accept optional tenantId parameter
   - Return Promise<Theme>
   - Handle all loading scenarios

3. **Implement cache checking**
   - Check localStorage for cached theme
   - Verify cache is for correct tenant
   - Check cache timestamp for freshness
   - Determine if cache is valid (< 1 hour old)

4. **Handle cache hit scenario**
   - If cache valid and fresh, parse cached theme
   - Validate cached theme structure
   - Return cached theme immediately
   - Skip API call
   - Log cache usage for debugging

5. **Handle cache miss scenario**
   - If no cache or stale, proceed to API fetch
   - Preserve loading state during fetch
   - Continue to API loading logic

6. **Implement API fetch**
   - Call theme service (Task 08) to fetch theme
   - Pass tenantId to API service
   - Handle successful response
   - Transform API response to Theme type
   - Validate fetched theme

7. **Update cache after fetch**
   - Store fetched theme in localStorage
   - Include timestamp with cache entry
   - Set cache key as 'theme-{tenantId}'
   - Handle cache storage errors gracefully

8. **Handle API errors**
   - Catch network errors
   - Catch API errors (404, 500, etc.)
   - Log errors for debugging
   - Fall back to cached theme if available
   - Fall back to default theme if no cache
   - Set error state in context

9. **Integrate with theme state**
   - Update theme state with loaded theme
   - Update loading state to false
   - Clear any existing errors
   - Trigger CSS variable injection

10. **Add retry logic**
    - Implement exponential backoff for retries
    - Retry failed API calls (max 3 attempts)
    - Handle persistent failures gracefully
    - Provide user feedback on failures

11. **Create refresh mechanism**
    - Add function to force reload theme
    - Bypass cache on refresh
    - Useful for admin theme updates
    - Expose via context if needed

### Loader Flow Diagram

```
loadTheme()
    │
    ├─→ Check Cache
    │   ├─→ Valid & Fresh?
    │   │   ├─→ YES: Return Cached Theme ✓
    │   │   └─→ NO: Continue to API
    │   │
    │   └─→ Fetch from API
    │       ├─→ Success?
    │       │   ├─→ YES: Cache & Return Theme ✓
    │       │   └─→ NO: Check for Fallbacks
    │       │       ├─→ Stale Cache? Use It
    │       │       └─→ No Cache? Use Default
    │       │
    │       └─→ Apply Theme
    │           ├─→ Update State
    │           ├─→ Inject CSS Variables
    │           └─→ Complete ✓
```

### Cache Strategy

| Scenario | Cache Age | Action |
|----------|-----------|--------|
| Fresh Cache | < 1 hour | Use cache, skip API |
| Stale Cache | > 1 hour | Fetch API, update cache |
| No Cache | N/A | Fetch API, create cache |
| API Failure with Stale Cache | Any age | Use stale cache |
| API Failure without Cache | N/A | Use default theme |

### Loading States

| State | isLoading | theme | Description |
|-------|-----------|-------|-------------|
| Initial | true | null | Starting load |
| Checking Cache | true | null | Reading localStorage |
| Cache Hit | false | cached | Using cached theme |
| API Loading | true | cached/default | Fetching from API |
| API Success | false | fetched | Theme loaded |
| API Error | false | cached/default | Error with fallback |

### Cache Structure

```javascript
// localStorage key: 'theme-{tenantId}'
{
  theme: Theme,        // Complete theme object
  timestamp: number,   // Cache creation time
  version: string,     // Theme version (if applicable)
  tenantId: string     // Tenant identifier
}
```

### Error Handling Matrix

| Error Type | Cache Available | Recovery Action |
|------------|-----------------|-----------------|
| Network Error | Yes (stale) | Use stale cache |
| Network Error | No | Use default theme |
| 404 Not Found | Any | Use default theme |
| 500 Server Error | Yes | Use cache, retry |
| 500 Server Error | No | Use default, retry |
| Invalid Response | Yes | Use cache, log error |
| Invalid Response | No | Use default, log error |

### Retry Configuration

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | 0ms | Immediate fetch |
| 2 | 1000ms | Retry after 1s |
| 3 | 3000ms | Retry after 3s |
| Failed | - | Use fallback |

### Cache Invalidation

| Trigger | Action |
|---------|--------|
| Theme Updated | Clear cache, fetch fresh |
| Force Refresh | Bypass cache, fetch |
| Tenant Switch | Clear old cache |
| Cache Error | Remove corrupted cache |

### Expected Outcome
- Reliable theme loading mechanism
- Efficient caching strategy
- Graceful error handling
- Fast subsequent loads with cache
- Automatic fallback to defaults

### Verification Checklist
- [ ] loadTheme function created in ThemeProvider
- [ ] Cache checking logic implemented
- [ ] Cache validation (timestamp, tenant) working
- [ ] API fetch integration complete
- [ ] Cache update after fetch working
- [ ] Error handling for API failures
- [ ] Fallback to cached theme on error
- [ ] Fallback to default theme when no cache
- [ ] Loading states managed properly
- [ ] Retry logic implemented
- [ ] Force refresh mechanism added

---

## Task 08: Create Theme API Service

### Overview
Create a service module that handles all API communication for theme data. This service provides functions to fetch, update, and manage themes through backend API endpoints. It abstracts away the HTTP layer and provides a clean interface for theme data operations.

### Dependencies
- Task 07: Create Theme Loader

### Instructions

1. **Create theme service file**
   - Navigate to `frontend/services/storefront/` directory
   - Create new file named `themeService.ts`
   - Set up TypeScript service structure

2. **Import dependencies**
   - Import axios or fetch API wrapper
   - Import Theme type and related types
   - Import API configuration and base URLs
   - Import error handling utilities

3. **Define API endpoints**
   - Create constant for theme base endpoint
   - Define endpoint structure: `/api/storefront/theme`
   - Support tenant-specific endpoints
   - Support query parameters for filtering

4. **Create fetchTheme function**
   - Define async function to get theme
   - Accept optional tenantId parameter
   - Build API URL with tenant parameter
   - Make GET request to theme endpoint
   - Handle successful response
   - Transform response data to Theme type
   - Validate response structure
   - Return Theme object
   - Handle errors and throw appropriate exceptions

5. **Create updateTheme function**
   - Define async function to update theme
   - Accept themeId and partial updates
   - Build API URL with theme ID
   - Make PATCH request with update data
   - Handle successful response
   - Return updated Theme object
   - Handle validation errors from server
   - Handle permission errors

6. **Create createTheme function**
   - Define async function to create new theme
   - Accept complete theme data
   - Make POST request to theme endpoint
   - Handle successful response
   - Return newly created Theme object
   - Handle duplicate theme errors

7. **Create deleteTheme function**
   - Define async function to delete theme
   - Accept themeId parameter
   - Make DELETE request to theme endpoint
   - Handle successful response
   - Return success confirmation
   - Handle not found errors

8. **Create getDefaultTheme function**
   - Define function to fetch system default theme
   - Make GET request to default theme endpoint
   - Return default Theme object
   - Handle errors gracefully

9. **Add request interceptor**
   - Intercept outgoing requests
   - Add authentication tokens
   - Add tenant context headers
   - Handle request configuration

10. **Add response interceptor**
    - Intercept API responses
    - Transform response data format
    - Extract theme data from response
    - Handle common error responses
    - Provide consistent error messages

11. **Add error handling utilities**
    - Create custom error types for theme errors
    - Handle network errors
    - Handle validation errors
    - Handle authentication errors
    - Provide user-friendly error messages

12. **Add TypeScript types for requests/responses**
    - Define ThemeRequest type
    - Define ThemeResponse type
    - Define ThemeUpdateRequest type
    - Export all service types

### API Endpoints

| Method | Endpoint | Purpose | Parameters |
|--------|----------|---------|------------|
| GET | `/api/storefront/theme` | Get current theme | tenantId (query) |
| GET | `/api/storefront/theme/:id` | Get specific theme | id (path) |
| POST | `/api/storefront/theme` | Create new theme | body: Theme |
| PATCH | `/api/storefront/theme/:id` | Update theme | id (path), body: Partial<Theme> |
| DELETE | `/api/storefront/theme/:id` | Delete theme | id (path) |
| GET | `/api/storefront/theme/default` | Get default theme | none |

### Service Functions

| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| fetchTheme | tenantId?: string | Promise<Theme> | Get theme for tenant |
| updateTheme | id: string, updates: Partial<Theme> | Promise<Theme> | Update existing theme |
| createTheme | theme: Theme | Promise<Theme> | Create new theme |
| deleteTheme | id: string | Promise<void> | Delete theme |
| getDefaultTheme | none | Promise<Theme> | Get system default |

### Request/Response Structure

```typescript
// GET /api/storefront/theme?tenantId=xyz
Response: {
  success: true,
  data: {
    theme: Theme
  }
}

// PATCH /api/storefront/theme/:id
Request: {
  colors: { primary: "#ff0000" }
}
Response: {
  success: true,
  data: {
    theme: Theme
  }
}
```

### Error Handling

| Error Code | Error Type | Recovery Action |
|------------|------------|-----------------|
| 404 | Theme Not Found | Use default theme |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden | Show permission error |
| 422 | Validation Error | Show field errors |
| 500 | Server Error | Retry with backoff |
| Network | Connection Failed | Use cached theme |

### Service Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Base URL | from config | API base address |
| Timeout | 10000ms | Request timeout |
| Retry | 3 attempts | Failed request retries |
| Headers | Auth token, Content-Type | Request headers |

### Authentication Integration

| Aspect | Implementation |
|--------|----------------|
| Token | Include JWT in Authorization header |
| Tenant | Include tenant ID in X-Tenant-ID header |
| Refresh | Handle token refresh automatically |

### Response Transformation

```
API Response → Service Layer → Application

{                    {               Theme {
  success: true,       ...data,        id: string,
  data: {          →   ...          →  colors: {...},
    theme: {...}       transformed      fonts: {...},
  }                  }                  ...
}                                    }
```

### Expected Outcome
- Complete API service for theme operations
- Type-safe API functions
- Robust error handling
- Request/response interceptors
- Clean abstraction for HTTP layer

### Verification Checklist
- [ ] `frontend/services/storefront/themeService.ts` file created
- [ ] fetchTheme function implemented
- [ ] updateTheme function implemented
- [ ] createTheme function implemented
- [ ] deleteTheme function implemented
- [ ] getDefaultTheme function implemented
- [ ] Request interceptor configured
- [ ] Response interceptor configured
- [ ] Error handling utilities created
- [ ] TypeScript types for requests/responses defined
- [ ] All functions exported properly
- [ ] JSDoc comments added

---

## Summary

This document established the core theme provider infrastructure, including directory structure, TypeScript types, React Context, provider component, custom hooks, default theme configuration, theme loading mechanism, and API service integration. These components form the foundation of the dynamic theming system that allows each storefront instance to maintain its unique brand identity.

### Completed Tasks
1. ✓ Created theme directory structure with organized file locations
2. ✓ Defined comprehensive TypeScript types and interfaces
3. ✓ Created React Context for theme access
4. ✓ Created ThemeProvider component with loading and state management
5. ✓ Created useTheme custom hook for convenient theme access
6. ✓ Defined default theme with brand colors and fonts
7. ✓ Implemented theme loader with caching and fallback logic
8. ✓ Created theme API service for backend communication

### System Architecture

```
Theme System (Tasks 01-08)
├── Directory Structure (Task 01)
│   └── Organized file locations
├── TypeScript Types (Task 02)
│   └── Complete type safety
├── React Context (Task 03)
│   └── Context API setup
├── Theme Provider (Task 04)
│   └── Core orchestrator
├── useTheme Hook (Task 05)
│   └── Convenient access
├── Default Theme (Task 06)
│   └── Fallback configuration
├── Theme Loader (Task 07)
│   └── Loading and caching
└── API Service (Task 08)
    └── Backend communication
```

### Next Steps
Proceed to [02_Tasks-09-16_CSS-Store-Verify.md](02_Tasks-09-16_CSS-Store-Verify.md) to implement CSS variable injection, Zustand store integration, theme validation, local caching, and verification procedures.

---

**Document Complete** | 8 of 16 Tasks Documented