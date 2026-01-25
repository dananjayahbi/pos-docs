# Tasks 01-08: CLI Setup and Utilities

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** A - Shadcn/UI Installation & Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-14_Radix-Forms-Verification.md](02_Tasks-09-14_Radix-Forms-Verification.md)

---

## Document Overview

This document covers the foundational setup of Shadcn/UI component library, including CLI installation, initialization, configuration, utility dependencies, helper functions, icon integration, and component wrappers. These elements establish the base infrastructure for the component system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Shadcn/UI CLI | Low | 5 min |
| 02 | Initialize Shadcn/UI | Low | 10 min |
| 03 | Configure components.json | Low | 10 min |
| 04 | Create components/ui Directory | Low | 5 min |
| 05 | Install Utility Dependencies | Low | 5 min |
| 06 | Create cn Utility Function | Low | 10 min |
| 07 | Install Lucide Icons | Low | 5 min |
| 08 | Create Icon Component Wrapper | Low | 15 min |

---

## Task 01: Install Shadcn/UI CLI

### Overview
Install the Shadcn/UI CLI tool as a development dependency to enable component installation and management. The CLI provides commands to initialize the project, add components, and manage configuration.

### Dependencies
- SubPhase-02 (Next.js project must be initialized)
- pnpm package manager must be available
- Node.js environment configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Navigate to `frontend/` directory
   - Ensure package.json exists

2. **Install CLI package**
   - Run pnpm add command with dev flag
   - Install shadcn-ui package
   - Package will be added to devDependencies

3. **Verify installation**
   - Check package.json devDependencies section
   - Confirm shadcn-ui is listed
   - Note installed version

4. **Verify CLI availability**
   - Test CLI command using pnpx
   - Run help command to see available options
   - Confirm CLI responds successfully

### Installation Command
```bash
pnpm add -D shadcn-ui
```

### Expected Package Entry
The package.json devDependencies section should include:
- Package name: shadcn-ui
- Version: Latest stable (check npm registry)

### CLI Usage
After installation, the CLI can be invoked using:
- Direct: `pnpx shadcn-ui`
- With command: `pnpx shadcn-ui@latest [command]`

### Verification Checklist
- [ ] Frontend directory contains package.json
- [ ] pnpm add command executed successfully
- [ ] shadcn-ui appears in devDependencies
- [ ] CLI help command runs without errors
- [ ] Version number displayed correctly

---

## Task 02: Initialize Shadcn/UI

### Overview
Run the Shadcn/UI initialization command to set up the project structure, create configuration files, and prepare the environment for component installation. This interactive process configures aliases, paths, and component preferences.

### Dependencies
- Task 01 (CLI must be installed)
- Tailwind CSS must be configured (SubPhase-02)
- TypeScript must be set up

### Instructions

1. **Run initialization command**
   - Navigate to frontend directory in terminal
   - Execute shadcn-ui init command
   - Use latest version with pnpx

2. **Select style preference**
   - Choose "New York" style when prompted
   - This affects component design aesthetic
   - Can be changed later if needed

3. **Enable TypeScript**
   - Confirm TypeScript usage (yes)
   - Ensures components use .tsx extensions
   - Required for type safety

4. **Enable React Server Components**
   - Choose yes for RSC support
   - Enables "use client" directives when needed
   - Future-proofs component structure

5. **Configure Tailwind path**
   - Point to tailwind.config.js or tailwind.config.ts
   - Default path should work
   - Verify path exists

6. **Set component alias**
   - Configure as @/components
   - Enables clean imports throughout app
   - Update tsconfig paths if needed

7. **Set utils alias**
   - Configure as @/lib/utils
   - Centralizes utility functions
   - Ensures consistent import paths

8. **Confirm global CSS location**
   - Point to app/globals.css
   - Ensure CSS variables will be added there
   - Check file exists

9. **Review created files**
   - Check for components.json in root
   - Verify lib/utils.ts creation
   - Confirm CSS variables added

### Initialization Command
```bash
pnpx shadcn-ui@latest init
```

### Interactive Prompts

| Prompt | Recommended Answer | Purpose |
|--------|-------------------|---------|
| Style? | New York | Modern component design |
| TypeScript? | Yes | Type safety |
| React Server Components? | Yes | Next.js 14+ compatibility |
| Tailwind config? | tailwind.config.js | Styling configuration |
| Component alias? | @/components | Clean imports |
| Utils alias? | @/lib/utils | Utility imports |
| Global CSS? | app/globals.css | CSS variables |

### Configuration Flow

```
Initialize Command
    ├── Create components.json
    ├── Set up lib/utils.ts
    ├── Add CSS variables to globals.css
    ├── Configure TypeScript paths
    └── Prepare components/ui directory
```

### Files Created/Modified

| File | Action | Content |
|------|--------|---------|
| components.json | Created | Configuration file |
| lib/utils.ts | Created | cn() helper function |
| app/globals.css | Modified | CSS custom properties |
| tsconfig.json | Modified | Path aliases |

### Expected Outcome
- components.json exists with correct configuration
- lib/utils.ts created with cn() function
- CSS variables added to globals.css
- Project ready for component installation

### Verification Checklist
- [ ] Initialization command completed successfully
- [ ] components.json file exists in frontend root
- [ ] lib/utils.ts file created
- [ ] CSS variables present in globals.css
- [ ] No error messages during initialization
- [ ] TypeScript paths configured correctly

---

## Task 03: Configure components.json

### Overview
Review and customize the components.json configuration file created during initialization. This file controls component installation behavior, paths, styling preferences, and TypeScript settings.

### Dependencies
- Task 02 (Initialization must be complete)
- components.json file must exist

### Instructions

1. **Open components.json**
   - Navigate to frontend root directory
   - Open components.json in editor
   - Review default configuration

2. **Verify schema reference**
   - Check $schema property points to Shadcn schema
   - Enables IDE autocomplete and validation
   - Should reference latest schema version

3. **Confirm style setting**
   - Ensure style is "new-york"
   - This affects component variants
   - Consistent with initialization choice

4. **Verify RSC configuration**
   - Check rsc property is true
   - Enables React Server Component support
   - Required for Next.js App Router

5. **Confirm TSX setting**
   - Ensure tsx is true
   - Components will use TypeScript
   - Enables type checking

6. **Review Tailwind configuration**
   - Check tailwind.config points to correct file
   - Verify tailwind.css points to globals.css
   - Ensure tailwind.baseColor is set appropriately

7. **Verify path aliases**
   - Check aliases.components is "@/components"
   - Confirm aliases.utils is "@/lib/utils"
   - Ensure paths match tsconfig.json

8. **Save configuration**
   - No changes needed if defaults are correct
   - Save file if customizations made
   - Configuration is now locked for consistency

### Configuration Structure

```
components.json
    ├── $schema         → Schema validation URL
    ├── style           → Component design style
    ├── rsc             → React Server Components
    ├── tsx             → TypeScript support
    ├── tailwind
    │   ├── config      → Tailwind config path
    │   ├── css         → Global CSS path
    │   └── baseColor   → Base color scheme
    └── aliases
        ├── components  → Component import alias
        └── utils       → Utils import alias
```

### Key Configuration Options

| Option | Value | Impact |
|--------|-------|--------|
| style | "new-york" | Modern component aesthetic |
| rsc | true | Server component support |
| tsx | true | TypeScript files |
| tailwind.config | "tailwind.config.js" | Styling source |
| tailwind.css | "app/globals.css" | CSS variables location |
| aliases.components | "@/components" | Import path prefix |
| aliases.utils | "@/lib/utils" | Utility import prefix |

### LCC-Specific Considerations

| Aspect | Configuration | Rationale |
|--------|--------------|-----------|
| Base Color | slate | Neutral, professional |
| Style | new-york | Modern ERP aesthetic |
| RSC | Enabled | Next.js 14+ best practice |
| TypeScript | Required | Type safety for complex ERP |

### Expected Configuration
The components.json should contain:
- Schema reference for validation
- Style set to "new-york"
- RSC and TSX both enabled
- Correct Tailwind paths
- Proper aliases matching tsconfig.json

### Verification Checklist
- [ ] components.json exists in frontend root
- [ ] $schema property present
- [ ] style is "new-york"
- [ ] rsc is true
- [ ] tsx is true
- [ ] tailwind.config path correct
- [ ] Component and utils aliases configured
- [ ] File validates without errors

---

## Task 04: Create components/ui Directory

### Overview
Establish the components/ui directory structure where all Shadcn/UI components will be installed. This directory serves as the centralized location for base UI components that will be used throughout the application.

### Dependencies
- Task 02 (Initialization complete)
- Frontend directory structure exists

### Instructions

1. **Verify components directory**
   - Navigate to frontend root
   - Check if components/ directory exists
   - Created during initialization or manually

2. **Create ui subdirectory**
   - Inside components/, create ui/ folder
   - This will house all Shadcn components
   - Keeps components organized

3. **Add directory documentation**
   - Consider adding README.md in ui/
   - Document that this contains Shadcn components
   - Note components are auto-generated

4. **Set up .gitkeep if needed**
   - If directory is empty, add .gitkeep
   - Ensures directory tracked by git
   - Remove after first component added

5. **Verify structure**
   - Confirm components/ui/ path exists
   - Ready for component installation
   - Matches components.json alias

### Directory Structure
```
frontend/
└── components/
    └── ui/
        └── (Shadcn components will be installed here)
```

### Purpose of ui/ Directory

| Aspect | Purpose |
|--------|---------|
| Location | Central component repository |
| Contents | Base Shadcn/UI components |
| Management | CLI-managed, version controlled |
| Customization | Can be modified after installation |

### Directory Organization

```
components/ui/
    ├── button.tsx         → Installed via CLI
    ├── input.tsx          → Installed via CLI
    ├── card.tsx           → Installed via CLI
    └── (other components) → Added as needed
```

### Expected Outcome
- components/ui/ directory exists
- Ready to receive component installations
- Matches alias configuration
- Git tracking enabled

### Verification Checklist
- [ ] components/ directory exists
- [ ] ui/ subdirectory created
- [ ] Path matches @/components/ui alias
- [ ] Directory empty and ready
- [ ] Git tracking confirmed

---

## Task 05: Install Utility Dependencies

### Overview
Install essential utility packages that support Shadcn/UI components. These packages provide class name management, conditional styling, and component variant handling crucial for dynamic styling.

### Dependencies
- Task 02 (Project initialized)
- pnpm package manager available

### Instructions

1. **Install clsx package**
   - Navigate to frontend directory
   - Install clsx for conditional classes
   - Used for dynamic className construction

2. **Install tailwind-merge**
   - Install tailwind-merge package
   - Intelligently merges Tailwind classes
   - Prevents class conflicts

3. **Install class-variance-authority**
   - Install CVA package
   - Enables component variant patterns
   - Used for component variations

4. **Verify installations**
   - Check package.json dependencies
   - All three packages should be listed
   - Note installed versions

5. **Test imports**
   - Verify packages can be imported
   - Check no installation errors
   - Ready for use in utils

### Installation Commands

```bash
# Install all utilities at once
pnpm add clsx tailwind-merge class-variance-authority

# Or install separately
pnpm add clsx
pnpm add tailwind-merge
pnpm add class-variance-authority
```

### Package Purposes

| Package | Purpose | Use Case |
|---------|---------|----------|
| clsx | Conditional class strings | Dynamic className values |
| tailwind-merge | Merge Tailwind classes | Prevent class conflicts |
| class-variance-authority | Component variants | Button sizes, colors, etc. |

### Usage Examples

#### clsx
Combines class names conditionally:
- Accepts strings, objects, arrays
- Filters falsy values automatically
- Clean conditional styling

#### tailwind-merge
Merges Tailwind classes intelligently:
- Resolves conflicting utilities
- Keeps last class when conflict exists
- Prevents style override issues

#### class-variance-authority (CVA)
Creates component variants:
- Defines variant types
- Compound variants
- Default variants

### Package Integration Flow

```
clsx + tailwind-merge
    ↓
cn() utility function
    ↓
Used by Shadcn components
    ↓
Used by custom components
    ↓
Consistent styling system
```

### Expected Outcome
- Three utility packages installed
- Listed in package.json dependencies
- Ready for cn() function implementation
- No installation errors

### Verification Checklist
- [ ] clsx installed and in package.json
- [ ] tailwind-merge installed and in package.json
- [ ] class-variance-authority installed
- [ ] No installation errors
- [ ] Packages importable in TypeScript

---

## Task 06: Create cn Utility Function

### Overview
Create the cn() utility function that combines clsx and tailwind-merge to provide intelligent class name merging. This function is the foundation of dynamic styling throughout the component library.

### Dependencies
- Task 05 (Utility packages must be installed)
- lib/utils.ts file exists (created in Task 02)

### Instructions

1. **Open lib/utils.ts**
   - Navigate to frontend/lib/ directory
   - Open utils.ts file in editor
   - File should already exist from initialization

2. **Import required packages**
   - Import type ClassValue from clsx
   - Import clsx function from clsx
   - Import twMerge function from tailwind-merge

3. **Define cn function**
   - Create exported function named cn
   - Accept rest parameter of ClassValue type
   - Return type is string

4. **Implement function logic**
   - Pass inputs to clsx function
   - Wrap result with twMerge function
   - Return final merged string

5. **Add JSDoc comments**
   - Document function purpose
   - Explain parameter types
   - Describe return value

6. **Test function**
   - Create simple test case
   - Verify class merging works
   - Confirm conflicts resolved correctly

### Function Implementation

The cn() function should:
- Accept multiple class name inputs
- Handle strings, objects, arrays
- Merge classes intelligently
- Resolve Tailwind conflicts
- Return single class string

### Implementation Structure

```
cn() function
    ├── Accept ClassValue[] inputs
    ├── Process with clsx()
    ├── Merge with twMerge()
    └── Return merged string
```

### Function Signature

```typescript
function cn(...inputs: ClassValue[]): string
```

### Usage Pattern

The function will be used throughout components:
- Base classes + conditional classes
- Component props + default classes
- Variant classes + override classes

### Common Use Cases

| Scenario | Example |
|----------|---------|
| Conditional class | cn("base-class", condition && "extra-class") |
| Override default | cn("text-gray-500", props.className) |
| Merge variants | cn(variantClass, sizeClass, props.className) |

### Expected Outcome
- cn() function defined in lib/utils.ts
- Properly typed with TypeScript
- Intelligently merges class names
- Ready for use in all components

### Verification Checklist
- [ ] lib/utils.ts contains cn function
- [ ] Correct imports from clsx and tailwind-merge
- [ ] Function properly typed
- [ ] JSDoc comments added
- [ ] Function exports correctly
- [ ] No TypeScript errors

---

## Task 07: Install Lucide Icons

### Overview
Install Lucide React icon library to provide a comprehensive set of consistent, customizable icons for the ERP dashboard. Lucide is a fork of Feather Icons with additional icons and better React support.

### Dependencies
- Task 02 (Project initialized)
- React and TypeScript configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend directory
   - Ensure package.json exists

2. **Install lucide-react package**
   - Run pnpm add command
   - Install as production dependency
   - Package provides React icon components

3. **Verify installation**
   - Check package.json dependencies
   - Confirm lucide-react listed
   - Note installed version

4. **Test icon import**
   - Try importing a test icon
   - Verify no import errors
   - Confirm TypeScript types available

5. **Review icon catalog**
   - Browse available icons online
   - Identify commonly needed icons
   - Plan icon usage strategy

### Installation Command

```bash
pnpm add lucide-react
```

### Lucide React Features

| Feature | Benefit |
|---------|---------|
| 1000+ icons | Comprehensive coverage |
| Tree-shakeable | Only bundle used icons |
| TypeScript support | Full type definitions |
| Customizable | Size, color, stroke width |
| Consistent design | Cohesive visual language |

### Icon Categories

| Category | Examples |
|----------|----------|
| Navigation | Home, Menu, ChevronRight |
| Actions | Plus, Edit, Trash, Save |
| Files | File, Folder, Download, Upload |
| Communication | Mail, MessageSquare, Phone |
| Status | Check, X, AlertCircle, Info |
| Commerce | ShoppingCart, CreditCard, Package |

### LCC Common Icons

| Use Case | Icon | Purpose |
|----------|------|---------|
| Dashboard | LayoutDashboard | Main dashboard |
| Products | Package | Product management |
| Orders | ShoppingCart | Order processing |
| Customers | Users | Customer list |
| Reports | BarChart | Analytics |
| Settings | Settings | Configuration |
| Logout | LogOut | User logout |

### Expected Outcome
- lucide-react package installed
- Listed in package.json dependencies
- Icons importable in components
- Ready for wrapper component

### Verification Checklist
- [ ] lucide-react in package.json
- [ ] Installation completed successfully
- [ ] Test icon imports successfully
- [ ] TypeScript types available
- [ ] Icon catalog accessible

---

## Task 08: Create Icon Component Wrapper

### Overview
Create a reusable Icon component wrapper that standardizes icon usage throughout the application. This wrapper provides consistent sizing, styling, and props handling for Lucide icons.

### Dependencies
- Task 07 (Lucide React must be installed)
- components/ui/ directory exists

### Instructions

1. **Create icon.tsx file**
   - Navigate to components/ui/ directory
   - Create new file named icon.tsx
   - Will contain Icon wrapper component

2. **Import Lucide types**
   - Import LucideIcon type from lucide-react
   - Import icons as needed
   - Set up type definitions

3. **Define Icon props interface**
   - Create IconProps interface
   - Include name, size, className properties
   - Extend HTML SVG attributes

4. **Implement size variants**
   - Define size options: xs, sm, md, lg, xl
   - Map to pixel dimensions
   - Use consistent scaling

5. **Create Icon component**
   - Accept icon name as prop
   - Dynamically import matching Lucide icon
   - Apply size and className

6. **Add default props**
   - Default size to "md"
   - Default color to currentColor
   - Inherit parent text color

7. **Export component**
   - Export Icon as default
   - Export IconProps type
   - Add JSDoc comments

8. **Test wrapper**
   - Import in test component
   - Render with different sizes
   - Verify styling applies correctly

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | required | Lucide icon name |
| size | IconSize | "md" | Icon size variant |
| className | string | undefined | Additional classes |
| ...props | SVGProps | - | SVG attributes |

### Size Mapping

| Size | Dimensions | Use Case |
|------|------------|----------|
| xs | 12x12 | Inline text |
| sm | 16x16 | Small buttons |
| md | 20x20 | Default size |
| lg | 24x24 | Prominent actions |
| xl | 32x32 | Hero sections |

### Component Architecture

```
Icon Component
    ├── Props validation
    ├── Size calculation
    ├── Dynamic icon import
    ├── className merging (cn)
    └── Render Lucide component
```

### Usage Examples

The Icon component enables clean usage:
- Single source of truth for icons
- Consistent sizing across app
- Easy to swap icon library later
- Type-safe icon names

### Integration Points

| Location | Usage |
|----------|-------|
| Buttons | Icon + text combination |
| Navigation | Menu items with icons |
| Tables | Action buttons |
| Forms | Input adornments |
| Cards | Header icons |

### Expected Outcome
- Icon wrapper component created
- Supports all Lucide icons
- Consistent sizing system
- Type-safe props
- Ready for use in UI components

### Verification Checklist
- [ ] icon.tsx file created in components/ui/
- [ ] IconProps interface defined
- [ ] Size variants implemented
- [ ] Component properly typed
- [ ] Default props set
- [ ] Component exports correctly
- [ ] Test renders successfully
- [ ] No TypeScript errors

---

## Summary

This document covered the foundational setup of Shadcn/UI including CLI installation, project initialization, configuration management, utility dependencies, helper functions, icon library integration, and component wrappers. The next document will cover Radix UI primitives, form handling libraries, and setup verification.

### Completed Tasks
✓ Task 01: Shadcn/UI CLI installed  
✓ Task 02: Project initialized with configuration  
✓ Task 03: components.json configured  
✓ Task 04: components/ui/ directory created  
✓ Task 05: Utility packages installed (clsx, tailwind-merge, CVA)  
✓ Task 06: cn() utility function created  
✓ Task 07: Lucide React icons installed  
✓ Task 08: Icon wrapper component created

### Key Deliverables
- Shadcn/UI CLI available
- components.json configured
- lib/utils.ts with cn() function
- components/ui/icon.tsx wrapper
- All utility dependencies installed
- Foundation ready for component installation

### Next Steps
Proceed to [02_Tasks-09-14_Radix-Forms-Verification.md](02_Tasks-09-14_Radix-Forms-Verification.md) to install Radix UI primitives, configure component theming, set up form handling libraries, and verify the complete setup.
