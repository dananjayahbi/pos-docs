# Tasks 09-13: Next.js Installation & Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** B - Next.js Project Creation  
> **Document:** 01 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-A_Node-Environment-Setup/02_Tasks-05-08_Package-Config.md](../Group-A_Node-Environment-Setup/02_Tasks-05-08_Package-Config.md)
- **→ Next Document:** [02_Tasks-14-18_App-Router-Setup.md](02_Tasks-14-18_App-Router-Setup.md)

---

## Document Overview

This document covers installing Next.js 14+ and React 18+, creating the Next.js configuration file, and configuring image domains and experimental features.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Install Next.js | Simple |
| 10 | Install React & React DOM | Simple |
| 11 | Create next.config.js | Medium |
| 12 | Configure Image Domains | Simple |
| 13 | Configure Experimental Features | Simple |

---

## Task 09: Install Next.js

### Overview
Install Next.js 14+ as the React framework for the frontend application.

### Dependencies
- Task 05: Initialize package.json (Group A)

### Instructions

1. **Navigate to frontend directory**
   - `cd frontend`

2. **Install Next.js**
   - Run `pnpm add next`

3. **Verify installation**
   - Check package.json dependencies

4. **Note version**
   - Ensure 14.x or higher

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | >=14.0.0 | React framework |

### Next.js 14 Features

| Feature | Description |
|---------|-------------|
| App Router | File-based routing in app/ |
| Server Components | Default server rendering |
| Server Actions | Form handling without API |
| Turbopack | Fast development bundler |
| Partial Prerendering | Hybrid static/dynamic |

### Installation Command

```bash
pnpm add next@latest
```

### Expected Outcome
- Next.js 14+ installed
- Added to dependencies

### Verification Checklist
- [ ] Next.js in package.json
- [ ] Version 14.x or higher
- [ ] pnpm-lock.yaml updated

---

## Task 10: Install React & React DOM

### Overview
Install React 18+ and ReactDOM as peer dependencies for Next.js.

### Dependencies
- Task 09: Install Next.js

### Instructions

1. **Install React packages**
   - Run `pnpm add react react-dom`

2. **Install type definitions**
   - Run `pnpm add -D @types/react @types/react-dom`

3. **Verify versions**
   - React 18.x required for Next.js 14

### Package Information

| Package | Version | Type |
|---------|---------|------|
| `react` | >=18.2.0 | Dependency |
| `react-dom` | >=18.2.0 | Dependency |
| `@types/react` | >=18.2.0 | Dev Dependency |
| `@types/react-dom` | >=18.2.0 | Dev Dependency |

### React 18 Features

| Feature | Description |
|---------|-------------|
| Concurrent | Concurrent rendering |
| Suspense | Async component loading |
| Server Components | Server-side React |
| Transitions | Non-blocking updates |
| useId | Unique ID generation |

### Installation Commands

```bash
pnpm add react react-dom
pnpm add -D @types/react @types/react-dom
```

### Expected Outcome
- React 18+ installed
- Type definitions available

### Verification Checklist
- [ ] react in dependencies
- [ ] react-dom in dependencies
- [ ] @types/react in devDependencies
- [ ] @types/react-dom in devDependencies

---

## Task 11: Create next.config.js

### Overview
Create the Next.js configuration file with essential settings for the project.

### Dependencies
- Task 09: Install Next.js

### Instructions

1. **Create next.config.js**
   - Create in frontend root
   - Use ES module syntax

2. **Configure basic options**
   - reactStrictMode
   - poweredByHeader
   - output

3. **Add TypeScript settings**
   - ignoreBuildErrors for development

4. **Add ESLint settings**
   - ignoreDuringBuilds option

### File Location

```
frontend/
├── next.config.js
└── package.json
```

### Configuration Structure

| Section | Purpose |
|---------|---------|
| `reactStrictMode` | Enable React strict mode |
| `poweredByHeader` | Hide X-Powered-By header |
| `output` | Build output type |
| `images` | Image optimization |
| `experimental` | Experimental features |

### Basic Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `reactStrictMode` | true | Development checks |
| `poweredByHeader` | false | Security |
| `output` | 'standalone' | Docker optimization |

### TypeScript Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `ignoreBuildErrors` | false | Strict type checking |

### ESLint Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `ignoreDuringBuilds` | false | Lint on build |

### Expected Outcome
- next.config.js created
- Basic settings configured

### Verification Checklist
- [ ] next.config.js exists
- [ ] reactStrictMode enabled
- [ ] poweredByHeader disabled
- [ ] output set to standalone

---

## Task 12: Configure Image Domains

### Overview
Configure allowed image domains for Next.js Image component optimization.

### Dependencies
- Task 11: Create next.config.js

### Instructions

1. **Open next.config.js**
   - Navigate to images section

2. **Add remotePatterns**
   - Configure allowed domains
   - Set protocol and hostname

3. **Configure domains for**
   - Local development
   - Production CDN
   - Third-party services

### Images Configuration

| Property | Purpose |
|----------|---------|
| `remotePatterns` | Allowed remote image sources |
| `domains` | Legacy domain allowlist |
| `formats` | Supported image formats |
| `deviceSizes` | Responsive breakpoints |

### Remote Patterns

Add patterns for:

| Domain | Purpose |
|--------|---------|
| `localhost` | Development |
| `*.lankacommerce.lk` | Production |
| `cdn.lankacommerce.lk` | CDN |
| `storage.googleapis.com` | Cloud storage |
| `res.cloudinary.com` | Cloudinary CDN |

### Pattern Structure

| Field | Example |
|-------|---------|
| `protocol` | 'https' |
| `hostname` | '*.lankacommerce.lk' |
| `port` | '' (empty for default) |
| `pathname` | '/images/**' |

### Image Formats

| Format | Support |
|--------|---------|
| AVIF | Enable for modern browsers |
| WebP | Default fallback |

### Expected Outcome
- Image domains configured
- CDN patterns allowed

### Verification Checklist
- [ ] remotePatterns configured
- [ ] Localhost allowed
- [ ] Production domains added
- [ ] CDN patterns included

---

## Task 13: Configure Experimental Features

### Overview
Enable experimental Next.js features for enhanced functionality.

### Dependencies
- Task 11: Create next.config.js

### Instructions

1. **Open next.config.js**
   - Navigate to experimental section

2. **Configure server actions**
   - Enable for form handling

3. **Configure other features**
   - instrumentationHook
   - serverComponentsExternalPackages

4. **Note stability**
   - Some features may graduate to stable

### Experimental Configuration

| Feature | Value | Purpose |
|---------|-------|---------|
| `serverActions` | true | Form handling (stable in 14) |
| `instrumentationHook` | true | Monitoring setup |
| `typedRoutes` | true | Type-safe links |

### Server Actions (Now Stable)

In Next.js 14+, Server Actions are stable:
- Remove from experimental
- Use directly in server components

### External Packages

Configure packages that need Node.js runtime:

| Package | Reason |
|---------|--------|
| `bcryptjs` | Node.js crypto |
| `sharp` | Image processing |

### Turbopack (Optional)

For development speed:
- Use `--turbo` flag in dev command
- Significantly faster HMR

### PPR (Partial Prerendering)

| Setting | Value | Purpose |
|---------|-------|---------|
| `ppr` | false | Hybrid rendering (experimental) |

### Expected Outcome
- Experimental features enabled
- Project ready for advanced features

### Verification Checklist
- [ ] Server actions configured
- [ ] External packages listed
- [ ] instrumentationHook enabled

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Install Next.js | Framework installed |
| 10 | Install React & React DOM | React 18+ ready |
| 11 | Create next.config.js | Configuration file |
| 12 | Configure Image Domains | CDN optimization |
| 13 | Configure Experimental Features | Advanced features |

### Dependencies Added

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

### next.config.js Summary

| Section | Key Settings |
|---------|--------------|
| Basic | reactStrictMode, output |
| Images | remotePatterns, formats |
| Experimental | serverActions, typedRoutes |

### Next Steps
Proceed to [02_Tasks-14-18_App-Router-Setup.md](02_Tasks-14-18_App-Router-Setup.md) for App Router structure.

---

## Notes for AI Agents

1. **Version:** Ensure Next.js 14+ for App Router
2. **React:** Must match Next.js peer requirements
3. **Standalone:** Output mode for Docker
4. **Server Actions:** Stable in Next.js 14
5. **Git:** Do NOT commit yet - complete all Group B tasks first
