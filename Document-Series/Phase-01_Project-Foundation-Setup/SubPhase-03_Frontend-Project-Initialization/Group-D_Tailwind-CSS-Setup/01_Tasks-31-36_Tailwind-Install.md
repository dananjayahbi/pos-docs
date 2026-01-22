# Tasks 31-36: Tailwind Installation & Colors

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** D - Tailwind CSS Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-C_TypeScript-Configuration/02_Tasks-25-30_Module-Types.md](../Group-C_TypeScript-Configuration/02_Tasks-25-30_Module-Types.md)
- **→ Next Document:** [02_Tasks-37-41_Theme-Config.md](02_Tasks-37-41_Theme-Config.md)

---

## Document Overview

This document covers installing Tailwind CSS with PostCSS and Autoprefixer, creating the configuration file, and setting up the color palette.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Install Tailwind CSS | Simple |
| 32 | Install PostCSS | Simple |
| 33 | Install Autoprefixer | Simple |
| 34 | Create tailwind.config.ts | Medium |
| 35 | Configure Content Paths | Simple |
| 36 | Configure Theme - Colors | Medium |

---

## Task 31: Install Tailwind CSS

### Overview
Install Tailwind CSS as a development dependency.

### Dependencies
- Task 09: Install Next.js (Group B)

### Instructions

1. **Install Tailwind CSS**
   - Run `pnpm add -D tailwindcss`

2. **Verify version**
   - Ensure version 3.x

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `tailwindcss` | >=3.4.0 | Dev Dependency |

### Tailwind 3.x Features

| Feature | Description |
|---------|-------------|
| JIT | Just-in-Time compilation |
| Arbitrary values | Use any value `text-[17px]` |
| First-party plugins | Typography, Forms, etc. |
| Container queries | Responsive containers |

### Installation Command

```bash
pnpm add -D tailwindcss@latest
```

### Expected Outcome
- Tailwind CSS installed
- Ready for configuration

### Verification Checklist
- [ ] tailwindcss in devDependencies
- [ ] Version 3.x confirmed

---

## Task 32: Install PostCSS

### Overview
Install PostCSS as Tailwind's processing engine.

### Dependencies
- Task 31: Install Tailwind CSS

### Instructions

1. **Install PostCSS**
   - Run `pnpm add -D postcss`

2. **Verify installation**
   - Check package.json

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `postcss` | >=8.4.0 | Dev Dependency |

### PostCSS Role

| Function | Description |
|----------|-------------|
| Transform | Process CSS with plugins |
| Optimize | Minify and optimize |
| Extend | Add future CSS features |

### Installation Command

```bash
pnpm add -D postcss@latest
```

### Expected Outcome
- PostCSS installed
- Plugin system ready

### Verification Checklist
- [ ] postcss in devDependencies
- [ ] Version 8.x confirmed

---

## Task 33: Install Autoprefixer

### Overview
Install Autoprefixer for automatic vendor prefixes.

### Dependencies
- Task 32: Install PostCSS

### Instructions

1. **Install Autoprefixer**
   - Run `pnpm add -D autoprefixer`

2. **Verify installation**
   - Check package.json

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `autoprefixer` | >=10.4.0 | Dev Dependency |

### Autoprefixer Function

| Function | Example |
|----------|---------|
| Flexbox | -webkit-flex |
| Grid | -ms-grid |
| Transforms | -webkit-transform |

### Combined Installation

Install all at once:
```bash
pnpm add -D tailwindcss postcss autoprefixer
```

### Expected Outcome
- Autoprefixer installed
- Browser compatibility ready

### Verification Checklist
- [ ] autoprefixer in devDependencies
- [ ] Version 10.x confirmed

---

## Task 34: Create tailwind.config.ts

### Overview
Create the Tailwind configuration file with TypeScript support.

### Dependencies
- Task 31: Install Tailwind CSS

### Instructions

1. **Create tailwind.config.ts**
   - Create in frontend root
   - Use TypeScript config

2. **Add basic structure**
   - content array
   - theme object
   - plugins array

3. **Import type helper**
   - Use Config type from tailwindcss

### File Location

```
frontend/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### Config Structure

| Section | Purpose |
|---------|---------|
| `content` | Files to scan |
| `theme` | Design tokens |
| `plugins` | Tailwind plugins |
| `darkMode` | Dark mode config |

### TypeScript Config

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
```

### Why TypeScript Config

| Benefit | Description |
|---------|-------------|
| Type checking | Catch config errors |
| Autocomplete | IDE suggestions |
| Refactoring | Safe changes |

### Expected Outcome
- TypeScript config created
- Ready for customization

### Verification Checklist
- [ ] tailwind.config.ts exists
- [ ] Config type imported
- [ ] Basic structure in place

---

## Task 35: Configure Content Paths

### Overview
Configure which files Tailwind should scan for class names.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Add content paths**
   - Include all source directories

2. **Use glob patterns**
   - Match all relevant files

3. **Include component libraries**
   - Add node_modules patterns if needed

### Content Paths

| Path | Purpose |
|------|---------|
| `./app/**/*.{js,ts,jsx,tsx,mdx}` | App Router pages |
| `./components/**/*.{js,ts,jsx,tsx}` | Components |
| `./lib/**/*.{js,ts,jsx,tsx}` | Utilities |
| `./stories/**/*.{js,ts,jsx,tsx}` | Storybook |

### Full Content Array

```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### External Libraries

For UI libraries (e.g., shadcn/ui):
```typescript
'./node_modules/@radix-ui/**/*.{js,ts,jsx,tsx}'
```

### Expected Outcome
- All source files scanned
- Classes extracted correctly

### Verification Checklist
- [ ] App directory included
- [ ] Components included
- [ ] All extensions covered

---

## Task 36: Configure Theme - Colors

### Overview
Configure the color palette with brand colors and semantic colors.

### Dependencies
- Task 34: Create tailwind.config.ts

### Instructions

1. **Define brand colors**
   - Primary brand colors
   - Secondary accent colors

2. **Define semantic colors**
   - Success, error, warning, info

3. **Extend default colors**
   - Use theme.extend.colors

4. **Add color scales**
   - 50-950 shade range

### Color Categories

| Category | Purpose |
|----------|---------|
| Primary | Brand identity |
| Secondary | Accents |
| Neutral | Grays, backgrounds |
| Semantic | Status indicators |

### LankaCommerce Brand Colors

| Color | Hex | Use |
|-------|-----|-----|
| Primary | #0066CC | Brand blue |
| Secondary | #00A86B | Accent green |
| Accent | #FFB800 | Highlights |

### Color Scale Pattern

| Shade | Purpose |
|-------|---------|
| 50 | Lightest background |
| 100-300 | Light variants |
| 400-600 | Main shades |
| 700-900 | Dark variants |
| 950 | Darkest |

### Semantic Colors

| Color | Use |
|-------|-----|
| Success | Green - positive actions |
| Warning | Amber - caution |
| Error | Red - errors, danger |
| Info | Blue - information |

### Sri Lanka Context

Consider colors for:
- Currency displays (LKR)
- Status badges
- Tenant branding flexibility

### Expected Outcome
- Full color palette defined
- Brand consistency established

### Verification Checklist
- [ ] Primary colors defined
- [ ] Secondary colors defined
- [ ] Semantic colors added
- [ ] Color scales complete

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Install Tailwind CSS | CSS framework |
| 32 | Install PostCSS | Processing engine |
| 33 | Install Autoprefixer | Vendor prefixes |
| 34 | Create tailwind.config.ts | Config file |
| 35 | Configure Content Paths | File scanning |
| 36 | Configure Theme - Colors | Color palette |

### Dependencies Added

```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### tailwind.config.ts (Partial)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* shades */ },
        secondary: { /* shades */ },
      },
    },
  },
  plugins: [],
}

export default config
```

### Next Steps
Proceed to [02_Tasks-37-41_Theme-Config.md](02_Tasks-37-41_Theme-Config.md) for fonts, spacing, and dark mode.

---

## Notes for AI Agents

1. **TypeScript Config:** Use .ts extension
2. **Content Paths:** Include all source directories
3. **Color Scales:** Use 50-950 pattern
4. **Extend Theme:** Don't replace defaults
5. **Git:** Do NOT commit yet - complete all Group D tasks first
