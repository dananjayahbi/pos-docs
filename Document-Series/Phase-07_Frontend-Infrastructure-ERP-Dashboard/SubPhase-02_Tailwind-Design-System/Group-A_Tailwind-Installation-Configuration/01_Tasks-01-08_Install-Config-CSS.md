# Tasks 01-08: Install Tailwind and Create CSS Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 02 - Tailwind & Design System  
> **Group:** A - Tailwind Installation & Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-14_Plugins-Verification.md](02_Tasks-09-14_Plugins-Verification.md)

---

## Document Overview

This document covers the installation of Tailwind CSS with PostCSS and Autoprefixer, initialization of configuration files, content path setup, and creation of the three-layer global CSS structure. These steps establish the foundation for the entire design system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Tailwind CSS | Low | 5 min |
| 02 | Initialize Tailwind Config | Low | 5 min |
| 03 | Configure Content Paths | Low | 10 min |
| 04 | Create postcss.config.js | Low | 5 min |
| 05 | Create Global CSS File | Low | 5 min |
| 06 | Configure Tailwind Base Layer | Low | 5 min |
| 07 | Configure Tailwind Components Layer | Low | 5 min |
| 08 | Configure Tailwind Utilities Layer | Low | 5 min |

---

## Task 01: Install Tailwind CSS

### Overview
Install Tailwind CSS along with PostCSS and Autoprefixer as development dependencies. These packages provide the core functionality for utility-first CSS development with automatic vendor prefixing.

### Dependencies
- SubPhase-01: Next.js project initialization completed
- Node.js and pnpm installed
- Package.json exists in frontend directory

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend workspace

2. **Install Tailwind CSS package**
   - Run installation command for Tailwind CSS
   - Use pnpm as package manager
   - Install as dev dependency

3. **Install PostCSS**
   - PostCSS is required for Tailwind CSS processing
   - Install as dev dependency alongside Tailwind

4. **Install Autoprefixer**
   - Autoprefixer adds vendor prefixes automatically
   - Install as dev dependency
   - Required for browser compatibility

5. **Verify installation**
   - Check package.json devDependencies section
   - Confirm all three packages are listed
   - Note version numbers for documentation

### Installation Command
```bash
pnpm add -D tailwindcss postcss autoprefixer
```

### Package Purpose

| Package | Purpose | Role |
|---------|---------|------|
| tailwindcss | Core framework | Utility class generation |
| postcss | CSS processor | Transform CSS with plugins |
| autoprefixer | Vendor prefixes | Cross-browser compatibility |

### Expected Outcome
- Tailwind CSS, PostCSS, and Autoprefixer installed
- Listed in devDependencies of package.json
- node_modules contains package files
- Ready for configuration

### Verification Checklist
- [ ] `pnpm add` command executed successfully
- [ ] tailwindcss listed in package.json devDependencies
- [ ] postcss listed in package.json devDependencies
- [ ] autoprefixer listed in package.json devDependencies
- [ ] node_modules/.pnpm contains tailwindcss packages
- [ ] No installation errors in terminal

---

## Task 02: Initialize Tailwind Config

### Overview
Generate the default Tailwind configuration file using the official CLI command. This creates the tailwind.config.js file which will be customized with project-specific settings throughout the design system setup.

### Dependencies
- Task 01: Install Tailwind CSS

### Instructions

1. **Ensure current directory**
   - Terminal should be in frontend directory
   - Verify with pwd or cd command

2. **Run Tailwind initialization command**
   - Execute initialization with pnpm wrapper
   - Use the -p flag to also create postcss.config.js
   - This generates both configuration files simultaneously

3. **Verify tailwind.config.js creation**
   - Check that file exists in frontend root
   - Review default configuration structure
   - Note the content array (will configure in Task 03)

4. **Review default configuration**
   - Examine the generated file structure
   - Note the module.exports pattern
   - Identify key sections: content, theme, plugins

5. **Prepare for customization**
   - Do not modify the file yet
   - Keep default settings intact
   - Will customize in subsequent tasks

### Initialization Command
```bash
pnpx tailwindcss init -p
```

### Configuration File Structure
The command creates tailwind.config.js with:
- content: Array for file paths to scan
- theme: Object for design tokens (colors, spacing, fonts)
- plugins: Array for Tailwind plugins

### Expected Outcome
- tailwind.config.js created in frontend root
- Default configuration structure in place
- Ready for content path configuration
- Foundation for design system customization

### Verification Checklist
- [ ] Initialization command executed successfully
- [ ] tailwind.config.js file exists in frontend directory
- [ ] File contains module.exports with config object
- [ ] content array exists (empty or with example paths)
- [ ] theme object exists
- [ ] plugins array exists
- [ ] No syntax errors in generated file

---

## Task 03: Configure Content Paths

### Overview
Configure the content paths in tailwind.config.js to tell Tailwind which files to scan for class names. This ensures all utility classes used in TypeScript/React components are included in the final CSS bundle.

### Dependencies
- Task 02: Initialize Tailwind Config

### Instructions

1. **Open tailwind.config.js**
   - Navigate to frontend directory
   - Open the configuration file in editor

2. **Locate content array**
   - Find the content property in config object
   - May contain example paths or be empty
   - Prepare to replace with project-specific paths

3. **Configure pages directory path**
   - Add pattern: './pages/**/*.{js,ts,jsx,tsx,mdx}'
   - Covers all files in pages directory (if using)
   - Includes JavaScript, TypeScript, JSX, TSX, MDX files

4. **Configure components directory path**
   - Add pattern: './components/**/*.{js,ts,jsx,tsx,mdx}'
   - Covers all component files
   - Recursive scan with ** pattern

5. **Configure app directory path**
   - Add pattern: './app/**/*.{js,ts,jsx,tsx,mdx}'
   - Essential for Next.js App Router
   - Scans all route and layout files

6. **Review glob patterns**
   - Ensure correct file extensions included
   - Verify recursive directory scanning (**)
   - Confirm curly braces syntax for multiple extensions

7. **Save configuration**
   - Save tailwind.config.js with updated paths
   - Verify syntax correctness
   - Prepare for next configuration task

### Content Paths Configuration

| Path Pattern | Purpose | Importance |
|--------------|---------|------------|
| `./pages/**/*.{...}` | Pages directory files | Medium (if used) |
| `./components/**/*.{...}` | Component files | High |
| `./app/**/*.{...}` | App Router files | Critical |

### Path Scanning Behavior
```
Content Paths → Tailwind Scans → Detects Classes → Generates CSS
```

### Expected Outcome
- content array contains three path patterns
- All TypeScript/React files will be scanned
- Tailwind generates only used utility classes
- Optimized CSS bundle size

### Verification Checklist
- [ ] tailwind.config.js opened successfully
- [ ] content array contains pages path pattern
- [ ] content array contains components path pattern
- [ ] content array contains app path pattern
- [ ] File extensions include ts, tsx, mdx
- [ ] Glob patterns use ** for recursive scanning
- [ ] No syntax errors (commas, brackets)
- [ ] File saved successfully

---

## Task 04: Create postcss.config.js

### Overview
Create the PostCSS configuration file to enable Tailwind CSS processing and Autoprefixer functionality. This file tells PostCSS which plugins to use when transforming CSS files.

### Dependencies
- Task 01: Install Tailwind CSS (PostCSS and Autoprefixer installed)

### Instructions

1. **Check if file already exists**
   - The `pnpx tailwindcss init -p` command may have created it
   - If exists, verify configuration
   - If not, create manually

2. **Create postcss.config.js file**
   - Create in frontend root directory
   - Same level as tailwind.config.js
   - Use JavaScript module export pattern

3. **Configure PostCSS plugins**
   - Add tailwindcss plugin entry
   - Add autoprefixer plugin entry
   - Maintain correct object structure

4. **Set plugin execution order**
   - Tailwind CSS must run first
   - Autoprefixer runs second
   - Order matters for correct processing

5. **Use CommonJS module format**
   - Use module.exports syntax
   - Compatible with Next.js build process
   - Standard PostCSS configuration format

6. **Verify configuration syntax**
   - Check object structure
   - Ensure proper plugin names
   - Confirm no syntax errors

### PostCSS Configuration Structure

The file should contain:
```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Plugin Processing Flow
```
CSS Input → Tailwind Plugin → Utility Generation → Autoprefixer → Vendor Prefixes → Output CSS
```

### Expected Outcome
- postcss.config.js exists in frontend root
- Contains tailwindcss and autoprefixer plugins
- Proper JavaScript module export format
- Ready to process CSS files

### Verification Checklist
- [ ] postcss.config.js file exists
- [ ] File in frontend root directory
- [ ] Contains module.exports statement
- [ ] plugins object defined
- [ ] tailwindcss plugin entry present
- [ ] autoprefixer plugin entry present
- [ ] Correct syntax (commas, braces)
- [ ] No configuration errors

---

## Task 05: Create Global CSS File

### Overview
Create the main global CSS file (globals.css) that will contain Tailwind directives and custom global styles. This file serves as the entry point for all application styling.

### Dependencies
- Task 02: Initialize Tailwind Config

### Instructions

1. **Create styles directory**
   - Navigate to frontend root directory
   - Create new directory named 'styles'
   - This will contain all global style files

2. **Create globals.css file**
   - Create new file: styles/globals.css
   - This will be the main stylesheet
   - Will contain Tailwind directives

3. **Prepare file structure**
   - Leave file empty for now
   - Will add Tailwind directives in Tasks 06-08
   - Plan three-layer structure

4. **Plan layer organization**
   - First layer: @tailwind base
   - Second layer: @tailwind components
   - Third layer: @tailwind utilities

5. **Consider additional sections**
   - Space for custom base styles (optional)
   - Space for custom component styles (optional)
   - Space for custom utility classes (optional)

### File Location
```
frontend/
├── styles/
│   └── globals.css      ← Create this file
├── tailwind.config.js
└── postcss.config.js
```

### Purpose of globals.css

| Purpose | Description |
|---------|-------------|
| Entry point | Main CSS file for application |
| Tailwind directives | Contains @tailwind imports |
| Custom styles | Location for global overrides |
| Build target | Processed by PostCSS pipeline |

### Expected Outcome
- styles/ directory created
- styles/globals.css file created
- Empty file ready for Tailwind directives
- Foundation for CSS layer structure

### Verification Checklist
- [ ] styles/ directory exists in frontend root
- [ ] globals.css file exists in styles/
- [ ] File path is frontend/styles/globals.css
- [ ] File is empty (ready for directives)
- [ ] No syntax errors or typos in filename
- [ ] Ready for Tailwind directive configuration

---

## Task 06: Configure Tailwind Base Layer

### Overview
Add the @tailwind base directive to globals.css to include Tailwind's base styles. The base layer provides CSS reset, normalize styles, and foundational HTML element styling.

### Dependencies
- Task 05: Create Global CSS File

### Instructions

1. **Open globals.css file**
   - Navigate to frontend/styles/globals.css
   - Open in code editor
   - File should be empty

2. **Add base layer directive**
   - Add the @tailwind base directive
   - This must be the first directive
   - Place at the top of the file

3. **Understand base layer purpose**
   - Provides CSS reset functionality
   - Normalizes browser default styles
   - Sets consistent HTML element styling
   - Foundation for all other styles

4. **Leave space for next layers**
   - Add blank line after directive
   - Prepare for component layer (Task 07)
   - Prepare for utilities layer (Task 08)

5. **Save file**
   - Save the changes
   - Verify directive syntax
   - Ensure no typos in @tailwind keyword

### Base Layer Contents

The @tailwind base directive includes:
- CSS reset (margin, padding removal)
- Normalize styles (cross-browser consistency)
- Default typography styles
- Form element resets
- Button resets

### Base Layer Purpose

| Component | Function |
|-----------|----------|
| Reset | Remove browser defaults |
| Normalize | Cross-browser consistency |
| Typography | Default font settings |
| Forms | Input/button resets |

### Expected Outcome
- globals.css contains @tailwind base directive
- Directive is first line in file
- Proper syntax with @ symbol
- Ready for component layer

### Verification Checklist
- [ ] globals.css opened successfully
- [ ] @tailwind base directive added
- [ ] Directive is on first line
- [ ] Correct syntax (@tailwind, not @import)
- [ ] No typos in "tailwind" or "base"
- [ ] Blank line added after directive
- [ ] File saved successfully

---

## Task 07: Configure Tailwind Components Layer

### Overview
Add the @tailwind components directive to globals.css to include Tailwind's component classes. This layer provides base component styles that can be overridden with utilities.

### Dependencies
- Task 06: Configure Tailwind Base Layer

### Instructions

1. **Open globals.css file**
   - File should contain @tailwind base directive
   - Position cursor after base layer

2. **Add components layer directive**
   - Add @tailwind components on new line
   - Should be second directive in file
   - Leave blank line before it for separation

3. **Understand components layer purpose**
   - Provides reusable component class patterns
   - Contains plugin-generated component styles
   - Can be extended with custom component classes
   - Sits between base and utilities layers

4. **Note components layer usage**
   - Used by Tailwind plugins (forms, typography)
   - Location for custom @layer components
   - Overrides base styles
   - Can be overridden by utility classes

5. **Leave space for utilities layer**
   - Add blank line after directive
   - Prepare for Task 08
   - Maintain clear layer separation

6. **Save file**
   - Save changes
   - Verify both directives present
   - Check correct order

### Components Layer Purpose

| Purpose | Description |
|---------|-------------|
| Component classes | Reusable class patterns |
| Plugin styles | Styles from Tailwind plugins |
| Custom components | Location for @layer components |
| Override capability | Can be overridden by utilities |

### Layer Hierarchy
```
@tailwind base       ← Task 06 (lowest specificity)
@tailwind components ← Task 07 (medium specificity)
@tailwind utilities  ← Task 08 (highest specificity)
```

### Expected Outcome
- globals.css contains both base and components directives
- Components directive is second in file
- Proper spacing between directives
- Ready for utilities layer

### Verification Checklist
- [ ] globals.css contains @tailwind base
- [ ] @tailwind components directive added
- [ ] Components is second directive
- [ ] Blank line between base and components
- [ ] Correct syntax (@tailwind components)
- [ ] No typos in keywords
- [ ] Both directives visible in file
- [ ] File saved successfully

---

## Task 08: Configure Tailwind Utilities Layer

### Overview
Add the @tailwind utilities directive to complete the three-layer CSS structure. The utilities layer includes all of Tailwind's utility classes and has the highest specificity for precise control.

### Dependencies
- Task 07: Configure Tailwind Components Layer

### Instructions

1. **Open globals.css file**
   - File should contain base and components directives
   - Position cursor after components layer

2. **Add utilities layer directive**
   - Add @tailwind utilities on new line
   - Should be third and final Tailwind directive
   - Leave blank line before it

3. **Understand utilities layer purpose**
   - Contains all Tailwind utility classes
   - Highest CSS specificity
   - Can override base and component styles
   - Core of utility-first approach

4. **Review complete three-layer structure**
   - Base layer: resets and defaults
   - Components layer: reusable patterns
   - Utilities layer: atomic classes
   - Proper cascade order established

5. **Consider custom styles section**
   - Optionally add comment for custom globals
   - Space for custom CSS below utilities
   - Keep separated from Tailwind directives

6. **Final file review**
   - Verify all three directives present
   - Check correct order
   - Ensure proper spacing
   - Save file

### Complete CSS Structure

The globals.css file should now contain:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Layer Specificity

| Layer | Specificity | Purpose | Override Capability |
|-------|-------------|---------|---------------------|
| Base | Lowest | Resets & defaults | Can be overridden by all |
| Components | Medium | Reusable patterns | Overrides base, not utilities |
| Utilities | Highest | Atomic classes | Overrides everything |

### CSS Processing Flow
```
globals.css → PostCSS → Tailwind Plugin → Generate Classes → Autoprefixer → Output CSS
```

### Expected Outcome
- Complete three-layer Tailwind structure
- All directives in correct order
- Foundation for design system complete
- Ready to import in Next.js layout

### Verification Checklist
- [ ] globals.css contains all three directives
- [ ] Order: base → components → utilities
- [ ] @tailwind utilities directive added correctly
- [ ] Proper spacing between all directives
- [ ] No syntax errors in any directive
- [ ] File structure clean and readable
- [ ] Ready for import in root layout
- [ ] File saved successfully

---

## Summary

This document completed the installation and basic configuration of Tailwind CSS:

### Completed Tasks
1. ✅ Installed Tailwind CSS, PostCSS, and Autoprefixer
2. ✅ Initialized tailwind.config.js
3. ✅ Configured content paths for file scanning
4. ✅ Created postcss.config.js configuration
5. ✅ Created styles/globals.css file
6. ✅ Added @tailwind base directive
7. ✅ Added @tailwind components directive
8. ✅ Added @tailwind utilities directive

### Files Created/Modified
- package.json (dependencies added)
- tailwind.config.js (created and configured)
- postcss.config.js (created)
- styles/globals.css (created with three layers)

### Next Steps
Proceed to [02_Tasks-09-14_Plugins-Verification.md](02_Tasks-09-14_Plugins-Verification.md) to import CSS in the root layout, install Tailwind plugins, and verify the installation.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25  
**Next Document:** [02_Tasks-09-14_Plugins-Verification.md](02_Tasks-09-14_Plugins-Verification.md)
