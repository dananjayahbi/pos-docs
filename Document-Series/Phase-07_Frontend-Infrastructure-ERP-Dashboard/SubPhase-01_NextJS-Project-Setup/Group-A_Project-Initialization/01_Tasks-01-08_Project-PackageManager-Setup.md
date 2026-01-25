# Tasks 01-08: Project and Package Manager Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** A - Project Initialization  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Git-Hooks-Documentation.md](02_Tasks-09-16_Git-Hooks-Documentation.md)

---

## Document Overview

This document covers the initialization of the Next.js 14+ project with TypeScript, configuration of pnpm as the package manager, setting up package.json metadata and scripts, installing core React and Next.js dependencies along with TypeScript tooling, and creating development environment configuration files (.nvmrc and .npmrc) for consistent Node.js version management and package resolution.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Next.js Project | Medium | 30 min |
| 02 | Configure Package Manager | Low | 10 min |
| 03 | Update package.json Metadata | Low | 15 min |
| 04 | Configure npm Scripts | Low | 20 min |
| 05 | Install Core Dependencies | Low | 15 min |
| 06 | Install TypeScript Dependencies | Low | 15 min |
| 07 | Create .nvmrc File | Low | 5 min |
| 08 | Create .npmrc Configuration | Low | 10 min |

---

## Task 01: Create Next.js Project

### Overview
Initialize a new Next.js 14+ application with TypeScript, ESLint, Tailwind CSS, and App Router architecture using create-next-app. This creates the foundation for the ERP dashboard frontend with modern React patterns and TypeScript type safety.

### Dependencies
- Node.js 20.x LTS installed on system
- pnpm package manager available globally
- Monorepo structure exists at project root

### Instructions

1. **Verify Node.js version**
   - Check that Node.js 20.x is installed
   - Use `node --version` to verify
   - Install or switch to Node.js 20.x if needed

2. **Navigate to project root**
   - Open terminal at monorepo root directory
   - Ensure you're at the correct location before creating frontend

3. **Run create-next-app with pnpm**
   - Execute create-next-app with specific flags
   - Name the project `frontend`
   - Enable TypeScript, ESLint, Tailwind CSS
   - Use App Router (not pages directory)
   - Disable src/ directory (keep app/ at root)
   - Set import alias to `@/*`

4. **Review created structure**
   - Verify `frontend/` directory created
   - Check for `app/` directory (App Router)
   - Confirm `tailwind.config.ts` exists
   - Verify `tsconfig.json` exists
   - Check `.eslintrc.json` created

5. **Verify initial files**
   - `package.json` with Next.js dependencies
   - `next.config.js` or `next.config.mjs` file
   - `postcss.config.js` for Tailwind
   - `app/layout.tsx` and `app/page.tsx`
   - `public/` directory for static assets

6. **Check default Next.js configuration**
   - Review next.config settings
   - Verify experimental features if any
   - Note any warnings during creation

### Initial Directory Structure
```
frontend/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   └── page.tsx              # Home page
├── public/
│   ├── next.svg
│   └── vercel.svg
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### Create-Next-App Flags Explained

| Flag | Value | Purpose |
|------|-------|---------|
| `--typescript` | N/A | Enable TypeScript support |
| `--eslint` | N/A | Include ESLint configuration |
| `--tailwind` | N/A | Install and configure Tailwind CSS |
| `--app` | N/A | Use App Router (not Pages Router) |
| `--src-dir=false` | false | Keep app/ at root (no src/) |
| `--import-alias` | `@/*` | Configure path alias for imports |

### App Router vs Pages Router

#### App Router (Selected)
- Modern Next.js 13+ architecture
- Server Components by default
- Nested layouts support
- Streaming and suspense built-in
- Better data fetching patterns
- File-based routing in `app/` directory

#### Pages Router (Not Used)
- Legacy Next.js architecture
- Client-side rendering default
- Limited layout support
- Traditional data fetching (getServerSideProps)
- File-based routing in `pages/` directory

### TypeScript Configuration
The generated `tsconfig.json` includes:
- Strict mode enabled for type safety
- Path aliases configured (`@/*`)
- JSX preservation for React
- Module resolution for Next.js
- Incremental compilation enabled

### Expected Outcome
- Next.js 14+ project created successfully
- TypeScript enabled and configured
- App Router architecture in place
- ESLint and Tailwind CSS set up
- Ready for development with hot reload

### Verification Checklist
- [ ] `frontend/` directory exists at root
- [ ] `app/` directory contains layout.tsx and page.tsx
- [ ] `package.json` includes Next.js 14.x or higher
- [ ] `tsconfig.json` configured with path aliases
- [ ] `.eslintrc.json` exists with Next.js rules
- [ ] `tailwind.config.ts` configured
- [ ] No errors during project creation

---

## Task 02: Configure Package Manager

### Overview
Configure pnpm as the preferred package manager for the frontend project. Set up package manager enforcement to prevent accidental use of npm or yarn, ensuring consistent dependency resolution and faster installations across the development team.

### Dependencies
- Task 01: Create Next.js Project

### Instructions

1. **Verify pnpm installation**
   - Check pnpm is available globally
   - Use `pnpm --version` to verify
   - Install pnpm globally if missing

2. **Navigate to frontend directory**
   - Change to `frontend/` directory
   - All subsequent commands run from here

3. **Remove existing lock files**
   - Delete `package-lock.json` if exists
   - Delete `yarn.lock` if exists
   - Keep only pnpm's lock file

4. **Install dependencies with pnpm**
   - Run pnpm install to generate `pnpm-lock.yaml`
   - This creates pnpm's lock file
   - Verifies all dependencies resolve correctly

5. **Add packageManager field to package.json**
   - Open `package.json`
   - Add "packageManager" field at top level
   - Specify pnpm version (e.g., "pnpm@8.15.0")
   - This enforces package manager version

6. **Configure package manager enforcement**
   - Add preinstall script to package.json
   - Script checks if pnpm is being used
   - Prevents npm/yarn usage with error message

7. **Test package manager enforcement**
   - Try running `npm install` (should fail)
   - Try running `yarn install` (should fail)
   - Verify `pnpm install` works correctly

### Package Manager Comparison

| Feature | pnpm | npm | yarn |
|---------|------|-----|------|
| Disk Space | Minimal (symlinks) | High | Medium |
| Installation Speed | Fastest | Slower | Fast |
| Monorepo Support | Excellent | Limited | Good |
| Workspace Protocol | Yes | Yes (v7+) | Yes |
| Security | High | Medium | High |

### pnpm Advantages for This Project

#### Disk Space Efficiency
- Uses content-addressable storage
- Symlinks to global store
- Saves GBs of disk space
- Shares packages across projects

#### Installation Speed
- Parallel dependency resolution
- Efficient network usage
- Caching optimizations
- Faster CI/CD builds

#### Strict Dependency Management
- Prevents phantom dependencies
- Only declared deps accessible
- No hoisting issues
- Better dependency tree

#### Monorepo Support
- Workspace protocol built-in
- Recursive scripts support
- Efficient workspace linking
- Better than npm workspaces

### Package Manager Enforcement Script
```
"preinstall": "npx only-allow pnpm"
```

This script:
- Runs before any package manager install
- Checks if pnpm is being used
- Exits with error if npm/yarn detected
- Displays helpful message to developer

### Expected Outcome
- pnpm configured as package manager
- `pnpm-lock.yaml` generated
- Package manager enforced via preinstall
- Consistent dependency management ensured

### Verification Checklist
- [ ] pnpm installed globally
- [ ] `pnpm-lock.yaml` exists in frontend/
- [ ] No `package-lock.json` or `yarn.lock`
- [ ] "packageManager" field in package.json
- [ ] Preinstall script prevents npm/yarn usage
- [ ] `pnpm install` completes successfully

---

## Task 03: Update package.json Metadata

### Overview
Update the package.json file with proper project metadata including name, version, description, author information, license, and repository details. This ensures the frontend package is properly identified and provides context for developers and tools.

### Dependencies
- Task 01: Create Next.js Project

### Instructions

1. **Open package.json file**
   - Navigate to `frontend/package.json`
   - Prepare to update metadata fields

2. **Update name field**
   - Set to "lankacommerce-erp-frontend"
   - Use lowercase, hyphen-separated format
   - Reflects monorepo organization

3. **Set version field**
   - Start with "0.1.0" for initial development
   - Follow semantic versioning (major.minor.patch)
   - Will increment as features are added

4. **Add description field**
   - Write clear, concise description
   - Example: "Next.js frontend for LankaCommerce Cloud ERP Dashboard"
   - Explains project purpose

5. **Add author information**
   - Include author name or organization
   - Optional: Add email and URL
   - Format: "Author Name <email@example.com>"

6. **Specify license**
   - Set appropriate license (e.g., "MIT", "UNLICENSED")
   - Use "UNLICENSED" for proprietary code
   - Matches backend license

7. **Add repository information**
   - Specify repository type (git)
   - Add repository URL
   - Include directory for monorepo context

8. **Add keywords array**
   - Include relevant search terms
   - Examples: "nextjs", "erp", "dashboard", "typescript"
   - Helps with package discovery

9. **Set private flag**
   - Add "private": true
   - Prevents accidental npm publish
   - Required for proprietary projects

### Metadata Fields Structure

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| name | string | Package identifier | Yes |
| version | string | Package version | Yes |
| description | string | Package purpose | No |
| author | string/object | Creator info | No |
| license | string | License type | No |
| repository | object | Source location | No |
| keywords | array | Search terms | No |
| private | boolean | Prevent publish | Recommended |

### Package.json Metadata Example
```
{
  "name": "lankacommerce-erp-frontend",
  "version": "0.1.0",
  "description": "Next.js frontend for LankaCommerce Cloud ERP Dashboard",
  "author": "LankaCommerce Team",
  "license": "UNLICENSED",
  "private": true,
  "repository": {
    "type": "git",
    "url": "https://github.com/yourorg/lankacommerce-cloud.git",
    "directory": "frontend"
  },
  "keywords": [
    "nextjs",
    "erp",
    "dashboard",
    "typescript",
    "react",
    "sri-lanka"
  ]
}
```

### Semantic Versioning Explained

| Version Component | Purpose | When to Increment |
|-------------------|---------|-------------------|
| Major (1.0.0) | Breaking changes | Incompatible API changes |
| Minor (0.1.0) | New features | Backward-compatible features |
| Patch (0.0.1) | Bug fixes | Backward-compatible fixes |

### Expected Outcome
- package.json has complete metadata
- Project properly identified
- Version tracking established
- Repository information linked
- Private flag prevents publishing

### Verification Checklist
- [ ] "name" field follows naming convention
- [ ] "version" set to "0.1.0"
- [ ] "description" clearly explains project
- [ ] "author" information added
- [ ] "license" field specified
- [ ] "repository" object configured
- [ ] "keywords" array populated
- [ ] "private": true set
- [ ] No JSON syntax errors

---

## Task 04: Configure npm Scripts

### Overview
Configure npm scripts in package.json to standardize development, build, and maintenance tasks. Add scripts for development server with Turbopack, production builds, code formatting with Prettier, type checking, and other essential frontend workflows.

### Dependencies
- Task 03: Update package.json Metadata

### Instructions

1. **Review default scripts**
   - Check existing scripts created by create-next-app
   - Note "dev", "build", "start", "lint" scripts
   - These are Next.js defaults

2. **Update dev script**
   - Enhance "dev" script to use Turbopack
   - Add flag `--turbo` for faster development
   - Turbopack is Next.js's faster bundler

3. **Keep build script**
   - Leave "build" script as-is
   - Runs `next build` for production
   - Creates optimized production build

4. **Keep start script**
   - Leave "start" script unchanged
   - Runs `next start` for production server
   - Serves the production build

5. **Enhance lint script**
   - Keep existing "lint" script
   - Runs ESLint on Next.js files
   - May add fix flag later

6. **Add format script**
   - Add "format" script for Prettier
   - Command: `prettier --write .`
   - Formats all files in project

7. **Add format:check script**
   - Add script to check formatting
   - Command: `prettier --check .`
   - Useful for CI/CD validation

8. **Add type-check script**
   - Add TypeScript validation script
   - Command: `tsc --noEmit`
   - Checks types without building

9. **Add clean script**
   - Add script to clean build artifacts
   - Removes `.next/` and `out/` directories
   - Useful for fresh builds

10. **Add script comments**
    - Consider adding script descriptions
    - Use JSON comment alternatives
    - Document script purposes

### Scripts Organization

| Script | Command | Purpose | When to Run |
|--------|---------|---------|-------------|
| dev | next dev --turbo | Start dev server | During development |
| build | next build | Production build | Before deployment |
| start | next start | Serve production | After build |
| lint | next lint | ESLint check | Before commit |
| format | prettier --write . | Format code | Before commit |
| format:check | prettier --check . | Check formatting | In CI/CD |
| type-check | tsc --noEmit | Validate types | Before commit/push |
| clean | rm -rf .next out | Clean artifacts | Fresh start |

### Script Dependencies Flow
```
Development Flow:
dev → type-check → lint → format
    ↓
  (code changes)
    ↓
format → lint → type-check → build

Production Flow:
clean → install → type-check → lint → build → start

CI/CD Flow:
install → type-check → lint → format:check → build → test
```

### Turbopack Benefits

#### Performance Improvements
- 700x faster updates than Webpack
- 10x faster cold starts
- Incremental bundling
- Rust-based for speed

#### Development Experience
- Faster hot module replacement
- Quicker initial page load
- Better error reporting
- Reduced CPU usage

#### Limitations (Current)
- Still in beta
- Some webpack plugins unsupported
- Limited custom configurations
- Use `next dev` if issues occur

### Type Checking Strategy

#### Development
- Run `type-check` before commits
- IDE integration shows errors in real-time
- Quick feedback loop

#### CI/CD
- Run `type-check` in pipeline
- Fail build on type errors
- Ensure type safety in production

### Expected Outcome
- Comprehensive npm scripts configured
- Development workflow streamlined
- Type checking and formatting integrated
- Scripts ready for CI/CD integration

### Verification Checklist
- [ ] "dev" script includes --turbo flag
- [ ] "build" script unchanged (next build)
- [ ] "start" script unchanged (next start)
- [ ] "lint" script exists
- [ ] "format" script added
- [ ] "format:check" script added
- [ ] "type-check" script added
- [ ] "clean" script added
- [ ] All scripts run without errors

---

## Task 05: Install Core Dependencies

### Overview
Install the core dependencies required for the Next.js application including React 18.x, React DOM, and Next.js framework itself. These are the fundamental libraries that power the frontend application and enable server-side rendering, routing, and component functionality.

### Dependencies
- Task 01: Create Next.js Project
- Task 02: Configure Package Manager

### Instructions

1. **Navigate to frontend directory**
   - Ensure you're in `frontend/` directory
   - All installations run from here

2. **Verify existing dependencies**
   - Check `package.json` dependencies section
   - Create-next-app already installed these
   - Verify versions are appropriate

3. **Review React version**
   - Check React version is 18.x or higher
   - React 18 enables Server Components
   - Required for Next.js App Router features

4. **Review React DOM version**
   - Ensure react-dom matches React version
   - Must be same major version as React
   - Handles browser rendering

5. **Review Next.js version**
   - Verify Next.js 14.x or higher installed
   - Check for latest stable version
   - Includes App Router features

6. **Update dependencies if needed**
   - If versions outdated, update package.json
   - Run `pnpm update` to upgrade
   - Test after updates

7. **Verify peer dependencies**
   - Check for peer dependency warnings
   - Resolve any conflicts
   - Ensure compatibility

8. **Test installation**
   - Run `pnpm install` to verify
   - Check for errors or warnings
   - Ensure lock file updated

### Core Dependencies Overview

| Package | Version | Purpose | Essential |
|---------|---------|---------|-----------|
| next | 14.x | Next.js framework | Yes |
| react | 18.x | React library | Yes |
| react-dom | 18.x | React browser rendering | Yes |

### Next.js 14 Features

#### Server Components
- React Server Components by default
- Reduced client JavaScript bundle
- Better performance
- Automatic code splitting

#### App Router
- File-based routing in app/
- Nested layouts support
- Loading and error states
- Streaming with Suspense

#### Turbopack
- Faster development bundler
- Incremental bundling
- Rust-based performance
- Better hot module replacement

#### Image Optimization
- Automatic image optimization
- WebP/AVIF support
- Lazy loading built-in
- Responsive images

#### Font Optimization
- next/font for custom fonts
- Zero layout shift
- Automatic subset optimization
- Self-hosted font support

### React 18 Features

#### Concurrent Rendering
- Non-blocking rendering
- Better user experience
- Automatic batching
- Transition API

#### Server Components
- Zero client JavaScript for static components
- Async components
- Direct database queries
- Better performance

#### Suspense Improvements
- Better async data handling
- Loading state management
- Streaming SSR
- Error boundaries

#### Automatic Batching
- Groups state updates
- Reduces re-renders
- Better performance
- Works in async code

### Dependency Version Compatibility

| Next.js | React | React DOM | Node.js |
|---------|-------|-----------|---------|
| 14.x | 18.2+ | 18.2+ | 18.17+ |
| 15.x | 18.2+ | 18.2+ | 20.0+ |

### Expected Outcome
- Core dependencies installed and verified
- React 18.x and Next.js 14.x confirmed
- No dependency conflicts
- Lock file updated with correct versions

### Verification Checklist
- [ ] React 18.x installed
- [ ] react-dom 18.x installed
- [ ] Next.js 14.x or higher installed
- [ ] All versions compatible
- [ ] No peer dependency warnings
- [ ] `pnpm-lock.yaml` updated
- [ ] `pnpm install` completes successfully

---

## Task 06: Install TypeScript Dependencies

### Overview
Install TypeScript and type definition packages required for Next.js and React development. These packages enable type checking, IntelliSense, and type safety throughout the frontend application, improving developer experience and code quality.

### Dependencies
- Task 05: Install Core Dependencies

### Instructions

1. **Verify TypeScript installed**
   - Check `package.json` devDependencies
   - Create-next-app includes TypeScript
   - Verify TypeScript 5.x installed

2. **Verify React type definitions**
   - Check for `@types/react` in devDependencies
   - Should match React version
   - Required for React TypeScript support

3. **Verify React DOM type definitions**
   - Check for `@types/react-dom` in devDependencies
   - Should match react-dom version
   - Provides DOM-specific types

4. **Verify Node.js type definitions**
   - Check for `@types/node` in devDependencies
   - Provides Node.js API types
   - Required for server-side code

5. **Install additional type packages if needed**
   - Add any missing type definitions
   - Use pnpm add -D for dev dependencies
   - Keep versions compatible

6. **Verify TypeScript configuration**
   - Check `tsconfig.json` exists
   - Review compiler options
   - Ensure strict mode enabled

7. **Test type checking**
   - Run `pnpm type-check` script
   - Verify no errors in default files
   - Check TypeScript compilation works

8. **Configure IDE integration**
   - Ensure VS Code or IDE detects types
   - Verify IntelliSense working
   - Check error highlighting functions

### TypeScript Dependencies

| Package | Version | Purpose | Type |
|---------|---------|---------|------|
| typescript | 5.x | TypeScript compiler | devDependency |
| @types/react | 18.x | React type definitions | devDependency |
| @types/react-dom | 18.x | React DOM type definitions | devDependency |
| @types/node | 20.x | Node.js API types | devDependency |

### TypeScript Configuration Highlights

#### Compiler Options
- **target:** ES2022 or later for modern features
- **lib:** Includes DOM, ES2022, DOM.Iterable
- **jsx:** preserve for Next.js handling
- **module:** ESNext for ES modules
- **moduleResolution:** bundler for Next.js

#### Strict Options
- **strict:** true (enables all strict checks)
- **noUncheckedIndexedAccess:** true (safer array access)
- **noImplicitAny:** true (explicit typing)
- **strictNullChecks:** true (null safety)

#### Path Resolution
- **baseUrl:** "."
- **paths:** { "@/*": ["./*"] }
- Enables clean imports with @ alias

#### Next.js Specific
- **incremental:** true (faster rebuilds)
- **esModuleInterop:** true (CommonJS compatibility)
- **resolveJsonModule:** true (import JSON)
- **isolatedModules:** true (per-file transpilation)

### TypeScript Benefits

#### Type Safety
- Catch errors at compile time
- Prevent runtime type errors
- Better refactoring support
- Self-documenting code

#### Developer Experience
- IntelliSense and autocomplete
- Parameter hints
- Type-based navigation
- Better IDE integration

#### Code Quality
- Enforced contracts
- Better interfaces
- Easier maintenance
- Team collaboration

### Type Definition Matching

| Package Version | Type Definition Version |
|----------------|-------------------------|
| react@18.2.0 | @types/react@18.2.x |
| react-dom@18.2.0 | @types/react-dom@18.2.x |
| Node.js 20.x | @types/node@20.x |

### Expected Outcome
- TypeScript and type definitions installed
- Type checking works correctly
- IDE provides IntelliSense
- No type errors in initial files

### Verification Checklist
- [ ] TypeScript 5.x installed
- [ ] @types/react installed (matches React version)
- [ ] @types/react-dom installed
- [ ] @types/node installed
- [ ] `tsconfig.json` configured correctly
- [ ] `pnpm type-check` passes
- [ ] IDE shows type hints
- [ ] No type errors in initial project

---

## Task 07: Create .nvmrc File

### Overview
Create an .nvmrc file to specify the Node.js version required for the frontend project. This ensures all developers and CI/CD environments use the same Node.js version, preventing version-related bugs and inconsistencies.

### Dependencies
- Task 01: Create Next.js Project

### Instructions

1. **Navigate to frontend directory**
   - Ensure you're in `frontend/` directory
   - Create .nvmrc at project root

2. **Create .nvmrc file**
   - Create new file named `.nvmrc`
   - Place at frontend/ root (next to package.json)

3. **Add Node.js version**
   - Add single line with version number
   - Use "20" for Node.js 20.x LTS
   - Can specify exact version (e.g., "20.11.0")

4. **Save file**
   - Ensure no extra whitespace
   - Use LF line endings (Unix style)
   - File should contain only version number

5. **Test with nvm**
   - If using nvm, test file works
   - Run `nvm use` in frontend directory
   - Should activate Node.js 20.x

6. **Document version requirement**
   - Note Node.js version in README
   - Explain nvm usage
   - Provide installation instructions

7. **Configure CI/CD to use .nvmrc**
   - Ensure CI reads .nvmrc
   - Set up-action for GitHub Actions
   - Configure pipeline to respect version

### .nvmrc Format

```
20
```

Or for specific version:
```
20.11.0
```

### Node Version Manager (nvm)

#### Purpose
- Manages multiple Node.js versions
- Switches between versions easily
- Project-specific version control
- Team consistency

#### Usage
```bash
# Install specific version
nvm install 20

# Use version from .nvmrc
nvm use

# Check current version
nvm current

# List installed versions
nvm list
```

#### Auto-switching
Some shells can auto-switch:
- Install nvm shell integration
- Automatically uses .nvmrc
- Switches when entering directory

### Why Node.js 20.x LTS

#### Long-Term Support
- LTS until April 2026
- Security updates guaranteed
- Production-ready stability
- Industry standard

#### Next.js Compatibility
- Next.js 14 requires Node.js 18.17+
- Node.js 20.x recommended
- Better performance
- Latest features

#### Performance Improvements
- Faster startup time
- Improved module loading
- Better memory management
- Enhanced V8 engine

### Version Specification Options

| Format | Example | Behavior |
|--------|---------|----------|
| Major only | 20 | Uses latest 20.x.x |
| Major.minor | 20.11 | Uses latest 20.11.x |
| Full version | 20.11.0 | Uses exact version |

### CI/CD Integration

#### GitHub Actions
```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: 'frontend/.nvmrc'
```

#### GitLab CI
```yaml
image: node:20
```

#### Docker
```dockerfile
FROM node:20-alpine
```

### Expected Outcome
- .nvmrc file created with Node.js 20
- Developers use consistent Node version
- CI/CD respects version requirement
- Version conflicts prevented

### Verification Checklist
- [ ] .nvmrc file created in frontend/
- [ ] File contains "20" or specific version
- [ ] No extra whitespace in file
- [ ] `nvm use` recognizes version
- [ ] Node.js 20.x activates correctly
- [ ] README documents Node.js requirement

---

## Task 08: Create .npmrc Configuration

### Overview
Create an .npmrc configuration file to customize npm and pnpm behavior for the frontend project. Configure settings for peer dependency handling, package resolution strategy, and other package manager behaviors to ensure consistent and predictable dependency management.

### Dependencies
- Task 02: Configure Package Manager

### Instructions

1. **Navigate to frontend directory**
   - Ensure you're in `frontend/` directory
   - Create .npmrc at project root

2. **Create .npmrc file**
   - Create new file named `.npmrc`
   - Place at frontend/ root
   - Will configure pnpm behavior

3. **Configure peer dependency auto-install**
   - Add `auto-install-peers=true`
   - Automatically installs peer dependencies
   - Reduces manual dependency management

4. **Configure strict peer dependencies**
   - Add `strict-peer-dependencies=false`
   - Allows version flexibility
   - Prevents install failures on minor mismatches

5. **Configure engine-strict**
   - Add `engine-strict=true`
   - Enforces Node.js version from package.json
   - Works with .nvmrc

6. **Configure save-exact**
   - Consider `save-exact=false`
   - Allows semver ranges in dependencies
   - Enables automatic minor updates

7. **Add registry configuration (optional)**
   - Configure npm registry if using private
   - Set registry URL
   - Add authentication if needed

8. **Add comments**
   - Use # for comments in .npmrc
   - Document each configuration
   - Explain rationale

### .npmrc Configuration

```
# Automatically install peer dependencies
auto-install-peers=true

# Don't fail on peer dependency warnings
strict-peer-dependencies=false

# Enforce Node.js version requirement
engine-strict=true

# Use semver ranges for flexibility
save-exact=false

# Faster installs with shallow clones
prefer-offline=true
```

### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| auto-install-peers | true | Auto-install peer deps |
| strict-peer-dependencies | false | Allow minor version mismatches |
| engine-strict | true | Enforce Node.js version |
| save-exact | false | Allow version ranges |
| prefer-offline | true | Use cache when possible |

### Peer Dependencies Handling

#### auto-install-peers=true
- Automatically installs missing peer deps
- Reduces manual installation steps
- Prevents peer dependency errors
- Convenient for development

#### strict-peer-dependencies=false
- Allows minor version mismatches
- Prevents install failures
- More flexible dependency resolution
- Useful for Next.js ecosystem

### Version Pinning Strategy

#### save-exact=false (Recommended)
- Allows semver ranges (^, ~)
- Enables automatic patch updates
- Balances stability and updates
- Standard for most projects

#### save-exact=true (Alternative)
- Pins exact versions
- Maximum predictability
- Requires manual updates
- Used in critical applications

### pnpm-Specific Options

```
# Symlink node_modules structure
shamefully-hoist=false

# Use shared node_modules
shared-workspace-lockfile=true

# Recursive installation
recursive-install=true
```

### Registry Configuration

#### Public npm Registry (Default)
```
registry=https://registry.npmjs.org/
```

#### Private Registry
```
registry=https://npm.company.com/
//npm.company.com/:_authToken=${NPM_TOKEN}
```

#### Scoped Packages
```
@company:registry=https://npm.company.com/
```

### Cache and Performance

```
# Use network cache
prefer-offline=true

# Verify cache integrity
verify-store-integrity=true

# Side effects cache
side-effects-cache=true

# Faster module resolution
modules-cache-max-age=7200
```

### Expected Outcome
- .npmrc configured with recommended settings
- Peer dependencies handled automatically
- Package resolution optimized
- Consistent behavior across team

### Verification Checklist
- [ ] .npmrc file created in frontend/
- [ ] auto-install-peers set to true
- [ ] strict-peer-dependencies set to false
- [ ] engine-strict configured
- [ ] save-exact configured
- [ ] Comments added for clarity
- [ ] `pnpm install` respects settings
- [ ] No peer dependency warnings

---

## Summary

This document covered the initial setup of the Next.js 14+ project with TypeScript, package manager configuration, metadata setup, script configuration, core dependency installation, TypeScript tooling, and environment configuration files.

### Key Achievements
- Next.js 14+ project created with App Router
- pnpm configured as package manager
- package.json metadata completed
- npm scripts optimized for workflow
- Core React and Next.js dependencies installed
- TypeScript and type definitions configured
- .nvmrc ensures Node.js 20.x consistency
- .npmrc optimizes package management

### Next Steps
Proceed to [02_Tasks-09-16_Git-Hooks-Documentation.md](02_Tasks-09-16_Git-Hooks-Documentation.md) to:
- Initialize Git for frontend
- Create frontend-specific .gitignore and .gitattributes
- Set up Husky for Git hooks
- Configure lint-staged and commitlint
- Create frontend README.md
- Verify complete setup
